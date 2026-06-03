/**
 * SANDBOX QUESTS - The Shadow of the Regent
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
		title: "E-Rank: The Sealed Road",
		rank: "E",
		summary: "Find a route from the Rift Threshold to Thornwake before night patrols learn the party's scent.",
		objectives: ["Recover a working AFA road ping", "Avoid or defeat the first tax hounds", "Reach Thornwake before the bell rings twice"],
		completionTriggers: ["Party reaches Thornwake", "Party camps outside and suffers a night encounter"],
		rewardNotes: "Thornwake access, 200 Credits equivalent in trade, first Anchor Scan clue.",
		linkedFactionId: "free-ascendants",
	},
	{
		id: "q-e-02",
		title: "E-Rank: Tribute Night",
		rank: "E",
		summary: "Thornwake must pay the Regent's tribute by midnight. The party chooses resistance, deception, payment, or evacuation.",
		objectives: ["Inspect the Tribute Shed", "Confront the courier", "Decide who pays the cost"],
		completionTriggers: ["Tribute wagon leaves, burns, or is redirected"],
		rewardNotes: "Reputation shift with Thornwake factions; possible Regent invitation.",
		linkedFactionId: "hollow-choir",
	},
	{
		id: "q-d-01",
		title: "D-Rank: Red Ledgers",
		rank: "D",
		summary: "The Bureau Forward Bastion holds records proving why the first expedition failed.",
		objectives: ["Enter the Bastion", "Restore the AFA relay", "Recover the sealed command ledger"],
		completionTriggers: ["Ledger delivered to any faction leader", "Ledger destroyed"],
		rewardNotes: "Bureau or Free Ascendant reputation; Bastion may become a safe rest.",
		linkedFactionId: "bureau-remnant",
	},
	{
		id: "q-d-02",
		title: "D-Rank: Camp Surgery",
		rank: "D",
		summary: "Vermillion needs clean Essence and Glassvine sap before its surgeons lose three patients.",
		objectives: ["Gather clean Essence", "Secure Glassvine sap", "Return before the ash rain spoils the samples"],
		completionTriggers: ["Supplies delivered", "Patients lost"],
		rewardNotes: "Vermillion surgery favor and discounted Relic appraisal.",
		linkedFactionId: "vermillion-camp",
	},
	{
		id: "q-c-01",
		title: "C-Rank: Stop the Wheel",
		rank: "C",
		summary: "The Essence Mill renders tribute into malformed cores. Shut it down or turn it against the Regent.",
		objectives: ["Enter the Mill", "Defeat or bargain with the Millwarden", "Claim or destroy the Millstone Heart"],
		completionTriggers: ["Millstone Heart obtained", "Mill destroyed", "Mill left running"],
		rewardNotes: "Anchor Relic, Essence stores, Red Phase consequence if mishandled.",
		linkedFactionId: "vermillion-camp",
	},
	{
		id: "q-c-02",
		title: "C-Rank: The Thorn Crop",
		rank: "C",
		summary: "The Glassvine Works can feed settlements or poison them. Its root-engine is growing an Anchor Relic.",
		objectives: ["Map the greenhouse-factory", "Stabilize or burn the crop", "Claim the Crown of Thorns"],
		completionTriggers: ["Crop stabilized", "Works burned", "Relic taken"],
		rewardNotes: "Anchor Relic, medicine access, settlement survival shift.",
		linkedFactionId: "gloamreach-bound",
	},
	{
		id: "q-b-01",
		title: "B-Rank: Oath Furnace",
		rank: "B",
		summary: "Aegis Hollow's fallen defenders guard a Relic that can bind a Citadel law.",
		objectives: ["Reach Banner Hall", "Face the bound Aegis knights", "Free, defeat, or recruit the oath"],
		completionTriggers: ["Aegis Nail obtained", "Aegis knights released", "Order remains bound"],
		rewardNotes: "Anchor Relic or final-assault ally.",
		linkedFactionId: "free-ascendants",
	},
	{
		id: "q-b-02",
		title: "B-Rank: The Choir Bell",
		rank: "B",
		summary: "The Hollow Choir prepares a rite that will open a guarded road to the Citadel.",
		objectives: ["Infiltrate the Warrens", "Find the Choir Bell", "Break, steal, or invert the rite"],
		completionTriggers: ["Bell obtained", "Rite completed", "Choir leadership removed"],
		rewardNotes: "Anchor Relic, Citadel route, major faction shift.",
		linkedFactionId: "hollow-choir",
	},
	{
		id: "q-a-01",
		title: "A-Rank: The Beast Crown",
		rank: "A",
		summary: "The apex predator of the Den carries a Relic fang that can redirect the Regent's hunt.",
		objectives: ["Enter Beast Crown territory", "Survive the predator trials", "Kill, tame, or release the Crownbeast"],
		completionTriggers: ["Beast Crown Fang obtained", "Crownbeast released toward Citadel"],
		rewardNotes: "Anchor Relic or predator ally.",
		linkedFactionId: "gloamreach-bound",
	},
	{
		id: "q-a-02",
		title: "A-Rank: The Black Vault Offer",
		rank: "A",
		summary: "Subject Zero leakage offers a shortcut to power that works exactly as promised.",
		objectives: ["Enter the Vault", "Hear the bargain", "Accept, refuse, or steal from the pressure wound"],
		completionTriggers: ["Bargain resolved", "Vault sealed", "Vault opened wider"],
		rewardNotes: "Forbidden advantage; Red Phase pressure if accepted.",
		linkedFactionId: "gloamreach-bound",
	},
	{
		id: "q-s-01",
		title: "S-Rank: Walk to the Citadel",
		rank: "S",
		summary: "Use secured routes, allies, and Anchor Relics to survive the road to the Regent's Citadel.",
		objectives: ["Choose an approach route", "Spend or preserve Anchor Relics", "Reach the final chamber from the Anchor Scan"],
		completionTriggers: ["Party enters final chamber", "Party retreats from Citadel"],
		rewardNotes: "Final confrontation access.",
		linkedFactionId: "bureau-remnant",
	},
	{
		id: "q-s-02",
		title: "S-Rank: Resolve the Anchor",
		rank: "S",
		summary: "Destroy, seal, or transform the Regent before Red Phase turns the Gloamreach outward.",
		objectives: ["Make the Regent vulnerable", "Choose a clear state", "Survive the Domain's answer"],
		completionTriggers: ["Anchor destroyed", "Anchor sealed", "Anchor transformed", "Red Phase failure"],
		rewardNotes: "Campaign ending.",
		linkedFactionId: "free-ascendants",
	},
];
