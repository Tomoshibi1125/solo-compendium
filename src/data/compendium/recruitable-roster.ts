// ============================================================================
// RECRUITABLE FIELD ROSTER (setting-agnostic, guild-recruitable)
//
// 36 unique, fully-built recruitable NPCs that live OUTSIDE the Run Silent
// sandbox roster (`sandbox-npcs.ts`) but share its `SandboxNPC` shape:
//   - 6 Glassline crew (from docs/adventure-glassline-claim.md) — mundane
//     Ironclad contractors/labourers available for hire between contracts.
//   - 15 Bureau lower-rank personnel — a varied mix of mundane support staff
//     and E–D field Ascendants who can lawfully take guild work (off-duty,
//     reservist, probationary, seconded, or disillusioned).
//   - 15 independent ascendants — freelancers of every archetype, ranks E–A.
//
// All are `isRecruitable: true` + `guildAffiliation: null` so they surface in
// the guild recruitment pool. They reuse the existing faction values only.
// Canon: source_book "Rift Ascendant Canon".
// ============================================================================

import {
	getUnaffiliatedNPCs,
	makeNPC,
	type SandboxNPC,
} from "@/data/compendium/sandbox-npcs";

// ============================================================================
// GLASSLINE CREW — Ironclad Extraction Services (mundane contractors)
// ============================================================================
const glasslineCrew: SandboxNPC[] = [
	makeNPC({
		id: "npc-glx-001",
		name: "Mira Voss",
		title: "Ironclad Claim Lead",
		faction: "independent",
		level: 3,
		kind: "mundane",
		job: "Claim Lead",
		hp: 16,
		ac: 12,
		description:
			"A crisp Ironclad field officer who is always three problems behind schedule and never lets it show to the crew.",
		personality:
			"Polite, exacting, unflappable, and quietly loyal to anyone who keeps her files clean.",
		motivation:
			"Run a profitable, lawsuit-free extraction and protect the workers who trust her with their lives.",
		backstory:
			"Mira clawed up from junior loader to claim lead by being the one person at Ironclad who reads the whole contract.",
		keyAbilities: ["Contract Mastery", "Crew Logistics", "Bureau Liaison"],
		recruitCondition:
			"Finish a Glassline-style job cleanly under her and she brings her crew, her contacts, and her paperwork to your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Ironclad staging yard, Eternal Shadow Dungeon",
		questHook:
			"Mira's last clean file came back from the Bureau bearing one signature she swears she never collected.",
		maxLevel: 5,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-glx-002",
		name: "Tomas Hale",
		title: "Ironclad Crew Boss",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Crew Boss",
		hp: 20,
		ac: 13,
		description:
			"A broad construction lead in a high-visibility vest who reads unsafe floors the way others read warning signs.",
		personality:
			"Steady, blunt, protective, and unwilling to leave a worker behind without a reason.",
		motivation: "Get every worker home with their fingers and their pay.",
		backstory:
			"Tomas ran surface crews for a decade before the Rifts made his structural eye worth hazard pay.",
		keyAbilities: ["Structural Judgment", "Crew Discipline", "Heavy Tools"],
		recruitCondition:
			"Keep his crew alive through one bad shift and he follows you anywhere with the tool case on his shoulder.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "L-3 Glassline Haul Sector",
		questHook:
			"Tomas swears the haulway floor he certified safe this morning is a different shape tonight.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-glx-003",
		name: "Nia Cho",
		title: "Rift Porter",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Rift Porter",
		hp: 14,
		ac: 12,
		description:
			"A sharp logistics carrier who labels every glowing, hissing, expensive thing before anyone else can touch it.",
		personality:
			"Wry, careful, mercenary about samples, and braver than the contract requires.",
		motivation:
			"Get paid, keep the samples honest, and never let salvage go missing on her ledger.",
		backstory:
			"Nia learned salvage appraisal the hard way after a crew chief tried to skim her count.",
		keyAbilities: ["Salvage Appraisal", "Sample Handling", "Load-Bearing"],
		recruitCondition:
			"Trust her ledger over a louder voice once and she ports for your guild and audits your loot for free.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "L-3 Glassline Haul Sector, sample line",
		questHook:
			"Nia's ledger lists one sealed sample more than the crew ever pulled from the seam.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-glx-004",
		name: "Dev Arlen",
		title: "AFA Survey Tech",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Survey Tech",
		hp: 12,
		ac: 11,
		description:
			"An AFA-linked surveyor who narrates the map arguing with itself like it is a mildly difficult coworker.",
		personality:
			"Anxious, clever, talkative, and prone to freezing when the readings contradict each other.",
		motivation:
			"Prove a seam is worth a future contract and survive being right about it.",
		backstory:
			"Dev washed out of a Guild survey corps for flagging a 'safe' route that later ate a team — and being correct.",
		keyAbilities: ["AFA Survey", "Route Marking", "Anomaly Readings"],
		recruitCondition:
			"Give them one safe work window to prove a reading and they map for your guild gladly.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "L-3 Glassline Haul Sector, marker line",
		questHook:
			"Dev's tablet keeps returning a beacon ping from a marker they have not placed yet.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-glx-005",
		name: "Rae Sutter",
		title: "Junior Loader",
		faction: "independent",
		level: 1,
		kind: "mundane",
		job: "Junior Loader",
		hp: 10,
		ac: 11,
		description:
			"A nervous first-job labourer who knows the safety manual by heart and did not expect it to have a smell.",
		personality:
			"Earnest, jumpy, observant, and determined not to look as scared as they are.",
		motivation:
			"Survive their first interior job and earn a place on the next one.",
		backstory:
			"Rae took the Ironclad job to pay a family debt and discovered they notice the details veterans miss.",
		keyAbilities: ["Practical Eye", "Sled-Hauling", "Safety Drill"],
		recruitCondition:
			"Make sure they make it home from their first job and they loyally load for your guild ever after.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "L-3 Glassline Haul Sector, sample sled",
		questHook:
			"Rae keeps finding the sample sled re-strapped each morning in a knot they do not know how to tie.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-glx-006",
		name: "Harlan Pike",
		title: "Rival Claim Agent",
		faction: "independent",
		level: 3,
		kind: "mundane",
		job: "Claim Agent",
		hp: 16,
		ac: 12,
		description:
			"A smug, contract-literate claim agent who reads the boundary map before walking anyone into a lawsuit.",
		personality:
			"Glib, calculating, professional, and more reasonable than his opening posture suggests.",
		motivation:
			"Win claims by paperwork, not violence, and be the smartest professional in any haulway.",
		backstory:
			"Harlan built a career on other crews' sloppy filings and is quietly tired of working for people worse than he is.",
		keyAbilities: ["Claim Law", "Negotiation", "Boundary Survey"],
		recruitCondition:
			"Beat him cleanly on the paperwork instead of the fists and he switches sides to whoever respects the rules.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Eternal Shadow Dungeon, disputed claim line",
		questHook:
			"Harlan's rival employer just filed a claim under his name that he never signed.",
		maxLevel: 5,
		autoLevel: false,
	}),
];

