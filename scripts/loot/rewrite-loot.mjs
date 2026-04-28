// Loot rewriter: applies setting/theme/mechanics fixes across the loot compendium.
//
// Usage:
//   node scripts/loot/rewrite-loot.mjs [target]
//   target ∈ { items, base, parts, artifacts, sigils, tattoos, runes, all } (default: all)
//
// Behavior per file:
// - items-base-equipment.ts:  PATCH (image, lore boilerplate, theme tags)
// - items-part1.ts:           PATCH (image, lore boilerplate, theme tags)
// - items-part2..9.ts:        FULL ARCHETYPE REBUILD (preserve id/name/rarity/weight/value)
// - artifacts.ts:             PATCH (image when empty, lore boilerplate, flavor)
// - sigils.ts:                regex theme patches (text scrubber)
// - tattoos.ts:               regex lore patches (boilerplate scrubber)
// - runes/*.ts:               image patch only (replace placeholder with deterministic)
//
// Wiring: items flow through `items-index.ts` -> `staticDataProvider.transformItem`
// -> `listCanonicalEntries` -> AddEquipmentDialog / treasureGenerator / Compendium.tsx.
// All field shapes are preserved per the existing `Item` interface in items.ts.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
	assignImage,
	classifyArchetype,
	generateDescription,
	generateDiscoveryLore,
	generateFlavor,
	generateLore,
	getTemplate,
	isIntentionalImage,
	scrubText,
	scrubThemeTags,
	TERMINOLOGY_FIXES,
} from "./lib.mjs";
import { rebuildItem as rebuildItemEngine } from "./rebuild.mjs";
import { serializeArrayBody } from "./serializer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..", "..");
const COMPENDIUM_DIR = join(ROOT, "src", "data", "compendium");

const target = (process.argv[2] || "all").toLowerCase();

// =============================================================
// File-text parser
// =============================================================
//
// Each items-part*.ts has the shape:
//   import type { Item } from "./items";
//   export const items_partN: Item[] = [ ... ];
//
// We extract the array literal as text, replace `: Item[]` annotations and any
// `as const` casts, then evaluate via the Function constructor in a sandboxed scope.

function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	if (!m) {
		throw new Error(`Could not extract array literal for ${exportName} in ${filePath}`);
	}
	const literal = m[1];
	// JS object literals do not allow trailing commas in the same way TS does in some configs,
	// but we preserve them by simply evaluating with `Function`.
	let arr;
	try {
		arr = Function(`"use strict"; return (${literal});`)();
	} catch (err) {
		throw new Error(`Failed to parse ${exportName}: ${err.message}`);
	}
	return { text, literal, arr, header: text.slice(0, m.index), tail: text.slice(m.index + m[0].length) };
}

function writeItemArrayFile(filePath, exportName, items, originalHeader = null) {
	const header = originalHeader || `import type { Item } from "./items";\n\n`;
	const body = serializeArrayBody(items, 1);
	const out = `${header.replace(/\n+$/, "\n")}\nexport const ${exportName}: Item[] = [\n${body},\n];\n`;
	writeFileSync(filePath, out, "utf8");
}

// =============================================================
// Patch operations
// =============================================================

const BOILERPLATE_LORE_KEYS = {
	current_owner: ["Held by the Vanguard Guild."],
	personality: ["Silent, waiting."],
	prior_owners: [["A rogue Awakened"]],
};

const BOILERPLATE_FLAVOR_PATTERNS = [
	/^Mirrors the chains of mortality\..*$/,
	/^Eclipses the .* of .*\..*$/,
	/^Shatters the .* of .*\..*$/,
	/^Sanctifies the .* of .*\..*$/,
	/^Annihilates the .* of .*\..*$/,
	/^Corrodes the .* of .*\..*$/,
	/^Reclaims the .* of .*\..*$/,
	/^Devours the .* of .*\..*$/,
	/^Condemns the .* of .*\..*$/,
	/^A masterpiece of destructive intent\.$/,
	/.*A beautiful catastrophe measured in milliseconds\.$/,
	/.*The reason S-Rank Gates are feared\.$/,
	/.*The death of hesitation, made manifest\.$/,
	/.*The line between Hunter and monster\.$/,
	/.*The final equation in a war without end\.$/,
	/.*The breaking point of all resistance\.$/,
	/.*The last thing many anomalies ever see\.$/,
];

