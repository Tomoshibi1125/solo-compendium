import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 17-23
// Part III: Threats, Side Quests, Encounter Tables, Treasure, Warden's Guide
// ============================================================================

export const chaptersPart3: SandboxChapter[] = [
	{
		title: "Chapter 17: The Executioner — Roaming S-Rank Anomaly",
		content: `# The Executioner — Roaming S-Rank Anomaly

## Overview

The Executioner is a relentless S-Rank Anomaly that escaped from a Gate Break **before** the current Surge. It now roams the streets of the Restricted Zone freely — the only Anomaly that exists in the real world, not inside a Gate. It is the Strahd of this campaign: an ever-present threat that appears without warning and forces the party to run, hide, or die.

> **Read Aloud (First Sighting)**: *"You hear it before you see it — the scrape of something massive being dragged across asphalt. Then, at the end of the block, a shape rounds the corner. It's humanoid, twelve feet tall, wrapped in tattered darkness. Its arms end in blades of compressed shadow, each as long as a car. It has no face — just a smooth void where features should be. It stops. It tilts its head. It has found you."*

## The Executioner — Stats

> [!CAUTION]
> **The Executioner is NOT meant to be fought until the party is Level 8+.** Before that, it is a survival encounter. The goal is to ESCAPE, not to fight.

- **HP**: 200 | **AC**: 20 | **Speed**: 60 ft.
- Immune to psychic, necrotic, poison. Resistant to all non-magical damage.
- **Abilities**:
  - *Multiattack*: 3 blade arm attacks (+12 to hit, 3d8+6 slashing)
  - *Shadow Pursuit*: Can move through solid objects. Walls do not block it.
  - *Mana Sense* (Passive): Detects any creature using mana abilities within 300 ft.
  - *Relentless*: Cannot be slowed, restrained, knocked prone, or stunned.
  - *Executioner's Mark*: If the Executioner damages a target, that target is "marked." The Executioner can sense marked targets from anywhere in the district for 24 hours.

## Appearance Rules

**Every 24 in-game hours** (or whenever the party uses a powerful mana ability outdoors), the Warden rolls 1d20:
| Roll | Result |
|------|--------|
| 1 | The Executioner appears within 100 ft. of the party. |
| 2–3 | The party finds fresh evidence of the Executioner nearby (claw marks, destroyed Bureau patrol). |
| 4–20 | No encounter. |

**Modifiers**:
- +2 to the roll if the party is inside a building (harder to detect)
- −2 if the party just exited a Gate (mana signature is elevated)
- −4 if the party used an S-Rank ability or Regent Relic in the open

## Escape Rules

When the Executioner appears, initiative is rolled immediately. The party's goal is to **escape**, not fight.

- **Escape Condition**: All party members move 120+ ft. away from the Executioner AND break line of sight (enter a building, go underground, use concealment magic).
- **Complication**: The Executioner's 60 ft. speed means it gains ground fast. Dashing is essential.
- **Mana Silence**: If ALL party members suppress their mana (no abilities, no Runes, no magical items active) for 3 rounds, the Executioner loses their scent and wanders away.

## Defeating the Executioner

At Level 8+, the party CAN fight the Executioner. However:
- It has no loot (it's an escaped Anomaly, not a Gate boss)
- Killing it fulfills the Bureau's standing bounty (**5,000,000 Credits**)
- Commander Park personally commends the party, granting automatic **Bureau Allied** reputation
- The district becomes significantly safer — remove all street encounter rolls of 2 (Stray Anomaly)`,
	},
	{
		title: "Chapter 18: Side Quests of the Restricted Zone",
		content: `# Side Quests of the Restricted Zone

## Quest Board

The following side quests are available from various NPCs and faction boards throughout the campaign. Each quest has a trigger condition, objectives, and rewards.

---

### Quest 1: The Missing Strike Team
**Giver**: Commander Park (Bureau HQ)
**Trigger**: Available from Day 1
**Objective**: Find any survivors from Bureau Strike Team Seven, lost inside a Gate three days before the party arrived.
**Details**: Strike Team Seven entered the Frozen Citadel Gate and never returned. One member — **Ghost** — escaped but has amnesia. The others are either dead or frozen inside.
**Steps**:
1. Find Ghost in the Outer Slums area (DC 12 Investigation or ask Mama Chen)
2. Help Ghost recover memories (Dr. Voss can assist with a mana resonance scan — requires 1 C-Rank core)
3. Enter the Frozen Citadel Gate and locate Strike Team Seven's remains (Floor: Frozen Barracks)
**Rewards**: +1 Bureau reputation, 2,000 Credits, Ghost joins as NPC ally (Level 8, unknown Job — revealed as Stalker when memories return)

---

### Quest 2: Mother Rust's Breakthrough
**Giver**: Mother Rust (Vermillion Guild Hall)
**Trigger**: Available after clearing any C-Rank Gate
**Objective**: Bring Mother Rust a vial of 'living mana' from the Verdant Overgrowth Gate.
**Details**: The sap of the Heart Tree is the key ingredient for Mother Rust's Gate-closing compound.
**Steps**:
1. Enter the Verdant Overgrowth Gate
2. Reach the Heart Tree (Boss Chamber)
3. Collect Living Mana Vial (available as boss loot)
4. Return to Mother Rust
**Rewards**: +1 Vermillion reputation, Mother Rust joins as NPC ally, free B-Rank potion of choice

---

### Quest 3: The Cult Defector
**Giver**: Whisper / The Prophet (inside the Sunken Tunnels Gate)
**Trigger**: Encounter Whisper during the Sunken Tunnels exploration
**Objective**: Escort Whisper safely out of the Sunken Tunnels and to Bureau HQ.
**Details**: Whisper knows Nyx's plan to trigger simultaneous Gate Breaks. The Bureau needs this intelligence.
**Steps**:
1. Locate Whisper in the Awoko Forward Base (Sunken Tunnels)
2. Convince Whisper to defect (DC 14 Persuasion, or automatic if party has Bureau Trusted+)
3. Escort Whisper through the Gate without the other Cult members noticing (DC 14 group Stealth or combat)
4. Deliver to Commander Park
**Rewards**: +1 Bureau reputation, +1 Vermillion reputation (Orin respects the intel), Nyx's plan revealed (10 day deadline)

---

### Quest 4: Torch's Letter
**Giver**: Torch (Vermillion Guild Hall)
**Trigger**: Speak with Torch and ask about his family
**Objective**: Deliver Torch's letter to the Bureau perimeter and get it sent to his family outside the Restricted Zone.
**Details**: The Bureau controls all communications in and out. Relay Officer Reyes can send it — but will she without Bureau approval?
**Steps**:
1. Receive the letter from Torch
2. Bring it to Relay Officer Reyes (Bureau HQ)
3. Persuade Reyes (DC 12 Persuasion) or bribe (200 Credits) or get Commander Park's approval (Trusted reputation)
4. Return to Torch with confirmation
**Rewards**: Torch joins as NPC ally (free — no Credits required), +1 Vermillion reputation

---

### Quest 5: The Architect's Device
**Giver**: The Architect (Inside the Sunken Tunnels Gate)
**Trigger**: Discover the Architect's Workshop
**Objective**: Help the Architect complete the Gate Suppression Device.
**Details**: A mana-tech device that can prevent ONE Gate Break during the campaign.
**Steps**:
1. Deliver a B-Rank Anomaly core (from any B-Rank Gate boss)
2. Obtain schematics from Dr. Voss (requires 1 C-Rank tissue sample trade)
3. Fund raw materials (5,000 Credits)
**Rewards**: Gate Suppression Device (single use — prevents one Gate Break), The Architect joins as NPC ally

---

### Quest 6: Mika's Prophecy
**Giver**: Mika the Kid (roaming NPC — appears randomly during street exploration)
**Trigger**: Roll 10 on Street Exploration Table or find Mika sheltering in any Hub
**Objective**: Protect Mika and interpret their prophetic drawings.
**Details**: Mika is a child who draws things before they happen. Their latest drawings show the Regent manifesting through the S-Rank Gate.
**Steps**:
1. Find Mika and ensure their safety (bring to Mama Chen's shelter or Bureau HQ)
2. Collect 3 drawings from Mika over 3 days (Mika draws one per long rest)
3. Interpret the drawings (DC 14 Arcana per drawing — success reveals a gameplay hint from the Warden)
**Rewards**: 3 prophetic hints (Warden's choice — could be Relic locations, Cult plans, or Executioner patterns), Professor Lun offers to analyze the drawings further (+1 hint)

---

### Quest 7: Iron Belle's Challenge
**Giver**: Iron Belle (Vermillion Guild Hall — Fight Ring)
**Trigger**: Visit the Fight Ring
**Objective**: Defeat Iron Belle in single combat.
**Rules**: 1v1 unarmed combat. No abilities, no Runes, no weapons. Pure Athletics and Constitution.
- Best of 3 rounds: Each round is opposed Athletics check. Loser takes 1d8 bludgeoning. First to 0 HP or 3 losses is out.
**Rewards**: 1,000 Credits betting pool, +1 Vermillion reputation, Iron Belle's respect (will provide information about the district's underground fighting circuit, which the Cult uses for recruitment)

---

### Quest 8: The Civilian Convoy
**Giver**: Mama Chen (Outer Slums — her shelter)
**Trigger**: Visit Mama Chen's shelter
**Objective**: Escort 47 civilians from the Outer Slums to the Bureau perimeter for evacuation.
**Details**: The civilians have been sheltering in an apartment building, but food is running out. The Bureau perimeter is 6 blocks away — through territory where the Executioner has been spotted.
**Steps**:
1. Plan the route (3 options, each with different risk profiles)
2. Lead the convoy (6 blocks, roll for street encounters each block with +2 modifier for large group)
3. Manage panic if an Anomaly or the Executioner appears (DC 14 Persuasion to prevent stampede)
4. Reach the Bureau perimeter and hand off to soldiers
**Rewards**: +2 Bureau reputation (major), Mama Chen's eternal gratitude and a home-cooked meal (+5 temporary HP for next long rest)

---

### Quest 9: Acolyte Mara's Rescue
**Giver**: Sister Veil (Awoko Cult defector — found inside the Ashen Vault Gate)
**Trigger**: Encounter Sister Veil during Ashen Vault exploration (she is posing as a loyal Cult member)
**Objective**: Rescue Acolyte Mara from Blood Zealot Karn's custody.
**Details**: Mara tried to leave the Cult and was imprisoned. Karn plans to sacrifice her in the next ritual.
**Steps**:
1. Identify Sister Veil as a potential ally (DC 16 Insight or show her Dr. Voss's research)
2. Locate Mara's cell (Floor 12 of the Ashen Vault)
3. Free Mara (DC 12 Thieves' Tools or defeat the 2 Cult guards)
4. Escape the Ashen Vault with both NPCs
**Rewards**: +1 Bureau reputation (intelligence on Cult operations), Sister Veil + Acolyte Mara recruitable as NPC allies, Cult ritual disrupted (buys 2 extra days before Nyx's plan triggers)

---

### Quest 10: Ghost's Memory
**Giver**: Ghost (Outer Slums — after finding them in Quest 1)
**Trigger**: Complete "The Missing Strike Team" quest
**Objective**: Help Ghost recover their full identity.
**Details**: Ghost is an A-Rank Ascendant with amnesia. Their memories were suppressed by a Regent Relic's influence.
**Steps**:
1. Take Ghost to Dr. Voss for mana resonance therapy (3 sessions over 3 days)
2. Enter the Gate where Ghost was last stationed (Frozen Citadel) and find their equipment
3. Trigger memory restoration by returning Ghost's Bureau ID and weapon
**Rewards**: Ghost restored to full A-Rank power (Level 8 Stalker with A-Rank abilities), reveals classified intelligence about the Regent.

---

### Quest 11: Professor Lun's Theory
**Giver**: Professor Lun (Outer Slums academic)
**Trigger**: Discuss the Gate Surge with Professor Lun
**Objective**: Test Professor Lun's theory that the Gates are connected by underground mana veins.
**Details**: If true, disrupting the veins could weaken the S-Rank Gate.
**Steps**:
1. Enter 3 different Gates and plant mana sensors (DC 12 Arcana at each Gate's core/boss room)
2. Return data to Professor Lun
3. Accompany Lun to the S-Rank Gate perimeter for final measurements
**Rewards**: Confirmed intelligence (+1 Bureau reputation), the S-Rank Gate boss starts with -20 HP if mana veins are disrupted, Professor Lun provides an academic paper that grants advantage on Arcana checks related to Gates

---

### Quest 12: Rat-King Ji's Stash
**Giver**: Rat-King Ji (Vermillion Guild Hall)
**Trigger**: Reach Vermillion Trusted reputation
**Objective**: Retrieve Ji's hidden stash of Credits from a safe house in the Financial District.
**Details**: Ji hid 50,000 Credits in a safe house before the Restricted Zone was declared. The building is now within range of the Ashen Vault Gate's heat aura.
**Steps**:
1. Navigate to the Financial District safe house (2 street encounter rolls)
2. Enter the building (DC 12 Athletics — structurally compromised)
3. Locate the hidden safe (DC 14 Investigation)
4. Extract the Credits and escape before the building collapses (3-round countdown)
**Rewards**: Ji pays 10,000 Credits as a finder's fee, Ji joins as NPC ally, full Vermillion Bazaar inventory unlocked`,
	},
	{
		title: "Chapter 19: NPC Compendium — Ascendant Roster",
		content: `# NPC Compendium — Ascendant Roster

All 40+ NPCs in this module are detailed in the companion file **sandbox-npcs.ts**, which provides complete stat blocks, backstories, dialogue lines, recruitment conditions, and combat abilities for each character.

## Quick Reference Table

### Bureau Sentinels

| NPC | Level | Job | Rank | Recruitment Condition |
|-----|-------|-----|------|----------------------|
| Commander Park Jae-won | 8 | Vanguard | B | Complete 3 eradication quests + Bureau Trusted |
| Quartermaster Lin Mei-hua | 4 | Artificer | D | Vermillion Bazaar destroyed or conquered |
| Sergeant Yoon Hye-jin | 5 | Stalker | C | Find missing Strike Team Seven |
| Dr. Elara Voss | 6 | Sage | C | Bring 3 C-Rank+ tissue samples |
| Agent Kira Blackwood | 7 | Stalker | B | Bureau Trusted + complete her personal quest |
| Corporal Deng Wei | 4 | Destroyer | D | Show kindness after nightmare episode |
| Relay Officer Reyes | 3 | Herald | D | Help establish secondary mana relay |
| Warden-Aspirant Sato Ken | 2 | Striker | E | Volunteers immediately |

### Vermillion Guild

| NPC | Level | Job | Rank | Recruitment Condition |
|-----|-------|-----|------|----------------------|
| Rat-King Ji | 6 | Contractor | C | Vermillion Trusted + retrieve stashed funds |
| Vex "Quicksilver" | 7 | Assassin | B | Help eliminate High Priestess Nyx |
| Mother Rust | 5 | Alchemist | C | Bring living mana from Botanical Gate |
| Torch | 6 | Mage | C | 5,000 Credits or help send letter to family |
| Old Man Crane | 10 | Sage | S | Only joins for final Regent confrontation |
| Ash & Ember | 3 | Striker | D | Promise to find their brother |
| Guildmaster Orin | 9 | Contractor | A | Unite Bureau and Vermillion factions |

### Awoko Cult (Potential Defectors)

| NPC | Level | Job | Rank | Recruitment Condition |
|-----|-------|-----|------|----------------------|
| Whisper (The Prophet) | 5 | Esper | C | DC 14 Persuasion in Sunken Tunnels |
| Sister Veil | 6 | Holy Knight | C | Show Dr. Voss's research, DC 16 Persuasion |
| Acolyte Mara | 2 | Revenant | E | Rescue from Ashen Vault |

### Independents & Anomaly-Adjacent

| NPC | Level | Job | Rank | Location |
|-----|-------|-----|------|----------|
| Doc Tanaka | 4 | Herald | D | Outer Slums — underground clinic |
| Zara the Scrapper | 3 | Artificer | D | Outer Slums — junk workshop |
| Father Gregor | 5 | Holy Knight | C | Outer Slums — makeshift chapel |
| Mika the Kid | 1 | — (Civilian) | E | Roaming — prophetic child |
| Professor Lun | 6 | Sage | C | Outer Slums — academic |
| Ghost | 8 | Stalker | A | Outer Slums — amnesiac |
| Mama Chen | 3 | Vanguard | D | Outer Slums — civilian shelter |
| Jax the Runner | 2 | Striker | E | Bazaar — courier |
| Iron Belle | 7 | Destroyer | B | Bazaar — fight ring champion |
| The Architect | 7 | Artificer | B | Sunken Tunnels Gate — workshop |
| Echo-7 | 5 | Summoner | C | Verdant Overgrowth Gate |
| The Watcher | 8 | Esper | A | Obsidian Spire Gate — Floor 9 |
| Specimen X | 6 | Revenant | C | Drowned Ward Gate — basement |
| Lyra | 7 | Esper | B | Verdant Overgrowth Gate — canopy |
| The Archivist | 4 | Sage | D | Drowned Ward Gate — 3rd floor |
| Rex | 3 | — (Beast) | D | Hollow Subway Gate |

> **Note for Wardens**: NPCs recruited to the party should be run as simplified allies — they act on their own initiative, focus on supporting the party, and use 2-3 signature abilities rather than full character sheets. This keeps combat manageable while preserving the narrative weight of recruitment.`,
	},
	{
		title: "Chapter 20: Regent Relics & Gate Artifacts",
		content: `# Regent Relics & Gate Artifacts

## The Three Regent Relics

These artifacts are fragments of the Regent's own power, hidden within the Gates by whatever force originally imprisoned the entity. They are the keys to the final battle.

### Relic of the Void
*A sphere of absolute darkness, 6 inches in diameter, that devours light and sound within 10 feet.*

| Property | Effect |
|----------|--------|
| **Passive** | Wielder is invisible in darkness and dim light |
| **Active** (1/day) | Cast *Sphere of Annihilation* (30 ft. range, DC 16 Dex or 4d10 force) |
| **Curse** | Wielder cannot benefit from healing magic. Only rest and potions work. |
| **Final Battle** | Negates the Regent's Shadow Storm ability |

### Relic of the Abyss
*A crown of black iron that whispers promises of power to anyone within 30 feet.*

| Property | Effect |
|----------|--------|
| **Passive** | +2 to all saving throws. Wielder hears the Regent's thoughts (cryptic, unsettling). |
| **Active** (1/day) | Dominate an Anomaly of C-Rank or lower for 1 hour (no save) |
| **Curse** | Every long rest, DC 14 Wisdom save or the Regent speaks through the wielder in their sleep (reveals party plans to the Cult if Nyx is alive and has a Seer) |
| **Final Battle** | Negates the Regent's Shadow Step ability |

### Relic of Blood
*A dagger of crimson crystal that heals the wielder for damage dealt but drains life when held.*

| Property | Effect |
|----------|--------|
| **Passive** | +2 weapon, deals 2d6 necrotic. Wielder heals for half necrotic damage dealt. |
| **Active** (1/day) | *Blood Nova*: 30 ft. radius, 6d6 necrotic (DC 16 Con half), wielder heals for total damage dealt |
| **Curse** | Wielder loses 1 HP per round while holding it (cannot be mitigated). Must make DC 12 Wis save to voluntarily put it down. |
| **Final Battle** | Negates the Regent's Consume Shadow ability |

---

## Gate Boss Artifacts

Each Gate boss drops a unique Relic in addition to Anomaly cores. These are detailed in their respective chapters but summarized here:

| Gate | Boss | Artifact | Rarity | Effect |
|------|------|----------|--------|--------|
| Hollow Subway (E) | Shadow Crawler Matriarch | Shadow Silk Cloak | Uncommon | Advantage on Stealth in dim light |
| Drowned Ward (D) | The Head Surgeon | Surgeon's Precision Blade | Uncommon | +1 weapon, crits on 19-20 |
| Fungal Depths (D) | Mycelium Hive Queen | Hive Queen's Spore Sac | Uncommon | 1/day: 15 ft. poison cloud (DC 13) |
| Verdant Overgrowth (C) | The Bloom Tyrant | Bloom Tyrant's Heartwood | Rare | 1/day: Entangle (DC 14) |
| Ashen Vault (C) | The Ember Warden | Ember Warden's Flame Blade | Rare | +1 weapon, +1d6 fire |
| Sunken Tunnels (B) | Abyssal Leviathan | Leviathan Scale Shield | Rare | +2 shield, cold resistance |
| Frozen Citadel (B) | The Frost Sovereign | The Sovereign's Crown | Rare | Cold resistance, 1/day Flash Freeze |
| Obsidian Spire (A) | Spire Guardian | Obsidian Gauntlets | Very Rare | +2 melee damage, 2d6+Str unarmed |

---

## Miscellaneous Relics & Items

| Item | Source | Effect | Value |
|------|--------|--------|-------|
| Rune of Faint Warding | Hollow Subway treasure | +1 saves for 24h (single use) | 200 Credits |
| Rune of Searing | Ashen Vault safety deposit box | +1d6 fire on attacks for 24h | 500 Credits |
| Frost Rune Weapon (×3) | Frozen Citadel barracks | +1d4 cold per hit | 600 Credits each |
| Purified Mycelium Crystal | Fungal Depths spring | Rare crafting ingredient | 1,500 Credits |
| Living Mana Vial | Verdant Overgrowth Heart Tree | Quest item for Mother Rust | N/A |
| Fireproof Cloak | Ashen Vault boss | Fire resistance | 1,800 Credits |`,
	},
	{
		title: "Chapter 21: Anomaly Encounter Tables",
		content: `# Anomaly Encounter Tables

## How to Use

When the party travels between locations in the city or explores within a Gate, roll on the appropriate table. Each entry references a general Anomaly type — the Warden can substitute specific Anomaly IDs from the compendium for more detailed stat blocks.

---

## City Streets (Between Gates)

Roll 1d20 when traveling between locations:

| d20 | Encounter | Details |
|-----|-----------|---------|
| 1 | **The Executioner** | See Chapter 17. Full pursuit encounter. |
| 2-3 | **Gate Micro-Break** | A tiny Gate opens briefly. 1d4 E-Rank Shadow Crawlers spill out. Close automatically after 1 round. |
| 4 | **Mana Storm** | Violent mana fluctuation. DC 12 Con save or 2d6 force damage. Lasts 1d4 rounds. |
| 5 | **Cult Ambush** | 4 Awoko Cult Acolytes + 1 Cult Enforcer attack from rooftops. Flee if 3+ are killed. |
| 6 | **Bureau Checkpoint** | Bureau patrol demands identification. If carrying contraband Runes: DC 14 Deception or confiscation + Bureau −1. |
| 7 | **Vermillion Smugglers** | 3 Guild runners moving Anomaly cores. Will sell 2 cores at market rate. May offer a side job. |
| 8-9 | **Stray Anomaly** | 1 D-Rank Anomaly wandering the streets. Easy fight or DC 12 Stealth to avoid. |
| 10-14 | **No encounter** | Quiet streets. Eerie normalcy. |
| 15 | **Civilian Straggler** | A civilian who refused to evacuate. Help them reach the Bureau perimeter (+1 Bureau reputation) or ignore. |
| 16 | **Mana Crystal Deposit** | Crystallized mana growing on a surface. Worth 100-500 Credits. DC 12 Arcana to extract safely. |
| 17 | **NPC Encounter** | A random NPC from the roster is spotted. Social encounter opportunity. |
| 18 | **Gate Echo** | The party briefly sees through a Gate — a flash of the dimension inside. Warden describes a scene from an unvisited Gate. |
| 19 | **Equipment Cache** | A Bureau supply drop missed during evacuation. 2d4 mana rations + 1 random C-Rank item. |
| 20 | **Regent Whisper** | Every Ascendant hears the Regent's voice. DC 14 Wis save or gain a brief vision (Warden provides a plot hint). Failure also deals 1d4 psychic. |

---

## Inside E-Rank Gates

| d12 | Encounter |
|-----|-----------|
| 1-3 | 1d4 **Shadow Crawlers** (E-Rank, HP 12, AC 11, +3, 1d6+1 slashing) |
| 4-5 | 1d4 **Void Leeches** (E-Rank, HP 8, AC 10, +2, 1d4 necrotic + attach) |
| 6-7 | **Trap** — Pressure plate, trip wire, or mana glyph. DC 12 Perception, DC 12 Dex save, 2d6 damage. |
| 8-9 | **Environmental Hazard** — Unstable floor, toxic gas, flooding. DC 11 relevant save. |
| 10-11 | **Empty** — Signs of past combat. A corpse with 1d4 × 10 Credits. |
| 12 | **Treasure** — Hidden alcove with a minor Rune or 200 Credits. DC 13 Investigation. |

## Inside D-Rank Gates

| d12 | Encounter |
|-----|-----------|
| 1-2 | 1d6 **D-Rank Anomalies** (HP 18, AC 12, +4, 1d8+2 varied) |
| 3-4 | 1 **C-Rank Anomaly** (HP 35, AC 14, +5, 2d6+3 varied + special ability) |
| 5 | **Wandering NPC** — An NPC from the roster trapped inside the Gate. Rescue opportunity. |
| 6-7 | **Trap** — DC 13 Perception, DC 13 Dex/Con save, 3d6 damage. |
| 8-9 | **Puzzle** — Mana lock, sigil sequence, or environmental puzzle. DC 13 Arcana/Investigation. |
| 10-11 | **Loot Room** — 2d4 × 50 Credits, 1 D-Rank Anomaly core, minor item. |
| 12 | **Rare Spawn** — 1 C-Rank elite with extra HP and a guaranteed C-Rank Rune drop. |

## Inside C-Rank Gates

| d12 | Encounter |
|-----|-----------|
| 1-2 | 2d4 **C-Rank Anomalies** |
| 3 | 1 **B-Rank Anomaly** (HP 55+, tough fight) |
| 4-5 | **Cult Activity** — 1d4+2 Awoko Cult members performing a ritual. Combat or disruption. |
| 6 | **Environmental Catastrophe** — Collapsing ceiling, lava flow, flash flood. DC 14 Dex save, 4d6 on fail. |
| 7-8 | **Trap + Ambush** — Trap triggers, then Anomalies attack from concealment. |
| 9-10 | **Loot Chamber** — 2d6 × 100 Credits, 1 C-Rank core, 1 uncommon Rune. |
| 11 | **Safe Room** — An inexplicable pocket of calm. Short rest possible. |
| 12 | **Relic Fragment** — A shard of a Regent Relic. Collecting 3 from the same Relic type reveals its Gate location. |

## Inside B-Rank Gates

| d10 | Encounter |
|-----|-----------|
| 1-2 | 1d4 **B-Rank Anomalies** |
| 3 | 1 **A-Rank Anomaly** (extremely dangerous — consider flight) |
| 4-5 | **Elite Patrol** — 2 B-Rank Anomalies + 4 C-Rank minions working in coordination |
| 6 | **Trap Gauntlet** — 3 sequential traps, DC 15 each, 4d6 damage per trap |
| 7 | **Cult Stronghold** — Blood Zealot + 6 Acolytes. Major combat encounter. |
| 8-9 | **Treasure Hoard** — 2d8 × 200 Credits, 2 B-Rank cores, 1 rare Rune, 1 uncommon Relic. |
| 10 | **Regent Manifestation** — The Regent's shadow appears briefly. All creatures DC 15 Wis save or frightened for 1 minute. It speaks: a warning or taunt. |

## Inside A-Rank Gates

| d8 | Encounter |
|----|-----------|
| 1-2 | 1d4 **A-Rank Anomalies** (major combat) |
| 3 | **Mini-Boss** — Named A-Rank Anomaly with unique abilities. Drops rare Relic. |
| 4-5 | **Reality Distortion** — Gravity shifts, time dilates, or dimensions fold. DC 16 Wis save or disoriented. |
| 6 | **Mana Overload** — Extreme mana density. DC 15 Con save or all mana abilities cost double for 1 hour. |
| 7 | **Ancient Loot** — Very rare Relic, 4d6 × 500 Credits in pure Anomaly cores. |
| 8 | **Regent's Herald** — An Anomaly that speaks with the Regent's voice. Offers surrender. Refusing triggers combat with a B-Rank elite. |`,
	},
	{
		title: "Chapter 22: Treasure & Anomaly Core Values",
		content: `# Treasure & Anomaly Core Values

## Anomaly Core Economy

Anomaly cores are the primary currency of the Ascendant economy. When an Anomaly is defeated inside a Gate, it leaves behind a crystallized mana core that can be sold for Credits.

### Core Values by Rank

| Anomaly Rank | Core Value | Notes |
|-------------|------------|-------|
| E-Rank | 25 Credits | Common. Used for basic mana-tech. |
| D-Rank | 50 Credits | Standard. Most Guild raids target these. |
| C-Rank | 150 Credits | Valuable. Used in advanced Rune crafting. |
| B-Rank | 500 Credits | Very valuable. Guild Masters personally manage these. |
| A-Rank | 1,000 Credits | Extremely rare. National security interest. |
| S-Rank | 5,000+ Credits | Priceless. Governments bid on these. |

### Where to Sell

| Vendor | Rate | Restrictions |
|--------|------|-------------|
| Bureau Quartermaster | 100% (standard) | Legal and registered. Bureau reputation required. |
| Vermillion Guild (Rat-King Ji) | 150% | No registration. Illegal but profitable. |
| Mother Rust | 75% Credits OR full value in potion trades | Accepts any rank. Good for non-combat characters. |

---

## Gate Loot by Rank

### E-Rank Gate Loot

| Category | Typical Drops |
|----------|--------------|
| Credits | 100–300 per clear |
| Cores | 3–5 E-Rank, 1 C-Rank (boss) |
| Equipment | D-Rank weapons/armor, basic Runes |
| Relics | 1 uncommon Relic from boss |

### D-Rank Gate Loot

| Category | Typical Drops |
|----------|--------------|
| Credits | 300–800 per clear |
| Cores | 5–8 D-Rank, 2–3 C-Rank |
| Equipment | C-Rank weapons/armor, uncommon Runes |
| Relics | 1 uncommon Relic, crafting materials |

### C-Rank Gate Loot

| Category | Typical Drops |
|----------|--------------|
| Credits | 800–2,000 per clear |
| Cores | 5–6 C-Rank, boss C-Rank |
| Equipment | C-Rank enhanced weapons, rare Runes |
| Relics | 1 rare Relic, possible Regent Relic |

### B-Rank Gate Loot

| Category | Typical Drops |
|----------|--------------|
| Credits | 2,000–5,000 per clear |
| Cores | 4–5 B-Rank |
| Equipment | B-Rank weapons/armor, rare Runes/Sigils |
| Relics | 1 rare Relic, possible Regent Relic |

### A-Rank Gate Loot

| Category | Typical Drops |
|----------|--------------|
| Credits | 6,000–10,000 per clear |
| Cores | 6 A-Rank |
| Equipment | A-Rank weapons, very rare Runes |
| Relics | 1 very rare Relic, possible Regent Relic |

### S-Rank Gate Loot (Final Boss)
The Regent drops no cores. Its physical form dissolves into mana. However:
- The Bureau pays a **completion bounty of 50,000,000 Credits** (split among all surviving party members)
- Any remaining Regent Relics can be kept (extremely powerful but cursed)
- The Regent's Throne fragments can be harvested for 3 **Legendary Runes** (Warden's choice)

---

## Rune Drop Table (Roll when a Rune is found)

| d20 | Rune | Effect | Duration |
|-----|------|--------|----------|
| 1-4 | Rune of Warding | +1 to saving throws | 24 hours |
| 5-7 | Rune of Striking | +1 to attack rolls | 24 hours |
| 8-9 | Rune of Searing | +1d6 fire damage on attacks | 24 hours |
| 10-11 | Rune of Frost | +1d6 cold damage on attacks | 24 hours |
| 12-13 | Rune of Shadow | Advantage on Stealth checks | 24 hours |
| 14-15 | Rune of Vitality | +10 maximum HP | 24 hours |
| 16-17 | Rune of Haste | +10 ft. movement speed, +1 AC | 1 hour |
| 18-19 | Rune of Mana Shield | Resistance to one damage type (chosen when absorbed) | 8 hours |
| 20 | Rune of Ascension | +2 to one ability score | Permanent (consumed on use) |`,
	},
	{
		title: "Chapter 23: Warden's Guide to the Gate Surge",
		content: `# Warden's Guide to the Gate Surge

## Running This Sandbox

This chapter provides advice for Wardens on pacing, managing multiple Gates, handling faction dynamics, and scaling encounters.

## Pacing the Campaign

### The 14-Day Clock

The campaign has a built-in deadline: the S-Rank Gate opens on Day 14 (its Blue Phase is double-length due to its power). If the party hasn't cleared enough Gates and collected enough Relics by then, the finale becomes significantly harder.

**Recommended Pacing**:
| Day | Suggested Activity |
|-----|-------------------|
| 1–2 | Explore the district, meet NPCs, clear the E-Rank Gate |
| 3–4 | Clear D-Rank Gates, begin faction quests |
| 5–6 | Clear C-Rank Gates, deal with Cult interference |
| 7–8 | Clear B-Rank Gates, Executioner escalation |
| 9–10 | Clear A-Rank Gate, gather Regent Relics |
| 11–13 | Side quests, NPC recruitment, final preparations |
| 14 | Enter the S-Rank Gate — Final Battle |

**IMPORTANT**: This is a *suggestion*. The sandbox allows any order. Players who rush will face underleveled encounters. Players who dawdle will face Gate Breaks.

### Gate Break Consequences

If a Gate's 7-day Blue Phase expires without being cleared:

1. The Gate enters **Red Phase** — the portal turns crimson and expands.
2. **1d6+2 Anomalies** of the Gate's rank pour into the Restricted Zone streets.
3. The Anomalies attack anything they encounter — including NPCs in Hub locations.
4. Bureau soldiers attempt to contain them (they succeed for E-D rank breaks, struggle with C+, and fail at B+).
5. NPC casualties are possible. Major NPCs make DC 15 survival checks. Failure = death or critical injury.

**Warden Tip**: Don't kill NPCs gratuitously. Gate Breaks should feel consequential but not punitive. Injure NPCs, destroy shops, force relocations — these create drama without removing content.

## Faction War Triggers

At certain reputation thresholds, faction tensions boil over:

### Bureau vs. Vermillion Conflict
**Trigger**: Party reaches Trusted with one faction while the other is at Distrusted.
**Effect**: Armed confrontation at the Bazaar entrance. The party must mediate (DC 16 Persuasion), side with one faction (other drops to Hostile), or let them fight (both factions lose 1d4 NPCs each).

### Cult Escalation
**Trigger**: Day 7, or party disrupts 2+ Cult operations.
**Effect**: High Priestess Nyx accelerates her plan. The 10-day deadline for simultaneous Gate Breaks becomes a 7-day deadline (or 5-day if 3+ disruptions). Cult ambushes become more frequent (+2 to encounter rolls).

### The Alliance
**Trigger**: Party reaches Allied with BOTH Bureau and Vermillion.
**Effect**: The two factions join forces. Combined strike team available for the final battle. Commander Park and Guildmaster Orin put aside their differences. +3 NPC allies in the Regent's Domain.

## Scaling Encounters

### Party Size Adjustments

| Party Size | Adjustment |
|-----------|-------------|
| 3 players | Reduce Anomaly HP by 25%. Reduce number of enemies by 1. |
| 4 players | Standard — encounters as written. |
| 5 players | Increase boss HP by 25%. Add 1 additional minion to encounters. |
| 6 players | Increase boss HP by 50%. Add 2 minions. Increase save DCs by 1. |

### Difficulty Tuning

If the party is struggling:
- Have NPCs offer to join temporarily for specific Gates
- The Bureau provides free equipment (one tier above current)
- Reduce Gate boss HP by 20%

If the party is breezing through:
- The Executioner appears more frequently (lower the roll threshold)
- Cult interference increases — add Cult encounters inside Gates
- Gate bosses gain a new ability or phase

## Key Warden Reminders

1. **The city is the star.** Between Gate raids, play up the eerie normalcy. Traffic lights for nobody. A phone ringing in an evacuated apartment. A cat that won't leave.
2. **Gates are other worlds.** Every Gate portal leads to a completely different dimension. The subway portal leads to an infinite subway. The park portal leads to a jungle. Make each one feel alien.
3. **The Executioner is fear.** Don't make it predictable. Describe its approach from different directions. Have NPCs panic when they see its marks. Make the party dread rolling a 1.
4. **Factions have consequences.** If the party helps Vermillion, Bureau services degrade. If they go full Bureau, they lose access to the black market. Make them choose.
5. **The Regent is always watching.** Once the party enters B-Rank Gates, start describing subtle signs: shadows that move wrong, whispered words at the edge of hearing, dreams of a throne room.
6. **NPCs die.** If a Gate Breaks, roll for NPC survival. If a faction goes hostile, their NPCs become enemies. Make recruitment matter by making loss sting.

---

## Quick Reference: Gate Status Tracker

Use this table to track which Gates are active, their Blue Phase countdown, and whether they've been cleared:

| Gate | Rank | Blue Phase Start | Days Left | Status |
|------|------|-----------------|-----------|--------|
| Hollow Subway | E | Day 1 | 7 | ☐ Active |
| Drowned Ward | D | Day 2 | 7 | ☐ Active |
| Fungal Depths | D | Day 3 | 7 | ☐ Active |
| Verdant Overgrowth | C | Day 4 | 7 | ☐ Active |
| Ashen Vault | C | Day 5 | 7 | ☐ Active |
| Sunken Tunnels | B | Day 7 | 7 | ☐ Active |
| Frozen Citadel | B | Day 8 | 7 | ☐ Active |
| Obsidian Spire | A | Day 9 | 7 | ☐ Active |
| The Regent's Domain | S | Day 1 | 14 | ☐ Active |`,
	},
];
