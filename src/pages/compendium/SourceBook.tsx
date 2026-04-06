import { Navigate, useParams } from "react-router-dom";
// Anomaly Manifest
import { BestiaryEcologies } from "@/components/compendium/anomaly-manifest/BestiaryEcologies";
import { TheManifest } from "@/components/compendium/anomaly-manifest/TheManifest";
import { BackgroundsChapter } from "@/components/compendium/players-book/BackgroundsChapter";
import { EquipmentChapter } from "@/components/compendium/players-book/EquipmentChapter";
import { FeatsChapter } from "@/components/compendium/players-book/FeatsChapter";
// Player's Book
import { IntroChapter } from "@/components/compendium/players-book/IntroChapter";
import { JobsChapter } from "@/components/compendium/players-book/JobsChapter";
import { PathsChapter } from "@/components/compendium/players-book/PathsChapter";
import { RunesChapter } from "@/components/compendium/players-book/RunesChapter";
import { SpellsChapter } from "@/components/compendium/players-book/SpellsChapter";
import { TechniquesChapter } from "@/components/compendium/players-book/TechniquesChapter";
import { SourceBookLayout } from "@/components/compendium/SourceBookLayout";
import { GameRulesChapter } from "@/components/compendium/wardens-directive/GameRulesChapter";
import { PantheonChapter } from "@/components/compendium/wardens-directive/PantheonChapter";
import { WorldGuide } from "@/components/compendium/wardens-directive/WorldGuide";
// Warden's Directive
import { WorldOverview } from "@/components/compendium/wardens-directive/WorldOverview";

const SourceBook = () => {
	const { section } = useParams<{ section: string }>();

	// Default to intro if no section
	if (!section) {
		return <Navigate to="/source-book/intro" replace />;
	}

	const renderChapter = () => {
		switch (section) {
			// Ascendant's Guide (Player's Book)
			case "intro":
				return <IntroChapter />;
			case "backgrounds":
				return <BackgroundsChapter />;
			case "jobs":
				return <JobsChapter />;
			case "paths":
				return <PathsChapter />;
			case "feats":
				return <FeatsChapter />;
			case "techniques":
				return <TechniquesChapter />;
			case "runes":
				return <RunesChapter />;
			case "spells":
				return <SpellsChapter />;
			case "items":
				return <EquipmentChapter />;
			case "rules":
				return <GameRulesChapter />;

			// Warden's Directive
			case "world":
				return <WorldOverview />;
			case "locations":
				return <WorldGuide />;
			case "regents":
				return <PantheonChapter />;
			case "gamerules":
				return <GameRulesChapter />;

			// Anomaly Manifest
			case "ecologies":
				return <BestiaryEcologies />;
			case "anomalies":
				return <TheManifest />;

			default:
				return <Navigate to="/source-book/intro" replace />;
		}
	};

	return (
		<SourceBookLayout activeSection={section}>
			{renderChapter()}
		</SourceBookLayout>
	);
};

export default SourceBook;
