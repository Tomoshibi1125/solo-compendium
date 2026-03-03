// Character type definitions
export interface Character {
	id: string;
	name: string;
	class: string;
	job?: string;
	path?: string;
	level: number;
	experience: number;
	abilities?: {
		STR: number;
		AGI: number;
		VIT: number;
		INT: number;
		SENSE: number;
		PRE: number;
	};
	abilityScores: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	hitPoints: number;
	armorClass: number;
	skills: string[];
	equipment: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CharacterStats {
	strength: number;
	agility: number;
	vitality: number;
	intelligence: number;
	sense: number;
	presence: number;
}

export interface CharacterCreateRequest {
	name: string;
	class: string;
	level: number;
	abilityScores: CharacterStats;
}
