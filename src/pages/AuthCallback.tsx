import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SystemSigilLogo } from "@/components/ui/SystemSigilLogo";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { supabase } from "@/integrations/supabase/client";
import { isSafeNextPath } from "@/lib/campaignInviteUtils";
import { logger } from "@/lib/logger";

const normalizeRole = (value: string | null): "PW" | "player" | null => {
	if (value === "PW" || value === "player") return value;
	return null;
};

export default function AuthCallback() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const handleAuthCallback = async () => {
			const code = searchParams.get("code");
			const error = searchParams.get("error");
			const errorDescription = searchParams.get("error_description");
			const queryNext = searchParams.get("next");

			if (error) {
				logger.error("Auth callback error:", error, errorDescription);
				navigate(
					`/login?error=${encodeURIComponent(errorDescription || error)}`,
				);
				return;
			}

			try {
				let session = (await supabase.auth.getSession()).data.session ?? null;
				let user = session?.user ?? null;

				if (!session && code) {
					const { data, error } =
						await supabase.auth.exchangeCodeForSession(code);
					if (error) {
						throw error;
					}
					session = data.session ?? null;
					user = data.user ?? null;
				}

				if (!user) {
					const { data } = await supabase.auth.getUser();
					user = data.user ?? null;
				}

				if (!user) {
					navigate(
						`/login?error=${encodeURIComponent("Authentication failed")}`,
					);
					return;
				}

				const { data: profileRows, error: profileError } = await supabase
					.from("profiles")
					.select("role")
					.eq("id", user.id)
					.limit(1);

				if (profileError) {
					logger.error("Error loading user profile:", profileError);
				}

				let role = profileRows?.[0]?.role
					? normalizeRole(profileRows[0].role)
					: null;

				const pendingRole =
					typeof window !== "undefined"
						? normalizeRole(localStorage.getItem("pending-oauth-role"))
						: null;
				if (typeof window !== "undefined") {
					localStorage.removeItem("pending-oauth-role");
				}

				if (!role && pendingRole) {
					const { error: roleError } = await supabase.from("profiles").upsert(
						{
							id: user.id,
							email: user.email ?? "",
							role: pendingRole,
							updated_at: new Date().toISOString(),
						},
						{ onConflict: "id" },
					);

					if (roleError) {
						logger.error("Error setting role after OAuth sign-in:", roleError);
					} else {
						role = pendingRole;
					}
				}

				if (!role) {
					navigate("/auth");
					return;
				}

				const pendingNext =
					typeof window !== "undefined"
						? localStorage.getItem("pending-auth-next")
						: null;
				if (typeof window !== "undefined") {
					localStorage.removeItem("pending-auth-next");
				}

				const resumePath =
					(isSafeNextPath(queryNext) && queryNext) ||
					(isSafeNextPath(pendingNext) && pendingNext) ||
					null;

				if (resumePath) {
					navigate(resumePath);
					return;
				}

				navigate(role === "PW" ? "/warden-protocols" : "/player-tools");
			} catch (error) {
				logger.error("Error completing auth callback:", error);
				navigate(`/login?error=${encodeURIComponent("Authentication failed")}`);
			}
		};

		handleAuthCallback();
	}, [navigate, searchParams]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<SystemWindow variant="arise">
					<div className="p-6">
						<div className="flex justify-center mb-6">
							<SystemSigilLogo size="md" variant="supreme" />
						</div>

						<div className="flex flex-col items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
							<SystemHeading
								level={2}
								variant="sovereign"
								dimensional
								className="mb-2"
							>
								Authenticating Link
							</SystemHeading>
							<DataStreamText
								variant="system"
								speed="slow"
								className="text-center"
							>
								Please wait while the system verifies credentials...
							</DataStreamText>
						</div>
					</div>
				</SystemWindow>
			</div>
		</div>
	);
}
