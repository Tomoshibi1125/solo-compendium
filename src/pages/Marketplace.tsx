import { Layout } from "@/components/layout/Layout";
import { MarketplaceWorkbench } from "@/components/marketplace/MarketplaceWorkbench";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";

export default function MarketplacePage() {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8">
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						System Exchange
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="mb-6">
						Browse, acquire, and deploy authorized modules into your active
						dimensional domains.
					</ManaFlowText>
				</div>
				<MarketplaceWorkbench />
			</div>
		</Layout>
	);
}
