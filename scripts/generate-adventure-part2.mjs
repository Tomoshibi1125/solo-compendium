// Part 2: Chapters 2-3 — appended to generate-adventure.mjs
// This file is meant to be concatenated into the main script.

export function chapter2() {
	return `## Chapter 2: Bureau Investigations (Levels 3–4)

**Character Advancement:**
- Characters begin at **Level 3** (Path selection)
- Advance to **Level 4** after the Warehouse Raid (Scene 4)
- Advance to **Level 5** upon uncovering the Null Guild's connection to the Gate destabilizations (Scene 5)

**Chapter Summary:** Following the Gate destabilization, the party is assigned to investigate the cause. Their investigation takes them through Neo-Seoul's political landscape — from the gilded halls of Ascendant Corp to the grimy warehouses of the industrial docks — as they uncover the Null Guild's existence and their connection to the increasingly unstable Gate network.

**Pacing:** This chapter should take 3–4 sessions. It is the most investigation-heavy chapter and should alternate between social encounters, investigation, and combat.

---

### Scene 1: Interrogation at Bureau HQ

*Estimated Time: 45–60 minutes*
*Type: Social / Investigation*

> *Bureau Central Command, Sublevel 3 — the Intelligence Division. The corridors here are narrower, the lighting dimmer. Security cameras track your movement with unblinking red eyes. Agent Rhee leads you past rows of glass-walled offices where analysts hunch over holographic Gate maps, their faces bathed in blue light.*
>
> *She stops at a reinforced door marked "EVIDENCE PROCESSING" and swipes her badge.*
>
> *"Three hours ago, Bureau forensics finished analyzing the dimensional residue from Cheongdam Station. The results are… interesting." She pulls up a holographic display. It shows two energy signatures overlaid — one purple (the Gate's natural resonance) and one a sickly yellow-green that pulses in an irregular rhythm.*
>
> *"See that secondary signature? That's not from an Anomaly. That's from a human Ascendant. Someone was at that Gate before you — and they did something to its resonance frequency." She looks at the party. "Chief Kang has authorized a full investigation. You're on point. I'm your handler."*

**Decree Warden Information:**

Rhee presents the evidence and briefs the party on what the Bureau knows:

**Evidence Board (Share with players):**
1. **Dimensional Residue Analysis:** Confirms external interference with the Gate. The secondary signature matches no registered Ascendant in the Bureau database — either the culprit is unregistered or their signature has been deliberately masked.
2. **Surveillance Footage:** Station cameras show a "maintenance crew" of three individuals entering the tunnels 14 hours before the party. Faces are obscured by a Power effect (causes camera interference). One is carrying a metallic briefcase.
3. **Energy Decay Pattern:** The destabilization technique left a "fingerprint" — it matches energy from two other Gates that recently ranked up in different Neo-Seoul districts.
4. **Intercepted Communication (Handout #2):** Bureau signals intelligence intercepted a fragment of encrypted comms near one of the destabilized Gates. Partial decrypt reads: \`"...amplification test successful. Architect confirms resonance match. Moving to Phase Two. The Engineer approves..."\`

**Investigation Leads (players can pursue in any order):**

| Lead | Method | What They Learn |
|------|--------|-----------------|
| **Trace the maintenance crew** | INT (Investigation) DC 13 or PRE (Persuasion) DC 12 with Bureau records staff | The access request was filed under a decommissioned Bureau code. The code belongs to a project called "RESONANCE CALIBRATION" that was cancelled three years ago — by a researcher named **Ha Seung-woo**, who resigned from the Bureau shortly after. |
| **Identify the briefcase** | INT (Technology) DC 14 or SENSE (Perception) DC 15 on enhanced footage | The briefcase contains an **Essence Amplifier** — a device manufactured exclusively by Ascendant Corp's R&D Division. These devices are classified military hardware. |
| **Decode the intercepted communication** | INT (Investigation) DC 16 or use of a relevant Power | Full decrypt: "Amplification test successful at Cheongdam Junction. Architect confirms resonance match for cascade protocol. Moving to Phase Two — target high-yield Gates. The Engineer approves. Null the System." The word "Null" is used as both a verb and a proper noun. |
| **Search Bureau records for Ha Seung-woo** | INT (History) DC 11 | Ha Seung-woo was a B-Rank Esper (Psychometry Path) who worked in the Bureau's Theoretical Division. His specialty was "System Architecture Analysis." He published three papers on "dimensional resonance harmonics" before his resignation. Current whereabouts: unknown. Bureau classification: **Person of Interest — Low Priority**. |

**If Players Pursue All Leads:**
They learn that a group of rogue Ascendants with access to Ascendant Corp technology is systematically destabilizing Gates using resonance amplification. The group calls themselves (or is associated with) a "Null" organization. Their leader is referenced only as "The Engineer."

**System Favor Award:** 1 point for each player who contributes meaningfully to the investigation.

---

### Scene 2: The Ascendant Corp Gala

*Estimated Time: 60–90 minutes*
*Type: Social Infiltration*

> *Ascendant Tower, Floor 88 — The Skylounge. The elevator doors open onto a panoramic view of Neo-Seoul at night — a sea of neon and holograms stretching to the horizon. The air smells of expensive perfume, champagne, and the faint ozone tang of concentrated Essence.*
>
> *The Ascendant Corp Annual Gala is in full swing. Three hundred people fill the marble-floored ballroom — corporate executives, politicians, celebrity Ascendants, and Bureau officials in dress uniforms. Holographic displays showcase Ascendant Corp's latest products: Essence-powered smartphones, medical-grade healing vials, and — displayed behind velvet ropes — a prototype **Personal Shield Generator** that shimmers with contained force energy.*
>
> *Agent Rhee adjusts her borrowed evening dress and mutters into her comm: "I look ridiculous. Confirmed — I have eyes on Director Yoon. She's by the bar, northeast corner. Chief Kang is here too — formal capacity, Bureau liaison. Try not to start an interdimensional incident."*

**Decree Warden Information:**

The Bureau has arranged guest passes for the party to attend the Gala. Their objectives:

**Primary Objective:** Determine how Ascendant Corp Essence Amplifiers ended up in unauthorized hands.

**Secondary Objectives:**
- Identify any Null Guild sympathizers among the guests
- Gather intelligence on Ascendant Corp's classified projects
- Network with potential allies or informants

**The Gala — Key Locations:**

| Area | Description | Notable NPCs |
|------|-------------|--------------|
| **Main Ballroom** | Marble floors, crystal chandeliers, dance floor. 200+ guests. | Director Yoon, Chief Kang, various politicians |
| **VIP Lounge** | Restricted to A-Rank+ Ascendants and executives. Requires invitation or DC 16 PRE (Deception) to bluff entry. | Board members, military contractors |
| **Terrace** | Outdoor area, stunning view. Quieter, good for private conversations. | Off-duty Ascendants, socializing couples |
| **Service Corridor** | Staff-only. Connects to kitchen, storage, and a service elevator to lower floors. DC 14 AGI (Stealth) to access unnoticed. | Catering staff, security guards |
| **R&D Showcase (Floor 87)** | One floor down. Exhibits of Ascendant Corp tech, including Essence Amplifier prototypes. Guarded. | R&D staff, 2× Corporate Security Guards |

**Social Encounter Mechanics:**

Each NPC has a **Disposition** (Friendly, Neutral, Hostile) and a **Secret** they're hiding. Players use social skills to shift Disposition and uncover Secrets.

**Director Yoon Hae-rin:**
- **Disposition:** Neutral (professional, guarded)
- **Secret:** Ascendant Corp has "lost track of" twelve Essence Amplifiers from a classified shipment. She suspects internal theft but cannot allow a Bureau investigation without admitting the Amplifiers exist — they're illegal under the Geneva Accords on Dimensional Weaponry.
- **To Improve Disposition:** Compliment her company's innovations (DC 12 PRE), discuss business opportunities (DC 14 INT), or impress her with combat credentials (DC 13 by demonstrating Ascendant abilities).
- **To Learn Her Secret:** After reaching Friendly disposition, a DC 16 PRE (Persuasion) or DC 15 SENSE (Insight) check during a private conversation.
- **If Confronted Directly:** She smiles coldly: *"I'm sure I don't know what you're referring to. Enjoy the party."* Disposition drops to Hostile. She has security watch the party.

**Chief Kang (at the Gala):**
- He is here in an official capacity and does NOT want to be associated with the party's investigation publicly
- If approached discreetly, he'll mutter: *"Not here. Get what you can, get out clean."*
- He subtly slides the party a keycard — it accesses the R&D Showcase on Floor 87

**Other Gala NPCs:**

**Journalist Bae Soo-jin** (GateWatch Media): Investigating rumors of Ascendant Corp weapons deals. Friendly disposition. Will trade information for a quote about the Cheongdam incident. Knows that three Ascendant Corp employees resigned in the past month — all now untraceable.

**Captain Cho Dae-sung** (Bureau Special Operations): Kang's rival. Hostile disposition toward the party (views them as upstarts). Drunk. Will let slip that Special Ops is tracking a "ghost network" of unregistered Ascendants if his ego is stroked (DC 14 PRE Persuasion while buying him drinks).

**"Mr. Park"** (Null Guild agent): Disguised as a catering server. A DC 17 SENSE (Perception) check notices his hands are calloused like a fighter's, not a server's. A DC 18 SENSE (Insight) reveals he's watching the party. If confronted, he drops his tray and bolts — leading to an optional chase scene through the Service Corridor (Skill Challenge: 3 successes before 2 failures, DCs 13-15).

**R&D Showcase Infiltration (Floor 87):**

If the party uses Kang's keycard to access Floor 87:

The showcase is a wide-open exhibition space displaying Ascendant Corp prototypes. Two **Corporate Security Guards** (see Appendix B) patrol in a predictable pattern — DC 13 AGI (Stealth) group check to move through undetected.

Key discovery: A locked display case contains an **Essence Amplifier** identical to the one seen on the Cheongdam Station footage. A nearby terminal (DC 14 INT check to access) shows the shipping manifest for 24 Amplifiers — 12 delivered to military clients, 12 listed as "Quality Control Disposal." A DC 12 INT (Investigation) check on the disposal records reveals they were signed out by a single employee: **Technical Specialist Moon**, who resigned two weeks ago. His personnel file lists a home address in the industrial district — Pier 17.

**System Favor Award:** 1 point for each player who obtained a critical piece of intelligence without triggering security.

---

### Scene 3: Agent Rhee's Briefing

*Estimated Time: 20–30 minutes*
*Type: Information / Roleplay*

> *The Aether Lounge, Hongdae. A low-key bar catering to off-duty Ascendants, lit by mana-reactive neon that shifts color in response to the emotional state of the room — currently, a wary amber. Rhee has commandeered a back booth, her notebook open, surrounded by a scatter of printouts, photographs, and a half-eaten bowl of ramyeon.*
>
> *"Okay," she says, pushing her hair back. "Here's what we know, and here's what terrifies me."*

**Decree Warden Information:**

Rhee consolidates all the intelligence gathered so far:

1. **The Null Guild exists.** A rogue Ascendant organization, previously unknown to the Bureau, is systematically destabilizing Gates.
2. **Their weapon is the Essence Amplifier.** Stolen from Ascendant Corp, these devices can alter a Gate's resonance frequency — effectively forcing a rank-up.
3. **Their goal is unknown, but their leader is.** "The Engineer" — referenced in intercepted comms. Rhee has cross-referenced this with historical records and found a single match: an S-Rank Engineer named **Valerius**, who was declared KIA during a catastrophic S-Rank Gate clear six years ago. His body was never recovered.
4. **The next probable target.** Examination of the destabilization pattern suggests they're targeting Gates along the Han River — specifically, a cluster of three D-Rank Gates near the industrial district.
5. **Bureau politics are a problem.** Chief Kang authorized this investigation, but Deputy Director Hwang is pushing to classify the whole thing and hand it to Special Operations. If they don't produce results soon, they'll lose the case.

**Rhee's Personal Request:**
After the briefing, Rhee asks the party to stay behind. She shares something she hasn't reported:

*"Two years ago, my partner — Agent Lim — disappeared during a Red Gate investigation. The official report says he died inside. But I scanned the Gate's dimensional signature before it closed. It matched the destabilization pattern we're seeing now."* She pauses. *"Someone destabilized that Gate deliberately. And I think Lim might still be alive inside whatever dimension it opened."*

She doesn't ask the party to do anything about this yet. She just wants them to know. This plants the seed for Chapter 3.

---

### Scene 4: The Null Guild Warehouse Raid

*Estimated Time: 60–90 minutes*
*Type: Tactical Combat*

> *Pier 17. Just past midnight. Rain hammers the corrugated roofs of the abandoned warehouses, turning the unpaved roads into rivers of muddy water. Ascendant Corp shipping containers are stacked three high on either side, creating narrow canyons of rusted metal. The air smells of salt, diesel, and — faintly — the ozone tang of compressed mana.*
>
> *The warehouse at the end of the pier is the only one with lights on. A faint hum of contained Essence vibrates through the ground, felt through the soles of your boots. According to Bureau records, this warehouse belongs to Ascendant Corp's logistics division. According to the evidence trail, it belongs to the Null Guild.*
>
> *Agent Rhee checks her sidearm, a Bureau-issue Essence pistol. "Rules of engagement: capture if possible. That means alive. These are rogue Ascendants, not Anomalies. They have families."*

**Decree Warden Information:**

**Map: Pier 17 Warehouse**

The warehouse is a single-story structure, 80 ft × 60 ft, with a 20-ft ceiling. It has the following features:

**Exterior:**
- **Main Door (North):** Reinforced steel, locked. DC 15 AGI (Thieves' Tools) or DC 18 STR to force open. Doing so loudly alerts the interior.
- **Side Door (East):** Standard door, unlocked. Guarded by 1 Null Guild Enforcer.
- **Roof Access:** A rusty maintenance ladder on the south side (DC 12 Athletics to climb). Skylights provide entry but are 20 ft above the floor.
- **Shipping Containers:** Stacked around the exterior, providing cover and elevated positions.

**Interior Layout:**

| Area | Description |
|------|-------------|
| **Loading Bay (North)** | 30 × 60 ft. Stacked crates provide half cover in multiple locations. Overhead lighting. |
| **Workshop (Center)** | 20 × 30 ft. Three workbenches with Essence Amplifier components, tools, and data tablets. A **Mana Containment Ward** surrounds this area (see Hazards). |
| **Storage (South)** | 20 × 30 ft. Floor-to-ceiling shelves of stolen Relics, Essence crystals, and Ascendant Corp equipment. |
| **Office (Southeast corner)** | 10 × 10 ft, elevated on a platform. Glass walls. Contains a computer terminal and communications equipment. |

**Creatures:**

| Creature | Count | Position |
|----------|-------|----------|
| **Null Guild Enforcer** | 4 | 2 in Loading Bay, 1 at Side Door, 1 in Workshop |
| **Null Guild Esper** | 1 | In the Office, monitoring communications |
| **Specter (Park Ji-hoon)** | 1 | Arrives at the end of Round 3 if alerted |

See Appendix B for all stat blocks.

**Hazards:**

**Mana Containment Ward (Workshop):** A dome of shimmering energy surrounds the Workshop area. Any creature entering the ward must make a DC 14 INT saving throw. On failure, all Powers are suppressed for 1 round (as if in an anti-magic field). A character can disable the ward by succeeding on a DC 14 INT (Arcana/Technology) check at one of the three ward generators (small crystals at the ward's perimeter).

**Stacked Crates:** As an action, a creature adjacent to a crate stack can topple it onto a creature within 10 feet. The target makes a DC 13 AGI saving throw. On failure: 2d6 bludgeoning damage and knocked prone. On success: half damage, not knocked prone. This destroys the cover the crates provided.

**Tactics:**

- **Enforcers** use standard melee/ranged tactics. They fight in pairs, one engaging melee while the other provides covering fire. If reduced to half HP, they pop a D-Rank Healing Ampoule (2d4+2 HP).
- **The Esper** stays in the Office and casts Powers from behind glass. She uses *Dimensional Bolt* (ranged attack, 2d8 force damage) and *Mind Spike* (DC 14 INT save, 2d6 psychic damage + the Esper knows the target's location for 1 minute). If the glass is broken, she retreats to the Workshop.
- **Specter** arrives at the end of Round 3 through the main door if combat noise was detected. He is a B-Rank Assassin and prioritizes taking out the most dangerous-looking party member. He offers to parley if reduced to half HP — "Your Bureau doesn't tell you the whole truth either."

**Treasure:**
- Cache of **4× C-Rank Relics**:
  - *Mana-Weave Vest* (Light Armor, +1 AC, absorb 1d6 Power damage as reaction, requires attunement)
  - *Shadow-Thread Gloves* (advantage on Stealth checks in dim light, requires attunement)
  - *Resonance Beacon* (wondrous item, as an action create a 30-ft radius zone that suppresses illusions for 1 minute, 1/long rest)
  - *Gate Compass* (wondrous item, points toward the nearest Dimensional Rift within 1 mile)
- **Essence Crystal Cache:** 3,200 ₩ worth of refined Essence (Bureau will confiscate unless the party conceals them — DC 14 PRE Deception vs. Rhee's passive Insight of 15)
- **Data Tablets:** Contains encrypted Null Guild communications (DC 16 INT to decrypt, or can be sent to Bureau Intelligence — results arrive in Chapter 3)
- **Essence Amplifier Prototype:** Intact. Critical evidence for the investigation.

**Development:**
If Specter is defeated and captured, he can be interrogated (see Scene 5). If he escapes, the party learns the same information from the data tablets.

**System Favor Award:**
- 1 point for each player who uses the environment creatively
- 1 point for successfully disabling the Mana Containment Ward
- 1 point for capturing Specter alive

**Milestone:** Characters advance to **Level 4** upon completing the warehouse raid.

---

### Scene 5: The Informant

*Estimated Time: 30–45 minutes*
*Type: Investigation / Social*

> *Bureau Central Command, Sublevel 4 — The Pit. The interrogation rooms down here are designed to suppress Ascendant powers: walls lined with raw iron and dispersion crystals that fragment mana into harmless static. The air tastes like copper and regret.*
>
> *Specter — Park Ji-hoon — sits on the other side of the reinforced glass table. His mask has been removed, revealing a sharp-featured Korean man in his thirties with a ragged scar running from his left ear to his jaw. His hands are bound with Essence-dampening cuffs.*
>
> *He hasn't said a word in six hours. But when you walk in, he looks up. And smiles.*
>
> *"Finally. Someone who might actually listen."*

**Decree Warden Information:**

Specter is willing to talk — but only to the party, not to Bureau officials. He has two conditions:

1. **Get Rhee out of the room.** He knows Rhee's Aetheric-Sight can detect lies, and he intends to mix truth with deception.
2. **No recording.** He will check (SENSE +6).

**What Specter Reveals (All True):**

- The Null Guild's leader is **Valerius**, a former S-Rank Engineer who faked his death six years ago
- Valerius discovered something inside the System's architecture — a hidden protocol he calls "Protocol Zero"
- Protocol Zero is the System's emergency shutdown code. Invoking it would sever the connection between the System and reality
- The Null Guild believes the System is parasitic — that it harvests energy from Ascendant activity and funnels it to an entity called "the Absolute"
- Valerius needs three things to invoke Protocol Zero: **(1)** an Essence Amplifier powerful enough to broadcast the shutdown signal, **(2)** a location where dimensional barriers are thinnest (a "Rift Nexus"), and **(3)** the Protocol Zero cipher itself, which is fragmented across multiple sealed Gates

**What Specter Conceals:**

- He's already transmitted the warehouse location to the Null Guild. They're relocating.
- The "third thing" — the Protocol Zero cipher — is partially embedded in the party's phone. The \`PROTOCOL ZERO INITIALIZING\` notification wasn't a glitch; it was the cipher recognizing a compatible host.
- Specter is genuinely conflicted: he joined the Null Guild after his partner was killed in a Bureau cover-up, but he's starting to question whether Valerius's endgame is worth the cost.

**Social Skill Checks:**

| Check | DC | Result |
|-------|-----|--------|
| PRE (Persuasion) | 14 | Specter shares one concealed fact of the DW's choice |
| PRE (Intimidation) | 16 | Specter reveals the warehouse relocation but clams up afterward |
| SENSE (Insight) | 15 | Detect that Specter is holding back information (general sense, not specifics) |
| SENSE (Insight) | 18 | Detect that Specter is genuinely conflicted about the Null Guild's goal |
| INT (Investigation) | 16 | Cross-reference Specter's claims with Bureau records — confirm Valerius's "death" report has inconsistencies |

**If the Party Offers Specter a Deal:**
He will become an informant if guaranteed: (a) protection from Bureau prosecution, and (b) a promise that the party will investigate the Bureau cover-up that killed his partner. If the party agrees, Specter becomes a recurring ally — he provides Null Guild intel at the start of each subsequent chapter.

**If the Party Reports Everything to Kang:**
Kang immediately classifies the investigation. Deputy Director Hwang takes over. The party is sidelined — until Agent Rhee quietly disobeys orders and keeps them informed off-the-record. The investigation continues, but the party loses access to Bureau resources for Chapter 3.

**Milestone:** Characters advance to **Level 5** at the end of this scene.

---

### Random Encounters: Industrial District (Tiers 3–4)

Roll 1d6 when the party travels through the industrial district; encounter on a 1–2. Then roll 1d8:

| d8 | Encounter |
|----|-----------|
| 1 | **Null Guild Dead Drop:** A hidden cache containing a coded message (DC 15 INT to decode) with coordinates to a safe house. If left undisturbed, a Null Guild acolyte collects it in 1d4 hours. |
| 2 | **Essence Smugglers:** A truck loaded with refined Essence is being unloaded into an unmarked warehouse. 3× unregistered D-Rank Ascendants + 2× armed civilian drivers. |
| 3 | **Gate Eruption:** A C-Rank Gate tears open between two shipping containers. 2× **Shadow Stalkers** (CR 2) emerge. Bureau ETA: 15 minutes. |
| 4 | **Ascendant Corp Security Sweep:** A team of 4 Corporate Security Guards is searching for "stolen company property." They're looking for Essence Amplifiers and will detain anyone suspicious. |
| 5 | **Specter's Warning (if ally):** Specter contacts the party via burner phone: "Enforcers heading your way. Two B-Ranks. Take the side street." If heeded, party avoids an ambush. |
| 6 | **Collapsed Rift:** A Gate opened and closed in seconds, leaving behind a crater of dimensional residue and a single, terrified D-Rank Anomaly (a **Void Sprite** — CR 1/2, harmless unless provoked). The sprite carries a fragment of crystallized memory showing a glimpse of the Red Gate dimension. |
| 7 | **Bureau Bounty Board:** A public notice board lists current bounties for unregistered Ascendants and Gate-related crimes. One bounty is for "The Engineer — S-Rank, Extremely Dangerous. Reward: 500,000,000 ₩." |
| 8 | **System Notification:** All party members simultaneously receive: \`[SYSTEM NOTICE: DIMENSIONAL STABILITY INDEX — 73% AND FALLING. PROTOCOL CANDIDATES IDENTIFIED.]\` The notification can't be screenshotted or recorded. |

---
`;
}

