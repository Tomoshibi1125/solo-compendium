// VTT Asset Library — Catalogs ALL existing generated images for browsable VTT usage
// All images are project-owned assets in /public/generated/
// Total: 400+ images across all Roll20-equivalent categories

import { REGENT_PORTRAITS_DATA } from "@/data/compendium/regentPortraits";
import {
	getStaticAnomalies,
	getStaticItems,
	getStaticLocations,
	getStaticSpells,
} from "@/lib/ProtocolDataManager";

export type VTTAssetCategory =
	| "map"
	| "Anomaly"
	| "portrait"
	| "location"
	| "effect"
	| "spell"
	| "prop"
	| "condition"
	| "item"
	| "token"
	| "handout"
	| "technique"
	| "environment"
	| "weapon"
	| "armor"
	| "creature"
	| "npc"
	| "building"
	| "vehicle"
	| "nature"
	| "elemental"
	| "divine"
	| "shadow"
	| "cosmic"
	| "mechanical"
	| "magical";

export interface VTTAsset {
	id: string;
	name: string;
	category: VTTAssetCategory;
	imageUrl: string;
	thumbnailUrl?: string;
	tags: string[];
	rank?: string;
	description?: string | null;
	isCustom?: boolean;
	uploadedBy?: string;
	uploadedAt?: string;
	storagePath?: string;
}

// ── Premade Battle Maps ──────────────────────────────────────────────────
const PREMADE_MAPS: VTTAsset[] = [
	{
		id: "map-arcane-schematic",
		name: "Arcane Schematic",
		category: "map",
		imageUrl: "/generated/maps/premade/arcane-schematic.webp",
		thumbnailUrl: "/generated/maps/premade/arcane-schematic-thumb.webp",
		tags: ["arcane", "schematic", "blueprint", "dungeon"],
	},
	{
		id: "map-ascendant-capital",
		name: "Ascendant Capital",
		category: "map",
		imageUrl: "/generated/maps/premade/ascendant-capital.webp",
		thumbnailUrl: "/generated/maps/premade/ascendant-capital-thumb.webp",
		tags: ["city", "capital", "urban", "ascendant"],
	},
	{
		id: "map-ashen-forge-depths",
		name: "Ashen Forge Depths",
		category: "map",
		imageUrl: "/generated/maps/premade/ashen-forge-depths.webp",
		thumbnailUrl: "/generated/maps/premade/ashen-forge-depths-thumb.webp",
		tags: ["forge", "fire", "dungeon", "depths"],
	},
	{
		id: "map-ashen-forge",
		name: "Ashen Forge",
		category: "map",
		imageUrl: "/generated/maps/premade/ashen-forge.webp",
		thumbnailUrl: "/generated/maps/premade/ashen-forge-thumb.webp",
		tags: ["forge", "fire", "dungeon"],
	},
	{
		id: "map-crystal-caverns",
		name: "Crystal Caverns",
		category: "map",
		imageUrl: "/generated/maps/premade/crystal-caverns.webp",
		thumbnailUrl: "/generated/maps/premade/crystal-caverns-thumb.webp",
		tags: ["cave", "crystal", "cavern", "underground"],
	},
	{
		id: "map-frostbound-depths",
		name: "Frostbound Depths",
		category: "map",
		imageUrl: "/generated/maps/premade/frostbound-depths.webp",
		thumbnailUrl: "/generated/maps/premade/frostbound-depths-thumb.webp",
		tags: ["ice", "frost", "dungeon", "depths"],
	},
	{
		id: "map-frostbound-vault",
		name: "Frostbound Vault",
		category: "map",
		imageUrl: "/generated/maps/premade/frostbound-vault.webp",
		thumbnailUrl: "/generated/maps/premade/frostbound-vault-thumb.webp",
		tags: ["ice", "frost", "vault", "dungeon"],
	},
	{
		id: "map-gate-antechamber",
		name: "Gate Antechamber",
		category: "map",
		imageUrl: "/generated/maps/premade/gate-antechamber.webp",
		thumbnailUrl: "/generated/maps/premade/gate-antechamber-thumb.webp",
		tags: ["gate", "rift", "portal", "dungeon"],
	},
	{
		id: "map-gatewatch-town",
		name: "Gatewatch Town",
		category: "map",
		imageUrl: "/generated/maps/premade/gatewatch-town.webp",
		thumbnailUrl: "/generated/maps/premade/gatewatch-town-thumb.webp",
		tags: ["town", "urban", "gate", "settlement"],
	},
	{
		id: "map-inkwash-ruins",
		name: "Inkwash Ruins",
		category: "map",
		imageUrl: "/generated/maps/premade/inkwash-ruins.webp",
		thumbnailUrl: "/generated/maps/premade/inkwash-ruins-thumb.webp",
		tags: ["ruins", "ancient", "ink", "dungeon"],
	},
	{
		id: "map-rank-e-outpost",
		name: "Rank-E Outpost",
		category: "map",
		imageUrl: "/generated/maps/premade/rank-e-outpost.webp",
		thumbnailUrl: "/generated/maps/premade/rank-e-outpost-thumb.webp",
		tags: ["outpost", "e-rank", "camp", "starter"],
	},
	{
		id: "map-rank-s-abyss",
		name: "Rank-S Abyss",
		category: "map",
		imageUrl: "/generated/maps/premade/rank-s-abyss.webp",
		thumbnailUrl: "/generated/maps/premade/rank-s-abyss-thumb.webp",
		tags: ["abyss", "s-rank", "endgame", "boss"],
	},
	{
		id: "map-rift-citadel",
		name: "Rift Citadel",
		category: "map",
		imageUrl: "/generated/maps/premade/rift-citadel.webp",
		thumbnailUrl: "/generated/maps/premade/rift-citadel-thumb.webp",
		tags: ["rift", "citadel", "fortress", "boss"],
	},
	{
		id: "map-rift-keep",
		name: "Rift Keep",
		category: "map",
		imageUrl: "/generated/maps/premade/rift-keep.webp",
		thumbnailUrl: "/generated/maps/premade/rift-keep-thumb.webp",
		tags: ["rift", "keep", "fortress", "dungeon"],
	},
	{
		id: "map-rift-shrine",
		name: "Rift Shrine",
		category: "map",
		imageUrl: "/generated/maps/premade/rift-shrine.webp",
		thumbnailUrl: "/generated/maps/premade/rift-shrine-thumb.webp",
		tags: ["rift", "shrine", "sacred", "dungeon"],
	},
	{
		id: "map-sandswept-ruins",
		name: "Sandswept Ruins",
		category: "map",
		imageUrl: "/generated/maps/premade/sandswept-ruins.webp",
		thumbnailUrl: "/generated/maps/premade/sandswept-ruins-thumb.webp",
		tags: ["desert", "sand", "ruins", "ancient"],
	},
	{
		id: "map-sealed-vault",
		name: "Sealed Vault",
		category: "map",
		imageUrl: "/generated/maps/premade/sealed-vault.webp",
		thumbnailUrl: "/generated/maps/premade/sealed-vault-thumb.webp",
		tags: ["vault", "sealed", "dungeon", "treasure"],
	},
	{
		id: "map-shadow-crypt",
		name: "Shadow Crypt",
		category: "map",
		imageUrl: "/generated/maps/premade/shadow-crypt.webp",
		thumbnailUrl: "/generated/maps/premade/shadow-crypt-thumb.webp",
		tags: ["shadow", "crypt", "undead", "dungeon"],
	},
	{
		id: "map-shadow-labyrinth",
		name: "Shadow Labyrinth",
		category: "map",
		imageUrl: "/generated/maps/premade/shadow-labyrinth.webp",
		thumbnailUrl: "/generated/maps/premade/shadow-labyrinth-thumb.webp",
		tags: ["shadow", "labyrinth", "maze", "dungeon"],
	},
	{
		id: "map-umbral-throne",
		name: "Umbral Throne",
		category: "map",
		imageUrl: "/generated/maps/premade/umbral-throne.webp",
		thumbnailUrl: "/generated/maps/premade/umbral-throne-thumb.webp",
		tags: ["umbral", "throne", "boss", "endgame"],
	},
	{
		id: "map-veil-garden",
		name: "Veil Garden",
		category: "map",
		imageUrl: "/generated/maps/premade/veil-garden.webp",
		thumbnailUrl: "/generated/maps/premade/veil-garden-thumb.webp",
		tags: ["garden", "veil", "nature", "fey"],
	},
	{
		id: "map-dungeon-floor",
		name: "Dungeon Floor (Tile)",
		category: "map",
		imageUrl: "/generated/maps/dungeon-floor.webp",
		tags: ["dungeon", "floor", "tile", "generic"],
	},
	{
		id: "map-iron-gate",
		name: "Iron Gate (Tile)",
		category: "map",
		imageUrl: "/generated/maps/iron-gate.webp",
		tags: ["gate", "iron", "tile", "entrance"],
	},
	// ── New SA-Themed Painterly Battle Maps ──
	{
		id: "map-hunters-guild-tavern",
		name: "Hunter's Guild Tavern",
		category: "map",
		imageUrl: "/generated/maps/premade/hunters-guild-tavern.png",
		tags: ["tavern", "guild", "social", "interior"],
	},
	{
		id: "map-rift-touched-forest",
		name: "Rift-Touched Forest",
		category: "map",
		imageUrl: "/generated/maps/premade/rift-touched-forest.png",
		tags: ["forest", "rift", "outdoor", "corrupted"],
	},
	{
		id: "map-coastal-gate-breach",
		name: "Coastal Gate Breach",
		category: "map",
		imageUrl: "/generated/maps/premade/coastal-gate-breach.png",
		tags: ["coastal", "gate", "outdoor", "sea"],
	},
	{
		id: "map-underground-river-crossing",
		name: "Underground River Crossing",
		category: "map",
		imageUrl: "/generated/maps/premade/underground-river-crossing.png",
		tags: ["underground", "river", "cavern", "dungeon"],
	},
	{
		id: "map-shadow-temple-sanctum",
		name: "Shadow Temple Sanctum",
		category: "map",
		imageUrl: "/generated/maps/premade/shadow-temple-sanctum.png",
		tags: ["temple", "shadow", "ritual", "interior"],
	},
	{
		id: "map-raider-ship-deck",
		name: "Raider Ship Deck",
		category: "map",
		imageUrl: "/generated/maps/premade/raider-ship-deck.png",
		tags: ["ship", "nautical", "deck", "combat"],
	},
	{
		id: "map-gatewatch-marketplace",
		name: "Gatewatch Marketplace",
		category: "map",
		imageUrl: "/generated/maps/premade/gatewatch-marketplace.png",
		tags: ["market", "town", "social", "urban"],
	},
	{
		id: "map-rift-corrupted-swamp",
		name: "Rift-Corrupted Swamp",
		category: "map",
		imageUrl: "/generated/maps/premade/rift-corrupted-swamp.png",
		tags: ["swamp", "rift", "outdoor", "toxic"],
	},
	{
		id: "map-mountain-gate-pass",
		name: "Mountain Gate Pass",
		category: "map",
		imageUrl: "/generated/maps/premade/mountain-gate-pass.png",
		tags: ["mountain", "gate", "outdoor", "pass"],
	},
	{
		id: "map-detention-sector",
		name: "Detention Sector",
		category: "map",
		imageUrl: "/generated/maps/premade/detention-sector.png",
		tags: ["prison", "dungeon", "interior", "cells"],
	},
	{
		id: "map-arcane-research-lab",
		name: "Arcane Research Lab",
		category: "map",
		imageUrl: "/generated/maps/premade/arcane-research-lab.png",
		tags: ["lab", "arcane", "magic", "interior"],
	},
	{
		id: "map-necropolis-grounds",
		name: "Necropolis Grounds",
		category: "map",
		imageUrl: "/generated/maps/premade/necropolis-grounds.png",
		tags: ["graveyard", "undead", "outdoor", "cemetery"],
	},
];

