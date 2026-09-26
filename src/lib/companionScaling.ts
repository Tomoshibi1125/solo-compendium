import { anomalies } from "@/data/compendium/anomalies";
import { allMounts } from "@/data/compendium/vehicles";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";

export interface CompanionScalingRule {
	hpBase: number;
	hpPerLevel: number;
	acBase: number;
	acEveryLevels: number;
	attackBase: number;
	saveBase: number;
	damageDiceBase: number;
	damageEveryLevels: number;
	damageDie: 4 | 6 | 8 | 10 | 12;
}

export interface ScaledCompanionCombatStats {
	level: number;
	hpMax: number;
	baseAc: number;
	attackBonus: number;
	saveDc: number;
	damageDice: string;
	rule: CompanionScalingRule;
}

const rankTier: Record<string, number> = { E: 0, D: 1, C: 2, B: 3, A: 4, S: 5 };
const asRecord = (value: unknown): Record<string, unknown> | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;

export function companionSourceRank(
	instance: Pick<
		CompanionInstanceRecord,
		"source_snapshot" | "source_collection" | "source_id"
	>,
): string | null {
	const frozen = asRecord(
		asRecord(instance.source_snapshot)?.sourceFields,
	)?.rank;
	if (typeof frozen === "string" && frozen.trim()) return frozen;
	const mount =
		instance.source_collection === "vehicles"
			? allMounts.find((entry) => entry.id === instance.source_id)
			: undefined;
	return (
		mount?.rank ??
		anomalies.find(
			(entry) => entry.id === (mount?.anomaly_id ?? instance.source_id),
		)?.rank ??
		null
	);
}

export function companionSourceName(
	instance: Pick<
		CompanionInstanceRecord,
		"source_snapshot" | "source_collection" | "source_id"
	>,
): string {
	const frozen = asRecord(
		asRecord(instance.source_snapshot)?.sourceFields,
	)?.name;
	if (typeof frozen === "string" && frozen.trim()) return frozen;
	const mount =
		instance.source_collection === "vehicles"
			? allMounts.find((entry) => entry.id === instance.source_id)
			: undefined;
	return (
		mount?.name ??
		anomalies.find((entry) => entry.id === instance.source_id)?.name ??
		"Companion"
	);
}

export function isLevelScaledCompanion(
	instance: Pick<
		CompanionInstanceRecord,
		"identity_kind" | "source_collection"
	>,
): boolean {
	return (
		instance.source_collection === "anomalies" ||
		instance.identity_kind === "mount"
	);
}

/** Rank is a starting budget; player level controls every effective combat number. */
export function getCompanionScalingRule(
	rank: string | null | undefined,
	profile: unknown,
): CompanionScalingRule {
	const tier = rankTier[(rank ?? "D").toUpperCase()] ?? 1;
	const scaling = asRecord(asRecord(profile)?.scaling);
	const integer = (
		key: keyof CompanionScalingRule,
		fallback: number,
		min: number,
		max: number,
	) => {
		const value = scaling?.[key];
		return typeof value === "number" &&
			Number.isInteger(value) &&
			value >= min &&
			value <= max
			? value
			: fallback;
	};
	return {
		hpBase: integer("hpBase", 8, 0, 500),
		hpPerLevel: integer("hpPerLevel", 4 + 2 * tier, 1, 50),
		acBase: integer("acBase", 10 + tier, 1, 30),
		acEveryLevels: integer("acEveryLevels", 4, 1, 20),
		attackBase: integer("attackBase", 2 + tier, 0, 20),
		saveBase: integer("saveBase", 8 + tier, 0, 30),
		damageDiceBase: integer("damageDiceBase", 1 + tier, 1, 20),
		damageEveryLevels: integer("damageEveryLevels", 4, 1, 20),
		damageDie: ([4, 6, 8, 10, 12] as const).includes(
			scaling?.damageDie as 4 | 6 | 8 | 10 | 12,
		)
			? (scaling?.damageDie as CompanionScalingRule["damageDie"])
			: 6,
	};
}

export function scaleCompanionAtLevel(
	levelInput: number,
	rank: string | null | undefined,
	profile: unknown,
): ScaledCompanionCombatStats {
	const level = Math.min(
		20,
		Math.max(1, Math.trunc(Number.isFinite(levelInput) ? levelInput : 1)),
	);
	const rule = getCompanionScalingRule(rank, profile);
	const proficiency = 2 + Math.floor((level - 1) / 4);
	return {
		level,
		hpMax: rule.hpBase + rule.hpPerLevel * level,
		baseAc: rule.acBase + Math.floor((level - 1) / rule.acEveryLevels),
		attackBonus: rule.attackBase + proficiency,
		saveDc: rule.saveBase + proficiency,
		damageDice: `${rule.damageDiceBase + Math.floor((level - 1) / rule.damageEveryLevels)}d${rule.damageDie}`,
		rule,
	};
}

export interface ScaledCompanionAction {
	name: string;
	owner: "anomaly" | "mount";
	actionType: string;
	attackBonus: number | null;
	saveDc: number | null;
	damage: string | null;
	damageType: string | null;
	recharge: string | null;
	description: string;
}

