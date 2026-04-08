import { AlertCircle, CheckCircle } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumFeat } from "@/types/compendium";

export interface FeatData extends CompendiumFeat {}

export const FeatDetail = ({ data }: { data: FeatData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>
					{data.lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
							</p>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Prerequisites */}
			{data.prerequisites && (
				<AscendantWindow title="PREREQUISITES">
					<div className="flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
						<div className="space-y-2">
							{typeof data.prerequisites === "string" ? (
								<p className="text-sm text-muted-foreground">
									<AutoLinkText text={data.prerequisites} />
								</p>
							) : (
								Object.entries(data.prerequisites).map(([key, value]) => (
									<div key={key} className="flex items-center gap-2">
										<Badge variant="outline" className="text-[10px] uppercase tracking-tighter">
											{formatRegentVernacular(key)}
										</Badge>
										<span className="text-sm text-muted-foreground">
											{Array.isArray(value) ? value.join(", ") : String(value)}
										</span>
									</div>
								))
							)}
						</div>
					</div>
				</AscendantWindow>
			)}

			{/* Benefits */}
			{data.benefits && (
				<AscendantWindow title="BENEFITS">
					<div className="space-y-6">
						{Array.isArray(data.benefits) ? (
							<ul className="space-y-3">
								{data.benefits.map((benefit, i) => (
									<li key={i} className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
										<p className="text-sm text-muted-foreground">
											<AutoLinkText text={benefit} />
										</p>
									</li>
								))}
							</ul>
						) : (
							<div className="space-y-6">
								{data.benefits.basic && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Basic Benefits</h4>
										<ul className="space-y-3">
											{data.benefits.basic.map((benefit, i) => (
												<li key={i} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
								{data.benefits.expert && data.benefits.expert.length > 0 && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-amethyst mb-3">Expert Benefits</h4>
										<ul className="space-y-3">
											{data.benefits.expert.map((benefit, i) => (
												<li key={i} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-amethyst flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
								{data.benefits.master && data.benefits.master.length > 0 && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Master Benefits</h4>
										<ul className="space-y-3">
											{data.benefits.master.map((benefit, i) => (
												<li key={i} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Source */}
			{data.source_book && (
				<div className="flex justify-end p-2">
					<Badge variant="outline" className="text-[10px] opacity-50 uppercase tracking-tighter">
						Source: {formatRegentVernacular(data.source_book)}
					</Badge>
				</div>
			)}
		</div>
	);
};