// ── Effects ──────────────────────────────────────────────────────────────
const EFFECTS: VTTAsset[] = [
	{
		id: "fx-arcane-glow",
		name: "Arcane Glow",
		category: "effect",
		imageUrl: "/generated/effects/arcane-glow.webp",
		tags: ["arcane", "glow", "light", "magic"],
	},
	{
		id: "fx-arcane-sigil",
		name: "Arcane Sigil",
		category: "effect",
		imageUrl: "/generated/effects/arcane-sigil.webp",
		tags: ["arcane", "sigil", "rune", "magic"],
	},
	{
		id: "fx-blood-splatter",
		name: "Blood Splatter",
		category: "effect",
		imageUrl: "/generated/effects/blood-splatter.webp",
		tags: ["blood", "damage", "gore"],
	},
	{
		id: "fx-bright-light",
		name: "Bright Light Halo",
		category: "effect",
		imageUrl: "/generated/effects/bright-light-halo.webp",
		tags: ["light", "bright", "halo", "holy"],
	},
	{
		id: "fx-darkness",
		name: "Darkness Shroud",
		category: "effect",
		imageUrl: "/generated/effects/darkness-shroud.webp",
		tags: ["darkness", "shadow", "shroud"],
	},
	{
		id: "fx-dim-light",
		name: "Dim Light Halo",
		category: "effect",
		imageUrl: "/generated/effects/dim-light-halo.webp",
		tags: ["light", "dim", "halo"],
	},
	{
		id: "fx-fire-burst",
		name: "Fire Burst",
		category: "effect",
		imageUrl: "/generated/effects/fire-burst.webp",
		tags: ["fire", "burst", "explosion"],
	},
	{
		id: "fx-fog-dense",
		name: "Dense Fog",
		category: "effect",
		imageUrl: "/generated/effects/fog-of-war-dense.webp",
		tags: ["fog", "dense", "obscure"],
	},
	{
		id: "fx-fog-mist",
		name: "Mist",
		category: "effect",
		imageUrl: "/generated/effects/fog-of-war-mist.webp",
		tags: ["fog", "mist", "light"],
	},
	{
		id: "fx-holy-aura",
		name: "Holy Aura",
		category: "effect",
		imageUrl: "/generated/effects/holy-aura.webp",
		tags: ["holy", "aura", "divine", "light"],
	},
	{
		id: "fx-ice-blast",
		name: "Ice Blast",
		category: "effect",
		imageUrl: "/generated/effects/ice-blast.webp",
		tags: ["ice", "frost", "blast", "cold"],
	},
	{
		id: "fx-lantern",
		name: "Lantern Glow",
		category: "effect",
		imageUrl: "/generated/effects/lantern-glow.webp",
		tags: ["lantern", "light", "warm"],
	},
	{
		id: "fx-lightning",
		name: "Lightning Strike",
		category: "effect",
		imageUrl: "/generated/effects/lightning-strike.webp",
		tags: ["lightning", "electric", "strike"],
	},
	{
		id: "fx-poison",
		name: "Poison Cloud",
		category: "effect",
		imageUrl: "/generated/effects/poison-cloud.webp",
		tags: ["poison", "cloud", "toxic"],
	},
	{
		id: "fx-shadow-pool",
		name: "Shadow Pool",
		category: "effect",
		imageUrl: "/generated/effects/shadow-pool.webp",
		tags: ["shadow", "pool", "dark", "umbral"],
	},
	{
		id: "fx-smoke",
		name: "Smoke Screen",
		category: "effect",
		imageUrl: "/generated/effects/smoke-screen.webp",
		tags: ["smoke", "screen", "obscure"],
	},
	{
		id: "fx-spotlight",
		name: "Spotlight Cone",
		category: "effect",
		imageUrl: "/generated/effects/spotlight-cone.webp",
		tags: ["spotlight", "cone", "light"],
	},
	{
		id: "fx-torch",
		name: "Torch Glow",
		category: "effect",
		imageUrl: "/generated/effects/torch-glow.webp",
		tags: ["torch", "light", "warm", "fire"],
	},
	{
		id: "fx-vision-narrow",
		name: "Vision Cone (Narrow)",
		category: "effect",
		imageUrl: "/generated/effects/vision-cone-narrow.webp",
		tags: ["vision", "cone", "narrow", "stealth"],
	},
	{
		id: "fx-vision-wide",
		name: "Vision Cone (Wide)",
		category: "effect",
		imageUrl: "/generated/effects/vision-cone-wide.webp",
		tags: ["vision", "cone", "wide"],
	},
	{
		id: "fx-web",
		name: "Web Trap",
		category: "effect",
		imageUrl: "/generated/effects/web-trap.webp",
		tags: ["web", "trap", "spider"],
	},
];

