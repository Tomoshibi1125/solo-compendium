import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type HarvestAttemptResult,
	useCharacterHarvesting,
} from "@/hooks/useHarvesting";

export function HarvestingPanel({
	characterId,
	readOnly = false,
}: {
	characterId: string;
	readOnly?: boolean;
}) {
	const { approvals, resolve } = useCharacterHarvesting(characterId);
	const [skill, setSkill] = useState<"Medicine" | "Survival">("Medicine");
	const [lastResult, setLastResult] = useState<HarvestAttemptResult | null>(
		null,
	);
	const open = (approvals.data ?? []).filter(
		(approval) => approval.status === "open",
	);

	return (
		<AscendantWindow title="Approved harvests">
			<div className="space-y-3 text-sm">
				<p className="text-muted-foreground">
					A Warden approves each available yield and verifies the equipment. The
					server rolls the INT check; a failed attempt creates no material lot.
				</p>
				{approvals.error && (
					<p role="alert" className="text-destructive">
						{String(approvals.error)}
					</p>
				)}
				{!readOnly && open.length > 0 && (
					<div className="max-w-xs space-y-1">
						<Label htmlFor="harvest-skill">INT check skill</Label>
						<Select
							value={skill}
							onValueChange={(value) => setSkill(value as typeof skill)}
						>
							<SelectTrigger id="harvest-skill">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Medicine">Medicine</SelectItem>
								<SelectItem value="Survival">Survival</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
				{open.length === 0 && !approvals.isLoading && (
					<p className="text-muted-foreground">No open harvest approvals.</p>
				)}
				{open.map((approval) => (
					<div key={approval.id} className="rounded border p-3 space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<strong>{approval.method} harvest</strong>
							<Badge variant="outline">
								{approval.source_rank} · {approval.approved_grade}
							</Badge>
							<span>{approval.approved_quantity} material units</span>
						</div>
						<p>{approval.source_note}</p>
						<p className="text-muted-foreground">
							DC {approval.dc} · {approval.duration_minutes} min ·{" "}
							{approval.tool_kind}
						</p>
						{!readOnly && (
							<Button
								disabled={resolve.isPending}
								onClick={() => {
									setLastResult(null);
									resolve.mutate(
										{
											authorizationId: approval.id,
											skill,
											operationId: `m2:harvest:${globalThis.crypto.randomUUID()}`,
										},
										{ onSuccess: setLastResult },
									);
								}}
							>
								Attempt harvest
							</Button>
						)}
					</div>
				))}
				{resolve.error && (
					<p role="alert" className="text-destructive">
						{resolve.error.message}
					</p>
				)}
				{lastResult && (
					<p role="status">
						{lastResult.success ? "Success" : "Failure"}: {lastResult.roll} +{" "}
						{lastResult.intelligence_modifier} INT +{" "}
						{lastResult.proficiency_bonus} proficiency = {lastResult.total} vs
						DC {lastResult.dc}.
						{lastResult.success
							? " The approved material lot was created."
							: " No lot was created."}
					</p>
				)}
			</div>
		</AscendantWindow>
	);
}