export function chapter3() {
	return `## Chapter 3: The Red Gate Incursion (Levels 5–6)

**Character Advancement:**
- Characters begin at **Level 5**
- Advance to **Level 6** after surviving three days in the Red Gate (Scene 3)
- Advance to **Level 7** upon slaying the Core Guardian and escaping (Scene 5)

**Chapter Summary:** The Null Guild springs a trap. The party is ambushed during a routine Gate monitoring mission and pushed through an unstable portal into a **Red Gate** — a sealed hostile dimension that cannot be opened from the inside. The only way out is to slay the Gate's Core Guardian, a massive Anomaly that anchors the dimension to reality. Time moves differently inside: days pass within, while only seconds elapse in the real world.

This is the campaign's survival chapter. Resources are scarce, the environment is deadly, and the party must manage exhaustion, cold exposure, and rationing while hunting the Core Guardian across a frozen nightmare landscape.

**Pacing:** This chapter should take 3–4 sessions. It is the most mechanically demanding chapter.

---

### Scene 1: The Ambush

*Estimated Time: 30–45 minutes*
*Type: Combat + Transition*

> *Han River Industrial Corridor. Midnight. The Bureau tasked you with monitoring three D-Rank Gates along the riverfront — routine dimensional stability checks that any squad could handle. Agent Rhee is on overwatch from a Bureau surveillance van parked two blocks north.*
>
> *The first two Gates check out normal. The third — anchored to the underside of Mapo Bridge — does not.*
>
> *As you approach, your System HUD flickers. Static washes across your vision. Then the familiar azure interface is replaced by something you've never seen before — stark crimson text:*
>
> *\`[WARNING: DIMENSIONAL TRAP DETECTED]\`*
> *\`[GATE RESONANCE — ARTIFICIALLY DESTABILIZED]\`*
> *\`[RANK RECLASSIFIED: B-RANK — RED VARIANT]\`*
>
> *The water beneath Mapo Bridge erupts. A column of crimson energy — the Gate, forced open and blazing — splits the river like a wound. The shockwave knocks you off your feet. And from the shadows of the bridge supports, figures emerge. Black tactical gear. Featureless masks. Null Guild.*
>
> *Their leader — a tall figure carrying a humming Essence Amplifier — raises it toward the party. The device screams.*
>
> *"Nothing personal," the leader says. "The Engineer sends his regards."*
>
> *The amplifier fires. The Gate surges. The world turns red — and then there is nothing but cold.*

**Decree Warden Information:**

This is a scripted event — the party is meant to be pushed into the Red Gate. The encounter should feel overwhelming but fair.

**Ambush Forces:**
- 4× **Null Guild Enforcers** (CR 2) — positioned in two pairs flanking the party
- 1× **Null Guild Esper** (CR 4) — operating the Essence Amplifier from 60 ft away
- The Esper's action is to activate the Amplifier, creating a **Rift Pull** effect

**Rift Pull Effect:**
At initiative count 20 (losing ties), the activated Gate emits a gravitational pull. All creatures within 60 feet must succeed on a DC 15 STR saving throw or be pulled 15 feet toward the Gate. A creature that is pulled into the Gate (within 5 feet) is immediately transported into the Red Gate dimension. The Null Guild agents have anchoring devices that make them immune to the pull.

**The Fight:**
- The party has **3 rounds** before the Rift Pull becomes irresistible (auto-fail on the 4th occurrence)
- Each round, the DC increases by 1 (DC 15 → DC 16 → DC 17 → auto)
- The Null Guild Enforcers engage to prevent the party from reaching the Esper or fleeing the radius
- If the party somehow neutralizes the Amplifier (DC 18 to disable, or destroy the Esper who is concentrating on it), the Rift Pull subsides — but the Red Gate remains open and the Enforcers attempt to physically push party members through

**The Inevitable:**
When the party is pulled through the Gate, read:

> *The cold hits like a sledgehammer. The air is ripped from your lungs. Your vision floods crimson as the Gate swallows you — and then snaps shut behind you with a sound like a thunderclap played in reverse.*
>
> *Silence.*
>
> *You lie on ice. Real ice — thick, ancient, stretching to every horizon. Above, the sky is a churning canopy of blood-red nebulae shot through with veins of black lightning. The temperature is already dropping. Your System HUD stabilizes — barely — the interface struggling against the dimension's hostile mana field:*
>
> *\`[RED GATE SEALED — NO EXIT PERMITTED]\`*
> *\`[DIMENSIONAL STABILITY: 0%]\`*
> *\`[CORE GUARDIAN DETECTED — TERMINATE TO OPEN EXIT RIFT]\`*
> *\`[ESTIMATED TIME DILATION: 1 EXTERNAL SECOND = 4 INTERNAL HOURS]\`*

**What the Party Has:**
Inventory everything the party was carrying when they entered. They do NOT have access to:
- Bureau resources (no comms — the dimension blocks signals)
- Shops or merchants
- Long rest in a safe location (until they find the Ice Caves in Scene 3)
- Reinforcements

**If Rhee Was With Them:**
If the party specifically included Rhee in the field team (DW's discretion), she was pulled in as well. She is injured (half HP) but functional. She provides survival expertise (+2 to Survival checks) and emotional support ("We're not dying in here, rookies. Not on my watch."). If Rhee was NOT pulled in, she is left behind — she will spend the real-world equivalent of seconds (but the party's days) desperately trying to find a way to reopen the Gate.

---

### Scene 2: The Frozen Wastes — Day 1

*Estimated Time: 60–90 minutes*
*Type: Exploration / Survival*

> *The glacier stretches in every direction — a flat, featureless expanse of blue-white ice beneath the blood-red sky. The wind is a constant, moaning presence, driving ice crystals that sting exposed skin. The temperature is well below freezing and dropping.*
>
> *Your System HUD displays a compass bearing — a faint golden arrow pointing northeast. Beneath it: \`[CORE GUARDIAN: BEARING 047° — DISTANCE: UNKNOWN]\`. The arrow pulses slowly, like a heartbeat.*
>
> *There is nothing else. No landmarks. No shelter. No sound but the wind.*

**Decree Warden Information:**

**Red Gate Survival Rules:**

The Red Gate dimension operates under the following environmental rules:

**Extreme Cold:**
Every 4 hours spent outside shelter, each character must succeed on a DC 14 VIT saving throw or gain 1 level of **Exhaustion**. Characters wearing cold-weather gear (which the party does NOT have unless they prepared for it) have advantage on this save. Characters resistant to cold damage automatically succeed.

**Food and Water:**
- The dimension has no natural food sources except Ice-Fang Wolf meat (must be hunted)
- Ice can be melted for water (requires fire — a Power or improvised firepit)
- Going 24 hours without food requires a DC 10 VIT save (DC increases by 5 per day) or gain 1 Exhaustion
- Going 24 hours without water is DC 15 VIT or gain 2 Exhaustion levels

**Time Dilation:**
1 second in the real world = 4 hours inside the Red Gate. The party will spend approximately 3–5 days inside. In the real world, less than 2 minutes will pass.

**Navigation:**
The System HUD compass points toward the Core Guardian. The party must travel approximately 3 days to reach its lair. Each day of travel, the party covers 8 hours of movement across the ice.

**Day 1 Events (in order):**

**Hour 2 — The Blood Ice Field:**
> *The glacier's surface changes. What was smooth blue ice becomes cracked and stained — great frozen pools of dark, viscous liquid that doesn't quite look like blood but SMELLS like it. The stains are old. Very old. Something fought here once, on a scale that's difficult to comprehend.*

A DC 14 INT (Investigation) or SENSE (Nature) check reveals these are the remains of an ancient battle between Anomalies — the blood is dimensional, not biological. A DC 16 check reveals a partially buried object: a **Frost-Touched Blade** (see Appendix A) — a longsword encased in dimensional ice. A DC 14 STR check breaks it free.

**Hour 4 — First Cold Check:**
The party makes their first VIT saves against Extreme Cold.

**Hour 5 — Wolf Signs:**
> *You find tracks in the ice. Large — each print the size of a dinner plate, sunk deep with the weight of something massive. The prints glow faintly blue-white, as if the creature that made them left frozen mana in its wake. There are many tracks. They circle back on themselves. Something is following you.*

A DC 13 SENSE (Survival) check determines:
- There are 4–6 wolves tracking the party
- They are staying upwind and maintaining a 200-foot distance
- They will not attack during daylight (such as it is) — they're evaluating threats

**Hour 6 — Shelter Decision:**
The party must decide whether to:
- **Keep moving:** Cover more distance but face another Cold check in 2 hours
- **Make camp:** Find or create shelter. A DC 14 SENSE (Survival) check locates a crevasse in the glacier large enough to shelter the party from wind. Alternatively, a character can use an action and succeed on a DC 12 INT check to build a snow shelter. Inside either, Cold checks are made at DC 10 instead of 14.
- **Set a watch:** If the party doesn't set a watch, the wolves attack at midnight (see below)

**Hour 12 — Night Attack (if no watch is set or watch fails):**

3× **Ice-Fang Wolves** (CR 1; see Appendix B) attack the camp. They target sleeping characters and attempt to drag them away from the group.

If a watch IS set, the watchkeeping character makes a DC 14 SENSE (Perception) check. On success, they spot the wolves approaching and can wake the party (no surprise). On failure, the wolves get a surprise round.

After defeating the wolves:
- Wolf pelts can be fashioned into crude cold-weather gear (1 pelt per character, requires DC 12 SENSE/Survival and 1 hour of work). This gives advantage on Cold checks.
- Wolf meat provides 2 days of rations per wolf.
- A DC 13 INT (Nature) check on the wolf remains reveals they are not natural wolves — they are Anomalies native to this dimension, sustained by the same energy that powers the Red Gate.

---

### Scene 3: The Ice Caves — Days 2–3

*Estimated Time: 60–90 minutes*
*Type: Dungeon Crawl / Exploration*

> *By the second day, the glacier gives way to ice cliffs — towering walls of ancient blue ice riddled with cave openings that look like hollow eyes. Your System HUD compass arrow dips downward, pointing into the earth. The Core Guardian is underground.*
>
> *The largest cave opening — 30 feet wide, 20 feet tall — exhales a plume of visible cold that freezes your breath solid. Carved into the ice on either side of the entrance are symbols — geometric patterns that pulse with faint mana light. They look deliberate. Designed.*
>
> *Something built this place.*

**Decree Warden Information:**

The Ice Caves are a three-level dungeon carved into the glacier. They serve as the Core Guardian's lair but were originally built by a long-dead civilization that existed within this dimension.

**Map: The Ice Caves**

**Level 1 — The Throat (Entry Level)**

| Room | Description | Contents |
|------|-------------|----------|
| **1A. Entry Hall** | 40 × 30 ft. High vaulted ceiling of translucent ice. Ancient pillars carved with dimensional runes. Well-lit (ambient glow from runes). | 2× **Ice-Fang Wolves** (CR 1) are denning here. They can be bypassed with DC 14 AGI (Stealth) or driven off with DC 13 PRE (Intimidation). |
| **1B. Frozen Gallery** | 60 × 20 ft corridor. Walls contain frozen figures — humanoid shapes trapped in the ice. | DC 14 INT (Investigation): The figures are wearing armor and carrying weapons from a civilization that doesn't match any known culture. They died fighting. Some are holding **Mana Crystals** (worth 200 ₩ each, 1d6 found). |
| **1C. The Fork** | Junction. Three tunnels branch off: left (Level 2), center (dead end with trap), right (shortcut to Level 3). | DC 13 SENSE (Perception) to detect cold air currents and determine which passage leads deeper. |
| **1D. Trap Corridor (Center)** | 40 × 10 ft. Smooth ice floor. | **Trap: Ice Slide.** The floor is angled imperceptibly. When weight is applied, the entire section slides forward into a 30-foot pit. DC 14 SENSE (Perception) to detect. DC 15 AGI save to avoid. Fall: 3d6 bludgeoning damage. Climbing out: DC 13 Athletics. |

**Level 2 — The Gullet**

| Room | Description | Contents |
|------|-------------|----------|
| **2A. Wolf Den** | 50 × 40 ft irregular cave. Floor covered in gnawed bones and frozen offal. Strong animal stench. | 4× **Ice-Fang Wolves** (CR 1) + 1× **Ice-Fang Alpha** (CR 3; see Appendix B). The Alpha is a massive wolf with frost-blue fur and one blind eye. It fights to the death to protect the den. |
| **2B. Frozen Armory** | 30 × 20 ft. Alcoves carved into the walls hold equipment from the extinct civilization. Most is deteriorated — but some is preserved by the cold. | **Treasure:** *Glacial Shield* (shield, +2 AC, once per long rest as reaction reduce cold damage by 2d6); *Void-Glass Dagger* (dagger, deals force damage instead of piercing, glows purple near Anomalies); 4× **C-Rank Healing Ampoules** (restores 4d4+4 HP). |
| **2C. The Resonance Chamber** | 40 × 40 ft perfect circle. The walls hum with dimensional energy. A pedestal at the center holds a glowing crystal orb. | The orb is a **Dimensional Compass** — it shows a real-time map of the dimension, including the Core Guardian's location (Level 3, Room 3C). Touching the orb triggers a vision: the party sees the dimension's creation — a Gate opening, an ancient civilization being consumed, and a massive creature being placed here as a guardian by an unknown force. The vision reveals the Core Guardian's weakness: the crystal weak point on the back of its neck (see Scene 5). |

**Level 3 — The Stomach (Core Guardian's Lair)**

| Room | Description | Contents |
|------|-------------|----------|
| **3A. The Approach** | 100 × 30 ft grand hall. Ceiling 50 feet high. Pillars of ice, each containing a frozen Anomaly — lesser creatures consumed by the Guardian. | The approach is silent. Unnervingly so. The temperature drops to -40°C. All water and liquids begin to freeze. Torches/fire sources are extinguished unless magical. |
| **3B. Antechamber** | 40 × 40 ft. The floor is mirror-smooth ice. | **Hazard: Black Ice.** The floor is frictionless. Any creature that moves more than half its speed must succeed on a DC 13 AGI (Acrobatics) check or fall prone. Fighting on the ice imposes disadvantage on melee attack rolls unless a creature takes an action to brace (anchoring with a weapon or Power). |
| **3C. The Core Chamber** | 80 × 80 ft circular cavern. Ceiling 60 feet high. At the center: the Core Guardian. | **The Armored Frost Troll** — see Scene 5. |

**Milestone:** Characters advance to **Level 6** upon reaching the Core Chamber.

---

### Scene 4: Rest and Recovery

*Estimated Time: 15–30 minutes*
*Type: Roleplay / Resource Management*

Between the Ice Caves exploration and the boss fight, the party should have an opportunity for a long rest in Room 2B (the Frozen Armory) or Room 2C (the Resonance Chamber). Both are defensible positions.

During the rest, encourage roleplay:
- Characters discuss their fears, their motivations, whether they trust the Bureau
- If Rhee is present, she talks about Agent Lim — showing vulnerability
- The System HUD displays intermittent messages: \`[CORE GUARDIAN APPROACHING DORMANCY CYCLE]\`, suggesting the boss will be weakest during its "sleep" phase (see Scene 5 tactics)

---

### Scene 5: The Core Guardian

*Estimated Time: 60–90 minutes*
*Type: Boss Combat*

> *The Core Chamber. The air here is so cold it burns. Your breath doesn't fog — it crystallizes instantly into tiny diamonds that tinkle to the floor. The walls of the circular cavern are carved with vast murals depicting a cycle: a Gate opening, a world dying, a creature sleeping, a Gate closing. Over and over. An eternal loop.*
>
> *At the center of the chamber, surrounded by a ring of frozen pillars, it waits.*
>
> *The Armored Frost Troll is the size of a bus. It hunches on four massive limbs, its body encased in plates of living ice that shift and crack with each slow, measured breath. Its face is a nightmare — a lipless jaw filled with translucent ice-teeth, and four eyes that glow with cold blue light. Each eye tracks independently, scanning the room in lazy sweeps.*
>
> *Embedded in the back of its neck, partially hidden by the ice armor, you can see it: a crystal the size of a fist, pulsing with the same crimson energy as the Gate that brought you here. The Core.*
>
> *It knows you're here. It has known since you entered its territory. It was waiting.*
>
> *It opens its mouth. The sound that emerges is not a roar — it is the sound of a glacier calving into the sea. The room trembles.*
>
> *\`[CORE GUARDIAN ENGAGED]\`*
> *\`[TERMINATE TO OPEN EXIT RIFT]\`*

**Decree Warden Information:**

**The Armored Frost Troll — B-Rank Gate Boss**

*Huge Aberration (Anomaly), Chaotic Evil*

**Armor Class:** 16 (Natural Armor — Living Ice Plates)
**Hit Points:** 152 (16d12 + 48)
**Speed:** 30 ft., climb 20 ft.

| STR | AGI | VIT | INT | SENSE | PRE |
|-----|-----|-----|-----|-------|-----|
| 20 (+5) | 8 (-1) | 17 (+3) | 6 (-2) | 14 (+2) | 8 (-1) |

**Saving Throws:** STR +8, VIT +6
**Damage Resistances:** Cold; Bludgeoning, Piercing, and Slashing from nonmagical attacks
**Damage Immunities:** Cold
**Damage Vulnerabilities:** Fire
**Condition Immunities:** Charmed, Frightened, Exhaustion
**Senses:** Tremorsense 60 ft., Darkvision 120 ft., passive Perception 12
**Challenge Rating:** 7 (2,900 XP)
**Proficiency Bonus:** +3

**Traits:**

***Ice Regeneration.*** The Frost Troll regains 10 hit points at the start of its turn if it has at least 1 hit point. If the Troll takes fire damage, this trait doesn't function at the start of the Troll's next turn. The Troll is destroyed only if it starts its turn with 0 hit points and doesn't regenerate.

***Living Armor.*** The Frost Troll's ice plates absorb the first 5 points of damage from each attack (except fire damage, which bypasses the plates entirely).

***Core Vulnerability.*** The crystal on the back of the Troll's neck is its weak point. A creature that is behind the Troll and succeeds on an attack roll against AC 18 (the crystal is small and partially covered) deals an extra 2d6 damage and suppresses the Troll's Ice Regeneration for 1 round. If the Resonance Chamber vision was received, attacker has advantage on this special attack.

***Glacial Aura.*** Any creature that starts its turn within 10 feet of the Frost Troll takes 5 (1d10) cold damage. Water and non-magical liquids within 10 feet freeze solid.

**Actions:**

***Multiattack.*** The Frost Troll makes two attacks: one with its Slam and one with its Bite.

***Slam.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 14 (2d8 + 5) bludgeoning damage plus 4 (1d8) cold damage. If the target is Medium or smaller, it must succeed on a DC 16 STR saving throw or be knocked prone.

***Bite.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 11 (1d12 + 5) piercing damage plus 7 (2d6) cold damage. If the target is prone, this attack deals an additional 7 (2d6) cold damage.

***Glacial Breath (Recharge 5–6).*** The Frost Troll exhales a 30-foot cone of freezing air. Each creature in the area must make a DC 14 VIT saving throw. On a failed save, a creature takes 22 (4d10) cold damage and its speed is reduced by half until the end of its next turn. On a successful save, a creature takes half damage with no speed reduction.

**Lair Actions:**

On initiative count 20 (losing initiative ties), the Core Guardian can take one lair action. It can't use the same lair action two rounds in a row:

- **Ice Spikes:** Spears of ice erupt from the floor in a 15-foot line. Each creature in the line must make a DC 14 AGI saving throw, taking 10 (3d6) piercing damage on a failed save, or half on a success.
- **Freeze the Floor:** A 20-foot radius area of floor becomes frictionless black ice for 1 round. Creatures entering or starting their turn in the area must succeed on a DC 13 AGI check or fall prone.
- **Glacial Roar:** The Troll unleashes a reverberating roar. All creatures within 30 feet must succeed on a DC 13 SENSE saving throw or be frightened until the end of their next turn.

**Phase 2 — Below Half HP:**

When the Frost Troll drops below 76 HP, read:

> *The Troll staggers. For one moment, you think it's dying. Then the ice plates on its body begin to crack — and GROW. New layers of armor erupt from beneath the old, sharper, more angular. The Troll's eyes blaze brighter. The core crystal on its neck pulses faster, flooding the room with crimson light.*
>
> *\`[CORE GUARDIAN ENTERING SURGE STATE]\`*

Phase 2 changes:
- **AC increases to 17** (thicker ice plates)
- **Living Armor threshold increases to 8** (absorbs 8 damage per hit)
- **Gains Legendary Resistance (2/day):** If it fails a saving throw, it can choose to succeed instead
- **Gains a new action — Avalanche Stomp (1/round, bonus action):** Slam both fists into the ground. All creatures within 15 feet must make a DC 15 STR saving throw or be knocked prone and pushed 10 feet away.

**Tactics:**
- The Troll opens with Glacial Breath, targeting the largest cluster of characters
- It focuses Slam attacks on melee fighters and tries to knock them prone for Bite follow-ups
- It uses lair actions to control the battlefield — Ice Spikes to punish ranged attackers, Freeze the Floor to hamper melee
- In Phase 2, it becomes more aggressive — Avalanche Stomp to scatter the party, then pursue the healer/caster

**Victory:**

When the Frost Troll reaches 0 HP and fails to regenerate:

> *The Troll shudders. Its ice armor cracks — not reforming this time. The cracks spread, racing across its body like fault lines in a glacier. With a final, almost mournful sound, the Core Guardian collapses. The ice plates shatter into a thousand glittering fragments.*
>
> *The core crystal on its neck pulses once — twice — then blazes with golden light and shoots upward, hovering in the air above the remains. It reshapes itself, elongating, becoming a key — an ornate golden Relic that drops gently into the outstretched hand of the nearest Ascendant.*
>
> *\`[CORE GUARDIAN TERMINATED]\`*
> *\`[EXIT RIFT OPENING IN 60 SECONDS]\`*
> *\`[RELIC ACQUIRED: THE REGENT'S KEY]\`*
>
> *The walls of the cavern tremble. Cracks of crimson light split the ceiling. A portal — golden, warm, smelling of rain and asphalt — tears open at the far end of the chamber. Through it, you can see the underside of Mapo Bridge. The real world. Home.*

**Treasure:**
- **The Regent's Key** (B-Rank Relic; see Appendix A) — a golden key-shaped Relic that resonates with the System's deepest protocols. It grants the holder advantage on SENSE checks related to Anomalies and Gates, and it *hums* in the presence of other Regents or Regent-aspiring Ascendants. Its true purpose is revealed in Chapter 4.
- **Frost Troll Core Fragments** (5× B-Rank Essence Crystals, value 5,000 ₩ each)
- **Troll Ice Plate** (Material Component — can be fashioned into a +1 shield or armor by a skilled craftsman, value 15,000 ₩)

**Milestone:** Characters advance to **Level 7** upon returning to the real world.

---
`;
}
