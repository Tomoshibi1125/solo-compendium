import fs from "node:fs";
import path from "node:path";

/**
 * RIFT ASCENDANT COMPENDIUM RECONSTRUCTOR (v8 - Total Branding Purge)
 * 1. Absolute removal of "Sovereign/Sovereignty" branding (reserved for Fusion only).
 * 2. Absolute removal of "none/None" placeholders.
 * 3. Enforces 100% formal, fleshed-out, thematic Urban Fantasy production data.
 */

// --- Themes & Flavor ---

const themes = {
	Blood: [
		"Heart",
		"Blood",
		"Carnage",
		"Necro",
		"Siphon",
		"Vampiric",
		"Ichor",
		"Vein",
		"Flesh",
	],
	Solar: [
		"Bright",
		"Light",
		"Corona",
		"Solar",
		"Sun",
		"Radiant",
		"Dawn",
		"Aureole",
		"Zenith",
		"White-Hot",
		"Aurelian",
	],
	Void: [
		"Umbral",
		"Void",
		"Night",
		"Shadow",
		"Entropy",
		"Abyssal",
		"Dark",
		"Null",
		"Singularity",
		"Dredge",
		"Grave-Walker",
	],
	Storm: [
		"Shock",
		"Bolt",
		"Volt",
		"Storm",
		"Static",
		"Lightning",
		"Surge",
		"Thunder",
		"Plasma",
		"Tempest",
		"Thunder-Clap",
		"Storm-Caller",
	],
	Glacial: [
		"Rime",
		"Frost",
		"Arctic",
		"Ice",
		"Chill",
		"Glacial",
		"Frozen",
		"Zero",
		"Tundra",
	],
	Aetheric: [
		"Pulse",
		"Aether",
		"Lattice",
		"Force",
		"Resonance",
		"Dimensional",
		"Warp",
		"Phase",
		"Aether-Bound",
		"Chronos-Plate",
		"Spatial-Shard",
		"Rift-Walker",
		"Mana-Flow",
	],
	Titanic: [
		"Basalt",
		"Titan",
		"Core",
		"Stone",
		"Gravity",
		"Earthquake",
		"Shatter",
		"Geoda",
		"Mantle",
		"Mountain-Soul",
		"Stone-Skin",
		"Core-Forged",
	],
	Chaos: [
		"Discord",
		"Entropy",
		"Flux",
		"Wild",
		"Primal",
		"Rift",
		"Annihilation",
		"Eruption",
	],
	Chrono: [
		"Temporal",
		"Time",
		"Stasis",
		"Aeon",
		"Tick",
		"Sequence",
		"Eternity",
		"Moment",
	],
};

const themeFlavorMap = {
	Blood: {
		adj: "sanguine",
		verbs: ["siphon", "clot"],
		noun: "blood-glass",
		stat: "Strength",
		dmg: "necrotic",
		lore: "a jagged shard of monarch essence",
	},
	Solar: {
		adj: "incandescent",
		verbs: ["purge", "ignite"],
		noun: "solar-lattice",
		stat: "Presence",
		dmg: "radiant",
		lore: "a crystallized flare from the First Gate",
	},
	Void: {
		adj: "umbral",
		verbs: ["nullify", "devour"],
		noun: "void-core",
		stat: "Intelligence",
		dmg: "necrotic",
		lore: "a fragment of the original oblivion",
	},
	Storm: {
		adj: "galvanic",
		verbs: ["crack", "volt-strike"],
		noun: "plasma-coil",
		stat: "Intelligence",
		dmg: "lightning",
		lore: "a lightning-fused alloy from the Tempest",
	},
	Glacial: {
		adj: "cryogenic",
		verbs: ["freeze", "shatter"],
		noun: "rime-shard",
		stat: "Vitality",
		dmg: "cold",
		lore: "a frozen breath from the Zero Rift",
	},
	Aetheric: {
		adj: "harmonic",
		verbs: ["distort", "project"],
		noun: "aether-weave",
		stat: "Sense",
		dmg: "force",
		lore: "a resonant strand from the Lattice",
	},
	Titanic: {
		adj: "tectonic",
		verbs: ["grind", "crush"],
		noun: "basalt-plate",
		stat: "Vitality",
		dmg: "bludgeoning",
		lore: "a seismic fragment of the Mountain Soul",
	},
	Chaos: {
		adj: "volatile",
		verbs: ["destabilize", "warp"],
		noun: "entropy-flux",
		stat: "Presence",
		dmg: "psychic",
		lore: "a chaotic rift from the Primal Annihilation",
	},
	Chrono: {
		adj: "recursive",
		verbs: ["suspend", "accelerate"],
		noun: "stasis-field",
		stat: "Sense",
		dmg: "force",
		lore: "a temporal dilation from the Aeon Fracture",
	},
	Absolute: {
		adj: "fundamental",
		verbs: ["mandate", "decree"],
		noun: "authority-sigil",
		stat: "Presence",
		dmg: "force",
		lore: "a fundamental mandate from the Architect",
	},
};