// ============================================================================
// BUREAU LOWER-RANKS — support staff + E–D field Ascendants cleared for guild work
// ============================================================================
const bureauFieldRoster: SandboxNPC[] = [
	makeNPC({
		id: "npc-bfr-001",
		name: "K. Serrano",
		title: "Bureau Contract Processor",
		faction: "bureau_sentinels",
		level: 1,
		kind: "mundane",
		job: "Intake Clerk",
		hp: 8,
		ac: 11,
		description:
			"A dry-eyed intake clerk with perfect nails who has saved more lives with paperwork than most do with powers.",
		personality:
			"Deadpan, efficient, unbribable, and secretly invested in every cell she signs through Window Three.",
		motivation:
			"Process clean files so no rookie cell becomes a liability event on her watch.",
		backstory:
			"Serrano has watched a thousand new Ascendants walk into Rifts; she remembers the names the Bureau filed away.",
		keyAbilities: [
			"Contract Intake",
			"Liability Assessment",
			"Bureau Procedure",
		],
		recruitCondition:
			"Bring a contract cell back clean enough to impress her and she quits the window to run your guild's filings.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Contract Intake Office, Window Three",
		questHook:
			"Serrano flagged a cell that signed in this morning under license numbers issued to the dead.",
		maxLevel: 3,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-bfr-002",
		name: "Cadet Imani Okoro",
		title: "Bureau Field Cadet",
		faction: "bureau_sentinels",
		level: 2,
		rank: "E",
		job: "Holy Knight",
		hp: 20,
		ac: 14,
		description:
			"A bright-eyed probationary cadet still learning that the Bureau's clean reports hide messy nights.",
		personality:
			"Idealistic, eager, disciplined, and beginning to ask uncomfortable questions.",
		motivation:
			"Earn a full license and prove the Bureau can be the thing the recruitment posters promised.",
		backstory:
			"Imani topped her academy class and was assigned to escort duty before anyone told her what the job costs.",
		keyAbilities: ["Cadet Drill", "Guard Stance", "First Response"],
		recruitCondition:
			"Show her a guild that protects people better than her posting does and she requests a transfer to your banner.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau cordon, probationary roster",
		questHook:
			"Imani's training-sergeant ordered her to un-log an incident she is sure killed someone.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-bfr-003",
		name: "Corporal Vance Okafor",
		title: "Cordon Gunner",
		faction: "bureau_sentinels",
		level: 3,
		rank: "D",
		job: "Destroyer",
		hp: 34,
		ac: 16,
		description:
			"A heavy-weapons corporal who holds the line at thresholds and never quite stands down on his off-hours.",
		personality:
			"Gruff, dependable, dryly funny, and haunted by the gates he could not hold.",
		motivation:
			"Be the wall that lets lighter Ascendants do the clever work and walk away.",
		backstory:
			"Vance has stood more cordons than he can count and started taking private guard work to feel useful between them.",
		keyAbilities: ["Suppressing Fire", "Hold the Line", "Heavy Ordnance"],
		recruitCondition:
			"Hire him for a cordon job and prove your guild does not waste lives — he signs on as your front rank.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau threshold cordon",
		questHook:
			"Vance keeps getting redeployed away from one specific gate the night before every breach.",
		maxLevel: 9,
		hpPerLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-004",
		name: "Signal-Officer Priya Nair",
		title: "Bureau Comms Technician",
		faction: "bureau_sentinels",
		level: 2,
		kind: "mundane",
		job: "Comms Officer",
		hp: 12,
		ac: 11,
		description:
			"A calm comms tech who keeps an entire cordon's AFA traffic untangled with two screens and steady hands.",
		personality:
			"Soothing on the channel, sharp off it, and quietly the first to know when something is wrong.",
		motivation:
			"Keep every field team's lifeline open so no one dies inside a dead signal.",
		backstory:
			"Priya talked a stranded team home through a six-hour blackout and has never forgotten the silences in between.",
		keyAbilities: ["Signal Discipline", "AFA Relay", "Field Coordination"],
		recruitCondition:
			"Let her run comms for one of your operations and she relays for your guild from then on.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau relay station",
		questHook:
			"Priya is receiving acknowledgements from a call sign the Bureau retired two years ago.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-bfr-005",
		name: "Orderly Bautista",
		title: "Bureau Field Medic",
		faction: "bureau_sentinels",
		level: 2,
		kind: "mundane",
		job: "Field Medic",
		hp: 14,
		ac: 12,
		description:
			"A no-nonsense triage orderly who treats Essence burns and broken nerves with the same brisk kindness.",
		personality:
			"Warm under pressure, exhausted otherwise, and incapable of walking past someone bleeding.",
		motivation:
			"Patch enough people that the casualty record stops being the longest file at the cordon.",
		backstory:
			"Bautista trained as a civilian paramedic and never left after the first Rift their hospital lost.",
		keyAbilities: ["Field Triage", "Essence-Burn Care", "Stabilize"],
		recruitCondition:
			"Bring them wounded who would have died with anyone slower and they enlist as your guild's medic.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau cordon, casualty tent",
		questHook:
			"Bautista's last three patients all whispered the same name before they stabilized.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-bfr-006",
		name: "Supply Aide Tran",
		title: "Cordon Quartermaster's Aide",
		faction: "bureau_sentinels",
		level: 1,
		kind: "mundane",
		job: "Logistics Aide",
		hp: 9,
		ac: 11,
		description:
			"A meticulous supply aide who can find the one crate that matters in a warehouse of identical crates.",
		personality:
			"Organized, anxious, generous off the books, and quietly proud of a tidy shelf.",
		motivation:
			"Keep the field teams stocked so panic never has an excuse to set in.",
		backstory:
			"Tran requisitioned the gear that saved a stranded squad and has been hoarding spares for emergencies ever since.",
		keyAbilities: ["Inventory Mastery", "Requisition", "Quick Resupply"],
		recruitCondition:
			"Trust their packing list once and they keep your guild's gear stocked and your manifests honest.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau cordon, supply depot",
		questHook:
			"Tran's depot keeps logging outgoing supplies signed for by personnel who are not on any roster.",
		maxLevel: 3,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-bfr-007",
		name: "Scout Halvard",
		title: "Bureau Threshold Scout",
		faction: "bureau_sentinels",
		level: 3,
		rank: "E",
		job: "Stalker",
		hp: 26,
		ac: 15,
		description:
			"A quiet pathfinder who maps the first hundred metres of a new gate so the heavier teams do not walk in blind.",
		personality:
			"Soft-spoken, patient, fatalistic, and most comfortable a step ahead of everyone else.",
		motivation:
			"Walk the dangerous edge first so the people behind him do not have to.",
		backstory:
			"Halvard scouts because he survived the team that did not, and refuses to let that happen to anyone he leads.",
		keyAbilities: ["Threshold Recon", "Silent Tracking", "Hazard Sense"],
		recruitCondition:
			"Follow his read of a gate and live, and he scouts every approach your guild ever runs.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau forward staging, new thresholds",
		questHook:
			"Halvard mapped a gate's entry corridor twice and got two completely different maps.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-bfr-008",
		name: "Engineer Mateo Cruz",
		title: "Bureau Containment Engineer",
		faction: "bureau_sentinels",
		level: 4,
		rank: "D",
		job: "Technomancer",
		hp: 32,
		ac: 14,
		description:
			"A field engineer who rigs ward-pylons and containment fields out of half-broken Bureau surplus.",
		personality:
			"Inventive, irritable about budgets, loyal to his tools, and secretly a romantic about good machines.",
		motivation:
			"Build containment that holds so the next breach is a report, not a funeral.",
		backstory:
			"Mateo kept a failing containment field alive with his bare hands and a multitool and has the scars to prove it.",
		keyAbilities: ["Ward-Pylon Rigging", "Containment Fields", "Field Repair"],
		recruitCondition:
			"Fund his containment kit properly once and he engineers for your guild instead of begging Bureau procurement.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau containment annex",
		questHook:
			"Mateo's last containment field logged a breach it successfully held — from the inside.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-009",
		name: "Analyst Wen Li",
		title: "Bureau Rift Analyst",
		faction: "bureau_sentinels",
		level: 4,
		rank: "D",
		job: "Esper",
		hp: 28,
		ac: 13,
		description:
			"A pattern-reading analyst who feels a gate's mood before the instruments catch up.",
		personality:
			"Precise, sleepless, intuitive, and uneasy about how often she is right.",
		motivation:
			"Predict the next dangerous gate early enough that someone actually listens.",
		backstory:
			"Wen Li flagged three breaches before they happened and was reprimanded twice for 'unverifiable' warnings.",
		keyAbilities: ["Rift Reading", "Threat Forecasting", "Mind's Eye"],
		recruitCondition:
			"Act on one of her forecasts when the Bureau would not and she analyzes for your guild gratefully.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau analysis office",
		questHook:
			"Wen Li's models all converge on one unremarkable gate that the Bureau insists is empty.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-010",
		name: "Enforcer Boyd",
		title: "Bureau Cordon Enforcer",
		faction: "bureau_sentinels",
		level: 3,
		rank: "D",
		job: "Berserker",
		hp: 38,
		ac: 15,
		description:
			"A heavy-handed crowd enforcer who keeps panicking civilians behind the line when a gate goes loud.",
		personality:
			"Intimidating, surprisingly gentle with the frightened, and sick of being pointed at the wrong people.",
		motivation:
			"Stand between the crowd and the gate, and never the other way around.",
		backstory:
			"Boyd was ordered to clear a protest once and refused; the transfer to cordon duty was the punishment he wanted.",
		keyAbilities: ["Crowd Control", "Riot Wall", "Unyielding"],
		recruitCondition:
			"Give him a banner that points him at monsters instead of people and he enforces for your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau cordon, public line",
		questHook:
			"Boyd keeps being assigned to hold back crowds at gates where there are no crowds.",
		maxLevel: 9,
		hpPerLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-011",
		name: "Archivist Lund",
		title: "Bureau Casualty Archivist",
		faction: "bureau_sentinels",
		level: 1,
		kind: "mundane",
		job: "Archivist",
		hp: 8,
		ac: 10,
		description:
			"A soft-spoken records-keeper who maintains the casualty archive and reads it like a list of promises owed.",
		personality:
			"Gentle, exact, mournful, and quietly furious at every name filed away too easily.",
		motivation:
			"Make sure the dead are recorded truthfully, even when the truth is inconvenient.",
		backstory:
			"Lund found a casualty file altered to protect a guild's reputation and never trusted a clean record again.",
		keyAbilities: ["Records Mastery", "Cross-Referencing", "Discreet Inquiry"],
		recruitCondition:
			"Promise the dead in your service will be recorded honestly and Lund leaves the archive to keep your guild's history.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau records vault",
		questHook:
			"Lund found a casualty entry for an Ascendant who reported for duty this morning.",
		maxLevel: 3,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-bfr-012",
		name: "Handler Ferro",
		title: "Bureau Beast-Containment Handler",
		faction: "bureau_sentinels",
		level: 4,
		rank: "D",
		job: "Summoner",
		hp: 30,
		ac: 14,
		description:
			"A wary handler who tames and contains the lesser anomalies the Bureau prefers to study rather than kill.",
		personality:
			"Patient, unsentimental, secretly tender toward his charges, and tired of being told to put them down.",
		motivation:
			"Prove that not every anomaly is a thing to be exterminated on sight.",
		backstory:
			"Ferro raised a contained anomaly from a fragment and was ordered to destroy it; he requested reassignment instead.",
		keyAbilities: ["Beast Binding", "Anomaly Handling", "Calming Ward"],
		recruitCondition:
			"Spare one of his charges when the Bureau would not and he and his bonded anomaly join your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau containment kennels",
		questHook:
			"Ferro's newest charge keeps escaping its ward to sit, harmlessly, outside the Chairman's office.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-013",
		name: "Liaison Aoki",
		title: "Bureau Public-Relations Liaison",
		faction: "bureau_sentinels",
		level: 2,
		rank: "E",
		job: "Idol",
		hp: 18,
		ac: 12,
		description:
			"A camera-ready liaison who manages the public face of Bureau operations and the morale of the teams behind them.",
		personality:
			"Charming, calculating, warmer than the spin suggests, and weary of selling clean stories about messy nights.",
		motivation:
			"Tell the public a story true enough to keep their faith without burying the people who paid for it.",
		backstory:
			"Aoki spun a disaster into a triumph on live AFA and has been quietly atoning for the names she left out.",
		keyAbilities: ["Public Address", "Morale Boost", "Spin Control"],
		recruitCondition:
			"Give her a guild whose story does not need spinning and she becomes your voice to the world.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau press office",
		questHook:
			"Aoki's last broadcast was edited after airing to remove an Ascendant who is now missing.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-bfr-014",
		name: "Recovery Agent Cole",
		title: "Bureau Body-Recovery Specialist",
		faction: "bureau_sentinels",
		level: 4,
		rank: "D",
		job: "Revenant",
		hp: 34,
		ac: 14,
		description:
			"A grim specialist who walks back into cleared gates to bring out the fallen the strike teams left behind.",
		personality:
			"Quiet, unflinching, oddly comforting, and at peace with the dead in a way the living find unsettling.",
		motivation:
			"Make sure no Ascendant is left to become part of the thing that killed them.",
		backstory:
			"Cole started recovering bodies to find a friend's and never stopped, because someone has to.",
		keyAbilities: ["Death-Sense", "Grim Endurance", "Last-Rites Ward"],
		recruitCondition:
			"Honor your dead instead of writing them off and Cole walks the worst ground for your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau recovery detail",
		questHook:
			"Cole keeps recovering the same Ascendant's tags from three different gates.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-bfr-015",
		name: "Inspector Grey",
		title: "Bureau Internal-Affairs Inspector",
		faction: "bureau_sentinels",
		level: 5,
		rank: "C",
		job: "Assassin",
		hp: 36,
		ac: 16,
		description:
			"A soft-footed internal-affairs inspector who investigates the Bureau's own corruption from the inside.",
		personality:
			"Watchful, sardonic, principled beneath the cynicism, and trusted by no one with something to hide.",
		motivation:
			"Cut the rot out of the Bureau before it costs more lives than the anomalies do.",
		backstory:
			"Grey was a field killer reassigned to internal affairs after refusing one too many convenient orders.",
		keyAbilities: ["Covert Investigation", "Shadowstep", "Pressure Point"],
		recruitCondition:
			"Help Grey expose a buried Bureau crime and the inspector resigns to keep your guild honest from within.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau internal-affairs office",
		questHook:
			"Grey's current case file points at the very superior who assigned it.",
		maxLevel: 10,
	}),
];

