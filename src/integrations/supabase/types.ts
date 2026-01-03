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
          speed?: number
          system_favor_current?: number
          system_favor_die?: number
          system_favor_max?: number
          tool_proficiencies?: string[] | null
          updated_at?: string
          user_id?: string
          weapon_proficiencies?: string[] | null
        }
        Relationships: []
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
