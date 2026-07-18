/**
 * Unified resource tracking — pure helpers behind the auto-populated
 * "Resources" section of the character sheet.
 *
 * Three families of resources feed the tracker:
 *   1. Job pools (Flux Pool, Impulse Points, …) — persisted as
 *      `custom_resources` rows on character_sheet_state (origin "job-pool"),
 *      auto-seeded/reconciled here so they exist without user setup and
 *      recharge through the existing applyResourceRest path.
 *   2. Equipment-backed rows (ammunition, consumables, charged items) —
 *      derived live from character_equipment; adjusting writes back to the
 *      equipment row (quantity / charges_current), so the inventory, the
 *      attack cards, and the tracker can never drift apart.
 *   3. User-created custom rows (origin "manual") — untouched by
 *      reconciliation.
 *
 * Also home to the starting-equipment pack-quantity parser (DDB parity:
 * "Arrows (20)" must land as 20 arrows, not one).
 */

import { getAbilityModifier, getProficiencyBonus } from "@/lib/5eRulesEngine";
import type { CustomResource } from "@/lib/characterResources";
import { GENERIC_AMMO_RE } from "@/lib/weaponAutomation";

// ── Job resource pools ────────────────────────────────────────────────

export interface JobPoolCharacterShape {
	level?: number | null;
	strength?: number | null;
	agility?: number | null;
	vitality?: number | null;
	presence?: number | null;
	intelligence?: number | null;
	sense?: number | null;
}

export interface JobResourceDef {
	jobMatch: (job: string) => boolean;
	id: string;
	label: string;
	description: string;
	maxFromCharacter: (character: JobPoolCharacterShape) => number;
	recovery: "short-rest" | "long-rest";
}

/**
 * Map a characters row (short DB columns: str/agi/vit/int/sense/pre) to the
 * full-name JobPoolCharacterShape the pool formulas read.
 *
 * The hook used to cast the row directly, so `c.intelligence` etc. were
 * always undefined and every ability-scaled pool computed from a phantom
 * score of 10 (level-1 Revenant Remnants showed 2 instead of INT mod + PB;
 * Idol Hype Dice were stuck at 1). Rows that already carry full-name fields
 * (tests, future shapes) pass through unchanged.
 */
export function characterRowToJobPoolShape(
	row: Partial<JobPoolCharacterShape> & {
		level?: number | null;
		str?: number | null;
		agi?: number | null;
		vit?: number | null;
		int?: number | null;
		sense?: number | null;
		pre?: number | null;
	},
): JobPoolCharacterShape {
	return {
		level: row.level,
		strength: row.strength ?? row.str,
		agility: row.agility ?? row.agi,
		vitality: row.vitality ?? row.vit,
		intelligence: row.intelligence ?? row.int,
		sense: row.sense,
		presence: row.presence ?? row.pre,
	};
}

const mod = (score: number | null | undefined): number =>
	getAbilityModifier(score ?? 10);

