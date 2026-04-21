import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 27-28
// Part V: Artifacts Cross-Reference  •  Regent's Domain 15-Room Megadungeon
// ============================================================================
// Every named item, relic, sigil, tattoo, anomaly, shadow-soldier, spell,
// technique, power, and condition in these chapters is a NAME-LINK back to
// the authoritative Rift Ascendant compendium. Stat blocks live in their
// source files; this chapter places them in the module's narrative context.
// Narrative-only props (e.g., the Faded Family Photo) are described inline.
// ============================================================================

export const chaptersPart5: SandboxChapter[] = [
	{
		title: "Chapter 27: Artifacts Cross-Reference",
		content: `# Artifacts Cross-Reference

> *"An artifact is a promise a dead man makes to a living one. The dead man does not know he is dead. The living one does not know it is a promise."*
> — Xylo, *The Archivist of Eternity*, as quoted by Dr. Serin Hayashi

## Using This Chapter

This is a **cross-reference table** — a Warden's index that maps every named canonical item, relic, sigil, tattoo, and tattoo-voucher reward in *The Shadow of the Regent* to its location in this module. Full stat blocks, attunement rules, curses, and mana costs live in the authoritative compendium files (\`artifacts.ts\`, \`relics-comprehensive.ts\`, \`sigils.ts\`, \`tattoos.ts\`, \`items-base-equipment.ts\`, \`items-part1..9.ts\`, \`runes/\`). The module tells you WHERE each shows up; the compendium tells you WHAT it does.

> **Warden tip**: when a reward line reads *"drop: Frost Axe (see relics-comprehensive.ts)"*, open the compendium to that entry during prep. The sandbox chapter will not duplicate the stat block — that is intentional, and keeps the module from drifting out of sync with core canon.

## I. The Three Regent Relics *(canonical: Chapter 21)*

The Void, Abyss, and Blood Relics are fully statted in **Chapter 21: Relics**. Their placement is randomized by **Chapter 24: Mana Reading** (Cards 2/3/4). The Regent's Phase 2 ability suppression table (Chapter 16) already cross-references them. Do not re-stat them — read *from* Chapter 21.

| Relic | Suppresses in Final Fight | Typical Placement (roll Ch. 24) |
|-------|---------------------------|--------------------------------|
| **Relic of the Void** | Shadow Storm (Phase 2) | Hollow Subway / Drowned Ward / Ashen Vault / Executioner's person |
| **Relic of the Abyss** | Shadow Step (Phase 2) | Ashen Vault vault / Frozen Citadel throne / Obsidian Spire Floor 9 |
| **Relic of Blood** | Consume Shadow (Phase 2) | Sunken Tunnels altar / Frozen Citadel S-Rank corpse / Obsidian Spire Floor 17 |

## II. Finale Loot Slate — Canonical Artifacts

When the Regent falls (Chapter 16 / Megadungeon Room 15), the Warden selects a **finale drop** keyed to the surviving party's composition. Every option is canonical; none are new.

| Party Composition | Recommended Drop | Source File |
|-------------------|------------------|-------------|
| Destroyer / Berserker lead | **Regent's Edge** | \`artifacts.ts\` (artifact_18) |
| Assassin / Stalker lead | **Regent's Shadow Dagger** | \`relics-comprehensive.ts\` (regents-shadow-dagger) |
| Esper / Herald / Summoner lead | **Shadow Regent's Mantle** | \`artifacts.ts\` (artifact_3) |
| Holy Knight / Contractor / Idol lead | **Architect's Authority** | \`relics-comprehensive.ts\` (rulers-authority) |
| Mage / Technomancer lead | **Skywyrm's Gauntlet** | \`relics-comprehensive.ts\` (skywyrms-gauntlet) |
| Revenant / Striker lead | **Bloodthirsty Greatsword** | \`relics-comprehensive.ts\` (bloodthirsty-greatsword) |

**Alternative A-rank drops** (for non-finale endgame kills, e.g., the Executioner, the Awoko Sanctum boss, the Obsidian Spire Floor 20 guardian):
- **Kamish's Wrath** (artifact_1) — legendary twin daggers.
- **Demon King's Longsword** (artifact_2) — two-handed lightning blade.
- **Lightning Blade** (relics-comprehensive) — rapier finesse option.
- **Frost Axe** (relics-comprehensive) — two-handed cold option.
- **Abyssal Plate Armor** (relics-comprehensive) — armor for the tank.
- **Dragon Scale Mail** (relics-comprehensive) — armor with breath-weapon recharge.
- **Bloodstone Amulet** (relics-comprehensive) — accessory for shadow builds.

**Mythic-tier (Warden's discretion, secret endings, multi-campaign arcs)**:
- **World-Ender Reliquary / Crown** (artifacts 4, 16) — only drop if the party achieves all three Regent Relics AND Ms. Park survives AND the party refuses to destroy the Regent.
- **Sovereign Edge / Aegis / Crown / Reliquary** (artifacts 5, 15, 19, 8) — split across the Obsidian Spire's four guardians if the Warden runs the optional "Four Sovereigns" expansion.
- **Origin Reliquary / Aegis / Edge** (artifacts 6, 11, 13) — pre-Bureau Ascendant-era gear; Warden places in Mana Vein nodes for archaeologist-build parties.
- **Abyssal Reliquary** (artifact 7) — Drowned Ward endgame, replaces Relic of the Abyss if rolled as lost.
- **Calamity Core / Aegis / Edge** (artifacts 9, 10, 14) — optional kaiju-scale threat arc; tie to the roaming Executioner if the Warden extends its lair.

## III. Sigil Drops by Gate *(sigils.ts)*

Each B-Rank+ Gate drops one specific sigil. Each A-Rank Gate drops two. These are the **guaranteed** sigil slots; random Encounter Table (Chapter 20) rolls may grant additional low-rarity sigils.

| Gate | Rank | Sigil Drop(s) | Sigil Source |
|------|------|---------------|--------------|
| Hollow Subway | E | *Sigil of the Aegis* (if cleared with zero deaths) | \`sigils.ts\` (sigil-ward-1) |
| Drowned Ward | D | *Sigil of the Frost-Ward* | sigil-res-fire-1 |
| Fungal Depths | D | *Sigil of the Cleansed Blood* | sigil-res-poison-2 |
| Verdant Overgrowth | C | *Sigil of the Zephyr's Tread* | sigil-mobility-1 |
| Ashen Vault | C | *Sigil of the Crimson Weeping* | sigil-bleeding-1 |
| Sunken Tunnels | B | *Sigil of the Winter Court* + *Sigil of the Hearth-Fire* | sigil-frost-1, sigil-res-cold-1 |
| Frozen Citadel | B | *Sigil of the True Glacier* + *Sigil of the Grounded Soul* | sigil-res-frost-2, sigil-res-lightning-1 |
| Obsidian Spire | A | *Sigil of the Void-Walker* + *Sigil of the Shadow Regent* | sigil-shadow-1, sigil-shadow-king |
| Regent's Domain | S | *Sigil of the Undying Flame* (Room 7 reward) | sigil-immortality |

**Awoko Sanctum** (Chapter — part7) drops the ritual-counter pair: *Sigil of the Crimson Weeping* + *Sigil of the Cleansed Blood* already covered above; the Sanctum's **unique** drop is *Sigil of the Shadow Regent* (legendary) — if the party already claimed it from the Obsidian Spire, replace with *Sigil of the Iron Mind* (sigil-res-psychic-2).

**Weapon-mastery sigils** (Grandmaster's Edge, Earth-Shatterer, Ranger's Eye, Pierce-Through, Executioner's Swing): rewards for **Chapter 24 Mana Reading Card 1** (Spark / second Awakening). The NPC who performs the Awakening affixes the sigil to the PC's primary weapon.

## IV. Tattoo Parlour — Downtime Rewards *(tattoos.ts)*

In **Chapter 7: Downtime**, the Vermillion Guild tattooist *(see part 6 Vermillion keyed rooms)* offers canonical ink to any PC with **Trusted** Vermillion reputation. One tattoo per Downtime per PC. Cost: 2,500 Credits or one B-Rank Anomaly core.

| PC Job | Recommended Tattoo | Tattoo Source |
|--------|-------------------|---------------|
| Destroyer | **Regent's Heartbeat** | tattoo_1 |
| Berserker | **Impact Reservoir** | tattoo_5 |
| Assassin | **Predator's Gaze** | tattoo_6 |
| Striker | **Hunter's Acuity** | tattoo_3 |
| Mage | **Flame Exhaust** | tattoo_7 |
| Esper | **Blind-Sight Resonance** | tattoo_11 |
| Revenant | **Blood-Iron Seal** | tattoo_9 |
| Summoner | **Bone-Weave Tapestry** | tattoo_2 |
| Herald | **Sky-Walker's Tread** | tattoo_14 |
| Contractor | **Wind-Shear Cloak** | tattoo_8 |
| Stalker | **Acidic Excretion** | tattoo_12 |
| Holy Knight | **Earth-Mantle Plating** | tattoo_4 |
| Technomancer | **Purifying Furnace** | tattoo_13 |
| Idol | **Pain-Ward Glyphs** | tattoo_10 |

**Tattoo Voucher** rewards: certain Megadungeon rooms (Room 9 in particular) grant a *Tattoo Voucher* that lets a PC select ANY canonical tattoo from \`tattoos.ts\` regardless of Job.

## V. Runes — Where They Drop *(runes/)*

Runes in this campaign are scarce and specifically placed. They live in \`runes/power-powers.ts\`, \`runes/technique-techniques.ts\`, and \`runes/spell-rank-a/b/c/d/s.ts\`.

- **D-Rank Runes**: random Encounter Table roll (Chapter 20).
- **C-Rank Runes**: Side Quest rewards (Chapter 18: Quest 2 "Specimen X" and Quest 4 "Torch's Redemption").
- **B-Rank Runes**: Gate mini-boss drops (Sunken Tunnels, Frozen Citadel — one each).
- **A-Rank Runes**: Obsidian Spire Floors 10+ and the Regent's Domain Megadungeon Floor −2 (Room 10).
- **S-Rank Runes**: the Regent's Throne fragments harvested post-Chapter 16 (Warden picks 3 from \`runes/spell-rank-s.ts\` or \`runes/technique-techniques.ts\` S-tier subset).

## VI. Campaign-Unique Narrative Props *(inline; zero mechanics)*

These are non-mechanical, non-canonical *flavor* props unique to this module. They do NOT go in the compendium — they live here and in handouts.

### The Faded Family Photo
Already added to \`sandbox-handouts.ts\`. The canonical *"faded photo of a family"* referenced in **Warden Secret: The Regent's Origin**. Crosses four rooms: R2 of the Memory-Care Wing → party's inventory → Chapter 16 throne-room prop → Phase 3 human-form reveal.

### Ms. Park's Wedding Ring
*(Optional, if the SEAL ending was chosen in Day Zero.)* A plain gold band, worn down on the inside. If the party visits Ms. Park during Downtime after the Memory-Care Wing, she offers the ring to the PC she perceives as most like her husband. Zero mechanics. If a PC wears it, the Warden can narrate a single flash of residual kindness during the Regent's Phase 3 human-form reveal — the Regent sees the ring, and for one beat, *remembers*.

### The Visitors' Log
*Cannot leave the Lodge.* A handwritten ledger at the Memory-Care Wing reception desk (R1). Every signature is in Ms. Park's handwriting. If a PC writes their name on the next blank line, the pocket dimension recognizes them and the next Sense save they make in the Lodge is made with advantage (this is the log's only mechanical touch, and it is not carried forward after the Lodge collapses/seals).

### The Unopened Commendation *(Megadungeon Room 7)*
A Bureau citation envelope, never opened, addressed to the Regent's past self (name effaced). If the first PC to enter Room 7 reads it aloud, they gain +1 Rift Favor immediately. Zero other mechanics. The envelope itself cannot leave the room; it dissolves into the Domain's atmosphere after 1 minute.

### The Child's Toy *(Megadungeon Room 9)*
Canonical throne-room prop per the Regent's Origin handout. A small wooden horse, one leg broken and glued. Zero mechanics. If the party takes it and shows it to Ms. Park at the cordon (SEAL ending), she weeps and says a name the players cannot hear. The Warden may grant the party a final point of Rift Favor for this scene.

### The Diploma *(Megadungeon Room 8)*
University diploma canonical to the Regent's origin. The name on it has been erased with the same "worn through" effect as the Faded Family Photo. Zero mechanics. If the party takes it and presents it to Commander Park or Dr. Hayashi in post-campaign epilogue, the Warden may unlock a **"Memorial"** ending — the Bureau restores the Regent's name to a single ledger.

---

## VII. Shadow Soldier Roster — Finale & Megadungeon *(shadow-soldiers.ts)*

Every Shadow Soldier summoned by the Regent in Phase 1 (Chapter 16) is now pulled from the canonical \`shadow-soldiers.ts\` compendium. The module no longer uses a generic "HP 20 AC 12" shadow minion.

| Soldier | Rank | Role | Typical Wave | Source |
|---------|------|------|--------------|--------|
| **Umbral Scout** | C | Scout | Megadungeon Rooms 3, 6 (pairs) | umbral-scout |
| **Umbral Warrior** | C | Destroyer | Megadungeon Rooms 3, 6 (single) | umbral-warrior |
| **Umbral Archer** | B | Archer | Megadungeon Room 6 (pair) | umbral-archer |
| **Umbral Mage** | B | Mage | Megadungeon Room 6 (single) | umbral-mage |
| **Umbral Assassin** | A | Assassin | Chapter 16 Phase 1 (1–2 per round) | umbral-assassin |
| **Umbral Bulwark** | A | Tank | Chapter 16 Phase 1 (1 per round, hard-cap 2) | umbral-bulwark |

Phase 1 summon rule: the Regent spawns **1d4 + 2** soldiers per round. Warden draws from this pool; no more than **10 active at once** (existing Ch. 16 cap preserved).

## VIII. Anomaly Cross-Reference *(anomalies/)*

Existing module text uses descriptive encounter names (e.g., "The Frost Sovereign", "The Hollow Mother's Herald"). Where a canonical stat block is available in \`anomalies/rank-*.ts\`, use that block rather than ad-hoc numbers. Recommended mappings (Warden may swap):

| Module Encounter | Canonical Anomaly Stat | Source |
|------------------|------------------------|--------|
| Frost Sovereign (Frozen Citadel B-Rank boss) | *Corrupted Celestial Serpent (Elemental)* | anomalies/rank-s.ts (anomaly-0030) — **downscale HP to 180 for B-Rank** |
| Abyssal Leviathan (Sunken Tunnels B-Rank boss) | *Corrupted Celestial Guardian (Demon)* | anomalies/rank-s.ts (anomaly-0025) — downscale HP |
| Mycelium Hive Queen (Fungal Depths D-Rank boss) | Use rank-d.ts closest Beast-type | anomalies/rank-d.ts |
| Executioner (roaming, Ch. 19) | *Eternal Celestial Phoenix (Humanoid)* | anomalies/rank-s.ts (anomaly-0015) |
| Megadungeon Room 4 (Chapel) sub-boss | *Corrupted Celestial Herald* | anomalies/rank-s.ts — downscale |
| Megadungeon Room 10 (Archivist's Cell) | *Eternal Celestial Herald (Beast)* | anomalies/rank-s.ts (anomaly-0020) |
| Megadungeon Room 13 (Army of Unmoving) | *Eternal Celestial Serpent (Undead)* | anomalies/rank-s.ts (anomaly-0010) |

## IX. Spell / Technique / Power Cross-Reference *(spells/, techniques.ts, powers.ts)*

NPC spellcasters and faction leaders pull their loadouts from canonical files:

- **The Hollow Mother**: draws from \`spells/rank-a.ts\` (Void / Necrotic) + one S-tier ritual for her boss phase. Supplement with \`techniques.ts\` Awoko-flavored entries.
- **Old Man Crane**: \`techniques.ts\` martial S-tier ("Serene Strike", "Thousand Leaves" — keep existing).
- **Dr. Hayashi**: \`spells/rank-b.ts\` (Investigation, divination-flavored).
- **Commander Park**: \`techniques.ts\` Contractor-job leadership techniques.
- **Guildmaster Orin**: \`techniques.ts\` Contractor + \`powers.ts\` for his S-tier passive.
- **The Millwright**: \`powers.ts\` Technomancer + \`runes/technique-techniques.ts\` for his Gate Disruption Device build-chain.
- **Sister Veil**: \`spells/rank-b.ts\` divination / ritual.
- **Blood Zealot Karn**: \`techniques.ts\` Berserker + one rage-tier ability from \`powers.ts\`.

## X. Feat & Background Cross-Reference *(feats-comprehensive.ts, backgrounds.ts, paths.ts)*

PC character creation for this module uses:
- **Any background** from \`backgrounds.ts\` + \`backgrounds-part2.ts\` — no module-specific restrictions.
- **Any path** from \`paths.ts\` — pantheon-aligned paths are recommended for narrative weight (e.g., Solara-path Holy Knight, Kael Voss-path Revenant).
- **Feats** are earned at level milestones; pull from \`feats-comprehensive.ts\` with no module restriction.

> **Warden note**: the canonical **14 Jobs** (\`jobs.ts\`) are all represented by NPCs in this module. See Chapter 19 (NPC Compendium) and part 6 expansion for the full roster.
`,
	},
	{
		title: "Chapter 28: The Regent's Domain — 15-Room Megadungeon",
		content: `# The Regent's Domain — 15-Room Megadungeon

> *"A throne is a prison that remembers the shape of its king."*
> — Xylo, *The Archivist of Eternity*

## Overview

This chapter **replaces** Chapter 16's single-arena structure with a **three-floor, fifteen-room** descent that culminates in the canonical throne-room fight. Chapter 16's phases, HP scaling, and Relic interactions remain authoritative — **Room 15 hands off to Chapter 16 intact**. The fourteen rooms of lead-up let the party burn resources, find narrative anchors, and earn reputational payoffs before the three-phase boss.

**Entry**: as in Chapter 16 — the party rises 50 ft. into the floating S-Rank portal. Once inside, they are in Floor −1 (Outer Mausoleum). There is no retreat; the portal sealed behind them.

**Resting**: NO long rests inside the Domain. Short rests allowed **only** in Rooms 7 and 14 (narrative "safe rooms"). Warden: this is the CoS-parity pressure — the Regent's Domain is a resource drain.

**Ambient Dread**: every 10 minutes of in-world time, each PC must make a **DC 12 Sense save** or lose 1 HP (psychic). This is the Domain itself feeding on their mana-lattice. Rift Favor Override is permitted.

**Pantheon Flavor by Floor**:
- **Floor −1**: *Cipher (The Eternal of Frost)* — memory preserved in cold.
- **Floor −2**: *Xylo (The Archivist of Eternity)* — a cosmology built of what the Regent refuses to forget.
- **Floor −3**: *Marthos (The Dragon-King of Void)* — annihilation held in abeyance by one widow's unfinished sentence.

---

## Floor −1 : The Outer Mausoleum

*Cold. Quiet. The architecture is the Bureau headquarters the Regent remembers from fifty years ago — but larger, and wrong. Portraits in the hallways have no faces.*

### Room 1 — The Frozen Atrium
*(100 ft × 60 ft, cathedral ceiling 40 ft)*

A bureau office lobby, frozen. Twelve desks arranged in rows. At each desk, a Bureau operator is sitting with hands poised over a keyboard — but they are **sculpted ice**, indistinguishable from the chair they are fused to. Their faces are all Ms. Park's face, at different ages.

> **Read Aloud**: *"Your breath hangs. The mana-relay on the central desk is on, blinking red — a priority alert four seconds old, forever. You step forward and the ice creaks. One of the operators turns their head — just their head — and watches you cross the room. None of them move. None of them blink. But each of them is watching you by the time you reach the far door."*

- **Encounter**: None. Any attack on an ice operator triggers a **DC 14 Sense save** from the attacker — failure: they hear the voice of someone they have lost saying their name, and they must use their next turn doing nothing but weeping. This is a **tonal** room, not a combat room.
- **Handout**: If the party searches the central desk, they find the **Final Transmission: Strike Team Seven** handout *(canonical, see \`sandbox-handouts.ts\`)* playing on loop from the relay.
- **Deity flavor**: Cipher. The cold here is not physical — it is *judicial*. The Domain is *judging* the party for arriving.
- **Exit**: Two doors. North leads to Room 2. East leads to Room 5 (shortcut — effectively skip 2–4, but miss the loot). The east door is inscribed with the worn-away name of the Regent. It is warm to the touch.

### Room 2 — The Vault of Missing Names
*(40 ft × 40 ft, floor-to-ceiling shelving)*

A Bureau archive. Every shelf is **stacked** with personnel files — thousands of them. Every file is **blank**. The names have been redacted so thoroughly that the paper is thinner there, almost translucent.

- **Puzzle**: There are **13 files** whose names are NOT blank. The party must find one. (DC 15 Investigation, or 10 minutes of search.) Each file, when opened, names one of the campaign's recruited allies — or one of their betrayers (per the Chapter 24 Mana Reading Card 5 result).
- **Reward (if quest outstanding)**: If **Ghost's Redacted Bureau ID** *(canonical handout)* has not yet been found, it is the 14th file in the stack.
- **Reward (always)**: one *Sigil of the Iron Mind* (sigils.ts, sigil-res-psychic-2) tucked into the back of the shelves. The Archivist's aspect is leaking through.
- **Encounter**: None, but ambient dread intensifies — DC climbs to 14 in this room.
- **Deity flavor**: Xylo's records are NEVER blank. This room is Xylo's accusation against the Regent.

### Room 3 — The Waiting Room
*(50 ft × 30 ft, rows of plastic waiting chairs)*

A Bureau waiting area. A receptionist's desk, empty. The clock on the wall reads **14:15**, stopped. A stack of magazines, the top one dated forty years ago.

- **Encounter** *(canonical, from \`shadow-soldiers.ts\`)*:
  - **2× Umbral Scout** (umbral-scout) — take the party by surprise from under the chairs.
  - **1× Umbral Warrior** (umbral-warrior) — emerges from the receptionist's office after round 2.
- **Tactics**: Scouts use *Shadowmeld* to scatter; Warrior uses *Pack Tactics* once a Scout is adjacent.
- **Drop**: **Sigil of the Shadow Regent** (sigils.ts, sigil-shadow-king) — on the Warrior. **This is the legendary sigil.** If it was already claimed at the Obsidian Spire, replace with *Sigil of the Void-Walker* (sigil-shadow-1).
- **Deity flavor**: Cipher. The waiting room is the waiting mortals do for the dead — frozen, perpetual.

### Room 4 — The Chapel of Failed Saints
*(60 ft × 40 ft, vaulted ceiling, stained-glass windows with no subjects)*

A small chapel. Twelve alcoves along the walls, one for each Eternal — but each statue has been **decapitated**. The only intact statue is in the center: a robed figure whose face is worn smooth.

> **Read Aloud**: *"The chapel is colder than the rest of the floor. Each decapitated statue has a plaque: Solara. Vaelen. Lyra. Kael Voss. Xylo. Kronos. Sylph. Nyx. Elara. Golem. Cipher. The twelfth alcove's plaque reads MARTHOS — and it is the only one intact. The central figure has no plaque. Its hands are folded in front of its chest, empty. You feel, standing here, that the figure is waiting for someone to put something into its hands."*

- **Encounter** *(Warden's choice)*:
  - If **Blood Zealot Karn** is still alive in the campaign (*canonical Awoko NPC*, \`sandbox-npcs.ts\` npc-awoko-003), he is here leading the ritual — a boss encounter. Pull his loadout from the NPC file and use his canon kit (\`techniques.ts\` Berserker + one \`powers.ts\` rage tier).
  - If Karn is dead: **1× Corrupted Celestial Herald** (anomalies/rank-s.ts, downscaled to HP 140 for B-Rank spacing).
- **Drop**: **Bloodstone Amulet** (relics-comprehensive.ts, bloodstone-amulet) — resting in the central figure's empty hands if the party places the **Faded Family Photo** (Day Zero handout) there. If the party does not have the photo, the amulet is on Karn's body (or the Herald's). **Do not give it without an exchange.**
- **Handout**: If the party places the photo in the central figure's hands, trigger **Warden Secret: The Regent's Origin** *(canonical, \`sandbox-handouts.ts\`)* to the Warden's discretion — Dr. Hayashi's voice crackles over the party's mana-relay reading the file.
- **Deity flavor**: Cipher / Xylo. The chapel is a frozen argument between pantheon and betrayer.

### Room 5 — The Widow's Corridor
*(200 ft corridor, lined with photographs)*

A long hallway. Both walls are papered with photographs — hundreds of them — the same wedding, the same man's effaced face, repeated in a thousand variants. Every photograph is a mirror of the Day Zero R2 prop.

> **Read Aloud**: *"You walk a long time. The photographs do not change. The same banner in Korean — 축하합니다 — the same dog at the bride's feet, the same worn-down face. But as you walk, the photographer's stamp in the corner of each frame cycles through every Bureau photo division that has ever existed. You are walking through every photo the Bureau ever took of the same wedding, and every one of them erased the same man."*

- **Encounter**: None. The ambient dread DC rises to **15** in this corridor.
- **Reward**: If the party did NOT take the Faded Family Photo in Day Zero R2, one of the photographs at the far end of the corridor can be pulled from the wall — it is **the same photo**, still real. The party receives the **Faded Family Photo** handout here. This is the second and final chance.
- **Deity flavor**: Cipher. What is remembered cannot be unfrozen.
- **Exit**: North to the Floor −1 → Floor −2 staircase. The descent is visible: steps leading down into a dim amber glow.

---

## Floor −2 : The Archive of His Self

*The amber light is not light — it is accumulated memory, compressed. The walls of this floor are made of paper. Not paper that was cut from trees. Paper that was written on and then stacked until it became architecture.*

### Room 6 — The Memory Atrium
*(80 ft × 60 ft, three-story ceiling of stacked filing cabinets)*

A central hub of Floor −2. Filing cabinets stacked to the ceiling; the ceiling is made of filing cabinets. The floor is a latticework of memory-glass. Below the glass, the party can see the *Army of the Unmoving* (Room 13) — thousands of Anomalies frozen mid-stride. One of them is the Regent's own shadow.

- **Encounter** *(canonical, \`shadow-soldiers.ts\`)*:
  - **1× Umbral Mage** (umbral-mage) — fires *Void Bolt* from the filing cabinet ceiling (ranged advantage).
  - **2× Umbral Archer** (umbral-archer) — use *Mark Target*; focus the tank.
- **Tactics**: The Mage triggers *Shadow Burst* at round 3. Archers use *Pinning Shot* on the party's mobility pieces.
- **Drop**: **Sigil of the Archmage's Clarity** (sigils.ts, sigil-intel-1).
- **Deity flavor**: Xylo. The filing cabinets hum with retained information — they are Xylo's archive, seized by the Regent.

### Room 7 — The Unopened Commendation *(SAFE ROOM)*
*(20 ft × 20 ft, a single small office)*

A Bureau middle-manager's office. A desk. A chair. A single sealed envelope on the desk, addressed in careful handwriting to a name that has been scrubbed away.

> **Read Aloud**: *"The envelope is warm. It has been warm for fifty years. The wax seal is Bureau Command. The addressee's name is gone. The sender's name reads: COMMANDER YI, BUREAU SEOUL DISTRICT, 1974. Beneath the name, in the same hand: 'Commendation for Valor — for pulling seventeen civilians out of a Gate Break that opened inside a primary school.' You turn the envelope over. It has never been opened."*

- **Mechanic**: The first PC to **read the commendation aloud** gains **+1 Rift Favor** immediately. The envelope dissolves into the Domain's air after 1 minute.
- **SAFE ROOM**: the party may take one short rest here. The Domain's ambient dread is paused inside this room. (Canon: *The Regent was once a person. Persons deserve to be remembered. The Domain itself pauses in this room.*)
- **Deity flavor**: Xylo + Solara. Xylo preserves the record; Solara's echo blesses the reading.

### Room 8 — The Diploma Wall
*(40 ft × 40 ft, walls lined with diplomas of every rank)*

Hundreds of framed certificates — Ascendant Academy diplomas, Bureau completion certificates, S-Rank verification papers. All of them have the same name blanked out. One of them, **near the center**, has a diploma that is BLANK on the name line — as if the name was never inscribed at all.

- **Puzzle**: If a PC writes ANY name on the blank line, the diploma becomes real — and the writing PC is compelled by the Domain to treat that name as the Regent's. For the rest of the campaign, that PC refers to the Regent by that name. *(This is a roleplay moment with zero mechanical effect, but it is the module's deepest Memorial-ending seed — the Regent was a person; now a player gave him a name back.)*
- **Drop**: **Sigil of the Sovereign's Will** (sigils.ts, sigil-presence-1) — behind the central diploma.
- **Narrative prop (inline, zero mechanics)**: The Diploma — canonical throne-room prop. Can be carried. If presented to Commander Park in the epilogue, unlocks the "Memorial" ending.
- **Deity flavor**: Xylo. Names are sacred. The Archivist records *everything*.

### Room 9 — The Child's Toy Room
*(30 ft × 25 ft, a child's bedroom frozen in amber)*

A Korean boy's bedroom, circa 1980. A bed. A desk with math homework half-done. Toys on the floor. A small wooden horse with one leg glued back on is on the nightstand. Every object is preserved under an invisible lattice — the party can see them but cannot take them.

> **Read Aloud**: *"The bedroom is full of the kind of silence that follows a door being closed by someone who did not want to wake a sleeping child. On the nightstand, a small wooden horse. Its right back leg has been broken and glued; the glue is still slightly tacky, as if the child fixed it this morning and then forgot about it. The amber lattice holds everything in place except one thing: a crayon drawing on the floor. It has been drawn by an adult hand, trying to remember how a child draws."*

- **Encounter** *(optional)*: If the party has ≥ 80% HP on entry, **1× Corrupted Celestial Phoenix (Humanoid)** (anomalies/rank-s.ts, anomaly-0015, downscaled) manifests from the crayon drawing. If the party is bloodied, the room is peaceful — the Domain is merciful when the party is already suffering.
- **Reward**: **Tattoo Voucher** — the crayon drawing, when folded, becomes a Vermillion Guild tattoo certificate. The bearer may exchange it with the Vermillion tattooist (\`tattoos.ts\`) for any single canonical tattoo regardless of Job.
- **Narrative prop (inline, zero mechanics)**: The Child's Toy — the small wooden horse. The amber lattice releases it if the party places **any other object** in its place. If carried to Ms. Park (SEAL ending), she weeps and says a name the players cannot hear; the Warden may grant +1 Rift Favor.
- **Deity flavor**: Xylo / Elara (stolen beauty). The amber lattice is Xylo's preservation; the composition is Elara's.

### Room 10 — The Archivist's Cell
*(25 ft × 25 ft, a circular stone vault)*

A circular vault, ceiling to floor. In the center, chained to the floor with chains of pure iron, is a figure that looks like an Eternal — a low-grade aspect of Xylo bound by the Regent to record his history. It is not hostile. It is *starving*.

> **Read Aloud**: *"The figure turns its head when you enter. Its face is paper, etched with thousands of lines of handwritten text. When it speaks, the letters on its face reorder themselves. 'I am Xylo's smallest record,' it says. 'He bound me here. He needs someone to remember him. I am too small for the job. Please. Take what you can carry. Read it aloud in a place where the wind can hear.'"*

- **Encounter**: **1× Eternal Celestial Herald (Beast)** (anomalies/rank-s.ts, anomaly-0020) — this is the **bound Xylo-aspect** fighting its chains. It is BOUND — it attacks the **iron chains**, not the party, unless attacked first. Warden's call: a party that talks to it first may free it for a massive reward. A party that attacks on sight fights an S-Rank Beast.
- **Drop** (if freed peacefully): **Regent's Shadow Dagger** (relics-comprehensive.ts) **OR** **Lightning Blade** (relics-comprehensive.ts) — the Xylo-aspect pulls one from its own chest. Party chooses.
- **Drop** (if killed): its body crumbles into 3 **A-rank runes** pulled from \`runes/spell-rank-a.ts\` (Warden picks).
- **Deity flavor**: Xylo's own suffering — a moment of pantheon sympathy. Treat this room as the module's moral hinge.
- **Exit**: Descending staircase to Floor −3.

---

## Floor −3 : The Throne

*The amber light gives way to arterial red. The walls are not paper here; they are something that remembers being flesh. Floor −3 is not a dungeon floor. It is the inside of the Regent's own concept of himself.*

### Room 11 — The Blood-Weaver's Gate
*(80 ft × 60 ft, a ritual chamber)*

A circular ritual chamber. The floor is inscribed with an Awoko ritual sigil the size of a football field, carved in living blood. At the center, The Hollow Mother's **presence** — she is not here yet unless she survived her own defeat elsewhere.

- **Encounter** *(Warden's choice)*:
  - If **The Hollow Mother** is still alive (Warden has been running the "inheriting the Regent" twist, Warden Secret: Hollow Mother's Plan): here is her Phase 1. Pull her loadout from \`sandbox-npcs.ts\` npc-awoko-001 + \`spells/rank-a.ts\` (Void / Necrotic S-tier) + \`techniques.ts\` Awoko rituals.
  - If The Hollow Mother is dead: **1× Corrupted Celestial Guardian (Demon)** (anomalies/rank-s.ts, anomaly-0025, full strength — this is Floor −3).
- **Drop**: **Abyssal Plate Armor** (relics-comprehensive.ts) — on The Hollow Mother's body OR beneath the Demon Guardian's throne.
- **Awoko relic**: **Sigil of the Crimson Weeping** (sigils.ts, sigil-bleeding-1) — scratched into the ritual sigil's center-stone; any PC may pry it out.
- **Deity flavor**: Marthos. The Dragon-King of Void is the author of every Anomaly that eats blood; this room is his.

### Room 12 — The Relic Vault
*(40 ft × 40 ft, a circular vault lined with reliquary boxes)*

A vault of personal effects. The Regent's life, curated and preserved. Reliquary boxes line the walls; most are empty — the party has already claimed their contents elsewhere in the campaign. One or two remain.

- **Reward**: Any **missing Regent Relic** (Void, Abyss, Blood) the party has not yet recovered is HERE. This is the module's safety net: if Chapter 24 Mana Reading placed a Relic in an unreachable location, this room closes the gap.
- **Also**: **Sigil of the Void-Walker** (sigils.ts, sigil-shadow-1) on a pedestal in the center. If *Sigil of the Shadow Regent* was NOT claimed in Room 3 (because it was already claimed at the Obsidian Spire), this is a second-best compensation.
- **Handout trigger**: If the party reads the small brass plaque above the pedestal, they find the inscription that cements the **Warden Secret: The Regent's Origin** canon reveal (the Warden may hand the handout to a player at this point, not just read it as Warden-secret). The plaque reads: *"To the man who walked into the Gate, from the wife who has not stopped waiting."*
- **Encounter**: None. This is a reward room.
- **Deity flavor**: Marthos + Xylo. The Dragon-King of Void keeps his trophies; the Archivist preserves them.

### Room 13 — The Army of the Unmoving
*(200 ft × 100 ft, a vast subterranean hall)*

Exactly as depicted in **Mika's First Drawing** *(canonical handout, \`sandbox-handouts.ts\`)*. Thousands of Anomalies, frozen mid-stride, standing in perfect rows. The memory-glass floor of Floor −2 was their ceiling. The party must cross their ranks to reach Room 14.

- **Skill challenge**: 3 successes before 2 failures on **DC 14 Sense (Stealth-adjacent) / DC 14 Agility (balance on glass shards) / DC 14 Presence (do not be seen grieving)** checks. Each PC contributes one check.
  - **Success**: the party crosses silently; the army does not wake.
  - **Failure**: **1× Eternal Celestial Serpent (Undead)** (anomalies/rank-s.ts, anomaly-0010) peels out of the formation. The rest do NOT wake — yet. If the party also fails to defeat the Serpent before a second PC rolls, a second Serpent joins.
- **Reward**: if the party crosses with **3 clean successes** (no failures), they gain **+1 Rift Favor** each.
- **Narrative prop**: The party may recognize, in the frozen ranks, Anomalies they previously killed in earlier Gates. The Regent remembers every Anomaly that ever manifested under his mana signature. They are all his.
- **Deity flavor**: Marthos. The Dragon-King commands armies; this is his reserve.

### Room 14 — The Widow's Chair *(SAFE ROOM)*
*(15 ft × 15 ft, a small octagonal chamber)*

An empty room with a single chair facing a throne-shaped indentation in the far wall. The chair is small, wooden, woven from dried seaweed and cold iron. It is **empty**.

- **Canonical tie-in**: If Ms. Park survived Day Zero (SEAL ending) and is at the S-Rank Gate's cordon (Dr. Hayashi's hunch), her wheelchair **manifests as an echo** in this chair. She is not here; her waiting is. The party may feel this — Warden narrates a warmth across the room.
- **Mechanic**: The party may take a short rest. In addition, each Regent-Marked PC gains advantage on their **first** save against the Regent's Phase 3 *Remembrance* attack. This stacks with all other advantages/canonical mechanics.
- **Handout**: If the party presents the **Faded Family Photo** to the empty chair, trigger the module's deepest narrative beat. Warden reads: *"The chair is no longer empty. Ms. Park is sitting in it, in a way that is not fully there. She looks at the photograph. She looks at you. She says: 'Thank you.' She is gone. The photograph is warm."* The Faded Family Photo now grants **advantage on the party's first saving throw against Remembrance** in Room 15.
- **Deity flavor**: Marthos paused. The Dragon-King respects unfinished grief — it is his oldest currency.

### Room 15 — The Throne *(HAND-OFF TO CHAPTER 16)*
*(The canonical Regent's Domain arena, per Chapter 16.)*

The party enters the throne room. This is the arena described in Chapter 16. All stats, phases, HP, and Relic interactions are as specified there. Do not re-stat.

**Megadungeon Hand-off Rules**:
1. **Phase 1 Shadow Soldiers** are drawn EXCLUSIVELY from \`shadow-soldiers.ts\`: Umbral Warrior, Umbral Scout, Umbral Archer, Umbral Mage, Umbral Assassin, Umbral Bulwark. Use the canonical table in Chapter 27 for the summon pool. Cap 10 active soldiers per Chapter 16 rules.
2. **Relic effects** unchanged — per Chapter 16's Relic table.
3. **Phase 3 Human Form** unchanged — the Regent's original human form reappears.
4. **Megadungeon preparation bonuses**:
   - If the party cleared **Room 2** and received the Missing Names file: at Phase 3, the Regent cannot use *Remembrance* against any PC whose file they read aloud during Room 2.
   - If the party completed the **Room 7** commendation ritual: the Regent begins Phase 1 with his *Shadow Army* ability on cooldown (rounds 1–2 no summon).
   - If the party completed the **Room 10** Xylo-aspect peaceful release: Dr. Hayashi's mana-relay reads the Regent's full original name aloud at the moment Phase 3 begins. The Regent's *Throne Strike* deals **half damage** for the first round of Phase 3. *(This is the Memorial-ending mechanical seed.)*
   - If the party brought the **Faded Family Photo** AND completed **Room 14** Widow's Chair ritual: advantage on the party's first save against *Remembrance*.
   - If the party has **Room 8**'s Diploma: at the moment the Regent falls, the Warden may offer the **Memorial Ending** — the Regent's name is restored to one single Bureau ledger, retroactively. Ms. Park, if alive, smiles for the first time in fifty years.
5. **Finale Reward**: pull from the **Finale Loot Slate** in Chapter 27.

## Post-Megadungeon

When the Regent falls, the Domain collapses. The party is ejected into the real world. The S-Rank portal dissolves. The city sees its first sunrise in fourteen days. The Bureau pays the 50,000,000 Credit bounty per canonical Chapter 22. The Warden chooses the ending epilogue based on which Megadungeon rooms' rituals the party completed.

**Possible endings** (Warden picks the dominant flavor):
- **Victory Ending** — standard. The Regent is dead. The city rebuilds.
- **Memorial Ending** — Room 8 Diploma + Room 10 Xylo peaceful release + Room 14 Widow's Chair ritual all completed. The Regent's name is restored. Ms. Park dies the same night, peacefully.
- **Sealing Ending** — Old Man Crane survives AND the party chose SEAL in Day Zero. The Regent is not destroyed; he is sealed inside a contained Gate (São Paulo precedent). The vessel sleeps. The party carries the knowledge.
- **Hollow Ending** — The Hollow Mother absorbed the Regent in Room 11 (Warden Secret twist). The new Regent wears her face. The campaign ends with the party deciding whether to fight her or withdraw.
- **Awakening Ending** — the party claimed all three Regent Relics + refused to destroy them + brought them out of the Gate. The Warden opens the sequel arc: the party is now carrying three Regent-tier anchors, and *something* is paying attention.

> **Design note**: the Megadungeon is deliberately **non-combat-heavy**. Four of the fifteen rooms have NO combat. This is intentional — the Regent's Domain is a CATHEDRAL, not a dungeon. The horror is the memory, not the fight. Parties that try to brute-force every room will run out of HP before Phase 3 and find themselves trying to finish an S-Rank Regent at half strength. That is the Solo-Leveling–scale trial this module has been building toward.
`,
	},
];
