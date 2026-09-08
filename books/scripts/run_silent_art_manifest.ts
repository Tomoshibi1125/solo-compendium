export type RunSilentArtCategory =
	| "map"
	| "plate"
	| "portrait"
	| "threat"
	| "prop"
	| "handout"
	| "vehicle";

export type RunSilentArtStatus =
	| "planned"
	| "selected-existing"
	| "selected-generated"
	| "needs-review";

export interface RunSilentArtSlot {
	slug: string;
	category: RunSilentArtCategory;
	title: string;
	placement: string;
	promptSeed: string;
	status: RunSilentArtStatus;
	selectedPath?: string;
	reusePolicy?: string;
}

export const runSilentMinimumArtTarget = 70;

export const runSilentArtSlots: RunSilentArtSlot[] = [
	{
		slug: "cover-run-silent",
		category: "plate",
		title: "Run Silent Cover",
		placement: "Cover and front matter",
		promptSeed: "A premium Rift Ascendant horror campaign cover: material-world threshold, grey Gloamreach beyond, operators with AFA light, vast unseen silence.",
		status: "selected-existing",
		selectedPath: "/ui-art/run_silent_cover.png",
		reusePolicy: "Replace only if generated cover is clearer and more iconic.",
	},
	{
		slug: "gloamreach-regional-map",
		category: "map",
		title: "The Gloamreach Regional Map",
		placement: "Region guide opener",
		promptSeed: "Professional TTRPG regional map of grey moors, drowned fields, dead industry, quiet lit windows, old roads, warded settlements, Obsidian Spire, Bastion Golemfall, Ledgerfen, Fungal Depths, Orchard, Counting-House, Sunken Tunnels, Awoko Sanctum, sourceless grey light.",
		status: "planned",
	},
	{
		slug: "bureau-domain-response-annex-map",
		category: "map",
		title: "Bureau Domain Response Annex Map",
		placement: "Starter arc priority: First Entry and Annex chapters",
		promptSeed: "Modern material-world Bureau response site map for the required First Entry starter arc: floodlights, generators, coffee, antiseptic, ozone, concrete barriers, scanners, medical tents, AFA relay mast, wounded civilians behind plastic sheeting.",
		status: "planned",
	},
	{
		slug: "rift-threshold-map",
		category: "map",
		title: "Rift Threshold Map",
		placement: "Starter arc priority: First Entry crossing",
		promptSeed: "Tactical TTRPG map of a newly manifested Rift Threshold at a Bureau cordon: stable vehicle-capable aperture, cold seam, scanner lanes, relay spike, cordon lights, material world foreground.",
		status: "selected-existing",
		selectedPath: "/ui-art/rift-gate-hero.png",
		reusePolicy: "Use as temporary chapter art; generate a tactical map before final.",
	},
	{
		slug: "survey-layer-first-road-map",
		category: "map",
		title: "Survey Layer and First Road Map",
		placement: "Starter arc priority: Survey Layer / Black Road / First Road",
		promptSeed: "Tactical starter-map for Run Silent: the breathable vehicle-capable Survey Layer, Bureau relay spike, packed black road bordered by grass bending without wind, AFA map boundary failing, first impossible fork, no full regional sandbox yet.",
		status: "planned",
	},
	{
		slug: "first-safehold-wardline-map",
		category: "map",
		title: "First Safehold or Wardline Map",
		placement: "Starter arc priority: first shelter before sandbox opens",
		promptSeed: "Small tactical map of the first Gloamreach safehold or wardline: shuttered native shelter, chalk wardmarks, quiet threshold, vehicle or mounts outside, the dark waiting beyond the line, no material-world architecture.",
		status: "planned",
	},
	{
		slug: "hollow-way-map",
		category: "map",
		title: "The Hollow Way Map",
		placement: "Major locations",
		promptSeed: "Vast throat of old stone, ribbed with cold Essence-light like swallowing, walls carved with fresh names, descending intake-road, native stonework, no Earth architecture.",
		status: "planned",
	},
	{
		slug: "drowned-ledgerfen-map",
		category: "map",
		title: "The Drowned Ledgerfen Map",
		placement: "Major locations",
		promptSeed: "Waterlogged archive-fen map: black water, intake desks, casualty ledgers, fountain pen scratch motifs, drowned stacks, native repository architecture, floodlight reflections swallowed by dark water.",
		status: "planned",
	},
	{
		slug: "fungal-depths-map",
		category: "map",
		title: "The Fungal Depths Map",
		placement: "Major locations",
		promptSeed: "Warm wet caverns with bioluminescent rows, pale fungus shelves, memory pods the size of people, mycelium archive wards, native underways, no modern hospital imagery.",
		status: "planned",
	},
	{
		slug: "remembering-orchard-map",
		category: "map",
		title: "The Remembering Orchard Map",
		placement: "Major locations",
		promptSeed: "Black glassy resonance-stalk orchard, humming fruit with heartbeat light, ration-tag gates, memory-core rows, grey sky, ward paths and harvest hazards.",
		status: "planned",
	},
	{
		slug: "ashen-counting-house-map",
		category: "map",
		title: "The Ashen Counting-House Map",
		placement: "Major locations",
		promptSeed: "Tiered hall of black wood and brass burning gently forever, iron keeping-box rows, fire-robed figures, native accounts hall layout, warm ash light.",
		status: "planned",
	},
	{
		slug: "sunken-tunnels-map",
		category: "map",
		title: "The Sunken Tunnels Map",
		placement: "Major locations",
		promptSeed: "Drowned under-road map: flooded native warrens, water conduits, burial galleries, black cold water full of voices, every passage sloping downward.",
		status: "planned",
	},
	{
		slug: "bastion-golemfall-map",
		category: "map",
		title: "Bastion Golemfall Map",
		placement: "Major locations",
		promptSeed: "Broken jaw wall against grey sky, empty armor at every post, native wall-warden harness rows, fallen defensive fortress, oath-vault approach.",
		status: "planned",
	},
	{
		slug: "obsidian-spire-map",
		category: "map",
		title: "The Obsidian Spire Map",
		placement: "Major locations and endgame",
		promptSeed: "Glass-black stone field and a single shard like a tooth, delayed reflections, Essence-light veins under stone, trial chambers and final ascent route.",
		status: "selected-existing",
		selectedPath: "/ui-art/the_obsidian_spire.png",
		reusePolicy: "Keep as plate unless a cleaner map candidate is generated.",
	},
	{
		slug: "awoko-sanctum-map",
		category: "map",
		title: "Awoko Sanctum Map",
		placement: "Major locations and faction play",
		promptSeed: "Warm candlelit native sanctum, clean linen, thousands of hanging names, circular chamber with seven grief-tallow candle stations, ritual routes.",
		status: "planned",
	},
	{
		slug: "vermillion-outpost-map",
		category: "map",
		title: "Vermillion Outpost Map",
		placement: "Region guide and markets",
		promptSeed: "Fortified native warren of stalls, bunks, back rooms, red lamps, banners, hand-painted stars, tarps, field stoves, core scales, Gloamreach-native population.",
		status: "planned",
	},
	{
		slug: "hamlet-never-says-no-map",
		category: "map",
		title: "The Hamlet That Never Says No Map",
		placement: "Warded communities",
		promptSeed: "Warded native village under grey light: lamplight, woodsmoke, wardmarks over every door, empty chair at every table, quiet survival routes.",
		status: "planned",
	},
	{
		slug: "bellweather-school-map",
		category: "map",
		title: "Bellweather School Map",
		placement: "Warded communities",
		promptSeed: "Native schoolhouse converted to shelter, chalk wardmarks, bedrolls, quiet bells, protected children implied only by empty desks and care objects.",
		status: "planned",
	},
	{
		slug: "old-man-crane-teahouse-map",
		category: "map",
		title: "Old Man Crane's Teahouse Map",
		placement: "Warded communities",
		promptSeed: "Quiet teahouse that appears at crossroads, native architecture, warded threshold, steam, old road signs, impossible exterior geometry.",
		status: "planned",
	},
	{
		slug: "empty-mill-rendering-yards-map",
		category: "map",
		title: "Empty Mill Village and Rendering-Yards Map",
		placement: "Warded communities",
		promptSeed: "Native industry under grey light: mills, workhouses, rendering-yards, food left on tables, locked barns, silent production routes.",
		status: "planned",
	},
	{
		slug: "old-roads-predator-woods-map",
		category: "map",
		title: "Old Roads and Predator Woods Map",
		placement: "Travel chapter",
		promptSeed: "Packed black road, grass bending without wind, wrong milestones, predator woods, repeated road signs, name scratches on stone.",
		status: "planned",
	},
	{
		slug: "rusted-hull-node-map",
		category: "map",
		title: "The Rusted Hull Node Map",
		placement: "Mana vein network",
		promptSeed: "Dry-docked ship half-buried in black soil far from any sea, mana vein pulsing beneath keel, native salvage approaches.",
		status: "planned",
	},
	{
		slug: "silent-depot-node-map",
		category: "map",
		title: "The Silent Depot Node Map",
		placement: "Mana vein network",
		promptSeed: "Cavernous native sorting hall where people gathered what veins carried up from below, silent conveyors, vein-lit platforms.",
		status: "planned",
	},
	{
		slug: "glass-sub-basement-node-map",
		category: "map",
		title: "The Glass Sub-Basement Node Map",
		placement: "Mana vein network",
		promptSeed: "Glass cylinder containing a pulsing Essence channel below the Counting-House, observation rings, cracked native engineering.",
		status: "planned",
	},
	{
		slug: "final-crossing-route-map",
		category: "map",
		title: "The Final Crossing Route Map",
		placement: "Endgame",
		promptSeed: "Deep Gloamreach route back to the sealed Threshold, old roads, worn dead pressure zones, quiet-road alternatives, wardline refuges.",
		status: "planned",
	},
	{
		slug: "gloamreach-faction-overlay-map",
		category: "map",
		title: "Gloamreach Faction and Travel Overlay",
		placement: "Region guide reference",
		promptSeed: "Stylized campaign overlay showing native communities, Vermillion routes, Awoko influence, Bureau incursion, Quiet pressure, mana veins, and safe roads.",
		status: "planned",
	},
	{
		slug: "first-entry-plate",
		category: "plate",
		title: "First Entry Plate",
		placement: "Starter arc priority: First Entry chapter",
		promptSeed: "Licensed low-rank Ascendants at a Bureau cordon, AFA devices syncing, rover and mounts staged, Threshold calm beyond floodlights.",
		status: "planned",
	},
	{
		slug: "map-does-not-end-plate",
		category: "plate",
		title: "The Map Does Not End Plate",
		placement: "Starter arc priority: The Map Does Not End chapter",
		promptSeed: "AFA map line extending past a bounded survey layer, road continuing impossibly under grey sky, team vehicle stopped in silence.",
		status: "planned",
	},
	{
		slug: "run-silent-plate",
		category: "plate",
		title: "Run Silent Plate",
		placement: "Run Silent pressure chapter",
		promptSeed: "Operators extinguishing lights beside a quiet engine while the dark listens, sound discipline, no visible monster, cold pressure.",
		status: "planned",
	},
	{
		slug: "first-native-contact-plate",
		category: "plate",
		title: "First Native Contact Plate",
		placement: "First native contact chapter",
		promptSeed: "Rift Ascendant team meeting Gloamreach natives at a wardline, cautious hand signals, no Earth architecture inside the Domain.",
		status: "planned",
	},
	{
		slug: "quiet-dossier-plate",
		category: "plate",
		title: "The Quiet Dossier Plate",
		placement: "Lore alignment",
		promptSeed: "Warden-only dossier mood plate: cold empty dark, pressure, absent sound, Bureau notes, no full reveal of the Quiet.",
		status: "planned",
	},
	{
		slug: "gloamreach-region-plate",
		category: "plate",
		title: "Gloamreach Region Plate",
		placement: "Region guide",
		promptSeed: "Country-scale Gloamreach landscape: grey moors, distant Spire, dead industry, lit safehold windows, no sun.",
		status: "planned",
	},
	{
		slug: "hollow-way-plate",
		category: "plate",
		title: "Hollow Way Plate",
		placement: "Major locations",
		promptSeed: "Descending stone throat with Essence ribs and names carved fresh, first major Gloamreach intake scene.",
		status: "planned",
	},
	{
		slug: "ledgerfen-plate",
		category: "plate",
		title: "Ledgerfen Plate",
		placement: "Major locations",
		promptSeed: "Drowned archive desk with casualty report, black water reflecting nothing, native stone and ink horror.",
		status: "planned",
	},
	{
		slug: "bastion-golemfall-plate",
		category: "plate",
		title: "Bastion Golemfall Plate",
		placement: "Major locations",
		promptSeed: "Empty armor still standing watch along a broken wall under grey sky, oathbound defensive ruin.",
		status: "planned",
	},
	{
		slug: "obsidian-spire-plate",
		category: "plate",
		title: "Obsidian Spire Plate",
		placement: "Major locations and endgame",
		promptSeed: "The Obsidian Spire reflecting the party one heartbeat late, Essence veins in black glass stone.",
		status: "selected-existing",
		selectedPath: "/ui-art/the_obsidian_spire.png",
		reusePolicy: "Replace only with a stronger generated Spire plate.",
	},
	{
		slug: "means-to-end-it-plate",
		category: "plate",
		title: "The Means to End It Plate",
		placement: "Relics and Means chapter",
		promptSeed: "Relic, native witness, truth ledger, route home, and accepted cost arranged as a grim campaign altar.",
		status: "planned",
	},
	{
		slug: "hollow-mother-plate",
		category: "plate",
		title: "The Hollow Mother Plate",
		placement: "Awoko Sanctum",
		promptSeed: "Cult hierophant in warm candlelight and hanging names, grief-tallow ritual atmosphere, predatory patience.",
		status: "selected-existing",
		selectedPath: "/ui-art/hollow_mother.png",
		reusePolicy: "Keep if portrait accuracy remains strong after review.",
	},
	{
		slug: "final-crossing-plate",
		category: "plate",
		title: "Final Crossing Plate",
		placement: "Endgame",
		promptSeed: "Party crossing the deepest dark toward a sealed Threshold, worn dead behind, AFA light failing, hard-earned route home.",
		status: "planned",
	},
	{
		slug: "stewardship-plate",
		category: "plate",
		title: "Gloamreach Stewardship Plate",
		placement: "Optional stewardship appendix",
		promptSeed: "Surviving Gloamreach communities and Ascendants around a stabilized Threshold charter, native sovereignty, Bureau pressure, hopeful grey light.",
		status: "planned",
	},
	{
		slug: "portrait-lin",
		category: "portrait",
		title: "Quartermaster Lin Mei-hua",
		placement: "Recruitable allies",
		promptSeed: "Cordon supply officer portrait, practical Bureau quartermaster, tired competence, requisition tablets, field crates.",
		status: "planned",
	},
	{
		slug: "portrait-reyes",
		category: "portrait",
		title: "Comms Officer Reyes",
		placement: "Recruitable allies",
		promptSeed: "Signal specialist with headset, corrupted AFA screens, relay truck glow, alert and worried.",
		status: "planned",
	},
	{
		slug: "portrait-park",
		category: "portrait",
		title: "Park",
		placement: "Bureau command and final support",
		promptSeed: "Bureau officer carrying command guilt, crisp uniform, breach light on face, hard choice ahead.",
		status: "planned",
	},
	{
		slug: "portrait-blackwood",
		category: "portrait",
		title: "Blackwood",
		placement: "Bureau secrets and side quests",
		promptSeed: "Classified mission operative, sealed evidence case, Bureau shadow politics, restrained noir lighting.",
		status: "planned",
	},
	{
		slug: "portrait-mother-rust",
		category: "portrait",
		title: "Mother Rust",
		placement: "Warded communities",
		promptSeed: "Gloamreach healer and shelter-keeper, rusted tools, native clinic, hard mercy, not material-world hospital.",
		status: "planned",
	},
	{
		slug: "portrait-sister-veil",
		category: "portrait",
		title: "Sister Veil",
		placement: "Awoko defector path",
		promptSeed: "Awoko cultist beginning to doubt, candlelit name threads, grief robe, honesty under fear.",
		status: "planned",
	},
	{
		slug: "portrait-hollow-mother",
		category: "portrait",
		title: "The Hollow Mother",
		placement: "Awoko faction appendix",
		promptSeed: "Cult hierophant who wants to be remade into a hunter, clean linen, warm light, predatory compassion.",
		status: "selected-existing",
		selectedPath: "/ui-art/hollow_mother.png",
		reusePolicy: "Replace if generated portrait better matches the PDF.",
	},
	{
		slug: "portrait-rex",
		category: "portrait",
		title: "Rex",
		placement: "Recruitable allies",
		promptSeed: "Survivor companion tied to Hollow Way beacon retrieval, scarred field gear, cautious trust.",
		status: "planned",
	},
	{
		slug: "portrait-jax",
		category: "portrait",
		title: "Jax the Runner",
		placement: "Recruitable allies",
		promptSeed: "Road courier of the Gloamreach, lean and fast, native road charms, knows routes that should not exist.",
		status: "planned",
	},
	{
		slug: "portrait-mama-chen",
		category: "portrait",
		title: "Mama Chen",
		placement: "Civilian convoy and shelters",
		promptSeed: "Community organizer, final-operation support, warm stubborn courage, safehold lamplight.",
		status: "planned",
	},
	{
		slug: "portrait-old-man-crane",
		category: "portrait",
		title: "Old Man Crane",
		placement: "Teahouse and sealing lore",
		promptSeed: "Old teahouse keeper with sealing lore, quiet smile, tea steam, impossible crossroads outside.",
		status: "planned",
	},
	{
		slug: "portrait-tomas-bell",
		category: "portrait",
		title: "Tomas Bell",
		placement: "Warded communities",
		promptSeed: "Bell-ringer with warning codes, hand on old bell rope, wardline responsibility, tired eyes.",
		status: "planned",
	},
	{
		slug: "portrait-professor-lun",
		category: "portrait",
		title: "Professor Lun",
		placement: "Mana vein network",
		promptSeed: "Researcher mapping where the Quiet goes deaf, portable sensors, mana vein diagrams, anxious brilliance.",
		status: "planned",
	},
	{
		slug: "portrait-lord-sered",
		category: "portrait",
		title: "Lord Sered",
		placement: "Deep Gloamreach and trials",
		promptSeed: "The First Claimed, noble and wrong, Threshold light, safe-path authority, predatory old-world grace.",
		status: "planned",
	},
	{
		slug: "threat-quiet",
		category: "threat",
		title: "The Quiet",
		placement: "Appendix I",
		promptSeed: "Apex predator shown mostly by absence: impossible silence, extinguished light, distorted familiar face in darkness, no full monster reveal.",
		status: "planned",
	},
	{
		slug: "threat-worn",
		category: "threat",
		title: "The Worn",
		placement: "Appendix I",
		promptSeed: "Still roadside figure worn by the dark, wrong posture, half-remembered face, Gloamreach road.",
		status: "planned",
	},
	{
		slug: "threat-caller",
		category: "threat",
		title: "The Caller",
		placement: "Appendix I",
		promptSeed: "Worn dead at edge of a safe place calling in a lost voice, wardline boundary, patient lure.",
		status: "planned",
	},
	{
		slug: "threat-wrong-shape",
		category: "threat",
		title: "The Wrong Shape",
		placement: "Appendix I",
		promptSeed: "Trusted face walking beside the party, one deliberate detail wrong, close horror, no gore.",
		status: "planned",
	},
	{
		slug: "threat-hollowed",
		category: "threat",
		title: "The Hollowed",
		placement: "Appendix I",
		promptSeed: "Apex-fragment worn dead, silence and massed shadow, light and quiet as weaknesses, high-tier threat.",
		status: "planned",
	},
	{
		slug: "relic-hush-blade",
		category: "threat",
		title: "The Hush Blade",
		placement: "Relics and Means",
		promptSeed: "Campaign relic weapon that cuts sound, dark metal, quiet edge, Rift Ascendant table prop.",
		status: "selected-existing",
		selectedPath: "/ui-art/the_hush_blade.png",
		reusePolicy: "Keep if generated prop does not beat it.",
	},
	{
		slug: "prop-faded-family-photo",
		category: "prop",
		title: "The Faded Family Photo",
		placement: "Campaign props",
		promptSeed: "Old family photo with one face worn down to blank paper, emotionally important prop, no readable real-world text.",
		status: "planned",
	},
	{
		slug: "prop-name-ledger",
		category: "prop",
		title: "The Name Ledger",
		placement: "Campaign props",
		promptSeed: "Drowned Ledgerfen book of names, wet ink, pages that know too much, native ledger design.",
		status: "planned",
	},
	{
		slug: "prop-obsidian-prism",
		category: "prop",
		title: "Obsidian Prism",
		placement: "Treasure and Relics",
		promptSeed: "Black glass prism with delayed reflection and Essence veins, campaign reward prop.",
		status: "planned",
	},
	{
		slug: "prop-bureau-field-kit",
		category: "prop",
		title: "Bureau Field Kit",
		placement: "Treasure and Relics",
		promptSeed: "Rift Ascendant Bureau field kit: AFA tags, containment sleeves, glow rods, sample vials, emergency seals.",
		status: "planned",
	},
	{
		slug: "handout-emergency-clearance",
		category: "handout",
		title: "Emergency Clearance",
		placement: "Appendix G",
		promptSeed: "In-universe Bureau emergency clearance handout for S-rank escalation, official form design, readable title only.",
		status: "planned",
	},
	{
		slug: "handout-relay-spike-packet",
		category: "handout",
		title: "Relay Spike Mission Packet",
		placement: "Starter arc priority: First Entry player handout",
		promptSeed: "Player-facing Bureau relay spike mission packet: First Entry objective card, stable Threshold note, relay placement checklist, AFA sync header, clean official design, readable title only.",
		status: "planned",
	},
	{
		slug: "handout-annex-last-order",
		category: "handout",
		title: "Bureau Annex Last Order",
		placement: "Appendix G",
		promptSeed: "Bureau last order document, command stamp, unsent addendum mood, no small text reliance.",
		status: "planned",
	},
	{
		slug: "handout-old-power-consent",
		category: "handout",
		title: "Old Power Consent Form",
		placement: "Appendix G",
		promptSeed: "Ancient pact document translated through Bureau form language, consent and cost imagery, Rift legal horror.",
		status: "planned",
	},
	{
		slug: "handout-bargain-record",
		category: "handout",
		title: "Old Power Bargain Record",
		placement: "Appendix G",
		promptSeed: "Bargain ledger handout, oath marks, native and Bureau annotations, choices and costs.",
		status: "planned",
	},
	{
		slug: "handout-safe-passage-token",
		category: "handout",
		title: "Safe-Passage Token",
		placement: "Appendix G",
		promptSeed: "Small native safe-passage token with ward mark, string, worn metal or blackwood, player prop.",
		status: "planned",
	},
	{
		slug: "handout-final-crossing-routes",
		category: "handout",
		title: "Final Crossing Routes",
		placement: "Appendix G",
		promptSeed: "Player-facing route card for final crossing, branching paths, hazards, no exact spoilers.",
		status: "planned",
	},
	{
		slug: "handout-awoko-pamphlet",
		category: "handout",
		title: "Awoko Comfort Pamphlet",
		placement: "Appendix G",
		promptSeed: "Cult comfort pamphlet with warm design and unsettling blank spaces, grief recruitment tone.",
		status: "planned",
	},
	{
		slug: "handout-awoko-letter",
		category: "handout",
		title: "Awoko Herald's Letter",
		placement: "Appendix G",
		promptSeed: "Handwritten cult letter, candle stains, hanging-name motif, readable title only.",
		status: "planned",
	},
	{
		slug: "handout-casualty-ledger",
		category: "handout",
		title: "Casualty Ledger Page",
		placement: "Ledgerfen and props",
		promptSeed: "Wet casualty ledger page with names implied by marks, not readable rows, dread and official accounting.",
		status: "planned",
	},
	{
		slug: "handout-corrupted-afa-still",
		category: "handout",
		title: "Corrupted AFA Still",
		placement: "Starter arc priority: AFA first contradiction",
		promptSeed: "Glitched AFA interface still from the required First Entry starter arc: impossible map distance, return marker still visible, relay spike green, clean danger warnings, no tiny text dependence.",
		status: "planned",
	},
	{
		slug: "vehicle-bureau-rover",
		category: "vehicle",
		title: "Bureau Light Survey Rover",
		placement: "Requisition chapter",
		promptSeed: "Bureau light survey rover, eight-seat field vehicle, AFA relay mast, sample lockers, mud and floodlight reflections.",
		status: "selected-existing",
		selectedPath: "/ui-art/bureau_light_survey_rover.png",
		reusePolicy: "Current strong asset; replace only with a clearer production diagram.",
	},
	{
		slug: "vehicle-loadout-diagram",
		category: "vehicle",
		title: "Transport Loadout Diagram",
		placement: "Requisition chapter",
		promptSeed: "Clean print diagram of party transport loadout: seats, relay, cargo, sample control, medical station, drone cradle.",
		status: "planned",
	},
	{
		slug: "vehicle-mount-tack-diagram",
		category: "vehicle",
		title: "Mount Tack Diagram",
		placement: "Requisition chapter",
		promptSeed: "Print diagram of Gloamreach-ready mount tack: ward tags, cargo saddle, calm hood, emergency litter.",
		status: "planned",
	},
	{
		slug: "vehicle-condition-track-visual",
		category: "vehicle",
		title: "Vehicle Condition Track Visual",
		placement: "Requisition chapter",
		promptSeed: "Readable visual track for Ready, Stressed, Damaged, Crippled, Lost with subtle rover silhouettes.",
		status: "planned",
	},
	{
		slug: "vehicle-field-repair-kit",
		category: "vehicle",
		title: "Field Repair Kit",
		placement: "Field engineering",
		promptSeed: "Rift Ascendant field repair kit with patch plates, compact welder, spare filters, Essence-shielded tools.",
		status: "planned",
	},
	{
		slug: "vehicle-hybrid-expedition-scene",
		category: "vehicle",
		title: "Hybrid Vehicle and Mount Expedition Scene",
		placement: "Field engineering",
		promptSeed: "Rover and native pack mounts moving quietly through Gloamreach road, careful logistics, no battle chaos.",
		status: "planned",
	},
];

