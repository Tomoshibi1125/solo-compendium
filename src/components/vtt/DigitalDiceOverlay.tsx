import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { type VTTChatMessage } from '@/hooks/useVTTRealtime';
import { Dice3DRoller } from '@/components/dice/Dice3D';
import type { DiceTheme } from '@/components/dice/diceThemes';

/** Display mode for each 3D die */
export type DiceDisplayMode = 'standard' | 'percentile-tens' | 'percentile-ones';

/** State for a single 3D die */
export interface Dice3DState {
    sides: number;
    value: number | null;
    displayValue?: number | null;
    displayMode?: DiceDisplayMode;
}

/** Extended chat message with optional dice roll data */
interface VTTChatMessageWithDice extends VTTChatMessage {
    diceRolls?: number[];
}

interface DigitalDiceOverlayProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vttRealtime: any;
    theme?: DiceTheme;
}


type DiceSlot =
    | { kind: 'standard'; index: number }
    | { kind: 'percentile'; indices: [number, number] };

export function DigitalDiceOverlay({ vttRealtime, theme = 'umbral-ascendant' }: DigitalDiceOverlayProps) {
    const [dice3D, setDice3D] = useState<Dice3DState[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleIncomingRoll = useCallback((rawMsg: VTTChatMessage) => {
        const msg = rawMsg as VTTChatMessageWithDice;
        if (!msg.diceFormula || !msg.diceRolls || msg.diceRolls.length === 0) return;

        // Parse simple formula like "1d20+5"
        const parsed = msg.diceFormula.match(/(\d+)d(\d+)/g);
        if (!parsed) return;

        const dice: Dice3DState[] = [];
        const slots: DiceSlot[] = [];

        parsed.forEach((part) => {
            const match = part.match(/(\d+)d(\d+)/);
            if (match) {
                const count = parseInt(match[1]);
                const sides = parseInt(match[2]);
                for (let i = 0; i < count; i++) {
                    if (sides === 100) {
                        const tensIndex = dice.length;
                        dice.push({ sides: 10, value: null, displayMode: 'percentile-tens' });
                        const onesIndex = dice.length;
                        dice.push({ sides: 10, value: null, displayMode: 'percentile-ones' });
                        slots.push({ kind: 'percentile', indices: [tensIndex, onesIndex] });
                    } else {
                        const index = dice.length;
                        dice.push({ sides, value: null, displayMode: 'standard' });
                        slots.push({ kind: 'standard', index });
                    }
                }
            }
        });

        // Determine initial state
        setDice3D(dice);
        setVisible(true);
        setIsRolling(true);

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        // Short delay to let the 3D canvas appear and physics start settling
        setTimeout(() => {
            const updated = [...dice];
            let rollIndex = 0;

            slots.forEach((slot) => {
                const roll = (rawMsg as VTTChatMessageWithDice).diceRolls![rollIndex] ?? 0;
                rollIndex += 1;
                if (slot.kind === 'standard') {
                    updated[slot.index] = { ...updated[slot.index], value: roll };
                    return;
                }

                const tens = Math.floor((roll % 100) / 10);
                const ones = roll % 10;
                updated[slot.indices[0]] = {
                    ...updated[slot.indices[0]],
                    value: tens,
                    displayValue: tens,
                    displayMode: 'percentile-tens',
                };
                updated[slot.indices[1]] = {
                    ...updated[slot.indices[1]],
                    value: ones,
                    displayValue: ones,
                    displayMode: 'percentile-ones',
                };
            });

            setDice3D(updated);

            // Hide the overlay after a set amount of time reading the result
            timeoutRef.current = window.setTimeout(() => {
                setVisible(false);
            }, 6000);
        }, 150);

    }, []);

    useEffect(() => {
        if (!vttRealtime) return;

        const unsubChat = vttRealtime.on('chat_message', (payload: VTTChatMessage) => {
            if (payload.type === 'dice' || payload.type === 'gmroll' || payload.type === 'roll_whisper' || payload.diceFormula) {
                handleIncomingRoll(payload);
            }
        });
        const unsubDice = vttRealtime.on('dice_roll', (payload: VTTChatMessage) => {
            handleIncomingRoll(payload);
        });

        return () => {
            if (unsubChat) unsubChat();
            if (unsubDice) unsubDice();
        };
    }, [vttRealtime, handleIncomingRoll]);

    if (!visible || dice3D.length === 0) return null;

    return (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="w-full max-w-4xl h-[60vh] max-h-[600px] pointer-events-none">
                <Suspense fallback={null}>
                    <Dice3DRoller
                        dice={dice3D}
                        isRolling={isRolling}
                        theme={theme}
                        onRollComplete={() => {
                            // Individual die settled
                        }}
                    />
                </Suspense>
            </div>
        </div>
    );
}
