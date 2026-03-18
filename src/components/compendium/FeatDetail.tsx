import { AlertCircle, CheckCircle } from "lucide-react";
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
					<p className="text-foreground">
						{formatRegentVernacular(data.description)}
					</p>

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
							{formatRegentVernacular(data.prerequisites)}
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
									{formatRegentVernacular(benefit)}
								</span>
							</li>
						))}
					</ul>
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
