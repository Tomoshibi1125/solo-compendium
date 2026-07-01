import type {
	CompendiumCraftingMaterial,
	CompendiumCraftingProject,
	CompendiumRecipe,
} from "@/types/compendium";

const RA_SOURCE = "Rift Ascendant Canon";

export const craftingMaterials: CompendiumCraftingMaterial[] = [
	{
		id: "material-rift-salvage",
		name: "Rift Salvage",
		display_name: "Rift Salvage",
		description:
			"Usable scrap recovered from damaged Bureau gear, threshold wreckage, or stable Interior structures.",
		material_type: "rift_salvage",
		rarity: "common",
		unit: "bundle",
		source_book: RA_SOURCE,
	},
	{
		id: "material-anomaly-tissue",
		name: "Anomaly Tissue",
		display_name: "Anomaly Tissue",
		description:
			"Harvested hide, chitin, bone, gland, or fiber from a defeated anomaly before the body fully decays.",
		material_type: "anomaly_material",
		rarity: "uncommon",
		unit: "sample",
		source_book: RA_SOURCE,
	},
	{
		id: "material-relic-fragment",
		name: "Relic Fragment",
		display_name: "Relic Fragment",
		description:
			"Broken relic matter that still carries a coherent magical memory and can anchor a refit.",
		material_type: "relic_fragment",
		rarity: "rare",
		unit: "fragment",
		source_book: RA_SOURCE,
	},
	{
		id: "material-essence-capacitor",
		name: "Essence Capacitor",
		display_name: "Essence Capacitor",
		description:
			"Insulated storage cell for a small charge of refined Essence, used in AFA, rune, and vehicle work.",
		material_type: "essence_component",
		rarity: "uncommon",
		unit: "cell",
		source_book: RA_SOURCE,
	},
	{
		id: "material-rune-fuse",
		name: "Rune Fuse",
		display_name: "Rune Fuse",
		description:
			"Replaceable safety fuse etched for one surge; field engineers burn through them quickly.",
		material_type: "field_part",
		rarity: "common",
		unit: "fuse",
		source_book: RA_SOURCE,
	},
	{
		id: "material-containment-foam",
		name: "Containment Foam",
		display_name: "Containment Foam",
		description:
			"Expanding sealant that slows residue leaks, sample decay, and small breach propagation.",
		material_type: "field_part",
		rarity: "common",
		unit: "canister",
		source_book: RA_SOURCE,
	},
	{
		id: "material-warded-thread",
		name: "Warded Thread",
		display_name: "Warded Thread",
		description:
			"Conductive thread used to stitch grounding sigils into tack, seals, pouches, and armor liners.",
		material_type: "essence_component",
		rarity: "uncommon",
		unit: "spool",
		source_book: RA_SOURCE,
	},
	{
		id: "material-field-ration-base",
		name: "Field Ration Base",
		display_name: "Field Ration Base",
		description:
			"Compact nutrition, electrolyte salts, and stabilizers for meals that survive hostile atmospheres.",
		material_type: "field_part",
		rarity: "common",
		unit: "kit",
		source_book: RA_SOURCE,
	},
];

