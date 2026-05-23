import {
	type ObjectLiteralExpression,
	Project,
	type PropertyAssignment,
	SyntaxKind,
} from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const sourceFiles = [
	...project.getSourceFiles("src/data/compendium/spells/**/*.ts"),
	...project.getSourceFiles("src/data/compendium/powers*.ts"),
	...project.getSourceFiles("src/data/compendium/techniques*.ts"),
];

let modifiedCount = 0;

function deriveClasses(
	text: string,
	school: string = "",
	name: string = "",
	isSpell: boolean,
	isPower: boolean,
	isTechnique: boolean,
): string[] {
	const tags = new Set<string>();
	const lowerText = text.toLowerCase();
	const lowerSchool = school.toLowerCase();
	const lowerName = name.toLowerCase();

	const isHoly =
		/radiant|holy|divine|celestial|seraph|sanctified|aegis|smite|aura|warding|covenant|crusader|templar/.test(
			lowerText,
		) || /radiant/.test(lowerName);
	const isHealing =
		/heal|restore|cure|mend|revive|vitality|blessing|sanctuary|holy|divine|radiant|sacred|purif|soothe|prayer|mass cure/.test(
			lowerText,
		);
	const isNecrotic =
		/void|shadow|necrot|death|undead|wither|drain|blight|curse|soul|phantom|decay|entropy|reaper|life drain|bone/.test(
			lowerText,
		) ||
		/necromancy/.test(lowerSchool) ||
		/entropic|wither/.test(lowerName);
	const isNature =
		/summon|conjur|beast|spirit|nature|plant|animal|earth|stone|water|wind|shapechange|druid|barkskin|entangle|biome|apex/.test(
			lowerText,
		) || /conjuration/.test(lowerSchool);
	const isTech =
		/nanite|quantum|glitch|plasma|current|device|lattice|forge|construct|gadget|tech|machine|repair|mending|circuit/.test(
			lowerText,
		);
	const isMind =
		/mind|charm|command|compel|dominate|stun|sleep|suggest|fear|frighten|psychic|telepath|reality|distortion|chaos|psionic|telekinesis|levitate|confusion/.test(
			lowerText,
		);
	const isArcane =
		/fire|ice|frost|lightning|thunder|bolt|blast|storm|force|beam|ray|burn|scorch|ignite|freeze|tempest|arcane|mana|lance|wave|shield|barrier|protect|detect|identify|comprehend|teleport|polymorph|time/.test(
			lowerText,
		) || /evocation|abjuration|divination/.test(lowerSchool);

	if (isSpell) {
		// FULL CASTERS
		if (isArcane) tags.add("Mage");
		if (isMind || /enchantment|illusion/.test(lowerSchool)) tags.add("Esper");
		if (isNecrotic) tags.add("Revenant");
		if (isNature || /transmutation/.test(lowerSchool)) tags.add("Summoner");
		if (
			/demon|abyssal|portal|gate|call|manifest|rift|warlock|eldritch|pact|curse|fiend|fey|hex/.test(
				lowerText,
			)
		)
			tags.add("Contractor");
		if (
			/music|song|voice|idol|charm|inspire|morale|performance|sonic|rhythm|dance|hype|melody|resonance/.test(
				lowerText,
			) ||
			/enchantment|illusion/.test(lowerSchool) ||
			isHealing
		)
			tags.add("Idol");
		if ((isHealing || isHoly) && !isNecrotic) tags.add("Herald");

		// HALF CASTERS
		if (isHoly) tags.add("Holy Knight");
		if (
			/prey|tracking|sight|echo|beast|wild|pursuit|archery|arrow|bow|hunter|ranger|snare|trap/.test(
				lowerText,
			)
		)
			tags.add("Stalker");
		if (isTech || /transmutation/.test(lowerSchool)) tags.add("Technomancer");
	}

	if (isPower || isTechnique) {
		// PURE MARTIALS
		if (
			/bulwark|carapace|titan|obsidian|wall|shield|aegis|vanguard|siege|heavy|fighter|warrior|cleave|slam|parry/.test(
				lowerText,
			) ||
			/strike|blow/.test(lowerName)
		)
			tags.add("Destroyer");
		if (
			/rage|overload|thermal|dragon|supernova|demonic|lycan|brutal|frenzy|barbarian/.test(
				lowerText,
			) ||
			/fury/.test(lowerName)
		)
			tags.add("Berserker");
		if (
			/shadow|umbral|phantom|stealth|invisibility|sneak|assassin|phase|precision|execute|hide|dagger|backstab/.test(
				lowerText,
			)
		)
			tags.add("Assassin");
		if (
			/kinetic|force|neuro|nerve|ki|gravity|punch|fist|unarmed|speed|dash|monk|martial arts/.test(
				lowerText,
			)
		)
			tags.add("Striker");

		// HALF CASTERS
		if (isHoly) tags.add("Holy Knight");
		if (
			/prey|tracking|sight|echo|beast|wild|pursuit|archery|arrow|bow|hunter|ranger|snare|trap/.test(
				lowerText,
			)
		)
			tags.add("Stalker");
		if (isTech) tags.add("Technomancer");
	}

	// Give Healing spells to Idol, Summoner, Holy Knight as well
	if (isSpell && isHealing && !isNecrotic) {
		tags.add("Idol");
		tags.add("Summoner");
		tags.add("Holy Knight");
	}

	// Explicitly do NOT fallback for Powers to prevent them from bleeding into general pools.
	// If a power has no tags, it's highly likely it is mapped explicitly via entryNames in paths.ts
	// (e.g. "Dissonant Strike" for Idol, "Cursed Blade Edge" for Contractor).
	if (tags.size === 0) {
		if (isSpell) tags.add("Mage");
		// For martial abilities with generic text, fallback to Destroyer
		if (isPower || isTechnique) tags.add("Destroyer");
	}

	// HARD ISOLATION RULE: Ensure absolutely NO crossover.
	if (isSpell) {
		tags.delete("Destroyer");
		tags.delete("Berserker");
		tags.delete("Assassin");
		tags.delete("Striker");
	}
	if (isPower || isTechnique) {
		tags.delete("Mage");
		tags.delete("Esper");
		tags.delete("Revenant");
		tags.delete("Herald");
		tags.delete("Summoner");
		tags.delete("Contractor");
		tags.delete("Idol");
	}

	return Array.from(tags);
}

