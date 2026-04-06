import { ArrowLeft, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CampaignSessionsPanel } from "@/components/campaign/CampaignSessionsPanel";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";

type CampaignWithRole = {
	id: string;
	name: string;
	access: "owner" | "co-system";
};

const SessionPlanner = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: myCampaigns = [], isLoading: myCampaignsLoading } =
		useMyCampaigns();
	const { data: joinedCampaigns = [], isLoading: joinedCampaignsLoading } =
		useJoinedCampaigns();
	const activeCampaignId = searchParams.get("campaignId")?.trim() || "";

	const manageableCampaigns = useMemo<CampaignWithRole[]>(() => {
		const byId = new Map<string, CampaignWithRole>();

		for (const campaign of myCampaigns) {
			byId.set(campaign.id, {
				id: campaign.id,
				name: campaign.name,
				access: "owner",
			});
		}

		for (const campaign of joinedCampaigns) {
			if (campaign.member_role !== "co-system") continue;
			if (!byId.has(campaign.id)) {
				byId.set(campaign.id, {
					id: campaign.id,
					name: campaign.name,
					access: "co-system",
				});
			}
		}

		return Array.from(byId.values()).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [joinedCampaigns, myCampaigns]);

	useHydratedPreferredCampaignId({
		toolKey: "session_planner",
		campaigns: manageableCampaigns,
		urlCampaignId: activeCampaignId || null,
		isCampaignIdValid: (id) =>
			manageableCampaigns.some((campaign) => campaign.id === id),
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

	const isLoading = myCampaignsLoading || joinedCampaignsLoading;
	const selectedCampaign =
		manageableCampaigns.find((campaign) => campaign.id === activeCampaignId) ??
		null;

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
				<div>
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Temporal Synchronization
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Campaign-backed session schedule and temporal records with local
						storage buffering.
					</ManaFlowText>
				</div>

				{isLoading ? (
					<AscendantWindow title="LOADING CAMPAIGNS">
						<AscendantText className="block text-sm text-muted-foreground">
							Loading campaigns...
						</AscendantText>
					</AscendantWindow>
				) : manageableCampaigns.length === 0 ? (
					<AscendantWindow title="NO CAMPAIGNS AVAILABLE">
						<div className="space-y-3 text-sm text-muted-foreground">
							<p>
								Create or join a campaign with Warden access to plan sessions.
							</p>
							<Button onClick={() => navigate("/campaigns")}>
								Open Campaigns
							</Button>
						</div>
					</AscendantWindow>
				) : (
					<>
						<AscendantWindow title="ACTIVE CAMPAIGN">
							<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
								<div className="space-y-2">
									<Label htmlFor="session-planner-campaign">Campaign</Label>
									<Select
										value={activeCampaignId}
										onValueChange={handleCampaignChange}
									>
										<SelectTrigger id="session-planner-campaign">
											<SelectValue placeholder="Select campaign" />
										</SelectTrigger>
										<SelectContent>
											{manageableCampaigns.map((campaign) => (
												<SelectItem key={campaign.id} value={campaign.id}>
													{campaign.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{selectedCampaign && (
									<div className="flex flex-wrap items-center gap-2">
										<Badge
											variant={
												selectedCampaign.access === "owner"
													? "default"
													: "outline"
											}
										>
											{selectedCampaign.access === "owner"
												? "Owner"
												: "Co-System"}
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/campaigns/${selectedCampaign.id}`}>
												Open Campaign
												<ExternalLink className="w-4 h-4 ml-2" />
											</Link>
										</Button>
									</div>
								)}
							</div>
						</AscendantWindow>

						{activeCampaignId && (
							<CampaignSessionsPanel campaignId={activeCampaignId} canManage />
						)}
					</>
				)}
			</div>
		</Layout>
	);
};

export default SessionPlanner;
