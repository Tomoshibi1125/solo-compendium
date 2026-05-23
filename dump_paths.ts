import * as fs from "fs";
import { paths } from "./src/data/compendium/paths.ts";

const pathList = paths.map((p) => ({
	job: p.jobName || p.job_name || "Unknown",
	path: p.name,
}));
fs.writeFileSync("all_paths.json", JSON.stringify(pathList, null, 2));
console.log("Saved to all_paths.json");
