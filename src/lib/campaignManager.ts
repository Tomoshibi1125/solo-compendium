/**
 * Campaign Manager
 * Provides CRUD operations for campaigns.
 *
 * @deprecated Use `useCampaigns` and `useCampaignMembers` hooks instead —
 * they handle Supabase CRUD directly. This class is retained only for
 * backward compatibility and offline/testing scenarios.
 */

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  dmId: string;
  shareCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  settings: Record<string, unknown>;
}

export interface CampaignMember {
  id: string;
  campaignId: string;
  userId: string;
  characterId: string | null;
  role: 'hunter' | 'co-system';
  joinedAt: string;
}

export interface CampaignPermissions {
  canView: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canManagePlayers: boolean;
  canViewNotes: boolean;
  canEditNotes: boolean;
}

/** @deprecated Use hooks instead */
export class CampaignManager {
  /** Create a new campaign */
  static async createCampaign(
    userId: string,
    campaignData: Partial<Campaign>
  ): Promise<Campaign> {
    const campaign: Campaign = {
      id: this.generateId(),
      name: campaignData.name || 'New Campaign',
      description: campaignData.description || '',
      dmId: userId,
      shareCode: this.generateShareCode(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: campaignData.settings || {},
    };
    return campaign;
  }

  /** Get campaign by ID */
  static async getCampaign(_campaignId: string): Promise<Campaign | null> {
    return null;
  }

  /** Update campaign */
  static async updateCampaign(
    campaignId: string,
    updates: Partial<Campaign>
  ): Promise<Campaign> {
    const existing = await this.getCampaign(campaignId);
    if (!existing) throw new Error('Campaign not found');
    return { ...existing, ...updates, updatedAt: new Date().toISOString() };
  }

  /** Delete campaign */
  static async deleteCampaign(_campaignId: string): Promise<void> {
    // Implementation would delete from database
  }

  /** Add member to campaign */
  static async addMember(
    campaignId: string,
    userId: string,
    role: 'hunter' | 'co-system'
  ): Promise<CampaignMember> {
    const member: CampaignMember = {
      id: this.generateId(),
      campaignId,
      userId,
      characterId: null,
      role,
      joinedAt: new Date().toISOString(),
    };
    return member;
  }

  /** Remove member from campaign */
  static async removeMember(_campaignId: string, _userId: string): Promise<void> {
    // Implementation would remove from database
  }

  /** Check if user has permission for campaign */
  static async hasPermission(
    _campaignId: string,
    _userId: string,
    _permission: keyof CampaignPermissions
  ): Promise<boolean> {
    return true;
  }

  /** Get campaign members */
  static async getMembers(_campaignId: string): Promise<CampaignMember[]> {
    return [];
  }

  /** Generate unique ID */
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /** Generate share code */
  private static generateShareCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  /** Get permissions for role */
  private static getPermissionsForRole(role: string): CampaignPermissions {
    const basePermissions: CampaignPermissions = {
      canView: true,
      canEdit: false,
      canInvite: false,
      canManagePlayers: false,
      canViewNotes: true,
      canEditNotes: false,
    };
    switch (role) {
      case 'co-system':
        return {
          ...basePermissions,
          canEdit: true,
          canInvite: true,
          canManagePlayers: true,
          canEditNotes: true,
        };
      default:
        return basePermissions;
    }
  }
}
