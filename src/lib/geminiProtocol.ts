// Gemini Protocol - Unified Sovereign Fusion Generator
// Solo Leveling Post-Reset Timeline - Supreme Deity Setting
// Unified Fusion System - Single comprehensive fusion approach

import type { Tables } from '@/integrations/supabase/types';

type Job = Tables<'compendium_jobs'>;
type Path = Tables<'compendium_job_paths'>;
type Monarch = Tables<'compendium_monarchs'>;

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
  monarchA: Monarch;
  monarchB: Monarch;
  power_multiplier: string;
  fusion_stability: string;
}

// Unified Fusion Name Generator - Single comprehensive approach
const generateUnifiedFusionName = (a: string, b: string): string => {
  // Unified fusion: Balanced blend of both names with power suffix
  const midA = Math.ceil(a.length / 2);
  const midB = Math.floor(b.length / 2);
  return `${a.slice(0, midA)}${b.slice(midB)}`;
};

// Generate fusion name based on unified approach
function generateFusionName(monarchA: Monarch, monarchB: Monarch): string {
  const nameA = monarchA.name.replace(/\s*Monarch\s*/gi, '').trim();
  const nameB = monarchB.name.replace(/\s*Monarch\s*/gi, '').trim();
  
  return generateUnifiedFusionName(nameA, nameB);
}

