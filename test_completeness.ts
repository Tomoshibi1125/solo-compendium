(globalThis as any).__SOLO_COMPENDIUM_ENV__ = { VITE_SUPABASE_URL: "http://localhost", VITE_SUPABASE_ANON_KEY: "key" };
(globalThis as any).import = { meta: { env: {} } };

import { spells_supplemental } from "./src/data/compendium/spells/supplemental";
import { transformSpell } from "./src/data/compendium/staticDataProvider";
import { normalizeCastableEntry, validateAbilityCompleteness } from "./src/lib/canonicalCompendium";

const healingResonance = spells_supplemental.find(s => s.name === "Healing Resonance");
const transformed = transformSpell(healingResonance as any);
const canonical = normalizeCastableEntry(transformed, "spells");
const issues = validateAbilityCompleteness(canonical, "spell");
console.log("Issues:", issues);
