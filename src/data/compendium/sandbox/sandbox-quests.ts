/**
 * SANDBOX QUESTS — "The Shadow of the Regent"
 *
 * Structured quest scaffolds grouped by threat rank. Seeded as wiki articles
 * with `category: "quest"` so they surface in a dedicated Wiki filter.
 */

export type SandboxQuestRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface SandboxQuest {
	id: string;
	title: string;
	rank: SandboxQuestRank;
	summary: string;
	objectives: string[];
	completionTriggers: string[];
	rewardNotes: string;
	linkedFactionId?: string;
	linkedNpcName?: string;
}

export const sandboxQuests: SandboxQuest[] = [
	{
		id: "q-e-01",
		title: "E-Rank: Beacon of the Lost",
		rank: "E",
		summary:
			"Strike Team Seven's AFA beacon pings from the Hollow Subway near the Gate Threshold, then from farther down the Road of Writs. Commander Park needs answers before Central Command marks them expendable.",
		objectives: [
			"Enter the Hollow Subway",
			"Track the AFA ghost-ping without giving the road a true name",
			"Recover the beacon or identify why it is broadcasting from multiple places",
		],
		completionTriggers: [
			"Beacon delivered to Commander Park at the Annex.",
			"Beacon destroyed to prevent a Regent trace, with proof recovered.",
		],
		rewardNotes:
			"Bureau reputation +1; minor Relic clue; access to Yoon's missing-team route.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		id: "q-e-02",
		title: "E-Rank: The Serum Road",
		rank: "E",
		summary:
			"Quartermaster Lin needs stabilizer serum delivered from the Annex to Mother Rust's Outreach Post. The path is short, but the Road of Writs has begun charging for passage.",
		objectives: [
			"Collect three serum crates from the Annex armory",
			"Deliver them to Mother Rust's Outreach Post",
			"Avoid paying the road with names, memories, or civilians",
		],
		completionTriggers: [
			"All crates delivered intact.",
			"Two crates delivered for partial success.",
			"The clinic is collected or exposed, causing reputation loss.",
		],
		rewardNotes: "Bureau +1, Independent +1; safe shelter token at the clinic.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Quartermaster Lin Mei-hua",
	},
	{
		id: "q-d-01",
		title: "D-Rank: Tides Over the Ledgerfen",
		rank: "D",
		summary:
			"The Drowned Ledgerfen has classified several missing survivors as deceased even though their AFA tags still show life. Recover them before the record becomes true.",
		objectives: [
			"Enter the Drowned Ledgerfen",
			"Find the active casualty ledger",
			"Extract the survivors or legally contradict their death entries",
		],
		completionTriggers: [
			"Survivors extracted and records corrected.",
			"Records destroyed but survivors lost.",
			"Ledger entries become final.",
		],
		rewardNotes: "Bureau +1; Catalog access; clue toward the Void Claim.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "The Catalog",
	},
	{
		id: "q-d-02",
		title: "D-Rank: Roots of the Diagnosed",
		rank: "D",
		summary:
			"The Fungal Depths contain memory-growths from the Memory-Care Wing. The party can recover patient files, but every file has started growing a body.",
		objectives: [
			"Navigate the Fungal Depths",
			"Disable the mycelium archive wards",
			"Recover at least three recognizable patient files",
		],
		completionTriggers: [
			"Files recovered and delivered to Hayashi or the families.",
			"Files burned to prevent further growth.",
		],
		rewardNotes:
			"Regent-Marked clue chain; Fungal Depths Claim hint; Mother Rust research leverage.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		id: "q-c-01",
		title: "C-Rank: Fruit of the Forgotten",
		rank: "C",
		summary:
			"The Remembering Orchard is taking more than pain. Villagers who paid tribute no longer remember people they loved. The Caretaker insists this is mercy.",
		objectives: [
			"Interview villagers without breaking local guest-right",
			"Locate the harvested memory rows",
			"Choose whether to restore, destroy, or bargain for the stolen memories",
		],
		completionTriggers: [
			"Memories restored to the settlement.",
			"Orchard law contradicted with a Claim or legal proof.",
			"The Caretaker defeated or recruited.",
		],
		rewardNotes: "Civilian trust +2; Blood Claim clue; memory fruit boon.",
		linkedNpcName: "The Caretaker",
	},
	{
		id: "q-c-02",
		title: "C-Rank: Ashes of a Colleague",
		rank: "C",
		summary:
			"A Bureau researcher is trapped in the Ashen Counting-House, used as a living relay for debt calculations. Extracting them may erase evidence Central Command wants hidden.",
		objectives: [
			"Reach the Audit Floor",
			"Disable the furnace-ledger relay",
			"Extract the researcher or preserve their testimony",
		],
		completionTriggers: [
			"Researcher alive and relay disabled.",
			"Evidence preserved but researcher lost.",
			"Relay detonates, empowering a Regent debt law.",
		],
		rewardNotes: "Bureau research unlock; debt-law contradiction; fire or blood Sigil.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		id: "q-c-03",
		title: "C-Rank: Blackwood's Quiet File",
		rank: "C",
		summary:
			"Agent Kira Blackwood needs deniable help tracing pre-threshold Claim resonance. The file can expose Bureau command dishonesty without making Blackwood a villain.",
		objectives: [
			"Recover Blackwood's sealed evidence from the Annex or Ledgerfen",
			"Identify which Claim manifested before the threshold stabilized",
			"Decide whether to reveal, bury, or weaponize the Bureau's secret",
		],
		completionTriggers: [
			"Blackwood confesses her real orders and backs the party.",
			"The file is delivered to Park, Hayashi, Vermillion, or Central Command.",
			"The evidence is destroyed to prevent institutional exploitation.",
		],
		rewardNotes:
			"Blackwood recruitment path; Bureau trust shift; one Claim placement clue.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Agent Kira Blackwood",
	},
	{
		id: "q-b-01",
		title: "B-Rank: Pressure at the Sunken Line",
		rank: "B",
		summary:
			"The Sunken Tunnels hold drowned commuters, Bureau dead, and fused survivors whose names are still being charged for passage.",
		objectives: [
			"Reach the main flooded platform",
			"Identify at least ten name tags",
			"Decide the fate of the fused survivors",
		],
		completionTriggers: [
			"Names returned to the living or memorialized properly.",
			"Fused survivors extracted, released, or slain by mercy decision.",
		],
		rewardNotes: "Civilian trust shift; water/cold Sigil; Blood Claim clue.",
	},
	{
		id: "q-b-02",
		title: "B-Rank: Oath at Golemfall",
		rank: "B",
		summary:
			"Bastion Golemfall's dead defenders still hold a wall that failed years ago. Their commander can aid the finale, but only if the party resolves the oath without turning the dead into tools.",
		objectives: [
			"Enter Bastion Golemfall",
			"Recover the fallen banner",
			"Convince the Commander Without a Body to release or redirect the oath",
		],
		completionTriggers: [
			"The oath is released honorably.",
			"The dead are drafted by force, creating a dark consequence.",
		],
		rewardNotes: "Finale ally support; armor or shield Sigil; Abyss Claim clue.",
		linkedNpcName: "Commander Without a Body",
	},
	{
		id: "q-b-03",
		title: "B-Rank: The Cult Defector",
		rank: "B",
		summary:
			"Whisper, Sister Veil, or Acolyte Mara can prove the Hollow Mother intends to inherit the Gloamreach. Extracting a defector gives the party ritual leverage, but the Awoko want them alive.",
		objectives: [
			"Locate the defector in a grief-dense settlement, Sunken Tunnels shrine, or Awoko Sanctum wing",
			"Protect them from cult retrieval",
			"Secure proof of the Ritual of Inheritance",
		],
		completionTriggers: [
			"A defector reaches safe shelter and confirms the Hollow Mother's plan.",
			"The defector dies but leaves usable ritual evidence.",
			"The cult recaptures the defector and accelerates the ritual clock.",
		],
		rewardNotes:
			"Sister Veil, Whisper, Mara, or Hana recruitment path; Awoko ritual disruption option.",
		linkedFactionId: "awoko-cult",
		linkedNpcName: "Sister Veil",
	},
	{
		id: "q-b-04",
		title: "B-Rank: Professor Lun's Theory",
		rank: "B",
		summary:
			"Professor Lun believes the Mana Vein Network can weaken the Regent's battlefield control. The sensors must be placed inside three nodes the Domain can feel.",
		objectives: [
			"Install a sensor in the Rusted Hull",
			"Install a sensor in the Silent Depot",
			"Install a sensor in the Glass Sub-Basement beneath the Ashen Counting-House",
		],
		completionTriggers: [
			"All three nodes are mapped and Lun survives the final reading.",
			"Two nodes are mapped for partial finale support.",
			"The Regent learns who placed the sensors and prepares a counterclaim.",
		],
		rewardNotes:
			"Regent loses or delays one Domain control option during the finale.",
		linkedNpcName: "Professor Lun",
	},
	{
		id: "q-a-01",
		title: "A-Rank: The Mirror Climb",
		rank: "A",
		summary:
			"The Obsidian Spire forces each Ascendant to confront the version of themselves that would accept the throne for the right reason.",
		objectives: [
			"Ascend the Spire's trial floors",
			"Resolve each reflection by defeat, confession, refusal, or reconciliation",
			"Reach the Watcher's Gallery",
		],
		completionTriggers: ["All reflections resolved and the Watcher's trial answered."],
		rewardNotes:
			"A-Rank Relic or Sigil; Claim placement access; temptation consequence based on choices.",
		linkedNpcName: "The Watcher",
	},
	{
		id: "q-a-02",
		title: "A-Rank: Civilian Convoy",
		rank: "A",
		summary:
			"A tribute settlement asks the party to move civilians to safer shelter. The road demands names, the Bailiff challenges custody, and some civilians believe leaving voids their protection.",
		objectives: [
			"Gather the convoy without triggering panic",
			"Cross the Road of Writs without surrendering civilians as legal payment",
			"Reach Mother Rust's Outreach Post, the Annex, or a trusted settlement shelter",
		],
		completionTriggers: [
			"Most civilians survive and reach safe shelter.",
			"The convoy survives but pays a permanent cost.",
			"The Bailiff collects someone and civilian trust collapses.",
		],
		rewardNotes:
			"Major Independent Survivor reputation; Mama Chen, Doc Tanaka, or Jax support in Citadel Day.",
		linkedFactionId: "independent",
		linkedNpcName: "Mama Chen",
	},
	{
		id: "q-s-01",
		title: "S-Rank: The Name at the Throne",
		rank: "S",
		summary:
			"The Regent's Citadel opens. The party must confront the Anchor not as a monster in a room, but as a sovereign law that believes it owns the Gloamreach and everyone inside it.",
		objectives: [
			"Reach the Citadel through the Road of Final Writs",
			"Survive the Throne Court",
			"Resolve the Anchor in the Undercroft",
		],
		completionTriggers: [
			"The Anchor is broken.",
			"The Anchor is sealed.",
			"The Anchor is transformed or inherited.",
		],
		rewardNotes:
			"Campaign resolution; ending-based artifact slate; Gloamreach fate determined.",
	},
	{
		id: "q-s-02",
		title: "S-Rank: Park's Final Watch",
		rank: "S",
		summary:
			"If the party exposes Central Command's failure or recovers Strike Team Seven's truth, Park must decide whether to obey orders, defy them, or stand personally at the breach.",
		objectives: [
			"Confront Park with the truth",
			"Resolve his choice before Citadel Day",
			"Use or lose Bureau final-operation support",
		],
		completionTriggers: ["Park's choice resolved during the final preparation window."],
		rewardNotes: "Finale support, emotional payoff, and Bureau epilogue consequences.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		id: "q-s-03",
		title: "S-Rank: The Bailiff's Last Writ",
		rank: "S",
		summary:
			"The Regent's Bailiff prepares a final writ naming the party as stolen property of the Citadel. If answered properly, the party can enter the finale unchained. If ignored, the Bailiff arrives during the Throne Court.",
		objectives: [
			"Recover the final writ from the Bailiff's Stair or a toll-house",
			"Contradict the charge with a Claim, older precedent, or proven guest-right",
			"Decide whether to destroy the Bailiff, dismiss it, or bind it to a new law",
		],
		completionTriggers: [
			"The Bailiff is legally dismissed.",
			"The Bailiff is destroyed after its writ is invalidated.",
			"The Bailiff enters the finale empowered.",
		],
		rewardNotes:
			"Removes or alters a major final-act threat; may create a new Domain precedent.",
		linkedNpcName: "The Regent's Bailiff",
	},
];
