const fs = require('fs');
const file = 'c:/Users/jjcal/Documents/solo-compendium/src/pages/warden-directives/VTTEnhanced.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{/* Embedded Initiative Tracker */}';
const endMarker = '<AscendantWindow title="TOKENS">';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log('Markers not found', startIndex, endIndex);
    process.exit(1);
}

const startOfLine = content.lastIndexOf('\n', startIndex) + 1;
const blockToMove = content.substring(startOfLine, endIndex);

content = content.substring(0, startOfLine) + content.substring(endIndex);

const rightSidebarMarker = '{/* Right Sidebar — hidden on mobile, shown via bottom sheet */}';
const rightSidebarIndex = content.indexOf(rightSidebarMarker);
if (rightSidebarIndex === -1) {
    console.log('Right sidebar not found');
    process.exit(1);
}

const divOpenIndex = content.indexOf('>', rightSidebarIndex) + 1;
const insertIndex = content.indexOf('\n', divOpenIndex) + 1;

content = content.substring(0, insertIndex) + '\n' + blockToMove + content.substring(insertIndex);

fs.writeFileSync(file, content);
console.log('Moved blocks successfully');
