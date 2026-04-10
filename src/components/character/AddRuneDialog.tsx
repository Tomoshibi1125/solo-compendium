import {
	BookOpen,
	Loader2,
	Scroll,
	Search,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useCompendiumRunes, useLearnRune } from "@/hooks/useRunes";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

const RUNE_TYPE_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	martial: Zap,
	caster: Scroll,
	hybrid: Sparkles,
	utility: BookOpen,
	defensive: Shield,
	offensive: Zap,
};

export function AddRuneDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { data: runes = [], isLoading } = useCompendiumRunes(characterId);
	const learnRune = useLearnRune();
	const { toast } = useToast();
	const ascendantTools = useAscendantTools();

	const visibleRunes = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);
		if (!trimmedQuery) return runes.slice(0, 50); // Show first 50 when no query

		return runes
			.filter((rune) => {
				const name = (rune.name || "").toLowerCase();
				return name.includes(trimmedQuery);
			})
			.slice(0, 50);
	}, [runes, searchQuery]);

	const handleAdd = async (rune: (typeof runes)[0]) => {
		const displayName = formatRegentVernacular(rune.name);
		try {
			await learnRune.mutateAsync({
				characterId,
				runeId: rune.id,
				isMastered: false,
			});

			toast({
				title: "Rune Discovered",
				description: `${displayName} has been added to your rune knowledge. You can now absorb it.`,
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`Discovered Rune: ${displayName}`,
					"Acquired",
					"SA",
				)
				.catch(console.error);

			onOpenChange(false);
			setSearchQuery("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to add rune.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Discover Rune</DialogTitle>
					<DialogDescription>
						Search and discover runes from the compendium to add to your
						knowledge
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search runes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleRunes.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No runes found matching your search."
									: "No runes available."}
							</div>
						) : (
							visibleRunes.map((rune) => {
								const TypeIcon = RUNE_TYPE_ICONS[rune.rune_type] || BookOpen;
								return (
									<div
										key={rune.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<TypeIcon className="w-4 h-4 text-primary" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(rune.name)}
													</span>
													<Badge
														variant="outline"
														className="text-xs capitalize"
													>
														{rune.rune_type}
													</Badge>
													<Badge variant="secondary" className="text-xs">
														Level {rune.rune_level}
													</Badge>
													<Badge variant="outline" className="text-xs">
														{rune.rarity}
													</Badge>
												</div>
												{rune.description && (
													<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
														{formatRegentVernacular(rune.description)}
													</p>
												)}
											</div>
											<Button
												size="sm"
												onClick={() => handleAdd(rune)}
												disabled={learnRune.isPending}
											>
												Add
											</Button>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