export function runSilentSelectedArtSlots(): RunSilentArtSlot[] {
	return runSilentArtSlots.filter((slot) => Boolean(slot.selectedPath));
}

export function runSilentArtBySlug(slug: string): RunSilentArtSlot | undefined {
	return runSilentArtSlots.find((slot) => slot.slug === slug);
}

export function runSilentFigure(slug: string, caption?: string): string {
	const slot = runSilentArtBySlug(slug);
	if (!slot?.selectedPath) return "";
	const finalCaption = caption || slot.title;
	return `<figure class="campaign-art campaign-art--${slot.category}" data-art-slot="${slot.slug}">
	<img src="${slot.selectedPath}" alt="${escapeHtml(slot.title)}"/>
	<figcaption>${escapeHtml(finalCaption)}</figcaption>
</figure>`;
}

export function runSilentArtCoverageSummary(): string {
	const selected = runSilentSelectedArtSlots();
	const byCategory = runSilentArtSlots.reduce<Record<string, { total: number; selected: number }>>((acc, slot) => {
		const next = acc[slot.category] || { total: 0, selected: 0 };
		next.total += 1;
		if (slot.selectedPath) next.selected += 1;
		acc[slot.category] = next;
		return acc;
	}, {});
	const rows = Object.entries(byCategory)
		.map(
			([category, counts]) =>
				`<tr><td>${escapeHtml(category)}</td><td>${counts.selected}</td><td>${counts.total}</td></tr>`,
		)
		.join("");
	return `<aside class="campaign-note">
	<h3>Production Art Coverage</h3>
	<p>Final target: at least ${runSilentMinimumArtTarget} unique selected visuals. Current selected production slots: ${selected.length} of ${runSilentArtSlots.length}. Planned slots remain in the manifest until generated or approved.</p>
	<table class="campaign-table"><thead><tr><th>Category</th><th>Selected</th><th>Planned</th></tr></thead><tbody>${rows}</tbody></table>
</aside>`;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
