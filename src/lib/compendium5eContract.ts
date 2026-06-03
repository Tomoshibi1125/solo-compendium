/**
 * Per-category 5e (2014) completeness contract.
 *
 * The compendium audit imports these validators to enforce that every entry
 * carries the full set of fields 5e expects for its category AND that the
 * numbers obey 5e math (monster CR table, spell save DC, weapon property
 * legality, armor AC formula). Rift Ascendant reskins the six abilities
 * (STR/AGI/VIT/INT/SENSE/PRE) but the structural requirements are 5e's.
 *
 * Each validator is pure: it takes a loose record (the provider-shaped entry)
 * and returns `ContractIssue[]`. The audit wraps these into its own
 * `CompendiumAuditIssue` shape (adding dataset + entry id/name).
 */
import { singleMonsterXpBudget } from "@/lib/encounterMath";
import { getCRXP } from "@/lib/experience";
import {
	getMonsterCrStats,
	numericCrToLabel,
	RANK_CR_BANDS,
} from "@/lib/monster5eTable";

export interface ContractIssue {
	code: string;
	message: string;
}

type Rec = Record<string, unknown>;

const isRecord = (v: unknown): v is Rec =>
	!!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string | null =>
	typeof v === "string" && v.trim().length > 0 ? v : null;
const num = (v: unknown): number | null =>
	typeof v === "number" && Number.isFinite(v) ? v : null;
const arr = (v: unknown): unknown[] | null => (Array.isArray(v) ? v : null);
const hasArrayField = (v: unknown): boolean => Array.isArray(v);

// ─────────────────────────────────────────────────────────────────────────
// Anomaly / monster statblock contract + 5e math
// ─────────────────────────────────────────────────────────────────────────

const VALID_SIZES = new Set([
	"tiny",
	"small",
	"medium",
	"large",
	"huge",
	"gargantuan",
]);

const RA_ABILITIES = ["str", "agi", "vit", "int", "sense", "pre"] as const;

const readCr = (e: Rec): string | null => {
	const direct =
		str(e.cr) ??
		(num(e.cr) != null ? numericCrToLabel(num(e.cr) as number) : null);
	if (direct) return direct;
	const cr2 = e.challenge_rating;
	if (str(cr2)) return str(cr2);
	if (num(cr2) != null) return numericCrToLabel(cr2 as number);
	const stats = isRecord(e.stats) ? e.stats : null;
	if (stats) {
		const sc = stats.challenge_rating;
		if (str(sc)) return str(sc);
		if (num(sc) != null) return numericCrToLabel(sc as number);
	}
	return null;
};

const readHp = (e: Rec): number | null =>
	num(e.hit_points_average) ?? num(e.hp) ?? num(e.hit_points);

const readPb = (e: Rec): number | null => {
	if (num(e.proficiency_bonus) != null) return num(e.proficiency_bonus);
	const stats = isRecord(e.stats) ? e.stats : null;
	return stats ? num(stats.proficiency_bonus) : null;
};

const readAbilityScores = (e: Rec): Partial<Record<string, number>> => {
	const out: Record<string, number> = {};
	for (const a of RA_ABILITIES) {
		const top = num(e[a]);
		if (top != null) out[a] = top;
	}
	const stats = isRecord(e.stats) ? e.stats : null;
	const scores =
		stats && isRecord(stats.ability_scores) ? stats.ability_scores : null;
	if (scores) {
		const map: Record<string, string> = {
			strength: "str",
			agility: "agi",
			vitality: "vit",
			intelligence: "int",
			sense: "sense",
			presence: "pre",
		};
		for (const [long, shortKey] of Object.entries(map)) {
			if (out[shortKey] == null && num(scores[long]) != null) {
				out[shortKey] = num(scores[long]) as number;
			}
		}
	}
	return out;
};

const readActions = (e: Rec): Rec[] => {
	const a = arr(e.Anomaly_actions) ?? arr(e.actions);
	return (a ?? []).filter(isRecord) as Rec[];
};

const readSensesText = (e: Rec): string | null => {
	if (str(e.senses)) return str(e.senses);
	if (isRecord(e.senses)) {
		const t = str((e.senses as Rec).text);
		if (t) return t;
		const vals = Object.values(e.senses as Rec)
			.map((v) => (typeof v === "string" ? v : ""))
			.join(" ");
		return vals.trim().length > 0 ? vals : null;
	}
	if (Array.isArray(e.senses)) return (e.senses as unknown[]).join(", ");
	return null;
};

