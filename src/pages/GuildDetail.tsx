import {
	Activity,
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	Check,
	Coins,
	Copy,
	Crown,
	Gift,
	Hammer,
	Loader2,
	MoreVertical,
	ScrollText,
	Settings,
	Shield,
	Sparkles,
	Sword,
	Trash2,
	UserMinus,
	UserPlus,
	Users,
	Warehouse,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ActivityFeedPanel } from "@/components/shared/ActivityFeedPanel";
import { ExportMenu } from "@/components/shared/ExportMenu";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { craftingRecipes } from "@/data/compendium/crafting";
import { GUILD_BASE_MATERIALS } from "@/data/compendium/guild-base-materials";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { GUILD_BASES } from "@/data/compendium/guild-bases";
import { GUILD_SKILLS } from "@/data/compendium/guild-skills";
import {
	PREBUILT_QUEST_CONTRACTS,
	type QuestContract,
} from "@/data/compendium/quest-contracts";
import { getRecruitablePool } from "@/data/compendium/recruitable-roster";
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";
import { useToast } from "@/hooks/use-toast";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useAddGuildAllyCompanion } from "@/hooks/useCharacterExtras";
import { useCharacters } from "@/hooks/useCharacters";
import {
	useGrantGuildBase,
	useGuildBaseState,
	usePurchaseFacility,
	usePurchaseGuildBase,
	usePurchaseGuildSkill,
} from "@/hooks/useGuildBase";
import {
	type GuildQuest,
	useAcceptGuildQuest,
	useAssignQuestSquad,
	useGuildQuests,
	useResolveGuildQuest,
} from "@/hooks/useGuildQuests";
import {
	type GuildMember,
	useAdjustGuildFunds,
	useChangeMemberRole,
	useDeleteGuild,
	useGuild,
	useGuildMembers,
	useGuildPermissions,
	useKickMember,
	useLevelUpNPC,
	useRecruitNPC,
	useSetNPCLevelingMode,
	useTransferLeadership,
} from "@/hooks/useGuilds";
import {
	useApproveJoinRequest,
	useGuildJoinRequests,
	useRejectJoinRequest,
} from "@/hooks/useJoinRequests";
import { useAuth } from "@/lib/auth/authContext";
import { buildGuildMarkdown, buildGuildRosterCsv } from "@/lib/communityExport";
import {
	getRaCurrencyDefinition,
	RA_CURRENCY_TYPES,
	type RaCurrencyId,
} from "@/lib/currency";
import { getLocalUserId } from "@/lib/guestStore";
import {
	describeAggregatedGuildEffects,
	facilityLevel,
	nextFacilityTier,
	summarizeGuildBenefits,
} from "@/lib/guildBase";
import {
	assignableRoles,
	canActOnMember,
	type GuildRole,
	guildRoleLabel,
	guildRoleWeight,
} from "@/lib/guildPermissions";
import {
	contributionProgress,
	getFundsBalance,
	guildLevelForContribution,
	memberCapForContribution,
} from "@/lib/guildTreasury";
import { rankToGateBadge } from "@/lib/rankColors";
import { cn } from "@/lib/utils";

const GuildDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState("roster");
	const [recruitDialogOpen, setRecruitDialogOpen] = useState(false);
	const [selectedNPC, setSelectedNPC] = useState<SandboxNPC | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [recruitSearch, setRecruitSearch] = useState("");
	const [recruitFactionFilter, setRecruitFactionFilter] = useState("all");
	const [recruitKindFilter, setRecruitKindFilter] = useState<
		"all" | "ascendant" | "mundane"
	>("all");
	const [treasuryCurrency, setTreasuryCurrency] =
		useState<RaCurrencyId>("gate");
	const [treasuryAmount, setTreasuryAmount] = useState("");
	const [questRankFilter, setQuestRankFilter] = useState<string>("all");
	const [allyForMember, setAllyForMember] = useState<GuildMember | null>(null);

	const { data: guild, isLoading } = useGuild(id || "");
	const { data: members = [] } = useGuildMembers(id || "");
	const recruitNPC = useRecruitNPC();
	const addAlly = useAddGuildAllyCompanion();
	const { data: myCharacters = [] } = useCharacters();
	const levelUpNPC = useLevelUpNPC();
	const setLevelingMode = useSetNPCLevelingMode();
	const deleteGuild = useDeleteGuild();
	const changeMemberRole = useChangeMemberRole();
	const kickMember = useKickMember();
	const transferLeadership = useTransferLeadership();
	const activity = useActivityFeed({
		toolKey: `guild-activity:${id ?? "none"}`,
		enabled: !!id,
	});
	const { data: myCampaigns = [] } = useMyCampaigns();
	const { data: joinedCampaigns = [] } = useJoinedCampaigns();
	const linkedCampaignName = useMemo(() => {
		if (!guild?.campaign_id) return null;
		const match = [...myCampaigns, ...joinedCampaigns].find(
			(c) => c.id === guild.campaign_id,
		);
		return match?.name ?? "Linked campaign";
	}, [guild?.campaign_id, myCampaigns, joinedCampaigns]);

	const currentUserId = user?.id || getLocalUserId();
	const isLeader = guild?.leader_user_id === currentUserId;
	const perms = useGuildPermissions(guild, members);
	const caps = perms.capabilities;

	const handleChangeRole = (memberId: string, role: GuildRole) => {
		if (!id) return;
		changeMemberRole.mutate({ guildId: id, memberId, role });
	};
	const handleKick = (memberId: string) => {
		if (!id) return;
		kickMember.mutate({ guildId: id, memberId });
	};
	const handleTransferLeadership = (newLeaderUserId: string) => {
		if (!id) return;
		transferLeadership.mutate({
			guildId: id,
			newLeaderUserId,
			currentLeaderUserId: perms.currentUserId,
		});
	};

	// Join-request approval queue (only fetched for staff who can approve).
	const { data: joinRequests = [] } = useGuildJoinRequests(
		caps.canApproveJoins ? id : undefined,
	);
	const approveJoin = useApproveJoinRequest();
	const rejectJoin = useRejectJoinRequest();
	const handleApproveJoin = (requestId: string) => {
		if (!id) return;
		approveJoin.mutate({ requestId, guildId: id });
	};
	const handleRejectJoin = (requestId: string) => {
		if (!id) return;
		rejectJoin.mutate({ requestId, guildId: id });
	};

	// Quests (2D/2G): the Warden/Bureau issues gate contracts; the guild accepts +
	// resolves. The board is VIEW-ONLY for every member; only officers+ (canManageQuests)
	// accept / assign / resolve.
	const { data: guildQuests = [] } = useGuildQuests(id);
	const acceptQuest = useAcceptGuildQuest();
	const assignSquad = useAssignQuestSquad();
	const resolveQuest = useResolveGuildQuest();
	const activeQuests = guildQuests.filter((q) => q.status === "active");
	const acceptedSourceIds = new Set(
		guildQuests.map((q) => q.source_quest_id).filter(Boolean),
	);
	const handleAcceptQuest = (sq: QuestContract) => {
		if (!id) return;
		acceptQuest.mutate({
			guildId: id,
			sourceQuestId: sq.id,
			title: sq.title,
			rank: sq.rank,
		});
	};
	const filteredContracts =
		questRankFilter === "all"
			? PREBUILT_QUEST_CONTRACTS
			: PREBUILT_QUEST_CONTRACTS.filter((q) => q.rank === questRankFilter);
	const handleToggleSquad = (quest: GuildQuest, memberId: string) => {
		if (!id) return;
		const ids = quest.assigned_member_ids.includes(memberId)
			? quest.assigned_member_ids.filter((x) => x !== memberId)
			: [...quest.assigned_member_ids, memberId];
		assignSquad.mutate({ guildId: id, questId: quest.id, memberIds: ids });
	};
	const handleResolveQuest = (questId: string, success: boolean) => {
		if (!id) return;
		resolveQuest.mutate({ guildId: id, questId, success });
	};

	// Treasury & progression (2E). Level/cap are derived from contribution.
	const adjustFunds = useAdjustGuildFunds();
	const guildContribution = guild?.contribution ?? 0;
	const guildLevel = guildLevelForContribution(guildContribution);
	const levelProgress = contributionProgress(guildContribution);

	// Guild Base (2F): facilities + skills + buffs. Leader-managed (canManageSkills,
	// which the matrix documents as covering "guild skills & base facilities").
	const base = useGuildBaseState(guild);
	const purchaseFacility = usePurchaseFacility();
	const purchaseSkill = usePurchaseGuildSkill();
	const purchaseBase = usePurchaseGuildBase();
	const grantGuildBase = useGrantGuildBase();
	// Real member cap = contribution-derived cap + Barracks/skill capability bonus.
	const guildMemberCap =
		memberCapForContribution(guildContribution) + base.effects.memberCapBonus;
	const forgeUnlocked = facilityLevel(base.facilities, "forge") > 0;
	const baseMutationPending =
		purchaseFacility.isPending ||
		purchaseSkill.isPending ||
		purchaseBase.isPending ||
		grantGuildBase.isPending;
	const handleBuyBase = (baseId: string) => {
		if (!id) return;
		purchaseBase.mutate({ guildId: id, baseId });
	};
	const handleGrantBase = (baseId: string) => {
		if (!id) return;
		grantGuildBase.mutate({ guildId: id, kind: "base", baseId });
	};
	const handleBuyFacility = (facilityId: string) => {
		if (!id) return;
		purchaseFacility.mutate({ guildId: id, facilityId });
	};
	const handleGrantFacility = (facilityId: string, tier: number) => {
		if (!id) return;
		grantGuildBase.mutate({ guildId: id, kind: "facility", facilityId, tier });
	};
	const handleBuySkill = (skillId: string) => {
		if (!id) return;
		purchaseSkill.mutate({ guildId: id, skillId });
	};
	const handleGrantSkill = (skillId: string) => {
		if (!id) return;
		grantGuildBase.mutate({ guildId: id, kind: "skill", skillId });
	};

	// Roster · Recruit · Info · Activity · Quests are always shown (the Quests board
	// is view-only for every member); Treasury / Base / Settings are capability-gated.
	const guildTabCount =
		5 +
		(caps.canManageTreasury ? 1 : 0) +
		(caps.canManageSkills ? 1 : 0) +
		(caps.canDisband ? 1 : 0);
	const guildTabGridClass =
		guildTabCount >= 8
			? "sm:grid-cols-8"
			: guildTabCount === 7
				? "sm:grid-cols-7"
				: guildTabCount === 6
					? "sm:grid-cols-6"
					: guildTabCount === 5
						? "sm:grid-cols-5"
						: "sm:grid-cols-4";
	const handleTreasury = (direction: 1 | -1) => {
		if (!id) return;
		const amount = Number.parseInt(treasuryAmount, 10);
		if (!Number.isFinite(amount) || amount <= 0) {
			toast({
				title: "Enter an amount",
				description: "Enter a whole, positive amount to move.",
				variant: "destructive",
			});
			return;
		}
		adjustFunds.mutate(
			{ guildId: id, currency: treasuryCurrency, delta: direction * amount },
			{ onSuccess: () => setTreasuryAmount("") },
		);
	};

	const recruitedNPCIds = members.filter((m) => m.npc_id).map((m) => m.npc_id);
	const availableNPCs = getRecruitablePool().filter(
		(npc) => !recruitedNPCIds.includes(npc.id),
	);
	const recruitFactions = useMemo(
		() => Array.from(new Set(availableNPCs.map((npc) => npc.faction))).sort(),
		[availableNPCs],
	);
	const filteredRecruits = useMemo(() => {
		const q = recruitSearch.trim().toLowerCase();
		return availableNPCs.filter((npc) => {
			if (
				recruitFactionFilter !== "all" &&
				npc.faction !== recruitFactionFilter
			)
				return false;
			if (
				recruitKindFilter !== "all" &&
				(npc.kind ?? "ascendant") !== recruitKindFilter
			)
				return false;
			if (q && !`${npc.name} ${npc.title} ${npc.job}`.toLowerCase().includes(q))
				return false;
			return true;
		});
	}, [availableNPCs, recruitFactionFilter, recruitKindFilter, recruitSearch]);

	const handleRecruit = async () => {
		if (!selectedNPC || !id) return;
		await recruitNPC.mutateAsync({
			guildId: id,
			npc: selectedNPC,
		});
		activity.log({
			kind: "recruited",
			label: `Recruited ${selectedNPC.name}`,
			category: "guild",
		});
		setRecruitDialogOpen(false);
		setSelectedNPC(null);
	};

	const handleLevelUp = async (memberId: string) => {
		if (!id) return;
		await levelUpNPC.mutateAsync({ guildId: id, memberId });
		const member = members.find((m) => m.id === memberId);
		const name = member?.npc_name ?? member?.characters?.name ?? "recruit";
		activity.log({
			kind: "leveled-up",
			label: `Leveled up ${name} → L${(member?.npc_level ?? 1) + 1}`,
			category: "guild",
		});
	};

	const handleDeleteGuild = async () => {
		if (!id) return;
		await deleteGuild.mutateAsync(id);
		navigate("/guilds");
	};

	const handleAddAlly = (characterId: string) => {
		const member = allyForMember;
		if (!member?.npc_data) return;
		addAlly.mutate(
			{
				characterId,
				npc: member.npc_data,
				level: member.npc_level ?? member.npc_data.level,
				guildId: id,
				memberId: member.id,
			},
			{ onSuccess: () => setAllyForMember(null) },
		);
	};

	const handleCopyShareCode = () => {
		if (!guild) return;
		navigator.clipboard.writeText(guild.share_code);
		toast({
			title: "Share code copied!",
			description: "Share this code to invite members to your guild.",
		});
	};

	if (isLoading || (!guild && id)) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
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
							Loading Guild Archives...
						</ManaFlowText>
					</div>
				</div>
			</Layout>
		);
	}

	if (!guild) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
					<AscendantWindow title="GUILD NOT FOUND" variant="alert">
						<p className="text-destructive mb-4 text-center">
							This guild does not exist or you don't have access.
						</p>
						<div className="flex justify-center">
							<Button asChild>
								<Link to="/guilds">Back to Guilds</Link>
							</Button>
						</div>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	const playerMembers = members.filter((m) => m.user_id);
	const npcMembers = members.filter((m) => m.npc_id);

	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<Button variant="ghost" className="mb-4 sm:mb-6 min-h-[44px]" asChild>
					<Link to="/guilds">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Guilds
					</Link>
				</Button>

				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="leading-tight"
						>
							{guild.name.toUpperCase()}
						</RiftHeading>
						{isLeader && (
							<Badge className="bg-primary/20 text-primary border-primary/30 w-fit">
								<Crown className="w-3 h-3 mr-1" /> Guild Leader
							</Badge>
						)}
					</div>
					{guild.motto && (
						<p className="text-sm italic text-muted-foreground mb-2">
							"{guild.motto}"
						</p>
					)}
					{guild.description && (
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-sm sm:text-base leading-relaxed"
						>
							{guild.description}
						</ManaFlowText>
					)}
					<div className="mt-4 flex justify-end">
						<ExportMenu
							baseName={`guild-${guild.name}`}
							label="Export Roster"
							markdown={() => buildGuildMarkdown(guild, members)}
							json={() => ({ guild, members })}
							csv={() => buildGuildRosterCsv(members)}
						/>
					</div>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList
						className={cn("grid w-full grid-cols-2", guildTabGridClass)}
					>
						<TabsTrigger
							value="roster"
							className="gap-2 text-xs sm:text-sm min-h-[44px]"
						>
							<Users className="w-3 h-3 sm:w-4 sm:h-4" />
							Roster
						</TabsTrigger>
						<TabsTrigger
							value="recruitment"
							className="gap-2 text-xs sm:text-sm min-h-[44px]"
						>
							<UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
							Recruit
						</TabsTrigger>
						<TabsTrigger
							value="info"
							className="gap-2 text-xs sm:text-sm min-h-[44px]"
						>
							<Shield className="w-3 h-3 sm:w-4 sm:h-4" />
							Info
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							className="gap-2 text-xs sm:text-sm min-h-[44px]"
						>
							<Activity className="w-3 h-3 sm:w-4 sm:h-4" />
							Activity
						</TabsTrigger>
						<TabsTrigger
							value="quests"
							className="gap-2 text-xs sm:text-sm min-h-[44px]"
						>
							<ScrollText className="w-3 h-3 sm:w-4 sm:h-4" />
							Quests
							{activeQuests.length > 0 && (
								<Badge
									variant="outline"
									className="ml-1 h-4 px-1 text-[10px] leading-none"
								>
									{activeQuests.length}
								</Badge>
							)}
						</TabsTrigger>
						{caps.canManageTreasury && (
							<TabsTrigger
								value="treasury"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Coins className="w-3 h-3 sm:w-4 sm:h-4" />
								Treasury
							</TabsTrigger>
						)}
						{caps.canManageSkills && (
							<TabsTrigger
								value="base"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Warehouse className="w-3 h-3 sm:w-4 sm:h-4" />
								Base
							</TabsTrigger>
						)}
						{caps.canDisband && (
							<TabsTrigger
								value="settings"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Settings className="w-3 h-3 sm:w-4 sm:h-4" />
								Settings
							</TabsTrigger>
						)}
					</TabsList>

					{/* ROSTER TAB */}
					<TabsContent value="roster" className="space-y-6">
						{/* Join Requests (Guild Master / Vice-Master only) */}
						{caps.canApproveJoins && joinRequests.length > 0 && (
							<AscendantWindow title={`JOIN REQUESTS (${joinRequests.length})`}>
								<div className="space-y-2">
									{joinRequests.map((req) => (
										<div
											key={req.id}
											className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded"
										>
											<div className="min-w-0">
												<p className="font-heading font-semibold truncate">
													{req.character_name || "An Ascendant"}
												</p>
												{req.message && (
													<AscendantText className="block text-xs text-muted-foreground truncate">
														“{req.message}”
													</AscendantText>
												)}
											</div>
											<div className="flex items-center gap-2 shrink-0">
												<Button
													size="sm"
													variant="outline"
													className="gap-1"
													onClick={() => handleApproveJoin(req.id)}
													disabled={approveJoin.isPending}
												>
													<Check className="w-4 h-4" />
													Admit
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="gap-1 text-destructive"
													onClick={() => handleRejectJoin(req.id)}
													disabled={rejectJoin.isPending}
												>
													<X className="w-4 h-4" />
													Decline
												</Button>
											</div>
										</div>
									))}
								</div>
							</AscendantWindow>
						)}

						{/* Ascendant Members */}
						<AscendantWindow title="ASCENDANT MEMBERS">
							{playerMembers.length === 0 ? (
								<AscendantText className="block text-muted-foreground text-center py-8">
									No Ascendant members yet. Share the guild code to invite
									Ascendants.
								</AscendantText>
							) : (
								<div className="space-y-2">
									{playerMembers.map((member) => (
										<div
											key={member.id}
											className="flex items-center justify-between p-3 bg-muted/50 rounded"
										>
											<div className="flex items-center gap-3">
												{member.role === "leader" && (
													<Crown className="w-4 h-4 text-primary" />
												)}
												<div>
													<p className="font-heading font-semibold">
														{member.characters?.name || "Unlinked Member"}
													</p>
													{member.characters && (
														<AscendantText className="block text-xs text-muted-foreground">
															Level {member.characters.level}{" "}
															{member.characters.job || "Unknown"}
														</AscendantText>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												{member.rank && (
													<Badge
														variant="outline"
														className={cn(
															"text-xs",
															rankToGateBadge(member.rank),
														)}
													>
														{member.rank}
													</Badge>
												)}
												<Badge variant="outline" className="text-xs">
													{guildRoleLabel(member.role)}
												</Badge>
												{perms.role &&
													member.role !== "leader" &&
													canActOnMember(perms.role, member.role) &&
													(caps.canChangeRole ||
														caps.canKickMember ||
														caps.canTransferLeadership) && (
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-7 w-7 p-0"
																	aria-label="Member actions"
																>
																	<MoreVertical className="w-4 h-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																{caps.canChangeRole && (
																	<>
																		<DropdownMenuLabel>
																			Change role
																		</DropdownMenuLabel>
																		{perms.role &&
																			assignableRoles(perms.role).map((r) => (
																				<DropdownMenuItem
																					key={r}
																					disabled={r === member.role}
																					onClick={() =>
																						handleChangeRole(member.id, r)
																					}
																				>
																					{guildRoleWeight(r) >
																					guildRoleWeight(member.role) ? (
																						<ArrowUp className="w-4 h-4 mr-2" />
																					) : (
																						<ArrowDown className="w-4 h-4 mr-2" />
																					)}
																					{guildRoleLabel(r)}
																				</DropdownMenuItem>
																			))}
																		<DropdownMenuSeparator />
																	</>
																)}
																{caps.canTransferLeadership &&
																	member.user_id && (
																		<DropdownMenuItem
																			onClick={() =>
																				member.user_id &&
																				handleTransferLeadership(member.user_id)
																			}
																		>
																			<Crown className="w-4 h-4 mr-2" />
																			Make Guild Master
																		</DropdownMenuItem>
																	)}
																{caps.canKickMember && (
																	<DropdownMenuItem
																		className="text-destructive"
																		onClick={() => handleKick(member.id)}
																	>
																		<UserMinus className="w-4 h-4 mr-2" />
																		Remove from guild
																	</DropdownMenuItem>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													)}
											</div>
										</div>
									))}
								</div>
							)}
						</AscendantWindow>

						{/* NPC Recruits */}
						<AscendantWindow title="NPC RECRUITS">
							{npcMembers.length === 0 ? (
								<div className="text-center py-8 space-y-3">
									<Sword className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
									<AscendantText className="block text-muted-foreground">
										No NPCs recruited yet. Visit the Recruitment tab to find
										unaffiliated NPCs.
									</AscendantText>
								</div>
							) : (
								<div className="space-y-3">
									{npcMembers.map((member) => {
										const npc = member.npc_data;
										const currentLevel = member.npc_level || npc?.level || 1;
										const maxLevel = npc?.leveling.maxLevel || 10;
										const canLevelUp = currentLevel < maxLevel;

										return (
											<div
												key={member.id}
												className="rounded-lg border border-border bg-muted/30 p-4"
											>
												<div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<p className="font-heading font-semibold">
																{member.npc_name}
															</p>
															<Badge variant="outline" className="text-xs">
																L{currentLevel}
															</Badge>
															{npc?.faction && (
																<Badge className="text-xs bg-primary/10 text-primary border-primary/20">
																	{npc.faction.replace(/_/g, " ")}
																</Badge>
															)}
														</div>
														{npc && (
															<>
																<p className="text-xs text-muted-foreground">
																	{npc.title} · {npc.job}
																</p>
																<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
																	{npc.personality}
																</p>
																<div className="flex flex-wrap gap-1 mt-2">
																	{npc.keyAbilities
																		.slice(0, 3)
																		.map((ability) => (
																			<Badge
																				key={ability}
																				variant="secondary"
																				className="text-xs"
																			>
																				{ability.split("(")[0].trim()}
																			</Badge>
																		))}
																</div>
															</>
														)}
													</div>
													{caps.canRecruit && (
														<div className="flex flex-col gap-2">
															<div className="flex items-center gap-2">
																<AscendantText className="text-xs text-muted-foreground">
																	Leveling:
																</AscendantText>
																<Select
																	value={member.npc_leveling_mode || "auto"}
																	onValueChange={(value) => {
																		if (id) {
																			setLevelingMode.mutate({
																				guildId: id,
																				memberId: member.id,
																				mode: value as "auto" | "manual",
																			});
																		}
																	}}
																>
																	<SelectTrigger className="w-24 h-7 text-xs">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="auto">Auto</SelectItem>
																		<SelectItem value="manual">
																			Manual
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															{canLevelUp && (
																<Button
																	size="sm"
																	variant="outline"
																	className="gap-1 text-xs h-7"
																	onClick={() => handleLevelUp(member.id)}
																	disabled={levelUpNPC.isPending}
																>
																	<ArrowUp className="w-3 h-3" />
																	Level Up → L{currentLevel + 1}
																</Button>
															)}
															{!canLevelUp && (
																<Badge className="text-xs bg-muted text-muted-foreground border border-border">
																	MAX LEVEL ({maxLevel})
																</Badge>
															)}
														</div>
													)}
												</div>
												{npc && (
													<div className="mt-3 flex justify-end">
														<Button
															size="sm"
															variant="outline"
															className="gap-1 text-xs h-7"
															onClick={() => setAllyForMember(member)}
															data-testid={`add-ally-to-sheet-${member.id}`}
														>
															<UserPlus className="w-3 h-3" />
															Add to Sheet
														</Button>
													</div>
												)}
												{/* Stats bar */}
												<div className="flex gap-4 mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
													<span>
														HP:{" "}
														<strong className="text-foreground">
															{npc
																? npc.hp +
																	(currentLevel - npc.level) *
																		npc.leveling.hpPerLevel
																: "?"}
														</strong>
													</span>
													<span>
														AC:{" "}
														<strong className="text-foreground">
															{npc?.ac ?? "?"}
														</strong>
													</span>
													<span>
														Level:{" "}
														<strong className="text-foreground">
															{currentLevel}/{maxLevel}
														</strong>
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</AscendantWindow>
					</TabsContent>

					{/* RECRUITMENT TAB */}
					<TabsContent value="recruitment" className="space-y-6">
						<AscendantWindow title="AVAILABLE RECRUITS">
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="text-sm mb-4"
							>
								Unaffiliated NPCs from the campaign world who can be recruited
								into your guild.
							</ManaFlowText>
							<div className="flex flex-col sm:flex-row gap-2 mb-4">
								<Input
									value={recruitSearch}
									onChange={(e) => setRecruitSearch(e.target.value)}
									placeholder="Search name, title, or job…"
									className="sm:max-w-xs"
								/>
								<Select
									value={recruitFactionFilter}
									onValueChange={setRecruitFactionFilter}
								>
									<SelectTrigger className="sm:w-44">
										<SelectValue placeholder="Faction" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All factions</SelectItem>
										{recruitFactions.map((f) => (
											<SelectItem key={f} value={f}>
												{f.replace(/_/g, " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									value={recruitKindFilter}
									onValueChange={(v) =>
										setRecruitKindFilter(v as "all" | "ascendant" | "mundane")
									}
								>
									<SelectTrigger className="sm:w-40">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All types</SelectItem>
										<SelectItem value="ascendant">Ascendant</SelectItem>
										<SelectItem value="mundane">Mundane</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{filteredRecruits.length === 0 ? (
								<AscendantText className="block text-muted-foreground text-center py-8">
									{availableNPCs.length === 0
										? "All available NPCs have been recruited!"
										: "No recruits match your filters."}
								</AscendantText>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{filteredRecruits.map((npc) => (
										<button
											type="button"
											key={npc.id}
											className="rounded-lg border border-border bg-muted/30 p-3 hover:border-primary/50 transition-colors cursor-pointer text-left w-full"
											onClick={() => {
												setSelectedNPC(npc);
												setRecruitDialogOpen(true);
											}}
										>
											<div className="flex items-start justify-between mb-2">
												<div>
													<p className="font-heading font-semibold text-sm">
														{npc.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{npc.title} · L{npc.level} {npc.job}
														{npc.rank ? (
															<span
																className={`ml-1 ${rankToGateBadge(npc.rank)}`}
															>
																· Rank {npc.rank}
															</span>
														) : (
															<span className="ml-1 text-muted-foreground">
																· Mundane
															</span>
														)}
													</p>
												</div>
												<Badge className="text-xs bg-primary/10 text-primary border-primary/20">
													{npc.faction.replace(/_/g, " ")}
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground line-clamp-2">
												{npc.description}
											</p>
											<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
												<Shield className="w-3 h-3" />
												<span className="line-clamp-1">
													{npc.recruitCondition}
												</span>
											</div>
										</button>
									))}
								</div>
							)}
						</AscendantWindow>
					</TabsContent>

					{/* INFO TAB */}
					<TabsContent value="info" className="space-y-6">
						<AscendantWindow title="GUILD INFO">
							<div className="space-y-4">
								{caps.canRecruit && (
									<>
										<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
											<span className="text-xs font-display text-muted-foreground">
												SHARE CODE
											</span>
											<div className="flex items-center gap-2">
												<span className="font-mono font-bold text-lg text-primary">
													{guild.share_code}
												</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={handleCopyShareCode}
												>
													<Copy className="w-3 h-3" />
												</Button>
											</div>
										</div>
										<p className="text-xs text-muted-foreground">
											Share this code with players to let them join your guild.
										</p>
									</>
								)}
								{guild.campaign_id && (
									<Link
										to={`/campaigns/${guild.campaign_id}`}
										className="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted/70 transition-colors"
									>
										<span className="text-xs font-display text-muted-foreground">
											CAMPAIGN
										</span>
										<span className="text-sm font-heading text-primary">
											{linkedCampaignName}
										</span>
									</Link>
								)}
								<div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded">
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											Guild Rank
										</AscendantText>
										<Badge
											variant="outline"
											className={cn(
												"mt-1",
												rankToGateBadge(guild.guild_rank ?? "E"),
											)}
										>
											{guild.guild_rank ?? "E"}
										</Badge>
									</div>
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											Level
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{guildLevel}
										</p>
										{levelProgress.required > 0 ? (
											<AscendantText className="block text-xs text-muted-foreground">
												{levelProgress.into}/{levelProgress.required} to next
											</AscendantText>
										) : (
											<AscendantText className="block text-xs text-muted-foreground">
												Max level
											</AscendantText>
										)}
									</div>
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											Members
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{members.length}/{guildMemberCap}
										</p>
										<AscendantText className="block text-xs text-muted-foreground">
											Roster Cap
										</AscendantText>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded">
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											Total Members
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{members.length}
										</p>
									</div>
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											NPC Recruits
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{npcMembers.length}
										</p>
									</div>
								</div>
							</div>
							<div className="mt-4 flex items-center justify-between gap-3 p-3 bg-muted/30 rounded">
								<div>
									<AscendantText className="block text-xs text-muted-foreground">
										Gate Contracts
									</AscendantText>
									<p className="text-sm text-foreground">
										<span className="font-semibold text-primary">
											{activeQuests.length}
										</span>{" "}
										active ·{" "}
										<span className="font-semibold text-primary">
											{PREBUILT_QUEST_CONTRACTS.length}
										</span>{" "}
										on the Bureau board
									</p>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="gap-1 shrink-0"
									onClick={() => setActiveTab("quests")}
								>
									<ScrollText className="w-4 h-4" />
									View board
								</Button>
							</div>
						</AscendantWindow>
					</TabsContent>

					{/* ACTIVITY TAB */}
					<TabsContent value="activity" className="space-y-6">
						<ActivityFeedPanel
							title="GUILD ACTIVITY"
							events={activity.events}
							onRemove={activity.remove}
							onClear={activity.clear}
							emptyLabel="No guild activity yet. Recruit NPCs or level them up to build a history."
						/>
					</TabsContent>

					{/* QUESTS TAB (view-only for all members; actions gated to officers+) */}
					<TabsContent value="quests" className="space-y-6">
						{activeQuests.length > 0 && (
							<AscendantWindow title="ACTIVE CONTRACTS">
								<div className="space-y-3">
									{activeQuests.map((quest) => (
										<div
											key={quest.id}
											className="rounded-lg border border-border bg-muted/30 p-3 space-y-2"
										>
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2 min-w-0">
													<Badge
														variant="outline"
														className={cn(
															"text-xs",
															rankToGateBadge(quest.rank),
														)}
													>
														{quest.rank}
													</Badge>
													<p className="font-heading font-semibold truncate">
														{quest.title}
													</p>
												</div>
												<div className="flex items-center gap-2 shrink-0">
													<Button
														size="sm"
														variant="outline"
														className="gap-1"
														onClick={() => handleResolveQuest(quest.id, true)}
														disabled={
															resolveQuest.isPending || !caps.canManageQuests
														}
													>
														<Check className="w-4 h-4" />
														Success
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="gap-1 text-destructive"
														onClick={() => handleResolveQuest(quest.id, false)}
														disabled={
															resolveQuest.isPending || !caps.canManageQuests
														}
													>
														<X className="w-4 h-4" />
														Fail
													</Button>
												</div>
											</div>
											<AscendantText className="block text-xs text-muted-foreground">
												Reward: {quest.rewards.funds} {quest.rewards.currency} ·
												+{quest.rewards.contribution} contribution
											</AscendantText>
											{npcMembers.length > 0 && (
												<div className="flex flex-wrap gap-1.5">
													<AscendantText className="text-xs text-muted-foreground mr-1">
														Strike squad:
													</AscendantText>
													{npcMembers.map((m) => {
														const assigned = quest.assigned_member_ids.includes(
															m.id,
														);
														return (
															<Button
																key={m.id}
																size="sm"
																variant={assigned ? "default" : "outline"}
																className="h-7 px-2 text-xs"
																onClick={() => handleToggleSquad(quest, m.id)}
																disabled={
																	!caps.canManageQuests || assignSquad.isPending
																}
															>
																{m.npc_name ?? m.npc_data?.name ?? "NPC"}
															</Button>
														);
													})}
												</div>
											)}
										</div>
									))}
								</div>
							</AscendantWindow>
						)}

						<AscendantWindow title="BUREAU CONTRACT BOARD">
							<AscendantText className="block text-xs text-muted-foreground mb-3">
								Standing gate contracts from the Bureau, available to every
								guild. Accept one to add it to your active board. (Wardens issue
								their own campaign-specific quests separately.)
							</AscendantText>
							{!caps.canManageQuests && (
								<AscendantText className="block text-xs text-muted-foreground mb-3">
									You are viewing the board — guild officers accept and resolve
									contracts.
								</AscendantText>
							)}
							<div className="mb-3 flex flex-wrap gap-1.5">
								{["all", "E", "D", "C", "B", "A", "S", "SS"].map((r) => (
									<Button
										key={r}
										size="sm"
										variant={questRankFilter === r ? "default" : "outline"}
										className="h-7 px-2 text-xs"
										onClick={() => setQuestRankFilter(r)}
									>
										{r === "all" ? "All" : r}
									</Button>
								))}
							</div>
							<div className="space-y-2">
								{filteredContracts.map((sq) => {
									const taken = acceptedSourceIds.has(sq.id);
									return (
										<div
											key={sq.id}
											className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded"
										>
											<div className="min-w-0">
												<div className="flex items-center gap-2 min-w-0">
													<Badge
														variant="outline"
														className={cn("text-xs", rankToGateBadge(sq.rank))}
													>
														{sq.rank}
													</Badge>
													<p className="font-heading font-semibold truncate">
														{sq.title}
													</p>
												</div>
												<AscendantText className="block text-xs text-muted-foreground capitalize">
													{sq.type} · {sq.summary}
												</AscendantText>
											</div>
											<Button
												size="sm"
												variant="outline"
												className="shrink-0"
												onClick={() => handleAcceptQuest(sq)}
												disabled={
													taken ||
													acceptQuest.isPending ||
													!caps.canManageQuests
												}
											>
												{taken ? "Accepted" : "Accept"}
											</Button>
										</div>
									);
								})}
							</div>
						</AscendantWindow>
					</TabsContent>

					{/* TREASURY TAB (Guild Master / Vice-Master) */}
					{caps.canManageTreasury && (
						<TabsContent value="treasury" className="space-y-6">
							<AscendantWindow title="GUILD TREASURY">
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{RA_CURRENCY_TYPES.map((c) => (
										<div
											key={c.id}
											className="p-3 bg-muted/30 rounded text-center"
										>
											<AscendantText className="block text-xs text-muted-foreground">
												{c.shortLabel}
											</AscendantText>
											<p className="text-xl font-heading font-bold text-primary">
												{getFundsBalance(guild.funds, c.id)}
											</p>
										</div>
									))}
								</div>
								<div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
									<div className="flex-1">
										<AscendantText className="block text-xs text-muted-foreground mb-1">
											Currency
										</AscendantText>
										<Select
											value={treasuryCurrency}
											onValueChange={(v) =>
												setTreasuryCurrency(v as RaCurrencyId)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{RA_CURRENCY_TYPES.map((c) => (
													<SelectItem key={c.id} value={c.id}>
														{getRaCurrencyDefinition(c.id)?.name ??
															c.shortLabel}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="flex-1">
										<AscendantText className="block text-xs text-muted-foreground mb-1">
											Amount
										</AscendantText>
										<Input
											type="number"
											min={1}
											value={treasuryAmount}
											onChange={(e) => setTreasuryAmount(e.target.value)}
											placeholder="0"
										/>
									</div>
									<div className="flex gap-2">
										<Button
											onClick={() => handleTreasury(1)}
											disabled={adjustFunds.isPending}
										>
											Deposit
										</Button>
										<Button
											variant="outline"
											onClick={() => handleTreasury(-1)}
											disabled={adjustFunds.isPending}
										>
											Withdraw
										</Button>
									</div>
								</div>
							</AscendantWindow>
						</TabsContent>
					)}

					{/* BASE TAB (facilities · skills · workshop — leader-managed) */}
					{caps.canManageSkills && (
						<TabsContent value="base" className="space-y-6">
							<AscendantWindow title="GUILD BENEFITS">
								{(() => {
									const labels = describeAggregatedGuildEffects(base.effects);
									const { benefits, effects } = base.effects;
									if (labels.length === 0 && benefits.length === 0) {
										return (
											<p className="text-sm text-muted-foreground">
												No benefits yet. Build facilities and unlock guild
												skills to grant your roster real bonuses.
											</p>
										);
									}
									return (
										<div className="space-y-2">
											{labels.length > 0 && (
												<div className="flex flex-wrap gap-2">
													{labels.map((label) => (
														<Badge
															key={label}
															variant="outline"
															className="text-xs"
														>
															{label}
														</Badge>
													))}
												</div>
											)}
											{effects.length > 0 && (
												<p className="text-[11px] text-muted-foreground">
													Effects apply to every member's character sheet while
													they fly this guild's banner.
												</p>
											)}
											{benefits.map((benefit) => (
												<p
													key={benefit}
													className="text-xs text-muted-foreground"
												>
													• {benefit}
												</p>
											))}
										</div>
									);
								})()}
							</AscendantWindow>

							<AscendantWindow title="GUILD BASE PROPERTY">
								<p className="mb-3 text-xs text-muted-foreground">
									{base.ownedBase
										? `Home: ${base.ownedBase.name}. Acquiring another base relocates the guild — already-built wings are kept.`
										: "The guild has no home yet. Acquire a pre-built base, or the buildable lot to raise a wholly custom hall."}
								</p>
								<div className="grid gap-3 sm:grid-cols-2">
									{GUILD_BASES.map((property) => {
										const owned = base.baseProperty === property.id;
										const currencyDef = getRaCurrencyDefinition(
											property.cost.currency,
										);
										const canAfford =
											getFundsBalance(guild.funds, property.cost.currency) >=
											property.cost.amount;
										const includedLabels = Object.entries(
											property.includedFacilities,
										).map(([fid, tier]) => {
											const f = GUILD_FACILITIES.find((x) => x.id === fid);
											return `${f?.name ?? fid} T${tier}`;
										});
										const perkLabels = summarizeGuildBenefits(property);
										return (
											<div
												key={property.id}
												className="p-3 bg-muted/30 rounded space-y-2"
											>
												<div className="flex items-center justify-between gap-2">
													<p className="font-heading font-semibold text-primary">
														{property.name}
													</p>
													{owned ? (
														<Badge variant="outline" className="text-xs">
															<Check className="w-3 h-3 mr-1" />
															Home
														</Badge>
													) : (
														<Badge variant="outline" className="text-xs">
															{property.cost.amount}{" "}
															{currencyDef?.shortLabel ??
																property.cost.currency}
														</Badge>
													)}
												</div>
												<p className="text-xs text-muted-foreground">
													{property.summary}
												</p>
												<p className="text-[11px] text-muted-foreground">
													{includedLabels.length > 0
														? `Includes: ${includedLabels.join(", ")}`
														: "Blank lot — build every wing yourself."}
												</p>
												{perkLabels.length > 0 && (
													<p className="text-[11px] text-muted-foreground">
														Perk: {perkLabels.join(", ")}
													</p>
												)}
												{!owned && (
													<div className="flex flex-wrap items-center gap-2">
														<Button
															size="sm"
															onClick={() => handleBuyBase(property.id)}
															disabled={baseMutationPending || !canAfford}
														>
															<Hammer className="w-3 h-3 mr-1" />
															{base.baseProperty ? "Relocate" : "Acquire"} ·{" "}
															{property.cost.amount}{" "}
															{currencyDef?.shortLabel ??
																property.cost.currency}
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={() => handleGrantBase(property.id)}
															disabled={baseMutationPending}
															title="Warden grant — no fund cost"
														>
															<Gift className="w-3 h-3 mr-1" />
															Grant
														</Button>
														{!canAfford && (
															<span className="text-[11px] text-muted-foreground">
																Insufficient funds
															</span>
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</AscendantWindow>

							<AscendantWindow title="FACILITIES">
								<div className="grid gap-3 sm:grid-cols-2">
									{GUILD_FACILITIES.map((facility) => {
										const level = facilityLevel(base.facilities, facility.id);
										const next = nextFacilityTier(facility, level);
										const currencyDef = next
											? getRaCurrencyDefinition(next.cost.currency)
											: null;
										const canAfford = next
											? getFundsBalance(guild.funds, next.cost.currency) >=
												next.cost.amount
											: false;
										return (
											<div
												key={facility.id}
												className="p-3 bg-muted/30 rounded space-y-2"
											>
												<div className="flex items-center justify-between gap-2">
													<p className="font-heading font-semibold text-primary">
														{facility.name}
													</p>
													<Badge variant="outline" className="text-xs">
														Tier {level}/{facility.tiers.length}
													</Badge>
												</div>
												<p className="text-xs text-muted-foreground">
													{facility.summary}
												</p>
												{next ? (
													<>
														<div className="text-xs">
															<span className="text-muted-foreground">
																Next:{" "}
															</span>
															<span className="text-foreground">
																{next.name}
															</span>{" "}
															<span className="text-muted-foreground">
																· {summarizeGuildBenefits(next).join(", ")}
															</span>
														</div>
														<div className="flex flex-wrap items-center gap-2">
															<Button
																size="sm"
																onClick={() => handleBuyFacility(facility.id)}
																disabled={baseMutationPending || !canAfford}
															>
																<Hammer className="w-3 h-3 mr-1" />
																Upgrade · {next.cost.amount}{" "}
																{currencyDef?.shortLabel ?? next.cost.currency}
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleGrantFacility(facility.id, next.tier)
																}
																disabled={baseMutationPending}
																title="Warden grant — no fund cost"
															>
																<Gift className="w-3 h-3 mr-1" />
																Grant
															</Button>
															{!canAfford && (
																<span className="text-[11px] text-muted-foreground">
																	Insufficient funds
																</span>
															)}
														</div>
													</>
												) : (
													<Badge className="text-xs">Max tier reached</Badge>
												)}
											</div>
										);
									})}
								</div>
							</AscendantWindow>

							<AscendantWindow title="GUILD SKILLS">
								<div className="grid gap-3 sm:grid-cols-2">
									{GUILD_SKILLS.map((skill) => {
										const owned = base.skills.includes(skill.id);
										const currencyDef = getRaCurrencyDefinition(
											skill.cost.currency,
										);
										const canAfford =
											getFundsBalance(guild.funds, skill.cost.currency) >=
											skill.cost.amount;
										return (
											<div
												key={skill.id}
												className="p-3 bg-muted/30 rounded space-y-2"
											>
												<div className="flex items-center justify-between gap-2">
													<p className="font-heading font-semibold text-primary">
														{skill.name}
													</p>
													{owned && (
														<Badge variant="outline" className="text-xs">
															<Check className="w-3 h-3 mr-1" />
															Unlocked
														</Badge>
													)}
												</div>
												<p className="text-xs text-muted-foreground">
													{skill.description}
												</p>
												<p className="text-[11px] text-muted-foreground">
													{summarizeGuildBenefits(skill).join(", ")}
												</p>
												{!owned && (
													<div className="flex flex-wrap items-center gap-2">
														<Button
															size="sm"
															onClick={() => handleBuySkill(skill.id)}
															disabled={baseMutationPending || !canAfford}
														>
															<Sparkles className="w-3 h-3 mr-1" />
															Unlock · {skill.cost.amount}{" "}
															{currencyDef?.shortLabel ?? skill.cost.currency}
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={() => handleGrantSkill(skill.id)}
															disabled={baseMutationPending}
															title="Warden grant — no fund cost"
														>
															<Gift className="w-3 h-3 mr-1" />
															Grant
														</Button>
														{!canAfford && (
															<span className="text-[11px] text-muted-foreground">
																Insufficient funds
															</span>
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</AscendantWindow>

							<AscendantWindow title="GUILD WORKSHOP">
								{forgeUnlocked ? (
									<div className="flex items-start gap-2">
										<Hammer className="w-4 h-4 mt-0.5 text-primary" />
										<div>
											<p className="text-sm text-foreground">
												The guild workshop is online.
											</p>
											<p className="text-xs text-muted-foreground">
												With the Forge raised, members may craft guild gear at
												the bench — browse recipes and materials in the Crafting
												compendium.
											</p>
											<Button
												variant="link"
												size="sm"
												className="px-0 h-auto"
												onClick={() =>
													navigate("/compendium?category=crafting")
												}
											>
												Open the Crafting compendium →
											</Button>
											{base.effects.craftingOptions.length > 0 && (
												<div className="mt-3">
													<AscendantText className="block text-xs text-muted-foreground mb-1">
														Forge recipes unlocked
													</AscendantText>
													<div className="flex flex-wrap gap-1.5">
														{base.effects.craftingOptions.map((recipeId) => {
															const recipe = craftingRecipes.find(
																(r) => r.id === recipeId,
															);
															return (
																<Badge
																	key={recipeId}
																	variant="outline"
																	className="text-[11px]"
																	title={recipe?.description ?? undefined}
																>
																	{recipe?.name ?? recipeId}
																</Badge>
															);
														})}
													</div>
													<p className="text-[11px] text-muted-foreground mt-1">
														Additive — members keep full access to base
														crafting.
													</p>
												</div>
											)}
											<div className="mt-3">
												<AscendantText className="block text-xs text-muted-foreground mb-1">
													Workshop materials
												</AscendantText>
												<div className="flex flex-wrap gap-1.5">
													{GUILD_BASE_MATERIALS.map((m) => (
														<Badge
															key={m.id}
															variant="outline"
															className="text-[11px]"
															title={`${m.source} — ${m.uses}`}
														>
															{m.name}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										Build the <strong>Forge &amp; Workshop</strong> facility to
										unlock guild crafting.
									</p>
								)}
							</AscendantWindow>
						</TabsContent>
					)}

					{/* SETTINGS TAB (Leader only) */}
					{caps.canDisband && (
						<TabsContent value="settings" className="space-y-6">
							<AscendantWindow title="DANGER ZONE" variant="alert">
								<div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded">
									<div>
										<p className="font-heading font-semibold text-destructive">
											Disband Guild
										</p>
										<p className="text-xs text-muted-foreground">
											Permanently dissolve the guild. All members and recruits
											will be released.
										</p>
									</div>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => setDeleteDialogOpen(true)}
									>
										<Trash2 className="w-4 h-4 mr-1" />
										Disband
									</Button>
								</div>
							</AscendantWindow>
						</TabsContent>
					)}
				</Tabs>
			</div>

			{/* Add Guild Ally to Character Sheet Dialog */}
			<Dialog
				open={!!allyForMember}
				onOpenChange={(o) => {
					if (!o) setAllyForMember(null);
				}}
			>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<UserPlus className="w-5 h-5 text-primary" />
							Add {allyForMember?.npc_name ?? "ally"} to a character sheet
						</DialogTitle>
						<DialogDescription>
							Carry this recruit onto one of your own characters as a Guild Ally
							companion.
						</DialogDescription>
					</DialogHeader>
					{myCharacters.length === 0 ? (
						<p className="text-sm text-muted-foreground py-4">
							You have no characters yet. Create one first.
						</p>
					) : (
						<div className="space-y-2">
							{myCharacters.map((character) => (
								<Button
									key={character.id}
									type="button"
									variant="outline"
									className="w-full h-auto justify-start py-3"
									disabled={addAlly.isPending}
									onClick={() => handleAddAlly(character.id)}
									data-testid={`add-ally-target-${character.id}`}
								>
									<span className="flex flex-col items-start text-left">
										<span className="font-heading font-semibold">
											{character.name}
										</span>
										{(character.level || character.job) && (
											<span className="text-xs text-muted-foreground">
												{[
													character.level ? `Level ${character.level}` : null,
													character.job,
												]
													.filter(Boolean)
													.join(" · ")}
											</span>
										)}
									</span>
								</Button>
							))}
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setAllyForMember(null)}
							disabled={addAlly.isPending}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Recruit NPC Dialog */}
			<Dialog open={recruitDialogOpen} onOpenChange={setRecruitDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<UserPlus className="w-5 h-5 text-primary" />
							RECRUIT NPC
						</DialogTitle>
						<DialogDescription>
							{selectedNPC
								? `Review ${selectedNPC.name}'s profile before recruiting.`
								: "Select an NPC to recruit."}
						</DialogDescription>
					</DialogHeader>
					{selectedNPC && (
						<div className="space-y-4">
							<div className="p-4 bg-muted/50 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<div>
										<p className="font-heading font-bold text-lg">
											{selectedNPC.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{selectedNPC.title} · Level {selectedNPC.level}{" "}
											{selectedNPC.job}
										</p>
									</div>
									<div className="text-right text-xs text-muted-foreground">
										<p>HP: {selectedNPC.hp}</p>
										<p>AC: {selectedNPC.ac}</p>
									</div>
								</div>
								<p className="text-sm mt-2">{selectedNPC.description}</p>
								<div className="mt-3 p-2 bg-background/50 rounded border border-border/50">
									<p className="text-xs font-heading text-primary mb-1">
										RECRUITMENT CONDITION
									</p>
									<p className="text-xs text-muted-foreground">
										{selectedNPC.recruitCondition}
									</p>
								</div>
								<div className="mt-3">
									<p className="text-xs font-heading text-muted-foreground mb-1">
										ABILITIES
									</p>
									<div className="flex flex-wrap gap-1">
										{selectedNPC.keyAbilities.map((ability) => (
											<Badge
												key={ability}
												variant="secondary"
												className="text-xs"
											>
												{ability}
											</Badge>
										))}
									</div>
								</div>
								<div className="mt-3 text-xs text-muted-foreground">
									<p>
										Max Level: {selectedNPC.leveling.maxLevel} · HP/Level: +
										{selectedNPC.leveling.hpPerLevel}
									</p>
								</div>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRecruitDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="btn-umbral"
							onClick={handleRecruit}
							disabled={recruitNPC.isPending}
						>
							{recruitNPC.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Recruiting...
								</>
							) : (
								<>
									<UserPlus className="w-4 h-4 mr-2" />
									Recruit {selectedNPC?.name}
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="border-destructive/30">
					<DialogHeader>
						<DialogTitle className="text-destructive">
							DISBAND GUILD
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to permanently disband{" "}
							<strong>{guild.name}</strong>? All members and NPC recruits will
							be released.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteGuild}
							disabled={deleteGuild.isPending}
						>
							{deleteGuild.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Disbanding...
								</>
							) : (
								"Disband Permanently"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default GuildDetail;
