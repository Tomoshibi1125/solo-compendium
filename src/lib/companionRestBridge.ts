import { supabase } from "@/integrations/supabase/client";
import {
	DomainEventBus,
	type RestLongEvent,
	type RestShortEvent,
} from "@/lib/domainEvents";
import { isLocalCharacterId } from "@/lib/guestStore";
import { logger } from "@/lib/logger";

type CompanionRestKind = "short" | "long";

let registered = false;

async function applyCompanionRest(
	characterId: string,
	restKind: CompanionRestKind,
): Promise<void> {
	// C3 persistence is cloud-backed. Guest/local companions keep their existing
	// manual behavior until a local living-instance store exists.
	if (!characterId || isLocalCharacterId(characterId)) return;

	const rpc = supabase.rpc as unknown as (
		fn: string,
		args: Record<string, unknown>,
	) => Promise<{ data: unknown; error: { message: string } | null }>;

	const { error } = await rpc("rest_companions_for_character", {
		p_character_id: characterId,
		p_rest_kind: restKind,
	});
	if (error) {
		logger.warn(
			`C3 companion ${restKind} rest could not be applied for ${characterId}: ${error.message}`,
		);
	}
}

const onShortRest = (event: RestShortEvent) => {
	void applyCompanionRest(event.characterId, "short");
};

const onLongRest = (event: RestLongEvent) => {
	void applyCompanionRest(event.characterId, "long");
};

/**
 * Register once at application startup. The existing rest system remains the
 * authority for character rest resolution; C3 listens to its typed lifecycle
 * events and applies only explicitly authored companion rest profile rules.
 */
export function registerCompanionRestBridge(): void {
	if (registered) return;
	registered = true;
	DomainEventBus.on("rest:short", onShortRest);
	DomainEventBus.on("rest:long", onLongRest);
}
