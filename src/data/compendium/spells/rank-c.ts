import type { CompendiumSpell } from "@/types/compendium";

export const spells_c: CompendiumSpell[] = [
	{
		id: "spell-0002",
		name: "Void Bolt",
		description:
			"Weave moderate void energy into a protective manifestation as entropy accelerates. Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		level: 2,
		school: "Abjuration",
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
		concentration: true,
		ritual: false,
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0002.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		atHigherLevels:
			"When you cast this spell using a spell slot of 3rd level or higher, the temporary resistance extends to an additional damage type of your choice for each slot level above 2nd.",
		classes: ["Mage", "Contractor"],
		savingThrow: {
			ability: "none",
			dc: "none",
			success: "No effect",
			failure: "No effect",
		},
		area: {
			type: "sphere",
			size: "10-foot radius",
			shape: "sphere",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		effects: {
			primary:
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {},
		flavor:
			"In the post-reset lattice, Void Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
	},
	{
		id: "spell-0007",
		name: "Arcane Bolt",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Bolt channels the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0007.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Arcane Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0012",
		name: "Dark Bolt",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Dark Bolt rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0012.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Dark Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0017",
		name: "Celestial Blast",
		description:
			"Channel moderate holy energy as radiance pours forth around your hands. Celestial Blast blasts the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0017.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Celestial Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0022",
		name: "Thunder Blast",
		description:
			"Weave moderate lightning energy into a protective manifestation as electricity arcs. Thunder Blast wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0022.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Thunder Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0027",
		name: "Abyssal Storm",
		description:
			"Harness moderate abyssal energy as the abyss responds. Abyssal Storm alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0027.webp",
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
				dc: 13,
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
		id: "spell-0032",
		name: "Infernal Storm",
		description:
			"Draw upon moderate fire energy as flames erupt around the wounded. Infernal Storm regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0032.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Infernal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0037",
		name: "Shadow Wave",
		description:
			"Channel moderate shadow energy as darkness coalesces around your hands. Shadow Wave shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0037.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 33,
		},
		flavor:
			"In the post-reset lattice, Shadow Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0042",
		name: "Divine Wave",
		description:
			"Weave moderate holy energy into a protective manifestation as divine light blazes. Divine Wave fortifies against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0042.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"In the post-reset lattice, Divine Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0047",
		name: "Holy Wave",
		description:
			"Harness moderate holy energy as radiance pours forth. Holy Wave reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0047.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Holy Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0052",
		name: "Demonic Nova",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Demonic Nova revitalizes damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0052.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Demonic Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0057",
		name: "Frozen Nova",
		description:
			"Channel moderate ice energy as cold bites deep around your hands. Frozen Nova strikes the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0057.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Frozen Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0062",
		name: "Void Barrier",
		description:
			"Weave moderate void energy into a protective manifestation as the void beckons. Void Barrier fortifies against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0062.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Void Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0067",
		name: "Arcane Barrier",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Barrier crafts the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0067.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Arcane Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0072",
		name: "Dark Barrier",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Dark Barrier purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0072.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"In the post-reset lattice, Dark Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0077",
		name: "Celestial Shield",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Shield shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0077.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Celestial Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0082",
		name: "Thunder Shield",
		description:
			"Weave moderate lightning energy into a protective manifestation as electricity arcs. Thunder Shield deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0082.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 23,
		},
		flavor:
			"In the post-reset lattice, Thunder Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0087",
		name: "Abyssal Curse",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Curse alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0087.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Abyssal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0092",
		name: "Infernal Curse",
		description:
			"Draw upon moderate fire energy as embers spiral around the wounded. Infernal Curse regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0092.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Infernal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0097",
		name: "Shadow Blessing",
		description:
			"Channel moderate shadow energy as darkness coalesces around your hands. Shadow Blessing blasts the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0097.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Shadow Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0102",
		name: "Divine Blessing",
		description:
			"Weave moderate holy energy into a protective manifestation as radiance pours forth. Divine Blessing guards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0102.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Divine Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0107",
		name: "Holy Blessing",
		description:
			"Harness moderate holy energy as divine light blazes. Holy Blessing transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0107.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Holy Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0112",
		name: "Demonic Healing",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Demonic Healing rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0112.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Demonic Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0117",
		name: "Frozen Healing",
		description:
			"Channel moderate ice energy as permafrost spreads around your hands. Frozen Healing rends the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0117.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Frozen Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0122",
		name: "Void Restoration",
		description:
			"Weave moderate void energy into a protective manifestation as reality thins. Void Restoration protects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0122.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Void Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0127",
		name: "Arcane Restoration",
		description:
			"Harness moderate arcane energy as raw power coalesces. Arcane Restoration manipulates the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0127.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Arcane Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0132",
		name: "Dark Restoration",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Dark Restoration restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0132.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Dark Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0137",
		name: "Celestial Destruction",
		description:
			"Channel moderate holy energy as sacred energy surges around your hands. Celestial Destruction assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0137.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"In the post-reset lattice, Celestial Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0142",
		name: "Thunder Destruction",
		description:
			"Weave moderate lightning energy into a protective manifestation as static crackles. Thunder Destruction protects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0142.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Thunder Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0147",
		name: "Abyssal Summoning",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Summoning crafts the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0147.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Abyssal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0152",
		name: "Infernal Summoning",
		description:
			"Draw upon moderate fire energy as heat distorts the air around the wounded. Infernal Summoning rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0152.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Infernal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0157",
		name: "Shadow Binding",
		description:
			"Channel moderate shadow energy as darkness coalesces around your hands. Shadow Binding assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0157.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Shadow Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0162",
		name: "Divine Binding",
		description:
			"Weave moderate holy energy into a protective manifestation as celestial power descends. Divine Binding barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0162.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Divine Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0167",
		name: "Holy Binding",
		description:
			"Harness moderate holy energy as divine light blazes. Holy Binding alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0167.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 54,
		},
		flavor:
			"In the post-reset lattice, Holy Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0172",
		name: "Demonic Teleportation",
		description:
			"Draw upon moderate arcane energy as magical weave tightens around the wounded. Demonic Teleportation rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0172.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Demonic Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0177",
		name: "Frozen Teleportation",
		description:
			"Channel moderate ice energy as glacial power flows around your hands. Frozen Teleportation hammers the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0177.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Frozen Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0182",
		name: "Void Transformation",
		description:
			"Weave moderate void energy into a protective manifestation as entropy accelerates. Void Transformation protects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0182.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Void Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0187",
		name: "Arcane Transformation",
		description:
			"Harness moderate arcane energy as magical weave tightens. Arcane Transformation alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0187.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 99,
		},
		flavor:
			"In the post-reset lattice, Arcane Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0192",
		name: "Dark Transformation",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Dark Transformation purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0192.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 42,
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 68,
		},
		flavor:
			"In the post-reset lattice, Dark Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0197",
		name: "Celestial Bolt",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Bolt rends the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0197.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 19,
		},
		flavor:
			"In the post-reset lattice, Celestial Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0202",
		name: "Thunder Bolt",
		description:
			"Weave moderate lightning energy into a protective manifestation as electricity arcs. Thunder Bolt barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0202.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Thunder Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0207",
		name: "Abyssal Blast",
		description:
			"Harness moderate abyssal energy as hellfire ignites. Abyssal Blast reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0207.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0212",
		name: "Infernal Blast",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Blast regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0212.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Infernal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0217",
		name: "Shadow Storm",
		description:
			"Channel moderate shadow energy as darkness coalesces around your hands. Shadow Storm devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0217.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Shadow Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0222",
		name: "Divine Storm",
		description:
			"Weave moderate lightning energy into a protective manifestation as thunder rumbles. Divine Storm shields against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0222.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Divine Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0227",
		name: "Holy Storm",
		description:
			"Harness moderate lightning energy as thunder rumbles. Holy Storm crafts the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0227.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Holy Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0232",
		name: "Demonic Wave",
		description:
			"Draw upon moderate arcane energy as magical weave tightens around the wounded. Demonic Wave revitalizes damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0232.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Demonic Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0237",
		name: "Frozen Wave",
		description:
			"Channel moderate ice energy as permafrost spreads around your hands. Frozen Wave shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0237.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"In the post-reset lattice, Frozen Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0242",
		name: "Void Nova",
		description:
			"Weave moderate void energy into a protective manifestation as reality thins. Void Nova barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0242.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Void Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0247",
		name: "Arcane Nova",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Nova alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0247.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Arcane Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0252",
		name: "Dark Nova",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Dark Nova rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0252.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Dark Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0257",
		name: "Celestial Barrier",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Barrier pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0257.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"In the post-reset lattice, Celestial Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0262",
		name: "Thunder Barrier",
		description:
			"Weave moderate lightning energy into a protective manifestation as electricity arcs. Thunder Barrier shields against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0262.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Thunder Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0267",
		name: "Abyssal Shield",
		description:
			"Harness moderate abyssal energy as the abyss responds. Abyssal Shield weaves the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0267.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"In the post-reset lattice, Abyssal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0272",
		name: "Infernal Shield",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Shield revitalizes damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0272.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Infernal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0277",
		name: "Shadow Curse",
		description:
			"Channel moderate shadow energy as shadows gather around your hands. Shadow Curse devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0277.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 91,
		},
		flavor:
			"In the post-reset lattice, Shadow Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0282",
		name: "Divine Curse",
		description:
			"Weave moderate holy energy into a protective manifestation as sacred energy surges. Divine Curse fortifies against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0282.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Divine Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0287",
		name: "Holy Curse",
		description:
			"Harness moderate holy energy as divine light blazes. Holy Curse manipulates the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0287.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"In the post-reset lattice, Holy Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0292",
		name: "Demonic Blessing",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Demonic Blessing restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0292.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"In the post-reset lattice, Demonic Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0297",
		name: "Frozen Blessing",
		description:
			"Channel moderate ice energy as frost crystallizes around your hands. Frozen Blessing pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0297.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Frozen Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0302",
		name: "Void Healing",
		description:
			"Weave moderate void energy into a protective manifestation as entropy accelerates. Void Healing shields against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0302.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Void Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0307",
		name: "Arcane Healing",
		description:
			"Harness moderate arcane energy as raw power coalesces. Arcane Healing alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0307.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor:
			"In the post-reset lattice, Arcane Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0312",
		name: "Dark Healing",
		description:
			"Draw upon moderate arcane energy as magical weave tightens around the wounded. Dark Healing purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0312.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Dark Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0317",
		name: "Celestial Restoration",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Restoration devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0317.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Celestial Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0322",
		name: "Thunder Restoration",
		description:
			"Weave moderate lightning energy into a protective manifestation as voltage surges. Thunder Restoration barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0322.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Thunder Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0327",
		name: "Abyssal Destruction",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Destruction transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0327.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 58,
		},
		flavor:
			"In the post-reset lattice, Abyssal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0332",
		name: "Infernal Destruction",
		description:
			"Draw upon moderate fire energy as embers spiral around the wounded. Infernal Destruction purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0332.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Infernal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0337",
		name: "Shadow Summoning",
		description:
			"Channel moderate shadow energy as umbral power surges around your hands. Shadow Summoning strikes the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0337.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"In the post-reset lattice, Shadow Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0342",
		name: "Divine Summoning",
		description:
			"Weave moderate holy energy into a protective manifestation as celestial power descends. Divine Summoning protects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0342.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Divine Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0347",
		name: "Holy Summoning",
		description:
			"Harness moderate holy energy as radiance pours forth. Holy Summoning reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0347.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 86,
		},
		flavor:
			"In the post-reset lattice, Holy Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0352",
		name: "Demonic Binding",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Demonic Binding restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0352.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"In the post-reset lattice, Demonic Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0357",
		name: "Frozen Binding",
		description:
			"Channel moderate ice energy as glacial power flows around your hands. Frozen Binding devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0357.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 11,
		},
		flavor:
			"In the post-reset lattice, Frozen Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0362",
		name: "Void Teleportation",
		description:
			"Weave moderate void energy into a protective manifestation as the void beckons. Void Teleportation wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0362.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Void Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0367",
		name: "Arcane Teleportation",
		description:
			"Harness moderate arcane energy as mana crystallizes. Arcane Teleportation channels the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0367.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Arcane Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0372",
		name: "Dark Teleportation",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Dark Teleportation restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0372.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Dark Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0377",
		name: "Celestial Transformation",
		description:
			"Channel moderate holy energy as radiance pours forth around your hands. Celestial Transformation devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0377.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Celestial Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0382",
		name: "Thunder Transformation",
		description:
			"Weave moderate lightning energy into a protective manifestation as voltage surges. Thunder Transformation guards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0382.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Thunder Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0387",
		name: "Abyssal Bolt",
		description:
			"Harness moderate abyssal energy as the abyss responds. Abyssal Bolt manipulates the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0387.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Abyssal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0392",
		name: "Infernal Bolt",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Bolt restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0392.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Infernal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0397",
		name: "Shadow Blast",
		description:
			"Channel moderate shadow energy as darkness coalesces around your hands. Shadow Blast devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0397.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Shadow Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0402",
		name: "Divine Blast",
		description:
			"Weave moderate holy energy into a protective manifestation as celestial power descends. Divine Blast barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0402.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Divine Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0407",
		name: "Holy Blast",
		description:
			"Harness moderate holy energy as celestial power descends. Holy Blast weaves the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0407.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Holy Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0412",
		name: "Demonic Storm",
		description:
			"Draw upon moderate lightning energy as thunder rumbles around the wounded. Demonic Storm restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0412.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Demonic Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0417",
		name: "Frozen Storm",
		description:
			"Channel moderate ice energy as cold bites deep around your hands. Frozen Storm pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0417.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Frozen Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0422",
		name: "Void Wave",
		description:
			"Weave moderate void energy into a protective manifestation as entropy accelerates. Void Wave barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0422.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Void Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0427",
		name: "Arcane Wave",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Wave channels the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0427.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Arcane Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0432",
		name: "Dark Wave",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Dark Wave heals damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0432.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"In the post-reset lattice, Dark Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0437",
		name: "Celestial Nova",
		description:
			"Channel moderate holy energy as celestial power descends around your hands. Celestial Nova assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0437.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Celestial Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0442",
		name: "Thunder Nova",
		description:
			"Weave moderate lightning energy into a protective manifestation as thunder rumbles. Thunder Nova wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0442.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 74,
		},
		flavor:
			"In the post-reset lattice, Thunder Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0447",
		name: "Abyssal Barrier",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Barrier reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0447.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Abyssal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0452",
		name: "Infernal Barrier",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Barrier purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0452.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Infernal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0457",
		name: "Shadow Shield",
		description:
			"Channel moderate shadow energy as void energy pulses around your hands. Shadow Shield devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0457.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Shadow Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0462",
		name: "Divine Shield",
		description:
			"Weave moderate holy energy into a protective manifestation as celestial power descends. Divine Shield deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0462.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Divine Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0467",
		name: "Holy Shield",
		description:
			"Harness moderate holy energy as celestial power descends. Holy Shield reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0467.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 99,
		},
		flavor:
			"In the post-reset lattice, Holy Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0472",
		name: "Demonic Curse",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Demonic Curse revitalizes damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0472.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Demonic Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0477",
		name: "Frozen Curse",
		description:
			"Channel moderate ice energy as permafrost spreads around your hands. Frozen Curse shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0477.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Frozen Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0482",
		name: "Void Blessing",
		description:
			"Weave moderate void energy into a protective manifestation as reality thins. Void Blessing deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0482.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Void Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0487",
		name: "Arcane Blessing",
		description:
			"Harness moderate arcane energy as mana crystallizes. Arcane Blessing crafts the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0487.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Arcane Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0492",
		name: "Dark Blessing",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Dark Blessing purifies damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0492.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"In the post-reset lattice, Dark Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0497",
		name: "Celestial Healing",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Healing pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0497.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"In the post-reset lattice, Celestial Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0502",
		name: "Thunder Healing",
		description:
			"Weave moderate lightning energy into a protective manifestation as voltage surges. Thunder Healing deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0502.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Thunder Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0507",
		name: "Abyssal Restoration",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Restoration manipulates the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0507.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Abyssal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0512",
		name: "Infernal Restoration",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Restoration regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0512.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Infernal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0517",
		name: "Shadow Destruction",
		description:
			"Channel moderate shadow energy as umbral power surges around your hands. Shadow Destruction assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0517.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Shadow Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0522",
		name: "Divine Destruction",
		description:
			"Weave moderate holy energy into a protective manifestation as radiance pours forth. Divine Destruction barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0522.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Divine Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0527",
		name: "Holy Destruction",
		description:
			"Harness moderate holy energy as divine light blazes. Holy Destruction reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0527.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Holy Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0532",
		name: "Demonic Summoning",
		description:
			"Draw upon moderate arcane energy as magical weave tightens around the wounded. Demonic Summoning revitalizes damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0532.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"In the post-reset lattice, Demonic Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0537",
		name: "Frozen Summoning",
		description:
			"Channel moderate ice energy as glacial power flows around your hands. Frozen Summoning devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0537.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"In the post-reset lattice, Frozen Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0542",
		name: "Void Binding",
		description:
			"Weave moderate void energy into a protective manifestation as the void beckons. Void Binding guards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0542.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Void Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0547",
		name: "Arcane Binding",
		description:
			"Harness moderate arcane energy as mana crystallizes. Arcane Binding alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0547.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"In the post-reset lattice, Arcane Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0552",
		name: "Dark Binding",
		description:
			"Draw upon moderate arcane energy as magical weave tightens around the wounded. Dark Binding heals damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0552.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Dark Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0557",
		name: "Celestial Teleportation",
		description:
			"Channel moderate holy energy as divine light blazes around your hands. Celestial Teleportation hammers the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0557.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 29,
		},
		flavor:
			"In the post-reset lattice, Celestial Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0562",
		name: "Thunder Teleportation",
		description:
			"Weave moderate lightning energy into a protective manifestation as static crackles. Thunder Teleportation fortifies against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0562.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"In the post-reset lattice, Thunder Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0567",
		name: "Abyssal Transformation",
		description:
			"Harness moderate abyssal energy as the abyss responds. Abyssal Transformation alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0567.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Abyssal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0572",
		name: "Infernal Transformation",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Transformation restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0572.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Infernal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0577",
		name: "Shadow Bolt",
		description:
			"Channel moderate shadow energy as umbral power surges around your hands. Shadow Bolt shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0577.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Shadow Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0582",
		name: "Divine Bolt",
		description:
			"Weave moderate holy energy into a protective manifestation as sacred energy surges. Divine Bolt deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0582.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Divine Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0587",
		name: "Holy Bolt",
		description:
			"Harness moderate holy energy as radiance pours forth. Holy Bolt reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0587.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 29,
		},
		flavor:
			"In the post-reset lattice, Holy Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0592",
		name: "Demonic Blast",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Demonic Blast regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0592.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Demonic Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0597",
		name: "Frozen Blast",
		description:
			"Channel moderate ice energy as glacial power flows around your hands. Frozen Blast blasts the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0597.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Frozen Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0602",
		name: "Void Storm",
		description:
			"Weave moderate void energy into a protective manifestation as dimensional rift tears open. Void Storm wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0602.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Void Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0607",
		name: "Arcane Storm",
		description:
			"Harness moderate lightning energy as electricity arcs. Arcane Storm weaves the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0607.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		range: {
			type: "distance",
			value: 27,
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 43,
		},
		flavor:
			"In the post-reset lattice, Arcane Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0612",
		name: "Dark Storm",
		description:
			"Draw upon moderate lightning energy as thunder rumbles around the wounded. Dark Storm heals damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0612.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 33,
		},
		flavor:
			"In the post-reset lattice, Dark Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0617",
		name: "Celestial Wave",
		description:
			"Channel moderate holy energy as celestial power descends around your hands. Celestial Wave pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0617.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Celestial Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0622",
		name: "Voltaic Barrier",
		description:
			"Weave moderate lightning energy into a protective manifestation as voltage surges. Voltaic Barrier deflects against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0622.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"In the post-reset lattice, Voltaic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0627",
		name: "Abyssal Nova",
		description:
			"Harness moderate abyssal energy as demonic resonance builds. Abyssal Nova transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0627.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Abyssal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0632",
		name: "Infernal Nova",
		description:
			"Draw upon moderate fire energy as flames erupt around the wounded. Infernal Nova mends damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0632.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Infernal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0637",
		name: "Shadow Barrier",
		description:
			"Channel moderate shadow energy as umbral power surges around your hands. Shadow Barrier blasts the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0637.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Shadow Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0642",
		name: "Divine Barrier",
		description:
			"Weave moderate holy energy into a protective manifestation as radiance pours forth. Divine Barrier barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0642.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Divine Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0647",
		name: "Holy Barrier",
		description:
			"Harness moderate holy energy as sacred energy surges. Holy Barrier transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0647.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"In the post-reset lattice, Holy Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0652",
		name: "Demonic Shield",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Demonic Shield rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0652.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Demonic Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0657",
		name: "Frozen Shield",
		description:
			"Channel moderate ice energy as frost crystallizes around your hands. Frozen Shield devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0657.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Frozen Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0662",
		name: "Void Curse",
		description:
			"Weave moderate void energy into a protective manifestation as dimensional rift tears open. Void Curse guards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0662.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Void Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0667",
		name: "Arcane Curse",
		description:
			"Harness moderate arcane energy as magical weave tightens. Arcane Curse channels the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0667.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Arcane Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0672",
		name: "Dark Curse",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Dark Curse rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0672.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
		range: {
			type: "distance",
			value: 27,
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Dark Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0677",
		name: "Celestial Blessing",
		description:
			"Channel moderate holy energy as sacred energy surges around your hands. Celestial Blessing shreds the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0677.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Celestial Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0682",
		name: "Thunder Blessing",
		description:
			"Weave moderate lightning energy into a protective manifestation as electricity arcs. Thunder Blessing guards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0682.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"In the post-reset lattice, Thunder Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0687",
		name: "Abyssal Healing",
		description:
			"Harness moderate abyssal energy as hellfire ignites. Abyssal Healing transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0687.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Abyssal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0692",
		name: "Infernal Healing",
		description:
			"Draw upon moderate fire energy as infernal energy blazes around the wounded. Infernal Healing rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0692.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Infernal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0697",
		name: "Shadow Restoration",
		description:
			"Channel moderate shadow energy as void energy pulses around your hands. Shadow Restoration strikes the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0697.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Shadow Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0702",
		name: "Divine Restoration",
		description:
			"Weave moderate holy energy into a protective manifestation as celestial power descends. Divine Restoration wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0702.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Divine Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0707",
		name: "Holy Restoration",
		description:
			"Harness moderate holy energy as radiance pours forth. Holy Restoration alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0707.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Holy Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0712",
		name: "Demonic Destruction",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Demonic Destruction heals damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0712.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 43,
		},
		flavor:
			"In the post-reset lattice, Demonic Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0717",
		name: "Frozen Destruction",
		description:
			"Channel moderate ice energy as cold bites deep around your hands. Frozen Destruction devastates the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0717.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 19,
		},
		flavor:
			"In the post-reset lattice, Frozen Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0722",
		name: "Void Summoning",
		description:
			"Weave moderate void energy into a protective manifestation as reality thins. Void Summoning barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0722.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Void Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0727",
		name: "Arcane Summoning",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Summoning alters the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0727.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Arcane Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0732",
		name: "Dark Summoning",
		description:
			"Draw upon moderate arcane energy as raw power coalesces around the wounded. Dark Summoning restores damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0732.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Dark Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0737",
		name: "Celestial Binding",
		description:
			"Channel moderate holy energy as celestial power descends around your hands. Celestial Binding assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0737.webp",
		effect:
			"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 3d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Celestial Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0742",
		name: "Thunder Binding",
		description:
			"Weave moderate lightning energy into a protective manifestation as voltage surges. Thunder Binding wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0742.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 47,
		},
		flavor:
			"In the post-reset lattice, Thunder Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0747",
		name: "Abyssal Teleportation",
		description:
			"Harness moderate abyssal energy as hellfire ignites. Abyssal Teleportation reshapes the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0747.webp",
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
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Abyssal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0752",
		name: "Infernal Teleportation",
		description:
			"Draw upon moderate fire energy as embers spiral around the wounded. Infernal Teleportation regenerates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0752.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Infernal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0757",
		name: "Shadow Transformation",
		description:
			"Channel moderate shadow energy as umbral power surges around your hands. Shadow Transformation assaults the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0757.webp",
		effect:
			"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 3d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 54,
		},
		flavor:
			"In the post-reset lattice, Shadow Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0762",
		name: "Divine Transformation",
		description:
			"Weave moderate holy energy into a protective manifestation as radiance pours forth. Divine Transformation wards against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0762.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"In the post-reset lattice, Divine Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0767",
		name: "Holy Transformation",
		description:
			"Harness moderate holy energy as sacred energy surges. Holy Transformation transforms the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0767.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Holy Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0772",
		name: "Demonic Bolt",
		description:
			"Draw upon moderate arcane energy as mana crystallizes around the wounded. Demonic Bolt rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0772.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"In the post-reset lattice, Demonic Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0777",
		name: "Frozen Bolt",
		description:
			"Channel moderate ice energy as permafrost spreads around your hands. Frozen Bolt strikes the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0777.webp",
		effect:
			"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 3d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Frozen Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0782",
		name: "Void Blast",
		description:
			"Weave moderate void energy into a protective manifestation as dimensional rift tears open. Void Blast barriers against against incoming harm with layered magical barriers. A staple in any serious ascendant's arsenal.",
		type: "Defense",
		rank: "C",
		image: "/generated/compendium/spells/spell-0782.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Void Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0787",
		name: "Arcane Blast",
		description:
			"Harness moderate arcane energy as arcane sigils flare. Arcane Blast manipulates the fabric of reality to produce extraordinary effects. A staple in any serious ascendant's arsenal.",
		type: "Utility",
		rank: "C",
		image: "/generated/compendium/spells/spell-0787.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 13,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Arcane Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0792",
		name: "Dark Blast",
		description:
			"Draw upon moderate arcane energy as arcane sigils flare around the wounded. Dark Blast rejuvenates damaged tissue and restores vitality. A staple in any serious ascendant's arsenal.",
		type: "Healing",
		rank: "C",
		image: "/generated/compendium/spells/spell-0792.webp",
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
				dice: "2d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 91,
		},
		flavor:
			"In the post-reset lattice, Dark Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0797",
		name: "Celestial Storm",
		description:
			"Channel moderate lightning energy as static crackles around your hands. Celestial Storm pierces the target with concentrated destructive force. A staple in any serious ascendant's arsenal.",
		type: "Attack",
		rank: "C",
		image: "/generated/compendium/spells/spell-0797.webp",
		effect:
			"On a hit, deals 3d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
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
				"On a hit, deals 3d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "3d6",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Celestial Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
];
