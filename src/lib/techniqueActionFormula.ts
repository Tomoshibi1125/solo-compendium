import type { ActionResolutionPayload } from "@/lib/actionResolution";

export type TechniqueActionFormulaSource = {
	damageRoll?: string;
	attackRoll?: string;
	saveDC?: number;
	payload?: ActionResolutionPayload;
};

export function resolveTechniqueUseFormula(
	action: TechniqueActionFormulaSource | null | undefined,
): string {
	if (!action) return "technique";
	return (
		action.payload?.damage?.roll ??
		action.damageRoll ??
		action.payload?.attack?.roll ??
		action.attackRoll ??
		(action.payload?.save?.dc !== undefined
			? `DC ${action.payload.save.dc}`
			: undefined) ??
		(action.saveDC !== undefined ? `DC ${action.saveDC}` : undefined) ??
		action.payload?.kind ??
		"technique"
	);
}

export function resolveTechniqueUseRollType(
	action: TechniqueActionFormulaSource | null | undefined,
): string {
	const kind = action?.payload?.kind;
	if (kind === "damage" || kind === "healing" || kind === "attack") return kind;
	if (kind === "save") return "save";
	return "ability";
}
