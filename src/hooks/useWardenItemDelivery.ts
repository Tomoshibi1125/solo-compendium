import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAssignCampaignLoot } from "@/hooks/useCampaignRewards";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { buildItemProperties } from "@/lib/characterCreation";
import type { HomebrewRuntimeItem } from "@/lib/homebrewRuntime";
import { getDefaultSigilSlotsBaseForEquipment } from "@/lib/sigilAutomation";
import type { WardenLinkedEntry } from "@/lib/wardenGenerationContext";

export type WardenDeliveryMode = "direct" | "loot" | "stash";

export interface WardenDeliverableItem {
	id?: string;
	name: string;
	description?: string | null;
	type?: string | null;
	sourceKind?: "canonical" | "homebrew" | "generated";
	quantity?: number;
	rarity?: string | null;
	weight?: number | null;
	valueCredits?: number | null;
	properties?: string[] | null;
	requiresAttunement?: boolean;
	sourceBook?: string | null;
	homebrewId?: string | null;
	tags?: string[];
	damage?: string | null;
	damageType?: string | null;
	armorClass?: string | number | null;
	sigilSlotsBase?: number | null;
	chargesCurrent?: number | null;
	chargesMax?: number | null;
	customModifiers?: Record<string, unknown> | null;
	isContainer?: boolean;
	capacityWeight?: number | null;
	capacityVolume?: number | null;
	relicTier?: string | null;
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
	const type =
		entry.entry.equipment_type || entry.entry.item_type || entry.type;
	const properties = buildItemProperties(
		entry.entry as unknown as Parameters<typeof buildItemProperties>[0],
	);
	return {
		id: entry.id,
		name: entry.name,
		description: entry.description,
		type,
		sourceKind: "canonical",
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
		properties:
			properties.length > 0
				? properties
				: normalizeProperties(entry.entry.properties),
		requiresAttunement:
			(entry.entry as { requires_attunement?: boolean | null })
				.requires_attunement ??
			(entry.entry as { attunement?: boolean | null }).attunement ??
			((
				entry.entry as {
					limitations?: { requires_attunement?: boolean } | null;
				}
			).limitations?.requires_attunement ||
				false),
		sourceBook: entry.sourceBook,
		tags: entry.tags,
		damage:
			typeof (entry.entry as { damage?: unknown }).damage === "string" ||
			typeof (entry.entry as { damage?: unknown }).damage === "number"
				? String((entry.entry as { damage: string | number }).damage)
				: null,
		damageType:
			(entry.entry as { damage_type?: string | null }).damage_type ?? null,
		armorClass:
			(entry.entry as { armor_class?: string | number | null }).armor_class ??
			null,
		sigilSlotsBase:
			entry.entry.sigil_slots_base ??
			getDefaultSigilSlotsBaseForEquipment({
				item_type: normalizeInventoryType(type),
				properties,
				name: entry.name,
				rarity: entry.rarity,
			}),
		chargesCurrent: extractCharges(entry.entry).current,
		chargesMax: extractCharges(entry.entry).max,
		relicTier:
			(entry.entry as { relic_tier?: string | null }).relic_tier ?? null,
	};
}

