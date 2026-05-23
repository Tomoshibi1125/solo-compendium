import * as fs from "fs";

const content = fs.readFileSync("src/data/compendium/jobs.ts", "utf-8");
const regex =
	/name:\s*"([^"]+)",\s*type:\s*"Job",\s*rank:\s*"[^"]+",\s*description:\s*"([^"]+)"/g;
let match;
let output = "";
while ((match = regex.exec(content)) !== null) {
	output += `## ${match[1]}\n${match[2]}\n\n`;
}

fs.writeFileSync("job_descriptions.txt", output);
console.log("Job descriptions written.");
