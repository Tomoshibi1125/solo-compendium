/**
 * SANDBOX TIMELINE - Blue Phase pressure clock
 */

export interface SandboxTimelineEvent {
	day: number;
	title: string;
	description: string;
	factionImpact?: string;
	linkedNpcName?: string;
	linkedSceneName?: string;
}

export const sandboxTimeline: SandboxTimelineEvent[] = [
	{
		day: 0,
		title: "Day 0 - Rift Sealed",
		description:
			"The party enters the Gloamreach. The Gate seals behind them and the AFA begins a fourteen-day Blue Phase estimate.",
		linkedSceneName: "Gate Domain: Rift Threshold",
	},
	{
		day: 1,
		title: "Day 1 - Tribute Bell",
		description:
			"Thornwake's tribute comes due. If ignored, the Regent marks the settlement as unprotected.",
		factionImpact: "Hollow Choir influence rises if tribute is paid.",
		linkedSceneName: "Gate Domain: Thornwake",
	},
	{
		day: 3,
		title: "Day 3 - Camp Triage",
		description:
			"Vermillion Camp runs out of clean stabilizer. Without help, its surgeons start choosing who is worth saving.",
		factionImpact: "Vermillion Camp reputation shifts by party aid.",
		linkedSceneName: "Gate Domain: Vermillion Camp",
	},
	{
		day: 4,
		title: "Day 4 - Bastion Relay Fades",
		description:
			"The Bureau Forward Bastion's relay drops to emergency pulse only. Route data becomes harder to trust.",
		factionImpact: "Bureau Remnant loses leverage if not stabilized.",
		linkedSceneName: "Gate Domain: Bureau Forward Bastion",
	},
	{
		day: 6,
		title: "Day 6 - Mill Output Doubles",
		description:
			"The Essence Mill begins processing tribute at double pace. Malformed cores appear in patrols.",
		linkedSceneName: "Gate Domain: Essence Mill",
	},
	{
		day: 8,
		title: "Day 8 - Glassvine Hunger",
		description:
			"The Glassvine Works mutates its crop. Medicine becomes addictive unless the root-engine is stabilized.",
		linkedSceneName: "Gate Domain: Glassvine Works",
	},
	{
		day: 9,
		title: "Day 9 - Aegis March",
		description:
			"Bound Aegis knights leave Hollow and begin reinforcing the Citadel unless released or defeated.",
		linkedSceneName: "Gate Domain: Aegis Hollow",
	},
	{
		day: 10,
		title: "Day 10 - Choir Road Opens",
		description:
			"The Hollow Choir opens a formal Citadel road through tribute rite. The party may exploit or disrupt it.",
		factionImpact: "Hollow Choir gains power if unopposed.",
		linkedSceneName: "Gate Domain: Choir Warrens",
	},
	{
		day: 11,
		title: "Day 11 - Black Vault Pressure",
		description:
			"Subject Zero leakage becomes visible as black frost around sealed thresholds.",
		linkedSceneName: "Gate Domain: Black Vault",
	},
	{
		day: 12,
		title: "Day 12 - Crownbeast Hunt",
		description:
			"The Crownbeast leaves the Den and tests every major road. Travel becomes dangerous without predator countermeasures.",
		linkedSceneName: "Gate Domain: Beast Crown Den",
	},
	{
		day: 13,
		title: "Day 13 - Citadel Invitation",
		description:
			"The Regent offers safe conduct to the Citadel. It is sincere and still dangerous.",
		linkedNpcName: "The Regent",
		linkedSceneName: "Gate Domain: Regent's Citadel",
	},
	{
		day: 14,
		title: "Day 14 - Red Phase",
		description:
			"Containment fails unless the Anchor has been resolved. Domain weather and Anomaly migration begin crossing the Gate.",
		linkedSceneName: "Gate Domain: Citadel Anchor Heart",
	},
];
