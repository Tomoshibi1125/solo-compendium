import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";

/**
 * Detail-view field-completeness guard (audit Part 2 — DDB-style "show what is
 * there"). For each compendium category, every meaningful field PRESENT in the
 * data (in the SAME normalized shape the detail view consumes via
 * `staticDataProvider`) must be surfaced by that view. Reads the component
 * source and asserts it references every populated key, minus an allowlist of
 * internal/non-display keys (each allowlisted with a reason).
 *
 * Uses provider-normalized entries (NOT raw data exports) so the key set
 * matches what the view actually receives — avoiding camelCase/snake_case
 * false positives from the provider's normalization layer.
 *
 * Heuristic: a key counts as rendered if the source references `.key`, "key",
 * 'key', key:, or [key]. A new populated field no view renders fails this test
 * → forces a deliberate render-or-allowlist decision.
 */

const ROOT = resolve(__dirname, "../../..");
const compSource = (name: string) =>
	readFileSync(resolve(ROOT, `src/components/compendium/${name}`), "utf8");

const GLOBAL_ALLOW = new Set<string>([
	"id",
	"slug",
	"image",
	"image_url",
	"icon",
	"created_at",
	"updated_at",
	"display_name", // rendered via name
	"theme_tags", // internal search aid; user-facing tags use `tags`
	"search_text",
	"normalized_name",
	"compendiumId",
	"compendium_id",
	"is_homebrew",
	"homebrew_id",
	"user_id",
	"campaign_id",
	"sort_order",
	"version",
	"type", // entry-type discriminator (routing), not a display field per se
	"source", // alias of source_book where present
	"source_kind", // provenance metadata
	"source_name",
	"generated_reason", // generator provenance
	"license_note",
	"avatar_id",
	"aliases", // search aliases
]);

interface Category {
	name: string;
	component: string;
	load: () => Promise<readonly unknown[]>;
	allow?: string[];
}

const p = staticDataProvider;

// Fields the provider INJECTS as cross-category normalization aliases (a single
// castable/item normalizer adds these to every entry). They are not meaningful
// display content for the category and/or duplicate a rendered field.
const CASTABLE_NORMALIZATION = [
	"power_type",
	"power_level",
	"level",
	"school",
	"has_attack_roll",
	"has_save",
	"saving_throw_ability",
	"save_ability",
	"spell_attack",
	"theme", // injected on castables; real themed entries render it explicitly
	"title",
];
const ITEM_NORMALIZATION = [
	"item_type",
	"equipment_type",
	"item_properties", // alias of `properties`
	"weapon_type",
	"armor_type",
	"sigil_slots_base",
	"simple_properties",
];

