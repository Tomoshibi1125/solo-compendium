/**
 * Misty Pearl G2 — Two-way Discord bot endpoint.
 *
 * Receives Discord interaction webhooks (slash commands), verifies
 * the Ed25519 signature against the campaign's stored public key,
 * dispatches the command, and replies with a Discord interaction
 * response.
 *
 * Supported commands:
 *   /link  code:<share-code>         — link Discord user → RA account
 *   /roll  formula:<formula>          — server-side dice roll, posted in Discord
 *   /whisper player:<name> message:<text> — whisper through RA chat
 *   /sessionstatus                    — next scheduled session info
 *
 * Auth flow:
 *   1. Each campaign registers a Discord App in the Developer Portal
 *      and pastes `discord_app_id` + `discord_public_key` into its
 *      RA campaign settings.
 *   2. The Warden runs `scripts/register-discord-commands.ts` once to
 *      register the slash commands with Discord's REST API.
 *   3. Discord's Interactions Endpoint URL points at this function
 *      with `?campaign={uuid}` so we can look up the right key.
 *   4. Discord users self-link by running `/link code:<share-code>`
 *      in any guild channel where the bot is installed.
 *
 * Security: every incoming request MUST pass Ed25519 verification
 * before we touch the database. The campaign id query-string param
 * tells us WHICH key to verify against; if the signature doesn't
 * match, we 401 and skip the dispatch.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

// ----- Discord protocol constants -----
const InteractionType = {
	PING: 1,
	APPLICATION_COMMAND: 2,
	MESSAGE_COMPONENT: 3,
	APPLICATION_COMMAND_AUTOCOMPLETE: 4,
	MODAL_SUBMIT: 5,
} as const;

const InteractionCallbackType = {
	PONG: 1,
	CHANNEL_MESSAGE_WITH_SOURCE: 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
} as const;

interface DiscordInteractionUser {
	id: string;
	username: string;
	discriminator?: string;
	global_name?: string;
}

interface DiscordInteractionOption {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: DiscordInteractionOption[];
}

interface DiscordInteraction {
	type: number;
	id: string;
	application_id: string;
	guild_id?: string;
	channel_id?: string;
	member?: { user: DiscordInteractionUser };
	user?: DiscordInteractionUser;
	data?: {
		id: string;
		name: string;
		options?: DiscordInteractionOption[];
	};
}

// ----- Utilities -----
const json = (status: number, body: unknown) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

const ephemeralReply = (content: string) =>
	json(200, {
		type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: { content, flags: 64 /* EPHEMERAL */ },
	});

const publicReply = (content: string) =>
	json(200, {
		type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: { content },
	});

const hexToBytes = (hex: string): Uint8Array => {
	const clean = hex.replace(/[^0-9a-f]/gi, "");
	const out = new Uint8Array(clean.length / 2);
	for (let i = 0; i < out.length; i++) {
		out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
	}
	return out;
};

const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
	const total = arrays.reduce((n, a) => n + a.length, 0);
	const out = new Uint8Array(total);
	let off = 0;
	for (const arr of arrays) {
		out.set(arr, off);
		off += arr.length;
	}
	return out;
};

/**
 * Verify Discord's Ed25519 signature using Web Crypto. Returns true
 * on valid signature, false otherwise. Throws on a malformed key.
 */
async function verifyDiscordSignature(args: {
	publicKeyHex: string;
	signatureHex: string;
	timestamp: string;
	body: string;
}): Promise<boolean> {
	const publicKey = hexToBytes(args.publicKeyHex);
	const signature = hexToBytes(args.signatureHex);
	const message = new TextEncoder().encode(args.timestamp + args.body);
	try {
		const key = await crypto.subtle.importKey(
			"raw",
			publicKey,
			{ name: "Ed25519" },
			false,
			["verify"],
		);
		return await crypto.subtle.verify("Ed25519", key, signature, message);
	} catch (err) {
		console.error("[discord-command] verify error:", err);
		return false;
	}
}

const optValue = (
	options: DiscordInteractionOption[] | undefined,
	name: string,
): string | undefined => {
	const opt = options?.find((o) => o.name === name);
	if (!opt) return undefined;
	return typeof opt.value === "string" ? opt.value : String(opt.value ?? "");
};

