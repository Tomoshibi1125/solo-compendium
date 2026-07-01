/**
 * Meridian — Rift Ascendant's canonical hub city.
 *
 * A pre-existing modern coastal megacity (NYC/LA/Vegas scale) where Rifts later
 * appeared. Seat of a Bureau regional headquarters, the densest concentration of
 * licensed Guilds outside the capitals, and the busiest Essence/Relic markets on
 * the eastern seaboard. The art is authored, top-down reference maps under
 * `public/generated/maps/Meridian/`; this module is the canon data presented as
 * a static gazetteer with a table-ready vector overlay (legend, district zones,
 * facility pins, compass, scale) — no virtual-tabletop interaction.
 *
 * RA canon note: a Rift is not a permanent civic fixture. A team enters and
 * Clears it (normally by killing the apex Anomaly), after which the Threshold
 * collapses — nothing persists. Meridian is a Rift hub because of how *often*
 * Rifts open here and the response economy that answers them, not because
 * standing rifts dot its districts. See `docs/rift-ascendant-world-lore.md`.
 */

/** Normalized 0–1 position on a map image (x → right, y → down). */
export interface MeridianPoint {
	x: number;
	y: number;
}

/** Normalized 0–1 bounding box on the city overview map. */
export interface MeridianRegion {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** Facility categories used by both the map pins and the legend key. */
export type PoiKind =
	| "bureau"
	| "guild"
	| "hospital"
	| "research"
	| "market"
	| "transit"
	| "port"
	| "harbor"
	| "industry"
	| "civic"
	| "residential"
	| "entertainment";

export interface MeridianPoi extends MeridianPoint {
	name: string;
	kind: PoiKind;
}

export interface MeridianDistrict {
	/** Stable 1-based index matching the authored map filenames. */
	id: number;
	slug: string;
	name: string;
	tagline: string;
	summary: string;
	/** Detailed reference map (2048×2048) under /generated/maps/Meridian/. */
	map: string;
	/** District footprint on the city overview map (for the hover highlight). */
	cityRegion: MeridianRegion;
	/** Always-on numbered marker for this district on the city overview map. */
	cityPin: MeridianPoint;
	/** Representative facility markers placed on this district's own map. */
	pois: MeridianPoi[];
}

const MAP_BASE = "/generated/maps/Meridian";

export interface MeridianCity {
	name: string;
	slug: string;
	tagline: string;
	overview: string;
	cityMap: string;
	/** Native pixel size of `cityMap`, for aspect ratio. */
	width: number;
	height: number;
	/** Approx. real-world span of the city map, for the scale bar (km). */
	cityScaleKmAcross: number;
	/** Approx. real-world span of a district map, for the scale bar (km). */
	districtScaleKmAcross: number;
	districts: MeridianDistrict[];
}

export const MERIDIAN: MeridianCity = {
	name: "Meridian",
	slug: "meridian",
	tagline:
		"Coastal megacity · Bureau regional seat · the busiest Rift economy on the seaboard",
	overview:
		"Meridian was a thriving modern metropolis long before the first Rift opened over its harbor. " +
		"It did not grow around the Rifts — the Rifts arrived in a city that already had subways, stadiums, " +
		"hospitals, and a skyline. Today it runs two lives at once: an ordinary coastal megacity of commuters, " +
		"corporations, and nightlife, and the eastern seaboard's primary Rift hub. More Rifts open here than " +
		"anywhere on the coast, and the city is built to answer them — a Bureau regional headquarters that " +
		"classifies and dispatches, dozens of licensed Guild houses that race to Clear them, and the Essence " +
		"exchanges and Relic auction halls that price whatever a team carries back out before the Threshold " +
		"collapses behind it. A Rift opens, a team goes in, the door closes — and Meridian's markets have " +
		"already moved on the next one.",
	cityMap: `${MAP_BASE}/meridian_city.png`,
	width: 1254,
	height: 1254,
	cityScaleKmAcross: 14,
	districtScaleKmAcross: 2.5,
	districts: [
		{
			id: 1,
			slug: "bureau-civic-core",
			name: "Bureau Civic Core",
			tagline: "Regional Bureau HQ · licensing · classification",
			summary:
				"The administrative heart of Meridian: the Bureau's regional headquarters, the licensing and " +
				"Rank-classification halls, casualty archives, and the civic plazas where clearances are issued " +
				"and careers are made or ended on paper. Heavily warded, heavily watched.",
			map: `${MAP_BASE}/meridian_01_bureau_civic_core_table_map.jpg`,
			cityRegion: { x: 0.1, y: 0.34, w: 0.42, h: 0.4 },
			cityPin: { x: 0.34, y: 0.41 },
			pois: [
				{ name: "Bureau Regional HQ", kind: "bureau", x: 0.5, y: 0.45 },
				{
					name: "Licensing & Classification Halls",
					kind: "bureau",
					x: 0.63,
					y: 0.55,
				},
				{ name: "Casualty Archives", kind: "civic", x: 0.37, y: 0.58 },
				{ name: "Civic Plazas", kind: "civic", x: 0.5, y: 0.7 },
			],
		},
		{
			id: 2,
			slug: "downtown-guild-highrise-core",
			name: "Downtown & Guild Highrise Core",
			tagline: "Guild towers · sponsorships · the public face of the trade",
			summary:
				"A canyon of glass towers housing Meridian's flagship Guilds, their training floors, medical " +
				"wings, and PR machines. This is where ranked Ascendants are sponsored, branded, and broadcast — " +
				"the most visible, most expensive blocks in the city.",
			map: `${MAP_BASE}/meridian_02_downtown_guild_highrise_core_table_map.jpg`,
			cityRegion: { x: 0.24, y: 0.1, w: 0.42, h: 0.35 },
			cityPin: { x: 0.31, y: 0.14 },
			pois: [
				{ name: "Flagship Guild Towers", kind: "guild", x: 0.5, y: 0.45 },
				{ name: "Training Floors", kind: "guild", x: 0.63, y: 0.5 },
				{ name: "Broadcast & PR Studios", kind: "guild", x: 0.4, y: 0.56 },
			],
		},
		{
			id: 3,
			slug: "east-river-financial-guild",
			name: "East River Financial-Guild District",
			tagline: "Essence finance · contract law · Relic underwriting",
			summary:
				"Across the river, the money that moves the Rift economy: Essence commodity desks, Relic " +
				"underwriters, contract houses, and the law firms that decide who owes what after a Clear goes wrong.",
			map: `${MAP_BASE}/meridian_03_east_river_financial_guild_district_table_map.jpg`,
			cityRegion: { x: 0.4, y: 0.17, w: 0.53, h: 0.35 },
			cityPin: { x: 0.61, y: 0.21 },
			pois: [
				{ name: "Essence Commodity Desks", kind: "market", x: 0.4, y: 0.45 },
				{ name: "Relic Underwriters", kind: "market", x: 0.55, y: 0.5 },
				{ name: "Contract & Law Houses", kind: "civic", x: 0.3, y: 0.6 },
			],
		},
		{
			id: 4,
			slug: "essence-exchange-entertainment-strip",
			name: "Essence Exchange & Entertainment Strip",
			tagline: "Essence markets · auctions · neon nightlife",
			summary:
				"The bright, loud center of the city: open Essence exchanges, Relic auction floors, and the " +
				"entertainment strip that grew up around new money — casinos, arenas, and the grey markets that " +
				"trade in cores, forged clearances, and unregistered Rift maps after dark.",
			map: `${MAP_BASE}/meridian_04_essence_exchange_entertainment_strip_table_map.jpg`,
			cityRegion: { x: 0.08, y: 0.34, w: 0.4, h: 0.42 },
			cityPin: { x: 0.13, y: 0.4 },
			pois: [
				{ name: "Open Essence Exchange", kind: "market", x: 0.45, y: 0.45 },
				{ name: "Relic Auction Floor", kind: "market", x: 0.6, y: 0.4 },
				{ name: "Casinos & Arenas", kind: "entertainment", x: 0.42, y: 0.6 },
				{
					name: "After-Dark Grey Market",
					kind: "entertainment",
					x: 0.3,
					y: 0.52,
				},
			],
		},
		{
			id: 5,
			slug: "west-rail-transit-yards",
			name: "West Rail & Transit Yards",
			tagline: "Logistics · staging · Bureau motor pools",
			summary:
				"The city's western circulatory system: rail yards, freight depots, and the Bureau and Guild motor " +
				"pools that stage every major Rift response. When a high-rank Site opens, the convoys form here.",
			map: `${MAP_BASE}/meridian_05_west_rail_transit_yards_table_map.jpg`,
			cityRegion: { x: 0.0, y: 0.28, w: 0.4, h: 0.44 },
			cityPin: { x: 0.04, y: 0.32 },
			pois: [
				{ name: "Central Rail Yard", kind: "transit", x: 0.45, y: 0.5 },
				{ name: "Freight Depots", kind: "transit", x: 0.6, y: 0.55 },
				{
					name: "Bureau / Guild Motor Pool",
					kind: "transit",
					x: 0.35,
					y: 0.62,
				},
			],
		},
		{
			id: 6,
			slug: "north-research-medical-campus",
			name: "North Research & Medical Campus",
			tagline: "Essence medicine · research · Awakening wards",
			summary:
				"The northern campus: Essence-medicine hospitals, research institutes, and the Awakening wards " +
				"where new Ascendants are stabilized and assessed. Equal parts cutting-edge care and quiet, " +
				"well-funded experimentation.",
			map: `${MAP_BASE}/meridian_06_north_research_medical_campus_table_map.jpg`,
			cityRegion: { x: 0.24, y: 0.02, w: 0.68, h: 0.28 },
			cityPin: { x: 0.37, y: 0.05 },
			pois: [
				{ name: "Essence-Medicine Hospital", kind: "hospital", x: 0.4, y: 0.5 },
				{ name: "Research Institutes", kind: "research", x: 0.56, y: 0.45 },
				{ name: "Awakening Wards", kind: "research", x: 0.5, y: 0.62 },
			],
		},
		{
			id: 7,
			slug: "port-industrial-waterfront",
			name: "Port & Industrial Waterfront",
			tagline: "Refineries · containment · heavy Essence industry",
			summary:
				"Where raw Rift material comes ashore: Essence refineries, containment yards, and the heavy " +
				"industry that turns harvested cores into batteries, alloys, and munitions. Tightly regulated, " +
				"frequently smuggled through.",
			map: `${MAP_BASE}/meridian_07_port_industrial_waterfront_table_map.jpg`,
			cityRegion: { x: 0.32, y: 0.27, w: 0.68, h: 0.68 },
			cityPin: { x: 0.62, y: 0.52 },
			pois: [
				{ name: "Essence Refineries", kind: "industry", x: 0.4, y: 0.45 },
				{ name: "Containment Yards", kind: "industry", x: 0.55, y: 0.5 },
				{ name: "Cargo Docks", kind: "port", x: 0.5, y: 0.72 },
			],
		},
		{
			id: 8,
			slug: "south-harbor-marina",
			name: "South Harbor & Marina District",
			tagline: "Harbor · where the first Rift opened · Bureau watch-station",
			summary:
				"The harbor where Meridian's first confirmed Rift opened — and was cleared, in the brutal early " +
				"days before anyone had the word 'Ascendant.' The Marina district rebuilt over the site long ago: " +
				"waterfront promenades and yacht slips, and a Bureau watch-station that still reads the water for " +
				"the next rupture. That founding event — and the seaboard's highest rift incidence ever since — is " +
				"why the Bureau planted its regional seat in Meridian.",
			map: `${MAP_BASE}/meridian_08_south_harbor_marina_district_table_map.jpg`,
			cityRegion: { x: 0.07, y: 0.3, w: 0.65, h: 0.44 },
			cityPin: { x: 0.3, y: 0.62 },
			pois: [
				{
					name: "Bureau Harbor Watch-Station",
					kind: "bureau",
					x: 0.5,
					y: 0.52,
				},
				{ name: "Marina & Yacht Slips", kind: "harbor", x: 0.44, y: 0.7 },
				{ name: "Waterfront Promenade", kind: "harbor", x: 0.6, y: 0.66 },
			],
		},
		{
			id: 9,
			slug: "residential-park-borough",
			name: "Residential Park Borough",
			tagline: "Neighborhoods · parks · ordinary life",
			summary:
				"The northwest borough where most of Meridian actually lives: row houses and apartment blocks, " +
				"school districts that run Rift-alert drills, and the green parks that civilians use to forget, " +
				"for an afternoon, that the skyline has doors in it.",
			map: `${MAP_BASE}/meridian_09_residential_park_borough_table_map.jpg`,
			cityRegion: { x: 0.0, y: 0.07, w: 0.42, h: 0.3 },
			cityPin: { x: 0.04, y: 0.18 },
			pois: [
				{ name: "Residential Blocks", kind: "residential", x: 0.45, y: 0.45 },
				{ name: "School Districts", kind: "residential", x: 0.6, y: 0.5 },
				{ name: "Central Park", kind: "residential", x: 0.38, y: 0.62 },
			],
		},
	],
};

/** Legend key: facility category → display label, map glyph, and accent color. */
export const POI_KINDS: Record<
	PoiKind,
	{ label: string; glyph: string; color: string }
> = {
	bureau: { label: "Bureau facility", glyph: "★", color: "#7dd3fc" },
	guild: { label: "Guild house / tower", glyph: "◆", color: "#c4b5fd" },
	hospital: {
		label: "Essence-medicine hospital",
		glyph: "✚",
		color: "#86efac",
	},
	research: {
		label: "Research / Awakening ward",
		glyph: "✸",
		color: "#5eead4",
	},
	market: { label: "Essence / Relic market", glyph: "✦", color: "#fde047" },
	transit: { label: "Rail / transit / staging", glyph: "▦", color: "#fdba74" },
	port: { label: "Port / cargo docks", glyph: "⚓", color: "#38bdf8" },
	harbor: { label: "Harbor / marina", glyph: "⚓", color: "#22d3ee" },
	industry: { label: "Refinery / containment", glyph: "⚙", color: "#a8a29e" },
	civic: { label: "Civic / administrative", glyph: "◉", color: "#f0abfc" },
	residential: { label: "Residential / parks", glyph: "⌂", color: "#bef264" },
	entertainment: {
		label: "Entertainment / nightlife",
		glyph: "✺",
		color: "#fb7185",
	},
};