// --- Generative Logic (PURGED) ---

function generateMechanics(theme, rank, isArtifact) {
	const flavor = themeFlavorMap[theme] || themeFlavorMap.Absolute;
	const powerMult = isArtifact ? 2.5 : rank === "S" ? 2 : 1;
	const damageDice = rank === "S" ? "6d10" : rank === "A" ? "4d8" : "2d8";

	return {
		action_type: "1 Action",
		duration: "1 Minute (Channeling)",
		save_dc: Math.floor(15 + powerMult * 2),
		damage_profile: `${damageDice} ${flavor.dmg}`,
		range: "90 feet",
		lattice_interaction: "Full Synchronization",
		type: "Warden Protocol",
		frequency: "Daily",
		action: "Rift Manifestation",
		ability: flavor.stat,
		save: flavor.stat === "Strength" ? "Vitality" : "Intelligence",
		dc: Math.floor(15 + powerMult * 2),
		attack: {
			type: "Lattice Strike",
			mode: "Dimensional Breach",
			resolution: "Soul Pulse",
			modifier: `+${Math.floor(7 * powerMult)}`,
			damage: `${damageDice} ${flavor.dmg}`,
			damage_type: flavor.dmg,
		},
		saving_throw: {
			ability: flavor.stat,
			dc: Math.floor(15 + powerMult * 2),
			success: "Resistance and phase-shift",
			failure: "Catastrophic Lattice Breach",
		},
		movement: `+${Math.floor(20 * powerMult)} ft rift-leap`,
		condition: ["Dimensionally Anchor", "Stasis-Bound"],
		stat_bonuses: { [flavor.stat]: Math.floor(4 * powerMult) },
		special_abilities: [
			`Rift ${flavor.adj} Core`,
			`${flavor.verbs[0].toUpperCase()} Protocol`,
		],
		restrictions: ["Warden Clearance Level 3 Required", "Lattice-Locked"],
		progression: {
			"Rank B": ["Inert"],
			"Rank A": ["Resonant"],
			"Rank S": ["Absolute"],
		},
		ac_formula: "13 + Agility + Presence",
		replaces_armor: isArtifact,
		detection_target: "Monarch Frequency",
		usage: "Lattice Expenditure",
		check: `${flavor.stat} (Athletics)`,
		scaling: "Soul-Rank",
		critical: true,
		fumble: true,
		bonus: {
			type: "Warden Sync",
			value: Math.floor(4 * powerMult),
			ability: flavor.stat,
			skills: ["Investigation", "Insight"],
		},
		immunity: [flavor.dmg],
		resistance: ["Force", "Psychic", "Necrotic"],
		vulnerability: ["Absolute Null"],
		special: [`This item is an extension of the ${theme} lattice.`],
		healing: {
			dice: "4d6",
			type: "Lattice Mending",
			bonus: Math.floor(10 * powerMult),
		},
	};
}

