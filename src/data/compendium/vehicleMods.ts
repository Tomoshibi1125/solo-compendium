import type { CompendiumVehicleMod } from "@/types/compendium";

const RA_SOURCE = "Rift Ascendant Canon";

export const vehicleMods: CompendiumVehicleMod[] = [
	{
		id: "vehicle-mod-all-terrain-tires",
		name: "All-Terrain Tires",
		display_name: "All-Terrain Tires",
		description:
			"Reinforced tire set with rune-laced bead locks for broken pavement, ash, shallow water, and root-choked Rift terrain.",
		mod_type: "vehicle",
		category: "mobility",
		vrp_cost: 1,
		capacity_cost: 1,
		effect: "Reduce common rough-ground vehicle handling DCs by 2.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-basic-tread-kit",
		name: "Basic Tread Kit",
		display_name: "Basic Tread Kit",
		description:
			"Bolt-on track assembly for Bureau carts, rovers, vans, and crawlers operating in mud, ash, snow, or loose stone.",
		mod_type: "vehicle",
		category: "mobility",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Ignore the first 10 feet of movement penalty from soft ground each round.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-rock-crawler-suspension",
		name: "Rock-Crawler Suspension",
		display_name: "Rock-Crawler Suspension",
		description:
			"High-clearance suspension and mana-dampened shocks for threshold routes where roads end fast.",
		mod_type: "vehicle",
		category: "mobility",
		vrp_cost: 2,
		capacity_cost: 2,
		effect:
			"Advantage on checks to cross rubble, roots, stairs, or broken stone at half speed.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-low-signature-baffling",
		name: "Low-Signature Baffling",
		display_name: "Low-Signature Baffling",
		description:
			"Engine shrouds, rune foam, and insulated panels that reduce mechanical noise and Essence bleed.",
		mod_type: "vehicle",
		category: "stealth",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Once per travel scene, downgrade a vehicle noise complication by one step.",
		requirements: ["Vehicle with an engine or powered drive"],
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-headlight-shutters",
		name: "Headlight Shutters",
		display_name: "Headlight Shutters",
		description:
			"Mechanical light shutters and red-spectrum lenses for operating near light-sensitive anomalies.",
		mod_type: "vehicle",
		category: "stealth",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Reduce visible light signature while moving slowly; Perception checks from the cab take -2.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-afa-relay-mast",
		name: "AFA Relay Mast",
		display_name: "AFA Relay Mast",
		description:
			"Telescoping Arcane Field Analyzer relay that extends party sensor range inside unstable threshold zones.",
		mod_type: "vehicle",
		category: "afa",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Extend AFA scan range for the party while the vehicle is stationary.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-afa-blackbox-recorder",
		name: "AFA Blackbox Recorder",
		display_name: "AFA Blackbox Recorder",
		description:
			"Hardened recorder that preserves corrupted scan data, route telemetry, and anomaly-contact spikes.",
		mod_type: "vehicle",
		category: "afa",
		vrp_cost: 3,
		capacity_cost: 1,
		effect:
			"Recover one useful clue from failed or distorted AFA readings after a scene.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-terrain-sonar",
		name: "Terrain Sonar",
		display_name: "Terrain Sonar",
		description:
			"Ground-pulse sensor suite for hollows, false floors, buried doors, and unstable roadbeds.",
		mod_type: "vehicle",
		category: "sensors",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Advantage on vehicle-team checks to detect unstable ground before entering it.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-cabin-seal-kit",
		name: "Cabin Seal Kit",
		display_name: "Cabin Seal Kit",
		description:
			"Positive-pressure seals, filtered intake, and quick-patch skirts for ash, spores, miasma, and hostile rain.",
		mod_type: "vehicle",
		category: "survival",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Protect occupants from one airborne hazard exposure before filters must be replaced.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-hazard-foam-dispenser",
		name: "Hazard Foam Dispenser",
		display_name: "Hazard Foam Dispenser",
		description:
			"Directional foam system that seals breaches, pins residue, and marks contaminated surfaces.",
		mod_type: "vehicle",
		category: "survival",
		vrp_cost: 3,
		capacity_cost: 2,
		effect:
			"Once per mission, seal a breach or suppress a medium hazard zone for 10 minutes.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-medical-bench",
		name: "Medical Bench",
		display_name: "Medical Bench",
		description:
			"Foldout stretcher, crash kit, and Essence-safe restraint rig for mobile stabilization.",
		mod_type: "vehicle",
		category: "utility",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"A proficient medic can stabilize a creature while the vehicle is stationary or moving slowly.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-containment-crate",
		name: "Containment Crate",
		display_name: "Containment Crate",
		description:
			"Warded cargo crate for unstable salvage, cores, relic fragments, or contaminated samples.",
		mod_type: "vehicle",
		category: "utility",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Carry one volatile material cache without exposing the cabin unless the crate is breached.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-front-winch",
		name: "Front Winch",
		display_name: "Front Winch",
		description:
			"Heavy extraction winch with rune-etched cable, tow hook, and emergency anchor spikes.",
		mod_type: "vehicle",
		category: "utility",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Advantage on one vehicle extraction, towing, or forced-movement check per scene.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-spare-parts-locker",
		name: "Spare Parts Locker",
		display_name: "Spare Parts Locker",
		description:
			"Field parts, sealant, belts, rune fuses, and hand tools packed for one meaningful repair.",
		mod_type: "vehicle",
		category: "repair",
		vrp_cost: 1,
		capacity_cost: 1,
		effect: "Complete one minor repair without scavenging parts first.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-field-repair-arm",
		name: "Field Repair Arm",
		display_name: "Field Repair Arm",
		description:
			"Compact manipulator arm with torque tools and insulated grip for dangerous undercarriage work.",
		mod_type: "vehicle",
		category: "repair",
		vrp_cost: 3,
		capacity_cost: 2,
		effect:
			"Attempt a major vehicle repair in the field without a full workshop.",
		source_book: RA_SOURCE,
	},
	{
		id: "vehicle-mod-drone-cradle",
		name: "Drone Cradle",
		display_name: "Drone Cradle",
		description:
			"Docking cradle, battery pack, and relay handshake for Bureau scout or cargo drones.",
		mod_type: "vehicle",
		category: "utility",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Carry, recharge, and launch one drone without unpacking a separate case.",
		source_book: RA_SOURCE,
	},
];