const readLanguages = (e: Rec): string | null => {
	if (str(e.languages)) return str(e.languages);
	if (Array.isArray(e.languages) && e.languages.length > 0)
		return (e.languages as unknown[]).join(", ");
	return null;
};

const readRank = (e: Rec): string | null =>
	str(e.rank) ?? str(e.gate_rank) ?? null;

/**
 * Full monster statblock + 5e math validator. Reads the provider-shaped
 * anomaly entry. Tolerant of field aliases so it also works on raw data in
 * tests.
 */
export function validateMonsterStatblock(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const push = (code: string, message: string) =>
		issues.push({ code, message });

	// --- Identity / descriptive fields ---
	const size = str(e.size)?.toLowerCase();
	if (!size) push("monster_missing_size", "Monster missing size.");
	else if (!VALID_SIZES.has(size))
		push("monster_invalid_size", `Monster size "${e.size}" is not a 5e size.`);

	// The provider surfaces the creature type as `creature_type`; raw data uses
	// `type`. Accept either.
	if (!str(e.type) && !str(e.creature_type))
		push("monster_missing_type", "Monster missing creature type.");
	if (!str(e.alignment))
		push("monster_missing_alignment", "Monster missing alignment.");

	// --- Defenses --- (tolerant of raw `ac` and provider `armor_class`)
	const ac = num(e.armor_class) ?? num(e.ac);
	if (ac == null || ac <= 0)
		push("monster_missing_ac", "Monster missing positive armor_class.");
	// DDB renders "AC {n} ({source})" — a source descriptor is always shown.
	if (!str(e.ac_source) && !str(e.armor_type))
		push("monster_missing_ac_source", "Monster missing AC source descriptor.");
	const hp = readHp(e);
	if (hp == null || hp <= 0)
		push("monster_missing_hp", "Monster missing positive hit points.");
	// DDB renders HP as "avg (NdX ± mod)" — a hit-dice formula is always shown.
	const hitDice = str(e.hit_dice) ?? str(e.hit_points_formula);
	if (!hitDice || !/\d+d\d+/i.test(hitDice))
		push(
			"monster_missing_hit_dice",
			"Monster missing a hit-dice formula (e.g. '45 (6d10 + 12)').",
		);

	// Speed: a walk speed (or an explicit speed value/record) must exist.
	const hasSpeed =
		num(e.speed) != null ||
		str(e.speed) != null ||
		num(e.speed_walk) != null ||
		isRecord(e.speed) ||
		num(isRecord(e.stats) ? (e.stats as Rec).speed : null) != null;
	if (!hasSpeed) push("monster_missing_speed", "Monster missing speed.");

	// --- Ability scores: all six ---
	const scores = readAbilityScores(e);
	const missingAbilities = RA_ABILITIES.filter((a) => scores[a] == null);
	if (missingAbilities.length > 0)
		push(
			"monster_missing_ability_scores",
			`Monster missing ability scores: ${missingAbilities.join(", ").toUpperCase()}.`,
		);

	// --- Skills --- (DDB shows "Skills Perception +4, Stealth +5"). Tolerant of
	// top-level `skills` (provider) and `stats.skills` (raw).
	const skills = isRecord(e.skills)
		? e.skills
		: isRecord(e.stats) && isRecord((e.stats as Rec).skills)
			? ((e.stats as Rec).skills as Rec)
			: null;
	if (!skills || Object.keys(skills).length === 0)
		push("monster_missing_skills", "Monster missing proficient skills.");

	// --- Damage / condition relations: fields must be present (arrays) ---
	if (!hasArrayField(e.damage_resistances))
		push(
			"monster_missing_damage_resistances",
			"Monster missing damage_resistances array.",
		);
	if (!hasArrayField(e.damage_immunities))
		push(
			"monster_missing_damage_immunities",
			"Monster missing damage_immunities array.",
		);
	if (!hasArrayField(e.damage_vulnerabilities))
		push(
			"monster_missing_damage_vulnerabilities",
			"Monster missing damage_vulnerabilities array.",
		);
	if (!hasArrayField(e.condition_immunities))
		push(
			"monster_missing_condition_immunities",
			"Monster missing condition_immunities array.",
		);

	// --- Senses (+ passive Perception) and languages ---
	const senses = readSensesText(e);
	if (!senses) push("monster_missing_senses", "Monster missing senses.");
	else if (!/passive perception/i.test(senses))
		push(
			"monster_senses_missing_passive_perception",
			"Monster senses must include a passive Perception value.",
		);
	if (!readLanguages(e))
		push(
			"monster_missing_languages",
			'Monster missing languages (use "—" if none).',
		);

	// --- Traits + actions present ---
	const traits = arr(e.Anomaly_traits) ?? arr(e.traits) ?? [];
	if (traits.length === 0)
		push("monster_missing_traits", "Monster has no traits.");
	const actions = readActions(e);
	if (actions.length === 0)
		push("monster_missing_actions", "Monster has no actions.");

	// --- No duplicate actions within the statblock ---
	const seen = new Map<string, string>();
	for (const a of actions) {
		const sig = (str(a.description) ?? "")
			.toLowerCase()
			.replace(/\s+/g, " ")
			.trim();
		if (!sig) continue;
		if (seen.has(sig)) {
			push(
				"monster_duplicate_action",
				`Actions "${seen.get(sig)}" and "${str(a.name) ?? "?"}" share an identical effect description.`,
			);
		} else {
			seen.set(sig, str(a.name) ?? "?");
		}
	}

	// --- CR / XP / PB and the 5e math invariants ---
	const cr = readCr(e);
	if (!cr) {
		push("monster_missing_cr", "Monster missing challenge_rating.");
		return issues; // can't run math checks without CR
	}
	const table = getMonsterCrStats(cr);
	if (!table) {
		push("monster_invalid_cr", `CR "${cr}" is not on the 5e monster table.`);
		return issues;
	}

	const pb = readPb(e);
	if (pb == null)
		push("monster_missing_pb", "Monster missing proficiency_bonus.");
	else if (pb !== table.proficiency_bonus)
		push(
			"monster_pb_mismatch",
			`PB ${pb} ≠ ${table.proficiency_bonus} expected for CR ${cr}.`,
		);

	const xp = num(e.xp);
	const expectedXp = getCRXP(cr);
	if (xp == null) push("monster_missing_xp", "Monster missing xp.");
	else if (xp !== expectedXp)
		push(
			"monster_xp_mismatch",
			`XP ${xp} ≠ ${expectedXp} expected for CR ${cr}.`,
		);

	if (hp != null && (hp < table.hp_min || hp > table.hp_max))
		push(
			"monster_hp_out_of_band",
			`HP ${hp} outside CR ${cr} band ${table.hp_min}–${table.hp_max}.`,
		);

	// Attack bonus / save DC within tolerance of the table.
	for (const a of actions) {
		const atk = num(a.attack_bonus);
		if (atk != null && Math.abs(atk - table.attack_bonus) > 2)
			push(
				"monster_attack_bonus_off",
				`Action "${str(a.name) ?? "?"}" attack +${atk} far from CR ${cr} expected +${table.attack_bonus}.`,
			);
		const dc = num(a.dc);
		if (dc != null && Math.abs(dc - table.save_dc) > 2)
			push(
				"monster_save_dc_off",
				`Action "${str(a.name) ?? "?"}" DC ${dc} far from CR ${cr} expected DC ${table.save_dc}.`,
			);
	}

	// --- Encounter balance: a single rank-appropriate monster must not
	// overwhelm a party of 4. The ceiling is the DEADLY budget at the rank's
	// entry level — Deadly is "dangerous but survivable"; exceeding it is the
	// numbers-driven TPK the user wants prevented. S-rank bosses are exempt
	// (designed as climactic single targets with legendary/lair actions). ---
	const rank = readRank(e)?.toUpperCase();
	if (rank && rank !== "S" && rank in RANK_CR_BANDS) {
		const band = RANK_CR_BANDS[rank as keyof typeof RANK_CR_BANDS];
		const deadlyBudget = singleMonsterXpBudget(
			band.target_level_min,
			"deadly",
			4,
		);
		if (expectedXp > deadlyBudget)
			push(
				"monster_overwhelms_party",
				`${rank}-rank monster (CR ${cr}, ${expectedXp} XP) exceeds the party-of-4 Deadly budget ${deadlyBudget} at level ${band.target_level_min} — would overwhelm the party.`,
			);
		// Also assert the CR sits inside the rank's calibrated band.
		const t = getMonsterCrStats(cr);
		if (t && (t.crValue < band.cr_min_value || t.crValue > band.cr_max_value))
			push(
				"monster_cr_out_of_rank_band",
				`${rank}-rank monster CR ${cr} is outside the rank band ${band.cr_min}–${band.cr_max}.`,
			);
	}

	// --- S-rank bosses need legendary actions + lair actions ---
	if (rank === "S" && !hasArrayField(e.legendary_actions))
		push(
			"monster_boss_missing_legendary",
			"S-rank monster should expose legendary_actions.",
		);
	if (rank === "S" && !hasMinNamedEntries(e.lair_actions, 1))
		push(
			"monster_boss_missing_lair",
			"S-rank monster should expose lair_actions.",
		);

	// --- Optional DDB sections: validate well-formedness WHEN PRESENT (each is
	// a { name, description }[] with no duplicate descriptions in the list). ---
	for (const section of [
		"reactions",
		"bonus_actions",
		"lair_actions",
		"regional_effects",
	] as const) {
		const value = (e as Rec)[section];
		if (value === undefined || value === null) continue;
		if (!Array.isArray(value)) {
			push(
				`monster_malformed_${section}`,
				`Monster ${section} must be an array of { name, description }.`,
			);
			continue;
		}
		const seen = new Set<string>();
		for (const item of value) {
			if (!isRecord(item) || !str(item.name) || !str(item.description)) {
				push(
					`monster_malformed_${section}`,
					`Each ${section} entry needs a name and description.`,
				);
				continue;
			}
			const sig = (str(item.description) ?? "").toLowerCase().trim();
			if (seen.has(sig))
				push(
					`monster_duplicate_${section}`,
					`Duplicate ${section} description on "${str(item.name)}".`,
				);
			seen.add(sig);
		}
	}

	return issues;
}

