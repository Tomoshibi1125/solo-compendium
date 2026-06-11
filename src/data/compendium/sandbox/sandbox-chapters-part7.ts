import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT - CHAPTERS 31-33
// Part VII: Tribute settlements, Domain veins, and the Awoko sanctum
// ============================================================================

export const chaptersPart7: SandboxChapter[] = [
	{
		title: "Markets, Merchants & Goods",
		content: `# Markets, Merchants & Goods

> *Everything in the Gloamreach is for sale — but not everywhere, and never all in one place. The Domain prefers its people dependent on one another.*

## Sourcing (use the compendium, not invented one-offs)

Every item, weapon, Sigil, Rune, Relic, tattoo, and mount comes from the **canonical RA compendium**. Match each sale to a real entry of the right rank/rarity:

- **Weapons & armor:** \`items-base-equipment.ts\` (Dagger, Spear, Mace, Shortbow; Leather, Chain Shirt, Plate, Shield).
- **Gear & consumables:** \`items.ts\`, \`items-part1.ts\`–\`items-part9.ts\`.
- **Sigils:** \`sigils.ts\` (Sigil of the Aegis, of the Frost-Ward, of the Void-Walker).
- **Runes:** \`runes/\` by rank D–S (see Ch34).
- **Relics & Artifacts:** \`relics-comprehensive.ts\`, \`artifacts.ts\` (the Regent's Shadow Dagger, the Bloodthirsty Greatsword).
- **Tattoos:** \`tattoos.ts\` (Ascendant's Acuity, Bone-Weave Tapestry; the Regent's Heartbeat only by dark bargain).
- **Mounts & vehicles:** \`vehicles.ts\` (riding / war / draft beasts; see Native Mounts).

## Merchants carry SELECT, distinct stock

No merchant sells everything, and no two sell the same things. Each carries a **small, curated stock logical to their trade and their location.** Common goods are everywhere; specialised goods cluster where their maker is.

| Merchant · Location | Trade | Carries (a handful, not a catalogue) | Does NOT carry |
|---|---|---|---|
| **Maven Holt** · Covered Market | General goods | Rope, lamp-Essence, rations, bedrolls, tools, common kit | Weapons, Relics, Sigils |
| **Grist** · Vermillion Outpost | Arms-dealer | A few weapons + light armor, Essence-cells, 1–2 salvaged Relic-arms | Consumables, tattoos, mounts |
| **Sigilmaster Baek** · Outpost | Sigils | 3–4 Sigils by rank (Aegis, Frost-Ward; restricted: Void-Walker) | Anything not a Sigil |
| **Bright** · Outpost | Tattooist | Voice-inked tattoos (Ascendant's Acuity, Bone-Weave Tapestry) | Gear, weapons, mounts |
| **Old Vell** · Outpost | Appraiser / fence | Identifies & brokers Relics/Artifacts the party *brings*; rarely one unique Relic | A standing catalogue (deals case by case) |
| **Quill** · Outpost / Market | Memory-broker | A few skill- and memory-cores (given, never stolen) | Physical gear |
| **Tallow** · market / roads | Charm-seller | Cheap wards & charms; one genuine Anchor-ward if earned | Weapons, mounts |
| **Herbalist Wen** · settlements | Apothecary | Healing draughts, antitoxins, Rift-Rot cures | Weapons, Relics, Sigils |
| **The Stablekeeper** · settlements/Outpost | Mounts | Native riding & draft beasts; 1 salvaged Bureau mount | Anything you can't saddle |
| **Coin-Mother Esha** · Covered Market | Money-changer | No goods — converts cores/favours/oaths, brokers big Relic sales | — |

## Stock varies by area

- **Tribute settlements** — sparse and basic: Holt-tier kit, Wen's remedies, a stablekeeper's beast. No contraband; the Bailiff watches.
- **The Vermillion Outpost** — the deep market: arms, Sigils, tattoos, salvage, forged papers, the things no settlement dares shelve.
- **The Covered Market** — variety by stall under the no-violence bell: a little of everything, nothing in depth, a secret owed per stall per week.
- **The roads** — Tallow, Sile, Captain Doe, and whatever the Road of Writs allows through. Prices rise with desperation.

## Native Mounts & Vehicles

The Gloamreach's mounts are not Bureau stock; they are **Domain-bred beasts** the natives raise and the Vermillion salvage — reskin the \`vehicles.ts\` riding/war/draft profiles as pale road-horses that do not spook at bells, six-legged warren-beasts, and draft things bred to haul tribute. A few **salvaged Bureau mounts** (the handful that came through with the first wave) turn up at the Outpost, worth more for the story than the speed. The Road of Writs can lengthen against a mount as easily as a walker: a fast beast buys distance, not safety.

## Currency

Essence cores are common coin; favours, oaths, and memories are the uncommon ones. Bureau credits are worthless inside the Domain. **Provenance is optional flavour** — some goods are honest native craft or salvage; some carry a history worth a scene. Use it when it sharpens the moment, not on every sale.
`,
	},
	{
		title: "The Road of Writs",
		content: `# The Road of Writs

> *The Road of Writs honors language, not intent. Say less than you mean, and it will hold you to all of it.*
> - Old Man Crane

## Rank and Role

**Rank**: Varies — the road is everywhere.
**Recommended Level**: Any; travel horror that scales with the act.
**Campaign Role**: The connective tissue of the Gloamreach — the Domain's hunger made into distance.

## Overview

The Road of Writs is not one road. It is *every* road in the Gloamreach, and it is paying attention. Distance here has come loose: broken miles, landmarks that wander, shortcuts that should not exist, and consequences that arrive exactly when they were promised. Travel is never neutral. The road lengthens for the hunted, shortens for the obedient, takes its toll from the marked, and rearranges itself around anyone who swore, accepted, or carried away something they should not have.

> *Read aloud:* The milestones are wrong. You passed that leaning one an hour ago — the same crack, the same moss, the same summons nailed to it, the ink a little fresher now. The Citadel sits on the horizon exactly where it sat at dawn, no nearer for all your walking. Somewhere behind you, a bell you never heard rung is being answered by one ahead.

## How the Road Works

- **The toll.** The road takes a toll, but never in coin: an hour of your life, a true name, a warm memory, a night's unbroken sleep. Refuse to pay and the way lengthens before you; pay, and the road has your scent.
- **The summons.** Black-edged papers appear nailed to posts, doors, and lone trees, each bearing a name in fresh ink — a stranger's at first, then, soon enough, one of the party's. *A name the road serves twice cannot be refused a third time*, and what comes down the road to collect it is the Bailiff.
- **The weight of a word.** The road remembers every promise spoken aloud upon it and holds the speaker to the words, not the meaning. Write down the party's exact phrasing; the Gloamreach remembers a promise far more clearly than it remembers the face that made it.
- **Separation.** In Act III the road can split a party during the Citadel approach (activating the Mana Vein nodes can prevent this — see Ch32).

## Travel Hazards

Roll on **Table A — Road of Writs** (Ch35) when the party travels between regions, refuses a summons, carries a Claim openly, or lingers too long debating in the open. The road notices motion, fear, broken promises, and trespass.

## Warden Guidance

The Road of Writs is how the Gloamreach stays present even when the party is "between" places. Make travel a scene, not a transition — somewhere the Domain reaches out and takes its due. Its refrain, repeated until the players dread it: *the road behind them is not the road they used to enter.*
`,
	},
	{
		title: "Chapter 31: Tribute Settlements - Keyed Locations",
		content: `# Tribute Settlements - Keyed Locations

> *The Regent does not need every village to love him. He only needs them to keep paying.*

## Overview

The Gloamreach is a populated country. Its settlements are not ruins and not waystations — they are the homes of the Domain's **native inhabitants**, people born here who have never known a ruler but the Regent. They survive by compromise, and none of them are safe for free. The horror of a tribute settlement is not that it is monstrous; it is that it is *ordinary* — children, markets, clinics, gossip, bells — running on a tax paid in memory, years, secrets, and the occasional neighbour.

> *Read aloud:* The road tops a rise and there it is: lamplight, woodsmoke, a dog barking, a queue outside a clinic, washing on a line. It looks, for one aching second, like somewhere people simply *live*. Then you notice the pale summons nailed above every door, the empty chair set at every table, and the way no one quite refuses anything out loud.

Each settlement below keeps a **rule, a lie, a tribute, and a reckoning** — the bargain that has let it survive the Gloamreach. The party will be tempted to liberate them all. Some of these places have lasted precisely because no one yet tried.

## Location 1 - Mother Rust's Outreach Post

A clinic built in the second floor of a leaning tenement that should not still be standing. Mother Rust treats the sick, the Rift-touched, and those the Bureau would classify as unrecoverable.

The Rule: Mercy must be paid forward.
The Lie: Care is free.
The Tribute: Medicine, cores, favors, or silence.
If It Breaks: The clinic starts deciding who is worth saving.

Services:

- Treat Rift-Rot and minor Domain conditions.
- Civilian aftercare.
- Rumors about Awoko recruiters.
- Recovery scenes after major horror encounters.

If Ms. Park survived Day Zero, she may be here under Mother Rust's care.

## Location 2 - The Covered Market

A neutral market under patched canvas and rusted tin. Vermillion runners, settlement traders, smugglers, cult watchers, and now the strangers who came in through the door all pass through.

The Rule: No violence while the bell hangs.
The Lie: Neutrality protects everyone.
The Tribute: One secret per stall per week.
If It Breaks: The bell falls, and every unpaid secret becomes public.

Services:

- Rumors.
- Food.
- Salvage.
- Stolen maps.
- Questionable guides.

## Location 3 - The Summons-Bound Hamlet

A village where every door wears a pale summons nailed above it. The residents speak politely and never refuse an invitation aloud.

The Rule: No one may refuse a summons twice.
The Lie: Courtesy keeps them safe.
The Tribute: One household hosts a Regent servant each week.
If It Breaks: The Bailiff comes at dawn.

Use this settlement to teach the danger of hospitality.

## Location 4 - The Bellweather School

A schoolhouse converted into a shelter. Children draw places they have never seen. The bell rings when the Road of Writs changes.

The Rule: Children may not be taken if someone else answers the bell.
The Lie: The adults always know who should answer.
The Tribute: Volunteers stand at the road when the bell rings.
If It Breaks: The road chooses instead.

Mika the Kid can appear here. Her drawings foreshadow the Citadel, the Bailiff, and the Three Claims.

## Location 5 - Old Man Crane's Teahouse

A quiet teahouse that appears at crossroads. It is always the same room, no matter where the door stands.

The Rule: Tea must be finished before violence.
The Lie: Crane is only an old man.
The Tribute: A true story from each guest.
If It Breaks: The story repeats later with worse actors.

Old Man Crane can teach the party about sealing a Regent instead of destroying one, but his method costs more than technique.

## Location 6 - The Empty Mill Village

A settlement whose residents leave food on every table and sleep in locked barns. No one will explain why.

The Rule: The mill must turn by moonrise.
The Lie: Grain is what the mill grinds.
The Tribute: Names written on husks and fed into the stones.
If It Breaks: The mill grinds bodies instead.

This is an ideal location for a Claim clue or a Bailiff arrival.

## Settlement-Wide Systems

### Civilian Trust

Track how many settlements the party protects, exploits, abandons, or liberates. Civilian trust affects final-act support, rumors, safe rests, and whether common people will resist the Regent's court.

### Shrines

Small shrines appear throughout settlements — old folk-altars to powers that have not answered in a very long time. Some are sincere. Some are bait.

- A shrine of comfort — one reroll against fear or despair.
- A shrine kept by the watchful dead — advantage on one trial or combat-opening save.
- A shrine grown through with living rot — temporary HP, and a mutation risk.
- A shrine of remembrance — advantage on a Sense check involving memory or truth.
- A shrine that asks too little — never free. Always a trap, a rot, or a mercy with teeth.
`,
	},
	{
		title: "Chapter 32: Mana Vein Network and the Third Node",
		content: `# Mana Vein Network and the Third Node

> *A Rift Interior is not only a place. It is a pressure system with laws pretending to be weather.*
> - Dr. Serin Hayashi

## Overview

The Gloamreach is threaded with Mana Veins: deep channels of Essence pressure that stabilize roads, settlements, Relics, and Anchor law. Professor Lun believes that mapping or disrupting enough nodes can weaken the Regent's battlefield control during the finale.

The veins are inside the Domain.

## Node 1 - The Rusted Hull

A dry-docked ship half-buried in black soil far from any sea. A vein pulses beneath the keel.

Challenge: Install a sensor while avoiding a Beast swarm feeding on overflow Essence.  
Reward: Access to one movement-related Sigil or a road shortcut.

## Node 2 - The Silent Depot

A cavernous native sorting-hall where the Domain once gathered whatever its veins carried up from below. It stands empty now but for the distant counting of the Hollow Way and a voice, in no throat, naming consignments long since claimed. A vein runs through the old reckoning-room.

Challenge: Umbral scouts guard the vein-locks.
Reward: One B-Rank Rune or a clue about the Road of Writs.

## Node 3 - The Glass Sub-Basement

A buried financial archive beneath the Ashen Counting-House. It contains the deepest active vein outside the Citadel.

### SB-1 - Security Checkpoint

Domain-made checkpoint-wards stand beside gear the Vermillion stripped from somewhere far deeper and never came back for. The checkpoint recognizes authority but not identity.

### SB-2 - Vein Engine

A glass cylinder contains a pulsing channel of Essence. Installing Lun's sensor requires a DC 15 Intelligence check. On failure, the sensor works, but the Regent learns who placed it.

### SB-3 - The Precedent Echo

A legal echo from the Unseated Law asks the party to define ownership. The answer determines whether the node weakens the Regent, the road, or the party's own legal protections.

## Finale Effect

If the party activates all three nodes, the Regent begins the final confrontation with weakened Domain control. Choose one:

1. The Regent loses one lair action for the first three rounds.
2. The party may cancel one forced movement effect.
3. The Road of Writs cannot separate the party during the Citadel approach.

## Warden Guidance

Mana Veins should not feel like power generators. They are nerves. When the party touches one, the Domain feels it.
`,
	},
	{
		title: "Chapter 33: The Awoko Sanctum",
		content: `# The Awoko Sanctum

## Overview

The Awoko Sanctum hides in a grief-dense fold of the Gloamreach where four rooms share one impossible floor plan — a chapel, a clinic, a theatre, and an execution room, all the same room, depending on why you came. Here beauty is made unbearable and comfort is twisted into bait. The Awoko are natives of the Domain who found the one thing the Regent's law could never quite tax — grief — and built a faith on it. They do not see themselves as villains, and they are not lying about the comfort they offer. That is exactly what makes them dangerous.

> *Read aloud:* Someone is singing, low and close — a song you half-remember in a voice you have lost. The air is warm with candlelight and the smell of clean linen, and a gentle hand finds your shoulder before you see whose it is. "You've carried that a long way," the voice says, meaning the grief you did not know showed. "You don't have to. Not here." Every word is true. That is the trap.

They preach that the Regent is proof a person can transcend Rank, death, and ownership itself — and their leader means to prove it by becoming the next thing the Gloamreach belongs to.

## Core Truth

The Hollow Mother does not serve the Regent. She intends to replace him.

## What This Place Does

**Dread**: Grief does not stay private here. The Sanctum gathers it, concentrates it, and turns it into something with weight and will — and the more you bring, the more it loves you.
**The Lure**: To be *understood*. The cult meets the grieving exactly where they hurt and offers to share the weight, to make sure the lost are never forgotten.
**The Cost**: It feeds on what it collects — loss, confession, blood, obedience — and gives belonging in their place, until the grief is all that is left of you.
**If You Linger**: The grieving stop being mourners and become fuel, wept dry and fed to whatever the Hollow Mother is becoming.

## Key Areas

### S-1 - Nave of Remembered Names

Thousands of names hang from threads. Some are dead. Some are alive. Some belong to the party, if they have been careless with their names.

### S-2 - Confession Chamber

Initiates confess grief into speaking tubes. The grief is stored, refined, and used to power rituals.

### S-3 - Clinic of Gentle Hands

The cult offers real comfort here. Do not make it fake. The danger is that the comfort is being weaponized.

### S-4 - Choir Pit

Idol-class cultists sing Domain law into a more obedient shape. Interrupting the choir can delay a Regent court event or weaken Hollow Mother's ritual.

### S-5 - Sister Veil's Laboratory

Sister Veil knows the ritual math is wrong. She can defect if shown evidence that the Hollow Mother intends to use the cult as fuel.

### S-6 - The Ritual of Inheritance

A circular chamber with seven candle-stations, each burning with grief-tallow. If completed, the ritual lets the Hollow Mother attempt to inherit the Regent's claim.

## Major NPCs

### The Hollow Mother

Charismatic, grieving, brilliant, and predatory. She speaks softly. She never says serve when inherit will do.

### Sister Veil

Ritualist and possible defector. She is guilty, but not unreachable.

### Acolyte Mara

A young initiate who can become a human face for the cult's victims.

## Ritual Disruption

The party can disrupt the ritual by:

1. Destroying one correct candle-station.
2. Convincing Sister Veil to corrupt the final chant.
3. Removing the stored grief from the Confession Chamber.
4. Presenting proof that the Hollow Mother intends to inherit, not liberate.

## The Sanctum Raid

When the Sanctum turns hostile, the fight is the Choir, the ritual, and the Hollow Mother — not a single boss. Reskin a **B-Rank controller Anomaly from the compendium bestiary** (Appendix C) as the **Choir's grief-engine** (the thing the singing actually powers), and run the Hollow Mother as a near-non-combatant who would far rather the party *understood* than fought.

**The Law in play:** *grief may be converted into authority.* Every loss the party has carried into the Domain — a named dead, a memory-core eaten in the Orchard, an oath broken at the Bastion — is fuel the Sanctum can spend against them; a party that has grieved openly here arms the room. Starve the engine by denying the cult the party's grief: refuse the comfort, withhold true names, or empty the Confession Chamber before the Choir can draw on it.

**Scaling (Levels 1-15):** B-Rank for a level 7-10 party; if the Ritual of Inheritance is near completion, raise it to A-Rank and let the Hollow Mother spend the Sanctum's stored grief as legendary actions.

> *Exit tone (read aloud):* Outside again, the song does not follow — but for the rest of the campaign, the first kind voice in any safe room will sound, for just a moment, like hers, and the party will have to decide, every time, whether to let it comfort them.

## Warden Guidance

The Awoko should be horrifying because they understand pain and exploit it with tenderness. Push the dread, not caricature. Their kindness should make the party angrier, not less afraid.
`,
	},
];
