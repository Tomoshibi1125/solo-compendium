import { Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AIEnhancedArtGeneratorProps {
	entityType?: "Anomaly" | "npc" | "item" | "location";
	entityId?: string;
	title?: string;
	onArtGenerated?: (assetId: string, previewUrl?: string) => void;
	onGenerationStart?: () => void;
	onGenerationComplete?: (success: boolean) => void;
	className?: string;
	campaignId?: string | null;
}

/**
 * A1 compatibility surface for routes that previously hosted general AI art.
 * It deliberately exposes no generation/provider controls while keeping the
 * route renderable and existing authored/saved artwork untouched.
 */
export function AIEnhancedArtGenerator({
	title,
	className,
}: AIEnhancedArtGeneratorProps) {
	return (
		<Card className={cn("border-border/70", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ImageIcon className="h-5 w-5" />
					{title ? `${title} — Art Library` : "Art Library"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Alert>
					<AlertDescription>
						General AI art generation and AI enhancement were retired. Existing
						authored and previously saved art remains available through normal
						compendium, character, and campaign asset views.
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
}
