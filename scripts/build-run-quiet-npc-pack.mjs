import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PDFDocument, PDFHexString, PDFName } from "pdf-lib";
import { chromium } from "playwright";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const exportDir = path.join(rootDir, "exports", "run-quiet-npc-table-pack");
const portraitDir = path.join(exportDir, "portraits");
const cropDir = path.join(exportDir, "app-crops");
const dossierDir = path.join(exportDir, "dossiers");
const appDir = path.join(
	rootDir,
	"public",
	"generated",
	"compendium",
	"sandbox_npcs",
);

const sharedPrompt = [
	"Use all nine uploaded Quiet artworks as mandatory style and quality references.",
	"Match their near-photoreal cinematic dark-fantasy realism, natural faces and anatomy,",
	"deep blue-black shadows, warm practical light, restrained violet/cyan Rift accents,",
	"wet tactile materials, atmospheric depth, strong chiaroscuro, and film-grade finish.",
	"Create a text-free 3:2 landscape, full-body character scene with the face and torso",
	"kept safe for a central square crop. Avoid painterly illustration, anime styling,",
	"plastic skin, generic fantasy costuming, excessive neon, fake text, and watermarks.",
].join(" ");

const npcs = [
	{
		id: "npc-bureau-001",
		slug: "commander-park-jae-won",
		name: "Commander Park Jae-won",
		title: "Bureau Domain Response Commander",
		faction: "Bureau Sentinels",
		location: "Bureau Domain Response Annex",
		cropLeft: 512,
		firstImpression:
			"Calm enough to make a collapsing map feel like a problem with an answer.",
		reputation:
			"A veteran response commander known for disciplined containment work and an unwillingness to spend civilian lives for cleaner reports.",
		visibleDetails: [
			"Battle-scarred face and rain-dark command armor.",
			"Mana-reinforced prosthetic arm with restrained cyan conduits.",
			"Speaks quietly and checks exits before giving an order.",
		],
		prompt:
			"Battle-scarred Korean male commander in practical modern Bureau field armor at the rain-dark Annex, with functional mana-reinforced prosthetics and a grounded, protective stance.",
	},
	{
		id: "npc-bureau-004",
		slug: "dr-serin-hayashi",
		name: "Dr. Serin Hayashi",
		title: "Domain Researcher",
		faction: "Bureau Sentinels",
		location: "Annex Evidence Laboratory",
		cropLeft: 360,
		firstImpression:
			"Already three conclusions ahead, and more frightened of a bad assumption than the thing in the specimen case.",
		reputation:
			"A brilliant field researcher whose theories treat the Gloamreach as a system of laws rather than ordinary terrain.",
		visibleDetails: [
			"Ink-stained cuffs, battered notebook, and practical field coat.",
			"Carries compact sampling instruments instead of a weapon.",
			"Looks exhausted, alert, and intensely compassionate.",
		],
		prompt:
			"Japanese woman field researcher in a cramped Annex evidence laboratory, with ink-stained cuffs, a battered notebook, sampling equipment, and sleep-deprived intellectual courage.",
	},
	{
		id: "npc-bureau-003",
		slug: "sergeant-yoon-hye-jin",
		name: "Sergeant Yoon Hye-jin",
		title: "Domain Scout Leader",
		faction: "Bureau Sentinels",
		location: "Road of Writs Patrol Route",
		cropLeft: 220,
		firstImpression:
			"She has already found every exit, including the one the road has not admitted exists.",
		reputation:
			"A precise scout leader trusted to follow signals and people through terrain that refuses to stay mapped.",
		visibleDetails: [
			"Lean reconnaissance kit with no decorative equipment.",
			"Chalk route marks across worn dark gloves.",
			"Listens longer than she speaks and never turns her back on a doorway.",
		],
		prompt:
			"Korean woman reconnaissance leader on the rain-soaked Road of Writs, with chalk-marked gloves, practical modern scout gear, and controlled vigilance.",
	},
	{
		id: "npc-verm-004",
		slug: "guildmaster-orin",
		name: "Guildmaster Orin",
		title: "Vermillion Commander",
		faction: "Vermillion Guild",
		location: "Vermillion Outpost",
		cropLeft: 500,
		firstImpression:
			"He can make a rescue sound like an invoice without making the rescue less real.",
		reputation:
			"The Outpost's controlled and pragmatic commander, known for choosing fast, ugly action over clean delay.",
		visibleDetails: [
			"Weathered command coat repaired from modern field materials.",
			"Receives visitors beside a scarred tea table, never a throne.",
			"Carries old service habits without displaying old insignia.",
		],
		prompt:
			"Weathered former Bureau officer commanding a fortified salvage outpost beside a scarred tea table, wearing repaired modern field layers and an understated dark-red-brown coat.",
	},
	{
		id: "npc-verm-001",
		slug: "rat-king-ji",
		name: "Rat-King Ji",
		title: "Black Market Fence",
		faction: "Vermillion Guild",
		location: "Vermillion Outpost Bazaar",
		cropLeft: 60,
		firstImpression:
			"Friendly enough to lower the price, observant enough to know why you need it lowered.",
		reputation:
			"A reliable broker of hidden salvage and hard-to-find supplies who is considered fair in business and incomplete in every answer.",
		visibleDetails: [
			"Wiry build, quick half-smile, and subtly mismatched eyes.",
			"Layered market coat with discreet pockets, keys, and appraisal tools.",
			"Always stands where two escape routes remain open.",
		],
		prompt:
			"Wiry East Asian black-market broker in a rain-leaking Outpost bazaar, with subtle mismatched eyes, appraisal tools, layered practical clothing, and intimate transactional tension.",
	},
	{
		id: "npc-awoko-001",
		slug: "the-hollow-mother",
		name: "The Hollow Mother",
		title: "Awoko Hierophant",
		faction: "Awoko Cult",
		location: "Awoko Sanctum",
		cropLeft: 256,
		firstImpression:
			"Her comfort feels sincere. That is what makes accepting it difficult.",
		reputation:
			"The Awoko's soft-spoken leader, sought by grieving people who say she listens without judgment.",
		visibleDetails: [
			"Layered mourning clothes and translucent veils that leave her face visible.",
			"Open hands, quiet voice, and unwavering attention.",
			"Faint ritual scars are visible at the wrists and throat.",
		],
		prompt:
			"Middle-aged cult leader in a damp adapted community chapel, wearing grounded charcoal mourning clothes and translucent veils, offering genuine comfort with predatory intelligence.",
	},
	{
		id: "npc-awoko-004",
		slug: "sister-veil",
		name: "Sister Veil",
		title: "Cult Ritualist",
		faction: "Awoko Cult",
		location: "Awoko Sanctum Laboratory",
		cropLeft: 80,
		firstImpression:
			"Every gesture is measured, as though the room is one calculation away from becoming dangerous.",
		reputation:
			"A meticulous ritual engineer responsible for containment work and the Awoko's most exacting technical rites.",
		visibleDetails: [
			"Plain cracked porcelain mask with practical eye openings.",
			"Dark reinforced work clothes rather than ceremonial robes.",
			"Uses copper containment instruments and keeps precise notes.",
		],
		prompt:
			"Porcelain-masked woman ritual engineer in a damp technical laboratory, with practical reinforced clothing, copper containment apparatus, and controlled methodical body language.",
	},
	{
		id: "npc-ind-004",
		slug: "old-man-crane",
		name: "Old Man Crane",
		title: "The White Heron",
		faction: "Independent",
		location: "Old Man Crane's Teahouse",
		cropLeft: 120,
		firstImpression:
			"He pours tea with the patience of someone who has survived every reason to hurry.",
		reputation:
			"A retired high-rank Ascendant whose advice is valued by settlements, field teams, and anyone wise enough to distrust easy victories.",
		visibleDetails: [
			"Silver hair, lined face, and a weathered pale-gray coat.",
			"Carries a plain dark walking staff with practiced familiarity.",
			"Dry humor surfaces most clearly when the situation is worst.",
		],
		prompt:
			"Elderly East Asian retired Ascendant in a rain-edge teahouse, holding tea beside a plain dark staff, with natural age, quiet authority, and a coat subtly suggesting a folded heron.",
	},
	{
		id: "npc-ind-005",
		slug: "professor-lun",
		name: "Professor Lun",
		title: "Relic Metaphysicist",
		faction: "Independent",
		location: "Annex Glass Sub-Basement",
		cropLeft: 70,
		firstImpression:
			"Fear has made him more precise, not less willing to approach the glass.",
		reputation:
			"An exacting academic consulted on Relics, Mana Veins, and evidence that remains inconvenient after repeated measurement.",
		visibleDetails: [
			"Simple glasses, layered field clothes, and a weatherproof research coat.",
			"Carries a compact vein sensor and rolled diagrams.",
			"Expresses alarm by improving the labeling and checking the result again.",
		],
		prompt:
			"Older East Asian metaphysicist in the wet Annex glass sub-basement, using a physically plausible Mana Vein sensor while fear is expressed through precise measurement.",
	},
	{
		id: "npc-ind-003",
		slug: "mika-the-kid",
		name: "Mika the Kid",
		title: "Prophetic Child",
		faction: "Independent",
		location: "Bellweather School",
		cropLeft: 260,
		firstImpression:
			"Mika watches adults decide whether to believe what has already been drawn.",
		reputation:
			"A quiet settlement child whose pictures sometimes resemble roads, bells, and visitors before they arrive.",
		visibleDetails: [
			"Practical repaired clothes, oversized rain boots, and untidy dark hair.",
			"Usually carries a charcoal drawing pad and one short piece of chalk.",
			"Calm, observant, and treated protectively by the school.",
		],
		prompt:
			"Respectful near-photoreal portrait of an ordinary ten-year-old child in a repaired Gloamreach classroom, holding a charcoal drawing pad amid roads-and-bells drawings, calm and observant.",
	},
	{
		id: "npc-anom-005",
		slug: "the-catalog",
		name: "The Catalog",
		title: "Living Memory Construct",
		faction: "Gloamreach-Touched",
		location: "Drowned Ledgerfen Archive",
		cropLeft: 250,
		firstImpression:
			"It regards every question as a record problem, then hesitates when the answer hurts.",
		reputation:
			"An intelligent archive entity known to exchange preserved knowledge for memories and physical records.",
		visibleDetails: [
			"Human-height form of dark translucent crystal and aged metal.",
			"Internal light traces stored records without displaying readable script.",
			"Moves carefully around waterlogged drawers and damaged memory cores.",
		],
		prompt:
			"Human-height nonhuman archive entity of layered smoked crystal, aged metal ribs, and fine filaments in a half-flooded subterranean record chamber, precise and newly sorrowful.",
	},
	{
		id: "npc-anom-002",
		slug: "the-watcher",
		name: "The Watcher",
		title: "Trial Guardian",
		faction: "Gloamreach-Touched",
		location: "Obsidian Spire",
		cropLeft: 250,
		firstImpression:
			"It waits with the unsettling courtesy of a law that expects you to understand the question.",
		reputation:
			"An ancient guardian of the Obsidian Spire that is said to test claimants through judgment rather than immediate violence.",
		visibleDetails: [
			"Three-meter form of suspended obsidian planes and aged-metal joints.",
			"Smooth hollow head aperture surrounded by broken concentric relic rings.",
			"One hand remains open in judgment while the other is held in restraint.",
		],
		prompt:
			"Tall decisively nonhuman trial guardian of suspended obsidian planes, mineral tendons, and broken relic rings on a storm-open Spire platform, designed as ancient law rather than armor.",
	},
];