// Fusion Theme Matrix with Dual Class-style power combinations
const themeMatrix: Record<string, Record<string, { theme: string; element: string; concept: string }>> = {
  Shadow: {
    Frost: { theme: 'Frozen Shadow', element: 'umbral-ice', concept: 'absolute darkness that freezes souls' },
    Plague: { theme: 'Necrotic Void', element: 'death-miasma', concept: 'shadow that corrupts and consumes' },
    Stone: { theme: 'Obsidian Titan', element: 'void-stone', concept: 'unyielding darkness made manifest' },
    Beast: { theme: 'Shadow Pack Alpha', element: 'predator-shade', concept: 'apex hunters of eternal night' },
    Iron: { theme: 'Darksteel Legion', element: 'shadow-metal', concept: 'army of shadow-forged warriors' },
    Destruction: { theme: 'Annihilating Void', element: 'entropy-shadow', concept: 'darkness that erases existence' },
    'White Flames': { theme: 'Eclipse Flame', element: 'black-fire', concept: 'shadow flames that burn souls' },
    Transfiguration: { theme: 'Phantom Shifter', element: 'form-void', concept: 'shadows that take any form' },
    Shadow: { theme: 'Absolute Shadow', element: 'true-void', concept: 'perfected mastery of darkness' },
  },
  Frost: {
    Shadow: { theme: 'Frozen Shadow', element: 'ice-void', concept: 'cold that darkens the soul' },
    Plague: { theme: 'Cryogenic Plague', element: 'frost-rot', concept: 'frozen corruption that spreads' },
    Stone: { theme: 'Glacial Colossus', element: 'perma-frost', concept: 'eternal ice mountains' },
    Beast: { theme: 'Arctic Apex', element: 'frost-fang', concept: 'hunters of frozen wastes' },
    Iron: { theme: 'Cryosteel', element: 'frost-metal', concept: 'frozen metal that never thaws' },
    Destruction: { theme: 'Absolute Zero', element: 'entropy-cold', concept: 'cold that ends all motion' },
    'White Flames': { theme: 'Frostfire Paradox', element: 'ice-flame', concept: 'flames that freeze and ice that burns' },
    Transfiguration: { theme: 'Crystal Shifter', element: 'ice-form', concept: 'ever-changing frozen forms' },
    Frost: { theme: 'Absolute Frost', element: 'true-cold', concept: 'perfected mastery of cold' },
  },
  Plague: {
    Shadow: { theme: 'Necrotic Void', element: 'death-shadow', concept: 'plague that corrupts from darkness' },
    Frost: { theme: 'Cryogenic Plague', element: 'rot-frost', concept: 'frozen corruption' },
    Stone: { theme: 'Petrifying Blight', element: 'plague-stone', concept: 'disease that turns to stone' },
    Beast: { theme: 'Pandemic Swarm', element: 'plague-beast', concept: 'infected horde of monsters' },
    Iron: { theme: 'Corroding Arsenal', element: 'rust-plague', concept: 'weapons of decay' },
    Destruction: { theme: 'Extinction Plague', element: 'end-rot', concept: 'disease that ends species' },
    'White Flames': { theme: 'Burning Pestilence', element: 'plague-fire', concept: 'flames of infectious destruction' },
    Transfiguration: { theme: 'Mutagenic Horror', element: 'mutation', concept: 'ever-evolving plague' },
    Plague: { theme: 'Absolute Plague', element: 'true-rot', concept: 'perfected mastery of disease' },
  },
  Stone: {
    Shadow: { theme: 'Obsidian Titan', element: 'void-stone', concept: 'darkness made solid' },
    Frost: { theme: 'Glacial Colossus', element: 'frost-stone', concept: 'frozen mountain given life' },
    Plague: { theme: 'Petrifying Blight', element: 'stone-plague', concept: 'corruption that petrifies' },
    Beast: { theme: 'Primordial Behemoth', element: 'beast-stone', concept: 'ancient stone creature' },
    Iron: { theme: 'Adamantine', element: 'metal-stone', concept: 'unbreakable fusion of earth and steel' },
    Destruction: { theme: 'Seismic Annihilator', element: 'quake-doom', concept: 'earthquakes that end civilizations' },
    'White Flames': { theme: 'Magma Titan', element: 'lava-stone', concept: 'molten core of destruction' },
    Transfiguration: { theme: 'Living Monolith', element: 'shift-stone', concept: 'stone that reshapes at will' },
    Stone: { theme: 'Absolute Stone', element: 'true-earth', concept: 'perfected mastery of earth' },
  },
  Beast: {
    Shadow: { theme: 'Shadow Pack Alpha', element: 'void-beast', concept: 'shadow creatures as extensions' },
    Frost: { theme: 'Arctic Apex', element: 'frost-beast', concept: 'frost wolves and ice bears' },
    Plague: { theme: 'Pandemic Swarm', element: 'plague-beast', concept: 'infected monster horde' },
    Stone: { theme: 'Primordial Behemoth', element: 'stone-beast', concept: 'ancient titanic creatures' },
    Iron: { theme: 'Mechanized Pack', element: 'steel-beast', concept: 'metal-enhanced creatures' },
    Destruction: { theme: 'Apex Extinction', element: 'doom-beast', concept: 'ultimate predators' },
    'White Flames': { theme: 'Phoenix Chimera', element: 'fire-beast', concept: 'flame-born monsters' },
    Transfiguration: { theme: 'Shapeshifter Alpha', element: 'morph-beast', concept: 'beasts that become anything' },
    Beast: { theme: 'Absolute Beast', element: 'true-beast', concept: 'perfected mastery of creatures' },
  },
  Iron: {
    Shadow: { theme: 'Darksteel Legion', element: 'shadow-metal', concept: 'shadow-forged warriors' },
    Frost: { theme: 'Cryosteel', element: 'frost-metal', concept: 'frozen indestructible metal' },
    Plague: { theme: 'Corroding Arsenal', element: 'rust-metal', concept: 'weapons of decay' },
    Stone: { theme: 'Adamantine', element: 'stone-metal', concept: 'ultimate durability' },
    Beast: { theme: 'Mechanized Pack', element: 'beast-metal', concept: 'cybernetic beasts' },
    Destruction: { theme: 'Annihilator Protocol', element: 'doom-metal', concept: 'weapons of mass destruction' },
    'White Flames': { theme: 'Molten Arsenal', element: 'fire-metal', concept: 'superheated weapons' },
    Transfiguration: { theme: 'Morphic Alloy', element: 'shift-metal', concept: 'liquid metal transformation' },
    Iron: { theme: 'Absolute Iron', element: 'true-metal', concept: 'perfected mastery of metal' },
  },
  Destruction: {
    Shadow: { theme: 'Annihilating Void', element: 'void-doom', concept: 'darkness that unmakes' },
    Frost: { theme: 'Absolute Zero', element: 'cold-doom', concept: 'end of all heat' },
    Plague: { theme: 'Extinction Plague', element: 'plague-doom', concept: 'disease that ends existence' },
    Stone: { theme: 'Seismic Annihilator', element: 'earth-doom', concept: 'world-breaking force' },
    Beast: { theme: 'Apex Extinction', element: 'beast-doom', concept: 'ultimate predatory force' },
    Iron: { theme: 'Annihilator Protocol', element: 'metal-doom', concept: 'arsenal of armageddon' },
    'White Flames': { theme: 'Apocalypse Flame', element: 'fire-doom', concept: 'flames that end worlds' },
    Transfiguration: { theme: 'Reality Eraser', element: 'shift-doom', concept: 'changing reality to nothing' },
    Destruction: { theme: 'Absolute Destruction', element: 'true-doom', concept: 'perfected mastery of ending' },
  },
  'White Flames': {
    Shadow: { theme: 'Eclipse Flame', element: 'shadow-fire', concept: 'black flames of the void' },
    Frost: { theme: 'Frostfire Paradox', element: 'frost-fire', concept: 'impossible union of opposites' },
    Plague: { theme: 'Burning Pestilence', element: 'plague-fire', concept: 'infectious burning' },
    Stone: { theme: 'Magma Titan', element: 'stone-fire', concept: 'volcanic destruction' },
    Beast: { theme: 'Phoenix Chimera', element: 'beast-fire', concept: 'flame-born creatures' },
    Iron: { theme: 'Molten Arsenal', element: 'metal-fire', concept: 'superheated weapons' },
    Destruction: { theme: 'Apocalypse Flame', element: 'doom-fire', concept: 'world-ending conflagration' },
    Transfiguration: { theme: 'Living Inferno', element: 'shift-fire', concept: 'flames that take any form' },
    'White Flames': { theme: 'Absolute Flame', element: 'true-fire', concept: 'perfected mastery of fire' },
  },
  Transfiguration: {
    Shadow: { theme: 'Phantom Shifter', element: 'shadow-morph', concept: 'formless shadow' },
    Frost: { theme: 'Crystal Shifter', element: 'frost-morph', concept: 'ice in any shape' },
    Plague: { theme: 'Mutagenic Horror', element: 'plague-morph', concept: 'ever-evolving form' },
    Stone: { theme: 'Living Monolith', element: 'stone-morph', concept: 'stone that lives' },
    Beast: { theme: 'Shapeshifter Alpha', element: 'beast-morph', concept: 'any creature form' },
    Iron: { theme: 'Morphic Alloy', element: 'metal-morph', concept: 'liquid metal form' },
    Destruction: { theme: 'Reality Eraser', element: 'doom-morph', concept: 'shifting into nothing' },
    'White Flames': { theme: 'Living Inferno', element: 'fire-morph', concept: 'flames given form' },
    Transfiguration: { theme: 'Absolute Form', element: 'true-morph', concept: 'perfected mastery of change' },
  },
};

