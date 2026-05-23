import * as fs from 'fs';

const pathAccessFile = 'src/lib/pathAbilityAccess.ts';
let content = fs.readFileSync(pathAccessFile, 'utf-8');

const missingGrants = fs.readFileSync('missing_paths.ts', 'utf-8');

const insertIndex = content.lastIndexOf('];');
if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + missingGrants + content.slice(insertIndex);
    fs.writeFileSync(pathAccessFile, content);
    console.log("Successfully added all 30+ missing domain lists!");
} else {
    console.log("Could not find insertion point.");
}
