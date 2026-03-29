import { AlertTriangle, Send } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
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
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface ProtocolBroadcastButtonProps {
	content: string;
}

export const ProtocolBroadcastButton: React.FC<
	ProtocolBroadcastButtonProps
> = ({ content }) => {
	const { user } = useAuth();
	const { toast } = useToast();
	const sendMessage = useSendCampaignMessage();
	const [activeCampaigns, setActiveCampaigns] = useState<
		{ id: string; name: string }[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const fetchCampaigns = async () => {
			if (!user) return;
			try {
				const { data, error } = await supabase
					.from("campaigns")
					.select("id, name")
					.eq("gamemaster_id", user.id);

				if (error) throw error;

				if (isMounted && data) {
					setActiveCampaigns(data);
				}
			} catch (err) {
				console.error("Failed to fetch campaigns for Warden broadcast", err);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		fetchCampaigns();
		return () => {
			isMounted = false;
		};
	}, [user]);

	// Only render for authenticated users who are GM of at least one campaign
	if (!user || (!isLoading && activeCampaigns.length === 0)) {
		return null;
	}

	const handleBroadcast = async (campaignId: string, campaignName: string) => {
		try {
			await sendMessage.mutateAsync({
				campaignId,
				content,
				messageType: "system",
				characterName: "Protocol Warden",
			});

			toast({
				title: "Protocol Broadcasted",
				description: `System Interaction beamed directly to ${campaignName} VTT.`,
				className: "bg-void border-cyan text-cyan border",
			});
		} catch (error) {
			console.error("Broadcast failed", error);
		}
	};

	// If there's only 1 active campaign, we can just broadcast instantly
	if (activeCampaigns.length === 1) {
		return (
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					handleBroadcast(activeCampaigns[0].id, activeCampaigns[0].name)
				}
				className="flex items-center gap-2 border-cyan/40 bg-void/50 text-cyan hover:bg-cyan/20 transition-all font-mono uppercase text-[10px] tracking-wider h-7"
				title="Broadcast to VTT Players"
			>
				<AlertTriangle className="h-3 w-3" />
				Broadcast Protocol
			</Button>
		);
	}

	// If multiple, show a dropdown picker
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="flex items-center gap-2 border-cyan/40 bg-void/50 text-cyan hover:bg-cyan/20 transition-all font-mono uppercase text-[10px] tracking-wider h-7"
				>
					<AlertTriangle className="h-3 w-3" />
					Broadcast Protocol
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 bg-void border-cyan/30 text-cyan-50">
				<DropdownMenuLabel className="font-mono text-xs text-cyan uppercase">
					Select Target Vector
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-cyan/20" />
				{activeCampaigns.map((camp) => (
					<DropdownMenuItem
						key={camp.id}
						onClick={() => handleBroadcast(camp.id, camp.name)}
						className="cursor-pointer hover:bg-cyan/10 focus:bg-cyan/20 font-mono text-xs"
					>
						<Send className="mr-2 h-3 w-3 text-cyan" />
						{camp.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
