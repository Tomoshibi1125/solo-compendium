/**
 * Forgot Password — request a Supabase recovery email.
 * The emailed link lands on /reset-password with a recovery session.
 */

import { KeyRound } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { useAuth } from "@/lib/auth/authContext";

export default function ForgotPassword() {
	const { requestPasswordReset } = useAuth();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await requestPasswordReset(email);
		setLoading(false);
		if (result.error) {
			setError(result.error);
		} else {
			setSent(true);
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
						Restore Access
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="text-lg">
						Recover your Ascendant credentials
					</ManaFlowText>
				</div>

				<div className="ra-card p-8 ascendant-materialize">
					{sent ? (
						<div className="space-y-6 text-center">
							<div className="bg-success/20 border border-success/50 text-success-foreground px-4 py-3 rounded-[2px] font-heading text-sm">
								If an account exists for {email}, a recovery link is on its way.
								Open it on this device to set a new password.
							</div>
							<AscendantText className="block text-sm text-muted-foreground">
								Nothing arriving? Check your spam folder, or{" "}
								<button
									type="button"
									onClick={() => setSent(false)}
									className="text-primary hover:text-primary/80 font-heading"
								>
									try again
								</button>
								.
							</AscendantText>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="reset-email"
									className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
								>
									Email Address
								</label>
								<input
									id="reset-email"
									data-testid="reset-email-input"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body"
									placeholder="ascendant@rift-ascendant.world"
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
								disabled={loading}
								className="w-full bg-gradient-to-r from-primary to-shadow-blue text-primary-foreground font-heading font-bold py-3 px-4 rounded-[2px] hover:from-primary/90 hover:to-shadow-blue/90 transition-all duration-200 shadow-lg shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider uppercase ra-btn-glow"
							>
								<span className="flex items-center justify-center gap-2">
									<KeyRound className="w-5 h-5" />
									{loading ? "Sending..." : "Send Recovery Link"}
								</span>
							</button>
						</form>
					)}

					<div className="mt-6 text-center">
						<Link
							to="/login"
							className="text-primary hover:text-primary/80 font-heading font-medium tracking-wider text-sm"
						>
							Back to Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
