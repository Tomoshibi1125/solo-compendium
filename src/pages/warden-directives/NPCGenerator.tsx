import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { Button } from "@/components/ui/button";
import { NPCGenerator as NPCGeneratorComponent } from "@/components/warden-directives/NPCGenerator";

const NPCGeneratorPage = () => {
	const navigate = useNavigate();

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
						Construct Synthesis Protocol
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Instantiate semi-autonomous conceptual entities possessing distinct
						motivations, encrypted parameters, and idiosyncratic behaviors.
					</ManaFlowText>
				</div>

				<NPCGeneratorComponent className="lg:min-h-[600px]" />
			</div>
		</Layout>
	);
};

export default NPCGeneratorPage;
