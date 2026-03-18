import type { CompendiumSpell } from "@/types/compendium";

export const spells_d: CompendiumSpell[] = [
	{
		id: "spell-0001",
		name: "Shadow Bolt",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Make a ranged spell attack against a target. On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		level: 1,
		school: "Necromancy",
		castingTime: "1 action",
		range: {
			type: "distance",
			value: 60,
			unit: "ft",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
		},
		duration: {
			type: "instant",
		},
		concentration: false,
		ritual: false,
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0001.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		atHigherLevels:
			"When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
		classes: ["Mage", "Contractor", "Revenant"],
		spellAttack: {
			type: "ranged",
			ability: "spellcasting",
			damage: "2d6 necrotic",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		effects: {
			primary:
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor:
			"In the post-reset lattice, Shadow Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
	},
	{
		id: "spell-0006",
		name: "Divine Bolt",
		description:
			"Weave minor holy energy into a protective manifestation as celestial power descends. Divine Bolt shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0006.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Divine Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0011",
		name: "Holy Bolt",
		description:
			"Harness minor holy energy as sacred energy surges. Holy Bolt manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0011.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Holy Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0016",
		name: "Demonic Blast",
		description:
			"Draw upon minor arcane energy as magical weave tightens around the wounded. Demonic Blast heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0016.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 15,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Demonic Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0021",
		name: "Frozen Blast",
		description:
			"Channel minor ice energy as frost crystallizes around your hands. Frozen Blast pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0021.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 38,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Frozen Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0026",
		name: "Void Storm",
		description:
			"Weave minor void energy into a protective manifestation as the void beckons. Void Storm deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0026.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 55,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Void Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0031",
		name: "Arcane Storm",
		description:
			"Harness minor lightning energy as electricity arcs. Arcane Storm weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0031.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 55,
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Arcane Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0036",
		name: "Dark Storm",
		description:
			"Draw upon minor lightning energy as thunder rumbles around the wounded. Dark Storm purifies damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0036.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
		range: {
			type: "distance",
			value: 12,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Dark Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0041",
		name: "Celestial Wave",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Wave strikes the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0041.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 37,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 63,
		},
		flavor:
			"In the post-reset lattice, Celestial Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0046",
		name: "Voltaic Barrier",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Voltaic Barrier fortifies against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0046.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 36,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Voltaic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0051",
		name: "Abyssal Nova",
		description:
			"Harness minor abyssal energy as hellfire ignites. Abyssal Nova transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0051.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Abyssal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0056",
		name: "Infernal Nova",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Nova rejuvenates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0056.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"In the post-reset lattice, Infernal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0061",
		name: "Shadow Barrier",
		description:
			"Channel minor shadow energy as darkness coalesces around your hands. Shadow Barrier strikes the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0061.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 44,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Shadow Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0066",
		name: "Divine Barrier",
		description:
			"Weave minor holy energy into a protective manifestation as sacred energy surges. Divine Barrier barriers against against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0066.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 24,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"In the post-reset lattice, Divine Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0071",
		name: "Holy Barrier",
		description:
			"Harness minor holy energy as celestial power descends. Holy Barrier transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0071.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 58,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Holy Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0076",
		name: "Demonic Shield",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Shield heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0076.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 35,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 11,
		},
		flavor:
			"In the post-reset lattice, Demonic Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0081",
		name: "Frozen Shield",
		description:
			"Channel minor ice energy as frost crystallizes around your hands. Frozen Shield devastates the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0081.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Frozen Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0086",
		name: "Void Curse",
		description:
			"Weave minor void energy into a protective manifestation as dimensional rift tears open. Void Curse guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0086.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 48,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"In the post-reset lattice, Void Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0091",
		name: "Arcane Curse",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Curse reshapes the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0091.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 18,
		},
		flavor:
			"In the post-reset lattice, Arcane Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0096",
		name: "Dark Curse",
		description:
			"Draw upon minor arcane energy as magical weave tightens around the wounded. Dark Curse heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0096.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 57,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Dark Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0101",
		name: "Celestial Blessing",
		description:
			"Channel minor holy energy as divine light blazes around your hands. Celestial Blessing assaults the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0101.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 57,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"In the post-reset lattice, Celestial Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0106",
		name: "Thunder Blessing",
		description:
			"Weave minor lightning energy into a protective manifestation as static crackles. Thunder Blessing wards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0106.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 24,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Thunder Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0111",
		name: "Abyssal Healing",
		description:
			"Harness minor abyssal energy as demonic resonance builds. Abyssal Healing channels the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0111.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Abyssal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0116",
		name: "Infernal Healing",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Healing heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0116.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 28,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Infernal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0121",
		name: "Shadow Restoration",
		description:
			"Channel minor shadow energy as darkness coalesces around your hands. Shadow Restoration pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0121.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 63,
		},
		flavor:
			"In the post-reset lattice, Shadow Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0126",
		name: "Divine Restoration",
		description:
			"Weave minor holy energy into a protective manifestation as sacred energy surges. Divine Restoration deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0126.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Divine Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0131",
		name: "Holy Restoration",
		description:
			"Harness minor holy energy as divine light blazes. Holy Restoration transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0131.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 55,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 74,
		},
		flavor:
			"In the post-reset lattice, Holy Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0136",
		name: "Demonic Destruction",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Destruction regenerates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0136.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Demonic Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0141",
		name: "Frozen Destruction",
		description:
			"Channel minor ice energy as cold bites deep around your hands. Frozen Destruction blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0141.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 43,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Frozen Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0146",
		name: "Void Summoning",
		description:
			"Weave minor void energy into a protective manifestation as the void beckons. Void Summoning guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0146.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Void Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0151",
		name: "Arcane Summoning",
		description:
			"Harness minor arcane energy as arcane sigils flare. Arcane Summoning alters the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0151.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Arcane Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0156",
		name: "Dark Summoning",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Summoning revitalizes damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0156.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Dark Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0161",
		name: "Celestial Binding",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Binding hammers the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0161.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 59,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Celestial Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0166",
		name: "Thunder Binding",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Binding fortifies against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0166.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Thunder Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0171",
		name: "Abyssal Teleportation",
		description:
			"Harness minor abyssal energy as the abyss responds. Abyssal Teleportation weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0171.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Abyssal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0176",
		name: "Infernal Teleportation",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Teleportation mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0176.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 18,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Infernal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0181",
		name: "Shadow Transformation",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Transformation assaults the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0181.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 36,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Shadow Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0186",
		name: "Divine Transformation",
		description:
			"Weave minor holy energy into a protective manifestation as divine light blazes. Divine Transformation guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0186.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 38,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Divine Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0191",
		name: "Holy Transformation",
		description:
			"Harness minor holy energy as divine light blazes. Holy Transformation crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0191.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 15,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Holy Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0196",
		name: "Demonic Bolt",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Bolt mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0196.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 38,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Demonic Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0201",
		name: "Frozen Bolt",
		description:
			"Channel minor ice energy as permafrost spreads around your hands. Frozen Bolt shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0201.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 58,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Frozen Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0206",
		name: "Void Blast",
		description:
			"Weave minor void energy into a protective manifestation as the void beckons. Void Blast barriers against against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0206.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Void Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0211",
		name: "Arcane Blast",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Blast alters the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0211.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 48,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Arcane Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0216",
		name: "Dark Blast",
		description:
			"Draw upon minor arcane energy as raw power coalesces around the wounded. Dark Blast mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0216.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Dark Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0221",
		name: "Celestial Storm",
		description:
			"Channel minor lightning energy as thunder rumbles around your hands. Celestial Storm blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0221.webp",
		effect:
			"On a hit, deals 2d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 52,
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
				"On a hit, deals 2d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"In the post-reset lattice, Celestial Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0226",
		name: "Thunder Storm",
		description:
			"Weave minor lightning energy into a protective manifestation as static crackles. Thunder Storm deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0226.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 55,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"In the post-reset lattice, Thunder Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0231",
		name: "Abyssal Wave",
		description:
			"Harness minor abyssal energy as hellfire ignites. Abyssal Wave reshapes the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0231.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Abyssal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0236",
		name: "Infernal Wave",
		description:
			"Draw upon minor fire energy as flames erupt around the wounded. Infernal Wave heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0236.webp",
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Infernal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0241",
		name: "Shadow Nova",
		description:
			"Channel minor shadow energy as umbral power surges around your hands. Shadow Nova pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0241.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 12,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Shadow Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0246",
		name: "Divine Nova",
		description:
			"Weave minor holy energy into a protective manifestation as radiance pours forth. Divine Nova barriers against against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0246.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 12,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Divine Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0251",
		name: "Holy Nova",
		description:
			"Harness minor holy energy as celestial power descends. Holy Nova crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0251.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 39,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Holy Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0256",
		name: "Demonic Barrier",
		description:
			"Draw upon minor arcane energy as mana crystallizes around the wounded. Demonic Barrier rejuvenates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0256.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 11,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Demonic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0261",
		name: "Frozen Barrier",
		description:
			"Channel minor ice energy as glacial power flows around your hands. Frozen Barrier assaults the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0261.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 39,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Frozen Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0266",
		name: "Void Shield",
		description:
			"Weave minor void energy into a protective manifestation as the void beckons. Void Shield deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0266.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 74,
		},
		flavor:
			"In the post-reset lattice, Void Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0271",
		name: "Arcane Shield",
		description:
			"Harness minor arcane energy as raw power coalesces. Arcane Shield channels the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0271.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 28,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Arcane Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0276",
		name: "Dark Shield",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Shield heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0276.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 39,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor:
			"In the post-reset lattice, Dark Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0281",
		name: "Celestial Curse",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Curse blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0281.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Celestial Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0286",
		name: "Thunder Curse",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Curse guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0286.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Thunder Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0291",
		name: "Abyssal Blessing",
		description:
			"Harness minor abyssal energy as the abyss responds. Abyssal Blessing weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0291.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 15,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0296",
		name: "Infernal Blessing",
		description:
			"Draw upon minor fire energy as infernal energy blazes around the wounded. Infernal Blessing rejuvenates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0296.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 11,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 72,
		},
		flavor:
			"In the post-reset lattice, Infernal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0301",
		name: "Shadow Healing",
		description:
			"Channel minor shadow energy as umbral power surges around your hands. Shadow Healing devastates the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0301.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 11,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Shadow Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0306",
		name: "Divine Healing",
		description:
			"Weave minor holy energy into a protective manifestation as divine light blazes. Divine Healing guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0306.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 48,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Divine Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0311",
		name: "Holy Healing",
		description:
			"Harness minor holy energy as celestial power descends. Holy Healing manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0311.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Holy Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0316",
		name: "Demonic Restoration",
		description:
			"Draw upon minor arcane energy as raw power coalesces around the wounded. Demonic Restoration restores damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0316.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 43,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Demonic Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0321",
		name: "Frozen Restoration",
		description:
			"Channel minor ice energy as frost crystallizes around your hands. Frozen Restoration pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0321.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Frozen Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0326",
		name: "Void Destruction",
		description:
			"Weave minor void energy into a protective manifestation as reality thins. Void Destruction deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0326.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 30,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor:
			"In the post-reset lattice, Void Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0331",
		name: "Arcane Destruction",
		description:
			"Harness minor arcane energy as raw power coalesces. Arcane Destruction crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0331.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 20,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Arcane Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0336",
		name: "Dark Destruction",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Destruction heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0336.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 12,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Dark Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0341",
		name: "Celestial Summoning",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Summoning rends the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0341.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 32,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Celestial Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0346",
		name: "Thunder Summoning",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Summoning shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0346.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 10,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Thunder Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0351",
		name: "Abyssal Binding",
		description:
			"Harness minor abyssal energy as demonic resonance builds. Abyssal Binding manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0351.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"In the post-reset lattice, Abyssal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0356",
		name: "Infernal Binding",
		description:
			"Draw upon minor fire energy as embers spiral around the wounded. Infernal Binding heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0356.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 44,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Infernal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0361",
		name: "Shadow Teleportation",
		description:
			"Channel minor shadow energy as void energy pulses around your hands. Shadow Teleportation rends the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0361.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 19,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Shadow Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0366",
		name: "Divine Teleportation",
		description:
			"Weave minor holy energy into a protective manifestation as radiance pours forth. Divine Teleportation guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0366.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Divine Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0371",
		name: "Holy Teleportation",
		description:
			"Harness minor holy energy as divine light blazes. Holy Teleportation crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0371.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Holy Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0376",
		name: "Demonic Transformation",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Transformation revitalizes damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0376.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 42,
		},
		flavor:
			"In the post-reset lattice, Demonic Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0381",
		name: "Frozen Transformation",
		description:
			"Channel minor ice energy as cold bites deep around your hands. Frozen Transformation hammers the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0381.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Frozen Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0386",
		name: "Void Bolt",
		description:
			"Weave minor void energy into a protective manifestation as reality thins. Void Bolt barriers against against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0386.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 44,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Void Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0391",
		name: "Arcane Bolt",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Bolt crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0391.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"In the post-reset lattice, Arcane Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0396",
		name: "Dark Bolt",
		description:
			"Draw upon minor arcane energy as raw power coalesces around the wounded. Dark Bolt mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0396.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 55,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Dark Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0401",
		name: "Celestial Blast",
		description:
			"Channel minor holy energy as radiance pours forth around your hands. Celestial Blast shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0401.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 32,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Celestial Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0406",
		name: "Thunder Blast",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Blast shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0406.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		range: {
			type: "distance",
			value: 28,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Thunder Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0411",
		name: "Abyssal Storm",
		description:
			"Harness minor abyssal energy as demonic resonance builds. Abyssal Storm weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0411.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Abyssal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0416",
		name: "Infernal Storm",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Storm rejuvenates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0416.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Infernal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0421",
		name: "Shadow Wave",
		description:
			"Channel minor shadow energy as void energy pulses around your hands. Shadow Wave blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0421.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 52,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Shadow Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0426",
		name: "Divine Wave",
		description:
			"Weave minor holy energy into a protective manifestation as radiance pours forth. Divine Wave guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0426.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 12,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Divine Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0431",
		name: "Holy Wave",
		description:
			"Harness minor holy energy as sacred energy surges. Holy Wave manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0431.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"In the post-reset lattice, Holy Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0436",
		name: "Demonic Nova",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Nova restores damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0436.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 38,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Demonic Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0441",
		name: "Frozen Nova",
		description:
			"Channel minor ice energy as glacial power flows around your hands. Frozen Nova hammers the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0441.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"In the post-reset lattice, Frozen Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0446",
		name: "Void Barrier",
		description:
			"Weave minor void energy into a protective manifestation as reality thins. Void Barrier guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0446.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 35,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Void Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0451",
		name: "Arcane Barrier",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Barrier crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0451.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Arcane Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0456",
		name: "Dark Barrier",
		description:
			"Draw upon minor arcane energy as mana crystallizes around the wounded. Dark Barrier purifies damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0456.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 33,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Dark Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0461",
		name: "Celestial Shield",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Shield hammers the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0461.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 39,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Celestial Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0466",
		name: "Thunder Shield",
		description:
			"Weave minor lightning energy into a protective manifestation as electricity arcs. Thunder Shield fortifies against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0466.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Thunder Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0471",
		name: "Abyssal Curse",
		description:
			"Harness minor abyssal energy as the abyss responds. Abyssal Curse reshapes the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0471.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 32,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor:
			"In the post-reset lattice, Abyssal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0476",
		name: "Infernal Curse",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Curse mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0476.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Infernal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0481",
		name: "Shadow Blessing",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Blessing rends the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0481.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Shadow Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0486",
		name: "Divine Blessing",
		description:
			"Weave minor holy energy into a protective manifestation as divine light blazes. Divine Blessing barriers against against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0486.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 72,
		},
		flavor:
			"In the post-reset lattice, Divine Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0491",
		name: "Holy Blessing",
		description:
			"Harness minor holy energy as radiance pours forth. Holy Blessing weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0491.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 44,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor:
			"In the post-reset lattice, Holy Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0496",
		name: "Demonic Healing",
		description:
			"Draw upon minor arcane energy as mana crystallizes around the wounded. Demonic Healing mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0496.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 43,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Demonic Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0501",
		name: "Frozen Healing",
		description:
			"Channel minor ice energy as glacial power flows around your hands. Frozen Healing rends the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0501.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Frozen Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0506",
		name: "Void Restoration",
		description:
			"Weave minor void energy into a protective manifestation as entropy accelerates. Void Restoration guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0506.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 58,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Void Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0511",
		name: "Arcane Restoration",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Restoration transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0511.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 11,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"In the post-reset lattice, Arcane Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0516",
		name: "Dark Restoration",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Restoration mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0516.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 35,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Dark Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0521",
		name: "Celestial Destruction",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Destruction shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0521.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 52,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Celestial Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0526",
		name: "Thunder Destruction",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Destruction shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0526.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 63,
		},
		flavor:
			"In the post-reset lattice, Thunder Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0531",
		name: "Abyssal Summoning",
		description:
			"Harness minor abyssal energy as demonic resonance builds. Abyssal Summoning reshapes the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0531.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Abyssal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0536",
		name: "Infernal Summoning",
		description:
			"Draw upon minor fire energy as heat distorts the air around the wounded. Infernal Summoning purifies damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0536.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 28,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Infernal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0541",
		name: "Shadow Binding",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Binding hammers the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0541.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 43,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor:
			"In the post-reset lattice, Shadow Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0546",
		name: "Divine Binding",
		description:
			"Weave minor holy energy into a protective manifestation as celestial power descends. Divine Binding deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0546.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 43,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor:
			"In the post-reset lattice, Divine Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0551",
		name: "Holy Binding",
		description:
			"Harness minor holy energy as divine light blazes. Holy Binding manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0551.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Holy Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0556",
		name: "Demonic Teleportation",
		description:
			"Draw upon minor arcane energy as magical weave tightens around the wounded. Demonic Teleportation heals damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0556.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 58,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"In the post-reset lattice, Demonic Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0561",
		name: "Frozen Teleportation",
		description:
			"Channel minor ice energy as glacial power flows around your hands. Frozen Teleportation shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0561.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 20,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Frozen Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0566",
		name: "Void Transformation",
		description:
			"Weave minor void energy into a protective manifestation as entropy accelerates. Void Transformation guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0566.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 86,
		},
		flavor:
			"In the post-reset lattice, Void Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0571",
		name: "Arcane Transformation",
		description:
			"Harness minor arcane energy as mana crystallizes. Arcane Transformation crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0571.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Arcane Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0576",
		name: "Dark Transformation",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Transformation rejuvenates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0576.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 59,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Dark Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0581",
		name: "Celestial Bolt",
		description:
			"Channel minor holy energy as radiance pours forth around your hands. Celestial Bolt pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0581.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 32,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Celestial Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0586",
		name: "Thunder Bolt",
		description:
			"Weave minor lightning energy into a protective manifestation as static crackles. Thunder Bolt fortifies against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0586.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 27,
		},
		flavor:
			"In the post-reset lattice, Thunder Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0591",
		name: "Abyssal Blast",
		description:
			"Harness minor abyssal energy as abyssal energy erupts. Abyssal Blast channels the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0591.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 99,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0596",
		name: "Infernal Blast",
		description:
			"Draw upon minor fire energy as embers spiral around the wounded. Infernal Blast purifies damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0596.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 59,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Infernal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0601",
		name: "Shadow Storm",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Storm shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0601.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 10,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Shadow Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0606",
		name: "Divine Storm",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Divine Storm protects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0606.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Divine Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0611",
		name: "Holy Storm",
		description:
			"Harness minor lightning energy as thunder rumbles. Holy Storm weaves the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0611.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 52,
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Holy Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0616",
		name: "Demonic Wave",
		description:
			"Draw upon minor arcane energy as magical weave tightens around the wounded. Demonic Wave mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0616.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 59,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"In the post-reset lattice, Demonic Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0621",
		name: "Frozen Wave",
		description:
			"Channel minor ice energy as permafrost spreads around your hands. Frozen Wave devastates the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0621.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Frozen Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0626",
		name: "Void Nova",
		description:
			"Weave minor void energy into a protective manifestation as entropy accelerates. Void Nova shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0626.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 68,
		},
		flavor:
			"In the post-reset lattice, Void Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0631",
		name: "Arcane Nova",
		description:
			"Harness minor arcane energy as raw power coalesces. Arcane Nova crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0631.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Arcane Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0636",
		name: "Dark Nova",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Nova revitalizes damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0636.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"In the post-reset lattice, Dark Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0641",
		name: "Celestial Barrier",
		description:
			"Channel minor holy energy as divine light blazes around your hands. Celestial Barrier devastates the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0641.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 20,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Celestial Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0646",
		name: "Thunder Barrier",
		description:
			"Weave minor lightning energy into a protective manifestation as voltage surges. Thunder Barrier deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0646.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 74,
		},
		flavor:
			"In the post-reset lattice, Thunder Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0651",
		name: "Abyssal Shield",
		description:
			"Harness minor abyssal energy as the abyss responds. Abyssal Shield manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0651.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 18,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Abyssal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0656",
		name: "Infernal Shield",
		description:
			"Draw upon minor fire energy as embers spiral around the wounded. Infernal Shield restores damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0656.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 55,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Infernal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0661",
		name: "Shadow Curse",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Curse devastates the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0661.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Shadow Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0666",
		name: "Divine Curse",
		description:
			"Weave minor holy energy into a protective manifestation as divine light blazes. Divine Curse deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0666.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 15,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Divine Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0671",
		name: "Holy Curse",
		description:
			"Harness minor holy energy as divine light blazes. Holy Curse channels the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0671.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Holy Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0676",
		name: "Demonic Blessing",
		description:
			"Draw upon minor arcane energy as raw power coalesces around the wounded. Demonic Blessing mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0676.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Demonic Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0681",
		name: "Frozen Blessing",
		description:
			"Channel minor ice energy as frost crystallizes around your hands. Frozen Blessing blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0681.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 36,
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Frozen Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0686",
		name: "Void Healing",
		description:
			"Weave minor void energy into a protective manifestation as entropy accelerates. Void Healing fortifies against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0686.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		range: {
			type: "distance",
			value: 24,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Void Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0691",
		name: "Arcane Healing",
		description:
			"Harness minor arcane energy as arcane sigils flare. Arcane Healing alters the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0691.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 20,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Arcane Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0696",
		name: "Dark Healing",
		description:
			"Draw upon minor arcane energy as mana crystallizes around the wounded. Dark Healing restores damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0696.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 33,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 11,
		},
		flavor:
			"In the post-reset lattice, Dark Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0701",
		name: "Celestial Restoration",
		description:
			"Channel minor holy energy as sacred energy surges around your hands. Celestial Restoration assaults the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0701.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 30,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Celestial Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0706",
		name: "Thunder Restoration",
		description:
			"Weave minor lightning energy into a protective manifestation as voltage surges. Thunder Restoration protects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0706.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Thunder Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0711",
		name: "Abyssal Destruction",
		description:
			"Harness minor abyssal energy as hellfire ignites. Abyssal Destruction manipulates the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0711.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Abyssal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0716",
		name: "Infernal Destruction",
		description:
			"Draw upon minor fire energy as infernal energy blazes around the wounded. Infernal Destruction regenerates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0716.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
		range: {
			type: "distance",
			value: 33,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Infernal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0721",
		name: "Shadow Summoning",
		description:
			"Channel minor shadow energy as darkness coalesces around your hands. Shadow Summoning blasts the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0721.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor:
			"In the post-reset lattice, Shadow Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0726",
		name: "Divine Summoning",
		description:
			"Weave minor holy energy into a protective manifestation as radiance pours forth. Divine Summoning guards against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0726.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Divine Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0731",
		name: "Holy Summoning",
		description:
			"Harness minor holy energy as radiance pours forth. Holy Summoning transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0731.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Holy Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0736",
		name: "Demonic Binding",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Demonic Binding mends damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0736.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 44,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"In the post-reset lattice, Demonic Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0741",
		name: "Frozen Binding",
		description:
			"Channel minor ice energy as permafrost spreads around your hands. Frozen Binding pierces the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0741.webp",
		effect:
			"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 2d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Frozen Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0746",
		name: "Void Teleportation",
		description:
			"Weave minor void energy into a protective manifestation as entropy accelerates. Void Teleportation shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0746.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Void Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0751",
		name: "Arcane Teleportation",
		description:
			"Harness minor arcane energy as magical weave tightens. Arcane Teleportation crafts the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0751.webp",
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 47,
		},
		flavor:
			"In the post-reset lattice, Arcane Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0756",
		name: "Dark Teleportation",
		description:
			"Draw upon minor arcane energy as arcane sigils flare around the wounded. Dark Teleportation purifies damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0756.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 28,
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
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Dark Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0761",
		name: "Celestial Transformation",
		description:
			"Channel minor holy energy as radiance pours forth around your hands. Celestial Transformation shreds the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0761.webp",
		effect:
			"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 47,
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
				"On a hit, deals 2d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Celestial Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0766",
		name: "Thunder Transformation",
		description:
			"Weave minor lightning energy into a protective manifestation as thunder rumbles. Thunder Transformation shields against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0766.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"In the post-reset lattice, Thunder Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0771",
		name: "Abyssal Bolt",
		description:
			"Harness minor abyssal energy as abyssal energy erupts. Abyssal Bolt transforms the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0771.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Abyssal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0776",
		name: "Infernal Bolt",
		description:
			"Draw upon minor fire energy as flames erupt around the wounded. Infernal Bolt regenerates damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0776.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Infernal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0781",
		name: "Shadow Blast",
		description:
			"Channel minor shadow energy as shadows gather around your hands. Shadow Blast strikes the target with concentrated destructive force. Ascendants learn this early in their awakening.",
		type: "Attack",
		rank: "D",
		image: "/generated/compendium/spells/spell-0781.webp",
		effect:
			"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		range: {
			type: "distance",
			value: 24,
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
				"On a hit, deals 2d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Shadow Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0786",
		name: "Divine Blast",
		description:
			"Weave minor holy energy into a protective manifestation as celestial power descends. Divine Blast deflects against incoming harm with layered magical barriers. Ascendants learn this early in their awakening.",
		type: "Defense",
		rank: "D",
		image: "/generated/compendium/spells/spell-0786.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		range: {
			type: "distance",
			value: 43,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Divine Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0791",
		name: "Holy Blast",
		description:
			"Harness minor holy energy as celestial power descends. Holy Blast reshapes the fabric of reality to produce extraordinary effects. Ascendants learn this early in their awakening.",
		type: "Utility",
		rank: "D",
		image: "/generated/compendium/spells/spell-0791.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 43,
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
				dc: 12,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Holy Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0796",
		name: "Demonic Storm",
		description:
			"Draw upon minor lightning energy as static crackles around the wounded. Demonic Storm revitalizes damaged tissue and restores vitality. Ascendants learn this early in their awakening.",
		type: "Healing",
		rank: "D",
		image: "/generated/compendium/spells/spell-0796.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "1d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Demonic Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
];