const hasMinNamedEntries = (value: unknown, min: number): boolean =>
	Array.isArray(value) && value.length >= min;

// ─────────────────────────────────────────────────────────────────────────
// Spell components (5e requires material detail when M is present)
// ─────────────────────────────────────────────────────────────────────────

export function validateSpellComponents(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const components = isRecord(e.components) ? e.components : null;
	if (!components) {
		issues.push({
			code: "spell_missing_components",
			message: "Spell missing components object.",
		});
		return issues;
	}
	// When a material component is required, 5e names the material.
	const material = components.material;
	if (material === true) {
		issues.push({
			code: "spell_material_missing_detail",
			message:
				"Spell declares a material component (M) but does not name the material.",
		});
	}
	return issues;
}

// ─────────────────────────────────────────────────────────────────────────
// Weapon legality (5e property + structural completeness)
// ─────────────────────────────────────────────────────────────────────────

const LEGAL_WEAPON_PROPERTIES = new Set([
	// 5e (2014) core properties
	"finesse",
	"light",
	"heavy",
	"reach",
	"thrown",
	"two-handed",
	"versatile",
	"ammunition",
	"loading",
	"special",
	"range",
	// Rift Ascendant native properties (modern/firearm + martial setting).
	// These extend 5e for the RA theme and are canonical, not errors.
	"striker", // striker-gauntlet / unarmed-scaling weapons
	"two-handed-bonus", // RA two-handed damage rider
	"burst-fire", // automatic firearms
	"automatic", // automatic firearms
	"silent", // suppressed firearms
	"arcane", // arcane focus weapons
	"focus", // spellcasting-focus weapons
]);

