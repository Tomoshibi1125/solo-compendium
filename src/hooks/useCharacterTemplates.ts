import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { type AbilityScore } from '@/types/system-rules';

export interface CharacterTemplate {
    id: string;
    name: string;
    description: string;
    job: string;
    path?: string;
    background: string;
    abilities: Record<AbilityScore, number>;
    skills: string[];
    equipment: Record<number, string>;
    flavor?: string;
}

const DEFAULT_TEMPLATES: CharacterTemplate[] = [
    {
        id: 'warrior-basic',
        name: 'Wandering Mercenary',
        description: 'A tough front-line fighter who has seen many battles.',
        job: 'Warrior',
        background: 'Mercenary',
        abilities: { STR: 15, AGI: 13, VIT: 14, INT: 10, SENSE: 12, PRE: 8 },
        skills: ['Athletics', 'Intimidation'],
        equipment: { 0: 'Longsword', 1: 'Chain Mail', 2: 'Adventuring Gear' },
    },
    {
        id: 'rogue-basic',
        name: 'Street Thief',
        description: 'Agile and observant, relying on stealth and wit to survive.',
        job: 'Rogue',
        background: 'Urchin',
        abilities: { STR: 8, AGI: 15, VIT: 12, INT: 13, SENSE: 14, PRE: 10 },
        skills: ['Stealth', 'Sleight of Hand'],
        equipment: { 0: 'Daggers (x2)', 1: 'Leather Armor', 2: 'Thieves Tools' },
    },
    {
        id: 'mage-basic',
        name: 'Apprentice Arcanist',
        description: 'A scholar of the arcane arts, seeking lost knowledge.',
        job: 'Mage',
        background: 'Scholar',
        abilities: { STR: 8, AGI: 12, VIT: 10, INT: 15, SENSE: 13, PRE: 14 },
        skills: ['Arcana', 'History'],
        equipment: { 0: 'Quarterstaff', 1: 'Arcane Focus', 2: 'Scholar Pack' },
    }
];

export function useCharacterTemplates() {
    return useQuery({
        queryKey: ['character-templates'],
        queryFn: async () => {
            // In a full implementation, you'd fetch from Supabase
            // For now, return standard issue presets to speed up character creation
            return DEFAULT_TEMPLATES;
        },
        staleTime: Infinity,
    });
}