export const craftingRecipes: CompendiumRecipe[] = [
	{
		id: "recipe-field-repair-minor",
		name: "Minor Field Repair",
		display_name: "Minor Field Repair",
		description:
			"Patch a strained or damaged vehicle, mount harness, drone shell, or carried field device without a full workshop.",
		recipe_type: "repair",
		rank: "D",
		time_required: "10 minutes",
		project_clock: 2,
		materials: [
			{ material_id: "material-rift-salvage", quantity: 1 },
			{ material_id: "material-rune-fuse", quantity: 1 },
		],
		required_tools: ["Tinker's tools or field engineering kit"],
		outcome:
			"Restore 2d6 hit points to a vehicle or clear one minor equipment fault.",
		failure_risk:
			"On a failed project check, the repair holds for one scene only.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-major-vehicle-rebuild",
		name: "Major Vehicle Rebuild",
		display_name: "Major Vehicle Rebuild",
		description:
			"Rebuild a crippled vehicle or drone platform in a field bay using salvaged parts and Essence-safe bracing.",
		recipe_type: "repair",
		rank: "C",
		time_required: "4 hours",
		project_clock: 6,
		materials: [
			{ material_id: "material-rift-salvage", quantity: 4 },
			{ material_id: "material-essence-capacitor", quantity: 1 },
			{ material_id: "material-containment-foam", quantity: 1 },
		],
		required_tools: ["Field bay or repair arm", "Tinker's tools"],
		outcome:
			"Move a vehicle from Crippled to Damaged and restore half its maximum hit points.",
		failure_risk: "A failed clock segment consumes one salvage bundle.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-cabin-seal-refit",
		name: "Cabin Seal Refit",
		display_name: "Cabin Seal Refit",
		description:
			"Refit a cabin, cart cover, or drone bay against ash, spores, miasma, and hostile rain.",
		recipe_type: "refit",
		rank: "D",
		time_required: "1 hour",
		project_clock: 3,
		materials: [
			{ material_id: "material-containment-foam", quantity: 2 },
			{ material_id: "material-warded-thread", quantity: 1 },
		],
		required_tools: ["Field engineering kit"],
		outcome:
			"Install a one-use environmental seal on a vehicle, cart, or portable shelter.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-afa-sensor-splice",
		name: "AFA Sensor Splice",
		display_name: "AFA Sensor Splice",
		description:
			"Patch an Arcane Field Analyzer relay into a vehicle mast, drone cradle, or portable tripod.",
		recipe_type: "field_engineering",
		rank: "C",
		time_required: "30 minutes",
		project_clock: 4,
		materials: [
			{ material_id: "material-essence-capacitor", quantity: 1 },
			{ material_id: "material-rune-fuse", quantity: 2 },
			{ material_id: "material-rift-salvage", quantity: 1 },
		],
		required_tools: ["AFA access", "Arcana or field engineering proficiency"],
		outcome:
			"Create a temporary relay that grants advantage on one scan sequence.",
		failure_risk:
			"A failed project check produces a false positive until recalibrated.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-residue-safe-rations",
		name: "Residue-Safe Rations",
		display_name: "Residue-Safe Rations",
		description:
			"Prepare sealed meals and hydration packs that resist minor Essence contamination during long operations.",
		recipe_type: "survival",
		rank: "D",
		time_required: "30 minutes",
		project_clock: 2,
		materials: [
			{ material_id: "material-field-ration-base", quantity: 2 },
			{ material_id: "material-containment-foam", quantity: 1 },
		],
		required_tools: ["Cook's utensils or survival kit"],
		outcome:
			"Create 4 safe ration servings; each grants advantage on one save against exposure from spoiled supplies.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-grounding-tack",
		name: "Grounding Tack",
		display_name: "Grounding Tack",
		description:
			"Stitch calming sigils into harness, saddle, or cargo tack for mounts operating near unstable Essence.",
		recipe_type: "refit",
		rank: "D",
		time_required: "1 hour",
		project_clock: 3,
		materials: [
			{ material_id: "material-warded-thread", quantity: 1 },
			{ material_id: "material-anomaly-tissue", quantity: 1 },
		],
		required_tools: ["Leatherworker's tools or handler kit"],
		outcome: "Install one mount tack mod that reduces panic risk.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-relic-anchor-bracket",
		name: "Relic Anchor Bracket",
		display_name: "Relic Anchor Bracket",
		description:
			"Build a braced socket that lets a relic fragment safely power a vehicle, workshop, or shelter effect.",
		recipe_type: "field_engineering",
		rank: "B",
		time_required: "8 hours",
		project_clock: 8,
		materials: [
			{ material_id: "material-relic-fragment", quantity: 1 },
			{ material_id: "material-rift-salvage", quantity: 3 },
			{ material_id: "material-essence-capacitor", quantity: 2 },
		],
		required_tools: ["Field bay", "Arcana proficiency"],
		outcome:
			"Create a stable anchor for one relic-powered project or major mod.",
		failure_risk:
			"A failed final check forces a containment complication before the bracket can be used.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-emergency-bridge-kit",
		name: "Emergency Bridge Kit",
		display_name: "Emergency Bridge Kit",
		description:
			"Convert salvage into a collapsible crossing panel for gaps, unstable floors, or short washouts.",
		recipe_type: "field_engineering",
		rank: "C",
		time_required: "2 hours",
		project_clock: 5,
		materials: [
			{ material_id: "material-rift-salvage", quantity: 3 },
			{ material_id: "material-rune-fuse", quantity: 1 },
		],
		required_tools: ["Field engineering kit"],
		outcome:
			"Create a reusable bridge panel that supports a medium vehicle or four creatures at a time.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-standard-issue-kit",
		name: "Standard-Issue Kit",
		display_name: "Standard-Issue Kit",
		description:
			"Assemble and ground a guild-pattern loadout — fitted straps, warded liners, and maintained fastenings for one member.",
		recipe_type: "refit",
		rank: "D",
		time_required: "1 hour",
		project_clock: 3,
		materials: [
			{ material_id: "material-rift-salvage", quantity: 2 },
			{ material_id: "material-warded-thread", quantity: 1 },
		],
		required_tools: ["Armory bench", "Leatherworker's or smith's tools"],
		outcome:
			"Refit one member's kit to guild standard; it counts as maintained, well-fitted gear.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-essence-tonic",
		name: "Essence Tonic",
		display_name: "Essence Tonic",
		description:
			"Steep cultivated essence-blooms into a mild restorative tonic that steadies a member between clears.",
		recipe_type: "consumable",
		rank: "D",
		time_required: "30 minutes",
		project_clock: 2,
		materials: [
			{ material_id: "material-anomaly-tissue", quantity: 1 },
			{ material_id: "material-field-ration-base", quantity: 1 },
		],
		required_tools: ["Alchemist's supplies or garden still"],
		outcome:
			"Create 2 tonics; drinking one restores 1d4 + 1 hit points and clears one point of fatigue.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-warding-incense",
		name: "Warding Incense",
		display_name: "Warding Incense",
		description:
			"Bind warded thread and bloom-resin into incense cones that bleed rift-residue out of a resting squad.",
		recipe_type: "refit",
		rank: "D",
		time_required: "45 minutes",
		project_clock: 2,
		materials: [
			{ material_id: "material-warded-thread", quantity: 1 },
			{ material_id: "material-containment-foam", quantity: 1 },
		],
		required_tools: ["Alchemist's supplies or garden still"],
		outcome:
			"Create 3 incense cones; burning one during a rest suppresses minor residue effects for the scene.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-stamina-draught",
		name: "Stamina Draught",
		display_name: "Stamina Draught",
		description:
			"Distill an electrolyte-and-essence draught that keeps a member on their feet through a long deployment.",
		recipe_type: "consumable",
		rank: "D",
		time_required: "30 minutes",
		project_clock: 2,
		materials: [
			{ material_id: "material-field-ration-base", quantity: 1 },
			{ material_id: "material-essence-capacitor", quantity: 1 },
		],
		required_tools: ["Alchemist's supplies or garden still"],
		outcome:
			"Create 2 draughts; drinking one grants advantage on the next save against exhaustion.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-greater-essence-elixir",
		name: "Greater Essence Elixir",
		display_name: "Greater Essence Elixir",
		description:
			"Refine a relic-catalyzed elixir from the sanctum's finest blooms — the guild's most potent consumable.",
		recipe_type: "consumable",
		rank: "B",
		time_required: "6 hours",
		project_clock: 6,
		materials: [
			{ material_id: "material-relic-fragment", quantity: 1 },
			{ material_id: "material-essence-capacitor", quantity: 2 },
			{ material_id: "material-anomaly-tissue", quantity: 1 },
		],
		required_tools: ["Alchemist's supplies", "Arcana proficiency"],
		outcome:
			"Create 1 elixir; drinking it restores 4d4 + 4 hit points and ends one non-permanent condition.",
		failure_risk:
			"A failed final check spoils the batch and consumes the relic fragment.",
		source_book: RA_SOURCE,
	},
	{
		id: "recipe-foundry-overcharge",
		name: "Foundry Overcharge",
		display_name: "Foundry Overcharge",
		description:
			"Push a relit foundry line past safe tolerances for a single refit no rented bench would risk running.",
		recipe_type: "field_engineering",
		rank: "C",
		time_required: "3 hours",
		project_clock: 5,
		materials: [
			{ material_id: "material-essence-capacitor", quantity: 2 },
			{ material_id: "material-rift-salvage", quantity: 2 },
		],
		required_tools: ["Guild forge line", "Tinker's tools"],
		outcome:
			"Complete one refit or repair project in half the usual clock by overdriving the foundry.",
		failure_risk:
			"A failed check overheats the line, consuming an extra essence capacitor.",
		source_book: RA_SOURCE,
	},
];

export const craftingProjects: CompendiumCraftingProject[] =
	craftingRecipes.map((recipe) => ({
		id: `project-${recipe.id.replace(/^recipe-/, "")}`,
		name: `${recipe.name} Project`,
		display_name: `${recipe.display_name ?? recipe.name} Project`,
		description: recipe.description,
		recipe_id: recipe.id,
		progress_required: recipe.project_clock,
		material_requirements: recipe.materials,
		source_book: recipe.source_book,
	}));

export const allCraftingEntries = [
	...craftingMaterials,
	...craftingRecipes,
	...craftingProjects,
];
