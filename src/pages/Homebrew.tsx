import React from "react";
import { HomebrewWorkbench } from "@/components/homebrew/HomebrewWorkbench";
import { Layout } from "@/components/layout/Layout";

const Homebrew = () => {
	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8 border-b-2 border-primary/20 pb-4">
					<h1 className="font-arise text-2xl sm:text-4xl font-bold mb-4 gradient-text-shadow tracking-wider leading-tight uppercase">
						HOMEBREW STUDIO
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground font-heading mb-6 leading-relaxed">
						Create, version, publish, and share custom content for your
						campaigns.
					</p>
				</div>

				<HomebrewWorkbench />
			</div>
		</Layout>
	);
};

export default Homebrew;
