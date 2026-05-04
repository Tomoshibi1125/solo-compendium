import type { CompendiumSpell } from "../../../types/compendium";

type SpellMode =
	| "strike"
	| "ward"
	| "restore"
	| "summon"
	| "control"
	| "sense"
	| "mobility"
	| "charm"
	| "curse"
	| "terrain"
	| "device";

type SpellSchool =
	| "Abjuration"
	| "Conjuration"
	| "Divination"
	| "Enchantment"
	| "Evocation"
	| "Illusion"
	| "Necromancy"
	| "Transmutation";

type SpellRank = "D" | "C" | "B" | "A" | "S";

interface SpellSeed {
	name: string;
	level: number;
	school: SpellSchool;
	classes: string[];
	mode: SpellMode;
	theme: string;
	damageType?: string;
	range?: string;
	duration?: string;
	castingTime?: string;
	concentration?: boolean;
	ritual?: boolean;
	material?: string | boolean;
}

interface SpellFamily {
	classes: string[];
	mode: SpellMode;
	school: SpellSchool;
	theme: string;
	prefixes: string[];
	forms: string[];
	levels: number[];
	damageType?: string;
	range?: string;
	duration?: string;
	castingTime?: string;
	concentration?: boolean;
	ritual?: boolean;
	material?: string | boolean;
}

const FULL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 5, 7, 9];
const LOW_LEVELS = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1, 2, 3, 5];
const HALF_LEVELS = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5];

const rankCounts: Record<SpellRank, number> = {
	D: 100,
	C: 100,
	B: 100,
	A: 100,
	S: 100,
};

function rankForLevel(level: number): SpellRank {
	if (level >= 9) return "S";
	if (level >= 7) return "A";
	if (level >= 5) return "B";
	if (level >= 3) return "C";
	return "D";
}

function rarityForRank(rank: SpellRank): string {
	if (rank === "S") return "legendary";
	if (rank === "A") return "epic";
	if (rank === "B") return "rare";
	if (rank === "C") return "uncommon";
	return "common";
}

function abilityForClasses(classes: string[]): string {
	if (classes.some((job) => ["Mage", "Revenant", "Technomancer"].includes(job)))
		return "Intelligence";
	if (classes.some((job) => ["Herald", "Summoner", "Stalker"].includes(job)))
		return "Sense";
	return "Presence";
}

function damageForLevel(level: number): string {
	return (
		["1d8", "2d8", "3d8", "4d8", "6d8", "8d8", "10d8", "12d8", "14d8", "16d8"][
			level
		] ?? "3d8"
	);
}

function healingForLevel(level: number): string {
	return (
		["1d6", "2d6", "3d6", "4d6", "5d6", "6d6", "7d6", "8d6", "9d6", "10d6"][
			level
		] ?? "3d6"
	);
}

function defaultDamageType(seed: SpellSeed): string {
	if (seed.damageType) return seed.damageType;
	if (seed.school === "Necromancy") return "necrotic";
	if (seed.school === "Enchantment") return "psychic";
	if (seed.school === "Abjuration") return "force";
	if (seed.school === "Conjuration") return "force";
	if (seed.school === "Transmutation") return "thunder";
	return "force";
}

function saveForMode(mode: SpellMode): string | null {
	if (mode === "strike" || mode === "terrain" || mode === "device")
		return "Agility";
	if (mode === "control" || mode === "summon") return "Strength";
	if (mode === "charm") return "Presence";
	if (mode === "curse") return "Vitality";
	return null;
}

