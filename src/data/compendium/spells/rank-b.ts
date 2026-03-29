export const spells_b = [
	{
		id: "spell-0228",
		name: "Dark Storm",
		description:
			"Draw upon significant lightning energy as electricity arcs around the wounded. Dark Storm restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0228.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
		range: {
			type: "distance",
			value: 17,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor: "Commands the darkness within. A desperate ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0233",
		name: "Celestial Wave",
		description:
			"Channel significant holy energy as sacred energy surges around your hands. Celestial Wave pierces the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0233.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 56,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"Commands all who stand in opposition. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0238",
		name: "Voltaic Barrier",
		description:
			"Weave significant lightning energy into a protective manifestation as electricity arcs. Voltaic Barrier fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0238.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 21,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 76,
		},
		flavor:
			"Bends all who stand in opposition. An absolute beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0243",
		name: "Abyssal Nova",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Nova transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0243.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 45,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"Destroys all who stand in opposition. A desperate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0248",
		name: "Infernal Nova",
		description:
			"Draw upon significant fire energy as embers spiral around the wounded. Infernal Nova regenerates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0248.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 13,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"Bends the remnants of humanity. An absolute dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0253",
		name: "Shadow Barrier",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Barrier strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0253.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 21,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 33,
		},
		flavor:
			"Shatters all who stand in opposition. A brutal whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0258",
		name: "Divine Barrier",
		description:
			"Weave significant holy energy into a protective manifestation as radiance pours forth. Divine Barrier protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0258.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 56,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"Overrides the arrogant and the mighty. A silent beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0263",
		name: "Holy Barrier",
		description:
			"Harness significant holy energy as divine light blazes. Holy Barrier reshapes the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0263.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 14,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 43,
		},
		flavor:
			"Destroys the concept of defeat. A sorrowful surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0268",
		name: "Demonic Shield",
		description:
			"Draw upon significant arcane energy as magical weave tightens around the wounded. Demonic Shield purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0268.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 23,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor:
			"Reclaims the fragile limits of flesh. A silent breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0273",
		name: "Frozen Shield",
		description:
			"Channel significant ice energy as frost crystallizes around your hands. Frozen Shield blasts the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0273.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 41,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"Ignores the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0278",
		name: "Void Curse",
		description:
			"Weave significant void energy into a protective manifestation as entropy accelerates. Void Curse deflects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0278.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 14,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor: "Reflects the darkness within. A chaotic ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0283",
		name: "Arcane Curse",
		description:
			"Harness significant arcane energy as raw power coalesces. Arcane Curse transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0283.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 45,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 63,
		},
		flavor:
			"Ignites the flow of time itself. A triumphant symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0288",
		name: "Dark Curse",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Curse purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0288.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 29,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"Commands the darkness within. A triumphant breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0293",
		name: "Celestial Blessing",
		description:
			"Channel significant holy energy as divine light blazes around your hands. Celestial Blessing assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0293.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 49,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0298",
		name: "Thunder Blessing",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Blessing shields against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0298.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 53,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"Crushes the arrogant and the mighty. An intricate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0303",
		name: "Abyssal Healing",
		description:
			"Harness significant abyssal energy as abyssal energy erupts. Abyssal Healing transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0303.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 31,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 59,
		},
		flavor:
			"Reclaims the quiet space between breaths. An overwhelming roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0308",
		name: "Infernal Healing",
		description:
			"Draw upon significant fire energy as embers spiral around the wounded. Infernal Healing restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0308.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 21,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"Weaves the quiet space between breaths. An absolute roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0313",
		name: "Shadow Restoration",
		description:
			"Channel significant shadow energy as shadows gather around your hands. Shadow Restoration rends the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0313.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 22,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"Overrides the arrogant and the mighty. A silent beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0318",
		name: "Divine Restoration",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Restoration barriers against against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0318.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 25,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 72,
		},
		flavor:
			"Crushes the arrogant and the mighty. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0323",
		name: "Holy Restoration",
		description:
			"Harness significant holy energy as divine light blazes. Holy Restoration weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0323.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 29,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"Crushes the dimensional divide. A forbidden testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0328",
		name: "Demonic Destruction",
		description:
			"Draw upon significant arcane energy as raw power coalesces around the wounded. Demonic Destruction purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0328.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 50,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"Destroys all who stand in opposition. A sorrowful beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0333",
		name: "Frozen Destruction",
		description:
			"Channel significant ice energy as glacial power flows around your hands. Frozen Destruction hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0333.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 16,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"Crushes the quiet space between breaths. A forbidden roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0338",
		name: "Void Summoning",
		description:
			"Weave significant void energy into a protective manifestation as dimensional rift tears open. Void Summoning guards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0338.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 34,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"Shatters the fragile limits of flesh. A brutal breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0343",
		name: "Arcane Summoning",
		description:
			"Harness significant arcane energy as mana crystallizes. Arcane Summoning transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0343.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 40,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"Reclaims the darkness within. A devastating breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0348",
		name: "Dark Summoning",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Summoning revitalizes damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0348.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 50,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"Reclaims the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0353",
		name: "Celestial Binding",
		description:
			"Channel significant holy energy as radiance pours forth around your hands. Celestial Binding rends the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0353.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 46,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"Weaves the fragile limits of flesh. An absolute ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0358",
		name: "Thunder Binding",
		description:
			"Weave significant lightning energy into a protective manifestation as static crackles. Thunder Binding fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0358.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 34,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0363",
		name: "Abyssal Teleportation",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Teleportation channels the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0363.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 26,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"Ignores the arrogant and the mighty. An absolute whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0368",
		name: "Infernal Teleportation",
		description:
			"Draw upon significant fire energy as heat distorts the air around the wounded. Infernal Teleportation restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0368.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 25,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"Bends the fragile limits of flesh. An absolute breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0373",
		name: "Shadow Transformation",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Transformation strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0373.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 51,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"Shatters the flow of time itself. A brutal testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0378",
		name: "Divine Transformation",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Transformation barriers against against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0378.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 54,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"Absorbs the remnants of humanity. An ancient dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0383",
		name: "Holy Transformation",
		description:
			"Harness significant holy energy as celestial power descends. Holy Transformation reshapes the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0383.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 50,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"Ignores the concept of defeat. A devastating dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
];
