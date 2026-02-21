import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HomebrewWorkbench } from '@/components/homebrew/HomebrewWorkbench';

const Homebrew = () => {
  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
            Homebrew Studio
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
            Create, version, publish, and share custom content for your campaigns.
          </p>
        </div>

        <HomebrewWorkbench />
      </div>
    </Layout>
  );
};

export default Homebrew;
