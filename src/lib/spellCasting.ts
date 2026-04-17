/**
 * Spell Casting Engine
 * Handles spell slot consumption, ritual casting, upcasting, and cantrip scaling.
 *
 * Standard 5e rules:
 * - Normal casting: consumes a spell slot of the spell's level or higher
 * - Upcasting: cast at a higher slot level for enhanced effects
 * - Ritual casting: cast without consuming a slot (takes 10 extra minutes)
 * - Cantrips: no slot cost, damage dice scale by character level (1/5/11/17)
 * - Pact casting (Contractor): all slots are same level, recharge on short rest
 *
 * All functions are pure — callers provide state, functions return results.
 */

import {
	getCasterType,
	getSpellSlotsPerLevel,
} from "./5eCharacterCalculations";

// ── Types ─────────────────────────────────────────────────────────────

export interface SpellSlotState {
	[level: number]: { current: number; max: number };
}

export interface CastSpellInput {
	/** Spell's native level (0 for cantrips) */
	spellLevel: number;
	/** Slot level to use for casting (>= spellLevel for upcasting) */
	slotLevelUsed: number;
	/** Cast as ritual (no slot consumed) */
	isRitual: boolean;
	/** Whether the spell has the ritual tag */
	isRitualSpell: boolean;
	/** Character level */
	casterLevel: number;
	/** Character's Job */
	job: string;
	/** Current spell slot state */
	currentSlots: SpellSlotState;
}

export interface CastSpellResult {
	/** Whether the cast was successful */
	success: boolean;
	/** Updated spell slot state (only changed if a slot was consumed) */
	updatedSlots: SpellSlotState;
	/** Whether a slot was actually consumed */
	slotConsumed: boolean;
	/** How many levels above the spell's base level this was cast at */
	upcastLevels: number;
	/** Error message if success = false */
	error?: string;
	/** Descriptive message for the chat log */
	message: string;
}

// ── Main Casting Function ─────────────────────────────────────────────

/**
 * Attempt to cast a spell, consuming a slot if needed.
 */
export function castSpell(input: CastSpellInput): CastSpellResult {
	const {
		spellLevel,
		slotLevelUsed,
		isRitual,
		isRitualSpell,
		casterLevel,
		job,
		currentSlots,
	} = input;

	// Clone slots to avoid mutation
	const updatedSlots: SpellSlotState = {};
	for (const [lvl, slot] of Object.entries(currentSlots)) {
		updatedSlots[Number(lvl)] = { ...slot };
	}

	// Cantrips: always free, no slot needed
	if (spellLevel === 0) {
		const dice = getCantripDamageDice(casterLevel);
		return {
			success: true,
			updatedSlots,
			slotConsumed: false,
			upcastLevels: 0,
			message: `Cantrip cast (${dice}d scaling at level ${casterLevel}).`,
		};
	}

	// Ritual casting: no slot consumed
	if (isRitual) {
		if (!isRitualSpell) {
			return {
				success: false,
				updatedSlots,
				slotConsumed: false,
				upcastLevels: 0,
				error: "This spell cannot be cast as a ritual.",
				message: "Cast failed: spell is not a ritual.",
			};
		}

		// Check if the job can ritual cast
		if (!canCastAsRitual(spellLevel, isRitualSpell, job)) {
			return {
				success: false,
				updatedSlots,
				slotConsumed: false,
				upcastLevels: 0,
				error: "Your Job does not support ritual casting.",
				message: "Cast failed: Job cannot ritual cast.",
			};
		}

		return {
			success: true,
			updatedSlots,
			slotConsumed: false,
			upcastLevels: 0,
			message: `Ritual cast (no slot consumed, casting time +10 minutes).`,
		};
	}

	// Validate upcast
	if (slotLevelUsed < spellLevel) {
		return {
			success: false,
			updatedSlots,
			slotConsumed: false,
			upcastLevels: 0,
			error: `Cannot cast a level ${spellLevel} spell using a level ${slotLevelUsed} slot.`,
			message: `Cast failed: slot level too low.`,
		};
	}

	// Check if the slot is available
	const slot = updatedSlots[slotLevelUsed];
	if (!slot || slot.current <= 0) {
		return {
			success: false,
			updatedSlots,
			slotConsumed: false,
			upcastLevels: 0,
			error: `No level ${slotLevelUsed} spell slots remaining.`,
			message: `Cast failed: no level ${slotLevelUsed} slots available.`,
		};
	}

	// Consume the slot
	updatedSlots[slotLevelUsed] = {
		...slot,
		current: slot.current - 1,
	};

	const upcastLevels = slotLevelUsed - spellLevel;

	return {
		success: true,
		updatedSlots,
		slotConsumed: true,
		upcastLevels,
		message:
			upcastLevels > 0
				? `Cast at level ${slotLevelUsed} (upcast +${upcastLevels}). Slot consumed (${updatedSlots[slotLevelUsed].current}/${slot.max} remaining).`
				: `Cast at level ${slotLevelUsed}. Slot consumed (${updatedSlots[slotLevelUsed].current}/${slot.max} remaining).`,
	};
}

// ── Validation Helpers ────────────────────────────────────────────────

/**
 * Check if a spell can be cast as a ritual.
 * Only certain Jobs can ritual cast:
 * - Herald (Cleric equivalent): can ritual cast any prepared ritual spell
 * - Mage (Wizard equivalent): can ritual cast any known ritual spell
 * - Summoner (Druid equivalent): can ritual cast any prepared ritual spell
 */
export function canCastAsRitual(
	_spellLevel: number,
	isRitualSpell: boolean,
	job: string,
): boolean {
	if (!isRitualSpell) return false;

	const ritualCasters = [
		"herald",
		"mage",
		"summoner",
		"stalker",
		"holy knight",
	];
	return ritualCasters.includes(job.toLowerCase());
}

/**
 * Check if a spell can be upcast to a given level.
 */
export function canUpcast(spellLevel: number, targetLevel: number): boolean {
	if (spellLevel === 0) return false; // Cantrips can't be upcast
	if (targetLevel < spellLevel) return false;
	if (targetLevel > 9) return false;
	return true;
}

/**
 * Get all slot levels that have available slots for casting a given spell.
 */
export function getAvailableSlotLevels(
	spellLevel: number,
	slots: SpellSlotState,
): number[] {
	if (spellLevel === 0) return []; // Cantrips don't use slots

	const available: number[] = [];
	for (let level = spellLevel; level <= 9; level++) {
		if (slots[level] && slots[level].current > 0) {
			available.push(level);
		}
	}
	return available;
}

/**
 * Get the number of damage dice for a cantrip based on character level.
 * Standard 5e scaling: 1d at 1, 2d at 5, 3d at 11, 4d at 17.
 */
export function getCantripDamageDice(casterLevel: number): number {
	if (casterLevel >= 17) return 4;
	if (casterLevel >= 11) return 3;
	if (casterLevel >= 5) return 2;
	return 1;
}

// ── Slot Initialization ───────────────────────────────────────────────

/**
 * Initialize spell slots for a character based on Job and level.
 */
export function initializeSpellSlots(
	job: string,
	level: number,
): SpellSlotState {
	const casterType = getCasterType(job);
	if (casterType === "none") return {};

	const maxSlots = getSpellSlotsPerLevel(casterType, level);
	const slots: SpellSlotState = {};

	for (const [levelStr, count] of Object.entries(maxSlots)) {
		const slotLevel = parseInt(levelStr, 10);
		if (count > 0) {
			slots[slotLevel] = { current: count, max: count };
		}
	}

	return slots;
}