// ── Props ────────────────────────────────────────────────────────────────
const PROPS: VTTAsset[] = [
	{
		id: "prop-ancient-statue",
		name: "Ancient Statue",
		category: "prop",
		imageUrl: "/generated/props/ancient-statue.webp",
		tags: ["statue", "ancient", "decoration"],
	},
	{
		id: "prop-arcane-altar",
		name: "Arcane Altar",
		category: "prop",
		imageUrl: "/generated/props/arcane-altar.webp",
		tags: ["altar", "arcane", "ritual", "magic"],
	},
	{
		id: "prop-barrel",
		name: "Barrel",
		category: "prop",
		imageUrl: "/generated/props/barrel.webp",
		tags: ["barrel", "container", "storage"],
	},
	{
		id: "prop-bedroll",
		name: "Bedroll",
		category: "prop",
		imageUrl: "/generated/props/bedroll.webp",
		tags: ["bed", "camp", "rest"],
	},
	{
		id: "prop-bookshelf",
		name: "Bookshelf",
		category: "prop",
		imageUrl: "/generated/props/bookshelf.webp",
		tags: ["books", "shelf", "library"],
	},
	{
		id: "prop-bunk-bed",
		name: "Bunk Bed",
		category: "prop",
		imageUrl: "/generated/props/bunk-bed.webp",
		tags: ["bed", "bunk", "barracks"],
	},
	{
		id: "prop-crate-stack",
		name: "Crate Stack",
		category: "prop",
		imageUrl: "/generated/props/crate-stack.webp",
		tags: ["crate", "storage", "container"],
	},
	{
		id: "prop-crystal-cluster",
		name: "Crystal Cluster",
		category: "prop",
		imageUrl: "/generated/props/crystal-cluster.webp",
		tags: ["crystal", "gem", "treasure", "magic"],
	},
	{
		id: "prop-chandelier",
		name: "Hanging Chandelier",
		category: "prop",
		imageUrl: "/generated/props/hanging-chandelier.webp",
		tags: ["chandelier", "light", "ceiling"],
	},
	{
		id: "prop-obsidian-obelisk",
		name: "Obsidian Obelisk",
		category: "prop",
		imageUrl: "/generated/props/obsidian-obelisk.webp",
		tags: ["obelisk", "obsidian", "umbral", "dark"],
	},
	{
		id: "prop-rift-gate",
		name: "Rift Gate Portal",
		category: "prop",
		imageUrl: "/generated/props/rift-gate-portal.webp",
		tags: ["rift", "gate", "portal", "entrance"],
	},
	{
		id: "prop-rune-circle",
		name: "Rune Circle",
		category: "prop",
		imageUrl: "/generated/props/rune-circle.webp",
		tags: ["rune", "circle", "ritual", "magic"],
	},
	{
		id: "prop-shadow-brazier",
		name: "Shadow Brazier",
		category: "prop",
		imageUrl: "/generated/props/shadow-brazier.webp",
		tags: ["brazier", "fire", "shadow", "light"],
	},
	{
		id: "prop-ritual-table",
		name: "Stone Ritual Table",
		category: "prop",
		imageUrl: "/generated/props/stone-ritual-table.webp",
		tags: ["table", "stone", "ritual"],
	},
	{
		id: "prop-treasure-cache",
		name: "Treasure Cache",
		category: "prop",
		imageUrl: "/generated/props/treasure-cache.webp",
		tags: ["treasure", "loot", "gold"],
	},
	{
		id: "prop-weapon-rack",
		name: "Weapon Rack",
		category: "prop",
		imageUrl: "/generated/props/weapon-rack.webp",
		tags: ["weapon", "rack", "armory"],
	},
	{
		id: "prop-bench",
		name: "Wooden Bench",
		category: "prop",
		imageUrl: "/generated/props/wooden-bench.webp",
		tags: ["bench", "furniture", "wood"],
	},
	{
		id: "prop-chair",
		name: "Wooden Chair",
		category: "prop",
		imageUrl: "/generated/props/wooden-chair.webp",
		tags: ["chair", "furniture", "wood"],
	},
	{
		id: "prop-table-rect",
		name: "Wooden Table (Rect)",
		category: "prop",
		imageUrl: "/generated/props/wooden-table-rect.webp",
		tags: ["table", "furniture", "wood"],
	},
	{
		id: "prop-table-round",
		name: "Wooden Table (Round)",
		category: "prop",
		imageUrl: "/generated/props/wooden-table-round.webp",
		tags: ["table", "furniture", "wood", "round"],
	},
];

// ── Conditions ───────────────────────────────────────────────────────────
const CONDITIONS: VTTAsset[] = [
	{
		id: "cond-essence-drained",
		name: "Essence Drained",
		category: "condition",
		imageUrl: "/generated/conditions/essence-drained.webp",
		tags: ["condition", "drain", "debuff"],
	},
	{
		id: "cond-gate-exhausted",
		name: "Gate Exhausted",
		category: "condition",
		imageUrl: "/generated/conditions/gate-exhausted.webp",
		tags: ["condition", "exhausted", "gate"],
	},
	{
		id: "cond-regent-marked",
		name: "Regent Marked",
		category: "condition",
		imageUrl: "/generated/conditions/regent-marked.webp",
		tags: ["condition", "regent", "mark"],
	},
	{
		id: "cond-shadow-bound",
		name: "Shadow Bound",
		category: "condition",
		imageUrl: "/generated/conditions/shadow-bound.webp",
		tags: ["condition", "shadow", "bound", "restrained"],
	},
	{
		id: "cond-shadow-corrupted",
		name: "Shadow Corrupted",
		category: "condition",
		imageUrl: "/generated/conditions/shadow-corrupted.webp",
		tags: ["condition", "shadow", "corrupt"],
	},
	{
		id: "cond-shadow-fused",
		name: "Shadow Fused",
		category: "condition",
		imageUrl: "/generated/conditions/shadow-fused.webp",
		tags: ["condition", "shadow", "fused", "transform"],
	},
];

// ── Items ────────────────────────────────────────────────────────────────
const ITEMS: VTTAsset[] = [
	{
		id: "item-health-potion",
		name: "Health Potion",
		category: "item",
		imageUrl: "/generated/items/health-potion.webp",
		tags: ["potion", "health", "healing"],
	},
	{
		id: "item-mana-potion",
		name: "Mana Potion",
		category: "item",
		imageUrl: "/generated/items/mana-potion.webp",
		tags: ["potion", "mana", "magic"],
	},
	{
		id: "item-shadow-armor",
		name: "Shadow Armor",
		category: "item",
		imageUrl: "/generated/items/shadow-armor.webp",
		tags: ["armor", "shadow", "equipment"],
	},
	{
		id: "item-shadow-blade",
		name: "Shadow Blade",
		category: "item",
		imageUrl: "/generated/items/shadow-blade.webp",
		tags: ["weapon", "shadow", "blade"],
	},
	{
		id: "item-shadow-ring",
		name: "Shadow Ring",
		category: "item",
		imageUrl: "/generated/items/shadow-ring.webp",
		tags: ["ring", "shadow", "accessory"],
	},
	{
		id: "item-shadow-scroll",
		name: "Shadow Scroll",
		category: "item",
		imageUrl: "/generated/items/shadow-scroll.webp",
		tags: ["scroll", "shadow", "spell"],
	},
];

