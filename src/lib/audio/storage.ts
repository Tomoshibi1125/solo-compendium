/**
 * Audio blob storage using IndexedDB
 * Keeps local uploads playable across reloads.
 */

const DB_NAME = 'solo-compendium-audio';
const STORE_NAME = 'audio-files';
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveAudioFile(id: string, file: Blob): Promise<void> {
  await withStore('readwrite', (store) => store.put(file, id));
}

export async function loadAudioFile(id: string): Promise<Blob | null> {
  try {
    const result = await withStore<Blob | undefined>('readonly', (store) => store.get(id));
    return result ?? null;
  } catch {
    return null;
  }
}

export async function deleteAudioFile(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id));
}
