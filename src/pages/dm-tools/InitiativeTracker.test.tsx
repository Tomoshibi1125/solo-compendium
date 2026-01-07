import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import InitiativeTracker from './InitiativeTracker';

const STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';

describe('InitiativeTracker', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads persisted combatants from localStorage', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        combatants: [
          { id: 'c1', name: 'Goblin', initiative: 12, conditions: [], isHunter: false },
        ],
        currentTurn: 0,
        round: 1,
      })
    );

    render(
      <MemoryRouter>
        <InitiativeTracker />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Goblin').length).toBeGreaterThan(0);
  });

  it('advances the round when the turn wraps back to the top', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InitiativeTracker />
      </MemoryRouter>
    );

    // Add two combatants
    await user.type(screen.getByPlaceholderText(/hunter or gate creature name/i), 'A');
    await user.click(screen.getByRole('button', { name: /add to initiative/i }));

    await user.type(screen.getByPlaceholderText(/hunter or gate creature name/i), 'B');
    await user.click(screen.getByRole('button', { name: /add to initiative/i }));

    const roundLabel = screen.getByText('ROUND');
    const roundContainer = roundLabel.parentElement;
    if (!roundContainer) throw new Error('Round container not found');

    expect(roundContainer).toHaveTextContent('1');

    // Two combatants: advancing twice wraps and increments the round.
    await user.click(screen.getByRole('button', { name: /next turn/i }));
    await user.click(screen.getByRole('button', { name: /next turn/i }));

    expect(roundContainer).toHaveTextContent('2');
  });
});


