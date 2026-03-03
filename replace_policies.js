import fs from 'fs';
const file = process.argv[2];
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/CREATE POLICY \"([^\"]+)\" ON public\.([a-zA-Z_]+)/g, (match, p1, p2) => {
    return `DROP POLICY IF EXISTS "${p1}" ON public.${p2};\n${match}`;
});
fs.writeFileSync(file, content, 'utf8');
