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
      character_powers: {
        Row: {
          casting_time: string | null
          character_id: string
          concentration: boolean
          created_at: string
          description: string | null
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
          bonds: string[] | null
          created_at: string
          description: string
          feature_description: string | null
          feature_name: string | null
          flaws: string[] | null
          id: string
          ideals: string[] | null
          language_count: number | null
          name: string
          personality_traits: string[] | null
          skill_proficiencies: string[] | null
          source_book: string | null
          starting_credits: number | null
          starting_equipment: string | null
          tags: string[] | null
          tool_proficiencies: string[] | null
        }
        Insert: {
          bonds?: string[] | null
          created_at?: string
          description: string
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          id?: string
          ideals?: string[] | null
          language_count?: number | null
          name: string
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          source_book?: string | null
          starting_credits?: number | null
          starting_equipment?: string | null
          tags?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Update: {
          bonds?: string[] | null
          created_at?: string
          description?: string
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          id?: string
          ideals?: string[] | null
          language_count?: number | null
          name?: string
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          source_book?: string | null
          starting_credits?: number | null
          starting_equipment?: string | null
          tags?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Relationships: []
      }
      compendium_conditions: {
        Row: {
          created_at: string
          description: string
          effects: string[] | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          effects?: string[] | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          effects?: string[] | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      compendium_equipment: {
        Row: {
          armor_class: number | null
          cost_credits: number | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string | null
          equipment_type: string
          id: string
          name: string
          properties: string[] | null
          source_book: string | null
          weight: number | null
        }
        Insert: {
          armor_class?: number | null
          cost_credits?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          equipment_type: string
          id?: string
          name: string
          properties?: string[] | null
          source_book?: string | null
          weight?: number | null
        }
        Update: {
          armor_class?: number | null
          cost_credits?: number | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          equipment_type?: string
          id?: string
          name?: string
          properties?: string[] | null
          source_book?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      compendium_feats: {
        Row: {
          benefits: string[] | null
          created_at: string
          description: string
          id: string
          name: string
          prerequisites: string | null
          source_book: string | null
          tags: string[] | null
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          description: string
          id?: string
          name: string
          prerequisites?: string | null
          source_book?: string | null
          tags?: string[] | null
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          prerequisites?: string | null
          source_book?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      compendium_job_features: {
        Row: {
          action_type: string | null
          created_at: string
          description: string
          id: string
          is_path_feature: boolean
          job_id: string
          level: number
          name: string
          path_id: string | null
          prerequisites: string | null
          recharge: string | null
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          description: string
          id?: string
          is_path_feature?: boolean
          job_id: string
          level: number
          name: string
          path_id?: string | null
          prerequisites?: string | null
          recharge?: string | null
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string
          description?: string
          id?: string
          is_path_feature?: boolean
          job_id?: string
          level?: number
          name?: string
          path_id?: string | null
          prerequisites?: string | null
          recharge?: string | null
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
          created_at: string
          description: string
          flavor_text: string | null
          id: string
          job_id: string
          name: string
          path_level: number
          source_book: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          description: string
          flavor_text?: string | null
          id?: string
          job_id: string
          name: string
          path_level?: number
          source_book?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string
          flavor_text?: string | null
          id?: string
          job_id?: string
          name?: string
          path_level?: number
          source_book?: string | null
          tags?: string[] | null
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
          armor_proficiencies: string[] | null
          created_at: string
          description: string
          flavor_text: string | null
          hit_die: number
          id: string
          name: string
          primary_abilities: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count: number
          skill_choices: string[] | null
          source_book: string | null
          tags: string[] | null
          tool_proficiencies: string[] | null
          updated_at: string
          weapon_proficiencies: string[] | null
        }
        Insert: {
          armor_proficiencies?: string[] | null
          created_at?: string
          description: string
          flavor_text?: string | null
          hit_die?: number
          id?: string
          name: string
          primary_abilities?: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count?: number
          skill_choices?: string[] | null
          source_book?: string | null
          tags?: string[] | null
          tool_proficiencies?: string[] | null
          updated_at?: string
          weapon_proficiencies?: string[] | null
        }
        Update: {
          armor_proficiencies?: string[] | null
          created_at?: string
          description?: string
          flavor_text?: string | null
          hit_die?: number
          id?: string
          name?: string
          primary_abilities?: Database["public"]["Enums"]["ability_score"][]
          saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][]
          secondary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          skill_choice_count?: number
          skill_choices?: string[] | null
          source_book?: string | null
          tags?: string[] | null
          tool_proficiencies?: string[] | null
          updated_at?: string
          weapon_proficiencies?: string[] | null
        }
        Relationships: []
      }
      compendium_monarch_features: {
        Row: {
          action_type: string | null
          created_at: string
          description: string
          id: string
          is_signature: boolean
          level: number
          monarch_id: string
          name: string
          prerequisites: string | null
          recharge: string | null
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          description: string
          id?: string
          is_signature?: boolean
          level: number
          monarch_id: string
          name: string
          prerequisites?: string | null
          recharge?: string | null
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string
          description?: string
          id?: string
          is_signature?: boolean
          level?: number
          monarch_id?: string
          name?: string
          prerequisites?: string | null
          recharge?: string | null
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
          corruption_risk: string | null
          created_at: string
          damage_type: string | null
          description: string
          flavor_text: string | null
          id: string
          lore: string | null
          manifestation_description: string | null
          name: string
          prerequisites: string | null
          primary_abilities:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book: string | null
          tags: string[] | null
          theme: string
          title: string
          unlock_level: number
          updated_at: string
        }
        Insert: {
          corruption_risk?: string | null
          created_at?: string
          damage_type?: string | null
          description: string
          flavor_text?: string | null
          id?: string
          lore?: string | null
          manifestation_description?: string | null
          name: string
          prerequisites?: string | null
          primary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book?: string | null
          tags?: string[] | null
          theme: string
          title: string
          unlock_level?: number
          updated_at?: string
        }
        Update: {
          corruption_risk?: string | null
          created_at?: string
          damage_type?: string | null
          description?: string
          flavor_text?: string | null
          id?: string
          lore?: string | null
          manifestation_description?: string | null
          name?: string
          prerequisites?: string | null
          primary_abilities?:
            | Database["public"]["Enums"]["ability_score"][]
            | null
          source_book?: string | null
          tags?: string[] | null
          theme?: string
          title?: string
          unlock_level?: number
          updated_at?: string
        }
        Relationships: []
      }
      compendium_monster_actions: {
        Row: {
          action_type: string
          attack_bonus: number | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string
          id: string
          legendary_cost: number | null
          monster_id: string
          name: string
          recharge: string | null
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
          monster_id: string
          name: string
          recharge?: string | null
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
          created_at: string
          description: string
          id: string
          monster_id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          monster_id: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
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
          gate_rank: string | null
          hit_points_average: number
          hit_points_formula: string
          id: string
          int: number
          is_boss: boolean
          languages: string[] | null
          lore: string | null
          name: string
          pre: number
          saving_throws: Json | null
          sense: number
          senses: Json | null
          size: string
          skills: Json | null
          source_book: string | null
          speed_burrow: number | null
          speed_climb: number | null
          speed_fly: number | null
          speed_swim: number | null
          speed_walk: number | null
          str: number
          tags: string[] | null
          vit: number
          xp: number | null
        }
        Insert: {
          agi?: number
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
          gate_rank?: string | null
          hit_points_average: number
          hit_points_formula: string
          id?: string
          int?: number
          is_boss?: boolean
          languages?: string[] | null
          lore?: string | null
          name: string
          pre?: number
          saving_throws?: Json | null
          sense?: number
          senses?: Json | null
          size?: string
          skills?: Json | null
          source_book?: string | null
          speed_burrow?: number | null
          speed_climb?: number | null
          speed_fly?: number | null
          speed_swim?: number | null
          speed_walk?: number | null
          str?: number
          tags?: string[] | null
          vit?: number
          xp?: number | null
        }
        Update: {
          agi?: number
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
          gate_rank?: string | null
          hit_points_average?: number
          hit_points_formula?: string
          id?: string
          int?: number
          is_boss?: boolean
          languages?: string[] | null
          lore?: string | null
          name?: string
          pre?: number
          saving_throws?: Json | null
          sense?: number
          senses?: Json | null
          size?: string
          skills?: Json | null
          source_book?: string | null
          speed_burrow?: number | null
          speed_climb?: number | null
          speed_fly?: number | null
          speed_swim?: number | null
          speed_walk?: number | null
          str?: number
          tags?: string[] | null
          vit?: number
          xp?: number | null
        }
        Relationships: []
      }
      compendium_powers: {
        Row: {
          casting_time: string
          components: string | null
          concentration: boolean
          created_at: string
          description: string
          duration: string
          higher_levels: string | null
          id: string
          job_names: string[] | null
          name: string
          power_level: number
          range: string
          ritual: boolean
          school: string | null
          source_book: string | null
          tags: string[] | null
        }
        Insert: {
          casting_time: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description: string
          duration: string
          higher_levels?: string | null
          id?: string
          job_names?: string[] | null
          name: string
          power_level?: number
          range: string
          ritual?: boolean
          school?: string | null
          source_book?: string | null
          tags?: string[] | null
        }
        Update: {
          casting_time?: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description?: string
          duration?: string
          higher_levels?: string | null
          id?: string
          job_names?: string[] | null
          name?: string
          power_level?: number
          range?: string
          ritual?: boolean
          school?: string | null
          source_book?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      compendium_relics: {
        Row: {
          attunement_requirements: string | null
          corruption_risk: string | null
          created_at: string
          description: string
          id: string
          item_type: string
          name: string
          properties: string[] | null
          quirks: string[] | null
          rarity: Database["public"]["Enums"]["rarity"]
          relic_tier: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement: boolean
          source_book: string | null
          tags: string[] | null
          value_credits: number | null
        }
        Insert: {
          attunement_requirements?: string | null
          corruption_risk?: string | null
          created_at?: string
          description: string
          id?: string
          item_type: string
          name: string
          properties?: string[] | null
          quirks?: string[] | null
          rarity?: Database["public"]["Enums"]["rarity"]
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          source_book?: string | null
          tags?: string[] | null
          value_credits?: number | null
        }
        Update: {
          attunement_requirements?: string | null
          corruption_risk?: string | null
          created_at?: string
          description?: string
          id?: string
          item_type?: string
          name?: string
          properties?: string[] | null
          quirks?: string[] | null
          rarity?: Database["public"]["Enums"]["rarity"]
          relic_tier?: Database["public"]["Enums"]["relic_tier"] | null
          requires_attunement?: boolean
          source_book?: string | null
          tags?: string[] | null
          value_credits?: number | null
        }
        Relationships: []
      }
      compendium_skills: {
        Row: {
          ability: string
          created_at: string
          description: string
          examples: string[] | null
          id: string
          name: string
          source_book: string | null
        }
        Insert: {
          ability: string
          created_at?: string
          description: string
          examples?: string[] | null
          id?: string
          name: string
          source_book?: string | null
        }
        Update: {
          ability?: string
          created_at?: string
          description?: string
          examples?: string[] | null
          id?: string
          name?: string
          source_book?: string | null
        }
        Relationships: []
      }
      compendium_sovereign_features: {
        Row: {
          action_type: string | null
          created_at: string
          description: string
          id: string
          is_capstone: boolean
          level: number
          name: string
          origin_sources: string[] | null
          recharge: string | null
          sovereign_id: string
          uses_formula: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          description: string
          id?: string
          is_capstone?: boolean
          level: number
          name: string
          origin_sources?: string[] | null
          recharge?: string | null
          sovereign_id: string
          uses_formula?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string
          description?: string
          id?: string
          is_capstone?: boolean
          level?: number
          name?: string
          origin_sources?: string[] | null
          recharge?: string | null
          sovereign_id?: string
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
          created_at: string
          description: string
          fusion_description: string | null
          fusion_theme: string | null
          id: string
          is_ai_generated: boolean
          is_template: boolean
          job_id: string | null
          monarch_a_id: string | null
          monarch_b_id: string | null
          name: string
          path_id: string | null
          prerequisites: string | null
          source_book: string | null
          tags: string[] | null
          unlock_level: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          fusion_description?: string | null
          fusion_theme?: string | null
          id?: string
          is_ai_generated?: boolean
          is_template?: boolean
          job_id?: string | null
          monarch_a_id?: string | null
          monarch_b_id?: string | null
          name: string
          path_id?: string | null
          prerequisites?: string | null
          source_book?: string | null
          tags?: string[] | null
          unlock_level?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          fusion_description?: string | null
          fusion_theme?: string | null
          id?: string
          is_ai_generated?: boolean
          is_template?: boolean
          job_id?: string | null
          monarch_a_id?: string | null
          monarch_b_id?: string | null
          name?: string
          path_id?: string | null
          prerequisites?: string | null
          source_book?: string | null
          tags?: string[] | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ability_score: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE"
      rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary"
      relic_tier: "dormant" | "awakened" | "resonant"
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
      relic_tier: ["dormant", "awakened", "resonant"],
    },
  },
} as const
