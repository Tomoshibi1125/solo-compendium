import type { CompendiumSpell } from "../../../types/compendium";

// Pilot rewrite: rank-D learnable castables.
// Each entry has been authored with:
//   - description derived from its actual attack/save/damage data (no templated copy)
//   - damage_type + school aligned with the spell's theme
//   - unique lore fields tied to Rift Ascendant worldbuilding
//   - distinct display names (D-tier duplicates renamed to tier-unique forms)
export const spells_d: CompendiumSpell[] = [
	{
		id: "spell-d-1",
		name: "Chill Lance",
		display_name: "Chill Lance",
		description:
			"Draw a spike of crystallized mana from the caster's palm and hurl it at a target within 30 feet. Make a ranged spell attack using Sense to deal 1d10 cold damage, or the target must succeed on a DC 14 Sense saving throw, taking full damage and becoming Frightened for 1 minute on a failure (half damage and no condition on a success).",
		lore: {
			origin:
				"Reverse-engineered from the frost plating of a Class-B Beast anomaly pulled from the Harbin Gate.",
			history:
				"Standardized by the Gate Bureau after three field medics reported matching casting gestures during uncoordinated debriefs.",
			curse: "",
			personality:
				"Quiet and precise; the spell hums faintly against metal within arm's reach.",
			current_owner: "Distributed openly to Bureau-licensed Rank D Hunters.",
			prior_owners: [
				"Medic-3 of the Harbin Recovery Team",
				"Gate Bureau archivist S. Ro",
			],
		},
		flavor:
			"The first breath of a Gate's inner chamber, cast back at anything warm enough to notice.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d10 cold damage on hit.",
			secondary: "Frightened 1 minute on failed DC 14 Sense save.",
		},
		level: 0,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "30 feet",
		duration: "Instantaneous",
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Sense",
			damage: "1d10",
		},
		saving_throw: {
			ability: "Sense",
			dc: 14,
			success: "Half damage, no condition.",
			failure: "Full damage and Frightened for 1 minute.",
		},
		atHigherLevels:
			"Each rank above D adds +1d10 cold damage. At rank B and higher, add a second target within 10 feet of the first.",
		higher_levels:
			"Each rank above D adds +1d10 cold damage. At rank B and higher, add a second target within 10 feet of the first.",
		area: {
			type: "point",
			size: "single target",
			shape: "point",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "Instantaneous",
			range: "30 feet",
			type: "Evocation",
			save_dc: 14,
			damage_profile: "1d10 cold",
			lattice_interaction: "Standard mana circuit",
			attack: {
				type: "cold",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "1d10",
				damage_type: "cold",
			},
			saving_throw: {
				ability: "Sense",
				dc: 14,
				success: "Half damage, no condition.",
				failure: "Full damage and Frightened for 1 minute.",
			},
			frequency: "1/long rest",
			action: "1 reaction",
			ability: "Sense",
			save: "Sense",
			dc: 14,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"The first verified cast on record: an E-rank medic froze a collapsed stairwell open long enough for her squad to climb out.",
		theme_tags: ["hunter-bureau", "post-awakening", "gate-recovery"],
	},
	{
		id: "spell-d-2",
		name: "Thunder Shackle",
		display_name: "Thunder Shackle",
		description:
			"Slam the lattice beneath a creature's feet; a 100-foot line erupts with percussive force. The primary target takes a ranged spell attack for 1d10 thunder damage (Presence), and each creature in the line must succeed on a DC 13 Agility save or take full damage and be Stunned until the end of its next turn (on a success, it is pushed 10 feet away instead).",
		lore: {
			origin:
				"First observed in the collapse of the Seoul Mid-Tier Gate, where the caster arrived with no memory of how he learned it.",
			history:
				"Classified under Bureau Protocol 14 until a second caster independently reproduced it two months later.",
			curse: "",
			personality:
				"Impatient; the air pressure spikes the moment the casting gesture begins.",
			current_owner: "Open Bureau training manual, Rank D volume.",
			prior_owners: [
				"Hunter K. Yun of the Seoul Third Wall",
				"Bureau Research Team Echo-9",
			],
		},
		flavor:
			"A handshake between two lattice nodes, offered to everything standing in the middle.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d10 thunder damage to the primary target.",
			secondary:
				"DC 13 Agility save for each creature in line; failure = full damage + Stunned until end of next turn; success = pushed 10 feet.",
		},
		level: 1,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "30 feet",
		duration: "Instantaneous",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "a shard of Gate crystal",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Presence",
			damage: "1d10",
		},
		saving_throw: {
			ability: "Agility",
			dc: 13,
			success: "Pushed 10 feet away.",
			failure: "Full damage and Stunned until end of next turn.",
		},
		atHigherLevels:
			"This spell's damage increases by 1d10 at rank B (2d10), rank A (3d10), and rank S (4d10). At rank A+ the line becomes 200 feet.",
		higher_levels:
			"This spell's damage increases by 1d10 at rank B (2d10), rank A (3d10), and rank S (4d10). At rank A+ the line becomes 200 feet.",
		area: {
			type: "line",
			size: "100-foot",
			shape: "line",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "Instantaneous",
			range: "30 feet",
			type: "Evocation",
			save_dc: 13,
			damage_profile: "1d10 thunder",
			lattice_interaction: "Amplified by lattice resonance",
			attack: {
				type: "thunder",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "1d10",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Agility",
				dc: 13,
				success: "Pushed 10 feet away.",
				failure: "Full damage and Stunned until end of next turn.",
			},
			frequency: "At will",
			action: "1 reaction",
			ability: "Presence",
			save: "Agility",
			dc: 13,
			scaling: "Scales with character level",
		},
		discovery_lore:
			"A rookie Hunter's panic cast opened a clean exit through three collapsed load-bearing walls.",
		theme_tags: ["post-awakening", "dimensional-bleed", "rescue-ops"],
	},
	{
		id: "spell-d-3",
		name: "Tempest Binding",
		display_name: "Tempest Binding",
		description:
			"Drive a ring of storm-charged lattice around a target within 300 feet. Make a ranged spell attack using Sense for 2d8 thunder damage, and the creature must succeed on a DC 13 Agility save or take full damage and fall Prone (half damage on a success). The thunderclap persists as a 20-foot cube for 1 minute, making the ground inside difficult terrain.",
		lore: {
			origin:
				"Drafted by Bureau artificers studying storm-element anomalies at the Icheon containment site.",
			history:
				"Deployed in the Second Wall skirmishes after being shown to reliably ground airborne Class-C targets.",
			curse: "",
			personality:
				"Stubborn; once cast, the cube resists being suppressed for the full minute even if the caster falls.",
			current_owner:
				"Bureau-certified casters, with a mandatory range-safety addendum.",
			prior_owners: [
				"Artificer-General Min-Ji Hwang",
				"Second Wall Storm Detachment",
			],
		},
		flavor:
			"Lightning asked to sit. Lightning agreed for exactly sixty seconds.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "2d8 thunder damage on hit.",
			secondary:
				"DC 13 Agility save; failure = full damage + Prone; success = half damage.",
		},
		level: 1,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "300 feet",
		duration: "1 minute",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "an Awakened's shed scale",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Sense",
			damage: "2d8",
		},
		saving_throw: {
			ability: "Agility",
			dc: 13,
			success: "Half damage.",
			failure: "Full damage and Prone.",
		},
		atHigherLevels:
			"When cast using a higher-rank slot, the damage increases by 1d8 thunder for each rank above D. At rank A, the cube becomes a 40-foot cube.",
		higher_levels:
			"When cast using a higher-rank slot, the damage increases by 1d8 thunder for each rank above D. At rank A, the cube becomes a 40-foot cube.",
		area: {
			type: "cube",
			size: "20-foot",
			shape: "cube",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "1 minute",
			range: "300 feet",
			type: "Evocation",
			save_dc: 13,
			damage_profile: "2d8 thunder",
			lattice_interaction: "Standard mana circuit",
			attack: {
				type: "thunder",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "2d8",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Agility",
				dc: 13,
				success: "Half damage.",
				failure: "Full damage and Prone.",
			},
			frequency: "1/long rest",
			action: "1 reaction",
			ability: "Sense",
			save: "Agility",
			dc: 13,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Caster notes describe the cube's interior as 'unpleasantly quiet, like the storm is listening back.'",
		theme_tags: ["gate-containment", "ancient-power", "mana-overflow"],
	},
	{
		id: "spell-d-4",
		name: "Surge Storm",
		display_name: "Surge Storm",
		description:
			"Layer a recursive illusion of static and false motion into a 10-foot sphere at the point of impact. Make a melee spell attack using Intelligence for 1d12 lightning damage, and each creature in the sphere must succeed on a DC 12 Strength save or take full damage and be Stunned until the end of its next turn (on a success, pushed 10 feet away instead).",
		lore: {
			origin:
				"Reconstructed from the memory lattice of a captured Void-rank infiltrator.",
			history:
				"Originally flagged as a forbidden technique; reinstated once Bureau cognitive specialists ruled out compulsion side-effects.",
			curse: "",
			personality:
				"Performative; the illusion always includes the caster's own silhouette flickering at the edge.",
			current_owner: "Rank D Bureau casters with a Cognition-track flag.",
			prior_owners: [
				"Void Infiltrator Unit-22 (deceased)",
				"Bureau Cognition Cell Lambda",
			],
		},
		flavor:
			"A snapshot of a thunderstorm, served cold to everyone in arm's reach.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d12 lightning damage on hit.",
			secondary:
				"DC 12 Strength save; failure = full damage + Stunned until end of next turn; success = pushed 10 feet.",
		},
		level: 2,
		school: "Illusion",
		casting_time: "1 minute",
		range: "120 feet",
		duration: "10 minutes",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "crushed mana stone (50gp)",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Intelligence",
			damage: "1d12",
		},
		saving_throw: {
			ability: "Strength",
			dc: 12,
			success: "Pushed 10 feet away.",
			failure: "Full damage and Stunned until end of next turn.",
		},
		atHigherLevels:
			"Each rank above D adds +1d8 lightning. At two ranks above (rank B+), the sphere expands to 20 feet and leaves static-charged terrain for 1 round.",
		higher_levels:
			"Each rank above D adds +1d8 lightning. At two ranks above (rank B+), the sphere expands to 20 feet and leaves static-charged terrain for 1 round.",
		area: {
			type: "sphere",
			size: "10-foot",
			shape: "sphere",
		},
		mechanics: {
			action_type: "1 minute",
			duration: "10 minutes",
			range: "120 feet",
			type: "Illusion",
			save_dc: 12,
			damage_profile: "1d12 lightning",
			lattice_interaction: "Disrupts nearby lattice fields",
			attack: {
				type: "lightning",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "1d12",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Strength",
				dc: 12,
				success: "Pushed 10 feet away.",
				failure: "Full damage and Stunned until end of next turn.",
			},
			frequency: "2/long rest",
			action: "1 minute",
			ability: "Intelligence",
			save: "Strength",
			dc: 12,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"One caster reports she can only cast it successfully when it is already raining; Bureau researchers do not know why.",
		theme_tags: ["monarch-era", "urban-combat", "cognition-track"],
	},
	{
		id: "spell-d-5",
		name: "Sanguine Strike",
		display_name: "Sanguine Strike",
		description:
			"Bleed a thin lattice of the caster's own mana into the air around them. Make a ranged spell attack using Presence within a 10-foot cube centered on the caster for 1d8 necrotic damage, and the target must succeed on a DC 14 Intelligence save or take full damage and be Frightened for 1 minute (half damage, no condition on success).",
		lore: {
			origin:
				"Taught only in Bureau-adjacent Hunter orders that track Awakened bloodline inheritance.",
			history:
				"Documented as early as the First Wall era; the casting gesture has remained unchanged across three decades of practitioners.",
			curse: "",
			personality:
				"Possessive; the residual mana coats the caster's throat with a copper taste for 1 round after.",
			current_owner: "Legacy Awakened lineages under Bureau charter.",
			prior_owners: [
				"First Wall Commander I. Park",
				"Second-generation Awakened J. Han",
			],
		},
		flavor:
			"A claim written in the caster's own mana, briefly visible to anything the Wall has tagged as a threat.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d8 necrotic damage on hit.",
			secondary:
				"DC 14 Intelligence save; failure = full damage + Frightened 1 minute.",
		},
		level: 2,
		school: "Necromancy",
		casting_time: "1 reaction",
		range: "Self",
		duration: "24 hours",
		components: {
			verbal: false,
			somatic: true,
			material: false,
			focus: "",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Presence",
			damage: "1d8",
		},
		saving_throw: {
			ability: "Intelligence",
			dc: 14,
			success: "Half damage, no condition.",
			failure: "Full damage and Frightened for 1 minute.",
		},
		atHigherLevels:
			"Each rank above D adds +1d8 necrotic. At rank A+ the cube extends to 20 feet and the caster heals 1d4 HP per creature failing the save.",
		higher_levels:
			"Each rank above D adds +1d8 necrotic. At rank A+ the cube extends to 20 feet and the caster heals 1d4 HP per creature failing the save.",
		area: {
			type: "cube",
			size: "10-foot",
			shape: "cube",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "24 hours",
			range: "Self",
			type: "Necromancy",
			save_dc: 14,
			damage_profile: "1d8 necrotic",
			lattice_interaction: "Bypasses lattice shielding",
			attack: {
				type: "necrotic",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "1d8",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "Intelligence",
				dc: 14,
				success: "Half damage, no condition.",
				failure: "Full damage and Frightened for 1 minute.",
			},
			frequency: "2/long rest",
			action: "1 reaction",
			ability: "Presence",
			save: "Intelligence",
			dc: 14,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Recovered casting notes describe the gesture as 'a contract with your own blood; do not sign lightly.'",
		theme_tags: ["hunter-bureau", "shadow-domain", "legacy-lineage"],
	},
	{
		id: "spell-d-6",
		name: "Bright Tomb",
		display_name: "Bright Tomb",
		description:
			"Plant a radiant abjuration ward in a 20-foot cube you can see within 30 feet. Make a melee spell attack using Sense for 1d10+3 radiant damage against the first creature to cross the threshold, and the crossing creature must succeed on a DC 12 Presence save or take full damage and fall Prone (half damage on a success). Concentration, lasts until dispelled.",
		lore: {
			origin:
				"Designed by the Bureau's Archive Guard to delay breach runners long enough for reinforcements to arrive.",
			history:
				"Considered standard issue at Hunter Academy as of the third graduating class post-Awakening.",
			curse: "",
			personality:
				"Patient; the ward hums only when something alive approaches it.",
			current_owner: "Archive Guard entry-level training.",
			prior_owners: [
				"Archive Guard Captain H. Ji",
				"Hunter Academy Instructor S. Moon",
			],
		},
		flavor: "A door made of light that only ever opens outward, and only once.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d10+3 radiant damage on hit.",
			secondary: "DC 12 Presence save; failure = full damage + Prone.",
		},
		level: 1,
		school: "Abjuration",
		casting_time: "1 bonus action",
		range: "30 feet",
		duration: "Until dispelled",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "crushed mana stone (50gp)",
		},
		concentration: true,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Sense",
			damage: "1d10+3",
		},
		saving_throw: {
			ability: "Presence",
			dc: 12,
			success: "Half damage.",
			failure: "Full damage and Prone.",
		},
		atHigherLevels:
			"Upcasting adds 2d4 radiant per rank above D and extends the duration by 1 round per rank before first trigger.",
		higher_levels:
			"Upcasting adds 2d4 radiant per rank above D and extends the duration by 1 round per rank before first trigger.",
		area: {
			type: "cube",
			size: "20-foot",
			shape: "cube",
		},
		mechanics: {
			action_type: "1 bonus action",
			duration: "Until dispelled",
			range: "30 feet",
			type: "Abjuration",
			save_dc: 12,
			damage_profile: "1d10+3 radiant",
			lattice_interaction: "Requires stable lattice connection",
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "1d10+3",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Presence",
				dc: 12,
				success: "Half damage.",
				failure: "Full damage and Prone.",
			},
			frequency: "1/long rest",
			action: "1 bonus action",
			ability: "Sense",
			save: "Presence",
			dc: 12,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"The first recorded deployment held a Red Gate entrance for forty seconds; the caster survived, the ward did not.",
		theme_tags: ["archive-guard", "guild-ops", "defensive"],
	},
	{
		id: "spell-d-7",
		name: "Arctic Lance",
		display_name: "Arctic Lance",
		description:
			"Condense lattice-frozen air into a 60-foot line. Make a ranged spell attack using Sense for 2d6+2 cold damage, and each creature in the line must succeed on a DC 14 Intelligence save or take full damage and fall Prone (half damage on a success). Concentration, lasts 1 round.",
		lore: {
			origin:
				"Derived from a Bureau autopsy of a Glacier-Class anomaly recovered in the Urals.",
			history:
				"Restricted to Bureau-licensed ranged specialists until the lineage's first self-taught caster passed Bureau certification.",
			curse: "",
			personality:
				"Clean; the lance leaves no residual frost, only a straight scar of cold air.",
			current_owner: "Rank D Bureau marksman program.",
			prior_owners: ["Bureau Marksman L. Oh", "Ural Expedition Team Three"],
		},
		flavor: "One exhale held, sharpened, and launched without regret.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "2d6+2 cold damage on hit.",
			secondary:
				"DC 14 Intelligence save; failure = full damage + Prone; success = half damage.",
		},
		level: 2,
		school: "Evocation",
		casting_time: "1 action",
		range: "60 feet",
		duration: "1 round",
		components: {
			verbal: false,
			somatic: false,
			material: false,
			focus: "",
		},
		concentration: true,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Sense",
			damage: "2d6+2",
		},
		saving_throw: {
			ability: "Intelligence",
			dc: 14,
			success: "Half damage.",
			failure: "Full damage and Prone.",
		},
		atHigherLevels:
			"Each rank above D adds +1d6 cold. At two ranks above (rank B+), targets that fail the save are also Restrained until the end of their next turn.",
		higher_levels:
			"Each rank above D adds +1d6 cold. At two ranks above (rank B+), targets that fail the save are also Restrained until the end of their next turn.",
		area: {
			type: "line",
			size: "60-foot",
			shape: "line",
		},
		mechanics: {
			action_type: "1 action",
			duration: "1 round",
			range: "60 feet",
			type: "Evocation",
			save_dc: 14,
			damage_profile: "2d6+2 cold",
			lattice_interaction: "Amplified by lattice resonance",
			attack: {
				type: "cold",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "2d6+2",
				damage_type: "cold",
			},
			saving_throw: {
				ability: "Intelligence",
				dc: 14,
				success: "Half damage.",
				failure: "Full damage and Prone.",
			},
			frequency: "2/long rest",
			action: "1 action",
			ability: "Sense",
			save: "Intelligence",
			dc: 14,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Cast along a sixty-foot hallway, the spell leaves a single strip of floor frosted exactly one foot wide.",
		theme_tags: ["bureau-marksman", "experimental", "arctic-theater"],
	},
	{
		id: "spell-d-8",
		name: "Crimson Cleave",
		display_name: "Crimson Cleave",
		description:
			"Draw a 60-foot line of force through the target point. Make a melee spell attack using Intelligence for 3d4 force damage against every creature the line crosses; creatures adjacent to the line on a critical hit take an additional 1d4. No saving throw.",
		lore: {
			origin:
				"A hand-stabilized variant of a Bureau demolition cantrip, refined for close-quarters Gate work.",
			history:
				"Became the default 'first-breach' cast after the Fifth Wall Incident, where three Hunters cleared a 60-foot corridor simultaneously.",
			curse: "",
			personality:
				"Forthright; the line is briefly visible as a red thread before the damage resolves.",
			current_owner: "Bureau demolition and breach specialists.",
			prior_owners: ["Demolition Lead P. Cha", "Fifth Wall First Squad"],
		},
		flavor:
			"A guaranteed line of force, delivered at the speed of a held breath.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "3d4 force damage to all creatures in line.",
			secondary: "On a critical hit, creatures adjacent to the line take +1d4.",
		},
		level: 2,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "Touch",
		duration: "Instantaneous",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "crushed mana stone (50gp)",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Intelligence",
			damage: "3d4",
		},
		saving_throw: {
			ability: "",
			dc: 0,
			success: "",
			failure: "",
		},
		atHigherLevels:
			"Each rank above D adds +1d4 force and extends the line by 20 feet. At rank A+, the line also pushes each struck creature 5 feet away from the caster.",
		higher_levels:
			"Each rank above D adds +1d4 force and extends the line by 20 feet. At rank A+, the line also pushes each struck creature 5 feet away from the caster.",
		area: {
			type: "line",
			size: "60-foot",
			shape: "line",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "Instantaneous",
			range: "Touch",
			type: "Evocation",
			save_dc: 0,
			damage_profile: "3d4 force",
			lattice_interaction: "Bypasses lattice shielding",
			attack: {
				type: "force",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "3d4",
				damage_type: "force",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			frequency: "2/long rest",
			action: "1 reaction",
			ability: "Intelligence",
			save: "",
			dc: 0,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"The cast gesture is identical to a standard Bureau salute, which investigators say is not a coincidence.",
		theme_tags: ["gate-breach", "hunter-bureau", "demolition"],
	},
	{
		id: "spell-d-9",
		name: "Blood Tear",
		display_name: "Blood Tear",
		description:
			"Thread the caster's own lattice through an echo of their next swing. Make a ranged spell attack using Intelligence against a target within 20 feet for 2d6 necrotic damage. No saving throw; the caster takes 1 point of necrotic damage as the cast resolves.",
		lore: {
			origin:
				"Developed by mid-career Hunters whose casting stat outpaces their physical combat training.",
			history:
				"Formally catalogued by the Bureau Divination wing after three independent casters described identical self-damage feedback.",
			curse: "",
			personality:
				"Self-critical; the caster always flinches a fraction of a second before the target reacts.",
			current_owner: "Rank D divination-track casters.",
			prior_owners: ["Divination Scholar B. Noh", "Field Hunter Y. Jeong"],
		},
		flavor:
			"A precise wound, dealt at arm's length by a hand that isn't there.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "2d6 necrotic damage on hit.",
			secondary: "Caster takes 1 necrotic damage on cast resolution.",
		},
		level: 2,
		school: "Divination",
		casting_time: "1 bonus action",
		range: "Self",
		duration: "1 round",
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "",
		},
		concentration: true,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Intelligence",
			damage: "2d6",
		},
		saving_throw: {
			ability: "",
			dc: 0,
			success: "",
			failure: "",
		},
		atHigherLevels:
			"Each rank above D adds +2d6 necrotic. Self-damage scales with rank: 1 at D, 2 at B, 3 at A, 5 at S.",
		higher_levels:
			"Each rank above D adds +2d6 necrotic. Self-damage scales with rank: 1 at D, 2 at B, 3 at A, 5 at S.",
		area: {
			type: "cylinder",
			size: "20-foot",
			shape: "cylinder",
		},
		mechanics: {
			action_type: "1 bonus action",
			duration: "1 round",
			range: "Self",
			type: "Divination",
			save_dc: 0,
			damage_profile: "2d6 necrotic",
			lattice_interaction: "Disrupts nearby lattice fields",
			attack: {
				type: "necrotic",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "2d6",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			frequency: "2/long rest",
			action: "1 bonus action",
			ability: "Intelligence",
			save: "",
			dc: 0,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Bureau field logs show the spell is 100% accurate on the first attempt and noticeably less so on the second in the same day.",
		theme_tags: ["divination-track", "gate-zone", "self-sacrifice"],
	},
	{
		id: "spell-d-10",
		name: "Night Storm",
		display_name: "Night Storm",
		description:
			"Call a hemispherical cap of absorptive lattice around a 30-foot line. Make a melee spell attack using Intelligence for 1d10+3 necrotic damage against each creature in the line; no saving throw, concentration not required. Dim light in the area until dispelled.",
		lore: {
			origin:
				"Purchased from a Void-touched artifact broker who refused to give their name.",
			history:
				"Allowed in Bureau training after the broker's casting notes passed three independent safety reviews.",
			curse: "",
			personality:
				"Territorial; the dim light cannot be dispelled by standard light sources until the caster ends the spell.",
			current_owner: "Bureau-vetted Rank D casters on nocturnal assignments.",
			prior_owners: [
				"An unidentified Void-touched broker",
				"Bureau Safety Review Cell",
			],
		},
		flavor: "A quiet promise kept between the caster and the dark.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d10+3 necrotic damage on hit.",
			secondary: "Area becomes dim light until dispelled.",
		},
		level: 0,
		school: "Necromancy",
		casting_time: "1 reaction",
		range: "30 feet",
		duration: "Until dispelled",
		components: {
			verbal: true,
			somatic: false,
			material: true,
			focus: "a vial of anomaly blood",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Intelligence",
			damage: "1d10+3",
		},
		saving_throw: {
			ability: "",
			dc: 0,
			success: "",
			failure: "",
		},
		atHigherLevels:
			"Each rank above D adds +1d10 necrotic. At rank B+, the line becomes a 30-foot cube.",
		higher_levels:
			"Each rank above D adds +1d10 necrotic. At rank B+, the line becomes a 30-foot cube.",
		area: {
			type: "line",
			size: "30-foot",
			shape: "line",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "Until dispelled",
			range: "30 feet",
			type: "Necromancy",
			save_dc: 0,
			damage_profile: "1d10+3 necrotic",
			lattice_interaction: "Requires stable lattice connection",
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "1d10+3",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			frequency: "1/long rest",
			action: "1 reaction",
			ability: "Intelligence",
			save: "",
			dc: 0,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Notes from the broker's ledger: 'cast it where you already expect the dark; it will accept the invitation.'",
		theme_tags: ["nocturnal-ops", "urban-combat", "void-adjacent"],
	},
	{
		id: "spell-d-11",
		name: "Carnage Strike",
		display_name: "Carnage Strike",
		description:
			"Release a tight spiral of kinetic force in a 10-foot cube around the caster. Make a ranged spell attack using Sense against one target in the cube for 2d6 force damage, and each creature in the cube must succeed on a DC 12 Agility save or take full damage and fall Prone (no effect on a success).",
		lore: {
			origin:
				"A Bureau-approved battlefield iteration of a close-quarters evasion cantrip.",
			history:
				"Standardized by the Fourth Wall after its first successful use cleared a breach of Class-C anomalies in under six seconds.",
			curse: "",
			personality:
				"Assertive; the cast announces itself with a pulse the caster can feel three turns later.",
			current_owner: "Rank D Bureau close-combat specialists.",
			prior_owners: [
				"Fourth Wall First Squad",
				"Close-Combat Instructor A. Baek",
			],
		},
		flavor: "Cleared space, cheaply paid for.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "2d6 force damage on hit.",
			secondary: "DC 12 Agility save; failure = full damage + Prone.",
		},
		level: 0,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "Self",
		duration: "1 minute",
		components: {
			verbal: false,
			somatic: true,
			material: true,
			focus: "ink made from void essence",
		},
		concentration: true,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Sense",
			damage: "2d6",
		},
		saving_throw: {
			ability: "Agility",
			dc: 12,
			success: "No effect.",
			failure: "Full damage and Prone.",
		},
		atHigherLevels:
			"This spell's damage increases by 2d6 at rank B (4d6), rank A (6d6), and rank S (8d6). At rank A+ the cube becomes 20-foot.",
		higher_levels:
			"This spell's damage increases by 2d6 at rank B (4d6), rank A (6d6), and rank S (8d6). At rank A+ the cube becomes 20-foot.",
		area: {
			type: "cube",
			size: "10-foot",
			shape: "cube",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "1 minute",
			range: "Self",
			type: "Evocation",
			save_dc: 12,
			damage_profile: "2d6 force",
			lattice_interaction: "Disrupts nearby lattice fields",
			attack: {
				type: "force",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "2d6",
				damage_type: "force",
			},
			saving_throw: {
				ability: "Agility",
				dc: 12,
				success: "No effect.",
				failure: "Full damage and Prone.",
			},
			frequency: "At will",
			action: "1 reaction",
			ability: "Sense",
			save: "Agility",
			dc: 12,
			scaling: "Scales with character level",
		},
		discovery_lore:
			"Standard field notes: 'if you have time to aim, cast something else.'",
		theme_tags: ["fourth-wall", "close-combat", "guild-ops"],
	},
	{
		id: "spell-d-12",
		name: "Entropy Siphon",
		display_name: "Entropy Siphon",
		description:
			"Open a lattice shunt in a 30-foot cone. Make a melee spell attack using Presence against one target in the cone for 1d12 necrotic damage; no saving throw. The caster regains 1d4 HP on hit.",
		lore: {
			origin:
				"Reconstructed from partial casting notes recovered from a Siberian S-rank Gate sealed for forty days.",
			history:
				"Only released to Bureau casters after a three-month confinement trial confirmed no compulsion side-effects on the caster.",
			curse: "",
			personality:
				"Cold; the caster's breath fogs for 1 round after a successful hit regardless of local temperature.",
			current_owner:
				"Bureau-cleared Rank D casters with a Resonance Monitoring Order.",
			prior_owners: [
				"Siberian Gate Seal Team",
				"Bureau Resonance Monitoring Cell",
			],
		},
		flavor: "A cup held out to the target's future, and then tipped over.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d12 necrotic damage on hit.",
			secondary: "Caster heals 1d4 HP on hit.",
		},
		level: 2,
		school: "Necromancy",
		casting_time: "1 bonus action",
		range: "30 feet",
		duration: "24 hours",
		components: {
			verbal: true,
			somatic: false,
			material: false,
			focus: "",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Presence",
			damage: "1d12",
		},
		saving_throw: {
			ability: "",
			dc: 0,
			success: "",
			failure: "",
		},
		atHigherLevels:
			"Each rank above D adds +2d4 necrotic and +1d4 to the caster's heal. At rank A+, the cone widens to 60 feet.",
		higher_levels:
			"Each rank above D adds +2d4 necrotic and +1d4 to the caster's heal. At rank A+, the cone widens to 60 feet.",
		area: {
			type: "cone",
			size: "30-foot",
			shape: "cone",
		},
		mechanics: {
			action_type: "1 bonus action",
			duration: "24 hours",
			range: "30 feet",
			type: "Necromancy",
			save_dc: 0,
			damage_profile: "1d12 necrotic",
			lattice_interaction: "Bypasses lattice shielding",
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "1d12",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			frequency: "2/long rest",
			action: "1 bonus action",
			ability: "Presence",
			save: "",
			dc: 0,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"The confinement trial's third caster reported 'nothing useful' for thirty-eight days and then produced the spell on day thirty-nine, fully formed.",
		theme_tags: [
			"resonance-monitoring",
			"forbidden-until-cleared",
			"gate-recovery",
		],
	},
	{
		id: "spell-d-13",
		name: "Corona Storm",
		display_name: "Corona Storm",
		description:
			"Hold the cast for one minute, then release a 20-foot sphere of radiant discharge centered on a point within 150 feet. Make a melee spell attack using Intelligence against one target in the sphere for 1d12 radiant damage, and each other creature in the sphere must succeed on a DC 14 Agility save or take full damage and fall Prone (on a success, pushed 10 feet away).",
		lore: {
			origin:
				"Developed by Bureau evocation specialists monitoring the Corona-class anomalies that appear during solar-flare windows.",
			history:
				"Only casting-stable during high solar activity; Bureau manuals mark it with a daily forecast check.",
			curse: "",
			personality:
				"Bright; the cast's after-image lingers for 1 round on reflective surfaces.",
			current_owner: "Rank D Bureau evocation specialists.",
			prior_owners: ["Bureau Corona Cell", "Solar-Flare Response Team"],
		},
		flavor: "One minute of sky pulled down, sixty seconds early.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d12 radiant damage on hit.",
			secondary:
				"DC 14 Agility save for other creatures in sphere; failure = full damage + Prone; success = pushed 10 feet.",
		},
		level: 0,
		school: "Evocation",
		casting_time: "1 minute",
		range: "150 feet",
		duration: "Instantaneous",
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "",
		},
		concentration: true,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Intelligence",
			damage: "1d12",
		},
		saving_throw: {
			ability: "Agility",
			dc: 14,
			success: "Pushed 10 feet away.",
			failure: "Full damage and Prone.",
		},
		atHigherLevels:
			"This spell's damage increases by 1d12 radiant at rank B (2d12), rank A (3d12), and rank S (4d12). At rank A+, the sphere expands to 30 feet.",
		higher_levels:
			"This spell's damage increases by 1d12 radiant at rank B (2d12), rank A (3d12), and rank S (4d12). At rank A+, the sphere expands to 30 feet.",
		area: {
			type: "sphere",
			size: "20-foot",
			shape: "sphere",
		},
		mechanics: {
			action_type: "1 minute",
			duration: "Instantaneous",
			range: "150 feet",
			type: "Evocation",
			save_dc: 14,
			damage_profile: "1d12 radiant",
			lattice_interaction: "Requires stable lattice connection",
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "1d12",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Agility",
				dc: 14,
				success: "Pushed 10 feet away.",
				failure: "Full damage and Prone.",
			},
			frequency: "At will",
			action: "1 minute",
			ability: "Intelligence",
			save: "Agility",
			dc: 14,
			scaling: "Scales with character level",
		},
		discovery_lore:
			"The spell's after-image briefly shows the caster's own silhouette overlaid on every reflective surface inside the sphere.",
		theme_tags: ["corona-cell", "gate-zone", "solar-aligned"],
	},
	{
		id: "spell-d-14",
		name: "Lightning Lance",
		display_name: "Lightning Lance",
		description:
			"Reach out and discharge the caster's stored lattice as a grounded arc. Make a melee spell attack using Sense for 1d8 lightning damage, and the target must succeed on a DC 12 Strength save or take full damage (no effect on a success). Concentration, lasts 10 minutes.",
		lore: {
			origin:
				"A grounded variant of the Shadow Legion's mid-tier lattice discharge, adapted for Bureau safety standards.",
			history:
				"Allowed only after the Bureau confirmed the lance cannot arc to unintended targets through a metal floor.",
			curse:
				"Prolonged daily use causes a faint persistent tingle in the caster's casting hand that fades only with a full week's rest.",
			personality:
				"Deliberate; the cast only completes once the caster has fully grounded themselves with at least one foot flat.",
			current_owner: "Rank D Bureau close-combat specialists.",
			prior_owners: [
				"Shadow Legion Adjutant (unnamed)",
				"Bureau Standards Office",
			],
		},
		flavor: "A controlled grounding, extended just far enough to matter.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "1d8 lightning damage on hit.",
			secondary: "DC 12 Strength save; failure = full damage.",
		},
		level: 0,
		school: "Evocation",
		casting_time: "1 reaction",
		range: "Touch",
		duration: "10 minutes",
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "melee",
			ability: "Sense",
			damage: "1d8",
		},
		saving_throw: {
			ability: "Strength",
			dc: 12,
			success: "No effect.",
			failure: "Full damage.",
		},
		atHigherLevels:
			"Each rank above D adds +2d4 lightning. At rank B+, the lance can arc to one additional adjacent creature.",
		higher_levels:
			"Each rank above D adds +2d4 lightning. At rank B+, the lance can arc to one additional adjacent creature.",
		area: {
			type: "point",
			size: "single target",
			shape: "point",
		},
		mechanics: {
			action_type: "1 reaction",
			duration: "10 minutes",
			range: "Touch",
			type: "Evocation",
			save_dc: 12,
			damage_profile: "1d8 lightning",
			lattice_interaction: "Amplified by lattice resonance",
			attack: {
				type: "lightning",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "1d8",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Strength",
				dc: 12,
				success: "No effect.",
				failure: "Full damage.",
			},
			frequency: "1/long rest",
			action: "1 reaction",
			ability: "Sense",
			save: "Strength",
			dc: 12,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Used by more medics than combatants; the lance is the fastest Bureau-legal way to stop a runaway Shadow-Class puppeteer's thread.",
		theme_tags: ["bureau-medic", "hunter-bureau", "shadow-adjacent"],
	},
	{
		id: "spell-d-15",
		name: "Ice Lance",
		display_name: "Ice Lance",
		description:
			"Compact a 30-foot line of supercooled air. Make a ranged spell attack using Presence for 2d6 cold damage; no saving throw, concentration not required. The line leaves a strip of difficult terrain until the end of the caster's next turn.",
		lore: {
			origin:
				"Derived from Arctic Lance's cast notes and taught as its daily-use companion spell.",
			history:
				"Standardized to rank D because its hand-posture is the first cold-element cast many new Awakened learn.",
			curse:
				"Casters who rely on Ice Lance exclusively for a full day report their shadow moving a half-second late for the next night.",
			personality:
				"Predictable; the lance lands within a six-inch tolerance of the caster's intended point.",
			current_owner: "Rank D Bureau entry-level curriculum.",
			prior_owners: [
				"Hunter Academy Cold-Track Instructor",
				"Arctic Lance lineage casters",
			],
		},
		flavor: "A reliable, boring miracle: it always lands where you pointed.",
		tags: ["awakened", "magic", "D"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "2d6 cold damage on hit.",
			secondary: "Strip of difficult terrain until end of caster's next turn.",
		},
		level: 0,
		school: "Evocation",
		casting_time: "1 minute",
		range: "90 feet",
		duration: "10 minutes",
		components: {
			verbal: true,
			somatic: true,
			material: true,
			focus: "crushed mana stone (50gp)",
		},
		concentration: false,
		ritual: false,
		rank: "D",
		attack: {
			type: "ranged",
			ability: "Presence",
			damage: "2d6",
		},
		saving_throw: {
			ability: "",
			dc: 0,
			success: "",
			failure: "",
		},
		atHigherLevels:
			"Upcasting adds 1d6 cold per additional rank and extends the difficult-terrain strip by 1 round per rank above D.",
		higher_levels:
			"Upcasting adds 1d6 cold per additional rank and extends the difficult-terrain strip by 1 round per rank above D.",
		area: {
			type: "line",
			size: "30-foot",
			shape: "line",
		},
		mechanics: {
			action_type: "1 minute",
			duration: "10 minutes",
			range: "90 feet",
			type: "Evocation",
			save_dc: 0,
			damage_profile: "2d6 cold",
			lattice_interaction: "Requires stable lattice connection",
			attack: {
				type: "cold",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "2d6",
				damage_type: "cold",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			frequency: "1/long rest",
			action: "1 minute",
			ability: "Presence",
			save: "",
			dc: 0,
			scaling: "Scales with spell slot rank",
		},
		discovery_lore:
			"Instructors teach Ice Lance first because its failure mode is boringly safe: misses land harmlessly, at most chipping tile.",
		theme_tags: ["entry-curriculum", "hunter-academy", "cold-track"],
	},
];
