/**
 * Bake explicit resolution mechanics into spells whose resolution was only
 * derived at runtime by the provider (deriveSpellResolution). This makes the
 * SOURCE DATA self-complete for 5e — the provider's derivation becomes a
 * redundant safety net rather than load-bearing. Behaviour is unchanged: the
 * baked resolution is exactly what the provider would derive (attack / save /
 * healing), or an explicit utility block for pure-utility spells.
 *
 * Run: npx tsx scripts/bake-spell-resolution.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spells } from "../src/data/compendium/spells";
import { deriveSpellResolution } from "../src/lib/spellMechanicsDerivation";

interface Rec {
	[key: string]: unknown;
	id?: string;
	description?: string | null;
	effect?: string | null;
	type?: string | null;
	effects?: { primary?: string | null } | null;
}

const isRecord = (v: unknown): v is Rec =>
	!!v && typeof v === "object" && !Array.isArray(v);

// Mirror auditCastableEntry's "has a resolution?" test.
function hasResolution(s: Rec): boolean {
	const m = isRecord(s.mechanics) ? s.mechanics : {};
	return Boolean(
		(isRecord(s.attack) && s.attack) ||
			(isRecord(s.spell_attack) && s.spell_attack) ||
			(isRecord(s.saving_throw) && s.saving_throw) ||
			isRecord(m.attack) ||
			isRecord(m.saving_throw) ||
			isRecord(m.healing) ||
			isRecord(m.utility) ||
			isRecord(m.resolution),
	);
}

const firstSentence = (text: string): string => {
	const t = text.trim().replace(/\s+/g, " ");
	const idx = t.indexOf(". ");
	return idx > 0 ? t.slice(0, idx + 1) : t;
};

// Build the resolution object the data should carry, from the spell's prose.
function buildResolution(s: Rec): Rec {
	const derived = deriveSpellResolution(s);
	if (derived.attack) {
		return {
			type: "spell_attack",
			mode: derived.attack.mode ?? "ranged",
			damage: derived.attack.damage ?? "",
			damage_type: derived.attack.damage_type ?? "",
			...(derived.attack.modifier ? { ability: derived.attack.modifier } : {}),
		};
	}
	if (derived.saving_throw) {
		return {
			type: "saving_throw",
			ability: derived.saving_throw.ability,
			dc: derived.saving_throw.dc,
		};
	}
	if (derived.healing) {
		return { type: "healing", dice: derived.healing.dice };
	}
	// Pure utility: resolve via the authored effect.
	const effect =
		(typeof s.effects?.primary === "string" && s.effects.primary) ||
		(typeof s.description === "string" && firstSentence(s.description)) ||
		"Resolves via the spell's described effect.";
	return { type: "utility", effect };
}

const targets = new Map<string, Rec>();
for (const s of spells as unknown as Rec[]) {
	if (!hasResolution(s) && typeof s.id === "string")
		targets.set(s.id, buildResolution(s));
}
console.log(`Spells needing baked resolution: ${targets.size}`);

// Serialize a flat resolution object as a single-line TS literal.
const serialize = (obj: Rec): string => {
	const parts = Object.entries(obj).map(([k, v]) =>
		typeof v === "number" ? `${k}: ${v}` : `${k}: ${JSON.stringify(v)}`,
	);
	return `{ ${parts.join(", ")} }`;
};

const files = ["rank-d.ts", "supplemental.ts", "archetype.ts"];
let inserted = 0;
for (const file of files) {
	const path = join(process.cwd(), "src", "data", "compendium", "spells", file);
	let text: string;
	try {
		text = readFileSync(path, "utf8");
	} catch {
		continue;
	}
	const lines = text.split("\n");
	const insertions: Array<{ at: number; indent: string; id: string }> = [];
	let pendingId: string | null = null;
	for (let i = 0; i < lines.length; i += 1) {
		const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)"/);
		if (idMatch) {
			pendingId = targets.has(idMatch[1]) ? idMatch[1] : null;
			continue;
		}
		if (pendingId) {
			const mechMatch = lines[i].match(/^(\s*)mechanics:\s*\{/);
			if (mechMatch) {
				insertions.push({
					at: i,
					indent: `${mechMatch[1]}\t`,
					id: pendingId,
				});
				pendingId = null;
			}
		}
	}
	for (let k = insertions.length - 1; k >= 0; k -= 1) {
		const { at, indent, id } = insertions[k];
		const res = targets.get(id);
		if (!res) continue;
		lines.splice(at + 1, 0, `${indent}resolution: ${serialize(res)},`);
	}
	if (insertions.length > 0) {
		writeFileSync(path, lines.join("\n"), "utf8");
		inserted += insertions.length;
		console.log(`${file}: inserted ${insertions.length}`);
	}
}
console.log(`done — baked ${inserted} resolution blocks`);
