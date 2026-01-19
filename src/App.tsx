import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkErrorBoundary } from "@/components/NetworkErrorHandling";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ServiceWorkerUpdatePrompt } from "@/components/ui/ServiceWorkerUpdatePrompt";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { AnalyticsConsentBanner } from "@/components/ui/AnalyticsConsentBanner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { setCommandPaletteOpener } from "@/lib/globalShortcuts";
import { setSentryUser } from "@/lib/sentry";
import { trackEvent, identifyUser, resetUser, AnalyticsEvents } from "@/lib/analytics";
import { validateEnv } from "@/lib/envValidation";
import { AuthProvider } from "@/lib/auth/authContext";
import { warn as logWarn } from "@/lib/logger";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import GlobalEffects from "@/components/ui/GlobalEffects";
import Login from "./pages/Login";
import PlayerTools from "./pages/PlayerTools";

// Validate environment variables on app startup (non-blocking; setup mode is supported)
const envResult = validateEnv();
if (!envResult.valid) {
  logWarn(
    `Missing required environment variables:\n${envResult.missing
      .map((v) => `  - ${v}`)
      .join("\n")}\n\nThe app will run in setup/guest mode until configured.`
  );
}
if (envResult.warnings.length > 0) {
  envResult.warnings.forEach((w) => logWarn(w));
}

