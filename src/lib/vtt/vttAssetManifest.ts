/**
 * VTT Asset Manifest
 *
 * Catalogs all available VTT assets (maps, tokens, props, effects, audio)
 * for the Warden. Local assets are served from /generated/, while audio streams
 * reference free external sources (Tabletop Audio, Freesound).
 *
 * Token SVGs from game-icons.net are CC BY 3.0 (credit: Lorc, Delapouite).
 * Audio URLs reference free, no-login-required ambient streams.
 */

// ─── Types ──────────────────────────────────────────────────

export type AssetCategory =
	| "map"
	| "token"
	| "prop"
	| "effect"
	| "condition"
	| "item"
	| "spell"
	| "rune"
	| "audio"
	| "music";

export interface VTTAsset {
	id: string;
	name: string;
	category: AssetCategory;
	/** Path relative to /public (local) or full URL (external) */
	path: string;
	/** Thumbnail path if available */
	thumbnail?: string;
	/** Tags for search/filtering */
	tags: string[];
	/** SA rank tier (E through S) */
	tier?: "E" | "D" | "C" | "B" | "A" | "S";
	/** File format */
	format: "webp" | "svg" | "png" | "mp3" | "ogg" | "stream";
	/** Attribution/license info */
	attribution?: string;
}

// ─── Battle Maps (22 premade + 6 tiles) ─────────────────────

