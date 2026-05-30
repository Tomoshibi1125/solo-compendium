export type UnarmoredDefenseJob = "Striker" | "Berserker" | "Revenant";

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

	if (normalized === "revenant") {
		// Unarmored Requiem: 10 + INT + VIT, with no AGI base (the entropy-sheathed
		// drain tank keys off its caster stat and durability, not finesse).
		const int = abilities.INT ?? 10;
		const vit = abilities.VIT ?? 10;
		const intMod = Math.floor((int - 10) / 2);
		const vitMod = Math.floor((vit - 10) / 2);
		return 10 + intMod + vitMod;
	}

	return null;
}