function effectText(
	seed: SpellSeed,
	dice: string,
	damageType: string,
): { primary: string; secondary: string } {
	if (seed.mode === "restore") {
		return {
			primary: `Restores ${healingForLevel(seed.level)} hit points or removes one minor harmful condition.`,
			secondary:
				"At higher ranks, one additional ally in range can receive half the healing.",
		};
	}
	if (seed.mode === "ward") {
		return {
			primary:
				"Grants a protective lattice that adds +2 AC or +1d4 to the next saving throw before the spell ends.",
			secondary:
				"If the ward blocks damage, the protected creature gains temporary hit points equal to the spell level + your casting ability modifier.",
		};
	}
	if (seed.mode === "summon") {
		return {
			primary:
				"Manifests a bound echo in an unoccupied space within range for the duration.",
			secondary: `When the echo appears, one creature adjacent to it must save or take ${dice} ${damageType} damage and have its speed reduced by 10 feet until your next turn.`,
		};
	}
	if (seed.mode === "sense") {
		return {
			primary:
				"Reveals hidden mana signatures, active gates, disguised anomalies, or false spatial geometry within range.",
			secondary:
				"For the duration, you have advantage on the next Investigation, Insight, Perception, or Survival check tied to the revealed subject.",
		};
	}
	if (seed.mode === "mobility") {
		return {
			primary:
				"Repositions one willing creature through a short resonance fold without provoking opportunity attacks.",
			secondary:
				"The moved creature gains +10 feet of speed until the end of its next turn.",
		};
	}
	if (seed.mode === "charm") {
		return {
			primary: "Overloads emotion, rhythm, or intent in the target's aura.",
			secondary:
				"On a failed save, the target is charmed, frightened, or unable to take reactions until the end of your next turn.",
		};
	}
	if (seed.mode === "curse") {
		return {
			primary: `Brands the target with a draining omen that deals ${dice} ${damageType} damage.`,
			secondary:
				"On a failed save, the target subtracts 1d4 from its next attack roll or saving throw before the spell ends.",
		};
	}
	if (seed.mode === "terrain") {
		return {
			primary:
				"Alters a 20-foot square of battlefield into hazardous gate terrain for the duration.",
			secondary: `Creatures that enter the area for the first time on a turn or start there must save or take ${dice} ${damageType} damage and treat the area as difficult terrain.`,
		};
	}
	if (seed.mode === "device") {
		return {
			primary: `Deploys a compact focus, drone, or etched tool that releases ${dice} ${damageType} damage or a tactical utility pulse.`,
			secondary:
				"The device can also mark a target, illuminate an area, stabilize an ally, or disrupt a mundane electronic sensor at the Warden's discretion.",
		};
	}
	return {
		primary: `Deals ${dice} ${damageType} damage with a focused mana circuit.`,
		secondary:
			"On a failed save or critical hit, the target is pushed 10 feet, knocked prone, or briefly outlined by residual mana until your next turn.",
	};
}

function descriptionFor(
	seed: SpellSeed,
	dice: string,
	damageType: string,
): string {
	const ability = abilityForClasses(seed.classes);
	const save = saveForMode(seed.mode);
	if (seed.mode === "restore")
		return `You tune ${seed.theme} into a restorative circuit, restoring ${healingForLevel(seed.level)} hit points to a creature within range. The target can also end one disease, poison, fear, or charm effect if the condition's source is no higher than this spell's level.`;
	if (seed.mode === "ward")
		return `You fold ${seed.theme} around one creature or object within range. Until the spell ends, the ward grants +2 AC against one attack or +1d4 to one saving throw, then releases residual temporary hit points equal to your ${ability} modifier plus the spell level.`;
	if (seed.mode === "summon")
		return `You open a controlled rift aperture and manifest ${seed.theme} as a bound echo for the duration. The echo occupies a 5-foot space, threatens adjacent enemies, and forces one nearby creature to make a ${save} saving throw or take ${dice} ${damageType} damage and lose 10 feet of speed until your next turn.`;
	if (seed.mode === "sense")
		return `You align your senses with ${seed.theme}, revealing hidden mana signatures, active gate seams, disguised anomalies, and false spatial geometry within range. For the duration, your next relevant Investigation, Insight, Perception, or Survival check is made with advantage.`;
	if (seed.mode === "mobility")
		return `You bend ${seed.theme} into a short resonance fold. One willing creature you can see moves up to 30 feet to an unoccupied space you can see without provoking opportunity attacks, then gains +10 feet of speed until the end of its next turn.`;
	if (seed.mode === "charm")
		return `You infuse ${seed.theme} into a target's aura. The target must succeed on a ${save} saving throw or become charmed, frightened, or unable to take reactions until the end of your next turn; on a success it still has disadvantage on its next Insight or Perception check before then.`;
	if (seed.mode === "curse")
		return `You carve ${seed.theme} into a hostile aura. The target must make a ${save} saving throw, taking ${dice} ${damageType} damage on a failure or half as much on a success. On a failure it also subtracts 1d4 from its next attack roll or saving throw before the spell ends.`;
	if (seed.mode === "terrain")
		return `You overwrite local space with ${seed.theme}, creating a 20-foot square of unstable gate terrain. Creatures that enter the area for the first time on a turn or start there must make a ${save} saving throw, taking ${dice} ${damageType} damage and treating the area as difficult terrain on a failure.`;
	if (seed.mode === "device")
		return `You deploy ${seed.theme} through a focus, drone, or etched tool within range. Make a ranged spell attack using ${ability}; on a hit the target takes ${dice} ${damageType} damage, and the device can also mark, illuminate, stabilize, or disrupt a mundane sensor until the end of your next turn.`;
	return `You condense ${seed.theme} into a precise combat circuit. Make a ranged spell attack using ${ability}; on a hit the target takes ${dice} ${damageType} damage. If the attack is a critical hit, the target is pushed 10 feet, knocked prone, or briefly outlined by residual mana until your next turn.`;
}

