/**
 * Versioned JSON schema for character import/export.
 * Used to validate imported character files and ensure compatibility.
 */

export const CURRENT_SCHEMA_VERSION = "1.0";

export interface CharacterExportSchema {
	$schema: string;
	name: string;
	level: number;
	job: string | null;
	path: string | null;
	background: string | null;
	abilities: Record<string, number>;
	stats: {
		hp: { current: number; max: number; temp: number };
		hitDice: { current: number; max: number; size: number };
		systemFavor: { current: number; max: number; die: number };
		armorClass: number;
		speed: number;
		initiative: number;
		proficiencyBonus: number;
	};
	proficiencies?: {
		armor?: string[];
		weapons?: string[];
		tools?: string[];
		skills?: string[];
		savingThrows?: string[];
	};
	equipment?: Array<{
		name: string;
		item_type: string;
		description?: string | null;
		quantity?: number;
		is_equipped?: boolean;
		is_attuned?: boolean;
	}>;
	powers?: Array<{
		name: string;
		power_level: number;
		source?: string;
		description?: string | null;
		is_prepared?: boolean;
		is_known?: boolean;
	}>;
	features?: Array<{
		name: string;
		source?: string;
		description?: string | null;
	}>;
	conditions?: string[];
	exhaustionLevel?: number;
	experience?: number;
	notes?: string | null;
	appearance?: string | null;
	backstory?: string | null;
}

export interface CharacterImportValidation {
	valid: boolean;
	errors: string[];
	data: CharacterExportSchema | null;
}

export function validateCharacterImport(json: unknown): CharacterImportValidation {
	const errors: string[] = [];

	if (typeof json !== "object" || json === null) {
		return {
			valid: false,
			errors: ["Invalid JSON: expected an object"],
			data: null,
		};
	}

	const obj = json as Record<string, unknown>;

	// Required fields
	if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
		errors.push('Missing or invalid "name" field');
	}
	if (typeof obj.level !== "number" || obj.level < 1 || obj.level > 20) {
		errors.push('Missing or invalid "level" field (must be 1-20)');
	}

	// Abilities validation
	if (typeof obj.abilities !== "object" || obj.abilities === null) {
		errors.push('Missing "abilities" object');
	} else {
		const abilities = obj.abilities as Record<string, unknown>;
		const requiredAbilities = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"];
		for (const ability of requiredAbilities) {
			if (typeof abilities[ability] !== "number") {
				errors.push(`Missing ability score: ${ability}`);
			}
		}
	}

	// Stats validation (optional but structured)
	if (obj.stats !== undefined) {
		if (typeof obj.stats !== "object" || obj.stats === null) {
			errors.push('"stats" must be an object');
		}
	}

	if (errors.length > 0) {
		return { valid: false, errors, data: null };
	}

	// Coerce to schema with defaults
	const data: CharacterExportSchema = {
		$schema: (obj.$schema as string) || CURRENT_SCHEMA_VERSION,
		name: (obj.name as string).trim(),
		level: obj.level as number,
		job: (obj.job as string | null) ?? null,
		path: (obj.path as string | null) ?? null,
		background: (obj.background as string | null) ?? null,
		abilities: obj.abilities as Record<string, number>,
		stats: obj.stats
			? (obj.stats as CharacterExportSchema["stats"])
			: {
					hp: { current: 10, max: 10, temp: 0 },
					hitDice: { current: 1, max: 1, size: 8 },
					systemFavor: { current: 1, max: 1, die: 6 },
					armorClass: 10,
					speed: 30,
					initiative: 0,
					proficiencyBonus: 2,
				},
		proficiencies:
			(obj.proficiencies as CharacterExportSchema["proficiencies"]) ??
			undefined,
		equipment: Array.isArray(obj.equipment)
			? (obj.equipment as CharacterExportSchema["equipment"])
			: undefined,
		powers: Array.isArray(obj.powers)
			? (obj.powers as CharacterExportSchema["powers"])
			: undefined,
		features: Array.isArray(obj.features)
			? (obj.features as CharacterExportSchema["features"])
			: undefined,
		conditions: Array.isArray(obj.conditions)
			? (obj.conditions as string[])
			: [],
		exhaustionLevel:
			typeof obj.exhaustionLevel === "number" ? obj.exhaustionLevel : 0,
		experience: typeof obj.experience === "number" ? obj.experience : 0,
		notes: (obj.notes as string | null) ?? null,
		appearance: (obj.appearance as string | null) ?? null,
		backstory: (obj.backstory as string | null) ?? null,
	};

	return { valid: true, errors: [], data };
}
