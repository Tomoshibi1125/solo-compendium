import { getRuntimeEnvValue } from './runtimeEnv';

const isTruthy = (value?: string): boolean => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

// Allow setup access in development, or when explicitly enabled via runtime env.
export const isSetupRouteEnabled = (): boolean => {
  if (isTruthy(getRuntimeEnvValue('VITE_SETUP_ENABLED'))) return true;
  if (isTruthy(getRuntimeEnvValue('VITE_ALLOW_SETUP'))) return true;
  return import.meta.env.DEV;
};
