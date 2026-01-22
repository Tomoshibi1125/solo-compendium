import { logger } from '@/lib/logger';

type AudioContextConstructor = typeof AudioContext;
type DisplayMediaCursor = 'always' | 'motion' | 'never';
type DisplayMediaVideoConstraints = MediaTrackConstraints & { cursor?: DisplayMediaCursor };

const resolveAudioContext = (): AudioContextConstructor | null => {
  if (typeof window === 'undefined') return null;
  const withWebkit = window as typeof window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext || withWebkit.webkitAudioContext || null;
};

export interface VoiceChatUser {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number;
  audioLevel: number;
  isLocal: boolean;
}

export interface VoiceChatRoom {
  id: string;
  name: string;
  description?: string;
  users: VoiceChatUser[];
  isActive: boolean;
  isLocked: boolean;
  maxUsers: number;
  createdAt: Date;
  createdBy: string;
}

export interface VideoConference {
  id: string;
  roomId: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    userId: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
  }>;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export class VoiceChatManager {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStream | null = null;
  private audioLevelCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      const AudioContextCtor = resolveAudioContext();
      if (!AudioContextCtor) {
        logger.warn('AudioContext is not available in this environment.');
        return;
      }
      this.audioContext = new AudioContextCtor();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
    } catch (error) {
      logger.error('Failed to initialize audio context:', error);
    }
  }

  async initializeMicrophone(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      this.microphone = stream;
      
      if (this.audioContext && this.analyser) {
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.startAudioLevelMonitoring();
      }

      return true;
    } catch (error) {
      logger.error('Failed to initialize microphone:', error);
      return false;
    }
  }

  async initializeCamera(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      this.localStream = stream;
      return true;
    } catch (error) {
      logger.error('Failed to initialize camera:', error);
      return false;
    }
  }

  private startAudioLevelMonitoring() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const checkAudioLevel = () => {
      if (this.analyser) {
        this.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(100, (average / 128) * 100 * 2);
      
        // Emit audio level event
        window.dispatchEvent(new CustomEvent('audioLevel', {
          detail: { level: normalizedLevel }
        }));
        
        this.audioLevelCheckInterval = setTimeout(checkAudioLevel, 100);
      }
    };

    checkAudioLevel();
  }

  stopAudioLevelMonitoring() {
    if (this.audioLevelCheckInterval) {
      clearTimeout(this.audioLevelCheckInterval);
      this.audioLevelCheckInterval = null;
    }
  }

  async createPeerConnection(userId: string): Promise<RTCPeerConnection> {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    this.peerConnections.set(userId, peerConnection);

    return peerConnection;
  }

  async joinVoiceChat(roomId: string): Promise<VoiceChatRoom> {
    // Mock implementation - in real app, this would connect to signaling server
    const mockRoom: VoiceChatRoom = {
      id: roomId,
      name: `Voice Chat Room ${roomId}`,
      users: [
        {
          id: 'local',
          name: 'You',
          isMuted: false,
          isSpeaking: false,
          volume: 100,
          audioLevel: 0,
          isLocal: true
        }
      ],
      isActive: true,
      isLocked: false,
      maxUsers: 8,
      createdAt: new Date(),
      createdBy: 'system'
    };

    return mockRoom;
  }

  async leaveVoiceChat(roomId: string): Promise<void> {
    // Mock implementation
    logger.debug(`Leaving voice chat room: ${roomId}`);
  }

  toggleMute(userId: string): void {
    // Mock implementation
    logger.debug(`Toggle mute for user: ${userId}`);
  }

  setVolume(userId: string, volume: number): void {
    // Mock implementation
    logger.debug(`Set volume for user ${userId}: ${volume}`);
  }

  getAudioLevel(): number {
    if (!this.analyser) return 0;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    
    return Math.min(100, (sum / dataArray.length) / 128 * 100 * 2);
  }

  cleanup(): void {
    this.stopAudioLevelMonitoring();
    
    if (this.microphone) {
      this.microphone.getTracks().forEach(track => track.stop());
      this.microphone = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.peerConnections.forEach(conn => conn.close());
    this.peerConnections.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class VideoConferenceManager {
  public localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private screenStream: MediaStream | null = null;
  private signalingServer: string;

  constructor(signalingServer: string = 'ws://localhost:8080/signaling') {
    this.signalingServer = signalingServer;
  }

  async initializeCamera(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.localStream = stream;
      return true;
    } catch (error) {
      logger.error('Failed to initialize camera:', error);
      return false;
    }
  }

  stopCamera(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  async startScreenShare(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        } as DisplayMediaVideoConstraints,
        audio: false
      });

      this.screenStream = stream;
      return true;
    } catch (error) {
      logger.error('Failed to start screen share:', error);
      return false;
    }
  }

  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  async createConference(title: string): Promise<VideoConference> {
    const conferenceId = this.generateConferenceId();
    
    const conference: VideoConference = {
      id: conferenceId,
      roomId: conferenceId,
      title,
      participants: [
        {
          id: 'local',
          name: 'You',
          userId: 'local',
          isAudioEnabled: true,
          isVideoEnabled: true,
          isScreenSharing: false
        }
      ],
      isActive: true,
      createdAt: new Date(),
      createdBy: 'local'
    };

    return conference;
  }

  async joinConference(conferenceId: string): Promise<VideoConference> {
    // Mock implementation - in real app, this would connect to signaling server
    const mockConference: VideoConference = {
      id: conferenceId,
      roomId: conferenceId,
      title: `Conference ${conferenceId}`,
      participants: [
        {
          id: 'local',
          name: 'You',
          userId: 'local',
          isAudioEnabled: true,
          isVideoEnabled: true,
          isScreenSharing: false
        }
      ],
      isActive: true,
      createdAt: new Date(),
      createdBy: 'system'
    };

    return mockConference;
  }

  async leaveConference(conferenceId: string): Promise<void> {
    // Mock implementation
    logger.debug(`Leaving conference: ${conferenceId}`);
  }

  toggleAudio(conferenceId: string, userId: string): void {
    // Mock implementation
    logger.debug(`Toggle audio for user ${userId} in conference ${conferenceId}`);
  }

  toggleVideo(conferenceId: string, userId: string): void {
    // Mock implementation
    logger.debug(`Toggle video for user ${userId} in conference ${conferenceId}`);
  }

  toggleScreenShare(conferenceId: string, userId: string): void {
    // Mock implementation
    logger.debug(`Toggle screen share for user ${userId} in conference ${conferenceId}`);
  }

  private generateConferenceId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.stopScreenShare();
    
    this.peerConnections.forEach(conn => conn.close());
    this.peerConnections.clear();
  }
}
