export const SANDBOX_NPC_MARKER = "[SANDBOX_NPC]";

type CharacterNotesLike = {
	notes?: string | null;
};

export function isSandboxNpcCharacter<T extends CharacterNotesLike>(
	character: T | null | undefined,
): character is T {
	return (
		typeof character?.notes === "string" &&
		character.notes.includes(SANDBOX_NPC_MARKER)
	);
}

export function filterPersonalCharacters<T extends CharacterNotesLike>(
	characters: T[],
): T[] {
	return characters.filter((character) => !isSandboxNpcCharacter(character));
}
