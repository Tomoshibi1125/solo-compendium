import type { CompendiumSpell } from "@/types/compendium";

export const spells_a: CompendiumSpell[] = [
	{
		id: "spell-0004",
		name: "Demonic Bolt",
		description:
			"Draw upon formidable arcane energy as arcane sigils flare around the wounded. Demonic Bolt revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0004.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Demonic Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0009",
		name: "Frozen Bolt",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Bolt strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0009.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Frozen Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0014",
		name: "Void Blast",
		description:
			"Weave formidable void energy into a protective manifestation as reality thins. Void Blast protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0014.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"In the post-reset lattice, Void Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0019",
		name: "Arcane Blast",
		description:
			"Harness formidable arcane energy as mana crystallizes. Arcane Blast reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0019.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Arcane Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0024",
		name: "Dark Blast",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Dark Blast revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0024.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 54,
		},
		flavor:
			"In the post-reset lattice, Dark Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0029",
		name: "Celestial Storm",
		description:
			"Channel formidable lightning energy as electricity arcs around your hands. Celestial Storm devastates the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0029.webp",
		effect:
			"On a hit, deals 7d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
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
				"On a hit, deals 7d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Celestial Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0034",
		name: "Thunder Storm",
		description:
			"Weave formidable lightning energy into a protective manifestation as static crackles. Thunder Storm fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0034.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"In the post-reset lattice, Thunder Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0039",
		name: "Abyssal Wave",
		description:
			"Harness formidable abyssal energy as hellfire ignites. Abyssal Wave weaves the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0039.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"In the post-reset lattice, Abyssal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0044",
		name: "Infernal Wave",
		description:
			"Draw upon formidable fire energy as flames erupt around the wounded. Infernal Wave purifies damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0044.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Infernal Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0049",
		name: "Shadow Nova",
		description:
			"Channel formidable shadow energy as umbral power surges around your hands. Shadow Nova assaults the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0049.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Shadow Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0054",
		name: "Divine Nova",
		description:
			"Weave formidable holy energy into a protective manifestation as divine light blazes. Divine Nova wards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0054.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"In the post-reset lattice, Divine Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0059",
		name: "Holy Nova",
		description:
			"Harness formidable holy energy as celestial power descends. Holy Nova transforms the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0059.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Holy Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0064",
		name: "Demonic Barrier",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Demonic Barrier mends damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0064.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 91,
		},
		flavor:
			"In the post-reset lattice, Demonic Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0069",
		name: "Frozen Barrier",
		description:
			"Channel formidable ice energy as frost crystallizes around your hands. Frozen Barrier strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0069.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Frozen Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0074",
		name: "Void Shield",
		description:
			"Weave formidable void energy into a protective manifestation as the void beckons. Void Shield protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0074.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Void Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0079",
		name: "Arcane Shield",
		description:
			"Harness formidable arcane energy as mana crystallizes. Arcane Shield channels the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0079.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Arcane Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0084",
		name: "Dark Shield",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Dark Shield heals damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0084.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor:
			"In the post-reset lattice, Dark Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0089",
		name: "Celestial Curse",
		description:
			"Channel formidable holy energy as celestial power descends around your hands. Celestial Curse devastates the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0089.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 11,
		},
		flavor:
			"In the post-reset lattice, Celestial Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0094",
		name: "Thunder Curse",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Curse guards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0094.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"In the post-reset lattice, Thunder Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0099",
		name: "Abyssal Blessing",
		description:
			"Harness formidable abyssal energy as hellfire ignites. Abyssal Blessing channels the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0099.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0104",
		name: "Infernal Blessing",
		description:
			"Draw upon formidable fire energy as embers spiral around the wounded. Infernal Blessing regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0104.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Infernal Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0109",
		name: "Shadow Healing",
		description:
			"Channel formidable shadow energy as void energy pulses around your hands. Shadow Healing shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0109.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Shadow Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0114",
		name: "Divine Healing",
		description:
			"Weave formidable holy energy into a protective manifestation as sacred energy surges. Divine Healing shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0114.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"In the post-reset lattice, Divine Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0119",
		name: "Holy Healing",
		description:
			"Harness formidable holy energy as radiance pours forth. Holy Healing weaves the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0119.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Holy Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0124",
		name: "Demonic Restoration",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Demonic Restoration restores damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0124.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Demonic Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0129",
		name: "Frozen Restoration",
		description:
			"Channel formidable ice energy as cold bites deep around your hands. Frozen Restoration hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0129.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Frozen Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0134",
		name: "Void Destruction",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Destruction protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0134.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"In the post-reset lattice, Void Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0139",
		name: "Arcane Destruction",
		description:
			"Harness formidable arcane energy as arcane sigils flare. Arcane Destruction reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0139.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"In the post-reset lattice, Arcane Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0144",
		name: "Dark Destruction",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Dark Destruction mends damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0144.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Dark Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0149",
		name: "Celestial Summoning",
		description:
			"Channel formidable holy energy as sacred energy surges around your hands. Celestial Summoning pierces the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0149.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Celestial Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0154",
		name: "Thunder Summoning",
		description:
			"Weave formidable lightning energy into a protective manifestation as static crackles. Thunder Summoning guards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0154.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"In the post-reset lattice, Thunder Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0159",
		name: "Abyssal Binding",
		description:
			"Harness formidable abyssal energy as abyssal energy erupts. Abyssal Binding crafts the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0159.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Abyssal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0164",
		name: "Infernal Binding",
		description:
			"Draw upon formidable fire energy as embers spiral around the wounded. Infernal Binding rejuvenates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0164.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"In the post-reset lattice, Infernal Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0169",
		name: "Shadow Teleportation",
		description:
			"Channel formidable shadow energy as umbral power surges around your hands. Shadow Teleportation hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0169.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"In the post-reset lattice, Shadow Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0174",
		name: "Divine Teleportation",
		description:
			"Weave formidable holy energy into a protective manifestation as radiance pours forth. Divine Teleportation protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0174.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Divine Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0179",
		name: "Holy Teleportation",
		description:
			"Harness formidable holy energy as celestial power descends. Holy Teleportation manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0179.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"In the post-reset lattice, Holy Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0184",
		name: "Demonic Transformation",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Demonic Transformation restores damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0184.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Demonic Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0189",
		name: "Frozen Transformation",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Transformation hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0189.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Frozen Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0194",
		name: "Void Bolt",
		description:
			"Weave formidable void energy into a protective manifestation as the void beckons. Void Bolt wards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0194.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Void Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0199",
		name: "Arcane Bolt",
		description:
			"Harness formidable arcane energy as arcane sigils flare. Arcane Bolt manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0199.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 72,
		},
		flavor:
			"In the post-reset lattice, Arcane Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0204",
		name: "Dark Bolt",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Bolt mends damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0204.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 18,
		},
		flavor:
			"In the post-reset lattice, Dark Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0209",
		name: "Celestial Blast",
		description:
			"Channel formidable holy energy as sacred energy surges around your hands. Celestial Blast hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0209.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Celestial Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0214",
		name: "Thunder Blast",
		description:
			"Weave formidable lightning energy into a protective manifestation as static crackles. Thunder Blast shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0214.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Thunder Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0219",
		name: "Abyssal Storm",
		description:
			"Harness formidable abyssal energy as hellfire ignites. Abyssal Storm manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0219.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"In the post-reset lattice, Abyssal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0224",
		name: "Infernal Storm",
		description:
			"Draw upon formidable fire energy as infernal energy blazes around the wounded. Infernal Storm purifies damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0224.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"In the post-reset lattice, Infernal Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0229",
		name: "Shadow Wave",
		description:
			"Channel formidable shadow energy as shadows gather around your hands. Shadow Wave shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0229.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"In the post-reset lattice, Shadow Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0234",
		name: "Divine Wave",
		description:
			"Weave formidable holy energy into a protective manifestation as radiance pours forth. Divine Wave fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0234.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Divine Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0239",
		name: "Holy Wave",
		description:
			"Harness formidable holy energy as sacred energy surges. Holy Wave manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0239.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Holy Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0244",
		name: "Demonic Nova",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Demonic Nova regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0244.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 87,
		},
		flavor:
			"In the post-reset lattice, Demonic Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0249",
		name: "Frozen Nova",
		description:
			"Channel formidable ice energy as glacial power flows around your hands. Frozen Nova shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0249.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"In the post-reset lattice, Frozen Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0254",
		name: "Void Barrier",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Barrier shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0254.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Void Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0259",
		name: "Arcane Barrier",
		description:
			"Harness formidable arcane energy as arcane sigils flare. Arcane Barrier alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0259.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 27,
		},
		flavor:
			"In the post-reset lattice, Arcane Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0264",
		name: "Dark Barrier",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Barrier regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0264.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"In the post-reset lattice, Dark Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0269",
		name: "Celestial Shield",
		description:
			"Channel formidable holy energy as divine light blazes around your hands. Celestial Shield devastates the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0269.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"In the post-reset lattice, Celestial Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0274",
		name: "Thunder Shield",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Shield protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0274.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Thunder Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0279",
		name: "Abyssal Curse",
		description:
			"Harness formidable abyssal energy as the abyss responds. Abyssal Curse transforms the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0279.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"In the post-reset lattice, Abyssal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0284",
		name: "Infernal Curse",
		description:
			"Draw upon formidable fire energy as flames erupt around the wounded. Infernal Curse revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0284.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"In the post-reset lattice, Infernal Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0289",
		name: "Shadow Blessing",
		description:
			"Channel formidable shadow energy as shadows gather around your hands. Shadow Blessing strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0289.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Shadow Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0294",
		name: "Divine Blessing",
		description:
			"Weave formidable holy energy into a protective manifestation as sacred energy surges. Divine Blessing fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0294.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"In the post-reset lattice, Divine Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0299",
		name: "Holy Blessing",
		description:
			"Harness formidable holy energy as sacred energy surges. Holy Blessing channels the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0299.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 48,
		},
		flavor:
			"In the post-reset lattice, Holy Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0304",
		name: "Demonic Healing",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Demonic Healing rejuvenates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0304.webp",
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
				dice: "4d8",
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
		id: "spell-0309",
		name: "Frozen Healing",
		description:
			"Channel formidable ice energy as frost crystallizes around your hands. Frozen Healing hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0309.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
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
		id: "spell-0314",
		name: "Void Restoration",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Restoration protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0314.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Void Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0319",
		name: "Arcane Restoration",
		description:
			"Harness formidable arcane energy as magical weave tightens. Arcane Restoration alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0319.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor:
			"In the post-reset lattice, Arcane Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0324",
		name: "Dark Restoration",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Dark Restoration purifies damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0324.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 58,
		},
		flavor:
			"In the post-reset lattice, Dark Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0329",
		name: "Celestial Destruction",
		description:
			"Channel formidable holy energy as radiance pours forth around your hands. Celestial Destruction strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0329.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"In the post-reset lattice, Celestial Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0334",
		name: "Thunder Destruction",
		description:
			"Weave formidable lightning energy into a protective manifestation as electricity arcs. Thunder Destruction shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0334.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Thunder Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0339",
		name: "Abyssal Summoning",
		description:
			"Harness formidable abyssal energy as abyssal energy erupts. Abyssal Summoning manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0339.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Abyssal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0344",
		name: "Infernal Summoning",
		description:
			"Draw upon formidable fire energy as heat distorts the air around the wounded. Infernal Summoning regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0344.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Infernal Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0349",
		name: "Shadow Binding",
		description:
			"Channel formidable shadow energy as darkness coalesces around your hands. Shadow Binding shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0349.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 18,
		},
		flavor:
			"In the post-reset lattice, Shadow Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0354",
		name: "Divine Binding",
		description:
			"Weave formidable holy energy into a protective manifestation as sacred energy surges. Divine Binding fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0354.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"In the post-reset lattice, Divine Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0359",
		name: "Holy Binding",
		description:
			"Harness formidable holy energy as celestial power descends. Holy Binding crafts the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0359.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"In the post-reset lattice, Holy Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0364",
		name: "Demonic Teleportation",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Demonic Teleportation revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0364.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Demonic Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0369",
		name: "Frozen Teleportation",
		description:
			"Channel formidable ice energy as glacial power flows around your hands. Frozen Teleportation pierces the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0369.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 42,
		},
		flavor:
			"In the post-reset lattice, Frozen Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0374",
		name: "Void Transformation",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Transformation shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0374.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Void Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0379",
		name: "Arcane Transformation",
		description:
			"Harness formidable arcane energy as mana crystallizes. Arcane Transformation alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0379.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"In the post-reset lattice, Arcane Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0384",
		name: "Dark Transformation",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Transformation mends damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0384.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Dark Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0389",
		name: "Celestial Bolt",
		description:
			"Channel formidable holy energy as divine light blazes around your hands. Celestial Bolt strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0389.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"In the post-reset lattice, Celestial Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0394",
		name: "Thunder Bolt",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Bolt fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0394.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"In the post-reset lattice, Thunder Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0399",
		name: "Abyssal Blast",
		description:
			"Harness formidable abyssal energy as abyssal energy erupts. Abyssal Blast transforms the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0399.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Abyssal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0404",
		name: "Infernal Blast",
		description:
			"Draw upon formidable fire energy as heat distorts the air around the wounded. Infernal Blast regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0404.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 76,
		},
		flavor:
			"In the post-reset lattice, Infernal Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0409",
		name: "Shadow Storm",
		description:
			"Channel formidable shadow energy as umbral power surges around your hands. Shadow Storm blasts the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0409.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"In the post-reset lattice, Shadow Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0414",
		name: "Divine Storm",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Divine Storm deflects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0414.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"In the post-reset lattice, Divine Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0419",
		name: "Holy Storm",
		description:
			"Harness formidable lightning energy as static crackles. Holy Storm alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0419.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Holy Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0424",
		name: "Demonic Wave",
		description:
			"Draw upon formidable arcane energy as arcane sigils flare around the wounded. Demonic Wave heals damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0424.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"In the post-reset lattice, Demonic Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0429",
		name: "Frozen Wave",
		description:
			"Channel formidable ice energy as frost crystallizes around your hands. Frozen Wave rends the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0429.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"In the post-reset lattice, Frozen Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0434",
		name: "Void Nova",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Nova protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0434.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Void Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0439",
		name: "Arcane Nova",
		description:
			"Harness formidable arcane energy as magical weave tightens. Arcane Nova reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0439.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 29,
		},
		flavor:
			"In the post-reset lattice, Arcane Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0444",
		name: "Dark Nova",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Dark Nova rejuvenates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0444.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"In the post-reset lattice, Dark Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0449",
		name: "Celestial Barrier",
		description:
			"Channel formidable holy energy as celestial power descends around your hands. Celestial Barrier hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0449.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 13,
		},
		flavor:
			"In the post-reset lattice, Celestial Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0454",
		name: "Thunder Barrier",
		description:
			"Weave formidable lightning energy into a protective manifestation as electricity arcs. Thunder Barrier barriers against against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0454.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Thunder Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0459",
		name: "Abyssal Shield",
		description:
			"Harness formidable abyssal energy as the abyss responds. Abyssal Shield reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0459.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Abyssal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0464",
		name: "Infernal Shield",
		description:
			"Draw upon formidable fire energy as heat distorts the air around the wounded. Infernal Shield regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0464.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"In the post-reset lattice, Infernal Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0469",
		name: "Shadow Curse",
		description:
			"Channel formidable shadow energy as darkness coalesces around your hands. Shadow Curse hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0469.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 54,
		},
		flavor:
			"In the post-reset lattice, Shadow Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0474",
		name: "Divine Curse",
		description:
			"Weave formidable holy energy into a protective manifestation as radiance pours forth. Divine Curse fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0474.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"In the post-reset lattice, Divine Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0479",
		name: "Holy Curse",
		description:
			"Harness formidable holy energy as radiance pours forth. Holy Curse manipulates the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0479.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Holy Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0484",
		name: "Demonic Blessing",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Demonic Blessing regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0484.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Demonic Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0489",
		name: "Frozen Blessing",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Blessing strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0489.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 19,
		},
		flavor:
			"In the post-reset lattice, Frozen Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0494",
		name: "Void Healing",
		description:
			"Weave formidable void energy into a protective manifestation as the void beckons. Void Healing protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0494.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"In the post-reset lattice, Void Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0499",
		name: "Arcane Healing",
		description:
			"Harness formidable arcane energy as mana crystallizes. Arcane Healing alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0499.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Arcane Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0504",
		name: "Dark Healing",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Dark Healing mends damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0504.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 68,
		},
		flavor:
			"In the post-reset lattice, Dark Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0509",
		name: "Celestial Restoration",
		description:
			"Channel formidable holy energy as radiance pours forth around your hands. Celestial Restoration hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0509.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Celestial Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0514",
		name: "Thunder Restoration",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Restoration guards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0514.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Thunder Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0519",
		name: "Abyssal Destruction",
		description:
			"Harness formidable abyssal energy as demonic resonance builds. Abyssal Destruction crafts the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0519.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"In the post-reset lattice, Abyssal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0524",
		name: "Infernal Destruction",
		description:
			"Draw upon formidable fire energy as heat distorts the air around the wounded. Infernal Destruction revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0524.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Infernal Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0529",
		name: "Shadow Summoning",
		description:
			"Channel formidable shadow energy as void energy pulses around your hands. Shadow Summoning strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0529.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 18,
		},
		flavor:
			"In the post-reset lattice, Shadow Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0534",
		name: "Divine Summoning",
		description:
			"Weave formidable holy energy into a protective manifestation as divine light blazes. Divine Summoning guards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0534.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Divine Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0539",
		name: "Holy Summoning",
		description:
			"Harness formidable holy energy as divine light blazes. Holy Summoning channels the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0539.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 23,
		},
		flavor:
			"In the post-reset lattice, Holy Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0544",
		name: "Demonic Binding",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Demonic Binding heals damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0544.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"In the post-reset lattice, Demonic Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0549",
		name: "Frozen Binding",
		description:
			"Channel formidable ice energy as glacial power flows around your hands. Frozen Binding strikes the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0549.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Frozen Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0554",
		name: "Void Teleportation",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Teleportation protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0554.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Void Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0559",
		name: "Arcane Teleportation",
		description:
			"Harness formidable arcane energy as magical weave tightens. Arcane Teleportation reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0559.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 34,
		},
		flavor:
			"In the post-reset lattice, Arcane Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0564",
		name: "Dark Teleportation",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Teleportation regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0564.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Dark Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0569",
		name: "Celestial Transformation",
		description:
			"Channel formidable holy energy as radiance pours forth around your hands. Celestial Transformation assaults the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0569.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Celestial Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0574",
		name: "Thunder Transformation",
		description:
			"Weave formidable lightning energy into a protective manifestation as thunder rumbles. Thunder Transformation fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0574.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Thunder Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0579",
		name: "Abyssal Bolt",
		description:
			"Harness formidable abyssal energy as hellfire ignites. Abyssal Bolt weaves the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0579.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"In the post-reset lattice, Abyssal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0584",
		name: "Infernal Bolt",
		description:
			"Draw upon formidable fire energy as embers spiral around the wounded. Infernal Bolt restores damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0584.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 16,
		},
		flavor:
			"In the post-reset lattice, Infernal Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0589",
		name: "Shadow Blast",
		description:
			"Channel formidable shadow energy as shadows gather around your hands. Shadow Blast assaults the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0589.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor:
			"In the post-reset lattice, Shadow Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0594",
		name: "Divine Blast",
		description:
			"Weave formidable holy energy into a protective manifestation as sacred energy surges. Divine Blast protects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0594.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"In the post-reset lattice, Divine Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0599",
		name: "Holy Blast",
		description:
			"Harness formidable holy energy as divine light blazes. Holy Blast alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0599.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Holy Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0604",
		name: "Demonic Storm",
		description:
			"Draw upon formidable lightning energy as voltage surges around the wounded. Demonic Storm regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0604.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"In the post-reset lattice, Demonic Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0609",
		name: "Frozen Storm",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Storm shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0609.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Frozen Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0614",
		name: "Void Wave",
		description:
			"Weave formidable void energy into a protective manifestation as reality thins. Void Wave shields against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0614.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"In the post-reset lattice, Void Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0619",
		name: "Arcane Wave",
		description:
			"Harness formidable arcane energy as mana crystallizes. Arcane Wave transforms the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0619.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Arcane Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0624",
		name: "Dark Wave",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Dark Wave revitalizes damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0624.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"In the post-reset lattice, Dark Wave is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0629",
		name: "Celestial Nova",
		description:
			"Channel formidable holy energy as sacred energy surges around your hands. Celestial Nova devastates the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0629.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"In the post-reset lattice, Celestial Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0634",
		name: "Thunder Nova",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Nova deflects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0634.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Thunder Nova is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0639",
		name: "Abyssal Barrier",
		description:
			"Harness formidable abyssal energy as the abyss responds. Abyssal Barrier crafts the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0639.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 93,
		},
		flavor:
			"In the post-reset lattice, Abyssal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0644",
		name: "Infernal Barrier",
		description:
			"Draw upon formidable fire energy as embers spiral around the wounded. Infernal Barrier purifies damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0644.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"In the post-reset lattice, Infernal Barrier is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0649",
		name: "Shadow Shield",
		description:
			"Channel formidable shadow energy as darkness coalesces around your hands. Shadow Shield pierces the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0649.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Shadow Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0654",
		name: "Divine Shield",
		description:
			"Weave formidable holy energy into a protective manifestation as radiance pours forth. Divine Shield barriers against against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0654.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 13,
		},
		flavor:
			"In the post-reset lattice, Divine Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0659",
		name: "Holy Shield",
		description:
			"Harness formidable holy energy as sacred energy surges. Holy Shield reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0659.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"In the post-reset lattice, Holy Shield is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0664",
		name: "Demonic Curse",
		description:
			"Draw upon formidable arcane energy as arcane sigils flare around the wounded. Demonic Curse regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0664.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"In the post-reset lattice, Demonic Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0669",
		name: "Frozen Curse",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Curse shreds the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0669.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"In the post-reset lattice, Frozen Curse is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0674",
		name: "Void Blessing",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Blessing barriers against against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0674.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 95,
		},
		flavor:
			"In the post-reset lattice, Void Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0679",
		name: "Arcane Blessing",
		description:
			"Harness formidable arcane energy as magical weave tightens. Arcane Blessing reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0679.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 38,
		},
		flavor:
			"In the post-reset lattice, Arcane Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0684",
		name: "Dark Blessing",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Blessing heals damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0684.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"In the post-reset lattice, Dark Blessing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0689",
		name: "Celestial Healing",
		description:
			"Channel formidable holy energy as celestial power descends around your hands. Celestial Healing pierces the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0689.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor:
			"In the post-reset lattice, Celestial Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0694",
		name: "Thunder Healing",
		description:
			"Weave formidable lightning energy into a protective manifestation as static crackles. Thunder Healing wards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0694.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"In the post-reset lattice, Thunder Healing is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0699",
		name: "Abyssal Restoration",
		description:
			"Harness formidable abyssal energy as abyssal energy erupts. Abyssal Restoration reshapes the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0699.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"In the post-reset lattice, Abyssal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0704",
		name: "Infernal Restoration",
		description:
			"Draw upon formidable fire energy as heat distorts the air around the wounded. Infernal Restoration regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0704.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 65,
		},
		flavor:
			"In the post-reset lattice, Infernal Restoration is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0709",
		name: "Shadow Destruction",
		description:
			"Channel formidable shadow energy as darkness coalesces around your hands. Shadow Destruction hammers the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0709.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 59,
		},
		flavor:
			"In the post-reset lattice, Shadow Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0714",
		name: "Divine Destruction",
		description:
			"Weave formidable holy energy into a protective manifestation as celestial power descends. Divine Destruction fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0714.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 43,
		},
		flavor:
			"In the post-reset lattice, Divine Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0719",
		name: "Holy Destruction",
		description:
			"Harness formidable holy energy as sacred energy surges. Holy Destruction alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0719.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Holy Destruction is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0724",
		name: "Demonic Summoning",
		description:
			"Draw upon formidable arcane energy as mana crystallizes around the wounded. Demonic Summoning restores damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0724.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 94,
		},
		flavor:
			"In the post-reset lattice, Demonic Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0729",
		name: "Frozen Summoning",
		description:
			"Channel formidable ice energy as permafrost spreads around your hands. Frozen Summoning pierces the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0729.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 41,
		},
		flavor:
			"In the post-reset lattice, Frozen Summoning is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0734",
		name: "Void Binding",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Binding fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0734.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"In the post-reset lattice, Void Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0739",
		name: "Arcane Binding",
		description:
			"Harness formidable arcane energy as arcane sigils flare. Arcane Binding transforms the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0739.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"In the post-reset lattice, Arcane Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0744",
		name: "Dark Binding",
		description:
			"Draw upon formidable arcane energy as magical weave tightens around the wounded. Dark Binding purifies damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0744.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 83,
		},
		flavor:
			"In the post-reset lattice, Dark Binding is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0749",
		name: "Celestial Teleportation",
		description:
			"Channel formidable holy energy as sacred energy surges around your hands. Celestial Teleportation blasts the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0749.webp",
		effect:
			"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 7d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"In the post-reset lattice, Celestial Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0754",
		name: "Thunder Teleportation",
		description:
			"Weave formidable lightning energy into a protective manifestation as voltage surges. Thunder Teleportation deflects against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0754.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 84,
		},
		flavor:
			"In the post-reset lattice, Thunder Teleportation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0759",
		name: "Abyssal Transformation",
		description:
			"Harness formidable abyssal energy as abyssal energy erupts. Abyssal Transformation weaves the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0759.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"In the post-reset lattice, Abyssal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0764",
		name: "Infernal Transformation",
		description:
			"Draw upon formidable fire energy as infernal energy blazes around the wounded. Infernal Transformation restores damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0764.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 29,
		},
		flavor:
			"In the post-reset lattice, Infernal Transformation is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0769",
		name: "Shadow Bolt",
		description:
			"Channel formidable shadow energy as shadows gather around your hands. Shadow Bolt assaults the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0769.webp",
		effect:
			"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 7d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 37,
		},
		flavor:
			"In the post-reset lattice, Shadow Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0774",
		name: "Divine Bolt",
		description:
			"Weave formidable holy energy into a protective manifestation as radiance pours forth. Divine Bolt wards against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0774.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 17,
		},
		flavor:
			"In the post-reset lattice, Divine Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0779",
		name: "Holy Bolt",
		description:
			"Harness formidable holy energy as sacred energy surges. Holy Bolt weaves the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0779.webp",
		effect:
			"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a holy-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"In the post-reset lattice, Holy Bolt is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0784",
		name: "Demonic Blast",
		description:
			"Draw upon formidable arcane energy as raw power coalesces around the wounded. Demonic Blast regenerates damaged tissue and restores vitality. A technique feared on every battlefield. Few can withstand it.",
		type: "Healing",
		rank: "A",
		image: "/generated/compendium/spells/spell-0784.webp",
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
				dice: "4d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"In the post-reset lattice, Demonic Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0789",
		name: "Frozen Blast",
		description:
			"Channel formidable ice energy as frost crystallizes around your hands. Frozen Blast blasts the target with concentrated destructive force. A technique feared on every battlefield. Few can withstand it.",
		type: "Attack",
		rank: "A",
		image: "/generated/compendium/spells/spell-0789.webp",
		effect:
			"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 7d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "7d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"In the post-reset lattice, Frozen Blast is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0794",
		name: "Void Storm",
		description:
			"Weave formidable void energy into a protective manifestation as entropy accelerates. Void Storm fortifies against incoming harm with layered magical barriers. A technique feared on every battlefield. Few can withstand it.",
		type: "Defense",
		rank: "A",
		image: "/generated/compendium/spells/spell-0794.webp",
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
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"In the post-reset lattice, Void Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0799",
		name: "Arcane Storm",
		description:
			"Harness formidable lightning energy as voltage surges. Arcane Storm alters the fabric of reality to produce extraordinary effects. A technique feared on every battlefield. Few can withstand it.",
		type: "Utility",
		rank: "A",
		image: "/generated/compendium/spells/spell-0799.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 16,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"In the post-reset lattice, Arcane Storm is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
];
