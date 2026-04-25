import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/authContext";

export type CampaignRoleMode = "ascendant" | "warden";
export type CampaignRoleEligibility =
	| "ascendant"
	| "co-warden"
	| "warden"
	| null;

const STORAGE_PREFIX = "solo-compendium.campaign-role-mode.v1";

export const getCampaignRoleModeStorageKey = (
	campaignId: string,
	userId: string,
) => `${STORAGE_PREFIX}:${userId}:${campaignId}`;

const parseCampaignRoleMode = (
	value: string | null,
): CampaignRoleMode | null => {
	if (value === "ascendant" || value === "warden") return value;
	return null;
};

export const resolveCampaignRoleMode = ({
	eligibleRole,
	storedMode,
}: {
	eligibleRole: CampaignRoleEligibility;
	storedMode: CampaignRoleMode | null;
}): CampaignRoleMode => {
	if (eligibleRole === "warden") return "warden";
	if (eligibleRole === "co-warden")
		return storedMode === "warden" ? "warden" : "ascendant";
	return "ascendant";
};

const readCampaignRoleMode = (
	storageKey: string | null,
): CampaignRoleMode | null => {
	if (!storageKey || typeof window === "undefined") return null;
	return parseCampaignRoleMode(window.localStorage.getItem(storageKey));
};

export function useCampaignRoleMode(
	campaignId: string,
	eligibleRole: CampaignRoleEligibility,
) {
	const { user } = useAuth();
	const storageKey = useMemo(
		() =>
			campaignId && user?.id
				? getCampaignRoleModeStorageKey(campaignId, user.id)
				: null,
		[campaignId, user?.id],
	);
	const [storedMode, setStoredMode] = useState<CampaignRoleMode | null>(null);

	useEffect(() => {
		setStoredMode(readCampaignRoleMode(storageKey));
	}, [storageKey]);

	const currentMode = resolveCampaignRoleMode({ eligibleRole, storedMode });

	useEffect(() => {
		if (!storageKey || typeof window === "undefined") return;
		if (eligibleRole !== "co-warden") {
			window.localStorage.removeItem(storageKey);
			if (storedMode !== null) setStoredMode(null);
		}
	}, [eligibleRole, storageKey, storedMode]);

	const setCurrentMode = useCallback(
		(mode: CampaignRoleMode) => {
			if (eligibleRole !== "co-warden") return;
			const nextMode = mode === "warden" ? "warden" : "ascendant";
			setStoredMode(nextMode);
			if (storageKey && typeof window !== "undefined") {
				window.localStorage.setItem(storageKey, nextMode);
			}
		},
		[eligibleRole, storageKey],
	);

	return {
		currentMode,
		canActAsWarden:
			eligibleRole === "warden" ||
			(eligibleRole === "co-warden" && currentMode === "warden"),
		canChooseWardenMode: eligibleRole === "co-warden",
		setCurrentMode,
	};
}
