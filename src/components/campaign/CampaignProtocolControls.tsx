import { formatDistanceToNow } from "date-fns";
import {
	Download,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	Swords,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignExportMenu } from "@/components/campaign/CampaignExportMenu";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
	useCampaignEncounters,
	useDeleteCampaignEncounter,
	useDeployCampaignEncounter,
} from "@/hooks/useCampaignEncounters";
import { useCampaignExport } from "@/hooks/useCampaignExport";

import {
	DEFAULT_RULES,
	useCampaignRuleEvents,
	useCampaignRules,
	useCreateCampaignRuleEvent,
	useUpdateCampaignRules,
} from "@/hooks/useCampaignRules";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

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

interface CampaignProtocolControlsProps {
	campaignId: string;
	campaignName?: string;
}

export function CampaignProtocolControls({
	campaignId,
	campaignName = "",
}: CampaignProtocolControlsProps) {
	const navigate = useNavigate();
	const { toast } = useToast();

	const { data: rulesData } = useCampaignRules(campaignId);
	const { data: ruleEvents = [] } = useCampaignRuleEvents(campaignId);
	const updateRules = useUpdateCampaignRules();
	const logRuleEvent = useCreateCampaignRuleEvent();

	const { data: encounters = [] } = useCampaignEncounters(campaignId);
	const deployEncounter = useDeployCampaignEncounter();
	const deleteEncounter = useDeleteCampaignEncounter();

	const exportCampaign = useCampaignExport();

	const [rules, setRules] = useState(DEFAULT_RULES);

	useEffect(() => {
		if (rulesData?.rules) {
			setRules(rulesData.rules);
		}
	}, [rulesData?.rules]);

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
					`/warden-directives/initiative-tracker?campaignId=${encodeURIComponent(campaignId)}&sessionId=${encodeURIComponent(sessionId)}`,
				);
			}
		} catch {
			// Mutation-level onError handles user-facing feedback.
		}
	};

	return (
		<div className="space-y-6" data-testid="campaign-protocol-controls">
			<AscendantWindow
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
			</AscendantWindow>

			<AscendantWindow
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
			</AscendantWindow>

			<AscendantWindow
				title="EXPORT CAMPAIGN"
				data-testid="campaign-export-panel"
			>
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
				<div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60 pt-3">
					<div>
						<p className="font-heading font-semibold">
							Notes, Wiki &amp; Session Log
						</p>
						<p className="text-xs text-muted-foreground">
							Markdown, portable JSON, a printable PDF session-log, or an `.ics`
							calendar.
						</p>
					</div>
					<CampaignExportMenu
						campaignId={campaignId}
						campaignName={campaignName}
					/>
				</div>
			</AscendantWindow>
		</div>
	);
}