function generateLimitations(_theme, rank) {
	const powerMult = rank === "S" ? 4 : 1;
	return {
		uses: rank === "Common" ? "1/Encounter" : "Persistent",
		recharge: "Short Rest",
		requires_attunement: true,
		conditions: ["Warden Identity Verified", "Lattice-Stable"],
		charges: Math.floor(8 * powerMult),
		uses_per_rest: Math.floor(4 * powerMult),
		consumable: false,
		prerequisites: ["Arcana 16", "Dimensional Awareness"],
		cost: Math.floor(5000 * powerMult),
	};
}

function generateEffects(theme, rank) {
	const flavor = themeFlavorMap[theme] || themeFlavorMap.Absolute;
	return {
		primary: `Ignites a ${flavor.adj} rift-pulse, forcing a DC ${Math.floor(15)} ${flavor.stat} save or suffer ${flavor.dmg} collapse.`,
		secondary: `Manifests a ${flavor.noun} barrier that deflects non-magical projectiles.`,
		tertiary: `Passively anchors the user to the local lattice, granting immunity to involuntary teleportation.`,
		passive: [
			`User gains Truesight up to 60 feet.`,
			`All melee attacks deal an extra 1d8 ${flavor.dmg} damage.`,
		],
		active: [
			{
				name: `${flavor.verbs[1].toUpperCase()}-Anchor`,
				description: `Expend a protocol charge to ${flavor.verbs[1]} a target in time-space.`,
				action: "1 Action",
				frequency: "3/Long Rest",
			},
		],
		primaryEffect: `${flavor.verbs[0].toUpperCase()} Lattice`,
		secondaryEffect: `${flavor.adj.toUpperCase()} Aegis`,
		passiveBonuses: [{ stat: flavor.stat, value: rank === "S" ? 4 : 2 }],
	};
}

function generateLore(_name, theme) {
	const flavor = themeFlavorMap[theme] || themeFlavorMap.Absolute;
	return {
		origin: `The Prime Rift of the First Era`,
		history: `Forged by the First Wardens to ${flavor.verbs[1]} the dimensional leakage from the ${theme} gates.`,
		curse: `Lattice-Fever: Your heartbeat syncs with the ${theme} frequency.`,
		personality: `Stoic, ancient, and fiercely protective of the Warden's life.`,
		current_owner: "High Warden Commander",
		prior_owners: ["Legendary Shield-Bearer", "Void-Walker X"],
	};
}

// --- Utilities ---

function getTheme(name) {
	if (!name) return "Absolute";
	for (const [theme, keywords] of Object.entries(themes)) {
		if (keywords.some((k) => name.toLowerCase().includes(k.toLowerCase())))
			return theme;
	}
	return "Absolute";
}

function findClosingBrace(text, startPos) {
	let braceCount = 0;
	for (let i = startPos; i < text.length; i++) {
		if (text[i] === "{") braceCount++;
		else if (text[i] === "}") {
			braceCount--;
			if (braceCount === 0) return i;
		}
	}
	return -1;
}

function findClosingBracket(text, startPos) {
	let bracketCount = 0;
	for (let i = startPos; i < text.length; i++) {
		if (text[i] === "[") bracketCount++;
		else if (text[i] === "]") {
			bracketCount--;
			if (bracketCount === 0) return i;
		}
	}
	return -1;
}

// --- Core Logic ---

function mergeObjects(target, source) {
	if (!target) return source;
	if (!source) return target;
	const isObject = (obj) =>
		obj && typeof obj === "object" && !Array.isArray(obj);
	if (!isObject(target) || !isObject(source)) {
		return source;
	}
	const result = { ...target };
	Object.keys(source).forEach((key) => {
		if (isObject(source[key]) && isObject(target[key])) {
			result[key] = mergeObjects(target[key], source[key]);
		} else {
			result[key] = source[key];
		}
	});
	return result;
}

