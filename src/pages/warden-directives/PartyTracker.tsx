import {
	ArrowLeft,
	Coffee,
	Download,
	ExternalLink,
	FileJson,
	Heart,
	Package,
	Plus,
	Shield,
	Trash2,
	UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CampaignExtrasPanel } from "@/components/campaign/CampaignExtrasPanel";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";
import { useCampaignToolState } from "@/hooks/useToolState";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { cn } from "@/lib/utils";

interface PartyMember {
	id: string;
	name: string;
	level: number;
	hp: number;
	maxHp: number;
	ac: number;
	conditions: string[];
	notes: string;
}

/** Shared, party-wide resources tracked alongside the roster. */
interface SharedResources {
	supplies: number;
	downtimeDays: number;
	notes: string;
}

const DEFAULT_SHARED_RESOURCES: SharedResources = {
	supplies: 0,
	downtimeDays: 0,
	notes: "",
};

type PartyTrackerState = {
	members: PartyMember[];
	shared?: SharedResources;
};

type CampaignWithRole = {
	id: string;
	name: string;
	access: "owner" | "co-warden";
};

const CONDITION_OPTIONS = [
	"Blinded",
	"Charmed",
	"Deafened",
	"Exhaustion",
	"Frightened",
	"Grappled",
	"Incapacitated",
	"Invisible",
	"Paralyzed",
	"Petrified",
	"Poisoned",
	"Prone",
	"Restrained",
	"Stunned",
	"Unconscious",
];

