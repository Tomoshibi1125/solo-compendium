import { warn as logWarn } from '@/lib/logger';

let initPromise: Promise<void> | null = null;

export const initThreeLoaders = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = Promise.all([import('three'), import('@react-three/drei')])
    .then(([three, drei]) => {
      if ('Cache' in three) {
        three.Cache.enabled = true;
      }
      if ('useGLTF' in drei && typeof drei.useGLTF?.setDecoderPath === 'function') {
        drei.useGLTF.setDecoderPath('/draco/');
      }
    })
    .catch((error) => {
      logWarn('Failed to initialize three.js loaders:', error);
    });

  return initPromise;
};