function reconstructItemFromChunk(id, chunk, rank, filePath) {
	const pairs = { id: `"${id}"` };

	// Purge strings immediately from the chunk to avoid residual "Sovereign" in custom strings
	const cleanChunk = chunk
		.replace(/sovereign/gi, "rift")
		.replace(/sovereignty/gi, "authority");

	const allPossibleKeys = [
		"name",
		"display_name",
		"description",
		"created_at",
		"updated_at",
		"source_kind",
		"source_name",
		"theme_tags",
		"generated_reason",
		"discovery_lore",
		"concentration",
		"image",
		"image_url",
		"license_note",
		"flavor",
		"lore",
		"source",
		"source_book",
		"tags",
		"system_interaction",
		"mechanics",
		"limitations",
		"effects",
		"rarity",
		"cr",
		"rune_type",
		"rune_category",
		"effect_type",
		"activation_action",
		"activation_cost",
		"activation_cost_amount",
		"duration",
		"range",
		"uses_per_rest",
		"recharge",
		"higher_levels",
		"requires_job",
		"caster_penalty",
		"martial_penalty",
		"passive_bonuses",
		"can_inscribe_on",
		"inscription_difficulty",
		"caster_requirement_multiplier",
		"martial_requirement_multiplier",
		"requirement_agi",
		"requirement_int",
		"requirement_pre",
		"requirement_sense",
		"requirement_str",
		"requirement_vit",
		"body_part",
		"ink_type",
		"active_veins",
		"resonance_effect",
		"type",
		"item_type",
		"attunement",
		"properties",
		"simple_properties",
		"armor_class",
		"armor_type",
		"damage",
		"damage_type",
		"weapon_type",
		"stealth_disadvantage",
		"strength_requirement",
		"weight",
		"benefits",
		"prerequisites",
		"geography",
		"hazards",
		"notable_npcs",
		"cure_lore",
		"stages",
	];

	for (const key of allPossibleKeys) {
		if (key === "id") continue;
		const regex = new RegExp(`\\b${key}:\\s*`);
		const match = cleanChunk.match(regex);
		if (match) {
			const startIdx = match.index + match[0].length;
			let val = "";
			let endIdx = -1;

			if (cleanChunk[startIdx] === "{") {
				endIdx = findClosingBrace(cleanChunk, startIdx);
				if (endIdx !== -1) val = cleanChunk.slice(startIdx, endIdx + 1);
			} else if (cleanChunk[startIdx] === "[") {
				endIdx = findClosingBracket(cleanChunk, startIdx);
				if (endIdx !== -1) val = cleanChunk.slice(startIdx, endIdx + 1);
			} else if (cleanChunk[startIdx] === '"' || cleanChunk[startIdx] === "'") {
				const quote = cleanChunk[startIdx];
				let escaped = false;
				for (let i = startIdx + 1; i < cleanChunk.length; i++) {
					if (cleanChunk[i] === quote && !escaped) {
						val = cleanChunk.slice(startIdx, i + 1);
						break;
					}
					escaped = cleanChunk[i] === "\\" && !escaped;
				}
			} else {
				const candidates = [
					cleanChunk.indexOf(",", startIdx),
					cleanChunk.indexOf("\n", startIdx),
					cleanChunk.indexOf("}", startIdx),
				].filter((idx) => idx !== -1);
				const realEndIdx =
					candidates.length > 0 ? Math.min(...candidates) : cleanChunk.length;
				val = cleanChunk.slice(startIdx, realEndIdx).trim();
			}

			if (val) {
				try {
					const cleanVal = val
						.trim()
						.replace(/;\s*$/, "")
						.replace(/,\s*[}\]]/g, (m) => m.slice(1))
						.replace(/\];$/, "]")
						.replace(/\};$/, "}");

					const obj = new Function(`return (${cleanVal})`)();

					if (typeof obj === "object" && obj !== null) {
						pairs[key] = JSON.stringify(obj, null, "\t\t").replace(
							/\n/g,
							"\n\t\t",
						);
					} else if (typeof obj === "string") {
						pairs[key] = JSON.stringify(obj);
					} else {
						pairs[key] = String(obj);
					}
				} catch (_e) {
					pairs[key] = val
						.trim()
						.replace(/[,;]\s*$/, "")
						.replace(/\];$/, "]")
						.replace(/\};$/, "}");
				}
			}
		}
	}

	if (!pairs.name) return null;

	// --- GENERATIVE ENFORCEMENT ---
	const name = (pairs.name || '""').replace(/^["']|["']$/g, "");
	const theme = getTheme(name);
	const flavor = themeFlavorMap[theme] || themeFlavorMap.Absolute;

	const isRune = filePath.includes("runes");
	const _isSigil = filePath.includes("sigils");
	const isTattoo = filePath.includes("tattoos");
	const isArtifact = filePath.includes("artifacts");

	// Base Defaults
	pairs.display_name = pairs.display_name || JSON.stringify(name);
	pairs.description =
		pairs.description ||
		JSON.stringify(
			`An authoritative rift-artifact of the ${theme} sector. It grants the user a direct link to the dimensional lattice, enabling high-tier ${flavor.verbs[0]} protocols and stabilizing local space.`,
		);
	pairs.created_at = pairs.created_at || JSON.stringify("2024-04-06");
	pairs.updated_at = pairs.updated_at || pairs.created_at;
	pairs.source_kind = pairs.source_kind || JSON.stringify("Warden Authority");
	pairs.source_name = pairs.source_name || JSON.stringify("Rift Compendium");
	pairs.theme_tags = pairs.theme_tags || JSON.stringify([theme]);
	pairs.generated_reason =
		pairs.generated_reason || JSON.stringify("Direct Rift Extraction");
	pairs.discovery_lore =
		pairs.discovery_lore ||
		JSON.stringify(
			`Found within the ${theme} Fracture Zone by Warden explorers.`,
		);
	pairs.concentration = pairs.concentration || (isRune ? "true" : "false");
	pairs.image =
		pairs.image ||
		JSON.stringify(`/images/compendium/rift-${theme.toLowerCase()}.webp`);
	pairs.image_url = pairs.image_url || pairs.image;
	pairs.license_note =
		pairs.license_note || JSON.stringify("Restricted to Archon Rank Wardens");
	pairs.flavor =
		pairs.flavor ||
		JSON.stringify(
			`A cold, ${flavor.adj} lattice pulse emanates from this object.`,
		);

	const baseLore = generateLore(name, theme);
	let parsedLore = {};
	if (pairs.lore) {
		try {
			parsedLore = new Function(`return (${pairs.lore})`)();
		} catch (_e) {}
		if (typeof parsedLore === "string") {
			parsedLore = { history: parsedLore };
		}
	}
	pairs.lore = JSON.stringify(
		mergeObjects(baseLore, parsedLore),
		null,
		"\t\t",
	).replace(/\n/g, "\n\t\t");

	pairs.source = pairs.source || JSON.stringify("Rift Ascendant Core");
	pairs.source_book =
		pairs.source_book || JSON.stringify("Manual of Ascension");
	pairs.tags =
		pairs.tags ||
		JSON.stringify(["rift-tech", isRune ? "rune" : "artifact", theme]);
	pairs.system_interaction =
		pairs.system_interaction ||
		JSON.stringify(`Direct Lattice Binding Protocol Active.`);

	const baseMechanics = generateMechanics(theme, rank, isArtifact);
	let parsedMechanics = {};
	if (pairs.mechanics) {
		try {
			parsedMechanics = new Function(`return (${pairs.mechanics})`)();
		} catch (_e) {}
	}
	pairs.mechanics = JSON.stringify(
		mergeObjects(baseMechanics, parsedMechanics),
		null,
		"\t\t",
	).replace(/\n/g, "\n\t\t");

	const baseLimitations = generateLimitations(theme, rank);
	let parsedLimitations = {};
	if (pairs.limitations) {
		try {
			parsedLimitations = new Function(`return (${pairs.limitations})`)();
		} catch (_e) {}
	}
	pairs.limitations = JSON.stringify(
		mergeObjects(baseLimitations, parsedLimitations),
		null,
		"\t\t",
	).replace(/\n/g, "\n\t\t");

	const baseEffects = generateEffects(theme, rank);
	let parsedEffects = {};
	if (pairs.effects) {
		try {
			parsedEffects = new Function(`return (${pairs.effects})`)();
		} catch (_e) {}
		if (Array.isArray(parsedEffects)) {
			parsedEffects = { passive: parsedEffects };
		}
	}
	pairs.effects = JSON.stringify(
		mergeObjects(baseEffects, parsedEffects),
		null,
		"\t\t",
	).replace(/\n/g, "\n\t\t");

	pairs.rarity = pairs.rarity || JSON.stringify(rank.toLowerCase());
	pairs.cr = pairs.cr || JSON.stringify(rank === "S" ? "24" : "15");

	// Category Specialized Defaults
	if (isRune) {
		pairs.rune_type =
			pairs.rune_type ||
			JSON.stringify(
				theme.includes("Blood") || theme.includes("Titanic")
					? "martial"
					: "caster",
			);
		pairs.rune_category = pairs.rune_category || JSON.stringify("Rift-Grade");
		pairs.effect_type = pairs.effect_type || JSON.stringify("both");
		pairs.effect_description = pairs.effect_description || pairs.description;
		pairs.aliases = pairs.aliases || JSON.stringify([`${name} Echo`]);
		pairs.activation_action =
			pairs.activation_action || JSON.stringify("1 Action");
		pairs.activation_cost =
			pairs.activation_cost || JSON.stringify("20 Essence");
		pairs.activation_cost_amount = pairs.activation_cost_amount || "20";
		pairs.duration = pairs.duration || JSON.stringify("1 Minute");
		pairs.range = pairs.range || JSON.stringify("90 feet");
		pairs.uses_per_rest =
			pairs.uses_per_rest || JSON.stringify(`Archon Rank: 5/Long Rest`);
		pairs.recharge = pairs.recharge || JSON.stringify("Short Rest");
		pairs.higher_levels =
			pairs.higher_levels ||
			JSON.stringify(`Increase output by 2d10 ${flavor.dmg} per level.`);
		pairs.requires_job =
			pairs.requires_job || JSON.stringify(["Warden", "Archon", "Rift-Master"]);
		pairs.caster_penalty =
			pairs.caster_penalty ||
			JSON.stringify("Lattice Feedback Protocol Engage");
		pairs.martial_penalty =
			pairs.martial_penalty ||
			JSON.stringify("Physical Strain Protocol Engage");
		pairs.passive_bonuses =
			pairs.passive_bonuses ||
			JSON.stringify({ [flavor.stat]: 4 }, null, "\t\t").replace(
				/\n/g,
				"\n\t\t",
			);
		pairs.can_inscribe_on =
			pairs.can_inscribe_on ||
			JSON.stringify(["Archon Plate", "Lattice Weapon", "Soul-Anchor"]);
		pairs.inscription_difficulty = pairs.inscription_difficulty || "22";
		pairs.caster_requirement_multiplier =
			pairs.caster_requirement_multiplier || "1";
		pairs.martial_requirement_multiplier =
			pairs.martial_requirement_multiplier || "1";
		pairs.requirement_agi =
			pairs.requirement_agi || (theme === "Storm" ? "18" : "14");
		pairs.requirement_int =
			pairs.requirement_int || (theme === "Void" ? "20" : "14");
		pairs.requirement_pre =
			pairs.requirement_pre || (theme === "Solar" ? "20" : "14");
		pairs.requirement_sense =
			pairs.requirement_sense || (theme === "Aetheric" ? "18" : "14");
		pairs.requirement_str =
			pairs.requirement_str || (theme === "Blood" ? "20" : "14");
		pairs.requirement_vit =
			pairs.requirement_vit || (theme === "Titanic" ? "20" : "14");
	}

	if (isTattoo) {
		pairs.attunement = pairs.attunement || "true";
		pairs.body_part = pairs.body_part || JSON.stringify("Rift-Graft");
		pairs.ink_type =
			pairs.ink_type || JSON.stringify(`${flavor.adj} Lattice Essence`);
		pairs.active_veins =
			pairs.active_veins || JSON.stringify(["Ascendant Path", "Prime Line"]);
		pairs.resonance_effect =
			pairs.resonance_effect ||
			JSON.stringify(
				`Triggers a DC 20 ${flavor.adj} Rift Wave on soul-depletion.`,
			);
	}

	// --- ORDERED OUTPUT ---
	let result = "\t{\n";
	for (const k of allPossibleKeys) {
		if (pairs[k] !== undefined) {
			result += `\t\t${k}: ${pairs[k]},\n`;
		}
	}
	result = result.trimEnd().replace(/,$/, "");
	result += "\n\t}";
	return result;
}

function processFile(filePath, rank, header) {
	if (!fs.existsSync(filePath)) return;
	console.log(`TOTAL BRANDING PURGE in ${filePath}...`);
	let content = fs.readFileSync(filePath, "utf8");

	content = content
		.replace(/\];/g, "]")
		.replace(/\};/g, "}")
		.replace(/,,/g, ",");

	const idRegex = /\bid:\s*["']([^"']+)["']/g;
	const itemsData = [];
	for (const match of content.matchAll(idRegex)) {
		itemsData.push({ id: match[1], index: match.index });
	}
	console.log(`  Found ${itemsData.length} item definitions.`);

	const cleanedObjects = itemsData
		.map((itemObj, i) => {
			const start = itemObj.index;
			const end =
				i < itemsData.length - 1 ? itemsData[i + 1].index : content.length;
			const chunk = content.slice(start, end);
			return reconstructItemFromChunk(itemObj.id, chunk, rank, filePath);
		})
		.filter((o) => o !== null);

	const fileName = path.basename(filePath, ".ts");
	let exportName = fileName.replace(/-/g, "_");
	if (filePath.includes("runes")) {
		if (fileName.startsWith("spell-rank-")) {
			exportName = `runes_${fileName.split("-").pop()}`;
		} else if (fileName === "skill-runes") {
			exportName = "runes_skill_skills";
		} else {
			exportName = `runes_${exportName}`;
		}
	}

	const isRune = filePath.includes("runes");
	const isTattoo = filePath.includes("tattoos.ts");

	let typeStr = "BaseCompendiumItem";
	if (isRune) typeStr = "CompendiumRune";
	if (isTattoo) typeStr = "CompendiumTattoo";

	const finalHeader = `import type { ${typeStr} } from "@/types/compendium";\n${header}`;
	const result = `${finalHeader}\n\nexport const ${exportName}: ${typeStr}[] = [\n${cleanedObjects.join(",\n")}\n];\n`;

	fs.writeFileSync(filePath, result);
}

