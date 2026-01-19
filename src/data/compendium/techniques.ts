// Techniques Compendium - Authoritative Solo Leveling Content
// Combat maneuvers and martial techniques
// Based on Solo Leveling canon with D&D 5e mechanics

export interface Technique {
  id: string;
  name: string;
  description: string;
  type: 'offensive' | 'defensive' | 'mobility' | 'utility' | 'finishing';
  style: 'unarmed' | 'weapon' | 'ranged' | 'dual-wielding' | 'two-handed' | 'shield' | 'any';
  prerequisites?: {
    level?: number;
    class?: string;
    ability?: string;
    score?: number;
    proficiency?: string[];
    technique?: string[];
  };
  activation: {
    type: 'action' | 'bonus-action' | 'reaction' | 'free';
    cost?: string;
  };
  duration?: {
    type: 'instantaneous' | 'concentration' | 'until-dispel' | 'timed';
    time?: string;
  };
  range?: {
    type: 'melee' | 'ranged' | 'self' | 'area';
    distance?: number;
  };
  components?: {
    verbal?: boolean;
    somatic?: boolean;
    material?: boolean;
    material_desc?: string;
  };
  effects: {
    primary: string;
    secondary?: string;
    tertiary?: string;
  };
  mechanics: {
    attack?: {
      type: 'melee' | 'ranged';
      modifier?: string;
      damage?: string;
    };
    saving_throw?: {
      ability: string;
      dc: string;
      success: string;
      failure: string;
    };
    movement?: {
      type: 'teleport' | 'step' | 'dash' | 'jump' | 'climb';
      distance?: number;
    };
    condition?: string[];
  };
  limitations?: {
    uses?: string;
    cooldown?: string;
    conditions?: string[];
    exhaustion?: string;
  };
  flavor: string;
  source: string;
  image?: string;
}

