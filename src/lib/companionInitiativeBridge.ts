import { supabase } from "@/integrations/supabase/client";
import { readCompanionCombatProfile } from "@/lib/companionCombat";
import {
	COMPANION_COMBAT_HANDOFF_EVENT,
	type CompanionCombatHandoffDetail,
	enqueueInitiativeAdditions,
	type PendingCombatant,
} from "@/lib/initiativeQueue";
import { logger } from "@/lib/logger";

interface CompanionInstanceBridgeRow {
	id: string;
	primary_handler_character_id: string | null;
	profile_version: number;
	combat_state_version: number | null;
	progression_profile: unknown;
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;

const callRpc = supabase.rpc as unknown as RpcClient;
let registered = false;

async function resolveInstance(
	item: PendingCombatant,
): Promise<CompanionInstanceBridgeRow> {
	if (item.companionInstanceId) {
		const { data, error } = await supabase
			.from("companion_instances" as never)
			.select(
				"id, primary_handler_character_id, profile_version, combat_state_version, progression_profile",
			)
			.eq("id", item.companionInstanceId)
			.maybeSingle();
		if (error) throw new Error(error.message);
		if (!data) throw new Error("COMPANION_INSTANCE_NOT_FOUND");
		return data as unknown as CompanionInstanceBridgeRow;
	}

	if (!item.companionOriginTable || !item.companionOriginRowId) {
		throw new Error("COMPANION_IDENTITY_REQUIRED");
	}

	const { data, error } = await supabase
		.from("companion_instances" as never)
		.select(
			"id, primary_handler_character_id, profile_version, combat_state_version, progression_profile",
		)
		.eq("origin_table", item.companionOriginTable)
		.eq("origin_row_id", item.companionOriginRowId)
		.maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) throw new Error("COMPANION_INSTANCE_NOT_FOUND");
	return data as unknown as CompanionInstanceBridgeRow;
}

async function persistHandoff(
	detail: CompanionCombatHandoffDetail,
	item: PendingCombatant,
): Promise<void> {
	const instance = await resolveInstance(item);
	const profile = readCompanionCombatProfile(instance.progression_profile);
	const initiativeMode =
		item.initiativeMode ?? profile.initiativeMode ?? "independent";
	const anchorCharacterId =
		item.initiativeAnchorCharacterId ??
		(instance.primary_handler_character_id || item.companionOwnerCharacterId);

	if (initiativeMode === "linked" && !anchorCharacterId) {
		throw new Error("LINKED_INITIATIVE_ANCHOR_REQUIRED");
	}

	const { error } = await callRpc("add_companion_to_combat", {
		p_session_id: detail.sessionId,
		p_companion_instance_id: instance.id,
		p_initiative:
			initiativeMode === "independent"
				? Math.trunc(item.initiative ?? 0)
				: null,
		p_initiative_mode: initiativeMode,
		p_anchor_character_id:
			initiativeMode === "linked" ? (anchorCharacterId ?? null) : null,
	});
	if (error) throw new Error(error.message);
}

function onCompanionCombatHandoff(event: Event): void {
	const custom = event as CustomEvent<CompanionCombatHandoffDetail>;
	const detail = custom.detail;
	if (
		!detail?.campaignId ||
		!detail.sessionId ||
		!Array.isArray(detail.items)
	) {
		return;
	}

	for (const item of detail.items) {
		void persistHandoff(detail, item).catch((error) => {
			// Preserve the handoff for an explicit retry on the next tracker focus
			// instead of silently dropping a failed network/authorization attempt.
			enqueueInitiativeAdditions(item);
			logger.warn(
				`C3 companion combat handoff failed: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		});
	}
}

/** Register once before React mounts so InitiativeTracker drain events are caught. */
export function registerCompanionInitiativeBridge(): void {
	if (registered || typeof window === "undefined") return;
	registered = true;
	window.addEventListener(
		COMPANION_COMBAT_HANDOFF_EVENT,
		onCompanionCombatHandoff,
	);
}