const PartyTracker = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { toast } = useToast();
	const { data: myCampaigns = [], isLoading: myCampaignsLoading } =
		useMyCampaigns();
	const { data: joinedCampaigns = [], isLoading: joinedCampaignsLoading } =
		useJoinedCampaigns();
	const activeCampaignId = searchParams.get("campaignId")?.trim() || "";
	const [newMember, setNewMember] = useState({
		name: "",
		level: 1,
		hp: 10,
		maxHp: 10,
		ac: 10,
		conditions: [] as string[],
		notes: "",
	});

	// DDB Parity Integration
	const ascendantTools = useAscendantTools();

	const manageableCampaigns = useMemo<CampaignWithRole[]>(() => {
		const byId = new Map<string, CampaignWithRole>();

		for (const campaign of myCampaigns) {
			byId.set(campaign.id, {
				id: campaign.id,
				name: campaign.name,
				access: "owner",
			});
		}

		for (const campaign of joinedCampaigns) {
			if (campaign.member_role !== "co-warden") continue;
			if (!byId.has(campaign.id)) {
				byId.set(campaign.id, {
					id: campaign.id,
					name: campaign.name,
					access: "co-warden",
				});
			}
		}

		return Array.from(byId.values()).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [joinedCampaigns, myCampaigns]);

	useHydratedPreferredCampaignId({
		toolKey: "party_tracker",
		campaigns: manageableCampaigns,
		urlCampaignId: activeCampaignId || null,
		isCampaignIdValid: (id) =>
			manageableCampaigns.some((campaign) => campaign.id === id),
		onResolveCampaignId: (id) => {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.set("campaignId", id);
			setSearchParams(nextParams, { replace: true });
		},
	});

	const handleCampaignChange = (nextCampaignId: string) => {
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("campaignId", nextCampaignId);
		setSearchParams(nextParams, { replace: true });
	};

	const {
		state: trackerState,
		setState: setTrackerState,
		isLoading: trackerLoading,
		saveNow,
	} = useCampaignToolState<PartyTrackerState>(
		activeCampaignId || null,
		"party_tracker",
		{
			initialState: { members: [] },
			enabled: Boolean(activeCampaignId),
		},
	);

	const members = trackerState.members || [];
	const shared = trackerState.shared ?? DEFAULT_SHARED_RESOURCES;
	const campaignsLoading = myCampaignsLoading || joinedCampaignsLoading;
	const selectedCampaign =
		manageableCampaigns.find((campaign) => campaign.id === activeCampaignId) ??
		null;

	const { data: sharedCharacters = [] } =
		useCampaignSharedCharacters(activeCampaignId);

	const persistState = (next: Partial<PartyTrackerState>) => {
		const nextState: PartyTrackerState = {
			members: next.members ?? members,
			shared: next.shared ?? shared,
		};
		setTrackerState(nextState);
		void saveNow(nextState);
	};

	const persistMembers = (nextMembers: PartyMember[]) => {
		persistState({ members: nextMembers });
	};

	const updateShared = (patch: Partial<SharedResources>) => {
		persistState({ shared: { ...shared, ...patch } });
	};

	const generateMemberId = () => {
		if (
			typeof crypto !== "undefined" &&
			typeof crypto.randomUUID === "function"
		) {
			return crypto.randomUUID();
		}
		return `party-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	};

	const addMember = () => {
		if (!activeCampaignId) {
			toast({
				title: "Select a campaign first",
				description: "Choose an active campaign before adding party members.",
				variant: "destructive",
			});
			return;
		}

		if (!newMember.name) {
			toast({
				title: "Error",
				description: "Please enter a name.",
				variant: "destructive",
			});
			return;
		}

		const member: PartyMember = {
			id: generateMemberId(),
			...newMember,
		};

		persistMembers([...members, member]);
		setNewMember({
			name: "",
			level: 1,
			hp: 10,
			maxHp: 10,
			ac: 10,
			conditions: [],
			notes: "",
		});

		toast({
			title: "Added",
			description: "Party member added.",
		});
	};

	const removeMember = (id: string) => {
		persistMembers(members.filter((member) => member.id !== id));
	};

	const updateHp = (id: string, delta: number) => {
		persistMembers(
			members.map((member) => {
				if (member.id !== id) return member;
				const nextHp = Math.max(0, Math.min(member.maxHp, member.hp + delta));

				// DDB Parity: Broadcast explicit HP override
				ascendantTools
					.trackHealthChange(
						member.id || member.name,
						Math.abs(delta),
						delta < 0 ? "damage" : "healing",
					)
					.catch(console.error);

				return { ...member, hp: nextHp };
			}),
		);
	};

	const toggleCondition = (memberId: string, condition: string) => {
		persistMembers(
			members.map((member) => {
				if (member.id !== memberId) return member;
				const hasCondition = member.conditions.includes(condition);

				// DDB Parity: Broadcast Condition Toggles
				ascendantTools
					.trackConditionChange(
						member.id || member.name,
						condition,
						!hasCondition ? "add" : "remove",
					)
					.catch(console.error);

				return {
					...member,
					conditions: hasCondition
						? member.conditions.filter((entry) => entry !== condition)
						: [...member.conditions, condition],
				};
			}),
		);
	};

	const importFromCampaign = () => {
		if (!activeCampaignId) return;
		const existingNames = new Set(
			members.map((m) => m.name.trim().toLowerCase()),
		);
		const imported: PartyMember[] = [];
		for (const share of sharedCharacters) {
			const char = share.characters;
			if (!char?.name) continue;
			if (existingNames.has(char.name.trim().toLowerCase())) continue;
			existingNames.add(char.name.trim().toLowerCase());
			imported.push({
				id: generateMemberId(),
				name: char.name,
				level: char.level || 1,
				hp: 10,
				maxHp: 10,
				ac: 10,
				conditions: [],
				notes: char.job ? `Job: ${char.job}` : "",
			});
		}
		if (imported.length === 0) {
			toast({
				title: "Nothing to import",
				description:
					"No new shared characters found for this campaign (or all are already tracked). Share characters from the campaign first.",
			});
			return;
		}
		persistMembers([...members, ...imported]);
		toast({
			title: "Imported",
			description: `${imported.length} member(s) imported. Set HP/AC as needed.`,
		});
	};

	const partyLongRest = () => {
		if (members.length === 0) return;
		persistMembers(members.map((m) => ({ ...m, hp: m.maxHp })));
		toast({
			title: "Long rest",
			description: "All party members restored to full HP.",
		});
	};

	const partyToMarkdown = (): string => {
		const lines: string[] = [];
		lines.push(`# Party Roster — ${selectedCampaign?.name ?? "Vanguard"}`);
		lines.push("");
		lines.push(
			`**Members:** ${members.length} · **Supplies:** ${shared.supplies} · **Downtime:** ${shared.downtimeDays} day(s)`,
		);
		if (shared.notes.trim()) {
			lines.push("");
			lines.push("## Party Notes");
			lines.push(shared.notes.trim());
		}
		lines.push("");
		lines.push("## Roster");
		lines.push("| Member | Lvl | HP | AC | Conditions |");
		lines.push("| --- | --- | --- | --- | --- |");
		for (const m of members) {
			lines.push(
				`| ${m.name} | ${m.level} | ${m.hp}/${m.maxHp} | ${m.ac} | ${
					m.conditions.join(", ") || "—"
				} |`,
			);
		}
		return `${lines.join("\n")}\n`;
	};

	const exportParty = (format: "md" | "json") => {
		const base = `party-${selectedCampaign?.name ?? "roster"}`;
		if (format === "md") downloadMarkdown(base, partyToMarkdown());
		else
			downloadJson(base, { campaign: selectedCampaign?.name, members, shared });
	};

	const getHpColor = (hp: number, maxHp: number) => {
		const percentage = (hp / maxHp) * 100;
		if (percentage > 75) return "text-green-400";
		if (percentage > 50) return "text-yellow-400";
		if (percentage > 25) return "text-orange-400";
		return "text-red-400";
	};

	const getHpBarClass = (hp: number, maxHp: number) => {
		const percentage = (hp / maxHp) * 100;
		if (percentage > 75) return "[&>div]:bg-green-400";
		if (percentage > 50) return "[&>div]:bg-yellow-400";
		if (percentage > 25) return "[&>div]:bg-orange-400";
		return "[&>div]:bg-red-400";
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Vanguard Synchronization
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						A persistent localized tracker for Vanguard operational status,
						active parameters, condition anomalies, and observational notes.
					</ManaFlowText>
				</div>

				{campaignsLoading ? (
					<AscendantWindow title="LOADING CAMPAIGNS">
						<AscendantText className="block text-sm text-muted-foreground">
							Loading campaigns...
						</AscendantText>
					</AscendantWindow>
				) : manageableCampaigns.length === 0 ? (
					<AscendantWindow title="NO CAMPAIGNS AVAILABLE">
						<div className="space-y-3 text-sm text-muted-foreground">
							<p>
								Create or join a campaign with Warden access to track party
								state.
							</p>
							<Button onClick={() => navigate("/campaigns")}>
								Open Campaigns
							</Button>
						</div>
					</AscendantWindow>
				) : (
					<>
						<AscendantWindow title="ACTIVE CAMPAIGN" className="mb-6">
							<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
								<div className="space-y-2">
									<Label htmlFor="party-tracker-campaign">Campaign</Label>
									<Select
										value={activeCampaignId}
										onValueChange={handleCampaignChange}
									>
										<SelectTrigger id="party-tracker-campaign">
											<SelectValue placeholder="Select campaign" />
										</SelectTrigger>
										<SelectContent>
											{manageableCampaigns.map((campaign) => (
												<SelectItem key={campaign.id} value={campaign.id}>
													{campaign.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{selectedCampaign && (
									<div className="flex flex-wrap items-center gap-2">
										<Badge
											variant={
												selectedCampaign.access === "owner"
													? "default"
													: "outline"
											}
										>
											{selectedCampaign.access === "owner"
												? "Owner"
												: "Co-Warden"}
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/campaigns/${selectedCampaign.id}`}>
												Open Campaign
												<ExternalLink className="w-4 h-4 ml-2" />
											</Link>
										</Button>
										<Button
											variant="outline"
											asChild
											className="border-secondary text-secondary-foreground"
										>
											<Link
												to={`/party-stash?campaignId=${selectedCampaign.id}`}
											>
												Party Stash
												<Package className="w-4 h-4 ml-2" />
											</Link>
										</Button>
										<Button
											variant="outline"
											onClick={importFromCampaign}
											disabled={sharedCharacters.length === 0}
											title={
												sharedCharacters.length === 0
													? "No shared characters in this campaign yet"
													: "Import shared characters as party members"
											}
										>
											<UserPlus className="w-4 h-4 mr-2" />
											Import Characters
										</Button>
									</div>
								)}
							</div>
						</AscendantWindow>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								{trackerLoading ? (
									<AscendantWindow title="LOADING PARTY DATA">
										<AscendantText className="block text-sm text-muted-foreground">
											Loading party state...
										</AscendantText>
									</AscendantWindow>
								) : members.length === 0 ? (
									<AscendantWindow title="NO PARTY MEMBERS">
										<AscendantText className="block text-muted-foreground text-center py-8">
											Add party members to start tracking.
										</AscendantText>
									</AscendantWindow>
								) : (
									members.map((member) => (
										<AscendantWindow key={member.id} title={member.name}>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<Badge variant="outline">
															Level {member.level}
														</Badge>
														<Badge
															variant="outline"
															className="flex items-center gap-1"
														>
															<Shield className="w-3 h-3" />
															AC {member.ac}
														</Badge>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => removeMember(member.id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>

												<div>
													<div className="flex items-center justify-between mb-2">
														<Label className="flex items-center gap-2">
															<Heart className="w-4 h-4" />
															Hit Points
														</Label>
														<span
															className={cn(
																"font-resurge text-lg font-bold",
																getHpColor(member.hp, member.maxHp),
															)}
														>
															{member.hp} / {member.maxHp}
														</span>
													</div>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateHp(member.id, -1)}
														>
															-1
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateHp(member.id, -5)}
														>
															-5
														</Button>
														<Progress
															value={
																member.maxHp > 0
																	? (member.hp / member.maxHp) * 100
																	: 0
															}
															className={cn(
																"flex-1 h-2 bg-muted",
																getHpBarClass(member.hp, member.maxHp),
															)}
														/>
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateHp(member.id, 5)}
														>
															+5
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateHp(member.id, 1)}
														>
															+1
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => updateHp(member.id, member.maxHp)}
														>
															Full
														</Button>
													</div>
												</div>

												{member.conditions.length > 0 && (
													<div>
														<Label className="mb-2 block">Conditions</Label>
														<div className="flex flex-wrap gap-2">
															{member.conditions.map((condition) => (
																<Badge
																	key={condition}
																	variant="destructive"
																	className="cursor-pointer"
																	onClick={() =>
																		toggleCondition(member.id, condition)
																	}
																>
																	{condition} ×
																</Badge>
															))}
														</div>
													</div>
												)}

												<div>
													<Label className="mb-2 block">Add Condition</Label>
													<div className="flex flex-wrap gap-2">
														{CONDITION_OPTIONS.filter(
															(condition) =>
																!member.conditions.includes(condition),
														).map((condition) => (
															<Badge
																key={condition}
																variant="outline"
																className="cursor-pointer hover:bg-muted"
																onClick={() =>
																	toggleCondition(member.id, condition)
																}
															>
																+ {condition}
															</Badge>
														))}
													</div>
												</div>

												{member.notes && (
													<div className="p-3 rounded-lg bg-muted/30 border border-border">
														<Label className="mb-1 block text-xs">Notes</Label>
														<AscendantText className="block text-sm text-muted-foreground">
															{member.notes}
														</AscendantText>
													</div>
												)}
											</div>
										</AscendantWindow>
									))
								)}
							</div>

							<div className="space-y-6">
								<AscendantWindow title="ADD PARTY MEMBER">
									<div className="space-y-4">
										<div>
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												value={newMember.name || ""}
												onChange={(e) =>
													setNewMember({ ...newMember, name: e.target.value })
												}
												placeholder="Character name"
											/>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<Label htmlFor="level">Level</Label>
												<Input
													id="level"
													type="number"
													value={newMember.level || 1}
													onChange={(e) =>
														setNewMember({
															...newMember,
															level: parseInt(e.target.value, 10) || 1,
														})
													}
													min={1}
													max={20}
												/>
											</div>
											<div>
												<Label htmlFor="ac">AC</Label>
												<Input
													id="ac"
													type="number"
													value={newMember.ac || 10}
													onChange={(e) =>
														setNewMember({
															...newMember,
															ac: parseInt(e.target.value, 10) || 10,
														})
													}
													min={1}
												/>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<Label htmlFor="hp">Current HP</Label>
												<Input
													id="hp"
													type="number"
													value={newMember.hp || 0}
													onChange={(e) =>
														setNewMember({
															...newMember,
															hp: parseInt(e.target.value, 10) || 0,
														})
													}
													min={0}
												/>
											</div>
											<div>
												<Label htmlFor="maxHp">Max HP</Label>
												<Input
													id="maxHp"
													type="number"
													value={newMember.maxHp || 1}
													onChange={(e) =>
														setNewMember({
															...newMember,
															maxHp: parseInt(e.target.value, 10) || 1,
														})
													}
													min={1}
												/>
											</div>
										</div>
										<div>
											<Label htmlFor="notes">Notes (Optional)</Label>
											<Input
												id="notes"
												value={newMember.notes || ""}
												onChange={(e) =>
													setNewMember({ ...newMember, notes: e.target.value })
												}
												placeholder="Quick notes..."
											/>
										</div>
										<Button onClick={addMember} className="w-full">
											<Plus className="w-4 h-4 mr-2" />
											Add Member
										</Button>
									</div>
								</AscendantWindow>

								{members.length > 0 && (
									<AscendantWindow title="PARTY SUMMARY" variant="quest">
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Total Members:
												</span>
												<span className="font-semibold">{members.length}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Average Level:
												</span>
												<span className="font-semibold">
													{Math.round(
														members.reduce((sum, m) => sum + m.level, 0) /
															members.length,
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">Total HP:</span>
												<span className="font-semibold">
													{members.reduce((sum, m) => sum + m.hp, 0)} /{" "}
													{members.reduce((sum, m) => sum + m.maxHp, 0)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Members with Conditions:
												</span>
												<span className="font-semibold">
													{
														members.filter((m) => m.conditions.length > 0)
															.length
													}
												</span>
											</div>
											<div className="flex gap-2 pt-3 border-t border-primary/10">
												<Button
													variant="outline"
													size="sm"
													className="flex-1 gap-2"
													onClick={partyLongRest}
												>
													<Coffee className="w-3 h-3" />
													Long Rest
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="gap-2"
													onClick={() => exportParty("md")}
													title="Export Markdown"
												>
													<Download className="w-3 h-3" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="gap-2"
													onClick={() => exportParty("json")}
													title="Export JSON"
												>
													<FileJson className="w-3 h-3" />
												</Button>
											</div>
										</div>
									</AscendantWindow>
								)}

								{activeCampaignId && (
									<AscendantWindow title="SHARED RESOURCES" variant="quest">
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-3">
												<div className="space-y-1">
													<Label
														htmlFor="party-supplies"
														className="text-[11px] uppercase tracking-widest text-muted-foreground"
													>
														Supplies
													</Label>
													<Input
														id="party-supplies"
														type="number"
														min={0}
														value={shared.supplies}
														onChange={(e) =>
															updateShared({
																supplies:
																	Number.parseInt(e.target.value, 10) || 0,
															})
														}
														className="h-9"
													/>
												</div>
												<div className="space-y-1">
													<Label
														htmlFor="party-downtime"
														className="text-[11px] uppercase tracking-widest text-muted-foreground"
													>
														Downtime (days)
													</Label>
													<Input
														id="party-downtime"
														type="number"
														min={0}
														value={shared.downtimeDays}
														onChange={(e) =>
															updateShared({
																downtimeDays:
																	Number.parseInt(e.target.value, 10) || 0,
															})
														}
														className="h-9"
													/>
												</div>
											</div>
											<div className="space-y-1">
												<Label
													htmlFor="party-shared-notes"
													className="text-[11px] uppercase tracking-widest text-muted-foreground"
												>
													Party Notes
												</Label>
												<Input
													id="party-shared-notes"
													value={shared.notes}
													onChange={(e) =>
														updateShared({ notes: e.target.value })
													}
													placeholder="Shared objectives, supplies, downtime plans…"
												/>
											</div>
										</div>
									</AscendantWindow>
								)}

								{activeCampaignId && (
									<CampaignExtrasPanel
										campaignId={activeCampaignId}
										isWarden={
											selectedCampaign?.access === "owner" ||
											selectedCampaign?.access === "co-warden"
										}
									/>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</Layout>
	);
};

export default PartyTracker;
