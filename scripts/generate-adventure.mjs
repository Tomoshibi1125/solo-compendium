#!/usr/bin/env node
/**
 * Protocol Zero — Complete Campaign Book Generator
 * Generates a full D&D 5e–scale adventure module for System Ascendant (Levels 1–10)
 * Pulls canonical data from the compendium source files.
 */

import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "..", "docs", "adventure-protocol-zero.md");

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function statMod(score) {
	const m = Math.floor((score - 10) / 2);
	return m >= 0 ? `+${m}` : `${m}`;
}
function profBonus(cr) {
	if (cr <= 4) return 2;
	if (cr <= 8) return 3;
	if (cr <= 12) return 4;
	if (cr <= 16) return 5;
	if (cr <= 20) return 6;
	return 7;
}
function hpCalc(hitDice, dieSize, vitMod) {
	const avg = Math.floor(hitDice * ((dieSize + 1) / 2) + hitDice * vitMod);
	return `${avg} (${hitDice}d${dieSize} ${vitMod >= 0 ? "+" : ""}${hitDice * vitMod})`;
}

// ---------------------------------------------------------------------------
// CONTENT GENERATION — FRONT MATTER
// ---------------------------------------------------------------------------
function frontMatter() {
	return `# Protocol Zero: A System Ascendant Adventure

**A Campaign for Levels 1–10**
**Estimated Playtime:** 40–60 Hours (12–20 Sessions)
**Setting:** Neo-Seoul, Modern Urban Fantasy
**System:** System Ascendant (d20 / 5e-Compatible)
**Players:** 3–6 Ascendants
**Decree Warden Difficulty:** Intermediate

> *"The System is not your ally. It is a leash you have not yet learned to see."*
> — Valerius, in his final transmission before vanishing

---

## About This Adventure

*Protocol Zero* is a complete campaign that takes newly Awakened Ascendants from their first Gate assignment through a conspiracy that threatens to unravel the fabric of reality itself. The adventure is set in Neo-Seoul, a sprawling metropolis where Dimensional Rifts routinely tear open, disgorging Anomalies that only the System-empowered Ascendants can combat.

This module is designed to be run as a continuous narrative over 12–20 sessions. Each chapter corresponds to roughly 2 character levels and contains a mix of combat encounters, social interactions, exploration, and investigation. The adventure uses **milestone advancement** — characters level up at specific narrative beats rather than tracking experience points.

### For the Decree Warden

Throughout this adventure, boxed text is provided for read-aloud descriptions. Decree Warden information follows in clearly marked sections. Key terms:

- **Decree Warden (DW):** The game master — the System's arbiter
- **Ascendant:** A player character — a human empowered by the System
- **Anomaly:** A creature that emerges from Dimensional Rifts
- **Gate:** A Dimensional Rift portal
- **Power:** A supernatural ability (equivalent to a spell)
- **Relic:** A magical item of System origin
- **System Favor:** A resource pool replacing Inspiration (see Appendix F)
- **Job:** A character class
- **Path:** A subclass specialization (chosen at level 3)

### Tone and Themes

Protocol Zero blends the following tones:

- **Korean Manhwa Action:** Over-the-top combat, dramatic power-ups, escalating threat tiers
- **Urban Fantasy Noir:** Corrupt institutions, gray morality, neon-lit investigations
- **Cosmic Horror (Light):** The System's true nature is unknowable and unsettling
- **Found Family:** The party bond forged under impossible pressure

### Content Advisory

This adventure contains themes of institutional corruption, body horror (during Awakening sequences), violence, and existential dread. The Decree Warden should establish safety tools (X-Card, Lines & Veils) during Session Zero.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Adventure Overview](#adventure-overview)
3. [Chapter 1: The E-Rank Awakening (Levels 1–2)](#chapter-1-the-e-rank-awakening-levels-12)
4. [Chapter 2: Bureau Investigations (Levels 3–4)](#chapter-2-bureau-investigations-levels-34)
5. [Chapter 3: The Red Gate Incursion (Levels 5–6)](#chapter-3-the-red-gate-incursion-levels-56)
6. [Chapter 4: The Regent's Call (Levels 7–8)](#chapter-4-the-regents-call-levels-78)
7. [Chapter 5: Protocol Zero (Levels 9–10)](#chapter-5-protocol-zero-levels-910)
8. [Appendix A: Relics & Equipment](#appendix-a-relics--equipment)
9. [Appendix B: Anomaly Bestiary](#appendix-b-anomaly-bestiary)
10. [Appendix C: NPC Profiles & Stat Blocks](#appendix-c-npc-profiles--stat-blocks)
11. [Appendix D: Random Encounter Tables](#appendix-d-random-encounter-tables)
12. [Appendix E: Handouts & Maps](#appendix-e-handouts--maps)
13. [Appendix F: System Ascendant Rules Reference](#appendix-f-system-ascendant-rules-reference)
14. [Appendix G: Advancement & Rewards](#appendix-g-advancement--rewards)

---
`;
}