export const mountMods: CompendiumVehicleMod[] = [
	{
		id: "mount-mod-panic-hood",
		name: "Panic Hood",
		display_name: "Panic Hood",
		description:
			"Soft blackout hood and scent pad that help trained animals cross impossible threshold sights.",
		mod_type: "mount",
		category: "tack",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Mount gains advantage on the first fear or panic check in a scene.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-essence-calm-barding",
		name: "Essence-Calm Barding",
		display_name: "Essence-Calm Barding",
		description:
			"Light barding stitched with grounding sigils that keeps a mount steady near unstable Essence.",
		mod_type: "mount",
		category: "tack",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Reduce mount condition worsening from Essence surges by one step once per mission.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-cargo-harness",
		name: "Cargo Harness",
		display_name: "Cargo Harness",
		description:
			"Balanced panniers, sample loops, and quick-release straps for carrying salvage without injuring the animal.",
		mod_type: "mount",
		category: "tack",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Increase practical cargo capacity by 25 percent for non-rider loads.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-rescue-litter",
		name: "Rescue Litter",
		display_name: "Rescue Litter",
		description:
			"Foldout casualty sling that lets a mount team carry a wounded Ascendant without improvised rigging.",
		mod_type: "mount",
		category: "tack",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Carry one stable casualty without imposing disadvantage on normal travel checks.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-threshold-desensitization",
		name: "Threshold Desensitization",
		display_name: "Threshold Desensitization",
		description:
			"Training package for strobing Rifts, gravity lurches, rune alarms, and alien weather.",
		mod_type: "mount",
		category: "training",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Mount starts each mission at Calm unless already injured or broken.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-search-pattern-training",
		name: "Search Pattern Training",
		display_name: "Search Pattern Training",
		description:
			"Handler drills for scent grids, relay returns, and finding the party after line-of-sight breaks.",
		mod_type: "mount",
		category: "training",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Mount team can assist SENSE checks to find tracks, injured allies, or safe paths.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-hazard-shoes",
		name: "Hazard Shoes",
		display_name: "Hazard Shoes",
		description:
			"Hoof, paw, or claw protection for glass, heat, corrosive water, and spined terrain.",
		mod_type: "mount",
		category: "tack",
		vrp_cost: 1,
		capacity_cost: 1,
		effect:
			"Ignore the first minor terrain injury the mount would suffer each travel scene.",
		source_book: RA_SOURCE,
	},
	{
		id: "mount-mod-handler-link",
		name: "Handler Link",
		display_name: "Handler Link",
		description:
			"Short-range charm and haptic lead that lets a handler issue simple commands through heavy interference.",
		mod_type: "mount",
		category: "training",
		vrp_cost: 2,
		capacity_cost: 1,
		effect:
			"Handler can command the mount at up to 120 feet if line of effect is not blocked.",
		source_book: RA_SOURCE,
	},
];

export const allVehicleMods = [...vehicleMods, ...mountMods];
