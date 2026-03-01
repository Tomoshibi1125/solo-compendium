const { execSync } = require('child_process');
const fs = require('fs');
try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    fs.writeFileSync('out.txt', 'OK');
} catch (e) {
    fs.writeFileSync('out.txt', e.stdout.toString() + '\n' + e.stderr.toString());
}
