import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// RUN SILENT - CHAPTERS 31-33
// Part VII: Warded communities, Mana veins, and the Awoko sanctum
// ============================================================================

export const chaptersPart7: SandboxChapter[] = [
	{
		title: "Markets, Merchants & Goods",
		content: `# Markets, Merchants & Goods

> *Everything in the Gloamreach is for sale — but not everywhere, and never all in one place. The dark keeps its people dependent on one another.*

## Sourcing (use the compendium, not invented one-offs)

Every item, weapon, Sigil, Rune, Relic, tattoo, and mount comes from the **canonical RA compendium**. Match each sale to a real entry of the right rank/rarity:

- **Weapons & armor:** \`items-base-equipment.ts\` (Dagger, Spear, Mace, Shortbow; Leather, Chain Shirt, Plate, Shield).
- **Gear & consumables:** \`items.ts\`, \`items-part1.ts\`–\`items-part9.ts\`.
- **Sigils:** \`sigils.ts\` (Sigil of the Aegis, of the Frost-Ward, of the Void-Walker).
- **Runes:** \`runes/\` by rank D–S (see Ch34).
- **Relics & Artifacts:** \`relics-comprehensive.ts\`, \`artifacts.ts\` (a salvaged Relic-blade, the Bloodthirsty Greatsword).
- **Tattoos:** \`tattoos.ts\` (Ascendant's Acuity, Bone-Weave Tapestry; a cursed deep-Gloamreach tattoo only by dark bargain).
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
| **Tallow** · market / roads | Charm-seller | Cheap wards & charms; one genuine ward-charm that turns the worn dead, if earned | Weapons, mounts |
| **Herbalist Wen** · settlements | Apothecary | Healing draughts, antitoxins, Rift-Rot cures | Weapons, Relics, Sigils |
| **The Stablekeeper** · settlements/Outpost | Mounts | Native riding & draft beasts; 1 salvaged Bureau mount | Anything you can't saddle |
| **Coin-Mother Esha** · Covered Market | Money-changer | No goods — converts cores/favours/oaths, brokers big Relic sales | — |

## Stock varies by area

- **Warded communities** — sparse and basic: Holt-tier kit, Wen's remedies, a stablekeeper's beast. No contraband; the natives' rules are strict.
- **The Vermillion Outpost** — the deep market: arms, Sigils, tattoos, salvage, forged papers, the things no settlement dares shelve.
- **The Covered Market** — variety by stall under the no-violence bell: a little of everything, nothing in depth, a secret owed per stall per week.
- **The roads** — Tallow, Sile, Captain Doe, and whatever the open roads allow through. Prices rise with desperation.

## Native Mounts & Vehicles

The Gloamreach's mounts are not Bureau stock; they are **Gloamreach-bred beasts** the natives raise and the Vermillion salvage — reskin the \`vehicles.ts\` riding/war/draft profiles as pale road-horses that do not spook at bells, six-legged warren-beasts, and draft things bred to haul cargo through the dark. A few **salvaged Bureau mounts** (the handful that came through with the first wave) turn up at the Outpost, worth more for the story than the speed. The open roads can lengthen against a mount as easily as a walker: a fast beast buys distance, not safety.

## Currency

Essence cores are common coin; favours, oaths, and memories are the uncommon ones. Bureau credits are worthless inside the Gloamreach. **Provenance is optional flavour** — some goods are honest native craft or salvage; some carry a history worth a scene. Use it when it sharpens the moment, not on every sale.
`,
	},
	{
		title: "The Old Roads",
		content: `# The Old Roads

> *The roads are the fastest way through the Gloamreach, and the most exposed. Out here, the dark has room.*
> - Old Man Crane

## Rank and Role

**Rank**: Varies — the roads are everywhere.
**Recommended Level**: Any; travel horror that scales with the act.
**Campaign Role**: The connective tissue of the Gloamreach — the open ground between safe-holds, where the party are most exposed to the hunt.

## Overview

The old native roads, causeways, and rail-cuts link the warded communities, and the natives walk them only by grey daylight, in silence, and never alone. Between the wardlines there is nothing to keep the dark off: open ground, long sightlines, and every footfall carrying. Distance itself is unreliable out here — the way lengthens for the loud and the hunted, landmarks repeat, and the dark has been known to fold a morning's walk into a night that does not end. Travel is never neutral. It is the time the party spend outside the only safety the Gloamreach offers.

> *Read aloud:* The milestones are wrong. You passed that leaning one an hour ago — the same crack, the same moss, the same pale scratch low on the stone that might be a name. The grey light has not moved. Somewhere behind you, something keeps your pace exactly: not closer, not falling back, just there, the way a held breath is there.

## How the Roads Work

- **The open ground.** Off the wardlines there is no safety, only cover and the lack of it. Light and noise carry for miles; the worn dead watch the verges; the Hunt Clock fills faster the longer the party are exposed.
- **The long way.** The roads lengthen against the loud, the lit, and the hunted. A party that travels silent and dark covers ground; one that does not finds the same milestone three times, and the daylight gone.
- **Names on the stones.** The oldest stretches are scratched with names — the taken, and sometimes, freshly, the party's own. A name read aloud on the road is a name given to the dark (see Quiet-Marked).
- **Crossing alone.** Splitting up on the roads is how the dark separates a party for the worn dead. In the deep stretches it does this on purpose; charting the Mana Vein nodes (Ch32) can hold a party together through the worst of it.

## Travel Hazards

Roll on **Table A — The Old Roads** (Ch35) when the party travel between regions, travel loud or lit, carry a piece of the Means openly, or linger too long in the open. The roads belong to the hunt; the dark notices motion, noise, light, and Essence.

## Warden Guidance

The roads are how the Gloamreach stays dangerous even between places. Make travel a scene, not a transition — the time the party are most exposed, and most alone. The refrain, repeated until the players dread it: *get behind a wardline before the clock fills.*
`,
	},
	{
		title: "Chapter 31: The Warded Communities - Keyed Locations",
		content: `# The Warded Communities - Keyed Locations

> *Every wall here is a wardline, every rule a grave someone dug learning it. We do not keep the dark out because we are brave. We keep it out because we remember.*

## Overview

The Gloamreach is a populated country. Its communities are not ruins and not waystations — they are the homes of the Gloamreach's **native inhabitants**, people born here who have never known a world without the dark waiting outside the wards. They survive by rules paid for in generations of the dead, and none of them are safe for free. The horror of a warded community is not that it is monstrous; it is that it is *ordinary* — children, markets, clinics, gossip, bells — running on a price paid in memory, years, secrets, and the occasional neighbour given quietly to the dark so the rest can sleep.

> *Read aloud:* The road tops a rise and there it is: lamplight, woodsmoke, a dog barking, a queue outside a clinic, washing on a line. It looks, for one aching second, like somewhere people simply *live*. Then you notice the wardmarks chalked fresh above every door, the empty chair set at every table for someone the dark already took, and the way everyone goes quiet, fast, when the grey light starts to fail.

Each community below keeps a **rule, a lie, a cost, and a reckoning** — the bargain that has let it survive the Gloamreach. The party will be tempted to free them all. Some of these places have lasted precisely because no one yet tried.

## Location 1 - Mother Rust's Outreach Post

A clinic built in the second floor of a leaning tenement that should not still be standing. Mother Rust treats the sick, the Rift-touched, and those the Bureau would classify as unrecoverable.

The Rule: Mercy must be paid forward.
The Lie: Care is free.
The Cost: Medicine, cores, favors, or silence.
If It Breaks: The clinic starts deciding who is worth saving.

Services:

- Treat Rift-Rot and minor Gloamreach conditions.
- Civilian aftercare.
- Rumors about Awoko recruiters.
- Recovery scenes after major horror encounters.

If Ms. Park survived Day Zero, she may be here under Mother Rust's care.

## Location 2 - The Covered Market

A neutral market under patched canvas and rusted tin. Vermillion runners, settlement traders, smugglers, cult watchers, and now the strangers who came in through the door all pass through.

The Rule: No violence while the bell hangs.
The Lie: Neutrality protects everyone.
The Cost: One secret per stall per week.
If It Breaks: The bell falls, and every unpaid secret becomes public.

Services:

- Rumors.
- Food.
- Salvage.
- Stolen maps.
- Questionable guides.

## Location 3 - The Hamlet That Never Says No

A village where every door wears a fresh chalk ward. The residents speak softly and never, ever say a flat "no" aloud after the lamps are lit — because the dark listens for it.

The Rule: No one says "no" aloud once the lamps are lit.
The Lie: Courtesy keeps them safe.
The Cost: One night a week, a household leaves a door unbarred, and does not ask what comes in.
If It Breaks: The worn dead walk in wearing the face of whoever said no.

Use this community to teach the danger of false safety.

## Location 4 - The Bellweather School

A schoolhouse converted into a shelter. Children draw places they have never seen. The bell rings when the dark shifts.

The Rule: Children may not be taken if someone else answers the bell.
The Lie: The adults always know who should answer.
The Cost: Volunteers stand at the road when the bell rings.
If It Breaks: The road chooses instead.

Mika the Kid can appear here. Her drawings foreshadow the deep dark, the worn dead, and the pieces of the Means.

## Location 5 - Old Man Crane's Teahouse

A quiet teahouse that appears at crossroads. It is always the same room, no matter where the door stands.

The Rule: Tea must be finished before violence.
The Lie: Crane is only an old man.
The Cost: A true story from each guest.
If It Breaks: The story repeats later with worse actors.

Old Man Crane can teach the party a true thing about the Quiet — how it might be held, or where its truth lies — but his knowledge costs more than technique.

## Location 6 - The Empty Mill Village

A settlement whose residents leave food on every table and sleep in locked barns. No one will explain why.

The Rule: The mill must turn by moonrise.
The Lie: Grain is what the mill grinds.
The Cost: Names written on husks and fed into the stones.
If It Breaks: The mill grinds bodies instead.

This is an ideal location for a Means clue or a worn-dead arrival.

## Settlement-Wide Systems

### Civilian Trust

Track how many communities the party protect, exploit, abandon, or free. Civilian trust affects final-act support, rumors, safe rests, and whether common people will stand with the party at the end — or shutter their wards against them.

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

The Gloamreach is threaded with Mana Veins: deep channels of Essence pressure that run under the roads, the settlements, and the deep places. Because the Quiet hunts by Essence, the veins are where its attention pools and the worn dead thicken — and also, Professor Lun believes, where it can be made *deaf*. Map enough nodes, she argues, and a stretch of the Gloamreach could be tuned to drown out sound and power entirely: silent enough to cross unheard, or even silent enough to hold the Quiet still.

The veins run through the whole Gloamreach, but the deep nodes lie in its worst places.

## Node 1 - The Rusted Hull

A dry-docked ship half-buried in black soil far from any sea. A vein pulses beneath the keel.

Challenge: Install a sensor while avoiding a Beast swarm feeding on overflow Essence.  
Reward: Access to one movement-related Sigil or a road shortcut.

## Node 2 - The Silent Depot

A cavernous native sorting-hall where the people once gathered whatever the veins carried up from below. It stands empty now but for the distant counting of the Hollow Way and a voice, in no throat, naming cargoes long since lost. A vein runs through the old reckoning-room.

Challenge: Umbral scouts guard the vein-locks.
Reward: One B-Rank Rune or a clue toward the Means — a way to read where the Quiet goes deaf.

## Node 3 - The Glass Sub-Basement

A buried financial archive beneath the Ashen Counting-House. It contains the deepest active vein outside the lightless deep.

### SB-1 - Security Checkpoint

Old native checkpoint-wards stand beside gear the Vermillion stripped from somewhere far deeper and never came back for. The wards test for the right silence, not the right face — they pass anyone who comes through quiet and dark, and wail at anyone who does not.

### SB-2 - Vein Engine

A glass cylinder contains a pulsing channel of Essence. Installing Lun's sensor requires a DC 15 Intelligence check. On failure, the sensor works, but the spike of Essence rings out through the vein — fill the Hunt Clock, and the Quiet now knows someone is down here.

### SB-3 - The Precedent Echo

Something old stirs in the deepest vein — the Old Power Below — and asks the party what silence is worth to them. Their answer determines whether the node yields a stretch of safe silence, a way to mask their own Essence, or a hard first truth about what the Quiet is.

## What the Veins Buy

If the party charts and tunes all three nodes, they have made a piece of the Gloamreach go *quiet* — a real advantage for the final crossing and, if they attempt it, the gated kill. Choose one:

1. **A silent corridor.** One stretch of the final approach can be crossed with the Hunt Clock frozen — the veins drink the party's noise and Essence, so the Quiet cannot hear them coming.
2. **Masked power.** Once during the finale, the party may spend Essence without advancing the Hunt Clock; the veins swallow the sound of it.
3. **The deaf place.** The party can force the Quiet into a node's dead-silent heart for one scene, where it hunts blind — the single best place to make the one stand that could end it (a piece of the Means; see *The Means to End It*).

## Warden Guidance

Mana Veins should not feel like power generators. They are nerves. When the party touches one, the dark feels it.
`,
	},
	{
		title: "Chapter 33: The Awoko Sanctum",
		content: `# The Awoko Sanctum

## Overview

The Awoko Sanctum hides in a grief-dense fold of the Gloamreach where four rooms share one impossible floor plan — a chapel, a clinic, a theatre, and an execution room, all the same room, depending on why you came. Here beauty is made unbearable and comfort is twisted into bait. The Awoko are natives of the Gloamreach who found the one thing the dark could never quite take by force — grief, freely given — and built a faith on it. They do not see themselves as villains, and they are not lying about the comfort they offer. That is exactly what makes them dangerous.

> *Read aloud:* Someone is singing, low and close — a song you half-remember in a voice you have lost. The air is warm with candlelight and the smell of clean linen, and a gentle hand finds your shoulder before you see whose it is. "You've carried that a long way," the voice says, meaning the grief you did not know showed. "You don't have to. Not here." Every word is true. That is the trap.

They preach that the Quiet is proof you do not have to stay prey — that a thing in this country once climbed out of being hunted and became the hunter — and their leader means to follow it, by feeding the Quiet enough grief and enough dead that it remakes her into something it will never touch.

## Core Truth

The Hollow Mother does not want to hide from the Quiet, and she does not want to kill it. She wants to *become* something like it — and she is willing to feed it her whole flock to get there.

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

Idol-class cultists sing grief into a shape the dark will answer. Interrupting the choir can scatter the worn dead the song has drawn in close, or weaken the Hollow Mother's ritual.

### S-5 - Sister Veil's Laboratory

Sister Veil knows the ritual math is wrong. She can defect if shown evidence that the Hollow Mother intends to use the cult as fuel.

### S-6 - The Ritual of Becoming

A circular chamber with seven candle-stations, each burning with grief-tallow. If completed, the ritual offers the Hollow Mother to the Quiet on an altar of the community's grief — a bid to be remade into a new thing that hunts, instead of one more thing that is hunted.

## Major NPCs

### The Hollow Mother

Charismatic, grieving, brilliant, and predatory. She speaks softly. She never says die when become will do.

### Sister Veil

Ritualist and possible defector. She is guilty, but not unreachable.

### Acolyte Mara

A young initiate who can become a human face for the cult's victims.

## Ritual Disruption

The party can disrupt the ritual by:

1. Destroying one correct candle-station.
2. Convincing Sister Veil to corrupt the final chant.
3. Removing the stored grief from the Confession Chamber.
4. Presenting proof that the Hollow Mother intends to feed them all to the dark, not free them.

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
