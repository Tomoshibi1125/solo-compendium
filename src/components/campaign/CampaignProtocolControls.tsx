import { formatDistanceToNow } from "date-fns";
import {
	Copy,
	Download,
	PackageOpen,
	Plus,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	Swords,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	useCampaignEncounters,
	useDeleteCampaignEncounter,
	useDeployCampaignEncounter,
} from "@/hooks/useCampaignEncounters";
import { useCampaignExport } from "@/hooks/useCampaignExport";
import {
	useCampaignInviteAuditLogs,
	useCampaignInvites,
	useCreateCampaignInvite,
	useDeleteCampaignInvite,
} from "@/hooks/useCampaignInvites";
import {
	useAssignCampaignLoot,
	useAssignCampaignRelic,
	useCampaignLootDrops,
	useCampaignRelicInstances,
} from "@/hooks/useCampaignRewards";
import {
	DEFAULT_RULES,
	useCampaignRuleEvents,
	useCampaignRules,
	useCreateCampaignRuleEvent,
	useUpdateCampaignRules,
} from "@/hooks/useCampaignRules";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
	buildCampaignInviteUrl,
	campaignInviteStatusLabel,
	campaignInviteStatusMessage,
	deriveCampaignInviteStatus,
} from "@/lib/campaignInviteUtils";
import { formatRegentVernacular } from "@/lib/vernacular";