export function homebrewRuntimeItemToDeliverableItem(
	item: HomebrewRuntimeItem,
): WardenDeliverableItem {
	const charges = typeof item.charges === "number" ? item.charges : null;
	return {
		id: item.id,
		name: item.name,
		description: item.description,
		type: item.item_type || item.equipment_type || "gear",
		sourceKind: "homebrew",
		rarity: item.rarity,
		weight: item.weight,
		valueCredits:
			typeof item.value_credits === "number"
				? item.value_credits
				: typeof item.cost_credits === "number"
					? item.cost_credits
					: null,
		properties: item.properties,
		requiresAttunement: item.requires_attunement,
		sourceBook: item.source_book,
		homebrewId: item.homebrew_id,
		tags: item.tags,
		damage: item.damage,
		damageType: item.damage_type,
		armorClass: item.armor_class,
		chargesCurrent: charges,
		chargesMax: charges,
		customModifiers: item.custom_modifiers,
		isContainer:
			typeof item.is_container === "boolean" ? item.is_container : undefined,
		capacityWeight:
			typeof item.capacity_weight === "number" ? item.capacity_weight : null,
		capacityVolume:
			typeof item.capacity_volume === "number" ? item.capacity_volume : null,
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
	const inventoryType = normalizeInventoryType(item.type);
	const properties = item.properties ?? [];
	const customModifiers = buildCustomModifiers(item);
	return {
		character_id: characterId,
		item_id: item.sourceKind === "homebrew" ? null : (item.id ?? null),
		name: item.name,
		item_type: inventoryType,
		description: item.description ?? null,
		properties,
		weight: item.weight ?? null,
		value_credits: item.valueCredits ?? null,
		quantity: quantity ?? item.quantity ?? 1,
		is_equipped: false,
		is_attuned: false,
		requires_attunement: item.requiresAttunement ?? false,
		rarity: normalizeRarityForDb(item.rarity),
		sigil_slots_base:
			item.sigilSlotsBase ??
			getDefaultSigilSlotsBaseForEquipment({
				item_type: inventoryType,
				properties,
				name: item.name,
				rarity: item.rarity ?? null,
			}),
		relic_tier: normalizeRelicTierForDb(item.relicTier),
		charges_current: item.chargesCurrent ?? item.chargesMax ?? null,
		charges_max: item.chargesMax ?? null,
		custom_modifiers: customModifiers,
		is_container: item.isContainer ?? false,
		capacity_weight: item.capacityWeight ?? null,
		capacity_volume: item.capacityVolume ?? null,
		is_active: true,
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
	if (normalized === "tools") return "tool";
	if (normalized === "shield") return "armor";
	return normalized.replace(/s$/, "") || "item";
}

function normalizeRarityForDb(rarity?: string | null): Rarity | null {
	// The DB `rarity` enum (underscore form) now carries the full 8-tier ladder
	// (extended in 20260604000000): hyphen/space variants of very-rare collapse
	// to very_rare, and epic/mythic/artifact pass through to the storable enum.
	const normalized = rarity?.toLowerCase().replace(/[\s-]/g, "_");
	if (
		normalized === "common" ||
		normalized === "uncommon" ||
		normalized === "rare" ||
		normalized === "very_rare" ||
		normalized === "epic" ||
		normalized === "legendary" ||
		normalized === "mythic" ||
		normalized === "artifact"
	) {
		return normalized as Rarity;
	}
	return null;
}

function normalizeRelicTierForDb(
	relicTier?: string | null,
): Database["public"]["Enums"]["relic_tier"] | null {
	const normalized = relicTier?.toLowerCase().replace(/[\s-]/g, "_");
	if (
		normalized === "dormant" ||
		normalized === "awakened" ||
		normalized === "resonant"
	) {
		return normalized;
	}
	return null;
}

function buildCustomModifiers(item: WardenDeliverableItem): Json | null {
	const modifiers = {
		...(item.customModifiers ?? {}),
		...(item.sourceKind === "homebrew" || item.homebrewId
			? {
					source: "homebrew",
					homebrew_id: item.homebrewId ?? item.id ?? null,
				}
			: {}),
	};
	return Object.keys(modifiers).length > 0 ? (modifiers as Json) : null;
}

function extractCharges(entry: WardenLinkedEntry["entry"]): {
	current: number | null;
	max: number | null;
} {
	const rawCharges = (entry as { charges?: unknown }).charges;
	if (typeof rawCharges === "number" && Number.isFinite(rawCharges)) {
		return { current: rawCharges, max: rawCharges };
	}
	if (
		rawCharges &&
		typeof rawCharges === "object" &&
		!Array.isArray(rawCharges)
	) {
		const chargeRecord = rawCharges as {
			current?: unknown;
			max?: unknown;
			value?: unknown;
			total?: unknown;
		};
		const max = parseOptionalNumber(
			chargeRecord.max ?? chargeRecord.total ?? chargeRecord.value,
		);
		const current = parseOptionalNumber(chargeRecord.current) ?? max;
		return { current, max };
	}
	return {
		current: parseOptionalNumber(
			(entry as { charges_current?: unknown }).charges_current,
		),
		max: parseOptionalNumber((entry as { charges_max?: unknown }).charges_max),
	};
}

function parseOptionalNumber(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) return parsed;
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
