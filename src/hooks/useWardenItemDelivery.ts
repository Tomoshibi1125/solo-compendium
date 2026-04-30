import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAssignCampaignLoot } from "@/hooks/useCampaignRewards";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import type { WardenLinkedEntry } from "@/lib/wardenGenerationContext";

export type WardenDeliveryMode = "direct" | "loot" | "stash";

export interface WardenDeliverableItem {
	id?: string;
	name: string;
	description?: string | null;
	type?: string | null;
	quantity?: number;
	rarity?: string | null;
	weight?: number | null;
	valueCredits?: number | null;
	properties?: string[] | null;
	requiresAttunement?: boolean;
	sourceBook?: string | null;
}

interface WardenItemDeliveryInput {
	campaignId: string;
	mode: WardenDeliveryMode;
	item: WardenDeliverableItem;
	characterIds?: string[];
	memberId?: string | null;
	quantity?: number;
	sessionId?: string | null;
	encounterId?: string | null;
}

type CharacterEquipmentInsert =
	Database["public"]["Tables"]["character_equipment"]["Insert"];
type Rarity = Database["public"]["Enums"]["rarity"];

export function linkedEntryToDeliverableItem(
	entry: WardenLinkedEntry,
): WardenDeliverableItem {
	return {
		id: entry.id,
		name: entry.name,
		description: entry.description,
		type: entry.type,
		rarity: entry.rarity,
		weight: entry.entry.weight ?? null,
		valueCredits:
			(
				entry.entry as {
					value_credits?: number | null;
					cost_credits?: number | null;
				}
			).value_credits ??
			(entry.entry as { cost_credits?: number | null }).cost_credits ??
			null,
		properties: normalizeProperties(entry.entry.properties),
		requiresAttunement:
			(entry.entry as { attunement?: boolean | null }).attunement ?? false,
		sourceBook: entry.sourceBook,
	};
}

