/**
 * SharedDiceTray — DDB-style shared 3D dice overlay
 *
 * When any connected player rolls dice, ALL clients see the same 3D dice
 * animation in a fixed bottom-center overlay. Shows the roller's name,
 * formula, and auto-dismisses after animation completes.
 *
 * Position: fixed bottom-center of the VTT canvas (Option A — DDB style).
 */

import { X } from "lucide-react";
import "./SharedDiceTray.css";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { DiceTheme } from "@/components/dice/diceThemes";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import type { SharedDiceRollSpec } from "@/hooks/useVTTRealtime";
import { cn } from "@/lib/utils";

const Dice3DRollerLazy = lazy(() =>
	import("@/components/dice/Dice3DScene").then((module) => ({
		default: module.Dice3DRoller,
	})),
);

interface SharedDiceTrayProps {
	roll: SharedDiceRollSpec | null;
	onDismiss: () => void;
	theme?: DiceTheme;
	className?: string;
}

export function SharedDiceTray({
	roll,
	onDismiss,
	theme = "umbral-ascendant",
	className,
}: SharedDiceTrayProps) {
	const [isRolling, setIsRolling] = useState(false);
	const [_completedCount, setCompletedCount] = useState(0);
	const [entering, setEntering] = useState(false);
	const [exiting, setExiting] = useState(false);

	// Dice specs for 3D renderer: map from SharedDiceRollSpec to Dice3DRoller format
	const diceSpecs = useMemo(() => {
		if (!roll) return [];
		return roll.dice.map((d) => ({
			sides: d.sides,
			value: d.value,
		}));
	}, [roll]);

	// Trigger roll animation when a new roll arrives
	useEffect(() => {
		if (!roll) {
			setEntering(false);
			setExiting(false);
			return;
		}
		setCompletedCount(0);
		setEntering(true);
		setIsRolling(true);

		// Start rolling immediately
		const startTimer = setTimeout(() => {
			setEntering(false);
		}, 150);

		return () => clearTimeout(startTimer);
	}, [roll?.id, roll]);

	// Handle individual die completion
	const handleRollComplete = useCallback(
		(_index: number, _value: number) => {
			setCompletedCount((prev) => {
				const next = prev + 1;
				if (next >= diceSpecs.length) {
					setIsRolling(false);
					// Auto-dismiss after pause to admire the result
					setTimeout(() => {
						setExiting(true);
						setTimeout(onDismiss, 400);
					}, 2800);
				}
				return next;
			});
		},
		[diceSpecs.length, onDismiss],
	);

	if (!roll || diceSpecs.length === 0) return null;

	const isCritical = roll.critical;
	const isFumble = roll.fumble;

	return (
		<DynamicStyle
			className={cn(
				"shared-dice-tray",
				entering && "shared-dice-tray--entering",
				exiting && "shared-dice-tray--exiting",
				isCritical && "shared-dice-tray--critical",
				isFumble && "shared-dice-tray--fumble",
				className,
			)}
			vars={{
				"--dice-count": diceSpecs.length,
			}}
		>
			{/* Dismiss button */}
			<button
				type="button"
				className="shared-dice-tray__dismiss"
				onClick={() => {
					setExiting(true);
					setTimeout(onDismiss, 300);
				}}
				aria-label="Dismiss dice"
			>
				<X className="w-3.5 h-3.5" />
			</button>

			{/* Roller info header */}
			<div className="shared-dice-tray__header">
				<span className="shared-dice-tray__roller-name">{roll.rollerName}</span>
				<span className="shared-dice-tray__formula">{roll.formula}</span>
			</div>

			{/* 3D Dice Canvas */}
			<div className="shared-dice-tray__canvas">
				<Suspense
					fallback={
						<div className="shared-dice-tray__loading">
							<div className="shared-dice-tray__loading-spinner" />
						</div>
					}
				>
					<Dice3DRollerLazy
						dice={diceSpecs}
						isRolling={isRolling}
						onRollComplete={handleRollComplete}
						theme={(roll.theme as DiceTheme) || theme}
						className="shared-dice-tray__roller"
					/>
				</Suspense>
			</div>

			{/* Result display */}
			{!isRolling && (
				<div
					className={cn(
						"shared-dice-tray__result",
						isCritical && "shared-dice-tray__result--critical",
						isFumble && "shared-dice-tray__result--fumble",
					)}
				>
					<span className="shared-dice-tray__result-value">
						{isCritical && "🎯 "}
						{isFumble && "💀 "}
						{roll.result}
					</span>
				</div>
			)}
		</DynamicStyle>
	);
}
