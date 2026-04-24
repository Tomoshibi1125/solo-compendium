export type DamageApplicationMode = "typed" | "raw";

export interface DamageMitigationProfile {
	resistances?: string[] | null;
	immunities?: string[] | null;
	vulnerabilities?: string[] | null;
}

export interface DamageApplicationInput {
	rawDamage: number;
	damageType?: string | null;
	mitigation?: DamageMitigationProfile | null;
	mode?: DamageApplicationMode;
}

export interface DamageApplicationResult {
	rawDamage: number;
	finalDamage: number;
	damageType: string | null;
	appliedMode: DamageApplicationMode;
	resistanceApplied: boolean;
	immunityApplied: boolean;
	vulnerabilityApplied: boolean;
	summary: string;
}

export function normalizeDamageType(
	value: string | null | undefined,
): string | null {
	if (!value) return null;
	const normalized = value
		.toLowerCase()
		.trim()
		.replace(/\s+damage$/, "");
	return normalized.length > 0 ? normalized : null;
}

const hasDamageTag = (
	entries: string[] | null | undefined,
	damageType: string | null,
): boolean => {
	if (!damageType || !Array.isArray(entries)) return false;
	return entries.some((entry) => normalizeDamageType(entry) === damageType);
};

export function applyDamageMitigation({
	rawDamage,
	damageType,
	mitigation,
	mode = "typed",
}: DamageApplicationInput): DamageApplicationResult {
	const normalizedRawDamage = Math.max(0, Math.floor(rawDamage));
	const normalizedDamageType = normalizeDamageType(damageType);

	if (mode === "raw" || !normalizedDamageType || !mitigation) {
		return {
			rawDamage: normalizedRawDamage,
			finalDamage: normalizedRawDamage,
			damageType: normalizedDamageType,
			appliedMode: mode,
			resistanceApplied: false,
			immunityApplied: false,
			vulnerabilityApplied: false,
			summary:
				mode === "raw"
					? "Raw damage applied without mitigation."
					: normalizedDamageType
						? `No mitigation applied for ${normalizedDamageType} damage.`
						: "Untyped damage applied without mitigation.",
		};
	}

	const immunityApplied = hasDamageTag(
		mitigation.immunities,
		normalizedDamageType,
	);
	const resistanceApplied = hasDamageTag(
		mitigation.resistances,
		normalizedDamageType,
	);
	const vulnerabilityApplied = hasDamageTag(
		mitigation.vulnerabilities,
		normalizedDamageType,
	);

	let finalDamage = normalizedRawDamage;
	let summary = `No mitigation applied for ${normalizedDamageType} damage.`;

	if (immunityApplied) {
		finalDamage = 0;
		summary = `${normalizedDamageType} immunity reduced damage to 0.`;
	} else if (resistanceApplied && vulnerabilityApplied) {
		summary = `${normalizedDamageType} resistance and vulnerability canceled out.`;
	} else if (resistanceApplied) {
		finalDamage = Math.floor(normalizedRawDamage / 2);
		summary = `${normalizedDamageType} resistance halved the damage.`;
	} else if (vulnerabilityApplied) {
		finalDamage = normalizedRawDamage * 2;
		summary = `${normalizedDamageType} vulnerability doubled the damage.`;
	}

	return {
		rawDamage: normalizedRawDamage,
		finalDamage,
		damageType: normalizedDamageType,
		appliedMode: mode,
		resistanceApplied,
		immunityApplied,
		vulnerabilityApplied,
		summary,
	};
}
