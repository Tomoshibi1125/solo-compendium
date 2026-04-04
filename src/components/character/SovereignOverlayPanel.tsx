import {
	ChevronDown,
	ChevronUp,
	Crown,
	Lock,
	Shield,
	Star,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCharacterSovereign } from "@/hooks/useSavedSovereigns";
import type { FusionAbility } from "@/lib/geminiProtocol";
import { cn } from "@/lib/utils";

interface SovereignOverlayPanelProps {
	characterId: string;
}

function AbilityCard({
	ability,
	index,
}: {
	ability: FusionAbility;
	index: number;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<button
			type="button"
			className={cn(
				"w-full text-left rounded-lg border p-3 transition-colors cursor-pointer",
				ability.is_capstone
					? "border-resurge-violet/60 bg-resurge-violet/8"
					: "border-border bg-muted/20 hover:border-resurge-violet/30",
			)}
			onClick={() => setExpanded(!expanded)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-xs font-mono text-muted-foreground/60 shrink-0">
						{String(index + 1).padStart(2, "0")}
					</span>
					{ability.is_capstone && (
						<Star className="w-3 h-3 text-resurge-violet shrink-0" />
					)}
					<p className="text-sm font-semibold truncate">{ability.name}</p>
				</div>
				<div className="flex items-center gap-1.5 shrink-0">
					{ability.action_type && (
						<Badge variant="outline" className="text-[10px] h-5 px-1.5">
							{ability.action_type}
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
				<div className="mt-2 space-y-1">
					{ability.recharge && (
						<p className="text-xs text-muted-foreground">
							<span className="font-semibold">Recharge:</span>{" "}
							{ability.recharge}
						</p>
					)}
					{ability.level > 0 && (
						<p className="text-xs text-muted-foreground">
							<span className="font-semibold">Unlock Level:</span>{" "}
							{ability.level}
						</p>
					)}
					<p className="text-xs text-muted-foreground leading-relaxed mt-1">
						{ability.description}
					</p>
				</div>
			)}
		</button>
	);
}

export function SovereignOverlayPanel({
	characterId,
}: SovereignOverlayPanelProps) {
	const { data: sovereign, isLoading } = useCharacterSovereign(characterId);

	if (isLoading) return null;

	if (!sovereign) {
		return (
			<SystemWindow title="SOVEREIGN OVERLAY">
				<div className="flex items-center gap-3 text-muted-foreground text-sm py-2">
					<Lock className="w-4 h-4 shrink-0" />
					<p>
						No Sovereign overlay locked in. Generate one via the{" "}
						<span className="text-resurge-violet font-semibold">
							Gemini Protocol
						</span>{" "}
						once you have unlocked two Regents.
					</p>
				</div>
			</SystemWindow>
		);
	}

	const abilities = sovereign.abilities || [];
	const capstone = abilities.find((a) => a.is_capstone);
	const standard = abilities.filter((a) => !a.is_capstone);

	return (
		<SystemWindow title="SOVEREIGN OVERLAY">
			{/* Header */}
			<div className="space-y-3">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
					<div>
						<div className="flex items-center gap-2">
							<Crown className="w-5 h-5 text-resurge-violet" />
							<h3 className="text-lg font-bold">{sovereign.name}</h3>
						</div>
						<p className="text-sm text-muted-foreground italic mt-0.5">
							{sovereign.title}
						</p>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{sovereign.fusion_theme && (
							<Badge className="bg-resurge-violet/20 text-resurge-violet border-resurge-violet/40 border">
								{sovereign.fusion_theme}
							</Badge>
						)}
						<Badge variant="outline">⚡ {sovereign.power_multiplier}</Badge>
						<Badge variant="outline">🔗 {sovereign.fusion_stability}</Badge>
					</div>
				</div>

				{sovereign.description && (
					<p className="text-sm text-muted-foreground leading-relaxed">
						{sovereign.description}
					</p>
				)}

				{sovereign.fusion_description && (
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
								{sovereign.fusion_description}
							</p>
						</div>
					</>
				)}

				<Separator />

				{/* Abilities */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<Zap className="w-3.5 h-3.5 text-resurge-violet" />
						<p className="text-xs font-semibold text-resurge-violet tracking-wider uppercase">
							Fusion Abilities ({abilities.length})
						</p>
					</div>
					<ScrollArea className="max-h-[400px] pr-2">
						<div className="space-y-2">
							{standard.map((ability, i) => (
								<AbilityCard
									key={ability.name || i}
									ability={ability}
									index={i}
								/>
							))}
							{capstone && (
								<AbilityCard
									key={capstone.name}
									ability={capstone}
									index={abilities.length - 1}
								/>
							)}
						</div>
					</ScrollArea>
				</div>
			</div>
		</SystemWindow>
	);
}
