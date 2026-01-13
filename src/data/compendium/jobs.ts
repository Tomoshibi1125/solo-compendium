// Comprehensive Jobs Compendium - D&D Beyond Scale
// Generated with full admin privileges
// Solo Leveling themed jobs with images

export interface Job {
  id: string;
  name: string;
  type: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  image: string;
  description: string;
  abilities: string[];
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

export const jobs = [
  {
    "id": "job-0001",
    "name": "Novice Shadow Hunter",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0001.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 25,
      "constitution": 14,
      "intelligence": 25,
      "wisdom": 25,
      "charisma": 25
    }
  },
  {
    "id": "job-0002",
    "name": "Novice Void Walker",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0002.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 10,
      "constitution": 11,
      "intelligence": 13,
      "wisdom": 18,
      "charisma": 26
    }
  },
  {
    "id": "job-0003",
    "name": "Novice Abyssal Knight",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0003.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 24,
      "constitution": 24,
      "intelligence": 14,
      "wisdom": 15,
      "charisma": 16
    }
  },
  {
    "id": "job-0004",
    "name": "Novice Demonic Warrior",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0004.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 25,
      "constitution": 10,
      "intelligence": 28,
      "wisdom": 19,
      "charisma": 29
    }
  },
  {
    "id": "job-0005",
    "name": "Novice Celestial Mage",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0005.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 27,
      "constitution": 29,
      "intelligence": 24,
      "wisdom": 21,
      "charisma": 28
    }
  },
  {
    "id": "job-0006",
    "name": "Novice Divine Priest",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0006.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 20,
      "constitution": 10,
      "intelligence": 11,
      "wisdom": 11,
      "charisma": 21
    }
  },
  {
    "id": "job-0007",
    "name": "Novice Arcane Scholar",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0007.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 16,
      "constitution": 29,
      "intelligence": 13,
      "wisdom": 27,
      "charisma": 28
    }
  },
  {
    "id": "job-0008",
    "name": "Novice Infernal Berserker",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0008.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 24,
      "constitution": 18,
      "intelligence": 24,
      "wisdom": 23,
      "charisma": 21
    }
  },
  {
    "id": "job-0009",
    "name": "Novice Frozen Guardian",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0009.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 17,
      "wisdom": 13,
      "charisma": 17
    }
  },
  {
    "id": "job-0010",
    "name": "Novice Thunder Striker",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0010.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 18,
      "constitution": 24,
      "intelligence": 24,
      "wisdom": 20,
      "charisma": 10
    }
  },
  {
    "id": "job-0011",
    "name": "Novice Holy Paladin",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0011.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 15,
      "constitution": 20,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 18
    }
  },
  {
    "id": "job-0012",
    "name": "Novice Dark Assassin",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0012.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 12,
      "constitution": 16,
      "intelligence": 22,
      "wisdom": 22,
      "charisma": 24
    }
  },
  {
    "id": "job-0013",
    "name": "Novice Ancient Sage",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0013.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 25,
      "constitution": 19,
      "intelligence": 28,
      "wisdom": 28,
      "charisma": 10
    }
  },
  {
    "id": "job-0014",
    "name": "Novice Primordial Warrior",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0014.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 23,
      "constitution": 18,
      "intelligence": 17,
      "wisdom": 15,
      "charisma": 23
    }
  },
  {
    "id": "job-0015",
    "name": "Novice Supreme Commander",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0015.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 11,
      "constitution": 27,
      "intelligence": 20,
      "wisdom": 19,
      "charisma": 23
    }
  },
  {
    "id": "job-0016",
    "name": "Novice Legendary Hero",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0016.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 15,
      "constitution": 27,
      "intelligence": 21,
      "wisdom": 27,
      "charisma": 26
    }
  },
  {
    "id": "job-0017",
    "name": "Adept Shadow Hunter",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0017.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 24,
      "intelligence": 11,
      "wisdom": 13,
      "charisma": 11
    }
  },
  {
    "id": "job-0018",
    "name": "Adept Void Walker",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0018.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 17,
      "dexterity": 28,
      "constitution": 21,
      "intelligence": 28,
      "wisdom": 22,
      "charisma": 12
    }
  },
  {
    "id": "job-0019",
    "name": "Adept Abyssal Knight",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0019.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 16,
      "constitution": 13,
      "intelligence": 21,
      "wisdom": 17,
      "charisma": 11
    }
  },
  {
    "id": "job-0020",
    "name": "Adept Demonic Warrior",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0020.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 14,
      "wisdom": 21,
      "charisma": 10
    }
  },
  {
    "id": "job-0021",
    "name": "Adept Celestial Mage",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0021.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 11,
      "constitution": 11,
      "intelligence": 10,
      "wisdom": 17,
      "charisma": 27
    }
  },
  {
    "id": "job-0022",
    "name": "Adept Divine Priest",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0022.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 22,
      "constitution": 10,
      "intelligence": 13,
      "wisdom": 10,
      "charisma": 26
    }
  },
  {
    "id": "job-0023",
    "name": "Adept Arcane Scholar",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0023.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 12,
      "constitution": 24,
      "intelligence": 29,
      "wisdom": 18,
      "charisma": 21
    }
  },
  {
    "id": "job-0024",
    "name": "Adept Infernal Berserker",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0024.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 28,
      "constitution": 18,
      "intelligence": 23,
      "wisdom": 14,
      "charisma": 15
    }
  },
  {
    "id": "job-0025",
    "name": "Adept Frozen Guardian",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0025.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 21,
      "constitution": 14,
      "intelligence": 21,
      "wisdom": 21,
      "charisma": 13
    }
  },
  {
    "id": "job-0026",
    "name": "Adept Thunder Striker",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0026.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 18,
      "wisdom": 22,
      "charisma": 28
    }
  },
  {
    "id": "job-0027",
    "name": "Adept Holy Paladin",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0027.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 16,
      "constitution": 12,
      "intelligence": 28,
      "wisdom": 12,
      "charisma": 24
    }
  },
  {
    "id": "job-0028",
    "name": "Adept Dark Assassin",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0028.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 22,
      "constitution": 17,
      "intelligence": 27,
      "wisdom": 10,
      "charisma": 12
    }
  },
  {
    "id": "job-0029",
    "name": "Adept Ancient Sage",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0029.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 22,
      "constitution": 23,
      "intelligence": 22,
      "wisdom": 15,
      "charisma": 15
    }
  },
  {
    "id": "job-0030",
    "name": "Adept Primordial Warrior",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0030.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 21,
      "constitution": 29,
      "intelligence": 21,
      "wisdom": 14,
      "charisma": 27
    }
  },
  {
    "id": "job-0031",
    "name": "Adept Supreme Commander",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0031.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 26,
      "constitution": 28,
      "intelligence": 26,
      "wisdom": 17,
      "charisma": 23
    }
  },
  {
    "id": "job-0032",
    "name": "Adept Legendary Hero",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0032.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 22,
      "constitution": 22,
      "intelligence": 27,
      "wisdom": 21,
      "charisma": 22
    }
  },
  {
    "id": "job-0033",
    "name": "Master Shadow Hunter",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0033.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 19,
      "constitution": 20,
      "intelligence": 21,
      "wisdom": 29,
      "charisma": 25
    }
  },
  {
    "id": "job-0034",
    "name": "Master Void Walker",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0034.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 18,
      "wisdom": 28,
      "charisma": 19
    }
  },
  {
    "id": "job-0035",
    "name": "Master Abyssal Knight",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0035.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 16,
      "constitution": 18,
      "intelligence": 11,
      "wisdom": 26,
      "charisma": 26
    }
  },
  {
    "id": "job-0036",
    "name": "Master Demonic Warrior",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0036.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 22,
      "constitution": 25,
      "intelligence": 27,
      "wisdom": 28,
      "charisma": 10
    }
  },
  {
    "id": "job-0037",
    "name": "Master Celestial Mage",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0037.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 20,
      "constitution": 15,
      "intelligence": 23,
      "wisdom": 10,
      "charisma": 21
    }
  },
  {
    "id": "job-0038",
    "name": "Master Divine Priest",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0038.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 23,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 13,
      "wisdom": 19,
      "charisma": 10
    }
  },
  {
    "id": "job-0039",
    "name": "Master Arcane Scholar",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0039.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 18,
      "wisdom": 12,
      "charisma": 23
    }
  },
  {
    "id": "job-0040",
    "name": "Master Infernal Berserker",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0040.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 20,
      "constitution": 20,
      "intelligence": 20,
      "wisdom": 27,
      "charisma": 11
    }
  },
  {
    "id": "job-0041",
    "name": "Master Frozen Guardian",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0041.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 26,
      "constitution": 27,
      "intelligence": 28,
      "wisdom": 14,
      "charisma": 18
    }
  },
  {
    "id": "job-0042",
    "name": "Master Thunder Striker",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0042.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 21,
      "constitution": 21,
      "intelligence": 16,
      "wisdom": 16,
      "charisma": 10
    }
  },
  {
    "id": "job-0043",
    "name": "Master Holy Paladin",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0043.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 26,
      "constitution": 22,
      "intelligence": 27,
      "wisdom": 11,
      "charisma": 29
    }
  },
  {
    "id": "job-0044",
    "name": "Master Dark Assassin",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0044.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 23,
      "constitution": 29,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 19
    }
  },
  {
    "id": "job-0045",
    "name": "Master Ancient Sage",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0045.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 27,
      "constitution": 18,
      "intelligence": 21,
      "wisdom": 12,
      "charisma": 29
    }
  },
  {
    "id": "job-0046",
    "name": "Master Primordial Warrior",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0046.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 17,
      "constitution": 13,
      "intelligence": 19,
      "wisdom": 11,
      "charisma": 22
    }
  },
  {
    "id": "job-0047",
    "name": "Master Supreme Commander",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0047.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 23,
      "dexterity": 17,
      "constitution": 27,
      "intelligence": 19,
      "wisdom": 23,
      "charisma": 14
    }
  },
  {
    "id": "job-0048",
    "name": "Master Legendary Hero",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0048.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 19,
      "wisdom": 21,
      "charisma": 12
    }
  },
  {
    "id": "job-0049",
    "name": "Grandmaster Shadow Hunter",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0049.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 26,
      "constitution": 27,
      "intelligence": 26,
      "wisdom": 17,
      "charisma": 12
    }
  },
  {
    "id": "job-0050",
    "name": "Grandmaster Void Walker",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0050.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 28,
      "intelligence": 13,
      "wisdom": 21,
      "charisma": 27
    }
  },
  {
    "id": "job-0051",
    "name": "Grandmaster Abyssal Knight",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0051.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 17,
      "constitution": 18,
      "intelligence": 14,
      "wisdom": 29,
      "charisma": 15
    }
  },
  {
    "id": "job-0052",
    "name": "Grandmaster Demonic Warrior",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0052.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 18,
      "constitution": 17,
      "intelligence": 16,
      "wisdom": 27,
      "charisma": 24
    }
  },
  {
    "id": "job-0053",
    "name": "Grandmaster Celestial Mage",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0053.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 26,
      "constitution": 19,
      "intelligence": 12,
      "wisdom": 26,
      "charisma": 16
    }
  },
  {
    "id": "job-0054",
    "name": "Grandmaster Divine Priest",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0054.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 12,
      "constitution": 20,
      "intelligence": 16,
      "wisdom": 22,
      "charisma": 23
    }
  },
  {
    "id": "job-0055",
    "name": "Grandmaster Arcane Scholar",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0055.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 19,
      "constitution": 22,
      "intelligence": 28,
      "wisdom": 18,
      "charisma": 26
    }
  },
  {
    "id": "job-0056",
    "name": "Grandmaster Infernal Berserker",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0056.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 17,
      "dexterity": 12,
      "constitution": 25,
      "intelligence": 12,
      "wisdom": 19,
      "charisma": 21
    }
  },
  {
    "id": "job-0057",
    "name": "Grandmaster Frozen Guardian",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0057.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 17,
      "constitution": 20,
      "intelligence": 12,
      "wisdom": 19,
      "charisma": 23
    }
  },
  {
    "id": "job-0058",
    "name": "Grandmaster Thunder Striker",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0058.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 23,
      "constitution": 13,
      "intelligence": 14,
      "wisdom": 29,
      "charisma": 18
    }
  },
  {
    "id": "job-0059",
    "name": "Grandmaster Holy Paladin",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0059.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 23,
      "dexterity": 29,
      "constitution": 11,
      "intelligence": 27,
      "wisdom": 21,
      "charisma": 29
    }
  },
  {
    "id": "job-0060",
    "name": "Grandmaster Dark Assassin",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0060.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 22,
      "dexterity": 23,
      "constitution": 16,
      "intelligence": 12,
      "wisdom": 26,
      "charisma": 12
    }
  },
  {
    "id": "job-0061",
    "name": "Grandmaster Ancient Sage",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0061.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 28,
      "constitution": 24,
      "intelligence": 23,
      "wisdom": 24,
      "charisma": 14
    }
  },
  {
    "id": "job-0062",
    "name": "Grandmaster Primordial Warrior",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0062.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 18,
      "intelligence": 18,
      "wisdom": 10,
      "charisma": 29
    }
  },
  {
    "id": "job-0063",
    "name": "Grandmaster Supreme Commander",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0063.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 16,
      "wisdom": 16,
      "charisma": 15
    }
  },
  {
    "id": "job-0064",
    "name": "Grandmaster Legendary Hero",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0064.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 25,
      "intelligence": 22,
      "wisdom": 24,
      "charisma": 26
    }
  },
  {
    "id": "job-0065",
    "name": "Legendary Shadow Hunter",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0065.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 29,
      "constitution": 19,
      "intelligence": 20,
      "wisdom": 26,
      "charisma": 12
    }
  },
  {
    "id": "job-0066",
    "name": "Legendary Void Walker",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0066.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 21,
      "constitution": 23,
      "intelligence": 13,
      "wisdom": 23,
      "charisma": 13
    }
  },
  {
    "id": "job-0067",
    "name": "Legendary Abyssal Knight",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0067.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 25,
      "wisdom": 13,
      "charisma": 24
    }
  },
  {
    "id": "job-0068",
    "name": "Legendary Demonic Warrior",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0068.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 19,
      "charisma": 26
    }
  },
  {
    "id": "job-0069",
    "name": "Legendary Celestial Mage",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0069.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 26,
      "charisma": 17
    }
  },
  {
    "id": "job-0070",
    "name": "Legendary Divine Priest",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0070.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 13,
      "constitution": 22,
      "intelligence": 12,
      "wisdom": 12,
      "charisma": 26
    }
  },
  {
    "id": "job-0071",
    "name": "Legendary Arcane Scholar",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0071.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 23,
      "constitution": 11,
      "intelligence": 15,
      "wisdom": 17,
      "charisma": 23
    }
  },
  {
    "id": "job-0072",
    "name": "Legendary Infernal Berserker",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0072.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 11,
      "constitution": 21,
      "intelligence": 26,
      "wisdom": 27,
      "charisma": 27
    }
  },
  {
    "id": "job-0073",
    "name": "Legendary Frozen Guardian",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0073.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 29,
      "constitution": 27,
      "intelligence": 11,
      "wisdom": 18,
      "charisma": 21
    }
  },
  {
    "id": "job-0074",
    "name": "Legendary Thunder Striker",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0074.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 15,
      "constitution": 20,
      "intelligence": 21,
      "wisdom": 25,
      "charisma": 13
    }
  },
  {
    "id": "job-0075",
    "name": "Legendary Holy Paladin",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0075.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 25,
      "constitution": 17,
      "intelligence": 28,
      "wisdom": 19,
      "charisma": 26
    }
  },
  {
    "id": "job-0076",
    "name": "Legendary Dark Assassin",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0076.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 19,
      "constitution": 15,
      "intelligence": 20,
      "wisdom": 10,
      "charisma": 28
    }
  },
  {
    "id": "job-0077",
    "name": "Legendary Ancient Sage",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0077.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 14,
      "wisdom": 25,
      "charisma": 15
    }
  },
  {
    "id": "job-0078",
    "name": "Legendary Primordial Warrior",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0078.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 16,
      "constitution": 13,
      "intelligence": 21,
      "wisdom": 17,
      "charisma": 29
    }
  },
  {
    "id": "job-0079",
    "name": "Legendary Supreme Commander",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0079.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 20,
      "constitution": 23,
      "intelligence": 10,
      "wisdom": 29,
      "charisma": 21
    }
  },
  {
    "id": "job-0080",
    "name": "Legendary Legendary Hero",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0080.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 27,
      "constitution": 13,
      "intelligence": 24,
      "wisdom": 26,
      "charisma": 17
    }
  },
  {
    "id": "job-0081",
    "name": "Mythic Shadow Hunter",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0081.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 12,
      "constitution": 11,
      "intelligence": 29,
      "wisdom": 26,
      "charisma": 10
    }
  },
  {
    "id": "job-0082",
    "name": "Mythic Void Walker",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0082.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 28,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 19,
      "charisma": 26
    }
  },
  {
    "id": "job-0083",
    "name": "Mythic Abyssal Knight",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0083.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 29,
      "constitution": 28,
      "intelligence": 24,
      "wisdom": 26,
      "charisma": 29
    }
  },
  {
    "id": "job-0084",
    "name": "Mythic Demonic Warrior",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0084.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 18,
      "constitution": 27,
      "intelligence": 26,
      "wisdom": 12,
      "charisma": 20
    }
  },
  {
    "id": "job-0085",
    "name": "Mythic Celestial Mage",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0085.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 24,
      "constitution": 10,
      "intelligence": 29,
      "wisdom": 23,
      "charisma": 24
    }
  },
  {
    "id": "job-0086",
    "name": "Mythic Divine Priest",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0086.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 23,
      "constitution": 22,
      "intelligence": 22,
      "wisdom": 12,
      "charisma": 12
    }
  },
  {
    "id": "job-0087",
    "name": "Mythic Arcane Scholar",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0087.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 25,
      "constitution": 22,
      "intelligence": 22,
      "wisdom": 28,
      "charisma": 25
    }
  },
  {
    "id": "job-0088",
    "name": "Mythic Infernal Berserker",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0088.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 17,
      "constitution": 22,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 28
    }
  },
  {
    "id": "job-0089",
    "name": "Mythic Frozen Guardian",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0089.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 17,
      "dexterity": 20,
      "constitution": 27,
      "intelligence": 27,
      "wisdom": 27,
      "charisma": 17
    }
  },
  {
    "id": "job-0090",
    "name": "Mythic Thunder Striker",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0090.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 22,
      "constitution": 15,
      "intelligence": 11,
      "wisdom": 22,
      "charisma": 23
    }
  },
  {
    "id": "job-0091",
    "name": "Mythic Holy Paladin",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0091.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 24,
      "constitution": 14,
      "intelligence": 16,
      "wisdom": 29,
      "charisma": 11
    }
  },
  {
    "id": "job-0092",
    "name": "Mythic Dark Assassin",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0092.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 14,
      "constitution": 18,
      "intelligence": 15,
      "wisdom": 26,
      "charisma": 21
    }
  },
  {
    "id": "job-0093",
    "name": "Mythic Ancient Sage",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0093.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 29,
      "constitution": 12,
      "intelligence": 14,
      "wisdom": 25,
      "charisma": 26
    }
  },
  {
    "id": "job-0094",
    "name": "Mythic Primordial Warrior",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0094.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 16,
      "constitution": 26,
      "intelligence": 28,
      "wisdom": 24,
      "charisma": 27
    }
  },
  {
    "id": "job-0095",
    "name": "Mythic Supreme Commander",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0095.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 24,
      "constitution": 15,
      "intelligence": 26,
      "wisdom": 24,
      "charisma": 27
    }
  },
  {
    "id": "job-0096",
    "name": "Mythic Legendary Hero",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0096.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 17,
      "dexterity": 21,
      "constitution": 25,
      "intelligence": 27,
      "wisdom": 18,
      "charisma": 24
    }
  },
  {
    "id": "job-0097",
    "name": "Divine Shadow Hunter",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0097.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 28,
      "constitution": 10,
      "intelligence": 24,
      "wisdom": 14,
      "charisma": 19
    }
  },
  {
    "id": "job-0098",
    "name": "Divine Void Walker",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0098.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 29,
      "constitution": 26,
      "intelligence": 19,
      "wisdom": 27,
      "charisma": 17
    }
  },
  {
    "id": "job-0099",
    "name": "Divine Abyssal Knight",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0099.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 21,
      "constitution": 24,
      "intelligence": 28,
      "wisdom": 20,
      "charisma": 17
    }
  },
  {
    "id": "job-0100",
    "name": "Divine Demonic Warrior",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0100.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 23,
      "constitution": 15,
      "intelligence": 29,
      "wisdom": 27,
      "charisma": 19
    }
  },
  {
    "id": "job-0101",
    "name": "Divine Celestial Mage",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0101.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 20,
      "constitution": 21,
      "intelligence": 22,
      "wisdom": 27,
      "charisma": 10
    }
  },
  {
    "id": "job-0102",
    "name": "Divine Divine Priest",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0102.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 26,
      "constitution": 23,
      "intelligence": 10,
      "wisdom": 15,
      "charisma": 24
    }
  },
  {
    "id": "job-0103",
    "name": "Divine Arcane Scholar",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0103.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 20,
      "constitution": 11,
      "intelligence": 24,
      "wisdom": 18,
      "charisma": 28
    }
  },
  {
    "id": "job-0104",
    "name": "Divine Infernal Berserker",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0104.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 27,
      "dexterity": 23,
      "constitution": 26,
      "intelligence": 20,
      "wisdom": 21,
      "charisma": 11
    }
  },
  {
    "id": "job-0105",
    "name": "Divine Frozen Guardian",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0105.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 23,
      "dexterity": 15,
      "constitution": 18,
      "intelligence": 26,
      "wisdom": 12,
      "charisma": 16
    }
  },
  {
    "id": "job-0106",
    "name": "Divine Thunder Striker",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0106.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 15,
      "constitution": 26,
      "intelligence": 11,
      "wisdom": 27,
      "charisma": 22
    }
  },
  {
    "id": "job-0107",
    "name": "Divine Holy Paladin",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0107.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 25,
      "wisdom": 29,
      "charisma": 10
    }
  },
  {
    "id": "job-0108",
    "name": "Divine Dark Assassin",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0108.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 16,
      "constitution": 20,
      "intelligence": 28,
      "wisdom": 15,
      "charisma": 23
    }
  },
  {
    "id": "job-0109",
    "name": "Divine Ancient Sage",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0109.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 19,
      "constitution": 11,
      "intelligence": 24,
      "wisdom": 23,
      "charisma": 17
    }
  },
  {
    "id": "job-0110",
    "name": "Divine Primordial Warrior",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0110.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 10,
      "dexterity": 17,
      "constitution": 11,
      "intelligence": 13,
      "wisdom": 13,
      "charisma": 13
    }
  },
  {
    "id": "job-0111",
    "name": "Divine Supreme Commander",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0111.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 18,
      "constitution": 10,
      "intelligence": 29,
      "wisdom": 17,
      "charisma": 17
    }
  },
  {
    "id": "job-0112",
    "name": "Divine Legendary Hero",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0112.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 27,
      "dexterity": 20,
      "constitution": 26,
      "intelligence": 11,
      "wisdom": 27,
      "charisma": 21
    }
  },
  {
    "id": "job-0113",
    "name": "Supreme Shadow Hunter",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0113.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 25,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 19
    }
  },
  {
    "id": "job-0114",
    "name": "Supreme Void Walker",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0114.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 24,
      "constitution": 20,
      "intelligence": 16,
      "wisdom": 11,
      "charisma": 13
    }
  },
  {
    "id": "job-0115",
    "name": "Supreme Abyssal Knight",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0115.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 19,
      "constitution": 20,
      "intelligence": 19,
      "wisdom": 25,
      "charisma": 17
    }
  },
  {
    "id": "job-0116",
    "name": "Supreme Demonic Warrior",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0116.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 22,
      "intelligence": 13,
      "wisdom": 10,
      "charisma": 24
    }
  },
  {
    "id": "job-0117",
    "name": "Supreme Celestial Mage",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0117.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 17,
      "constitution": 19,
      "intelligence": 18,
      "wisdom": 10,
      "charisma": 24
    }
  },
  {
    "id": "job-0118",
    "name": "Supreme Divine Priest",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0118.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 28,
      "constitution": 19,
      "intelligence": 20,
      "wisdom": 18,
      "charisma": 25
    }
  },
  {
    "id": "job-0119",
    "name": "Supreme Arcane Scholar",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0119.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 24,
      "constitution": 11,
      "intelligence": 28,
      "wisdom": 14,
      "charisma": 24
    }
  },
  {
    "id": "job-0120",
    "name": "Supreme Infernal Berserker",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0120.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 23,
      "constitution": 17,
      "intelligence": 17,
      "wisdom": 25,
      "charisma": 13
    }
  },
  {
    "id": "job-0121",
    "name": "Supreme Frozen Guardian",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0121.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 24,
      "constitution": 13,
      "intelligence": 17,
      "wisdom": 28,
      "charisma": 11
    }
  },
  {
    "id": "job-0122",
    "name": "Supreme Thunder Striker",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0122.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 22,
      "constitution": 13,
      "intelligence": 20,
      "wisdom": 20,
      "charisma": 18
    }
  },
  {
    "id": "job-0123",
    "name": "Supreme Holy Paladin",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0123.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 17,
      "dexterity": 16,
      "constitution": 12,
      "intelligence": 17,
      "wisdom": 16,
      "charisma": 26
    }
  },
  {
    "id": "job-0124",
    "name": "Supreme Dark Assassin",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0124.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 27,
      "constitution": 21,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 10
    }
  },
  {
    "id": "job-0125",
    "name": "Supreme Ancient Sage",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0125.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 28,
      "wisdom": 16,
      "charisma": 25
    }
  },
  {
    "id": "job-0126",
    "name": "Supreme Primordial Warrior",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0126.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 10,
      "constitution": 18,
      "intelligence": 13,
      "wisdom": 29,
      "charisma": 14
    }
  },
  {
    "id": "job-0127",
    "name": "Supreme Supreme Commander",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0127.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 18,
      "constitution": 10,
      "intelligence": 21,
      "wisdom": 27,
      "charisma": 14
    }
  },
  {
    "id": "job-0128",
    "name": "Supreme Legendary Hero",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0128.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 20,
      "constitution": 12,
      "intelligence": 27,
      "wisdom": 16,
      "charisma": 24
    }
  },
  {
    "id": "job-0129",
    "name": "Eternal Shadow Hunter",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0129.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 20,
      "constitution": 17,
      "intelligence": 16,
      "wisdom": 25,
      "charisma": 12
    }
  },
  {
    "id": "job-0130",
    "name": "Eternal Void Walker",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0130.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 16,
      "wisdom": 20,
      "charisma": 23
    }
  },
  {
    "id": "job-0131",
    "name": "Eternal Abyssal Knight",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0131.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 13,
      "constitution": 21,
      "intelligence": 21,
      "wisdom": 16,
      "charisma": 23
    }
  },
  {
    "id": "job-0132",
    "name": "Eternal Demonic Warrior",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0132.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 17,
      "constitution": 22,
      "intelligence": 11,
      "wisdom": 11,
      "charisma": 15
    }
  },
  {
    "id": "job-0133",
    "name": "Eternal Celestial Mage",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0133.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 25,
      "wisdom": 19,
      "charisma": 25
    }
  },
  {
    "id": "job-0134",
    "name": "Eternal Divine Priest",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0134.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 25,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 28,
      "charisma": 27
    }
  },
  {
    "id": "job-0135",
    "name": "Eternal Arcane Scholar",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0135.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 11,
      "constitution": 29,
      "intelligence": 28,
      "wisdom": 22,
      "charisma": 18
    }
  },
  {
    "id": "job-0136",
    "name": "Eternal Infernal Berserker",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0136.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 12,
      "constitution": 21,
      "intelligence": 21,
      "wisdom": 17,
      "charisma": 15
    }
  },
  {
    "id": "job-0137",
    "name": "Eternal Frozen Guardian",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0137.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 25,
      "constitution": 14,
      "intelligence": 11,
      "wisdom": 13,
      "charisma": 29
    }
  },
  {
    "id": "job-0138",
    "name": "Eternal Thunder Striker",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0138.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 23,
      "dexterity": 13,
      "constitution": 22,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 21
    }
  },
  {
    "id": "job-0139",
    "name": "Eternal Holy Paladin",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0139.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 26,
      "constitution": 16,
      "intelligence": 16,
      "wisdom": 19,
      "charisma": 25
    }
  },
  {
    "id": "job-0140",
    "name": "Eternal Dark Assassin",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0140.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 14,
      "wisdom": 20,
      "charisma": 20
    }
  },
  {
    "id": "job-0141",
    "name": "Eternal Ancient Sage",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0141.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 14,
      "constitution": 17,
      "intelligence": 13,
      "wisdom": 15,
      "charisma": 18
    }
  },
  {
    "id": "job-0142",
    "name": "Eternal Primordial Warrior",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0142.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 29,
      "constitution": 24,
      "intelligence": 23,
      "wisdom": 24,
      "charisma": 19
    }
  },
  {
    "id": "job-0143",
    "name": "Eternal Supreme Commander",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0143.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 22,
      "dexterity": 12,
      "constitution": 14,
      "intelligence": 17,
      "wisdom": 27,
      "charisma": 13
    }
  },
  {
    "id": "job-0144",
    "name": "Eternal Legendary Hero",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0144.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 11,
      "constitution": 18,
      "intelligence": 26,
      "wisdom": 24,
      "charisma": 18
    }
  },
  {
    "id": "job-0145",
    "name": "Primordial Shadow Hunter",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0145.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 26,
      "constitution": 22,
      "intelligence": 19,
      "wisdom": 15,
      "charisma": 25
    }
  },
  {
    "id": "job-0146",
    "name": "Primordial Void Walker",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0146.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 23,
      "constitution": 17,
      "intelligence": 28,
      "wisdom": 25,
      "charisma": 23
    }
  },
  {
    "id": "job-0147",
    "name": "Primordial Abyssal Knight",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0147.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 22,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 16,
      "wisdom": 25,
      "charisma": 25
    }
  },
  {
    "id": "job-0148",
    "name": "Primordial Demonic Warrior",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0148.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 28,
      "constitution": 19,
      "intelligence": 19,
      "wisdom": 13,
      "charisma": 27
    }
  },
  {
    "id": "job-0149",
    "name": "Primordial Celestial Mage",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0149.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 28,
      "constitution": 24,
      "intelligence": 11,
      "wisdom": 15,
      "charisma": 26
    }
  },
  {
    "id": "job-0150",
    "name": "Primordial Divine Priest",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0150.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 20,
      "dexterity": 18,
      "constitution": 17,
      "intelligence": 24,
      "wisdom": 10,
      "charisma": 17
    }
  },
  {
    "id": "job-0151",
    "name": "Primordial Arcane Scholar",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0151.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 21,
      "constitution": 28,
      "intelligence": 15,
      "wisdom": 15,
      "charisma": 20
    }
  },
  {
    "id": "job-0152",
    "name": "Primordial Infernal Berserker",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0152.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 23,
      "constitution": 21,
      "intelligence": 12,
      "wisdom": 22,
      "charisma": 26
    }
  },
  {
    "id": "job-0153",
    "name": "Primordial Frozen Guardian",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0153.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 25,
      "constitution": 22,
      "intelligence": 10,
      "wisdom": 15,
      "charisma": 23
    }
  },
  {
    "id": "job-0154",
    "name": "Primordial Thunder Striker",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0154.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 20,
      "constitution": 27,
      "intelligence": 15,
      "wisdom": 26,
      "charisma": 28
    }
  },
  {
    "id": "job-0155",
    "name": "Primordial Holy Paladin",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0155.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 26,
      "constitution": 28,
      "intelligence": 20,
      "wisdom": 25,
      "charisma": 10
    }
  },
  {
    "id": "job-0156",
    "name": "Primordial Dark Assassin",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0156.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 29,
      "constitution": 23,
      "intelligence": 25,
      "wisdom": 23,
      "charisma": 15
    }
  },
  {
    "id": "job-0157",
    "name": "Primordial Ancient Sage",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0157.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 21,
      "constitution": 16,
      "intelligence": 24,
      "wisdom": 23,
      "charisma": 13
    }
  },
  {
    "id": "job-0158",
    "name": "Primordial Primordial Warrior",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0158.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 11,
      "constitution": 22,
      "intelligence": 17,
      "wisdom": 27,
      "charisma": 16
    }
  },
  {
    "id": "job-0159",
    "name": "Primordial Supreme Commander",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0159.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 21,
      "constitution": 11,
      "intelligence": 20,
      "wisdom": 27,
      "charisma": 21
    }
  },
  {
    "id": "job-0160",
    "name": "Primordial Legendary Hero",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0160.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 29,
      "intelligence": 19,
      "wisdom": 28,
      "charisma": 24
    }
  },
  {
    "id": "job-0161",
    "name": "Ancient Shadow Hunter",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0161.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 11,
      "dexterity": 14,
      "constitution": 18,
      "intelligence": 16,
      "wisdom": 20,
      "charisma": 20
    }
  },
  {
    "id": "job-0162",
    "name": "Ancient Void Walker",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0162.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 12,
      "constitution": 22,
      "intelligence": 12,
      "wisdom": 23,
      "charisma": 12
    }
  },
  {
    "id": "job-0163",
    "name": "Ancient Abyssal Knight",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0163.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 19,
      "constitution": 16,
      "intelligence": 18,
      "wisdom": 19,
      "charisma": 12
    }
  },
  {
    "id": "job-0164",
    "name": "Ancient Demonic Warrior",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0164.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 22,
      "dexterity": 20,
      "constitution": 12,
      "intelligence": 15,
      "wisdom": 20,
      "charisma": 19
    }
  },
  {
    "id": "job-0165",
    "name": "Ancient Celestial Mage",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0165.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 18,
      "constitution": 29,
      "intelligence": 26,
      "wisdom": 15,
      "charisma": 22
    }
  },
  {
    "id": "job-0166",
    "name": "Ancient Divine Priest",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0166.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 15,
      "constitution": 19,
      "intelligence": 20,
      "wisdom": 10,
      "charisma": 15
    }
  },
  {
    "id": "job-0167",
    "name": "Ancient Arcane Scholar",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0167.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 19,
      "constitution": 13,
      "intelligence": 27,
      "wisdom": 12,
      "charisma": 26
    }
  },
  {
    "id": "job-0168",
    "name": "Ancient Infernal Berserker",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0168.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 18,
      "dexterity": 29,
      "constitution": 26,
      "intelligence": 17,
      "wisdom": 27,
      "charisma": 21
    }
  },
  {
    "id": "job-0169",
    "name": "Ancient Frozen Guardian",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0169.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 26,
      "constitution": 27,
      "intelligence": 18,
      "wisdom": 14,
      "charisma": 20
    }
  },
  {
    "id": "job-0170",
    "name": "Ancient Thunder Striker",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0170.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 27,
      "constitution": 29,
      "intelligence": 29,
      "wisdom": 15,
      "charisma": 23
    }
  },
  {
    "id": "job-0171",
    "name": "Ancient Holy Paladin",
    "type": "Rogue",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0171.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 27,
      "dexterity": 19,
      "constitution": 12,
      "intelligence": 26,
      "wisdom": 28,
      "charisma": 12
    }
  },
  {
    "id": "job-0172",
    "name": "Ancient Dark Assassin",
    "type": "Priest",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0172.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 12,
      "dexterity": 28,
      "constitution": 29,
      "intelligence": 18,
      "wisdom": 23,
      "charisma": 23
    }
  },
  {
    "id": "job-0173",
    "name": "Ancient Ancient Sage",
    "type": "Paladin",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0173.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 23,
      "wisdom": 20,
      "charisma": 29
    }
  },
  {
    "id": "job-0174",
    "name": "Ancient Primordial Warrior",
    "type": "Ranger",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0174.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 16,
      "wisdom": 18,
      "charisma": 20
    }
  },
  {
    "id": "job-0175",
    "name": "Ancient Supreme Commander",
    "type": "Warrior",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0175.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 19,
      "constitution": 15,
      "intelligence": 17,
      "wisdom": 20,
      "charisma": 14
    }
  },
  {
    "id": "job-0176",
    "name": "Ancient Legendary Hero",
    "type": "Mage",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0176.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 22,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 19,
      "charisma": 23
    }
  },
  {
    "id": "job-0177",
    "name": "Forgotten Shadow Hunter",
    "type": "Rogue",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0177.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 22,
      "intelligence": 21,
      "wisdom": 21,
      "charisma": 13
    }
  },
  {
    "id": "job-0178",
    "name": "Forgotten Void Walker",
    "type": "Priest",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0178.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 26,
      "dexterity": 20,
      "constitution": 28,
      "intelligence": 24,
      "wisdom": 25,
      "charisma": 25
    }
  },
  {
    "id": "job-0179",
    "name": "Forgotten Abyssal Knight",
    "type": "Paladin",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0179.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 29,
      "constitution": 13,
      "intelligence": 19,
      "wisdom": 22,
      "charisma": 16
    }
  },
  {
    "id": "job-0180",
    "name": "Forgotten Demonic Warrior",
    "type": "Ranger",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0180.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 27,
      "constitution": 17,
      "intelligence": 28,
      "wisdom": 23,
      "charisma": 19
    }
  },
  {
    "id": "job-0181",
    "name": "Forgotten Celestial Mage",
    "type": "Warrior",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0181.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 21,
      "constitution": 22,
      "intelligence": 27,
      "wisdom": 16,
      "charisma": 24
    }
  },
  {
    "id": "job-0182",
    "name": "Forgotten Divine Priest",
    "type": "Mage",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0182.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 15,
      "dexterity": 16,
      "constitution": 24,
      "intelligence": 13,
      "wisdom": 19,
      "charisma": 28
    }
  },
  {
    "id": "job-0183",
    "name": "Forgotten Arcane Scholar",
    "type": "Rogue",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0183.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 19,
      "dexterity": 12,
      "constitution": 26,
      "intelligence": 12,
      "wisdom": 25,
      "charisma": 14
    }
  },
  {
    "id": "job-0184",
    "name": "Forgotten Infernal Berserker",
    "type": "Priest",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0184.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 21,
      "dexterity": 13,
      "constitution": 27,
      "intelligence": 24,
      "wisdom": 24,
      "charisma": 26
    }
  },
  {
    "id": "job-0185",
    "name": "Forgotten Frozen Guardian",
    "type": "Paladin",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0185.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 25,
      "constitution": 23,
      "intelligence": 24,
      "wisdom": 20,
      "charisma": 22
    }
  },
  {
    "id": "job-0186",
    "name": "Forgotten Thunder Striker",
    "type": "Ranger",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0186.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 16,
      "constitution": 21,
      "intelligence": 13,
      "wisdom": 28,
      "charisma": 18
    }
  },
  {
    "id": "job-0187",
    "name": "Forgotten Holy Paladin",
    "type": "Warrior",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0187.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 16,
      "dexterity": 24,
      "constitution": 28,
      "intelligence": 24,
      "wisdom": 14,
      "charisma": 20
    }
  },
  {
    "id": "job-0188",
    "name": "Forgotten Dark Assassin",
    "type": "Mage",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0188.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 18,
      "constitution": 24,
      "intelligence": 22,
      "wisdom": 10,
      "charisma": 20
    }
  },
  {
    "id": "job-0189",
    "name": "Forgotten Ancient Sage",
    "type": "Rogue",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0189.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 14,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 16,
      "wisdom": 26,
      "charisma": 26
    }
  },
  {
    "id": "job-0190",
    "name": "Forgotten Primordial Warrior",
    "type": "Priest",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0190.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 19,
      "constitution": 11,
      "intelligence": 22,
      "wisdom": 28,
      "charisma": 23
    }
  },
  {
    "id": "job-0191",
    "name": "Forgotten Supreme Commander",
    "type": "Paladin",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0191.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 28,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 14,
      "wisdom": 27,
      "charisma": 23
    }
  },
  {
    "id": "job-0192",
    "name": "Forgotten Legendary Hero",
    "type": "Ranger",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0192.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 27,
      "dexterity": 19,
      "constitution": 23,
      "intelligence": 29,
      "wisdom": 27,
      "charisma": 19
    }
  },
  {
    "id": "job-0193",
    "name": "Novice Shadow Hunter",
    "type": "Warrior",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0193.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage"
    ],
    "stats": {
      "strength": 13,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 20,
      "wisdom": 12,
      "charisma": 25
    }
  },
  {
    "id": "job-0194",
    "name": "Novice Void Walker",
    "type": "Mage",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0194.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 15,
      "constitution": 15,
      "intelligence": 26,
      "wisdom": 16,
      "charisma": 27
    }
  },
  {
    "id": "job-0195",
    "name": "Novice Abyssal Knight",
    "type": "Rogue",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0195.jpg",
    "description": "A prestigious rogue class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 29,
      "dexterity": 19,
      "constitution": 18,
      "intelligence": 12,
      "wisdom": 18,
      "charisma": 19
    }
  },
  {
    "id": "job-0196",
    "name": "Novice Demonic Warrior",
    "type": "Priest",
    "rank": "D",
    "image": "/generated/compendium/jobs/job-0196.jpg",
    "description": "A prestigious priest class that has mastered the art of shadow combat. This D rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 13,
      "constitution": 26,
      "intelligence": 28,
      "wisdom": 19,
      "charisma": 21
    }
  },
  {
    "id": "job-0197",
    "name": "Novice Celestial Mage",
    "type": "Paladin",
    "rank": "C",
    "image": "/generated/compendium/jobs/job-0197.jpg",
    "description": "A prestigious paladin class that has mastered the art of shadow combat. This C rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 22,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 15,
      "wisdom": 17,
      "charisma": 24
    }
  },
  {
    "id": "job-0198",
    "name": "Novice Divine Priest",
    "type": "Ranger",
    "rank": "B",
    "image": "/generated/compendium/jobs/job-0198.jpg",
    "description": "A prestigious ranger class that has mastered the art of shadow combat. This B rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 25,
      "dexterity": 25,
      "constitution": 15,
      "intelligence": 20,
      "wisdom": 18,
      "charisma": 14
    }
  },
  {
    "id": "job-0199",
    "name": "Novice Arcane Scholar",
    "type": "Warrior",
    "rank": "A",
    "image": "/generated/compendium/jobs/job-0199.jpg",
    "description": "A prestigious warrior class that has mastered the art of shadow combat. This A rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk",
      "Abyssal Rage",
      "Demonic Power"
    ],
    "stats": {
      "strength": 27,
      "dexterity": 27,
      "constitution": 27,
      "intelligence": 16,
      "wisdom": 11,
      "charisma": 18
    }
  },
  {
    "id": "job-0200",
    "name": "Novice Infernal Berserker",
    "type": "Mage",
    "rank": "S",
    "image": "/generated/compendium/jobs/job-0200.jpg",
    "description": "A prestigious mage class that has mastered the art of shadow combat. This S rank job is highly respected throughout the shadow realm.",
    "abilities": [
      "Shadow Strike",
      "Void Walk"
    ],
    "stats": {
      "strength": 24,
      "dexterity": 10,
      "constitution": 20,
      "intelligence": 17,
      "wisdom": 11,
      "charisma": 22
    }
  }
];

export default jobs;
