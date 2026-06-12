import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// RUN SILENT - CHAPTERS 34-36
// Part VIII: Runes, Gloamreach encounters, and the hunt's escalation
// ============================================================================

export const chaptersPart8: SandboxChapter[] = [
	{
		title: "Chapter 34: Runes Cross-Reference",
		content: `# Runes Cross-Reference

> *A rune is a spell that stopped moving. That is not a metaphor.*
> - Professor Lun

## Using This Chapter

Runes in *Run Silent* come from canonical compendium sources. This chapter does not restat them. It maps where rune tiers appear inside the Gloamreach so the Warden can prep rewards without drifting from core canon.

Canonical sources:

- \`runes/spell-rank-d.ts\`
- \`runes/spell-rank-c.ts\`
- \`runes/spell-rank-b.ts\`
- \`runes/spell-rank-a.ts\`
- \`runes/spell-rank-s.ts\`
- \`runes/technique-techniques.ts\`
- \`runes/power-powers.ts\`

## Rune Drop Schedule

| Tier | Gloamreach Source | Canonical Source |
|---|---|---|
| D | The Hollow Way, Drowned Ledgerfen, early road encounters | \`runes/spell-rank-d.ts\` |
| C | Fungal Depths, Remembering Orchard, Ashen Counting-House | \`runes/spell-rank-c.ts\` |
| B | Sunken Tunnels, Bastion Golemfall, Mana Vein Node rewards | \`runes/spell-rank-b.ts\` |
| A | Obsidian Spire, the Deep Places, the final crossing, Hayashi research trade | \`runes/spell-rank-a.ts\` |
| S | Recovered from the place the Quiet fell, or the deepest dark, after the finale | \`runes/spell-rank-s.ts\` |
| Technique | Vermillion training, Orin's trials, Spire trials | \`runes/technique-techniques.ts\` |
| Power | Mana Vein network, Old Power Below bargains, Means awakenings | \`runes/power-powers.ts\` |

## Faction Rune Sources

### Bureau

Dr. Hayashi and Professor Lun can identify or stabilize runes. Bureau access favors safety, documentation, and legal ownership.

### Vermillion

Vermillion can sell restricted runes, apply dangerous modifications, and ignore Bureau paperwork. The price is money, favor, or leverage.

### Awoko

The Awoko collect runes as grief-offerings. A Sanctum raid should yield at least one rune appropriate to the party's level, plus evidence of how the cult weaponizes loss.

### The Old Power Below

The Old Power Below can produce power-runes through bargain, sacrifice, or a truth the dark buried. These should be strong but costly. No bargain should feel random.

## Forbidden Runes

The Bureau restricts runes tied to void, necrotic authority, compelled obedience, identity rewriting, or interference with the deep Gloamreach. Possession creates Bureau risk, but these runes may be exactly what the party needs against the Quiet.

## Rune Recovery After the Campaign

After the finale — escape, kill, or become — the deepest places may give up as many as three S-tier runes. Choose runes that reflect the party's ending, not only their combat builds.
`,
	},
	{
		title: "Chapter 35: Gloamreach Random Encounter Tables",
		content: `# Gloamreach Random Encounter Tables

> *Every road here is a question. Most of them are traps.*
> - Rat-King Ji

## Using These Tables

Roll when the party travels between major Gloamreach regions, travels loud or lit, carries a piece of the Means openly, rests in the open, or spends too long debating on exposed ground.

These encounters should not feel random in-world. The Quiet notices motion, noise, light, and the use of Essence.

## Table A - The Old Roads

| d20 | Encounter |
|---|---|
| 1-2 | The road goes on longer than it should. Lose time, food, or daylight, and the dark gets a turn. |
| 3-4 | A still figure stands at the verge, the party's names already carved in the stone beside it in a hand none of them used. |
| 5 | A voice from off the road calls a name one of the party has lost. |
| 6 | A community bell tolls once, far off, then silence. Someone behind a wardline did not make it. |
| 7 | The party finds a broken Bureau marker from a team that has not entered yet. |
| 8 | Vermillion courier offers a shortcut for a price. |
| 9 | Awoko recruiter approaches the most grief-marked character. |
| 10 | Umbral Scout watches from a milestone. It flees if pursued. |
| 11 | Roadside shrine offers a small mercy with unclear ownership. |
| 12 | Mika's drawing appears nailed to a tree. It depicts the next danger. |
| 13 | A corpse asks for directions, in a voice someone knows. It is patient. |
| 14 | Supplies spoil unless shared — the dark is hungrier where the living hoard. |
| 15 | A carried piece of the Means grows cold and pulls toward something deep. |
| 16 | Old Man Crane is sitting at a tea table in the road. He does not explain how. |
| 17 | The Quiet whispers. DC 14 Sense save or psychic strain and a lure in a voice you know. |
| 18 | Worn-dead sign. Fresh drag-marks, and footprints that stop, facing the way you came. |
| 19 | A safe-looking shelter, its door already open, and nothing inside that is wrong. |
| 20 | The worn dead converge — a lure, a wrong shape, the cold of the Quiet behind them. Run or hide; do not fight in the open. |

## Table B - The Warded Communities

| d20 | Encounter |
|---|---|
| 1-2 | A family asks the party to shelter someone the Quiet has marked. |
| 3-4 | A ward-keeper offers shelter — but the community's rules come with it, and they are absolute. |
| 5 | A child draws a place the party has not visited. |
| 6 | Villagers deny a disappearance everyone clearly remembers. |
| 7 | Awoko comfort-worker offers real aid and subtle recruitment. |
| 8 | Vermillion scout buys settlement secrets for supplies. |
| 9 | Bureau survivor begs extraction from the Gloamreach. |
| 10 | The community's hard bargain is revealed — what they do to keep the dark out. It is worse than rumored. |
| 11 | A worn-dead wanders in wearing a villager's face, and no one is sure whose. |
| 12 | A ward has been defaced with creeping rot. |
| 13 | Someone recognizes a Quiet-Marked PC. They want them gone before dark. |
| 14 | A feast begins. Refusing is rude. Accepting is dangerous. |
| 15 | Missing person returns with no shadow. |
| 16 | A local rule makes no sense to outsiders. The party must keep it or risk the dark. |
| 17 | A Means clue hidden in a folk song, a prayer, or a name carved where it should not be. |
| 18 | A community asks the party to put down someone the Quiet has already half-taken. |
| 19 | Hollow Mother sermon overheard. She promises the grieving they can stop being prey. |
| 20 | The worn dead come for the community, not the party — and the wards may not hold. |

## Table C - Wilds and Ruins

| d20 | Encounter |
|---|---|
| 1-2 | Predator tracks circle the party's camp from the future. |
| 3-4 | Adaptive beasts use a tactic the party used last session. |
| 5 | The dark deepens early after someone makes too much noise. |
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
| 16 | A piece of the Means resonates, pointing underground. |
| 17 | The Old Power Below speaks through a cracked bell. |
| 18 | Silent battlefield of empty armor. |
| 19 | Moment of stillness. Safe short rest if no one speaks a true name aloud. |
| 20 | For a heartbeat the Quiet's full attention turns on the party, closer than it should be. |

## Ambient Events

Roll once per long rest outside protected shelter.

| d6 | Event |
|---|---|
| 1 | The dark presses close. DC 14 Sense save or dreams impose psychic strain. |
| 2 | Food changes flavor to ash, blood, flowers, or hospital antiseptic. |
| 3 | A keepsake of someone they lost appears in someone's pack. |
| 4 | A dead NPC speaks in a dream and offers true information. |
| 5 | The road outside has moved. |
| 6 | Small mercy. Regain 1 Rift Favor, but the Warden notes who granted it. |
`,
	},
	{
		title: "Chapter 36: The Hunt Escalates - Pacing the Persecution",
		content: `# The Hunt Escalates

> *Time in the Gloamreach is not measured in days. It is measured in how close the Quiet has come, and how much of you is left.*

## Overview

There is no countdown to a Rift Break and no Domain pressing toward the material world. The campaign escalates as **persecution** — the Quiet grows bolder, the safe-holds grow fewer, the worn dead thicken, and the party's own fraying (Dread) and exhaustion mount — across four acts spanning Levels 1-10. Pace it by the **Hunt Clock** (see Running This Horror) and by what the party has done, never by a calendar.

Use this as a pacing instrument. Advance the pressure when the party linger, rest carelessly, live loud, or push deeper; ease it, briefly, when they reach a true safe-hold or earn a native's trust.

## Act I — First Contact (Levels 1-3)

The slow wrong. The threshold seals, the AFA begins to lie, comms die, and the party meet their first natives — and learn, badly, that there are *rules*.

- The Quiet is felt, never seen: a silence where there should be sound, a wrong shape on a ridgeline.
- The first **taking** happens here — ideally an NPC, so the party learn what they face without losing one of their own first.
- The lesson lands: **noise, light, and Essence draw it.** The party either learn to run silent or pay.
- Goal: reach the first warded safe-hold alive, and begin to understand the wards.

## Act II — The Hunt (Levels 4-6)

The party know now that they are prey. The Quiet hunts in earnest, mostly through the **worn dead** (the Worn, the Caller, the Wrong Shape), and trust begins to fray.

- The Hunt Clock fills faster; persecution set-pieces — stalk, hide, flee — become routine.
- The first time the Quiet **wears a face the party knows** — a lost teammate, a trusted native — Dread spikes and trust cracks.
- Safe-holds demand the party live by the rules; breaking one, even in ignorance, has consequences the whole community pays.
- Goal: survive the first time the Quiet takes one of *them*, and keep moving.

## Act III — The Long Dark (Levels 7-9)

Desperate survival, and the first real understanding. The party push into the deeper Gloamreach, where the worn dead thicken into **the Hollowed** and the safe-holds fail.

- The party begin learning **true things** about the Quiet (see What the Natives Know and The Means to End It) — and the first hint that it might, in theory, be ended.
- Resources thin; the failing AFA gives nothing true; the dark is constant.
- Essence becomes nearly suicidal to use this deep; the party live or die on silence and the rules.
- Goal: learn enough to find a way out — or the first piece of the Means.

## Act IV — Threshold (Levels 9-10)

The climax. The party have a way out, a desperate plan to end the Quiet, or both — and the Quiet knows it.

- The Hunt is total; the Quiet stops being patient.
- The party run for the threshold to escape, or commit to the gated kill (L9+ and the Means assembled; see The Means to End It and the Threshold chapter).
- Either way it costs. Someone may not make it out. The natives who helped them cannot leave at all.
- Goal: escape, or put the Quiet down — and live with which.

## Advancing the Pressure (when the party stall)

When the party delay, rest carelessly, or live loud, escalate. Choose one:

1. A safe-hold the party relied on falls — a rule broken, a ward failed, the people gone or worn.
2. The Quiet takes someone the party was protecting, and wears them back.
3. The worn dead grow bolder, hunting in daylight and behind wardlines.
4. A native who knew the rules — and the way out — is lost, and the party's map goes dark.
5. The dark itself spreads: more of the Gloamreach becomes exposed ground, fewer places safe.
6. The Quiet shows itself, fully, for a heartbeat — and the next scene's Hunt Clock starts half-full.

## Warden Guidance

This is pressure, not a railroad. Its purpose is to keep the party *hunted* — never safe for long, always one rule behind, always aware the Quiet is closer than it was. Clever, quiet, disciplined play should buy time and lives; carelessness should cost them.
`,
	},
];
