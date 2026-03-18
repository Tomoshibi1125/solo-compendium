import { Crown, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import type { Regent } from "@/lib/regentTypes";
import { formatRegentVernacular, REGENT_LABEL } from "@/lib/vernacular";

interface RegentDetailProps {
	data: Regent;
}

interface CombinedFeature {
	id?: string;
	name: string;
	description: string;
	level: number;
	is_signature: boolean;
	type?: string;
	recharge?: string;
}

export const RegentDetail = ({ data }: RegentDetailProps) => {
	const displayName = formatRegentVernacular(data.name);
	const displayTitle = formatRegentVernacular(data.title || data.name);
	const displayTheme = formatRegentVernacular(data.theme || "");

	// Normalize features from the different possible data structures
	const features: CombinedFeature[] = (data.class_features || []).map((f) => ({
		...f,
		is_signature: false, // class_features are usually regular
	}));
	const abilities: CombinedFeature[] = (data.abilities || []).map((a) => ({
		id: `ability-${a.name}`,
		name: a.name,
		description: a.description,
		level: a.power_level || 0,
		is_signature: (a.power_level || 0) >= 8,
		type: a.type,
		recharge: a.frequency,
	}));

	const allFeatures = [...features, ...abilities].sort(
		(a, b) => a.level - b.level,
	);
	const signatureFeatures = allFeatures.filter((f) => f.is_signature);
	const regularFeatures = allFeatures.filter((f) => !f.is_signature);

	return (
		<div className="space-y-6">
			{/* Header */}
			<SystemWindow
				title={displayName.toUpperCase()}
				className="border-amber-500/50 border-2"
			>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Crown className="w-8 h-8 text-amber-400" />
						<div>
							<h2 className="font-display text-2xl gradient-text-system">
								{displayTitle}
							</h2>
							<p className="text-muted-foreground">{displayTheme}</p>
						</div>
					</div>

					{data.description && (
						<p className="text-foreground">
							{formatRegentVernacular(data.description)}
						</p>
					)}

					<div className="flex flex-wrap gap-2">
						<Badge className="bg-amber-500 text-white">
							Quest / DM Approval
						</Badge>
						{data.hit_dice && (
							<Badge variant="secondary">Hit Die: {data.hit_dice}</Badge>
						)}
						{data.primary_ability?.map((ability) => (
							<Badge key={ability} variant="outline">
								{formatRegentVernacular(ability)}
							</Badge>
						))}
					</div>
				</div>
			</SystemWindow>

			{/* Requirements */}
			{(data.requirements || data.regent_requirements) && (
				<SystemWindow title="REQUIREMENTS">
					<p className="text-foreground">
						{formatRegentVernacular(
							data.requirements?.quest_completion ||
								data.regent_requirements?.quest_completion ||
								"",
						)}
					</p>
				</SystemWindow>
			)}

			{/* Signature Features */}
			{signatureFeatures.length > 0 && (
				<SystemWindow
					title="SIGNATURE ABILITIES"
					className="border-amber-500/30"
				>
					<div className="space-y-4">
						{signatureFeatures.map((feature: CombinedFeature) => (
							<div
								key={feature.id || feature.name}
								className="border-l-2 border-amber-500/50 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<Flame className="w-4 h-4 text-amber-400" />
									<h4 className="font-heading font-semibold text-amber-400">
										{formatRegentVernacular(feature.name)}
									</h4>
									{feature.type && (
										<Badge variant="secondary" className="text-xs">
											{feature.type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{formatRegentVernacular(feature.description)}
								</p>
							</div>
						))}
					</div>
				</SystemWindow>
			)}

			{/* Regular Features */}
			{regularFeatures.length > 0 && (
				<SystemWindow title={`${REGENT_LABEL.toUpperCase()} FEATURES`}>
					<div className="space-y-4">
						{regularFeatures.map((feature: CombinedFeature) => (
							<div
								key={feature.id || feature.name}
								className="border-l-2 border-primary/30 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<h4 className="font-heading font-semibold">
										{formatRegentVernacular(feature.name)}
									</h4>
									{feature.level > 0 && (
										<Badge variant="outline" className="text-xs">
											Level {feature.level}
										</Badge>
									)}
									{feature.type && (
										<Badge variant="secondary" className="text-xs">
											{feature.type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{formatRegentVernacular(feature.description)}
								</p>
							</div>
						))}
					</div>
				</SystemWindow>
			)}

			{data.tags && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{data.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
