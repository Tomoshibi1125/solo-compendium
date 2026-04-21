import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 29-30
// Part VI: Bureau District Headquarters (10 keyed rooms)
//          Vermillion Guild Hall (10 keyed rooms)
// ============================================================================
// Every NPC referenced is canonical to `sandbox-npcs.ts`. Every item, sigil,
// tattoo, rune, spell, technique, and power is name-linked to its compendium
// file; stat blocks live there. The module provides context, not duplication.
// ============================================================================

export const chaptersPart6: SandboxChapter[] = [
	{
		title: "Chapter 29: Bureau District Headquarters — Keyed Rooms",
		content: `# Bureau District Headquarters — Keyed Rooms

> *"A Bureau is a monument built by people who refuse to let a lesson stay learned."*
> — Commander Park Jae-won, private notebook, year unknown

## Overview

The **Yongsan Federal Building** is the Bureau's forward operations base for the entire Restricted Zone. Its 4th Floor is the only space still under Bureau control. The other floors are abandoned, flooded, or leaking mana. This chapter keys every room of the 4th Floor for use as a **hub**, an **investigation site**, or a **faction-crisis arena** depending on the party's Bureau reputation and campaign state.

**Hub Role**: The party returns here between Gates. Every room has a function, an NPC, and at least one canon-linked reward or service.

**Deity Alignment**: The Bureau's institutional faith is split between **Solara (The Brightest Fragment)** — the pragmatic Bureau Command prays to Solara's old discipline — and **Vaelen (The Eternal of White Flame)** — the field operatives revere Vaelen's trial-by-fire. Old Man Crane, when he visits, leaves a small offering at Solara's desk-shrine in Room 1.

**Awoko Infiltration**: One Bureau NPC is canonically an Awoko Cult mole — **The Hollow Man** *(see \`sandbox-npcs.ts\` npc-awoko-005)*. His position rotates between Rooms 4, 5, and 8. He is discoverable via careful observation and specific handouts.

---

## Room 1 — The Lobby & Solara's Desk Shrine
*(Ground floor, public entrance)*

A reinforced lobby. Two Bureau constables at the metal detector. A small unofficial shrine in the corner: a statue of a sun-bronze sparrow — **Solara's Brightest Fragment** — under a cracked glass dome. A bowl of dried citrus peel sits beside it. The Bureau knows the shrine is there. The Bureau has not made a ruling on it.

- **NPCs present**: 2× Bureau constable (unnamed, use \`anomalies/rank-d.ts\` human-spec block if combat happens; normally friendly).
- **Services**:
  - **Ascendant Rank check-in** — mandatory on first visit. Bureau adjusts the party's rank profile.
  - **Bulletin Board**: current Gate Surge bounties; *"Bounty: The Executioner"* handout posted here.
- **Interaction**: a PC who bows at Solara's shrine and leaves any small token of value (≥10 Credits-worth) earns the shrine's blessing — **once per campaign**, they may reroll a single failed save against a Regent-aligned effect. This is a **paths.ts**-flavored benediction; paths aligned with Solara get it free.
- **Deity flavor**: Solara. Small mercies. A statue nobody officially sanctioned.

## Room 2 — Relay & Dispatch
*(4th floor, central hub)*

Fluorescent lights, twelve monitors, three dispatch officers. The room hums with radio traffic. **Relay Officer Reyes** (see side quest hooks in Chapter 18) works the night shift.

- **NPC**: **Relay Officer Reyes** — Contractor, level 4. Canon: can be persuaded, bribed, or appealed-to via Commander Park's approval to transmit orders on the party's behalf (Chapter 18, Quest 4: Torch's Redemption).
- **Services**:
  - **Mana-relay broadcasting** — 1,000 Credits per citywide broadcast.
  - **Live Gate status** — all 19 Gates listed with current Blue Phase countdowns.
- **Investigation**: DC 15 Investigation on the relay logs uncovers **4 missing broadcasts** in the last 48 hours. Those broadcasts, when reconstructed, reveal Agent Blackwood's private channel traffic (ties to **Warden Secret: Agent Blackwood's Mission**).
- **Deity flavor**: Xylo. Every dispatch broadcast is a record; the Bureau inherited Xylo's old discipline of *write everything down*.

## Room 3 — The Briefing Hall
*(4th floor, central)*

A large conference room. Whiteboards mapping the 19 Gates. A long table scarred with coffee rings and mana burns. This is where the party is first briefed (**Chapter 1**) and where they return after every major Gate clear.

- **NPC**: **Commander Park Jae-won** — if he's not in his office (Room 7), he's here pinning things to the whiteboard.
- **Services**:
  - **Gate Assignment** — Park allocates the party's next Gate based on district threat tier + party level.
  - **Mission Debrief** — after each Gate clear, Park pays the bounty and adjusts Bureau reputation.
  - **Training simulations** — at **Allied** Bureau reputation, Park unlocks **simulated Gate drills** here. Pull mechanics from \`techniques.ts\` training entries; each drill costs 1,000 Credits and grants advantage on the party's next Intelligence/Presence check in a Gate.
- **Handout pickup**: the **Bureau Emergency Bulletin** is on the whiteboard and can be claimed as a handout.
- **Deity flavor**: Vaelen. White Flame's principle: *the training is the war*.

## Room 4 — The Armory
*(4th floor, north wing, reinforced door)*

A reinforced vault. Shelves lined with **Bureau-issue equipment** — pulled from \`items-base-equipment.ts\`. A quartermaster's counter. Security cameras (DC 15 Sense to spot the blind spot).

- **NPC**: **Quartermaster Lin** — canonical NPC (potential betrayer, see Chapter 24 Mana Reading Card 5). Lin runs requisitions.
- **Services** (canon inventory — pull stat blocks from \`items-base-equipment.ts\` and \`items-part1.ts\` / \`items-part2.ts\` as needed):
  - Standard Bureau pistol, Bureau rifle, Bureau shotgun — issue free at E-Rank; replacement costs at higher ranks.
  - Bureau kevlar tactical vest — D-Rank and above.
  - Bureau tactical helmet with integrated mana-sight — C-Rank and above.
  - Bureau combat knife — free.
  - Mana rations (2d4 per long rest) — free.
  - Mana-battery spare cells — 50 Credits each.
- **Bureau Allied unlock**: one item per campaign from \`relics-comprehensive.ts\` of **Rare or below** — Warden's call based on party composition.
- **Black spot**: a locked footlocker at the back of the armory is marked BLACKWOOD. DC 18 Investigation + Bureau **Trusted** reputation to inspect. Inside: one Regent Relic (if Chapter 24 Mana Reading Card 3 rolled a 9: *"Agent Blackwood has it hidden in her footlocker (she doesn't know what it is)"*).
- **Deity flavor**: Golem (Unyielding Stone). The Armory's discipline is unglamorous. It holds.

## Room 5 — Evidence Locker & Anomaly Vault
*(4th floor, north wing, secondary vault)*

A refrigerated evidence locker. Shelves of confiscated artifacts, Cult paraphernalia, Anomaly cores in glass. **Dr. Serin Hayashi** has a workbench here two nights a week; the Bureau technically disapproves, and officially allows it.

- **NPC**: **Dr. Serin Hayashi** — level 6 Technomancer (canon). Her specialty: Anomaly biology and Gate metaphysics.
- **Services**:
  - **Anomaly core appraisal** — Hayashi pays 100% Bureau rate (vs. Vermillion's 150%) but offers **research trade**. Trading a B-Rank+ core for "research access" gives the party a free **Ascendant Rune** from \`runes/spell-rank-b.ts\` or \`runes/technique-techniques.ts\`.
  - **Handout**: at Bureau Friendly reputation, Hayashi hands the party her **Research Brief: Regent Entities** *(canonical handout)*.
  - **Autopsy** — after the Memory-Care Wing, Hayashi can autopsy *The Diagnosed*'s remnants. Adds a new handout (**Dr. Hayashi's Autopsy Report on The Diagnosed**, to be added in Phase 4).
- **Services at Trusted**:
  - **Second Awakening ritual** — per Chapter 24 Mana Reading Card 1 Option 2 ("Donate 1 B-Rank+ Anomaly core to Dr. Hayashi's research").
  - **Cure for Gate Rot** — for PCs afflicted by Chapter 23's Gate-Rot encounters.
- **Deity flavor**: Xylo. Hayashi is Xylo's modern priest — a rationalist archivist who still takes notes on what she refuses to publish.

## Room 6 — The Morgue & Echo Room
*(4th floor, back wing, cold)*

A refrigerated morgue with 12 drawers. Eight are currently occupied. At the back, a small unmarked door leads to the **Echo Room** — a Bureau black-site where slain Anomaly cores are submerged in mana-saline to extract *echo imprints*.

- **NPC** *(occasional)*: **Ghost** (canon NPC, potential PC background per Chapter 25 Ascendant Hooks) sometimes appears here without explanation. Staff do not remember letting them in.
- **Investigation**:
  - DC 14 Sense: one of the bodies in the drawers has **heterochromatic eyes** matching Ghost's *Redacted Bureau ID* handout.
  - DC 18 Investigation: the Echo Room's mana-saline tanks contain a single non-Anomaly specimen — a **human arm**, preserved, wearing a wedding band. The arm's mana-signature reads as **S-Rank** and 50+ years old. *(Warden: this is a potential ambiguity seed — is this a piece of the Regent's past self?)*
- **Services**:
  - **Core echo-reading** (1,000 Credits, Bureau Trusted): hear a single sentence from the Anomaly's last living memory.
- **Deity flavor**: Kael Voss (The Weaver of the Absolute). Kael Voss reaps. The Echo Room is his lab, repurposed.

## Room 7 — Commander Park's Office
*(4th floor, corner, glass wall overlooking the Han River)*

A quiet office. A single desk, a window, a framed photograph of an 18-man strike team circa 2019. Park is in four of the faces. The other fourteen have been quietly mourned.

- **NPC**: **Commander Park Jae-won** — S-Rank retired (canonical). Park's backstory: Seoul Cascade 2019, lost fourteen of his team, refused a Council promotion afterwards, reassigned himself to frontline Bureau operations.
- **Handouts**:
  - **Warden Secret: Orin's Past** — if Park trusts the party enough to open his bottom drawer.
  - **Park's confession letter** — a letter never sent, addressed to the families of his dead squad. Canonical to add in Phase 4.
- **Services**:
  - **Commendations** — Park issues a Bureau commendation to the party after every A-Rank+ Gate clear. +1 Bureau reputation per commendation.
  - **Council leverage** — at Bureau **Allied**, Park will vouch for the party to Bureau Council. This unlocks access to the **Council Archive** (Phase 4 handout).
- **Deity flavor**: Solara. Park prays to small mercies. His office has no shrine, but the window faces east.

## Room 8 — Holding Cells
*(4th floor, back wing, reinforced)*

Three cells. Two currently hold Awoko Cult prisoners captured during the Surge. One holds a civilian whose mana-signature reads as "Gate-exposed" — the Bureau is unsure whether to treat them as victim or evidence.

- **NPCs**:
  - **Acolyte Mara** (canonical npc-awoko-006) — young Cult initiate, potential redemption quest. Will talk to the party if approached with compassion (Sense check DC 12). At **Vermillion Friendly**, Mother Rust has left her a note of sanctuary.
  - **Unnamed civilian** — can be investigated for Gate-Rot (DC 14 Investigation) or Regent-Marked condition (DC 16 Sense, using \`conditions.ts\` *Regent Marked*).
- **The Hollow Man risk**: if the party has not yet discovered the Awoko mole, this is where he may poison one of the prisoners to prevent them talking.
- **Services**:
  - **Interrogation** — party may attempt to extract information (DC 14 Presence).
  - **Bribery/Rescue** — Mara can be helped to escape with Vermillion Guild support.
- **Deity flavor**: Nyx (The Eternal of Fangs). Predator and prey, both held in cages.

## Room 9 — The Relic Exam Room
*(4th floor, south wing, warded)*

A mana-warded examination room where the Bureau studies confiscated Relics and artifacts. **Professor Lun** works here — not a deity (canonical clarification). He is a Mage specializing in Relic metaphysics.

- **NPC**: **Professor Lun** — Mage, level 5, canon. (*Confirmed not a deity.*)
- **Services**:
  - **Relic identification** — for any relic/artifact the party has looted, Lun will identify it (consulting \`relics-comprehensive.ts\` / \`artifacts.ts\` / \`sigils.ts\`). Fee: 1,000 Credits.
  - **Sigil appraisal** — identifies a sigil's tier and ideal mount per \`sigils.ts\`.
  - **Rune decoding** — if the party finds a rune with unknown origin (e.g., Megadungeon Floor −2 Room 10 reward), Lun decodes it. Fee: 2,000 Credits.
- **Canonical tie-in**: Lun's Mana Vein detonation ability (Chapter 24 Mana Reading Card 6) is flagged here — Lun has three mana-vein sensors on his workbench.
- **Deity flavor**: Xylo. Lun is the Archivist's deputy for obscure metaphysics.

## Room 10 — The Roof Heliport
*(4th floor exterior)*

A concrete pad with a Bureau VTOL on permanent standby. Rotor blades covered in tarp. The party can hear the rotor-wash from the S-Rank portal vibrating against the blades.

- **NPC** *(pilot)*: **Lieutenant Dae-sun** — minor NPC, Stalker level 3. Canon: flies the VTOL for Bureau-sanctioned missions.
- **Services**:
  - **Rapid insertion** — to any Gate in the district (2,000 Credits, Bureau Friendly).
  - **Medical evacuation** — from a Gate's exterior zone. Costs 500 Credits per party member evacuated; saves long-rest-distance travel.
- **VTT Scene anchor**: this is the scene for the **final mana-relay** before the Regent's Domain assault (Chapter 28 Megadungeon entry).
- **Deity flavor**: Sylph (The Eternal of Transfiguration). The winds that carry ascendants between worlds. The heliport is Sylph's altar, whether the Bureau knows it or not.

---

## Bureau Reputation Milestones

| Reputation | Unlock |
|------------|--------|
| Neutral | Basic services; no free gear |
| Friendly | Free mana rations; Hayashi's Research Brief handout |
| Trusted | Second Awakening ritual (Hayashi); Park's bottom drawer; armory rare item |
| Allied | Commander Park vouches to Council; training drills; Blackwood's footlocker (if Relic inside) |
`,
	},
	{
		title: "Chapter 30: Vermillion Guild Hall — Keyed Rooms",
		content: `# Vermillion Guild Hall — Keyed Rooms

> *"Survive First. Obey Later."*
> — Vermillion Guild manifesto, posted on every telephone pole within two blocks

## Overview

The **Vermillion Guild Hall** is a three-story repurposed textile warehouse in the Lower City commercial district, three blocks from the Bazaar. Its ground floor is the public bazaar-front; the upper floors house the Guild's leadership, training, medical, and *unofficial* facilities. The Guild runs on the principle that the Bureau's Gate quotas are getting D-ranks killed — so Vermillion sells better gear at lower markup, trains faster, and questions fewer moral shortcuts.

**Deity Alignment**: The Guild's working-class creed leans on **Nyx (The Eternal of Fangs)**. *"Beneath all your Order enhancements, you are still predator and prey."* Guildmaster Orin wears a small silver fang on a chain he never takes off.

**Awoko Adjacency**: The Guild has a non-aggression pact with the Awoko Cult — purely commercial, and it disgusts Orin. The Cult pays Vermillion to ignore specific back-alley traffic. **Mother Rust**, a Guild member, is *becoming* Cult-adjacent over the campaign (Chapter 24 Mana Reading Card 5 betrayer option 7). Her gradual corruption is a canonical B-plot.

---

## Room 1 — The Bazaar Front
*(Ground floor, street-facing)*

A large open-air market stall that extends into the warehouse's loading dock. Tents, lanterns, bolts of mana-thread, crates of Anomaly cores. The air smells of incense and ozone. **Rat-King Ji** works the front.

- **NPC**: **Rat-King Ji** — Stalker, level 6 (canonical). Ji is the Bazaar's official face and unofficial intel broker.
- **Services**:
  - **Anomaly core buy-back** at **150% Bureau rate** (Guild manifesto promise).
  - **Information trade** — Ji knows what every faction is doing. Fees: 200–2,000 Credits depending on sensitivity.
  - **Contraband** — minor contraband items pulled from \`items-part3.ts\` and \`items-part4.ts\` (weapons, stimulants, masking-spray for evading Bureau scanners).
- **Canonical hook** *(Ch. 18 Quest 7: sabotage Cult water-Gate device — already in canon)*: Ji is the quest-giver.
- **Deity flavor**: Nyx. Ji smiles when he's lying. He is lying slightly less than the Bureau.

## Room 2 — Guildmaster Orin's Chamber
*(Third floor, east corner, austere)*

A single room with a low table, floor cushions, a tea set, and a katana on a stand. Orin drinks tea. He does not lead from an office. He leads from this room.

- **NPC**: **Guildmaster Orin** — level 9 Contractor (canonical). Veteran of Seoul Cascade 2019. Former Bureau S-Rank, court-martialed, founded Vermillion.
- **Services**:
  - **Guild induction** — at **Friendly** Vermillion reputation, Orin offers the party a **Vermillion Guild card**. No mechanical effect except unlocking back-room services.
  - **Faction arbitration** — Orin mediates disputes between Bureau, Vermillion, and civilian factions.
  - **Regent counsel** — at **Trusted**, Orin shares his 2019 Seoul Regent Gate combat notes. Adds +1 insight to the party's Phase 1 of Chapter 16.
- **Handout**: **Warden Secret: Orin's Past** — revealed if the party shows Orin the **Ghost's Redacted Bureau ID** canonical handout.
- **Deity flavor**: Vaelen. The White Flame disciplined him. The tea set is a measured act of defiance: he survived.

## Room 3 — The Black Market
*(Second floor, back alley entrance, mana-muffled)*

A reinforced back room run by an anonymous broker. No named NPC — the shopkeeper is intentionally generic to let Wardens improvise.

- **Services**:
  - **Gray-market gear** — items the Bureau has banned but that Vermillion stocks. Pull from \`items-part5.ts\` and \`items-part6.ts\` (hallucinogenic mana-augments, combat stimulants, banned Runes).
  - **Banned Runes** — specifically the **A-tier offensive Runes** from \`runes/spell-rank-a.ts\` that the Bureau restricted after the Seoul Cascade. Vermillion sells them at 3× market rate.
  - **Identity laundering** — replace Bureau ID with Guild ID (loses Bureau reputation access; gains +1 Vermillion reputation).
- **Deity flavor**: Nyx. The black market's ethic: *predators eat what predators hunt*.

## Room 4 — The Tattoo Parlour
*(Second floor, neon-lit)*

A working tattoo parlour with six chairs, three working artists, and a ceiling-mounted mana-infusion rig. Walls papered with ink samples and Gate-survivor portraits.

- **NPC**: **Lee Ji-won "Bright"** *(new NPC — **Idol**, level 4, fills canonical 14-Job gap)*. Bright is a former K-pop backup vocalist turned Vermillion tattoo artist; her voice-infused ink amplifies the psychic component of canonical tattoos.
- **Services** — canonical tattoos from \`tattoos.ts\` (name-linked in Chapter 27 Tattoo Parlour table):
  - Standard tattoo: 2,500 Credits OR 1 B-Rank Anomaly core (Vermillion Trusted required).
  - **Tattoo Voucher** redemption — the Megadungeon Room 9 voucher is redeemed here for any single \`tattoos.ts\` entry regardless of Job.
  - Premium Bright-augmented tattoo (advantage on first activation per long rest): 5,000 Credits + 1 A-Rank core.
- **Unique service**: Bright can **remove** a tattoo — Vermillion-exclusive. Cost: 1 C-Rank Anomaly core. Useful if a tattoo's curse/side-effect becomes detrimental.
- **Deity flavor**: Elara (The Aesthetic Harmony). Bright's work is beautiful and functional. Elara's Spirit of Harmony preserves beauty worth fighting for; Bright preserves it directly on skin.

## Room 5 — The Sigil Parlour
*(Second floor, adjoined to Room 4)*

A precision workshop. Three workbenches, each with a magnifying mana-lens, engraving tools, and a rack of blank sigil substrates. This is where Vermillion's enchanters engrave canonical sigils onto weapons and armor.

- **NPC**: **Sigilmaster Baek** *(minor NPC — Mage, level 5, canonical-style extension; handwriting matches Bright's, hinting at a shared past)*.
- **Services** — canonical sigils from \`sigils.ts\`:
  - Engraving fee per sigil: 1,000 Credits (common) → 10,000 Credits (legendary).
  - Weapon sigils: *Razor Wind, Crushing Mountain, Salamander's Breath, Winter Court, Thunder-Bird, Radiant Truth, Void-Walker, Grandmaster's Edge, Earth-Shatterer, Ranger's Eye, Pierce-Through, Executioner's Swing*.
  - Armor sigils: *Aegis, Unyielding, Frost-Ward, Hearth-Fire, Grounded Soul, Zephyr's Tread, Dragon's Scale, True Glacier, Storm-Wall, Obsidian Polish, Cleansed Blood, Silent Guardian, Unmoving Stone, Iron Mind*.
  - Accessory sigils: *Archmage's Clarity, Hawk's Vision, Wind-Walker, Titan's Grasp, Sovereign's Will, Mana Font*.
  - Legendary-tier (**Vermillion Allied only**): *Shadow Regent, Undying Flame*.
- **Deity flavor**: Golem (The Eternal of Giants). The engraving is slow, patient, unglamorous. Things that last.

## Room 6 — The Infirmary
*(First floor, back room)*

A small medical bay. Four cots, a mana-saline IV rig, a locked medicine cabinet. Staffed by a rotating cast of Guild medics. **Mother Rust** keeps a workbench here.

- **NPC**: **Mother Rust** — Technomancer/Alchemist, level 5 (canonical). She brews dissolvers, healing compounds, and the occasional ethically-suspect stimulant.
- **Services**:
  - **Healing potions** (pull from \`items-part7.ts\` consumables):
    - Minor healing: 100 Credits (1d4+2 HP).
    - Moderate healing: 500 Credits (2d8+4 HP).
    - Greater healing: 2,000 Credits (4d8+8 HP).
  - **Gate-Rot treatment** — free at Vermillion Friendly. A standing Guild promise.
  - **Mother Rust's custom compounds** — at Vermillion Trusted, she offers:
    - **Bureau-scanner masking compound** (advantage on Deception vs Bureau scans for 8 hours).
    - **Anomaly-blood-antivenom** (immunity to one specific Anomaly's poison for 1 hour).
    - **The Black Tincture** *(Vermillion Allied only)* — grants Regeneration 1d6/round for 1 minute; causes 1 level of Exhaustion per use. This is how Rust starts becoming Cult-adjacent.
- **Canonical corruption hook**: each time the party buys Black Tincture from Rust, the Warden rolls a d20. On a 1, Rust's mana-signature drifts one step closer to Awoko-aligned. Track this across the campaign (3 strikes = she's a betrayer per Chapter 24 Card 5 Option 7).
- **Deity flavor**: Lyra (The Queen of the Swarm / The Mother of Evolution). Rust is literally brewing evolution into vials.

## Room 7 — The Shrine to Nyx
*(Third floor, north corner, small and unofficial)*

A small shrine — a statue of a tooth-and-claw figure in a draped robe, surrounded by votive candles. Members of the Guild leave small tokens here before going into Gates.

- **NPC** *(occasional)*: **Vex Quicksilver** — Assassin, level 7 (canonical, gender-fluid, they/them). Vex visits nightly to leave a token.
- **Services**:
  - **Nyx's Blessing** — once per campaign, a PC who prays at the shrine and leaves a fang-shaped token gains **advantage on a single predator/hunt check**. Paths.ts Nyx-aligned paths unlock this free.
- **Canonical recruitment**: Vex's recruitment quest (eliminate The Hollow Mother) canonically starts here — Vex approaches the party on their second visit to the shrine.
- **Deity flavor**: Nyx. The Essence of Instinctual Might. This is the party's most honest shrine.

## Room 8 — Ji's Burrow
*(Second floor, sub-level, hidden)*

A hidden intelligence den under the Bazaar Front. Bookshelves of handwritten dossiers. A map of the Restricted Zone pinned to the wall with thumbtacks and red string. **Rat-King Ji** sleeps here.

- **NPC**: **Rat-King Ji**'s private operation.
- **Services** (Vermillion Trusted only):
  - **Dossier access** — Ji's handwritten files on every major NPC, faction leader, and Awoko operative. Reading any dossier grants advantage on the party's next social check against that NPC.
  - **Safe-passage letter** — to any neighborhood in the Restricted Zone. Bypasses 1 random encounter roll per trip.
- **Discovery mechanic**: the burrow is FINDABLE only at **Vermillion Friendly**. Even then, Ji denies it exists until the party brings him proof they've been invited (Orin's word).
- **Deity flavor**: Nyx + Xylo. Predator-sense and record-keeping.

## Room 9 — Mother Rust's Workshop
*(First floor, adjacent to Infirmary, ventilated)*

A chemistry workshop. Three fume hoods, reagent racks, a reinforced blast-door. This is where Mother Rust brews the compounds she can't sell openly.

- **NPC**: **Mother Rust** (after-hours).
- **Services** (Vermillion Trusted):
  - **Custom compound commission** — party describes a desired effect; Rust attempts to synthesize it over 1 week of downtime. Chance of success scales with party's donated Anomaly cores. Pull schema from \`items-part8.ts\` consumables.
  - **Experimental mana-augment** — a one-shot buff; rolls on a d20 for effect (Warden's random table; include some backfires).
- **Deity flavor**: Lyra / Marthos (the corruption seed). Lyra's evolution, Marthos's slow poisoning.

## Room 10 — The Back-Alley Duel Pit
*(Outdoor, alley adjacent to the Guild Hall)*

A chalk-marked circle in a trash-strewn alley. Vermillion members settle disputes here. Non-lethal by tradition. Lethal by accident, sometimes.

- **NPC** *(pit boss)*: **Iron Belle** — Destroyer, level 5 (canonical). Belle keeps score, arbitrates rules.
- **Services**:
  - **Duel for reputation** — win three duels to gain +1 Vermillion reputation.
  - **Champion Gambit** *(Vermillion Friendly)* — pay 1,000 Credits to fight Iron Belle herself. Win = +1 Vermillion reputation + a rare weapon (pull from \`relics-comprehensive.ts\`, Belle's call).
  - **Train with a canonical technique** — Belle teaches Destroyer-job techniques from \`techniques.ts\`. Fee: 500 Credits per technique, 1 day of downtime.
- **Deity flavor**: Vaelen. The White Flame tests the worthy. The pit is honest.

---

## Vermillion Reputation Milestones

| Reputation | Unlock |
|------------|--------|
| Neutral | Basic Bazaar access; Ji's casual intel |
| Friendly | Vermillion Guild card; Mother Rust's tattoo/sigil parlours at base rates; Ji's Burrow findable |
| Trusted | Orin's personal counsel; Mother Rust's custom compounds; Sigilmaster Baek's legendary-adjacent work |
| Allied | Shadow Regent sigil engraving; Black Tincture access; VTOL-equivalent guild extractions; Orin's full Seoul 2019 dossier |

## Faction Interaction Notes

- **Bureau vs. Vermillion**: rivalry, NOT enmity. At **Allied** with both, Orin and Park reconcile publicly — this is the canonical **Chapter 17 Side Quest "The Alliance"** culmination (already canon).
- **Vermillion vs. Awoko**: Mother Rust's drift is the only active flashpoint. If she becomes the betrayer (Chapter 24 Card 5 Option 7), the Guild splits: Orin disowns her, Ji tracks her, Bright mourns her.
- **Guild loyalty test**: at Allied, Orin may ask the party to turn down an equivalent Bureau offer. A binary choice the party must make once in the campaign — their answer locks their preferred post-campaign epilogue.
`,
	},
];
