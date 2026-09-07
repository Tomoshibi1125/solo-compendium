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
		id: "task3:mage-phantasmist:minor-illusion",
		dataset: "paths",
		entryId: "mage--phantasmist",
		fieldPath: "features.Refined Projection.grant",
		message:
			"Refined Projection grants Minor Illusion, but no Rift Ascendant spell or cantrip with that identity exists; the derived Mana Lens grant has different mechanics and was rejected.",
		dependsOnTask: 9,
	},
	{
		id: "task3:destroyer-spell-breaker:known-counts",
		dataset: "paths",
		entryId: "destroyer--spell-breaker",
		fieldPath: "features.Weave-Combat Attunement.choices",
		message:
			"Weave-Combat Attunement requires exactly two Mage cantrips and three qualifying spells, but the source has no structured acquisition ledger for those choices.",
		dependsOnTask: 16,
	},
	{
		id: "task3:destroyer-apex:secondary-discipline",
		dataset: "paths",
		entryId: "destroyer--apex-predator",
		fieldPath: "features.Secondary Discipline.options",
		message:
			"Secondary Discipline requires a second Combat Discipline, but the source does not identify the selectable canonical option IDs.",
		dependsOnTask: 20,
	},
	{
		id: "task3:destroyer-tactician:maneuvers",
		dataset: "paths",
		entryId: "destroyer--tactician",
		fieldPath: "features.Tactical Charge.maneuvers",
		message:
			"Tactical Charge grants and scales maneuvers, but no canonical maneuver option list or selected-maneuver schema is authored.",
		dependsOnTask: 20,
	},
	{
		id: "task3:mage-matter-weaver:core-options",
		dataset: "paths",
		entryId: "mage--matter-weaver",
		fieldPath: "features.Aetheric Core.effects",
		message:
			"Aetheric Core promises unspecified buffs and Master Weaver's Rite omits costs and limits, so neither can be automated safely.",
		dependsOnTask: 20,
	},
	{
		id: "task3:contractor-infernal:missing-values",
		dataset: "paths",
		entryId: "contractor--infernal-conduit",
		fieldPath: "features.Aetheric Siphon.tempHp",
		message:
			"Aetheric Siphon does not define temporary HP, while Hurl Through the Void omits save and banishment duration mechanics.",
		dependsOnTask: 20,
	},
	{
		id: "task3:contractor-void:void-scream-save",
		dataset: "paths",
		entryId: "contractor--void-whisperer",
		fieldPath: "abilities.Void Scream.save",
		message:
			"Void Scream defines damage and stun but no saving throw, DC basis, or stun duration; Absolute Thrall also lacks a save and target limit.",
		dependsOnTask: 20,
	},
	{
		id: "task3:contractor-radiant:unnamed-mantras",
		dataset: "paths",
		entryId: "contractor--radiant-vessel",
		fieldPath: "features.Absolute Light.grants",
		message:
			"Absolute Light grants two unnamed radiant mantras and Aetheric Radiance omits its healing amount and spend rule.",
		dependsOnTask: 9,
	},
	{
		id: "task3:contractor-cursed-blade:curse-values",
		dataset: "paths",
		entryId: "contractor--cursed-blade",
		fieldPath: "features.Absolute Curse.effects",
		message:
			"Absolute Curse omits its damage and critical-range values, and Aetheric Remnant has no stat block or duration.",
		dependsOnTask: 20,
	},
	{
		id: "task3:contractor-deep-dweller:tentacle-mechanics",
		dataset: "paths",
		entryId: "contractor--deep-dweller",
		fieldPath: "features.Tentacle of the Absolute.mechanics",
		message:
			"Tentacle and restraint features omit required range, damage, save, duration, and damage-reduction values.",
		dependsOnTask: 20,
	},
	{
		id: "task3:holy-knight-dominance:absolute-values",
		dataset: "paths",
		entryId: "holy-knight--dominance-mandate",
		fieldPath: "features.Absolute Archon.effects",
		message:
			"Dominance features use undefined absolute bonuses, mental backlash, reflection, and triple-output values.",
		dependsOnTask: 20,
	},
	{
		id: "task3:holy-knight-atonement:sharing-formula",
		dataset: "paths",
		entryId: "holy-knight--atonement-mandate",
		fieldPath: "abilities.Harmonic Shield.damageSharing",
		message:
			"Harmonic Shield and related Atonement features omit range, damage-sharing formula, and reflected-damage values.",
		dependsOnTask: 20,
	},
	{
		id: "task3:holy-knight-exaltation:undefined-effects",
		dataset: "paths",
		entryId: "holy-knight--exaltation-mandate",
		fieldPath: "features",
		message:
			"Exaltation features do not quantify physical advantage, healing, speed, reflected damage, or Heroic Manifestation's area/save/damage.",
		dependsOnTask: 20,
	},
	// Historical-save convergence is resolved by the dedicated progression and
	// versioned reconciliation tasks; keeping these explicit prevents Task 3's
	// canon corrections from silently guessing prior player choices.
	{
		id: "task3:destroyer:retroactive-asi-entitlements",
		dataset: "jobs",
		entryId: "destroyer",
		fieldPath: "classFeatures.Ability Score Improvement.existingCharacters",
		message:
			"Existing Destroyers above levels 6 or 14 need explicit, player-selected catch-up receipts; prior ASI choices cannot be inferred safely from current scores.",
		dependsOnTask: 18,
	},
	{
		id: "task3:mage:ambiguous-legacy-asi-markers",
		dataset: "jobs",
		entryId: "mage",
		fieldPath: "abilityScoreImprovements.existingCharacters",
		message:
			"Exact legacy INT +2/PRE +1 markers migrate deterministically, but missing, edited, capped, or otherwise ambiguous historical markers require versioned previewable reconciliation.",
		dependsOnTask: 19,
	},
	// Task 4: Berserker canon gaps.
	{
		id: "task4:berserker:overload-pre20-semantics",
		dataset: "jobs",
		entryId: "berserker",
		fieldPath: "classFeatures.Overload State.description",
		message:
			"Overload has no pre-20 use progression or pre-15 duration, and its temporary level-based HP does not define current/max-HP changes or end-state damage handling.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker:overload-level20-unlimited",
		dataset: "jobs",
		entryId: "berserker",
		fieldPath: "classFeatures.Overload State.uses.formula",
		message:
			"The level-20 unlimited-use promise remains structured as 2/long rest, with no level-aware unlimited representation.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-escalating-resonance:feedback-loop-alias",
		dataset: "paths",
		entryId: "berserker--escalating-resonance",
		fieldPath: "aliases",
		message:
			"Legacy data names Path of the Feedback Loop, but canon does not decide whether it aliases Escalating Resonance or represents a distinct obsolete path.",
		dependsOnTask: 19,
	},
	{
		id: "task4:berserker-gate-beast:persistent-aspect",
		dataset: "paths",
		entryId: "berserker--gate-beast",
		fieldPath: "features.Primal Aspect.description",
		message:
			"Primal Aspect lists three aspects without defining selection timing, persistence, replacement, or whether later aspect benefits bind to the same choice.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-gate-beast:primal-bonded-binding",
		dataset: "paths",
		entryId: "berserker--gate-beast",
		fieldPath: "features.Primal Aspect.name",
		message:
			"Static canon names Primal Aspect while legacy persisted choices target Bonded Aspect; their identity and binding are not authored.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-rift-storm:vent-scaling-save",
		dataset: "paths",
		entryId: "berserker--rift-storm",
		fieldPath: "features.Aetheric Vent.description",
		message:
			"Inferno damage and Glacial temporary HP say only that they scale, while Tempest has no save DC or explicit repeat cadence.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-rift-storm:volatile-discharge-saves",
		dataset: "paths",
		entryId: "berserker--rift-storm",
		fieldPath: "features.Volatile Discharge.description",
		message:
			"Tempest and Glacial omit save DCs, Glacial omits the speed-zero duration, and Inferno does not define half-level rounding.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-rift-storm:detonation-save",
		dataset: "paths",
		entryId: "berserker--rift-storm",
		fieldPath: "abilities.Storm Detonation.description",
		message:
			"Storm Detonation specifies AGI half but no save DC or rule for which creatures in the radius are affected.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-aetheric-anomaly:surge-chart",
		dataset: "paths",
		entryId: "berserker--aetheric-anomaly",
		fieldPath: "features.Anomaly Surge.description",
		message:
			"No Anomaly Surge chart, roll procedure, complete effects, durations, targeting, or replacement rules are authored.",
		dependsOnTask: 20,
	},
	{
		id: "task4:berserker-aetheric-anomaly:controlled-distortion",
		dataset: "paths",
		entryId: "berserker--aetheric-anomaly",
		fieldPath: "features.Controlled Distortion.description",
		message:
			"Identify variables, anchor, and harmonic match have no roll, timing, cadence, success rule, or defined interaction with the missing chart.",
		dependsOnTask: 20,
	},
	// Task 4: Assassin canon gaps and legacy convergence.
	{
		id: "task4:assassin:vulnerability-analysis-core",
		dataset: "jobs",
		entryId: "assassin",
		fieldPath: "classFeatures.Vulnerability Analysis.description",
		message:
			"Vulnerability Analysis omits its activation trigger, advantage predicate, per-turn frequency, target limits, observation procedure, and critical-hit behavior.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-weave-infiltrator:vulnerability-analysis",
		dataset: "paths",
		entryId: "assassin--weave-infiltrator",
		fieldPath: "abilities.Shadow Casting.description",
		message:
			"Shadow Casting applies Vulnerability Analysis to a damaging cantrip without defining which weapon, trigger, or frequency restrictions it replaces.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-shadow-herald:vulnerability-analysis",
		dataset: "paths",
		entryId: "assassin--shadow-herald",
		fieldPath: "abilities.Coordinated Exploit.description",
		message:
			"Coordinated Exploit transfers Vulnerability Analysis damage without defining who consumes its use or which eligibility and frequency rules survive.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-blade-dancer:vulnerability-analysis",
		dataset: "paths",
		entryId: "assassin--blade-dancer",
		fieldPath: "features.Mandated Audacity.description",
		message:
			"Mandated Audacity and Aetheric Riposte imply unauthored advantage, weapon, reaction, and frequency exceptions to Vulnerability Analysis.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-vanguard-outrider:vulnerability-analysis",
		dataset: "paths",
		entryId: "assassin--vanguard-outrider",
		fieldPath: "features.Recursive Phase Strike.description",
		message:
			"Recursive Phase Strike implies a once-per-turn base rule but does not define the number or eligibility of additional Vulnerability Analysis applications.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-gate-runner:phase-grab",
		dataset: "paths",
		entryId: "assassin--gate-runner",
		fieldPath: "abilities.Phase Grab.description",
		message:
			"Phase Grab supplies neither a use cadence nor an AGI save DC; its removed numeric recharge code cannot determine either rule.",
		dependsOnTask: 20,
	},
	{
		id: "task4:assassin-weave-infiltrator:harmonic-hand-identity",
		dataset: "paths",
		entryId: "assassin--weave-infiltrator",
		fieldPath: "features.Weave Intrusion.description",
		message:
			"The mandatory Harmonic Hand grant has no canonical spell identity to bind to the third-caster package.",
		dependsOnTask: 9,
	},
	{
		id: "task4:assassin-weave-infiltrator:third-caster-package",
		dataset: "paths",
		entryId: "assassin--weave-infiltrator",
		fieldPath: "features.Weave Intrusion.description",
		message:
			"The two cantrips, three restricted spells, replacement rules, known/prepared status, and level-by-level third-caster slots lack a complete structured ledger.",
		dependsOnTask: 16,
	},
	{
		id: "task4:assassin-gate-runner:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--gate-runner",
		fieldPath: "aliases",
		message:
			"The shadow-thief alias resolves statically, but persisted obsolete path, feature, choice, and character rows have no migration policy.",
		dependsOnTask: 19,
	},
	{
		id: "task4:assassin-terminus:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--terminus",
		fieldPath: "aliases",
		message:
			"Silent Knife and Terminus-Scythe aliases resolve statically, but persisted obsolete rows have no merge, remap, or removal policy.",
		dependsOnTask: 19,
	},
	{
		id: "task4:assassin-weave-infiltrator:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--weave-infiltrator",
		fieldPath: "aliases",
		message:
			"Spell Thief and Lattice-Breaker aliases resolve statically, but persisted obsolete rows have no merge, remap, or removal policy.",
		dependsOnTask: 19,
	},
	{
		id: "task4:assassin-shadow-herald:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--shadow-herald",
		fieldPath: "aliases",
		message:
			"Shadow Broker and Telemetry-Architect aliases resolve statically, but persisted obsolete rows have no merge, remap, or removal policy.",
		dependsOnTask: 19,
	},
	{
		id: "task4:assassin-blade-dancer:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--blade-dancer",
		fieldPath: "aliases",
		message:
			"Duellist and Resonance-Dancer aliases resolve statically, but persisted obsolete rows have no merge, remap, or removal policy.",
		dependsOnTask: 19,
	},
	{
		id: "task4:assassin-vanguard-outrider:legacy-row-migration",
		dataset: "paths",
		entryId: "assassin--vanguard-outrider",
		fieldPath: "aliases",
		message:
			"Outrider and Threshold-Surveyor aliases resolve statically, but persisted obsolete rows have no merge, remap, or removal policy.",
		dependsOnTask: 19,
	},
	// Task 4: Striker canon gaps.
	{
		id: "task4:striker-kinetic-core:rapid-barrage-vocabulary",
		dataset: "paths",
		entryId: "striker--kinetic-core",
		fieldPath: "features.Kinetic Technique.description",
		message:
			"Aetheric Pulse and Rapid Barrage have no Striker feature identity, so the triggering routine and meaning of each strike are undefined.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-entropic-flow:rapid-barrage-vocabulary",
		dataset: "paths",
		entryId: "striker--entropic-flow",
		fieldPath: "features.Erratic Resonance.description",
		message:
			"Erratic Resonance and Cascade Assault modify undefined Aetheric Pulse/Rapid Barrage and spirit terminology, including an unexplained five-attack total.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-aetheric-channeler:spirit-resource",
		dataset: "paths",
		entryId: "striker--aetheric-channeler",
		fieldPath: "features.Elemental Conversion.description",
		message:
			"Spirit per discipline is not defined as Impulse points or as a separate pool, so discipline caps and costs cannot be represented.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-blade-conductor:spirit-vocabulary",
		dataset: "paths",
		entryId: "striker--blade-conductor",
		fieldPath: "features.Aetheric Weapon Bond.description",
		message:
			"Spirit point and Spirit Combat die are undefined and cannot be assumed to mean Impulse points and the Impulse Combat unarmed die.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-harmonic-surgeon:combat-vocabulary",
		dataset: "paths",
		entryId: "striker--harmonic-surgeon",
		fieldPath: "features.Restorative Touch.description",
		message:
			"Rapid Barrage, spirit points, and Spirit Combat die are undefined, leaving replacement count, costs, healing, and damage indeterminate.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-kinetic-core:essence-lockdown-active",
		dataset: "paths",
		entryId: "striker--kinetic-core",
		fieldPath: "abilities.Essence Lockdown.actionType",
		message:
			"Essence Lockdown has no authored activation action, VIT save DC, or explicit unlock rule beyond inherited path metadata.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-phantom-step:phantom-barrage-active",
		dataset: "paths",
		entryId: "striker--phantom-step",
		fieldPath: "abilities.Phantom Barrage.actionType",
		message:
			"Phantom Barrage has no authored activation action or explicit unlock rule beyond inherited path metadata.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-aetheric-channeler:omni-burst-active",
		dataset: "paths",
		entryId: "striker--aetheric-channeler",
		fieldPath: "abilities.Omni-Burst.actionType",
		message:
			"Omni-Burst has no authored activation action, attack/save resolution, success result, or explicit unlock rule beyond inherited path metadata.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-blade-conductor:blade-tempest-active",
		dataset: "paths",
		entryId: "striker--blade-conductor",
		fieldPath: "abilities.Blade Tempest.actionType",
		message:
			"Blade Tempest has no authored activation action or explicit unlock rule beyond inherited path metadata.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-harmonic-surgeon:aetheric-heal-active",
		dataset: "paths",
		entryId: "striker--harmonic-surgeon",
		fieldPath: "abilities.Aetheric Heal.actionType",
		message:
			"Aetheric Heal has no authored activation action or explicit unlock rule beyond inherited path metadata.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker-phantom-step:spell-identity-choice",
		dataset: "paths",
		entryId: "striker--phantom-step",
		fieldPath: "features.Shadow Resonance.description",
		message:
			"Named shadow spells lack canonical identities, while static grant-all wording conflicts with the legacy persisted choose-two Shadow Impulse group.",
		dependsOnTask: 9,
	},
	{
		id: "task4:striker:kinetic-deflection-return",
		dataset: "jobs",
		entryId: "striker",
		fieldPath: "classFeatures.Kinetic Deflection.description",
		message:
			"The job-trait return is free while the level-3 return costs 1 Impulse, and neither version fully defines the return attack and damage.",
		dependsOnTask: 20,
	},
	{
		id: "task4:striker:kinetic-deflection-layers",
		dataset: "jobs",
		entryId: "striker",
		fieldPath: "jobTraits.Kinetic Deflection.name",
		message:
			"Kinetic Deflection exists as both an always-present job trait and a level-3 class feature with divergent mechanics; canon does not choose one layer or define coexistence.",
		dependsOnTask: 20,
	},
	// Task 4: shared path-data contracts. These records use a canonical path as
	// the audit anchor, but the decisions apply to every path in the Task 4 batch.
	{
		id: "task4:paths:skill-prerequisite-semantics",
		dataset: "paths",
		entryId: "berserker--escalating-resonance",
		fieldPath: "requirements.skills",
		message:
			"Task 4 paths do not define whether listed skills are required or recommended, all-or-any matching, proficiency level, check timing, or skill-loss handling.",
		dependsOnTask: 16,
	},
	{
		id: "task4:paths:bonus-stats-semantics",
		dataset: "paths",
		entryId: "berserker--escalating-resonance",
		fieldPath: "stats.bonusStats",
		message:
			"Task 4 paths do not define whether bonusStats are grants or recommendations, their timing, stacking and caps, or legacy-stat-to-canonical-ability mapping.",
		dependsOnTask: 16,
	},
	// Task 5: shared path contracts and unresolved source vocabulary.
	{
		id: "task5:paths:skill-prerequisite-semantics",
		dataset: "paths",
		entryId: "esper--draconic-lineage",
		fieldPath: "requirements.skills",
		message:
			"Task 5 path selection enforces every authored skill, but canon does not define later proficiency-loss handling, recheck timing, or whether temporary proficiency can satisfy a path requirement.",
		dependsOnTask: 16,
	},
	{
		id: "task5:paths:bonus-stats-semantics",
		dataset: "paths",
		entryId: "esper--draconic-lineage",
		fieldPath: "stats.bonusStats",
		message:
			"Task 5 paths do not define whether bonusStats are grants or recommendations, their timing, stacking and caps, or legacy-stat-to-canonical-ability mapping.",
		dependsOnTask: 16,
	},
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
	// Task 6: shared path contracts and rejected generated ability identities.
	{
		id: "task6:paths:skill-prerequisite-semantics",
		dataset: "paths",
		entryId: "revenant--void-lord",
		fieldPath: "requirements.skills",
		message:
			"Task 6 path selection enforces every authored skill, but canon does not define later proficiency-loss handling, recheck timing, or whether temporary proficiency can satisfy a path requirement.",
		dependsOnTask: 16,
	},
	{
		id: "task6:paths:bonus-stats-semantics",
		dataset: "paths",
		entryId: "revenant--void-lord",
		fieldPath: "stats.bonusStats",
		message:
			"Task 6 paths do not define whether bonusStats are grants or recommendations, their timing, stacking and caps, or legacy-stat-to-canonical-ability mapping.",
		dependsOnTask: 16,
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
	// Task 6: job resources and unresolved controlled-entity lifecycles.
	{
		id: "task6:stalker:prey-lock-pre20-uses",
		dataset: "jobs",
		entryId: "stalker",
		fieldPath: "classFeatures.Prey Lock.uses",
		message:
			"Zenith Apex Predator removes Prey Lock's rest limitation at level 20, but no pre-20 use count, recharge cadence, or level transition is authored, so Prey Lock remains manually tracked.",
		dependsOnTask: 20,
	},
	{
		id: "task6:revenant:remnant-initial-refill-semantics",
		dataset: "jobs",
		entryId: "revenant",
		fieldPath: "classFeatures.Remnant Harvest.resourceLifecycle",
		message:
			"Remnant Harvest authors generation and maximum capacity but not initial character-state quantity, non-combat initialization, or any rest refill; rests therefore do not refill Remnants and initial full seeding needs a lifecycle decision.",
		dependsOnTask: 20,
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
	{
		id: "task6:technomancer:spell-capacitor-device-lifecycle",
		dataset: "jobs",
		entryId: "technomancer",
		fieldPath: "classFeatures.Spell Capacitor.deviceLifecycle",
		message:
			"Spell Capacitor defines charge capacity and spell tiers but not construction cost/time, device count, stored-spell replacement, holder attunement, destruction, or whether charges belong to each device or the Technomancer.",
		dependsOnTask: 11,
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
	{
		id: "task7:regents:unapproved-aliases",
		dataset: "regents",
		entryId: "*",
		fieldPath: "aliases",
		message:
			"Shadow/Umbral, Flame/Radiant, Titan/Steel, Dragon/Destruction, Architect/Spatial, Transfiguration/Mimic, and Frost Sovereign compatibility names are not approved canonical aliases and must not silently resolve.",
		dependsOnTask: 16,
	},
	{
		id: "task7:regents:source-citation-matrix",
		dataset: "regents",
		entryId: "*",
		fieldPath: "class_features.provenance",
		message:
			"The repository identifies Rift Ascendant Canon but provides no independent page/section citation matrix for all Regent mechanics; provenance therefore records exact repository fields rather than claiming unavailable page citations.",
		dependsOnTask: 23,
	},
];
