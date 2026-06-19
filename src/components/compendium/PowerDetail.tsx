import { BookOpen, Clock, Target, Timer, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import {
	formatDetailValue,
	getEffectLines,
	getLimitationLines,
} from "@/components/compendium/detailFormatters";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setPendingResolution } from "@/lib/actionResolution";
import { formatRarityLabel, getRarityBadgeClass } from "@/lib/labels";
import { buildAttackRollFormula } from "@/lib/powerActionFormulas";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumMechanics, CompendiumPower } from "@/types/compendium";

interface PowerData extends CompendiumPower {}

const tierColors: Record<number, string> = {
	0: "text-gray-400 border-gray-500/30",
	1: "text-green-400 border-green-500/30",
	2: "text-green-400 border-green-500/30",
	3: "text-blue-400 border-blue-500/30",
	4: "text-blue-400 border-blue-500/30",
	5: "text-purple-400 border-purple-500/30",
	6: "text-purple-400 border-purple-500/30",
	7: "text-orange-400 border-orange-500/30",
	8: "text-orange-400 border-orange-500/30",
	9: "text-red-400 border-red-500/30",
};

export const PowerDetail = ({ data }: { data: PowerData }) => {
	const navigate = useNavigate();
	const tierLabel =
		data.power_level === 0 ? "Cantrip" : `Tier ${data.power_level}`;
	const tierColor = tierColors[data.power_level] || "text-foreground";
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;
	const mechanics =
		data.mechanics && typeof data.mechanics === "object"
			? (data.mechanics as Record<string, unknown>)
			: {};
	const classes = Array.isArray(data.classes) ? data.classes : [];
	const effectLines = getEffectLines(data.effects);
	const limitationLines = getLimitationLines(data.limitations);
	const componentsText = data.components
		? [
				data.components.verbal ? "V" : null,
				data.components.somatic ? "S" : null,
				data.components.material ? "M" : null,
			]
				.filter(Boolean)
				.join("")
		: "";
	const baseAttackRoll = data.has_attack_roll
		? buildAttackRollFormula(
				typeof mechanics.attack_bonus === "number" ? mechanics.attack_bonus : 0,
			)
		: undefined;
	const baseSaveDC =
		typeof mechanics.save_dc === "number"
			? mechanics.save_dc
			: data.has_save
				? 8
				: undefined;

	const handleRoll = () => {
		const id = crypto.randomUUID();
		const name = displayName;

		if (data.has_attack_roll) {
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "attack",
				attack: { roll: baseAttackRoll ?? "1d20" },
				damage: data.damage_roll
					? { roll: data.damage_roll, type: data.damage_type }
					: undefined,
			});
			navigate("/dice");
		} else if (data.has_save) {
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "save",
				save: { dc: baseSaveDC ?? 8, ability: data.save_ability, roll: "1d20" },
				damage: data.damage_roll
					? { roll: data.damage_roll, type: data.damage_type }
					: undefined,
			});
			navigate("/dice");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className={cn("border-2", tierColor)}
			>
				<div className="flex flex-col md:flex-row gap-6">
					{imageSrc && (
						<div className="w-full md:w-1/3 max-w-[300px] flex-shrink-0">
							<CompendiumImage
								src={imageSrc}
								alt={displayName}
								size="large"
								aspectRatio="square"
								className="rounded-md border border-primary/20"
								fallbackIcon={
									<BookOpen className="w-16 h-16 text-muted-foreground" />
								}
							/>
						</div>
					)}
					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<Badge className={tierColor}>{tierLabel}</Badge>
							{data.power_type && (
								<Badge variant="secondary">
									{formatRegentVernacular(data.power_type)}
								</Badge>
							)}
							{data.school && (
								<Badge variant="secondary">
									{formatRegentVernacular(data.school)}
								</Badge>
							)}
							{data.concentration && (
								<Badge variant="destructive">Concentration</Badge>
							)}
							{data.ritual && <Badge variant="outline">Ritual</Badge>}
							{(data as { rarity?: string }).rarity && (
								<Badge
									variant="outline"
									className={getRarityBadgeClass(
										(data as { rarity?: string }).rarity,
									)}
								>
									{formatRarityLabel((data as { rarity?: string }).rarity)}
								</Badge>
							)}
							{data.source_book && (
								<Badge variant="outline">
									{formatRegentVernacular(data.source_book)}
								</Badge>
							)}
						</div>

						{classes.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<span className="text-sm text-muted-foreground">Classes:</span>
								{classes.map((className) => (
									<Badge key={className} variant="outline" className="text-xs">
										{formatRegentVernacular(className)}
									</Badge>
								))}
							</div>
						)}

						{(data.has_attack_roll || data.has_save) && (
							<div className="pt-2 space-y-2">
								<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
									{baseAttackRoll && <span>Base attack: {baseAttackRoll}</span>}
									{baseSaveDC !== undefined && (
										<span>
											Base save: DC {baseSaveDC}
											{data.save_ability ? ` ${data.save_ability}` : ""}
										</span>
									)}
									{data.damage_roll && (
										<span>
											Damage: {data.damage_roll}
											{data.damage_type ? ` ${data.damage_type}` : ""}
										</span>
									)}
									{data.target && (
										<span>Target: {formatRegentVernacular(data.target)}</span>
									)}
								</div>
								<Button onClick={handleRoll} className="gap-2">
									<Zap className="w-4 h-4" />
									Roll Power
								</Button>
							</div>
						)}
					</div>
				</div>
			</AscendantWindow>

			{/* Casting Properties */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<AscendantWindow title="CASTING TIME" compact>
					<div className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(
								formatDetailValue(
									data.casting_time || data.activation_time || data.activation,
								) || "1 action",
							)}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="RANGE" compact>
					<div className="flex items-center gap-2">
						<Target className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(formatDetailValue(data.range) || "Self")}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="DURATION" compact>
					<div className="flex items-center gap-2">
						<Timer className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(
								formatDetailValue(data.duration) || "Instantaneous",
							)}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="COMPONENTS" compact>
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-primary" />
						<span className="font-heading">{componentsText || "None"}</span>
					</div>
					{typeof data.components?.material === "string" && (
						<p className="text-xs text-muted-foreground mt-1">
							{formatRegentVernacular(data.components.material)}
						</p>
					)}
				</AscendantWindow>
			</div>

			{/* Description */}
			<AscendantWindow title="DESCRIPTION">
				{data.flavor && (
					<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
						<AutoLinkText text={data.flavor} />
					</p>
				)}
				<p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
					<AutoLinkText text={data.description || ""} />
				</p>
				{(() => {
					const loreText =
						(typeof data.lore === "string" ? data.lore : data.lore?.history) ||
						(data as { discovery_lore?: string }).discovery_lore ||
						"";
					return loreText ? (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={loreText} />
							</p>
						</div>
					) : null;
				})()}
			</AscendantWindow>

			{effectLines.length > 0 && (
				<AscendantWindow title="EFFECTS">
					<div className="space-y-3">
						{effectLines.map((line) => (
							<div
								key={`${line.label}:${line.text}`}
								className="border-l-2 border-primary/50 pl-3"
							>
								<p className="text-xs uppercase tracking-wider text-muted-foreground">
									{line.label}
								</p>
								<p className="text-foreground">
									<AutoLinkText text={line.text} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Mechanics Raw Output if exists */}
			{Object.keys(mechanics).length > 0 && (
				<AscendantWindow title="MECHANICS">
					<div className="space-y-3 text-sm">
						{(
							[
								["Action", mechanics.action],
								["Ability", mechanics.ability],
								["Damage", mechanics.damage_profile],
								["Range", mechanics.range],
								["Duration", mechanics.duration],
								["Lattice Interaction", mechanics.lattice_interaction],
							] as Array<[string, unknown]>
						).map(([label, value]) => {
							const text = formatDetailValue(value);
							return text ? (
								<div key={label} className="flex items-start gap-2">
									<span className="min-w-32 text-muted-foreground">
										{String(label)}:
									</span>
									<span>{formatRegentVernacular(text)}</span>
								</div>
							) : null;
						})}
						{(() => {
							const typedMechanics = mechanics as CompendiumMechanics;
							const save = typedMechanics.saving_throw;
							if (!save) return null;
							return (
								<div className="rounded border border-border p-3">
									<p className="font-heading">
										{formatRegentVernacular(save.ability || "")} Save DC{" "}
										{save.dc}
									</p>
									{save.success && (
										<p className="text-xs text-muted-foreground">
											Success: {formatRegentVernacular(save.success)}
										</p>
									)}
									{save.failure && (
										<p className="text-xs text-muted-foreground">
											Failure: {formatRegentVernacular(save.failure)}
										</p>
									)}
								</div>
							);
						})()}
					</div>
				</AscendantWindow>
			)}

			{limitationLines.length > 0 && (
				<AscendantWindow title="LIMITATIONS">
					<ul className="space-y-2 text-sm">
						{limitationLines.map((line) => (
							<li
								key={`${line.label}:${line.text}`}
								className="flex items-center gap-2"
							>
								<Timer className="w-4 h-4 text-muted-foreground" />
								<span>
									{line.label}: {formatRegentVernacular(line.text)}
								</span>
							</li>
						))}
					</ul>
				</AscendantWindow>
			)}

			{/* At Higher Levels */}
			{data.higher_levels && (
				<AscendantWindow title="AT HIGHER TIERS">
					<div className="flex items-start gap-3">
						<BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
						<p className="text-foreground leading-relaxed text-base">
							<AutoLinkText text={data.higher_levels} />
						</p>
					</div>
				</AscendantWindow>
			)}

			{/* Tags */}
			{data.tags && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{[...new Set(data.tags ?? [])].map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
