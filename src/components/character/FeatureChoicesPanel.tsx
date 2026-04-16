import type { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { supabase } from "@/integrations/supabase/client";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import type { Database, Json } from "@/integrations/supabase/types";
import { getMaxPowerLevelForJobAtLevel } from "@/lib/characterCreation";
import {
	type ChoiceOptionExecutionPayload,
	executeFeatureChoiceGrants,
	extractGrantedPowerNames,
} from "@/lib/featureChoicesExecution";
import { formatRegentVernacular, MONARCH_LABEL } from "@/lib/vernacular";

type ChoiceGroupRow = {
	id: string;
	feature_id: string;
	choice_key: string;
	choice_count: number;
	prompt: string | null;
};

type ChoiceOptionRow = {
	id: string;
	group_id: string;
	option_key: string;
	name: string;
	description: string | null;
	grants: Json;
	created_at: string;
};

type ExtendedDatabase = Database & {
	public: {
		Tables: Database["public"]["Tables"] & {
			compendium_feature_choice_groups: {
				Row: ChoiceGroupRow;
				Insert: Omit<ChoiceGroupRow, "id">;
				Update: Partial<ChoiceGroupRow>;
			};
			compendium_feature_choice_options: {
				Row: ChoiceOptionRow;
				Insert: Omit<ChoiceOptionRow, "id">;
				Update: Partial<ChoiceOptionRow>;
			};
		};
	};
};

const supabaseExtended = supabase as SupabaseClient<ExtendedDatabase>;

type CharacterChoiceRow = {
	group_id: string;
	option_id: string;
};

function asUuidArray(value: Json): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((v): v is string => typeof v === "string");
}

