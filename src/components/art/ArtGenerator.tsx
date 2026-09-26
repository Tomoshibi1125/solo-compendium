import { Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ArtGeneratorProps {
	entityType?: "character" | "npc" | "item" | "Anomaly" | "location";
	entityId?: string;
	existingData?: {
		name?: string;
		description?: string;
		tags?: string[];
		rarity?: string;
		environment?: string;
	};
	referenceImageUrl?: string | null;
	onArtGenerated?: (assetId: string, previewUrl?: string) => void;
	className?: string;
}

/**
 * A1 route-safe replacement for the former provider-backed art generator.
 * Existing art remains visible through the normal asset/portrait readers; this
 * surface no longer generates, enhances, analyzes, or uploads provider output.
 */
export function ArtGenerator({
	existingData,
	referenceImageUrl,
	className,
}: ArtGeneratorProps) {
	return (
		<Card className={cn("border-border/70", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ImageIcon className="h-5 w-5" />
					Art Library
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Alert>
					<AlertDescription>
						General AI art generation was retired. Existing authored and
						previously saved artwork remains available; use manual artwork and
						reference assets where the surrounding editor supports them.
					</AlertDescription>
				</Alert>
				{existingData?.name && (
					<p className="text-sm text-muted-foreground">
						Current subject: <span className="font-medium text-foreground">{existingData.name}</span>
					</p>
				)}
				{referenceImageUrl && (
					<div className="overflow-hidden rounded-lg border bg-muted/20 p-2">
						<img
							src={referenceImageUrl}
							alt={existingData?.name ? `${existingData.name} reference` : "Existing reference artwork"}
							className="mx-auto max-h-72 rounded object-contain"
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
