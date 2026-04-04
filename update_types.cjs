const fs = require("node:fs");
const path =
	"c:/Users/jjcal/Documents/solo-compendium/src/integrations/supabase/types.ts";
let content = fs.readFileSync(path, "utf16le");

// Use broad regex to find Row block in campaign_messages
content = content.replace(
	/(campaign_messages: \{[\s\S]+?Row: \{)([\s\S]+?)\}/,
	(match, p1, p2) => {
		if (p2.includes("target_user_ids")) return match;
		return `${p1}${p2}          message_type: string | null\n          target_user_ids: string[] | null\n        }`;
	},
);

// Fix campaign_messages Insert
content = content.replace(
	/(campaign_messages: \{[\s\S]+?Insert: \{)([\s\S]+?)\}/,
	(match, p1, p2) => {
		if (p2.includes("target_user_ids")) return match;
		return `${p1}${p2}          message_type?: string | null\n          target_user_ids?: string[] | null\n        }`;
	},
);

// Fix campaign_messages Update
content = content.replace(
	/(campaign_messages: \{[\s\S]+?Update: \{)([\s\S]+?)\}/,
	(match, p1, p2) => {
		if (p2.includes("target_user_ids")) return match;
		return `${p1}${p2}          message_type?: string | null\n          target_user_ids?: string[] | null\n        }`;
	},
);

fs.writeFileSync(path, content, "utf16le");
console.log("Updated types.ts");
