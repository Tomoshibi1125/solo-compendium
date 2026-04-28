// Shared library for loot rewriting:
// - FNV-1a deterministic hash for image assignment
// - Rift Ascendant theme constants
// - Archetype classifier
// - Template pools for description / lore / flavor

// =============================================================
// Hash & image assignment
// =============================================================

const IMAGE_POOL_SIZE = 1032;
const IMAGE_PATH_PREFIX = "/generated/compendium/items/";

export function fnv1a(str) {
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

// Deterministic 1-indexed image-pool slot.
export function assignImage(file, id, name, salt = "") {
	const key = `${file}::${id || name}::${salt}`;
	const h = fnv1a(key);
	const slot = (h % IMAGE_POOL_SIZE) + 1;
	const padded = String(slot).padStart(4, "0");
	return `${IMAGE_PATH_PREFIX}item-${padded}.webp`;
}

// Whitelist: images that look hand-picked (e.g. background-specific assets) and should not be overwritten.
export function isIntentionalImage(image) {
	if (!image || typeof image !== "string") return false;
	if (image.startsWith("/generated/compendium/backgrounds/")) return true;
	if (image.startsWith("/generated/compendium/jobs/")) return true;
	if (image.startsWith("/generated/compendium/regents/")) return true;
	if (image.startsWith("/generated/compendium/anomalies/")) return true;
	if (image.startsWith("/generated/compendium/locations/")) return true;
	if (image.startsWith("/generated/compendium/sandbox_assets/")) return true;
	// Specific themed art under backgrounds/items library (intentional art).
	if (image.startsWith("/generated/compendium/items/")) return true;
	return false;
}

// =============================================================
// Setting-correctness scrubbers
// =============================================================

export const TERMINOLOGY_FIXES = [
	// =========================================================
	// Sovereignty / monarch -> regent rename per canon.
	// =========================================================
	[/\bSovereignty Wars\b/g, "Regent Wars"],
	[/\bSovereign Wars\b/g, "Regent Wars"],
	[/\bsovereign-class entities\b/gi, "regent-class entities"],
	[/\bSovereign Era\b/g, "Regent Era"],
	[/\bsovereign era\b/g, "regent era"],
	[/\bSovereign of\b/g, "Regent of"],
	[/\bsovereign of\b/g, "regent of"],
	[/\bMonarch of\b/g, "Regent of"],
	[/\bmonarch of\b/g, "regent of"],
	[/\bMonarchs?\b/g, (m) => (m === "Monarchs" ? "Regents" : "Regent")],
	[/\bmonarchs?\b/g, (m) => (m === "monarchs" ? "regents" : "regent")],

	// =========================================================
	// Composite multi-word fixes (run before single-word substitutions).
	// =========================================================
	[/\bDemon\s+King(['']?s)?\b/g, "Regent of Dread$1"],
	[/\bDemon\s+Lord(['']?s)?\b/g, "Regent of Dread$1"],
	[/\bdemon\s+lord(['']?s)?\b/g, "regent of dread$1"],
	[/\bFiend\s+Lord(['']?s)?\b/g, "Regent of Dread$1"],
	[/\bfiend\s+lord(['']?s)?\b/g, "regent of dread$1"],
	[/\bStorm\s+King\b/g, "Storm-Class Regent"],
	[/\bDragon\s+Knight\b/g, "Anomaly Slayer"],
	[/\bDragon\s+Slayer\b/g, "Anomaly Slayer"],
	[/\bDragon[-\s]Scale\b/g, "Lattice-Scale"],
	[/\bdragon[-\s]scale\b/g, "lattice-scale"],
	[/\bDragon\s+Scale\s+Mail\b/g, "Lattice-Scale Mail"],
	[/\bScale\s+Lord\b/g, "Scale-Forged Regent"],
	[/\bShadow\s+Knight\s+Commander\b/g, "Shadow-Class Vanguard"],
	[/\bShadow\s+Knight\b/g, "Shadow-Class Hunter"],
	[/\bShadow\s+Archmage\b/g, "Shadow-Class Esper"],
	[/\bShadow\s+Warlock\b/g, "Shadow-Class Caster"],
	[/\bDark\s+Esper\b/g, "Umbral Esper"],
	[/\bShadow\s+Cultist\b/g, "Umbral Cultist"],
	[/\bShadow\s+Warlord\b/g, "Shadow-Class Warlord"],
	[/\bShadow\s+Mage\b/g, "Umbral Caster"],
	[/\bShadow\s+Walker\b/g, "Umbral Walker"],
	[/\bDark\s+Sage\b/g, "Umbral Sage"],
	[/\bDark\s+Herald\b/g, "Umbral Herald"],
	[/\bTempest\s+Knight\b/g, "Tempest-Class Hunter"],
	[/\bLightning\s+Warrior\b/g, "Storm-Class Hunter"],
	[/\bIce\s+Berserker\b/g, "Frost-Class Hunter"],
	[/\bWinter\s+Warrior\b/g, "Frost-Class Hunter"],
	[/\bFrost\s+Giant\s+King\b/g, "Frost-Class Regent"],
	[/\bDragon\s+Knight\b/g, "Anomaly Slayer"],
	[/\bWise\s+Emperor\b/g, "Regent of Wisdom"],
	[/\bOracle\s+Queen\b/g, "Regent-Oracle"],
	[/\bQueen\s+of\s+Shadows\b/g, "Regent of Shadows"],
	[/\bEmperor\s+of\s+Night\b/g, "Regent of Night"],
	[/\bTime\s+Master\b/g, "Lattice Chronomancer"],
	[/\bTemporal\s+Mage\b/g, "Lattice Chronomancer"],
	[/\bHourglass\s+Keeper\b/g, "Lattice Keeper"],
	[/\bRift\s+Tracker\b/g, "Gate-Tracker"],
	[/\bAngel-Class\s+Fiend\b/g, "Angel-Class Anomaly"],
	[/\bShadow\s+Fiend\b/g, "Umbral Anomaly"],
	[/\bDrake\s+Eye\b/g, "Anomaly Eye"],
	[/\bFire\s+Drake\b/g, "Fire-Class Anomaly"],
	[/\bgoblin\s+archers?\b/gi, "Anomaly archers"],
	// REVERSE FIX: undo a previous bad scrub that wrongly renamed canonical "Holy Knights" -> "Vanguard Hunters".
	// Holy Knight is a CANONICAL RA Hunter class (A-rank, paladin equivalent). DO NOT scrub it.
	[/\bVanguard\s+[Hh]unters\b/g, "Holy Knights"],
	[/\bvanguard\s+[Hh]unters\b/g, "Holy Knights"],
	[/\bVanguard\s+[Hh]unter\b/g, "Holy Knight"],
	[/\bvanguard\s+[Hh]unter\b/g, "Holy Knight"],
	[/\bancient\s+dragon\s+(\w+)\b/g, "ancient $1-Class Anomaly"],
	[/\bdragon[-\s]like\s+abilities\b/gi, "anomaly-like abilities"],

	// =========================================================
	// Mechanical riders: "Undead or Fiend" / "Aberration" tag refs -> Anomaly tag.
	// =========================================================
	[/\bUndead\s+or\s+Fiend\b/g, "Anomaly"],
	[/\bundead\s+or\s+fiend\b/g, "anomaly"],
	[/\bUndead\s+or\s+Aberration\b/g, "Anomaly"],
	[/\bundead\s+or\s+aberration\b/g, "anomaly"],
	[/\bConstruct\s+or\s+Undead\b/g, "Construct or Anomaly"],
	[/\bconstruct\s+or\s+undead\b/g, "construct or anomaly"],
	[/\b(creatures?\s+with\s+the\s+)Undead(\s+(?:or\s+\w+\s+)?tag)/g, "$1Anomaly$2"],
	[/\bagainst\s+an\s+Undead\b/g, "against an Anomaly"],
	[/\bagainst\s+the\s+Undead\b/g, "against an Anomaly"],
	[/\bagainst\s+Undead\b/g, "against Anomalies"],

	// =========================================================
	// Fantasy creature terminology -> Anomaly / setting equivalents.
	//
	// Care notes:
	//   - "Celestial" is intentionally NOT scrubbed. It's both an RA theme adjective
	//     (gap-fill items like "Celestial Pendant") AND the lineage of the deity Solara
	//     ("the Radiant Exarchs / Celestial force"). It also appears in canonical
	//     anomaly names like "Corrupted Celestial Herald" and the spell "Celestial Edge".
	//   - "Dragon" is NOT broadly scrubbed because "Dragon-King Marthos" is the
	//     canonical name of an RA pantheon deity (The Dragon-King of Void). We only
	//     scrub specific "dragon X" composite phrases that are clearly fantasy-isms.
	//   - "Wyrm" is NOT scrubbed because the canonical relic "Skywyrm's Gauntlet"
	//     contains it (and `\bwyrm\b` wouldn't match "Skywyrm" anyway, but explicit).
	// =========================================================
	[/\bdwarven rune\b/gi, "Bureau-engraved rune"],
	[/\bdwarven runes\b/gi, "Bureau-engraved runes"],
	[/\bdwarven\b/gi, "pre-gate"],
	[/\belven\b/gi, "pre-gate"],
	[/\belvish\b/gi, "pre-gate"],
	[/\borcish\b/gi, "anomaly-tier"],
	[/\bgoblin\b/gi, "anomaly"],
	[/\bwyvern blood\b/gi, "anomaly ichor"],
	[/\bwyvern\b/gi, "anomaly"],
	[/\bdraconic\b/gi, "regent-tier"],
	// Note: bare \bdragons?\b removed to protect "Dragon-King Marthos". Only specific
	// composite "dragon X" phrases are scrubbed in the section above.
	[/\bdrake\b/gi, "anomaly"],
	[/\baberrations?\b/gi, "anomaly"],
	[/\bAberration\b/g, "Anomaly"],
	[/\bUndead\b/g, "Anomaly"],
	[/\bundead\b/g, "anomaly"],
	[/\bFiends?\b/g, "Anomaly"],
	[/\bfiends?\b/g, "anomaly"],
	[/\bdemons?\b/gi, "anomaly"],
	// Note: \bcelestials?\b removed — canonical theme adjective and deity lineage term.
	[/\bancient civilization\b/gi, "pre-gate civilization"],
	[/\bancient temples?\b/gi, "pre-gate ruins"],

	// =========================================================
	// Class / role D&D-isms -> CANONICAL RA Hunter classes.
	// Mappings sourced from `@/data/compendium/jobs.ts` and
	// `@/data/compendium/sandbox/sandbox-asset-resolver.ts` (definitive D&D->RA equivalency map).
	// =========================================================
	[/\bpaladins?\b/gi, "Holy Knight"], // Holy Knight (A-rank) — Oath-Bound Enforcer
	[/\bclerics?\b/gi, "Herald"], // Herald (B-rank) — Bureau field chaplain / raid medic
	[/\bdruids?\b/gi, "Summoner"], // Summoner (B-rank) — reworked druid (gate ecosystem command, shapeshift)
	[/\bbarbarians?\b/gi, "Berserker"], // Berserker (C-rank) — Overload mandate
	[/\bwizards?\b/gi, "Mage"], // Mage (C-rank) — Aetheric Scholar
	[/\bsorcerers?\b/gi, "Esper"], // Esper (B-rank) — explicitly "SA version of a Sorcerer"
	[/\bwarlocks?\b/gi, "Contractor"], // Contractor (B-rank) — Rift-Pact Vessel
	[/\bnecromancers?\b/gi, "Revenant"], // Revenant (A-rank) — Marthos Reaper, Void-Breath
	[/\brangers?\b/gi, "Stalker"], // Stalker (B-rank) — Dimensional Predator
	[/\bbards?\b/gi, "Idol"], // Idol (B-rank) — Frequency Manipulator
	[/\bmonks?\b/gi, "Striker"], // Striker (A-rank) — Neural Overdrive, kinetic channeling
	[/\brogues?\b/gi, "Assassin"], // Assassin (B-rank)
	[/\bfighters?\b/gi, "Destroyer"], // Destroyer (C-rank) — Strength-primary martial
	// NOTE: "artificer" is used generically in canonical RA lore to mean "craftsman /
	// manufacturing cell" (e.g. "Bureau-licensed artificer cell"). It is NOT scrubbed.
	// The Technomancer class is its own term and never spelled "artificer" in canon.

	// =========================================================
	// Misc setting fixes
	// =========================================================
	[/\bholy water\b/gi, "purification compound"],
	[/\bsilvered\s+(weapon|blade)\b/gi, "mana-treated $1"],
	[/\badamantine\b/gi, "lattice-stable composite"],
	[/\bmithril\b/gi, "anomaly-grade alloy"],
];

export const THEME_TAG_FIXES = {
	"monarch-era": "regent-era",
	"sovereign-era": "regent-era",
	"sovereignty-wars": "regent-wars",
};

export function scrubText(s) {
	if (typeof s !== "string") return s;
	let out = s;
	for (const [re, rep] of TERMINOLOGY_FIXES) {
		out = out.replace(re, rep);
	}
	return out;
}

export function scrubThemeTags(tags) {
	if (!Array.isArray(tags)) return tags;
	return tags.map((t) => {
		if (typeof t !== "string") return t;
		const fixed = THEME_TAG_FIXES[t.toLowerCase()];
		return fixed ?? t;
	});
}

// =============================================================
// Lore / flavor / description pools
// =============================================================

export const ORIGIN_POOL = [
	"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
	"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
	"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
	"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
	"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
	"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
	"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
	"Procured through the Hunter Association's gray-market quartermaster network.",
	"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
	"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
	"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
	"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
	"Manufactured by a Bureau-licensed artificer cell operating under contract.",
	"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
	"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
	"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
	"Recovered from a Guild's deep-storage archive after a leadership audit.",
	"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
	"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
	"Bought at auction by a private guild and re-issued to a Hunter strike team.",
	"Salvaged from a partially-collapsed gate during a recovery sweep.",
	"Acquired from a Bureau-stamped supplier under a long-term contract.",
	"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
	"Issued to a B-rank Hunter on first deployment and never replaced.",
	"Recovered from a Bureau-cleared safehouse during a Guild raid.",
	"Logged into the Hunter Association's master inventory the day it was first sold.",
	"Recovered from a black-market shipment intercepted by Bureau agents.",
	"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
	"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
	"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
];

export const HISTORY_POOL = [
	"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
	"Saw heavy rotation among second-strike teams during the Busan Incident.",
	"Briefly classified for export until the Guild Inspectors lifted the embargo.",
	"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
	"Showed up in pawn shops across three districts before the Bureau issued a recall.",
	"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
	"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
	"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
	"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
	"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
	"Earned a footnote in the Hunter Association's quarterly equipment audit.",
	"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
	"Cited in two Bureau accident reports as 'performed within tolerance.'",
	"Recommissioned three times across its service life. Inspected at every reissue.",
	"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
	"Featured in a Bureau training video as an example of safe field maintenance.",
	"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
	"Shifted between three Bureau quartermaster depots over a five-year period.",
	"Used in a controlled recovery operation that became the Bureau's textbook example.",
	"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
	"Tested through a Guild's three-tier review and approved for sustained use.",
	"Stayed in service longer than expected, primarily because nothing newer was available.",
	"Saw use in two named clears and one unnamed one no one talks about.",
	"Came up in a Bureau audit and survived the resulting paperwork.",
	"Was once misattributed in a post-clear report; the correction is still in the record.",
];

export const FLAVOR_POOL = {
	weapon: [
		"Built to hit. Built to keep working.",
		"Reliable. Honest. Mean when it has to be.",
		"It does the job. That's all the Bureau asks of it.",
		"Not pretty. Not elegant. Effective.",
		"You don't carry it to be seen. You carry it to come back.",
		"Heavy in the hand. Heavier in consequence.",
		"It's killed before. It will again.",
		"It rewards the steady, punishes the loud.",
		"Sized for the wielder who finishes fights, not the one who starts them.",
		"What survives a Hunter's tour usually outlives the Hunter.",
		"Honest steel. The kind that never apologizes.",
		"It will only ever be as deadly as the hand that holds it.",
		"Tested in the dark, blooded in the bright.",
		"Quiet, until it isn't.",
		"Carried by people who know the difference between a kill and a survival.",
		"It owes nothing to luck. It is what it costs.",
		"Don't trust a weapon you can't put down.",
	],
	armor: [
		"Not glamorous. Still alive.",
		"Built by Bureau artificers who've patched real wounds.",
		"What's left of you after it's done its job is what you started with.",
		"Worn down at the seams. That's how you know it works.",
		"It won't make you faster. It'll just make sure you walk out.",
		"You don't notice it until you do. Then it's already saved you.",
		"Steel between you and the world. Not always enough; usually enough.",
		"Pull the straps tight. Trust the maker.",
		"It's been hit so you don't have to be.",
		"The cost of standing the line is right here, on your shoulders.",
		"You feel naked the day you take it off.",
		"Dents tell stories. Read them before you trust the wearer.",
		"Comfort is a luxury. Coming back is the requirement.",
	],
	consumable: [
		"One dose. Make it count.",
		"The Bureau's standard answer to 'how are we still alive?'",
		"Shelf life is a guideline. Trust the cap, not the date.",
		"Read the label. Then drink anyway.",
		"It's not pretty going down. It's prettier than the alternative.",
		"You'll know it worked. You'll know if it didn't.",
		"Calm hands, steady draw, full vial. Pick at least two.",
		"Triage in a glass. Don't waste it.",
		"It's expensive, but cheaper than a coffin.",
		"Half pharmacology, half hope.",
		"For the part of the fight that comes after the fight.",
		"The first sip is the worst. Drink past it.",
	],
	gear: [
		"Bureau-issue. Inventoried. Forgotten.",
		"Standard kit for those who plan to come back.",
		"Belongs in the bottom of every Hunter's go-bag.",
		"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		"Small enough to forget. Big enough to matter when it counts.",
		"Logged on the requisition manifest. Trusted on the line.",
		"Boring kit. Boring kit comes home.",
		"It's not glamour. It's the difference between a clear and a casualty.",
		"What you carry tells the Bureau what kind of Hunter you intend to be.",
		"Issue-grade. Not flashy, just thorough.",
		"Designed by people who survived. Issued to people who hope to.",
	],
	relic: [
		"Outlives the hands that hold it.",
		"What it remembers, you do not.",
		"A Bureau classification couldn't capture it. They tried.",
		"Its history is longer than the gates have been open.",
		"Some things were never meant to be cataloged.",
		"It chose the wielder before the wielder chose it.",
		"What you wield is older than every record that names it.",
	],
};

export const DISCOVERY_POOL = [
	"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
	"Logged at a Bureau weigh-station after a routine post-clear inventory.",
	"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
	"Identified during a mid-tier auction after the Bureau cleared its provenance.",
	"Surfaced when a Guild quartermaster did a five-year locker audit.",
	"Reported on a salvage manifest filed two weeks after the clear that produced it.",
	"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
	"Recovered during the post-clear sweep of a B-rank facility seal.",
	"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
	"Found in the back of a Guild's recovered-effects locker during inheritance review.",
	"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
	"Catalogued at a Bureau intake desk after a routine third-party deposit.",
	"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
	"Surfaced from a private collection following the owner's retirement.",
	"Pulled out of a sealed cache during a Guild succession dispute.",
	"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
	"Showed up on a Bureau auction list after the original owner's contract lapsed.",
	"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
];

// =============================================================
// Archetype classification
// =============================================================
// Order matters: more specific patterns must come before generic ones.
// All patterns allow optional trailing 's' or 'es' for plural forms.

export const ARCHETYPE_RULES = [
	// --- Firearms ---
	[/\b(revolvers?|pistols?|sidearms?|handgun)\b/i, "firearm_pistol"],
	[/\b(rifles?|carbines?|marksman|sniper)\b/i, "firearm_rifle"],
	[/\b(shotguns?|scatterguns?|breacher)\b/i, "firearm_shotgun"],
	[/\b(smg|submachine|machine\s*gun)\b/i, "firearm_smg"],
	[/\b(launcher|grenade\s*gun|rocket\s*launcher)\b/i, "firearm_launcher"],

	// --- Thrown weapons (MUST be checked first so 'Throwing Axes/Knives/Spears' don't get grabbed by melee rules) ---
	[/\b(throwing\s*stars?|throwing\s*knives?|throwing\s*axes?|throwing\s*daggers?|throwing\s*spears?|shurikens?|chakrams?|bolas?|darts?|javelins?)\b/i, "ranged_thrown"],

	// --- Melee bladed ---
	[/\b(rapiers?|stilettos?|dirks?|kris)\b/i, "melee_blade_finesse"],
	[/\b(daggers?|knives?|shivs?|tantos?|kunai)\b/i, "melee_blade_finesse"],
	[/\b(katanas?|sabers?|sabres?|wakizashis?|cutlasses?)\b/i, "melee_blade_versatile"],
	[/\b(longswords?|broadswords?|battle\s*sword)\b/i, "melee_blade_versatile"],
	[/\b(claymores?|greatswords?|zweihanders?|two-?handers?|nodachis?)\b/i, "melee_blade_heavy"],
	[/\b(scythes?|halberds?|glaives?|naginatas?|polearms?|spears?|lances?|tridents?|pikes?)\b/i, "melee_polearm"],

	// --- Bludgeon ---
	[/\b(hammers?|warhammers?|mauls?|sledges?)\b/i, "melee_bludgeon_heavy"],
	[/\b(maces?|clubs?|cudgels?|flails?|morningstars?|bats?)\b/i, "melee_bludgeon"],
	[/\b(staves?|staffs?|staff|quarterstaffs?|quarterstaves|bo|cane)\b/i, "melee_staff"],

	// --- Specialty melee (placed BEFORE armor/gear so 'gauntlet' weapons aren't grabbed by 'gauntlet bracer') ---
	[/\b(gauntlets?|knuckles?|claws?|fists?|tonfas?)\b/i, "melee_gauntlet"],
	[/\b(whips?|kusarigamas?|floggers?)\b/i, "melee_whip"],
	[/\b(axes?|hatchets?|tomahawks?|cleavers?)\b/i, "melee_axe"],
	[/\b(sickles?|kamas?)\b/i, "melee_sickle"],

	// --- Ranged non-firearm ---
	[/\b(longbows?|shortbows?|recurves?|compound\s*bows?|bows?)\b/i, "ranged_bow"],
	[/\b(crossbows?|repeaters?)\b/i, "ranged_crossbow"],

	// --- Foci / catalysts ---
	[/\b(focus|focuses|catalysts?|conduits?|orbs?|spheres?|prisms?|lenses?)\b/i, "focus_caster"],
	[/\b(wands?|rods?|sceptres?|scepters?|batons?)\b/i, "focus_wand"],
	[/\b(grimoires?|tomes?|codices?|codex|spellbooks?|manuals?)\b/i, "focus_tome"],

	// --- Gear / wondrous (must come BEFORE armor so 'Cloak of X' classifies as wondrous attire, not light armor) ---
	[/\b(amulets?|pendants?|talismans?|charms?|lockets?|necklaces?)\b/i, "gear_amulet"],
	[/\b(signets?|signet\s*rings?|rings?|bands?|loops?)\b/i, "gear_ring"],
	[/\b(bracers?|wristguards?|forearm\s*plates?)\b/i, "gear_bracer"],
	[/\b(belts?|sashes?|straps?|holsters?|webbings?)\b/i, "gear_belt"],
	[/\b(boots?|greaves?|sabatons?|footwear|footwraps?)\b/i, "gear_boots"],
	[/\b(badges?|id\s*chips?|tags?|insignias?|emblems?|credentials?|operator\s*ids?|authentication\s*tokens?|identification\s*plates?)\b/i, "gear_credential"],
	[/\b(handcuffs|manacles|binders?|restraints?|mana[-\s]*cuffs|mana[-\s]*suppressor\s*cuffs|hardlight\s*cuffs|ankle\s*cuffs|lattice\s*cuffs)\b/i, "gear_restraint"],
	[/\b(grappling\s*hooks?|crowbars?|pry\s*bars?|pitons?|piton\s*sets?|padlocks?|chisels?|saws?|bedrolls?|tinderboxes?|whetstones?|spyglasses?|hand\s*drills?|repel\s*rigs?|anchor\s*lines?|climbing\s*kits?|climbing\s*cables?|hand\s*mirrors?|mess\s*kits?|ropes?|cords?|tethers?|cables?)\b/i, "gear_utility"],
	[/\b(field\s*kit|toolkit|medical\s*kit|forensic\s*kit|repair\s*kit|survival\s*kit|triage\s*kit|mana[-\s]*diagnostic\s*kit|lattice\s*toolkit|breach\s*kit|recovery\s*kit|tracking\s*kit|kit[-\s]*bags?|trauma\s*kit)\b/i, "gear_kit"],
	[/\b(lanterns?|torches?|flashlights?|searchlights?|glow\s*rods?|tactical\s*lights?|lamps?|beacon\s*lights?)\b/i, "gear_light"],
	[/\b(maps?|atlases?|schematics?|charts?|layout\s*plates?|gate\s*atlases?|survey\s*maps?|recon\s*sheets?|field\s*plates?|coordinate\s*atlases?)\b/i, "gear_navigation"],
	[/\b(scanners?|recorders?|mana\s*sensors?|sensors?|cameras?|receivers?|tracking\s*drones?|diagnostic\s*tools?|lattice\s*probes?|field\s*computers?|comm\s*sets?|spotter\s*lens(es)?|telemetry\s*devices?)\b/i, "gear_electronics"],
	[/\b(cloaks?|robes?|garbs?|mantles?|hoods?|greatcoats?|hooded\s*robes?|ceremonial\s*robes?|hunter['']s\s*mantles?|operator['']s\s*coats?|uniforms?|regalias?|raiments?|attires?|tailored\s*suits?|field\s*garbs?)\b/i, "gear_attire"],

	// --- Armor (specific, only mechanical-armor names) ---
	[/\b(plate\s*armor|battle\s*plate|carapace\s*armor|reinforced\s*plate|heavy\s*cuirass|cuirass|breastplate|field\s*plate|combat\s*plate|bulwark\s*plate|vanguard\s*plate|spaulders|pauldrons|harness\s*plate)\b/i, "armor_heavy"],
	[/\b(chain\s*mail|chainmail|scale\s*mail|brigandine|chain\s*shirt|mail\s*shirt|mana\s*scale|layered\s*mail|combat\s*mail|service\s*brigandine|half[-\s]*plate)\b/i, "armor_medium"],
	[/\b(combat\s*vest|tactical\s*coat|mana[-\s]*weave\s*jacket|reinforced\s*robe|stealth\s*suit|light\s*carapace|patrol\s*coat|service\s*robe|leather\s*armor|padded\s*armor|hide\s*armor|combat\s*jacket|armored\s*vest|field\s*cloak|coats?|jackets?|vests?)\b/i, "armor_light"],
	[/\b(shields?|bucklers?|aegis|bulwarks?|kite\s*shield|round\s*shield|tower\s*shield|patrol\s*shield)\b/i, "armor_shield"],
	[/\b(helms?|helmets?|masks?|visors?|cowls?|greathelm)\b/i, "armor_headgear"],

	// --- Consumables ---
	[/\b(elixirs?|potions?|tonics?|brews?|draughts?|vials?|phials?|cordials?|salves?|flasks?|restoratives?)\b/i, "consumable_potion"],
	[/\b(stims?|serums?|injections?|injectors?|doses?|syringes?|adrenal\s*injectors?|reflex\s*stims?|combat\s*injectors?|field\s*stims?|recovery\s*stims?|endurance\s*serums?)\b/i, "consumable_stim"],
	[/\b(grenades?|charges?|bombs?|mines?|payloads?|detonators?|frag\s*charges?|concussion\s*grenades?|lattice\s*bombs?|emp\s*charges?|mana\s*mines?|smoke\s*charges?|breach\s*charges?)\b/i, "consumable_grenade"],
	[/\b(scrolls?|inscriptions?|sigil\s*scroll|spell\s*scroll|rune\s*scrolls?|cantrip\s*scrolls?|ward\s*scrolls?|lattice\s*scrolls?|battle\s*scrolls?|sealed\s*inscriptions?|casting\s*scrolls?)\b/i, "consumable_scroll"],
	[/\b(rations?|food|meals?|stews?|loaves?|jerky|trail\s*mix|stim\s*bar|energy\s*bar|survival\s*bar|recovery\s*pack|field\s*pack|field\s*meal|mre)\b/i, "consumable_ration"],
	[/\b(antidotes?|cures?|purifiers?|cleansers?|detox|neutralizers?|counter[-\s]*agents?|restorative\s*vials?)\b/i, "consumable_purifier"],
	[/\b(flares?|signals?|beacons?|locators?|pingers?|smoke\s*signals?|distress\s*beacons?|marker\s*flares?|recall\s*beacons?)\b/i, "consumable_signal"],
];

export const ARCHETYPE_FALLBACK = "gear_misc";

export function classifyArchetype(name, type) {
	const n = String(name || "");
	for (const [re, arche] of ARCHETYPE_RULES) {
		if (re.test(n)) return arche;
	}
	const t = String(type || "").toLowerCase();
	if (t === "weapon") return "melee_blade_versatile";
	if (t === "armor") return "armor_light";
	if (t === "consumable") return "consumable_potion";
	if (t === "scroll") return "consumable_scroll";
	if (t === "ring") return "gear_ring";
	if (t === "amulet") return "gear_amulet";
	if (t === "staff") return "melee_staff";
	if (t === "wand") return "focus_wand";
	if (t === "focus") return "focus_caster";
	return ARCHETYPE_FALLBACK;
}

// =============================================================
// Mechanical templates per archetype × rarity
// =============================================================

const RARITY_BONUS = {
	common: 0,
	uncommon: 1,
	rare: 1,
	epic: 2,
	legendary: 3,
};

// Damage scaling step per rarity (applied by adding +N to flat damage in passive note,
// not by upgrading the die — keeps mechanics readable).
function bonusPassive(bonus) {
	if (bonus <= 0) return [];
	return [`+${bonus} bonus to attack and damage rolls.`];
}

function rarityHpRange(rarity) {
	switch (rarity) {
		case "uncommon":
			return "4d4 + 4";
		case "rare":
			return "6d4 + 6";
		case "epic":
			return "8d4 + 8";
		case "legendary":
			return "10d4 + 20";
		default:
			return "2d4 + 2";
	}
}

function rarityChargeCount(rarity) {
	switch (rarity) {
		case "uncommon":
			return 2;
		case "rare":
			return 3;
		case "epic":
			return 4;
		case "legendary":
			return 5;
		default:
			return 1;
	}
}

// Each template returns a partial Item object.
const TEMPLATES = {
	// --- Firearms ---
	firearm_pistol: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d8",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "light"],
		range: "Ranged (40/120)",
		properties: {
			weapon: { damage: "1d8", damage_type: "piercing", range: 40, finesse: false },
		},
		effects: { passive: ["Sidearm. Reload (1) on a bonus action.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	firearm_rifle: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d10",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		properties: { weapon: { damage: "1d10", damage_type: "piercing", range: 80 } },
		effects: { passive: ["Long-arm. Disadvantage on attacks within 5 ft.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	firearm_shotgun: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "2d6",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "two-handed", "loading"],
		range: "Ranged (15/60)",
		properties: { weapon: { damage: "2d6", damage_type: "piercing", range: 15 } },
		effects: { passive: ["Spread shot. Loading (1 attack per turn).", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	firearm_smg: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d6",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "light", "burst-fire"],
		range: "Ranged (40/120)",
		properties: { weapon: { damage: "1d6", damage_type: "piercing", range: 40 } },
		effects: { passive: ["Burst fire (3 rd): expend 3 ammo, +1d6 damage on hit.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	firearm_launcher: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "3d6",
		damage_type: "force",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "two-handed", "heavy", "loading"],
		range: "Ranged (60/180)",
		properties: { weapon: { damage: "3d6", damage_type: "force", range: 60 } },
		effects: {
			passive: [
				"AoE: 10 ft. radius. DC 13 Agility save halves damage.",
				...bonusPassive(RARITY_BONUS[rarity] || 0),
			],
		},
	}),

	// --- Melee bladed ---
	melee_blade_finesse: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d6",
		damage_type: "piercing",
		weapon_type: "martial melee",
		simple_properties: ["light", "finesse"],
		properties: { weapon: { damage: "1d6", damage_type: "piercing", finesse: true } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	melee_blade_versatile: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d8",
		damage_type: "slashing",
		weapon_type: "martial melee",
		simple_properties: ["versatile (1d10)"],
		properties: { weapon: { damage: "1d8", damage_type: "slashing", versatile: "1d10" } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	melee_blade_heavy: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "2d6",
		damage_type: "slashing",
		weapon_type: "martial melee",
		simple_properties: ["heavy", "two-handed"],
		properties: { weapon: { damage: "2d6", damage_type: "slashing" } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	melee_polearm: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d10",
		damage_type: "piercing",
		weapon_type: "martial melee",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: { weapon: { damage: "1d10", damage_type: "piercing" } },
		effects: { passive: ["Reach: melee attacks have 10 ft. range.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),

	// --- Bludgeon ---
	melee_bludgeon: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d6",
		damage_type: "bludgeoning",
		weapon_type: "martial melee",
		simple_properties: ["versatile (1d8)"],
		properties: { weapon: { damage: "1d6", damage_type: "bludgeoning", versatile: "1d8" } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	melee_bludgeon_heavy: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d10",
		damage_type: "bludgeoning",
		weapon_type: "martial melee",
		simple_properties: ["heavy", "two-handed"],
		properties: { weapon: { damage: "1d10", damage_type: "bludgeoning" } },
		effects: {
			passive: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				...bonusPassive(RARITY_BONUS[rarity] || 0),
			],
		},
	}),
	melee_staff: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d6",
		damage_type: "bludgeoning",
		weapon_type: "simple melee",
		simple_properties: ["versatile (1d8)"],
		properties: { weapon: { damage: "1d6", damage_type: "bludgeoning", versatile: "1d8" } },
		effects: { passive: ["Doubles as an arcane focus.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),

	// --- Specialty melee ---
	melee_gauntlet: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d4",
		damage_type: "bludgeoning",
		weapon_type: "simple melee",
		simple_properties: ["light", "monk"],
		properties: { weapon: { damage: "1d4", damage_type: "bludgeoning" } },
		effects: { passive: ["Counts as an unarmed strike for class features.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	melee_whip: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d4",
		damage_type: "slashing",
		weapon_type: "martial melee",
		simple_properties: ["finesse", "reach"],
		properties: { weapon: { damage: "1d4", damage_type: "slashing", finesse: true } },
		effects: { passive: ["Reach: melee attacks have 10 ft. range.", ...bonusPassive(RARITY_BONUS[rarity] || 0)] },
	}),
	melee_axe: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d8",
		damage_type: "slashing",
		weapon_type: "martial melee",
		simple_properties: ["versatile (1d10)"],
		properties: { weapon: { damage: "1d8", damage_type: "slashing", versatile: "1d10" } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	melee_sickle: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d4",
		damage_type: "slashing",
		weapon_type: "simple melee",
		simple_properties: ["light"],
		properties: { weapon: { damage: "1d4", damage_type: "slashing" } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),

	// --- Ranged non-firearm ---
	ranged_bow: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d8",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (150/600)",
		properties: { weapon: { damage: "1d8", damage_type: "piercing", range: 150 } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	ranged_crossbow: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d10",
		damage_type: "piercing",
		weapon_type: "martial ranged",
		simple_properties: ["ammunition", "loading", "two-handed"],
		range: "Ranged (100/400)",
		properties: { weapon: { damage: "1d10", damage_type: "piercing", range: 100 } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),
	ranged_thrown: (rarity) => ({
		item_type: "weapon",
		type: "weapon",
		damage: "1d4",
		damage_type: "piercing",
		weapon_type: "simple ranged",
		simple_properties: ["finesse", "thrown"],
		range: "Ranged (20/60)",
		properties: { weapon: { damage: "1d4", damage_type: "piercing", finesse: true, range: 20 } },
		effects: { passive: bonusPassive(RARITY_BONUS[rarity] || 0) },
	}),

	// --- Foci ---
	focus_caster: (rarity) => ({
		item_type: "tool",
		type: "focus",
		properties: {},
		effects: {
			passive: [
				"Acts as an arcane focus for spellcasting.",
				rarity === "common"
					? ""
					: `+${RARITY_BONUS[rarity] || 1} bonus to spell attack rolls and spell-save DCs.`,
			].filter(Boolean),
		},
	}),
	focus_wand: (rarity) => ({
		item_type: "tool",
		type: "wand",
		damage: "1d6",
		damage_type: "force",
		weapon_type: "simple ranged",
		simple_properties: ["arcane focus"],
		range: "Ranged (60/180)",
		properties: { weapon: { damage: "1d6", damage_type: "force", range: 60 } },
		effects: {
			passive: ["Acts as an arcane focus.", ...bonusPassive(RARITY_BONUS[rarity] || 0)],
		},
		charges: rarity === "common" ? null : { max: rarityChargeCount(rarity), current: rarityChargeCount(rarity), recharge: "long-rest" },
	}),
	focus_tome: (rarity) => ({
		item_type: "tool",
		type: "scroll",
		properties: {},
		effects: {
			passive: [
				"Acts as a written arcane focus.",
				rarity === "common"
					? ""
					: `Spells cast through this focus add +${RARITY_BONUS[rarity] || 1} to damage or healing rolls.`,
			].filter(Boolean),
		},
	}),

	// --- Armor ---
	armor_light: (rarity) => ({
		item_type: "armor",
		type: "armor",
		armor_type: "Light",
		armor_class: `${11 + (RARITY_BONUS[rarity] || 0)} + Dex modifier`,
		properties: {},
		effects: {
			passive: [
				`Provides AC ${11 + (RARITY_BONUS[rarity] || 0)} + AGI modifier.`,
				...bonusPassive(0),
			],
		},
	}),
	armor_medium: (rarity) => ({
		item_type: "armor",
		type: "armor",
		armor_type: "Medium",
		armor_class: `${13 + (RARITY_BONUS[rarity] || 0)} + Dex modifier (max 2)`,
		properties: {},
		effects: { passive: [`Provides AC ${13 + (RARITY_BONUS[rarity] || 0)} + AGI (max +2).`] },
	}),
	armor_heavy: (rarity) => ({
		item_type: "armor",
		type: "armor",
		armor_type: "Heavy",
		armor_class: `${15 + (RARITY_BONUS[rarity] || 0)}`,
		stealth_disadvantage: true,
		strength_requirement: 13,
		properties: {},
		effects: {
			passive: [`Provides AC ${15 + (RARITY_BONUS[rarity] || 0)}. Stealth checks at disadvantage.`],
		},
	}),
	armor_shield: (rarity) => ({
		item_type: "shield",
		type: "armor",
		armor_type: "Shield",
		armor_class: "+2",
		properties: {},
		effects: { passive: [`Provides +${2 + (RARITY_BONUS[rarity] || 0)} AC while wielded.`] },
	}),
	armor_headgear: (rarity) => ({
		item_type: "armor",
		type: "armor",
		armor_type: "Light",
		armor_class: `${11 + (RARITY_BONUS[rarity] || 0)} + Dex modifier`,
		properties: {},
		effects: { passive: ["Headgear: shields the wearer from minor concussive impacts."] },
	}),

	// --- Consumables ---
	consumable_potion: (rarity) => ({
		item_type: "consumable",
		type: "consumable",
		properties: {},
		effects: {
			passive: [`On consumption, restore ${rarityHpRange(rarity)} hit points.`],
			active: [
				{
					name: "Drink",
					description: `Action. Drink the potion. Restore ${rarityHpRange(rarity)} HP.`,
					action: "action",
					frequency: "at-will",
				},
			],
		},
	}),
	consumable_stim: (rarity) => ({
		item_type: "consumable",
		type: "stim",
		properties: {},
		effects: {
			passive: [`On injection, restore ${rarityHpRange(rarity)} hit points or mana.`],
			active: [
				{
					name: "Inject",
					description: `Bonus action. Restore ${rarityHpRange(rarity)} HP or mana to a willing creature within 5 ft.`,
					action: "bonus-action",
					frequency: "at-will",
				},
			],
		},
	}),
	consumable_grenade: (rarity) => ({
		item_type: "consumable",
		type: "consumable",
		damage: rarity === "legendary" ? "6d6" : rarity === "epic" ? "4d6" : rarity === "rare" ? "3d6" : "2d6",
		damage_type: "force",
		range: "Thrown (30/90)",
		simple_properties: ["thrown", "consumable"],
		properties: {
			weapon: { damage: rarity === "legendary" ? "6d6" : rarity === "epic" ? "4d6" : rarity === "rare" ? "3d6" : "2d6", damage_type: "force", range: 30 },
		},
		effects: {
			active: [
				{
					name: "Throw",
					description: `Action. Throw to a point within 30 ft. All creatures in 10 ft. radius make a DC ${10 + (RARITY_BONUS[rarity] || 3)} Agility save, taking ${rarity === "legendary" ? "6d6" : rarity === "epic" ? "4d6" : rarity === "rare" ? "3d6" : "2d6"} force damage on a fail (half on success).`,
					action: "action",
					frequency: "at-will",
					dc: 10 + (RARITY_BONUS[rarity] || 3),
				},
			],
		},
	}),
	consumable_scroll: (rarity) => ({
		item_type: "consumable",
		type: "scroll",
		properties: {},
		effects: {
			passive: [
				`Single-use scroll. Casts an inscribed spell at ${rarity} potency without consuming mana.`,
			],
			active: [
				{
					name: "Read",
					description: "Action. Cast the inscribed spell. Scroll is consumed.",
					action: "action",
					frequency: "at-will",
				},
			],
		},
	}),
	consumable_purifier: (rarity) => ({
		item_type: "consumable",
		type: "consumable",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Cures one of: poisoned, charmed, frightened, or weakened."
					: `Cures any one condition of choice. Grants advantage on saves against that condition for ${rarityChargeCount(rarity)} hours.`,
			],
			active: [
				{
					name: "Apply",
					description: "Action. Cure one targeted condition.",
					action: "action",
					frequency: "at-will",
				},
			],
		},
	}),
	consumable_signal: (rarity) => ({
		item_type: "consumable",
		type: "consumable",
		properties: {},
		effects: {
			passive: [
				"On activation, emits a Bureau-recognized signal visible for 1 mile and audible to nearby Hunter receivers.",
			],
			active: [
				{
					name: "Activate",
					description: "Action. Burn for 1 minute. Bright light in a 60-ft. radius and dim light for an additional 60 ft.",
					action: "action",
					frequency: "at-will",
				},
			],
		},
	}),
	consumable_ration: () => ({
		item_type: "consumable",
		type: "consumable",
		properties: {},
		effects: { passive: ["A day's nutrition for one Hunter on a cleared sweep."] },
	}),

	// --- Gear ---
	gear_amulet: (rarity) => ({
		item_type: "tool",
		type: "amulet",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Worn around the neck. Inscribed sigil resonates with the bearer's mana lattice."
					: `+${RARITY_BONUS[rarity] || 1} bonus to one chosen ability score check.`,
			],
		},
	}),
	gear_ring: (rarity) => ({
		item_type: "tool",
		type: "ring",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Bureau-issued ring. Identifies the wearer to lattice-coupled detectors."
					: `+${RARITY_BONUS[rarity] || 1} bonus to a chosen saving throw.`,
			],
		},
	}),
	gear_bracer: (rarity) => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Reinforced bracer. Mild armor weave protects the forearm."
					: `+${RARITY_BONUS[rarity] || 1} bonus to attack rolls with light or finesse weapons.`,
			],
		},
	}),
	gear_belt: (rarity) => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Reinforced belt. Holsters the bearer's primary kit."
					: `+${RARITY_BONUS[rarity] || 1} bonus to Strength checks while worn.`,
			],
		},
	}),
	gear_boots: (rarity) => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: {
			passive: [
				rarity === "common"
					? "Mana-treated soles for traction inside lattice-bleed zones."
					: `+${5 * (RARITY_BONUS[rarity] || 1)} ft. to walking speed while worn.`,
			],
		},
	}),
	gear_credential: () => ({
		item_type: "misc",
		type: "wondrous",
		properties: {},
		effects: {
			passive: [
				"Bureau-recognized credential. Grants access to controlled facilities and Hunter-only districts.",
			],
		},
	}),
	gear_restraint: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: {
			passive: [
				"Restrained creature has disadvantage on spellcasting checks.",
				"Requires DC 20 Strength or DC 25 Sleight of Hand to escape.",
			],
		},
	}),
	gear_utility: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: { passive: ["Standard utility kit. Used in extraction, repelling, and lattice-bleed cleanup."] },
	}),
	gear_kit: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: { passive: ["Includes the Bureau's standard-issue toolkit. +2 to relevant tool checks."] },
	}),
	gear_light: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: { passive: ["Bright light in a 30-ft. radius and dim light for an additional 30 ft."] },
	}),
	gear_navigation: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: { passive: ["+1 to Investigation checks involving terrain, gates, and lattice-bleed mapping."] },
	}),
	gear_electronics: () => ({
		item_type: "tool",
		type: "wondrous",
		properties: {},
		effects: { passive: ["+1 to Investigation checks involving data analysis and surveillance."] },
	}),
	gear_attire: () => ({
		item_type: "misc",
		type: "wondrous",
		properties: {},
		effects: { passive: ["+1 to social checks in formal or guild-administrative settings."] },
	}),
	gear_misc: () => ({
		item_type: "misc",
		type: "wondrous",
		properties: {},
		effects: { passive: ["A piece of Bureau-quartermastered field gear."] },
	}),
};