// ── Token Templates ──────────────────────────────────────────────────────
const TOKEN_TEMPLATES: VTTAsset[] = [
	{
		id: "tpl-boss",
		name: "Boss Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/boss-token.webp",
		tags: ["token", "boss", "frame"],
	},
	{
		id: "tpl-guard",
		name: "Guard Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/guard-token.webp",
		tags: ["token", "guard", "npc", "frame"],
	},
	{
		id: "tpl-merchant",
		name: "Merchant Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/merchant-token.webp",
		tags: ["token", "merchant", "npc", "frame"],
	},
	{
		id: "tpl-Anomaly",
		name: "Anomaly Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/Anomaly-token.webp",
		tags: ["token", "Anomaly", "frame"],
	},
	{
		id: "tpl-npc",
		name: "NPC Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/npc-token.webp",
		tags: ["token", "npc", "frame"],
	},
	{
		id: "tpl-player",
		name: "Player Token Frame",
		category: "token",
		imageUrl: "/generated/tokens/player-token.webp",
		tags: ["token", "player", "character", "frame"],
	},
];

// ── Anomaly Portraits (from compendium) ──────────────────────────────────
export function getAnomalyVTTAssets(): VTTAsset[] {
	return getStaticAnomalies().map((m) => ({
		id: `vtt-${m.id}`,
		name: m.name,
		category: "Anomaly" as VTTAssetCategory,
		imageUrl: m.image ?? "",
		tags: [
			"Anomaly",
			(m.rank || "").toLowerCase(),
			(m.type || "").toLowerCase(),
		].filter(Boolean),
		rank: m.rank ?? undefined,
		description: m.description ?? undefined,
	}));
}

// ── Location Portraits (from compendium — usable as scene art) ───────────
export function getLocationVTTAssets(): VTTAsset[] {
	return getStaticLocations().map((l) => ({
		id: `vtt-${l.id}`,
		name: l.name,
		category: "location" as VTTAssetCategory,
		imageUrl: l.image ?? "",
		tags: [
			"location",
			(l.rank || "").toLowerCase(),
			(l.type || "").toLowerCase(),
		].filter(Boolean),
		rank: l.rank ?? undefined,
		description: l.description ?? undefined,
	}));
}

// ── Portraits — Regents (boss NPC tokens) ───────────────────────────────
const toTitleCase = (s: string) =>
	s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const REGENT_PORTRAITS: VTTAsset[] = REGENT_PORTRAITS_DATA.map(
	({ regentId, name, imageUrl, tags }) => ({
		id: `portrait-${regentId.replace(/_/g, "-")}`,
		name,
		category: "portrait" as VTTAssetCategory,
		imageUrl,
		tags: Array.from(new Set(["portrait", "regent", "boss", "npc", ...tags])),
	}),
);

// ── Portraits — Jobs (class/archetype tokens) ───────────────────────────
// Maps image filenames to SA job display names (files on disk keep original names)
const JOB_PORTRAIT_MAP: { file: string; display: string }[] = [
	{ file: "artificer", display: "Technomancer" },
	{ file: "assassin", display: "Assassin" },
	{ file: "bard", display: "Resonant" },
	{ file: "berserker", display: "Berserker" },
	{ file: "healer", display: "Herald" },
	{ file: "mage", display: "Mage" },
	{ file: "monk", display: "Striker" },
	{ file: "necromancer", display: "Revenant" },
	{ file: "paladin", display: "Holy Knight" },
	{ file: "ranger", display: "Stalker" },
	{ file: "summoner", display: "Summoner" },
	{ file: "tank", display: "Destroyer" },
	{ file: "warlock", display: "Contractor" },
	{ file: "warrior", display: "Esper" },
];
export const JOB_PORTRAITS: VTTAsset[] = JOB_PORTRAIT_MAP.map(
	({ file, display }) => ({
		id: `portrait-job-${file}`,
		name: display,
		category: "portrait" as VTTAssetCategory,
		imageUrl: `/generated/compendium/jobs/${file}.webp`,
		tags: ["portrait", "job", "ascendant", "player", display.toLowerCase()],
	}),
);

// ── Portraits — Backgrounds (character archetype tokens) ─────────────────
export const BACKGROUND_PORTRAITS: VTTAsset[] = [
	"ancient-guardian",
	"artifact-keeper",
	"bringer-of-dawn",
	"champion-of-light",
	"cosmic-wanderer",
	"demon-hunter",
	"dimensional-traveler",
	"dragon-slayer",
	"essence-user",
	"eternal-watcher",
	"forgotten-king",
	"gate-survivor",
	"guild-master",
	"hunter-academy-graduate",
	"monarchs-chosen",
	"reality-bender",
	"rune-master",
	"shadow-realm-exile",
	"shadow-soldier",
	"star-born",
	"time-walker",
	"void-touched",
].map((fileName) => ({
	id: `portrait-bg-${fileName}`,
	name: toTitleCase(fileName),
	category: "portrait" as VTTAssetCategory,
	imageUrl: `/generated/compendium/backgrounds/${fileName}.webp`,
	tags: ["portrait", "background", "character", fileName.split("-")[0]],
}));

// ── Spell Effects (from compendium — usable as spell overlays) ───────────
export function getSpellVTTAssets(): VTTAsset[] {
	return getStaticSpells().map((s) => ({
		id: `vtt-${s.id}`,
		name: s.name,
		category: "spell" as VTTAssetCategory,
		imageUrl: s.image ?? "",
		tags: [
			"spell",
			(s.type || "").toLowerCase(),
			(s.rank || "").toLowerCase(),
		].filter(Boolean),
		rank: s.rank ?? undefined,
		description: s.description ?? undefined,
	}));
}

export function getCompendiumItemVTTAssets(): VTTAsset[] {
	return getStaticItems().map((i) => ({
		id: `vtt-${i.id}`,
		name: i.name,
		category: "item" as VTTAssetCategory,
		imageUrl: i.image ?? "",
		tags: [
			"item",
			(i.rarity || "").toLowerCase(),
			(i.type || "").toLowerCase(),
		].filter(Boolean),
		rank: i.rarity ?? undefined,
		description: i.description,
	}));
}

// ── Artifacts (legendary item handout art) ───────────────────────────────
const ARTIFACT_ITEMS: VTTAsset[] = [
	"chaos-heart",
	"destiny-book",
	"divine-crown",
	"dragon-god-spear",
	"eternal-heart",
	"infinity-orb",
	"regent-gauntlets",
	"order-crystal",
	"reality-weaver",
	"shadow-lord-blade",
	"soul-harvester",
	"time-master-staff",
	"void-armor",
	"world-tree-acorn",
].map((fileName) => ({
	id: `artifact-${fileName}`,
	name: toTitleCase(fileName),
	category: "handout" as VTTAssetCategory,
	imageUrl: `/generated/compendium/artifacts/${fileName}.webp`,
	tags: ["artifact", "legendary", "handout", fileName.split("-")[0]],
}));

// ── Relics (magic item handout art) ──────────────────────────────────────
const RELIC_ITEMS: VTTAsset[] = [
	"amulet-of-health",
	"amulet-of-life-draining",
	"amulet-of-proof-against-detection",
	"amulet-of-the-forsaken",
	"bag-of-holding",
	"boots-of-levitation",
	"boots-of-speed",
	"boots-of-striding-and-springing",
	"boots-of-winter-wolf",
	"bracers-of-archery",
	"bracers-of-defense",
	"bracers-of-agility",
	"bracers-of-mountaineering",
	"bracers-of-weapon-throwing",
	"chime-of-opening",
	"circlet-of-sense",
	"cloak-of-displacement",
	"cloak-of-elvenkind",
	"cloak-of-protection",
	"cloak-of-the-bat",
	"cloak-of-the-manta-ray",
	"cloak-of-the-manta-ray-2",
	"crystal-of-clairvoyance",
	"decanter-of-endless-water",
	"dragonscale-helmet",
	"efficient-quiver",
	"eyes-of-minute-seeing",
	"eyes-of-the-eagle",
	"gauntlets-of-ogre-power",
	"gauntlets-of-the-sky",
	"giants-belt",
	"girdle-of-giant-strength",
	"gloves-of-swimming-and-climbing",
	"gloves-of-thievery",
	"goggles-of-night",
	"handy-haversack",
	"headband-of-intellect",
	"helm-of-brilliance",
	"helm-of-comprehending-languages",
	"helm-of-telepathy",
].map((name) => ({
	id: `relic-${name}`,
	name: toTitleCase(name),
	category: "handout" as VTTAssetCategory,
	imageUrl: `/generated/compendium/relics/${name}.webp`,
	tags: ["relic", "magic-item", "handout", name.split("-")[0]],
}));

