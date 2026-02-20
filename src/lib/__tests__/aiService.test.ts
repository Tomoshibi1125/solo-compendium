import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AIServiceManager } from '@/lib/ai/aiService';
import type { AIConfiguration, AIRequest, AIService } from '@/lib/ai/types';
import type { AIUserSettings } from '@/lib/ai/userSettings';

const textResponse = (text: string, status = 200) =>
  new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain' },
  });

const jsonResponse = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const buildConfig = (services: AIService[], defaultService: string): AIConfiguration => ({
  services,
  defaultService,
  autoEnhancePrompts: true,
  autoAnalyzeAudio: true,
  autoAnalyzeImages: true,
  contentFiltering: true,
  maxRequestsPerHour: 999,
  cacheResults: false,
});

describe('AIServiceManager free-first integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps hosted free default with local ollama fallback when free provider is applied', () => {
    const manager = new AIServiceManager();
    const freeSettings: AIUserSettings = {
      provider: 'free',
      apiKey: '',
      apiBase: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
    };

    manager.applyUserSettings(freeSettings);
    const config = manager.getConfiguration();

    expect(config.defaultService).toBe('gemini-proxy');
    expect(config.services.map((service) => service.id)).toEqual(
      expect.arrayContaining(['gemini-proxy', 'ollama-fallback'])
    );
  });

  it('keeps free and local fallbacks available when custom provider is selected', () => {
    const manager = new AIServiceManager();
    const customSettings: AIUserSettings = {
      provider: 'custom',
      apiKey: 'sk-test',
      apiBase: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
    };

    manager.applyUserSettings(customSettings);
    const config = manager.getConfiguration();
    const ids = config.services.map((service) => service.id);

    expect(config.defaultService).toBe('user-custom');
    expect(ids).toEqual(expect.arrayContaining(['user-custom', 'gemini-proxy', 'ollama-fallback']));
  });

  it('tries configured pollinations models then a no-model default request', async () => {
    const pollinationsService: AIService = {
      id: 'pollinations',
      name: 'Pollinations',
      type: 'pollinations',
      capabilities: ['generate-content'],
      endpoint: 'https://text.pollinations.ai',
      model: 'model-a',
      fallbackModels: ['model-b'],
      maxTokens: 256,
      temperature: 0.3,
      enabled: true,
    };

    const manager = new AIServiceManager(buildConfig([pollinationsService], 'pollinations'));
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(textResponse('fail-a', 500))
      .mockResolvedValueOnce(textResponse('fail-b', 500))
      .mockResolvedValueOnce(textResponse('default-success', 200));

    vi.stubGlobal('fetch', fetchMock);

    const request: AIRequest = {
      service: 'pollinations',
      type: 'generate-content',
      input: 'Create campaign flavor text',
    };

    const response = await manager.processRequest(request);

    expect(response).toMatchObject({
      success: true,
      data: 'default-success',
      metadata: { model: 'default' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls[0]).toContain('?model=model-a');
    expect(urls[1]).toContain('?model=model-b');
    expect(urls[2]).not.toContain('?model=');
  });

  it('falls back from hosted pollinations to local ollama when hosted provider fails', async () => {
    const pollinationsService: AIService = {
      id: 'pollinations',
      name: 'Pollinations',
      type: 'pollinations',
      capabilities: ['generate-content'],
      endpoint: 'https://text.pollinations.ai',
      model: 'model-a',
      fallbackModels: ['model-b'],
      maxTokens: 256,
      temperature: 0.3,
      enabled: true,
    };

    const ollamaService: AIService = {
      id: 'ollama-fallback',
      name: 'Ollama Local Fallback',
      type: 'ollama',
      capabilities: ['generate-content'],
      endpoint: 'http://localhost:11434/api/generate',
      model: 'qwen2.5:14b-instruct',
      fallbackModels: ['qwen2.5:7b-instruct'],
      maxTokens: 512,
      temperature: 0.2,
      enabled: true,
    };

    const manager = new AIServiceManager(
      buildConfig([pollinationsService, ollamaService], 'pollinations')
    );

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(textResponse('fail-a', 500))
      .mockResolvedValueOnce(textResponse('fail-b', 500))
      .mockResolvedValueOnce(textResponse('fail-default', 500))
      .mockResolvedValueOnce(jsonResponse({ models: [{ name: 'qwen2.5:14b-instruct' }] }, 200))
      .mockResolvedValueOnce(jsonResponse({ response: 'local-fallback-success' }, 200));

    vi.stubGlobal('fetch', fetchMock);

    const request: AIRequest = {
      service: 'pollinations',
      type: 'generate-content',
      input: 'Generate encounter summary',
    };

    const response = await manager.processRequest(request);

    expect(response).toMatchObject({
      success: true,
      data: 'local-fallback-success',
      metadata: { model: 'qwen2.5:14b-instruct' },
    });

    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls.some((url) => url.endsWith('/api/tags'))).toBe(true);
    expect(urls.some((url) => url.endsWith('/api/generate'))).toBe(true);
  });

  it('uses timeout-aware fetch for custom provider requests', async () => {
    const customService: AIService = {
      id: 'user-custom',
      name: 'User API (OpenAI-Compatible)',
      type: 'custom',
      capabilities: ['generate-content'],
      apiKey: 'test-key',
      endpoint: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      maxTokens: 512,
      temperature: 0.4,
      enabled: true,
    };

    const manager = new AIServiceManager(buildConfig([customService], customService.id));

    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
      expect(String(input)).toContain('/chat/completions');
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return jsonResponse({
        choices: [{ message: { content: 'custom-success' } }],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      });
    });

    vi.stubGlobal('fetch', fetchMock);

    const request: AIRequest = {
      service: customService.id,
      type: 'generate-content',
      input: 'Create one-line lore',
    };

    const response = await manager.processRequest(request);

    expect(response).toMatchObject({ success: true, data: 'custom-success' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
