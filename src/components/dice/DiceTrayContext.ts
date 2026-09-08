import { createContext, useContext } from "react";
import type {
	DiceRollSession,
	DiceTraySessionInput,
} from "@/lib/diceTraySession";

export type DiceTrayPanel = "result" | "manual" | "collection" | "history";

export type DiceTrayContextValue = Readonly<{
	presentRoll: (input: DiceTraySessionInput) => DiceRollSession;
	openManual: () => void;
	openPanel: (panel: Exclude<DiceTrayPanel, "result">) => void;
	closeTray: () => void;
}>;

export const DiceTrayContext = createContext<DiceTrayContextValue | null>(null);

export function useDiceTray() {
	const context = useContext(DiceTrayContext);
	if (!context) {
		throw new Error("useDiceTray must be used inside DiceTrayProvider");
	}
	return context;
}
