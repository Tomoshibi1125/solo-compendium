import { useCharacter } from "@/hooks/useCharacters";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { useCharacterSovereign } from "@/hooks/useSavedSovereigns";

export interface SovereignReadiness {
	/** All prerequisites met and no Sovereign locked in yet → offer the fusion. */
	isReady: boolean;
	hasJob: boolean;
	hasPath: boolean;
	regentCount: number;
	/** A Sovereign fusion needs two unlocked Regents. */
	hasTwoRegents: boolean;
	/** A Sovereign is permanent/once-per-character — true once locked in. */
	alreadyLockedIn: boolean;
	isLoading: boolean;
}

/**
 * Derives whether a character's Gemini Protocol fusion is ready to perform:
 * Job + Path set, at least two Regents unlocked, and no Sovereign locked in yet.
 * Drives the "fusion ready" notification/CTA on the character sheet.
 */
export function useSovereignReady(
	characterId: string | undefined,
): SovereignReadiness {
	const { data: character, isLoading: charLoading } = useCharacter(
		characterId || "",
	);
	const { unlocks = [], isLoading: unlocksLoading } = useRegentUnlocks(
		characterId || "",
	);
	const { data: sovereign, isLoading: sovereignLoading } =
		useCharacterSovereign(characterId);

	const hasJob = Boolean(character?.job);
	const hasPath = Boolean(character?.path);
	const regentCount = unlocks.length;
	const hasTwoRegents = regentCount >= 2;
	const alreadyLockedIn = Boolean(sovereign);
	const isLoading = charLoading || unlocksLoading || sovereignLoading;

	return {
		isReady:
			!isLoading && hasJob && hasPath && hasTwoRegents && !alreadyLockedIn,
		hasJob,
		hasPath,
		regentCount,
		hasTwoRegents,
		alreadyLockedIn,
		isLoading,
	};
}
