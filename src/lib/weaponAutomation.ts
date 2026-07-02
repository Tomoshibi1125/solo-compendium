/**
 * DDB-parity weapon automation — pure helpers for ammunition tracking and
 * versatile damage, consumed by useCombatActions/ActionsList.
 *
 * Ammunition: a weapon with the 5e "ammunition" property draws from a matching
 * inventory row ("Arrows (20)", "Crossbow Bolts (20)", …); each attack spends 1.
 * Versatile: catalog data carries a bare "versatile" property (no die), so the
 * two-handed die follows the standard 5e step-up unless the property spells one
 * out ("versatile (1d10)").
 */

export interface AmmunitionRowLike {
	id: string;
	name: string;
	quantity?: number | null;
}

export interface AmmunitionMatch {
	id: string;
	name: string;
	remaining: number;
}

/**
 * Weapon kind → the ammo word its ammunition rows are named with. The classic
 * four are strict (a crossbow cannot fire arrows); firearm-style RA launchers
 * fall back to any ammo-named row since their ammunition naming varies.
 */
const AMMO_KIND_MATCHERS: Array<{
	weapon: RegExp;
	ammo: RegExp;
	strict: boolean;
}> = [
	{ weapon: /crossbow/i, ammo: /bolt/i, strict: true },
	{ weapon: /\bbow\b|longbow|shortbow/i, ammo: /arrow/i, strict: true },
	{ weapon: /blowgun/i, ammo: /needle/i, strict: true },
	{ weapon: /sling/i, ammo: /bullet/i, strict: true },
	{
		weapon: /gun|pistol|rifle|carbine|launcher|firearm/i,
		ammo: /round|cell|shell|magazine|cartridge/i,
		strict: false,
	},
];

/** Any inventory row that reads as ammunition, for the generic fallback.
 * Exported so the unified resource tracker classifies exactly the rows that
 * attacks can draw from. */
export const GENERIC_AMMO_RE =
	/arrow|bolt|needle|bullet|round|cell|shell|magazine|cartridge|ammo/i;

export function weaponRequiresAmmunition(properties: string[]): boolean {
	return properties.some((p) => /^ammunition\b/i.test(p.trim()));
}

/**
 * Find the inventory row a weapon should draw ammunition from. Prefers the
 * weapon's own ammo kind (bow→arrows, crossbow→bolts, …), falling back to any
 * ammo-named row for unrecognized launchers. Rows with stock left win over
 * empty ones so an exhausted pouch doesn't shadow a full quiver.
 */
export function findAmmunitionRow(
	weaponName: string,
	rows: readonly AmmunitionRowLike[],
): AmmunitionMatch | null {
	const kind = AMMO_KIND_MATCHERS.find((m) => m.weapon.test(weaponName));
	let candidates = rows.filter((row) =>
		kind ? kind.ammo.test(row.name) : GENERIC_AMMO_RE.test(row.name),
	);
	if (candidates.length === 0 && kind && !kind.strict) {
		candidates = rows.filter((row) => GENERIC_AMMO_RE.test(row.name));
	}
	if (candidates.length === 0) return null;
	const sorted = [...candidates].sort(
		(a, b) => (b.quantity ?? 0) - (a.quantity ?? 0),
	);
	const best = sorted[0];
	return {
		id: best.id,
		name: best.name,
		remaining: Math.max(0, best.quantity ?? 0),
	};
}

/**
 * Monk-style martial-arts die for the Striker job (RA Monk analog). Striker
 * unarmed strikes and `striker`-property weapons scale with this die; the
 * Striker Stance fighting style does NOT — its written 1d4/1d6 stays flat.
 */
export function getStrikerMartialArtsDie(level: number): string {
	if (level >= 17) return "1d10";
	if (level >= 11) return "1d8";
	if (level >= 5) return "1d6";
	return "1d4";
}

const diceAverage = (dice: string): number => {
	const parsed = dice.match(/^(\d+)d(\d+)$/i);
	if (!parsed) return 0;
	const count = parseInt(parsed[1], 10);
	const size = parseInt(parsed[2], 10);
	return (count * (size + 1)) / 2;
};

/**
 * The better of a weapon's own damage dice and a scaling die (monk weapon
 * rule: use the martial-arts die in place of the weapon's damage when it is
 * higher). Falls back to whichever side parses when the other does not.
 */
export function pickLargerDamageDice(
	weaponDice: string | null | undefined,
	scalingDice: string,
): string {
	if (!weaponDice) return scalingDice;
	return diceAverage(weaponDice) >= diceAverage(scalingDice)
		? weaponDice
		: scalingDice;
}

const VERSATILE_DIE_STEP: Record<string, string> = {
	d4: "d6",
	d6: "d8",
	d8: "d10",
	d10: "d12",
};

/**
 * Two-handed damage dice for a versatile weapon, or null when the weapon is
 * not versatile / already at the top die / has no parseable dice.
 */
export function getVersatileDamageDice(
	properties: string[],
	damageDice: string | null | undefined,
): string | null {
	const versatileProp = properties.find((p) => /^versatile\b/i.test(p.trim()));
	if (!versatileProp) return null;

	const explicit = versatileProp.match(/\((\d+d\d+)\)/i);
	if (explicit?.[1]) return explicit[1].toLowerCase();

	const parsed = damageDice?.match(/^(\d+)d(\d+)$/i);
	if (!parsed) return null;
	const stepped = VERSATILE_DIE_STEP[`d${parsed[2]}`];
	return stepped ? `${parsed[1]}${stepped}` : null;
}
