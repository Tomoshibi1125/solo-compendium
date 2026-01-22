import { logger } from '@/lib/logger';

type CompendiumCacheItem = {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  searchText?: string;
  cachedAt?: number;
  [key: string]: unknown;
};

type CharacterCacheItem = {
  id: string;
  userId?: string;
  cachedAt?: number;
  [key: string]: unknown;
};

type DiceRollCacheItem = {
  id: string;
  timestamp?: number;
  cachedAt?: number;
  [key: string]: unknown;
};

type SyncQueueItem = {
  type: 'compendium' | 'character' | 'campaign' | 'diceRoll';
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
};

// Offline Storage Manager
export class OfflineStorageManager {
  private dbName = 'soloCompendiumOffline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        if (!event) return;
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      
      // Create object stores
      request.onupgradeneeded = (event) => {
        if (!event) return;
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Compendium cache
        if (!db.objectStoreNames.contains('compendium')) {
          const compendiumStore = db.createObjectStore('compendium', { keyPath: 'id' });
          compendiumStore.createIndex('type', 'type', { unique: false });
          compendiumStore.createIndex('searchText', 'searchText', { unique: false });
        }
        
        // Characters cache
        if (!db.objectStoreNames.contains('characters')) {
          const charactersStore = db.createObjectStore('characters', { keyPath: 'id' });
          charactersStore.createIndex('userId', 'userId', { unique: false });
        }
        
        // Campaigns cache
        if (!db.objectStoreNames.contains('campaigns')) {
          const campaignsStore = db.createObjectStore('campaigns', { keyPath: 'id' });
          campaignsStore.createIndex('dmId', 'dmId', { unique: false });
        }
        
        // Dice rolls cache
        if (!db.objectStoreNames.contains('diceRolls')) {
          const diceRollsStore = db.createObjectStore('diceRolls', { keyPath: 'id' });
          diceRollsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async storeCompendiumItem(item: CompendiumCacheItem): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['compendium'], 'readwrite');
      const store = transaction.objectStore('compendium');
      const request = store.put({
        ...item,
        cachedAt: Date.now(),
        searchText: `${item.name} ${item.description || ''} ${item.type || ''}`.toLowerCase(),
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCompendiumItem(id: string): Promise<CompendiumCacheItem | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['compendium'], 'readonly');
      const store = transaction.objectStore('compendium');
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve((request.result as CompendiumCacheItem | null) ?? null);
    });
  }

  async searchCompendium(query: string, type?: string): Promise<CompendiumCacheItem[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['compendium'], 'readonly');
      const store = transaction.objectStore('compendium');
      
      let request: IDBRequest;
      
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = (request.result as CompendiumCacheItem[] | undefined) ?? [];
        const filtered = results.filter((item) =>
          typeof item.searchText === 'string' && item.searchText.includes(query.toLowerCase())
        );
        resolve(filtered);
      };
    });
  }

  async storeCharacter(character: CharacterCacheItem): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['characters'], 'readwrite');
      const store = transaction.objectStore('characters');
      const request = store.put({
        ...character,
        cachedAt: Date.now(),
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCharacter(id: string): Promise<CharacterCacheItem | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['characters'], 'readonly');
      const store = transaction.objectStore('characters');
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve((request.result as CharacterCacheItem | null) ?? null);
    });
  }

  async getUserCharacters(userId: string): Promise<CharacterCacheItem[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['characters'], 'readonly');
      const store = transaction.objectStore('characters');
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve((request.result as CharacterCacheItem[]) ?? []);
    });
  }

  async storeDiceRoll(roll: DiceRollCacheItem): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['diceRolls'], 'readwrite');
      const store = transaction.objectStore('diceRolls');
      const request = store.put({
        ...roll,
        cachedAt: Date.now(),
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getDiceRolls(limit = 50): Promise<DiceRollCacheItem[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['diceRolls'], 'readonly');
      const store = transaction.objectStore('diceRolls');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');
      
      const results: DiceRollCacheItem[] = [];
      
      request.onsuccess = (event: Event) => {
        if (!event) return;
        const successEvent = event.target as IDBRequest;
        const cursor = successEvent.result as IDBCursorWithValue | null;
        if (cursor && results.length < limit) {
          results.push(cursor.value as DiceRollCacheItem);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async clearCache(): Promise<void> {
    if (!this.db) await this.init();
    
    const stores = ['compendium', 'characters', 'campaigns', 'diceRolls'];
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
  }

  async getCacheSize(): Promise<number> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const stores = ['compendium', 'characters', 'campaigns', 'diceRolls'];
      let totalSize = 0;
      let completedStores = 0;
      
      stores.forEach(storeName => {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();
        
        request.onsuccess = () => {
          totalSize += request.result;
          completedStores++;
          
          if (completedStores === stores.length) {
            resolve(totalSize);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    });
  }
}

// Background Sync Manager
export class BackgroundSyncManager {
  private static instance: BackgroundSyncManager;
  private storage: OfflineStorageManager;
  private syncQueue: SyncQueueItem[] = [];

  constructor() {
    this.storage = new OfflineStorageManager();
    this.loadSyncQueue();
  }

  static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager();
    }
    return BackgroundSyncManager.instance;
  }

  private async loadSyncQueue(): Promise<void> {
    try {
      const stored = localStorage.getItem('syncQueue');
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        this.syncQueue = Array.isArray(parsed) ? (parsed as SyncQueueItem[]) : [];
      }
    } catch (error) {
      logger.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      logger.error('Failed to save sync queue:', error);
    }
  }

  addToQueue(type: SyncQueueItem['type'], action: SyncQueueItem['action'], data: Record<string, unknown>): void {
    this.syncQueue.push({
      type,
      action,
      data,
      timestamp: Date.now(),
    });
    this.saveSyncQueue();
  }

  async processQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    const itemsToProcess = [...this.syncQueue];
    this.syncQueue = [];
    this.saveSyncQueue();

    for (const item of itemsToProcess) {
      try {
        await this.processItem(item);
      } catch (error) {
        logger.error('Failed to process sync item:', error);
        // Re-add to queue to retry later
        this.syncQueue.push(item);
      }
    }
    
    this.saveSyncQueue();
  }

  private async processItem(item: SyncQueueItem): Promise<void> {
    // This would integrate with your actual API
    logger.debug('Processing sync item:', item);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove from offline cache if successful
    if (item.action === 'delete') {
      switch (item.type) {
        case 'compendium':
          // Would call API to delete, then remove from cache
          break;
        case 'character': {
          const characterId = typeof item.data.id === 'string' ? item.data.id : null;
          if (characterId) {
            await this.storage.getCharacter(characterId).then((character) => {
              if (character) {
                // Delete from cache after successful API deletion
              }
            });
          }
          break;
        }
      }
    }
  }

  getQueueLength(): number {
    return this.syncQueue.length;
  }
}


