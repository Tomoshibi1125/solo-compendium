import {
	Crown,
	Loader2,
	LogIn,
	LogOut,
	Plus,
	Shield,
	Sparkles,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useCharacters } from "@/hooks/useCharacters";
import {
	useCreateGuild,
	useJoinedGuilds,
	useLeaveGuild,
	useMyGuilds,
} from "@/hooks/useGuilds";
import { useRequestToJoinGuild } from "@/hooks/useJoinRequests";

const Guilds = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { toast } = useToast();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [joinDialogOpen, setJoinDialogOpen] = useState(false);
	const [joinShareCode, setJoinShareCode] = useState("");
	const [joinCharacterId, setJoinCharacterId] = useState("none");
	const [joinMessage, setJoinMessage] = useState("");
	const [guildName, setGuildName] = useState("");
	const [guildDescription, setGuildDescription] = useState("");
	const [guildMotto, setGuildMotto] = useState("");
	const [guildCampaignId, setGuildCampaignId] = useState("none");
	// Founding character bound to the leader row (one guild per character).
	const [guildCharacterId, setGuildCharacterId] = useState("none");

	const { data: myGuilds = [], isLoading: loadingMy } = useMyGuilds();
	const { data: joinedGuilds = [], isLoading: loadingJoined } =
		useJoinedGuilds();
	const { data: myCampaigns = [] } = useMyCampaigns();
	const { data: joinedCampaigns = [] } = useJoinedCampaigns();
	const { data: myCharacters = [] } = useCharacters();

	// Default the founding-character selection to the first character when the
	// dialog opens, so the per-character binding is the friendly default.
	useEffect(() => {
		if (
			createDialogOpen &&
			guildCharacterId === "none" &&
			myCharacters.length > 0
		) {
			setGuildCharacterId(myCharacters[0].id);
		}
	}, [createDialogOpen, guildCharacterId, myCharacters]);
	const createGuild = useCreateGuild();
	const leaveGuild = useLeaveGuild();
	const requestToJoin = useRequestToJoinGuild();
	const { enhance, isEnhancing } = useAIEnhance();

	// The /guilds/join route opens the join-by-code dialog directly.
	useEffect(() => {
		if (location.pathname === "/guilds/join") setJoinDialogOpen(true);
	}, [location.pathname]);

	// Default the joining-character selection to the first character.
	useEffect(() => {
		if (
			joinDialogOpen &&
			joinCharacterId === "none" &&
			myCharacters.length > 0
		) {
			setJoinCharacterId(myCharacters[0].id);
		}
	}, [joinDialogOpen, joinCharacterId, myCharacters]);

	// Campaigns the user can optionally link a new guild to (hybrid scoping).
	const campaignOptions = useMemo(() => {
		const seen = new Set<string>();
		return [...myCampaigns, ...joinedCampaigns].filter((c) => {
			if (seen.has(c.id)) return false;
			seen.add(c.id);
			return true;
		});
	}, [myCampaigns, joinedCampaigns]);
	const campaignNameById = useMemo(
		() => new Map(campaignOptions.map((c) => [c.id, c.name])),
		[campaignOptions],
	);

	const handleGenerateDescription = async () => {
		const seed = `Guild name: ${guildName || "(unnamed)"}${
			guildMotto ? `. Motto: ${guildMotto}` : ""
		}`;
		const text = await enhance(
			"guild description",
			seed,
			"Write a vivid 2-3 sentence guild description for a dark fantasy TTRPG guild. Return only the prose, no preamble or quotes.",
		);
		if (text) setGuildDescription(text.trim());
	};

	const handleCreateGuild = async () => {
		if (!guildName.trim()) {
			toast({
				title: "Name required",
				description: "Please enter a guild name.",
				variant: "destructive",
			});
			return;
		}

		try {
			const guildId = await createGuild.mutateAsync({
				name: guildName,
				description: guildDescription || undefined,
				motto: guildMotto || undefined,
				campaignId: guildCampaignId !== "none" ? guildCampaignId : undefined,
				characterId: guildCharacterId !== "none" ? guildCharacterId : undefined,
			});
			setCreateDialogOpen(false);
			setGuildName("");
			setGuildDescription("");
			setGuildMotto("");
			setGuildCampaignId("none");
			setGuildCharacterId("none");
			navigate(`/guilds/${guildId}`);
		} catch {
			// Error handled by mutation
		}
	};

	const handleRequestJoin = async () => {
		if (!joinShareCode.trim()) {
			toast({
				title: "Share code required",
				description: "Enter the guild's share code to request to join.",
				variant: "destructive",
			});
			return;
		}
		try {
			await requestToJoin.mutateAsync({
				shareCode: joinShareCode,
				characterId: joinCharacterId !== "none" ? joinCharacterId : undefined,
				message: joinMessage || undefined,
			});
			setJoinDialogOpen(false);
			setJoinShareCode("");
			setJoinCharacterId("none");
			setJoinMessage("");
			if (location.pathname === "/guilds/join") navigate("/guilds");
		} catch {
			// Error handled by mutation
		}
	};

	const handleLeaveGuild = async (guildId: string) => {
		try {
			await leaveGuild.mutateAsync(guildId);
		} catch {
			// Error handled by mutation
		}
	};

	const allGuilds = [...myGuilds, ...joinedGuilds];
	const isLoading = loadingMy || loadingJoined;

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<PageHeader
					className="mb-8"
					title="GUILD HALL"
					description={
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-muted-foreground mt-2"
						>
							Establish or join a guild. Recruit NPCs, manage your roster, and
							forge alliances across campaigns.
						</ManaFlowText>
					}
					actions={
						<>
							<Button
								variant="outline"
								className="gap-2"
								onClick={() => setJoinDialogOpen(true)}
							>
								<LogIn className="w-4 h-4" />
								Join Guild
							</Button>
							<Button
								className="btn-umbral gap-2"
								onClick={() => setCreateDialogOpen(true)}
							>
								<Plus className="w-4 h-4" />
								Establish Guild
							</Button>
						</>
					}
				/>

				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="relative">
							<div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
							<div className="absolute inset-0 w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
						</div>
						<ManaFlowText
							variant="rift"
							speed="fast"
							className="text-muted-foreground font-heading animate-pulse"
						>
							Loading Guild Registry...
						</ManaFlowText>
					</div>
				) : allGuilds.length === 0 ? (
					<AscendantWindow title="NO GUILDS FOUND">
						<div className="text-center py-12 space-y-4">
							<Shield className="w-16 h-16 text-primary mx-auto opacity-50" />
							<RiftHeading level={2} variant="gate" dimensional>
								Begin Your Legacy
							</RiftHeading>
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="max-w-lg mx-auto"
							>
								Establish your own guild to recruit NPCs, manage members, and
								build reputation across campaigns. Every great organization
								starts with a single founder.
							</ManaFlowText>
							<Button
								className="btn-umbral"
								onClick={() => setCreateDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								Establish Your First Guild
							</Button>
						</div>
					</AscendantWindow>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{allGuilds.map((guild) => {
							const isLeader = myGuilds.some((g) => g.id === guild.id);
							return (
								<AscendantWindow
									key={guild.id}
									title={guild.name.toUpperCase()}
									className="flex flex-col"
								>
									<div className="flex-1 space-y-3">
										<div className="flex items-center gap-2">
											{isLeader ? (
												<Crown className="w-4 h-4 text-primary" />
											) : (
												<Users className="w-4 h-4 text-accent" />
											)}
											<AscendantText className="text-xs font-display text-muted-foreground">
												{isLeader ? "GUILD LEADER" : "MEMBER"}
											</AscendantText>
										</div>
										{guild.campaign_id && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Shield className="w-3 h-3 text-primary/70" />
												<span>
													Campaign:{" "}
													<span className="text-foreground">
														{campaignNameById.get(guild.campaign_id) ??
															"Linked campaign"}
													</span>
												</span>
											</div>
										)}
										{guild.motto && (
											<p className="text-sm italic text-muted-foreground">
												"{guild.motto}"
											</p>
										)}
										{guild.description && (
											<AscendantText className="block text-sm text-muted-foreground line-clamp-2">
												{guild.description}
											</AscendantText>
										)}
										{isLeader && (
											<div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
												<span className="text-muted-foreground">
													Share Code:
												</span>
												<span className="font-mono font-bold text-primary">
													{guild.share_code}
												</span>
											</div>
										)}
									</div>
									<div className="flex gap-2 mt-4 pt-4 border-t border-border">
										<Button className="flex-1" variant="outline" asChild>
											<Link to={`/guilds/${guild.id}`}>View Guild</Link>
										</Button>
										{!isLeader && (
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive"
												onClick={() => handleLeaveGuild(guild.id)}
											>
												<LogOut className="w-4 h-4" />
											</Button>
										)}
									</div>
								</AscendantWindow>
							);
						})}
					</div>
				)}
			</div>

			{/* Create Guild Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-primary" />
							ESTABLISH GUILD
						</DialogTitle>
						<DialogDescription>
							Found a new guild. Recruit NPCs from your campaigns, invite other
							players, and build your organization.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="guild-name">Guild Name *</Label>
							<Input
								id="guild-name"
								value={guildName}
								onChange={(e) => setGuildName(e.target.value)}
								placeholder="e.g. The Iron Vanguard"
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="guild-motto">Motto</Label>
							<Input
								id="guild-motto"
								value={guildMotto}
								onChange={(e) => setGuildMotto(e.target.value)}
								placeholder="e.g. Through fire, we forge"
								className="mt-1"
							/>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<Label htmlFor="guild-description">Description</Label>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-7 gap-1.5 text-xs"
									onClick={handleGenerateDescription}
									disabled={isEnhancing}
								>
									{isEnhancing ? (
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
									) : (
										<Sparkles className="w-3.5 h-3.5" />
									)}
									Generate
								</Button>
							</div>
							<Textarea
								id="guild-description"
								value={guildDescription}
								onChange={(e) => setGuildDescription(e.target.value)}
								placeholder="Describe your guild's purpose and values..."
								className="mt-1"
								rows={3}
							/>
						</div>
						<div>
							<Label htmlFor="guild-campaign">Campaign (optional)</Label>
							<Select
								value={guildCampaignId}
								onValueChange={setGuildCampaignId}
							>
								<SelectTrigger id="guild-campaign" className="mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">
										No campaign (personal / cross-campaign)
									</SelectItem>
									{campaignOptions.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="mt-1 text-xs text-muted-foreground">
								Tie this guild to one of your campaigns, or leave it personal.
							</p>
						</div>
						<div>
							<Label htmlFor="guild-character">Founding Ascendant</Label>
							<Select
								value={guildCharacterId}
								onValueChange={setGuildCharacterId}
							>
								<SelectTrigger id="guild-character" className="mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">
										No character (unlinked leader)
									</SelectItem>
									{myCharacters.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="mt-1 text-xs text-muted-foreground">
								Each character may lead or join only one guild.
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="btn-umbral"
							onClick={handleCreateGuild}
							disabled={createGuild.isPending || !guildName.trim()}
						>
							{createGuild.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Establishing...
								</>
							) : (
								<>
									<Shield className="w-4 h-4 mr-2" />
									Establish Guild
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Join Guild Dialog */}
			<Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<LogIn className="w-5 h-5 text-primary" />
							JOIN A GUILD
						</DialogTitle>
						<DialogDescription>
							Enter a guild's share code and choose which Ascendant joins. The
							guild's leaders will review your request.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="join-code">Share Code *</Label>
							<Input
								id="join-code"
								value={joinShareCode}
								onChange={(e) => setJoinShareCode(e.target.value.toUpperCase())}
								placeholder="e.g. AB12CD"
								className="mt-1 font-mono tracking-widest"
								maxLength={6}
							/>
						</div>
						<div>
							<Label htmlFor="join-character">Joining Ascendant</Label>
							<Select
								value={joinCharacterId}
								onValueChange={setJoinCharacterId}
							>
								<SelectTrigger id="join-character" className="mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">
										No character (decide later)
									</SelectItem>
									{myCharacters.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="mt-1 text-xs text-muted-foreground">
								Each character may belong to only one guild.
							</p>
						</div>
						<div>
							<Label htmlFor="join-message">Message (optional)</Label>
							<Textarea
								id="join-message"
								value={joinMessage}
								onChange={(e) => setJoinMessage(e.target.value)}
								placeholder="Introduce yourself to the guild leaders..."
								className="mt-1"
								rows={2}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setJoinDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							className="btn-umbral"
							onClick={handleRequestJoin}
							disabled={requestToJoin.isPending || !joinShareCode.trim()}
						>
							{requestToJoin.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<LogIn className="w-4 h-4 mr-2" />
									Request to Join
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default Guilds;