export function useWardenItemDelivery() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const assignCampaignLoot = useAssignCampaignLoot();

	const directGrant = useMutation({
		mutationFn: async ({
			campaignId,
			item,
			characterIds = [],
			quantity,
		}: WardenItemDeliveryInput) => {
			if (!isSupabaseConfigured) {
				throw new Error("Backend not configured for Warden item grants.");
			}
			if (characterIds.length === 0) {
				throw new Error("Choose at least one Ascendant.");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Must be signed in to grant items.");

			const payloads = characterIds.map((characterId) =>
				buildEquipmentInsert(characterId, item, quantity),
			);

			const rpcResult = await tryGrantViaRpc(campaignId, payloads);
			if (!rpcResult) {
				const { error } = await supabase
					.from("character_equipment")
					.insert(payloads);
				if (error) throw error;
			}

			await supabase.from("campaign_session_logs").insert({
				campaign_id: campaignId,
				author_id: user.id,
				title: "Warden Item Grant",
				content: `Granted ${quantity ?? item.quantity ?? 1}x ${item.name} to ${characterIds.length} Ascendant${characterIds.length === 1 ? "" : "s"}.`,
				log_type: "loot",
				metadata: {
					item,
					character_ids: characterIds,
					mode: "direct",
				} as unknown as Json,
				is_player_visible: true,
			});

			return { count: characterIds.length };
		},
		onSuccess: (_, variables) => {
			for (const characterId of variables.characterIds || []) {
				queryClient.invalidateQueries({ queryKey: ["equipment", characterId] });
				queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			}
			toast({
				title: "Item granted",
				description: `${variables.item.name} was added to the selected Ascendant inventory.`,
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Grant failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const deliverItem = async (input: WardenItemDeliveryInput) => {
		if (input.mode === "direct") {
			return await directGrant.mutateAsync(input);
		}

		if (input.mode === "loot") {
			await assignCampaignLoot.mutateAsync({
				campaignId: input.campaignId,
				items: [
					{
						name: input.item.name,
						quantity: input.quantity ?? input.item.quantity ?? 1,
						value_credits: input.item.valueCredits ?? undefined,
						value: input.item.valueCredits ?? undefined,
					},
				],
				encounterId: input.encounterId,
				sessionId: input.sessionId,
				assignedToMemberId: input.memberId,
			});
			return { count: 1 };
		}

		const quantity = input.quantity ?? input.item.quantity ?? 1;
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const { data: existing, error: existingError } = await supabase
			.from("campaign_inventory")
			.select("id, quantity")
			.eq("campaign_id", input.campaignId)
			.eq("name", input.item.name)
			.maybeSingle();
		if (existingError) throw existingError;

		if (existing) {
			const { error } = await supabase
				.from("campaign_inventory")
				.update({ quantity: existing.quantity + quantity })
				.eq("id", existing.id);
			if (error) throw error;
		} else {
			const { error } = await supabase.from("campaign_inventory").insert({
				campaign_id: input.campaignId,
				added_by: user?.id ?? null,
				name: input.item.name,
				description: input.item.description ?? null,
				item_type: input.item.type ?? "item",
				quantity,
				weight: input.item.weight ?? null,
				is_identified: true,
			});
			if (error) throw error;
		}

		queryClient.invalidateQueries({
			queryKey: ["campaign_inventory", input.campaignId],
		});
		toast({
			title: "Item sent to Party Stash",
			description: `${input.item.name} was added to the shared stash.`,
		});
		return { count: 1 };
	};

	return {
		deliverItem,
		isDelivering: directGrant.isPending || assignCampaignLoot.isPending,
	};
}

function buildEquipmentInsert(
	characterId: string,
	item: WardenDeliverableItem,
	quantity?: number,
): CharacterEquipmentInsert {
	return {
		character_id: characterId,
		item_id: item.id ?? null,
		name: item.name,
		item_type: normalizeInventoryType(item.type),
		description: item.description ?? null,
		properties: item.properties ?? null,
		weight: item.weight ?? null,
		value_credits: item.valueCredits ?? null,
		quantity: quantity ?? item.quantity ?? 1,
		is_equipped: false,
		is_attuned: false,
		requires_attunement: item.requiresAttunement ?? false,
		rarity: normalizeRarityForDb(item.rarity),
		relic_tier: null,
		charges_current: null,
		charges_max: null,
	};
}

async function tryGrantViaRpc(
	campaignId: string,
	items: CharacterEquipmentInsert[],
): Promise<boolean> {
	const rpcClient = supabase.rpc as unknown as (
		fn: string,
		args: Record<string, unknown>,
	) => Promise<{ error: Error | null }>;
	const { error } = await rpcClient("warden_grant_character_equipment", {
		p_campaign_id: campaignId,
		p_items: items,
	});
	if (!error) return true;
	const message = error.message.toLowerCase();
	if (
		message.includes("warden_grant_character_equipment") &&
		(message.includes("does not exist") || message.includes("not found"))
	) {
		return false;
	}
	throw error;
}

function normalizeInventoryType(type?: string | null): string {
	const normalized = (type || "item").toLowerCase();
	if (normalized === "equipment") return "gear";
	if (normalized === "items") return "item";
	if (normalized === "runes") return "rune";
	if (normalized === "sigils") return "sigil";
	if (normalized === "tattoos") return "tattoo";
	if (normalized === "relics") return "relic";
	if (normalized === "artifacts") return "artifact";
	return normalized.replace(/s$/, "") || "item";
}

function normalizeRarityForDb(rarity?: string | null): Rarity | null {
	const normalized = rarity?.toLowerCase().replace(/-/g, "_");
	if (
		normalized === "common" ||
		normalized === "uncommon" ||
		normalized === "rare" ||
		normalized === "very_rare" ||
		normalized === "legendary"
	) {
		return normalized as Rarity;
	}
	return null;
}

function normalizeProperties(
	properties: WardenLinkedEntry["entry"]["properties"],
): string[] | null {
	if (Array.isArray(properties)) return properties;
	if (!properties || typeof properties !== "object") return null;
	const values: string[] = [];
	for (const [key, value] of Object.entries(properties)) {
		if (typeof value === "string") values.push(`${key}: ${value}`);
		if (typeof value === "number" || typeof value === "boolean") {
			values.push(`${key}: ${String(value)}`);
		}
	}
	return values.length > 0 ? values : null;
}
