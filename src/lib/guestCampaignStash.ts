import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

/**
 * Guest-local persistence for the campaign Party Stash (shared inventory +
 * party wealth). Guest campaigns live in per-browser localStorage, so their
 * stash must too — the Supabase tables are unreachable without a session.
 * Shapes mirror the `campaign_inventory` row / `campaigns.party_gold` field
 * closely enough for the hooks to return them unchanged.
 */

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const INVENTORY_KEY = "solo-compendium.guest.campaign-inventory";
const CREDITS_KEY = "solo-compendium.guest.campaign-credits";

export interface LocalStashItem {
	id: string;
	campaign_id: string;
	name: string;
	quantity: number | null;
	description: string | null;
	item_type: string | null;
	rarity: string | null;
	value_gold: number | null;
	added_by: string | null;
	claimed_by: string | null;
	created_at: string;
	updated_at: string;
	[key: string]: unknown;
}

/** True when stash reads/writes should use the local store (local/E2E/guest). */
export const shouldUseLocalStash = async (): Promise<boolean> => {
	if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") return true;
	if (!guestEnabled) return false;
	const { data } = await supabase.auth.getSession();
	return !data.session?.user;
};

const readAll = <T>(key: string): Record<string, T> => {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(window.localStorage.getItem(key) ?? "{}") as Record<
			string,
			T
		>;
	} catch {
		return {};
	}
};

const writeAll = <T>(key: string, value: Record<string, T>): void => {
	window.localStorage.setItem(key, JSON.stringify(value));
};

export const readLocalStashItems = (campaignId: string): LocalStashItem[] =>
	readAll<LocalStashItem[]>(INVENTORY_KEY)[campaignId] ?? [];

export const addLocalStashItem = (
	campaignId: string,
	item: Partial<LocalStashItem> & { name: string },
): LocalStashItem => {
	const now = new Date().toISOString();
	const row: LocalStashItem = {
		description: null,
		item_type: null,
		rarity: null,
		value_gold: null,
		added_by: null,
		claimed_by: null,
		quantity: 1,
		...item,
		id: crypto.randomUUID(),
		campaign_id: campaignId,
		created_at: now,
		updated_at: now,
	};
	const all = readAll<LocalStashItem[]>(INVENTORY_KEY);
	all[campaignId] = [...(all[campaignId] ?? []), row];
	writeAll(INVENTORY_KEY, all);
	return row;
};

export const updateLocalStashItem = (
	itemId: string,
	updates: Partial<LocalStashItem>,
): LocalStashItem | null => {
	const all = readAll<LocalStashItem[]>(INVENTORY_KEY);
	for (const [campaignId, items] of Object.entries(all)) {
		const idx = items.findIndex((i) => i.id === itemId);
		if (idx === -1) continue;
		const next: LocalStashItem = {
			...items[idx],
			...updates,
			id: itemId,
			updated_at: new Date().toISOString(),
		};
		all[campaignId] = [...items.slice(0, idx), next, ...items.slice(idx + 1)];
		writeAll(INVENTORY_KEY, all);
		return next;
	}
	return null;
};

export const removeLocalStashItem = (itemId: string): void => {
	const all = readAll<LocalStashItem[]>(INVENTORY_KEY);
	for (const [campaignId, items] of Object.entries(all)) {
		if (!items.some((i) => i.id === itemId)) continue;
		all[campaignId] = items.filter((i) => i.id !== itemId);
		writeAll(INVENTORY_KEY, all);
		return;
	}
};

export const readLocalPartyCredits = (
	campaignId: string,
): Record<string, number> | null =>
	readAll<Record<string, number>>(CREDITS_KEY)[campaignId] ?? null;

export const saveLocalPartyCredits = (
	campaignId: string,
	credits: Record<string, number>,
): void => {
	const all = readAll<Record<string, number>>(CREDITS_KEY);
	all[campaignId] = credits;
	writeAll(CREDITS_KEY, all);
};
