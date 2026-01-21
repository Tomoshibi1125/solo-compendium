// Feats Compendium - Authoritative System Ascendant Content
// Character abilities and special powers that enhance capabilities
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
  };
  benefits: string[];
  mechanics: {
    type: 'passive' | 'active' | 'triggered';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day' | 'once-per-turn' | 'when-critical-hit';
    action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    ability?: string;
    save?: string;
    dc?: number | 'ability-modifier' | 'spell-save';
  };
  flavor?: string;
  source: string;
  image?: string;
}

export const feats: Feat[] = [
  // SHADOW FEATS
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

  // COMBAT FEATS
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

  // UTILITY FEATS
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

  // DEFENSIVE FEATS
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

  // SOCIAL FEATS
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
      'Can use Wisdom modifier instead of Charisma for Intimidation',
      'Enemies within 30 feet have disadvantage on attacks against your allies',
      'Can force a creature to make Wisdom save or be frightened for 1 minute'
    ],
    mechanics: {
      type: 'active',
      frequency: 'long-rest',
      action: 'action'
    },
    flavor: 'Your reputation precedes you, and even the bravest hesitate to cross your path.',
    source: 'System Ascendant Canon'
  },

  // SKILL FEATS
  {
    id: 'shadow-stealth-master',
    name: 'Shadow Stealth Master',
    description: 'You are virtually undetectable when you wish to remain hidden.',
    prerequisites: {
      ability: 'Dexterity',
      score: 13
    },
    benefits: [
      'Expertise in Stealth (double proficiency bonus)',
      'Can hide in dim light even when being observed',
      'Moving while hidden does not reveal your position',
      'Can create minor shadow illusions to aid in stealth'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'When you choose to disappear, even the shadows themselves cannot find you.',
    source: 'System Ascendant Canon'
  },

  // MAGICAL FEATS
  {
    id: 'shadow-spell-mastery',
    name: 'Shadow Spell Mastery',
    description: 'Your control over shadow magic is unparalleled.',
    prerequisites: {
      level: 7,
      ability: 'Intelligence',
      score: 14
    },
    benefits: [
      'Can cast shadow spells without somatic components',
      'Shadow spells you cast have +1 to spell attack rolls',
      'Can change the damage type of shadow spells to necrotic or force',
      'Once per long rest, can cast a shadow spell without using a spell slot'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Shadow magic responds to your will as naturally as breathing.',
    source: 'System Ascendant Canon'
  },

  // ADVANCED COMBAT FEATS
  {
    id: 'perfect-dodge',
    name: 'Perfect Dodge',
    description: 'Your reflexes are supernaturally sharp, allowing you to evade attacks that should be impossible to dodge.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'When you take the Dodge action, can automatically succeed on Dexterity saves against area effects',
      'Once per round, can use reaction to halve damage from an attack',
      'Cannot be surprised while conscious',
      'Advantage on initiative rolls'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'once-per-turn',
      action: 'reaction'
    },
    flavor: 'Time seems to slow down for you in moments of danger.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'weapon-mastery',
    name: 'Weapon Mastery',
    description: 'You have mastered all forms of combat, able to wield any weapon with deadly efficiency.',
    prerequisites: {
      level: 5,
      ability: 'Strength',
      score: 13
    },
    benefits: [
      'Proficiency with all weapons and armor',
      '+2 to attack rolls with any weapon',
      'Can use any weapon property regardless of class',
      'Critical hits with any weapon deal extra 1d10 damage'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Every weapon feels like an extension of your body.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'berserker-rage',
    name: 'Berserker Rage',
    description: 'You can channel primal fury to become an unstoppable force on the battlefield.',
    prerequisites: {
      level: 3,
      ability: 'Constitution',
      score: 14
    },
    benefits: [
      'As a bonus action, enter rage state for 1 minute',
      'While raging: advantage on Strength checks and saves, +2 damage to melee attacks',
      'Resistance to bludgeoning, piercing, and slashing damage while raging',
      'Cannot be frightened while raging'
    ],
    mechanics: {
      type: 'active',
      frequency: 'short-rest',
      action: 'bonus-action'
    },
    flavor: 'The beast within awakens when battle is joined.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'precision-strikes',
    name: 'Precision Strikes',
    description: 'Your attacks are incredibly precise, striking at vital points with deadly accuracy.',
    prerequisites: {
      ability: 'Dexterity',
      score: 16
    },
    benefits: [
      'Once per turn, can add +1d6 precision damage to weapon attack',
      'Critical hits score an extra damage die',
      'Can ignore cover bonuses on attack rolls',
      'Attacks never miss due to concealment'
    ],
    mechanics: {
      type: 'triggered',
      frequency: 'once-per-turn',
      action: 'free'
    },
    flavor: 'Every strike finds its mark with surgical precision.',
    source: 'System Ascendant Canon'
  },

  // ADVANCED MAGICAL FEATS
  {
    id: 'arcane-mastery',
    name: 'Arcane Mastery',
    description: 'Your understanding of magic is so deep that you can bend and reshape spells at will.',
    prerequisites: {
      level: 9,
      ability: 'Intelligence',
      score: 16
    },
    benefits: [
      'Can learn spells from any class list',
      'Spells you cast have +1 to spell save DC',
      'Can cast two spells in one turn (one as bonus action)',
      'Once per day, can cast any spell without using a spell slot'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The very fabric of magic responds to your thoughts.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'spell-resistance',
    name: 'Spell Resistance',
    description: 'Your body and mind are resistant to magical effects, making you difficult to affect with spells.',
    prerequisites: {
      level: 7,
      ability: 'Constitution',
      score: 15
    },
    benefits: [
      'Advantage on all saving throws against spells',
      'Resistance to force, lightning, and thunder damage',
      'Cannot be charmed or frightened by magic',
      'Can use reaction to absorb one spell targeting you'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Magic flows around you like water around stone.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'metamagic-mastery',
    name: 'Metamagic Mastery',
    description: 'You can modify spells in ways that other spellcasters can only dream of.',
    prerequisites: {
      level: 5,
      ability: 'Charisma',
      score: 14
    },
    benefits: [
      'Can apply two metamagic effects to one spell',
      'Sorcery points maximum increased by 3',
      'Can create new metamagic effects with Warden approval',
      'Metamagic costs reduced by 1 sorcery point'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Spells are clay, and you are the master sculptor.',
    source: 'System Ascendant Canon'
  },

  // ADVANCED DEFENSIVE FEATS
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: 'Your mental fortitude is unbreakable, allowing you to resist effects that would break lesser beings.',
    prerequisites: {
      ability: 'Wisdom',
      score: 15
    },
    benefits: [
      'Advantage on Wisdom and Charisma saving throws',
      'Immunity to being frightened',
      'Cannot be possessed or controlled',
      'Can use reaction to end one charm or fear effect on yourself'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your mind is a fortress that no magic can breach.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'damage-reduction',
    name: 'Damage Reduction',
    description: 'Your body has become incredibly tough, reducing damage from all sources.',
    prerequisites: {
      level: 11,
      ability: 'Constitution',
      score: 16
    },
    benefits: [
      'Reduce all damage taken by 5 (minimum 1)',
      'Resistance to non-magical bludgeoning, piercing, and slashing',
      'Cannot be critically hit',
      'Regenerate 1 HP per round even at 0 HP'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your body has become as resilient as enchanted armor.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'regeneration',
    name: 'Regeneration',
    description: 'You heal at an accelerated rate, recovering from wounds that would cripple others.',
    prerequisites: {
      level: 9,
      ability: 'Constitution',
      score: 15
    },
    benefits: [
      'Regenerate 5 HP per round',
      'Regrow lost limbs over 1 week',
      'Cannot die from massive damage',
      'Can use action to heal 20 HP once per short rest'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your life force flows like an endless river.',
    source: 'System Ascendant Canon'
  },

  // ADVANCED UTILITY FEATS
  {
    id: 'master-of-disguise',
    name: 'Master of Disguise',
    description: 'You can assume any identity with perfect accuracy, fooling even magical detection.',
    prerequisites: {
      ability: 'Charisma',
      score: 14
    },
    benefits: [
      'Can disguise self as any creature with perfect accuracy',
      'Advantage on Deception checks while disguised',
      'Magical detection cannot reveal your true identity',
      'Can mimic voices and mannerisms perfectly'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will',
      action: 'action'
    },
    flavor: 'Identity is merely a costume you can change at will.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'enhanced-senses',
    name: 'Enhanced Senses',
    description: 'Your senses are supernaturally sharp, perceiving things others cannot detect.',
    prerequisites: {
      ability: 'Wisdom',
      score: 13
    },
    benefits: [
      'Advantage on all Perception checks',
      'Can see in magical darkness',
      'Can hear through walls up to 30 feet',
      'Can detect invisible creatures within 60 feet'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The world reveals its secrets to those who truly listen.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'speed-enhancement',
    name: 'Speed Enhancement',
    description: 'You move with supernatural speed, able to outrun the wind itself.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'Base speed increased by 20 feet',
      'Can take the Dash action as a bonus action',
      'Opportunity attacks against you have disadvantage',
      'Can run across water and vertical surfaces'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your feet barely touch the ground as you move.',
    source: 'System Ascendant Canon'
  },

  // COMBAT FEATS (SRD 5e Style)
  {
    id: 'great-weapon-master',
    name: 'Great Weapon Master',
    description: 'You\'ve mastered heavy weapons, allowing you to make devastating attacks at the cost of accuracy.',
    prerequisites: {
      ability: 'Strength',
      score: 13
    },
    benefits: [
      'On hit with heavy weapon, can add +10 damage but attack at disadvantage',
      'When you score critical hit with heavy weapon, add one additional damage die',
      'Can use bonus action to make an attack with heavy weapon after reducing creature to 0 HP',
      'Proficient with all martial weapons'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Heavy weapons feel light in your hands, and each strike carries immense power.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'polearm-master',
    name: 'Polearm Master',
    description: 'You can keep enemies at bay with a polearm and make opportunistic attacks.',
    prerequisites: {
      ability: 'Strength',
      score: 13
    },
    benefits: [
      'Can use bonus action to attack with opposite end of polearm (1d4 damage)',
      'Creatures provoke opportunity attacks when they enter your reach with polearm',
      '+1 to damage rolls with polearms',
      'Can use polearm one-handed'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your polearm creates an impenetrable zone of control around you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'You are a master of ranged combat, able to make impossible shots with ease.',
    prerequisites: {
      ability: 'Dexterity',
      score: 13
    },
    benefits: [
      'Attacking at long range doesn\'t impose disadvantage',
      'Ranged attacks ignore half and three-quarters cover',
      'Before attack, can take -5 penalty to gain +10 damage',
      '+2 to damage rolls with ranged weapons'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Distance and cover are meaningless obstacles to your marksmanship.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'crossbow-expert',
    name: 'Crossbow Expert',
    description: 'You are a master of crossbows, able to reload and fire with incredible speed.',
    prerequisites: {
      ability: 'Dexterity',
      score: 13
    },
    benefits: [
      'Ignore loading property of crossbows',
      'Can use hand crossbow in one hand while holding another weapon',
      'When you use Attack action and attack with one-handed weapon, can use bonus action to attack with hand crossbow',
      '+2 to attack rolls with crossbows'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your crossbows sing with deadly rhythm, bolts flying faster than the eye can follow.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dual-wielder',
    name: 'Dual Wielder',
    description: 'You are a master of fighting with two weapons simultaneously.',
    prerequisites: {
      ability: 'Dexterity',
      score: 15
    },
    benefits: [
      'Can draw or stow two one-handed weapons when you would normally draw or stow one',
      'Can use two-weapon fighting even when weapons aren\'t light',
      '+2 to AC while wielding two weapons',
      'Can add ability modifier to damage of off-hand weapon'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Two weapons dance in your hands as extensions of your will.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'You are a vigilant guardian, keeping enemies from escaping and protecting your allies.',
    benefits: [
      'When you hit creature with opportunity attack, speed drops to 0',
      'Creatures provoke opportunity attacks from you even when they take Disengage action',
      'Attacks of opportunity against you have disadvantage',
      'Can use reaction to make attack against creature that attacks ally within 5 feet'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You are the immovable object that stands between your allies and harm.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'tavern-brawler',
    name: 'Tavern Brawler',
    description: 'You are a master of improvised combat, able to use anything as a weapon.',
    benefits: [
      'Proficient with improvised weapons and unarmed strikes',
      'Strength modifier to damage rolls for unarmed strikes and improvised weapons',
      'Can use a bonus action to grapple a creature after hitting with unarmed strike or improvised weapon',
      'Can make unarmed strikes as bonus action when wielding improvised weapon'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'In your hands, a tankard is as deadly as a sword.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'charger',
    name: 'Charger',
    description: 'You are a master of charging attacks, able to devastate enemies with momentum.',
    benefits: [
      'When you take the Dash action, can use bonus action to make one melee weapon attack',
      'If you move at least 10 feet before attack, add +1d10 damage to first attack',
      'Can push creature 10 feet after charging attack',
      'Charging attacks cannot be countered'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Your charges carry the force of a thundering avalanche.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'grappler',
    name: 'Grappler',
    description: 'You are a master of grappling, able to restrain and control enemies with ease.',
    prerequisites: {
      ability: 'Strength',
      score: 13
    },
    benefits: [
      'Advantage on attack rolls against grappled creatures',
      'Can use action to try to pin creature grappled by you',
      'Pinned creatures have speed 0 and can\'t move',
      'Can grapple creatures up to two sizes larger'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Once you grab hold, escape becomes impossible.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shield-master',
    name: 'Shield Master',
    description: 'You are a master of shield combat, using your shield both defensively and offensively.',
    benefits: [
      'If you take Attack action and attack with melee weapon, can use bonus action to shove with shield',
      'Advantage on Dexterity saves against spells and harmful effects while wielding shield',
      'Can use shield to block area effects completely',
      'Shield attacks deal 1d4 + Strength damage'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Your shield is both wall and weapon in equal measure.',
    source: 'System Ascendant Canon'
  },

  // MAGIC FEATS (SRD 5e Style)
  {
    id: 'war-caster',
    name: 'War Caster',
    description: 'You are skilled at casting spells in the midst of combat.',
    benefits: [
      'Advantage on Constitution saves to maintain concentration on spells',
      'Can perform somatic components even with weapons or shields in hands',
      'Can use reaction to cast spell targeting creature that provokes opportunity attack',
      'Can cast spells as opportunity attacks'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Battle chaos cannot disrupt your magical focus.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'elemental-adept',
    name: 'Elemental Adept',
    description: 'You have mastered one element, allowing you to overcome resistance and enhance your spells.',
    prerequisites: {
      ability: 'Constitution',
      score: 13
    },
    benefits: [
      'Spells of chosen type ignore resistance to that damage type',
      'When casting spell of chosen type, can reroll one damage die',
      'Learn one cantrip of chosen element',
      '+1 to spell save DC for chosen element'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your chosen element bends to your will completely.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'telekinetic',
    name: 'Telekinetic',
    description: 'You have developed minor telekinetic abilities.',
    prerequisites: {
      ability: 'Intelligence',
      score: 13
    },
    benefits: [
      'Can use bonus action to try to move creature up to 30 feet (Strength save)',
      'Can manipulate objects weighing up to 1,000 pounds',
      'Can use telekinesis to make sleight of hand checks',
      'Can create telekinetic shield (+2 AC)'
    ],
    mechanics: {
      type: 'active',
      frequency: 'at-will'
    },
    flavor: 'Your mind extends beyond your body to touch the world.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'telepathic',
    name: 'Telepathic',
    description: 'You have developed minor telepathic abilities.',
    prerequisites: {
      ability: 'Wisdom',
      score: 13
    },
    benefits: [
      'Can communicate telepathically with creatures within 60 feet',
      'Can read surface thoughts of creatures within 30 feet',
      'Can cast suggestion once per day without spell slot',
      'Cannot be surprised by creatures with minds'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your thoughts reach out to touch the minds of others.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'skill-expert',
    name: 'Skill Expert',
    description: 'You have mastered one skill, becoming unparalleled in its use.',
    benefits: [
      'Gain proficiency in one skill',
      'Gain expertise in that skill (double proficiency bonus)',
      'Can use that skill even when normally impossible',
      'Critical successes with that skill have enhanced effects'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your chosen skill flows through you like second nature.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'keen-mind',
    name: 'Keen Mind',
    description: 'Your mind is incredibly sharp, with perfect memory and calculation abilities.',
    prerequisites: {
      ability: 'Intelligence',
      score: 13
    },
    benefits: [
      'Always know which way is north',
      'Always know exact number of hours until next sunrise or sunset',
      'Can recall anything you have seen or heard within past month',
      'Advantage on Intelligence checks'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your mind is a perfect library of all you have experienced.',
    source: 'System Ascendant Canon'
  },

  // DEFENSIVE FEATS (SRD 5e Style)
  {
    id: 'tough',
    name: 'Tough',
    description: 'Your body is incredibly resilient, with enhanced hit points and durability.',
    benefits: [
      'Increase maximum hit points by 2 per level',
      'Resistance to non-magical bludgeoning damage',
      'Can withstand extreme conditions without penalty',
      'Healing spells and effects restore additional hit points'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your body is as tough as the hardest steel.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'You have trained your mind and body to resist specific types of effects.',
    benefits: [
      'Gain proficiency in one saving throw of your choice',
      'Advantage on chosen saving throw',
      'Can reroll failed saving throw of chosen type once per long rest',
      'Immunity to minor effects of chosen type'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your chosen defense becomes unbreakable.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'durable',
    name: 'Durable',
    description: 'You have exceptional stamina and can recover quickly from exertion.',
    prerequisites: {
      ability: 'Constitution',
      score: 13
    },
    benefits: [
      'When you roll a Hit Die to regain hit points, minimum roll is equal to twice your Constitution modifier',
      'Can regain hit points during short rest without spending Hit Dice',
      'Advantage on Constitution saving throws against exhaustion',
      'Can fight for twice as long without rest'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your stamina seems endless, even in the most grueling conditions.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-armor-master',
    name: 'Heavy Armor Master',
    description: 'You can wear heavy armor with ease and ignore some damage.',
    prerequisites: {
      ability: 'Strength',
      score: 15
    },
    benefits: [
      'Can wear heavy armor without disadvantage on stealth',
      'Reduce non-magical bludgeoning, piercing, and slashing damage by 3',
      'Heavy armor doesn\'t reduce speed',
      'Can sleep in heavy armor without penalty'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Heavy armor becomes like a second skin to you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'medium-armor-master',
    name: 'Medium Armor Master',
    description: 'You are exceptionally skilled in medium armor, maximizing its benefits.',
    prerequisites: {
      ability: 'Constitution',
      score: 13
    },
    benefits: [
      'Wearing medium armor doesn\'t impose disadvantage on stealth checks',
      'Add +1 to AC while wearing medium armor',
      'Can add Constitution modifier to AC with medium armor',
      'Medium armor doesn\'t reduce speed'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Medium armor moves with you as if it were part of your body.',
    source: 'System Ascendant Canon'
  },

  // SKILL FEATS (SRD 5e Style)
  {
    id: 'actor',
    name: 'Actor',
    description: 'You are a master of performance and deception, able to impersonate others flawlessly.',
    benefits: [
      'Advantage on Deception and Performance checks when trying to pass as another person',
      'Can mimic speech and sounds perfectly',
      'Can duplicate creature\'s handwriting',
      'Can learn languages by hearing them spoken'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You can become anyone you wish to be.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'chef',
    name: 'Chef',
    description: 'You are a master of cooking, able to create meals that provide sustenance and comfort.',
    benefits: [
      'Gain proficiency with cook\'s utensils',
      'Can prepare meals that provide temporary hit points',
      'Meals you prepare provide advantage on Constitution saves for 8 hours',
      'Can identify ingredients and their properties'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your cooking nourishes both body and soul.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'guild-artisan',
    name: 'Guild Artisan',
    description: 'You are a master craftsman, respected in your guild and skilled in your trade.',
    benefits: [
      'Proficiency with one type of artisan\'s tools',
      'Can find guild members who will provide shelter and support',
      'Can craft items of exceptional quality',
      'Discount on materials and services from guild members'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your craft is recognized and respected throughout the land.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'herbalist',
    name: 'Herbalist',
    description: 'You are skilled in the use of herbs and natural remedies.',
    benefits: [
      'Proficiency with herbalism kit',
      'Can create healing potions and remedies',
      'Can identify magical plants and their properties',
      'Advantage on checks to find and harvest herbs'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Nature\'s pharmacy opens its secrets to you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'historian',
    name: 'Historian',
    description: 'You have deep knowledge of history and can recall information with perfect clarity.',
    benefits: [
      'Advantage on Intelligence (History) checks',
      'Can recall historical events with perfect accuracy',
      'Can identify historical artifacts and their significance',
      'Can learn from past mistakes to avoid repeating them'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'History speaks to you, and you listen.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'investigator',
    name: 'Investigator',
    description: 'You are skilled at uncovering secrets and solving mysteries.',
    benefits: [
      'Advantage on Intelligence (Investigation) checks',
      'Can find clues others would miss',
      'Can deduce hidden truths from evidence',
      'Can solve puzzles and mysteries with exceptional speed'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'No secret can remain hidden from your keen mind.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'medic',
    name: 'Medic',
    description: 'You are skilled in the arts of healing and medicine.',
    benefits: [
      'Proficiency with herbalism kit and healer\'s kit',
      'Can stabilize dying creatures without check',
      'Healing spells you cast restore additional hit points',
      'Can diagnose and treat diseases and conditions'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your hands bring healing to those who need it most.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'musician',
    name: 'Musician',
    description: 'You are a master of music, able to inspire and captivate audiences.',
    benefits: [
      'Proficiency with three musical instruments',
      'Can inspire allies with your performances',
      'Can use music to cast certain spells',
      'Can learn and remember any song after hearing it once'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your music moves the hearts and souls of all who hear it.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'navigator',
    name: 'Navigator',
    description: 'You are skilled at finding your way, even in the most unfamiliar territories.',
    benefits: [
      'Advantage on Wisdom (Survival) checks to navigate',
      'Can always know your exact location',
      'Can read maps and charts with perfect accuracy',
      'Can navigate through any terrain without getting lost'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The world unfolds before you like an open map.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'orator',
    name: 'Orator',
    description: 'You are a master of public speaking, able to sway crowds and inspire action.',
    benefits: [
      'Advantage on Charisma (Performance) checks for public speaking',
      'Can inspire large crowds with your words',
      'Can persuade even hostile audiences',
      'Your speeches are remembered and repeated'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your words have the power to change the world.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'scribe',
    name: 'Scribe',
    description: 'You are skilled in the arts of writing and calligraphy.',
    benefits: [
      'Proficiency with calligrapher\'s supplies',
      'Can create documents of exceptional quality',
      'Can forge documents and signatures',
      'Can read and write any language you can speak'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your pen is mightier than any sword.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'scout',
    name: 'Scout',
    description: 'You are skilled at reconnaissance and gathering information.',
    benefits: [
      'Advantage on Dexterity (Stealth) and Wisdom (Perception) checks',
      'Can move silently and remain unseen',
      'Can gather information without being detected',
      'Can create detailed maps of explored areas'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You move like a shadow, seeing all while remaining unseen.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'thief',
    name: 'Thief',
    description: 'You are skilled in the arts of stealth and larceny.',
    benefits: [
      'Proficiency with thieves\' tools',
      'Can use Cunning Action to hide or disengage as bonus action',
      'Can climb at full speed without penalty',
      'Can pick locks and disarm traps with exceptional skill'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You move through the world unseen, taking what you need.',
    source: 'System Ascendant Canon'
  },

  // RACIAL FEATS (SRD 5e Style - Adapted for System Ascendant)
  {
    id: 'shadow-heritage',
    name: 'Shadow Heritage',
    description: 'Your connection to shadows grants you enhanced shadow abilities.',
    prerequisites: {
      background: 'Shadow Walker'
    },
    benefits: [
      'Advantage on saves against shadow-based effects',
      'Can cast minor shadow spells without using spell slots',
      'Enhanced stealth in darkness',
      'Can communicate with shadow creatures'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Shadow blood flows through your veins, granting you power over darkness.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'hunter-born',
    name: 'Ascendant Born',
    description: 'Your ascendant heritage grants you exceptional tracking and survival skills.',
    prerequisites: {
      background: 'Ascendant Academy Graduate'
    },
    benefits: [
      'Advantage on tracking and survival checks',
      'Can identify any creature by its tracks',
      'Can predict creature behavior',
      'Enhanced combat against hunted prey'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'The hunt is in your blood, and no prey can escape you.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mage-scholar',
    name: 'Mage Scholar',
    description: 'Your magical education grants you enhanced arcane abilities.',
    prerequisites: {
      background: 'Mage'
    },
    benefits: [
      'Can learn additional spells',
      'Advantage on Arcana checks',
      'Can cast spells with enhanced power',
      'Access to forbidden magical knowledge'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your magical knowledge sets you apart from lesser practitioners.',
    source: 'System Ascendant Canon'
  },

  // EPIC FEATS (High Level)
  {
    id: 'epic-resilience',
    name: 'Epic Resilience',
    description: 'Your body and mind are incredibly resilient, able to withstand almost any effect.',
    prerequisites: {
      level: 15
    },
    benefits: [
      'Advantage on all saving throws',
      'Resistance to all damage types',
      'Cannot be frightened, charmed, or controlled',
      'Regenerate 10 HP per round'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You are a fortress that no force can breach.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-speed',
    name: 'Epic Speed',
    description: 'You move with supernatural speed, able to outrun even the fastest creatures.',
    prerequisites: {
      level: 15
    },
    benefits: [
      'Base speed doubled',
      'Can take three Dash actions per turn',
      'Can move through enemy spaces without provoking attacks',
      'Can run up walls and across water'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You move faster than the eye can follow.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-strength',
    name: 'Epic Strength',
    description: 'Your physical strength is legendary, allowing you to perform impossible feats.',
    prerequisites: {
      level: 15,
      ability: 'Strength',
      score: 20
    },
    benefits: [
      'Strength score increases to 24',
      'Can lift and throw massive objects',
      'Attacks automatically hit and critically hit',
      'Can break through any barrier'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your strength is the stuff of legends.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-intellect',
    name: 'Epic Intellect',
    description: 'Your mind is incredibly sharp, able to solve any problem and learn instantly.',
    prerequisites: {
      level: 15,
      ability: 'Intelligence',
      score: 20
    },
    benefits: [
      'Intelligence score increases to 24',
      'Can learn anything instantly',
      'Can solve any puzzle or mystery',
      'Can cast any spell without preparation'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your intellect transcends mortal limitations.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-wisdom',
    name: 'Epic Wisdom',
    description: 'Your wisdom is profound, allowing you to see the truth in all things.',
    prerequisites: {
      level: 15,
      ability: 'Wisdom',
      score: 20
    },
    benefits: [
      'Wisdom score increases to 24',
      'Can see through all illusions and deceptions',
      'Can predict the future with perfect accuracy',
      'Can communicate with any creature'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your wisdom sees the truth that others miss.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-charisma',
    name: 'Epic Charisma',
    description: 'Your presence is so commanding that all creatures are drawn to you.',
    prerequisites: {
      level: 15,
      ability: 'Charisma',
      score: 20
    },
    benefits: [
      'Charisma score increases to 24',
      'All creatures are friendly toward you',
      'Can persuade any creature of anything',
      'Can command armies with your presence alone'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your presence inspires awe and devotion in all who witness it.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-dexterity',
    name: 'Epic Dexterity',
    description: 'Your agility and reflexes are supernatural, allowing you to perform impossible feats.',
    prerequisites: {
      level: 15,
      ability: 'Dexterity',
      score: 20
    },
    benefits: [
      'Dexterity score increases to 24',
      'Cannot be hit by attacks',
      'Can dodge any effect',
      'Can perform any acrobatic feat'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'You move with impossible grace and precision.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'epic-constitution',
    name: 'Epic Constitution',
    description: 'Your vitality is boundless, allowing you to survive anything.',
    prerequisites: {
      level: 15,
      ability: 'Constitution',
      score: 20
    },
    benefits: [
      'Constitution score increases to 24',
      'Cannot be reduced below 1 HP',
      'Immune to all damage types',
      'Regenerate to full HP instantly'
    ],
    mechanics: {
      type: 'passive',
      frequency: 'at-will'
    },
    flavor: 'Your vitality is truly endless.',
    source: 'System Ascendant Canon'
  }
];




