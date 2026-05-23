(globalThis as any).__SOLO_COMPENDIUM_ENV__ = { VITE_SUPABASE_URL: "http://localhost", VITE_SUPABASE_ANON_KEY: "key" };
(globalThis as any).import = { meta: { env: {} } };
import { listLearnableSpells } from "./src/lib/canonicalCompendium";

async function main() {
  const spells = await listLearnableSpells({
    jobName: "Idol",
    characterLevel: 1,
  });
  console.log("Spells found:", spells.length);
  spells.forEach(s => console.log(s.name, "level:", s.power_level));
}
main().catch(console.error);
