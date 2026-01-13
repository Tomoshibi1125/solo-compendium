// Character type definitions
export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  experience: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
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
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterCreateRequest {
  name: string;
  class: string;
  level: number;
  abilityScores: CharacterStats;
}
