// Job Paths Compendium - System Ascendant Canonical 84 Paths
// 14 Jobs × 6 Paths each, based on 5e subclass mechanics

export interface Path {
  id: string;
  name: string;
  jobId: string;
  jobName: string;
  tier: 1 | 2 | 3;
  pathType: string;
  requirements: {
    level: number;
    abilities?: string[];
    skills?: string[];
    prerequisites?: string[];
  };
  description: string;
  features: { name: string; description: string; level: number; }[];
  abilities: { name: string; description: string; cooldown?: number; cost?: string; }[];
  stats: {
    primaryAttribute: string;
    secondaryAttribute?: string;
    bonusStats: { strength?: number; dexterity?: number; constitution?: number; intelligence?: number; wisdom?: number; charisma?: number; };
  };
  source: string;
  image?: string;
}

export const paths: Path[] = [
  // ── DESTROYER PATHS (Fighter) ── features at 3,7,10,15,18 ──
  { id:'destroyer--champion', name:'Path of the Champion', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'champion',
    requirements:{level:3,skills:['Athletics']},
    description:'Champions hone their bodies to physical perfection, landing devastating blows with preternatural consistency. The System rewards pure martial excellence.',
    features:[
      {name:'Improved Critical',description:'Weapon attacks crit on 19-20.',level:3},
      {name:'Remarkable Athlete',description:'Add half prof bonus (round up) to STR/AGI/VIT checks that don\'t already include prof. Running long jump +STR mod feet.',level:7},
      {name:'Additional Fighting Style',description:'Choose a second Fighting Style.',level:10},
      {name:'Superior Critical',description:'Weapon attacks crit on 18-20.',level:15},
      {name:'Survivor',description:'Start of each turn, regain 5+VIT mod HP if at ≤ half HP and at least 1 HP.',level:18}
    ],
    abilities:[{name:'Champion\'s Surge',description:'Next attack crits on 17-20. Once per short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'destroyer--battle-master', name:'Path of the Battle Master', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'tactician',
    requirements:{level:3,skills:['Athletics','Insight']},
    description:'Battle Masters dissect combat like a science. The System grants superiority dice — tactical energy that fuels devastating maneuvers.',
    features:[
      {name:'Combat Superiority',description:'Learn 3 maneuvers, gain 4 superiority dice (d8). Regain on short/long rest. More maneuvers at 7,10,15. Dice: d10 at 10th, d12 at 18th.',level:3},
      {name:'Student of War',description:'Gain proficiency with one artisan\'s tools.',level:3},
      {name:'Know Your Enemy',description:'1 minute observing outside combat: learn if equal/superior/inferior in two characteristics.',level:7},
      {name:'Improved Combat Superiority',description:'Superiority dice become d10.',level:10},
      {name:'Relentless',description:'Roll initiative with 0 superiority dice → regain 1.',level:15}
    ],
    abilities:[{name:'Tactical Analysis',description:'Spend a superiority die to learn target AC, HP%, and highest save. Add die to next attack vs it.',cooldown:0,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Intelligence',bonusStats:{strength:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'destroyer--eldritch-knight', name:'Path of the Eldritch Knight', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'arcane-warrior',
    requirements:{level:3,skills:['Arcana']},
    description:'Eldritch Knights blend swordplay with abjuration and evocation magic, shielding themselves with wards while delivering spell-enhanced strikes.',
    features:[
      {name:'Spellcasting',description:'Learn 2 wizard cantrips and 3 wizard spells (abjuration/evocation). INT casting, third-caster slots.',level:3},
      {name:'Weapon Bond',description:'Bond 2 weapons. Can\'t be disarmed; summon to hand as bonus action from same plane.',level:3},
      {name:'War Magic',description:'Cast a cantrip → make one weapon attack as bonus action.',level:7},
      {name:'Eldritch Strike',description:'On weapon hit, target has disadvantage on next save vs your spell before end of your next turn.',level:10},
      {name:'Arcane Charge',description:'When you Action Surge, teleport up to 30 ft before or after the extra action.',level:15},
      {name:'Improved War Magic',description:'Cast a spell → make one weapon attack as bonus action.',level:18}
    ],
    abilities:[{name:'Spell-Strike Combo',description:'Cast a cantrip and make a weapon attack, adding INT mod as bonus force damage to both.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Intelligence',bonusStats:{strength:1,intelligence:2}}, source:'System Ascendant Canon' },

  { id:'destroyer--vanguard', name:'Path of the Vanguard', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'defender',
    requirements:{level:3,skills:['Athletics','Intimidation']},
    description:'Vanguards are the immovable wall between their raid party and annihilation. The System grants them supernatural durability and the ability to lock down enemies.',
    features:[
      {name:'Unwavering Mark',description:'Melee hit marks creature until end of your next turn. Marked creature has disadvantage on attacks not targeting you. If it damages someone else, bonus action attack with advantage + half Destroyer level damage.',level:3},
      {name:'Warding Maneuver',description:'Reaction: you or adjacent ally hit → add 1d8 to AC. If still hit, target resists that damage. VIT mod uses/long rest.',level:7},
      {name:'Hold the Line',description:'Creatures provoke OAs when moving within your reach. Hit → speed becomes 0.',level:10},
      {name:'Ferocious Charger',description:'Move 10+ ft straight then attack → STR save or knocked prone. Bonus action attack on prone.',level:15},
      {name:'Vigilant Defender',description:'Make OAs without using reaction (one per creature per turn, not on your turn).',level:18}
    ],
    abilities:[{name:'Fortress Stance',description:'Become immovable until you move. Advantage on STR checks/saves, can\'t be moved.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Constitution',secondaryAttribute:'Strength',bonusStats:{constitution:2,strength:1}}, source:'System Ascendant Canon' },

  { id:'destroyer--ronin', name:'Path of the Ronin', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'precision',
    requirements:{level:3,skills:['Athletics','Perception']},
    description:'Ronin are masterless warriors whose iron will lets them push beyond mortal limits, fighting with perfect focus even when their bodies should have failed.',
    features:[
      {name:'Fighting Spirit',description:'Bonus action: advantage on all weapon attacks + 5 temp HP until end of turn (10 at 10th, 15 at 15th). 3 uses/long rest.',level:3},
      {name:'Elegant Courtier',description:'Add SENSE mod to Persuasion. Prof in SENSE saves.',level:7},
      {name:'Tireless Spirit',description:'Roll initiative with 0 Fighting Spirit uses → regain 1.',level:10},
      {name:'Rapid Strike',description:'If you have advantage and hit, forgo advantage on one attack to make an additional attack. Once/turn.',level:15},
      {name:'Strength Before Death',description:'At 0 HP, take an entire extra turn immediately. Once/long rest.',level:18}
    ],
    abilities:[{name:'Focused Slash',description:'Next melee attack ignores resistance, treats immunity as resistance. Once per short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Wisdom',bonusStats:{strength:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'destroyer--phantom-blade', name:'Path of the Phantom Blade', jobId:'destroyer', jobName:'Destroyer', tier:2, pathType:'echo',
    requirements:{level:3,skills:['Athletics','Arcana']},
    description:'Phantom Blades manifest dimensional echoes — afterimages from alternate timelines — fighting from two positions simultaneously and swapping places with their shadow selves.',
    features:[
      {name:'Manifest Echo',description:'Bonus action: manifest echo within 15 ft. 1 HP, AC 14+prof. Attack from its space. Bonus action: swap places (15 ft movement).',level:3},
      {name:'Unleash Incarnation',description:'On Attack action, one extra melee attack from echo\'s position. VIT mod uses/long rest.',level:3},
      {name:'Echo Avatar',description:'Action: transfer senses to echo for 10 min. See/hear through it; deafened/blinded at your body.',level:7},
      {name:'Shadow Martyr',description:'Reaction before attack on ally within 30 ft: teleport echo within 5 ft of ally, attack targets echo instead.',level:10},
      {name:'Reclaim Potential',description:'Echo destroyed by damage → gain 2d6+VIT mod temp HP. VIT mod uses/long rest.',level:15},
      {name:'Legion of One',description:'Create two echoes. Unleash Incarnation: one extra attack from each echo.',level:18}
    ],
    abilities:[{name:'Echo Swap',description:'Teleport to echo and make OA against adjacent creature.',cooldown:1,cost:'Reaction'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  // ── BERSERKER PATHS (Barbarian) ── features at 3,6,10,14 ──
  { id:'berserker--primal-fury', name:'Path of Primal Fury', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'frenzy',
    requirements:{level:3,skills:['Athletics','Intimidation']},
    description:'Primal Fury Berserkers enter frenzied rages that transform them into engines of destruction, each blow carrying the force of a collapsing rift gate.',
    features:[
      {name:'Frenzy',description:'While raging, make a melee weapon attack as bonus action each turn. One exhaustion level when rage ends.',level:3},
      {name:'Mindless Rage',description:'Can\'t be charmed or frightened while raging. Existing effects suspended.',level:6},
      {name:'Intimidating Presence',description:'Action: frighten one creature within 30 ft (SENSE save 8+prof+STR). Extend each turn with action.',level:10},
      {name:'Retaliation',description:'Reaction: when damaged by creature within 5 ft, make melee attack against it.',level:14}
    ],
    abilities:[{name:'Berserker\'s Fury',description:'1 min: each time you take damage, next melee deals bonus = rage damage. Once/long rest.',cooldown:3,cost:'Free (while raging)'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'berserker--gate-beast', name:'Path of the Gate Beast', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'totem',
    requirements:{level:3,skills:['Nature','Survival']},
    description:'Gate Beast Berserkers form spiritual bonds with apex predators from inside gates, channeling their aspects — bear\'s endurance, eagle\'s sight, wolf\'s pack tactics.',
    features:[
      {name:'Totem Spirit',description:'Bear: resist all damage except psychic while raging. Eagle: OAs have disadvantage vs you, Dash as bonus while raging. Wolf: allies have advantage on melee vs creatures within 5 ft of you while raging.',level:3},
      {name:'Aspect of the Beast',description:'Bear: double carry, advantage on STR push/pull. Eagle: see 1 mile, dim light no Perception penalty. Wolf: track at fast pace, stealth at normal.',level:6},
      {name:'Spirit Walker',description:'Cast Commune with Nature as ritual; totem spirit appears to convey info.',level:10},
      {name:'Totemic Attunement',description:'Bear: raging, enemies within 5 ft have disadvantage on attacks vs allies. Eagle: raging, fly speed = walk speed. Wolf: raging, bonus action knock Large-or-smaller prone on hit.',level:14}
    ],
    abilities:[{name:'Primal Roar',description:'All enemies in 30 ft: SENSE save or frightened 1 min. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Wisdom',bonusStats:{strength:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'berserker--shadow-lineage', name:'Path of Shadow Lineage', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'ancestral',
    requirements:{level:3,skills:['Athletics','History']},
    description:'Shadow Lineage Berserkers summon spectral ancestors — warriors who fell in gates generations ago — creating protective barriers of ancestral fury around allies.',
    features:[
      {name:'Ancestral Protectors',description:'While raging, first creature you hit each turn: disadvantage on attacks not targeting you, others resist its damage until start of your next turn.',level:3},
      {name:'Spirit Shield',description:'Raging, ally within 30 ft takes damage → reaction: reduce by 2d6 (3d6 at 10th, 4d6 at 14th).',level:6},
      {name:'Consult the Spirits',description:'Cast Clairvoyance as ritual without components, using ancestral spirits.',level:10},
      {name:'Vengeful Ancestors',description:'Spirit Shield: attacker takes force damage equal to amount prevented.',level:14}
    ],
    abilities:[{name:'Ancestral Summons',description:'Spectral ancestor fights for 1 min (your attack bonus, 2d8 force). Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'berserker--rift-storm', name:'Path of the Rift Storm', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'elemental',
    requirements:{level:3,skills:['Athletics','Nature']},
    description:'Rift Storm Berserkers channel raw elemental chaos from gate breaches. When they rage, the air warps — freezing, burning, or crackling with lightning around them.',
    features:[
      {name:'Storm Aura',description:'Raging: 10-ft aura. Desert: 2 fire/turn (scales). Sea: bonus action 1d6 lightning, AGI half. Tundra: 2 temp HP/turn (scales).',level:3},
      {name:'Storm Soul',description:'Desert: fire resist, immune extreme heat. Sea: lightning resist, breathe underwater, 30 ft swim. Tundra: cold resist, immune extreme cold, move on ice freely.',level:6},
      {name:'Shielding Storm',description:'Chosen creatures in aura gain your Storm Soul resistance.',level:10},
      {name:'Raging Storm',description:'Desert: reaction when hit, fire = half level. Sea: reaction, AGI save or prone. Tundra: bonus action, STR save or speed 0.',level:14}
    ],
    abilities:[{name:'Storm Burst',description:'30-ft radius, 4d8 damage (aura type), AGI half. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'berserker--system-fanatic', name:'Path of the System Fanatic', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'zealot',
    requirements:{level:3,skills:['Athletics','Religion']},
    description:'System Fanatics channel divine fury, believing their rage a holy mandate. Nearly impossible to kill permanently, their strikes carry radiant or necrotic energy.',
    features:[
      {name:'Divine Fury',description:'Raging: first hit each turn deals extra 1d6+half Berserker level radiant or necrotic.',level:3},
      {name:'Warrior of the Gods',description:'Spells restoring you to life don\'t require material components.',level:3},
      {name:'Fanatical Focus',description:'Fail a save while raging → reroll, must use new result. Once/rage.',level:6},
      {name:'Zealous Presence',description:'Bonus action: up to 10 creatures in 60 ft gain advantage on attacks and saves until start of your next turn. Once/long rest.',level:10},
      {name:'Rage Beyond Death',description:'Raging at 0 HP: don\'t fall unconscious. Die only on 3 failed death saves, massive damage, or rage ending at 0 HP.',level:14}
    ],
    abilities:[{name:'Holy Rampage',description:'1 min: melee deals extra 2d6 radiant, emit bright light 10 ft. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'berserker--rift-touched', name:'Path of the Rift-Touched', jobId:'berserker', jobName:'Berserker', tier:2, pathType:'wild-magic',
    requirements:{level:3,skills:['Athletics','Arcana']},
    description:'Rift-Touched Berserkers absorbed raw magical energy from a gate breach. Each rage triggers random magical effects — sometimes devastating, sometimes bizarre, always dangerous.',
    features:[
      {name:'Magic Awareness',description:'Action: sense spells/magic items within 60 ft, know school. Prof uses/long rest.',level:3},
      {name:'Wild Surge',description:'Enter rage → roll Wild Magic table. Effects: shadow tendrils (1d12 force), teleport 30 ft, spirit explosion, force weapon, or grow one size.',level:3},
      {name:'Bolstering Magic',description:'Action touch: +1d3 to attacks/checks for 10 min, OR restore a spell slot ≤ d3 level. Prof uses/long rest.',level:6},
      {name:'Unstable Backlash',description:'Take damage or fail save while raging → reaction to reroll Wild Surge, replacing current effect.',level:10},
      {name:'Controlled Surge',description:'Roll Wild Surge twice, choose which. Same number = choose any effect.',level:14}
    ],
    abilities:[{name:'Rift Discharge',description:'20-ft radius: 3d10 force, VIT half, random Wild Surge on each failure. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Constitution',bonusStats:{strength:2,constitution:1}}, source:'System Ascendant Canon' },

  // ── ASSASSIN PATHS (Rogue) ── features at 3,9,13,17 ──
  { id:'assassin--shadow-thief', name:'Path of the Shadow Thief', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'thief',
    requirements:{level:3,skills:['Stealth','Sleight of Hand']},
    description:'Shadow Thieves are the quintessential gate operatives — fast hands, quick reflexes, and an uncanny ability to use any item or device they find inside dungeons.',
    features:[
      {name:'Fast Hands',description:'Cunning Action bonus action can also: Sleight of Hand check, use thieves\' tools, or Use an Object.',level:3},
      {name:'Second-Story Work',description:'Climbing costs no extra movement. Running jump distance +AGI mod feet.',level:3},
      {name:'Supreme Sneak',description:'Advantage on Stealth if you move no more than half speed that turn.',level:9},
      {name:'Use Magic Device',description:'Ignore all class, race, and level requirements on magic items.',level:13},
      {name:'Thief\'s Reflexes',description:'Two turns in the first round of combat: normal initiative and initiative minus 10.',level:17}
    ],
    abilities:[{name:'Plunder',description:'Bonus action: steal held/worn item from creature within 5 ft (AGI save).',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Intelligence',bonusStats:{dexterity:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'assassin--silent-knife', name:'Path of the Silent Knife', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'assassin',
    requirements:{level:3,skills:['Stealth','Deception']},
    description:'Silent Knives reduce assassination to its purest form: one breath, one motion, one kill. Their blade slides between ribs like a whispered secret.',
    features:[
      {name:'Bonus Proficiencies',description:'Proficiency with disguise kit and poisoner\'s kit.',level:3},
      {name:'Assassinate',description:'Advantage on attacks vs creatures that haven\'t acted yet. Hits on surprised creatures are critical hits.',level:3},
      {name:'Infiltration Expertise',description:'Spend 7 days to create a false identity with documentation and disguises.',level:9},
      {name:'Impostor',description:'Mimic another person\'s speech, writing, and behavior after 3 hours of study. Suspicious creatures have disadvantage on Insight to detect.',level:13},
      {name:'Death Strike',description:'Hit a surprised creature → VIT save (8+AGI mod+prof) or damage is doubled.',level:17}
    ],
    abilities:[{name:'Vanishing Strike',description:'After melee hit, become invisible until end of next turn or until you attack/cast. Once/short rest.',cooldown:1,cost:'Free'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Constitution',bonusStats:{dexterity:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'assassin--spell-thief', name:'Path of the Spell Thief', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'arcane-trickster',
    requirements:{level:3,skills:['Stealth','Arcana']},
    description:'Spell Thieves blend shadow-craft with illusion and enchantment magic, stealing spells from enemies mid-cast and using invisible mage hands for impossible larceny.',
    features:[
      {name:'Spellcasting',description:'Invisible Mage Hand + 2 wizard cantrips + 3 spells (enchantment/illusion). INT casting, third-caster slots.',level:3},
      {name:'Mage Hand Legerdemain',description:'Invisible Mage Hand can stow/retrieve objects, pick locks, disarm traps at range via Sleight of Hand.',level:3},
      {name:'Magical Ambush',description:'Hidden when you cast → target has disadvantage on saves vs that spell.',level:9},
      {name:'Versatile Trickster',description:'Bonus action: Mage Hand distracts creature within 5 ft of it → advantage on attacks vs that creature until end of turn.',level:13},
      {name:'Spell Thief',description:'Reaction when targeted by spell: force INT save. Fail → negate effect on you, steal spell for 8 hours. Once/long rest.',level:17}
    ],
    abilities:[{name:'Arcane Ambush',description:'Cast cantrip while hidden without revealing position. Add Sneak Attack if it deals damage. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Intelligence',bonusStats:{dexterity:1,intelligence:2}}, source:'System Ascendant Canon' },

  { id:'assassin--shadow-broker', name:'Path of the Shadow Broker', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'mastermind',
    requirements:{level:3,skills:['Insight','Deception']},
    description:'Shadow Brokers are puppet masters — gathering intelligence, manipulating allies and enemies, orchestrating operations from the shadows. They make others fight for them.',
    features:[
      {name:'Master of Intrigue',description:'Prof in disguise kit, forgery kit, one gaming set. Learn 2 languages. Mimic accents unerringly.',level:3},
      {name:'Master of Tactics',description:'Help as bonus action. Help an ally attack → target can be within 30 ft.',level:3},
      {name:'Insightful Manipulator',description:'Observe 1 min outside combat: learn if equal/superior/inferior in two of INT/SENSE/PRE/class levels.',level:9},
      {name:'Misdirection',description:'Reaction when targeted while a creature gives you cover: attack targets that creature instead.',level:13},
      {name:'Soul of Deceit',description:'Thoughts unreadable by telepathy. Present false thoughts. Can\'t be compelled to truth. Advantage on Deception vs magical discernment.',level:17}
    ],
    abilities:[{name:'Coordinated Strike',description:'Bonus action: designate target in 60 ft. Next ally to hit it adds your Sneak Attack damage. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Intelligence',bonusStats:{charisma:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'assassin--duellist', name:'Path of the Duellist', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'swashbuckler',
    requirements:{level:3,skills:['Acrobatics','Persuasion']},
    description:'Duellists dance through combat with a rapier in one hand and a quip on their lips, creating their own openings through flashy footwork and audacity.',
    features:[
      {name:'Fancy Footwork',description:'Melee attack a creature → it can\'t make OAs against you for the rest of your turn.',level:3},
      {name:'Rakish Audacity',description:'Add PRE mod to initiative. Sneak Attack without advantage if no other creature within 5 ft of you (no disadvantage required).',level:3},
      {name:'Panache',description:'Action: Persuasion vs Insight. Win: hostile = charmed (won\'t attack you), or friendly target has disadvantage attacking anyone but you. 1 min.',level:9},
      {name:'Elegant Maneuver',description:'Bonus action: advantage on next Acrobatics or Athletics check this turn.',level:13},
      {name:'Master Duelist',description:'Miss with attack → reroll with advantage. Once/short rest.',level:17}
    ],
    abilities:[{name:'Riposte',description:'Reaction when creature misses you: melee attack with Sneak Attack. Once/short rest.',cooldown:1,cost:'Reaction'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Charisma',bonusStats:{dexterity:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'assassin--outrider', name:'Path of the Outrider', jobId:'assassin', jobName:'Assassin', tier:2, pathType:'scout',
    requirements:{level:3,skills:['Stealth','Survival']},
    description:'Outriders are the advance force in gate operations — slipping past monsters, mapping corridors, relaying intelligence before the main party arrives.',
    features:[
      {name:'Skirmisher',description:'Enemy ends turn within 5 ft → reaction: move half speed without provoking OAs.',level:3},
      {name:'Survivalist',description:'Prof in Nature and Survival with double proficiency bonus.',level:3},
      {name:'Superior Mobility',description:'Walking speed +10 ft. Climbing/swimming speed +10 ft if you have them.',level:9},
      {name:'Ambush Master',description:'Advantage on initiative. First creature you hit round 1 has disadvantage on attacks vs you until start of your next turn.',level:13},
      {name:'Sudden Strike',description:'Bonus action: one additional attack. Can apply Sneak Attack to a different target even if already used this turn.',level:17}
    ],
    abilities:[{name:'Advance Recon',description:'Scout at triple speed for 10 min while hidden. Auto-succeed Stealth vs passive Perception. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  // ── STRIKER PATHS (Monk) ── features at 3,6,11,17 ──
  { id:'striker--iron-fist', name:'Path of the Iron Fist', jobId:'striker', jobName:'Striker', tier:2, pathType:'open-hand',
    requirements:{level:3,skills:['Athletics','Acrobatics']},
    description:'Iron Fist Strikers have mastered unarmed combat to its absolute pinnacle. Every punch carries focused ki capable of knocking enemies prone, pushing them away, or stopping their reactions.',
    features:[
      {name:'Open Hand Technique',description:'Flurry of Blows hit → impose one: AGI save or prone; STR save or pushed 15 ft; can\'t take reactions until end of your next turn.',level:3},
      {name:'Wholeness of Body',description:'Action: regain HP = 3 × Striker level. Once/long rest.',level:6},
      {name:'Tranquility',description:'End of long rest: gain Sanctuary effect until next long rest (save DC 8+SENSE mod+prof).',level:11},
      {name:'Quivering Palm',description:'Unarmed hit sets vibrations lasting Striker level days. Action to end: VIT save or 0 HP, success = 10d10 necrotic.',level:17}
    ],
    abilities:[{name:'Pressure Point Strike',description:'VIT save or stunned until end of your next turn. 3 ki points.',cooldown:0,cost:'3 ki points'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'striker--phantom-step', name:'Path of the Phantom Step', jobId:'striker', jobName:'Striker', tier:2, pathType:'shadow',
    requirements:{level:3,skills:['Stealth','Acrobatics']},
    description:'Phantom Step Strikers weave ki into shadow, becoming invisible in dim light and teleporting between patches of darkness to eliminate targets with bare hands.',
    features:[
      {name:'Shadow Arts',description:'2 ki: cast Darkness, Darkvision, Pass without Trace, or Silence. Learn Minor Illusion cantrip.',level:3},
      {name:'Shadow Step',description:'Bonus action in dim light/darkness: teleport 60 ft to another dim/dark space. Advantage on first melee attack before end of turn.',level:6},
      {name:'Cloak of Shadows',description:'In dim light/darkness, action to become invisible. Lasts until you attack, cast, or enter bright light.',level:11},
      {name:'Opportunist',description:'Reaction when creature within 5 ft is hit by someone else: make a melee attack against it.',level:17}
    ],
    abilities:[{name:'Shadow Flurry',description:'Teleport between up to 3 creatures within 60 ft, unarmed strike each. Start/end in dim light/darkness. 3 ki.',cooldown:0,cost:'3 ki points'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'striker--essence-channeler', name:'Path of the Essence Channeler', jobId:'striker', jobName:'Striker', tier:2, pathType:'four-elements',
    requirements:{level:3,skills:['Acrobatics','Nature']},
    description:'Essence Channelers harness elemental energy from gate environments, converting ki into blasts of fire, water, earth, and air — living weapons platforms.',
    features:[
      {name:'Disciple of the Elements',description:'Learn Elemental Attunement + 1 discipline. More at 6,11,17. Max ki per discipline = half Striker level (round up).',level:3},
      {name:'Elemental Disciplines',description:'Options: Fangs of the Fire Snake (fire reach), Fist of Unbroken Air (30 ft 3d10), Water Whip (30 ft pull 3d10), Sweeping Cinder Strike (Burning Hands 2 ki), etc.',level:3},
      {name:'Advanced Disciplines',description:'6th: Hold Person 3 ki, Shatter 3 ki. 11th: Fireball 4 ki, Fly 4 ki. 17th: Cone of Cold 6 ki, Wall of Stone 5 ki.',level:6},
      {name:'Elemental Mastery',description:'Spend 1 extra ki on a discipline to increase its save DC by 2.',level:17}
    ],
    abilities:[{name:'Elemental Burst',description:'30-ft cone: 2d6 fire+2d6 cold+2d6 lightning+2d6 bludgeoning. 5 ki points.',cooldown:0,cost:'5 ki points'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:1,wisdom:2}}, source:'System Ascendant Canon' },

  { id:'striker--chaos-style', name:'Path of the Chaos Style', jobId:'striker', jobName:'Striker', tier:2, pathType:'drunken-master',
    requirements:{level:3,skills:['Acrobatics','Performance']},
    description:'Chaos Style Strikers move with seemingly random, unpredictable patterns — actually precisely calculated. They stumble into dodges, trip into counters, and sway out of lethal strikes.',
    features:[
      {name:'Drunken Technique',description:'Flurry of Blows: gain Disengage and +10 ft speed until end of turn.',level:3},
      {name:'Tipsy Sway',description:'Stand from prone = 5 ft. When missed with melee, spend 1 ki to redirect attack to another creature within 5 ft.',level:6},
      {name:'Drunkard\'s Luck',description:'When you have disadvantage on check/attack/save, spend 2 ki to cancel disadvantage.',level:11},
      {name:'Intoxicated Frenzy',description:'Flurry of Blows: up to 3 additional attacks (5 total), each must target a different creature.',level:17}
    ],
    abilities:[{name:'Stumbling Counter',description:'Reaction when missed within 5 ft: unarmed strike with advantage. Prof uses/short rest.',cooldown:0,cost:'Reaction'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Charisma',bonusStats:{dexterity:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'striker--weapon-saint', name:'Path of the Weapon Saint', jobId:'striker', jobName:'Striker', tier:2, pathType:'kensei',
    requirements:{level:3,skills:['Athletics','Acrobatics']},
    description:'Weapon Saints channel ki through chosen weapons, achieving supernatural precision and speed. Their blades move faster than the eye can track.',
    features:[
      {name:'Path of the Kensei',description:'Choose 2 kensei weapons (1 melee, 1 ranged, no heavy/special). Count as monk weapons. Melee kensei + unarmed = +2 AC. Ranged kensei: 1 ki for +1d4+SENSE mod damage.',level:3},
      {name:'One with the Blade',description:'Kensei weapons count as magical. Deft Strike: 1 ki on kensei hit = extra Martial Arts die damage.',level:6},
      {name:'Sharpen the Blade',description:'Bonus action: spend 1-3 ki, grant nonmagical kensei weapon equal bonus to attack/damage for 1 min.',level:11},
      {name:'Unerring Accuracy',description:'Miss on your turn → reroll. Once/turn.',level:17}
    ],
    abilities:[{name:'Blade Storm',description:'Attack every creature within 10 ft with kensei weapon. Each hit: weapon + 2 Martial Arts dice. 4 ki.',cooldown:0,cost:'4 ki points'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'striker--vital-strike', name:'Path of the Vital Strike', jobId:'striker', jobName:'Striker', tier:2, pathType:'mercy',
    requirements:{level:3,skills:['Medicine','Insight']},
    description:'Vital Strike practitioners understand ki pathways so intimately they can heal allies with a touch or shut down an enemy\'s nervous system with a precisely placed strike.',
    features:[
      {name:'Implements of Mercy',description:'Prof in Insight, Medicine, herbalism kit.',level:3},
      {name:'Hands of Healing',description:'Flurry of Blows: replace one attack with heal = 1 Martial Arts die + SENSE mod. 1 ki to also end disease or blinded/deafened/paralyzed/poisoned/stunned.',level:3},
      {name:'Hands of Harm',description:'Flurry hit: spend 1 ki to deal extra necrotic = 1 Martial Arts die + SENSE mod. Target poisoned until end of your next turn.',level:3},
      {name:'Physician\'s Touch',description:'Hands of Healing also ends frightened or charmed. Hands of Harm: no save on the poison.',level:6},
      {name:'Flurry of Healing and Harm',description:'Replace each Flurry attack with Hands of Healing (no ki cost for heal). Hands of Harm once per turn without spending ki.',level:11},
      {name:'Hand of Ultimate Mercy',description:'Touch a creature that died within 24 hours: spend 5 ki, it returns to life with 4d10+SENSE mod HP, cured of all conditions. Once/long rest.',level:17}
    ],
    abilities:[{name:'Ki Surge',description:'Touch an ally: restore 2d8+SENSE mod HP and remove one condition. 2 ki points.',cooldown:0,cost:'2 ki points'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Dexterity',bonusStats:{wisdom:2,dexterity:1}}, source:'System Ascendant Canon' },

  // ── MAGE PATHS (Wizard) ── features at 2,6,10,14 ──
  { id:'mage--evocation', name:'Path of Evocation', jobId:'mage', jobName:'Mage', tier:2, pathType:'evocation',
    requirements:{level:2,skills:['Arcana']},
    description:'Evocation Mages channel raw destructive energy with surgical precision, sculpting fireballs around allies and maximizing damage output. They are the artillery of any raid.',
    features:[
      {name:'Sculpt Spells',description:'When you cast an evocation spell affecting others, choose up to 1+spell level creatures. They auto-succeed on saves and take no damage from the spell.',level:2},
      {name:'Potent Cantrip',description:'When a creature succeeds on a save against your cantrip, it still takes half damage.',level:6},
      {name:'Empowered Evocation',description:'Add INT mod to the damage of any evocation spell you cast.',level:10},
      {name:'Overchannel',description:'When you cast a 5th-level or lower damage spell, deal max damage. Use again before long rest: 2d12 necrotic per spell level (increases each use).',level:14}
    ],
    abilities:[{name:'Maximized Spell',description:'Next evocation spell deals maximum damage. Once/long rest (additional uses cause 2d12 necrotic per level).',cooldown:3,cost:'Free'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'mage--abjuration', name:'Path of Abjuration', jobId:'mage', jobName:'Mage', tier:2, pathType:'abjuration',
    requirements:{level:2,skills:['Arcana']},
    description:'Abjuration Mages specialize in protective magic, generating arcane wards that absorb damage and banishing hostile magic. They are the shields that keep raid parties alive.',
    features:[
      {name:'Arcane Ward',description:'When you cast an abjuration spell of 1st+, create a ward with HP = 2×Mage level+INT mod. When you take damage, ward takes it first. Casting abjuration spells restores 2×spell level HP to the ward.',level:2},
      {name:'Projected Ward',description:'Reaction: when a creature you can see within 30 ft takes damage, your ward absorbs the damage instead.',level:6},
      {name:'Improved Abjuration',description:'Add prof bonus to ability checks for abjuration spells (Counterspell, Dispel Magic).',level:10},
      {name:'Spell Resistance',description:'Advantage on saves against spells. Resistance to spell damage.',level:14}
    ],
    abilities:[{name:'Ward Surge',description:'Restore your Arcane Ward to full HP. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'mage--divination', name:'Path of Divination', jobId:'mage', jobName:'Mage', tier:2, pathType:'divination',
    requirements:{level:2,skills:['Arcana','Insight']},
    description:'Divination Mages peer through the System\'s data streams, seeing the future and manipulating probability. They replace luck with foreknowledge, ensuring their party is never caught off guard.',
    features:[
      {name:'Portent',description:'After long rest, roll 2d20 and record the numbers. You can replace any attack/save/check roll made by you or a creature you can see with one of these. Regain on long rest.',level:2},
      {name:'Expert Divination',description:'When you cast a divination spell of 2nd+, regain one expended spell slot of lower level (max 5th).',level:6},
      {name:'The Third Eye',description:'Action: gain one until rest: darkvision 60 ft, see ethereal 60 ft, read any language, or see invisible within 10 ft.',level:10},
      {name:'Greater Portent',description:'Roll 3d20 for Portent instead of 2.',level:14}
    ],
    abilities:[{name:'Probability Manipulation',description:'Force a creature to reroll any d20 roll and take the lower result. Once/short rest.',cooldown:1,cost:'Reaction'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Wisdom',bonusStats:{intelligence:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'mage--illusion', name:'Path of Illusion', jobId:'mage', jobName:'Mage', tier:2, pathType:'illusion',
    requirements:{level:2,skills:['Arcana','Deception']},
    description:'Illusion Mages bend perception itself, creating figments so convincing they can physically interact with the world. At the highest levels, their illusions become reality.',
    features:[
      {name:'Improved Minor Illusion',description:'Learn Minor Illusion cantrip (doesn\'t count against cantrips known). Can create both sound and image with a single casting.',level:2},
      {name:'Malleable Illusions',description:'When you cast an illusion with duration 1+ minutes, use an action to change the illusion\'s nature.',level:6},
      {name:'Illusory Self',description:'Reaction when attacked: create illusory duplicate that causes the attack to miss. Once per short rest.',level:10},
      {name:'Illusory Reality',description:'When you cast a 1st+ illusion spell, choose one inanimate object in the illusion — it becomes real for 1 minute. Cannot deal damage or directly harm.',level:14}
    ],
    abilities:[{name:'Phantom Terrain',description:'Create a 30-ft cube of illusory difficult terrain that feels real to the touch. Creatures must INT save to disbelieve. 1 min.',cooldown:2,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Charisma',bonusStats:{intelligence:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'mage--conjuration', name:'Path of Conjuration', jobId:'mage', jobName:'Mage', tier:2, pathType:'conjuration',
    requirements:{level:2,skills:['Arcana']},
    description:'Conjuration Mages pull matter and creatures from across dimensions, teleporting instantly and summoning reinforcements from the spaces between gates.',
    features:[
      {name:'Minor Conjuration',description:'Action: conjure an inanimate object (3 ft per side, 10 lbs max) that lasts until you use this again, take damage, or 1 hour passes.',level:2},
      {name:'Benign Transposition',description:'Action: teleport 30 ft to unoccupied space, or swap positions with a willing Small/Medium creature within 30 ft. Once per long rest or until you cast a conjuration spell.',level:6},
      {name:'Focused Conjuration',description:'Your concentration on a conjuration spell can\'t be broken by taking damage.',level:10},
      {name:'Durable Summons',description:'Creatures you summon or create with conjuration spells gain 30 temp HP.',level:14}
    ],
    abilities:[{name:'Dimensional Step',description:'Teleport up to 60 ft as a bonus action. Prof uses/long rest.',cooldown:0,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'mage--transmutation', name:'Path of Transmutation', jobId:'mage', jobName:'Mage', tier:2, pathType:'transmutation',
    requirements:{level:2,skills:['Arcana','Investigation']},
    description:'Transmutation Mages reshape matter at the molecular level, altering the properties of materials, enhancing allies, and eventually achieving the legendary Philosopher\'s Stone.',
    features:[
      {name:'Minor Alchemy',description:'Spend 10 min to transform one material into another (wood→stone, metal→crystal, etc.). Reverts after 1 hour or if you use this again.',level:2},
      {name:'Transmuter\'s Stone',description:'Spend 8 hours to create a stone granting one of: darkvision 60 ft, +10 ft speed, proficiency in VIT saves, or resistance to acid/cold/fire/lightning/thunder. Change benefit on casting a transmutation spell.',level:6},
      {name:'Shapechanger',description:'Add Polymorph to your spellbook (free). Cast it without a spell slot to turn into a beast of CR 1 or lower. Once per short rest.',level:10},
      {name:'Master Transmuter',description:'Destroy your Transmuter\'s Stone for one: transmute a nonmagical object into another of similar size/mass, remove all curses/diseases/poisons from a creature, cast Raise Dead without a slot, or reduce a creature\'s apparent age by 3d10 years.',level:14}
    ],
    abilities:[{name:'Molecular Shift',description:'Touch an object and change its material composition for 1 hour. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Wisdom',bonusStats:{intelligence:2,wisdom:1}}, source:'System Ascendant Canon' },

  // ── ESPER PATHS (Sorcerer) ── features at 1,6,14,18 ──
  { id:'esper--draconic-bloodline', name:'Path of the Draconic Bloodline', jobId:'esper', jobName:'Esper', tier:2, pathType:'draconic',
    requirements:{level:1,skills:['Arcana']},
    description:'Draconic Bloodline Espers carry the essence of ancient gate dragons in their veins. Their magic manifests as elemental fury, their bodies toughening with draconic scales.',
    features:[
      {name:'Dragon Ancestor',description:'Choose a dragon type. Double prof bonus on PRE checks with dragons. Learn Draconic language.',level:1},
      {name:'Draconic Resilience',description:'HP +1 per Esper level. Unarmored AC = 13+AGI mod.',level:1},
      {name:'Elemental Affinity',description:'When you cast a spell of your dragon type\'s damage, add PRE mod to one damage roll. Spend 1 sorcery point for resistance to that type for 1 hour.',level:6},
      {name:'Dragon Wings',description:'Bonus action: sprout dragon wings, fly speed = walking speed. Last until dismissed.',level:14},
      {name:'Draconic Presence',description:'Action: 60-ft aura of awe or fear. PRE save or charmed/frightened. 1 min, concentration. 5 sorcery points.',level:18}
    ],
    abilities:[{name:'Dragon Breath',description:'30-ft cone or 60-ft line: 4d8 damage of your ancestry type, AGI save for half. 3 sorcery points.',cooldown:0,cost:'3 sorcery points'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'esper--wild-magic', name:'Path of Wild Magic', jobId:'esper', jobName:'Esper', tier:2, pathType:'wild-magic',
    requirements:{level:1,skills:['Arcana']},
    description:'Wild Magic Espers are living conduits for the System\'s chaotic energy. Their spells occasionally surge with unpredictable effects — sometimes disastrous, sometimes miraculous.',
    features:[
      {name:'Wild Magic Surge',description:'After casting 1st+ spell, DM can have you roll d20. On 1, roll on Wild Magic Surge table for a random magical effect.',level:1},
      {name:'Tides of Chaos',description:'Gain advantage on one attack/check/save. Before regaining, DM can trigger a Wild Magic Surge after your next spell (no d20 roll needed).',level:1},
      {name:'Bend Luck',description:'Reaction when creature you can see makes attack/check/save: spend 2 sorcery points to roll 1d4 and add or subtract from their roll.',level:6},
      {name:'Controlled Chaos',description:'When you roll on Wild Magic table, roll twice and choose either result.',level:14},
      {name:'Spell Bombardment',description:'When you roll max on a damage die for a spell, reroll that die and add to total. Once per turn.',level:18}
    ],
    abilities:[{name:'Chaos Bolt',description:'Hurl a bolt of chaotic energy: 2d8+1d6 damage, damage type determined randomly. If both d8s match, bolt leaps to another target.',cooldown:0,cost:'1st-level slot'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'esper--shadow-magic', name:'Path of Shadow Magic', jobId:'esper', jobName:'Esper', tier:2, pathType:'shadow',
    requirements:{level:1,skills:['Stealth','Arcana']},
    description:'Shadow Magic Espers draw power from the Shadowfell that bleeds through certain gates. They command darkness itself, summon shadow hounds, and become one with the dark.',
    features:[
      {name:'Eyes of the Dark',description:'Darkvision 120 ft. At 3rd level, cast Darkness for 2 sorcery points and you can see through it.',level:1},
      {name:'Strength of the Grave',description:'When reduced to 0 HP (not by radiant or crit), PRE save DC 5+damage taken. Success: drop to 1 HP instead. Once per long rest.',level:1},
      {name:'Hound of Ill Omen',description:'Bonus action, 3 sorcery points: summon a shadow dire wolf that pursues one creature. Target has disadvantage on saves vs your spells while the hound is within 5 ft.',level:6},
      {name:'Shadow Walk',description:'Bonus action in dim light/darkness: teleport up to 120 ft to another dim/dark space.',level:14},
      {name:'Umbral Form',description:'6 sorcery points, bonus action: become shadow for 1 min. Resistance to all except force and radiant. Move through creatures/objects. If you end turn in an object, take 1d10 force.',level:18}
    ],
    abilities:[{name:'Shadow Bolt',description:'60-ft ranged spell attack: 3d8 necrotic + target can\'t take reactions until start of your next turn. 2 sorcery points.',cooldown:0,cost:'2 sorcery points'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'esper--storm-sorcery', name:'Path of Storm Sorcery', jobId:'esper', jobName:'Esper', tier:2, pathType:'storm',
    requirements:{level:1,skills:['Arcana','Nature']},
    description:'Storm Sorcery Espers channel the fury of tempests. Lightning crackles at their fingertips, wind obeys their commands, and storms form wherever they walk.',
    features:[
      {name:'Wind Speaker',description:'Speak, read, and write Primordial (and its dialects: Aquan, Auran, Ignan, Terran).',level:1},
      {name:'Tempestuous Magic',description:'Before or after casting a 1st+ spell, bonus action to fly 10 ft without provoking OAs.',level:1},
      {name:'Heart of the Storm',description:'Resistance to lightning and thunder. When you cast a 1st+ spell that deals lightning or thunder, deal lightning or thunder damage = half Esper level to creatures of your choice within 10 ft.',level:6},
      {name:'Storm Guide',description:'If it\'s raining, cause rain to stop in 20-ft sphere around you. Bonus action: choose direction of wind within 100 ft for 1 round.',level:6},
      {name:'Storm\'s Fury',description:'Reaction when hit by melee: deal lightning damage = Esper level and attacker must make STR save or be pushed 20 ft.',level:14},
      {name:'Wind Soul',description:'Immunity to lightning and thunder. 60-ft fly speed. Action: reduce fly to 30 ft for 1 hour to give up to 3+PRE mod creatures 30-ft fly speed.',level:18}
    ],
    abilities:[{name:'Thunder Step',description:'Teleport 90 ft, each creature within 10 ft of origin takes 3d10 thunder (VIT half). Can bring one willing creature.',cooldown:0,cost:'3rd-level slot'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'esper--divine-soul', name:'Path of the Divine Soul', jobId:'esper', jobName:'Esper', tier:2, pathType:'divine-soul',
    requirements:{level:1,skills:['Arcana','Religion']},
    description:'Divine Soul Espers carry a spark of divinity in their blood — a connection to the System\'s healing light. They can learn both Esper and Herald spells, making them unparalleled hybrid casters.',
    features:[
      {name:'Divine Magic',description:'Learn one Herald spell based on affinity (Good: Cure Wounds, Evil: Inflict Wounds, Law: Bless, Chaos: Bane, Neutrality: Protection from Evil and Good). Access both Esper and Herald spell lists.',level:1},
      {name:'Favored by the Gods',description:'When you fail a save or miss an attack, add 2d4 to the roll. Once per short rest.',level:1},
      {name:'Empowered Healing',description:'When you or ally within 5 ft rolls dice to heal with a spell, spend 1 sorcery point to reroll any number of those dice. Once per turn.',level:6},
      {name:'Otherworldly Wings',description:'Bonus action: spectral wings, 30-ft fly speed. Last until dismissed. Eagle, bat, or dragon wings.',level:14},
      {name:'Unearthly Recovery',description:'When you have less than half HP, bonus action to regain HP = half your HP max. Once per long rest.',level:18}
    ],
    abilities:[{name:'Divine Surge',description:'Cast a healing spell and add PRE mod to each die of healing. 2 sorcery points.',cooldown:0,cost:'2 sorcery points'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Wisdom',bonusStats:{charisma:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'esper--aberrant-mind', name:'Path of the Aberrant Mind', jobId:'esper', jobName:'Esper', tier:2, pathType:'aberrant',
    requirements:{level:1,skills:['Arcana','Insight']},
    description:'Aberrant Mind Espers have been touched by entities from beyond the gates — Far Realm horrors that left psionic imprints on their consciousness. They cast with thought alone, their minds alien and impenetrable.',
    features:[
      {name:'Psionic Spells',description:'Learn additional spells at 1st, 3rd, 5th, 7th, 9th level (Arms of Hadar, Calm Emotions, Hunger of Hadar, Evard\'s Black Tentacles, Telekinesis). Can swap each for divination/enchantment.',level:1},
      {name:'Telepathic Speech',description:'Bonus action: telepathic link with one creature within 30 ft for Esper level minutes. Communicate in any language you know.',level:1},
      {name:'Psionic Sorcery',description:'Cast a psionic spell by spending sorcery points = spell level instead of a slot. No verbal or somatic components when cast this way.',level:6},
      {name:'Psychic Defenses',description:'Resistance to psychic damage. Advantage on saves against charmed or frightened.',level:6},
      {name:'Revelation in Flesh',description:'1+ sorcery points, bonus action: gain effects for 10 min. 1 pt: see invisible 60 ft. 1 pt: fly speed = walk speed (hover). 1 pt: swim speed = 2× walk, breathe water. 1 pt: become slimy, move through 1-inch spaces.',level:14},
      {name:'Warping Implosion',description:'Action: teleport 120 ft. Each creature within 30 ft of your origin: STR save or 3d10 force + pulled to your old space. Success: half, no pull. Once per long rest or 5 sorcery points.',level:18}
    ],
    abilities:[{name:'Mind Spike',description:'60 ft: 3d8 psychic, target can\'t be invisible to you for 1 hour. 2nd-level slot or 2 sorcery points.',cooldown:0,cost:'2 sorcery points'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Intelligence',bonusStats:{charisma:2,intelligence:1}}, source:'System Ascendant Canon' },

  // ── REVENANT PATHS (Necromancy Wizard) ── features at 2,6,10,14 ──
  { id:'revenant--grave-lord', name:'Path of the Grave Lord', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'necromancy',
    requirements:{level:2,skills:['Arcana','Medicine']},
    description:'Grave Lords are the quintessential undead commanders, raising vast armies from fallen gate monsters and reinforcing them with necrotic energy. Their undead are tougher, stronger, and more obedient than any summoned creature.',
    features:[
      {name:'Necromancy Savant',description:'Half gold and time to copy necromancy spells into your spellbook.',level:2},
      {name:'Grim Harvest',description:'Once per turn when you kill a creature with a spell of 1st+, regain HP = 2× spell level (3× for necromancy spells). Not on constructs or undead.',level:2},
      {name:'Undead Thralls',description:'Add Animate Dead to spellbook free. When you cast it, target one additional corpse/bone pile. Undead you create have extra HP = Revenant level and add your prof bonus to damage.',level:6},
      {name:'Inured to Undeath',description:'Resistance to necrotic damage. HP maximum can\'t be reduced.',level:10},
      {name:'Command Undead',description:'Action: one undead you can see within 60 ft makes a PRE save. Fail: it obeys your commands. INT 8+ gets a new save every hour. INT 12+ gets advantage.',level:14}
    ],
    abilities:[{name:'Army of the Dead',description:'Animate up to 6 undead simultaneously (instead of the normal limit). They gain extra 2d6 necrotic on attacks for 1 hour. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'revenant--soul-reaper', name:'Path of the Soul Reaper', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'enchantment',
    requirements:{level:2,skills:['Arcana','Persuasion']},
    description:'Soul Reapers harvest the lingering essence of the dead, weaving enchantments that dominate the living and bind the spirits of the fallen. They blur the line between necromancy and mind control.',
    features:[
      {name:'Hypnotic Gaze',description:'Action: one creature within 5 ft, SENSE save or charmed (incapacitated, speed 0) until end of your next turn. Extend each turn with action. Ends if creature takes damage or you move more than 5 ft away.',level:2},
      {name:'Instinctive Charm',description:'Reaction when attacked by creature within 30 ft: SENSE save or redirect to closest creature (other than you). Once per long rest (or until you cast enchantment spell).',level:6},
      {name:'Split Enchantment',description:'When you cast an enchantment spell targeting one creature, target a second creature with the same spell.',level:10},
      {name:'Alter Memories',description:'When you charm a creature, spend 1 min: INT save or it forgets up to 1+PRE mod hours of being charmed. Can also implant false memories.',level:14}
    ],
    abilities:[{name:'Soul Siphon',description:'60 ft: creature makes SENSE save or takes 3d8 psychic and you gain temp HP equal to damage dealt. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Charisma',bonusStats:{intelligence:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'revenant--war-necromancer', name:'Path of the War Necromancer', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'war-magic',
    requirements:{level:2,skills:['Arcana','Athletics']},
    description:'War Necromancers reinforce their frail bodies with necrotic energy, becoming surprisingly durable battlefield controllers. They combine defensive wards with aggressive counterspelling.',
    features:[
      {name:'Arcane Deflection',description:'Reaction when hit or fail save: +2 AC vs that attack or +4 to that save. Until end of next turn, can only cast cantrips. No uses limit.',level:2},
      {name:'Tactical Wit',description:'Add INT mod to initiative rolls.',level:2},
      {name:'Power Surge',description:'When you successfully Counterspell or Dispel Magic, store a power surge (max = INT mod). Spend one on a Revenant spell: +half Revenant level force damage to one target.',level:6},
      {name:'Durable Magic',description:'While concentrating on a spell, +2 AC and +2 to all saves.',level:10},
      {name:'Deflecting Shroud',description:'When you use Arcane Deflection, up to 3 creatures of your choice within 60 ft take half Revenant level force damage.',level:14}
    ],
    abilities:[{name:'Necrotic Armor',description:'Surround yourself in necrotic energy: +3 AC and resistance to necrotic for 1 min. Creatures that hit you in melee take 1d8 necrotic. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'revenant--blade-wraith', name:'Path of the Blade Wraith', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'bladesinging',
    requirements:{level:2,skills:['Arcana','Performance']},
    description:'Blade Wraiths merge swordplay with necromantic magic in a lethal dance, their blades trailing wisps of shadow. They are the most mobile and melee-capable of all Revenant paths.',
    features:[
      {name:'Bladesong',description:'Bonus action to start Bladesong (1 min, ends if you use two hands for weapon, wear medium/heavy armor, or are incapacitated): +INT mod to AC, +10 ft walking speed, advantage on Acrobatics, +INT mod to VIT saves for concentration. 2 uses/short rest.',level:2},
      {name:'Extra Attack',description:'Attack twice when you take the Attack action. One attack can be replaced with casting a cantrip.',level:6},
      {name:'Song of Defense',description:'While Bladesong is active, reaction when you take damage: expend a spell slot to reduce damage by 5× slot level.',level:10},
      {name:'Song of Victory',description:'While Bladesong is active, add INT mod to melee weapon damage.',level:14}
    ],
    abilities:[{name:'Shadow Dance',description:'While Bladesong is active, teleport 15 ft before each melee attack. Your blade trails necrotic shadow that deals 1d6 extra necrotic. 1 min, once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Dexterity',bonusStats:{intelligence:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'revenant--chronurgist', name:'Path of the Chronurgist', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'chronurgy',
    requirements:{level:2,skills:['Arcana','History']},
    description:'Chronurgists manipulate the flow of time itself, freezing enemies in temporal stasis, hastening allies, and storing spells in tiny time fragments for later detonation.',
    features:[
      {name:'Chronal Shift',description:'Reaction after you or a creature you see within 30 ft makes an attack/check/save: force a reroll. Choose which result to use. 2 uses/long rest.',level:2},
      {name:'Temporal Awareness',description:'Add INT mod to initiative rolls.',level:2},
      {name:'Momentary Stasis',description:'Action: Large or smaller creature within 60 ft makes VIT save or is incapacitated (speed 0) until end of your next turn. Ends early if it takes damage. INT mod uses/long rest.',level:6},
      {name:'Arcane Abeyance',description:'Cast a 4th-level or lower spell into a tiny mote (1 hour duration). A creature holding it can release the spell as an action using your stats. One mote at a time.',level:10},
      {name:'Convergent Future',description:'Reaction when a creature you see makes an attack/check/save: decide whether it succeeds or fails. After using, you take one extra exhaustion level (removable only by long rest). Once per long rest per exhaustion level.',level:14}
    ],
    abilities:[{name:'Time Stop',description:'Freeze time for 1d4+1 turns. Affected creatures and objects are frozen. Ends early if you affect a frozen creature or move more than 1000 ft. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Wisdom',bonusStats:{intelligence:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'revenant--graviturgist', name:'Path of the Graviturgist', jobId:'revenant', jobName:'Revenant', tier:2, pathType:'graviturgy',
    requirements:{level:2,skills:['Arcana','Investigation']},
    description:'Graviturgists bend gravity to their will, crushing enemies under increased weight, hurling them into the air, and creating zones of altered gravity that reshape the battlefield.',
    features:[
      {name:'Adjust Density',description:'Action: one Large or smaller object/creature within 30 ft — double or halve its weight for 1 min (concentration). Halved: +10 ft speed, jump twice as far, disadvantage on STR checks. Doubled: -10 ft speed, advantage on STR checks, 5 ft larger craters from falls.',level:2},
      {name:'Gravity Well',description:'When you cast a spell that moves a creature or it fails a save against your spell, you can move it 5 ft toward or away from you (if willing or fails save by 5+).',level:6},
      {name:'Violent Attraction',description:'Reaction: when a creature within 60 ft is hit by weapon attack, increase damage by 1d10 (magnetic pull). OR when creature within 60 ft falls, increase fall damage by 2d10. INT mod uses/long rest.',level:10},
      {name:'Event Horizon',description:'Action: 30-ft radius around you — creatures starting turn in area make STR save or take 2d10 force and speed is 0. Success: half, speed halved. Hostile creatures can\'t teleport out. Concentration, 1 min. Once per long rest or 3rd+ slot.',level:14}
    ],
    abilities:[{name:'Gravity Crush',description:'20-ft radius within 120 ft: all creatures make STR save or take 4d6 bludgeoning and are prone. Success: half, not prone. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Strength',bonusStats:{intelligence:2,strength:1}}, source:'System Ascendant Canon' },

  // ── SUMMONER PATHS (Druid) ── features at 2,6,10,14 ──
  { id:'summoner--circle-of-the-land', name:'Path of the Land', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'land',
    requirements:{level:2,skills:['Nature']},
    description:'Land Summoners draw power from the specific ecosystems found inside gates. Each terrain grants unique bonus spells, and they recover magical energy more efficiently than any other Summoner.',
    features:[
      {name:'Bonus Cantrip',description:'Learn one additional Summoner cantrip.',level:2},
      {name:'Natural Recovery',description:'During a short rest, recover spell slots with combined level ≤ half Summoner level (round up). No 6th+ slots. Once per long rest.',level:2},
      {name:'Circle Spells',description:'Gain bonus always-prepared spells at 3rd, 5th, 7th, and 9th level based on your chosen land (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, or Underdark).',level:3},
      {name:'Land\'s Stride',description:'Moving through nonmagical difficult terrain costs no extra movement. No damage from nonmagical plants (thorns, briars). Advantage on saves vs magically created/manipulated plants.',level:6},
      {name:'Nature\'s Ward',description:'Immune to poison and disease. Can\'t be charmed or frightened by elementals or fey.',level:10},
      {name:'Nature\'s Sanctuary',description:'When a beast or plant creature attacks you, it must make a SENSE save. Fail: choose a different target or the attack misses. Immune if the creature is immune to charmed.',level:14}
    ],
    abilities:[{name:'Terrain Surge',description:'Draw power from the land: regain one spell slot up to 5th level and gain advantage on all Nature/Survival checks for 1 hour. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'summoner--circle-of-the-moon', name:'Path of the Moon', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'moon',
    requirements:{level:2,skills:['Nature','Survival']},
    description:'Moon Summoners are combat shapeshifters, assuming powerful beast forms far beyond what other Summoners can manage. They are the front-line tanks who devour gate monsters in their own forms.',
    features:[
      {name:'Combat Wild Shape',description:'Wild Shape as bonus action. While in beast form, spend a spell slot to regain 1d8 per slot level HP.',level:2},
      {name:'Circle Forms',description:'Wild Shape into beasts of CR 1 (CR = Summoner level / 3 at higher levels). At 6th level, beast attacks count as magical.',level:2},
      {name:'Primal Strike',description:'Attacks in beast form count as magical for overcoming resistance and immunity.',level:6},
      {name:'Elemental Wild Shape',description:'Expend 2 Wild Shape uses to transform into an air, earth, fire, or water elemental.',level:10},
      {name:'Thousand Forms',description:'Cast Alter Self at will.',level:14}
    ],
    abilities:[{name:'Apex Form',description:'Wild Shape into a CR = Summoner level beast or elemental for 1 hour. Retain all spellcasting. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'summoner--circle-of-dreams', name:'Path of Dreams', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'dreams',
    requirements:{level:2,skills:['Nature','Insight']},
    description:'Dreams Summoners connect to the Feywild energies that sometimes bleed through gate boundaries. They heal with fey magic, create hidden shelters, and teleport through dreamlike paths.',
    features:[
      {name:'Balm of the Summer Court',description:'Pool of d6s = Summoner level. Bonus action: heal a creature within 120 ft by spending dice (up to half Summoner level dice at once) + 1 temp HP per die spent.',level:2},
      {name:'Hearth of Moonlight and Shadow',description:'During a short/long rest, create a 30-ft sphere ward. Allies inside gain +5 to Stealth and Perception. Light becomes dim light inside.',level:6},
      {name:'Hidden Paths',description:'Bonus action: teleport yourself or a willing creature within 30 ft up to 60 ft to a visible unoccupied space. SENSE mod uses/long rest.',level:10},
      {name:'Walker in Dreams',description:'After a short rest, cast Dream, Scrying, or Teleportation Circle (to last rest location) without a slot. Once per long rest.',level:14}
    ],
    abilities:[{name:'Fey Blessing',description:'All allies within 30 ft regain 2d8 HP and gain advantage on saves against charmed/frightened for 1 min. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Charisma',bonusStats:{wisdom:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'summoner--circle-of-the-shepherd', name:'Path of the Shepherd', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'shepherd',
    requirements:{level:2,skills:['Nature','Animal Handling']},
    description:'Shepherd Summoners command the beasts and spirits of the wild, calling totemic spirit guardians and enhancing summoned creatures. They are the masters of the action economy.',
    features:[
      {name:'Speech of the Woods',description:'Speak with beasts. Learn Sylvan language.',level:2},
      {name:'Spirit Totem',description:'Bonus action: summon an incorporeal spirit to a point within 60 ft (60-ft aura, 1 min, concentration). Bear Spirit: allies gain temp HP = 5 + Summoner level, advantage on STR checks/saves. Hawk Spirit: allies have advantage on Perception and you give advantage on attack rolls as reaction. Unicorn Spirit: allies have advantage on detecting creatures in aura, healing spells in aura heal each creature in it for your Summoner level HP.',level:2},
      {name:'Mighty Summoner',description:'Beasts/fey you conjure gain +2 HP per hit die and their natural weapons count as magical.',level:6},
      {name:'Guardian Spirit',description:'Beasts/fey you summon that drop to 0 HP in Spirit Totem aura instead regain half their HP max.',level:10},
      {name:'Faithful Summons',description:'When you drop to 0 HP or are incapacitated, immediately conjure 4 beasts of CR 2 or lower within 20 ft. They last 1 hour and defend you. Once/long rest.',level:14}
    ],
    abilities:[{name:'Pack Alpha',description:'All summoned/conjured creatures within 60 ft gain +2 to attack rolls and deal extra 1d4 damage for 1 min. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'summoner--circle-of-spores', name:'Path of Spores', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'spores',
    requirements:{level:2,skills:['Nature','Medicine']},
    description:'Spore Summoners embrace the cycle of decay and rebirth, commanding fungal networks and necrotic spores. They reanimate fallen creatures as fungal zombies and coat themselves in poisonous spore clouds.',
    features:[
      {name:'Halo of Spores',description:'Reaction: creature you see within 10 ft takes VIT save or necrotic damage = 1d4 (scales: 1d6 at 6th, 1d8 at 10th, 1d10 at 14th).',level:2},
      {name:'Symbiotic Entity',description:'Expend Wild Shape use: gain 4 × Summoner level temp HP. While temp HP remains, Halo of Spores damage doubles and melee attacks deal extra 1d6 necrotic. Lasts 10 min.',level:2},
      {name:'Fungal Infestation',description:'Reaction when a Small/Medium beast or humanoid drops to 0 HP within 10 ft: it rises as a zombie with 1 HP at start of your next turn. Obeys you for 1 hour. SENSE mod uses/long rest.',level:6},
      {name:'Spreading Spores',description:'While Symbiotic Entity active, bonus action: move Halo of Spores to a point within 30 ft as a 10-ft cube. Creatures entering or starting turn there take Halo damage (VIT save).',level:10},
      {name:'Fungal Body',description:'Can\'t be blinded, deafened, frightened, or poisoned. Crits against you become normal hits (unless you\'re incapacitated).',level:14}
    ],
    abilities:[{name:'Necrotic Bloom',description:'All creatures within 20 ft: VIT save or 4d8 necrotic + poisoned 1 min. Dead creatures rise as fungal zombies under your control. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'summoner--circle-of-stars', name:'Path of Stars', jobId:'summoner', jobName:'Summoner', tier:2, pathType:'stars',
    requirements:{level:2,skills:['Arcana','Nature']},
    description:'Star Summoners draw power from celestial constellations, channeling starlight into healing, destruction, or prophetic guidance. They are the most mystical of Summoner paths.',
    features:[
      {name:'Star Map',description:'Learn Guidance cantrip (free). Cast Guiding Bolt without a slot prof bonus times/long rest. Free focus for Summoner spells.',level:2},
      {name:'Starry Form',description:'Expend Wild Shape use, bonus action: take a starry form (10 min). Archer: ranged spell attack 60 ft, 1d8+SENSE radiant (bonus action each turn). Chalice: when you cast healing spell, one creature within 30 ft regains 1d8+SENSE HP. Dragon: treat any d20 roll below 10 as 10 on concentration checks and INT/SENSE checks.',level:2},
      {name:'Cosmic Omen',description:'After long rest, roll a die. Even (Weal): reaction to add 1d6 to a creature\'s d20 roll. Odd (Woe): reaction to subtract 1d6. Prof bonus uses/long rest.',level:6},
      {name:'Twinkling Constellations',description:'Starry Form: Archer becomes 2d8. Chalice becomes 2d8. Dragon also grants 20 ft fly speed (hover). At start of each turn, switch between forms.',level:10},
      {name:'Full of Stars',description:'While in Starry Form, resistance to bludgeoning, piercing, and slashing damage.',level:14}
    ],
    abilities:[{name:'Starfall',description:'30-ft radius within 120 ft: 4d10 radiant, SENSE save for half, blinded until end of your next turn on fail. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Intelligence',bonusStats:{wisdom:2,intelligence:1}}, source:'System Ascendant Canon' },

  // ── HERALD PATHS (Cleric) ── features at 1,2,6,8,17 ──
  { id:'herald--life-domain', name:'Path of the Life Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'life',
    requirements:{level:1,skills:['Medicine']},
    description:'Life Domain Heralds are the premier healers of the hunter world, channeling the System\'s restorative light. Their healing magic is unmatched, keeping entire raid parties alive through the worst gate encounters.',
    features:[
      {name:'Bonus Proficiency',description:'Gain proficiency with heavy armor.',level:1},
      {name:'Disciple of Life',description:'When you cast a healing spell of 1st+, the target regains additional HP = 2 + spell level.',level:1},
      {name:'Channel Divinity: Preserve Life',description:'Action: distribute HP = 5× Herald level among creatures within 30 ft (can\'t exceed half their max). No effect on undead or constructs.',level:2},
      {name:'Blessed Healer',description:'When you cast a healing spell of 1st+ on another creature, you regain HP = 2 + spell level.',level:6},
      {name:'Divine Strike',description:'Once per turn, weapon attacks deal extra 1d8 radiant (2d8 at 14th).',level:8},
      {name:'Supreme Healing',description:'When you roll dice to restore HP with a healing spell, use the maximum value for each die.',level:17}
    ],
    abilities:[{name:'Mass Restoration',description:'All allies within 30 ft regain 3d8+SENSE mod HP and are cured of one condition each. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'herald--light-domain', name:'Path of the Light Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'light',
    requirements:{level:1,skills:['Religion']},
    description:'Light Domain Heralds burn with the System\'s radiance, blinding enemies and incinerating undead. They combine potent offensive magic with the ability to shield allies in protective light.',
    features:[
      {name:'Bonus Cantrip',description:'Learn the Light cantrip (doesn\'t count against cantrips known).',level:1},
      {name:'Warding Flare',description:'Reaction when attacked by creature within 30 ft: impose disadvantage on the attack. SENSE mod uses/long rest.',level:1},
      {name:'Channel Divinity: Radiance of the Dawn',description:'Action: 30-ft radius — dispel magical darkness, hostile creatures take 2d10+Herald level radiant (VIT half). No damage to allies.',level:2},
      {name:'Improved Flare',description:'Warding Flare can protect others within 30 ft, not just yourself.',level:6},
      {name:'Potent Spellcasting',description:'Add SENSE mod to the damage of Herald cantrips.',level:8},
      {name:'Corona of Light',description:'Action: 60-ft bright light aura. Enemies in aura have disadvantage on saves vs fire/radiant spells. Lasts 1 min.',level:17}
    ],
    abilities:[{name:'Solar Flare',description:'30-ft cone: 4d8 radiant, VIT save for half, blinded 1 round on fail. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Charisma',bonusStats:{wisdom:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'herald--war-domain', name:'Path of the War Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'war',
    requirements:{level:1,skills:['Athletics','Religion']},
    description:'War Domain Heralds are the battle priests of the hunter guilds — armored, armed, and empowered by the System to fight on the front lines alongside Destroyers and Berserkers.',
    features:[
      {name:'Bonus Proficiencies',description:'Proficiency with martial weapons and heavy armor.',level:1},
      {name:'War Priest',description:'When you take the Attack action, make one weapon attack as a bonus action. SENSE mod uses/long rest.',level:1},
      {name:'Channel Divinity: Guided Strike',description:'When you make an attack roll, +10 to the roll. Declare after roll but before result.',level:2},
      {name:'Channel Divinity: War God\'s Blessing',description:'Reaction: creature within 30 ft makes an attack → +10 to their roll.',level:6},
      {name:'Divine Strike',description:'Once per turn, weapon attacks deal extra 1d8 damage of your weapon type (2d8 at 14th).',level:8},
      {name:'Avatar of Battle',description:'Resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.',level:17}
    ],
    abilities:[{name:'Holy Weapon',description:'Touch a weapon: it deals extra 2d8 radiant for 1 hour. When effect ends, 30-ft burst: 4d8 radiant, VIT save for half + blinded. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Strength',bonusStats:{wisdom:2,strength:1}}, source:'System Ascendant Canon' },

  { id:'herald--knowledge-domain', name:'Path of the Knowledge Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'knowledge',
    requirements:{level:1,skills:['History','Religion']},
    description:'Knowledge Domain Heralds are scholars of the System, unlocking its secrets and reading the minds of those around them. They know things they shouldn\'t, and their magic reveals all hidden truths.',
    features:[
      {name:'Blessings of Knowledge',description:'Learn two languages. Prof in two of: Arcana, History, Nature, Religion (double prof bonus).',level:1},
      {name:'Channel Divinity: Knowledge of the Ages',description:'Action: gain proficiency with one tool or skill for 10 minutes.',level:2},
      {name:'Channel Divinity: Read Thoughts',description:'Action: one creature within 60 ft, SENSE save or you read its surface thoughts for 1 min. Fail by 5+: you can also cast Suggestion on it without a slot.',level:6},
      {name:'Potent Spellcasting',description:'Add SENSE mod to Herald cantrip damage.',level:8},
      {name:'Visions of the Past',description:'Meditate 1 min on an object or area to receive visions of recent events (up to a number of days = SENSE mod).',level:17}
    ],
    abilities:[{name:'System Query',description:'Ask the System one question about any creature, object, or location. Receive a truthful answer (short phrase or image). Once/long rest.',cooldown:3,cost:'Action (1 min)'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Intelligence',bonusStats:{wisdom:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'herald--tempest-domain', name:'Path of the Tempest Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'tempest',
    requirements:{level:1,skills:['Nature','Religion']},
    description:'Tempest Domain Heralds command storms and lightning, punishing enemies with thunder and controlling the battlefield with wind. They are the most offensively powerful Herald path.',
    features:[
      {name:'Bonus Proficiencies',description:'Proficiency with martial weapons and heavy armor.',level:1},
      {name:'Wrath of the Storm',description:'Reaction when hit by melee: attacker takes 2d8 lightning or thunder (AGI half). SENSE mod uses/long rest.',level:1},
      {name:'Channel Divinity: Destructive Wrath',description:'When you deal lightning or thunder damage, maximize the damage dice instead of rolling.',level:2},
      {name:'Thunderbolt Strike',description:'When you deal lightning damage to a Large or smaller creature, push it up to 10 ft.',level:6},
      {name:'Divine Strike',description:'Once per turn, weapon deals extra 1d8 thunder (2d8 at 14th).',level:8},
      {name:'Stormborn',description:'When outdoors, gain a flying speed equal to your walking speed.',level:17}
    ],
    abilities:[{name:'Call Lightning',description:'30-ft radius within 120 ft: 3d10 lightning, AGI save for half. Maximize with Channel Divinity. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Strength',bonusStats:{wisdom:2,strength:1}}, source:'System Ascendant Canon' },

  { id:'herald--grave-domain', name:'Path of the Grave Domain', jobId:'herald', jobName:'Herald', tier:2, pathType:'grave',
    requirements:{level:1,skills:['Medicine','Religion']},
    description:'Grave Domain Heralds walk the line between life and death, ensuring the natural order. They are devastating against undead and can deny death itself — or guarantee it with a single curse.',
    features:[
      {name:'Circle of Mortality',description:'When you cast a healing spell on a creature at 0 HP, treat all dice as maximum. Spare the Dying cantrip has 30-ft range and is a bonus action.',level:1},
      {name:'Eyes of the Grave',description:'Action: detect undead within 60 ft (not behind total cover). SENSE mod uses/long rest.',level:1},
      {name:'Channel Divinity: Path to the Grave',description:'Action: curse a creature within 30 ft. Next attack against it deals double damage (all damage types). Curse ends after one attack.',level:2},
      {name:'Sentinel at Death\'s Door',description:'Reaction: when you or ally within 30 ft suffers a critical hit, turn it into a normal hit. SENSE mod uses/long rest.',level:6},
      {name:'Potent Spellcasting',description:'Add SENSE mod to Herald cantrip damage.',level:8},
      {name:'Keeper of Souls',description:'When an enemy you can see dies within 60 ft, you or an ally within 60 ft regains HP = the creature\'s hit dice number. Once per round.',level:17}
    ],
    abilities:[{name:'Death Ward',description:'Touch: for 8 hours, first time target drops to 0 HP, it drops to 1 HP instead. Once/long rest without slot.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Wisdom',secondaryAttribute:'Constitution',bonusStats:{wisdom:2,constitution:1}}, source:'System Ascendant Canon' },

  // ── CONTRACTOR PATHS (Warlock) ── features at 1,6,10,14 ──
  { id:'contractor--archfey', name:'Path of the Archfey', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'archfey',
    requirements:{level:1,skills:['Arcana','Deception']},
    description:'Archfey Contractors bargain with powerful fey entities that lurk in the enchanted ecosystems inside gates. Their magic charms, terrifies, and beguiles — a web of glamour that ensnares the unwary.',
    features:[
      {name:'Fey Presence',description:'Action: each creature in 10-ft cube originating from you makes SENSE save or is charmed or frightened until end of your next turn. Once per short rest.',level:1},
      {name:'Misty Escape',description:'Reaction when you take damage: become invisible and teleport up to 60 ft. Invisible until start of next turn or until you attack/cast. Once per short rest.',level:6},
      {name:'Beguiling Defenses',description:'Immune to being charmed. When a creature tries to charm you, use reaction to turn the charm back on it (SENSE save).',level:10},
      {name:'Dark Delirium',description:'Action: one creature within 60 ft, SENSE save or charmed/frightened for 1 min (you choose). Target perceives itself lost in a misty realm. Concentration. Once per short rest.',level:14}
    ],
    abilities:[{name:'Faerie Fire',description:'20-ft cube: creatures AGI save or outlined in light (advantage on attacks against them, can\'t be invisible). 1 min concentration.',cooldown:0,cost:'Spell slot'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Dexterity',bonusStats:{charisma:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'contractor--fiend', name:'Path of the Fiend', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'fiend',
    requirements:{level:1,skills:['Arcana','Intimidation']},
    description:'Fiend Contractors make pacts with demons and devils that dwell in the deepest gate layers. Their magic burns with hellfire, and they grow stronger with each enemy they slay.',
    features:[
      {name:'Dark One\'s Blessing',description:'When you reduce a hostile creature to 0 HP, gain temp HP = PRE mod + Contractor level.',level:1},
      {name:'Dark One\'s Own Luck',description:'When you make an ability check or save, add 1d10 to the roll. Once per short rest.',level:6},
      {name:'Fiendish Resilience',description:'At the end of a short/long rest, choose one damage type (not force, radiant, or magical bludgeoning/piercing/slashing). You have resistance to that type until you choose another.',level:10},
      {name:'Hurl Through Hell',description:'When you hit with an attack, banish the creature through hell. It takes 10d10 psychic damage when it returns at end of your next turn. Once per long rest.',level:14}
    ],
    abilities:[{name:'Hellfire Blast',description:'Eldritch Blast deals fire instead of force and ignites the target: 1d6 fire at start of each of its turns for 1 min (VIT save ends). Once/short rest.',cooldown:1,cost:'Free'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'contractor--great-old-one', name:'Path of the Great Old One', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'great-old-one',
    requirements:{level:1,skills:['Arcana','Investigation']},
    description:'Great Old One Contractors commune with alien intelligences from beyond the gates — entities so vast and ancient that even fragments of their consciousness can shatter mortal minds.',
    features:[
      {name:'Awakened Mind',description:'Telepathically communicate with any creature within 30 ft. No shared language needed. The creature can respond telepathically.',level:1},
      {name:'Entropic Ward',description:'Reaction when attacked: impose disadvantage. If the attack misses, gain advantage on your next attack vs that creature before end of your next turn. Once per short rest.',level:6},
      {name:'Thought Shield',description:'Resistance to psychic damage. Your thoughts can\'t be read unless you allow it. Creatures that deal psychic damage to you take the same amount.',level:10},
      {name:'Create Thrall',description:'Touch an incapacitated humanoid: it is charmed by you indefinitely. You can communicate telepathically across any distance (same plane). It follows your commands.',level:14}
    ],
    abilities:[{name:'Psychic Scream',description:'60-ft range: creature makes INT save or takes 3d10 psychic and is stunned until end of your next turn. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Intelligence',bonusStats:{charisma:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'contractor--celestial', name:'Path of the Celestial', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'celestial',
    requirements:{level:1,skills:['Arcana','Religion']},
    description:'Celestial Contractors forge pacts with benevolent entities from the upper planes — solar angels and empyrean beings who grant healing light alongside eldritch power.',
    features:[
      {name:'Bonus Cantrips',description:'Learn Light and Sacred Flame cantrips (don\'t count against cantrips known).',level:1},
      {name:'Healing Light',description:'Pool of d6s = 1 + Contractor level. Bonus action: heal a creature within 60 ft by spending dice (up to PRE mod at once).',level:1},
      {name:'Radiant Soul',description:'Resistance to radiant damage. When you deal fire or radiant damage with a spell, add PRE mod to one roll.',level:6},
      {name:'Celestial Resilience',description:'You gain temp HP = Contractor level + PRE mod at end of short/long rest. Choose up to 5 creatures: they gain temp HP = half Contractor level + PRE mod.',level:10},
      {name:'Searing Vengeance',description:'When you make a death save at start of your turn, you can instead spring up (no HP cost) with half HP max, and each creature within 30 ft takes 2d8+PRE mod radiant and is blinded until end of turn. Once per long rest.',level:14}
    ],
    abilities:[{name:'Radiant Burst',description:'30-ft radius: 3d8 radiant, VIT save for half. You and allies in range heal for half damage dealt. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Wisdom',bonusStats:{charisma:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'contractor--hexblade', name:'Path of the Hexblade', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'hexblade',
    requirements:{level:1,skills:['Arcana','Athletics']},
    description:'Hexblade Contractors forge pacts with sentient weapons from the Shadowfell. They are the most martial of all Contractors, wielding cursed blades that drain life and shatter armor.',
    features:[
      {name:'Hexblade\'s Curse',description:'Bonus action: curse a creature within 30 ft for 1 min. You gain: +prof bonus to damage vs it, crit on 19-20 vs it, regain HP = Contractor level + PRE mod if it dies. Once per short rest.',level:1},
      {name:'Hex Warrior',description:'Prof with medium armor, shields, and martial weapons. Use PRE for attack/damage with one weapon you touch (changes on long rest). Pact weapons always use PRE.',level:1},
      {name:'Accursed Specter',description:'When you slay a humanoid, raise it as a specter under your control. It gains temp HP = half Contractor level and adds your PRE mod to attack rolls. One at a time, once per long rest.',level:6},
      {name:'Armor of Hexes',description:'If the creature cursed by your Hexblade\'s Curse hits you, roll d6. On 4+, the attack misses regardless of roll.',level:10},
      {name:'Master of Hexes',description:'When a creature cursed by your Hexblade\'s Curse dies, apply the curse to a different creature within 30 ft (no bonus action needed).',level:14}
    ],
    abilities:[{name:'Shadow Blade',description:'Conjure a blade of shadow: 2d8 psychic, finesse, light, thrown (20/60). Advantage on attacks in dim light/darkness. 1 min concentration.',cooldown:0,cost:'Spell slot'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Strength',bonusStats:{charisma:2,strength:1}}, source:'System Ascendant Canon' },

  { id:'contractor--fathomless', name:'Path of the Fathomless', jobId:'contractor', jobName:'Contractor', tier:2, pathType:'fathomless',
    requirements:{level:1,skills:['Arcana','Nature']},
    description:'Fathomless Contractors bargain with ancient sea entities and kraken-like horrors from aquatic gates. Spectral tentacles obey their commands, and the crushing depths empower their magic.',
    features:[
      {name:'Tentacle of the Deeps',description:'Bonus action: summon a 10-ft spectral tentacle within 60 ft. On creation and as bonus action each turn: melee spell attack, 1d8 cold, -10 ft speed until start of your next turn. Lasts 1 min. PRE mod uses/long rest.',level:1},
      {name:'Gift of the Sea',description:'40-ft swim speed. Breathe underwater.',level:1},
      {name:'Oceanic Soul',description:'Resistance to cold. Breathe underwater. You and creatures you choose within 30 ft can be understood when speaking underwater.',level:6},
      {name:'Guardian Coil',description:'Reaction when you or creature within 10 ft of your tentacle takes damage: reduce damage by 1d8.',level:6},
      {name:'Grasping Tentacles',description:'Cast Evard\'s Black Tentacles once/long rest without a slot or components. When you cast it, your Tentacle of the Deeps can\'t be damaged while in the spell\'s area.',level:10},
      {name:'Fathomless Plunge',description:'Action: teleport yourself and up to 5 willing creatures within 30 ft up to 1 mile to a body of water you\'ve seen. Once per short rest.',level:14}
    ],
    abilities:[{name:'Crushing Depths',description:'60-ft radius: creatures make STR save or take 3d8 cold + restrained 1 round. Success: half, not restrained. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  // ── STALKER PATHS (Ranger) ── features at 3,7,11,15 ──
  { id:'stalker--hunter', name:'Path of the Hunter', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'hunter',
    requirements:{level:3,skills:['Survival','Perception']},
    description:'Hunters specialize in taking down specific types of prey, adapting their tactics to exploit enemy weaknesses. They are the most versatile and self-sufficient Stalker path.',
    features:[
      {name:'Hunter\'s Prey',description:'Choose one: Colossus Slayer (1d8 extra on hit vs creature below max HP, once/turn), Giant Killer (reaction attack when Large+ creature within 5 ft attacks you), or Horde Breaker (additional attack on a different creature within 5 ft of original target).',level:3},
      {name:'Defensive Tactics',description:'Choose one: Escape the Horde (OAs vs you have disadvantage), Multiattack Defense (+4 AC after being hit, until end of turn), or Steel Will (advantage on saves vs frightened).',level:7},
      {name:'Multiattack',description:'Choose one: Volley (ranged attack every creature within 10 ft of a point in range), or Whirlwind Attack (melee attack every creature within 5 ft).',level:11},
      {name:'Superior Hunter\'s Defense',description:'Choose one: Evasion (AGI saves: success = no damage, fail = half), Stand Against the Tide (reaction: redirect missed melee to another creature), or Uncanny Dodge (reaction: halve damage from attack you can see).',level:15}
    ],
    abilities:[{name:'Prey Designation',description:'Mark a creature: advantage on all attacks and Survival checks against it for 1 hour. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'stalker--beast-master', name:'Path of the Beast Master', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'beast-master',
    requirements:{level:3,skills:['Animal Handling','Nature']},
    description:'Beast Masters form deep bonds with gate-spawned creatures, taming monsters that would kill lesser hunters. Their beast companions fight alongside them with devastating coordination.',
    features:[
      {name:'Primal Companion',description:'Gain a beast companion (Beast of the Land, Sea, or Sky). It obeys your commands, acts on your initiative, and you can command it to attack as a bonus action. It uses your prof bonus for AC, attacks, saves, and skills.',level:3},
      {name:'Exceptional Training',description:'Your companion\'s attacks count as magical. When you command it to take an action, it can also Dash, Disengage, or Help.',level:7},
      {name:'Bestial Fury',description:'When you command your companion to Attack, it makes two attacks.',level:11},
      {name:'Share Spells',description:'When you cast a spell targeting yourself, your companion also benefits if it\'s within 30 ft.',level:15}
    ],
    abilities:[{name:'Coordinated Assault',description:'You and your companion both attack the same target with advantage. If both hit, the target must VIT save or be stunned until end of your next turn. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'stalker--gloom-stalker', name:'Path of the Gloom Stalker', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'gloom-stalker',
    requirements:{level:3,skills:['Stealth','Perception']},
    description:'Gloom Stalkers thrive in the darkness of deep gates, becoming invisible in shadow and striking with devastating ambush tactics. They are the first ones sent into unknown dark zones.',
    features:[
      {name:'Dread Ambusher',description:'First turn of combat: +SENSE mod to initiative, walking speed +10 ft, and one extra attack (deals additional 1d8 damage).',level:3},
      {name:'Umbral Sight',description:'Darkvision 60 ft (or +30 ft if you already have it). While in darkness, you are invisible to creatures that rely on darkvision to see you.',level:3},
      {name:'Iron Mind',description:'Prof in SENSE saves. If already proficient, choose INT or PRE saves instead.',level:7},
      {name:'Stalker\'s Flurry',description:'When you miss with a weapon attack, make another weapon attack as part of the same action. Once per turn.',level:11},
      {name:'Shadowy Dodge',description:'Reaction when attacked (no advantage): impose disadvantage on the attack.',level:15}
    ],
    abilities:[{name:'Shadow Ambush',description:'Become invisible for 1 round. Your first attack from invisibility deals extra 2d8 damage and the target must SENSE save or be frightened. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'stalker--horizon-walker', name:'Path of the Horizon Walker', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'horizon-walker',
    requirements:{level:3,skills:['Arcana','Survival']},
    description:'Horizon Walkers patrol the boundaries between dimensions, hunting creatures that cross through gates. They can sense planar portals and teleport short distances in combat.',
    features:[
      {name:'Detect Portal',description:'Action: sense the distance and direction to the closest planar portal within 1 mile. Once per short rest.',level:3},
      {name:'Planar Warrior',description:'Bonus action: choose one creature within 30 ft. Next hit this turn deals extra 1d8 force (2d8 at 11th) and all damage becomes force.',level:3},
      {name:'Ethereal Step',description:'Bonus action: step into the Ethereal Plane until end of turn. You can see/be seen as ghostly. Move through creatures/objects. Once per short rest.',level:7},
      {name:'Distant Strike',description:'When you take the Attack action, teleport 10 ft before each attack. If you attack at least two different creatures, make one additional attack against a third.',level:11},
      {name:'Spectral Defense',description:'Reaction when you take damage: gain resistance to all of that attack\'s damage.',level:15}
    ],
    abilities:[{name:'Planar Rift',description:'Open a 20-ft radius rift at a point within 120 ft: creatures make AGI save or 4d10 force + banished to another plane until end of your next turn. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'stalker--monster-slayer', name:'Path of the Monster Slayer', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'monster-slayer',
    requirements:{level:3,skills:['Investigation','Survival']},
    description:'Monster Slayers study their prey obsessively, learning to counter every ability and exploit every vulnerability. They are the go-to specialists for hunting boss-tier gate monsters.',
    features:[
      {name:'Hunter\'s Sense',description:'Action: learn one creature\'s immunities, resistances, and vulnerabilities. SENSE mod uses/long rest.',level:3},
      {name:'Slayer\'s Prey',description:'Bonus action: designate a creature within 60 ft. First hit each turn deals extra 1d6 damage. Until the creature dies, you choose a new target, or you short/long rest.',level:3},
      {name:'Supernatural Defense',description:'When your Slayer\'s Prey target forces you to make a save, add 1d6 to your save.',level:7},
      {name:'Magic-User\'s Nemesis',description:'Reaction when a creature within 60 ft casts a spell or teleports: SENSE save or the spell/teleport fails and is wasted. Once per short rest.',level:11},
      {name:'Slayer\'s Counter',description:'Reaction when your Slayer\'s Prey target forces you to make a save: make a weapon attack. If it hits, your save auto-succeeds.',level:15}
    ],
    abilities:[{name:'Exploit Weakness',description:'After using Hunter\'s Sense, your attacks against that creature ignore resistances and treat immunities as resistance for 1 min. Once/long rest.',cooldown:3,cost:'Free'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'stalker--swarm-keeper', name:'Path of the Swarm Keeper', jobId:'stalker', jobName:'Stalker', tier:2, pathType:'swarmkeeper',
    requirements:{level:3,skills:['Nature','Survival']},
    description:'Swarm Keepers are bonded to a living swarm of creatures — insects, spirits, or tiny constructs — that inhabit their body and fight alongside them. The swarm enhances every attack and provides mobility.',
    features:[
      {name:'Gathered Swarm',description:'Once per turn on hit: swarm deals extra 1d6 piercing, or pushes target 15 ft horizontally (STR save), or moves you 5 ft (no OA). Damage becomes 1d8 at 11th.',level:3},
      {name:'Swarmkeeper Magic',description:'Learn bonus spells: Faerie Fire (3rd), Web (5th), Gaseous Form (9th), Arcane Eye (13th), Insect Plague (17th).',level:3},
      {name:'Writhing Tide',description:'Bonus action: swarm lifts you, giving 10-ft fly speed (hover) for 1 min. Prof bonus uses/long rest.',level:7},
      {name:'Mighty Swarm',description:'Gathered Swarm: damage becomes 1d8 piercing. Push: target also knocked prone on failed STR save. Move: you also gain half cover until start of next turn.',level:11},
      {name:'Swarming Dispersal',description:'Reaction when you take damage: gain resistance and teleport up to 30 ft as your body dissolves into the swarm. Prof bonus uses/long rest.',level:15}
    ],
    abilities:[{name:'Swarm Eruption',description:'Release the swarm: all creatures within 15 ft take 3d8 piercing (AGI half) and are blinded until end of your next turn. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Dexterity',secondaryAttribute:'Wisdom',bonusStats:{dexterity:2,wisdom:1}}, source:'System Ascendant Canon' },

  // ── HOLY KNIGHT PATHS (Paladin) ── features at 3,7,15,20 ──
  { id:'holy-knight--devotion', name:'Path of Devotion', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'devotion',
    requirements:{level:3,skills:['Religion']},
    description:'Devotion Holy Knights are paragons of virtue, their unwavering faith in the System granting them unparalleled defensive auras and the ability to create sacred weapons of pure radiant energy.',
    features:[
      {name:'Channel Divinity: Sacred Weapon',description:'Action: for 1 min, add PRE mod to attack rolls with one weapon (min +1). Weapon emits bright light 20 ft. Counts as magical.',level:3},
      {name:'Channel Divinity: Turn the Unholy',description:'Action: fiends and undead within 30 ft make SENSE save or are turned for 1 min.',level:3},
      {name:'Aura of Devotion',description:'You and allies within 10 ft can\'t be charmed while conscious. 30 ft at 18th.',level:7},
      {name:'Purity of Spirit',description:'You are always under the effect of Protection from Evil and Good.',level:15},
      {name:'Holy Nimbus',description:'Action: 30-ft bright light aura for 1 min. Enemies starting turn in aura take 10 radiant. Advantage on saves vs fiend/undead spells. Once/long rest.',level:20}
    ],
    abilities:[{name:'Sacred Smite',description:'Channel divine energy: next melee hit deals extra 3d8 radiant and target must SENSE save or be blinded for 1 round. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Charisma',bonusStats:{strength:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'holy-knight--vengeance', name:'Path of Vengeance', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'vengeance',
    requirements:{level:3,skills:['Intimidation']},
    description:'Vengeance Holy Knights pursue the wicked with relentless fury. They are the strike-team specialists — less defensive than Devotion, but devastating against single high-value targets.',
    features:[
      {name:'Channel Divinity: Abjure Enemy',description:'Action: one creature within 60 ft makes SENSE save or is frightened and speed is 0 for 1 min (half speed on success). Fiends/undead have disadvantage.',level:3},
      {name:'Channel Divinity: Vow of Enmity',description:'Bonus action: gain advantage on attacks against one creature within 10 ft for 1 min.',level:3},
      {name:'Relentless Avenger',description:'When you hit with OA, move up to half speed immediately after (no OA against you).',level:7},
      {name:'Soul of Vengeance',description:'When creature under your Vow of Enmity attacks, reaction: make a melee weapon attack against it.',level:15},
      {name:'Avenging Angel',description:'Action: transform for 1 hour — 60-ft fly speed, 30-ft aura of menace (SENSE save or frightened 1 min on first seeing you). Once/long rest.',level:20}
    ],
    abilities:[{name:'Relentless Pursuit',description:'Designate a creature: for 1 min, you can\'t be slowed, restrained, or have your speed reduced while moving toward it. Advantage on saves vs its spells. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Charisma',bonusStats:{strength:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'holy-knight--ancients', name:'Path of the Ancients', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'ancients',
    requirements:{level:3,skills:['Nature','Religion']},
    description:'Ancients Holy Knights swear to protect life and light against the encroaching darkness of the gates. Their oath is older than any guild — a primal covenant with the System itself.',
    features:[
      {name:'Channel Divinity: Nature\'s Wrath',description:'Action: spectral vines restrain a creature within 10 ft (STR or AGI save to escape, check each turn).',level:3},
      {name:'Channel Divinity: Turn the Faithless',description:'Action: fey and fiends within 30 ft make SENSE save or are turned for 1 min.',level:3},
      {name:'Aura of Warding',description:'You and allies within 10 ft have resistance to spell damage. 30 ft at 18th.',level:7},
      {name:'Undying Sentinel',description:'When reduced to 0 HP and not killed outright, drop to 1 HP instead. Once per long rest. Also, you suffer no drawbacks of old age and can\'t be aged magically.',level:15},
      {name:'Elder Champion',description:'Action: transform for 1 min — regain 10 HP at start of each turn, cast Holy Knight spells as bonus action, enemies within 10 ft have disadvantage on saves vs your spells/Channel Divinity. Once/long rest.',level:20}
    ],
    abilities:[{name:'Nature\'s Bulwark',description:'All allies within 30 ft gain resistance to all spell damage and advantage on saves vs spells for 1 min. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Charisma',bonusStats:{strength:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'holy-knight--conquest', name:'Path of Conquest', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'conquest',
    requirements:{level:3,skills:['Intimidation','Athletics']},
    description:'Conquest Holy Knights rule through overwhelming force and fear. Their aura of menace freezes enemies in place, and their divine might crushes all opposition beneath an iron heel.',
    features:[
      {name:'Channel Divinity: Conquering Presence',description:'Action: each creature of your choice within 30 ft makes SENSE save or is frightened for 1 min (save end of each turn).',level:3},
      {name:'Channel Divinity: Guided Strike',description:'+10 to an attack roll. Declare after roll but before result.',level:3},
      {name:'Aura of Conquest',description:'Frightened creatures within 10 ft have speed 0 and take psychic damage = half Holy Knight level at start of their turn. 30 ft at 18th.',level:7},
      {name:'Scornful Rebuke',description:'Whenever a creature hits you with an attack, it takes psychic damage = PRE mod.',level:15},
      {name:'Invincible Conqueror',description:'Action: transform for 1 min — resistance to all damage, Extra Attack becomes three attacks, crits on 19-20. Once/long rest.',level:20}
    ],
    abilities:[{name:'Crushing Presence',description:'All enemies within 30 ft: SENSE save or prone + frightened + speed 0 for 1 round. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Charisma',bonusStats:{strength:2,charisma:1}}, source:'System Ascendant Canon' },

  { id:'holy-knight--redemption', name:'Path of Redemption', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'redemption',
    requirements:{level:3,skills:['Persuasion','Religion']},
    description:'Redemption Holy Knights believe in peace and compassion, absorbing damage meant for allies and punishing aggressors. They are the ultimate pacifist-tanks, trying to end fights without killing.',
    features:[
      {name:'Channel Divinity: Emissary of Peace',description:'+5 to Persuasion checks for 10 min.',level:3},
      {name:'Channel Divinity: Rebuke the Violent',description:'Reaction: when a creature within 30 ft deals damage, it takes radiant damage equal to the damage dealt (SENSE save for half).',level:3},
      {name:'Aura of the Guardian',description:'Reaction: when a creature within 10 ft takes damage, magically take the damage instead (no reduction). 30 ft at 18th.',level:7},
      {name:'Protective Spirit',description:'At end of each turn, if you have less than half HP max, regain 1d6+half Holy Knight level HP.',level:15},
      {name:'Emissary of Redemption',description:'Resistance to all damage from other creatures (not you). When a creature damages you, it takes radiant damage = half what it dealt. Both benefits lost vs a creature you attack/force a save against (until long rest).',level:20}
    ],
    abilities:[{name:'Shield of the Faithful',description:'For 1 min, all damage dealt to allies within 30 ft is halved and you take the other half. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Constitution',bonusStats:{charisma:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'holy-knight--glory', name:'Path of Glory', jobId:'holy-knight', jobName:'Holy Knight', tier:2, pathType:'glory',
    requirements:{level:3,skills:['Athletics','Performance']},
    description:'Glory Holy Knights strive for physical perfection and legendary deeds. They inspire allies with their feats, enhance their own bodies with divine power, and turn every battle into an epic spectacle.',
    features:[
      {name:'Channel Divinity: Peerless Athlete',description:'10 min: advantage on Athletics and Acrobatics. Carry/push/pull/lift capacity doubled. +10 ft to running long and high jumps.',level:3},
      {name:'Channel Divinity: Inspiring Smite',description:'After Divine Smite, distribute temp HP = 2d8+Holy Knight level among creatures within 30 ft (including yourself).',level:3},
      {name:'Aura of Alacrity',description:'Your speed +10 ft. Allies starting turn within 5 ft gain +10 ft speed until end of their turn. 10 ft at 18th.',level:7},
      {name:'Glorious Defense',description:'Reaction: when a creature you can see within 10 ft is hit, add PRE mod to its AC. If the attack misses, make one weapon attack against the attacker. PRE mod uses/long rest.',level:15},
      {name:'Living Legend',description:'Bonus action for 1 min: advantage on PRE checks, once per turn turn a miss into a hit, reroll a failed save (once). Once/long rest.',level:20}
    ],
    abilities:[{name:'Heroic Charge',description:'Move up to double speed in a straight line. Each creature you pass within 5 ft: STR save or prone + 2d8 radiant. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Strength',secondaryAttribute:'Charisma',bonusStats:{strength:2,charisma:1}}, source:'System Ascendant Canon' },

  // ── TECHNOMANCER PATHS (Artificer) ── features at 3,5,9,15 ──
  { id:'technomancer--alchemist', name:'Path of the Alchemist', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'alchemist',
    requirements:{level:3,skills:['Arcana','Medicine']},
    description:'Alchemists brew potent elixirs from gate-harvested reagents, creating healing draughts, explosive compounds, and transformative potions that enhance their party\'s capabilities.',
    features:[
      {name:'Tool Proficiency',description:'Prof with alchemist\'s supplies.',level:3},
      {name:'Alchemist Spells',description:'Always prepared: Healing Word, Ray of Sickness (3rd), Flaming Sphere, Melf\'s Acid Arrow (5th), Gaseous Form, Mass Healing Word (9th), Blight, Death Ward (13th), Cloudkill, Raise Dead (17th).',level:3},
      {name:'Experimental Elixir',description:'After long rest, create one free elixir (more by spending spell slots). Roll d6 for type: healing (2d4+INT), swiftness (+10 ft speed), resilience (+1 AC), boldness (1d4 to attacks/saves), flight (10 ft fly), or transformation (alter self). Lasts until next long rest or drunk.',level:3},
      {name:'Alchemical Savant',description:'When you use alchemist\'s supplies as focus for a spell that restores HP or deals acid/fire/necrotic/poison damage, add INT mod to one roll.',level:5},
      {name:'Restorative Reagents',description:'Experimental Elixirs also grant 2d6+INT mod temp HP. Cast Lesser Restoration INT mod times/long rest without a slot.',level:9},
      {name:'Chemical Mastery',description:'Resistance to acid and poison damage, immune to poisoned condition. Cast Greater Restoration and Heal once each/long rest without a slot (using alchemist\'s supplies).',level:15}
    ],
    abilities:[{name:'Volatile Concoction',description:'Throw an alchemical bomb: 20-ft radius, 4d6 acid + 4d6 fire, AGI save for half. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Wisdom',bonusStats:{intelligence:2,wisdom:1}}, source:'System Ascendant Canon' },

  { id:'technomancer--armorer', name:'Path of the Armorer', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'armorer',
    requirements:{level:3,skills:['Arcana','Athletics']},
    description:'Armorers infuse suits of armor with System-enhanced magic, creating powered exoskeletons that grant superhuman strength, built-in weapons, and impenetrable defenses.',
    features:[
      {name:'Tools of the Trade',description:'Prof with heavy armor and smith\'s tools.',level:3},
      {name:'Armorer Spells',description:'Always prepared: Magic Missile, Thunderwave (3rd), Mirror Image, Shatter (5th), Hypnotic Pattern, Lightning Bolt (9th), Fire Shield, Greater Invisibility (13th), Passwall, Wall of Force (17th).',level:3},
      {name:'Arcane Armor',description:'Action: turn a suit of armor into Arcane Armor. It replaces missing limbs, can\'t be removed against your will, covers/replaces your fists. Choose model: Guardian (thunder gauntlets: 1d8 thunder melee, target has disadvantage on attacks vs others; defensive field: temp HP = Technomancer level as bonus action) or Infiltrator (lightning launcher: 1d6 lightning ranged 90 ft + 1d6 once/turn, +5 ft speed, advantage on Stealth).',level:3},
      {name:'Extra Attack',description:'Attack twice when you take the Attack action.',level:5},
      {name:'Armor Modifications',description:'Your Arcane Armor now counts as separate items for infusion purposes: armor (chest), boots, helmet, and weapon (each can hold one infusion). Max infusions increases by 2.',level:9},
      {name:'Perfected Armor',description:'Guardian: reaction when a creature you can see within 30 ft is hit — pull it up to 30 ft toward you, and if it ends within 5 ft, make a melee attack with thunder gauntlets. Infiltrator: any creature that takes lightning damage from you glows with light, and next attack against it has advantage; if that attack hits, it deals extra 1d6 lightning.',level:15}
    ],
    abilities:[{name:'Overdrive',description:'Bonus action: Arcane Armor overcharges for 1 min. Guardian: thunder gauntlets deal 2d8. Infiltrator: lightning launcher deals 2d6+1d6 bonus. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'technomancer--artillerist', name:'Path of the Artillerist', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'artillerist',
    requirements:{level:3,skills:['Arcana']},
    description:'Artillerists specialize in destructive magic channeled through arcane cannons — turret-like constructs that lay down suppressive fire, shield allies, or burn enemies from a distance.',
    features:[
      {name:'Tool Proficiency',description:'Prof with woodcarver\'s tools.',level:3},
      {name:'Artillerist Spells',description:'Always prepared: Shield, Thunderwave (3rd), Scorching Ray, Shatter (5th), Fireball, Wind Wall (9th), Ice Storm, Wall of Fire (13th), Cone of Cold, Wall of Force (17th).',level:3},
      {name:'Eldritch Cannon',description:'Action: create a Small or Tiny eldritch cannon in an unoccupied space within 5 ft. HP = 5× Technomancer level, AC 18. Choose type: Flamethrower (15-ft cone, 2d8 fire, AGI half), Force Ballista (ranged 120 ft, 2d8 force, push 5 ft), or Protector (10-ft radius, 1d8+INT mod temp HP to each creature you choose). Bonus action to fire. One at a time (two at 15th).',level:3},
      {name:'Arcane Firearm',description:'Use a wand, staff, or rod as spellcasting focus. +1d8 to one damage roll of Technomancer spell damage through it.',level:5},
      {name:'Explosive Cannon',description:'Eldritch Cannon damage increases by 1d8. As an action, command cannon to self-destruct: creatures within 20 ft take 3d8 force (AGI half).',level:9},
      {name:'Fortified Position',description:'You can create two cannons. You and allies within 10 ft of a cannon have half cover.',level:15}
    ],
    abilities:[{name:'Barrage',description:'All your cannons fire simultaneously at full damage. Each cannon can target a different creature. Once/short rest.',cooldown:1,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'technomancer--battle-smith', name:'Path of the Battle Smith', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'battle-smith',
    requirements:{level:3,skills:['Arcana','Athletics']},
    description:'Battle Smiths create Steel Defenders — loyal construct companions that fight alongside them. They also enchant their own weapons to use Intelligence for attacks, becoming formidable melee combatants.',
    features:[
      {name:'Tool Proficiency',description:'Prof with smith\'s tools.',level:3},
      {name:'Battle Smith Spells',description:'Always prepared: Heroism, Shield (3rd), Branding Smite, Warding Bond (5th), Aura of Vitality, Conjure Barrage (9th), Aura of Purity, Fire Shield (13th), Banishing Smite, Mass Cure Wounds (17th).',level:3},
      {name:'Battle Ready',description:'Prof with martial weapons. Use INT instead of STR or AGI for magic weapon attack/damage rolls.',level:3},
      {name:'Steel Defender',description:'Create a construct companion. HP = 2 + INT mod + 5× Technomancer level. AC = 15, uses your prof bonus. Takes its turn after yours; you command it (Dodge default). Reaction: impose disadvantage on attack vs creature within 5 ft of it. If destroyed, spend a spell slot during short/long rest to rebuild.',level:3},
      {name:'Extra Attack',description:'Attack twice when you take the Attack action.',level:5},
      {name:'Arcane Jolt',description:'When you or your Steel Defender hit with a magic weapon attack, deal extra 2d6 force damage OR heal a creature within 30 ft for 2d6 HP. INT mod uses/long rest.',level:9},
      {name:'Improved Defender',description:'Steel Defender\'s Deflect Attack now deals 1d4+INT mod force to the attacker. Arcane Jolt damage/healing increases to 4d6.',level:15}
    ],
    abilities:[{name:'Construct Overdrive',description:'Steel Defender gains +2 AC, double speed, and its attacks deal extra 2d6 force for 1 min. Once/long rest.',cooldown:3,cost:'Bonus action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Constitution',bonusStats:{intelligence:2,constitution:1}}, source:'System Ascendant Canon' },

  { id:'technomancer--drone-master', name:'Path of the Drone Master', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'drone-master',
    requirements:{level:3,skills:['Arcana','Investigation']},
    description:'Drone Masters deploy System-enhanced reconnaissance and combat drones, controlling swarms of tiny constructs that scout, attack, and provide tactical intelligence across an entire gate.',
    features:[
      {name:'Tool Proficiency',description:'Prof with tinker\'s tools.',level:3},
      {name:'Drone Swarm',description:'Create up to INT mod Tiny drones (AC 13, 1 HP, 30 ft fly). They share your senses (you can see/hear through any drone within 1 mile). Bonus action: command all drones. Rebuild destroyed drones during short rest.',level:3},
      {name:'Combat Protocols',description:'Bonus action: command a drone within 60 ft to deliver a spell with range of touch. Drones can also take the Help action to give advantage on attacks.',level:5},
      {name:'Surveillance Network',description:'Drones within 120 ft of each other form a network. You have advantage on Perception and Investigation in the network area. Creatures can\'t surprise you or allies while in the network.',level:9},
      {name:'Advanced Drone Systems',description:'Drones gain: 30 HP, AC 15, 60 ft fly speed. They can carry and use items. You can see through all drones simultaneously. Command up to 3 drones with a single bonus action.',level:15}
    ],
    abilities:[{name:'Drone Strike',description:'All drones within 60 ft converge on a point: 20-ft radius, 1d6 force per drone (max 6d6), AGI save for half. Drones are destroyed. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Dexterity',bonusStats:{intelligence:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'technomancer--system-hacker', name:'Path of the System Hacker', jobId:'technomancer', jobName:'Technomancer', tier:2, pathType:'system-hacker',
    requirements:{level:3,skills:['Arcana','Investigation']},
    description:'System Hackers interface directly with the System\'s architecture, manipulating its rules to buff allies, debuff enemies, and rewrite the laws of magic in a localized area.',
    features:[
      {name:'Tool Proficiency',description:'Prof with hacker\'s tools (thieves\' tools variant).',level:3},
      {name:'System Override',description:'As an action, target one creature within 60 ft. INT save or one of its resistances, immunities, or condition immunities is suppressed for 1 min (concentration). INT mod uses/long rest.',level:3},
      {name:'Debug Protocol',description:'When you or an ally within 30 ft fails a save against a spell or magical effect, reaction: force a reroll with advantage. Prof bonus uses/long rest.',level:5},
      {name:'Exploit Vulnerability',description:'When a creature fails your System Override save, choose an additional effect: disadvantage on attacks for 1 round, speed halved, or vulnerability to one damage type you choose.',level:9},
      {name:'Root Access',description:'As an action, create a 30-ft radius zone for 1 min (concentration). In the zone: your allies have advantage on saves vs spells, and enemies have disadvantage on concentration checks and their spell save DCs are reduced by your prof bonus. Once/long rest.',level:15}
    ],
    abilities:[{name:'System Crash',description:'Target creature within 60 ft: INT save or all its magical effects are suppressed and it can\'t cast spells for 1 round. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Intelligence',secondaryAttribute:'Wisdom',bonusStats:{intelligence:2,wisdom:1}}, source:'System Ascendant Canon' },

  // ── IDOL PATHS (Bard) ── features at 3,6,14 ──
  { id:'idol--college-of-lore', name:'Path of the College of Lore', jobId:'idol', jobName:'Idol', tier:2, pathType:'lore',
    requirements:{level:3,skills:['History','Performance']},
    description:'Lore Idols are scholars of everything — collecting knowledge from every source, knowing a little bit about everything, and using Cutting Words to disrupt enemies at critical moments.',
    features:[
      {name:'Bonus Proficiencies',description:'Prof in 3 skills of your choice.',level:3},
      {name:'Cutting Words',description:'Reaction when a creature within 60 ft makes an attack, ability check, or damage roll: expend a Hype die and subtract it from the roll. After the creature rolls but before the DM declares success/failure.',level:3},
      {name:'Additional Magical Secrets',description:'Learn 2 spells from any class\'s spell list. They count as Idol spells.',level:6},
      {name:'Peerless Skill',description:'When you make an ability check, expend one Hype die and add it to the roll. After you roll but before the DM declares success/failure.',level:14}
    ],
    abilities:[{name:'Words of Power',description:'Speak a devastating truth to a creature within 60 ft: SENSE save or 3d8 psychic + disadvantage on next attack. Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Intelligence',bonusStats:{charisma:2,intelligence:1}}, source:'System Ascendant Canon' },

  { id:'idol--college-of-valor', name:'Path of the College of Valor', jobId:'idol', jobName:'Idol', tier:2, pathType:'valor',
    requirements:{level:3,skills:['Athletics','Performance']},
    description:'Valor Idols are warrior-bards who fight on the front lines, inspiring allies with battle hymns while wielding weapons and wearing armor. They bridge the gap between martial and magical.',
    features:[
      {name:'Bonus Proficiencies',description:'Prof with medium armor, shields, and martial weapons.',level:3},
      {name:'Combat Inspiration',description:'When a creature uses your Hype die on an attack roll, it can also add the die to a damage roll. Or it can add the die to AC against one attack (reaction, after seeing roll but before knowing if hit).',level:3},
      {name:'Extra Attack',description:'Attack twice when you take the Attack action.',level:6},
      {name:'Battle Magic',description:'When you use your action to cast an Idol spell, make one weapon attack as a bonus action.',level:14}
    ],
    abilities:[{name:'War Anthem',description:'All allies within 30 ft gain +2 to attack rolls and saving throws for 1 min. Concentration. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Strength',bonusStats:{charisma:2,strength:1}}, source:'System Ascendant Canon' },

  { id:'idol--college-of-glamour', name:'Path of the College of Glamour', jobId:'idol', jobName:'Idol', tier:2, pathType:'glamour',
    requirements:{level:3,skills:['Performance','Persuasion']},
    description:'Glamour Idols weave fey magic into their performances, charming entire crowds and commanding unquestioning obedience. Their beauty and presence are supernaturally enhanced.',
    features:[
      {name:'Mantle of Inspiration',description:'Bonus action: expend one Hype die. Up to PRE mod creatures within 60 ft gain temp HP = 2× Hype die roll + Idol level and can use reaction to move up to their speed without provoking OAs.',level:3},
      {name:'Enthralling Performance',description:'After 1+ min performance, PRE mod creatures that watched make SENSE save or are charmed for 1 hour. Charmed creatures idolize you, hinder those who oppose you, and don\'t know they were charmed when it ends.',level:3},
      {name:'Mantle of Majesty',description:'Bonus action: take on an appearance of unearthly beauty for 1 min (concentration). Each turn, bonus action Command spell (no slot) against a creature charmed by you. Once/long rest.',level:6},
      {name:'Unbreakable Majesty',description:'Bonus action: for 1 min, any creature that attacks you for the first time on a turn must make a PRE save. Fail: attack is wasted (can\'t attack you this turn). Success: disadvantage on saves vs your spells until end of your next turn. Once per short rest.',level:14}
    ],
    abilities:[{name:'Fey Charm',description:'All creatures within 30 ft: SENSE save or charmed by you for 1 min. Charmed creatures will follow one reasonable suggestion. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Dexterity',bonusStats:{charisma:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'idol--college-of-swords', name:'Path of the College of Swords', jobId:'idol', jobName:'Idol', tier:2, pathType:'swords',
    requirements:{level:3,skills:['Acrobatics','Performance']},
    description:'Swords Idols are blade dancers who use their weapons as performance instruments, channeling Hype dice into devastating flourishes that deal extra damage, boost AC, or cut through multiple foes.',
    features:[
      {name:'Bonus Proficiencies',description:'Prof with medium armor and the scimitar. Use a weapon as spellcasting focus.',level:3},
      {name:'Fighting Style',description:'Choose Dueling (+2 damage with one-handed melee) or Two-Weapon Fighting (add ability mod to off-hand damage).',level:3},
      {name:'Blade Flourish',description:'When you take the Attack action, your speed increases by 10 ft. On hit, expend one Hype die: Defensive Flourish (add die to damage and AC until start of next turn), Slashing Flourish (add die to damage, and damage equal to the die roll to another creature within 5 ft), or Mobile Flourish (add die to damage, push target 5+die roll feet, use reaction to move to within 5 ft of them).',level:3},
      {name:'Extra Attack',description:'Attack twice when you take the Attack action.',level:6},
      {name:'Master\'s Flourish',description:'You can use a d6 instead of expending a Hype die for Blade Flourish.',level:14}
    ],
    abilities:[{name:'Dance of Blades',description:'Make a melee attack against every creature within 10 ft. Each hit uses a free Blade Flourish (d6, no Hype die expended). Once/short rest.',cooldown:1,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Dexterity',bonusStats:{charisma:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'idol--college-of-whispers', name:'Path of the College of Whispers', jobId:'idol', jobName:'Idol', tier:2, pathType:'whispers',
    requirements:{level:3,skills:['Deception','Performance']},
    description:'Whispers Idols deal in secrets, fear, and manipulation. They appear as normal performers but are actually spies and infiltrators who use psychic blades and stolen identities to accomplish their goals.',
    features:[
      {name:'Psychic Blades',description:'When you hit with a weapon attack, expend one Hype die to deal extra psychic damage = 2d6 (3d6 at 5th, 5d6 at 10th, 8d6 at 15th). Once per turn.',level:3},
      {name:'Words of Terror',description:'After 1+ min speaking privately to a creature, SENSE save or it is frightened of a creature of your choice for 1 hour. Doesn\'t know it was magically frightened. Once per short rest.',level:3},
      {name:'Mantle of Whispers',description:'Reaction when a humanoid dies within 30 ft: capture its shadow. As an action, take on its appearance for 1 hour (or until dismissed). You gain access to its general knowledge and memories. Deception checks to pass as it have +5. Once per short rest.',level:6},
      {name:'Shadow Lore',description:'Action: creature within 30 ft, SENSE save or it is charmed for 8 hours. It believes you know its deepest secret (even if you don\'t) and obeys your commands to avoid the secret being revealed. Once per long rest.',level:14}
    ],
    abilities:[{name:'Psychic Assault',description:'60 ft: creature makes SENSE save or takes 4d8 psychic and is frightened of you for 1 min. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Dexterity',bonusStats:{charisma:2,dexterity:1}}, source:'System Ascendant Canon' },

  { id:'idol--college-of-creation', name:'Path of the College of Creation', jobId:'idol', jobName:'Idol', tier:2, pathType:'creation',
    requirements:{level:3,skills:['Arcana','Performance']},
    description:'Creation Idols tap into the Song of Creation — the System\'s fundamental frequency that called matter into existence. They animate objects, create items from nothing, and bring performances to life.',
    features:[
      {name:'Mote of Potential',description:'When you give a Hype die, the creature also gains a mote. Attack roll: mote explodes in 5-ft radius thunder (VIT save = Hype die roll). Ability check: roll Hype die twice, use either. Save: gains temp HP = Hype die roll + PRE mod.',level:3},
      {name:'Performance of Creation',description:'Action: create one nonmagical item (Medium or smaller, worth ≤ 20× Idol level gp). Lasts for hours = prof bonus. One at a time. Once per long rest (or 2nd+ level slot).',level:3},
      {name:'Animating Performance',description:'Action: animate a Large or smaller nonmagical item within 30 ft. It becomes a construct (HP = 10+5× Idol level, AC = 16, +prof to attack, 1d10+PRE force slam, 30 ft speed). Bonus action to command. Lasts 1 hour. Once per long rest (or 3rd+ level slot).',level:6},
      {name:'Creative Crescendo',description:'Performance of Creation: create a number of items = PRE mod simultaneously. One can be Large, and any can be worth more (up to 200× Idol level gp). None require concentration or have the duration limit.',level:14}
    ],
    abilities:[{name:'Magnum Opus',description:'Create a Large animated construct (HP = 50, AC 18, +8 attack, 2d10+5 force slam). It lasts 1 hour and obeys your commands. Once/long rest.',cooldown:3,cost:'Action'}],
    stats:{primaryAttribute:'Charisma',secondaryAttribute:'Intelligence',bonusStats:{charisma:2,intelligence:1}}, source:'System Ascendant Canon' },
];
