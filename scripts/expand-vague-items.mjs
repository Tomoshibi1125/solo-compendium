// Phase 1a de-vague: replace bare 5e-category catch-all items with concrete,
// bespoke specifics that fit the Rift Ascendant setting (modern, not medieval).
// 5e ships a concrete instrument/focus table instead of a generic "Musical
// Instrument" / "Arcane Focus"; RA does the same, but its Idols are modern
// performers (electric guitars, synths, DJ rigs — kin to the ring lights and
// streaming laptops already in the catalog), and its casters channel mana, not
// medieval mistletoe. Each new entry is a clean base record run through the
// loot `enrichItemPayload` engine for an audit-valid ra-item-v1 payload.
//
// Idempotent: re-running removes any prior expansion output (by id prefix) and
// re-adds the current specs.
//
// Usage: node scripts/expand-vague-items.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { assignImage } from "./loot/lib.mjs";
import { enrichItemPayload } from "./loot/rebuild.mjs";
import { serializeArrayBody } from "./loot/serializer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(
	__dirname,
	"..",
	"src",
	"data",
	"compendium",
	"items-base-equipment.ts",
);

// Any entry matching one of these is prior expansion output (the original vague
// catch-alls or a previous run) and is removed before re-adding current specs.
const VAGUE_IDS = new Set([
	"base-tool-instrument",
	"base-focus-arcane",
	"base-focus-primal",
	"base-focus-system",
]);
const isExpansionId = (id) =>
	VAGUE_IDS.has(id) ||
	/^base-instrument-/.test(id) ||
	/^base-focus-(arcane|primal|order)-/.test(id);

const INSTRUMENT_EFFECT =
	"Serves as an Idol performance rig. While proficient with it, you use it for Performance checks and as the focus for Idol frequency abilities.";
const ARCANE_EFFECT =
	"Functions as an arcane focus; a Mage, Esper, or other arcane caster may use it in place of non-costly material components.";
const PRIMAL_EFFECT =
	"Functions as a primal focus; a Summoner may use it in place of non-costly material components when calling gate-born creatures.";
const ORDER_EFFECT =
	"Functions as an order focus; a Herald must hold or visibly wear it to channel the Rift's protocols in place of non-costly material components.";

