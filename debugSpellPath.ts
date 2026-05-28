import { listCanonicalSpells, isCanonicalSpellLearnable } from "./src/lib/canonicalCompendium";
import { PATH_ABILITY_GRANTS } from "./src/lib/pathAbilityAccess";

async function main() {
  const spells = await listCanonicalSpells();
  const mageSpells = spells.filter((entry) => {
    const classes = (entry as { classes?: unknown }).classes;
    const school = (entry as { school?: unknown }).school;
    return (
      entry.power_level === 1 &&
      Array.isArray(classes) &&
      classes.includes("Mage") &&
      (school === "Abjuration" || school === "Evocation")
    );
  });
  
  const grantedSpell = mageSpells[0];
  console.log('Spell:', grantedSpell.name);
  console.log('Spell details:', JSON.stringify(grantedSpell, null, 2));

  const options = {
    jobName: "Destroyer",
    pathName: "Path of the Spell Breaker",
    characterLevel: 3,
  };
  
  const res = isCanonicalSpellLearnable(grantedSpell, options);
  console.log('Learnable:', res);
}

main().catch(console.error);
