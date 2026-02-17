import { describe, expect, it } from 'vitest';

import {
  buildCampaignInviteUrl,
  deriveCampaignInviteStatus,
  isCampaignInviteJoinable,
  isLikelyShareCode,
  isSafeNextPath,
  normalizeInviteAccessKey,
} from '@/lib/campaignInviteUtils';

describe('campaignInviteUtils', () => {
  it('normalizes invite access keys', () => {
    expect(normalizeInviteAccessKey('  abc123  ')).toBe('abc123');
    expect(normalizeInviteAccessKey(null)).toBe('');
    expect(normalizeInviteAccessKey(undefined)).toBe('');
  });

  it('detects likely share codes', () => {
    expect(isLikelyShareCode('abc123')).toBe(true);
    expect(isLikelyShareCode('ABCDEFGH')).toBe(false);
    expect(isLikelyShareCode('')).toBe(false);
  });

  it('builds invite url with encoded access key', () => {
    expect(buildCampaignInviteUrl('https://example.com/', ' code-123 ')).toBe(
      'https://example.com/campaigns/join/code-123'
    );
  });

  it('derives invite status from explicit status when present', () => {
    expect(deriveCampaignInviteStatus({ status: 'active' })).toBe('active');
    expect(deriveCampaignInviteStatus({ status: 'used_up' })).toBe('used_up');
    expect(deriveCampaignInviteStatus({ status: 'expired' })).toBe('expired');
    expect(deriveCampaignInviteStatus({ status: 'revoked' })).toBe('revoked');
  });

  it('derives invite status from lifecycle fields', () => {
    expect(
      deriveCampaignInviteStatus({
        revoked_at: new Date().toISOString(),
      })
    ).toBe('revoked');

    expect(
      deriveCampaignInviteStatus({
        expires_at: new Date(Date.now() - 60_000).toISOString(),
      })
    ).toBe('expired');

    expect(
      deriveCampaignInviteStatus({
        max_uses: 1,
        used_count: 1,
      })
    ).toBe('used_up');
  });

  it('allows join for active and used_up states only', () => {
    expect(isCampaignInviteJoinable('active')).toBe(true);
    expect(isCampaignInviteJoinable('used_up')).toBe(true);
    expect(isCampaignInviteJoinable('expired')).toBe(false);
    expect(isCampaignInviteJoinable('revoked')).toBe(false);
    expect(isCampaignInviteJoinable('unknown')).toBe(false);
  });

  it('validates safe next paths', () => {
    expect(isSafeNextPath('/campaigns/join/ABC123')).toBe(true);
    expect(isSafeNextPath('/characters/new?next=%2Fcampaigns%2Fjoin')).toBe(true);
    expect(isSafeNextPath('https://evil.example')).toBe(false);
    expect(isSafeNextPath('//evil.example')).toBe(false);
    expect(isSafeNextPath('campaigns/join')).toBe(false);
    expect(isSafeNextPath('')).toBe(false);
  });
});
