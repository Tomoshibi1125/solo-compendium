export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campaign_character_shares: {
        Row: {
          campaign_id: string
          character_id: string
          id: string
          permissions: string
          shared_at: string
          shared_by: string
        }
        Insert: {
          campaign_id: string
          character_id: string
          id?: string
          permissions?: string
          shared_at?: string
          shared_by: string
        }
        Update: {
          campaign_id?: string
          character_id?: string
          id?: string
          permissions?: string
          shared_at?: string
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_character_shares_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_character_shares_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_members: {
        Row: {
          campaign_id: string
          character_id: string | null
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          character_id?: string | null
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          character_id?: string | null
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_members_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_members_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_messages: {
        Row: {
          campaign_id: string
          character_name: string | null
          content: string
          created_at: string
          id: string
          message_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          character_name?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          character_name?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_notes: {
        Row: {
          campaign_id: string
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_shared: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_shared?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_shared?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_notes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          dm_id: string
          id: string
          is_active: boolean
          name: string
          settings: Json
          share_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dm_id: string
          id?: string
          is_active?: boolean
          name: string
          settings?: Json
          share_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dm_id?: string
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json
          share_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      character_abilities: {
        Row: {
          ability: Database["public"]["Enums"]["ability_score"]
          character_id: string
          id: string
          score: number
        }
        Insert: {
          ability: Database["public"]["Enums"]["ability_score"]
          character_id: string
          id?: string
          score?: number
        }
        Update: {
          ability?: Database["public"]["Enums"]["ability_score"]
          character_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_equipment: {
        Row: {
          character_id: string
          charges_current: number | null
          charges_max: number | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_attuned: boolean
          is_equipped: boolean
          item_type: string
          name: string
          properties: string[] | null
          quantity: number
          rarity: Database["public"]["Enums"]["rarity"] | null
          relic_tier: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement: boolean
          value_credits: number | null
          weight: number | null
        }
        Insert: {
          character_id: string
          charges_current?: number | null
          charges_max?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_attuned?: boolean
          is_equipped?: boolean
          item_type: string
          name: string
          properties?: string[] | null
          quantity?: number
          rarity?: Database["public"]["Enums"]["rarity"] | null
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          value_credits?: number | null
          weight?: number | null
        }
        Update: {
          character_id?: string
          charges_current?: number | null
          charges_max?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_attuned?: boolean
          is_equipped?: boolean
          item_type?: string
          name?: string
          properties?: string[] | null
          quantity?: number
          rarity?: Database["public"]["Enums"]["rarity"] | null
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          value_credits?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_equipment_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_features: {
        Row: {
          action_type: string | null
          character_id: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          level_acquired: number
          name: string
          recharge: string | null
          source: string
          uses_current: number | null
          uses_max: number | null
        }
        Insert: {
          action_type?: string | null
          character_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          level_acquired?: number
          name: string
          recharge?: string | null
          source: string
          uses_current?: number | null
          uses_max?: number | null
        }
        Update: {
          action_type?: string | null
          character_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          level_acquired?: number
          name?: string
          recharge?: string | null
          source?: string
          uses_current?: number | null
          uses_max?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_features_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_journal: {
        Row: {
          character_id: string
          content: string | null
          created_at: string
          id: string
          session_date: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          character_id: string
          content?: string | null
          created_at?: string
          id?: string
          session_date?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          character_id?: string
          content?: string | null
          created_at?: string
          id?: string
          session_date?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_journal_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_monarch_unlocks: {
        Row: {
          character_id: string
          dm_notes: string | null
          id: string
          is_primary: boolean
          monarch_id: string
          quest_name: string
          unlocked_at: string
        }
        Insert: {
          character_id: string
          dm_notes?: string | null
          id?: string
          is_primary?: boolean
          monarch_id: string
          quest_name: string
          unlocked_at?: string
        }
        Update: {
          character_id?: string
          dm_notes?: string | null
          id?: string
          is_primary?: boolean
          monarch_id?: string
          quest_name?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_monarch_unlocks_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_monarch_unlocks_monarch_id_fkey"
            columns: ["monarch_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
        ]
      }
      character_powers: {
        Row: {
          casting_time: string | null
          character_id: string
          concentration: boolean
          created_at: string
          description: string | null
          display_order: number | null
          duration: string | null
          higher_levels: string | null
          id: string
          is_known: boolean
          is_prepared: boolean
          name: string
          power_level: number
          range: string | null
          source: string | null
        }
        Insert: {
          casting_time?: string | null
          character_id: string
          concentration?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          higher_levels?: string | null
          id?: string
          is_known?: boolean
          is_prepared?: boolean
          name: string
          power_level?: number
          range?: string | null
          source?: string | null
        }
        Update: {
          casting_time?: string | null
          character_id?: string
          concentration?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          higher_levels?: string | null
          id?: string
          is_known?: boolean
          is_prepared?: boolean
          name?: string
          power_level?: number
          range?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_powers_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_sheet_state: {
        Row: {
          character_id: string
          created_at: string
          custom_modifiers: Json
          id: string
          resources: Json
          updated_at: string
        }
        Insert: {
          character_id: string
          created_at?: string
          custom_modifiers?: Json
          id?: string
          resources?: Json
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          custom_modifiers?: Json
          id?: string
          resources?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_sheet_state_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_rune_inscriptions: {
        Row: {
          applied_cross_penalty: string | null
          character_id: string
          created_at: string
          effective_requirement_multiplier: number | null
          equipment_id: string
          id: string
          inscribed_by: string | null
          inscription_date: string
          inscription_quality: number | null
          is_active: boolean
          rune_id: string
          times_used: number | null
          uses_current: number | null
          uses_max: number | null
        }
        Insert: {
          applied_cross_penalty?: string | null
          character_id: string
          created_at?: string
          effective_requirement_multiplier?: number | null
          equipment_id: string
          id?: string
          inscribed_by?: string | null
          inscription_date?: string
          inscription_quality?: number | null
          is_active?: boolean
          rune_id: string
          times_used?: number | null
          uses_current?: number | null
          uses_max?: number | null
        }
        Update: {
          applied_cross_penalty?: string | null
          character_id?: string
          created_at?: string
          effective_requirement_multiplier?: number | null
          equipment_id?: string
          id?: string
          inscribed_by?: string | null
          inscription_date?: string
          inscription_quality?: number | null
          is_active?: boolean
          rune_id?: string
          times_used?: number | null
          uses_current?: number | null
          uses_max?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_rune_inscriptions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_rune_inscriptions_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "character_equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_rune_inscriptions_rune_id_fkey"
            columns: ["rune_id"]
            isOneToOne: false
            referencedRelation: "compendium_runes"
            referencedColumns: ["id"]
          },
        ]
      }
      character_rune_knowledge: {
        Row: {
          can_teach: boolean | null
          character_id: string
          created_at: string
          id: string
          learned_date: string
          learned_from: string | null
          learned_from_character_id: string | null
          mastery_level: number | null
          rune_id: string
        }
        Insert: {
          can_teach?: boolean | null
          character_id: string
          created_at?: string
          id?: string
          learned_date?: string
          learned_from?: string | null
          learned_from_character_id?: string | null
          mastery_level?: number | null
          rune_id: string
        }
        Update: {
          can_teach?: boolean | null
          character_id?: string
          created_at?: string
          id?: string
          learned_date?: string
          learned_from?: string | null
          learned_from_character_id?: string | null
          mastery_level?: number | null
          rune_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_rune_knowledge_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_rune_knowledge_learned_from_character_id_fkey"
            columns: ["learned_from_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_rune_knowledge_rune_id_fkey"
            columns: ["rune_id"]
            isOneToOne: false
            referencedRelation: "compendium_runes"
            referencedColumns: ["id"]
          },
        ]
      }
      character_shadow_army: {
        Row: {
          character_id: string
          created_at: string
          dismissed_at: string | null
          hp_current: number | null
          hp_max: number | null
          id: string
          instance_name: string | null
          is_active: boolean
          is_dismissed: boolean
          notes: string | null
          shadow_soldier_id: string
          summoned_at: string
          updated_at: string
        }
        Insert: {
          character_id: string
          created_at?: string
          dismissed_at?: string | null
          hp_current?: number | null
          hp_max?: number | null
          id?: string
          instance_name?: string | null
          is_active?: boolean
          is_dismissed?: boolean
          notes?: string | null
          shadow_soldier_id: string
          summoned_at?: string
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          dismissed_at?: string | null
          hp_current?: number | null
          hp_max?: number | null
          id?: string
          instance_name?: string | null
          is_active?: boolean
          is_dismissed?: boolean
          notes?: string | null
          shadow_soldier_id?: string
          summoned_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_shadow_army_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_shadow_army_shadow_soldier_id_fkey"
            columns: ["shadow_soldier_id"]
            isOneToOne: false
            referencedRelation: "compendium_shadow_soldiers"
            referencedColumns: ["id"]
          },
        ]
      }
      character_shadow_soldiers: {
        Row: {
          bond_level: number
          character_id: string
          created_at: string
          current_hp: number
          id: string
          is_summoned: boolean
          nickname: string | null
          soldier_id: string
        }
        Insert: {
          bond_level?: number
          character_id: string
          created_at?: string
          current_hp: number
          id?: string
          is_summoned?: boolean
          nickname?: string | null
          soldier_id: string
        }
        Update: {
          bond_level?: number
          character_id?: string
          created_at?: string
          current_hp?: number
          id?: string
          is_summoned?: boolean
          nickname?: string | null
          soldier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_shadow_soldiers_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_shadow_soldiers_soldier_id_fkey"
            columns: ["soldier_id"]
            isOneToOne: false
            referencedRelation: "compendium_shadow_soldiers"
            referencedColumns: ["id"]
          },
        ]
      }
      character_spell_slots: {
        Row: {
          character_id: string
          created_at: string
          id: string
          slots_current: number
          slots_max: number
          slots_recovered_on_long_rest: number
          slots_recovered_on_short_rest: number
          spell_level: number
          updated_at: string
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          slots_current?: number
          slots_max?: number
          slots_recovered_on_long_rest?: number
          slots_recovered_on_short_rest?: number
          spell_level: number
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          slots_current?: number
          slots_max?: number
          slots_recovered_on_long_rest?: number
          slots_recovered_on_short_rest?: number
          spell_level?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_spell_slots_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_templates: {
        Row: {
          character_data: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          share_code: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          character_data: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          share_code?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          character_data?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          share_code?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          appearance: string | null
          armor_class: number
          armor_proficiencies: string[] | null
          background: string | null
          backstory: string | null
          conditions: string[] | null
          created_at: string
          exhaustion_level: number
          experience: number
          hit_dice_current: number
          hit_dice_max: number
          hit_dice_size: number
          hp_current: number
          hp_max: number
          hp_temp: number
          id: string
          initiative: number
          job: string | null
          level: number
          monarch_overlays: string[] | null
          name: string
          notes: string | null
          path: string | null
          portrait_url: string | null
          proficiency_bonus: number
          saving_throw_proficiencies:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          shadow_energy_current: number
          shadow_energy_max: number
          share_token: string | null
          skill_expertise: string[] | null
          skill_proficiencies: string[] | null
          sovereign_id: string | null
          speed: number
          system_favor_current: number
          system_favor_die: number
          system_favor_max: number
          tool_proficiencies: string[] | null
          updated_at: string
          user_id: string
          weapon_proficiencies: string[] | null
        }
        Insert: {
          appearance?: string | null
          armor_class?: number
          armor_proficiencies?: string[] | null
          background?: string | null
          backstory?: string | null
          conditions?: string[] | null
          created_at?: string
          exhaustion_level?: number
          experience?: number
          hit_dice_current?: number
          hit_dice_max?: number
          hit_dice_size?: number
          hp_current?: number
          hp_max?: number
          hp_temp?: number
          id?: string
          initiative?: number
          job?: string | null
          level?: number
          monarch_overlays?: string[] | null
          name: string
          notes?: string | null
          path?: string | null
          portrait_url?: string | null
          proficiency_bonus?: number
          saving_throw_proficiencies?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          shadow_energy_current?: number
          shadow_energy_max?: number
          share_token?: string | null
          skill_expertise?: string[] | null
          skill_proficiencies?: string[] | null
          sovereign_id?: string | null
          speed?: number
          system_favor_current?: number
          system_favor_die?: number
          system_favor_max?: number
          tool_proficiencies?: string[] | null
          updated_at?: string
          user_id: string
          weapon_proficiencies?: string[] | null
        }
        Update: {
          appearance?: string | null
          armor_class?: number
          armor_proficiencies?: string[] | null
          background?: string | null
          backstory?: string | null
          conditions?: string[] | null
          created_at?: string
          exhaustion_level?: number
          experience?: number
          hit_dice_current?: number
          hit_dice_max?: number
          hit_dice_size?: number
          hp_current?: number
          hp_max?: number
          hp_temp?: number
          id?: string
          initiative?: number
          job?: string | null
          level?: number
          monarch_overlays?: string[] | null
          name?: string
          notes?: string | null
          path?: string | null
          portrait_url?: string | null
          proficiency_bonus?: number
          saving_throw_proficiencies?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          shadow_energy_current?: number
          shadow_energy_max?: number
          share_token?: string | null
          skill_expertise?: string[] | null
          skill_proficiencies?: string[] | null
          sovereign_id?: string | null
          speed?: number
          system_favor_current?: number
          system_favor_die?: number
          system_favor_max?: number
          tool_proficiencies?: string[] | null
          updated_at?: string
          user_id?: string
          weapon_proficiencies?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_sovereign_id_fkey"
            columns: ["sovereign_id"]
            isOneToOne: false
            referencedRelation: "compendium_sovereigns"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_backgrounds: {
        Row: {
          aliases: string[] | null
          bonds: string[] | null
          created_at: string
          description: string
          display_name: string | null
          feature_description: string | null
          feature_name: string | null
          flaws: string[] | null
          generated_reason: string | null
          id: string
          ideals: string[] | null
          language_count: number | null
          license_note: string | null
          name: string
          personality_traits: string[] | null
          skill_proficiencies: string[] | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          starting_credits: number | null
          starting_equipment: string | null
          tags: string[] | null
          theme_tags: string[] | null
          tool_proficiencies: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          bonds?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          generated_reason?: string | null
          id?: string
          ideals?: string[] | null
          language_count?: number | null
          license_note?: string | null
          name: string
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          starting_credits?: number | null
          starting_equipment?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          bonds?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          generated_reason?: string | null
          id?: string
          ideals?: string[] | null
          language_count?: number | null
          license_note?: string | null
          name?: string
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          starting_credits?: number | null
          starting_equipment?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Relationships: []
      }
      compendium_conditions: {
        Row: {
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          effects: string[] | null
          generated_reason: string | null
          id: string
          license_note: string | null
          name: string
          source_kind: string | null
          source_name: string | null
          theme_tags: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          effects?: string[] | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name: string
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          effects?: string[] | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name?: string
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
        }
        Relationships: []
      }
      compendium_equipment: {
        Row: {
          aliases: string[] | null
          armor_class: number | null
          cost_credits: number | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string | null
          display_name: string | null
          equipment_type: string
          generated_reason: string | null
          id: string
          image_generated_at: string | null
          image_url: string | null
          license_note: string | null
          name: string
          properties: string[] | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
          weight: number | null
        }
        Insert: {
          aliases?: string[] | null
          armor_class?: number | null
          cost_credits?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          display_name?: string | null
          equipment_type: string
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          license_note?: string | null
          name: string
          properties?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          weight?: number | null
        }
        Update: {
          aliases?: string[] | null
          armor_class?: number | null
          cost_credits?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          display_name?: string | null
          equipment_type?: string
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          license_note?: string | null
          name?: string
          properties?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          weight?: number | null
        }
        Relationships: []
      }
      compendium_feats: {
        Row: {
          aliases: string[] | null
          benefits: string[] | null
          created_at: string
          description: string
          display_name: string | null
          generated_reason: string | null
          id: string
          license_note: string | null
          name: string
          prerequisites: string | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          benefits?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name: string
          prerequisites?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          benefits?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name?: string
          prerequisites?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Relationships: []
      }
      compendium_job_features: {
        Row: {
          action_type: string | null
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          generated_reason: string | null
          id: string
          is_path_feature: boolean
          job_id: string
          level: number
          license_note: string | null
          name: string
          path_id: string | null
          prerequisites: string | null
          recharge: string | null
          source_kind: string | null
          source_name: string | null
          theme_tags: string[] | null
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_path_feature?: boolean
          job_id: string
          level: number
          license_note?: string | null
          name: string
          path_id?: string | null
          prerequisites?: string | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_path_feature?: boolean
          job_id?: string
          level?: number
          license_note?: string | null
          name?: string
          path_id?: string | null
          prerequisites?: string | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_job_features_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "compendium_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compendium_job_features_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "compendium_job_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_job_paths: {
        Row: {
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          flavor_text: string | null
          generated_reason: string | null
          id: string
          image_generated_at: string | null
          image_url: string | null
          job_id: string
          license_note: string | null
          name: string
          path_level: number
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          job_id: string
          license_note?: string | null
          name: string
          path_level?: number
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          job_id?: string
          license_note?: string | null
          name?: string
          path_level?: number
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_job_paths_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "compendium_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_jobs: {
        Row: {
          aliases: string[] | null
          armor_proficiencies: string[] | null
          created_at: string
          description: string
          display_name: string | null
          flavor_text: string | null
          generated_reason: string | null
          hit_die: number
          id: string
          image_generated_at: string | null
          image_url: string | null
          license_note: string | null
          name: string
          primary_abilities: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count: number
          skill_choices: string[] | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
          tool_proficiencies: string[] | null
          updated_at: string
          weapon_proficiencies: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          armor_proficiencies?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          hit_die?: number
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          license_note?: string | null
          name: string
          primary_abilities?: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count?: number
          skill_choices?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          tool_proficiencies?: string[] | null
          updated_at?: string
          weapon_proficiencies?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          armor_proficiencies?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          hit_die?: number
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          license_note?: string | null
          name?: string
          primary_abilities?: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count?: number
          skill_choices?: string[] | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          tool_proficiencies?: string[] | null
          updated_at?: string
          weapon_proficiencies?: string[] | null
        }
        Relationships: []
      }
      compendium_monarch_features: {
        Row: {
          action_type: string | null
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          generated_reason: string | null
          id: string
          is_signature: boolean
          level: number
          license_note: string | null
          monarch_id: string
          name: string
          prerequisites: string | null
          recharge: string | null
          source_kind: string | null
          source_name: string | null
          theme_tags: string[] | null
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_signature?: boolean
          level: number
          license_note?: string | null
          monarch_id: string
          name: string
          prerequisites?: string | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_signature?: boolean
          level?: number
          license_note?: string | null
          monarch_id?: string
          name?: string
          prerequisites?: string | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_monarch_features_monarch_id_fkey"
            columns: ["monarch_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_monarchs: {
        Row: {
          aliases: string[] | null
          corruption_risk: string | null
          created_at: string
          damage_type: string | null
          description: string
          display_name: string | null
          flavor_text: string | null
          generated_reason: string | null
          id: string
          license_note: string | null
          lore: string | null
          manifestation_description: string | null
          name: string
          prerequisites: string | null
          primary_abilities:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme: string
          theme_tags: string[] | null
          title: string
          unlock_level: number
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          corruption_risk?: string | null
          created_at?: string
          damage_type?: string | null
          description: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          lore?: string | null
          manifestation_description?: string | null
          name: string
          prerequisites?: string | null
          primary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme: string
          theme_tags?: string[] | null
          title: string
          unlock_level?: number
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          corruption_risk?: string | null
          created_at?: string
          damage_type?: string | null
          description?: string
          display_name?: string | null
          flavor_text?: string | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          lore?: string | null
          manifestation_description?: string | null
          name?: string
          prerequisites?: string | null
          primary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme?: string
          theme_tags?: string[] | null
          title?: string
          unlock_level?: number
          updated_at?: string
        }
        Relationships: []
      }
      compendium_monster_actions: {
        Row: {
          action_type: string
          aliases: string[] | null
          attack_bonus: number | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string
          display_name: string | null
          id: string
          legendary_cost: number | null
          monster_id: string
          name: string
          recharge: string | null
        }
        Insert: {
          action_type?: string
          aliases?: string[] | null
          attack_bonus?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description: string
          display_name?: string | null
          id?: string
          legendary_cost?: number | null
          monster_id: string
          name: string
          recharge?: string | null
        }
        Update: {
          action_type?: string
          aliases?: string[] | null
          attack_bonus?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string
          display_name?: string | null
          id?: string
          legendary_cost?: number | null
          monster_id?: string
          name?: string
          recharge?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_monster_actions_monster_id_fkey"
            columns: ["monster_id"]
            isOneToOne: false
            referencedRelation: "compendium_monsters"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_monster_traits: {
        Row: {
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          id: string
          monster_id: string
          name: string
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          id?: string
          monster_id: string
          name: string
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          id?: string
          monster_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "compendium_monster_traits_monster_id_fkey"
            columns: ["monster_id"]
            isOneToOne: false
            referencedRelation: "compendium_monsters"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_monsters: {
        Row: {
          agi: number
          aliases: string[] | null
          alignment: string | null
          armor_class: number
          armor_type: string | null
          condition_immunities: string[] | null
          cr: string
          created_at: string
          creature_type: string
          damage_immunities: string[] | null
          damage_resistances: string[] | null
          damage_vulnerabilities: string[] | null
          description: string | null
          display_name: string | null
          gate_rank: string | null
          generated_reason: string | null
          hit_points_average: number
          hit_points_formula: string
          id: string
          image_generated_at: string | null
          image_url: string | null
          int: number
          is_boss: boolean
          languages: string[] | null
          license_note: string | null
          lore: string | null
          name: string
          pre: number
          saving_throws: Json | null
          sense: number
          senses: Json | null
          size: string
          skills: Json | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          speed_burrow: number | null
          speed_climb: number | null
          speed_fly: number | null
          speed_swim: number | null
          speed_walk: number | null
          str: number
          tags: string[] | null
          theme_tags: string[] | null
          vit: number
          xp: number | null
        }
        Insert: {
          agi?: number
          aliases?: string[] | null
          alignment?: string | null
          armor_class: number
          armor_type?: string | null
          condition_immunities?: string[] | null
          cr: string
          created_at?: string
          creature_type: string
          damage_immunities?: string[] | null
          damage_resistances?: string[] | null
          damage_vulnerabilities?: string[] | null
          description?: string | null
          display_name?: string | null
          gate_rank?: string | null
          generated_reason?: string | null
          hit_points_average: number
          hit_points_formula: string
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          int?: number
          is_boss?: boolean
          languages?: string[] | null
          license_note?: string | null
          lore?: string | null
          name: string
          pre?: number
          saving_throws?: Json | null
          sense?: number
          senses?: Json | null
          size?: string
          skills?: Json | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          speed_burrow?: number | null
          speed_climb?: number | null
          speed_fly?: number | null
          speed_swim?: number | null
          speed_walk?: number | null
          str?: number
          tags?: string[] | null
          theme_tags?: string[] | null
          vit?: number
          xp?: number | null
        }
        Update: {
          agi?: number
          aliases?: string[] | null
          alignment?: string | null
          armor_class?: number
          armor_type?: string | null
          condition_immunities?: string[] | null
          cr?: string
          created_at?: string
          creature_type?: string
          damage_immunities?: string[] | null
          damage_resistances?: string[] | null
          damage_vulnerabilities?: string[] | null
          description?: string | null
          display_name?: string | null
          gate_rank?: string | null
          generated_reason?: string | null
          hit_points_average?: number
          hit_points_formula?: string
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          int?: number
          is_boss?: boolean
          languages?: string[] | null
          license_note?: string | null
          lore?: string | null
          name?: string
          pre?: number
          saving_throws?: Json | null
          sense?: number
          senses?: Json | null
          size?: string
          skills?: Json | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          speed_burrow?: number | null
          speed_climb?: number | null
          speed_fly?: number | null
          speed_swim?: number | null
          speed_walk?: number | null
          str?: number
          tags?: string[] | null
          theme_tags?: string[] | null
          vit?: number
          xp?: number | null
        }
        Relationships: []
      }
      compendium_powers: {
        Row: {
          aliases: string[] | null
          casting_time: string
          components: string | null
          concentration: boolean
          created_at: string
          description: string
          display_name: string | null
          duration: string
          generated_reason: string | null
          higher_levels: string | null
          id: string
          image_generated_at: string | null
          image_url: string | null
          job_names: string[] | null
          license_note: string | null
          name: string
          power_level: number
          range: string
          ritual: boolean
          school: string | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
        }
        Insert: {
          aliases?: string[] | null
          casting_time: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description: string
          display_name?: string | null
          duration: string
          generated_reason?: string | null
          higher_levels?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          job_names?: string[] | null
          license_note?: string | null
          name: string
          power_level?: number
          range: string
          ritual?: boolean
          school?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Update: {
          aliases?: string[] | null
          casting_time?: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description?: string
          display_name?: string | null
          duration?: string
          generated_reason?: string | null
          higher_levels?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          job_names?: string[] | null
          license_note?: string | null
          name?: string
          power_level?: number
          range?: string
          ritual?: boolean
          school?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
        }
        Relationships: []
      }
      compendium_relics: {
        Row: {
          aliases: string[] | null
          attunement_requirements: string | null
          corruption_risk: string | null
          created_at: string
          description: string
          display_name: string | null
          generated_reason: string | null
          id: string
          image_generated_at: string | null
          image_url: string | null
          item_type: string
          license_note: string | null
          name: string
          properties: string[] | null
          quirks: string[] | null
          rarity: Database["public"]["Enums"]["rarity"]
          relic_tier: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement: boolean
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
          value_credits: number | null
        }
        Insert: {
          aliases?: string[] | null
          attunement_requirements?: string | null
          corruption_risk?: string | null
          created_at?: string
          description: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          item_type: string
          license_note?: string | null
          name: string
          properties?: string[] | null
          quirks?: string[] | null
          rarity?: Database["public"]["Enums"]["rarity"]
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          value_credits?: number | null
        }
        Update: {
          aliases?: string[] | null
          attunement_requirements?: string | null
          corruption_risk?: string | null
          created_at?: string
          description?: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          image_generated_at?: string | null
          image_url?: string | null
          item_type?: string
          license_note?: string | null
          name?: string
          properties?: string[] | null
          quirks?: string[] | null
          rarity?: Database["public"]["Enums"]["rarity"]
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          value_credits?: number | null
        }
        Relationships: []
      }
      compendium_rules: {
        Row: {
          category: string
          created_at: string
          description: string
          examples: string[] | null
          id: string
          license_note: string | null
          name: string
          source_kind: string | null
          source_name: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          examples?: string[] | null
          id?: string
          license_note?: string | null
          name: string
          source_kind?: string | null
          source_name?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          examples?: string[] | null
          id?: string
          license_note?: string | null
          name?: string
          source_kind?: string | null
          source_name?: string | null
        }
        Relationships: []
      }
      compendium_runes: {
        Row: {
          activation_action: string | null
          activation_cost: string | null
          activation_cost_amount: number | null
          aliases: string[] | null
          can_inscribe_on: string[] | null
          caster_penalty: string | null
          caster_requirement_multiplier: number | null
          concentration: boolean | null
          created_at: string
          description: string
          discovery_lore: string | null
          display_name: string | null
          duration: string | null
          effect_description: string
          effect_type: string
          higher_levels: string | null
          id: string
          inscription_difficulty: number | null
          lore: string | null
          martial_penalty: string | null
          martial_requirement_multiplier: number | null
          name: string
          passive_bonuses: Json | null
          range: string | null
          rarity: Database["public"]["Enums"]["rarity"]
          recharge: string | null
          requirement_agi: number | null
          requirement_int: number | null
          requirement_pre: number | null
          requirement_sense: number | null
          requirement_str: number | null
          requirement_vit: number | null
          requires_job: string[] | null
          requires_level: number | null
          rune_category: string
          rune_level: number
          rune_type: string
          source_book: string | null
          tags: string[] | null
          updated_at: string
          uses_per_rest: string | null
        }
        Insert: {
          activation_action?: string | null
          activation_cost?: string | null
          activation_cost_amount?: number | null
          aliases?: string[] | null
          can_inscribe_on?: string[] | null
          caster_penalty?: string | null
          caster_requirement_multiplier?: number | null
          concentration?: boolean | null
          created_at?: string
          description: string
          discovery_lore?: string | null
          display_name?: string | null
          duration?: string | null
          effect_description: string
          effect_type: string
          higher_levels?: string | null
          id?: string
          inscription_difficulty?: number | null
          lore?: string | null
          martial_penalty?: string | null
          martial_requirement_multiplier?: number | null
          name: string
          passive_bonuses?: Json | null
          range?: string | null
          rarity?: Database["public"]["Enums"]["rarity"]
          recharge?: string | null
          requirement_agi?: number | null
          requirement_int?: number | null
          requirement_pre?: number | null
          requirement_sense?: number | null
          requirement_str?: number | null
          requirement_vit?: number | null
          requires_job?: string[] | null
          requires_level?: number | null
          rune_category: string
          rune_level?: number
          rune_type: string
          source_book?: string | null
          tags?: string[] | null
          updated_at?: string
          uses_per_rest?: string | null
        }
        Update: {
          activation_action?: string | null
          activation_cost?: string | null
          activation_cost_amount?: number | null
          aliases?: string[] | null
          can_inscribe_on?: string[] | null
          caster_penalty?: string | null
          caster_requirement_multiplier?: number | null
          concentration?: boolean | null
          created_at?: string
          description?: string
          discovery_lore?: string | null
          display_name?: string | null
          duration?: string | null
          effect_description?: string
          effect_type?: string
          higher_levels?: string | null
          id?: string
          inscription_difficulty?: number | null
          lore?: string | null
          martial_penalty?: string | null
          martial_requirement_multiplier?: number | null
          name?: string
          passive_bonuses?: Json | null
          range?: string | null
          rarity?: Database["public"]["Enums"]["rarity"]
          recharge?: string | null
          requirement_agi?: number | null
          requirement_int?: number | null
          requirement_pre?: number | null
          requirement_sense?: number | null
          requirement_str?: number | null
          requirement_vit?: number | null
          requires_job?: string[] | null
          requires_level?: number | null
          rune_category?: string
          rune_level?: number
          rune_type?: string
          source_book?: string | null
          tags?: string[] | null
          updated_at?: string
          uses_per_rest?: string | null
        }
        Relationships: []
      }
      compendium_shadow_soldier_abilities: {
        Row: {
          ability_type: string
          created_at: string
          description: string
          id: string
          name: string
          recharge: string | null
          shadow_soldier_id: string
          uses_per_day: number | null
        }
        Insert: {
          ability_type?: string
          created_at?: string
          description: string
          id?: string
          name: string
          recharge?: string | null
          shadow_soldier_id: string
          uses_per_day?: number | null
        }
        Update: {
          ability_type?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          recharge?: string | null
          shadow_soldier_id?: string
          uses_per_day?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_shadow_soldier_abilities_shadow_soldier_id_fkey"
            columns: ["shadow_soldier_id"]
            isOneToOne: false
            referencedRelation: "compendium_shadow_soldiers"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_shadow_soldier_actions: {
        Row: {
          action_type: string
          attack_bonus: number | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string
          id: string
          legendary_cost: number | null
          name: string
          recharge: string | null
          shadow_soldier_id: string
        }
        Insert: {
          action_type?: string
          attack_bonus?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description: string
          id?: string
          legendary_cost?: number | null
          name: string
          recharge?: string | null
          shadow_soldier_id: string
        }
        Update: {
          action_type?: string
          attack_bonus?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string
          id?: string
          legendary_cost?: number | null
          name?: string
          recharge?: string | null
          shadow_soldier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compendium_shadow_soldier_actions_shadow_soldier_id_fkey"
            columns: ["shadow_soldier_id"]
            isOneToOne: false
            referencedRelation: "compendium_shadow_soldiers"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_shadow_soldier_traits: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          shadow_soldier_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          shadow_soldier_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          shadow_soldier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compendium_shadow_soldier_traits_shadow_soldier_id_fkey"
            columns: ["shadow_soldier_id"]
            isOneToOne: false
            referencedRelation: "compendium_shadow_soldiers"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_shadow_soldiers: {
        Row: {
          abilities: Json
          agi: number
          aliases: string[] | null
          armor_class: number
          condition_immunities: string[] | null
          created_at: string
          damage_immunities: string[] | null
          description: string
          display_name: string | null
          hit_points: number
          id: string
          int: number
          lore: string | null
          name: string
          pre: number
          rank: string
          sense: number
          shadow_type: string
          speed: number
          str: number
          summon_requirements: string | null
          title: string
          vit: number
        }
        Insert: {
          abilities?: Json
          agi?: number
          aliases?: string[] | null
          armor_class?: number
          condition_immunities?: string[] | null
          created_at?: string
          damage_immunities?: string[] | null
          description: string
          display_name?: string | null
          hit_points?: number
          id?: string
          int?: number
          lore?: string | null
          name: string
          pre?: number
          rank: string
          sense?: number
          shadow_type?: string
          speed?: number
          str?: number
          summon_requirements?: string | null
          title: string
          vit?: number
        }
        Update: {
          abilities?: Json
          agi?: number
          aliases?: string[] | null
          armor_class?: number
          condition_immunities?: string[] | null
          created_at?: string
          damage_immunities?: string[] | null
          description?: string
          display_name?: string | null
          hit_points?: number
          id?: string
          int?: number
          lore?: string | null
          name?: string
          pre?: number
          rank?: string
          sense?: number
          shadow_type?: string
          speed?: number
          str?: number
          summon_requirements?: string | null
          title?: string
          vit?: number
        }
        Relationships: []
      }
      compendium_skills: {
        Row: {
          ability: string
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          examples: string[] | null
          generated_reason: string | null
          id: string
          license_note: string | null
          name: string
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          theme_tags: string[] | null
        }
        Insert: {
          ability: string
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          examples?: string[] | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name: string
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
        }
        Update: {
          ability?: string
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          examples?: string[] | null
          generated_reason?: string | null
          id?: string
          license_note?: string | null
          name?: string
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          theme_tags?: string[] | null
        }
        Relationships: []
      }
      compendium_sovereign_features: {
        Row: {
          action_type: string | null
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          generated_reason: string | null
          id: string
          is_capstone: boolean
          level: number
          license_note: string | null
          name: string
          origin_sources: string[] | null
          recharge: string | null
          source_kind: string | null
          source_name: string | null
          sovereign_id: string
          theme_tags: string[] | null
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_capstone?: boolean
          level: number
          license_note?: string | null
          name: string
          origin_sources?: string[] | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          sovereign_id: string
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          generated_reason?: string | null
          id?: string
          is_capstone?: boolean
          level?: number
          license_note?: string | null
          name?: string
          origin_sources?: string[] | null
          recharge?: string | null
          source_kind?: string | null
          source_name?: string | null
          sovereign_id?: string
          theme_tags?: string[] | null
          uses_formula?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compendium_sovereign_features_sovereign_id_fkey"
            columns: ["sovereign_id"]
            isOneToOne: false
            referencedRelation: "compendium_sovereigns"
            referencedColumns: ["id"]
          },
        ]
      }
      compendium_sovereigns: {
        Row: {
          aliases: string[] | null
          created_at: string
          description: string
          display_name: string | null
          fusion_description: string | null
          fusion_theme: string | null
          generated_reason: string | null
          id: string
          is_ai_generated: boolean
          is_template: boolean
          job_id: string | null
          license_note: string | null
          monarch_a_id: string | null
          monarch_b_id: string | null
          name: string
          path_id: string | null
          prerequisites: string | null
          source_book: string | null
          source_kind: string | null
          source_name: string | null
          tags: string[] | null
          theme_tags: string[] | null
          unlock_level: number
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          description: string
          display_name?: string | null
          fusion_description?: string | null
          fusion_theme?: string | null
          generated_reason?: string | null
          id?: string
          is_ai_generated?: boolean
          is_template?: boolean
          job_id?: string | null
          license_note?: string | null
          monarch_a_id?: string | null
          monarch_b_id?: string | null
          name: string
          path_id?: string | null
          prerequisites?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          unlock_level?: number
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          description?: string
          display_name?: string | null
          fusion_description?: string | null
          fusion_theme?: string | null
          generated_reason?: string | null
          id?: string
          is_ai_generated?: boolean
          is_template?: boolean
          job_id?: string | null
          license_note?: string | null
          monarch_a_id?: string | null
          monarch_b_id?: string | null
          name?: string
          path_id?: string | null
          prerequisites?: string | null
          source_book?: string | null
          source_kind?: string | null
          source_name?: string | null
          tags?: string[] | null
          theme_tags?: string[] | null
          unlock_level?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compendium_sovereigns_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "compendium_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compendium_sovereigns_monarch_a_id_fkey"
            columns: ["monarch_a_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compendium_sovereigns_monarch_b_id_fkey"
            columns: ["monarch_b_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compendium_sovereigns_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "compendium_job_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      roll_history: {
        Row: {
          campaign_id: string | null
          character_id: string | null
          context: string | null
          created_at: string
          dice_formula: string
          id: string
          modifiers: Json | null
          result: number
          roll_type: string
          rolls: number[]
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          character_id?: string | null
          context?: string | null
          created_at?: string
          dice_formula: string
          id?: string
          modifiers?: Json | null
          result: number
          roll_type: string
          rolls: number[]
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          character_id?: string | null
          context?: string | null
          created_at?: string
          dice_formula?: string
          id?: string
          modifiers?: Json | null
          result?: number
          roll_type?: string
          rolls?: number[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roll_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_history_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          id: string
          name: string
          search_params: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          search_params?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          search_params?: Json
          user_id?: string
        }
        Relationships: []
      }
      saved_sovereigns: {
        Row: {
          abilities: Json
          created_at: string
          created_by: string
          description: string
          fusion_description: string
          fusion_method: string
          fusion_stability: string
          fusion_theme: string
          id: string
          is_public: boolean
          job_id: string
          likes_count: number
          monarch_a_id: string
          monarch_b_id: string
          name: string
          path_id: string
          power_multiplier: string
          title: string
        }
        Insert: {
          abilities?: Json
          created_at?: string
          created_by: string
          description: string
          fusion_description: string
          fusion_method: string
          fusion_stability: string
          fusion_theme: string
          id?: string
          is_public?: boolean
          job_id: string
          likes_count?: number
          monarch_a_id: string
          monarch_b_id: string
          name: string
          path_id: string
          power_multiplier: string
          title: string
        }
        Update: {
          abilities?: Json
          created_at?: string
          created_by?: string
          description?: string
          fusion_description?: string
          fusion_method?: string
          fusion_stability?: string
          fusion_theme?: string
          id?: string
          is_public?: boolean
          job_id?: string
          likes_count?: number
          monarch_a_id?: string
          monarch_b_id?: string
          name?: string
          path_id?: string
          power_multiplier?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_sovereigns_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "compendium_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_sovereigns_monarch_a_id_fkey"
            columns: ["monarch_a_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_sovereigns_monarch_b_id_fkey"
            columns: ["monarch_b_id"]
            isOneToOne: false
            referencedRelation: "compendium_monarchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_sovereigns_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "compendium_job_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          entry_id: string
          entry_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          entry_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          entry_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_shadow_energy_max: {
        Args: { character_level: number }
        Returns: number
      }
      create_campaign_with_code: {
        Args: { p_description: string; p_dm_id: string; p_name: string }
        Returns: string
      }
      generate_character_share_token: { Args: never; Returns: string }
      generate_character_share_token_for_character: {
        Args: { p_character_id: string }
        Returns: string
      }
      generate_share_code: { Args: never; Returns: string }
      get_campaign_member_count: {
        Args: { p_campaign_id: string }
        Returns: number
      }
      get_character_by_share_token: {
        Args: { p_character_id: string; p_share_token: string }
        Returns: {
          armor_class: number
          background: string
          created_at: string
          hp_current: number
          hp_max: number
          hp_temp: number
          id: string
          job: string
          level: number
          name: string
          notes: string
          path: string
          portrait_url: string
          share_token: string
          speed: number
          updated_at: string
          user_id: string
        }[]
      }
      prepare_search_text: { Args: { input_text: string }; Returns: string }
      search_compendium_jobs: {
        Args: { search_text: string }
        Returns: {
          created_at: string
          description: string
          id: string
          image_url: string
          name: string
          rank: number
          source_book: string
          tags: string[]
        }[]
      }
      search_compendium_monarchs: {
        Args: { search_text: string }
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          rank: number
          source_book: string
          tags: string[]
          theme: string
          title: string
        }[]
      }
      search_compendium_monsters: {
        Args: { search_text: string }
        Returns: {
          cr: string
          created_at: string
          creature_type: string
          description: string
          id: string
          name: string
          rank: number
          source_book: string
          tags: string[]
        }[]
      }
      search_compendium_paths: {
        Args: { search_text: string }
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          rank: number
          source_book: string
          tags: string[]
        }[]
      }
      search_compendium_powers: {
        Args: { search_text: string }
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          power_level: number
          rank: number
          school: string
          source_book: string
          tags: string[]
        }[]
      }
      search_compendium_relics: {
        Args: { search_text: string }
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          rank: number
          rarity: string
          source_book: string
          tags: string[]
        }[]
      }
    }
    Enums: {
      ability_score: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE"
      rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary"
      relic_tier: "E" | "D" | "C" | "B" | "A" | "S" | "SS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ability_score: ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"],
      rarity: ["common", "uncommon", "rare", "very_rare", "legendary"],
      relic_tier: ["E", "D", "C", "B", "A", "S", "SS"],
    },
  },
} as const
