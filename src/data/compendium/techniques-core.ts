import type { CompendiumTechnique } from "../../types/compendium";

export const techniques_core: CompendiumTechnique[] = [
	{
		id: "guardian-stance",
		classes: ["Technomancer"],
		name: "Guardian Stance",
		display_name: "Guardian Stance",
		description:
			"Drops the caster into a defensive stance that channels incoming blows into their resource pool. Grants 4d6 temporary HP to the caster for 1 minute or until struck at 0 HP.",
		lore: {
			origin: "A relic of the Shadow Legion.",
			history:
				"Catalogued in the Bureau's standard rank-appropriate compendium.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Available to Bureau-certified casters at the appropriate rank.",
			prior_owners: ["A dead Guild Master", "Bureau Artifact Vault"],
		},
		flavor: "An entry in the Hunter Bureau's approved catalog.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Ascendant Core Rulebook",
		effects: {
			primary: "Grants 4d6 temporary HP to the caster.",
			secondary: "Lasts 1 minute or until the caster reaches 0 HP.",
		},
		type: "Combat Arts",
		style: "Guild Vanguard",
		level_requirement: 5,
		uses_per_rest_formula: "3/long rest",
		activation: {
			type: "action",
		},
		range: "Self",
		duration: "1 minute",
		mechanics: {
			damage_profile: "self-heal",
			ability: "Vitality",
			lattice_interaction: "Weapon-mana fusion technique",
			healing: {
				dice: "4d6",
				type: "temp_hp",
				bonus: 0,
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Requires a melee weapon"],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["resonance-anomaly", "post-awakening", "rift-energy"],
	},
	{
		id: "phase-walk",
		classes: ["Assassin", "Striker", "Technomancer"],
		name: "Phase Walk",
		display_name: "Phase Walk",
		description:
			"The caster ghost-steps 30 feet through interposing terrain, ignoring difficult-terrain penalties. A creature within 5 feet of the path fails a DC 15 Agility save and cannot trigger opportunity-attacks on the walk. A creature within 5 feet of the path succeeds and retains its reaction.",
		lore: {
			origin: "Passed down by a forgotten Guild Master.",
			history:
				"Catalogued in the Bureau's standard rank-appropriate compendium.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Available to Bureau-certified casters at the appropriate rank.",
			prior_owners: ["A dead Guild Master", "Bureau Artifact Vault"],
		},
		flavor: "An entry in the Hunter Bureau's approved catalog.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Ascendant Core Rulebook",
		effects: {
			primary: "Inflicts a non-damage condition on a failed save.",
			secondary: "Utility effect: see saving-throw entry.",
		},
		type: "Combat Arts",
		style: "Guild Vanguard",
		level_requirement: 5,
		uses_per_rest_formula: "3/long rest",
		activation: {
			type: "action",
		},
		range: "60 feet",
		duration: "Instantaneous",
		mechanics: {
			damage_profile: "utility",
			ability: "Intelligence",
			lattice_interaction: "Body-lattice synchronization",
			attack: {
				type: "bludgeoning",
				mode: "both",
				resolution: "unarmed_strike",
				modifier: "Agility",
				damage: "—",
				damage_type: "bludgeoning",
			},
			saving_throw: {
				ability: "Agility",
				dc: 8,
				success: "Half damage",
				failure: "Full damage",
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Requires a melee weapon"],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["forbidden", "urban-combat"],
	},
	{
		id: "guardians-rebuke",
		classes: ["Striker", "Technomancer"],
		name: "Guardian's Rebuke",
		display_name: "Guardian's Rebuke",
		description:
			"Interposes the caster in front of a melee strike targeting an ally within 5 feet. The attacker fails a DC 15 Strength save and has disadvantage on its next attack roll this turn. The attacker succeeds and resolves its attack normally against the original target.",
		lore: {
			origin: "Developed by the Academy of High Magic.",
			history:
				"Catalogued in the Bureau's standard rank-appropriate compendium.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Neutral in personality profile.",
			current_owner:
				"Available to Bureau-certified casters at the appropriate rank.",
			prior_owners: ["A dead Guild Master", "Bureau Artifact Vault"],
		},
		flavor: "A tuned release of accumulated resonance.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Ascendant Core Rulebook",
		effects: {
			primary: "Inflicts a non-damage condition on a failed save.",
			secondary: "Utility effect: see saving-throw entry.",
		},
		type: "Combat Arts",
		style: "Guild Vanguard",
		level_requirement: 5,
		uses_per_rest_formula: "3/long rest",
		activation: {
			type: "action",
		},
		range: "60 feet",
		duration: "Instantaneous",
		mechanics: {
			damage_profile: "utility",
			ability: "Intelligence",
			lattice_interaction: "Ki-channeled strike",
			attack: {
				type: "slashing",
				mode: "melee",
				resolution: "unarmed_strike",
				modifier: "Strength",
				damage: "—",
				damage_type: "slashing",
			},
			saving_throw: {
				ability: "Strength",
				dc: 12,
				success: "No effect",
				failure: "Full damage and prone",
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Requires a melee weapon"],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["post-awakening", "dimensional-bleed"],
	},
];