// [idSuffix, name, item_type, weight, crystal, description, effect]
const SPECS = [
	// --- Idol instruments (modern performance rigs; item_type "tool") ---
	[
		"instrument-electric-guitar",
		"Electric Guitar",
		"tool",
		6,
		350,
		"A mana-wired electric guitar; an Idol shapes its amplified resonance into frequency abilities on stage or mid-clear.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-synthesizer",
		"Synthesizer",
		"tool",
		8,
		400,
		"A programmable synth whose layered waveforms let an Idol tune crowd and combat frequencies alike.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-dj-controller",
		"DJ Controller",
		"tool",
		5,
		300,
		"A dual-deck controller for beat-matching and drops, favored by Idols who fight to a rhythm they set themselves.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-stage-mic",
		"Stage Microphone",
		"tool",
		1,
		120,
		"A wireless stage mic tuned to carry an Idol's voice — and their frequency work — over any crowd or gate-roar.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-drum-machine",
		"Drum Machine",
		"tool",
		3,
		200,
		"A pad-based beat machine; each programmed hit lands like a metronome for an Idol's timing-based abilities.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-loop-pedal",
		"Loop Pedal",
		"tool",
		2,
		150,
		"A foot-triggered loop station that layers an Idol's phrases into a self-sustaining wall of sound.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-bass-guitar",
		"Bass Guitar",
		"tool",
		8,
		300,
		"A low-end mana-wired bass whose sub-frequencies an Idol uses to rattle nerves and steady allies.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-portable-amp",
		"Portable Amp",
		"tool",
		10,
		250,
		"A battery-run busker's amp that pushes an Idol's frequencies loud enough to fill a plaza or a gate chamber.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-vocoder",
		"Vocoder",
		"tool",
		2,
		220,
		"A hand-held vocoder that reshapes an Idol's voice into layered harmonics for precise frequency control.",
		INSTRUMENT_EFFECT,
	],
	[
		"instrument-sampler-pad",
		"Sampler Pad",
		"tool",
		3,
		200,
		"A velocity-sensitive sampler an Idol loads with captured sounds — sirens, cheers, gate-hums — to trigger on cue.",
		INSTRUMENT_EFFECT,
	],

	// --- Arcane foci (Mage / Esper) ---
	[
		"focus-arcane-crystal",
		"Mana Crystal",
		"misc",
		1,
		100,
		"A faceted mana crystal cut to channel arcane current cleanly; standard issue for Bureau-trained Mages.",
		ARCANE_EFFECT,
	],
	[
		"focus-arcane-orb",
		"Lattice Orb",
		"misc",
		3,
		120,
		"A polished orb threaded with lattice-glass filaments that gather raw mana into a caster's intent.",
		ARCANE_EFFECT,
	],
	[
		"focus-arcane-coil",
		"Resonance Coil",
		"misc",
		1,
		100,
		"A palm-sized coil of conductive filament that hums to a caster's mana, tightening loose workings into shape.",
		ARCANE_EFFECT,
	],

	// --- Primal foci (Summoner — gate-ecosystem command) ---
	[
		"focus-primal-fang",
		"Gate-Beast Fang",
		"misc",
		1,
		50,
		"A fang pulled from a tamed gate-beast, still warm with its instincts; a Summoner channels the wild through it.",
		PRIMAL_EFFECT,
	],
	[
		"focus-primal-core-shard",
		"Anomaly Core Shard",
		"misc",
		1,
		60,
		"A shard of a cleared anomaly's core that a Summoner uses to call and command gate-born creatures.",
		PRIMAL_EFFECT,
	],
	[
		"focus-primal-collar",
		"Bonded Tamer's Collar",
		"misc",
		1,
		50,
		"A worn field collar keyed to a Summoner's bonded companions, humming with the pack's shared mana.",
		PRIMAL_EFFECT,
	],

	// --- Order foci (Herald — Bureau field chaplain) ---
	[
		"focus-order-emblem",
		"Bureau Emblem",
		"misc",
		1,
		50,
		"A cast-metal emblem of a Herald's chartered order, worn openly as a mark of sanctioned authority.",
		ORDER_EFFECT,
	],
	[
		"focus-order-insignia",
		"Herald's Insignia",
		"misc",
		1,
		50,
		"A field insignia stamped with a Herald's oath-sigil — the focus through which they run the Rift's healing protocols.",
		ORDER_EFFECT,
	],
	[
		"focus-order-core",
		"Sanctified Core",
		"misc",
		1,
		60,
		"A cleared anomaly core consecrated in a Rift-purging rite, cool and quietly luminous in a Herald's hand.",
		ORDER_EFFECT,
	],
];

function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	const arr = Function(`"use strict"; return (${m[1]});`)();
	return { arr, header: text.slice(0, m.index) };
}

function buildBaseRecord([
	idSuffix,
	name,
	itemType,
	weight,
	amount,
	description,
	effect,
]) {
	const id = `base-${idSuffix}`;
	return {
		id,
		name,
		source_book: "Rift Ascendant Canon",
		description,
		rarity: "common",
		type: "wondrous",
		image: assignImage("items-base-equipment.ts", id, name),
		weight,
		value: { currency: "crystal", amount },
		item_type: itemType,
		sigil_slots_base: 0,
		properties: {},
		effects: { passive: [effect] },
	};
}

const { arr, header } = parseItemArrayFile(FILE, "baseEquipment");
const kept = arr.filter((e) => !isExpansionId(e.id));
const removed = arr.length - kept.length;
const added = SPECS.map((spec) =>
	enrichItemPayload(buildBaseRecord(spec), "items-base-equipment.ts"),
);
const out = [...kept, ...added];

const body = serializeArrayBody(out, 1);
writeFileSync(
	FILE,
	`${header.replace(/\n+$/, "\n")}\nexport const baseEquipment: Item[] = [\n${body},\n];\n`,
	"utf8",
);
console.log(
	`items-base-equipment.ts: removed ${removed} prior/vague entries, added ${added.length} concrete RA items (total ${out.length}).`,
);
