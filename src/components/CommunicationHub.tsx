import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users, 
  Volume2,
  MonitorSpeaker,
  MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VoiceChatManager, VideoConferenceManager, VoiceChatRoom, VideoConference } from './CommunicationClasses';
import { logger } from '@/lib/logger';

// React hook for voice chat functionality
export function useVoiceChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<VoiceChatRoom | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceChatManager] = useState(() => new VoiceChatManager());
  const { toast } = useToast();

  useEffect(() => {
    const manager = voiceChatManager;
    
    // Initialize microphone
    manager.initializeMicrophone().then((success: boolean) => {
      if (success) {
        setIsConnected(true);
        toast({
          title: 'Voice Chat Ready',
          description: 'Microphone initialized successfully',
        });
      } else {
        toast({
          title: 'Microphone Error',
          description: 'Failed to initialize microphone',
          variant: 'destructive',
        });
      }
    });

    // Listen for audio level changes
    const handleAudioLevel = (event: Event) => {
      const customEvent = event as CustomEvent<{ level: number }>;
      setAudioLevel(customEvent.detail?.level ?? 0);
    };
    
    window.addEventListener('audioLevel', handleAudioLevel as EventListener);

    return () => {
      window.removeEventListener('audioLevel', handleAudioLevel as EventListener);
      manager.cleanup();
    };
  }, [voiceChatManager, toast]);

  const joinRoom = useCallback(async (roomId: string) => {
    try {
      const room = await voiceChatManager.joinVoiceChat(roomId);
      setCurrentRoom(room);
      setIsConnected(true);
      
      toast({
        title: 'Joined Voice Chat',
        description: `Connected to ${room.name}`,
      });
    } catch (error) {
      logger.error('Failed to join voice chat:', error);
      toast({
        title: 'Failed to Join',
        description: 'Could not connect to voice chat',
        variant: 'destructive',
      });
    }
  }, [voiceChatManager, toast]);

  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;
    
    try {
      await voiceChatManager.leaveVoiceChat(currentRoom.id);
      setCurrentRoom(null);
      setIsConnected(false);
      
      toast({
        title: 'Left Voice Chat',
        description: 'Disconnected from voice chat',
      });
    } catch (error) {
      logger.error('Failed to leave voice chat:', error);
      toast({
        title: 'Failed to Leave',
        description: 'Could not disconnect from voice chat',
        variant: 'destructive',
      });
    }
  }, [currentRoom, voiceChatManager, toast]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (currentRoom) {
      voiceChatManager.toggleMute('local');
    }
  }, [isMuted, currentRoom, voiceChatManager]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (currentRoom) {
      voiceChatManager.setVolume('local', volumeValue);
    }
  }, [currentRoom, voiceChatManager]);

  return {
    isConnected,
    currentRoom,
    isMuted,
    volume,
    audioLevel,
    joinRoom,
    leaveRoom,
    toggleMute,
    handleVolumeChange,
  };
}

