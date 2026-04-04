// Gemini Protocol - Unified Sovereign Fusion Generator
// System Ascendant Post-Reset Timeline - The Absolute Setting
// Unified Fusion System - Single comprehensive fusion approach

import type { Tables } from "@/integrations/supabase/types";
import { aiService } from "@/lib/ai/aiService";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

export type Job = Tables<"compendium_jobs">;
export type Path = Tables<"compendium_job_paths">;
export type Regent = Tables<"compendium_regents">;

export interface FusionAbility {
	name: string;
	description: string;
	level: number;
	action_type: string | null;
	recharge: string | null;
	is_capstone: boolean;
	origin_sources: string[];
	fusion_type: string;
}

export interface GeneratedSovereign {
	name: string;
	title: string;
	description: string;
	fusion_theme: string;
	fusion_description: string;
	fusion_method: string;
	abilities: FusionAbility[];
	job: Job;
	path: Path;
	regentA: Regent;
	regentB: Regent;
	power_multiplier: string;
	fusion_stability: string;
}

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripRegentTerm = (value: string): string => {
	const label = escapeRegExp(REGENT_LABEL);
	const pattern = new RegExp(`\\s*(?:Regent|${label})\\s*`, "gi");
	return value
		.replace(pattern, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
};

// Unified Fusion Name Generator - Single comprehensive approach
const generateUnifiedFusionName = (a: string, b: string): string => {
	// Unified fusion: Balanced blend of both names with power suffix
	const midA = Math.ceil(a.length / 2);
	const midB = Math.floor(b.length / 2);
	return `${a.slice(0, midA)}${b.slice(midB)}`;
};

// Generate fusion name based on unified approach
export function generateFusionName(regentA: Regent, regentB: Regent): string {
	const nameA = stripRegentTerm(regentA.name);
	const nameB = stripRegentTerm(regentB.name);

	return generateUnifiedFusionName(nameA, nameB);
}

// Fusion Theme Lattice with Dual Class-style power combinations
const themeLattice: Record<
	string,
	Record<string, { theme: string; element: string; concept: string }>
> = {
	Shadow: {
		Frost: {
			theme: "Frozen Shadow",
			element: "umbral-ice",
			concept: "absolute darkness that freezes souls",
		},
		Plague: {
			theme: "Necrotic Void",
			element: "death-miasma",
			concept: "shadow that corrupts and consumes",
		},
		Stone: {
			theme: "Obsidian Titan",
			element: "void-stone",
			concept: "unyielding darkness made manifest",
		},
		Beast: {
			theme: "Shadow Pack Alpha",
			element: "predator-shade",
			concept: "apex ascendants of eternal night",
		},
		Iron: {
			theme: "Darksteel Legion",
			element: "shadow-metal",
			concept: "army of shadow-forged warriors",
		},
		Destruction: {
			theme: "Annihilating Void",
			element: "entropy-shadow",
			concept: "darkness that erases existence",
		},
		"White Flames": {
			theme: "Eclipse Flame",
			element: "black-fire",
			concept: "shadow flames that burn souls",
		},
		Transfiguration: {
			theme: "Phantom Shifter",
			element: "form-void",
			concept: "shadows that take any form",
		},
		Shadow: {
			theme: "Absolute Shadow",
			element: "true-void",
			concept: "perfected mastery of darkness",
		},
	},
	Frost: {
		Shadow: {
			theme: "Frozen Shadow",
			element: "ice-void",
			concept: "cold that darkens the soul",
		},
		Plague: {
			theme: "Cryogenic Plague",
			element: "frost-rot",
			concept: "frozen corruption that spreads",
		},
		Stone: {
			theme: "Glacial Colossus",
			element: "perma-frost",
			concept: "eternal ice mountains",
		},
		Beast: {
			theme: "Arctic Apex",
			element: "frost-fang",
			concept: "ascendants of frozen wastes",
		},
		Iron: {
			theme: "Cryosteel",
			element: "frost-metal",
			concept: "frozen metal that never thaws",
		},
		Destruction: {
			theme: "Absolute Zero",
			element: "entropy-cold",
			concept: "cold that ends all motion",
		},
		"White Flames": {
			theme: "Frostfire Paradox",
			element: "ice-flame",
			concept: "flames that freeze and ice that burns",
		},
		Transfiguration: {
			theme: "Crystal Shifter",
			element: "ice-form",
			concept: "ever-changing frozen forms",
		},
		Frost: {
			theme: "Absolute Frost",
			element: "true-cold",
			concept: "perfected mastery of cold",
		},
	},
	Plague: {
		Shadow: {
			theme: "Necrotic Void",
			element: "death-shadow",
			concept: "plague that corrupts from darkness",
		},
		Frost: {
			theme: "Cryogenic Plague",
			element: "rot-frost",
			concept: "frozen corruption",
		},
		Stone: {
			theme: "Petrifying Blight",
			element: "plague-stone",
			concept: "disease that turns to stone",
		},
		Beast: {
			theme: "Pandemic Swarm",
			element: "plague-beast",
			concept: "infected anomaly swarm",
		},
		Iron: {
			theme: "Corroding Arsenal",
			element: "rust-plague",
			concept: "weapons of decay",
		},
		Destruction: {
			theme: "Extinction Plague",
			element: "end-rot",
			concept: "disease that ends species",
		},
		"White Flames": {
			theme: "Burning Pestilence",
			element: "plague-fire",
			concept: "flames of infectious destruction",
		},
		Transfiguration: {
			theme: "Mutagenic Horror",
			element: "mutation",
			concept: "ever-evolving plague",
		},
		Plague: {
			theme: "Absolute Plague",
			element: "true-rot",
			concept: "perfected mastery of disease",
		},
	},
	Stone: {
		Shadow: {
			theme: "Obsidian Titan",
			element: "void-stone",
			concept: "darkness made solid",
		},
		Frost: {
			theme: "Glacial Colossus",
			element: "frost-stone",
			concept: "frozen mountain given life",
		},
		Plague: {
			theme: "Petrifying Blight",
			element: "stone-plague",
			concept: "corruption that petrifies",
		},
		Beast: {
			theme: "Primordial Behemoth",
			element: "beast-stone",
			concept: "ancient stone creature",
		},
		Iron: {
			theme: "Adamantine",
			element: "metal-stone",
			concept: "unbreakable fusion of earth and steel",
		},
		Destruction: {
			theme: "Seismic Annihilator",
			element: "quake-doom",
			concept: "earthquakes that end civilizations",
		},
		"White Flames": {
			theme: "Magma Titan",
			element: "lava-stone",
			concept: "molten core of destruction",
		},
		Transfiguration: {
			theme: "Living Monolith",
			element: "shift-stone",
			concept: "stone that reshapes at will",
		},
		Stone: {
			theme: "Absolute Stone",
			element: "true-earth",
			concept: "perfected mastery of earth",
		},
	},
	Beast: {
		Shadow: {
			theme: "Shadow Pack Alpha",
			element: "void-beast",
			concept: "shadow creatures as extensions",
		},
		Frost: {
			theme: "Arctic Apex",
			element: "frost-beast",
			concept: "frost wolves and ice bears",
		},
		Plague: {
			theme: "Pandemic Swarm",
			element: "plague-beast",
			concept: "infected anomaly swarm",
		},
		Stone: {
			theme: "Primordial Behemoth",
			element: "stone-beast",
			concept: "ancient titanic creatures",
		},
		Iron: {
			theme: "Mechanized Pack",
			element: "steel-beast",
			concept: "metal-enhanced creatures",
		},
		Destruction: {
			theme: "Apex Extinction",
			element: "doom-beast",
			concept: "ultimate predators",
		},
		"White Flames": {
			theme: "Phoenix Chimera",
			element: "fire-beast",
			concept: "flame-born anomalies",
		},
		Transfiguration: {
			theme: "Shapeshifter Alpha",
			element: "morph-beast",
			concept: "beasts that become anything",
		},
		Beast: {
			theme: "Absolute Beast",
			element: "true-beast",
			concept: "perfected mastery of creatures",
		},
	},
	Iron: {
		Shadow: {
			theme: "Darksteel Legion",
			element: "shadow-metal",
			concept: "shadow-forged warriors",
		},
		Frost: {
			theme: "Cryosteel",
			element: "frost-metal",
			concept: "frozen indestructible metal",
		},
		Plague: {
			theme: "Corroding Arsenal",
			element: "rust-metal",
			concept: "weapons of decay",
		},
		Stone: {
			theme: "Adamantine",
			element: "stone-metal",
			concept: "ultimate durability",
		},
		Beast: {
			theme: "Mechanized Pack",
			element: "beast-metal",
			concept: "cybernetic beasts",
		},
		Destruction: {
			theme: "Annihilator Protocol",
			element: "doom-metal",
			concept: "weapons of mass destruction",
		},
		"White Flames": {
			theme: "Molten Arsenal",
			element: "fire-metal",
			concept: "superheated weapons",
		},
		Transfiguration: {
			theme: "Morphic Alloy",
			element: "shift-metal",
			concept: "liquid metal transformation",
		},
		Iron: {
			theme: "Absolute Iron",
			element: "true-metal",
			concept: "perfected mastery of metal",
		},
	},
	Destruction: {
		Shadow: {
			theme: "Annihilating Void",
			element: "void-doom",
			concept: "darkness that unmakes",
		},
		Frost: {
			theme: "Absolute Zero",
			element: "cold-doom",
			concept: "end of all heat",
		},
		Plague: {
			theme: "Extinction Plague",
			element: "plague-doom",
			concept: "disease that ends existence",
		},
		Stone: {
			theme: "Seismic Annihilator",
			element: "earth-doom",
			concept: "world-breaking force",
		},
		Beast: {
			theme: "Apex Extinction",
			element: "beast-doom",
			concept: "ultimate predatory force",
		},
		Iron: {
			theme: "Annihilator Protocol",
			element: "metal-doom",
			concept: "arsenal of armageddon",
		},
		"White Flames": {
			theme: "Apocalypse Flame",
			element: "fire-doom",
			concept: "flames that end worlds",
		},
		Transfiguration: {
			theme: "Reality Eraser",
			element: "shift-doom",
			concept: "changing reality to nothing",
		},
		Destruction: {
			theme: "Absolute Destruction",
			element: "true-doom",
			concept: "perfected mastery of ending",
		},
	},
	"White Flames": {
		Shadow: {
			theme: "Eclipse Flame",
			element: "shadow-fire",
			concept: "black flames of the void",
		},
		Frost: {
			theme: "Frostfire Paradox",
			element: "frost-fire",
			concept: "impossible union of opposites",
		},
		Plague: {
			theme: "Burning Pestilence",
			element: "plague-fire",
			concept: "infectious burning",
		},
		Stone: {
			theme: "Magma Titan",
			element: "stone-fire",
			concept: "volcanic destruction",
		},
		Beast: {
			theme: "Phoenix Chimera",
			element: "beast-fire",
			concept: "flame-born creatures",
		},
		Iron: {
			theme: "Molten Arsenal",
			element: "metal-fire",
			concept: "superheated weapons",
		},
		Destruction: {
			theme: "Apocalypse Flame",
			element: "doom-fire",
			concept: "world-ending conflagration",
		},
		Transfiguration: {
			theme: "Living Inferno",
			element: "shift-fire",
			concept: "flames that take any form",
		},
		"White Flames": {
			theme: "Absolute Flame",
			element: "true-fire",
			concept: "perfected mastery of fire",
		},
	},
	Transfiguration: {
		Shadow: {
			theme: "Phantom Shifter",
			element: "shadow-morph",
			concept: "formless shadow",
		},
		Frost: {
			theme: "Crystal Shifter",
			element: "frost-morph",
			concept: "ice in any shape",
		},
		Plague: {
			theme: "Mutagenic Horror",
			element: "plague-morph",
			concept: "ever-evolving form",
		},
		Stone: {
			theme: "Living Monolith",
			element: "stone-morph",
			concept: "stone that lives",
		},
		Beast: {
			theme: "Shapeshifter Alpha",
			element: "beast-morph",
			concept: "any creature form",
		},
		Iron: {
			theme: "Morphic Alloy",
			element: "metal-morph",
			concept: "liquid metal form",
		},
		Destruction: {
			theme: "Reality Eraser",
			element: "doom-morph",
			concept: "shifting into nothing",
		},
		"White Flames": {
			theme: "Living Inferno",
			element: "fire-morph",
			concept: "flames given form",
		},
		Transfiguration: {
			theme: "Absolute Form",
			element: "true-morph",
			concept: "perfected mastery of change",
		},
	},
};

export function getFusionTheme(
	regentA: Regent,
	regentB: Regent,
): { theme: string; element: string; concept: string } {
	const themeA = regentA.theme;
	const themeB = regentB.theme;

	const result =
		themeLattice[themeA]?.[themeB] || themeLattice[themeB]?.[themeA];
	if (result) return result;

	return {
		theme: `${themeA}-${themeB} Convergence`,
		element: `${themeA.toLowerCase()}-${themeB.toLowerCase()}`,
		concept: `fusion of ${themeA} and ${themeB} domains`,
	};
}

// Unified Power Multiplier - Single comprehensive approach
export function getPowerMultiplier(): string {
	return "Base Power x Thousands (Unified Fusion - Permanent, Sovereign-Stabilized)";
}

// Unified ability templates with comprehensive fusion mechanics
export type AbilityTemplate = {
	name: string;
	desc: string;
	action: string;
	recharge?: string;
	isCapstone?: boolean;
};

// Unified ability templates with comprehensive fusion mechanics
const abilityTemplates: Record<string, AbilityTemplate> = {
	// LEVEL 1: Fusion Awakening - First taste of combined power
	fusionAwakening: {
		name: "{fusionName} Strike",
		desc: "[UNIFIED FUSION TECHNIQUE] Channel the merged essence of {regentA} and {regentB}. Your attacks manifest as {element} energy, dealing [{damageA}+{damageB}] damage. This strike exists in two states simultaneously--like the fusion itself, it is both and neither.",
		action: "1 action",
	},

	// LEVEL 3: Class Integration - Job synergizes with fusion
	classIntegration: {
		name: "{job} Fusion Art: {fusionName}",
		desc: "[CLASS MERGE] Your {job} training has been permanently altered by the Gemini Protocol. When using {job} class features, they manifest with {fusionTheme} enhancement. Damage becomes [{damageA}+{damageB}], skills gain +{profMod} bonus. This is not two classes--it is one new class that never existed before.",
		action: "Passive",
	},

	// LEVEL 5: Defensive Resonance
	defensiveResonance: {
		name: "{fusionName} Aegis",
		desc: "[BARRIER FUSION] Create a defensive lattice combining {themeA} and {themeB} energies. Gain resistance to both {damageA} and {damageB} damage. Additionally, when you take damage of either type, the barrier absorbs half and converts it to temporary HP. The two powers protect what neither could alone.",
		action: "1 bonus action",
		recharge: "Long Rest",
	},

	// LEVEL 7: Domain Overlap - Territories merge
	domainOverlap: {
		name: "Dual Domain: {fusionTheme}",
		desc: `[TERRITORY FUSION] Manifest the overlapping domains of both ${REGENT_LABEL_PLURAL}. Create a 30-foot radius zone where {themeA} and {themeB} rules apply simultaneously. Allies gain advantage on attacks; enemies suffer disadvantage on saves against {element} effects.`,
		action: "1 action",
		recharge: "Long Rest",
	},

	// LEVEL 10: Path Synthesis
	pathSynthesis: {
		name: "{path}: {fusionName} Form",
		desc: `[PATH FUSION] Your {path} techniques have been rewritten by the Gemini Protocol. When you use Path features, they manifest as {fusionTheme} techniques. Gain a unique combo: use any Path ability followed by a ${REGENT_LABEL.toLowerCase()} ability as a single action.`,
		action: "1 bonus action",
	},

	// LEVEL 14: Resonant Burst - Major power spike
	resonantBurst: {
		name: "{fusionName} Burst",
		desc: `[FUSION EXPLOSION] Release the full combined power of both ${REGENT_LABEL_PLURAL} simultaneously. Create a 30-foot radius explosion of {element} energy. All creatures take [8d10 {damageA} + 8d10 {damageB}] damage (save for half). The explosion leaves behind a zone of {fusionTheme} for 1 minute.`,
		action: "1 action",
		recharge: "Long Rest",
	},

	// LEVEL 17: Perfect Fusion - Capstone ability
	perfectFusion: {
		name: "Perfect Fusion: {fusionName}",
		desc: `[ULTIMATE UNIFIED FUSION] Achieve complete integration of {job}, {path}, {regentA}, and {regentB} into a single being. For 1 minute: double proficiency on all rolls, all damage becomes [{damageA}+{damageB}], immune to {damageA} and {damageB} damage, and you may use any class, path, or ${REGENT_LABEL.toLowerCase()} ability as a bonus action.`,
		action: "1 action",
		recharge: "Long Rest",
		isCapstone: true,
	},

	// LEVEL 20: Sovereign Transcendence - Ultimate power
	sovereignTranscendence: {
		name: "Sovereign Transcendence: {fusionName}",
		desc: "[BEYOND FUSION] Under the The Absolute's blessing, transcend the Gemini Protocol itself. You have become a true Sovereign of {fusionTheme}. Permanent benefits: +4 to all ability scores, resistance to all damage, and once per day you may automatically succeed on any roll. When you die, you may choose to reform after 1d4 days at full power.",
		action: "Passive",
		isCapstone: true,
	},
};

export function generateAbilityFromTemplate(
	template: AbilityTemplate,
	context: Record<string, string>,
	level: number,
	originSources: string[],
): FusionAbility {
	let name = template.name;
	let description = template.desc;

	for (const [key, value] of Object.entries(context)) {
		const regex = new RegExp(`\\{${key}\\}`, "g");
		name = name.replace(regex, value);
		description = description.replace(regex, value);
	}

	return {
		name,
		description,
		level,
		action_type: template.action,
		recharge: template.recharge || null,
		is_capstone: template.isCapstone || false,
		origin_sources: originSources,
		fusion_type: determineUnifiedFusion(),
	};
}

// Simplified fusion determination - unified approach
export function determineUnifiedFusion(): string {
	return "unified";
}

export function mergeSources(primary: string[], required: string[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const value of [...primary, ...required]) {
		if (!value || seen.has(value)) continue;
		seen.add(value);
		result.push(value);
	}
	return result;
}

export function generateSovereign(
	job: Job,
	path: Path,
	regentA: Regent,
	regentB: Regent,
): GeneratedSovereign {
	const fusionName = generateFusionName(regentA, regentB);
	const fusionTheme = getFusionTheme(regentA, regentB);
	const powerMultiplier = getPowerMultiplier();
	const fusionStability = "Stable (Unified, Sovereign-Grade)";

	const _pathShortName = path.name
		.replace(/^Path of the\s*/i, "")
		.replace(/\s*Path$/i, "");
	const displayRegentAName = formatRegentVernacular(regentA.name);
	const displayRegentBName = formatRegentVernacular(regentB.name);
	const _displayRegentATitle = formatRegentVernacular(
		regentA.title || regentA.name,
	);
	const _displayRegentBTitle = formatRegentVernacular(
		regentB.title || regentB.name,
	);

	const context: Record<string, string> = {
		fusionName,
		fusionTheme: fusionTheme.theme,
		element: fusionTheme.element,
		themeA: formatRegentVernacular(regentA.theme),
		themeB: formatRegentVernacular(regentB.theme),
		damageA: formatRegentVernacular(regentA.damage_type || "Force"),
		damageB: formatRegentVernacular(regentB.damage_type || "Force"),
		job: formatRegentVernacular(job.name),
		path: formatRegentVernacular(path.name.replace("Path of the ", "")),
		regentA: formatRegentVernacular(regentA.name),
		regentB: formatRegentVernacular(regentB.name),
		profMod: "2",
	};

	const abilities: FusionAbility[] = [];
	const requiredSources = [
		job.name,
		path.name,
		displayRegentAName,
		displayRegentBName,
	];

	// Level 1: Fusion Awakening
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.fusionAwakening,
			context,
			1,
			mergeSources([regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 3: Class Integration
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.classIntegration,
			context,
			3,
			mergeSources([job.name, regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 5: Defensive Resonance
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.defensiveResonance,
			context,
			5,
			mergeSources([regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 7: Domain Overlap
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.domainOverlap,
			context,
			7,
			mergeSources([regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 10: Path Synthesis
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.pathSynthesis,
			context,
			10,
			mergeSources([path.name, regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 14: Resonant Burst
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.resonantBurst,
			context,
			14,
			mergeSources([regentA.name, regentB.name], requiredSources),
		),
	);

	// Level 17: Perfect Fusion (Capstone)
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.perfectFusion,
			context,
			17,
			mergeSources(
				[job.name, path.name, regentA.name, regentB.name],
				requiredSources,
			),
		),
	);

	// Level 20: Sovereign Transcendence (Ultimate Capstone)
	abilities.push(
		generateAbilityFromTemplate(
			abilityTemplates.sovereignTranscendence,
			context,
			20,
			mergeSources(
				[job.name, path.name, regentA.name, regentB.name],
				requiredSources,
			),
		),
	);

	return {
		name: formatRegentVernacular(`${fusionName} Sovereign`),
		title: formatRegentVernacular(`Sovereign of ${fusionTheme.theme}`),
		description: formatRegentVernacular(
			`Born from the Gemini Protocol fusion of ${regentA.name} and ${regentB.name}, this Sovereign represents a permanent evolution beyond standard ascendant progression.`,
		),
		fusion_theme: formatRegentVernacular(fusionTheme.theme),
		fusion_description: formatRegentVernacular(
			`A permanent fusion of ${fusionTheme.concept}.`,
		),
		fusion_method: "Gemini Protocol (Unified Fusion)",
		abilities,
		job,
		path,
		regentA,
		regentB,
		power_multiplier: powerMultiplier,
		fusion_stability: fusionStability,
	};
}

/**
 * AI-powered sovereign generation using Gemini 2.0 Flash.
 * Falls back to deterministic generateSovereign() if AI is unavailable.
 */
export async function generateSovereignWithAI(
	job: Job,
	path: Path,
	regentA: Regent,
	regentB: Regent,
): Promise<GeneratedSovereign> {
	try {
		const config = aiService.getConfiguration();

		const pathShortName = path.name
			.replace(/^Path of the\s*/i, "")
			.replace(/\s*Path$/i, "");
		const prompt = `You are the Gemini Protocol — the sovereign fusion engine of System Ascendant. Generate a UNIQUE and CREATIVE sovereign class overlay by fusing two Regents with a Job and Path.

FUSION PHILOSOPHY:
This is a TRUE ZENITH FUSION. The components do not just "work together"—they CEASE TO EXIST as individuals and MERGE into a FULLY NEW hybrid entity. The Sovereign's name, title, and every single ability MUST reflect this transformative synthesis. Every ability should feel like a perfectly balanced, inseparable hybrid of Job, Path, and both Regents. This is the highest expression of the System Ascendant's power.

FUSION INPUTS:
- Job: ${job.name} (${job.hit_die} hit die, ${(job.primary_abilities || []).join("/")} primary)
- Path: ${pathShortName}
- Regent A (Dominant): ${regentA.name} — Theme: ${regentA.theme}, Damage: ${regentA.damage_type || "Force"}
- Regent B (Merged): ${regentB.name} — Theme: ${regentB.theme}, Damage: ${regentB.damage_type || "Force"}

Generate a COMPLETE sovereign with these EXACT sections. Be creative — every sovereign must feel unique:

1. FUSION NAME: A creative, evocative name. It should feel like the name of a new species or a legendary hero that is a TRUE HYBRID of the inputs.
2. TITLE: "Sovereign of [theme]" — a dramatic, high-prestige title that defines the essence of the new being.
3. FUSION THEME: The combined elemental/conceptual theme, expressed as a single unified concept (e.g., "Singularity Frost", "Ashen Void", "Supernova Iron").
4. FUSION ORIGIN: 2-3 paragraphs describing the "Ascendant Event" where the Protocol triggered—the moment of merging where Job, Path, and Regents dissolved into one. Describe the new perspective and power this Sovereign now wields.
5. COMBAT DOCTRINE: The "Fused Martial Style"—how the Sovereign's combat techniques have evolved into something neither Job nor Regent could achieve alone.
6. POWER MULTIPLIER: A description of the Sovereign's "Post-Reset" power level (e.g., "Zenith-Tier", "Timeline-Anchored", "Prime-Architect Scale").
7. FUSION STABILITY: The structural integrity of the merger.

8. ABILITIES (exactly 8, one per level milestone):
For EACH ability provide ALL of these fields:
- Name: A fully unique name for the fused ability.
- Level: (use levels 1, 3, 5, 7, 10, 14, 17, 20)
- Action Type: (1 action / 1 bonus action / 1 reaction / Passive)
- Recharge: (At will / Short Rest / Long Rest / null)
- Is Capstone: (true for levels 17 and 20 only)
- Description: 2-3 sentences. Every description MUST describe a merged effect. (e.g., instead of "fire and ice damage", say "Frostfire plasma that crystallizes targets while incinerating them"). Include specific mechanical effects (dice, DCs, ranges).
- Origin Sources: Which inputs contributed (e.g., "Job+Path+RegentA").

Return as plain text with clear section headers. Do NOT use JSON or code fences.`;

		const response = await aiService.processRequest({
			service: config.defaultService,
			type: "generate-content",
			input: prompt,
			context: {
				contentType: "sovereign",
				universe: "System Ascendant",
			},
		});

		if (response.success && response.data) {
			const text =
				typeof response.data === "string"
					? response.data
					: String(response.data);
			if (text.trim().length > 200) {
				// Parse AI text into GeneratedSovereign structure
				const deterministic = generateSovereign(job, path, regentA, regentB);
				return parseAISovereignText(
					text,
					deterministic,
					job,
					path,
					regentA,
					regentB,
				);
			}
		}
	} catch {
		// AI unavailable — fall through to deterministic
	}

	return generateSovereign(job, path, regentA, regentB);
}

export function parseAISovereignText(
	text: string,
	fallback: GeneratedSovereign,
	job: Job,
	path: Path,
	regentA: Regent,
	regentB: Regent,
): GeneratedSovereign {
	const extractSection = (header: string): string => {
		const pattern = new RegExp(
			`(?:^|\\n)\\s*\\d*\\.?\\s*${header}[:\\s]*([\\s\\S]*?)(?=\\n\\s*\\d+\\.\\s+[A-Z]|$)`,
			"i",
		);
		const match = text.match(pattern);
		return match?.[1]?.trim() || "";
	};

	const fusionName = extractSection("FUSION NAME") || fallback.name;
	const title = extractSection("TITLE") || fallback.title;
	const fusionTheme = extractSection("FUSION THEME") || fallback.fusion_theme;
	const description = extractSection("FUSION ORIGIN") || fallback.description;
	const fusionDescription =
		extractSection("COMBAT DOCTRINE") || fallback.fusion_description;
	const powerMultiplier =
		extractSection("POWER MULTIPLIER") || fallback.power_multiplier;
	const fusionStability =
		extractSection("FUSION STABILITY") || fallback.fusion_stability;

	// Try to parse abilities from the AI text; fall back to deterministic abilities
	const abilities = fallback.abilities.map((ability, _index) => {
		// Look for ability descriptions in the AI text that match the level
		const levelPattern = new RegExp(
			`Level\\s*${ability.level}[:\\s]*([\\s\\S]*?)(?=Level\\s*\\d|$)`,
			"i",
		);
		const abilityMatch = text.match(levelPattern);
		if (abilityMatch?.[1]?.trim()) {
			const abilityText = abilityMatch[1].trim();
			const nameMatch = abilityText.match(
				/^(?:[-•*]\s*)?(?:Name:\s*)?([^\n]+)/i,
			);
			const descMatch = abilityText.match(
				/Description:\s*([^\n](?:[\s\S]*?)?)(?=\n\s*(?:Action|Recharge|Origin|Level|Is Capstone)|$)/i,
			);
			return {
				...ability,
				name: formatRegentVernacular(
					nameMatch?.[1]?.replace(/^Name:\s*/i, "").trim() || ability.name,
				),
				description: formatRegentVernacular(
					descMatch?.[1]?.trim() || abilityText.slice(0, 300),
				),
			};
		}
		return ability;
	});

	return {
		name: formatRegentVernacular(fusionName.replace(/^["']|["']$/g, "")),
		title: formatRegentVernacular(title.replace(/^["']|["']$/g, "")),
		description: formatRegentVernacular(description),
		fusion_theme: formatRegentVernacular(fusionTheme),
		fusion_description: formatRegentVernacular(fusionDescription),
		fusion_method: "Gemini Protocol (AI-Enhanced Fusion)",
		abilities,
		job,
		path,
		regentA,
		regentB,
		power_multiplier: formatRegentVernacular(powerMultiplier),
		fusion_stability: formatRegentVernacular(fusionStability),
	};
}

// Calculate the total number of possible combinations
export function calculateTotalCombinations(
	_jobCount: number,
	pathCount: number,
	regentCount: number,
): number {
	// Regents are selected as pairs (A and B, order matters for naming)
	const regentPairs = regentCount * (regentCount - 1);
	// Each path belongs to a specific job, so we use path count directly
	return pathCount * regentPairs;
}

// Get fusion description for display
export function getFusionDescription(): string {
	return `Gemini Protocol overlays a permanent subclass using Job + Path + ${REGENT_LABEL} A + ${REGENT_LABEL} B. Any valid template can fuse, and each Sovereign is a unique, irreversible overlay with combined memories and abilities.`;
}

// Get fusion method description for display (legacy compatibility)
export function getFusionMethodDescription(): string {
	return getFusionDescription();
}