// ── Powers (ability effect overlays) ─────────────────────────────────────
const POWER_EFFECTS: VTTAsset[] = [
	"angelic-wings",
	"arcane-ascension",
	"arcane-recovery",
	"avatar-of-battle",
	"demonic-aura",
	"divine-intervention",
	"divine-smite",
	"dragon-breath",
	"dwarven-resilience",
	"fey-charm",
	"gaze-of-petrification",
	"halfling-luck",
	"holy-aura",
	"invisibility",
	"ki-point",
	"lycanthropy",
	"orcish-rage",
	"regeneration",
	"shadow-essence",
	"shadow-step",
	"sneak-attack",
	"telepathy",
	"true-sight",
	"vampiric-touch",
	"wild-shape",
].map((name) => ({
	id: `power-${name}`,
	name: toTitleCase(name),
	category: "effect" as VTTAssetCategory,
	imageUrl: `/generated/compendium/powers/${name}.webp`,
	tags: ["effect", "power", "ability", name.split("-")[0]],
}));

// ── Runes (rune effect overlays) ─────────────────────────────────────────
const RUNE_EFFECTS: VTTAsset[] = [
	"assassin-rune",
	"blood-rune",
	"death-rune",
	"fire-rune",
	"frost-rune",
	"guardian-rune",
	"healing-rune",
	"ice-rune",
	"life-rune",
	"lightning-rune",
	"magma-rune",
	"mind-rune",
	"protection-rune",
	"shadow-rune",
	"soul-rune",
	"storm-rune",
	"time-rune",
	"void-rune",
	"war-rune",
].map((name) => ({
	id: `rune-${name}`,
	name: toTitleCase(name),
	category: "effect" as VTTAssetCategory,
	imageUrl: `/generated/runes/${name}.webp`,
	tags: ["effect", "rune", "overlay", name.split("-")[0]],
}));

// ── Techniques (combat technique art — usable as spell/ability overlays) ──
const TECHNIQUE_ASSETS: VTTAsset[] = [
	"arcane-overload",
	"counter-strike",
	"deflect-arrows",
	"disarming-strike",
	"divine-execution",
	"dragon-fist",
	"dragon-slaying-blow",
	"grappling-strike",
	"guardian-stance",
	"intimidating-presence",
	"iron-wall",
	"leap-strike",
	"multi-shot",
	"phase-walk",
	"shadow-bind",
	"shadow-dodge",
	"shadow-step-mobility",
	"shadow-strike",
	"shadow-termination",
	"trip-attack",
	"void-annihilation",
	"void-slash",
	"wall-run",
	"whirlwind-strike",
	"wind-dash",
].map((name) => ({
	id: `technique-${name}`,
	name: toTitleCase(name),
	category: "technique" as VTTAssetCategory,
	imageUrl: `/generated/compendium/techniques/${name}.webp`,
	tags: ["technique", "combat", "ability", name.split("-")[0]],
}));

// ── Compendium Runes (rune inscription art — usable as handout/effect art) ──
const COMPENDIUM_RUNE_ASSETS: VTTAsset[] = [
	"rune-of-balance",
	"rune-of-blood",
	"rune-of-chaos",
	"rune-of-creation",
	"rune-of-darkness",
	"rune-of-death",
	"rune-of-despair",
	"rune-of-destruction",
	"rune-of-dreams",
	"rune-of-earth",
	"rune-of-exhaustion",
	"rune-of-fate",
	"rune-of-flames",
	"rune-of-frost",
	"rune-of-hope",
	"rune-of-ignorance",
	"rune-of-knowledge",
	"rune-of-life",
	"rune-of-light",
	"rune-of-mind",
	"rune-of-order",
	"rune-of-soul",
	"rune-of-space",
	"rune-of-the-storm",
	"rune-of-the-void",
	"rune-of-time",
	"rune-of-vitality",
	"rune-of-winds",
].map((name) => ({
	id: `comp-rune-${name}`,
	name: toTitleCase(name),
	category: "handout" as VTTAssetCategory,
	imageUrl: `/generated/compendium/runes/${name}.webp`,
	tags: [
		"rune",
		"inscription",
		"handout",
		"magic",
		name.replace("rune-of-", "").split("-")[0],
	],
}));

// ── Standalone Spell Effects (visual effect overlays) ─────────────────────
const STANDALONE_SPELL_EFFECTS: VTTAsset[] = [
	"fireball",
	"healing-light",
	"ice-shard",
	"lightning-strike",
	"protection-barrier",
	"shadow-bolt",
].map((name) => ({
	id: `spell-fx-${name}`,
	name: toTitleCase(name),
	category: "effect" as VTTAssetCategory,
	imageUrl: `/generated/spells/${name}.webp`,
	tags: ["effect", "spell", "overlay", name.split("-")[0]],
}));

// ── Environment Assets (Weather, Nature, Terrain) ───────────────────────
const ENVIRONMENT_ASSETS: VTTAsset[] = [
	{
		id: "env-sunny-day",
		name: "Sunny Day",
		category: "environment",
		imageUrl: "/generated/environments/sunny-day.webp",
		tags: ["weather", "sun", "clear", "day"],
	},
	{
		id: "env-rain-storm",
		name: "Rain Storm",
		category: "environment",
		imageUrl: "/generated/environments/rain-storm.webp",
		tags: ["weather", "rain", "storm", "wet"],
	},
	{
		id: "env-snow-fall",
		name: "Snow Fall",
		category: "environment",
		imageUrl: "/generated/environments/snow-fall.webp",
		tags: ["weather", "snow", "winter", "cold"],
	},
	{
		id: "env-fog-morning",
		name: "Morning Fog",
		category: "environment",
		imageUrl: "/generated/environments/fog-morning.webp",
		tags: ["weather", "fog", "morning", "mist"],
	},
	{
		id: "env-lightning-storm",
		name: "Lightning Storm",
		category: "environment",
		imageUrl: "/generated/environments/lightning-storm.webp",
		tags: ["weather", "lightning", "storm", "dramatic"],
	},
	{
		id: "env-autumn-forest",
		name: "Autumn Forest",
		category: "environment",
		imageUrl: "/generated/environments/autumn-forest.webp",
		tags: ["nature", "forest", "autumn", "trees"],
	},
	{
		id: "env-spring-meadow",
		name: "Spring Meadow",
		category: "environment",
		imageUrl: "/generated/environments/spring-meadow.webp",
		tags: ["nature", "meadow", "spring", "flowers"],
	},
	{
		id: "env-desert-dunes",
		name: "Desert Dunes",
		category: "environment",
		imageUrl: "/generated/environments/desert-dunes.webp",
		tags: ["terrain", "desert", "sand", "dunes"],
	},
	{
		id: "env-mountain-peak",
		name: "Mountain Peak",
		category: "environment",
		imageUrl: "/generated/environments/mountain-peak.webp",
		tags: ["terrain", "mountain", "snow", "peak"],
	},
	{
		id: "env-volcano-eruption",
		name: "Volcano Eruption",
		category: "environment",
		imageUrl: "/generated/environments/volcano-eruption.webp",
		tags: ["terrain", "volcano", "lava", "fire"],
	},
];

