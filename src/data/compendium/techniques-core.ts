import type { CompendiumTechnique } from "../../types/compendium";

export const techniques_core: CompendiumTechnique[] = [
	{
		id: "guardian-stance",
		classes: [
			"Destroyer",
			"Berserker",
			"Assassin",
			"Striker",
			"Holy Knight",
			"Stalker",
			"Technomancer",
			"Revenant",
		],
		name: "Guardian Stance",
		display_name: "Guardian Stance",
		description:
			"Drops the caster into a defensive stance that channels incoming blows into their resource pool. Grants 4d6 temporary HP to the caster for 1 minute or until struck at 0 HP.",
		lore: {
			origin: "A relic of the Shadow Legion.",
			history:
				"Standardized from a Guild Vanguard bracing drill used to anchor a collapsing front line.",
			curse: "",
			personality:
				"Steadfast; it settles the wielder's stance before a blow lands.",
			current_owner: "Drilled into vanguard and shield-line specialists.",
			prior_owners: ["The Bulwark Company", "Bureau Shared-Materiel Archive"],
		},
		flavor: "Take the hit so the line doesn't break.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
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
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core.",
		theme_tags: ["resonance-anomaly", "post-awakening", "rift-energy"],
	},
	{
		id: "phase-walk",
		classes: [
			"Destroyer",
			"Berserker",
			"Assassin",
			"Striker",
			"Holy Knight",
			"Stalker",
			"Technomancer",
			"Revenant",
		],
		name: "Phase Walk",
		display_name: "Phase Walk",
		description:
			"The caster ghost-steps 30 feet through interposing terrain, ignoring difficult-terrain penalties. A creature within 5 feet of the path fails a DC 15 Agility save and cannot trigger opportunity-attacks on the walk. A creature within 5 feet of the path succeeds and retains its reaction.",
		lore: {
			origin: "Passed down by a forgotten Guild Master.",
			history:
				"Reconstructed from a Stalker infiltration kata for slipping a guarded perimeter.",
			curse: "",
			personality:
				"Restless; the wielder's outline blurs a half-second before they move.",
			current_owner:
				"Practiced by skirmishers who fight where the ground won't cooperate.",
			prior_owners: ["The Driftstep School", "Bureau Shared-Materiel Archive"],
		},
		flavor: "Here, then there. The wall was a suggestion.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Inflicts a non-damage condition on a failed save.",
			secondary: "Creatures near the path save to retain their reactions.",
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
			saving_throw: {
				ability: "Agility",
				dc: 15,
				success:
					"Retains its reaction and may take opportunity attacks normally.",
				failure:
					"Cannot take opportunity attacks against the caster during the walk.",
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Requires a melee weapon"],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites.",
		theme_tags: ["forbidden", "urban-combat"],
	},
	{
		id: "guardians-rebuke",
		classes: [
			"Destroyer",
			"Berserker",
			"Assassin",
			"Striker",
			"Holy Knight",
			"Stalker",
			"Technomancer",
			"Revenant",
		],
		name: "Guardian's Rebuke",
		display_name: "Guardian's Rebuke",
		description:
			"Interposes the caster in front of a melee strike targeting an ally within 5 feet. The attacker fails a DC 15 Strength save and has disadvantage on its next attack roll this turn. The attacker succeeds and resolves its attack normally against the original target.",
		lore: {
			origin: "Developed by the Academy of High Magic.",
			history:
				"Developed at the Academy of High Magic as a specialized interposition technique for close-quarters Rift defense.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Protective; flares when allies take damage nearby.",
			current_owner:
				"Assigned to Bureau front-line Vanguard squads for active Rift deployment.",
			prior_owners: [
				"Academy of High Magic Combat Division",
				"Bureau Front-Line Archives",
			],
		},
		flavor: "She didn't dodge. She stepped in front.",
		tags: ["awakened", "magic", "technique"],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Inflicts a non-damage condition on a failed save.",
			secondary:
				"The attacker remains focused on the primary target if the maneuver fails.",
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
			saving_throw: {
				ability: "Strength",
				dc: 15,
				success: "Resolves its attack normally against the original target.",
				failure: "Has disadvantage on its next attack roll this turn.",
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Requires a melee weapon"],
		},
		discovery_lore:
			"Found washed ashore near a coastal Rift, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["post-awakening", "dimensional-bleed"],
	},
];
