/**
 * PREBUILT GATE CONTRACTS — global quest library available to ALL users.
 *
 * Diegetically these are the Bureau's standing gate-contract templates: a vast,
 * varied catalog any guild may accept regardless of campaign. (Warden-authored
 * quests remain campaign-specific and live in the session/campaign quest system;
 * these prebuilt contracts are the canon, all-users source the guild board pulls
 * from.) Built in full — title, rank, type, summary, objectives, reward notes.
 *
 * source_book: "Rift Ascendant Canon".
 */

import type { GuildQuestRank } from "@/lib/guildQuests";

export type QuestContractType =
	| "strike" // clear monsters / kill a boss / seal a Rift
	| "mining" // essence & mana-stone recovery
	| "extraction" // pull out a stranded team or civilians
	| "investigation" // determine cause / origin
	| "containment" // Rift Break / domain response
	| "recovery" // retrieve a relic or lost asset
	| "hunt" // eliminate a named anomaly or rogue
	| "recon" // survey a new rift / threshold
	| "escort" // protect a VIP or convoy
	| "purge"; // cleanse corruption / sever an anchor

export interface QuestContract {
	id: string;
	title: string;
	rank: GuildQuestRank;
	type: QuestContractType;
	summary: string;
	objectives: string[];
	rewardNotes: string;
	/**
	 * Regent-tagged quest. Completing ANY quest flagged here lets a Warden grant
	 * the character one Regent-unlock opportunity (the player then chooses which
	 * Regent from three stat-ranked candidates). The tag is generic — it is never
	 * tied to a specific Regent. See `useRegentUnlockGrants` / `RegentUnlocksPanel`.
	 */
	grantsRegentUnlock?: boolean;
}

