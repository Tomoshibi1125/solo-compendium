import { AlertCircle, CheckCircle } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { formatRegentVernacular } from "@/lib/vernacular";

interface FeatData {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	prerequisites?: string;
	benefits?: string[];
	effects?: Record<string, unknown> | null;
	mechanics?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
	flavor?: string | null;
	lore?: string | null;
	tags?: string[];
	source_book?: string;
}

export const FeatDetail = ({ data }: { data: FeatData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	return (
		<div className="space-y-6">
			{/* Header */}
			<SystemWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor} />
						</p>
					)}
					<p className="text-foreground">
						<AutoLinkText text={data.description} />
					</p>
					{data.lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={data.lore} />
							</p>
						</div>
					)}

					{data.tags && data.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{data.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{formatRegentVernacular(tag)}
								</Badge>
							))}
						</div>
					)}
				</div>
			</SystemWindow>

			{/* Prerequisites */}
			{data.prerequisites && (
				<SystemWindow title="PREREQUISITES">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
						<p className="text-foreground">
							<AutoLinkText text={data.prerequisites} />
						</p>
					</div>
				</SystemWindow>
			)}

			{/* Benefits */}
			{data.benefits && data.benefits.length > 0 && (
				<SystemWindow title="BENEFITS">
					<ul className="space-y-3">
						{data.benefits.map((benefit, _i) => (
							<li key={benefit} className="flex items-start gap-3">
								<CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
								<span className="text-foreground">
									<AutoLinkText text={benefit} />
								</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}

			{data.mechanics && Object.keys(data.mechanics).length > 0 && (
				<SystemWindow title="SYSTEM DIAGNOSTICS">
					<pre className="whitespace-pre-wrap font-mono bg-void/50 p-3 rounded text-xs text-muted-foreground overflow-hidden">
						{JSON.stringify(data.mechanics, null, 2)}
					</pre>
				</SystemWindow>
			)}

			{data.source_book && (
				<div className="flex justify-end">
					<Badge variant="outline">
						{formatRegentVernacular(data.source_book)}
					</Badge>
				</div>
			)}
		</div>
	);
};