export const MAP_ASSETS: VTTAsset[] = [
	// Premade SA Battle Maps
	{
		id: "map-gate-antechamber",
		name: "Gate Antechamber",
		category: "map",
		path: "/generated/maps/premade/gate-antechamber.webp",
		thumbnail: "/generated/maps/premade/gate-antechamber-thumb.webp",
		tags: ["gate", "dungeon", "entrance", "rank-e"],
		tier: "E",
		format: "webp",
	},
	{
		id: "map-rank-e-outpost",
		name: "Rank-E Outpost",
		category: "map",
		path: "/generated/maps/premade/rank-e-outpost.webp",
		thumbnail: "/generated/maps/premade/rank-e-outpost-thumb.webp",
		tags: ["outpost", "base", "rank-e"],
		tier: "E",
		format: "webp",
	},
	{
		id: "map-crystal-caverns",
		name: "Crystal Caverns",
		category: "map",
		path: "/generated/maps/premade/crystal-caverns.webp",
		thumbnail: "/generated/maps/premade/crystal-caverns-thumb.webp",
		tags: ["cave", "crystal", "underground", "dungeon"],
		tier: "D",
		format: "webp",
	},
	{
		id: "map-inkwash-ruins",
		name: "Inkwash Ruins",
		category: "map",
		path: "/generated/maps/premade/inkwash-ruins.webp",
		thumbnail: "/generated/maps/premade/inkwash-ruins-thumb.webp",
		tags: ["ruins", "outdoor", "exploration"],
		tier: "D",
		format: "webp",
	},
	{
		id: "map-sealed-vault",
		name: "Sealed Vault",
		category: "map",
		path: "/generated/maps/premade/sealed-vault.webp",
		thumbnail: "/generated/maps/premade/sealed-vault-thumb.webp",
		tags: ["vault", "treasure", "dungeon"],
		tier: "C",
		format: "webp",
	},
	{
		id: "map-rift-shrine",
		name: "Rift Shrine",
		category: "map",
		path: "/generated/maps/premade/rift-shrine.webp",
		thumbnail: "/generated/maps/premade/rift-shrine-thumb.webp",
		tags: ["rift", "shrine", "magical", "dungeon"],
		tier: "C",
		format: "webp",
	},
	{
		id: "map-shadow-crypt",
		name: "Shadow Crypt",
		category: "map",
		path: "/generated/maps/premade/shadow-crypt.webp",
		thumbnail: "/generated/maps/premade/shadow-crypt-thumb.webp",
		tags: ["shadow", "crypt", "undead", "dungeon"],
		tier: "C",
		format: "webp",
	},
	{
		id: "map-arcane-schematic",
		name: "Arcane Schematic",
		category: "map",
		path: "/generated/maps/premade/arcane-schematic.webp",
		thumbnail: "/generated/maps/premade/arcane-schematic-thumb.webp",
		tags: ["arcane", "tech", "schematic"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-ashen-forge",
		name: "Ashen Forge",
		category: "map",
		path: "/generated/maps/premade/ashen-forge.webp",
		thumbnail: "/generated/maps/premade/ashen-forge-thumb.webp",
		tags: ["forge", "fire", "lava", "dungeon"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-ashen-forge-depths",
		name: "Ashen Forge Depths",
		category: "map",
		path: "/generated/maps/premade/ashen-forge-depths.webp",
		thumbnail: "/generated/maps/premade/ashen-forge-depths-thumb.webp",
		tags: ["forge", "fire", "boss", "dungeon"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-frostbound-depths",
		name: "Frostbound Depths",
		category: "map",
		path: "/generated/maps/premade/frostbound-depths.webp",
		thumbnail: "/generated/maps/premade/frostbound-depths-thumb.webp",
		tags: ["ice", "frozen", "dungeon"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-frostbound-vault",
		name: "Frostbound Vault",
		category: "map",
		path: "/generated/maps/premade/frostbound-vault.webp",
		thumbnail: "/generated/maps/premade/frostbound-vault-thumb.webp",
		tags: ["ice", "vault", "boss", "dungeon"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-sandswept-ruins",
		name: "Sandswept Ruins",
		category: "map",
		path: "/generated/maps/premade/sandswept-ruins.webp",
		thumbnail: "/generated/maps/premade/sandswept-ruins-thumb.webp",
		tags: ["desert", "sand", "ruins", "outdoor"],
		tier: "B",
		format: "webp",
	},
	{
		id: "map-rift-keep",
		name: "Rift Keep",
		category: "map",
		path: "/generated/maps/premade/rift-keep.webp",
		thumbnail: "/generated/maps/premade/rift-keep-thumb.webp",
		tags: ["rift", "fortress", "dungeon"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-rift-citadel",
		name: "Rift Citadel",
		category: "map",
		path: "/generated/maps/premade/rift-citadel.webp",
		thumbnail: "/generated/maps/premade/rift-citadel-thumb.webp",
		tags: ["rift", "citadel", "boss", "dungeon"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-shadow-labyrinth",
		name: "Shadow Labyrinth",
		category: "map",
		path: "/generated/maps/premade/shadow-labyrinth.webp",
		thumbnail: "/generated/maps/premade/shadow-labyrinth-thumb.webp",
		tags: ["shadow", "labyrinth", "maze", "dungeon"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-veil-garden",
		name: "Veil Garden",
		category: "map",
		path: "/generated/maps/premade/veil-garden.webp",
		thumbnail: "/generated/maps/premade/veil-garden-thumb.webp",
		tags: ["garden", "fey", "magical", "outdoor"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-veil-village",
		name: "Veil Village",
		category: "map",
		path: "/generated/maps/premade/veil-village.webp",
		thumbnail: "/generated/maps/premade/veil-village-thumb.webp",
		tags: ["village", "town", "social"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-gatewatch-town",
		name: "Gatewatch Town",
		category: "map",
		path: "/generated/maps/premade/gatewatch-town.webp",
		thumbnail: "/generated/maps/premade/gatewatch-town-thumb.webp",
		tags: ["town", "city", "hub", "social"],
		tier: "A",
		format: "webp",
	},
	{
		id: "map-ascendant-capital",
		name: "Ascendant Capital",
		category: "map",
		path: "/generated/maps/premade/ascendant-capital.webp",
		thumbnail: "/generated/maps/premade/ascendant-capital-thumb.webp",
		tags: ["city", "capital", "hub", "social"],
		tier: "S",
		format: "webp",
	},
	{
		id: "map-umbral-throne",
		name: "Umbral Throne",
		category: "map",
		path: "/generated/maps/premade/umbral-throne.webp",
		thumbnail: "/generated/maps/premade/umbral-throne-thumb.webp",
		tags: ["shadow", "throne", "boss", "final"],
		tier: "S",
		format: "webp",
	},
	{
		id: "map-rank-s-abyss",
		name: "Rank-S Abyss",
		category: "map",
		path: "/generated/maps/premade/rank-s-abyss.webp",
		thumbnail: "/generated/maps/premade/rank-s-abyss-thumb.webp",
		tags: ["abyss", "boss", "final", "rank-s"],
		tier: "S",
		format: "webp",
	},

	// Reusable map tiles
	{
		id: "tile-dungeon-floor",
		name: "Dungeon Floor Tile",
		category: "map",
		path: "/generated/maps/dungeon-floor.webp",
		tags: ["tile", "dungeon", "floor"],
		format: "webp",
	},
	{
		id: "tile-stone-wall",
		name: "Stone Wall Tile",
		category: "map",
		path: "/generated/maps/stone-wall.webp",
		tags: ["tile", "wall", "stone"],
		format: "webp",
	},
	{
		id: "tile-iron-gate",
		name: "Iron Gate Tile",
		category: "map",
		path: "/generated/maps/iron-gate.webp",
		tags: ["tile", "gate", "door"],
		format: "webp",
	},
	{
		id: "tile-wooden-door",
		name: "Wooden Door Tile",
		category: "map",
		path: "/generated/maps/wooden-door.webp",
		tags: ["tile", "door", "wood"],
		format: "webp",
	},
	{
		id: "tile-throne-room",
		name: "Throne Room Tile",
		category: "map",
		path: "/generated/maps/throne-room.webp",
		tags: ["tile", "throne", "room"],
		format: "webp",
	},
	{
		id: "tile-treasure-chest",
		name: "Treasure Chest Tile",
		category: "map",
		path: "/generated/maps/treasure-chest.webp",
		tags: ["tile", "treasure", "loot"],
		format: "webp",
	},

	// ── Shadow of the Regent Campaign Maps (CC0 / Public Domain) ──
	{
		id: "map-sandbox-hub",
		name: "Ground Zero Safehouse",
		category: "map",
		path: "/generated/compendium/sandbox_assets/hub_map.jpg",
		tags: ["sandbox", "hub", "safehouse", "bunker", "campaign"],
		tier: "E",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-subway",
		name: "Ruined Subway Network",
		category: "map",
		path: "/generated/compendium/sandbox_assets/subway_map.jpg",
		tags: ["sandbox", "subway", "underground", "dungeon", "campaign"],
		tier: "D",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-bazaar",
		name: "Lower City Bazaar",
		category: "map",
		path: "/generated/compendium/sandbox_assets/bazaar_map.jpg",
		tags: ["sandbox", "bazaar", "market", "hub", "campaign"],
		tier: "D",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-overgrown",
		name: "Overgrown Botanical Sector",
		category: "map",
		path: "/generated/compendium/sandbox_assets/overgrown_map.jpg",
		tags: ["sandbox", "overgrown", "nature", "rift", "campaign"],
		tier: "C",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-sewer",
		name: "Aetheric Sewer Network",
		category: "map",
		path: "/generated/compendium/sandbox_assets/sewer_map.jpg",
		tags: ["sandbox", "sewer", "underground", "rift", "campaign"],
		tier: "C",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-hospital",
		name: "Abandoned Military Hospital",
		category: "map",
		path: "/generated/compendium/sandbox_assets/hospital_map.jpg",
		tags: ["sandbox", "hospital", "ruins", "campaign"],
		tier: "B",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-downtown",
		name: "Downtown Financial Ruins",
		category: "map",
		path: "/generated/compendium/sandbox_assets/downtown_map.jpg",
		tags: ["sandbox", "downtown", "city", "ruins", "campaign"],
		tier: "B",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-slums",
		name: "Outer Slums Quarantine",
		category: "map",
		path: "/generated/compendium/sandbox_assets/slums_map.jpg",
		tags: ["sandbox", "slums", "quarantine", "urban", "campaign"],
		tier: "A",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-citadel",
		name: "Inner Citadel Approach",
		category: "map",
		path: "/generated/compendium/sandbox_assets/citadel_map.jpg",
		tags: ["sandbox", "citadel", "fortress", "boss", "campaign"],
		tier: "A",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},
	{
		id: "map-sandbox-throne",
		name: "Throne of the Regent",
		category: "map",
		path: "/generated/compendium/sandbox_assets/throne_map.jpg",
		tags: ["sandbox", "throne", "boss", "final", "regent", "campaign"],
		tier: "S",
		format: "webp",
		attribution: "CC0 / Public Domain",
	},

	// ── New SA-Themed Painterly Battle Maps (AI Generated) ──
	{
		id: "map-hunters-guild-tavern",
		name: "Hunter's Guild Tavern",
		category: "map",
		path: "/generated/maps/premade/hunters-guild-tavern.png",
		tags: ["tavern", "guild", "social", "interior", "painterly"],
		format: "png",
	},
	{
		id: "map-rift-touched-forest",
		name: "Rift-Touched Forest",
		category: "map",
		path: "/generated/maps/premade/rift-touched-forest.png",
		tags: ["forest", "rift", "outdoor", "corrupted", "painterly"],
		format: "png",
	},
	{
		id: "map-coastal-gate-breach",
		name: "Coastal Gate Breach",
		category: "map",
		path: "/generated/maps/premade/coastal-gate-breach.png",
		tags: ["coastal", "gate", "outdoor", "sea", "painterly"],
		format: "png",
	},
	{
		id: "map-underground-river-crossing",
		name: "Underground River Crossing",
		category: "map",
		path: "/generated/maps/premade/underground-river-crossing.png",
		tags: ["underground", "river", "cavern", "dungeon", "painterly"],
		format: "png",
	},
	{
		id: "map-shadow-temple-sanctum",
		name: "Shadow Temple Sanctum",
		category: "map",
		path: "/generated/maps/premade/shadow-temple-sanctum.png",
		tags: ["temple", "shadow", "ritual", "interior", "painterly"],
		format: "png",
	},
	{
		id: "map-raider-ship-deck",
		name: "Raider Ship Deck",
		category: "map",
		path: "/generated/maps/premade/raider-ship-deck.png",
		tags: ["ship", "nautical", "deck", "combat", "painterly"],
		format: "png",
	},
	{
		id: "map-gatewatch-marketplace",
		name: "Gatewatch Marketplace",
		category: "map",
		path: "/generated/maps/premade/gatewatch-marketplace.png",
		tags: ["market", "town", "social", "urban", "painterly"],
		format: "png",
	},
	{
		id: "map-rift-corrupted-swamp",
		name: "Rift-Corrupted Swamp",
		category: "map",
		path: "/generated/maps/premade/rift-corrupted-swamp.png",
		tags: ["swamp", "rift", "outdoor", "toxic", "painterly"],
		format: "png",
	},
	{
		id: "map-mountain-gate-pass",
		name: "Mountain Gate Pass",
		category: "map",
		path: "/generated/maps/premade/mountain-gate-pass.png",
		tags: ["mountain", "gate", "outdoor", "pass", "painterly"],
		format: "png",
	},
	{
		id: "map-detention-sector",
		name: "Detention Sector",
		category: "map",
		path: "/generated/maps/premade/detention-sector.png",
		tags: ["prison", "dungeon", "interior", "cells", "painterly"],
		format: "png",
	},
	{
		id: "map-arcane-research-lab",
		name: "Arcane Research Lab",
		category: "map",
		path: "/generated/maps/premade/arcane-research-lab.png",
		tags: ["lab", "arcane", "magic", "interior", "painterly"],
		format: "png",
	},
	{
		id: "map-necropolis-grounds",
		name: "Necropolis Grounds",
		category: "map",
		path: "/generated/maps/premade/necropolis-grounds.png",
		tags: ["graveyard", "undead", "outdoor", "cemetery", "painterly"],
		format: "png",
	},
];

// ─── Token Assets (existing + downloaded) ──────────────────

export const TOKEN_ASSETS: VTTAsset[] = [
	// Player archetypes (existing webp)
	{
		id: "token-player",
		name: "Player (Generic)",
		category: "token",
		path: "/generated/tokens/player-token.webp",
		tags: ["player", "generic", "pc"],
		format: "webp",
	},
	{
		id: "token-boss",
		name: "Boss (Generic)",
		category: "token",
		path: "/generated/tokens/boss-token.webp",
		tags: ["boss", "enemy", "npc"],
		format: "webp",
	},
	{
		id: "token-guard",
		name: "Guard",
		category: "token",
		path: "/generated/tokens/guard-token.webp",
		tags: ["guard", "npc", "friendly"],
		format: "webp",
	},
	{
		id: "token-merchant",
		name: "Merchant",
		category: "token",
		path: "/generated/tokens/merchant-token.webp",
		tags: ["merchant", "npc", "shop"],
		format: "webp",
	},
	{
		id: "token-npc",
		name: "NPC (Generic)",
		category: "token",
		path: "/generated/tokens/npc-token.webp",
		tags: ["npc", "generic", "friendly"],
		format: "webp",
	},
	{
		id: "token-Anomaly",
		name: "Anomaly (Generic)",
		category: "token",
		path: "/generated/tokens/Anomaly-token.webp",
		tags: ["Anomaly", "enemy", "generic"],
		format: "webp",
	},

	// Anomaly tokens (game-icons.net, CC BY 3.0, credit: Lorc/Delapouite)
	{
		id: "token-shadow-follower",
		name: "Shadow Soldier",
		category: "token",
		path: "/generated/tokens/Anomalies/shadow-follower.svg",
		tags: ["shadow", "undead", "soldier", "minion"],
		tier: "E",
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},
	{
		id: "token-magic-beast",
		name: "Magic Beast",
		category: "token",
		path: "/generated/tokens/Anomalies/magic-beast.svg",
		tags: ["beast", "wolf", "magic", "animal"],
		tier: "D",
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},
	{
		id: "token-goblin",
		name: "Goblin",
		category: "token",
		path: "/generated/tokens/Anomalies/goblin.svg",
		tags: ["goblin", "humanoid", "minion"],
		tier: "E",
		format: "svg",
		attribution: "game-icons.net / Delapouite / CC BY 3.0",
	},
	{
		id: "token-orc-warrior",
		name: "Orc Warrior",
		category: "token",
		path: "/generated/tokens/Anomalies/orc-warrior.svg",
		tags: ["orc", "humanoid", "warrior"],
		tier: "D",
		format: "svg",
		attribution: "game-icons.net / Delapouite / CC BY 3.0",
	},
	{
		id: "token-fire-elemental",
		name: "Fire Elemental",
		category: "token",
		path: "/generated/tokens/Anomalies/fire-elemental.svg",
		tags: ["elemental", "fire", "magic"],
		tier: "C",
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},
	{
		id: "token-demon-lord",
		name: "Demon / Gate Boss",
		category: "token",
		path: "/generated/tokens/Anomalies/demon-lord.svg",
		tags: ["demon", "boss", "gate", "final"],
		tier: "S",
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},

	// NPC tokens
	{
		id: "token-archer-npc",
		name: "Archer NPC",
		category: "token",
		path: "/generated/tokens/npcs/archer.svg",
		tags: ["archer", "npc", "ranged", "ascendant"],
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},
	{
		id: "token-mage-npc",
		name: "Mage NPC",
		category: "token",
		path: "/generated/tokens/npcs/mage.svg",
		tags: ["mage", "npc", "caster", "magic"],
		format: "svg",
		attribution: "game-icons.net / Lorc / CC BY 3.0",
	},
];

// ─── Props (20 existing) ────────────────────────────────────

export const PROP_ASSETS: VTTAsset[] = [
	{
		id: "prop-arcane-altar",
		name: "Arcane Altar",
		category: "prop",
		path: "/generated/props/arcane-altar.webp",
		tags: ["altar", "magic", "ritual"],
		format: "webp",
	},
	{
		id: "prop-barrel",
		name: "Barrel",
		category: "prop",
		path: "/generated/props/barrel.webp",
		tags: ["barrel", "storage", "common"],
		format: "webp",
	},
	{
		id: "prop-bedroll",
		name: "Bedroll",
		category: "prop",
		path: "/generated/props/bedroll.webp",
		tags: ["bed", "camp", "rest"],
		format: "webp",
	},
	{
		id: "prop-bookshelf",
		name: "Bookshelf",
		category: "prop",
		path: "/generated/props/bookshelf.webp",
		tags: ["book", "library", "furniture"],
		format: "webp",
	},
	{
		id: "prop-bunk-bed",
		name: "Bunk Bed",
		category: "prop",
		path: "/generated/props/bunk-bed.webp",
		tags: ["bed", "barracks", "furniture"],
		format: "webp",
	},
	{
		id: "prop-crate-stack",
		name: "Crate Stack",
		category: "prop",
		path: "/generated/props/crate-stack.webp",
		tags: ["crate", "storage", "cover"],
		format: "webp",
	},
	{
		id: "prop-crystal-cluster",
		name: "Crystal Cluster",
		category: "prop",
		path: "/generated/props/crystal-cluster.webp",
		tags: ["crystal", "magic", "mana"],
		format: "webp",
	},
	{
		id: "prop-chandelier",
		name: "Hanging Chandelier",
		category: "prop",
		path: "/generated/props/hanging-chandelier.webp",
		tags: ["light", "chandelier", "ceiling"],
		format: "webp",
	},
	{
		id: "prop-obsidian-obelisk",
		name: "Obsidian Obelisk",
		category: "prop",
		path: "/generated/props/obsidian-obelisk.webp",
		tags: ["obelisk", "shadow", "monument"],
		format: "webp",
	},
	{
		id: "prop-rift-portal",
		name: "Rift Gate Portal",
		category: "prop",
		path: "/generated/props/rift-gate-portal.webp",
		tags: ["portal", "gate", "rift", "magic"],
		format: "webp",
	},
	{
		id: "prop-rune-circle",
		name: "Rune Circle",
		category: "prop",
		path: "/generated/props/rune-circle.webp",
		tags: ["rune", "magic", "ritual", "circle"],
		format: "webp",
	},
	{
		id: "prop-shadow-brazier",
		name: "Shadow Brazier",
		category: "prop",
		path: "/generated/props/shadow-brazier.webp",
		tags: ["brazier", "shadow", "fire", "light"],
		format: "webp",
	},
	{
		id: "prop-ritual-table",
		name: "Stone Ritual Table",
		category: "prop",
		path: "/generated/props/stone-ritual-table.webp",
		tags: ["table", "ritual", "stone"],
		format: "webp",
	},
	{
		id: "prop-treasure-cache",
		name: "Treasure Cache",
		category: "prop",
		path: "/generated/props/treasure-cache.webp",
		tags: ["treasure", "loot", "gold"],
		format: "webp",
	},
	{
		id: "prop-weapon-rack",
		name: "Weapon Rack",
		category: "prop",
		path: "/generated/props/weapon-rack.webp",
		tags: ["weapon", "armory", "equipment"],
		format: "webp",
	},
	{
		id: "prop-wooden-bench",
		name: "Wooden Bench",
		category: "prop",
		path: "/generated/props/wooden-bench.webp",
		tags: ["bench", "furniture", "seating"],
		format: "webp",
	},
	{
		id: "prop-wooden-chair",
		name: "Wooden Chair",
		category: "prop",
		path: "/generated/props/wooden-chair.webp",
		tags: ["chair", "furniture", "seating"],
		format: "webp",
	},
	{
		id: "prop-table-rect",
		name: "Wooden Table (Rect)",
		category: "prop",
		path: "/generated/props/wooden-table-rect.webp",
		tags: ["table", "furniture", "rectangular"],
		format: "webp",
	},
	{
		id: "prop-table-round",
		name: "Wooden Table (Round)",
		category: "prop",
		path: "/generated/props/wooden-table-round.webp",
		tags: ["table", "furniture", "round"],
		format: "webp",
	},
	{
		id: "prop-ancient-statue",
		name: "Ancient Statue",
		category: "prop",
		path: "/generated/props/ancient-statue.webp",
		tags: ["statue", "decoration", "ancient"],
		format: "webp",
	},
];

// ─── VFX / Effects (21 existing) ────────────────────────────

export const EFFECT_ASSETS: VTTAsset[] = [
	{
		id: "fx-arcane-glow",
		name: "Arcane Glow",
		category: "effect",
		path: "/generated/effects/arcane-glow.webp",
		tags: ["arcane", "glow", "magic"],
		format: "webp",
	},
	{
		id: "fx-arcane-sigil",
		name: "Arcane Sigil",
		category: "effect",
		path: "/generated/effects/arcane-sigil.webp",
		tags: ["arcane", "sigil", "rune"],
		format: "webp",
	},
	{
		id: "fx-blood-splatter",
		name: "Blood Splatter",
		category: "effect",
		path: "/generated/effects/blood-splatter.webp",
		tags: ["blood", "damage", "combat"],
		format: "webp",
	},
	{
		id: "fx-bright-light",
		name: "Bright Light Halo",
		category: "effect",
		path: "/generated/effects/bright-light-halo.webp",
		tags: ["light", "bright", "vision"],
		format: "webp",
	},
	{
		id: "fx-darkness",
		name: "Darkness Shroud",
		category: "effect",
		path: "/generated/effects/darkness-shroud.webp",
		tags: ["darkness", "shadow", "obscure"],
		format: "webp",
	},
	{
		id: "fx-dim-light",
		name: "Dim Light Halo",
		category: "effect",
		path: "/generated/effects/dim-light-halo.webp",
		tags: ["light", "dim", "vision"],
		format: "webp",
	},
	{
		id: "fx-fire-burst",
		name: "Fire Burst",
		category: "effect",
		path: "/generated/effects/fire-burst.webp",
		tags: ["fire", "explosion", "aoe"],
		format: "webp",
	},
	{
		id: "fx-fog-dense",
		name: "Dense Fog",
		category: "effect",
		path: "/generated/effects/fog-of-war-dense.webp",
		tags: ["fog", "obscure", "dense"],
		format: "webp",
	},
	{
		id: "fx-fog-mist",
		name: "Light Mist",
		category: "effect",
		path: "/generated/effects/fog-of-war-mist.webp",
		tags: ["fog", "mist", "light"],
		format: "webp",
	},
	{
		id: "fx-holy-aura",
		name: "Holy Aura",
		category: "effect",
		path: "/generated/effects/holy-aura.webp",
		tags: ["holy", "aura", "divine"],
		format: "webp",
	},
	{
		id: "fx-ice-blast",
		name: "Ice Blast",
		category: "effect",
		path: "/generated/effects/ice-blast.webp",
		tags: ["ice", "cold", "aoe"],
		format: "webp",
	},
	{
		id: "fx-lantern",
		name: "Lantern Glow",
		category: "effect",
		path: "/generated/effects/lantern-glow.webp",
		tags: ["lantern", "light", "warm"],
		format: "webp",
	},
	{
		id: "fx-lightning",
		name: "Lightning Strike",
		category: "effect",
		path: "/generated/effects/lightning-strike.webp",
		tags: ["lightning", "electric", "storm"],
		format: "webp",
	},
	{
		id: "fx-poison-cloud",
		name: "Poison Cloud",
		category: "effect",
		path: "/generated/effects/poison-cloud.webp",
		tags: ["poison", "cloud", "aoe"],
		format: "webp",
	},
	{
		id: "fx-shadow-pool",
		name: "Shadow Pool",
		category: "effect",
		path: "/generated/effects/shadow-pool.webp",
		tags: ["shadow", "pool", "darkness"],
		format: "webp",
	},
	{
		id: "fx-smoke",
		name: "Smoke Screen",
		category: "effect",
		path: "/generated/effects/smoke-screen.webp",
		tags: ["smoke", "obscure", "cover"],
		format: "webp",
	},
	{
		id: "fx-spotlight",
		name: "Spotlight Cone",
		category: "effect",
		path: "/generated/effects/spotlight-cone.webp",
		tags: ["spotlight", "light", "cone"],
		format: "webp",
	},
	{
		id: "fx-torch",
		name: "Torch Glow",
		category: "effect",
		path: "/generated/effects/torch-glow.webp",
		tags: ["torch", "light", "warm"],
		format: "webp",
	},
	{
		id: "fx-vision-narrow",
		name: "Vision Cone (Narrow)",
		category: "effect",
		path: "/generated/effects/vision-cone-narrow.webp",
		tags: ["vision", "cone", "narrow"],
		format: "webp",
	},
	{
		id: "fx-vision-wide",
		name: "Vision Cone (Wide)",
		category: "effect",
		path: "/generated/effects/vision-cone-wide.webp",
		tags: ["vision", "cone", "wide"],
		format: "webp",
	},
	{
		id: "fx-web-trap",
		name: "Web Trap",
		category: "effect",
		path: "/generated/effects/web-trap.webp",
		tags: ["web", "trap", "restrain"],
		format: "webp",
	},
];

// ─── Free Audio Streams (no download needed) ────────────────
// These reference free external streams from Tabletop Audio (CC BY-NC 4.0)
// and can be played directly via the Howler.js audio system.

export const AUDIO_ASSETS: VTTAsset[] = [
	// Tabletop Audio free ambient tracks (streaming)
	{
		id: "audio-campfire",
		name: "Campfire",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/campfire.mp3",
		tags: ["campfire", "fire", "rest", "camp"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-rain",
		name: "Gentle Rain",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/rain.mp3",
		tags: ["rain", "weather", "outdoor", "calm"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-thunderstorm",
		name: "Thunderstorm",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/stormycrossing.mp3",
		tags: ["thunder", "storm", "rain", "weather"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-wind",
		name: "Wind",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/wind.mp3",
		tags: ["wind", "weather", "outdoor"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-tavern",
		name: "Busy Tavern",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/busytavern.mp3",
		tags: ["tavern", "crowd", "social", "inn"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-dungeon",
		name: "Dungeon Depths",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/dungeon.mp3",
		tags: ["dungeon", "underground", "dark", "drip"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-forest",
		name: "Dark Forest",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/darkforest.mp3",
		tags: ["forest", "nature", "outdoor", "birds"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-cave",
		name: "Underground Cave",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/cavernoftheundead.mp3",
		tags: ["cave", "underground", "drip", "echo"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-combat",
		name: "Combat Music",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/battlewizard.mp3",
		tags: ["combat", "battle", "fighting", "intense"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-boss-fight",
		name: "Boss Fight",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/thefinalconfrontation.mp3",
		tags: ["boss", "fight", "epic", "final"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-city",
		name: "City Streets",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/citystreet.mp3",
		tags: ["city", "urban", "traffic", "modern"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-marketplace",
		name: "Marketplace",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/bazaar.mp3",
		tags: ["market", "bazaar", "trading", "social"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-ocean",
		name: "Ocean Waves",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/ocean.mp3",
		tags: ["ocean", "waves", "water", "coast"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-swamp",
		name: "Haunted Swamp",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/swamp.mp3",
		tags: ["swamp", "marsh", "creepy", "outdoor"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-crypt",
		name: "Dark Crypt",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/crypt.mp3",
		tags: ["crypt", "undead", "dark", "dungeon"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
	{
		id: "audio-library",
		name: "Ancient Library",
		category: "audio",
		path: "https://sounds.tabletopaudio.com/library.mp3",
		tags: ["library", "study", "quiet", "arcane"],
		format: "stream",
		attribution: "Tabletop Audio / CC BY-NC 4.0",
	},
];

// ─── Downloaded CC0 Music Tracks (local, no external dependency) ────
// All tracks are CC0 / Public Domain from OpenGameArt.org.
// Served from /audio/music/ — no streaming, no external requests.

export const MUSIC_ASSETS: VTTAsset[] = [
	{
		id: "music-dark-cavern-1",
		name: "Dark Cavern Ambient (Fade)",
		category: "music",
		path: "/audio/music/dark-cavern-ambient-1.ogg",
		tags: ["dungeon", "cave", "dark", "ambient", "horror"],
		format: "ogg",
		attribution: "Paul Wortmann / CC0",
	},
	{
		id: "music-dark-cavern-2",
		name: "Dark Cavern Ambient (Loop)",
		category: "music",
		path: "/audio/music/dark-cavern-ambient-2.ogg",
		tags: ["dungeon", "cave", "dark", "ambient", "loop"],
		format: "ogg",
		attribution: "Paul Wortmann / CC0",
	},
	{
		id: "music-town-theme",
		name: "Town Theme RPG",
		category: "music",
		path: "/audio/music/town-theme-rpg.mp3",
		tags: ["town", "peaceful", "harp", "tavern", "social"],
		format: "mp3",
		attribution: "cynicmusic / CC0",
	},
	{
		id: "music-cold-silence",
		name: "Cold Silence",
		category: "music",
		path: "/audio/music/cold-silence.ogg",
		tags: ["horror", "dark", "unsettling", "ambient", "scary"],
		format: "ogg",
		attribution: "Eponasoft / CC0",
	},
	{
		id: "music-bleeding-out",
		name: "Bleeding Out",
		category: "music",
		path: "/audio/music/bleeding-out.ogg",
		tags: ["sad", "dark", "ambient", "violin", "loss", "death"],
		format: "ogg",
		attribution: "HaelDB / CC0",
	},
	{
		id: "music-dungeon-ambience",
		name: "Dungeon Ambience",
		category: "music",
		path: "/audio/music/dungeon-ambience.ogg",
		tags: ["dungeon", "ambient", "dark", "exploration"],
		format: "ogg",
		attribution: "yd / CC0",
	},
	// ── Tracks present in /public/audio/music/ that were previously unregistered ──
	{
		id: "music-epic-combat",
		name: "Epic Combat",
		category: "music",
		path: "/audio/music/epic-combat.ogg",
		tags: ["combat", "battle", "epic", "action"],
		format: "ogg",
		attribution: "CC0",
	},
	{
		id: "music-tavern-ambience",
		name: "Tavern Ambience",
		category: "music",
		path: "/audio/music/tavern-ambience.ogg",
		tags: ["tavern", "social", "ambient", "crowd"],
		format: "ogg",
		attribution: "CC0",
	},

	// ── Shadow of the Regent Campaign Audio (CC0 / SoundHelix) ──
	{
		id: "music-sandbox-bunker",
		name: "Bunker Ambience (Sandbox)",
		category: "music",
		path: "/generated/compendium/sandbox_assets/ambient_bunker.mp3",
		tags: ["bunker", "ambient", "hub", "sandbox", "campaign"],
		format: "mp3",
		attribution: "SoundHelix / CC0",
	},
	{
		id: "music-sandbox-subway",
		name: "Subway Wind Ambient (Sandbox)",
		category: "music",
		path: "/generated/compendium/sandbox_assets/ambient_subway.mp3",
		tags: ["subway", "wind", "underground", "sandbox", "campaign"],
		format: "mp3",
		attribution: "SoundHelix / CC0",
	},
	{
		id: "music-sandbox-combat",
		name: "Combat Action Track (Sandbox)",
		category: "music",
		path: "/generated/compendium/sandbox_assets/ambient_combat.mp3",
		tags: ["combat", "action", "battle", "sandbox", "campaign"],
		format: "mp3",
		attribution: "SoundHelix / CC0",
	},
	{
		id: "music-sandbox-boss",
		name: "Boss Fight Music (Sandbox)",
		category: "music",
		path: "/generated/compendium/sandbox_assets/ambient_boss.mp3",
		tags: ["boss", "fight", "epic", "final", "sandbox", "campaign"],
		format: "mp3",
		attribution: "SoundHelix / CC0",
	},
	{
		id: "music-sandbox-explore",
		name: "Exploration Track (Sandbox)",
		category: "music",
		path: "/generated/compendium/sandbox_assets/ambient_explore.mp3",
		tags: ["exploration", "ambient", "calm", "sandbox", "campaign"],
		format: "mp3",
		attribution: "SoundHelix / CC0",
	},
];

// ─── Helpers ─────────────────────────────────────────────────

/** Get all assets of a given category */
export function getAssetsByCategory(category: AssetCategory): VTTAsset[] {
	return ALL_ASSETS.filter((a) => a.category === category);
}

/** Search assets by tag */
export function searchAssets(query: string): VTTAsset[] {
	const q = query.toLowerCase().trim();
	return ALL_ASSETS.filter(
		(a) =>
			a.name.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q)),
	);
}

/** Get assets filtered by SA rank tier */
export function getAssetsByTier(tier: VTTAsset["tier"]): VTTAsset[] {
	return ALL_ASSETS.filter((a) => a.tier === tier);
}

/** Get all maps suitable for a given rank tier */
export function getMapsForTier(tier: VTTAsset["tier"]): VTTAsset[] {
	return MAP_ASSETS.filter((a) => a.tier === tier);
}

/** Get Anomaly tokens filtered by tier */
export function getAnomalyTokensForTier(tier: VTTAsset["tier"]): VTTAsset[] {
	return TOKEN_ASSETS.filter(
		(a) =>
			(a.tier === tier && a.tags.includes("Anomaly")) ||
			a.tags.includes("enemy"),
	);
}

/** Master list of all assets */
export const ALL_ASSETS: VTTAsset[] = [
	...MAP_ASSETS,
	...TOKEN_ASSETS,
	...PROP_ASSETS,
	...EFFECT_ASSETS,
	...AUDIO_ASSETS,
	...MUSIC_ASSETS,
];

/** Asset count summary for Warden (Warden) dashboard */
export function getAssetSummary(): Record<AssetCategory, number> {
	const summary = {} as Record<AssetCategory, number>;
	for (const asset of ALL_ASSETS) {
		summary[asset.category] = (summary[asset.category] || 0) + 1;
	}
	return summary;
}
