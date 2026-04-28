/**
 * useRuneGrantedAbilities — Surface the set of ability names that a character
 * has learned via absorbed runes.
 *
 * Compendium runes follow a strong naming convention: a `Rune of <Ability>`
 * grants the ability `<Ability>` once absorbed. This hook walks the
 * character's rune knowledge (`mastery_level >= 5` ⇒ absorbed), strips
 * common prefixes, and returns a lowercase Set the Add* dialogs can use to
 * badge entries with a "Rune" access chip.
 *
 * The matching is intentionally lenient (case-insensitive, prefix-agnostic)
 * so it works for runes named `"Rune of Magic Missile"`, `"Magic Missile Rune"`,
 * or simply `"Magic Missile"`.
 */

import { useMemo } from "react";
import { useCharacterRuneKnowledge } from "@/hooks/useRunes";

const RUNE_PREFIXES = ["rune of the ", "rune of ", "runic ", "sigil of "];

const RUNE_SUFFIXES = [" rune", " sigil"];

/** Normalize a rune name to the underlying ability name it likely grants. */
function deriveGrantedAbilityName(runeName: string): string {
	let normalized = runeName.trim().toLowerCase();
	for (const prefix of RUNE_PREFIXES) {
		if (normalized.startsWith(prefix)) {
			normalized = normalized.slice(prefix.length);
			break;
		}
	}
	for (const suffix of RUNE_SUFFIXES) {
		if (normalized.endsWith(suffix)) {
			normalized = normalized.slice(0, -suffix.length);
			break;
		}
	}
	return normalized.trim();
}

interface RuneGrantedAbilities {
	grantedAbilityNames: Set<string>;
	isLoading: boolean;
}

export function useRuneGrantedAbilities(
	characterId: string | undefined,
): RuneGrantedAbilities {
	const { data: runeKnowledge = [], isLoading } =
		useCharacterRuneKnowledge(characterId);

	const grantedAbilityNames = useMemo(() => {
		const set = new Set<string>();
		for (const entry of runeKnowledge) {
			// Only absorbed runes count as "granting" the ability.
			if ((entry.mastery_level ?? 0) < 5) continue;
			const name = entry.rune?.name;
			if (!name) continue;
			const derived = deriveGrantedAbilityName(name);
			if (derived) set.add(derived);
		}
		return set;
	}, [runeKnowledge]);

	return { grantedAbilityNames, isLoading };
}

/**
 * Convenience predicate: does the character have rune-granted access to the
 * supplied ability name? Comparison is case-insensitive and trim-tolerant.
 */
export function isRuneGranted(
	abilityName: string,
	grantedAbilityNames: Set<string>,
): boolean {
	if (grantedAbilityNames.size === 0) return false;
	const normalized = abilityName.trim().toLowerCase();
	if (grantedAbilityNames.has(normalized)) return true;
	// Fallback: check if any granted name is contained in the ability name
	// or vice-versa (handles minor naming drift between rune and ability).
	for (const granted of grantedAbilityNames) {
		if (
			granted.length >= 4 &&
			(normalized.includes(granted) || granted.includes(normalized))
		) {
			return true;
		}
	}
	return false;
}