// Lazy load routes for code splitting
const Compendium = lazy(() => import("./pages/Compendium"));
const CompendiumDetail = lazy(() => import("./pages/compendium/CompendiumDetail"));
const Characters = lazy(() => import("./pages/Characters"));
const CharacterSheet = lazy(() => import("./pages/CharacterSheet"));
const CharacterNew = lazy(() => import("./pages/CharacterNew"));
const CharacterLevelUp = lazy(() => import("./pages/CharacterLevelUp"));
const Admin = lazy(() => import("./pages/Admin"));
const ContentAudit = lazy(() => import("./pages/admin/ContentAudit"));
const ArtGeneration = lazy(() => import("./pages/admin/ArtGeneration"));
const DMTools = lazy(() => import("./pages/DMTools"));
const EncounterBuilder = lazy(() => import("./pages/dm-tools/EncounterBuilder"));
const InitiativeTracker = lazy(() => import("./pages/dm-tools/InitiativeTracker"));
const RollableTables = lazy(() => import("./pages/dm-tools/RollableTables"));
const GateGenerator = lazy(() => import("./pages/dm-tools/GateGenerator"));
const NPCGenerator = lazy(() => import("./pages/dm-tools/NPCGenerator"));
const TreasureGenerator = lazy(() => import("./pages/dm-tools/TreasureGenerator"));
const QuestGenerator = lazy(() => import("./pages/dm-tools/QuestGenerator"));
const SessionPlanner = lazy(() => import("./pages/dm-tools/SessionPlanner"));
const RandomEventGenerator = lazy(() => import("./pages/dm-tools/RandomEventGenerator"));
const RelicWorkshop = lazy(() => import("./pages/dm-tools/RelicWorkshop"));
const PartyTracker = lazy(() => import("./pages/dm-tools/PartyTracker"));
const DungeonMapGenerator = lazy(() => import("./pages/dm-tools/DungeonMapGenerator"));
const TokenLibrary = lazy(() => import("./pages/dm-tools/TokenLibrary"));
const ArtGeneratorDM = lazy(() => import("./pages/dm-tools/ArtGenerator"));
const AudioManagerDM = lazy(() => import("./pages/dm-tools/AudioManager"));
const VTTMap = lazy(() => import("./pages/dm-tools/VTTMap"));
const VTTEnhanced = lazy(() => import("./pages/dm-tools/VTTEnhanced"));
const VTTJournal = lazy(() => import("./pages/dm-tools/VTTJournal"));
const DiceRoller = lazy(() => import("./pages/DiceRoller"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CampaignDetail = lazy(() => import("./pages/CampaignDetail"));
const CampaignJoin = lazy(() => import("./pages/CampaignJoin"));
const CharacterCompare = lazy(() => import("./pages/CharacterCompare"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Landing = lazy(() => import("./pages/Landing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Setup = lazy(() => import("./pages/Setup"));
const PlayerToolDetail = lazy(() => import("./pages/PlayerToolDetail"));

// Configure React Query with better caching and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on authentication errors
        if (error instanceof Error && error.message.includes('Not authenticated')) {
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
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Inner component that uses router hooks - must be inside BrowserRouter
const AppContent = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const isE2E = import.meta.env.VITE_E2E === 'true';
  
  // Enable global keyboard shortcuts (must be inside Router context)
  useGlobalShortcuts(true);
  
  // Register command palette opener
  useEffect(() => {
    setCommandPaletteOpener(() => setCommandPaletteOpen(true));
  }, []);
  
  return (
    <>
      {isSupabaseConfigured && (
        <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      )}
      <Routes>
      {(!isSupabaseConfigured && !isE2E) ? (
        <>
          <Route
            path="/setup"
            element={
              <Suspense fallback={<PageLoader />}>
                <Setup />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </>
      ) : (
        <>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<PageLoader />}>
            {isE2E ? <Navigate to="/compendium" replace /> : <Login />}
          </Suspense>
        } 
      />
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
        path="/player-tools"
        element={
          <Suspense fallback={<PageLoader />}>
            <PlayerTools />
          </Suspense>
        }
      />
      <Route
        path="/player-tools/:toolId"
        element={
          <Suspense fallback={<PageLoader />}>
            <PlayerToolDetail />
          </Suspense>
        }
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
        path="/characters/:id/level-up"
        element={
          <Suspense fallback={<PageLoader />}>
            <CharacterLevelUp />
          </Suspense>
        }
      />
      <Route
        path="/characters/compare"
        element={
          <Suspense fallback={<PageLoader />}>
            <CharacterCompare />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/system-console"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <Admin />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/content-audit"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <ContentAudit />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/art-generation"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <ArtGeneration />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireDM>
            <Navigate to="/dm-tools/system-console" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/art-generation"
        element={
          <ProtectedRoute requireDM>
            <Navigate to="/dm-tools/art-generation" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute requireDM>
            <Navigate to="/dm-tools/content-audit" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <DMTools />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/encounter-builder"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <EncounterBuilder />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/initiative-tracker"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <InitiativeTracker />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/rollable-tables"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <RollableTables />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/gate-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <GateGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/npc-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <NPCGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/treasure-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <TreasureGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/quest-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <QuestGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/session-planner"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <SessionPlanner />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/random-event-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <RandomEventGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/relic-workshop"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <RelicWorkshop />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/party-tracker"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <PartyTracker />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/dungeon-map-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <DungeonMapGenerator />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/token-library"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <TokenLibrary />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/art-generator"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <ArtGeneratorDM />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/audio-manager"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <AudioManagerDM />
          </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dm-tools/vtt-map"
        element={
          <ProtectedRoute requireDM>
          <Suspense fallback={<PageLoader />}>
            <VTTMap />
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
        path="/campaigns/:campaignId/journal"
        element={
          <Suspense fallback={<PageLoader />}>
            <VTTJournal />
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
        path="/auth"
        element={
          <Suspense fallback={<PageLoader />}>
            <Auth />
          </Suspense>
        }
      />
      <Route
        path="/setup"
        element={
          <Suspense fallback={<PageLoader />}>
            <Setup />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        }
      />
        </>
      )}
    </Routes>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <NetworkErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
            <GlobalEffects />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PageViewTracker />
              <AppContent />
            </BrowserRouter>
            <ServiceWorkerUpdatePrompt />
            <OfflineIndicator />
            <AnalyticsConsentBanner />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </NetworkErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
