import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import Index from "./pages/Index";

// Lazy load routes for code splitting
const Compendium = lazy(() => import("./pages/Compendium"));
const CompendiumDetail = lazy(() => import("./pages/compendium/CompendiumDetail"));
const Characters = lazy(() => import("./pages/Characters"));
const CharacterSheet = lazy(() => import("./pages/CharacterSheet"));
const CharacterNew = lazy(() => import("./pages/CharacterNew"));
const CharacterLevelUp = lazy(() => import("./pages/CharacterLevelUp"));
const Admin = lazy(() => import("./pages/Admin"));
const DMTools = lazy(() => import("./pages/DMTools"));
const EncounterBuilder = lazy(() => import("./pages/dm-tools/EncounterBuilder"));
const InitiativeTracker = lazy(() => import("./pages/dm-tools/InitiativeTracker"));
const RollableTables = lazy(() => import("./pages/dm-tools/RollableTables"));
const GateGenerator = lazy(() => import("./pages/dm-tools/GateGenerator"));
const NPCGenerator = lazy(() => import("./pages/dm-tools/NPCGenerator"));
const DiceRoller = lazy(() => import("./pages/DiceRoller"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CampaignDetail = lazy(() => import("./pages/CampaignDetail"));
const CampaignJoin = lazy(() => import("./pages/CampaignJoin"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  // Enable global keyboard shortcuts (must be inside Router context)
  useGlobalShortcuts(true);
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Index />
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
        path="/admin"
        element={
          <Suspense fallback={<PageLoader />}>
            <Admin />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools"
        element={
          <Suspense fallback={<PageLoader />}>
            <DMTools />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/encounter-builder"
        element={
          <Suspense fallback={<PageLoader />}>
            <EncounterBuilder />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/initiative-tracker"
        element={
          <Suspense fallback={<PageLoader />}>
            <InitiativeTracker />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/rollable-tables"
        element={
          <Suspense fallback={<PageLoader />}>
            <RollableTables />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/gate-generator"
        element={
          <Suspense fallback={<PageLoader />}>
            <GateGenerator />
          </Suspense>
        }
      />
      <Route
        path="/dm-tools/npc-generator"
        element={
          <Suspense fallback={<PageLoader />}>
            <NPCGenerator />
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
        path="*"
        element={
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
