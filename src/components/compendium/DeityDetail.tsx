import {
	Anchor,
	Book,
	Crown,
	ExternalLink,
	GitBranch,
	Home,
	MapPin,
	Sword,
	Users,
	Zap,
} from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CompendiumDeity } from "@/types/compendium";

interface DeityDetailProps {
	data: CompendiumDeity;
}

export const DeityDetail = ({ data }: DeityDetailProps) => {
	const getRankColor = (rank: string | null | undefined) => {
		const r = rank || "";
		if (r.includes("Grand"))
			return "border-regent-gold text-regent-gold bg-regent-gold/10 shadow-[0_0_10px_rgba(255,215,0,0.3)]";
		if (r.includes("Lesser"))
			return "border-amethyst text-amethyst bg-amethyst/10";
		return "border-cyan text-cyan bg-cyan/10";
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Divine Header */}
			<div className="relative overflow-hidden rounded-lg border-2 border-amethyst/30 bg-void p-6 sm:p-8">
				<div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
					<Crown className="w-24 h-24 text-amethyst" />
				</div>

				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
					<div>
						<Badge
							className={cn(
								"mb-2 uppercase tracking-widest font-display",
								getRankColor(data.rank),
							)}
						>
							{data.rank || "Unknown Rank"}
						</Badge>
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="text-3xl sm:text-4xl mb-1"
						>
							{data.name}
						</RiftHeading>
						<p className="text-lg text-amethyst font-heading italic tracking-tight">
							{data.display_name || data.name}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
					<div className="bg-glass/30 p-3 rounded-sm border border-amethyst/20">
						<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-1">
							<Anchor className="w-3 h-3" /> Divine Directive
						</div>
						<div className="text-sm font-mono text-white">
							{data.directive || "Unspecified"}
						</div>
					</div>
					<div className="bg-glass/30 p-3 rounded-sm border border-amethyst/20">
						<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-1">
							<MapPin className="w-3 h-3" /> Home Realm
						</div>
						<div className="text-sm font-mono text-white">
							{data.home_realm || "Unknown"}
						</div>
					</div>
					<div className="bg-glass/30 p-3 rounded-sm border border-amethyst/20">
						<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-1">
							<Sword className="w-3 h-3" /> Favored Manifestation
						</div>
						<div className="text-sm font-mono text-white">
							{data.manifestation || "None"}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column: Lore and Dogma */}
				<div className="lg:col-span-2 space-y-6">
					{/* Narrative Lore */}
					<AscendantWindow title="Divine Lore" variant="regent">
						<div className="p-4 bg-void/50 rounded-sm">
							<ManaFlowText className="text-sm text-muted-foreground leading-relaxed">
								{typeof data.lore === "string"
									? data.lore
									: typeof data.description === "string"
										? data.description
										: "No archival data available for this entity."}
							</ManaFlowText>
						</div>
					</AscendantWindow>

					{/* Divine Dogma */}
					<AscendantWindow title="Divine Dogma" variant="resurge">
						<div className="p-1 space-y-3">
							{(data.dogma ?? []).map((tenet: string) => (
								<div
									key={tenet.substring(0, 32)}
									className="flex gap-4 p-3 bg-shadow-purple/10 border-l-2 border-shadow-purple"
								>
									<span className="text-shadow-purple font-mono text-xs">
										{"//"}
									</span>
									<p className="text-sm italic text-muted-foreground">
										<AutoLinkText text={tenet || ""} />
									</p>
								</div>
							))}
						</div>
					</AscendantWindow>

					{/* Relationships */}
					{data.relationships && data.relationships.length > 0 && (
						<AscendantWindow
							title="Divine Network - Relationships"
							className="bg-glass/10"
						>
							<div className="p-2 space-y-2">
								{data.relationships.map((rel) => (
									<div
										key={rel.id}
										className="flex items-center justify-between p-3 rounded-sm border border-amethyst/10 bg-void/40"
									>
										<div>
											<div className="flex items-center gap-2">
												<span className="font-bold text-sm">{rel.name}</span>
												<Badge
													variant="outline"
													className="text-[10px] h-4 leading-none uppercase"
												>
													{rel.type || "Unknown"}
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground mt-1 italic">
												{rel.description || ""}
											</p>
										</div>
										<ExternalLink className="w-4 h-4 text-amethyst/40" />
									</div>
								))}
							</div>
						</AscendantWindow>
					)}
				</div>

				{/* Right Column: Portfolio and Worship */}
				<div className="space-y-6">
					{/* Sigil and Portfolio */}
					<AscendantWindow title="Divine Markers">
						<div className="p-4 space-y-4">
							<div>
								<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-2">
									<Zap className="w-3 h-3" /> Divine Sigil
								</div>
								<div className="p-3 bg-amethyst/5 border border-amethyst/20 rounded-sm text-sm italic">
									{data.sigil || "Unspecified"}
								</div>
							</div>

							<div>
								<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-2">
									<GitBranch className="w-3 h-3" /> Divine Portfolio
								</div>
								<div className="flex flex-wrap gap-2">
									{(data.portfolio ?? []).map((p: string) => (
										<Badge
											key={p}
											className="bg-amethyst/20 text-amethyst border-amethyst/40"
										>
											{p}
										</Badge>
									))}
								</div>
							</div>

							<div>
								<div className="flex items-center gap-2 text-cyan font-display text-[10px] uppercase mb-2">
									<Book className="w-3 h-3" /> Specializations
								</div>
								<div className="flex flex-wrap gap-2">
									{(data.specializations ?? []).map((s: string) => (
										<Badge
											key={s}
											variant="outline"
											className="text-cyan border-cyan/40"
										>
											{s}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</AscendantWindow>

					{/* Worshipper Profile */}
					<AscendantWindow title="Divine Reach">
						<div className="p-4 space-y-4">
							<div className="flex gap-3">
								<Users className="w-5 h-5 text-amethyst shrink-0" />
								<div>
									<p className="text-[10px] font-display text-cyan uppercase tracking-wider mb-1">
										Common Worshippers
									</p>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{data.worshippers || "Classified"}
									</p>
								</div>
							</div>
							<Separator className="bg-amethyst/20" />
							<div className="flex gap-3">
								<Home className="w-5 h-5 text-amethyst shrink-0" />
								<div>
									<p className="text-[10px] font-display text-cyan uppercase tracking-wider mb-1">
										Sacred Sites (Temples)
									</p>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{data.temples || "Undisclosed"}
									</p>
								</div>
							</div>
						</div>
					</AscendantWindow>

					<div className="p-4 rounded-lg border border-cyan/30 bg-cyan/5 text-center">
						<p className="text-[10px] font-mono text-cyan uppercase mb-2">
							Status: Zenith Synchronized
						</p>
						<p className="text-xs text-muted-foreground italic">
							"By the will of the Architect, we ascend."
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