const categories: Category[] = [
	{
		name: "spells",
		component: "SpellDetail.tsx",
		load: () => p.getSpells(""),
		allow: ["effect", "activation", ...CASTABLE_NORMALIZATION],
	},
	{
		name: "powers",
		component: "PowerDetail.tsx",
		load: () => p.getPowers(""),
		allow: ["activation", "activation_time", ...CASTABLE_NORMALIZATION],
	},
	{
		name: "techniques",
		component: "TechniqueDetail.tsx",
		load: () => p.getTechniques(""),
		allow: ["activation", ...CASTABLE_NORMALIZATION],
	},
	{
		name: "feats",
		component: "FeatDetail.tsx",
		load: () => p.getFeats(""),
		allow: ["limitations", "benefits", "mechanics", ...CASTABLE_NORMALIZATION],
	},
	{
		name: "items",
		component: "ItemDetail.tsx",
		load: () => p.getItems(""),
		allow: ["limitations", "activation", ...ITEM_NORMALIZATION],
	},
	{
		name: "anomalies",
		component: "AnomalyDetail.tsx",
		load: () => p.getAnomalies(""),
		allow: [
			"stats",
			"actions",
			"traits",
			"Anomaly_actions",
			"Anomaly_traits",
			"is_boss",
		],
	},
	// Regent provider injects `regent_*`-prefixed aliases of class fields.
	{
		name: "regents",
		component: "RegentDetail.tsx",
		load: () => p.getRegents(""),
		allow: [
			"progression_table",
			"abilities",
			"features",
			"regent_abilities",
			"regent_features",
			"regent_mechanics",
			"regent_theme",
			"regent_title",
		],
	},
	{
		name: "backgrounds",
		component: "BackgroundDetail.tsx",
		load: () => p.getBackgrounds(""),
		allow: ["rank", "rarity"],
	},
	{
		name: "runes",
		component: "RuneDetail.tsx",
		load: () => p.getRunes(""),
		allow: [
			"activation_cost",
			"activation_cost_amount",
			"effect_type",
			...CASTABLE_NORMALIZATION,
		],
	},
	{
		name: "sigils",
		component: "SigilDetail.tsx",
		load: () => p.getSigils(""),
		allow: [
			"effect_type",
			"inscription_difficulty",
			"rune_category",
			"rune_level",
			"rune_type",
		],
	},
	{
		name: "tattoos",
		component: "TattooDetail.tsx",
		load: () => p.getTattoos(""),
		allow: [],
	},
	{
		name: "relics",
		component: "RelicDetail.tsx",
		load: () => p.getRelics(""),
		allow: ["activation", "limitations", ...ITEM_NORMALIZATION],
	},
	{
		name: "conditions",
		component: "ConditionDetail.tsx",
		load: () => p.getConditions(""),
		allow: [],
	},
	{
		name: "skills",
		component: "SkillDetail.tsx",
		load: () => p.getSkills(""),
		allow: [],
	},
	{
		name: "jobs",
		component: "JobDetail.tsx",
		load: () => p.getJobs(""),
		allow: [],
	},
	{
		name: "paths",
		component: "PathDetail.tsx",
		load: () => p.getPaths(""),
		allow: ["jobId"], // internal parent-job id; job_name is the displayed value
	},
	{
		name: "artifacts",
		component: "ArtifactDetail.tsx",
		load: () => p.getArtifacts(""),
		// power_level/school/theme/title are castable-normalization aliases the
		// provider injects on artifacts; not real artifact content.
		allow: [...CASTABLE_NORMALIZATION],
	},
	{
		// Equipment renders item data (CompendiumItem) via EquipmentDetail.
		name: "equipment",
		component: "EquipmentDetail.tsx",
		load: () => p.getItems(""),
		allow: [...ITEM_NORMALIZATION],
	},
	{
		name: "vehicles",
		component: "VehicleDetail.tsx",
		load: () => p.getVehicles(""),
		allow: ["anomaly_id"], // internal link id (mount→source anomaly)
	},
	{
		name: "pantheon",
		component: "DeityDetail.tsx",
		load: () => p.getPantheon(""),
		allow: [],
	},
	{
		name: "locations",
		component: "LocationDetail.tsx",
		load: () => p.getLocations(""),
		allow: [],
	},
	{
		name: "shadow-soldiers",
		component: "ShadowSoldierDetail.tsx",
		load: () => p.getShadowSoldiers(""),
		allow: [],
	},
];

const isPopulated = (v: unknown): boolean => {
	if (v === null || v === undefined) return false;
	if (typeof v === "string") return v.trim().length > 0;
	if (Array.isArray(v)) return v.length > 0;
	if (typeof v === "object") return Object.keys(v as object).length > 0;
	return true;
};

const referencesKey = (source: string, key: string): boolean => {
	const re = new RegExp(`[.\\["']${key}\\b|\\b${key}\\s*[:}]`);
	return re.test(source);
};

describe("detail-view field completeness (DDB-style)", () => {
	for (const cat of categories) {
		it(`${cat.name}: detail view renders every populated data field`, async () => {
			const source = compSource(cat.component);
			const allow = new Set([...GLOBAL_ALLOW, ...(cat.allow ?? [])]);
			const entries = (await cat.load()) as Array<Record<string, unknown>>;

			const populated = new Set<string>();
			for (const entry of entries) {
				for (const [k, v] of Object.entries(entry)) {
					if (isPopulated(v)) populated.add(k);
				}
			}

			const dropped = [...populated]
				.filter((k) => !allow.has(k))
				.filter((k) => !referencesKey(source, k))
				.sort();

			expect(
				dropped,
				`${cat.component} does not surface populated data field(s): ${dropped.join(
					", ",
				)}. Render them or add to the category allowlist with a reason.`,
			).toEqual([]);
		}, 20000);
	}
});