// Job-specific resource catalog. The formulas mirror what's described in the
// job's class features prose; users can adjust max manually after creation.
// Slot-caster jobs (Mage, Technomancer, Contractor) have no entry — spell
// slots are their pool. Stalker's limited-use features carry structured uses
// on character_features and are tracked there.
export const JOB_RESOURCES: JobResourceDef[] = [
	{
		jobMatch: (job) => job.toLowerCase() === "esper",
		id: "flux-pool",
		label: "Flux Pool",
		description:
			"Internal flux reactor. Overcharge spells, absorb slots into flux, or manifest slots from flux.",
		maxFromCharacter: (c) => Math.max(1, c.level ?? 1),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "idol",
		id: "hype-dice",
		label: "Hype Dice",
		description:
			"Amplifying frequency broadcast. Grant a hype die to allies' rolls.",
		maxFromCharacter: (c) => Math.max(1, mod(c.presence)),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "herald",
		id: "mantra-reservoir",
		label: "Mantra Reservoir",
		description:
			"Reservoir of Absolute resonance — spend to restore HP or grant resistance.",
		maxFromCharacter: (c) => Math.max(1, (c.level ?? 1) * 5),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "revenant",
		id: "remnant-pool",
		label: "Remnants",
		description:
			"Severed life-essence reclaimed at the instant of death under Marthos's End-Cycle mandate. Spend to heal, gain temporary HP, blunt incoming damage, reroll a failed save, or refuse death.",
		maxFromCharacter: (c) => {
			const lvl = c.level ?? 1;
			const prof = getProficiencyBonus(lvl);
			return Math.max(1, mod(c.intelligence) + prof);
		},
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "summoner",
		id: "biome-charges",
		label: "Biome Command",
		description: "Reshape local environment in a 60-ft radius.",
		maxFromCharacter: (c) => ((c.level ?? 1) >= 14 ? 2 : 1),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) =>
			job.toLowerCase() === "holy-knight" ||
			job.toLowerCase() === "holy knight",
		id: "oath-channel",
		label: "Channel Oath",
		description: "Once per short rest, invoke your oath's authority.",
		maxFromCharacter: () => 1,
		recovery: "short-rest",
	},
	{
		// Berserker — Overload State (2/long rest, scaling toward unlimited at
		// 20th per the class feature). Stored Feedback rides on top in play.
		jobMatch: (job) => job.toLowerCase() === "berserker",
		id: "overload-charges",
		label: "Overload",
		description:
			"Trigger an Absolute Surge: melee bonus, damage resistance, and temporary HP while overloaded. Stored Feedback releases on your next hit.",
		maxFromCharacter: (c) => {
			const lvl = c.level ?? 1;
			if (lvl >= 20) return 99;
			return lvl >= 17 ? 4 : lvl >= 6 ? 3 : 2;
		},
		recovery: "long-rest",
	},
	{
		// Striker — Impulse points = Striker level, recharged on a short rest
		// (Rite of Speed / Force / Iron each spend 1).
		jobMatch: (job) => job.toLowerCase() === "striker",
		id: "impulse-points",
		label: "Impulse Points",
		description:
			"Channel kinetic force through your nerve gates — spend on Rites of Speed, Force, or Iron.",
		maxFromCharacter: (c) => Math.max(1, c.level ?? 1),
		recovery: "short-rest",
	},
	{
		// Destroyer — Adrenaline (Adrenal Flux / Adrenaline Burst, recovered on a
		// short rest). Proficiency-bonus uses approximates the once/short-rest
		// surge that scales with tier.
		jobMatch: (job) => job.toLowerCase() === "destroyer",
		id: "adrenaline-surge",
		label: "Adrenaline",
		description:
			"Overclock your spirit-fueled adrenal core: surge damage and absorb impact as built-in spirit armor.",
		maxFromCharacter: (c) => 2 + Math.floor(((c.level ?? 1) - 1) / 4),
		recovery: "short-rest",
	},
	{
		// Assassin — Killing Focus. The class has no single named pool; this
		// models the Aetheric-Mark / Essence-Harvest economy as an AGI-scaled
		// short-rest focus (flagged for review).
		jobMatch: (job) => job.toLowerCase() === "assassin",
		id: "killing-focus",
		label: "Killing Focus",
		description:
			"Predatory focus spent to apply Aetheric Marks and convert kills into renewed lethality.",
		maxFromCharacter: (c) => Math.max(1, mod(c.agility)),
		recovery: "short-rest",
	},
];

export const jobPoolSourceKey = (defId: string): string => `job-pool:${defId}`;

export interface JobPoolReconcileResult {
	/** New rows to append to custom_resources. */
	additions: CustomResource[];
	/** Patches to existing rows, keyed by row id. */
	updates: Array<Partial<CustomResource> & { id: string }>;
}

/**
 * Diff the character's expected job pools against the stored custom
 * resources. Seeds missing pools (full), re-derives max when level/abilities
 * changed (clamping current), and adopts legacy rows that share the pool's
 * name but predate sourceKey tagging. Returns null when nothing needs to
 * change, so callers can skip the save entirely.
 */
