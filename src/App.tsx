import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Compendium from "./pages/Compendium";
import CompendiumDetail from "./pages/compendium/CompendiumDetail";
import Characters from "./pages/Characters";
import DMTools from "./pages/DMTools";
import DiceRoller from "./pages/DiceRoller";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/compendium" element={<Compendium />} />
          <Route path="/compendium/:type/:id" element={<CompendiumDetail />} />
          <Route path="/characters/*" element={<Characters />} />
          <Route path="/dm-tools/*" element={<DMTools />} />
          <Route path="/dice" element={<DiceRoller />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
