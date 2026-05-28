import { listLearnableSpells, listLearnablePowers, listLearnableTechniques } from "./src/lib/canonicalCompendium";
import { getJobAbilityAccess } from "./src/lib/jobAbilityAccess";

async function run() {
  console.log("Idol Spell Access:", getJobAbilityAccess("Idol"));
  const spells = await listLearnableSpells({
    jobName: "Idol",
    characterLevel: 1,
  });
  console.log("Idol Spells Found:", spells.length);
  if (spells.length > 0) {
      console.log("First spell:", spells[0].name);
  }

  console.log("Destroyer Power Access:", getJobAbilityAccess("Destroyer"));
  const powers = await listLearnablePowers({
    jobName: "Destroyer",
    characterLevel: 1,
  });
  console.log("Destroyer Powers Found:", powers.length);
}

run().catch(console.error);
