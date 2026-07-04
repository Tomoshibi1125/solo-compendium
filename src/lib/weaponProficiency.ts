/**
 * Weapon proficiency matching (SRD 5.1 semantics).
 *
 * A character is proficient with a weapon when their proficiency list names
 * the weapon itself ("Rapiers") or its category ("Simple weapons",
 * "Martial weapons").
 *
 * Job proficiency lists are authored in the plural ("Rapiers", "Longswords",
 * "Hand crossbows" — see `data/compendium/jobs.ts`) while equipment rows are
 * singular ("Rapier"), so name matching compares singularized lowercase
 * forms. Without that normalization every named (non-category) proficiency
 * silently fails — an Idol's rapier attack dropped its proficiency bonus.
 */
export function isWeaponProficient(
	weaponProficiencies: string[] | null | undefined,
	item: { name: string; properties?: string[] | null },
): boolean {
	const singular = (name: string) => name.toLowerCase().replace(/s$/, "");
	const profs = (weaponProficiencies || []).map(singular);
	const itemProps = (item.properties || []).map((p) => p.toLowerCase());

	// Name match (singular-normalized)
	if (profs.includes(singular(item.name))) return true;

	// Category match — categories survive singularization ("simple weapons"
	// → "simple weapon" still contains "simple").
	if (
		itemProps.some((p) => p.includes("simple")) &&
		profs.some((p) => p.includes("simple"))
	)
		return true;
	if (
		itemProps.some((p) => p.includes("martial")) &&
		profs.some((p) => p.includes("martial"))
	)
		return true;

	return false;
}