const BOILERPLATE_DESC_PATTERNS = [
	/^A weapon forged from gate anomaly materials\. Radiates a faint, deadly hum\.$/,
	/^A popular item among hunters venturing into E to C rank gates\.$/,
	/^Modern tactical armor laced with mana-reactive alloys for enhanced protection\.$/,
	/^Modern light armor laced with mana-reactive alloys for enhanced protection\.$/,
	/^A standard sidearm blade for Hunters who prefer steel to firearms\.$/,
	/^A balanced blade with a fuller groove that channels excess kinetic mana\.$/,
];

const BOILERPLATE_PASSIVE_PATTERNS = [
	/^\+1 to attack rolls against beasts\.$/,
	/^Restores 2d4 \+ 2 HP or Mana\.$/,
];

function isBoilerplateFlavor(s) {
	if (typeof s !== "string") return false;
	return BOILERPLATE_FLAVOR_PATTERNS.some((re) => re.test(s));
}

function isBoilerplateDescription(s) {
	if (typeof s !== "string") return false;
	return BOILERPLATE_DESC_PATTERNS.some((re) => re.test(s));
}

function isBoilerplatePassive(s) {
	if (typeof s !== "string") return false;
	return BOILERPLATE_PASSIVE_PATTERNS.some((re) => re.test(s));
}

function patchLore(item, file) {
	const lore = item.lore && typeof item.lore === "object" ? { ...item.lore } : null;
	if (!lore) return item;

	// Wipe boilerplate fields - regenerate them themed by name+id.
	if (typeof lore.current_owner === "string" && BOILERPLATE_LORE_KEYS.current_owner.includes(lore.current_owner)) {
		lore.current_owner = "";
	}
	if (typeof lore.personality === "string" && BOILERPLATE_LORE_KEYS.personality.includes(lore.personality)) {
		lore.personality = "";
	}
	if (
		Array.isArray(lore.prior_owners) &&
		lore.prior_owners.length === 1 &&
		typeof lore.prior_owners[0] === "string" &&
		BOILERPLATE_LORE_KEYS.prior_owners[0].includes(lore.prior_owners[0])
	) {
		lore.prior_owners = [];
	}
	// Scrub stale sovereignty/monarch terms inside lore strings.
	for (const k of Object.keys(lore)) {
		if (typeof lore[k] === "string") lore[k] = scrubText(lore[k]);
		if (Array.isArray(lore[k])) lore[k] = lore[k].map((x) => (typeof x === "string" ? scrubText(x) : x));
	}
	// Also regenerate origin/history if they look templated and identical to the wide pool.
	const themed = generateLore(item.name, item.id);
	if (typeof lore.origin === "string" && lore.origin.trim() === "") {
		lore.origin = themed.origin;
	}
	if (typeof lore.history === "string" && lore.history.trim() === "") {
		lore.history = themed.history;
	}
	return { ...item, lore };
}

function patchImage(item, file) {
	const cur = item.image;
	if (!cur || cur === "" || (typeof cur === "string" && cur.startsWith("/generated/items/"))) {
		// Replace placeholder/empty with deterministic image-pool slot.
		return { ...item, image: assignImage(file, item.id, item.name) };
	}
	if (isIntentionalImage(cur)) return item; // hand-picked, leave it
	// Other paths: keep but allow scrubbing later if needed.
	return item;
}

function patchTextFields(item) {
	const out = { ...item };
	if (typeof out.name === "string") out.name = scrubText(out.name);
	if (typeof out.display_name === "string") out.display_name = scrubText(out.display_name);
	if (typeof out.description === "string") out.description = scrubText(out.description);
	if (typeof out.flavor === "string") out.flavor = scrubText(out.flavor);
	if (typeof out.discovery_lore === "string") out.discovery_lore = scrubText(out.discovery_lore);
	if (Array.isArray(out.tags)) out.tags = scrubThemeTags(out.tags);
	else if (out.tags == null) delete out.tags;
	if (Array.isArray(out.theme_tags)) out.theme_tags = scrubThemeTags(out.theme_tags);
	else if (out.theme_tags == null) delete out.theme_tags;
	// Scrub any nested string fields in the entire item (e.g., effect descriptions).
	deepScrubText(out);
	return out;
}

