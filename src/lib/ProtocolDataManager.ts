/**
 * PROTOCOL DATA MANAGER
 * Authoritative sync/async data bridge for compendium packs.
 * Resolves mixed-import build warnings by providing a single entry point.
 */

import type { StaticBackground, StaticJob } from "@/types/character";
import type {
	CompendiumAnomaly,
	CompendiumBackground,
	CompendiumCondition,
	CompendiumFeat,
	CompendiumItem,
	CompendiumJob,
	CompendiumLocation,
	CompendiumPath,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumSkill,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";
import * as loaders from "./dataLoaders";

interface DataRegistry {
	jobs: CompendiumJob[];
	items: CompendiumItem[];
	backgrounds: CompendiumBackground[];

	// SourceBook / Comprehensive data
	anomalies: CompendiumAnomaly[];
	spells: CompendiumSpell[];
	runes: CompendiumRune[];
	conditions: CompendiumCondition[];
	feats: CompendiumFeat[];
	locations: CompendiumLocation[];
	regents: CompendiumRegent[];
	relics: CompendiumRelic[];
	sigils: CompendiumRune[];
	skills: CompendiumSkill[];
	tattoos: CompendiumTattoo[];
	techniques: CompendiumTechnique[];
	backgroundsAll: CompendiumBackground[];
	itemsAll: CompendiumItem[];
	paths: CompendiumPath[];

	initialized: boolean;
}

const registry: DataRegistry = {
	jobs: [],
	items: [],
	backgrounds: [],
	anomalies: [],
	spells: [],
	runes: [],
	conditions: [],
	feats: [],
	locations: [],
	regents: [],
	relics: [],
	sigils: [],
	skills: [],
	tattoos: [],
	techniques: [],
	backgroundsAll: [],
	itemsAll: [],
	paths: [],
	initialized: false,
};

/**
 * Ensures all core data packs are loaded.
 * Call this during app initialization.
 */
export async function initializeProtocolData(): Promise<void> {
	if (registry.initialized) return;

	const [
		jobsRaw,
		itemsRaw,
		backgroundsRaw,
		anomaliesRow,
		spellsRow,
		runesRow,
		conditionsRow,
		featsRow,
		locationsRow,
		regentsRow,
		relicsRow,
		sigilsRow,
		skillsRow,
		tattoosRow,
		techniquesRow,
		backgroundsAllRow,
		itemsAllRow,
		pathsRow,
	] = await Promise.all([
		loaders.loadJobs(),
		loaders.loadItems(),
		loaders.loadBackgrounds(),
		loaders.loadAnomalies(),
		loaders.loadSpells(),
		loaders.loadRuneCompendium(),
		loaders.loadConditions(),
		loaders.loadFeats(),
		loaders.loadLocations(),
		loaders.loadRegents(),
		loaders.loadRelics(),
		loaders.loadSigils(),
		loaders.loadSkills(),
		loaders.loadTattoos(),
		loaders.loadTechniques(),
		loaders.loadBackgroundsAll(),
		loaders.loadItemsAll(),
		loaders.loadPaths(),
	]);

	registry.jobs = (jobsRaw as StaticJob[]).map((j): CompendiumJob => {
		const { abilities: rawAbilities, ...rest } = j;
		const structuredAbilities = (Array.isArray(rawAbilities)
			? rawAbilities.map((a) =>
					typeof a === "string" ? { name: a, description: a } : a,
				)
			: []) as unknown as CompendiumJob["abilities"];
		return {
			...rest,
			hit_dice: j.hit_dice || j.hitDie || "1d10",
			primary_abilities: j.primary_abilities?.map(String) || [],
			saving_throws: j.saving_throws || [],
			weaponProficiencies:
				j.weaponProficiencies || j.weapon_proficiencies || [],
			armorProficiencies: j.armorProficiencies || j.armor_proficiencies || [],
			toolProficiencies: j.toolProficiencies || j.tool_proficiencies || [],
			type: j.type || "Job",
			abilities: structuredAbilities,
		} as unknown as CompendiumJob;
	});

	registry.backgrounds = (backgroundsRaw as StaticBackground[]).map(
		(b): CompendiumBackground =>
			({
				...b,
				skill_proficiencies: b.skill_proficiencies || [],
				tool_proficiencies: b.tool_proficiencies || [],
				languages: b.languages || [],
				equipment: b.equipment || [],
				features: b.features || [],
				type: b.type || "Background",
			}) as unknown as CompendiumBackground,
	);

	registry.items = itemsRaw;
	registry.anomalies = anomaliesRow;
	registry.spells = spellsRow;
	registry.runes = runesRow;
	registry.conditions = conditionsRow;
	registry.feats = featsRow;
	registry.locations = locationsRow;
	registry.regents = regentsRow;
	registry.relics = relicsRow;
	registry.sigils = sigilsRow;
	registry.skills = skillsRow;
	registry.tattoos = tattoosRow;
	registry.techniques = techniquesRow;
	registry.backgroundsAll = backgroundsAllRow;
	registry.itemsAll = itemsAllRow;
	registry.paths = pathsRow;

	registry.initialized = true;
}

/**
 * Synchronous access to data.
 * WARNING: Throws if registry not initialized.
 */
export function getStaticJobs(): CompendiumJob[] {
	return registry.jobs;
}
export function getStaticItems(): CompendiumItem[] {
	return registry.items;
}
export function getStaticBackgrounds(): CompendiumBackground[] {
	return registry.backgrounds;
}
export function getStaticAnomalies(): CompendiumAnomaly[] {
	return registry.anomalies;
}
export function getStaticSpells(): CompendiumSpell[] {
	return registry.spells;
}
export function getStaticRunes(): CompendiumRune[] {
	return registry.runes;
}
export function getStaticConditions(): CompendiumCondition[] {
	return registry.conditions;
}
export function getStaticFeats(): CompendiumFeat[] {
	return registry.feats;
}
export function getStaticLocations(): CompendiumLocation[] {
	return registry.locations;
}
export function getStaticRegents(): CompendiumRegent[] {
	return registry.regents;
}
export function getStaticRelics(): CompendiumRelic[] {
	return registry.relics;
}
export function getStaticSigils(): CompendiumRune[] {
	return registry.sigils;
}
export function getStaticSkills(): CompendiumSkill[] {
	return registry.skills;
}
export function getStaticTattoos(): CompendiumTattoo[] {
	return registry.tattoos;
}
export function getStaticTechniques(): CompendiumTechnique[] {
	return registry.techniques;
}
export function getStaticPaths(): CompendiumPath[] {
	return registry.paths;
}
export function getStaticBackgroundsAll(): CompendiumBackground[] {
	return registry.backgroundsAll;
}
export function getStaticItemsAll(): CompendiumItem[] {
	return registry.itemsAll;
}

export function isProtocolDataReady(): boolean {
	return registry.initialized;
}
