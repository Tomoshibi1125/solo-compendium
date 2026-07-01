/**
 * Pure export builders for the community systems (Guilds + Marketplace).
 * Decoupled from the hook row types via minimal structural shapes so they stay
 * trivially testable and reusable by the shared `<ExportMenu>`.
 */

// ---------------------------------------------------------------------------
// Guilds
// ---------------------------------------------------------------------------

export interface GuildExportInfo {
	name: string;
	motto?: string | null;
	description?: string | null;
	share_code?: string | null;
}

export interface GuildMemberExport {
	role: string;
	user_id?: string | null;
	npc_name?: string | null;
	npc_level?: number | null;
	characters?: { name: string; level: number; job: string | null } | null;
}

const memberName = (m: GuildMemberExport): string =>
	m.characters?.name ?? m.npc_name ?? "Unlinked member";

const memberKind = (m: GuildMemberExport): string =>
	m.user_id ? "Player" : m.npc_name ? "NPC" : "—";

const memberLevel = (m: GuildMemberExport): string => {
	const lvl = m.characters?.level ?? m.npc_level;
	return typeof lvl === "number" ? String(lvl) : "";
};

export function buildGuildMarkdown(
	guild: GuildExportInfo,
	members: ReadonlyArray<GuildMemberExport>,
): string {
	const lines: string[] = [`# ${guild.name}`, ""];
	if (guild.motto) lines.push(`*"${guild.motto}"*`, "");
	if (guild.description) lines.push(guild.description, "");
	lines.push(`**Members:** ${members.length}`, "");
	lines.push("| Name | Type | Role | Level | Job |");
	lines.push("| --- | --- | --- | --- | --- |");
	for (const m of members) {
		lines.push(
			`| ${memberName(m)} | ${memberKind(m)} | ${m.role} | ${
				memberLevel(m) || "—"
			} | ${m.characters?.job ?? "—"} |`,
		);
	}
	return `${lines.join("\n")}\n`;
}

export function buildGuildRosterCsv(
	members: ReadonlyArray<GuildMemberExport>,
): { rows: Array<Record<string, unknown>>; columns: string[] } {
	const columns = ["name", "type", "role", "level", "job"];
	const rows = members.map((m) => ({
		name: memberName(m),
		type: memberKind(m),
		role: m.role,
		level: memberLevel(m),
		job: m.characters?.job ?? "",
	}));
	return { rows, columns };
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

export interface MarketplaceItemExport {
	title: string;
	item_type: string;
	category: string;
	price_type: string;
	price_amount: number | null;
	price_currency: string | null;
	rating_avg: number;
	rating_count: number;
	downloads_count: number;
	tags: string[];
	description: string;
}

const priceLabel = (i: MarketplaceItemExport): string =>
	i.price_type === "paid"
		? `${i.price_currency || "USD"} ${i.price_amount ?? 0}`
		: i.price_type;

export function buildMarketplaceMarkdown(
	items: ReadonlyArray<MarketplaceItemExport>,
): string {
	const lines: string[] = ["# Marketplace Listings", ""];
	lines.push(`**Listings:** ${items.length}`, "");
	for (const i of items) {
		lines.push(`## ${i.title}`);
		lines.push(
			`- **Type:** ${i.item_type} · ${i.category}`,
			`- **Price:** ${priceLabel(i)}`,
			`- **Rating:** ${i.rating_avg.toFixed(2)} (${i.rating_count})`,
			`- **Downloads:** ${i.downloads_count}`,
		);
		if (i.tags.length > 0) lines.push(`- **Tags:** ${i.tags.join(", ")}`);
		if (i.description) lines.push("", i.description);
		lines.push("");
	}
	return `${lines.join("\n")}\n`;
}

export function buildMarketplaceCsv(
	items: ReadonlyArray<MarketplaceItemExport>,
): { rows: Array<Record<string, unknown>>; columns: string[] } {
	const columns = [
		"title",
		"item_type",
		"category",
		"price_type",
		"price_amount",
		"rating_avg",
		"rating_count",
		"downloads_count",
		"tags",
	];
	const rows = items.map((i) => ({
		title: i.title,
		item_type: i.item_type,
		category: i.category,
		price_type: i.price_type,
		price_amount: i.price_amount ?? "",
		rating_avg: i.rating_avg,
		rating_count: i.rating_count,
		downloads_count: i.downloads_count,
		tags: i.tags.join("; "),
	}));
	return { rows, columns };
}
