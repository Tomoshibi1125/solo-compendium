import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface UseLicenseEnforcementReturn {
	canAccessSRD: boolean;
	canAccessHomebrew: boolean;
	canAccessMarketplace: boolean;
	isLoading: boolean;
}

export function useLicenseEnforcement(): UseLicenseEnforcementReturn {
	const { user } = useAuth();
	const [canAccessSRD, _setCanAccessSRD] = useState(true); // Base Rift Ascendant SRD is always free
	const [canAccessHomebrew, _setCanAccessHomebrew] = useState(true); // Public homebrew is accessible
	const [canAccessMarketplace, setCanAccessMarketplace] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkLicenses() {
			if (!user) {
				setIsLoading(false);
				return;
			}

			try {
				// Here you would typically check user's roles, subscriptions, or purchased content
				// For Rift Ascendant, we verify if they have unlocked marketplace access
				const { data, error } = await supabase
					.from("profiles")
					.select("role")
					.eq("id", user.id)
					.single();

				if (error) throw error;

				// Admins and full users get marketplace access, guests do not
				const hasAccess = data?.role === "admin" || data?.role === "user";
				setCanAccessMarketplace(hasAccess);
			} catch (error) {
				console.error("Error checking license enforcement:", error);
			} finally {
				setIsLoading(false);
			}
		}

		checkLicenses();
	}, [user]);

	return {
		canAccessSRD,
		canAccessHomebrew,
		canAccessMarketplace,
		isLoading,
	};
}