export function reconcileJobPools(
	job: string | null | undefined,
	character: JobPoolCharacterShape,
	customResources: readonly CustomResource[],
): JobPoolReconcileResult | null {
	const jobName = (job ?? "").trim();
	if (!jobName) return null;

	const additions: CustomResource[] = [];
	const updates: JobPoolReconcileResult["updates"] = [];

	for (const def of JOB_RESOURCES.filter((d) => d.jobMatch(jobName))) {
		const sourceKey = jobPoolSourceKey(def.id);
		const expectedMax = def.maxFromCharacter(character);
		const existing =
			customResources.find((r) => r.sourceKey === sourceKey) ??
			// Legacy adoption: pre-sourceKey rows (old localStorage tracker or
			// manual re-creations) are matched by name so we never duplicate.
			customResources.find(
				(r) => r.name.trim().toLowerCase() === def.label.toLowerCase(),
			);

		if (!existing) {
			additions.push({
				id: crypto.randomUUID(),
				name: def.label,
				current: expectedMax,
				max: expectedMax,
				recharge: def.recovery,
				notes: def.description,
				origin: "job-pool",
				sourceKey,
			});
			continue;
		}

		const patch: Partial<CustomResource> & { id: string } = {
			id: existing.id,
		};
		let dirty = false;
		if (existing.sourceKey !== sourceKey) {
			patch.sourceKey = sourceKey;
			patch.origin = "job-pool";
			patch.recharge = def.recovery;
			dirty = true;
		}
		if (existing.max !== expectedMax) {
			patch.max = expectedMax;
			patch.current = Math.min(existing.current, expectedMax);
			dirty = true;
		}
		if (dirty) updates.push(patch);
	}

	if (additions.length === 0 && updates.length === 0) return null;
	return { additions, updates };
}

/** Apply a reconcile result to a custom_resources array (pure). */
export function applyJobPoolReconcile(
	customResources: readonly CustomResource[],
	result: JobPoolReconcileResult,
): CustomResource[] {
	const patchById = new Map(result.updates.map((u) => [u.id, u]));
	const patched = customResources.map((row) => {
		const patch = patchById.get(row.id);
		return patch ? { ...row, ...patch } : row;
	});
	return [...patched, ...result.additions];
}

// ── Equipment-backed resources ────────────────────────────────────────

const CONSUMABLE_NAME_RE =
	/\b(potion|elixir|antitoxin|scroll|bomb|grenade|flask|vial|ration)s?\b/i;

export type EquipmentResourceKind = "ammunition" | "consumable" | "charges";

export interface EquipmentResourceRowLike {
	id: string;
	name: string;
	item_type: string;
	quantity: number | null;
	charges_current: number | null;
	charges_max: number | null;
}

export interface EquipmentResourceEntry {
	equipmentId: string;
	name: string;
	kind: EquipmentResourceKind;
	current: number;
	/** Cap for charges; null for open-ended quantity stacks. */
	max: number | null;
	/** Which equipment column an adjustment writes to. */
	column: "quantity" | "charges_current";
}

const NON_AMMO_ITEM_TYPES = new Set(["weapon", "armor", "shield"]);

/**
 * Classify inventory rows into tracker sections. Precedence per row:
 * charged item (charges_max set) → ammunition (name matches the attack
 * matcher, excluding weapons/armor themselves) → consumable (item_type or
 * classic consumable name). Rows that match nothing are not resources.
 */
export function classifyEquipmentResources(
	rows: readonly EquipmentResourceRowLike[],
): EquipmentResourceEntry[] {
	const entries: EquipmentResourceEntry[] = [];

	for (const row of rows) {
		if (row.charges_max !== null && row.charges_max > 0) {
			entries.push({
				equipmentId: row.id,
				name: row.name,
				kind: "charges",
				current: Math.max(0, row.charges_current ?? row.charges_max),
				max: row.charges_max,
				column: "charges_current",
			});
			continue;
		}

		const type = (row.item_type ?? "").toLowerCase();
		if (!NON_AMMO_ITEM_TYPES.has(type) && GENERIC_AMMO_RE.test(row.name)) {
			entries.push({
				equipmentId: row.id,
				name: row.name,
				kind: "ammunition",
				current: Math.max(0, row.quantity ?? 0),
				max: null,
				column: "quantity",
			});
			continue;
		}

		if (type === "consumable" || CONSUMABLE_NAME_RE.test(row.name)) {
			entries.push({
				equipmentId: row.id,
				name: row.name,
				kind: "consumable",
				current: Math.max(0, row.quantity ?? 0),
				max: null,
				column: "quantity",
			});
		}
	}

	return entries;
}

// ── Legacy localStorage tracker migration ─────────────────────────────

/** Shape of the retired `sa-tracked-resources-*` localStorage rows. */
export interface LegacyTrackedResource {
	id?: string;
	name?: unknown;
	category?: string;
	current?: number;
	max?: number | null;
	recovery?: string;
	notes?: string;
}

const LEGACY_RECOVERY_TO_RECHARGE: Record<string, CustomResource["recharge"]> =
	{
		"short-rest": "short-rest",
		"long-rest": "long-rest",
		dawn: "daily",
		manual: "none",
		none: "none",
	};

