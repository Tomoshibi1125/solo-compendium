import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CampaignSessionsPanel } from "@/components/campaign/CampaignSessionsPanel";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
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
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
						SESSION PLANNER
					</h1>
					<p className="text-muted-foreground font-heading">
						Campaign-backed session schedule and session logs with offline sync.
					</p>
				</div>

				{isLoading ? (
					<SystemWindow title="LOADING CAMPAIGNS">
						<p className="text-sm text-muted-foreground">
							Loading campaigns...
						</p>
					</SystemWindow>
				) : manageableCampaigns.length === 0 ? (
					<SystemWindow title="NO CAMPAIGNS AVAILABLE">
						<div className="space-y-3 text-sm text-muted-foreground">
							<p>
								Create or join a campaign with Protocol Warden access to plan
								sessions.
							</p>
							<Button onClick={() => navigate("/campaigns")}>
								Open Campaigns
							</Button>
						</div>
					</SystemWindow>
				) : (
					<>
						<SystemWindow title="ACTIVE CAMPAIGN">
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
						</SystemWindow>

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
