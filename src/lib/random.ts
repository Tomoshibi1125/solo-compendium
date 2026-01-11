const cryptoRef = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
const hasCrypto = !!cryptoRef?.getRandomValues;

let fallbackCounter = 0;
let lcgState = 0x12345678;

const nextLcg = () => {
  lcgState = (lcgState * 1664525 + 1013904223) >>> 0;
  return lcgState / 0x100000000;
};

const getRandomUint32 = () => {
  if (!hasCrypto || !cryptoRef) {
    return Math.floor(nextLcg() * 0x100000000);
  }

  const buffer = new Uint32Array(1);
  cryptoRef.getRandomValues(buffer);
  return buffer[0];
};

export const getRandomInt = (maxExclusive: number) => {
  if (maxExclusive <= 0) return 0;

  if (!hasCrypto) {
    return Math.floor(nextLcg() * maxExclusive);
  }

  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  let value = getRandomUint32();
  while (value >= limit) {
    value = getRandomUint32();
  }
  return value % maxExclusive;
};

export const rollDie = (sides: number) => getRandomInt(sides) + 1;

export const createId = (prefix: string) => {
  if (cryptoRef?.randomUUID) {
    return `${prefix}-${cryptoRef.randomUUID()}`;
  }

  if (hasCrypto && cryptoRef) {
    const bytes = new Uint8Array(16);
    cryptoRef.getRandomValues(bytes);
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `${prefix}-${hex}`;
  }

  fallbackCounter += 1;
  return `${prefix}-${fallbackCounter.toString(36)}`;
};
