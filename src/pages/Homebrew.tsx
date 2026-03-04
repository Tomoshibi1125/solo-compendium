import { HomebrewWorkbench } from "@/components/homebrew/HomebrewWorkbench";
import { Layout } from "@/components/layout/Layout";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";

const Homebrew = () => {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8 border-b-2 border-primary/20 pb-4">
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-4"
					>
						Genesis Studio
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="mb-6 text-sm sm:text-base"
					>
						Architect, version, and authorize custom dimensional phenomena for
						your domains.
					</DataStreamText>
				</div>

				<HomebrewWorkbench />
			</div>
		</Layout>
	);
};

export default Homebrew;
