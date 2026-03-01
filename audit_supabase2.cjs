const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

const tables = new Set();
const rpcs = new Set();

function walkSrc(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkSrc(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');

            const tableMatches = content.matchAll(/\.from\(['"`]([a-zA-Z0-9_]+)['"`]\)/g);
            for (const match of tableMatches) {
                tables.add(match[1]);
            }

            const rpcMatches = content.matchAll(/\.rpc\(['"`]([a-zA-Z0-9_]+)['"`]\)/g);
            for (const match of rpcMatches) {
                rpcs.add(match[1]);
            }
        }
    }
}

walkSrc(srcDir);

// Now read all migrations
let allMigrationsContent = '';
if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir);
    for (const file of files) {
        if (file.endsWith('.sql')) {
            allMigrationsContent += fs.readFileSync(path.join(migrationsDir, file), 'utf8') + '\n';
        }
    }
}

allMigrationsContent = allMigrationsContent.toLowerCase();

const missingTables = [];
for (const table of tables) {
    // Check if "create table table_name" or "create table public.table_name" exists
    const regex1 = new RegExp(`create table (?:if not exists )?(?:public\\.)?"?${table}"? `, 'i');
    const regex2 = new RegExp(`create table (?:if not exists )?(?:public\\.)?"?${table}"?\\(`, 'i');
    if (!regex1.test(allMigrationsContent) && !regex2.test(allMigrationsContent)) {
        missingTables.push(table);
    }
}

const missingRpcs = [];
for (const rpc of rpcs) {
    const regex1 = new RegExp(`create (?:or replace )?function (?:public\\.)?"?${rpc}"?`, 'i');
    if (!regex1.test(allMigrationsContent)) {
        missingRpcs.push(rpc);
    }
}

const result = {
    missingTables,
    missingRpcs
};
fs.writeFileSync('audit2.json', JSON.stringify(result, null, 2));