// ── Weapon Assets (Swords, Axes, Bows, etc.) ───────────────────────────────
const WEAPON_ASSETS: VTTAsset[] = [
	{
		id: "weapon-longsword",
		name: "Longsword",
		category: "weapon",
		imageUrl: "/generated/weapons/longsword.webp",
		tags: ["sword", "melee", "steel", "martial"],
	},
	{
		id: "weapon-battle-axe",
		name: "Battle Axe",
		category: "weapon",
		imageUrl: "/generated/weapons/battle-axe.webp",
		tags: ["axe", "melee", "heavy", "brutal"],
	},
	{
		id: "warpon-warhammer",
		name: "Warhammer",
		category: "weapon",
		imageUrl: "/generated/weapons/warhammer.webp",
		tags: ["hammer", "melee", "blunt", "heavy"],
	},
	{
		id: "weapon-dagger",
		name: "Dagger",
		category: "weapon",
		imageUrl: "/generated/weapons/dagger.webp",
		tags: ["dagger", "melee", "light", "stealth"],
	},
	{
		id: "weapon-bow-long",
		name: "Longbow",
		category: "weapon",
		imageUrl: "/generated/weapons/longbow.webp",
		tags: ["bow", "ranged", "wood", "archery"],
	},
	{
		id: "weapon-crossbow-heavy",
		name: "Heavy Crossbow",
		category: "weapon",
		imageUrl: "/generated/weapons/heavy-crossbow.webp",
		tags: ["crossbow", "ranged", "mechanical", "powerful"],
	},
	{
		id: "weapon-staff-magic",
		name: "Magic Staff",
		category: "weapon",
		imageUrl: "/generated/weapons/magic-staff.webp",
		tags: ["staff", "melee", "magic", "arcane"],
	},
	{
		id: "weapon-wand-simple",
		name: "Simple Wand",
		category: "weapon",
		imageUrl: "/generated/weapons/simple-wand.webp",
		tags: ["wand", "melee", "magic", "light"],
	},
	{
		id: "weapon-spear-wood",
		name: "Wooden Spear",
		category: "weapon",
		imageUrl: "/generated/weapons/wooden-spear.webp",
		tags: ["spear", "melee", "wood", "primitive"],
	},
	{
		id: "weapon-mace-heavy",
		name: "Heavy Mace",
		category: "weapon",
		imageUrl: "/generated/weapons/heavy-mace.webp",
		tags: ["mace", "melee", "blunt", "crushing"],
	},
];

// ── Armor Assets (Helmets, Chestplates, Shields) ───────────────────────────
const ARMOR_ASSETS: VTTAsset[] = [
	{
		id: "armor-helmet-steel",
		name: "Steel Helmet",
		category: "armor",
		imageUrl: "/generated/armor/steel-helmet.webp",
		tags: ["helmet", "head", "steel", "protection"],
	},
	{
		id: "armor-chestplate-iron",
		name: "Iron Chestplate",
		category: "armor",
		imageUrl: "/generated/armor/iron-chestplate.webp",
		tags: ["chestplate", "torso", "iron", "heavy"],
	},
	{
		id: "armor-shield-wood",
		name: "Wooden Shield",
		category: "armor",
		imageUrl: "/generated/armor/wooden-shield.webp",
		tags: ["shield", "defense", "wood", "light"],
	},
	{
		id: "armor-shield-steel",
		name: "Steel Shield",
		category: "armor",
		imageUrl: "/generated/armor/steel-shield.webp",
		tags: ["shield", "defense", "steel", "heavy"],
	},
	{
		id: "armor-boots-leather",
		name: "Leather Boots",
		category: "armor",
		imageUrl: "/generated/armor/leather-boots.webp",
		tags: ["boots", "feet", "leather", "light"],
	},
	{
		id: "armor-gauntlets-iron",
		name: "Iron Gauntlets",
		category: "armor",
		imageUrl: "/generated/armor/iron-gauntlets.webp",
		tags: ["gauntlets", "hands", "iron", "protective"],
	},
	{
		id: "armor-cloak-leather",
		name: "Leather Cloak",
		category: "armor",
		imageUrl: "/generated/armor/leather-cloak.webp",
		tags: ["cloak", "body", "leather", "light"],
	},
	{
		id: "armor-robe-mage",
		name: "Mage Robe",
		category: "armor",
		imageUrl: "/generated/armor/mage-robe.webp",
		tags: ["robe", "body", "cloth", "magical"],
	},
];

// ── Creature Assets (Animals, Beasts, Mounts) ──────────────────────────────
const CREATURE_ASSETS: VTTAsset[] = [
	{
		id: "creature-wolf-grey",
		name: "Grey Wolf",
		category: "creature",
		imageUrl: "/generated/creatures/grey-wolf.webp",
		tags: ["wolf", "animal", "predator", "pack"],
	},
	{
		id: "creature-bear-brown",
		name: "Brown Bear",
		category: "creature",
		imageUrl: "/generated/creatures/brown-bear.webp",
		tags: ["bear", "animal", "powerful", "wild"],
	},
	{
		id: "creature-eagle-golden",
		name: "Golden Eagle",
		category: "creature",
		imageUrl: "/generated/creatures/golden-eagle.webp",
		tags: ["eagle", "bird", "majestic", "flying"],
	},
	{
		id: "creature-horse-war",
		name: "War Horse",
		category: "creature",
		imageUrl: "/generated/creatures/war-horse.webp",
		tags: ["horse", "mount", "war", "strong"],
	},
	{
		id: "creature-lion-male",
		name: "Male Lion",
		category: "creature",
		imageUrl: "/generated/creatures/male-lion.webp",
		tags: ["lion", "animal", "predator", "king"],
	},
	{
		id: "creature-tiger-siberian",
		name: "Siberian Tiger",
		category: "creature",
		imageUrl: "/generated/creatures/siberian-tiger.webp",
		tags: ["tiger", "animal", "predator", "striped"],
	},
	{
		id: "creature-dragon-red",
		name: "Red Dragon",
		category: "creature",
		imageUrl: "/generated/creatures/red-dragon.webp",
		tags: ["dragon", "mythical", "fire", "powerful"],
	},
	{
		id: "creature-phoenix-fire",
		name: "Fire Phoenix",
		category: "creature",
		imageUrl: "/generated/creatures/fire-phoenix.webp",
		tags: ["phoenix", "mythical", "fire", "rebirth"],
	},
];

// ── NPC Assets (Commoners, Merchants, Guards) ──────────────────────────────
const NPC_ASSETS: VTTAsset[] = [
	{
		id: "npc-farmer-male",
		name: "Male Farmer",
		category: "npc",
		imageUrl: "/generated/npcs/male-farmer.webp",
		tags: ["farmer", "commoner", "male", "rural"],
	},
	{
		id: "npc-merchant-female",
		name: "Female Merchant",
		category: "npc",
		imageUrl: "/generated/npcs/female-merchant.webp",
		tags: ["merchant", "trader", "female", "wealthy"],
	},
	{
		id: "npc-guard-city",
		name: "City Guard",
		category: "npc",
		imageUrl: "/generated/npcs/city-guard.webp",
		tags: ["guard", "soldier", "law", "city"],
	},
	{
		id: "npc-innkeeper-male",
		name: "Male Innkeeper",
		category: "npc",
		imageUrl: "/generated/npcs/male-innkeeper.webp",
		tags: ["innkeeper", "tavern", "male", "hospitality"],
	},
	{
		id: "npc-blacksmith-female",
		name: "Female Blacksmith",
		category: "npc",
		imageUrl: "/generated/npcs/female-blacksmith.webp",
		tags: ["blacksmith", "craft", "female", "strong"],
	},
	{
		id: "npc-scholar-elderly",
		name: "Elderly Scholar",
		category: "npc",
		imageUrl: "/generated/npcs/elderly-scholar.webp",
		tags: ["scholar", "wise", "elderly", "knowledge"],
	},
	{
		id: "npc-child-village",
		name: "Village Child",
		category: "npc",
		imageUrl: "/generated/npcs/village-child.webp",
		tags: ["child", "innocent", "village", "young"],
	},
	{
		id: "npc-noble-lord",
		name: "Noble Lord",
		category: "npc",
		imageUrl: "/generated/npcs/noble-lord.webp",
		tags: ["noble", "lord", "wealthy", "aristocrat"],
	},
];

