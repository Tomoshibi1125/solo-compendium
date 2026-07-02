import { HomebrewWorkbench } from "@/components/homebrew/HomebrewWorkbench";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText } from "@/components/ui/AscendantText";
import { PageHeader } from "@/components/ui/PageHeader";

const Homebrew = () => {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<PageHeader
					className="mb-6 sm:mb-8"
					title="Genesis Studio"
					description={
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-sm sm:text-base"
						>
							Architect, version, and authorize custom dimensional phenomena for
							your domains.
						</ManaFlowText>
					}
				/>

				<HomebrewWorkbench />
			</div>
		</Layout>
	);
};

export default Homebrew;
