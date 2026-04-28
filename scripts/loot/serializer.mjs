// TypeScript-compatible serializer for Item / Sigil / Tattoo / Rune literals.
// Outputs tab-indented, biome-compatible code.

const FIELD_ORDER = [
	"id",
	"name",
	"display_name",
	"description",
	"rarity",
	"type",
	"image",
	"weight",
	"value",
	"item_type",
	"weapon_type",
	"damage",
	"damage_type",
	"simple_properties",
	"range",
	"armor_class",
	"armor_type",
	"stealth_disadvantage",
	"strength_requirement",
	"sigil_slots_base",
	"protocol_bonus",
	"requires_attunement",
	"essence_cost",
	"ascendant_level_required",
	"system_awakening_required",
	"shadow_soldier_compatible",
	"legendary_crafted",
	"properties",
	"effects",
	"attunement",
	"cursed",
	"charges",
	"requirements",
	"stats",
	"effect",
	"source",
	"lore",
	"flavor",
	"discovery_lore",
	"tags",
	"theme_tags",
];

function compareKeys(a, b) {
	const ia = FIELD_ORDER.indexOf(a);
	const ib = FIELD_ORDER.indexOf(b);
	if (ia === -1 && ib === -1) return a.localeCompare(b);
	if (ia === -1) return 1;
	if (ib === -1) return -1;
	return ia - ib;
}

function escapeString(s) {
	return String(s)
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
}

function indent(level) {
	return "\t".repeat(level);
}

function serializeValue(value, level) {
	if (value === null || value === undefined) return "null";
	if (typeof value === "string") return `"${escapeString(value)}"`;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) return serializeArray(value, level);
	if (typeof value === "object") return serializeObject(value, level);
	return "null";
}

function serializeArray(arr, level) {
	if (arr.length === 0) return "[]";
	// Inline if all primitive and reasonably short.
	const allPrim = arr.every(
		(v) =>
			v === null ||
			typeof v === "string" ||
			typeof v === "number" ||
			typeof v === "boolean",
	);
	if (allPrim) {
		const inline = `[${arr.map((v) => serializeValue(v, level)).join(", ")}]`;
		if (inline.length <= 100) return inline;
	}
	const inner = indent(level + 1);
	const close = indent(level);
	const parts = arr.map((v) => `${inner}${serializeValue(v, level + 1)}`);
	return `[\n${parts.join(",\n")},\n${close}]`;
}

function serializeObject(obj, level) {
	const keys = Object.keys(obj)
		.filter((k) => obj[k] !== undefined)
		.sort(compareKeys);
	if (keys.length === 0) return "{}";
	const inner = indent(level + 1);
	const close = indent(level);
	const parts = keys.map((k) => {
		const v = obj[k];
		const serialized = serializeValue(v, level + 1);
		// Use shorthand identifier keys (no quotes) — valid TS object literal syntax for these names.
		const safeKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `"${k}"`;
		return `${inner}${safeKey}: ${serialized}`;
	});
	return `{\n${parts.join(",\n")},\n${close}}`;
}

export function serializeItemLiteral(item, baseLevel = 1) {
	return serializeObject(item, baseLevel);
}

export function serializeArrayBody(items, baseLevel = 1) {
	const inner = indent(baseLevel);
	const parts = items.map((item) => `${inner}${serializeObject(item, baseLevel)}`);
	return parts.join(",\n");
}
