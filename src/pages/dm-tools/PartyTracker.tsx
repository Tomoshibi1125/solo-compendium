import {
	ArrowLeft,
	ExternalLink,
	Heart,
	Package,
	Plus,
	Shield,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CampaignExtrasPanel } from "@/components/campaign/CampaignExtrasPanel";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";
import { useCampaignToolState } from "@/hooks/useToolState";
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

type PartyTrackerState = {
	members: PartyMember[];
};

type CampaignWithRole = {
	id: string;
	name: string;
	access: "owner" | "co-system";
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
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

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
			if (campaign.member_role !== "co-system") continue;
			if (!byId.has(campaign.id)) {
				byId.set(campaign.id, {
					id: campaign.id,
					name: campaign.name,
					access: "co-system",
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
	const campaignsLoading = myCampaignsLoading || joinedCampaignsLoading;
	const selectedCampaign =
		manageableCampaigns.find((campaign) => campaign.id === activeCampaignId) ??
		null;

	const persistMembers = (nextMembers: PartyMember[]) => {
		const nextState = { members: nextMembers };
		setTrackerState(nextState);
		void saveNow(nextState);
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
				playerTools
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
				playerTools
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
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Vanguard Synchronization
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						A persistent localized tracker for Vanguard operational status,
						active parameters, condition anomalies, and observational notes.
					</DataStreamText>
				</div>

				{campaignsLoading ? (
					<SystemWindow title="LOADING CAMPAIGNS">
						<SystemText className="block text-sm text-muted-foreground">
							Loading campaigns...
						</SystemText>
					</SystemWindow>
				) : manageableCampaigns.length === 0 ? (
					<SystemWindow title="NO CAMPAIGNS AVAILABLE">
						<div className="space-y-3 text-sm text-muted-foreground">
							<p>
								Create or join a campaign with Protocol Warden access to track
								party state.
							</p>
							<Button onClick={() => navigate("/campaigns")}>
								Open Campaigns
							</Button>
						</div>
					</SystemWindow>
				) : (
					<>
						<SystemWindow title="ACTIVE CAMPAIGN" className="mb-6">
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
												: "Co-System"}
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
									</div>
								)}
							</div>
						</SystemWindow>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								{trackerLoading ? (
									<SystemWindow title="LOADING PARTY DATA">
										<SystemText className="block text-sm text-muted-foreground">
											Loading party state...
										</SystemText>
									</SystemWindow>
								) : members.length === 0 ? (
									<SystemWindow title="NO PARTY MEMBERS">
										<SystemText className="block text-muted-foreground text-center py-8">
											Add party members to start tracking.
										</SystemText>
									</SystemWindow>
								) : (
									members.map((member) => (
										<SystemWindow key={member.id} title={member.name}>
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
																"font-arise text-lg font-bold",
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
														<SystemText className="block text-sm text-muted-foreground">
															{member.notes}
														</SystemText>
													</div>
												)}
											</div>
										</SystemWindow>
									))
								)}
							</div>

							<div className="space-y-6">
								<SystemWindow title="ADD PARTY MEMBER">
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
								</SystemWindow>

								{members.length > 0 && (
									<SystemWindow title="PARTY SUMMARY" variant="quest">
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
										</div>
									</SystemWindow>
								)}

								{activeCampaignId && (
									<CampaignExtrasPanel
										campaignId={activeCampaignId}
										isDM={
											selectedCampaign?.access === "owner" ||
											selectedCampaign?.access === "co-system"
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
