import {
	Share2,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldX,
	Sparkles,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { ACBreakdown } from "@/hooks/useArmorClass";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";

interface DefensesModalProps {
	acBreakdown: ACBreakdown;
	resistances?: string[];
	immunities?: string[];
	vulnerabilities?: string[];
	conditionImmunities?: string[];
	sigilTraits?: string[];
	triggerButton?: React.ReactNode;
	characterId: string;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function DefensesModal({
	acBreakdown,
	resistances = [],
	immunities = [],
	vulnerabilities = [],
	conditionImmunities = [],
	sigilTraits = [],
	triggerButton,
	characterId,
	isOpen,
	onOpenChange,
}: DefensesModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = isOpen ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;
	const ascendantTools = useAscendantTools();

	const handleShare = () => {
		const message = `Shared Defenses: AC ${acBreakdown.total}. ${resistances.length > 0 ? `Resistances: ${resistances.join(", ")}.` : ""} ${immunities.length > 0 ? `Immunities: ${immunities.join(", ")}.` : ""} ${vulnerabilities.length > 0 ? `Vulnerabilities: ${vulnerabilities.join(", ")}.` : ""}`;

		ascendantTools.rollInCampaign(undefined as never, {
			dice_formula: "0",
			result: acBreakdown.total,
			rolls: [],
			roll_type: "ability",
			context: message,
			character_id: characterId,
		});
	};

	const hasExtraDefenses =
		resistances.length > 0 ||
		immunities.length > 0 ||
		vulnerabilities.length > 0 ||
		conditionImmunities.length > 0 ||
		sigilTraits.length > 0;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{triggerButton || (
					<button
						type="button"
						className="flex flex-col items-center justify-center p-2 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group"
					>
						<div className="flex items-center gap-1.5">
							<Shield className="h-4 w-4 text-shadow-blue group-hover:text-shadow-blue transition-colors" />
							<span className="text-2xl font-bold">{acBreakdown.total}</span>
						</div>
						<span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mt-0.5">
							Armor Class
						</span>
					</button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" /> Defenses & Resistances
						</DialogTitle>
						<button
							type="button"
							onClick={handleShare}
							className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 border rounded-md hover:bg-muted"
							title="Share to Campaign"
						>
							<Share2 className="h-3.5 w-3.5" /> Share
						</button>
					</div>
				</DialogHeader>

				<div className="space-y-6 py-2">
					{/* AC Breakdown Section */}
					<div className="space-y-3">
						<div className="flex items-center justify-between border-b pb-2">
							<h3 className="font-semibold text-sm">Armor Class</h3>
							<span className="text-xl font-bold text-shadow-blue">
								{acBreakdown.total}
							</span>
						</div>
						<p className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded-md">
							{acBreakdown.formula}
						</p>
						<div className="text-sm space-y-1.5 px-1 pb-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Base</span>
								<span className="font-medium">{acBreakdown.base}</span>
							</div>
							{acBreakdown.agiApplied !== 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">AGI modifier</span>
									<span className="font-medium">
										{acBreakdown.agiApplied >= 0 ? "+" : ""}
										{acBreakdown.agiApplied}
									</span>
								</div>
							)}
							{acBreakdown.shieldBonus > 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Shield</span>
									<span className="font-medium">
										+{acBreakdown.shieldBonus}
									</span>
								</div>
							)}
							{acBreakdown.magicalBonus > 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Magical bonus</span>
									<span className="font-medium">
										+{acBreakdown.magicalBonus}
									</span>
								</div>
							)}
							{acBreakdown.otherBonuses !== 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Other bonuses</span>
									<span className="font-medium">
										{acBreakdown.otherBonuses >= 0 ? "+" : ""}
										{acBreakdown.otherBonuses}
									</span>
								</div>
							)}
						</div>

						{acBreakdown.warnings.length > 0 && (
							<div className="bg-gate-s/10 border border-gate-s/20 text-gate-s text-xs p-2 rounded-md space-y-1">
								{acBreakdown.warnings.map((warning, _i) => (
									<p key={warning} className="flex items-start gap-1.5">
										<ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
										<span>{warning}</span>
									</p>
								))}
							</div>
						)}
					</div>

					{/* Resistances Section */}
					{hasExtraDefenses && (
						<div className="space-y-4 pt-4 border-t">
							<h3 className="font-semibold text-sm">Damage & Conditions</h3>

							{resistances.length > 0 && (
								<div className="space-y-1.5">
									<div className="flex items-center gap-1.5 text-xs font-medium text-shadow-blue dark:text-shadow-blue">
										<ShieldCheck className="h-3.5 w-3.5" /> Resistances
									</div>
									<div className="flex flex-wrap gap-1.5">
										{resistances.map((r) => (
											<Badge
												key={r}
												variant="outline"
												className="text-[11px] font-normal border-shadow-blue bg-shadow-blue/50 text-shadow-blue dark:border-shadow-blue/40 dark:bg-shadow-blue/25 dark:text-shadow-blue"
											>
												{r}
											</Badge>
										))}
									</div>
								</div>
							)}

							{immunities.length > 0 && (
								<div className="space-y-1.5">
									<div className="flex items-center gap-1.5 text-xs font-medium text-success dark:text-success">
										<ShieldCheck className="h-3.5 w-3.5" /> Immunities
									</div>
									<div className="flex flex-wrap gap-1.5">
										{immunities.map((i) => (
											<Badge
												key={`item-${i}`}
												variant="outline"
												className="text-[11px] font-normal border-success bg-success/50 text-success dark:border-success/40 dark:bg-success/25 dark:text-success"
											>
												{i}
											</Badge>
										))}
									</div>
								</div>
							)}

							{vulnerabilities.length > 0 && (
								<div className="space-y-1.5">
									<div className="flex items-center gap-1.5 text-xs font-medium text-destructive dark:text-destructive">
										<ShieldX className="h-3.5 w-3.5" /> Vulnerabilities
									</div>
									<div className="flex flex-wrap gap-1.5">
										{vulnerabilities.map((v) => (
											<Badge
												key={v}
												variant="outline"
												className="text-[11px] font-normal border-destructive bg-destructive/50 text-destructive dark:border-destructive/40 dark:bg-destructive/25 dark:text-destructive"
											>
												{v}
											</Badge>
										))}
									</div>
								</div>
							)}

							{conditionImmunities.length > 0 && (
								<div className="space-y-1.5">
									<div className="flex items-center gap-1.5 text-xs font-medium text-gate-s dark:text-gate-s">
										<ShieldAlert className="h-3.5 w-3.5" /> Condition Immunities
									</div>
									<div className="flex flex-wrap gap-1.5">
										{conditionImmunities.map((c) => (
											<Badge
												key={c}
												variant="outline"
												className="text-[11px] font-normal border-gate-s bg-gate-s/50 text-gate-s dark:border-gate-s/40 dark:bg-gate-s/25 dark:text-gate-s"
											>
												{c}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{sigilTraits.length > 0 && (
						<div className="space-y-1.5">
							<div className="flex items-center gap-1.5 text-xs font-medium text-resurge dark:text-resurge">
								<Sparkles className="h-3.5 w-3.5" /> Sigil Traits
							</div>
							<div className="flex flex-wrap gap-1.5">
								{sigilTraits.map((t) => (
									<Badge
										key={t}
										variant="outline"
										className="text-[11px] font-normal border-resurge bg-resurge/50 text-resurge dark:border-resurge/40 dark:bg-resurge/25 dark:text-resurge"
									>
										{t}
									</Badge>
								))}
							</div>
						</div>
					)}

					{!hasExtraDefenses && (
						<div className="pt-4 border-t text-sm text-muted-foreground text-center italic">
							No special resistances or immunities.
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
