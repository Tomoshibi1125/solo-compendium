/**
 * Attunement Rules (homebrew Rift Ascendant baseline)
 *
 * Pure-logic module shared between hooks/components. Extracted so the
 * attunement-cap and validation live in exactly one place.
 *
 * The Solo-Compendium / Rift-Ascendant baseline is 6 slots (intentionally
 * higher than the SRD 5e default of 3). Tune via {@link MAX_ATTUNEMENT_SLOTS}.
 */

/** Maximum number of items a character can be attuned to at once. */
export const MAX_ATTUNEMENT_SLOTS = 6;

export interface AttunableItemRef {
	id: string;
	name: string;
	requiresAttunement: boolean;
	isAttuned: boolean;
}

export interface AttunementValidation {
	allowed: boolean;
	reason: string;
}

/**
 * Validate whether an item can be attuned given the current attuned count.
 * Pure function — does not mutate.
 */
export function canAttuneItem(
	item: AttunableItemRef,
	currentAttunedCount: number,
): AttunementValidation {
	if (!item.requiresAttunement) {
		return {
			allowed: false,
			reason: `${item.name} does not require attunement.`,
		};
	}
	if (item.isAttuned) {
		return { allowed: false, reason: `${item.name} is already attuned.` };
	}
	if (currentAttunedCount >= MAX_ATTUNEMENT_SLOTS) {
		return {
			allowed: false,
			reason: `Attunement limit reached (${MAX_ATTUNEMENT_SLOTS}/${MAX_ATTUNEMENT_SLOTS}).`,
		};
	}
	return { allowed: true, reason: `Can attune ${item.name}.` };
}

/** Validate an unattune request. */
export function canUnattuneItem(item: AttunableItemRef): AttunementValidation {
	if (!item.isAttuned) {
		return { allowed: false, reason: `${item.name} is not attuned.` };
	}
	return { allowed: true, reason: `Can unattune ${item.name}.` };
}
