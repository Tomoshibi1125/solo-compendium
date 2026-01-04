// Gemini Protocol - Procedural Sovereign Fusion Generator
// Solo Leveling Post-Reset Timeline - Supreme Deity Jinwoo Setting

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
}

export interface GeneratedSovereign {
  name: string;
  title: string;
  description: string;
  fusion_theme: string;
  fusion_description: string;
  abilities: FusionAbility[];
  job: Job;
  path: Path;
  monarchA: Monarch;
  monarchB: Monarch;
}

// Fusion name patterns inspired by Dragon Ball Z/Super fusion naming conventions
const fusionNamePatterns = [
  (a: string, b: string) => `${a.slice(0, Math.ceil(a.length / 2))}${b.slice(Math.floor(b.length / 2))}`,
  (a: string, b: string) => `${a.slice(0, 3)}${b.slice(-3)}`,
  (a: string, b: string) => `${b.slice(0, 2)}${a}`,
  (a: string, b: string) => `${a}${b.slice(-2)}ex`,
];

// Generate fusion name from two monarch names
function generateFusionName(monarchA: Monarch, monarchB: Monarch): string {
  const nameA = monarchA.name.replace(' Monarch', '').trim();
  const nameB = monarchB.name.replace(' Monarch', '').trim();
  const pattern = fusionNamePatterns[Math.floor((nameA.charCodeAt(0) + nameB.charCodeAt(0)) % fusionNamePatterns.length)];
  return pattern(nameA, nameB);
}

// Theme combination matrix for unique fusion themes
const themeMatrix: Record<string, Record<string, string>> = {
  Shadow: {
    Frost: 'Frozen Shadow',
    Plague: 'Necrotic Miasma',
    Stone: 'Obsidian Darkness',
    Beast: 'Shadow Pack',
    Iron: 'Dark Steel',
    Destruction: 'Annihilating Void',
    'White Flames': 'Black Flame',
    Transfiguration: 'Shadow Shift',
  },
  Frost: {
    Shadow: 'Frozen Shadow',
    Plague: 'Frozen Plague',
    Stone: 'Glacial Mountain',
    Beast: 'Arctic Hunt',
    Iron: 'Frozen Steel',
    Destruction: 'Absolute Zero',
    'White Flames': 'Frost Fire',
    Transfiguration: 'Ice Illusion',
  },
  Plague: {
    Shadow: 'Necrotic Miasma',
    Frost: 'Frozen Plague',
    Stone: 'Petrifying Toxin',
    Beast: 'Viral Swarm',
    Iron: 'Corrosive Metal',
    Destruction: 'Pandemic Ruin',
    'White Flames': 'Burning Plague',
    Transfiguration: 'Mutagenic Shift',
  },
  Stone: {
    Shadow: 'Obsidian Darkness',
    Frost: 'Glacial Mountain',
    Plague: 'Petrifying Toxin',
    Beast: 'Primordial Titan',
    Iron: 'Adamantine',
    Destruction: 'Seismic Devastation',
    'White Flames': 'Volcanic Core',
    Transfiguration: 'Living Statue',
  },
  Beast: {
    Shadow: 'Shadow Pack',
    Frost: 'Arctic Hunt',
    Plague: 'Viral Swarm',
    Stone: 'Primordial Titan',
    Iron: 'Armored Beast',
    Destruction: 'Apex Predator',
    'White Flames': 'Phoenix Chimera',
    Transfiguration: 'Shapeshifter',
  },
  Iron: {
    Shadow: 'Dark Steel',
    Frost: 'Frozen Steel',
    Plague: 'Corrosive Metal',
    Stone: 'Adamantine',
    Beast: 'Armored Beast',
    Destruction: 'War Machine',
    'White Flames': 'Molten Iron',
    Transfiguration: 'Living Armor',
  },
  Destruction: {
    Shadow: 'Annihilating Void',
    Frost: 'Absolute Zero',
    Plague: 'Pandemic Ruin',
    Stone: 'Seismic Devastation',
    Beast: 'Apex Predator',
    Iron: 'War Machine',
    'White Flames': 'Infernal Apocalypse',
    Transfiguration: 'Reality Shatter',
  },
  'White Flames': {
    Shadow: 'Black Flame',
    Frost: 'Frost Fire',
    Plague: 'Burning Plague',
    Stone: 'Volcanic Core',
    Beast: 'Phoenix Chimera',
    Iron: 'Molten Iron',
    Destruction: 'Infernal Apocalypse',
    Transfiguration: 'Flame Form',
  },
  Transfiguration: {
    Shadow: 'Shadow Shift',
    Frost: 'Ice Illusion',
    Plague: 'Mutagenic Shift',
    Stone: 'Living Statue',
    Beast: 'Shapeshifter',
    Iron: 'Living Armor',
    Destruction: 'Reality Shatter',
    'White Flames': 'Flame Form',
  },
};

