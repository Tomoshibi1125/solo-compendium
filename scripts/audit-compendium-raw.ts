/**
 * Raw-source compendium audit.
 *
 * The standard `audit:compendium` runs against the staticDataProvider, which
 * applies transforms that FABRICATE missing fields (e.g. transformSpell injects
 * a default `agility` save / `utility` block, deriveItemProperties injects a
 * `1d6 slashing` weapon profile). That makes the structural audit pass even
 * when the underlying authored data is incomplete.
 *
 * This script audits the RAW exported arrays (pre-transform) so the true gaps
 * surface, and adds content-consistency checks the structural audit lacks:
 *   - description <-> mechanics DC mismatch
 *   - damage language on non-damage (utility/healing) resolutions
 *   - templated / boilerplate authoring lore
 *
 * Read-only: prints a report and writes audit-raw-output.txt. No data files are
 * modified.
 */
import fs from "node:fs";
import path from "node:path";
import { allItems } from "../src/data/compendium/items-index";
import { powers } from "../src/data/compendium/powers";
import { comprehensiveRelics } from "../src/data/compendium/relics-comprehensive";
import { allRunes } from "../src/data/compendium/runes/index";
import { spells } from "../src/data/compendium/spells";
import { techniques } from "../src/data/compendium/techniques";
import { allVehicles } from "../src/data/compendium/vehicles";
import {
	type AuditEntry,
	type CompendiumAuditIssue,
	formatCompendiumAuditReport,
	runCompendiumAudit,
} from "../src/lib/compendiumAudit";

type AnyEntry = Record<string, unknown> & { id: string; name: string };

const asEntries = (value: unknown): AuditEntry[] =>
	(Array.isArray(value) ? value : []) as unknown as AuditEntry[];

// A provider that returns the RAW arrays untouched for the castable + item
// datasets we care about, and empty arrays for everything else so the existing
// audit engine can run unchanged.
const empty = async () => [] as AuditEntry[];
const rawProvider = {
	getAnomalies: empty,
	getBackgrounds: empty,
	getConditions: empty,
	getFeats: empty,
	getItems: async () => asEntries(allItems),
	getJobs: empty,
	getLocations: empty,
	getPaths: empty,
	getPowers: async () => asEntries(powers),
	getRegents: empty,
	getRelics: async () => asEntries(comprehensiveRelics),
	getRunes: async () => asEntries(allRunes),
	getSigils: empty,
	getSkills: empty,
	getSpells: async () => asEntries(spells),
	getTattoos: empty,
	getTechniques: async () => asEntries(techniques),
};

// ---------------------------------------------------------------------------
// Content-consistency checks (spells / powers / techniques + their runes).
// Runes are auto-derived from the abilities, so they inherit the same data and
// must stay consistent; they carry no saving throw, so the DC/damage checks are
// no-ops for them and only the templated-lore check is meaningful.
// ---------------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const text = (value: unknown): string =>
	typeof value === "string" ? value : "";

const collectStrings = (value: unknown): string[] => {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(collectStrings);
	if (isRecord(value)) return Object.values(value).flatMap(collectStrings);
	return [];
};

const DICE_RE = /\d+\s*d\s*\d+/i;
const DC_RE = /\bDC\s*(\d{1,2})\b/gi;

const TEMPLATED_LORE_PATTERNS: RegExp[] = [
	/A dead Guild Master/i,
	/Bureau Artifact Vault/i,
	/Catalogued in the Bureau's standard rank-appropriate compendium/i,
	/Available to Bureau-certified casters at the appropriate rank/i,
	/Neutral in personality profile/i,
	/An entry in the Ascendant Bureau's approved catalog/i,
	/A tuned release of accumulated resonance/i,
	/Utility effect: see saving-throw entry/i,
];

function getMechanics(entry: AnyEntry): Record<string, unknown> | null {
	return isRecord(entry.mechanics) ? entry.mechanics : null;
}

function getSavingThrow(entry: AnyEntry): Record<string, unknown> | null {
	if (isRecord(entry.saving_throw)) return entry.saving_throw;
	const m = getMechanics(entry);
	if (m && isRecord(m.saving_throw)) return m.saving_throw;
	return null;
}

function getDeclaredDCs(entry: AnyEntry): number[] {
	const dcs = new Set<number>();
	const st = getSavingThrow(entry);
	if (st && typeof st.dc === "number") dcs.add(st.dc);
	const m = getMechanics(entry);
	if (m && typeof m.save_dc === "number") dcs.add(m.save_dc as number);
	return [...dcs];
}