// React hook for video conferencing
export function useVideoConference() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentConference, setCurrentConference] = useState<VideoConference | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoManager] = useState(() => new VideoConferenceManager());
  const { toast } = useToast();

  useEffect(() => {
    const manager = videoManager;
    
    // Initialize camera and microphone
    manager.initializeCamera().then((success: boolean) => {
      setIsCameraEnabled(success);
      setIsMicrophoneEnabled(true);
      
      if (success) {
        toast({
          title: 'Video Ready',
          description: 'Camera and microphone initialized',
        });
      }
    });

    return () => {
      manager.cleanup();
    };
  }, [videoManager, toast]);

  const createConference = useCallback(async (title: string) => {
    try {
      const conference = await videoManager.createConference(title);
      setCurrentConference(conference);
      setIsConnected(true);
      
      toast({
        title: 'Conference Created',
        description: `Created conference: ${conference.title}`,
      });
    } catch (error) {
      logger.error('Failed to create video conference:', error);
      toast({
        title: 'Failed to Create',
        description: 'Could not create video conference',
        variant: 'destructive',
      });
    }
  }, [videoManager, toast]);

  const joinConference = useCallback(async (conferenceId: string) => {
    try {
      const conference = await videoManager.joinConference(conferenceId);
      setCurrentConference(conference);
      setIsConnected(true);
      
      toast({
        title: 'Joined Conference',
        description: `Connected to ${conference.title}`,
      });
    } catch (error) {
      logger.error('Failed to join video conference:', error);
      toast({
        title: 'Failed to Join',
        description: 'Could not connect to video conference',
        variant: 'destructive',
      });
    }
  }, [videoManager, toast]);

  const leaveConference = useCallback(async () => {
    if (!currentConference) return;
    
    try {
      await videoManager.leaveConference(currentConference.id);
      setCurrentConference(null);
      setIsConnected(false);
      setIsCameraEnabled(false);
      setIsScreenSharing(false);
      
      toast({
        title: 'Left Conference',
        description: 'Disconnected from video conference',
      });
    } catch (error) {
      logger.error('Failed to leave video conference:', error);
      toast({
        title: 'Failed to Leave',
        description: 'Could not disconnect from video conference',
        variant: 'destructive',
      });
    }
  }, [currentConference, videoManager, toast]);

  const toggleCamera = useCallback(async () => {
    if (isCameraEnabled) {
      if (videoManager.localStream) {
        videoManager.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => track.stop());
        videoManager.stopCamera();
      }
      setIsCameraEnabled(false);
    } else {
      const success = await videoManager.initializeCamera();
      setIsCameraEnabled(success);
      
      if (!success) {
        toast({
          title: 'Camera Error',
          description: 'Failed to enable camera',
          variant: 'destructive',
        });
      }
    }
  }, [isCameraEnabled, videoManager, toast]);

  const toggleMicrophone = useCallback(() => {
    setIsMicrophoneEnabled(!isMicrophoneEnabled);
    
    // In real implementation, this would toggle audio tracks
    toast({
      title: 'Microphone Toggled',
      description: isMicrophoneEnabled ? 'Microphone enabled' : 'Microphone disabled',
    });
  }, [isMicrophoneEnabled, toast]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      videoManager.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      const success = await videoManager.startScreenShare();
      setIsScreenSharing(success);
      
      if (!success) {
        toast({
          title: 'Screen Share Error',
          description: 'Failed to start screen sharing',
          variant: 'destructive',
        });
      }
    }
  }, [isScreenSharing, videoManager, toast]);

  return {
    isConnected,
    currentConference,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenSharing,
    createConference,
    joinConference,
    leaveConference,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  };
}