function makeSeedFamily(family: SpellFamily): SpellSeed[] {
	return family.prefixes.flatMap((prefix, prefixIndex) =>
		family.forms.map((form, formIndex) => ({
			name: `${prefix} ${form}`,
			level:
				family.levels[
					(prefixIndex * family.forms.length + formIndex) % family.levels.length
				],
			school: family.school,
			classes: family.classes,
			mode: family.mode,
			theme: family.theme,
			damageType: family.damageType,
			range: family.range,
			duration: family.duration,
			castingTime: family.castingTime,
			concentration: family.concentration,
			ritual: family.ritual,
			material: family.material,
		})),
	);
}

function makeSpell(seed: SpellSeed): CompendiumSpell {
	const rank = rankForLevel(seed.level);
	rankCounts[rank] += 1;
	const damageType = defaultDamageType(seed);
	const dice = damageForLevel(seed.level);
	const ability = abilityForClasses(seed.classes);
	const save = saveForMode(seed.mode);
	const effects = effectText(seed, dice, damageType);
	const hasAttack = ["strike", "device"].includes(seed.mode);
	const duration =
		seed.duration ??
		(seed.concentration ? "Concentration, up to 1 minute" : "Instantaneous");
	const range =
		seed.range ??
		(seed.mode === "terrain"
			? "90 feet"
			: seed.mode === "ward" || seed.mode === "restore"
				? "60 feet"
				: "120 feet");
	const castingTime =
		seed.castingTime ?? (seed.mode === "ward" ? "1 reaction" : "1 action");
	const savingThrow = save
		? {
				ability: save,
				dc: 0,
				success:
					seed.mode === "charm" || seed.mode === "control"
						? "No condition."
						: "Half damage and no rider.",
				failure: effects.secondary,
			}
		: null;

	return {
		id: `spell-${rank.toLowerCase()}-${rankCounts[rank]}`,
		name: seed.name,
		display_name: seed.name,
		description: descriptionFor(seed, dice, damageType),
		flavor: `${seed.name} is taught as ${rank}-rank fieldcraft for ${seed.classes.join(", ")} Ascendants.`,
		tags: ["awakened", "spell", rank, seed.mode, seed.school, ...seed.classes],
		classes: seed.classes,
		rarity: rarityForRank(rank),
		source_book: "Rift Ascendant Canon",
		effects,
		level: seed.level,
		school: seed.school,
		casting_time: castingTime,
		range,
		duration,
		components: {
			verbal: true,
			somatic: true,
			material: seed.material ?? false,
			focus: "a keyed focus or gate-crystal shard",
		},
		concentration:
			seed.concentration ?? duration.toLowerCase().includes("concentration"),
		ritual: seed.ritual ?? seed.mode === "sense",
		rank,
		type: seed.mode,
		attack: hasAttack
			? {
					type: "ranged",
					ability,
					damage: dice,
				}
			: null,
		saving_throw: savingThrow,
		area:
			seed.mode === "terrain"
				? { type: "square", size: "20-foot", shape: "square" }
				: seed.mode === "summon"
					? { type: "point", size: "5-foot", shape: "space" }
					: { type: "point", size: "single target", shape: "point" },
		mechanics: {
			duration,
			range,
			type: seed.school,
			action: castingTime,
			ability,
			dc: save ? 0 : undefined,
			save: save ?? undefined,
			damage_profile: hasAttack || save ? `${dice} ${damageType}` : undefined,
			lattice_interaction: `${rank}-rank mana circuit stabilized through gate-lattice resonance`,
			attack: hasAttack
				? {
						type: damageType,
						mode: "ranged",
						resolution: "spell_attack",
						modifier: ability,
						damage: dice,
						damage_type: damageType,
					}
				: undefined,
			saving_throw: savingThrow ?? undefined,
			healing:
				seed.mode === "restore"
					? { dice: healingForLevel(seed.level), type: "restorative mana" }
					: undefined,
			scaling:
				seed.level === 0
					? "Improves at character levels 5, 11, and 17."
					: "Scales with higher-rank spell slots.",
		},
		higher_levels:
			seed.level === 0
				? "This cantrip improves at character levels 5, 11, and 17, adding one extra damage or healing die each time."
				: "When cast using a higher-rank spell slot, increase the damage, healing, ward value, or affected area by one step per slot rank above the base level.",
		atHigherLevels:
			seed.level === 0
				? "This cantrip improves at character levels 5, 11, and 17, adding one extra damage or healing die each time."
				: "When cast using a higher-rank spell slot, increase the damage, healing, ward value, or affected area by one step per slot rank above the base level.",
		discovery_lore: `Ascendant Bureau auditors catalogued ${seed.name} after repeated field reports from ${seed.classes.join(", ")} teams operating near unstable gates.`,
		theme_tags: [seed.mode, seed.theme, rank.toLowerCase()],
	};
}

