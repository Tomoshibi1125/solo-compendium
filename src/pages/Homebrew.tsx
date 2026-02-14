import React from 'react';
import { Layout } from '@/components/layout/Layout';
import HomebrewCreator from '@/components/homebrew/HomebrewCreator';

const Homebrew = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Homebrew Creator
          </h1>
          <p className="text-muted-foreground mb-6">
            Create custom content for your System Ascendant campaigns.
          </p>
        </div>
        
        <HomebrewCreator />
      </div>
    </Layout>
  );
};

export default Homebrew;
