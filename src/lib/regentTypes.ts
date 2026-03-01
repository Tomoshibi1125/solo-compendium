export enum RegentType {
    STRENGTH_REGENT = 'Strength Regent',
    AGILITY_REGENT = 'Agility Regent',
    VITALITY_REGENT = 'Vitality Regent',
    INTELLIGENCE_REGENT = 'Intelligence Regent',
    SENSE_REGENT = 'Sense Regent',
    PRESENCE_REGENT = 'Presence Regent'
}

export interface Feature {
    name: string;
    description: string;
    type: string;
}

export interface StructuredSpell {
    name: string;
    description: string;
    level: number;
    school: string;
}

export type Spell = string | StructuredSpell;

export interface Trait {
    name: string;
    description: string;
    type: string;
    benefits: string[];
}

export interface RegentPath {
    id: string;
    name: string;
    type: RegentType;
    description: string;
    abilities: string[];
    features: Feature[];
    spells: Spell[];
    /** Monarch compendium entry ID in monarchs.ts */
    compendiumId?: string;
    requirements: {
        /** @deprecated Regents are quest/DM-gated — level is advisory only */
        level?: number;
        questCompleted?: string;
        statThreshold: number;
    };
}
