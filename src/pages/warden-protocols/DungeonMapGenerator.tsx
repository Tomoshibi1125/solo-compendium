import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { DungeonMapGenerator as DungeonMapGeneratorComponent } from "@/components/warden-protocols/DungeonMapGenerator";

const DungeonMapGeneratorPage = () => {
	const navigate = useNavigate();

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="mb-8">
					<Button
						type="button"
						variant="ghost"
						onClick={() => navigate("/warden-protocols")}
						className="mb-4"
						size="sm"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Rift Topology Protocol
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Synthesize structural parameters for dimensional Rifts. Establish
						spatial grids defining chambers, pathways, and node singularities.
					</DataStreamText>
				</div>

				<DungeonMapGeneratorComponent className="lg:min-h-[700px]" />
			</div>
		</Layout>
	);
};

export default DungeonMapGeneratorPage;
