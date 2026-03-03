import { Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGlobalDice } from '@/hooks/useGlobalDice';
import { Dice3DRoller } from '@/components/dice/Dice3D';
import { useShallow } from 'zustand/react/shallow';

export function GlobalDiceOverlay() {
    const { isVisible, isRolling, dice, theme, hideDice } = useGlobalDice(
        useShallow((state) => ({
            isVisible: state.isVisible,
            isRolling: state.isRolling,
            dice: state.dice,
            theme: state.theme,
            hideDice: state.hideDice,
        }))
    );

    // Escape key hides the dice instantly
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                hideDice();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, hideDice]);

    if (!isVisible || dice.length === 0) return null;

    return (
        <div
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/5 backdrop-blur-[1px] transition-all duration-300"
            aria-hidden="true"
        >
            <div className="w-[80vw] h-[80vh] pointer-events-auto">
                <Suspense fallback={null}>
                    <Dice3DRoller
                        dice={dice}
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
