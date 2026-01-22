type RuntimeEnv = Record<string, string | undefined>;

const readRuntimeEnv = (): RuntimeEnv => {
  if (typeof globalThis === 'undefined') {
    return {};
  }
  const anyGlobal = globalThis as { __SOLO_COMPENDIUM_ENV__?: RuntimeEnv; __RUNTIME_CONFIG__?: RuntimeEnv; __ENV__?: RuntimeEnv };
  return anyGlobal.__SOLO_COMPENDIUM_ENV__ || anyGlobal.__RUNTIME_CONFIG__ || anyGlobal.__ENV__ || {};
};

export const getRuntimeEnvValue = (key: string): string | undefined => {
  const runtimeValue = readRuntimeEnv()[key];
  if (typeof runtimeValue === 'string' && runtimeValue.trim() !== '') {
    return runtimeValue;
  }
  const buildValue = import.meta.env[key];
  if (typeof buildValue === 'string' && buildValue.trim() !== '') {
    return buildValue;
  }
  return undefined;
};

export const normalizeBasePath = (value?: string): string => {
  if (!value) return '/';
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return '/';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
};