export function validateWeapon5e(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const push = (code: string, message: string) =>
		issues.push({ code, message });

	if (!str(e.damage))
		push("weapon_missing_damage", "Weapon missing damage dice.");
	if (!str(e.damage_type))
		push("weapon_missing_damage_type", "Weapon missing damage_type.");
	const wType = str(e.weapon_type);
	if (!wType)
		push("weapon_missing_category", "Weapon missing weapon_type/category.");

	// Property legality (RA simple_properties[] holds the 5e property tags).
	const props = arr(e.simple_properties) ?? [];
	for (const p of props) {
		const tag = typeof p === "string" ? p.toLowerCase().split(/[\s(]/)[0] : "";
		if (tag && !LEGAL_WEAPON_PROPERTIES.has(tag))
			push(
				"weapon_illegal_property",
				`Weapon property "${p}" is not a 5e weapon property.`,
			);
	}

	// Ranged or thrown weapons must declare a range.
	const isRangedish =
		(wType && /ranged/i.test(wType)) ||
		props.some((p) => typeof p === "string" && /thrown/i.test(p));
	if (isRangedish && !str(e.range))
		push("weapon_missing_range", "Ranged/thrown weapon missing range.");

	return issues;
}

// ─────────────────────────────────────────────────────────────────────────
// Armor legality (5e category + AC formula completeness)
// ─────────────────────────────────────────────────────────────────────────

const LEGAL_ARMOR_TYPES = new Set(["light", "medium", "heavy", "shield"]);

export function validateArmor5e(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const push = (code: string, message: string) =>
		issues.push({ code, message });

	const aType = str(e.armor_type)?.toLowerCase();
	if (!aType) push("armor_missing_category", "Armor missing armor_type.");
	else if (!LEGAL_ARMOR_TYPES.has(aType))
		push(
			"armor_invalid_category",
			`Armor type "${e.armor_type}" is not a 5e armor category.`,
		);

	if (!str(e.armor_class) && num(e.armor_class) == null)
		push("armor_missing_ac", "Armor missing armor_class formula.");

	return issues;
}

// ─────────────────────────────────────────────────────────────────────────
// Job (5e class) completeness — RA Jobs are classes (+ lineage). A complete
// Job needs the class chassis 5e expects: hit die, primary ability, saving
// throw + armor + weapon proficiencies, a skill-choice list, and leveled
// features. Spellcasting Jobs must name a casting ability.
// ─────────────────────────────────────────────────────────────────────────

export function validateJob5e(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const push = (code: string, message: string) =>
		issues.push({ code, message });

	if (num(e.hit_die) == null || (num(e.hit_die) ?? 0) <= 0)
		push("job_missing_hit_die", "Job missing a positive hit_die.");
	if (!Array.isArray(e.primary_abilities) || e.primary_abilities.length === 0)
		push("job_missing_primary_ability", "Job missing primary_abilities.");
	if (
		!Array.isArray(e.saving_throw_proficiencies) ||
		e.saving_throw_proficiencies.length === 0
	)
		push(
			"job_missing_saving_throws",
			"Job missing saving_throw_proficiencies.",
		);
	if (!Array.isArray(e.armor_proficiencies))
		push(
			"job_missing_armor_proficiencies",
			"Job missing armor_proficiencies array.",
		);
	if (!Array.isArray(e.weapon_proficiencies))
		push(
			"job_missing_weapon_proficiencies",
			"Job missing weapon_proficiencies array.",
		);
	if (!Array.isArray(e.skill_choices) || e.skill_choices.length === 0)
		push("job_missing_skill_choices", "Job missing skill_choices.");

	// Leveled features: awakening_features / class_features / job_traits.
	const hasFeatures =
		(Array.isArray(e.awakening_features) && e.awakening_features.length > 0) ||
		(Array.isArray(e.class_features) && e.class_features.length > 0) ||
		(Array.isArray(e.job_traits) && e.job_traits.length > 0);
	if (!hasFeatures)
		push("job_missing_features", "Job missing leveled features/traits.");

	// Spellcasting Jobs must declare a casting ability.
	const sc = e.spellcasting;
	if (isRecord(sc) && !str(sc.ability))
		push(
			"job_spellcasting_missing_ability",
			"Job spellcasting block lacks a casting ability.",
		);

	return issues;
}

// ─────────────────────────────────────────────────────────────────────────
// Path (5e subclass) completeness — a Path must name its parent Job and grant
// at least one feature with a name and a numeric level.
// ─────────────────────────────────────────────────────────────────────────

export function validatePath5e(e: Rec): ContractIssue[] {
	const issues: ContractIssue[] = [];
	const push = (code: string, message: string) =>
		issues.push({ code, message });

	if (!str(e.job_id) && !str(e.jobId))
		push("path_missing_parent_job", "Path missing parent job_id.");

	const features = arr(e.features) ?? [];
	if (features.length === 0) {
		push("path_missing_features", "Path grants no features.");
	} else {
		const bad = features.filter(
			(f) =>
				!isRecord(f) || !str((f as Rec).name) || num((f as Rec).level) == null,
		);
		if (bad.length > 0)
			push(
				"path_feature_incomplete",
				`Path has ${bad.length} feature(s) missing a name or numeric level.`,
			);
	}

	return issues;
}