export function getTemplate(archetype, rarity) {
	const fn = TEMPLATES[archetype] || TEMPLATES[ARCHETYPE_FALLBACK];
	const out = fn(rarity);
	// Strip any stray empty passive arrays.
	if (out?.effects?.passive && Array.isArray(out.effects.passive)) {
		out.effects.passive = out.effects.passive.filter((s) => typeof s === "string" && s.trim().length > 0);
		if (out.effects.passive.length === 0) delete out.effects.passive;
	}
	return out;
}

// =============================================================
// Description / lore generators (deterministic by name+id)
// =============================================================

function pickFrom(pool, key) {
	if (!Array.isArray(pool) || pool.length === 0) return "";
	const idx = fnv1a(key) % pool.length;
	return pool[idx];
}

const DESCRIPTION_POOLS = {
	firearm_pistol: [
		"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		"A compact firearm machined to standard Hunter Bureau tolerances. Fits any standard-issue holster.",
		"A reinforced sidearm with a Bureau-stamped frame and ichor-resistant action.",
		"A short-barrel handgun tuned for fast draw and reliable function inside cramped gate corridors.",
	],
	firearm_rifle: [
		"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
	],
	firearm_shotgun: [
		"A short-barrel breaching weapon. Devastating in close quarters; useless past thirty feet.",
		"A Bureau-spec scattergun favored for clearing nests and tight gate corridors.",
		"A reinforced pump-action shotgun. Standard kit for breach-and-clear operations.",
	],
	firearm_smg: [
		"A compact submachine gun tuned for sustained-fire engagements.",
		"A short-barrel automatic. Burst-fire selectors give Hunters control in tight spaces.",
		"A Bureau-issued PDW. High rate of fire, modest stopping power, easy reloads.",
	],
	firearm_launcher: [
		"A heavy ordnance launcher reserved for A-rank breaches. Use sparingly.",
		"A shoulder-mount projectile launcher tuned for armored and clustered anomalies.",
		"A high-explosive launcher with Bureau-coded safety locks.",
	],
	melee_blade_finesse: [
		"A light blade balanced for finesse strikes. Common in close-quarters Hunter loadouts.",
		"A precision short blade favored by Strikers and Assassins.",
		"A swift, compact blade weighted for fast cuts and reversals.",
		"A finesse-cut blade with a hand-shaped grip and reinforced tang.",
		"A discreet sidearm blade meant for civilian-zone work and quiet exits.",
		"A precision-balanced knife with a mana-treated edge.",
		"A short blade with a fluted spine, weighted for offhand throws.",
		"A compact dagger sized for boot-sheath carry.",
	],
	melee_blade_versatile: [
		"A versatile mid-weight blade. Handles single- and two-handed equally well.",
		"A standard sidearm blade for Hunters who prefer steel to firearms.",
		"A balanced blade with a fuller groove that channels excess kinetic mana.",
		"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		"A versatile blade — single-handed for speed, two-handed for finishing strokes.",
		"A field-tested broadsword balanced for sustained engagements.",
		"A Bureau-grade longsword with a mana-conductive crossguard.",
		"A reliable mid-weight blade — the kind every Hunter learns on, and many never replace.",
		"A saber cut for fluid offense and parry-driven defense.",
		"A versatile cutting blade with a tempered edge and Bureau service marks.",
	],
	melee_blade_heavy: [
		"A heavy two-handed blade built for armored anomalies and gate-bosses.",
		"A massive blade with a reinforced spine. Slow, but it rarely needs a second swing.",
		"A high-mass blade designed to overpower B-rank and higher anomalies.",
		"A two-handed greatsword forged from mana-stable composite alloy.",
		"A heavy claymore with a counter-weighted pommel for sweeping arcs.",
		"A reinforced two-handed blade — chosen by tanks who hit before they get hit.",
		"A great-blade balanced so the wielder's strength sets the pace.",
	],
	melee_polearm: [
		"A long-reach polearm balanced for crowd control and formation work.",
		"A reach weapon used by Bureau gate-line teams.",
		"A two-handed reach weapon — good against fast, low-ground anomalies.",
		"A balanced spear with a reinforced shaft and mana-conductive head.",
		"A halberd-class polearm cut for sweeping arcs and thrust finishes.",
		"A glaive favored by gate-line tanks for keeping anomalies at distance.",
		"A field-issue spear designed for second-rank engagement.",
		"A two-handed reach weapon used to break melee lines and protect spellcasters.",
	],
	melee_bludgeon: [
		"A blunt weapon designed to break shielded anomalies and unarmored targets alike.",
		"A balanced impact weapon with a mana-treated head.",
		"A field-issued mace common among Bureau second-line teams.",
		"A reinforced cudgel suited to dealing with armored, low-mobility threats.",
		"A flanged mace built for piercing through medium armor and carapace plate.",
		"A short-haft impact weapon. Brutal at arm's length, useless past it.",
	],
	melee_bludgeon_heavy: [
		"A heavy two-handed crusher. Best used against fortified anomalies.",
		"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		"A two-handed warhammer built to crater armored targets.",
		"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		"A reinforced sledge — for when an obstacle needs to stop being one.",
		"A two-handed crusher tuned for breaking armor, walls, and anomaly carapace alike.",
		"A demolition-grade hammer with reinforced grip and a mana-stable striking surface.",
	],
	melee_staff: [
		"A balanced staff that doubles as an arcane focus.",
		"A reinforced quarterstaff suitable for both martial and channeling use.",
		"A long staff used by hybrid Mage-classed Hunters in close-quarter exchanges.",
	],
	melee_gauntlet: [
		"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		"A close-combat gauntlet favored by Strikers and unarmed-Mage hybrids.",
		"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		"Heavy bracer-knuckles with mana-treated impact plates.",
		"Field-issued combat gauntlets for monk-class Hunters and tactical brawlers.",
		"Articulated combat gauntlets that double as a martial focus.",
	],
	melee_whip: [
		"A long flexible weapon with a finesse grip. Reach without weight.",
		"A reinforced whip used by control-style Hunters to disarm and entangle.",
		"A finesse reach weapon — surprising on first contact, devastating with practice.",
		"A weighted whip for trip, disarm, and grappling work.",
		"A flexible reach weapon braided from mana-treated cord.",
		"A control-class weapon for Hunters who prefer winning fights without finishing them.",
	],
	melee_axe: [
		"A balanced battle-axe. Versatile, brutal, and easy to maintain in the field.",
		"A field-axe forged to Bureau quartermaster standards.",
		"A two-edged axe weighted for sustained cleaving.",
	],
	melee_sickle: [
		"A short curved blade. Light, fast, and well-suited to dual-wielding.",
		"A finesse-edge weapon traditionally paired with shadow techniques.",
		"A small reaping blade used for harvesting anomaly cores in the field.",
	],
	ranged_bow: [
		"A composite bow tuned for silent engagements outside Bureau-designated lethal zones.",
		"A high-tension ranged weapon favored by tracker-class Hunters.",
		"A composite bow capable of throwing arrows past 600 ft. with technique.",
	],
	ranged_crossbow: [
		"A heavy crossbow with reinforced limbs. Long reload, high impact.",
		"A ranged weapon that splits the difference between firearm stopping power and bow silence.",
		"A reinforced crossbow used by hybrid teams operating in firearm-restricted zones.",
	],
	ranged_thrown: [
		"A set of thrown weapons balanced for finesse strikes.",
		"Field-issued throwing implements suitable for off-hand and stealth applications.",
		"Light throwing weapons favored by Assassins and shadow specialists.",
	],
	focus_caster: [
		"A spellcasting focus shaped to channel a Hunter's mana lattice cleanly.",
		"A standard arcane focus used by Mages, Espers, and other channeling classes.",
		"A focus crystal cut to Bureau-graded purity standards.",
	],
	focus_wand: [
		"A short channeling wand suitable for ranged spell delivery.",
		"A precision focus wand favored by control-style Mages.",
		"A wand cut from gate-resonant alloy. Holds a small charge of cast spells.",
	],
	focus_tome: [
		"A bound reference tome that doubles as a written arcane focus.",
		"A grimoire of Bureau-approved cantrips and rank-appropriate spells.",
		"A reference codex used by long-form casters between encounters.",
	],
	armor_light: [
		"A light, flexible armor weave. Standard kit for stealth-focused Hunters.",
		"A field armor designed to keep mobility without sacrificing all protection.",
		"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		"A field-armor coat with reinforced shoulder and hip panels.",
		"A stealth-treated tactical vest issued by Bureau quartermasters.",
		"A multi-layer combat coat woven from impact-resistant fabric.",
		"A ranger-class light armor sized for extended gate sweeps.",
		"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
		"A close-cut combat suit with mana-stable seams and trauma-rated panels.",
		"A flexible armor cloak shaped to sit unobtrusively under Bureau-issue uniforms.",
	],
	armor_medium: [
		"A medium armor of layered scale and reinforced cloth. The standard Bureau loadout.",
		"A balanced armor weave suited to most Hunter classes.",
		"A scale-and-plate composite providing solid protection without crippling mobility.",
		"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		"A reinforced mid-weight armor used by gate-line second-strike teams.",
		"A balanced scale-mail composite tuned for long-engagement durability.",
		"A mid-weight chainmail shirt rated for B-rank engagements.",
		"A reinforced brigandine layer built to mesh with standard Bureau combat gear.",
		"A balanced armor system suited to second-line Hunters and skirmisher tanks.",
	],
	armor_heavy: [
		"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		"A heavy plate-and-scale shell built for sustained engagements with armored anomalies.",
		"A heavy mana-stable carapace built around composite plating and ichor-treated joints.",
		"Bureau-grade heavy plate. Slow, but it stops what most armor doesn't.",
		"A reinforced battle-plate composed of layered ichor-treated sections.",
		"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		"A breach-line plate harness rated for sustained anomaly contact.",
		"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		"A high-rank tank's plate, built to hold a line through C-to-A engagement waves.",
	],
	armor_shield: [
		"A reinforced shield. Standard kit for line-holders inside high-rank gates.",
		"A Bureau-issued buckler shaped for both melee and ranged defense.",
		"A composite shield with mana-stable plating.",
	],
	armor_headgear: [
		"Reinforced headgear with mana-treated impact lining.",
		"A combat helm with optional Bureau communication insert.",
		"Bureau-issued head protection, lightweight and fitted.",
	],
	consumable_potion: [
		"A regulated alchemical compound. Restores hit points on consumption.",
		"A field-issued potion. Bitter, fast-acting, reliable.",
		"A Bureau-licensed restorative draught.",
		"A flask of mana-stable medicinal compound for in-field recovery.",
		"A Hunter-grade restorative; sealed against ambient mana decay.",
		"A Bureau-graded medicinal draught. Effective when applied promptly.",
		"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		"A regulated emergency draught. Quick draw, reliable effect.",
		"A combat-grade healing compound packaged for sub-action consumption.",
		"A field-stable potion. The Bureau's standard answer to early-fight injuries.",
		"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		"A field-grade restorative used during extraction and post-fight recovery.",
	],
	consumable_stim: [
		"A field stim packaged in a one-use injector. Standard medic kit.",
		"A Hunter-grade injector. Burns hot and fast. Trust the cap.",
		"A medical-grade stim, calibrated for Hunter physiology.",
		"A pre-measured combat stim with Bureau-coded markings.",
		"A high-uptake injector used by frontline Hunters under sustained fire.",
		"A medical stim packed for one-handed application during a fight.",
		"A Bureau-stamped emergency injector. Last-resort kit.",
		"A close-fit auto-injector calibrated for fast subcutaneous delivery.",
	],
	consumable_grenade: [
		"A mana-charged explosive. Detonates on contact or fuse.",
		"A high-yield throwable. Bureau-restricted to B-rank teams and above.",
		"A force grenade tuned to disrupt anomaly cohesion in a small radius.",
		"A compact throwable explosive with a Bureau-coded fuse.",
		"A directional charge designed to clear cover and break anomaly formations.",
		"A high-yield ordnance round packaged for hand-delivery.",
		"A breach-class throwable for forced-entry operations.",
	],
	consumable_scroll: [
		"A single-use scroll inscribed with a rank-appropriate spell.",
		"A consumable inscription. Reading consumes the scroll.",
		"A Bureau-licensed spell scroll, sealed against ambient mana decay.",
		"An inked sigil-scroll designed to discharge once and burn clean.",
		"A Bureau-graded one-use scroll. Mana-stabilized for transport.",
		"A scroll of inscribed magic, packaged for one-shot battlefield use.",
		"A casting scroll with the Hunter Association's authentication seal.",
	],
	consumable_purifier: [
		"A regulated cure compound. Removes a single condition on application.",
		"A field-issued purifier. Standard kit for medics and forward observers.",
		"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		"A clear-glass cure compound suitable for field application.",
		"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		"A neutralizing agent calibrated for gate-acquired contamination.",
		"A small dose of curative liquid. One condition cleared per application.",
	],
	consumable_signal: [
		"A signaling device. Burns on a single-use timer.",
		"A Bureau-coded signal flare visible to Hunter receivers within the operating area.",
		"A short-burn locator beacon. Standard kit for any Hunter operating beyond comms.",
		"A bright-burn signal flare, mana-stable in lattice-bleed conditions.",
		"A locator pinger keyed to Bureau extraction frequencies.",
	],
	consumable_ration: [
		"A vacuum-sealed nutrition pack. One day's calories for a single Hunter.",
		"A standard-issue Bureau ration. Edible. Filling. Forgettable.",
		"A field ration packaged for extended sweeps. Two-year shelf life.",
	],
	gear_amulet: [
		"A pendant inscribed with a mana-stable sigil.",
		"An amulet sealed against ambient lattice-bleed.",
		"A neck-worn focus that resonates lightly with the bearer's mana.",
		"A worked-metal pendant balanced for sustained attunement.",
		"A neck-worn talisman whose sigil-work is older than the gates themselves.",
		"A simple pendant that becomes anything but, once attuned.",
	],
	gear_ring: [
		"A bound ring with a sigil etched along the inner band.",
		"A Bureau-cataloged ring linked to a single bearer at a time.",
		"A signet ring used to identify the bearer to certain detectors.",
		"A close-fitting band with mana-conductive tracery on the inner face.",
		"A simple ring that rewards a Hunter who knows what to look for.",
		"A worked-band ring fitted to the bearer at attunement.",
	],
	gear_bracer: [
		"A reinforced bracer with mild armor weave on the inner face.",
		"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		"A wrist-worn focus and protective plate combined into one piece.",
	],
	gear_belt: [
		"A reinforced belt with magnetic and physical clip points.",
		"A standard Hunter combat belt with built-in holster compatibility.",
		"A Bureau-issue load belt sized for standard kit.",
		"A reinforced combat sash with mana-stable buckle hardware.",
		"A heavy-duty utility belt with quick-release attachment points.",
	],
	gear_boots: [
		"Reinforced field boots with mana-treated soles for traction in lattice zones.",
		"Combat boots issued by the Bureau quartermaster.",
		"Lightweight tactical footwear designed for extended gate operations.",
		"Stealth-treated combat boots with sound-dampening soles.",
		"Field-grade boots reinforced at the ankle and instep for sustained gate work.",
	],
	gear_credential: [
		"A Bureau-issued credential. Grants identity verification at controlled checkpoints.",
		"An identification badge linked to a Hunter's official record.",
		"A Bureau-coded ID chip for use in lattice-secured facilities.",
		"A Hunter's operating credential, valid in Bureau-controlled districts.",
		"A laminated identity tag stamped with the Hunter Association seal.",
	],
	gear_restraint: [
		"A pair of restraints calibrated to suppress mana-bound bodily augmentation.",
		"Bureau-graded handcuffs designed to hold up to A-rank Hunters.",
		"A restraint device tuned to dampen the wearer's mana lattice.",
	],
	gear_utility: [
		"A general utility kit. Cordage, clips, anchors, and basic field tools.",
		"A Bureau-standard utility implement. Belongs in every Hunter's go-bag.",
		"A multi-purpose field tool used in extraction and rappelling work.",
	],
	gear_kit: [
		"A field kit with the Bureau's standard tooling for its intended purpose.",
		"A toolkit, complete and inspection-stamped.",
		"A specialized kit, calibrated for Hunter Bureau operational standards.",
		"A purpose-specific kit assembled by Bureau quartermasters.",
		"A field-issued working kit, stamped with the Hunter Association seal.",
	],
	gear_light: [
		"A handheld light source. Mana-stable in lattice-bleed environments.",
		"A Bureau-issue lantern. Reliable in any gate.",
		"A combat-grade flashlight with extended-burn battery.",
		"A handheld lamp tuned to cut through anomaly fog.",
		"A Bureau-spec illuminator with a wide-beam optic and recharge port.",
	],
	gear_navigation: [
		"A map or chart with Bureau-cataloged terrain notations.",
		"A field reference for gate-affected geography.",
		"A schematic with overlay support for lattice-stress fault lines.",
		"A folding atlas of cleared and contested gate sites.",
		"A laminated reference plate marked with Bureau-controlled extraction routes.",
	],
	gear_electronics: [
		"A handheld surveillance or recording device.",
		"A field electronics kit calibrated for lattice-stable operation.",
		"A scanner used to detect mana traces and anomalous signatures.",
		"A Bureau-grade recorder with mana-stable memory media.",
		"A specialized field-electronics tool used in surveillance and trace-gathering work.",
	],
	gear_attire: [
		"A piece of formal or working attire suited to Bureau social settings.",
		"Standard Bureau-issue clothing for non-combat duties.",
		"A non-armored outfit appropriate for guild-administrative work.",
	],
	gear_misc: [
		"A miscellaneous piece of Hunter Bureau quartermaster issue.",
		"A field accessory. Cataloged but not classified.",
		"A small piece of standard Hunter kit.",
		"A standard-issue accessory in any Bureau quartermaster's inventory.",
		"An ordinary piece of working gear. Logged on the manifest, valued in the field.",
		"A piece of Bureau-quartermastered field gear.",
		"A miscellaneous item from the Bureau-supplied Hunter kit.",
	],
};

export function generateDescription(archetype, name, id) {
	const pool = DESCRIPTION_POOLS[archetype] || DESCRIPTION_POOLS.gear_misc;
	return pickFrom(pool, `${id}::${name}::desc`);
}

export function generateLore(name, id) {
	return {
		origin: pickFrom(ORIGIN_POOL, `${id}::origin`),
		history: pickFrom(HISTORY_POOL, `${id}::history`),
		curse: "",
		personality: "",
		current_owner: "",
		prior_owners: [],
	};
}

export function generateFlavor(archetype, name, id) {
	let group = "weapon";
	if (archetype.startsWith("armor_")) group = "armor";
	else if (archetype.startsWith("consumable_")) group = "consumable";
	else if (archetype.startsWith("gear_") || archetype.startsWith("focus_")) group = "gear";
	const pool = FLAVOR_POOL[group] || FLAVOR_POOL.weapon;
	return pickFrom(pool, `${id}::${name}::flavor`);
}

export function generateDiscoveryLore(name, id) {
	return pickFrom(DISCOVERY_POOL, `${id}::discovery`);
}
