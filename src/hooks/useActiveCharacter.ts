import { useEffect, useMemo } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { useUserLocalState } from "@/hooks/useToolState";

const STORAGE_KEY = "active-character";

export function useActiveCharacter() {
	const { data: characters = [], isLoading } = useCharacters();
	const { state: activeCharacterId, setState: setActiveCharacterId } =
		useUserLocalState<string | null>(STORAGE_KEY, { initialState: null });

	useEffect(() => {
		if (characters.length === 0) return;

		// If we have a stored active character and it exists in the list, keep it
		if (
			activeCharacterId &&
			characters.some((character) => character.id === activeCharacterId)
		) {
			return;
		}

		// Otherwise, select the first character
		const nextId = characters[0].id;
		setActiveCharacterId(nextId);
	}, [characters, activeCharacterId, setActiveCharacterId]);

	const activeCharacter = useMemo(
		() =>
			characters.find((character) => character.id === activeCharacterId) ||
			null,
		[characters, activeCharacterId],
	);

	const setActiveCharacter = (characterId: string) => {
		setActiveCharacterId(characterId);
	};

	return {
		characters,
		activeCharacter,
		activeCharacterId,
		setActiveCharacter,
		isLoading,
	};
}
