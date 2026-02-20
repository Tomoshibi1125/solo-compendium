/**
 * Domain Events Module
 *
 * Typed event contracts for all core gameplay mutations.
 * Each event carries a guaranteed payload schema including
 * classId, geminiState, and regents references.
 *
 * Consumers subscribe via addEventListener / removeEventListener
 * on the singleton DomainEventBus.
 */

// ---------------------------------------------------------------------------
// Shared payload fragments
// ---------------------------------------------------------------------------

export interface GeminiStateRef {
  sovereignId: string | null;
  isActive: boolean;
  fusionTheme: string | null;
  powerMultiplier: string | null;
}

export interface RegentRef {
  regentId: string;
  regentName: string;
  isPrimary: boolean;
  theme: string | null;
}

export interface ActiveEffectRef {
  sourceType: 'class' | 'regent' | 'gemini' | 'item' | 'condition';
  sourceId: string;
  effectName: string;
  modifiers: Record<string, unknown>;
}

export interface CorePayloadFields {
  characterId: string;
  characterName: string;
  classId: string | null;
  className: string | null;
  pathId: string | null;
  pathName: string | null;
  level: number;
  geminiState: GeminiStateRef;
  regents: RegentRef[];
  activeEffects: ActiveEffectRef[];
  timestamp: string;
  campaignId: string | null;
}

// ---------------------------------------------------------------------------
// Event-specific payloads
// ---------------------------------------------------------------------------

export interface CharacterSaveEvent extends CorePayloadFields {
  type: 'character:save';
  changedFields: string[];
}

export interface CharacterLevelUpEvent extends CorePayloadFields {
  type: 'character:levelup';
  previousLevel: number;
  newLevel: number;
  hpIncrease: number;
  newFeatures: string[];
  isPathUnlockLevel: boolean;
  isASILevel: boolean;
}

export interface SpellCastEvent extends CorePayloadFields {
  type: 'spell:cast';
  spellName: string;
  spellLevel: number;
  castAtLevel: number;
  slotExpended: boolean;
  isRitual: boolean;
  isConcentration: boolean;
}

export interface CombatAttackEvent extends CorePayloadFields {
  type: 'combat:attack';
  attackName: string;
  attackRoll: number;
  damageRoll: number | null;
  damageType: string | null;
  isHit: boolean;
  isCritical: boolean;
  targetName: string | null;
  advantageState: 'normal' | 'advantage' | 'disadvantage';
}

export interface RestShortEvent extends CorePayloadFields {
  type: 'rest:short';
  hitDiceSpent: number;
  hpRecovered: number;
  featuresRecharged: string[];
  slotsRecovered: number[];
}

export interface RestLongEvent extends CorePayloadFields {
  type: 'rest:long';
  hpRecovered: number;
  hitDiceRecovered: number;
  featuresRecharged: string[];
  slotsRecovered: number[];
  exhaustionReduced: boolean;
  conditionsCleared: string[];
}

export interface ItemAttuneEvent extends CorePayloadFields {
  type: 'item:attune';
  itemId: string;
  itemName: string;
  action: 'attune' | 'unattune';
  currentAttunementCount: number;
  maxAttunementSlots: number;
}

export interface EncounterCreateEvent extends CorePayloadFields {
  type: 'encounter:create';
  encounterId: string;
  encounterName: string;
  monsterCount: number;
  totalXP: number;
  difficulty: string;
}

// ---------------------------------------------------------------------------
// Union type
// ---------------------------------------------------------------------------

export type DomainEvent =
  | CharacterSaveEvent
  | CharacterLevelUpEvent
  | SpellCastEvent
  | CombatAttackEvent
  | RestShortEvent
  | RestLongEvent
  | ItemAttuneEvent
  | EncounterCreateEvent;

export type DomainEventType = DomainEvent['type'];

// ---------------------------------------------------------------------------
// Event bus
// ---------------------------------------------------------------------------

type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

class DomainEventBusImpl {
  private handlers = new Map<DomainEventType, Set<EventHandler<any>>>();

  on<T extends DomainEvent>(type: T['type'], handler: EventHandler<T>): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  off<T extends DomainEvent>(type: T['type'], handler: EventHandler<T>): void {
    this.handlers.get(type)?.delete(handler);
  }

  emit<T extends DomainEvent>(event: T): void {
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        try {
          handler(event);
        } catch {
          // Swallow handler errors to prevent cascade failures
        }
      }
    }

    // Also emit to wildcard listeners
    const wildcardHandlers = this.handlers.get('*' as DomainEventType);
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          handler(event);
        } catch {
          // Swallow
        }
      }
    }
  }

  /** Subscribe to all event types. */
  onAny(handler: EventHandler<DomainEvent>): void {
    this.on('*' as DomainEventType, handler);
  }

  /** Unsubscribe from all event types. */
  offAny(handler: EventHandler<DomainEvent>): void {
    this.off('*' as DomainEventType, handler);
  }

  /** Remove all handlers (useful in tests). */
  clear(): void {
    this.handlers.clear();
  }
}

/** Singleton domain event bus. */
export const DomainEventBus = new DomainEventBusImpl();

// ---------------------------------------------------------------------------
// Helper: build default core payload
// ---------------------------------------------------------------------------

export function buildCorePayload(
  overrides: Partial<CorePayloadFields> & Pick<CorePayloadFields, 'characterId' | 'characterName'>
): CorePayloadFields {
  return {
    classId: null,
    className: null,
    pathId: null,
    pathName: null,
    level: 1,
    geminiState: { sovereignId: null, isActive: false, fusionTheme: null, powerMultiplier: null },
    regents: [],
    activeEffects: [],
    timestamp: new Date().toISOString(),
    campaignId: null,
    ...overrides,
  };
}
