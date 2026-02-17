import { Layout } from '@/components/layout/Layout';
import { MarketplaceWorkbench } from '@/components/marketplace/MarketplaceWorkbench';

export default function MarketplacePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
          <p className="text-muted-foreground mb-6">
            Browse, publish, download, and review campaign-ready content with entitlement-aware access.
          </p>
        </div>
        <MarketplaceWorkbench />
      </div>
    </Layout>
  );
}
