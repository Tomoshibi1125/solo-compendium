/**
 * RA-canon Vehicles & Mounts — Q5 of Round 3 remediation.
 *
 * 44 canonical entries total (22 mounts + 22 vehicles), structured per
 * the plan at `C:\Users\jjcal\.claude\plans\find-any-remaining-functional-ui-etc-polymorphic-lemur.md`.
 *
 * Mounts are split into three buckets:
 *   - Real-world animals (Bureau / Guild stables, K9 units) — 8 entries
 *   - Bonded existing anomalies (thin overlays via `anomaly_id`) — 10
 *   - Net-new RA-canon mounts (no anomaly basis) — 4
 *
 * Vehicles are split into three buckets:
 *   - Modern real-world transport (Bureau / Guild / civilian) — 13
 *   - Rift-tech / augmented Bureau & Guild assets — 6
 *   - Rare / Pantheon / one-of-a-kind — 3
 *
 * All entries fit RA canon (modern urban-fantasy setting with Gates,
 * Bureau, Vermillion Guild, and Pantheon Eternals — no medieval ships
 * or fantasy chariots).
 *
 * Bonded-anomaly mounts reference an `anomaly_id` and inherit stats
 * from the linked anomaly at runtime — no duplicated stat data.
 */
import type { CompendiumVehicle } from "@/types/compendium";

const RA_SOURCE = "Rift Ascendant Canon";

// ──────────────────────────────────────────────────────────────────────
// MOUNTS — Bucket A: Real-world animals (8 entries)
// ──────────────────────────────────────────────────────────────────────

