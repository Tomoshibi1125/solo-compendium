import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText } from "@/components/ui/AscendantText";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DirectiveLattice as DirectiveLatticeComponent } from "@/components/warden-directives/DirectiveMatrix";
import { useMyCampaigns } from "@/hooks/useCampaigns";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";

const DirectiveLatticePage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const activeCampaignId = searchParams.get("campaignId")?.trim() || "";
	const { data: myCampaigns = [] } = useMyCampaigns();

	useHydratedPreferredCampaignId({
		toolKey: "directive_Lattice",
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
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Directives
					</Button>
					<PageHeader
						title="Directive Lattice"
						description={
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="font-heading"
							>
								Synthesize operational directives and localized contracts.
								Extrapolate operational parameters, complication probabilities,
								and calculated systemic compensation.
							</ManaFlowText>
						}
						actions={
							myCampaigns.length > 0 && (
								<div className="w-full md:w-64">
									<span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
										Save to Campaign
									</span>
									<Select
										value={activeCampaignId}
										onValueChange={handleCampaignChange}
									>
										<SelectTrigger>
											<SelectValue placeholder="Personal (not shared)..." />
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
							)
						}
					/>
				</div>

				<DirectiveLatticeComponent campaignId={activeCampaignId || null} />
			</div>
		</Layout>
	);
};

export default DirectiveLatticePage;
