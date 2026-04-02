import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import { warn as logWarn } from "@/lib/logger";

const DEFAULT_STORAGE_PREFIX = "solo-compendium.tool";

const buildToolStorageKey = (toolKey: string) =>
	`${DEFAULT_STORAGE_PREFIX}.${toolKey}`;

export const readLocalToolState = <T>(storageKey: string): T | null => {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		return JSON.parse(raw) as T;
	} catch (error) {
		logWarn(
			`Failed to read tool state from localStorage: ${storageKey}`,
			error,
		);
		return null;
	}
};

export const writeLocalToolState = <T>(storageKey: string, state: T): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(storageKey, JSON.stringify(state));
	} catch (error) {
		logWarn(`Failed to write tool state to localStorage: ${storageKey}`, error);
	}
};

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

type ToolStateOptions<T> = {
	storageKey?: string;
	initialState: T;
	enabled?: boolean;
};

type ToolStateResult<T> = {
	state: T;
	setState: React.Dispatch<React.SetStateAction<T>>;
	isLoading: boolean;
	saveNow: (nextState?: T) => Promise<void>;
	isAuthed: boolean;
};

export const useUserToolState = <T>(
	toolKey: string,
	options: ToolStateOptions<T>,
): ToolStateResult<T> => {
	const { user, loading } = useAuth();
	const [state, setState] = useState<T>(options.initialState);
	const isEnabled = options.enabled !== false;
	const [isLoading, setIsLoading] = useState(isEnabled);
	const isAuthed = isSupabaseConfigured && !!user?.id;
	const storageKey = options.storageKey ?? buildToolStorageKey(toolKey);
	const allowLocalFallback = true;

	useEffect(() => {
		if (!isEnabled) {
			setIsLoading(false);
			return;
		}
		if (loading) return;
		let active = true;
		const loadState = async () => {
			setIsLoading(true);
			const fallback = allowLocalFallback
				? readLocalToolState<T>(storageKey)
				: null;
			if (!isAuthed || !user?.id) {
				if (active && fallback !== null) setState(fallback);
				setIsLoading(false);
				return;
			}

			const remote = await loadUserToolState<T>(user.id, toolKey);
			if (!active) return;
			if (remote !== null) {
				setState(remote);
				if (allowLocalFallback) {
					writeLocalToolState(storageKey, remote);
				}
			} else if (fallback !== null) {
				setState(fallback);
			}
			setIsLoading(false);
		};
		void loadState();
		return () => {
			active = false;
		};
	}, [isAuthed, isEnabled, loading, storageKey, toolKey, user?.id]);

	const saveNow = useCallback(
		async (nextState?: T) => {
			if (!isEnabled) return;
			const payload = nextState ?? state;
			if (allowLocalFallback) {
				writeLocalToolState(storageKey, payload);
			}
			if (!isAuthed || !user?.id) {
				return;
			}
			await saveUserToolState(user.id, toolKey, payload);
		},
		[isAuthed, isEnabled, state, storageKey, toolKey, user?.id],
	);

	return {
		state,
		setState,
		isLoading: isEnabled ? isLoading : false,
		saveNow,
		isAuthed,
	};
};

export const useCampaignToolState = <T>(
	campaignId: string | null,
	toolKey: string,
	options: ToolStateOptions<T>,
): ToolStateResult<T> => {
	const { user, loading } = useAuth();
	const [state, setState] = useState<T>(options.initialState);
	const isEnabled = options.enabled !== false;
	const [isLoading, setIsLoading] = useState(isEnabled);
	const isAuthed = isSupabaseConfigured && !!user?.id;
	const storageKey =
		options.storageKey ??
		buildToolStorageKey(`${toolKey}.${campaignId || "unknown"}`);
	const allowLocalFallback = true;

	useEffect(() => {
		if (!isEnabled) {
			setIsLoading(false);
			return;
		}
		if (loading) return;
		let active = true;
		const loadState = async () => {
			if (!campaignId) {
				setIsLoading(false);
				return;
			}
			setIsLoading(true);
			const fallback = allowLocalFallback
				? readLocalToolState<T>(storageKey)
				: null;
			if (!isAuthed) {
				if (active && fallback !== null) setState(fallback);
				setIsLoading(false);
				return;
			}

			const remote = await loadCampaignToolState<T>(campaignId, toolKey);
			if (!active) return;
			if (remote !== null) {
				setState(remote);
				if (allowLocalFallback) {
					writeLocalToolState(storageKey, remote);
				}
			} else if (fallback !== null) {
				setState(fallback);
			}
			setIsLoading(false);
		};
		void loadState();
		return () => {
			active = false;
		};
	}, [campaignId, isAuthed, isEnabled, loading, storageKey, toolKey]);

	const saveNow = useCallback(
		async (nextState?: T) => {
			if (!isEnabled) return;
			const payload = nextState ?? state;
			if (allowLocalFallback) {
				writeLocalToolState(storageKey, payload);
			}
			if (!campaignId) return;
			if (!isAuthed) {
				return;
			}
			await saveCampaignToolState(
				campaignId,
				user?.id ?? null,
				toolKey,
				payload,
			);
		},
		[campaignId, isAuthed, isEnabled, state, storageKey, toolKey, user?.id],
	);

	return {
		state,
		setState,
		isLoading: isEnabled ? isLoading : false,
		saveNow,
		isAuthed,
	};
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
