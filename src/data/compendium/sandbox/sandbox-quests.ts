/**
 * SANDBOX QUESTS — "Run Silent"
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
			"Strike Team Seven's AFA beacon pings from the Hollow Way near the Rift Threshold, then from farther down the old roads. Commander Park needs answers before Central Command marks them expendable.",
		objectives: [
			"Enter the Hollow Way",
			"Track the AFA ghost-ping without giving the road a true name",
			"Recover the beacon or identify why it is broadcasting from multiple places",
		],
		completionTriggers: [
			"Beacon delivered to Commander Park at the Annex.",
			"Beacon destroyed to keep the dark from tracing it, with proof recovered.",
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
			"Quartermaster Lin needs stabilizer serum delivered from the Annex to Mother Rust's Outreach Post. The path is short, but the old roads have begun charging for passage.",
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
			"Find where the fen records its dead",
			"Extract the survivors or drown the records that name them dead",
		],
		completionTriggers: [
			"Survivors extracted and records corrected.",
			"Records destroyed but survivors lost.",
			"Ledger entries become final.",
		],
		rewardNotes: "Bureau +1; Catalog access; clue toward the Means.",
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
			"Quiet-Marked clue chain; Fungal Depths Means hint; Mother Rust research leverage.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		id: "q-c-01",
		title: "C-Rank: Fruit of the Forgotten",
		rank: "C",
		summary:
			"The Remembering Orchard is taking more than pain. Villagers who gave to the orchard no longer remember people they loved. The Caretaker insists this is mercy.",
		objectives: [
			"Interview villagers without breaking the community's rules",
			"Locate the harvested memory rows",
			"Choose whether to restore, destroy, or bargain for the stolen memories",
		],
		completionTriggers: [
			"Memories restored to the settlement.",
			"The orchard's custom broken with a ward or a true name.",
			"The Caretaker defeated or recruited.",
		],
		rewardNotes: "Civilian trust +2; Means clue; memory fruit boon.",
		linkedNpcName: "The Caretaker",
	},
	{
		id: "q-c-02",
		title: "C-Rank: Ashes of a Colleague",
		rank: "C",
		summary:
			"A Bureau researcher is trapped in the Ashen Counting-House, kept half-alive and feeding the hall's endless fire. Extracting them may erase evidence Central Command wants buried.",
		objectives: [
			"Reach the Asking-Floor",
			"Put out the furnace at the hall's heart",
			"Extract the researcher or preserve their testimony",
		],
		completionTriggers: [
			"Researcher alive and the hall's hold on them broken.",
			"Evidence preserved but researcher lost.",
			"The fire takes the researcher, and the hall burns hotter for it.",
		],
		rewardNotes: "Bureau research unlock; a truth the burning hall cannot deny; fire or blood Sigil.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		id: "q-c-03",
		title: "C-Rank: Blackwood's Quiet File",
		rank: "C",
		summary:
			"Agent Kira Blackwood needs deniable help tracing pre-threshold resonance of the Means. The file can surface classified findings command had sealed for caution — embarrassing, not dishonest — without making Blackwood a villain.",
		objectives: [
			"Recover Blackwood's sealed evidence from the Annex or Ledgerfen",
			"Identify which piece of the Means manifested before the threshold stabilized",
			"Decide whether to reveal, bury, or weaponize the sealed findings",
		],
		completionTriggers: [
			"Blackwood discloses her classified orders and backs the party.",
			"The file is delivered to Park, Hayashi, Vermillion, or Central Command.",
			"The evidence is destroyed to prevent institutional exploitation.",
		],
		rewardNotes:
			"Blackwood recruitment path; Bureau trust shift; one Means placement clue.",
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
		rewardNotes: "Civilian trust shift; water/cold Sigil; Means clue.",
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
		rewardNotes: "Finale ally support; armor or shield Sigil; Means clue.",
		linkedNpcName: "Commander Without a Body",
	},
	{
		id: "q-b-03",
		title: "B-Rank: The Cult Defector",
		rank: "B",
		summary:
			"Whisper, Sister Veil, or Acolyte Mara can prove the Hollow Mother intends to be remade by the Quiet into a hunter. Extracting a defector gives the party ritual leverage, but the Awoko want them alive.",
		objectives: [
			"Locate the defector in a grief-dense settlement, Sunken Tunnels shrine, or Awoko Sanctum wing",
			"Protect them from cult retrieval",
			"Secure proof of the Ritual of Becoming",
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
			"Professor Lun believes the Mana Vein Network can be charted to find where the Quiet goes deaf — silence to use in the final crossing. The sensors must be placed inside three nodes the dark can feel.",
		objectives: [
			"Install a sensor in the Rusted Hull",
			"Install a sensor in the Silent Depot",
			"Install a sensor in the Glass Sub-Basement beneath the Ashen Counting-House",
		],
		completionTriggers: [
			"All three nodes are mapped and Lun survives the final reading.",
			"Two nodes are mapped for partial finale support.",
			"The Quiet hears who placed the sensors, and the worn dead come.",
		],
		rewardNotes:
			"The party earn a deaf place — silence to use in the final crossing (a Means component).",
		linkedNpcName: "Professor Lun",
	},
	{
		id: "q-a-01",
		title: "A-Rank: The Mirror Climb",
		rank: "A",
		summary:
			"The Obsidian Spire forces each Ascendant to confront the version of themselves that would stop being prey by becoming a predator.",
		objectives: [
			"Ascend the Spire's trial floors",
			"Resolve each reflection by defeat, confession, refusal, or reconciliation",
			"Reach the Watcher's Gallery",
		],
		completionTriggers: ["All reflections resolved and the Watcher's trial answered."],
		rewardNotes:
			"A-Rank Relic or Sigil; a truth about the Quiet; temptation consequence based on choices.",
		linkedNpcName: "The Watcher",
	},
	{
		id: "q-a-02",
		title: "A-Rank: Civilian Convoy",
		rank: "A",
		summary:
			"A warded community asks the party to move civilians to a stronger safe-hold. The open road demands names, the worn dead stalk the convoy, and some civilians believe leaving voids their wards.",
		objectives: [
			"Gather the convoy without triggering panic",
			"Cross the open roads without losing civilians to the dark",
			"Reach Mother Rust's Outreach Post, the Annex, or a trusted settlement shelter",
		],
		completionTriggers: [
			"Most civilians survive and reach safe shelter.",
			"The convoy survives but pays a permanent cost.",
			"The worn dead take someone and civilian trust collapses.",
		],
		rewardNotes:
			"Major Independent Survivor reputation; Mama Chen, Doc Tanaka, or Jax support in the final crossing.",
		linkedFactionId: "independent",
		linkedNpcName: "Mama Chen",
	},
	{
		id: "q-s-01",
		title: "S-Rank: The Long Dark",
		rank: "S",
		summary:
			"The way out is the way back: the deepest, darkest crossing to the sealed Threshold. The party must reach it through the worst the Gloamreach has, with the Quiet hunting the whole way.",
		objectives: [
			"Cross the deep Gloamreach to the sealed Threshold",
			"Survive the gathered worn dead and the Quiet's lure",
			"Escape — or, with the Means at Level 9+, make the one stand that ends the Quiet",
		],
		completionTriggers: [
			"The party escape through the Threshold.",
			"The party kill the Quiet, and the seal fails.",
			"A character takes the predator's road, and a new hunter rises.",
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
			"Resolve his choice before the final crossing",
			"Use or lose Bureau final-operation support",
		],
		completionTriggers: ["Park's choice resolved during the final preparation window."],
		rewardNotes: "Finale support, emotional payoff, and Bureau epilogue consequences.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		id: "q-s-03",
		title: "S-Rank: The Worn Dead Gather",
		rank: "S",
		summary:
			"As the party near the Threshold, the worn dead gather against them — every face they failed, drawn up by the Quiet for one last hunt. Thinned or evaded, the party reach the Threshold with room to breathe. Ignored, the dead arrive in force in the middle of the final crossing.",
		objectives: [
			"Learn which of the lost dead the Quiet has set on their trail",
			"Break a marking with a true name, a ward, or the Old Power Below",
			"Decide whether to fight clear, slip past silent, or lead the gathered dead astray",
		],
		completionTriggers: [
			"The gathered dead are scattered or evaded.",
			"A marking is broken and the dead lose the party's trail.",
			"The dead reach the Threshold with the party, in force.",
		],
		rewardNotes:
			"Removes or eases a major final-act threat; may change how the final crossing plays.",
		linkedNpcName: "The Worn",
	},
];
