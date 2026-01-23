import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';

type SignupRole = 'dm' | 'player';

type SignupRequestBody = {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
  role?: unknown;
};

const buildCorsHeaders = (origin: string | null) => {
  const allowOrigin = origin && origin.trim() ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
};

const json = (status: number, body: unknown, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...buildCorsHeaders(origin),
    },
  });

const asString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

const normalizeRole = (value: unknown): SignupRole => (value === 'dm' ? 'dm' : 'player');

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: buildCorsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' }, origin);
  }

  let body: SignupRequestBody;
  try {
    body = (await req.json()) as SignupRequestBody;
  } catch {
    return json(400, { error: 'Invalid JSON body' }, origin);
  }

  const email = asString(body.email)?.trim().toLowerCase() ?? '';
  const password = asString(body.password) ?? '';
  const displayName = asString(body.displayName)?.trim() ?? '';
  const role = normalizeRole(body.role);

  if (!email || !email.includes('@')) {
    return json(400, { error: 'A valid email address is required' }, origin);
  }

  if (password.length < 8) {
    return json(400, { error: 'Password must be at least 8 characters' }, origin);
  }

  if (!displayName) {
    return json(400, { error: 'Display name is required' }, origin);
  }

  if (displayName.length > 60) {
    return json(400, { error: 'Display name must be 60 characters or fewer' }, origin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return json(500, { error: 'Server is not configured for signup' }, origin);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: createData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      role,
    },
  });

  if (createError) {
    const status = typeof createError.status === 'number' ? createError.status : 400;
    return json(status, { error: createError.message }, origin);
  }

  const userId = createData.user?.id;
  if (!userId) {
    return json(500, { error: 'User created but no user id returned' }, origin);
  }

  const { error: profileError } = await admin
    .from('profiles')
    .upsert(
      {
        id: userId,
        role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    console.error('Failed to upsert profile role:', profileError);
    return json(500, { error: 'User created but profile setup failed' }, origin);
  }

  return json(200, { userId }, origin);
});

