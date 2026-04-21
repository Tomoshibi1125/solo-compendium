import * as fs from "node:fs";
import * as path from "node:path";
async function run() {
    const compendiumDir = path.resolve(process.cwd(), "src/data/compendium");
    function getAllFiles(dirPath, arrayOfFiles = []) {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
                arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
            }
            else {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        });
        return arrayOfFiles;
    }
    const allFiles = getAllFiles(compendiumDir).filter((f) => f.endsWith(".ts"));
    let totalItems = 0;
    console.log("=== COMPENDIUM ARRAY COUNTS ===");
    for (const file of allFiles) {
        try {
            const relativePath = file.replace(process.cwd(), "").replace(/\\/g, "/");
            const fileUrl = `file:///${file.replace(/\\/g, "/")}`;
            const module = await import(fileUrl);
            let fileCount = 0;
            for (const key of Object.keys(module)) {
                if (Array.isArray(module[key])) {
                    console.log(`[${relativePath}] ${key}: ${module[key].length}`);
                    fileCount += module[key].length;
                }
            }
            totalItems += fileCount;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            console.log(`Error parsing ${file.split("\\").pop()}: ${err.message.substring(0, 50)}`);
        }
    }
    console.log(`\nTOTAL ARRAYS FOUND: ${totalItems}`);
}
run();