// ── Building Assets (Houses, Towers, Structures) ───────────────────────────
const BUILDING_ASSETS: VTTAsset[] = [
	{
		id: "building-cottage-wood",
		name: "Wooden Cottage",
		category: "building",
		imageUrl: "/generated/buildings/wooden-cottage.webp",
		tags: ["cottage", "house", "wood", "rural"],
	},
	{
		id: "building-tower-watch",
		name: "Watch Tower",
		category: "building",
		imageUrl: "/generated/buildings/watch-tower.webp",
		tags: ["tower", "military", "stone", "tall"],
	},
	{
		id: "building-church-stone",
		name: "Stone Church",
		category: "building",
		imageUrl: "/generated/buildings/stone-church.webp",
		tags: ["church", "religious", "stone", "sacred"],
	},
	{
		id: "building-mill-wind",
		name: "Windmill",
		category: "building",
		imageUrl: "/generated/buildings/windmill.webp",
		tags: ["mill", "industrial", "wood", "mechanical"],
	},
	{
		id: "building-bridge-stone",
		name: "Stone Bridge",
		category: "building",
		imageUrl: "/generated/buildings/stone-bridge.webp",
		tags: ["bridge", "structure", "stone", "crossing"],
	},
	{
		id: "building-farm-barn",
		name: "Farm Barn",
		category: "building",
		imageUrl: "/generated/buildings/farm-barn.webp",
		tags: ["barn", "farm", "wood", "agricultural"],
	},
	{
		id: "building-castle-ruins",
		name: "Castle Ruins",
		category: "building",
		imageUrl: "/generated/buildings/castle-ruins.webp",
		tags: ["ruins", "castle", "ancient", "destroyed"],
	},
	{
		id: "building-lighthouse-coastal",
		name: "Coastal Lighthouse",
		category: "building",
		imageUrl: "/generated/buildings/coastal-lighthouse.webp",
		tags: ["lighthouse", "coastal", "stone", "guiding"],
	},
];

// ── Vehicle Assets (Ships, Carts, Flying Machines) ─────────────────────────
const VEHICLE_ASSETS: VTTAsset[] = [
	{
		id: "vehicle-ship-sailing",
		name: "Sailing Ship",
		category: "vehicle",
		imageUrl: "/generated/vehicles/sailing-ship.webp",
		tags: ["ship", "sea", "wood", "transport"],
	},
	{
		id: "vehicle-cart-merchant",
		name: "Merchant Cart",
		category: "vehicle",
		imageUrl: "/generated/vehicles/merchant-cart.webp",
		tags: ["cart", "land", "wood", "trade"],
	},
	{
		id: "vehicle-carriage-royal",
		name: "Royal Carriage",
		category: "vehicle",
		imageUrl: "/generated/vehicles/royal-carriage.webp",
		tags: ["carriage", "land", "luxury", "noble"],
	},
	{
		id: "vehicle-boat-fishing",
		name: "Fishing Boat",
		category: "vehicle",
		imageUrl: "/generated/vehicles/fishing-boat.webp",
		tags: ["boat", "sea", "small", "fishing"],
	},
	{
		id: "vehicle-balloon-hotair",
		name: "Hot Air Balloon",
		category: "vehicle",
		imageUrl: "/generated/vehicles/hot-air-balloon.webp",
		tags: ["balloon", "air", "colorful", "flight"],
	},
	{
		id: "vehicle-raft-simple",
		name: "Simple Raft",
		category: "vehicle",
		imageUrl: "/generated/vehicles/simple-raft.webp",
		tags: ["raft", "water", "basic", "makeshift"],
	},
];

// ── Elemental Assets (Fire, Water, Earth, Air) ──────────────────────────────
const ELEMENTAL_ASSETS: VTTAsset[] = [
	{
		id: "elemental-fire-spirit",
		name: "Fire Spirit",
		category: "elemental",
		imageUrl: "/generated/elementals/fire-spirit.webp",
		tags: ["fire", "elemental", "spirit", "flame"],
	},
	{
		id: "elemental-water-nymph",
		name: "Water Nymph",
		category: "elemental",
		imageUrl: "/generated/elementals/water-nymph.webp",
		tags: ["water", "elemental", "nymph", "flowing"],
	},
	{
		id: "elemental-earth-golem",
		name: "Earth Golem",
		category: "elemental",
		imageUrl: "/generated/elementals/earth-golem.webp",
		tags: ["earth", "elemental", "golem", "stone"],
	},
	{
		id: "elemental-air-sylph",
		name: "Air Sylph",
		category: "elemental",
		imageUrl: "/generated/elementals/air-sylph.webp",
		tags: ["air", "elemental", "sylph", "wind"],
	},
	{
		id: "elemental-lightning-bolt",
		name: "Lightning Bolt",
		category: "elemental",
		imageUrl: "/generated/elementals/lightning-bolt.webp",
		tags: ["lightning", "elemental", "electric", "energy"],
	},
	{
		id: "elemental-ice-shard",
		name: "Ice Shard",
		category: "elemental",
		imageUrl: "/generated/elementals/ice-shard.webp",
		tags: ["ice", "elemental", "cold", "sharp"],
	},
];

// ── Divine Assets (Angels, Holy Symbols, Divine Light) ─────────────────────
const DIVINE_ASSETS: VTTAsset[] = [
	{
		id: "divine-angel-warrior",
		name: "Warrior Angel",
		category: "divine",
		imageUrl: "/generated/divine/warrior-angel.webp",
		tags: ["angel", "divine", "warrior", "holy"],
	},
	{
		id: "divine-cherub-small",
		name: "Cherub",
		category: "divine",
		imageUrl: "/generated/divine/cherub.webp",
		tags: ["cherub", "divine", "small", "innocent"],
	},
	{
		id: "divine-halo-golden",
		name: "Golden Halo",
		category: "divine",
		imageUrl: "/generated/divine/golden-halo.webp",
		tags: ["halo", "divine", "light", "holy"],
	},
	{
		id: "divine-cross-silver",
		name: "Silver Cross",
		category: "divine",
		imageUrl: "/generated/divine/silver-cross.webp",
		tags: ["cross", "divine", "silver", "symbol"],
	},
	{
		id: "divine-light-beam",
		name: "Divine Light Beam",
		category: "divine",
		imageUrl: "/generated/divine/light-beam.webp",
		tags: ["light", "divine", "beam", "heavenly"],
	},
	{
		id: "divine-dove-white",
		name: "White Dove",
		category: "divine",
		imageUrl: "/generated/divine/white-dove.webp",
		tags: ["dove", "divine", "peace", "white"],
	},
];

// ── Shadow Assets (Dark Creatures, Shadow Effects) ───────────────────────
const SHADOW_ASSETS: VTTAsset[] = [
	{
		id: "shadow-demon-horned",
		name: "Horned Shadow Demon",
		category: "shadow",
		imageUrl: "/generated/shadow/horned-shadow-demon.webp",
		tags: ["demon", "shadow", "horned", "evil"],
	},
	{
		id: "shadow-wraith-cloaked",
		name: "Cloaked Wraith",
		category: "shadow",
		imageUrl: "/generated/shadow/cloaked-wraith.webp",
		tags: ["wraith", "shadow", "cloaked", "undead"],
	},
	{
		id: "shadow-void-portal",
		name: "Void Portal",
		category: "shadow",
		imageUrl: "/generated/shadow/void-portal.webp",
		tags: ["portal", "void", "shadow", "gateway"],
	},
	{
		id: "shadow-tentacle-dark",
		name: "Dark Tentacle",
		category: "shadow",
		imageUrl: "/generated/shadow/dark-tentacle.webp",
		tags: ["tentacle", "shadow", "Anomaly", "reaching"],
	},
	{
		id: "shadow-creature-formless",
		name: "Formless Shadow",
		category: "shadow",
		imageUrl: "/generated/shadow/formless-shadow.webp",
		tags: ["shadow", "formless", "creature", "amorphous"],
	},
];

// ── Cosmic Assets (Stars, Planets, Celestial Bodies) ───────────────────────
const COSMIC_ASSETS: VTTAsset[] = [
	{
		id: "cosmic-moon-full",
		name: "Full Moon",
		category: "cosmic",
		imageUrl: "/generated/cosmic/full-moon.webp",
		tags: ["moon", "cosmic", "night", "celestial"],
	},
	{
		id: "cosmic-sun-rising",
		name: "Rising Sun",
		category: "cosmic",
		imageUrl: "/generated/cosmic/rising-sun.webp",
		tags: ["sun", "cosmic", "dawn", "light"],
	},
	{
		id: "cosmic-stars-cluster",
		name: "Star Cluster",
		category: "cosmic",
		imageUrl: "/generated/cosmic/star-cluster.webp",
		tags: ["stars", "cosmic", "cluster", "space"],
	},
	{
		id: "cosmic-nebula-purple",
		name: "Purple Nebula",
		category: "cosmic",
		imageUrl: "/generated/cosmic/purple-nebula.webp",
		tags: ["nebula", "cosmic", "purple", "colorful"],
	},
	{
		id: "cosmic-comet-tail",
		name: "Comet with Tail",
		category: "cosmic",
		imageUrl: "/generated/cosmic/comet-tail.webp",
		tags: ["comet", "cosmic", "tail", "flying"],
	},
	{
		id: "cosmic-planet-rings",
		name: "Ringed Planet",
		category: "cosmic",
		imageUrl: "/generated/cosmic/ringed-planet.webp",
		tags: ["planet", "cosmic", "rings", "saturn"],
	},
];

