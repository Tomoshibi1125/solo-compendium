#!/usr/bin/env node
/**
 * audit-assets.mjs
 *
 * Walks static compendium data and runtime asset manifests, verifies local
 * asset paths, enriches image records with metadata and replacement priority,
 * then writes audit reports. Replacement art is authored by hand; RA-18
 * forbids AI generation outside initial Sovereign creation.
 *
 * Run:  node scripts/audit-assets.mjs
 * Outputs:
 *   audit/assets-report.json
 *   audit/SUMMARY.md
 *   docs/rift-image-replacement-plan.md
 *   data/rift-image-replacement-plan.json
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

const CASE_INSENSITIVE_FS = process.platform === "win32";
const IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".ogg", ".wav", ".m4a"]);

async function writeTextFileWithRetry(file, content, encoding = "utf8") {
	const delays = [75, 150, 300, 600, 1000, 1500];
	let lastError = null;
	for (const delay of [0, ...delays]) {
		if (delay > 0)
			await new Promise((resolveDelay) => setTimeout(resolveDelay, delay));
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
	const line = source.slice(
		lineStart,
		lineEnd === -1 ? source.length : lineEnd,
	);
	const match = line.match(/([A-Za-z0-9_]+)\s*:\s*["'`]/);
	return match?.[1] ?? "unknown";
}

function lastFieldValue(slice, field) {
	const re = new RegExp(
		`(?:^|[^A-Za-z0-9_])${field}\\s*:\\s*(["'])([\\s\\S]*?)\\1`,
		"g",
	);
	let last = null;
	for (let match = re.exec(slice); match !== null; match = re.exec(slice)) {
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
	const title =
		lastFieldValue(before, "title") || lastFieldValue(after, "title");
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
	for (let match = re.exec(source); match !== null; match = re.exec(source)) {
		if (!isConcreteAssetPath(match[2])) continue;
		const identity = inferRecordIdentity(source, match.index, match[2]);
		matches.push({
			path: match[2],
			index: match.index,
			line: lineNumberAt(source, match.index),
			field: inferFieldName(source, match.index),
			subject:
				identity.recordName || inferSubject(source, match.index, match[2]),
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
	for (
		let match = mapRe.exec(source);
		match !== null;
		match = mapRe.exec(source)
	) {
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
	if (file.includes("premademaps")) return "map";
	if (file.includes("tokens")) return "token";
	return "compendium";
}

function sourceRecordKeyForRef(ref) {
	const subject = cleanSubjectName(ref.subject, ref.recordName ?? "asset");
	const id =
		ref.recordId || slugify(ref.recordName || subject) || `line-${ref.line}`;
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
	if (category.includes("character") || category.includes("npc"))
		return "character";
	if (path.includes("/tokens/")) return "token";
	if (category.includes("mount")) return "mount";
	if (category.includes("vehicle")) return "vehicle";
	if (category.includes("weapon")) return "weapon";
	if (category.includes("armor")) return "armor";
	if (category.includes("anomaly")) return "anomaly";
	if (category.includes("monster")) return "monster";
	if (category.includes("regent")) return "regent";
	if (category.includes("artifact") || category.includes("relic"))
		return "relic";
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
		if (hasTerm(haystack, ["automaton", "golem", "construct"]))
			return "monster";
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

function uniqueSubjects(refs, fallback) {
	const subjectsBySlug = new Map();
	for (const ref of refs) {
		const subject = cleanSubjectName(ref.subject, fallback);
		if (!subject) continue;
		const key = slugify(subject);
		if (!subjectsBySlug.has(key)) subjectsBySlug.set(key, subject);
	}
	return (
		[...subjectsBySlug.values()].filter(Boolean).slice(0, 8).join(", ") ||
		fallback
	);
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
	if (
		assetType === "anomaly" ||
		assetType === "monster" ||
		assetType === "regent"
	)
		return { width: 1024, height: 1024 };
	return { width: 1024, height: 1024 };
}

function analyzeRecord(path, refs, category, existsInfo, metadata) {
	const assetType = assetTypeFor(path, category, refs);
	const likelySubjectName = uniqueSubjects(
		refs,
		titleCase(basename(path, extname(path))),
	);
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

	if (
		sourceFiles.includes("regentPortraits.ts") &&
		!path.includes("/regents/")
	) {
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
		reasons.push(
			"Generic generated filename suggests placeholder or pooled art.",
		);
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
		reasons.push(
			"Same generic image is reused for multiple distinct subjects.",
		);
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

function buildMarkdownSummary(summary) {
	const lines = [];
	lines.push("# Asset Audit Summary");
	lines.push("");
	lines.push(`Generated: ${summary.generatedAt}`);
	lines.push("");
	lines.push(
		`- **Unique asset paths referenced**: ${summary.totals.uniquePaths}`,
	);
	lines.push(`- **Image paths referenced**: ${summary.totals.imagePaths}`);
	lines.push(`- **Missing files on disk**: ${summary.totals.missing}`);
	lines.push(
		`- **Casing mismatches (bad on Linux)**: ${summary.totals.casingMismatch}`,
	);
	lines.push(
		`- **Anomaly placeholder pool references**: ${summary.totals.placeholderAnomalies}`,
	);
	lines.push(`- **Likely placeholders**: ${summary.totals.likelyPlaceholders}`);
	lines.push(
		`- **High-priority replacements**: ${summary.totals.highPriorityReplacements}`,
	);
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

function buildReplacementPlanMarkdown(summary) {
	const high = summary.assets.filter((a) => a.replacementPriority === "high");
	const medium = summary.assets.filter(
		(a) => a.replacementPriority === "medium",
	);
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
	lines.push("");
	lines.push(
		"Replacement art is authored by hand (RA-18: no AI generation outside Sovereign creation). Global tone comes from `docs/rift-ascendant-world-lore.md`; Gloamreach assets follow current Run Silent / The Quiet sandbox text where present.",
	);
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
		lines.push(
			`- Recommended size: ${asset.recommendedDimensions.width}x${asset.recommendedDimensions.height}`,
		);
		lines.push("");
	}
	lines.push("## Medium Priority");
	lines.push("");
	for (const asset of medium.slice(0, 100)) {
		lines.push(
			`- \`${asset.path}\` - ${asset.likelySubjectName}: ${asset.reason}`,
		);
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
		join(ROOT, "src", "data", "premadeMaps.ts"),
		join(ROOT, "src", "data", "tokens.ts"),
		join(ROOT, "src", "lib", "audio", "hooks.ts"),
		join(ROOT, "src", "pages", "AscendantTools.tsx"),
		join(ROOT, "src", "components", "ui", "AscendantWindow.tsx"),
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
		const metadata = await imageMetadata(
			existsInfo.abs,
			existsInfo.exists,
			path,
		);
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
			recommendedDimensions: dims,
		};
		assets.push(record);
	}

	const regentDir = join(PUBLIC_DIR, "generated", "compendium", "regents");
	const regentDiskFiles = existsSync(regentDir) ? readdirSync(regentDir) : [];

	const summary = {
		generatedAt: new Date().toISOString(),
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
		lorePrecedence:
			"Use docs/rift-ascendant-world-lore.md for global tone; for Gloamreach assets, current Run Silent / The Quiet sandbox text wins.",
		totals: summary.totals,
		assets: summary.assets.filter((asset) => isImagePath(asset.path)),
	};

	const outJson = join(AUDIT_DIR, "assets-report.json");
	await writeTextFileWithRetry(
		outJson,
		`${JSON.stringify(summary, null, 2)}\n`,
	);
	console.log(`[audit] Wrote ${outJson}`);

	const outMd = join(AUDIT_DIR, "SUMMARY.md");
	await writeTextFileWithRetry(outMd, buildMarkdownSummary(summary));
	console.log(`[audit] Wrote ${outMd}`);

	const planJson = join(PLAN_DATA_DIR, "rift-image-replacement-plan.json");
	await writeTextFileWithRetry(
		planJson,
		`${JSON.stringify(replacementPlan, null, 2)}\n`,
	);
	console.log(`[audit] Wrote ${planJson}`);

	const planMd = join(DOCS_DIR, "rift-image-replacement-plan.md");
	await writeTextFileWithRetry(planMd, buildReplacementPlanMarkdown(summary));
	console.log(`[audit] Wrote ${planMd}`);

	console.log("");
	console.log(
		`[audit] DONE. Totals: missing=${summary.totals.missing}, casingMismatch=${summary.totals.casingMismatch}, placeholder=${summary.totals.placeholderAnomalies}, highPriority=${summary.totals.highPriorityReplacements}`,
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
