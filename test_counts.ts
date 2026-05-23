(globalThis as any).__SOLO_COMPENDIUM_ENV__ = {
	VITE_SUPABASE_URL: "http://localhost",
	VITE_SUPABASE_ANON_KEY: "key",
};
(globalThis as any).import = { meta: { env: {} } };

import { staticDataProvider } from "./src/data/compendium/staticDataProvider";

async function main() {
	const spells = await staticDataProvider.getSpells();
	const powers = await staticDataProvider.getPowers();
	const techniques = await staticDataProvider.getTechniques();

	const countClasses = (arr: any[], job: string) => {
		return arr.filter((item) => {
			if (!item.classes) return false;
			return item.classes.some(
				(c: string) => c.toLowerCase() === job.toLowerCase(),
			);
		});
	};

	const idolSpells = countClasses(spells, "idol");
	console.log(`Idol Spells: ${idolSpells.length}`);
	const levels = idolSpells.reduce(
		(acc, s) => {
			const lvl = s.level ?? 0;
			acc[lvl] = (acc[lvl] || 0) + 1;
			return acc;
		},
		{} as Record<number, number>,
	);
	console.log("Idol Spell Levels:", levels);

	const idolPowers = countClasses(powers, "idol");
	console.log(`Idol Powers: ${idolPowers.length}`);

	const mageSpells = countClasses(spells, "mage");
	console.log(`Mage Spells: ${mageSpells.length}`);
}
main().catch(console.error);
