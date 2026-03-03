import { Layout } from "@/components/layout/Layout";
import { MarketplaceWorkbench } from "@/components/marketplace/MarketplaceWorkbench";

export default function MarketplacePage() {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
						Marketplace
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
						Browse, publish, download, and review campaign-ready content with
						entitlement-aware access.
					</p>
				</div>
				<MarketplaceWorkbench />
			</div>
		</Layout>
	);
}
