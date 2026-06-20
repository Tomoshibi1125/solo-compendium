#!/usr/bin/env node
/**
 * audit-assets.mjs
 *
 * Walks static compendium data and runtime asset manifests, verifies local
 * asset paths, enriches image records with metadata and lore-aware replacement
 * guidance, then writes audit reports and SDXL prompt packs.
 *
 * Run:  node scripts/audit-assets.mjs
 * Outputs:
 *   audit/assets-report.json
 *   audit/SUMMARY.md
 *   docs/rift-image-replacement-plan.md
 *   docs/generated-image-review.html
 *   docs/generated-image-review.md
 *   data/rift-image-replacement-plan.json
 *   data/rift-image-prompts.json
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const DATA_DIR = join(ROOT, "src", "data", "compendium");
const AUDIT_DIR = join(ROOT, "audit");
const DOCS_DIR = join(ROOT, "docs");
const PLAN_DATA_DIR = join(ROOT, "data");
const BASELINE_FILE = join(AUDIT_DIR, "asset-baseline.json");
const UPDATE_BASELINE = process.argv.includes("--update-baseline");

const DEFAULT_CHECKPOINT = "stabilityai/stable-diffusion-xl-base-1.0";
const OPTIONAL_REFINER = "stabilityai/stable-diffusion-xl-refiner-1.0";
const DEFAULT_SAMPLER = "DPM++ 2M Karras";
const DEFAULT_SCHEDULER = "Karras";

const CASE_INSENSITIVE_FS = process.platform === "win32";
const IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".ogg", ".wav", ".m4a"]);

async function writeTextFileWithRetry(file, content, encoding = "utf8") {
	const delays = [75, 150, 300, 600, 1000, 1500];
	let lastError = null;
	for (const delay of [0, ...delays]) {
		if (delay > 0) await new Promise((resolveDelay) => setTimeout(resolveDelay, delay));
		try {
			await writeFile(file, content, encoding);
			return;
		} catch (error) {
			lastError = error;
			if (!["UNKNOWN", "EBUSY", "EPERM", "EACCES"].includes(error?.code)) {
				throw error;
			}
		}
	}
	throw lastError;
}

const WORLD_LORE_FILE = "docs/rift-ascendant-world-lore.md";

const RIFT_ASCENDANT_ART_STYLE =
	"high-detail tabletop fantasy RPG key art, Korean action webtoon-inspired dark fantasy rendering, dynamic composition, crisp ink-like edges, painterly realism, cinematic contrast, dramatic rim lighting, polished game illustration, black deep blue violet silver palette with rift-white highlights, original design, high readability for app card UI";

const RIFT_EQUIPMENT_ART_STYLE =
	"polished tabletop RPG inventory art, Korean action webtoon-inspired dark fantasy rendering, painterly realism, crisp ink-like edges, cinematic rim lighting, black deep blue violet silver palette with rift-white highlights, original design, high readability for app card UI";

const IP_SAFETY_NEGATIVE =
	"direct imitation of a named franchise, copyrighted character, official logo, trademarked symbol, celebrity likeness";

const NEGATIVE_PROMPTS = {
	character:
		"placeholder image, stock photo, generic fantasy armor, medieval-only costume, unrelated sci-fi, spaceship, cyberpunk overload, chibi, childish cartoon, real celebrity likeness, copyrighted character, multiple people, group shot, distant figures, landscape-only image, creature as main subject, wrong age, wrong gender, bad anatomy, bad hands, extra fingers, missing fingers, distorted face, blurry, low resolution, text, watermark, logo, signature, jpeg artifacts, cropped head, overexposed, flat lighting, overly sexualized",
	anomaly:
		"landscape-only image, empty environment, generic dragon, generic zombie, unrelated sci-fi alien, rubber monster suit, joke creature, cute mascot, chibi, stock monster, muddy silhouette, too many limbs unless lore requires it, bad anatomy, blurry, low resolution, text, watermark, logo, cropped body, overexposed",
	monster:
		"landscape-only image, empty environment, unrelated sci-fi alien, rubber monster suit, joke creature, cute mascot, chibi, muddy silhouette, bad anatomy, blurry, low resolution, text, watermark, logo, cropped body, overexposed",
	regent:
		"empty throne room, empty architecture, landscape-only image, generic demon lord, generic vampire, huge kaiju only, cartoon villain, random armor, unrelated crown, childish monster, stock fantasy, messy silhouette, low resolution, text, watermark, logo, celebrity likeness, copyrighted character",
	token:
		"landscape-only image, empty map, UI icon only, cropped face, tiny distant subject, muddy silhouette, unreadable token, blurry, low resolution, text, watermark, logo",
	location:
		"generic fantasy tavern, generic castle unless lore requires it, spaceship, unrelated cyberpunk city, empty stock landscape, tourist photo, too cluttered for UI, unreadable composition, blurry, low resolution, text, watermark, logo, signature",
	item:
		"person, people, humanoid, owner, adventurer, warrior, hands, person holding object, gun, rifle, firearm, weapon, armor, helmet, character portrait, human face, open case, visible contents, loose tools, accessories, baked letters, caption, multiple objects, many variants, product sheet, parts sheet, exploded view, multiple camera angles, living creature, animal, monster, bird wings, tree, plant, roots, landscape-only image, generic sword, generic potion, random jewelry, stock icon, cluttered background, unreadable small details, bad perspective, blurry, low resolution, text, watermark, logo",
	map:
		"character portrait, single creature, single item, empty cinematic landscape, low-angle hero shot, unreadable layout, extreme perspective, heavy fog hiding layout, text, labels, watermark, logo, blurry, low resolution",
	weapon:
		"multiple weapons, duplicate weapon, secondary weapons, many variants, multiple guns, duplicate gun, three guns, multiple spearheads, spearhead collection, weapon head collection, product sheet, design sheet, parts sheet, exploded view, orthographic views, multiple camera angles, comparison sheet, collage, parchment page, diagram, labels, text block, circular emblems, side icons, unrelated orbs, generic sword unless the subject is a sword, generic gun unless the subject is a firearm, random jewelry, character holding the weapon, hands, full character portrait, cluttered background, unreadable silhouette, bad perspective, blurry, low resolution, text, watermark, logo",
	armor:
		"person wearing armor, humanoid body, full character portrait, human model, mannequin, mannequin face focus, human model face, multiple armor variants, product sheet, design sheet, orthographic views, front side back views, comparison sheet, full costume sheet, generic fantasy armor, medieval-only costume, weapon-only image, random jewelry, cluttered background, unreadable silhouette, bad perspective, blurry, low resolution, text, watermark, logo",
	vehicle:
		"empty road, landscape-only image, unrelated sci-fi spaceship, cyberpunk overload, medieval cart unless lore requires it, tiny distant vehicle, cluttered street, unreadable silhouette, blurry, low resolution, text, watermark, logo",
	mount:
		"empty landscape, rider-focused portrait, saddle-only image, generic horse unless lore requires it, cute mascot, chibi, stock animal photo, muddy silhouette, bad anatomy, blurry, low resolution, text, watermark, logo",
	power:
		"messy particles, unreadable effect, generic fireball unless lore requires it, tiny details, clutter, character face unless needed, text, watermark, logo, blurry, low resolution",
};

const TYPE_ALIASES = {
	relic: "item",
	spell: "power",
	technique: "power",
	background: "location",
	faction: "location",
	UI: "power",
};

const ARMOR_TERMS = [
	"armor",
	"armour",
	"boots",
	"chestplate",
	"breastplate",
	"combat boots",
	"helmet",
	"helm",
	"helms",
	"gauntlet",
	"gauntlets",
	"glove",
	"gloves",
	"boot",
	"cloak",
	"robe",
	"shield",
	"mail",
	"plate",
	"vest",
	"bracer",
	"pauldron",
	"spaulder",
	"greave",
	"headgear",
	"headpiece",
	"aegis",
];

const WEAPON_TERMS = [
	"axe",
	"blade",
	"blowgun",
	"bow",
	"carbine",
	"club",
	"crossbow",
	"dagger",
	"dart",
	"firearm",
	"glaive",
	"greataxe",
	"greatsword",
	"gun",
	"hammer",
	"halberd",
	"javelin",
	"katana",
	"knife",
	"knuckles",
	"kusarigama",
	"launcher",
	"longbow",
	"longsword",
	"mace",
	"maul",
	"pistol",
	"polearm",
	"quarterstaff",
	"rapier",
	"revolver",
	"rifle",
	"saber",
	"scythe",
	"scattergun",
	"shortsword",
	"shortbow",
	"sickle",
	"sidearm",
	"sling",
	"smg",
	"spear",
	"staff",
	"staves",
	"shotgun",
	"submachine gun",
	"sword",
	"wand",
	"warhammer",
	"whip",
];

const VEHICLE_TERMS = [
	"ambulance",
	"apc",
	"airship",
	"balloon",
	"boat",
	"bus",
	"car",
	"carriage",
	"cart",
	"copter",
	"cutter",
	"drone",
	"helicopter",
	"hauler",
	"motorcycle",
	"plane",
	"raft",
	"recon",
	"sedan",
	"ship",
	"skiff",
	"suv",
	"truck",
	"van",
	"vehicle",
	"vessel",
];

const MOUNT_TERMS = [
	"mount",
	"riding horse",
	"warhorse",
	"war horse",
	"draft horse",
	"mule",
	"steed",
	"camel",
	"mastiff",
	"falcon",
	"greyhound",
];

const CREATURE_TERMS = [
	"angel",
	"beast",
	"cherub",
	"construct",
	"demon",
	"elemental",
	"golem",
	"guardian",
	"monster",
	"phoenix",
	"serpent",
	"titan",
	"wraith",
];

const ANOMALY_TERMS = [
	"aberration",
	"abyssal",
	"anomaly",
	"beast",
	"boar",
	"chimera",
	"demon",
	"devourer",
	"dragon",
	"entity",
	"horror",
	"hound",
	"lurker",
	"monster",
	"nightmare",
	"predator",
	"revenant",
	"serpent",
	"shadow",
	"stalker",
	"tentacle",
	"titan",
	"void",
	"wolf",
	"wraith",
	"wyrm",
	"wyrmling",
];

const LOCATION_TERMS = [
	"arena",
	"castle",
	"city",
	"clock tower",
	"dungeon",
	"forest",
	"gate",
	"hospital",
	"mountain",
	"portal",
	"realm",
	"road",
	"ruin",
	"sanctum",
	"temple",
	"tower",
];

function hasTerm(haystack, terms) {
	return terms.some((term) => {
		const suffix = /[a-z0-9]$/i.test(term) && !/s$/i.test(term) ? "s?" : "";
		return new RegExp(
			`(^|[^a-z0-9])${escapeRegex(term)}${suffix}([^a-z0-9]|$)`,
			"i",
		).test(haystack);
	});
}

function escapeRegex(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readAllDataSources() {
	const files = [];
	function walk(dir) {
		for (const entry of readdirSync(dir)) {
			const p = join(dir, entry);
			const stat = statSync(p);
			if (stat.isDirectory()) {
				walk(p);
			} else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
				files.push(p);
			}
		}
	}
	walk(DATA_DIR);
	return files;
}

function existingFiles(paths) {
	return paths.filter((p) => existsSync(p));
}

function normalizeRelPath(file) {
	return file.replace(`${ROOT}\\`, "").replace(`${ROOT}/`, "");
}

function lineNumberAt(source, index) {
	let line = 1;
	for (let i = 0; i < index; i += 1) {
		if (source.charCodeAt(i) === 10) line += 1;
	}
	return line;
}

function isConcreteAssetPath(path) {
	return !path.includes("${");
}

function inferFieldName(source, index) {
	const lineStart = source.lastIndexOf("\n", index) + 1;
	const lineEnd = source.indexOf("\n", index);
	const line = source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd);
	const match = line.match(/([A-Za-z0-9_]+)\s*:\s*["'`]/);
	return match?.[1] ?? "unknown";
}

function lastFieldValue(slice, field) {
	const re = new RegExp(
		`(?:^|[^A-Za-z0-9_])${field}\\s*:\\s*(["'])([\\s\\S]*?)\\1`,
		"g",
	);
	let match;
	let last = null;
	while ((match = re.exec(slice)) !== null) {
		last = match[2];
	}
	return last;
}

function firstFieldValue(slice, field) {
	const re = new RegExp(
		`(?:^|[^A-Za-z0-9_])${field}\\s*:\\s*(["'])([\\s\\S]*?)\\1`,
	);
	return slice.match(re)?.[2] ?? null;
}

function enclosingObjectSlice(source, index) {
	let depth = 0;
	let start = -1;
	for (let i = index; i >= 0; i -= 1) {
		const char = source[i];
		if (char === "}") {
			depth += 1;
		} else if (char === "{") {
			if (depth === 0) {
				start = i;
				break;
			}
			depth -= 1;
		}
	}
	if (start === -1) return null;
	depth = 0;
	for (let i = start; i < source.length; i += 1) {
		const char = source[i];
		if (char === "{") depth += 1;
		if (char === "}") {
			depth -= 1;
			if (depth === 0) return source.slice(start, i + 1);
		}
	}
	return source.slice(start);
}

function firstUsefulText(slice) {
	const fields = [
		"description",
		"backstory",
		"flavor",
		"personality",
		"motivation",
		"questHook",
		"lore",
		"theme",
		"tags",
	];
	const values = [];
	for (const field of fields) {
		const value = lastFieldValue(slice, field);
		if (value) values.push(value);
	}
	return compactText(values.join(" "), 260);
}

function inferSubject(source, index, path) {
	const before = source.slice(Math.max(0, index - 5000), index);
	const after = source.slice(index, Math.min(source.length, index + 1500));
	const window = `${before}${after}`;
	const object = enclosingObjectSlice(source, index);

	if (window.includes("SHADOW_REGENT_TOKEN_IMAGE_URL")) return "The Quiet";
	if (window.includes("SHADOW_SOLDIER_TOKEN_IMAGE_URL")) return "Worn Mimic";

	const objectName = object ? firstFieldValue(object, "name") : null;
	if (objectName) return objectName;
	const objectTitle = object ? firstFieldValue(object, "title") : null;
	if (objectTitle) return objectTitle;
	const objectId = object ? firstFieldValue(object, "id") : null;
	if (objectId) return titleCase(slugToWords(objectId));

	const name = lastFieldValue(before, "name") || lastFieldValue(after, "name");
	if (name) return name;
	const title = lastFieldValue(before, "title") || lastFieldValue(after, "title");
	if (title) return title;
	const id = lastFieldValue(before, "id") || lastFieldValue(after, "id");
	if (id) return titleCase(slugToWords(id));

	return titleCase(slugToWords(basename(path, extname(path))));
}

function inferRecordIdentity(source, index, path) {
	const before = source.slice(Math.max(0, index - 5000), index);
	const after = source.slice(index, Math.min(source.length, index + 1500));
	const window = `${before}${after}`;
	const object = enclosingObjectSlice(source, index);
	if (window.includes("SHADOW_REGENT_TOKEN_IMAGE_URL")) {
		return { recordId: "the-quiet", recordName: "The Quiet" };
	}
	if (window.includes("SHADOW_SOLDIER_TOKEN_IMAGE_URL")) {
		return { recordId: "worn-mimic", recordName: "Worn Mimic" };
	}
	const subject = inferSubject(source, index, path);
	if (lastFieldValue(before, "source_name") === "Rift Ascendant Canon") {
		const pantheonId = firstFieldValue(after, "id");
		const pantheonName = firstFieldValue(after, "name");
		if (pantheonId || pantheonName) {
			return {
				recordId: pantheonId ? slugify(pantheonId) : slugify(pantheonName),
				recordName: cleanSubjectName(
					pantheonName || titleCase(slugToWords(pantheonId)),
					subject,
				),
			};
		}
	}
	const objectId = object ? firstFieldValue(object, "id") : null;
	const objectName = object ? firstFieldValue(object, "name") : null;
	const objectTitle = object ? firstFieldValue(object, "title") : null;
	if (objectId || objectName || objectTitle) {
		const name = objectName || objectTitle || titleCase(slugToWords(objectId));
		return {
			recordId: objectId ? slugify(objectId) : slugify(name),
			recordName: cleanSubjectName(name, subject),
		};
	}
	const recordId = lastFieldValue(before, "id") || lastFieldValue(after, "id");
	const recordName =
		lastFieldValue(before, "name") ||
		lastFieldValue(after, "name") ||
		lastFieldValue(before, "title") ||
		lastFieldValue(after, "title") ||
		subject;
	return {
		recordId: recordId ? slugify(recordId) : null,
		recordName: cleanSubjectName(recordName, subject),
	};
}

function extractPathMatches(source) {
	const matches = [];
	const re =
		/(["'`])(\/(?:generated|audio|images)\/[^"'`\\]+\.(?:webp|png|jpg|jpeg|svg|mp3|ogg|wav|m4a))\1/gi;
	let match;
	while ((match = re.exec(source)) !== null) {
		if (!isConcreteAssetPath(match[2])) continue;
		const identity = inferRecordIdentity(source, match.index, match[2]);
		matches.push({
			path: match[2],
			index: match.index,
			line: lineNumberAt(source, match.index),
			field: inferFieldName(source, match.index),
			subject: identity.recordName || inferSubject(source, match.index, match[2]),
			recordId: identity.recordId,
			recordName: identity.recordName,
			context: firstUsefulText(
				source.slice(Math.max(0, match.index - 5000), match.index + 1500),
			),
		});
	}
	return matches;
}

function extractSandboxSceneAssetMatches(source) {
	const matches = [];
	const mapRe =
		/name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+\.(?:png|webp|jpg|jpeg|svg))"/g;
	let match;
	while ((match = mapRe.exec(source)) !== null) {
		const path = `/generated/compendium/sandbox_assets/${match[2]}`;
		matches.push({
			path,
			index: match.index,
			line: lineNumberAt(source, match.index),
			field: "backgroundImage",
			subject: match[1],
			recordId: slugify(match[1]),
			recordName: cleanSubjectName(match[1], match[1]),
			context: "Run Silent sandbox scene background map.",
		});
	}
	return matches;
}

function fileExists(relPath) {
	const abs = join(PUBLIC_DIR, relPath.replace(/^\//, ""));
	if (!existsSync(abs)) {
		return { abs, exists: false, casingMismatch: false };
	}
	if (!CASE_INSENSITIVE_FS) {
		return { abs, exists: true, casingMismatch: false };
	}
	const parts = relPath.replace(/^\//, "").split("/");
	let cursor = PUBLIC_DIR;
	for (const part of parts) {
		try {
			const entries = readdirSync(cursor);
			if (!entries.includes(part)) {
				return { abs, exists: true, casingMismatch: true };
			}
			cursor = join(cursor, part);
		} catch {
			return { abs, exists: true, casingMismatch: true };
		}
	}
	return { abs, exists: true, casingMismatch: false };
}

function categorise(p) {
	if (p.startsWith("/images/")) return "image-static";
	if (p.startsWith("/audio/sfx/")) return "audio-sfx";
	if (p.startsWith("/audio/ambient/")) return "audio-ambient";
	if (p.startsWith("/audio/music/")) return "audio-music";
	if (p.startsWith("/audio/")) return "audio-other";
	if (p.startsWith("/generated/compendium/anomalies/")) return "image-anomaly";
	if (p.startsWith("/generated/compendium/monsters/")) return "image-monster";
	if (p.startsWith("/generated/compendium/regents/")) return "image-regent";
	if (p.startsWith("/generated/compendium/Regents/"))
		return "image-regent-BADCASE";
	if (p.startsWith("/generated/compendium/spells/")) return "image-spell";
	if (p.startsWith("/generated/compendium/items/")) return "image-item";
	if (p.startsWith("/generated/compendium/locations/")) return "image-location";
	if (p.startsWith("/generated/compendium/artifacts/")) return "image-artifact";
	if (p.startsWith("/generated/compendium/relics/")) return "image-relic";
	if (p.startsWith("/generated/compendium/backgrounds/"))
		return "image-background";
	if (p.startsWith("/generated/compendium/characters/"))
		return "image-character";
	if (p.startsWith("/generated/compendium/jobs/")) return "image-job";
	if (p.startsWith("/generated/compendium/runes/")) return "image-rune";
	if (p.startsWith("/generated/compendium/techniques/"))
		return "image-technique";
	if (p.startsWith("/generated/compendium/powers/")) return "image-power";
	if (p.startsWith("/generated/compendium/sandbox_npcs/"))
		return "image-character";
	if (p.startsWith("/generated/compendium/sandbox_assets/"))
		return IMAGE_EXTENSIONS.has(extname(p).toLowerCase())
			? "image-map"
			: "audio-ambient";
	if (p.startsWith("/generated/compendium/")) return "image-other-compendium";
	if (p.startsWith("/generated/maps/")) return "image-map";
	if (p.startsWith("/generated/tokens/")) return "image-token";
	if (p.startsWith("/generated/props/")) return "image-prop";
	if (p.startsWith("/generated/effects/")) return "image-effect";
	if (p.startsWith("/generated/conditions/")) return "image-condition";
	if (p.startsWith("/generated/weapons/")) return "image-weapon";
	if (p.startsWith("/generated/armor/")) return "image-armor";
	if (p.startsWith("/generated/creatures/")) return "image-monster";
	if (p.startsWith("/generated/buildings/")) return "image-location";
	if (p.startsWith("/generated/environments/")) return "image-background";
	if (p.startsWith("/generated/vehicles/")) return "image-vehicle";
	if (p.startsWith("/generated/mounts/")) return "image-mount";
	if (p.startsWith("/generated/items/")) return "image-item";
	if (p.startsWith("/generated/magical/")) return "image-magical";
	if (p.startsWith("/generated/mechanical/")) return "image-mechanical";
	if (p.startsWith("/generated/npcs/")) return "image-character";
	if (p.startsWith("/generated/shadow/")) return "image-shadow";
	if (p.startsWith("/generated/runes/")) return "image-power";
	if (p.startsWith("/generated/spells/")) return "image-spell";
	if (p.startsWith("/generated/cosmic/")) return "image-background";
	if (p.startsWith("/generated/divine/")) return "image-power";
	if (p.startsWith("/generated/elementals/")) return "image-power";
	return "other";
}

function sourceCategoryForFile(relFile) {
	const file = relFile.replace(/\\/g, "/").toLowerCase();
	if (file.includes("/anomalies/")) return "anomaly";
	if (file.includes("/spells/")) return "spell";
	if (file.includes("/sandbox/")) return "sandbox";
	if (file.includes("vehicles.ts")) return "vehicle-mount";
	if (file.includes("items")) return "item";
	if (file.includes("artifacts")) return "artifact";
	if (file.includes("relics")) return "relic";
	if (file.includes("locations")) return "location";
	if (file.includes("background")) return "background";
	if (file.includes("jobs")) return "job";
	if (file.includes("regent")) return "regent";
	if (file.includes("technique")) return "technique";
	if (file.includes("sigils")) return "sigil";
	if (file.includes("tattoos")) return "tattoo";
	if (file.includes("pantheon")) return "pantheon";
	if (file.includes("vttassetmanifest")) return "vtt-manifest";
	if (file.includes("vttassetlibrary")) return "vtt-library";
	if (file.includes("premademaps")) return "map";
	if (file.includes("tokens")) return "token";
	return "compendium";
}

function sourceRecordKeyForRef(ref) {
	const subject = cleanSubjectName(ref.subject, ref.recordName ?? "asset");
	const id = ref.recordId || slugify(ref.recordName || subject) || `line-${ref.line}`;
	return `${ref.file}#${id}`;
}

function isAnomalyPlaceholderPool(p) {
	return /^\/generated\/compendium\/anomalies\/anomaly-\d{4}\.webp$/i.test(p);
}

function isGenericImageName(p) {
	const name = basename(p).toLowerCase();
	return (
		/^anomaly-\d{4}\./.test(name) ||
		/^monster-\d{4}\./.test(name) ||
		/^item-\d{4}\./.test(name) ||
		/(placeholder|temp|sample|fallback|default)/.test(name)
	);
}

function isImagePath(p) {
	return IMAGE_EXTENSIONS.has(extname(p).toLowerCase());
}

function isAudioPath(p) {
	return AUDIO_EXTENSIONS.has(extname(p).toLowerCase());
}

function assetTypeFor(path, category, refs) {
	const sourceText = refs.map((r) => r.file).join(" ");
	const haystack = [
		path,
		category,
		...refs.map(
			(r) =>
				`${r.file} ${r.field} ${r.subject} ${r.recordId ?? ""} ${r.recordName ?? ""} ${r.sourceCategory ?? ""} ${r.context}`,
		),
	]
		.join(" ")
		.toLowerCase();
	if (haystack.includes("the quiet") || haystack.includes("worn mimic")) {
		return "anomaly";
	}
	if (sourceText.includes("pantheon.ts")) return "regent";
	if (sourceText.includes("regentPortraits.ts")) return "regent";
	if (path.includes("/sandbox_npcs/")) return "character";
	if (category.includes("character") || category.includes("npc")) return "character";
	if (path.includes("/tokens/")) return "token";
	if (category.includes("mount")) return "mount";
	if (category.includes("vehicle")) return "vehicle";
	if (category.includes("weapon")) return "weapon";
	if (category.includes("armor")) return "armor";
	if (category.includes("anomaly")) return "anomaly";
	if (category.includes("monster")) return "monster";
	if (category.includes("regent")) return "regent";
	if (category.includes("artifact") || category.includes("relic")) return "relic";
	if (category.includes("spell")) return "spell";
	if (category.includes("power")) {
		if (hasTerm(haystack, CREATURE_TERMS)) return "monster";
		return "power";
	}
	if (category.includes("technique")) return "technique";
	if (category.includes("location")) return "location";
	if (category.includes("map")) return "map";
	if (category.includes("background")) return "background";
	if (category.includes("condition") || category.includes("effect"))
		return "power";
	if (category.includes("job")) return "character";
	if (category.includes("static")) return "UI";
	if (category.includes("shadow")) {
		if (hasTerm(haystack, WEAPON_TERMS)) return "weapon";
		if (hasTerm(haystack, ARMOR_TERMS)) return "armor";
		if (hasTerm(haystack, LOCATION_TERMS)) return "location";
		return "anomaly";
	}
	if (category.includes("magical")) {
		if (hasTerm(haystack, WEAPON_TERMS)) return "weapon";
		if (hasTerm(haystack, ARMOR_TERMS)) return "armor";
		if (hasTerm(haystack, ["rune circle", "circle", "sigil"])) return "power";
		return "item";
	}
	if (category.includes("mechanical")) {
		if (hasTerm(haystack, VEHICLE_TERMS)) return "vehicle";
		if (hasTerm(haystack, ["automaton", "golem", "construct"])) return "monster";
		if (hasTerm(haystack, LOCATION_TERMS)) return "location";
		return "item";
	}
	if (category.includes("item") || category.includes("prop")) {
		if (hasTerm(haystack, VEHICLE_TERMS)) return "vehicle";
		if (hasTerm(haystack, ARMOR_TERMS)) return "armor";
		if (hasTerm(haystack, WEAPON_TERMS)) return "weapon";
		if (hasTerm(haystack, MOUNT_TERMS)) return "mount";
		return "item";
	}
	if (hasTerm(haystack, VEHICLE_TERMS)) return "vehicle";
	if (hasTerm(haystack, ARMOR_TERMS)) return "armor";
	if (hasTerm(haystack, WEAPON_TERMS)) return "weapon";
	if (hasTerm(haystack, MOUNT_TERMS)) return "mount";
	if (hasTerm(haystack, ANOMALY_TERMS)) return "anomaly";
	if (hasTerm(haystack, LOCATION_TERMS)) return "location";
	return "unknown";
}

async function imageMetadata(abs, exists, path) {
	const ext = extname(path).toLowerCase().replace(".", "");
	if (!exists || !isImagePath(path)) {
		return {
			extension: ext,
			detectedFormat: null,
			width: null,
			height: null,
			fileSize: exists ? statSync(abs).size : null,
			metadataError: null,
		};
	}
	if (ext === "svg") {
		return {
			extension: ext,
			detectedFormat: "svg",
			width: null,
			height: null,
			fileSize: statSync(abs).size,
			metadataError: null,
		};
	}
	try {
		const meta = await sharp(abs).metadata();
		return {
			extension: ext,
			detectedFormat: meta.format ?? null,
			width: meta.width ?? null,
			height: meta.height ?? null,
			fileSize: statSync(abs).size,
			metadataError: null,
		};
	} catch (error) {
		return {
			extension: ext,
			detectedFormat: null,
			width: null,
			height: null,
			fileSize: statSync(abs).size,
			metadataError: error.message,
		};
	}
}

function compactText(text, max = 220) {
	const clean = String(text ?? "")
		.replace(/\s+/g, " ")
		.trim();
	if (clean.length <= max) return clean;
	return `${clean.slice(0, max - 3).trim()}...`;
}

function slugToWords(value) {
	return String(value ?? "")
		.replace(/\.[^.]+$/, "")
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function titleCase(value) {
	return slugToWords(value)
		.split(" ")
		.filter(Boolean)
		.map((part) =>
			/^[A-Z0-9]+$/.test(part)
				? part
				: `${part.charAt(0).toUpperCase()}${part.slice(1)}`,
		)
		.join(" ");
}

function slugify(value) {
	return slugToWords(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 90);
}

function deterministicSeed(value) {
	let hash = 2166136261;
	for (const char of value) {
		hash ^= char.charCodeAt(0);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash >>> 0);
}

function uniqueSubjects(refs, fallback) {
	const subjectsBySlug = new Map();
	for (const ref of refs) {
		const subject = cleanSubjectName(ref.subject, fallback);
		if (!subject) continue;
		const key = slugify(subject);
		if (!subjectsBySlug.has(key)) subjectsBySlug.set(key, subject);
	}
	return [...subjectsBySlug.values()].filter(Boolean).slice(0, 8).join(", ") || fallback;
}

function loreSummaryFor(record) {
	const subjects = uniqueSubjects(record.references, record.likelySubjectName);
	const contexts = record.references
		.map((ref) => ref.context)
		.filter(Boolean)
		.slice(0, 3)
		.join(" ");
	const world =
		"Rift Ascendant is modern supernatural urban fantasy in the early normalized Rift Age; the material world is functional, commercial, Bureau-regulated, and media-aware.";
	const rift =
		"Rift Interiors can become impossible dark fantasy horror with hostile laws, Anomalies, Essence glow, Relics, and unreliable maps.";
	const runSilent =
		"Run Silent/Gloamreach canon takes precedence for sandbox subjects: the Quiet is an unseen apex predator that hunts by noise, light, and Essence use, wears the dead, and turns roads and settlements into patient traps.";
	const parts = [world];
	if (isGloamreachRecord(record)) parts.push(runSilent);
	else if (record.assetType === "anomaly" || record.assetType === "regent")
		parts.push(rift);
	if (contexts) parts.push(contexts);
	return compactText(`${subjects}. ${parts.join(" ")}`, 520);
}

function isGloamreachRecord(record) {
	const haystack = [
		record.path,
		record.likelySubjectName,
		...record.references.map((r) => `${r.file} ${r.subject} ${r.context}`),
	]
		.join(" ")
		.toLowerCase();
	return (
		haystack.includes("gloamreach") ||
		haystack.includes("quiet") ||
		haystack.includes("run silent") ||
		haystack.includes("drowned ledgerfen") ||
		haystack.includes("remembering orchard") ||
		haystack.includes("ashen counting-house") ||
		haystack.includes("obsidian spire") ||
		haystack.includes("hollow way") ||
		haystack.includes("sandbox")
	);
}

function promptKind(assetType) {
	return TYPE_ALIASES[assetType] ?? assetType;
}

function recordText(record) {
	return [
		record.path,
		record.category,
		record.assetType,
		record.likelySubjectName,
		...record.references.map(
			(r) => `${r.file} ${r.field} ${r.subject} ${r.recordName ?? ""} ${r.context}`,
		),
	]
		.join(" ")
		.toLowerCase();
}

function anomalyDesignCue(record) {
	const haystack = recordText(record);
	if (haystack.includes("the quiet")) {
		return "the Quiet is not a person, apex predator presence of the Gloamreach, a vast patient hungry thing that can wear familiar dead faces as bait, show the predator behind the lure, not a heroic human";
	}
	if (haystack.includes("worn mimic") || haystack.includes("worn dead")) {
		return "dead-worn lure and hunter, familiar human shape subtly wrong, predatory mimicry, grief-bait horror, not a normal portrait";
	}
	if (hasTerm(haystack, ["beast", "boar", "hound", "wolf", "serpent", "wyrm"])) {
		return "nonhuman beast anatomy, predatory animalistic or aberrant body, powerful creature silhouette, no armor, no human face, no human hunter";
	}
	if (
		hasTerm(haystack, [
			"aberration",
			"devourer",
			"entity",
			"horror",
			"nightmare",
			"revenant",
			"shadow",
			"stalker",
			"tentacle",
			"void",
			"wraith",
		])
	) {
		return "inhuman monstrous entity, distorted Rift-touched body, predatory supernatural silhouette, no armored person, no heroic human portrait";
	}
	return "inhuman Rift anomaly body unless lore explicitly says it wears a person, the entity itself is the subject, avoid ordinary human adventurer design";
}

function anomalyNegativeCue(record) {
	const haystack = recordText(record);
	if (haystack.includes("worn mimic") || haystack.includes("worn dead")) {
		return "normal healthy person, heroic adventurer, fashion portrait, friendly expression";
	}
	return "ordinary human, human warrior, armored hunter, heroic adventurer, fashion portrait, human face focus";
}

function monsterDesignCue(record) {
	const haystack = recordText(record);
	if (hasTerm(haystack, ["bear", "boar", "hound", "horse", "wolf"])) {
		return "nonhumanoid animal body, creature is not wearing armor or clothing, no weapon, natural predatory anatomy with subtle Rift Ascendant mood";
	}
	if (hasTerm(haystack, ["angel", "cherub"])) {
		return "celestial creature figure, not an abstract holy symbol, creature is the dominant subject, readable wings or halo only if supported by the source name";
	}
	return "creature anatomy driven by the subject and source tags, main creature silhouette dominates the frame";
}

function monsterNegativeCue(record) {
	const haystack = recordText(record);
	if (hasTerm(haystack, ["bear", "boar", "hound", "horse", "wolf"])) {
		return "weapon, sword, spear, clothing, armor, humanoid warrior, standing upright like a person";
	}
	return "empty environment, item-only image, abstract symbol only";
}

function itemDesignCue(record) {
	const haystack = recordText(record);
	const identityText = [
		record.likelySubjectName,
		...record.references.map((ref) => `${ref.recordId ?? ""} ${ref.recordName ?? ""}`),
	]
		.join(" ")
		.toLowerCase();
	if (hasTerm(identityText, ["kit", "toolkit", "breach kit", "tool set", "tools"])) {
		return "one closed compact black tactical hard-shell equipment case, three-quarter view, one rugged rectangular case only, blank surface, faint violet rift seal glow, no visible contents, no loose tools";
	}
	if (hasTerm(identityText, ["spyglass", "monocular", "scope"])) {
		return "one handheld optical monocular telescope only, short brass-and-black metal tube with glass lens, compact spyglass silhouette, no stock, no trigger, not a gun, not a rifle, no person looking through it";
	}
	if (hasTerm(identityText, ["light", "flashlight", "lantern", "torch"])) {
		return "one compact tactical light device only, modern rugged flashlight or lantern form, visible lens and power housing";
	}
	if (hasTerm(identityText, ["serum", "vial", "antidote", "elixir", "potion"])) {
		return "one sealed medical vial or injector only, clear glass and metal cap, luminous Essence fluid inside";
	}
	if (hasTerm(identityText, ["mre", "ration", "rations", "meal", "food", "provisional mre"])) {
		return "solo packshot of exactly one plain sealed modern field ration pouch, one compact unlabeled foil meal packet centered, one packet only, no readable label text, no extra packets, no food spread, no tree, no plant";
	}
	if (hasTerm(haystack, ["ring", "band", "amulet", "pendant", "necklace", "bracelet"])) {
		return "single jewelry object, centered relic-like accessory, readable small silhouette";
	}
	if (hasTerm(haystack, ["battery", "cell", "core", "engine"])) {
		return "single Essence-powered device or component, modern arcane engineering object, readable industrial silhouette";
	}
	if (hasTerm(haystack, ["photo", "ledger", "document", "card", "book"])) {
		return "single narrative prop object, readable document or keepsake silhouette, no legible text baked into image";
	}
	return "one complete object only, the object itself is the only subject, no living figure, no creature body, not a product sheet";
}

function weaponDesignCue(record) {
	const identityText = [
		record.likelySubjectName,
		...record.references.map((ref) => `${ref.recordId ?? ""} ${ref.recordName ?? ""}`),
	]
		.join(" ")
		.toLowerCase();
	if (hasTerm(identityText, ["revolver"])) {
		return "single compact revolver side-view render, exactly one complete handgun only, visible rotating cylinder, short barrel, one grip, one trigger, no duplicate views, no second gun, not a cannon";
	}
	if (hasTerm(identityText, ["pistol", "sidearm", "firearm", "gun", "rifle", "carbine", "scattergun", "shotgun", "smg"])) {
		return "single firearm side-view render, exactly one complete gun only, one barrel, one grip, one trigger, no duplicate views, no second gun";
	}
	if (hasTerm(identityText, ["spear", "halberd", "glaive", "polearm", "javelin", "staff", "quarterstaff"])) {
		return "single full-length pole weapon, one shaft with one connected head, entire weapon visible, no extra spearheads";
	}
	if (hasTerm(identityText, ["dagger", "knife", "shortsword", "sword", "greatsword", "rapier", "saber", "katana", "blade"])) {
		return "single bladed weapon, one handle and one blade, entire weapon visible, no duplicate blade variants";
	}
	if (hasTerm(identityText, ["axe", "greataxe", "maul", "mace", "warhammer", "hammer", "club"])) {
		return "single heavy melee weapon, one handle with one striking head, entire weapon visible, no alternate heads";
	}
	if (hasTerm(identityText, ["bow", "crossbow", "longbow", "shortbow"])) {
		return "single bow or crossbow weapon only, one complete ranged weapon, no arrow bundle, no second view";
	}
	return "single complete weapon object only, one continuous connected weapon, no alternate variants";
}

function armorDesignCue(record) {
	const identityText = [
		record.likelySubjectName,
		...record.references.map((ref) => `${ref.recordId ?? ""} ${ref.recordName ?? ""}`),
	]
		.join(" ")
		.toLowerCase();
	if (hasTerm(identityText, ["bracer", "vambrace"])) {
		return "detached single forearm bracer prop only, one hollow wrist cuff with protective plate, tabletop inventory object, no human arm, no sleeve, no glove, no torso, no full suit";
	}
	if (hasTerm(identityText, ["vest", "chestplate", "breastplate", "plate", "mail", "aegis"])) {
		return "detached torso protection vest object only, empty wearable shell on a simple stand, no head, no arms, no sleeves, no legs, no full suit, no wearer";
	}
	if (hasTerm(identityText, ["helmet", "helm", "headgear", "headpiece"])) {
		return "detached helmet or headgear object only, empty wearable shell, no face, no body, no shoulders, no full suit";
	}
	if (hasTerm(identityText, ["shield", "buckler", "kite shield"])) {
		return "one shield object only, front three-quarter view, readable shield silhouette, no sword, no warrior";
	}
	if (hasTerm(identityText, ["boots", "boot", "greave", "greaves"])) {
		return "one matched pair of protective boots or greaves only, empty wearable gear, no full character";
	}
	if (hasTerm(identityText, ["glove", "gloves", "gauntlet", "gauntlets"])) {
		return "one matched pair of gloves or gauntlets only, empty wearable gear, no full character";
	}
	if (hasTerm(identityText, ["cloak", "robe", "coat"])) {
		return "one empty cloak or robe garment only, hanging wearable object, no face, no model, no full character";
	}
	return "single empty wearable armor object only, not worn by anyone, no full-body suit sheet";
}

function equipmentNegativeCue(record) {
	const identityText = [
		record.likelySubjectName,
		...record.references.map((ref) => `${ref.recordId ?? ""} ${ref.recordName ?? ""}`),
	]
		.join(" ")
		.toLowerCase();
	const cues = [];
	if (hasTerm(identityText, ["revolver", "pistol", "sidearm", "firearm", "gun", "rifle", "carbine", "scattergun", "shotgun", "smg"])) {
		cues.push("multiple guns, duplicate firearms, weapon comparison sheet, three-view gun render, cannon, oversized barrel, shotgun body");
	}
	if (hasTerm(identityText, ["spear", "halberd", "glaive", "polearm", "javelin", "staff", "quarterstaff"])) {
		cues.push("extra spearheads, spearhead collection, broken weapon parts, multiple polearms");
	}
	if (hasTerm(identityText, ["bracer", "vambrace"])) {
		cues.push("human arm, sleeve, glove, torso armor, shirt, coat, chestplate, combat vest, full suit, helmet, boots, whole body");
	}
	if (hasTerm(identityText, ["vest", "chestplate", "breastplate", "plate", "mail", "aegis"])) {
		cues.push("helmet, arms, sleeves, legs, pants, full bodysuit, person wearing armor, costume sheet");
	}
	if (hasTerm(identityText, ["helmet", "helm", "headgear", "headpiece"])) {
		cues.push("full armor suit, torso, shoulders, person wearing helmet, face");
	}
	if (hasTerm(identityText, ["shield", "buckler", "kite shield"])) {
		cues.push("sword, spear, warrior, full knight, heraldic text");
	}
	if (hasTerm(identityText, ["mre", "ration", "rations", "meal", "food", "provisional mre"])) {
		cues.push("multiple pouches, ration sheet, packaging layout, nutrition label, readable text, tree, roots, plant, open picnic, plated meal, restaurant food, creature");
	}
	if (hasTerm(identityText, ["spyglass", "monocular", "scope"])) {
		cues.push("rifle, pistol, gun stock, trigger, camera body, person looking through lens");
	}
	return cues.join(", ");
}

function visualSubjectName(record) {
	const subject = record.likelySubjectName;
	if (["item", "weapon", "armor", "vehicle", "mount"].includes(record.assetType)) {
		const possessive = subject.match(/^(.+)'s\s+(.+)$/);
		if (possessive) {
			return possessive[2];
		}
	}
	return subject;
}

function visualLoreForPrompt(record) {
	const visualSubject = visualSubjectName(record);
	const lore = loreSummaryFor(record).split(record.likelySubjectName).join(visualSubject);
	if (!["item", "weapon", "armor", "vehicle", "mount"].includes(record.assetType)) {
		return lore;
	}
	return compactText(stripMechanicalRulesText(lore), 520);
}

function stripMechanicalRulesText(text) {
	const mechanics =
		/\b(?:action|bonus action|reaction|attack roll|saving throw|save|dc\s*\d+|damage|hit die|hit dice|hp|temporary hp|advantage|disadvantage|short rest|long rest|round|minute|hour|cone|radius|range|target|creature|object|1d\d+|2d\d+|3d\d+|4d\d+|\+\d+)\b/i;
	const fragments = String(text ?? "")
		.replace(/\s+/g, " ")
		.split(/(?<=[.!?])\s+/)
		.map((part) => part.trim())
		.filter(Boolean);
	const kept = fragments.filter((part) => !mechanics.test(part));
	return (kept.length > 0 ? kept : fragments)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}

function positivePrompt(record) {
	const subject = record.likelySubjectName;
	const visualSubject = visualSubjectName(record);
	const lore = visualLoreForPrompt(record);
	const kind = promptKind(record.assetType);
	if (kind === "character") {
		return `Rift Ascendant app asset, lore-accurate single-character portrait of ${subject}, one primary subject only, waist-up or three-quarter portrait, not a landscape, not a group scene, ${lore}, modern supernatural urban fantasy, early normalized Rift Age, ${RIFT_ASCENDANT_ART_STYLE}, cinematic dark atmosphere, subtle rift energy, Essence glow, contemporary clothing and gear, clean readable face, strong silhouette, no text, no logo, no celebrity likeness, no copyrighted character`;
	}
	if (kind === "token") {
		return `Rift Ascendant VTT token asset, ${subject}, lore-accurate token subject, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, centered full-body or bust token composition as appropriate to the subject, strong readable silhouette at small size, simple transparent-friendly or dark neutral background, Rift energy accents only where supported by lore, no baked-in text, no logo`;
	}
	if (kind === "anomaly") {
		return `Rift Ascendant app asset, ${subject}, single centered full-body creature or entity from a Rift Interior, not a landscape, not a location, ${anomalyDesignCue(record)}, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, uncanny biology, Essence-touched form, dangerous but readable silhouette, modern dark fantasy horror, cinematic lighting, polished monster concept art, dark atmosphere, rift glow accents, simple background, no text, no logo`;
	}
	if (kind === "monster") {
		return `Rift Ascendant app asset, ${subject}, lore-accurate creature or monster asset, main subject is the creature, not a landscape, ${monsterDesignCue(record)}, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, modern supernatural urban fantasy encounter art, readable full-body silhouette, cinematic dark atmosphere, polished tabletop RPG monster concept art, simple background, no text, no logo`;
	}
	if (kind === "regent") {
		return `Rift Ascendant app asset, ${subject}, dominant single Regent or domain authority figure, the Regent is visible and central, not an empty throne room, charismatic predatory authority, patient horror, elegant menace, not merely a large monster, presence of law and control, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, dark fantasy horror inside a Rift Interior, cinematic shadows, rift-lit atmosphere, domain/court/anchor symbolism only if supported by lore and kept secondary, polished boss key art, no text, no logo`;
	}
	if (kind === "weapon") {
		return `Rift Ascendant inventory icon, ${weaponDesignCue(record)}, exactly one single complete ${visualSubject} weapon only, one continuous connected object, full weapon visible, one large weapon fills most of the frame, centered composition on a simple dark neutral background, no person, no hands, no secondary weapons, no duplicates, no multiple variants, not a design sheet, not a parchment page, lore-accurate weapon asset, ${lore}, ${RIFT_EQUIPMENT_ART_STYLE}, modern supernatural urban fantasy equipment, Rift Age material design, Essence-infused details, clear complete weapon silhouette, polished game weapon art, no character holding it, no text, no logo`;
	}
	if (kind === "armor") {
		return `Rift Ascendant inventory icon, ${armorDesignCue(record)}, one single complete ${visualSubject} equipment object only, isolated detached gear render on a simple dark neutral background, no person, no body, no model, no mannequin, no wearer, no multiple variants, not a design sheet, lore-accurate protective gear asset, ${lore}, ${RIFT_EQUIPMENT_ART_STYLE}, modern supernatural urban fantasy equipment, Rift Age tactical material design, Essence-threaded or anomaly-touched details, clear wearable silhouette, centered inventory composition, polished game gear art, no full character portrait, no text, no logo`;
	}
	if (kind === "vehicle") {
		return `Rift Ascendant app asset, ${visualSubject}, one single complete vehicle only, lore-accurate vehicle asset for ${subject}, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, modern supernatural urban fantasy infrastructure, early normalized Rift Age, Bureau or guild practical design where appropriate, vehicle is the dominant subject, readable three-quarter view, strong silhouette, subtle Essence or Rift modifications only if supported by lore, polished game vehicle concept art, simple background, no text, no logo`;
	}
	if (kind === "mount") {
		return `Rift Ascendant app asset, ${visualSubject}, lore-accurate rideable mount or bonded companion creature for ${subject}, main subject is the mount, not a landscape, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, modern supernatural urban fantasy, Essence-touched anatomy, readable full-body silhouette, practical saddle or harness only if supported by lore, cinematic dark atmosphere, polished creature mount concept art, simple background, no text, no logo`;
	}
	if (kind === "item") {
		return `Rift Ascendant inventory asset, one single centered complete ${visualSubject} object only, isolated object render on a simple dark neutral background, no person, no hands, no creature, no character, no landscape, no multiple views, no parts sheet, ${itemDesignCue(record)}, ${lore}, ${RIFT_EQUIPMENT_ART_STYLE}, powerful object recovered from or shaped by Rift forces, Essence-infused materials, modern dark fantasy item design, clear object silhouette, centered composition, polished inventory art, no text, no logo`;
	}
	if (kind === "power") {
		return `Rift Ascendant app asset, ${subject}, abstract but readable supernatural effect icon, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, rift energy, Essence particles, strong silhouette, centered action shape, high contrast, simple background, usable at small size, no text, no logo`;
	}
	if (kind === "map") {
		return `Rift Ascendant VTT map asset, ${subject}, lore-accurate tactical environment map, readable overhead or isometric layout, not a character portrait, not a single item, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, modern supernatural urban fantasy or Rift Interior dark fantasy depending on context, clear paths and encounter spaces, coherent architecture, atmospheric but playable, no baked-in labels, no text, no logo`;
	}
	return `Rift Ascendant app asset, ${subject}, ${lore}, ${RIFT_ASCENDANT_ART_STYLE}, modern supernatural urban fantasy or Rift Interior dark fantasy depending on context, cinematic environment concept art, strong readable composition, safe negative space for UI overlay, atmospheric depth, rift energy, Essence glow, coherent architecture, polished game background, no text, no logo`;
}

function negativePrompt(assetType, record = null) {
	const kind = promptKind(assetType);
	const base =
		NEGATIVE_PROMPTS[kind] ??
		"placeholder image, stock photo, unrelated genre, unreadable composition, blurry, low resolution, text, watermark, logo, signature";
	if (kind === "anomaly" && record) {
		return `${base}, ${anomalyNegativeCue(record)}, ${IP_SAFETY_NEGATIVE}`;
	}
	if (kind === "monster" && record) {
		return `${base}, ${monsterNegativeCue(record)}, ${IP_SAFETY_NEGATIVE}`;
	}
	if (["item", "weapon", "armor"].includes(kind) && record) {
		const equipmentCue = equipmentNegativeCue(record);
		return `${base}${equipmentCue ? `, ${equipmentCue}` : ""}, ${IP_SAFETY_NEGATIVE}`;
	}
	return `${base}, ${IP_SAFETY_NEGATIVE}`;
}

function recommendedDimensions(assetType, metadata) {
	const width = metadata.width ?? 0;
	const height = metadata.height ?? 0;
	const ratio = width > 0 && height > 0 ? width / height : 1;

	if (assetType === "character") return { width: 1024, height: 1365 };
	if (
		assetType === "token" ||
		assetType === "power" ||
		assetType === "item" ||
		assetType === "weapon" ||
		assetType === "armor" ||
		assetType === "mount"
	)
		return { width: 1024, height: 1024 };
	if (assetType === "vehicle") {
		if (ratio > 1.25) return { width: 1344, height: 768 };
		return { width: 1024, height: 1024 };
	}
	if (assetType === "map") {
		if (ratio > 0.9 && ratio < 1.1) return { width: 1024, height: 1024 };
		return { width: 1536, height: 1024 };
	}
	if (assetType === "background" || assetType === "location") {
		if (ratio > 1.45) return { width: 1536, height: 864 };
		if (ratio < 0.85) return { width: 896, height: 1152 };
		if (ratio > 0.9 && ratio < 1.1) return { width: 1024, height: 1024 };
		return { width: 1344, height: 768 };
	}
	if (assetType === "anomaly" || assetType === "monster" || assetType === "regent")
		return { width: 1024, height: 1024 };
	return { width: 1024, height: 1024 };
}

function defaultSteps(assetType) {
	if (assetType === "map" || assetType === "location" || assetType === "background")
		return 40;
	if (
		assetType === "item" ||
		assetType === "weapon" ||
		assetType === "armor" ||
		assetType === "power" ||
		assetType === "token"
	)
		return 24;
	return 30;
}

function generationModeFor(record) {
	if (!isImagePath(record.path)) return "skip";
	if (record.assetType === "unknown") return "skip";
	if (!record.exists) return "txt2img";
	if (record.placeholderSuspicion === "likely") return "txt2img";
	if (record.placeholderSuspicion === "confirmed") return "txt2img";
	if (record.mismatchSuspicion === "likely") return "txt2img";
	if (record.mismatchSuspicion === "possible") return "img2img";
	return "skip";
}

function analyzeRecord(path, refs, category, existsInfo, metadata) {
	const assetType = assetTypeFor(path, category, refs);
	const likelySubjectName = uniqueSubjects(refs, titleCase(basename(path, extname(path))));
	const reasons = [];
	let placeholderSuspicion = "none";
	let mismatchSuspicion = "none";
	let priority = "low";

	const sourceFiles = refs.map((r) => r.file).join(" ");
	const isImage = isImagePath(path);

	if (!isImage && isAudioPath(path)) {
		return {
			assetType: "unknown",
			likelySubjectName,
			placeholderSuspicion: "none",
			mismatchSuspicion: "none",
			replacementPriority: "low",
			reason: "Audio asset; image replacement workflow skips it.",
		};
	}

	if (!existsInfo.exists) {
		placeholderSuspicion = "confirmed";
		priority = "high";
		reasons.push("Referenced image is missing on disk.");
	}

	if (existsInfo.casingMismatch || path.includes("/Regents/")) {
		mismatchSuspicion = "likely";
		priority = "high";
		reasons.push("Path casing can break Linux deployments.");
	}

	if (sourceFiles.includes("regentPortraits.ts") && !path.includes("/regents/")) {
		mismatchSuspicion = "likely";
		priority = "high";
		reasons.push(
			"Regent portrait is routed to non-regent fallback art; lowercase regent folder has no bespoke image.",
		);
	}

	if (isAnomalyPlaceholderPool(path)) {
		placeholderSuspicion = "likely";
		priority = "high";
		reasons.push("Uses deterministic anomaly placeholder pool art.");
	}

	if (isGenericImageName(path) && placeholderSuspicion === "none") {
		placeholderSuspicion = assetType === "item" ? "possible" : "likely";
		if (assetType !== "item") priority = maxPriority(priority, "medium");
		reasons.push("Generic generated filename suggests placeholder or pooled art.");
	}

	if (
		metadata.detectedFormat &&
		metadata.extension &&
		metadata.detectedFormat !== metadata.extension &&
		!(metadata.detectedFormat === "jpeg" && metadata.extension === "jpg")
	) {
		mismatchSuspicion = maxSuspicion(mismatchSuspicion, "possible");
		priority = maxPriority(priority, "medium");
		reasons.push(
			`File extension .${metadata.extension} does not match detected ${metadata.detectedFormat} content.`,
		);
	}

	if (
		metadata.width &&
		metadata.height &&
		(metadata.width < 512 || metadata.height < 512) &&
		["background", "location", "map", "regent", "anomaly", "monster"].includes(
			assetType,
		)
	) {
		mismatchSuspicion = maxSuspicion(mismatchSuspicion, "possible");
		priority = maxPriority(priority, "medium");
		reasons.push("Image is small for card, hero, map, or boss usage.");
	}

	if (
		path.includes("mount-dire-shadow-wolf") &&
		sourceFiles.includes("sandbox-asset-resolver.ts")
	) {
		mismatchSuspicion = "likely";
		priority = "high";
		reasons.push(
			"The Quiet currently points to a dire shadow wolf stand-in, but Run Silent describes a patient worn-dead apex predator/domain threat.",
		);
	}

	const distinctSubjects = new Set(refs.map((r) => r.subject).filter(Boolean));
	if (distinctSubjects.size > 2 && isGenericImageName(path)) {
		mismatchSuspicion = maxSuspicion(mismatchSuspicion, "possible");
		priority = maxPriority(priority, "medium");
		reasons.push("Same generic image is reused for multiple distinct subjects.");
	}

	if (isGloamreachLike(refs) && category === "image-map" && refs.length > 1) {
		mismatchSuspicion = maxSuspicion(mismatchSuspicion, "possible");
		priority = maxPriority(priority, "medium");
		reasons.push(
			"Run Silent scene map is reused across multiple lore-specific Gloamreach locations.",
		);
	}

	if (reasons.length === 0) {
		reasons.push("No strong placeholder or mismatch evidence found.");
	}

	return {
		assetType,
		likelySubjectName,
		placeholderSuspicion,
		mismatchSuspicion,
		replacementPriority: priority,
		reason: reasons.join(" "),
	};
}

function isGloamreachLike(refs) {
	const haystack = refs
		.map((r) => `${r.file} ${r.subject} ${r.context}`)
		.join(" ")
		.toLowerCase();
	return haystack.includes("sandbox") || haystack.includes("gloamreach");
}

function maxPriority(a, b) {
	const order = { low: 0, medium: 1, high: 2 };
	return order[b] > order[a] ? b : a;
}

function maxSuspicion(a, b) {
	const order = { none: 0, possible: 1, likely: 2, confirmed: 3 };
	return order[b] > order[a] ? b : a;
}

function cleanSubjectName(value, fallback) {
	const raw = String(value ?? "").trim();
	if (!raw) return fallback;
	const withoutPath = raw.includes("/")
		? basename(raw.replace(/\\/g, "/"))
		: raw;
	return titleCase(withoutPath.replace(/\.[^.]+$/, "")) || fallback;
}

function distinctSubjectNames(refs, fallback) {
	return [
		...new Set(
			refs
				.map((ref) => cleanSubjectName(ref.subject, fallback))
				.filter(Boolean),
		),
	];
}

function shouldSplitPromptRecord(record) {
	const subjects = distinctSubjectNames(record.references, record.likelySubjectName);
	return (
		subjects.length > 1 ||
		isGenericImageName(record.path) ||
		isAnomalyPlaceholderPool(record.path) ||
		record.path === "/images/compendium/placeholder.webp" ||
		record.forceSubjectTarget === true ||
		(record.references.some((ref) => ref.file.includes("regentPortraits.ts")) &&
			!record.path.includes("/regents/"))
	);
}

function typedCompendiumFolder(assetType) {
	const folders = {
		character: "characters",
		token: "tokens",
		anomaly: "anomalies",
		monster: "monsters",
		regent: "regents",
		relic: "relics",
		item: "items",
		weapon: "weapons",
		armor: "armor",
		vehicle: "vehicles",
		mount: "mounts",
		power: "powers",
		spell: "spells",
		technique: "techniques",
		location: "locations",
		map: "maps",
		background: "backgrounds",
		UI: "ui",
	};
	return folders[assetType] ?? "items";
}

function sourceRecordKeysForRefs(refs) {
	return [
		...new Set(
			refs
				.map((ref) => ref.sourceRecordKey || sourceRecordKeyForRef(ref))
				.filter(Boolean),
		),
	].sort();
}

function shortHash(value) {
	return deterministicSeed(value).toString(36).slice(0, 6);
}

function promptRecordIdFor(record) {
	const keys = sourceRecordKeysForRefs(record.references);
	const subject = slugify(record.likelySubjectName);
	const identity = record.forceSubjectTarget
		? `${keys.join("|") || subject}|${record.assetType}`
		: `${record.path}|${keys.join("|") || record.path}|${record.assetType}|${record.category}`;
	return [
		promptKind(record.assetType),
		record.assetType,
		subject,
		shortHash(identity),
	]
		.filter(Boolean)
		.join("-");
}

function applyTargetPathFor(record) {
	const refFiles = record.references.map((r) => r.file).join(" ");
	if (refFiles.includes("regentPortraits.ts")) {
		return `/generated/compendium/regents/${slugify(record.likelySubjectName)}.webp`;
	}
	if (
		record.references.some((r) => r.file.includes("sandbox-asset-resolver.ts")) &&
		record.likelySubjectName.toLowerCase().includes("quiet")
	) {
		return "/generated/compendium/sandbox_npcs/the-quiet.webp";
	}
	if (shouldSplitPromptRecord(record)) {
		return `/generated/compendium/${typedCompendiumFolder(record.assetType)}/${promptRecordIdFor(record)}.webp`;
	}
	return record.path;
}

function outputBaseNameFor(record) {
	const subjectSlug = promptRecordIdFor(record);
	const pathSlug = slugify(basename(record.path, extname(record.path)));
	return subjectSlug || pathSlug || `asset-${deterministicSeed(record.path)}`;
}

function buildPromptRecord(record) {
	const dims = recommendedDimensions(record.assetType, record);
	const applyTargetPath = applyTargetPathFor(record);
	const sourceRecordKeys = sourceRecordKeysForRefs(record.references);
	const promptRecordId = promptRecordIdFor(record);
	return {
		promptRecordId,
		assetPath: record.path,
		outputBaseName: outputBaseNameFor(record),
		type: record.assetType,
		category: record.category,
		sourceCategory: [...new Set(record.references.map((ref) => ref.sourceCategory))].filter(
			Boolean,
		),
		sourceRecordKeys,
		sourceRecordIds: [
			...new Set(record.references.map((ref) => ref.recordId).filter(Boolean)),
		],
		sourceRecordNames: [
			...new Set(record.references.map((ref) => ref.recordName).filter(Boolean)),
		],
		subject: record.likelySubjectName,
		loreSummary: loreSummaryFor(record),
		positivePrompt: record.recommendedPrompt,
		negativePrompt: record.recommendedNegativePrompt,
		width: dims.width,
		height: dims.height,
		seed: deterministicSeed(`${promptRecordId}|${record.recommendedPrompt}`),
		steps: defaultSteps(record.assetType),
		cfgScale: ["item", "weapon", "armor", "vehicle", "mount"].includes(
			record.assetType,
		)
			? 8
			: record.assetType === "map" || record.assetType === "location"
				? 7.5
				: 7,
		sampler: DEFAULT_SAMPLER,
		scheduler: DEFAULT_SCHEDULER,
		checkpoint: DEFAULT_CHECKPOINT,
		optionalRefiner: OPTIONAL_REFINER,
		backendHints: {
			a1111: {
				endpoint: "/sdapi/v1/txt2img",
				override_settings: {
					sd_model_checkpoint: DEFAULT_CHECKPOINT,
				},
			},
			comfy: {
				workflowPath: "config/comfy-rift-sdxl-workflow-api.json",
				exampleWorkflowPath: "config/comfy-rift-sdxl-workflow-api.example.json",
			},
		},
		applyTargetPath,
		priority: record.replacementPriority,
		recommendedGenerationMode: record.recommendedGenerationMode,
		recommendedReplacement: "pending",
		confidence: "pending",
		references: record.references,
		loreSourceFiles: record.loreSourceUsed,
		updateReferencesOnApply: applyTargetPath !== record.path,
	};
}

function recordForRefs(record, refs, forceSubjectTarget) {
	const fallback = titleCase(basename(record.path, extname(record.path)));
	const likelySubjectName = uniqueSubjects(
		refs.map((ref) => ({
			...ref,
			subject: cleanSubjectName(ref.subject, fallback),
		})),
		record.likelySubjectName,
	);
	const assetType = assetTypeFor(record.path, record.category, refs);
	const derived = {
		...record,
		references: refs,
		whereReferenced: refs,
		likelySubjectName,
		assetType,
		forceSubjectTarget,
		recommendedNegativePrompt: "",
	};
	derived.recommendedNegativePrompt = negativePrompt(assetType, derived);
	derived.recommendedPrompt = positivePrompt(derived);
	derived.recommendedDimensions = recommendedDimensions(assetType, derived);
	derived.recommendedGenerationMode = generationModeFor(derived);
	return derived;
}

function buildPromptRecordsForAsset(record) {
	if (record.assetType === "unknown") return [];
	if (!shouldSplitPromptRecord(record)) return [buildPromptRecord(record)];

	const grouped = new Map();
	for (const ref of record.references) {
		const single = recordForRefs(record, [ref], true);
		if (single.assetType === "unknown") continue;
		const target = applyTargetPathFor(single);
		const key = `${single.assetType}::${sourceRecordKeysForRefs([ref]).join("|")}::${single.likelySubjectName}::${target}`;
		if (!grouped.has(key)) {
			grouped.set(key, { single, refs: [] });
		}
		grouped.get(key).refs.push({
			...ref,
			subject: cleanSubjectName(ref.subject, single.likelySubjectName),
		});
	}

	return [...grouped.values()]
		.map(({ single, refs }) => recordForRefs(single, refs, true))
		.filter((splitRecord) => splitRecord.recommendedGenerationMode !== "skip")
		.map(buildPromptRecord);
}

function uniqueByPromptRecordId(records) {
	const byId = new Map();
	for (const record of records) {
		if (!byId.has(record.promptRecordId)) {
			byId.set(record.promptRecordId, record);
			continue;
		}
		const existing = byId.get(record.promptRecordId);
		existing.references = [...existing.references, ...record.references];
		existing.sourceCategory = [
			...new Set([...(existing.sourceCategory ?? []), ...(record.sourceCategory ?? [])]),
		].filter(Boolean);
		existing.sourceRecordKeys = [
			...new Set([
				...(existing.sourceRecordKeys ?? []),
				...(record.sourceRecordKeys ?? []),
			]),
		].filter(Boolean);
		existing.sourceRecordIds = [
			...new Set([
				...(existing.sourceRecordIds ?? []),
				...(record.sourceRecordIds ?? []),
			]),
		].filter(Boolean);
		existing.sourceRecordNames = [
			...new Set([
				...(existing.sourceRecordNames ?? []),
				...(record.sourceRecordNames ?? []),
			]),
		].filter(Boolean);
	}
	return [...byId.values()];
}

function buildMarkdownSummary(summary, promptRecords) {
	const lines = [];
	lines.push("# Asset Audit Summary");
	lines.push("");
	lines.push(`Generated: ${summary.generatedAt}`);
	lines.push("");
	lines.push(`- **Unique asset paths referenced**: ${summary.totals.uniquePaths}`);
	lines.push(`- **Image paths referenced**: ${summary.totals.imagePaths}`);
	lines.push(`- **Missing files on disk**: ${summary.totals.missing}`);
	lines.push(
		`- **Casing mismatches (bad on Linux)**: ${summary.totals.casingMismatch}`,
	);
	lines.push(
		`- **Anomaly placeholder pool references**: ${summary.totals.placeholderAnomalies}`,
	);
	lines.push(
		`- **Likely placeholders**: ${summary.totals.likelyPlaceholders}`,
	);
	lines.push(
		`- **High-priority replacements**: ${summary.totals.highPriorityReplacements}`,
	);
	lines.push(`- **Prompt records created**: ${promptRecords.length}`);
	lines.push(
		`- **Regent folder on disk**: ${summary.regentFolder.fileCount} files`,
	);
	lines.push("");
	lines.push("## By category");
	lines.push("");
	lines.push("| Category | Total | Missing | Casing | Placeholder |");
	lines.push("|----------|-------|---------|--------|-------------|");
	for (const c of summary.categories) {
		lines.push(
			`| ${c.category} | ${c.total} | ${c.missing} | ${c.casingMismatch} | ${c.placeholder} |`,
		);
	}
	lines.push("");
	if (summary.missing.length > 0) {
		lines.push("## Missing files (first 50)");
		lines.push("");
		for (const m of summary.missing.slice(0, 50)) {
			lines.push(`- \`${m.path}\` (${m.category}, ${m.refCount} refs)`);
		}
		if (summary.missing.length > 50) {
			lines.push(`- *...and ${summary.missing.length - 50} more*`);
		}
		lines.push("");
	}
	if (summary.casingMismatch.length > 0) {
		lines.push("## Casing mismatches");
		lines.push("");
		for (const m of summary.casingMismatch.slice(0, 50)) {
			lines.push(`- \`${m.path}\` (${m.category}, ${m.refCount} refs)`);
		}
		lines.push("");
	}
	lines.push("## High-priority replacement candidates (first 50)");
	lines.push("");
	for (const asset of summary.assets
		.filter((a) => a.replacementPriority === "high")
		.slice(0, 50)) {
		lines.push(
			`- \`${asset.path}\` - ${asset.likelySubjectName} (${asset.assetType}): ${asset.reason}`,
		);
	}
	return lines.join("\n");
}

function buildReplacementPlanMarkdown(summary, promptRecords) {
	const high = summary.assets.filter((a) => a.replacementPriority === "high");
	const medium = summary.assets.filter((a) => a.replacementPriority === "medium");
	const lines = [];
	lines.push("# Rift Image Replacement Plan");
	lines.push("");
	lines.push(`Generated: ${summary.generatedAt}`);
	lines.push("");
	lines.push("## Overview");
	lines.push("");
	lines.push(`- Audited image references: ${summary.totals.imagePaths}`);
	lines.push(`- Likely placeholders: ${summary.totals.likelyPlaceholders}`);
	lines.push(`- High-priority replacements: ${high.length}`);
	lines.push(`- Medium-priority replacements: ${medium.length}`);
	lines.push(`- Prompt records: ${promptRecords.length}`);
	lines.push("");
	lines.push("The audit uses repo lore first. Global tone comes from `docs/rift-ascendant-world-lore.md`; Gloamreach prompts use current Run Silent / The Quiet sandbox text where present.");
	lines.push("");
	lines.push("## High Priority");
	lines.push("");
	for (const asset of high.slice(0, 100)) {
		lines.push(`### ${asset.likelySubjectName}`);
		lines.push("");
		lines.push(`- Source: \`${asset.path}\``);
		lines.push(`- Type: ${asset.assetType}`);
		lines.push(`- Exists: ${asset.exists ? "yes" : "no"}`);
		lines.push(`- Reason: ${asset.reason}`);
		lines.push(`- Mode: ${asset.recommendedGenerationMode}`);
		lines.push(
			`- Recommended size: ${asset.recommendedDimensions.width}x${asset.recommendedDimensions.height}`,
		);
		lines.push(`- Apply target: \`${applyTargetPathFor(asset)}\``);
		lines.push("");
	}
	lines.push("## Medium Priority");
	lines.push("");
	for (const asset of medium.slice(0, 100)) {
		lines.push(`- \`${asset.path}\` - ${asset.likelySubjectName}: ${asset.reason}`);
	}
	return lines.join("\n");
}

function htmlEscape(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function buildReviewHtml(promptRecords) {
	const rows = promptRecords
		.map((record) => {
			const original = record.assetPath.startsWith("/")
				? record.assetPath
				: `/${record.assetPath}`;
			const originalSrc = `../public${original}`;
			return `<article class="card">
  <div class="previews">
    <figure><figcaption>Original</figcaption><img src="${htmlEscape(originalSrc)}" alt="${htmlEscape(record.subject)} original" onerror="this.closest('figure').classList.add('missing')" /></figure>
    <figure><figcaption>Candidate</figcaption><div class="empty">Pending generation</div></figure>
  </div>
  <h2>${htmlEscape(record.subject)}</h2>
  <dl>
    <dt>Prompt ID</dt><dd><code>${htmlEscape(record.promptRecordId)}</code></dd>
    <dt>Asset path</dt><dd><code>${htmlEscape(record.assetPath)}</code></dd>
    <dt>Apply target</dt><dd><code>${htmlEscape(record.applyTargetPath)}</code></dd>
    <dt>Type</dt><dd>${htmlEscape(record.type)}</dd>
    <dt>Category</dt><dd>${htmlEscape(record.category ?? "")}</dd>
    <dt>Source</dt><dd>${htmlEscape((record.sourceCategory ?? []).join(", "))}</dd>
    <dt>Priority</dt><dd>${htmlEscape(record.priority)}</dd>
    <dt>Checkpoint</dt><dd>${htmlEscape(record.checkpoint)}</dd>
    <dt>Seed</dt><dd>${record.seed}</dd>
    <dt>Replacement</dt><dd>pending</dd>
    <dt>Notes</dt><dd><textarea placeholder="Review notes"></textarea></dd>
  </dl>
  <details><summary>Prompt</summary><p>${htmlEscape(record.positivePrompt)}</p><p><strong>Negative:</strong> ${htmlEscape(record.negativePrompt)}</p></details>
</article>`;
		})
		.join("\n");
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rift Ascendant Image Review</title>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #070914; color: #e8ecff; }
    header { position: sticky; top: 0; padding: 18px 24px; background: rgba(7, 9, 20, 0.92); border-bottom: 1px solid #26304f; z-index: 2; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    main { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; padding: 24px; }
    .card { border: 1px solid #27314f; border-radius: 8px; background: #0d1224; padding: 14px; box-shadow: 0 14px 36px rgba(0,0,0,.32); }
    .previews { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    figure { margin: 0; min-height: 170px; background: #090d1a; border: 1px solid #202944; border-radius: 6px; overflow: hidden; }
    figcaption { padding: 7px 9px; color: #aeb9dc; font-size: 12px; border-bottom: 1px solid #202944; }
    img { width: 100%; height: 190px; object-fit: cover; display: block; }
    figure.missing::after, .empty { display: grid; min-height: 190px; place-items: center; color: #8290bd; font-size: 13px; content: "Missing"; }
    h2 { font-size: 17px; margin: 14px 0 10px; }
    dl { display: grid; grid-template-columns: 92px 1fr; gap: 7px 10px; font-size: 13px; }
    dt { color: #8fa0d1; }
    dd { margin: 0; min-width: 0; word-break: break-word; }
    code { color: #a7f3ff; }
    textarea { width: 100%; min-height: 54px; background: #070914; color: #e8ecff; border: 1px solid #2b365a; border-radius: 5px; }
    details { margin-top: 12px; color: #c8d2ef; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>Rift Ascendant Image Review</h1>
    <div>Generated candidates default to pending. Mark sidecar JSON as recommended only after review.</div>
  </header>
  <main>
${rows}
  </main>
</body>
</html>
`;
}

function buildReviewMarkdown(promptRecords) {
	const lines = [];
	lines.push("# Generated Image Review");
	lines.push("");
	lines.push("Generated candidates start as pending. Edit candidate sidecar JSON after review to apply a replacement.");
	lines.push("");
	for (const record of promptRecords.slice(0, 200)) {
		lines.push(`## ${record.subject}`);
		lines.push("");
		lines.push(`- Prompt ID: \`${record.promptRecordId}\``);
		lines.push(`- Original: \`${record.assetPath}\``);
		lines.push(`- Candidate: pending`);
		lines.push(`- Apply target: \`${record.applyTargetPath}\``);
		lines.push(`- Type: ${record.type}`);
		lines.push(`- Category: ${record.category ?? ""}`);
		lines.push(`- Source category: ${(record.sourceCategory ?? []).join(", ")}`);
		lines.push(`- Priority: ${record.priority}`);
		lines.push(`- Checkpoint: ${record.checkpoint}`);
		lines.push(`- Seed: ${record.seed}`);
		lines.push(`- Recommended replacement: pending`);
		lines.push(`- Notes: _pending review_`);
		lines.push("");
		lines.push("<details><summary>Prompt</summary>");
		lines.push("");
		lines.push(record.positivePrompt);
		lines.push("");
		lines.push(`Negative: ${record.negativePrompt}`);
		lines.push("");
		lines.push("</details>");
		lines.push("");
	}
	return lines.join("\n");
}

async function main() {
	await mkdir(AUDIT_DIR, { recursive: true });
	await mkdir(DOCS_DIR, { recursive: true });
	await mkdir(PLAN_DATA_DIR, { recursive: true });

	console.log("[audit] Scanning compendium source files...");
	const sourceFiles = readAllDataSources();
	console.log(
		`[audit]   Found ${sourceFiles.length} .ts files under src/data/compendium`,
	);

	const manifestFiles = existingFiles([
		join(ROOT, "src", "lib", "vtt", "vttAssetManifest.ts"),
		join(ROOT, "src", "data", "vttAssetLibrary.ts"),
		join(ROOT, "src", "data", "premadeMaps.ts"),
		join(ROOT, "src", "data", "tokens.ts"),
		join(ROOT, "src", "lib", "audio", "hooks.ts"),
		join(ROOT, "src", "pages", "AscendantTools.tsx"),
		join(ROOT, "src", "components", "ui", "AscendantWindow.tsx"),
		join(ROOT, "src", "components", "vtt", "AscendantToolsPanel.tsx"),
		join(ROOT, "src", "components", "vtt", "RiftNotificationOverlay.tsx"),
		join(ROOT, "src", "lib", "riftGenerator.ts"),
		join(ROOT, "src", "lib", "riftFavor.ts"),
	]);

	const allFiles = [...new Set([...sourceFiles, ...manifestFiles])];
	const pathRefs = new Map();

	for (const file of allFiles) {
		const src = readFileSync(file, "utf8");
		const rel = normalizeRelPath(file);
		const sourceCategory = sourceCategoryForFile(rel);
		const matches = extractPathMatches(src);
		if (rel.endsWith("sandbox-scenes.ts")) {
			matches.push(...extractSandboxSceneAssetMatches(src));
		}
		for (const match of matches) {
			if (!pathRefs.has(match.path)) {
				pathRefs.set(match.path, { count: 0, sources: new Set(), refs: [] });
			}
			const ref = pathRefs.get(match.path);
			ref.count += 1;
			ref.sources.add(rel);
			ref.refs.push({
				file: rel,
				line: match.line,
				field: match.field,
				subject: match.subject,
				recordId: match.recordId,
				recordName: match.recordName,
				sourceCategory,
				sourceRecordKey: sourceRecordKeyForRef({
					file: rel,
					line: match.line,
					subject: match.subject,
					recordId: match.recordId,
					recordName: match.recordName,
				}),
				context: match.context,
			});
		}
	}

	console.log(`[audit] Extracted ${pathRefs.size} unique asset paths`);

	const byCategory = new Map();
	const missing = [];
	const casingMismatch = [];
	const placeholderAnomalies = [];
	const assets = [];

	for (const [path, ref] of pathRefs) {
		const category = categorise(path);
		const existsInfo = fileExists(path);
		const metadata = await imageMetadata(existsInfo.abs, existsInfo.exists, path);
		const analysis = analyzeRecord(
			path,
			ref.refs,
			category,
			existsInfo,
			metadata,
		);

		if (!byCategory.has(category)) {
			byCategory.set(category, {
				category,
				total: 0,
				missing: 0,
				casingMismatch: 0,
				placeholder: 0,
			});
		}
		const bucket = byCategory.get(category);
		bucket.total += 1;
		if (!existsInfo.exists) {
			bucket.missing += 1;
			missing.push({
				path,
				category,
				refCount: ref.count,
				sources: Array.from(ref.sources),
			});
		} else if (existsInfo.casingMismatch) {
			bucket.casingMismatch += 1;
			casingMismatch.push({
				path,
				category,
				refCount: ref.count,
				sources: Array.from(ref.sources),
			});
		}
		if (isAnomalyPlaceholderPool(path)) {
			bucket.placeholder += 1;
			placeholderAnomalies.push({ path, refCount: ref.count });
		}

		const dims = recommendedDimensions(analysis.assetType, metadata);
		const record = {
			path,
			sourceImagePath: path,
			absoluteDiskPath: existsInfo.abs,
			exists: existsInfo.exists,
			casingMismatch: existsInfo.casingMismatch,
			dimensions: {
				width: metadata.width,
				height: metadata.height,
			},
			width: metadata.width,
			height: metadata.height,
			fileSize: metadata.fileSize,
			extension: metadata.extension,
			detectedFormat: metadata.detectedFormat,
			metadataError: metadata.metadataError,
			category,
			refCount: ref.count,
			sources: Array.from(ref.sources),
			references: ref.refs,
			whereReferenced: ref.refs,
			likelySubjectName: analysis.likelySubjectName,
			assetType: analysis.assetType,
			placeholderSuspicion: analysis.placeholderSuspicion,
			mismatchSuspicion: analysis.mismatchSuspicion,
			replacementPriority: analysis.replacementPriority,
			reason: analysis.reason,
			loreSourceUsed: [
				WORLD_LORE_FILE,
				...Array.from(ref.sources).filter(
					(source) =>
						source.includes("sandbox") ||
						source.includes("regents") ||
						source.includes("rank-") ||
						source.includes("jobs") ||
						source.includes("items") ||
						source.includes("locations"),
				),
			],
			recommendedPrompt: "",
			recommendedNegativePrompt: "",
			recommendedDimensions: dims,
			recommendedGenerationMode: "skip",
		};
		record.recommendedNegativePrompt = negativePrompt(record.assetType, record);
		record.recommendedPrompt = positivePrompt(record);
		record.recommendedGenerationMode = generationModeFor(record);
		assets.push(record);
	}

	const regentDir = join(PUBLIC_DIR, "generated", "compendium", "regents");
	const regentDiskFiles = existsSync(regentDir) ? readdirSync(regentDir) : [];
	const promptRecords = uniqueByPromptRecordId(
		assets
			.filter((asset) => isImagePath(asset.path))
			.filter((asset) => asset.recommendedGenerationMode !== "skip")
			.filter((asset) =>
				["high", "medium"].includes(asset.replacementPriority),
			)
			.flatMap(buildPromptRecordsForAsset),
	).sort((a, b) => {
			const priority = { high: 0, medium: 1, low: 2 };
			return (
				(priority[a.priority] ?? 3) - (priority[b.priority] ?? 3) ||
				a.assetPath.localeCompare(b.assetPath)
			);
		});

	const summary = {
		generatedAt: new Date().toISOString(),
		defaultCheckpoint: DEFAULT_CHECKPOINT,
		optionalRefiner: OPTIONAL_REFINER,
		totals: {
			uniquePaths: pathRefs.size,
			imagePaths: assets.filter((asset) => isImagePath(asset.path)).length,
			missing: missing.length,
			casingMismatch: casingMismatch.length,
			placeholderAnomalies: placeholderAnomalies.length,
			likelyPlaceholders: assets.filter((asset) =>
				["likely", "confirmed"].includes(asset.placeholderSuspicion),
			).length,
			highPriorityReplacements: assets.filter(
				(asset) => asset.replacementPriority === "high",
			).length,
			promptRecords: promptRecords.length,
		},
		categories: Array.from(byCategory.values()).sort((a, b) =>
			a.category.localeCompare(b.category),
		),
		missing: missing.sort((a, b) => a.path.localeCompare(b.path)),
		casingMismatch: casingMismatch.sort((a, b) => a.path.localeCompare(b.path)),
		placeholderAnomalies: placeholderAnomalies.sort((a, b) =>
			a.path.localeCompare(b.path),
		),
		assets: assets.sort((a, b) => a.path.localeCompare(b.path)),
		regentFolder: {
			diskPath: "public/generated/compendium/regents",
			fileCount: regentDiskFiles.length,
			files: regentDiskFiles,
		},
	};

	const replacementPlan = {
		generatedAt: summary.generatedAt,
		defaultCheckpoint: DEFAULT_CHECKPOINT,
		optionalRefiner: OPTIONAL_REFINER,
		lorePrecedence:
			"Use docs/rift-ascendant-world-lore.md for global tone; for Gloamreach assets, current Run Silent / The Quiet sandbox text wins.",
		totals: summary.totals,
		assets: summary.assets.filter((asset) => isImagePath(asset.path)),
		promptRecords,
	};

	const outJson = join(AUDIT_DIR, "assets-report.json");
	await writeTextFileWithRetry(outJson, `${JSON.stringify(summary, null, 2)}\n`);
	console.log(`[audit] Wrote ${outJson}`);

	const outMd = join(AUDIT_DIR, "SUMMARY.md");
	await writeTextFileWithRetry(outMd, buildMarkdownSummary(summary, promptRecords));
	console.log(`[audit] Wrote ${outMd}`);

	const planJson = join(PLAN_DATA_DIR, "rift-image-replacement-plan.json");
	await writeTextFileWithRetry(
		planJson,
		`${JSON.stringify(replacementPlan, null, 2)}\n`,
	);
	console.log(`[audit] Wrote ${planJson}`);

	const promptJson = join(PLAN_DATA_DIR, "rift-image-prompts.json");
	await writeTextFileWithRetry(
		promptJson,
		`${JSON.stringify(promptRecords, null, 2)}\n`,
	);
	console.log(`[audit] Wrote ${promptJson}`);

	const planMd = join(DOCS_DIR, "rift-image-replacement-plan.md");
	await writeTextFileWithRetry(planMd, buildReplacementPlanMarkdown(summary, promptRecords));
	console.log(`[audit] Wrote ${planMd}`);

	const reviewHtml = join(DOCS_DIR, "generated-image-review.html");
	await writeTextFileWithRetry(reviewHtml, buildReviewHtml(promptRecords));
	console.log(`[audit] Wrote ${reviewHtml}`);

	const reviewMd = join(DOCS_DIR, "generated-image-review.md");
	await writeTextFileWithRetry(reviewMd, buildReviewMarkdown(promptRecords));
	console.log(`[audit] Wrote ${reviewMd}`);

	console.log("");
	console.log(
		`[audit] DONE. Totals: missing=${summary.totals.missing}, casingMismatch=${summary.totals.casingMismatch}, placeholder=${summary.totals.placeholderAnomalies}, highPriority=${summary.totals.highPriorityReplacements}, prompts=${promptRecords.length}`,
	);

	const missingPaths = missing.map((m) => m.path).sort();

	if (UPDATE_BASELINE) {
		await writeTextFileWithRetry(
			BASELINE_FILE,
			`${JSON.stringify(missingPaths, null, 2)}\n`,
		);
		console.log(
			`[audit] Baseline updated: ${missingPaths.length} known-pending art paths recorded.`,
		);
		return;
	}

	const baseline = existsSync(BASELINE_FILE)
		? JSON.parse(readFileSync(BASELINE_FILE, "utf8"))
		: [];
	const baselineSet = new Set(baseline);
	const blocking = missingPaths.filter((p) => !baselineSet.has(p));
	const resolved = baseline.filter((p) => !missingPaths.includes(p));

	if (resolved.length > 0) {
		console.log(
			`[audit] ${resolved.length} baseline path(s) now present - run with --update-baseline to tighten.`,
		);
	}
	if (blocking.length > 0) {
		console.error(
			`\n[audit] REGRESSION: ${blocking.length} newly-missing asset(s) not in baseline:`,
		);
		for (const p of blocking.slice(0, 50)) console.error(`  - ${p}`);
		process.exitCode = 1;
		return;
	}
	console.log(
		`[audit] OK: no asset regressions (${baseline.length} known-pending art refs tracked).`,
	);
}

main().catch((err) => {
	console.error("[audit] FAILED:", err);
	process.exit(1);
});
