import type { CompendiumRune } from "../../../types/compendium";

// Pilot rewrite: rank-D learning runes. Each rune mirrors its paired spell
// in @/data/compendium/spells/rank-d.ts and drops the templated copy.
// D-tier name collisions with higher ranks have been resolved:
//   - Rune of Tempest shackle → Rune of Tempest Binding
//   - Rune of Crimson strike  → Rune of Crimson Cleave
//   - Rune of Lightning strike → Rune of Lightning Lance
export const spell_rank_d_runes: CompendiumRune[] = [
	{
		id: "rune-spell-d-1",
		name: "Rune of Chill Lance",
		display_name: "Rune of Chill Lance",
		teaches: { kind: "spell", ref: "chill-lance" },
		description:
			"Consuming this rune permanently teaches Chill Lance. The learned spell resolves as a 1d10 cold ranged attack (Sense) or a DC 14 Sense save that ends in Frightened on a failure. Cross-Class Adaptation: If the learned ability is outside your native access (Job or unlocked Regent), uses per long rest = max(1, proficiency bonus + primary stat modifier + rune rarity bonus). Native-access abilities follow their normal recharge.",
		flavor: "A palm-sized shard that feels colder than the room it is in.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Chill Lance (1d10 cold).",
			secondary: "Learned spell: Frightened on failed DC 14 Sense save.",
		},
		effect_description:
			"Teaches Chill Lance: ranged spell attack (Sense) for 1d10 cold, or DC 14 Sense save; failure = full damage + Frightened 1 minute.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d10 cold",
			range: "Self",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Recovered from the shard-field left behind when a Class-B Beast anomaly evaporated during Bureau extraction.",
		image: "/generated/compendium/items/item-0289.webp",
		higher_levels:
			"Cross-class users deepen the ability with downtime (8 hours per improvement tier).",
	},
	{
		id: "rune-spell-d-2",
		name: "Rune of Thunder Shackle",
		display_name: "Rune of Thunder Shackle",
		teaches: { kind: "spell", ref: "thunder-shackle" },
		description:
			"Consuming this rune permanently teaches Thunder Shackle. The learned spell resolves as a 100-foot line; primary target takes 1d10 thunder (Presence ranged attack), each creature in the line saves DC 13 Agility (failure = full damage + Stunned until end of next turn, success = pushed 10 feet).",
		flavor:
			"The rune hums the moment it passes within arm's length of a Gate-crystal shard.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Thunder Shackle (1d10 thunder line).",
			secondary: "Learned spell: DC 13 Agility save for Stunned/push.",
		},
		effect_description:
			"Teaches Thunder Shackle: primary target 1d10 thunder (Presence); line save DC 13 Agility; failure = Stunned; success = pushed 10 feet.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d10 thunder",
			range: "30 feet (100-foot line)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Bureau record locates the first verified rune in the rubble of the Seoul Third Wall collapse.",
		image: "/generated/compendium/items/item-0454.webp",
		higher_levels:
			"Each additional Rune of Thunder Shackle consumed raises the learned spell's rank by one tier.",
	},
	{
		id: "rune-spell-d-3",
		name: "Rune of Tempest Binding",
		display_name: "Rune of Tempest Binding",
		teaches: { kind: "spell", ref: "tempest-binding" },
		description:
			"Consuming this rune permanently teaches Tempest Binding. The learned spell resolves as a 2d8 thunder ranged attack (Sense) and a DC 13 Agility save in a 20-foot cube (failure = full damage + Prone, success = half damage).",
		flavor: "A coin-sized sigil that refuses to lie flat against metal.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Tempest Binding (2d8 thunder).",
			secondary: "Learned spell: DC 13 Agility save; failure = Prone.",
		},
		effect_description:
			"Teaches Tempest Binding: 2d8 thunder (Sense ranged attack), 20-foot cube DC 13 Agility save; failure = Prone.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "2d8 thunder",
			range: "Touch (taught spell reaches 300 feet)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Forged at the Icheon containment site and released to general circulation once Bureau verified no storm-side bleed.",
		image: "/generated/compendium/items/item-0415.webp",
		higher_levels:
			"At higher proficiency tiers, the learned spell gains additional uses per rest.",
	},
	{
		id: "rune-spell-d-4",
		name: "Rune of Surge Storm",
		display_name: "Rune of Surge Storm",
		teaches: { kind: "spell", ref: "surge-storm" },
		description:
			"Consuming this rune permanently teaches Surge Storm. The learned spell resolves as 1d12 lightning (Intelligence melee attack) in a 10-foot sphere with a DC 12 Strength save (failure = full damage + Stunned until end of next turn, success = pushed 10 feet).",
		flavor:
			"A dull copper disc that warms the moment a storm appears on any local forecast.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Surge Storm (1d12 lightning).",
			secondary: "Learned spell: DC 12 Strength save; failure = Stunned.",
		},
		effect_description:
			"Teaches Surge Storm: 1d12 lightning (Intelligence melee), 10-foot sphere DC 12 Strength save; failure = Stunned until end of next turn.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d12 lightning",
			range: "120 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Reverse-engineered from the memory lattice of a captured Void-rank infiltrator; Bureau Cognition Cell Lambda release.",
		image: "/generated/compendium/items/item-0956.webp",
		higher_levels:
			"At higher proficiency tiers, the learned spell gains additional uses per rest.",
	},
	{
		id: "rune-spell-d-5",
		name: "Rune of Sanguine Strike",
		display_name: "Rune of Sanguine Strike",
		teaches: { kind: "spell", ref: "sanguine-strike" },
		description:
			"Consuming this rune permanently teaches Sanguine Strike. The learned spell resolves as 1d8 necrotic (Presence ranged attack) in a 10-foot cube centered on the caster, with a DC 14 Intelligence save (failure = full damage + Frightened 1 minute).",
		flavor:
			"A fingernail-sized wedge that feels briefly warmer than the holder's hand.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Sanguine Strike (1d8 necrotic).",
			secondary:
				"Learned spell: DC 14 Intelligence save; failure = Frightened 1 minute.",
		},
		effect_description:
			"Teaches Sanguine Strike: 1d8 necrotic (Presence ranged), DC 14 Intelligence save; failure = Frightened.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d8 necrotic",
			range: "Self (10-foot cube)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Issued to second-generation Awakened in Bureau-chartered legacy orders.",
		image: "/generated/compendium/items/item-0389.webp",
		higher_levels:
			"Cross-class users deepen the learned ability with downtime (8 hours per improvement tier).",
	},
	{
		id: "rune-spell-d-6",
		name: "Rune of Bright Tomb",
		display_name: "Rune of Bright Tomb",
		teaches: { kind: "spell", ref: "bright-tomb" },
		description:
			"Consuming this rune permanently teaches Bright Tomb. The learned spell places a 20-foot radiant ward that strikes the first entrant for 1d10+3 radiant (Sense melee attack), with a DC 12 Presence save on cross (failure = full damage + Prone).",
		flavor: "A disc the exact weight of an Archive Guard challenge coin.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Bright Tomb (1d10+3 radiant ward).",
			secondary:
				"Learned spell: DC 12 Presence save on cross; failure = Prone.",
		},
		effect_description:
			"Teaches Bright Tomb: 1d10+3 radiant ward ward (Sense melee), DC 12 Presence save on cross; failure = Prone.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d10+3 radiant",
			range: "30 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Standard-issue at Hunter Academy as of the third post-Awakening class; most rune-breaking occurs during training exercises.",
		image: "/generated/compendium/items/item-0818.webp",
		higher_levels:
			"At higher proficiency tiers, the learned spell gains additional uses per rest.",
	},
	{
		id: "rune-spell-d-7",
		name: "Rune of Arctic Lance",
		display_name: "Rune of Arctic Lance",
		teaches: { kind: "spell", ref: "arctic-lance" },
		description:
			"Consuming this rune permanently teaches Arctic Lance. The learned spell resolves as 2d6+2 cold (Sense ranged attack) in a 60-foot line with a DC 14 Intelligence save (failure = full damage + Prone, success = half damage).",
		flavor: "A shard that never fogs, even when held in a warm palm.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Arctic Lance (2d6+2 cold).",
			secondary: "Learned spell: DC 14 Intelligence save; failure = Prone.",
		},
		effect_description:
			"Teaches Arctic Lance: 2d6+2 cold (Sense ranged) in a 60-foot line, DC 14 Intelligence save; failure = Prone.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "2d6+2 cold",
			range: "60 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Derived from Bureau autopsy notes on a Glacier-Class anomaly recovered in the Urals.",
		image: "/generated/compendium/items/item-0395.webp",
		higher_levels:
			"Each additional Rune of Arctic Lance consumed raises the learned spell's rank by one tier.",
	},
	{
		id: "rune-spell-d-8",
		name: "Rune of Crimson Cleave",
		display_name: "Rune of Crimson Cleave",
		teaches: { kind: "spell", ref: "crimson-cleave" },
		description:
			"Consuming this rune permanently teaches Crimson Cleave. The learned spell resolves as a 60-foot line of 3d4 force (Intelligence melee attack), no save; critical hits add 1d4 to creatures adjacent to the line.",
		flavor:
			"A triangular shard that briefly glows red when laid across a clenched fist.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Crimson Cleave (3d4 force line).",
			secondary:
				"Learned spell: critical hits damage adjacent creatures for 1d4.",
		},
		effect_description:
			"Teaches Crimson Cleave: 3d4 force (Intelligence melee) 60-foot line, no save; critical hits splash adjacent creatures.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "3d4 force",
			range: "Touch (60-foot line)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Attached to the standard Bureau demolition kit since the Fifth Wall Incident; typical field shelf-life is one clearing assignment.",
		image: "/generated/compendium/items/item-0856.webp",
		higher_levels:
			"At higher proficiency tiers, the learned spell gains additional uses per rest.",
	},
	{
		id: "rune-spell-d-9",
		name: "Rune of Blood Tear",
		display_name: "Rune of Blood Tear",
		teaches: { kind: "spell", ref: "blood-tear" },
		description:
			"Consuming this rune permanently teaches Blood Tear. The learned spell resolves as 2d6 necrotic (Intelligence ranged attack) with no save; the caster takes 1 necrotic damage each time the learned spell is cast.",
		flavor:
			"A shard that always weighs exactly one gram, regardless of temperature.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Blood Tear (2d6 necrotic).",
			secondary: "Learned spell: caster takes 1 necrotic damage on resolution.",
		},
		effect_description:
			"Teaches Blood Tear: 2d6 necrotic (Intelligence ranged), no save; caster takes 1 self-damage on each cast.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "2d6 necrotic",
			range: "Self (20-foot cylinder)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Released through Bureau divination-track training after three confined caster trials produced compatible casting notes.",
		image: "/generated/compendium/items/item-0177.webp",
		higher_levels:
			"The learned spell scales with character level; at levels 5, 11, and 17 its damage tier improves by +2d6.",
	},
	{
		id: "rune-spell-d-10",
		name: "Rune of Night Storm",
		display_name: "Rune of Night Storm",
		teaches: { kind: "spell", ref: "night-storm" },
		description:
			"Consuming this rune permanently teaches Night Storm. The learned spell resolves as 1d10+3 necrotic (Intelligence melee attack) in a 30-foot line, no save; the area becomes dim light until dispelled.",
		flavor:
			"A matte-black shard that absorbs rather than reflects nearby light.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Night Storm (1d10+3 necrotic line).",
			secondary: "Learned spell: area becomes dim light until dispelled.",
		},
		effect_description:
			"Teaches Night Storm: 1d10+3 necrotic (Intelligence melee) 30-foot line, no save; area becomes dim light until dispelled.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d10+3 necrotic",
			range: "30 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Entered Bureau circulation through an unnamed Void-touched broker; subsequent provenance is considered settled.",
		image: "/generated/compendium/items/item-0513.webp",
		higher_levels:
			"The learned spell scales with character level; at levels 5, 11, and 17 its damage tier improves by +1d10.",
	},
	{
		id: "rune-spell-d-11",
		name: "Rune of Carnage Strike",
		display_name: "Rune of Carnage Strike",
		teaches: { kind: "spell", ref: "carnage-strike" },
		description:
			"Consuming this rune permanently teaches Carnage Strike. The learned spell resolves as 2d6 force (Sense ranged attack) in a 10-foot cube centered on the caster with a DC 12 Agility save (failure = full damage + Prone).",
		flavor: "A shard that tastes faintly of iron even through glass.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Carnage Strike (2d6 force).",
			secondary: "Learned spell: DC 12 Agility save; failure = Prone.",
		},
		effect_description:
			"Teaches Carnage Strike: 2d6 force (Sense ranged) 10-foot cube, DC 12 Agility save; failure = Prone.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "2d6 force",
			range: "Self (10-foot cube)",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Distributed broadly to Bureau close-combat specialists; the Fourth Wall runs monthly calibration drills using unclaimed runes.",
		image: "/generated/compendium/items/item-0872.webp",
		higher_levels:
			"The learned spell's damage scales with the caster's primary casting stat, regardless of the original class requirement.",
	},
	{
		id: "rune-spell-d-12",
		name: "Rune of Entropy Siphon",
		display_name: "Rune of Entropy Siphon",
		teaches: { kind: "spell", ref: "entropy-siphon" },
		description:
			"Consuming this rune permanently teaches Entropy Siphon. The learned spell resolves as 1d12 necrotic (Presence melee attack) in a 30-foot cone with no save; on hit the caster regains 1d4 HP.",
		flavor:
			"A dull shard that is half a degree cooler than any room it enters.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Entropy Siphon (1d12 necrotic).",
			secondary: "Learned spell: caster heals 1d4 HP on hit.",
		},
		effect_description:
			"Teaches Entropy Siphon: 1d12 necrotic (Presence melee), 30-foot cone, no save; caster heals 1d4 HP on hit.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d12 necrotic",
			range: "30 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Released from Bureau hold only after a three-month confinement trial cleared the spell of compulsion side-effects.",
		image: "/generated/compendium/items/item-0591.webp",
		higher_levels:
			"Each additional Rune of Entropy Siphon consumed raises the learned spell's rank by one tier.",
	},
	{
		id: "rune-spell-d-13",
		name: "Rune of Corona Storm",
		display_name: "Rune of Corona Storm",
		teaches: { kind: "spell", ref: "corona-storm" },
		description:
			"Consuming this rune permanently teaches Corona Storm. The learned spell resolves as 1d12 radiant (Intelligence melee attack) in a 20-foot sphere at 150 feet with a DC 14 Agility save (failure = full damage + Prone, success = pushed 10 feet).",
		flavor:
			"A thin disc that brightens noticeably during any local solar-flare window.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Corona Storm (1d12 radiant).",
			secondary: "Learned spell: DC 14 Agility save; failure = Prone.",
		},
		effect_description:
			"Teaches Corona Storm: 1d12 radiant (Intelligence melee) 20-foot sphere at 150 feet, DC 14 Agility save; failure = Prone.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d12 radiant",
			range: "150 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Attached to Bureau solar-flare response kits; unused runes are returned at shift change.",
		image: "/generated/compendium/items/item-0718.webp",
		higher_levels:
			"The learned spell's damage scales with the caster's primary casting stat, regardless of the original class requirement.",
	},
	{
		id: "rune-spell-d-14",
		name: "Rune of Lightning Lance",
		display_name: "Rune of Lightning Lance",
		teaches: { kind: "spell", ref: "lightning-lance" },
		description:
			"Consuming this rune permanently teaches Lightning Lance. The learned spell resolves as 1d8 lightning (Sense melee attack) against one target with a DC 12 Strength save (failure = full damage).",
		flavor:
			"A shard that buzzes against grounded metal and stays silent against wood.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Lightning Lance (1d8 lightning).",
			secondary: "Learned spell: DC 12 Strength save; failure = full damage.",
		},
		effect_description:
			"Teaches Lightning Lance: 1d8 lightning (Sense melee), DC 12 Strength save; failure = full damage.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "1d8 lightning",
			range: "Touch",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"A grounded variant of the Shadow Legion's mid-tier discharge; cleared for Bureau medics and close-combat specialists.",
		image: "/generated/compendium/items/item-0293.webp",
		higher_levels:
			"The learned spell's damage scales with the caster's primary casting stat, regardless of the original class requirement.",
	},
	{
		id: "rune-spell-d-15",
		name: "Rune of Ice Lance",
		display_name: "Rune of Ice Lance",
		teaches: { kind: "spell", ref: "ice-lance" },
		description:
			"Consuming this rune permanently teaches Ice Lance. The learned spell resolves as 2d6 cold (Presence ranged attack) in a 30-foot line with no save; the line becomes difficult terrain until the end of the caster's next turn.",
		flavor: "A predictable shard; nothing about it surprises its holder.",
		tags: [
			"awakened",
			"magic",
			"D",
			"one-time-use",
			"learning-item",
			"general",
		],
		rarity: "rare",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Teaches Ice Lance (2d6 cold line).",
			secondary:
				"Learned spell: line becomes difficult terrain until end of caster's next turn.",
		},
		effect_description:
			"Teaches Ice Lance: 2d6 cold (Presence ranged) 30-foot line, no save; line becomes difficult terrain until end of caster's next turn.",
		rune_type: "Consumable",
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: 5,
		rank: "D",
		mechanics: {
			duration: "Instant",
			damage_profile: "2d6 cold",
			range: "90 feet",
		},
		limitations: {
			uses: "1/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Taught as the companion rune to Arctic Lance in Hunter Academy's cold-track curriculum.",
		image: "/generated/compendium/items/item-0724.webp",
		higher_levels:
			"Upcasting adds 1d6 cold per additional rank and extends the difficult-terrain strip by 1 round per rank above D.",
	},
];
