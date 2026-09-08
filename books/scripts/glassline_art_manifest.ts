export type GlasslineArtCategory =
	| "map"
	| "plate"
	| "threat"
	| "prop"
	| "handout"
	| "vehicle";

export type GlasslineArtStatus = "selected-existing" | "selected-generated";

export interface GlasslineArtSlot {
	slug: string;
	category: GlasslineArtCategory;
	title: string;
	placement: string;
	promptSeed: string;
	status: GlasslineArtStatus;
	selectedPath: string;
	reusePolicy?: string;
}

const ADVENTURE_ROOT = "/generated/adventures/glassline-claim";

export const glasslineArtSlots: GlasslineArtSlot[] = [
	{
		slug: "cover-eternal-shadow-dungeon",
		category: "plate",
		title: "Eternal Shadow Dungeon",
		placement: "Cover and site overview",
		promptSeed: "Canon location art for location-0001, the Rank-D Eternal Shadow Dungeon.",
		status: "selected-existing",
		selectedPath: "/generated/compendium/locations/location-0001.webp",
		reusePolicy: "Use canonical location art as the primary cover and site signal.",
	},
	{
		slug: "rift-threshold",
		category: "plate",
		title: "Bureau Rift Threshold",
		placement: "Threshold intake and site advisory",
		promptSeed: "Material-world Bureau threshold operation with modern containment lights and stable access.",
		status: "selected-existing",
		selectedPath: "/ui-art/rift-gate-hero.png",
		reusePolicy: "Reusable Rift Ascendant Bureau threshold art; no Run Silent-specific lore implied.",
	},
	{
		slug: "bureau-rover",
		category: "vehicle",
		title: "Bureau Light Survey Rover",
		placement: "Requisition, field support, and equipment references",
		promptSeed: "Bureau light survey rover, a practical support vehicle for Rift operations.",
		status: "selected-existing",
		selectedPath: "/ui-art/bureau_light_survey_rover.png",
		reusePolicy: "Reusable material-world equipment art from the Rift Ascendant asset set.",
	},
	{
		slug: "shadow-labyrinth-map",
		category: "map",
		title: "Shadow Labyrinth Reference Map",
		placement: "Corridor escort and tactical positioning",
		promptSeed: "Existing shadow dungeon map asset used as a table reference for corridor geometry.",
		status: "selected-existing",
		selectedPath: "/generated/maps/premade/shadow-labyrinth.webp",
		reusePolicy: "Use as a tactical inspiration plate, not as a mandatory battle map.",
	},
	{
		slug: "briefing-contract",
		category: "plate",
		title: "Ironclad Contract Briefing",
		placement: "Scene 1",
		promptSeed: "Modern Rift Ascendant contractor briefing office, licensed Ascendants, mining crew, no readable text.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/briefing-contract.png`,
	},
	{
		slug: "mira-voss",
		category: "plate",
		title: "Mira Voss",
		placement: "Scene 1 and NPC dossier",
		promptSeed: "Ironclad claim lead in a practical Rift staging yard, no readable text.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/mira-voss.png`,
	},
	{
		slug: "l3-hound-rift-hauler",
		category: "vehicle",
		title: "Ironclad Rift-Hauler L3-HOUND",
		placement: "Vehicle rules and threshold intake",
		promptSeed: "Tracked industrial Rift-Hauler with work lights, sample rack, tow hitch, and no weapons.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/l3-hound-rift-hauler.png`,
	},
	{
		slug: "l3-haul-sector-moving-escort",
		category: "plate",
		title: "L-3 Glassline Haul Sector Moving Escort",
		placement: "Scene 3",
		promptSeed: "Vehicle-scale shadow-stone industrial annex with Hound, escorts, workers, and pacing shadow.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/l3-haul-sector-moving-escort.png`,
	},
	{
		slug: "survey-marker-l3",
		category: "plate",
		title: "Survey Marker L-3",
		placement: "Scene 4",
		promptSeed: "Workers marking a shadow-stone route under licensed Ascendant protection.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/survey-marker-l3.png`,
	},
	{
		slug: "rival-claim-dispute",
		category: "plate",
		title: "Rival Claim Dispute",
		placement: "Scene 5",
		promptSeed: "Two licensed crews face off across a claim line in a shadow-stone chamber.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/rival-claim-dispute.png`,
	},
	{
		slug: "glassline-seam-extraction",
		category: "plate",
		title: "The Glassline Seam",
		placement: "Scene 6",
		promptSeed: "D-rank mining and salvage crew extracting a black-glass Essence seam under guard.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/glassline-seam-extraction.png`,
	},
	{
		slug: "claim-guardian-reveal",
		category: "threat",
		title: "Claim Guardian Reveal",
		placement: "Scene 7",
		promptSeed: "Rank-D shadow anomaly forming from a black-glass seam while Ascendants defend the crew.",
		status: "selected-generated",
		selectedPath: `${ADVENTURE_ROOT}/claim-guardian-reveal.png`,
	},
	{
		slug: "corrupted-shadow-anomaly",
		category: "threat",
		title: "Corrupted Shadow Anomaly",
		placement: "Enemy summaries",
		promptSeed: "Canon token art for anomaly-0021.",
		status: "selected-existing",
		selectedPath: "/generated/compendium/anomalies/anomaly-0021.webp",
	},
	{
		slug: "cursed-shadow-anomaly",
		category: "threat",
		title: "Cursed Shadow Anomaly",
		placement: "Enemy summaries",
		promptSeed: "Canon token art for anomaly-0061.",
		status: "selected-existing",
		selectedPath: "/generated/compendium/anomalies/anomaly-0061.webp",
	},
	{
		slug: "ancient-shadow-anomaly",
		category: "threat",
		title: "Ancient Shadow Anomaly",
		placement: "Enemy summaries",
		promptSeed: "Canon token art for anomaly-0081.",
		status: "selected-existing",
		selectedPath: "/generated/compendium/anomalies/anomaly-0081.webp",
	},
	{
		slug: "legendary-shadow-anomaly",
		category: "threat",
		title: "Legendary Shadow Anomaly",
		placement: "Enemy summaries",
		promptSeed: "Canon token art for anomaly-0141.",
		status: "selected-existing",
		selectedPath: "/generated/compendium/anomalies/anomaly-0141.webp",
	},
];

