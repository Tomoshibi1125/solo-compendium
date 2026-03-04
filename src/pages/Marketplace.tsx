import { Layout } from "@/components/layout/Layout";
import { MarketplaceWorkbench } from "@/components/marketplace/MarketplaceWorkbench";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";

export default function MarketplacePage() {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8">
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						System Exchange
					</SystemHeading>
					<DataStreamText variant="system" speed="slow" className="mb-6">
						Browse, acquire, and deploy authorized modules into your active
						dimensional domains.
					</DataStreamText>
				</div>
				<MarketplaceWorkbench />
			</div>
		</Layout>
	);
}
