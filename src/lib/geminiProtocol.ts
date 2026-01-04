// Gemini Protocol - Procedural Sovereign Fusion Generator
// Solo Leveling Post-Reset Timeline - Supreme Deity Jinwoo Setting
// DBZ/Super-Style + Dual Class LitRPG Series Fusion Mechanics

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
  fusion_type: 'potara' | 'dance' | 'dual_class' | 'metamor';
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

// DBZ/Super Fusion Name Generators - Potara (Vegito) vs Metamor/Dance (Gogeta) style
const potaraFusion = (a: string, b: string): string => {
  // Potara: First syllable(s) of A + ending of B (like Vegito = Vegeta + Kakarotto)
  const syllablesA = a.match(/[^aeiou]*[aeiou]+/gi) || [a.slice(0, 2)];
  const endingB = b.slice(Math.max(1, b.length - 3));
  return `${syllablesA[0]}${endingB}`;
};

const metamorFusion = (a: string, b: string): string => {
  // Metamor/Dance: More balanced blend (like Gogeta = Goku + Vegeta)
  const midA = Math.ceil(a.length / 2);
  const midB = Math.floor(b.length / 2);
  return `${a.slice(0, midA)}${b.slice(midB)}`;
};

const dualClassFusion = (a: string, b: string): string => {
  // Dual Class style: Combined title with power suffix
  return `${a.slice(0, 3)}${b.slice(0, 3)}ion`;
};

const absorbedFusion = (dominant: string, absorbed: string): string => {
  // Cell/Buu absorption style
  return `${dominant}-${absorbed.slice(0, 2)}`;
};