// React component for voice chat controls
export function VoiceChatControls() {
  const {
    isConnected,
    currentRoom,
    isMuted,
    volume,
    audioLevel,
    joinRoom,
    leaveRoom,
    toggleMute,
    handleVolumeChange
  } = useVoiceChat();
  const normalizedAudioLevel = Math.min(
    100,
    Math.max(0, audioLevel <= 1 ? audioLevel * 100 : audioLevel)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Voice Chat
          {isConnected && (
            <Badge variant="default">Connected</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="communication-control">
          <span className="communication-control-label">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="communication-control-value">
              {isConnected ? currentRoom?.name : 'Not in room'}
            </span>
          </div>
        </div>

        {/* Room Controls */}
        {currentRoom && (
          <div className="space-y-2">
            <div className="communication-control">
              <span className="communication-control-label">Room: {currentRoom.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={leaveRoom}
              >
                Leave
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isMuted ? 'default' : 'outline'}
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <div className="audio-level-indicator">
                <Volume2 className="w-4 h-4" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="volume-slider"
                />
                <span className="audio-level-text">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Audio Level Indicator */}
            <div className="audio-level-indicator">
              <Volume2 className="w-4 h-4" />
              <div className="audio-level-bar">
                <div className="audio-level-fill" style={{ width: `${normalizedAudioLevel}%` }} />
              </div>
              <span className="audio-level-text">
                {Math.round(normalizedAudioLevel)}%
              </span>
            </div>
          </div>
        )}

        {/* Join Room */}
        {!currentRoom && (
          <div className="space-y-2">
            <Input
              placeholder="Enter room ID"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  joinRoom(e.currentTarget.value);
                }
              }}
            />
            <Button
              className="w-full"
              onClick={() => {
                const roomId = prompt('Enter room ID:');
                if (roomId) {
                  joinRoom(roomId);
                }
              }}
            >
              Join Room
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// React component for video conference controls
export function VideoConferenceControls() {
  const {
    isConnected,
    currentConference,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenSharing,
    createConference,
    joinConference,
    leaveConference,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare
  } = useVideoConference();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Conference
          {isConnected && (
            <Badge variant="default">Connected</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="communication-control">
          <span className="communication-control-label">
            {isConnected ? 'In Conference' : 'Not Connected'}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="communication-control-value">
              {isConnected ? currentConference?.title : 'Not in conference'}
            </span>
          </div>
        </div>

        {/* Conference Controls */}
        {currentConference && (
          <div className="space-y-2">
            <div className="communication-control">
              <span className="communication-control-label">
                {currentConference.title}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={leaveConference}
              >
                End Call
              </Button>
            </div>

            <div className="communication-control">
              <span className="communication-control-value">
                Participants: {currentConference.participants.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const participantId = prompt('Enter participant ID:');
                  if (participantId) {
                    // Add participant logic here
                    logger.debug('Adding participant:', participantId);
                  }
                }}
              >
                Add Participant
              </Button>
            </div>

            {/* Media Controls */}
            <div className="media-controls-grid">
              <div className="media-control-section">
                <Label className="media-control-label">Camera</Label>
                <Button
                  variant={isCameraEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleCamera}
                  className="media-control-button"
                >
                  {isCameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {isCameraEnabled ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="media-control-section">
                <Label className="media-control-label">Microphone</Label>
                <Button
                  variant={isMicrophoneEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleMicrophone}
                  className="media-control-button"
                >
                  {isMicrophoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  {isMicrophoneEnabled ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="media-control-section">
                <Label className="media-control-label">Screen Share</Label>
                <Button
                  variant={isScreenSharing ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleScreenShare}
                  className="media-control-button"
                >
                  <MonitorSpeaker className="w-4 h-4" />
                  {isScreenSharing ? 'Sharing' : 'Share'}
                </Button>
              </div>

              <div className="media-control-section">
                <Label className="media-control-label">More Options</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="media-control-button"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Conference */}
        {!currentConference && (
          <div className="space-y-2">
            <Input
              placeholder="Conference title"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  createConference(e.currentTarget.value);
                }
              }}
            />
            <Button
              className="w-full"
              onClick={() => {
                const title = prompt('Enter conference title:');
                if (title) {
                  createConference(title);
                }
              }}
            >
              Create Conference
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const conferenceId = prompt('Enter conference ID:');
                if (conferenceId) {
                  joinConference(conferenceId);
                }
              }}
            >
              Join Conference
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main communication hub component
export function CommunicationHub() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="communication-controls-grid">
        <VoiceChatControls />
        <VideoConferenceControls />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="communication-settings-grid">
            <div className="communication-setting">
              <Label htmlFor="auto-connect">Auto-connect to voice chat</Label>
              <Switch id="auto-connect" />
            </div>
            
            <div className="communication-setting">
              <Label htmlFor="noise-suppression">Noise suppression</Label>
              <Switch id="noise-suppression" defaultChecked />
            </div>
            
            <div className="communication-setting">
              <Label htmlFor="echo-cancellation">Echo cancellation</Label>
              <Switch id="echo-cancellation" defaultChecked />
            </div>
            
            <div className="communication-setting">
              <Label htmlFor="auto-gain">Auto-gain control</Label>
              <Switch id="auto-gain" defaultChecked />
            </div>
            
            <div className="communication-setting">
              <Label htmlFor="high-quality">High quality audio</Label>
              <Switch id="high-quality" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="communication-setting">
              <Label htmlFor="video-quality">Video Quality</Label>
              <Select defaultValue="720p">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="360p">360p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="communication-setting">
              <Label htmlFor="frame-rate">Frame Rate</Label>
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select fps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 fps</SelectItem>
                  <SelectItem value="30">30 fps</SelectItem>
                  <SelectItem value="60">60 fps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="communication-settings-note">
            <strong>Note:</strong> Voice chat and video conferencing features require HTTPS and 
            appropriate permissions. Some features may not be available in all browsers.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
