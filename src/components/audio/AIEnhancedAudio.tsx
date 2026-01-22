/**
 * AI-Enhanced Audio Component
 * Integrates AI services for intelligent audio analysis and enhancement
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAIAudioAnalysis, useAITagGeneration, useAIMoodDetection } from '@/lib/ai/hooks';
import { 
  Brain, 
  Upload, 
  Music, 
  Volume2, 
  Tag, 
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AudioAnalysis } from '@/lib/ai/types';
import { logger } from '@/lib/logger';
import { AIProviderSettings } from '@/components/ai/AIProviderSettings';

interface AIEnhancedAudioProps {
  onAnalysisComplete?: (analysis: AudioAnalysis) => void;
  className?: string;
}

export function AIEnhancedAudio({ onAnalysisComplete, className }: AIEnhancedAudioProps) {
  const { isAnalyzing, analysis, error, analyzeAudio } = useAIAudioAnalysis();
  const { tags: aiTags, generateTags } = useAITagGeneration();
  const { detectMood } = useAIMoodDetection();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Reset audio element
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!selectedFile) return;
    
    try {
      const result = await analyzeAudio(selectedFile);
      if (result) {
        onAnalysisComplete?.(result);
        
        // Generate tags and mood from analysis
        if (result.description) {
          await generateTags(result.description, 'audio');
          await detectMood(result.description, 'audio');
        }
      }
    } catch (error) {
      logger.error('Failed to analyze audio:', error);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEnergyColor = (energy: number) => {
    if (energy < 0.3) return 'bg-blue-500';
    if (energy < 0.6) return 'bg-yellow-500';
    if (energy < 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'energetic': return <Zap className="w-4 h-4" />;
      case 'calm': return <Heart className="w-4 h-4" />;
      case 'dramatic': return <Music className="w-4 h-4" />;
      case 'mysterious': return <Brain className="w-4 h-4" />;
      default: return <Volume2 className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <AIProviderSettings />
      {/* Audio Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            AI Audio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input aria-label="Upload audio file for AI analysis"
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Volume2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload Audio for AI Analysis</p>
              <p className="text-sm text-muted-foreground">
                AI will analyze mood, energy, instruments, and suggest tags
              </p>
            </div>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mt-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Audio File
            </Button>
          </div>
          
          {selectedFile && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected: {selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Player */}
      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Audio Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <div className="flex-1">
                <Progress value={duration > 0 ? (currentTime / duration) * 100 : 0} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleAnalyzeAudio}
              disabled={isAnalyzing || !selectedFile}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Audio with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mood and Energy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Detected Mood</h4>
                <div className="flex items-center gap-2">
                  {getMoodIcon(analysis.mood)}
                  <Badge variant="secondary" className="text-lg">
                    {analysis.mood}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Energy Level</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Progress value={analysis.energy * 100} />
                  </div>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    getEnergyColor(analysis.energy)
                  )} />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Tempo</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.tempo ? `${analysis.tempo} BPM` : 'Unknown'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Key</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.key || 'Unknown'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <p className="text-sm text-muted-foreground">
                  {formatTime(analysis.duration)}
                </p>
              </div>
            </div>

            {/* Instruments */}
            <div>
              <h4 className="font-medium mb-2">Detected Instruments</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.instruments.map((instrument, index) => (
                  <Badge key={index} variant="outline">
                    {instrument}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <h4 className="font-medium mb-2">Genre Classification</h4>
              <Badge variant="secondary">
                {analysis.genre}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">AI Description</h4>
              <p className="text-sm text-muted-foreground">
                {analysis.description}
              </p>
            </div>

            {/* AI Tags */}
            {aiTags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">AI-Generated Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {aiTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Usage Suggestions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>- Perfect for {analysis.mood.toLowerCase()} encounters</li>
                <li>- Energy level {analysis.energy > 0.6 ? 'high - great for combat' : 'low - good for exploration'}</li>
                <li>- {analysis.instruments.length > 0 ? `Features ${analysis.instruments.slice(0, 2).join(' and ')}` : 'Minimal instrumentation'}</li>
                <li>- Recommended for {analysis.genre.toLowerCase()} campaigns</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
