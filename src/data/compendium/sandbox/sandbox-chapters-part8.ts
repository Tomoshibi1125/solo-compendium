import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 34-36
// Part VIII: Runes Cross-Reference • Expanded Random Encounters • 14-Day District Timeline
// ============================================================================
// Every rune name-links `runes/spell-rank-*.ts`, `runes/technique-techniques.ts`,
// or `runes/power-powers.ts`. Every encounter row pulls from `anomalies/` or
// `shadow-soldiers.ts`. Every NPC is canonical `sandbox-npcs.ts`.
// ============================================================================

export const chaptersPart8: SandboxChapter[] = [
	{
		title: "Chapter 34: Runes Cross-Reference",
		content: `# Runes Cross-Reference

> *"A rune is a spell that has stopped moving. That is not a metaphor."*
> — Professor Lun, margin note in a student's worksheet

## Using This Chapter

Runes in *The Shadow of the Regent* come from four canonical sources:

- \`runes/spell-rank-a.ts\` — A-tier spell-runes
- \`runes/spell-rank-b.ts\` — B-tier spell-runes
- \`runes/spell-rank-c.ts\` — C-tier spell-runes
- \`runes/spell-rank-d.ts\` — D-tier spell-runes
- \`runes/spell-rank-s.ts\` — S-tier spell-runes (Regent's Throne fragments)
- \`runes/technique-techniques.ts\` — technique-runes (all tiers)
- \`runes/power-powers.ts\` — power-runes (all tiers)

This chapter does NOT re-stat runes. It maps **where in the module** each rune-tier can drop, so the Warden can prep in advance.

## Rune Drop Schedule

| Tier | Drop Location(s) | Canonical Source |
|------|------------------|-------------------|
| **D** | Random encounter table (Chapter 35) roll of 15-17; Hollow Subway boss; Drowned Ward boss | \`runes/spell-rank-d.ts\` |
| **C** | Fungal Depths boss; Verdant Overgrowth boss; Ashen Vault boss; Chapter 18 Quest 2 (Specimen X); Chapter 18 Quest 4 (Torch's Redemption) | \`runes/spell-rank-c.ts\` |
| **B** | Sunken Tunnels boss; Frozen Citadel boss; Hana Financial Tower SB-2; Megadungeon Room 10 (peaceful Xylo release) | \`runes/spell-rank-b.ts\` |
| **A** | Obsidian Spire Floor 10+; Megadungeon Room 6 (Umbral Mage drop); Hana Financial Tower SB-3; Dr. Hayashi's research trade | \`runes/spell-rank-a.ts\` |
| **S** | Regent's Throne fragments (3 Warden-picked, post-Chapter 16) | \`runes/spell-rank-s.ts\` |
| **Technique** | Vermillion Guild training (Iron Belle, Bright) | \`runes/technique-techniques.ts\` |
| **Power** | Professor Lun's Mana Vein install completion; Hana Financial Tower SB-2 | \`runes/power-powers.ts\` |

## Bureau / Vermillion / Awoko Rune Sources

- **Bureau**: Dr. Hayashi trades B-rank+ Anomaly cores for **A or B spell-runes** (Bureau Trusted only).
- **Vermillion**: Sigilmaster Baek (Ch. 30 Room 5) sells **banned A-rank spell-runes** at 3× market. Mother Rust brews **consumable rune-tinctures** (temporary one-use runes) at Vermillion Trusted.
- **Awoko**: The Cult hoards runes as **tithes**. Every Sanctum raid (Ch. 33) yields at least 1 rank-matched rune. The Hollow Mother's body carries **3 A-tier spell-runes** on defeat.

## Forbidden Runes *(Bureau-restricted)*

The Bureau has formally restricted these rune categories after the Seoul Cascade:
- Any **A-tier or S-tier** rune of the *necrotic* or *void* school.
- Any **technique-rune** labeled as "rift-adjacent" in the compendium.

Vermillion sells restricted runes. Bureau confiscates them on sight. Ascendants caught with a restricted rune lose **−2 Bureau reputation** per instance. Wardens should foreshadow this at Bureau Friendly and above — Commander Park warns the party *once*.

## Rune Recovery After the Campaign

In the **Victory, Memorial, or Sealing** endings, the Regent's Throne fragments canonically shatter into **3 S-tier runes** (Chapter 22 canon). Warden picks 3 entries from \`runes/spell-rank-s.ts\` keyed to the party's composition. In the **Awakening Ending**, the fragments remain intact and serve as a sequel-arc plot engine.
`,
	},
	{
		title: "Chapter 35: Expanded Random Encounter Tables",
		content: `# Expanded Random Encounter Tables

> *"Every street is a dice roll. Every dice roll is a promise you can't break."*
> — Rat-King Ji, drunk at 3 AM

## Using These Tables

When the party travels through a Yongsan neighborhood, roll **1d20** on the table that matches the time of day + zone type. Every entry is canon-linked to an existing anomaly, NPC, or handout. Warden may replace any entry with a campaign-specific beat if they prefer.

## Table A — Lower City (Day)
*(Use when the party is crossing a commercial or residential zone during daylight.)*

| d20 | Encounter | Canon Reference |
|-----|-----------|-------------------|
| 1-2 | **Civilian in distress** | NPC rescue check; grants +1 Bureau OR +1 Vermillion reputation. |
| 3-4 | **Bureau patrol** | 4× Bureau Constable (generic Humanoid, \`anomalies/rank-d.ts\`). Request ID. At Bureau Neutral, +1 encounter delay; at Friendly, helpful. |
| 5-6 | **Vermillion courier** | Rat-King Ji's courier delivers a rumor (free info). |
| 7 | **Cult recruiter** | 1× Awoko Seeker (\`anomalies/rank-c.ts\` Humanoid). Attempts social manipulation on grief-marked PCs. |
| 8 | **Gate Echo** | Brief vision through an unvisited Gate — Warden describes unseen terrain. Psychic damage 1d4. |
| 9 | **Anomaly breach** | **1× D-Rank Anomaly** (\`anomalies/rank-d.ts\`, Warden picks). |
| 10 | **Anomaly breach, larger** | **1× C-Rank Anomaly** (\`anomalies/rank-c.ts\`, Warden picks). |
| 11 | **Bureau rescue call** | Distress flare. Saving lives grants +1 Bureau reputation. |
| 12 | **Awoko graffiti** | Fresh Cult markings. DC 14 Arcana to read; grants foreshadowing. |
| 13 | **Mika the Kid sighting** | Mika sits on a stoop drawing. Always wants to show the party a picture (Warden-picked handout hook). |
| 14 | **Orin on the move** | Guildmaster Orin is crossing the street — no encounter, pure atmosphere. Players should feel watched. |
| 15 | **Equipment cache** | Bureau supply drop. 2d4 mana rations + 1 common item (\`items-base-equipment.ts\`). |
| 16 | **Rune cache** | 1 **D-tier spell-rune** (\`runes/spell-rank-d.ts\`) in a sewer grate. DC 12 Investigation. |
| 17 | **Sigil trader** | Traveling Vermillion-affiliated vendor. Sells 1 random common sigil (\`sigils.ts\`) at 50% market. |
| 18 | **Old Man Crane sipping tea** | He nods. He never speaks first. He remembers the party. |
| 19 | **Peaceful moment** | No encounter. Small mercy. Regain 1d4 HP via narrative rest. |
| 20 | **Regent Whisper** | All PCs hear the Regent's voice. DC 14 Sense save or 1d4 psychic. The whisper carries a plot hint (Warden's call). |

## Table B — Lower City (Night)
*(Use when the party is crossing a commercial or residential zone after 2200 curfew.)*

| d20 | Encounter | Canon Reference |
|-----|-----------|-------------------|
| 1 | **Bureau curfew patrol** | Fines or arrests for the party. Escape chance DC 14 Agility. |
| 2-3 | **Awoko cell meeting** | 3× Acolyte (\`anomalies/rank-d.ts\`) + 1× Blood Zealot (\`anomalies/rank-c.ts\`). |
| 4-5 | **Cult recruitment ambush** | The Seeker has brought friends. 2× Awoko Infiltrator. |
| 6 | **Umbral Scout sighting** | 1× **Umbral Scout** (\`shadow-soldiers.ts\`) — the Regent's reconnaissance. |
| 7 | **Umbral Warrior ambush** | 2× Umbral Scouts + 1× **Umbral Warrior** (\`shadow-soldiers.ts\`). |
| 8 | **Phantom subway** | 1d6 ghostly passengers emerge from an unmarked subway entrance. No mechanical effect unless attacked. |
| 9 | **Mana-storm** | Weather effect. DC 12 Vitality save or 1 level of Exhaustion. Cult operatives use the storm to move. |
| 10 | **The Executioner's trail** | Fresh blade-cuts in concrete. DC 16 Survival to track. If followed: Chapter 19 Executioner encounter. |
| 11 | **Vermillion night patrol** | 1× Iron Belle + 2× Vermillion militia. Friendly to party at Vermillion Friendly. |
| 12 | **Awoko ritual in progress** | Interrupt: Sister Veil–style ritual. Disrupting grants +1 Bureau AND +1 Vermillion reputation. |
| 13 | **Civilian in Gate Rot** | DC 14 Sense to recognize; saving them grants +1 Bureau reputation. |
| 14 | **Abandoned Bureau vehicle** | Investigate for 1 Bureau artifact (\`items-part2.ts\`). DC 14 Investigation. |
| 15 | **Blackwood on private comms** | Agent Blackwood is on the roof, alone, on a classified channel. Investigation links to Warden Secret: Blackwood's Mission. |
| 16 | **Ghost sighting** | Ghost passes by; does not stop; one heterochromatic glance. Mark: +1 Rift Favor for the closest PC. |
| 17 | **Sigil trader, after-hours** | A Cult-adjacent vendor offers 1 rare sigil (\`sigils.ts\`) for a suspicious price. |
| 18 | **Awoko Cult pamphlet drop** | Canonical handout available; also links to the Seeker tailing the party next d20 roll. |
| 19 | **Professor Lun with a sensor** | He is installing a spare mana-vein sensor. Party may assist (DC 14 Intelligence). Grants +1 Bureau reputation. |
| 20 | **Regent's Herald sighting** | 1× **Eternal Celestial Herald (Beast)** (\`anomalies/rank-s.ts\`, anomaly-0020) briefly visible at the edge of the street. Does not engage unless approached. |

## Table C — Restricted Zone (Any Time)
*(Use when the party crosses the interior cordon, deeper into the Gate Surge.)*

| d20 | Encounter | Canon Reference |
|-----|-----------|-------------------|
| 1-2 | **Mana Storm** | DC 14 Vitality save. Failure: 1 level of Exhaustion. Success: regain 1 Rift Favor (the storm seeds the PC's mana lattice). |
| 3-4 | **Anomaly breach (D)** | 1× D-Rank Anomaly (\`anomalies/rank-d.ts\`). |
| 5-6 | **Anomaly breach (C)** | 1× C-Rank Anomaly (\`anomalies/rank-c.ts\`). |
| 7 | **Anomaly breach (B)** | 1× B-Rank Anomaly (\`anomalies/rank-b.ts\`). |
| 8 | **Umbral patrol** | 1× **Umbral Scout** + 1× **Umbral Warrior** (\`shadow-soldiers.ts\`). |
| 9 | **Umbral Archer nest** | 2× **Umbral Archer** + 1× **Umbral Scout** (\`shadow-soldiers.ts\`). |
| 10 | **Umbral ambush** | 1× **Umbral Assassin** (\`shadow-soldiers.ts\`) — uses *Vanishing Strike* on the party's softest target. |
| 11 | **Corrupted Celestial Herald** | 1× **Corrupted Celestial Herald** (\`anomalies/rank-s.ts\`) — downscale HP to 140 for interior-zone pacing. |
| 12 | **Frozen Strike-Team corpse** | Remains of a prior Bureau team. 1 common item + 1 handout fragment (random). |
| 13 | **Regent Whisper, intense** | DC 16 Sense save. Failure: 1d6 psychic + the marked PC hears Ms. Park's voice clearly ("He's late..."). |
| 14 | **Ally NPC crossing paths** | Warden picks a recruited ally who is ALSO moving through the zone. Encounter can be a brief respite or a plot beat. |
| 15 | **Stash of Anomaly cores** | 1d4 D-Rank + 1d4 C-Rank cores abandoned mid-extraction. |
| 16 | **Awoko ritual cell** | 4× Acolyte + 1× Blood Zealot performing an intermediate ritual. Disrupt OR observe. |
| 17 | **Bureau recon pair** | 2× Bureau field operatives. Exchange intel; grants +1 reputation OR a local map. |
| 18 | **Restricted rune cache** | 1× **A-tier spell-rune** (\`runes/spell-rank-a.ts\`) in a Bureau lockbox. DC 16 Thieves' Tools. |
| 19 | **A moment of stillness** | No encounter. Regain 1 Rift Favor. The Restricted Zone pauses to let the party breathe. |
| 20 | **The Executioner** | **1× Executioner** (canonical, Chapter 19). Roll for escape OR engage. At party level < 7, STRONGLY flee. |

## Table D — Inside-Gate Ambient Events
*(Roll once per 2 in-Gate hours. Lower % chance: once per long rest.)*

| d6 | Ambient Event |
|----|--------------|
| 1 | **Gate mana surge** — next ability used by any PC rolls with advantage. |
| 2 | **Gate mana drought** — next ability used by any PC rolls with disadvantage. |
| 3 | **Reality fracture** — gravity/time distorts. DC 14 Sense save or disoriented 1 round. |
| 4 | **Regent's attention** — if any PC is Regent-Marked, the Regent speaks to them telepathically. No save; narrative moment. |
| 5 | **Anomaly swarm** — 1d4 lesser Anomalies of Gate-rank minus one tier. |
| 6 | **Gate Echo** — the party briefly sees a vision from an unvisited Gate. Psychic 1d4. Regain 1 Rift Favor. |
`,
	},
	{
		title: "Chapter 36: The 14-Day District Timeline",
		content: `# The 14-Day District Timeline

> *"Clocks are measuring instruments. What Yongsan does is clock-like. It is not a clock."*
> — Dr. Serin Hayashi

## Overview

The Regent's Domain canonically has a **14-day Blue Phase** (Chapter 24: Mana Reading / Chapter 22: Treasure). This is DOUBLE the normal 7-day Gate Blue Phase because the S-Rank Gate is **unique**. The fourteen days are the campaign's master clock. Every day brings one canonical event, NPC moment, or faction advance.

This chapter functions like *Curse of Strahd*'s "Fortunes of Ravenloft" — a pacing instrument the Warden uses to keep campaign narrative moving when players' own actions don't fill the day.

**Usage**: at the start of each in-game day, read the day's entry. The Warden decides how to surface it (NPC visits, rumors, broadcast alerts, dreams).

---

## Day 1 — Landing Day
*Par chapter 1: Warden's Briefing.*
- The party arrives at Yongsan Federal Building.
- Commander Park gives the initial briefing.
- **Mana Reading** (Chapter 24) is performed **TONIGHT** — Sister Constance's cards are dealt; results lock for the campaign.
- **Rumor**: civilians in Guro District reporting "wrong light" in an elderly care ward. *(Foreshadows Day 0 — Memory-Care Wing, which the party ran yesterday. Rumors move slower than reality.)*
- **NPC moment**: Agent Blackwood is seen alone on the roof, on a classified call. Players may notice.

## Day 2 — First Blood
- **Gate opened**: first D-Rank Gate brute-forces open at **06:14** (The Drowned Ward). Casualties: 3 Bureau constables.
- The party is offered the Gate clear.
- **Rumor**: Vermillion is recruiting aggressively in the Bazaar.
- **NPC moment**: Mika the Kid finishes a new drawing — a water-filled subway car.

## Day 3 — The Cult Moves
- An Awoko Cult **Seeker** (D-Rank) is spotted in Guro District by Bureau scouts. *(Foreshadows Ms. Park being recruited/rescued.)*
- **Rumor**: Old Man Crane has returned to the Bazaar. He was absent for a year.
- **Gate status**: Hollow Subway E-Rank opens.
- **NPC moment**: Rat-King Ji approaches the party with a rumor for sale (1,000 Credits).

## Day 4 — Hayashi's Research
- Dr. Hayashi publishes her **Research Brief: Regent Entities** internally; party receives a copy at Bureau Friendly.
- **Rumor**: the Hollow Mother is preparing a major ritual.
- **Gate status**: Fungal Depths D-Rank reaches critical; Anomalies escape into the sewer network.
- **NPC moment**: Sergeant Yoon briefs the party about Strike Team Seven. If the party has found the *Final Transmission* handout, Yoon demands answers.

## Day 5 — The Executioner
- **The Executioner** (Chapter 19) kills 12 Bureau operatives overnight. Its position is now marked on the Bureau HQ whiteboard.
- **Rumor**: Vermillion's Mother Rust is brewing something new.
- **Gate status**: Verdant Overgrowth C-Rank opens.
- **NPC moment**: Ghost is seen at the Bureau HQ morgue, briefly. Heterochromatic eyes.

## Day 6 — Blackwood's Private Mission
- Agent Blackwood disappears for 18 hours. The Bureau notes the absence.
- **Rumor**: one of the three Regent Relics has been spotted in the Ashen Vault C-Rank.
- **Gate status**: Ashen Vault C-Rank reaches amber.
- **NPC moment**: the Cult openly proselytizes at the Covered Market. Father Gregor delivers an inflammatory sermon.

## Day 7 — The B-Rank Tier
- **Two B-Rank Gates open** on the same day: Sunken Tunnels and Frozen Citadel. The Bureau is overstretched.
- **Rumor**: Commander Park argues with Guildmaster Orin publicly for the first time in five years. The Bureau–Vermillion rivalry heats up.
- **NPC moment**: The Prophet (Whisper) seeks out a Regent-Marked PC in a dream. She warns them of a betrayer.

## Day 8 — Crane's Memory
- Old Man Crane has a bad day. He asks the party, unprompted, if they know what São Paulo smelled like.
- **Gate status**: Obsidian Spire A-Rank unlocks; the first floor is clearable.
- **NPC moment**: Professor Lun assembles the Mana Vein sensor rig publicly. Bureau Command is officially skeptical; unofficially pays for the parts.

## Day 9 — The Hollow Mother Declares
- The Awoko Cult publishes pamphlets citywide claiming the Regent offers ASCENSION. Civilian unrest spikes.
- **Gate status**: The Hollow Subway E-Rank re-stabilizes; a D-Rank Gate appears in its place (this is how the Surge keeps feeding itself).
- **NPC moment**: Mika the Kid's drawing now includes a stick-figure the party recognizes. One of them.

## Day 10 — The Relic Race
- If the party has been collecting Regent Relics, this is the day where the Awoko Cult tries to steal them. Mother Rust is the unwitting fence for one attempt.
- **Rumor**: Sister Veil has expressed doubts in a Cult meeting. She is quietly being watched.
- **Gate status**: Obsidian Spire Floor 10+ are accessible; runes available.
- **NPC moment**: Torch approaches the party with his forgery confession (Chapter 18 Quest 4).

## Day 11 — The Bureau Crisis
- Commander Park is ordered by Central Command to deprioritize the Surge and secure a specific Financial Tower vault. **Warden Secret: Blackwood's Mission** comes to a head.
- If the party has Bureau Allied, Park openly defies Central Command. If not, he complies.
- **Gate status**: A second A-Rank Gate manifests (warning bell for the final countdown).
- **NPC moment**: Agent Blackwood's cover breaks. She either confesses to the party OR disappears.

## Day 12 — The Hollow Mother's Ritual
- The Awoko Sanctum (Chapter 33) is at **full ritual strength**. If the party has NOT raided it yet, the Regent's HP in Chapter 16 increases by +40.
- **Rumor**: Dr. Hayashi believes she knows the Regent's original name. She refuses to speak it aloud.
- **NPC moment**: Sister Constance (the Mana Reader) appears unexpectedly at Bureau HQ. She has had a vision. The party is in it.

## Day 13 — The Final Preparations
- All factions acknowledge the S-Rank Gate is tomorrow or the day after.
- Commander Park and Guildmaster Orin meet publicly (if party has brokered Alliance).
- **NPC moment**: Old Man Crane announces he's entering the Gate tomorrow. He asks the party if he may join their strike team. *(Chapter 24 Ally card canon.)*
- **Handout**: the canonical **Old Man Crane's Gate Raid Journal** is offered here if not claimed.

## Day 14 — The S-Rank Assault
- The party enters **The Regent's Domain** (Chapter 16 / Chapter 28 Megadungeon).
- Bureau forces and Vermillion irregulars mass at the cordon.
- Agent Blackwood, if loyal, coordinates from a mobile command vehicle.
- The S-Rank Gate is stable throughout the day; the assault window is 06:00 to 06:00 next morning.
- **The end, or the beginning of the next campaign.**

---

## Interrupting the Timeline

The Warden may **pull any day forward** if the party's actions justify it. The Timeline is a clock, not a cage. If the party raids the Awoko Sanctum on Day 8 instead of Day 12, compress subsequent days. If the party drags their feet at the Bazaar for six in-game days, the Timeline catches up and **the city burns around them** — Anomaly breaches on Days 15+ escalate quickly (new d20 roll per day on Table C, plus +1 civilian casualty tracker).

## The Sixth Entr'acte — Optional Slow-Burn Days

If the Warden wants a longer campaign (up to 21 days), insert these **Entr'acte days** between any two listed days:

- **E-A: Civilian Aftercare Day** — the party spends a day at Mother Rust's outreach, earning +2 Vermillion reputation.
- **E-B: Bureau Training Day** — simulated Gate drills at Bureau HQ Ch. 29 Room 3; +1 Bureau reputation + advantage on next intel-check.
- **E-C: Vermillion Pit Day** — Iron Belle's back-alley duels, Chapter 30 Room 10; +1 Vermillion reputation + technique training.
- **E-D: Personal Scene Day** — a PC's background (\`backgrounds.ts\`) gets a specific scene. Warden and player improvise.
- **E-E: Cult Doctrine Day** — party captures or observes an Awoko doctrine study session; foreshadows Sister Veil's defection.
- **E-F: Old Man Crane Day** — Crane recounts one of his twelve Gate Collapses over tea. Grants +1 Rift Favor to one PC.

## Final Bureau Alert Sequence

On **Day 14 at 05:55**, five minutes before the S-Rank assault begins, Commander Park gives a final broadcast. Warden reads the following:

> **Park's Broadcast**:
> *"All Ascendant teams. Check your loadouts. Check your runes. Check the person beside you. The Gate will not give you a second chance to notice the things you meant to say. On the count of five. One. Two. Three. Four. Go."*

The assault begins.
`,
	},
];
