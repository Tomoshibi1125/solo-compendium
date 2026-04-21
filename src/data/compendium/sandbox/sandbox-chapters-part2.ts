import type { SandboxChapter } from "../ascendant-sandbox-module";

// ============================================================================
// THE SHADOW OF THE REGENT — CHAPTERS 9-16
// Part II: Gate Dungeons (D through S Rank) + The Executioner
// ============================================================================

export const chaptersPart2: SandboxChapter[] = [
	{
		title: "Chapter 9: Gate — The Drowned Ward (D-Rank)",
		content: `# Gate: The Drowned Ward (D-Rank)

## Gate Information
- **Rank**: D
- **Location**: Portal in the lobby of Yongsan General Hospital
- **Portal Appearance**: A sickly green-white disc trailing tendrils of mist
- **Blue Phase Timer**: 7 days from Day 2 of campaign
- **Recommended Level**: 2–3

## Entering the Gate

> **Read Aloud**: *"The hospital lobby dissolves the moment you cross the threshold. You stand in a corridor that smells of antiseptic and decay. Water drips from the ceiling in a steady rhythm. The walls are tiled white, stained with something dark. Fluorescent lights buzz overhead, half of them dead. Somewhere ahead, a heart monitor beeps — steady, mechanical, impossible. This is a hospital, but not one built for healing."*

The dimension inside is a nightmarish hospital that extends far beyond any real building. Corridors stretch for hundreds of meters. Wards contain examination tables with leather restraints. Specimen tanks line the walls of lower floors, some cracked and leaking, others still sealed with shapes floating inside.

## Key Areas

### Triage Ward (Entry Floor)
- Mostly safe. Abandoned gurneys and scattered medical supplies.
- **Loot**: Medical supply cabinet — 3 mana rations, 1 antitoxin kit (advantage on poison saves for 1 hour).
- 2 **Writhing Husks** (D-Rank Anomalies) shamble through the ward. Slow, but they scream when damaged, alerting nearby Anomalies.

### Specimen Wing (Second Floor)
- Rows of sealed tanks along both walls. DC 12 Investigation to examine safely.
- **Tank Contents** (d4 per tank examined):
  1. Empty — cracked glass, dried residue
  2. Preserved D-Rank Anomaly — worth 100 Credits if extracted intact (DC 14 Medicine)
  3. **Trap** — tank cracks, releasing toxic mana gas. DC 12 Vitality save or poisoned for 1 hour
  4. **Clue** — research notes floating inside. Details on the Regent's biology. +1 Bureau reputation if reported.
- 4 **Bone Surgeons** (D-Rank Anomalies) patrol the wing. They wield surgical tools as weapons.
  - +4 to hit, 1d6+2 slashing, bonus action: inject target (DC 12 Vitality save or paralyzed for 1 round)

### The Catalog's Chamber (Third Floor)
- A sealed records room. Door requires DC 16 Thieves' Tools or DC 18 Strength.
- Inside: **The Catalog**, a sapient crystalline Anomaly that has absorbed the hospital's data systems.
- The Catalog is not hostile. It speaks in a flat, clinical tone and offers information in exchange for "data" — reports about the outside world, descriptions of other Gates, or personal memories.
- **Information Available** (one per piece of "data" traded):
  - "The entity behind the S-Rank Gate has been attempting to manifest for 147 days."
  - "The Awoko Cult has been performing rituals to accelerate Gate maturation."
  - "There is a living weapon in the specimen vault below. It remembers being human."
  - Location of a Regent Relic (if one is placed in this Gate)

### Specimen Vault (Basement)
- The lowest level. Flooded knee-deep in mana-saturated water (+1d4 necrotic per round standing in it without protection).
- Contains **Specimen X** — a partially transformed human trapped in a containment pod. If freed (DC 14 Strength), Specimen X is disoriented but grateful. Can be recruited as an NPC ally.
- Boss: **The Head Surgeon** (C-Rank Anomaly)

#### Boss: The Head Surgeon
- **HP**: 55 | **AC**: 14 | **Speed**: 30 ft.
- **Abilities**:
  - *Multiattack*: Scalpel slash (+6 to hit, 1d8+4 slashing) + Injection (+6 to hit, target makes DC 13 Vitality save or is restrained for 1 round)
  - *Surgical Precision*: Crits on 19-20
  - *Emergency Protocol* (at half HP): Summons 4 Writhing Husks and heals 10 HP
  - *Anesthetic Cloud* (1/day): 15 ft. cone, DC 13 Vitality save or fall unconscious for 1 minute (save at end of each turn)
- **Tactics**: Uses Anesthetic Cloud on clustered players, then focuses single targets with Surgical Precision.
- **Weakness**: Fire damage destroys the surgical tools, removing Multiattack for 1 round.

#### Loot
- 4 C-Rank Anomaly cores (150 Credits each)
- **Surgeon's Precision Blade** (uncommon Relic): +1 weapon, crits on 19-20. Worth 1,200 Credits.
- **Regent Relic of the Void** (if placed here by divination)
- **Canon X-Ref (Ch. 27)**: guaranteed drop — *Sigil of the Frost-Ward* (sigils.ts, sigil-res-fire-1). Pair with the Cold-Iron Scalpel for a freezer-burn damage-type combo.

> **Deity flavor**: Kael Voss, *The Weaver of the Absolute*. The Drowned Ward is an umbral-reap domain; every Anomaly killed here contributes to Kael Voss's Legion by canon precedent.`,
	},
	{
		title: "Chapter 10: Gate — The Fungal Depths (D-Rank)",
		content: `# Gate: The Fungal Depths (D-Rank)

## Gate Information
- **Rank**: D
- **Location**: Portal inside a parking garage on 4th Street
- **Portal Appearance**: A yellow-green disc that pulses rhythmically, releasing spore-like particles
- **Blue Phase Timer**: 7 days from Day 3 of campaign
- **Recommended Level**: 2–4

## Entering the Gate

> **Read Aloud**: *"The concrete of the parking garage gives way to damp cave walls. Bioluminescent fungi cover every surface — ceiling, floor, walls — casting the cavern in shifting blues and purples. The air is thick, warm, and smells of wet earth. Structures that might have been stalactites have been consumed by fungal growth, forming alien columns of pulsing mycelium. Something breathes down here. You can feel it in the floor."*

## Key Areas

### The Glowing Cavern (Entry)
- Beautiful but dangerous. The bioluminescent fungi are mildly toxic.
- Standing still for more than 1 minute: DC 10 Vitality save or gain disadvantage on Perception (hallucinations) for 10 minutes.
- 3 **Spore Drifters** (E-Rank Anomalies) float through the air like jellfish. Passive — they only attack if touched or if fire is used in their vicinity.

### The Mycelium Maze
- A twisting network of fungal tunnels. DC 13 Survival to navigate without getting lost.
- **Lost**: Party circles for 1 hour, each member makes DC 11 Vitality save vs. spore exposure (1d6 poison on fail).
- **Found**: Short path to the Nursery.
- **Hazard**: Explosive Puffballs. DC 12 Perception to spot. Stepping on one: 2d6 poison damage in 10 ft. radius, DC 12 Dex for half.

### The Nursery
- A massive cavern where the fungi are growing new Anomalies — fetal forms encased in translucent pods.
- 6 **Mycelium Soldiers** (D-Rank): Humanoid fungal constructs. 
  - HP 18 | AC 12 | +3 to hit, 1d6+1 bludgeoning + DC 10 Vitality save or spore cloud (poisoned for 1 round)
- **Treasure**: Behind the nursery pods, a natural spring of purified mana water. Drinking it restores all HP and removes all conditions. Can fill 3 vials (each acts as a superior mana ration, healing 4d4+4).
- **Clue**: One of the pods contains something metallic — a **Regent Relic** (if placed here).

### Boss Chamber — The Root Heart
- The tunnels descend to a vast subterranean lake of mana-saturated water. At its center, the **Mycelium Hive Queen** clings to the ceiling like a massive spider.

#### Boss: Mycelium Hive Queen
- **HP**: 60 | **AC**: 12 | **Speed**: 20 ft., climb 30 ft.
- **Abilities**:
  - *Tendril Lash* (reach 15 ft.): +5 to hit, 2d6+3 bludgeoning, target grappled (DC 13 to escape)
  - *Spore Burst* (Recharge 5-6): All creatures within 20 ft. make DC 13 Vitality save or take 3d6 poison and are blinded for 1 round
  - *Regeneration*: Regains 5 HP at start of turn while touching the cavern floor/ceiling
  - *Spawn Soldiers* (1/day): Summons 3 Mycelium Soldiers
- **Tactics**: Stays on ceiling, uses Tendril Lash to grab targets and drag them through the mana lake (1d4 poison per round submerged). Falls from ceiling if dealt 15+ fire damage in one hit.
- **Weakness**: Fire damage stops Regeneration for 1 round.

#### Loot
- 5 Anomaly cores (mixed D/C rank, ~700 Credits total)
- **Hive Queen's Spore Sac** (uncommon Relic): Once per long rest, release a cloud in 15 ft. radius — enemies make DC 13 Vitality save or poisoned for 1 minute. Worth 1,000 Credits.
- **Purified Mycelium Crystal**: Rare ingredient. Mother Rust will pay 1,500 Credits or brew a B-Rank potion with it.
- **Canon X-Ref (Ch. 27)**: guaranteed drop — *Sigil of the Cleansed Blood* (sigils.ts, sigil-res-poison-2). Counter-pair for Awoko poison rituals.

> **Deity flavor**: Lyra, *The Queen of the Swarm* + Marthos substrate. Lyra's Mother of Evolution drives the fungal bloom; Marthos's rot keeps it from stopping.`,
	},
	{
		title: "Chapter 11: Gate — The Verdant Overgrowth (C-Rank)",
		content: `# Gate: The Verdant Overgrowth (C-Rank)

## Gate Information
- **Rank**: C
- **Location**: Portal in Yongsan Central Park, hovering above the fountain
- **Portal Appearance**: A vibrant green disc wreathed in flowering vines that grow and wither in seconds
- **Blue Phase Timer**: 7 days from Day 4 of campaign
- **Recommended Level**: 4–5

## Entering the Gate

> **Read Aloud**: *"The park fountain vanishes and you're standing in a forest that shouldn't exist. Massive trees, hundreds of feet tall, grow through the shattered remains of apartment buildings. Vines thick as fire hoses crawl up crumbling concrete walls. A canopy of leaves blocks the sky entirely — but the foliage itself glows with inner light, casting everything in a shifting emerald twilight. Birds that aren't birds call from above. Something enormous moves through the upper canopy, shaking leaves the size of car doors loose in its wake."*

This is a nature-aspect Gate — a dimension where explosive botanical growth has consumed an echo of the city. The result is a vertical jungle growing through ruined buildings, creating a multi-layered battlefield of street level, mid-story, and canopy.

## Key Areas

### Street Level — The Undergrowth
- Dark, tangled, dangerous. Minimal visibility (heavy obscurement beyond 30 ft.).
- **Root Trap Hazard**: DC 14 Perception to spot. Triggering: DC 13 Agility save or restrained. DC 14 Strength to break free, or take 1d6 bludgeoning per round as roots constrict.
- 4 **Thornback Prowlers** (C-Rank): Predatory plant-beasts that camouflage as foliage.
  - HP 32 | AC 14 (natural bark armor) | +5 to hit, 2d6+3 piercing + DC 12 Vitality save or 1d6 poison
  - **Ambush**: Advantage on attack rolls in first round if target failed Perception check

### Mid-Story — The Ruined Apartments (where Echo-7 lives)
- Accessible by climbing vines (DC 10 Athletics) or through intact stairwells in the buildings.
- **Echo-7's Nest**: A partially transformed human-plant hybrid living in an apartment on the 6th floor. Echo-7 was an Ascendant who entered this Gate weeks ago and was changed by the mana saturation.
  - Echo-7 is not hostile. They are confused, lonely, and slowly losing their humanity.
  - **Information**: Echo-7 knows the boss's weakness (fire) and can guide the party to the canopy.
  - **Recruitment**: If the party promises to find a cure (requires Dr. Hayashi's help + a tissue sample from the boss), Echo-7 joins as an NPC ally with both plant and human abilities.

> **Echo-7** (speaking slowly, voice layered with rustling leaves):
> *"I... came in... three weeks ago? Longer? The trees talk here. After a while... you start talking back. Don't stay too long. Please. Get out before the roots find your feet."*

### The Canopy — Treetop Combat Zone
- 200 feet above street level. Platforms of interwoven branches connect the massive treetops.
- Movement is precarious: DC 12 Acrobatics to move at full speed. Failure = half speed.
- **Falling**: 20d6 fall damage to street level. DC 15 Agility save to grab a vine (halves distance).
- 3 **Canopy Harpies** (C-Rank): Winged Anomalies that try to knock players off branches.
  - HP 28 | AC 13 | Flyby: no opportunity attacks when flying. +5 to hit, 1d8+3 slashing + DC 12 Strength save or pushed 10 ft.
- **Echo-Nine's Dreamscape**: The psychic NPC Echo-Nine can be found meditating on a platform of woven flowers. She's been communing with the Gate's mana field.
  - **Echo-Nine** offers to share a vision: the party briefly sees through the Regent's eyes — darkness, hunger, chains of light (the Relics) binding it.
  - **Recruitment**: Agree to enter the Regent's Domain. Echo-Nine wants to understand the Regent's mind.

### Boss Chamber — The Heart Tree
- At the apex of the tallest tree, a massive flower bud 30 feet across pulses with green light.

#### Boss: The Bloom Tyrant
- **HP**: 85 | **AC**: 15 (bark plates) | **Speed**: 0 ft. (rooted), reach 20 ft.
- **Abilities**:
  - *Multiattack*: 3 vine lash attacks (+6 to hit, 1d10+4 bludgeoning, reach 20 ft.)
  - *Entangle* (Recharge 5-6): 30 ft. radius, DC 14 Str save or restrained by vines. Restrained targets take 2d6 piercing at start of each turn.
  - *Pollen Storm* (1/day): 60 ft. radius. DC 14 Vitality save or charmed for 1 minute (target views the Bloom Tyrant as an ally). Save at end of each turn.
  - *Regeneration*: 10 HP/round while rooted
- **Tactics**: Stays rooted, uses reach to attack. Pollen Storm to charm front-liners, then crushes isolated targets.
- **Weakness**: Fire damage stops Regeneration and deals double damage. Dealing 20+ fire in one hit causes the Bloom Tyrant to uproot (loses Regeneration permanently, gains 30 ft. speed, loses 5 AC).

#### Loot
- 6 C-Rank cores (150 Credits each)
- **Bloom Tyrant's Heartwood** (rare Relic): Once per day, cast Entangle (DC 14). Worth 2,000 Credits.
- **Living Mana Vial**: The sap of the Heart Tree. Mother Rust's recruitment item.
- **Canon X-Ref (Ch. 27)**: guaranteed drop — *Sigil of the Zephyr's Tread* (sigils.ts, sigil-mobility-1). A-rank mobility for the party's scouts.

> **Deity flavor**: Lyra, *The Queen of the Swarm*. The Verdant Overgrowth is Lyra's most honest expression — adapt or die, in bloom form.
- **Regent Relic** (if placed here by divination)`,
	},
	{
		title: "Chapter 12: Gate — The Ashen Vault (C-Rank)",
		content: `# Gate: The Ashen Vault (C-Rank)

## Gate Information
- **Rank**: C
- **Location**: Portal in the lobby of Hana Financial Tower
- **Portal Appearance**: An orange-red disc that radiates heat, floor around it scorched black
- **Blue Phase Timer**: 7 days from Day 5 of campaign
- **Recommended Level**: 4–6

## Entering the Gate

> **Read Aloud**: *"The air hits you first — a blast of heat that dries your eyes. The bank lobby has become a burning ruin. Everything is fire-lit. The ceiling has collapsed in places, revealing floors above engulfed in slow, rolling flames that never quite consume the building. Ash drifts like snow. The walls crack and groan. Somewhere above, glass shatters. This entire dimension is a skyscraper that has been burning forever and will never stop."*

## Key Areas

### Ground Floor — The Burning Lobby
- Extreme heat. Without fire resistance, characters take 1d4 fire damage per 10 minutes.
- **Mana Ration Trick**: Consuming a mana ration provides 30 minutes of heat resistance.
- 3 **Cinder Wraiths** (C-Rank): Humanoid shapes of compressed ash and ember.
  - HP 30 | AC 13 | Fire immune | +5 to hit, 1d8+3 fire. On death: explode for 1d6 fire in 5 ft.
- **Loot**: A cracked ATM against the wall contains 500 Credits in melted-together coins (usable).

### Upper Floors — Vertical Combat
- The building's stairwells are partially collapsed. Ascent requires:
  - Floor 2-5: Intact stairs (basic navigation)
  - Floor 6-10: Climbing through elevator shafts (DC 12 Athletics per floor, failure = 1d6 fall + 1d4 fire)
  - Floor 11+: Exterior climbing on the building face (DC 14 Athletics, exposed to winds)
- **Collapsing Floor Hazard** (Floors 3-8): DC 13 Perception to spot weak floors. If not spotted, DC 14 Agility save or fall through (2d6 bludgeoning + 1d6 fire from landing in flames below).
- Random encounters per 2 floors climbed (d4):
  1. 2 Cinder Wraiths
  2. **Flame Geyser**: DC 13 Agility save, 3d6 fire on failure
  3. Safe floor — a break room that isn't burning. Possible short rest.
  4. **Cult Activity**: 3 Awoko Cult members performing a ritual. Combat or DC 16 Stealth to bypass.

### Floor 15 — The Awoko Cult Ritual Sanctum
- The Cult has set up operations here. The Hollow Mother is NOT present, but her lieutenant **Blood Zealot Karn** (Level 7) leads the ritual.
- The Cult is attempting to accelerate this Gate's collapse to cause a Gate Break — they want Anomalies flooding the street.
- **Encounter**: Blood Zealot Karn + 6 Cult Acolytes
  - **Karn**: HP 65 | AC 15 | +7 to hit, 2d8+4 necrotic | *Blood Drain*: on hit, heals for half damage dealt | *Fanatic Frenzy* (1/day): all Cult allies gain advantage on attacks for 2 rounds
  - **Acolytes** (6): HP 15 each | AC 11 | +3 to hit, 1d6+1 slashing | *Self-Sacrifice*: When Karn takes damage, an acolyte within 5 ft. can take the damage instead
- **Disrupting the Ritual**: DC 14 Arcana check as an action while within the ritual circle. Success stops the Gate Break acceleration. Failure triggers a mana backlash (2d8 force damage to the character).

### Basement Vault — The Vault
- Accessible via a service elevator that still functions (ominously).
- A massive bank vault door, already open. Inside: a pocket of frozen time. The fire doesn't reach here.
- **Treasure Room**: Business suits on mannequins, safety deposit boxes.
  - Searching boxes (20 total, DC 10 Thieves' Tools each): 1d4 × 100 Credits per box, plus 1d20 roll:
    - On 20: A **Rune of Searing** (bonus 1d6 fire damage on weapon attacks for 24 hours)
  - **Regent Relic of the Abyss** (if placed here by divination): In the deepest vault, behind a secondary door (DC 18 Thieves' Tools).

### Boss Chamber — The Furnace Core (Floor 20, Rooftop)

#### Boss: The Ember Warden
- **HP**: 95 | **AC**: 16 | **Speed**: 40 ft., fly 30 ft. (hover)
- Fire immune, Cold vulnerable
- **Abilities**:
  - *Multiattack*: 2 flame sword strikes (+7 to hit, 2d8+4 fire)
  - *Inferno Wave* (Recharge 5-6): 30 ft. cone, DC 15 Agility save, 4d6 fire (half on save)
  - *Heat Aura*: All creatures within 10 ft. take 1d6 fire at start of Ember Warden's turn
  - *Meltdown* (at 25% HP): Explodes, dealing 6d6 fire in 20 ft. radius (DC 15 Dex half), then reforms at full speed but half HP
- **Tactics**: Flies above melee range, swoops for attacks. Uses Inferno Wave on clustered groups.
- **Weakness**: Cold damage. Any cold attack stuns the Ember Warden for 1 round (once per encounter).

#### Loot
- 6 C-Rank cores (900 Credits total)
- **Ember Warden's Flame Blade** (rare Relic): +1 weapon, deals extra 1d6 fire. Worth 2,500 Credits.
- **Fireproof Cloak**: Resistance to fire damage. Worth 1,800 Credits.
- **Canon X-Ref (Ch. 27)**: guaranteed drop — *Sigil of the Crimson Weeping* (sigils.ts, sigil-bleeding-1). Canonical Awoko ritual sigil hoarded by Hana Financial Tower's secret vault.
- **Alt-artifact**: **Bloodthirsty Greatsword** (relics-comprehensive.ts, bloodthirsty-greatsword) — in the vault if party has Bureau Trusted + Blackwood's mission advanced.

> **Deity flavor**: Kronos, *The Fragment of the Absolute*. The Vault holds echoes of the financial transactions time has forgotten; Kronos's coinage is all here, now ash.`,
	},
	{
		title: "Chapter 13: Gate — The Sunken Tunnels (B-Rank)",
		content: `# Gate: The Sunken Tunnels (B-Rank)

## Gate Information
- **Rank**: B
- **Location**: Portal inside an open manhole on Industrial Avenue
- **Portal Appearance**: A deep blue-black disc that drips water upward into the air
- **Blue Phase Timer**: 7 days from Day 7 of campaign
- **Recommended Level**: 6–7

## Entering the Gate

> **Read Aloud**: *"The sewer smell vanishes the moment you step through. Instead — salt. The unmistakable smell of ocean. You're standing in a tunnel carved from coral and black stone, waist-deep in dark water that stretches into darkness in both directions. The ceiling drips with bioluminescent organisms casting cold blue light. The water is warm. Something massive moves beneath its surface — you feel the displacement against your legs."*

This Gate's pocket dimension is an underground ocean. The tunnels are partially submerged, connecting air-pocketed chambers to fully flooded corridors. B-Rank Anomalies patrol the waters.

## Environmental Rules
- **Water Movement**: Half speed in waist-deep water. Swimming in deep areas requires DC 12 Athletics per round.
- **Underwater Combat**: Disadvantage on melee attacks, ranged attacks auto-miss beyond 30 ft.
- **Pressure**: Below 100 ft. depth, DC 14 Vitality save per minute or 2d6 bludgeoning.
- **Visibility**: 30 ft. in shallow areas, 15 ft. in deep water.

## Key Areas

### The Upper Tunnels (Shallow Water)
- Maze of interconnected sewer-like tunnels. Waist-deep water throughout.
- 4 **Depth Crawlers** (C-Rank): Crustacean Anomalies with armored shells.
  - HP 35 | AC 16 (shell) | +5 to hit, 2d6+3 slashing | *Shell Retreat*: As reaction, +4 AC until start of next turn
- **Awoko Cult Forward Base**: The cult has established a forward base in a dry chamber. 4 Cult members + The Prophet (Whisper).
  - **The Prophet / Whisper** is a cult defector hiding among them. DC 14 Insight reveals they are terrified.
  - If approached alone: Whisper offers intelligence on The Hollow Mother in exchange for safe passage out of the Gate.
  - **Information**: The Hollow Mother plans to trigger a simultaneous Gate Break across all remaining Gates on Day 10.

### The Millwright's Workshop (Dry Chamber)
- A large air-pocketed cavern where **The Millwright** (Level 7 Technomancer NPC) has been living for weeks.
- The Millwright is building a **Gate Suppression Device** — a mana-tech machine that can prevent Gate Breaks.
- **The Millwright needs**:
  1. A B-Rank Anomaly core (from the boss of this Gate)
  2. Technical schematics from Dr. Hayashi (Bureau HQ)
  3. 5,000 Credits in raw materials
- If all three are provided, the Gate Suppression Device becomes available — the Warden can use it to prevent ONE Gate Break during the campaign.
- **Recruitment**: Complete the device. The Millwright joins the party for the final battle.

### The Deep — Flooded Abyss
- Fully submerged tunnels requiring swimming or water-breathing magic.
- The tunnels open into a massive underwater cavern — an underground ocean.
- 2 **Abyssal Lurkers** (B-Rank): Massive eel-like Anomalies, 30 ft. long.
  - HP 55 | AC 14 | Swim 60 ft. | +7 to hit, 2d10+4 piercing | *Swallow* (Large or smaller): +7 vs. AC, target is swallowed (blinded, restrained, 2d6 acid at start of each turn). Dealing 15 damage from inside forces regurgitation.

### Boss Chamber — The Trench

#### Boss: Abyssal Leviathan
- **HP**: 130 | **AC**: 17 (armored scales) | **Speed**: Swim 60 ft.
- **Abilities**:
  - *Multiattack*: Bite (+9 to hit, 3d10+5 piercing) + Tail Slam (+9 to hit, 2d8+5 bludgeoning, DC 16 Str save or knocked prone)
  - *Tidal Surge* (Recharge 5-6): 60 ft. line, DC 16 Str save, 4d8 bludgeoning + push 30 ft. (half damage, no push on save)
  - *Depth Pressure* (Passive): All creatures within 30 ft. have disadvantage on Strength checks (pressure)
  - *Swallow*: On bite crit, target is swallowed (blinded, restrained, 3d6 acid/turn, 20 damage from inside to escape)
- **Tactics**: Circles the outer edge of the cavern, dives from below. Uses Tidal Surge to separate party. Swallows isolated targets.
- **Weakness**: Lightning damage. The Leviathan's scales conduct — lightning attacks deal extra 1d8 and force a DC 14 Vitality save or stunned for 1 round.

> **Read Aloud (Boss Appears)**: *"The water goes still. Then the current reverses. Something is rising from the trench below — a shape so large it blocks out the bioluminescent glow entirely. Two eyes the size of shields open in the darkness, ancient and furious. The Leviathan has found you."*

#### Loot
- 4 B-Rank cores (500 Credits each)
- **Leviathan Scale Shield** (rare Relic): +2 shield, resistance to cold damage. Worth 3,500 Credits.
- **Regent Relic of the Abyss** (if placed here by divination): Around the Leviathan's neck like a collar.
- **Canon X-Ref (Ch. 27)**: guaranteed drops — *Sigil of the Winter Court* + *Sigil of the Hearth-Fire* (sigils.ts, sigil-frost-1 + sigil-res-cold-1). Hot-cold mirror pair.
- **Alt-anomaly stat**: use *Corrupted Celestial Guardian (Demon)* from anomalies/rank-s.ts (anomaly-0025) for the Abyssal Leviathan, downscaled to B-Rank HP.

> **Deity flavor**: Sylph, *The Eternal of Transfiguration*. The tunnels are Gate-wind veins; Sylph's breath pushes against every hull seal the Bureau ever tried to hold.`,
	},
	{
		title: "Chapter 14: Gate — The Frozen Citadel (B-Rank)",
		content: `# Gate: The Frozen Citadel (B-Rank)

## Gate Information
- **Rank**: B
- **Location**: Portal on the rooftop of the Yongsan Trade Center
- **Portal Appearance**: A white-blue disc rimmed with frost, air temperature drops 20°C within 50 ft.
- **Blue Phase Timer**: 7 days from Day 8 of campaign
- **Recommended Level**: 6–8
- **Special**: This is a **Red Gate variant** — once all party members enter, the portal seals behind them. The only exit is killing the boss.

## Entering the Gate

> **Read Aloud**: *"The city rooftop vanishes. You stand on a bridge of ice spanning an infinite chasm. Ahead, a fortress of crystallized frost rises from a glacier — spires of blue-white ice stabbing into a sky of permanent twilight. Snow falls sideways. The wind screams. Your breath freezes in your lungs. And behind you — the Gate is gone. The portal has sealed. The only way out is through."*

## Environmental Rules
- **Extreme Cold**: DC 12 Vitality save every hour or gain 1 level of exhaustion (cold resistance negates)
- **Icy Surfaces**: DC 12 Acrobatics when moving at full speed or fall prone
- **Blizzard Zones**: Heavily obscured beyond 20 ft. Disadvantage on Perception.

## Key Areas

### The Ice Bridge (Entry)
- 200 ft. long, 10 ft. wide, bottomless chasm on both sides
- **Hazard**: Halfway across, 2 **Frost Stalkers** (B-Rank) attack from below
  - HP 45 | AC 15 | Climb 40 ft. | +6 to hit, 2d6+4 cold | *Ice Grip*: grappled targets take 1d8 cold per round
- DC 14 Agility save to maintain footing during combat on the bridge

### The Outer Wall
- Massive ice fortification with arrow slits. The wall is manned by 6 **Frost Sentinels** (C-Rank constructs).
  - HP 25 | AC 16 | Ranged: ice shard +5, 1d8+3 cold, 120 ft. range
- **Options**: Frontal assault, stealth approach (DC 16 group Stealth), or underground passage (DC 14 Perception to discover a crack in the glacier leading to the Inner Keep).

### The Inner Keep — Frozen Barracks
- Hundreds of Anomalies frozen in ice, arranged in formation like an army awaiting orders.
- They are NOT active — they're being stored. If the Regent manifests, this army awakens.
- **Clue**: A Bureau badge frozen in the ice. Strike Team Seven was here. One member (Ghost) survived.
- **Treasure**: An armory alcove contains 3 **Frost Rune Weapons** (C-Rank, deal extra 1d4 cold). Worth 600 Credits each.

### The Throne Room

> **Read Aloud**: *"The throne room is vast — a cathedral of ice with a vaulted ceiling lost in frozen mist. At its center, a throne carved from a single glacier. Seated upon it, motionless, is a figure in armor of midnight blue ice, a crown of frozen lightning upon its brow. As you enter, the temperature drops so sharply your mana rations crack in their containers. Its eyes open. They are the color of deep ocean."*

#### Boss: The Frost Sovereign
- **HP**: 140 | **AC**: 18 (ice armor) | **Speed**: 30 ft.
- Cold immune, Fire vulnerable
- **Abilities**:
  - *Multiattack*: 2 frost blade attacks (+8 to hit, 2d10+5 cold)
  - *Blizzard Aura* (Passive): 30 ft. radius, difficult terrain, 1d6 cold at start of each creature's turn
  - *Flash Freeze* (Recharge 5-6): DC 16 Vitality save in 20 ft. radius. Fail: restrained (encased in ice). DC 16 Str at end of turn to break free. If still frozen after 2 rounds: petrified (frozen solid).
  - *Ice Throne Regeneration*: While within 30 ft. of the throne, regenerates 10 HP/round
  - *Summon Guard* (2/day): Awakens 2 frozen Anomalies from the barracks (use Frost Sentinel stats)
- **Phase 2** (at 50% HP): The Sovereign shatters its own throne, ending regeneration but gaining *Frost Nova*: 40 ft. radius, 6d8 cold, DC 16 Dex half. Uses immediately upon triggering.
- **Tactics**: Stays near throne for regeneration. Uses Flash Freeze on melee fighters, then focuses ranged characters.
- **Weakness**: Fire damage. 15+ fire in one hit cracks the ice armor (−2 AC permanently, stacks).

#### Loot
- 5 B-Rank cores (2,500 Credits total)
- **The Sovereign's Crown** (rare Relic): Resistance to cold. Once per day, cast Flash Freeze (DC 14). Worth 4,000 Credits.
- **Regent Relic of the Abyss** (if placed here): Frozen into the throne. Freed when Sovereign enters Phase 2.
- **Canon X-Ref (Ch. 27)**: guaranteed drops — *Sigil of the True Glacier* + *Sigil of the Grounded Soul* (sigils.ts, sigil-res-frost-2 + sigil-res-lightning-1).
- **Alt-artifact**: **Frost Axe** (relics-comprehensive.ts, frost-axe) instead of The Sovereign's Crown for two-handed builds.
- **Alt-anomaly stat**: use *Corrupted Celestial Serpent (Elemental)* from anomalies/rank-s.ts (anomaly-0030) for The Frost Sovereign, downscaled to B-Rank HP.

> **Deity flavor**: Cipher, *The Eternal of Frost*. The Citadel is a pure Cipher-aspect Gate; memory preserved in crystal lattice. The Frozen Strike-Team in the throne room is Cipher's judgement made literal.
- **Regent Relic of Blood** (if placed here): Clutched in a frozen S-Rank corpse near the barracks.`,
	},
	{
		title: "Chapter 15: Gate — The Obsidian Spire (A-Rank)",
		content: `# Gate: The Obsidian Spire (A-Rank)

## Gate Information
- **Rank**: A
- **Location**: Portal in the Yongsan City Center plaza, at the base of a large fountain
- **Portal Appearance**: A dark purple disc crackling with visible mana lightning
- **Blue Phase Timer**: 7 days from Day 9 of campaign
- **Recommended Level**: 8–9

## Entering the Gate

> **Read Aloud**: *"You step through and vertigo seizes you. You're standing at the base of a tower — a spire of black glass that rises so high its peak is lost in storm clouds. Lightning arcs between the clouds and the spire's surface. The ground around it is obsidian, flat and mirror-smooth, reflecting a sky that churns with violet energy. There is no horizon. The spire is the only structure in an infinite void. The only way is up."*

## Structure

The Obsidian Spire is a 20-floor tower. The party must ascend floor by floor. Each floor is a self-contained challenge.

### Floor Plan (Summary — detail key floors)

| Floor | Challenge | Key Feature |
|-------|-----------|-------------|
| 1–3 | Combat gauntlet | 2d4 B-Rank Anomalies per floor |
| 4 | Puzzle | Mana conduit alignment (DC 15 Arcana) |
| 5 | Rest floor | Safe. Mana fountain restores half HP. |
| 6–8 | Combat + traps | Trap floors (DC 14 Perception) + Anomalies |
| 9 | NPC encounter | **The Watcher** offers a bargain |
| 10 | Safe floor | Short rest only. Ominous rumbling. |
| 11–14 | Escalating combat | A-Rank Anomalies. 1 per floor. |
| 15 | Puzzle | Reality distortion — gravity shifts randomly |
| 16–18 | Gauntlet | Continuous waves. No rests between floors. |
| 19 | Pre-boss | The Watcher's final offer |
| 20 | Boss | Spire Guardian |

### Floor 9 — The Watcher

A vast chamber with a panoramic view of the void. At its center, a being of pure mana energy sits cross-legged, radiating calm.

> **The Watcher** (ancient, resonant voice):
> *"I have guarded this spire since the first Gate opened. I am not your enemy. I am a test. The Regent seeks to break through — I seek to determine if your kind is strong enough to stop it. Tell me: are you willing to sacrifice to save your world?"*

**The Watcher's Bargain**:
- Offers the party ONE choice:
  1. **Power**: Each party member gains +2 to one ability score permanently. Cost: The Watcher takes one random Regent Relic from the party's possession (if they have one).
  2. **Knowledge**: The Watcher reveals the exact location of all three Regent Relics. Cost: Each party member permanently loses 5 max HP.
  3. **Passage**: The Watcher lets them skip floors 11–18 (straight to the boss). Cost: Nothing, but they miss all loot on those floors.
  4. **Refusal**: The party fights The Watcher (see stats below) and continues normally.

#### The Watcher (if fought)
- **HP**: 120 | **AC**: 17 | **Speed**: fly 40 ft. (hover)
- **Abilities**:
  - *Mana Beam*: +9 to hit, 120 ft. range, 3d10 force
  - *Reality Warp* (Recharge 5-6): Teleports all creatures within 30 ft. to random positions on the floor. DC 16 Sense save or disoriented (disadvantage on attacks for 1 round).
  - *Phase Shift* (Reaction): When hit by an attack, 50% chance to become incorporeal (attack passes through, dealing no damage)
  - *Final Test* (at 25% HP): Stops fighting. "You are worthy." Offers the bargain again, free of cost.

### Floor 20 — Spire Guardian

#### Boss: Spire Guardian (Obsidian Golem)
- **HP**: 160 | **AC**: 19 (obsidian plates) | **Speed**: 30 ft.
- Resistant to all non-magical damage. Immune to psychic.
- **Abilities**:
  - *Multiattack*: 2 slam attacks (+10 to hit, 3d8+6 bludgeoning)
  - *Obsidian Shatter* (Recharge 5-6): Stomps the ground. 30 ft. radius, DC 17 Agility save, 5d8 piercing (obsidian shrapnel). Half on save.
  - *Reconstruct*: 15 HP/round regeneration. Stopped by dealing 20+ damage in a single hit.
  - *Lightning Rod*: Absorbs lightning — lightning damage heals it.
  - *Overload* (at 25% HP): Channels the spire's energy. Next attack deals triple damage but leaves it stunned for 1 round.
- **Tactics**: Methodical. Advances, slams, retreats to regenerate. Uses Obsidian Shatter when 3+ targets are in range.
- **Weakness**: Sonic/thunder damage cracks obsidian (−2 AC per thunder hit, permanent).

#### Loot
- 6 A-Rank cores (1,000 Credits each)
- **Obsidian Gauntlets** (very rare Relic): +2 to melee damage, unarmed strikes deal 2d6+Str bludgeoning. Worth 6,000 Credits.
- **Regent Relic of the Abyss** (if placed here): Offered by The Watcher's bargain.
- **Canon X-Ref (Ch. 27)**: guaranteed drops — *Sigil of the Void-Walker* + *Sigil of the Shadow Regent* (sigils.ts, sigil-shadow-1 + sigil-shadow-king, legendary). The Shadow Regent sigil is the Spire's crown jewel; if already claimed at the Awoko Sanctum, substitute *Sigil of the Undying Flame*.
- **Alt-artifact**: **Skywyrm's Gauntlet** (relics-comprehensive.ts, skywyrms-gauntlet) instead of Obsidian Gauntlets for S-tier endgame builds.

> **Deity flavor**: Xylo, *The Archivist of Eternity*. The Spire is Xylo's refused library — every floor a chapter nobody was allowed to read. The Watcher at Floor 9 speaks Xylo's oldest dialect.
- **Regent Relic of Blood** (if placed here): Guarded by construct sentries on Floor 17.`,
	},
	{
		title: "Chapter 16: Gate — The Regent's Domain (S-Rank)",
		content: `# Gate: The Regent's Domain (S-Rank)

## Gate Information
- **Rank**: S
- **Location**: The massive Gate at the center of the district, hovering 50 ft. in the air
- **Portal Appearance**: A 30-meter disc of roiling violet-black energy. Visible from anywhere in the district. Distorts reality within 100 ft. — gravity weakens, shadows move independently, electronic devices malfunction.
- **Blue Phase Timer**: 14 days from campaign start (double the normal window — this Gate is unique)
- **Recommended Level**: 10
- **Prerequisite**: The party should have cleared at least 3 other Gates and collected Regent Relics.

## Entering the Gate

Access is 50 ft. up. Requires flight, climbing adjacent buildings, or the Bureau's emergency scaffolding (assembled at Bureau Allied reputation).

> **Read Aloud**: *"You rise to the Gate's edge and reality groans. The portal's surface isn't light — it's absence. Looking into it feels like staring into the space between thoughts. The air tastes of iron and ozone. Every mana sense you possess screams a single word: DANGER. Commander Park's voice crackles over the mana relay: 'Once you go in, we can't help you. Kill the Regent or don't come back.' You step through."*

> *"Darkness. Then — a throne room the size of a city. Pillars of crystallized shadow stretch upward into a sky of churning violet storms. The floor is black glass, and beneath it, you see an army — thousands of Anomalies frozen mid-stride, waiting to be unleashed. And at the far end, on a throne of compressed darkness, something opens its eyes."*

## The Domain

The Regent's Domain is a single massive arena — a throne room 500 ft. across with no cover, no side rooms, no puzzles. This is the final confrontation.

### Pre-Battle Setup
- **Allies Present**: Any recruited NPCs fight alongside the party (max 3 NPC allies).
  - Old Man Crane (if recruited): Provides +2 to all party attack rolls (tactical aura)
  - The Millwright (if device complete): Activates a mana dampening field (Regent loses 1 ability)
  - Ghost (if recruited + memory restored): Reveals the Regent's weakness — its shadow is separate, and killing the shadow first removes Phase 2.

### The Regent's Three Phases

#### Phase 1: The Shadow Monarch (100% – 60% HP)
- **HP**: 300 (adjusted by Relic count — see Chapter 2) | **AC**: 20 | **Speed**: 40 ft., fly 60 ft.
- **Abilities**:
  - *Multiattack*: 3 shadow blade attacks (+12 to hit, 2d12+6 necrotic)
  - *Shadow Army*: Summons 1d4+2 Shadow Soldiers each round (HP 20, AC 12, +5 to hit, 1d8+3 necrotic). Max 10 active at once.
  - *Void Gaze* (Recharge 5-6): 60 ft. cone, DC 18 Sense save. Fail: frightened + 4d8 psychic. Success: half damage, no fear.
  - *Mana Drain*: On hit, target's next ability/spell costs double mana/uses.
  - *Regeneration*: See Relic table in Chapter 2.

#### Phase 2: The Unbound (60% – 20% HP)
The Regent sheds its physical form and becomes a storm of shadow energy.
- **AC drops to 16**, but gains **resistance to all damage** except force and radiant.
- *Shadow Storm* (Replaces Shadow Army): 60 ft. radius, all creatures take 3d8 necrotic at start of Regent's turn. DC 17 Vitality save for half.
- *Shadow Step*: Teleports 60 ft. as a bonus action.
- *Consume Shadow*: Kills all remaining Shadow Soldiers. Heals 10 HP per soldier consumed.
- **Relic Interaction**: Each Relic held by the party suppresses one Phase 2 ability:
  - Void Relic → negates Shadow Storm
  - Abyss Relic → negates Shadow Step
  - Blood Relic → negates Consume Shadow

#### Phase 3: Desperation (20% – 0 HP)
The Regent returns to physical form, weakened but desperate.
- **AC 14** | Speed 60 ft. | Attacks become reckless (+4 to hit, +2d6 damage, but attacks against it have advantage)
- *Gate Shatter* (1/use): Attempts to break the Gate from inside, triggering the frozen army below the floor. If successful, a Gate Break occurs and the campaign shifts to a defense scenario. The party has 3 rounds to deal enough damage to interrupt Gate Shatter (50 HP to the floor beneath the Regent).
- *Final Shadow*: On defeat, the Regent curses whoever dealt the killing blow (see Endings).

## Three Endings

### Ending 1: The Regent is Destroyed (All 3 Relics)
The Regent dissolves. The Relics shatter. All Gates in the district close simultaneously. The Restricted Zone is lifted. The party is celebrated as national heroes. Bureau and Guild factions both claim credit.

### Ending 2: The Regent is Sealed (1-2 Relics)
The Regent is pushed back through the Gate but not destroyed. The S-Rank Gate closes but may reopen someday. The frozen army remains somewhere between dimensions. An uneasy victory.

> *"Commander Park stares at the fading Gate. 'It's not dead,' he says. 'We all know it's not dead. But today, we didn't die either. I'll take it.'"*

### Ending 3: The Regent Manifests (0 Relics or Gate Shatter succeeds)
The Gate Breaks. The frozen army of Anomalies floods the city. The party must fight a desperate retreat through the district as S-Rank Anomalies pour through the streets. The campaign ends with the city being evacuated and the district becoming a permanent Anomaly zone — the next generation's problem to solve.

> *"The sky splits open. The Regent rises above the skyline, a silhouette of darkness against a bleeding sky, and for the first time in twelve years, the entire world hears a Gate Break alarm."*`,
	},
];