const mountsRealWorld: CompendiumVehicle[] = [
	{
		id: "mount-bureau-riding-horse",
		name: "Bureau Riding Horse",
		display_name: "Bureau Riding Horse",
		description:
			"Standard-issue mount from Bureau stables. Trained for urban deployment; spooks less than a civilian horse when a Gate flickers nearby.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 60 },
		armor_class: 10,
		hit_points: { max: 13 },
		carry_capacity_lbs: 480,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bureau-warhorse",
		name: "Bureau Warhorse",
		display_name: "Bureau Warhorse",
		description:
			"Combat-trained Bureau mount. Charges +5 ft on the first round of combat; can deliver a trample on a turn it dashes.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 60 },
		armor_class: 11,
		hit_points: { max: 19 },
		carry_capacity_lbs: 540,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [
			{
				name: "Trample",
				description:
					"On a turn this mount dashes, it can attempt a hoof strike against any creature it passes through.",
				action_type: "action",
			},
		],
		bonded: false,
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bureau-draft-horse",
		name: "Bureau Draft Horse",
		display_name: "Bureau Draft Horse",
		description:
			"Heavy-haul mount for Bureau evidence-recovery and Warden-camp logistics. Doubled carry capacity, slower than a riding horse.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 40 },
		armor_class: 10,
		hit_points: { max: 19 },
		carry_capacity_lbs: 1080,
		crew_positions: [{ id: "rider", name: "Driver" }],
		abilities: [],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-quartermasters-mule",
		name: "Quartermaster's Mule",
		display_name: "Quartermaster's Mule",
		description:
			"Hardy long-haul mule from Bureau quartermaster pools. Bypasses rough-terrain speed penalties.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 40 },
		armor_class: 10,
		hit_points: { max: 11 },
		carry_capacity_lbs: 420,
		crew_positions: [{ id: "rider", name: "Driver" }],
		abilities: [
			{
				name: "Sure-Footed",
				description:
					"Ignores rough-terrain movement penalties; advantage on STR/AGI saves against being knocked prone.",
				action_type: "passive",
			},
		],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bureau-k9-mastiff",
		name: "Bureau K9 (Mastiff-class)",
		display_name: "Bureau K9 (Mastiff-class)",
		description:
			"Bureau strike-team K9. Scent-tracks anomaly residue at up to a mile; trained for bite-and-hold on humanoid suspects.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 40 },
		armor_class: 12,
		hit_points: { max: 13 },
		carry_capacity_lbs: 195,
		crew_positions: [{ id: "rider", name: "Handler (small races only)" }],
		abilities: [
			{
				name: "Bite",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft. Hit: 1d6+1 piercing damage. Target STR save DC 11 or knocked prone.",
				action_type: "action",
			},
			{
				name: "Keen Smell",
				description:
					"Advantage on SENSE (Perception) checks that rely on smell. Tracks anomaly residue at up to 1 mile.",
				action_type: "passive",
			},
		],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mountain-patrol-bear",
		name: "Mountain Patrol Bear",
		display_name: "Mountain Patrol Bear",
		description:
			"Alpine-division Bureau mount, bonded young from the Yongsan-North preserve. Cold-resistant; can carry medium-sized Ascendants.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 40 },
		armor_class: 11,
		hit_points: { max: 34 },
		carry_capacity_lbs: 720,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [
			{
				name: "Cold Resistance",
				description: "Resistance to cold damage.",
				action_type: "passive",
			},
			{
				name: "Multiattack",
				description: "Bite + Claws.",
				action_type: "action",
			},
		],
		bonded: false,
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-dust-rift-camel",
		name: "Dust-Rift Camel",
		display_name: "Dust-Rift Camel",
		description:
			"Desert-Bureau mount, originally bred for Saudi-line Gate ops. Immune to exhaustion from heat; carries a full water-week.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 50 },
		armor_class: 9,
		hit_points: { max: 15 },
		carry_capacity_lbs: 480,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [
			{
				name: "Heat Resilience",
				description:
					"Immune to exhaustion levels caused by extreme heat. Resistant to fire damage from sandstorms / desert hazards.",
				action_type: "passive",
			},
		],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-vermillion-patrol-falcon",
		name: "Vermillion Patrol Falcon",
		display_name: "Vermillion Patrol Falcon",
		description:
			"Vermillion-Guild courier bird. Small; cannot bear an Ascendant rider, but functions as a scout-mount via tethered link.",
		vehicle_type: "mount",
		size: "tiny",
		speed: { land: 10, air: 60 },
		armor_class: 13,
		hit_points: { max: 3 },
		carry_capacity_lbs: 6,
		crew_positions: [
			{ id: "operator", name: "Operator (tethered link, ≤30 ft)" },
		],
		abilities: [
			{
				name: "Aerial Scout",
				description:
					"Operator can see through the falcon's eyes within 30 ft. Shares Sense (Perception) modifier.",
				action_type: "bonus-action",
			},
		],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// MOUNTS — Bucket B: Bonded existing anomalies (10 entries)
// Each references an `anomaly_id` and is a thin overlay — stats hydrate
// from the linked CompendiumAnomaly at runtime.
// ──────────────────────────────────────────────────────────────────────

const mountsBondedAnomalies: CompendiumVehicle[] = [
	{
		id: "mount-bonded-eternal-void-beast",
		name: "Bonded Eternal Void Beast",
		display_name: "Bonded Eternal Void Beast",
		description:
			"A tamed Eternal Void Beast bonded to its handler. Pursuit mount; the Beast Instinct ability is shared at low bond levels.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 50 },
		armor_class: 14,
		hit_points: { max: 45 },
		carry_capacity_lbs: 600,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-void-beast",
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-eternal-void-stalker",
		name: "Bonded Eternal Void Stalker",
		display_name: "Bonded Eternal Void Stalker",
		description:
			"A tamed Eternal Void Stalker. Stealth-mount; the rider gains advantage on Stealth checks while mounted.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 40 },
		armor_class: 15,
		hit_points: { max: 38 },
		carry_capacity_lbs: 540,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-void-stalker",
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-eternal-void-wraith",
		name: "Bonded Eternal Void Wraith",
		display_name: "Bonded Eternal Void Wraith",
		description:
			"Incorporeal mount; short-haul only. Bureau-restricted bonding ritual.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 0, air: 50 },
		armor_class: 13,
		hit_points: { max: 30 },
		carry_capacity_lbs: 180,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-void-wraith",
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-void-devourer-juvenile",
		name: "Bonded Void Devourer, Juvenile",
		display_name: "Bonded Void Devourer, Juvenile",
		description:
			"Serpent-class mount tamed from a juvenile Eternal Void Devourer. Ground + shallow water.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 30, water: 30 },
		armor_class: 13,
		hit_points: { max: 42 },
		carry_capacity_lbs: 600,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-void-devourer",
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-ancient-dragon-hatchling",
		name: "Bonded Ancient Dragon, Hatchling",
		display_name: "Bonded Ancient Dragon, Hatchling",
		description:
			"Juvenile dragon bonded from the Eternal Ancient Dragon line. Flight unlocks at bond level ≥ 5.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 30, air: 60 },
		armor_class: 16,
		hit_points: { max: 52 },
		carry_capacity_lbs: 540,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-ancient-dragon",
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-ancient-lich-steed",
		name: "Bonded Ancient Lich-Steed",
		display_name: "Bonded Ancient Lich-Steed",
		description:
			"Necrotic-class mount granted to Revenants. Rider may borrow Void Blast at extreme cost.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 50 },
		armor_class: 14,
		hit_points: { max: 47 },
		carry_capacity_lbs: 540,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-ancient-lich",
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-abyssal-titan-whelp",
		name: "Bonded Abyssal Titan, Whelp",
		display_name: "Bonded Abyssal Titan, Whelp",
		description:
			"Juvenile form of the Eternal Abyssal Titan. Heavy carry mount; cannot enter gates smaller than Large.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 30 },
		armor_class: 15,
		hit_points: { max: 60 },
		carry_capacity_lbs: 960,
		crew_positions: [
			{ id: "rider", name: "Bonded Rider" },
			{ id: "passenger", name: "Passenger" },
		],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-abyssal-titan",
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-shadow-anomaly",
		name: "Bonded Shadow Anomaly",
		display_name: "Bonded Shadow Anomaly",
		description:
			"The Umbral Regent's signature bonded mount, tamed from a Corrupted Shadow Anomaly. Rider may share Shadow Strike.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 40 },
		armor_class: 14,
		hit_points: { max: 36 },
		carry_capacity_lbs: 360,
		crew_positions: [{ id: "rider", name: "Umbral-Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-corrupted-shadow-anomaly",
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-eternal-abyssal-horror",
		name: "Bonded Eternal Abyssal Horror",
		display_name: "Bonded Eternal Abyssal Horror",
		description:
			"Rare elite mount. Bureau S-clearance bonding required. Volatile under low-bond conditions.",
		vehicle_type: "mount",
		size: "huge",
		speed: { land: 40 },
		armor_class: 16,
		hit_points: { max: 78 },
		carry_capacity_lbs: 1200,
		crew_positions: [
			{ id: "rider", name: "S-Class Bonded Rider" },
			{ id: "passenger", name: "Passenger" },
			{ id: "passenger2", name: "Passenger" },
		],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-abyssal-horror",
		rank: "A",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-bonded-eternal-shadow-lurker",
		name: "Bonded Eternal Shadow Lurker",
		display_name: "Bonded Eternal Shadow Lurker",
		description:
			"Umbral-Regent-exclusive unlock. Stealth elite mount; passes through dim light as if it were ethereal.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 50 },
		armor_class: 16,
		hit_points: { max: 62 },
		carry_capacity_lbs: 600,
		crew_positions: [{ id: "rider", name: "Umbral-Bonded Rider" }],
		abilities: [],
		bonded: true,
		anomaly_id: "anomaly-eternal-shadow-lurker",
		rank: "A",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// MOUNTS — Bucket C: Net-new RA-canon mounts (4 entries)
// ──────────────────────────────────────────────────────────────────────

const mountsNetNew: CompendiumVehicle[] = [
	{
		id: "mount-mana-touched-wolf",
		name: "Mana-Touched Wolf",
		display_name: "Mana-Touched Wolf",
		description:
			"Feral wolf-class anomaly that has acquired faint mana resonance from a leaked Gate. Most common path-tamed mount.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 50 },
		armor_class: 13,
		hit_points: { max: 24 },
		carry_capacity_lbs: 180,
		crew_positions: [{ id: "rider", name: "Bonded Rider" }],
		abilities: [
			{
				name: "Mana-Sense",
				description:
					"Detects mana resonance within 30 ft (e.g. Gate residue, an active Ascendant overflux).",
				action_type: "passive",
			},
		],
		bonded: true,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-vermillion-greyhound",
		name: "Vermillion Greyhound",
		display_name: "Vermillion Greyhound",
		description:
			"Guild courier dog; lineage traces back to a Bureau K9 escape during the Yongsan Cascade. Black-market bloodline.",
		vehicle_type: "mount",
		size: "medium",
		speed: { land: 60 },
		armor_class: 12,
		hit_points: { max: 14 },
		carry_capacity_lbs: 150,
		crew_positions: [{ id: "rider", name: "Operator" }],
		abilities: [
			{
				name: "Sprint",
				description:
					"Once per short rest, the mount may take the Dash action as a bonus action.",
				action_type: "bonus-action",
			},
		],
		bonded: false,
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-sovereign-steed",
		name: "Sovereign Steed",
		display_name: "Sovereign Steed",
		description:
			"Pantheon-blessed mount granted by an Eternal to Holy Knights at level 5+. Rider's proficiency bonus adds to the mount's AC.",
		vehicle_type: "mount",
		size: "large",
		speed: { land: 60 },
		armor_class: 14,
		hit_points: { max: 32 },
		carry_capacity_lbs: 600,
		crew_positions: [{ id: "rider", name: "Holy-Knight Bonded" }],
		abilities: [
			{
				name: "Pantheon Bond",
				description:
					"Rider's proficiency bonus adds to this mount's AC. Mount cannot be charmed or frightened.",
				action_type: "passive",
			},
		],
		bonded: true,
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-subject-zero-familiar",
		name: "Subject-Zero Familiar (Sealed)",
		display_name: "Subject-Zero Familiar (Sealed)",
		description:
			"A sealed fragment of the erased Yongsan S-Rank. Rare; Warden-gated; manifests as a small spectral construct that follows the bonded Ascendant.",
		vehicle_type: "mount",
		size: "tiny",
		speed: { land: 30, air: 30 },
		armor_class: 14,
		hit_points: { max: 8 },
		carry_capacity_lbs: 5,
		crew_positions: [{ id: "operator", name: "Bonded Ascendant" }],
		abilities: [
			{
				name: "Spectral Memory",
				description:
					"Once per long rest, the Ascendant may borrow one of the familiar's stored memories — re-roll a single ability check.",
				action_type: "reaction",
			},
		],
		bonded: true,
		rank: "A",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// VEHICLES — Bucket D: Modern real-world transport (13 entries)
// ──────────────────────────────────────────────────────────────────────

const vehiclesRealWorld: CompendiumVehicle[] = [
	{
		id: "vehicle-bureau-sedan",
		name: "Bureau-Issue Sedan",
		display_name: "Bureau-Issue Sedan",
		description:
			"Standard Bureau motor-pool car. Discreet, fast, civilian plates. The reconnaissance default.",
		vehicle_type: "land",
		size: "large",
		speed: { land: 120 },
		armor_class: 10,
		hit_points: { max: 30 },
		cargo_capacity_lbs: 800,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "passenger", name: "Passenger" },
			{ id: "rear-1", name: "Rear Seat" },
			{ id: "rear-2", name: "Rear Seat" },
		],
		abilities: [],
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-tactical-suv",
		name: "Bureau Tactical SUV",
		display_name: "Bureau Tactical SUV",
		description:
			"Armored 4x4 strike-team transport. Warding glyphs etched into the chassis dampen anomaly residue.",
		vehicle_type: "land",
		size: "large",
		speed: { land: 100 },
		armor_class: 14,
		hit_points: { max: 60 },
		cargo_capacity_lbs: 1400,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "passenger", name: "Passenger" },
			{ id: "rear-1", name: "Rear Seat" },
			{ id: "rear-2", name: "Rear Seat" },
			{ id: "rear-3", name: "Rear Seat" },
		],
		abilities: [
			{
				name: "Warding Glyphs",
				description: "Resistance to necrotic + psychic damage.",
				action_type: "passive",
			},
		],
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-civilian-compact",
		name: "Civilian Compact Car",
		display_name: "Civilian Compact Car",
		description:
			"Off-duty / undercover transport. Cheap, fuel-efficient, indistinguishable from background traffic.",
		vehicle_type: "land",
		size: "large",
		speed: { land: 100 },
		armor_class: 9,
		hit_points: { max: 20 },
		cargo_capacity_lbs: 500,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "passenger", name: "Passenger" },
			{ id: "rear", name: "Rear Seat (cramped)" },
		],
		abilities: [],
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-patrol-motorcycle",
		name: "Patrol Motorcycle",
		display_name: "Patrol Motorcycle",
		description:
			"Single-rider modern bike. Rider's AGI modifier scales acceleration; Vermillion couriers favor matte-black variants.",
		vehicle_type: "land",
		size: "medium",
		speed: { land: 140 },
		armor_class: 10,
		hit_points: { max: 14 },
		cargo_capacity_lbs: 80,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [
			{
				name: "Lane-Split",
				description:
					"Ignores difficult terrain caused by urban congestion; advantage on AGI saves to weave through traffic.",
				action_type: "passive",
			},
		],
		rank: "D",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-cargo-van",
		name: "Bureau Cargo Van",
		display_name: "Bureau Cargo Van",
		description:
			"Bureau evidence-recovery unit. Carries bulk anomaly debris + 4 passengers.",
		vehicle_type: "land",
		size: "huge",
		speed: { land: 80 },
		armor_class: 11,
		hit_points: { max: 45 },
		cargo_capacity_lbs: 2400,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "passenger", name: "Passenger" },
			{ id: "rear-1", name: "Rear Seat" },
			{ id: "rear-2", name: "Rear Seat" },
		],
		abilities: [],
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-vermillion-pickup",
		name: "Vermillion Pickup Truck",
		display_name: "Vermillion Pickup Truck",
		description:
			"Vermillion-Guild contraband-runner. Reinforced flatbed; chassis under-mounted compartment for off-the-books cargo.",
		vehicle_type: "land",
		size: "huge",
		speed: { land: 90 },
		armor_class: 11,
		hit_points: { max: 50 },
		cargo_capacity_lbs: 2000,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "passenger", name: "Passenger" },
		],
		abilities: [
			{
				name: "Hidden Compartment",
				description:
					"Concealed cargo space requires DC 15 SENSE (Investigation) to find. Standard 80 lb capacity.",
				action_type: "passive",
			},
		],
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-apc",
		name: "Bureau Tactical APC",
		display_name: "Bureau Tactical APC",
		description:
			"Heavy armored personnel carrier. Crew: driver + gunner + 6 passengers. Roof-mounted Class-2 anti-anomaly turret.",
		vehicle_type: "land",
		size: "huge",
		speed: { land: 60 },
		armor_class: 16,
		hit_points: { max: 120 },
		cargo_capacity_lbs: 2400,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{
				id: "gunner",
				name: "Gunner",
				grants_actions: ["apc-turret-burst"],
			},
			{ id: "passenger-1", name: "Passenger" },
			{ id: "passenger-2", name: "Passenger" },
			{ id: "passenger-3", name: "Passenger" },
			{ id: "passenger-4", name: "Passenger" },
			{ id: "passenger-5", name: "Passenger" },
			{ id: "passenger-6", name: "Passenger" },
		],
		abilities: [
			{
				name: "Turret Burst (Gunner Seat)",
				description:
					"Gunner action: ranged attack, range 120/240 ft, 2d10 piercing + force damage.",
				action_type: "action",
			},
		],
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-sar-helicopter",
		name: "Bureau Search-and-Rescue Helicopter",
		display_name: "Bureau Search-and-Rescue Helicopter",
		description:
			"Bureau air-mobile unit. Crew: pilot + door-gunner + 4 passengers. Deployed during Gate-Breach response within minutes of an alert.",
		vehicle_type: "air",
		size: "huge",
		speed: { air: 200 },
		armor_class: 12,
		hit_points: { max: 80 },
		cargo_capacity_lbs: 1800,
		crew_positions: [
			{ id: "pilot", name: "Pilot" },
			{
				id: "door-gunner",
				name: "Door Gunner",
				grants_actions: ["helicopter-mounted-gun"],
			},
			{ id: "passenger-1", name: "Passenger" },
			{ id: "passenger-2", name: "Passenger" },
			{ id: "passenger-3", name: "Passenger" },
			{ id: "passenger-4", name: "Passenger" },
		],
		abilities: [
			{
				name: "Hover-Insert",
				description:
					"Pilot action: descend to insert ground team into a 20-ft drop zone without landing.",
				action_type: "action",
			},
		],
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-cargo-plane",
		name: "Bureau Long-Haul Cargo Plane",
		display_name: "Bureau Long-Haul Cargo Plane",
		description:
			"Transcontinental Ascendant deployment. Yongsan ↔ São Paulo response within 14 hours. Bridge crew + 30 passenger seats.",
		vehicle_type: "air",
		size: "gargantuan",
		speed: { air: 400 },
		armor_class: 12,
		hit_points: { max: 200 },
		cargo_capacity_lbs: 60000,
		crew_positions: [
			{ id: "pilot", name: "Pilot" },
			{ id: "co-pilot", name: "Co-Pilot" },
			{ id: "navigator", name: "Navigator" },
			{ id: "loadmaster", name: "Loadmaster" },
		],
		abilities: [],
		rank: "A",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-coast-cutter",
		name: "Coast Cutter / Patrol Boat",
		display_name: "Coast Cutter / Patrol Boat",
		description:
			"Bureau marine unit for coastal Gates. Twin-engine; 12-person crew.",
		vehicle_type: "water",
		size: "gargantuan",
		speed: { water: 80 },
		armor_class: 13,
		hit_points: { max: 140 },
		cargo_capacity_lbs: 8000,
		crew_positions: [
			{ id: "helm", name: "Helmsman" },
			{ id: "navigator", name: "Navigator" },
			{ id: "gunner-1", name: "Forward Gunner" },
			{ id: "gunner-2", name: "Aft Gunner" },
		],
		abilities: [],
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-subway-car-warded",
		name: "Subway Car, Rift-Warded",
		display_name: "Subway Car, Rift-Warded",
		description:
			"Bureau-modified subway car deployed when a subway-station Gate opens. Carries a full strike team; the warding holds against C-rank residue.",
		vehicle_type: "land",
		size: "gargantuan",
		speed: { land: 120 },
		armor_class: 14,
		hit_points: { max: 220 },
		cargo_capacity_lbs: 20000,
		crew_positions: [
			{ id: "operator", name: "Train Operator" },
			{ id: "warden", name: "Bureau Warden (cabin)" },
		],
		abilities: [
			{
				name: "Subway Warding",
				description:
					"Resistance to all damage from C-rank-and-below anomalies.",
				action_type: "passive",
			},
		],
		rank: "A",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-ambulance",
		name: "Bureau Ambulance",
		display_name: "Bureau Ambulance",
		description:
			"Medic-deployable; doubles as a forward medbay. Restores 1d4 HP per use of its onboard kit.",
		vehicle_type: "land",
		size: "huge",
		speed: { land: 100 },
		armor_class: 11,
		hit_points: { max: 55 },
		cargo_capacity_lbs: 1800,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "medic", name: "Medic (onboard kit access)" },
			{ id: "patient-1", name: "Patient" },
			{ id: "patient-2", name: "Patient" },
		],
		abilities: [
			{
				name: "Onboard Medbay",
				description:
					"Once per short rest, Medic-seat occupant may restore 1d4+VIT HP to one patient-seat occupant.",
				action_type: "action",
			},
		],
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-city-bus",
		name: "City Bus",
		display_name: "City Bus",
		description:
			"Mass-evac platform during Gate breach. Carries 40 civilians; slow, soft target, but the only thing that gets a neighborhood out at once.",
		vehicle_type: "land",
		size: "gargantuan",
		speed: { land: 60 },
		armor_class: 10,
		hit_points: { max: 100 },
		cargo_capacity_lbs: 12000,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "escort", name: "Bureau Escort (front)" },
		],
		abilities: [],
		rank: "C",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// VEHICLES — Bucket E: Rift-tech / augmented assets (6 entries)
