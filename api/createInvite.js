import { createClient } from '@supabase/supabase-js';

const getEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return null;
};

const buildOrigin = (req) => {
  const originHeader = req.headers?.origin;
  if (originHeader) return originHeader;

  const host = req.headers?.['x-forwarded-host'] || req.headers?.host;
  if (!host) return null;
  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
};

const readJsonBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

const isLegacyCreateInviteRpcError = (message) => {
  const normalized = String(message || '').toLowerCase();
  return (
    normalized.includes('create_campaign_invite') &&
    (
      normalized.includes('does not exist') ||
      normalized.includes('no function matches') ||
      normalized.includes('could not find function') ||
      normalized.includes('schema cache')
    )
  );
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'SUPABASE_URL');
  const supabaseAnonKey = getEnv(
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_ANON_KEY'
  );
  const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return res.status(500).json({
      error:
        'Missing Supabase server environment variables. Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY), SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  const authHeader = req.headers?.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : null;
  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: tokenUserData, error: tokenUserError } = await adminClient.auth.getUser(accessToken);
  if (tokenUserError || !tokenUserData?.user) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }

  // Parse body and extract parameters BEFORE using them
  const body = readJsonBody(req);
  const campaignId = typeof body.campaignId === 'string' ? body.campaignId : '';
  const role = body.role === 'co-system' ? 'co-system' : 'hunter';
  const expiresAt = typeof body.expiresAt === 'string' && body.expiresAt.length > 0 ? body.expiresAt : null;
  const maxUsesRaw = Number(body.maxUses ?? 1);
  const maxUses = Number.isFinite(maxUsesRaw) ? Math.max(1, Math.floor(maxUsesRaw)) : 1;
  const inviteEmail = typeof body.inviteEmail === 'string' ? body.inviteEmail.trim().toLowerCase() : '';

  if (!campaignId) {
    return res.status(400).json({ error: 'campaignId is required' });
  }

  // Require requester to be the campaign DM
  const requesterId = tokenUserData.user.id;
  const { data: dmRows, error: dmError } = await userClient
    .from('campaigns')
    .select('id, dm_id')
    .eq('id', campaignId)
    .limit(1);

  if (dmError) {
    return res.status(403).json({ error: 'Unable to verify campaign ownership' });
  }
  const campaignRow = dmRows?.[0];
  if (!campaignRow || campaignRow.dm_id !== requesterId) {
    return res.status(403).json({ error: 'Only the campaign DM can create invites' });
  }

  let { data: inviteRows, error: inviteError } = await userClient.rpc('create_campaign_invite', {
    p_campaign_id: campaignId,
    p_role: role,
    p_expires_at: expiresAt,
    p_max_uses: maxUses,
    p_invite_email: inviteEmail || null,
  });

  if (inviteError && isLegacyCreateInviteRpcError(inviteError.message)) {
    const legacy = await userClient.rpc('create_campaign_invite', {
      p_campaign_id: campaignId,
      p_role: role,
      p_expires_at: expiresAt,
      p_max_uses: maxUses,
      // Legacy RPC may ignore invite_email; enforce failure if email was requested
      ...(inviteEmail ? { p_invite_email: inviteEmail } : {}),
    });
    inviteRows = legacy.data;
    inviteError = legacy.error;
  }

  if (inviteError) {
    return res.status(400).json({ error: inviteError.message });
  }

  const invite = Array.isArray(inviteRows) ? inviteRows[0] : inviteRows;
  if (!invite) {
    return res.status(500).json({ error: 'Invite was not returned by create_campaign_invite RPC' });
  }

  const emailDelivery = {
    attempted: Boolean(inviteEmail),
    sent: false,
    error: null,
  };

  if (inviteEmail) {
    const origin = buildOrigin(req);
    const redirectTo = origin
      ? `${origin.replace(/\/$/, '')}/campaigns/join/${encodeURIComponent(invite.token)}`
      : undefined;

    const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(inviteEmail, {
      redirectTo,
      data: {
        campaignId,
        inviteToken: invite.token,
        inviteJoinCode: invite.join_code || null,
        inviteRole: invite.role,
      },
    });

    if (emailError) {
      emailDelivery.error = emailError.message;
    } else {
      emailDelivery.sent = true;
    }
  }

  return res.status(200).json({ invite, emailDelivery });
}