// ---------------------------------------------------------------------------
// INTRODUCTION
// ---------------------------------------------------------------------------
function introduction() {
	return `## Introduction

### Synopsis

For decades, Dimensional Rifts have torn through the fabric of reality, unleashing Anomalies upon the earth. In response, **The System** awoke — an ancient cosmic force that grants select humans the power of Jobs, Paths, and Powers. These Awakened, known as **Ascendants**, are governed by the **Ascendant Bureau**, a global regulatory body headquartered in Neo-Seoul.

But the System is not what it seems. Beneath its beneficent interface lies a cosmic architecture designed by the **Absolute** — the original creator of the Eternals and the Exarchs. A rogue Engineer named **Valerius** discovered the hidden threads binding the rifts together and uncovered a forbidden rite encoded in the System's deepest protocols: **Protocol Zero**.

Now Valerius and his fanatical followers, the **Null Guild**, seek to invoke Protocol Zero — a sequence that would unravel the System entirely, triggering a dimensional collapse that would swallow the mortal world into the Void.

The Ascendants — your players — begin as newly Awakened E-Rank operatives on a routine training mission. Over the course of the campaign they will infiltrate corrupt institutions, survive hostile dimensions, and ultimately face a choice that will determine the fate of reality itself.

### Adventure Hooks

Use one or more of the following hooks during Session Zero:

**Bureau Conscripts.** The Ascendants were recently Awakened and registered with the Ascendant Bureau. They have been assigned to **Squad Cobalt**, a mixed-Job training unit, and are being sent on their first official assignment: clearing an E-Rank Gate that manifested in the Neo-Seoul Metropolitan Subway system. Each Ascendant receives a Bureau-issued smartphone loaded with the **Ascendant Field App** (AFA), which displays their System HUD, mission briefings, and vital resonance data.

**Freelance Scavengers.** The Ascendants run an independent, unguilded operation, illegally harvesting Essence crystals from unregistered micro-gates. They have avoided Bureau registration to dodge the 40% Essence tax. A tip from a dark-web contact points them to a fresh E-Rank Gate in the subway — unmonitored, unregistered, and ripe for harvest. Unknown to them, Agent Rhee has been tracking their operation and will confront them during the mission.

**Corporate Interns.** The Ascendants are employees of **Ascendant Corp**, the trillion-dollar private enterprise that monopolizes Relic refinement and Essence technology. Their supervisor has quietly diverted them to the subway gate before the Bureau can claim it — Ascendant Corp wants the Essence yield for a classified weapons project. The supervisor is secretly a Null Guild sympathizer.

**System Anomaly.** One of the Ascendants recently received a unique System notification upon their Awakening that none of the others received: \`[WARNING: PROTOCOL ZERO INITIALIZING — CANDIDATE IDENTIFIED]\`. The message vanished from their HUD before they could screenshot it, and the System provides no further information. This Ascendant is driven to seek answers inside the rifts, where the System's signal is strongest.

**Debt Runners.** The Ascendants owe money to a dangerous loan shark connected to the Null Guild's money-laundering operations. When a Null Guild enforcer offers to clear their debt in exchange for "one small job" inside a gate, they take it — only to discover that the job is the opening salvo in a plan to destabilize the entire Gate network.

### Adventure Flowchart

\`\`\`
Chapter 1 (L1-2)         Chapter 2 (L3-4)         Chapter 3 (L5-6)
┌─────────────────┐   ┌──────────────────────┐   ┌─────────────────────┐
│ Subway Rift      │──▶│ Bureau Investigation  │──▶│ Red Gate Incursion   │
│ E-Rank → C-Rank  │   │ Null Guild Discovery  │   │ Frozen Dimension     │
│ First Contact    │   │ Ascendant Corp Gala   │   │ Survival + Boss      │
└─────────────────┘   └──────────────────────┘   └─────────────────────┘
                                                           │
Chapter 5 (L9-10)        Chapter 4 (L7-8)                  │
┌─────────────────────┐  ┌──────────────────────┐          │
│ S-Rank Gate Break    │◀─│ Martial Law Era      │◀─────────┘
│ Nexus Core           │  │ Ascendant Corp Raid  │
│ Valerius Final Boss  │  │ Regent Awakening     │
│ Protocol Zero        │  │ Null Guild Revealed  │
└─────────────────────┘  └──────────────────────┘
\`\`\`

---
`;
}

