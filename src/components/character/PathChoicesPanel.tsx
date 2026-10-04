import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCharacterFeatures } from "@/hooks/useCharacterFeatures";
import { useCharacter } from "@/hooks/useCharacters";
import { useStaticPathCatalog } from "@/hooks/useStaticPathCatalog";
import {
	insertCharacterFeature,
	reconcilePathSpellGrants,
} from "@/lib/characterCreation";
import { getErrorMessage } from "@/lib/errorHandling";
import {
	buildPathOptionFeatureId,
	findPathIn,
	getPathOptionGroups,
	pathOptionFeatureName,
} from "@/lib/pathLedger";

interface PathChoicesPanelProps {
	characterId: string;
	readOnly?: boolean;
}

/**
 * Lists the named Path options the character still owes (RA-23) and records
 * each pick as its own feature entry. It covers every flow that grants a Path
 * feature: creation, level-up, the quick wizard, and imports.
 */
export function PathChoicesPanel({
	characterId,
	readOnly = false,
}: PathChoicesPanelProps) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { data: character } = useCharacter(characterId);
	const hasPath = Boolean(character?.path || character?.path_id);
	const { data: catalog } = useStaticPathCatalog(hasPath);
	const { data: features = [] } = useCharacterFeatures(characterId);
	const [selected, setSelected] = useState<Record<string, string[]>>({});
	const [saving, setSaving] = useState(false);

	const path = useMemo(
		() =>
			hasPath
				? findPathIn(catalog, {
						id: character?.path_id,
						name: character?.path,
					})
				: null,
		[catalog, character?.path, character?.path_id, hasPath],
	);
	const openGroups = useMemo(
		() =>
			getPathOptionGroups(
				path,
				character?.level ?? 1,
				features as Array<{ name: string; feature_id?: string | null }>,
			).filter((group) => group.chosen.length < group.required),
		[character?.level, features, path],
	);

	if (!path || openGroups.length === 0) return null;

	const remainingFor = (source: string) => {
		const group = openGroups.find((candidate) => candidate.source === source);
		return group ? group.required - group.chosen.length : 0;
	};
	const isReady = openGroups.every(
		(group) =>
			(selected[group.source]?.length ?? 0) === remainingFor(group.source),
	);

	const toggle = (source: string, option: string) => {
		setSelected((current) => {
			const picks = current[source] ?? [];
			if (picks.includes(option)) {
				return {
					...current,
					[source]: picks.filter((name) => name !== option),
				};
			}
			if (picks.length >= remainingFor(source)) return current;
			return { ...current, [source]: [...picks, option] };
		});
	};

	const handleCommit = async () => {
		if (readOnly || !isReady) return;
		setSaving(true);
		try {
			for (const group of openGroups) {
				for (const optionName of selected[group.source] ?? []) {
					const option = group.options.find(
						(candidate) => candidate.name === optionName,
					);
					if (!option) continue;
					await insertCharacterFeature(characterId, {
						feature_id: buildPathOptionFeatureId(
							path.id,
							group.source,
							option.name,
						),
						name: pathOptionFeatureName(group.source, option.name),
						source: `Path Choice: ${path.name}`,
						level_acquired: group.level,
						description: option.description,
						is_active: true,
					});
				}
			}
			// Options can grant spells; a swapped option's spells are removed.
			await reconcilePathSpellGrants(
				characterId,
				{ id: path.id, name: path.name },
				character?.level ?? 1,
			);
			setSelected({});
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["character-features", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-spells", characterId],
				}),
			]);
			toast({ title: "Path choices recorded" });
		} catch (error) {
			toast({
				title: "Couldn't record Path choices",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<AscendantWindow title="PATH SELECTIONS">
			<div className="space-y-4">
				<p className="text-sm text-muted-foreground">
					{path.name} asks you to choose. Each pick is saved as its own feature.
				</p>
				{openGroups.map((group) => {
					const remaining = remainingFor(group.source);
					const picks = selected[group.source] ?? [];
					return (
						<fieldset
							key={group.source}
							className="p-3 rounded-lg border bg-muted/30 space-y-2"
						>
							<legend className="text-sm font-heading px-1">
								{group.source}: choose {remaining} ({picks.length}/{remaining})
							</legend>
							<div className="grid gap-2">
								{group.options.map((option) => {
									const alreadyChosen = group.chosen.includes(option.name);
									const isPicked = picks.includes(option.name);
									return (
										<button
											key={option.name}
											type="button"
											aria-pressed={alreadyChosen || isPicked}
											disabled={
												readOnly ||
												alreadyChosen ||
												(!isPicked && picks.length >= remaining)
											}
											onClick={() => toggle(group.source, option.name)}
											className={`text-left rounded-md border p-2 transition-colors disabled:opacity-60 ${
												alreadyChosen || isPicked
													? "border-primary bg-primary/10"
													: "border-border hover:border-primary/60"
											}`}
										>
											<span className="block text-sm font-semibold">
												{option.name}
												{alreadyChosen ? " (chosen)" : ""}
											</span>
											<span className="block text-xs text-muted-foreground">
												{option.description}
											</span>
										</button>
									);
								})}
							</div>
						</fieldset>
					);
				})}
				<div className="flex justify-end">
					<Button
						onClick={handleCommit}
						disabled={readOnly || !isReady || saving}
						className="gap-2"
					>
						{saving ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<CheckCircle2 className="w-4 h-4" />
								Confirm Path choices
							</>
						)}
					</Button>
				</div>
			</div>
		</AscendantWindow>
	);
}
