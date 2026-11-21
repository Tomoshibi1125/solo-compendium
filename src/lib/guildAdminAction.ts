import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type GuildAdminAction =
	| "change_member_role"
	| "remove_member"
	| "transfer_leadership"
	| "leave_guild"
	| "disband_guild"
	| "adjust_funds"
	| "update_info"
	| "update_base_state"
	| "recruit_npc"
	| "level_npc"
	| "set_npc_leveling_mode"
	| "accept_quest"
	| "assign_quest_squad"
	| "reject_join_request";

/** Execute a guild mutation only through the actor-checked database boundary. */
export async function guildAdminAction(
	guildId: string,
	action: GuildAdminAction,
	payload: Json = {},
): Promise<Json> {
	const { data, error } = await supabase.rpc("guild_admin_action", {
		p_guild_id: guildId,
		p_action: action,
		p_payload: payload,
	});
	if (error) throw error;
	return data;
}
