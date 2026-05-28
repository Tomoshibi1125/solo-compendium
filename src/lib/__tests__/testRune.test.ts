import { test } from "vitest";
import { catalogAuthoredAbilityRunes } from "@/data/compendium/runes";

test("check rune", () => {
  const rune = catalogAuthoredAbilityRunes.find(r => r.id === "rune-spell-spell-sup-1-17-shield-lattice");
  console.log(rune?.name);
  console.log("length:", rune?.discovery_lore?.length ?? 0);
  console.log("lore:", rune?.discovery_lore);
});
