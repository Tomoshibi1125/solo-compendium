/**
 * Misty Pearl G2 — One-time Discord slash-command registration.
 *
 * Run this once per Discord Application after pasting the bot token
 * and application id into the campaign settings:
 *
 *   DISCORD_APP_ID=... DISCORD_BOT_TOKEN=... npx tsx scripts/register-discord-commands.ts
 *
 * The script POSTs the slash-command schema to Discord's REST API.
 * After this completes, players can run /link, /roll, /whisper, and
 * /sessionstatus in any guild where the bot has been installed.
 *
 * Reference: https://discord.com/developers/docs/interactions/application-commands
 */
const APP_ID = process.env.DISCORD_APP_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID; // optional: scope to one guild

if (!APP_ID || !BOT_TOKEN) {
	console.error(
		"Missing DISCORD_APP_ID or DISCORD_BOT_TOKEN environment variables.",
	);
	process.exit(1);
}

const commands = [
	{
		name: "link",
		description: "Link your Discord account to a Rift Ascendant campaign",
		options: [
			{
				name: "code",
				description: "Campaign share code (from the Warden)",
				type: 3, // STRING
				required: true,
			},
		],
	},
	{
		name: "roll",
		description: "Roll dice through the Rift Ascendant Bureau",
		options: [
			{
				name: "formula",
				description: "Dice formula (e.g. 1d20+5, 4d6)",
				type: 3,
				required: true,
			},
		],
	},
	{
		name: "whisper",
		description: "Whisper a fellow operative through the Bureau channel",
		options: [
			{
				name: "player",
				description: "Player or character name",
				type: 3,
				required: true,
			},
			{
				name: "message",
				description: "Whisper text",
				type: 3,
				required: true,
			},
		],
	},
	{
		name: "sessionstatus",
		description: "Show the next scheduled Bureau session",
	},
];

const endpoint = GUILD_ID
	? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
	: `https://discord.com/api/v10/applications/${APP_ID}/commands`;

async function main() {
	const resp = await fetch(endpoint, {
		method: "PUT",
		headers: {
			Authorization: `Bot ${BOT_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(commands),
	});
	if (!resp.ok) {
		const body = await resp.text();
		console.error(`Registration failed (${resp.status}):`, body);
		process.exit(2);
	}
	const result = await resp.json();
	console.log(
		`✅ Registered ${Array.isArray(result) ? result.length : 1} slash command(s)${
			GUILD_ID
				? ` to guild ${GUILD_ID}`
				: " globally (may take up to 1 hour to propagate)"
		}.`,
	);
	console.log(
		"Next: copy your application's Public Key + Application ID into the campaign settings under 'Discord Bot' and set the Interactions Endpoint URL to:",
	);
	console.log(
		`   https://<your-supabase-project>.functions.supabase.co/discord-command?campaign=<campaign-uuid>`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(3);
});
