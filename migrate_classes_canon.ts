import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const sourceFiles = [
    ...project.getSourceFiles("src/data/compendium/spells/**/*.ts"),
    ...project.getSourceFiles("src/data/compendium/powers*.ts"),
    ...project.getSourceFiles("src/data/compendium/techniques*.ts")
];

let modifiedCount = 0;

function deriveClasses(text: string, school: string = "", isSpell: boolean, isPower: boolean, isTechnique: boolean): string[] {
    const tags = new Set<string>();
    const lowerText = text.toLowerCase();
    const lowerSchool = school.toLowerCase();

    // 1. MAGE (Wizard/Sorcerer - Arcane, Elemental, Utility)
    if (isSpell && (/fire|ice|frost|lightning|thunder|bolt|blast|storm|force|beam|ray|burn|scorch|ignite|freeze|tempest|arcane|mana|lance|wave|shield|barrier|protect|detect|identify|comprehend|teleport|polymorph|time|magic missile|wall of/.test(lowerText) || /evocation|abjuration|transmutation|divination/.test(lowerSchool))) {
        tags.add("Mage");
    }

    // 2. ESPER (Sorcerer/Psion - Psychic, Force, Reality Distortion, Chaos)
    if (isSpell || isPower) {
        if (/mind|charm|command|compel|dominate|stun|sleep|suggest|fear|frighten|psychic|telepath|reality|distortion|chaos|psionic|telekinesis|levitate|confusion/.test(lowerText) || /enchantment|illusion/.test(lowerSchool)) {
            tags.add("Esper");
        }
    }

    // 3. REVENANT (Necromancer - Death, Void, Entropy, Decay)
    if (/void|shadow|necrot|death|undead|wither|drain|blight|curse|soul|phantom|decay|entropy|reaper|life drain|bone/.test(lowerText) || /necromancy/.test(lowerSchool)) {
        tags.add("Revenant");
        // Ensure Herald is REMOVED if this is necrotic
    }

    // 4. SUMMONER (Druid - Nature, Beasts, Elements, Summoning, Shapeshifting)
    if (/summon|conjur|beast|spirit|nature|plant|animal|earth|stone|water|wind|shapechange|druid|barkskin|entangle/.test(lowerText) || /conjuration|transmutation/.test(lowerSchool)) {
        tags.add("Summoner");
    }

    // 5. HOLY KNIGHT (Paladin - Radiant, Auras, Smites, Defense)
    if (/radiant|holy|divine|celestial|seraph|sanctified|aegis|smite|aura|warding|covenant|crusader|templar/.test(lowerText)) {
        tags.add("Holy Knight");
    }

    // 6. TECHNOMANCER (Artificer - Gadgets, Tech, Transmutation, Utility)
    if (/nanite|quantum|glitch|plasma|current|device|lattice|forge|construct|gadget|tech|machine|repair|mending/.test(lowerText) || (isSpell && /transmutation/.test(lowerSchool))) {
        tags.add("Technomancer");
    }

    // 7. IDOL (Bard - Music, Charm, Illusion, Healing, Buffs)
    if (/music|song|voice|idol|charm|inspire|morale|performance|sonic|rhythm|dance|hype|melody|resonance/.test(lowerText) || (isSpell && (/enchantment|illusion/.test(lowerSchool)))) {
        tags.add("Idol");
    }

    // 8. HERALD (Cleric - Pure Holy, Radiant, Healing, Abjuration - NO Necromancy)
    let isHealingOrHoly = /heal|restore|cure|mend|revive|vitality|blessing|sanctuary|holy|divine|radiant|sacred|purif|soothe|prayer|mass cure/.test(lowerText);
    if (isHealingOrHoly && !tags.has("Revenant") && !/necrotic|undead/.test(lowerText)) {
        tags.add("Herald");
    }

    // 9. CONTRACTOR (Warlock - Pacts, Eldritch, Dark Magic, Dimensional)
    if (/demon|abyssal|portal|gate|call|manifest|rift|warlock|eldritch|pact|curse|fiend|fey|hex/.test(lowerText)) {
        tags.add("Contractor");
    }

    // 10. ASSASSIN (Rogue - Stealth, Phase, Shadow, Assassination)
    if (isPower || isTechnique || isSpell) {
        if (/shadow|umbral|phantom|stealth|invisibility|sneak|assassin|phase|precision|execute|hide|dagger|backstab/.test(lowerText)) {
            tags.add("Assassin");
        }
    }

    // 11. STALKER (Ranger - Tracking, Archery, Survival)
    if (isPower || isTechnique || isSpell) {
        if (/prey|tracking|sight|echo|beast|wild|pursuit|archery|arrow|bow|hunter|ranger|snare|trap/.test(lowerText)) {
            tags.add("Stalker");
        }
    }

    // 12. STRIKER (Monk - Unarmed, Kinetic force)
    if (isPower || isTechnique) {
        if (/kinetic|force|neuro|nerve|ki|gravity|punch|fist|unarmed|speed|dash|monk|martial arts/.test(lowerText)) {
            tags.add("Striker");
        }
    }

    // 13. BERSERKER (Barbarian - Rage, Overload)
    if (isPower || isTechnique) {
        if (/rage|overload|thermal|dragon|supernova|demonic|lycan|brutal|frenzy|barbarian/.test(lowerText)) {
            tags.add("Berserker");
        }
    }

    // 14. DESTROYER (Fighter - Heavy Weapons, Defense, Vanguard)
    if (isPower || isTechnique) {
        if (/bulwark|carapace|titan|obsidian|wall|shield|aegis|vanguard|siege|heavy|fighter|warrior|cleave|slam|parry/.test(lowerText)) {
            tags.add("Destroyer");
        }
    }

    // Give Healing spells to Idol, Summoner, Holy Knight as well
    if (isHealingOrHoly && !tags.has("Revenant") && !/necrotic|undead/.test(lowerText)) {
        tags.add("Idol");
        tags.add("Summoner");
        tags.add("Holy Knight");
    }

    // Fallbacks
    if (tags.size === 0) {
        if (isSpell) tags.add("Mage");
        if (isPower) tags.add("Destroyer");
        if (isTechnique) tags.add("Destroyer");
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
        const initializer = decl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!initializer) continue;
        
        const elements = initializer.getElements();
        for (const element of elements) {
            if (element.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
            
            const obj = element as ObjectLiteralExpression;
            
            let textContext = "";
            let schoolContext = "";

            obj.getProperties().forEach(prop => {
                if (prop.getKind() === SyntaxKind.PropertyAssignment) {
                    const p = prop as PropertyAssignment;
                    if (["id", "name", "description", "tags", "theme_tags", "mechanics"].includes(p.getName())) {
                        textContext += p.getInitializer()?.getText() || "";
                    }
                    if (p.getName() === "school") {
                        schoolContext = p.getInitializer()?.getText() || "";
                    }
                }
            });

            const derivedClasses = deriveClasses(textContext, schoolContext, isSpell, isPower, isTechnique);
            
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
                initializer: classesString
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

console.log(`Successfully updated 'classes' for ${modifiedCount} ability entries.`);