// ---------------------------------------------------------------------------
// ADVENTURE OVERVIEW
// ---------------------------------------------------------------------------
function adventureOverview() {
	return `## Adventure Overview (Decree Warden's Eyes Only)

> **This entire section is for the Decree Warden only.** It contains spoilers, secret motivations, hidden agendas, and the full truth behind Protocol Zero. Do not share this information with players.

### The Truth Behind Protocol Zero

The System is not benevolent. It is a containment protocol — a cosmic leash designed by the Absolute to prevent dimensional collapse. When the Absolute created the Eternals and the Exarchs, it also created the Dimensional Rifts as pressure valves for inter-dimensional energy. The System was then woven over reality like a net, empowering select mortals (Ascendants) to manage the Rifts and suppress Anomalies — effectively turning humanity into unpaid janitors for a cosmic problem they didn't create.

**Valerius** was the first to see through the System's interface. As an S-Rank Engineer — a Job that specializes in understanding the System's architecture — he reverse-engineered the protocols governing Gate behavior. He discovered that the System was not protecting humanity; it was *farming* them. Every Anomaly kill, every Essence crystal harvested, every Gate cleared — all of it feeds energy back to the Absolute through the System's hidden channels.

Protocol Zero is the System's emergency shutdown sequence. Invoking it would sever the Absolute's connection to the mortal plane, closing all Gates permanently. But the dimensional energy currently managed by the System would have nowhere to go. Without controlled release through Gates, the energy would cascade — collapsing the barrier between dimensions and merging the mortal world with the Void.

**Valerius believes the merger is preferable to enslavement.** He is wrong — the Void would annihilate all mortal life — but his conviction is genuine. He sees himself as a liberator, not a destroyer.

### The Doom Clock

If the players do nothing, the following events unfold:

| Day | Event |
|-----|-------|
| Day 1 | E-Rank Gate manifests in Neo-Seoul Subway Line 7 |
| Day 1 | Gate destabilizes to C-Rank during party's clearing mission |
| Day 3 | Bureau locks down subway; begins investigation |
| Day 7 | Null Guild raids Bureau evidence locker, steals rift samples |
| Day 14 | Three more Gates spontaneously rank up across Neo-Seoul |
| Day 21 | Null Guild acquires Ascendant Corp amplification technology |
| Day 28 | Null Guild opens Red Gate as a test — party is ambushed if nearby |
| Day 42 | Ascendant Corp Tower falls to Null Guild assault |
| Day 56 | Null Guild begins Protocol Zero ritual at Rift Nexus |
| Day 60 | Protocol Zero completes — dimensional collapse begins |

The party's actions disrupt this timeline. If they investigate aggressively, the Null Guild accelerates. If they're cautious, events may outpace them.

---

### Cast of Major Characters

#### Bureau Chief Kang Min-jun

**Role:** Primary authority figure, morally gray patron
**First Appearance:** Chapter 1, Scene 4
**Rank:** A-Rank Ascendant (Destroyer/Siege Breaker), inactive field status

> *A broad-shouldered Korean man in his fifties wearing a tailored charcoal suit. His left hand is prosthetic — matte-black carbon fiber with visible mana conduits glowing faint blue. His eyes carry the flat, assessing stare of someone who has seen too many Gates.*

**Personality Traits:**
- Speaks in clipped, efficient sentences — wastes nothing, including words
- Drinks black coffee constantly — his desk has a permanent ring stain
- Calls everyone by their Bureau designation number, not their name
- Has a dry, dark sense of humor that surfaces at inappropriate moments

**Motivations (Secret):**
- **Public:** Maintain order, contain Gates, protect Neo-Seoul
- **Private:** Kang is secretly diverting Bureau funds to purchase illegal Relics on the black market. He is building a personal arsenal because he doesn't trust the System. He saw something inside a Gate fifteen years ago — a message from the Absolute — and it shattered his faith in the institution he serves. He has not told anyone.
- **What He Wants from the Party:** Competent operatives who owe him favors. He will protect them as long as they remain useful and loyal.
- **What He Fears:** That Valerius might be right about the System.

**Roleplaying Tips:**
- Never raise his voice — quiet authority is more terrifying
- Offer the party resources, but always with strings attached
- If the party withholds information, he notices — his SENSE is 18
- He respects competence above all else; raw power means nothing to him

**Combat Statistics:** See Appendix C.

---

#### Agent Rhee Sun-mi

**Role:** Primary ally, field handler, emotional anchor
**First Appearance:** Chapter 1, Scene 1 (or Chapter 2 for Freelance hook)
**Rank:** B-Rank Ascendant (Esper/Psychometry Path)

> *A lean Korean woman in her early thirties, wearing Bureau field gear — black tactical vest over a white dress shirt, sleeves rolled to reveal forearm tattoo-runes that glow faintly when she uses her Powers. Her hair is pulled back in a practical ponytail. She speaks with the careful patience of someone used to managing people who can punch through walls.*

**Personality Traits:**
- Genuinely cares about new Ascendants — has seen too many burn out or die
- Fidgets with a silver ring on her left hand (her deceased partner's)
- Uses humor to defuse tension — terrible puns, always delivered deadpan
- Keeps a battered notebook; writes everything down by hand ("Electronics fail in Gates")

**Motivations:**
- **Public:** Guide and protect new Ascendants through their first field assignments
- **Private:** Her former partner, **Agent Lim**, vanished during a Red Gate incident two years ago. Rhee believes he is still alive inside a sealed dimension. She is quietly investigating Red Gate anomalies hoping to find a way to reach him. The party's Red Gate incursion in Chapter 3 gives her a personal stake.
- **What She Wants from the Party:** Allies she can trust when the Bureau's politics become too dangerous. She will be honest with them if they earn her trust.
- **Secret:** Rhee's Aetheric-Sight is unusually powerful — she can see the "threads" of the System's architecture, though she doesn't understand what they mean. She has never reported this to the Bureau.

**Roleplaying Tips:**
- Treat her like a veteran NCO — competent, protective, exasperated
- She calls the party "rookies" until they prove themselves (after Chapter 3, she uses their names)
- She will disobey Bureau orders if it means saving the party
- Her Psychometry allows her to read emotional impressions from objects — use this for investigation scenes

**Aetheric-Sight Ability (Unique):**
As a bonus action, Rhee can monitor the party's vital resonance through her Aetheric-Sight. This manifests as a faint blue overlay in her vision showing heart rate, mana levels, and emotional state. She uses this to warn the party of incoming danger and to detect lies (DC 15 PRE check to fool her).

**Combat Statistics:** See Appendix C.

---

#### Valerius, The Rogue Engineer

**Role:** Primary antagonist
**First Appearance:** Referenced from Chapter 1; voice contact in Chapter 3; physical appearance in Chapter 5
**Rank:** S-Rank Ascendant (Engineer/System Architect Path)

> *A tall, gaunt man who appears to be in his late forties, though his actual age is unknown. His left eye has been replaced with a crystallized mana prosthetic that glows with a constant, pulsing violet light — it lets him see the System's raw code. His body shows signs of excessive System modification: veins of solidified mana trace geometric patterns across his exposed skin, and his fingers end in slightly elongated, claw-like nails. He wears a long coat of woven shadow-silk that seems to absorb light.*

**Personality Traits:**
- Speaks with the calm certainty of a man who has already accepted the consequences of his actions
- Quotes System error codes and protocol numbers in casual conversation
- Genuinely sorrowful — he does not want to destroy anyone, but believes it is necessary
- Treats Ascendants with respect — he sees them as fellow prisoners, not enemies

**Motivations:**
- **Public (to the Null Guild):** Free humanity from the System's control by invoking Protocol Zero
- **Private:** Valerius has seen the Absolute's true form through his modified eye. What he saw broke something fundamental in his worldview. He believes the Absolute is not a god but a *parasite* — feeding on the dimensional energy that Ascendants harvest. He would rather destroy everything than allow the feeding to continue.
- **The Tragedy:** Valerius is not entirely wrong. The System IS extracting energy from Ascendant activity. But Protocol Zero would not "free" anyone — it would cause a dimensional collapse that annihilates all mortal life. He knows this. He considers it a mercy compared to eternal parasitism.
- **What He Wants from the Party:** At the climax, Valerius offers the party a genuine choice: join him in invoking Protocol Zero (ending the System forever but causing the collapse), or stop him (preserving the System but allowing the Absolute to continue feeding). There is no clean answer.

**Roleplaying Tips:**
- Never make him a cackling villain — he is tragic, not evil
- He calls the System "the Leash" and Ascendants "the Hounds"
- If the party tries to reason with him, he listens — then explains why he cannot stop
- His combat dialogue is sad, not angry: *"I'm sorry. Truly. But some cages must be burned."*

**Combat Statistics:** See Appendix C (S-Rank stat block with Lair Actions).

---

#### Supporting NPCs

**Director Yoon Hae-rin** — Ascendant Corp's CEO. Polished, ruthless, views Ascendants as corporate assets. Offers the party lucrative contracts with hidden strings. Age 42, always impeccably dressed, never raises her voice.

**"Specter" (Park Ji-hoon)** — Null Guild lieutenant. Former B-Rank Assassin who lost his partner in a Bureau cover-up. Leads the Enforcers the party fights in Chapter 2. Wears a featureless black mask. Can be turned to an ally if the party reveals Bureau corruption.

**Dr. Shin Eun-ji** — Bureau medical officer. Patches the party up after missions. Cheerful, slightly unhinged sense of humor ("Oh, your arm is broken in three places? Only three? You're doing great!"). Provides medical exposition and healing services.

**Operator Choi** — Bureau dispatch operator. The voice on comms during field missions. Calm, professional, sounds like a GPS navigation voice. Provides mission updates, extraction coordinates, and dry commentary.

**"Architect" Ha Seung-woo** — Null Guild's ritual specialist. A former Bureau researcher who discovered references to Protocol Zero in classified Gate data. Gaunt, nervous, deeply committed to Valerius's cause but terrified of the consequences.

---

### The Factions

#### The Ascendant Bureau

**Type:** Government regulatory body
**Alignment:** Lawful Neutral (with corrupt elements)
**Resources:** Extensive — military-grade Relics, surveillance network, legal authority
**Headquarters:** Bureau Central Command, a brutalist concrete tower in downtown Neo-Seoul

**Goals:**
- Contain Dimensional Rifts and prevent Gate Breaks
- Register and regulate all Ascendants
- Monopolize Gate access and Essence distribution
- Maintain public order and suppress knowledge of the System's true nature

**Relationship to the Party:** The Bureau is the party's employer (or pursuer, depending on the hook). Chief Kang serves as their primary patron. The Bureau provides missions, equipment, and medical support — but also monitors the party's activities and expects obedience.

**Internal Politics:** The Bureau is not monolithic. A reformist faction led by Agent Rhee pushes for transparency and better treatment of Ascendants. A hardliner faction led by **Deputy Director Hwang** advocates for total control, including mandatory Power suppression implants. Chief Kang plays both sides.

**Bureau Resources Available to the Party:**
- Access to **Bureau Armory** (D-Rank and C-Rank Relics, standard equipment)
- **Medical Bay** (free healing between missions, restoration of conditions)
- **Intelligence Briefings** (information about Gate locations, Anomaly types)
- **Legal Authority** (Bureau badge allows access to restricted areas, bypass of civilian law)
- **Danger Pay:** 50,000 ₩ per E-Rank mission, 200,000 ₩ per C-Rank, scaling upward

---

#### The Null Guild

**Type:** Terrorist organization / revolutionary movement
**Alignment:** Chaotic Neutral (members range from idealistic to fanatical)
**Resources:** Moderate — stolen Relics, dark-web funding, sleeper agents
**Headquarters:** Mobile — operates from a network of safehouses, abandoned Gates, and dimensional pockets

**Goals:**
- Invoke Protocol Zero to dismantle the System permanently
- "Liberate" Ascendants from the System's control
- Expose the Absolute's parasitic nature to the world
- Acquire Ascendant Corp technology for the ritual

**Relationship to the Party:** The Null Guild is the primary antagonist faction, but their motivations are sympathetic. Individual members range from fanatics to desperate people who have lost family to Gates. The party may choose to negotiate with or even ally with certain members.

**Null Guild Ranks:**
- **Acolytes:** Unawakened supporters who handle logistics, safehouses, funding
- **Enforcers:** C-Rank and D-Rank Ascendants who handle combat operations
- **Espers:** B-Rank casters who maintain the Guild's dimensional hideouts
- **Architects:** Ritual specialists who understand Protocol Zero's mechanics
- **The Rogue Engineer:** Valerius himself — the Guild's leader and only S-Rank

---

#### Ascendant Corp

**Type:** Megacorporation
**Alignment:** Lawful Evil (profit above all)
**Resources:** Massive — cutting-edge Relic tech, private security force, political influence
**Headquarters:** Ascendant Tower, a 90-story glass skyscraper in Neo-Seoul's financial district

**Goals:**
- Monopolize Relic refinement and Essence-based technology
- Develop and sell weaponized Gate technology to military clients
- Control Ascendant labor through exclusive contracts and debt
- Suppress any research that threatens their business model

**Relationship to the Party:** Ascendant Corp is a secondary antagonist — they're not actively trying to destroy the world, but their greed and short-sightedness enable the Null Guild's plans. Director Yoon offers the party contracts that pay well but come with dangerous strings.

**Ascendant Corp Assets:**
- **Security Constructs:** Automated defense systems (see Appendix B)
- **Essence Amplifiers:** Technology that can boost or suppress Ascendant powers
- **Private Army:** Contracted B-Rank and C-Rank Ascendants in corporate livery
- **R&D Division:** Conducts classified experiments on Gate energy

---

### Faction Relationship Table

| | Bureau | Null Guild | Ascendant Corp |
|---|--------|-----------|----------------|
| **Bureau** | — | Hostile (actively hunting) | Tense Alliance (Corp funds Bureau programs) |
| **Null Guild** | Hostile | — | Hostile (stealing Corp tech) |
| **Ascendant Corp** | Tense Alliance | Hostile | — |
| **The Party** | Employer/Patron | Antagonist (potential ally?) | Questionable Ally |

---

### Key Locations of Neo-Seoul

#### Bureau Central Command
A brutalist concrete fortress in downtown Neo-Seoul, bristling with Essence-powered detection arrays and anti-Gate wards. The building is 12 stories tall, with subterranean levels extending another 6 floors underground. The lower levels house the **Vault** (classified Relics), the **Pit** (interrogation rooms), and the **Resonance Chamber** (where new Ascendants are registered and their powers catalogued).

#### Ascendant Tower
A 90-story glass-and-steel monument to corporate excess, located in the Yeongdeungpo financial district. The building's exterior is lined with Essence conduits that make it shimmer faintly at night. Floors 1-30 are corporate offices. Floors 31-60 house R&D labs. Floors 61-89 are restricted. Floor 90 is Director Yoon's private office and the location of the **Essence Amplifier** — the device the Null Guild needs to invoke Protocol Zero.

#### The Underground (Neo-Seoul Subway System)
A vast network of subway tunnels where E-Rank and D-Rank Gates frequently manifest. The Bureau maintains monitoring stations at major intersections, but the system is too large to fully patrol. Sections of abandoned tunnel serve as territory for unregistered Ascendants, black-market Essence dealers, and Null Guild safehouses.

#### The Neon District (Hongdae)
Neo-Seoul's entertainment district — nightclubs, street food, holographic billboards, and the highest concentration of unregistered Ascendants in the city. The district operates on a "don't ask, don't tell" policy with the Bureau. Key locations include **The Aether Lounge** (a bar for off-duty Ascendants), **Kim's Relic Shop** (a black-market Relic dealer), and **The Signal** (a dark-web café used by the Null Guild for recruitment).

#### Pier 17 (Industrial District)
A decaying industrial zone on the Han River waterfront, filled with shipping containers, abandoned warehouses, and decommissioned factories. Ascendant Corp uses several warehouses for "off-book" storage. The Null Guild operates a major safehouse here — the **Warehouse** the party raids in Chapter 2.

---
`;
}

