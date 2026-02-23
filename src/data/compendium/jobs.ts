// Jobs Compendium - System Ascendant Canonical 14-Job Roster
// Full 5e 1-20 progression per job, SA ability names in text fields

export interface Job {
  id: string;
  name: string;
  type: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  image: string;
  description: string;
  hitDie: string;
  primaryAbility: string;
  savingThrows: string[];
  skillChoices: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  awakeningFeatures: { name: string; description: string; level: number; }[];
  jobTraits: { name: string; description: string; type: 'passive' | 'active' | 'resistance' | 'immunity' | 'bonus'; frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day'; dc?: number; }[];
  abilityScoreImprovements: { strength?: number; dexterity?: number; constitution?: number; intelligence?: number; wisdom?: number; charisma?: number; };
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  speed: number;
  languages: string[];
  darkvision?: number;
  specialSenses?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  startingEquipment?: string[][];
  hitPointsAtFirstLevel?: string;
  hitPointsAtHigherLevels?: string;
  spellcasting?: { ability: string; focus?: string; cantripsKnown?: number[]; spellsKnown?: number[]; spellSlots?: Record<string, number[]>; };
  classFeatures?: { level: number; name: string; description: string; }[];
  abilities: string[];
  stats: { strength: number; dexterity: number; constitution: number; intelligence: number; wisdom: number; charisma: number; };
  primary_abilities: string[];
  source?: string;
}

const FULL_CASTER_SLOTS: Record<string, number[]> = {
  "1st": [2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  "2nd": [0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  "3rd": [0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  "4th": [0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3],
  "5th": [0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,3,3,3],
  "6th": [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2],
  "7th": [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2],
  "8th": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
  "9th": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
};
const HALF_CASTER_SLOTS: Record<string, number[]> = {
  "1st": [0,2,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  "2nd": [0,0,0,0,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  "3rd": [0,0,0,0,0,0,0,0,2,2,3,3,3,3,3,3,3,3,3,3],
  "4th": [0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,3],
  "5th": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2],
};
const PACT_CASTER_SLOTS: Record<string, number[]> = {
  "1st": [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  "2nd": [0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  "3rd": [0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  "4th": [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
  "5th": [0,0,0,0,0,0,0,0,2,2,3,3,3,3,3,3,4,4,4,4],
};

export const jobs: Job[] = [
  // 1. DESTROYER — Fighter
  {
    id: "destroyer", name: "Destroyer", type: "Job", rank: "C",
    description: "The System's answer to raw martial supremacy. Destroyers master every weapon and fighting style, leading the front line of every gate raid with relentless precision and unbreakable endurance.",
    hitDie: "1d10", primaryAbility: "Strength", savingThrows: ["Strength", "Vitality"],
    skillChoices: ["Acrobatics","Animal Handling","Athletics","History","Insight","Intimidation","Perception","Survival"],
    armorProficiencies: ["All armor","Shields"], weaponProficiencies: ["Simple weapons","Martial weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Relentless Endurance", description: "When reduced to 0 HP but not killed outright, drop to 1 HP instead. Once per long rest. Your awakened body refuses to fall.", level: 1 },
      { name: "Savage Criticals", description: "On a critical hit with a melee weapon, roll one additional weapon damage die. Your strikes carry System-enhanced force.", level: 1 },
      { name: "Combat Instinct", description: "System-awakened reflexes let you read combat flows. You sense hostile intent within 30 feet and cannot be surprised while conscious.", level: 1 },
      { name: "Adrenaline Surge", description: "Below half HP, your attacks deal an extra 1d4 damage for 1 minute (1d6 at 11th level).", level: 5 },
      { name: "Weapon Mastery", description: "+1 to attack and damage with all proficient weapons (+2 at 17th level).", level: 11 }
    ],
    jobTraits: [
      { name: "Gate Veteran", description: "Advantage on saves against fear from gate monsters.", type: "resistance" },
      { name: "Tactical Eye", description: "Bonus action: learn a creature's AC and HP percentage. Prof bonus uses per long rest.", type: "active", frequency: "long-rest" },
      { name: "Enduring Fighter", description: "Second Wind also grants temp HP equal to your Destroyer level.", type: "passive" }
    ],
    abilityScoreImprovements: { strength: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["bludgeoning from nonmagical attacks (while conscious)"],
    startingEquipment: [["Chain mail","Leather armor, longbow, 20 arrows"],["A martial weapon and shield","Two martial weapons"],["A light crossbow and 20 bolts","Two handaxes"],["A dungeoneer's pack","An explorer's pack"]],
    hitPointsAtFirstLevel: "10 + your Vitality modifier", hitPointsAtHigherLevels: "1d10 (or 6) + your Vitality modifier per level after 1st",
    classFeatures: [
      { level: 1, name: "Fighting Style", description: "Choose: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting." },
      { level: 1, name: "Second Wind", description: "Bonus action: regain 1d10 + Destroyer level HP. Once per short rest." },
      { level: 2, name: "Action Surge", description: "Take one additional action on your turn. Once per short rest (twice at 17th)." },
      { level: 3, name: "Martial Archetype", description: "Choose a path. Grants features at 3rd, 7th, 10th, 15th, and 18th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 6th, 8th, 12th, 14th, 16th, and 19th level." },
      { level: 5, name: "Extra Attack", description: "Attack twice (three at 11th, four at 20th) when taking the Attack action." },
      { level: 7, name: "Archetype Feature", description: "Feature from your Martial Archetype." },
      { level: 9, name: "Indomitable", description: "Reroll a failed save. Once per long rest (twice at 13th, three at 17th)." },
      { level: 10, name: "Archetype Feature", description: "Feature from your Martial Archetype." },
      { level: 15, name: "Archetype Feature", description: "Feature from your Martial Archetype." },
      { level: 18, name: "Archetype Feature", description: "Feature from your Martial Archetype." },
      { level: 20, name: "Apex Destroyer", description: "Four attacks per Attack action. Your martial prowess is unmatched." }
    ],
    abilities: ["Fighting Style","Second Wind","Action Surge","Extra Attack","Indomitable","Martial Archetype"],
    image: "/generated/compendium/jobs/warrior.webp",
    stats: { strength: 15, dexterity: 13, constitution: 14, intelligence: 10, wisdom: 12, charisma: 8 },
    primary_abilities: ["Strength","Vitality"], source: "System Ascendant Canon"
  },

  // 2. BERSERKER — Barbarian
  {
    id: "berserker", name: "Berserker", type: "Job", rank: "C",
    description: "Hunters who channel primal fury through System-enhanced rage. Unstoppable melee combatants who trade finesse for raw, overwhelming power — first into every gate, last standing.",
    hitDie: "1d12", primaryAbility: "Strength", savingThrows: ["Strength", "Vitality"],
    skillChoices: ["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"],
    armorProficiencies: ["Light armor","Medium armor","Shields"], weaponProficiencies: ["Simple weapons","Martial weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Primal Toughness", description: "HP maximum increases by 1 per Berserker level. Your awakening reinforced your body at a cellular level.", level: 1 },
      { name: "Poison Resilience", description: "Advantage on saves against poison. Your System-enhanced metabolism purges toxins rapidly.", level: 1 },
      { name: "Blood Fury", description: "When raging, your rage damage bonus is doubled but you have disadvantage on ability checks.", level: 3 },
      { name: "Primal Resilience", description: "While raging, resistance to all damage except psychic. Can't be KO'd while raging with 1+ HP.", level: 7 },
      { name: "System Fury", description: "While raging, weapon attacks are magical and deal extra 1d6 force damage.", level: 14 }
    ],
    jobTraits: [
      { name: "Danger Sense", description: "Advantage on Agility saves against effects you can see while not blinded/deafened/incapacitated.", type: "passive" },
      { name: "Feral Instinct", description: "Advantage on initiative. If surprised, act normally on first turn by entering rage.", type: "passive" },
      { name: "Intimidating Presence", description: "Frighten a creature within 30 feet (Sense save). Prof bonus uses per long rest.", type: "active", frequency: "long-rest" }
    ],
    abilityScoreImprovements: { strength: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["poison"],
    startingEquipment: [["A greataxe","Any martial melee weapon"],["Two handaxes","Any simple weapon"],["An explorer's pack and four javelins"]],
    hitPointsAtFirstLevel: "12 + your Vitality modifier", hitPointsAtHigherLevels: "1d12 (or 7) + your Vitality modifier per level after 1st",
    classFeatures: [
      { level: 1, name: "Rage", description: "Bonus action to rage: +2 melee damage (+3 at 9th, +4 at 16th), resistance to bludgeoning/piercing/slashing, advantage on Strength checks/saves. 2/long rest scaling to unlimited at 20th." },
      { level: 1, name: "Unarmored Defense", description: "Without armor: AC = 10 + Agility mod + Vitality mod. Can use a shield." },
      { level: 2, name: "Reckless Attack", description: "First attack on your turn: gain advantage on melee Strength attacks, but attacks against you have advantage until next turn." },
      { level: 3, name: "Primal Path", description: "Choose a path. Grants features at 3rd, 6th, 10th, and 14th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
      { level: 5, name: "Fast Movement", description: "+10 feet speed while not in heavy armor." },
      { level: 6, name: "Path Feature", description: "Feature from your Primal Path." },
      { level: 7, name: "Feral Instinct", description: "Advantage on initiative. Act on first turn if surprised by entering rage." },
      { level: 9, name: "Brutal Critical", description: "+1 weapon damage die on crits (+2 at 13th, +3 at 17th)." },
      { level: 10, name: "Path Feature", description: "Feature from your Primal Path." },
      { level: 11, name: "Relentless Rage", description: "At 0 HP while raging, Vitality save DC 10 (+5 each use) to drop to 1 HP instead." },
      { level: 14, name: "Path Feature", description: "Feature from your Primal Path." },
      { level: 15, name: "Persistent Rage", description: "Rage only ends if you fall unconscious or choose to end it." },
      { level: 18, name: "Indomitable Might", description: "Strength check total below your Strength score? Use the score instead." },
      { level: 20, name: "Primal Champion", description: "Strength and Vitality increase by 4 (max 24). The System forged you into the ultimate weapon." }
    ],
    abilities: ["Rage","Unarmored Defense","Reckless Attack","Primal Path","Extra Attack","Brutal Critical"],
    image: "/generated/compendium/jobs/berserker.webp",
    stats: { strength: 15, dexterity: 13, constitution: 14, intelligence: 8, wisdom: 12, charisma: 10 },
    primary_abilities: ["Strength","Vitality"], source: "System Ascendant Canon"
  },

  // 3. ASSASSIN — Rogue
  {
    id: "assassin", name: "Assassin", type: "Job", rank: "B",
    description: "System-enhanced stealth operatives who strike from shadows with lethal precision. Elite solo-clearers who navigate gates alone — avoiding what they can't kill and destroying what they can't avoid.",
    hitDie: "1d8", primaryAbility: "Agility", savingThrows: ["Agility", "Intelligence"],
    skillChoices: ["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"],
    armorProficiencies: ["Light armor"], weaponProficiencies: ["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], toolProficiencies: ["Thieves' tools"],
    awakeningFeatures: [
      { name: "Shadow Attunement", description: "Advantage on saves against being charmed. Magic cannot put you to sleep. Your shadow-awakened mind is shielded from mental intrusion.", level: 1 },
      { name: "Shadow Step", description: "Teleport up to 30 feet to dim light/darkness. Advantage on first melee attack. Prof bonus uses per long rest.", level: 3 },
      { name: "Lethal Precision", description: "Sneak Attack deals extra 1d6 when you have advantage (2d6 at 13th).", level: 7 },
      { name: "Death Mark", description: "Bonus action: mark a creature. Crits on 19-20 against it for 1 minute. Once per long rest.", level: 14 }
    ],
    jobTraits: [
      { name: "Shadow Awareness", description: "See in dim light as bright within 60 feet. Advantage on hearing-based Perception.", type: "passive" },
      { name: "Evasive Instinct", description: "Reaction: halve attack damage. Agility mod uses per long rest.", type: "active", frequency: "long-rest" },
      { name: "Silent Movement", description: "No sound when moving, no tracks. Advantage on Stealth in all conditions.", type: "passive" }
    ],
    abilityScoreImprovements: { dexterity: 2, intelligence: 1 }, size: "medium", speed: 30, languages: ["Common","Thieves' Cant"], darkvision: 120,
    conditionImmunities: ["magical sleep"],
    startingEquipment: [["A rapier","A shortsword"],["A shortbow and 20 arrows","A shortsword"],["A burglar's pack","A dungeoneer's pack","An explorer's pack"],["Leather armor, two daggers, thieves' tools"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    classFeatures: [
      { level: 1, name: "Expertise", description: "Double proficiency on two skill/tool proficiencies. Two more at 6th level." },
      { level: 1, name: "Sneak Attack", description: "1d6 extra damage (scaling to 10d6 at 19th) with finesse/ranged weapon when you have advantage or ally adjacent to target." },
      { level: 1, name: "Thieves' Cant", description: "Secret hunter underworld language of jargon, code words, and hidden signals." },
      { level: 2, name: "Cunning Action", description: "Bonus action to Dash, Disengage, or Hide." },
      { level: 3, name: "Roguish Archetype", description: "Choose a path. Grants features at 3rd, 9th, 13th, and 17th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 10th, 12th, 16th, and 19th level." },
      { level: 5, name: "Uncanny Dodge", description: "Reaction: halve damage from an attacker you can see." },
      { level: 7, name: "Evasion", description: "Agility save for half damage: no damage on success, half on failure." },
      { level: 9, name: "Archetype Feature", description: "Feature from your Roguish Archetype." },
      { level: 11, name: "Reliable Talent", description: "Any proficient ability check: treat d20 rolls of 9 or lower as 10." },
      { level: 13, name: "Archetype Feature", description: "Feature from your Roguish Archetype." },
      { level: 14, name: "Blindsense", description: "Aware of hidden/invisible creatures within 10 feet if you can hear." },
      { level: 15, name: "Slippery Mind", description: "Gain proficiency in Sense saving throws." },
      { level: 17, name: "Archetype Feature", description: "Feature from your Roguish Archetype." },
      { level: 18, name: "Elusive", description: "No attack has advantage against you while you aren't incapacitated." },
      { level: 20, name: "Stroke of Luck", description: "Turn a miss into a hit, or treat a failed check as 20. Once per short rest." }
    ],
    abilities: ["Expertise","Sneak Attack","Cunning Action","Uncanny Dodge","Evasion","Roguish Archetype"],
    image: "/generated/compendium/jobs/assassin.webp",
    stats: { strength: 10, dexterity: 15, constitution: 12, intelligence: 14, wisdom: 13, charisma: 8 },
    primary_abilities: ["Agility","Intelligence"], source: "System Ascendant Canon"
  },

  // 4. STRIKER — Monk
  {
    id: "striker", name: "Striker", type: "Job", rank: "A",
    description: "A hunter whose System awakening hyper-evolved their nervous system, granting superhuman speed, reflexes, and kinetic force channeling. Strikers fight with their bodies as weapons, channeling ki through devastating unarmed strikes.",
    hitDie: "1d8", primaryAbility: "Agility", savingThrows: ["Strength", "Agility"],
    skillChoices: ["Acrobatics","Athletics","History","Insight","Religion","Stealth"],
    armorProficiencies: [], weaponProficiencies: ["Simple weapons","Shortswords"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Awakened Reflexes", description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll and must use the new result. Your hyper-evolved nervous system corrects errors instantly.", level: 1 },
      { name: "Nimble Form", description: "You can move through the space of any creature that is one size larger than you. Your body flows like water around obstacles.", level: 1 },
      { name: "Ki Awakening", description: "Your body awakens to ki energy flow. Sense ki auras of living creatures and channel ki for strikes and movement.", level: 1 },
      { name: "Body Harmony", description: "Perfect mind-body harmony. Control autonomic functions at will; movements are perfectly efficient.", level: 3 },
      { name: "Elemental Attunement", description: "Channel elements through ki: fire fists, wind movement, earth defense, water healing.", level: 7 }
    ],
    jobTraits: [
      { name: "Ki Sight", description: "See ki auras, emotional/physical states. Sense ki users within 120 feet. See invisible by ki signature.", type: "passive" },
      { name: "Perfect Balance", description: "Cannot be knocked prone. Can walk on any surface including liquids while moving.", type: "resistance" },
      { name: "Deflect Projectiles", description: "Reaction: deflect ranged weapons, reduce by 1d10+AGI+level. If 0, catch and throw back.", type: "active", frequency: "at-will" }
    ],
    abilityScoreImprovements: { dexterity: 2, wisdom: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    startingEquipment: [["A shortsword","Any simple weapon"],["A dungeoneer's pack","An explorer's pack"],["10 darts"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    classFeatures: [
      { level: 1, name: "Unarmored Defense", description: "No armor, no shield: AC = 10 + Agility mod + Sense mod." },
      { level: 1, name: "Martial Arts", description: "Use Agility for monk weapons/unarmed. Unarmed: d4 (d6 at 5th, d8 at 11th, d10 at 17th). Bonus action unarmed strike after Attack." },
      { level: 2, name: "Ki", description: "Ki points = Striker level, short rest recharge. Flurry of Blows, Patient Defense, Step of the Wind." },
      { level: 2, name: "Unarmored Movement", description: "+10 ft speed without armor (+15 at 6th, +20 at 10th, +25 at 14th, +30 at 18th). Run on walls/water at 9th." },
      { level: 3, name: "Monastic Tradition", description: "Choose a path. Grants features at 3rd, 6th, 11th, and 17th level." },
      { level: 3, name: "Deflect Missiles", description: "Reaction: reduce ranged damage by 1d10+AGI+level. If 0, catch and throw back (1 ki)." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 4, name: "Slow Fall", description: "Reaction: reduce fall damage by 5 × Striker level." },
      { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
      { level: 5, name: "Stunning Strike", description: "On melee hit, spend 1 ki: target Vitality save or stunned until end of your next turn." },
      { level: 6, name: "Ki-Empowered Strikes", description: "Unarmed strikes count as magical." },
      { level: 7, name: "Evasion", description: "Agility save for half: no damage on success, half on failure." },
      { level: 7, name: "Stillness of Mind", description: "Action: end one charmed or frightened effect on yourself." },
      { level: 10, name: "Purity of Body", description: "Immune to disease and poison." },
      { level: 13, name: "Tongue of the Sun and Moon", description: "Understand all spoken languages; any language-knowing creature understands you." },
      { level: 14, name: "Diamond Soul", description: "Proficiency in all saves. Spend 1 ki to reroll a failed save." },
      { level: 15, name: "Timeless Body", description: "No aging frailty, can't be magically aged, no need for food/water." },
      { level: 18, name: "Empty Body", description: "4 ki: invisible 1 min + resistance to all but force. 8 ki: Astral Projection." },
      { level: 20, name: "Perfect Self", description: "Roll initiative with 0 ki: regain 4. The System perfected your body and spirit." }
    ],
    abilities: ["Unarmored Defense","Martial Arts","Ki","Unarmored Movement","Monastic Tradition","Stunning Strike"],
    image: "/generated/compendium/jobs/monk.webp",
    stats: { strength: 13, dexterity: 15, constitution: 14, intelligence: 10, wisdom: 14, charisma: 8 },
    primary_abilities: ["Agility","Sense"], source: "System Ascendant Canon"
  },

  // 5. MAGE — Wizard
  {
    id: "mage", name: "Mage", type: "Job", rank: "C",
    description: "A hunter whose System awakening unlocked the ability to study and manipulate raw magical energy. Mages are the most versatile spellcasters, learning spells from a vast arcane tradition to reshape the battlefield.",
    hitDie: "1d6", primaryAbility: "Intelligence", savingThrows: ["Intelligence", "Sense"],
    skillChoices: ["Arcana","History","Insight","Investigation","Medicine","Religion"],
    armorProficiencies: [], weaponProficiencies: ["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Arcane Cunning", description: "Advantage on Intelligence, Sense, and Presence saving throws against spells and other magical effects. Your awakened mind is fortified against magical interference.", level: 1 },
      { name: "Arcane Awakening", description: "Sense magical energy, identify spell components, and understand magical phenomena instinctively.", level: 1 },
      { name: "Essence Weaving", description: "Weave raw magical energy into complex spells. Combine spell effects and amplify power through concentration.", level: 3 },
      { name: "Spell Matrix Mastery", description: "Create spell matrices: instant-cast spells, delayed effects, and real-time enemy magic analysis.", level: 11 }
    ],
    jobTraits: [
      { name: "Arcane Sight", description: "Perceive magical auras, spell preparations, and essence concentrations. Auto-identify spell power levels.", type: "passive" },
      { name: "Magical Adaptation", description: "Resistance to spell damage and advantage on saves against spells.", type: "resistance" },
      { name: "Metamagic Infusion", description: "Enhance a spell: double damage, extend duration, or add targets. INT mod uses per long rest.", type: "active", frequency: "long-rest" }
    ],
    abilityScoreImprovements: { intelligence: 2, wisdom: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["psychic"],
    startingEquipment: [["A quarterstaff","A dagger"],["A component pouch","An arcane focus"],["A scholar's pack","An explorer's pack"],["A spellbook"]],
    hitPointsAtFirstLevel: "6 + your Vitality modifier", hitPointsAtHigherLevels: "1d6 (or 4) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Intelligence", focus: "Arcane focus or spellbook",
      cantripsKnown: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Arcane Casting", description: "Cast Mage spells using Intelligence. Prepare spells from your spellbook each day." },
      { level: 1, name: "Arcane Recovery", description: "Short rest: recover spell slots with combined level ≤ half Mage level (rounded up). No 6th+ slots. Once per day." },
      { level: 2, name: "Arcane Tradition", description: "Choose a school of magic. Halved copy cost/time for tradition spells. Features at 2nd, 6th, 10th, and 14th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 6, name: "Tradition Feature", description: "Feature from your Arcane Tradition." },
      { level: 10, name: "Tradition Feature", description: "Feature from your Arcane Tradition." },
      { level: 14, name: "Tradition Feature", description: "Feature from your Arcane Tradition." },
      { level: 18, name: "Spell Mastery", description: "Choose one 1st-level and one 2nd-level spell. Cast them at lowest level without a slot." },
      { level: 20, name: "Signature Spells", description: "Two 3rd-level spells always prepared; cast each once at 3rd level without a slot per short rest." }
    ],
    abilities: ["Arcane Casting","Arcane Recovery","Spell Mastery","Signature Spells","Arcane Tradition"],
    image: "/generated/compendium/jobs/mage.webp",
    stats: { strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 },
    primary_abilities: ["Intelligence","Sense"], source: "System Ascendant Canon"
  },

  // 6. ESPER — Sorcerer
  {
    id: "esper", name: "Esper", type: "Job", rank: "B",
    description: "Hunters born with innate magical power the System amplifies to terrifying levels. Espers don't study magic — it flows through their blood and emotions. They reshape spells on the fly through sheer force of Presence.",
    hitDie: "1d6", primaryAbility: "Presence", savingThrows: ["Vitality", "Presence"],
    skillChoices: ["Arcana","Deception","Insight","Intimidation","Persuasion","Religion"],
    armorProficiencies: [], weaponProficiencies: ["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Sorcerous Resilience", description: "HP maximum increases by 1 per Esper level. Your body is saturated with innate magic that reinforces your vitality.", level: 1 },
      { name: "Innate Surge", description: "On casting 1st+ spell, roll d20; on 1, roll Wild Magic Surge table.", level: 1 },
      { name: "Psychic Overflow", description: "When spending sorcery points to modify a spell, add Presence mod as bonus damage to one target.", level: 6 },
      { name: "Reality Warp", description: "Reroll all damage dice for a spell, take higher per die. Once per long rest.", level: 14 }
    ],
    jobTraits: [
      { name: "Magical Intuition", description: "Sense magical effects within 30 feet without action. Know the school of any observed spell.", type: "passive" },
      { name: "Innate Resistance", description: "Advantage on saves vs charm; magic can't put you to sleep.", type: "resistance" },
      { name: "Empower Spell", description: "Spend 1 sorcery point: impose disadvantage on first save against your spell.", type: "active", frequency: "at-will" }
    ],
    abilityScoreImprovements: { charisma: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["force"],
    startingEquipment: [["A light crossbow and 20 bolts","Any simple weapon"],["A component pouch","An arcane focus"],["A dungeoneer's pack","An explorer's pack"],["Two daggers"]],
    hitPointsAtFirstLevel: "6 + your Vitality modifier", hitPointsAtHigherLevels: "1d6 (or 4) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Presence", focus: "Arcane focus",
      cantripsKnown: [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
      spellsKnown: [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Spellcasting", description: "Cast Esper spells using Presence. Known caster: you know a fixed number of spells." },
      { level: 1, name: "Sorcerous Origin", description: "Choose your innate power source. Features at 1st, 6th, 14th, and 18th level." },
      { level: 2, name: "Font of Magic", description: "Sorcery points = Esper level. Convert slots ↔ sorcery points." },
      { level: 3, name: "Metamagic", description: "Choose 2 options (Careful, Distant, Empowered, Extended, Heightened, Quickened, Subtle, Twinned). More at 10th and 17th." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 6, name: "Origin Feature", description: "Feature from your Sorcerous Origin." },
      { level: 14, name: "Origin Feature", description: "Feature from your Sorcerous Origin." },
      { level: 18, name: "Origin Feature", description: "Feature from your Sorcerous Origin." },
      { level: 20, name: "Sorcerous Restoration", description: "Regain 4 sorcery points on short rest. The System's power flows endlessly through you." }
    ],
    abilities: ["Spellcasting","Sorcerous Origin","Font of Magic","Metamagic","Sorcerous Restoration"],
    image: "/generated/compendium/jobs/tank.webp",
    stats: { strength: 8, dexterity: 13, constitution: 14, intelligence: 10, wisdom: 12, charisma: 15 },
    primary_abilities: ["Presence","Vitality"], source: "System Ascendant Canon"
  },

  // 7. REVENANT — Wizard (Necromancy)
  {
    id: "revenant", name: "Revenant", type: "Job", rank: "A",
    description: "Hunters who survived death inside a gate and returned changed — connected to the boundary between life and death. Revenants command necrotic energy, raise fallen monsters as servants, and grow stronger the closer they are to death.",
    hitDie: "1d6", primaryAbility: "Intelligence", savingThrows: ["Intelligence", "Sense"],
    skillChoices: ["Arcana","History","Insight","Investigation","Medicine","Religion"],
    armorProficiencies: [], weaponProficiencies: ["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Undying Nature", description: "You don't need to eat, drink, or breathe. You age at 1/10th the normal rate. Your body exists between life and death.", level: 1 },
      { name: "Death's Threshold", description: "Advantage on death saves. When stabilized, regain 1 HP instead of 0.", level: 1 },
      { name: "Corpse Command", description: "Raised undead gain extra HP = Revenant level and add proficiency bonus to damage.", level: 6 },
      { name: "Life Drain Mastery", description: "When dealing necrotic spell damage, regain HP = half necrotic dealt. Once per turn.", level: 14 }
    ],
    jobTraits: [
      { name: "Deathsight", description: "Sense undead within 120 ft. Know exact HP of creatures below half max that you can see.", type: "passive" },
      { name: "Necrotic Resistance", description: "Resistance to necrotic damage. Immune to HP max reduction effects.", type: "resistance" },
      { name: "Grave Whispers", description: "Cast Speak with Dead at will without a slot. The dead answer truthfully.", type: "active", frequency: "at-will" }
    ],
    abilityScoreImprovements: { intelligence: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 120,
    damageResistances: ["necrotic"],
    conditionImmunities: ["frightened"],
    startingEquipment: [["A quarterstaff","A dagger"],["A component pouch","An arcane focus"],["A scholar's pack","An explorer's pack"],["A spellbook"]],
    hitPointsAtFirstLevel: "6 + your Vitality modifier", hitPointsAtHigherLevels: "1d6 (or 4) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Intelligence", focus: "Arcane focus or spellbook",
      cantripsKnown: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Necrotic Casting", description: "Cast Revenant spells using Intelligence. Prepare spells from your spellbook with a focus on necromancy." },
      { level: 1, name: "Arcane Recovery", description: "Short rest: recover spell slots with combined level ≤ half Revenant level. No 6th+. Once per day." },
      { level: 2, name: "Necromancy Specialization", description: "Half cost/time for necromancy spells. On necromancy kill, gain temp HP = 2× spell level + INT mod." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 6, name: "Undead Thralls", description: "Animate Dead targets +1 corpse. Raised undead: +Revenant level HP, +prof bonus damage." },
      { level: 10, name: "Inured to Undeath", description: "Resistance to necrotic damage. HP maximum cannot be reduced." },
      { level: 14, name: "Command Undead", description: "Action: target undead within 60 ft makes Presence save or obeys your commands." },
      { level: 18, name: "Spell Mastery", description: "Choose one 1st and one 2nd-level spell. Cast at lowest level without a slot." },
      { level: 20, name: "Death Sovereign", description: "Two 3rd-level signature spells always prepared; cast each once without slot per short rest. You command death itself." }
    ],
    abilities: ["Necrotic Casting","Arcane Recovery","Necromancy Specialization","Undead Thralls","Command Undead"],
    image: "/generated/compendium/jobs/necromancer.webp",
    stats: { strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 },
    primary_abilities: ["Intelligence","Vitality"], source: "System Ascendant Canon"
  },

  // 8. SUMMONER — Druid
  {
    id: "summoner", name: "Summoner", type: "Job", rank: "B",
    description: "Hunters who channel the System's connection to primal nature and gate ecology. Summoners shapeshift into beasts, command natural forces, and summon creatures — bridging the hunter world and the wild ecosystems inside gates.",
    hitDie: "1d8", primaryAbility: "Sense", savingThrows: ["Intelligence", "Sense"],
    skillChoices: ["Arcana","Animal Handling","Insight","Medicine","Nature","Perception","Religion","Survival"],
    armorProficiencies: ["Light armor","Medium armor","Shields (non-metal)"],
    weaponProficiencies: ["Clubs","Daggers","Darts","Javelins","Maces","Quarterstaffs","Scimitars","Sickles","Slings","Spears"], toolProficiencies: ["Herbalism kit"],
    awakeningFeatures: [
      { name: "Primal Body", description: "Advantage on saves against poison and disease. Your body is attuned to natural cycles and purges foreign agents instinctively.", level: 1 },
      { name: "Gate Ecology Sense", description: "Communicate with beasts/plants. Sense gates within 1 mile and determine rank by ecosystem behavior.", level: 1 },
      { name: "Enhanced Wild Shape", description: "Wild Shape forms gain temp HP = Summoner level. Maintain concentration in beast form.", level: 6 },
      { name: "Primal Summoning", description: "Conjured creatures gain extra HP = prof bonus and deal extra 1d4 force damage.", level: 10 }
    ],
    jobTraits: [
      { name: "Nature's Voice", description: "Speak with Animals and Speak with Plants at all times.", type: "passive" },
      { name: "Natural Resistance", description: "Advantage on saves vs poison. Resistance to poison damage.", type: "resistance" },
      { name: "Wild Companion", description: "Expend Wild Shape use to cast Find Familiar (fey form) without components.", type: "active", frequency: "short-rest" }
    ],
    abilityScoreImprovements: { wisdom: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common","Druidic"], darkvision: 60,
    damageResistances: ["poison"],
    startingEquipment: [["A wooden shield","Any simple weapon"],["A scimitar","Any simple melee weapon"],["Leather armor, explorer's pack, druidic focus"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Sense", focus: "Druidic focus",
      cantripsKnown: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Druidic", description: "Know the secret Druidic language. Leave and spot hidden messages in it." },
      { level: 1, name: "Spellcasting", description: "Cast Summoner spells using Sense. Prepare from the full Summoner list each day." },
      { level: 2, name: "Wild Shape", description: "Assume beast form 2/short rest. Max CR 1/4 at 2nd (CR 1/2 swim at 4th, CR 1 fly at 8th)." },
      { level: 2, name: "Druid Circle", description: "Choose a circle. Features at 2nd, 6th, 10th, and 14th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 6, name: "Circle Feature", description: "Feature from your Druid Circle." },
      { level: 10, name: "Circle Feature", description: "Feature from your Druid Circle." },
      { level: 14, name: "Circle Feature", description: "Feature from your Druid Circle." },
      { level: 18, name: "Timeless Body", description: "Age 10× slower. Cannot be magically aged." },
      { level: 18, name: "Beast Spells", description: "Cast spells in Wild Shape (no costly/consumed material components)." },
      { level: 20, name: "Archsummoner", description: "Unlimited Wild Shape uses. Ignore V/S components and non-costly material components. Primal link absolute." }
    ],
    abilities: ["Druidic","Spellcasting","Wild Shape","Druid Circle","Beast Spells"],
    image: "/generated/compendium/jobs/summoner.webp",
    stats: { strength: 10, dexterity: 12, constitution: 14, intelligence: 13, wisdom: 15, charisma: 8 },
    primary_abilities: ["Sense","Vitality"], source: "System Ascendant Canon"
  },

  // 9. HERALD — Cleric
  {
    id: "herald", name: "Herald", type: "Job", rank: "B",
    description: "Hunters chosen as conduits for divine System energy. Heralds heal, protect, and smite — the backbone of any raid party. Their power comes from faith in the System itself, channeling its will through prayer and divine symbols.",
    hitDie: "1d8", primaryAbility: "Sense", savingThrows: ["Sense", "Presence"],
    skillChoices: ["History","Insight","Medicine","Persuasion","Religion"],
    armorProficiencies: ["Light armor","Medium armor","Shields"], weaponProficiencies: ["Simple weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Healing Hands", description: "As an action, touch a creature and restore HP equal to your Herald level. Once per long rest. Your hands glow with the System's restorative energy.", level: 1 },
      { name: "Divine Conduit", description: "Action touch: heal 1d8 + Sense mod HP. Prof bonus uses per long rest.", level: 1 },
      { name: "Sacred Aura", description: "Allies within 10 ft gain +1 to saves (+2 at 11th). Range 30 ft at 18th.", level: 6 },
      { name: "Divine Intervention", description: "Call upon the System for aid. Automatic at 20th level.", level: 10 }
    ],
    jobTraits: [
      { name: "System Sense", description: "Sense celestial, fiend, or undead within 60 ft. Know type but not identity.", type: "passive" },
      { name: "Divine Resilience", description: "Advantage on saves vs necrotic damage and HP max reduction effects.", type: "resistance" },
      { name: "Turn Undead", description: "Action: undead within 30 ft Sense save or turned 1 min. Destroy low-CR undead at 5th+.", type: "active", frequency: "short-rest" }
    ],
    abilityScoreImprovements: { wisdom: 2, charisma: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["necrotic","radiant"],
    startingEquipment: [["A mace","A warhammer (if proficient)"],["Scale mail","Leather armor","Chain mail (if proficient)"],["A light crossbow and 20 bolts","Any simple weapon"],["A priest's pack","An explorer's pack"],["A shield and holy symbol"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Sense", focus: "Holy symbol",
      cantripsKnown: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Spellcasting", description: "Cast Herald spells using Sense. Prepare from the full Herald list each day." },
      { level: 1, name: "Divine Domain", description: "Choose a domain. Bonus spells and features at 1st, 2nd, 6th, 8th, and 17th level." },
      { level: 2, name: "Channel Divinity", description: "Channel divine energy: Turn Undead + domain option. 1/short rest (2 at 6th, 3 at 18th)." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Destroy Undead", description: "Turn Undead destroys undead ≤ CR threshold (1/2 at 5th, 1 at 8th, 2 at 11th, 3 at 14th, 4 at 17th)." },
      { level: 6, name: "Domain Feature", description: "Feature from your Divine Domain." },
      { level: 8, name: "Domain Feature", description: "Feature from your Divine Domain (typically Divine Strike or Potent Spellcasting)." },
      { level: 10, name: "Divine Intervention", description: "Roll ≤ Herald level on d100 for System intervention. One attempt per long rest." },
      { level: 17, name: "Domain Feature", description: "Final feature from your Divine Domain." },
      { level: 20, name: "System's Chosen", description: "Divine Intervention succeeds automatically. The System answers without fail." }
    ],
    abilities: ["Spellcasting","Divine Domain","Channel Divinity","Turn Undead","Divine Intervention"],
    image: "/generated/compendium/jobs/healer.webp",
    stats: { strength: 12, dexterity: 10, constitution: 14, intelligence: 13, wisdom: 15, charisma: 8 },
    primary_abilities: ["Sense","Presence"], source: "System Ascendant Canon"
  },

  // 10. CONTRACTOR — Warlock
  {
    id: "contractor", name: "Contractor", type: "Job", rank: "B",
    description: "Hunters who broker pacts with extradimensional gate entities for power. Contractors negotiate binding agreements with demons, fey lords, and elder aberrations — trading service for otherworldly abilities. Limited but potent magic, recharging rapidly.",
    hitDie: "1d8", primaryAbility: "Presence", savingThrows: ["Sense", "Presence"],
    skillChoices: ["Arcana","Deception","History","Intimidation","Investigation","Nature","Religion"],
    armorProficiencies: ["Light armor"], weaponProficiencies: ["Simple weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Otherworldly Fortitude", description: "Advantage on saves against being charmed by any creature. Your patron's mark shields your mind from lesser influence.", level: 1 },
      { name: "Pact Sense", description: "Sense otherworldly entities and active pacts within 100 ft. Determine pact type by concentrating 1 minute.", level: 1 },
      { name: "Eldritch Surge", description: "When you hit with Eldritch Blast, push the target 10 ft and deal extra Presence mod force damage.", level: 5 },
      { name: "Patron's Gift", description: "Your patron grants you a permanent boon: resistance to one damage type of your choice, changeable on long rest.", level: 14 }
    ],
    jobTraits: [
      { name: "Dark Vision", description: "See through magical and nonmagical darkness up to 120 feet.", type: "passive" },
      { name: "Pact Resilience", description: "Advantage on saves against being charmed by fiends, fey, or aberrations.", type: "resistance" },
      { name: "Entity Bargain", description: "Invoke your patron as a bonus action for advantage on one check/save/attack. Once per short rest.", type: "active", frequency: "short-rest" }
    ],
    abilityScoreImprovements: { charisma: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 120,
    damageResistances: ["fire"],
    startingEquipment: [["A light crossbow and 20 bolts","Any simple weapon"],["A component pouch","An arcane focus"],["A scholar's pack","A dungeoneer's pack"],["Leather armor, any simple weapon, and two daggers"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Presence", focus: "Arcane focus",
      cantripsKnown: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellsKnown: [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
      spellSlots: { ...PACT_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Pact Magic", description: "Cast Contractor spells using Presence. All pact slots are the same level and recharge on short rest." },
      { level: 1, name: "Otherworldly Patron", description: "Choose a patron: Archfey, Fiend, Great Old One, etc. Features at 1st, 6th, 10th, and 14th level." },
      { level: 2, name: "Eldritch Invocations", description: "Gain 2 invocations (more at higher levels). Customize your pact abilities. Can swap one on level up." },
      { level: 3, name: "Pact Boon", description: "Choose: Pact of the Chain (familiar), Pact of the Blade (weapon), or Pact of the Tome (cantrips)." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 6, name: "Patron Feature", description: "Feature from your Otherworldly Patron." },
      { level: 10, name: "Patron Feature", description: "Feature from your Otherworldly Patron." },
      { level: 11, name: "Mystic Arcanum (6th)", description: "Choose a 6th-level spell. Cast once per long rest without a slot. 7th at 13th, 8th at 15th, 9th at 17th." },
      { level: 14, name: "Patron Feature", description: "Feature from your Otherworldly Patron." },
      { level: 20, name: "Eldritch Master", description: "Spend 1 minute entreating your patron to regain all pact magic slots. Once per long rest." }
    ],
    abilities: ["Pact Magic","Otherworldly Patron","Eldritch Invocations","Pact Boon","Mystic Arcanum"],
    image: "/generated/compendium/jobs/warlock.webp",
    stats: { strength: 8, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 15 },
    primary_abilities: ["Presence","Vitality"], source: "System Ascendant Canon"
  },

  // 11. STALKER — Ranger
  {
    id: "stalker", name: "Stalker", type: "Job", rank: "B",
    description: "Hunters who specialize in tracking, survival, and eliminating specific monster types within gates. Stalkers combine martial prowess with primal magic, becoming the ultimate predators in any environment.",
    hitDie: "1d10", primaryAbility: "Agility", savingThrows: ["Strength", "Agility"],
    skillChoices: ["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"],
    armorProficiencies: ["Light armor","Medium armor","Shields"], weaponProficiencies: ["Simple weapons","Martial weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Predator's Body", description: "Advantage on Perception checks that rely on hearing or smell. You can attempt to Hide even when only lightly obscured by foliage, rain, mist, or other natural phenomena.", level: 1 },
      { name: "Fleet of Foot", description: "Base walking speed is 35 ft. Your awakening enhanced your legs for pursuit and escape across any terrain.", level: 1 },
      { name: "Prey Sense", description: "Choose a favored enemy type. You sense creatures of that type within 120 ft and have advantage on Survival checks to track them.", level: 1 },
      { name: "Terrain Mastery", description: "In your favored terrain, you can't be surprised, leave no tracks, and move at full speed through difficult terrain.", level: 3 },
      { name: "Apex Predator", description: "Your first attack each turn against your favored enemy deals extra damage equal to your proficiency bonus.", level: 11 }
    ],
    jobTraits: [
      { name: "Gate Navigator", description: "You have advantage on saves against environmental hazards inside gates and can find safe paths instinctively.", type: "passive" },
      { name: "Primeval Awareness", description: "Spend a spell slot to sense favored enemies within 1 mile (6 miles in favored terrain) for 1 minute per slot level.", type: "active", frequency: "at-will" },
      { name: "Camouflage", description: "You can spend 1 minute to make yourself invisible while motionless against a natural surface. Lasts until you move.", type: "active", frequency: "at-will" }
    ],
    abilityScoreImprovements: { dexterity: 2, wisdom: 1 }, size: "medium", speed: 35, languages: ["Common"], darkvision: 60,
    specialSenses: ["Keen Hearing and Smell"],
    startingEquipment: [["Scale mail","Leather armor"],["Two shortswords","Two simple melee weapons"],["A dungeoneer's pack","An explorer's pack"],["A longbow and 20 arrows"]],
    hitPointsAtFirstLevel: "10 + your Vitality modifier", hitPointsAtHigherLevels: "1d10 (or 6) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Sense", focus: "None (no focus needed)",
      spellsKnown: [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
      spellSlots: { ...HALF_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Favored Enemy", description: "Choose a favored enemy type. Advantage on Survival to track and Intelligence to recall info about them. Choose additional at 6th and 14th." },
      { level: 1, name: "Natural Explorer", description: "Choose a favored terrain. Travel benefits and advantages in that terrain. Additional at 6th and 10th." },
      { level: 2, name: "Fighting Style", description: "Choose: Archery, Defense, Dueling, or Two-Weapon Fighting." },
      { level: 2, name: "Spellcasting", description: "Cast Stalker spells using Sense. Known caster with half-caster progression." },
      { level: 3, name: "Ranger Archetype", description: "Choose a path. Features at 3rd, 7th, 11th, and 15th level." },
      { level: 3, name: "Primeval Awareness", description: "Spend a spell slot to sense favored enemies within 1 mile (6 in favored terrain)." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
      { level: 7, name: "Archetype Feature", description: "Feature from your Ranger Archetype." },
      { level: 8, name: "Land's Stride", description: "Move through nonmagical difficult terrain without extra cost. Advantage on saves vs magically created plants." },
      { level: 10, name: "Hide in Plain Sight", description: "Spend 1 minute to camouflage. +10 to Stealth while motionless against a surface." },
      { level: 11, name: "Archetype Feature", description: "Feature from your Ranger Archetype." },
      { level: 14, name: "Vanish", description: "Hide as a bonus action. Can't be tracked nonmagically unless you choose." },
      { level: 15, name: "Archetype Feature", description: "Feature from your Ranger Archetype." },
      { level: 18, name: "Feral Senses", description: "No disadvantage attacking invisible creatures. Aware of invisible creatures within 30 ft." },
      { level: 20, name: "Foe Slayer", description: "Once per turn, add Sense mod to attack or damage roll against a favored enemy. The ultimate hunter." }
    ],
    abilities: ["Favored Enemy","Natural Explorer","Fighting Style","Spellcasting","Ranger Archetype","Extra Attack"],
    image: "/generated/compendium/jobs/ranger.webp",
    stats: { strength: 12, dexterity: 15, constitution: 13, intelligence: 10, wisdom: 14, charisma: 8 },
    primary_abilities: ["Agility","Sense"], source: "System Ascendant Canon"
  },

  // 12. HOLY KNIGHT — Paladin
  {
    id: "holy-knight", name: "Holy Knight", type: "Job", rank: "A",
    description: "Warriors who swear sacred oaths to the System and are granted divine power in return. Holy Knights combine devastating melee combat with divine spellcasting, smiting evil and protecting the innocent with an unbreakable code of honor.",
    hitDie: "1d10", primaryAbility: "Strength", savingThrows: ["Sense", "Presence"],
    skillChoices: ["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"],
    armorProficiencies: ["All armor","Shields"], weaponProficiencies: ["Simple weapons","Martial weapons"], toolProficiencies: [],
    awakeningFeatures: [
      { name: "Celestial Resilience", description: "When you or an ally within 10 ft succeeds on a death save, they regain 1 HP. The System's light refuses to let the faithful fall.", level: 1 },
      { name: "Divine Sense", description: "Detect celestial, fiend, or undead within 60 ft. Know type and location. 1 + Presence mod uses per long rest.", level: 1 },
      { name: "Aura of Courage", description: "You and allies within 10 ft can't be frightened while you're conscious. Range 30 ft at 18th.", level: 10 },
      { name: "Cleansing Touch", description: "End one spell on a willing creature you touch. Presence mod uses per long rest.", level: 14 }
    ],
    jobTraits: [
      { name: "Lay on Hands", description: "Pool of healing = 5 × Holy Knight level. Touch to restore HP or cure disease/poison (5 HP per cure).", type: "active", frequency: "long-rest" },
      { name: "Aura of Protection", description: "You and allies within 10 ft add your Presence mod to saves. Range 30 ft at 18th level.", type: "passive" },
      { name: "Divine Health", description: "Immune to disease through the power of your sacred oath.", type: "immunity" }
    ],
    abilityScoreImprovements: { strength: 2, charisma: 1 }, size: "medium", speed: 30, languages: ["Common","Celestial"], darkvision: 60,
    damageResistances: ["radiant"],
    startingEquipment: [["A martial weapon and shield","Two martial weapons"],["Five javelins","Any simple melee weapon"],["A priest's pack","An explorer's pack"],["Chain mail and a holy symbol"]],
    hitPointsAtFirstLevel: "10 + your Vitality modifier", hitPointsAtHigherLevels: "1d10 (or 6) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Presence", focus: "Holy symbol",
      spellSlots: { ...HALF_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Divine Sense", description: "Detect celestials, fiends, and undead within 60 ft. 1 + Presence mod uses per long rest." },
      { level: 1, name: "Lay on Hands", description: "Healing pool = 5 × Holy Knight level. Touch to heal or cure disease/poison (5 HP each)." },
      { level: 2, name: "Fighting Style", description: "Choose: Defense, Dueling, Great Weapon Fighting, or Protection." },
      { level: 2, name: "Spellcasting", description: "Cast Holy Knight spells using Presence. Prepare from the full list each day." },
      { level: 2, name: "Divine Smite", description: "On melee hit, expend spell slot: +2d8 radiant damage (+1d8 per slot above 1st, max 5d8). +1d8 vs undead/fiend." },
      { level: 3, name: "Divine Health", description: "Immune to disease." },
      { level: 3, name: "Sacred Oath", description: "Choose an oath. Oath spells and features at 3rd, 7th, 15th, and 20th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
      { level: 6, name: "Aura of Protection", description: "You and allies within 10 ft add Presence mod to saves (30 ft at 18th)." },
      { level: 7, name: "Oath Feature", description: "Feature from your Sacred Oath." },
      { level: 10, name: "Aura of Courage", description: "You and allies within 10 ft can't be frightened (30 ft at 18th)." },
      { level: 11, name: "Improved Divine Smite", description: "All melee weapon hits deal an extra 1d8 radiant damage." },
      { level: 14, name: "Cleansing Touch", description: "End one spell on a willing creature. Presence mod uses per long rest." },
      { level: 15, name: "Oath Feature", description: "Feature from your Sacred Oath." },
      { level: 20, name: "Sacred Avatar", description: "Your Sacred Oath capstone transforms you into an avatar of your oath's ideals for 1 minute. Once per long rest." }
    ],
    abilities: ["Divine Sense","Lay on Hands","Divine Smite","Sacred Oath","Aura of Protection","Extra Attack"],
    image: "/generated/compendium/jobs/paladin.webp",
    stats: { strength: 15, dexterity: 10, constitution: 13, intelligence: 8, wisdom: 12, charisma: 14 },
    primary_abilities: ["Strength","Presence"], source: "System Ascendant Canon"
  },

  // 13. TECHNOMANCER — Artificer
  {
    id: "technomancer", name: "Technomancer", type: "Job", rank: "B",
    description: "Hunters who fuse System magic with technology, crafting enchanted devices, infusing mundane items with magical properties, and building arcane constructs. They are the engineers and inventors of the hunter world.",
    hitDie: "1d8", primaryAbility: "Intelligence", savingThrows: ["Vitality", "Intelligence"],
    skillChoices: ["Arcana","History","Investigation","Medicine","Nature","Perception","Sleight of Hand"],
    armorProficiencies: ["Light armor","Medium armor","Shields"], weaponProficiencies: ["Simple weapons"], toolProficiencies: ["Thieves' tools","Tinker's tools","One artisan's tool"],
    awakeningFeatures: [
      { name: "Techno-organic Augmentation", description: "Double proficiency bonus on Intelligence (History) checks related to magic items, technology, or System constructs. Your awakening fused your neural pathways with System analytics.", level: 1 },
      { name: "System Interface", description: "You can interface with System constructs and magical devices, reading their functions and bypassing security. Advantage on checks to analyze magical technology.", level: 1 },
      { name: "Infusion Mastery", description: "Your infused items grant an additional +1 bonus (stacking with the base infusion). At 14th level, this increases to +2.", level: 6 },
      { name: "Construct Commander", description: "Constructs you create have extra HP = 2 × your Technomancer level and advantage on saves against being banished.", level: 10 }
    ],
    jobTraits: [
      { name: "Magical Tinkering", description: "Imbue tiny objects with magical effects: light, message, sound, or odor. Up to Intelligence mod objects at once.", type: "active", frequency: "at-will" },
      { name: "Tool Expertise", description: "Double proficiency bonus with all tools you're proficient with.", type: "passive" },
      { name: "Flash of Genius", description: "Reaction: add Intelligence mod to a creature's ability check or save within 30 ft. Intelligence mod uses per long rest.", type: "active", frequency: "long-rest" }
    ],
    abilityScoreImprovements: { intelligence: 2, constitution: 1 }, size: "medium", speed: 30, languages: ["Common"], darkvision: 60,
    damageResistances: ["lightning"],
    specialSenses: ["System Scan (identify magic items by touch, 1 minute)"],
    startingEquipment: [["Any two simple weapons"],["A light crossbow and 20 bolts"],["Studded leather armor and thieves' tools"],["A dungeoneer's pack"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Intelligence", focus: "Thieves' tools or artisan's tools",
      cantripsKnown: [2,2,2,2,2,2,2,2,2,3,3,3,3,4,4,4,4,4,4,4],
      spellSlots: { ...HALF_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Magical Tinkering", description: "Imbue tiny objects with minor magical properties: light, sound, message, or visual effect." },
      { level: 1, name: "Spellcasting", description: "Cast Technomancer spells using Intelligence. Prepare spells using tools as your focus." },
      { level: 2, name: "Infuse Item", description: "Infuse nonmagical items with magical properties. Number of infusions scales with level." },
      { level: 3, name: "Artificer Specialist", description: "Choose: Alchemist, Armorer, Artillerist, or Battle Smith. Features at 3rd, 5th, 9th, and 15th." },
      { level: 3, name: "The Right Tool for the Job", description: "Spend 1 hour to produce any set of artisan's tools using thieves' or artisan's tools." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Specialist Feature", description: "Feature from your Artificer Specialist." },
      { level: 6, name: "Tool Expertise", description: "Double proficiency bonus on all tool checks." },
      { level: 7, name: "Flash of Genius", description: "Reaction: add INT mod to a creature's check or save within 30 ft. INT mod uses per long rest." },
      { level: 9, name: "Specialist Feature", description: "Feature from your Artificer Specialist." },
      { level: 10, name: "Magic Item Adept", description: "Craft common/uncommon magic items in 1/4 time and half cost. Attune to 4 items." },
      { level: 11, name: "Spell-Storing Item", description: "Store a 1st/2nd-level spell in an item. Creature holding it can cast the spell (2 × INT mod uses)." },
      { level: 14, name: "Magic Item Savant", description: "Ignore class/race/spell/level requirements for magic items. Attune to 5 items." },
      { level: 15, name: "Specialist Feature", description: "Feature from your Artificer Specialist." },
      { level: 18, name: "Magic Item Master", description: "Attune to 6 magic items simultaneously." },
      { level: 20, name: "Soul of Artifice", description: "+1 to all saves per attuned item. When reduced to 0 HP, end an attunement to drop to 1 HP instead." }
    ],
    abilities: ["Magical Tinkering","Spellcasting","Infuse Item","Artificer Specialist","Flash of Genius","Spell-Storing Item"],
    image: "/generated/compendium/jobs/artificer.webp",
    stats: { strength: 10, dexterity: 12, constitution: 14, intelligence: 15, wisdom: 13, charisma: 8 },
    primary_abilities: ["Intelligence","Vitality"], source: "System Ascendant Canon"
  },

  // 14. IDOL — Bard
  {
    id: "idol", name: "Idol", type: "Job", rank: "B",
    description: "Hunters whose System awakening manifests through performance, inspiration, and social manipulation. Idols weave magic through music, speech, and sheer force of personality — buffing allies, debilitating enemies, and knowing a little bit of everything.",
    hitDie: "1d8", primaryAbility: "Presence", savingThrows: ["Agility", "Presence"],
    skillChoices: ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],
    armorProficiencies: ["Light armor"], weaponProficiencies: ["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], toolProficiencies: ["Three musical instruments"],
    awakeningFeatures: [
      { name: "Skill Versatility", description: "Gain proficiency in two additional skills of your choice. Your awakening grants an intuitive grasp of many disciplines.", level: 1 },
      { name: "Fey Charm", description: "Advantage on saves against being charmed. Magic cannot put you to sleep. Your force of personality repels mental intrusion.", level: 1 },
      { name: "Rallying Presence", description: "When you use Hype (Bardic Inspiration), the recipient also gains temp HP equal to your Presence modifier.", level: 1 },
      { name: "Signal Jam", description: "As a reaction when a creature within 60 ft makes an attack or check, you can expend a Hype die to subtract the roll from their total.", level: 5 },
      { name: "Viral Technique", description: "When an ally uses your Hype die, the die is not expended on a roll of the maximum value.", level: 14 }
    ],
    jobTraits: [
      { name: "Jack of All Trades", description: "Add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus.", type: "passive" },
      { name: "Post-Raid Debrief", description: "During a short rest, perform to help allies regain extra HP. Presence mod creatures each regain an extra 1d6 HP.", type: "active", frequency: "short-rest" },
      { name: "Expertise", description: "Double proficiency on two chosen skill proficiencies. Two more at 10th level.", type: "passive" }
    ],
    abilityScoreImprovements: { charisma: 2, dexterity: 1 }, size: "medium", speed: 30, languages: ["Common","One additional language"], darkvision: 60,
    startingEquipment: [["A rapier","A longsword","Any simple weapon"],["A diplomat's pack","An entertainer's pack"],["A lute","Any musical instrument"],["Leather armor and a dagger"]],
    hitPointsAtFirstLevel: "8 + your Vitality modifier", hitPointsAtHigherLevels: "1d8 (or 5) + your Vitality modifier per level after 1st",
    spellcasting: {
      ability: "Presence", focus: "Musical instrument",
      cantripsKnown: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
      spellsKnown: [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
      spellSlots: { ...FULL_CASTER_SLOTS }
    },
    classFeatures: [
      { level: 1, name: "Spellcasting", description: "Cast Idol spells using Presence. Known caster using a musical instrument as focus." },
      { level: 1, name: "Hype (Bardic Inspiration)", description: "Bonus action: grant a creature within 60 ft a d6 Hype die (d8 at 5th, d10 at 10th, d12 at 15th). Add to one check/attack/save within 10 min. Presence mod uses per long rest (short rest at 5th)." },
      { level: 2, name: "Jack of All Trades", description: "Add half proficiency bonus to unproficient ability checks." },
      { level: 2, name: "Post-Raid Debrief (Song of Rest)", description: "During short rest, allies regain extra 1d6 HP (d8 at 9th, d10 at 13th, d12 at 17th)." },
      { level: 3, name: "Expertise", description: "Double proficiency on two skill proficiencies. Two more at 10th level." },
      { level: 3, name: "Idol College", description: "Choose a college. Features at 3rd, 6th, and 14th level." },
      { level: 4, name: "Ability Score Improvement", description: "You gain this at 4th, 8th, 12th, 16th, and 19th level." },
      { level: 5, name: "Font of Hype", description: "Hype dice recharge on short rest instead of long rest." },
      { level: 6, name: "Signal Jam (Countercharm)", description: "Action: performance for 1 round. You and allies within 30 ft have advantage on saves vs being frightened/charmed." },
      { level: 6, name: "College Feature", description: "Feature from your Idol College." },
      { level: 10, name: "Magical Secrets", description: "Learn two spells from any class's spell list. They count as Idol spells. Additional at 14th and 18th." },
      { level: 14, name: "College Feature", description: "Feature from your Idol College." },
      { level: 20, name: "Superior Inspiration", description: "Roll initiative with 0 Hype dice: regain 1. Your presence alone inspires greatness." }
    ],
    abilities: ["Spellcasting","Hype","Jack of All Trades","Post-Raid Debrief","Idol College","Magical Secrets"],
    image: "/generated/compendium/jobs/bard.webp",
    stats: { strength: 8, dexterity: 14, constitution: 12, intelligence: 13, wisdom: 10, charisma: 15 },
    primary_abilities: ["Presence","Agility"], source: "System Ascendant Canon"
  },
];
