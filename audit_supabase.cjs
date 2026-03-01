const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const tables = new Set();
const rpcs = new Set();
const buckets = new Set();

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');

            const tableMatches = content.matchAll(/(?:supabase|client)\.from\(['"`]([a-zA-Z0-9_]+)['"`]\)/g);
            for (const match of tableMatches) {
                tables.add(match[1]);
            }

            const rpcMatches = content.matchAll(/(?:supabase|client)\.rpc\(['"`]([a-zA-Z0-9_]+)['"`]\)/g);
            for (const match of rpcMatches) {
                rpcs.add(match[1]);
            }

            const bucketMatches = content.matchAll(/storage\.from\(['"`]([a-zA-Z0-9_-]+)['"`]\)/g);
            for (const match of bucketMatches) {
                buckets.add(match[1]);
            }
        }
    }
}

walk(srcDir);

const result = {
    tables: Array.from(tables).sort(),
    rpcs: Array.from(rpcs).sort(),
    buckets: Array.from(buckets).sort()
};

fs.writeFileSync('audit.json', JSON.stringify(result, null, 2));
