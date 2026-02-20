// Items Compendium - Part 1
// Generated with full admin privileges
// System Ascendant themed items with images

import { Item } from './items';

export const items: Item[] = [
  {
    "id": "item-0001",
    "name": "Shadow Blade of Kael",
    "description": "An awakened weapon recovered from a master artificer. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0001.webp",
    "requirements": {
      "level": 15,
      "class": [
        "Warrior",
        "Assassin",
        "Shadow Reaver"
      ]
    },
    "properties": {
      "weapon": {
        "damage": "1d8 + 2",
        "damageType": "slashing",
        "versatile": "1d10 + 2",
        "finesse": true
      },
      "magical": {
        "bonus": {
          "attack": 2,
          "damage": 2
        },
        "resistance": [
          "necrotic",
          "psychic"
        ],
        "immunity": [
          "frightened"
        ]
      }
    },
    "effects": {
      "passive": [
        "You gain advantage on attack rolls against creatures in dim light or darkness",
        "The weapon deals an additional 1d6 necrotic damage on hit",
        "You can use your reaction to teleport up to 30 feet to an unoccupied space in dim light or darkness when targeted by an attack"
      ],
      "active": [
        {
          "name": "Shadow Strike",
          "description": "As an action, the blade releases a wave of shadow energy. All creatures in a 15-foot cone must make a DC 18 Constitution saving throw or take 4d8 necrotic damage and be frightened for 1 minute.",
          "action": "action",
          "frequency": "once-per-day"
        }
      ],
      "value": 65285
    },
    "attunement": true,
    "charges": {
      "max": 3,
      "current": 3,
      "recharge": "dawn"
    },
    "weight": 3,
    "value": 65285,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0002",
    "name": "Eternal Blade of Kael",
    "description": "An ancient armor recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0002.webp",
    "stats": {
      "defense": 134
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 78255,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage"
      ],
      "value": 78255
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0003",
    "name": "Void Blade of Kael",
    "description": "An blessed consumable recovered from a master artificer. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0003.webp",
    "stats": {
      "health": 496
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 90290,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 90290
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0004",
    "name": "Abyssal Blade of Kael",
    "description": "An crafted accessory recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0004.webp",
    "stats": {
      "mana": 206
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 8454,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 8454
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0005",
    "name": "Demonic Blade of Kael",
    "description": "An blessed scroll recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0005.webp",
    "stats": {
      "mana": 194
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 100287,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 100287
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0006",
    "name": "Celestial Blade of Kael",
    "description": "An blessed weapon recovered from a master artificer. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0006.webp",
    "stats": {
      "attack": 108
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 68235,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 68235
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0007",
    "name": "Divine Blade of Kael",
    "description": "An awakened armor recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0007.webp",
    "stats": {
      "defense": 190
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 36836,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 36836
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0008",
    "name": "Ancient Blade of Kael",
    "description": "An enchanted consumable recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0008.webp",
    "stats": {
      "health": 302
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 86734,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 86734
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0009",
    "name": "Forgotten Blade of Kael",
    "description": "An crafted accessory recovered from a master artificer. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0009.webp",
    "stats": {
      "mana": 108
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 3571,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 3571
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0010",
    "name": "Cursed Blade of Kael",
    "description": "An ancient scroll recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0010.webp",
    "stats": {
      "mana": 234
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 42455,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 42455
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0011",
    "name": "Blessed Blade of Kael",
    "description": "An crafted weapon recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0011.webp",
    "stats": {
      "attack": 79
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 64016,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 64016
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0012",
    "name": "Sacred Blade of Kael",
    "description": "An awakened armor recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0012.webp",
    "stats": {
      "defense": 148
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 10313,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 10313
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0013",
    "name": "Profane Blade of Kael",
    "description": "An forged consumable recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0013.webp",
    "stats": {
      "health": 524
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 80589,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 80589
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0014",
    "name": "Mystic Blade of Kael",
    "description": "An enchanted accessory recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0014.webp",
    "stats": {
      "mana": 153
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 57376,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 57376
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0015",
    "name": "Arcane Blade of Kael",
    "description": "An crafted scroll recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0015.webp",
    "stats": {
      "mana": 137
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 86376,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 86376
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0016",
    "name": "Infernal Blade of Kael",
    "description": "An ancient weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0016.webp",
    "stats": {
      "attack": 188
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 35100,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 35100
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0017",
    "name": "Frozen Blade of Kael",
    "description": "An imbued armor recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0017.webp",
    "stats": {
      "defense": 117
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 5925,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "Grants advantage on saving throws against one damage type"
      ],
      "value": 5925
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0018",
    "name": "Thunder Blade of Kael",
    "description": "An forged consumable recovered from a master artificer. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0018.webp",
    "stats": {
      "health": 264
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 88613,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants advantage on ability checks for 1 hour",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 88613
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0019",
    "name": "Holy Blade of Kael",
    "description": "An cursed accessory recovered from a master artificer. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0019.webp",
    "stats": {
      "mana": 51
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 56647,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 56647
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0020",
    "name": "Dark Blade of Kael",
    "description": "An imbued scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0020.webp",
    "stats": {
      "mana": 161
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 59943,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 59943
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0021",
    "name": "Shadow Sword of Kael",
    "description": "An forged weapon recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0021.webp",
    "stats": {
      "attack": 82
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 85846,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 85846
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0022",
    "name": "Eternal Sword of Kael",
    "description": "An imbued armor recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0022.webp",
    "stats": {
      "defense": 94
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 13792,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 13792
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0023",
    "name": "Void Sword of Kael",
    "description": "An forged consumable recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0023.webp",
    "stats": {
      "health": 478
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 64937,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Grants temporary hit points equal to your level for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes"
      ],
      "value": 64937
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0024",
    "name": "Abyssal Sword of Kael",
    "description": "An awakened accessory recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0024.webp",
    "stats": {
      "mana": 234
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 2888,
    "weight": 1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 2888
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0025",
    "name": "Demonic Sword of Kael",
    "description": "An enchanted scroll recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0025.webp",
    "stats": {
      "mana": 81
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 3629,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 3629
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0026",
    "name": "Celestial Sword of Kael",
    "description": "An ancient weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0026.webp",
    "stats": {
      "attack": 85
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 43318,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 43318
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0027",
    "name": "Divine Sword of Kael",
    "description": "An cursed armor recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0027.webp",
    "stats": {
      "defense": 88
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 9224,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage"
      ],
      "value": 9224
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0028",
    "name": "Ancient Sword of Kael",
    "description": "An ancient consumable recovered from a master artificer. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0028.webp",
    "stats": {
      "health": 357
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 51211,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 51211
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0029",
    "name": "Forgotten Sword of Kael",
    "description": "An cursed accessory recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0029.webp",
    "stats": {
      "mana": 230
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 13993,
    "weight": 1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 13993
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0030",
    "name": "Cursed Sword of Kael",
    "description": "An cursed scroll recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0030.webp",
    "stats": {
      "mana": 115
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 4632,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 4632
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0031",
    "name": "Blessed Sword of Kael",
    "description": "An ancient weapon recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0031.webp",
    "stats": {
      "attack": 152
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 10804,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 10804
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0032",
    "name": "Sacred Sword of Kael",
    "description": "An awakened armor recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0032.webp",
    "stats": {
      "defense": 228
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 73474,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 73474
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0033",
    "name": "Profane Sword of Kael",
    "description": "An crafted consumable recovered from a master artificer. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0033.webp",
    "stats": {
      "health": 357
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 7693,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Removes one condition affecting the user"
      ],
      "value": 7693
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0034",
    "name": "Mystic Sword of Kael",
    "description": "An imbued accessory recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0034.webp",
    "stats": {
      "mana": 223
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 21758,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 21758
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0035",
    "name": "Arcane Sword of Kael",
    "description": "An imbued scroll recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0035.webp",
    "stats": {
      "mana": 111
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 26161,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 26161
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0036",
    "name": "Infernal Sword of Kael",
    "description": "An imbued weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0036.webp",
    "stats": {
      "attack": 244
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 22250,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 22250
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0037",
    "name": "Frozen Sword of Kael",
    "description": "An imbued armor recovered from a master artificer. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0037.webp",
    "stats": {
      "defense": 101
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 16867,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 16867
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0038",
    "name": "Thunder Sword of Kael",
    "description": "An crafted consumable recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0038.webp",
    "stats": {
      "health": 562
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 42018,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Removes one condition affecting the user",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 42018
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0039",
    "name": "Holy Sword of Kael",
    "description": "An crafted accessory recovered from a master artificer. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0039.webp",
    "stats": {
      "mana": 69
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 49102,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 49102
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0040",
    "name": "Dark Sword of Kael",
    "description": "An enchanted scroll recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0040.webp",
    "stats": {
      "mana": 121
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 76441,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 76441
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0041",
    "name": "Shadow Dagger of Kael",
    "description": "An ancient weapon recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0041.webp",
    "stats": {
      "attack": 63
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 61004,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "piercing",
        "finesse": true
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 61004
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0042",
    "name": "Eternal Dagger of Kael",
    "description": "An forged armor recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0042.webp",
    "stats": {
      "defense": 242
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 35278,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 35278
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0043",
    "name": "Void Dagger of Kael",
    "description": "An awakened consumable recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0043.webp",
    "stats": {
      "health": 437
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 30303,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Grants advantage on ability checks for 1 hour",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 30303
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0044",
    "name": "Abyssal Dagger of Kael",
    "description": "An ancient accessory recovered from a master artificer. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0044.webp",
    "stats": {
      "mana": 161
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 72622,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 72622
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0045",
    "name": "Demonic Dagger of Kael",
    "description": "An crafted scroll recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0045.webp",
    "stats": {
      "mana": 163
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 6999,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 6999
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0046",
    "name": "Celestial Dagger of Kael",
    "description": "An crafted weapon recovered from a master artificer. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0046.webp",
    "stats": {
      "attack": 104
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 34067,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "piercing",
        "finesse": true
      }
    },
    "effects": {
      "passive": [
        "Deals an extra 1d6 elemental damage on a critical hit"
      ],
      "value": 34067
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0047",
    "name": "Divine Dagger of Kael",
    "description": "An awakened armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0047.webp",
    "stats": {
      "defense": 223
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 57406,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 57406
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0048",
    "name": "Ancient Dagger of Kael",
    "description": "An cursed consumable recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0048.webp",
    "stats": {
      "health": 412
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 41241,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 41241
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0049",
    "name": "Forgotten Dagger of Kael",
    "description": "An ancient accessory recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0049.webp",
    "stats": {
      "mana": 181
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 77456,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 77456
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0050",
    "name": "Cursed Dagger of Kael",
    "description": "An awakened scroll recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0050.webp",
    "stats": {
      "mana": 208
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 32883,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 32883
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0051",
    "name": "Blessed Dagger of Kael",
    "description": "An awakened weapon recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0051.webp",
    "stats": {
      "attack": 162
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 75837,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "piercing",
        "finesse": true
      }
    },
    "effects": {
      "passive": [
        "Deals an extra 1d6 elemental damage on a critical hit"
      ],
      "value": 75837
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0052",
    "name": "Sacred Dagger of Kael",
    "description": "An enchanted armor recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0052.webp",
    "stats": {
      "defense": 212
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 25151,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 25151
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0053",
    "name": "Profane Dagger of Kael",
    "description": "An enchanted consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0053.webp",
    "stats": {
      "health": 379
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 23639,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 23639
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0054",
    "name": "Mystic Dagger of Kael",
    "description": "An forged accessory recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0054.webp",
    "stats": {
      "mana": 81
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 10255,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 10255
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0055",
    "name": "Arcane Dagger of Kael",
    "description": "An imbued scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0055.webp",
    "stats": {
      "mana": 94
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 90026,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 90026
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0056",
    "name": "Infernal Dagger of Kael",
    "description": "An imbued weapon recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0056.webp",
    "stats": {
      "attack": 85
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 8160,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "piercing",
        "finesse": true
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 8160
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0057",
    "name": "Frozen Dagger of Kael",
    "description": "An crafted armor recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0057.webp",
    "stats": {
      "defense": 232
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 38722,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 38722
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0058",
    "name": "Thunder Dagger of Kael",
    "description": "An ancient consumable recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0058.webp",
    "stats": {
      "health": 414
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 42188,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes"
      ],
      "value": 42188
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0059",
    "name": "Holy Dagger of Kael",
    "description": "An cursed accessory recovered from a master artificer. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0059.webp",
    "stats": {
      "mana": 50
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 8707,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 8707
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0060",
    "name": "Dark Dagger of Kael",
    "description": "An enchanted scroll recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0060.webp",
    "stats": {
      "mana": 226
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 42138,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 42138
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0061",
    "name": "Shadow Axe of Kael",
    "description": "An awakened weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0061.webp",
    "stats": {
      "attack": 67
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 65439,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 65439
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0062",
    "name": "Eternal Axe of Kael",
    "description": "An ancient armor recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0062.webp",
    "stats": {
      "defense": 199
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 49765,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 49765
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0063",
    "name": "Void Axe of Kael",
    "description": "An enchanted consumable recovered from a master artificer. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0063.webp",
    "stats": {
      "health": 286
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 4200,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 4200
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0064",
    "name": "Abyssal Axe of Kael",
    "description": "An crafted accessory recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0064.webp",
    "stats": {
      "mana": 140
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 92265,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 92265
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0065",
    "name": "Demonic Axe of Kael",
    "description": "An enchanted scroll recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0065.webp",
    "stats": {
      "mana": 51
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 74852,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 74852
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0066",
    "name": "Celestial Axe of Kael",
    "description": "An forged weapon recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0066.webp",
    "stats": {
      "attack": 145
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 19249,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 19249
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0067",
    "name": "Divine Axe of Kael",
    "description": "An awakened armor recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0067.webp",
    "stats": {
      "defense": 94
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 36529,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 36529
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0068",
    "name": "Ancient Axe of Kael",
    "description": "An crafted consumable recovered from a master artificer. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0068.webp",
    "stats": {
      "health": 269
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 11580,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 11580
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0069",
    "name": "Forgotten Axe of Kael",
    "description": "An ancient accessory recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0069.webp",
    "stats": {
      "mana": 244
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 24487,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 24487
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0070",
    "name": "Cursed Axe of Kael",
    "description": "An enchanted scroll recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0070.webp",
    "stats": {
      "mana": 71
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 60285,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 60285
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0071",
    "name": "Blessed Axe of Kael",
    "description": "An cursed weapon recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0071.webp",
    "stats": {
      "attack": 130
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 5969,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 5969
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0072",
    "name": "Sacred Axe of Kael",
    "description": "An imbued armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0072.webp",
    "stats": {
      "defense": 247
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 5618,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 5618
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0073",
    "name": "Profane Axe of Kael",
    "description": "An enchanted consumable recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0073.webp",
    "stats": {
      "health": 516
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 87458,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 87458
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0074",
    "name": "Mystic Axe of Kael",
    "description": "An cursed accessory recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0074.webp",
    "stats": {
      "mana": 244
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 13109,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 13109
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0075",
    "name": "Arcane Axe of Kael",
    "description": "An enchanted scroll recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0075.webp",
    "stats": {
      "mana": 51
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 5253,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 5253
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0076",
    "name": "Infernal Axe of Kael",
    "description": "An ancient weapon recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0076.webp",
    "stats": {
      "attack": 190
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 87164,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 87164
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0077",
    "name": "Frozen Axe of Kael",
    "description": "An enchanted armor recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0077.webp",
    "stats": {
      "defense": 123
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 51583,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 51583
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0078",
    "name": "Thunder Axe of Kael",
    "description": "An awakened consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0078.webp",
    "stats": {
      "health": 486
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 32580,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 32580
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0079",
    "name": "Holy Axe of Kael",
    "description": "An cursed accessory recovered from a master artificer. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0079.webp",
    "stats": {
      "mana": 112
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 3164,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 3164
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0080",
    "name": "Dark Axe of Kael",
    "description": "An forged scroll recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0080.webp",
    "stats": {
      "mana": 53
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 43706,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 43706
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0081",
    "name": "Shadow Hammer of Kael",
    "description": "An enchanted weapon recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0081.webp",
    "stats": {
      "attack": 76
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 84736,
    "weight": 5,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "bludgeoning"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 84736
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0082",
    "name": "Eternal Hammer of Kael",
    "description": "An enchanted armor recovered from a master artificer. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0082.webp",
    "stats": {
      "defense": 130
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 64667,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 64667
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0083",
    "name": "Void Hammer of Kael",
    "description": "An crafted consumable recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0083.webp",
    "stats": {
      "health": 362
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 7242,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user"
      ],
      "value": 7242
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0084",
    "name": "Abyssal Hammer of Kael",
    "description": "An crafted accessory recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0084.webp",
    "stats": {
      "mana": 175
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 33109,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 33109
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0085",
    "name": "Demonic Hammer of Kael",
    "description": "An imbued scroll recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0085.webp",
    "stats": {
      "mana": 113
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 55864,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 55864
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0086",
    "name": "Celestial Hammer of Kael",
    "description": "An cursed weapon recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0086.webp",
    "stats": {
      "attack": 233
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 22613,
    "weight": 5,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "bludgeoning"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 22613
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0087",
    "name": "Divine Hammer of Kael",
    "description": "An crafted armor recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0087.webp",
    "stats": {
      "defense": 54
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 31623,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 31623
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0088",
    "name": "Ancient Hammer of Kael",
    "description": "An ancient consumable recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0088.webp",
    "stats": {
      "health": 205
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 18938,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Allows the user to see invisible creatures for 10 minutes"
      ],
      "value": 18938
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0089",
    "name": "Forgotten Hammer of Kael",
    "description": "An ancient accessory recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0089.webp",
    "stats": {
      "mana": 197
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 34453,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 34453
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0090",
    "name": "Cursed Hammer of Kael",
    "description": "An blessed scroll recovered from a master artificer. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0090.webp",
    "stats": {
      "mana": 54
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 69355,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 69355
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0091",
    "name": "Blessed Hammer of Kael",
    "description": "An ancient weapon recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0091.webp",
    "stats": {
      "attack": 87
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 4676,
    "weight": 5,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "bludgeoning"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 4676
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0092",
    "name": "Sacred Hammer of Kael",
    "description": "An crafted armor recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0092.webp",
    "stats": {
      "defense": 219
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 70619,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 70619
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0093",
    "name": "Profane Hammer of Kael",
    "description": "An enchanted consumable recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0093.webp",
    "stats": {
      "health": 116
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 77922,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 77922
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0094",
    "name": "Mystic Hammer of Kael",
    "description": "An awakened accessory recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0094.webp",
    "stats": {
      "mana": 185
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 73194,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 73194
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0095",
    "name": "Arcane Hammer of Kael",
    "description": "An crafted scroll recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0095.webp",
    "stats": {
      "mana": 77
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 83008,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 83008
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0096",
    "name": "Infernal Hammer of Kael",
    "description": "An imbued weapon recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0096.webp",
    "stats": {
      "attack": 108
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 7225,
    "weight": 5,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "bludgeoning"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 7225
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0097",
    "name": "Frozen Hammer of Kael",
    "description": "An cursed armor recovered from a master artificer. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0097.webp",
    "stats": {
      "defense": 51
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 13209,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 13209
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0098",
    "name": "Thunder Hammer of Kael",
    "description": "An awakened consumable recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0098.webp",
    "stats": {
      "health": 481
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 15370,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Grants advantage on ability checks for 1 hour",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 15370
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0099",
    "name": "Holy Hammer of Kael",
    "description": "An awakened accessory recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0099.webp",
    "stats": {
      "mana": 200
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 70565,
    "weight": 1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 70565
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0100",
    "name": "Dark Hammer of Kael",
    "description": "An cursed scroll recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0100.webp",
    "stats": {
      "mana": 160
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 77431,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 77431
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0101",
    "name": "Shadow Staff of Kael",
    "description": "An crafted weapon recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0101.webp",
    "stats": {
      "attack": 125
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 50449,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d6",
        "damageType": "bludgeoning",
        "versatile": "1d8"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 50449
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0102",
    "name": "Eternal Staff of Kael",
    "description": "An crafted armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0102.webp",
    "stats": {
      "defense": 167
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 86087,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 86087
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0103",
    "name": "Void Staff of Kael",
    "description": "An blessed consumable recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0103.webp",
    "stats": {
      "health": 408
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 72674,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Restores 2d4+2 hit points when consumed",
        "Removes one condition affecting the user",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 72674
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0104",
    "name": "Abyssal Staff of Kael",
    "description": "An cursed accessory recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0104.webp",
    "stats": {
      "mana": 145
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 72045,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 72045
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0105",
    "name": "Demonic Staff of Kael",
    "description": "An enchanted scroll recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0105.webp",
    "stats": {
      "mana": 238
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 54057,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 54057
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0106",
    "name": "Celestial Staff of Kael",
    "description": "An forged weapon recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0106.webp",
    "stats": {
      "attack": 223
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 80338,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d6",
        "damageType": "bludgeoning",
        "versatile": "1d8"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 80338
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0107",
    "name": "Divine Staff of Kael",
    "description": "An crafted armor recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0107.webp",
    "stats": {
      "defense": 204
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 66907,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants resistance to one elemental damage type while attuned",
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage"
      ],
      "value": 66907
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0108",
    "name": "Ancient Staff of Kael",
    "description": "An enchanted consumable recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0108.webp",
    "stats": {
      "health": 152
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 23960,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 23960
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0109",
    "name": "Forgotten Staff of Kael",
    "description": "An forged accessory recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0109.webp",
    "stats": {
      "mana": 148
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 54808,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 54808
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0110",
    "name": "Cursed Staff of Kael",
    "description": "An enchanted scroll recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0110.webp",
    "stats": {
      "mana": 226
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 60991,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 60991
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0111",
    "name": "Blessed Staff of Kael",
    "description": "An blessed weapon recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0111.webp",
    "stats": {
      "attack": 137
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 10065,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d6",
        "damageType": "bludgeoning",
        "versatile": "1d8"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 10065
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0112",
    "name": "Sacred Staff of Kael",
    "description": "An blessed armor recovered from a master artificer. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0112.webp",
    "stats": {
      "defense": 52
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 86246,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage"
      ],
      "value": 86246
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0113",
    "name": "Profane Staff of Kael",
    "description": "An forged consumable recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0113.webp",
    "stats": {
      "health": 524
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 77320,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Restores 2d4+2 hit points when consumed",
        "Removes one condition affecting the user",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 77320
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0114",
    "name": "Mystic Staff of Kael",
    "description": "An ancient accessory recovered from a master artificer. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0114.webp",
    "stats": {
      "mana": 123
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 4328,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 4328
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0115",
    "name": "Arcane Staff of Kael",
    "description": "An forged scroll recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0115.webp",
    "stats": {
      "mana": 247
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 20391,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 20391
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0116",
    "name": "Infernal Staff of Kael",
    "description": "An crafted weapon recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0116.webp",
    "stats": {
      "attack": 51
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 86818,
    "weight": 4,
    "properties": {
      "weapon": {
        "damage": "1d6",
        "damageType": "bludgeoning",
        "versatile": "1d8"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 86818
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0117",
    "name": "Frozen Staff of Kael",
    "description": "An enchanted armor recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0117.webp",
    "stats": {
      "defense": 150
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 81847,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants advantage on saving throws against one damage type"
      ],
      "value": 81847
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0118",
    "name": "Thunder Staff of Kael",
    "description": "An crafted consumable recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0118.webp",
    "stats": {
      "health": 220
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 57811,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 57811
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0119",
    "name": "Holy Staff of Kael",
    "description": "An enchanted accessory recovered from a master artificer. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0119.webp",
    "stats": {
      "mana": 114
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 86297,
    "weight": 1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 86297
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0120",
    "name": "Dark Staff of Kael",
    "description": "An ancient scroll recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0120.webp",
    "stats": {
      "mana": 220
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 77923,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 77923
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0121",
    "name": "Shadow Wand of Kael",
    "description": "An cursed weapon recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0121.webp",
    "stats": {
      "attack": 79
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 59200,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "force",
        "range": 60
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 59200
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0122",
    "name": "Eternal Wand of Kael",
    "description": "An enchanted armor recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0122.webp",
    "stats": {
      "defense": 133
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 27884,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 27884
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0123",
    "name": "Void Wand of Kael",
    "description": "An blessed consumable recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0123.webp",
    "stats": {
      "health": 115
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 13771,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user",
        "Allows the user to see invisible creatures for 10 minutes"
      ],
      "value": 13771
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0124",
    "name": "Abyssal Wand of Kael",
    "description": "An awakened accessory recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0124.webp",
    "stats": {
      "mana": 159
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 85789,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 85789
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0125",
    "name": "Demonic Wand of Kael",
    "description": "An blessed scroll recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0125.webp",
    "stats": {
      "mana": 190
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 57130,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 57130
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0126",
    "name": "Celestial Wand of Kael",
    "description": "An enchanted weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0126.webp",
    "stats": {
      "attack": 94
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 90718,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "force",
        "range": 60
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 90718
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0127",
    "name": "Divine Wand of Kael",
    "description": "An ancient armor recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0127.webp",
    "stats": {
      "defense": 200
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 33658,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 33658
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0128",
    "name": "Ancient Wand of Kael",
    "description": "An blessed consumable recovered from a master artificer. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0128.webp",
    "stats": {
      "health": 492
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 27671,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 27671
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0129",
    "name": "Forgotten Wand of Kael",
    "description": "An crafted accessory recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0129.webp",
    "stats": {
      "mana": 162
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 1756,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 1756
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0130",
    "name": "Cursed Wand of Kael",
    "description": "An crafted scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0130.webp",
    "stats": {
      "mana": 106
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 9188,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 9188
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0131",
    "name": "Blessed Wand of Kael",
    "description": "An ancient weapon recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0131.webp",
    "stats": {
      "attack": 243
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 71871,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "force",
        "range": 60
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 71871
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0132",
    "name": "Sacred Wand of Kael",
    "description": "An ancient armor recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0132.webp",
    "stats": {
      "defense": 204
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 89348,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "The armor adjusts to fit perfectly, imposing no stealth disadvantage",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 89348
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0133",
    "name": "Profane Wand of Kael",
    "description": "An blessed consumable recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0133.webp",
    "stats": {
      "health": 209
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 74841,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 74841
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0134",
    "name": "Mystic Wand of Kael",
    "description": "An enchanted accessory recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0134.webp",
    "stats": {
      "mana": 95
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 69455,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 69455
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0135",
    "name": "Arcane Wand of Kael",
    "description": "An awakened scroll recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0135.webp",
    "stats": {
      "mana": 115
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 84587,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 84587
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0136",
    "name": "Infernal Wand of Kael",
    "description": "An awakened weapon recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0136.webp",
    "stats": {
      "attack": 120
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 18752,
    "weight": 1,
    "properties": {
      "weapon": {
        "damage": "1d4",
        "damageType": "force",
        "range": 60
      }
    },
    "effects": {
      "passive": [
        "Deals an extra 1d6 elemental damage on a critical hit"
      ],
      "value": 18752
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0137",
    "name": "Frozen Wand of Kael",
    "description": "An crafted armor recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0137.webp",
    "stats": {
      "defense": 181
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 65257,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 65257
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0138",
    "name": "Thunder Wand of Kael",
    "description": "An enchanted consumable recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0138.webp",
    "stats": {
      "health": 199
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 11426,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Allows the user to see invisible creatures for 10 minutes"
      ],
      "value": 11426
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0139",
    "name": "Holy Wand of Kael",
    "description": "An ancient accessory recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0139.webp",
    "stats": {
      "mana": 241
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 13367,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 13367
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0140",
    "name": "Dark Wand of Kael",
    "description": "An forged scroll recovered from a master artificer. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0140.webp",
    "stats": {
      "mana": 79
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 41980,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 41980
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0141",
    "name": "Shadow Orb of Kael",
    "description": "An imbued weapon recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0141.webp",
    "stats": {
      "attack": 136
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 32670,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Deals an extra 1d6 elemental damage on a critical hit"
      ],
      "value": 32670
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0142",
    "name": "Eternal Orb of Kael",
    "description": "An imbued armor recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0142.webp",
    "stats": {
      "defense": 238
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 22334,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "Grants advantage on saving throws against one damage type"
      ],
      "value": 22334
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0143",
    "name": "Void Orb of Kael",
    "description": "An enchanted consumable recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0143.webp",
    "stats": {
      "health": 158
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 77262,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 77262
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0144",
    "name": "Abyssal Orb of Kael",
    "description": "An enchanted accessory recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0144.webp",
    "stats": {
      "mana": 103
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 85576,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 85576
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0145",
    "name": "Demonic Orb of Kael",
    "description": "An blessed scroll recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0145.webp",
    "stats": {
      "mana": 236
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 95107,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 95107
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0146",
    "name": "Celestial Orb of Kael",
    "description": "An ancient weapon recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0146.webp",
    "stats": {
      "attack": 75
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 77465,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 77465
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0147",
    "name": "Divine Orb of Kael",
    "description": "An ancient armor recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0147.webp",
    "stats": {
      "defense": 158
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 38166,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 38166
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0148",
    "name": "Ancient Orb of Kael",
    "description": "An ancient consumable recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0148.webp",
    "stats": {
      "health": 353
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 36374,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user"
      ],
      "value": 36374
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0149",
    "name": "Forgotten Orb of Kael",
    "description": "An enchanted accessory recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0149.webp",
    "stats": {
      "mana": 193
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 12362,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 12362
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0150",
    "name": "Cursed Orb of Kael",
    "description": "An awakened scroll recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0150.webp",
    "stats": {
      "mana": 164
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 48458,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 48458
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0151",
    "name": "Blessed Orb of Kael",
    "description": "An imbued weapon recovered from a master artificer. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0151.webp",
    "stats": {
      "attack": 96
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 49786,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 49786
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0152",
    "name": "Sacred Orb of Kael",
    "description": "An ancient armor recovered from a master artificer. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0152.webp",
    "stats": {
      "defense": 74
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 94500,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Reduces damage from critical hits by your proficiency bonus",
        "Grants advantage on saving throws against one damage type"
      ],
      "value": 94500
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0153",
    "name": "Profane Orb of Kael",
    "description": "An awakened consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0153.webp",
    "stats": {
      "health": 327
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 41227,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Removes one condition affecting the user"
      ],
      "value": 41227
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0154",
    "name": "Mystic Orb of Kael",
    "description": "An cursed accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0154.webp",
    "stats": {
      "mana": 188
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 48797,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 48797
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0155",
    "name": "Arcane Orb of Kael",
    "description": "An cursed scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0155.webp",
    "stats": {
      "mana": 204
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 58798,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 58798
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0156",
    "name": "Infernal Orb of Kael",
    "description": "An forged weapon recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0156.webp",
    "stats": {
      "attack": 145
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 69324,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 69324
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0157",
    "name": "Frozen Orb of Kael",
    "description": "An ancient armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0157.webp",
    "stats": {
      "defense": 219
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 42855,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 42855
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0158",
    "name": "Thunder Orb of Kael",
    "description": "An ancient consumable recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0158.webp",
    "stats": {
      "health": 180
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 38176,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 38176
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0159",
    "name": "Holy Orb of Kael",
    "description": "An forged accessory recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0159.webp",
    "stats": {
      "mana": 82
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 17942,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 17942
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0160",
    "name": "Dark Orb of Kael",
    "description": "An ancient scroll recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0160.webp",
    "stats": {
      "mana": 109
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 5217,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 5217
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0161",
    "name": "Shadow Armor of Kael",
    "description": "An ancient weapon recovered from a master artificer. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0161.webp",
    "stats": {
      "attack": 79
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 94060,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 94060
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0162",
    "name": "Eternal Armor of Kael",
    "description": "An enchanted armor recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0162.webp",
    "stats": {
      "defense": 220
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 53196,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 53196
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0163",
    "name": "Void Armor of Kael",
    "description": "An crafted consumable recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0163.webp",
    "stats": {
      "health": 164
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 65479,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 65479
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0164",
    "name": "Abyssal Armor of Kael",
    "description": "An cursed accessory recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0164.webp",
    "stats": {
      "mana": 146
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 20395,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 20395
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0165",
    "name": "Demonic Armor of Kael",
    "description": "An imbued scroll recovered from a master artificer. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0165.webp",
    "stats": {
      "mana": 152
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 34005,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 34005
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0166",
    "name": "Celestial Armor of Kael",
    "description": "An forged weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0166.webp",
    "stats": {
      "attack": 128
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 20529,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 20529
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0167",
    "name": "Divine Armor of Kael",
    "description": "An imbued armor recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0167.webp",
    "stats": {
      "defense": 130
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 43077,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "You can cast Shield once per long rest while wearing this armor"
      ],
      "value": 43077
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0168",
    "name": "Ancient Armor of Kael",
    "description": "An cursed consumable recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0168.webp",
    "stats": {
      "health": 325
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 45254,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 45254
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0169",
    "name": "Forgotten Armor of Kael",
    "description": "An awakened accessory recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0169.webp",
    "stats": {
      "mana": 128
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 6341,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 6341
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0170",
    "name": "Cursed Armor of Kael",
    "description": "An forged scroll recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0170.webp",
    "stats": {
      "mana": 238
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 15458,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 15458
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0171",
    "name": "Blessed Armor of Kael",
    "description": "An imbued weapon recovered from a master artificer. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0171.webp",
    "stats": {
      "attack": 56
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 59183,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Once per day, the weapon can cast a cantrip-level effect"
      ],
      "value": 59183
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0172",
    "name": "Sacred Armor of Kael",
    "description": "An ancient armor recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0172.webp",
    "stats": {
      "defense": 158
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 87909,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 87909
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0173",
    "name": "Profane Armor of Kael",
    "description": "An awakened consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0173.webp",
    "stats": {
      "health": 126
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 30049,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Allows the user to see invisible creatures for 10 minutes",
        "Restores 2d4+2 hit points when consumed",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 30049
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0174",
    "name": "Mystic Armor of Kael",
    "description": "An forged accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0174.webp",
    "stats": {
      "mana": 184
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 69893,
    "weight": 1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "You can cast Detect Magic at will while wearing this",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 69893
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0175",
    "name": "Arcane Armor of Kael",
    "description": "An ancient scroll recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0175.webp",
    "stats": {
      "mana": 206
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 46754,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 46754
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0176",
    "name": "Infernal Armor of Kael",
    "description": "An cursed weapon recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0176.webp",
    "stats": {
      "attack": 130
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 2576,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "You gain +1 to initiative while carrying this weapon"
      ],
      "value": 2576
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0177",
    "name": "Frozen Armor of Kael",
    "description": "An crafted armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0177.webp",
    "stats": {
      "defense": 61
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 52210,
    "weight": 20,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 52210
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0178",
    "name": "Thunder Armor of Kael",
    "description": "An blessed consumable recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0178.webp",
    "stats": {
      "health": 124
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 21077,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Restores 2d4+2 hit points when consumed",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 21077
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0179",
    "name": "Holy Armor of Kael",
    "description": "An imbued accessory recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0179.webp",
    "stats": {
      "mana": 72
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 71290,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 71290
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0180",
    "name": "Dark Armor of Kael",
    "description": "An imbued scroll recovered from a master artificer. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0180.webp",
    "stats": {
      "mana": 223
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 4110,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Once per day, reroll a failed saving throw",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 4110
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0181",
    "name": "Shadow Shield of Kael",
    "description": "An awakened weapon recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0181.webp",
    "stats": {
      "attack": 133
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 11148,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 11148
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0182",
    "name": "Eternal Shield of Kael",
    "description": "An blessed armor recovered from a master artificer. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0182.webp",
    "stats": {
      "defense": 109
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 38234,
    "weight": 6,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants advantage on saving throws against one damage type"
      ],
      "value": 38234
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0183",
    "name": "Void Shield of Kael",
    "description": "An blessed consumable recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0183.webp",
    "stats": {
      "health": 306
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 50536,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user"
      ],
      "value": 50536
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0184",
    "name": "Abyssal Shield of Kael",
    "description": "An enchanted accessory recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0184.webp",
    "stats": {
      "mana": 246
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 70192,
    "weight": 1,
    "effects": {
      "passive": [
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this",
        "You gain proficiency in one saving throw while attuned"
      ],
      "value": 70192
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0185",
    "name": "Demonic Shield of Kael",
    "description": "An cursed scroll recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0185.webp",
    "stats": {
      "mana": 99
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 77403,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 77403
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0186",
    "name": "Celestial Shield of Kael",
    "description": "An enchanted weapon recovered from a master artificer. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0186.webp",
    "stats": {
      "attack": 122
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 26430,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "Glows faintly when enemies are within 60 feet"
      ],
      "value": 26430
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0187",
    "name": "Divine Shield of Kael",
    "description": "An blessed armor recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0187.webp",
    "stats": {
      "defense": 220
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 88024,
    "weight": 6,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "Grants advantage on saving throws against one damage type",
        "Reduces damage from critical hits by your proficiency bonus"
      ],
      "value": 88024
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0188",
    "name": "Ancient Shield of Kael",
    "description": "An awakened consumable recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0188.webp",
    "stats": {
      "health": 377
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 26305,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Allows the user to see invisible creatures for 10 minutes",
        "Grants advantage on ability checks for 1 hour"
      ],
      "value": 26305
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0189",
    "name": "Forgotten Shield of Kael",
    "description": "An forged accessory recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0189.webp",
    "stats": {
      "mana": 60
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 92683,
    "weight": 1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 92683
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0190",
    "name": "Cursed Shield of Kael",
    "description": "An blessed scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0190.webp",
    "stats": {
      "mana": 205
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 3302,
    "weight": 0.1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 3302
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0191",
    "name": "Blessed Shield of Kael",
    "description": "An imbued weapon recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0191.webp",
    "stats": {
      "attack": 103
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 40424,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 40424
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0192",
    "name": "Sacred Shield of Kael",
    "description": "An imbued armor recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0192.webp",
    "stats": {
      "defense": 230
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 91585,
    "weight": 6,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 91585
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0193",
    "name": "Profane Shield of Kael",
    "description": "An enchanted consumable recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0193.webp",
    "stats": {
      "health": 375
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 52302,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants advantage on ability checks for 1 hour",
        "Removes one condition affecting the user",
        "Grants temporary hit points equal to your level for 1 hour"
      ],
      "value": 52302
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0194",
    "name": "Mystic Shield of Kael",
    "description": "An blessed accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0194.webp",
    "stats": {
      "mana": 224
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 31780,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned",
        "Once per day, reroll a failed saving throw"
      ],
      "value": 31780
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0195",
    "name": "Arcane Shield of Kael",
    "description": "An imbued scroll recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0195.webp",
    "stats": {
      "mana": 112
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 41909,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You can cast Detect Magic at will while wearing this",
        "Grants +1 to one ability score while attuned",
        "Grants darkvision 60 feet if you don't already have it"
      ],
      "value": 41909
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0196",
    "name": "Infernal Shield of Kael",
    "description": "An imbued weapon recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "common",
    "type": "weapon",
    "image": "/generated/compendium/items/item-0196.webp",
    "stats": {
      "attack": 168
    },
    "effect": "Grants enhanced weapon abilities and shadow power.",
    "value": 100479,
    "weight": 3,
    "properties": {
      "weapon": {
        "damage": "1d8",
        "damageType": "slashing"
      }
    },
    "effects": {
      "passive": [
        "The weapon returns to your hand when thrown (range 20/60)"
      ],
      "value": 100479
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0197",
    "name": "Frozen Shield of Kael",
    "description": "An enchanted armor recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "uncommon",
    "type": "armor",
    "image": "/generated/compendium/items/item-0197.webp",
    "stats": {
      "defense": 197
    },
    "effect": "Grants enhanced armor abilities and shadow power.",
    "value": 58442,
    "weight": 6,
    "properties": {
      "magical": {
        "bonus": {
          "armorClass": 1
        }
      }
    },
    "effects": {
      "passive": [
        "You can cast Shield once per long rest while wearing this armor",
        "Grants resistance to one elemental damage type while attuned"
      ],
      "value": 58442
    },
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0198",
    "name": "Thunder Shield of Kael",
    "description": "An ancient consumable recovered from a master artificer. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "rare",
    "type": "consumable",
    "image": "/generated/compendium/items/item-0198.webp",
    "stats": {
      "health": 262
    },
    "effect": "Grants enhanced consumable abilities and shadow power.",
    "value": 97783,
    "weight": 0.5,
    "effects": {
      "passive": [
        "Grants temporary hit points equal to your level for 1 hour",
        "Removes one condition affecting the user",
        "Restores 2d4+2 hit points when consumed"
      ],
      "value": 97783
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0199",
    "name": "Holy Shield of Kael",
    "description": "An imbued accessory recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
    "rarity": "epic",
    "type": "accessory",
    "image": "/generated/compendium/items/item-0199.webp",
    "stats": {
      "mana": 138
    },
    "effect": "Grants enhanced accessory abilities and shadow power.",
    "value": 61328,
    "weight": 1,
    "effects": {
      "passive": [
        "Grants +1 to one ability score while attuned",
        "You gain proficiency in one saving throw while attuned",
        "You can cast Detect Magic at will while wearing this"
      ],
      "value": 61328
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  },
  {
    "id": "item-0200",
    "name": "Dark Shield of Kael",
    "description": "An imbued scroll recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
    "rarity": "legendary",
    "type": "scroll",
    "image": "/generated/compendium/items/item-0200.webp",
    "stats": {
      "mana": 246
    },
    "effect": "Grants enhanced scroll abilities and shadow power.",
    "value": 12804,
    "weight": 0.1,
    "effects": {
      "passive": [
        "You gain proficiency in one saving throw while attuned",
        "Grants darkvision 60 feet if you don't already have it",
        "Grants +1 to one ability score while attuned"
      ],
      "value": 12804
    },
    "attunement": true,
    "source": "System Ascendant Canon"
  }
];
