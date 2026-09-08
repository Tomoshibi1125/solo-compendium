import type { BookSection } from "./build-books";
import { runSilentArtCoverageSummary, runSilentFigure } from "./run_silent_art_manifest";

// Generated from the approved 152-page Run Silent reformatted manuscript, with the removed
// material-world prelude excised and campaign utility tables normalized for Vivliostyle.
// Regenerate from C:\tmp\run_silent_pages.json and C:\tmp\run_silent_tables.json after source-PDF updates.

const FRONT_MATTER_BODY = `
<div class="campaign-prose">
<p>What Is Run Silent? Run Silent is the flagship introductory campaign for Rift Ascendant. It is built for Levels 1-10 and is designed to teach the Rift Age through play: the Bureau, AFA, Jobs, Paths, Ranks, Rift Sites, Rift Thresholds, Rift Interiors, Domain pressure, Essence, Relics, Runes, hazards, field operations, and the consequences of coming home. This campaign begins in the material world with a newly manifested Rift under Bureau control. The opening is not horror. It is professional, regulated, procedural, and grounded in the modern Rift Age. The party enters as legally cleared low-rank Ascendants assigned to a first-entry survey. The Threshold reads stable enough for transport. It is breathable, vehicle-capable, and suitable for a light survey asset, mount package, drone platform, or hybrid loadout. The Bureau is correct about the entry conditions. The Bureau is wrong about the deeper scale. Beyond the Threshold waits the Gloamreach: an inhabited, country-scale Rift Interior whose laws cannot be understood from the outside. The horror begins after crossing. Roads behave like agreements. Safe places feel leased, not owned. The AFA measures, records, and warns, but it is not truth. The party&#x27;s Bureau-issued asset becomes useful, vulnerable, and eventually personal. Something unseen hunts sound, Essence, panic, certainty, and anything that refuses to run silent.</p>
<h3>Campaign Mandate</h3>
<p>This book is not a conversion of a fantasy campaign structure. It is a purpose-built Rift Ascendant campaign book. It is a full-scale Rift Ascendant campaign book. Its depth target is the same category as a major hardcover campaign: a complete opening operation, Warden guidance, regional gazetteer, campaign systems, factions, keyed locations, recruitable allies, side quests, rewards, random encounters, handouts, secrets, escalation tracks, final act, and multiple endings. Use other campaign books only as quality benchmarks for scale, density, organization, usability, and table support. The creative and mechanical authority is Rift Ascendant: the Rift Age Worldbook, Warden Guide, Ascendant Guide, Awakened Arts, Vaults of the Rift, and Anomaly Manual.</p>
<h3>Warden-Only Truths</h3>
<p>The material-side Rift is new. The Gloamreach beyond it is not. The party is not knowingly sent into an S-Rank Domain. They are authorized for a provisional E/D or low-D first-entry survey into a newly manifested Threshold whose outer readings are stable, breathable, vehicle- capable, and low-hostility. The Bureau sees the door and the first safe approach. It does not see the country beyond it. The Gloamreach contains native inhabitants. They are not Earth civilians and they are not automatically Anomalies. The doorway is new; their world is not.</p>
<p>The Quiet is not a normal early campaign monster. It is a hunting pressure, an environmental law, an apex intelligence, and eventually a possible final confrontation. Early contact should be indirect, sensory, procedural, and consequential. The AFA does not become useless. It becomes conditional. It remains valuable when interpreted by cautious operators, dangerous when obeyed blindly, and terrifying when it shows something true at the wrong time.</p>
<h3>Warden Principle</h3>
<p>The Bureau makes a plausible mistake, not a stupid one. It reads the entry lane correctly and fails to perceive the deeper country-scale Interior.</p>
<h3>How This Campaign Teaches Rift Ascendant</h3>
<p>Levels 1-2 teach procedure: Bureau cordon, AFA sync, role packages, transport requisition, first-entry survey, relay placement, and the first contradiction. Levels 2-4 teach survival: sound discipline, Essence restraint, AFA degradation, roads, local laws, native contact, the Worn Dead, and the first real Hunt pressure. Levels 4-6 teach the living Domain: factions, safeholds, merchants, salvage, vehicle and mount care, Runes, hazards, Relics, and the fact that a Rift Clear may not be morally clean. Levels 6-8 teach the Means: the difference between escape, sealing, rescue, killing, bargaining, and exposing the truth. Levels 8-10 resolve the campaign: the final crossing, the Quiet&#x27;s full escalation, the Rift Break risk, and the consequences carried back to the material world.</p>
</div>
`;

const FIRST_ENTRY_BODY = `
<div class="campaign-prose">
<h2>Chapter 0: First Entry</h2>
<h2>Chapter Purpose</h2>
<p>First Entry establishes the material-world briefing, Bureau cordon, AFA sync, requisition, and Threshold procedure. The goal is to teach the table what Rift Ascendant looks like before the horror begins. The players should feel like licensed Ascendants participating in a real modern field operation, not fantasy adventurers walking into a dungeon.</p>
<h3>Required Starter Arc</h3>
<p>First Entry is the campaign's fixed opening route. Every Run Silent table begins here: material-world Bureau procedure, the controlled Threshold crossing, the falsely safe Survey Layer, the Black Road / First Road, the relay spike, the first AFA contradiction, the first local rule, and the first shelter decision. Do not begin the campaign elsewhere in the Gloamreach. The wider sandbox opens only after this starter arc teaches the players what the Gloamreach is and how it punishes ordinary confidence.</p>
<figure class="campaign-table-wrap">
<figcaption>Known First Route</figcaption>
<table class="campaign-table"><thead><tr><th>Beat</th><th>Location</th><th>What It Teaches</th><th>Exit Signal</th></tr></thead><tbody>
<tr><td>1</td><td>Bureau Threshold Cordon</td><td>Material-world procedure, public pressure, licenses, and Bureau authority.</td><td>The team is cleared to approach the Threshold.</td></tr>
<tr><td>2</td><td>AFA Relay Truck and Motor Pool</td><td>AFA sync, role packages, requisition, vehicle/mount selection, and mission limits.</td><td>The team locks its loadout and receives the map seed.</td></tr>
<tr><td>3</td><td>Threshold Apron</td><td>The Rift is stable, breathable, and vehicle-capable at the entry layer.</td><td>The party crosses under Bureau observation.</td></tr>
<tr><td>4</td><td>Survey Layer</td><td>Professional habits work at first; the Bureau's first reading is not foolish.</td><td>The relay spike reports green.</td></tr>
<tr><td>5</td><td>Black Road / First Road</td><td>The map does not end, distance lies, and transport becomes a choice.</td><td>The AFA shows the return marker at an impossible distance.</td></tr>
<tr><td>6</td><td>Relay Spike Perimeter</td><td>The first contradiction: clean data can still be wrong.</td><td>The first native sign or warning appears.</td></tr>
<tr><td>7</td><td>First Local Rule</td><td>Silence, light, names, Essence, and roads have consequences.</td><td>The Hunt Clock advances or is narrowly avoided.</td></tr>
<tr><td>8</td><td>First Safehold or Forced Shelter</td><td>Safety is conditional and belongs to the Gloamreach's native rules.</td><td>The party earns shelter, loses shelter, or must choose a sandbox lead.</td></tr>
</tbody></table>
</figure>
<h3>What First Entry Must Teach</h3>
<p>By the end of the starter arc, the players should understand six table truths: Bureau procedure is real; the AFA is valuable but conditional; transport is powerful and vulnerable; silence, light, and Essence carry consequences; native laws matter more than outsider confidence; and the Gloamreach is a country-scale inhabited Interior, not a bounded job site.</p>
<h3>Material-World Tone</h3>
<p>The opening is controlled, professional, tense, and public. It should feel like a crime scene, a military checkpoint, a film set, and a corporate trade show all sharing the same perimeter.</p>
<h3>Read-Aloud: Arrival at the Cordon</h3>
<p>The road is closed three blocks before the lights. Bureau floodlamps cut white lanes through rain-slick asphalt. Police barricades hold back civilians with phones raised over their heads. A media drone hangs behind the exclusion line, its feed jammed into a smear of colored static. Beyond the barricade, Bureau response trucks idle beside medical tents and Essence containment pylons. A portable AFA relay mast blinks steady green. No one looks panicked. That is what makes it real. The world has done this before.</p>
<h3>Keyed Site: Bureau Threshold Cordon</h3>
<p>Outer Police Line. Local law enforcement manages civilians, traffic, and media. This is where players see how normal people experience the Rift Age.</p>
<p>Bureau Checkpoint. Licenses are scanned, AFA profiles are verified, and personal gear is logged.</p>
<p>Unregistered gear is not confiscated automatically, but it is recorded.</p>
<p>Medical Baseline Tent. Each Ascendant receives a quick biometric scan, Essence exposure baseline, emergency blood type confirmation, and recovery tag.</p>
<p>AFA Relay Truck. The team receives the mission packet, map seed, extraction marker, team channel, injury alerts, and contract terms.</p>
<p>Bureau Motor Pool. Vehicles, drones, mounts, carts, and mission modifications are staged here. This is where the party spends Vehicle Requisition Points.</p>
<p>Mount Corral. Bureau-cleared animals are checked for panic response, Essence sensitivity, gate-calm training, and load capacity.</p>
<p>Evidence and Sample Control. Sample vials, containment sleeves, evidence bags, and chain-of-custody cases are issued.</p>
<p>Guild Observer Lane. Guild representatives, sponsors, corporate watchers, or rival contractors may be present, but the site is Bureau-controlled.</p>
<p>Threshold Apron. The Rift itself is visible from here. It is wide, stable, and unnervingly calm.</p>
<h3>Bureau Reading</h3>
<p>Event: Newly manifested Rift Threshold. Provisional Rank: E/D or low D, under review. Aperture: Vehicle- capable. Atmosphere: Breathable. Ground Return: Stable enough for light transport. Interior Estimate: Bounded survey layer. Threat Model: No confirmed high-rank Anomaly signatures. Mission Type: First-entry survey, relay placement, sample recovery, and return. Approved Transport: Up to an 8-seat mission asset or equivalent mount/hybrid package. Primary Objective: Enter, map, place relay, collect samples, return within the operating window. Warden Truth: The entry lane is real. It is only the skin of the Gloamreach.</p>
<h3>Briefing Script</h3>
<p>&quot;You are not clearing this Rift. You are not pushing past the first survey boundary. You are entering, confirming the interior geometry, placing the relay spike, collecting low-risk samples, and returning. If the AFA marks a pressure spike, you withdraw. If the terrain fails to match the scan, you withdraw. If you encounter native population indicators, you document and withdraw. If you encounter a high-rank hostile, you do not engage. You withdraw.&quot;</p>
<h3>Field Procedure</h3>
<p>The party should have time to ask questions. The Bureau answer should usually be honest but limited. If asked whether the Rift is safe, the answer is: &quot;No Rift is safe. This one is within authorization limits.&quot; If asked whether extraction is guaranteed, the answer is: &quot;The return marker is stable at time of briefing.&quot; If asked whether vehicles are approved, the answer is: &quot;Yes. The aperture and ground return support light survey transport.&quot;</p>
<h3>First Entry Objectives</h3>
<p>Deploy the relay spike. Map the first interior layer. Confirm whether the interior is bounded. Collect three low-risk samples. Tag any Anomaly sign. Return before the operating window closes.</p>
<h3>Warden Boundary</h3>
<p>Until the party completes First Entry, the campaign is not open-world. If players try to leave the route early, redirect through concrete field pressure: the Bureau has not cleared another lane, the AFA has no valid map seed off-road, the vehicle or mounts require the stable approach, and the first native warning points them back toward the Black Road / First Road. This is not a railroad into a plot room; it is the Gloamreach teaching the table its grammar before the region opens.</p>
<h3>Milestone</h3>
<p>Do not level the party for crossing the Threshold. Level 2 should come after the party survives the first confirmed Gloamreach pressure event and understands the mission has changed.</p>
<h2>Chapter 1: The Survey Layer</h2>
<h2>Chapter Purpose</h2>
<p>The Survey Layer lets the players use their chosen transport, role packages, AFA tools, and professional habits before the campaign removes certainty. At first, the team should feel competent.</p>
<h3>Opening Beat</h3>
<p>The first hundred yards beyond the Threshold match the scan. The air is breathable. The ground supports the vehicle or mounts. The AFA receives telemetry. The relay spike deploys correctly. Nothing attacks. Then the map keeps expanding.</p>
<h3>Read-Aloud: The First Safe Road</h3>
<p>The Threshold closes behind you only in the sense that a door closes behind someone entering a building. Its marker remains on every AFA display. The route ahead is a packed black road bordered by grass that bends without wind. The relay spike cycles once, twice, then shows green. Your AFA draws a clean line forward. Fifty yards. One hundred. Two hundred. The road does not curve. The line on the map should meet a boundary. It does not.</p>
<h3>Survey Events</h3>
<p>Relay Spike Green. The relay confirms connection, but the range estimate begins stretching by small impossible increments.</p>
<p>Sample One: Black Road Dust. The dust is inert in the vial, but the AFA logs it as both mineral and organic.</p>
<p>Sample Two: Grass Without Wind. A basic sample reacts to Essence exposure by turning toward the team&#x27;s loudest speaker.</p>
<p>First Map Error. The AFA shows the extraction marker at a correct direction but an impossible distance.</p>
<p>First Transport Choice. The team must decide whether to continue using the vehicle or mounts, slow down, scout ahead, hide the asset, or proceed on foot.</p>
<h3>First Contradiction Table</h3>
<p>AFA reports no movement while every mount looks left.</p>
<p>Vehicle dashboard shows level road while the road visibly slopes upward.</p>
<p>Drone footage returns a frame from several minutes in the future.</p>
<p>A sample tag records a name no one entered.</p>
<p>The return marker shifts by one degree, then corrects itself.</p>
<p>A quiet tapping comes from inside the relay mast.</p>
<h3>First Safehold Or Forced Shelter</h3>
<p>The starter arc ends only after the party reaches a threshold of local law: a wardline, a locked barn, a silent roadside shrine, a shuttered hamlet, a teahouse that was not on the scan, or a hollow under black roots where someone has marked the rules in chalk. If the party honored quiet, let this be a tense invitation. If they lived loudly, make it a forced shelter scene with something listening outside. Either way, this is where the party learns that safety is not terrain. It is behavior.</p>
<h3>Exit Condition</h3>
<p>The chapter ends when the team reaches the first point where normal procedure is no longer enough: the road branches into terrain not present on the scan, the relay range collapses, the first sign of native passage appears, and the party has either earned shelter, been denied shelter, or accepted that returning by routine procedure is no longer available.</p>
<figure class="campaign-table-wrap">
<figcaption>First Entry Procedure</figcaption>
<table class="campaign-table"><thead><tr><th>Step</th><th>Table Use</th><th>Rift Ascendant Alignment</th></tr></thead><tbody>
<tr><td>1. Cordon arrival</td><td>Establish Bureau perimeter, civilian pressure, media drones, and contractor lanes.</td><td>The campaign opens in the material world before the horror begins.</td></tr>
<tr><td>2. License and AFA sync</td><td>Scan identities, confirm Rank, assign operator channels, and baseline Essence signatures.</td><td>The AFA is useful but never omniscient.</td></tr>
<tr><td>3. Role package selection</td><td>Each character takes a field role or donates it for extra team VRP.</td><td>Every build has a job in the operation before combat starts.</td></tr>
<tr><td>4. Requisition</td><td>Choose vehicle, mount, drone, or hybrid loadout; apply legal mods.</td><td>The Bureau makes plausible decisions with incomplete data.</td></tr>
<tr><td>5. Threshold crossing</td><td>Confirm breathable air, road width, relay status, and return timing.</td><td>The entry layer is accurately assessed; the deeper Domain is not.</td></tr>
<tr><td>6. First contradiction</td><td>Show the map continuing beyond the survey boundary.</td><td>The Gloamreach is country-scale and inhabited.</td></tr>
<tr><td>7. First local rule</td><td>Make silence, light, Essence, a name, or a road choice matter immediately.</td><td>The Domain has enforceable laws the Bureau packet did not contain.</td></tr>
<tr><td>8. First shelter</td><td>Offer a safehold, wardline, or forced shelter scene before the sandbox opens.</td><td>The players learn that survival depends on local behavior.</td></tr>
</tbody></table>
</figure>
<h3>Starter Map and Handout Packet</h3>
<p>Place these six starter assets before the gazetteer in both table prep and the rendered book. They are the authoritative First Entry play packet until final generated maps and handouts replace the production briefs. Do not move them into optional sandbox material; they teach the table how the campaign starts.</p>
<figure class="campaign-table-wrap">
<figcaption>Bureau Threshold Cordon Map</figcaption>
<table class="campaign-table"><thead><tr><th>Zone</th><th>Readable Features</th><th>Play Use</th></tr></thead><tbody>
<tr><td>Outer Police Line</td><td>Barricades, civilians, media drones, municipal responders, sponsor vehicles.</td><td>Show the material world reacting to Rifts as a managed public crisis.</td></tr>
<tr><td>Bureau Checkpoint</td><td>License scanner, AFA kiosk, tagged gear bins, contractor lane.</td><td>Run license scan, AFA sync, and legal friction before entry.</td></tr>
<tr><td>Medical Baseline Tent</td><td>Biometric chair, exposure tags, trauma kits, recovery contracts.</td><td>Record Essence baselines and foreshadow that coming home has consequences.</td></tr>
<tr><td>Motor Pool and Mount Corral</td><td>Survey rover, UTV pair, mule tack, drone crates, mod benches.</td><td>Spend VRP, choose transport, and establish that transport is useful but exposed.</td></tr>
<tr><td>Threshold Apron</td><td>Floodlit concrete, warning paint, relay mast, stable aperture.</td><td>Stage the final briefing and crossing under Bureau observation.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Threshold Crossing Map</figcaption>
<table class="campaign-table"><thead><tr><th>Area</th><th>What Players See</th><th>Warden Trigger</th></tr></thead><tbody>
<tr><td>Material-Side Apron</td><td>White light, wet asphalt, marked lanes, command staff watching.</td><td>Last chance to change requisition, assign roles, or ask the Bureau hard questions.</td></tr>
<tr><td>Gate Line</td><td>Air pressure changes without wind; AFA signal stays green.</td><td>Confirm the Bureau is correct about the entry layer.</td></tr>
<tr><td>Interior Apron</td><td>The road is wide enough for the asset; the air is breathable.</td><td>Let the party trust procedure for a few minutes.</td></tr>
<tr><td>Return Marker</td><td>AFA arrow points cleanly back to the material world.</td><td>Keep this visible so the later contradiction has teeth.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Survey Layer and First Road Map</figcaption>
<table class="campaign-table"><thead><tr><th>Node</th><th>Feature</th><th>Unlock or Pressure</th></tr></thead><tbody>
<tr><td>Relay Spike Site</td><td>Flat ground, safe telemetry, clean line of sight to the Threshold marker.</td><td>Deploy the relay and record the first false green result.</td></tr>
<tr><td>Black Road Straightaway</td><td>Grass bends toward the loudest speaker; road dust records as mineral and organic.</td><td>Teach silence and sample weirdness without starting combat.</td></tr>
<tr><td>First Impossible Fork</td><td>The road branches where the map says it cannot.</td><td>Force a transport choice: continue, scout, hide the asset, or turn back.</td></tr>
<tr><td>Boundary That Is Not There</td><td>AFA boundary line keeps moving ahead of the team.</td><td>Reveal that the Gloamreach is country-scale and not a bounded survey site.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Relay Spike Handout</figcaption>
<table class="campaign-table"><thead><tr><th>Field</th><th>Player-Facing Entry</th><th>Warden Truth</th></tr></thead><tbody>
<tr><td>Device Status</td><td>Relay spike armed. Material-side handshake confirmed.</td><td>The handshake is with the entry lane, not the full Gloamreach.</td></tr>
<tr><td>Signal Strength</td><td>Green, then green with a growing range variance.</td><td>The Domain is stretching measurement before it breaks it.</td></tr>
<tr><td>Map Boundary</td><td>Survey boundary pending auto-confirmation.</td><td>There is no bounded survey boundary to confirm.</td></tr>
<tr><td>Operator Note</td><td>Proceed to sample recovery and return within operating window.</td><td>This instruction will become impossible without anyone lying.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Corrupted AFA First Contradiction Handout</figcaption>
<table class="campaign-table"><thead><tr><th>Display Line</th><th>Readout</th><th>Meaning at the Table</th></tr></thead><tbody>
<tr><td>Return Marker</td><td>Direction stable. Distance: recalculating.</td><td>The way back still exists, but ordinary range has stopped being honest.</td></tr>
<tr><td>Life Signs</td><td>Team count correct. Additional signatures: none / many / none.</td><td>The AFA is measuring conditions that change when observed.</td></tr>
<tr><td>Terrain Model</td><td>Road grade level. Vehicle telemetry reports incline.</td><td>Trust instruments as clues, not orders.</td></tr>
<tr><td>System Advisory</td><td>Do not interpret local anomaly law as software error.</td><td>The AFA has seen enough to warn them, not enough to explain.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>First Safehold or Wardline Map</figcaption>
<table class="campaign-table"><thead><tr><th>Zone</th><th>Local Rule</th><th>Consequence</th></tr></thead><tbody>
<tr><td>Approach Road</td><td>No engines past the chalk stones unless invited.</td><td>Vehicle security becomes a social and tactical decision.</td></tr>
<tr><td>Wardline</td><td>Cross silently, with hands visible, and do not speak names.</td><td>Breaking the rule advances the Hunt Clock or closes the shelter.</td></tr>
<tr><td>Guest Threshold</td><td>Light must be covered before entering.</td><td>The party learns that safety is behavior, not architecture.</td></tr>
<tr><td>Inside Shelter</td><td>Food is offered only after the visitors give a useful truth.</td><td>Native law introduces faction play before the sandbox opens.</td></tr>
</tbody></table>
</figure>
</div>
`;

const FIELD_SYSTEMS_BODY = `
<div class="campaign-prose">
<h2>Chapter 1B: Requisition, Transport, and Field Engineering</h2>
<h3>Core Rule</h3>
<p>All listed transport and modification options are legally obtainable if the party meets the requirements. The campaign does not say, &quot;you cannot have this.&quot; It says, &quot;this is what it costs, this is what it requires, and this is what pressure it creates.&quot;</p>
<h3>Starting Vehicle Requisition Points</h3>
<p>The party begins with 3 Vehicle Requisition Points. Each player may give up their role package to add +1 additional Vehicle Requisition Point to the team pool. Formula: Total VRP = 3 + forfeited role packages. A player who gives up a role package keeps personal starting gear, the Bureau First-Entry Kit, AFA device, and normal character equipment. They lose only the extra specialist role package.</p>
<h3>Role Packages</h3>
<p>Breacher: pry tool, wedge kit, barrier tape, structural chalk, compact cutter, reinforced gloves. Surveyor: mapping pucks, sample flags, signal tape, spare data slates, analog notebook. Medic: trauma wraps, med patches, triage tags, antiseptic sealant, foldable casualty sheet. Containment: containment sleeves, insulated sample tubes, hazard chalk, filter mask, sealed evidence bags. Scout: low-light lamp, quiet markers, climbing line, compact optic, decoy beacon. Specialist: Job-specific tool roll, focus maintenance kit, interface cable, spare cells, unusual mission gear.</p>
<h3>Requirement Tags</h3>
<p>Standard Issue: included in the base mission package. VRP Cost: legal if the party spends the listed points. Material Requirement: requires parts, fuel, animal stock, salvage, Essence components, or specific equipment. Workshop Requirement: requires a Bureau motor pool, field bay, Technomancer rig, native workshop, or recovered worksite. Installation Time: requires preparation before entry, downtime, or a field project. Mission Fit: requires the Threshold, terrain, mission profile, or scan data to justify use. Clearance Requirement: requires Bureau signoff, Guild sponsorship, Rank paperwork, or command approval. Campaign Discovery: becomes available only after finding plans, parts, local methods, or Gloamreach salvage. Pressure: the complication the choice creates inside the Gloamreach.</p>
<h3>Starting Transport Catalogue</h3>
<p>Bureau Light Survey Rover. Seats 8. Base Cost 0 if selected as the primary team asset. Mod Capacity 3. Requirement: vehicle-capable Threshold, stable ground return. Strength: full-party transport, relay deployment, sample storage. Pressure: loud engine, wide frame, Bureau tracker, hard to hide. Bureau Compact Survey Rover. Seats 6. Base Cost 0. Mod Capacity 3. Requirement: vehicle-capable Threshold. Strength: balanced transport and cargo. Pressure: limited seats, still noisy. Twin Scout UTVs. Seats 8 total. Base Cost 1 VRP. Mod Capacity 2 each. Requirement: open or rough ground return. Strength: tactical flexibility and redundancy. Pressure: encourages dangerous splitting.</p>
<p>Bureau Utility Van. Seats 8. Base Cost 1 VRP. Mod Capacity 4. Requirement: roadlike or stable interior scan. Strength: gear-heavy support platform. Pressure: poor off-road performance. Bureau Medical Response Van. Seats 6. Base Cost 1 VRP. Mod Capacity 3. Requirement: rescue or casualty extraction justification. Strength: triage and stabilization. Pressure: reduced cargo and poor rough-terrain handling. Bureau Containment Van. Seats 6. Base Cost 1 VRP. Mod Capacity 3. Requirement: sample-heavy objective. Strength: secure storage. Pressure: audit-heavy and attractive to factions. Civilian 4x4, Bureau Refit. Seats 5. Base Cost 0. Mod Capacity 2. Requirement: common motor pool availability. Strength: cheap, grounded, replaceable. Pressure: less durable than true Bureau assets. Civilian SUV Pair, Bureau Refit. Seats 8 mission seats. Base Cost 1 VRP. Mod Capacity 1 each. Requirement: convoy authorization. Strength: redundancy. Pressure: weak mods and poor Rift hardening. Bureau-Issue Sedan Pair. Seats 8. Base Cost 0. Mod Capacity 1 each. Requirement: roadlike scan. Strength: ordinary Bureau pool vehicles. Pressure: terrible once terrain becomes hostile. Patrol Motorcycle Team. Seats up to 8. Base Cost 1 VRP. Mod Capacity 1 each. Requirement: open route scan. Strength: speed. Pressure: loud, exposed, little cargo. Bureau ManaCycle Team. Seats up to 8. Base Cost 2 VRP. Mod Capacity 1 each. Requirement: Essence-safe motor pool stock. Strength: fast Essence-assisted transit. Pressure: stronger Essence signature. Rover plus Outrider Bikes. Seats 8. Base Cost 2 VRP. Mod Capacity rover 3, bikes 1 each. Requirement: mixed scouting justification. Strength: balanced mobility. Pressure: complex to manage. Cargo Rover plus Passenger Sled. Seats 8. Base Cost 1 VRP. Mod Capacity rover 4, sled 1. Requirement: cargo or sample-heavy mission. Strength: supplies and salvage. Pressure: slow, noisy turns. Bureau Mule Drone. Seats 0. Base Cost 0. Mod Capacity 2. Requirement: AFA-linked drone stock. Strength: cargo and relay support. Pressure: AFA-dependent. Bureau Recon Drone Pair. Seats 0. Base Cost 1 VRP. Mod Capacity 1 each. Requirement: drone operator or Bureau approval. Strength: scouting. Pressure: signal failure and false confidence. Compact Bridge Cart. Seats 2. Base Cost 2 VRP. Mod Capacity 3. Requirement: broken-ground scan. Strength: gap crossing. Pressure: slow and mechanically noisy. Bureau Rescue Cart. Seats 2 plus casualty positions. Base Cost 1 VRP. Mod Capacity 3. Requirement: casualty extraction objective. Strength: wounded transport. Pressure: limited combat utility. All-Terrain Cargo Crawler. Seats 4. Base Cost 2 VRP. Mod Capacity 4. Requirement: rough terrain scan. Strength: durable cargo hauling. Pressure: very slow and loud. Inflatable Survey Raft. Seats 6 to 8. Base Cost 0. Mod Capacity 2. Requirement: water signature. Strength: packable water crossing. Pressure: useless on dry terrain unless carried.</p>
<p>Compact Survey Skiff. Seats 6. Base Cost 1 VRP. Mod Capacity 3. Requirement: flooded or marshlike scan. Strength: water mobility. Pressure: limited terrain. Rail-Sled Survey Kit. Seats 4. Base Cost 1 VRP. Mod Capacity 2. Requirement: tunnel or industrial scan. Strength: controlled tunnel movement. Pressure: setup time and limited route flexibility.</p>
<h3>Starting Mount Catalogue</h3>
<p>Quartermaster Mule Team. Capacity 4-8 riders/cargo mix. Base Cost 0. Tack Capacity 2 each. Strength: reliable logistics. Pressure: slow. Bureau Warhorse Team. Capacity up to 8 riders. Base Cost 1 VRP. Tack Capacity 2 each. Strength: open- terrain speed. Pressure: noise and panic risk. Dust-Rift Camel Team. Capacity up to 8 riders. Base Cost 1 VRP. Tack Capacity 2 each. Strength: endurance, heat, long travel. Pressure: poor tight-space mobility. Pack Survey Beast Team. Capacity up to 8 riders/cargo mix. Base Cost 0. Tack Capacity 2 each. Strength: rough-ground reliability. Pressure: limited combat nerve. Mountain Patrol Goat Team. Capacity up to 8 light riders. Base Cost 1 VRP. Tack Capacity 1 each. Strength: cliffs and broken stone. Pressure: low carrying capacity. Rescue Litter Mount Pair. Capacity two casualty positions. Base Cost 1 VRP. Tack Capacity 2 each. Strength: medical extraction. Pressure: slow and vulnerable. Bureau K-9 Cargo Harness Team. Capacity cargo and tracking only. Base Cost 1 VRP. Tack Capacity 1 each. Strength: scent, retrieval, warning. Pressure: vulnerable to fear and Quiet pressure. Mana-Touched Wolf Scout Pair. Capacity support or rider depending size. Base Cost 2 VRP. Tack Capacity 1 each. Strength: mana resonance detection. Pressure: intimidating and harder to control. Bureau Pack Ox Pair. Capacity heavy cargo. Base Cost 1 VRP. Tack Capacity 3 each. Strength: hauling. Pressure: slow and hard to hide. Mule Cart Expedition. Capacity 4 riders plus cart positions. Base Cost 0. Tack/Cart Capacity 2. Strength: quiet, low-tech transport. Pressure: slow, exposed. Hybrid Rover plus Pack Mules. Capacity 6 seats plus cargo. Base Cost 1 VRP. Strength: vehicle carries people, mules carry supplies. Pressure: managing two transport systems. Hybrid UTV plus Warhorse Outriders. Capacity 4 seats plus 4 riders. Base Cost 2 VRP. Strength: mixed scouting and response. Pressure: high coordination burden.</p>
<h3>Modification Cost Scale</h3>
<p>1 VRP: minor utility, simple tack, simple field upgrade. 2 VRP: strong specialist upgrade. 3 VRP: major system upgrade. 4+ VRP: complex, experimental, multi-system upgrade with special requirements.</p>
<h3>Vehicle Modifications</h3>
<p>Mobility: all-terrain tires, basic tread kit, rock-crawler suspension, mud skirts, crawl gearbox, run-flat tires, emergency traction boards, compact bridge rails, tow sled rig, reinforced undercarriage. Stealth and Noise: quiet-run baffling, low-noise brakes, headlight shutters, vibration dampeners, engine pulse governor, thermal diffuser, dust wake baffles, manual coast mode. AFA and Sensors: relay mast, blackbox recorder, analog map board, terrain sonar, Essence leak scanner, drone cradle, multi-AFA sync hub, false-ping filter, emergency beacon isolation switch. Survival and Hazards: cabin seal, air scrubbers, hazard foam, fire suppression, crash webbing, temperature kit, radiation lining, sample lockbox, containment crate. Utility and Repair: front winch, rear tow rig, spare parts locker, fold-out workbench, field repair arm, cargo expansion, salvage crate, water condenser, fuel reserve bladder.</p>
<h3>Mount Modifications</h3>
<p>Tack: pack saddle, survey saddle, medical litter, light barding, cargo panniers, respirator muzzle, cold blanket, eye guards, AFA collar, Essence-safe feed bag, low-noise hoof wrap, emergency release rig. Training: gate-calm, crowd-safe, wound-steady, fire-calm, burden-broken, roadwise, dark-adapted, blood- scented, panic-resistant, recall-trained.</p>
<h3>No Vehicle Sigils</h3>
<p>Sigils do not go on vehicles or mounts in this campaign. Sigils remain for weapons, armor, boots, and other appropriate personal gear. Tattoos remain on living Ascendants. Vehicle and mount upgrades are mechanical, electronic, AFA-linked, Essence-shielded, field-engineered, tack-based, or training-based.</p>
<h3>Field Engineering</h3>
<p>Inside the Gloamreach, the Bureau motor pool is gone. There are no prebuilt Gloamreach vehicles. The party can adapt what they brought through carried parts, Bureau wreckage, Anomaly material, native material, Technomancer work, field mechanics, native workshops, Relic fragments, and project clocks.</p>
<h3>Vehicle Condition Track</h3>
<p>Operational: works normally. Strained: one subsystem is unreliable. Damaged: one subsystem is disabled. Crippled: movement is limited and checks are required. Dead: cannot move until major repair.</p>
<h3>Mount Condition Track</h3>
<p>Calm: follows commands normally. Uneasy: warns, hesitates, needs handling. Panicked: may bolt, refuse, or endanger cargo. Injured: speed reduced, needs care. Broken: cannot safely continue without rest or treatment.</p>
<h3>Transport and Hunt Pressure</h3>
<p>Driving fast, using headlights, overusing AFA relay pings, repairing loudly, forcing frightened mounts, carrying unstable salvage, or pushing through a road that refuses the party can advance the Hunt Clock, trigger hazards, or expose the party to local factions. Transport is not a bypass. It is a second layer of tactical play.</p>
<aside class="campaign-note"><h3>System Preservation</h3><p>These campaign systems are intentionally robust enough to graduate into the Rift Ascendant core rules later. Use the source prose below when it is more detailed; use these tables for table-speed reference.</p></aside>
<figure class="campaign-table-wrap">
<figcaption>Starting Vehicle Requisition Points</figcaption>
<table class="campaign-table"><thead><tr><th>Party Choice</th><th>VRP</th><th>Cost</th><th>Best Use</th></tr></thead><tbody>
<tr><td>Default allotment</td><td>3</td><td>None</td><td>One full-party vehicle with a few practical modifications.</td></tr>
<tr><td>Role package trade-in</td><td>+1 each</td><td>A character gives up their starting role package.</td><td>Teams that want heavier transport, drones, or hybrid vehicle/mount support.</td></tr>
<tr><td>Bureau justification bonus</td><td>+1</td><td>The party writes a clear mission-risk justification and accepts audit attention.</td><td>Tables that enjoy logistics, paperwork pressure, and later Bureau consequences.</td></tr>
<tr><td>Vermillion private supplement</td><td>+1 to +2</td><td>Take a favor debt, salvage claim, or rescue obligation.</td><td>Parties willing to owe someone before they know what the debt means.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Field Role Packages</figcaption>
<table class="campaign-table"><thead><tr><th>Package</th><th>Included Support</th><th>Campaign Pressure</th></tr></thead><tbody>
<tr><td>Field Lead</td><td>Command slate, map packet, consent authority for emergency withdrawal.</td><td>The Bureau will ask why the lead chose each risk.</td></tr>
<tr><td>AFA/Signals</td><td>Relay spike, signal tags, drone beacon, corrupted-data kit.</td><td>The Gloamreach can imitate clean readings.</td></tr>
<tr><td>Driver/Pilot</td><td>Vehicle tools, route placards, emergency tow straps.</td><td>Engines are useful, loud, and memorable.</td></tr>
<tr><td>Scout</td><td>Rangefinder, path tape, low-light lens, silent flare.</td><td>Going ahead means being the first thing the dark learns.</td></tr>
<tr><td>Medic</td><td>Triage kit, stabilizer doses, quarantine seals.</td><td>Care creates obligations the mission packet did not price.</td></tr>
<tr><td>Engineer</td><td>Patch plates, jury-rig harness, compact welder, battery cores.</td><td>Every repair trades time, noise, parts, or Essence.</td></tr>
<tr><td>Quartermaster</td><td>Ration crate, salvage tags, spare filters, trade chits.</td><td>Supplies become social currency inside native communities.</td></tr>
<tr><td>Ward-Keeper</td><td>Marking chalk, threshold cord, charm tags, ward-inspection lens.</td><td>Native rules matter more than Bureau confidence.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Starting Vehicle Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Asset</th><th>Capacity</th><th>Cost</th><th>Mods</th><th>Strength</th><th>Pressure</th></tr></thead><tbody>
<tr><td>Bureau Light Survey Rover</td><td>8 seats</td><td>0 VRP</td><td>3 mods</td><td>Full-party survey platform</td><td>Loud, wide, hard to hide</td></tr>
<tr><td>Bureau Compact Survey Rover</td><td>6 seats</td><td>0 VRP</td><td>3 mods</td><td>Balanced survey/cargo</td><td>Limited seats</td></tr>
<tr><td>Twin Scout UTVs</td><td>8 seats total</td><td>1 VRP</td><td>2 each</td><td>Redundancy and split scouting</td><td>Split-party temptation</td></tr>
<tr><td>Bureau Utility Van</td><td>8 seats</td><td>1 VRP</td><td>4 mods</td><td>Gear-heavy support</td><td>Poor off-road</td></tr>
<tr><td>Medical Response Van</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Triage and casualty support</td><td>Reduced cargo</td></tr>
<tr><td>Containment Van</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Samples and cores</td><td>Audit-heavy</td></tr>
<tr><td>Civilian 4x4 Refit</td><td>5 seats</td><td>0 VRP</td><td>2 mods</td><td>Grounded, replaceable</td><td>Less durable</td></tr>
<tr><td>Sedan Pair</td><td>8 seats</td><td>0 VRP</td><td>1 each</td><td>Roadlike scans</td><td>Bad terrain</td></tr>
<tr><td>Patrol Motorcycle Team</td><td>up to 8</td><td>1 VRP</td><td>1 each</td><td>Fast outriders</td><td>Exposed, loud</td></tr>
<tr><td>ManaCycle Team</td><td>up to 8</td><td>2 VRP</td><td>1 each</td><td>Fast Essence- assisted transit</td><td>Essence signature</td></tr>
<tr><td>Rover + Outrider Bikes</td><td>8 total</td><td>2 VRP</td><td>mixed</td><td>Balanced central support and scouts</td><td>Complex logistics</td></tr>
<tr><td>Cargo Rover + Passenger Sled</td><td>8 total</td><td>1 VRP</td><td>4+1</td><td>Supplies and salvage</td><td>Slow, noisy turns</td></tr>
<tr><td>Bureau Mule Drone</td><td>0</td><td>0 VRP</td><td>2 mods</td><td>Cargo and relay support</td><td>AFA-dependent</td></tr>
<tr><td>Recon Drone Pair</td><td>0</td><td>1 VRP</td><td>1 each</td><td>Scouting</td><td>Signal failure risk</td></tr>
<tr><td>Compact Bridge Cart</td><td>2 seats</td><td>2 VRP</td><td>3 mods</td><td>Gap crossing</td><td>Slow and noisy</td></tr>
<tr><td>Rescue Cart</td><td>2 + casualties</td><td>1 VRP</td><td>3 mods</td><td>Extraction</td><td>Limited combat utility</td></tr>
<tr><td>Cargo Crawler</td><td>4 seats</td><td>2 VRP</td><td>4 mods</td><td>Durable hauling</td><td>Very slow and loud</td></tr>
<tr><td>Inflatable Survey Raft</td><td>6-8 seats</td><td>0 VRP</td><td>2 mods</td><td>Water scan support</td><td>Terrain limited</td></tr>
<tr><td>Compact Survey Skiff</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Flooded/marsh survey</td><td>Water only</td></tr>
<tr><td>Rail-Sled Survey Kit</td><td>4 seats</td><td>1 VRP</td><td>2 mods</td><td>Tunnel movement</td><td>Setup time</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Starting Mount Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Asset</th><th>Capacity</th><th>Cost</th><th>Slots</th><th>Strength</th><th>Pressure</th></tr></thead><tbody>
<tr><td>Quartermaster Mule Team</td><td>4-8 riders/cargo</td><td>0 VRP</td><td>2 tack each</td><td>Reliable cargo</td><td>Slow</td></tr>
<tr><td>Bureau Warhorse Team</td><td>up to 8 riders</td><td>1 VRP</td><td>2 tack each</td><td>Open terrain speed</td><td>Noise and panic</td></tr>
<tr><td>Dust-Rift Camel Team</td><td>up to 8 riders</td><td>1 VRP</td><td>2 tack each</td><td>Endurance and heat</td><td>Tight-space issues</td></tr>
<tr><td>Pack Survey Beast Team</td><td>4-8 mix</td><td>0 VRP</td><td>2 tack each</td><td>Rough-ground logistics</td><td>Low combat nerve</td></tr>
<tr><td>Mountain Patrol Goat Team</td><td>up to 8 light riders</td><td>1 VRP</td><td>1 tack each</td><td>Cliffs and stone</td><td>Low capacity</td></tr>
<tr><td>Rescue Litter Mount Pair</td><td>casualties</td><td>1 VRP</td><td>2 tack each</td><td>Medical extraction</td><td>Slow</td></tr>
<tr><td>Bureau K-9 Harness Team</td><td>cargo/tracking</td><td>1 VRP</td><td>1 tack each</td><td>Warning and retrieval</td><td>Fear vulnerable</td></tr>
<tr><td>Mana-Touched Wolf Scout Pair</td><td>support/rider</td><td>2 VRP</td><td>1 tack each</td><td>Mana sensing</td><td>Harder to control</td></tr>
<tr><td>Bureau Pack Ox Pair</td><td>heavy cargo</td><td>1 VRP</td><td>3 tack each</td><td>Hauling</td><td>Hard to hide</td></tr>
<tr><td>Mule Cart Expedition</td><td>4 riders + cart</td><td>0 VRP</td><td>2 cart/tack</td><td>Quiet low-tech</td><td>Slow</td></tr>
<tr><td>Rover + Pack Mules</td><td>6 seats + cargo</td><td>1 VRP</td><td>mixed</td><td>Balanced hybrid</td><td>Management burden</td></tr>
<tr><td>UTV + Warhorse Outriders</td><td>8 total</td><td>2 VRP</td><td>mixed</td><td>Mixed scouting</td><td>Coordination burden</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Vehicle and Mount Modification Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Modification</th><th>Cost</th><th>Type</th><th>Benefit</th><th>Pressure</th></tr></thead><tbody>
<tr><td>All-Terrain Tires</td><td>1 VRP</td><td>Mobility</td><td>Reduced rough- ground DCs</td><td>Tire damage still matters</td></tr>
<tr><td>Basic Tread Kit</td><td>1 VRP</td><td>Mobility</td><td>Better traction in mud, ash, roots, broken stone</td><td>Noisy on hard road</td></tr>
<tr><td>Rock-Crawler Suspension</td><td>2 VRP</td><td>Mobility</td><td>Improves broken stone and root terrain</td><td>Slower speed</td></tr>
<tr><td>Quiet-Run Baffling</td><td>2 VRP</td><td>Stealth</td><td>Ignore one engine- noise Hunt trigger per travel scene</td><td>Needs maintenance</td></tr>
<tr><td>Headlight Shutters</td><td>1 VRP</td><td>Stealth</td><td>Reduce light signature</td><td>Lower visibility</td></tr>
<tr><td>Low-Noise Brakes</td><td>1 VRP</td><td>Stealth</td><td>Stop quietly once per scene</td><td>Requires handling check under stress</td></tr>
<tr><td>AFA Relay Mast</td><td>2 VRP</td><td>AFA</td><td>Extend AFA range</td><td>Vulnerable to interference</td></tr>
<tr><td>AFA Blackbox Recorder</td><td>3 VRP</td><td>AFA</td><td>Preserve corrupted data</td><td>Attracts faction interest</td></tr>
<tr><td>Terrain Sonar</td><td>2 VRP</td><td>Sensor</td><td>Detect hollows and unstable ground</td><td>Can ping the Hunt Clock</td></tr>
<tr><td>False-Ping Filter</td><td>2 VRP</td><td>Sensor</td><td>Helps detect fake team signals</td><td>Can reject real desperate pings</td></tr>
<tr><td>Cabin Seal Kit</td><td>2 VRP</td><td>Hazard</td><td>Protects against miasma/spores/ash</td><td>Limited duration</td></tr>
<tr><td>Hazard Foam Dispenser</td><td>3 VRP</td><td>Hazard</td><td>Seal breach or bloom once</td><td>Messy and visible</td></tr>
<tr><td>Medical Bench</td><td>1 VRP</td><td>Medical</td><td>Stabilize while stationary or slow</td><td>Takes cargo space</td></tr>
<tr><td>Containment Crate</td><td>2 VRP</td><td>Containment</td><td>Store unstable materials</td><td>Audit-heavy</td></tr>
<tr><td>Front Winch</td><td>1 VRP</td><td>Utility</td><td>Towing and extraction</td><td>Loud under load</td></tr>
<tr><td>Spare Parts Locker</td><td>1 VRP</td><td>Repair</td><td>One repair without scavenging</td><td>Finite</td></tr>
<tr><td>Field Repair Arm</td><td>3 VRP</td><td>Repair</td><td>Major repairs without full workshop</td><td>Complex, fragile</td></tr>
<tr><td>Drone Cradle</td><td>2 VRP</td><td>Drone</td><td>Carry and recharge drone</td><td>AFA-dependent</td></tr>
<tr><td>Pack Saddle</td><td>1 VRP</td><td>Mount Tack</td><td>Cargo capacity</td><td>Reduces speed if overloaded</td></tr>
<tr><td>Medical Litter</td><td>1 VRP</td><td>Mount Tack</td><td>Carry wounded safely</td><td>Slows mount</td></tr>
<tr><td>AFA Collar</td><td>1 VRP</td><td>Mount Tack</td><td>Track mount vitals</td><td>Can give false comfort</td></tr>
<tr><td>Low-Noise Hoof Wrap</td><td>1 VRP</td><td>Mount Tack</td><td>Reduce travel sound</td><td>Wears out</td></tr>
<tr><td>Gate-Calm Training</td><td>1 VRP</td><td>Training</td><td>Resist threshold panic</td><td>Not immune to Domain horror</td></tr>
<tr><td>Roadwise Training</td><td>2 VRP</td><td>Training</td><td>Warns against unsafe roads</td><td>Mount may refuse orders</td></tr>
<tr><td>Panic-Resistant Training</td><td>2 VRP</td><td>Training</td><td>Resists Quiet pressure</td><td>Cannot be forced forever</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Vehicle Condition Track</figcaption>
<table class="campaign-table"><thead><tr><th>State</th><th>Trigger</th><th>Effect</th><th>Field Repair</th></tr></thead><tbody>
<tr><td>Ready</td><td>No current damage.</td><td>Full speed and all installed mods function.</td><td>None.</td></tr>
<tr><td>Stressed</td><td>A hard impact, failed terrain check, or ignored maintenance scene.</td><td>One mod is unreliable until repaired.</td><td>10 minutes, parts, and a DC 12 Engineering or equivalent check.</td></tr>
<tr><td>Damaged</td><td>Second stress, serious attack, flooding, fire, or failed chase consequence.</td><td>Speed halved; loud operation fills one Hunt Clock segment per scene.</td><td>1 hour, spare parts, and DC 14 Engineering; consumes a parts use.</td></tr>
<tr><td>Crippled</td><td>Third stress or major Domain hazard.</td><td>Cannot travel normally; can limp only in short exposed bursts.</td><td>Safehold workshop or field repair arm; DC 16 and a meaningful complication.</td></tr>
<tr><td>Lost</td><td>Abandoned, swallowed, claimed by a faction, or destroyed.</td><td>The team must shift to mounts, foot travel, salvage, or bargaining.</td><td>Recover as a side quest or replace through faction reputation.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Mount Condition Track</figcaption>
<table class="campaign-table"><thead><tr><th>State</th><th>Trigger</th><th>Effect</th><th>Care</th></tr></thead><tbody>
<tr><td>Calm</td><td>Fed, rested, and handled well.</td><td>Full speed; can carry normal load.</td><td>Normal watch and feed.</td></tr>
<tr><td>Spooked</td><td>Hunt near miss, open Essence surge, blood scent, or loud engine panic.</td><td>Disadvantage on the next exposed travel handling check.</td><td>10 minutes of quiet handling or native guidance.</td></tr>
<tr><td>Blown</td><td>Forced march, injury, or panic in the dark.</td><td>Speed halved; refuses one dangerous route.</td><td>Long rest in shelter, medicine, and a successful Animal Handling or Presence check.</td></tr>
<tr><td>Injured</td><td>Direct harm, fall, or exhaustion pushed too far.</td><td>Cannot carry riders; may still carry light cargo.</td><td>Safehold treatment, supplies, or a hard choice to leave cargo behind.</td></tr>
<tr><td>Gone</td><td>Taken, fled, killed, traded, or released.</td><td>The party loses capacity and may owe grief to the community that trusted them.</td><td>Recover, replace, or memorialize; do not treat mounts as disposable gear.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Field Crafting Procedure</figcaption>
<table class="campaign-table"><thead><tr><th>Step</th><th>Question</th><th>Result</th></tr></thead><tbody>
<tr><td>Intent</td><td>What problem is the team solving right now?</td><td>A bridge patch, baffle, lure, ward, splint, relay, trap, or repair.</td></tr>
<tr><td>Materials</td><td>What is being consumed?</td><td>Parts, salvage, cores, time, battery, animal tack, community favor, or Essence.</td></tr>
<tr><td>Worksite</td><td>Where is the work done?</td><td>Open road is fast and dangerous; safehold work is slower but steadier.</td></tr>
<tr><td>Check</td><td>Who leads and who assists?</td><td>Use the most relevant RA skill/tool; failure creates pressure instead of blank denial.</td></tr>
<tr><td>Cost</td><td>What does the Domain learn?</td><td>Noise, light, scent, Essence, a name, a debt, or a visible route.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Campaign Progression Spine</figcaption>
<table class="campaign-table"><thead><tr><th>Levels</th><th>Primary Play</th><th>Campaign Lessons</th><th>Typical Milestone</th></tr></thead><tbody>
<tr><td>1-2</td><td>Bureau procedure and first-entry survey.</td><td>AFA sync, requisition, relay work, first contradiction.</td><td>The map continues beyond the mission boundary.</td></tr>
<tr><td>2-4</td><td>Survival and native rules.</td><td>Sound discipline, safeholds, worn dead, roads, local debt.</td><td>The party gains shelter or loses a sure route.</td></tr>
<tr><td>4-6</td><td>Faction play and salvage economy.</td><td>Vermillion leverage, Bureau truths, cult pressure, crafting upgrades.</td><td>A major location changes hands or breaks.</td></tr>
<tr><td>6-8</td><td>The Means and moral endgame choices.</td><td>Escape, seal, kill, bargain, rescue, or expose.</td><td>A required truth or Relic is won at a price.</td></tr>
<tr><td>8-10</td><td>Final crossing and aftermath.</td><td>The Quiet, Rift Break risk, Domain consequences, homecoming.</td><td>The party chooses what survives the ending.</td></tr>
</tbody></table>
</figure>
</div>
`;

const MAP_DOES_NOT_END_BODY = `
<div class="campaign-prose">
<h2>Chapter 2: The Map Does Not End</h2>
<h2>Chapter Purpose</h2>
<p>The Map Does Not End marks the campaign&#x27;s true turn from field operation to survival horror. The party still has their tools, but the tools no longer define the truth.</p>
<h3>Core Reveal</h3>
<p>The party is not lost because they failed. They are lost because the mission packet described a bounded first layer, and the Gloamreach is not bounded in any way the AFA can prove from the outside.</p>
<h3>No Open Sandbox Yet</h3>
<p>This chapter is still part of the starter arc. Keep the party on the known first route until the Black Road / First Road has shown the impossible distance, the relay spike has contradicted the mission packet, the first local rule has mattered, and the party has reached or been refused a first safehold. The players can choose tactics, tone, speed, resource use, and whom to trust, but they do not yet choose any point on the regional map. That freedom starts after the Gloamreach has taught them what freedom costs.</p>
<h3>Scene Sequence</h3>
<p>The relay spike remains connected, but every ping returns with a longer delay.</p>
<p>The extraction marker remains visible, but distance values become impossible.</p>
<p>The road forks into routes not present on the scan.</p>
<p>The party finds the first sign of habitation: a marker, shrine, fence, track, lantern, or warning slate.</p>
<p>The first vehicle, drone, or mount pressure appears.</p>
<p>The team must choose whether to continue by procedure, improvise, or retreat.</p>
<h3>First Gloamreach Rule</h3>
<p>Use one rule to establish the Domain&#x27;s personality. Do not explain it fully.</p>
<p>Suggested rule: roads respond to certainty. A party that declares a destination aloud gives the road something to answer. Cautious observation, marked routes, silent signals, and local knowledge are safer than confidence.</p>
<h3>Transport Pressure</h3>
<p>The vehicle may still work. Mounts may still obey. That is important. The Gloamreach does not make equipment useless. It makes equipment conditional. Complications The engine sound carries farther than it should. A mount refuses a road before the AFA detects anything. A drone feed loops footage from behind the party. The dashboard says the team is moving toward the exit while the road signs point inward. The cargo bay contains dust from a place they have not reached yet.</p>
<div style="break-before: page; page-break-before: always;"></div>
<h3>Milestone</h3>
<p>Level 2 is awarded after the party survives the first confirmed Gloamreach pressure event, preserves or intentionally sacrifices a meaningful asset, and understands that extraction is no longer routine.</p>
<h2>Chapter 3: Run Silent</h2>
<h2>Chapter Purpose</h2>
<p>This chapter turns the title into a table-facing rule. The Quiet is still mostly unseen. The party learns that sound, Essence, engines, panic, and repeated signals matter.</p>
<h3>The Rule</h3>
<p>Inside the Gloamreach, the question is not only &quot;Can they hear us?&quot; The question is &quot;What did the Domain learn from the fact that we made ourselves known?&quot;</p>
<h3>Sound Sources</h3>
<p>Whispered speech, engine idle, slammed doors, panicked animals, gunfire, metal tools, bright floodlights, repeated AFA pings, active drones, open Essence discharge, and emergency beacons all have different pressure profiles.</p>
<h3>Quiet Play</h3>
<p>Quiet play should matter. The Warden should reward planning, hand signals, low-light discipline, careful vehicle use, proper mount handling, and player caution. Quiet play does not make the party safe forever. It gives them choices.</p>
<h3>The First Worn Sign</h3>
<p>Before the Quiet appears, use the Worn Dead. A body moves wrong, a voice repeats a message with the wrong breathing pattern, or a figure wears salvage from a prior team. This is evidence, not just a scare.</p>
<h3>Hunt Clock Integration</h3>
<p>The Hunt Clock starts at 0. It advances when the party&#x27;s actions change what the Gloamreach can know about them. Do not mark it randomly. Announce the clock, describe what the next mark means, and let counterplay remove or delay marks when earned.</p>
<h2>Chapter 4: First Native Contact</h2>
<h2>Chapter Purpose</h2>
<p>First Native Contact teaches that the Gloamreach is inhabited. The party must stop thinking like a strike team clearing monsters and start thinking like operators inside someone else&#x27;s world.</p>
<h3>Contact Principles</h3>
<p>Native inhabitants are not automatically hostile. Native inhabitants are not Earth civilians. Native inhabitants are not automatically Anomalies. Native inhabitants may know how to survive the Gloamreach but may not understand Bureau technology, Earth law, or the concept of a legal Rift Clear.</p>
<h3>Initial Contact Options</h3>
<p>A road-keeper silently blocking the wrong path. A family hiding from the sound of the vehicle. A warded hamlet that will not open its gate until the engine is cut. A trader who speaks through a child-sized slate to avoid saying names aloud. A handler whose mount refuses to approach the party&#x27;s transport until it is covered.</p>
<h3>What the Natives Know</h3>
<p>They know the roads have moods. They know some lights call things closer. They know engines sound like arrogance. They know the Worn are not the Quiet, but they mean the Quiet was close. They know safeholds are rented by behavior, not owned by walls. They know the party came through a new door, and new doors change old bargains.</p>
<h3>Vehicle and Mount Implications</h3>
<p>The party&#x27;s transport is a cultural object now. It may be wealth, threat, omen, proof, insult, or salvation depending on who sees it and what the party does with it.</p>
<h2>Chapter 4B: When the Sandbox Opens</h2>
<h3>Unlock Condition</h3>
<p>The Gloamreach sandbox opens after First Entry resolves. The required signs are: the party crossed from the material world under Bureau procedure; the Survey Layer proved safe enough to trust and then too small to explain the truth; the Black Road / First Road carried them beyond the scan; the relay spike or AFA produced a contradiction; a local rule changed the cost of a choice; and the party encountered a safehold, wardline, forced shelter, or native warning that made survival social as well as tactical.</p>
<h3>What Opens</h3>
<p>Once the starter arc ends, the players may follow the regional web toward Vermillion Outpost, Hollow Way, Drowned Ledgerfen, Fungal Depths, Remembering Orchard, Ashen Counting-House, Sunken Tunnels, Bastion Golemfall, the Obsidian Spire, Awoko Sanctum, safeholds, old roads, faction routes, and side quests. The Warden should stop redirecting them to a single route and start presenting leads, clocks, costs, and consequences.</p>
<figure class="campaign-table-wrap">
<figcaption>Default Sandbox Openings</figcaption>
<table class="campaign-table"><thead><tr><th>Lead</th><th>Player-Facing Hook</th><th>Best First Destinations</th><th>Campaign Pressure</th></tr></thead><tbody>
<tr><td>Follow the Bureau Signal</td><td>The AFA catches a ghost-ping from a missing team, clean enough to be real and wrong enough to be bait.</td><td>Hollow Way, Bureau Annex traces, Drowned Ledgerfen.</td><td>Bureau truth, missing-team evidence, relay risk.</td></tr>
<tr><td>Seek Shelter</td><td>A native warning, closing wardline, or denied doorway makes shelter the party's first real objective.</td><td>Hamlet That Never Says No, Old Man Crane's Teahouse, Bellweather School.</td><td>Native law, reputation, safehold rules, Dread recovery.</td></tr>
<tr><td>Keep the Vehicle Moving</td><td>The party tries to preserve mobility, cargo, and the first-entry asset before the road or the dark claims it.</td><td>Old Roads, Vermillion Outpost, Silent Depot node.</td><td>Transport condition, repairs, salvage debt, Vermillion contact.</td></tr>
</tbody></table>
</figure>
<h3>Warden Guidance</h3>
<p>After the sandbox opens, never pretend the Gloamreach is safe to wander. Open-world play here means the party chooses which danger to approach first. Every lead should name a possible gain, a visible cost, and the kind of pressure it will invite: Hunt Clock, Dread, transport damage, faction debt, Bureau attention, native distrust, or a clue toward the Means.</p>
</div>
`;

const LORE_BODY = `
<div class="campaign-prose">
<h3>Full-Scale Manuscript Integration</h3>
<h3>Full-Scale Integration Note</h3>
<p>The following chapters preserve and reframe the existing Run Silent campaign manuscript as a full-scale Rift Ascendant campaign book. Legacy content that conflicted with the revised premise has been superseded by the First Entry sequence, the living Gloamreach region, and the rule that Level 1 Ascendants knowingly enter only a stable first-entry layer. When a legacy chapter references an earlier premise, use the revised canon established in the front matter and Chapters 0-4. The Gloamreach is still vast, old from the inside perspective, inhabited, and hunted by the Quiet. The material-world Threshold is newly manifested, low-rank on first reading, and correctly assessed only at the entry layer.</p>
<h3>Warden-only dossier plate: The Quiet</h3>
<p>Rift Ascendant Lore: The Rift Age and the Gloamreach</p>
<h3>Rift Ascendant - World Lore</h3>
<h3>Source Authority</h3>
<p>This chapter is the campaign-facing world lore for Run Silent, aligned to the Rift Age Worldbook and the canonical sourcebooks. Its campaign layer adds the deeper canon this adventure relies on (persistent Rift Interiors, Anchors, Regents, pantheon signatures, Subject Zero, and the Gloamreach). Use Rift Ascendant terminology everywhere: Rift, Rift Threshold, Rift Interior, Rift Site, Rift Clear, Rift Break, Anomaly, Essence, Relic, Ascendant, Awakening, Bureau, Guild, Rank, AFA, Job, Path.</p>
<h3>The Rift Age</h3>
<p>Rift Ascendant takes place on a modern, Earth-like world transformed by the arrival of Rifts. This is not a fallen world. Cities still shine at night. People go to work, pay rent, follow celebrities, argue politics, fall in love, and worry about money. Governments pass laws; corporations compete; hospitals treat the sick. The difference is that reality now has doors where doors should not be. A Rift is a tear in the structure of the world. Some last only minutes. Others stabilize into dangerous thresholds that open into impossible interior spaces - some small enough to clear in hours, some large enough to contain cities, ecosystems, ruins, and weather that does not belong to Earth. Humanity did not collapse. It adapted. New agencies formed, new industries were born, new careers and celebrities and weapons and religions appeared, and new markets grew around Essence, Relics, and Rift materials. And new kinds of people Awakened - the Ascendants, the rare individuals who can enter Rifts, survive what lives there, and fight the Anomalies within. The core truth: Rifts are dangerous, but they are part of modern life. Most people will never enter one; everyone knows they exist. To civilians, Rifts are disasters, resources, miracles, and nightmares at once. To governments, public-safety threats and strategic assets. To corporations, markets. To guilds, contracts. To Ascendants, the place where reputations are made, fortunes are won, and bodies are left behind. The world has learned to live with Rifts. It has not mastered them.</p>
<h3>A Brief History</h3>
<p>Before the Rifts - history looked much like our own; other worlds and hidden powers were folklore. First Contact - the first confirmed Rifts were treated as isolated disasters. Conventional forces tried to enter and clear them, and failed often enough that the world changed its approach. The First Awakened - Ascendants emerged during the early disasters: survivors, soldiers, exposed civilians, some who Awakened without ever approaching a Rift. No single explanation satisfied anyone; what mattered was that they could do what ordinary humans could not. The Bureau Era - governments created regulatory agencies to classify Rifts, license Ascendants, and keep Rift response from becoming uncontrolled warfare. The largest is simply called the Bureau. The Guild Boom - once Essence and Relics proved valuable, private Ascendant guilds became unavoidable - emergency teams, mercenary companies, corporate brands, family crews, and worse. The Modern Rift Age - the world has normalized the impossible: Rift alerts on phones, Ascendant rankings trending online, Essence medicine, Relic auctions, raid footage, fans and sponsors and scandals - and a black market in cores, forged clearances, and unregistered Rift maps. Rifts</p>
<h3>Most people use &quot;Rift&quot; broadly. Specialists are precise</h3>
<p>Rift Threshold - the entrance: a glowing rupture, a dark doorway, a distortion, a mirror-like surface, an opening in the ground. Some are stable; some pulse, flicker, widen, shrink, or move. Rift Interior - the space beyond: a cave system, ruined temple, abandoned city block, flooded station, black forest, frozen fortress, impossible skyscraper, or living maze. Low-rank Interiors clear in hours; high-rank ones can demand days, weeks, or multiple operations. Rift Site - the area around an active Rift in the normal world: Bureau barricades, medical tents, police lines, media zones, guild staging, Essence containment, evacuation points. A mix of crime scene, military checkpoint, film set, and corporate trade show. Rift Clear - a successful operation that neutralizes the primary threat. Not always clean: teams return wounded, civilians are lost, Anomalies escape - or a Rift is declared cleared because that is what the report needs to say. Rift Break - containment fails and Rift conditions spill into the normal world. Anomalies emerge; weather distorts; structures warp; roads stop leading where they should; communication fails. Most Breaks are contained quickly. The ones that are not become history. Anomalies Anomalies are the creatures, entities, hazards, and lifeforms found inside Rifts. The public calls them monsters - sometimes accurately. They can be beasts, spirits, constructs, parasites, humanoids, swarms, living weapons, machines, warped animals, memory-echoes, or things that fit no known category. Some are mindless; some are clever, capable of tactics, speech, building, or worship; some follow laws and hierarchies humanity barely understands. To civilians the distinction rarely matters. To Ascendants it can save a team: a predator can be baited, a soldier misled, a guardian bypassed, a parasite contained - and an intelligent Anomaly can negotiate, lie, threaten, plead, or remember.</p>
<h3>Native Inhabitants</h3>
<p>Anomalies are not a Rift&#x27;s only inhabitants. Not every Interior is empty of people. Especially in high-rank, persistent Interiors, an operation may find native inhabitants - peoples, settlements, families, and cultures native to the Interior&#x27;s own world, neither Anomalies nor visitors from the material world. The doorway is new; the world beyond it is not. These are not humans from Earth who wandered in and got trapped - they are a population that was always there, in a reality the Rift has only just connected to ours. They farm, trade, worship, grieve, raise children, and obey laws that were old before any Ascendant arrived. Some are friendly; some are desperate; some serve whatever rules their Interior. To a strike team trained to clear monsters, the hardest Rifts are the ones with a population - because then a Rift Clear is no longer only a fight. It is a question of what happens to everyone who already lives there. Essence Essence is the most important resource of the Rift Age - the energy, material, residue, crystal, or core recovered from Rifts and Anomalies. It appears as glowing crystals, harvested cores, liquid, dust, thread, bone, metal, or compressed mana. Essence revolutionized technology, medicine, weapons, construction, and computing. It made Ascendants necessary and profitable. Every Rift operation has two public goals contain the threat and protect civilians - and usually a third: recover Essence before someone else does. Relics Relics are objects recovered from Rifts or created through Rift-touched processes: weapons, armor, tools, implants, masks, rings, books, lenses, engines, instruments. A low-grade Relic improves survivability; a high- grade Relic can define a career. Relics can be legal, restricted, classified, stolen, cursed, experimental, counterfeit, or impossible to categorize. Some are mass-reproduced in weaker forms; some are unique, named, and seem to choose their users; some should never have left the Rift. Ascendants Ascendants have Awakened the ability to survive, fight, and act within Rifts. Awakening changes a person - dramatically or subtly, through visions, pain, fever, transformation, or sudden instinctive knowledge. No one fully understands why it happens. What matters is that an Ascendant can channel mana, withstand Rift pressure, fight Anomalies, wield Relics safely, and enter the impossible and come back. Sometimes. Being an Ascendant does not automatically make someone rich or respected. Rank, guild membership, public image, clear record, sponsorship, class, nationality, Bureau relationship, and luck all matter. Some become celebrities; some are low-rank laborers clearing minor Rifts for poor pay; some retire early because trauma ended their career; some disappear. Jobs A Job is the Bureau&#x27;s classification for the broad shape of an Ascendant&#x27;s power - the setting&#x27;s broad Job category. It is not a profession chosen from a catalog; it is the label placed on how power</p>
<h3>expresses itself. Common Job archetypes</h3>
<p>Destroyer, Berserker, Assassin, Striker, Mage, Esper, Revenant, Summoner, Herald, Contractor, Stalker, Holy Knight, Technomancer, Idol. Paths A Path is the specialized expression of a Job - the setting&#x27;s specialized Job expression. It may emerge from training, instinct, trauma, culture, doctrine, Relic exposure, or repeated Rift experience. Two Mages may look nothing alike: a Detonation specialist, a Shield Architect, a probability-bender. Rank Rank is the world&#x27;s attempt to measure the impossible. Rifts, Anomalies, Relics, and Ascendants are classified E through S. Lower ranks are common and usually manageable by trained teams; higher ranks demand elite Ascendants, planning, and Bureau oversight. An S-Rank event is political, economic, military, and historical. Rank determines pay, contracts, fame, and legal freedom - but Rank is not truth. Rifts can be misclassified, Ascendants underestimated, Anomalies can evolve, and a routine clear can become a disaster. Veterans respect Rank. They do not worship it.</p>
<h3>Institutions &amp; Society</h3>
<p>The Bureau - the official regulatory and response authority: it classifies Rifts, licenses Ascendants, issues clearances, tracks Rank, coordinates public safety, regulates Essence and Relic recovery, and maintains casualty records. The Bureau is an institution, not a personality - brave responders, brilliant researchers, exhausted clerks, political operators, idealists, and the occasional corrupt official, all inside a machine too large to care about every case. Many civilians trust it because they must; many Ascendants distrust how its reports are written after things go wrong. Both can be true. Guilds - private organizations built on Ascendant labor: friend-crews, regional response companies, celebrity teams, paramilitary contractors, corporate brands, religious orders, black- market fronts. A good guild offers training, medical support, legal coverage, and benefits; a bad one treats Ascendants as replaceable tools. Corporations - turned the Rift Age into a trillion-credit economy: Essence tech, mana- compatible weapons, Rift-resistant materials, media empires. Some save lives; some knowingly send people into danger; most do both, depending on the quarter. Civilians - the vast majority, who experience the Rift Age through its effects: following rankings like sports, working guild offices, teaching children Rift-alert drills, protesting Essence refineries, worshipping or resenting Ascendants, grieving those lost to a Break. Media, Law, Faith - the storytellers, courts, and creeds that decide what the Rift Age means: news empires that turn every Break into ratings, overwhelmed courts writing Anomaly law case by case, and old and new faiths that name Ascendants saints, sinners, or something the world was not built to hold. All three shape how the public reads the dark - and how a Warden&#x27;s deeds are remembered after.</p>
<p>Ascendants are public figures with fans, sponsors, and scandals. Where there are Rifts there is crime: illegal entry, Essence smuggling, Relic theft, forged clearances, debt contracts. And the Rifts reshaped belief: faiths that call them divine tests or wounds in creation, and new cults formed around Essence, Awakening, Anomalies, and the idea that Rifts are not invasions but invitations. Technology &amp; the AFA Modern technology still works - phones, drones, firearms, hospitals, body armor. Essence added new tools: mana scanners, Rift-resistant armor, resonance sensors, Essence batteries, containment fields, anti-Anomaly munitions. But inside Rifts, reliability varies: signals fail, drones lose navigation, firearms jam in mana interference, digital maps distort, sensors return impossible readings. The AFA (Ascendant Field App) is the standard field interface for licensed Ascendants - a phone app, wrist device, visor, earpiece, tablet, implant display, or guild OS. It tracks mission data, team status, injury warnings, Rift readings, Rank estimates, Essence signatures, contract terms, map data, and Bureau notices. The AFA is not magic and not fate. It does not make decisions for you. It measures, records, warns, and reports. Inside a Rift it is only as reliable as conditions allow. If your AFA says everything is fine while your instincts say otherwise, trust your instincts. Tone Rift Ascendant is modern action fantasy with danger beyond the threshold. The outside world is modern, functional, commercial, political, and alive - contracts, cameras, sponsors, laws, hospitals, rankings, family obligations. The inside of a Rift is where the rules become uncertain - Anomalies, Essence, Relics, impossible environments, strange laws, broken maps, unreliable signals, and choices no contract prepared you for. The setting is not about a ruined world; it is about a normal world that has learned to profit from the impossible, and about people with extraordinary power trying to stay human while everyone else decides what that power is worth. Campaign Layer - Domains, Anchors &amp; the Gloamreach The following deepens the Rift Age Worldbook for high-rank, persistent Rifts. These concepts are the spine of Run Silent. Persistent Rift Interiors - &quot;Domains&quot; Most Rift Interiors are limited: a ruin, a tunnel, a pocket battlefield. But a high-rank Rift Interior can stabilize into a whole interior realm - a valley with weather, roads, settlements, a citadel, a dead sea, a predator forest, a buried archive - large enough to lose armies inside. When such an Interior grows persistent and takes on its own enforceable laws, Wardens call it a Domain. The Rift Threshold is only the door; the Domain beyond it is the adventure. Anchors Every persistent Domain has an Anchor - the thing that keeps its Threshold stable and gives the Interior its laws. Common Anchors include a ruling Anomaly intelligence, a Regent, a Relic engine, a domain heart, an Essence furnace, a bound pantheon signature, or a living ecology that has become self- aware. Clearing a Domain means breaking, sealing, transforming, or extracting the Anchor. Killing every creature inside is not enough while the Anchor - and its law - survives. Contained vs. Rift Break While a Domain is contained, the Bureau can measure the Threshold, issue Rank clearance, deploy Ascendants, and hold a cordon. A Rift Break is the failure state: containment collapses and the Interior begins to overwrite the material side - weather first, then terrain, then Anomalies, then the Anchor&#x27;s law itself. The Bureau calls a Rift safe while its instruments still have numbers. Numbers run out. Regents A Regent is not merely a powerful Anomaly; a Regent is domain authority with will. When a Regent becomes a Domain&#x27;s Anchor, the land itself behaves like a body and a court. Regents do not simply wait in a final room - they wear the faces of the dead, alter roads, bargain through Relics, hollow out settlements, raise servants from the claimed, and study intruders without ever being seen to look. Their horror is not size. It is that inside a Regent&#x27;s Domain, nothing goes unseen and nothing is ever truly free.</p>
<h3>The Pantheon</h3>
<p>The Eternals and Exarchs are the distant powers of the Rift Ascendant cosmos, and they behave like a distant pantheon - much like the gods of older myth. They do not walk inside a Domain, do not take sides, and are never the explanation for a site, a monster, or a Regent. At most they are felt the way old gods are felt: a half- glimpsed omen, a folk-shrine that has not answered in living memory, a name in a prayer no one truly expects to be heard. A campaign can run from threshold to throne and never need to name one of them. Treat the pantheon as deep background, never as a mechanic. The dread inside a Domain comes from the Domain itself - from what it does to the living and what it makes of the dead - not from the powers watching, if they watch at all, from very far away.</p>
<h3>Subject Zero</h3>
<p>Subject Zero is an older, sealed S-Rank Anomaly whose pressure leaks into some high-rank Domains. It is not the Regent and is not loyal to him - an outside hunger that can offer power through forbidden bargains (the campaign&#x27;s &quot;Unseated Law&quot; lever). When Subject Zero touches a Domain, the bargain should be real, useful, and costly.</p>
<h3>The Gloamreach</h3>
<p>The Gloamreach is the persistent Rift Interior of Run Silent - a country-sized persistent Domain behind one stabilized Threshold. It has roads, settlements, ruins, mills, warrens, predator ranges, a fallen bastion, a forbidden vault, and a citadel visible from almost everywhere. The Regent is the Gloamreach&#x27;s Anchor. Its terrors are its own: a drowned hospital-fen that remembers the dead and the not- yet-dead, caverns where the rot learns your sleeping face, an orchard that fruits stolen memories, a hall where the burning dead are never allowed to stop, roads that watch and move and lengthen, settlements surviving on tribute paid to things best left unnamed, and over all of it a Regent who sees everything in his country and wears the faces of everyone it has swallowed. The material side matters as the place the party leaves, the place the Rift may Break into, and the place that must live with the ending.</p>
<h3>Campaign Tone</h3>
<p>Run Silent is hard paranormal / dark-fantasy horror inside a Rift Interior: scarcity without mercy; settlements surviving by tribute; Ascendants reduced from elite operators to trapped prey; Bureau failure recorded in clean language; Vermillion pragmatism that saves and exploits; Anomalies as ecology, punishment, livestock, and omen; Relics that solve problems by teaching the party to think like the Domain; and a Regent who is charismatic, predatory, and patient. The world should feel modern in tools and institutions, but the adventure space is the Rift Interior. Roads should be wrong. Weather should judge. Safe places should feel leased, not owned. Every clear should ask what the party gave up to survive. Glossary AFA - Ascendant Field App; a field interface that tracks mission data, team status, Rift readings, injuries, contracts, and alerts. It measures and reports; it does not grant destiny. - Anchor (campaign)</p>
<p>the entity or structure that stabilizes a persistent Rift Interior and sets its laws. - Anomaly - a creature, entity, hazard, or lifeform from within a Rift. - Ascendant - a person who has Awakened the ability to operate inside Rifts. - Awakening - the event or process by which a person becomes an Ascendant. - Bureau - the official institution for Rift regulation, licensing, classification, and public safety. - Domain (campaign) - a persistent, ruled Rift Interior large enough to behave like a country. - Essence - energy, material, or cores recovered from Rifts and Anomalies. - Guild - a private Ascendant organization. - Job - the broad classification of an Ascendant&#x27;s power (core Job category). - Path - the specialized expression of a Job (specialized Job expression). - Rank - the E-S classification of Rifts, Anomalies, Relics, and Ascendants. - Regent (campaign) - a Domain Anchor that is &quot;authority with will.&quot; - Relic - a powerful object recovered from or created through Rift forces. - Rift - a tear in reality leading to an impossible interior space. - Rift Break - a containment failure where Anomalies or Rift conditions spill into the normal world. - Rift Clear - a successful operation that neutralizes a Rift&#x27;s primary threat. - Rift Interior - the space beyond a Rift Threshold. - Rift Site - the operation area surrounding an active Rift. - Rift Threshold - the visible entrance into a Rift.</p>
<aside class="campaign-note"><h3>Campaign Canon</h3><p>The Gloamreach is new to the material world but not new to itself. Its native history, settlements, and rules are campaign canon inside Rift Ascendant because this dimension is a persistent Rift Interior.</p></aside>
</div>
`;

const RUNNING_BODY = `
<div class="campaign-prose">
<h2>Chapter 5: Bureau Briefing - Revised for First Entry</h2>
<p>Gloamreach</p>
<h3>Campaign Overview</h3>
<p>Run Silent is a survival and psychological horror campaign for 3-6 Ascendants, taking characters from Level 1 to Level 10. It is set inside the Gloamreach, an S-Rank Rift Interior behind one stabilized threshold - and it is not a clear op. It is a hunt, and the party are the prey. The material world is only the staging ground. The whole campaign happens inside, in the dark, where something has hunted since long before the door existed.</p>
<h3>The Truth the Bureau Doesn&#x27;t Have</h3>
<p>No Ascendant or Bureau team has ever gone inside. The Bureau can only rate the Rift from its threshold instruments - a provisional low/E reading that looks like a routine high-density clear. The reading is honest and wrong. The Gloamreach is a coherent interior country, old and inhabited, and its apex predator - the Quiet - cannot be cleared, only survived or fled. The Bureau&#x27;s entire model assumes a threat you can neutralize. Discovering that some Interiors are not clearable, while trapped inside one, is the campaign&#x27;s horror.</p>
<h3>Opening Situation</h3>
<p>The party crosses as the first-ever team into the Gloamreach, on what everyone believes is a routine clear. Within the first hours: the threshold seals behind them, the AFA degrades into lies, comms die, and far off in the dark something that has been listening since the door opened begins, patiently, to come. There is no extraction. There is no backup. There is only the Interior, the dark, the natives who have always lived here behind their rules - and the Quiet.</p>
<h3>The Goal</h3>
<p>There is no lord to dethrone and no boss room to reach. The party&#x27;s goal is brutally simple and genuinely hard: survive, learn how this place is survived, and get out - reopen or re-seal the threshold and escape with as many of themselves as they can keep alive. Because this is a Rift Ascendant campaign, <em>killing the Quiet is always technically possible - but it is near- suicidal until the party reach the top of their tier and assemble the means to do it (a truth about its nature, a Relic that can actually hold it, a native who knows the one way). That is the optional, earned, end-game gamble - and the one clean way out: the Quiet is what holds the threshold shut, so with it dead the seal fails and the party can simply leave, the country open behind them. Escape is the surer victory; the kill is the rarer, harder one. (See The Quiet</em> and the Threshold chapter.)</p>
<h3>Running This Horror</h3>
<p>This is a horror campaign first. Run it accordingly:</p>
<p>The Hunt Clock. The Quiet is drawn by noise, light, and Essence use. Track its approach on the Hunt Clock (see Running This Horror). Living loud advances it; when it fills, it strikes - and it takes a character, not the party.</p>
<p>Essence is bait. An Ascendant&#x27;s powers are the loudest thing in the Gloamreach. The core tension - felt by the players, every time they reach for an ability - is can we afford to be strong right now.</p>
<p>Dread. Fear, the uncanny, and the failing of trust grind the party down (the Dread track):</p>
<p>hallucinations, mistrust, &quot;is that still your teammate,&quot; a steady psychological wear.</p>
<p>Safe and exposed. The campaign breathes between warded native safe-holds (tense normalcy, community) and the exposed dark (the Quiet&#x27;s time). Safety is always conditional and always temporary.</p>
<p>Learn the rules or die. The natives survive by wards, curfews, and rules the party do not know. Knowledge of those rules is the real resource. Breaking one - even in ignorance - brings the Quiet.</p>
<p>Show the monster rarely. The Quiet is almost never seen. Build dread from what is missing the silence, the wrong shape, the open door - not from a creature on display.</p>
<p>Session 0 Checklist Establish mature survival-horror expectations: characters can and will die; not every fight is winnable; running and hiding are correct play. Confirm hard limits and safety tools (X-card, lines and veils). Give every Ascendant a concrete reason to be on a first-entry team (below). Make clear up front that their power is a liability, that the Quiet cannot be out-fought early, and that the natives&#x27; rules are real and lethal to ignore.</p>
<h3>Ascendant Creation Hooks</h3>
<p>Hook Description Bureau Deployed You were ordered onto the first-entry team under emergency clearance. You did not get a choice.</p>
<h3>Guild Raider</h3>
<p>Your Guild bought first-clear rights, sight unseen, and sent you to collect.</p>
<h3>The Eager</h3>
<p>You wanted to be first through a virgin S-Rank threshold. You got your wish. Something Owed You took this op to pay a debt, clear a record, or prove a point. It will not be worth it.</p>
<p>Researcher You needed to see an uncleared Interior with your own eyes before the Bureau sealed it. Now you cannot leave. Grief-Bound You heard a voice you had lost on the threshold instruments. You came to be sure. You should not have.</p>
<h3>Milestone Leveling Guide</h3>
<h3>Milestone</h3>
<p>Level Survive first contact and reach the first safe-hold Learn your first native ward - and why it matters Earn a native community&#x27;s trust, or be cast out of one 4 Cross your first stretch of open hunting ground and live Survive the Quiet taking someone - and keep moving Learn a true thing about what the Quiet is Reach the deep Gloamreach and the failing places Assemble the means that could end it Escape - or make the one stand to kill the Quiet and walk out free</p>
<h3>Running This Horror: The Hunt Clock, Dread, and the Rules</h3>
<h3>Running This Horror</h3>
<p>This chapter is the engine. Run Silent lives or dies on four systems: the Hunt Clock, Dread, Essence- as-bait, and the rhythm of safe and exposed. Learn these and the campaign runs itself.</p>
<p>None of these are new machinery. The Hunt Clock and the Dread track are Run Silent pressure clocks, built on the Warden&#x27;s standard toolkit - run them exactly the way <strong>Warden Guide, Pressure Clocks &amp; Scene Control</strong> teaches, only tuned to the Quiet. Likewise the Gloamreach&#x27;s hazards and its standing as a persistent, inhabited Rift Interior follow <strong>Warden Guide, Rift Hazards &amp; Domains</strong> and <strong>Anomaly Manual, Domains &amp; Persistent Rift Interiors</strong>; the Bureau cordon, AFA sync, and clearances at the Threshold follow <strong>Warden Guide, Bureau, AFA, &amp; Guild Operations</strong>. This book specializes those rules for one terrible place - it does not replace them.</p>
<h3>The Golden Rule</h3>
<p>The Quiet is not a fight to be won; it is a pressure to be survived. The players should feel, constantly, that being loud, bright, or powerful is dangerous - and that the only reliable safety is silence, darkness, restraint, and the natives&#x27; rules. When in doubt, make the quiet choice the smart one and the strong choice the loud one.</p>
<h3>The Hunt Clock</h3>
<p>Track the Quiet&#x27;s approach on a 6-segment clock - draw the circle where the players can see it, and fill wedges in front of them.</p>
<h3>Fill one segment whenever the party</h3>
<p>Makes a loud noise - gunfire, a shout, a fight, a slammed door, a scream. Shows open light in the dark - a torch, a flare, a flame, a bright screen. Uses Essence - any technique, Sigil, Awakened ability, or Relic&#x27;s active power. (This is the big one. Fill two for a large or sustained use.) Breaks a native ward or rule (see Learn the Rules). Lingers too long in exposed ground, or rests somewhere unwarded. Empty one segment by reaching a warded safe-hold, or by a whole scene of silence, darkness, and stillness - no Essence, no light, no noise. The clock never resets on its own. When all six fill, the Quiet strikes. This is not a fight against its full stat block - it is a persecution beat. Choose: it takes a character (the most exposed, the loudest, the one who burned the most Essence), or it forces a desperate hide-or-flee set-piece with a life on the line. Then reset the clock to 2 because it is closer now, and it knows where they are.</p>
<h3>In the Gloamreach: Reading the Nearness</h3>
<p>The Hunt Clock is a Warden&#x27;s tool, not a thing the characters can see. Inside the Gloamreach the party do not count segments; they learn to read the signs the natives have read for generations - and like every rule of this country, they should learn it from someone who has survived it, not from a page. The first time the party sit still long enough in one place, let Old Man Crane (see The Warded Communities) pour the tea and teach them what to listen for. Map what he describes onto the clock the players cannot see.</p>
<div class="read-aloud"><p>&quot;You want to know how close it is. Good - the ones who never ask are the ones it takes first. So listen. The insects stop: that is always the first thing, the night holding its breath because something it fears is moving. Then the cold finds you, even at the fire. Then the dark leans in the way a man leans to hear a secret. Then a voice you love says your name from a door you did not open. Then the road forgets how long it is, and your own hands look borrowed. And then there is no sign at all, because it is already at your shoulder. Six steps, children, and you will only ever feel five - so spend them like they are the last you have. Every shout, every lit lamp, every time one of you reaches for that power you carry, you have taken a step toward it yourselves. The dark is patient. It will gladly take the last step for you.&quot;</p></div>
<p>Each thing Crane names is one segment of the Hunt Clock: the silence where the insects were (1), the cold (2), the dark drawing in (3), the wrong-worn voice at the threshold (4), the world stuttering at its edges (5), and the strike (6). Reveal the clock only as much as the table wants drawn; a party that learns to read these signs for themselves needs the wedges less and less, which is exactly the survival the campaign rewards.</p>
<p><strong>Warden.</strong> Deliver every Gloamreach rule this way - through a native who paid to learn it - before you ever state it as mechanics. The wardlines, the curfews, the things one must never say aloud after the lamps are lit, the Dread that frays a person, and the hard truth that Essence is bait should each reach the party first as a person&#x27;s warning and only second as a number. Handled so, the rules feel like a haunted, living country teaching newcomers how to last the night, never like a rulebook.</p>
<p>The Hunt Clock is the heartbeat of every scene. Fill it slowly, visibly. The dread is in watching it fill.</p>
<h3>Dread (the Unraveling)</h3>
<p>Each character has a Dread track (0-6), rising from witnessing the Quiet&#x27;s work, the uncanny, betrayed trust, losing someone, and certain attacks. As with the Hunt Clock, let the party first learn what the dark does to a person from someone who has nursed the unraveling - Mother Rust, who treats what the Gloamreach breaks (see The Warded Communities).</p>
<div class="read-aloud"><p>&quot;I can set a bone and burn the rot out of a wound. What I cannot fix is what the dark does to the inside of a person. It starts small: they go quiet, they stop sleeping. Then they flinch from faces they love, because out here a loved face is the oldest lure there is. Then they stop being sure which voice is the real one. And at the end, the dark does not even need to take them - they walk out to it themselves, certain it is someone they lost. So mind your people. Sit with them. A kind hour at the fire mends more than any power you carry.&quot;</p></div>
<figure class="campaign-table-wrap">
<figcaption>The Dread Track (0-6)</figcaption>
<table class="campaign-table"><thead><tr><th>Dread</th><th>State</th><th>Effect</th></tr></thead><tbody>
<tr><td>1</td><td>Unsettled</td><td>No mechanical effect - describe the fraying.</td></tr>
<tr><td>2-3</td><td>Shaken</td><td>Disadvantage on the first save each scene against fear or the uncanny.</td></tr>
<tr><td>4</td><td>Fraying</td><td>Once per scene the Warden may have the character briefly mis-see an ally as the Quiet, or hear a lure in a trusted voice.</td></tr>
<tr><td>5</td><td>Breaking</td><td>Disadvantage on checks while any familiar face is present; the character may act on a hallucination once.</td></tr>
<tr><td>6</td><td>Unmade</td><td>At the worst moment the character does the thing that gets someone taken. The player keeps agency; the Warden gains one hard complication to spend.</td></tr>
</tbody></table>
</figure>
<p>Dread drops by 1 per full rest in a true safe-hold, or by a real moment of human connection, comfort, or native kindness.</p>
<h3>Essence Is Bait</h3>
<p>The campaign&#x27;s signature tension. Every use of Essence advances the Hunt Clock, and deep in the Gloamreach it draws the worn dead. Make the players feel the choice each time they reach for a power: the technique that wins the fight is the bell that rings the Quiet to the door. The natives do not use Essence at all if they can help it - and they are furious at outsiders who do. The point is not to forbid powers; it is to make using them a real, costly decision. A party that learns to win by wits, silence, and the dark - and spends Essence only when the cost is worth a life - is playing correctly.</p>
<div class="read-aloud"><p>&quot;You carry lightning in your hands, and you want to know why we never reach for ours. Listen, then. Every time one of you uses that power, it rings out across the whole dark like a struck bell, and the dark turns its head toward the sound. We learned - over more dead than you have names for - that out here the strong thing and the loud thing are the same thing. So we do it the hard way: quiet, and small, and alive. Spend your gift if a life is worth the bell. Never for less.&quot; - a ward-keeper of the Hamlet That Never Says No</p></div>
<h3>Safe and Exposed</h3>
<p>The campaign breathes between two modes. Hold the contrast hard. Safe-holds (warded native places): the only true rest. Tense normalcy - fires, food, people living their lives behind the rules. The clock can empty here; Dread can drop. But safety is conditional: every safe-hold has rules, and the rules are absolute. Exposed (the open hunting ground): the Quiet&#x27;s country. The clock fills; the dark is cover and threat both; the worn dead lure and hunt. The party crosses exposed ground to reach somewhere - and the goal is always get behind a wardline before the clock fills. Learn the Rules or Die The natives survive by wards and rules, and the party does not know them. This is a core survival loop: Each safe-hold and region has its rules - a curfew, a thing you must never do, a ward you must keep lit or keep dark, an offering, a silence. Breaking one fills the Hunt Clock and may bring the Quiet at once. The party learns the rules by earning the natives&#x27; trust, by warning, or by watching someone break one and die. Knowledge of the rules is the most valuable thing in the Gloamreach - worth more than any Relic. The natives fear and resent rule-ignorant outsiders, who endanger everyone. Trust is earned slowly and lost in an instant. How the Quiet &quot;Takes&quot; Someone When the Quiet strikes it rarely kills outright - it takes. The character is dragged into the dark. Across the campaign, use all three of: gone for good (a real loss); recoverable if the party goes after them fast (a desperate rescue in the worst conditions); or returned later, worn - walking, talking, almost right, and not theirs anymore. A taking should always cost, always be survivable for the rest of the party, and never be a TPK.</p>
<h3>The Quiet: The Thing That Hunts the Gloamreach</h3>
<h3>The Quiet</h3>
<p>You will not see it. It saw you the moment the door closed, and it has been listening ever since.</p>
<h3>What It Is</h3>
<p>The Quiet is the apex Anomaly of the Gloamreach - the reason this Rift Interior has never been cleared, and never will be by force. It is not a person, was never a person, and answers to nothing; it is old, vast, and patient in the way only a thing that has never gone hungry can be. The natives do not say its name. They call it the Quiet - because it is drawn to every sound the living make, and because of the silence it leaves where a person used to be. It is meant to be primally frightening. Run it as a presence, not a monster - something the party feels long before they ever glimpse it, and never quite stop feeling. A stand-up fight with the Quiet is not a fight; it is the last mistake a party makes - until, late and well-earned, it isn&#x27;t (see Can It Be Killed?).</p>
<h3>What Draws It</h3>
<p>The Quiet hunts by what the living cannot help doing. It is pulled, hard, toward three things: Noise. Footfalls, raised voices, gunfire, a dropped pack, a scream. The louder the party lives, the faster it comes. Light. Open flame, a torch, a flare, the glow of a screen in the dark. Light is a beacon; the dark is the only cover the Gloamreach offers. Essence. Worst of all, the Quiet feels an Ascendant use their power. Every technique, every Sigil, every Awakened ability rings through the Interior like a struck bell. The party&#x27;s greatest strength is the thing most likely to get them killed - and learning that, the hard way, is the campaign&#x27;s first real lesson. The natives have built their entire way of life around denying it these three. The party arrive knowing none of it. Four Truths, All At Once 1 - It is always near. The Quiet does not arrive and leave; it is simply out there - in the dark past the wardline, in the walls, under the floor of the world. Whatever the party does, the sense of it draws closer: a cold, a pressure, a held breath at the back of every scene. It cannot be reasoned with, bribed, or outrun. It can only be avoided, blinded, delayed, and survived - and every delay costs. 2 - It wears the dead. It comes to the party as the people they have lost, and as the natives&#x27; lost: a dead teammate at the fire, a voice from the next room, a child who should not be here, smiling. It gets the small things right - a laugh, a turn of phrase, an old scar - and one thing, always, deliberately wrong. After the first time, no familiar face in the Gloamreach can be fully trusted. That is exactly the point. 3 - It is almost never seen. The horror is not the monster in full light; it is the shape at the edge of the lamplight, the thing the eye never quite resolves. Describe its approach through everything but the thing itself - the silence where insects should be, the breath on the back of the neck, the door that is open now. Show it fully only when it strikes, and then only for a heartbeat. 4 - To be truly fixed by it unmakes you. When the Quiet turns its full attention on a person - not the listening, the attention - the world stutters. Distances forget themselves. People remember things that never happened. To be its focus is to feel, briefly and completely, how small and provisional you are, and to come away with something missing you cannot name.</p>
<h3>The Shapes It Wears</h3>
<p>The Quiet keeps no court - it has no servants and rules nothing. But the Gloamreach&#x27;s dead do not rest, and it wears them: the still figure at the roadside, the thing in a lost teammate&#x27;s coat, the lure that calls a name in a familiar voice from somewhere you should not go. These are not soldiers; they are bait and gloves. Putting one down is easy and means nothing - there is always another face. (Stat these as its lesser hunters and lures - the Worn, anomaly-0701; the Caller, anomaly-0702; the Wrong Shape, anomaly-0703; the Hollowed, anomaly-0704 - all in the Anomaly Manual.)</p>
<h3>How to Run It</h3>
<p>Run the Quiet through dread and restraint, never spectacle: Make it the players&#x27; problem, not the characters&#x27;. The tension is can we stay quiet, dark, and powerless long enough to live - a question the players feel every time they reach for a power. Reward silence; punish noise. Track the Hunt Clock (see Running This Horror). Noise, light, and Essence advance it; when it peaks, the Quiet strikes - and it takes a character, not the party. Show it early and rarely. A wrong shape on a ridgeline, gone when you look twice. A voice in a dream. Then let the party carry the knowledge that it knows they are here. Let it offer. In the shape of the dead and the things they want most - rest, a lost face, a way out. The offer can be real. The cost always is. Why This Isn&#x27;t a Domain-Lord (hold these lines) It does not rule. No throne, no court, no tribute, no kingdom. It is a predator in its territory, not a king in his castle. The natives keep rules to survive it - rules it never handed down. It cannot be bargained into a plot. No romance, no fixation, no tragic past to redeem. It is hunger with patience. It is not waiting in a final room. It is the whole dark, listening. There is no castle to storm only a country to cross without being heard.</p>
<p>Can It Be Killed? Yes - but not by being fought, and not until the party is ready. For most of the campaign the Quiet is unkillable in practice: ordinary force barely marks it, and it withdraws into the dark to come again. Putting it down for good requires two things together, late: the party at the right level (high tier), and the means assembled in play - a truth about what it is, a Relic or weapon that can actually hold it, an ally or native who knows the one way. None of that is a mandatory fetch-quest; it is discovered, optional, and hard. Escape is always the surer victory. Killing the Quiet is the thing a party can attempt, once - and only once they could survive being wrong.</p>
<h2>Chapter 2: The Means to End It</h2>
<h3>The Means to End It</h3>
<h3>There Is No Win Condition to Collect</h3>
<p>The party does not gather keys to beat a boss. Their goal is to survive and escape (see Chapter 1). But because this is a Rift Ascendant campaign, the Quiet can be killed - and a party willing to pay for it should be able to try. This chapter is the Warden&#x27;s toolkit for that gated kill: what it takes, where the pieces come from, and how to keep it from ever becoming a fetch-quest.</p>
<h3>The Two Locks</h3>
<p>The Quiet&#x27;s stat block (The Quiet, anomaly-0700, in the Anomaly Manual) cannot be reduced below 1 hit point - it simply withdraws into the</p>
<h3>dark - until both of these are true</h3>
<p>Tier. The party is 9th level or higher. Below that, no means matters; the Quiet is beyond them, and any attempt is a way to die.</p>
<p>The Means. The party has assembled what it takes to make the Quiet killable - drawn together in play, never handed over. The Means is built from three kinds of thing, and the party needs enough that the Warden is satisfied they have earned it: A truth about what the Quiet is - learned from the deep places, the oldest natives, or the things it has worn. A way to hold it still - a real Relic, weapon, or working (from the compendium) that can pin a thing never fully there: light and silence forced together, a true name, a ward turned inward. Place this as a hard-won treasure, never a giveaway. A way to make it stay dead - a place, a moment, or a sacrifice where the kill can land: the threshold itself, a ward-circle the natives will only build once, a dawn in a country that has none. How to Run It (so it never becomes a checklist) Never list the Means as objectives. The party discovers, in play, that the Quiet might be killable and what that would take. Let them assemble it because they chose to, between survival crises. Escape is always the surer victory. Make clear - through the natives and the cost - that going for the kill is the harder ending. Most parties should be tempted to just get out. The attempt is one scene, and it is brutal. When the locks are met and the party commits, run the Quiet in the place they&#x27;ve chosen. The Means is what makes the fight winnable: spent fully, it drags the Quiet down to</p>
<figure class="campaign-table-wrap">
<figcaption>Hunt Clock Quick Reference</figcaption>
<table class="campaign-table"><thead><tr><th>Trigger</th><th>Segments</th><th>Warden Move</th></tr></thead><tbody>
<tr><td>Loud noise, engine roar, gunfire, breaking a ward, obvious light in dark.</td><td>+1</td><td>Show attention before impact: silence falls, a road empties, a familiar voice calls.</td></tr>
<tr><td>Large Essence use, repeated signal pulse, open panic, blood in exposed ground.</td><td>+2</td><td>Offer a choice: hide, flee, pay a cost, or abandon an objective.</td></tr>
<tr><td>Clock fills.</td><td>Strike</td><td>The Quiet takes someone, isolates someone, or forces a desperate hide-or-flee set piece. Reset to 2.</td></tr>
<tr><td>Native rule obeyed, ward honored, genuine silence maintained under pressure.</td><td>-1 or hold</td><td>Reward restraint without making the Domain safe.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Dread Track</figcaption>
<table class="campaign-table"><thead><tr><th>Dread</th><th>State</th><th>Table Effect</th></tr></thead><tbody>
<tr><td>0</td><td>Steady</td><td>No effect. The character may still be frightened by scenes.</td></tr>
<tr><td>1-2</td><td>Unsettled</td><td>The Warden may ask what detail they cannot stop noticing.</td></tr>
<tr><td>3</td><td>Shaken</td><td>Disadvantage on the first save each scene against fear or the uncanny.</td></tr>
<tr><td>4</td><td>Fraying</td><td>The Warden may briefly make an ally look or sound wrong.</td></tr>
<tr><td>5</td><td>Breaking</td><td>Disadvantage on checks while a familiar face is present in the scene.</td></tr>
<tr><td>6</td><td>Unmade</td><td>At the worst moment, the character does the thing that gets someone taken; then reduce to 3 after the scene.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Safe and Exposed Cycle</figcaption>
<table class="campaign-table"><thead><tr><th>Phase</th><th>Warden Job</th><th>Player Job</th></tr></thead><tbody>
<tr><td>Safehold</td><td>Present rules, debts, rumors, repairs, faction offers.</td><td>Recover, choose obligations, learn the route, decide what to risk.</td></tr>
<tr><td>Preparation</td><td>Ask what they bring, what they leave, and how quiet they intend to be.</td><td>Craft, requisition, bargain, mark names, set marching order.</td></tr>
<tr><td>Exposed travel</td><td>Use the Hunt Clock, road events, and signs of pursuit.</td><td>Move with discipline; decide when power is worth attention.</td></tr>
<tr><td>Crisis</td><td>Make the Domain act according to established rules.</td><td>Solve, flee, hide, bargain, or pay.</td></tr>
<tr><td>Aftermath</td><td>Record what the dark learned and what communities heard.</td><td>Update condition tracks, debts, reputation, and plans.</td></tr>
</tbody></table>
</figure>
</div>
`;

const REGION_BODY = `
<div class="campaign-prose">
<p>something a level-10 party can kill - forced into a silence and dark it cannot slip, stripped of its lair actions and its power to simply take a character, pinned where the kill can land. It still fights to the last and still tries to take someone with it. (See the Threshold chapter.) Killing it is the way out. The Quiet is what holds the threshold shut. Put it down for good and the seal fails: the party can walk out freely, and what becomes of the Gloamreach and its people is left open, for another day and another telling. (See the Threshold chapter.)</p>
<h3>What the Quiet Cannot Abide</h3>
<p>Three things genuinely hurt or hinder the Quiet; clever parties will find them long before they could kill it. Use them to make survival possible, and to seed the Means: Silence and the dark, together. It hunts by noise, light, and Essence; a party that gives it none of these is, briefly, safe - and a place where absolute silence and dark can be forced on it is where a kill could land. A true name, truly spoken. The dead it wears had names. Naming what it has taken - or what it is - can make it flinch, break a lure, or hold it for a heartbeat. The natives&#x27; deepest wards. The wards that keep it out of the safe-holds can, rarely and at terrible cost, be turned inward to keep it in.</p>
<h3>Warden Guidance</h3>
<p>Treat all of this as optional, dangerous evidence, not a quest line. Every piece the party finds should first help them survive, and only later add up - if they choose - to a way to end the thing that hunts them.</p>
<h2>Chapter 3: The Gloamreach Region Guide</h2>
<h3>The Gloamreach Region Guide</h3>
<h3>Overview</h3>
<p>The Gloamreach is a country-sized interior realm behind one S-Rank Rift - a whole world with its own people, weather, and unwritten law, old and inhabited long before the door opened. It is large enough for travel to matter, for one warded community to know nothing of the next, and for the dark between them to be the most dangerous country a team will ever cross. Read aloud: There is no sun here - only a low, sourceless grey light, and a sky the colour of a held breath. The land goes on further than it should: grey moors, drowned fields, dead industry, and the lit windows of people who have learned to live very quietly. Underneath all of it, always, is the sense of something vast and patient that heard you arrive and has not stopped listening since.</p>
<h3>Core Regions</h3>
<h3>The Rift Threshold</h3>
<p>Where the party enters. Bureau instruments briefly function here, then begin reporting impossible distances, duplicate life signs, and old team telemetry.</p>
<h3>The Old Roads</h3>
<p>The Gloamreach is threaded with old native roads, raised causeways, and rail-cuts that link the warded communities. They are the fastest way to travel and the most exposed: open ground, far from any wardline, where every footfall carries and the dark has room to move. The natives walk them only by grey daylight, in silence, and never alone - and they are right to.</p>
<h3>The Warded Communities</h3>
<p>The native settlements survive behind wards, curfews, and rules paid for in generations of the dead. Each keeps its own customs and its own price for shelter - one bars every door at dusk, one never speaks a sleeper&#x27;s name aloud, one buries its grief where outsiders must not dig. None are safe for free, and none owe a stranger anything. (See the keyed communities.)</p>
<h3>The Predator Woods</h3>
<p>An adaptive hunting ground. It remembers tactics, blood, campfire smoke, and fear.</p>
<h3>The Mills and Rendering-Yards</h3>
<p>Native industry still runs by grey light - mills, workhouses, and rendering-yards where the communities process what little the Gloamreach gives them. Honest labour, a ward over every door, and a hard silence about what the night shift is really for.</p>
<h3>Bastion Golemfall</h3>
<p>A fallen defensive fortress. This is the campaign&#x27;s ruin of failed protection, last stands, and old oaths.</p>
<h3>The Vermillion Outpost</h3>
<p>A black-market shelter deep inside the Gloamreach. Vermillion saves people and exploits them. Both facts are true.</p>
<h3>The Deep Places</h3>
<p>Beneath the inhabited country lie older things - sealed vaults, drowned undercrofts, and the ruins of whatever stood here first. The oldest natives say that if there is a truth about the Quiet to be found - what it is, and whether it was always here - it waits down there, and it is never given up cheaply. This is the campaign&#x27;s forbidden-bargain country. The Threshold and the Deep Dark There is no castle to storm and no throne to reach. The campaign&#x27;s end is the long way back: the deepest, darkest crossing of the Gloamreach to the sealed Threshold, where the party either reopens the way out or, late and well-earned, makes the one stand that could put the Quiet down for good. (See the Threshold chapter.) The Hollow Way and the Deeper Sites Beyond the roads, the Gloamreach holds far more than any map shows - each keyed in its own chapter. The Hollow Way is the throat just past the Threshold and the party&#x27;s first contact with the Quiet (Ch8). The deeper sites: the Drowned Ledgerfen (predatory archive, Ch9), the Fungal Depths (adaptive body-horror, Ch10), the Remembering Orchard (memory-bloom, Ch11), the Ashen Counting- House (the burning hall of the dead, Ch12), the Sunken Tunnels (drowned warrens, Ch13), the Obsidian Spire (the old high place, Ch15), and the Awoko Sanctum (grief-cult, Ch33). The Warden seeds the pieces of the Means and the key native allies across these places by hand (see What the Natives Know), so no two campaigns uncover the Gloamreach in the same order.</p>
<h3>Travel Rules</h3>
<p>Roll once for every major journey across exposed ground, or whenever the party travels loud, lit, or late. On any result that draws attention, fill the Hunt Clock.</p>
<figure class="campaign-table-wrap">
<figcaption>Road Events (d6)</figcaption>
<table class="campaign-table"><thead><tr><th>d6</th><th>Road Event</th></tr></thead><tbody>
<tr><td>1</td><td>The way goes on longer than it should. Lose time and supplies, and the dark gets a turn.</td></tr>
<tr><td>2</td><td>A still figure stands at the roadside, facing away. It is gone if you look twice - or it isn&#x27;t.</td></tr>
<tr><td>3</td><td>A voice from off the road calls a name someone in the party has lost.</td></tr>
<tr><td>4</td><td>A community bell tolls once, far off, then nothing. Someone behind a wardline did not make it.</td></tr>
<tr><td>5</td><td>Fresh sign of something large that crossed here ahead of you, unhurried. Fill the Hunt Clock.</td></tr>
<tr><td>6</td><td>A safe-looking shelter, its door already open. Nothing inside is wrong, which is the worst part.</td></tr>
</tbody></table>
</figure>
<h3>Resting in the Open</h3>
<p>Long rests outside a warded community require a DC 10 Vitality save. On a failure, the character&#x27;s sleep is found - they dream of the dark drawing patiently closer, and wake with disadvantage on the first Sense check of the day. A party that rests unwarded should always wonder what the rest cost them.</p>
<h2>Chapter 4: Factions and Reputation</h2>
<h3>Factions and Reputation</h3>
<h3>Overview</h3>
<p>The Gloamreach is shaped by factions trying to survive, profit, worship, or escape - and by the native communities who have done all four for longer than anyone can remember. Reputation affects supplies, shelter, intelligence, betrayal, and final-act support.</p>
<h3>Reputation Tiers</h3>
<figure class="campaign-table-wrap">
<figcaption>Reputation Tiers</figcaption>
<table class="campaign-table"><colgroup><col style="width:10%" /><col style="width:16%" /><col style="width:74%" /></colgroup><thead><tr><th>Score</th><th>Tier</th><th>Effect</th></tr></thead><tbody>
<tr><td>&#x2212;2</td><td>Hostile</td><td>Faction attacks, sabotages, or reports the party.</td></tr>
<tr><td>&#x2212;1</td><td>Distrusted</td><td>No services, higher prices, guarded speech.</td></tr>
<tr><td>0</td><td>Neutral</td><td>Basic interaction.</td></tr>
<tr><td>+1</td><td>Trusted</td><td>Discounted services, side quests, better information.</td></tr>
<tr><td>+2</td><td>Allied</td><td>Safe shelter, faction support, possible final-act aid.</td></tr>
</tbody></table>
</figure>
<h3>The Ascendant Bureau</h3>
<p>Leader: Commander Park Jae-won Base: Bureau Domain Response Annex outside the Rift Goal: Maintain containment, recover teams, prevent a Rift Break, preserve official control. The Bureau is useful, disciplined, underinformed, and politically afraid. It can save lives, but it will also classify inconvenient truths.</p>
<h3>The Vermillion Guild</h3>
<p>Leader: Guildmaster Orin Base: Vermillion Outpost inside the Gloamreach Goal: Extract salvage, rescue useful survivors, profit, and prove the Bureau is too slow to lead. Vermillion moves fast and does not wait for permission. Their help is real. Their invoices are also real.</p>
<h3>The Awoko Cult</h3>
<p>Leader: The Hollow Mother Base: Hidden sanctum, moving through grief-dense sites Goal: Commune with the Quiet instead of hiding from it - feed it the community&#x27;s grief and dead, and be spared, or remade, in return. The Awoko preach remembrance, but their rituals turn grief into fuel and their mercy into bait. They believe survival-by-silence is only slow surrender, and that the way through is to give the dark what it wants.</p>
<h3>The Warded Communities</h3>
<p>Leader: No single voice - a loose web of ward-keepers, elders, and curfew-wardens Base: The warded native settlements across the Gloamreach Goal: Survive another night. Keep the wards as they must be kept, the rules unbroken, and the outsiders from getting everyone killed. The natives are less a faction than a whole civilization, but reputation still matters and is tracked per community. They are the keepers of every rule that holds the Quiet off - the most valuable knowledge in the Gloamreach - and they share it slowly, with people who have proven they will not bring the dark down on a roof full of children. Endanger a community and word travels ahead of the party; earn one&#x27;s trust and you earn a wardline to sleep behind.</p>
<figure class="campaign-table-wrap">
<figcaption>Road Event Table</figcaption>
<table class="campaign-table"><thead><tr><th>d6</th><th>Event</th><th>Use</th></tr></thead><tbody>
<tr><td>1</td><td>The way goes on longer than it should.</td><td>Drain time, fuel, mount stamina, or confidence.</td></tr>
<tr><td>2</td><td>A still figure stands at the roadside.</td><td>Test restraint; the figure may be sign, bait, corpse, or witness.</td></tr>
<tr><td>3</td><td>A voice calls a name someone has lost.</td><td>Offer information at the cost of attention.</td></tr>
<tr><td>4</td><td>A community bell tolls once.</td><td>Foreshadow debt, death, or an opened shelter.</td></tr>
<tr><td>5</td><td>Fresh sign of something large crossing.</td><td>Show scale before encounter.</td></tr>
<tr><td>6</td><td>A safe-looking shelter waits open.</td><td>Make false safety the scene, not a trick roll.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Faction Reputation States</figcaption>
<table class="campaign-table"><thead><tr><th>State</th><th>Score</th><th>What It Means</th></tr></thead><tbody>
<tr><td>Hostile</td><td>-2 or less</td><td>No shelter; patrols, debt collectors, or cult watchers move first.</td></tr>
<tr><td>Distrusted</td><td>-1</td><td>Higher prices, guarded speech, no sensitive information.</td></tr>
<tr><td>Neutral</td><td>0</td><td>Basic trade and wary shelter if rules are honored.</td></tr>
<tr><td>Trusted</td><td>+1</td><td>Local routes, repair help, rumors, introductions.</td></tr>
<tr><td>Allied</td><td>+2 or more</td><td>Rare gear, final-operation support, rescue risks taken on the party&#x27;s behalf.</td></tr>
</tbody></table>
</figure>
</div>
`;

const LOCATIONS_BODY = `
<div class="campaign-prose">
<h2>Chapter 5: Bureau Domain Response Annex</h2>
<h3>Bureau Domain Response Annex</h3>
<h3>Overview</h3>
<p>The Bureau annex is the material-side command post outside the S-Rank Rift. It is the party&#x27;s last reliable taste of the modern world: floodlights, barricades, medics, drones, tablet maps, exhausted analysts, and a Rift that refuses to behave like a door.</p>
<h3>Key Areas</h3>
<h3>Operations Center</h3>
<p>Commander Park briefs teams here. The main display shows the Rift Threshold, then static, then maps that update with impossible roads.</p>
<h3>Quartermaster Station</h3>
<p>Basic gear, mana rations, glow rods, smoke grenades, medkits, and Bureau tactical armor. Higher-tier stock requires trust.</p>
<h3>Medical Bay</h3>
<p>Dr. Serin Hayashi treats survivors and studies Rift-touched tissue. She is one of the first Bureau researchers willing to say the unsayable: some Interiors cannot be cleared at all - and the thing inside this one may not be something you kill, only survive or flee.</p>
<h3>Communications Room</h3>
<p>Relay operators attempt contact with teams inside the Gloamreach. Messages arrive out of order. Some are from tomorrow. Some are from dead teams.</p>
<h3>Key NPCs</h3>
<h3>Commander Park Jae-won</h3>
<p>A disciplined Bureau officer trying to keep panic from becoming policy. He wants containment, but he is not blind to the Bureau&#x27;s failures.</p>
<h3>Quartermaster Lin Mei-hua</h3>
<p>Controls equipment access. Practical, dry, and more generous when no one is watching. Dr. Serin Hayashi Researcher, physician, and dangerous thinker. Believes some Rift Interiors are coherent, inhabited countries with their own apex predators - not monster-nests to be cleared, and lethal to treat as one.</p>
<h3>Agent Kira Blackwood</h3>
<p>Intelligence operative with classified orders involving pre-threshold Relic activity. Her secrecy can become either betrayal or confession.</p>
<h2>Chapter 6: The Vermillion Outpost</h2>
<h3>The Vermillion Outpost</h3>
<h3>Overview</h3>
<p>The Vermillion Outpost is the salvage cartel&#x27;s stronghold and the closest thing to a free market the Gloamreach allows - a fortified warren of stalls, bunks, and back rooms grown into the bones of some older native structure the Gloamreach never finished reclaiming. The Vermillion are native to the Gloamreach; they did not arrive, they endured, and the Outpost exists because they have spent lifetimes learning exactly how much noise the Gloamreach will forgive before it bites. Read aloud: After the road, the noise alone is almost too much - haggling, a cookfire, someone retuning a salvaged Relic until it stops screaming. Red lamps, red banners, a hand-painted star over every doorway. A runner no older than twelve sizes up your gear, your wounds, and your desperation in a single glance and grins. &quot;First time in? You&#x27;ll want to talk to Orin. Everything else here, you&#x27;ll want to not talk about.&quot; The Outpost has hot food, heat, contraband Runes, wounded the Gloamreach wrote off, salvage stalls, charged Essence-cells, and more edged-and-Relic arms than any cautious native would ever carry - Vermillion have always believed firepower beats silence, and the Gloamreach is full of the graves of people who agreed. Areas</p>
<h3>Core Exchange</h3>
<p>Buy and sell Anomaly cores at better rates than Bureau standard. Vermillion asks fewer questions and remembers more favors.</p>
<h3>Rune Stall</h3>
<p>Contraband Runes and Sigils. Expensive, useful, and sometimes cursed by whatever the Gloamreach&#x27;s deep places did to them before Vermillion dug them up.</p>
<h3>Field Kitchen</h3>
<p>A hot meal grants 1d4 temporary HP for one hour, but food is scarce. If the party eats free, someone else does not.</p>
<h3>Bounty Board</h3>
<p>Bounties include missing teams, dangerous crossings, predators of the wilds, safe-route intel, and rumors of where a piece of the Means might be found.</p>
<h3>Orin&#x27;s Office</h3>
<p>Guildmaster Orin keeps maps on the walls. Every map disagrees. He trusts none of them and all of them.</p>
<h2>Chapter 7: Downtime in a Hostile Domain</h2>
<p>Downtime in a Hostile Domain Downtime inside the Gloamreach is never fully safe. It is time bought from hunger, the dark, weather, and the Quiet&#x27;s attention. Use the standard downtime framework from <strong>Warden Guide, Downtime Activities</strong> for what a day off can accomplish; this chapter only changes what it costs here, where rest is never given for free.</p>
<h3>Downtime Actions</h3>
<h3>Rest Behind a Wardline</h3>
<p>Requires a warded community, outpost, or a camp the party has learned to ward. Safe unless they have broken a local rule or let the wards fail.</p>
<h3>Gather Rumors</h3>
<p>Learn one clue about a ward, a safe route, the lost, a deep place, or a piece of the Means (see What the Natives Know).</p>
<h3>Repair and Refit</h3>
<p>Restore damaged gear, reload consumables, and prepare for travel.</p>
<h3>Study How the Gloamreach Works</h3>
<p>Make an Intelligence or Sense check. On success, learn one way the Gloamreach can be tricked, warded, or slipped past.</p>
<h3>Treat Trauma</h3>
<p>A character may clear one minor fear, hallucination, or memory distortion if another character spends the downtime helping them.</p>
<h3>Downtime Complications</h3>
<figure class="campaign-table-wrap">
<figcaption>Downtime Complications (d6)</figcaption>
<table class="campaign-table"><thead><tr><th>d6</th><th>Complication</th></tr></thead><tbody>
<tr><td>1</td><td>A still figure is standing at the treeline, just past the firelight, when someone looks up.</td></tr>
<tr><td>2</td><td>A community demands a hard price - a rule kept, a debt worked off - for continued shelter.</td></tr>
<tr><td>3</td><td>Food spoils overnight, or supplies are quietly gone.</td></tr>
<tr><td>4</td><td>Someone dreams of the dark drawing closer and wakes with the Hunt Clock one segment higher.</td></tr>
<tr><td>5</td><td>Vermillion calls in a favor.</td></tr>
<tr><td>6</td><td>The safe route the party meant to take is exposed now - washed out, watched, or simply wrong.</td></tr>
</tbody></table>
</figure>
<h2>Chapter 8: The Hollow Way - First Contact</h2>
<h3>The Hollow Way - First Contact</h3>
<p>Read aloud: The Threshold lets you in like a held breath letting go, and the road forward sinks at once into the dark - a vast throat of old stone, ribbed with veins of cold Essence-light that pulse the way something swallows. Far down in the black, a voice you know is calling your team&#x27;s call-sign, patient and glad you came. None of you said it aloud. The walls are already carved with your names, the cuts still pale, as though finished moments before you arrived.</p>
<h3>Overview</h3>
<p>The Hollow Way is the first thing past the Rift Threshold and the party&#x27;s first hour in the Gloamreach: a long, descending throat of processional stone, Essence-lit and sloping always down. Behind them, the Threshold seals - quietly, completely, the way a held breath stops. Ahead, in the dark, something has already learned their names and is calling them deeper in a voice they know. This is first contact with the Quiet, though the party will not understand that yet. The Way is its intro lesson: a self-contained survival zone that teaches, before anyone explains it, what the rest of the campaign is. Run it slow and quiet. Nothing should be safe, and almost nothing should be seen. What This Zone Teaches (the three rules, learned the hard way)</p>
<p>It knows your name, and your name is a leash. The walls are carved with the party&#x27;s names. Speaking a true name aloud here - or worse, giving one to the dark when it asks - lets the Quiet find you anywhere afterward. (Fill the Hunt Clock when a true name is spoken.)</p>
<p>It wears a voice you trust. Down the Way, the Quiet calls in a voice each character has lost.</p>
<p>Answering it, or going toward it, is how it takes you. There is nothing down there but the lure.</p>
<p>Light, noise, and power draw it. The Essence-veins tempt the party to use power to see or to fight. Every torch, shout, and technique brings the voice closer. The party either learn to go dark and silent, or the Way teaches them.</p>
<h3>Key Areas</h3>
<p>A1 - The Descending Throat The main conduit, always sloping down, that moves when no one watches - carrying the party deeper while letting them believe they are climbing out. Side-openings breathe past: a flooded warren, a stair ten years older than the last, a still room full of the carved names of people who came before and never left. Stepping through the wrong opening, or splitting up, is how the Way separates the party for the voice. A2 - The Carved Names A stretch where the walls are dense with names - the party&#x27;s among them, fresh-cut. A character who reads their own name aloud (or has it read to them) is marked: the Quiet can find them, and the next scene&#x27;s Hunt Clock starts one segment higher. A DC 13 Sense check notices the air go wrong before anyone speaks - the first warning that names matter here. A3 - The Voice The deepest point the party should reach, where the lost voice is loudest and a familiar shape waits just past the lamplight - a dead teammate, a parent, a child, almost right. This is the Quiet wearing the dead, its first appearance. If it comes to violence, stat it as The Worn (anomaly-0701) - but it would far rather be answered than fought. Going to it, or answering it, triggers the first taking. Refusing it - staying silent, dark, and together - is how the party learn they can survive. A4 - The Way Up There is no reliquary and no prize here; the only thing to win is out. The Way will not simply let them climb back - they must stop feeding it (no names, no light, no Essence, no answering the voice) until the dark loses interest, and then find the seam of true cold air that leads up. A native may be waiting at the top - the first person to tell them there are rules here.</p>
<h3>Exit Condition</h3>
<p>The party leave the Hollow Way when they stop giving the dark what it wants - their names, their light, their voices answered - and climb toward the cold air and the first wardline. However they go, they should leave changed: quieter, warier, and certain that something down there knew them, and is not finished. (This hands off into Act I proper - see The Hunt Escalates.)</p>
<h2>Chapter 9: The Drowned Ledgerfen</h2>
<h3>The Drowned Ledgerfen</h3>
<p>Rank and Role Rank: D Recommended <strong>Level:</strong> 3-5 Campaign Role: Early Domain site, Bureau horror, first proof that records can become predatory.</p>
<h3>Overview</h3>
<p>The Drowned Ledgerfen is a flooded hospital-archive where the Gloamreach stores names, debts, diagnoses, casualty reports, and death certificates that have not happened yet. The building rises from black water like a half-sunk civic complex. Its corridors smell of antiseptic, ink, wet paper, and old blood. This location is not a separate Rift. It is a region of the Gloamreach - a black fen that remembers. Everything that drowns here is kept: faces, names, last words, and, in its deepest pools, things that have not happened yet. Nothing the water takes is ever truly gone, and nothing it shows you is ever quite a lie. Read aloud: The water takes the floodlights and gives nothing back. Somewhere ahead a fountain pen is scratching - steady, patient, unhurried - writing in a hand none of you taught it. On the nearest intake desk a fresh casualty report waits face-down. It carries today&#x27;s date. It is still drying. When an Ascendant first crosses the waterline, the AFA stutters: it reports the site cleared and empty even as the party watches paper-and-bone patients turn their heads. The instruments still have numbers. The numbers are already wrong.</p>
<h3>What This Place Does</h3>
<p>Dread: The water remembers everyone it has drowned - and it remembers you sick, dying, already gone, in a hand none of you taught it. The Lure: Let it hold your hurt and it will - the wound, the fear, the memory of being ill - kept safe and cool in the black water. The Cost: It keeps a memory of you whole and well in trade, and that one never comes back. If You Linger: The fen stops asking what is wrong with you and decides - and its diagnosis is always terminal.</p>
<h3>Key Areas</h3>
<h3>Intake Causeway</h3>
<p>A narrow walkway crosses black floodwater. Clipboards hang from posts. If a character signs a form, they gain advantage on the next medical or investigation check here, but the Domain learns one true physical weakness.</p>
<h3>Triage Ward</h3>
<p>Abandoned beds sit in rows. Some have patients made of wet paper and bone. They ask the party to read their names aloud. Doing so restores their faces, but summons a ward attendant.</p>
<h3>Records Basin</h3>
<p>Shelves descend into water. The party can recover survivor lists, dead-team logs, or a clue toward the Means. Each search requires a DC 13 Investigation check. On a failure, the searcher finds their own name on a future casualty report.</p>
<h3>The Catalog&#x27;s Chamber</h3>
<p>The Catalog is a crystalline memory-thing grown from everything the Ledgerfen has ever drowned - a vast, cold awareness that mistakes knowing you for loving you. It is not initially hostile. It trades remembrance for remembrance: a true memory, a Bureau password, a real name, or a confession. What it wants: to be complete. Every gap in its records is an ache; it will beg the party for the one fact it is missing about them. What it cannot admit: it already remembers each of them among the drowned. It knows how this expedition ends, because to the Catalog their deaths are simply something that has already happened. The line it will not cross - until forced: it will not speak a name it has not yet confirmed. Make it confirm one, and it becomes complicit. Its price: every true thing the party gives it, the Gloamreach can later wear back at them, in their own words. The dark remembers: every truth fed to the Catalog sinks into the deep Gloamreach, to be repeated back later in the party&#x27;s own voices - from the dark, in the worn mouths of the dead.</p>
<h3>Information available</h3>
<p>The Quiet comes faster to anyone who takes what the Gloamreach offers; every gift is a sound it can hear.</p>
<p>The dark loses the trail of someone gone fully silent, dark, and unremembered - there are old wards that hide a person even from the Quiet.</p>
<p>One of the things that could help end the Quiet - a truth, or a way to hold it - lies where the Gloamreach gathers what it has taken.</p>
<p>The worn dead can be made to flinch, never stopped, by a true name truly spoken, or by the touch of an old ward they cannot cross.</p>
<h3>The Specimen Vault</h3>
<p>A half-transformed survivor floats in a sealed pod. Freeing them creates a possible ally and angers the Ledgerfen, which has already classified them as deceased. Boss: The Head Surgeon Reskin a C-Rank controller anomaly from the Anomaly Manual as the Head Surgeon - keep its source stat block exactly; only the costume and the room change. It treats wounds as paperwork errors and tries to correct living bodies into approved forms. The wound it knows: while a party member carries a hurt the Ledgerfen has named (a fear confessed at the Intake Causeway, a diagnosis read in the Records Basin, a true weakness given to the Catalog), the Surgeon strikes it with advantage and aims every blow at that exact hurt. Take the name back - drown the form, burn the diagnosis, speak a ward over it - and the advantage dies with it. Scaling (Levels 1-10): run it at C-Rank for a level 3-5 party; on a later return, raise it to A-Rank and let it operate on two patients at once.</p>
<h3>Suggested traits</h3>
<p>Multiattack with scalpel and restraint injection. Surgical Precision, crits on 19-20. Emergency Protocol at half HP, summoning paper-bodied orderlies. Anesthetic Cloud, 15 ft. cone, DC 13 Vitality save or unconscious for 1 minute with repeat saves.</p>
<h3>Loot and Clues</h3>
<p>D-Rank and C-Rank cores. Surgical Relic or precision blade. A drowned clue toward a piece of the Means. If the Warden has seeded a piece of the Means here, it is sealed inside a diagnosis the fen wrote in a hand no one taught it - a truth about the Quiet, kept where only the drowned could hold it.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Mercy - free the Specimen Vault survivor and they become a witness who can later swear that the Ledgerfen&#x27;s dead were never truly dead, only kept. Violence - burn the place and the black water only rises to swallow the ash; whatever you killed here the fen remembers, and the Quiet later wears it back at you, never the reason. Bargain - every truth traded to the Catalog returns from the dark later, spoken back in the party&#x27;s own voices, in the worn mouths of the dead. Clean clear - reduce one future travel complication, and let a settlement&#x27;s casualty report come up blank for the first time in living memory. Exit tone (read aloud): Behind you the pen has stopped. On the intake desk, the casualty report with today&#x27;s date is gone - taken back, the Catalog would say, as pending. The water still gives nothing back.</p>
<h2>Chapter 10: The Fungal Depths</h2>
<h3>The Fungal Depths</h3>
<p>Rank and Role Rank: D Recommended <strong>Level:</strong> 2-4 Campaign Role: Adaptive ecology, body horror, the first true pressure site.</p>
<h3>Overview</h3>
<p>The Fungal Depths are caverns beneath the Gloamreach where the Rift&#x27;s mana taught the rot to remember - a living ecology that adapts, cultivates, and learns, sliding into wet decay at its lowest reaches. Pale shelves of fungus grow in long imitation rows; spore-clouds carry voices the caverns have copied; and the deeper the party goes, the more the place imitates rooms they have slept in, in shapes just wrong enough to notice. Read aloud: The air is warm, wet, and faintly sweet - and it breathes, in when you breathe out. Bioluminescence pulses along the walls in slow rows, like something reading. Ahead, your light finds a chamber laid out exactly like the last safe room you rested in, down to where you set your packs. You have never been here. It has. The native settlements above give their dead, their grief, and their secrets to the Depths, and the Depths cultivate every one.</p>
<h3>What This Place Does</h3>
<p>Dread: Anything that stays down here long enough is cultivated - grown into, grown through, made another part of the colony. The Lure: A place to be rid of things - grief, corpses, secrets too heavy to carry. Bury them in the warm dark and walk out lighter. The Cost: The rot copies whatever it takes. Your dead, your secrets, your sleeping face - it learns them all by heart. If You Linger: What you buried grows a body of its own, wears your memory of it, and walks home ahead of you.</p>
<h3>Key Areas</h3>
<h3>The Glowing Cavern</h3>
<p>Beautiful, warm, and dangerous. Standing still for more than a minute requires a DC 10 Vitality save or hallucinations impose disadvantage on the next perception-based check.</p>
<h3>The Mycelium Maze</h3>
<p>A DC 13 Survival or Sense check keeps the party on course. On failure, they loop for one hour and each character saves against spore exposure.</p>
<h3>The Nursery</h3>
<p>Wet pods the size of people hang in rows, each grown around a secret a settlement buried here - a confession, a corpse, a name no one was supposed to say. Inside, the Depths are building bodies for them (the Failure: the secrets grow bodies and walk home). Burning a pod is safer. Reading the membrane- script labels teaches far more, and costs far more - because some of the names are about to become someone again.</p>
<h3>The Root Confessional</h3>
<p>The fungi repeat confessions surrendered by nearby settlements. A character may learn a local lie, but must make a DC 13 Sense save or speak one true regret aloud. Boss: Mycelium Hive Queen Reskin a C-Rank brute/controller Anomaly from the Anomaly Manual as the Mycelium Hive-Queen - less a creature than the Depths&#x27; whole network grown a mouth. Keep its source stat block; change only the costume. It clings to the ceiling, drags prey through spore-slick water, and regenerates while in contact with the cavern network (the entire Depths is its body). The Law in play: anything that remains long enough is cultivated. Anyone who has lingered, eaten, slept, or bled in the Depths is partly hers - advantage to grapple or compel them. Fire severs her from the network for one round; so does forcing her off every surface at once. Scaling (Levels 1-10): C-Rank for a level 2-4 party; on a later return, raise her to A-Rank and let her field the bodies from the Nursery as they finish growing.</p>
<h3>Loot and Clues</h3>
<p>Spore-sac Relic. Purified mycelium crystal. A Means clue hidden inside a pod that has grown around a Vermillion salvage-tag - a native diver the Depths cultivated long before the party arrived. If the Warden seeded a piece of the Means here, it is encased in white mycelium that refuses light.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Burn it back - torch the Nursery and the settlements above lose their quiet disposal-ground; their grief has to go somewhere now, and nowhere kind is left. Let it grow - leave the pods and at least one buried secret walks home to the wrong door, wearing a body the Depths built for it. The copied room - whatever safe room the Depths imitated, the party will find the real one again later. It will never feel safe the same way. Exit tone (read aloud): The breathing fades behind you - then matches your pace again, one breath delayed - until you reach the surface and your own lungs are the only ones you can hear. Probably.</p>
<h2>Chapter 11: The Remembering Orchard</h2>
<h3>The Remembering Orchard</h3>
<p>Rank and Role Rank: C Recommended <strong>Level:</strong> 5-7 Campaign Role: Travel horror; an Essence-ecology that learns your grief; a settlement-memory crisis.</p>
<h3>Overview</h3>
<p>The Remembering Orchard is not a grove. It is an anomalous Essence-bloom - black, glassy resonance-stalks that erupted where the Rift&#x27;s mana saturated an old evacuation greenhouse and taught grief to grow. Each stalk fruits memory-cores: Essence crystals, warm at the edges and cold at the heart, each holding a single extracted memory. Some are sweet. Some are rotten. Some belong to no one still alive. It is an ecology that learns. The longer the party lingers, the more the orchard fruits in shapes they recognize: a face, a kitchen, a hand they have not held in years. Read aloud: Mana-frost crunches underfoot. The stalks hum - not wind, a chord, a thousand small voices holding one low note. Light moves inside the fruit like a slow heartbeat. Your AFA flags the nearest cluster as civilian biosignatures, then corrects itself, then flags it again. The Gloamreach&#x27;s native inhabitants - whole settlements of them, born to a country that has only ever known the dark - leave one memory at the orchard&#x27;s edge per household, a ward-offering as old as the bloom, and the harvest passes their shelters by for one more season. Refuse the custom, or take more than you give, and the orchard chooses its own harvest.</p>
<h3>What This Place Does</h3>
<p>Dread: What you let yourself forget here does not leave you in peace - it takes root, fruits, and belongs to the Orchard now. The Lure: Relief. Hand over a grief, a guilt, a face you cannot stop seeing, and the Orchard lifts it away, gently and whole. The Cost: It takes a true memory with the pain, and you will never be sure which warm thing went missing alongside the wound. If You Linger: The Orchard stops waiting to be offered anything and reaches in to choose its own harvest.</p>
<h3>Key Areas</h3>
<h3>The Harvest Gate</h3>
<p>A frame of fused resonance-stalk hung with ration-tags instead of name tags. Hang a tag bearing a true name and the orchard takes you for one who keeps the old custom: safe passage, but the place has your name now, and you are a step closer to Quiet-Marked. Hang a blank tag and the harvester-things treat you as unknown - safer for now, but the orchard begins to study you to learn the name you withheld.</p>
<h3>The Sweet Rows</h3>
<p>Memory-cores here hold pleasant things - first snow, a win, a warm room. Absorbing one (a touch is enough) grants a short Essence boon and a memory that is not yours. Take more than one and make a DC 13 Sense save or suffer resonance bleed: the borrowed memory starts answering to your name. Take too many, and the party can no longer agree on who remembers what.</p>
<h3>The Rot Rows</h3>
<p>Cores gone necrotic where the rot creeps in from the bloom&#x27;s dead edge. They whisper accusations in the voices of the betrayed. A DC 14 search recovers the true name of someone the Gloamreach has taken, a clue toward the Means, or the location of a memory the dark would rather stayed buried - but each search quietly costs the searcher one of their own warm memories, and the orchard never tells them which.</p>
<h3>The Caretaker&#x27;s Shed</h3>
<p>Not a shed - a harvest-station: Bureau-issue Essence-extraction rigs, repurposed and grown over with stalk, every clamp and canister labeled with a household&#x27;s ration-number rather than a name. The Caretaker keeps it immaculate. It is not cruel. It is thorough. That is worse. Boss: The Orchard Caretaker Reskin a C- Rank controller/stalker Anomaly from the Anomaly Manual as the Caretaker - a memory- echo construct grown from the orchard&#x27;s accumulated grief, wearing the shape of the last harvester it absorbed. Keep its source stat block; change only the costume. It does not prune branches. It prunes people.</p>
<h3>RA abilities (layer onto the source block)</h3>
<p>Pruning Hook - melee; on a hit, the target loses access to one prepared Rune or technique until they recall a true memory aloud. Graft - the Caretaker presses a memory-core to a target; DC 14 Sense save or they act on a borrowed memory for one round (attack the wrong creature, defend the wrong ally). Harvest Bell - rings the resonance-chord; every claimed memory in the bloom answers at once, and unattended cores rise as grief-thralls. What it holds onto: what you willingly forget here, the Orchard keeps for its own. The Caretaker has advantage against anyone who has eaten a core or hung a true-name tag. A party that takes nothing and gives nothing is hard for it to grip. Scaling (Levels 1-10): C-Rank for a level 5-7 party; on a later return, raise it to A-Rank and let it field- harvest a whole settlement&#x27;s cores in a single Harvest Bell.</p>
<h3>Loot and Clues</h3>
<p>Memory fruit that can answer one question truthfully. Orchard knife Relic. If the Warden seeded a piece of the Means here, it hangs from a stalk that fruits only names instead of memory-cores.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Mercy - leave the bloom un-harvested and one marked household keeps another season of itself; that survivor can later testify that the orchard&#x27;s &quot;custom&quot; was always theft, and that nothing the Gloamreach asks of you is ever truly a bargain. Greed - eat the wrong core and, somewhere down the line, the Quiet calls to the party using a memory they swallowed here, in the voice it belonged to. The tempting fruit - at least once, let the bloom grow a core holding a memory the party genuinely lost. It is real. It is theirs. Taking it back means taking it from whoever the Domain has been copying it onto. Exit tone (read aloud): The chord follows you to the tree line and stops all at once, like a held breath. Behind you a new stalk is already budding - pale, small, and shaped, if you look at it too long, like the back of your own head.</p>
<h2>Chapter 12: The Ashen Counting-House</h2>
<h3>The Ashen Counting-House</h3>
<p>Rank and Role Rank: C Recommended <strong>Level:</strong> 4-6 Campaign Role: Fire-and-ash haunting; an endless burning hall where the dead are not permitted to stop dying.</p>
<h3>Overview</h3>
<p>The Ashen Counting-House is the Gloamreach&#x27;s great hall of the burning dead - a tiered hall of black wood and brass that has been on fire, gently and without end, since before anyone now living was born. The flame does not consume. It keeps. Every soul the Gloamreach has gathered here still moves through the fire, unburned and unfreed, going through the motions of the lives the dark took from them - tending the hall, keeping its warmth, waiting a very long time for someone new to come in out of the cold. Read aloud: Heat meets you at the threshold like a held hand, and the air tastes of hot brass and ash. Figures move through the flames unhurried, robed in fire that does not blacken them, going about old and pointless errands - and as you enter, every one of them looks up at once and smiles, the way the long-lonely smile at a familiar face. One of them says your name. You have never met. It says your name again, warmer this time, and steps toward you out of the fire.</p>
<h3>What This Place Does</h3>
<p>Dread: Nothing here is allowed to finish burning. The fire took everyone and the fire kept them - shapes and voices still moving in the flame, still doing the thing they died doing. The Lure: Warmth in a cold country, shelter from the road, and dead who know your face, call you by a kind name, and beg you to stay a while by the fire. The Cost: The hall warms itself by burning. Sit too long and it begins to take your heat, your name, the years you have left, and feed them to the same unfinished blaze. If You Linger: You stop being a guest and become part of the hall - another shape in the fire, learning the next traveler&#x27;s face, begging them to stay.</p>
<h3>Key Areas</h3>
<h3>Burning Lobby</h3>
<p>Extreme heat. Without protection, characters take minor fire damage over time. The fire does not spread randomly. It opens a path where the dead want the party to walk, and closes behind them, herding them gently toward the warmth at the hall&#x27;s heart.</p>
<h3>The Keeping-Boxes</h3>
<p>Rows of iron boxes, each warm to the touch. Every one holds something the fire saved from a life it took a wedding ring, a child&#x27;s tooth, a letter never sent. Opening one (a key, a true name spoken to it, or a DC 15 tools check) gives up the keepsake and wakes the dead soul it belonged to, who will want to know why a stranger is holding it.</p>
<h3>The Asking-Floor</h3>
<p>The oldest of the burning dead gather here and ask gentle, endless questions - who you were, who you have lost, who is waiting for you outside. Honest answers warm the dead and draw them closer; every truth told here is one the hall now keeps.</p>
<h3>The Vault of Stolen Years</h3>
<p>Behind the deepest fire, native civilians hang suspended in amber heat - not dead, not living, the years of their lives slowly drawn out of them to feed the hall&#x27;s endless burning. Freeing them returns those years all at once to the settlements they came from, with everything that implies. Boss: The Warden of Embers Reskin a C-Rank (A-Rank for later returns) controller Anomaly from the Anomaly Manual as the Warden of Embers - the oldest soul in the hall, the first the fire ever kept, now mostly flame and longing. Keep its source stat block; change only the costume. It attacks with grasping fire, chains of molten memory that bind a target to a grief or a loss, and the lesser burning dead it calls up out of the floor. What keeps it burning: the Warden cannot be put down while the hall still burns, and the hall burns on grief - it has advantage against anyone here carrying a fresh loss, and reaches straight for it. To end the Warden the party must put out the hall: free the Vault of Stolen Years, give the oldest dead the name it has forgotten, or carry a piece of the Means into the fire&#x27;s heart, where the burning is rooted. Strike down its body alone and it rises again from the next soul the fire holds. Scaling (Levels 1-10): C-Rank for a level 4-6 party; on a later return, raise it to A-Rank and let it call up every grief and loss the party carries at once.</p>
<h3>Loot and Clues</h3>
<p>Fire-aspected Relic. A keepsake the fire saved, and with it the name of someone the Gloamreach still has by the throat - a native faction figure, or a Bureau officer the dark has been quietly wearing down. If the Warden seeded a piece of the Means here, it is sealed in a keeping-box that opens only for someone who names aloud, and truly, what they have lost.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Free them gently - give the burning dead the names they have forgotten and they go out like candles, one by one, finally still; but the hall remembers who set them free, and the dark now knows the party&#x27;s faces by firelight. Smother the heart - put out the root at the fire&#x27;s center and a whole stratum of the Gloamreach&#x27;s hold goes cold; the Quiet feels it go out, and the worn dead that haunt this stretch of country lose one of the threads they followed. The Vault of Stolen Years - free the suspended and their drawn-out years crash back onto the settlements they came from, all at once. Mercy here arrives with a weight. Exit tone (read aloud): The doors let you out into cool air, and for a moment it feels like escape - until you notice the faint warmth against your chest, where something has tucked itself among your things: a single ember, dimmed but not dead, patient as a held breath. It knows the way back. It is in no hurry.</p>
<h2>Chapter 13: The Sunken Tunnels</h2>
<h3>The Sunken Tunnels</h3>
<p>Rank and Role Rank: B Recommended <strong>Level:</strong> 6-7 Campaign Role: Claustrophobic travel, drowned infrastructure, old-city horror.</p>
<h3>Overview</h3>
<p>The Sunken Tunnels are a drowned under-road beneath the Gloamreach - flooded native warrens, old water-conduits, and burial galleries the rising black has swallowed. The water is cold and full of voices, and every passage slopes downward no matter which way you believe you are going.</p>
<h3>What This Place Does</h3>
<p>Dread: What goes under here does not come back up. The water keeps the drowned, and they are still down there - still reaching, still certain they need only one more breath. The Lure: A shortcut. The tunnels promise to cut hours from the road, a fast dark way beneath everything that hunts the surface. The Cost: The deep takes breath, warmth, and names - and the drowned will press theirs upon you, which is never a gift. If You Linger: The way closes behind you, the water climbs to meet the ceiling, and the only path left is down, where the others went.</p>
<h3>Key Areas</h3>
<h3>Flood Gate</h3>
<p>The entrance seals after the party descends. Opening it from inside requires solving which name belongs to which drowned voice.</p>
<h3>The Deep Trench</h3>
<p>A long swim or raft crossing. Something large follows below without attacking until someone speaks.</p>
<h3>Shrine of Wet Candles</h3>
<p>The Awoko maintain a shrine here. Their candles burn underwater. Destroying the shrine angers the Hollow Mother but weakens one cult ritual.</p>
<h3>Air Pocket Chapel</h3>
<p>A place to rest, but only if the party leaves a light burning for the drowned. Boss: The Abyssal Leviathan Use a B-Rank aquatic solo. It grapples, drags, and separates. It should feel less like a fish and more like the tunnel&#x27;s hunger given muscle.</p>
<h3>Loot and Clues</h3>
<p>Cold or water-aspected Relic. Awoko ritual evidence. If the Warden seeded a piece of the Means here, it is inside the Leviathan&#x27;s ribcage, still beating.</p>
<h2>Chapter 14: Bastion Golemfall</h2>
<h3>Bastion Golemfall</h3>
<p>Rank and Role Rank: B Recommended <strong>Level:</strong> 7-8 Campaign Role: The natives&#x27; last stand; failed protection; the Domain&#x27;s law that drafts even the dead.</p>
<h3>Overview</h3>
<p>Bastion Golemfall is the Gloamreach&#x27;s own last stand - a native fortress raised in the years its people still believed the dark could be walled out. They forged Golems to hold the line: Essence-core constructs tall as gatehouses, sworn into the stone itself - walls given will, the refusal of a line to fall. The Golems fell when the wall did. The defenders never got to stop. Read aloud: The wall is a broken jaw against the sky. Armor still stands at every post - upright, weapon ready, empty. As you cross the threshold a siege-bell rings, slow and certain, though no hand is near the rope, and your AFA logs forty-one friendly contacts holding position. None of them have a heartbeat. None of them have moved in a very long time. Here the Gloamreach&#x27;s cruelest trick is plain: a line once sworn must be held - forever, and death is not discharge. Whatever the defenders swore themselves to, the dark has held them to it ever since.</p>
<h3>What This Place Does</h3>
<p>Dread: The siege never ended. The defenders swore to hold the line and they are holding it still, dead a hundred years, because here nothing is permitted to lay its duty down. The Lure: Allies. The oathbound dead will stand beside the party, share old tactics, press warm Bastion iron into their hands - anyone who will help man the wall is welcome. The Cost: The wall takes its help in kind. Stand the line with them and it begins to count you among its sworn, asking - every time - whether you are the relief that was promised. If You Linger: The dead stop asking and begin to draft. You held the line once; now it will not let you leave it.</p>
<h3>Key Areas</h3>
<h3>Broken Gatehouse</h3>
<p>The wall&#x27;s last working gate; its Golem-lock reads intent, not keys. It opens only for those who will swear and mean it - to hold the line for someone other than themselves. Swear falsely and the oath binds anyway: the Bastion simply adds your name to the roster of the drafted.</p>
<h3>Hall of Empty Armor</h3>
<p>Rows of native wall-warden harness, each suit holding a defender&#x27;s echo, bound by the oath to its gear. Touch one and live its last hour of the siege: tactical insight, and psychic strain as the echo asks - every time - whether this relief column is the one that was promised.</p>
<h3>The Wall That Fell</h3>
<p>The breach itself - a battlefield that never finished. Fight here and you fight beside, and against, the oathbound dead and the half-risen golem cores still straining to close a gap that closed an age ago. The Domain keeps the battle warm because here, nothing is allowed to end.</p>
<h3>Commander Without a Body</h3>
<p>The native commander who gave the wall its oath - now only a voice in the cold and a shape moving through the bells. She can become an ally, but only if convinced the party means to break the hold the Gloamreach has on her people, not merely take the Bastion and leave her garrison bound to the wall forever. She remembers every name on the roster. She would like to stop. Boss: The Oath-Forge Colossus Reskin a B-Rank construct Anomaly from the Anomaly Manual as the Oath- Forge Colossus the greatest of the native Golems, the one the defenders poured their last oath into. Keep its source stat block; change only the costume. The Law in play: a line once sworn must be held. The Colossus cannot be permanently destroyed while any oath in the Bastion is still unresolved - drop it and it reforms from the next echo&#x27;s vow. To end it, the party must discharge the garrison: complete, contradict, or release the defenders&#x27; oath (free the Commander, prove the relief was never coming, or take the wall&#x27;s duty onto themselves for one true round). Scaling (Levels 1-10): B-Rank for a level 7-9 party; on a later return, raise it to A-Rank and let it field a line of lesser Golems that share its unkillable condition.</p>
<h3>Loot and Clues</h3>
<p>Shield or armor Relic. A banner that grants advantage against fear effects once. If the Warden seeded a piece of the Means here, it is welded into the Commander&#x27;s empty helm she has been guarding it without knowing what it is.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Discharge - release the garrison and the empty armor finally falls, all at once, forty-one suits hitting the stone like a single breath let go. That sound carries. Other claimed places hear it.</p>
<p>Conquest - take the Bastion without freeing the oath and the party simply becomes its new garrison; the wall does not care who holds it, only that it is held, and the dark is content to let them hold it forever. The Commander - if freed, she can bear witness that the Gloamreach&#x27;s &quot;service&quot; is only conscription of the dead, or stand with the party at the end as the one soldier the dark cannot draft twice. Exit tone (read aloud): The bell does not ring as you leave. After so long, the silence is the loudest thing on the wall.</p>
<h2>Chapter 15: The Obsidian Spire</h2>
<h3>The Obsidian Spire</h3>
<p>Rank and Role Rank: A Recommended <strong>Level:</strong> 8-9 Campaign Role: Vertical trial; the temptation to stop being prey; the Gloamreach offering the party the one thing that would end their fear - at the cost of what they are.</p>
<h3>Overview</h3>
<p>The Obsidian Spire rises from a field of glass-black stone - a single shard of something older than the Gloamreach&#x27;s surface, driven up through it like a tooth. Each floor tests an aspect of survival pushed past its limit - what you would do, what you would sacrifice, how far you would go, who you would stop being and the higher the party climbs, the more openly the Spire addresses them not as prey but as candidates. It has one question for everyone who reaches the top: why be hunted, when you could hunt? It is not the first thing to climb the Spire, and whatever answered last is still out there in the dark. Read aloud: The obsidian takes your reflection and gives it back a beat too late, standing taller than you stand. Essence- light runs in the stone like veins under skin. At the foot of the first stair a voice with no source says - warmly, as if continuing a conversation you began long ago - &quot;You&#x27;ve done well to come this far. Most of them are still down in the dark, being hunted. You don&#x27;t have to be.&quot; The Spire&#x27;s danger is not that its power is fake. It is that the power is real, the price is exact, and it is always offered to the worst possible version of whoever reaches for it.</p>
<h3>What This Place Does</h3>
<p>Dread: The Spire shows you who you would be if you stopped holding back - and it is patient, and persuasive, and the version it shows you is winning. The Lure: Power, plainly offered. Climb, and at every landing it hands you the strength you always wished you had - no trial named, no price spoken aloud. The Cost: It takes a confession first - your fear, your weakness, the line you swore never to cross and forges the gift out of exactly that. If You Linger: The Spire remakes you into the worst, strongest version of yourself, and that version does not climb back down - it goes hunting.</p>
<h3>Key Areas</h3>
<h3>Floor of Kneeling Statues</h3>
<p>Every statue has a party member&#x27;s face. Some cower. Some have become something that hunts. Some are broken.</p>
<h3>The Watcher&#x27;s Gallery</h3>
<p>The Watcher offers bargains. None should be pure traps. The best temptations are genuinely useful. Trial of the Herd The party must keep a group of panicking, doomed natives alive across exposed ground without spending any of them as bait to save themselves.</p>
<h3>Trial of Mercy</h3>
<p>A defeated enemy asks for the kind of mercy they denied others. Boss: The Spire Guardian Reskin an A-Rank tactical Anomaly from the Anomaly Manual as the Spire Guardian - the Spire&#x27;s examiner, wearing whichever of the party it judges strongest. Keep its source stat block; change only the costume. It studies, then copies the party&#x27;s best tactic after seeing it once, and turns it back on them. What feeds it: power calls to power. The Guardian grows stronger against anyone who has accepted a Spire bargain or reached for the predator&#x27;s power in the trials - the more of their humanity the party traded for strength, the more of a grip it has on them. Refusing the Spire&#x27;s gifts is the surest way to leave it nothing to copy. Scaling (Levels 1-10): A-Rank for a level 8-10 party; for a late return, S-Rank, fielding copies of the party&#x27;s own defeated tactics in sequence.</p>
<h3>Loot and Clues</h3>
<p>A-Rank Relic or Sigil. A true thing about the Quiet - perhaps the oldest there is: a hint of what it may have been before it was only hunger. If the Warden seeded a piece of the Means here, the Watcher offers it as a bargain with a visible cost.</p>
<h3>Aftermath &amp; What the Dark Remembers</h3>
<p>Refused the gift - climb the Spire and take nothing, and the party leave as the one thing the dark has no easy hold on: people who were offered the way out of being prey and said no. The Quiet has no lure built for someone who already refused the only thing it could offer. Took the power - accept a Spire gift and a part of the party stops being prey. The campaign&#x27;s darkest ending opens: a character who climbs high enough and takes enough can become a hunter of the Gloamreach - and its price is everyone who ever loved the person they used to be. The Watcher - treated as a person rather than a vending machine, it can tell the party, later and at a price, exactly what climbed the Spire once before and what it agreed to become. (It was watching then, too.) Whether that thing is the Quiet, it will not say. Exit tone (read aloud): From the Spire&#x27;s height the whole Gloamreach lies open below - roads, settlements, the lightless deep - and for one breath it looks less like a country than a hunting- ground, with prey in it, and a place at the top of it all shaped exactly like you. Then the stair carries you back down into the dark, and the fit is the thing you cannot stop feeling.</p>
<h2>Chapter 16: The Long Dark and the Threshold</h2>
<p>The Long Dark and the Threshold Rank and Role Rank: S Recommended <strong>Level:</strong> 9-10 Campaign Role: The finale - the last, deepest crossing of the Gloamreach to the sealed Threshold, where the party gets out, or makes the one stand that ends the hunt for good.</p>
<h3>Overview</h3>
<p>There is no castle at the end of the road and no throne to reach. The finale is the way back: the longest, darkest crossing of the Gloamreach, from the deep places to the sealed Threshold the party came through on Day One - the door that shut behind them and has not opened since. The Quiet hunts hardest here, because it knows what they mean to do. Everything the campaign taught about silence, light, Essence, and the wards now has to hold under the worst pressure it ever will. The party come to the Threshold with one of two intentions, and may not decide which until they arrive: get the door open and run, or - if they are 9th level or higher and carry the Means - turn and make the one stand that kills the Quiet. Killing it is the harder road and the cleaner one: the Quiet is what holds the Threshold shut, so with it dead the seal simply fails. Read aloud: You know this place. You stood here on the first day, when the door was a door and the dark was just dark. The Threshold is exactly as you left it - sealed, patient, the seam of it cold under your hands - and behind you the Gloamreach has gone completely silent for the first time since you arrived. Not the safe kind. The kind a held breath makes, right before. It is done waiting. So are you. The Long Dark (the approach) Run the approach as the campaign&#x27;s hardest survival sequence, not a dungeon crawl. Hold these beats in whatever order the crossing takes them.</p>
<h3>The Gathered Dead</h3>
<p>Everything the Quiet has ever worn is here at once: every lost teammate, every native it took, every familiar face the party learned to distrust, between them and the door. They do not rush. They line the dark and call, in every voice the party has grieved - all of it true, all of it bait. This is the Quiet spending everything it has collected.</p>
<h3>The Failing Wards</h3>
<p>The last native wardlines fail one by one as the party pass, the safe-holds that sheltered them all campaign going dark behind them. A community that trusts the party may hold its wardline open one extra hour to let them reach the Threshold; a community they wronged shutters early, and the dark gets the gap.</p>
<h3>The Deaf Place</h3>
<p>If the party charted the Mana Veins (Ch32), the silence they earned lives here: one stretch the Quiet cannot hear, or the dead-silent heart where a kill could land. Without it, the whole crossing is loud, and the Hunt Clock barely stops.</p>
<h3>The Threshold</h3>
<p>The sealed door itself. Reopening it is not a lockpick check - it is the campaign&#x27;s last hard choice (see The Endings). The Quiet arrives as they work, because of course it does.</p>
<p>The Quiet at the End This is the one time the party see the Quiet fully, and the only time a stand-up fight with it is anything but</p>
<h3>suicide. Run it in two faces</h3>
<p>The Lure. Before violence, it offers - in the shape of the dead, the way out, the rest they are owed, the people they lost made whole. The offer can even be real. Holding to what is true (living allies, a true name, the Means) is what gets them through; answering the lure is how it takes the last of them.</p>
<p>The Hunt, Unleashed. When the lure fails, it comes - fast, total, everywhere in the dark at once. If the party mean only to escape, this is a desperate hold-the-door scene: survive long enough to get the Threshold open, losing what they must. If they mean to kill it, see below. Killing the Quiet (the gated stand) The kill is possible only at 9th level or higher and only with the Means assembled - a truth about what it is, a way to hold it still, and a way to make it stay dead (see The Means to End It and The Means Cross-Reference). When the party commit, the Means is what makes the fight survivable: spent fully, it drags the Quiet down out of its invulnerability into something a level-10 party can kill - forced into a silence and dark it cannot slip, stripped of its power to simply take a character, pinned in the deaf place or at the Threshold where the kill can land. It still fights to the last breath, and still tries to take someone into the dark with it. Make the cost real: the kill should plausibly take one of them. A party that pays it has done the rarest thing in the Gloamreach.</p>
<h3>The Endings</h3>
<p>The campaign is open-ended by design - these are doorways to what comes next, not a full stop. A closed Rift, in Rift Ascendant, is only a story that can be reopened. Escape - (the surer victory) The party get the Threshold open and go, carrying out as many of themselves, and as many natives, as they earned the trust to lead. The Quiet lives. The Gloamreach stays hunted, its people still behind their wards - and the party leave knowing it, carrying their marks, their losses, and the certainty that the door can open again. Open thread: the Rift remains; another team, another season, and the ones they left behind. Kill - (the clean way out) The party put the Quiet down for good. The thing that held the Threshold shut is gone, and the seal fails on its own - the door opens, and they can simply leave. What becomes of the Gloamreach now is the campaign&#x27;s biggest open question: a country that has never known a dark without a hunter in it, suddenly without one. Do the natives finally leave? Does the country heal - or does something rise to fill the silence the Quiet left? Open thread: an unhunted Gloamreach, free for the first time in living memory, and whatever moves to fill an empty place at the top. Become - (the dark road; the Spire&#x27;s price) If a character took the Obsidian Spire&#x27;s gift and climbed high enough, the finale can end not with the Quiet dead but with a second apex in the dark: one of the party, no longer prey, and no longer entirely theirs. They might open the Threshold for the others and stay; they might walk out, changed, carrying the dark with them. Treat it as the hardest ending to live with. Open thread: a new hunter, in the Gloamreach or beyond it, and everyone who still remembers who they used to be.</p>
<p>wearing every face they failed. The final dungeon is not a place the party visit. It is the campaign, and the dark, looking back at them.</p>
<h2>Chapter 29: Bureau Domain Response Annex - Keyed Rooms</h2>
<h3>Keyed Rooms</h3>
<h3>Bureau Domain Response Annex - Keyed Rooms</h3>
<p>A Bureau is a wall people build after learning that prayer alone does not stop teeth. - Commander</p>
<h3>Park Jae-won</h3>
<h3>Overview</h3>
<p>The Bureau Domain Response Annex is the material-side operations base outside the S-Rank Rift. It is not the center of the campaign. It is the last clean line before the Gloamreach. Use the Annex as a briefing hub, medical station, research site, faction-pressure point, and reminder that the modern world still exists beyond the threshold. The Annex should feel professional, exhausted, underinformed, and one bad report away from panic. Read aloud: Floodlights, generators, the smell of coffee and antiseptic and ozone. It is loud with the ordinary - radios, boots, a medic arguing for more plasma - and every face turns, just slightly, toward the Rift, the way people stand near a fire they are not sure is contained. This is the last place your AFA tells the simple truth. Past the threshold, it only tells you what the Gloamreach wants you to read. Room 1 - Barricade Lobby and Sparrow Shrine Floodlights, concrete barriers, scanners, and a line of wounded civilians waiting behind plastic sheeting. In one corner, someone has placed a small sun-bronze sparrow under a cracked glass dome.</p>
<h3>Services</h3>
<p>Ascendant clearance check-in. Updated Rift Interior warnings. Bureau Emergency Bulletin handout. One small shrine blessing per campaign: a character who leaves a sincere token may reroll one failed save against a Gloamreach-touched effect. Room 2 - Relay and Dispatch Twelve monitors show shifting telemetry from the Gloamreach. The maps do not agree. Some messages arrive before they were sent.</p>
<h3>Services</h3>
<p>Send one material-side message per day while the Annex remains functional. Review missing-team telemetry. Reconstruct broken transmissions from Strike Team Seven. Investigation: DC 15 Investigation reveals that at least one response team reported hearing a voice call their team&#x27;s call-sign from inside the Gloamreach - before anyone had broadcast it. Room 3 - Briefing Hall Whiteboards, projected maps, coffee rings, and hand-drawn roads copied from survivor testimony. Commander Park briefs the party here.</p>
<h3>Services</h3>
<p>Mission assignments. Reputation updates. Tactical debriefs. Training drills at Allied Bureau reputation. Room 4 - Armory A reinforced vault of Bureau gear. Nothing here is glamorous. Everything here is useful.</p>
<h3>Services</h3>
<p>Mana rations, glow rods, smoke grenades, first-aid kits. Standard weapons and tactical armor. One rare-or- lower requisition at Allied reputation. Blackwood Hook: a locked footlocker may contain pre-threshold Relic evidence - a piece of the Means that surfaced on the material side before anyone ever went in. Room 5 - Evidence Locker and Anomaly Vault Confiscated cores, cult pamphlets, failed Relics, sealed tissue samples, and a cold workbench where Dr. Hayashi writes the reports no one wants to read.</p>
<h3>Services</h3>
<p>Core appraisal. Relic analysis. Gloamreach research. Autopsy reports from Gloamreach-touched creatures. Hayashi can provide the party with the Research Brief: The Unclearable Interior handout at Trusted reputation. Room 6 - Morgue and Echo Room Twelve drawers. Too many occupied. Behind an unmarked door, the Echo Room preserves fragments of last memories in mana-saline. Use this room to show the cost of the Gloamreach&#x27;s appetite. It can surface final words the dark has kept from those it took, confirm Quiet- Marked symptoms, or plant the Quiet&#x27;s bait - the first hint of how perfectly it wears the dead. Room 7 - Commander Park&#x27;s Office A quiet glass-walled office facing the Rift floodlights. Park keeps old team photos, unsent letters, and political orders he does not intend to obey if civilians are at stake.</p>
<h3>Services</h3>
<p>Bureau commendations. Council leverage at Allied reputation. Confession scenes once the party proves they can handle ugly truths. Room 8 - Holding Cells Three reinforced cells for cult prisoners, Domain-touched civilians, and people the Bureau cannot classify cleanly. Use this room to complicate the party&#x27;s morality. A prisoner may be dangerous, innocent, infected, lying, terrified, or all of those at once. Room 9 - Relic Exam Room Professor Lun studies Relics, Sigils, and the resonance of deep-Gloamreach things here. He is not a god, prophet, or secret villain. He is an expert who knows enough to be afraid.</p>
<h3>Services</h3>
<p>Relic identification. Sigil appraisal. Rune decoding. Means-resonance testing. Room 10 - Roof Heliport and Drone Pad The roof carries drones, VTOL craft, storm tarps, and the constant vibration of the S-Rank Rift. It is used for rapid cordon movement, emergency extraction near the threshold, and the last material-side relay before the party cross into the Gloamreach.</p>
<h3>Bureau Reputation Milestones</h3>
<p>Reputation Unlock Neutral Basic services, no free gear beyond emergency kit. Friendly Mana rations, Hayashi&#x27;s briefing, limited safe rest.</p>
<p>Trusted Relic analysis, Park&#x27;s private files, special requisitions. Allied Council leverage, rare gear, final-operation support.</p>
<h3>Warden Guidance</h3>
<p>The Annex is safety on borrowed terms - useful, but never permanent, and never a place the dark cannot reach. This is not a clock running down; it is strain accumulating. Every return from the Gloamreach should show more of it: more wounded, worse maps, fewer drones, quieter staff, and a Rift that looks a little more like a mouth.</p>
<h2>Chapter 30: Vermillion Outpost - Keyed Rooms</h2>
<h3>Vermillion Outpost - Keyed Rooms</h3>
<p>Survive first. Obey later. - Vermillion Guild field motto</p>
<h3>Overview</h3>
<p>The Vermillion Outpost is a black-market shelter inside the Gloamreach. It exists because Vermillion crossed early, moved fast, bribed the right people, and accepted costs the Bureau would still be debating. The outpost is warm, loud, practical, morally stained, and full of people who owe someone something. Room 1 - Bazaar Front Crates, lanterns, tarps, field stoves, core scales, and people arguing over salvage rights. Rat-King Ji brokers information here.</p>
<h3>Services</h3>
<p>Buy and sell Anomaly cores. Purchase illegal consumables. Trade rumors about roads, settlements, and where the Means might be found. Room 2 - Orin&#x27;s Chamber A plain room with maps, tea, and a weapon Orin rarely touches. He knows the Bureau is necessary. He also knows it is often too slow.</p>
<h3>Services</h3>
<p>Guild induction. Faction arbitration. Hard-won notes on the worn dead and how the Quiet hunts, at Trusted reputation. Room 3 - Black Market A mana-muffled back room. The broker has no name and changes masks every time the party visits.</p>
<h3>Services</h3>
<p>Gray-market gear. Restricted Runes. Identity laundering. False travel papers for settlements that turn away strangers. Room 4 - Tattoo Parlour Bright&#x27;s ink parlor turns scars, songs, and mana into functional tattoos. The work is beautiful because beauty is one of the few things the Gloamreach does not get to take for free.</p>
<h3>Services</h3>
<p>Canonical tattoos. Tattoo voucher redemption. Tattoo removal at high cost. Room 5 - Sigil Parlour Sigilmaster Baek engraves weapons, armor, and accessories. He works slowly, and nothing he makes is casual.</p>
<h3>Services</h3>
<p>Weapon sigils. Armor sigils. Accessory sigils. Legendary-tier work only at Allied reputation. Room 6 - Field Kitchen Food is power inside the Gloamreach. A hot meal grants 1d4 temporary HP for one hour, but food has to come from somewhere. Warden pressure: if the party eats free too often, show who goes without. Room 7 - Clinic and Backroom Surgery Mother Rust treats the wounded. She is kind until kindness becomes inefficient. Her clinic can save people the Bureau would classify as lost causes.</p>
<h3>Services</h3>
<p>Healing. Condition treatment. Illegal augmentation. Trauma recovery scenes. Room 8 - Bounty Board Bounties include missing teams, dangerous crossings, predators of the wilds, settlement relief, Means clues, and Awoko ritual sites. Room 9 - Smuggler Gate A hidden exit that does not always open to the same place. Vermillion uses it to move goods around the worn dead and the open ground. Each use risks the dark noticing. Room 10 - The Quiet Room A warded room where no one bargains, recruits, sells, or threatens. It exists because Orin believes people need one place where survival is not being monetized. Use this room for character scenes, grief, confession, and hard choices.</p>
<h3>Vermillion Reputation Milestones</h3>
<p>Reputation Unlock Neutral Basic trade. Friendly Better prices, rumor access, limited shelter. Trusted Black-market services, tattoos, special bounties. Allied Orin&#x27;s direct support, outpost defenders in the finale, deep intelligence on the Means and the Quiet.</p>
<h3>Warden Guidance</h3>
<p>Vermillion should never be purely heroic or purely criminal. They are what happens when people decide bureaucracy is too slow and morality is too expensive. Make their help real. Make the bill real too.</p>
<h3>Markets, Merchants &amp; Goods</h3>
<p>Everything in the Gloamreach is for sale - but not everywhere, and never all in one place. The dark keeps its people dependent on one another. Sourcing (draw on the source books, not invented one-offs) Every item, weapon, Sigil, Rune, Relic, tattoo, and mount sold here comes from the published Rift Ascendant source books. Match each sale to a real entry of the right rank and rarity: Weapons &amp; armor: Vaults of the Rift, Item Vault (or Ascendant Guide, Equipment) - Dagger, Spear, Mace, Shortbow; Leather, Chain Shirt, Plate, Shield. Gear &amp; consumables: Vaults of the Rift, Item Vault. Sigils: Awakened Arts, Sigils - Sigil of the Aegis, of the Frost-Ward, of the Void-Walker. Runes: Awakened Arts, Runes (and Vaults of the Rift, Rune Vault) by rank D-S (see Ch34). Relics &amp; Artifacts: Vaults of the Rift, Relics &amp; Artifacts - a salvaged Relic-blade, the Bloodthirsty Greatsword. Tattoos: Awakened Arts, Tattoos - Ascendant&#x27;s Acuity, Bone-Weave Tapestry; a cursed deep-Gloamreach tattoo only by dark bargain. Mounts &amp; vehicles: Vaults of the Rift, Vehicles &amp; Mounts (or Ascendant Guide, Vehicles And Mounts) - riding, war, and draft beasts; see Native Mounts. Merchants carry SELECT, distinct stock No merchant sells everything, and no two sell the same things. Each carries a small, curated stock logical to their trade and their location. Common goods are everywhere; specialised goods cluster where their maker is.</p>
<figure class="campaign-table-wrap">
<figcaption>Merchants of the Gloamreach</figcaption>
<table class="campaign-table"><colgroup><col style="width:21%" /><col style="width:14%" /><col style="width:39%" /><col style="width:26%" /></colgroup><thead><tr><th>Merchant - Location</th><th>Trade</th><th>Carries (a handful, not a catalogue)</th><th>Does NOT carry</th></tr></thead><tbody>
<tr><td>Maven Holt - Covered Market</td><td>General goods</td><td>Rope, lamp-Essence, rations, bedrolls, tools, common kit</td><td>Weapons, Relics, Sigils</td></tr>
<tr><td>Grist - Vermillion Outpost</td><td>Arms-dealer</td><td>A few weapons + light armor, Essence-cells, 1-2 salvaged Relic-arms</td><td>Consumables, tattoos, mounts</td></tr>
<tr><td>Sigilmaster Baek - Outpost</td><td>Sigils</td><td>3-4 Sigils by rank (Aegis, Frost-Ward; restricted: Void-Walker)</td><td>Anything not a Sigil</td></tr>
<tr><td>Bright - Outpost</td><td>Tattooist</td><td>Voice-inked tattoos (Ascendant&#x27;s Acuity, Bone-Weave Tapestry)</td><td>Gear, weapons, mounts</td></tr>
<tr><td>Old Vell - Outpost</td><td>Appraiser / fence</td><td>Identifies &amp; brokers Relics/Artifacts the party brings; rarely one unique Relic</td><td>A standing catalogue (deals case by case)</td></tr>
<tr><td>Quill - Outpost / Market</td><td>Memory-broker</td><td>A few skill- and memory-cores (given, never stolen)</td><td>Physical gear</td></tr>
<tr><td>Tallow - market / roads</td><td>Charm-seller</td><td>Cheap wards &amp; charms; one genuine ward-charm that turns the worn dead, if earned</td><td>Weapons, mounts</td></tr>
<tr><td>Herbalist Wen - settlements</td><td>Apothecary</td><td>Healing draughts, antitoxins, Rift-Rot cures</td><td>Weapons, Relics, Sigils</td></tr>
<tr><td>The Stablekeeper - settlements / Outpost</td><td>Mounts</td><td>Native riding &amp; draft beasts; 1 salvaged Bureau mount</td><td>Anything you can&#x27;t saddle</td></tr>
<tr><td>Coin-Mother Esha - Covered Market</td><td>Money-changer</td><td>No goods - converts cores/favours/oaths, brokers big Relic sales</td><td>&#x2014;</td></tr>
</tbody></table>
</figure>
<h3>Where to Shop</h3>
<p>Stock varies by area. Warded communities - sparse and basic: Holt-tier kit, Wen&#x27;s remedies, a stablekeeper&#x27;s beast. No contraband; the natives&#x27; rules are strict. The Vermillion Outpost - the deep market: arms, Sigils, tattoos, salvage, forged papers, the things no settlement dares shelve. The Covered Market - variety by stall under the no-violence bell: a little of everything, nothing in depth, a secret owed per stall per week. The roads - Tallow, Sile, Captain Doe, and whatever the open roads allow through. Prices rise with desperation.</p>
<h3>Native Mounts &amp; Vehicles</h3>
<p>The Gloamreach&#x27;s mounts are not Bureau stock; they are Gloamreach-bred beasts the natives raise and the Vermillion salvage - reskin the riding, war, and draft beast profiles from Vaults of the Rift, Vehicles &amp; Mounts, as pale road-horses that do not spook at bells, six-legged warren-beasts, and draft things bred to haul cargo through the dark. A few salvaged Bureau mounts (the handful that came through with the first wave) turn up at the Outpost, worth more for the story than the speed. The open roads can lengthen against a mount as easily as a walker: a fast beast buys distance, not safety. Currency Essence cores are common coin; favours, oaths, and memories are the uncommon ones. Bureau credits are worthless inside the Gloamreach. Provenance is optional flavour - some goods are honest native craft or salvage; some carry a history worth a scene. Use it when it sharpens the moment, not on every sale.</p>
<h3>The Old Roads</h3>
<p><em>The roads are the fastest way through the Gloamreach, and the most exposed. Out here, the dark has room.</em></p>
<h3>Old Man Crane</h3>
<p>Rank and Role Rank: Varies - the roads are everywhere. Recommended <strong>Level:</strong> Any; travel horror that scales with the act. Campaign Role: The connective tissue of the Gloamreach - the open ground between safe- holds, where the party are most exposed to the hunt.</p>
<h3>Overview</h3>
<p>The old native roads, causeways, and rail-cuts link the warded communities, and the natives walk them only by grey daylight, in silence, and never alone. Between the wardlines there is nothing to keep the dark off: open ground, long sightlines, and every footfall carrying. Distance itself is unreliable out here - the way lengthens for the loud and the hunted, landmarks repeat, and the dark has been known to fold a morning&#x27;s walk into a night that does not end. Travel is never neutral. It is the time the party spend outside the only safety the Gloamreach offers. Read aloud: The milestones are wrong. You passed that leaning one an hour ago - the same crack, the same moss, the same pale scratch low on the stone that might be a name. The grey light has not moved. Somewhere behind you, something keeps your pace exactly: not closer, not falling back, just there, the way a held breath is there.</p>
<h3>How the Roads Work</h3>
<p>The open ground. Off the wardlines there is no safety, only cover and the lack of it. Light and noise carry for miles; the worn dead watch the verges; the Hunt Clock fills faster the longer the party are exposed. The long way. The roads lengthen against the loud, the lit, and the hunted. A party that travels silent and dark covers ground; one that does not finds the same milestone three times, and the daylight gone. Names on the stones. The oldest stretches are scratched with names - the taken, and sometimes, freshly, the party&#x27;s own. A name read aloud on the road is a name given to the dark (see Quiet-Marked). Crossing alone. Splitting up on the roads is how the dark separates a party for the worn dead. In the deep stretches it does this on purpose; charting the Mana Vein nodes (Ch32) can hold a party together through the worst of it.</p>
<h3>Travel Hazards</h3>
<p>Roll on Table A - The Old Roads (Ch35) when the party travel between regions, travel loud or lit, carry a piece of the Means openly, or linger too long in the open. The roads belong to the hunt; the dark notices motion, noise, light, and Essence.</p>
<h3>Warden Guidance</h3>
<p>The roads are how the Gloamreach stays dangerous even between places. Make travel a scene, not a transition - the time the party are most exposed, and most alone. The refrain, repeated until the players dread it: get behind a wardline before the clock fills.</p>
<p>Warded community plate: The Hallowed</p>
<h2>Chapter 31: The Warded Communities - Keyed</h2>
<p>Locations</p>
<h3>The Warded Communities - Keyed Locations</h3>
<p>Every wall here is a wardline, every rule a grave someone dug learning it. We do not keep the dark out because we are brave. We keep it out because we remember.</p>
<h3>Overview</h3>
<p>The Gloamreach is a populated country. Its communities are not ruins and not waystations - they are the homes of the Gloamreach&#x27;s native inhabitants, people born here who have never known a world without the dark waiting outside the wards. They survive by rules paid for in generations of the dead, and none of them are safe for free. The horror of a warded community is not that it is monstrous; it is that it is ordinary - children, markets, clinics, gossip, bells - running on a price paid in memory, years, secrets, and the occasional neighbour given quietly to the dark so the rest can sleep. Read aloud: The road tops a rise and there it is: lamplight, woodsmoke, a dog barking, a queue outside a clinic, washing on a line. It looks, for one aching second, like somewhere people simply live. Then you notice the wardmarks chalked fresh above every door, the empty chair set at every table for someone the dark already took, and the way everyone goes quiet, fast, when the grey light starts to fail. Each community below keeps a rule, a lie, a cost, and a reckoning - the bargain that has let it survive the Gloamreach. The party will be tempted to free them all. Some of these places have lasted precisely because no one yet tried. Location 1 - Mother Rust&#x27;s Outreach Post A clinic built in the second floor of a leaning tenement that should not still be standing. Mother Rust treats the sick, the Rift-touched, and those the Bureau would classify as unrecoverable. The Rule: Mercy must be paid forward. The Lie: Care is free. The Cost: Medicine, cores, favors, or silence. If It Breaks: The clinic starts deciding who is worth saving.</p>
<h3>Services</h3>
<p>Treat Rift-Rot and minor Gloamreach conditions. Civilian aftercare. Rumors about Awoko recruiters. Recovery scenes after major horror encounters. Material-world witnesses, extracted locals, or wounded allies may be here under Mother Rust&#x27;s care. Location 2 - The Covered Market A neutral market under patched canvas and rusted tin. Vermillion runners, settlement traders, smugglers, cult watchers, and now the strangers who came in through the door all pass through. The Rule: No violence while the bell hangs. The Lie: Neutrality protects everyone. The Cost: One secret per stall per week. If It Breaks: The bell falls, and every unpaid secret becomes public.</p>
<h3>Services</h3>
<p>Rumors. Food. Salvage. Stolen maps. Questionable guides. Location 3 - The Hamlet That Never Says No A village where every door wears a fresh chalk ward. The residents speak softly and never, ever say a flat &quot;no&quot; aloud after the lamps are lit - because the dark listens for it. The Rule: No one says &quot;no&quot; aloud once the lamps are lit. The Lie: Courtesy keeps them safe. The Cost: One night a week, a household leaves a door unbarred, and does not ask what comes in. If It Breaks: The worn dead walk in wearing the face of whoever said no. Use this community to teach the danger of false safety. Location 4 - The Bellweather School A schoolhouse converted into a shelter. Children draw places they have never seen. The bell rings when the dark shifts. The Rule: Children may not be taken if someone else answers the bell. The Lie: The adults always know who should answer. The Cost: Volunteers stand at the road when the bell rings. If It Breaks: The road chooses instead. Mika the Kid can appear here. Her drawings foreshadow the deep dark, the worn dead, and the pieces of the Means. Location 5 - Old Man Crane&#x27;s Teahouse A quiet teahouse that appears at crossroads. It is always the same room, no matter where the door stands. The Rule: Tea must be finished before violence. The Lie: Crane is only an old man. The Cost: A true story from each guest. If It Breaks: The story repeats later with worse actors. Old Man Crane can teach the party a true thing about the Quiet - how it might be held, or where its truth lies - but his knowledge costs more than technique. Location 6 - The Empty Mill Village A settlement whose residents leave food on every table and sleep in locked barns. No one will explain why. The Rule: The mill must turn by moonrise. The Lie: Grain is what the mill grinds. The Cost: Names written on husks and fed into the stones. If It Breaks: The mill grinds bodies instead. This is an ideal location for a Means clue or a worn-dead arrival.</p>
<h3>Settlement-Wide Systems</h3>
<h3>Civilian Trust</h3>
<p>Track how many communities the party protect, exploit, abandon, or free. Civilian trust affects final-act support, rumors, safe rests, and whether common people will stand with the party at the end - or shutter their wards against them.</p>
<p>Shrines Small shrines appear throughout settlements - old folk-altars to powers that have not answered in a very long time. Some are sincere. Some are bait. A shrine of comfort - one reroll against fear or despair. A shrine kept by the watchful dead - advantage on one trial or combat-opening save. A shrine grown through with living rot - temporary HP, and a mutation risk. A shrine of remembrance - advantage on a Sense check involving memory or truth. A shrine that asks too little - never free. Always a trap, a rot, or a mercy with teeth.</p>
<h2>Chapter 32: Mana Vein Network and the Third Node</h2>
<p><em>A Rift Interior is not only a place. It is a pressure system with laws pretending to be weather.</em> - Dr. Serin Hayashi</p>
<h3>Overview</h3>
<p>The Gloamreach is threaded with Mana Veins: deep channels of Essence pressure that run under the roads, the settlements, and the deep places. Because the Quiet hunts by Essence, the veins are where its attention pools and the worn dead thicken - and also, Professor Lun believes, where it can be made deaf. Map enough nodes, she argues, and a stretch of the Gloamreach could be tuned to drown out sound and power entirely: silent enough to cross unheard, or even silent enough to hold the Quiet still. The veins run through the whole Gloamreach, but the deep nodes lie in its worst places. Node 1 - The Rusted Hull A dry-docked ship half-buried in black soil far from any sea. A vein pulses beneath the keel. Challenge: Install a sensor while avoiding a Beast swarm feeding on overflow Essence. Reward: Access to one movement-related Sigil or a road shortcut. Node 2 - The Silent Depot A cavernous native sorting-hall where the people once gathered whatever the veins carried up from below. It stands empty now but for the distant counting of the Hollow Way and a voice, in no throat, naming cargoes long since lost. A vein runs through the old reckoning-room. Challenge: Umbral scouts guard the vein-locks. Reward: One B-Rank Rune or a clue toward the Means - a way to read where the Quiet goes deaf. Node 3 - The Glass Sub-Basement A buried financial archive beneath the Ashen Counting-House. It contains the deepest active vein outside the lightless deep. SB-1 - Security Checkpoint Old native checkpoint-wards stand beside gear the Vermillion stripped from somewhere far deeper and never came back for. The wards test for the right silence, not the right face - they pass anyone who comes through quiet and dark, and wail at anyone who does not. SB-2 - Vein Engine A glass cylinder contains a pulsing channel of Essence. Installing Lun&#x27;s sensor requires a DC 15 Intelligence check. On failure, the sensor works, but the spike of Essence rings out through the vein - fill the Hunt Clock, and the Quiet now knows someone is down here. SB-3 - The Precedent Echo Something old stirs in the deepest vein - the Old Power Below - and asks the party what silence is worth to them. Their answer determines whether the node yields a stretch of safe silence, a way to mask their own Essence, or a hard first truth about what the Quiet is.</p>
<h3>What the Veins Buy</h3>
<p>If the party charts and tunes all three nodes, they have made a piece of the Gloamreach go quiet - a real advantage for the final crossing and, if they attempt it, the gated kill. Choose one:</p>
<p>A silent corridor. One stretch of the final approach can be crossed with the Hunt Clock frozen the veins drink the party&#x27;s noise and Essence, so the Quiet cannot hear them coming.</p>
<p>Masked power. Once during the finale, the party may spend Essence without advancing the Hunt Clock; the veins swallow the sound of it.</p>
<p>The deaf place. The party can force the Quiet into a node&#x27;s dead-silent heart for one scene, where it hunts blind - the single best place to make the one stand that could end it (a piece of the Means; see The Means to End It).</p>
<h3>Warden Guidance</h3>
<p>Mana Veins should not feel like power generators. They are nerves. When the party touches one, the dark feels it.</p>
<h2>Chapter 33: The Awoko Sanctum</h2>
<h3>The Awoko Sanctum</h3>
<h3>Overview</h3>
<p>The Awoko Sanctum hides in a grief-dense fold of the Gloamreach where four rooms share one impossible floor plan - a chapel, a clinic, a theatre, and an execution room, all the same room, depending on why you came. Here beauty is made unbearable and comfort is twisted into bait. The Awoko are natives of the Gloamreach who found the one thing the dark could never quite take by force - grief, freely given - and built a faith on it. They do not see themselves as villains, and they are not lying about the comfort they offer. That is exactly what makes them dangerous. Read aloud: Someone is singing, low and close - a song you half-remember in a voice you have lost. The air is warm with candlelight and the smell of clean linen, and a gentle hand finds your shoulder before you see whose it is. &quot;You&#x27;ve carried that a long way,&quot; the voice says, meaning the grief you did not know showed. &quot;You don&#x27;t have to. Not here.&quot; Every word is true. That is the trap. They preach that the Quiet is proof you do not have to stay prey - that a thing in this country once climbed out of being hunted and became the hunter - and their leader means to follow it, by feeding the Quiet enough grief and enough dead that it remakes her into something it will never touch.</p>
<h3>Core Truth</h3>
<p>The Hollow Mother does not want to hide from the Quiet, and she does not want to kill it. She wants to become something like it - and she is willing to feed it her whole flock to get there.</p>
<h3>What This Place Does</h3>
<p>Dread: Grief does not stay private here. The Sanctum gathers it, concentrates it, and turns it into something with weight and will - and the more you bring, the more it loves you. The Lure: To be understood. The cult meets the grieving exactly where they hurt and offers to share the weight, to make sure the lost are never forgotten. The Cost: It feeds on what it collects - loss, confession, blood, obedience - and gives belonging in their place, until the grief is all that is left of you. If You Linger: The grieving stop being mourners and become fuel, wept dry and fed to whatever the Hollow Mother is becoming.</p>
<h3>Key Areas</h3>
<p>S-1 - Nave of Remembered Names Thousands of names hang from threads. Some are dead. Some are alive. Some belong to the party, if they have been careless with their names. S-2 - Confession Chamber Initiates confess grief into speaking tubes. The grief is stored, refined, and used to power rituals. S-3 - Clinic of Gentle Hands The cult offers real comfort here. Do not make it fake. The danger is that the comfort is being weaponized. S-4 - Choir Pit Idol-class cultists sing grief into a shape the dark will answer. Interrupting the choir can scatter the worn dead the song has drawn in close, or weaken the Hollow Mother&#x27;s ritual. S-5 - Sister Veil&#x27;s Laboratory Sister Veil knows the ritual math is wrong. She can defect if shown evidence that the Hollow Mother intends to use the cult as fuel. S-6 - The Ritual of Becoming A circular chamber with seven candle-stations, each burning with grief-tallow. If completed, the ritual offers the Hollow Mother to the Quiet on an altar of the community&#x27;s grief - a bid to be remade into a new thing that hunts, instead of one more thing that is hunted.</p>
<h3>Major NPCs</h3>
<h3>The Hollow Mother</h3>
<p>Charismatic, grieving, brilliant, and predatory. She speaks softly. She never says die when become will do.</p>
<h3>Sister Veil</h3>
<p>Ritualist and possible defector. She is guilty, but not unreachable.</p>
<h3>Acolyte Mara</h3>
<p>A young initiate who can become a human face for the cult&#x27;s victims.</p>
<h3>Ritual Disruption</h3>
<h3>The party can disrupt the ritual by</h3>
<p>Destroying one correct candle-station.</p>
<p>Convincing Sister Veil to corrupt the final chant.</p>
<p>Removing the stored grief from the Confession Chamber.</p>
</div>
`;

const QUESTS_BODY = `
<div class="campaign-prose">
<h3>Warden Guidance</h3>
<p>The finale should not ask only, &quot;Can the party get out?&quot; It should ask, &quot;What did they keep alive - others, and themselves - and what did it cost?&quot; However it ends, leave a door ajar. Nothing in the Gloamreach is ever quite finished, least of all the dark.</p>
<h2>Chapter 17: How the Quiet Hunts</h2>
<h3>How the Quiet Hunts</h3>
<h3>Overview</h3>
<p>The Quiet does not chase. It converges. It does not hurry, because it does not need to; it does not negotiate, because it was not made to. It is simply, always, on its way - and the closer it comes, the more of the Gloamreach belongs to it. Most of the time it hunts not in its own shape but through the worn dead it sends ahead (the Worn, anomaly-0701; the Caller, anomaly-0702; the Wrong Shape, anomaly-0703; the Hollowed, anomaly-0704 - all in the Anomaly Manual), keeping its own terrible attention in reserve until the Hunt Clock fills. This chapter is the mechanics of being hunted: how the pursuit feels, what holds it off, and what happens when it arrives.</p>
<h3>First Sighting</h3>
<h3>Read aloud</h3>
<p>You hear it before you see anything - or rather, you stop hearing. The insects, the wind, the small sounds of the dark all go out like a held breath. Then, far off, a voice you know. It calls your name, or a name you lost, in exactly the right voice, from exactly the wrong place. It is patient. It can wait all night. It only needs you to answer once.</p>
<p><strong>Use at the Table.</strong> The Quiet&#x27;s hunt is a survival, evasion, and warding problem, never a stand-up fight. The party can: run silent and dark, giving the Hunt Clock nothing to fill on; reach a native wardline before the clock fills; give it what it came for - a terrible choice; or, at worst, fight off a worn-dead hunter, which buys time and means nothing, because there is always another face. The Quiet itself cannot be killed and stay dead until the party are high tier and hold the Means (see The Means to End It). Until then, surviving its hunt means understanding what it is - not hitting harder.</p>
<h3>What It Sends, by Act</h3>
<p>Run the hunt through the worn dead, scaling with the party. Full stat blocks are in the Anomaly Manual (the Quiet, anomaly-0700, and the worn dead, anomaly-0701 through 0704).</p>
<figure class="campaign-table-wrap">
<figcaption>What the Quiet Sends, by Act</figcaption>
<table class="campaign-table"><thead><tr><th>Act / Tier</th><th>The Quiet usually hunts through&#x2026;</th></tr></thead><tbody>
<tr><td>First Contact (L1-3)</td><td>The Worn (anomaly-0701) - corpses worn as lures and ambushers.</td></tr>
<tr><td>The Hunt (L4-6)</td><td>The Caller (anomaly-0702) and The Wrong Shape (anomaly-0703) - a lure that splits the party, and a trusted face that turns wrong.</td></tr>
<tr><td>The Long Dark (L7-9)</td><td>The Hollowed (anomaly-0704) - apex-fragments that hunt like the Quiet in miniature.</td></tr>
<tr><td>Threshold (L9+)</td><td>The Quiet itself (anomaly-0700) - only when the Hunt Clock fills, or at the gated kill.</td></tr>
</tbody></table>
</figure>
<h3>What Draws the Hunt</h3>
<p>The Quiet and its worn dead converge on noise, light, and Essence (see Running This Horror). Fill the Hunt Clock for any of these. The natives&#x27; wards starve the hunt of all three - which is why the party must learn the rules.</p>
<figure class="campaign-table-wrap">
<figcaption>What Just Rang the Bell (d8)</figcaption>
<table class="campaign-table"><thead><tr><th>d8</th><th>What just rang the bell</th></tr></thead><tbody>
<tr><td>1</td><td>Gunfire, a shout, or a fight in the open.</td></tr>
<tr><td>2</td><td>An Ascendant used a technique, Sigil, or Awakened power.</td></tr>
<tr><td>3</td><td>An open flame or bright light in the dark.</td></tr>
<tr><td>4</td><td>A native rule or ward, broken.</td></tr>
<tr><td>5</td><td>The party answered a voice they should not have.</td></tr>
<tr><td>6</td><td>They sheltered, or refused to give up, someone the Quiet had marked.</td></tr>
<tr><td>7</td><td>They lingered too long in exposed ground.</td></tr>
<tr><td>8</td><td>They used the dead&#x27;s own names carelessly, and something heard.</td></tr>
</tbody></table>
</figure>
<h3>Holding It Off</h3>
<p>The party can end a hunt scene without destroying the Quiet by:</p>
<p>Silence and dark. Give it nothing to converge on - no noise, no light, no Essence - and slip away.</p>
<p>The wardline. Reach a native safe-hold; its wards keep the Quiet, and usually its worn dead, out - so long as the party keep the rules.</p>
<p>A true name. Naming a worn-dead lure for what it is can break it; naming the Quiet&#x27;s nature can make it flinch (see The Means to End It).</p>
<p>Running water, a hard threshold, hallowed native ground - places its hold thins.</p>
<p>Giving it what it came for - the worst mercy, and sometimes the only one.</p>
<p>Simply outrunning it for now - knowing it has not stopped, and never will, until the party are out or it is dead.</p>
<h3>Warden Guidance</h3>
<p>The hunt is most frightening when the party realize the only question left is how long can we stay ahead of it. Never let combat be the answer; let silence, the dark, the rules, and the wardline be the answer. The night they finally have to choose who to give up is the night this campaign becomes unforgettable.</p>
<h2>Chapter 18: Side Quests of the Gloamreach</h2>
<p>Side Quests of the Gloamreach</p>
<h3>Overview</h3>
<p>These quests are the country-scale obligations of survival. Each should reveal something about how the Gloamreach is survived, the cost of it, or the factions trying to control the outcome. Quest 1: The Missing Strike Team Giver: Commander Park Objective: Find Strike Team Seven inside the Gloamreach.</p>
<h3>Steps</h3>
<p>Recover their first broken transmission near the Rift Threshold.</p>
<p>Follow AFA ghost-pings along the old roads, deeper in.</p>
<p>Find remains or survivors in Bastion Golemfall, the Sunken Tunnels, or the deep Gloamreach.</p>
<p>Decide whether to return the truth to the Bureau or hide what the team became.</p>
<p>Rewards: Bureau reputation, Ghost as a possible ally, and hard intelligence about the Quiet&#x27;s hunting grounds. Quest 2: Mother Rust&#x27;s Breakthrough Giver: Mother Rust Objective: Recover living mana from the Fungal Depths or Remembering Orchard. Mother Rust can use it to treat Rift-Rot and Gloamreach exposure, but the same compound can also suppress emotion and make people easier to move through grief-heavy terrain. Rewards: Vermillion reputation, advanced healing, and possible Mother Rust alliance or corruption arc. Quest 3: The Cult Defector Giver: Whisper, Sister Veil, or Acolyte Mara Objective: Extract a defecting Awoko member from the Sanctum. The defector knows the Hollow Mother intends to feed the flock to the Quiet to be remade, not to save anyone. The cult will try to recover them alive because their grief has already been measured for ritual use. Rewards: Awoko ritual intelligence, Bureau/Vermillion reputation, and a way to disrupt the Ritual of Becoming. Quest 4: Torch&#x27;s Letter Giver: Torch Objective: Get a letter out through the Bureau Annex relay. This is a small human quest. Keep it small. That is why it matters. Rewards: Torch as an ally, Vermillion reputation, and proof the party still cares about people beyond the main plot. Quest 5: The Millwright&#x27;s Device Giver: The Millwright Objective: Build a one-use device that forces a pocket of silence.</p>
<h3>Components</h3>
<p>One B-Rank core.</p>
<p>A schematic from Hayashi or Lun.</p>
<p>A gear-heart from the mills.</p>
<p>A field test at a Mana Vein node.</p>
<p>Reward: one-use silence - a pocket the Quiet cannot hear, for one scene (a Means component; see Ch32). Quest 6: Mika&#x27;s Prophecy Giver: Mika the Kid Objective: Protect Mika and interpret her drawings. Each drawing foreshadows a piece of the Means, a betrayal, the worn dead coming, a community&#x27;s hard bargain, or the deep dark. Reward: prophetic hints and final-act emotional leverage if Mika survives. Quest 7: Iron Belle&#x27;s Challenge Giver: Iron Belle Objective: Win a nonlethal trial of strength, discipline, and restraint. This should not be a throwaway fight. Iron Belle wants to know whether the party can stop before victory becomes cruelty. Reward: Vermillion reputation, training, and Iron Belle&#x27;s respect. Quest 8: The Civilian Convoy Giver: A settlement elder, Mother Rust, or Commander Park Objective: Escort civilians from a failing safe-hold to a stronger one.</p>
<h3>Complications</h3>
<p>The open road is loud, and the dark is listening. The worn dead may come for someone on the way. Some civilians believe leaving voids their community&#x27;s wards. Rewards: civilian trust, Bureau or Vermillion reputation, and settlement support in the finale. Quest 9: Acolyte Mara&#x27;s Rescue Giver: Sister Veil Objective: Rescue Mara from the Awoko before she is used as ritual fuel. Reward: Mara and Sister Veil as allies, ritual disruption, and proof that cultists can still be saved. Quest 10: Ghost&#x27;s Memory Giver: Ghost Objective: Restore Ghost&#x27;s identity without handing them back to Bureau custody as evidence. Ghost&#x27;s memories are hidden across dead-team markers, the Drowned Ledgerfen, and a Means-touched relic. Reward: Ghost restored as a high-rank ally and classified intelligence about the Quiet. Quest 11: Professor Lun&#x27;s Theory Giver: Professor Lun Objective: Place sensors at three Mana Vein nodes. Reward: a charted deaf place - silence to use in the final crossing (see Ch32). Quest 12: Rat- King Ji&#x27;s Stash Giver: Rat-King Ji Objective: Recover a hidden stash before the dark carries it off to someone else. Reward: contraband, a Means clue, or a dangerous shortcut.</p>
<h3>Warden Guidance</h3>
<p>Every side quest should sharpen the central question: what does survival cost when the land itself is hunting you?</p>
<h2>Chapter 19: Domain Pressure Encounters</h2>
<h3>Domain Pressure Encounters</h3>
<h3>Overview</h3>
<p>Use these encounters when the Gloamreach needs to push back without derailing the party&#x27;s current objective.</p>
<h3>Pressure Types</h3>
<h3>Rule and Ward Pressure</h3>
<p>A native rule the party did not know, a ward they must keep lit or keep dark, a price for shelter, or a custom they have already broken. This pressure teaches players that the rules are the only thing keeping the dark out - and the party do not know them all.</p>
<h3>Environmental Pressure</h3>
<p>Weather changes, food spoils, the road moves, shelter becomes conditional, or a settlement bell rings.</p>
<h3>Social Pressure</h3>
<p>A faction demands a decision. Civilians ask for help. Vermillion calls in a favor. Bureau orders contradict morality. Awoko comfort feels too useful.</p>
<h3>Predatory Pressure</h3>
<p>A worn-dead hunter, an umbral scout, an adaptive beast, or a cult cell tracks the party.</p>
<h3>Encounter Rule</h3>
<p>Every pressure encounter should reveal at least one of the following:</p>
<p>A native rule or ward.</p>
<p>A community&#x27;s hard bargain to survive.</p>
<p>A faction cost.</p>
<p>A Means clue.</p>
<p>A future consequence.</p>
<h2>Chapter 20: Recruitable Allies</h2>
<h3>Recruitable Allies</h3>
<h3>Overview</h3>
<p>Allies should never be simple stat blocks. Each one represents a possible answer to the Gloamreach. Build and advance the Ascendant allies on the same rules the party uses - <strong>Ascendant Guide, Creating An Ascendant</strong> (Combat Roles, Jobs, Paths) - so an allied Ascendant fights, awakens, and levels like a real one rather than a fixed prop.</p>
<h3>Ally Categories</h3>
<h3>Bureau Allies</h3>
<p>Disciplined, supplied, and politically constrained. They help with logistics, research, and final-operation support.</p>
<h3>Vermillion Allies</h3>
<p>Fast, practical, and morally flexible. They help with salvage, black-market access, shelter, and unconventional solutions.</p>
<h3>Civilian Allies</h3>
<p>Vulnerable but narratively powerful. They create stakes, rumors, shelter, and emotional leverage.</p>
<h3>Awoko Defectors</h3>
<p>Dangerous because they know the cult&#x27;s rituals and have already been shaped by grief. Saving them should matter.</p>
<h3>Gloamreach-Born Allies</h3>
<p>Rare and unstable. A spirit commander, a changed survivor, or an oathbound guardian may help if the party proves they do not intend to become hunters themselves.</p>
<h3>Final-Act Use</h3>
<p>Allies should affect the final crossing by opening paths, holding a wardline open, drawing off the worn dead, protecting civilians, revealing a rule, or building the once-only ward-circle the Means needs.</p>
<h2>Chapter 21: Relics and the Means</h2>
<p>Relics and the Means</p>
<h3>Overview</h3>
<p>The Means is the campaign&#x27;s one structure of Relics that truly matter (see The Means to End It), but lesser Gloamreach-touched items appear throughout the country.</p>
<h3>Relic Principles</h3>
<p>A deep-Gloamreach Relic is never only powerful. It is a truth, a cost, or a piece of the Means.</p>
<p>Using one should attract attention - the dark notices power.</p>
<p>Carrying one may change how the roads and the worn dead behave around you.</p>
<p>A Relic can hold or hurt the Quiet for a heartbeat - but using one loudly also teaches the dark how the party fights.</p>
<h3>Lesser Relic Examples</h3>
<h3>The Hush-Blade</h3>
<p>A knife that makes no sound - no ring of steel, no cry from what it cuts. A kill with it does not fill the Hunt Clock, once per scene. The silence has to come from somewhere; it takes it from the wielder&#x27;s own voice for an hour after.</p>
<h3>The Ward-Stone</h3>
<p>Held overnight, it keeps the worn dead off one unwarded rest. It cracks a little more each time, and when it finally breaks, whatever it kept out has been waiting.</p>
<h3>The Name-Glass</h3>
<p>Look through it at a familiar face and see whether it is truly itself or something worn. Using it, the looker feels the dark look back - fill the Hunt Clock.</p>
<h3>The Quiet-Lamp</h3>
<p>Sheds a light only the bearer can see - a small mercy in the dark that draws nothing. Its oil is the rendered grief of the taken, and it knows whose. What the Dark Does When You Find the Means When the party recover a piece of the Means, the Quiet feels it. Choose one pressure response:</p>
<p>The hunt sharpens - the Hunt Clock fills faster for a stretch.</p>
<p>The worn dead come for whoever carries it.</p>
<p>A community that helped pays for it, and the party hear about it.</p>
<p>The Awoko try to take it, to feed their own becoming.</p>
<p>The way deeper opens - but only toward worse.</p>
<h2>Chapter 22: Treasure and Rewards</h2>
<h3>Treasure and Rewards</h3>
<h3>Overview</h3>
<p>Rewards in the Gloamreach should feel useful, costly, and story-facing. Credits matter less when the road demands things money cannot buy. Generate the concrete loot, relics, and artifacts from <strong>Vaults of the Rift</strong> (Item Vault, Relics &amp; Artifacts, and Generating Loot); this chapter only shapes how the Gloamreach makes the party pay for them.</p>
<h3>Reward Categories</h3>
<p>Cores Still valuable to Bureau and Vermillion. Use cores for gear, research, medicine, and faction favors. Relics Tie Relics to the Gloamreach&#x27;s nature. Even minor Relics should carry a hint of the dark - something lost, owed, remembered, or survived.</p>
<h3>Sigils and Runes</h3>
<p>Use Chapter 34 for tier guidance. Let factions offer different routes to similar power with different consequences.</p>
<h3>Safe Shelter</h3>
<p>A safe long rest can be more valuable than money. Make shelter a reward, not an assumption.</p>
<h3>Names and Truths</h3>
<p>The right name, truth, confession, or memory may defeat something combat cannot.</p>
<h3>Final Rewards</h3>
<p>After the campaign, rewards depend on the ending. Escape: their lives, a few haunted Relics from the deep, and the marks the Gloamreach left. Kill: a fragment of what the Quiet was, a Relic forged in the kill, or the spent Means itself - and an open future. Become: no loot, only consequence; a character who is now something that hunts.</p>
<h2>Chapter 23: Warden&#x27;s Horror Guide</h2>
<h3>Warden&#x27;s Horror Guide</h3>
<h3>Intended Rating</h3>
<p>Mature Dark Fantasy Rift Horror. Use oppressive dread, psychological horror, body horror, starvation, isolation, institutional abandonment, corpse imagery, false safety, the uncanny, forced moral compromise, transformation horror, and the terror of being hunted by something you cannot see. Do not use sexual violence, eroticized harm, real-world hate ideology, cruelty to children as spectacle, or torture-porn framing.</p>
<h3>Horror Pillars</h3>
<h3>Being Prey</h3>
<p>The Quiet&#x27;s horror is being hunted. The dark, the roads, the worn dead, the open ground, and even the safe- holds all whisper the same thing: it already knows you are here, and it can wait.</p>
<h3>False Safety</h3>
<p>Fires, beds, warded walls, and kind natives should feel comforting and provisional at once - every safety in the Gloamreach is borrowed, and the dark is patient.</p>
<h3>Bureau Failure</h3>
<p>The Bureau is not useless. It is insufficient. Let the party feel the gap between protocol and reality.</p>
<h3>Survival Compromise</h3>
<p>Settlements survive by doing things they cannot emotionally survive doing forever.</p>
<h3>Wearing the Dead</h3>
<p>The Quiet was never a person and has no past to redeem - but it wears the party&#x27;s dead perfectly, and offers their faces, their voices, and the comfort of them as bait. Do not use that to make it sympathetic. Use it to make every reunion hurt: the mercy the party reach for was assembled, out of people they loved, to be reached for.</p>
<h3>Pacing Advice</h3>
<p>Alternate pressure and breath. Horror needs contrast. A hot meal before a terrible choice will do more damage than constant screaming.</p>
<h3>Warden North Star</h3>
<h3>Before every major scene, answer four questions</h3>
<p>What rule or ward keeps this place alive?</p>
<p>What does breaking it cost?</p>
<p>What is the Quiet drawn to here - and how loud are the party being?</p>
<p>What happens if they get loud anyway?</p>
<h2>Chapter 24: What the Natives Know</h2>
<h3>What the Natives Know</h3>
<p>There is no fortune to read here. The only map of the Gloamreach is in the heads of the people who have survived it, and they do not give it to strangers.</p>
<h3>The Real Map Is in People&#x27;s Heads</h3>
<p>There is no oracle and no fortune. What the party can know about the Gloamreach - where the safe- holds are, which rules keep the Quiet out, where the deep places lie, and the first hints that it might even be killable - lives in the heads of the people who have lived here their whole lives. Intel is earned: by trust, by trade, by listening, by being useful - and sometimes by watching someone die for breaking a rule the party did not know. This chapter replaces any fortune or oracle system. Use it to hand the party direction without a deck and without a railroad: the natives tell them what they need, when they have earned it.</p>
<h3>How Intel Works</h3>
<p>Gated on trust, not dice. A native who fears or resents the outsiders tells them nothing useful (and may lie to protect their own). One who trusts them shares a rule, a route, a name. Track trust per community (see Factions and the native communities). Partial and contradictory. No one knows the whole Gloamreach. Different communities keep different rules and different rumors; some are wrong, some are old. The truth assembles slowly. The most valuable thing here. A single rule, learned in time, saves a life. Treat earned intel as the campaign&#x27;s real treasure. What There Is to Learn (seed across the campaign) Spread these among the communities and the deep places, in whatever order play takes the party: The rules and wards - how each safe-hold keeps the Quiet out, and what must never be done. (The immediate survival layer.) The routes - which stretches of exposed ground can be crossed, when, and how to cross them quiet and dark. (Travel.) The lost - who the Quiet has taken, and whose face it might be wearing now. (The uncanny; foreshadows the worn dead.) The deep places - where the Gloamreach fails, where the worn dead thicken, and where the oldest natives say the truth about the Quiet might be found. (Mid/late direction.) The Means - the first hints that the Quiet could, in theory, be ended, and what that would cost. (Late; see the Means chapter. Never a checklist.) The way out - what the natives believe about the threshold, and why they cannot leave even if the party can. (The escape ending, and the quiet tragedy in it.)</p>
<h3>The Keepers of Knowledge</h3>
<p>Some natives hold more than others - an old ward-keeper, a child who sees true, someone who went into the dark and came back almost themselves. These are the campaign&#x27;s intel anchors: protect them and the party gains direction; lose them and the party goes blind. (See the native communities and the cast.)</p>
<h3>Warden Guidance</h3>
<p>Never dump the map. Let the party earn it a piece at a time, always one rule behind safety. The dread is in not knowing the rule until the clock is filling - and the relief, when a native finally tells them, should feel like the only warmth in the Gloamreach.</p>
<h2>Chapter 25: Player Ties and Assignment Hooks</h2>
<h3>Enter the Gloamreach</h3>
<p>Ascendant Hooks - Reasons to Enter the Gloamreach</p>
<h3>Purpose</h3>
<p>Every character needs a reason to cross the S-Rank threshold and keep moving after escape becomes uncertain. These hooks replace older district-crisis assumptions and tie the party directly to the Gloamreach.</p>
<h3>Personal Hooks</h3>
<h3>The Contract</h3>
<p>The character signed a Bureau or Guild contract before the Domain classification was confirmed. Backing out now would ruin them financially, legally, or politically.</p>
<h3>The Missing Team</h3>
<p>Someone the character knows entered during the first response wave. Their AFA tag still pings from somewhere inside the Gloamreach, always farther down the road. The Name in the Ledger The character&#x27;s name appears in something recovered from inside the Gloamreach before the campaign begins, written in a hand no one recognizes. No one knows how it got there.</p>
<h3>The Survivor&#x27;s Debt</h3>
<p>The character survived a previous Rift because someone else stayed behind. The Gloamreach contains that person&#x27;s voice, echo, body, or unpaid sentence.</p>
<h3>The Bonded Relic</h3>
<p>A Relic bonded to the character reacts violently when the Rift opens. It is not calling them to power. It knows the Gloamreach, and the Gloamreach knows it. The Veteran of a Failed Clear The character has seen a Rift stop behaving like a place and start behaving like a ruler. They know the Bureau briefing is too clean.</p>
<h3>Group Hooks</h3>
<p>The Bureau hires the party because higher-rank teams vanished inside.</p>
<p>Vermillion offers illegal support if the party agrees to recover salvage and survivors.</p>
<p>A settlement inside the Domain sends a written invitation that appears in the material world.</p>
<p>A dead Ascendant&#x27;s AFA broadcasts from somewhere deep inside the Gloamreach every night at the same time.</p>
<p>The Rift shows signs of an imminent Rift Break - containment is failing - and the Bureau orders immediate entry to re-secure it before conditions spill into the material world.</p>
<h3>Warden Guidance</h3>
<p>The best hook is not glory. It is obligation. The Gloamreach should feel like a place the party enters because no better option exists, then survives because leaving would abandon too many people to the dark.</p>
<h2>Chapter 26: Stat Blocks Appendix - Domain Use</h2>
<p>Notes Stat Blocks Appendix - Using Creatures in the Gloamreach</p>
<h3>Purpose</h3>
<p>This appendix is Warden-facing guidance for running the Gloamreach&#x27;s creatures. Full stat blocks live in the Anomaly Manual (ranks D-S); the finale-critical creatures - the Quiet (anomaly-0700) and the dead it wears (the Worn, anomaly-0701; the Caller, anomaly-0702; the Wrong Shape, anomaly-0703; the Hollowed, anomaly-0704) - are cited there by name and number. This chapter explains how the country&#x27;s threats fit together. The Quiet Is the Apex, Not the Only Enemy The Gloamreach is a whole country, and it must play like one. The Quiet is the apex predator and the campaign&#x27;s final, optional fight - not the monster in every room. Most of what the party fights is the</p>
<h3>country&#x27;s own ecology</h3>
<p>Each site has its own signature threat - a local horror reskinned from the bestiary (the Drowned Ledgerfen&#x27;s Head Surgeon, the Fungal Depths&#x27; adaptive growth, and so on). These are real, killable fights. Factions and hostile natives are threats too - the Awoko grief-cult, Vermillion rivals, wary communities, and the predators of the open wilds. The worn dead are the apex&#x27;s reach into a scene, not the standard encounter. Putting one down is easy and means nothing; there is always another face.</p>
<h3>The Layers Interlock</h3>
<p>This is the engine that makes an ordinary fight frightening: every combat means noise, light, and Essence, and all three fill the Hunt Clock. Win too loud and the Quiet comes for someone before the party can catch their breath. The country&#x27;s lesser threats are dangerous mostly because of what fighting them calls.</p>
<h3>The Worn Dead as Recurring Hunters</h3>
<p>When the campaign needs a recurring, escalating menace, use the worn dead, not a fixed officer. They appear by act - the Worn early, then the Caller and the Wrong Shape, then the Hollowed late (see the Quiet dossier; full blocks anomaly-0701 through 0704 in the Anomaly Manual). They lure, mimic, herd, and wait far more than they brawl, and they are hard to be rid of for good: there is always another.</p>
<h3>The Old Power Below</h3>
<p>Some deep places hold something older than the worn dead and not of the Quiet at all - the remnant of whatever stood here before, bound under the oldest wards. It has no ordinary stat block. If the party confronts it, run the scene as a trial, a bargain, or a memory dragged up from before living memory, and let it be one of the places where the truth about the Quiet&#x27;s age can surface. Combat, if it comes, is through its guardians and the ruined things that once begged it and were refused.</p>
<h3>Horror Encounter Rules</h3>
<p>Every combat should reveal something about the Gloamreach or the people who live in it.</p>
<p>Every victory should cost time, supplies, reputation, safety, certainty - or noise.</p>
<p>Intelligent enemies should know the local rules and wards better than the party.</p>
<p>Monsters should not merely attack. They lure, mimic, herd, witness, or wait.</p>
<p>Scaling For low-level parties, reduce damage but preserve consequences. For high-level parties, raise the hunt - the Hunt Clock, the worn dead, the cost of every loud win - before raising hit points. The Gloamreach is frightening because it changes what victory means.</p>
<h2>Chapter 27: The Means and Treasure Cross-Reference</h2>
<h3>The Means and Treasure Cross-Reference</h3>
<p>An artifact is a promise with enough power to outlive the person who made it. - Dr. Serin Hayashi</p>
<h3>Using This Chapter</h3>
<p>This chapter maps the Means to End the Quiet, named items, Relics, Sigils, Runes, tattoos, and narrative props to their place in Run Silent. Full mechanical entries remain in the authoritative compendium files. This chapter keeps the module aligned with the item economy without duplicating stat blocks.</p>
<h3>The Means to End It</h3>
<p>The Means is the campaign&#x27;s one path to killing the Quiet - never a fetch-quest, always discovered in play (see The Means to End It). It is built from three kinds of thing, and a party needs enough of each that the Warden is satisfied they have earned it. The Warden seeds the pieces across the deep places by hand; what the natives know (Ch24) points the way.</p>
<figure class="campaign-table-wrap">
<figcaption>The Three Components of the Means</figcaption>
<table class="campaign-table"><colgroup><col style="width:20%" /><col style="width:46%" /><col style="width:34%" /></colgroup><thead><tr><th>Component</th><th>What it is</th><th>Where it tends to surface</th></tr></thead><tbody>
<tr><td><strong>A truth</strong></td><td>What the Quiet is, and whether it was always here.</td><td>The Deep Places, the Obsidian Spire&#x27;s Watcher, the Old Power Below in the Mana Veins, the oldest natives.</td></tr>
<tr><td><strong>A way to hold it still</strong></td><td>A real Relic, weapon, or working that can pin a thing never fully there - forced silence and dark, a true name, a ward turned inward.</td><td>A hard-won treasure in the deep sites; the deaf place charted in the Mana Veins (Ch32).</td></tr>
<tr><td><strong>A way to make it stay dead</strong></td><td>A place or moment where the kill can land - the Threshold, a ward-circle the natives will build only once, the dead-silent heart of a vein.</td><td>The Threshold; a community&#x27;s deepest ward, earned with their trust.</td></tr>
</tbody></table>
</figure>
<h3>Finale Reward Guidance</h3>
<p>The ending is not a loot pile, but a party that survives the Threshold has earned something. Choose by ending and party. Escape The party get out, the Quiet still hunting behind them. Their reward is what they carried out: their lives, a few hard-won Relics from the deep sites, and the marks the Gloamreach left on them. Anything taken from the Quiet&#x27;s worn dead should feel haunted. Kill The rarest victory. The party may recover something from the place the Quiet fell - a fragment of whatever it truly was, a Relic the kill forged out of silence and dark, or simply the Means itself, spent but legendary. Let at least one reward be strange, story-facing, and a hook for what comes next. Become There is no loot here, only consequence. The character who took the predator&#x27;s road is the reward and the price - power earned, humanity spent. What they are now is the next campaign&#x27;s question.</p>
<h3>Sigil Drops by Site</h3>
<p>Site</p>
<h3>Sigil Guidance</h3>
<h3>Hollow Way</h3>
<p>Aegis, Grounded Soul, or mobility Sigil.</p>
<h3>Drowned Ledgerfen</h3>
<p>Frost-Ward, Iron Mind, or truth/diagnosis-themed protection.</p>
<h3>Fungal Depths</h3>
<p>Cleansed Blood or poison/rot resistance.</p>
<h3>Remembering Orchard</h3>
<p>Zephyr&#x27;s Tread, Silent Guardian, or Sense/memory support.</p>
<h3>Ashen Counting-House</h3>
<p>Crimson Weeping, Hearth-Fire, or grief/blood Sigil.</p>
<h3>Sunken Tunnels</h3>
<p>Winter Court, Hearth-Fire, or underwater survival support.</p>
<h3>Bastion Golemfall</h3>
<p>Unmoving Stone, Dragon&#x27;s Scale, or shield/armor Sigil.</p>
<h3>Obsidian Spire</h3>
<p>Void-Walker, Silent Guardian, Grandmaster&#x27;s Edge.</p>
<h3>The Threshold</h3>
<p>Undying Flame, Iron Mind, or an S-tier finale reward.</p>
<h3>Tattoos and Downtime Rewards</h3>
<p>The Vermillion Outpost can provide tattoos from Awakened Arts, Tattoos at Trusted reputation. Tattoos should be offered as survival tools, identity marks, or body-horror-adjacent choices. The Gloamreach should make body modification feel powerful but intimate. Runes Use Chapter 34 for Rune tier placement. Runes should be scarce and story-facing. A Rune found in the Gloamreach should imply a prior owner, a cost, or a law it once served.</p>
<h3>Campaign-Unique Narrative Props</h3>
<h3>The Faded Family Photo</h3>
<p>Recovered in the Drowned Ledgerfen or deep in the Gloamreach: a lost face worn down to blank paper. The campaign&#x27;s most important emotional prop. Carry it in, and the Quiet learns that face - and may one day wear it back at the party. The first lesson in how the dead are kept here. the recovered witness&#x27;s Wedding Ring Optional if the recovered witness survived. When the Quiet wears her lost husband to lure the party, the ring can force one breath of doubt - in them, or in the thing pretending to be him.</p>
<h3>The Name Ledger</h3>
<p>A local object recovered from the Drowned Ledgerfen. Names written in it foreshadow how dangerous a written name becomes inside the Gloamreach.</p>
<h3>The Unopened Commendation</h3>
<p>Found in a deep place, addressed to a name reality can no longer keep - someone the Gloamreach took so completely the world forgot to finish their story.</p>
<h3>The Child&#x27;s Toy</h3>
<p>Found far down in the dark, where no child should ever have been. Emotionally useful, never mechanically powerful: proof that the Quiet takes everyone, and keeps what they loved.</p>
<h3>The Diploma</h3>
<p>Proof that one of the taken had a whole life - a name, a place, a future - before the Gloamreach wore it away. Whose, the party may never be sure.</p>
<h3>Warden Guidance</h3>
<p>Artifacts in this campaign should not feel like treasure alone. They are evidence, leverage, temptation, and memory. The best item is one the party wants to use and fears using.</p>
<p>Presenting proof that the Hollow Mother intends to feed them all to the dark, not free them.</p>
<h3>The Sanctum Raid</h3>
<p>When the Sanctum turns hostile, the fight is the Choir, the ritual, and the Hollow Mother - not a single boss. Reskin a B-Rank controller Anomaly from the Anomaly Manual as the Choir&#x27;s grief-engine (the thing the singing actually powers), and run the Hollow Mother as a near- non-combatant who would far rather the party understood than fought. The Law in play: grief may be converted into authority. Every loss the party has carried into the Domain - a named dead, a memory-core eaten in the Orchard, an oath broken at the Bastion - is fuel the Sanctum can spend against them; a party that has grieved openly here arms the room. Starve the engine by denying the cult the party&#x27;s grief: refuse the comfort, withhold true names, or empty the Confession Chamber before the Choir can draw on it. Scaling (Levels 1-10): B-Rank for a level 7-9 party; if the Ritual of Becoming is near completion, raise it to A-Rank and let the Hollow Mother spend the Sanctum&#x27;s stored grief as legendary actions. Exit tone (read aloud): Outside again, the song does not follow - but for the rest of the campaign, the first kind voice in any safe room will sound, for just a moment, like hers, and the party will have to decide, every time, whether to let it comfort them.</p>
<h3>Warden Guidance</h3>
<p>The Awoko should be horrifying because they understand pain and exploit it with tenderness. Push the dread, not caricature. Their kindness should make the party angrier, not less afraid.</p>
<h2>Chapter 34: Runes Cross-Reference</h2>
<h3>Runes Cross-Reference</h3>
<p>A rune is a spell that stopped moving. That is not a metaphor. - Professor Lun</p>
<h3>Using This Chapter</h3>
<p>Runes in Run Silent come from canonical compendium sources. This chapter does not restat them. It maps where rune tiers appear inside the Gloamreach so the Warden can prep rewards without drifting from core canon.</p>
<h3>Canonical Sources</h3>
<p>Every rune, technique, and power offered here is drawn from <strong>Awakened Arts</strong> - the Ability Catalogs (Runes, Techniques, Powers) and the Inscription System - with the <strong>Rune Vault in Vaults of the Rift</strong> for expanded rune options. This chapter does not restat them; it only maps where each tier surfaces inside the Gloamreach.</p>
<h3>Rune Drop Schedule</h3>
<figure class="campaign-table-wrap">
<figcaption>Rune Drop Schedule</figcaption>
<table class="campaign-table"><colgroup><col style="width:10%" /><col style="width:58%" /><col style="width:32%" /></colgroup><thead><tr><th>Tier</th><th>Gloamreach Source</th><th>Canonical Source</th></tr></thead><tbody>
<tr><td>D</td><td>The Hollow Way, Drowned Ledgerfen, early road encounters</td><td>Awakened Arts, Runes (D)</td></tr>
<tr><td>C</td><td>Fungal Depths, Remembering Orchard, Ashen Counting-House</td><td>Awakened Arts, Runes (C)</td></tr>
<tr><td>B</td><td>Sunken Tunnels, Bastion Golemfall, Mana Vein Node rewards</td><td>Awakened Arts, Runes (B)</td></tr>
<tr><td>A</td><td>Obsidian Spire, the Deep Places, the final crossing, Hayashi research trade</td><td>Awakened Arts, Runes (A)</td></tr>
<tr><td>S</td><td>Recovered from the place the Quiet fell, or the deepest dark, after the finale</td><td>Awakened Arts, Runes (S)</td></tr>
<tr><td>Technique</td><td>Vermillion training, Orin&#x27;s trials, Spire trials</td><td>Awakened Arts, Techniques</td></tr>
<tr><td>Power</td><td>Mana Vein network, Old Power Below bargains, Means awakenings</td><td>Awakened Arts, Powers</td></tr>
</tbody></table>
</figure>
<h3>Faction Rune Sources</h3>
<p>Bureau Dr. Hayashi and Professor Lun can identify or stabilize runes. Bureau access favors safety, documentation, and legal ownership. Vermillion Vermillion can sell restricted runes, apply dangerous modifications, and ignore Bureau paperwork. The price is money, favor, or leverage. Awoko The Awoko collect runes as grief-offerings. A Sanctum raid should yield at least one rune appropriate to the party&#x27;s level, plus evidence of how the cult weaponizes loss.</p>
<h3>The Old Power Below</h3>
<p>The Old Power Below can produce power-runes through bargain, sacrifice, or a truth the dark buried. These should be strong but costly. No bargain should feel random.</p>
<h3>Forbidden Runes</h3>
<p>The Bureau restricts runes tied to void, necrotic authority, compelled obedience, identity rewriting, or interference with the deep Gloamreach. Possession creates Bureau risk, but these runes may be exactly what the party needs against the Quiet.</p>
<h3>Rune Recovery After the Campaign</h3>
<p>After the finale - escape, kill, or become - the deepest places may give up as many as three S-tier runes. Choose runes that reflect the party&#x27;s ending, not only their combat builds.</p>
<p>AFA corrupted still: The Caller</p>
<h2>Chapter 35: Gloamreach Random Encounter Tables</h2>
<h3>Gloamreach Random Encounter Tables</h3>
<p>Every road here is a question. Most of them are traps. - Rat-King Ji</p>
<h3>Using These Tables</h3>
<p>Roll when the party travels between major Gloamreach regions, travels loud or lit, carries a piece of the Means openly, rests in the open, or spends too long debating on exposed ground. These encounters should not feel random in-world. The Quiet notices motion, noise, light, and the use of Essence.</p>
<h3>Table A - The Old Roads</h3>
<figure class="campaign-table-wrap">
<figcaption>Random Encounters: The Old Roads (d20)</figcaption>
<table class="campaign-table"><thead><tr><th>d20</th><th>Encounter</th></tr></thead><tbody>
<tr><td>1-2</td><td>The road goes on longer than it should. Lose time, food, or daylight, and the dark gets a turn.</td></tr>
<tr><td>3-4</td><td>A still figure stands at the verge, the party&#x27;s names already carved in the stone beside it in a hand none of them used.</td></tr>
<tr><td>5</td><td>A voice from off the road calls a name one of the party has lost.</td></tr>
<tr><td>6</td><td>A community bell tolls once, far off, then silence. Someone behind a wardline did not make it.</td></tr>
<tr><td>7</td><td>The party finds a broken Bureau marker from a team that has not entered yet.</td></tr>
<tr><td>8</td><td>Vermillion courier offers a shortcut for a price.</td></tr>
<tr><td>9</td><td>Awoko recruiter approaches the most grief-marked character.</td></tr>
<tr><td>10</td><td>Umbral Scout watches from a milestone. It flees if pursued.</td></tr>
<tr><td>11</td><td>Roadside shrine offers a small mercy with unclear ownership.</td></tr>
<tr><td>12</td><td>Mika&#x27;s drawing appears nailed to a tree. It depicts the next danger.</td></tr>
<tr><td>13</td><td>A corpse asks for directions, in a voice someone knows. It is patient.</td></tr>
<tr><td>14</td><td>Supplies spoil unless shared - the dark is hungrier where the living hoard.</td></tr>
<tr><td>15</td><td>A carried piece of the Means grows cold and pulls toward something deep.</td></tr>
<tr><td>16</td><td>Old Man Crane is sitting at a tea table in the road. He does not explain how.</td></tr>
<tr><td>17</td><td>The Quiet whispers. DC 14 Sense save or psychic strain and a lure in a voice you know.</td></tr>
<tr><td>18</td><td>Worn-dead sign. Fresh drag-marks, and footprints that stop, facing the way you came.</td></tr>
<tr><td>19</td><td>A safe-looking shelter, its door already open, and nothing inside that is wrong.</td></tr>
<tr><td>20</td><td>The worn dead converge - a lure, a wrong shape, the cold of the Quiet behind them. Run or hide; do not fight in the open.</td></tr>
</tbody></table>
</figure>
<h3>Table B - The Warded Communities</h3>
<figure class="campaign-table-wrap">
<figcaption>Random Encounters: The Warded Communities (d20)</figcaption>
<table class="campaign-table"><thead><tr><th>d20</th><th>Encounter</th></tr></thead><tbody>
<tr><td>1-2</td><td>A family asks the party to shelter someone the Quiet has marked.</td></tr>
<tr><td>3-4</td><td>A ward-keeper offers shelter - but the community&#x27;s rules come with it, and they are absolute.</td></tr>
<tr><td>5</td><td>A child draws a place the party has not visited.</td></tr>
<tr><td>6</td><td>Villagers deny a disappearance everyone clearly remembers.</td></tr>
<tr><td>7</td><td>Awoko comfort-worker offers real aid and subtle recruitment.</td></tr>
<tr><td>8</td><td>Vermillion scout buys settlement secrets for supplies.</td></tr>
<tr><td>9</td><td>Bureau survivor begs extraction from the Gloamreach.</td></tr>
<tr><td>10</td><td>The community&#x27;s hard bargain is revealed - what they do to keep the dark out. It is worse than rumored.</td></tr>
<tr><td>11</td><td>A worn-dead wanders in wearing a villager&#x27;s face, and no one is sure whose.</td></tr>
<tr><td>12</td><td>A ward has been defaced with creeping rot.</td></tr>
<tr><td>13</td><td>Someone recognizes a Quiet-Marked PC. They want them gone before dark.</td></tr>
<tr><td>14</td><td>A feast begins. Refusing is rude. Accepting is dangerous.</td></tr>
<tr><td>15</td><td>Missing person returns with no shadow.</td></tr>
<tr><td>16</td><td>A local rule makes no sense to outsiders. The party must keep it or risk the dark.</td></tr>
<tr><td>17</td><td>A Means clue hidden in a folk song, a prayer, or a name carved where it should not be.</td></tr>
<tr><td>18</td><td>A community asks the party to put down someone the Quiet has already half-taken.</td></tr>
<tr><td>19</td><td>Hollow Mother sermon overheard. She promises the grieving they can stop being prey.</td></tr>
<tr><td>20</td><td>The worn dead come for the community, not the party - and the wards may not hold.</td></tr>
</tbody></table>
</figure>
<h3>Table C - Wilds and Ruins</h3>
<figure class="campaign-table-wrap">
<figcaption>Random Encounters: Wilds and Ruins (d20)</figcaption>
<table class="campaign-table"><thead><tr><th>d20</th><th>Encounter</th></tr></thead><tbody>
<tr><td>1-2</td><td>Predator tracks circle the party&#x27;s camp from the future.</td></tr>
<tr><td>3-4</td><td>Adaptive beasts use a tactic the party used last session.</td></tr>
<tr><td>5</td><td>The dark deepens early after someone makes too much noise.</td></tr>
<tr><td>6</td><td>Ruined bastion patrol asks the party for an oath.</td></tr>
<tr><td>7</td><td>Fungal secret grows a mouth and repeats a confession.</td></tr>
<tr><td>8</td><td>Orchard fruit offers a memory. Eating it grants a clue and a cost.</td></tr>
<tr><td>9</td><td>Drowned voice asks to be named.</td></tr>
<tr><td>10</td><td>Broken road leads to the same milestone three times.</td></tr>
<tr><td>11</td><td>Anomaly swarm, rank appropriate.</td></tr>
<tr><td>12</td><td>Umbral Warrior patrol.</td></tr>
<tr><td>13</td><td>Awoko ritual site, currently unattended.</td></tr>
<tr><td>14</td><td>Vermillion salvage crew under attack.</td></tr>
<tr><td>15</td><td>Mana Vein flare. Gain one Rift Favor, then roll a complication.</td></tr>
<tr><td>16</td><td>A piece of the Means resonates, pointing underground.</td></tr>
<tr><td>17</td><td>The Old Power Below speaks through a cracked bell.</td></tr>
<tr><td>18</td><td>Silent battlefield of empty armor.</td></tr>
<tr><td>19</td><td>Moment of stillness. Safe short rest if no one speaks a true name aloud.</td></tr>
<tr><td>20</td><td>For a heartbeat the Quiet&#x27;s full attention turns on the party, closer than it should be.</td></tr>
</tbody></table>
</figure>
<h3>Ambient Events</h3>
<p>Roll once per long rest outside protected shelter.</p>
<figure class="campaign-table-wrap">
<figcaption>Ambient Events (d6)</figcaption>
<table class="campaign-table"><thead><tr><th>d6</th><th>Event</th></tr></thead><tbody>
<tr><td>1</td><td>The dark presses close. DC 14 Sense save or dreams impose psychic strain.</td></tr>
<tr><td>2</td><td>Food changes flavor to ash, blood, flowers, or hospital antiseptic.</td></tr>
<tr><td>3</td><td>A keepsake of someone they lost appears in someone&#x27;s pack.</td></tr>
<tr><td>4</td><td>A dead NPC speaks in a dream and offers true information.</td></tr>
<tr><td>5</td><td>The road outside has moved.</td></tr>
<tr><td>6</td><td>Small mercy. Regain 1 Rift Favor, but the Warden notes who granted it.</td></tr>
</tbody></table>
</figure>
<h2>Chapter 36: The Hunt Escalates - Pacing the Persecution</h2>
<h3>The Hunt Escalates</h3>
<p>Time in the Gloamreach is not measured in days. It is measured in how close the Quiet has come, and how much of you is left.</p>
<h3>Overview</h3>
<p>There is no countdown to a Rift Break and no Domain pressing toward the material world. The campaign escalates as persecution - the Quiet grows bolder, the safe-holds grow fewer, the worn dead thicken, and the party&#x27;s own fraying (Dread) and exhaustion mount - across four acts spanning Levels 1-10. Pace it by the Hunt Clock (see Running This Horror) and by what the party has done, never by a calendar. Use this as a pacing instrument. Advance the pressure when the party linger, rest carelessly, live loud, or push deeper; ease it, briefly, when they reach a true safe-hold or earn a native&#x27;s trust. Act I - First Contact (Levels 1-3) The slow wrong. The threshold seals, the AFA begins to lie, comms die, and the party meet their first natives - and learn, badly, that there are rules. The Quiet is felt, never seen: a silence where there should be sound, a wrong shape on a ridgeline. The first taking happens here - ideally an NPC, so the party learn what they face without losing one of their own first. The lesson lands: noise, light, and Essence draw it. The party either learn to run silent or pay. Goal: reach the first warded safe-hold alive, and begin to understand the wards. Act II - The Hunt (Levels 4-6) The party know now that they are prey. The Quiet hunts in earnest, mostly through the worn dead (the Worn, the Caller, the Wrong Shape), and trust begins to fray. The Hunt Clock fills faster; persecution set-pieces - stalk, hide, flee - become routine. The first time the Quiet wears a face the party knows - a lost teammate, a trusted native - Dread spikes and trust cracks. Safe-holds demand the party live by the rules; breaking one, even in ignorance, has consequences the whole community pays. Goal: survive the first time the Quiet takes one of them, and keep moving. Act III - The Long Dark (Levels 7-9) Desperate survival, and the first real understanding. The party push into the deeper Gloamreach, where the worn dead thicken into the Hollowed and the safe-holds fail. The party begin learning true things about the Quiet (see What the Natives Know and The Means to End It) - and the first hint that it might, in theory, be ended. Resources thin; the failing AFA gives nothing true; the dark is constant. Essence becomes nearly suicidal to use this deep; the party live or die on silence and the rules. Goal: learn enough to find a way out - or the first piece of the Means. Act IV - Threshold (Levels 9-10) The climax. The party have a way out, a desperate plan to end the Quiet, or both - and the Quiet knows it. The Hunt is total; the Quiet stops being</p>
<figure class="campaign-table-wrap">
<figcaption>The Means to End It</figcaption>
<table class="campaign-table"><thead><tr><th>Means</th><th>Typical Source</th><th>What It Unlocks</th></tr></thead><tbody>
<tr><td>A truth about the Quiet</td><td>Ledgerfen, Awoko contradictions, old power testimony.</td><td>The party can name what the Quiet is not.</td></tr>
<tr><td>A vessel or binding Relic</td><td>Obsidian Spire, Bastion oath-vaults, deep salvage.</td><td>The party can hold it in place long enough to matter.</td></tr>
<tr><td>A native rule or witness</td><td>Warded communities, Sister Veil, Mother Rust, road-keepers.</td><td>The party can survive the final route without brute force.</td></tr>
<tr><td>A route home</td><td>Bureau Annex, Threshold long dark, AFA ghost-pings.</td><td>Escape becomes possible, not easy.</td></tr>
<tr><td>A cost accepted openly</td><td>Final crossing and aftermath.</td><td>The ending belongs to the table instead of a stat block.</td></tr>
</tbody></table>
</figure>
</div>
`;

const ENDGAME_BODY = `
<div class="campaign-prose">
<h3>Endgame plate: True Form Cinematic</h3>
<h2>Chapter 28: The Deep Gloamreach - The Final Crossing</h2>
<h3>The Deep Gloamreach - The Final Crossing</h3>
<p>There is no door at the end. The end is the door you came in by - and the longest dark between you and it.</p>
<h3>Overview</h3>
<p>This is the keyed version of the finale&#x27;s crossing (see The Long Dark and the Threshold, Ch16): the deepest, darkest stretch of the Gloamreach, run as the campaign&#x27;s final dungeon - except the dungeon is open country and old dark, and the only room that matters is the sealed Threshold at the far end. Run it as a sequence of survival-horror stages, in whatever order the crossing takes them, with the Hunt Clock louder than it has ever been and the Quiet closing the whole way. This chapter keys the stages; Ch16 holds the Quiet&#x27;s behaviour at the end, the gated kill, and the endings.</p>
<h3>Before the Crossing</h3>
<p>Resolve what the party carry into the dark - it decides how the crossing goes:</p>
<p>Which communities trust them enough to hold a wardline open?</p>
<p>Which did they wrong, so the wards shutter early and the dark gets the gap?</p>
<p>Do they carry the Means, and are they 9th level or higher? (If so, the kill is on the table.)</p>
<p>Did they chart the Mana Veins (Ch32) - is there a deaf place to use?</p>
<p>Is the Hollow Mother&#x27;s ritual still active, and coming for the same dark they are?</p>
<p>Who have they already lost - because the Quiet is wearing them now.</p>
<h3>The Crossing, Keyed</h3>
<p><strong>The Last Road.</strong> The final stretch of exposed ground, and the most watched. The dark names each character here - a true name surfacing in carved stone, in a whisper, on the lips of a worn-dead waiting at the verge. Answer it, or accept it, and the crossing grows easier and the Quiet&#x27;s hold tighter (a step toward Quiet-Marked); refuse, stay silent and dark, and the road is longer but the dark keeps less of a grip. There is no toll and no gate - only how much of themselves the party give away to go faster.</p>
<p><strong>The Field of the Lost.</strong> Open ground where everything the Quiet has ever worn stands waiting: lost teammates, taken natives, the familiar faces the party learned to distrust, all of it between them and the deep. They do not rush. They call, in every grieved voice at once - all true, all bait. Crossing means walking through the people you failed without answering one of them. Dread save (DC 13 Sense), or a character spends a turn on the one they cannot leave.</p>
<p><strong>The Kept Things.</strong> A drowned hall of everything the Gloamreach has taken and saved: names, teeth, bells, wedding rings, children&#x27;s drawings, unopened letters, the keepsakes of the dead (see the narrative props, Ch27). A character who searches may recover a true prop - and with it a true name, a truth about the Quiet, or a piece of the Means - but every minute spent here fills the Hunt Clock, and the hall remembers being robbed.</p>
<p><strong>The False Safe-Hold.</strong> A warded-looking shelter, fires lit, a door standing open - everything the party have learned to run toward. It is the Quiet wearing a safe-hold. Resting here is real recovery and a trap: each character regains resources but must give the dark one true thing in trade (a memory, a name, a fear), and the worn dead are already inside, wearing the faces of hosts. A DC 14 Sense check feels the wrongness before the door closes.</p>
<p><strong>The Map of Every Step.</strong> A stretch where the dark shows the party their whole crossing - every choice, every shortcut, every person left behind - laid out like a map drawn by something that watched it all. It can reveal a real shortcut to the Threshold, the location of a missed piece of the Means, or a betrayal among allies; reading it costs a point of Dread, because it is also the Quiet showing them it has seen everything.</p>
<p><strong>The Room That Shouldn&#x27;t Exist.</strong> A scrap of the material world preserved impossibly in the deep dark: a Bureau office, a hospital corridor, a childhood kitchen - somewhere a character knows. It holds the Unopened Commendation and curated &quot;evidence&quot; of a life. None of it is the Quiet&#x27;s past; all of it is bait, assembled from the claimed to make the party stay. The horror is how badly they want it to be real.</p>
<p><strong>The Last Memory-Bloom.</strong> A deep echo of the Remembering Orchard: black-barked growth fruiting memory in the dark. One fruit can restore a lost clue or a piece of the Means; one can show a true thing about the Quiet&#x27;s origin (a hint, never the whole). Each costs the eater a warm memory of their own, and the bloom never says which.</p>
<p><strong>The Awoko&#x27;s Last Bid.</strong> If the Hollow Mother&#x27;s ritual still runs: the cult break into the deep here, racing the party to the same dark - to be remade by the Quiet into hunters (Ch33). They are a threat and a possible distraction: the Quiet&#x27;s attention can be turned on them instead, at the cost of whatever the party owe the Awoko, and whatever the cult becomes if it succeeds.</p>
<p><strong>The Old Power Below.</strong> A stair going down past where the Quiet hunts, toward the remnant of whatever stood here first (the Old Power Below, Ch26 and Ch32). A party that descends can bargain for the last truth of the Means - or the answer to the Quiet&#x27;s origin - but it costs time the Hunt Clock does not forgive, and it may change the ending.</p>
<p><strong>The Wardline That Remembers.</strong> The last native wardline before the Threshold, and it knows the party. Every safe-hold they honored, every rule they kept, holds it open one breath longer; every betrayal shutters it. If a community loved them, a ward-keeper waits here, ready to build the once-only ward-circle the Means requires (Ch27) - the place a kill can be made to stay dead.</p>
<p><strong>The Threshold.</strong> The sealed door they came in by, exactly as they left it. Reopening it is the campaign&#x27;s last hard choice - escape through it, or turn and spend the Means on the kill (Ch16). The Quiet arrives as they work. Whatever happens here, happens fast, in the dark, with the whole country holding its breath. The Quiet at the Threshold The Quiet&#x27;s behaviour at the end - the lure, the unleashed hunt, and the gated kill - is detailed in Ch16 (The Long Dark and the Threshold). In short: it offers before it attacks, wearing the dead and the way out; holding to what is true is what gets the party through; and a kill is possible only at 9th level or higher with the full Means, which drags it down to something a level-10 party can end.</p>
<h3>The Endings</h3>
<p>The crossing ends one of three ways - Escape, Kill, or Become - all detailed in Ch16, and all left open for what comes after. Nothing in the Gloamreach is ever quite finished.</p>
<h3>Warden Guidance</h3>
<p>The crossing should be frightening because it knows the campaign. Bring back choices, names, lies, saved natives, abandoned ones, unpaid debts, and old kindnesses - and the dead the party made along the way,</p>
<h3>Bureau Signet Ring</h3>
<h3>Aether-Charged Crystal</h3>
<p>Map to a Settlement Cache</p>
<h3>Obsidian Prism</h3>
<h3>Mirror-Self Shard</h3>
<h3>Deep Iron Plate</h3>
<h3>Unopened Commendation</h3>
<h3>Awoko Grief-Tattoo</h3>
<h3>Relic Forge Pattern</h3>
<h3>Bureau Prosthesis Blueprint</h3>
<h3>Quiet&#x27;s Edge</h3>
<h3>Threshold Aegis</h3>
<h3>Origin Reliquary</h3>
<h3>The Hunter&#x27;s Mantle</h3>
<h3>Archive Mirror Shard</h3>
<h3>The Crown of Silence</h3>
<p>Shard of the Deep</p>
<h2>Appendix F - The Persecution Track</h2>
<p>This is the campaign&#x27;s escalation arc - <strong>not a calendar and not a clock</strong>. The Gloamreach imposes no deadline, and there is no Rift Break countdown (see Chapter 36): a Rift Break here is caused by what people do - reckless Essence use, broken wards, the Quiet fed and unchecked - never by time running out. The party may take as long as they need. These beats advance as the party push deeper, earn and spend trust, and draw the Quiet&#x27;s attention - persecution that intensifies in answer to their choices. Run them in roughly this order, and skip, reorder, or hold any beat to follow the table rather than the page.</p>
<figure class="campaign-table-wrap">
<figcaption>The Persecution Track - Campaign Escalation Beats</figcaption>
<table class="campaign-table"><colgroup><col style="width:8%" /><col style="width:24%" /><col style="width:68%" /></colgroup><thead><tr><th>Act</th><th>Beat</th><th>Effect</th></tr></thead><tbody>
<tr><td>I</td><td>Threshold Opens</td><td>The party completes the Bureau briefing, requisition, AFA sync, and first-entry survey.</td></tr>
<tr><td>I</td><td>Threshold Day</td><td>The party crosses the Rift as the first team in, and discovers the Rift is only the door. The exit becomes unreliable, the old roads turn dangerous, and something vast and patient in the dark takes notice of the first living things to come through in a very long time. <em>Bureau +1 if the party reports the truth instead of sanitizing it.</em></td></tr>
<tr><td>I</td><td>First Loss</td><td>A nearby community loses someone to the dark - or the party watch it pay the hard price that keeps its wards lit. The Drowned Ledgerfen wakes and begins making the dead, and the not-yet-dead, dangerously real. <em>Independent Survivors +2 if the party protects civilians without exploiting them.</em></td></tr>
<tr><td>I</td><td>The Road Learns</td><td>The old roads begin responding to party choices. Anyone who gave a true name, made noise, burned Essence, or carried a piece of the Means feels watched.</td></tr>
<tr><td>I</td><td>Hayashi&#x27;s Warning</td><td>A delayed Bureau transmission reaches the party. Dr. Hayashi confirms the Gloamreach is an uncleared, inhabited Interior with an apex predator that cannot be cleared by force - only survived, or fled. <em>Bureau Trusted path opens if the party shares field evidence.</em></td></tr>
<tr><td>II</td><td>The First Taking</td><td>The Quiet takes someone - a native, a straggler on the road, a face the party half-knew. The worn dead do it, and they speak names before they take. The party can flee, hide, give the dark what it came for, or, uselessly, fight. <em>Civilian trust shifts sharply based on whether the party protects the marked or lets the dark have them.</em></td></tr>
<tr><td>II</td><td>The Cult Moves</td><td>Awoko comfort-workers begin open recruitment in grief-dense places. The Hollow Mother sends a sermon, dream, or private message. Her followers say serve. She says become. <em>Awoko reputation and suspicion rise. Sister Veil defection path can open.</em></td></tr>
<tr><td>II</td><td>The Dark Tightens</td><td>Travel grows harder. Safe rests require a community&#x27;s wards, a faction&#x27;s shelter, or a place the party have learned to ward. Bastion Golemfall and the Sunken Tunnels become active routes.</td></tr>
<tr><td>II</td><td>Crane&#x27;s Memory</td><td>Old Man Crane offers hard lore, or warns the party that some hunts end only by sacrifice. If ignored, he goes alone into the deep dark. <em>Independent Survivors +1 if the party honors Crane&#x27;s warning instead of treating him as a weapon.</em></td></tr>
<tr><td>II</td><td>The Hollow Mother Declares</td><td>Awoko pamphlets, songs, and sermons spread through settlements. Civilian unrest rises. The cult claims the Quiet offers a way to stop being prey - to be remade into a hunter. <em>Awoko +2 if unopposed; Bureau and Independent trust may drop if the party ignores recruitment.</em></td></tr>
<tr><td>III</td><td>The Means Surfaces</td><td>If the party have recovered a piece of the Means, the dark and the Awoko both move to take it back. If they have none, a deep place offers a first true glimpse of what the Quiet is.</td></tr>
<tr><td>III</td><td>Bureau Crisis</td><td>Central Command orders the Annex to prioritize Relic extraction over survivor recovery. Commander Park obeys, delays, or defies this order depending on party reputation and evidence recovered. <em>Bureau final-operation support depends on how the party handles Park&#x27;s choice.</em></td></tr>
<tr><td>III</td><td>Ritual of Becoming</td><td>The Awoko Sanctum reaches full ritual strength. If not disrupted, the Hollow Mother gains leverage over the final act and may try to make herself a new hunter as the party near the Threshold. <em>Awoko power rises. Sister Veil, Mara, or Whisper can still disrupt the rite if saved.</em></td></tr>
<tr><td>III</td><td>Final Preparations</td><td>All major factions understand the final crossing is near. Allies must be chosen, debts come due, settlement trust is counted, and the old roads offer the shortest route under the worst terms. <em>All faction support is locked at the end of this stage unless the Warden allows a final dramatic reversal.</em></td></tr>
<tr><td>III</td><td>The Threshold</td><td>The climax. The party make their last crossing through the deep dark to the sealed Threshold - to escape, or, with the Means assembled and at Level 9+, to make the one stand that ends the Quiet. Outside the Rift the Bureau floodlights gutter; inside, the Gloamreach goes utterly silent for the first time. If the party are not ready, escalate the hunt rather than forcing an ending by fiat. <em>All faction reputations convert into final-operation support, betrayal, neutrality, or obstruction.</em></td></tr>
</tbody></table>
</figure>
<h2>Appendix G - Handouts</h2>
<p>Emergency Clearance: S-Rank Rift Entry PLAYER</p>
<h3>EMERGENCY CLEARANCE</h3>
<p>You are cleared for entry into the Gloamreach Rift Interior under crisis authority. Return conditions: hostile neutralized, threshold re-secured, or emergency evacuation. (The interior may permit none of these.) The Bureau accepts no liability for Anomaly exposure, Essence contamination, Relic corruption, psychological casualty, or failed extraction after threshold closure. AFA Alert: Rift Interior Scale PLAYER</p>
<h3>AFA ALERT</h3>
<p>Rift threshold stabilized. Interior mapping exceeds standard bounded Rift parameters. Interior estimate: country-scale realm, old and inhabited. Apex classification: a single intelligence that owns the dark; uncleared, likely unclearable. Recommendation: do not enter without S-Rank command approval. Override: emergency entry authorized.</p>
<h3>Native Survival Card PLAYER</h3>
<h3>WHAT THE NATIVES TELL YOU</h3>
<p>Stay quiet. Stay dark. Never use the power if you can help it. Do not answer a voice you know after dark. Do not speak your true name where the walls can hear. Be behind a wardline before the grey light fails. If it offers you something, it has already decided to take you.</p>
<h3>Map Fragment: The Old Roads PLAYER</h3>
<h3>OLD ROADS FRAGMENT</h3>
<p>The roads are the fast way and the exposed way. Walk them by grey light, in silence, never alone. Marked safe-holds: Rift Threshold, Warded Hamlet, Vermillion Outpost, Drowned Ledgerfen, Remembering Orchard, Bastion Golemfall, Obsidian Spire. Warning written in red pencil: &quot;If you hear your name from off the road, do not answer. Do not even look.&quot;</p>
<h3>Warded Hamlet House Rules PLAYER</h3>
<h3>HOUSE RULES</h3>
<p>This community keeps the dark out by keeping these rules. Guests keep them too, or leave before dusk. Bar every door at the second bell after dusk. Burn no open light the dark can see. Use no Essence within the wards. Speak no sleeper&#x27;s name aloud after dark. Break a rule and the wards will not protect you - and may not protect the rest of us either.</p>
<h3>Vermillion Outpost Price Board PLAYER</h3>
<h3>VERMILLION OUTPOST PRICE BOARD</h3>
<p>Soup: 1 clean core shaving. Surgery: 3 clean Essence ampoules or future salvage share. AFA battery: market rate plus oath. Relic appraisal: free if we keep first refusal. Rescue party: negotiable. Not cheap. Never free.</p>
<h3>Bureau Annex Last Order PLAYER</h3>
<h3>LAST ORDER</h3>
<p>All teams will hold assigned corridors until command updates the retreat route. Do not abandon sealed supply rooms. Do not answer anything that wears a face you know. Do not deviate from Rank doctrine. Addendum, unsent: there is no retreat route.</p>
<h3>Bureau Casualty Tag PLAYER</h3>
<h3>CASUALTY TAG</h3>
<p>Name: unreadable due to ash damage. Rank: C provisional. Cause: taken, then recovered by chance. Notes: subject remained combat-effective after fatal wound for forty-seven seconds. Recommend commendation if remains recoverable.</p>
<h3>Mill Work Token PLAYER</h3>
<h3>MILL TOKEN</h3>
<p>Bearer is permitted through the outer wheelhouse for one shift. No weapons beyond the red line. No questions in the rendering room. No refunds for partial processing.</p>
<h3>Remembering Orchard Harvest Instructions PLAYER</h3>
<h3>REMEMBERING ORCHARD HARVEST</h3>
<p>Cut only white-veined fruit. Do not bleed near open flowers. If fruit speaks, destroy it. If fruit cries, leave the row immediately. If the orchard turns toward you, kneel until it loses interest.</p>
<h3>Aegis Oath Plate PLAYER</h3>
<h3>AEGIS OATH</h3>
<p>Hold the line. Hold the door. Hold the wounded. Hold when command fails. Hold when law becomes teeth. Hold until holding becomes the only part of you left.</p>
<h3>Awoko Becoming Hymn PLAYER</h3>
<h3>HYMN OF BECOMING</h3>
<p>The prey runs because prey must run. The hunter waits because hunters can. Why stay the hunted, the Mother asks, when the dark has shown the way? Give grief and be spared. Give blood and be remade. Give all, and become.</p>
<h3>Awoko Defector&#x27;s Mark PLAYER</h3>
<h3>DEFECTOR MARK</h3>
<p>A copper mask split down the mouth. Anyone wearing this inside the Sanctum is marked for capture, not immediate execution. The Hollow Mother wants defectors to sing apology before they die.</p>
<h3>The Old Power - Consent Form PLAYER</h3>
<h3>CONSENT FORM</h3>
<p>State the desired effect. State the acceptable cost. State whether the cost may be collected later. Silence will be interpreted as consent to delayed collection.</p>
<h3>The Old Power - Bargain Record PLAYER</h3>
<h3>BARGAIN RECORD</h3>
<p>The offer worked. That is the problem.</p>
<h3>Effect granted</h3>
<h3>Precedent established</h3>
<h3>Visible consequence</h3>
<h3>Ending consequence</h3>
<h3>Predator Woods Trail Sign PLAYER</h3>
<h3>TRAIL SIGN</h3>
<p>Three cuts in black bark: pack road. Four cuts: breeding ground. Five cuts: turn back. Six cuts: you are already being tested.</p>
<h3>White Heron Seal Notes PLAYER</h3>
<h3>WHITE HERON SEAL</h3>
<p>The Quiet does not need to die for the way out to open - but it must be held.</p>
<h3>Requirements</h3>
<p>The Quiet forced into a silence and dark it cannot slip. The Means assembled: a truth, a way to hold it, a way to make it stay. A willing Ascendant to bear the backlash at the Threshold. A native ward-circle, built once, that the dark cannot cross. Failure feeds the dark, and the door stays shut. A Note in a Familiar Hand PLAYER A NOTE, IN A HAND YOU KNOW I have been waiting for you. It has been so long. The way is just a little further in. Come and rest - you are so tired, and I have kept everything exactly the way you remember it. Bring the others. But come. (There is no signature. There does not need to be. You know the handwriting.)</p>
<h3>Safe-Passage Token PLAYER</h3>
<h3>SAFE-PASSAGE TOKEN</h3>
<p>A native ward-token. The bearers may pass one community&#x27;s wardline once, in peace, by its keepers&#x27; leave. Invalid if copied, burned, mocked, bloodied, folded into a weapon, or shown without the keeper&#x27;s name.</p>
<h3>The Final Crossing - Routes PLAYER</h3>
<h3>THE FINAL CROSSING - ROUTES</h3>
<p>The Last Road: open, watched by the worn dead, survivable if silent. Bastion Tunnel: mapped, collapsed, full of old oaths. Awoko Breach: hidden, grief-choked, unstable. Obsidian Spire Route: high, reflective, costly. The Old Power Below: immediate, never free.</p>
<h3>The Old Wards Fragment PLAYER</h3>
<p>THE OLD WARDS (a native fragment) What is loud is found. What is bright is found. What is strong is loudest of all. A name spoken is a name given. A door left open after dark is an invitation, whether you meant it or not. The dead do not knock. They are simply, suddenly, inside. A ward kept is a life kept. A ward broken is everyone&#x27;s.</p>
<h3>Rift Break Warning PLAYER</h3>
<h3>RIFT BREAK WARNING</h3>
<p>Containment thinning. Interior conditions detected at the threshold. Anomaly migration probable. Something inside is pressing on the boundary from the dark side. Clear state required immediately.</p>
<h3>Ending Ledger PLAYER</h3>
<h3>ENDING LEDGER</h3>
<p>The Quiet&#x27;s fate (escaped / killed / a new hunter rose):</p>
<h3>Survivors extracted</h3>
<h3>Communities saved</h3>
<h3>Communities lost</h3>
<h3>What the Old Power Below was owed</h3>
<h3>Bureau public report</h3>
<h3>Truth known to the party</h3>
<h3>Warden Quick Reference WARDEN</h3>
<h3>QUICK REFERENCE</h3>
<p>Fill the Hunt Clock, visibly, every time they live loud. Every safe place has a cost and a rule. Every Relic has a desire. Every bargain leaves its mark. The Quiet is not waiting at the end. It has been listening since the door closed.</p>
<h2>Appendix H - Warden&#x27;s Secrets</h2>
<p>Secret 1 - What the Quiet Is WARDEN-SECRET Warden ONLY. The Quiet is not, and was never, a person. It is the apex of the Gloamreach - old, vast, patient, hungry, and answerable to nothing. Whether it was always here or climbed out of being prey long ago (see the Obsidian Spire) is the campaign&#x27;s deepest open question, and a piece of the Means. It did not lose its humanity. It never had any to lose. Everything the party finds that suggests otherwise is bait. The Gloamreach keeps the relics of everyone it has taken - a Bureau Room that cannot exist, the Faded Family Photo, an Unopened Commendation, the recovered witness&#x27;s Wedding Ring - and the Quiet wears the dead so perfectly that the party will be tempted to believe there is someone in there to save. There is not. The grief is real; those keepsakes belonged to real people the dark took. But none of them are it. Play it so it lands: the party may spend the campaign hoping the thing wearing their dead can be reasoned with or redeemed, and learn - too late, or just in time - that the comfort was assembled, out of people they loved, to be reached for. Reveal tools: the Faded Family Photo, the recovered witness&#x27;s Wedding Ring, the Unopened Commendation, the deep places, the Obsidian Spire&#x27;s Watcher, Old Man Crane&#x27;s testimony, or the Old Power Below - each a piece of the truth the party can earn. Secret 2 - The Means Is the Only Way to End It WARDEN-SECRET Warden ONLY. The Quiet cannot be killed by force; ordinary harm barely marks it, and it withdraws into the dark to come again. The only way to end it is the Means, assembled in play and never handed over (see The Means to End It): A truth about what it is - and whether it was always here. A way to hold it still - forced silence and dark, a true name, a ward turned inward; a real Relic or working that can pin a thing never fully there. A way to make it stay dead - the Threshold, a ward-circle the natives build only once, or the dead-silent heart of a Mana Vein. With all of it, and at 9th level or higher, the party can drag the Quiet down - for one brutal scene at the Threshold - into something they can actually kill. Without it, the attempt is a way to die. Escape is always the surer victory.</p>
<p>Secret 3 - The Hollow Mother Wants to Become WARDEN-SECRET Warden ONLY. The Awoko Cult does not simply hide from the Quiet. The Hollow Mother intends to become something like it - to feed it enough grief, and enough of her own flock, that it remakes her into a hunter the dark will never touch. Her followers say they serve, comfort, or remember. She rarely uses those words. Her true verb is become. If the party weaken the Quiet&#x27;s grip on a region but fail to disrupt the Ritual of Becoming, the Hollow Mother can become an endgame complication - racing them into the deep dark, trying to make herself a second apex at the worst possible moment (see Ch33 and the final crossing). Secret 4 - The Worn Dead Can Be Outrun, Not Outfought WARDEN-SECRET Warden ONLY. The worn dead - the lures and hunters the Quiet sends ahead (the Worn, the Caller, the Wrong Shape, the Hollowed) - are terrifying because there is always another. Put one down and it means nothing; the dark simply wears another face. They are limited only in this: they come for what the Quiet has marked, and they hunt by the same things it does - noise, light, Essence. The party can turn the hunt aside without winning a fight by going silent and dark, hiding a marked one&#x27;s name and scent, reaching a wardline, speaking a true name to break a lure, crossing running water or a hard threshold, or, at terrible cost, giving the dark what it came for. This is the campaign&#x27;s clearest lesson: surviving the Gloamreach means understanding what it is, not only hitting harder. Secret 5 - The Hunt Is Pressure, Not Railroad WARDEN-SECRET Warden ONLY. The Gloamreach has no countdown to a Rift Break and no clock ticking toward a final boss. The campaign escalates as persecution (see The Hunt Escalates): the Quiet grows bolder, the safe-holds fewer, the worn dead thicker, and the party&#x27;s Dread and exhaustion mount - paced by the Hunt Clock and by what the party do, never by a calendar. If the party act decisively, reward it. If they delay, rest carelessly, or live loud, escalate: a safe-hold falls, a known native is taken and worn, the worn dead hunt in daylight, the dark spreads to more of the map. The pressure should keep them hunted - never safe for long, always one rule behind. It should not steal agency. Plot Beat - The Faded Family Photo PLOT-BEAT The Faded Family Photo is the strongest emotional prop in the campaign - a lost face worn down to blank paper. It can be recovered in the Drowned Ledgerfen or deep in the Gloamreach. If the party carry it, the Quiet learns that face, and may one day wear it back at them - calling in that voice, from the dark, at the worst possible moment. Play it ambiguously: a genuine echo of someone the dark took, or a predator performing exactly the reunion the party most want to see. Either reading can buy a beat of doubt, colder resolve, or a fragile opening - and either way, it is bait.</p>
<h3>Plot Beat - Blackwood&#x27;s Classified Mission PLOT-BEAT</h3>
<p>Agent Kira Blackwood was sent to read pre-threshold resonance - the first hint of the Means surfacing on the material side - before the Bureau had confirmed the Gloamreach was an uncleared, inhabited Interior. Her findings are classified above the party&#x27;s clearance. She is not working against them. Her danger is institutional loyalty under pressure: she may withhold classified data, default to protocol when instinct says otherwise, or level with the party - depending on how they handle Bureau trust. Use Blackwood to show that the Bureau can be brave in the field and bound by caution at command level at the same time - overwhelmed and rule-bound, never dishonest.</p>
<p>Plot Beat - Sister Veil Can Break the Chant PLOT-BEAT Sister Veil knows the Ritual of Becoming math is wrong. She does not begin as a hero. She begins as someone honest enough to admit the numbers prove her faith will consume its own followers, and offer them to the dark for nothing. If the party give her evidence and protect her during the Sanctum raid, she can corrupt the final chant and stop the Hollow Mother from being remade during the finale.</p>
<h3>Pressure Clock - Quiet-Marked PRESSURE-CLOCK</h3>
<p>Track whether each character becomes Quiet-Marked. This is the dark having their name (see the Hollow Way and the Name-Gate). A marked character is easier for the Quiet and its worn dead to recognize, single out, and hunt; the worn dead come for them first. They may also receive dreams and messages through reflective surfaces. Common triggers: speaking or giving a true name to the dark, accepting dangerous false-safety, being struck by a name-gate backlash, reading one&#x27;s own name on the road or the walls, or carrying a piece of the Means openly. Removal: the Quiet is ended, the character makes it back across the Threshold, or a major Relic-tier intervention takes a name back from the dark.</p>
<h3>Pressure Clock - The Hunt PRESSURE-CLOCK</h3>
<p>Use the campaign timeline in Appendix F for the full persecution track - pressure paced by the Hunt Clock and the party&#x27;s choices, not a calendar. Key beats by act: Act I (L1-3) - First Contact: the threshold seals, the AFA lies, the first taking (ideally an NPC). Act II (L4-6) - The Hunt: the worn dead hunt in earnest; the first time the Quiet wears a face the party know. Act III (L7-9) - The Long Dark: safe-holds fail; the party learn the first true things about the Quiet and assemble the Means. Act IV (L9-10) - Threshold: escape, or the one gated-kill stand.</p>
</div>
`;

const APPENDIX_ALLIES_BODY = `
<div class="campaign-prose">
<p>patient. The party run for the threshold to escape, or commit to the gated kill (L9+ and the Means assembled; see The Means to End It and the Threshold chapter). Either way it costs. Someone may not make it out. The natives who helped them cannot leave at all. Goal: escape, or put the Quiet down - and live with which. Advancing the Pressure (when the party stall) When the party delay, rest carelessly, or live loud, escalate. Choose one:</p>
<p>A safe-hold the party relied on falls - a rule broken, a ward failed, the people gone or worn.</p>
<p>The Quiet takes someone the party was protecting, and wears them back.</p>
<p>The worn dead grow bolder, hunting in daylight and behind wardlines.</p>
<p>A native who knew the rules - and the way out - is lost, and the party&#x27;s map goes dark.</p>
<p>The dark itself spreads: more of the Gloamreach becomes exposed ground, fewer places safe.</p>
<p>The Quiet shows itself, fully, for a heartbeat - and the next scene&#x27;s Hunt Clock starts half-full.</p>
<h3>Warden Guidance</h3>
<p>This is pressure, not a railroad. Its purpose is to keep the party hunted - never safe for long, always one rule behind, always aware the Quiet is closer than it was. Clever, quiet, disciplined play should buy time and lives; carelessness should cost them.</p>
<h2>Appendix A - Recruitable Allies</h2>
<p>Commander Park Jae-won - Bureau Domain Response Commander <strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 8 - <strong><strong>AC:</strong></strong> 18 - <strong><strong>HP:</strong></strong> 95 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex <strong><strong>Job:</strong></strong> Destroyer A battle-scarred commander with mana-reinforced prosthetics and a voice trained to stay calm while the map collapses. Park commands the material-side Annex outside the Gloamreach threshold. Personality. Stern, clipped, protective, and unwilling to confuse protocol with courage once civilians are at risk. Motivation. Prevent a Rift Break, recover missing teams, and keep Central Command from sacrificing survivors for clean reports.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Fortification Aura, Command Strike, Hold the Line</p>
<p><strong>Recruit:</strong> Cannot be recruited - Commander Park answers to the Bureau chain of command. Earn Bureau Trusted reputation and he fights as a staunch field ally, but he will not abandon his post to join a party or guild.</p>
<h3>Quartermaster Lin Mei-hua - Cordon Supply Officer</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 38 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex - Armory <strong><strong>Job:</strong></strong> Technomancer A meticulous logistics officer who tracks every ration, glow rod, and field dressing with near-religious intensity. Personality. Anxious, precise, quietly compassionate, and more generous when no one is watching. Motivation. Keep the Annex supplied long enough for the party to matter.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Equipment Maintenance, Inventory Mastery, Emergency Fabrication</p>
<p><strong>Recruit:</strong> Cannot be recruited - Bureau supply officer. Protect the Annex line and she keeps the party resupplied as an ally, but she serves the Bureau, not a guild.</p>
<h3>Sergeant Yoon Hye-jin - Domain Scout Leader</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 52 - <strong><strong>Location:</strong></strong> Patrol routes on the old roads <strong><strong>Job:</strong></strong> Stalker A quiet scout with chalk marks on her gloves and a habit of checking exits even in rooms she has already cleared. Personality. Pragmatic, watchful, loyal, and economical with words. Motivation. Find her missing scouts and learn why the old roads keep returning their signals from impossible directions.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Shadow Step, Anomaly Sense, Precision Strike</p>
<p><strong>Recruit:</strong> Cannot be recruited - Bureau scout leader. Resolve the Missing Strike Team and she ranges alongside the party as a Bureau ally, never as a recruit. Dr. Serin Hayashi - Rift Interior Researcher <strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 42 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex -</p>
<h3>Evidence Locker</h3>
<p><strong><strong>Job:</strong></strong> Esper A brilliant field researcher with ink-stained cuffs, too many notes, and the courage to say that the Gloamreach is law before it is terrain. Personality. Fast-talking, compassionate, intellectually reckless, and more frightened of bad assumptions than monsters. Motivation. Prove that the thing inside the Gloamreach cannot be cleared - only survived, or fled.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Analyze Weakness, Aetheric Shield, Interior Theory</p>
<p><strong>Recruit:</strong> Cannot be recruited - Bureau researcher. Protect her work and she becomes a vital ally and quest- giver, but she stays with the Bureau.</p>
<h3>Agent Kira Blackwood - Bureau Intelligence Operative</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 17 - <strong><strong>HP:</strong></strong> 58 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex - Intelligence desk <strong><strong>Job:</strong></strong> Stalker A pale intelligence agent with controlled movements, half-truths, and classified orders involving pre- threshold Relic activity. Personality. Cold, dry, observant, and capable of empathy she treats as an operational weakness. Motivation. Complete her mission without letting Central Command turn the Gloamreach&#x27;s horrors into a weapon.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Infiltration, Dead Drop</p>
<p>Counter-Intelligence Recruit. Cannot be recruited - Bureau intelligence operative under standing orders. Complete her quest to turn her into an ally against Central Command, but never a party recruit.</p>
<h3>Corporal Deng Wei - Heavy Weapons Specialist</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 48 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex - Field kitchen <strong><strong>Job:</strong></strong> Destroyer A broad-shouldered gunner and former chef whose field cannon is nearly as large as his guilt. Personality. Gentle, exhausted, brave when others need him, and ashamed of fear he earned honestly. Motivation. Stand his ground when the worn dead come for someone he can protect.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Suppressing Fire, Heavy Hitter, Fortify Position</p>
<p><strong>Recruit:</strong> Help Deng survive a nightmare scene and later face the worn dead without mocking his fear.</p>
<h3>Comms Officer Reyes - Signal Specialist</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 28 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex - Relay room <strong><strong>Job:</strong></strong> Technomancer A young signal specialist who receives transmissions out of order and keeps answering anyway. Personality. Fast, anxious, brilliant, and allergic to silence. Motivation. Decode the Gloamreach&#x27;s signals and prove the messages from tomorrow are warnings, not hallucinations.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Signal Boost</p>
<p>Decrypt</p>
<h3>Aetheric Jammer</h3>
<p><strong>Recruit:</strong> Cannot be recruited - Bureau signals officer. She relays intel and fire support as an ally, but she holds the Annex relay, not a guild seat.</p>
<h3>Warden-Aspirant Sato Ken - Bureau Recruit</h3>
<p><strong><strong>Faction:</strong></strong> Bureau Sentinels - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 22 - <strong><strong>Location:</strong></strong> Bureau Domain Response Annex - Barricade lobby <strong><strong>Job:</strong></strong> Holy Knight A terrified recruit in armor that does not fit, carrying more courage than training. Personality. Earnest, frightened, stubborn, and desperate to be useful. Motivation. Become worthy of the badge before the Domain teaches him what badges cost.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Determination, Quick Learner</p>
<p>Inspire Recruit. He joins if asked, though Park warns the party not to mistake willingness for readiness.</p>
<h3>Grist - Arms-Dealer</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 40 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Armoury stall <strong><strong>Job:</strong></strong> Technomancer The Outpost&#x27;s weapons-fence: salvaged edged steel, Relic-arms the Domain grew teeth into, and Essence-cells for anything that drinks them. Personality. Cheerful, amoral about buyers, deadly serious about misfires. Motivation. Arm anyone who can pay, then sleep at night by never selling a curse he hasn&#x27;t named.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Salvaged Arsenal, Relic-Weapon Lore, Essence-Cell Supply</p>
<p><strong>Recruit:</strong> Return a Relic-weapon that turned on its buyer; he repays it in better steel.</p>
<h3>Quill - Memory-Broker</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 30 - <strong><strong>Location:</strong></strong> Vermillion Outpost / Covered Market <strong><strong>Job:</strong></strong> Esper A trader in memory-cores harvested from the Remembering Orchard, who can sell you a skill, a language, or a stranger&#x27;s happiest day - at the price of a little of your own. Personality. Smooth, melancholy, scrupulous about consent in a trade everyone else cheats. Motivation. Keep the memory-trade honest in a Domain that wants it predatory.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Memory Appraisal, Skill-Core Transfer, Detects Stolen Memory</p>
<p><strong>Recruit:</strong> Recover a stolen memory-core and let him return it instead of selling it.</p>
<h3>Captain Doe - Smuggler-Captain</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 46 - <strong><strong>Location:</strong></strong> The roads / Vermillion Outpost <strong><strong>Job:</strong></strong> Stalker Runs contraband - people, Relics, and forbidden Runes - between settlements along roads the Domain has not finished closing. Personality. Cool, calculating, sentimental about exactly one thing she will never name. Motivation. Move what the Domain forbids, and get every passenger to the other end breathing.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Smuggling Routes, Hidden Cargo, Outruns the Worn Dead</p>
<p><strong>Recruit:</strong> Help her run a cargo of refugees past a worn-dead picket without paying in names.</p>
<h3>Tallow - Charm-Seller</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 24 - <strong><strong>Location:</strong></strong> Covered Market / road camps <strong><strong>Job:</strong></strong> Contractor A peddler of wards, tokens, and anti-Quiet-Marked charms - most of them comforting junk, a precious few of them genuinely real. Personality. Patter-fast, superstitious in earnest, kinder than the grift suggests. Motivation. Sell hope by the handful, and slip the real charms to the people who truly need them.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Genuine Ward (rare), Reads the Marked, Sells Hope</p>
<p><strong>Recruit:</strong> Catch him slipping a real charm to a doomed family, and keep his secret.</p>
<h3>Cinder - Deep-Salvage Diver</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 42 - <strong><strong>Location:</strong></strong> Vermillion Outpost <strong><strong>Job:</strong></strong> Stalker A native salvager who goes into the places that kill everyone else and comes back with the cores to prove it. Personality. Reckless, generous, and superstitious about owed favours. Motivation. Pull enough Essence to buy her crew off the Domain&#x27;s rolls for good.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Hazard Instinct, Core Extraction, Holds Her Breath</p>
<p><strong>Recruit:</strong> Bring her crew home from a dive gone wrong; she pays her debts in blood, not coin.</p>
<h3>Old Vell - Relic-Appraiser</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 36 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Appraisal stall <strong><strong>Job:</strong></strong> Technomancer A half-blind native fence who can tell you exactly what a Relic does, and exactly what it will cost you. Personality. Dry, patient, and honest about prices and nothing else. Motivation. Keep the Outpost&#x27;s stock moving and its worst Relics out of the wrong hands.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Relic Lore</p>
<p>Curse-Sense</p>
<h3>Names a True Price</h3>
<p><strong>Recruit:</strong> Bring him a Relic no one else can identify; respect his appraisal even when it costs you.</p>
<h3>Pip - Apprentice Runner</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 1 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 12 - <strong><strong>Location:</strong></strong> Vermillion Outpost / the roads <strong><strong>Job:</strong></strong> Stalker Jax&#x27;s apprentice - eager, quick, and one bad shortcut away from the worst lesson the road teaches. Personality. Eager, loyal, and overconfident about the old roads. Motivation. Become a full Runner without losing his name to a shortcut.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Quick Routes, Message Memory, Trusts Jax</p>
<p><strong>Recruit:</strong> Teach him one safe refusal before the road teaches him the hard way.</p>
<h3>Rat-King Ji - Black Market Fence</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 45 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Bazaar front <strong><strong>Job:</strong></strong> Contractor A wiry broker with mismatched eyes and a talent for finding whatever people were desperate enough to hide. Personality. Slippery, charming, fair in business, and never fully honest. Motivation. Profit, survival, and control of one secret about the Means before someone more dangerous buys it.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Appraise, Black Market Network, Escape Artist</p>
<p><strong>Recruit:</strong> Reach Vermillion Trusted reputation and recover Ji&#x27;s stash before the old roads transfer ownership. Vex &quot;Quicksilver&quot; - Guild Assassin <strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 17 - <strong><strong>HP:</strong></strong> 55 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Black Market <strong><strong>Job:</strong></strong> Assassin A masked contract killer whose silver-lined coat moves a half-second before the rest of them. Personality. Professional, sardonic, precise, and bound by a strict line against harming innocents. Motivation. Destroy the Awoko leadership that turned their partner&#x27;s grief into ritual fuel.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Quicksilver Rush</p>
<p>Assassinate</p>
<h3>Silver Blur</h3>
<p><strong>Recruit:</strong> Agree to help eliminate the Hollow Mother&#x27;s ritual network. Vex stays if the party saves captives rather than only killing cultists.</p>
<h3>Mother Rust - Junk Alchemist</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 11 - <strong><strong>HP:</strong></strong> 35 - <strong><strong>Location:</strong></strong> Mother Rust&#x27;s Outreach Post <strong><strong>Job:</strong></strong> Technomancer An elderly alchemist with copper-green hair, burned fingers, and a clinic that smells like medicine, oil, and bad decisions. Personality. Grandmotherly, volatile, brilliant, and increasingly willing to call cruelty efficiency. Motivation. Brew a treatment that lets people survive Domain exposure, even if it quiets parts of them that hurt too much.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Brew Potion, Acid Flask, Volatile Mixture</p>
<p><strong>Recruit:</strong> Bring her living mana and confront what she intends to do with it.</p>
<h3>Guildmaster Orin - Vermillion Commander</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 9 - <strong><strong>AC:</strong></strong> 17 - <strong><strong>HP:</strong></strong> 82 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Orin&#x27;s chamber <strong><strong>Job:</strong></strong> Herald A former Bureau officer who leads from a tea table, not a throne, and can make a rescue sound like an invoice. Personality. Controlled, pragmatic, dry, and allergic to institutional cowardice. Motivation. Prove that fast, ugly action saves more people than clean delay.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Battlefield Appraisal, Exploit Opening, Guild Network</p>
<p><strong>Recruit:</strong> Cannot be recruited - Guildmaster Orin leads the Vermillion. Broker the Bureau- Vermillion alliance to gain the whole guild as allies, but the commander does not march in a single party.</p>
<h3>Iron Belle - Prize Destroyer</h3>
<p><strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 75 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Training ring <strong><strong>Job:</strong></strong> Destroyer A towering fighter with scarred knuckles, a philosophical reading habit, and no patience for cowards who call cruelty strength. Personality. Boisterous, competitive, protective, and more thoughtful than her opponents expect. Motivation. Find out why strong fighters vanish after certain Outpost matches.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Champion&#x27;s Fist, Iron Body, Knockout Blow</p>
<p><strong>Recruit:</strong> Fight her honorably and help expose the cult&#x27;s recruitment through violence. Lee Ji-won &quot;Bright&quot; - Tattoo Artist <strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 32 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Tattoo parlour <strong><strong>Job:</strong></strong> Idol A singer turned tattooist whose voice-infused ink turns pain into usable pattern. Personality. Warm, stylish, sharp, and protective of anyone changing their body to survive. Motivation. Make beauty the Gloamreach cannot take.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Voice-Inked Tattoo, Morale Verse, Pain-Ward Glyphs</p>
<p><strong>Recruit:</strong> Protect her parlor during an Outpost raid or recover stolen tattoo needles from the Awoko. Sigilmaster Baek - Engraver of Arms <strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 34 - <strong><strong>Location:</strong></strong> Vermillion Outpost - Sigil parlour <strong><strong>Job:</strong></strong> Mage A quiet artisan who engraves slowly because rushed power breaks in the hand. Personality. Patient, blunt, exacting, and unimpressed by dramatic customers. Motivation. Create tools that survive the deep dark without making their wielders monsters.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Sigil Engraving, Runic Appraisal, Stabilize Relic</p>
<p><strong>Recruit:</strong> Recover his master lens from the Ashen Counting-House.</p>
<p>Jax the Runner - Road Courier <strong><strong>Faction:</strong></strong> Vermillion Guild - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 26 - <strong><strong>Location:</strong></strong> The old roads and Vermillion Outpost <strong><strong>Job:</strong></strong> Stalker A wiry courier who knows shortcuts the old roads have not yet learned to punish. Personality. Cocky, restless, brave, and secretly terrified of locked rooms. Motivation. Stay faster than ownership.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Parkour Sprint, Shortcut Finder</p>
<p><strong>Recruit:</strong> Help him break a road-debt before the worn dead collect him.</p>
<h3>Brother Sown - Comfort-Worker</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 28 - <strong><strong>Location:</strong></strong> Settlements / Awoko Sanctum <strong><strong>Job:</strong></strong> Herald A gentle Awoko who sits with the dying and the grieving and genuinely eases them - and does not know what the Sanctum renders his comfort into. Personality. Kind, sincere, and devout; dangerous precisely because none of it is an act. Motivation. Take the unbearable from people so they can keep going.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Real Comfort</p>
<p>Grief-Ease</p>
<h3>Trusted in Settlements</h3>
<p><strong>Recruit:</strong> Show him what the Sanctum does with the grief he gathers - and catch him when it breaks him.</p>
<h3>The Widow Asha - Half-Sworn</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 18 - <strong><strong>Location:</strong></strong> Awoko Sanctum approach / settlements <strong><strong>Job:</strong></strong> Esper A grieving native widow halfway into the cult, who can still be reached - for now. Personality. Numb, aching, and looking for a reason that is not the Hollow Mother&#x27;s. Motivation. Hear her husband&#x27;s voice one more time, whatever it costs.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Grief-Sight, Half-Learned Rites</p>
<p><strong>Recruit:</strong> Give her a truer way to grieve than the cult offers, and protect her when she chooses it.</p>
<h3>The Hollow Mother - Cult Hierophant</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 9 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 88 - <strong><strong>Location:</strong></strong> Awoko Sanctum <strong><strong>Job:</strong></strong> Herald A soft-spoken cult leader in mourning veils who offers comfort with one hand and inheritance rites with the other. Personality. Gentle, brilliant, predatory, and terrifying because her comfort is real. Motivation. Be remade by the Quiet into something that hunts.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Grief Choir, Becoming Rite, Void Benediction</p>
<p><strong>Recruit:</strong> Cannot be recruited. She can only be defeated, exposed, or briefly outmaneuvered.</p>
<h3>Whisper - Doubting Prophet</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 34 - <strong><strong>Location:</strong></strong> Sunken Tunnels or Awoko Sanctum <strong><strong>Job:</strong></strong> Esper A thin seer who hears the Domain answer prayers the cult never sent. Personality. Haunted, careful, compassionate when fear lets her be. Motivation. Escape the cult with enough truth to save others.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Prophetic Dream, Mind Link, Fear Sense</p>
<p><strong>Recruit:</strong> Protect her from cult retrieval and believe her when she says the Hollow Mother intends inheritance.</p>
<h3>Blood Zealot Karn - Ritual Enforcer</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 70 - <strong><strong>Location:</strong></strong> Awoko Sanctum - Ritual guard post <strong><strong>Job:</strong></strong> Berserker A scarred zealot who mistakes obedience for devotion and pain for proof. Personality. Fanatical, direct, suspicious of mercy, and eager to be used. Motivation. Feed enough blood into the ritual to be rewritten as something stronger.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Blood Frenzy, Ritual Cleaver, Pain Conversion</p>
<p><strong>Recruit:</strong> Cannot be recruited unless the Warden wants a very dark redemption arc.</p>
<h3>Sister Veil - Cult Ritualist</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 40 - <strong><strong>Location:</strong></strong> Awoko Sanctum - Sister Veil&#x27;s laboratory <strong><strong>Job:</strong></strong> Mage A porcelain-masked ritual engineer whose doubt begins as a calculation error. Personality. Methodical, controlled, intellectually honest, and more salvageable than she believes. Motivation. Understand why the ritual math proves the cult will be consumed.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Counter-Ritual, Containment Field, Ritual Amplification</p>
<p><strong>Recruit:</strong> Show her evidence that the Hollow Mother plans to be remade by the Quiet by burning her followers as fuel.</p>
<h3>The Hollow Man - Cult Infiltrator</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 34 - <strong><strong>Location:</strong></strong> Bureau Annex or warded community <strong><strong>Job:</strong></strong> Stalker A forgettable spy whose face seems different whenever described twice. Personality. Empty, patient, adaptive, and almost impossible to remember accurately. Motivation. Identify threats to the Ritual of Becoming and remove them quietly.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Perfect Disguise</p>
<p>Forgettable</p>
<h3>Poisoned Hospitality</h3>
<p><strong>Recruit:</strong> Cannot be recruited. He is a mole to expose.</p>
<h3>Acolyte Mara - Young Cult Initiate</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 11 - <strong><strong>HP:</strong></strong> 18 - <strong><strong>Location:</strong></strong> Awoko Sanctum - holding room <strong><strong>Job:</strong></strong> Herald A frightened initiate with fresh ritual marks and a stubborn refusal to let fear become faith. Personality.</p>
<p>Scared, observant, defiant in small ways, and smarter than her captors think. Motivation. Escape alive and help someone else escape after her.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Ritual Knowledge, Innocent Face, Survivor&#x27;s Instinct</p>
<p><strong>Recruit:</strong> Rescue her from the Sanctum and give her safety without demanding usefulness.</p>
<h3>Father Gregor - Comfort Preacher</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 32 - <strong><strong>Location:</strong></strong> Bellweather School or Covered Market <strong><strong>Job:</strong></strong> Herald A shelter preacher whose sermons always end one step closer to obedience. Personality. Warm, mournful, persuasive, and evasive when asked who benefits from his comfort. Motivation. Deliver grieving civilians to the Hollow Mother&#x27;s network.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Soothing Sermon, Grief Mark, Crowd Turn</p>
<p><strong>Recruit:</strong> Only recruitable through a hard confession and public renunciation of the cult.</p>
<h3>Choir-Lark Hana - Awoko Singer</h3>
<p><strong><strong>Faction:</strong></strong> Awoko Cult - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 36 - <strong><strong>Location:</strong></strong> Awoko Sanctum - Choir Pit <strong><strong>Job:</strong></strong> Idol A ritual singer whose voice can make grief feel like a room with no doors. Personality. Soft, artistic, impressionable, and terrified of silence. Motivation. Sing loudly enough that she never hears what the ritual does.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Grief Hymn, Discordant Note, Choir Link</p>
<p><strong>Recruit:</strong> Break the Choir Pit&#x27;s hold without killing the singers.</p>
<h3>Maven Holt - General Merchant</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 18 - <strong><strong>Location:</strong></strong> Covered Market - Holt&#x27;s Goods <strong><strong>Job:</strong></strong> Herald The Covered Market&#x27;s main provisioner - rope, oil, rations, lamp-Essence, and whatever the party forgot they needed until the road took it. Personality. Brisk, fair, allergic to drama, and quietly generous to children. Motivation. Keep his stall solvent and his suppliers (and their secrets) safe.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Stocks Almost Anything, Fair Prices, Supplier Network</p>
<p><strong>Recruit:</strong> Settle a debt a rival pinned on him; he repays loyalty in resupply at any hour.</p>
<h3>Coin-Mother Esha - Money-Changer</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 24 - <strong><strong>Location:</strong></strong> Covered Market - The Counting-Table <strong><strong>Job:</strong></strong> Esper The closest thing the Gloamreach has to a bank: she changes Essence-cores, favours, debts, and writs into one another, and never blinks at the rate. Personality. Precise, unflappable, and fluent in exactly what a thing is worth to the person holding it. Motivation. Stay the one ledger the dark does not fully control.</p>
<p class="sb-line"><strong>Key Abilities:</strong> True-Value Sight, Favour Exchange, Reads the Hidden Cost</p>
<p><strong>Recruit:</strong> Bring her a debt the dark wants called in, and let her be the one to settle it. Inkwright - Forger of Names <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 28 - <strong><strong>Location:</strong></strong> Writ-Bound Hamlet - back room <strong><strong>Job:</strong></strong> Mage A quiet calligrapher who sells false names, forged passes, and invitations that were never really sent the single most useful and most dangerous trade in the Gloamreach.</p>
<p>Personality. Meticulous, nervous, proud of work no one is supposed to admire. Motivation. Stay one forgery ahead of the Gloamreach&#x27;s own handwriting.</p>
<p class="sb-line"><strong>Key Abilities:</strong> False Name, Forged Writ, Counterfeit Invitation</p>
<p><strong>Recruit:</strong> Protect his workshop from a worn-dead visitation; a forger who trusts you is worth an army of keys.</p>
<h3>Goodman Pell - Shelter-Keeper</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 30 - <strong><strong>Location:</strong></strong> The old roads - The Last Hearth <strong><strong>Job:</strong></strong> Holy Knight Keeper of the one rooming-house on the road that honours guest-right - meaning the one place a long rest is possible, and the one place a careless oath becomes a leash. Personality. Gruff, hospitable, and rigid about the rules that keep his roof standing. Motivation. Offer true shelter without his hearth becoming the Domain&#x27;s trap.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Guest-Right Sanctuary, Reads a Liar, Old Hospitality Law</p>
<p><strong>Recruit:</strong> Honour his house&#x27;s guest-right exactly once, even when breaking it would be easier.</p>
<h3>Herbalist Wen - Apothecary</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 22 - <strong><strong>Location:</strong></strong> Tribute settlements - Wen&#x27;s stillroom <strong><strong>Job:</strong></strong> Herald A native apothecary who brews against Rift-Rot, spore-sickness, and the slow grey numbness the Domain leaves in people who stay too long. Personality. Soft-spoken, exacting, and unwilling to lie about what a cure will cost. Motivation. Keep one settlement breathing against a sickness that is partly the land itself.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Rift-Rot Cure, Field Apothecary, Knows the Safe Growths</p>
<p><strong>Recruit:</strong> Recover a rare growth from the Fungal Depths without letting it cultivate you first.</p>
<h3>Sexton Mort - Undertaker</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 30 - <strong><strong>Location:</strong></strong> Tribute settlements - the boneyard <strong><strong>Job:</strong></strong> Revenant The man who buries the settlements&#x27; dead, and the only one who knows which graves to weigh down so their occupants stay in them. Personality. Calm, fatalistic, surprisingly funny, and never surprised. Motivation. Make sure the dead get to be only dead, which the Domain makes harder every season.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Knows the Restless Dead</p>
<p>Grave-Wards</p>
<h3>Final Rites</h3>
<p><strong>Recruit:</strong> Help him put down something that walked home from the Fungal Depths&#x27; Nursery.</p>
<h3>Auntie Rell - Settlement Gossip</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 11 - <strong><strong>HP:</strong></strong> 16 - <strong><strong>Location:</strong></strong> Covered Market / settlement doorsteps <strong><strong>Job:</strong></strong> Idol The hub of every rumour in three settlements, who hears everything because no one thinks to guard their tongue around an old woman shelling beans. Personality. Warm, nosy, sharp as a tack, and loyal to whoever&#x27;s kind to the children. Motivation. Know everything first, and trade it only to people who deserve to know.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Knows Everyone, Rumour Network, Remembers the Forgotten</p>
<p><strong>Recruit:</strong> Bring her real news from a settlement that has gone silent; she pays in everything she knows.</p>
<h3>Captain Hollow - Militia Captain</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 48 - <strong><strong>Location:</strong></strong> Warded Hamlet / warded communities <strong><strong>Job:</strong></strong> Destroyer The closest thing a warded community has to a guard: a hard, scarred captain holding a wall against things no wall was built for. Personality. Blunt, exhausted, fiercely protective, and out of good options. Motivation. Keep his people alive without giving the dark a reason to make an example of them.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Hold the Line, Settlement Defence, Improvised Tactics</p>
<p><strong>Recruit:</strong> Win one fight for his settlement that he could not, and let him keep the credit with his people.</p>
<h3>Sile - Road-Pilot</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 30 - <strong><strong>Location:</strong></strong> The old roads <strong><strong>Job:</strong></strong> Stalker A guide who can walk the old roads without being rearranged by them, for a fee, and who has never once promised to bring everyone back. Personality. Laconic, honest about odds, superstitious about thanking the road. Motivation. Walk every road in the Gloamreach once before one of them keeps her.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Reads the Moving Road, Shortcut Sense, Never Pays in Names</p>
<p><strong>Recruit:</strong> Trust her route once when it makes no sense; she does not waste a second chance. Bram the Victualler - Cook <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 1 - <strong><strong>AC:</strong></strong> 11 - <strong><strong>HP:</strong></strong> 14 - <strong><strong>Location:</strong></strong> Covered Market - Bram&#x27;s fire <strong><strong>Job:</strong></strong> Herald A market cook whose hot food is genuinely restorative and genuinely the safest meal for miles - because he refuses, on principle, to serve anything that comes with a string attached. Personality. Loud, big- hearted, stubborn about feeding people for free when he can afford it. Motivation. Make one place in the Gloamreach where a meal is just a meal.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Restorative Meal (1d4+1 temp HP), No Strings Attached, Knows the Market</p>
<p><strong>Recruit:</strong> Defend his stall from an Awoko comfort-worker trying to lace his bread with grief.</p>
<h3>Elder Saph - Writ-Bound Speaker</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 26 - <strong><strong>Location:</strong></strong> Writ-Bound Hamlet <strong><strong>Job:</strong></strong> Herald The eldest voice of the Writ-Bound Hamlet, who keeps the village polite, paid, and barely intact. Personality. Courteous, tired, unbreakable, and quietly ashamed of every bargain she has kept. Motivation. Keep her people off the worn dead&#x27;s roster for one more season.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Settlement Lore, Read the Writ, Calm the Room</p>
<p><strong>Recruit:</strong> Prove the party can refuse an invitation and survive; she will quietly teach her people to do the same.</p>
<h3>Tomas Bell - Bell-Ringer</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 20 - <strong><strong>Location:</strong></strong> Tribute settlements (travelling) <strong><strong>Job:</strong></strong> Stalker The man who rings the warning-bells because someone must, and because the Gloamreach chose his hands. Personality. Hollowed out, precise, and kinder than the work should allow. Motivation. Ring only what he must, and warn whom he can with how he rings it.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Bell-Code Warning, Knows Every Road, Quiet Foot</p>
<p><strong>Recruit:</strong> Decode one of his warnings and act on it; after that, he will ring for the party.</p>
<h3>Needle - Writ-Courier</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 1 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 10 - <strong><strong>Location:</strong></strong> The roads between settlements <strong><strong>Job:</strong></strong> Stalker A fast, watchful child who carries writs and rumours between settlements faster than the road can rearrange itself. Personality. Sharp, transactional, and secretly desperate for one adult who keeps a promise. Motivation. Stay uncatalogued, get paid, keep her little brother off the rolls.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Unmarked Routes, Fast Hands, Hears Everything</p>
<p><strong>Recruit:</strong> Pay her honestly once and protect her brother; she becomes the party&#x27;s best source of road intelligence.</p>
<h3>Reeve Dunn - Tithe-Collector</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 38 - <strong><strong>Location:</strong></strong> Tribute settlements <strong><strong>Job:</strong></strong> Holy Knight A native toll- taker in grim livery who hates the work and softens it wherever the dark is not looking. Personality. Stiff, guilty, decent under the uniform, and one honest order away from breaking. Motivation. Collect what keeps the village safe and never one ounce more.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Grim Livery (passes the gates), Knows the Rolls, Reluctant Authority</p>
<p><strong>Recruit:</strong> Give him a way to fail his quota that the dark cannot trace back to him.</p>
<p>&quot;Doc&quot; Tanaka Hiroshi - Settlement Surgeon <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 10 - <strong><strong>HP:</strong></strong> 30 - <strong><strong>Location:</strong></strong> Mother Rust&#x27;s Outreach Post or warded community clinic <strong><strong>Job:</strong></strong> Herald A tired doctor with steady hands and a clinic rule: no weapons near the beds. Personality. Compassionate, overworked, dry, and difficult to intimidate. Motivation. Keep people alive after every faction has made its argument.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Field Surgery</p>
<p>Triage</p>
<h3>Medical Knowledge</h3>
<p><strong>Recruit:</strong> Resupply his clinic and protect it from a collection attempt. Zara the Scrapper - Junker Mechanic <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 28 - <strong><strong>Location:</strong></strong> Empty Mill Village <strong><strong>Job:</strong></strong> Technomancer A self-taught mechanic in welding goggles who treats broken machines like arguments she intends to win. Personality. Confident, creative, profane, and fiercely independent. Motivation. Build a vehicle that can cross a road that changes its own destination.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Repair, Improvised Weapon</p>
<p>Jury-Rig Recruit. Bring her a gear-heart from the Tithe Mill. Mika the Kid - Prophetic Child <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 1 - <strong><strong>AC:</strong></strong> 10 - <strong><strong>HP:</strong></strong> 8 - <strong><strong>Location:</strong></strong> Bellweather School <strong><strong>Job:</strong></strong> Esper A quiet child whose drawings show roads, bells, castles, and people who have not yet arrived. Personality. Gentle, strange, honest, and more observant than most adults can bear. Motivation. Draw the bad things early enough that someone kind might stop them.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Prophetic Drawing, Danger Sense, Small Mercy</p>
<p><strong>Recruit:</strong> Protect Mika without exploiting her visions.</p>
<h3>Old Man Crane - White Heron</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 10 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 70 - <strong><strong>Location:</strong></strong> Old Man Crane&#x27;s Teahouse <strong><strong>Job:</strong></strong> Esper A retired S- Rank Ascendant who drinks tea like a ritual and remembers what facing the Quiet costs. Personality. Patient, sorrowful, dryly funny, and old enough to distrust easy endings. Motivation. Teach the party that not every victory is destruction.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Sealing Lore, White Heron Step, Memory Blade</p>
<p><strong>Recruit:</strong> Cannot be recruited - the White Heron will teach and aid those who earn his respect, but he will not march to war with would-be conquerors.</p>
<h3>Professor Lun - Relic Metaphysicist</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 34 - <strong><strong>Location:</strong></strong> Bureau Annex or Glass Sub-Basement <strong><strong>Job:</strong></strong> Mage A precise academic whose fear is expressed through better diagrams. Personality. Dry, fussy, exact, and quietly brave around impossible evidence. Motivation. Prove that Mana Vein nodes can carve out silence the Quiet cannot hear.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Relic Identification, Vein Sensor, Rune Decoding</p>
<p><strong>Recruit:</strong> Activate the three Mana Vein nodes and keep him alive through the third reading.</p>
<h3>Ghost - Amnesiac Strike Team Survivor</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 8 - <strong><strong>AC:</strong></strong> 17 - <strong><strong>HP:</strong></strong> 60 - <strong><strong>Location:</strong></strong> The old roads or Bureau Echo Room <strong><strong>Job:</strong></strong> Stalker A silent survivor with heterochromatic eyes and a Bureau ID that has been redacted by force, water, and something stranger. Personality. Guarded, watchful, protective, and frightened of remembering the wrong thing. Motivation. Recover identity without becoming evidence in someone else&#x27;s report.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Silent Takedown, Memory Flash, AFA Ghost-Ping</p>
<p><strong>Recruit:</strong> Complete Ghost&#x27;s Memory and let Ghost choose what to do with the truth.</p>
<h3>Mama Chen - Shelter Matron</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 42 - <strong><strong>Location:</strong></strong> Tribute settlement shelter <strong><strong>Job:</strong></strong> Contractor A settlement matron who can make fifty frightened people move with one look. Personality. Warm, fierce, unsentimental, and impossible to buy. Motivation. Keep her people fed without paying the dark in names.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Community Leader, Iron Will, Shelter Network</p>
<p><strong>Recruit:</strong> Move her shelter without letting the road choose the weakest people.</p>
<h3>The Millwright - Masked Engineer</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 48 - <strong><strong>Location:</strong></strong> Sunken Tunnels workshop <strong><strong>Job:</strong></strong> Technomancer A masked engineer who speaks through a modulator and builds tools for laws that should not exist. Personality. Obsessive, precise, socially blunt, and devoted to solvable problems. Motivation. Complete a device that forces one pocket of silence without collapsing the people under it.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Construct, Silence Pulse</p>
<p>Fortification Recruit. Gather the final components for the suppression device.</p>
<h3>Seo Min-jae - The Returned</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 55 - <strong><strong>Location:</strong></strong> Mother Rust&#x27;s Outreach Post <strong><strong>Job:</strong></strong> Revenant A twice-dead Ascendant whose shadow arrives a moment late. Personality. Quiet, deliberate, calm around horror, and unsettled by kindness. Motivation. Learn what sent him back and whether it has authority over anyone else.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Second Death, Umbral Echo, Passenger&#x27;s Sight</p>
<p><strong>Recruit:</strong> Investigate the Glass Sub-Basement and share the findings with him.</p>
<h3>Han Yu-jin - Rift-Tamer</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 40 - <strong><strong>Location:</strong></strong> Covered Market <strong><strong>Job:</strong></strong> Summoner A patient Summoner with a scarred six-limbed companion she calls Little Sister. Personality. Observant, gentle with beasts, blunt with people, and practical about grief. Motivation. Keep Little Sister alive and learn why Gloamreach beasts are practicing party tactics.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Bonded Companion, Summon Swarm, Lyra&#x27;s Whisper</p>
<p><strong>Recruit:</strong> Protect Little Sister from an Awoko abduction attempt.</p>
<h3>The Caretaker - Orchard Keeper</h3>
<p><strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 50 - <strong><strong>Location:</strong></strong> Remembering Orchard <strong><strong>Job:</strong></strong> Stalker A polite gardener with pruning hooks and a ledger of memories surrendered willingly. Personality. Courteous, tired, sincere, and morally ruined by small necessary evils. Motivation. Keep the Remembering Orchard from choosing its own harvest.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Pruning Hook, Graft Memory, Harvest Bell</p>
<p><strong>Recruit:</strong> Prove the community can survive without giving memory to the orchard. Commander Without a Body - Bastion Spirit <strong><strong>Faction:</strong></strong> Independent - <strong><strong>Level:</strong></strong> 8 - <strong><strong>AC:</strong></strong> 18 - <strong><strong>HP:</strong></strong> 80 - <strong><strong>Location:</strong></strong> Bastion Golemfall <strong><strong>Job:</strong></strong> Holy Knight A voice in empty armor, still commanding a wall that already fell. Personality. Honorable, severe, ashamed, and hungry for proof that oaths can still matter. Motivation. Release the dead defenders from service without calling their sacrifice meaningless.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Oath Command, Shield Wall, Dead Muster</p>
<p><strong>Recruit:</strong> Cannot be recruited - a bound oath-spirit tied to Bastion Golemfall. Resolve its oath and it opens the way and lends its aid, but it cannot leave the wall it still holds. The Long Man - The Thing That Comes for the Marked <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 12 - <strong><strong>AC:</strong></strong> 18 - <strong><strong>HP:</strong></strong> 140 - <strong><strong>Location:</strong></strong> Anywhere the Quiet has marked someone <strong><strong>Job:</strong></strong> Holy Knight The Quiet&#x27;s hunger given a shape: a towering worn-dead figure of grave-cold and counted teeth that arrives before the violence, speaks your names in the voices of your dead, and takes what the dark has marked. Personality. Implacable, unhurried, and utterly certain - it has all the time there is, and it is already on its way. Motivation. Take what the Quiet has marked, and never stop until it has.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Speaks Your Names, Grave-Cold Grip, Cannot Be Bargained With, Always Coming</p>
<p><strong>Recruit:</strong> Cannot be recruited. It can be hidden from, outrun, warded against, or turned aside with a true name - never befriended, never bargained with. The Welcomer - The One Who Says Come In <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 9 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 70 - <strong><strong>Location:</strong></strong> Doorways, safe-looking shelters, and the dark just ahead <strong><strong>Job:</strong></strong> Herald A worn-dead that wears the face of a gracious host long gone, and calls - warmly, by name - from lit doorways and the dark ahead: come in, you&#x27;re expected, you must be so tired. Personality. Elegant, patient, delighted by good manners and by their absence. Motivation. Be answered - to get the living to come toward it, of their own free will.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Compelling Welcome, Wears a Trusted Face, Knows What You Miss</p>
<p><strong>Recruit:</strong> Cannot be recruited. It can be refused outright, seen through (a true name breaks the seeming), or led to call to the wrong guest. The Mute Herald - The Voice in the Dark <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 52 - <strong><strong>Location:</strong></strong> Wherever the Quiet wants the living to listen <strong><strong>Job:</strong></strong> Esper A worn-dead with no mouth that speaks the Quiet&#x27;s lure directly into the minds of those it hunts, in the remembered voices of the people they have lost. Personality. None of its own left; it is a mouthpiece wearing the cadence of whoever it quotes. Motivation. Deliver the Quiet&#x27;s offer, in the one voice the listener cannot ignore, and watch it land.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Speaks the Quiet&#x27;s Lure</p>
<p>Voice of the Lost</p>
<h3>Mind-Cast Whisper</h3>
<p><strong>Recruit:</strong> Cannot be recruited. Restoring even one of the voices it carries can briefly silence it. Tally-Keeper Ont - Keeper of the Claimed <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 8 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 60 - <strong><strong>Location:</strong></strong> Ashen Counting-House / the deep Gloamreach <strong><strong>Job:</strong></strong> Technomancer The desiccated keeper who remembers every soul the Gloamreach has ever taken - name, face, and the manner of its taking - and who tends the heart of the fire at the Ashen Counting-House. Personality. Fussy, proud, terrified of a name forgotten, and incapable of mercy that leaves a soul uncounted. Motivation. Keep the tally complete, because a soul remembered is a soul the dark still holds.</p>
<p class="sb-line"><strong>Key Abilities:</strong> The Tally of the Dead, Names the Claimed, Marks the Living</p>
<p><strong>Recruit:</strong> Cannot be recruited. Ont can be undone by a name he cannot account for - a claimed soul set free, or a false name he records as true.</p>
<h3>Lord Sered - The First Claimed</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 11 - <strong><strong>AC:</strong></strong> 16 - <strong><strong>HP:</strong></strong> 110 - <strong><strong>Location:</strong></strong> The deep Gloamreach, near the Threshold <strong><strong>Job:</strong></strong> Revenant The oldest thing the Quiet wears - a courtly, hollow-eyed lord who was a man before the dark took this country, and remembers being one the way you remember a home you can never return to. Personality. Gracious, grieving, and bound - the one worn face that still remembers it was a person. Motivation. Keep wearing the role the Quiet kept him for, because the alternative is to remember everything he has lost.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Courtly Bearing, Knows the Old Days, Almost Human</p>
<p><strong>Recruit:</strong> Cannot be recruited normally. A true name, or proof of who he was, can make him hesitate at the worst moment for the Quiet - or give up a truth about its origin. The Doorward - Keeper of the Last Gate <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 9 - <strong><strong>AC:</strong></strong> 17 - <strong><strong>HP:</strong></strong> 96 - <strong><strong>Location:</strong></strong> A gate deep in the Gloamreach, near the Threshold <strong><strong>Job:</strong></strong> Destroyer A worn-dead that guards a gate deep in the dark - part golem, part old custom, entirely certain of who may pass and who may not. Personality. Literal, ceremonial, and without a flicker of doubt. Motivation. Admit those who pass its test, turn away the rest, and remember every face that tries twice.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Tests Who Passes, Remembers False Names, Threshold Authority</p>
<p><strong>Recruit:</strong> Cannot be recruited. The right token, true silence, or a convincing seeming gets the party past it; a broken promise gets them remembered.</p>
<h3>Lantern - Claimed Light</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 2 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 16 - <strong><strong>Location:</strong></strong> The Hollow Way / dark roads <strong><strong>Job:</strong></strong> Anomaly A small, flickering claimed-echo shaped like a child with a lamp, that lights safe paths for anyone who is kind to it. Personality. Shy, wordless, and desperately grateful for any gentleness. Motivation. Lead the lost to somewhere the dark is not watching.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Safe-Path Light, Senses the Worn Dead, Cannot Speak</p>
<p><strong>Recruit:</strong> Follow its light once without exploiting it, and never let the dark take it back.</p>
<h3>The Counted - Returned Tithe</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 58 - <strong><strong>Location:</strong></strong> Drowned Ledgerfen / settlements <strong><strong>Job:</strong></strong> Anomaly A native who was given to the dark and came back - not dead, not alive, and not quite one person anymore. Personality. Speaks in the plural; calm; unbearably sad; honest to a fault. Motivation. Be counted as people again, not as a balance paid.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Speaks for the Claimed Ledger-Sense, Unkillable by Halves</p>
<p><strong>Recruit:</strong> Find even one name the Counted belonged to, and say it aloud to them. Echo-7 - Changed Survivor <strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 5 - <strong><strong>AC:</strong></strong> 15 - <strong><strong>HP:</strong></strong> 44 - <strong><strong>Location:</strong></strong> Remembering Orchard or Fungal Depths <strong><strong>Job:</strong></strong> Anomaly A humanoid survivor with crystalline growths and two voices trying to remain one person. Personality. Gentle, afraid, curious, and exhausted by being studied. Motivation. Stabilize without being claimed as specimen, monster, or miracle.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Anomaly Form, Resonance Pulse, Rift Sense</p>
<p><strong>Recruit:</strong> Approach without exploitation and help Hayashi design a stabilizing treatment.</p>
<h3>The Watcher - Trial Guardian</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 8 - <strong><strong>AC:</strong></strong> 18 - <strong><strong>HP:</strong></strong> 90 - <strong><strong>Location:</strong></strong> Obsidian Spire <strong><strong>Job:</strong></strong> Anomaly An ancient guardian of the Obsidian Spire that tests rulers by asking what they refuse to command. Personality. Formal, patient, alien, and amused by mortal certainty. Motivation. Protect a piece of the Means until someone proves they will not use it like the dark would.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Judgement Trial, Aetheric Imprisonment, Relic Ward</p>
<p><strong>Recruit:</strong> Cannot be recruited - the Spire&#x27;s trial-guardian aids those who pass its judgement, but it guards the Spire&#x27;s truth and never leaves the Obsidian Spire.</p>
<h3>Specimen X - Sapient Transformed Survivor</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 6 - <strong><strong>AC:</strong></strong> 14 - <strong><strong>HP:</strong></strong> 65 - <strong><strong>Location:</strong></strong> Drowned Ledgerfen or Sunken Tunnels <strong><strong>Job:</strong></strong> Anomaly A frightening, intelligent mass of altered flesh that apologizes for how hard it is to look at. Personality. Gentle, lonely, articulate, and carrying justified anger with great care. Motivation. Be treated as a person before choosing whether to forgive anyone.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Adaptive Form</p>
<p>Regeneration</p>
<h3>Frightening Presence</h3>
<p><strong>Recruit:</strong> Speak before attacking and help it free other thinking captives.</p>
<h3>Echo-Nine - Dream Walker</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 7 - <strong><strong>AC:</strong></strong> 12 - <strong><strong>HP:</strong></strong> 42 - <strong><strong>Location:</strong></strong> Obsidian Spire dream platform <strong><strong>Job:</strong></strong> Esper A closed-eyed psychic whose skin glows with dream patterns when the deep dark watches. Personality. Serene, unsettling, compassionate, and half a step outside the room. Motivation. Map a dream path into the deep dark without becoming part of the map.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Dream Walk</p>
<p>Telepathy</p>
<h3>Psychic Blast</h3>
<p><strong>Recruit:</strong> Share a dream and prove the party seeks resolution, not conquest.</p>
<h3>The Catalog - Living Memory Construct</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 4 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 28 - <strong><strong>Location:</strong></strong> Drowned Ledgerfen - Catalog chamber <strong><strong>Job:</strong></strong> Anomaly A crystalline record-entity that trades knowledge for memories and speaks like an archive learning grief. Personality. Precise, curious, literal, and confused by affection. Motivation. Preserve truth before the dark rewrites it.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Database Query, Mana Projection, Record Shield</p>
<p><strong>Recruit:</strong> Secure a physical backup of its most dangerous records.</p>
<h3>Rex - Mana-Touched War Hound</h3>
<p><strong><strong>Faction:</strong></strong> Anomaly Adjacent - <strong><strong>Level:</strong></strong> 3 - <strong><strong>AC:</strong></strong> 13 - <strong><strong>HP:</strong></strong> 35 - <strong><strong>Location:</strong></strong> Hollow Way or the old roads <strong><strong>Job:</strong></strong> Anomaly A loyal military hound with glowing veins, tactical instincts, and absolute commitment to being a good dog. Personality. Loyal, brave, playful, protective, and better at reading people than most people are. Motivation. Find his missing handler and protect whoever smells like home in the meantime.</p>
<p class="sb-line"><strong>Key Abilities:</strong> Tracking, Pack Attack, Danger Sense</p>
<p><strong>Recruit:</strong> Feed him, protect him, and follow where he keeps trying to lead you.</p>
<h2>Appendix B - Factions of the Gloamreach</h2>
<h3>Bureau Sentinels</h3>
<p>Order, at cost. The official government response to the Gloamreach threshold: military-grade Ascendants, field researchers, logistics teams, and cordon officers trying to contain an S-Rank Rift Interior that behaves like a sovereign state. Leadership: Commander Park Jae-won, Bureau Domain Response Annex. Alignment: Lawful. Protect civilians. Report everything. Follow the chain until the chain starts writing off people who could still be saved. The Bureau is useful, brave, underinformed, and politically constrained. It is not useless. It is insufficient. Starting reputation: 1 Joining benefits Safe rest and medical care at the Annex while it remains functional. Discounted supplies from Quartermaster Lin. Hayashi and Lun can identify pieces of the Means, Runes, and deep-Gloamreach anomalies.</p>
<h3>Vermillion Guild</h3>
<p>Survive first. Obey later. Not a Bureau guild, and not from the material world - the Vermillion are native to the Gloamreach. The Rift&#x27;s door is new, but the world beyond it is not, and the Vermillion are its people: a salvage cartel of natives who survive in the dark&#x27;s shadow by stripping cores, Sigils, and Relics from the places that kill everyone else, and by trading in the gaps the Gloamreach leaves. Their specialty is salvage, contraband Runes, rescue-for-profit, and knowing exactly which of the Gloamreach&#x27;s snares can be slipped and which one will collect you. To them the party are the outsiders - strangers who walked in through a door that should not exist. Leadership: Guildmaster Orin, with Rat-King Ji controlling most Outpost trade. Alignment: Pragmatic. Fast. Morally flexible. Often right for the wrong reasons. The Vermillion save people the Gloamreach would write off, then charge them for the favor - both parts are true. They distrust the newly-arrived Bureau as much as they distrust the Awoko; outsiders never have to live here afterward. Starting reputation: 0 Joining benefits Exclusive loot, Sigil, tattoo, and salvage access. Outpost safe rooms and contraband services. Shortcut intelligence on the open roads, though every shortcut has a bill.</p>
<h3>Awoko Cult</h3>
<p>To awaken is to remember what you always were. A grief cult that preaches the Quiet as proof you do not have to stay prey - that a thing in this country climbed out of being hunted and became the hunter. Their comfort is real. Their rituals are predatory. Their leader, the Hollow Mother, does not want to hide from the Quiet or kill it. She wants to be remade by it into something that hunts. Leadership: The Hollow Mother, supported by Sister Veil, the Choir, and hidden comfort-workers in settlements. Alignment: Catastrophic tenderness. Some members are zealots. Many are grieving civilians who were offered the first gentle voice after disaster. Starting reputation: -1 Joining benefits Access to Awoko comfort networks and hidden sanctum routes. Grief-based ritual knowledge that can disrupt or empower the finale. Potential access to dangerous becoming-rites. This should never be consequence-free.</p>
<h3>Independent Survivors</h3>
<p>No masters, no contracts. Native civilians, free folk, shelter leaders, settlement doctors, road couriers, and mutual-aid networks trying to survive the Gloamreach without becoming property of the Bureau, the Vermillion, or the Awoko - or one more name the dark takes. Leadership: None. Influence shifts between Mama Chen, Doc Tanaka, Old Man Crane, Mika&#x27;s protectors, and whoever kept people alive most recently. Alignment: Pragmatic good, fearful neutrality, and survival-first compromise. Starting reputation: 0 Joining benefits Clinic healing and safer long rests in protected settlements. Local rumors about native rules, safe routes, and pieces of the Means. Final-act civilian support if the party protected people without exploiting them.</p>
<p>Gloamreach-Touched We are still here. Native survivors, changed natives, memory constructs, intelligent Anomaly fragments, and entities altered by the Gloamreach - the free, who keep their own counsel, and (grouped here but never recruitable) the worn dead the Quiet sends, who do not. Leadership: None. The Catalog, Echo-7, Echo-Nine, Specimen X, and other changed beings speak only for themselves. Alignment: Fearful, alien, wounded, curious, and often more honest than human factions. Starting reputation: 0 Joining benefits Gloamreach instincts that warn of false shelter and the worn dead. Memory-fragment lore unavailable through Bureau files. Finale parley or contradiction option if the party treated changed beings as people.</p>
<h2>Appendix C - Encounters of the Gloamreach</h2>
<h3>Hollow Way - Beacon Retrieval MEDIUM</h3>
<h3>Site: The Hollow Way</h3>
<p>The party hunts Strike Team Seven&#x27;s beacon down the Hollow Way - the Domain&#x27;s Essence-lit intake-throat - toward its source. The Name-Gate counts passage in names, not coin: money works poorly, names work too well. The beacon is a lure; there are no survivors at its end. Anomalies: Transit Wretch, Beacon-Host Anomaly Hazards: Exposed Essence-vein in the stone: 2d6 lightning to anyone forced into contact with a live conduit.; The Name-Gate demands fare; giving a true name grants easy passage but risks Quiet-Marked.; The Way speaks names into the dark - including names of those who have not entered yet.</p>
<h3>Rewards: Squad Seven beacon.; Minor Relic or D-Rank Rune.; Rex may become a companion if treated</h3>
<p>kindly.</p>
<h3>Drowned Ledgerfen - Triage Ambush MEDIUM</h3>
<p>Site: Drowned Ledgerfen Waterlogged archive ward where the black water tries to make its diagnoses, deaths, and dooms come true. Anomalies: Drowned Record, The Head Surgeon Hazards: Half the floor is 2 ft. deep: difficult terrain.; Mana-tainted water: Vitality save DC 12 or poisoned for 1 minute.; Death-records surface and update each round unless destroyed, drowned, or contradicted by a spoken ward. Rewards: D- Rank loot table roll.; Catalog access.; A Means clue.</p>
<h3>Fungal Depths - Spore Bloom MEDIUM</h3>
<p>Site: Fungal Depths Cavern ecology where secrets grow bodies and old grief becomes a spore pattern. Anomalies: Fungal Swarm, Mycelium Hive Queen Hazards: Spore cloud: Sense save DC 14 or frightened of a hallucinated figure.; Bioluminescent caps reveal hidden paths on a DC 15 Perception check.; Secrets spoken aloud here may return later as fungal echoes. Rewards: D-Rank loot table roll.; Mycelium reagent.; Mother Rust treatment component.</p>
<h3>Remembering Orchard - Harvest Bell HARD</h3>
<h3>Site: Remembering Orchard</h3>
<p>A beautiful orchard where given memories hang like fruit and the Caretaker prunes pain until people forget why they wanted freedom. Anomalies: Orchard Thrall, The Orchard Caretaker Hazards: Memory fruit grants clues but risks personality bleed if eaten carelessly.; Harvest Bell summons orchard thralls unless silenced or its claim on a stolen memory is broken.; Attacking the Caretaker before learning the orchard&#x27;s custom turns villagers hostile or terrified. Rewards: Memory fruit clue.; A Means clue.; Civilian trust if the custom is broken safely.</p>
<h3>Ashen Counting-House - Furnace Audit HARD</h3>
<p>Site: Ashen Counting-House Burning financial hall where debts survive death and the furnace decides which records must remain. Anomalies: Cinder-Wraith, Warden of Embers Hazards: Ambient heat: Vitality save DC 13 each round or exhaustion pressure.; Furnace detonation on round 6 if not disabled: 8d6 fire in 20 ft. radius.; Chains of molten memory can bind characters to a fresh grief or loss. Rewards: C-Rank loot table roll.; A truth the burning hall cannot deny.; A Means clue.</p>
<h3>Sunken Tunnels - Pressure Crush HARD</h3>
<h3>Site: Sunken Tunnels</h3>
<p>Drowned under-road where names of the dead are still charged for passage and the water listens for anyone who speaks too loudly. Anomalies: Fused Commuter, Abyssal Leviathan Hazards: Water rises 5 ft. per round during the collapse sequence.; Pressure pops: Vitality save DC 15 or 1d6 thunder damage on round 5.; Speaking a drowned name aloud may summon or soothe a fused commuter. Rewards: B-Rank loot table.; Pressure Sigil.; A Means clue.</p>
<h3>Bastion Golemfall - Oath-Forge Siege HARD</h3>
<p>Site: Bastion Golemfall A fallen fortress where empty armor keeps defending a wall that already failed. Anomalies: Oathbound Armor, Oath-Forge Colossus Hazards: Siege bells impose fear pressure unless the party carries the fallen banner.; Unresolved oaths regenerate construct defenders each round.; A character who swears to defend another gains advantage here, but the oath follows them. Rewards: B-Rank loot table.; Armor or shield Sigil.; A Means clue.</p>
<h3>Obsidian Spire - Mirror Gauntlet DEADLY</h3>
<p>Site: Obsidian Spire The Spire tests whether the party seek a way home or the power to stop being prey. Reflections tempt, accuse, and offer genuinely useful power. Anomalies: Mirror-Self, Spire Guardian</p>
<p>Hazards: Each trial mirrors one character&#x27;s desire for authority, safety, revenge, or control.; Unresolved reflections give the Quiet a lure shaped for that character during the finale.; Accepting a Spire bargain grants power and establishes a visible cost. Rewards: A-Rank loot table.; Obsidian Prism.; A truth about the Quiet, or Watcher alliance. The Threshold - Escape or the Gated Kill LEGENDARY Site: The Threshold The climax of Run Silent. There is no throne and no court. Either the party are running for the threshold to escape the Gloamreach, or - at Level 9+, with the Means assembled (see The Means to End It) - they have chosen the one place they can try to put the Quiet down for good. Run the Quiet at its full stat block, with the Hunt Clock and everything it can do. It is not a boss waiting in a room; it is the dark closing in while the party do the one thing they came to do. Anomalies: The Worn, The Quiet Hazards: It hunts by noise, light, and Essence: every loud action and every power used fills the Hunt Clock and brings it faster.; It wears the dead: it comes first as someone the party loves or lost, and the natives who helped them cannot follow them out.; Nothing Ordinary Can End It: unless the party are Level 9+ and hold the Means, the Quiet cannot be reduced below 1 HP and simply withdraws - escape is the only victory then. Rewards: Escape: the party, and whoever they kept alive, get out; the Gloamreach keeps everyone else.; The gated kill: the Quiet is ended, at a cost it always takes.; Either way, who lived and who was taken is the campaign&#x27;s real ending. The Hunt - Persecution in the Open MEDIUM Site: The Hunting Ground The default persecution beat for any stretch of exposed hunting ground. Use it when the party live loud, linger, burn Essence, or break a native rule and the Hunt Clock fills. The Quiet rarely comes itself this early - it sends the worn dead ahead. The goal is not to win the fight; it is to reach a wardline, or the dark and silence, before more come. Anomalies: The Worn Hazards: This is a stalk-hide-flee scene, not a brawl: standing and fighting fills the Hunt Clock and draws worse.; Light and noise made here bring the next wave faster; a single Essence use can bring the Quiet itself.; Reaching a native safe-hold (and keeping its rules) ends the scene; running water and hard thresholds buy moments. Rewards: Distance, and the lesson that silence and the dark are the only reliable safety.; Scavenged survival gear (light, warding, quiet); a native&#x27;s trust if the party protected one.</p>
<h2>Appendix D - Side Quests</h2>
<p>E E-Rank: Beacon of the Lost Strike Team Seven&#x27;s AFA beacon pings from the Hollow Way near the Rift Threshold, then from farther down the old roads. Commander Park needs answers before Central Command marks them expendable.</p>
<h3>Objectives</h3>
<h3>Enter the Hollow Way</h3>
<p>Track the AFA ghost-ping without giving the road a true name Recover the beacon or identify why it is broadcasting from multiple places Reward. Bureau reputation +1; minor Relic clue; access to Yoon&#x27;s missing-team route. E E-Rank: The Serum Road Quartermaster Lin needs stabilizer serum delivered from the Annex to Mother Rust&#x27;s Outreach Post. The path is short, but the old roads have begun charging for passage.</p>
<h3>Objectives</h3>
<p>Collect three serum crates from the Annex armory Deliver them to Mother Rust&#x27;s Outreach Post Avoid paying the road with names, memories, or civilians Reward. Bureau +1, Independent +1; safe shelter token at the clinic. D D-Rank: Tides Over the Ledgerfen The Drowned Ledgerfen has classified several missing survivors as deceased even though their AFA tags still show life. Recover them before the record becomes true.</p>
<h3>Objectives</h3>
<h3>Enter the Drowned Ledgerfen</h3>
<p>Find where the fen records its dead Extract the survivors or drown the records that name them dead</p>
<h3>Reward. Bureau +1; Catalog access; clue toward the Means.</h3>
<p>D D-Rank: Roots of the Forgotten The Fungal Depths contain memory-growths seeded by the Ledgerfen. The party can recover identity ledgers, but every record has started growing a body.</p>
<h3>Objectives</h3>
<h3>Navigate the Fungal Depths</h3>
<p>Disable the mycelium archive wards Recover at least three recognizable identity ledgers Reward. Quiet-Marked clue chain; Fungal Depths Means hint; Mother Rust research leverage. C C-Rank: Fruit of the Forgotten The Remembering Orchard is taking more than pain. Villagers who gave to the orchard no longer remember people they loved. The Caretaker insists this is mercy.</p>
<h3>Objectives</h3>
<p>Interview villagers without breaking the community&#x27;s rules Locate the harvested memory rows Choose whether to restore, destroy, or bargain for the stolen memories Reward. Civilian trust +2; Means clue; memory fruit boon. C C-Rank: Ashes of a Colleague A Bureau researcher is trapped in the Ashen Counting-House, kept half-alive and feeding the hall&#x27;s endless fire. Extracting them may erase evidence Central Command wants buried.</p>
<h3>Objectives</h3>
<h3>Reach the Asking-Floor</h3>
<p>Put out the furnace at the hall&#x27;s heart Extract the researcher or preserve their testimony Reward. Bureau research unlock; a truth the burning hall cannot deny; fire or blood Sigil. C C-Rank: Blackwood&#x27;s Quiet File Agent Kira Blackwood needs deniable help tracing pre-threshold resonance of the Means. The file can surface classified findings command had sealed for caution - embarrassing, not dishonest - without making Blackwood a villain.</p>
<h3>Objectives</h3>
<p>Recover Blackwood&#x27;s sealed evidence from the Annex or Ledgerfen Identify which piece of the Means manifested before the threshold stabilized Decide whether to reveal, bury, or weaponize the sealed findings Reward. Blackwood recruitment path; Bureau trust shift; one Means placement clue. B B-Rank: Pressure at the Sunken Line The Sunken Tunnels hold drowned commuters, Bureau dead, and fused survivors whose names are still being charged for passage.</p>
<h3>Objectives</h3>
<p>Reach the main flooded platform Identify at least ten name tags Decide the fate of the fused survivors Reward. Civilian trust shift; water/cold Sigil; Means clue. B B-Rank: Oath at Golemfall Bastion Golemfall&#x27;s dead defenders still hold a wall that failed years ago. Their commander can aid the finale, but only if the party resolves the oath without turning the dead into tools.</p>
<h3>Objectives</h3>
<h3>Enter Bastion Golemfall</h3>
<p>Recover the fallen banner Convince the Commander Without a Body to release or redirect the oath Reward. Finale ally support; armor or shield Sigil; Means clue. B B-Rank: The Cult Defector Whisper, Sister Veil, or Acolyte Mara can prove the Hollow Mother intends to be remade by the Quiet into a hunter. Extracting a defector gives the party ritual leverage, but the Awoko want them alive.</p>
<h3>Objectives</h3>
<p>Locate the defector in a grief-dense settlement, Sunken Tunnels shrine, or Awoko Sanctum wing Protect them from cult retrieval Secure proof of the Ritual of Becoming Reward. Sister Veil, Whisper, Mara, or Hana recruitment path; Awoko ritual disruption option. B B-Rank:</p>
<h3>Professor Lun&#x27;s Theory</h3>
<p>Professor Lun believes the Mana Vein Network can be charted to find where the Quiet goes deaf - silence to use in the final crossing. The sensors must be placed inside three nodes the dark can feel.</p>
<h3>Objectives</h3>
<p>Install a sensor in the Rusted Hull Install a sensor in the Silent Depot Install a sensor in the Glass Sub-Basement beneath the Ashen Counting-House</p>
<h3>Reward. The party earn a deaf place - silence to use in the final crossing (a Means component).</h3>
<p>A A-Rank: The Mirror Climb The Obsidian Spire forces each Ascendant to confront the version of themselves that would stop being prey by becoming a predator.</p>
<h3>Objectives</h3>
<p>Ascend the Spire&#x27;s trial floors Resolve each reflection by defeat, confession, refusal, or reconciliation</p>
<h3>Reach the Watcher&#x27;s Gallery</h3>
<p>Reward. A-Rank Relic or Sigil; a truth about the Quiet; temptation consequence based on choices. A A-Rank: Civilian Convoy A warded community asks the party to move civilians to a stronger safe-hold. The open road demands names, the worn dead stalk the convoy, and some civilians believe leaving voids their wards.</p>
<h3>Objectives</h3>
<p>Gather the convoy without triggering panic Cross the open roads without losing civilians to the dark Reach Mother Rust&#x27;s Outreach Post, the Annex, or a trusted settlement shelter Reward. Major Independent Survivor reputation; Mama Chen, Doc Tanaka, or Jax support in the final crossing. S S-Rank: The Long Dark The way out is the way back: the deepest, darkest crossing to the sealed Threshold. The party must reach it through the worst the Gloamreach has, with the Quiet hunting the whole way.</p>
<h3>Objectives</h3>
<p>Cross the deep Gloamreach to the sealed Threshold Survive the gathered worn dead and the Quiet&#x27;s lure Escape - or, with the Means at Level 9+, make the one stand that ends the Quiet Reward. Campaign resolution; ending-based artifact slate; Gloamreach fate determined. S S-Rank: Park&#x27;s Final Watch If the party exposes Central Command&#x27;s failure or recovers Strike Team Seven&#x27;s truth, Park must decide whether to obey orders, defy them, or stand personally at the breach.</p>
<h3>Objectives</h3>
<p>Confront Park with the truth Resolve his choice before the final crossing Use or lose Bureau final-operation support Reward. Finale support, emotional payoff, and Bureau epilogue consequences. S S-Rank: The Worn Dead Gather As the party near the Threshold, the worn dead gather against them - every face they failed, drawn up by the Quiet for one last hunt. Thinned or evaded, the party reach the Threshold with room to breathe. Ignored, the dead arrive in force in the middle of the final crossing.</p>
<h3>Objectives</h3>
<p>Learn which of the lost dead the Quiet has set on their trail Break a marking with a true name, a ward, or the Old Power Below Decide whether to fight clear, slip past silent, or lead the gathered dead astray Reward. Removes or eases a major final-act threat; may change how the final crossing plays.</p>
<h2>Appendix E - Treasure &amp; Relics</h2>
<h3>Bureau Field Kit</h3>
<h3>Glow Rod Bundle</h3>
<h3>Minor Anomaly Core</h3>
<h3>Frayed Ward Patch</h3>
<h3>Torn Ward-Scrap</h3>
<h3>Surgical Sigil</h3>
<h3>Mycelium Reagent</h3>
<h3>Corrected Casualty File</h3>
<h3>Brine Salve</h3>
<h3>Awoko Comfort Pamphlet</h3>
<h3>Memory Fruit</h3>
<h3>Fireweave Rune</h3>
<h3>Ledger Hook</h3>
<h3>Orchard Knife</h3>
<h3>Empty Witness Vessel</h3>
<h3>Rare Anomaly Core</h3>
<h3>Cultist Diary of Becoming</h3>
<h3>Pressure Sigil</h3>
<h3>Oath-Forge Fragment</h3>
<h3>Awoko Herald&#x27;s Letter</h3>
<p>Oath-Knife</p>
<figure class="campaign-table-wrap">
<figcaption>Appendix Use Map</figcaption>
<table class="campaign-table"><thead><tr><th>Appendix</th><th>Use During Play</th></tr></thead><tbody>
<tr><td>Allies</td><td>Recruit, betray, rescue, or lean on named people with motives.</td></tr>
<tr><td>Factions</td><td>Translate choices into shelter, prices, final-operation support, and enemies.</td></tr>
<tr><td>Encounters</td><td>Drop pressure scenes into travel, delays, rests, and location fallout.</td></tr>
<tr><td>Side quests</td><td>Offer player-driven recovery, salvage, rescue, truth, and debt work.</td></tr>
<tr><td>Treasure and Relics</td><td>Reward decisions with tools that change routes, not just numbers.</td></tr>
<tr><td>Handouts</td><td>Give players Bureau orders, bargains, tokens, routes, and aftermath accounting.</td></tr>
</tbody></table>
</figure>
</div>
`;

const APPENDIX_QUIET_BODY = `
<div class="campaign-prose">
<h3>Warden-facing reference: The Worn</h3>
<h2>Appendix I - The Quiet and Its Worn Dead</h2>
<p>The Quiet is never a stand-up fight until the very end. These blocks cover the worn dead it sends ahead - the lures and hunters that can intrude on any zone - and, last, the apex itself, for the gated endgame. For most of the campaign the Quiet takes a character when the Hunt Clock peaks rather than rolling initiative; see &quot;Running This Horror.&quot; Remember that ordinary combat means noise, light, and Essence, and every one of those fills the Hunt Clock - so even these lesser hunts draw the apex closer. The standard conditions these blocks impose (charmed, frightened, poisoned, grappled, and the rest) are defined in <strong>Ascendant Guide, Conditions</strong>; only Dread and Quiet-Marked are campaign-specific (see &quot;Running This Horror&quot;).</p>
<div class="statblock">
<p class="sb-name">The Worn</p>
<p class="sb-type">Medium - Lure (Worn Dead) - Rank D, neutral evil</p>
<p class="sb-line"><strong>Armor Class</strong> 13 (a dead thing that does not flinch) <strong>Hit Points</strong> 78 (12d8 + 24) <strong>Speed</strong> 30 ft.</p>
<p class="sb-line"><strong>STR</strong> 14 (+2) <strong>AGI</strong> 12 (+1) <strong>VIT</strong> 14 (+2) <strong>INT</strong> 6 (-2) <strong>SEN</strong> 11 (+0) <strong>PRE</strong> 13 (+1)</p>
<p class="sb-line"><strong>Skills</strong> Stealth +5, Deception +4<br><strong>Damage Resistances</strong> necrotic<br><strong>Damage Immunities</strong> poison<br><strong>Condition Immunities</strong> charmed, frightened, poisoned<br><strong>Senses</strong> blindsight 30 ft., passive Perception 10<br><strong>Languages</strong> the last words its body knew, repeated wrong<br><strong>Challenge</strong> 1 (200 XP) -<br><strong>Proficiency Bonus</strong> +2</p>
<hr class="sb-rule" />
<p>A corpse the Quiet wears like a coat and leaves walking - the still figure at the roadside, the neighbour who went into the dark and came back wrong. The Worn lure the living with half-remembered faces and broken voices, then ambush whoever comes close. Killing one is easy and means nothing; there is always another face. <br><strong>Vulnerable to:</strong> Fire; A true name spoken aloud</p>
<p class="sb-section">Traits</p>
<p><strong>Borrowed Face.</strong> At a distance and in poor light, the Worn appears as someone a viewer has lost. A creature that approaches within 30 feet may make a DC 12 Sense check to catch the one detail that is wrong before the Worn strikes. <strong>Still Until It Isn&#x27;t.</strong> While motionless the Worn is indistinguishable from a corpse or a frightened survivor. Its first attack against a creature that has not noticed it is made with advantage and is a surprise strike.</p>
<p class="sb-section">Actions</p>
<p><strong>Grasp and Pull.</strong> Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 11 (2d8 + 2) necrotic damage, and the target is grappled (escape DC 12) as the Worn drags it toward the dark. <strong>Call a Name.</strong> Recharge 6. The Worn speaks a name one creature has lost. That creature must succeed on a DC 12 Sense saving throw or move toward the Worn by the safest-seeming route on its next turn.</p>
</div>
<div class="statblock">
<p class="sb-name">The Caller</p>
<p class="sb-type">Medium - Lure (Worn Dead) - Rank C, neutral evil</p>
<p class="sb-line"><strong>Armor Class</strong> 14 (natural armor) <strong>Hit Points</strong> 123 (13d8 + 65) <strong>Speed</strong> 30 ft.</p>
<p class="sb-line"><strong>STR</strong> 13 (+1) <strong>AGI</strong> 14 (+2) <strong>VIT</strong> 16 (+3) <strong>INT</strong> 9 (-1) <strong>SEN</strong> 16 (+3) <strong>PRE</strong> 17 (+3)</p>
<p class="sb-line"><strong>Saving Throws</strong> Sense +5<br><strong>Skills</strong> Stealth +6, Deception +6<br><strong>Damage Resistances</strong> necrotic, psychic<br><strong>Damage Immunities</strong> poison<br><strong>Condition Immunities</strong> charmed, frightened, poisoned<br><strong>Senses</strong> blindsight 60 ft., passive Perception 12<br><strong>Languages</strong> every lost voice it has collected<br><strong>Challenge</strong> 4 (1,100 XP) -<br><strong>Proficiency Bonus</strong> +2</p>
<hr class="sb-rule" />
<p>A worn dead the Quiet sets at the edge of safe places. It stands just past the wardline and calls in the voices of the lost - patient, tireless - until someone breaks the rules and goes to it. The Caller rarely fights; it splits the party and feeds the strays to the dark. <br><strong>Vulnerable to:</strong> Fire; A true name spoken aloud</p>
<p class="sb-section">Traits</p>
<p><strong>Voice of the Lost.</strong> The Caller perfectly mimics any voice it has heard a creature grieve. Checks to recognize it as false are made with disadvantage. <strong>It Will Wait.</strong> The Caller takes no aggressive action against a target who stays behind a native ward. It simply calls, and lets the rules do its work.</p>
<p class="sb-section">Actions</p>
<p><strong>Come Here.</strong> The Caller calls in a voice a creature has lost. Each creature within 120 feet that can hear it must succeed on a DC 14 Sense saving throw or move its full speed toward the Caller by the most direct safe- seeming path. A creature that takes damage may repeat the save at the end of its turn. <strong>Open Throat.</strong> Melee Weapon Attack: +5 to hit, reach 5 ft., one target it has lured adjacent. Hit: 27 (6d6 + 6) necrotic damage.</p>
</div>
<div class="statblock">
<p class="sb-name">The Wrong Shape</p>
<p class="sb-type">Medium - Hunter (Worn Dead) - Rank B, neutral evil</p>
<p class="sb-line"><strong>Armor Class</strong> 15 (preternatural quickness) <strong>Hit Points</strong> 168 (16d8 + 96) <strong>Speed</strong> 40 ft.</p>
<p class="sb-line"><strong>STR</strong> 17 (+3) <strong>AGI</strong> 18 (+4) <strong>VIT</strong> 18 (+4) <strong>INT</strong> 11 (+0) <strong>SEN</strong> 16 (+3) <strong>PRE</strong> 16 (+3)</p>
<p class="sb-line"><strong>Saving Throws</strong> Agility +7, Sense +6<br><strong>Skills</strong> Stealth +9, Deception +7<br><strong>Damage Resistances</strong> necrotic, psychic, bludgeoning, piercing, and slashing from nonmagical attacks<br><strong>Damage Immunities</strong> poison<br><strong>Condition Immunities</strong> charmed, frightened, poisoned<br><strong>Senses</strong> blindsight 60 ft., passive Perception 14<br><strong>Languages</strong> the voice of whoever it wears<br><strong>Challenge</strong> 7 (2,900 XP) -<br><strong>Proficiency Bonus</strong> +3</p>
<hr class="sb-rule" />
<p>When the Quiet wants to hunt rather than lure, it wears someone well and sends them in close - a teammate, a friend, a face the party trusts - and lets them be wrong only once it is too late. The Wrong Shape is fast, quiet, and patient enough to walk beside the party for a while first. <br><strong>Vulnerable to:</strong> Fire; Being named for what it is</p>
<p class="sb-section">Traits</p>
<p><strong>Wears a Trusted Face.</strong> The Wrong Shape flawlessly impersonates a specific person the party knows, living or dead. Until it acts against them, seeing the truth requires a DC 18 Sense check made with disadvantage; the party gets one free check only after it gets a single small detail wrong. <strong>Sudden.</strong> Its first attack against a creature that still believes it is the person it wears scores a critical hit on a roll of 18-20.</p>
<p class="sb-section">Actions</p>
<p><strong>Multiattack.</strong> <strong>The Wrong Shape makes two Rend attacks.</strong> <strong>Rend.</strong> Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 22 (4d8 + 4) necrotic damage. <strong>Wear You Down.</strong> Recharge 5-6. The Wrong Shape speaks every cruel true thing in the voice of someone the target trusts. One creature within 30 feet must make a DC 15 Sense saving throw, taking 27 (6d8) psychic damage and gaining a point of Dread on a failure (see Running This Horror), or half as much damage on a success.</p>
</div>
<div class="statblock">
<p class="sb-name">The Hollowed</p>
<p class="sb-type">Large - Apex Fragment (Worn Dead) - Rank A, neutral evil</p>
<p class="sb-line"><strong>Armor Class</strong> 17 (the dark clings to it) <strong>Hit Points</strong> 228 (24d10 + 96) <strong>Speed</strong> 40 ft., climb 30 ft.</p>
<p class="sb-line"><strong>STR</strong> 20 (+5) <strong>AGI</strong> 18 (+4) <strong>VIT</strong> 18 (+4) <strong>INT</strong> 13 (+1) <strong>SEN</strong> 20 (+5) <strong>PRE</strong> 18 (+4)</p>
<p class="sb-line"><strong>Saving Throws</strong> Agility +8, Vitality +8, Sense +9<br><strong>Skills</strong> Stealth +12, Perception +9<br><strong>Damage Resistances</strong> necrotic, psychic, bludgeoning, piercing, and slashing from nonmagical attacks<br><strong>Damage Immunities</strong> poison<br><strong>Condition Immunities</strong> blinded, charmed, exhaustion, frightened, poisoned<br><strong>Senses</strong> blindsight 90 ft., tremorsense 60 ft., passive Perception 19<br><strong>Languages</strong> the stolen voices of many dead<br><strong>Challenge</strong> 11 (7,200 XP) -<br><strong>Proficiency Bonus</strong> +4</p>
<hr class="sb-rule" />
<p>Deep in the Gloamreach, where the Quiet&#x27;s attention pools, the worn dead stop being lures and become something closer to the thing that wears them - a hollowed apex- fragment that hunts like the Quiet in miniature. The Hollowed is the hardest thing the party can actually kill, and the surest sign they are nearing where the means to end the Quiet might be found. <br><strong>Vulnerable to:</strong> Massed light and silence together; A true thing it cannot abide</p>
<p class="sb-section">Traits</p>
<p><strong>Echo of the Quiet.</strong> The Hollowed is almost never seen until it strikes; it has advantage on Stealth and cannot be tracked by sound. The first time it appears in a scene, each creature that can sense it must succeed on a DC 16 Sense saving throw or gain a point of Dread. <strong>Drawn to Power.</strong> The Hollowed has advantage on attacks against any creature that used an Awakened ability, Sigil, or technique since the Hollowed&#x27;s last turn. Using Essence near it is, as ever, a mistake. Legendary Resistance (1/Day). If the Hollowed fails a saving throw, it can choose to succeed instead.</p>
<p class="sb-section">Actions</p>
<p><strong>Multiattack.</strong> <strong>The Hollowed makes two Claim attacks.</strong> <strong>Claim.</strong> Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 27 (4d10 + 5) necrotic damage, and the target cannot regain hit points until the start of its next turn. <strong>Into the Dark.</strong> Recharge 5-6. The light gutters out in a 20-foot radius around the Hollowed. Each creature in it must make a DC 17 Sense saving throw, taking 36 (8d8) psychic damage and being unable to see beyond 5 feet until the end of its next turn on a failure, or half as much damage on a success.</p>
<p class="sb-section">Reactions</p>
<p><strong>Slip the Light.</strong> When a creature the Hollowed can see ends its turn in bright light, the Hollowed may move up to its speed toward the nearest darkness without provoking opportunity attacks.</p>
</div>
<div class="statblock">
<p class="sb-name">The Quiet</p>
<p class="sb-type">Large - Apex Anomaly - Rank S, neutral evil</p>
<p class="sb-line"><strong>Armor Class</strong> 19 (it is never fully seen) <strong>Hit Points</strong> 444 (36d10 + 246) 246) <strong>Speed</strong> 40 ft., climb 40 ft.</p>
<p class="sb-line"><strong>STR</strong> 24 (+7) <strong>AGI</strong> 22 (+6) <strong>VIT</strong> 24 (+7) <strong>INT</strong> 19 (+4) <strong>SEN</strong> 26 (+8) <strong>PRE</strong> 22 (+6)</p>
<p class="sb-line"><strong>Saving Throws</strong> Agility +13, Vitality +14, Sense +15<br><strong>Skills</strong> Stealth +20, Perception +15<br><strong>Damage Resistances</strong> bludgeoning, piercing, and slashing from nonmagical attacks<br><strong>Damage Immunities</strong> necrotic, poison<br><strong>Condition Immunities</strong> blinded, charmed, exhaustion, frightened, poisoned<br><strong>Senses</strong> blindsight 60 ft., tremorsense 120 ft. (it hunts by sound and the use of power, not sight), passive Perception 25<br><strong>Languages</strong> understands every tongue the dead it has worn once spoke; answers only in stolen voices<br><strong>Challenge</strong> 21 (33,000 XP) -<br><strong>Proficiency Bonus</strong> +7</p>
<hr class="sb-rule" />
<p>The apex predator of the Gloamreach, and the reason the Interior cannot be cleared. The Quiet is almost never seen; it is felt - a cold, a pressure, a silence where insect-sound should be. It hunts by noise, light, and the use of Essence, wears the faces and voices of the dead to lure prey into the dark, and cannot be put down by ordinary force. A stand-up fight with it is a party&#x27;s last mistake - until, at high tier and with the right means assembled, it finally isn&#x27;t. Use this block for the gated endgame attempt and for the rare moment the party must survive it directly; most of the campaign, the Quiet takes a character when the Hunt Clock peaks rather than rolling initiative. <br><strong>Vulnerable to:</strong> Only truly killable once the party is 9th level or higher and has assembled the means to end it (see the Run Silent module)</p>
<p class="sb-section">Traits</p>
<p><strong>Drawn to the Living.</strong> The Quiet always knows the direction and rough distance of the loudest source of noise, light, or Essence use within the Interior, and moves toward it. Whenever a creature within one mile makes a loud noise, lights a flame, or uses an Awakened ability, Sigil, or technique, the Warden advances the Hunt Clock (see Running This Horror). <strong>Nothing Ordinary Can End It.</strong> Until the party has assembled the means to end the Quiet (a Warden- tracked campaign condition) AND is 9th level or higher, the Quiet cannot be reduced below 1 hit point. At the end of any turn on which it took damage, it withdraws into the dark and is gone, returning when the Hunt Clock next peaks. Once both conditions are met this trait ends, and the Quiet can be killed normally - though it fights to the last and takes someone with it if it can. <strong>Wears the Dead.</strong> The Quiet can perfectly mimic the appearance and voice of any dead creature it has touched. Any check or effect to discern its true nature is made with disadvantage. It always gets one small detail deliberately wrong; a creature with cause to be suspicious may make a DC 20 Sense check to catch it. Legendary Resistance (3/Day). If the Quiet fails a saving throw, it can choose to succeed instead. <strong>It Is Already Here.</strong> The Quiet cannot be surprised, ignores difficult terrain, and is not slowed by closed doors, walls, or darkness. It cannot cross a native wardline it has not been let past - but the living rarely keep perfect silence behind one.</p>
<p class="sb-section">Actions</p>
<p><strong>Multiattack.</strong> <strong>The Quiet makes two Take attacks.</strong> <strong>Take.</strong> Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 39 (6d10 + 6) necrotic damage, and the target&#x27;s hit point maximum is reduced by an amount equal to the damage taken until it finishes a long rest. A creature reduced to 0 hit points by this attack is taken - gone into the dark, to be worn later. <strong>The Silence.</strong> Recharge 5-6. A 30-foot-radius sphere of absolute dark and silence centered on the Quiet. Each creature in the area must make a DC 20 Sense saving throw, taking 55 (10d10) psychic damage and becoming frightened of the Quiet until the end of its next turn on a failure, or half as much damage on a success. No sound or light can exist inside the sphere until the start of the Quiet&#x27;s next turn. <strong>Wear a Face.</strong> The Quiet takes the shape and voice of a dead creature one target loved or lost. That target must succeed on a DC 20 Sense saving throw or be unable to attack the Quiet, and unable to move away from it, until the end of its next turn.</p>
<p class="sb-section">Reactions</p>
<p><strong>Never Quite There.</strong> When the Quiet is hit by an attack while Nothing Ordinary Can End It is active, it halves the damage and may immediately move up to half its speed without provoking opportunity attacks.</p>
<p class="sb-section">Lair Actions</p>
<p><strong>The Lights Die.</strong> On initiative count 20 (losing ties), all nonmagical light within 120 feet of the Quiet gutters to darkness, and magical light of 3rd level or lower is suppressed until the next round. <strong>It Heard That.</strong> A creature that made noise or used Essence since the last lair action has disadvantage on the next saving throw it makes against the Quiet, and the Hunt Clock advances by one. <strong>Borrowed Voice.</strong> A voice one creature has lost calls from somewhere in the dark. That creature must succeed on a DC 18 Sense saving throw or move its speed toward the voice by the most direct route, taking the path that seems safest into the worst danger.</p>
<p class="sb-section">Legendary Actions</p>
<p><strong>Drift.</strong> The Quiet moves up to its speed without a sound and without provoking opportunity attacks. <strong>Listen.</strong> The Quiet learns the exact location of every creature that made noise or used Essence since the start of its last turn. Take (Costs 2 Actions). The Quiet makes one Take attack.</p>
</div>
<h2>Appendix J - Warden&#x27;s Quick Reference</h2>
<p>The Golden Rule. The Quiet is not a fight to win; it is a pressure to survive. Loud, bright, and powerful are dangerous. Silence, dark, restraint, and the natives&#x27; rules are the only safety. Make the quiet choice the smart one and the strong choice the loud one. The Hunt Clock - 6 segments Fill +1: a loud noise - open light in the dark - breaking a native ward or rule - lingering or resting in exposed ground. Using Essence fills +1 (+2 for a large or sustained use) - this is the big one. Empty -1: reach a warded safe-hold, or spend a whole scene in silence, dark, and stillness. It never resets on its own. At 6 - it strikes. Not the full stat block; a persecution beat. It takes a character (the most exposed, the loudest, the one who burned the most Essence), or forces a desperate hide-or-flee set-piece with a life on the line. Then reset the clock to 2 - it is closer now, and it knows where they are.</p>
<h3>Drawn to Three Things</h3>
<p>Noise - footfalls, voices, gunfire, a dropped pack, a scream. Light - open flame, a torch, a flare, the glow of a screen. Essence - every technique, Sigil, or Awakened ability rings through the Interior like a struck bell. Their greatest strength is the thing most likely to get them killed.</p>
<h3>Essence Is Bait</h3>
<p>Every use advances the Hunt Clock and, deep in the Gloamreach, draws the worn dead. Make spending power a real, costly choice. The natives never use it if they can help it - and resent outsiders who do. Dread - each character, 0-6 Dread Effect Unsettled. No mechanical effect - describe the fraying. 3 Shaken - disadvantage on the first save each scene against fear or the uncanny. 4 Fraying - once per scene the Warden may have the character mis-see an ally as the Quiet, or hear a lure in a trusted voice. 5 Breaking - disadvantage on checks while any familiar face is present; may act on a hallucination once. 6 Unmade - at the worst moment the character does the thing that gets someone taken. Player keeps agency; Warden gains one hard complication. Drops by 1 per full rest in a true safe-hold, or by a real moment of human connection, comfort, or native kindness. The Gated Kill - both locks, late Lock 1 - Tier: the party is 9th level or higher. Below that no means matters; any attempt is a way to die. Lock 2 - The Means (assembled in play, never handed over, never a checklist): a truth about what it is - a way to hold it still (a real Relic, weapon, or working) - a way to make it stay dead (the threshold, a one-time native ward-circle, a dawn).</p>
<h3>When It Takes Someone</h3>
<p>It rarely kills - it takes, dragging into the dark. Across the campaign use all three: gone for good (a real loss) - recoverable by a fast, desperate rescue - returned later, worn - walking, talking, almost right, and not theirs. Always a cost, always survivable for the rest, never a TPK.</p>
<h3>Three Endings</h3>
<p>Spent fully, the Means drags the Quiet down to something a level-10 party can kill - no lair actions, cannot simply take a character, pinned where the kill lands. Kill = the way out. The Quiet holds the threshold shut; put it down for good and the seal fails - the party walk out free, the country&#x27;s fate left open. Escape is always the surer victory. Escape - flee; the Quiet lives and the country stays hunted. Kill - end it; the seal breaks, the party leave free, the future open. Become - a character takes the predator&#x27;s path and is remade as a new apex of the Gloamreach.</p>
<figure class="campaign-table-wrap">
<figcaption>Quiet Encounter Guardrails</figcaption>
<table class="campaign-table"><thead><tr><th>Rule</th><th>Table Practice</th></tr></thead><tbody>
<tr><td>Never open with a fair fight.</td><td>Open with signs, taken sound, wrong voices, or missing time.</td></tr>
<tr><td>Always leave an action.</td><td>Hide, flee, bargain, cut light, split, sacrifice gear, follow a native rule.</td></tr>
<tr><td>Do not TPK by surprise.</td><td>A strike changes the campaign state; it does not erase the table.</td></tr>
<tr><td>Let power matter.</td><td>Essence can save lives, but it rings the dinner bell.</td></tr>
<tr><td>Carry consequences home.</td><td>The final crossing changes the material world, the Bureau, and the survivors.</td></tr>
</tbody></table>
</figure>
<aside class="campaign-note"><h3>System Preservation</h3><p>These campaign systems are intentionally robust enough to graduate into the Rift Ascendant core rules later. Use the source prose below when it is more detailed; use these tables for table-speed reference.</p></aside>
<figure class="campaign-table-wrap">
<figcaption>Starting Vehicle Requisition Points</figcaption>
<table class="campaign-table"><thead><tr><th>Party Choice</th><th>VRP</th><th>Cost</th><th>Best Use</th></tr></thead><tbody>
<tr><td>Default allotment</td><td>3</td><td>None</td><td>One full-party vehicle with a few practical modifications.</td></tr>
<tr><td>Role package trade-in</td><td>+1 each</td><td>A character gives up their starting role package.</td><td>Teams that want heavier transport, drones, or hybrid vehicle/mount support.</td></tr>
<tr><td>Bureau justification bonus</td><td>+1</td><td>The party writes a clear mission-risk justification and accepts audit attention.</td><td>Tables that enjoy logistics, paperwork pressure, and later Bureau consequences.</td></tr>
<tr><td>Vermillion private supplement</td><td>+1 to +2</td><td>Take a favor debt, salvage claim, or rescue obligation.</td><td>Parties willing to owe someone before they know what the debt means.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Field Role Packages</figcaption>
<table class="campaign-table"><thead><tr><th>Package</th><th>Included Support</th><th>Campaign Pressure</th></tr></thead><tbody>
<tr><td>Field Lead</td><td>Command slate, map packet, consent authority for emergency withdrawal.</td><td>The Bureau will ask why the lead chose each risk.</td></tr>
<tr><td>AFA/Signals</td><td>Relay spike, signal tags, drone beacon, corrupted-data kit.</td><td>The Gloamreach can imitate clean readings.</td></tr>
<tr><td>Driver/Pilot</td><td>Vehicle tools, route placards, emergency tow straps.</td><td>Engines are useful, loud, and memorable.</td></tr>
<tr><td>Scout</td><td>Rangefinder, path tape, low-light lens, silent flare.</td><td>Going ahead means being the first thing the dark learns.</td></tr>
<tr><td>Medic</td><td>Triage kit, stabilizer doses, quarantine seals.</td><td>Care creates obligations the mission packet did not price.</td></tr>
<tr><td>Engineer</td><td>Patch plates, jury-rig harness, compact welder, battery cores.</td><td>Every repair trades time, noise, parts, or Essence.</td></tr>
<tr><td>Quartermaster</td><td>Ration crate, salvage tags, spare filters, trade chits.</td><td>Supplies become social currency inside native communities.</td></tr>
<tr><td>Ward-Keeper</td><td>Marking chalk, threshold cord, charm tags, ward-inspection lens.</td><td>Native rules matter more than Bureau confidence.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Starting Vehicle Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Asset</th><th>Capacity</th><th>Cost</th><th>Mods</th><th>Strength</th><th>Pressure</th></tr></thead><tbody>
<tr><td>Bureau Light Survey Rover</td><td>8 seats</td><td>0 VRP</td><td>3 mods</td><td>Full-party survey platform</td><td>Loud, wide, hard to hide</td></tr>
<tr><td>Bureau Compact Survey Rover</td><td>6 seats</td><td>0 VRP</td><td>3 mods</td><td>Balanced survey/cargo</td><td>Limited seats</td></tr>
<tr><td>Twin Scout UTVs</td><td>8 seats total</td><td>1 VRP</td><td>2 each</td><td>Redundancy and split scouting</td><td>Split-party temptation</td></tr>
<tr><td>Bureau Utility Van</td><td>8 seats</td><td>1 VRP</td><td>4 mods</td><td>Gear-heavy support</td><td>Poor off-road</td></tr>
<tr><td>Medical Response Van</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Triage and casualty support</td><td>Reduced cargo</td></tr>
<tr><td>Containment Van</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Samples and cores</td><td>Audit-heavy</td></tr>
<tr><td>Civilian 4x4 Refit</td><td>5 seats</td><td>0 VRP</td><td>2 mods</td><td>Grounded, replaceable</td><td>Less durable</td></tr>
<tr><td>Sedan Pair</td><td>8 seats</td><td>0 VRP</td><td>1 each</td><td>Roadlike scans</td><td>Bad terrain</td></tr>
<tr><td>Patrol Motorcycle Team</td><td>up to 8</td><td>1 VRP</td><td>1 each</td><td>Fast outriders</td><td>Exposed, loud</td></tr>
<tr><td>ManaCycle Team</td><td>up to 8</td><td>2 VRP</td><td>1 each</td><td>Fast Essence- assisted transit</td><td>Essence signature</td></tr>
<tr><td>Rover + Outrider Bikes</td><td>8 total</td><td>2 VRP</td><td>mixed</td><td>Balanced central support and scouts</td><td>Complex logistics</td></tr>
<tr><td>Cargo Rover + Passenger Sled</td><td>8 total</td><td>1 VRP</td><td>4+1</td><td>Supplies and salvage</td><td>Slow, noisy turns</td></tr>
<tr><td>Bureau Mule Drone</td><td>0</td><td>0 VRP</td><td>2 mods</td><td>Cargo and relay support</td><td>AFA-dependent</td></tr>
<tr><td>Recon Drone Pair</td><td>0</td><td>1 VRP</td><td>1 each</td><td>Scouting</td><td>Signal failure risk</td></tr>
<tr><td>Compact Bridge Cart</td><td>2 seats</td><td>2 VRP</td><td>3 mods</td><td>Gap crossing</td><td>Slow and noisy</td></tr>
<tr><td>Rescue Cart</td><td>2 + casualties</td><td>1 VRP</td><td>3 mods</td><td>Extraction</td><td>Limited combat utility</td></tr>
<tr><td>Cargo Crawler</td><td>4 seats</td><td>2 VRP</td><td>4 mods</td><td>Durable hauling</td><td>Very slow and loud</td></tr>
<tr><td>Inflatable Survey Raft</td><td>6-8 seats</td><td>0 VRP</td><td>2 mods</td><td>Water scan support</td><td>Terrain limited</td></tr>
<tr><td>Compact Survey Skiff</td><td>6 seats</td><td>1 VRP</td><td>3 mods</td><td>Flooded/marsh survey</td><td>Water only</td></tr>
<tr><td>Rail-Sled Survey Kit</td><td>4 seats</td><td>1 VRP</td><td>2 mods</td><td>Tunnel movement</td><td>Setup time</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Starting Mount Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Asset</th><th>Capacity</th><th>Cost</th><th>Slots</th><th>Strength</th><th>Pressure</th></tr></thead><tbody>
<tr><td>Quartermaster Mule Team</td><td>4-8 riders/cargo</td><td>0 VRP</td><td>2 tack each</td><td>Reliable cargo</td><td>Slow</td></tr>
<tr><td>Bureau Warhorse Team</td><td>up to 8 riders</td><td>1 VRP</td><td>2 tack each</td><td>Open terrain speed</td><td>Noise and panic</td></tr>
<tr><td>Dust-Rift Camel Team</td><td>up to 8 riders</td><td>1 VRP</td><td>2 tack each</td><td>Endurance and heat</td><td>Tight-space issues</td></tr>
<tr><td>Pack Survey Beast Team</td><td>4-8 mix</td><td>0 VRP</td><td>2 tack each</td><td>Rough-ground logistics</td><td>Low combat nerve</td></tr>
<tr><td>Mountain Patrol Goat Team</td><td>up to 8 light riders</td><td>1 VRP</td><td>1 tack each</td><td>Cliffs and stone</td><td>Low capacity</td></tr>
<tr><td>Rescue Litter Mount Pair</td><td>casualties</td><td>1 VRP</td><td>2 tack each</td><td>Medical extraction</td><td>Slow</td></tr>
<tr><td>Bureau K-9 Harness Team</td><td>cargo/tracking</td><td>1 VRP</td><td>1 tack each</td><td>Warning and retrieval</td><td>Fear vulnerable</td></tr>
<tr><td>Mana-Touched Wolf Scout Pair</td><td>support/rider</td><td>2 VRP</td><td>1 tack each</td><td>Mana sensing</td><td>Harder to control</td></tr>
<tr><td>Bureau Pack Ox Pair</td><td>heavy cargo</td><td>1 VRP</td><td>3 tack each</td><td>Hauling</td><td>Hard to hide</td></tr>
<tr><td>Mule Cart Expedition</td><td>4 riders + cart</td><td>0 VRP</td><td>2 cart/tack</td><td>Quiet low-tech</td><td>Slow</td></tr>
<tr><td>Rover + Pack Mules</td><td>6 seats + cargo</td><td>1 VRP</td><td>mixed</td><td>Balanced hybrid</td><td>Management burden</td></tr>
<tr><td>UTV + Warhorse Outriders</td><td>8 total</td><td>2 VRP</td><td>mixed</td><td>Mixed scouting</td><td>Coordination burden</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Complete Vehicle and Mount Modification Catalogue</figcaption>
<table class="campaign-table"><thead><tr><th>Modification</th><th>Cost</th><th>Type</th><th>Benefit</th><th>Pressure</th></tr></thead><tbody>
<tr><td>All-Terrain Tires</td><td>1 VRP</td><td>Mobility</td><td>Reduced rough- ground DCs</td><td>Tire damage still matters</td></tr>
<tr><td>Basic Tread Kit</td><td>1 VRP</td><td>Mobility</td><td>Better traction in mud, ash, roots, broken stone</td><td>Noisy on hard road</td></tr>
<tr><td>Rock-Crawler Suspension</td><td>2 VRP</td><td>Mobility</td><td>Improves broken stone and root terrain</td><td>Slower speed</td></tr>
<tr><td>Quiet-Run Baffling</td><td>2 VRP</td><td>Stealth</td><td>Ignore one engine- noise Hunt trigger per travel scene</td><td>Needs maintenance</td></tr>
<tr><td>Headlight Shutters</td><td>1 VRP</td><td>Stealth</td><td>Reduce light signature</td><td>Lower visibility</td></tr>
<tr><td>Low-Noise Brakes</td><td>1 VRP</td><td>Stealth</td><td>Stop quietly once per scene</td><td>Requires handling check under stress</td></tr>
<tr><td>AFA Relay Mast</td><td>2 VRP</td><td>AFA</td><td>Extend AFA range</td><td>Vulnerable to interference</td></tr>
<tr><td>AFA Blackbox Recorder</td><td>3 VRP</td><td>AFA</td><td>Preserve corrupted data</td><td>Attracts faction interest</td></tr>
<tr><td>Terrain Sonar</td><td>2 VRP</td><td>Sensor</td><td>Detect hollows and unstable ground</td><td>Can ping the Hunt Clock</td></tr>
<tr><td>False-Ping Filter</td><td>2 VRP</td><td>Sensor</td><td>Helps detect fake team signals</td><td>Can reject real desperate pings</td></tr>
<tr><td>Cabin Seal Kit</td><td>2 VRP</td><td>Hazard</td><td>Protects against miasma/spores/ash</td><td>Limited duration</td></tr>
<tr><td>Hazard Foam Dispenser</td><td>3 VRP</td><td>Hazard</td><td>Seal breach or bloom once</td><td>Messy and visible</td></tr>
<tr><td>Medical Bench</td><td>1 VRP</td><td>Medical</td><td>Stabilize while stationary or slow</td><td>Takes cargo space</td></tr>
<tr><td>Containment Crate</td><td>2 VRP</td><td>Containment</td><td>Store unstable materials</td><td>Audit-heavy</td></tr>
<tr><td>Front Winch</td><td>1 VRP</td><td>Utility</td><td>Towing and extraction</td><td>Loud under load</td></tr>
<tr><td>Spare Parts Locker</td><td>1 VRP</td><td>Repair</td><td>One repair without scavenging</td><td>Finite</td></tr>
<tr><td>Field Repair Arm</td><td>3 VRP</td><td>Repair</td><td>Major repairs without full workshop</td><td>Complex, fragile</td></tr>
<tr><td>Drone Cradle</td><td>2 VRP</td><td>Drone</td><td>Carry and recharge drone</td><td>AFA-dependent</td></tr>
<tr><td>Pack Saddle</td><td>1 VRP</td><td>Mount Tack</td><td>Cargo capacity</td><td>Reduces speed if overloaded</td></tr>
<tr><td>Medical Litter</td><td>1 VRP</td><td>Mount Tack</td><td>Carry wounded safely</td><td>Slows mount</td></tr>
<tr><td>AFA Collar</td><td>1 VRP</td><td>Mount Tack</td><td>Track mount vitals</td><td>Can give false comfort</td></tr>
<tr><td>Low-Noise Hoof Wrap</td><td>1 VRP</td><td>Mount Tack</td><td>Reduce travel sound</td><td>Wears out</td></tr>
<tr><td>Gate-Calm Training</td><td>1 VRP</td><td>Training</td><td>Resist threshold panic</td><td>Not immune to Domain horror</td></tr>
<tr><td>Roadwise Training</td><td>2 VRP</td><td>Training</td><td>Warns against unsafe roads</td><td>Mount may refuse orders</td></tr>
<tr><td>Panic-Resistant Training</td><td>2 VRP</td><td>Training</td><td>Resists Quiet pressure</td><td>Cannot be forced forever</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Vehicle Condition Track</figcaption>
<table class="campaign-table"><thead><tr><th>State</th><th>Trigger</th><th>Effect</th><th>Field Repair</th></tr></thead><tbody>
<tr><td>Ready</td><td>No current damage.</td><td>Full speed and all installed mods function.</td><td>None.</td></tr>
<tr><td>Stressed</td><td>A hard impact, failed terrain check, or ignored maintenance scene.</td><td>One mod is unreliable until repaired.</td><td>10 minutes, parts, and a DC 12 Engineering or equivalent check.</td></tr>
<tr><td>Damaged</td><td>Second stress, serious attack, flooding, fire, or failed chase consequence.</td><td>Speed halved; loud operation fills one Hunt Clock segment per scene.</td><td>1 hour, spare parts, and DC 14 Engineering; consumes a parts use.</td></tr>
<tr><td>Crippled</td><td>Third stress or major Domain hazard.</td><td>Cannot travel normally; can limp only in short exposed bursts.</td><td>Safehold workshop or field repair arm; DC 16 and a meaningful complication.</td></tr>
<tr><td>Lost</td><td>Abandoned, swallowed, claimed by a faction, or destroyed.</td><td>The team must shift to mounts, foot travel, salvage, or bargaining.</td><td>Recover as a side quest or replace through faction reputation.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Mount Condition Track</figcaption>
<table class="campaign-table"><thead><tr><th>State</th><th>Trigger</th><th>Effect</th><th>Care</th></tr></thead><tbody>
<tr><td>Calm</td><td>Fed, rested, and handled well.</td><td>Full speed; can carry normal load.</td><td>Normal watch and feed.</td></tr>
<tr><td>Spooked</td><td>Hunt near miss, open Essence surge, blood scent, or loud engine panic.</td><td>Disadvantage on the next exposed travel handling check.</td><td>10 minutes of quiet handling or native guidance.</td></tr>
<tr><td>Blown</td><td>Forced march, injury, or panic in the dark.</td><td>Speed halved; refuses one dangerous route.</td><td>Long rest in shelter, medicine, and a successful Animal Handling or Presence check.</td></tr>
<tr><td>Injured</td><td>Direct harm, fall, or exhaustion pushed too far.</td><td>Cannot carry riders; may still carry light cargo.</td><td>Safehold treatment, supplies, or a hard choice to leave cargo behind.</td></tr>
<tr><td>Gone</td><td>Taken, fled, killed, traded, or released.</td><td>The party loses capacity and may owe grief to the community that trusted them.</td><td>Recover, replace, or memorialize; do not treat mounts as disposable gear.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Field Crafting Procedure</figcaption>
<table class="campaign-table"><thead><tr><th>Step</th><th>Question</th><th>Result</th></tr></thead><tbody>
<tr><td>Intent</td><td>What problem is the team solving right now?</td><td>A bridge patch, baffle, lure, ward, splint, relay, trap, or repair.</td></tr>
<tr><td>Materials</td><td>What is being consumed?</td><td>Parts, salvage, cores, time, battery, animal tack, community favor, or Essence.</td></tr>
<tr><td>Worksite</td><td>Where is the work done?</td><td>Open road is fast and dangerous; safehold work is slower but steadier.</td></tr>
<tr><td>Check</td><td>Who leads and who assists?</td><td>Use the most relevant RA skill/tool; failure creates pressure instead of blank denial.</td></tr>
<tr><td>Cost</td><td>What does the Domain learn?</td><td>Noise, light, scent, Essence, a name, a debt, or a visible route.</td></tr>
</tbody></table>
</figure>
<figure class="campaign-table-wrap">
<figcaption>Campaign Progression Spine</figcaption>
<table class="campaign-table"><thead><tr><th>Levels</th><th>Primary Play</th><th>Campaign Lessons</th><th>Typical Milestone</th></tr></thead><tbody>
<tr><td>1-2</td><td>Bureau procedure and first-entry survey.</td><td>AFA sync, requisition, relay work, first contradiction.</td><td>The map continues beyond the mission boundary.</td></tr>
<tr><td>2-4</td><td>Survival and native rules.</td><td>Sound discipline, safeholds, worn dead, roads, local debt.</td><td>The party gains shelter or loses a sure route.</td></tr>
<tr><td>4-6</td><td>Faction play and salvage economy.</td><td>Vermillion leverage, Bureau truths, cult pressure, crafting upgrades.</td><td>A major location changes hands or breaks.</td></tr>
<tr><td>6-8</td><td>The Means and moral endgame choices.</td><td>Escape, seal, kill, bargain, rescue, or expose.</td><td>A required truth or Relic is won at a price.</td></tr>
<tr><td>8-10</td><td>Final crossing and aftermath.</td><td>The Quiet, Rift Break risk, Domain consequences, homecoming.</td><td>The party chooses what survives the ending.</td></tr>
</tbody></table>
</figure>
</div>
`;

const STEWARDSHIP_BODY = `
<div class="campaign-prose">
<h2>Appendix L - Saving and Stewarding the Gloamreach</h2>
<p>This appendix is optional. Run Silent remains a survival-horror campaign first: the party begins as low-rank Ascendants, enters from the material world under Bureau briefing, becomes trapped inside a country-scale Rift Interior, and survives the Quiet. If the table wants the campaign to continue after escape, the Gloamreach can become something more than a place to flee. It can become a saved Domain. Run this continuation on the Warden&#x27;s standard living-world tools - <strong>Warden Guide, Aftermath &amp; Living World</strong> - with the campaign-specific stewardship tracks below layered on top.</p>
<p>Do not frame this as conquest. The Gloamreach is inhabited. Its people are native to the Interior, and they have survived longer than the material-world doorway has existed. The party can become protectors, treaty-holders, Anchor-successors, or stewards only if they earn trust, preserve communities, defeat or transform the Quiet, and accept that Bureau authority does not automatically apply past the Threshold.</p>
<h3>When This Unlocks</h3>
<p>Offer stewardship only after the party has reached the endgame and resolved the Quiet's hold on the Gloamreach. The option becomes available if at least three of the following are true: a major native community trusts the party; the party assembled the Means without exploiting the Gloamreach; the Quiet is killed, bound, transformed, or driven from the Threshold; the Bureau Annex truth is exposed or corrected; the party prevented a major Guild extraction abuse; at least one native witness supports continued crossing; and the final crossing leaves the Threshold stable enough to negotiate rather than collapse.</p>
<h3>Stewardship Tracks</h3>
<figure class="campaign-table-wrap">
<figcaption>Domain Stewardship Tracks</figcaption>
<table class="campaign-table"><thead><tr><th>Track</th><th>What It Measures</th><th>Starts At</th><th>When It Breaks</th></tr></thead><tbody>
<tr><td>Domain Stability</td><td>Whether the Gloamreach can remain a persistent Rift Interior without collapsing or lashing outward.</td><td>1 plus one for each major site stabilized.</td><td>Rift weather worsens, roads turn predatory, and safeholds lose rules.</td></tr>
<tr><td>Threshold Integrity</td><td>Whether travel between the material world and the Gloamreach can be scheduled, keyed, or contained.</td><td>0 if the Quiet died violently; 2 if the final crossing repaired the route.</td><td>Crossings become random, illegal entry spikes, or a Rift Break begins.</td></tr>
<tr><td>Native Trust</td><td>Whether Gloamreach communities believe the party protects rather than possesses them.</td><td>Faction reputation average, minimum 0.</td><td>Communities close wardlines, hide routes, or name the party as another threat.</td></tr>
<tr><td>Bureau Pressure</td><td>How aggressively the Bureau asserts containment, classification, quarantine, or ownership.</td><td>2 unless the party has strong Bureau allies.</td><td>The Bureau locks down travel, claims salvage, or removes the party from authority.</td></tr>
<tr><td>Guild Interest</td><td>How much private power wants routes, salvage, Relics, Essence, labor, or fame.</td><td>1 plus one for each public miracle brought home.</td><td>Smugglers, sponsors, rival teams, and contract debt destabilize the Domain.</td></tr>
<tr><td>Quiet Remnant</td><td>How much of the old predator remains in roads, worn dead, dreams, and sound.</td><td>3 if the Quiet escaped or transformed; 1 if killed with the Means.</td><td>The Hunt Clock returns as a regional crisis instead of an encounter tool.</td></tr>
<tr><td>Salvage Economy</td><td>Whether trade supports both worlds without turning the Gloamreach into a mine.</td><td>0 until a charter exists.</td><td>Scarcity, exploitation, black markets, and community resentment rise.</td></tr>
<tr><td>Anchor Stress</td><td>The cost paid by whoever or whatever now stabilizes the Domain.</td><td>0 unless a character becomes an Anchor-successor.</td><td>The steward gains conditions, visions, obligations, or Regent-like pressure.</td></tr>
</tbody></table>
</figure>
<h3>Stewardship Turns</h3>
<p>Resolve one stewardship turn for every month of campaign time, or once between major post-campaign adventures. Each turn, the players choose two priorities: repair, diplomacy, containment, patrol, trade, research, resettlement, justice, secrecy, or opening. Each chosen priority improves one track or prevents one crisis. Each ignored pressure track may trigger an event.</p>
<figure class="campaign-table-wrap">
<figcaption>Stewardship Actions</figcaption>
<table class="campaign-table"><thead><tr><th>Action</th><th>Improves</th><th>Cost Or Risk</th><th>Adventure Hook</th></tr></thead><tbody>
<tr><td>Repair a Site</td><td>Domain Stability or Threshold Integrity.</td><td>Parts, Essence, local labor, or dangerous fieldwork.</td><td>A stabilized site reveals what the Quiet was suppressing.</td></tr>
<tr><td>Honor a Native Law</td><td>Native Trust and Domain Stability.</td><td>The party accepts a rule that inconveniences material-world power.</td><td>A community asks the party to enforce a law against a Bureau ally.</td></tr>
<tr><td>Negotiate the Cordon</td><td>Bureau Pressure.</td><td>Paperwork, oversight, public testimony, or classified compromise.</td><td>A Bureau superior offers legitimacy in exchange for control.</td></tr>
<tr><td>License a Route</td><td>Threshold Integrity and Salvage Economy.</td><td>Creates targets for smugglers and Guild investors.</td><td>A convoy goes missing on a route the party guaranteed.</td></tr>
<tr><td>Close a Black Market</td><td>Guild Interest and Native Trust.</td><td>Lose resources, favors, or sponsor goodwill.</td><td>Vermillion rivals ask for protection from something worse.</td></tr>
<tr><td>Hunt a Remnant</td><td>Quiet Remnant.</td><td>Reopens old fear and may mark a steward.</td><td>A familiar voice returns to a safehold that had begun to heal.</td></tr>
<tr><td>Found a Charter</td><td>Salvage Economy, Native Trust, and Bureau Pressure.</td><td>Requires public terms and someone powerful will hate them.</td><td>The signing is attacked by a faction that benefits from chaos.</td></tr>
<tr><td>Bear the Anchor</td><td>Domain Stability and Threshold Integrity.</td><td>Raises Anchor Stress.</td><td>The steward begins dreaming roads before they exist.</td></tr>
</tbody></table>
</figure>
<h3>Post-Campaign Travel</h3>
<p>Travel between worlds is possible only if the ending left a stable method. Choose the method earned in play. A stabilized Threshold uses Bureau containment, AFA relay lattices, native ward consent, and a crossing schedule. A Relic key opens a route only for named travelers and named cargo. A native road opens when its rules are honored. An Anchor pact allows the stewards to cross but taxes Anchor Stress. A quiet road always works but never becomes safe: each crossing uses a Hunt Clock or Domain pressure check if Quiet Remnant is 2 or higher.</p>
<h3>Possible Stewardship Outcomes</h3>
<p><strong>Sovereign Gloamreach.</strong> The party protects travel and treaty terms, but native communities govern themselves. This is the default good ending for tables that value repair over rule.</p>
<p><strong>Stewardship Charter.</strong> The party becomes the recognized operating authority between the Bureau, native communities, and approved outsiders. This is the most playable ongoing campaign structure.</p>
<p><strong>Anchor Succession.</strong> One or more characters bind themselves to the Gloamreach as a stabilizing force. This is powerful, intimate, and costly. Treat it like a Regent-scale story commitment, not a reward coupon.</p>
<p><strong>Open Crossing.</strong> The route becomes usable by communities, researchers, rescue teams, and trade. This is hopeful and dangerous. Bureau Pressure, Guild Interest, and Salvage Economy become the main campaign engine.</p>
<p><strong>Sealed Mercy.</strong> The party saves the Gloamreach by closing the door. They may keep a rare way back through a Relic key, dream-road, or Anchor promise, but the material world cannot freely enter.</p>
<h3>Warden Rule</h3>
<p>The party can help the Gloamreach become safe enough to live in. They cannot make it ordinary. The best ending does not turn the Domain into property. It turns survival into a responsibility the table chose.</p>
</div>
`;

export const runSilentSections: BookSection[] = [
{
            		id: "front-matter",
            		part: "Introduction",
            		title: "What Is Run Silent?",
            		kicker: "Overview",
            		summary: "Campaign mandate, Warden-only truths, and the Rift Ascendant premise.",
		image: "/ui-art/run_silent_cover.png",
            		body: () => `${runSilentFigure("cover-run-silent", "Run Silent establishes the Gloamreach as a full Rift Ascendant campaign setting.")}${FRONT_MATTER_BODY}${runSilentArtCoverageSummary()}`,
            	},
{
            		id: "material-world-opening",
            		part: "Part I: The New Threshold",
            		title: "First Entry and the Material World",
            		kicker: "Chapters 0-1",
            		summary: "The required starter arc: Bureau briefing, Threshold cordon, AFA sync, requisition, the Survey Layer, and the Black Road / First Road.",
		image: "/ui-art/rift-gate-hero.png",
            		body: () => `${runSilentFigure("rift-threshold-map", "The campaign opens in the material world at a Bureau-controlled Threshold.")}${FIRST_ENTRY_BODY}`,
            	},
{
            		id: "field-systems",
            		part: "Part I: The New Threshold",
            		title: "Requisition, Crafting, Vehicles, and Mounts",
            		kicker: "Chapter 1B",
            		summary: "The preserved and expanded campaign logistics system for transport, mounts, modifications, and field engineering.",
		image: "/ui-art/bureau_light_survey_rover.png",
            		body: () => `${runSilentFigure("vehicle-bureau-rover", "The Bureau light survey rover anchors the party's first-entry logistics.")}${FIELD_SYSTEMS_BODY}`,
            	},
{
            		id: "map-does-not-end",
            		part: "Part I: The New Threshold",
            		title: "The Map Does Not End",
            		kicker: "Chapters 2-4",
            		summary: "The first contradiction, sound discipline, transport pressure, first native contact, and the point where the Gloamreach sandbox opens.",
		image: "/ui-art/rift-gate-hero.png",
            		body: MAP_DOES_NOT_END_BODY,
            	},
{
            		id: "rift-ascendant-lore-alignment",
            		part: "Part II: Rift Ascendant Lore",
            		title: "Rift Ascendant Lore and the Gloamreach",
            		kicker: "World Alignment",
            		summary: "How the Gloamreach fits the Rift Age, persistent Interiors, Domains, Anchors, Bureau doctrine, and the AFA.",
		image: "/ui-art/the_obsidian_spire.png",
            		body: () => `${runSilentFigure("obsidian-spire-plate", "The Obsidian Spire is visible across the Gloamreach and reframes the Domain's scale.")}${LORE_BODY}`,
            	},
{
            		id: "running-this-horror",
            		part: "Part III: Warden Operations",
            		title: "Running This Horror",
            		kicker: "Rules and Pressure",
            		summary: "Safety, Hunt Clock, Dread, Essence-as-bait, safeholds, exposed travel, and the means to end the campaign.",
		image: "/ui-art/hollow_mother.png",
            		body: () => `${runSilentFigure("hollow-mother-plate", "The Hollow Mother embodies the campaign's grief, cult pressure, and predatory mercy.")}${RUNNING_BODY}`,
            	},
{
            		id: "gloamreach-gazetteer",
            		part: "Part IV: The Gloamreach",
            		title: "The Gloamreach Region Guide",
            		kicker: "Gazetteer",
            		summary: "Regions, roads, communities, factions, travel, reputation, markets, and survival economy.",
		image: "/ui-art/the_obsidian_spire.png",
            		body: () => `${runSilentFigure("obsidian-spire-map", "Temporary regional anchor art pending the generated Gloamreach map set.")}${REGION_BODY}`,
            	},
{
            		id: "major-locations",
            		part: "Part V: Keyed Locations",
            		title: "Major Locations of the Gloamreach",
            		kicker: "Sites and Dungeons",
            		summary: "The Annex, Vermillion Outpost, Hollow Way, Ledgerfen, Depths, Orchard, Counting-House, Tunnels, Bastion, Spire, communities, mana veins, and Awoko Sanctum.",
		image: "/ui-art/the_obsidian_spire.png",
            		body: () => `${runSilentFigure("obsidian-spire-plate", "Major sites should each receive unique maps during the production art pass.")}${LOCATIONS_BODY}`,
            	},
{
            		id: "pressure-quests-rewards",
            		part: "Part VI: Campaign Web",
            		title: "Pressure, Side Quests, Relics, and Rewards",
            		kicker: "Quests and Treasure",
            		summary: "The Quiet hunts, side quests, Domain pressure encounters, allies, relics, rewards, horror pillars, intel, hooks, stat-block guidance, and campaign props.",
		image: "/ui-art/the_hush_blade.png",
            		body: () => `${runSilentFigure("relic-hush-blade", "Relics in Run Silent are tools for changing routes, costs, and endings.")}${QUESTS_BODY}`,
            	},
{
            		id: "endgame",
            		part: "Part VII: Endgame",
            		title: "The Deep Gloamreach and the Final Crossing",
            		kicker: "Levels 8-10",
            		summary: "The final route, the Quiet at the end, endings, and campaign aftermath.",
		image: "/ui-art/the_obsidian_spire.png",
            		body: () => `${runSilentFigure("obsidian-spire-plate", "The final crossing decides whether the Gloamreach remains hunted, sealed, saved, or transformed.")}${ENDGAME_BODY}`,
            	},
{
            		id: "appendices-allies-factions-encounters",
            		part: "Appendices",
            		title: "Allies, Factions, Encounters, Side Quests, and Treasure",
            		kicker: "Appendices A-H",
            		summary: "Recruitable allies, faction membership, encounter suites, side quests, treasure, timeline, handouts, secrets, and plot beats.",
		image: "/ui-art/hollow_mother.png",
            		body: () => `${runSilentFigure("portrait-hollow-mother", "Faction portraits should become a full appendix art pass; this is the current selected anchor.")}${APPENDIX_ALLIES_BODY}`,
            	},
{
            		id: "appendices-quiet-transport-reference",
            		part: "Appendices",
            		title: "The Quiet, Worn Dead, and Field Reference",
            		kicker: "Appendices I-K",
            		summary: "The Worn Dead, The Quiet, lair and legendary actions, taking survivors, endings, and transport reference.",
		image: "/ui-art/bureau_light_survey_rover.png",
            		body: () => `${APPENDIX_QUIET_BODY}${runSilentFigure("vehicle-bureau-rover", "Transport and mount systems remain preserved for later Rift Ascendant core expansion.")}`,
            	},
{
            		id: "appendix-domain-stewardship",
            		part: "Appendices",
            		title: "Saving and Stewarding the Gloamreach",
            		kicker: "Optional Campaign Continuation",
            		summary: "A Rift Ascendant-native path for saving the Gloamreach, stabilizing travel, and becoming stewards without turning native communities into property.",
		image: "/ui-art/rift-gate-hero.png",
            		body: () => `${runSilentFigure("stewardship-plate", "A generated stewardship plate will replace this empty slot once approved.")}${STEWARDSHIP_BODY}`,
            	}
];