const downloadJson = (payload: Json, filename: string) => {
	const blob = new Blob([JSON.stringify(payload, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

const toNumberOrNull = (value: string) => {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

type LootItemDraft = {
	name: string;
	quantity: number;
	value: number | null;
};

interface CampaignProtocolControlsProps {
	campaignId: string;
}

export function CampaignProtocolControls({
	campaignId,
}: CampaignProtocolControlsProps) {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { data: members = [] } = useCampaignMembers(campaignId);
	const { data: invites = [], isLoading: invitesLoading } =
		useCampaignInvites(campaignId);
	const { data: inviteAuditLogs = [], isLoading: inviteAuditLoading } =
		useCampaignInviteAuditLogs(campaignId);
	const createInvite = useCreateCampaignInvite();
	const deleteInvite = useDeleteCampaignInvite();

	const { data: rulesData } = useCampaignRules(campaignId);
	const { data: ruleEvents = [] } = useCampaignRuleEvents(campaignId);
	const updateRules = useUpdateCampaignRules();
	const logRuleEvent = useCreateCampaignRuleEvent();

	const { data: encounters = [] } = useCampaignEncounters(campaignId);
	const deployEncounter = useDeployCampaignEncounter();
	const deleteEncounter = useDeleteCampaignEncounter();

	const { data: lootDrops = [] } = useCampaignLootDrops(campaignId);
	const { data: relicInstances = [] } = useCampaignRelicInstances(campaignId);
	const assignLoot = useAssignCampaignLoot();
	const assignRelic = useAssignCampaignRelic();

	const exportCampaign = useCampaignExport();

	const [inviteRole, setInviteRole] = useState<"ascendant" | "co-system">(
		"ascendant",
	);
	const [inviteExpiresAt, setInviteExpiresAt] = useState("");
	const [inviteMaxUses, setInviteMaxUses] = useState(1);
	const [inviteEmail, setInviteEmail] = useState("");
	const [revokeReason, setRevokeReason] = useState("");

	const [rules, setRules] = useState(DEFAULT_RULES);

	const [lootDraft, setLootDraft] = useState<LootItemDraft>({
		name: "",
		quantity: 1,
		value: null,
	});
	const [lootItems, setLootItems] = useState<LootItemDraft[]>([]);
	const [lootRecipient, setLootRecipient] = useState("unassigned");
	const [lootEncounterId, setLootEncounterId] = useState("none");

	const [relicName, setRelicName] = useState("");
	const [relicRarity, setRelicRarity] = useState("uncommon");
	const [relicValue, setRelicValue] = useState("");
	const [relicProperties, setRelicProperties] = useState("{}");
	const [relicBoundTo, setRelicBoundTo] = useState("unassigned");
	const [relicTradeable, setRelicTradeable] = useState(true);

	useEffect(() => {
		if (rulesData?.rules) {
			setRules(rulesData.rules);
		}
	}, [rulesData?.rules]);

	const memberOptions = useMemo(() => {
		return members.map((member) => ({
			id: member.id,
			name: member.characters?.name || "Unlinked Ascendant",
			job: member.characters?.job || "Unknown",
			level: member.characters?.level || 1,
		}));
	}, [members]);

	const handleCreateInvite = async () => {
		const expiresAt = inviteExpiresAt
			? new Date(inviteExpiresAt).toISOString()
			: null;
		await createInvite.mutateAsync({
			campaignId,
			role: inviteRole,
			expiresAt,
			maxUses: inviteMaxUses,
			inviteEmail: inviteEmail.trim() || undefined,
		});
		setInviteEmail("");
	};

	const handleCopyInvite = async (token: string) => {
		const url = buildCampaignInviteUrl(window.location.origin, token);
		await navigator.clipboard.writeText(url);
		toast({
			title: "Invite link copied",
			description: "Share this link to invite a new Ascendant.",
		});
	};

	const handleCopyJoinCode = async (joinCode: string) => {
		await navigator.clipboard.writeText(joinCode);
		toast({
			title: "Join code copied",
			description: "Share this code for quick campaign joining.",
		});
	};

	const handleExportEncounter = async (
		encounterId: string,
		encounterName: string,
	) => {
		const { data, error } = await supabase
			.from("campaign_encounter_entries")
			.select("*")
			.eq("encounter_id", encounterId)
			.order("created_at", { ascending: true });

		if (error) {
			toast({
				title: "Export failed",
				description: error.message,
				variant: "destructive",
			});
			return;
		}

		const payload = {
			encounter_id: encounterId,
			entries: data ?? [],
		};
		downloadJson(
			payload,
			`encounter-${encounterName.replace(/\s+/g, "-").toLowerCase()}.json`,
		);
	};

	const handleAddLootItem = () => {
		if (!lootDraft.name.trim()) return;
		setLootItems((prev) => [
			...prev,
			{
				name: lootDraft.name.trim(),
				quantity: Math.max(1, lootDraft.quantity),
				value: lootDraft.value,
			},
		]);
		setLootDraft({ name: "", quantity: 1, value: null });
	};

	const handleAssignLoot = async () => {
		if (lootItems.length === 0) {
			toast({
				title: "Add loot first",
				description: "Include at least one loot item before assigning.",
				variant: "destructive",
			});
			return;
		}
		await assignLoot.mutateAsync({
			campaignId,
			items: lootItems.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				value_credits: item.value ?? undefined,
			})),
			encounterId: lootEncounterId !== "none" ? lootEncounterId : null,
			assignedToMemberId: lootRecipient !== "unassigned" ? lootRecipient : null,
		});
		setLootItems([]);
	};

	const handleAssignRelic = async () => {
		if (!relicName.trim()) {
			toast({
				title: "Relic name required",
				description: "Provide a relic name before assigning.",
				variant: "destructive",
			});
			return;
		}
		let properties: Json = {};
		try {
			properties = relicProperties ? (JSON.parse(relicProperties) as Json) : {};
		} catch {
			toast({
				title: "Invalid relic properties",
				description: "Properties must be valid JSON.",
				variant: "destructive",
			});
			return;
		}

		await assignRelic.mutateAsync({
			campaignId,
			name: relicName.trim(),
			rarity: relicRarity,
			valueCredits: toNumberOrNull(relicValue) ?? undefined,
			properties,
			boundToMemberId: relicBoundTo !== "unassigned" ? relicBoundTo : null,
			tradeable: relicTradeable,
		});

		setRelicName("");
		setRelicProperties("{}");
		setRelicValue("");
		setRelicBoundTo("unassigned");
	};

	const handleSaveRules = () => {
		updateRules.mutate({ campaignId, rules });
	};

	const handleInjectFailure = async () => {
		await logRuleEvent.mutateAsync({
			campaignId,
			kind: "failure_injected",
			payload: {
				note: rules.failure_injection_note || null,
				rate: rules.failure_injection_rate,
			},
		});
	};

	const handleExportCampaign = () => {
		exportCampaign.mutate({ campaignId });
	};

	const handleDeployEncounter = async (encounterId: string) => {
		try {
			const sessionId = await deployEncounter.mutateAsync({
				campaignId,
				encounterId,
			});
			if (sessionId) {
				navigate(
					`/dm-tools/initiative-tracker?campaignId=${encodeURIComponent(campaignId)}&sessionId=${encodeURIComponent(sessionId)}`,
				);
			}
		} catch {
			// Mutation-level onError handles user-facing feedback.
		}
	};

	return (
		<div className="space-y-6" data-testid="campaign-protocol-controls">
			<SystemWindow
				title="INVITES & PERMISSIONS"
				data-testid="campaign-invites-panel"
			>
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<div>
							<Label htmlFor="invite-role">Role</Label>
							<Select
								value={inviteRole}
								onValueChange={(value) =>
									setInviteRole(value as "ascendant" | "co-system")
								}
							>
								<SelectTrigger id="invite-role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ascendant">Ascendant</SelectItem>
									<SelectItem value="co-system">Co-System</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="invite-expire">Expires At</Label>
							<Input
								id="invite-expire"
								type="datetime-local"
								value={inviteExpiresAt}
								onChange={(event) => setInviteExpiresAt(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="invite-uses">Max Uses</Label>
							<Input
								id="invite-uses"
								type="number"
								min={1}
								value={inviteMaxUses}
								onChange={(event) =>
									setInviteMaxUses(Math.max(1, Number(event.target.value) || 1))
								}
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="invite-email">Invite Email (optional)</Label>
						<Input
							id="invite-email"
							type="email"
							value={inviteEmail}
							onChange={(event) => setInviteEmail(event.target.value)}
							placeholder="player@example.com"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							If provided, the app will attempt to send an auth invite email and
							still generate a copyable link.
						</p>
					</div>
					<Button
						onClick={handleCreateInvite}
						className="w-full"
						disabled={createInvite.isPending}
						data-testid="campaign-invite-create"
					>
						<Plus className="w-4 h-4 mr-2" />
						Create Invite
					</Button>
				</div>

				<div className="mt-6 space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-heading font-semibold">Active Invites</h3>
						{invitesLoading && (
							<span className="text-xs text-muted-foreground">Loading…</span>
						)}
					</div>
					{invites.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No active invites yet.
						</p>
					) : (
						invites.map((invite) => {
							const inviteStatus = deriveCampaignInviteStatus(invite);
							const isExpired = inviteStatus === "expired";
							const isRevoked = inviteStatus === "revoked";
							const isUsedUp = inviteStatus === "used_up";
							const remainingUses = Math.max(
								invite.max_uses - invite.used_count,
								0,
							);
							const joinCode = invite.join_code;
							const joinCodeValue = joinCode ?? "";
							return (
								<div
									key={invite.id}
									className="rounded-lg border border-border bg-muted/30 p-3"
								>
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{invite.role === "co-system"
														? "Co-System"
														: "Ascendant"}
												</Badge>
												{inviteStatus !== "active" && (
													<Badge variant="destructive">
														{campaignInviteStatusLabel(inviteStatus)}
													</Badge>
												)}
												{inviteStatus === "active" && (
													<Badge className="bg-emerald-600 text-white">
														Active
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												Uses {invite.used_count}/{invite.max_uses} · Remaining{" "}
												{remainingUses}
											</p>
											{invite.expires_at && (
												<p className="text-xs text-muted-foreground">
													Expires{" "}
													{formatDistanceToNow(new Date(invite.expires_at), {
														addSuffix: true,
													})}
												</p>
											)}
											<p className="text-xs text-muted-foreground">
												Join code{" "}
												<span
													className="font-mono text-foreground"
													data-testid="campaign-invite-join-code"
												>
													{joinCode ?? "N/A"}
												</span>
											</p>
											{invite.invite_email && (
												<p className="text-xs text-muted-foreground">
													Sent to {invite.invite_email}
												</p>
											)}
											<p className="text-xs text-muted-foreground mt-1">
												{campaignInviteStatusMessage(inviteStatus)}
											</p>
										</div>
										<div className="flex flex-wrap gap-2">
											{joinCodeValue && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleCopyJoinCode(joinCodeValue)}
													data-testid="campaign-invite-code-copy"
												>
													<Copy className="w-4 h-4 mr-2" />
													Copy Code
												</Button>
											)}
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleCopyInvite(joinCodeValue || invite.token)
												}
												data-testid="campaign-invite-copy"
											>
												<Copy className="w-4 h-4 mr-2" />
												Copy Link
											</Button>
											<Button
												size="sm"
												variant="destructive"
												disabled={isRevoked}
												onClick={() =>
													deleteInvite.mutate({
														campaignId,
														inviteId: invite.id,
														reason: revokeReason.trim() || undefined,
													})
												}
												data-testid="campaign-invite-revoke"
											>
												<Trash2 className="w-4 h-4 mr-2" />
												{isRevoked ? "Revoked" : "Revoke"}
											</Button>
										</div>
									</div>
									{(isExpired || isUsedUp) && !isRevoked && (
										<p className="text-xs text-amber-500 mt-2">
											Reissue by creating a new invite link or join code.
										</p>
									)}
								</div>
							);
						})
					)}
				</div>

				<div className="mt-4 space-y-2">
					<Label htmlFor="invite-revoke-reason">Revoke reason (optional)</Label>
					<Input
						id="invite-revoke-reason"
						value={revokeReason}
						onChange={(event) => setRevokeReason(event.target.value)}
						placeholder="Compromised link, replaced with new invite"
					/>
				</div>

				<div className="mt-6 space-y-3" data-testid="campaign-invite-audit-log">
					<div className="flex items-center justify-between">
						<h3 className="font-heading font-semibold">Invite Audit Trail</h3>
						{inviteAuditLoading && (
							<span className="text-xs text-muted-foreground">Loading…</span>
						)}
					</div>
					{inviteAuditLogs.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No invite audit events yet.
						</p>
					) : (
						<div className="space-y-2">
							{inviteAuditLogs.slice(0, 8).map((entry) => (
								<div
									key={entry.id}
									className="rounded border border-border px-3 py-2 text-xs"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="font-heading text-foreground">
											{entry.action.replace(/_/g, " ")}
										</span>
										<span className="text-muted-foreground">
											{formatDistanceToNow(new Date(entry.created_at), {
												addSuffix: true,
											})}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</SystemWindow>

			<SystemWindow
				title="PROTOCOL RULES & ENFORCEMENT"
				data-testid="campaign-rules-panel"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
							<div>
								<p className="font-heading font-semibold">
									Economy Enforcement
								</p>
								<p className="text-xs text-muted-foreground">
									Limit loot and relic values by System protocol.
								</p>
							</div>
							<Switch
								checked={rules.economy_enabled}
								onCheckedChange={(value) =>
									setRules((prev) => ({ ...prev, economy_enabled: value }))
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label htmlFor="loot-cap">Loot Value Cap</Label>
								<Input
									id="loot-cap"
									type="number"
									value={rules.economy_max_loot_value ?? ""}
									onChange={(event) =>
										setRules((prev) => ({
											...prev,
											economy_max_loot_value: toNumberOrNull(
												event.target.value,
											),
										}))
									}
								/>
							</div>
							<div>
								<Label htmlFor="relic-cap">Relic Value Cap</Label>
								<Input
									id="relic-cap"
									type="number"
									value={rules.economy_max_relic_value ?? ""}
									onChange={(event) =>
										setRules((prev) => ({
											...prev,
											economy_max_relic_value: toNumberOrNull(
												event.target.value,
											),
										}))
									}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
							<div>
								<p className="font-heading font-semibold">
									Protocol Enforcement
								</p>
								<p className="text-xs text-muted-foreground">
									Track System rule adherence and intervention.
								</p>
							</div>
							<Switch
								checked={rules.protocol_enforcement_enabled}
								onCheckedChange={(value) =>
									setRules((prev) => ({
										...prev,
										protocol_enforcement_enabled: value,
									}))
								}
							/>
						</div>
						<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
							<div>
								<p className="font-heading font-semibold">Failure Injection</p>
								<p className="text-xs text-muted-foreground">
									Inject System failures for dramatic tension.
								</p>
							</div>
							<Switch
								checked={rules.failure_injection_enabled}
								onCheckedChange={(value) =>
									setRules((prev) => ({
										...prev,
										failure_injection_enabled: value,
									}))
								}
								data-testid="campaign-failure-toggle"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label htmlFor="failure-rate">Failure Rate (%)</Label>
								<Input
									id="failure-rate"
									type="number"
									min={0}
									max={100}
									value={rules.failure_injection_rate}
									onChange={(event) =>
										setRules((prev) => ({
											...prev,
											failure_injection_rate: Math.min(
												Math.max(Number(event.target.value) || 0, 0),
												100,
											),
										}))
									}
								/>
							</div>
							<div>
								<Label htmlFor="failure-note">Failure Note</Label>
								<Input
									id="failure-note"
									value={rules.failure_injection_note ?? ""}
									onChange={(event) =>
										setRules((prev) => ({
											...prev,
											failure_injection_note: event.target.value,
										}))
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					<Button onClick={handleSaveRules} data-testid="campaign-rules-save">
						<ShieldCheck className="w-4 h-4 mr-2" />
						Save Protocol Settings
					</Button>
					<Button
						variant="outline"
						onClick={handleInjectFailure}
						disabled={!rules.failure_injection_enabled}
						data-testid="campaign-failure-inject"
					>
						<ShieldAlert className="w-4 h-4 mr-2" />
						Inject Failure
					</Button>
				</div>
				{ruleEvents.length > 0 && (
					<div className="mt-4 space-y-2" data-testid="campaign-rule-events">
						<h4 className="text-xs font-display text-muted-foreground">
							Recent Rule Events
						</h4>
						{ruleEvents.slice(0, 4).map((event) => (
							<div
								key={event.id}
								className="flex items-center justify-between text-xs text-muted-foreground"
							>
								<span className="font-heading text-foreground">
									{event.kind.replace(/_/g, " ")}
								</span>
								<span>
									{formatDistanceToNow(new Date(event.created_at), {
										addSuffix: true,
									})}
								</span>
							</div>
						))}
					</div>
				)}
			</SystemWindow>

			<SystemWindow
				title="ENCOUNTER LIBRARY"
				data-testid="campaign-encounters-panel"
			>
				<div className="space-y-3">
					{encounters.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No encounters saved yet.
						</p>
					) : (
						encounters.map((encounter) => (
							<div
								key={encounter.id}
								className="rounded-lg border border-border bg-muted/30 p-3"
							>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<div className="flex items-center gap-2">
											<Swords className="w-4 h-4 text-primary" />
											<p className="font-heading font-semibold">
												{encounter.name}
											</p>
										</div>
										<p className="text-xs text-muted-foreground">
											Updated{" "}
											{formatDistanceToNow(new Date(encounter.updated_at), {
												addSuffix: true,
											})}
										</p>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												void handleDeployEncounter(encounter.id);
											}}
											disabled={deployEncounter.isPending}
											data-testid="campaign-encounter-deploy"
										>
											<Sparkles className="w-4 h-4 mr-2" />
											Deploy
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handleExportEncounter(encounter.id, encounter.name)
											}
											data-testid="campaign-encounter-export"
										>
											<Download className="w-4 h-4 mr-2" />
											Export
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() =>
												deleteEncounter.mutate({
													campaignId,
													encounterId: encounter.id,
												})
											}
											data-testid="campaign-encounter-delete"
										>
											<Trash2 className="w-4 h-4 mr-2" />
											Delete
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</SystemWindow>

			<SystemWindow
				title="LOOT & RELIC DISTRIBUTION"
				data-testid="campaign-rewards-panel"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h3 className="font-heading font-semibold flex items-center gap-2">
							<PackageOpen className="w-4 h-4" />
							Assign Loot Drop
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<div className="sm:col-span-2">
								<Label htmlFor="loot-item">Loot Item</Label>
								<Input
									id="loot-item"
									value={lootDraft.name}
									onChange={(event) =>
										setLootDraft((prev) => ({
											...prev,
											name: event.target.value,
										}))
									}
								/>
							</div>
							<div>
								<Label htmlFor="loot-qty">Qty</Label>
								<Input
									id="loot-qty"
									type="number"
									min={1}
									value={lootDraft.quantity}
									onChange={(event) =>
										setLootDraft((prev) => ({
											...prev,
											quantity: Math.max(1, Number(event.target.value) || 1),
										}))
									}
								/>
							</div>
							<div className="sm:col-span-2">
								<Label htmlFor="loot-value">Value (credits)</Label>
								<Input
									id="loot-value"
									type="number"
									value={lootDraft.value ?? ""}
									onChange={(event) =>
										setLootDraft((prev) => ({
											...prev,
											value: toNumberOrNull(event.target.value),
										}))
									}
								/>
							</div>
							<div className="flex items-end">
								<Button
									variant="outline"
									onClick={handleAddLootItem}
									className="w-full"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add
								</Button>
							</div>
						</div>

						{lootItems.length > 0 && (
							<div className="space-y-2">
								{lootItems.map((item, index) => (
									<div
										key={item.name}
										className="flex items-center justify-between rounded border border-border px-3 py-2"
									>
										<div>
											<p className="text-sm font-heading">{item.name}</p>
											<p className="text-xs text-muted-foreground">
												Qty {item.quantity} · Value {item.value ?? "n/a"}
											</p>
										</div>
										<Button
											size="icon"
											variant="ghost"
											onClick={() =>
												setLootItems((prev) =>
													prev.filter((_, idx) => idx !== index),
												)
											}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<Label htmlFor="loot-recipient">Assign To</Label>
								<Select value={lootRecipient} onValueChange={setLootRecipient}>
									<SelectTrigger id="loot-recipient">
										<SelectValue placeholder="Unassigned" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="unassigned">Unassigned</SelectItem>
										{memberOptions.map((member) => (
											<SelectItem key={member.id} value={member.id}>
												{member.name} · Lv {member.level}{" "}
												{formatRegentVernacular(member.job)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="loot-encounter">Link Encounter</Label>
								<Select
									value={lootEncounterId}
									onValueChange={setLootEncounterId}
								>
									<SelectTrigger id="loot-encounter">
										<SelectValue placeholder="None" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No encounter</SelectItem>
										{encounters.map((encounter) => (
											<SelectItem key={encounter.id} value={encounter.id}>
												{encounter.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<Button
							onClick={handleAssignLoot}
							className="w-full"
							data-testid="campaign-loot-assign"
						>
							<PackageOpen className="w-4 h-4 mr-2" />
							Record Loot Drop
						</Button>
					</div>

					<div className="space-y-4">
						<h3 className="font-heading font-semibold flex items-center gap-2">
							<Sparkles className="w-4 h-4" />
							Assign Relic
						</h3>
						<div className="space-y-3">
							<div>
								<Label htmlFor="relic-name">Relic Name</Label>
								<Input
									id="relic-name"
									value={relicName}
									onChange={(event) => setRelicName(event.target.value)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<Label htmlFor="relic-rarity">Rarity</Label>
									<Select value={relicRarity} onValueChange={setRelicRarity}>
										<SelectTrigger id="relic-rarity">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"common",
												"uncommon",
												"rare",
												"very_rare",
												"legendary",
											].map((rarity) => (
												<SelectItem key={rarity} value={rarity}>
													{rarity.replace("_", " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="relic-value">Value (credits)</Label>
									<Input
										id="relic-value"
										type="number"
										value={relicValue}
										onChange={(event) => setRelicValue(event.target.value)}
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="relic-properties">Properties (JSON)</Label>
								<Textarea
									id="relic-properties"
									rows={3}
									value={relicProperties}
									onChange={(event) => setRelicProperties(event.target.value)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<Label htmlFor="relic-recipient">Bind To</Label>
									<Select value={relicBoundTo} onValueChange={setRelicBoundTo}>
										<SelectTrigger id="relic-recipient">
											<SelectValue placeholder="Unassigned" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="unassigned">Unassigned</SelectItem>
											{memberOptions.map((member) => (
												<SelectItem key={member.id} value={member.id}>
													{member.name} · Lv {member.level}{" "}
													{formatRegentVernacular(member.job)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3">
									<Label htmlFor="relic-tradeable">Tradeable</Label>
									<Switch
										id="relic-tradeable"
										checked={relicTradeable}
										onCheckedChange={setRelicTradeable}
									/>
								</div>
							</div>
							<Button
								onClick={handleAssignRelic}
								className="w-full"
								data-testid="campaign-relic-assign"
							>
								<Sparkles className="w-4 h-4 mr-2" />
								Assign Relic
							</Button>
						</div>
					</div>
				</div>

				<div className="mt-6 space-y-3">
					<h3 className="font-heading font-semibold">Recent Drops</h3>
					{lootDrops.length === 0 && relicInstances.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No loot or relics recorded yet.
						</p>
					) : (
						<div className="space-y-2">
							{lootDrops.slice(0, 5).map((drop) => (
								<div
									key={drop.id}
									className="rounded border border-border px-3 py-2 text-sm"
								>
									Loot drop · {new Date(drop.created_at).toLocaleString()}
								</div>
							))}
							{relicInstances.slice(0, 5).map((relic) => (
								<div
									key={relic.id}
									className="rounded border border-border px-3 py-2 text-sm"
								>
									Relic {relic.name} · {relic.rarity ?? "unknown"}
								</div>
							))}
						</div>
					)}
				</div>
			</SystemWindow>

			<SystemWindow title="EXPORT CAMPAIGN" data-testid="campaign-export-panel">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<p className="font-heading font-semibold">Campaign Bundle</p>
						<p className="text-xs text-muted-foreground">
							Downloads campaign data with secrets redacted.
						</p>
					</div>
					<Button onClick={handleExportCampaign} data-testid="campaign-export">
						<Download className="w-4 h-4 mr-2" />
						Export Bundle
					</Button>
				</div>
			</SystemWindow>
		</div>
	);
}
