import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { PowersList } from './PowersList';
import type { Database } from '@/integrations/supabase/types';

// Keep UI/component dependencies lightweight for this unit test
vi.mock('@/components/ui/SortableList', () => ({
  SortableList: ({ items, renderItem }: { items: Array<{ id: string }>; renderItem: (item: { id: string }, index: number) => JSX.Element }) => (
    <div>
      {items.map((item, index) => (
        <div key={item.id}>{renderItem(item, index)}</div>
      ))}
    </div>
  ),
}));

const toastSpy = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastSpy }),
}));

const updateSpellSlotMutateAsync = vi.fn();
vi.mock('@/hooks/useSpellSlots', () => ({
  useSpellSlots: () => ({
    data: [
      { level: 1, max: 2, current: 2, recoveredOnShortRest: false, recoveredOnLongRest: true },
    ],
  }),
  useUpdateSpellSlot: () => ({
    mutateAsync: updateSpellSlotMutateAsync,
  }),
}));

type CharacterPowerRow = Database['public']['Tables']['character_powers']['Row'];

const leveledSpell: CharacterPowerRow = {
  id: 'power-1',
  character_id: 'char-1',
  created_at: new Date(0).toISOString(),
  display_order: 0,
  name: 'Test Spell',
  power_level: 1,
  is_prepared: true,
  is_known: true,
  source: 'Test',
  description: 'A test spell',
  higher_levels: null,
  casting_time: null,
  range: null,
  duration: null,
  concentration: false,
};

let powersState: CharacterPowerRow[] = [leveledSpell];

vi.mock('@/hooks/usePowers', () => ({
  usePowers: () => ({
    powers: powersState,
    updatePower: vi.fn(),
    removePower: vi.fn(),
    reorderPowers: vi.fn(),
    concentrationPower: null,
  }),
}));

vi.mock('@/hooks/useCharacters', () => ({
  useCharacter: () => ({
    data: {
      id: 'char-1',
      job: 'Mage',
      level: 5,
      abilities: { STR: 10, AGI: 10, VIT: 10, INT: 16, SENSE: 10, PRE: 10 },
    },
  }),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: () => ({ data: [], isLoading: false }),
  };
});

describe('PowersList spell slot consumption', () => {
  beforeEach(() => {
    toastSpy.mockClear();
    updateSpellSlotMutateAsync.mockReset().mockResolvedValue(undefined);
    powersState = [leveledSpell];
  });

  it('consumes a spell slot when casting a leveled spell', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PowersList characterId="char-1" />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /^cast$/i }));

    expect(updateSpellSlotMutateAsync).toHaveBeenCalledWith({
      characterId: 'char-1',
      spellLevel: 1,
      current: 1,
    });
  });

  it('does not consume spell slots when casting a cantrip', async () => {
    const user = userEvent.setup();

    powersState = [
      {
        ...leveledSpell,
        id: 'power-2',
        name: 'Test Cantrip',
        power_level: 0,
      },
    ];

    render(
      <MemoryRouter>
        <PowersList characterId="char-1" />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /^cast$/i }));

    expect(updateSpellSlotMutateAsync).not.toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Cantrip Cast',
      })
    );
  });
});


