import { Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	type FeatureModifier,
	useApplyHomebrewFeature,
	useCharacterFeatures,
	useRemoveCharacterFeature,
} from "@/hooks/useCharacterFeatures";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import type { CustomModifierType } from "@/lib/customModifiers";

interface HomebrewFeatureApplicatorProps {
	characterId: string;
}

function parseHomebrewModifiers(
	data: Record<string, unknown>,
): FeatureModifier[] {
	const modifiers: FeatureModifier[] = [];
	const effects = data.effects as Record<string, unknown> | undefined;
	if (!effects) return modifiers;

	for (const [key, value] of Object.entries(effects)) {
		if (typeof value === "string") {
			// Parse "+5" or "1d4" patterns
			const numMatch = value.match(/^[+-]?(\d+)$/);
			const dieMatch = value.match(/^(\d+d\d+)$/i);

			if (numMatch) {
				const numValue = parseInt(value, 10);
				const type = mapEffectKeyToModifierType(key);
				if (type) {
					modifiers.push({
						type,
						value: numValue,
						source: (data.source as string) || "Homebrew",
					});
				}
			} else if (dieMatch) {
				const type = mapEffectKeyToModifierType(key);
				if (type) {
					modifiers.push({
						type,
						value: 0,
						die: dieMatch[1],
						source: (data.source as string) || "Homebrew",
					});
				}
			}
		} else if (typeof value === "number") {
			const type = mapEffectKeyToModifierType(key);
			if (type) {
				modifiers.push({
					type,
					value,
					source: (data.source as string) || "Homebrew",
				});
			}
		}
	}

	return modifiers;
}

function mapEffectKeyToModifierType(key: string): CustomModifierType | null {
	const keyLower = key.toLowerCase();
	if (keyLower.includes("speed")) return "speed";
	if (keyLower.includes("damage")) return "damage";
	if (keyLower.includes("attack")) return "attack";
	if (keyLower.includes("ac") || keyLower.includes("armor")) return "ac";
	if (keyLower.includes("initiative")) return "initiative";
	if (keyLower.includes("save") || keyLower.includes("saving")) return "save";
	if (keyLower.includes("skill")) return "skill";
	return null;
}

function formatModifier(mod: FeatureModifier): string {
	if (mod.die) return `+${mod.die} ${mod.type}`;
	const sign = mod.value >= 0 ? "+" : "";
	return `${sign}${mod.value} ${mod.type}`;
}

export function HomebrewFeatureApplicator({
	characterId,
}: HomebrewFeatureApplicatorProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const { data: homebrewItems = [] } = usePublishedHomebrew([
		"job",
		"path",
		"relic",
		"spell",
		"item",
	]);
	const { data: appliedFeatures = [] } = useCharacterFeatures(characterId);
	const applyFeature = useApplyHomebrewFeature();
	const removeFeature = useRemoveCharacterFeature();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	const filteredItems = homebrewItems.filter(
		(item) =>
			item.name.toLowerCase().includes(search.toLowerCase()) ||
			item.description?.toLowerCase().includes(search.toLowerCase()),
	);

	const appliedHomebrewIds = new Set(
		appliedFeatures.filter((f) => f.homebrew_id).map((f) => f.homebrew_id),
	);

	const handleApply = async (item: (typeof homebrewItems)[0]) => {
		const modifiers = parseHomebrewModifiers(
			item.data as Record<string, unknown>,
		);
		await applyFeature.mutateAsync({
			characterId,
			homebrewId: item.id,
			name: item.name,
			description: item.description || "",
			modifiers,
		});
		playerTools
			.trackCustomFeatureUsage(
				characterId,
				`Applied Homebrew: ${item.name}`,
				item.description || "",
				"5e",
			)
			.catch(console.error);
	};

	const handleRemove = async (featureId: string) => {
		await removeFeature.mutateAsync({ featureId, characterId });
		playerTools
			.trackCustomFeatureUsage(
				characterId,
				"Removed Homebrew Feature",
				"Removed custom trait",
				"5e",
			)
			.catch(console.error);
	};

	const homebrewFeatures = appliedFeatures.filter((f) => f.homebrew_id);

	return (
		<div data-testid="homebrew-features-panel">
			<SystemWindow title="HOMEBREW FEATURES">
				<div className="space-y-3">
					{homebrewFeatures.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							No homebrew features applied.
						</p>
					) : (
						homebrewFeatures.map((feature) => (
							<div
								key={feature.id}
								className="flex items-start justify-between gap-2 p-3 rounded-lg bg-muted/30 border border-border/50"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<Sparkles className="w-4 h-4 text-primary shrink-0" />
										<span className="font-heading font-semibold text-sm truncate">
											{feature.name}
										</span>
									</div>
									{feature.description && (
										<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
											{feature.description}
										</p>
									)}
									{feature.modifiers && feature.modifiers.length > 0 && (
										<div className="flex flex-wrap gap-1 mt-2">
											{feature.modifiers.map((mod, _i) => (
												<Badge
													key={JSON.stringify(mod)}
													variant="secondary"
													className="text-xs"
												>
													{formatModifier(mod)}
												</Badge>
											))}
										</div>
									)}
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleRemove(feature.id)}
									className="shrink-0 text-destructive hover:text-destructive"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						))
					)}

					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="w-full gap-2"
								data-testid="homebrew-feature-add"
							>
								<Plus className="w-4 h-4" />
								Apply Homebrew Feature
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
							<DialogHeader>
								<DialogTitle>Apply Homebrew Feature</DialogTitle>
								<DialogDescription>
									Browse published homebrew content and apply features to your
									character.
								</DialogDescription>
							</DialogHeader>

							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search homebrew..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-9"
									data-testid="homebrew-feature-search"
								/>
							</div>

							<div className="flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[50vh]">
								{filteredItems.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-8">
										No published homebrew found.
									</p>
								) : (
									filteredItems.map((item) => {
										const isApplied = appliedHomebrewIds.has(item.id);
										const modifiers = parseHomebrewModifiers(
											item.data as Record<string, unknown>,
										);

										return (
											<div
												key={item.id}
												className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
											>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-heading font-semibold text-sm">
																{item.name}
															</span>
															<Badge variant="outline" className="text-xs">
																{item.content_type}
															</Badge>
														</div>
														{item.description && (
															<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
																{item.description}
															</p>
														)}
														{modifiers.length > 0 && (
															<div className="flex flex-wrap gap-1 mt-2">
																{modifiers.map((mod, _i) => (
																	<Badge
																		key={JSON.stringify(mod)}
																		variant="secondary"
																		className="text-xs"
																	>
																		{formatModifier(mod)}
																	</Badge>
																))}
															</div>
														)}
													</div>
													<Button
														variant={isApplied ? "secondary" : "default"}
														size="sm"
														disabled={isApplied || applyFeature.isPending}
														onClick={() => handleApply(item)}
														className="shrink-0"
														data-testid={`homebrew-apply-${item.id}`}
													>
														{isApplied ? "Applied" : "Apply"}
													</Button>
												</div>
											</div>
										);
									})
								)}
							</div>

							<DialogFooter>
								<Button variant="outline" onClick={() => setOpen(false)}>
									Close
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</SystemWindow>
		</div>
	);
}
