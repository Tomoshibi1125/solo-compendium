import { HomebrewWorkbench } from "@/components/homebrew/HomebrewWorkbench";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";

const Homebrew = () => {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8 border-b-2 border-primary/20 pb-4">
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-4"
					>
						Genesis Studio
					</RiftHeading>
					<ManaFlowText
						variant="rift"
						speed="slow"
						className="mb-6 text-sm sm:text-base"
					>
						Architect, version, and authorize custom dimensional phenomena for
						your domains.
					</ManaFlowText>
				</div>

				<HomebrewWorkbench />
			</div>
		</Layout>
	);
};

export default Homebrew;
