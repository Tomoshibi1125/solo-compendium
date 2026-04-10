import { Loader2, Search, Sword } from "lucide-react";
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
import { useCompendiumTechniques, useTechniques } from "@/hooks/useTechniques";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

export function AddTechniqueDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { data: techniques = [], isLoading } = useCompendiumTechniques();
	const { addTechnique } = useTechniques(characterId);
	const { toast } = useToast();

	const visibleTechniques = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);
		if (!trimmedQuery) return techniques.slice(0, 50);

		return techniques
			.filter((tech) => {
				const name = (tech.name || "").toLowerCase();
				const type = (tech.technique_type || "").toLowerCase();
				return name.includes(trimmedQuery) || type.includes(trimmedQuery);
			})
			.slice(0, 50);
	}, [techniques, searchQuery]);

	const handleAdd = async (tech: (typeof techniques)[0]) => {
		const displayName = formatRegentVernacular(tech.name);
		try {
			await addTechnique.mutateAsync(tech.id);

			toast({
				title: "Technique Learned",
				description: `${displayName} has been added to your techniques.`,
			});

			onOpenChange(false);
			setSearchQuery("");
		} catch (error: unknown) {
			console.error("Add technique error:", error);
			const message =
				error instanceof Error ? error.message : "Failed to add technique.";
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Discover Technique</DialogTitle>
					<DialogDescription>
						Search and learn techniques from the compendium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search techniques..."
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
						) : visibleTechniques.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No techniques found matching your search."
									: "No techniques available."}
							</div>
						) : (
							visibleTechniques.map((tech) => (
								<div
									key={tech.id}
									className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1 flex-wrap">
												<Sword className="w-4 h-4 text-primary" />
												<span className="font-heading font-semibold">
													{formatRegentVernacular(tech.name)}
												</span>
												{tech.technique_type && (
													<Badge
														variant="outline"
														className="text-xs capitalize"
													>
														{tech.technique_type}
													</Badge>
												)}
												{tech.level_requirement && (
													<Badge variant="secondary" className="text-xs">
														Level {tech.level_requirement}
													</Badge>
												)}
											</div>
											{tech.description && (
												<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
													{formatRegentVernacular(tech.description)}
												</p>
											)}
										</div>
										<Button
											size="sm"
											onClick={() => handleAdd(tech)}
											disabled={addTechnique.isPending}
										>
											Add
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
