import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	type CompanionScalingRule,
	companionSourceRank,
	getCompanionScalingRule,
} from "@/lib/companionScaling";

const labels: Record<keyof CompanionScalingRule, string> = {
	hpBase: "HP starting value",
	hpPerLevel: "HP per player level",
	acBase: "AC starting value",
	acEveryLevels: "Levels per +1 AC",
	attackBase: "Attack starting bonus",
	saveBase: "Save DC starting value",
	damageDiceBase: "Starting damage dice",
	damageEveryLevels: "Levels per +1 damage die",
	damageDie: "Damage die size",
};
const bounds: Record<keyof CompanionScalingRule, [number, number]> = {
	hpBase: [0, 500],
	hpPerLevel: [1, 50],
	acBase: [1, 30],
	acEveryLevels: [1, 20],
	attackBase: [0, 20],
	saveBase: [0, 30],
	damageDiceBase: [1, 20],
	damageEveryLevels: [1, 20],
	damageDie: [4, 12],
};

export function CompanionScalingDialog({
	instance,
	campaignId,
	open,
	onOpenChange,
}: {
	instance: CompanionInstanceRecord;
	campaignId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const rank = companionSourceRank(instance);
	const defaults = getCompanionScalingRule(rank, {});
	const current = useMemo(
		() => getCompanionScalingRule(rank, instance.progression_profile),
		[rank, instance.progression_profile],
	);
	const [draft, setDraft] = useState<
		Record<keyof CompanionScalingRule, string>
	>(
		() =>
			Object.fromEntries(
				Object.entries(current).map(([key, value]) => [key, String(value)]),
			) as Record<keyof CompanionScalingRule, string>,
	);
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (open)
			setDraft(
				Object.fromEntries(
					Object.entries(current).map(([key, value]) => [key, String(value)]),
				) as Record<keyof CompanionScalingRule, string>,
			);
	}, [open, current]);

	const parsed = Object.fromEntries(
		Object.entries(draft).map(([key, value]) => [key, Number(value)]),
	) as unknown as CompanionScalingRule;
	const valid =
		(Object.keys(labels) as Array<keyof CompanionScalingRule>).every(
			(key) =>
				Number.isInteger(parsed[key]) &&
				parsed[key] >= bounds[key][0] &&
				parsed[key] <= bounds[key][1],
		) && [4, 6, 8, 10, 12].includes(parsed.damageDie);

	const submit = async (reset = false) => {
		if (saving || (!reset && !valid)) return;
		try {
			setSaving(true);
			const rpc = supabase.rpc as unknown as (
				name: string,
				args: Record<string, unknown>,
			) => Promise<{ data: unknown; error: { message: string } | null }>;
			const { error } = await rpc("set_companion_scaling_profile", {
				p_instance_id: instance.id,
				p_campaign_id: campaignId,
				p_scaling: reset ? {} : parsed,
			});
			if (error) throw new Error(error.message);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["campaign-tamed-anomalies", campaignId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-companion-instances"],
				}),
				queryClient.invalidateQueries({
					queryKey: ["companion-instance", instance.id],
				}),
				queryClient.invalidateQueries({ queryKey: ["character_extras"] }),
				queryClient.invalidateQueries({ queryKey: ["character-vehicles"] }),
				queryClient.invalidateQueries({
					queryKey: ["campaign-character-scaled-companions", campaignId],
				}),
			]);
			toast({
				title: reset
					? "Companion defaults restored"
					: "Companion scaling approved",
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: "Could not save scaling",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Warden companion scaling</DialogTitle>
					<DialogDescription>
						These coefficients replace the conservative rank defaults for this
						living creature. The player character's level still drives all
						combat numbers. Clear overrides to restore defaults.
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-3">
					{(Object.keys(labels) as Array<keyof CompanionScalingRule>).map(
						(key) => (
							<div key={key} className="space-y-1">
								<Label htmlFor={`scaling-${key}`}>{labels[key]}</Label>
								<Input
									id={`scaling-${key}`}
									type="number"
									min={bounds[key][0]}
									max={bounds[key][1]}
									value={draft[key]}
									onChange={(event) =>
										setDraft((previous) => ({
											...previous,
											[key]: event.target.value,
										}))
									}
								/>
								<span className="text-[10px] text-muted-foreground">
									Default {defaults[key]}
								</span>
							</div>
						),
					)}
				</div>
				<DialogFooter>
					<Button
						variant="ghost"
						onClick={() => void submit(true)}
						disabled={saving}
					>
						Restore defaults
					</Button>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => void submit()} disabled={saving || !valid}>
						Approve scaling
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
