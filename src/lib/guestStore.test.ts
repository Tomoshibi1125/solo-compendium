import { describe, it, expect, beforeEach } from 'vitest';
import {
  createLocalCharacter,
  deleteLocalCharacter,
  getLocalCharacterWithAbilities,
  listLocalCharacters,
  setLocalAbilities,
} from './guestStore';

describe('guestStore', () => {
  beforeEach(() => {
    try {
      window.localStorage.removeItem('solo-compendium.guest.v1');
    } catch {
      // ignore
    }
  });

  it('creates a local character and lists it', () => {
    const created = createLocalCharacter({
      name: 'Guest Hunter',
      level: 1,
      job: 'Fighter',
      user_id: 'guest', // ignored by createLocalCharacter signature in app code; safe to include in tests via structural typing
    } as unknown as Parameters<typeof createLocalCharacter>[0]);

    const listed = listLocalCharacters();
    expect(listed.length).toBe(1);
    expect(listed[0]?.id).toBe(created.id);
    expect(listed[0]?.user_id).toBe('guest');
  });

  it('stores abilities for a local character', () => {
    const created = createLocalCharacter({
      name: 'Guest Hunter',
      user_id: 'guest',
    } as unknown as Parameters<typeof createLocalCharacter>[0]);

    setLocalAbilities(created.id, {
      STR: 14,
      AGI: 12,
      VIT: 13,
      INT: 10,
      SENSE: 11,
      PRE: 8,
    });

    const withAbilities = getLocalCharacterWithAbilities(created.id);
    expect(withAbilities?.abilities.STR).toBe(14);
    expect(withAbilities?.abilities.PRE).toBe(8);
  });

  it('deletes a local character', () => {
    const created = createLocalCharacter({
      name: 'Guest Hunter',
      user_id: 'guest',
    } as unknown as Parameters<typeof createLocalCharacter>[0]);

    deleteLocalCharacter(created.id);
    expect(listLocalCharacters()).toEqual([]);
  });
});