function getFusionTheme(monarchA: Monarch, monarchB: Monarch): { theme: string; element: string; concept: string } {
  const themeA = monarchA.theme;
  const themeB = monarchB.theme;
  
  const result = themeMatrix[themeA]?.[themeB] || themeMatrix[themeB]?.[themeA];
  if (result) return result;
  
  return {
    theme: `${themeA}-${themeB} Convergence`,
    element: `${themeA.toLowerCase()}-${themeB.toLowerCase()}`,
    concept: `fusion of ${themeA} and ${themeB} domains`,
  };
}

// Unified Power Multiplier - Single comprehensive approach
function getPowerMultiplier(): string {
  return 'Base Power x Thousands (Unified Fusion - Permanent, Sovereign-Stabilized)';
}

// Unified ability templates with comprehensive fusion mechanics
type AbilityTemplate = {
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
    name: '{fusionName} Strike',
    desc: '[UNIFIED FUSION TECHNIQUE] Channel the merged essence of {monarchA} and {monarchB}. Your attacks manifest as {element} energy, dealing [{damageA}+{damageB}] damage. This strike exists in two states simultaneously--like the fusion itself, it is both and neither.',
    action: '1 action',
  },

  // LEVEL 3: Class Integration - Job synergizes with fusion
  classIntegration: {
    name: '{job} Fusion Art: {fusionName}',
    desc: '[CLASS MERGE] Your {job} training has been permanently altered by the Gemini Protocol. When using {job} class features, they manifest with {fusionTheme} enhancement. Damage becomes [{damageA}+{damageB}], skills gain +{profMod} bonus. This is not two classes--it is one new class that never existed before.',
    action: 'Passive',
  },

  // LEVEL 5: Defensive Resonance
  defensiveResonance: {
    name: '{fusionName} Aegis',
    desc: '[BARRIER FUSION] Create a defensive matrix combining {themeA} and {themeB} energies. Gain resistance to both {damageA} and {damageB} damage. Additionally, when you take damage of either type, the barrier absorbs half and converts it to temporary HP. The two powers protect what neither could alone.',
    action: '1 bonus action',
    recharge: 'Long Rest',
  },

  // LEVEL 7: Domain Overlap - Territories merge
  domainOverlap: {
    name: 'Dual Domain: {fusionTheme}',
    desc: '[TERRITORY FUSION] Manifest the overlapping domains of both Monarchs. Create a 30-foot radius zone where {themeA} and {themeB} rules apply simultaneously. Allies gain advantage on attacks; enemies suffer disadvantage on saves against {element} effects.',
    action: '1 action',
    recharge: 'Long Rest',
  },

  // LEVEL 10: Path Synthesis
  pathSynthesis: {
    name: '{path}: {fusionName} Form',
    desc: '[PATH FUSION] Your {path} techniques have been rewritten by the Gemini Protocol. When you use Path features, they manifest as {fusionTheme} techniques. Gain a unique combo: use any Path ability followed by a Monarch ability as a single action.',
    action: '1 bonus action',
  },

  // LEVEL 14: Resonant Burst - Major power spike
  resonantBurst: {
    name: '{fusionName} Burst',
    desc: '[FUSION EXPLOSION] Release the full combined power of both Monarchs simultaneously. Create a 30-foot radius explosion of {element} energy. All creatures take [8d10 {damageA} + 8d10 {damageB}] damage (save for half). The explosion leaves behind a zone of {fusionTheme} for 1 minute.',
    action: '1 action',
    recharge: 'Long Rest',
  },

  // LEVEL 17: Perfect Fusion - Capstone ability
  perfectFusion: {
    name: 'Perfect Fusion: {fusionName}',
    desc: '[ULTIMATE UNIFIED FUSION] Achieve complete integration of {job}, {path}, {monarchA}, and {monarchB} into a single being. For 1 minute: double proficiency on all rolls, all damage becomes [{damageA}+{damageB}], immune to {damageA} and {damageB} damage, and you may use any class/path/monarch ability as a bonus action.',
    action: '1 action',
    recharge: 'Long Rest',
    isCapstone: true,
  },

  // LEVEL 20: Sovereign Transcendence - Ultimate power
  sovereignTranscendence: {
    name: 'Sovereign Transcendence: {fusionName}',
    desc: '[BEYOND FUSION] Under the Supreme Deity\'s blessing, transcend the Gemini Protocol itself. You have become a true Sovereign of {fusionTheme}. Permanent benefits: +4 to all ability scores, resistance to all damage, and once per day you may automatically succeed on any roll. When you die, you may choose to reform after 1d4 days at full power.',
    action: 'Passive',
    isCapstone: true,
  },
};