// ── Mechanical Assets (Gears, Clockwork, Machines) ───────────────────────
const MECHANICAL_ASSETS: VTTAsset[] = [
	{
		id: "mechanical-gear-brass",
		name: "Brass Gear",
		category: "mechanical",
		imageUrl: "/generated/mechanical/brass-gear.webp",
		tags: ["gear", "mechanical", "brass", "clockwork"],
	},
	{
		id: "mechanical-automaton-bronze",
		name: "Bronze Automaton",
		category: "mechanical",
		imageUrl: "/generated/mechanical/bronze-automaton.webp",
		tags: ["automaton", "mechanical", "bronze", "robot"],
	},
	{
		id: "mechanical-clock-tower",
		name: "Clock Tower",
		category: "mechanical",
		imageUrl: "/generated/mechanical/clock-tower.webp",
		tags: ["tower", "mechanical", "clock", "time"],
	},
	{
		id: "mechanical-piston-steam",
		name: "Steam Piston",
		category: "mechanical",
		imageUrl: "/generated/mechanical/steam-piston.webp",
		tags: ["piston", "mechanical", "steam", "power"],
	},
	{
		id: "mechanical-cog-wheel",
		name: "Cog Wheel",
		category: "mechanical",
		imageUrl: "/generated/mechanical/cog-wheel.webp",
		tags: ["wheel", "mechanical", "cog", "machine"],
	},
];

// ── Magical Assets (Scrolls, Potions, Magical Items) ───────────────────────
const MAGICAL_ASSETS: VTTAsset[] = [
	{
		id: "magical-scroll-ancient",
		name: "Ancient Scroll",
		category: "magical",
		imageUrl: "/generated/magical/ancient-scroll.webp",
		tags: ["scroll", "magical", "ancient", "knowledge"],
	},
	{
		id: "magical-potion-glowing",
		name: "Glowing Potion",
		category: "magical",
		imageUrl: "/generated/magical/glowing-potion.webp",
		tags: ["potion", "magical", "glowing", "liquid"],
	},
	{
		id: "magical-crystal-focusing",
		name: "Focusing Crystal",
		category: "magical",
		imageUrl: "/generated/magical/focusing-crystal.webp",
		tags: ["crystal", "magical", "focus", "power"],
	},
	{
		id: "magical-orb-mystical",
		name: "Mystical Orb",
		category: "magical",
		imageUrl: "/generated/magical/mystical-orb.webp",
		tags: ["orb", "magical", "mystical", "sphere"],
	},
	{
		id: "magical-rune-circle",
		name: "Rune Circle",
		category: "magical",
		imageUrl: "/generated/magical/rune-circle.webp",
		tags: ["runes", "magical", "circle", "ritual"],
	},
	{
		id: "magical-wand-enchanted",
		name: "Enchanted Wand",
		category: "magical",
		imageUrl: "/generated/magical/enchanted-wand.webp",
		tags: ["wand", "magical", "enchanted", "focus"],
	},
];

// ── Combined Library ─────────────────────────────────────────────────────
export function getVTTAssetLibrary(): VTTAsset[] {
	return [
		...PREMADE_MAPS,
		...getAnomalyVTTAssets(),
		...getLocationVTTAssets(),
		...REGENT_PORTRAITS,
		...JOB_PORTRAITS,
		...BACKGROUND_PORTRAITS,
		...getSpellVTTAssets(),
		...EFFECTS,
		...POWER_EFFECTS,
		...RUNE_EFFECTS,
		...PROPS,
		...CONDITIONS,
		...getCompendiumItemVTTAssets(),
		...ARTIFACT_ITEMS,
		...RELIC_ITEMS,
		...TECHNIQUE_ASSETS,
		...COMPENDIUM_RUNE_ASSETS,
		...STANDALONE_SPELL_EFFECTS,
		...ITEMS,
		...TOKEN_TEMPLATES,
		// New comprehensive categories
		...ENVIRONMENT_ASSETS,
		...WEAPON_ASSETS,
		...ARMOR_ASSETS,
		...CREATURE_ASSETS,
		...NPC_ASSETS,
		...BUILDING_ASSETS,
		...VEHICLE_ASSETS,
		...ELEMENTAL_ASSETS,
		...DIVINE_ASSETS,
		...SHADOW_ASSETS,
		...COSMIC_ASSETS,
		...MECHANICAL_ASSETS,
		...MAGICAL_ASSETS,
	];
}

export function getVTTAssetCategories() {
	return [
		{ id: "map", label: "Battle Maps", count: PREMADE_MAPS.length },
		{ id: "Anomaly", label: "Anomalies", count: getAnomalyVTTAssets().length },
		{
			id: "portrait",
			label: "Portraits",
			count:
				REGENT_PORTRAITS.length +
				JOB_PORTRAITS.length +
				BACKGROUND_PORTRAITS.length,
		},
		{
			id: "location",
			label: "Locations",
			count: getLocationVTTAssets().length,
		},
		{ id: "spell", label: "Spells", count: getSpellVTTAssets().length },
		{
			id: "effect",
			label: "Effects",
			count:
				EFFECTS.length +
				POWER_EFFECTS.length +
				RUNE_EFFECTS.length +
				STANDALONE_SPELL_EFFECTS.length,
		},
		{ id: "prop", label: "Props", count: PROPS.length },
		{
			id: "item",
			label: "Items",
			count: getCompendiumItemVTTAssets().length + ITEMS.length,
		},
		{
			id: "handout",
			label: "Handouts",
			count:
				ARTIFACT_ITEMS.length +
				RELIC_ITEMS.length +
				COMPENDIUM_RUNE_ASSETS.length,
		},
		{ id: "technique", label: "Techniques", count: TECHNIQUE_ASSETS.length },
		{ id: "condition", label: "Conditions", count: CONDITIONS.length },
		{ id: "token", label: "Token Frames", count: TOKEN_TEMPLATES.length },
		// New comprehensive categories
		{
			id: "environment",
			label: "Environments",
			count: ENVIRONMENT_ASSETS.length,
		},
		{ id: "weapon", label: "Weapons", count: WEAPON_ASSETS.length },
		{ id: "armor", label: "Armor", count: ARMOR_ASSETS.length },
		{ id: "creature", label: "Creatures", count: CREATURE_ASSETS.length },
		{ id: "npc", label: "NPCs", count: NPC_ASSETS.length },
		{ id: "building", label: "Buildings", count: BUILDING_ASSETS.length },
		{ id: "vehicle", label: "Vehicles", count: VEHICLE_ASSETS.length },
		{ id: "elemental", label: "Elementals", count: ELEMENTAL_ASSETS.length },
		{ id: "divine", label: "Divine", count: DIVINE_ASSETS.length },
		{ id: "shadow", label: "Shadow", count: SHADOW_ASSETS.length },
		{ id: "cosmic", label: "Cosmic", count: COSMIC_ASSETS.length },
		{ id: "mechanical", label: "Mechanical", count: MECHANICAL_ASSETS.length },
		{ id: "magical", label: "Magical", count: MAGICAL_ASSETS.length },
	] as { id: VTTAssetCategory; label: string; count: number }[];
}

export function searchAssets(
	query: string,
	category?: VTTAssetCategory,
): VTTAsset[] {
	const q = query.toLowerCase().trim();
	let results = getVTTAssetLibrary();
	if (category) {
		results = results.filter((a) => a.category === category);
	}
	if (!q) return results;
	return results.filter(
		(a) =>
			a.name.toLowerCase().includes(q) ||
			a.tags.some((t) => t.includes(q)) ||
			(a.rank && a.rank.toLowerCase() === q) ||
			a.description?.toLowerCase().includes(q),
	);
}
