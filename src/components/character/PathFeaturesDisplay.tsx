import { useQuery } from "@tanstack/react-query";
import { Compass, Lock, Sparkles } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCharacter } from "@/hooks/useCharacters";
import { cn } from "@/lib/utils";
import type { DetailData } from "@/types/character";

interface PathFeaturesDisplayProps {
	characterId: string;
	className?: string;
	onSelectDetail?: (detail: DetailData) => void;
}

const normalize = (value: string | null | undefined): string =>
	(value ?? "").trim().toLowerCase();

export function PathFeaturesDisplay({
	characterId,
	className,
	onSelectDetail,
}: PathFeaturesDisplayProps) {
	const { data: character } = useCharacter(characterId);

	const { data: paths } = useQuery({
		queryKey: ["static-paths-for-display"],
		queryFn: async () => {
			const module = await import("@/data/compendium/paths");
			return module.paths;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!character?.path,
	});

	const characterLevel = character?.level ?? 1;
	const characterPathKey = normalize(character?.path);
	const path = paths?.find(
		(p) => normalize(p.name) === characterPathKey || p.id === character?.path,
	);

	if (!character?.path || !path) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<Compass className="w-4 h-4" />
						Path Features
					</CardTitle>
					<CardDescription>
						No path selected. Choose a path at the level your job grants it
						(typically level 3).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-6 text-muted-foreground">
						<Lock className="w-10 h-10 mx-auto mb-3 opacity-50" />
						<p className="text-sm">No path features unlocked yet.</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const unlocked = path.features
		.filter((feature) => feature.level <= characterLevel)
		.slice()
		.sort((a, b) => a.level - b.level);
	const upcoming = path.features
		.filter((feature) => feature.level > characterLevel)
		.slice()
		.sort((a, b) => a.level - b.level)
		.slice(0, 3);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Compass className="w-4 h-4" />
					{path.name}
					<Badge variant="outline" className="text-xs ml-auto">
						Tier {path.tier}
					</Badge>
				</CardTitle>
				<CardDescription className="text-xs">
					Path features through level {characterLevel}.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					{unlocked.length === 0 ? (
						<p className="text-sm text-muted-foreground italic">
							No path features at this level yet.
						</p>
					) : (
						unlocked.map((feature) => (
							<button
								key={`${feature.name}-${feature.level}`}
								type="button"
								className="w-full text-left p-3 border rounded-lg bg-background hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
								onClick={() =>
									onSelectDetail?.({
										title: feature.name,
										description: feature.description,
										payload: { level: feature.level },
									})
								}
							>
								<div className="flex items-center gap-2 mb-1 flex-wrap">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="font-medium">{feature.name}</span>
									<Badge variant="outline" className="text-xs">
										Lvl {feature.level}
									</Badge>
								</div>
								<ExpandableText className="text-xs text-muted-foreground" lines={2}>
									<AutoLinkText text={feature.description} />
								</ExpandableText>
							</button>
						))
					)}
				</div>
				{upcoming.length > 0 && (
					<div className="space-y-2 border-t pt-3">
						<h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Upcoming
						</h4>
						{upcoming.map((feature) => (
							<div
								key={`upcoming-${feature.name}-${feature.level}`}
								className="flex items-center gap-2 p-2 rounded border-dashed border bg-muted/20 opacity-70"
							>
								<Lock className="w-3 h-3 text-muted-foreground" />
								<span className="text-sm">{feature.name}</span>
								<Badge variant="outline" className="text-xs ml-auto">
									Lvl {feature.level}
								</Badge>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
