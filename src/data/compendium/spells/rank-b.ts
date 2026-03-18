import type { CompendiumSpell } from "@/types/compendium";

export const spells_b: CompendiumSpell[] = [
	{
		id: "spell-0003",
		name: "Abyssal Bolt",
		description:
			"Harness significant abyssal energy as demonic resonance builds. Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities. Mastered only by those who've cleared B-rank gates.",
		level: 3,
		school: "Conjuration",
		castingTime: "1 action",
		range: {
			type: "distance",
			value: 60,
			unit: "ft",
		},
		components: {
			verbal: true,
			somatic: true,
			material: "a drop of demonic blood",
		},
		duration: {
			type: "instant",
		},
		concentration: true,
		ritual: false,
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0003.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		atHigherLevels:
			"When you cast this spell using a spell slot of 4th level or higher, you can create additional effects or increase the area of effect by 20 feet for each slot level above 3rd.",
		classes: ["Mage", "Contractor", "Invoker"],
		savingThrow: {
			ability: "Wisdom",
			dc: "spell save",
			success: "Negates effect",
			failure: "Full effect",
		},
		area: {
			type: "sphere",
			size: "20-foot radius",
			shape: "sphere",
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
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Abyssal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		activation: {
			type: "action",
			cost: 1,
		},
	},
	{
		id: "spell-0008",
		name: "Infernal Bolt",
		description:
			"Draw upon significant fire energy as heat distorts the air around the wounded. Infernal Bolt mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0008.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Infernal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0013",
		name: "Shadow Blast",
		description:
			"Channel significant shadow energy as void energy pulses around your hands. Shadow Blast assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0013.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 48,
		},
		flavor:
			"In the post-reset lattice, Shadow Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0018",
		name: "Divine Blast",
		description:
			"Weave significant holy energy into a protective manifestation as divine light blazes. Divine Blast fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0018.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Divine Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0023",
		name: "Holy Blast",
		description:
			"Harness significant holy energy as divine light blazes. Holy Blast manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0023.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 24,
		},
		flavor:
			"In the post-reset lattice, Holy Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0028",
		name: "Demonic Storm",
		description:
			"Draw upon significant lightning energy as thunder rumbles around the wounded. Demonic Storm revitalizes damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0028.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
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
	{
		id: "spell-0033",
		name: "Frozen Storm",
		description:
			"Channel significant ice energy as frost crystallizes around your hands. Frozen Storm shreds the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0033.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Frozen Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0038",
		name: "Void Wave",
		description:
			"Weave significant void energy into a protective manifestation as the void beckons. Void Wave protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0038.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 27,
		},
		flavor:
			"In the post-reset lattice, Void Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0043",
		name: "Arcane Wave",
		description:
			"Harness significant arcane energy as raw power coalesces. Arcane Wave crafts the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0043.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"In the post-reset lattice, Arcane Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0048",
		name: "Dark Wave",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Wave mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0048.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"In the post-reset lattice, Dark Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0053",
		name: "Celestial Nova",
		description:
			"Channel significant holy energy as divine light blazes around your hands. Celestial Nova assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0053.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 33,
		},
		flavor:
			"In the post-reset lattice, Celestial Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0058",
		name: "Thunder Nova",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Nova protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0058.webp",
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
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Thunder Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0063",
		name: "Abyssal Barrier",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Barrier alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0063.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"In the post-reset lattice, Abyssal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0068",
		name: "Infernal Barrier",
		description:
			"Draw upon significant fire energy as flames erupt around the wounded. Infernal Barrier mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0068.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"In the post-reset lattice, Infernal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0073",
		name: "Shadow Shield",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Shield strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0073.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Shadow Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0078",
		name: "Divine Shield",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Shield guards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0078.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Divine Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0083",
		name: "Holy Shield",
		description:
			"Harness significant holy energy as divine light blazes. Holy Shield transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0083.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Holy Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0088",
		name: "Demonic Curse",
		description:
			"Draw upon significant arcane energy as mana crystallizes around the wounded. Demonic Curse regenerates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0088.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 33,
		},
		flavor:
			"In the post-reset lattice, Demonic Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0093",
		name: "Frozen Curse",
		description:
			"Channel significant ice energy as cold bites deep around your hands. Frozen Curse assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0093.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Frozen Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0098",
		name: "Void Blessing",
		description:
			"Weave significant void energy into a protective manifestation as dimensional rift tears open. Void Blessing shields against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0098.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 43,
		},
		flavor:
			"In the post-reset lattice, Void Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0103",
		name: "Arcane Blessing",
		description:
			"Harness significant arcane energy as arcane sigils flare. Arcane Blessing manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0103.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Arcane Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0108",
		name: "Dark Blessing",
		description:
			"Draw upon significant arcane energy as raw power coalesces around the wounded. Dark Blessing mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0108.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Dark Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0113",
		name: "Celestial Healing",
		description:
			"Channel significant holy energy as radiance pours forth around your hands. Celestial Healing strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0113.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Celestial Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0118",
		name: "Thunder Healing",
		description:
			"Weave significant lightning energy into a protective manifestation as electricity arcs. Thunder Healing protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0118.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Thunder Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0123",
		name: "Abyssal Restoration",
		description:
			"Harness significant abyssal energy as hellfire ignites. Abyssal Restoration manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0123.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Abyssal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0128",
		name: "Infernal Restoration",
		description:
			"Draw upon significant fire energy as heat distorts the air around the wounded. Infernal Restoration mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0128.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Infernal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0133",
		name: "Shadow Destruction",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Destruction strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0133.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Shadow Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0138",
		name: "Divine Destruction",
		description:
			"Weave significant holy energy into a protective manifestation as divine light blazes. Divine Destruction fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0138.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Divine Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0143",
		name: "Holy Destruction",
		description:
			"Harness significant holy energy as celestial power descends. Holy Destruction weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0143.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Holy Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0148",
		name: "Demonic Summoning",
		description:
			"Draw upon significant arcane energy as magical weave tightens around the wounded. Demonic Summoning revitalizes damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0148.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Demonic Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0153",
		name: "Frozen Summoning",
		description:
			"Channel significant ice energy as frost crystallizes around your hands. Frozen Summoning hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0153.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Frozen Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0158",
		name: "Void Binding",
		description:
			"Weave significant void energy into a protective manifestation as reality thins. Void Binding barriers against against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0158.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Void Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0163",
		name: "Arcane Binding",
		description:
			"Harness significant arcane energy as arcane sigils flare. Arcane Binding weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0163.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Arcane Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0168",
		name: "Dark Binding",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Binding restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0168.webp",
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
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Dark Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0173",
		name: "Celestial Teleportation",
		description:
			"Channel significant holy energy as sacred energy surges around your hands. Celestial Teleportation hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0173.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Celestial Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0178",
		name: "Thunder Teleportation",
		description:
			"Weave significant lightning energy into a protective manifestation as static crackles. Thunder Teleportation fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0178.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			mana_cost: 15,
		},
		flavor:
			"In the post-reset lattice, Thunder Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0183",
		name: "Abyssal Transformation",
		description:
			"Harness significant abyssal energy as abyssal energy erupts. Abyssal Transformation manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0183.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 63,
		},
		flavor:
			"In the post-reset lattice, Abyssal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0188",
		name: "Infernal Transformation",
		description:
			"Draw upon significant fire energy as heat distorts the air around the wounded. Infernal Transformation mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0188.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Infernal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0193",
		name: "Shadow Bolt",
		description:
			"Channel significant shadow energy as darkness coalesces around your hands. Shadow Bolt strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0193.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 15,
		},
		flavor:
			"In the post-reset lattice, Shadow Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0198",
		name: "Divine Bolt",
		description:
			"Weave significant holy energy into a protective manifestation as sacred energy surges. Divine Bolt deflects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0198.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Divine Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0203",
		name: "Holy Bolt",
		description:
			"Harness significant holy energy as divine light blazes. Holy Bolt weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0203.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 48,
		},
		flavor:
			"In the post-reset lattice, Holy Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0208",
		name: "Demonic Blast",
		description:
			"Draw upon significant arcane energy as raw power coalesces around the wounded. Demonic Blast rejuvenates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0208.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Demonic Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0213",
		name: "Frozen Blast",
		description:
			"Channel significant ice energy as frost crystallizes around your hands. Frozen Blast hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0213.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Frozen Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0218",
		name: "Void Storm",
		description:
			"Weave significant void energy into a protective manifestation as entropy accelerates. Void Storm deflects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0218.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Void Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0223",
		name: "Arcane Storm",
		description:
			"Harness significant lightning energy as static crackles. Arcane Storm crafts the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0223.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Arcane Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
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
		flavor:
			"In the post-reset lattice, Dark Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Celestial Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Voltaic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Abyssal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Infernal Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Shadow Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Divine Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Holy Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Demonic Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Frozen Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
		flavor:
			"In the post-reset lattice, Void Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Arcane Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Dark Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
		flavor:
			"In the post-reset lattice, Celestial Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Thunder Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Abyssal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Infernal Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Shadow Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Divine Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Holy Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Demonic Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Frozen Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Void Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Arcane Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Dark Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Celestial Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
		flavor:
			"In the post-reset lattice, Thunder Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Abyssal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Infernal Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Shadow Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Divine Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
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
			"In the post-reset lattice, Holy Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0388",
		name: "Demonic Bolt",
		description:
			"Draw upon significant arcane energy as mana crystallizes around the wounded. Demonic Bolt rejuvenates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0388.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Demonic Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0393",
		name: "Frozen Bolt",
		description:
			"Channel significant ice energy as cold bites deep around your hands. Frozen Bolt assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0393.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Frozen Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0398",
		name: "Void Blast",
		description:
			"Weave significant void energy into a protective manifestation as dimensional rift tears open. Void Blast fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0398.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Void Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0403",
		name: "Arcane Blast",
		description:
			"Harness significant arcane energy as arcane sigils flare. Arcane Blast alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0403.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Arcane Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0408",
		name: "Dark Blast",
		description:
			"Draw upon significant arcane energy as raw power coalesces around the wounded. Dark Blast heals damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0408.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Dark Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0413",
		name: "Celestial Storm",
		description:
			"Channel significant lightning energy as thunder rumbles around your hands. Celestial Storm hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0413.webp",
		effect:
			"On a hit, deals 5d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
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
				"On a hit, deals 5d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "5d6",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"In the post-reset lattice, Celestial Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0418",
		name: "Thunder Storm",
		description:
			"Weave significant lightning energy into a protective manifestation as electricity arcs. Thunder Storm wards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0418.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Thunder Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0423",
		name: "Abyssal Wave",
		description:
			"Harness significant abyssal energy as abyssal energy erupts. Abyssal Wave transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0423.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 76,
		},
		flavor:
			"In the post-reset lattice, Abyssal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0428",
		name: "Infernal Wave",
		description:
			"Draw upon significant fire energy as flames erupt around the wounded. Infernal Wave restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0428.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Infernal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0433",
		name: "Shadow Nova",
		description:
			"Channel significant shadow energy as void energy pulses around your hands. Shadow Nova pierces the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0433.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 98,
		},
		flavor:
			"In the post-reset lattice, Shadow Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0438",
		name: "Divine Nova",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Nova fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0438.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Divine Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0443",
		name: "Holy Nova",
		description:
			"Harness significant holy energy as divine light blazes. Holy Nova crafts the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0443.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Holy Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0448",
		name: "Demonic Barrier",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Demonic Barrier purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0448.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Demonic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0453",
		name: "Frozen Barrier",
		description:
			"Channel significant ice energy as permafrost spreads around your hands. Frozen Barrier strikes the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0453.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Frozen Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0458",
		name: "Void Shield",
		description:
			"Weave significant void energy into a protective manifestation as entropy accelerates. Void Shield deflects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0458.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Void Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0463",
		name: "Arcane Shield",
		description:
			"Harness significant arcane energy as raw power coalesces. Arcane Shield manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0463.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Arcane Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0468",
		name: "Dark Shield",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Shield mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0468.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Dark Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0473",
		name: "Celestial Curse",
		description:
			"Channel significant holy energy as divine light blazes around your hands. Celestial Curse hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0473.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 18,
		},
		flavor:
			"In the post-reset lattice, Celestial Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0478",
		name: "Thunder Curse",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Curse fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0478.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			mana_cost: 36,
		},
		flavor:
			"In the post-reset lattice, Thunder Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0483",
		name: "Abyssal Blessing",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Blessing channels the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0483.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0488",
		name: "Infernal Blessing",
		description:
			"Draw upon significant fire energy as embers spiral around the wounded. Infernal Blessing heals damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0488.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"In the post-reset lattice, Infernal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0493",
		name: "Shadow Healing",
		description:
			"Channel significant shadow energy as void energy pulses around your hands. Shadow Healing pierces the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0493.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 82,
		},
		flavor:
			"In the post-reset lattice, Shadow Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0498",
		name: "Divine Healing",
		description:
			"Weave significant holy energy into a protective manifestation as sacred energy surges. Divine Healing protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0498.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Divine Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0503",
		name: "Holy Healing",
		description:
			"Harness significant holy energy as celestial power descends. Holy Healing transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0503.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Holy Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0508",
		name: "Demonic Restoration",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Demonic Restoration heals damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0508.webp",
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
			mana_cost: 33,
		},
		flavor:
			"In the post-reset lattice, Demonic Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0513",
		name: "Frozen Restoration",
		description:
			"Channel significant ice energy as cold bites deep around your hands. Frozen Restoration hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0513.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 23,
		},
		flavor:
			"In the post-reset lattice, Frozen Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0518",
		name: "Void Destruction",
		description:
			"Weave significant void energy into a protective manifestation as the void beckons. Void Destruction shields against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0518.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Void Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0523",
		name: "Arcane Destruction",
		description:
			"Harness significant arcane energy as mana crystallizes. Arcane Destruction transforms the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0523.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Arcane Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0528",
		name: "Dark Destruction",
		description:
			"Draw upon significant arcane energy as mana crystallizes around the wounded. Dark Destruction purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0528.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Dark Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0533",
		name: "Celestial Summoning",
		description:
			"Channel significant holy energy as radiance pours forth around your hands. Celestial Summoning blasts the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0533.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Celestial Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0538",
		name: "Thunder Summoning",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Summoning fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0538.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Thunder Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0543",
		name: "Abyssal Binding",
		description:
			"Harness significant abyssal energy as demonic resonance builds. Abyssal Binding manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0543.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Abyssal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0548",
		name: "Infernal Binding",
		description:
			"Draw upon significant fire energy as embers spiral around the wounded. Infernal Binding restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0548.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Infernal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0553",
		name: "Shadow Teleportation",
		description:
			"Channel significant shadow energy as void energy pulses around your hands. Shadow Teleportation devastates the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0553.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Shadow Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0558",
		name: "Divine Teleportation",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Teleportation guards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0558.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Divine Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0563",
		name: "Holy Teleportation",
		description:
			"Harness significant holy energy as radiance pours forth. Holy Teleportation channels the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0563.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Holy Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0568",
		name: "Demonic Transformation",
		description:
			"Draw upon significant arcane energy as magical weave tightens around the wounded. Demonic Transformation rejuvenates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0568.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 91,
		},
		flavor:
			"In the post-reset lattice, Demonic Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0573",
		name: "Frozen Transformation",
		description:
			"Channel significant ice energy as permafrost spreads around your hands. Frozen Transformation assaults the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0573.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Frozen Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0578",
		name: "Void Bolt",
		description:
			"Weave significant void energy into a protective manifestation as the void beckons. Void Bolt shields against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0578.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Void Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0583",
		name: "Arcane Bolt",
		description:
			"Harness significant arcane energy as raw power coalesces. Arcane Bolt alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0583.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 43,
		},
		flavor:
			"In the post-reset lattice, Arcane Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0588",
		name: "Dark Bolt",
		description:
			"Draw upon significant arcane energy as magical weave tightens around the wounded. Dark Bolt rejuvenates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0588.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Dark Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0593",
		name: "Celestial Blast",
		description:
			"Channel significant holy energy as divine light blazes around your hands. Celestial Blast devastates the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0593.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			"In the post-reset lattice, Celestial Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0598",
		name: "Thunder Blast",
		description:
			"Weave significant lightning energy into a protective manifestation as static crackles. Thunder Blast shields against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0598.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			"In the post-reset lattice, Thunder Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0603",
		name: "Abyssal Storm",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Storm reshapes the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0603.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Abyssal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0608",
		name: "Infernal Storm",
		description:
			"Draw upon significant fire energy as heat distorts the air around the wounded. Infernal Storm purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0608.webp",
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
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Infernal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0613",
		name: "Shadow Wave",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Wave shreds the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0613.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Shadow Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0618",
		name: "Divine Wave",
		description:
			"Weave significant holy energy into a protective manifestation as divine light blazes. Divine Wave wards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0618.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
			mana_cost: 12,
		},
		flavor:
			"In the post-reset lattice, Divine Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0623",
		name: "Holy Wave",
		description:
			"Harness significant holy energy as radiance pours forth. Holy Wave alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0623.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Holy Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0628",
		name: "Demonic Nova",
		description:
			"Draw upon significant arcane energy as magical weave tightens around the wounded. Demonic Nova restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0628.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 47,
		},
		flavor:
			"In the post-reset lattice, Demonic Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0633",
		name: "Frozen Nova",
		description:
			"Channel significant ice energy as glacial power flows around your hands. Frozen Nova rends the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0633.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 72,
		},
		flavor:
			"In the post-reset lattice, Frozen Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0638",
		name: "Void Barrier",
		description:
			"Weave significant void energy into a protective manifestation as reality thins. Void Barrier guards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0638.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Void Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0643",
		name: "Arcane Barrier",
		description:
			"Harness significant arcane energy as raw power coalesces. Arcane Barrier crafts the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0643.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Arcane Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0648",
		name: "Dark Barrier",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Barrier heals damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0648.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"In the post-reset lattice, Dark Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0653",
		name: "Celestial Shield",
		description:
			"Channel significant holy energy as sacred energy surges around your hands. Celestial Shield hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0653.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
		id: "spell-0658",
		name: "Thunder Shield",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Shield wards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0658.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Thunder Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0663",
		name: "Abyssal Curse",
		description:
			"Harness significant abyssal energy as demonic resonance builds. Abyssal Curse weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0663.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 47,
		},
		flavor:
			"In the post-reset lattice, Abyssal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0668",
		name: "Infernal Curse",
		description:
			"Draw upon significant fire energy as flames erupt around the wounded. Infernal Curse restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0668.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
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
			"In the post-reset lattice, Infernal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0673",
		name: "Shadow Blessing",
		description:
			"Channel significant shadow energy as shadows gather around your hands. Shadow Blessing hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0673.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 16,
		},
		flavor:
			"In the post-reset lattice, Shadow Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0678",
		name: "Divine Blessing",
		description:
			"Weave significant holy energy into a protective manifestation as radiance pours forth. Divine Blessing guards against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0678.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Divine Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0683",
		name: "Holy Blessing",
		description:
			"Harness significant holy energy as sacred energy surges. Holy Blessing alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0683.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Holy Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0688",
		name: "Demonic Healing",
		description:
			"Draw upon significant arcane energy as mana crystallizes around the wounded. Demonic Healing revitalizes damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0688.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"In the post-reset lattice, Demonic Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0693",
		name: "Frozen Healing",
		description:
			"Channel significant ice energy as glacial power flows around your hands. Frozen Healing hammers the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0693.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Frozen Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0698",
		name: "Void Restoration",
		description:
			"Weave significant void energy into a protective manifestation as dimensional rift tears open. Void Restoration deflects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0698.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Void Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0703",
		name: "Arcane Restoration",
		description:
			"Harness significant arcane energy as magical weave tightens. Arcane Restoration manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0703.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 42,
		},
		flavor:
			"In the post-reset lattice, Arcane Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0708",
		name: "Dark Restoration",
		description:
			"Draw upon significant arcane energy as arcane sigils flare around the wounded. Dark Restoration mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0708.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Dark Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0713",
		name: "Celestial Destruction",
		description:
			"Channel significant holy energy as sacred energy surges around your hands. Celestial Destruction rends the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0713.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Celestial Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0718",
		name: "Thunder Destruction",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Destruction fortifies against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0718.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Thunder Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0723",
		name: "Abyssal Summoning",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Summoning manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0723.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
			"In the post-reset lattice, Abyssal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0728",
		name: "Infernal Summoning",
		description:
			"Draw upon significant fire energy as infernal energy blazes around the wounded. Infernal Summoning mends damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0728.webp",
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
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Infernal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0733",
		name: "Shadow Binding",
		description:
			"Channel significant shadow energy as void energy pulses around your hands. Shadow Binding pierces the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0733.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Shadow Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0738",
		name: "Divine Binding",
		description:
			"Weave significant holy energy into a protective manifestation as celestial power descends. Divine Binding barriers against against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0738.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Divine Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0743",
		name: "Holy Binding",
		description:
			"Harness significant holy energy as sacred energy surges. Holy Binding manipulates the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0743.webp",
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
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Holy Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0748",
		name: "Demonic Teleportation",
		description:
			"Draw upon significant arcane energy as raw power coalesces around the wounded. Demonic Teleportation restores damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0748.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"In the post-reset lattice, Demonic Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0753",
		name: "Frozen Teleportation",
		description:
			"Channel significant ice energy as glacial power flows around your hands. Frozen Teleportation shreds the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0753.webp",
		effect:
			"On a hit, deals 5d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Frozen Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0758",
		name: "Void Transformation",
		description:
			"Weave significant void energy into a protective manifestation as reality thins. Void Transformation protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0758.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Void Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0763",
		name: "Arcane Transformation",
		description:
			"Harness significant arcane energy as mana crystallizes. Arcane Transformation alters the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0763.webp",
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
				dc: 14,
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
		id: "spell-0768",
		name: "Dark Transformation",
		description:
			"Draw upon significant arcane energy as mana crystallizes around the wounded. Dark Transformation rejuvenates damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0768.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Dark Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0773",
		name: "Celestial Bolt",
		description:
			"Channel significant holy energy as sacred energy surges around your hands. Celestial Bolt devastates the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0773.webp",
		effect:
			"On a hit, deals 5d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Celestial Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0778",
		name: "Thunder Bolt",
		description:
			"Weave significant lightning energy into a protective manifestation as thunder rumbles. Thunder Bolt protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0778.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 76,
		},
		flavor:
			"In the post-reset lattice, Thunder Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0783",
		name: "Abyssal Blast",
		description:
			"Harness significant abyssal energy as the abyss responds. Abyssal Blast weaves the fabric of reality to produce extraordinary effects. Mastered only by those who've cleared B-rank gates.",
		type: "Utility",
		rank: "B",
		image: "/generated/compendium/spells/spell-0783.webp",
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
			mana_cost: 19,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0788",
		name: "Infernal Blast",
		description:
			"Draw upon significant fire energy as embers spiral around the wounded. Infernal Blast purifies damaged tissue and restores vitality. Mastered only by those who've cleared B-rank gates.",
		type: "Healing",
		rank: "B",
		image: "/generated/compendium/spells/spell-0788.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "3d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Infernal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0793",
		name: "Shadow Storm",
		description:
			"Channel significant shadow energy as umbral power surges around your hands. Shadow Storm devastates the target with concentrated destructive force. Mastered only by those who've cleared B-rank gates.",
		type: "Attack",
		rank: "B",
		image: "/generated/compendium/spells/spell-0793.webp",
		effect:
			"On a hit, deals 5d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
			mana_cost: 72,
		},
		flavor:
			"In the post-reset lattice, Shadow Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0798",
		name: "Divine Storm",
		description:
			"Weave significant lightning energy into a protective manifestation as electricity arcs. Divine Storm protects against incoming harm with layered magical barriers. Mastered only by those who've cleared B-rank gates.",
		type: "Defense",
		rank: "B",
		image: "/generated/compendium/spells/spell-0798.webp",
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
				dc: 14,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"In the post-reset lattice, Divine Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
];