function hasAnyDamage(entry: AnyEntry): boolean {
	const m = getMechanics(entry);
	const attack =
		(isRecord(entry.attack) ? entry.attack : null) ||
		(m && isRecord(m.attack) ? m.attack : null);
	if (attack && DICE_RE.test(text(attack.damage))) return true;
	if (m) {
		if (DICE_RE.test(text(m.damage_profile))) return true;
		if (isRecord(m.healing) && DICE_RE.test(text(m.healing.dice))) return true;
	}
	return false;
}

function pushIssue(
	issues: CompendiumAuditIssue[],
	dataset: string,
	code: string,
	message: string,
	entry: AnyEntry,
) {
	issues.push({
		severity: "warning",
		dataset,
		code,
		message,
		entryId: entry.id,
		entryName: entry.name,
	});
}

function auditConsistency(
	dataset: string,
	entry: AnyEntry,
	issues: CompendiumAuditIssue[],
) {
	// 1) description DC vs mechanics DC
	const declaredDCs = getDeclaredDCs(entry);
	const description = text(entry.description);
	const textDCs: number[] = [];
	for (const match of description.matchAll(DC_RE)) {
		textDCs.push(Number.parseInt(match[1], 10));
	}
	if (textDCs.length > 0 && declaredDCs.length > 0) {
		// Flag only when a DECLARED (mechanics) save DC is absent from the
		// description prose. The reverse — a description DC missing from mechanics
		// — yields false positives, e.g. a secondary "DC 15 Athletics check" to
		// climb out of a fissure that is not the spell's save DC.
		const mismatch = declaredDCs.some((dc) => !textDCs.includes(dc));
		if (mismatch) {
			pushIssue(
				issues,
				dataset,
				"dc_text_mismatch",
				`Description DC(s) ${textDCs.join("/")} do not match mechanics DC(s) ${declaredDCs.join("/")}.`,
				entry,
			);
		}
	}

	// 2) damage language on a non-damage resolution
	const st = getSavingThrow(entry);
	if (st && !hasAnyDamage(entry)) {
		const outcomeText =
			`${text(st.success)} ${text(st.failure)} ${text(st.on_save)}`.toLowerCase();
		// Only flag damage-DEALING phrasing — a quantity of damage the ability
		// inflicts ("half/full damage" or an explicit "<dice> ... damage"). Plain
		// references like "repeats the save when it takes damage" or "excess
		// damage carries over" describe legitimate non-damage mechanics and must
		// not be flagged.
		const claimsDamage =
			/\b(?:half|full)\s+damage\b/.test(outcomeText) ||
			/\d+\s*d\s*\d+[^.]*\bdamage\b/.test(outcomeText);
		if (claimsDamage) {
			pushIssue(
				issues,
				dataset,
				"damage_text_on_nondamage",
				"Saving-throw outcome text mentions damage but no damage roll is defined.",
				entry,
			);
		}
	}

	// 3) templated / boilerplate lore
	const loreText = collectStrings([
		entry.lore,
		entry.flavor,
		entry.effects,
	]).join("\n");
	const matched = TEMPLATED_LORE_PATTERNS.find((re) => re.test(loreText));
	if (matched) {
		pushIssue(
			issues,
			dataset,
			"templated_lore",
			`Contains boilerplate authoring phrase matching ${matched}.`,
			entry,
		);
	}

	// 4) item/vehicle-specific checks
	if (dataset === "items") {
		// Skip gap-fill items for damage checks (auto-generated placeholders)
		const isGapFill = entry.id.startsWith("gap_");

		// Damage consistency: weapons with damage_roll or damage must have damage_type
		const damageRoll = text(entry.damage_roll);
		const damage = text(entry.damage);
		const damageType = text(entry.damage_type);
		const itemType = text(entry.item_type);
		const hasDamageRoll = damageRoll && DICE_RE.test(damageRoll);
		const hasDamage = damage && DICE_RE.test(damage);
		if ((hasDamageRoll || hasDamage) && !damageType) {
			pushIssue(
				issues,
				dataset,
				"damage_without_type",
				"Item has damage_roll or damage but no damage_type.",
				entry,
			);
		}
		if (
			damageType &&
			itemType === "weapon" &&
			!hasDamageRoll &&
			!hasDamage &&
			!isGapFill
		) {
			pushIssue(
				issues,
				dataset,
				"damage_type_without_roll",
				"Weapon has damage_type but no damage_roll or damage.",
				entry,
			);
		}
		// Armor consistency: items with AC should be armor-type
		const ac = entry.ac;
		if (ac != null && itemType !== "armor") {
			pushIssue(
				issues,
				dataset,
				"ac_on_non_armor",
				"Item has AC but item_type is not 'armor'.",
				entry,
			);
		}
		// Stat block consistency: items with stats must have non-empty values
		const stats = isRecord(entry.stats) ? entry.stats : null;
		if (stats) {
			const hasNonEmptyStat = Object.values(stats).some(
				(v) => v != null && v !== "" && v !== 0,
			);
			if (!hasNonEmptyStat) {
				pushIssue(
					issues,
					dataset,
					"empty_stats",
					"Item has stats object but all values are empty/zero.",
					entry,
				);
			}
		}
	}

	if (dataset === "vehicles") {
		// Vehicle completeness: must have speed, armor_class, hit_points, vehicle_type
		const speed = isRecord(entry.speed) ? entry.speed : null;
		const armorClass = entry.armor_class;
		const hitPoints = isRecord(entry.hit_points) ? entry.hit_points : null;
		const vehicleType = text(entry.vehicle_type);
		const size = text(entry.size);

		if (!speed || Object.keys(speed).length === 0) {
			pushIssue(
				issues,
				dataset,
				"missing_speed",
				"Vehicle missing speed object.",
				entry,
			);
		}
		if (armorClass == null) {
			pushIssue(
				issues,
				dataset,
				"missing_ac",
				"Vehicle missing armor_class.",
				entry,
			);
		}
		if (!hitPoints || hitPoints.max == null) {
			pushIssue(
				issues,
				dataset,
				"missing_hp",
				"Vehicle missing hit_points.max.",
				entry,
			);
		}
		if (!vehicleType) {
			pushIssue(
				issues,
				dataset,
				"missing_vehicle_type",
				"Vehicle missing vehicle_type.",
				entry,
			);
		}
		if (!size) {
			pushIssue(
				issues,
				dataset,
				"missing_size",
				"Vehicle missing size.",
				entry,
			);
		}

		// Mount completeness: mounts must have carry capacity
		if (vehicleType === "mount") {
			const carryCapacity = entry.carry_capacity_lbs;
			const cargoCapacity = entry.cargo_capacity_lbs;
			if (carryCapacity == null && cargoCapacity == null) {
				pushIssue(
					issues,
					dataset,
					"mount_missing_capacity",
					"Mount missing carry_capacity_lbs or cargo_capacity_lbs.",
					entry,
				);
			}
		}
	}
}

