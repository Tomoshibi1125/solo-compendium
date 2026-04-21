import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 31-33
// Part VII: Outer Slums keyed locations • Mana Vein nodes • Awoko Sanctum
// ============================================================================
// Every encounter draws from anomalies/rank-*.ts and shadow-soldiers.ts.
// Every NPC is canonical (sandbox-npcs.ts). Every drop name-links the
// compendium (sigils.ts, tattoos.ts, relics-comprehensive.ts, artifacts.ts,
// spells/, techniques.ts, powers.ts, runes/).
// ============================================================================

export const chaptersPart7: SandboxChapter[] = [
	{
		title: "Chapter 31: The Outer Slums — Keyed Locations",
		content: `# The Outer Slums — Keyed Locations

> *"The Bureau draws its cordon with a red pencil. The Slums live outside the pencil."*
> — Graffiti on the west wall of the Yongsan Federal Building

## Overview

The **Outer Slums** are the neighborhoods that lived in the Restricted Zone before the cordon went up — tenement blocks, a shuttered shipyard, a covered market, a defunct train depot. Bureau evacuation was imperfect. An estimated 1,200 civilians are still here, either unable to leave or refusing to. Every location in this chapter is keyed for **encounter**, **NPC interaction**, and **loot**, all pulled from existing canon.

**Deity Alignment**: The Slums belong to **Lyra (The Queen of the Swarm)** — whose portfolio is *evolution, survival, adaptation*. The Bureau hates that the Slums still function. Vermillion respects it. The Awoko Cult *recruits* here.

**Random Encounter Roll**: in the Slums, roll on Chapter 33's **Slums Day/Night** tables when crossing neighborhoods. Encounters pull from \`anomalies/rank-d.ts\` and \`anomalies/rank-c.ts\`.

---

## Location 1 — Mother Rust's Outreach Post
*(Tenement courtyard, second story)*

Mother Rust (canonical, Vermillion Guild) runs a **civilian aftercare clinic** out of the second floor of a water-damaged tenement. She treats Gate-exposed survivors free of charge. She is also, quietly, recruiting for her more-morally-flexible compounds.

- **NPC**: **Mother Rust** (when not at the Guild Hall). Canon Ref: \`sandbox-npcs.ts\`.
- **Services**:
  - **Free Gate-Rot cleansing** — anyone afflicted by Gate-adjacent disease receives care here with no reputation gate.
  - **Anomaly core donation** — the party may donate Anomaly cores for civilian medicine synthesis. **+1 Vermillion reputation per B-Rank+ core donated.**
- **Canonical hook**: if the party chose **SEAL** in Day Zero, Ms. Park was brought to this outreach post. She is in a wheelchair, mostly lucid, sometimes not. She does not remember the party. She remembers what happened.
- **Awoko risk**: Rust's Black Tincture customers are being watched by an **Awoko Seeker** from across the courtyard. DC 14 Sense on first visit to spot her.
- **Deity flavor**: Lyra + Marthos. Rust's care is Lyra's adaptation; her drift is Marthos's slow poisoning.

## Location 2 — The Covered Market *(Neutral Trade Zone)*
*(Yongsan Open-Air Market, half-collapsed tin roof)*

A bustling ruin. Vendors selling whatever didn't burn. Bureau police politely refuse to enter; Vermillion patrols the perimeter without interfering. Cult recruiters work the edges.

- **NPCs** *(rotating, named encounters)*:
  - **Torch** — Mage, level 6 (canonical). Selling cold-burning charcoal that he does not own. Potential recruit per Chapter 18 Quest 4.
  - **Ash & Ember** — Strikers, level 3 (canonical twin NPCs). Looking for their missing brother. Recruitment chain starts here.
  - **Unnamed Cult Seeker** — a D-Rank Awoko Cult operative working the edges. Recruits the bereaved. Encounter: Investigation DC 14 to notice her.
- **Services**:
  - **Anomaly core black-market** — vendors pay 175% Bureau rate (better than Vermillion's 150%) but most deny knowing what they're trading.
  - **Rumor mill** — 1d4 rumors per visit, roll on a Warden table. Free.
  - **Random handout** — one civilian NPC hands the party a handwritten note matching one of the Warden-side handouts from \`sandbox-handouts.ts\` (Warden's pick based on campaign state).
- **Combat risk**: DC 15 Sense to spot a **level 4 Awoko Infiltrator** *(anomalies/rank-c.ts Humanoid)* shadowing the party.
- **Deity flavor**: Lyra + Nyx. Survival market; predators buy and sell alongside prey.

## Location 3 — The Shuttered Shipyard *(Mana Vein Node 1)*
*(Yongsan River industrial zone)*

A dry-docked container ship, rusted, listing. A **Mana Vein** runs directly beneath the hull — one of the three in the Restricted Zone (Chapter 24 Mana Reading Card 6 / Professor Lun's detonator rigs).

- **Encounter** *(canonical)*:
  - **1× Gate-adjacent Beast swarm** — use *Mycelium Swarm* stat block from \`anomalies/rank-d.ts\` (closest Beast-type).
  - If Professor Lun has not yet placed his mana-vein sensor: a **D-Rank Elemental Construct** (anomalies/rank-d.ts) is nesting in the vein overflow.
- **Puzzle**: install Professor Lun's sensor (if the party has taken his Downtime side-quest). DC 14 Intelligence (Mana Engineering). Success: the sensor is placed; the Warden marks **Vein Node 1 ACTIVE**.
- **Reward (post-install)**:
  - **Sigil of the Mana Font** (\`sigils.ts\` sigil-mana-regen-1) — affixed to the sensor housing, collectable on Warden's call.
  - Access to **Lun's Mana Vein Detonator ability** in Chapter 16 (the Regent starts the fight with −60 HP per canonical Chapter 24 Card 6 Option 10).
- **Deity flavor**: Sylph. Sylph is the Mistress of Gates; mana-veins are her bloodstream.

## Location 4 — The Train Depot *(Mana Vein Node 2)*
*(Defunct commuter rail station, sub-basement)*

An abandoned train depot. The sub-basement has a **Mana Vein** running through the old signal room. Phantom subway sounds echo despite the tracks being cold for fourteen days.

- **Encounter**:
  - **1× Umbral Warrior** + **2× Umbral Scouts** *(canonical, shadow-soldiers.ts)* — the Regent's influence already reaches here.
  - If combat is avoided: phantom passengers — ghostly Gate-victims boarding trains that never come. No mechanical effect; pure atmosphere.
- **Puzzle**: second mana-vein sensor installation (same DC 14 Intelligence as Node 1). Success: mark **Vein Node 2 ACTIVE**.
- **Reward (post-install)**:
  - **Sigil of the Grounded Soul** (\`sigils.ts\` sigil-res-lightning-1).
  - One **B-Rank rune** from \`runes/technique-techniques.ts\` embedded in the signal room floor plate.
- **Handout hook**: a Bureau clipboard in the signal room contains **Strike Team Seven's original deployment roster**. Canonical connection to the existing *Final Transmission: Strike Team Seven* handout.
- **Deity flavor**: Sylph + Cipher. Gate-winds and the cold of unreceived passengers.

## Location 5 — The Shuttered School *(Civilian Aftercare)*
*(Elementary school, makeshift civilian shelter)*

The Bureau evacuated most students. Some remained; some were forbidden to leave. The school's gym is now a shelter where fifty civilians — mostly children and elderly — sleep under donated blankets.

- **NPC**: **Mika the Kid** — canonical, child, age ~7. Receives **Mika's First Drawing** handout here. Mika draws the future.
- **NPC**: **Father Gregor** — Herald, level 4 (canonical). Runs interfaith services in the gym on Sundays. Potential Cult-front per Chapter 24 Card 5 Option 9.
- **Services**:
  - Drop-off charity — donating 500 Credits or any consumable from \`items-part7.ts\` grants +1 Bureau OR +1 Vermillion reputation (party's choice).
  - Mika's drawings — each visit, Mika has drawn a new picture. Warden picks what the picture foreshadows (the Regent's domain, a betrayer, an unvisited Gate, etc.).
- **Handout**: **Mika's First Drawing** (canonical).
- **Cult risk**: Father Gregor's sermons, analyzed closely (DC 16 Sense), reveal Awoko doctrinal phrasing. Gregor is canonically a Cult conditioning front per Chapter 24.
- **Deity flavor**: Elara. The Aesthetic Harmony preserves beauty worth fighting for — Mika's drawings, the children, the stubborn civilian shelter.

## Location 6 — Old Man Crane's Teahouse
*(Converted second floor of a noodle shop)*

A small teahouse with four tables, three customers (always the same three), and a view of the S-Rank portal hanging in the sky. **Old Man Crane** holds court here when he is not drinking tea in the Bazaar.

- **NPC**: **Old Man Crane** — S-Rank retired, level 10 Esper (canonical). *"White Heron."*
- **Services**:
  - **Regent lore** — Crane will share his Seoul Cascade 2019 and São Paulo 2021 memories with any party that shows him respect. No check required.
  - **Handout**: **Old Man Crane's Gate Raid Journal** (canonical).
  - **Sealing technique instruction** — at **Bureau Trusted**, Crane teaches the São Paulo sealing technique. This unlocks the **Sealing Ending** path for Chapter 28 Room 15. *The technique uses a specific \`techniques.ts\` S-tier entry — Crane's "Seal" — but cannot be used by the party directly; only through Crane's sacrifice per Chapter 24 Ally card Option 7.*
- **Deity flavor**: Solara + Vaelen. The White Heron prays to both — the small mercy and the hard trial.

---

## Slum-Wide Systems

**Curfew**: after 2200, the Bureau enforces a civilian curfew. Vermillion quietly rejects it. The Awoko Cult openly violates it. Parties crossing the Slums after curfew roll on the **Night** encounter table (Chapter 33).

**Civilian Rescue Quota**: the Bureau tracks how many civilians the party has escorted to safe zones. Each 5 civilians = +1 Bureau reputation. Each civilian the party fails to protect during a Gate Break = −1 Bureau reputation.

**Pantheon Shrines**: throughout the Slums, small unofficial shrines appear. Each grants a one-time mechanical benefit if tended (100 Credits offering):
- **Solara shrine** (sunrise bronze sparrow) — reroll one failed save.
- **Vaelen shrine** (white-flame candle) — advantage on one Strength or Agility save.
- **Lyra shrine** (vial of living mana) — +5 temp HP.
- **Cipher shrine** (ice-etched plaque) — advantage on one Sense save.
- **Marthos shrine** *(defaced, Cult-adjacent)* — offerings taint: the party's next Sense save has disadvantage. Worth noting; never tend.

> **Warden note**: the Cipher, Lyra, Solara, and Vaelen shrines are legitimate. The Marthos shrine is a trap. Players should learn to identify Cult-adjacent spaces by Chapter 10 or so.
`,
	},
	{
		title: "Chapter 32: Mana Vein Network & The Third Node",
		content: `# Mana Vein Network & The Third Node

> *"Gates are not wounds in the world. They are the world's attempts to vomit out something it ate by mistake."*
> — Dr. Serin Hayashi, informal letter to Professor Lun

## Overview

The Restricted Zone sits atop **three Mana Veins** — natural conduits of ambient mana that run through the earth's crust. The Veins are why the Gate Surge happened HERE, not elsewhere. Professor Lun's canonical Chapter 24 / Chapter 16 ability (detonating all three sensors = Regent starts with −60 HP) depends on the party placing sensors in all three nodes.

**Nodes 1 and 2** are keyed in Chapter 31 (Shipyard, Train Depot). **Node 3** — the most dangerous — is keyed here.

---

## Node 3 — The Hana Financial Tower Sub-Basement
*(Underneath the Ashen Vault Gate, 6 levels below street)*

The Hana Financial Tower houses the **Ashen Vault C-Rank Gate** on its 15th floor. Few know the tower also sits atop **Mana Vein Node 3** — the deepest and most active of the three. The sub-basement (6 levels below street) is where Bureau black-site researchers were studying the vein before the Surge cut them off.

**Access**:
- The tower's public elevators are disabled.
- Service stairwell accessible from the adjacent subway tunnel; DC 14 Investigation to find.
- Bureau override code — available at **Bureau Trusted** if the party asks Commander Park directly.

### Sub-Basement Keyed Rooms (3-Room Mini-Dungeon)

#### SB-1 — The Security Checkpoint
An unmanned Bureau security checkpoint. An automated turret pivots at movement.

- **Encounter**: **Bureau Security Turret** (use *Defensive Construct* from \`anomalies/rank-d.ts\` Construct-type, AC 16, HP 32). Bypass via Bureau clearance override.
- **Loot**: a locker with 3 mana rations, 1 **Sigil of the Aegis** (\`sigils.ts\` sigil-ward-1).

#### SB-2 — The Observation Ring
A circular observation room ringed with reinforced mana-glass. At the center, a **Mana Vein pulses** — a pillar of raw violet-gold light two stories tall, anchored into the bedrock.

- **Atmosphere**: the pillar emits a **low harmonic** that triggers the **Unmoored** condition on entry (same as Day Zero's R0 threshold; DC 12 Sense save).
- **Puzzle**: the observation ring has six consoles. Five are broken. One works. The working console displays Bureau research data — DC 16 Investigation + Technomancer job bonus to extract it. Success: discover that Bureau Central Command has been using the Vein as an **S-Rank Anomaly containment buffer** for decades — something is being kept dormant by this Vein's pulse.
- **Handout trigger**: this discovery unlocks **Warden Secret: The Bureau's Secret** (add in Phase 4) — the Bureau is not the neutral institution it claims to be.
- **Loot**: 1 **B-Rank rune** from \`runes/power-powers.ts\` in the working console's compartment.

#### SB-3 — The Vein Chamber
The heart of the node. A **40 ft. diameter** circular chamber with the Mana Vein pillar at its center, reaching floor to ceiling. The air vibrates. A **Bureau Ascendant corpse** in dress uniform is slumped at the base, wedding ring visible on their hand. *(Warden note: this is the corpse of an S-Rank Bureau agent killed 72 hours before the Surge. Unrelated to the Regent. But the ring matters in the sense that Ms. Park's wedding ring looks similar — visual rhyme, not narrative identity.)*

- **Encounter** *(canonical)*:
  - **1× Corrupted Celestial Serpent (Elemental)** *(anomalies/rank-s.ts, anomaly-0030)* — downscale to **HP 200** for an A-Rank mini-boss encounter; it has been anchored to the Vein. Killing it is difficult but NOT required — the party can install the sensor *while avoiding it*.
- **Puzzle**: third mana-vein sensor installation. DC 16 Intelligence (Mana Engineering) — higher DC than Nodes 1 & 2 because of the Serpent's interference. Success: mark **Vein Node 3 ACTIVE**.
- **Reward (post-install)**:
  - All three nodes ACTIVE = Professor Lun's detonator ability unlocks for Chapter 16.
  - One **A-Rank rune** from \`runes/spell-rank-a.ts\`.
  - Optional: if the party takes the Bureau Ascendant's wedding ring, it becomes a minor **+1 to saves vs. psychic damage** accessory — single PC, attunement required. Flavor: the ring's mana-memory is of a loving marriage; it resists psychic intrusion.
- **Deity flavor**: Sylph + Kael Voss. Sylph is the Vein's Mistress; Kael Voss's umbral current flows through it.

---

## Mana Vein Rewards Summary

| Outcome | Effect |
|---------|--------|
| All 3 nodes ACTIVE + Professor Lun alive at finale | Regent starts Chapter 16 with −60 HP (canonical) |
| 2 of 3 nodes ACTIVE | Regent starts with −30 HP |
| 1 of 3 nodes ACTIVE | Regent starts with −10 HP |
| 0 nodes ACTIVE | no HP deduction (standard finale) |

## Why Three Veins Matter

The Bureau, per SB-2 discovery, has used the Yongsan Mana Vein Network to keep a dormant S-Rank Anomaly contained for decades. This Anomaly is NOT the Regent. It is something older. The current campaign does not confront it — but an **Awakening Ending** (per Chapter 28 Room 15 handoff) opens this thread for sequel campaigns.

> **Warden note**: *What's under the vein is older than the Regent.* This is the module's final foreshadowing seed. Plant it in SB-2. Do not water it in this campaign.
`,
	},
	{
		title: "Chapter 33: The Awoko Sanctum — Cult HQ",
		content: `# The Awoko Sanctum — Cult HQ

> *"To awaken is to remember what you always were."*
> — The Awoko Cult pamphlet (canonical handout)

## Overview

The **Awoko Sanctum** is the Awoko Cult's operational headquarters, a repurposed deconsecrated cathedral in the Restricted Zone's western edge. The party may raid it once the Cult has been sufficiently exposed (at Bureau Friendly OR after Chapter 17 Quest 1 "Investigate the Cult") or they may confront it as the final lead-up to Chapter 28 depending on the Warden's campaign pacing.

**Deity Alignment**: The Sanctum reveres **Marthos (The Dragon-King of Void)** as its true patron. The Cult tells its members they worship the Regent; The Hollow Mother knows better. *(Canonical — see **Warden Secret: The Hollow Mother's True Plan**.)*

**Canonical NPCs present** (pulled from \`sandbox-npcs.ts\`):
- **The Hollow Mother** (npc-awoko-001) — Cult leader, level 9 Void Priestess.
- **The Prophet (Whisper)** (npc-awoko-002) — Oracle / potential defector, level 5 Seer.
- **Blood Zealot Karn** (npc-awoko-003) — Berserker, level 7.
- **Sister Veil** (npc-awoko-004) — Ritualist, level 6.
- **The Hollow Man** (npc-awoko-005) — embedded Bureau mole, level 4 Infiltrator. Usually not present (working Bureau HQ); may flee here if exposed.
- **Acolyte Mara** (npc-awoko-006) — Cult initiate, level 2. Usually held in Bureau holding (Ch. 29 Room 8) or present here.

---

## The 8 Keyed Rooms

### S-1 — The Defaced Narthex
*(Entry vestibule of the old cathedral)*

A wood-paneled vestibule. The original Christian iconography has been scraped off. In its place: hand-painted Marthos sigils. A bowl of salt water sits at the threshold — if dipped into, it burns. *(DC 10 Investigation: the salt is mixed with Anomaly blood.)*

- **Encounter**: 2× Acolyte (level 2, generic Humanoid from \`anomalies/rank-d.ts\`). Armed with ceremonial daggers.
- **Loot**: 1 *Sigil of the Crimson Weeping* (\`sigils.ts\`) on the altar in the corner.
- **Deity flavor**: Marthos. The Narthex is where the Cult's betrayal of Elara's iconography becomes explicit.

### S-2 — The Confession Chambers
*(Three small wooden booths, converted into interrogation cells)*

Three booths. Originally confessionals; now soundproofed interrogation cells. Each booth contains a chair bolted to the floor and a Cult recording device.

- **NPC (conditional)**: if the Cult has captured any NPC the party cares about (civilian ally, recruitable NPC not yet saved), they are in Booth 3. This is a rescue mechanic.
- **Encounter**: 1× Cult Interrogator (level 4 Infiltrator from \`anomalies/rank-c.ts\`). Flees if bloodied.
- **Handout**: audio recordings — DC 14 Investigation reveals **The Hollow Mother's Sermon transcript** *(add in Phase 4 as handout)*.
- **Deity flavor**: Marthos + Nyx. Predator dominion made explicit.

### S-3 — The Nave *(Primary Ritual Hall)*
*(Former cathedral nave, pews removed, massive ritual sigil on floor)*

The cathedral's main hall, stripped. A 60 ft. wide ritual sigil carved into the flagstone floor — the Cult's **Gate Fracture Ritual**, designed to weaken dimensional barriers (per Warden Secret: Hollow Mother's Plan). Candles, braziers, suspended chains.

- **Encounter**:
  - **Blood Zealot Karn** (npc-awoko-003) if still alive — level 7 Berserker. Pull his kit from \`techniques.ts\` Berserker tier + 1 rage-tier power from \`powers.ts\`.
  - **4× Acolytes** (level 2).
- **Loot**:
  - **Awoko Ritual Primer** *(add in Phase 4 as handout)* — contains diagrams of the Fracture Ritual.
  - **Sigil of the Void-Walker** (\`sigils.ts\` sigil-shadow-1) on Karn's belt if killed.
- **Tactical note**: the sigil on the floor is ACTIVE — any PC standing on it takes 1d4 necrotic at end of turn. Disabling it requires DC 16 Intelligence + 1 action OR disrupting the surrounding candle ring.
- **Deity flavor**: Marthos. The heart of the sanctum.

### S-4 — The Choir Loft
*(Second-floor balcony overlooking the Nave)*

Raised balcony. Old wooden pews. Sheet music scattered — unreadable without a DC 14 Arcana check, which reveals it as a **Choral Invocation** used to summon shadow-minions. The Cult has a minor Idol tier here.

- **NPC**: **The Choral Mother** *(new canon-extension NPC — Idol, level 5, feeds 14-Job gap; aligned with Elara-inverted)*. She believes the invocation is aesthetic; The Hollow Mother has lied to her about its function.
- **Encounter**: The Choral Mother + **2× Umbral Scouts** *(shadow-soldiers.ts, umbral-scout)* summoned by her song.
- **Reconciliation path**: DC 16 Presence to reveal the truth about what her song summons. Success: she defects on the spot, becomes a recruitable ally NPC (Idol-job, fills the 14-Job roster gap). Give her a canonical Idol build from \`jobs.ts\`.
- **Loot (if killed OR if she defects as a gift)**: 1 **S-tier spell rune** from \`runes/spell-rank-s.ts\` embedded in her sheet music.
- **Deity flavor**: Elara, stolen. Aesthetic Harmony's melodies weaponized — the Cult's specific perversion of Elara.

### S-5 — Sister Veil's Laboratory
*(Former sacristy, now aetheric engineering lab)*

A clean, well-organized laboratory. Ritual arrays diagrammed on the walls. **Sister Veil** (npc-awoko-004) works here.

- **NPC**: **Sister Veil** — Ritualist, level 6. Canon notes: she's a true believer whose faith is intellectual. Evidence can break it.
- **Reconciliation path**: if the party shows Veil **specific evidence** that The Hollow Mother has lied to her — either **Warden Secret: The Hollow Mother's True Plan** (handed to her as a player-side discovery) or a specific document from S-3's Awoko Ritual Primer — Veil defects. She becomes an ally for the final fight (per Chapter 24 Card 6 Option 8: *"Sister Veil turns the Cult ritual inward; stuns Regent for 2 rounds"*).
- **Combat path**: if engaged, Veil uses \`spells/rank-b.ts\` divination + ritual-tier spells.
- **Loot**:
  - **Sigil of the Archmage's Clarity** (\`sigils.ts\` sigil-intel-1) on her workbench.
  - Handout: **Warden Secret: The Hollow Mother's True Plan** — the original document (Veil's copy, with her handwritten skepticism in the margins).
- **Deity flavor**: Xylo. Veil is Xylo-adjacent and doesn't know it — a believer who writes everything down, including her doubts.

### S-6 — The Prophet's Cell
*(Small attached chapel, candle-lit, occupied by The Prophet)*

A small chapel attached to the main nave. **The Prophet (Whisper)** lives here in semi-seclusion. She is a **defector-in-waiting** per canonical NPC notes.

- **NPC**: **The Prophet (Whisper)** — level 5 Seer. Potential defector. Canon: she has already seen the Regent's true nature in visions.
- **Interaction**:
  - At first approach: she is **not hostile**. She speaks in riddles, each tied to a Chapter 24 Mana Reading outcome.
  - DC 14 Presence: she offers prophecies specific to the party's campaign state (Warden-guided).
  - **Defection** *(automatic if party has Bureau or Vermillion Trusted)*: she joins the party, becomes a recruitable NPC, will reveal The Hollow Mother's true plan.
- **Loot**: **Sigil of the Undying Flame** (\`sigils.ts\` sigil-immortality) concealed under her cot. This is the Cult's hidden best-kept secret — she was saving it for a PC who would use it to sealed the Regent, not destroy him.
- **Deity flavor**: Solara + Xylo. The Brightest Fragment's prophetic light, preserved in writing.

### S-7 — The Vault of Tithes
*(Sub-basement, reached via hidden door)*

A reinforced vault. The Cult's accumulated sacrifices, offerings, and stolen artifacts. Guarded by **wards**.

- **Encounter**: **2× Umbral Mages** + **1× Umbral Bulwark** *(shadow-soldiers.ts)* — the Sanctum's strongest canonical defense.
- **Wards**: 3 wards on the vault door. Disarm DC 16 each. Failure = 2d8 necrotic.
- **Loot**:
  - **Bloodthirsty Greatsword** (\`relics-comprehensive.ts\` bloodthirsty-greatsword).
  - **Abyssal Reliquary** (\`artifacts.ts\` artifact_7) — if this Relic wasn't recovered earlier.
  - 10,000 Credits in mixed currencies.
  - Handout: **The Hollow Mother's Sermon transcript** *(Phase 4 handout)*.
- **Deity flavor**: Marthos. The hoard.

### S-8 — The Hollow Mother's Sanctum *(Boss Room)*
*(Former apse of the cathedral, raised dais, black mirror behind throne)*

The back of the cathedral. A raised dais with The Hollow Mother's throne — not a chair, a standing position before a **black mirror**. The mirror is a minor Gate, Marthos-aspect, roughly the same kind as the one in Day Zero's R5 (The Diagnosed's origin).

- **Encounter**: **The Hollow Mother** (npc-awoko-001) — Phase 1 confrontation.
  - HP 78 | AC 16 | Pull her full kit from \`sandbox-npcs.ts\` Key Abilities + \`spells/rank-a.ts\` Void/Necrotic S-tier + \`techniques.ts\` Awoko rituals.
  - Shadow minions: she summons **1× Umbral Assassin** per round (cap 2 active).
- **Tactical layers**:
  - Her black mirror is an **active Gate**. Destroying it (AC 12, HP 15, behind her) prevents her from Mirror Retreat-style escapes.
  - If her HP hits 0 and the party has NOT destroyed the mirror, she flees through it. She reappears in **Chapter 28 Megadungeon Room 11** for Phase 2 (the "inheriting the Regent" twist).
  - If her HP hits 0 AND the mirror is destroyed, she dies. The Hollow Ending is foreclosed.
- **Loot**:
  - **Shadow Regent's Mantle** (\`artifacts.ts\` artifact_3) — on her body.
  - **Sigil of the Shadow Regent** (\`sigils.ts\` sigil-shadow-king) — the legendary sigil, on her mirror frame.
  - Key to the Relic Vault (S-7) if the party skipped S-7.
- **Deity flavor**: Marthos. Her mirror is a Marthos-aspect pocket dimension, identical to the one in Day Zero. The cult's canonical patron made explicit.

---

## Sanctum Outcome Table

| Outcome | Effect |
|---------|--------|
| Hollow Mother killed + mirror destroyed | Standard Victory Ending path open; Hollow Ending foreclosed |
| Hollow Mother flees through mirror | Phase 2 of her fight will appear in Megadungeon Room 11 |
| Sister Veil defected | Chapter 24 Card 6 Option 8 is available (Veil stuns Regent for 2 rounds) |
| The Prophet defected | Prophet grants final-fight prophecy: Warden reveals Regent's next ability before it triggers, once per Phase |
| The Choral Mother defected | Idol-job NPC joins the party; fills 14-Job representation gap |
| Sanctum left standing (party never raids) | Awoko Cult reaches full ritual strength; Regent gains +40 HP in Chapter 16 |

> **Warden note**: raiding the Sanctum is OPTIONAL. A party that bypasses it enters the finale at a significant handicap. This is deliberate — the Sanctum is the module's "you should deal with this" signal.
`,
	},
];
