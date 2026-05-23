import * as fs from 'fs';
import * as ts from 'typescript';

const code = fs.readFileSync('src/data/compendium/paths.ts', 'utf-8');
const sourceFile = ts.createSourceFile('paths.ts', code, ts.ScriptTarget.Latest, true);

let output = "";

function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
        let name = "";
        let jobName = "";
        
        for (const prop of node.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                if (prop.name.text === 'name' && ts.isStringLiteral(prop.initializer)) {
                    name = prop.initializer.text;
                }
                if (prop.name.text === 'jobName' && ts.isStringLiteral(prop.initializer)) {
                    jobName = prop.initializer.text;
                }
            }
        }
        
        if (name && jobName) {
            output += `Path: ${name} (Job: ${jobName})\n`;
        }
    }
    ts.forEachChild(node, visit);
}

visit(sourceFile);
fs.writeFileSync('extracted_paths.txt', output);
console.log("Done");