export function glasslineSelectedArtSlots(): GlasslineArtSlot[] {
	return glasslineArtSlots.filter((slot) => Boolean(slot.selectedPath));
}

export function glasslineArtBySlug(slug: string): GlasslineArtSlot | undefined {
	return glasslineArtSlots.find((slot) => slot.slug === slug);
}

export function glasslineFigure(slug: string, caption?: string): string {
	const slot = glasslineArtBySlug(slug);
	if (!slot?.selectedPath) return "";
	const finalCaption = caption || slot.title;
	return `<figure class="campaign-art campaign-art--${slot.category}" data-art-slot="${escapeHtml(slot.slug)}">
	<img src="${slot.selectedPath}" alt="${escapeHtml(slot.title)}"/>
	<figcaption>${escapeHtml(finalCaption)}</figcaption>
</figure>`;
}

export function glasslineArtCoverageSummary(): string {
	const selected = glasslineSelectedArtSlots();
	const rows = selected
		.map(
			(slot) =>
				`<tr><td>${escapeHtml(slot.title)}</td><td>${escapeHtml(slot.category)}</td><td>${escapeHtml(slot.status)}</td><td>${escapeHtml(slot.placement)}</td></tr>`,
		)
		.join("");
	return `<aside class="campaign-note">
	<h3>One-Shot Art Coverage</h3>
	<p>This packet uses existing Rift Ascendant art first and generated adventure-specific plates only where no suitable existing scene art was available.</p>
	<table class="campaign-table"><thead><tr><th>Asset</th><th>Type</th><th>Status</th><th>Placement</th></tr></thead><tbody>${rows}</tbody></table>
</aside>`;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
