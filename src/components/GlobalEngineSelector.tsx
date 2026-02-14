// GLOBAL ENGINE SELECTION COMPONENT
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  defaultUseCase: '3d-graphics' | '2d-game' | 'physics-simulation' | 'data-visualization' | 'webgpu-graphics' = '3d-graphics';
}

interface ComparisonResult {
  engine1: EngineCapabilities;
  engine2: EngineCapabilities;
  winner: string;
  reason: string;
}

export function GlobalEngineSelector({ 
  onEngineSelect, 
  onStackSelect, 
  showComparison = false,
  defaultUseCase = '3d-graphics' 
}: EngineSelectorProps) {
  const [selectedUseCase, setSelectedUseCase] = useState(defaultUseCase);
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [comparison, setComparison] = useState<{ engine1: string; engine2: string } | null>(null);

  const allEngines = useMemo(() => engineManager.getAllEngines(), []);
  const enginesByType = useMemo(() => engineManager.getEnginesByType(selectedUseCase), [selectedUseCase]);
  const stats = useMemo(() => engineManager.getEngineStatistics(), []);

  useEffect(() => {
    // Initialize best engine for default use case
    const bestEngine = engineManager.getBestEngineForUseCase(selectedUseCase);
    if (bestEngine) {
      setSelectedEngine(bestEngine.name);
    }
  }, [selectedUseCase]);

  const handleEngineSelect = (engineName: string) => {
    const engine = engineManager.getEngine(engineName);
    if (engine && onEngineSelect) {
      onEngineSelect(engine);
    }
    setSelectedEngine(engineName);
  };

  const handleStackSelect = () => {
    const stack = engineManager.getRecommendedStack(selectedUseCase);
    if (stack && onStackSelect) {
      onStackSelect(stack);
    }
  };

  const handleCompare = (engine1: string, engine2: string) => {
    const result = engineManager.compareEngines(engine1, engine2);
    setComparison(result);
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Global Engine Manager
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete integration of the best free rendering engines, 3D engines, physics engines, and game engines
        </p>
      </div>

      {/* Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Engine Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEngines}</div>
              <div className="text-sm text-gray-600">Total Engines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.byType['3d'] || 0}</div>
              <div className="text-sm text-gray-600">3D Engines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.byType['physics'] || 0}</div>
              <div className="text-sm text-gray-600">Physics Engines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.byType['game'] || 0}</div>
              <div className="text-sm text-gray-600">Game Engines</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Case Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Use Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your use case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d-graphics">3D Graphics</SelectItem>
              <SelectItem value="2d-game">2D Game Development</SelectItem>
              <SelectItem value="physics-simulation">Physics Simulation</SelectItem>
              <SelectItem value="data-visualization">Data Visualization</SelectItem>
              <SelectItem value="webgpu-graphics">WebGPU Graphics</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Recommended Engine */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recommended Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const recommended = engineManager.getBestEngineForUseCase(selectedUseCase);
            if (!recommended) return <div>No engine available for this use case</div>;
            
            return (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h3 className="text-lg font-semibold">{recommended.name}</h3>
                  <p className="text-gray-600">{`Best ${recommended.type} engine`}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getPerformanceColor(recommended.performance)}>
                      {recommended.performance} Performance
                    </Badge>
                    <Badge className={getLearningCurveColor(recommended.learningCurve)}>
                      {recommended.learningCurve} Learning Curve
                    </Badge>
                    <Badge variant="outline">{recommended.license}</Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => handleEngineSelect(recommended.name)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Select & Initialize
                </Button>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Engine Selection - Only Best Engines Shown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Best Available Engines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(enginesByType.values()).filter(engine => engine.isBest).map((engine) => (
              <Card 
                key={engine.name} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedEngine === engine.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleEngineSelect(engine.name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(engine.type)}
                      {engine.name}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      v{engine.version}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge className={getPerformanceColor(engine.performance)}>
                        {engine.performance}
                      </Badge>
                      <Badge className={getLearningCurveColor(engine.learningCurve)}>
                        {engine.learningCurve}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Features:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {engine.features.slice(0, 4).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {engine.features.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{engine.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {engine.features.length} features • {engine.license}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Stack */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Recommended Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleStackSelect}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            Get Recommended Stack for {selectedUseCase}
          </Button>
        </CardContent>
      </Card>

      {/* Engine Comparison */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Engine Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select onValueChange={(value) => setComparison({ ...comparison, engine1: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(allEngines.values()).map((engine) => (
                      <SelectItem key={engine.name} value={engine.name}>
                        {engine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setComparison({ ...comparison, engine2: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(allEngines.values()).map((engine) => (
                      <SelectItem key={engine.name} value={engine.name}>
                        {engine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {comparison && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2">Comparison Result</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{comparison.engine1}</span>
                      <span>vs</span>
                      <span>{comparison.engine2}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      Winner: {comparison.winner}
                    </div>
                    <div className="text-sm text-gray-600">
                      {comparison.reason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default GlobalEngineSelector;