export const PREBUILT_QUEST_CONTRACTS: QuestContract[] = [
	// ── E-rank: low-threat, training-wheel contracts ──────────────────────────
	{
		id: "qc-e-husks",
		title: "Husk Clearance: Lantern Ward",
		rank: "E",
		type: "strike",
		summary:
			"A shallow rift has spilled drifting husks into the Lantern Ward's outer streets. Disperse them before they thicken into a swarm.",
		objectives: [
			"Sweep the three flooded alleys off Lantern Square",
			"Destroy the husk-anchor pulsing in the old cistern",
			"Confirm no residents were taken before withdrawal",
		],
		rewardNotes: "Bureau credits, minor essence salvage, ward goodwill.",
	},
	{
		id: "qc-e-tithe",
		title: "Mana Tithe: Stillwater Vein",
		rank: "E",
		type: "mining",
		summary:
			"A thin mana vein has surfaced under Stillwater. The Bureau wants it tapped and capped before freelancers strip it raw.",
		objectives: [
			"Map the vein's three surface bleeds",
			"Extract the seed crystals without cracking the matrix",
			"Cap the vein with a Bureau regulator",
		],
		rewardNotes: "Mana credits per crystal recovered; survey bonus.",
	},
	{
		id: "qc-e-strays",
		title: "Strays of the Hollow Way",
		rank: "E",
		type: "extraction",
		summary:
			"Two awakened scavengers wandered into a low rift chasing salvage and never came back out. Pull them before the Rift sours.",
		objectives: [
			"Locate the scavengers by their AFA pings",
			"Stabilize the wounded before the timer runs",
			"Exit ahead of the threshold's evening flux",
		],
		rewardNotes: "Flat extraction fee plus a cut of recovered salvage.",
	},
	{
		id: "qc-e-pinglost",
		title: "The Beacon That Moves",
		rank: "E",
		type: "investigation",
		summary:
			"A recovery beacon keeps pinging from a different spot each hour. Find out whether it's a glitch, a trap, or something carrying it.",
		objectives: [
			"Triangulate the beacon across three pings",
			"Determine why its position drifts",
			"Recover or destroy it to stop the broadcast",
		],
		rewardNotes: "Investigation stipend; a minor relic clue.",
	},
	{
		id: "qc-e-coldcellar",
		title: "Cold Cellar Vermin",
		rank: "E",
		type: "purge",
		summary:
			"Rift-mold has crept into a granary's cold cellar, warping the rats into something that bites back. Burn it out cleanly.",
		objectives: [
			"Seal the cellar to stop the spread",
			"Cull the warped vermin nest",
			"Scour the mold bloom from the foundation",
		],
		rewardNotes: "Civic contract pay; alchemical reagents from the bloom.",
	},
	{
		id: "qc-e-firstgate",
		title: "First Rift, First Seal",
		rank: "E",
		type: "recon",
		summary:
			"A brand-new threshold has opened on farmland east of the relay. Scout it, rank it, and report before anyone steps through blind.",
		objectives: [
			"Survey the threshold's perimeter and pulse rate",
			"Estimate the Rift's rank and core depth",
			"Plant Bureau markers and file the dossier",
		],
		rewardNotes: "Recon fee; first-survey naming credit.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-e-quietnight",
		title: "A Quiet Night's Watch",
		rank: "E",
		type: "escort",
		summary:
			"A relief convoy must cross a stretch of road where small rifts flicker after dark. Keep it whole until dawn.",
		objectives: [
			"Hold the convoy's flanks through the flicker-zone",
			"Wave off any drifters drawn to the lanterns",
			"Deliver every wagon to the waystation",
		],
		rewardNotes: "Escort pay scaled to cargo delivered intact.",
	},
	{
		id: "qc-e-saltlines",
		title: "Salt the Lines",
		rank: "E",
		type: "containment",
		summary:
			"A hairline rift is weeping corruption into a village well. Contain it before the failure widens into a true Rift.",
		objectives: [
			"Lay containment salt around the weep",
			"Drain and purge the tainted well",
			"Set a watch-ward and brief the locals",
		],
		rewardNotes: "Containment bounty; standing with the village.",
	},

	// ── D-rank ────────────────────────────────────────────────────────────────
	{
		id: "qc-d-packlords",
		title: "Pack-Lords of the Underpass",
		rank: "D",
		type: "strike",
		summary:
			"A hound-pack has denned in a collapsed underpass and started raiding the night markets. Break the pack and its alpha.",
		objectives: [
			"Bait the pack into the open underpass mouth",
			"Down the two flanking pack-lords first",
			"Kill the alpha before it calls a second litter",
		],
		rewardNotes: "Bounty per pack-lord; alpha hide and fangs.",
	},
	{
		id: "qc-d-deepvein",
		title: "Deep Vein Contract",
		rank: "D",
		type: "mining",
		summary:
			"A rich essence vein runs beneath an unstable Rift. Mining squads need cover while they cut, and a fast exit if it turns.",
		objectives: [
			"Hold the cut-site against wandering spawns",
			"Recover the high-grade essence nodes",
			"Collapse the shaft behind you on withdrawal",
		],
		rewardNotes: "Large essence yield split; hazard bonus.",
	},
	{
		id: "qc-d-serumroad",
		title: "The Serum Road",
		rank: "D",
		type: "escort",
		summary:
			"A shipment of stabilizing serum must reach a quarantined ward before its awakened patients turn. The road is not clear.",
		objectives: [
			"Clear the ambush points along the serum road",
			"Keep the cold-cases from cracking in transit",
			"Reach the ward before the patients destabilize",
		],
		rewardNotes: "Medical-guild retainer; ward alliance.",
	},
	{
		id: "qc-d-falsewarden",
		title: "The False Warden",
		rank: "D",
		type: "investigation",
		summary:
			"Someone is issuing forged Bureau contracts and pocketing the deposits. Trace the forger before more guilds are sent to die.",
		objectives: [
			"Compare the forged seals to genuine writs",
			"Follow the deposit trail to its drop",
			"Detain the forger or recover proof of identity",
		],
		rewardNotes: "Bounty; Bureau commendation.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-d-sunkenrelic",
		title: "Sunken Relic of the Weir",
		rank: "D",
		type: "recovery",
		summary:
			"A pre-rift relic lies in a flooded gate-chamber that floods deeper each tide. Recover it before the water claims it for good.",
		objectives: [
			"Dive the flooded antechamber on the low tide",
			"Disarm the chamber's pressure-ward",
			"Surface with the relic before the tide turns",
		],
		rewardNotes: "Relic finder's fee; appraisal rights.",
	},
	{
		id: "qc-d-emberhunt",
		title: "Ember the Stray",
		rank: "D",
		type: "hunt",
		summary:
			"A fire-touched anomaly the locals call Ember has been torching outbuildings along the ridge. End it before the season's dry.",
		objectives: [
			"Track Ember to its smoldering lair",
			"Cut off its retreat into the dry brush",
			"Put it down without setting the ridge alight",
		],
		rewardNotes: "Hunt bounty; fire-essence core.",
	},
	{
		id: "qc-d-greyrecon",
		title: "Grey Threshold Recon",
		rank: "D",
		type: "recon",
		summary:
			"A grey, silent threshold refuses to register on standard instruments. Get close enough to learn why — and get back out.",
		objectives: [
			"Approach the grey threshold without triggering it",
			"Sample its null-field with shielded gear",
			"Withdraw and file an anomalous-gate report",
		],
		rewardNotes: "Hazard recon premium; research credit.",
	},
	{
		id: "qc-d-breachdrill",
		title: "Breach Drill: Market Quarter",
		rank: "D",
		type: "containment",
		summary:
			"Pressure is building under the Market Quarter. The Bureau wants a guild on station to contain the breach the moment it opens.",
		objectives: [
			"Pre-position containment lines at the fault",
			"Hold the breach mouth when it opens",
			"Seal it before spillover reaches the stalls",
		],
		rewardNotes: "Standby retainer plus breach-seal bonus.",
	},

	// ── C-rank ────────────────────────────────────────────────────────────────
	{
		id: "qc-c-bonechoir",
		title: "Silence the Bone Choir",
		rank: "C",
		type: "strike",
		summary:
			"A C-rank Rift has grown a 'choir' of resonant undead whose song lures the unawakened inside. Break the choir and seal the Rift.",
		objectives: [
			"Push to the resonance chamber through the nave",
			"Shatter the three choir-conductors in sequence",
			"Seal the Rift before the song reforms",
		],
		rewardNotes: "Rift-clear bounty; resonance cores.",
	},
	{
		id: "qc-c-motherlode",
		title: "Motherlode Authorization",
		rank: "C",
		type: "mining",
		summary:
			"A crystal motherlode sits behind a mid-rank guardian. Mining can't touch it until a strike squad clears the vault.",
		objectives: [
			"Defeat the vault guardian",
			"Stabilize the chamber for the mining crew",
			"Escort the loaded crew back to the threshold",
		],
		rewardNotes: "Crystal-credit windfall; mining-guild favor.",
	},
	{
		id: "qc-c-lostteam",
		title: "Strike Team Seven",
		rank: "C",
		type: "extraction",
		summary:
			"An entire strike team went dark inside a shifting Rift. Central will mark them expendable at dawn unless someone brings answers.",
		objectives: [
			"Enter the shifting Rift and follow Seven's trail",
			"Recover survivors or confirm their fate",
			"Bring back proof before Central's deadline",
		],
		rewardNotes: "Recovery commission; Commander Park's gratitude.",
	},
	{
		id: "qc-c-twinpings",
		title: "Two Cores, One Rift",
		rank: "C",
		type: "investigation",
		summary:
			"Instruments insist this Rift has two cores — which should be impossible. Find out what's really down there before clearing it.",
		objectives: [
			"Confirm or refute the dual-core reading",
			"Identify the source of the second signature",
			"Recommend clear, contain, or evacuate",
		],
		rewardNotes: "Research bounty; anomalous-gate dossier credit.",
	},
	{
		id: "qc-c-warden-relic",
		title: "The Warden's Relic",
		rank: "C",
		type: "recovery",
		summary:
			"A dead warden's signature relic is still broadcasting from inside the Rift that killed them. Recover it before a rival guild does.",
		objectives: [
			"Reach the relic ahead of the rival crew",
			"Break the relic's grief-ward without triggering it",
			"Extract under contested conditions",
		],
		rewardNotes: "Relic bounty; rival-guild standing shift.",
	},
	{
		id: "qc-c-thresher",
		title: "Hunt: The Thresher",
		rank: "C",
		type: "hunt",
		summary:
			"A bladed anomaly nicknamed the Thresher has cut down three solo ascendants on the south road. Coordinate and bring it down.",
		objectives: [
			"Bait the Thresher into a chokepoint",
			"Sever its blade-limbs before it cycles",
			"Recover the cores for the victims' guilds",
		],
		rewardNotes: "Standing hunt bounty; blade-core salvage.",
	},
	{
		id: "qc-c-domainwatch",
		title: "Domain Watch: Greywater",
		rank: "C",
		type: "containment",
		summary:
			"A Domain is forming around an uncleared rift at Greywater, its failure-zone expanding daily. Hold the line and find the anchor.",
		objectives: [
			"Map the Domain's current boundary",
			"Hold back the expansion at the river line",
			"Locate the Domain's anchor for a clear team",
		],
		rewardNotes: "Domain-watch retainer; anchor-find bonus.",
		grantsRegentUnlock: true,
	},

	// ── B-rank ────────────────────────────────────────────────────────────────
	{
		id: "qc-b-anchorbreak",
		title: "Break the Greywater Anchor",
		rank: "B",
		type: "purge",
		summary:
			"The Greywater Domain's anchor has been found. Cut into the failure-state's heart and sever it to collapse the Domain.",
		objectives: [
			"Fight to the anchor through the Domain's interior",
			"Survive the anchor's defense surge",
			"Sever the anchor and ride out the collapse",
		],
		rewardNotes: "Major clear bounty; Bureau rank-evaluation credit.",
	},
	{
		id: "qc-b-vaultcrack",
		title: "Crack the Sealed Vault",
		rank: "B",
		type: "recovery",
		summary:
			"A sealed pre-rift vault has surfaced inside a B-rank Rift, packed with relics — and whatever was sealed in with them.",
		objectives: [
			"Clear the approach to the vault doors",
			"Solve or force the vault's three locks",
			"Subdue the vault's keeper and extract the cache",
		],
		rewardNotes: "Vault loot split; appraisal and first-pick rights.",
	},
	{
		id: "qc-b-rogueascendant",
		title: "The Rogue of Ashford",
		rank: "B",
		type: "hunt",
		summary:
			"A licensed ascendant has gone rogue, using gate-spawn to cover their thefts. Bring them in — alive if the contract allows.",
		objectives: [
			"Cut the rogue off from their spawn screen",
			"Neutralize their powered escape",
			"Detain or eliminate per the issued writ",
		],
		rewardNotes: "Bounty scaled to live capture; license revocation credit.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-b-deepmine",
		title: "Deep-Core Mining Op",
		rank: "B",
		type: "mining",
		summary:
			"A B-rank Rift's deep core is dense with high-grade essence, but the descent is guarded the whole way down.",
		objectives: [
			"Fight down through three guarded descent stages",
			"Hold the core chamber for the mining crew",
			"Withdraw the haul before the core regenerates",
		],
		rewardNotes: "High-grade essence shares; depth hazard pay.",
	},
	{
		id: "qc-b-evacuation",
		title: "Evacuate the Sunken District",
		rank: "B",
		type: "extraction",
		summary:
			"A Rift erupted under a residential district. Get the trapped residents out through a collapsing, spawn-filled grid.",
		objectives: [
			"Open a safe corridor through the spawn",
			"Move residents in waves to the muster point",
			"Hold the rear as the district floods with spawn",
		],
		rewardNotes: "Civic hero bounty, paid by the district council.",
	},
	{
		id: "qc-b-breakboss",
		title: "Rift Break: The Gorewright",
		rank: "B",
		type: "strike",
		summary:
			"A Rift is hours from breaking and disgorging its boss, the Gorewright, into the city. Go in and kill it before it comes out.",
		objectives: [
			"Race to the boss arena before the break",
			"Down the Gorewright's two heralds",
			"Kill the Gorewright and seal the Rift",
		],
		rewardNotes: "Break-prevention bounty; boss-core trophy.",
	},
	{
		id: "qc-b-nullsurvey",
		title: "Survey the Null Expanse",
		rank: "B",
		type: "recon",
		summary:
			"A vast null-field Rift swallows instruments and ascendant power alike. Map it the hard way and learn its rules.",
		objectives: [
			"Chart the expanse without powered navigation",
			"Identify where power does and doesn't function",
			"Recover a sample of the null-medium",
		],
		rewardNotes: "Research premium; anomalous-physics credit.",
	},

	// ── A-rank ────────────────────────────────────────────────────────────────
	{
		id: "qc-a-titanfall",
		title: "Titanfall at Iron Reach",
		rank: "A",
		type: "strike",
		summary:
			"An A-rank Rift has produced a titan-class spawn that no single guild has survived. Coordinate a full strike and bring it down.",
		objectives: [
			"Stagger the titan with a coordinated opening",
			"Break its three armor anchors under fire",
			"Land the killing blow before its enrage",
		],
		rewardNotes: "Elite clear bounty; titan-core and S-rank materials.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-a-warden-down",
		title: "Warden Down",
		rank: "A",
		type: "extraction",
		summary:
			"A national-grade warden fell holding a collapsing A-rank Rift. Get them and their team out before the Rift finishes failing.",
		objectives: [
			"Punch through to the warden's last position",
			"Stabilize the warden for transport",
			"Escape the collapse with the whole team alive",
		],
		rewardNotes: "National commendation; warden's personal favor.",
	},
	{
		id: "qc-a-anchorhydra",
		title: "The Hydra Anchor",
		rank: "A",
		type: "purge",
		summary:
			"An A-rank Domain regrows its anchor faster than crews can cut it. Find why, and sever every head at once.",
		objectives: [
			"Locate all three regenerating anchor-nodes",
			"Coordinate simultaneous severance",
			"Collapse the Domain before regrowth begins",
		],
		rewardNotes: "Major Domain bounty; rank-promotion evaluation.",
	},
	{
		id: "qc-a-relicheist",
		title: "Contested: The Sovereign Relic",
		rank: "A",
		type: "recovery",
		summary:
			"A relic tied to a Sovereign has surfaced, and three guilds want it. Reach it first and hold it long enough to extract.",
		objectives: [
			"Reach the relic chamber under fire from rivals",
			"Claim the relic and survive its awakening",
			"Extract through a contested threshold",
		],
		rewardNotes: "Relic of legend; dramatic standing shift among guilds.",
	},
	{
		id: "qc-a-mindgate",
		title: "The Rift That Thinks",
		rank: "A",
		type: "investigation",
		summary:
			"An A-rank Rift appears to anticipate every strike sent against it. Determine whether it is intelligent — or being directed.",
		objectives: [
			"Probe the Rift's adaptive responses",
			"Find the intelligence or the hand behind it",
			"Deliver findings before the next strike window",
		],
		rewardNotes: "High research bounty; classified-dossier credit.",
	},
	{
		id: "qc-a-blackmine",
		title: "Black Crystal Concession",
		rank: "A",
		type: "mining",
		summary:
			"A seam of volatile black crystal could fund a guild for a year — if it can be cut without detonating the whole chamber.",
		objectives: [
			"Neutralize the chamber's volatile guardians",
			"Cut the black crystal under blast discipline",
			"Evacuate the seam before resonance cascade",
		],
		rewardNotes: "Extraordinary crystal-credit payout; extreme hazard pay.",
	},

	// ── S-rank ────────────────────────────────────────────────────────────────
	{
		id: "qc-s-monarchgate",
		title: "The Monarch Rift",
		rank: "S",
		type: "strike",
		summary:
			"An S-rank Rift is ruled by a Monarch-class entity. Only a coalition of elite ascendants can hope to clear it.",
		objectives: [
			"Survive the Monarch's domain on entry",
			"Dismantle the Monarch's court of heralds",
			"Defeat the Monarch and seal the Rift",
		],
		rewardNotes: "Legendary clear; Monarch-grade relics; national renown.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-s-cityanchor",
		title: "The Anchor Beneath the City",
		rank: "S",
		type: "containment",
		summary:
			"An S-rank Domain has rooted its anchor beneath the capital itself. Failure means the city becomes the failure-state.",
		objectives: [
			"Reach the sub-city anchor through the Domain",
			"Hold the chamber against the Domain's full defense",
			"Sever the anchor and evacuate the collapse radius",
		],
		rewardNotes: "Nation-saving bounty; the highest Bureau honors.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-s-rogueregent",
		title: "Hunt: The Rogue Regent",
		rank: "S",
		type: "hunt",
		summary:
			"A Regent has turned on the Bureau, fielding gate-spawn as an army. Bring the full weight of the guilds against them.",
		objectives: [
			"Break the Regent's spawn-army screen",
			"Cut the Regent off from their domain power",
			"End the Regent before they ascend further",
		],
		rewardNotes: "Historic bounty; first claim on the Regent's holdings.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-s-deadgate",
		title: "Reopen the Dead Rift",
		rank: "S",
		type: "investigation",
		summary:
			"A Rift that 'died' decades ago has begun to breathe again. Determine what is reviving it before it finishes — and stop it if you must.",
		objectives: [
			"Enter the reviving dead Rift",
			"Identify the force restarting its core",
			"Halt the revival or evacuate the region",
		],
		rewardNotes:
			"Unprecedented research reward; classified at the national level.",
		grantsRegentUnlock: true,
	},

	// ── S-Rank ───────────────────────────────────────────────────────────────
	{
		id: "qc-ss-worldwound",
		title: "Seal the World-Wound",
		rank: "S",
		type: "containment",
		summary:
			"An S-Rank tear is bleeding multiple Domains into one another. Every elite guild on the continent is being called to seal it.",
		objectives: [
			"Coordinate the multi-guild assault on the tear",
			"Sever the linked Domain anchors in sequence",
			"Hold the seal through the world-wound's final surge",
		],
		rewardNotes:
			"Era-defining renown; relics without precedent; a place in history.",
		grantsRegentUnlock: true,
	},
	{
		id: "qc-ss-fallensovereign",
		title: "The Fallen Sovereign",
		rank: "S",
		type: "hunt",
		summary:
			"A Sovereign — a fusion of two Regents — has fallen to corruption and walks the waking world. Only the strongest coalition can answer.",
		objectives: [
			"Break the Sovereign's twin-domain ward",
			"Sunder the fused Regent-cores one at a time",
			"End the Fallen Sovereign before it remakes the region",
		],
		rewardNotes:
			"Legend beyond legend; Sovereign-grade spoils; national apotheosis.",
		grantsRegentUnlock: true,
	},
];

/** All prebuilt contracts, optionally filtered by rank. */
export const getPrebuiltQuestContracts = (
	rank?: GuildQuestRank,
): QuestContract[] =>
	rank
		? PREBUILT_QUEST_CONTRACTS.filter((q) => q.rank === rank)
		: PREBUILT_QUEST_CONTRACTS;

/**
 * Regent-tagged prebuilt contracts a Warden may complete to grant a character
 * one Regent-unlock opportunity. Spread across every rank — a Regent unlock can
 * happen at any character level, not only endgame.
 */
export const getRegentUnlockQuests = (): QuestContract[] =>
	PREBUILT_QUEST_CONTRACTS.filter((q) => q.grantsRegentUnlock);
