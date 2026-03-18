import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

type _Character = Database["public"]["Tables"]["characters"]["Row"];
type _CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];

interface _ExportImportOptions {
	format: "json" | "pdf";
	includeHistory?: boolean;
	includeNotes?: boolean;
}

export function useCharacterExport() {
	const { toast } = useToast();

	const { user } = useAuth();

	const exportCharacterJson = useCallback(
		async (characterId: string) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				// Fetch complete character data
				const { data: character, error: charError } = await supabase
					.from("characters")
					.select("*")
					.eq("id", characterId)
					.single();

				if (charError || !character) {
					throw new Error("Character not found");
				}

				// Fetch related data
				const [abilitiesResult, equipmentResult, featuresResult] =
					await Promise.all([
						supabase
							.from("character_abilities")
							.select("*")
							.eq("character_id", characterId),
						supabase
							.from("character_equipment")
							.select("*")
							.eq("character_id", characterId),
						supabase
							.from("character_features")
							.select("*")
							.eq("character_id", characterId),
					]);

				const exportData = {
					character: character as Record<string, unknown>, // Type cast to handle field differences
					abilities: abilitiesResult.data || [],
					equipment: equipmentResult.data || [],
					features: featuresResult.data || [],
					spells: [], // Skip spells for now
					exported_at: new Date().toISOString(),
					exported_by: user?.id || "anonymous",
					version: "1.0",
				};

				// Download JSON file
				const blob = new Blob([JSON.stringify(exportData, null, 2)], {
					type: "application/json",
				});

				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${character.name || "character"}-${new Date().toISOString().split("T")[0]}.json`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				toast({
					title: "Export Successful",
					description: `${character.name || "Character"} exported as JSON`,
				});

				return exportData;
			} catch (error) {
				toast({
					title: "Export Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	const exportCharacterPdf = useCallback(
		async (characterId: string) => {
			try {
				// For PDF export, we'll create a formatted text representation
				// In a production environment, you'd use a proper PDF library
				const jsonData = await exportCharacterJson(characterId);
				if (!jsonData) return null;

				const { character } = jsonData;
				const char = character as Record<string, unknown>; // Type cast to access fields

				// Create formatted text content
				const content = `
CHARACTER SHEET
================
Name: ${char.name || "Unknown"}
Level: ${char.level || 1}
Job: ${char.job || "Unknown"}
Path: ${char.path || "None"}

ABILITY SCORES
==============
Strength: ${Number(char.strength) || 10} (${Math.floor(((Number(char.strength) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.strength) || 10) - 10) / 2)})
Dexterity: ${Number(char.dexterity) || 10} (${Math.floor(((Number(char.dexterity) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.dexterity) || 10) - 10) / 2)})
Constitution: ${Number(char.constitution) || 10} (${Math.floor(((Number(char.constitution) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.constitution) || 10) - 10) / 2)})
Intelligence: ${Number(char.intelligence) || 10} (${Math.floor(((Number(char.intelligence) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.intelligence) || 10) - 10) / 2)})
Wisdom: ${Number(char.wisdom) || 10} (${Math.floor(((Number(char.wisdom) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.wisdom) || 10) - 10) / 2)})
Charisma: ${Number(char.charisma) || 10} (${Math.floor(((Number(char.charisma) || 10) - 10) / 2) >= 0 ? "+" : ""}${Math.floor(((Number(char.charisma) || 10) - 10) / 2)})

COMBAT STATS
============
HP: ${char.hp_current || char.hp_max}/${char.hp_max}
AC: ${char.armor_class || 10}
Initiative: ${char.initiative || 0}
Speed: ${char.speed || 30}

SAVING THROWS
=============
STR: ${(char.saving_throw_proficiencies as string[])?.includes("strength") ? "Proficient" : "Not proficient"}
DEX: ${(char.saving_throw_proficiencies as string[])?.includes("dexterity") ? "Proficient" : "Not proficient"}
CON: ${(char.saving_throw_proficiencies as string[])?.includes("constitution") ? "Proficient" : "Not proficient"}
INT: ${(char.saving_throw_proficiencies as string[])?.includes("intelligence") ? "Proficient" : "Not proficient"}
WIS: ${(char.saving_throw_proficiencies as string[])?.includes("wisdom") ? "Proficient" : "Not proficient"}
CHA: ${(char.saving_throw_proficiencies as string[])?.includes("charisma") ? "Proficient" : "Not proficient"}

