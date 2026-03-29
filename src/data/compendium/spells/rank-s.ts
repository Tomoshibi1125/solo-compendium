import type { CompendiumSpell } from "@/types/compendium";

export const spells_s: CompendiumSpell[] = [
	{
		id: "spell-0005",
		name: "Celestial Bolt",
		description:
			"Channel overwhelming holy energy as divine light blazes around your hands. Celestial Bolt devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0005.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"Ignores the concept of defeat. A devastating surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0010",
		name: "Thunder Bolt",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Thunder Bolt wards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0010.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 103,
		},
		flavor:
			"Destroys the darkness within. A desperate breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0015",
		name: "Abyssal Blast",
		description:
			"Harness overwhelming abyssal energy as the abyss responds. Abyssal Blast transforms the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0015.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"Reclaims the dimensional divide. An overwhelming symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0020",
		name: "Infernal Blast",
		description:
			"Draw upon overwhelming fire energy as heat distorts the air around the wounded. Infernal Blast revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0020.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"Ignores the quiet space between breaths. A devastating death of hesitation.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0025",
		name: "Shadow Storm",
		description:
			"Channel overwhelming shadow energy as shadows gather around your hands. Shadow Storm pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0025.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 19,
		},
		flavor: "Cleanses the architect's design. An intricate roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0030",
		name: "Divine Storm",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Divine Storm fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0030.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"Destroys all who stand in opposition. A triumphant whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0035",
		name: "Holy Storm",
		description:
			"Harness overwhelming lightning energy as static crackles. Holy Storm manipulates the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0035.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor:
			"Destroys the fragile limits of flesh. A desperate ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0040",
		name: "Demonic Wave",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Demonic Wave purifies damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0040.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"Shatters the arrogant and the mighty. A chaotic whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0045",
		name: "Frozen Wave",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Wave assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0045.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"Crushes the darkness within. A desperate breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0050",
		name: "Void Nova",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Nova guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0050.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor: "Ignites the architect's design. A triumphant death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0055",
		name: "Arcane Nova",
		description:
			"Harness overwhelming arcane energy as arcane sigils flare. Arcane Nova channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0055.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 24,
		},
		flavor: "Denies the architect's design. A chaotic roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0060",
		name: "Dark Nova",
		description:
			"Draw upon overwhelming arcane energy as mana crystallizes around the wounded. Dark Nova restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0060.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"Crushes the concept of defeat. A forbidden dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0065",
		name: "Celestial Barrier",
		description:
			"Channel overwhelming holy energy as divine light blazes around your hands. Celestial Barrier pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0065.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 31,
		},
		flavor:
			"Cleanses the architect's design. An intricate death of hesitation.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0070",
		name: "Thunder Barrier",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Thunder Barrier deflects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0070.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 52,
		},
		flavor:
			"Absorbs the quiet space between breaths. A brutal death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0075",
		name: "Abyssal Shield",
		description:
			"Harness overwhelming abyssal energy as abyssal energy erupts. Abyssal Shield channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0075.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"Cleanses the quiet space between breaths. A forbidden roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0080",
		name: "Infernal Shield",
		description:
			"Draw upon overwhelming fire energy as embers spiral around the wounded. Infernal Shield restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0080.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"Weaves the dimensional divide. A relentless testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0085",
		name: "Shadow Curse",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Curse pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0085.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor: "Cleanses the architect's design. A subtle roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0090",
		name: "Divine Curse",
		description:
			"Weave overwhelming holy energy into a protective manifestation as radiance pours forth. Divine Curse shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0090.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"Destroys all who stand in opposition. A desperate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0095",
		name: "Holy Curse",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Curse manipulates the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0095.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"Cleanses the fragile limits of flesh. A forbidden ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0100",
		name: "Demonic Blessing",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Demonic Blessing heals damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0100.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor: "Reclaims the architect's design. A silent roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0105",
		name: "Frozen Blessing",
		description:
			"Channel overwhelming ice energy as frost crystallizes around your hands. Frozen Blessing rends the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0105.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"Ignores the darkness within. A devastating breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0110",
		name: "Void Healing",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Healing fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0110.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"Ignores the flow of time itself. A relentless testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0115",
		name: "Arcane Healing",
		description:
			"Harness overwhelming arcane energy as mana crystallizes. Arcane Healing weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0115.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 33,
		},
		flavor: "Reflects the flow of time itself. A chaotic symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0120",
		name: "Dark Healing",
		description:
			"Draw upon overwhelming arcane energy as mana crystallizes around the wounded. Dark Healing revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0120.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 90,
		},
		flavor:
			"Crushes the remnants of humanity. A forbidden surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0125",
		name: "Celestial Restoration",
		description:
			"Channel overwhelming holy energy as celestial power descends around your hands. Celestial Restoration hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0125.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 49,
		},
		flavor:
			"Reflects the remnants of humanity. A silent dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0130",
		name: "Thunder Restoration",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as voltage surges. Thunder Restoration protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0130.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"Cleanses the quiet space between breaths. A subtle roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0135",
		name: "Abyssal Destruction",
		description:
			"Harness overwhelming abyssal energy as hellfire ignites. Abyssal Destruction reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0135.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"Overrides the fragile limits of flesh. A devastating ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0140",
		name: "Infernal Destruction",
		description:
			"Draw upon overwhelming fire energy as infernal energy blazes around the wounded. Infernal Destruction regenerates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0140.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"Shatters the fragile limits of flesh. An overwhelming breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0145",
		name: "Shadow Summoning",
		description:
			"Channel overwhelming shadow energy as darkness coalesces around your hands. Shadow Summoning blasts the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0145.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"Bends all who stand in opposition. An intricate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0150",
		name: "Divine Summoning",
		description:
			"Weave overwhelming holy energy into a protective manifestation as celestial power descends. Divine Summoning fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0150.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 61,
		},
		flavor:
			"Crushes the flow of time itself. A forbidden symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0155",
		name: "Holy Summoning",
		description:
			"Harness overwhelming holy energy as divine light blazes. Holy Summoning crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0155.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 78,
		},
		flavor:
			"Ignites the fragile limits of flesh. A sorrowful breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0160",
		name: "Demonic Binding",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Demonic Binding mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0160.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"Overrides the concept of defeat. A silent dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0165",
		name: "Frozen Binding",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Binding pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0165.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"Reclaims the quiet space between breaths. A devastating death of hesitation.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0170",
		name: "Void Teleportation",
		description:
			"Weave overwhelming void energy into a protective manifestation as dimensional rift tears open. Void Teleportation guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0170.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"Denies the remnants of humanity. A chaotic dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0175",
		name: "Arcane Teleportation",
		description:
			"Harness overwhelming arcane energy as raw power coalesces. Arcane Teleportation crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0175.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 16,
		},
		flavor: "Reflects the architect's design. A silent death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0180",
		name: "Dark Teleportation",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Dark Teleportation revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0180.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"Reflects the darkness within. A chaotic breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0185",
		name: "Celestial Transformation",
		description:
			"Channel overwhelming holy energy as radiance pours forth around your hands. Celestial Transformation hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0185.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor: "Reclaims the darkness within. A devastating ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0190",
		name: "Thunder Transformation",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as voltage surges. Thunder Transformation wards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0190.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"Reflects the arrogant and the mighty. An overwhelming beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0195",
		name: "Abyssal Bolt",
		description:
			"Harness overwhelming abyssal energy as the abyss responds. Abyssal Bolt crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0195.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 101,
		},
		flavor:
			"Ignites the flow of time itself. A triumphant testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0200",
		name: "Infernal Bolt",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Bolt heals damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0200.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor: "Cleanses the architect's design. A subtle roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0205",
		name: "Shadow Blast",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Blast pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0205.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 76,
		},
		flavor: "Cleanses the architect's design. A subtle death of hesitation.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0210",
		name: "Divine Blast",
		description:
			"Weave overwhelming holy energy into a protective manifestation as radiance pours forth. Divine Blast wards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0210.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 79,
		},
		flavor:
			"Destroys all who stand in opposition. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0215",
		name: "Holy Blast",
		description:
			"Harness overwhelming holy energy as divine light blazes. Holy Blast weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0215.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 88,
		},
		flavor:
			"Cleanses the fragile limits of flesh. A forbidden breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0220",
		name: "Demonic Storm",
		description:
			"Draw upon overwhelming lightning energy as thunder rumbles around the wounded. Demonic Storm revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0220.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor: "Ignites the architect's design. An ancient roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0225",
		name: "Frozen Storm",
		description:
			"Channel overwhelming ice energy as permafrost spreads around your hands. Frozen Storm assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0225.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 48,
		},
		flavor:
			"Overrides the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0230",
		name: "Void Wave",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Wave shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0230.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"Ignores the dimensional divide. An absolute testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0235",
		name: "Arcane Wave",
		description:
			"Harness overwhelming arcane energy as arcane sigils flare. Arcane Wave weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0235.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"Bends the arrogant and the mighty. An absolute beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0240",
		name: "Dark Wave",
		description:
			"Draw upon overwhelming arcane energy as mana crystallizes around the wounded. Dark Wave mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0240.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor:
			"Ignores the fragile limits of flesh. A devastating breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0245",
		name: "Celestial Nova",
		description:
			"Channel overwhelming holy energy as radiance pours forth around your hands. Celestial Nova assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0245.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"Weaves the quiet space between breaths. A relentless death of hesitation.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0250",
		name: "Thunder Nova",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Thunder Nova deflects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0250.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"Ignites all who stand in opposition. A triumphant whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0255",
		name: "Abyssal Barrier",
		description:
			"Harness overwhelming abyssal energy as abyssal energy erupts. Abyssal Barrier crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0255.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor:
			"Reflects the arrogant and the mighty. A chaotic beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0260",
		name: "Infernal Barrier",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Barrier mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0260.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 105,
		},
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0265",
		name: "Shadow Shield",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Shield shreds the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0265.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"Absorbs the flow of time itself. A brutal testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0270",
		name: "Divine Shield",
		description:
			"Weave overwhelming holy energy into a protective manifestation as radiance pours forth. Divine Shield barriers against against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0270.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 48,
		},
		flavor: "Reclaims the architect's design. A silent roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0275",
		name: "Holy Shield",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Shield transforms the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0275.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"Commands the concept of defeat. A desperate surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0280",
		name: "Demonic Curse",
		description:
			"Draw upon overwhelming arcane energy as arcane sigils flare around the wounded. Demonic Curse restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0280.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor: "Shatters the architect's design. A brutal roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0285",
		name: "Frozen Curse",
		description:
			"Channel overwhelming ice energy as cold bites deep around your hands. Frozen Curse pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0285.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"Overrides the concept of defeat. A relentless dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0290",
		name: "Void Blessing",
		description:
			"Weave overwhelming void energy into a protective manifestation as the void beckons. Void Blessing fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0290.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"Shatters the arrogant and the mighty. An overwhelming whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0295",
		name: "Arcane Blessing",
		description:
			"Harness overwhelming arcane energy as arcane sigils flare. Arcane Blessing reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0295.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"Cleanses all who stand in opposition. An intricate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0300",
		name: "Dark Blessing",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Dark Blessing mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0300.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 107,
		},
		flavor:
			"Crushes all who stand in opposition. An intricate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0305",
		name: "Celestial Healing",
		description:
			"Channel overwhelming holy energy as sacred energy surges around your hands. Celestial Healing blasts the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0305.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor: "Weaves the darkness within. A relentless ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0310",
		name: "Thunder Healing",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as voltage surges. Thunder Healing shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0310.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 106,
		},
		flavor:
			"Absorbs all who stand in opposition. An ancient beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0315",
		name: "Abyssal Restoration",
		description:
			"Harness overwhelming abyssal energy as abyssal energy erupts. Abyssal Restoration weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0315.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"Overrides the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0320",
		name: "Infernal Restoration",
		description:
			"Draw upon overwhelming fire energy as infernal energy blazes around the wounded. Infernal Restoration revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0320.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor:
			"Ignores the flow of time itself. An absolute testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0325",
		name: "Shadow Destruction",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Destruction devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0325.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 30,
		},
		flavor:
			"Ignores the dimensional divide. A relentless testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0330",
		name: "Divine Destruction",
		description:
			"Weave overwhelming holy energy into a protective manifestation as radiance pours forth. Divine Destruction fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0330.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"Absorbs all who stand in opposition. A sorrowful beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0335",
		name: "Holy Destruction",
		description:
			"Harness overwhelming holy energy as sacred energy surges. Holy Destruction weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0335.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"Absorbs the arrogant and the mighty. An ancient beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0340",
		name: "Demonic Summoning",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Demonic Summoning rejuvenates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0340.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 83,
		},
		flavor:
			"Denies the quiet space between breaths. A chaotic roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0345",
		name: "Frozen Summoning",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Summoning strikes the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0345.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 54,
		},
		flavor:
			"Bends all who stand in opposition. An intricate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0350",
		name: "Void Binding",
		description:
			"Weave overwhelming void energy into a protective manifestation as dimensional rift tears open. Void Binding deflects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0350.webp",
		effect:
			"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
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
				"Creates a barrier of void energy that absorbs damage and grants temporary resistance to force damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"Ignores all who stand in opposition. A devastating whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0355",
		name: "Arcane Binding",
		description:
			"Harness overwhelming arcane energy as arcane sigils flare. Arcane Binding manipulates the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0355.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 26,
		},
		flavor:
			"Absorbs the dimensional divide. A brutal testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0360",
		name: "Dark Binding",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Dark Binding purifies damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0360.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 97,
		},
		flavor:
			"Crushes the concept of defeat. An intricate dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0365",
		name: "Celestial Teleportation",
		description:
			"Channel overwhelming holy energy as celestial power descends around your hands. Celestial Teleportation hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0365.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"Reclaims all who stand in opposition. A silent beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0370",
		name: "Thunder Teleportation",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as voltage surges. Thunder Teleportation fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0370.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"Ignites the fragile limits of flesh. A triumphant ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0375",
		name: "Abyssal Transformation",
		description:
			"Harness overwhelming abyssal energy as abyssal energy erupts. Abyssal Transformation channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0375.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 60,
		},
		flavor:
			"Destroys the quiet space between breaths. A triumphant roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0380",
		name: "Infernal Transformation",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Transformation regenerates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0380.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 59,
		},
		flavor: "Absorbs the architect's design. An ancient roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0385",
		name: "Shadow Bolt",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Bolt assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0385.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 67,
		},
		flavor:
			"Cleanses the dimensional divide. An intricate testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0390",
		name: "Divine Bolt",
		description:
			"Weave overwhelming holy energy into a protective manifestation as divine light blazes. Divine Bolt protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0390.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"Absorbs the fragile limits of flesh. An ancient ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0395",
		name: "Holy Bolt",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Bolt reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0395.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 81,
		},
		flavor:
			"Destroys the darkness within. A sorrowful breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0400",
		name: "Demonic Blast",
		description:
			"Draw upon overwhelming arcane energy as arcane sigils flare around the wounded. Demonic Blast mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0400.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor: "Shatters the concept of defeat. A brutal surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0405",
		name: "Frozen Blast",
		description:
			"Channel overwhelming ice energy as permafrost spreads around your hands. Frozen Blast rends the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0405.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"Overrides the flow of time itself. A relentless symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0410",
		name: "Void Storm",
		description:
			"Weave overwhelming void energy into a protective manifestation as the void beckons. Void Storm protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0410.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 18,
		},
		flavor:
			"Absorbs the quiet space between breaths. A brutal death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0415",
		name: "Arcane Storm",
		description:
			"Harness overwhelming lightning energy as electricity arcs. Arcane Storm channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0415.webp",
		effect:
			"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a lightning-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"Crushes the flow of time itself. A desperate testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0420",
		name: "Dark Storm",
		description:
			"Draw upon overwhelming lightning energy as static crackles around the wounded. Dark Storm restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0420.webp",
		effect:
			"Restores hit points and removes one condition caused by lightning-aligned sources.",
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
				"Restores hit points and removes one condition caused by lightning-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 57,
		},
		flavor: "Commands the darkness within. A desperate ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0425",
		name: "Celestial Wave",
		description:
			"Channel overwhelming holy energy as celestial power descends around your hands. Celestial Wave shreds the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0425.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"Commands all who stand in opposition. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0430",
		name: "Voltaic Barrier",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as thunder rumbles. Voltaic Barrier shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0430.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"Bends all who stand in opposition. An absolute beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0435",
		name: "Abyssal Nova",
		description:
			"Harness overwhelming abyssal energy as the abyss responds. Abyssal Nova manipulates the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0435.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"Destroys all who stand in opposition. A desperate beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0440",
		name: "Infernal Nova",
		description:
			"Draw upon overwhelming fire energy as embers spiral around the wounded. Infernal Nova rejuvenates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0440.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"Bends the remnants of humanity. An absolute dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0445",
		name: "Shadow Barrier",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Barrier assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0445.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"Shatters all who stand in opposition. A brutal whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0450",
		name: "Divine Barrier",
		description:
			"Weave overwhelming holy energy into a protective manifestation as celestial power descends. Divine Barrier guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0450.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"Overrides the arrogant and the mighty. A silent beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0455",
		name: "Holy Barrier",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Barrier reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0455.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 66,
		},
		flavor:
			"Destroys the concept of defeat. A sorrowful surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0460",
		name: "Demonic Shield",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Demonic Shield rejuvenates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0460.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"Reclaims the fragile limits of flesh. A silent breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0465",
		name: "Frozen Shield",
		description:
			"Channel overwhelming ice energy as cold bites deep around your hands. Frozen Shield pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0465.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 102,
		},
		flavor:
			"Ignores the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0470",
		name: "Void Curse",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Curse deflects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0470.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 42,
		},
		flavor: "Reflects the darkness within. A chaotic ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0475",
		name: "Arcane Curse",
		description:
			"Harness overwhelming arcane energy as raw power coalesces. Arcane Curse crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0475.webp",
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
				dc: 18,
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
		id: "spell-0480",
		name: "Dark Curse",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Dark Curse purifies damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0480.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 44,
		},
		flavor:
			"Commands the darkness within. A triumphant breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0485",
		name: "Celestial Blessing",
		description:
			"Channel overwhelming holy energy as divine light blazes around your hands. Celestial Blessing devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0485.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0490",
		name: "Thunder Blessing",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Thunder Blessing barriers against against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0490.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 50,
		},
		flavor:
			"Crushes the arrogant and the mighty. An intricate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0495",
		name: "Abyssal Healing",
		description:
			"Harness overwhelming abyssal energy as abyssal energy erupts. Abyssal Healing alters the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0495.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"Reclaims the quiet space between breaths. An overwhelming roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0500",
		name: "Infernal Healing",
		description:
			"Draw upon overwhelming fire energy as heat distorts the air around the wounded. Infernal Healing restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0500.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 108,
		},
		flavor:
			"Weaves the quiet space between breaths. An absolute roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0505",
		name: "Shadow Restoration",
		description:
			"Channel overwhelming shadow energy as shadows gather around your hands. Shadow Restoration strikes the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0505.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"Overrides the arrogant and the mighty. A silent beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0510",
		name: "Divine Restoration",
		description:
			"Weave overwhelming holy energy into a protective manifestation as sacred energy surges. Divine Restoration barriers against against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0510.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 89,
		},
		flavor:
			"Crushes the arrogant and the mighty. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0515",
		name: "Holy Restoration",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Restoration manipulates the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0515.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"Crushes the dimensional divide. A forbidden testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0520",
		name: "Demonic Destruction",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Demonic Destruction mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0520.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 46,
		},
		flavor:
			"Destroys all who stand in opposition. A sorrowful beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0525",
		name: "Frozen Destruction",
		description:
			"Channel overwhelming ice energy as permafrost spreads around your hands. Frozen Destruction rends the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0525.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"Crushes the quiet space between breaths. A forbidden roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0530",
		name: "Void Summoning",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Summoning barriers against against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0530.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"Shatters the fragile limits of flesh. A brutal breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0535",
		name: "Arcane Summoning",
		description:
			"Harness overwhelming arcane energy as magical weave tightens. Arcane Summoning transforms the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0535.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 25,
		},
		flavor:
			"Reclaims the darkness within. A devastating breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0540",
		name: "Dark Summoning",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Dark Summoning restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0540.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 58,
		},
		flavor:
			"Reclaims the flow of time itself. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0545",
		name: "Celestial Binding",
		description:
			"Channel overwhelming holy energy as celestial power descends around your hands. Celestial Binding blasts the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0545.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 53,
		},
		flavor:
			"Weaves the fragile limits of flesh. An absolute ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0550",
		name: "Thunder Binding",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as electricity arcs. Thunder Binding protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0550.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0555",
		name: "Abyssal Teleportation",
		description:
			"Harness overwhelming abyssal energy as hellfire ignites. Abyssal Teleportation channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0555.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 40,
		},
		flavor:
			"Ignores the arrogant and the mighty. An absolute whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0560",
		name: "Infernal Teleportation",
		description:
			"Draw upon overwhelming fire energy as heat distorts the air around the wounded. Infernal Teleportation heals damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0560.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"Bends the fragile limits of flesh. An absolute breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0565",
		name: "Shadow Transformation",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Transformation hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0565.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor:
			"Shatters the flow of time itself. A brutal testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0570",
		name: "Divine Transformation",
		description:
			"Weave overwhelming holy energy into a protective manifestation as sacred energy surges. Divine Transformation fortifies against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0570.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"Absorbs the remnants of humanity. An ancient dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0575",
		name: "Holy Transformation",
		description:
			"Harness overwhelming holy energy as divine light blazes. Holy Transformation transforms the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0575.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 28,
		},
		flavor:
			"Ignores the concept of defeat. A devastating dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0580",
		name: "Demonic Bolt",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Demonic Bolt restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0580.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "Weaves the architect's design. A subtle death of hesitation.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0585",
		name: "Frozen Bolt",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Bolt blasts the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0585.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 51,
		},
		flavor:
			"Overrides the dimensional divide. A devastating symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0590",
		name: "Void Blast",
		description:
			"Weave overwhelming void energy into a protective manifestation as the void beckons. Void Blast guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0590.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 92,
		},
		flavor:
			"Reflects the quiet space between breaths. A chaotic death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0595",
		name: "Arcane Blast",
		description:
			"Harness overwhelming arcane energy as mana crystallizes. Arcane Blast reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0595.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 55,
		},
		flavor:
			"Ignites the flow of time itself. A triumphant testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0600",
		name: "Dark Blast",
		description:
			"Draw upon overwhelming arcane energy as raw power coalesces around the wounded. Dark Blast heals damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0600.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 76,
		},
		flavor: "Commands the darkness within. A triumphant ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0605",
		name: "Celestial Storm",
		description:
			"Channel overwhelming lightning energy as electricity arcs around your hands. Celestial Storm devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0605.webp",
		effect:
			"On a hit, deals 10d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
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
				"On a hit, deals 10d6 lightning damage. Critical hits apply the lightning affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 104,
		},
		flavor:
			"Absorbs all who stand in opposition. A sorrowful whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0610",
		name: "Thunder Storm",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as thunder rumbles. Thunder Storm wards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0610.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 10,
		},
		flavor:
			"Crushes the quiet space between breaths. A desperate roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0615",
		name: "Abyssal Wave",
		description:
			"Harness overwhelming abyssal energy as demonic resonance builds. Abyssal Wave crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0615.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 69,
		},
		flavor:
			"Overrides the quiet space between breaths. A relentless roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0620",
		name: "Infernal Wave",
		description:
			"Draw upon overwhelming fire energy as embers spiral around the wounded. Infernal Wave purifies damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0620.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor:
			"Denies the arrogant and the mighty. A chaotic beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0625",
		name: "Shadow Nova",
		description:
			"Channel overwhelming shadow energy as void energy pulses around your hands. Shadow Nova pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0625.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor:
			"Bends the arrogant and the mighty. A subtle whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0630",
		name: "Divine Nova",
		description:
			"Weave overwhelming holy energy into a protective manifestation as sacred energy surges. Divine Nova protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0630.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"Ignites the quiet space between breaths. A sorrowful roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0635",
		name: "Holy Nova",
		description:
			"Harness overwhelming holy energy as celestial power descends. Holy Nova channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0635.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"Ignites all who stand in opposition. An ancient whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0640",
		name: "Demonic Barrier",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Demonic Barrier mends damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0640.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor: "Reflects the concept of defeat. A chaotic surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0645",
		name: "Frozen Barrier",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Barrier assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0645.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 39,
		},
		flavor: "Shatters the darkness within. An overwhelming ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0650",
		name: "Void Shield",
		description:
			"Weave overwhelming void energy into a protective manifestation as reality thins. Void Shield shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0650.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 75,
		},
		flavor:
			"Destroys the dimensional divide. A sorrowful symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0655",
		name: "Arcane Shield",
		description:
			"Harness overwhelming arcane energy as mana crystallizes. Arcane Shield weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0655.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 32,
		},
		flavor:
			"Bends the arrogant and the mighty. An absolute whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0660",
		name: "Dark Shield",
		description:
			"Draw upon overwhelming arcane energy as arcane sigils flare around the wounded. Dark Shield rejuvenates damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0660.webp",
		effect:
			"Restores hit points and removes one condition caused by arcane-aligned sources.",
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
				"Restores hit points and removes one condition caused by arcane-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"Overrides the dimensional divide. A devastating testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0665",
		name: "Celestial Curse",
		description:
			"Channel overwhelming holy energy as radiance pours forth around your hands. Celestial Curse strikes the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0665.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"Absorbs the dimensional divide. An ancient testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0670",
		name: "Thunder Curse",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as thunder rumbles. Thunder Curse protects against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0670.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 62,
		},
		flavor:
			"Crushes the quiet space between breaths. A forbidden roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0675",
		name: "Abyssal Blessing",
		description:
			"Harness overwhelming abyssal energy as the abyss responds. Abyssal Blessing crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0675.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 109,
		},
		flavor:
			"Reflects the arrogant and the mighty. A chaotic whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0680",
		name: "Infernal Blessing",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Blessing restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0680.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 15,
		},
		flavor:
			"Commands the arrogant and the mighty. A forbidden whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0685",
		name: "Shadow Healing",
		description:
			"Channel overwhelming shadow energy as shadows gather around your hands. Shadow Healing devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0685.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 85,
		},
		flavor:
			"Denies the quiet space between breaths. An ancient roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0690",
		name: "Divine Healing",
		description:
			"Weave overwhelming holy energy into a protective manifestation as radiance pours forth. Divine Healing shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0690.webp",
		effect:
			"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
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
				"Creates a barrier of holy energy that absorbs damage and grants temporary resistance to radiant damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 98,
		},
		flavor:
			"Absorbs all who stand in opposition. A brutal beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0695",
		name: "Holy Healing",
		description:
			"Harness overwhelming holy energy as radiance pours forth. Holy Healing reshapes the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0695.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 21,
		},
		flavor:
			"Crushes the quiet space between breaths. A forbidden roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0700",
		name: "Demonic Restoration",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Demonic Restoration revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0700.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 12,
		},
		flavor:
			"Crushes the arrogant and the mighty. A desperate whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0705",
		name: "Frozen Restoration",
		description:
			"Channel overwhelming ice energy as permafrost spreads around your hands. Frozen Restoration hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0705.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"Denies the quiet space between breaths. An ancient roar of raw mana.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0710",
		name: "Void Destruction",
		description:
			"Weave overwhelming void energy into a protective manifestation as the void beckons. Void Destruction guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0710.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 96,
		},
		flavor: "Bends the fragile limits of flesh. A subtle ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0715",
		name: "Arcane Destruction",
		description:
			"Harness overwhelming arcane energy as raw power coalesces. Arcane Destruction weaves the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0715.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 45,
		},
		flavor:
			"Cleanses the flow of time itself. A forbidden symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0720",
		name: "Dark Destruction",
		description:
			"Draw upon overwhelming arcane energy as magical weave tightens around the wounded. Dark Destruction restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0720.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 70,
		},
		flavor:
			"Commands the flow of time itself. A forbidden symphony of violence.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0725",
		name: "Celestial Summoning",
		description:
			"Channel overwhelming holy energy as celestial power descends around your hands. Celestial Summoning pierces the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0725.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 14,
		},
		flavor:
			"Reflects the flow of time itself. An overwhelming testament to absolute power.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0730",
		name: "Thunder Summoning",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as voltage surges. Thunder Summoning guards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0730.webp",
		effect:
			"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
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
				"Creates a barrier of lightning energy that absorbs damage and grants temporary resistance to lightning damage.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 99,
		},
		flavor:
			"Ignores the fragile limits of flesh. An absolute ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0735",
		name: "Abyssal Binding",
		description:
			"Harness overwhelming abyssal energy as demonic resonance builds. Abyssal Binding crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0735.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 29,
		},
		flavor:
			"Overrides the darkness within. A silent breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0740",
		name: "Infernal Binding",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Binding revitalizes damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0740.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 16,
		},
		flavor:
			"Ignites the darkness within. An ancient breaking point of the world.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0745",
		name: "Shadow Teleportation",
		description:
			"Channel overwhelming shadow energy as shadows gather around your hands. Shadow Teleportation devastates the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0745.webp",
		effect:
			"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
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
				"On a hit, deals 10d6 necrotic damage. Critical hits apply the shadow affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 64,
		},
		flavor:
			"Denies all who stand in opposition. A chaotic beautiful catastrophe.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0750",
		name: "Divine Teleportation",
		description:
			"Weave overwhelming holy energy into a protective manifestation as divine light blazes. Divine Teleportation shields against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0750.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 73,
		},
		flavor:
			"Reclaims the remnants of humanity. An overwhelming surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0755",
		name: "Holy Teleportation",
		description:
			"Harness overwhelming holy energy as sacred energy surges. Holy Teleportation channels the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0755.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 82,
		},
		flavor:
			"Overrides the remnants of humanity. A silent dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0760",
		name: "Demonic Transformation",
		description:
			"Draw upon overwhelming arcane energy as mana crystallizes around the wounded. Demonic Transformation heals damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0760.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 22,
		},
		flavor:
			"Commands the quiet space between breaths. A triumphant death of hesitation.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0765",
		name: "Frozen Transformation",
		description:
			"Channel overwhelming ice energy as glacial power flows around your hands. Frozen Transformation hammers the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0765.webp",
		effect:
			"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
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
				"On a hit, deals 10d6 ice damage. Critical hits apply the ice affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "force",
				},
			},
		},
		limitations: {
			mana_cost: 56,
		},
		flavor:
			"Cleanses the flow of time itself. An intricate symphony of violence.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0770",
		name: "Void Bolt",
		description:
			"Weave overwhelming void energy into a protective manifestation as entropy accelerates. Void Bolt barriers against against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0770.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 59,
		},
		flavor: "Absorbs the darkness within. A sorrowful ultimate equalizer.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0775",
		name: "Arcane Bolt",
		description:
			"Harness overwhelming arcane energy as raw power coalesces. Arcane Bolt crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0775.webp",
		effect:
			"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a arcane-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 71,
		},
		flavor:
			"Absorbs the remnants of humanity. A brutal dance performed on the edge of a blade.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0780",
		name: "Dark Bolt",
		description:
			"Draw upon overwhelming arcane energy as mana crystallizes around the wounded. Dark Bolt restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0780.webp",
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
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"Commands the remnants of humanity. A desperate surge of lethal intent.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0785",
		name: "Celestial Blast",
		description:
			"Channel overwhelming holy energy as radiance pours forth around your hands. Celestial Blast assaults the target with concentrated destructive force. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0785.webp",
		effect:
			"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
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
				"On a hit, deals 10d6 radiant damage. Critical hits apply the holy affliction condition for 1 round.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 77,
		},
		flavor:
			"Absorbs all who stand in opposition. An ancient whisper in the shadows.",
		higher_levels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.",
	},
	{
		id: "spell-0790",
		name: "Thunder Blast",
		description:
			"Weave overwhelming lightning energy into a protective manifestation as static crackles. Thunder Blast wards against incoming harm with layered magical barriers. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Defense",
		rank: "S",
		image: "/generated/compendium/spells/spell-0790.webp",
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
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"Crushes the quiet space between breaths. A forbidden death of hesitation.",
		higher_levels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
		atHigherLevels:
			"When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.",
	},
	{
		id: "spell-0795",
		name: "Abyssal Storm",
		description:
			"Harness overwhelming abyssal energy as hellfire ignites. Abyssal Storm crafts the fabric of reality to produce extraordinary effects. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0795.webp",
		effect:
			"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
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
				"Produces a abyssal-aligned effect that alters the environment or enhances the caster's capabilities.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "Reclaims the dimensional divide. A silent symphony of violence.",
		higher_levels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
		atHigherLevels:
			"When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.",
	},
	{
		id: "spell-0800",
		name: "Infernal Storm",
		description:
			"Draw upon overwhelming fire energy as flames erupt around the wounded. Infernal Storm restores damaged tissue and restores vitality. The pinnacle of magical achievement. Legends are built on this power.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0800.webp",
		effect:
			"Restores hit points and removes one condition caused by fire-aligned sources.",
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
				"Restores hit points and removes one condition caused by fire-aligned sources.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 35,
		},
		flavor:
			"Ignores the quiet space between breaths. A relentless death of hesitation.",
		higher_levels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
		atHigherLevels:
			"When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.",
	},
	{
		id: "spell-0801",
		name: "Eternal Shadow Convergence",
		description:
			"The ultimate shadow spell that merges all shadow elements into one devastating attack. This S rank spell represents the pinnacle of shadow magic.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0801.webp",
		effect:
			"Deals ultimate shadow damage and applies eternal shadow corruption to all enemies in range.",
		range: {
			type: "distance",
			value: 100,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Deals ultimate shadow damage and applies eternal shadow corruption to all enemies in range.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 150,
		},
		flavor:
			"Denies the fragile limits of flesh. An ancient breaking point of the world.",
	},
	{
		id: "spell-0802",
		name: "Void Reality Distortion",
		description:
			"A god-tier void spell that bends reality itself to the caster's will. This S rank spell can alter the fabric of existence.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0802.webp",
		effect:
			"Distorts reality in a massive area, creating void zones that nullify all other magic.",
		range: {
			type: "distance",
			value: 150,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Distorts reality in a massive area, creating void zones that nullify all other magic.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 200,
		},
		flavor:
			"Cleanses the flow of time itself. An intricate symphony of violence.",
	},
	{
		id: "spell-0803",
		name: "Supreme Abyssal Ascension",
		description:
			"The final spell that grants temporary godhood to the caster. This S rank spell channels the power of the supreme abyssal deity.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0803.webp",
		effect:
			"Grants complete invincibility and unlimited mana for a short duration while healing all allies.",
		range: {
			type: "distance",
			value: 200,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Grants complete invincibility and unlimited mana for a short duration while healing all allies.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"Commands the fragile limits of flesh. A desperate breaking point of the world.",
	},
];