const sections = [];
sections.push(frontMatter());
sections.push(introduction());
sections.push(adventureOverview());

// We'll add chapters next — writing to a temp holder and appending
// For now, write what we have so the user can see progress
writeFileSync(OUTPUT, sections.join("\n"), "utf8");
console.log("[1/4] Front matter + Introduction + Overview written.");
console.log("Continuing with chapters...");

// ---------------------------------------------------------------------------
// CHAPTER 1
// ---------------------------------------------------------------------------
function chapter1() {
	return `## Chapter 1: The E-Rank Awakening (Levels 1–2)

**Character Advancement:**
- Characters begin at **Level 1**
- Advance to **Level 2** after surviving the Subway Rift destabilization (Scene 2)
- Advance to **Level 3** upon completing the Bureau debrief and accepting their next assignment (Scene 4)

**Chapter Summary:** The party's first field assignment goes catastrophically wrong when a routine E-Rank Gate destabilizes mid-clearing. What should have been a training exercise becomes a fight for survival as the Gate's resonance shifts from E-Rank to C-Rank — something that shouldn't be possible without external interference.

**Pacing:** This chapter should take 2–3 sessions. Session 1 covers Scenes 1–2. Session 2 covers Scenes 3–4.

---

### Scene 1: Deployment Briefing

*Estimated Time: 30–45 minutes*
*Type: Social / Tutorial*

> *The fluorescent lights of Bureau Central Command's briefing room hum with faint mana resonance — a barely perceptible vibration that makes your teeth itch. The room smells of burnt coffee and industrial cleaner. A wall-mounted screen displays a satellite map of Neo-Seoul's subway system, with a pulsing red dot marking Line 7's Cheongdam Station.*
>
> *Agent Rhee stands at the front, tapping her notebook against her thigh. She looks over the assembled Ascendants with an expression that's equal parts assessment and concern.*
>
> *"All right, rookies. Welcome to your first day on the job. I'm Agent Rhee, your field handler. That—" she gestures at the screen, "—is your target. E-Rank Gate, manifested in the maintenance tunnels beneath Cheongdam Station forty-six hours ago. Standard dimensional bleed — nothing exotic. Bureau sensors confirm three— maybe four — low-tier Anomalies inside. Shadow-type. Basic ambush predators."*
>
> *She pauses, making eye contact with each of you in turn.*
>
> *"This is a milk run. Clear the Anomalies, secure any Essence crystals, and get out. I'll be monitoring your resonance signatures from the surface. Your smartphones will maintain System HUD connectivity down to about sublevel two. Below that, you're on comms only."*
>
> *She flips open her notebook. "Questions?"*

**Decree Warden Information:**

This scene serves three purposes: (1) establish the party's relationship with Agent Rhee and the Bureau, (2) provide an opportunity for character introductions and roleplay, and (3) deliver essential mission briefing information.

**Key Information Rhee Provides:**
- The Gate is classified E-Rank (lowest tier). Expected Anomalies are **Lesser Shadow Fiends** — ambush predators that lurk in darkness
- The subway station has been evacuated and cordoned off. Civilian safety is not a concern
- Essence crystals harvested from Anomalies belong to the Bureau (40% tax for Freelancers; 100% for Bureau operatives, who are salaried instead)
- Bureau medical will be on standby topside. Extraction is available via the station's emergency stairs
- **Do NOT engage anything above D-Rank.** If they detect anything unusual, pull out immediately and call for backup

**Roleplaying Agent Rhee:**
Rhee is professional but warm. She genuinely wants these rookies to survive. She answers questions patiently, with occasional dry humor. If a player character is cocky, she'll smile and say: *"That confidence will either save your life or get you killed. Let's find out which."*

**If Players Ask About System Notifications (System Anomaly Hook):**
If a player brings up the \`PROTOCOL ZERO\` notification, Rhee's expression becomes carefully blank — a DC 14 SENSE (Insight) check reveals she's concealing genuine surprise. She says: *"That's... probably a calibration error. New Awakenings sometimes generate junk data. Don't worry about it."* She makes a note in her notebook. If pressed, she'll say she'll "look into it" and change the subject.

**Before Departing:**
Each Ascendant receives the following Bureau-issue equipment:
- **Bureau Field Communicator** (encrypted earpiece linked to Operator Choi)
- **Mana-Reactive Field Lamp** (lantern, 30 ft bright / 60 ft dim, runs on Essence)
- **D-Rank Healing Ampoule ×2** (restores 2d4+2 HP as an action)
- **Essence Collection Kit** (allows harvesting of Essence crystals from Anomaly remains)
- **Bureau ID Badge** (grants access to Bureau facilities and restricted areas)

---

### Scene 2: The Subway Rift

*Estimated Time: 60–90 minutes*
*Type: Dungeon Crawl + Combat*

> *Cheongdam Station is a tomb. The turnstiles are locked open, the ticket booth dark. Emergency lighting casts long orange shadows across the platform. Your footsteps echo off the tiled walls — and somewhere below, something echoes back.*
>
> *The stairs to sublevel one are slick with condensation. The deeper you descend, the colder the air becomes, carrying a metallic tang that coats the back of your throat. At sublevel two, the fluorescent lights begin to flicker in arrhythmic patterns. Your System HUD pulses once — a faint azure wash across your vision — and the familiar interface stabilizes:*
>
> *\`[DIRECTIVE ACKNOWLEDGED: CLEAR THE STATION]\`*
> *\`[GATE RANK: E — THREAT ASSESSMENT: MINIMAL]\`*
> *\`[ANOMALY SIGNATURES DETECTED: 3]\`*
>
> *The maintenance tunnel ahead yawns open like a throat. The walls are streaked with something dark and iridescent — dimensional residue. The smell of ozone is overwhelming. At the tunnel's end, twenty meters ahead, you can see it: a swirling vortex of purple energy, no larger than a doorway, anchored to the subway tracks. The Gate.*

**Decree Warden Information:**

**Map: Cheongdam Subway Tunnels**

The encounter area consists of three connected spaces:

1. **Platform (Area A):** 60 ft × 30 ft. The subway platform where the party enters. Well-lit (emergency lighting). Two support pillars provide half cover. The stairs back to the surface are here.

2. **Maintenance Tunnel (Area B):** 80 ft × 10 ft. A narrow corridor connecting the platform to the rift chamber. Dim light (flickering fluorescents). The floor is covered in dimensional slime — treat as **difficult terrain**. An abandoned maintenance cart halfway down provides full cover.

3. **Rift Chamber (Area C):** 40 ft × 40 ft. An open junction where three tunnels meet. The Gate hovers at the center, shedding dim purple light in a 20-foot radius. Three decommissioned subway cars sit on the tracks, providing cover and concealment.

**Creatures:**

\`[3× Lesser Shadow Fiend]\` — see Appendix B for full stat block.

The Shadow Fiends are distributed as follows:
- **Fiend 1:** Hiding inside the first subway car in Area C. Attacks when a character moves within 10 feet.
- **Fiend 2:** Clinging to the ceiling of the Maintenance Tunnel (Area B), 40 feet from the entrance. Drops on the last character in marching order with a Stealth check (+5) vs. the party's passive SENSE.
- **Fiend 3:** Lurking inside the Gate itself. Emerges (stepping out of the vortex) one round after combat begins.

**Tactics:**
- The Shadow Fiends coordinate using subsonic clicks to isolate targets. They focus on the most injured character.
- On their turn, they attempt to hide as a bonus action using Shadow Stealth (advantage on hiding in dim light).
- If reduced to below 8 HP, a Shadow Fiend attempts to flee back toward the Gate — if it reaches the Gate, it heals 2d4 HP and returns the following round.
- If all three are reduced to below 8 HP simultaneously, they flee into the Gate and do not return.

**Environmental Features:**
- **Dimensional Slime (Area B):** Difficult terrain. A creature that falls prone in the slime must succeed on a DC 10 VIT save or take 1d4 acid damage from exposure.
- **Subway Cars (Area C):** Provide three-quarters cover if a creature hides behind them. A creature can enter a subway car and gain total cover, but the cramped space limits movement to 10 ft per round.
- **The Gate:** The Gate sheds dim purple light in a 20-ft radius. Any creature that starts its turn within 5 feet of the Gate must succeed on a DC 10 SENSE save or be disoriented (disadvantage on attack rolls until the start of its next turn).
- **Support Pillars (Area A):** Half cover.
- **Electrical Fires:** Three small electrical fires flicker in the ceiling fixtures of Area C. A character can use an action to rip a fixture down (DC 12 STR check) and hurl it at a creature: ranged improvised weapon attack, 1d4 fire damage.

**Development — The Destabilization:**

When the last Shadow Fiend is defeated (or after 10 rounds of combat, whichever comes first), the Gate destabilizes. Read the following:

> *The Gate shudders. The purple vortex flickers — then blazes crimson. A sound like tearing metal reverberates through the tunnels, and for a single, terrible moment, the air itself seems to solidify. Your System HUD floods with warnings:*
>
> *\`[CAUTION: RIFT DESTABILIZING]\`*
> *\`[RANK RECLASSIFIED: C-RANK]\`*
> *\`[WARNING: ANOMALY SURGE IMMINENT]\`*
> *\`[EVACUATION RECOMMENDED]\`*
>
> *The Gate — now blazing red — begins to expand. It was the size of a doorway. Now it's the size of a garage door. And getting bigger. Through the crimson vortex, you glimpse something vast shifting in the dimensional space beyond — something far, far larger than a Lesser Shadow Fiend.*
>
> *Agent Rhee's voice crackles through your communicators, tense and controlled: "Rookies, I'm reading a massive resonance spike from your position. That Gate just jumped two ranks. Get out of there. Now."*

**What Happens Next:**

The party must evacuate. The Gate continues to expand for 3 rounds before Bureau containment specialists arrive topside and begin emergency stabilization. During the evacuation:

- **Round 1:** Two **Shadow Stalkers** (CR 2; see Appendix B) emerge from the expanded Gate. They are disoriented and do not pursue immediately — but they block the direct path from Area C to Area B.
- **Round 2:** The dimensional slime in Area B begins to boil, dealing 1d6 acid damage to any creature standing in it. The ceiling of Area C cracks and begins dropping rubble — at the start of each creature's turn in Area C, they must succeed on a DC 12 AGI save or take 1d6 bludgeoning damage from falling debris.
- **Round 3:** A massive tendril of shadow energy lashes out from the Gate, filling a 15-foot cone. All creatures in the cone must make a DC 14 AGI saving throw, taking 3d6 necrotic damage on a failed save, or half as much on a success. This is the cue for the party to RUN.

The party is NOT expected to fight the Shadow Stalkers. This is a skill challenge / escape sequence:

**Escape Skill Challenge:**
- **Goal:** Reach the surface (Area A stairs) before the Gate fully breaches
- **Successes Needed:** 3 successes before 3 failures (group check, each player contributes one check per round)
- **Suggested Skills and DCs:**
  - **Athletics (DC 12):** Sprint through difficult terrain, vault over debris
  - **Acrobatics (DC 13):** Dodge falling rubble, slide under collapsed beams
  - **SENSE/Perception (DC 11):** Spot the safest route through the chaos
  - **INT/Investigation (DC 14):** Identify a structural shortcut through the maintenance corridor
  - **PRE/Intimidation or Persuasion (DC 12):** Rally a panicking ally, shout directions
  - Creative uses of Powers or abilities: Decree Warden's discretion, generally DC 12

**On Success (3 successes first):** The party escapes to the surface with no additional damage. Bureau containment teams seal the station entrance behind them.

**On Failure (3 failures first):** The party escapes, but the last character out takes 2d6 necrotic damage from the Gate's energy backlash as the containment ward slams shut.

**Treasure:**
Before the destabilization, looting the Shadow Fiend remains yields:
- **3× Lesser Dark Essence** (Material Component, value 50 ₩ each)
- On a successful DC 13 SENSE check after the first fight: a **D-Rank Healing Ampoule** hidden inside a shattered ticket booth in Area A
- On a successful DC 15 INT check examining the subway car in Area C: a **Bureau Field Report** (Handout #1 — see Appendix E) left behind by a previous investigation team, referencing "anomalous resonance patterns" in the gate network

**Milestone:** Characters advance to **Level 2** upon reaching the surface.

---

### Scene 3: The Aftermath

*Estimated Time: 30–45 minutes*
*Type: Social / Investigation*

> *The surface is chaos. Bureau vehicles ring Cheongdam Station, their blue emergency lights cutting through the night. A containment perimeter has been established — yellow mana-reactive tape stretched across every entrance, guarded by armored Bureau operatives. Paramedics from Dr. Shin's team rush forward as you emerge, scanning your vital resonance with handheld devices.*
>
> *Agent Rhee is waiting. She looks pale. She doesn't say anything at first — just counts heads, visibly relieved when the number matches. Then she pulls you aside, away from the other Bureau personnel.*
>
> *"That's not supposed to happen," she says quietly, her eyes flickering with the faint blue of Aetheric-Sight. "Gates don't spontaneously rank up. Not like this. Not mid-clear." She glances over her shoulder. "Something is wrong with the resonance network. And I don't think we're the only ones who noticed."*

**Decree Warden Information:**

This scene provides the party with downtime, healing, and their first hints of the larger conspiracy.

**Dr. Shin's Medical Assessment:**
Dr. Shin patches up the party and cheerfully comments on their injuries ("Oh, dimensional slime exposure! Exciting! You'll want to scrub that off before it becomes sentient."). She provides free healing (full HP restoration) and removes any conditions. She also mentions, offhandedly, that she's seen three Gate destabilization reports in the past week — "Which is weird, because before last month the number was zero."

**Agent Rhee's Private Briefing:**
If the party talks to Rhee privately, she shares the following (no check required — she wants allies):
- Gate destabilization is theoretically impossible under normal conditions. The System maintains Gate ranks through a stabilization protocol.
- She's seen similar energy signatures before — two years ago, during the incident where her partner Agent Lim vanished.
- She suspects someone is deliberately destabilizing Gates, but she doesn't know how or why.
- She asks the party not to mention this theory to Chief Kang yet — "He'll shut down any investigation I try to open."

**Investigation Opportunities (Optional):**
Players who investigate the scene can learn the following:

| Check | DC | Information |
|-------|-----|-------------|
| INT (Investigation) | 12 | The dimensional residue pattern around the Gate is asymmetric — suggesting external interference, not natural destabilization |
| SENSE (Perception) | 14 | A faint secondary energy signature near the Gate doesn't match any known Anomaly type — it's human Ascendant energy |
| INT (Technology) | 15 | Bureau monitoring equipment in the station has been tampered with — someone disabled the resonance alarm 30 minutes before the party arrived |
| PRE (Persuasion) | 13 | A Bureau guard mentions that a "maintenance crew" accessed the tunnels yesterday — but there's no record of the request in the Bureau system |

**System Favor Award:**
Award 1 System Favor point to each Ascendant who:
- Protected an ally during the escape sequence
- Discovered the tampered monitoring equipment
- Showed creative problem-solving during the encounter

---

### Scene 4: Bureau Debrief

*Estimated Time: 30–45 minutes*
*Type: Social Encounter*

> *Bureau Central Command. Sublevel 2. Chief Kang's office is a spartan rectangle — metal desk, two chairs, a window that looks out onto the Resonance Chamber below. The walls are bare except for a framed map of Neo-Seoul with Gate locations marked in red — there are a lot of red dots.*
>
> *Kang sits behind his desk, prosthetic hand wrapped around a coffee mug that reads "WORLD'S OKAYEST BUREAUCRAT" in faded letters. He doesn't look up when you enter.*
>
> *"Sit."*
>
> *He takes a slow sip of coffee. Then he sets the mug down and fixes you with flat, dark eyes.*
>
> *"Report. Start from the moment you entered the tunnels. Leave nothing out."*

**Decree Warden Information:**

This is the adventure's first significant social encounter. Chief Kang interrogates the party about the Gate destabilization. His goals are:

1. **Determine exactly what happened** — he needs accurate intelligence
2. **Assess the party's competence and loyalty** — can he use them?
3. **Recover any physical evidence** from the rift (Essence crystals, the Bureau Field Report, dimensional residue samples)

**Key Interactions:**

**If the party is honest and thorough:**
Kang nods curtly. "Good. Clean report." He assigns them to ongoing investigation duty under Agent Rhee — a significant promotion from training missions. He authorizes access to C-Rank Bureau resources.

**If the party withholds information (about the tampered equipment, Rhee's theories, etc.):**
A DC 15 PRE (Deception) check is required. Kang's SENSE is 18 (+4 modifier), and he has proficiency in Insight (+6 total). On a failure, he doesn't call them out directly — instead, he makes a quiet note on his tablet and says: *"Interesting. Because Bureau sensors tell a slightly different story."* He assigns them to investigation duty anyway but has Deputy Director Hwang monitor their communications.

**If the party asks Kang about Gate destabilization:**
He pauses. Then: *"Gates don't destabilize. That's what we're going to find out."* A DC 16 SENSE (Insight) check reveals he's genuinely disturbed — this is not theater.

**If the party mentions the \`PROTOCOL ZERO\` notification:**
Kang's prosthetic hand clenches hard enough to crack the coffee mug. He composes himself in an instant. *"Show me your HUD log."* If the notification has vanished (which it has), he says: *"Then it didn't happen. Understood?"* His tone brooks no argument. He makes a separate note — handwritten, not on his tablet.

**Rewards and Advancement:**
- The party receives their first bi-weekly Bureau salary: **100,000 ₩ per Ascendant** (enough for living expenses and basic equipment)
- Access to **Bureau Armory** (D-Rank and C-Rank equipment; see Appendix A for available items)
- Access to **Bureau Intelligence Database** (advantage on History and Investigation checks related to Gates, Anomalies, and Ascendant organizations)
- Agent Rhee is formally assigned as their field handler

**Milestone:** Characters advance to **Level 3** at the end of this scene. At this level, each character selects their **Path** (subclass specialization).

---

### Random Encounters: Neo-Seoul Streets (Tiers 1–2)

Roll on this table when the party travels between locations in Neo-Seoul during Chapters 1–2. Roll 1d6; on a 1 or 2, an encounter occurs. Then roll 1d8:

| d8 | Encounter |
|----|-----------|
| 1 | **Micro-Gate:** A D-Rank Gate the size of a manhole cover opens in the sidewalk. 1d4 **Lesser Shadow Fiends** crawl out. Bureau response is 10 minutes away. |
| 2 | **Street Brawl:** Two unregistered Ascendants are fighting over an Essence crystal in an alley. One is a Destroyer (Level 2), the other an Assassin (Level 2). If intervened, both turn hostile. Bureau fine for unregistered fighting: 500,000 ₩. |
| 3 | **Essence Dealer:** A nervous dealer offers the party black-market Essence crystals at half price. DC 14 SENSE (Insight) to notice they're diluted (half effectiveness). If purchased, the dealer is a Null Guild acolyte gathering intel. |
| 4 | **Bureau Patrol:** A Bureau checkpoint stops the party for ID verification. Routine — unless the party is carrying contraband (unregistered Relics, stolen Essence). |
| 5 | **Gate Survivor:** A civilian stumbles out of an alley, covered in dimensional slime, mumbling about "the purple light." A micro-Gate closed behind them. They need medical attention (DC 12 SENSE/Medicine check). |
| 6 | **Media Ambush:** A GateWatch news drone spots the party. A reporter approaches asking about the Cheongdam Station incident. The Bureau has issued a gag order — talking earns Deputy Director Hwang's ire. |
| 7 | **Null Guild Graffiti:** The party spots a stylized null symbol (∅) spray-painted on a wall, with the words "THE SYSTEM IS THE CAGE" underneath. A DC 14 INT (Investigation) check reveals a hidden dead-drop behind a loose brick containing a coded recruitment pamphlet. |
| 8 | **System Glitch:** Each Ascendant's HUD flickers and briefly displays corrupted text: \`[ERROR: PROT0C0L Z3R0 — AUTH0RIZATI0N P3ND1NG]\`. It vanishes in 2 seconds. No in-game mechanical effect, but deeply unsettling. |

---
`;
}
sections.push(chapter1());
writeFileSync(OUTPUT, sections.join("\n"), "utf8");
console.log("[2/4] Chapter 1 written.");