function getFusionTheme(monarchA: Monarch, monarchB: Monarch): string {
  const themeA = monarchA.theme;
  const themeB = monarchB.theme;
  
  if (themeA === themeB) {
    return `Supreme ${themeA}`;
  }
  
  return themeMatrix[themeA]?.[themeB] || themeMatrix[themeB]?.[themeA] || `${themeA}-${themeB} Fusion`;
}

// Ability templates based on fusion combinations
const abilityTemplates = {
  offensive: [
    { name: '{theme} Strike', desc: 'Channel the power of {fusionTheme} into a devastating attack. Deal {damageA} + {damageB} damage to a target within 60 feet. On a critical hit, the target suffers additional effects based on the fusion elements.', action: '1 action' },
    { name: '{theme} Burst', desc: 'Release a {fusionTheme} explosion in a 20-foot radius centered on yourself. All creatures must make a saving throw or take fusion damage and be affected by the combined monarch powers.', action: '1 action', recharge: 'Short Rest' },
    { name: 'Dual Monarch Barrage', desc: 'Unleash a rapid sequence of attacks infused with both {themeA} and {themeB} energies. Make three attacks, each dealing mixed damage types.', action: '1 action' },
  ],
  defensive: [
    { name: '{theme} Aegis', desc: 'Manifest a protective barrier of {fusionTheme} energy. Gain resistance to {damageA} and {damageB} damage for 1 minute.', action: '1 bonus action', recharge: 'Long Rest' },
    { name: 'Fusion Ward', desc: 'The combined essence of two Monarchs shields you from harm. When you take damage, reduce it by an amount equal to your proficiency bonus + your highest ability modifier.', action: 'Reaction' },
    { name: 'Domain Overlap', desc: 'Create a 30-foot aura where the domains of {monarchA} and {monarchB} overlap, granting allies advantage on saving throws against effects from either damage type.', action: '1 action', recharge: 'Long Rest' },
  ],
  utility: [
    { name: '{theme} Sense', desc: 'Your fusion with {fusionTheme} grants supernatural awareness. You can detect creatures and objects related to either {themeA} or {themeB} within 120 feet.', action: '1 action' },
    { name: 'Dual Aspect', desc: 'Temporarily manifest physical traits from both {monarchA} and {monarchB}. Gain flying speed equal to your walking speed and advantage on {skillA} and {skillB} checks for 1 hour.', action: '1 action', recharge: 'Long Rest' },
    { name: 'Gemini Communion', desc: 'Enter a meditative state to commune with both Monarch essences within you. Learn information about creatures, objects, or locations related to either domain.', action: '10 minutes' },
  ],
  capstone: [
    { name: 'Perfect Fusion: {fusionName}', desc: 'Achieve perfect synchronization between your Job mastery, Path techniques, and dual Monarch powers. For 1 minute, all your abilities deal additional {damageA} and {damageB} damage, and you gain the signature abilities of both Monarchs simultaneously. This is the ultimate expression of the Gemini Protocol.', action: '1 action', recharge: 'Long Rest', isCapstone: true },
    { name: 'Sovereign Ascension', desc: 'Transcend mortal limitations through the Gemini Protocol. You become immune to {damageA} and {damageB} damage, your attacks ignore resistance, and you can use Monarch abilities without expending uses for 1 minute.', action: '1 bonus action', recharge: 'Long Rest', isCapstone: true },
  ],
  jobSynergy: [
    { name: '{job} of the Dual Throne', desc: 'Your {job} training synergizes with your Monarch fusion. When using {job} abilities, you may add {fusionTheme} effects to enhance their power.', action: 'Passive' },
    { name: '{path} Fusion Technique', desc: 'Apply the principles of {path} through the lens of your {fusionTheme} fusion. Gain a unique combat technique that combines your Path mastery with Monarch power.', action: '1 bonus action' },
  ],
};

