import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HomebrewWorkbench } from '@/components/homebrew/HomebrewWorkbench';

const Homebrew = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Homebrew Studio
          </h1>
          <p className="text-muted-foreground mb-6">
            Create, version, publish, and share custom content for your campaigns.
          </p>
        </div>

        <HomebrewWorkbench />
      </div>
    </Layout>
  );
};

export default Homebrew;
