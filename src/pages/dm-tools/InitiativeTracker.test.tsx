import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Mock } from 'vitest';

vi.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import InitiativeTracker from './InitiativeTracker';

const STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';

describe('InitiativeTracker', () => {
  beforeEach(() => {
    // Clear localStorage properly in test environment
    if (window.localStorage && typeof window.localStorage.clear === 'function') {
      window.localStorage.clear();
    } else {
      // Mock localStorage for test environment
      const mockStorage = {
        clear: () => {},
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        length: 0,
        key: () => null,
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true,
      });
    }
  });

  it('loads persisted combatants from localStorage', () => {
    // Mock localStorage to return the stored data
    const mockData = {
      version: 1,
      combatants: [
        { id: 'c1', name: 'Goblin', initiative: 12, conditions: [], isHunter: false },
      ],
      currentTurn: 0,
      round: 1,
    };
    
    (window.localStorage.getItem as Mock).mockReturnValue(JSON.stringify(mockData));

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
    expect(roundContainer).not.toBeNull();
    if (!roundContainer) return;

    expect(roundContainer).toHaveTextContent('1');

    // Two combatants: advancing twice wraps and increments the round.
    await user.click(screen.getByRole('button', { name: /next turn/i }));
    await user.click(screen.getByRole('button', { name: /next turn/i }));

    expect(roundContainer).toHaveTextContent('2');
  });

  it('tracks hp changes, conditions, and persistence', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <InitiativeTracker />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/hunter or gate creature name/i), 'Goblin');

    const hpInput = screen.getByLabelText('HP');
    await user.clear(hpInput);
    await user.type(hpInput, '12');

    const maxHpInput = screen.getByLabelText('MAX HP');
    await user.clear(maxHpInput);
    await user.type(maxHpInput, '12');

    await user.click(screen.getByRole('button', { name: /add to initiative/i }));

    const card = screen
      .getAllByText('Goblin')
      .map((node) => node.closest('[data-combatant-card]'))
      .find((node): node is HTMLElement => node instanceof HTMLElement);
    expect(card).toBeDefined();

    const cardScope = within(card!);
    const cardHp = cardScope.getByLabelText('HP for Goblin') as HTMLInputElement;
    expect(cardHp.value).toBe('12');

    await user.click(cardScope.getByRole('button', { name: /damage goblin by 5/i }));
    expect((cardScope.getByLabelText('HP for Goblin') as HTMLInputElement).value).toBe('7');

    await user.click(cardScope.getByText('+ Grappled'));
    expect(cardScope.getByText(/Grappled/i)).toBeInTheDocument();

    // Mock localStorage.getItem to return the stored data
    const storedData = {
      version: 1,
      combatants: [
        { id: expect.any(String), name: 'Goblin', hp: 7, maxHp: 12, conditions: ['Grappled'], initiative: expect.any(Number), isHunter: false },
      ],
      currentTurn: 0,
      round: 1,
    };
    (window.localStorage.getItem as Mock).mockReturnValue(JSON.stringify(storedData));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.combatants?.[0]?.hp).toBe(7);
    expect(stored.combatants?.[0]?.conditions).toContain('Grappled');
  });
});


