/**
 * Legacy taming substrate (Q6 of Round 3).
 *
 * C2 campaign tame/bond attempts now resolve through companionBonding.ts and
 * authoritative server RPCs. These pure helpers remain for compatibility with
 * older callers and controller-bonus presentation only; they do not establish
 * C2 retry entitlement or persistence.
 */
import type { AbilityScore } from "@/types/core-rules";

export interface TamingTargetMeta {
	dc: number;
	ability: AbilityScore;
	min_party_rank?: "D" | "C" | "B" | "A" | "S";
	bond_initial?: number;
}

export interface TamingCharacterContext {
	id: string;
	job?: string | null;
	path?: string | null;
	abilities: Record<AbilityScore, number>;
	proficiencyBonus: number;
}

export interface TamingAttemptResult {
	success: boolean;
	roll: number;
	total: number;
	dc: number;
	bondLevel: number;
	reason?: string;
}

export interface ControllerBonuses {
	hasPackLeader: boolean;
	hasSummoner: boolean;
	hasContractor: boolean;
	hasEsper: boolean;
	hasSynchronist: boolean;
	hasHive: boolean;
	bonusActions: string[];
	passiveBoosts: string[];
}

const PACK_LEADER_PATTERNS = [/pack[\s-]?leader/i];
const SUMMONER_PATTERNS = [/^summoner/i, /biome[\s-]?bond/i];
const CONTRACTOR_PATTERNS = [
	/^contractor/i,
	/pact[\s-]?of[\s-]?the[\s-]?chain/i,
];
const ESPER_PATTERNS = [/^esper/i, /entity[\s-]?shift/i];
const SYNCHRONIST_PATTERNS = [/synchronist[\s-]?binary/i];
const HIVE_PATTERNS = [/hive[\s-]?synchronist/i];

function matchesAny(
	text: string | null | undefined,
	patterns: RegExp[],
): boolean {
	if (!text) return false;
	return patterns.some((pattern) => pattern.test(text));
}

/**
 * Legacy controller presentation helper. C2 attempt bonuses are resolved from
 * canonical source ids instead of display-name matches.
 */
export function getControllerBonuses(
	character: TamingCharacterContext | null | undefined,
): ControllerBonuses {
	const result: ControllerBonuses = {
		hasPackLeader: false,
		hasSummoner: false,
		hasContractor: false,
		hasEsper: false,
		hasSynchronist: false,
		hasHive: false,
		bonusActions: [],
		passiveBoosts: [],
	};
	if (!character) return result;
	const haystack = `${character.job ?? ""} ${character.path ?? ""}`;

	result.hasPackLeader = matchesAny(haystack, PACK_LEADER_PATTERNS);
	result.hasSummoner = matchesAny(haystack, SUMMONER_PATTERNS);
	result.hasContractor = matchesAny(haystack, CONTRACTOR_PATTERNS);
	result.hasEsper = matchesAny(haystack, ESPER_PATTERNS);
	result.hasSynchronist = matchesAny(haystack, SYNCHRONIST_PATTERNS);
	result.hasHive = matchesAny(haystack, HIVE_PATTERNS);

	if (result.hasPackLeader) {
		result.bonusActions.push("Coordinated Strike");
		result.bonusActions.push("Companion: Dash / Disengage / Support (bonus)");
		result.passiveBoosts.push("Both creatures share Pack-Leader adaptation");
	}
	if (result.hasSummoner) {
		result.passiveBoosts.push("Biome-bonded companion gains terrain advantage");
		result.bonusActions.push("Beast Communication");
	}
	if (result.hasContractor) {
		result.passiveBoosts.push("Telepathic link with companion within 100 ft");
		result.bonusActions.push("Pact-of-the-Chain command");
	}
	if (result.hasEsper) {
		result.bonusActions.push("Entity Shift (familiar form)");
	}
	if (result.hasSynchronist) {
		result.passiveBoosts.push("Binary fighting unit — shared reflex");
	}
	if (result.hasHive) {
		result.passiveBoosts.push(
			"Hive resilience: damage taken halved when summoned",
		);
	}
	return result;
}

function getAbilityModifier(score: number): number {
	if (!Number.isFinite(score)) return 0;
	return Math.floor((score - 10) / 2);
}

/**
 * @deprecated C2 campaign attempts use resolve_companion_*_attempt_c2. This
 * compatibility calculation deliberately makes no claim about retry timing.
 */
export function attemptTaming(
	character: TamingCharacterContext,
	target: TamingTargetMeta,
	roll: number,
): TamingAttemptResult {
	const abilityMod = getAbilityModifier(character.abilities[target.ability]);
	const pb = character.proficiencyBonus;
	const bonuses = getControllerBonuses(character);
	const pathBonus =
		bonuses.hasPackLeader ||
		bonuses.hasSummoner ||
		bonuses.hasContractor ||
		bonuses.hasEsper ||
		bonuses.hasSynchronist ||
		bonuses.hasHive
			? 2
			: 0;
	const total = roll + abilityMod + pb + pathBonus;
	const success = total >= target.dc;
	return {
		success,
		roll,
		total,
		dc: target.dc,
		bondLevel: success ? Math.max(1, target.bond_initial ?? 1) : 0,
		reason: success ? undefined : `Failed by ${target.dc - total}.`,
	};
}

export function formatControllerBonusesSummary(
	bonuses: ControllerBonuses,
): string | null {
	const active: string[] = [];
	if (bonuses.hasPackLeader) active.push("Pack Leader");
	if (bonuses.hasSummoner) active.push("Summoner");
	if (bonuses.hasContractor) active.push("Contractor");
	if (bonuses.hasEsper) active.push("Esper");
	if (bonuses.hasSynchronist) active.push("Synchronist");
	if (bonuses.hasHive) active.push("Hive");
	return active.length === 0 ? null : active.join(", ");
}