export function FeatureChoicesPanel({ characterId }: { characterId: string }) {
	const { toast } = useToast();
	const [saving, setSaving] = useState(false);
	const [selectedOptionByGroupId, setSelectedOptionByGroupId] = useState<
		Record<string, string>
	>({});
	const ascendantTools = useAscendantTools();

	const { data: character } = useQuery({
		queryKey: ["feature-choice-character", characterId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("characters")
				.select("id, job, path, level, regent_overlays")
				.eq("id", characterId)
				.maybeSingle();
			if (error) throw error;
			return data;
		},
		enabled: Boolean(characterId) && !characterId.startsWith("local_"),
	});

	const characterJob = (character as CharacterExtended)?.job as
		| string
		| undefined;
	const characterPath = (character as CharacterExtended)?.path as
		| string
		| undefined;
	const characterLevel = (character as CharacterExtended)?.level as
		| number
		| undefined;

	const { data: choiceData, isLoading } = useQuery({
		queryKey: [
			"feature-choice-metadata",
			characterId,
			characterJob,
			characterPath,
			characterLevel,
		],
		queryFn: async () => {
			if (!characterJob) return null;

			const regentOverlayIds = asUuidArray(
				(character as CharacterExtended)?.regent_overlays,
			);
			const overlayIds =
				regentOverlayIds.length > 0 ? regentOverlayIds : regentOverlayIds;

			let regentNames: string[] = [];
			if (overlayIds.length > 0) {
				const { data: regents, error: regentsError } = await supabase
					.from("compendium_regents")
					.select("name")
					.in("id", overlayIds);
				if (regentsError) throw regentsError;
				regentNames = (regents || [])
					.map((r: { name: string | null }) => r.name)
					.filter((name): name is string => Boolean(name));
			}

			const eligiblePowerNames = new Set<string>();
			{
				const job = characterJob;
				const path = characterPath || "";
				const maxPowerLevel = getMaxPowerLevelForJobAtLevel(
					characterJob,
					characterLevel ?? 1,
				);

				const regentList = regentNames
					.map((name) => `"${String(name).replace(/"/g, "")}"`)
					.join(",");
				const regentFilter = regentList
					? `regent_names.ov.{${regentList}}`
					: "";
				const orParts = [
					`job_names.cs.{"${String(job).replace(/"/g, "")}"}`,
					path ? `path_names.cs.{"${String(path).replace(/"/g, "")}"}` : "",
					regentFilter,
				].filter(Boolean);

				const { data: eligibleRows, error: eligibleError } = await supabase
					.from("compendium_powers")
					.select("name")
					.or(orParts.join(","))
					.lte("power_level", maxPowerLevel);

				if (eligibleError) throw eligibleError;
				for (const row of (eligibleRows || []) as Array<{ name: string }>) {
					if (row?.name) eligiblePowerNames.add(row.name);
				}
			}

			const { data: jobRow } = await supabase
				.from("compendium_jobs")
				.select("id")
				.eq("name", characterJob)
				.maybeSingle();

			if (!jobRow) return null;

			const { data: features } = await supabase
				.from("compendium_job_features")
				.select("id, name, description, level, is_path_feature, path_id")
				.eq("job_id", jobRow.id)
				.lte("level", characterLevel);

			const featureIds = (features || [])
				.map((f: { id: string }) => f.id)
				.filter(Boolean);
			if (featureIds.length === 0) return null;

			const { data: groups } = await supabaseExtended
				.from("compendium_feature_choice_groups")
				.select("*")
				.in("feature_id", featureIds);

			const groupRows = (groups || []) as ChoiceGroupRow[];
			if (groupRows.length === 0) return null;

			const groupIds = groupRows.map((g) => g.id);

			const { data: options } = await supabaseExtended
				.from("compendium_feature_choice_options")
				.select("*")
				.in("group_id", groupIds)
				.order("name");

			const filteredOptions = ((options || []) as ChoiceOptionRow[]).filter(
				(opt) => {
					const grantedPowers = extractGrantedPowerNames(opt.grants);
					if (grantedPowers.length === 0) return true;
					return grantedPowers.every((name) => eligiblePowerNames.has(name));
				},
			);

			const { data: existingChoices } = await supabase
				.from("character_feature_choices")
				.select("group_id, option_id")
				.eq("character_id", characterId);

			const existing: CharacterChoiceRow[] = existingChoices || [];
			const chosenGroupIds = new Set(existing.map((row) => row.group_id));

			const pendingGroups = groupRows.filter((g) => !chosenGroupIds.has(g.id));
			if (pendingGroups.length === 0) return null;

			const featureById = new Map<
				string,
				{ id: string; name: string; description: string; level: number }
			>(
				(features || []).map(
					(f: {
						id: string;
						name: string;
						description: string;
						level: number;
					}) => [f.id, f],
				),
			);

			return {
				features: features || [],
				featureById,
				pendingGroups,
				options: filteredOptions,
				eligiblePowerNames,
			};
		},
		enabled:
			Boolean(characterId) &&
			Boolean(characterJob) &&
			Boolean(characterLevel) &&
			!characterId.startsWith("local_"),
	});

	const pendingGroups = choiceData?.pendingGroups || [];
	const options = choiceData?.options || [];

	const optionsByGroupId = useMemo(() => {
		const map = new Map<string, ChoiceOptionRow[]>();
		for (const opt of options) {
			const existing = map.get(opt.group_id) || [];
			existing.push(opt);
			map.set(opt.group_id, existing);
		}
		return map;
	}, [options]);

	const isReady = pendingGroups.every((g) =>
		Boolean(selectedOptionByGroupId[g.id]),
	);

	const handleCommit = async () => {
		if (!choiceData) return;
		if (!isReady) {
			toast({
				title: "Selection required",
				description: "Complete all required selections before confirming.",
				variant: "destructive",
			});
			return;
		}

		setSaving(true);
		try {
			const payloads: ChoiceOptionExecutionPayload[] = [];

			for (const group of pendingGroups) {
				const optionId = selectedOptionByGroupId[group.id];
				const option = options.find((o) => o.id === optionId);
				if (!option) continue;

				if (
					(choiceData as Record<string, unknown>)?.eligiblePowerNames instanceof
					Set
				) {
					const eligiblePowerNames = (choiceData as Record<string, unknown>)
						.eligiblePowerNames as Set<string>;
					const grantedPowers = extractGrantedPowerNames(option.grants);
					const invalidPower = grantedPowers.find(
						(name) => !eligiblePowerNames.has(name),
					);
					if (invalidPower) {
						toast({
							title: "Ineligible power",
							description: formatRegentVernacular(
								`"${invalidPower}" is not eligible for your Job / Path / ${MONARCH_LABEL} overlays.`,
							),
							variant: "destructive",
						});
						continue;
					}
				}

				payloads.push({
					characterId,
					groupId: group.id,
					featureId: group.feature_id,
					option,
					levelChosen: (character?.level as number) || 1,
					choiceKey: group.choice_key,
				});
			}

			if (payloads.length > 0) {
				await executeFeatureChoiceGrants({ payloads, ascendantTools });
			}

			toast({
				title: "Selection recorded",
				description: "The Rift has bound your chosen protocol.",
			});
		} catch {
			toast({
				title: "Selection failed",
				description: "Could not record your selection. Try again.",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	if (characterId.startsWith("local_")) {
		return null;
	}

	if (isLoading) {
		return (
			<AscendantWindow title="SELECTION PROTOCOL">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="w-4 h-4 animate-spin" />
					Scanning for required selections...
				</div>
			</AscendantWindow>
		);
	}

	if (!choiceData) return null;

	return (
		<AscendantWindow title="SELECTION PROTOCOL">
			<div className="space-y-4">
				<div className="text-sm text-muted-foreground">
					The Rift requires additional binding choices before your build is
					fully compliant.
				</div>

				{pendingGroups.map((group) => {
					const feature = choiceData.featureById.get(group.feature_id) || null;
					const groupOptions = optionsByGroupId.get(group.id) || [];
					const label = group.prompt || feature?.name || group.choice_key;

					return (
						<div
							key={group.id}
							className="p-3 rounded-lg border bg-muted/30 space-y-2"
						>
							<Label className="text-sm font-heading">
								{formatRegentVernacular(label)}
							</Label>
							<Select
								value={selectedOptionByGroupId[group.id] || ""}
								onValueChange={(value) =>
									setSelectedOptionByGroupId((prev) => ({
										...prev,
										[group.id]: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Choose an option..." />
								</SelectTrigger>
								<SelectContent>
									{groupOptions.map((opt) => (
										<SelectItem key={opt.id} value={opt.id}>
											{formatRegentVernacular(opt.name)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{(() => {
								const chosenId = selectedOptionByGroupId[group.id];
								const chosen = groupOptions.find((o) => o.id === chosenId);
								if (!chosen?.description) return null;
								return (
									<div className="text-xs text-muted-foreground">
										{formatRegentVernacular(chosen.description)}
									</div>
								);
							})()}
						</div>
					);
				})}

				<div className="flex justify-end">
					<Button
						onClick={handleCommit}
						disabled={!isReady || saving}
						className="gap-2"
					>
						{saving ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Binding...
							</>
						) : (
							<>
								<CheckCircle2 className="w-4 h-4" />
								Confirm Selection
							</>
						)}
					</Button>
				</div>
			</div>
		</AscendantWindow>
	);
}