// ============================================================================
// INDEPENDENT ASCENDANTS — freelancers of every archetype (ranks E–A)
// ============================================================================
const independentAscendants: SandboxNPC[] = [
	makeNPC({
		id: "npc-ia-001",
		name: "Castell the Tracker",
		title: "Freelance Bounty Hunter",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Stalker",
		hp: 44,
		ac: 16,
		description:
			"A weathered bounty hunter who tracks rogue Ascendants and worse for whoever can meet the price.",
		personality:
			"Laconic, fair-minded, relentless, and privately choosier about jobs than he lets on.",
		motivation:
			"Take the contracts no one else will and bring the target back breathing when he can.",
		backstory:
			"Castell hunts the ones the Bureau marks as too dangerous and the guilds mark as too unprofitable.",
		keyAbilities: ["Manhunt", "Trap-Sense", "Bola Shot"],
		recruitCondition:
			"Meet his fee on a hard mark and prove you do not waste the recovered, and he hunts under your banner.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Wherever the bounty board points",
		questHook:
			"Castell's newest bounty is for an Ascendant the Bureau insists died last year.",
		maxLevel: 10,
	}),
	makeNPC({
		id: "npc-ia-002",
		name: "Deepa the Diver",
		title: "Relic-Diver",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Esper",
		hp: 30,
		ac: 13,
		description:
			"A relic-diver who reads dormant artifacts by touch and knows which ones are worth losing a hand for.",
		personality:
			"Daring, superstitious, generous with knowledge, and addicted to the moment before a relic wakes.",
		motivation:
			"Recover the relics the big guilds write off as too risky to retrieve.",
		backstory:
			"Deepa lost two fingers to a hostile relic and has been chasing the high of the next one ever since.",
		keyAbilities: ["Relic Attunement", "Hazard Diving", "Psychometry"],
		recruitCondition:
			"Fund one deep dive and split the find fairly and she dives for your guild for good.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Deep-salvage sites and sealed vaults",
		questHook:
			"Deepa surfaced from her last dive holding a relic she has no memory of touching.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-003",
		name: "Scholar Okonkwo",
		title: "Rogue Rift-Scholar",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Mage",
		hp: 32,
		ac: 13,
		description:
			"A disgraced academic who studies Rift metaphysics the licensed institutes are too cautious to publish.",
		personality:
			"Brilliant, prickly, principled, and incapable of leaving a dangerous question unasked.",
		motivation:
			"Publish the truth about the Rifts even if every institution would rather he did not.",
		backstory:
			"Okonkwo was expelled for an experiment that worked, which was somehow worse than if it had failed.",
		keyAbilities: ["Arcane Theory", "Ward Weaving", "Essence Analysis"],
		recruitCondition:
			"Let him pursue one forbidden line of research safely and his scholarship is yours.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "A rented lab full of unlicensed notes",
		questHook:
			"Okonkwo's latest proof predicts a gate that does not exist yet at a precise address.",
		maxLevel: 10,
	}),
	makeNPC({
		id: "npc-ia-004",
		name: "Physician Marlowe",
		title: "Wandering Field Doctor",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Herald",
		hp: 30,
		ac: 13,
		description:
			"A traveling doctor-Ascendant who treats the Rift-wounded that licensed clinics turn away.",
		personality:
			"Compassionate, blunt, tireless, and openly contemptuous of medicine that checks a license first.",
		motivation:
			"Reach the wounded the system leaves behind before the rot does.",
		backstory:
			"Marlowe gave up a clinic practice after being told which patients were worth the supplies.",
		keyAbilities: ["Healing Word", "Rift-Rot Cure", "Triage Sense"],
		recruitCondition:
			"Carry her to the patients no one else will treat and she travels with your guild as its healer.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The roads between underserved settlements",
		questHook:
			"Marlowe's patients keep recovering from wounds that should have killed them, and she does not know why.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-005",
		name: "Beastmaster Yara",
		title: "Anomaly-Tamer",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Summoner",
		hp: 38,
		ac: 14,
		description:
			"A wild-haired tamer who walks beside a bonded anomaly the Bureau would order destroyed on sight.",
		personality:
			"Fierce, loyal, distrustful of institutions, and softer with beasts than with people.",
		motivation:
			"Protect the bonded anomalies that the law calls monsters and she calls family.",
		backstory:
			"Yara survived a Rift as a child only because an anomaly chose not to kill her, and she has never forgotten the debt.",
		keyAbilities: ["Beast Bond", "Pack Command", "Feral Empathy"],
		recruitCondition:
			"Defend her bonded anomaly from a cull order and she and the beast fight for your guild forever.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The wild edges where anomalies are left alone",
		questHook:
			"Yara's bonded anomaly has begun leading her toward a gate she swore never to enter again.",
		maxLevel: 10,
	}),
	makeNPC({
		id: "npc-ia-006",
		name: "Delver Brand",
		title: "Professional Dungeon-Delver",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Destroyer",
		hp: 50,
		ac: 16,
		description:
			"A scarred solo delver who clears low and mid-rank gates for the salvage no guild will share with him.",
		personality:
			"Brash, dependable, scarred into honesty, and secretly lonely after years of solo runs.",
		motivation:
			"Clear one more gate, bank one more haul, and maybe stop running alone someday.",
		backstory:
			"Brand was cut from a premier guild's strike team for being expendable and has out-cleared most of them since.",
		keyAbilities: ["Gate Clearing", "Cleaving Blow", "Salvage Instinct"],
		recruitCondition:
			"Split a clear fairly and treat him as more than a hired blade and he joins your guild for keeps.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Any open low-rank gate with a salvage tag",
		questHook:
			"Brand keeps finding his old guild's markers in gates they never registered clearing.",
		maxLevel: 10,
		hpPerLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-007",
		name: "Sloane Whisperblade",
		title: "Freelance Blade-for-Hire",
		faction: "independent",
		level: 6,
		rank: "B",
		job: "Assassin",
		hp: 48,
		ac: 17,
		description:
			"A high-rank contract killer turned selective who now only takes the marks she can justify to herself.",
		personality:
			"Cool, exact, mordantly funny, and quietly desperate to be more than what she was made into.",
		motivation: "Use a lethal trade for ends she can live with, for once.",
		backstory:
			"Sloane was raised by a guild that sold her skills to the highest bidder until she bought her own contract out.",
		keyAbilities: ["Silent Kill", "Shadow Cloak", "Vital Strike"],
		recruitCondition:
			"Give her targets she can be proud of striking and her blade is yours.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Wherever a discreet professional is needed",
		questHook:
			"Sloane's last contract named her own former handler as the target.",
		maxLevel: 11,
	}),
	makeNPC({
		id: "npc-ia-008",
		name: "Iron-Maw Tully",
		title: "Pit-Fighter",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Berserker",
		hp: 46,
		ac: 14,
		description:
			"A grinning pit-fighter who took her brawling Ascendant talent from the underground rings to open gate work.",
		personality:
			"Boisterous, big-hearted, reckless, and fiercely protective of anyone smaller than her.",
		motivation:
			"Hit hard, get paid, and never throw a fight again after the one she was forced to.",
		backstory:
			"Tully threw a rigged match to save a friend, then broke the ring that owned them both.",
		keyAbilities: ["Reckless Assault", "Iron Hide", "Crowd Roar"],
		recruitCondition:
			"Back her in one honest fight and she swings for your guild with a grin.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The underground fighting circuits",
		questHook:
			"Tully's old ring is offering an impossible purse for one last 'guaranteed' match.",
		maxLevel: 9,
		hpPerLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-009",
		name: "Fixer Madsen",
		title: "Independent Contract Fixer",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Contractor",
		hp: 34,
		ac: 14,
		description:
			"A smooth fixer who brokers gear, intel, and quiet favors between guilds, the Bureau, and the black market.",
		personality:
			"Affable, calculating, surprisingly loyal once bought, and allergic to dead ends.",
		motivation: "Be the person everyone owes and no one can do without.",
		backstory:
			"Madsen built a network out of small honest deals and one big one he is still trying to make right.",
		keyAbilities: ["Black-Market Access", "Negotiation", "Intel Brokering"],
		recruitCondition:
			"Make good on a deal he expected you to break and his whole network becomes your guild's.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Back rooms and neutral-ground bars",
		questHook:
			"Madsen is being squeezed by a creditor who wants a favor he swore he would never broker.",
		maxLevel: 10,
	}),
	makeNPC({
		id: "npc-ia-010",
		name: "Juno Starfall",
		title: "Streamer-Hunter",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Idol",
		hp: 30,
		ac: 13,
		description:
			"A charismatic broadcasting Ascendant who livestreams her gate clears and funds her work on her audience's roar.",
		personality:
			"Radiant on camera, sharper off it, generous, and tired of performing courage she does not always feel.",
		motivation:
			"Show the world that Ascendant work is real labor, not a highlight reel.",
		backstory:
			"Juno went independent after a sponsor guild demanded she fake a rescue for the cameras.",
		keyAbilities: ["Inspiring Anthem", "Crowd-Funded Boon", "Dazzling Light"],
		recruitCondition:
			"Let her tell your guild's real story instead of a marketed one and she broadcasts for your banner.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Wherever the signal reaches an audience",
		questHook:
			"Juno's stream picked up a viewer count from a region with no living population.",
		maxLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-011",
		name: "Gravewalker Esca",
		title: "Wandering Revenant",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Revenant",
		hp: 42,
		ac: 14,
		description:
			"A twice-dead Ascendant who walks between settlements laying the restless dead of failed clears to rest.",
		personality:
			"Solemn, gentle, weary of his own persistence, and kinder to the dead than the living usually are to him.",
		motivation:
			"Quiet the dead the guilds leave behind so they do not become something worse.",
		backstory:
			"Esca died in a gate, came back wrong, and decided to spend his borrowed time on the unburied.",
		keyAbilities: ["Lay to Rest", "Undying Resolve", "Grave-Sight"],
		recruitCondition:
			"Help him lay one impossible spirit to rest and he walks the dark roads for your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The roads where the unburied gather",
		questHook:
			"Esca keeps meeting a spirit that wears his own face and refuses to be laid to rest.",
		maxLevel: 10,
	}),
	makeNPC({
		id: "npc-ia-012",
		name: "Drone-Pilot Renn",
		title: "Salvage Drone Operator",
		faction: "independent",
		level: 3,
		rank: "E",
		job: "Technomancer",
		hp: 24,
		ac: 13,
		description:
			"A young drone-pilot who scouts and salvages gates by remote so the dangerous part happens to a machine first.",
		personality:
			"Quick, mouthy, inventive, and braver behind a screen than in front of a gate.",
		motivation:
			"Prove that smart machines can do the dying so people do not have to.",
		backstory:
			"Renn built her first scout drone from gate salvage after losing a sibling to a job a drone could have scouted.",
		keyAbilities: ["Drone Piloting", "Remote Salvage", "Signal Hacking"],
		recruitCondition:
			"Fund one good drone and trust her eyes-in-the-sky and she pilots for your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "A van full of screens near the latest gate",
		questHook:
			"Renn's drone keeps transmitting footage of a corridor that is not in any gate she has flown.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-ia-013",
		name: "Ser Davos the Errant",
		title: "Wandering Holy Knight",
		faction: "independent",
		level: 6,
		rank: "B",
		job: "Holy Knight",
		hp: 58,
		ac: 18,
		description:
			"A high-rank knight-errant who left a premier guild to defend the settlements the big banners ignore.",
		personality:
			"Honorable, humble, immovable, and gently disappointed in institutions that forgot their purpose.",
		motivation:
			"Hold a shield over the people no profitable guild will protect.",
		backstory:
			"Davos walked away from a premier guild the day it chose a sponsor's tower over a drowning ward.",
		keyAbilities: ["Aegis of Light", "Smite Anomaly", "Oathkeeper's Stand"],
		recruitCondition:
			"Prove your guild protects people over profit and his oath — and his blade — are yours.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The undefended settlements on the frontier",
		questHook:
			"Davos's old guild has put a quiet bounty on the knight who made them look heartless.",
		maxLevel: 11,
		hpPerLevel: 9,
	}),
	makeNPC({
		id: "npc-ia-014",
		name: "Street-Preacher Job",
		title: "Corner Herald",
		faction: "independent",
		level: 2,
		rank: "E",
		job: "Herald",
		hp: 18,
		ac: 12,
		description:
			"A ragged corner-preacher whose words genuinely steady the frightened in a Rift Age that gives them little else.",
		personality:
			"Warm, rambling, stubbornly hopeful, and braver than his threadbare coat suggests.",
		motivation:
			"Give ordinary people a reason to keep their feet under them when the sirens sound.",
		backstory:
			"Job awakened late and weak, and decided his small gift was best spent holding crowds together at the worst moments.",
		keyAbilities: ["Words of Comfort", "Rallying Cry", "Steady the Crowd"],
		recruitCondition:
			"Take his words seriously instead of moving him along and he marches with your guild as its heart.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The busiest frightened street corner",
		questHook:
			"Job's sermons have started coming true the morning after he preaches them.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-ia-015",
		name: "Vael, the Quiet Star",
		title: "Reclusive A-Rank Ascendant",
		faction: "independent",
		level: 8,
		rank: "A",
		job: "Esper",
		hp: 66,
		ac: 17,
		description:
			"A near-legendary A-rank loner who clears catastrophic gates alone and refuses every guild and Bureau offer.",
		personality:
			"Reserved, exacting, weary of fame, and watching for the one cause worth ending his solitude.",
		motivation:
			"Stay free of the politics that ruin great power until something truly matters.",
		backstory:
			"Vael saw what a National-Level reputation did to people he admired and chose obscurity over the same fate.",
		keyAbilities: ["Mind Crush", "Telekinetic Storm", "Foresight"],
		recruitCondition:
			"Earn his rare respect with a cause worth his power — not his fame — and the Quiet Star fights for your guild.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Wherever the worst gates open, alone",
		questHook:
			"Vael has started receiving anonymous tips that send him to gates just before they turn catastrophic.",
		maxLevel: 12,
		hpPerLevel: 9,
	}),
];

// ============================================================================
// EXPORTS
// ============================================================================

/** The 36-NPC field roster (Glassline crew + Bureau lower-ranks + independents). */
export const fieldRosterNPCs: SandboxNPC[] = [
	...glasslineCrew,
	...bureauFieldRoster,
	...independentAscendants,
];

/**
 * The full guild recruitment pool: every unaffiliated, recruitable Run Silent
 * native PLUS the field roster. De-duplicated by id (the two sources never
 * collide today, but the guard keeps the pool safe if an id is ever reused).
 */
export const getRecruitablePool = (): SandboxNPC[] => {
	const seen = new Set<string>();
	const pool: SandboxNPC[] = [];
	for (const npc of [
		...getUnaffiliatedNPCs(),
		...fieldRosterNPCs.filter(
			(n) => n.isRecruitable && n.guildAffiliation === null,
		),
	]) {
		if (seen.has(npc.id)) continue;
		seen.add(npc.id);
		pool.push(npc);
	}
	return pool;
};
