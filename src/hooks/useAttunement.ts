/**
 * Attunement re-export shim.
 *
 * The live attunement flow lives in `useEquipment()` (Supabase persistence,
 * optimistic cache updates, and the `item:attune` domain event) backed by the
 * shared rules in `@/lib/attunementRules`. This module only re-exports
 * `MAX_ATTUNEMENT_SLOTS` so existing consumers keep their import path stable.
 */

export { MAX_ATTUNEMENT_SLOTS } from "@/lib/attunementRules";
