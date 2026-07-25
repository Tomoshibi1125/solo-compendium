/**
 * Track E: give icon-only <Button size="icon"> controls an accessible name.
 * Inserts aria-label="<label>" (derived from the button's first lucide icon
 * child) into any size="icon" Button that lacks aria-label/aria-labelledby/title.
 * Brace-aware tag parsing so `onClick={() => ...}` arrows don't confuse it.
 *
 * Dry-run by default (reports icon→label per button); --apply to write.
 *   node scripts/add-icon-button-labels.mjs [--apply]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, sep } from "node:path";

const APPLY = process.argv.includes("--apply");
const ICON_LABEL = {
	Minus: "Decrease", Plus: "Increase", Trash: "Delete", Trash2: "Delete",
	Edit: "Edit", Edit2: "Edit", Edit3: "Edit", Pencil: "Edit", PencilLine: "Edit",
	X: "Remove", Copy: "Copy", ClipboardCopy: "Copy", Save: "Save", Check: "Confirm",
	CheckCircle: "Confirm", Send: "Send", Search: "Search", Download: "Download",
	Upload: "Upload", RefreshCw: "Refresh", RotateCcw: "Reset", Undo: "Undo",
	Play: "Play", Pause: "Pause", Bell: "Notifications", Settings: "Settings",
	Settings2: "Settings", MoreVertical: "More options", MoreHorizontal: "More options",
	Eye: "Show", EyeOff: "Hide", ChevronLeft: "Previous", ChevronRight: "Next",
	ChevronDown: "Expand", ChevronUp: "Collapse", ArrowLeft: "Back", ArrowRight: "Forward",
	History: "History", Clock: "History", Camera: "Change image", Image: "Change image",
	Link: "Copy link", Link2: "Copy link", Share2: "Share", ExternalLink: "Open",
};

function humanize(icon) {
	return icon.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[0-9]+$/, "").trim();
}
function tagAt(txt, idx) {
	let depth = 0;
	for (let i = idx; i < txt.length; i++) {
		const c = txt[i];
		if (c === "{") depth++;
		else if (c === "}") depth--;
		else if (c === ">" && depth === 0) return { tag: txt.slice(idx, i + 1), end: i + 1 };
	}
	return { tag: txt.slice(idx), end: txt.length };
}
function walk(dir, out) {
	for (const e of readdirSync(dir)) {
		const p = join(dir, e);
		const s = statSync(p);
		if (s.isDirectory()) { if (e === "node_modules" || e === "__tests__") continue; walk(p, out); }
		else if (extname(p) === ".tsx") out.push(p);
	}
	return out;
}

const files = [...walk("src/components", []), ...walk("src/pages", [])];
let count = 0;
const report = [];
const unmapped = new Set();

for (const f of files) {
	let txt = readFileSync(f, "utf8");
	let changed = false;
	let i = 0;
	let scan = "";
	let cursor = 0;
	while ((i = txt.indexOf("<Button", cursor)) !== -1) {
		const { tag, end } = tagAt(txt, i);
		const isIcon = /size=["']icon["']/.test(tag);
		const hasName = /aria-label|aria-labelledby|(?<!data-)title=/.test(tag);
		if (isIcon && !hasName) {
			// first child component after the tag
			const after = txt.slice(end, end + 200);
			const iconMatch = after.match(/^\s*(?:\{[^<]*?\}\s*)?<([A-Z][A-Za-z0-9]*)/);
			const icon = iconMatch ? iconMatch[1] : "";
			const label = ICON_LABEL[icon] || (icon ? humanize(icon) : "Action");
			if (!ICON_LABEL[icon] && icon) unmapped.add(icon);
			const newTag = tag.replace(/size=(["'])icon\1/, `size=$1icon$1 aria-label="${label}"`);
			scan += txt.slice(cursor, i) + newTag;
			cursor = end;
			changed = true;
			count++;
			report.push(`${f.split(sep).join("/")}  ${icon || "?"} -> "${label}"`);
			continue;
		}
		scan += txt.slice(cursor, end);
		cursor = end;
	}
	scan += txt.slice(cursor);
	if (changed && APPLY) writeFileSync(f, scan);
}

console.log(`${APPLY ? "APPLIED" : "DRY RUN"} — ${count} icon buttons labeled`);
for (const r of report) console.log("  " + r);
if (unmapped.size) console.log("\nUnmapped icons (humanized fallback used): " + [...unmapped].join(", "));
