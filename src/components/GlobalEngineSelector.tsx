// GLOBAL ENGINE SELECTION COMPONENT - SIMPLIFIED USER EXPERIENCE
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { engineManager, type EngineCapabilities } from '../lib/globalEngineManager';
import { 
  Gamepad2, 
  Box, 
  Zap, 
  Cpu, 
  Monitor, 
  Settings, 
  TrendingUp,
  BookOpen,
  Star,
  Rocket,
  Globe,
  Layers
} from 'lucide-react';

interface EngineSelectorProps {
  onEngineSelect?: (engine: EngineCapabilities) => void;
  onStackSelect?: (stack: any) => void;
  showComparison?: boolean;
  defaultUseCase?: '3d-graphics' | '2d-game' | 'physics-simulation' | 'data-visualization' | 'webgpu-graphics';
}

export function GlobalEngineSelector({ 
  onEngineSelect, 
  onStackSelect, 
  showComparison = false,
  defaultUseCase = '3d-graphics' 
}: EngineSelectorProps) {
  // AUTOMATIC BEST ENGINE SELECTION - NO USER CHOICE NEEDED
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [comparison, setComparison] = useState<{ engine1: string; engine2: string } | null>(null);

  // Get the best engine automatically for the use case
  const bestEngine = engineManager.getBestEngineForUseCase(defaultUseCase);
  
  // Auto-select the best engine
  useEffect(() => {
    if (bestEngine) {
      setSelectedEngine(bestEngine.name);
      if (onEngineSelect) {
        onEngineSelect(bestEngine);
      }
    }
  }, [defaultUseCase]);

  // Initialize the best engine automatically
  useEffect(() => {
    const bestEngine = engineManager.getBestEngineForUseCase(defaultUseCase);
    if (bestEngine) {
      setSelectedEngine(bestEngine.name);
      if (onEngineSelect) {
        onEngineSelect(bestEngine);
      }
    }
  }, []);

  const handleEngineSelect = (engineName: string) => {
    const engine = engineManager.getEngine(engineName);
    if (engine && onEngineSelect) {
      onEngineSelect(engine);
    }
    setSelectedEngine(engineName);
  };

  const handleStackSelect = () => {
    const stack = engineManager.getRecommendedStack(defaultUseCase);
    if (stack && onStackSelect) {
      onStackSelect(stack);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLearningCurveColor = (curve: string) => {
    switch (curve) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '3d': return <Box className="w-4 h-4" />;
      case '2d': return <Monitor className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'physics': return <Zap className="w-4 h-4" />;
      case 'rendering': return <Layers className="w-4 h-4" />;
      case 'webgpu': return <Cpu className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header - Clean and Simple */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Best Engine Auto-Selected
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          You're using the best engine available for your needs. No configuration needed!
        </p>
      </div>

      {/* Current Engine Display */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-green-500" />
            Your Active Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {selectedEngine || 'Loading...'}
              </h3>
              <p className="text-white text-sm">
                Automatically optimized for your use case
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => {
                  const bestEngine = engineManager.getBestEngineForUseCase(defaultUseCase);
                  if (bestEngine && bestEngine.name !== selectedEngine) {
                    setSelectedEngine(bestEngine.name);
                    if (onEngineSelect) {
                      onEngineSelect(bestEngine);
                    }
                  }
                }}
                className="bg-white text-gray-700 hover:text-gray-900"
              >
                🔄 Optimize for {defaultUseCase}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engine Statistics - Simplified */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Engine Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600">
            <div className="text-lg font-semibold text-blue-600">
              {engineManager.getEngineStatistics().totalEngines}
            </div>
            <div className="text-sm text-gray-600">
              Best-in-class engines available
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Advanced Options - Removed for Simplicity */}
    </div>
  );
}
