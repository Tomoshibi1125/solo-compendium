/**
 * Reset Password — landing page for the Supabase recovery email link.
 * The link establishes a recovery session (handled by supabase-js from the
 * URL hash); this page then sets the new password via auth.updateUser.
 */

import { ShieldCheck } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [hasSession, setHasSession] = useState<boolean | null>(null);

	useEffect(() => {
		// The recovery link puts tokens in the URL hash; supabase-js consumes
		// them and emits a session. Poll once after mount so deep links work.
		let mounted = true;
		void supabase.auth.getSession().then(({ data }) => {
			if (mounted) setHasSession(Boolean(data.session));
		});
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (mounted) setHasSession(Boolean(session));
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const { error: updateError } = await supabase.auth.updateUser({
				password,
			});
			if (updateError) {
				setError(updateError.message);
				return;
			}
			navigate("/login", { replace: true });
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen bg-transparent flex items-center justify-center p-4"
			data-ra-zone="auth"
		>
			<div className="relative z-10 w-full max-w-md">
				<div className="text-center mb-8">
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Reforge Access Code
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="text-lg">
						Set a new password for your account
					</ManaFlowText>
				</div>

				<div className="ra-card p-8 ascendant-materialize">
					{hasSession === false ? (
						<div className="space-y-6 text-center">
							<div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-[2px] font-heading text-sm">
								This page only works from a recovery email link. Request a new
								one and open it on this device.
							</div>
							<Link
								to="/forgot-password"
								className="text-primary hover:text-primary/80 font-heading font-medium tracking-wider text-sm"
							>
								Request Recovery Link
							</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="new-password"
									className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
								>
									New Password
								</label>
								<input
									id="new-password"
									data-testid="new-password-input"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body"
									placeholder="At least 8 characters"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="confirm-password"
									className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
								>
									Confirm Password
								</label>
								<input
									id="confirm-password"
									data-testid="confirm-password-input"
									type="password"
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body"
									placeholder="Repeat the new password"
									required
								/>
							</div>

							{error && (
								<div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-[2px] font-heading text-sm">
									{error}
								</div>
							)}

							<button
								type="submit"
								disabled={loading || hasSession !== true}
								className="w-full bg-gradient-to-r from-primary to-shadow-blue text-primary-foreground font-heading font-bold py-3 px-4 rounded-[2px] hover:from-primary/90 hover:to-shadow-blue/90 transition-all duration-200 shadow-lg shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider uppercase ra-btn-glow"
							>
								<span className="flex items-center justify-center gap-2">
									<ShieldCheck className="w-5 h-5" />
									{loading ? "Updating..." : "Set New Password"}
								</span>
							</button>
						</form>
					)}

					<div className="mt-6 text-center">
						<AscendantText className="block text-xs text-muted-foreground">
							Once updated you'll sign in with the new password.
						</AscendantText>
					</div>
				</div>
			</div>
		</div>
	);
}
