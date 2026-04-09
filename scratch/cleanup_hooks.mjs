import fs from 'fs';

const HOOKS_PATH = 'c:/Users/jjcal/Documents/solo-compendium/src/hooks/useRunes.ts';

function cleanupHooks() {
    console.log('Cleaning up mangled hooks file...');
    let content = fs.readFileSync(HOOKS_PATH, 'utf8');

    // Find the end of useAbsorbRune
    const absorbRuneEnd = content.lastIndexOf('export function useAbsorbRune() {');
    // Usually, the function ends with:
    // 		},
    // 	});
    // }
    
    // Actually, searching for the last '}' that closes the hook list
    // Let's just find the last occurrence of the query invalidation.
    const lastValidLine = content.indexOf('}\n\t});\n}'); 
    if (lastValidLine !== -1) {
        // Find the next two } to close the mutation and the function
        const endOfFunction = content.indexOf('}', lastValidLine + 9);
        if (endOfFunction !== -1) {
            fs.writeFileSync(HOOKS_PATH, content.substring(0, endOfFunction + 1) + '\n', 'utf8');
        }
    }
    console.log('Hooks file cleaned.');
}

try {
    cleanupHooks();
} catch (error) {
    console.error('Error cleaning hooks:', error);
}
