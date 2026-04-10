const fs = require("node:fs");
const path = require("node:path");

function walk(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		file = path.join(dir, file);
		if (fs.statSync(file).isDirectory()) {
			results = results.concat(walk(file));
		} else if (
			file.endsWith(".ts") ||
			file.endsWith(".tsx") ||
			file.endsWith(".css")
		) {
			results.push(file);
		}
	});
	return results;
}

const files = walk(path.join(process.cwd(), "src"));
let modifiedCount = 0;

const replacements = [
	[/system-materialize/g, "ascendant-materialize"],
	[/system-panel/g, "ascendant-panel"],
	[/system-title-bar/g, "rift-title-bar"],
	[/system-label/g, "ascendant-label"],
	[/system-value/g, "ascendant-value"],
	[/system-notification/g, "rift-notification"],
	[/card-system-hover/g, "card-ascendant-hover"],
	[/system-cursor/g, "ascendant-cursor"],
	[/gradient-text-system/g, "gradient-text-ascendant"],
	[/text-glow-system/g, "text-glow-ascendant"],
	[/system-scan-line/g, "rift-scan-line"],
	[/system_favor/g, "rift_favor"],
	[/is_campaign_system/g, "is_active_rift"],
	[/getSystemFavorDie/g, "getRiftFavorDie"],
	[/systemFavor/g, "riftFavor"],
	[/System UI/g, "Ascendant UI"],
	[/system-ui\.css/g, "ascendant-ui.css"],
	[/@\/components\/ui\/System/g, "@/components/ui/Ascendant"],
];

files.forEach((f) => {
	try {
		const orig = fs.readFileSync(f, "utf8");
		let content = orig;

		replacements.forEach(([regex, replacement]) => {
			content = content.replace(regex, replacement);
		});

		if (orig !== content) {
			fs.writeFileSync(f, content, "utf8");
			modifiedCount++;
		}
	} catch (err) {
		console.error(`Error processing ${f}: ${err.message}`);
	}
});

console.log(`Finished updating classes and fields in ${modifiedCount} files.`);
