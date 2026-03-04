import { Languages, Shield, Sword, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProficienciesLanguagesProps {
	armorProficiencies?: string[];
	weaponProficiencies?: string[];
	toolProficiencies?: string[];
	languages?: string[];
}

export function ProficienciesLanguages({
	armorProficiencies = [],
	weaponProficiencies = [],
	toolProficiencies = [],
	languages = [],
}: ProficienciesLanguagesProps) {
	const hasAny =
		armorProficiencies.length > 0 ||
		weaponProficiencies.length > 0 ||
		toolProficiencies.length > 0 ||
		languages.length > 0;

	if (!hasAny) return null;

	return (
		<div className="rounded-lg border p-4 space-y-3">
			<h2 className="text-sm font-semibold text-muted-foreground">
				Proficiencies &amp; Languages
			</h2>

			{armorProficiencies.length > 0 && (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Shield className="h-3 w-3" /> Armor
					</div>
					<div className="flex flex-wrap gap-1">
						{armorProficiencies.map((p) => (
							<Badge key={p} variant="secondary" className="text-[10px]">
								{p}
							</Badge>
						))}
					</div>
				</div>
			)}

			{weaponProficiencies.length > 0 && (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Sword className="h-3 w-3" /> Weapons
					</div>
					<div className="flex flex-wrap gap-1">
						{weaponProficiencies.map((p) => (
							<Badge key={p} variant="secondary" className="text-[10px]">
								{p}
							</Badge>
						))}
					</div>
				</div>
			)}

			{toolProficiencies.length > 0 && (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Wrench className="h-3 w-3" /> Tools
					</div>
					<div className="flex flex-wrap gap-1">
						{toolProficiencies.map((p) => (
							<Badge key={p} variant="secondary" className="text-[10px]">
								{p}
							</Badge>
						))}
					</div>
				</div>
			)}

			{languages.length > 0 && (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Languages className="h-3 w-3" /> Languages
					</div>
					<div className="flex flex-wrap gap-1">
						{languages.map((l) => (
							<Badge key={l} variant="outline" className="text-[10px]">
								{l}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
