import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { DirectiveLattice as DirectiveLatticeComponent } from "@/components/warden-protocols/DirectiveMatrix";

const DirectiveLatticePage = () => {
	const navigate = useNavigate();

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-protocols")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Protocols
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Directive Lattice
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Synthesize operational directives and localized contracts.
						Extrapolate operational parameters, complication probabilities, and
						calculated systemic compensation.
					</DataStreamText>
				</div>

				<DirectiveLatticeComponent />
			</div>
		</Layout>
	);
};

export default DirectiveLatticePage;
