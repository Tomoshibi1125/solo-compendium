// Quick audit: count entries per category & check for duplicate descriptions
import("../src/data/compendium/feats-comprehensive.js")
	.then((m) => {
		const feats = m.comprehensiveFeats;
		console.log(`\n=== FEATS: ${feats.length} entries ===`);
		const descs = feats.map((f) => f.description);
		const uniqueDescs = new Set(descs);
		console.log(`  Unique descriptions: ${uniqueDescs.size}/${feats.length}`);
		const flavors = feats.map((f) => f.flavor).filter(Boolean);
		const uniqueFlavors = new Set(flavors);
		console.log(`  Unique flavors: ${uniqueFlavors.size}/${flavors.length}`);
		const lores = feats.map((f) => f.discovery_lore).filter(Boolean);
		const uniqueLores = new Set(lores);
		console.log(`  Unique discovery_lore: ${uniqueLores.size}/${lores.length}`);

		// Show duplicate descriptions if any
		const descCounts = {};
		for (const d of descs) {
			descCounts[d] = (descCounts[d] || 0) + 1;
		}
		const dupes = Object.entries(descCounts).filter(([_, c]) => c > 1);
		if (dupes.length > 0) {
			console.log(`  !! ${dupes.length} duplicate descriptions found:`);
			dupes.forEach(([desc, count]) =>
				console.log(`     ${count}x: "${desc.substring(0, 60)}..."`),
			);
		} else {
			console.log(`  ✓ No duplicate descriptions`);
		}
	})
	.catch((e) => console.error("Feat load error:", e.message));
