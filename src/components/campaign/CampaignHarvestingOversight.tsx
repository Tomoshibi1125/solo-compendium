import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import { useCampaignHarvesting } from "@/hooks/useHarvesting";
import { useAnomalyCatalog } from "@/hooks/useTamedAnomalies";
import { supabase } from "@/integrations/supabase/client";
import {
	type HarvestMethod,
	type HarvestRank,
	resolveHarvestCheck,
} from "@/lib/harvestingRules";

interface MaterialOption {
	id: string;
	name: string;
}

export function CampaignHarvestingOversight({
	campaignId,
}: {
	campaignId: string;
}) {
	const { toast } = useToast();
	const { data: characters = [] } = useCampaignSharedCharacters(campaignId);
	const anomalyCatalog = useAnomalyCatalog();
	const { approvals, approve, revoke } = useCampaignHarvesting(campaignId);
	const materials = useQuery({
		queryKey: ["material-definitions-m1"],
		queryFn: async (): Promise<MaterialOption[]> => {
			const { data, error } = await supabase
				.from("material_definitions" as never)
				.select("id,name")
				.order("name");
			if (error) throw error;
			return (data ?? []) as unknown as MaterialOption[];
		},
	});
	const [characterId, setCharacterId] = useState("");
	const [sourceKind, setSourceKind] = useState<
		"canonical-anomaly" | "warden-source"
	>("canonical-anomaly");
	const [sourceId, setSourceId] = useState("");
	const [manualRank, setManualRank] = useState<HarvestRank>("E");
	const [sourceNote, setSourceNote] = useState("");
	const [method, setMethod] = useState<HarvestMethod>("core");
	const [materialId, setMaterialId] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [durationMinutes, setDurationMinutes] = useState(1);
	const [toolKind, setToolKind] = useState<
		"harvesting-kit" | "field-extraction-rig" | "approved-equivalent"
	>("harvesting-kit");
	const [toolEvidence, setToolEvidence] = useState("");
	const [wardenDc, setWardenDc] = useState(21);

	const anomalies = useMemo(
		() =>
			[...(anomalyCatalog.data?.values() ?? [])].sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		[anomalyCatalog.data],
	);
	const rank =
		sourceKind === "canonical-anomaly"
			? (anomalies.find((entry) => entry.id === sourceId)?.rank as
					| HarvestRank
					| undefined)
			: manualRank;
	let check: ReturnType<typeof resolveHarvestCheck> | null = null;
	let checkError: string | null = null;
	if (rank) {
		try {
			check = resolveHarvestCheck(
				method,
				rank,
				method === "core" ? null : wardenDc,
			);
		} catch (error) {
			checkError = error instanceof Error ? error.message : String(error);
		}
	}
	const needsWardenDc =
		(rank === "S" && method !== "core") ||
		(rank === "A" && method === "precision");
	// For fixed checks the Warden field is ignored; the RPC enforces the authored DC.
	if (rank && !needsWardenDc) {
		check = resolveHarvestCheck(method, rank);
		checkError = null;
	}
	if (method === "core" && sourceKind !== "canonical-anomaly") {
		check = null;
		checkError = "Core extraction requires a canonical Anomaly source.";
	}

	const submit = async () => {
		if (!check || !characterId || !sourceId || !materialId) return;
		try {
			await approve.mutateAsync({
				campaignId,
				characterId,
				sourceKind,
				sourceId,
				sourceRank: sourceKind === "canonical-anomaly" ? null : manualRank,
				sourceNote,
				method,
				materialDefinitionId: materialId,
				quantity,
				durationMinutes: method === "core" ? 1 : durationMinutes,
				toolKind,
				toolEvidence,
				wardenDc: needsWardenDc ? wardenDc : null,
				operationId: `m2:approve:${globalThis.crypto.randomUUID()}`,
			});
			toast({ title: "Harvest yield approved" });
		} catch (error) {
			toast({
				title: "Approval rejected",
				description: error instanceof Error ? error.message : String(error),
				variant: "destructive",
			});
		}
	};

	return (
		<AscendantWindow title="Harvesting approvals">
			<div className="space-y-3 text-sm">
				<p className="text-muted-foreground">
					Approve one source and exact material yield per attempt. The tool
					evidence and non-core procedure time are Warden findings; no yield is
					inferred from a creature name.
				</p>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="space-y-1">
						<Label>Ascendant</Label>
						<Select value={characterId} onValueChange={setCharacterId}>
							<SelectTrigger>
								<SelectValue placeholder="Select Ascendant" />
							</SelectTrigger>
							<SelectContent>
								{characters.map((row) => (
									<SelectItem key={row.character_id} value={row.character_id}>
										{row.characters?.name ?? row.character_id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label>Source kind</Label>
						<Select
							value={sourceKind}
							onValueChange={(value) => {
								setSourceKind(value as typeof sourceKind);
								setSourceId("");
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="canonical-anomaly">
									Canonical Anomaly
								</SelectItem>
								<SelectItem value="warden-source">
									Warden-defined source
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{sourceKind === "canonical-anomaly" ? (
						<div className="space-y-1">
							<Label>Canonical Anomaly</Label>
							<Select value={sourceId} onValueChange={setSourceId}>
								<SelectTrigger>
									<SelectValue placeholder="Select Anomaly" />
								</SelectTrigger>
								<SelectContent>
									{anomalies.map((entry) => (
										<SelectItem key={entry.id} value={entry.id}>
											{entry.name} ({entry.rank})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : (
						<>
							<div className="space-y-1">
								<Label htmlFor="harvest-source-id">Source reference</Label>
								<Input
									id="harvest-source-id"
									value={sourceId}
									onChange={(event) => setSourceId(event.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Approved rank</Label>
								<Select
									value={manualRank}
									onValueChange={(value) => setManualRank(value as HarvestRank)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{(["E", "D", "C", "B", "A", "S"] as const).map((value) => (
											<SelectItem key={value} value={value}>
												{value}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</>
					)}
					<div className="space-y-1">
						<Label>Method</Label>
						<Select
							value={method}
							onValueChange={(value) => setMethod(value as HarvestMethod)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="core">
									Core extraction · 1 min · DC 15
								</SelectItem>
								<SelectItem value="bulk">Bulk harvest</SelectItem>
								<SelectItem value="precision">Precision harvest</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label>Material</Label>
						<Select value={materialId} onValueChange={setMaterialId}>
							<SelectTrigger>
								<SelectValue placeholder="Select material" />
							</SelectTrigger>
							<SelectContent>
								{(materials.data ?? []).map((entry) => (
									<SelectItem key={entry.id} value={entry.id}>
										{entry.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="harvest-quantity">Approved whole quantity</Label>
						<Input
							id="harvest-quantity"
							type="number"
							min={1}
							step={1}
							value={quantity}
							onChange={(event) => setQuantity(Number(event.target.value))}
						/>
					</div>
					{method !== "core" && (
						<div className="space-y-1">
							<Label htmlFor="harvest-duration">
								Approved duration, minutes
							</Label>
							<Input
								id="harvest-duration"
								type="number"
								min={1}
								step={1}
								value={durationMinutes}
								onChange={(event) =>
									setDurationMinutes(Number(event.target.value))
								}
							/>
						</div>
					)}
					{needsWardenDc && (
						<div className="space-y-1">
							<Label htmlFor="harvest-dc">Warden DC (21+)</Label>
							<Input
								id="harvest-dc"
								type="number"
								min={21}
								max={100}
								step={1}
								value={wardenDc}
								onChange={(event) => setWardenDc(Number(event.target.value))}
							/>
						</div>
					)}
					<div className="space-y-1">
						<Label>Verified equipment</Label>
						<Select
							value={toolKind}
							onValueChange={(value) => setToolKind(value as typeof toolKind)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="harvesting-kit">Harvesting Kit</SelectItem>
								<SelectItem value="field-extraction-rig">
									Field Extraction Rig
								</SelectItem>
								<SelectItem value="approved-equivalent">
									Approved equivalent
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="space-y-1">
					<Label htmlFor="harvest-tool-evidence">Equipment evidence</Label>
					<Input
						id="harvest-tool-evidence"
						value={toolEvidence}
						onChange={(event) => setToolEvidence(event.target.value)}
						placeholder="Owned kit, rig, or exact equivalent"
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="harvest-source-note">
						Available source and yield
					</Label>
					<Input
						id="harvest-source-note"
						value={sourceNote}
						onChange={(event) => setSourceNote(event.target.value)}
						placeholder="Where and what is available"
					/>
				</div>
				{check && (
					<p role="status">
						{check.grade} yield · INT with Medicine or Survival · DC {check.dc}
						{method === "core" ? " · 1 minute" : ""}
					</p>
				)}
				{checkError && (
					<p role="alert" className="text-destructive">
						{checkError}
					</p>
				)}
				<Button
					disabled={
						!check ||
						!characterId ||
						!sourceId ||
						!materialId ||
						approve.isPending
					}
					onClick={submit}
				>
					Approve one attempt
				</Button>
				<div className="space-y-2">
					{(approvals.data ?? [])
						.filter((entry) => entry.status === "open")
						.map((entry) => (
							<div
								key={entry.id}
								className="flex flex-wrap items-center justify-between gap-2 rounded border p-2"
							>
								<span>
									{entry.method} · {entry.source_rank} · DC {entry.dc} ·{" "}
									{entry.approved_quantity} units · {entry.source_note}
								</span>
								<Button
									size="sm"
									variant="outline"
									disabled={revoke.isPending}
									onClick={() => revoke.mutate(entry.id)}
								>
									Revoke
								</Button>
							</div>
						))}
				</div>
			</div>
		</AscendantWindow>
	);
}
