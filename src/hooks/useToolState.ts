import { useEffect, useMemo, useState } from "react";
import {
	buildToolStorageKey,
	type RemoteAdapter,
	type ToolStateOptions,
	type ToolStateResult,
	usePersistedToolState,
} from "@/hooks/createPersistedToolState";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import { warn as logWarn } from "@/lib/logger";

// Re-exported for backward compatibility — these now live in the factory so the
// generic persistence layer has no Supabase dependency.
export {
	readLocalToolState,
	writeLocalToolState,
} from "@/hooks/createPersistedToolState";

const loadUserToolState = async <T>(
	userId: string,
	toolKey: string,
): Promise<T | null> => {
	if (!isSupabaseConfigured || !userId) return null;
	const { data, error } = await supabase
		.from("user_tool_states")
		.select("state")
		.eq("user_id", userId)
		.eq("tool_key", toolKey)
		.maybeSingle();
	if (error) {
		logWarn(`Failed to load user tool state: ${toolKey}`);
		return null;
	}
	return (data?.state as T) ?? null;
};

export const saveUserToolState = async <T>(
	userId: string,
	toolKey: string,
	state: T,
): Promise<void> => {
	if (!isSupabaseConfigured || !userId) return;
	const payload: Database["public"]["Tables"]["user_tool_states"]["Insert"] = {
		user_id: userId,
		tool_key: toolKey,
		state: state as Json,
	};
	const { error } = await supabase
		.from("user_tool_states")
		.upsert(payload, { onConflict: "user_id,tool_key" });
	if (error) {
		logWarn(`Failed to save user tool state: ${toolKey}`);
	}
};

const loadCampaignToolState = async <T>(
	campaignId: string,
	toolKey: string,
): Promise<T | null> => {
	if (!isSupabaseConfigured || !campaignId) return null;
	const { data, error } = await supabase
		.from("campaign_tool_states")
		.select("state")
		.eq("campaign_id", campaignId)
		.eq("tool_key", toolKey)
		.maybeSingle();
	if (error) {
		logWarn(`Failed to load campaign tool state: ${toolKey}`);
		return null;
	}
	return (data?.state as T) ?? null;
};

export const saveCampaignToolState = async <T>(
	campaignId: string,
	userId: string | null,
	toolKey: string,
	state: T,
): Promise<void> => {
	if (!isSupabaseConfigured || !campaignId || !userId) return;
	const payload: Database["public"]["Tables"]["campaign_tool_states"]["Insert"] =
		{
			campaign_id: campaignId,
			tool_key: toolKey,
			state: state as Json,
			created_by: userId,
			updated_by: userId,
		};
	const { error } = await supabase
		.from("campaign_tool_states")
		.upsert(payload, { onConflict: "campaign_id,tool_key" });
	if (error) {
		logWarn(`Failed to save campaign tool state: ${toolKey}`);
	}
};

export const useUserToolState = <T>(
	toolKey: string,
	options: ToolStateOptions<T>,
): ToolStateResult<T> => {
	const { user, loading } = useAuth();
	const userId = user?.id;
	const isAuthed = isSupabaseConfigured && !!userId;
	const storageKey = options.storageKey ?? buildToolStorageKey(toolKey);

	const adapter = useMemo<RemoteAdapter<T>>(
		() => ({
			canUseRemote: isAuthed,
			scopeReady: true,
			load: () =>
				isAuthed && userId ? loadUserToolState<T>(userId, toolKey) : null,
			save: (state) =>
				userId ? saveUserToolState(userId, toolKey, state) : Promise.resolve(),
		}),
		[isAuthed, userId, toolKey],
	);

	return usePersistedToolState<T>({
		storageKey,
		initialState: options.initialState,
		enabled: options.enabled !== false,
		authLoading: loading,
		adapter,
	});
};

export const useCampaignToolState = <T>(
	campaignId: string | null,
	toolKey: string,
	options: ToolStateOptions<T>,
): ToolStateResult<T> => {
	const { user, loading } = useAuth();
	const userId = user?.id ?? null;
	const isAuthed = isSupabaseConfigured && !!userId;
	const storageKey =
		options.storageKey ??
		buildToolStorageKey(`${toolKey}.${campaignId || "unknown"}`);

	const adapter = useMemo<RemoteAdapter<T>>(
		() => ({
			canUseRemote: isAuthed,
			scopeReady: !!campaignId,
			load: () =>
				campaignId && isAuthed
					? loadCampaignToolState<T>(campaignId, toolKey)
					: null,
			save: (state) =>
				campaignId
					? saveCampaignToolState(campaignId, userId, toolKey, state)
					: Promise.resolve(),
		}),
		[isAuthed, campaignId, toolKey, userId],
	);

	return usePersistedToolState<T>({
		storageKey,
		initialState: options.initialState,
		enabled: options.enabled !== false,
		authLoading: loading,
		adapter,
	});
};

export const useUserLocalState = <T>(
	key: string,
	options: { initialState: T; storageKey?: string },
): {
	state: T;
	setState: React.Dispatch<React.SetStateAction<T>>;
	isAuthed: boolean;
} => {
	const { user } = useAuth();
	const [state, setState] = useState<T>(options.initialState);
	const isAuthed = isSupabaseConfigured && !!user?.id;
	const baseStorageKey = options.storageKey ?? `solo-compendium.${key}`;
	const storageKey = isAuthed
		? `solo-compendium.user.${user.id}.${key}`
		: baseStorageKey;

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const stored = window.localStorage.getItem(storageKey);
			if (stored) {
				setState(JSON.parse(stored) as T);
			}
		} catch (error) {
			logWarn(`Failed to load user local state: ${key}`, error);
		}
	}, [storageKey, key]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(state));
		} catch (error) {
			logWarn(`Failed to save user local state: ${key}`, error);
		}
	}, [state, storageKey, key]);

	return { state, setState, isAuthed };
};
