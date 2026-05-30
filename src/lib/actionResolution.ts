import { rollDiceString } from "@/lib/diceRoller";
import { rollCheck } from "@/lib/rollEngine";

/**
 * B1/D5 — Roll damage with optional critical-hit dice doubling.
 *
 * On a crit, ALL damage dice are doubled but flat modifiers are NOT
 * (SRD 5e + DDB correct). We achieve this by doubling the dice count in
 * every `NdM` term of the formula and leaving trailing `+N` untouched.
 * `extraDice` adds further weapon dice for Brutal Critical-style features
 * (uses the first dice term's die size).
 */
function rollDamageFormula(
	formula: string,
	isCritical: boolean,
	extraDice = 0,
): { rolls: number[]; result: number } {
	if (!isCritical) {
		const r = rollDiceString(formula);
		return { rolls: r.rolls, result: r.result };
	}
	// Double every dice term (e.g. "2d6+1d8+3" → "4d6+2d8+3").
	let doubled = formula.replace(
		/(\d+)d(\d+)/gi,
		(_m, n: string, s: string) => `${parseInt(n, 10) * 2}d${s}`,
	);
	// Brutal Critical / Savage extra dice: append N dice of the first term's size.
	if (extraDice > 0) {
		const firstDie = formula.match(/\d+d(\d+)/i)?.[1];
		if (firstDie) doubled = `${doubled}+${extraDice}d${firstDie}`;
	}
	const r = rollDiceString(doubled);
	return { rolls: r.rolls, result: r.result };
}

export type ResolutionKind =
	| "attack"
	| "save"
	| "healing"
	| "damage"
	| "effect";

export type ActionResolutionPayload = {
	version: 1;
	id: string;
	name: string;
	source: {
		type:
			| "spell"
			| "Anomaly_action"
			| "technique"
			| "item"
			| "artifact"
			| "relic"
			| "power"
			| "rune";
		entryId: string;
	};
	kind: ResolutionKind;
	attack?: {
		roll: string;
		rollMode?: "normal" | "advantage" | "disadvantage";
		/** Force a critical hit (e.g. a guaranteed-crit feature). */
		forceCritical?: boolean;
		/**
		 * Extra weapon dice added on a crit beyond the standard doubling —
		 * Brutal Critical (Berserker/Destroyer) etc. (D5).
		 */
		critExtraDice?: number;
	};
	save?: {
		dc: number;
		ability?: string;
		roll?: string;
		rollMode?: "normal" | "advantage" | "disadvantage";
	};
	damage?: {
		roll: string;
		type?: string;
	};
	healing?: {
		roll: string;
	};
	appliesConditions?: string[];
	description?: string;
};

const STORAGE_KEY = "solo-compendium.pending-resolution.v1";