function deepScrubText(obj) {
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			if (typeof obj[i] === "string") obj[i] = scrubText(obj[i]);
			else if (obj[i] && typeof obj[i] === "object") deepScrubText(obj[i]);
		}
	} else if (obj && typeof obj === "object") {
		for (const k of Object.keys(obj)) {
			const v = obj[k];
			if (typeof v === "string") obj[k] = scrubText(v);
			else if (v && typeof v === "object") deepScrubText(v);
		}
	}
}

function patchBoilerplateFlavor(item, file) {
	if (isBoilerplateFlavor(item.flavor)) {
		const archetype = classifyArchetype(item.name, item.type);
		return { ...item, flavor: generateFlavor(archetype, item.name, item.id) };
	}
	return item;
}

function patchBoilerplateDiscovery(item, file) {
	if (typeof item.discovery_lore === "string" && item.discovery_lore.length > 0) {
		// Heuristic: if it's one of the obvious boilerplate strings, regenerate.
		const stale = [
			/^Excavated from the crystallized mana deposit at the center of a depleted Gate core\.$/,
			/^Found in a hidden compartment of a relic weapon that had been in Guild storage for years\.$/,
			/^Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs\.$/,
			/^Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room\.$/,
			/^Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete\.$/,
			/^Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating\.$/,
			/^Gifted by the Order itself as a reward for completing a hidden quest chain\.$/,
		];
		if (stale.some((re) => re.test(item.discovery_lore))) {
			return { ...item, discovery_lore: generateDiscoveryLore(item.name, item.id) };
		}
	}
	return item;
}

// =============================================================
// Full archetype rebuild (parts 2-9)
// =============================================================

function rebuildItem(item, file) {
	// Delegates to the variation-aware engine in rebuild.mjs.
	return rebuildItemEngine(item, file);
}

// =============================================================
// Targets
// =============================================================

function processPatchFile(fileName, exportName) {
	const filePath = join(COMPENDIUM_DIR, fileName);
	const { arr, header } = parseItemArrayFile(filePath, exportName);
	const out = arr.map((raw) => {
		let it = patchTextFields(raw);
		it = patchLore(it, fileName);
		it = patchImage(it, fileName);
		it = patchBoilerplateFlavor(it, fileName);
		it = patchBoilerplateDiscovery(it, fileName);
		return it;
	});
	writeItemArrayFile(filePath, exportName, out, header);
	return out.length;
}

function processRebuildFile(fileName, exportName) {
	const filePath = join(COMPENDIUM_DIR, fileName);
	const { arr, header } = parseItemArrayFile(filePath, exportName);
	const out = arr.map((raw) => rebuildItem(raw, fileName));
	writeItemArrayFile(filePath, exportName, out, header);
	return out.length;
}

function processArtifacts() {
	const filePath = join(COMPENDIUM_DIR, "artifacts.ts");
	const { arr, header } = parseItemArrayFile(filePath, "artifacts");
	const out = arr.map((raw) => {
		let it = patchTextFields(raw);
		it = patchLore(it, "artifacts.ts");
		// Always reassign image for artifacts (most have image: "").
		if (!it.image || it.image === "" || !isIntentionalImage(it.image)) {
			it = { ...it, image: assignImage("artifacts.ts", it.id, it.name, "artifact") };
		}
		it = patchBoilerplateFlavor(it, "artifacts.ts");
		// Stamp display_name if missing for legendary entries.
		if (!it.display_name) it.display_name = it.name;
		return it;
	});
	writeItemArrayFile(filePath, "artifacts", out, header);
	return out.length;
}

// Sigil & tattoo & relics files use different shapes; do regex-based scrubbing
// in-place using the centralized TERMINOLOGY_FIXES + universal boilerplate-lore
// blank-outs.

const BOILERPLATE_LORE_BLANKERS = [
	[/current_owner:\s*"Held by the Vanguard Guild\."/g, 'current_owner: ""'],
	[/personality:\s*"Silent, waiting\."/g, 'personality: ""'],
	[/prior_owners:\s*\["A rogue Awakened"\]/g, "prior_owners: []"],
	[/curse:\s*"Slowly drains ambient stamina from the wielder\."/g, 'curse: ""'],
];