// Generate fusion name based on fusion method
function generateFusionName(monarchA: Monarch, monarchB: Monarch, method: 'potara' | 'dance' | 'dual_class' | 'absorbed'): string {
  const nameA = monarchA.name.replace(/\s*Monarch\s*/gi, '').trim();
  const nameB = monarchB.name.replace(/\s*Monarch\s*/gi, '').trim();
  
  switch (method) {
    case 'potara':
      return potaraFusion(nameA, nameB);
    case 'dance':
      return metamorFusion(nameA, nameB);
    case 'dual_class':
      return dualClassFusion(nameA, nameB);
    case 'absorbed':
      return absorbedFusion(nameA, nameB);
    default:
      return potaraFusion(nameA, nameB);
  }
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

// DBZ/Super Power Multiplier based on fusion method
function getPowerMultiplier(method: 'potara' | 'dance' | 'dual_class' | 'absorbed'): string {
  switch (method) {
    case 'potara':
      return 'Base Power × Tens of Thousands (Potara Fusion - Permanent, Ultimate Power)';
    case 'dance':
      return 'Base Power × Thousands (Metamoran Fusion - 30-minute Time Limit)';
    case 'dual_class':
      return 'Base Power × Hundreds (Dual Class Merge - Permanent Integration)';
    case 'absorbed':
      return 'Base Power + Absorbed Power (Absorption - Permanent Dominant)';
    default:
      return 'Base Power × Combined';
  }
}

// Dual Class LitRPG style ability templates with proper fusion mechanics
const abilityTemplates = {
  // LEVEL 1: Fusion Awakening - First taste of combined power
  fusionAwakening: [
    { 
      name: '{fusionName} Strike',
      desc: '[DUAL-WIELD TECHNIQUE] Channel the merged essence of {monarchA} and {monarchB}. Your attacks manifest as {element} energy, dealing [{damageA}+{damageB}] damage. This strike exists in two states simultaneously—like the fusion itself, it is both and neither, transcending the original powers.',
      action: '1 action',
      type: 'dual_class' as const
    },
    {
      name: 'Potara Pulse: {theme}',
      desc: '[POTARA SYNERGY] The earrings of the Supreme Kai resonate within you. Release a wave of {fusionTheme} energy in a 15-foot cone. Creatures must save or take [{damageA}] damage and be marked with {damageB} vulnerability for 1 minute. Your fusion is eternal—so is this curse.',
      action: '1 action',
      type: 'potara' as const
    },
  ],
  
  // LEVEL 3: Class Integration - Job synergizes with fusion
  classIntegration: [
    {
      name: '{job} Fusion Art: {fusionName}',
      desc: '[CLASS MERGE] Your {job} training has been permanently altered by the Gemini Protocol. When using {job} class features, they manifest with {fusionTheme} enhancement. Damage becomes [{damageA}+{damageB}], skills gain +{profMod} bonus. This is not two classes—it is one new class that never existed before.',
      action: 'Passive',
      type: 'dual_class' as const
    },
    {
      name: 'Metamoran {job} Stance',
      desc: '[DANCE FUSION] Enter the unified stance of the Fusion Dance. For 1 minute, your {job} abilities cost half resources and deal additional {damageB} damage. However, if your fusion destabilizes (take critical hit), this stance ends early.',
      action: '1 bonus action',
      recharge: 'Short Rest',
      type: 'dance' as const
    },
  ],
  
  // LEVEL 5: Defensive Resonance
  defensiveResonance: [
    {
      name: '{fusionName} Aegis',
      desc: '[BARRIER FUSION] Create a defensive matrix combining {themeA} and {themeB} energies. Gain resistance to both {damageA} and {damageB} damage. Additionally, when you take damage of either type, the barrier absorbs half and converts it to temporary HP. The two powers protect what neither could alone.',
      action: '1 bonus action',
      recharge: 'Long Rest',
      type: 'dual_class' as const
    },
    {
      name: 'Potara Shell: {theme}',
      desc: '[ETERNAL GUARD] The permanence of Potara fusion grants unbreakable defense. Once per long rest, when you would be reduced to 0 HP, instead remain at 1 HP and gain immunity to all damage for 1 round. Your fusion cannot be undone—neither can your existence.',
      action: 'Reaction',
      recharge: 'Long Rest',
      type: 'potara' as const
    },
  ],
  
  // LEVEL 7: Domain Overlap - Territories merge
  domainOverlap: [
    {
      name: 'Dual Domain: {fusionTheme}',
      desc: '[TERRITORY FUSION] Manifest the overlapping domains of both Monarchs. Create a 30-foot radius zone where {themeA} and {themeB} rules apply simultaneously. Allies gain advantage on attacks; enemies suffer disadvantage on saves against {element} effects. The domains do not share space—they become one new space.',
      action: '1 action',
      recharge: 'Long Rest',
      type: 'dual_class' as const
    },
    {
      name: '{fusionName} Sense',
      desc: '[MERGED PERCEPTION] Your senses have fused like your power. Detect all creatures and magic related to {themeA} or {themeB} within 120 feet. You can communicate telepathically with creatures of either domain. Neither Monarch\'s awareness—both. Beyond both.',
      action: 'Passive',
      type: 'potara' as const
    },
  ],
  
  // LEVEL 10: Path Synthesis
  pathSynthesis: [
    {
      name: '{path}: {fusionName} Form',
      desc: '[PATH FUSION] Your {path} techniques have been rewritten by the Gemini Protocol. When you use Path features, they manifest as {fusionTheme} techniques. Gain a unique combo: use any Path ability followed by a Monarch ability as a single action. The path and the power are one road now.',
      action: '1 bonus action',
      type: 'dual_class' as const
    },
    {
      name: 'Fusion Dance: {path} Kata',
      desc: '[METAMORAN ART] Perform the sacred movements of the Fusion Dance imbued with {path} precision. For the next minute, your {path} abilities deal additional {damageA} + {damageB} damage and can target one additional creature. Timing is everything—perfect fusion, perfect technique.',
      action: '1 action',
      recharge: 'Short Rest',
      type: 'dance' as const
    },
  ],
  
  // LEVEL 14: Resonant Burst - Major power spike
  resonantBurst: [
    {
      name: '{fusionName} Burst',
      desc: '[FUSION EXPLOSION] Release the full combined power of both Monarchs simultaneously. Create a 30-foot radius explosion of {element} energy. All creatures take [8d10 {damageA} + 8d10 {damageB}] damage (save for half). The explosion leaves behind a zone of {fusionTheme} for 1 minute.',
      action: '1 action',
      recharge: 'Long Rest',
      type: 'dual_class' as const
    },
    {
      name: 'Potara Radiance: {theme}',
      desc: '[SUPREME LIGHT] Channel the divine power of Potara fusion. For 1 minute, you emanate {fusionTheme} aura. All allies within 30 feet deal additional {damageA} damage; all enemies take {damageB} damage at start of their turns. The earrings were made for gods—now you wear their power.',
      action: '1 action',
      recharge: 'Long Rest',
      type: 'potara' as const
    },
  ],
  
  // LEVEL 17: Perfect Fusion - Capstone ability
  perfectFusion: [
    {
      name: 'Perfect Fusion: {fusionName}',
      desc: '[ULTIMATE DUAL CLASS] Achieve what should be impossible—complete integration of {job}, {path}, {monarchA}, and {monarchB} into a single, perfect being. For 1 minute: double proficiency on all rolls, all damage becomes [{damageA}+{damageB}], immune to {damageA} and {damageB} damage, and you may use any class/path/monarch ability as a bonus action. You are not four things combined. You are one thing that never existed before.',
      action: '1 action',
      recharge: 'Long Rest',
      isCapstone: true,
      type: 'dual_class' as const
    },
    {
      name: 'Potara Apotheosis: {fusionName}',
      desc: '[DIVINE FUSION] The Potara earrings were never meant for mortals. Now they create something beyond mortal and divine. For 1 minute: you are immune to all damage types, your attacks automatically hit, and you can take an additional action each turn. When this ends, enemies within 60 feet take [20d10] {element} damage. Permanent. Perfect. Absolute.',
      action: '1 action',
      recharge: 'Long Rest',
      isCapstone: true,
      type: 'potara' as const
    },
  ],
  
  // LEVEL 20: Sovereign Transcendence - Ultimate power
  sovereignTranscendence: [
    {
      name: 'Sovereign Transcendence: {fusionName}',
      desc: '[BEYOND FUSION] Under Supreme Deity Jinwoo\'s blessing, transcend the Gemini Protocol itself. You have become something neither {monarchA} nor {monarchB} could comprehend—a true Sovereign of {fusionTheme}. Permanent benefits: +4 to all ability scores, resistance to all damage, and once per day you may automatically succeed on any roll. When you die, you may choose to reform after 1d4 days at full power. The fusion is complete. The Sovereign is eternal.',
      action: 'Passive',
      isCapstone: true,
      type: 'dual_class' as const
    },
    {
      name: 'Metamoran Godhood',
      desc: '[DANCE OF DIVINITY] The Fusion Dance perfected beyond its creators\' imagination. Once per day, enter a state of perfect fusion for 1 hour (no time limit). During this time: fly at twice your speed, teleport 60 feet as a bonus action, all abilities recharge on hit, and your fusion cannot be dispelled or destabilized by any means. The dance is eternal when performed by a Sovereign.',
      action: '1 action',
      recharge: 'Long Rest',
      isCapstone: true,
      type: 'dance' as const
    },
  ],
};

function generateAbilityFromTemplate(
  template: {
    name: string;
    desc: string;
    action: string;
    recharge?: string;
    isCapstone?: boolean;
    type: 'potara' | 'dance' | 'dual_class' | 'metamor';
  },
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
    fusion_type: template.type,
  };
}

