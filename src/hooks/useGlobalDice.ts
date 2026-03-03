import { create } from 'zustand';
import type { DiceTheme } from '@/components/dice/diceThemes';
import type { Dice3DState } from '@/components/vtt/DigitalDiceOverlay';

let rollSessionCounter = 0;

export interface GlobalDiceStore {
    dice: Dice3DState[];
    isRolling: boolean;
    isVisible: boolean;
    theme: DiceTheme;
    /** Current roll session ID — used to prevent concurrent roll collisions */
    _rollSessionId: number;
    triggerGlobalRoll: (
        formula: string,
        results: number[],
        options?: { theme?: DiceTheme; displayDuration?: number }
    ) => void;
    hideDice: () => void;
    setTheme: (theme: DiceTheme) => void;
}

export const useGlobalDice = create<GlobalDiceStore>((set, get) => ({
    dice: [],
    isRolling: false,
    isVisible: false,
    theme: 'umbral-ascendant', // SA default theme
    _rollSessionId: 0,

    triggerGlobalRoll: (formula, results, options) => {
        // ╔════════════════════════════════════════════════════════════════╗
        // ║  LOCAL-ONLY by design. The 3D dice physics render ONLY on    ║
        // ║  the rolling player's screen. Remote players see results     ║
        // ║  via broadcastDiceRoll → chat messages (no 3D overhead).     ║
        // ║  Do NOT wire this to Supabase broadcast receivers.           ║
        // ╚════════════════════════════════════════════════════════════════╝
        // Parse dice formula like "1d20+5" into an array of dice to render
        const parsed = formula.match(/(\d+)d(\d+)/g);
        if (!parsed) return;

        // Assign a unique session ID so overlapping rolls don't corrupt each other
        const sessionId = ++rollSessionCounter;

        const newDice: Dice3DState[] = [];

        parsed.forEach((part) => {
            const match = part.match(/(\d+)d(\d+)/);
            if (match) {
                const count = parseInt(match[1]);
                const sides = parseInt(match[2]);
                for (let i = 0; i < count; i++) {
                    if (sides === 100) {
                        newDice.push({ sides: 10, value: null, displayMode: 'percentile-tens' });
                        newDice.push({ sides: 10, value: null, displayMode: 'percentile-ones' });
                    } else {
                        newDice.push({ sides, value: null, displayMode: 'standard' });
                    }
                }
            }
        });

        set((state) => ({
            dice: newDice,
            isRolling: true,
            isVisible: true,
            theme: options?.theme || state.theme,
            _rollSessionId: sessionId,
        }));

        // Start rolling animation briefly before setting final results
        setTimeout(() => {
            // Guard: only settle if this session is still the active one
            if (get()._rollSessionId !== sessionId) return;

            let rollIndex = 0;
            set((state) => {
                if (state._rollSessionId !== sessionId) return state;
                const updatedDice = [...state.dice];

                for (let i = 0; i < updatedDice.length; i++) {
                    const die = updatedDice[i];
                    const roll = results[rollIndex] ?? 0;

                    if (die.displayMode === 'percentile-tens') {
                        const tens = Math.floor((roll % 100) / 10);
                        updatedDice[i] = { ...die, value: tens, displayValue: tens };
                        // Advance index but wait to use on ones
                    } else if (die.displayMode === 'percentile-ones') {
                        const ones = roll % 10;
                        updatedDice[i] = { ...die, value: ones, displayValue: ones };
                        rollIndex++; // Used up this roll for percentile pair
                    } else {
                        updatedDice[i] = { ...die, value: roll };
                        rollIndex++;
                    }
                }
                return { dice: updatedDice };
            });

            // Auto hide after setting — only if still the active session
            setTimeout(() => {
                if (get()._rollSessionId !== sessionId) return;
                set({ isVisible: false, isRolling: false });
            }, options?.displayDuration || 6000);

        }, 150);
    },

    hideDice: () => set({ isVisible: false, isRolling: false }),

    setTheme: (theme) => set({ theme }),
}));

