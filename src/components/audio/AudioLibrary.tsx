import React, { useState } from 'react';
import { Upload, Music, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import './AudioLibrary.css';

interface AudioLibraryProps {
  onTrackSelect?: (track: any) => void;
}

export function AudioLibrary({ onTrackSelect }: AudioLibraryProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    setIsUploadDialogOpen(false);
  };

  const mockTracks = [
    { id: '1', title: 'Epic Battle Theme', artist: 'Solo Leveling OST', duration: 180, genre: 'epic', mood: 'intense' },
    { id: '2', title: 'Peaceful Forest', artist: 'Nature Sounds', duration: 240, genre: 'ambient', mood: 'calm' },
    { id: '3', title: 'Dark Dungeon', artist: 'Horror Collection', duration: 150, genre: 'horror', mood: 'tense' },
  ];

  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    const matchesMood = selectedMood === 'all' || track.mood === selectedMood;
    return matchesSearch && matchesGenre && matchesMood;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-muted-foreground">Legal-safe sounds and music for your campaigns</h2>
          <p className="text-muted-foreground">Browse and manage your audio library</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Audio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                multiple
                accept="audio/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                disabled={isUploading}
                aria-label="Upload audio files"
              />
              {isUploading && (
                <div className="w-full bg-primary h-2 rounded-full transition-all">
                  <div 
                    className="bg-primary-foreground h-2 rounded-full transition-all upload-progress-bar"
                    style={{ '--progress-width': `${uploadProgress}%` } as React.CSSProperties}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search audio tracks"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="intense">Intense</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="tense">Tense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{filteredTracks.length}</div>
          <div className="text-sm text-muted-foreground">Total Tracks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">5</div>
          <div className="text-sm text-muted-foreground">Total Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">120MB</div>
          <div className="text-sm text-muted-foreground">File Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">Today</div>
          <div className="text-sm text-muted-foreground">Last Updated</div>
        </div>
      </div>

      {/* Track List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Audio Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
                onClick={() => onTrackSelect?.(track)}
              >
                <div>
                  <h4 className="font-semibold">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{track.genre}</Badge>
                  <Badge variant="outline">{track.mood}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}