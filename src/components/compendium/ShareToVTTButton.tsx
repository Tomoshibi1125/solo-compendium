import { Share } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";

interface ShareToVTTButtonProps {
	itemType: string;
	itemName: string;
}

export function ShareToVTTButton({
	itemType,
	itemName,
}: ShareToVTTButtonProps) {
	const ascendantTools = useAscendantTools();
	const [campaigns, setCampaigns] = useState<unknown[]>([]);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const loadCampaigns = async () => {
		setLoading(true);
		try {
			const camps = await ascendantTools.getCampaignsForRolling();
			setCampaigns(camps || []);
		} catch (e) {
			console.error("Error fetching campaigns", e);
		} finally {
			setLoading(false);
		}
	};

	const handleShare = async (campaignId: string) => {
		try {
			await ascendantTools.rollInCampaign(campaignId, {
				character_id: undefined,
				dice_formula: "Share",
				result: 0,
				roll_type: "custom",
				rolls: [],
				context: `Shared ${itemType}: ${itemName}`,
			});
			toast({
				title: "Shared to VTT",
				description: `Successfully shared ${itemName} to campaign.`,
			});
		} catch (_error) {
			toast({
				title: "Share Failed",
				description: "Failed to share to the VTT.",
				variant: "destructive",
			});
		}
	};

	return (
		<DropdownMenu
			onOpenChange={(open) => {
				if (open) loadCampaigns();
			}}
		>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Share className="w-4 h-4" />
					Share to VTT
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Share to Campaign</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{loading ? (
					<DropdownMenuItem disabled>Loading campaigns...</DropdownMenuItem>
				) : campaigns.length === 0 ? (
					<DropdownMenuItem disabled>No active campaigns</DropdownMenuItem>
				) : (
					campaigns.map((camp: unknown) => (
						<DropdownMenuItem
							key={(camp as { id: string }).id}
							onClick={() => handleShare((camp as { id: string }).id)}
						>
							{(camp as { name: string }).name}
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
