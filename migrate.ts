import { Project, ObjectLiteralExpression, PropertyAssignment, SyntaxKind } from "ts-morph";
import { getDerivedSpellTags, getDerivedTechniqueTags, getDerivedPowerTags } from './src/lib/jobAbilityAccess';

// 1. Gather all actual runtime objects
import { spells_d } from './src/data/compendium/spells/rank-d';
import { spells_supplemental } from './src/data/compendium/spells/supplemental';
import { spells } from './src/data/compendium/spells/index';
import { powers_core } from './src/data/compendium/powers-core';
import { powers_supplemental } from './src/data/compendium/powers-supplemental';
import { powers } from './src/data/compendium/powers';
import { techniques_core } from './src/data/compendium/techniques-core';
import { techniques_supplemental } from './src/data/compendium/techniques-supplemental';
import { techniques } from './src/data/compendium/techniques';

const idToClasses = new Map<string, string[]>();

function processList(arr: any[], getDerived: (entry: any) => string[]) {
    if (!arr) return;
    for (const item of arr) {
        if (!item.id) continue;
        const tags = getDerived(item);
        if (tags && tags.length > 0) {
            idToClasses.set(item.id, tags);
        }
    }
}

processList(spells_d, getDerivedSpellTags);
processList(spells_supplemental, getDerivedSpellTags);
processList(spells, getDerivedSpellTags);

processList(powers_core, getDerivedPowerTags);
processList(powers_supplemental, getDerivedPowerTags);
processList(powers, getDerivedPowerTags);

processList(techniques_core, getDerivedTechniqueTags);
processList(techniques_supplemental, getDerivedTechniqueTags);
processList(techniques, getDerivedTechniqueTags);

console.log(`Generated mappings for ${idToClasses.size} abilities.`);

// 2. Use ts-morph to inject them
const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/data/compendium/**/*.ts");
let modifiedCount = 0;

for (const sourceFile of sourceFiles) {
    let fileModified = false;
    
    // Find all variable declarations
    const declarations = sourceFile.getVariableDeclarations();
    for (const decl of declarations) {
        const initializer = decl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!initializer) continue;
        
        const elements = initializer.getElements();
        for (const element of elements) {
            if (element.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
            
            const obj = element as ObjectLiteralExpression;
            const idProp = obj.getProperty("id");
            if (!idProp || idProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
            
            const idValueNode = (idProp as PropertyAssignment).getInitializer();
            if (!idValueNode || idValueNode.getKind() !== SyntaxKind.StringLiteral) continue;
            
            const id = idValueNode.getText().slice(1, -1); // remove quotes
            const derivedTags = idToClasses.get(id);
            
            if (derivedTags && derivedTags.length > 0) {
                // Check if 'classes' already exists
                let classesProp = obj.getProperty("classes") as PropertyAssignment | undefined;
                
                const classesString = `[${derivedTags.map((t: string) => `"${t}"`).join(", ")}]`;
                
                if (classesProp) {
                    // Update existing
                    classesProp.setInitializer(classesString);
                } else {
                    // Add new property
                    obj.addPropertyAssignment({
                        name: "classes",
                        initializer: classesString
                    });
                }
                fileModified = true;
                modifiedCount++;
            }
        }
    }
    
    if (fileModified) {
        console.log(`Saving changes to ${sourceFile.getFilePath()}`);
        sourceFile.saveSync();
    }
}

console.log(`Successfully updated ${modifiedCount} ability entries.`);
