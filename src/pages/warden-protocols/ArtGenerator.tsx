import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AIEnhancedArtGenerator } from "@/components/art/AIEnhancedArtGenerator";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMyCampaigns } from "@/hooks/useCampaigns";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";

const ArtGeneratorPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const activeCampaignId = searchParams.get("campaignId")?.trim() || "";
	const { data: myCampaigns = [] } = useMyCampaigns();

	useHydratedPreferredCampaignId({
		toolKey: "art_generator",
		campaigns: myCampaigns.map((c) => ({
			id: c.id,
			name: c.name,
			access: "owner",
		})),
		urlCampaignId: activeCampaignId || null,
		isCampaignIdValid: (id) => myCampaigns.some((c) => c.id === id),
		onResolveCampaignId: (id) => {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.set("campaignId", id);
			setSearchParams(nextParams, { replace: true });
		},
	});

	const handleCampaignChange = (nextCampaignId: string) => {
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("campaignId", nextCampaignId);
		setSearchParams(nextParams, { replace: true });
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div className="space-y-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate("/warden-tools")}
							className="mb-2"
							size="sm"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Warden Tools
						</Button>
						<SystemHeading
							level={1}
							variant="gate"
							dimensional
							className="text-3xl"
						>
							Visualization Matrix
						</SystemHeading>
						<DataStreamText variant="system" speed="slow">
							Synthesize dimensional visual records for your localized domains.
						</DataStreamText>
					</div>

					<div className="w-64">
						<Select
							value={activeCampaignId}
							onValueChange={handleCampaignChange}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Campaign..." />
							</SelectTrigger>
							<SelectContent>
								{myCampaigns.map((campaign) => (
									<SelectItem key={campaign.id} value={campaign.id}>
										{campaign.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-2xl">
					<AIEnhancedArtGenerator entityType="monster" />
				</div>
			</div>
		</Layout>
	);
};

export default ArtGeneratorPage;
