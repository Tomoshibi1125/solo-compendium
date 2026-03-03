import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Link,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCampaignInviteByToken,
	useRedeemCampaignInvite,
} from "@/hooks/useCampaignInvites";
import { useCampaignByShareCode, useJoinCampaign } from "@/hooks/useCampaigns";
import { useCharacters } from "@/hooks/useCharacters";
import { useAuth } from "@/lib/auth/authContext";
import {
	campaignInviteStatusLabel,
	campaignInviteStatusMessage,
	deriveCampaignInviteStatus,
	isCampaignInviteJoinable,
	isLikelyShareCode,
	normalizeInviteAccessKey,
} from "@/lib/campaignInviteUtils";
import { formatMonarchVernacular } from "@/lib/vernacular";

const CampaignJoin = () => {
	const { shareCode: urlAccessKey } = useParams<{ shareCode: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading: authLoading } = useAuth();

	const normalizedPathAccessKey = normalizeInviteAccessKey(urlAccessKey);
	const queryToken = normalizeInviteAccessKey(searchParams.get("token"));
	const initialShareCode =
		normalizedPathAccessKey && isLikelyShareCode(normalizedPathAccessKey)
			? normalizedPathAccessKey.toUpperCase()
			: "";
	const initialInviteToken =
		queryToken ||
		(normalizedPathAccessKey && !isLikelyShareCode(normalizedPathAccessKey)
			? normalizedPathAccessKey
			: "");

	const [shareCode, setShareCode] = useState(initialShareCode);
	const [inviteTokenInput, setInviteTokenInput] = useState(initialInviteToken);
	const [inviteToken, setInviteToken] = useState(initialInviteToken);
	const [selectedCharacter, setSelectedCharacter] = useState<string>("none");

	const isInviteFlow = inviteToken.length > 0;
	const resumePath = `${location.pathname}${location.search}`;

	const {
		data: campaign,
		isLoading: loadingCampaign,
		error: campaignError,
	} = useCampaignByShareCode(isInviteFlow ? "" : shareCode);
	const {
		data: invite,
		isLoading: loadingInvite,
		error: inviteError,
	} = useCampaignInviteByToken(inviteToken);
	const { data: characters = [] } = useCharacters();
	const joinCampaign = useJoinCampaign();
	const redeemInvite = useRedeemCampaignInvite();

	const inviteStatus = useMemo(
		() => (invite ? deriveCampaignInviteStatus(invite) : null),
		[invite],
	);
	const canRedeemInvite = inviteStatus
		? isCampaignInviteJoinable(inviteStatus)
		: false;
	const isJoining = joinCampaign.isPending || redeemInvite.isPending;

	const handleJoin = async () => {
		try {
			if (isInviteFlow) {
				if (!invite) return;
				if (authLoading) return;
				if (!user) {
					navigate(`/login?next=${encodeURIComponent(resumePath)}`);
					return;
				}
				if (!canRedeemInvite) {
					return;
				}
				const campaignId = await redeemInvite.mutateAsync({
					token: inviteToken,
					characterId:
						selectedCharacter !== "none" ? selectedCharacter : undefined,
				});
				navigate(`/campaigns/${campaignId}`);
				return;
			}
			if (!campaign) return;
			await joinCampaign.mutateAsync({
				campaignId: campaign.id,
				characterId:
					selectedCharacter !== "none" ? selectedCharacter : undefined,
			});
			navigate(`/campaigns/${campaign.id}`);
		} catch {
			// Error handled by mutation
		}
	};

	const handleInviteSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const nextToken = normalizeInviteAccessKey(inviteTokenInput);
		if (nextToken) {
			navigate(`/campaigns/join/${encodeURIComponent(nextToken)}`, {
				replace: true,
			});
			setInviteToken(nextToken);
		}
	};

	const clearInviteToken = () => {
		setInviteToken("");
		setInviteTokenInput("");
		navigate("/campaigns/join", { replace: true });
	};

	const handleShareCodeSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (shareCode.length === 6) {
			const normalizedCode = shareCode.toUpperCase();
			setShareCode(normalizedCode);
			navigate(`/campaigns/join/${encodeURIComponent(normalizedCode)}`, {
				replace: true,
			});
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<Link to="/campaigns">
					<Button variant="ghost" className="mb-6">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Campaigns
					</Button>
				</Link>

				<h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
					JOIN CAMPAIGN
				</h1>
				<p className="text-muted-foreground font-heading mb-8">
					Use a share code or invite token from your Protocol Warden (System) to
					join their campaign.
				</p>

				{isInviteFlow && !authLoading && !user && (
					<SystemWindow
						title="SIGN IN REQUIRED"
						variant="quest"
						className="mb-6"
					>
						<p className="text-sm text-muted-foreground mb-4">
							Secure invite tokens require an authenticated account. Sign in to
							redeem this invite.
						</p>
						<Button
							className="w-full"
							onClick={() =>
								navigate(`/login?next=${encodeURIComponent(resumePath)}`)
							}
						>
							Sign in to Continue
						</Button>
					</SystemWindow>
				)}

				{!isInviteFlow && !campaign && (
					<SystemWindow title="USE INVITE TOKEN" className="mb-6">
						<form onSubmit={handleInviteSubmit} className="space-y-4">
							<div>
								<Label htmlFor="invite-token">Invite Token</Label>
								<Input
									id="invite-token"
									value={inviteTokenInput}
									onChange={(e) => setInviteTokenInput(e.target.value.trim())}
									placeholder="Paste invite token"
									className="mt-1 font-mono text-center"
								/>
								<p className="text-xs text-muted-foreground mt-2">
									Tokens are included in invite links from your Protocol Warden
									(System).
								</p>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={!inviteTokenInput.trim()}
							>
								{loadingInvite ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Verifying invite...
									</>
								) : (
									<>
										<UserPlus className="w-4 h-4 mr-2" />
										Use Invite
									</>
								)}
							</Button>
						</form>
					</SystemWindow>
				)}

				{/* Share Code Input */}
				{!campaign && !isInviteFlow && (
					<SystemWindow title="ENTER SHARE CODE" className="mb-6">
						<form onSubmit={handleShareCodeSubmit} className="space-y-4">
							<div>
								<Label htmlFor="share-code">Share Code</Label>
								<Input
									id="share-code"
									value={shareCode}
									onChange={(e) =>
										setShareCode(e.target.value.toUpperCase().slice(0, 6))
									}
									placeholder="ABC123"
									className="mt-1 font-mono text-center text-2xl tracking-widest"
									maxLength={6}
								/>
								<p className="text-xs text-muted-foreground mt-2">
									Enter the 6-character code your Protocol Warden (System)
									provided
								</p>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={shareCode.length !== 6}
							>
								{loadingCampaign ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Looking up campaign...
									</>
								) : (
									<>
										<UserPlus className="w-4 h-4 mr-2" />
										Find Campaign
									</>
								)}
							</Button>
						</form>
					</SystemWindow>
				)}

				{/* Campaign Found */}
				{campaign && (
					<SystemWindow title="CAMPAIGN FOUND" variant="quest" className="mb-6">
						<div className="space-y-4">
							<div>
								<h3 className="font-heading text-xl font-semibold mb-2">
									{campaign.name}
								</h3>
								{campaign.description && (
									<p className="text-sm text-muted-foreground">
										{campaign.description}
									</p>
								)}
							</div>
							<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
								<span className="text-xs font-display text-muted-foreground">
									SHARE CODE
								</span>
								<span className="font-mono font-bold text-lg text-primary">
									{campaign.share_code}
								</span>
							</div>
						</div>
					</SystemWindow>
				)}

				{isInviteFlow && invite && (
					<SystemWindow title="INVITE FOUND" variant="quest" className="mb-6">
						<div className="space-y-4">
							<div>
								<h3 className="font-heading text-xl font-semibold mb-2">
									{invite.campaign_name}
								</h3>
								{invite.campaign_description && (
									<p className="text-sm text-muted-foreground">
										{invite.campaign_description}
									</p>
								)}
							</div>
							<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
								<span className="text-xs font-display text-muted-foreground">
									ROLE
								</span>
								<span className="font-heading text-primary">
									{invite.role === "co-system" ? "Co-System" : "Ascendant"}
								</span>
							</div>
							<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
								<span className="text-xs font-display text-muted-foreground">
									STATUS
								</span>
								<Badge
									variant={
										inviteStatus && inviteStatus !== "active"
											? "destructive"
											: "secondary"
									}
								>
									{campaignInviteStatusLabel(inviteStatus || "unknown")}
								</Badge>
							</div>
							{invite.join_code && (
								<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
									<span className="text-xs font-display text-muted-foreground">
										JOIN CODE
									</span>
									<span className="font-mono text-sm text-primary">
										{invite.join_code}
									</span>
								</div>
							)}
							{inviteStatus && (
								<p className="text-sm text-muted-foreground">
									{campaignInviteStatusMessage(inviteStatus)}
								</p>
							)}
							<Button
								variant="ghost"
								onClick={clearInviteToken}
								className="w-full"
							>
								Use Share Code Instead
							</Button>
						</div>
					</SystemWindow>
				)}

				{/* Character Selection */}
				{(campaign || invite) && characters.length > 0 && (
					<SystemWindow title="SELECT ASCENDANT (OPTIONAL)" className="mb-6">
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Optionally link one of your Ascendants to this campaign. You can
								change this later.
							</p>
							<Select
								value={selectedCharacter}
								onValueChange={setSelectedCharacter}
							>
								<SelectTrigger>
									<SelectValue placeholder="No Ascendant linked" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No Ascendant linked</SelectItem>
									{characters.map((char) => (
										<SelectItem key={char.id} value={char.id}>
											{char.name} - Level {char.level}{" "}
											{formatMonarchVernacular(char.job || "Unknown")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</SystemWindow>
				)}

				{(campaign || invite) && user && characters.length === 0 && (
					<SystemWindow title="NO ASCENDANTS FOUND" className="mb-6">
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">
								You can join now without a linked Ascendant, or create one first
								and return automatically.
							</p>
							<Button variant="outline" className="w-full" asChild>
								<Link
									to={`/characters/new?next=${encodeURIComponent(resumePath)}`}
								>
									Create Ascendant First
								</Link>
							</Button>
						</div>
					</SystemWindow>
				)}

				{/* Join Button */}
				{(campaign || invite) && (
					<Button
						onClick={handleJoin}
						className="w-full"
						size="lg"
						disabled={
							isJoining ||
							authLoading ||
							(isInviteFlow ? !invite || !canRedeemInvite : !campaign)
						}
					>
						{isJoining ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Joining...
							</>
						) : authLoading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Checking account...
							</>
						) : isInviteFlow && !user ? (
							<>
								<UserPlus className="w-4 h-4 mr-2" />
								Sign in to Join
							</>
						) : isInviteFlow && inviteStatus === "used_up" ? (
							<>
								<UserPlus className="w-4 h-4 mr-2" />
								Attach Character
							</>
						) : (
							<>
								<UserPlus className="w-4 h-4 mr-2" />
								Join Campaign
							</>
						)}
					</Button>
				)}

				{/* Error State */}
				{campaignError && !isInviteFlow && (
					<SystemWindow title="ERROR" variant="alert" className="mt-6">
						<p className="text-destructive">
							Campaign not found. Please check the share code and try again.
						</p>
					</SystemWindow>
				)}

				{(inviteError || (isInviteFlow && !invite && !loadingInvite)) && (
					<SystemWindow title="INVITE ERROR" variant="alert" className="mt-6">
						<p className="text-destructive">
							Invite token invalid or expired. Please check the invite and try
							again.
						</p>
						<Button variant="ghost" onClick={clearInviteToken} className="mt-3">
							Use Share Code Instead
						</Button>
					</SystemWindow>
				)}
			</div>
		</Layout>
	);
};

export default CampaignJoin;
