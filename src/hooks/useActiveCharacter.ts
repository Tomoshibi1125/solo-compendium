import { useEffect, useMemo, useState } from 'react';
import { useCharacters } from '@/hooks/useCharacters';

const STORAGE_KEY = 'solo-compendium.active-character';

export function useActiveCharacter() {
  const { data: characters = [], isLoading } = useCharacters();
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && characters.some((character) => character.id === stored)) {
      setActiveCharacterId(stored);
      return;
    }
    if (characters.length > 0) {
      const nextId = characters[0].id;
      setActiveCharacterId(nextId);
      window.localStorage.setItem(STORAGE_KEY, nextId);
    }
  }, [characters]);

  const activeCharacter = useMemo(
    () => characters.find((character) => character.id === activeCharacterId) || null,
    [characters, activeCharacterId]
  );

  const setActiveCharacter = (characterId: string) => {
    setActiveCharacterId(characterId);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, characterId);
    }
  };

  return {
    characters,
    activeCharacter,
    activeCharacterId,
    setActiveCharacter,
    isLoading,
  };
}