function generateAbilityName(template: string, context: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

function generateAbilityDescription(template: string, context: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

export function generateSovereign(
  job: Job,
  path: Path,
  monarchA: Monarch,
  monarchB: Monarch
): GeneratedSovereign {
  const fusionTheme = getFusionTheme(monarchA, monarchB);
  const fusionName = generateFusionName(monarchA, monarchB);
  
  const context: Record<string, string> = {
    theme: fusionTheme,
    fusionTheme,
    fusionName,
    themeA: monarchA.theme,
    themeB: monarchB.theme,
    damageA: monarchA.damage_type || 'force',
    damageB: monarchB.damage_type || 'force',
    monarchA: monarchA.name,
    monarchB: monarchB.name,
    job: job.name,
    path: path.name.replace('Path of the ', ''),
    skillA: 'Intimidation',
    skillB: 'Perception',
  };

  const abilities: FusionAbility[] = [];
  
  // Generate abilities at different levels
  // Level 1: Basic fusion ability
  const offensiveTemplate = abilityTemplates.offensive[0];
  abilities.push({
    name: generateAbilityName(offensiveTemplate.name, context),
    description: generateAbilityDescription(offensiveTemplate.desc, context),
    level: 1,
    action_type: offensiveTemplate.action,
    recharge: offensiveTemplate.recharge || null,
    is_capstone: false,
    origin_sources: [job.name, monarchA.name, monarchB.name],
  });

  // Level 3: Job synergy ability
  const jobTemplate = abilityTemplates.jobSynergy[0];
  abilities.push({
    name: generateAbilityName(jobTemplate.name, context),
    description: generateAbilityDescription(jobTemplate.desc, context),
    level: 3,
    action_type: jobTemplate.action,
    recharge: null,
    is_capstone: false,
    origin_sources: [job.name, path.name],
  });

  // Level 5: Defensive ability
  const defensiveTemplate = abilityTemplates.defensive[0];
  abilities.push({
    name: generateAbilityName(defensiveTemplate.name, context),
    description: generateAbilityDescription(defensiveTemplate.desc, context),
    level: 5,
    action_type: defensiveTemplate.action,
    recharge: defensiveTemplate.recharge || null,
    is_capstone: false,
    origin_sources: [monarchA.name, monarchB.name],
  });

  // Level 7: Utility ability
  const utilityTemplate = abilityTemplates.utility[0];
  abilities.push({
    name: generateAbilityName(utilityTemplate.name, context),
    description: generateAbilityDescription(utilityTemplate.desc, context),
    level: 7,
    action_type: utilityTemplate.action,
    recharge: utilityTemplate.recharge || null,
    is_capstone: false,
    origin_sources: [monarchA.name, monarchB.name],
  });

  // Level 10: Path fusion technique
  const pathTemplate = abilityTemplates.jobSynergy[1];
  abilities.push({
    name: generateAbilityName(pathTemplate.name, context),
    description: generateAbilityDescription(pathTemplate.desc, context),
    level: 10,
    action_type: pathTemplate.action,
    recharge: null,
    is_capstone: false,
    origin_sources: [path.name, monarchA.name, monarchB.name],
  });

  // Level 14: Advanced offensive
  const advancedOffensive = abilityTemplates.offensive[1];
  abilities.push({
    name: generateAbilityName(advancedOffensive.name, context),
    description: generateAbilityDescription(advancedOffensive.desc, context),
    level: 14,
    action_type: advancedOffensive.action,
    recharge: advancedOffensive.recharge || null,
    is_capstone: false,
    origin_sources: [monarchA.name, monarchB.name],
  });

  // Level 17: Capstone ability
  const capstoneTemplate = abilityTemplates.capstone[0];
  abilities.push({
    name: generateAbilityName(capstoneTemplate.name, context),
    description: generateAbilityDescription(capstoneTemplate.desc, context),
    level: 17,
    action_type: capstoneTemplate.action,
    recharge: capstoneTemplate.recharge || null,
    is_capstone: true,
    origin_sources: [job.name, path.name, monarchA.name, monarchB.name],
  });

  // Level 20: Ultimate ascension
  const ultimateTemplate = abilityTemplates.capstone[1];
  abilities.push({
    name: ultimateTemplate.name,
    description: generateAbilityDescription(ultimateTemplate.desc, context),
    level: 20,
    action_type: ultimateTemplate.action,
    recharge: ultimateTemplate.recharge || null,
    is_capstone: true,
    origin_sources: [job.name, path.name, monarchA.name, monarchB.name],
  });

  const sovereignTitle = `${fusionTheme} ${job.name}`;
  
  return {
    name: `${fusionName} Sovereign`,
    title: sovereignTitle,
    description: `A Gemini Protocol fusion of ${job.name} (${path.name.replace('Path of the ', '')}) with the combined might of ${monarchA.title} and ${monarchB.title}. This permanent fusion creates a unique Sovereign that embodies the ${fusionTheme} aspect of power. Under Supreme Deity Jinwoo's blessing, this fusion transcends the limitations of either Monarch alone.`,
    fusion_theme: fusionTheme,
    fusion_description: `The ${fusionTheme} fusion combines ${monarchA.theme}'s mastery of ${monarchA.damage_type} with ${monarchB.theme}'s control over ${monarchB.damage_type}, filtered through ${job.name} combat doctrine and ${path.name.replace('Path of the ', '')} techniques. This creates a wholly unique combat style that rivals the original Monarchs in power.`,
    abilities,
    job,
    path,
    monarchA,
    monarchB,
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
