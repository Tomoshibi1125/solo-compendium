// Campaign type definitions
export interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeonMasterId: string;
  members: CampaignMember[];
  settings: CampaignSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMember {
  id: string;
  characterId: string;
  userId: string;
  role: 'dm' | 'player';
  joinedAt: string;
}

export interface CampaignSettings {
  isPublic: boolean;
  allowJoinRequests: boolean;
  maxPlayers: number;
  levelRange: {
    min: number;
    max: number;
  };
}

export interface CampaignCreateRequest {
  name: string;
  description: string;
  settings: CampaignSettings;
}
