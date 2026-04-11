import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 1-8
// Part I: The Modern World + First Gate
// ============================================================================

export const chaptersPart1: SandboxChapter[] = [
	{
		title: "Chapter 1: The Shadow of the Regent — Warden's Briefing",
		content: `# The Shadow of the Regent

## Campaign Overview

**The Shadow of the Regent** is a non-linear sandbox campaign for 3–6 Ascendants, taking characters from Level 1 to Level 10. It is set in a modern metropolitan city — a world of skyscrapers, coffee shops, rush-hour traffic, and glowing Gates that appear without warning on city streets.

This is a modern, functioning world — not a ruined one. The world is **normal**. People go to work. Trains run on schedule. The only difference is that Gates — shimmering portals to pocket dimensions filled with Anomalies — manifest randomly across the globe, and a profession of Awakened humans called **Ascendants** exists to clear them.

## The Gate Surge Crisis

Something unprecedented has happened. Over the past 72 hours, **nineteen Gates** of escalating Rank have appeared within a single district of the city. The Bureau of Ascendant Affairs has declared the district a **Restricted Zone** — a police cordon preventing civilians from entering — and has issued an emergency call for all available Ascendants.

The Bureau suspects these Gates are connected. A catastrophic mana signature has been detected deep within the highest-Rank Gate — one that matches the profile of a **Regent**, an entity of world-ending power. If the Gates are not cleared before they break, dozens of Anomalies will flood into the city simultaneously.

The Ascendants must clear these Gates one by one, from the lowest Rank upward, while investigating the source of the surge, navigating Guild politics, and preparing for a final confrontation with whatever is trying to manifest through the S-Rank Gate at the district's center.

## Running This Module

> **For Wardens**: This campaign is designed as a sandbox. Players choose which Gates to enter, which factions to support, and how to spend their downtime between raids. There is no fixed sequence — Ascendants can tackle Gates in any order within their Rank capability.

### Key Design Principles
- **The city is the hub.** Between Gate raids, players return to normal city life — resting at the Guild Hall, buying supplies at shops, meeting NPCs at restaurants and bars.
- **Gates are dungeons.** Each Gate is a portal to a self-contained pocket dimension with its own theme, Anomalies, boss, and loot.
- **Time pressure matters.** Every Gate has a 7-day Blue Phase timer. If not cleared, it enters Red Phase (Gate Break) and Anomalies pour into the real city.
- **Faction reputation shapes the story.** The Bureau, the Vermillion Guild, and the Awoko Cult each have agendas that react to player choices.

### Session 0 Checklist
- [ ] Determine party composition (recommend at least one tank Job and one support Job)
- [ ] Discuss tone: urban fantasy action with horror elements inside Gates
- [ ] Establish each Ascendant's reason for responding to the Bureau's emergency call
- [ ] Set expectations: some fights are meant to be fled from (The Executioner)

### Ascendant Creation Hooks
| Hook | Description |
|------|-------------|
| Bureau Conscript | You were ordered here. Refuse and lose your license. |
| Guild Raider | Your Guild smells profit. High-Rank cores are worth millions. |
| Survivor | You live in this district. Your apartment is inside the Restricted Zone. |
| Researcher | The Gate Surge is scientifically unprecedented. You must study it. |
| Vengeance | Someone you loved went into one of these Gates and never came out. |
| Awakened Rookie | You Awakened last week. The Bureau fast-tracked your deployment. |

---

## Milestone Leveling Guide

| Milestone | Level |
|-----------|-------|
| Complete first E-Rank Gate | 2 |
| Clear two D-Rank Gates | 3 |
| Earn faction reputation (any) to 'Trusted' | 4 |
| Clear first C-Rank Gate | 5 |
| Survive first Executioner encounter | 6 |
| Clear first B-Rank Gate | 7 |
| Obtain a Regent Relic | 8 |
| Clear the A-Rank Gate | 9 |
| Enter the S-Rank Gate (The Regent's Domain) | 10 |`,
	},
	{
		title: "Chapter 2: The Relic Divination",
		content: `# The Relic Divination

## The Three Regent Relics

Before the campaign begins, the Warden secretly determines where three powerful Regent Relics are hidden. These Relics are the key to the final confrontation — without them, the Regent is nearly invincible.

> **Read Aloud**: *"There are whispers among the senior Bureau analysts. Three artifacts of immense mana resonance have been detected somewhere within the Gate cluster. They call them Regent Relics — fragments of the entity's own power, scattered across the dimensional barriers like anchors holding it in place. Find them, and you hold the leash. Fail, and the Regent manifests unbound."*

## Relic Placement

The Warden rolls on the following tables to determine where each Relic is hidden. Each Relic must be in a **different** Gate.

### Relic of the Void (Negation)
*A sphere of absolute darkness that devours light and sound within 10 feet.*

Roll 1d4:
1. **The Hollow Subway** (E-Rank Gate) — Hidden in the phantom train's engine car
2. **The Drowned Ward** (D-Rank Gate) — Submerged in the deepest specimen tank
3. **The Fungal Depths** (D-Rank Gate) — Encased in crystallized mycelium near the Hive Queen
4. **The Verdant Overgrowth** (C-Rank Gate) — Suspended in the canopy by living vines

### Relic of the Abyss (Domination)
*A crown of black iron that whispers promises of power to anyone within 30 feet.*

Roll 1d4:
1. **The Ashen Vault** (C-Rank Gate) — Locked in the bank vault's deepest chamber
2. **The Sunken Tunnels** (B-Rank Gate) — Worn by the Abyssal Leviathan
3. **The Frozen Citadel** (B-Rank Gate) — Frozen into the throne of the Frost Sovereign
4. **The Obsidian Spire** (A-Rank Gate) — Offered as a bargain by The Watcher

### Relic of Blood (Sacrifice)
*A dagger that heals the wielder for damage dealt but drains 1 HP per round when held.*

Roll 1d4:
1. **The Sunken Tunnels** (B-Rank Gate) — On the Awoko Cult's altar
2. **The Frozen Citadel** (B-Rank Gate) — Clutched by a frozen S-Rank corpse
3. **The Obsidian Spire** (A-Rank Gate) — Guarded by The Watcher's constructs
4. **Vermillion Guild Hall** (Real World) — Guildmaster Orin has been hiding it

## Relic Effects in the Final Battle

| Relics Held | Effect on the Regent Boss Fight |
|-------------|--------------------------------|
| 0 | Regent has +500 temporary HP and regenerates 20 HP/round |
| 1 | Regent has +250 temporary HP and regenerates 10 HP/round |
| 2 | Regent has no bonus HP; regeneration reduced to 5 HP/round |
| 3 | Regent starts at half HP, no regeneration, vulnerability to all damage for 3 rounds |

## Divination Hints

Throughout the campaign, players can discover Prophecy Fragment handouts that hint at Relic locations. The Warden should distribute 2-3 of these during the first half of the campaign to give players direction without revealing exact locations.`,
	},
	{
		title: "Chapter 3: The City District",
		content: `# The City District — Restricted Zone

## Overview

The campaign takes place in the **Yongsan District** — a dense urban area of roughly 20 city blocks containing residential towers, commercial streets, a subway station, a hospital, a financial center, parks, and an old sewer network beneath it all. Before the Gate Surge, this was a normal, thriving neighborhood.

Now the Bureau has established a perimeter. Police barriers and mana-detection pylons surround the district. Civilians have been evacuated. Inside the cordon, the streets are empty but intact — cars still parked along curbs, neon signs still flickering, vending machines still humming. The only difference is the Gates: shimmering portals of light hovering at various points, each one a doorway to a different dimension.

> **Read Aloud**: *"The district looks almost normal from the barrier. Streetlights still work. A convenience store sign blinks 'OPEN 24H' to an empty sidewalk. But then you see them — the Gates. One floats above the subway entrance, a disc of pale blue light. Another pulses crimson between two apartment buildings. A third, barely visible, shimmers inside the lobby of the Hana Financial Tower. And in the center of it all, rising above the rooftops like a second sun, the massive S-Rank Gate throbs with violet energy so dense the air around it warps."*

## Travel Rules

Moving between locations within the Restricted Zone uses the following travel times on foot:

| From / To | Bureau HQ | Guild Hall | Subway Gate | Hospital Gate | Park Gate | Financial Gate | Sewer Access | S-Rank Gate |
|-----------|-----------|------------|-------------|---------------|-----------|----------------|--------------|-------------|
| Bureau HQ | — | 15 min | 10 min | 20 min | 25 min | 15 min | 20 min | 30 min |
| Guild Hall | 15 min | — | 20 min | 25 min | 10 min | 10 min | 15 min | 25 min |

### Street Encounters (d6, roll once per travel)
1. **Nothing** — Empty streets, distant Gate hum
2. **Stray Anomaly** — A D-Rank Anomaly from a recent micro-break. Combat or DC 14 Stealth to avoid.
3. **Bureau Patrol** — 4 Bureau soldiers. Verify credentials. Penalty if carrying contraband Runes.
4. **Vermillion Scouts** — 2 Guild runners offer to sell information (100 Credits)
5. **Awoko Graffiti** — Cult symbols painted on walls. DC 12 Investigation reveals a hidden cache (1d4 × 50 Credits)
6. **Gate Fluctuation** — A nearby Gate pulses. All Ascendants make DC 10 Constitution save or gain 1 level of Mana Fatigue.

## Gate Surge Mechanics

Every 3 in-game days, the Warden rolls on the **Gate Surge Table**:

| d8 | Event |
|----|-------|
| 1 | A new E-Rank Gate appears at a random location |
| 2–3 | An existing Gate advances one day on its Blue Phase timer |
| 4–5 | Mana storms — disadvantage on ranged attacks outdoors for 24 hours |
| 6 | The Executioner relocates (see Chapter 17) |
| 7 | Faction conflict — Bureau and Vermillion clash at a Gate site |
| 8 | The S-Rank Gate pulses — all Ascendants hear the Regent whisper their name |

## Mana Exposure

The district has elevated ambient mana due to the Gate cluster. Long rests taken without mana shielding (available at Bureau HQ or Guild Hall) require a DC 8 Constitution save. On failure, the Ascendant has vivid nightmares of the Regent and gains no benefit from the rest.`,
	},
	{
		title: "Chapter 4: Factions & Reputation",
		content: `# Factions & Reputation

Three major factions operate within the Restricted Zone. Each tracks the party's **reputation** on a five-tier scale that determines available quests, NPC attitudes, and story outcomes.

## Reputation Tiers

| Tier | Name | Effect |
|------|------|--------|
| -2 | Hostile | NPCs attack on sight. Faction sends kill squads. |
| -1 | Distrusted | No services. NPCs refuse to speak. Ambush chance on travel. |
| 0 | Neutral | Basic services. Standard prices. No special quests. |
| +1 | Trusted | Discounted prices (20%). Faction side quests available. NPC recruitment unlocked. |
| +2 | Allied | Free supplies. Faction-exclusive Relics. Faction leader joins final battle. |

## The Ascendant Bureau

> *"Order through regulation. Safety through strength."*

**Leader**: Commander Park Jae-won (Level 8 Vanguard)
**Base**: Bureau District Headquarters (modern office building, 4th floor converted to operations center)
**Goal**: Clear all Gates by the book, contain the Regent threat, maintain civilian safety

**Services at Trusted+**:
- Free D-Rank and C-Rank equipment requisition (1 item per Ascendant per day)
- Access to Bureau intelligence reports on Gate interiors
- Mana-shielded rest quarters (guaranteed safe long rests)
- Rank assessment — official Rank upgrades for completed Gates

**Reputation Changes**:
- +1 for completing a Bureau-assigned Gate clear
- +1 for turning in contraband Runes or illegal Sigils
- −1 for dealing with the Vermillion black market
- −1 for allowing a Gate Break

### Bureau NPC Dialogue

**Commander Park** (first meeting):
> *"I don't care what Guild you're from or what Rank the system gave you. Inside this perimeter, you follow Bureau protocols. Clear the Gates in order. Report your findings. Don't die — the paperwork is a nightmare."*

**Quartermaster Lin** (at the supply counter):
> *"D-Rank smoke grenades, mana rations, basic first aid. That's what I've got. You want the good stuff? Earn the Commander's trust."*

---

## The Vermillion Guild

> *"Credits talk. Everything else walks."*

**Leader**: Guildmaster Orin (Level 9 Tactician)
**Base**: Vermillion Guild Hall (renovated warehouse, Lower City commercial district)
**Goal**: Extract maximum profit from the Gate Surge — Anomaly cores, Relics, rare drops

**Services at Trusted+**:
- Black market access — Runes, Sigils, and contraband at 150% Bureau price but no restrictions
- Anomaly core appraisal and purchase (50% above Bureau rates)
- Intelligence on rival faction movements
- Access to Guildmaster Orin's personal armory (B-Rank equipment)

**Reputation Changes**:
- +1 for selling Anomaly cores exclusively to Vermillion
- +1 for completing a Vermillion bounty contract
- −1 for turning in contraband to the Bureau
- −1 for interfering with Vermillion smuggling operations

### Vermillion NPC Dialogue

**Rat-King Ji** (sizing up newcomers):
> *"You look like Bureau dogs. But Bureau dogs don't come to the Bazaar unless they need something the Bureau can't give them. So — what'll it be? I've got Runes that the Association banned last year and cores fresher than yesterday's Gate."*

**Guildmaster Orin** (in his office):
> *"I used to be Bureau. Eighteen years. Know why I left? Because when the Seoul Gate Breach happened, they spent three hours debating jurisdiction while people died. The Guild moves. The Bureau deliberates. Pick your side."*

---

## The Awoko Cult

> *"The Regent offers Ascension beyond the system. True power has no Rank."*

**Leader**: High Priestess Nyx (Level 9 Void Priestess)
**Base**: Mobile — currently operating from inside the Ashen Vault Gate (C-Rank)
**Goal**: Accelerate the Regent's manifestation. They believe the Regent will grant them power beyond the Rank system.

**Always hostile** unless players specifically infiltrate (Deception DC 18).

**Reputation Changes**:
- −1 for killing Cult members (yes, this makes them more hostile)
- +1 for sparing Cult defectors (Whisper, Sister Veil, Acolyte Mara)
- Rescuing Acolyte Mara provides intelligence on Cult operations (+1 Bureau reputation too)

### Cult NPC Dialogue

**High Priestess Nyx** (encountered in the Ashen Vault):
> *"You call yourselves Ascendants? You are leashed dogs begging the Bureau for scraps of power. The Regent does not rank. The Regent does not limit. When it manifests, those who served will rise. Those who resisted will burn."*`,
	},
	{
		title: "Chapter 5: Bureau District Headquarters",
		content: `# Bureau District Headquarters

## Overview

The Bureau has commandeered the fourth and fifth floors of the **Yongsan Federal Building**, a modern glass-and-steel office tower at the northern edge of the Restricted Zone. The lower floors remain empty — evacuated government offices with overturned chairs and abandoned paperwork. The upper floors hum with military precision.

> **Read Aloud**: *"The elevator doors open onto controlled chaos. Folding tables covered in maps and tablets line the corridors. Bureau agents in tactical gear move between stations, their mana-detection badges glowing faintly blue. A massive tactical mana-display dominates the central room — a 3D map of the district with each Gate marked as a pulsing orb of light, color-coded by Rank. Commander Park stands before it, arms crossed, watching the orbs like a general studying a battlefield."*

## Rooms & Features

### 4F — Operations Center
- **War Room**: Tactical Gate display. Commander Park briefs strike teams here.
- **Mission Board**: Posted Gate-clear assignments with Rank requirements and reward Credits.
- **Intel Desk**: Agent Blackwood's station. Locked files requiring Trusted reputation to access.

### 4F — Quartermaster's Office
- **Supply Counter**: Equipment requisition. See Quartermaster Lin.
- **Available Stock** (Neutral reputation):

| Item | Cost |
|------|------|
| Mana Ration (restores 2d4+2 HP) | 50 Credits |
| Smoke Grenade (20ft obscurement, 1 round) | 75 Credits |
| Glow Rod (bright light 30ft, 8 hours) | 25 Credits |
| Basic Mana Shield Charm (advantage on 1 mana save) | 200 Credits |
| D-Rank Weapon (standard) | 500 Credits |

- **Trusted+ Stock**:

| Item | Cost |
|------|------|
| C-Rank Weapon (enhanced) | Free (1/day requisition) |
| Anomaly Lure (attracts D-Rank Anomalies, 100ft) | Free |
| Bureau Tactical Armor (+1 AC, mana-shielded) | 1,500 Credits |
| Gate Compass (points toward nearest Gate entrance) | 750 Credits |

### 5F — Barracks & Rest Area
- **Mana-Shielded Quarters**: Long rests here always succeed (no mana exposure saves).
- **Mess Hall**: Corporal Deng cooks surprisingly good food. Morale bonus: +1 to first ability check after resting here.
- **Medical Bay**: Dr. Voss's lab. Heals all HP and removes conditions for free, but she'll ask for Anomaly tissue samples.

### 5F — Communications Room
- **Relay Officer Reyes**: Maintains contact with Bureau Central Command outside the Restricted Zone.
- **Available Service**: Send messages outside the perimeter (1/day). Cost: 100 Credits or a favor.

## Key NPCs Present

### Commander Park Jae-won
**Level 8 Vanguard** | Bureau Faction Leader
- Gives main quest assignments (Gate clears in priority order)
- Requires Trusted reputation to discuss the Regent intelligence
- **Personal Quest**: Find the missing Strike Team Seven (see Side Quests)

### Quartermaster Lin Mei-hua
**Level 4 Artificer** | Equipment & Supplies
- Joins the party if the Vermillion Bazaar is destroyed or conquered
- Has a hidden stash of B-Rank equipment she's saving "for emergencies"

### Dr. Elara Voss
**Level 6 Scholar** | Researcher
- Believes the Regent can be communicated with, not just destroyed
- Trades Anomaly tissue samples for free healing and mana analysis
- **Personal Quest**: Collect 3 unique tissue samples from C-Rank+ Anomalies

### Agent Kira Blackwood
**Level 7 Stalker** | Intelligence
- Arrived in the district before the Gate Surge — suspicious timing
- Provides intelligence on Cult movements at Trusted reputation
- **Personal Quest**: Her real mission is classified. Help her access a Gate alone.`,
	},
	{
		title: "Chapter 6: The Vermillion Guild Hall",
		content: `# The Vermillion Guild Hall

## Overview

A repurposed warehouse complex in the commercial district, three blocks south of the Bureau HQ. The Vermillion Guild converted it into a fully operational Guild Hall before the Restricted Zone was declared — they were already here, raiding Gates for profit when the Surge began.

> **Read Aloud**: *"The warehouse doors open to reveal something unexpected — not a military outpost, but a thriving market. Strings of fairy lights crisscross the high ceiling. Guild members in mismatched tactical gear haggle at stalls selling Anomaly cores, Runes, salvaged weapons, and street food. A neon sign reading 'VERMILLION' glows crimson above the far wall, where a metal staircase leads up to the Guildmaster's office. The air smells like grilled meat, ozone, and ambition."*

## Areas

### Ground Floor — The Bazaar
- **Core Exchange**: Sell Anomaly cores at 50% above Bureau rates. No questions asked.
- **Rune Vendor**: Sells Runes the Bureau has restricted. 150% standard price.
- **Food Stalls**: Street food vendors. 10 Credits for a meal that grants temporary HP (1d4) for 1 hour.
- **Fight Ring**: Iron Belle's domain. Bet Credits on fights or challenge her for reputation.

### Ground Floor — Bounty Board
Active bounties posted by Guildmaster Orin:

| Bounty | Target | Reward |
|--------|--------|--------|
| Gate Sweep | Clear any unassigned Gate | 500 Credits + core rights |
| Cult Hunter | Kill 5 Awoko Cult members | 1,000 Credits |
| The Big Score | Retrieve a B-Rank+ Relic from any Gate | 5,000 Credits |
| Specimen Capture | Bring a live C-Rank Anomaly to Mother Rust | 2,000 Credits |

### Upper Floor — Guildmaster's Office
- **Orin's War Room**: Less formal than the Bureau's. Maps covered in credit calculations.
- **Private Armory**: B-Rank weapons and armor. Allied reputation required.
- **Secret**: Orin possesses the Relic of Blood (if placement table result = 4). He doesn't know what it is — thinks it's just a valuable dagger.

## Key NPCs Present

### Rat-King Ji
**Level 6 Merchant** | Black Market Fence
- One eye replaced by an awakened eye — sees mana signatures through walls (partial Double Awakening side effect)
- Knows the location of one Regent Relic (sells the information for 3,000 Credits or a major favor)
- **Recruitment**: Reach Vermillion 'Trusted' + retrieve his stashed funds from the Financial District

### Vex "Quicksilver"
**Level 7 Assassin** | Guild Enforcer
- Absorbed a haste-Rune — moves at twice normal speed
- Partner was killed by the Awoko Cult. Wants revenge.
- **Recruitment**: Help eliminate High Priestess Nyx

### Mother Rust
**Level 5 Alchemist** | Potion Brewer
- Disgraced university chemist. Working on a compound to force-close Gates.
- **Services**: Brews custom potions from Anomaly parts. 200 Credits per potion.
- **Recruitment**: Bring a vial of 'living mana' from the Botanical District Gate

### Torch
**Level 6 Pyromancer** | Enforcer
- Pyrokinetic Ascendant. Gentle demeanor, devastating power.
- Protects the Bazaar from Cult infiltrators.
- **Recruitment**: Pay 5,000 Credits or help send a letter through the Bureau perimeter to his family

### Old Man Crane
**Level 10 Sage** | Retired S-Rank
- Known as the 'White Heron.' Veteran of twelve Gate clears including two S-Rank.
- Sits in the corner of the Bazaar, drinking tea and observing.
- Will share lore about Regents if approached respectfully (no check required).
- **Recruitment**: Only joins for the final Regent confrontation. Will not enter any other Gate.

> **Old Man Crane** (when asked about the Regent):
> *"I've seen three Regents in my career. Killed two. The third one killed my entire strike team and I ran. That was thirty years ago and I still dream about it. Whatever's behind that big Gate in the center of the district — it's worse than all three of mine combined. I can feel it from here."*`,
	},
	{
		title: "Chapter 7: The City Streets — Between Raids",
		content: `# The City Streets — Between Raids

## Downtime in the Restricted Zone

Between Gate raids, the Ascendants exist in a strange limbo — a modern city district that functions mechanically (electricity still works, plumbing still runs, vending machines still dispense) but has been emptied of civilian life. The streets are theirs.

> **Read Aloud**: *"Rain patters on the empty sidewalk. A crosswalk signal changes from red to green for no one. Your boots echo through a district designed for fifty thousand people, now home to maybe two hundred Ascendants, a handful of Bureau soldiers, and whatever leaks out of the Gates. A cat watches you from a fire escape — the only civilian that refused to evacuate."*

## Downtime Activities

Between raids, each Ascendant can perform **one downtime activity** per day:

### Rest & Recovery
Take a long rest at Bureau HQ (mana-shielded, guaranteed) or sleep rough in an abandoned building (DC 8 Constitution save against mana nightmares).

### Shop
Visit Bureau Quartermaster or the Vermillion Bazaar. See Chapters 5 and 6 for stock.

### Train (DC 15 relevant ability check)
- **Success**: Gain advantage on your next ability check of that type during a Gate raid
- **Failure**: No benefit, but you notice something about the district (Warden provides a rumor)

### Gather Information (DC 12 Investigation or Persuasion)
- **Success**: Learn one of the following (Warden's choice based on current plot):
  - Location hint for a Regent Relic
  - Cult activity report (upcoming Cult operation)
  - Gate interior intelligence (advantage on first encounter in a specific Gate)
- **Failure**: Hear a false rumor (Warden invents misleading information)

### Craft (requires appropriate Job or Proficiency)
- Alchemists/Artificers can craft potions or devices from Anomaly parts
- Crafting time: 1 day for D-Rank items, 2 days for C-Rank, 4 days for B-Rank
- Materials: Anomaly cores + 50% of item's Credit value

### Explore the District
Wander the empty streets. Roll on the **Street Exploration Table**:

| d10 | Discovery |
|-----|-----------|
| 1 | **Abandoned Apartment**: 2d6 × 10 Credits in a nightstand drawer |
| 2 | **Stray Cat Colony**: A dozen cats in an alley. One wears a collar with a key. (Key opens a locker in the subway station containing a C-Rank Rune) |
| 3 | **Gate Echo**: A micro-Gate flickers briefly. DC 14 Arcana reveals it connects to the Regent's Domain |
| 4 | **Cult Dead Drop**: An Awoko Cult message hidden in a mailbox. Intel on their next ritual (share with Bureau for +1 reputation) |
| 5 | **Vending Machine Jackpot**: Free snacks. Heal 1d4 HP. |
| 6 | **Graffiti Map**: Someone has spray-painted a crude map of Gate locations with danger ratings. Accurate. |
| 7 | **Echo of Normal Life**: A TV in a restaurant window is still playing the news. The outside world has no idea how bad it is inside the perimeter. |
| 8 | **Mana Crystals**: Crystallized mana growing on a fire hydrant. Worth 200 Credits to Mother Rust. |
| 9 | **Bureau Surveillance Camera**: You realize the Bureau is watching the streets. Commander Park sees everything. |
| 10 | **The Executioner's Trail**: Claw marks four inches deep in a concrete wall. The Executioner was here recently. DC 14 Survival to determine direction of travel. |

## City Atmosphere Notes (for Wardens)

Emphasize the **uncanny normalcy**. The horror is not ruins and rubble — it's a perfectly intact modern city with nobody in it. Traffic lights change for empty intersections. A phone rings inside an evacuated apartment. Laundry still hangs on a balcony. The Gates hover silently at their fixed points, casting faint colored light on the buildings around them, and sometimes you can hear sounds coming from inside — distant roars, crashing water, howling wind — leaking through the portal into the silent city streets.`,
	},
	{
		title: "Chapter 8: Gate — The Hollow Subway (E-Rank)",
		content: `# Gate: The Hollow Subway (E-Rank)

## Gate Information
- **Rank**: E
- **Location**: Portal hovering above the Yongsan-gu Subway Station entrance
- **Portal Appearance**: A pale blue disc of light, 3 meters in diameter, humming at a low frequency
- **Blue Phase Timer**: 7 days from campaign start
- **Recommended Level**: 1–2

## Entering the Gate

> **Read Aloud**: *"You step through the portal and the modern city vanishes. You're standing on a subway platform — but wrong. The ceiling stretches impossibly high into darkness. The tracks extend in both directions into infinite blackness. Fluorescent lights flicker in a rhythm that feels almost like breathing. A departure board clicks through destinations that don't exist: VOID TERMINAL, DEEPSTATION, THE END OF THE LINE. A distant train horn echoes from somewhere far below."*

The Gate interior is a warped, endless subway system. It follows subway logic — platforms, tracks, tunnels, maintenance corridors — but the geometry is wrong. Stairs lead down when they should lead up. Tunnels loop back on themselves. The departure board occasionally displays messages from the Gate's boss.

## Key Areas

### Platform Alpha (Entry Point)
- Safe area. No Anomalies spawn here.
- **Loot**: A vending machine on the platform dispenses actual items. Insert 10 Credits: roll d6 for result (1-3: mana ration, 4-5: glow rod, 6: C-Rank smoke grenade).
- **Clue**: Graffiti on the wall reads *"DON'T RIDE THE PHANTOM TRAIN"* in dried blood.

### The Tunnels (Exploration)
- Three tunnel routes extend from Platform Alpha.
- **Tunnel A (Left Track)**: 4 Shadow Crawlers (D-Rank Anomalies) lurk in maintenance alcoves.
  - DC 12 Perception to spot them before they attack.
  - Each drops 1 Anomaly core (50 Credits each).
- **Tunnel B (Right Track)**: Flooded tracks. Waist-deep water. Movement at half speed.
  - 2 Void Leeches (E-Rank) attack from the water.
  - At the end: a maintenance room with a functioning mana relay beacon. Activating it (DC 10 Arcana) reveals all remaining Anomaly locations on the VTT map.
- **Tunnel C (Service Corridor)**: Locked door (DC 14 Thieves' Tools or DC 16 Strength to force).
  - Contains a Bureau supply cache: 2 mana rations, 1 basic weapon upgrade kit, a hand-drawn map of the lower level.

### Lower Level — The Phantom Platform
- Reached via a broken escalator (DC 10 Athletics to descend safely; failure = 1d6 fall damage).
- A spectral train sits on the tracks, doors open, lights flickering inside.
- **DO NOT BOARD THE TRAIN**. If players board, the doors close and the train accelerates into darkness. All passengers take 3d6 psychic damage and are deposited back at Platform Alpha (the train loops).
- **Treasure**: In the conductor's booth (accessible from the platform, not by boarding): a locked strongbox (DC 12 Thieves' Tools) containing 200 Credits and a **Rune of Faint Warding** (+1 to saving throws for 24 hours, single use).

### Boss Chamber — End of the Line
- The tunnels converge at a massive underground cavern where the tracks end at a wall of darkness.
- Boss: **The Shadow Crawler Matriarch** (C-Rank Anomaly)

#### Boss: Shadow Crawler Matriarch
- **HP**: 45 | **AC**: 13 | **Speed**: 40 ft., climb 30 ft.
- **Abilities**:
  - *Multiattack*: 2 claw attacks (+5 to hit, 1d8+3 slashing)
  - *Shadow Spawn* (Recharge 5-6): Summons 2 Shadow Crawler minions (10 HP each)
  - *Darkness Shroud* (1/day): 20 ft. radius darkness centered on self, lasts 1 minute
- **Tactics**: Uses Darkness Shroud immediately, attacks from inside it. Spawns minions to divide party attention.
- **Weakness**: Bright light (glow rods, torch abilities) dispels Darkness Shroud if source is within the area.

#### Loot
- 3 C-Rank Anomaly cores (150 Credits each)
- **Regent Relic of the Void** (if placed here by divination)
- **Shadow Silk Cloak** (uncommon Relic): Advantage on Stealth checks in dim light. Worth 800 Credits.

## Gate Clear

> **Read Aloud**: *"The Matriarch shrieks and dissolves into wisps of shadow. The oppressive darkness lifts. The subway system groans, its geometry straightening, tunnels shortening as the pocket dimension begins to collapse. The portal back to the real world brightens at Platform Alpha. You have roughly one hour to gather your loot and exit before the Gate closes permanently."*

After clearing, the Gate in the real world fades within 1 hour. The subway station underneath returns to normal — mundane, functional, and entirely ordinary. Bureau teams will arrive to verify the clear and log it officially.`,
	},
];
