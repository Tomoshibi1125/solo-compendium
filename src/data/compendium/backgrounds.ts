// Backgrounds Compendium - Authoritative PDF Content
// Extracted from internal compendium data pack
// This is the authoritative source for backgrounds data - FULL ADMIN PRIVILEGES INTEGRATION
// Generated on: 2026-01-13T22:03:39.609Z
// 22 Backgrounds from Solo Leveling Canon

export interface Background {
  id: string;
  name: string;
  type: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  // D&D 5e background features
  skillProficiencies: string[];
  toolProficiencies?: string[];
  languages?: string[];
  equipment: string[];
  features: {
    name: string;
    description: string;
  }[];
  personalityTraits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
  // Solo Leveling specific
  image: string;
  description: string;
  dangers: string[];
  abilities?: string[];
  // Additional properties
  source?: string;
  suggestedCharacteristics?: {
    personality?: string[];
    ideal?: string[];
    bond?: string[];
    flaw?: string[];
  };
  // Legacy properties for backward compatibility
  skills?: string[];
}

export const backgrounds = [
  {
    "id": "shadow-realm-exile",
    "name": "Shadow Realm Exile",
    "type": "Background",
    "rank": "C",
    "skillProficiencies": ["Stealth", "Perception", "Survival", "Arcana"],
    "toolProficiencies": ["Thieves' Tools"],
    "languages": ["Common", "Abyssal"],
    "equipment": [
      "A set of dark clothes",
      "A shadow-infused dagger",
      "A small pouch containing 10 gp",
      "A memento from the shadow realm",
      "Thieves' tools"
    ],
    "features": [
      {
        "name": "Shadow Affinity",
        "description": "You have advantage on saving throws against being frightened and can see in dim light within 60 feet as if it were bright light."
      },
      {
        "name": "Dimensional Awareness",
        "description": "You can sense the presence of dimensional portals within 300 feet and know their general direction."
      },
      {
        "name": "Essence Sensitivity",
        "description": "You can detect the presence of magical essence in creatures and objects, allowing you to identify magical items without using a spell."
      }
    ],
    "personalityTraits": [
      "I am constantly looking over my shoulder, expecting danger from the shadows.",
      "I speak in whispers and avoid drawing attention to myself.",
      "I trust no one completely, having learned betrayal in the shadow realm.",
      "I am fascinated by shadows and darkness, finding comfort in them."
    ],
    "ideals": [
      "Survival. I will do whatever it takes to survive, no matter the cost. (Neutral)",
      "Freedom. No one should be trapped between worlds as I was. (Chaotic)",
      "Power. The shadows taught me that only the strong survive. (Evil)",
      "Knowledge. I seek to understand the mysteries of the shadow realm. (Neutral)"
    ],
    "bonds": [
      "I will protect anyone who is trapped between worlds.",
      "I seek revenge on those who exiled me to the shadow realm.",
      "I have a family member still trapped in the shadow realm.",
      "I owe my life to someone who helped me escape."
    ],
    "flaws": [
      "I am paranoid and see threats everywhere.",
      "I have nightmares about the shadow realm that affect my judgment.",
      "I trust shadows more than people.",
      "I am willing to sacrifice others for my own survival."
    ],
    "image": "/generated/compendium/backgrounds/shadow-realm-exile.webp",
    "description": "Background as a Shadow Realm Exile from Solo Leveling, with unique experiences and abilities.",
    "dangers": [
      "Post-Traumatic Stress",
      "Dimensional Instability",
      "Gate Attraction",
      "Memory Loss"
    ],
    "abilities": [
      "Enhanced Shadow Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "source": "Solo Compendium Canon"
  },
  {
    "id": "gate-survivor",
    "name": "Gate Survivor",
    "type": "Background",
    "rank": "S",
    "description": "You survived a catastrophic gate event that claimed the lives of countless others. This traumatic experience has granted you unique insights into dimensional phenomena and an unbreakable will to live.",
    "features": [
      "Enhanced Gate Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Academic Rivals",
      "Organization Politics",
      "High Expectations",
      "Standardized Thinking"
    ],
    "image": "/generated/compendium/backgrounds/gate-survivor.webp",
    "skills": [
      "Survival",
      "Perception",
      "Arcana",
      "Insight"
    ]
  },
  {
    "id": "hunter-academy-graduate",
    "name": "Hunter Academy Graduate",
    "type": "Background",
    "rank": "C",
    "description": "You graduated from the prestigious Hunter Academy, receiving formal training in combat, magic, and dimensional theory. Your education makes you a valuable asset to any hunter organization.",
    "features": [
      "Enhanced Hunter Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Guild Politics",
      "Resource Shortages",
      "Member Disputes",
      "Reputation Risks"
    ],
    "image": "/generated/compendium/backgrounds/hunter-academy-graduate.webp",
    "skills": [
      "Investigation",
      "Persuasion",
      "Athletics",
      "Arcana"
    ]
  },
  {
    "id": "guild-master",
    "name": "Guild Master",
    "type": "Background",
    "rank": "C",
    "description": "You have led or managed a hunter guild, taking responsibility for organizing raids, managing resources, and training new hunters. Your leadership experience is invaluable in the field.",
    "features": [
      "Enhanced Guild Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Dimensional Sickness",
      "Reality Drift",
      "Entity Attention",
      "Memory Fragmentation"
    ],
    "image": "/generated/compendium/backgrounds/guild-master.webp",
    "skills": [
      "Persuasion",
      "Insight",
      "Intimidation",
      "Performance"
    ]
  },
  {
    "id": "dimensional-traveler",
    "name": "Dimensional Traveler",
    "type": "Background",
    "rank": "B",
    "description": "You have journeyed between dimensions, either by choice or necessity. These experiences have given you a unique perspective on reality and the ability to navigate the spaces between worlds.",
    "features": [
      "Enhanced Dimensional Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Essence Overload",
      "Monarch Attention",
      "Power Corruption",
      "Essence Addiction"
    ],
    "image": "/generated/compendium/backgrounds/dimensional-traveler.webp",
    "skills": [
      "Arcana",
      "Survival",
      "Perception",
      "Stealth"
    ]
  },
  {
    "id": "essence-user",
    "name": "Essence User",
    "type": "Background",
    "rank": "B",
    "description": "You possess the rare ability to manipulate essence directly, without the need for complex spells or rituals. This natural talent makes you exceptionally powerful but also draws dangerous attention.",
    "features": [
      "Enhanced Essence Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Monarch Control",
      "Rival Assassination",
      "Essence Dependency",
      "Obligation Binding"
    ],
    "image": "/generated/compendium/backgrounds/essence-user.webp",
    "skills": [
      "Arcana",
      "Constitution",
      "Wisdom",
      "Dexterity"
    ]
  },
  {
    "id": "monarch's-chosen",
    "name": "Monarch's Chosen",
    "type": "Background",
    "rank": "B",
    "description": "Background as a Monarch's Chosen from Solo Leveling, with unique experiences and abilities.",
    "features": [
      "Enhanced Monarch's Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Battle Trauma",
      "Enemy Vendettas",
      "Combat Addiction",
      "Shadow Corruption"
    ],
    "image": "/generated/compendium/backgrounds/monarchs-chosen.webp",
    "skills": [
      "Intimidation",
      "Persuasion",
      "Arcana",
      "Stealth"
    ]
  },
  {
    "id": "shadow-soldier",
    "name": "Shadow Soldier",
    "type": "Background",
    "rank": "D",
    "description": "You served as a soldier in the shadow armies, fighting in countless battles across dimensions. Your combat experience is extensive and you understand the art of warfare better than most.",
    "features": [
      "Enhanced Shadow Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Rune Backlash",
      "Ancient Curses",
      "Knowledge Theft",
      "Rune Addiction"
    ],
    "image": "/generated/compendium/backgrounds/shadow-soldier.webp",
    "skills": [
      "Athletics",
      "Intimidation",
      "Perception",
      "Survival"
    ]
  },
  {
    "id": "rune-master",
    "name": "Rune Master",
    "type": "Background",
    "rank": "B",
    "description": "You have mastered the ancient art of rune crafting, able to inscribe magical symbols that produce powerful effects. Your knowledge of runes makes you valuable for enchantment and protection work.",
    "features": [
      "Enhanced Rune Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Artifact Corruption",
      "Threat Attraction",
      "Responsibility Burden",
      "Item Bonding"
    ],
    "image": "/generated/compendium/backgrounds/rune-master.webp",
    "skills": [
      "Arcana",
      "Investigation",
      "History",
      "Insight"
    ]
  },
  {
    "id": "artifact-keeper",
    "name": "Artifact Keeper",
    "type": "Background",
    "rank": "S",
    "description": "You have been entrusted with the care and protection of powerful magical artifacts. This responsibility has given you deep knowledge of ancient items and the dangers they possess.",
    "features": [
      "Enhanced Artifact Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Dragon Vendettas",
      "Power Attraction",
      "Slayer Addiction",
      "Draconic Corruption"
    ],
    "image": "/generated/compendium/backgrounds/artifact-keeper.webp",
    "skills": [
      "Arcana",
      "History",
      "Investigation",
      "Perception"
    ]
  },
  {
    "id": "dragon-slayer",
    "name": "Dragon Slayer",
    "type": "Background",
    "rank": "A",
    "description": "You have successfully hunted and killed dragons, earning both respect and enmity. These legendary feats have taught you about draconic power and how to counter it.",
    "features": [
      "Enhanced Dragon Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Demonic Retribution",
      "Hell Attention",
      "Corruption Risk",
      "Obsession Danger"
    ],
    "image": "/generated/compendium/backgrounds/dragon-slayer.webp",
    "skills": [
      "Athletics",
      "Survival",
      "Intimidation",
      "Nature"
    ]
  },
  {
    "id": "demon-hunter",
    "name": "Demon Hunter",
    "type": "Background",
    "rank": "D",
    "description": "You specialize in hunting demonic entities, understanding their nature and knowing how to banish them permanently. Your expertise makes you the first line of defense against demonic incursions.",
    "features": [
      "Enhanced Demon Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Temporal Instability",
      "Paradox Creation",
      "Memory Overload",
      "Time Sickness"
    ],
    "image": "/generated/compendium/backgrounds/demon-hunter.webp",
    "skills": [
      "Religion",
      "Arcana",
      "Insight",
      "Perception"
    ]
  },
  {
    "id": "time-walker",
    "name": "Time Walker",
    "type": "Background",
    "rank": "C",
    "description": "You have experienced temporal anomalies or gained the ability to perceive and manipulate time. These experiences give you insights that others cannot comprehend.",
    "features": [
      "Enhanced Time Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Reality Breakdown",
      "Madness Risk",
      "Power Addiction",
      "Entity Attention"
    ],
    "image": "/generated/compendium/backgrounds/time-walker.webp",
    "skills": [
      "Arcana",
      "Perception",
      "Insight",
      "Investigation"
    ]
  },
  {
    "id": "reality-bender",
    "name": "Reality Bender",
    "type": "Background",
    "rank": "C",
    "description": "You can perceive and manipulate the fundamental fabric of reality itself. This rare ability makes you incredibly powerful but also dangerously unstable.",
    "features": [
      "Enhanced Reality Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Existence Erosion",
      "Memory Loss",
      "Emotional Detachment",
      "Void Addiction"
    ],
    "image": "/generated/compendium/backgrounds/reality-bender.webp",
    "skills": [
      "Arcana",
      "Wisdom",
      "Constitution",
      "Intelligence"
    ]
  },
  {
    "id": "void-touched",
    "name": "Void Touched",
    "type": "Background",
    "rank": "S",
    "description": "You have been exposed to the pure void between dimensions, changing you in fundamental ways. This connection to nothingness grants you unique abilities at a terrible cost.",
    "features": [
      "Enhanced Void Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Cosmic Attention",
      "Celestial Obligations",
      "Humanity Drift",
      "Star Sickness"
    ],
    "image": "/generated/compendium/backgrounds/void-touched.webp",
    "skills": [
      "Arcana",
      "Constitution",
      "Wisdom",
      "Stealth"
    ]
  },
  {
    "id": "star-born",
    "name": "Star Born",
    "type": "Background",
    "rank": "S",
    "description": "You were born under cosmic alignment or came from beyond the stars, granting you celestial knowledge and abilities that transcend normal understanding.",
    "features": [
      "Enhanced Star Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Memory Burden",
      "Modern Confusion",
      "Target Status",
      "Eternal Loneliness"
    ],
    "image": "/generated/compendium/backgrounds/star-born.webp",
    "skills": [
      "Arcana",
      "Religion",
      "Insight",
      "Perception"
    ]
  },
  {
    "id": "ancient-guardian",
    "name": "Ancient Guardian",
    "type": "Background",
    "rank": "S",
    "description": "You are an ancient being tasked with protecting something of immense importance. Your long life has given you wisdom but also left you disconnected from modern times.",
    "features": [
      "Enhanced Ancient Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Usurper Threats",
      "Kingdom Ghosts",
      "Responsibility Weight",
      "Power Isolation"
    ],
    "image": "/generated/compendium/backgrounds/ancient-guardian.webp",
    "skills": [
      "History",
      "Insight",
      "Perception",
      "Religion"
    ]
  },
  {
    "id": "forgotten-king",
    "name": "Forgotten King",
    "type": "Background",
    "rank": "A",
    "description": "You once ruled a kingdom that has been lost to time, whether through conquest, catastrophe, or dimensional displacement. Your royal bearing and leadership experience remain.",
    "features": [
      "Enhanced Forgotten Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Dark Attention",
      "Holy Obligations",
      "Light Corruption",
      "Mortal Limits"
    ],
    "image": "/generated/compendium/backgrounds/forgotten-king.webp",
    "skills": [
      "Persuasion",
      "Intimidation",
      "History",
      "Leadership"
    ]
  },
  {
    "id": "champion-of-light",
    "name": "Champion of Light",
    "type": "Background",
    "rank": "A",
    "description": "Background as a Champion of Light from Solo Leveling, with unique experiences and abilities.",
    "features": [
      "Enhanced Champion Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Dark Retribution",
      "Hope Burden",
      "Light Dependency",
      "Target Status"
    ],
    "image": "/generated/compendium/backgrounds/champion-of-light.webp",
    "skills": [
      "Religion",
      "Persuasion",
      "Medicine",
      "Insight"
    ]
  },
  {
    "id": "bringer-of-dawn",
    "name": "Bringer of Dawn",
    "type": "Background",
    "rank": "D",
    "description": "Background as a Bringer of Dawn from Solo Leveling, with unique experiences and abilities.",
    "features": [
      "Enhanced Bringer Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Isolation",
      "Information Overload",
      "Helplessness",
      "Memory Burden"
    ],
    "image": "/generated/compendium/backgrounds/bringer-of-dawn.webp",
    "skills": [
      "Performance",
      "Persuasion",
      "Insight",
      "Medicine"
    ]
  },
  {
    "id": "eternal-watcher",
    "name": "Eternal Watcher",
    "type": "Background",
    "rank": "B",
    "description": "You have been tasked with observing important events or places across time. This vigil has given you incredible perception but also isolated you from normal life.",
    "features": [
      "Enhanced Eternal Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Cosmic Dangers",
      "Identity Drift",
      "Endless Journey",
      "Loneliness"
    ],
    "image": "/generated/compendium/backgrounds/eternal-watcher.webp",
    "skills": [
      "Perception",
      "Insight",
      "Investigation",
      "Arcana"
    ]
  },
  {
    "id": "cosmic-wanderer",
    "name": "Cosmic Wanderer",
    "type": "Background",
    "rank": "B",
    "description": "You travel between worlds and dimensions as a wanderer, seeking knowledge and experience. Your journeys have given you cosmic perspective and diverse skills.",
    "features": [
      "Enhanced Cosmic Resistance",
      "Dimensional Awareness",
      "Shadow Affinity",
      "Essence Sensitivity"
    ],
    "dangers": [
      "Shadow Corruption",
      "Gate Instability",
      "Monarch's Wrath",
      "Dimensional Sickness"
    ],
    "image": "/generated/compendium/backgrounds/cosmic-wanderer.webp",
    "skills": [
      "Survival",
      "Insight",
      "Perception",
      "Performance"
    ]
  }
];