for (const sourceFile of sourceFiles) {
	let fileModified = false;
	const isSpell = sourceFile.getFilePath().includes("spells");
	const isPower = sourceFile.getFilePath().includes("powers");
	const isTechnique = sourceFile.getFilePath().includes("techniques");

	const declarations = sourceFile.getVariableDeclarations();
	for (const decl of declarations) {
		const initializer = decl.getInitializerIfKind(
			SyntaxKind.ArrayLiteralExpression,
		);
		if (!initializer) continue;

		const elements = initializer.getElements();
		for (const element of elements) {
			if (element.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;

			const obj = element as ObjectLiteralExpression;

			let textContext = "";
			let schoolContext = "";
			let nameContext = "";

			obj.getProperties().forEach((prop) => {
				if (prop.getKind() === SyntaxKind.PropertyAssignment) {
					const p = prop as PropertyAssignment;
					if (p.getName() === "name") {
						nameContext = p.getInitializer()?.getText() || "";
					}
					if (
						[
							"id",
							"name",
							"description",
							"tags",
							"theme_tags",
							"mechanics",
						].includes(p.getName())
					) {
						textContext += p.getInitializer()?.getText() || "";
					}
					if (p.getName() === "school") {
						schoolContext = p.getInitializer()?.getText() || "";
					}
				}
			});

			const derivedClasses = deriveClasses(
				textContext,
				schoolContext,
				nameContext,
				isSpell,
				isPower,
				isTechnique,
			);

			// Remove existing classes array
			const existingClasses = obj.getProperty("classes");
			if (existingClasses) {
				existingClasses.remove();
			}

			// Insert new classes
			const idProp = obj.getProperty("id") || obj.getProperty("name");
			const index = idProp ? obj.getProperties().indexOf(idProp) : 0;

			const classesString = `[${derivedClasses.map((t: string) => `"${t}"`).join(", ")}]`;

			obj.insertPropertyAssignment(index + 1, {
				name: "classes",
				initializer: classesString,
			});

			fileModified = true;
			modifiedCount++;
		}
	}

	if (fileModified) {
		console.log(`Saving changes to ${sourceFile.getBaseName()}`);
		sourceFile.saveSync();
	}
}

console.log(
	`Successfully updated 'classes' for ${modifiedCount} ability entries.`,
);
