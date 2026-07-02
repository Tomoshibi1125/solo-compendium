import { useQuery } from "@tanstack/react-query";
import type { AbilityScore } from "@/types/core-rules";

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

// Every job/background/skill/equipment value below must exist in the canonical
// compendium data — the wizard looks jobs and backgrounds up by exact name and
// equipment choices by exact option string per startingEquipment group, so a
// dangling reference silently no-ops. Guarded by characterTemplates.test.ts.
export const DEFAULT_TEMPLATES: CharacterTemplate[] = [
	{
		id: "warrior-basic",
		name: "Wandering Mercenary",
		description: "A tough front-line fighter who has seen many gate breaks.",
		job: "Destroyer",
		background: "Private Military Operator (PMC)",
		abilities: { STR: 15, AGI: 13, VIT: 14, INT: 10, SENSE: 12, PRE: 8 },
		skills: ["Athletics", "Intimidation"],
		equipment: { 0: "Chain Mail", 1: "Longsword", 4: "Explorer's Pack" },
	},
	{
		id: "rogue-basic",
		name: "Street Thief",
		description: "Agile and observant, relying on stealth and wit to survive.",
		job: "Assassin",
		background: "Awakened Delinquent",
		abilities: { STR: 8, AGI: 15, VIT: 12, INT: 13, SENSE: 14, PRE: 10 },
		skills: ["Stealth", "Sleight of Hand"],
		equipment: {
			0: "Shortsword",
			1: "Hand Crossbow and Crossbow Bolts (20)",
			2: "Burglar's Pack",
		},
	},
	{
		id: "mage-basic",
		name: "Apprentice Arcanist",
		description: "A scholar of the mana lattice, seeking lost knowledge.",
		job: "Mage",
		background: "Ascendant Academy Graduate",
		abilities: { STR: 8, AGI: 12, VIT: 10, INT: 15, SENSE: 13, PRE: 14 },
		skills: ["Mana Flow", "Dimensional Lore"],
		equipment: { 0: "Quarterstaff", 1: "Mana Crystal", 2: "Scholar's Pack" },
	},
];

export function useCharacterTemplates() {
	return useQuery({
		queryKey: ["character-templates"],
		queryFn: async () => {
			// In a full implementation, you'd fetch from Supabase
			// For now, return standard issue presets to speed up character creation
			return DEFAULT_TEMPLATES;
		},
		staleTime: Infinity,
	});
}
