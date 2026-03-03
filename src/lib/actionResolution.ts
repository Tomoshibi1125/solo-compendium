import { rollDiceString } from "@/lib/diceRoller";
import { rollCheck } from "@/lib/rollEngine";

export type ResolutionKind = "attack" | "save" | "healing" | "damage";

export type ActionResolutionPayload = {
	version: 1;
	id: string;
	name: string;
	source: {
		type:
			| "spell"
			| "monster_action"
			| "technique"
			| "item"
			| "artifact"
			| "relic";
		entryId: string;
	};
	kind: ResolutionKind;
	attack?: {
		roll: string;
		rollMode?: "normal" | "advantage" | "disadvantage";
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
	const attack =
		d20Mod !== null
			? (() => {
					return rollD20(d20Mod);
				})()
			: rollDiceString(payload.attack.roll);

	const hit = attack.result >= targetAC;

	if (!hit || !payload.damage) {
		return {
			kind: "attack",
			attackRoll: attack.total,
			attackTotal: attack.result,
			attackMode: mode,
			attackD20:
				(attack as Record<string, any>).rolls?.length === 2
					? [
							(attack as Record<string, any>).rolls[0],
							(attack as Record<string, any>).rolls[1],
						]
					: [(attack as Record<string, any>).rolls?.[0] ?? attack.total],
			targetAC,
			hit,
		};
	}

	const damage = rollDiceString(payload.damage.roll);
	return {
		kind: "attack",
		attackRoll: attack.total,
		attackTotal: attack.result,
		attackMode: mode,
		attackD20:
			(attack as Record<string, any>).rolls?.length === 2
				? [
						(attack as Record<string, any>).rolls[0],
						(attack as Record<string, any>).rolls[1],
					]
				: [(attack as Record<string, any>).rolls?.[0] ?? attack.total],
		targetAC,
		hit,
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
				(save as Record<string, any>).rolls?.length === 2
					? [
							(save as Record<string, any>).rolls[0],
							(save as Record<string, any>).rolls[1],
						]
					: [(save as Record<string, any>).rolls?.[0] ?? save.total],
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
			(save as Record<string, any>).rolls?.length === 2
				? [
						(save as Record<string, any>).rolls[0],
						(save as Record<string, any>).rolls[1],
					]
				: [(save as Record<string, any>).rolls?.[0] ?? save.total],
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
