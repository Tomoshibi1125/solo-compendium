import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, Sparkles, Sword, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import { cn } from "@/lib/utils";

interface AbilityAccessPreviewProps {
	jobName: string | null | undefined;
	pathName?: string | null;
	characterLevel?: number;
	/** When true, show only the delta granted by the path (job-only baseline excluded). */
	pathDeltaOnly?: boolean;
	title?: string;
	subtitle?: string;
	className?: string;
}

export function AbilityAccessPreview({
	jobName,
	pathName = null,
	characterLevel = 1,
	pathDeltaOnly = false,
	title = "Grants Access To",
	subtitle,
	className,
}: AbilityAccessPreviewProps) {
	const enabled = !!jobName;

	const query = useQuery({
		queryKey: [
			"ability-access-preview",
			jobName ?? "",
			pathName ?? "",
			characterLevel,
			pathDeltaOnly,
		],
		queryFn: async () => {
			if (!jobName) {
				return { cantrips: [], spells: [], powers: [], techniques: [] };
			}
			const [spellEntries, powerEntries, techniqueEntries] = await Promise.all([
				listLearnableSpells({
					jobName,
					pathName,
					characterLevel,
				}),
				listLearnablePowers({
					jobName,
					pathName,
					characterLevel,
				}),
				listLearnableTechniques({
					jobName,
					pathName,
					characterLevel,
				}),
			]);

			if (!pathDeltaOnly || !pathName) {
				return {
					cantrips: spellEntries.filter((s) => (s.power_level ?? 0) === 0),
					spells: spellEntries.filter((s) => (s.power_level ?? 0) > 0),
					powers: powerEntries,
					techniques: techniqueEntries,
				};
			}

			// Delta mode: compute job-only baseline, then subtract from job+path.
			const [baseSpells, basePowers, baseTechniques] = await Promise.all([
				listLearnableSpells({ jobName, pathName: null, characterLevel }),
				listLearnablePowers({ jobName, pathName: null, characterLevel }),
				listLearnableTechniques({ jobName, pathName: null, characterLevel }),
			]);
			const baseSpellIds = new Set(baseSpells.map((s) => s.id));
			const basePowerIds = new Set(basePowers.map((p) => p.id));
			const baseTechniqueIds = new Set(baseTechniques.map((t) => t.id));
			return {
				cantrips: spellEntries.filter(
					(s) => (s.power_level ?? 0) === 0 && !baseSpellIds.has(s.id),
				),
				spells: spellEntries.filter(
					(s) => (s.power_level ?? 0) > 0 && !baseSpellIds.has(s.id),
				),
				powers: powerEntries.filter((p) => !basePowerIds.has(p.id)),
				techniques: techniqueEntries.filter((t) => !baseTechniqueIds.has(t.id)),
			};
		},
		enabled,
		staleTime: 60_000,
	});

	if (!enabled) return null;

	const {
		cantrips = [],
		spells = [],
		powers = [],
		techniques = [],
	} = query.data ?? {};
	const totalCount =
		cantrips.length + spells.length + powers.length + techniques.length;

	if (query.isLoading) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="text-sm">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	if (totalCount === 0) {
		return null;
	}

	const previewList = (entries: { id: string; name: string }[]): string => {
		if (entries.length === 0) return "";
		const sample = entries.slice(0, 3).map((e) => e.name);
		const remainder = entries.length - sample.length;
		return remainder > 0
			? `${sample.join(", ")}, +${remainder} more`
			: sample.join(", ");
	};

	const rows: Array<{
		kind: string;
		icon: React.ComponentType<{ className?: string }>;
		count: number;
		preview: string;
	}> = [
		{
			kind: "Cantrips",
			icon: Wand2,
			count: cantrips.length,
			preview: previewList(cantrips),
		},
		{
			kind: "Spells",
			icon: BookOpen,
			count: spells.length,
			preview: previewList(spells),
		},
		{
			kind: "Powers",
			icon: Sparkles,
			count: powers.length,
			preview: previewList(powers),
		},
		{
			kind: "Techniques",
			icon: Sword,
			count: techniques.length,
			preview: previewList(techniques),
		},
	].filter((row) => row.count > 0);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="text-sm flex items-center gap-2">
					{title}
					<Badge variant="outline" className="text-xs">
						{totalCount} entries
					</Badge>
				</CardTitle>
				{subtitle && (
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				)}
			</CardHeader>
			<CardContent className="space-y-2">
				{rows.map((row) => {
					const Icon = row.icon;
					return (
						<div
							key={row.kind}
							className="flex items-start gap-3 p-2 rounded border bg-muted/20"
						>
							<Icon className="w-4 h-4 text-primary mt-0.5" />
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-0.5">
									<span className="font-medium text-sm">{row.kind}</span>
									<Badge variant="secondary" className="text-xs">
										{row.count}
									</Badge>
								</div>
								<p className="text-xs text-muted-foreground truncate">
									{row.preview}
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