const families: SpellFamily[] = [
	{
		classes: ["Mage", "Idol", "Technomancer"],
		mode: "sense",
		school: "Divination",
		theme: "aetheric utility resonance",
		prefixes: ["Aetheric", "Lattice", "Runic", "Mnemonic"],
		forms: ["Hand", "Script", "Beacon", "Relay"],
		levels: LOW_LEVELS,
	},
	{
		classes: ["Mage", "Esper", "Summoner", "Technomancer"],
		mode: "strike",
		school: "Evocation",
		theme: "elemental mana pressure",
		damageType: "force",
		prefixes: ["Cinder", "Rime", "Storm", "Gravitic"],
		forms: ["Bolt", "Spiral", "Crown", "Cascade"],
		levels: LOW_LEVELS,
	},
	{
		classes: ["Mage", "Herald", "Holy Knight", "Technomancer"],
		mode: "ward",
		school: "Abjuration",
		theme: "reinforced barrier resonance",
		prefixes: ["Aegis", "Bastion", "Mirror", "Lattice"],
		forms: ["Ward", "Shell", "Parapet", "Interdict"],
		levels: HALF_LEVELS,
	},
	{
		classes: ["Herald", "Idol", "Summoner", "Holy Knight"],
		mode: "restore",
		school: "Evocation",
		theme: "restorative life-current",
		prefixes: ["Mending", "Dawn", "Vital", "Mercy"],
		forms: ["Pulse", "Canticle", "Thread", "Bloom"],
		levels: HALF_LEVELS,
	},
	{
		classes: ["Summoner", "Stalker", "Herald"],
		mode: "terrain",
		school: "Transmutation",
		theme: "rift ecology and hostile terrain",
		damageType: "piercing",
		prefixes: ["Briar", "Mire", "Canopy", "Feral"],
		forms: ["Snare", "March", "Screen", "Ground"],
		levels: HALF_LEVELS,
		concentration: true,
	},
	{
		classes: ["Summoner", "Contractor", "Revenant"],
		mode: "summon",
		school: "Conjuration",
		theme: "bound rift echo",
		damageType: "force",
		prefixes: ["Gate", "Echo", "Abyss", "Threshold"],
		forms: ["Caller", "Hound", "Sentinel", "Host"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Esper", "Idol", "Contractor"],
		mode: "charm",
		school: "Enchantment",
		theme: "emotional resonance pressure",
		damageType: "psychic",
		prefixes: ["Mesmeric", "Velvet", "Commanding", "Dissonant"],
		forms: ["Gaze", "Voice", "Suggestion", "Echo"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Idol", "Herald", "Esper"],
		mode: "charm",
		school: "Enchantment",
		theme: "performance resonance",
		damageType: "psychic",
		prefixes: ["Resonant", "Silver", "Spotlight", "Harmonic"],
		forms: ["Anthem", "Finale", "Refrain", "Ovation"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Technomancer", "Mage", "Holy Knight", "Stalker"],
		mode: "device",
		school: "Transmutation",
		theme: "tool-bound mana engineering",
		damageType: "lightning",
		prefixes: ["Drone", "Capacitor", "Signal", "Circuit"],
		forms: ["Dart", "Screen", "Latch", "Patch"],
		levels: HALF_LEVELS,
	},
	{
		classes: ["Revenant", "Contractor", "Herald"],
		mode: "curse",
		school: "Necromancy",
		theme: "death-gate omen",
		damageType: "necrotic",
		prefixes: ["Pale", "Grave", "Hollow", "Last"],
		forms: ["Brand", "Toll", "Omen", "Vigil"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Idol", "Herald", "Esper", "Contractor"],
		mode: "sense",
		school: "Divination",
		theme: "social aura reading",
		prefixes: ["Aura", "Confession", "Crowd", "Intent"],
		forms: ["Read", "Lens", "Chorus", "Trace"],
		levels: FULL_LEVELS,
		ritual: true,
	},
];

const uniqueFamilies: SpellFamily[] = [
	{
		classes: ["Mage"],
		mode: "strike",
		school: "Evocation",
		theme: "formal arcane geometry",
		damageType: "force",
		prefixes: ["Archmage", "Formula", "Prism", "Leyline", "Axiom"],
		forms: ["Missile", "Matrix", "Flare", "Vector", "Nova"],
		levels: FULL_LEVELS,
	},
	{
		classes: ["Esper"],
		mode: "charm",
		school: "Enchantment",
		theme: "psionic pressure and altered perception",
		damageType: "psychic",
		prefixes: ["Thought", "Dream", "Neural", "Mirror", "Crown"],
		forms: [
			"Spike",
			"Maze",
			"Command",
			"Veil",
			"Anchor",
			"Fracture",
			"Bloom",
			"Pulse",
			"Prison",
		],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Revenant"],
		mode: "curse",
		school: "Necromancy",
		theme: "soul ash and death-scar resonance",
		damageType: "necrotic",
		prefixes: ["Ashen", "Sepulcher", "Wraith", "Epitaph", "Black"],
		forms: [
			"Touch",
			"Chain",
			"Lantern",
			"Crown",
			"Reaping",
			"Choir",
			"Gate",
			"Veil",
			"Throne",
			"Maw",
			"Dirge",
		],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Summoner"],
		mode: "summon",
		school: "Conjuration",
		theme: "contracted anomaly ecology",
		damageType: "force",
		prefixes: ["Pack", "Totem", "Bloom", "Star", "Hearth"],
		forms: ["Companion", "Swarm", "Avatar", "Nest", "Guardian", "Mandala"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Herald"],
		mode: "restore",
		school: "Evocation",
		theme: "Absolute radiance and mercy",
		prefixes: ["Sanctified", "Beacon", "Votive", "Judgment", "Grace"],
		forms: ["Light", "Rebuke", "Restoration", "Mandate", "Covenant", "Halo"],
		levels: FULL_LEVELS,
	},
	{
		classes: ["Idol"],
		mode: "charm",
		school: "Enchantment",
		theme: "stagecraft resonance",
		damageType: "psychic",
		prefixes: ["Encore", "Spotlight"],
		forms: ["Charm", "Duet", "Solo", "Curtain"],
		levels: FULL_LEVELS,
		concentration: true,
	},
	{
		classes: ["Contractor"],
		mode: "curse",
		school: "Necromancy",
		theme: "pact collateral and entity leverage",
		damageType: "necrotic",
		prefixes: ["Clause", "Debt"],
		forms: ["Brand", "Hook", "Seal", "Forfeit"],
		levels: HALF_LEVELS,
		concentration: true,
	},
	{
		classes: ["Holy Knight"],
		mode: "ward",
		school: "Abjuration",
		theme: "oathbound radiant guard",
		prefixes: ["Oath", "Valor", "Aegis", "Lion"],
		forms: ["Smite", "Bulwark", "Challenge", "Banner"],
		levels: HALF_LEVELS,
	},
	{
		classes: ["Stalker"],
		mode: "sense",
		school: "Divination",
		theme: "prey-lock tracking resonance",
		prefixes: ["Trail", "Quarry"],
		forms: ["Mark", "Scent", "Snare", "Vantage"],
		levels: HALF_LEVELS,
		ritual: true,
	},
];

const spellSeeds = [...families, ...uniqueFamilies].flatMap(makeSeedFamily);

export const spells_supplemental: CompendiumSpell[] = spellSeeds.map(makeSpell);
