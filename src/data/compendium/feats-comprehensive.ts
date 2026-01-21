// Comprehensive Feats Compendium - Authoritative System Ascendant Content
// ALL feats needed for the complete compendium system
// Based on System Ascendant canon with SRD 5e mechanics

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: {
    level?: number;
    ability?: string;
    score?: number;
    feats?: string[];
    class?: string;
    background?: string;
    skill?: string;
    alignment?: string;
    race?: string;
  };
  benefits: string[];
  mechanics: {
    type: 'passive' | 'active' | 'triggered';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day' | 'once-per-week' | 'once-per-turn' | 'when-critical-hit' | 'when-creature-dies' | 'bonus-action' | 'reaction' | '3-per-day';
    action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    ability?: string;
    save?: string;
    dc?: number | 'ability-modifier' | 'spell-save';
  };
  flavor?: string;
  source: string;
  image?: string;
}

export const comprehensiveFeats: Feat[] = [
  // SHADOW FEATS (Expanded)
  {
    id: 'shadow-mastery',
    name: 'Shadow Mastery',
    description: 'You have mastered the art of shadow manipulation, gaining enhanced control over shadow energy.',
    prerequisites: {
      level: 5,
      ability: 'Wisdom',
      score: 13
    },
    benefits: [
      'Gain advantage on Dexterity (Stealth) checks in dim light or darkness',
      'Can cast Shadow Step as a bonus action 3 times per long rest',
      'Resistance to necrotic damage from shadow sources',
      'Can see through magical darkness up to 60 feet'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The shadows bend to your will, becoming extensions of your very essence.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'essence-absorption',
    name: 'Essence Absorption',
    description: 'You can absorb the life essence from defeated enemies to enhance your own power.',
    prerequisites: {
      level: 7,
      feats: ['shadow-mastery']
    },
    benefits: [
      'When you reduce a creature to 0 HP, gain temporary HP equal to your Wisdom modifier',
      'Once per long rest, can absorb essence to gain advantage on your next attack roll',
      'Can store absorbed essence to power shadow abilities',
      'Gain +1 to Constitution saving throws'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'once-per-turn',
      action: 'free'
    },
    flavor: 'The life force of your foes becomes the fuel for your ascension.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'monarch-aura',
    name: 'Monarch\'s Aura',
    description: 'You project an aura of authority that affects lesser shadows and undead.',
    prerequisites: {
      level: 15,
      feats: ['shadow-mastery', 'essence-absorption']
    },
    benefits: [
      'Undead and shadow creatures with CR less than your level are frightened of you',
      'Can command shadow creatures as an action (Wisdom check contested)',
      'Allies within 30 feet gain +1 to saving throws against fear',
      'Shadow creatures have disadvantage on attack rolls against you'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The very presence of a Monarch commands respect and fear from the shadows.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-dance',
    name: 'Shadow Dance',
    description: 'You move through combat with supernatural grace, striking from unexpected angles.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'When you take the Dodge action, can move up to your speed without provoking opportunity attacks',
      'Once per turn, can teleport up to 15 feet to unoccupied space you can see',
      'Advantage on Dexterity saving throws against area effects',
      'Can use Shadow Step as a reaction when targeted by an attack'
    ],
    mechanics: {
      type: 'active',
      frequency: 'once-per-turn',
      action: 'reaction'
    },
    flavor: 'Like a dancer in the dark, you weave between strikes with impossible grace.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'critical-shadow',
    name: 'Critical Shadow',
    description: 'Your attacks carry the essence of shadow, dealing devastating critical hits.',
    prerequisites: {
      level: 9,
      ability: 'Dexterity',
      score: 17
    },
    benefits: [
      'Critical hits with weapons or shadow abilities deal extra necrotic damage equal to your proficiency bonus',
      'When you score a critical hit, target must make Constitution save or be blinded for 1 minute',
      'Shadow weapons count as magical for overcoming resistance',
      'Can reroll one damage die on critical hits (must use new result)'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'when-critical-hit',
      action: 'free'
    },
    flavor: 'Your strikes carry the weight of darkness itself, crushing all who oppose you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-extraction-expert',
    name: 'Shadow Extraction Expert',
    description: 'You have perfected the art of extracting shadows from defeated enemies.',
    prerequisites: {
      level: 3,
      feats: ['shadow-mastery']
    },
    benefits: [
      'Can extract shadows from creatures up to CR 1 higher than your level',
      'Extracted shadows have +2 to all ability scores',
      'Can extract and command up to 2 shadows at once',
      'Extraction process takes only 1 minute instead of 10'
    ],
    mechanics: {
      type: 'active',
      frequency: 'short-rest',
      action: 'action'
    },
    flavor: 'Every fallen foe becomes a potential ally in your growing shadow army.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-awareness',
    name: 'Dimensional Awareness',
    description: 'Your senses extend beyond normal perception, allowing you to perceive dimensional distortions.',
    prerequisites: {
      ability: 'Wisdom',
      score: 13
    },
    benefits: [
      'Cannot be surprised by creatures using teleportation or shadow movement',
      'Advantage on Perception checks to notice invisible or ethereal creatures',
      'Can sense the use of teleportation magic within 100 feet',
      'Resistance to force damage'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The fabric of reality whispers its secrets to those who know how to listen.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-resilience',
    name: 'Shadow Resilience',
    description: 'Your body has adapted to withstand the corrupting influence of shadow energy.',
    prerequisites: {
      level: 5,
      ability: 'Constitution',
      score: 14
    },
    benefits: [
      'Advantage on saving throws against shadow-based spells and abilities',
      'Cannot be frightened by shadow creatures or effects',
      'Regenerate 1 HP per round while in dim light or darkness',
      'Immunity to the shadow corruption condition'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'What would corrupt lesser beings only strengthens your resolve.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'monarchs-resilience',
    name: 'Monarch\'s Resilience',
    description: 'The power of a Monarch flows through you, granting incredible durability.',
    prerequisites: {
      level: 20,
      feats: ['shadow-resilience', 'monarch-aura']
    },
    benefits: [
      'Resistance to all damage types except radiant',
      'Cannot be reduced below 1 HP by shadow damage',
      'Regenerate 5 HP per round',
      'When reduced to 0 HP, can spend 1 resolve point to return to 50% HP'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The essence of a Monarch cannot be easily extinguished.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-weapon-mastery',
    name: 'Shadow Weapon Mastery',
    description: 'You can create and wield weapons made of pure shadow energy.',
    prerequisites: {
      level: 10,
      feats: ['shadow-mastery']
    },
    benefits: [
      'Can create shadow weapons as a bonus action',
      'Shadow weapons deal +1d6 necrotic damage',
      'Shadow weapons can change form as a bonus action',
      'Can throw shadow weapons that return to your hand'
    ],
    mechanics: {
      type: 'active',
      frequency: 'bonus-action',
      action: 'bonus-action'
    },
    flavor: 'Your will becomes steel, forged in the darkness of your soul.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-armor',
    name: 'Shadow Armor',
    description: 'You can form protective armor from shadow energy around yourself.',
    prerequisites: {
      level: 8,
      feats: ['shadow-mastery']
    },
    benefits: [
      'Can form shadow armor as a bonus action',
      'Shadow armor provides +2 AC and resistance to non-magical damage',
      'Shadow armor doesn\'t impose disadvantage on Stealth checks',
      'Can repair shadow armor as a bonus action'
    ],
    mechanics: {
      type: 'active',
      frequency: 'bonus-action',
      action: 'bonus-action'
    },
    flavor: 'The shadows themselves become your shield against harm.',
    source: 'System Ascendant Canon'
  },

  // COMBAT FEATS (Expanded)
  {
    id: 'weapon-focus',
    name: 'Weapon Focus',
    description: 'You have mastered a specific type of weapon, gaining superior combat abilities with it.',
    prerequisites: {
      ability: 'Strength',
      score: 13
    },
    benefits: [
      '+1 to attack and damage rolls with chosen weapon type',
      'Can use chosen weapon type as reaction for opportunity attacks',
      'Critical hits with chosen weapon type deal +1d10 damage',
      'Can disarm opponents using chosen weapon type as bonus action'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your chosen weapon becomes an extension of your body and soul.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    description: 'You are skilled at fighting with two weapons simultaneously.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'No penalty to attack rolls when fighting with two weapons',
      'Can make two attacks as one action when using two light weapons',
      'Can add ability modifier to damage of off-hand weapon',
      'Can throw two weapons as one action'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Two blades are better than one, especially when they dance in your hands.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'power-attack',
    name: 'Power Attack',
    description: 'You can trade accuracy for devastating damage with melee attacks.',
    prerequisites: {
      level: 4,
      ability: 'Strength',
      score: 15
    },
    benefits: [
      'Can take -5 penalty to attack roll to add +10 to damage roll',
      'Can use this ability once per turn',
      'Works with any melee weapon or unarmed strike',
      'Can use with thrown weapons within 30 feet'
    ],
    mechanics: {
      type: 'active',
      frequency: 'once-per-turn',
      action: 'action'
    },
    flavor: 'Sometimes raw power is more important than precision.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'precise-shot',
    name: 'Precise Shot',
    description: 'Your ranged attacks are exceptionally accurate and deadly.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'Ranged attacks don\'t have disadvantage at long range',
      'Can ignore half and three-quarters cover with ranged attacks',
      'Ranged attacks deal +1 damage',
      'Can make called shots to target specific body parts'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Every arrow finds its mark when guided by your steady hand.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'combat-reflexes',
    name: 'Combat Reflexes',
    description: 'Your reflexes in combat are supernaturally fast.',
    prerequisites: {
      ability: 'Dexterity',
      score: 13
    },
    benefits: [
      'Advantage on initiative rolls',
      'Can act in surprise round',
      'Can use reaction to make opportunity attack against any creature that moves within reach',
      'Can use reaction to dodge one attack per round'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Before others can react, you have already struck.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'cleave',
    name: 'Cleave',
    description: 'Your powerful attacks can strike multiple enemies.',
    prerequisites: {
      level: 6,
      ability: 'Strength',
      score: 16
    },
    benefits: [
      'When you hit a creature with a melee attack, can make another attack against different creature within reach',
      'Can use this ability once per turn',
      'Second attack uses same attack roll as first',
      'Works with any melee weapon'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'once-per-turn',
      action: 'free'
    },
    flavor: 'One strike can fell many foes when wielded with sufficient force.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'defensive-fighting',
    name: 'Defensive Fighting',
    description: 'You can fight defensively to protect yourself and allies.',
    prerequisites: {
      ability: 'Dexterity',
      score: 13
    },
    benefits: [
      'Can use Dodge action and still make one attack with disadvantage',
      'Can use reaction to protect adjacent ally from attack',
      'Allies within 5 feet gain +1 to AC when you use Dodge action',
      'Can use shield to block spells targeting adjacent allies'
    ],
    mechanics: {
      type: 'active',
      frequency: 'reaction',
      action: 'reaction'
    },
    flavor: 'A strong defense is often the best offense.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'critical-mastery',
    name: 'Critical Mastery',
    description: 'Your critical hits are exceptionally devastating.',
    prerequisites: {
      level: 12,
      feats: ['weapon-focus']
    },
    benefits: [
      'Critical hits deal maximum weapon damage',
      'Can reroll one damage die on critical hit',
      'Critical hits force enemies to make Constitution save or be stunned',
      'Threat range for critical hits increases by 1'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'when-critical-hit',
      action: 'free'
    },
    flavor: 'When you find an opening, you exploit it to its fullest.',
    source: 'System Ascendant Canon'
  },

  // DEFENSIVE FEATS (Expanded)
  {
    id: 'toughness',
    name: 'Toughness',
    description: 'You are significantly tougher than normal.',
    prerequisites: {
      ability: 'Constitution',
      score: 13
    },
    benefits: [
      'Maximum HP increases by 2 per level',
      'Resistance to poison damage',
      'Advantage on Constitution saving throws',
      'Can stabilize dying creatures without check'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your body can withstand punishment that would fell lesser beings.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dodge-training',
    name: 'Dodge Training',
    description: 'You are exceptionally difficult to hit due to your evasive abilities.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'Advantage on Dexterity saving throws',
      'Can use reaction to halve damage from one attack per round',
      'Difficult terrain doesn\'t slow your movement',
      'Can move through enemy spaces without provoking opportunity attacks'
    ],
    mechanics: {
      type: 'active',
      frequency: 'reaction',
      action: 'reaction'
    },
    flavor: 'The best way to win a fight is to not get hit in the first place.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'damage-reduction',
    name: 'Damage Reduction',
    description: 'Your body can absorb and reduce damage from attacks.',
    prerequisites: {
      level: 8,
      feats: ['toughness']
    },
    benefits: [
      'Reduce all weapon damage by 3 (to minimum of 1)',
      'Resistance to bludgeoning, piercing, and slashing damage',
      'Can use reaction to reduce damage from one attack by half',
      'Immunity to critical hits from non-magical weapons'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your body has become as resilient as armor itself.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'regeneration',
    name: 'Regeneration',
    description: 'Your body can heal wounds at an accelerated rate.',
    prerequisites: {
      level: 10,
      feats: ['toughness']
    },
    benefits: [
      'Regenerate 1 HP per round',
      'Can reattach severed limbs within 1 hour',
      'Cannot die from massive damage unless reduced to -20 HP',
      'Healing spells have enhanced effect on you'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Life flows through you, refusing to be extinguished.',
    source: 'System Ascendant Canon'
  },

  // MAGICAL FEATS (Expanded)
  {
    id: 'spell-mastery',
    name: 'Spell Mastery',
    description: 'You have mastered certain spells, casting them with exceptional power.',
    prerequisites: {
      level: 8,
      class: 'Mage'
    },
    benefits: [
      'Choose 3 spells you can cast at will',
      'Can cast chosen spells without spell slots',
      'Chosen spells have +1 to spell attack rolls',
      'Can modify chosen spells with metamagic without cost'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Some spells have become as natural to you as breathing.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'metamagic-adept',
    name: 'Metamagic Adept',
    description: 'You can modify your spells with metamagic abilities.',
    prerequisites: {
      level: 6,
      class: 'Mage'
    },
    benefits: [
      'Gain 2 metamagic options',
      'Can use metamagic 3 times per day without cost',
      'Metamagic costs 1 less sorcery point',
      'Can apply multiple metamagic options to same spell'
    ],
    mechanics: {
      type: 'active',
      frequency: '3-per-day',
      action: 'bonus-action'
    },
    flavor: 'You don\'t just cast spells - you reshape them to your will.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'arcane-defense',
    name: 'Arcane Defense',
    description: 'You have developed special defenses against magical attacks.',
    prerequisites: {
      level: 4,
      class: 'Mage'
    },
    benefits: [
      'Advantage on saving throws against spells',
      'Can use reaction to counterspell once per day',
      'Resistance to force, lightning, and thunder damage',
      'Can identify spells being cast as reaction'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Magic flows around you, unable to find purchase.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'spell-penetration',
    name: 'Spell Penetration',
    description: 'Your spells can overcome magical resistance and defenses.',
    prerequisites: {
      level: 10,
      class: 'Mage'
    },
    benefits: [
      'Spells ignore magic resistance',
      'Spells ignore half and three-quarters cover',
      'Spells can affect normally immune creatures',
      'Spells have +1 to overcome spell resistance'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your magic cannot be contained by mortal defenses.',
    source: 'System Ascendant Canon'
  },

  // SKILL FEATS (Expanded)
  {
    id: 'skill-expertise',
    name: 'Skill Expertise',
    description: 'You have mastered a specific skill, gaining exceptional ability with it.',
    prerequisites: {
      level: 4,
      skill: 'Any'
    },
    benefits: [
      'Double proficiency bonus with chosen skill',
      'Can use chosen skill for any related task',
      'Advantage on chosen skill checks',
      'Can teach chosen skill to others'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your chosen skill has become second nature to you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'jack-of-all-trades',
    name: 'Jack of All Trades',
    description: 'You have basic competence in all skills.',
    prerequisites: {
      level: 2
    },
    benefits: [
      'Add half proficiency bonus to all skill checks',
      'Can attempt any skill check even if untrained',
      'Advantage on skill checks with tools',
      'Learn new skills in half the normal time'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'A little knowledge of everything is better than complete ignorance.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'skill-focus',
    name: 'Skill Focus',
    description: 'You can focus your mental energy to enhance skill performance.',
    prerequisites: {
      level: 6
    },
    benefits: [
      'Once per day, gain advantage on one skill check',
      'Can add proficiency bonus to any skill check',
      'Can use this ability after seeing the roll result',
      'Can use on others\' skill checks to help them'
    ],
    mechanics: {
      type: 'active',
      frequency: 'once-per-day',
      action: 'free'
    },
    flavor: 'Sometimes a moment of concentration makes all the difference.',
    source: 'System Ascendant Canon'
  },

  // SOCIAL FEATS (Expanded)
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'You have natural leadership abilities that inspire others to follow you.',
    prerequisites: {
      level: 6,
      ability: 'Charisma',
      score: 15
    },
    benefits: [
      'Can attract followers and build a loyal following',
      'Allies within 30 feet gain +1 to attack rolls and saving throws',
      'Can inspire courage in allies, removing fear effects',
      'Can organize groups for maximum efficiency'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Others naturally look to you for guidance and inspiration.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'diplomacy',
    name: 'Diplomacy',
    description: 'You have exceptional ability to negotiate and resolve conflicts peacefully.',
    prerequisites: {
      ability: 'Charisma',
      score: 13
    },
    benefits: [
      'Advantage on Charisma (Persuasion) checks',
      'Can prevent fights through negotiation',
      'Can mediate disputes between hostile parties',
      'Can gain favorable terms in negotiations'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Words can be more powerful than weapons when used wisely.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'intimidating-presence',
    name: 'Intimidating Presence',
    description: 'Your mere presence inspires fear and respect in those around you.',
    prerequisites: {
      ability: 'Charisma',
      score: 15
    },
    benefits: [
      'Advantage on Charisma (Intimidation) checks',
      'Can force creatures to make Wisdom save or be frightened',
      'Enemies within 30 feet have disadvantage on attack rolls',
      'Can intimidate groups of creatures simultaneously'
    ],
    mechanics: {
      type: 'active',
      frequency: 'long-rest',
      action: 'action'
    },
    flavor: 'Your reputation precedes you, and even the braviest hesitate to cross your path.',
    source: 'System Ascendant Canon'
  },

  // UTILITY FEATS (Expanded)
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'You learn new skills and abilities with exceptional speed.',
    prerequisites: {
      level: 3,
      ability: 'Intelligence',
      score: 13
    },
    benefits: [
      'Learn new skills in half the normal time',
      'Can temporarily gain proficiency with any skill for 1 hour',
      'Advantage on Intelligence checks to learn new information',
      'Can master skills with less practice'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your mind is a sponge, absorbing knowledge wherever you go.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'eidetic-memory',
    name: 'Eidetic Memory',
    description: 'You have perfect recall of everything you have seen or heard.',
    prerequisites: {
      ability: 'Intelligence',
      score: 14
    },
    benefits: [
      'Perfect recall of all information',
      'Can remember exact details from years ago',
      'Advantage on Intelligence checks to recall information',
      'Can never be fooled by illusions that rely on memory'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your mind is a perfect library of all you have experienced.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    description: 'You can quickly adapt to new situations and environments.',
    prerequisites: {
      level: 4
    },
    benefits: [
      'Advantage on saving throws against environmental effects',
      'Can adapt to new climates in 1 day instead of 1 week',
      'Can learn creature languages quickly',
      'Can improvise tools and solutions in any situation'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'No matter the challenge, you find a way to overcome it.',
    source: 'System Ascendant Canon'
  },

  // RACIAL FEATS (Expanded)
  {
    id: 'human-determination',
    name: 'Human Determination',
    description: 'Your human spirit gives you exceptional determination and resilience.',
    prerequisites: {
      race: 'Human'
    },
    benefits: [
      'Advantage on saving throws against fear and charm',
      'Can reroll failed saving throws once per day',
      'Gain temporary HP when reduced to 0 HP',
      'Cannot be reduced below 1 HP by failed death saves'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The human spirit refuses to be extinguished.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'elven-grace',
    name: 'Elven Grace',
    description: 'Your elven heritage grants you supernatural grace and perception.',
    prerequisites: {
      race: 'Elf'
    },
    benefits: [
      'Advantage on Dexterity checks',
      'Can move through difficult terrain without penalty',
      'Advantage on Perception checks',
      'Immunity to magical sleep effects'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Elven grace flows through your every movement.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dwarven-resilience',
    name: 'Dwarven Resilience',
    description: 'Your dwarven heritage grants you exceptional toughness and stone-sense.',
    prerequisites: {
      race: 'Dwarf'
    },
    benefits: [
      'Advantage on Constitution saving throws',
      'Resistance to poison damage',
      'Can determine depth underground',
      'Advantage on checks related to stonework'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The mountains themselves flow through your veins.',
    source: 'System Ascendant Canon'
  },

  // DIVINE FEATS (Expanded)
  {
    id: 'divine-favor',
    name: 'Divine Favor',
    description: 'You have been blessed by divine powers that aid you in times of need.',
    prerequisites: {
      level: 8,
      alignment: 'Any Good'
    },
    benefits: [
      'Once per day, can reroll any failed saving throw',
      'Advantage on attacks against undead and fiends',
      'Can heal others with touch (1d8 + level HP per day)',
      'Immunity to disease'
    ],
    mechanics: {
      type: 'active',
      frequency: 'once-per-day',
      action: 'free'
    },
    flavor: 'Divine power flows through you, aiding the worthy.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'holy-warrior',
    name: 'Holy Warrior',
    description: 'You have been trained to fight against evil forces.',
    prerequisites: {
      level: 6,
      alignment: 'Lawful Good'
    },
    benefits: [
      'Advantage on attacks against evil creatures',
      'Can smite evil once per day (extra radiant damage)',
      'Resistance to necrotic damage',
      'Can detect evil creatures'
    ],
    mechanics: {
      type: 'active',
      frequency: 'once-per-day',
      action: 'bonus-action'
    },
    flavor: 'Your blade is guided by divine justice.',
    source: 'System Ascendant Canon'
  },

  // EPIC FEATS (Expanded)
  {
    id: 'epic-charisma',
    name: 'Epic Charisma',
    description: 'Your charisma is so powerful it can bend reality itself.',
    prerequisites: {
      level: 21,
      ability: 'Charisma',
      score: 25
    },
    benefits: [
      'Can persuade creatures to act against their nature',
      'Can inspire loyalty that persists after death',
      'Can command armies with your words alone',
      'Can convince deities to grant favors'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your words reshape the world around you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-strength',
    name: 'Epic Strength',
    description: 'Your physical strength is beyond mortal limits.',
    prerequisites: {
      level: 21,
      ability: 'Strength',
      score: 25
    },
    benefits: [
      'Can lift and throw massive objects',
      'Can break through walls and barriers',
      'Can wrestle with giants',
      'Can destroy magical constructs with bare hands'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your strength rivals that of the gods themselves.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-intelligence',
    name: 'Epic Intelligence',
    description: 'Your intellect can comprehend the deepest mysteries of reality.',
    prerequisites: {
      level: 21,
      ability: 'Intelligence',
      score: 25
    },
    benefits: [
      'Can understand any language',
      'Can solve any puzzle or riddle',
      'Can create new spells and magical systems',
      'Can comprehend the nature of reality'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your mind contains the knowledge of ages.',
    source: 'System Ascendant Canon'
  }
];



