import {
	ChevronDown,
	ChevronUp,
	Crown,
	Dna,
	Lock,
	Shield,
	Sparkles,
	Star,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useCharacterSovereign } from "@/hooks/useSavedSovereigns";
import { useSovereignReady } from "@/hooks/useSovereignReady";
import type { FusionAbility } from "@/lib/geminiProtocol";
import { readAttachedSovereignV2 } from "@/lib/sovereign/sovereignRuntime";
import { cn } from "@/lib/utils";

interface SovereignOverlayPanelProps {
	characterId: string;
}

interface DisplayAbility {
	id: string;
	name: string;
	description: string;
	level: number;
	actionType: string | null;
	recharge: string | null;
	isCapstone: boolean;
	ancestry: string[];
	locked: boolean;
}

function AbilityCard({
	ability,
	index,
}: {
	ability: DisplayAbility;
	index: number;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<button
			type="button"
			className={cn(
				"w-full text-left rounded-lg border p-3 transition-colors cursor-pointer",
				ability.isCapstone
					? "border-resurge-violet/60 bg-resurge-violet/8"
					: "border-border bg-muted/20 hover:border-resurge-violet/30",
				ability.locked && "opacity-70",
			)}
			onClick={() => setExpanded(!expanded)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-xs font-mono text-muted-foreground/60 shrink-0">
						{String(index + 1).padStart(2, "0")}
					</span>
					{ability.isCapstone && (
						<Star className="w-3 h-3 text-resurge-violet shrink-0" />
					)}
					{ability.locked && <Lock className="w-3 h-3 shrink-0" />}
					<p className="text-sm font-semibold truncate">{ability.name}</p>
				</div>
				<div className="flex items-center gap-1.5 shrink-0">
					<Badge variant="outline" className="text-[10px] h-5 px-1.5">
						L{ability.level}
					</Badge>
					{ability.isCapstone && (
						<Badge className="text-[10px] h-5 px-1.5 bg-resurge-violet/20 text-resurge-violet border border-resurge-violet/40">
							Capstone
						</Badge>
					)}
					{expanded ? (
						<ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
					) : (
						<ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
					)}
				</div>
			</div>

			{expanded && (
				<div className="mt-2 space-y-2">
					<div className="flex flex-wrap gap-1.5">
						{ability.actionType && (
							<Badge variant="secondary" className="text-[10px]">
								{ability.actionType}
							</Badge>
						)}
						{ability.recharge && (
							<Badge variant="outline" className="text-[10px]">
								{ability.recharge}
							</Badge>
						)}
						{ability.ancestry.map((source) => (
							<Badge key={source} variant="outline" className="text-[10px]">
								{source}
							</Badge>
						))}
					</div>
					<p className="text-xs text-muted-foreground leading-relaxed">
						{ability.description}
					</p>
				</div>
			)}
		</button>
	);
}

const legacyAbility = (
	ability: FusionAbility,
	index: number,
	level: number,
): DisplayAbility => ({
	id: `legacy-${ability.name}-${index}`,
	name: ability.name,
	description: ability.description,
	level: ability.level,
	actionType: ability.action_type ?? null,
	recharge: ability.recharge ?? null,
	isCapstone: Boolean(ability.is_capstone),
	ancestry: ability.origin_sources ?? [],
	locked: ability.level > level,
});

export function SovereignOverlayPanel({
	characterId,
}: SovereignOverlayPanelProps) {
	const { data: sovereign, isLoading } = useCharacterSovereign(characterId);
	const { data: character } = useCharacter(characterId);
	const ready = useSovereignReady(characterId);
	const navigate = useNavigate();
	const { toast } = useToast();
	const definition = useMemo(
		() => readAttachedSovereignV2(character?.gemini_state),
		[character?.gemini_state],
	);

	// One-time "fusion ready" toast per character per session (the on-sheet CTA
	// below is the persistent notification).
	const notifiedRef = useRef(false);
	useEffect(() => {
		if (!ready.isReady || notifiedRef.current) return;
		notifiedRef.current = true;
		const key = `sovereign-ready-notified:${characterId}`;
		if (typeof window !== "undefined") {
			if (window.sessionStorage.getItem(key)) return;
			window.sessionStorage.setItem(key, "1");
		}
		toast({
			title: "Sovereign fusion ready",
			description:
				"You've unlocked two Regents — forge your permanent Sovereign overlay.",
			duration: 6000,
		});
	}, [ready.isReady, characterId, toast]);

	if (isLoading) return null;

	if (!sovereign) {
		return (
			<AscendantWindow title="SOVEREIGN OVERLAY">
				{ready.isReady ? (
					<div className="space-y-3 py-1">
						<div className="flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-resurge-violet shrink-0" />
							<p className="text-sm font-semibold text-resurge-violet">
								Your Sovereign fusion is ready.
							</p>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							You've unlocked two Regents. Forge a permanent Sovereign overlay
							from your Job, Path, and Regent pair and apply it to this sheet.
						</p>
						<Button
							size="sm"
							onClick={() => navigate("/compendium?tab=sovereign")}
						>
							<Dna className="w-4 h-4 mr-2" />
							Begin Fusion
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-3 text-muted-foreground text-sm py-2">
						<Lock className="w-4 h-4 shrink-0" />
						<p>
							No Sovereign overlay locked in. Unlock two Regents to begin the
							fusion protocol.
						</p>
					</div>
				)}
			</AscendantWindow>
		);
	}

	const level = character?.level ?? 1;
	const abilities: DisplayAbility[] = definition
		? definition.abilities
				.map((ability) => ({
					id: ability.id,
					name: ability.name,
					description: ability.description,
					level: ability.level,
					actionType: ability.action_type,
					recharge: ability.recharge,
					isCapstone: ability.is_capstone,
					ancestry: ability.ancestry,
					locked: ability.level > level,
				}))
				.sort((a, b) => a.level - b.level)
		: (sovereign.abilities || [])
				.map((ability, index) => legacyAbility(ability, index, level))
				.sort((a, b) => a.level - b.level);
	const capstoneCount = abilities.filter((ability) => ability.isCapstone).length;
	const identityName = definition?.identity.name ?? sovereign.name;
	const identityTitle = definition?.identity.title ?? sovereign.title;
	const description = definition?.description ?? sovereign.description;
	const doctrine = definition?.combat_doctrine ?? sovereign.fusion_description;
	const theme = definition?.fusion_theme ?? sovereign.fusion_theme;

	return (
		<AscendantWindow title="SOVEREIGN OVERLAY">
			<div className="space-y-3">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
					<div>
						<div className="flex items-center gap-2">
							<Crown className="w-5 h-5 text-resurge-violet" />
							<h3 className="text-lg font-bold">{identityName}</h3>
						</div>
						<p className="text-sm text-muted-foreground italic mt-0.5">
							{identityTitle}
							{definition?.identity.epithet
								? ` — ${definition.identity.epithet}`
								: ""}
						</p>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{theme && (
							<Badge className="bg-resurge-violet/20 text-resurge-violet border-resurge-violet/40 border">
								{theme}
							</Badge>
						)}
						{definition ? (
							<Badge variant="outline">v2 • {abilities.length}/8 milestones</Badge>
						) : (
							<>
								{sovereign.power_multiplier && (
									<Badge variant="outline">⚡ {sovereign.power_multiplier}</Badge>
								)}
								{sovereign.fusion_stability && (
									<Badge variant="outline">🔗 {sovereign.fusion_stability}</Badge>
								)}
							</>
						)}
					</div>
				</div>

				{description && (
					<p className="text-sm text-muted-foreground leading-relaxed">
						{description}
					</p>
				)}

				{doctrine && (
					<>
						<Separator />
						<div>
							<div className="flex items-center gap-2 mb-1.5">
								<Shield className="w-3.5 h-3.5 text-resurge-violet" />
								<p className="text-xs font-semibold text-resurge-violet tracking-wider uppercase">
									Combat Doctrine
								</p>
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{doctrine}
							</p>
						</div>
					</>
				)}

				{definition && (
					<>
						<Separator />
						<div className="grid gap-2 sm:grid-cols-3 text-xs">
							<div>
								<span className="text-muted-foreground">Traits</span>
								<p className="font-semibold">{definition.traits.length}</p>
							</div>
							<div>
								<span className="text-muted-foreground">Affinities</span>
								<p className="font-semibold">{definition.affinities.length}</p>
							</div>
							<div>
								<span className="text-muted-foreground">Resources</span>
								<p className="font-semibold">{definition.resources.length}</p>
							</div>
						</div>
					</>
				)}

				<Separator />

				<div>
					<div className="flex items-center justify-between gap-2 mb-3">
						<div className="flex items-center gap-2">
							<Zap className="w-3.5 h-3.5 text-resurge-violet" />
							<p className="text-xs font-semibold text-resurge-violet tracking-wider uppercase">
								Milestone Ladder ({abilities.length})
							</p>
						</div>
						{definition && (
							<Badge variant={capstoneCount === 2 ? "secondary" : "destructive"}>
								{capstoneCount}/2 capstones
							</Badge>
						)}
					</div>
					<ScrollArea className="max-h-[460px] pr-2">
						<div className="space-y-2">
							{abilities.map((ability, index) => (
								<AbilityCard
									key={ability.id}
									ability={ability}
									index={index}
								/>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
		</AscendantWindow>
	);
}