Generated: ${new Date().toLocaleDateString()}
      `.trim();

				// Create blob and download
				const blob = new Blob([content], { type: "text/plain" });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${char.name || "character"}-character-sheet.txt`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				toast({
					title: "Export Successful",
					description: `${char.name || "Character"} exported as character sheet`,
				});

				return true;
			} catch (error) {
				toast({
					title: "Export Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[toast, exportCharacterJson],
	);

	const importCharacterJson = useCallback(
		async (file: File) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				if (!user) {
					throw new Error("Must be logged in to import characters");
				}

				const text = await file.text();
				const data = JSON.parse(text);

				// Validate structure
				if (!data.character || !data.character.name) {
					throw new Error("Invalid character file format");
				}

				// Create new character from import
				const { character: charData } = data;
				const newCharacter: Record<string, unknown> = {
					user_id: user.id,
					name: `${charData.name} (Imported)`,
					level: charData.level || 1,
					job: charData.job,
					path: charData.path,
					strength: charData.strength || 10,
					dexterity: charData.dexterity || 10,
					constitution: charData.constitution || 10,
					intelligence: charData.intelligence || 10,
					wisdom: charData.wisdom || 10,
					charisma: charData.charisma || 10,
					hp_max: charData.max_hp || 10,
					hp_current: charData.current_hp || charData.max_hp || 10,
					armor_class: charData.armor_class || 10,
					speed: charData.speed || 30,
					initiative: charData.initiative || 0,
				};

				const { data: createdCharacter, error: createError } = await supabase
					.from("characters")
					.insert(
						newCharacter as Database["public"]["Tables"]["characters"]["Insert"],
					)
					.select()
					.single();

				if (createError || !createdCharacter) {
					throw new Error("Failed to create character");
				}

				// Import related data if present
				if (data.abilities && data.abilities.length > 0) {
					const abilities = data.abilities.map(
						(ability: Record<string, unknown>) => ({
							...ability,
							character_id: createdCharacter.id,
							id: undefined, // Let DB generate new ID
						}),
					) as Database["public"]["Tables"]["character_abilities"]["Insert"][];
					await supabase
						.from("character_abilities")
						.insert(abilities)
						.throwOnError();
				}

				if (data.equipment && data.equipment.length > 0) {
					const equipment = data.equipment.map(
						(item: Record<string, unknown>) => ({
							...item,
							character_id: createdCharacter.id,
							id: undefined,
						}),
					) as Database["public"]["Tables"]["character_equipment"]["Insert"][];
					await supabase
						.from("character_equipment")
						.insert(equipment)
						.throwOnError();
				}

				if (data.features && data.features.length > 0) {
					const features = data.features.map(
						(feature: Record<string, unknown>) => ({
							...feature,
							character_id: createdCharacter.id,
							id: undefined,
						}),
					) as Database["public"]["Tables"]["character_features"]["Insert"][];
					await supabase
						.from("character_features")
						.insert(features)
						.throwOnError();
				}

				// Skip spells import for now as table structure may differ
				// if (data.spells && data.spells.length > 0) {
				//   const spells = data.spells.map((spell: Record<string, unknown>) => ({
				//     ...spell,
				//     character_id: createdCharacter.id,
				//     id: undefined
				//   }));
				//   await supabase.from('character_spells').insert(spells);
				// }

				toast({
					title: "Import Successful",
					description: `${charData.name} has been imported successfully`,
				});

				return createdCharacter;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	return {
		exportCharacterJson,
		exportCharacterPdf,
		importCharacterJson,
	};
}

export function useCharacterImport() {
	const { toast } = useToast();
	const { user } = useAuth();

	const importCharacterJson = useCallback(
		async (file: File) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				if (!user) {
					throw new Error("Must be logged in to import characters");
				}

				const text = await file.text();
				const data = JSON.parse(text);

				// Validate structure
				if (!data.character || !data.character.name) {
					throw new Error("Invalid character file format");
				}

				// Create new character from import
				const { character: charData } = data;
				const newCharacter: Record<string, unknown> = {
					user_id: user.id,
					name: `${charData.name} (Imported)`,
					level: charData.level || 1,
					job: charData.job,
					path: charData.path,
					strength: charData.strength || 10,
					dexterity: charData.dexterity || 10,
					constitution: charData.constitution || 10,
					intelligence: charData.intelligence || 10,
					wisdom: charData.wisdom || 10,
					charisma: charData.charisma || 10,
					hp_max: charData.max_hp || 10,
					hp_current: charData.current_hp || charData.max_hp || 10,
					armor_class: charData.armor_class || 10,
					speed: charData.speed || 30,
					initiative: charData.initiative || 0,
				};

				const { data: createdCharacter, error: createError } = await supabase
					.from("characters")
					.insert(
						newCharacter as Database["public"]["Tables"]["characters"]["Insert"],
					)
					.select()
					.single();

				if (createError || !createdCharacter) {
					throw new Error("Failed to create character");
				}

				// Import related data if present
				if (data.abilities && data.abilities.length > 0) {
					const abilities = data.abilities.map(
						(ability: Record<string, unknown>) => ({
							...ability,
							character_id: createdCharacter.id,
							id: undefined, // Let DB generate new ID
						}),
					) as Database["public"]["Tables"]["character_abilities"]["Insert"][];
					await supabase
						.from("character_abilities")
						.insert(abilities)
						.throwOnError();
				}

				if (data.equipment && data.equipment.length > 0) {
					const equipment = data.equipment.map(
						(item: Record<string, unknown>) => ({
							...item,
							character_id: createdCharacter.id,
							id: undefined,
						}),
					) as Database["public"]["Tables"]["character_equipment"]["Insert"][];
					await supabase
						.from("character_equipment")
						.insert(equipment)
						.throwOnError();
				}

				if (data.features && data.features.length > 0) {
					const features = data.features.map(
						(feature: Record<string, unknown>) => ({
							...feature,
							character_id: createdCharacter.id,
							id: undefined,
						}),
					) as Database["public"]["Tables"]["character_features"]["Insert"][];
					await supabase
						.from("character_features")
						.insert(features)
						.throwOnError();
				}

				// Skip spells import for now as table structure may differ
				// if (data.spells && data.spells.length > 0) {
				//   const spells = data.spells.map((spell: Record<string, unknown>) => ({
				//     ...spell,
				//     character_id: createdCharacter.id,
				//     id: undefined
				//   }));
				//   await supabase.from('character_spells').insert(spells);
				// }

				toast({
					title: "Import Successful",
					description: `${charData.name} has been imported successfully`,
				});

				return createdCharacter;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	return {
		importCharacterJson,
	};
}