/**
 * Convert legacy localStorage tracker rows into custom_resources additions.
 * Rows whose name already exists (case-insensitive) are skipped — the job-pool
 * reconciler then adopts any migrated pool rows by name.
 */
export function migrateLocalTrackedResources(
	legacyRows: readonly LegacyTrackedResource[],
	existing: readonly CustomResource[],
): CustomResource[] {
	const taken = new Set(existing.map((r) => r.name.trim().toLowerCase()));
	const additions: CustomResource[] = [];

	for (const row of legacyRows) {
		if (typeof row.name !== "string" || !row.name.trim()) continue;
		const key = row.name.trim().toLowerCase();
		if (taken.has(key)) continue;
		taken.add(key);

		const max =
			typeof row.max === "number" && Number.isFinite(row.max) && row.max > 0
				? row.max
				: Math.max(0, row.current ?? 0);
		additions.push({
			id: crypto.randomUUID(),
			name: row.name.trim(),
			current: Math.max(0, Math.min(row.current ?? max, max || Infinity)),
			max,
			recharge: LEGACY_RECOVERY_TO_RECHARGE[row.recovery ?? "none"] ?? "none",
			notes: row.notes,
			origin: "migrated",
		});
	}

	return additions;
}

// ── Starting-equipment pack quantities ────────────────────────────────

export interface EquipmentGrant {
	name: string;
	quantity: number;
}

const PACK_SUFFIX_RE = /\((\d+)\)\s*$/;
const OF_N_RE = /\bof\s+(\d+)\s+\w+/i;
const QUIVER_OF_ARROWS_RE = /^quiver of (\d+) arrows$/i;
const NUMERIC_AMMO_RE = /^(\d+)\s+(bolts?|arrows?)$/i;
const WORD_COUNT_RE = /^(two|three|four|five)\s+(.+)$/i;
const WORD_COUNTS: Record<string, number> = {
	two: 2,
	three: 3,
	four: 4,
	five: 5,
};
// Choice-of-any placeholders ("Two Simple Melee Weapons", "Any simple weapon")
// name a category, not an item — never expand them into counted grants.
const CATEGORY_PLACEHOLDER_RE = /\b(any|simple|martial)\b.*weapons?$/i;

/**
 * Real quantity for a pack-named item. "Arrows (20)" → 20 (name kept — it is
 * the canonical compendium name), "Quiver of 20 Arrows" → 20. Plain names → 1.
 */
export function parsePackQuantity(name: string): EquipmentGrant {
	const trimmed = name.trim();
	const suffix = trimmed.match(PACK_SUFFIX_RE);
	if (suffix) return { name: trimmed, quantity: parseInt(suffix[1], 10) };
	const ofN = trimmed.match(OF_N_RE);
	if (ofN) return { name: trimmed, quantity: parseInt(ofN[1], 10) };
	return { name: trimmed, quantity: 1 };
}

/**
 * Expand a starting-equipment grant string into concrete item grants.
 * Handles "A and B" compounds, maps "Quiver of N Arrows" onto the canonical
 * "Arrows (N)" item (the quiver is part of that item — see its compendium
 * description), bare ammo counts ("20 bolts" → "Crossbow Bolts (20)"), and
 * word-number multiples ("Two Daggers" → Dagger ×2). Callers should only
 * expand names that did not resolve directly in the compendium.
 */
export function expandEquipmentGrant(raw: string): EquipmentGrant[] {
	const parts = raw
		.split(/\s+and\s+/i)
		.map((p) => p.trim())
		.filter(Boolean);

	return parts.map((part) => {
		const quiver = part.match(QUIVER_OF_ARROWS_RE);
		if (quiver) {
			return {
				name: `Arrows (${quiver[1]})`,
				quantity: parseInt(quiver[1], 10),
			};
		}
		const ammo = part.match(NUMERIC_AMMO_RE);
		if (ammo) {
			const isBolt = /^bolt/i.test(ammo[2]);
			return {
				name: `${isBolt ? "Crossbow Bolts" : "Arrows"} (${ammo[1]})`,
				quantity: parseInt(ammo[1], 10),
			};
		}
		const counted = part.match(WORD_COUNT_RE);
		if (counted && !CATEGORY_PLACEHOLDER_RE.test(part)) {
			return {
				name: counted[2].replace(/s$/i, ""),
				quantity: WORD_COUNTS[counted[1].toLowerCase()] ?? 1,
			};
		}
		return parsePackQuantity(part);
	});
}
