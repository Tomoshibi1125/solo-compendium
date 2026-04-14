export type PremadeMapTheme = "umbral" | "frost" | "ember" | "verdant";

export interface PremadeMapGrid {
	width: number;
	height: number;
	size: number;
}

export interface PremadeMap {
	id: string;
	name: string;
	description: string;
	path: string;
	thumbnail: string;
	grid: PremadeMapGrid;
	theme: PremadeMapTheme;
	tags: string[];
}

const DEFAULT_GRID: PremadeMapGrid = {
	width: 20,
	height: 20,
	size: 100,
};

const GRID_48: PremadeMapGrid = {
	width: 48,
	height: 48,
	size: 64,
};

const GRID_32: PremadeMapGrid = {
	width: 32,
	height: 32,
	size: 64,
};

const PREMADE_MAPS: PremadeMap[] = [
	{
		id: "rift-keep",
		name: "Rift Keep",
		description:
			"Painterly rift fortress layout with a fortified gate and central throne hall.",
		path: "/generated/maps/premade/rift-keep.webp",
		thumbnail: "/generated/maps/premade/rift-keep-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "umbral",
		tags: ["painterly", "battlemap", "dungeon", "keep", "umbral"],
	},
	{
		id: "shadow-crypt",
		name: "Shadow Crypt",
		description:
			"Top-down crypt map with layered chambers and sealed passageways.",
		path: "/generated/maps/premade/shadow-crypt.webp",
		thumbnail: "/generated/maps/premade/shadow-crypt-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "umbral",
		tags: ["painterly", "battlemap", "crypt", "dungeon", "shadow"],
	},
	{
		id: "frostbound-vault",
		name: "Frostbound Vault",
		description:
			"Chilled vault chambers with narrow corridors and frozen stonework.",
		path: "/generated/maps/premade/frostbound-vault.webp",
		thumbnail: "/generated/maps/premade/frostbound-vault-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "frost",
		tags: ["painterly", "battlemap", "vault", "frost", "dungeon"],
	},
	{
		id: "ashen-forge",
		name: "Ashen Forge",
		description:
			"Smoldering forge complex with scorched hallways and ritual platforms.",
		path: "/generated/maps/premade/ashen-forge.webp",
		thumbnail: "/generated/maps/premade/ashen-forge-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "ember",
		tags: ["painterly", "battlemap", "forge", "ember", "dungeon"],
	},
	{
		id: "veil-garden",
		name: "Veil Garden",
		description:
			"Ruined garden courts with hidden chambers and overgrown corridors.",
		path: "/generated/maps/premade/veil-garden.webp",
		thumbnail: "/generated/maps/premade/veil-garden-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "verdant",
		tags: ["painterly", "battlemap", "garden", "ruins", "verdant"],
	},
	{
		id: "umbral-throne",
		name: "Umbral Throne",
		description:
			"Grand throne complex with layered defenses and inner sanctum.",
		path: "/generated/maps/premade/umbral-throne.webp",
		thumbnail: "/generated/maps/premade/umbral-throne-thumb.webp",
		grid: DEFAULT_GRID,
		theme: "umbral",
		tags: ["painterly", "battlemap", "throne", "sanctum", "umbral"],
	},
	{
		id: "rift-citadel",
		name: "Rift Citadel",
		description:
			"Massive fortress dungeon with grand halls, gate chamber, and inner sanctum.",
		path: "/generated/maps/premade/rift-citadel.webp",
		thumbnail: "/generated/maps/premade/rift-citadel-thumb.webp",
		grid: GRID_48,
		theme: "umbral",
		tags: ["painterly", "battlemap", "dungeon", "citadel", "umbral"],
	},
	{
		id: "shadow-labyrinth",
		name: "Shadow Labyrinth",
		description:
			"Sprawling labyrinth with twisted passages, bridges, and shadowed chambers.",
		path: "/generated/maps/premade/shadow-labyrinth.webp",
		thumbnail: "/generated/maps/premade/shadow-labyrinth-thumb.webp",
		grid: GRID_48,
		theme: "umbral",
		tags: ["painterly", "battlemap", "labyrinth", "dungeon", "shadow"],
	},
	{
		id: "frostbound-depths",
		name: "Frostbound Depths",
		description:
			"Frozen dungeon halls with crystal chambers and brittle bridges.",
		path: "/generated/maps/premade/frostbound-depths.webp",
		thumbnail: "/generated/maps/premade/frostbound-depths-thumb.webp",
		grid: GRID_48,
		theme: "frost",
		tags: ["painterly", "battlemap", "frost", "dungeon", "vault"],
	},
	{
		id: "ashen-forge-depths",
		name: "Ashen Forge Depths",
		description:
			"Volcanic forge complex of scorched stone, magma channels, and heavy halls.",
		path: "/generated/maps/premade/ashen-forge-depths.webp",
		thumbnail: "/generated/maps/premade/ashen-forge-depths-thumb.webp",
		grid: GRID_48,
		theme: "ember",
		tags: ["painterly", "battlemap", "forge", "ember", "dungeon"],
	},
	{
		id: "gate-antechamber",
		name: "Gate Antechamber",
		description:
			"Compact ritual antechamber with a sealed gate, pillars, and floor inlays.",
		path: "/generated/maps/premade/gate-antechamber.webp",
		thumbnail: "/generated/maps/premade/gate-antechamber-thumb.webp",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "ritual", "chamber", "umbral"],
	},
	{
		id: "sealed-vault",
		name: "Sealed Vault",
		description:
			"Treasure vault with guardian statues, trap tiles, and heavy doors.",
		path: "/generated/maps/premade/sealed-vault.webp",
		thumbnail: "/generated/maps/premade/sealed-vault-thumb.webp",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "vault", "treasure", "umbral"],
	},
	{
		id: "rift-shrine",
		name: "Rift Shrine",
		description:
			"Secluded shrine room with cracked altar and violet rift glow.",
		path: "/generated/maps/premade/rift-shrine.webp",
		thumbnail: "/generated/maps/premade/rift-shrine-thumb.webp",
		grid: GRID_32,
		theme: "verdant",
		tags: ["painterly", "battlemap", "shrine", "ruins", "verdant"],
	},
	{
		id: "veil-village",
		name: "Veil Village",
		description:
			"Roofless village layout with yards, dirt roads, and a central square.",
		path: "/generated/maps/premade/veil-village.webp",
		thumbnail: "/generated/maps/premade/veil-village-thumb.webp",
		grid: GRID_48,
		theme: "verdant",
		tags: ["painterly", "battlemap", "village", "settlement", "verdant"],
	},
	{
		id: "gatewatch-town",
		name: "Gatewatch Town",
		description:
			"Fortified town with walls, market square, gatehouse, and river crossing.",
		path: "/generated/maps/premade/gatewatch-town.webp",
		thumbnail: "/generated/maps/premade/gatewatch-town-thumb.webp",
		grid: GRID_48,
		theme: "umbral",
		tags: ["painterly", "battlemap", "town", "settlement", "umbral"],
	},
	{
		id: "ascendant-capital",
		name: "Ascendant Capital",
		description:
			"Large city layout with canals, plazas, districts, and a citadel quarter.",
		path: "/generated/maps/premade/ascendant-capital.webp",
		thumbnail: "/generated/maps/premade/ascendant-capital-thumb.webp",
		grid: GRID_48,
		theme: "umbral",
		tags: ["painterly", "battlemap", "city", "settlement", "umbral"],
	},
	{
		id: "sandswept-ruins",
		name: "Sandswept Ruins",
		description:
			"Desert ruins with sand-choked corridors and collapsed arches.",
		path: "/generated/maps/premade/sandswept-ruins.webp",
		thumbnail: "/generated/maps/premade/sandswept-ruins-thumb.webp",
		grid: GRID_48,
		theme: "ember",
		tags: ["painterly", "battlemap", "desert", "ruins", "ember"],
	},
	{
		id: "crystal-caverns",
		name: "Crystal Caverns",
		description:
			"Luminous caverns with fractured bridges and crystalline chambers.",
		path: "/generated/maps/premade/crystal-caverns.webp",
		thumbnail: "/generated/maps/premade/crystal-caverns-thumb.webp",
		grid: GRID_48,
		theme: "frost",
		tags: ["painterly", "battlemap", "cavern", "crystal", "frost"],
	},
	{
		id: "rank-e-outpost",
		name: "Rank E Outpost",
		description:
			"Low-rank outpost layout with simple rooms and short corridors.",
		path: "/generated/maps/premade/rank-e-outpost.webp",
		thumbnail: "/generated/maps/premade/rank-e-outpost-thumb.webp",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "rank-e", "outpost", "umbral"],
	},
	{
		id: "rank-s-abyss",
		name: "Rank S Abyss",
		description: "Vast abyssal arena with towering pillars and void chasms.",
		path: "/generated/maps/premade/rank-s-abyss.webp",
		thumbnail: "/generated/maps/premade/rank-s-abyss-thumb.webp",
		grid: GRID_48,
		theme: "umbral",
		tags: ["painterly", "battlemap", "rank-s", "abyss", "umbral"],
	},
	{
		id: "inkwash-ruins",
		name: "Inkwash Ruins",
		description:
			"Monochrome inkwash ruins with violet accents and smoky shadows.",
		path: "/generated/maps/premade/inkwash-ruins.webp",
		thumbnail: "/generated/maps/premade/inkwash-ruins-thumb.webp",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "inkwash", "ruins", "umbral"],
	},
	{
		id: "arcane-schematic",
		name: "Arcane Schematic",
		description: "Arcane schematic with glowing linework and occult geometry.",
		path: "/generated/maps/premade/arcane-schematic.webp",
		thumbnail: "/generated/maps/premade/arcane-schematic-thumb.webp",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "arcane", "schematic", "umbral"],
	},
	{
		id: "hunters-guild-tavern",
		name: "Hunter's Guild Tavern",
		description:
			"Warm candlelit tavern interior with bar, tables, fireplace, and back rooms. A favorite haunt of Ascendants between Gate dives.",
		path: "/generated/maps/premade/hunters-guild-tavern.png",
		thumbnail: "/generated/maps/premade/hunters-guild-tavern.png",
		grid: GRID_32,
		theme: "verdant",
		tags: ["painterly", "battlemap", "tavern", "social", "guild", "verdant"],
	},
	{
		id: "rift-touched-forest",
		name: "Rift-Touched Forest",
		description:
			"Dense corrupted forest clearing with a glowing dimensional rift tear at its center. Purple-tinted streams and twisted roots.",
		path: "/generated/maps/premade/rift-touched-forest.png",
		thumbnail: "/generated/maps/premade/rift-touched-forest.png",
		grid: GRID_48,
		theme: "verdant",
		tags: ["painterly", "battlemap", "forest", "rift", "outdoor", "verdant"],
	},
	{
		id: "coastal-gate-breach",
		name: "Coastal Gate Breach",
		description:
			"Rocky seaside cliffs with a massive dimensional gate breach emerging from the sea. Broken docks and crashing waves.",
		path: "/generated/maps/premade/coastal-gate-breach.png",
		thumbnail: "/generated/maps/premade/coastal-gate-breach.png",
		grid: GRID_48,
		theme: "frost",
		tags: ["painterly", "battlemap", "coastal", "gate", "outdoor", "frost"],
	},
	{
		id: "underground-river-crossing",
		name: "Underground River Crossing",
		description:
			"Subterranean waterway with rope bridges, carved docks, and glowing crystals providing dim illumination.",
		path: "/generated/maps/premade/underground-river-crossing.png",
		thumbnail: "/generated/maps/premade/underground-river-crossing.png",
		grid: GRID_48,
		theme: "umbral",
		tags: [
			"painterly",
			"battlemap",
			"underground",
			"river",
			"cavern",
			"umbral",
		],
	},
	{
		id: "shadow-temple-sanctum",
		name: "Shadow Temple Sanctum",
		description:
			"Grand ceremonial hall with obsidian pillars and a central altar emanating shadow energy. Violet braziers line the walls.",
		path: "/generated/maps/premade/shadow-temple-sanctum.png",
		thumbnail: "/generated/maps/premade/shadow-temple-sanctum.png",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "temple", "shadow", "ritual", "umbral"],
	},
	{
		id: "raider-ship-deck",
		name: "Raider Ship Deck",
		description:
			"Weathered sailing vessel deck with masts, cargo holds, captain's cabin, and cannons. Surrounded by dark ocean.",
		path: "/generated/maps/premade/raider-ship-deck.png",
		thumbnail: "/generated/maps/premade/raider-ship-deck.png",
		grid: GRID_32,
		theme: "frost",
		tags: ["painterly", "battlemap", "ship", "nautical", "deck", "frost"],
	},
	{
		id: "gatewatch-marketplace",
		name: "Gatewatch Marketplace",
		description:
			"Open-air hunter's market with vendor stalls, a central fountain plaza, and narrow alley exits between stone buildings.",
		path: "/generated/maps/premade/gatewatch-marketplace.png",
		thumbnail: "/generated/maps/premade/gatewatch-marketplace.png",
		grid: GRID_48,
		theme: "verdant",
		tags: ["painterly", "battlemap", "market", "town", "social", "verdant"],
	},
	{
		id: "rift-corrupted-swamp",
		name: "Rift-Corrupted Swamp",
		description:
			"Toxic swampland tainted by rift energy. Raised plank paths cross murky water, with glowing mushrooms and dead trees.",
		path: "/generated/maps/premade/rift-corrupted-swamp.png",
		thumbnail: "/generated/maps/premade/rift-corrupted-swamp.png",
		grid: GRID_48,
		theme: "verdant",
		tags: ["painterly", "battlemap", "swamp", "rift", "outdoor", "verdant"],
	},
	{
		id: "mountain-gate-pass",
		name: "Mountain Gate Pass",
		description:
			"Narrow mountain trail winding between cliff faces with a dimensional gate portal at the summit.",
		path: "/generated/maps/premade/mountain-gate-pass.png",
		thumbnail: "/generated/maps/premade/mountain-gate-pass.png",
		grid: GRID_32,
		theme: "frost",
		tags: ["painterly", "battlemap", "mountain", "gate", "outdoor", "frost"],
	},
	{
		id: "detention-sector",
		name: "Detention Sector",
		description:
			"Stone cellblock with iron-bar cells, a central guard station, interrogation room, and exercise yard.",
		path: "/generated/maps/premade/detention-sector.png",
		thumbnail: "/generated/maps/premade/detention-sector.png",
		grid: GRID_32,
		theme: "umbral",
		tags: ["painterly", "battlemap", "prison", "dungeon", "umbral"],
	},
	{
		id: "arcane-research-lab",
		name: "Arcane Research Lab",
		description:
			"Stone chamber with glowing arcane circles, bookshelves, alchemist workbenches, and crystalline containment units.",
		path: "/generated/maps/premade/arcane-research-lab.png",
		thumbnail: "/generated/maps/premade/arcane-research-lab.png",
		grid: GRID_32,
		theme: "ember",
		tags: ["painterly", "battlemap", "lab", "arcane", "magic", "ember"],
	},
	{
		id: "necropolis-grounds",
		name: "Necropolis Grounds",
		description:
			"Foggy cemetery with rows of headstones, a central mausoleum, dead trees, and partially open crypts leading underground.",
		path: "/generated/maps/premade/necropolis-grounds.png",
		thumbnail: "/generated/maps/premade/necropolis-grounds.png",
		grid: GRID_48,
		theme: "umbral",
		tags: [
			"painterly",
			"battlemap",
			"graveyard",
			"undead",
			"outdoor",
			"umbral",
		],
	},
];

export default PREMADE_MAPS;