// ----- Pure dice roller (server-side; mirrors `rollDiceFormula`) -----
function rollDice(formula: string): { total: number; breakdown: string } {
	// Minimal NdM (+|- modifier) parser. Mirrors what the client roller
	// accepts for parity; we keep it tight to limit RNG surface area.
	const cleaned = formula.replace(/\s+/g, "").toLowerCase();
	const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/);
	if (!match) {
		return { total: 0, breakdown: `Invalid formula: ${formula}` };
	}
	const count = Math.max(1, Math.min(50, Number(match[1] || "1")));
	const sides = Math.max(2, Math.min(1000, Number(match[2])));
	const modifier = Number(match[3] || "0");
	const rolls: number[] = [];
	for (let i = 0; i < count; i++) {
		const r = Math.floor(Math.random() * sides) + 1;
		rolls.push(r);
	}
	const sum = rolls.reduce((acc, n) => acc + n, 0);
	const total = sum + modifier;
	const mod = modifier === 0 ? "" : modifier > 0 ? ` + ${modifier}` : ` ${modifier}`;
	return {
		total,
		breakdown: `🎲 \`${count}d${sides}\` [${rolls.join(", ")}]${mod} = **${total}**`,
	};
}

// ----- Main handler -----
Deno.serve(async (req) => {
	if (req.method !== "POST") {
		return json(405, { error: "Method not allowed" });
	}

	const url = new URL(req.url);
	const campaignId = url.searchParams.get("campaign");
	if (!campaignId) {
		return json(400, { error: "Missing campaign id" });
	}

	const supabaseUrl = Deno.env.get("SUPABASE_URL");
	const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
	if (!supabaseUrl || !serviceRoleKey) {
		console.error("Missing SUPABASE env");
		return json(500, { error: "Server not configured" });
	}

	const admin = createClient(supabaseUrl, serviceRoleKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});

	const { data: campaign, error: campaignErr } = await admin
		.from("campaigns")
		.select("id, name, discord_app_id, discord_public_key")
		.eq("id", campaignId)
		.maybeSingle();
	if (campaignErr || !campaign) {
		return json(404, { error: "Campaign not found" });
	}
	const publicKey = (campaign as { discord_public_key?: string | null })
		.discord_public_key;
	if (!publicKey) {
		return json(403, { error: "Discord bot not configured for this campaign" });
	}

	// Verify Ed25519 signature BEFORE parsing the body.
	const signature = req.headers.get("X-Signature-Ed25519");
	const timestamp = req.headers.get("X-Signature-Timestamp");
	const body = await req.text();
	if (!signature || !timestamp) {
		return new Response("Missing signature headers", { status: 401 });
	}
	const valid = await verifyDiscordSignature({
		publicKeyHex: publicKey,
		signatureHex: signature,
		timestamp,
		body,
	});
	if (!valid) {
		return new Response("Invalid request signature", { status: 401 });
	}

	let interaction: DiscordInteraction;
	try {
		interaction = JSON.parse(body) as DiscordInteraction;
	} catch {
		return json(400, { error: "Invalid JSON" });
	}

	// PING — endpoint validation handshake.
	if (interaction.type === InteractionType.PING) {
		return json(200, { type: InteractionCallbackType.PONG });
	}

	if (interaction.type !== InteractionType.APPLICATION_COMMAND) {
		return ephemeralReply("Unsupported interaction type.");
	}

	const commandName = interaction.data?.name;
	const discordUser = interaction.member?.user ?? interaction.user;
	if (!commandName || !discordUser) {
		return ephemeralReply("Malformed command payload.");
	}

	const audit = async (outcome: string) => {
		try {
			await admin.from("discord_command_audit").insert({
				campaign_id: campaignId,
				discord_user_id: discordUser.id,
				command: commandName,
				payload: { options: interaction.data?.options ?? [] },
				outcome,
			});
		} catch (err) {
			console.warn("[discord-command] audit insert failed:", err);
		}
	};

	// ----- /link code:<share-code> -----
	if (commandName === "link") {
		const code = optValue(interaction.data?.options, "code");
		if (!code) {
			await audit("missing_code");
			return ephemeralReply("Provide your campaign share code.");
		}
		// Verify the code belongs to this campaign.
		const { data: campaignRow } = await admin
			.from("campaigns")
			.select("id, share_code, owner_id")
			.eq("id", campaignId)
			.maybeSingle();
		if (!campaignRow || campaignRow.share_code !== code.trim()) {
			await audit("bad_code");
			return ephemeralReply(
				"Share code did not match this campaign. Get the code from the Warden.",
			);
		}
		// Resolve Discord user → RA user. For v1 we link to the owner if
		// the bot has no prior link; richer membership resolution is a
		// follow-up (Warden manually maps via dashboard). The audit row
		// captures the Discord side so admins can correlate.
		const { error: linkErr } = await admin
			.from("discord_account_links")
			.upsert(
				{
					campaign_id: campaignId,
					discord_user_id: discordUser.id,
					discord_username:
						discordUser.global_name ?? discordUser.username,
					user_id: campaignRow.owner_id,
				},
				{ onConflict: "campaign_id,discord_user_id" },
			);
		if (linkErr) {
			console.error("[discord-command] link insert failed:", linkErr);
			await audit("link_failed");
			return ephemeralReply("Couldn't link account. Try again later.");
		}
		await audit("linked");
		return ephemeralReply(
			`✅ Linked Discord user **${discordUser.username}** to **${campaign.name}**. You can now use /roll, /whisper, and /sessionstatus.`,
		);
	}

	// All other commands require a prior link.
	const { data: link } = await admin
		.from("discord_account_links")
		.select("user_id, discord_username")
		.eq("campaign_id", campaignId)
		.eq("discord_user_id", discordUser.id)
		.maybeSingle();
	if (!link) {
		return ephemeralReply(
			"You're not linked to this campaign yet. Run `/link code:<share-code>` first.",
		);
	}

	// ----- /roll formula:<formula> -----
	if (commandName === "roll") {
		const formula = optValue(interaction.data?.options, "formula") ?? "1d20";
		const { total, breakdown } = rollDice(formula);
		// Mirror into the RA campaign chat as a "roll" message so the web
		// client picks it up live.
		try {
			await admin.from("campaign_messages").insert({
				campaign_id: campaignId,
				user_id: link.user_id,
				character_name: link.discord_username,
				message_type: "roll",
				content: `${link.discord_username ?? "Discord operative"} rolled \`${formula}\` → **${total}** (via Discord)`,
				metadata: { source: "discord", discord_user_id: discordUser.id },
			});
		} catch (err) {
			console.warn("[discord-command] chat insert failed:", err);
		}
		await audit(`roll:${total}`);
		return publicReply(`${link.discord_username ?? "Operative"} ${breakdown}`);
	}

	// ----- /whisper player:<name> message:<text> -----
	if (commandName === "whisper") {
		const player = optValue(interaction.data?.options, "player") ?? "";
		const message = optValue(interaction.data?.options, "message") ?? "";
		if (!player || !message) {
			await audit("missing_args");
			return ephemeralReply("Provide both player and message.");
		}
		try {
			await admin.from("campaign_messages").insert({
				campaign_id: campaignId,
				user_id: link.user_id,
				character_name: link.discord_username,
				message_type: "whisper",
				content: `→ ${player}: ${message}`,
				metadata: { source: "discord", whisper_to: player },
			});
		} catch (err) {
			console.warn("[discord-command] whisper insert failed:", err);
		}
		await audit("whisper");
		return ephemeralReply(`Whisper sent to **${player}**.`);
	}

	// ----- /sessionstatus -----
	if (commandName === "sessionstatus") {
		const { data: nextSession } = await admin
			.from("campaign_sessions")
			.select("title, scheduled_for, status, location")
			.eq("campaign_id", campaignId)
			.in("status", ["planned", "in_progress"])
			.order("scheduled_for", { ascending: true })
			.limit(1)
			.maybeSingle();
		await audit("status");
		if (!nextSession) {
			return ephemeralReply("No upcoming Rift sessions scheduled.");
		}
		const when = nextSession.scheduled_for
			? new Date(nextSession.scheduled_for).toLocaleString()
			: "Date TBD";
		const where = nextSession.location ? ` at ${nextSession.location}` : "";
		return publicReply(
			`📅 **Next Bureau session** — **${nextSession.title}** (${nextSession.status.replace("_", " ")}) on ${when}${where}.`,
		);
	}

	await audit("unknown_command");
	return ephemeralReply(`Unknown command: ${commandName}`);
});
