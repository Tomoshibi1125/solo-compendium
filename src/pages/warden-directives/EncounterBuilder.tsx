import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { Button } from "@/components/ui/button";
import { EncounterBuilder as EncounterBuilderComponent } from "@/components/warden-directives/EncounterBuilder";

const EncounterBuilderPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const campaignId = searchParams.get("campaignId");

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="mb-8">
					<Button
						type="button"
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
						size="sm"
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
						Threat Vector Protocol
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Synthesize combat matrices and calculate probability of unit
						neutralization. Balance multi-planar entities against identified
						hunter ratings.
					</ManaFlowText>
				</div>

				<EncounterBuilderComponent
					campaignId={campaignId}
					className="lg:min-h-[700px]"
				/>
			</div>
		</Layout>
	);
};

export default EncounterBuilderPage;
