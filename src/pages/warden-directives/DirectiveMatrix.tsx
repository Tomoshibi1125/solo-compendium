import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { Button } from "@/components/ui/button";
import { DirectiveLattice as DirectiveLatticeComponent } from "@/components/warden-directives/DirectiveMatrix";

const DirectiveLatticePage = () => {
	const navigate = useNavigate();

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
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Directive Lattice
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Synthesize operational directives and localized contracts.
						Extrapolate operational parameters, complication probabilities, and
						calculated systemic compensation.
					</ManaFlowText>
				</div>

				<DirectiveLatticeComponent />
			</div>
		</Layout>
	);
};

export default DirectiveLatticePage;