function applyTextScrub(filePath, extraReplacements = []) {
	let text = readFileSync(filePath, "utf8");
	for (const [re, rep] of TERMINOLOGY_FIXES) text = text.replace(re, rep);
	for (const [re, rep] of BOILERPLATE_LORE_BLANKERS) text = text.replace(re, rep);
	for (const [re, rep] of extraReplacements) text = text.replace(re, rep);
	writeFileSync(filePath, text, "utf8");
	return text.length;
}

function processSigilsTextScrub() {
	return applyTextScrub(join(COMPENDIUM_DIR, "sigils.ts"));
}

function processTattoosTextScrub() {
	return applyTextScrub(join(COMPENDIUM_DIR, "tattoos.ts"));
}

function processRelicsTextScrub() {
	return applyTextScrub(join(COMPENDIUM_DIR, "relics-comprehensive.ts"));
}

function processRunesImagePatch() {
	const runesDir = join(COMPENDIUM_DIR, "runes");
	const fileNames = [
		"power-powers.ts",
		"spell-rank-a.ts",
		"spell-rank-b.ts",
		"spell-rank-c.ts",
		"spell-rank-d.ts",
		"spell-rank-s.ts",
		"technique-techniques.ts",
	];
	let totalReplaced = 0;
	for (const fn of fileNames) {
		const filePath = join(runesDir, fn);
		let text = readFileSync(filePath, "utf8");
		// Find every entry; for each, find its id and replace its image.
		const entryRe = /\{\s*\bid:\s*"([^"]+)"[\s\S]*?\bimage:\s*"([^"]*)"/g;
		text = text.replace(entryRe, (match, id, oldImage) => {
			if (isIntentionalImage(oldImage)) return match;
			const newImage = assignImage(`runes/${fn}`, id, id, "rune");
			totalReplaced += 1;
			return match.replace(`image: "${oldImage}"`, `image: "${newImage}"`);
		});
		writeFileSync(filePath, text, "utf8");
	}
	return totalReplaced;
}

// =============================================================
// Driver
// =============================================================

const TARGETS = {
	base: () => processPatchFile("items-base-equipment.ts", "baseEquipment"),
	part1: () => processPatchFile("items-part1.ts", "items_part1"),
	parts: () => {
		let total = 0;
		for (let n = 2; n <= 9; n++) {
			const fn = `items-part${n}.ts`;
			const exportName = `items_part${n}`;
			total += processRebuildFile(fn, exportName);
			console.log(`✔ rebuilt ${fn}`);
		}
		return total;
	},
	artifacts: () => processArtifacts(),
	sigils: () => processSigilsTextScrub(),
	tattoos: () => processTattoosTextScrub(),
	relics: () => processRelicsTextScrub(),
	runes: () => processRunesImagePatch(),
};

async function main() {
	const want = (t) => target === "all" || target === t;
	const summary = {};
	if (want("base")) {
		summary.base = TARGETS.base();
		console.log(`✔ items-base-equipment.ts patched (${summary.base} entries)`);
	}
	if (want("part1") || want("items")) {
		summary.part1 = TARGETS.part1();
		console.log(`✔ items-part1.ts patched (${summary.part1} entries)`);
	}
	if (want("parts") || want("items")) {
		summary.parts = TARGETS.parts();
		console.log(`✔ items-part2-9.ts rebuilt (${summary.parts} entries total)`);
	}
	if (want("artifacts")) {
		summary.artifacts = TARGETS.artifacts();
		console.log(`✔ artifacts.ts patched (${summary.artifacts} entries)`);
	}
	if (want("sigils")) {
		summary.sigils = TARGETS.sigils();
		console.log(`✔ sigils.ts text-scrubbed (${summary.sigils} bytes written)`);
	}
	if (want("tattoos")) {
		summary.tattoos = TARGETS.tattoos();
		console.log(`✔ tattoos.ts text-scrubbed (${summary.tattoos} bytes written)`);
	}
	if (want("relics")) {
		summary.relics = TARGETS.relics();
		console.log(`✔ relics-comprehensive.ts text-scrubbed (${summary.relics} bytes written)`);
	}
	if (want("runes")) {
		summary.runes = TARGETS.runes();
		console.log(`✔ runes/* image-patched (${summary.runes} entries)`);
	}
	console.log("\nDone.", JSON.stringify(summary));
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
