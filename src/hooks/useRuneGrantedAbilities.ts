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
import { useFeatures } from "@/hooks/useFeatures";
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
	grantedAbilityRefs: Set<string>;
	isLoading: boolean;
}

function normalizeAbilityKey(value: string): string {
	return value.trim().toLowerCase();
}

function slugifyAbilityKey(value: string): string {
	return normalizeAbilityKey(value)
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function getRuneTeachesModifier(feature: {
	modifiers?: unknown;
}): { kind?: string | null; ref?: string | null } | null {
	const modifiers = feature.modifiers;
	if (!modifiers || typeof modifiers !== "object" || Array.isArray(modifiers)) {
		return null;
	}
	const teaches = (modifiers as { teaches?: unknown }).teaches;
	if (!teaches || typeof teaches !== "object" || Array.isArray(teaches)) {
		return null;
	}
	return teaches as { kind?: string | null; ref?: string | null };
}

export function useRuneGrantedAbilities(
	characterId: string | undefined,
): RuneGrantedAbilities {
	const { data: runeKnowledge = [], isLoading } =
		useCharacterRuneKnowledge(characterId);
	const { features = [], isLoading: featuresLoading } = useFeatures(
		characterId ?? "",
	);

	const grantedAbilityNames = useMemo(() => {
		const names = new Set<string>();
		for (const entry of runeKnowledge) {
			// Only absorbed runes count as "granting" the ability.
			if ((entry.mastery_level ?? 0) < 5) continue;
			const name = entry.rune?.name;
			if (!name) continue;
			const derived = deriveGrantedAbilityName(name);
			if (derived) names.add(derived);
		}
		return names;
	}, [runeKnowledge]);

	const grantedAbilityRefs = useMemo(() => {
		const refs = new Set<string>();
		for (const feature of features) {
			if (!feature.source?.startsWith("Rune:")) continue;
			const teaches = getRuneTeachesModifier(feature);
			if (!teaches?.ref) continue;
			refs.add(normalizeAbilityKey(teaches.ref));
			refs.add(slugifyAbilityKey(teaches.ref));
		}
		return refs;
	}, [features]);

	return {
		grantedAbilityNames,
		grantedAbilityRefs,
		isLoading: isLoading || featuresLoading,
	};
}

/**
 * Convenience predicate: does the character have rune-granted access to the
 * supplied ability name? Comparison is case-insensitive and trim-tolerant.
 */
export function isRuneGranted(
	abilityName: string,
	grantedAbilityNames: Set<string>,
	grantedAbilityRefs?: Set<string>,
): boolean {
	const normalized = normalizeAbilityKey(abilityName);
	if (grantedAbilityNames.has(normalized)) return true;
	if (grantedAbilityRefs?.has(slugifyAbilityKey(abilityName))) return true;
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
