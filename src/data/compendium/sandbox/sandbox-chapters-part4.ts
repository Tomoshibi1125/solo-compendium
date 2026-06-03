import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT - CHAPTERS 0, 24-26
// Part IV: Intro Adventure, Oracle Reading, Ascendant Hooks, Stat Blocks Appendix
// ============================================================================

export const chaptersPart4: SandboxChapter[] = [
	{
		title: "Chapter 0: Day Zero - The Memory-Care Wing",
		content: `# Day Zero - The Memory-Care Wing

> *A Gate that feeds on memory is not merely an opening. It is the first time a place learns your name.*
> - Dr. Serin Hayashi, private margin note

## Purpose

Run this one-to-two session gothic-horror prelude before the party enters the Gloamreach. The characters are still on the material side, inside the Bureau cordon surrounding the S-Rank Gate. The Memory-Care Wing is a small pocket breach created by pressure leaking from the Gloamreach. It introduces the campaign's real themes: memory, ownership, hospitality, civilian cost, and the terror of a Domain that reaches through the door before anyone steps inside.

The party begins at Level 1 and reaches Level 2 at the end of this chapter.

## The Hook - Welfare Check

A shuttered hospital wing inside the cordon has gone silent. It houses elderly civilians who could not be moved when the Bureau perimeter collapsed inward. The night staff missed their check-in. A drone pass showed the windows fogged from inside. No portal is visible, but the AFA readings show a low-rank pocket breach behind one resident's bathroom mirror.

Read aloud:

*The dispatcher slides a cracked tablet across the counter. The image shows a brick hospital wing behind temporary Bureau fencing. Every window is fogged white from the inside. "Twenty-three residents, six staff, no confirmed hostiles. We have senior Ascendants preparing for the S-Rank threshold. You are what we have left. Be careful. Most of them will not understand what is happening."*

## The Wing

The building is too warm. The heat is off. A radio plays static in a language no one recognizes. When the party crosses the threshold, each character makes a DC 10 Sense save. On a failure, the character forgets a harmless but personal detail for one hour: a badge number, a favorite song, a friend's birthday, the smell of home.

This is not a punishment. It is a warning.

## Keyed Rooms

### R1. Reception - The Visitors' Log

The reception desk is clean. A potted orchid has been freshly watered. A visitors' log sits open.

Every entry is written in the same hand. Different names. Same ink. Same arrival time. Same departure time. The next blank line already has the first stroke of a party member's name.

Clue: the handwriting matches Ms. Park Jeong-hye in R4. Writing a name in the log grants advantage on the next Sense save in the Wing, but the Regent's agents can recognize that character by name later.

### R2. Dayroom - The Wrong Afternoon

Five residents sit watching a news broadcast from years ago. Sunlight fills the room even though the windows face the wrong direction. The residents are echoes. They cannot be harmed and cannot meaningfully answer questions.

Hidden under a folded blanket is the Faded Family Photo: a young woman in a wedding dress beside a man in Bureau dress uniform. The man's face has been worn down to blank paper. The inscription reads: Jeong-hye and [name erased], June 1978.

This photograph is the campaign's first major emotional relic. If the party carries it into the Gloamreach, the Regent notices the absence immediately.

### R3. The Hallway That Lengthens

The hallway stretches as the party walks. Framed photographs age as the characters pass: birthdays, hospital beds, empty chairs, blank frames.

Encounter: The Forgetting, a D-Rank memory swarm.

Use a simple swarm profile: HP 22, AC 12, speed 30 ft., vulnerable to radiant. It makes two chill-touch attacks at +4 to hit for 1d4 cold damage. On a hit, the target makes a DC 13 Sense save or suffers disadvantage on the next check made in the hallway.

Escape condition: the hallway resolves when a character stops trying to move forward and turns back toward the dayroom. The Domain rewards surrendering control, but remembers who did it.

### R4. Room 12-B - Ms. Park Jeong-hye

Ms. Park lies awake in bed, staring at the ceiling. Her heart monitor beeps even though it is not plugged in. She repeats the same line every twelve seconds: "He was supposed to come home for lunch."

A gentle Presence check, DC 10, gives one moment of lucidity. She remembers that her husband was an Ascendant. She remembers a uniform. She remembers pride. She does not remember his name. When she tries to say it, the sound does not reach the party.

### R5. The Mirror - The Diagnosed

The bathroom mirror is open. Violet frost crawls across the frame. The creature halfway through the glass has a face made from every person Ms. Park has forgotten.

Boss: The Diagnosed, D-Rank elite. HP 28, AC 13, speed 20 ft., immune to psychic and necrotic, vulnerable to radiant.

Actions:

1. Forgetting Touch. Melee +5 to hit, 1d6+2 cold. On hit, DC 13 Sense save or the target loses reactions until the end of their next turn.
2. Mirror Retreat, once per fight. The Diagnosed enters the mirror and returns at the end of its next turn beside a reflective surface.
3. Forgetting Gaze, recharge 5-6. 15 ft. cone. DC 13 Sense save. On failure, the target takes 2d6 psychic damage and gains the Regent-Marked condition.

When The Diagnosed falls, the mirror cracks and the pocket breach begins to collapse.

## The Warden's Choice

The party has one choice before the Wing collapses.

Destroy the mirror. The breach ends completely. Ms. Park dies with perfect clarity, smiling at someone the party cannot see. The residents are found dead but peaceful. The party gains Bureau reputation. The Faded Family Photo remains whole.

Seal the mirror. Ms. Park and several residents survive. The haunting remains dormant. The party gains Vermillion or civilian reputation. A grief-cult scout notices the party's mercy and reports it to the Awoko.

This choice should echo in the Gloamreach. If Ms. Park dies, the Regent's human-form reveal is colder and more incomplete. If she survives, she can appear at the Bureau cordon during the finale and create one round of hesitation when the Regent remembers who waited.

## Regent-Marked Condition

A character marked here becomes visible to the Regent's law. The Regent and his servants can recognize the character's presence inside the Gloamreach. The character has disadvantage on Stealth checks against Regent-aligned entities, and the Regent may communicate through dreams, reflective surfaces, or written invitations.

The mark is removed only if the Regent releases it, the Anchor is resolved, or a major divine or Relic-tier intervention breaks the claim.

## Design Notes

This chapter is horror first and combat second. Let silence work. The residents are civilians, not props. The point is not whether the party can win a fight. The point is what kind of people they are when a Gate asks them to choose between mercy and certainty.
`,
	},
	{
		title: "Chapter 24: Oracle Reading - The Fortune of the Domain",
		content: `# Oracle Reading - The Fortune of the Domain

> *A Domain does not hide its secrets. It files them under your name and waits for you to sign.*

## Purpose

This chapter replaces older fortune systems tied to city districts or unrelated Gates. The Oracle Reading determines where the Three Claims are hidden, who can become the party's strongest ally, who becomes a final-act betrayer, and where the Regent's authority can be contradicted.

Perform the reading once per campaign. The results are permanent.

## The Reader

The reading may be performed by Sister Constance, a retired Oracle living near the Bureau cordon, or by a broken oracle engine recovered just inside the Gate Threshold. Either version should feel unreliable, exhausted, and frightened of accuracy.

Read aloud:

*Five cards lie on the table. They are black glass, warm at the edges, cold in the center. The reader does not ask your question. She looks at the Gate beyond the window and says, "It already knows what you came to ask."*

## The Five Card Spread

### Card 1 - The Spark

This card reveals where one Ascendant can undergo a second Awakening. The location should be inside the Gloamreach or just at the threshold. The gift always has a cost: a memory, a favor, a wound, a name, a promise, or a debt to a faction.

### Card 2 - The Chain

This card reveals the location of the first Claim, traditionally tied to the Relic of the Void. It weakens the Regent's ability to hide truth, erase routes, or smother light.

### Card 3 - The Crown

This card reveals the location of the second Claim, traditionally tied to the Relic of the Abyss. It weakens the Regent's command over roads, invitations, and forced obedience.

### Card 4 - The Pulse

This card reveals the location of the third Claim, traditionally tied to the Relic of Blood. It weakens the Regent's ability to make the Domain treat people as property.

### Card 5 - The Oathbreaker

This card identifies the ally, faction agent, or settlement leader most likely to betray the party in the final act. The betrayal should not be random. It should be caused by fear, tribute, blackmail, hunger, grief, or a bargain with the Regent's court.

## Domain Location Table

Use these locations as the default result set:

1. The Gate Threshold.
2. The Road of Writs.
3. The Tithe Mill.
4. The Predator Woods.
5. The Drowned Ledgerfen.
6. The Remembering Orchard.
7. Bastion Golemfall.
8. The Vermillion Outpost.
9. The Forbidden Vault of the Unseated Law.
10. The Regent's Citadel.

## Warden Guidance

This reading is the campaign's structural spine. It should create the same practical function as a classic gothic artifact reading: the party receives direction without losing sandbox freedom. The reading should make the Domain feel fated, but not scripted.
`,
	},
	{
		title: "Chapter 25: Ascendant Hooks - Reasons to Enter the Gloamreach",
		content: `# Ascendant Hooks - Reasons to Enter the Gloamreach

## Purpose

Every character needs a reason to cross the S-Rank threshold and keep moving after escape becomes uncertain. These hooks replace older district-crisis assumptions and tie the party directly to the Gloamreach.

## Personal Hooks

### The Contract

The character signed a Bureau or Guild contract before the Domain classification was confirmed. Backing out now would ruin them financially, legally, or politically.

### The Missing Team

Someone the character knows entered during the first response wave. Their AFA tag still pings from somewhere inside the Gloamreach, always farther down the road.

### The Name in the Ledger

The character's name appears in a Regent ledger recovered before the campaign begins. No one knows who wrote it.

### The Survivor's Debt

The character survived a previous Gate because someone else stayed behind. The Gloamreach contains that person's voice, echo, body, or unpaid sentence.

### The Relic Claim

A Relic bonded to the character reacts violently when the Gate opens. It is not calling them to power. It is recognizing jurisdiction.

### The Veteran of a Failed Clear

The character has seen a Gate stop behaving like a place and start behaving like a ruler. They know the Bureau briefing is too clean.

## Group Hooks

1. The Bureau hires the party because higher-rank teams vanished inside.
2. Vermillion offers illegal support if the party agrees to recover salvage and survivors.
3. A settlement inside the Domain sends a written invitation that appears in the material world.
4. A dead Ascendant's AFA broadcasts from the Regent's Citadel every night at the same time.
5. The Gate enters a Red Phase countdown, forcing immediate entry.

## Warden Guidance

The best hook is not glory. It is obligation. The Gloamreach should feel like a place the party enters because no better option exists, then survives because leaving would abandon too many people to the Regent's law.
`,
	},
	{
		title: "Chapter 26: Stat Blocks Appendix - Domain Use Notes",
		content: `# Stat Blocks Appendix - Domain Use Notes

## Purpose

This appendix gives Warden-facing guidance for using stat blocks inside the Gloamreach. Full stat blocks should remain in their source compendium files where possible. This chapter explains how to frame them in the Domain.

## Regent-Aligned Creatures

A Regent-aligned creature should feel like an extension of law, not a random encounter. Give each one a purpose.

Examples:

1. Tax collectors recover unpaid tribute.
2. Road wardens punish trespass.
3. Hounds follow names, not scent.
4. Mirror-things deliver invitations.
5. Bailiff-servants enforce judgments.

## The Regent's Bailiff

Use the Regent's Bailiff as a recurring Domain officer. It does not need to be fought every time it appears. It can announce charges, deliver summons, take custody of NPCs, demand tribute, or mark a settlement for punishment.

The Bailiff should be difficult to kill permanently unless the party breaks the law that summoned it.

## The Unseated Law

The Unseated Law has no normal stat block. If the party confronts it, run the scene as a trial, bargain, memory excavation, or legal contradiction. Combat should occur only through guardians, precedent-echoes, or failed petitioners.

## Horror Encounter Rules

1. Every combat should reveal something about the Domain.
2. Every victory should cost time, supplies, reputation, safety, or certainty.
3. Intelligent enemies should know the local law better than the party.
4. Monsters should not merely attack. They should enforce, collect, witness, punish, or invite.

## Scaling

For low-level parties, reduce damage but preserve consequences. For high-level parties, increase legal pressure before increasing hit points. The Gloamreach is frightening because it changes what victory means.
`,
	},
];