// ---------------------------------------------------------------------------

async function main() {
	const structural = await runCompendiumAudit(rawProvider);

	const consistencyIssues: CompendiumAuditIssue[] = [];
	const castables: Array<[string, unknown]> = [
		["spells", spells],
		["powers", powers],
		["techniques", techniques],
		["runes", allRunes],
		["items", allItems],
		["vehicles", allVehicles],
	];
	for (const [dataset, arr] of castables) {
		for (const entry of asEntries(arr) as unknown as AnyEntry[]) {
			auditConsistency(dataset, entry, consistencyIssues);
		}
	}

	const lines: string[] = [];
	lines.push("=== RAW COMPENDIUM AUDIT (pre-transform) ===");
	lines.push(formatCompendiumAuditReport(structural));
	lines.push("");
	lines.push("=== CONTENT CONSISTENCY (raw castables) ===");
	const buckets = new Map<string, number>();
	for (const issue of consistencyIssues) {
		const key = `${issue.dataset}:${issue.code}`;
		buckets.set(key, (buckets.get(key) ?? 0) + 1);
	}
	lines.push(`Consistency issues: ${consistencyIssues.length}`);
	for (const [key, count] of [...buckets.entries()].sort(
		(a, b) => b[1] - a[1],
	)) {
		lines.push(`- ${key} x${count}`);
	}
	lines.push("All consistency issues:");
	for (const issue of consistencyIssues) {
		lines.push(
			`- [${issue.dataset}:${issue.code}] id=${issue.entryId} name="${issue.entryName}" :: ${issue.message}`,
		);
	}

	const report = lines.join("\n");
	console.log(report);
	fs.writeFileSync(
		path.join(process.cwd(), "audit-raw-output.txt"),
		report,
		"utf8",
	);
}

main().catch((err) => {
	process.stderr.write(`${String(err)}\n`);
	process.exitCode = 1;
});
