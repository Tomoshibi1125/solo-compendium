import fs from 'fs';

let content = fs.readFileSync('src/pages/compendium/SourceBook.tsx', 'utf8');

const replacements = [
    { mapVar: 'job', callout: 'job.name' },
    { mapVar: 'spell', callout: 'spell.name' },
    { mapVar: 'item', callout: 'item.name' },
    { mapVar: 'relic', callout: 'relic.name' },
    { mapVar: 'feat', callout: 'feat.name' },
    { mapVar: 'tech', callout: 'tech.name' },
    { mapVar: 'rune', callout: 'rune.name' },
    { mapVar: 'sigil', callout: 'sigil.name' },
    { mapVar: 'condition', callout: 'condition.name' },
    { mapVar: 'skill', callout: 'skill.name' }
];

for (const { mapVar, callout } of replacements) {
    // We look for: <SourceBookCallout key={...} title={VAR.name}
    const regex = new RegExp(`(<SourceBookCallout[^>]*title={${callout}}[^>]*)>`, 'g');
    content = content.replace(regex, `$1 systemInteraction={(${mapVar} as any).mechanics?.system_interaction || (${mapVar} as any).system_interaction}>`);
}

fs.writeFileSync('src/pages/compendium/SourceBook.tsx', content, 'utf8');
console.log('Injected systemInteraction props into SourceBookCallout tags');
