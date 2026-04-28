import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect, useState } from "react";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useParams,
} from "react-router-dom";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MainLayout } from "@/components/layout/MainLayout";
import {
	LoadingIndicator,
	NetworkErrorBoundary,
} from "@/components/NetworkErrorHandling";
import PerformancePreload from "@/components/PerformancePreload";
import { OfflineStatus } from "@/components/pwa/PWAComponents";
import { RouteEffects } from "@/components/RouteEffects";
import { AnalyticsConsentBanner } from "@/components/ui/AnalyticsConsentBanner";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { GlobalEffects } from "@/components/ui/GlobalEffects";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { ServiceWorkerUpdatePrompt } from "@/components/ui/ServiceWorkerUpdatePrompt";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { useDomainEventQuerySync } from "@/hooks/useDomainEventQuerySync";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useOfflineCacheWarmer } from "@/hooks/useOfflineCacheWarmer";
import { useOfflineSyncStatus } from "@/hooks/useOfflineSyncStatus";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useStartupData } from "@/hooks/useStartupData";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { AuthProvider, useAuth } from "@/lib/auth/authContext";
import { migrateLegacyConditions } from "@/lib/conditionSystem";
import { validateEnv } from "@/lib/envValidation";
import { useFeatureFlags } from "@/lib/featureFlags";
import { setCommandPaletteOpener } from "@/lib/globalShortcuts";
import { warn as logWarn } from "@/lib/logger";
import { runProficiencyPatch } from "@/lib/maintenance/ProficiencyPatch";
import { PerformanceProvider } from "@/lib/performanceProfile";
import { getRuntimeEnvValue, normalizeBasePath } from "@/lib/runtimeEnv";
import { isSetupRouteEnabled } from "@/lib/setupAccess";

const Login = lazy(() => import("./pages/Login"));
const AscendantTools = lazy(() => import("./pages/AscendantTools"));
const TestUserSetup = lazy(() => import("./pages/TestUserSetup"));

// Validate environment variables on app startup (non-blocking; setup mode is supported)
const envResult = validateEnv();
if (!envResult.valid) {
	logWarn(
		`Missing required environment variables:\n${envResult.missing
			.map((v) => `  - ${v}`)
			.join("\n")}\n\nThe app will run in setup/guest mode until configured.`,
	);
}

// Ensure condition system is initialized for legacy compatibility
try {
	migrateLegacyConditions([]);
} catch (_e) {
	// silent
}

if (envResult.warnings.length > 0) {
	envResult.warnings.forEach((w) => {
		logWarn(w);
	});
}

