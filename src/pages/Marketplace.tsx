import { Layout } from "@/components/layout/Layout";
import { MarketplaceWorkbench } from "@/components/marketplace/MarketplaceWorkbench";
import { ManaFlowText } from "@/components/ui/AscendantText";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MarketplacePage() {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<PageHeader
					className="mb-6 sm:mb-8"
					title="System Exchange"
					description={
						<ManaFlowText variant="rift" speed="slow">
							Browse, acquire, and deploy authorized modules into your active
							dimensional domains.
						</ManaFlowText>
					}
				/>
				<MarketplaceWorkbench />
			</div>
		</Layout>
	);
}