// ──────────────────────────────────────────────────────────────────────

const vehiclesRiftTech: CompendiumVehicle[] = [
	{
		id: "vehicle-rift-skiff",
		name: "Rift-Skiff (Bureau Rift-Mobility Unit)",
		display_name: "Rift-Skiff",
		description:
			"Small Rift-tech hoverboat. Runs on mana resonance instead of fuel; viable on ponds, canals, and shallow water.",
		vehicle_type: "rift",
		size: "large",
		speed: { water: 60, rift: 60 },
		armor_class: 12,
		hit_points: { max: 35 },
		cargo_capacity_lbs: 400,
		crew_positions: [
			{ id: "pilot", name: "Pilot" },
			{ id: "passenger", name: "Passenger" },
		],
		abilities: [
			{
				name: "Mana Resonance Drive",
				description:
					"Operates without conventional fuel; the pilot must succeed on a DC 10 INT save each hour to maintain resonance.",
				action_type: "passive",
			},
		],
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-class3-recon-drone",
		name: "Class-3 Recon Drone",
		display_name: "Class-3 Recon Drone",
		description:
			"Autonomous small recon vehicle. Paired Operator seat (elsewhere) controls remotely.",
		vehicle_type: "air",
		size: "small",
		speed: { air: 80 },
		armor_class: 14,
		hit_points: { max: 18 },
		cargo_capacity_lbs: 20,
		crew_positions: [
			{ id: "operator", name: "Operator (remote, ≤2 mile link)" },
		],
		abilities: [
			{
				name: "Live Feed",
				description:
					"Operator can see and hear through the drone within link range.",
				action_type: "passive",
			},
		],
		rank: "C",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-class5-strike-drone",
		name: "Class-5 Strike Drone",
		display_name: "Class-5 Strike Drone",
		description:
			"Autonomous armed recon-strike platform. Rare unlock; Bureau S-clearance required.",
		vehicle_type: "air",
		size: "medium",
		speed: { air: 100 },
		armor_class: 15,
		hit_points: { max: 32 },
		cargo_capacity_lbs: 40,
		crew_positions: [
			{ id: "operator", name: "Operator (remote, ≤5 mile link)" },
		],
		abilities: [
			{
				name: "Missile Burst",
				description:
					"Operator action: ranged attack, range 300/600 ft, 3d8 force damage + 5-ft burst.",
				action_type: "action",
			},
		],
		rank: "A",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-rift-augmented-apc",
		name: "Rift-Augmented APC",
		display_name: "Rift-Augmented APC",
		description:
			"Tactical APC with full Rift-warding glyphs. Resists anomaly damage; the warding network strains on prolonged exposure.",
		vehicle_type: "land",
		size: "huge",
		speed: { land: 60 },
		armor_class: 18,
		hit_points: { max: 160 },
		cargo_capacity_lbs: 2400,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{
				id: "gunner",
				name: "Gunner",
				grants_actions: ["apc-turret-burst"],
			},
			{ id: "passenger-1", name: "Passenger" },
			{ id: "passenger-2", name: "Passenger" },
			{ id: "passenger-3", name: "Passenger" },
			{ id: "passenger-4", name: "Passenger" },
			{ id: "passenger-5", name: "Passenger" },
			{ id: "passenger-6", name: "Passenger" },
		],
		abilities: [
			{
				name: "Rift-Warding Network",
				description:
					"Resistance to all anomaly-class damage. Warding strain: after taking 50+ damage in one combat, this resistance lapses for 1 hour.",
				action_type: "passive",
			},
		],
		rank: "A",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-bureau-containment-truck",
		name: "Bureau Containment Truck",
		display_name: "Bureau Containment Truck",
		description:
			"Cage trailer for capturing low-rank anomalies during a breach. Cage holds up to Large anomalies; rated for ranks D/C only.",
		vehicle_type: "land",
		size: "gargantuan",
		speed: { land: 60 },
		armor_class: 12,
		hit_points: { max: 80 },
		cargo_capacity_lbs: 8000,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "containment-operator", name: "Containment Operator" },
		],
		abilities: [
			{
				name: "Containment Cage",
				description:
					"Holds one captured anomaly of size Large or smaller, rank C or lower. Cage AC 18, HP 60, immune to psychic damage.",
				action_type: "passive",
			},
		],
		rank: "B",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mana-cycle",
		name: "Mana Cycle",
		display_name: "Mana Cycle",
		description:
			"Single-rider speeder; AGI scales acceleration. Vermillion-lineage chassis; mana-bound drivetrain.",
		vehicle_type: "rift",
		size: "medium",
		speed: { land: 160, rift: 60 },
		armor_class: 11,
		hit_points: { max: 18 },
		cargo_capacity_lbs: 50,
		crew_positions: [{ id: "rider", name: "Rider" }],
		abilities: [
			{
				name: "AGI Drive",
				description: "Top speed scales with rider AGI modifier × 5 ft.",
				action_type: "passive",
			},
		],
		rank: "C",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// VEHICLES — Bucket F: Rare / Pantheon / one-of-a-kind (3 entries)
