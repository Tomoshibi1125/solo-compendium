import type { SandboxHandout } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — HANDOUTS
// Player-facing documents, lore pieces, and Warden-only secrets
// ============================================================================

export const sandboxHandoutsExpanded: SandboxHandout[] = [
	// ── Player-Visible Handouts ──────────────────────────────────────────
	{
		title: "Bureau Emergency Bulletin: Gate Surge",
		content: `# BUREAU OF ASCENDANT AFFAIRS — EMERGENCY BULLETIN\\n\\n**CLASSIFICATION**: PUBLIC — ALL REGISTERED ASCENDANTS\\n**DATE**: [Current Date]\\n**RE**: Unprecedented Gate Surge — Yongsan District\\n\\n---\\n\\nATTENTION ALL AVAILABLE ASCENDANTS:\\n\\nNineteen (19) Gates of escalating Rank have manifested within a single 20-block district. The Bureau has declared the Yongsan District a RESTRICTED ZONE. Civilian evacuation is complete. Police cordon is active.\\n\\nAll registered Ascendants Rank E and above are hereby called to report to the Bureau District Headquarters (Yongsan Federal Building, 4th Floor) for emergency briefing and assignment.\\n\\n**Gate Breakdown**:\\n- E-Rank: 1\\n- D-Rank: 2\\n- C-Rank: 2\\n- B-Rank: 2\\n- A-Rank: 1\\n- S-Rank: 1 (CRITICAL — possible Regent-class entity detected)\\n\\n**Compensation**: Standard Gate-clear bounties apply, with hazard multiplier (×2 for B-Rank+). Anomaly core rights negotiable.\\n\\n**WARNING**: An uncontained S-Rank Anomaly (codename: THE EXECUTIONER) has been sighted within the Restricted Zone. Ascendants below Rank B are advised to RETREAT ON SIGHT.\\n\\n— Commander Park Jae-won, Bureau District Command`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Bounty: The Executioner",
		content: `# B-RANK BOUNTY: ANOMALY-UNCLASSIFIED\\n\\n**Target Alias**: 'The Executioner'\\n**Threat Level**: S-Rank (Confirmed)\\n**Last Sighting**: Eastern perimeter of Restricted Zone\\n**Reward**: 5,000,000 Credits\\n\\n---\\n\\n**Physical Description**: Humanoid, approximately 3.6 meters tall. No discernible facial features. Arms terminate in blade-like appendages of compressed shadow, each approximately 2 meters in length. Moves silently despite its size.\\n\\n**Behavioral Pattern**: Roams the Restricted Zone on an unpredictable patrol route. Drawn to high concentrations of mana energy. Has been observed destroying Bureau patrols — zero survivors from three engagements.\\n\\n**WARNING**: This target escaped from a Gate Break prior to the current Surge. It is the only known Anomaly operating in the real world outside a Gate. Ascendants below Rank B are ordered to RETREAT ON SIGHT. Do not engage. Do not attempt to track. If you see it, run.\\n\\n— Bureau Threat Assessment Division`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Vermillion Guild Manifesto",
		content: `*A flyer nailed to a telephone pole near the commercial district...*\\n\\n---\\n\\n# THE VERMILLION GUILD\\n\\nThe Bureau wants you to think Gate Quotas are for your own good. They take the cores, they restrict the Runes, and they let the D-Ranks die clearing Gates that pay Executive salaries.\\n\\nThe Vermillion Guild offers a different path.\\n\\n✦ **Better Pay**: We buy Anomaly cores at 150% Bureau rates. No paperwork.\\n✦ **No Restrictions**: Runes the Bureau banned? We stock them. Your power is YOUR business.\\n✦ **Real Support**: Our Guild Hall has hot food, warm beds, and people who won't send you into a B-Rank Gate with D-Rank equipment.\\n\\nBring your cores to the Bazaar. Lower City commercial district. Ask for Ji.\\n\\n*Survive First. Obey Later.*`,
		visibleToPlayers: true,
		category: "note",
	},
	{
		title: "Prophecy Fragment: The Three Anchors",
		content: `*A stone tablet recovered from a Gate-adjacent anomaly, covered in glowing script...*\\n\\n---\\n\\n*"The Sovereign of Shadow does not slumber. It waits.*\\n\\n*Three fragments of its dominion were scattered across the dimensional barriers — anchors that bind its full manifestation. They were not hidden to be found. They were hidden to HOLD.*\\n\\n*One devours light. One commands will. One drinks life.*\\n\\n*He who gathers all three shall either bind the Sovereign...*\\n\\n*...or be consumed by the throne."*\\n\\n---\\n\\n> **Bureau Note (stamped)**: Cross-reference with Dr. Voss's research on dimensional anchoring. The "anchors" may refer to the high-mana artifacts detected by long-range resonance scans. Classification: RESTRICTED.`,
		visibleToPlayers: true,
		category: "lore",
	},
	{
		title: "Dr. Voss — Research Brief: Regent Entities",
		content: `# RESEARCH BRIEF — REGENT-CLASS ENTITIES\\n**Author**: Dr. Elara Voss, PhD Aetheric Biology\\n**Classification**: Bureau Eyes Only (shared with party at Trusted reputation)\\n\\n---\\n\\n## Definition\\nA Regent is a Gate entity of sufficient power to generate its own dimensional domain. While standard Anomalies are products of Gate environments, Regents CREATE Gate environments. They are, in essence, the dungeon itself given consciousness.\\n\\n## Known Regent Encounters (Historical)\\n- **Seoul, 2019**: Regent-class entity manifested during Gate Break. Casualties: 147 Ascendants, 2,300 civilians. Defeated by combined international strike team over 72 hours.\\n- **São Paulo, 2021**: Regent sealed (not destroyed) by a team led by the 'White Heron' (Old Man Crane). The Gate was permanently closed but the entity may still exist within.\\n- **Yongsan, Current**: Mana signature matches Regent classification. Estimated power: **exceeds both prior cases**.\\n\\n## Theoretical Weakness\\nMy research suggests Regents are not invulnerable — they are anchored to their domain by artifacts I call "Relics." These Relics are fragments of the Regent's own power, separated from the main entity. If recovered and present during confrontation, they should weaken the Regent significantly.\\n\\n## Open Questions\\n- Can a Regent be communicated with? (I believe yes.)\\n- Are the Relics scattered randomly or placed deliberately?\\n- If the Regent is destroyed, what happens to the Gates it created?\\n\\n— E. Voss`,
		visibleToPlayers: true,
		category: "lore",
	},
	{
		title: "The Ascendant Ranking System",
		content: `# THE ASCENDANT RANKING SYSTEM\\n\\n*Official Bureau documentation — provided to all registered Ascendants*\\n\\n---\\n\\n## Overview\\nAll Awakened humans — now legally classified as **Ascendants** — are ranked by the Bureau of Ascendant Affairs based on their measured mana capacity, combat capability, and Gate-clear record.\\n\\n## Ranks\\n\\n| Rank | Mana Level | Approx. Population | Gate Access |\\n|------|-----------|-------------------|-------------|\\n| **E** | Awakened (minimal) | ~500,000 worldwide | E-Rank Gates only |\\n| **D** | Developing | ~100,000 worldwide | Up to D-Rank Gates |\\n| **C** | Competent | ~20,000 worldwide | Up to C-Rank Gates |\\n| **B** | Advanced | ~2,000 worldwide | Up to B-Rank Gates |\\n| **A** | Elite | ~200 worldwide | Up to A-Rank Gates |\\n| **S** | National-Level | ~20 worldwide | All Gates, including S-Rank |\\n\\n## Rank Assessment\\nRank assessments are conducted by Bureau-certified evaluators. Assessments measure:\\n1. Raw mana output\\n2. Sustained mana control\\n3. Combat proficiency (simulated Gate environment)\\n4. Gate-clear record (verified clears contribute to rank advancement)\\n\\n## Re-Awakening\\nIn extremely rare cases, an Ascendant may undergo a second Awakening — a surge of power that dramatically increases their mana capacity. This phenomenon has been documented fewer than 50 times worldwide. Bureau policy requires immediate reassessment and monitoring of any re-Awakened individual.\\n\\n— Bureau of Ascendant Affairs, Public Information Division`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Mika's First Drawing",
		content: `*A child's crayon drawing on a crumpled piece of paper...*\\n\\n---\\n\\nThe drawing shows a city skyline — simple rectangles for buildings, a yellow circle for the sun. But above the buildings, a massive purple circle dominates the sky. Inside the purple circle, two red dots glow like eyes.\\n\\nBelow the buildings, under the ground, hundreds of stick figures stand in perfect rows. They are all colored black. They are all facing up.\\n\\nIn the corner, written in a child's handwriting: *"They're waiting."*\\n\\n---\\n\\n> **Interpretation (DC 14 Arcana)**: The purple circle is the S-Rank Gate. The red dots are the Regent's eyes. The figures underground are the frozen Anomaly army beneath the Regent's throne room. Mika has seen the final battle before it happens.`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Final Transmission: Strike Team Seven",
		content: `*Static-filled audio log recovered from a Bureau relay beacon...*\\n\\n---\\n\\n**[TIMESTAMP: 03:47:22]** — Sergeant Yoon, this is Strike Team Seven, responding.\\n\\n**[03:47:25]** — We've entered the B-Rank Gate on the rooftop. It's cold. Really cold. There's a bridge made of ice over... nothing. Can't see the bottom.\\n\\n**[03:52:08]** — Contact. Hostiles. Large armored constructs. Lee is down— *[weapon fire]*\\n\\n**[03:55:41]** — Fell back to a chamber. There are... thousands of them. Frozen. Anomalies, standing in formation, like an army on ice. They're not moving. They're waiting for something.\\n\\n**[03:58:12]** — Something new. Kim, my point, he just... stopped. Staring at nothing. Then he walked toward the frozen ones and wouldn't respond. We had to restrain him. His eyes were wrong. Wrong color.\\n\\n**[04:01:33]** — The Gate sealed behind us. No exit. We're moving deeper. If anyone gets this— tell Yoon. Tell her we didn't give up.\\n\\n**[04:05:09]** — *[Sustained weapons fire. Screaming. Deep rhythmic sound like breathing.]* Something is on the throne—\\n\\n**[SIGNAL LOST]**`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Awoko Cult Pamphlet — The Regent Offers Ascension",
		content: `*A pamphlet printed on thick, dark paper with silver ink. Found tucked into a mailbox.*\\n\\n---\\n\\n# THE AWAKENING IS NEAR\\n\\nYou call it a Gate Surge. We call it a **Revelation**.\\n\\nThe Regent is not a threat. The Regent is the next step in human evolution. For too long, the Bureau has kept Ascendants leashed — ranked, controlled, measured like cattle. Your power has a ceiling because THEY put it there.\\n\\nThe Regent recognizes no Rank.\\nThe Regent imposes no limit.\\nThe Regent offers **true Ascension**.\\n\\nWhen the S-Rank Gate opens fully — and it WILL open — those who kneel will rise.\\nThose who resist will be left behind.\\n\\n*Come to us before the Gate breaks. We will prepare you.*\\n\\n*Ask for the blessing of Nyx.*\\n\\n— THE AWOKO\\n\\n*"To awaken is to remember what you always were."*`,
		visibleToPlayers: true,
		category: "note",
	},
	{
		title: "Old Man Crane's Gate Raid Journal",
		content: `*A worn leather journal, pages yellowed with age. The handwriting is precise and elegant.*\\n\\n---\\n\\n**Entry 1 — Seoul, 2019**\\nThe first Regent I ever faced. Class-S entity manifested through a Gate Break during rush hour. 147 Ascendants died in the first wave. I lost Hana, Joon, and the kid — couldn't even remember his name afterward. The guilt stays. The nightmares stay longer.\\n\\n**Entry 7 — São Paulo, 2021**\\nSealed the second Regent with a technique I can't use anymore. My body paid the price. Worth it. The Gate closed. The entity is still inside, I think. Sleeping. Waiting. They always wait.\\n\\n**Entry 14 — Yongsan, Present Day**\\nI came here to die. That's the honest truth. When I heard the Gate Surge reports, I packed my tea set and walked in. An old man's prerogative. But now...\\n\\nThis Regent is different. Stronger than both of mine combined. But there's something else — a sadness in its mana signature. Like homesickness. The others were hungry. This one is... lost.\\n\\nI don't know if that matters when the city is at stake. But I wrote it down anyway.\\n\\n**Entry 15**\\nThe young ones remind me why I survived. Not for me. For them. One more fight, old bird. One more.`,
		visibleToPlayers: true,
		category: "lore",
	},
	{
		title: "Ghost's Redacted Bureau ID",
		content: `*A Bureau of Ascendant Affairs identification card, severely damaged. Most text has been scratched away or burned.*\\n\\n---\\n\\n**BUREAU OF ASCENDANT AFFAIRS**\\n**OFFICIAL IDENTIFICATION**\\n\\n**Name**: [REDACTED — scratched beyond recognition]\\n**Rank**: A *(confirmed — gold border intact)*\\n**Clearance Level**: [REDACTED]\\n**Assignment**: [REDACTED] — YONGSAN DISTRICT\\n**Date of Issue**: [REDACTED]\\n**Status**: ~~ACTIVE~~ ▸ MIA\\n\\n*The photo shows a person whose features are obscured by water damage. One detail is visible: the subject has heterochromatic eyes — one brown, one pale blue — matching Ghost's current appearance.*\\n\\n**Stamped on reverse**: CLASSIFIED — CENTRAL COMMAND EYES ONLY\\n\\n---\\n\\n> **If shown to Commander Park**: He goes very still. "Where did you find this?" He refuses to say more without Bureau Trusted reputation. At Trusted: "That clearance level... only twelve people in the Bureau have that. And three of them are on the Council. Who IS this person?"`,
		visibleToPlayers: true,
		category: "handout",
	},
	// ── Warden-Only Handouts ─────────────────────────────────────────────
	{
		title: "Warden Secret: Nyx's True Plan",
		content: `# WARDEN EYES ONLY — High Priestess Nyx's Plan\\n\\n---\\n\\nNyx doesn't actually serve the Regent. She intends to ABSORB it.\\n\\nHer cult rituals are designed to weaken the dimensional barriers between Gates — not to help the Regent manifest, but to fracture its power enough that she can steal its domain. Nyx is attempting to become a Regent herself.\\n\\nIf Nyx succeeds:\\n- The S-Rank Gate's entity is absorbed into Nyx\\n- Nyx becomes an S-Rank human-Regent hybrid (use Regent Phase 1 stats with Nyx's intelligence and tactical abilities)\\n- The Gates don't close — they fall under Nyx's control\\n- The campaign's final boss becomes Nyx instead of the Regent\\n\\nThis twist is optional. The Warden can play it straight (Nyx is a fanatic serving the Regent) or use this twist if the party has been ignoring the Cult plotline and needs a dramatic escalation.\\n\\n**Foreshadowing**: Nyx's dialogue never mentions "serving" the Regent. She says "inheriting." Her cult members say "serving." This discrepancy can be caught with a DC 18 Insight check.`,
		visibleToPlayers: false,
		category: "lore",
	},
	{
		title: "Warden Secret: Agent Blackwood's Mission",
		content: `# WARDEN EYES ONLY — Agent Kira Blackwood\\n\\n---\\n\\nBlackwood was planted in the district BEFORE the Gate Surge. She knew it was coming.\\n\\nBlackwood's real mission: The Bureau's Central Command believes a Regent Relic was already in the district before the Gates appeared — hidden in the Hana Financial Tower vault. Blackwood was sent to retrieve it quietly.\\n\\nThe Gate Surge started before she could complete her mission. Now she's trapped in the Restricted Zone with everyone else, unable to report her findings because the Bureau can't know that Central Command knew about the Relic and didn't warn the district.\\n\\n**If the party discovers this**:\\n- Blackwood can be confronted (she breaks down under pressure — she didn't know people would get hurt)\\n- The party can help her retrieve the Relic from the Ashen Vault Gate (it might be there if the divination table placed it)\\n- Commander Park is FURIOUS if he learns Central Command kept secrets. This can trigger a split within the Bureau faction.\\n\\n**Blackwood's Personal Quest**: She asks the party to help her access a Gate alone. What she really wants is to enter the Ashen Vault and reach the Financial Tower vault inside the Gate dimension.`,
		visibleToPlayers: false,
		category: "lore",
	},
	{
		title: "Warden Secret: Orin's Past",
		content: `# WARDEN EYES ONLY — Guildmaster Orin\\n\\n---\\n\\nOrin was Bureau. Eighteen years. He was present at the Seoul Gate Breach of 2019 — the deadliest Gate Break in history (147 Ascendants, 2,300 civilians).\\n\\nOrin's squad was ordered to hold a perimeter while Bureau Command debated jurisdiction with the Korean Hunter Association. Three hours of debate while people died meters from his position. Orin broke orders, led his squad into the breach, and saved forty-one civilians.\\n\\nThe Bureau court-martialed him for insubordination. He was stripped of his Rank and discharged. He founded the Vermillion Guild six months later.\\n\\nOrin doesn't hate the Bureau. He hates what it becomes in a crisis — slow, bureaucratic, risk-averse. He formed the Guild to be what the Bureau should be: fast, flexible, and willing to act.\\n\\n**If the party unites Bureau and Vermillion**: Orin and Park have a conversation that reveals they served together in Seoul. Park let Orin take the fall. This is the source of their animosity — and the foundation for their reconciliation.`,
		visibleToPlayers: false,
		category: "lore",
	},
	{
		title: "Warden Secret: The Regent's Origin",
		content: `# WARDEN EYES ONLY — The Regent\\n\\n---\\n\\nThe Regent was once an S-Rank Ascendant.\\n\\nFifty years ago, before the Bureau existed, before Gates were understood, a human Awakened with power that exceeded all measurement. Instead of fighting Anomalies, this person — whose name has been erased from all records — chose to enter a Gate and STAY.\\n\\nOver decades inside a Gate dimension, absorbing mana without limit, this person transcended humanity. They became the Gate. The dimension reshaped itself around their will. They became a Regent — a being of pure mana that generates its own reality.\\n\\nThe Regent doesn't want to destroy the city. It wants to come HOME. The Gate Surge is not an attack — it is a homecoming. The Regent is trying to manifest in the real world, in the neighborhood where it once lived, before it Awakened and walked into a Gate fifty years ago.\\n\\n**Key Detail**: If the party enters the Regent's Domain, they find personal effects scattered across the throne room — a faded photo of a family, a child's toy, a university diploma. The Regent is monstrous, but it was once a person.\\n\\n**This changes nothing mechanically** — the Regent must be stopped or the city dies. But it adds emotional weight to the final confrontation.`,
		visibleToPlayers: false,
		category: "lore",
	},
];