export interface MergedCompanionCombat {
	traits: Array<{
		name: string;
		description: string;
		owner: "anomaly" | "mount";
	}>;
	actions: ScaledCompanionAction[];
	anomalyId: string | null;
}

function scaledDescription(
	description: string,
	scaled: ScaledCompanionCombatStats,
): string {
	return description
		.replace(/\bDC\s+\d+\b/gi, `DC ${scaled.saveDc}`)
		.replace(/\+\d+\s+to hit\b/gi, `+${scaled.attackBonus} to hit`)
		.replace(
			/\b\d+d(?:4|6|8|10|12|20)(?:\s*[+-]\s*\d+)?\b/gi,
			scaled.damageDice,
		);
}

/** Mount overlays add their own abilities; the linked anomaly contributes its attacks and traits. */
export function mergeCompanionCombat(
	instance: CompanionInstanceRecord,
	scaled: ScaledCompanionCombatStats,
): MergedCompanionCombat {
	const mount =
		instance.source_collection === "vehicles"
			? allMounts.find((entry) => entry.id === instance.source_id)
			: undefined;
	const anomalyId =
		mount?.anomaly_id ??
		(instance.source_collection === "anomalies" ? instance.source_id : null);
	const anomaly = anomalies.find((entry) => entry.id === anomalyId);
	const traits: MergedCompanionCombat["traits"] = [
		...(anomaly?.traits ?? []).map((entry) => ({
			name: entry.name,
			description: scaledDescription(entry.description, scaled),
			owner: "anomaly" as const,
		})),
		...(anomaly?.abilities ?? [])
			.filter(
				(name) =>
					!(anomaly?.actions ?? []).some((action) => action.name === name) &&
					!(anomaly?.traits ?? []).some((trait) => trait.name === name),
			)
			.map((name) => ({
				name,
				description:
					"Named anomaly ability; Warden adjudicates its narrative effect.",
				owner: "anomaly" as const,
			})),
		...(mount?.abilities ?? [])
			.filter((entry) => entry.action_type === "passive")
			.map((entry) => ({
				name: entry.name,
				description: scaledDescription(entry.description, scaled),
				owner: "mount" as const,
			})),
	];
	const actions: ScaledCompanionAction[] = (anomaly?.actions ?? []).map(
		(entry) => ({
			name: entry.name,
			owner: "anomaly",
			actionType:
				entry.action_type ?? (entry as { type?: string }).type ?? "action",
			attackBonus:
				entry.attack_bonus !== undefined ||
				/\b(attack|to hit)\b/i.test(entry.description)
					? scaled.attackBonus
					: null,
			saveDc: entry.save || entry.dc !== undefined ? scaled.saveDc : null,
			damage:
				entry.damage || /\b\d+d\d+\b/i.test(entry.description)
					? scaled.damageDice
					: null,
			damageType: entry.damage_type ?? null,
			recharge: entry.recharge ?? null,
			description: scaledDescription(entry.description, scaled),
		}),
	);
	for (const entry of anomaly?.legendary_actions ?? []) {
		if (!entry.name || !entry.description) continue;
		actions.push({
			name: entry.name,
			owner: "anomaly",
			actionType: "legendary",
			attackBonus: /\b(attack|to hit)\b/i.test(entry.description)
				? scaled.attackBonus
				: null,
			saveDc:
				entry.dc !== undefined || /\b(save|DC\s+\d+)\b/i.test(entry.description)
					? scaled.saveDc
					: null,
			damage: /\b\d+d\d+\b/i.test(entry.description) ? scaled.damageDice : null,
			damageType:
				entry.description
					.match(
						/\b(fire|cold|lightning|thunder|necrotic|radiant|force|poison|acid|psychic|bludgeoning|piercing|slashing)\b/i,
					)?.[1]
					?.toLowerCase() ?? null,
			recharge: entry.frequency ?? null,
			description: scaledDescription(entry.description, scaled),
		});
	}
	for (const entry of (mount?.abilities ?? []).filter(
		(ability) => ability.action_type !== "passive",
	)) {
		const damageType =
			entry.description
				.match(
					/\b(fire|cold|lightning|thunder|necrotic|radiant|force|poison|acid|psychic|bludgeoning|piercing|slashing)\b/i,
				)?.[1]
				?.toLowerCase() ?? null;
		const hasAttack = /\b(attack|strike|slam|bite|hit)\b/i.test(
			entry.description,
		);
		const hasSave = /\b(save|saving throw|DC \d+)\b/i.test(entry.description);
		actions.push({
			name: entry.name,
			owner: "mount",
			actionType: entry.action_type,
			attackBonus: hasAttack && !hasSave ? scaled.attackBonus : null,
			saveDc: hasSave ? scaled.saveDc : null,
			damage: /\b\d+d\d+\b/i.test(entry.description) ? scaled.damageDice : null,
			damageType,
			recharge: entry.description.match(/recharge\s+([\d-]+)/i)?.[1] ?? null,
			description: scaledDescription(entry.description, scaled),
		});
	}
	return { traits, actions, anomalyId: anomalyId ?? null };
}
