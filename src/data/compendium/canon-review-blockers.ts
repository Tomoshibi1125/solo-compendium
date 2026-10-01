export interface CanonReviewBlocker {
	id: string;
	dataset: "jobs" | "paths" | "regents";
	entryId: string;
	fieldPath: string;
	message: string;
	dependsOnTask: number;
}

/**
 * Authored claims that cannot be made deterministic without inventing canon.
 * Release audits include these only when running against the full registry;
 * synthetic provider-quality audits remain isolated from project canon debt.
 */
export const canonicalReviewBlockers: readonly CanonReviewBlocker[] = [
	{
		id: "task5:esper-aetheric-dragon:resonance-choice",
		dataset: "paths",
		entryId: "esper--draconic-lineage",
		fieldPath: "features.regent-tier Resonance.choice",
		message:
			"The aetheric dragon type has no canonical option IDs, damage-type binding, selection timing, or replacement rule, so Elemental Affinity and Dragon Breath cannot bind to a deterministic choice.",
		dependsOnTask: 20,
	},
	{
		id: "task5:esper-aetheric-cascade:missing-table",
		dataset: "paths",
		entryId: "esper--aetheric-cascade",
		fieldPath: "features.Cascade Trigger.table",
		message:
			"Cascade Trigger and Selective Cascade reference an Aetheric Cascade table whose entries, targets, durations, and resolution procedure are not authored in the repository.",
		dependsOnTask: 20,
	},
	{
		id: "task5:esper-absolute-spark:affinity-choice-ids",
		dataset: "paths",
		entryId: "esper--absolute-spark",
		fieldPath: "features.Dual Manifestation Access.choice",
		message:
			"Dual Manifestation Access names five legacy Herald spell choices but provides no canonical entry IDs, selected-affinity ledger, replacement rule, or definition of access to the full Herald list.",
		dependsOnTask: 9,
	},
	{
		id: "task5:esper-psionic-breach:imprint-identities",
		dataset: "paths",
		entryId: "esper--aberrant-mind",
		fieldPath: "features.Psionic Imprint Spells.grants",
		message:
			"The five Psionic Imprint names have no source-backed Rift Ascendant identities, and the divination/enchantment swap text lacks eligible canonical IDs, timing, and replacement persistence.",
		dependsOnTask: 9,
	},
	{
		id: "task5:summoner:internal-essence-vocabulary",
		dataset: "paths",
		entryId: "summoner--biome-architect",
		fieldPath: "features.Biome Absorption.resource",
		message:
			"Internal essence and aetheric essence are used by Biome Architect, Apex Shifter, and related Summoner text without defining whether they mean spell slots, Entity Shift uses, a separate pool, or how recovery and spending are calculated.",
		dependsOnTask: 20,
	},
	{
		id: "task5:summoner-biome-architect:biome-ledger",
		dataset: "paths",
		entryId: "summoner--biome-architect",
		fieldPath: "features.Biome Mantras.grants",
		message:
			"Biome Mantras names eight biome choices but supplies no per-biome manifestation table, canonical grant IDs, selection persistence, or biome replacement rule.",
		dependsOnTask: 9,
	},
	{
		id: "task5:paths:missing-save-dc-duration-values",
		dataset: "paths",
		entryId: "esper--draconic-lineage",
		fieldPath: "features|abilities.saveAndDuration",
		message:
			"Multiple Task 5 features and path abilities name an ability save but omit its DC basis; others omit affected-target rules, repeat saves, condition duration, or exact end timing, so those effects remain manual.",
		dependsOnTask: 20,
	},
	{
		id: "task5:idol-lore:choice-ledgers",
		dataset: "paths",
		entryId: "idol--lore-resonance",
		fieldPath: "features.Mandated Proficiencies|Arcane Secrets.choices",
		message:
			"Mandated Proficiencies and Arcane Secrets do not identify selectable canonical IDs, proficiency tier, acquisition timing, replacement rules, or persisted choice receipts.",
		dependsOnTask: 16,
	},
	{
		id: "task5:idol-dance:discipline-choice",
		dataset: "paths",
		entryId: "idol--dance-resonance",
		fieldPath: "features.Combat Choreography.choice",
		message:
			"Combat Choreography lists four discipline packages but provides no stable option IDs, selection timing, replacement rule, or persisted binding for later features.",
		dependsOnTask: 20,
	},
	{
		id: "task6:revenant:rejected-inferred-grant-identities",
		dataset: "paths",
		entryId: "revenant--void-lord",
		fieldPath: "generatedAbilityGrantCandidates",
		message:
			"Nine generated Revenant path-grant candidates name catalog entries that the authoritative path text never grants; they remain rejected unless Task 9 establishes source-backed identities.",
		dependsOnTask: 9,
	},
	{
		id: "task6:stalker:rejected-inferred-grant-identities",
		dataset: "paths",
		entryId: "stalker--umbral-hunter",
		fieldPath: "generatedAbilityGrantCandidates",
		message:
			"Four generated Stalker path-grant candidates, including the incompatible supplemental Shadow Strike, are not grants in the authoritative paths and require Task 9 identity review.",
		dependsOnTask: 9,
	},
	{
		id: "task6:technomancer:rejected-inferred-grant-identities",
		dataset: "paths",
		entryId: "technomancer--aether-chemist-design",
		fieldPath: "generatedAbilityGrantCandidates",
		message:
			"Three generated Technomancer path-grant candidates infer spell access without source text that names canonical entries; they remain rejected pending Task 9.",
		dependsOnTask: 9,
	},
	{
		id: "task6:revenant-grave-shepherd:thrall-lifecycle",
		dataset: "paths",
		entryId: "revenant--entropy-blade",
		fieldPath: "features.Command the Risen.controlledEntity",
		message:
			"The elite thrall has a hit-point formula and command fragments but no complete stat block, attack profile, duration, corpse eligibility ledger, dismissal/death behavior, or persistence policy.",
		dependsOnTask: 13,
	},
	{
		id: "task6:stalker-pack-leader:companion-lifecycle",
		dataset: "paths",
		entryId: "stalker--pack-leader",
		fieldPath: "features.Absolute Companion.controlledEntity",
		message:
			"Land, Sea, and Sky companions have no canonical option IDs, stat blocks, replacement rules, command action economy, death recovery, or persisted bond lifecycle.",
		dependsOnTask: 13,
	},
	{
		id: "task6:stalker-apex-ascendant:choice-ledger",
		dataset: "paths",
		entryId: "stalker--apex-hunter",
		fieldPath: "features.choiceLedger",
		message:
			"Ascendant's Resonance, Evasive Resilience, Absolute Multi-strike, and Apex Defense name choices but provide no stable option IDs, selection timing, replacement rules, or persisted choice receipts.",
		dependsOnTask: 20,
	},
	{
		id: "task6:technomancer-aether-chemist:infusion-identities",
		dataset: "paths",
		entryId: "technomancer--aether-chemist-design",
		fieldPath: "features.Aetheric Infusion.options",
		message:
			"The six Aetheric Infusion choices and always-available mandates have no canonical item or ability IDs, recipes, durations, target rules, or persisted prepared-choice ledger.",
		dependsOnTask: 11,
	},
	{
		id: "task6:technomancer-resonance-siege:resonator-lifecycle",
		dataset: "paths",
		entryId: "technomancer--resonance-siege-design",
		fieldPath: "features.Aetheric Resonator.controlledEntity",
		message:
			"Incinerator, Ballista, and Bulwark resonators lack stat blocks, placement range, duration, activation and destruction rules, output formulas, and persisted simultaneous-resonator state.",
		dependsOnTask: 13,
	},
	{
		id: "task6:technomancer-synchronist:defender-lifecycle",
		dataset: "paths",
		entryId: "technomancer--synchronist-binary-design",
		fieldPath: "features.Absolute Defender.controlledEntity",
		message:
			"The Absolute Defender has no stat block, command economy, manifestation cost or duration, repair and death rules, or persisted synchronization state.",
		dependsOnTask: 13,
	},
	{
		id: "task6:technomancer-swarm:conduit-lifecycle",
		dataset: "paths",
		entryId: "technomancer--swarm-conduit-design",
		fieldPath: "features.Absolute Swarm.controlledEntity",
		message:
			"Micro-conduits and multiple swarms have no count, stat block, range, command economy, destruction/replacement rules, or persisted surveillance and physical-interaction state.",
		dependsOnTask: 13,
	},
	{
		id: "task6:paths:missing-save-dc-duration-target-values",
		dataset: "paths",
		entryId: "revenant--void-lord",
		fieldPath: "features|abilities.saveDurationTargets",
		message:
			"Multiple Task 6 features and signatures omit save DC bases, target eligibility, repeat-save timing, exact durations, areas, or damage formulas, so their effects remain manual.",
		dependsOnTask: 20,
	},
	// Task 7: every progression name is retained at its authored table level.
	// These records identify rows whose mechanic text, cadence, identity, or
	// lifecycle cannot be normalized without choosing between conflicting source
	// fields or inventing missing canon.
	{
		id: "task7:umbral_regent:progression-mechanics",
		dataset: "regents",
		entryId: "umbral_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Umbral Dominion has passive and active identities at different levels, Absolute Umbral is duplicated at levels 10 and 20, and Legion/Army command, stat blocks, dismissal, death, and persistence are not authored as a complete controlled-entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:radiant_regent:progression-mechanics",
		dataset: "regents",
		entryId: "radiant_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Purifying Presence and Flame Emperor have no exact mechanic rows; Flame Dominion, Purification Flame, and Phoenix Rebirth disagree with flat power levels or omit a complete death/rebirth lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:steel_regent:progression-mechanics",
		dataset: "regents",
		entryId: "steel_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Organic/Flesh versus Steel/Invulnerability vocabulary is unresolved, several progression names have no mechanic rows, Conceptual Invulnerability has no safe toggle/end-state model, and permanent construct control has no controlled-entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:destruction_regent:progression-mechanics",
		dataset: "regents",
		entryId: "destruction_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Decimation Field has no mechanic row; Breath of Annihilation and Destruction Dominion conflict with their flat power levels; Dragon terminology is not approved as an alias or identity merge.",
		dependsOnTask: 20,
	},
	{
		id: "task7:war_regent:progression-mechanics",
		dataset: "regents",
		entryId: "war_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Leadership Presence has no mechanic row; Vanguard Step versus Tactical Step and Absolute War versus Absolute Command are unresolved identities; armies, surrender, commands, and extra attacks lack a complete action-economy and controlled-entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:frost_regent:progression-mechanics",
		dataset: "regents",
		entryId: "frost_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Absolute Zero Touch is level 2 in class_features but level 3 in progression_table, and Glacial Eternity's 'prof/long rest' abbreviation does not author an unambiguous structured use formula.",
		dependsOnTask: 20,
	},
	{
		id: "task7:beast_regent:progression-mechanics",
		dataset: "regents",
		entryId: "beast_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Apex Form's 'prof/long rest' abbreviation lacks an unambiguous use formula, Beast King's Call conflicts between once-per-day metadata and once-per-week prose, and commanded beasts have no complete entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:plague_regent:progression-mechanics",
		dataset: "regents",
		entryId: "plague_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Pandemic Decree conflicts between once-per-day metadata and once-per-month prose; generic and high-tier names lack complete mechanics; diseases and split swarms have no shared duration, cure, command, or persistence lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:spatial_regent:progression-mechanics",
		dataset: "regents",
		entryId: "spatial_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Reality Rewrite conflicts between long-rest metadata and weekly prose; Spatial Anchors, demiplanes, unwilling teleportation, permanent topology, and the unapproved Architect identity lack complete lifecycle and save rules.",
		dependsOnTask: 20,
	},
	{
		id: "task7:mimic_regent:progression-mechanics",
		dataset: "regents",
		entryId: "mimic_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Flat source rows extend to power level 20 while requirements use power level 10; copied identities, storage limits, nested resources, use persistence, and replacement are undefined, and neither spellcasting nor a Transfiguration alias is authored.",
		dependsOnTask: 20,
	},
	{
		id: "task7:blood_regent:progression-mechanics",
		dataset: "regents",
		entryId: "blood_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Sanguine Rebirth states a cadence only in prose and omits its death-state lifecycle, while Blood Apocalypse conflicts between long-rest metadata and once-per-week prose.",
		dependsOnTask: 20,
	},
	{
		id: "task7:gravity_regent:progression-mechanics",
		dataset: "regents",
		entryId: "gravity_regent",
		fieldPath: "class_features|progression_table",
		message:
			"The source declares spellcasting but not power or technique ledgers; persistent gravity fields, micro-singularities, black holes, targets, saves, destruction, and cleanup lack a common effect lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:regents:ability-option-identities",
		dataset: "regents",
		entryId: "*",
		fieldPath: "spellcasting.additional_spells|powersKnown|techniquesKnown",
		message:
			"All forty named additional spells currently resolve to no canonical spell entry, and martial Regents name no selectable power or technique IDs; prior school and Job-list grants were thematic inference and remain quarantined pending Task 9.",
		dependsOnTask: 9,
	},
];
