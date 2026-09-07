export type RegentGrantKind = "spell" | "power" | "technique";

export interface RegentGrantProfile {
	spell: boolean;
	power: boolean;
	technique: boolean;
}

/**
 * Declared progression kinds only. This matrix mirrors spellcasting,
 * powersKnown, and techniquesKnown in regents.ts; it does not imply access to a
 * thematic Job list or grant catalog identities that the source never names.
 */
export const REGENT_GRANTS = {
	umbral_regent: { spell: true, power: false, technique: false },
	radiant_regent: { spell: true, power: false, technique: false },
	steel_regent: { spell: false, power: true, technique: true },
	destruction_regent: { spell: true, power: false, technique: false },
	war_regent: { spell: false, power: true, technique: true },
	frost_regent: { spell: true, power: false, technique: false },
	beast_regent: { spell: false, power: true, technique: true },
	plague_regent: { spell: true, power: false, technique: false },
	spatial_regent: { spell: true, power: false, technique: false },
	mimic_regent: { spell: false, power: true, technique: true },
	blood_regent: { spell: true, power: false, technique: false },
	gravity_regent: { spell: true, power: false, technique: false },
} as const satisfies Record<string, RegentGrantProfile>;

export type RegentGrantId = keyof typeof REGENT_GRANTS;

function normalizeRegentToken(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_")
		.replace(/_?regent$/, "_regent");
}

export function getRegentGrants(
	regentIdOrName: string | null | undefined,
): RegentGrantProfile | null {
	if (!regentIdOrName) return null;
	const normalized = normalizeRegentToken(regentIdOrName);
	return REGENT_GRANTS[normalized as RegentGrantId] ?? null;
}

export function regentGrantsAbility(
	regentIdOrName: string | null | undefined,
	kind: RegentGrantKind,
): boolean {
	return getRegentGrants(regentIdOrName)?.[kind] ?? false;
}
