import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { JobFeature } from "@/types/compendium";

interface WizardChoiceEngineProps {
	newFeatures: JobFeature[];
	onChoicesUpdate: (
		isReady: boolean,
		selectedOptions: Record<string, any>,
	) => void;
}

export const WizardChoiceEngine = ({
	newFeatures,
	onChoicesUpdate,
}: WizardChoiceEngineProps) => {
	const [selectedOptionByGroupId, setSelectedOptionByGroupId] = useState<
		Record<string, string>
	>({});

	const { data: choiceData, isLoading } = useQuery({
		queryKey: [
			"wizard-feature-choices",
			newFeatures.map((f) => f.id).join(","),
		],
		queryFn: async () => {
			const featureIds = newFeatures.map((f) => f.id).filter(Boolean);
			if (featureIds.length === 0) return null;

			// Get Choice Groups for new features
			const { data: groups } = await supabase
				.from("compendium_feature_choice_groups" as never)
				.select("*")
				.in("feature_id", featureIds);

			const groupRows = (groups || []) as any[];
			if (groupRows.length === 0) return null;

			const groupIds = groupRows.map((g) => g.id);

			// Get Choice Options for those Groups
			const { data: options } = await supabase
				.from("compendium_feature_choice_options" as never)
				.select("*")
				.in("group_id", groupIds)
				.order("name");

			const featureById = new Map<string, JobFeature>(
				newFeatures.map((f) => [f.id!, f]),
			);

			return {
				groups: groupRows,
				options: (options || []) as any[],
				featureById,
			};
		},
		enabled: newFeatures.length > 0,
	});

	const groups = choiceData?.groups || [];
	const options = choiceData?.options || [];

	const optionsByGroupId = useMemo(() => {
		const map = new Map<string, any[]>();
		for (const opt of options) {
			const existing = map.get(opt.group_id) || [];
			existing.push(opt);
			map.set(opt.group_id, existing);
		}
		return map;
	}, [options]);

	const isReady =
		groups.length === 0 ||
		groups.every((g) => Boolean(selectedOptionByGroupId[g.id]));

	useEffect(() => {
		// Provide the selected option rows up to parent LevelUpWizard
		if (choiceData) {
			const selectedPayloads: Record<string, any> = {};
			for (const [groupId, optionId] of Object.entries(
				selectedOptionByGroupId,
			)) {
				const opt = options.find((o) => o.id === optionId);
				const group = groups.find((g) => g.id === groupId);
				if (opt && group) {
					selectedPayloads[groupId] = {
						option: opt,
						featureId: group.feature_id,
						choiceKey: group.choice_key,
					};
				}
			}
			onChoicesUpdate(isReady, selectedPayloads);
		} else {
			onChoicesUpdate(true, {}); // No choices needed
		}
	}, [
		choiceData,
		isReady,
		selectedOptionByGroupId,
		options,
		onChoicesUpdate,
		groups.find,
	]);

	if (isLoading) {
		return (
			<div className="text-sm text-muted-foreground animate-pulse font-heading">
				Scanning abilities for configurable endpoints...
			</div>
		);
	}

	if (!choiceData || groups.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4 mt-6 border-t border-resurge/20 pt-4">
			<h4 className="font-heading font-semibold text-resurge mb-2 flex items-center gap-2">
				<Cpu className="w-5 h-5" />
				REQUIRED ABILITY BINDINGS
			</h4>
			<p className="text-xs text-muted-foreground font-heading mb-4 italic">
				Select configurations to correctly compile your combat doctrine.
			</p>
			{groups.map((group, idx) => {
				const feature = choiceData.featureById.get(group.feature_id) || null;
				const groupOptions = optionsByGroupId.get(group.id) || [];
				const label = group.prompt || feature?.name || group.choice_key;

				return (
					<motion.div
						key={group.id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: idx * 0.1 }}
						className="p-4 rounded-lg border bg-resurge/5 border-resurge/20 space-y-3 shadow-inner"
					>
						<Label className="text-sm font-resurge text-resurge/90 tracking-wider">
							{formatRegentVernacular(label).toUpperCase()}
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
							<SelectTrigger className="border-resurge/30 focus:border-resurge bg-background/80 hover:bg-background transition-colors">
								<SelectValue placeholder="Select configuration..." />
							</SelectTrigger>
							<SelectContent className="bg-background border-resurge/30">
								{groupOptions.map((opt) => (
									<SelectItem
										key={opt.id}
										value={opt.id}
										className="focus:bg-resurge/10 focus:text-resurge"
									>
										{formatRegentVernacular(opt.name)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<AnimatePresence mode="wait">
							{(() => {
								const chosenId = selectedOptionByGroupId[group.id];
								const chosen = groupOptions.find((o) => o.id === chosenId);
								if (!chosen?.description) return null;
								return (
									<motion.div
										key={`${group.id}-desc-${chosen.id}`}
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="overflow-hidden"
									>
										<div className="text-xs text-muted-foreground bg-black/20 p-3 rounded border border-resurge/10 leading-relaxed font-heading">
											{formatRegentVernacular(chosen.description)}
										</div>
									</motion.div>
								);
							})()}
						</AnimatePresence>
					</motion.div>
				);
			})}
		</div>
	);
};
