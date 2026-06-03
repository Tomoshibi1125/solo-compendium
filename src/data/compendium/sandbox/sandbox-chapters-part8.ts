import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT - CHAPTERS 34-36
// Part VIII: Runes, Gloamreach encounters, and Domain pressure timeline
// ============================================================================

export const chaptersPart8: SandboxChapter[] = [
	{
		title: "Chapter 34: Runes Cross-Reference",
		content: `# Runes Cross-Reference

> *A rune is a spell that stopped moving. That is not a metaphor.*
> - Professor Lun

## Using This Chapter

Runes in *The Shadow of the Regent* come from canonical compendium sources. This chapter does not restat them. It maps where rune tiers appear inside the Gloamreach so the Warden can prep rewards without drifting from core canon.

Canonical sources:

- \`runes/spell-rank-d.ts\`
- \`runes/spell-rank-c.ts\`
- \`runes/spell-rank-b.ts\`
- \`runes/spell-rank-a.ts\`
- \`runes/spell-rank-s.ts\`
- \`runes/technique-techniques.ts\`
- \`runes/power-powers.ts\`

## Rune Drop Schedule

| Tier | Domain Source | Canonical Source |
|---|---|---|
| D | The Hollow Subway, Drowned Ledgerfen, early road encounters | \`runes/spell-rank-d.ts\` |
| C | Fungal Depths, Remembering Orchard, Ashen Counting-House | \`runes/spell-rank-c.ts\` |
| B | Sunken Tunnels, Bastion Golemfall, Mana Vein Node rewards | \`runes/spell-rank-b.ts\` |
| A | Obsidian Spire, Forbidden Vault, Citadel approach, Hayashi research trade | \`runes/spell-rank-a.ts\` |
| S | Regent's Anchor-throne fragments after the finale | \`runes/spell-rank-s.ts\` |
| Technique | Vermillion training, Orin's trials, Spire trials | \`runes/technique-techniques.ts\` |
| Power | Mana Vein network, Unseated Law bargains, Claim awakenings | \`runes/power-powers.ts\` |

## Faction Rune Sources

### Bureau

Dr. Hayashi and Professor Lun can identify or stabilize runes. Bureau access favors safety, documentation, and legal ownership.

### Vermillion

Vermillion can sell restricted runes, apply dangerous modifications, and ignore Bureau paperwork. The price is money, favor, or leverage.

### Awoko

The Awoko collect runes as grief-tithes. A Sanctum raid should yield at least one rune appropriate to the party's level, plus evidence of how the cult weaponizes loss.

### The Unseated Law

The Unseated Law can produce power-runes through bargain, precedent, or contradiction. These should be strong but costly. No bargain should feel random.

## Forbidden Runes

The Bureau restricts runes tied to void, necrotic authority, compelled obedience, identity rewriting, or Anchor interference. Possession creates Bureau risk, but these runes may be exactly what the party needs to contradict the Regent.

## Rune Recovery After the Campaign

If the Anchor is broken, sealed, or transformed, the Regent's Anchor-throne may fracture into three S-tier runes. Choose runes that reflect the party's ending, not only their combat builds.
`,
	},
	{
		title: "Chapter 35: Gloamreach Random Encounter Tables",
		content: `# Gloamreach Random Encounter Tables

> *Every road here is a question. Most of them are traps.*
> - Rat-King Ji

## Using These Tables

Roll when the party travels between major Gloamreach regions, refuses an invitation, carries a Claim openly, rests in unsafe territory, or spends too long debating in the road.

These encounters should not feel random in-world. The Regent's Domain notices motion, debt, fear, and trespass.

## Table A - Road of Writs

| d20 | Encounter |
|---|---|
| 1-2 | The road lengthens. Lose time, food, or daylight. |
| 3-4 | A toll-house appears with the party's names half-written in the ledger. |
| 5 | A messenger delivers an invitation sealed in black wax. |
| 6 | A settlement bell rings in the distance. Someone is being collected. |
| 7 | The party finds a broken Bureau marker from a team that has not entered yet. |
| 8 | Vermillion courier offers a shortcut for a price. |
| 9 | Awoko recruiter approaches the most grief-marked character. |
| 10 | Umbral Scout watches from a milestone. It flees if pursued. |
| 11 | Roadside shrine offers a small mercy with unclear ownership. |
| 12 | Mika's drawing appears nailed to a tree. It depicts the next danger. |
| 13 | A corpse asks for directions. It is polite. |
| 14 | Supplies spoil unless shared under guest-right. |
| 15 | Claim resonance. A carried Relic grows cold and points toward a contradiction. |
| 16 | Old Man Crane is sitting at a tea table in the road. He does not explain how. |
| 17 | Regent whisper. DC 14 Sense save or psychic strain and a personal taunt. |
| 18 | Bailiff sign. Chains dragged across the road, fresh ink on the stones. |
| 19 | A safe-looking shelter with a ledger by the door. |
| 20 | The Regent's Bailiff appears to announce charges. Combat is optional. Consequence is not. |

## Table B - Tribute Settlements

| d20 | Encounter |
|---|---|
| 1-2 | A family asks the party to hide someone from the next collection. |
| 3-4 | Local leader offers hospitality that creates legal obligation. |
| 5 | A child draws a place the party has not visited. |
| 6 | Villagers deny a disappearance everyone clearly remembers. |
| 7 | Awoko comfort-worker offers real aid and subtle recruitment. |
| 8 | Vermillion scout buys settlement secrets for supplies. |
| 9 | Bureau survivor begs extraction from the Domain. |
| 10 | The settlement's tribute is revealed. It is worse than rumored. |
| 11 | Regent courtier arrives for inspection. |
| 12 | A shrine has been defaced with Marthos-aspected rot. |
| 13 | Someone recognizes a Regent-Marked PC. They are terrified. |
| 14 | A feast begins. Refusing is rude. Accepting is dangerous. |
| 15 | Missing person returns with no shadow. |
| 16 | Local law contradicts Bureau law. The party must choose which to violate. |
| 17 | Claim clue hidden in a folk song, prayer, or ledger entry. |
| 18 | A settlement asks the party to kill someone who volunteered for tribute. |
| 19 | Hollow Mother sermon overheard. She says inherit, not serve. |
| 20 | The Bailiff comes for the village, not the party. |

## Table C - Wilds and Ruins

| d20 | Encounter |
|---|---|
| 1-2 | Predator tracks circle the party's camp from the future. |
| 3-4 | Adaptive beasts use a tactic the party used last session. |
| 5 | Weather changes after someone insults the Regent. |
| 6 | Ruined bastion patrol asks the party for an oath. |
| 7 | Fungal secret grows a mouth and repeats a confession. |
| 8 | Orchard fruit offers a memory. Eating it grants a clue and a cost. |
| 9 | Drowned voice asks to be named. |
| 10 | Broken road leads to the same milestone three times. |
| 11 | Anomaly swarm, rank appropriate. |
| 12 | Umbral Warrior patrol. |
| 13 | Awoko ritual site, currently unattended. |
| 14 | Vermillion salvage crew under attack. |
| 15 | Mana Vein flare. Gain one Rift Favor, then roll a complication. |
| 16 | Claim resonance points underground. |
| 17 | The Unseated Law speaks through a cracked courthouse bell. |
| 18 | Silent battlefield of empty armor. |
| 19 | Moment of stillness. Safe short rest if no one speaks the Regent's name. |
| 20 | The Citadel appears much closer than it should be. |

## Ambient Domain Events

Roll once per long rest outside protected shelter.

| d6 | Event |
|---|---|
| 1 | Domain pressure. DC 14 Sense save or dreams impose psychic strain. |
| 2 | Food changes flavor to ash, blood, flowers, or hospital antiseptic. |
| 3 | A written invitation appears in someone's pack. |
| 4 | A dead NPC speaks in a dream and offers true information. |
| 5 | The road outside has moved. |
| 6 | Small mercy. Regain 1 Rift Favor, but the Warden notes who granted it. |
`,
	},
	{
		title: "Chapter 36: The 14-Day Domain Pressure Timeline",
		content: `# The 14-Day Domain Pressure Timeline

> *Clocks measure time. The Gloamreach measures consent.*
> - Dr. Serin Hayashi

## Overview

The Gloamreach has a 14-day Blue Phase failure window before Red Phase collapse becomes likely. This is not a district countdown. It is the Domain pressing its law toward the material world.

Use this timeline as a pacing instrument. It should never override player agency. It advances pressure when the party delays, rests, travels, or ignores major threats.

## Day 1 - Threshold Day

The party enters the Gloamreach. The Gate behind them becomes unreliable. The Road of Writs appears for the first time. The Oracle Reading should happen before the end of this day or as soon as the party reaches a safe reader.

## Day 2 - First Tribute

A nearby settlement pays tribute. The party may witness it, interrupt it, or only hear the bells afterward. The Drowned Ledgerfen becomes active.

## Day 3 - The Road Learns

The Road of Writs begins responding to party choices. Anyone who signed a ledger, accepted hospitality, or gave a true name feels watched.

## Day 4 - Hayashi's Warning

A delayed Bureau transmission reaches the party. Dr. Hayashi confirms the Gloamreach is a Regent Domain, not a normal Gate. She warns them that killing creatures is not enough if the Anchor law survives.

## Day 5 - The Bailiff's First Public Judgment

The Regent's Bailiff collects someone from a settlement or road camp. This should be visible, memorable, and legally framed. It announces charges before violence.

## Day 6 - The Cult Moves

Awoko agents begin open recruitment in grief-dense places. The Hollow Mother sends a message, sermon, or dream. She does not say she serves the Regent.

## Day 7 - The Domain Tightens

Travel grows harder. Safe rests require tribute, guest-right, or faction shelter. The Sunken Tunnels and Bastion Golemfall become more active.

## Day 8 - Crane's Memory

Old Man Crane offers sealing lore or warns the party that some Regents can be contained only by sacrifice. If ignored, he goes alone toward the Citadel road.

## Day 9 - The Hollow Mother Declares

Awoko pamphlets, songs, or sermons spread through settlements. Civilian unrest rises. The cult claims the Regent offers ascension beyond Rank.

## Day 10 - The Claim Race

If the party has recovered any Claim, enemies attempt to steal, corrupt, or legally invalidate it. If they have recovered none, the Regent sends an invitation that includes one precise clue.

## Day 11 - Bureau Crisis

Central Command orders the Annex to prioritize Relic extraction over survivor recovery. Commander Park either obeys, delays, or defies this order depending on party reputation.

## Day 12 - Ritual of Inheritance

The Awoko Sanctum reaches full ritual strength. If not disrupted, the Hollow Mother gains leverage over the final act and may attempt to inherit the Domain if the Regent weakens.

## Day 13 - Final Preparations

All major factions understand that the Citadel approach is imminent. Allies must be chosen. Debts come due. The Road of Writs offers the shortest path and the worst terms.

## Day 14 - Citadel Day

The party enters the Regent's Citadel or the Domain begins forcing Red Phase pressure onto the material world. Bureau floodlights outside the Gate dim. Inside the Gloamreach, every bell rings once.

## If the Timeline Expires

Do not end the campaign automatically. Escalate.

Choose two consequences:

1. The material-side cordon suffers a partial Red Phase bleed.
2. One settlement is annexed directly into the Regent's court.
3. The Bailiff gains authority to pursue the party into protected shelters.
4. The Hollow Mother completes part of her inheritance ritual.
5. The Citadel road opens, but only under hostile terms.
6. One Claim becomes harder to use because the Regent has prepared a legal counterclaim.

## Warden Guidance

This timeline is pressure, not railroad track. Its purpose is to keep the Domain alive. The party should feel that delay matters, but that clever action can change the clock's meaning.
`,
	},
];
