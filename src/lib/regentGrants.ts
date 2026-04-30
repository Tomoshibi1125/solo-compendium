export type RegentGrantKind = "spell" | "power" | "technique";

export interface RegentGrantProfile {
	spell: boolean;
	power: boolean;
	technique: boolean;
}

export const REGENT_GRANTS = {
	umbral_regent: { spell: true, power: true, technique: false },
	radiant_regent: { spell: true, power: true, technique: false },
	steel_regent: { spell: false, power: true, technique: true },
	destruction_regent: { spell: true, power: true, technique: false },
	war_regent: { spell: false, power: true, technique: true },
	frost_regent: { spell: true, power: true, technique: false },
	beast_regent: { spell: false, power: true, technique: true },
	plague_regent: { spell: true, power: true, technique: false },
	spatial_regent: { spell: true, power: true, technique: false },
	mimic_regent: { spell: true, power: true, technique: true },
	blood_regent: { spell: true, power: true, technique: false },
	gravity_regent: { spell: true, power: true, technique: true },
} as const satisfies Record<string, RegentGrantProfile>;

export type RegentGrantId = keyof typeof REGENT_GRANTS;

export const REGENT_GRANT_IDS = Object.keys(REGENT_GRANTS) as RegentGrantId[];

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