export const techniques: Technique[] = [
  // OFFENSIVE TECHNIQUES
  {
    id: 'shadow-strike',
    name: 'Shadow Strike',
    description: 'A devastating attack that strikes from unexpected angles.',
    type: 'offensive',
    style: 'weapon',
    prerequisites: {
      level: 5,
      ability: 'Dexterity',
      score: 15
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack with advantage and deal extra damage equal to your proficiency bonus.',
      secondary: 'Target must make Constitution saving throw or be blinded until your next turn.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity',
        damage: 'extra piercing'
      },
      saving_throw: {
        ability: 'Constitution',
        dc: '8 + proficiency bonus + Dexterity modifier',
        success: 'No effect',
        failure: 'Blinded until your next turn'
      }
    },
    limitations: {
      uses: '3 times per short rest',
      cooldown: 'Short rest'
    },
    flavor: 'You strike from the shadows themselves, appearing where your enemy least expects.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/shadow-strike.webp'
  },
  {
    id: 'dragon-fist',
    name: 'Dragon Fist',
    description: 'A powerful unarmed strike that channels draconic energy.',
    type: 'offensive',
    style: 'unarmed',
    prerequisites: {
      level: 8,
      class: 'Monk'
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Deal 3d10 force damage plus your Strength modifier.',
      secondary: 'Target must make Strength saving throw or be pushed 10 feet away and knocked prone.',
      tertiary: 'If you spend 2 ki points, damage increases to 4d10 and push distance becomes 20 feet.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength',
        damage: 'force'
      },
      saving_throw: {
        ability: 'Strength',
        dc: '8 + proficiency bonus + Wisdom modifier',
        success: 'No effect',
        failure: 'Pushed 10 feet and knocked prone'
      }
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Must spend 2 ki points for enhanced effect']
    },
    flavor: 'Your fist channels the raw power of ancient dragons, striking with devastating force.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/dragon-fist.webp'
  },
  {
    id: 'void-slash',
    name: 'Void Slash',
    description: 'A dimensional cutting attack that bypasses conventional defenses.',
    type: 'offensive',
    style: 'weapon',
    prerequisites: {
      level: 12,
      ability: 'Dexterity',
      score: 17
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack ignores all armor and resistance.',
      secondary: 'If you hit, you can teleport to an unoccupied space within 30 feet as a bonus action.',
      tertiary: 'Critical hits deal maximum damage and teleport the target to a random location within 30 feet.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity',
        damage: 'force'
      },
      movement: {
        type: 'teleport',
        distance: 30
      }
    },
    limitations: {
      uses: 'Once per turn',
      cooldown: 'None'
    },
    flavor: 'Your weapon cuts through dimensions themselves, ignoring conventional defenses.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/void-slash.webp'
  },
  {
    id: 'void-slash',
    name: 'Void Slash',
    description: 'A dimensional cutting attack that bypasses conventional defenses.',
    type: 'offensive',
    style: 'weapon',
    prerequisites: {
      level: 12,
      ability: 'Dexterity',
      score: 17
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack ignores all armor and resistance.',
      secondary: 'If you hit, you can teleport to an unoccupied space within 30 feet as a bonus action.',
      tertiary: 'Critical hits deal maximum damage and teleport the target to a random location within 30 feet.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity',
        damage: 'force'
      },
      movement: {
        type: 'teleport',
        distance: 30
      }
    },
    limitations: {
      uses: 'Once per turn',
      cooldown: 'None'
    },
    flavor: 'Your weapon cuts through dimensions themselves, ignoring conventional defenses.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/void-slash.webp'
  },
  {
    id: 'multi-shot',
    name: 'Multi-Shot',
    description: 'Fire multiple arrows at different targets simultaneously.',
    type: 'offensive',
    style: 'ranged',
    prerequisites: {
      level: 6,
      proficiency: ['Longbow', 'Shortbow']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'ranged'
    },
    effects: {
      primary: 'Make three ranged attacks against different targets within range.',
      secondary: 'Each attack uses your full attack bonus but deals only half damage.',
      tertiary: 'If you have the Sharpshooter feat, you can make four attacks instead of three.'
    },
    mechanics: {
      attack: {
        type: 'ranged',
        modifier: 'Dexterity',
        damage: 'half'
      }
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Must have enough ammunition', 'Targets must be different']
    },
    flavor: 'Your arrows fly in impossible arcs, striking multiple foes in a single motion.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/multi-shot.webp'
  },
  {
    id: 'whirlwind-strike',
    name: 'Whirlwind Strike',
    description: 'A spinning attack that strikes all nearby enemies.',
    type: 'offensive',
    style: 'two-handed',
    prerequisites: {
      level: 10,
      proficiency: ['Greatsword', 'Battleaxe', 'Maul']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'area',
      distance: 10
    },
    effects: {
      primary: 'Make one melee attack against each creature within 10 feet.',
      secondary: 'Each creature can only be targeted once per use of this technique.',
      tertiary: 'If you hit with all attacks, you can make an additional attack as a bonus action.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength'
      }
    },
    limitations: {
      uses: 'Once per turn',
      cooldown: 'None'
    },
    flavor: 'You spin like a vortex of steel, striking all who dare approach.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/whirlwind-strike.webp'
  },

  // DEFENSIVE TECHNIQUES
  {
    id: 'shadow-dodge',
    name: 'Shadow Dodge',
    description: 'Phase through shadows to avoid attacks.',
    type: 'defensive',
    style: 'any',
    prerequisites: {
      level: 4,
      ability: 'Dexterity'
    },
    activation: {
      type: 'reaction'
    },
    effects: {
      primary: 'When targeted by an attack, teleport to an unoccupied space within 30 feet in dim light or darkness.',
      secondary: 'The attack automatically misses.',
      tertiary: 'You can use this technique even if you are surprised.'
    },
    mechanics: {
      movement: {
        type: 'teleport',
        distance: 30
      }
    },
    limitations: {
      uses: '3 times per short rest',
      cooldown: 'Short rest',
      conditions: ['Must have shadows or dim light available']
    },
    flavor: 'You melt into the shadows, becoming untouchable as long as darkness surrounds you.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/shadow-dodge.webp'
  },
  {
    id: 'iron-wall',
    name: 'Iron Wall',
    description: 'An impenetrable defensive stance.',
    type: 'defensive',
    style: 'shield',
    prerequisites: {
      level: 6,
      proficiency: ['Shield']
    },
    activation: {
      type: 'reaction'
    },
    effects: {
      primary: 'Gain resistance to bludgeoning, piercing, and slashing damage until your next turn.',
      secondary: 'Allies within 5 feet gain half damage resistance to the same damage types.',
      tertiary: 'Cannot be moved against your will while using this technique.'
    },
    mechanics: {
      condition: ['resistance', 'immovable']
    },
    limitations: {
      uses: '2 times per short rest',
      cooldown: 'Short rest'
    },
    flavor: 'Your shield becomes an unbreakable wall, protecting you and your allies.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/iron-wall.webp'
  },
  {
    id: 'counter-strike',
    name: 'Counter Strike',
    description: 'Turn an enemy\'s attack against them.',
    type: 'defensive',
    style: 'weapon',
    prerequisites: {
      level: 8,
      ability: 'Dexterity',
      score: 15
    },
    activation: {
      type: 'reaction'
    },
    effects: {
      primary: 'When a creature misses you with a melee attack, you can make an immediate melee attack against them.',
      secondary: 'Your attack deals extra damage equal to your proficiency bonus.',
      tertiary: 'If you score a critical hit, the target is knocked prone.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity',
        damage: 'extra'
      }
    },
    limitations: {
      uses: 'Once per turn',
      cooldown: 'None'
    },
    flavor: 'You turn your enemy\'s missed attack into an opening for your own devastating strike.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/counter-strike.webp'
  },
  {
    id: 'deflect-arrows',
    name: 'Deflect Arrows',
    description: 'Deflect incoming projectiles with your weapon.',
    type: 'defensive',
    style: 'weapon',
    prerequisites: {
      level: 5,
      proficiency: ['Sword', 'Dagger']
    },
    activation: {
      type: 'reaction'
    },
    effects: {
      primary: 'When targeted by a ranged weapon attack, you can deflect it with your weapon.',
      secondary: 'The attack automatically misses.',
      tertiary: 'If you spend a reaction point, you can redirect the attack to another creature within range.'
    },
    mechanics: {
      condition: ['Reaction to ranged attack', 'Deflects projectile']
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Must be wielding a suitable weapon', 'Limited to one projectile per reaction']
    },
    flavor: 'Your weapon becomes a shield, deflecting arrows and bolts as if they were mere annoyances.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/deflect-arrows.webp'
  },
  {
    id: 'guardian-stance',
    name: 'Guardian Stance',
    description: 'A protective stance that shields nearby allies.',
    type: 'defensive',
    style: 'any',
    prerequisites: {
      level: 7,
      class: 'Fighter'
    },
    activation: {
      type: 'bonus-action'
    },
    duration: {
      type: 'concentration',
      time: '1 minute'
    },
    effects: {
      primary: 'Allies within 10 feet gain +2 to AC.',
      secondary: 'When an ally within 10 feet is attacked, you can use your reaction to impose disadvantage on the attack.',
      tertiary: 'You cannot move while maintaining this stance.'
    },
    mechanics: {
      condition: ['Concentration', 'Bonus action activation', 'Provides AC bonus to allies']
    },
    limitations: {
      uses: '3 times per long rest',
      cooldown: 'Long rest'
    },
    flavor: 'You become a living shield, protecting your allies with your very presence.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/guardian-stance.webp'
  },

  // MOBILITY TECHNIQUES
  {
    id: 'shadow-step',
    name: 'Shadow Step',
    description: 'Teleport through shadows to reposition yourself.',
    type: 'mobility',
    style: 'any',
    prerequisites: {
      level: 3,
      ability: 'Dexterity'
    },
    activation: {
      type: 'bonus-action'
    },
    effects: {
      primary: 'Teleport up to 30 feet to an unoccupied space in dim light or darkness.',
      secondary: 'Cannot be tracked by normal sight while teleporting.',
      tertiary: 'If you end your movement in dim light or darkness, you can immediately take the Hide action as a bonus action.'
    },
    mechanics: {
      movement: {
        type: 'teleport',
        distance: 30
      }
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Must have shadows or dim light available']
    },
    flavor: 'You step through the shadows themselves, appearing where your enemies least expect.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/shadow-step-mobility.webp'
  },
  {
    id: 'wind-dash',
    name: 'Wind Dash',
    description: 'Move with supernatural speed and grace.',
    type: 'mobility',
    style: 'any',
    prerequisites: {
      level: 4,
      ability: 'Dexterity',
      score: 14
    },
    activation: {
      type: 'bonus-action'
    },
    effects: {
      primary: 'Move up to your movement speed without provoking opportunity attacks.',
      secondary: 'Can move through difficult terrain without penalty.',
      tertiary: 'If you end your movement adjacent to an enemy, you can make one melee attack as a bonus action.'
    },
    mechanics: {
      movement: {
        type: 'dash'
      }
    },
    limitations: {
      uses: 'Twice per short rest',
      cooldown: 'Short rest'
    },
    flavor: 'You move like the wind itself, too fast for enemies to track your movements.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/wind-dash.webp'
  },
  {
    id: 'wall-run',
    name: 'Wall Run',
    description: 'Run along vertical surfaces with ease.',
    type: 'mobility',
    style: 'any',
    prerequisites: {
      level: 5,
      ability: 'Strength',
      score: 13
    },
    activation: {
      type: 'free'
    },
    effects: {
      primary: 'Can run along vertical surfaces and ceilings as if they were horizontal.',
      secondary: 'Do not fall when ending your movement on a vertical surface.',
      tertiary: 'Can jump from a vertical surface without making an ability check.'
    },
    mechanics: {
      movement: {
        type: 'climb',
        distance: 0 // Special movement mode
      },
      condition: ['Free action', 'Ignores gravity on surfaces']
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Must end movement on a surface or fall']
    },
    flavor: 'Gravity becomes your servant as you run along walls and ceilings.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/wall-run.webp'
  },
  {
    id: 'phase-walk',
    name: 'Phase Walk',
    description: 'Move through solid objects and creatures.',
    type: 'mobility',
    style: 'any',
    prerequisites: {
      level: 12,
      ability: 'Constitution',
      score: 15
    },
    activation: {
      type: 'action'
    },
    duration: {
      type: 'timed',
      time: '1 minute'
    },
    effects: {
      primary: 'Can move through solid objects and creatures as if they were difficult terrain.',
      secondary: 'Take 1d10 force damage for every 5 feet moved through an object or creature.',
      tertiary: 'Cannot attack while phasing through objects.'
    },
    mechanics: {
      movement: {
        type: 'teleport',
        distance: 0 // Special movement through objects
      },
      condition: ['Action activation', 'Timed duration', 'Takes damage when phasing']
    },
    limitations: {
      uses: 'Once per long rest',
      cooldown: 'Long rest'
    },
    flavor: 'Your body becomes intangible, passing through matter as if it were mere illusion.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/phase-walk.webp'
  },
  {
    id: 'leap-strike',
    name: 'Leap Strike',
    description: 'Jump incredible distances to strike distant foes.',
    type: 'mobility',
    style: 'weapon',
    prerequisites: {
      level: 6,
      ability: 'Strength',
      score: 15
    },
    activation: {
      type: 'action'
    },
    effects: {
      primary: 'Jump up to 60 feet horizontally or 30 feet vertically.',
      secondary: 'Make one melee attack against a creature you land near.',
      tertiary: 'If the attack hits, the target must make Strength saving throw or be knocked prone.'
    },
    mechanics: {
      movement: {
        type: 'jump',
        distance: 60
      },
      attack: {
        type: 'melee',
        modifier: 'Strength'
      },
      saving_throw: {
        ability: 'Strength',
        dc: '8 + proficiency bonus + Strength modifier',
        success: 'No effect',
        failure: 'Knocked prone'
      }
    },
    limitations: {
      uses: 'Twice per short rest',
      cooldown: 'Short rest'
    },
    flavor: 'You leap through the air like a predator, striking from above with devastating force.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/leap-strike.webp'
  },

  // UTILITY TECHNIQUES
  {
    id: 'shadow-bind',
    name: 'Shadow Bind',
    description: 'Use shadows to restrain and control enemies.',
    type: 'utility',
    style: 'any',
    prerequisites: {
      level: 8,
      ability: 'Charisma',
      score: 15
    },
    activation: {
      type: 'action'
    },
    duration: {
      type: 'concentration',
      time: '1 minute'
    },
    range: {
      type: 'ranged',
      distance: 60
    },
    effects: {
      primary: 'Target must make Charisma saving throw or be restrained by shadow tendrils.',
      secondary: 'While restrained, target cannot speak or cast spells with verbal components.',
      tertiary: 'You can move the restrained target up to 10 feet as a bonus action.'
    },
    mechanics: {
      condition: ['restrained'],
      saving_throw: {
        ability: 'Charisma',
        dc: '8 + proficiency bonus + Charisma modifier',
        success: 'No effect',
        failure: 'Restrained by shadow tendrils'
      }
    },
    limitations: {
      uses: 'Once per short rest',
      cooldown: 'Short rest',
      conditions: ['Requires shadows or dim light']
    },
    flavor: 'Shadows themselves rise to bind your enemies, holding them fast with dark tendrils.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/shadow-bind.webp'
  },
  {
    id: 'disarming-strike',
    name: 'Disarming Strike',
    description: 'A precise attack that disarms opponents.',
    type: 'utility',
    style: 'weapon',
    prerequisites: {
      level: 5,
      proficiency: ['Sword', 'Dagger', 'Rapier']
    },
    activation: {
      type: 'action'
    },
    effects: {
      primary: 'Make a melee attack against a creature holding a weapon.',
      secondary: 'If you hit, the creature must make Strength saving throw or drop its weapon.',
      tertiary: 'You can catch the dropped weapon if you have a free hand.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity'
      },
      saving_throw: {
        ability: 'Strength',
        dc: '8 + proficiency bonus + Dexterity modifier',
        success: 'Keeps weapon',
        failure: 'Drops weapon'
      }
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Target must be holding a weapon']
    },
    flavor: 'Your precise strike targets not flesh but steel, disarming your foes with surgical precision.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/disarming-strike.webp'
  },
  {
    id: 'trip-attack',
    name: 'Trip Attack',
    description: 'A sweeping attack that knocks enemies prone.',
    type: 'utility',
    style: 'weapon',
    prerequisites: {
      level: 4,
      proficiency: ['Spear', 'Quarterstaff', 'Whip']
    },
    activation: {
      type: 'action'
    },
    effects: {
      primary: 'Make a melee attack against a creature.',
      secondary: 'If you hit, the creature must make Dexterity saving throw or be knocked prone.',
      tertiary: 'Prone creatures have disadvantage on their next attack roll.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength'
      },
      saving_throw: {
        ability: 'Dexterity',
        dc: '8 + proficiency bonus + Strength modifier',
        success: 'No effect',
        failure: 'Knocked prone'
      }
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Target must be your size or smaller']
    },
    flavor: 'Your sweeping attack targets not just bodies but balance, sending foes tumbling to the ground.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/trip-attack.webp'
  },
  {
    id: 'grappling-strike',
    name: 'Grappling Strike',
    description: 'A powerful attack that grabs and restrains enemies.',
    type: 'utility',
    style: 'unarmed',
    prerequisites: {
      level: 3,
      ability: 'Strength',
      score: 13
    },
    activation: {
      type: 'action'
    },
    effects: {
      primary: 'Make an unarmed strike against a creature.',
      secondary: 'If you hit, the creature is grappilled and you can move it 10 feet.',
      tertiary: 'Grappled creatures have disadvantage on attacks against creatures other than you.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength'
      },
      condition: ['grappled']
    },
    limitations: {
      uses: 'At-will',
      conditions: ['Target must be your size or smaller']
    },
    flavor: 'Your grip becomes unbreakable, seizing your enemies with inescapable force.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/grappling-strike.webp'
  },
  {
    id: 'intimidating-presence',
    name: 'Intimidating Presence',
    description: 'Channel your inner power to frighten enemies.',
    type: 'utility',
    style: 'any',
    prerequisites: {
      level: 6,
      ability: 'Charisma',
      score: 15
    },
    activation: {
      type: 'action'
    },
    range: {
      type: 'area',
      distance: 30
    },
    effects: {
      primary: 'Each creature of your choice within 30 feet must make Wisdom saving throw.',
      secondary: 'On a failure, creatures are frightened of you for 1 minute.',
      tertiary: 'Frightened creatures cannot willingly move closer to you.'
    },
    mechanics: {
      saving_throw: {
        ability: 'Wisdom',
        dc: '8 + proficiency bonus + Charisma modifier',
        success: 'No effect',
        failure: 'Frightened for 1 minute'
      }
    },
    limitations: {
      uses: '3 times per long rest',
      cooldown: 'Long rest'
    },
    flavor: 'Your presence alone is enough to make lesser beings tremble in fear.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/intimidating-presence.webp'
  },

  // FINISHING TECHNIQUES
  {
    id: 'shadow-termination',
    name: 'Shadow Termination',
    description: 'A devastating finishing move that strikes from the shadows.',
    type: 'finishing',
    style: 'weapon',
    prerequisites: {
      level: 15,
      ability: 'Dexterity',
      score: 18,
      technique: ['Shadow Strike']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack with advantage and automatically score a critical hit.',
      secondary: 'Critical hit deals maximum damage and the target must make Constitution saving throw or die.',
      tertiary: 'If the target dies, you regain hit points equal to your level and can immediately use Shadow Step as a bonus action.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity'
      },
      saving_throw: {
        ability: 'Constitution',
        dc: '8 + proficiency bonus + Dexterity modifier + 10',
        success: 'Takes maximum damage',
        failure: 'Dies'
      }
    },
    limitations: {
      uses: 'Once per long rest',
      cooldown: 'Long rest',
      conditions: ['Target must be below 50% hit points', 'Requires dim light or darkness']
    },
    flavor: 'You become death itself, striking from the shadows to deliver the final blow.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/shadow-termination.webp'
  },
  {
    id: 'dragon-slaying-blow',
    name: 'Dragon-Slaying Blow',
    description: 'A legendary attack that can fell even the mightiest beasts.',
    type: 'finishing',
    style: 'two-handed',
    prerequisites: {
      level: 18,
      ability: 'Strength',
      score: 20,
      technique: ['Whirlwind Strike']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack with advantage and deal triple damage.',
      secondary: 'If the target is a dragon or similar creature, it must make Constitution saving throw or die.',
      tertiary: 'If the target dies, you gain temporary hit points equal to its challenge rating times 10.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength',
        damage: 'triple'
      },
      saving_throw: {
        ability: 'Constitution',
        dc: '8 + proficiency bonus + Strength modifier + 15',
        success: 'Takes triple damage',
        failure: 'Dies'
      }
    },
    limitations: {
      uses: 'Once per long rest',
      cooldown: 'Long rest',
      conditions: ['Target must be a dragon or similar powerful creature']
    },
    flavor: 'You channel the legendary power of dragon slayers, delivering a blow worthy of legends.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/dragon-slaying-blow.webp'
  },
  {
    id: 'void-annihilation',
    name: 'Void Annihilation',
    description: 'An attack that tears through dimensions and reality itself.',
    type: 'finishing',
    style: 'weapon',
    prerequisites: {
      level: 20,
      ability: 'Dexterity',
      score: 20,
      technique: ['Void Slash']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack ignores all defenses and deals maximum damage.',
      secondary: 'Target must make Constitution saving throw with disadvantage or be annihilated.',
      tertiary: 'If the target is annihilated, it cannot be revived by any means short of divine intervention.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Dexterity',
        damage: 'maximum'
      },
      saving_throw: {
        ability: 'Constitution',
        dc: '8 + proficiency bonus + Dexterity modifier + 20',
        success: 'Takes maximum damage',
        failure: 'Annihilated'
      }
    },
    limitations: {
      uses: 'Once per lifetime',
      cooldown: 'Never',
      conditions: ['Requires legendary weapon', 'Must be at full health']
    },
    flavor: 'Your attack tears through the fabric of reality, leaving nothing but void in its wake.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/void-annihilation.webp'
  },
  {
    id: 'divine-execution',
    name: 'Divine Execution',
    description: 'A holy strike that delivers divine justice.',
    type: 'finishing',
    style: 'weapon',
    prerequisites: {
      level: 17,
      class: 'Paladin',
      technique: ['Divine Smite']
    },
    activation: {
      type: 'action',
      cost: 'One attack action'
    },
    range: {
      type: 'melee'
    },
    effects: {
      primary: 'Attack with advantage and add 8d8 radiant damage.',
      secondary: 'If the target is an evil creature, it must make Constitution saving throw or die.',
      tertiary: 'If the target dies, you and all allies within 30 feet gain temporary hit points equal to your paladin level.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Strength',
        damage: 'radiant'
      },
      saving_throw: {
        ability: 'Constitution',
        dc: '8 + proficiency bonus + Charisma modifier + 10',
        success: 'Takes extra radiant damage',
        failure: 'Dies'
      }
    },
    limitations: {
      uses: 'Once per long rest',
      cooldown: 'Long rest',
      conditions: ['Target must be evil', 'Requires holy weapon']
    },
    flavor: 'Divine light flows through your weapon, delivering righteous judgment to the wicked.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/divine-execution.webp'
  },
  {
    id: 'arcane-overload',
    name: 'Arcane Overload',
    description: 'A spell-enhanced attack that unleashes raw magical power.',
    type: 'finishing',
    style: 'any',
    prerequisites: {
      level: 19,
      class: 'Wizard',
      technique: ['Arcane Recovery']
    },
    activation: {
      type: 'action',
      cost: 'One attack action + spell slot'
    },
    effects: {
      primary: 'Attack with advantage and add damage equal to 3d8 per spell slot level.',
      secondary: 'Target must make Intelligence saving throw or be stunned until your next turn.',
      tertiary: 'If the target is stunned, you can cast one spell as a bonus action without expending a spell slot.'
    },
    mechanics: {
      attack: {
        type: 'melee',
        modifier: 'Intelligence',
        damage: 'magical'
      },
      saving_throw: {
        ability: 'Intelligence',
        dc: '8 + proficiency bonus + Intelligence modifier + spell level',
        success: 'Takes extra magical damage',
        failure: 'Stunned until your next turn'
      }
    },
    limitations: {
      uses: 'Once per long rest',
      cooldown: 'Long rest',
      conditions: ['Must expend a spell slot', 'Cannot be used with cantrips']
    },
    flavor: 'You channel raw arcane energy through your attack, unleashing the full power of your magic.',
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/techniques/arcane-overload.webp'
  }
];

export default techniques;