// Lazy load routes for code splitting
const Compendium = lazy(() => import("./pages/Compendium"));
const CompendiumDetail = lazy(
	() => import("./pages/compendium/CompendiumDetail"),
);
const Characters = lazy(() => import("./pages/Characters"));
const CharacterSheet = lazy(
	() => import("./components/character-v2/CharacterSheetV2"),
);
const CharacterNew = lazy(() => import("./pages/CharacterNew"));
const Admin = lazy(() => import("./pages/Admin"));
const ContentAudit = lazy(() => import("./pages/admin/ContentAudit"));
const ArtGeneration = lazy(() => import("./pages/admin/ArtGeneration"));
const FeatureChoicesAdmin = lazy(
	() => import("./pages/admin/FeatureChoicesAdmin"),
);
const WardenProtocols = lazy(() => import("./pages/WardenProtocols"));
const EncounterBuilder = lazy(
	() => import("./pages/warden-directives/EncounterBuilder"),
);
const InitiativeTracker = lazy(
	() => import("./pages/warden-directives/InitiativeTracker"),
);
const RollableTables = lazy(
	() => import("./pages/warden-directives/RollableTables"),
);
const GateGenerator = lazy(
	() => import("./pages/warden-directives/GateGenerator"),
);
const NPCGenerator = lazy(
	() => import("./pages/warden-directives/NPCGenerator"),
);
const TreasureGenerator = lazy(
	() => import("./pages/warden-directives/TreasureGenerator"),
);
const DirectiveLattice = lazy(
	() => import("./pages/warden-directives/DirectiveMatrix"),
);
const SessionPlanner = lazy(
	() => import("./pages/warden-directives/SessionPlanner"),
);
const RandomEventGenerator = lazy(
	() => import("./pages/warden-directives/RandomEventGenerator"),
);
const RelicWorkshop = lazy(
	() => import("./pages/warden-directives/RelicWorkshop"),
);
const PartyTracker = lazy(
	() => import("./pages/warden-directives/PartyTracker"),
);
const PartyStash = lazy(() => import("./pages/PartyStash"));
const DungeonMapGeneratorPage = lazy(
	() => import("./pages/warden-directives/DungeonMapGenerator"),
);
// Map generator was merged into gate-generator
const TokenLibrary = lazy(
	() => import("./pages/warden-directives/TokenLibrary"),
);
const ArtGeneratorWarden = lazy(
	() => import("./pages/warden-directives/ArtGenerator"),
);
const AudioManagerWarden = lazy(
	() => import("./pages/warden-directives/AudioManager"),
);
const VTTMap = lazy(() => import("./pages/warden-directives/VTTMap"));
const VTTEnhanced = lazy(() => import("./pages/warden-directives/VTTEnhanced"));
const VTTSpectator = lazy(
	() => import("./pages/warden-directives/VTTSpectator"),
);
const VTTJournal = lazy(() => import("./pages/warden-directives/VTTJournal"));
const AscendantMapView = lazy(
	() => import("./pages/ascendant-tools/AscendantMapView"),
);
const DiceRoller = lazy(() => import("./pages/DiceRoller"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CampaignDetail = lazy(() => import("./pages/CampaignDetail"));
const CampaignBookView = lazy(() => import("./pages/CampaignBookView"));
const CampaignJoin = lazy(() => import("./pages/CampaignJoin"));
const CampaignSessionPlay = lazy(() => import("./pages/CampaignSessionPlay"));
const Guilds = lazy(() => import("./pages/Guilds"));
const GuildDetail = lazy(() => import("./pages/GuildDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Homebrew = lazy(() => import("./pages/Homebrew"));
const MarketplacePage = lazy(() => import("./pages/Marketplace"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Landing = lazy(() => import("./pages/Landing"));
const Setup = lazy(() => import("./pages/Setup"));
const SourceBook = lazy(() => import("./pages/compendium/SourceBook"));

const CatchAllRedirect = () => {
	const { user, loading } = useAuth();
	const setupRouteEnabled = isSetupRouteEnabled();

	if (loading) {
		return <PageLoader />;
	}

	if (!isSupabaseConfigured) {
		return <Navigate to={setupRouteEnabled ? "/setup" : "/login"} replace />;
	}

	if (user) {
		return <Navigate to="/landing" replace />;
	}

	return <Navigate to="/login" replace />;
};
const AscendantToolDetail = lazy(() => import("./pages/AscendantToolDetail"));

const LegacyPlayerToolsRedirect = () => {
	const { toolId } = useParams<{ toolId: string }>();
	return (
		<Navigate
			to={toolId ? `/ascendant-tools/${toolId}` : "/ascendant-tools"}
			replace
		/>
	);
};

// Configure React Query with better caching and error handling
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				// Don't retry on authentication errors
				if (
					error instanceof Error &&
					error.message.includes("Not authenticated")
				) {
					return false;
				}
				// Retry network errors up to 2 times
				return failureCount < 2;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

// Loading fallback component
const PageLoader = () => (
	<div className="flex items-center justify-center min-h-screen">
		<LoadingIndicator />
	</div>
);

// Inner component that uses router hooks - must be inside BrowserRouter
const AppContent = () => {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
	const isE2E = import.meta.env.VITE_E2E === "true";
	const setupRouteEnabled = isSetupRouteEnabled();
	const { user } = useAuth();
	const { isSupported, permission, requestPermission } = usePushNotifications();

	// Enable global keyboard shortcuts (must be inside Router context)
	useGlobalShortcuts(true);

	// Warm IndexedDB offline cache with compendium + character data
	useOfflineCacheWarmer();

	// Bridge DomainEventBus → React Query cache invalidation (DDB/Foundry parity)
	// Automatically refetches spell slots, character data, etc. on spell:cast, rest, levelup
	useDomainEventQuerySync();

	// Enable background sync for offline → online data reconciliation (DDB parity)
	useBackgroundSync();

	// Prefetch compendium data into React Query cache for faster navigation
	useStartupData();

	// Load feature flags from environment (used by components to gate features)
	const _featureFlags = useFeatureFlags();

	// Register command palette opener
	useEffect(() => {
		setCommandPaletteOpener(() => setCommandPaletteOpen(true));
	}, []);

	// Prompt for push notifications when user logs in
	useEffect(() => {
		if (user && isSupported && permission === "default") {
			const timeout = setTimeout(() => {
				requestPermission();
			}, 5000); // Wait 5 seconds after login before prompting
			return () => clearTimeout(timeout);
		}
	}, [user, isSupported, permission, requestPermission]);

	// Protocol: Automated Data Synchronization (Zero-Legacy)
	useEffect(() => {
		if (user) {
			runProficiencyPatch();
		}
	}, [user]);

	return (
		<MainLayout>
			{isSupabaseConfigured && (
				<CommandPalette
					open={commandPaletteOpen}
					onOpenChange={setCommandPaletteOpen}
				/>
			)}
			<Routes>
				<Route
					path="/"
					element={
						<Suspense fallback={<PageLoader />}>
							{isE2E ? <Navigate to="/compendium" replace /> : <Landing />}
						</Suspense>
					}
				/>

				{/* E2E testing route - only available in E2E mode */}
				{isE2E && (
					<Route
						path="/e2e-login"
						element={
							<Suspense fallback={<PageLoader />}>
								<Login />
							</Suspense>
						}
					/>
				)}
				<Route
					path="/login"
					element={
						<Suspense fallback={<PageLoader />}>
							<Login />
						</Suspense>
					}
				/>
				<Route
					path="/auth/callback"
					element={
						<Suspense fallback={<PageLoader />}>
							<AuthCallback />
						</Suspense>
					}
				/>
				<Route
					path="/landing"
					element={
						<Suspense fallback={<PageLoader />}>
							<Landing />
						</Suspense>
					}
				/>
				<Route
					path="/homebrew"
					element={
						<Suspense fallback={<PageLoader />}>
							<Homebrew />
						</Suspense>
					}
				/>
				<Route
					path="/marketplace"
					element={
						<Suspense fallback={<PageLoader />}>
							<MarketplacePage />
						</Suspense>
					}
				/>
				<Route
					path="/ascendant-tools"
					element={
						<Suspense fallback={<PageLoader />}>
							<AscendantTools />
						</Suspense>
					}
				/>
				<Route
					path="/ascendant-tools/map"
					element={
						<Suspense fallback={<PageLoader />}>
							<AscendantMapView />
						</Suspense>
					}
				/>
				<Route
					path="/ascendant-tools/:toolId"
					element={
						<Suspense fallback={<PageLoader />}>
							<AscendantToolDetail />
						</Suspense>
					}
				/>
				{/* Legacy /player-tools/* redirects for bookmarked URLs. */}
				<Route
					path="/player-tools"
					element={<Navigate to="/ascendant-tools" replace />}
				/>
				<Route
					path="/player-tools/map"
					element={<Navigate to="/ascendant-tools/map" replace />}
				/>
				<Route
					path="/player-tools/:toolId"
					element={<LegacyPlayerToolsRedirect />}
				/>
				<Route
					path="/compendium"
					element={
						<Suspense fallback={<PageLoader />}>
							<Compendium />
						</Suspense>
					}
				/>
				<Route
					path="/compendium/:type/:id"
					element={
						<Suspense fallback={<PageLoader />}>
							<CompendiumDetail />
						</Suspense>
					}
				/>
				<Route
					path="/source-book"
					element={
						<Suspense fallback={<PageLoader />}>
							<SourceBook />
						</Suspense>
					}
				/>
				<Route
					path="/source-book/:section"
					element={
						<Suspense fallback={<PageLoader />}>
							<SourceBook />
						</Suspense>
					}
				/>
				<Route
					path="/characters"
					element={
						<Suspense fallback={<PageLoader />}>
							<Characters />
						</Suspense>
					}
				/>
				<Route
					path="/characters/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<CharacterNew />
						</Suspense>
					}
				/>
				<Route
					path="/characters/:id"
					element={
						<Suspense fallback={<PageLoader />}>
							<CharacterSheet />
						</Suspense>
					}
				/>

				<Route
					path="/warden-directives/rift-console"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Suspense fallback={<PageLoader />}>
								<Admin />
							</Suspense>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/warden-directives/selection-protocols"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Suspense fallback={<PageLoader />}>
								<FeatureChoicesAdmin />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/content-audit"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Suspense fallback={<PageLoader />}>
								<ContentAudit />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/art-generation"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Suspense fallback={<PageLoader />}>
								<ArtGeneration />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Navigate to="/warden-directives/rift-console" replace />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/art-generation"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Navigate to="/warden-directives/art-generation" replace />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/audit"
					element={
						<ProtectedRoute requireWarden allowGuest={false}>
							<Navigate to="/warden-directives/content-audit" replace />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-protocols"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<WardenProtocols />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives"
					element={<Navigate to="/warden-protocols" replace />}
				/>
				<Route
					path="/warden-directives/encounter-builder"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<EncounterBuilder />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/initiative-tracker"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<InitiativeTracker />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/rollable-tables"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<RollableTables />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/gate-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<GateGenerator />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/npc-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<NPCGenerator />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/treasure-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<TreasureGenerator />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/quest-generator"
					element={
						<Navigate to="/warden-directives/directive-lattice" replace />
					}
				/>
				<Route
					path="/warden-directives/campaign-manager"
					element={<Navigate to="/warden-directives" replace />}
				/>
				<Route
					path="/warden-directives/directive-lattice"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<DirectiveLattice />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/session-planner"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<SessionPlanner />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/random-event-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<RandomEventGenerator />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/relic-workshop"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<RelicWorkshop />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/party-tracker"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<PartyTracker />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/party-stash"
					element={
						<Suspense fallback={<PageLoader />}>
							<PartyStash />
						</Suspense>
					}
				/>
				<Route
					path="/warden-directives/dungeon-map-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<DungeonMapGeneratorPage />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/token-library"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<TokenLibrary />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/art-generator"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<ArtGeneratorWarden />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/audio-manager"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<AudioManagerWarden />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/vtt-map"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<VTTMap />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				{/* Standalone VTT routes — no campaign required */}
				<Route
					path="/warden-directives/vtt"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<VTTEnhanced />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/journal"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<VTTJournal />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/vtt-enhanced"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<VTTEnhanced />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/warden-directives/vtt-journal"
					element={
						<ProtectedRoute requireWarden>
							<Suspense fallback={<PageLoader />}>
								<VTTJournal />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/campaigns/:campaignId/vtt"
					element={
						<Suspense fallback={<PageLoader />}>
							<VTTEnhanced />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/:campaignId/vtt/spectate"
					element={
						<Suspense fallback={<PageLoader />}>
							<VTTSpectator />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/:campaignId/journal"
					element={
						<Suspense fallback={<PageLoader />}>
							<VTTJournal />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/:campaignId/play/:sessionId"
					element={
						<Suspense fallback={<PageLoader />}>
							<CampaignSessionPlay />
						</Suspense>
					}
				/>
				<Route
					path="/dice"
					element={
						<Suspense fallback={<PageLoader />}>
							<DiceRoller />
						</Suspense>
					}
				/>
				<Route
					path="/favorites"
					element={
						<Suspense fallback={<PageLoader />}>
							<Favorites />
						</Suspense>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute allowGuest={false}>
							<Suspense fallback={<PageLoader />}>
								<Profile />
							</Suspense>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/campaigns"
					element={
						<Suspense fallback={<PageLoader />}>
							<Campaigns />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/join"
					element={
						<Suspense fallback={<PageLoader />}>
							<CampaignJoin />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/join/:shareCode"
					element={
						<Suspense fallback={<PageLoader />}>
							<CampaignJoin />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/:id"
					element={
						<Suspense fallback={<PageLoader />}>
							<CampaignDetail />
						</Suspense>
					}
				/>
				<Route
					path="/campaigns/:id/book"
					element={
						<Suspense fallback={<PageLoader />}>
							<CampaignBookView />
						</Suspense>
					}
				/>
				{/* Guild Routes */}
				<Route
					path="/guilds"
					element={
						<Suspense fallback={<PageLoader />}>
							<Guilds />
						</Suspense>
					}
				/>
				<Route
					path="/guilds/join"
					element={
						<Suspense fallback={<PageLoader />}>
							<Guilds />
						</Suspense>
					}
				/>
				<Route
					path="/guilds/:id"
					element={
						<Suspense fallback={<PageLoader />}>
							<GuildDetail />
						</Suspense>
					}
				/>
				<Route
					path="/auth"
					element={
						<Suspense fallback={<PageLoader />}>
							<Auth />
						</Suspense>
					}
				/>
				<Route
					path="/test-setup"
					element={
						<Suspense fallback={<PageLoader />}>
							<TestUserSetup />
						</Suspense>
					}
				/>
				<Route
					path="/setup"
					element={
						setupRouteEnabled ? (
							<Suspense fallback={<PageLoader />}>
								<Setup />
							</Suspense>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route path="*" element={<CatchAllRedirect />} />
			</Routes>
		</MainLayout>
	);
};

const App = () => {
	const routerBase = normalizeBasePath(
		getRuntimeEnvValue("VITE_ROUTER_BASE") ||
			getRuntimeEnvValue("VITE_BASE_PATH") ||
			import.meta.env.BASE_URL,
	);
	const { isOnline, queueLength } = useOfflineSyncStatus();

	return (
		<ErrorBoundary>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				forcedTheme="dark"
				disableTransitionOnChange
			>
				<NetworkErrorBoundary>
					<QueryClientProvider client={queryClient}>
						<TooltipProvider>
							<PerformanceProvider>
								<AuthProvider>
									<CosmicBackground variant="default" intensity="medium" />
									<GlobalEffects />
									<PerformancePreload />
									<Toaster />
									<Sonner />
									<BrowserRouter basename={routerBase}>
										<RouteEffects />
										<PageViewTracker />
										<ErrorBoundary>
											<AppContent />
										</ErrorBoundary>
									</BrowserRouter>
									<ServiceWorkerUpdatePrompt />
									<OfflineIndicator />
									<OfflineStatus
										isOnline={isOnline}
										connectionType="unknown"
										syncQueueLength={queueLength}
									/>
									<AnalyticsConsentBanner />
									<Analytics />
									<SpeedInsights />
								</AuthProvider>
							</PerformanceProvider>
						</TooltipProvider>
					</QueryClientProvider>
				</NetworkErrorBoundary>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

export default App;
