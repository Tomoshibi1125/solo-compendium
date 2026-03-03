import { Suspense, useEffect, useRef, useState } from 'react';
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

    const containerRef = useRef<HTMLDivElement>(null);
    const [shaking, setShaking] = useState(false);

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

    // Detect critical hits (nat 20 on a d20) and trigger screen shake
    useEffect(() => {
        if (isRolling) return;
        const hasCrit = dice.some(
            (d) => d.sides === 20 && d.value === 20 && (d.displayMode ?? 'standard') === 'standard'
        );
        if (hasCrit) {
            setShaking(true);
            const timer = setTimeout(() => setShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }, [dice, isRolling]);

    if (!isVisible || dice.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/5 backdrop-blur-[1px] transition-all duration-300"
            aria-hidden="true"
            style={shaking ? { animation: 'dice-screen-shake 0.5s ease-out' } : undefined}
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
