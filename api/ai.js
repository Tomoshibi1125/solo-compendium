/**
 * Vercel Serverless AI Proxy — Google Gemini 2.0 Flash
 * Reads GEMINI_API_KEY from environment variables.
 * Users never see or manage the key.
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_OUTPUT_TOKENS = 4096;
const REQUEST_TIMEOUT_MS = 30000;

// Simple in-memory rate limiter (per Vercel cold-start instance)
const rateBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20; // 20 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) return true;
  return false;
}

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI service not configured. Set GEMINI_API_KEY environment variable.',
      available: false,
    });
  }

  // Rate limit by IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
  }

  // Parse body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { prompt, systemPrompt, maxTokens } = body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing required field: prompt' });
  }

  // Build Gemini request
  const contents = [];
  if (systemPrompt && typeof systemPrompt === 'string') {
    contents.push({ role: 'user', parts: [{ text: `System instructions: ${systemPrompt}` }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow those instructions.' }] });
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const geminiBody = {
    contents,
    generationConfig: {
      maxOutputTokens: Math.min(maxTokens || MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS),
      temperature: 0.8,
    },
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `Gemini API error: ${response.status}`;
      return res.status(502).json({ error: errorMessage, available: true });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text.trim()) {
      return res.status(502).json({ error: 'Gemini returned empty response', available: true });
    }

    return res.status(200).json({
      success: true,
      text,
      model: GEMINI_MODEL,
      usage: {
        promptTokens: data?.usageMetadata?.promptTokenCount,
        completionTokens: data?.usageMetadata?.candidatesTokenCount,
        totalTokens: data?.usageMetadata?.totalTokenCount,
      },
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Gemini request timed out', available: true });
    }
    return res.status(500).json({ error: err.message || 'Internal proxy error', available: true });
  }
}