// Determine fusion method based on combination
function determineFusionMethod(job: Job, monarchA: Monarch, monarchB: Monarch): 'potara' | 'dance' | 'dual_class' | 'absorbed' {
  // Shadow Monarch combinations use Potara (permanent, supreme power like Jinwoo)
  if (monarchA.theme === 'Shadow' || monarchB.theme === 'Shadow') {
    return 'potara';
  }
  
  // Destruction + anything uses absorbed (like Cell absorbing androids)
  if (monarchA.theme === 'Destruction' || monarchB.theme === 'Destruction') {
    return 'absorbed';
  }
  
  // Matching themes use perfected dual class
  if (monarchA.theme === monarchB.theme) {
    return 'dual_class';
  }
  
  // Combat-focused jobs use Dance (time-limited but extremely powerful bursts)
  const combatJobs = ['Fighter', 'Striker', 'Mage', 'Assassin', 'Ranger'];
  if (combatJobs.includes(job.name)) {
    return 'dance';
  }
  
  // Default to dual class for balanced permanent fusion
  return 'dual_class';
}

export function generateSovereign(
  job: Job,
  path: Path,
  monarchA: Monarch,
  monarchB: Monarch
): GeneratedSovereign {
  const fusionMethod = determineFusionMethod(job, monarchA, monarchB);
  const fusionThemeData = getFusionTheme(monarchA, monarchB);
  const fusionName = generateFusionName(monarchA, monarchB, fusionMethod);
  const powerMultiplier = getPowerMultiplier(fusionMethod);
  
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
  
  // Level 1: Fusion Awakening
  const awakeningTemplate = fusionMethod === 'potara' 
    ? abilityTemplates.fusionAwakening[1] 
    : abilityTemplates.fusionAwakening[0];
  abilities.push(generateAbilityFromTemplate(
    awakeningTemplate,
    context,
    1,
    [monarchA.name, monarchB.name]
  ));

  // Level 3: Class Integration
  const classTemplate = fusionMethod === 'dance'
    ? abilityTemplates.classIntegration[1]
    : abilityTemplates.classIntegration[0];
  abilities.push(generateAbilityFromTemplate(
    classTemplate,
    context,
    3,
    [job.name, monarchA.name, monarchB.name]
  ));

  // Level 5: Defensive Resonance
  const defenseTemplate = fusionMethod === 'potara'
    ? abilityTemplates.defensiveResonance[1]
    : abilityTemplates.defensiveResonance[0];
  abilities.push(generateAbilityFromTemplate(
    defenseTemplate,
    context,
    5,
    [monarchA.name, monarchB.name]
  ));

  // Level 7: Domain Overlap
  const domainTemplate = fusionMethod === 'potara'
    ? abilityTemplates.domainOverlap[1]
    : abilityTemplates.domainOverlap[0];
  abilities.push(generateAbilityFromTemplate(
    domainTemplate,
    context,
    7,
    [monarchA.name, monarchB.name]
  ));

  // Level 10: Path Synthesis
  const pathTemplate = fusionMethod === 'dance'
    ? abilityTemplates.pathSynthesis[1]
    : abilityTemplates.pathSynthesis[0];
  abilities.push(generateAbilityFromTemplate(
    pathTemplate,
    context,
    10,
    [path.name, monarchA.name, monarchB.name]
  ));

  // Level 14: Resonant Burst
  const burstTemplate = fusionMethod === 'potara'
    ? abilityTemplates.resonantBurst[1]
    : abilityTemplates.resonantBurst[0];
  abilities.push(generateAbilityFromTemplate(
    burstTemplate,
    context,
    14,
    [monarchA.name, monarchB.name]
  ));

  // Level 17: Perfect Fusion (Capstone)
  const perfectTemplate = fusionMethod === 'potara'
    ? abilityTemplates.perfectFusion[1]
    : abilityTemplates.perfectFusion[0];
  abilities.push(generateAbilityFromTemplate(
    perfectTemplate,
    context,
    17,
    [job.name, path.name, monarchA.name, monarchB.name]
  ));

  // Level 20: Sovereign Transcendence (Ultimate Capstone)
  const transcendTemplate = fusionMethod === 'dance'
    ? abilityTemplates.sovereignTranscendence[1]
    : abilityTemplates.sovereignTranscendence[0];
  abilities.push(generateAbilityFromTemplate(
    transcendTemplate,
    context,
    20,
    [job.name, path.name, monarchA.name, monarchB.name]
  ));

  const fusionMethodDisplay = {
    potara: 'Potara Earring Fusion (Permanent, Supreme Power)',
    dance: 'Metamoran Fusion Dance (Time-Limited, Explosive Power)',
    dual_class: 'Dual Class Integration (Permanent, Balanced)',
    absorbed: 'Absorption Fusion (Permanent, Dominant)',
  };

  const fusionStability = {
    potara: 'Eternal - Cannot be undone by any force',
    dance: 'Stable - 30 minute limit, extends with Sovereign power',
    dual_class: 'Perfect - Seamlessly integrated',
    absorbed: 'Dominant - Original personality prevails',
  };

  return {
    name: `${fusionName} Sovereign`,
    title: `The ${fusionThemeData.theme} ${job.name}`,
    description: `[GEMINI PROTOCOL: ${fusionMethod.toUpperCase()} FUSION]
    
A transcendent fusion of ${job.name} (${pathShortName}) with the merged essence of ${monarchA.title} and ${monarchB.title}. Through the Gemini Protocol—blessed by Supreme Deity Sung Jinwoo in the post-reset timeline—this Sovereign embodies ${fusionThemeData.concept}.

Unlike simple power combinations, this is TRUE FUSION in the style of the Potara earrings and Fusion Dance. The four components (Job, Path, Monarch A, Monarch B) do not merely cooperate—they have become ONE BEING that transcends all original limitations.

This Sovereign wields ${fusionThemeData.theme} power, a force that neither ${monarchA.name} nor ${monarchB.name} could manifest alone.`,
    fusion_theme: fusionThemeData.theme,
    fusion_description: `The ${fusionThemeData.theme} fusion represents ${fusionThemeData.concept}. This combines ${monarchA.theme}'s mastery of ${monarchA.damage_type || 'necrotic'} with ${monarchB.theme}'s control over ${monarchB.damage_type || 'force'}, filtered through ${job.name} combat doctrine and ${pathShortName} techniques.

In Dual Class LitRPG terms: this is not multi-classing or dual-classing—this is CLASS FUSION. A new class that has never existed and will never exist again in exactly this form.

In DBZ/Super terms: like Vegito or Gogeta, the fusion is greater than the sum of its parts. ${fusionName} is not "${monarchA.name} + ${monarchB.name}"—${fusionName} is a NEW BEING with NEW POWER.`,
    fusion_method: fusionMethodDisplay[fusionMethod],
    abilities,
    job,
    path,
    monarchA,
    monarchB,
    power_multiplier: powerMultiplier,
    fusion_stability: fusionStability[fusionMethod],
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

// Get fusion method description for display
export function getFusionMethodDescription(method: 'potara' | 'dance' | 'dual_class' | 'absorbed'): string {
  const descriptions = {
    potara: 'Potara Fusion uses the divine earrings of the Supreme Kai. The fusion is PERMANENT and results in power multiplied tens of thousands of times. The fused being is a completely new entity with combined memories and abilities.',
    dance: 'Metamoran Fusion Dance requires perfect synchronization between fusees. The fusion lasts 30 minutes but produces explosive power thousands of times the original. Any mistake in the dance results in a failed fusion.',
    dual_class: 'Dual Class Integration merges two class trees into one unified progression. Unlike multi-classing which splits focus, this creates synergistic abilities that scale together. The fusion is permanent and grows stronger over time.',
    absorbed: 'Absorption Fusion integrates the target\'s power while maintaining the dominant personality. Like Cell absorbing the Androids, this grants access to all absorbed abilities while the absorber remains in control.',
  };
  return descriptions[method];
}
