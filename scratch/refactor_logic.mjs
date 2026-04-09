import fs from 'fs';

const HOOKS_PATH = 'c:/Users/jjcal/Documents/solo-compendium/src/hooks/useRunes.ts';

function refactorLogic() {
    console.log('Refactoring Logic via script...');
    let content = fs.readFileSync(HOOKS_PATH, 'utf8');

    // Remove checkRuneRequirements function
    const checkRunePattern = /\/\/ Check if character meets rune requirements\s*export function checkRuneRequirements\([\s\S]*?}[\s\S]*?}/;
    content = content.replace(checkRunePattern, '');

    // Cleanup usage of requirement fields in useCompendiumRunes mapping (around line 107-113)
    const reqFields = [
        'requirement_agi: 0,',
        'requirement_int: 0,',
        'requirement_pre: 0,',
        'requirement_sense: 0,',
        'requirement_str: 0,',
        'requirement_vit: 0,',
        'requires_job: null,',
        'requires_level: 1,',
        'martial_requirement_multiplier: null,',
        'caster_requirement_multiplier: null,',
        'martial_penalty: "",',
        'caster_penalty: "",'
    ];

    reqFields.forEach(field => {
        const regex = new RegExp(`\\s*${field}`, 'g');
        content = content.replace(regex, '');
    });

    fs.writeFileSync(HOOKS_PATH, content, 'utf8');
    console.log('useRunes.ts logic refactored.');
}

try {
    refactorLogic();
} catch (error) {
    console.error('Error refactoring logic:', error);
}