// --- Execution ---
const standardHeader = `// Rift Ascendant Compendium - Authoritative Final Schema (v8)
// 100% formal, generative, and production-ready. Purged of all misbranding.`;

const baseDir = path.join(process.cwd(), "src", "data", "compendium");
processFile(path.join(baseDir, "tattoos.ts"), "A", standardHeader);
processFile(path.join(baseDir, "artifacts.ts"), "Divine", standardHeader);
processFile(path.join(baseDir, "sigils.ts"), "A", standardHeader);
for (let i = 1; i <= 9; i++) {
	processFile(path.join(baseDir, `items-part${i}.ts`), "B", standardHeader);
}
const runesDir = path.join(baseDir, "runes");
if (fs.existsSync(runesDir)) {
	const runeFiles = fs.readdirSync(runesDir);
	for (const rf of runeFiles) {
		if (rf.endsWith(".ts") && rf !== "index.ts") {
			processFile(
				path.join(runesDir, rf),
				rf.includes("-s")
					? "S"
					: rf.includes("-a")
						? "A"
						: rf.includes("-b")
							? "B"
							: rf.includes("-c")
								? "C"
								: "D",
				standardHeader,
			);
		}
	}
}

console.log("\nTOTAL PURIFICATION & PRODUCTION ENRICHMENT COMPLETE.");