// ──────────────────────────────────────────────────────────────────────

const vehiclesRare: CompendiumVehicle[] = [
	{
		id: "vehicle-sovereign-airship",
		name: "Sovereign-Class Airship",
		display_name: "Sovereign-Class Airship",
		description:
			"Pantheon-blessed flying ship. Bridge + two gunner positions; one-of-a-kind asset under joint Bureau-Pantheon stewardship.",
		vehicle_type: "air",
		size: "gargantuan",
		speed: { air: 240 },
		armor_class: 18,
		hit_points: { max: 400 },
		cargo_capacity_lbs: 40000,
		crew_positions: [
			{ id: "captain", name: "Captain (bridge)" },
			{ id: "helm", name: "Helmsman" },
			{ id: "navigator", name: "Navigator" },
			{
				id: "gunner-port",
				name: "Port Gunner",
				grants_actions: ["airship-broadside"],
			},
			{
				id: "gunner-starboard",
				name: "Starboard Gunner",
				grants_actions: ["airship-broadside"],
			},
			{ id: "engines", name: "Engineer" },
		],
		abilities: [
			{
				name: "Pantheon Blessing",
				description: "Cannot be brought below 1 HP except by S-rank damage.",
				action_type: "passive",
			},
			{
				name: "Broadside (Gunner)",
				description: "Gunner action: 4d10 force damage in a 60-ft line.",
				action_type: "action",
			},
		],
		rank: "S",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-eternal-vessel",
		name: "Eternal Vessel",
		display_name: "Eternal Vessel",
		description:
			"Cross-Rift research craft. Pantheon-aligned skiff piloted from the bridge; designed for full-party long-haul Rift expeditions.",
		vehicle_type: "rift",
		size: "gargantuan",
		speed: { air: 200, rift: 200 },
		armor_class: 16,
		hit_points: { max: 320 },
		cargo_capacity_lbs: 30000,
		crew_positions: [
			{ id: "captain", name: "Captain" },
			{ id: "helm", name: "Helmsman" },
			{ id: "science-1", name: "Science Officer" },
			{ id: "science-2", name: "Science Officer" },
			{ id: "engineer", name: "Engineer" },
		],
		abilities: [
			{
				name: "Cross-Rift Drive",
				description:
					"Once per long rest, the Vessel may translate between any two known Rift coordinates over the course of 1 hour.",
				action_type: "action",
			},
		],
		rank: "S",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-vermillion-black-market-hauler",
		name: "Vermillion Black-Market Hauler",
		display_name: "Vermillion Black-Market Hauler",
		description:
			"Smuggler's rig. Guild-only unlock; chrome plates the entire chassis. The Vermillion Guild's flagship contraband-runner.",
		vehicle_type: "land",
		size: "gargantuan",
		speed: { land: 100 },
		armor_class: 15,
		hit_points: { max: 180 },
		cargo_capacity_lbs: 18000,
		crew_positions: [
			{ id: "driver", name: "Driver" },
			{ id: "co-driver", name: "Co-Driver" },
			{
				id: "rear-gunner",
				name: "Rear Gunner",
				grants_actions: ["hauler-rear-gun"],
			},
		],
		abilities: [
			{
				name: "Chrome Plating",
				description:
					"Resistance to bludgeoning and slashing damage from non-anomaly sources.",
				action_type: "passive",
			},
			{
				name: "Hidden Manifest",
				description:
					"Contents are concealed; requires DC 18 SENSE (Investigation) to discover.",
				action_type: "passive",
			},
		],
		rank: "A",
		source_book: RA_SOURCE,
	},
];

// ──────────────────────────────────────────────────────────────────────
// Aggregated exports
// ──────────────────────────────────────────────────────────────────────

export const allMounts: CompendiumVehicle[] = [
	...mountsRealWorld,
	...mountsBondedAnomalies,
	...mountsNetNew,
];

export const allVehicles: CompendiumVehicle[] = [
	...allMounts,
	...vehiclesRealWorld,
	...vehiclesRiftTech,
	...vehiclesRare,
];

export const ridingVehicles: CompendiumVehicle[] = [
	...vehiclesRealWorld,
	...vehiclesRiftTech,
	...vehiclesRare,
];
