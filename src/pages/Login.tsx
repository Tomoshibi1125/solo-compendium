/**
 * Login Page - Main Entry Point
 * System Ascendant styled authentication page
 */

import { Eye, EyeOff, Shield, Sword, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { OAuthButtons } from "@/components/auth/OAuthButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { type OAuthProvider, useOAuth } from "@/hooks/useOAuth";
import { useAuth } from "@/lib/auth/authContext";
import { isSafeNextPath } from "@/lib/campaignInviteUtils";
import { setLocalGuestRole } from "@/lib/guestStore";

export default function Login() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [role, setRole] = useState<"dm" | "player">("player");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");

	const { signIn, signUp } = useAuth();
	const { isLoading: oauthLoading, signInWithProvider } = useOAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const requestedNext = searchParams.get("next");
	const safeNext = isSafeNextPath(requestedNext) ? requestedNext : null;
	const oauthEnabled = import.meta.env.VITE_OAUTH_ENABLED === "true";
	const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

	useEffect(() => {
		const authError = searchParams.get("error");
		if (authError) {
			setError(authError);
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setNotice("");

		if (typeof window !== "undefined") {
			if (safeNext) {
				localStorage.setItem("pending-auth-next", safeNext);
			} else {
				localStorage.removeItem("pending-auth-next");
			}
		}

		try {
			const result = isSignUp
				? await signUp(email, password, displayName, role)
				: await signIn(email, password, role);

			if (result.error) {
				setError(result.error);
			} else if (result.needsEmailConfirmation) {
				setNotice("Check your email to confirm your account, then sign in.");
			} else {
				if (typeof window !== "undefined") {
					localStorage.removeItem("pending-auth-next");
				}
				if (safeNext) {
					navigate(safeNext);
				} else {
					navigate("/landing");
				}
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleOAuthSignIn = async (provider: OAuthProvider) => {
		setError("");
		setNotice("");
		if (typeof window !== "undefined") {
			localStorage.setItem("pending-oauth-role", role);
			if (safeNext) {
				localStorage.setItem("pending-auth-next", safeNext);
			} else {
				localStorage.removeItem("pending-auth-next");
			}
		}
		await signInWithProvider(provider);
	};

	const handleContinueAsGuest = () => {
		setError("");
		setNotice("");
		if (typeof window !== "undefined") {
			localStorage.removeItem("pending-auth-next");
		}
		setLocalGuestRole(role);
		navigate("/landing");
	};

	return (
		<div
			className="min-h-screen bg-background flex items-center justify-center p-4"
			data-sa-zone="auth"
		>
			{/* Background Art */}
			<div className="absolute inset-0 bg-cover bg-center opacity-20 login-page-bg" />

			{/* Hex grid + data rain overlays */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-0 hex-grid-overlay opacity-[0.03]" />
				<div className="absolute inset-0 data-rain-overlay opacity-[0.02]" />
			</div>

			{/* Umbral Energy Effects */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10 animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-shadow-blue rounded-full filter blur-3xl opacity-10 animate-pulse" />
				<div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
			</div>

			<div className="relative z-10 w-full max-w-md">
				<div className="mb-6 flex justify-start">
					<Link
						to="/landing"
						className="text-sm text-muted-foreground hover:text-primary transition-colors font-system tracking-wider uppercase text-[0.7rem]"
					>
						[ View Landing Page ]
					</Link>
				</div>
				{/* Logo and Title */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<OptimizedImage
							src="/ui-art/shadow-soldier-emblem.webp"
							alt="Umbral Legionnaire Emblem"
							className="w-20 h-20 rounded-full border-2 border-primary shadow-lg shadow-primary/50"
							size="small"
						/>
					</div>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						System Ascendant
					</SystemHeading>
					<DataStreamText variant="system" speed="slow" className="text-lg">
						{isSignUp
							? "Initiate Awakening Protocol"
							: "Restore System Connection"}
					</DataStreamText>
				</div>

				{/* Login Form — SA glassmorphic card */}
				<div className="sa-card p-8 system-materialize">
					{oauthEnabled && (
						<div className="mb-6 space-y-4">
							<OAuthButtons
								isLoading={oauthLoading}
								onSignIn={handleOAuthSignIn}
							/>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full sa-divider"></div>
								</div>
								<div className="relative flex justify-center text-xs">
									<span className="bg-card/80 px-2 text-muted-foreground font-system tracking-wider uppercase text-[0.65rem]">
										or continue with email
									</span>
								</div>
							</div>
						</div>
					)}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Role Selection */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
							<button
								type="button"
								onClick={() => setRole("player")}
								aria-label="Select Player role"
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[2px] font-heading font-medium tracking-wider uppercase transition-all sa-btn-glow ${role === "player"
									? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 border border-primary/60"
									: "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80 hover:border-primary/30"
									}`}
							>
								<Users className="w-4 h-4" />
								Player
							</button>
							<button
								type="button"
								onClick={() => setRole("dm")}
								aria-label="Select Protocol Warden role"
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[2px] font-heading font-medium tracking-wider uppercase transition-all sa-btn-glow ${role === "dm"
									? "bg-shadow-purple text-white shadow-lg shadow-shadow-purple/50 border border-shadow-purple/60"
									: "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80 hover:border-shadow-purple/30"
									}`}
							>
								<Shield className="w-4 h-4" />
								Protocol Warden
							</button>
						</div>

						{/* Sign Up Additional Fields */}
						{isSignUp && (
							<div>
								<label
									htmlFor="display-name"
									className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
								>
									Display Name
								</label>
								<input
									id="display-name"
									type="text"
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body"
									placeholder="Character name (e.g., Kael Voss)"
									required
								/>
							</div>
						)}

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
							>
								Email Address
							</label>
							<input
								id="email"
								data-testid="email-input"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body"
								placeholder="ascendant@system-ascendant.world"
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-heading font-medium text-foreground mb-2 tracking-wider uppercase"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									data-testid="password-input"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-primary/30 rounded-[2px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-all font-body pr-12"
									placeholder="Ascendant access code"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-[2px] font-system text-sm">
								{error}
							</div>
						)}

						{/* Notice Message */}
						{notice && (
							<div className="bg-success/20 border border-success/50 text-success-foreground px-4 py-3 rounded-[2px] font-system text-sm">
								{notice}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || oauthLoading}
							className="w-full bg-gradient-to-r from-primary to-shadow-blue text-primary-foreground font-heading font-bold py-3 px-4 rounded-[2px] hover:from-primary/90 hover:to-shadow-blue/90 transition-all duration-200 shadow-lg shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider uppercase sa-btn-glow"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Processing...
								</span>
							) : (
								<span className="flex items-center justify-center gap-2">
									<Sword className="w-5 h-5" />
									{isSignUp ? "Begin Ascension" : "Enter the System"}
								</span>
							)}
						</button>

						{guestEnabled && (
							<div className="space-y-3">
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full sa-divider"></div>
									</div>
									<div className="relative flex justify-center text-xs">
										<span className="bg-card/80 px-2 text-muted-foreground font-system tracking-wider uppercase text-[0.65rem]">
											or continue as guest
										</span>
									</div>
								</div>
								<button
									type="button"
									onClick={handleContinueAsGuest}
									className="w-full border border-primary/30 text-foreground font-heading font-semibold py-3 px-4 rounded-[2px] hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 tracking-wider uppercase sa-btn-glow"
								>
									Continue as Guest (
									{role === "dm" ? "Protocol Warden" : "Player"})
								</button>
								<SystemText className="block text-xs text-muted-foreground text-center font-system tracking-wider">
									Guest mode saves data only in this browser.
								</SystemText>
							</div>
						)}
					</form>

					{/* Toggle Sign Up/In */}
					<div className="mt-6 text-center">
						<SystemText className="block text-muted-foreground font-body">
							{isSignUp ? "Already have an account?" : "Don't have an account?"}
							<button
								type="button"
								onClick={() => setIsSignUp(!isSignUp)}
								aria-label={
									isSignUp ? "Switch to sign in" : "Switch to sign up"
								}
								className="ml-2 text-primary hover:text-primary/80 font-heading font-medium tracking-wider"
							>
								{isSignUp ? "Sign In" : "Sign Up"}
							</button>
						</SystemText>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center text-muted-foreground text-sm font-system tracking-wider">
					<p>System Ascendant Companion</p>
					<SystemText className="block mt-1 text-muted-foreground/60">
						Enter the shadows, become the ultimate ascendant
					</SystemText>
				</div>
			</div>
		</div>
	);
}
