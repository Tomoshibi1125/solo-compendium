import { MeridianAtlas } from "@/components/compendium/MeridianAtlas";
import { Layout } from "@/components/layout/Layout";

export default function MeridianCity() {
	return (
		<Layout>
			<div className="container mx-auto max-w-6xl px-4 py-8">
				<MeridianAtlas />
			</div>
		</Layout>
	);
}
