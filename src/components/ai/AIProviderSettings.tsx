import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * A1 replacement for the former user-configurable provider settings.
 * Sovereign generation is now server-managed, so the browser stores no AI
 * provider choice, endpoint, model, or API key.
 */
export function AIProviderSettings() {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<ShieldCheck className="h-4 w-4" />
					Sovereign AI
				</CardTitle>
			</CardHeader>
			<CardContent className="text-sm text-muted-foreground">
				General AI provider settings have been removed. Built-in AI is limited
				to authenticated Sovereign creation and is configured securely on the
				server. Manual and outside-AI Sovereign import remain available from the
				fusion console.
			</CardContent>
		</Card>
	);
}
