const fs = require('fs');
const path = 'c:/Users/jjcal/Documents/solo-compendium/src/pages/warden-directives/VTTEnhanced.tsx';
let content = fs.readFileSync(path, 'utf8').split('\n');

// 1. Lattice to Direct (finding AscendantWindow title="TOOLS")
const toolsIndex = content.findIndex(line => line.includes('AscendantWindow title="TOOLS"'));
if (toolsIndex !== -1) {
    content.splice(toolsIndex, 0, '\t\t\t\t\t\t\t\t\t\t</TabsContent>', '', '\t\t\t\t\t\t\t\t\t\t<TabsContent value="directive" className="flex-1 overflow-y-auto space-y-4 mt-2">');
}

// 2. Direct to Tracker (finding INITIATIVE TRACKER)
const trackerIndex = content.findIndex(line => line.includes('AscendantWindow title="INITIATIVE TRACKER"'));
if (trackerIndex !== -1) {
    content.splice(trackerIndex, 0, '\t\t\t\t\t\t\t\t\t\t</TabsContent>', '', '\t\t\t\t\t\t\t\t\t\t<TabsContent value="tracker" className="flex-1 overflow-y-auto space-y-4 mt-2">');
}

// 3. Tracker to Protocols (finding AUDIO TRACKS)
const audioIndex = content.findIndex(line => line.includes('AscendantWindow title="AUDIO TRACKS"'));
if (audioIndex !== -1) {
    content.splice(audioIndex, 0, '\t\t\t\t\t\t\t\t\t\t</TabsContent>', '', '\t\t\t\t\t\t\t\t\t\t<TabsContent value="protocols" className="flex-1 overflow-y-auto space-y-4 mt-2">');
}

// 4. Protocols to Tokens (finding TOKENS)
const tokensIndex = content.findIndex(line => line.includes('AscendantWindow title="TOKENS"'));
if (tokensIndex !== -1) {
    content.splice(tokensIndex, 0, '\t\t\t\t\t\t\t\t\t\t</TabsContent>', '', '\t\t\t\t\t\t\t\t\t\t<TabsContent value="tokens" className="flex-1 overflow-y-auto space-y-4 mt-2">');
}

// 5. Final Close (finding Main Map Area)
const mapIndex = content.findIndex(line => line.includes('{/* Main Map Area */}'));
if (mapIndex !== -1) {
    content.splice(mapIndex, 0, '\t\t\t\t\t\t\t\t\t\t</TabsContent>', '\t\t\t\t\t\t\t\t\t</Tabs>', '\t\t\t\t\t\t\t\t)}');
}

fs.writeFileSync(path, content.join('\n'), 'utf8');
console.log('Patch applied successfully');
