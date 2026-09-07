import {
	Bell,
	BellOff,
	BellRing,
	Camera,
	KeyRound,
	LogOut,
	RefreshCw,
	Save,
	ShieldCheck,
	Type,
	User,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AIProviderSettings } from "@/components/ai/AIProviderSettings";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/lib/auth/authContext";
import { validateNewPassword } from "@/lib/auth/authErrors";
import { cn } from "@/lib/utils";

// Font size preference stored in localStorage
const FONT_SIZE_KEY = "sa_ui_font_size";
const FONT_SIZES = [
	{ label: "Small", value: "text-sm", cssVar: "14px" },
	{ label: "Default", value: "text-base", cssVar: "16px" },
	{ label: "Large", value: "text-lg", cssVar: "18px" },
];

export default function Profile() {
	const navigate = useNavigate();
	const {
		user,
		session,
		signOut,
		updateProfile,
		beginPasswordChange,
		confirmPasswordChange,
	} = useAuth();
	const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const displayName = useMemo(
		() => user?.displayName || user?.email || "User",
		[user],
	);

	// Editable state
	const [nameInput, setNameInput] = useState(displayName);
	const [savingName, setSavingName] = useState(false);

	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		user?.avatar ?? null,
	);
	const [selectedFontSize, setSelectedFontSize] = useState<string>(
		() => localStorage.getItem(FONT_SIZE_KEY) || "text-base",
	);
	const [passwordStep, setPasswordStep] = useState<"idle" | "verify">("idle");
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordBusy, setPasswordBusy] = useState(false);
	const [passwordError, setPasswordError] = useState("");

	const {
		isSupported: pushSupported,
		permission: pushPermission,
		requestPermission: requestPush,
		sendNotification: sendPush,
	} = usePushNotifications();
	const [requestingPush, setRequestingPush] = useState(false);

	const handleEnablePush = async () => {
		setRequestingPush(true);
		try {
			const result = await requestPush();
			if (result === "granted") {
				toast({
					title: "Notifications enabled",
					description: "You'll get browser alerts for important events.",
				});
				// Confirm it works with an immediate test notification.
				sendPush("Rift Ascendant", {
					body: "Browser notifications are now on.",
				});
			} else if (result === "denied") {
				toast({
					title: "Notifications blocked",
					description:
						"Your browser denied permission. Re-enable it in your browser's site settings.",
					variant: "destructive",
				});
			}
		} finally {
			setRequestingPush(false);
		}
	};

	const handleSaveName = async () => {
		if (!nameInput.trim()) return;
		setSavingName(true);
		try {
			const { error } = await updateProfile({
				displayName: nameInput.trim(),
			});
			if (error) throw new Error(error);
			toast({
				title: "Display name updated",
				description: `Now showing as "${nameInput.trim()}"`,
			});
		} catch (err) {
			toast({
				title: "Failed to update name",
				description: err instanceof Error ? err.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setSavingName(false);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			toast({
				title: "File too large",
				description: "Avatar must be under 2 MB.",
				variant: "destructive",
			});
			return;
		}

		// Preview immediately
		const reader = new FileReader();
		reader.onload = async (ev) => {
			const dataUrl = ev.target?.result as string;
			setAvatarPreview(dataUrl);

			// Save avatar to user metadata through the normalized Auth context.
			try {
				const { error } = await updateProfile({ avatar: dataUrl });
				if (error) throw new Error(error);
				toast({ title: "Avatar updated" });
			} catch (err) {
				toast({
					title: "Failed to save avatar",
					description: err instanceof Error ? err.message : "Unknown error",
					variant: "destructive",
				});
			}
		};
		reader.readAsDataURL(file);
	};

	const handleFontSizeChange = (value: string) => {
		setSelectedFontSize(value);
		localStorage.setItem(FONT_SIZE_KEY, value);
		const size = FONT_SIZES.find((f) => f.value === value);
		if (size) {
			document.documentElement.style.setProperty("--ui-font-size", size.cssVar);
		}
		toast({
			title: "Font size updated",
			description: `UI text size set to ${FONT_SIZES.find((f) => f.value === value)?.label}`,
		});
	};

	const handleSignOut = async () => {
		await signOut();
		navigate("/login");
	};

	const handleRoleToggle = async () => {
		const newRole = user?.role === "warden" ? "ascendant" : "warden";
		const { error } = await updateProfile({ role: newRole });
		if (error) {
			toast({
				title: "Failed to switch role",
				description: error,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Role updated",
				description: `Successfully switched to ${newRole} mode.`,
			});
			setTimeout(() => {
				if (newRole === "warden") {
					navigate("/warden-directives");
				} else {
					navigate("/ascendant-tools");
				}
			}, 300);
		}
	};

	const handleBeginPasswordChange = async () => {
		setPasswordBusy(true);
		setPasswordError("");
		try {
			const result = await beginPasswordChange();
			if (result.error) {
				setPasswordError(result.error);
				return;
			}
			setPasswordStep("verify");
			setVerificationCode("");
			toast({
				title: "Verification code sent",
				description: "Check your account email before continuing.",
			});
		} finally {
			setPasswordBusy(false);
		}
	};

	const handlePasswordChange = async (event: React.FormEvent) => {
		event.preventDefault();
		setPasswordError("");
		const validation = validateNewPassword(newPassword, confirmPassword);
		if (!validation.valid) {
			setPasswordError(validation.message);
			return;
		}

		setPasswordBusy(true);
		try {
			const result = await confirmPasswordChange({
				password: newPassword,
				nonce: verificationCode,
			});
			if (result.error) {
				setPasswordError(result.error);
				return;
			}
			setPasswordStep("idle");
			setVerificationCode("");
			setNewPassword("");
			setConfirmPassword("");
			toast({
				title: "Password updated",
				description: "Your new password is active.",
			});
		} finally {
			setPasswordBusy(false);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
				<PageHeader className="mb-4" title="Profile & Settings" />

				{/* Avatar + Name */}
				<AscendantWindow title="IDENTITY">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{/* Avatar */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="relative group shrink-0 w-20 h-20 rounded-[2px] overflow-hidden border-2 border-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.2)] hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all bg-black/50"
						>
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="Avatar"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-muted flex items-center justify-center">
									<User className="w-8 h-8 text-muted-foreground" />
								</div>
							)}
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<Camera className="w-5 h-5 text-white" />
							</div>
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleAvatarChange}
							aria-label="Upload avatar"
						/>

						{/* Name */}
						<div className="flex-1 w-full space-y-3">
							<div className="space-y-1">
								<Label
									htmlFor="display-name"
									className="font-heading text-xs uppercase tracking-widest text-primary/80"
								>
									Display Name
								</Label>
								<div className="flex gap-2">
									<Input
										id="display-name"
										value={nameInput}
										onChange={(e) => setNameInput(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
										placeholder="Your display name"
									/>
									<Button
										onClick={handleSaveName}
										disabled={savingName || nameInput.trim() === displayName}
										size="sm"
										className="rounded-[2px]"
									>
										{savingName ? (
											<RefreshCw className="w-4 h-4 animate-spin" />
										) : (
											<Save className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="text-xs font-mono text-muted-foreground space-y-0.5 uppercase tracking-wider">
								<p>{user?.email}</p>
								<p>Role: {user?.role ?? "player"}</p>
							</div>
						</div>
					</div>
				</AscendantWindow>

				{/* Appearance */}
				<AscendantWindow title="APPEARANCE">
					<div className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Type className="w-4 h-4 text-primary/80" />
								<Label className="font-heading text-xs uppercase tracking-widest text-primary/80">
									UI Font Size
								</Label>
							</div>
							<div className="flex gap-2">
								{FONT_SIZES.map((size) => (
									<button
										key={size.value}
										type="button"
										onClick={() => handleFontSizeChange(size.value)}
										className={cn(
											"flex-1 rounded-[2px] border px-3 py-2 text-xs font-heading uppercase tracking-widest transition-all",
											selectedFontSize === size.value
												? "border-primary bg-primary/20 text-primary shadow-[inset_0_0_8px_hsl(var(--primary)/0.3)]"
												: "border-primary/20 bg-black/40 text-muted-foreground hover:border-primary/50 hover:bg-black/60",
										)}
									>
										{size.label}
									</button>
								))}
							</div>
							<AscendantText className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Adjusts the base UI font size. Saved across sessions.
							</AscendantText>
						</div>
					</div>
				</AscendantWindow>

				{/* Notifications */}
				{pushSupported && (
					<AscendantWindow title="NOTIFICATIONS">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Bell className="w-4 h-4 text-primary/80" />
								<Label className="font-heading text-xs uppercase tracking-widest text-primary/80">
									Browser Notifications
								</Label>
							</div>
							{pushPermission === "granted" ? (
								<div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-success">
									<BellRing className="w-4 h-4" />
									Enabled — you'll receive browser alerts.
								</div>
							) : pushPermission === "denied" ? (
								<div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
									<BellOff className="w-4 h-4" />
									Blocked. Re-enable in your browser's site settings.
								</div>
							) : (
								<Button
									onClick={handleEnablePush}
									disabled={requestingPush}
									variant="outline"
									size="sm"
									className="gap-2 font-heading tracking-widest uppercase"
								>
									{requestingPush ? (
										<RefreshCw className="w-4 h-4 animate-spin" />
									) : (
										<Bell className="w-4 h-4" />
									)}
									Enable Browser Notifications
								</Button>
							)}
							<AscendantText className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
								Alerts for level-ups, campaign invites, mentions, and sync
								issues. In-app notifications always appear in the bell.
							</AscendantText>
						</div>
					</AscendantWindow>
				)}

				{/* Embedded AI provider */}
				<AIProviderSettings />

				{/* Account Actions */}
				<AscendantWindow title="ACCOUNT">
					<div className="space-y-5">
						{user && session ? (
							<div className="space-y-3 border-b border-primary/20 pb-5">
								<div className="flex items-center gap-2">
									<KeyRound className="w-4 h-4 text-primary/80" />
									<Label className="font-heading text-xs uppercase tracking-widest text-primary/80">
										Password
									</Label>
								</div>
								{passwordStep === "idle" ? (
									<div className="space-y-2">
										<AscendantText className="block text-xs text-muted-foreground">
											We will email a one-time verification code before changing
											your password.
										</AscendantText>
										<Button
											type="button"
											variant="outline"
											onClick={handleBeginPasswordChange}
											disabled={passwordBusy}
											className="gap-2 font-heading tracking-widest uppercase"
										>
											{passwordBusy ? (
												<RefreshCw className="w-4 h-4 animate-spin" />
											) : (
												<KeyRound className="w-4 h-4" />
											)}
											Change Password
										</Button>
									</div>
								) : (
									<form onSubmit={handlePasswordChange} className="space-y-3">
										<div className="space-y-1">
											<Label htmlFor="password-verification-code">
												Email verification code
											</Label>
											<Input
												id="password-verification-code"
												value={verificationCode}
												onChange={(event) =>
													setVerificationCode(event.target.value)
												}
												autoComplete="one-time-code"
												inputMode="numeric"
												required
											/>
										</div>
										<div className="grid gap-3 sm:grid-cols-2">
											<div className="space-y-1">
												<Label htmlFor="profile-new-password">
													New password
												</Label>
												<Input
													id="profile-new-password"
													type="password"
													value={newPassword}
													onChange={(event) =>
														setNewPassword(event.target.value)
													}
													autoComplete="new-password"
													minLength={8}
													required
												/>
											</div>
											<div className="space-y-1">
												<Label htmlFor="profile-confirm-password">
													Confirm password
												</Label>
												<Input
													id="profile-confirm-password"
													type="password"
													value={confirmPassword}
													onChange={(event) =>
														setConfirmPassword(event.target.value)
													}
													autoComplete="new-password"
													minLength={8}
													required
												/>
											</div>
										</div>
										<div className="flex flex-wrap gap-2">
											<Button
												type="submit"
												disabled={passwordBusy}
												className="gap-2 font-heading tracking-widest uppercase"
											>
												{passwordBusy ? (
													<RefreshCw className="w-4 h-4 animate-spin" />
												) : (
													<ShieldCheck className="w-4 h-4" />
												)}
												Update Password
											</Button>
											<Button
												type="button"
												variant="outline"
												disabled={passwordBusy}
												onClick={handleBeginPasswordChange}
											>
												Resend Code
											</Button>
											<Button
												type="button"
												variant="ghost"
												disabled={passwordBusy}
												onClick={() => {
													setPasswordStep("idle");
													setPasswordError("");
													setVerificationCode("");
													setNewPassword("");
													setConfirmPassword("");
												}}
											>
												Cancel
											</Button>
										</div>
									</form>
								)}
								{passwordError && (
									<div
										role="alert"
										className="rounded-[2px] border border-destructive/50 bg-destructive/20 px-3 py-2 text-sm text-destructive-foreground"
									>
										{passwordError}
									</div>
								)}
							</div>
						) : (
							<div className="space-y-2 border-b border-primary/20 pb-5">
								<AscendantText className="block text-sm text-muted-foreground">
									Sign in to manage your password and account.
								</AscendantText>
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/login")}
								>
									Sign In
								</Button>
							</div>
						)}

						{user && session && (
							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									onClick={handleRoleToggle}
									variant="outline"
									className="font-heading tracking-widest uppercase"
								>
									Switch to {user.role === "warden" ? "Ascendant" : "Warden"}{" "}
									Mode
								</Button>
								<Button
									variant="destructive"
									onClick={handleSignOut}
									className="gap-2 font-heading tracking-widest uppercase"
								>
									<LogOut className="w-4 h-4" />
									Sign Out
								</Button>
							</div>
						)}
					</div>
				</AscendantWindow>
			</div>
		</Layout>
	);
}
