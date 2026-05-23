import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from "ts-morph";
import { SPELL_TAGS_BY_ID, POWER_TAGS_BY_ID, TECHNIQUE_TAGS_BY_ID } from "./src/lib/abilityMappings.ts";

const allMappings: Record<string, string[]> = {
    ...SPELL_TAGS_BY_ID,
    ...POWER_TAGS_BY_ID,
    ...TECHNIQUE_TAGS_BY_ID
};

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const sourceFiles = project.getSourceFiles("src/data/compendium/**/*.ts");

let modifiedCount = 0;

for (const sourceFile of sourceFiles) {
    let fileModified = false;
    
    // Find all array literals (e.g. export const powers_core = [...])
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
            
            const id = idValueNode.getText().slice(1, -1);
            
            // Check if classes exists
            const existingClasses = obj.getProperty("classes");
            if (existingClasses) {
                continue; // Skip, it already has classes!
            }
            
            const derivedTags = allMappings[id];
            if (derivedTags && derivedTags.length > 0) {
                // Job/classes tags usually should be title case or capitalized if we want to match the others, 
                // but our UI canonicalCompendium parser handles lowercase comparisons just fine.
                const classesString = `[${derivedTags.map((t: string) => `"${t}"`).join(", ")}]`;
                
                const index = obj.getProperties().indexOf(idProp);
                obj.insertPropertyAssignment(index + 1, {
                    name: "classes",
                    initializer: classesString
                });
                
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

console.log(`Successfully added 'classes' to ${modifiedCount} ability entries.`);