const escapeHtml = (value) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const renderDossierHtml = (npc, portraitDataUri) => {
	const visibleItems = npc.visibleDetails
		.map((item) => `<li>${escapeHtml(item)}</li>`)
		.join("");
	const displayName = escapeHtml(npc.name).replaceAll("-", "&#8209;");
	const nameClass = npc.name.length > 20 ? "name long-name" : "name";

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
	* { box-sizing: border-box; }
	html, body { margin: 0; width: 1536px; height: 1024px; overflow: hidden; background: #050506; }
	body {
		color: #d8d4d2;
		font-family: Georgia, "Times New Roman", serif;
		-webkit-font-smoothing: antialiased;
	}
	.sheet {
		position: relative;
		width: 1536px;
		height: 1024px;
		overflow: hidden;
		background:
			radial-gradient(circle at 78% 42%, rgba(91, 57, 110, .12), transparent 34%),
			linear-gradient(115deg, #050506 0%, #08090b 42%, #020304 100%);
		border: 4px solid #191613;
		box-shadow: inset 0 0 0 1px #44392f, inset 0 0 90px rgba(0,0,0,.95);
	}
	.hero {
		position: absolute;
		inset: 22px 22px 200px 392px;
		width: calc(100% - 414px);
		height: calc(100% - 222px);
		object-fit: cover;
		object-position: center;
		filter: saturate(.92) contrast(1.04) brightness(.94);
		border: 1px solid #40362e;
	}
	.hero-shade {
		position: absolute;
		inset: 22px 22px 200px 392px;
		background:
			linear-gradient(90deg, rgba(4,4,5,.98) 0%, rgba(4,4,5,.72) 12%, transparent 34%),
			linear-gradient(0deg, rgba(3,3,4,.92) 0%, transparent 28%);
		pointer-events: none;
	}
	.rail {
		position: absolute;
		left: 22px;
		top: 22px;
		bottom: 200px;
		width: 370px;
		padding: 24px 26px;
		background: linear-gradient(180deg, rgba(5,5,6,.98), rgba(6,6,8,.94));
		border: 1px solid #40362e;
		z-index: 2;
	}
	.name {
		color: #c49ad6;
		font-size: 43px;
		line-height: 1.02;
		letter-spacing: 1.2px;
		font-variant: small-caps;
		text-transform: uppercase;
		text-shadow: 0 0 20px rgba(157,86,187,.18);
	}
	.long-name { font-size: 38px; }
	.title {
		margin-top: 10px;
		color: #9d6ab6;
		font-size: 16px;
		letter-spacing: 2px;
		text-transform: uppercase;
	}
	.rule {
		height: 1px;
		margin: 22px 0;
		background: linear-gradient(90deg, #8b4ca6, #40362e 72%, transparent);
	}
	.label {
		margin-top: 18px;
		color: #aa78be;
		font-size: 14px;
		letter-spacing: 1.7px;
		text-transform: uppercase;
	}
	.value {
		margin-top: 5px;
		color: #d4cfcb;
		font-size: 17px;
		line-height: 1.36;
	}
	.quote {
		position: absolute;
		left: 424px;
		right: 58px;
		bottom: 224px;
		z-index: 2;
		color: #e0dbd8;
		font-size: 23px;
		line-height: 1.35;
		font-style: italic;
		text-shadow: 0 2px 9px #000;
	}
	.bottom {
		position: absolute;
		left: 22px;
		right: 22px;
		bottom: 22px;
		height: 164px;
		display: grid;
		grid-template-columns: 1.45fr 1fr;
		gap: 12px;
		z-index: 3;
	}
	.panel {
		position: relative;
		padding: 20px 24px;
		background: rgba(5,5,6,.97);
		border: 1px solid #40362e;
		overflow: hidden;
	}
	.panel::after {
		content: "";
		position: absolute;
		right: -40px;
		bottom: -70px;
		width: 180px;
		height: 180px;
		border: 1px solid rgba(151,91,175,.18);
		border-radius: 50%;
		box-shadow: 0 0 0 12px rgba(151,91,175,.025), 0 0 0 30px rgba(151,91,175,.018);
	}
	.panel-title {
		color: #aa78be;
		font-size: 15px;
		letter-spacing: 1.7px;
		text-transform: uppercase;
		margin-bottom: 9px;
	}
	ul {
		margin: 0;
		padding-left: 20px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 26px;
		row-gap: 7px;
		font-size: 16px;
		line-height: 1.28;
	}
	.reputation {
		font-size: 16px;
		line-height: 1.42;
		max-width: 95%;
	}
	.corner {
		position: absolute;
		width: 48px;
		height: 48px;
		border-color: #5a493d;
		z-index: 5;
	}
	.tl { top: 9px; left: 9px; border-top: 1px solid; border-left: 1px solid; }
	.tr { top: 9px; right: 9px; border-top: 1px solid; border-right: 1px solid; }
	.bl { bottom: 9px; left: 9px; border-bottom: 1px solid; border-left: 1px solid; }
	.br { bottom: 9px; right: 9px; border-bottom: 1px solid; border-right: 1px solid; }
	.mark {
		position: absolute;
		right: 52px;
		top: 50px;
		z-index: 4;
		color: rgba(189,132,211,.7);
		font-size: 12px;
		letter-spacing: 2px;
		text-transform: uppercase;
		text-shadow: 0 2px 8px #000;
	}
</style>
</head>
<body>
<div class="sheet">
	<img class="hero" src="${portraitDataUri}" alt="">
	<div class="hero-shade"></div>
	<div class="rail">
		<div class="${nameClass}">${displayName}</div>
		<div class="title">${escapeHtml(npc.title)}</div>
		<div class="rule"></div>
		<div class="label">Faction</div>
		<div class="value">${escapeHtml(npc.faction)}</div>
		<div class="label">Known Location</div>
		<div class="value">${escapeHtml(npc.location)}</div>
		<div class="label">Public Profile</div>
		<div class="value">Player-facing visual record. Observed details only.</div>
	</div>
	<div class="mark">Run Quiet // Visual Record</div>
	<div class="quote">"${escapeHtml(npc.firstImpression)}"</div>
	<div class="bottom">
		<section class="panel">
			<div class="panel-title">Visible Details</div>
			<ul>${visibleItems}</ul>
		</section>
		<section class="panel">
			<div class="panel-title">Known Reputation</div>
			<div class="reputation">${escapeHtml(npc.reputation)}</div>
		</section>
	</div>
	<div class="corner tl"></div><div class="corner tr"></div>
	<div class="corner bl"></div><div class="corner br"></div>
</div>
</body>
</html>`;
};

async function addPdfOutlines(pdfDoc, pages) {
	const { context, catalog } = pdfDoc;
	const outlinesRef = context.nextRef();
	const itemRefs = npcs.map(() => context.nextRef());

	context.assign(
		outlinesRef,
		context.obj({
			Type: PDFName.of("Outlines"),
			First: itemRefs[0],
			Last: itemRefs[itemRefs.length - 1],
			Count: itemRefs.length,
		}),
	);

	itemRefs.forEach((ref, index) => {
		const item = {
			Title: PDFHexString.fromText(npcs[index].name),
			Parent: outlinesRef,
			Dest: context.obj([pages[index].ref, PDFName.of("Fit")]),
		};
		if (index > 0) item.Prev = itemRefs[index - 1];
		if (index < itemRefs.length - 1) item.Next = itemRefs[index + 1];
		context.assign(ref, context.obj(item));
	});

	catalog.set(PDFName.of("Outlines"), outlinesRef);
	catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
}

await fs.mkdir(cropDir, { recursive: true });
await fs.mkdir(dossierDir, { recursive: true });
await fs.mkdir(appDir, { recursive: true });

for (const npc of npcs) {
	const portraitPath = path.join(portraitDir, `${npc.slug}.png`);
	const normalizedPath = path.join(portraitDir, `${npc.slug}.normalized.png`);
	await sharp(portraitPath)
		.resize(1536, 1024, { fit: "cover", position: "centre" })
		.png({ compressionLevel: 9 })
		.toFile(normalizedPath);
	await fs.rename(normalizedPath, portraitPath);

	const cropPath = path.join(cropDir, `${npc.slug}.png`);
	await sharp(portraitPath)
		.extract({ left: npc.cropLeft, top: 0, width: 1024, height: 1024 })
		.png({ compressionLevel: 9 })
		.toFile(cropPath);

	await sharp(cropPath)
		.webp({ quality: 92, smartSubsample: true })
		.toFile(path.join(appDir, `${npc.slug}.webp`));
}

const browser = await chromium.launch({ headless: true });
try {
	const page = await browser.newPage({
		viewport: { width: 1536, height: 1024 },
		deviceScaleFactor: 1,
	});

	for (const npc of npcs) {
		const portraitPath = path.join(portraitDir, `${npc.slug}.png`);
		const portraitData = await fs.readFile(portraitPath);
		const dataUri = `data:image/png;base64,${portraitData.toString("base64")}`;
		await page.setContent(renderDossierHtml(npc, dataUri), {
			waitUntil: "load",
		});
		await page.screenshot({
			path: path.join(dossierDir, `${npc.slug}-dossier.png`),
			type: "png",
		});
	}
} finally {
	await browser.close();
}

const pdfDoc = await PDFDocument.create();
pdfDoc.setTitle("Run Quiet - Player-Facing NPC Dossiers");
pdfDoc.setAuthor("Rift Ascendant");
pdfDoc.setSubject("The Shadow of the Regent tabletop NPC visual records");
pdfDoc.setKeywords(["Run Quiet", "Gloamreach", "NPC", "tabletop"]);

const pdfPages = [];
for (const npc of npcs) {
	const dossierBytes = await fs.readFile(
		path.join(dossierDir, `${npc.slug}-dossier.png`),
	);
	const image = await pdfDoc.embedPng(dossierBytes);
	const page = pdfDoc.addPage([1152, 768]);
	page.drawImage(image, { x: 0, y: 0, width: 1152, height: 768 });
	pdfPages.push(page);
}
await addPdfOutlines(pdfDoc, pdfPages);
await fs.writeFile(
	path.join(exportDir, "run-quiet-npc-dossiers.pdf"),
	await pdfDoc.save(),
);

const manifest = {
	title: "Run Quiet NPC Portrait Set",
	generatedWith: "Built-in image generation tool",
	styleReferences: [
		"Environmental Presence.png",
		"The Caller.png",
		"The Hallowed.png",
		"The Quiet.png",
		"The Taking.png",
		"The Worn (Player facing).png",
		"The Worn.png",
		"The Wrong Shape.png",
		"True Form Cinematic.png",
	],
	sharedPrompt,
	npcs: npcs.map(({ cropLeft, visibleDetails, ...npc }) => ({
		...npc,
		finalPrompt: `${sharedPrompt} ${npc.prompt}`,
		portrait: `portraits/${npc.slug}.png`,
		appCrop: `app-crops/${npc.slug}.png`,
		dossier: `dossiers/${npc.slug}-dossier.png`,
	})),
};
await fs.writeFile(
	path.join(exportDir, "prompt-manifest.json"),
	`${JSON.stringify(manifest, null, 2)}\n`,
	"utf8",
);

const readme = `# Run Quiet NPC Table Pack

Player-facing visual assets for The Shadow of the Regent.

## Contents

- \`portraits/\`: 1536x1024 text-free cinematic portraits.
- \`app-crops/\`: 1024x1024 portrait crops.
- \`dossiers/\`: 1536x1024 player-facing dossier sheets.
- \`run-quiet-npc-dossiers.pdf\`: bookmarked dossier collection.
- \`prompt-manifest.json\`: style lock and character prompt record.

The legacy Regent's Court is intentionally excluded.
`;
await fs.writeFile(path.join(exportDir, "README.md"), readme, "utf8");

console.log(
	`Built ${npcs.length} portrait packages in ${pathToFileURL(exportDir).href}`,
);