export function setPendingResolution(payload: ActionResolutionPayload) {
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingResolution(): ActionResolutionPayload | null {
	const raw = sessionStorage.getItem(STORAGE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as ActionResolutionPayload;
		if (!parsed || parsed.version !== 1) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function clearPendingResolution() {
	sessionStorage.removeItem(STORAGE_KEY);
}

export type ResolutionOutcome =
	| {
			kind: "attack";
			attackRoll: number;
			attackTotal: number;
			attackMode: "normal" | "advantage" | "disadvantage";
			attackD20: [number] | [number, number];
			targetAC: number;
			hit: boolean;
			criticalHit?: boolean;
			damageTotal?: number;
			damageRolls?: number[];
	  }
	| {
			kind: "save";
			saveRoll: number;
			saveTotal: number;
			saveMode: "normal" | "advantage" | "disadvantage";
			saveD20: [number] | [number, number];
			dc: number;
			success: boolean;
			damageTotal?: number;
			damageRolls?: number[];
	  }
	| {
			kind: "healing";
			healingTotal: number;
			healingRolls: number[];
	  }
	| {
			kind: "damage";
			damageTotal: number;
			damageRolls: number[];
	  }
	| {
			kind: "effect";
			name: string;
			description?: string;
	  };

export function resolveAttack(
	payload: ActionResolutionPayload,
	targetAC: number,
): ResolutionOutcome {
	if (!payload.attack) {
		throw new Error("Missing attack payload");
	}

	const mode = payload.attack.rollMode ?? "normal";

	const rollD20 = (modifier: number) => {
		if (mode === "normal") {
			const r = rollCheck(modifier, "normal");
			const d20 = r.rolls[0] ?? 0;
			return { d20, total: d20, result: r.total, rolls: [d20] as number[] };
		}

		// Preserve original roll order for UI/test expectations: [roll1, roll2]
		const r1 = rollCheck(modifier, "normal");
		const r2 = rollCheck(modifier, "normal");
		const d1 = r1.rolls[0] ?? 0;
		const d2 = r2.rolls[0] ?? 0;

		const chosenD20 =
			mode === "advantage" ? Math.max(d1, d2) : Math.min(d1, d2);
		return {
			d20: chosenD20,
			total: chosenD20,
			result: chosenD20 + modifier,
			rolls: [d1, d2] as number[],
		};
	};

	const parseD20Modifier = (roll: string) => {
		const normalized = roll.replace(/\s+/g, "");
		const match = normalized.match(/^1d20([+-]\d+)?$/i);
		if (!match) return null;
		return match[1] ? parseInt(match[1], 10) : 0;
	};

	const d20Mod = parseD20Modifier(payload.attack.roll);
	const isStandardD20 = d20Mod !== null;
	const attack = isStandardD20
		? rollD20(d20Mod as number)
		: rollDiceString(payload.attack.roll);

	// B1: critical hit when the kept d20 is a natural 20 (standard attack
	// rolls only) or the action forces a crit. Natural-1 is never a crit.
	const naturalD20 = isStandardD20
		? (attack as { d20?: number }).d20
		: undefined;
	const isCritical = Boolean(payload.attack.forceCritical) || naturalD20 === 20;

	const hit = isCritical || attack.result >= targetAC;

	if (!hit || !payload.damage) {
		return {
			kind: "attack",
			attackRoll: attack.total,
			attackTotal: attack.result,
			attackMode: mode,
			attackD20:
				attack.rolls?.length === 2
					? ([attack.rolls[0], attack.rolls[1]] as [number, number])
					: ([attack.rolls?.[0] ?? attack.total] as [number]),
			targetAC,
			hit,
			criticalHit: isCritical && hit,
		};
	}

	const damage = rollDamageFormula(
		payload.damage.roll,
		isCritical,
		payload.attack.critExtraDice ?? 0,
	);
	return {
		kind: "attack",
		attackRoll: attack.total,
		attackTotal: attack.result,
		attackMode: mode,
		attackD20:
			attack.rolls?.length === 2
				? ([attack.rolls[0], attack.rolls[1]] as [number, number])
				: ([attack.rolls?.[0] ?? attack.total] as [number]),
		targetAC,
		hit,
		criticalHit: isCritical,
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveSave(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.save) {
		throw new Error("Missing save payload");
	}
	const mode = payload.save.rollMode ?? "normal";
	const roll = payload.save.roll ?? "1d20";

	const parseD20Modifier = (rollStr: string) => {
		const normalized = rollStr.replace(/\s+/g, "");
		const match = normalized.match(/^1d20([+-]\d+)?$/i);
		if (!match) return null;
		return match[1] ? parseInt(match[1], 10) : 0;
	};

	const rollD20 = (modifier: number) => {
		if (mode === "normal") {
			const r = rollCheck(modifier, "normal");
			const d20 = r.rolls[0] ?? 0;
			return { d20, total: d20, result: r.total, rolls: [d20] as number[] };
		}

		// Preserve original roll order for UI/test expectations: [roll1, roll2]
		const r1 = rollCheck(modifier, "normal");
		const r2 = rollCheck(modifier, "normal");
		const d1 = r1.rolls[0] ?? 0;
		const d2 = r2.rolls[0] ?? 0;
		const chosenD20 =
			mode === "advantage" ? Math.max(d1, d2) : Math.min(d1, d2);

		return {
			d20: chosenD20,
			total: chosenD20,
			result: chosenD20 + modifier,
			rolls: [d1, d2] as number[],
		};
	};

	const d20Mod = parseD20Modifier(roll);
	const save =
		d20Mod !== null
			? (() => {
					return rollD20(d20Mod);
				})()
			: rollDiceString(roll);
	const dc = payload.save.dc;
	const success = save.result >= dc;

	if (!payload.damage) {
		return {
			kind: "save",
			saveRoll: save.total,
			saveTotal: save.result,
			saveMode: mode,
			saveD20:
				save.rolls?.length === 2
					? ([save.rolls[0], save.rolls[1]] as [number, number])
					: ([save.rolls?.[0] ?? save.total] as [number]),
			dc,
			success,
		};
	}

	const damage = rollDiceString(payload.damage.roll);

	return {
		kind: "save",
		saveRoll: save.total,
		saveTotal: save.result,
		saveMode: mode,
		saveD20:
			save.rolls?.length === 2
				? ([save.rolls[0], save.rolls[1]] as [number, number])
				: ([save.rolls?.[0] ?? save.total] as [number]),
		dc,
		success,
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveHealing(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.healing) {
		throw new Error("Missing healing payload");
	}
	const healing = rollDiceString(payload.healing.roll);
	return {
		kind: "healing",
		healingTotal: healing.result,
		healingRolls: healing.rolls,
	};
}

export function resolveDamage(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.damage) {
		throw new Error("Missing damage payload");
	}
	const damage = rollDiceString(payload.damage.roll);
	return {
		kind: "damage",
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveEffect(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	return {
		kind: "effect",
		name: payload.name,
		description: payload.description,
	};
}