function generateAbilityFromTemplate(
  template: AbilityTemplate,
  context: Record<string, string>,
  level: number,
  originSources: string[]
): FusionAbility {
  let name = template.name;
  let description = template.desc;
  
  for (const [key, value] of Object.entries(context)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
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
function determineUnifiedFusion(): string {
  return 'unified';
}

function mergeSources(primary: string[], required: string[]): string[] {
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
  monarchA: Monarch,
  monarchB: Monarch
): GeneratedSovereign {
  const fusionThemeData = getFusionTheme(monarchA, monarchB);
  const fusionName = generateFusionName(monarchA, monarchB);
  const powerMultiplier = getPowerMultiplier();
  
  const pathShortName = path.name.replace(/^Path of the\s*/i, '').replace(/\s*Path$/i, '');
  
  const context: Record<string, string> = {
    fusionName,
    fusionTheme: fusionThemeData.theme,
    theme: fusionThemeData.theme,
    element: fusionThemeData.element,
    concept: fusionThemeData.concept,
    themeA: monarchA.theme,
    themeB: monarchB.theme,
    damageA: monarchA.damage_type || 'necrotic',
    damageB: monarchB.damage_type || 'force',
    monarchA: monarchA.name,
    monarchB: monarchB.name,
    job: job.name,
    path: pathShortName,
    profMod: 'proficiency modifier',
  };

  const abilities: FusionAbility[] = [];
  const requiredSources = [job.name, path.name, monarchA.name, monarchB.name];
  
  // Level 1: Fusion Awakening
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.fusionAwakening,
    context,
    1,
    mergeSources([monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 3: Class Integration
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.classIntegration,
    context,
    3,
    mergeSources([job.name, monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 5: Defensive Resonance
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.defensiveResonance,
    context,
    5,
    mergeSources([monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 7: Domain Overlap
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.domainOverlap,
    context,
    7,
    mergeSources([monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 10: Path Synthesis
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.pathSynthesis,
    context,
    10,
    mergeSources([path.name, monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 14: Resonant Burst
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.resonantBurst,
    context,
    14,
    mergeSources([monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 17: Perfect Fusion (Capstone)
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.perfectFusion,
    context,
    17,
    mergeSources([job.name, path.name, monarchA.name, monarchB.name], requiredSources)
  ));

  // Level 20: Sovereign Transcendence (Ultimate Capstone)
  abilities.push(generateAbilityFromTemplate(
    abilityTemplates.sovereignTranscendence,
    context,
    20,
    mergeSources([job.name, path.name, monarchA.name, monarchB.name], requiredSources)
  ));

  return {
    name: `${fusionName} Sovereign`,
    title: `The ${fusionThemeData.theme} ${job.name}`,
    description: `[GEMINI PROTOCOL: SUBCLASS OVERLAY]
    
A permanent subclass overlay combining ${job.name} (${pathShortName}) with the merged essence of ${monarchA.title} and ${monarchB.title}. Through the Gemini Protocol - blessed by the Supreme Deity in the post-reset timeline - this Sovereign embodies ${fusionThemeData.concept}. The overlay is permanent and stabilized by sovereign power.

Unlike temporary boosts or conditional fusions, this overlay rewrites the base class. The four components (Job, Path, Monarch A, Monarch B) do not merely cooperate - they become ONE sovereign identity with new capabilities.

This Sovereign wields ${fusionThemeData.theme} power, a force that neither ${monarchA.name} nor ${monarchB.name} could manifest alone.`,
    fusion_theme: fusionThemeData.theme,
    fusion_description: `The ${fusionThemeData.theme} overlay represents ${fusionThemeData.concept}. This combines ${monarchA.theme}'s mastery of ${monarchA.damage_type || 'necrotic'} with ${monarchB.theme}'s control over ${monarchB.damage_type || 'force'}, filtered through ${job.name} combat doctrine and ${pathShortName} techniques.

In system terms: this is a permanent subclass overlay, not multi-classing or a temporary fusion. Every Sovereign is a unique overlay that never exists again in exactly the same form.

The overlay is greater than the sum of its parts. ${fusionName} is not "${monarchA.name} + ${monarchB.name}" - ${fusionName} is a NEW SOVEREIGN with NEW POWER.`,
    fusion_method: 'Gemini Protocol',
    abilities,
    job,
    path,
    monarchA,
    monarchB,
    power_multiplier: powerMultiplier,
    fusion_stability: 'Permanent - Sovereign subclass overlay',
  };
}

// Calculate the total number of possible combinations
export function calculateTotalCombinations(
  jobCount: number,
  pathCount: number,
  monarchCount: number
): number {
  // Monarchs are selected as pairs (A and B, order matters for naming)
  const monarchPairs = monarchCount * (monarchCount - 1);
  // Each path belongs to a specific job, so we use path count directly
  return pathCount * monarchPairs;
}

// Get fusion description for display
export function getFusionDescription(): string {
  return 'Gemini Protocol overlays a permanent subclass using Job + Path + Monarch A + Monarch B. Any valid template can fuse, and each Sovereign is a unique, irreversible overlay with combined memories and abilities.';
}

// Get fusion method description for display (legacy compatibility)
export function getFusionMethodDescription(): string {
  return getFusionDescription();
}
