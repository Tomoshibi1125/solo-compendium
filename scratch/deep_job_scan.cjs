const fs = require("fs");
const raw = fs.readFileSync("src/data/compendium/jobs.ts", "utf-8");

const jobBlocks = raw.split(/\n\t\{/).filter((b) => b.includes("type:"));

for (const block of jobBlocks) {
	const idM = block.match(/id:\s*["'`]([^"'`]+)["'`]/);
	const nameM = block.match(/\bname:\s*["'`]([^"'`]+)["'`]/);
	if (!idM || !nameM) continue;
	if (!block.includes("hitDie:")) continue; // skip non-job blocks

	const name = nameM[1];
	const hitDieM = block.match(/hitDie:\s*["'`]([^"'`]+)["'`]/);
	const primaryM = block.match(/primaryAbility:\s*["'`]([^"'`]+)["'`]/);
	const hasSpellcasting = block.includes("spellcasting:");
	const hasPowersKnown = block.includes("powersKnown:");
	const hasTechniquesKnown = block.includes("techniquesKnown:");
	const hasFightingStyle =
		block.includes("Fighting Style") || block.includes("fighting-style");
	const hasSpellbook = block.includes("spellbook:");
	const savesM = block.match(/saving_throws:\s*\[([^\]]+)\]/);
	const armorM = block.match(/armorProficiencies:\s*\[([^\]]+)\]/);
	const weaponM = block.match(/weaponProficiencies:\s*\[([^\]]+)\]/);

	// Spellcasting ability
	const spellAbilityM = block.match(
		/spellcasting:\s*\{[^}]*ability:\s*["'`]([^"'`]+)["'`]/s,
	);

	// powersKnown max
	const powersKnownM = block.match(/powersKnown:\s*\[([^\]]+)\]/);
	let maxPowers = 0;
	if (powersKnownM) {
		maxPowers = Math.max(
			...powersKnownM[1].split(",").map((v) => parseInt(v.trim())),
		);
	}
	const techniquesKnownM = block.match(/techniquesKnown:\s*\[([^\]]+)\]/);
	let maxTech = 0;
	if (techniquesKnownM) {
		maxTech = Math.max(
			...techniquesKnownM[1].split(",").map((v) => parseInt(v.trim())),
		);
	}

	// Determine category
	let category;
	if (hasSpellcasting && hasPowersKnown && hasTechniquesKnown) {
		category = "HYBRID (spells+powers+techniques)";
	} else if (hasSpellcasting && !hasPowersKnown) {
		category = "CASTER (spells only)";
	} else if (!hasSpellcasting && hasPowersKnown) {
		category = "MARTIAL (powers+techniques only)";
	} else {
		category = "OTHER";
	}

	const spellAbility = spellAbilityM ? spellAbilityM[1] : "N/A";

	console.log(
		`${name.padEnd(16)} | ${(hitDieM ? hitDieM[1] : "?").padEnd(4)} | primary=${(primaryM ? primaryM[1] : "?").padEnd(14)} | saves=${savesM ? savesM[1].replace(/"/g, "").trim() : ""}`,
	);
	console.log(
		`${"".padEnd(16)} | spells=${hasSpellcasting ? "YES" : "no "} (${spellAbility.padEnd(13)}) | powers=${hasPowersKnown ? `YES(max ${maxPowers})` : " no      "} | tech=${hasTechniquesKnown ? `YES(max ${maxTech})` : " no      "} | fightStyle=${hasFightingStyle ? "YES" : "no "} | spellbook=${hasSpellbook ? "YES" : "no "}`,
	);
	console.log(`${"".padEnd(16)} | => ${category}`);
	console.log("");
}
