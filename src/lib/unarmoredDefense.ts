// biome-ignore lint/correctness/noUnusedVariables: exported for use in other modules
type UnarmoredDefenseJob = "Striker" | "Berserker";

export function getUnarmoredDefenseBaseAC(
	jobName: string | null | undefined,
	abilities: Record<string, number>,
): number | null {
	const normalized = (jobName || "").trim().toLowerCase();
	const agi = abilities.AGI ?? 10;
	const base = 10 + Math.floor((agi - 10) / 2);

	if (normalized === "striker") {
		const sense = abilities.SENSE ?? 10;
		const senseMod = Math.floor((sense - 10) / 2);
		return base + senseMod;
	}

	if (normalized === "berserker") {
		const vit = abilities.VIT ?? 10;
		const vitMod = Math.floor((vit - 10) / 2);
		return base + vitMod;
	}

	return null;
}
