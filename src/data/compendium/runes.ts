// Comprehensive Runes Compendium
// Generated with full admin privileges
// System Ascendant themed magical runes with images

export interface Rune {
  id: string;
  name: string;
  description: string;
  element: 'shadow' | 'fire' | 'ice' | 'lightning' | 'healing' | 'protection';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: string;
  effect: string;
  power: number;
  cooldown: number;
}

export const runesCompendium: Rune[] = [
  {
    id: 'shadow-rune',
    name: 'Rune of Eternal Shadow',
    description: 'A powerful rune that embodies the essence of shadow itself. Grants mastery over shadow magic and enhances stealth capabilities.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/shadow-rune.webp',
    effect: 'Grants +50% shadow damage and +30% stealth effectiveness',
    power: 150,
    cooldown: 60
  },
  {
    id: 'fire-rune',
    name: 'Rune of Infernal Flames',
    description: 'A blazing rune that channels the destructive power of fire. Enhances fire-based abilities and grants resistance to heat.',
    element: 'fire',
    rarity: 'epic',
    image: '/generated/runes/fire-rune.webp',
    effect: 'Grants +40% fire damage and +25% fire resistance',
    power: 120,
    cooldown: 45
  },
  {
    id: 'ice-rune',
    name: 'Rune of Frozen Eternal',
    description: 'A chilling rune that harnesses the power of ice. Slows enemies and enhances ice-based spells.',
    element: 'ice',
    rarity: 'epic',
    image: '/generated/runes/ice-rune.webp',
    effect: 'Grants +35% ice damage and slows enemies by 20%',
    power: 110,
    cooldown: 40
  },
  {
    id: 'lightning-rune',
    name: 'Rune of Thunder Strike',
    description: 'An electrifying rune that commands the power of lightning. Grants speed and enhances electrical attacks.',
    element: 'lightning',
    rarity: 'rare',
    image: '/generated/runes/lightning-rune.webp',
    effect: 'Grants +30% lightning damage and +15% movement speed',
    power: 100,
    cooldown: 35
  },
  {
    id: 'healing-rune',
    name: 'Rune of Vital Restoration',
    description: 'A soothing rune that channels restorative energy. Accelerates healing and removes harmful effects.',
    element: 'healing',
    rarity: 'rare',
    image: '/generated/runes/healing-rune.webp',
    effect: 'Grants +25% healing effectiveness and removes debuffs',
    power: 80,
    cooldown: 30
  },
  {
    id: 'protection-rune',
    name: 'Rune of Divine Protection',
    description: 'A protective rune that creates barriers against harm. Provides defensive bonuses and shields allies.',
    element: 'protection',
    rarity: 'epic',
    image: '/generated/runes/protection-rune.webp',
    effect: 'Grants +35% damage reduction and protective barrier',
    power: 90,
    cooldown: 50
  },

  // ADVANCED ELEMENTAL RUNES
  {
    id: 'void-rune',
    name: 'Rune of Cosmic Void',
    description: 'A mysterious rune that taps into the void between dimensions. Grants reality-warping abilities and dimensional travel.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/void-rune.webp',
    effect: 'Grants dimensional travel and reality manipulation powers',
    power: 200,
    cooldown: 120
  },
  {
    id: 'blood-rune',
    name: 'Rune of Blood Sacrifice',
    description: 'A forbidden rune that channels life force into power. Enhances abilities at the cost of health.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/blood-rune.webp',
    effect: 'Converts health into magical power and enhanced abilities',
    power: 140,
    cooldown: 70
  },
  {
    id: 'storm-rune',
    name: 'Rune of Tempest Fury',
    description: 'A powerful rune that commands the forces of nature. Grants control over weather and elemental storms.',
    element: 'lightning',
    rarity: 'legendary',
    image: '/generated/runes/storm-rune.webp',
    effect: 'Grants weather control and storm-based abilities',
    power: 130,
    cooldown: 55
  },
  {
    id: 'frost-rune',
    name: 'Rune of Absolute Zero',
    description: 'An extremely cold rune that can freeze time itself. Grants cryogenic powers and temporal manipulation.',
    element: 'ice',
    rarity: 'legendary',
    image: '/generated/runes/frost-rune.webp',
    effect: 'Grants time-freezing abilities and absolute cold powers',
    power: 125,
    cooldown: 60
  },
  {
    id: 'magma-rune',
    name: 'Rune of Magma Core',
    description: 'A scorching rune that draws power from the earth\'s core. Grants volcanic abilities and earth manipulation.',
    element: 'fire',
    rarity: 'epic',
    image: '/generated/runes/magma-rune.webp',
    effect: 'Grants earth manipulation and volcanic powers',
    power: 115,
    cooldown: 50
  },

  // ADVANCED UTILITY RUNES
  {
    id: 'time-rune',
    name: 'Rune of Temporal Flow',
    description: 'A mystical rune that manipulates the flow of time. Grants temporal abilities and future sight.',
    element: 'protection',
    rarity: 'legendary',
    image: '/generated/runes/time-rune.webp',
    effect: 'Grants time manipulation and future vision',
    power: 180,
    cooldown: 100
  },
  {
    id: 'mind-rune',
    name: 'Rune of Mental Dominion',
    description: 'A psychic rune that enhances mental powers. Grants telepathy, mind control, and enhanced intelligence.',
    element: 'protection',
    rarity: 'legendary',
    image: '/generated/runes/mind-rune.webp',
    effect: 'Grants telepathy and mind control abilities',
    power: 135,
    cooldown: 65
  },
  {
    id: 'soul-rune',
    name: 'Rune of Soul Binding',
    description: 'A spiritual rune that interacts with souls and spirits. Grants spiritual communication and soul manipulation.',
    element: 'healing',
    rarity: 'legendary',
    image: '/generated/runes/soul-rune.webp',
    effect: 'Grants spiritual communication and soul manipulation',
    power: 120,
    cooldown: 75
  },
  {
    id: 'life-rune',
    name: 'Rune of Life Force',
    description: 'A vibrant rune that channels pure life energy. Grants enhanced healing and regeneration abilities.',
    element: 'healing',
    rarity: 'epic',
    image: '/generated/runes/life-rune.webp',
    effect: 'Grants regeneration and enhanced life force',
    power: 95,
    cooldown: 40
  },
  {
    id: 'death-rune',
    name: 'Rune of Final Rest',
    description: 'A grim rune that commands the power of death. Grants necromantic abilities and death resistance.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/death-rune.webp',
    effect: 'Grants necromancy and death resistance',
    power: 145,
    cooldown: 80
  },

  // ADVANCED COMBAT RUNES
  {
    id: 'war-rune',
    name: 'Rune of Eternal Conflict',
    description: 'A battle-focused rune that enhances combat abilities and tactical awareness. Grants superior combat prowess.',
    element: 'protection',
    rarity: 'epic',
    image: '/generated/runes/war-rune.webp',
    effect: 'Grants enhanced combat abilities and tactical awareness',
    power: 105,
    cooldown: 45
  },
  {
    id: 'assassin-rune',
    name: 'Rune of Silent Death',
    description: 'A stealth-focused rune that perfects assassination techniques. Grants enhanced stealth and lethal precision.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/assassin-rune.webp',
    effect: 'Grants perfect stealth and lethal precision',
    power: 155,
    cooldown: 85
  },
  {
    id: 'guardian-rune',
    name: 'Rune of Unbreakable Defense',
    description: 'A defensive rune that provides unparalleled protection. Grants enhanced durability and protective abilities.',
    element: 'protection',
    rarity: 'epic',
    image: '/generated/runes/guardian-rune.webp',
    effect: 'Grants enhanced defense and protective abilities',
    power: 100,
    cooldown: 55
  },
  {
    id: 'rune-of-the-storm',
    name: 'Rune of the Storm',
    description: 'A rune that channels the power of thunder and lightning.',
    element: 'lightning',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-the-storm.webp',
    effect: 'Grants control over weather and electrical energy',
    power: 120,
    cooldown: 60
  },
  {
    id: 'rune-of-the-void',
    name: 'Rune of the Void',
    description: 'A rune that taps into the emptiness between dimensions.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-the-void.webp',
    effect: 'Allows manipulation of space and dimensional barriers',
    power: 150,
    cooldown: 90
  },
  {
    id: 'rune-of-life',
    name: 'Rune of Life',
    description: 'A rune that channels vital energy and healing power.',
    element: 'healing',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-life.webp',
    effect: 'Provides powerful healing and regeneration abilities',
    power: 100,
    cooldown: 45
  },
  {
    id: 'rune-of-death',
    name: 'Rune of Death',
    description: 'A rune that commands the power of necromancy and undeath.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-death.webp',
    effect: 'Grants control over death and undead forces',
    power: 140,
    cooldown: 80
  },
  {
    id: 'rune-of-time',
    name: 'Rune of Time',
    description: 'A rune that manipulates the flow of time itself.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-time.webp',
    effect: 'Allows limited control over temporal effects',
    power: 160,
    cooldown: 120
  },
  {
    id: 'rune-of-space',
    name: 'Rune of Space',
    description: 'A rune that bends spatial dimensions and distances.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-space.webp',
    effect: 'Enables teleportation and spatial manipulation',
    power: 130,
    cooldown: 75
  },
  {
    id: 'rune-of-mind',
    name: 'Rune of Mind',
    description: 'A rune that enhances mental abilities and psychic power.',
    element: 'shadow',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-mind.webp',
    effect: 'Boosts psychic abilities and mental defenses',
    power: 90,
    cooldown: 50
  },
  {
    id: 'rune-of-soul',
    name: 'Rune of Soul',
    description: 'A rune that affects the very essence of beings.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-soul.webp',
    effect: 'Manipulates spiritual energy and soul essence',
    power: 170,
    cooldown: 100
  },
  {
    id: 'rune-of-blood',
    name: 'Rune of Blood',
    description: 'A rune that channels life force and blood magic.',
    element: 'fire',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-blood.webp',
    effect: 'Enhances physical power and life force manipulation',
    power: 110,
    cooldown: 55
  },
  {
    id: 'rune-of-frost',
    name: 'Rune of Frost',
    description: 'A rune that channels the biting cold of eternal winter.',
    element: 'ice',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-frost.webp',
    effect: 'Grants control over ice and cold temperatures',
    power: 95,
    cooldown: 50
  },
  {
    id: 'rune-of-flames',
    name: 'Rune of Flames',
    description: 'A rune that burns with the intensity of a supernova.',
    element: 'fire',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-flames.webp',
    effect: 'Provides mastery over fire and heat',
    power: 105,
    cooldown: 52
  },
  {
    id: 'rune-of-winds',
    name: 'Rune of Winds',
    description: 'A rune that commands the power of air and movement.',
    element: 'lightning',
    rarity: 'rare',
    image: '/generated/compendium/runes/rune-of-winds.webp',
    effect: 'Grants control over wind and air currents',
    power: 80,
    cooldown: 40
  },
  {
    id: 'rune-of-earth',
    name: 'Rune of Earth',
    description: 'A rune that channels the stability and power of the ground.',
    element: 'protection',
    rarity: 'rare',
    image: '/generated/compendium/runes/rune-of-earth.webp',
    effect: 'Provides earth manipulation and defensive power',
    power: 85,
    cooldown: 45
  },
  {
    id: 'rune-of-light',
    name: 'Rune of Light',
    description: 'A rune that radiates pure divine illumination.',
    element: 'healing',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-light.webp',
    effect: 'Grants control over light and healing energy',
    power: 90,
    cooldown: 48
  },
  {
    id: 'rune-of-darkness',
    name: 'Rune of Darkness',
    description: 'A rune that embodies the deepest shadows and void.',
    element: 'shadow',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-darkness.webp',
    effect: 'Provides mastery over darkness and shadow magic',
    power: 100,
    cooldown: 55
  },
  {
    id: 'rune-of-dreams',
    name: 'Rune of Dreams',
    description: 'A rune that touches the realm of sleep and imagination.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-dreams.webp',
    effect: 'Allows manipulation of dreams and subconscious',
    power: 120,
    cooldown: 70
  },
  {
    id: 'rune-of-fate',
    name: 'Rune of Fate',
    description: 'A rune that influences destiny and probability.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-fate.webp',
    effect: 'Grants limited control over fate and luck',
    power: 140,
    cooldown: 85
  },
  {
    id: 'rune-of-chaos',
    name: 'Rune of Chaos',
    description: 'A rune that embodies unpredictable and wild energy.',
    element: 'fire',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-chaos.webp',
    effect: 'Introduces chaos and randomness to effects',
    power: 130,
    cooldown: 80
  },
  {
    id: 'rune-of-order',
    name: 'Rune of Order',
    description: 'A rune that brings structure and stability to chaos.',
    element: 'protection',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-order.webp',
    effect: 'Imposes order and predictability on effects',
    power: 95,
    cooldown: 50
  },
  {
    id: 'rune-of-hope',
    name: 'Rune of Hope',
    description: 'A rune that inspires courage and determination.',
    element: 'healing',
    rarity: 'rare',
    image: '/generated/compendium/runes/rune-of-hope.webp',
    effect: 'Boosts morale and provides protective blessings',
    power: 75,
    cooldown: 35
  },
  {
    id: 'rune-of-despair',
    name: 'Rune of Despair',
    description: 'A rune that drains hope and instills fear.',
    element: 'shadow',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-despair.webp',
    effect: 'Causes fear and hopelessness in enemies',
    power: 90,
    cooldown: 45
  },
  {
    id: 'rune-of-creation',
    name: 'Rune of Creation',
    description: 'A rune that brings new things into existence.',
    element: 'healing',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-creation.webp',
    effect: 'Allows creation of matter from nothing',
    power: 150,
    cooldown: 100
  },
  {
    id: 'rune-of-destruction',
    name: 'Rune of Destruction',
    description: 'A rune that unmakes and annihilates what exists.',
    element: 'fire',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-destruction.webp',
    effect: 'Causes widespread destruction and annihilation',
    power: 160,
    cooldown: 110
  },
  {
    id: 'rune-of-balance',
    name: 'Rune of Balance',
    description: 'A rune that maintains equilibrium between forces.',
    element: 'protection',
    rarity: 'legendary',
    image: '/generated/compendium/runes/rune-of-balance.webp',
    effect: 'Balances opposing forces and energies',
    power: 120,
    cooldown: 75
  },
  {
    id: 'rune-of-knowledge',
    name: 'Rune of Knowledge',
    description: 'A rune that reveals hidden truths and secrets.',
    element: 'shadow',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-knowledge.webp',
    effect: 'Grants access to hidden information and wisdom',
    power: 85,
    cooldown: 40
  },
  {
    id: 'rune-of-ignorance',
    name: 'Rune of Ignorance',
    description: 'A rune that clouds minds and obscures truth.',
    element: 'shadow',
    rarity: 'rare',
    image: '/generated/compendium/runes/rune-of-ignorance.webp',
    effect: 'Causes confusion and memory loss',
    power: 70,
    cooldown: 30
  },
  {
    id: 'rune-of-vitality',
    name: 'Rune of Vitality',
    description: 'A rune that enhances life force and endurance.',
    element: 'healing',
    rarity: 'epic',
    image: '/generated/compendium/runes/rune-of-vitality.webp',
    effect: 'Boosts life force and physical endurance',
    power: 88,
    cooldown: 42
  },
  {
    id: 'rune-of-exhaustion',
    name: 'Rune of Exhaustion',
    description: 'A rune that drains energy and causes fatigue.',
    element: 'shadow',
    rarity: 'rare',
    image: '/generated/compendium/runes/rune-of-exhaustion.webp',
    effect: 'Causes extreme fatigue and energy drain',
    power: 72,
    cooldown: 32
  }
];

export const runes = runesCompendium;
export default runesCompendium;

