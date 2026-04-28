export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.1";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			active_sessions: {
				Row: {
					campaign_id: string;
					combat_status: string;
					created_at: string | null;
					created_by: string;
					current_initiative: number | null;
					current_turn_player_id: string | null;
					description: string | null;
					id: string;
					map_data: Json | null;
					status: string;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					campaign_id: string;
					combat_status?: string;
					created_at?: string | null;
					created_by: string;
					current_initiative?: number | null;
					current_turn_player_id?: string | null;
					description?: string | null;
					id?: string;
					map_data?: Json | null;
					status?: string;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					campaign_id?: string;
					combat_status?: string;
					created_at?: string | null;
					created_by?: string;
					current_initiative?: number | null;
					current_turn_player_id?: string | null;
					description?: string | null;
					id?: string;
					map_data?: Json | null;
					status?: string;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "active_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "active_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			ai_generated_content: {
				Row: {
					content: Json;
					content_type: string;
					created_at: string | null;
					entity_id: string;
					entity_type: string;
					id: string;
					metadata: Json | null;
					updated_at: string | null;
				};
				Insert: {
					content: Json;
					content_type: string;
					created_at?: string | null;
					entity_id: string;
					entity_type: string;
					id?: string;
					metadata?: Json | null;
					updated_at?: string | null;
				};
				Update: {
					content?: Json;
					content_type?: string;
					created_at?: string | null;
					entity_id?: string;
					entity_type?: string;
					id?: string;
					metadata?: Json | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			ai_usage_logs: {
				Row: {
					cost: number | null;
					created_at: string | null;
					id: string;
					metadata: Json | null;
					request_type: string;
					service_id: string;
					tokens_used: number | null;
					user_id: string | null;
				};
				Insert: {
					cost?: number | null;
					created_at?: string | null;
					id?: string;
					metadata?: Json | null;
					request_type: string;
					service_id: string;
					tokens_used?: number | null;
					user_id?: string | null;
				};
				Update: {
					cost?: number | null;
					created_at?: string | null;
					id?: string;
					metadata?: Json | null;
					request_type?: string;
					service_id?: string;
					tokens_used?: number | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			art_assets: {
				Row: {
					created_at: string | null;
					dimensions: Json;
					entity_id: string;
					entity_type: string;
					file_size: number;
					hash: string;
					id: string;
					metadata: Json;
					metadata_path: string;
					mime_type: string;
					paths: Json;
					updated_at: string | null;
					variant: string;
				};
				Insert: {
					created_at?: string | null;
					dimensions: Json;
					entity_id: string;
					entity_type: string;
					file_size: number;
					hash: string;
					id: string;
					metadata: Json;
					metadata_path: string;
					mime_type?: string;
					paths: Json;
					updated_at?: string | null;
					variant: string;
				};
				Update: {
					created_at?: string | null;
					dimensions?: Json;
					entity_id?: string;
					entity_type?: string;
					file_size?: number;
					hash?: string;
					id?: string;
					metadata?: Json;
					metadata_path?: string;
					mime_type?: string;
					paths?: Json;
					updated_at?: string | null;
					variant?: string;
				};
				Relationships: [];
			};
			assets: {
				Row: {
					created_at: string;
					id: string;
					metadata: Json | null;
					path: string;
					type: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					metadata?: Json | null;
					path: string;
					type: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					metadata?: Json | null;
					path?: string;
					type?: string;
				};
				Relationships: [];
			};
			audio_playlists: {
				Row: {
					auto_play: boolean;
					category: string;
					created_at: string;
					crossfade: number;
					description: string | null;
					id: string;
					name: string;
					repeat: string;
					shuffle: boolean;
					tracks: string[];
					updated_at: string;
					user_id: string;
					volume: number;
				};
				Insert: {
					auto_play?: boolean;
					category: string;
					created_at?: string;
					crossfade?: number;
					description?: string | null;
					id?: string;
					name: string;
					repeat?: string;
					shuffle?: boolean;
					tracks?: string[];
					updated_at?: string;
					user_id: string;
					volume?: number;
				};
				Update: {
					auto_play?: boolean;
					category?: string;
					created_at?: string;
					crossfade?: number;
					description?: string | null;
					id?: string;
					name?: string;
					repeat?: string;
					shuffle?: boolean;
					tracks?: string[];
					updated_at?: string;
					user_id?: string;
					volume?: number;
				};
				Relationships: [];
			};
			audio_tracks: {
				Row: {
					artist: string;
					category: string;
					created_at: string;
					duration: number;
					file_size: number | null;
					id: string;
					license: string;
					loop: boolean;
					mime_type: string | null;
					mood: string | null;
					source: string;
					storage_path: string;
					tags: string[];
					title: string;
					updated_at: string;
					user_id: string;
					volume: number;
				};
				Insert: {
					artist: string;
					category: string;
					created_at?: string;
					duration: number;
					file_size?: number | null;
					id?: string;
					license?: string;
					loop?: boolean;
					mime_type?: string | null;
					mood?: string | null;
					source?: string;
					storage_path: string;
					tags?: string[];
					title: string;
					updated_at?: string;
					user_id: string;
					volume?: number;
				};
				Update: {
					artist?: string;
					category?: string;
					created_at?: string;
					duration?: number;
					file_size?: number | null;
					id?: string;
					license?: string;
					loop?: boolean;
					mime_type?: string | null;
					mood?: string | null;
					source?: string;
					storage_path?: string;
					tags?: string[];
					title?: string;
					updated_at?: string;
					user_id?: string;
					volume?: number;
				};
				Relationships: [];
			};
			campaign_character_shares: {
				Row: {
					campaign_id: string;
					character_id: string;
					id: string;
					permissions: string;
					shared_at: string;
					shared_by: string;
				};
				Insert: {
					campaign_id: string;
					character_id: string;
					id?: string;
					permissions?: string;
					shared_at?: string;
					shared_by: string;
				};
				Update: {
					campaign_id?: string;
					character_id?: string;
					id?: string;
					permissions?: string;
					shared_at?: string;
					shared_by?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_character_shares_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_character_shares_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_character_shares_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_character_shares_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_combat_sessions: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					current_turn: number;
					encounter_id: string | null;
					id: string;
					round: number;
					status: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					current_turn?: number;
					encounter_id?: string | null;
					id?: string;
					round?: number;
					status?: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					current_turn?: number;
					encounter_id?: string | null;
					id?: string;
					round?: number;
					status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_combat_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_combat_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_combat_sessions_encounter_id_fkey";
						columns: ["encounter_id"];
						isOneToOne: false;
						referencedRelation: "campaign_encounters";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_combatants: {
				Row: {
					campaign_id: string;
					conditions: Json;
					created_at: string;
					flags: Json;
					id: string;
					initiative: number;
					member_id: string | null;
					name: string;
					session_id: string;
					stats: Json;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					conditions?: Json;
					created_at?: string;
					flags?: Json;
					id?: string;
					initiative?: number;
					member_id?: string | null;
					name: string;
					session_id: string;
					stats?: Json;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					conditions?: Json;
					created_at?: string;
					flags?: Json;
					id?: string;
					initiative?: number;
					member_id?: string | null;
					name?: string;
					session_id?: string;
					stats?: Json;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_combatants_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_combatants_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_combatants_member_id_fkey";
						columns: ["member_id"];
						isOneToOne: false;
						referencedRelation: "campaign_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_combatants_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "campaign_combat_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_content: {
				Row: {
					campaign_id: string | null;
					content_type: string;
					created_at: string | null;
					created_by: string | null;
					data: Json;
					description: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					campaign_id?: string | null;
					content_type: string;
					created_at?: string | null;
					created_by?: string | null;
					data: Json;
					description?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					campaign_id?: string | null;
					content_type?: string;
					created_at?: string | null;
					created_by?: string | null;
					data?: Json;
					description?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_content_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_content_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_content_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_encounter_entries: {
				Row: {
					campaign_id: string;
					created_at: string;
					encounter_id: string;
					entry_kind: string;
					id: string;
					monster_id: string | null;
					name: string;
					quantity: number;
					source: Json;
					stats: Json;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					encounter_id: string;
					entry_kind?: string;
					id?: string;
					monster_id?: string | null;
					name: string;
					quantity?: number;
					source?: Json;
					stats?: Json;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					encounter_id?: string;
					entry_kind?: string;
					id?: string;
					monster_id?: string | null;
					name?: string;
					quantity?: number;
					source?: Json;
					stats?: Json;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_encounter_entries_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_encounter_entries_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_encounter_entries_encounter_id_fkey";
						columns: ["encounter_id"];
						isOneToOne: false;
						referencedRelation: "campaign_encounters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_encounter_entries_monster_id_fkey";
						columns: ["monster_id"];
						isOneToOne: false;
						referencedRelation: "compendium_Anomalies";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_encounters: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					description: string | null;
					difficulty: Json;
					id: string;
					loot_summary: Json;
					name: string;
					updated_at: string;
					updated_by: string | null;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					difficulty?: Json;
					id?: string;
					loot_summary?: Json;
					name: string;
					updated_at?: string;
					updated_by?: string | null;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					difficulty?: Json;
					id?: string;
					loot_summary?: Json;
					name?: string;
					updated_at?: string;
					updated_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_encounters_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_encounters_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_extras: {
				Row: {
					ac: number | null;
					campaign_id: string;
					created_at: string;
					extra_type: string;
					hp_current: number;
					hp_max: number;
					id: string;
					is_active: boolean;
					name: string;
					notes: string | null;
					speed: number | null;
					updated_at: string;
				};
				Insert: {
					ac?: number | null;
					campaign_id: string;
					created_at?: string;
					extra_type: string;
					hp_current?: number;
					hp_max?: number;
					id?: string;
					is_active?: boolean;
					name: string;
					notes?: string | null;
					speed?: number | null;
					updated_at?: string;
				};
				Update: {
					ac?: number | null;
					campaign_id?: string;
					created_at?: string;
					extra_type?: string;
					hp_current?: number;
					hp_max?: number;
					id?: string;
					is_active?: boolean;
					name?: string;
					notes?: string | null;
					speed?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_extras_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_extras_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_inventory: {
				Row: {
					added_by: string | null;
					campaign_id: string;
					created_at: string;
					description: string | null;
					id: string;
					is_identified: boolean | null;
					item_type: string | null;
					name: string;
					quantity: number;
					updated_at: string;
					weight: number | null;
				};
				Insert: {
					added_by?: string | null;
					campaign_id: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_identified?: boolean | null;
					item_type?: string | null;
					name: string;
					quantity?: number;
					updated_at?: string;
					weight?: number | null;
				};
				Update: {
					added_by?: string | null;
					campaign_id?: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_identified?: boolean | null;
					item_type?: string | null;
					name?: string;
					quantity?: number;
					updated_at?: string;
					weight?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_inventory_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_inventory_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_invite_audit_logs: {
				Row: {
					action: string;
					actor_id: string | null;
					campaign_id: string;
					created_at: string;
					details: Json;
					id: string;
					invite_id: string | null;
				};
				Insert: {
					action: string;
					actor_id?: string | null;
					campaign_id: string;
					created_at?: string;
					details?: Json;
					id?: string;
					invite_id?: string | null;
				};
				Update: {
					action?: string;
					actor_id?: string | null;
					campaign_id?: string;
					created_at?: string;
					details?: Json;
					id?: string;
					invite_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_invite_audit_logs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_invite_audit_logs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_invite_audit_logs_invite_id_fkey";
						columns: ["invite_id"];
						isOneToOne: false;
						referencedRelation: "campaign_invites";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_invites: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					expires_at: string | null;
					id: string;
					invite_email: string | null;
					join_code: string;
					last_used_at: string | null;
					max_uses: number;
					metadata: Json;
					revoked_at: string | null;
					revoked_by: string | null;
					revoked_reason: string | null;
					role: string;
					token: string;
					token_hash: string;
					updated_at: string;
					used_count: number;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					expires_at?: string | null;
					id?: string;
					invite_email?: string | null;
					join_code: string;
					last_used_at?: string | null;
					max_uses?: number;
					metadata?: Json;
					revoked_at?: string | null;
					revoked_by?: string | null;
					revoked_reason?: string | null;
					role?: string;
					token: string;
					token_hash: string;
					updated_at?: string;
					used_count?: number;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					expires_at?: string | null;
					id?: string;
					invite_email?: string | null;
					join_code?: string;
					last_used_at?: string | null;
					max_uses?: number;
					metadata?: Json;
					revoked_at?: string | null;
					revoked_by?: string | null;
					revoked_reason?: string | null;
					role?: string;
					token?: string;
					token_hash?: string;
					updated_at?: string;
					used_count?: number;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_invites_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_invites_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_loot_drops: {
				Row: {
					assigned_to_member_id: string | null;
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					encounter_id: string | null;
					id: string;
					items: Json;
					session_id: string | null;
					total_value: number;
				};
				Insert: {
					assigned_to_member_id?: string | null;
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					encounter_id?: string | null;
					id?: string;
					items?: Json;
					session_id?: string | null;
					total_value?: number;
				};
				Update: {
					assigned_to_member_id?: string | null;
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					encounter_id?: string | null;
					id?: string;
					items?: Json;
					session_id?: string | null;
					total_value?: number;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_loot_drops_assigned_to_member_id_fkey";
						columns: ["assigned_to_member_id"];
						isOneToOne: false;
						referencedRelation: "campaign_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_loot_drops_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_loot_drops_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_loot_drops_encounter_id_fkey";
						columns: ["encounter_id"];
						isOneToOne: false;
						referencedRelation: "campaign_encounters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_loot_drops_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "campaign_combat_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_member_characters: {
				Row: {
					campaign_id: string;
					campaign_member_id: string;
					character_id: string;
					created_at: string;
					created_by: string | null;
					id: string;
				};
				Insert: {
					campaign_id: string;
					campaign_member_id: string;
					character_id: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
				};
				Update: {
					campaign_id?: string;
					campaign_member_id?: string;
					character_id?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_member_characters_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_member_characters_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_member_characters_campaign_member_id_fkey";
						columns: ["campaign_member_id"];
						isOneToOne: false;
						referencedRelation: "campaign_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_member_characters_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_member_characters_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_members: {
				Row: {
					campaign_id: string;
					character_id: string | null;
					id: string;
					joined_at: string;
					role: string;
					user_id: string;
				};
				Insert: {
					campaign_id: string;
					character_id?: string | null;
					id?: string;
					joined_at?: string;
					role?: string;
					user_id: string;
				};
				Update: {
					campaign_id?: string;
					character_id?: string | null;
					id?: string;
					joined_at?: string;
					role?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_members_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_members_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_members_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_members_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_messages: {
				Row: {
					campaign_id: string;
					character_name: string | null;
					content: string;
					created_at: string;
					id: string;
					message_type: string;
					metadata: Json | null;
					target_user_ids: string[] | null;
					user_id: string;
				};
				Insert: {
					campaign_id: string;
					character_name?: string | null;
					content: string;
					created_at?: string;
					id?: string;
					message_type?: string;
					metadata?: Json | null;
					target_user_ids?: string[] | null;
					user_id: string;
				};
				Update: {
					campaign_id?: string;
					character_name?: string | null;
					content?: string;
					created_at?: string;
					id?: string;
					message_type?: string;
					metadata?: Json | null;
					target_user_ids?: string[] | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_messages_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_messages_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_notes: {
				Row: {
					campaign_id: string;
					category: string | null;
					content: string | null;
					created_at: string;
					id: string;
					is_shared: boolean;
					title: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					campaign_id: string;
					category?: string | null;
					content?: string | null;
					created_at?: string;
					id?: string;
					is_shared?: boolean;
					title: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					campaign_id?: string;
					category?: string | null;
					content?: string | null;
					created_at?: string;
					id?: string;
					is_shared?: boolean;
					title?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_notes_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_notes_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_relic_instances: {
				Row: {
					assigned_at: string | null;
					bound_to_member_id: string | null;
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					id: string;
					name: string;
					properties: Json;
					rarity: string | null;
					relic_id: string | null;
					tradeable: boolean;
					value_credits: number | null;
				};
				Insert: {
					assigned_at?: string | null;
					bound_to_member_id?: string | null;
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					name: string;
					properties?: Json;
					rarity?: string | null;
					relic_id?: string | null;
					tradeable?: boolean;
					value_credits?: number | null;
				};
				Update: {
					assigned_at?: string | null;
					bound_to_member_id?: string | null;
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					name?: string;
					properties?: Json;
					rarity?: string | null;
					relic_id?: string | null;
					tradeable?: boolean;
					value_credits?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_relic_instances_bound_to_member_id_fkey";
						columns: ["bound_to_member_id"];
						isOneToOne: false;
						referencedRelation: "campaign_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_relic_instances_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_relic_instances_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_relic_instances_relic_id_fkey";
						columns: ["relic_id"];
						isOneToOne: false;
						referencedRelation: "compendium_relics";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_roll_events: {
				Row: {
					campaign_id: string;
					character_id: string | null;
					character_name: string | null;
					context: string | null;
					created_at: string;
					dice_formula: string;
					id: string;
					modifiers: Json | null;
					result: number;
					roll_type: string | null;
					rolls: number[] | null;
					user_id: string;
				};
				Insert: {
					campaign_id: string;
					character_id?: string | null;
					character_name?: string | null;
					context?: string | null;
					created_at?: string;
					dice_formula: string;
					id?: string;
					modifiers?: Json | null;
					result: number;
					roll_type?: string | null;
					rolls?: number[] | null;
					user_id: string;
				};
				Update: {
					campaign_id?: string;
					character_id?: string | null;
					character_name?: string | null;
					context?: string | null;
					created_at?: string;
					dice_formula?: string;
					id?: string;
					modifiers?: Json | null;
					result?: number;
					roll_type?: string | null;
					rolls?: number[] | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_roll_events_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_roll_events_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_roll_events_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_roll_events_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_rule_events: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					id: string;
					kind: string;
					payload: Json;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					kind: string;
					payload?: Json;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					kind?: string;
					payload?: Json;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_rule_events_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_rule_events_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_rules: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					rules: Json;
					updated_at: string;
					updated_by: string | null;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					rules?: Json;
					updated_at?: string;
					updated_by?: string | null;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					rules?: Json;
					updated_at?: string;
					updated_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_rules_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: true;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_rules_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: true;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_session_logs: {
				Row: {
					author_id: string;
					campaign_id: string;
					content: string;
					created_at: string;
					id: string;
					is_player_visible: boolean;
					log_type: string;
					metadata: Json;
					session_id: string | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					author_id: string;
					campaign_id: string;
					content: string;
					created_at?: string;
					id?: string;
					is_player_visible?: boolean;
					log_type?: string;
					metadata?: Json;
					session_id?: string | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string;
					campaign_id?: string;
					content?: string;
					created_at?: string;
					id?: string;
					is_player_visible?: boolean;
					log_type?: string;
					metadata?: Json;
					session_id?: string | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_session_logs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_session_logs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_session_logs_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "campaign_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_sessions: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					description: string | null;
					id: string;
					location: string | null;
					scheduled_for: string | null;
					status: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					location?: string | null;
					scheduled_for?: string | null;
					status?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					location?: string | null;
					scheduled_for?: string | null;
					status?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_sessions_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_sourcebook_shares: {
				Row: {
					campaign_id: string;
					created_at: string;
					id: string;
					shared_by: string;
					sourcebook_id: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					id?: string;
					shared_by: string;
					sourcebook_id: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					id?: string;
					shared_by?: string;
					sourcebook_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_sourcebook_shares_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_sourcebook_shares_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_sourcebook_shares_sourcebook_id_fkey";
						columns: ["sourcebook_id"];
						isOneToOne: false;
						referencedRelation: "sourcebook_catalog";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_tool_states: {
				Row: {
					campaign_id: string;
					created_at: string;
					created_by: string | null;
					id: string;
					state: Json;
					tool_key: string;
					updated_at: string;
					updated_by: string | null;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					state?: Json;
					tool_key: string;
					updated_at?: string;
					updated_by?: string | null;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					state?: Json;
					tool_key?: string;
					updated_at?: string;
					updated_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_tool_states_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_tool_states_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_wiki_articles: {
				Row: {
					campaign_id: string;
					category: string;
					content: string;
					created_at: string;
					created_by: string | null;
					id: string;
					is_public: boolean;
					title: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					category?: string;
					content?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					is_public?: boolean;
					title: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					category?: string;
					content?: string;
					created_at?: string;
					created_by?: string | null;
					id?: string;
					is_public?: boolean;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_wiki_articles_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_wiki_articles_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_wiki_articles_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			campaigns: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					is_active: boolean;
					name: string;
					party_gold: Json | null;
					settings: Json;
					share_code: string;
					updated_at: string;
					warden_id: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					name: string;
					party_gold?: Json | null;
					settings?: Json;
					share_code: string;
					updated_at?: string;
					warden_id: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					name?: string;
					party_gold?: Json | null;
					settings?: Json;
					share_code?: string;
					updated_at?: string;
					warden_id?: string;
				};
				Relationships: [];
			};
			character_abilities: {
				Row: {
					ability: Database["public"]["Enums"]["ability_score"];
					character_id: string;
					id: string;
					score: number;
				};
				Insert: {
					ability: Database["public"]["Enums"]["ability_score"];
					character_id: string;
					id?: string;
					score?: number;
				};
				Update: {
					ability?: Database["public"]["Enums"]["ability_score"];
					character_id?: string;
					id?: string;
					score?: number;
				};
				Relationships: [
					{
						foreignKeyName: "character_abilities_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_abilities_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_active_spells: {
				Row: {
					cast_at: string;
					character_id: string;
					concentration: boolean;
					created_at: string;
					duration_type: string | null;
					duration_value: number | null;
					effects: Json[] | null;
					id: string;
					level: number;
					spell_id: string;
					spell_name: string;
				};
				Insert: {
					cast_at?: string;
					character_id: string;
					concentration?: boolean;
					created_at?: string;
					duration_type?: string | null;
					duration_value?: number | null;
					effects?: Json[] | null;
					id?: string;
					level?: number;
					spell_id: string;
					spell_name: string;
				};
				Update: {
					cast_at?: string;
					character_id?: string;
					concentration?: boolean;
					created_at?: string;
					duration_type?: string | null;
					duration_value?: number | null;
					effects?: Json[] | null;
					id?: string;
					level?: number;
					spell_id?: string;
					spell_name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_active_spells_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_active_spells_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_spells: {
				Row: {
					casting_time: string | null;
					character_id: string;
					concentration: boolean;
					counts_against_limit: boolean;
					created_at: string;
					description: string | null;
					display_order: number | null;
					duration: string | null;
					higher_levels: string | null;
					id: string;
					is_known: boolean;
					is_prepared: boolean;
					learned_at: string;
					name: string;
					range: string | null;
					recharge: string | null;
					ritual: boolean;
					source: string;
					spell_id: string | null;
					spell_level: number;
					updated_at: string;
					uses_current: number | null;
					uses_max: number | null;
				};
				Insert: {
					casting_time?: string | null;
					character_id: string;
					concentration?: boolean;
					counts_against_limit?: boolean;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					duration?: string | null;
					higher_levels?: string | null;
					id?: string;
					is_known?: boolean;
					is_prepared?: boolean;
					learned_at?: string;
					name: string;
					range?: string | null;
					recharge?: string | null;
					ritual?: boolean;
					source?: string;
					spell_id?: string | null;
					spell_level?: number;
					updated_at?: string;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Update: {
					casting_time?: string | null;
					character_id?: string;
					concentration?: boolean;
					counts_against_limit?: boolean;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					duration?: string | null;
					higher_levels?: string | null;
					id?: string;
					is_known?: boolean;
					is_prepared?: boolean;
					learned_at?: string;
					name?: string;
					range?: string | null;
					recharge?: string | null;
					ritual?: boolean;
					source?: string;
					spell_id?: string | null;
					spell_level?: number;
					updated_at?: string;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_spells_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_spells_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_backups: {
				Row: {
					backup_data: Json;
					backup_name: string | null;
					character_id: string;
					created_at: string;
					id: string;
					user_id: string;
					version: number;
				};
				Insert: {
					backup_data: Json;
					backup_name?: string | null;
					character_id: string;
					created_at?: string;
					id?: string;
					user_id: string;
					version?: number;
				};
				Update: {
					backup_data?: Json;
					backup_name?: string | null;
					character_id?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
					version?: number;
				};
				Relationships: [
					{
						foreignKeyName: "character_backups_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_backups_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_equipment: {
				Row: {
					capacity_volume: number | null;
					capacity_weight: number | null;
					character_id: string;
					charges_current: number | null;
					charges_max: number | null;
					container_id: string | null;
					created_at: string;
					custom_modifiers: Json | null;
					description: string | null;
					display_order: number | null;
					id: string;
					ignore_contents_weight: boolean | null;
					is_active: boolean | null;
					is_attuned: boolean;
					is_container: boolean | null;
					is_equipped: boolean;
					item_type: string;
					name: string;
					properties: string[] | null;
					quantity: number;
					rarity: Database["public"]["Enums"]["rarity"] | null;
					relic_tier: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement: boolean;
					sigil_slots_base: number;
					value_credits: number | null;
					weight: number | null;
				};
				Insert: {
					capacity_volume?: number | null;
					capacity_weight?: number | null;
					character_id: string;
					charges_current?: number | null;
					charges_max?: number | null;
					container_id?: string | null;
					created_at?: string;
					custom_modifiers?: Json | null;
					description?: string | null;
					display_order?: number | null;
					id?: string;
					ignore_contents_weight?: boolean | null;
					is_active?: boolean | null;
					is_attuned?: boolean;
					is_container?: boolean | null;
					is_equipped?: boolean;
					item_type: string;
					name: string;
					properties?: string[] | null;
					quantity?: number;
					rarity?: Database["public"]["Enums"]["rarity"] | null;
					relic_tier?: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement?: boolean;
					sigil_slots_base?: number;
					value_credits?: number | null;
					weight?: number | null;
				};
				Update: {
					capacity_volume?: number | null;
					capacity_weight?: number | null;
					character_id?: string;
					charges_current?: number | null;
					charges_max?: number | null;
					container_id?: string | null;
					created_at?: string;
					custom_modifiers?: Json | null;
					description?: string | null;
					display_order?: number | null;
					id?: string;
					ignore_contents_weight?: boolean | null;
					is_active?: boolean | null;
					is_attuned?: boolean;
					is_container?: boolean | null;
					is_equipped?: boolean;
					item_type?: string;
					name?: string;
					properties?: string[] | null;
					quantity?: number;
					rarity?: Database["public"]["Enums"]["rarity"] | null;
					relic_tier?: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement?: boolean;
					sigil_slots_base?: number;
					value_credits?: number | null;
					weight?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_equipment_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_equipment_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_equipment_container_id_fkey";
						columns: ["container_id"];
						isOneToOne: false;
						referencedRelation: "character_equipment";
						referencedColumns: ["id"];
					},
				];
			};
			character_extras: {
				Row: {
					ac: number | null;
					character_id: string;
					created_at: string;
					extra_type: string;
					hp_current: number;
					hp_max: number;
					id: string;
					is_active: boolean;
					monster_id: string | null;
					name: string;
					notes: string | null;
					speed: number | null;
					updated_at: string;
				};
				Insert: {
					ac?: number | null;
					character_id: string;
					created_at?: string;
					extra_type: string;
					hp_current?: number;
					hp_max?: number;
					id?: string;
					is_active?: boolean;
					monster_id?: string | null;
					name: string;
					notes?: string | null;
					speed?: number | null;
					updated_at?: string;
				};
				Update: {
					ac?: number | null;
					character_id?: string;
					created_at?: string;
					extra_type?: string;
					hp_current?: number;
					hp_max?: number;
					id?: string;
					is_active?: boolean;
					monster_id?: string | null;
					name?: string;
					notes?: string | null;
					speed?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_extras_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_extras_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_extras_monster_id_fkey";
						columns: ["monster_id"];
						isOneToOne: false;
						referencedRelation: "compendium_Anomalies";
						referencedColumns: ["id"];
					},
				];
			};
			character_feature_choices: {
				Row: {
					character_id: string;
					chosen_at: string;
					feature_id: string;
					group_id: string;
					id: string;
					level_chosen: number;
					option_id: string;
				};
				Insert: {
					character_id: string;
					chosen_at?: string;
					feature_id: string;
					group_id: string;
					id?: string;
					level_chosen?: number;
					option_id: string;
				};
				Update: {
					character_id?: string;
					chosen_at?: string;
					feature_id?: string;
					group_id?: string;
					id?: string;
					level_chosen?: number;
					option_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_feature_choices_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_feature_choices_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_feature_choices_feature_id_fkey";
						columns: ["feature_id"];
						isOneToOne: false;
						referencedRelation: "compendium_job_features";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_feature_choices_group_id_fkey";
						columns: ["group_id"];
						isOneToOne: false;
						referencedRelation: "compendium_feature_choice_groups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_feature_choices_option_id_fkey";
						columns: ["option_id"];
						isOneToOne: false;
						referencedRelation: "compendium_feature_choice_options";
						referencedColumns: ["id"];
					},
				];
			};
			character_features: {
				Row: {
					action_type: string | null;
					character_id: string;
					created_at: string;
					description: string | null;
					display_order: number | null;
					homebrew_id: string | null;
					id: string;
					is_active: boolean;
					level_acquired: number;
					modifiers: Json | null;
					name: string;
					recharge: string | null;
					source: string;
					uses_current: number | null;
					uses_max: number | null;
				};
				Insert: {
					action_type?: string | null;
					character_id: string;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					homebrew_id?: string | null;
					id?: string;
					is_active?: boolean;
					level_acquired?: number;
					modifiers?: Json | null;
					name: string;
					recharge?: string | null;
					source: string;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Update: {
					action_type?: string | null;
					character_id?: string;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					homebrew_id?: string | null;
					id?: string;
					is_active?: boolean;
					level_acquired?: number;
					modifiers?: Json | null;
					name?: string;
					recharge?: string | null;
					source?: string;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_features_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_features_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_journal: {
				Row: {
					character_id: string;
					content: string | null;
					created_at: string;
					id: string;
					session_date: string | null;
					tags: string[] | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					character_id: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					session_date?: string | null;
					tags?: string[] | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					character_id?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					session_date?: string | null;
					tags?: string[] | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_journal_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_journal_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_monarch_unlocks: {
				Row: {
					character_id: string;
					dm_notes: string | null;
					id: string;
					is_primary: boolean;
					monarch_id: string;
					quest_name: string;
					unlocked_at: string;
				};
				Insert: {
					character_id: string;
					dm_notes?: string | null;
					id?: string;
					is_primary?: boolean;
					monarch_id: string;
					quest_name: string;
					unlocked_at?: string;
				};
				Update: {
					character_id?: string;
					dm_notes?: string | null;
					id?: string;
					is_primary?: boolean;
					monarch_id?: string;
					quest_name?: string;
					unlocked_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_monarch_unlocks_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_monarch_unlocks_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_monarch_unlocks_monarch_id_fkey";
						columns: ["monarch_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
				];
			};
			character_powers: {
				Row: {
					casting_time: string | null;
					character_id: string;
					concentration: boolean;
					created_at: string;
					description: string | null;
					display_order: number | null;
					duration: string | null;
					higher_levels: string | null;
					id: string;
					is_known: boolean;
					is_prepared: boolean;
					name: string;
					power_level: number;
					range: string | null;
					source: string | null;
				};
				Insert: {
					casting_time?: string | null;
					character_id: string;
					concentration?: boolean;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					duration?: string | null;
					higher_levels?: string | null;
					id?: string;
					is_known?: boolean;
					is_prepared?: boolean;
					name: string;
					power_level?: number;
					range?: string | null;
					source?: string | null;
				};
				Update: {
					casting_time?: string | null;
					character_id?: string;
					concentration?: boolean;
					created_at?: string;
					description?: string | null;
					display_order?: number | null;
					duration?: string | null;
					higher_levels?: string | null;
					id?: string;
					is_known?: boolean;
					is_prepared?: boolean;
					name?: string;
					power_level?: number;
					range?: string | null;
					source?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_powers_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_powers_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_regent_unlocks: {
				Row: {
					character_id: string;
					dm_notes: string | null;
					id: string;
					is_primary: boolean;
					quest_name: string;
					regent_id: string;
					unlocked_at: string;
				};
				Insert: {
					character_id: string;
					dm_notes?: string | null;
					id?: string;
					is_primary?: boolean;
					quest_name: string;
					regent_id: string;
					unlocked_at?: string;
				};
				Update: {
					character_id?: string;
					dm_notes?: string | null;
					id?: string;
					is_primary?: boolean;
					quest_name?: string;
					regent_id?: string;
					unlocked_at?: string;
				};
				Relationships: [];
			};
			character_regents: {
				Row: {
					character_id: string;
					created_at: string;
					id: string;
					regent_id: string;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					id?: string;
					regent_id: string;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					id?: string;
					regent_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_regents_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_regents_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_rune_inscriptions: {
				Row: {
					applied_cross_penalty: string | null;
					character_id: string;
					created_at: string;
					effective_requirement_multiplier: number | null;
					equipment_id: string;
					id: string;
					inscribed_by: string | null;
					inscription_date: string;
					inscription_quality: number | null;
					is_active: boolean;
					rune_id: string;
					times_used: number | null;
					uses_current: number | null;
					uses_max: number | null;
				};
				Insert: {
					applied_cross_penalty?: string | null;
					character_id: string;
					created_at?: string;
					effective_requirement_multiplier?: number | null;
					equipment_id: string;
					id?: string;
					inscribed_by?: string | null;
					inscription_date?: string;
					inscription_quality?: number | null;
					is_active?: boolean;
					rune_id: string;
					times_used?: number | null;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Update: {
					applied_cross_penalty?: string | null;
					character_id?: string;
					created_at?: string;
					effective_requirement_multiplier?: number | null;
					equipment_id?: string;
					id?: string;
					inscribed_by?: string | null;
					inscription_date?: string;
					inscription_quality?: number | null;
					is_active?: boolean;
					rune_id?: string;
					times_used?: number | null;
					uses_current?: number | null;
					uses_max?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_rune_inscriptions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_inscriptions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_inscriptions_equipment_id_fkey";
						columns: ["equipment_id"];
						isOneToOne: false;
						referencedRelation: "character_equipment";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_inscriptions_rune_id_fkey";
						columns: ["rune_id"];
						isOneToOne: false;
						referencedRelation: "compendium_runes";
						referencedColumns: ["id"];
					},
				];
			};
			character_rune_knowledge: {
				Row: {
					can_teach: boolean | null;
					character_id: string;
					created_at: string;
					id: string;
					learned_date: string;
					learned_from: string | null;
					learned_from_character_id: string | null;
					mastery_level: number | null;
					rune_id: string;
				};
				Insert: {
					can_teach?: boolean | null;
					character_id: string;
					created_at?: string;
					id?: string;
					learned_date?: string;
					learned_from?: string | null;
					learned_from_character_id?: string | null;
					mastery_level?: number | null;
					rune_id: string;
				};
				Update: {
					can_teach?: boolean | null;
					character_id?: string;
					created_at?: string;
					id?: string;
					learned_date?: string;
					learned_from?: string | null;
					learned_from_character_id?: string | null;
					mastery_level?: number | null;
					rune_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_rune_knowledge_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_knowledge_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_knowledge_learned_from_character_id_fkey";
						columns: ["learned_from_character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_knowledge_learned_from_character_id_fkey";
						columns: ["learned_from_character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_rune_knowledge_rune_id_fkey";
						columns: ["rune_id"];
						isOneToOne: false;
						referencedRelation: "compendium_runes";
						referencedColumns: ["id"];
					},
				];
			};
			character_shadow_army: {
				Row: {
					character_id: string;
					created_at: string;
					dismissed_at: string | null;
					hp_current: number | null;
					hp_max: number | null;
					id: string;
					instance_name: string | null;
					is_active: boolean;
					is_dismissed: boolean;
					notes: string | null;
					shadow_soldier_id: string;
					summoned_at: string;
					updated_at: string;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					dismissed_at?: string | null;
					hp_current?: number | null;
					hp_max?: number | null;
					id?: string;
					instance_name?: string | null;
					is_active?: boolean;
					is_dismissed?: boolean;
					notes?: string | null;
					shadow_soldier_id: string;
					summoned_at?: string;
					updated_at?: string;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					dismissed_at?: string | null;
					hp_current?: number | null;
					hp_max?: number | null;
					id?: string;
					instance_name?: string | null;
					is_active?: boolean;
					is_dismissed?: boolean;
					notes?: string | null;
					shadow_soldier_id?: string;
					summoned_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_shadow_army_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_shadow_army_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_shadow_army_shadow_soldier_id_fkey";
						columns: ["shadow_soldier_id"];
						isOneToOne: false;
						referencedRelation: "compendium_shadow_soldiers";
						referencedColumns: ["id"];
					},
				];
			};
			character_shadow_soldiers: {
				Row: {
					bond_level: number;
					character_id: string;
					created_at: string;
					current_hp: number;
					id: string;
					is_summoned: boolean;
					nickname: string | null;
					soldier_id: string;
				};
				Insert: {
					bond_level?: number;
					character_id: string;
					created_at?: string;
					current_hp: number;
					id?: string;
					is_summoned?: boolean;
					nickname?: string | null;
					soldier_id: string;
				};
				Update: {
					bond_level?: number;
					character_id?: string;
					created_at?: string;
					current_hp?: number;
					id?: string;
					is_summoned?: boolean;
					nickname?: string | null;
					soldier_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_shadow_soldiers_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_shadow_soldiers_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_shadow_soldiers_soldier_id_fkey";
						columns: ["soldier_id"];
						isOneToOne: false;
						referencedRelation: "compendium_shadow_soldiers";
						referencedColumns: ["id"];
					},
				];
			};
			character_shares: {
				Row: {
					character_id: string;
					created_at: string;
					created_by: string | null;
					expires_at: string;
					id: string;
					token: string;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					created_by?: string | null;
					expires_at: string;
					id?: string;
					token: string;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					created_by?: string | null;
					expires_at?: string;
					id?: string;
					token?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_shares_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_shares_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_sheet_state: {
				Row: {
					character_id: string;
					created_at: string;
					custom_modifiers: Json;
					id: string;
					resources: Json;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					custom_modifiers?: Json;
					id?: string;
					resources?: Json;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					custom_modifiers?: Json;
					id?: string;
					resources?: Json;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "character_sheet_state_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: true;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sheet_state_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: true;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_sigil_inscriptions: {
				Row: {
					character_id: string;
					created_at: string;
					equipment_id: string;
					id: string;
					inscribed_by: string | null;
					inscription_date: string;
					inscription_quality: number | null;
					is_active: boolean;
					sigil_id: string;
					slot_index: number;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					equipment_id: string;
					id?: string;
					inscribed_by?: string | null;
					inscription_date?: string;
					inscription_quality?: number | null;
					is_active?: boolean;
					sigil_id: string;
					slot_index?: number;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					equipment_id?: string;
					id?: string;
					inscribed_by?: string | null;
					inscription_date?: string;
					inscription_quality?: number | null;
					is_active?: boolean;
					sigil_id?: string;
					slot_index?: number;
				};
				Relationships: [
					{
						foreignKeyName: "character_sigil_inscriptions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sigil_inscriptions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sigil_inscriptions_equipment_id_fkey";
						columns: ["equipment_id"];
						isOneToOne: false;
						referencedRelation: "character_equipment";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sigil_inscriptions_sigil_id_fkey";
						columns: ["sigil_id"];
						isOneToOne: false;
						referencedRelation: "compendium_sigils";
						referencedColumns: ["id"];
					},
				];
			};
			character_spell_slots: {
				Row: {
					character_id: string;
					created_at: string;
					id: string;
					slots_current: number;
					slots_max: number;
					slots_recovered_on_long_rest: number;
					slots_recovered_on_short_rest: number;
					spell_level: number;
					updated_at: string;
				};
				Insert: {
					character_id: string;
					created_at?: string;
					id?: string;
					slots_current?: number;
					slots_max?: number;
					slots_recovered_on_long_rest?: number;
					slots_recovered_on_short_rest?: number;
					spell_level: number;
					updated_at?: string;
				};
				Update: {
					character_id?: string;
					created_at?: string;
					id?: string;
					slots_current?: number;
					slots_max?: number;
					slots_recovered_on_long_rest?: number;
					slots_recovered_on_short_rest?: number;
					spell_level?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_spell_slots_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_spell_slots_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			character_techniques: {
				Row: {
					character_id: string;
					id: string;
					learned_at: string;
					source: string | null;
					technique_id: string;
				};
				Insert: {
					character_id: string;
					id?: string;
					learned_at?: string;
					source?: string | null;
					technique_id: string;
				};
				Update: {
					character_id?: string;
					id?: string;
					learned_at?: string;
					source?: string | null;
					technique_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "character_techniques_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_techniques_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_techniques_technique_id_fkey";
						columns: ["technique_id"];
						isOneToOne: false;
						referencedRelation: "compendium_techniques";
						referencedColumns: ["id"];
					},
				];
			};
			character_templates: {
				Row: {
					character_data: Json;
					created_at: string;
					description: string | null;
					id: string;
					is_public: boolean;
					name: string;
					share_code: string | null;
					tags: string[] | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					character_data: Json;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_public?: boolean;
					name: string;
					share_code?: string | null;
					tags?: string[] | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					character_data?: Json;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_public?: boolean;
					name?: string;
					share_code?: string | null;
					tags?: string[] | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			characters: {
				Row: {
					active_sovereign_id: string | null;
					agi: number | null;
					appearance: string | null;
					armor_class: number;
					armor_proficiencies: string[] | null;
					background: string | null;
					backstory: string | null;
					base_class: string | null;
					condition_immunities: string[] | null;
					conditions: string[] | null;
					created_at: string;
					death_save_failures: number | null;
					death_save_successes: number | null;
					exhaustion_level: number;
					experience: number;
					gemini_state: Json | null;
					hit_dice_current: number;
					hit_dice_max: number;
					hit_dice_size: number;
					hp_current: number;
					hp_max: number;
					hp_temp: number;
					id: string;
					immunities: string[] | null;
					initiative: number;
					int: number | null;
					job: string | null;
					languages: string[];
					level: number;
					monarch_overlays: string[] | null;
					name: string;
					notes: string | null;
					path: string | null;
					portrait_url: string | null;
					pre: number | null;
					proficiency_bonus: number;
					regent_overlays: string[] | null;
					resistances: string[] | null;
					rift_favor_current: number;
					rift_favor_die: number;
					rift_favor_max: number;
					saving_throw_proficiencies:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					sense: number | null;
					senses: string[] | null;
					shadow_energy_current: number;
					shadow_energy_max: number;
					share_token: string | null;
					skill_expertise: string[] | null;
					skill_proficiencies: string[] | null;
					sovereign_id: string | null;
					speed: number;
					stable: boolean | null;
					str: number | null;
					tool_proficiencies: string[] | null;
					updated_at: string;
					user_id: string;
					vit: number | null;
					vulnerabilities: string[] | null;
					weapon_proficiencies: string[] | null;
				};
				Insert: {
					active_sovereign_id?: string | null;
					agi?: number | null;
					appearance?: string | null;
					armor_class?: number;
					armor_proficiencies?: string[] | null;
					background?: string | null;
					backstory?: string | null;
					base_class?: string | null;
					condition_immunities?: string[] | null;
					conditions?: string[] | null;
					created_at?: string;
					death_save_failures?: number | null;
					death_save_successes?: number | null;
					exhaustion_level?: number;
					experience?: number;
					gemini_state?: Json | null;
					hit_dice_current?: number;
					hit_dice_max?: number;
					hit_dice_size?: number;
					hp_current?: number;
					hp_max?: number;
					hp_temp?: number;
					id?: string;
					immunities?: string[] | null;
					initiative?: number;
					int?: number | null;
					job?: string | null;
					languages?: string[];
					level?: number;
					monarch_overlays?: string[] | null;
					name: string;
					notes?: string | null;
					path?: string | null;
					portrait_url?: string | null;
					pre?: number | null;
					proficiency_bonus?: number;
					regent_overlays?: string[] | null;
					resistances?: string[] | null;
					rift_favor_current?: number;
					rift_favor_die?: number;
					rift_favor_max?: number;
					saving_throw_proficiencies?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					sense?: number | null;
					senses?: string[] | null;
					shadow_energy_current?: number;
					shadow_energy_max?: number;
					share_token?: string | null;
					skill_expertise?: string[] | null;
					skill_proficiencies?: string[] | null;
					sovereign_id?: string | null;
					speed?: number;
					stable?: boolean | null;
					str?: number | null;
					tool_proficiencies?: string[] | null;
					updated_at?: string;
					user_id: string;
					vit?: number | null;
					vulnerabilities?: string[] | null;
					weapon_proficiencies?: string[] | null;
				};
				Update: {
					active_sovereign_id?: string | null;
					agi?: number | null;
					appearance?: string | null;
					armor_class?: number;
					armor_proficiencies?: string[] | null;
					background?: string | null;
					backstory?: string | null;
					base_class?: string | null;
					condition_immunities?: string[] | null;
					conditions?: string[] | null;
					created_at?: string;
					death_save_failures?: number | null;
					death_save_successes?: number | null;
					exhaustion_level?: number;
					experience?: number;
					gemini_state?: Json | null;
					hit_dice_current?: number;
					hit_dice_max?: number;
					hit_dice_size?: number;
					hp_current?: number;
					hp_max?: number;
					hp_temp?: number;
					id?: string;
					immunities?: string[] | null;
					initiative?: number;
					int?: number | null;
					job?: string | null;
					languages?: string[];
					level?: number;
					monarch_overlays?: string[] | null;
					name?: string;
					notes?: string | null;
					path?: string | null;
					portrait_url?: string | null;
					pre?: number | null;
					proficiency_bonus?: number;
					regent_overlays?: string[] | null;
					resistances?: string[] | null;
					rift_favor_current?: number;
					rift_favor_die?: number;
					rift_favor_max?: number;
					saving_throw_proficiencies?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					sense?: number | null;
					senses?: string[] | null;
					shadow_energy_current?: number;
					shadow_energy_max?: number;
					share_token?: string | null;
					skill_expertise?: string[] | null;
					skill_proficiencies?: string[] | null;
					sovereign_id?: string | null;
					speed?: number;
					stable?: boolean | null;
					str?: number | null;
					tool_proficiencies?: string[] | null;
					updated_at?: string;
					user_id?: string;
					vit?: number | null;
					vulnerabilities?: string[] | null;
					weapon_proficiencies?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "characters_active_sovereign_id_fkey";
						columns: ["active_sovereign_id"];
						isOneToOne: false;
						referencedRelation: "saved_sovereigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "characters_sovereign_id_fkey";
						columns: ["sovereign_id"];
						isOneToOne: false;
						referencedRelation: "compendium_sovereigns";
						referencedColumns: ["id"];
					},
				];
			};
			combat_actions: {
				Row: {
					action_type: string;
					created_at: string | null;
					damage_dealt: number | null;
					description: string;
					healing_done: number | null;
					id: string;
					participant_id: string;
					session_id: string;
				};
				Insert: {
					action_type: string;
					created_at?: string | null;
					damage_dealt?: number | null;
					description: string;
					healing_done?: number | null;
					id?: string;
					participant_id: string;
					session_id: string;
				};
				Update: {
					action_type?: string;
					created_at?: string | null;
					damage_dealt?: number | null;
					description?: string;
					healing_done?: number | null;
					id?: string;
					participant_id?: string;
					session_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "combat_actions_participant_id_fkey";
						columns: ["participant_id"];
						isOneToOne: false;
						referencedRelation: "combat_participants";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "combat_actions_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			combat_participants: {
				Row: {
					ac: number;
					character_id: string | null;
					created_at: string | null;
					current_hp: number;
					id: string;
					initiative: number;
					is_player: boolean;
					max_hp: number;
					name: string;
					session_id: string;
					status: string;
					turn_order: number;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					ac: number;
					character_id?: string | null;
					created_at?: string | null;
					current_hp: number;
					id?: string;
					initiative: number;
					is_player?: boolean;
					max_hp: number;
					name: string;
					session_id: string;
					status?: string;
					turn_order: number;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					ac?: number;
					character_id?: string | null;
					created_at?: string | null;
					current_hp?: number;
					id?: string;
					initiative?: number;
					is_player?: boolean;
					max_hp?: number;
					name?: string;
					session_id?: string;
					status?: string;
					turn_order?: number;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "combat_participants_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "combat_participants_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "combat_participants_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_Anomalies: {
				Row: {
					actions: Json | null;
					agi: number;
					aliases: string[] | null;
					alignment: string | null;
					armor_class: number;
					armor_type: string | null;
					condition_immunities: string[] | null;
					cr: string;
					created_at: string;
					creature_type: string;
					damage_immunities: string[] | null;
					damage_resistances: string[] | null;
					damage_vulnerabilities: string[] | null;
					description: string | null;
					display_name: string | null;
					flavor: string | null;
					gate_rank: string | null;
					generated_reason: string | null;
					hit_points_average: number;
					hit_points_formula: string;
					id: string;
					image_url: string | null;
					int: number;
					is_boss: boolean;
					languages: string[] | null;
					legendary_actions: Json | null;
					license_note: string | null;
					lore: string | null;
					mechanics: Json | null;
					monster_actions: Json | null;
					name: string;
					pre: number;
					rank: string | null;
					reactions: Json | null;
					saving_throws: Json | null;
					sense: number;
					senses: Json | null;
					size: string;
					skills: Json | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					speed_burrow: number | null;
					speed_climb: number | null;
					speed_fly: number | null;
					speed_swim: number | null;
					speed_walk: number | null;
					str: number;
					tags: string[] | null;
					theme_tags: string[] | null;
					traits: Json | null;
					vit: number;
					xp: number | null;
				};
				Insert: {
					actions?: Json | null;
					agi?: number;
					aliases?: string[] | null;
					alignment?: string | null;
					armor_class: number;
					armor_type?: string | null;
					condition_immunities?: string[] | null;
					cr: string;
					created_at?: string;
					creature_type: string;
					damage_immunities?: string[] | null;
					damage_resistances?: string[] | null;
					damage_vulnerabilities?: string[] | null;
					description?: string | null;
					display_name?: string | null;
					flavor?: string | null;
					gate_rank?: string | null;
					generated_reason?: string | null;
					hit_points_average: number;
					hit_points_formula: string;
					id?: string;
					image_url?: string | null;
					int?: number;
					is_boss?: boolean;
					languages?: string[] | null;
					legendary_actions?: Json | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					monster_actions?: Json | null;
					name: string;
					pre?: number;
					rank?: string | null;
					reactions?: Json | null;
					saving_throws?: Json | null;
					sense?: number;
					senses?: Json | null;
					size?: string;
					skills?: Json | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					speed_burrow?: number | null;
					speed_climb?: number | null;
					speed_fly?: number | null;
					speed_swim?: number | null;
					speed_walk?: number | null;
					str?: number;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					traits?: Json | null;
					vit?: number;
					xp?: number | null;
				};
				Update: {
					actions?: Json | null;
					agi?: number;
					aliases?: string[] | null;
					alignment?: string | null;
					armor_class?: number;
					armor_type?: string | null;
					condition_immunities?: string[] | null;
					cr?: string;
					created_at?: string;
					creature_type?: string;
					damage_immunities?: string[] | null;
					damage_resistances?: string[] | null;
					damage_vulnerabilities?: string[] | null;
					description?: string | null;
					display_name?: string | null;
					flavor?: string | null;
					gate_rank?: string | null;
					generated_reason?: string | null;
					hit_points_average?: number;
					hit_points_formula?: string;
					id?: string;
					image_url?: string | null;
					int?: number;
					is_boss?: boolean;
					languages?: string[] | null;
					legendary_actions?: Json | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					monster_actions?: Json | null;
					name?: string;
					pre?: number;
					rank?: string | null;
					reactions?: Json | null;
					saving_throws?: Json | null;
					sense?: number;
					senses?: Json | null;
					size?: string;
					skills?: Json | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					speed_burrow?: number | null;
					speed_climb?: number | null;
					speed_fly?: number | null;
					speed_swim?: number | null;
					speed_walk?: number | null;
					str?: number;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					traits?: Json | null;
					vit?: number;
					xp?: number | null;
				};
				Relationships: [];
			};
			compendium_artifacts: {
				Row: {
					abilities: Json | null;
					attunement: boolean | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					properties: Json | null;
					rarity: string;
					requirements: Json | null;
					source_book: string | null;
					tags: string[] | null;
					type: string;
					updated_at: string;
				};
				Insert: {
					abilities?: Json | null;
					attunement?: boolean | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					properties?: Json | null;
					rarity?: string;
					requirements?: Json | null;
					source_book?: string | null;
					tags?: string[] | null;
					type: string;
					updated_at?: string;
				};
				Update: {
					abilities?: Json | null;
					attunement?: boolean | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					properties?: Json | null;
					rarity?: string;
					requirements?: Json | null;
					source_book?: string | null;
					tags?: string[] | null;
					type?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_backgrounds: {
				Row: {
					abilities: string[] | null;
					aliases: string[] | null;
					bonds: string[] | null;
					created_at: string;
					dangers: string[] | null;
					description: string;
					display_name: string | null;
					equipment: Json | null;
					feature_description: string | null;
					feature_name: string | null;
					features: Json | null;
					flavor: string | null;
					flaws: string[] | null;
					generated_reason: string | null;
					id: string;
					ideals: string[] | null;
					image_url: string | null;
					language_count: number | null;
					languages: Json | null;
					license_note: string | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					personality_traits: string[] | null;
					rank: string | null;
					skill_proficiencies: string[] | null;
					skills: string[] | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					starting_credits: number | null;
					starting_equipment: string | null;
					suggested_characteristics: Json | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					tool_proficiencies: string[] | null;
					type: string | null;
				};
				Insert: {
					abilities?: string[] | null;
					aliases?: string[] | null;
					bonds?: string[] | null;
					created_at?: string;
					dangers?: string[] | null;
					description: string;
					display_name?: string | null;
					equipment?: Json | null;
					feature_description?: string | null;
					feature_name?: string | null;
					features?: Json | null;
					flavor?: string | null;
					flaws?: string[] | null;
					generated_reason?: string | null;
					id?: string;
					ideals?: string[] | null;
					image_url?: string | null;
					language_count?: number | null;
					languages?: Json | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					personality_traits?: string[] | null;
					rank?: string | null;
					skill_proficiencies?: string[] | null;
					skills?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					starting_credits?: number | null;
					starting_equipment?: string | null;
					suggested_characteristics?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					tool_proficiencies?: string[] | null;
					type?: string | null;
				};
				Update: {
					abilities?: string[] | null;
					aliases?: string[] | null;
					bonds?: string[] | null;
					created_at?: string;
					dangers?: string[] | null;
					description?: string;
					display_name?: string | null;
					equipment?: Json | null;
					feature_description?: string | null;
					feature_name?: string | null;
					features?: Json | null;
					flavor?: string | null;
					flaws?: string[] | null;
					generated_reason?: string | null;
					id?: string;
					ideals?: string[] | null;
					image_url?: string | null;
					language_count?: number | null;
					languages?: Json | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					personality_traits?: string[] | null;
					rank?: string | null;
					skill_proficiencies?: string[] | null;
					skills?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					starting_credits?: number | null;
					starting_equipment?: string | null;
					suggested_characteristics?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					tool_proficiencies?: string[] | null;
					type?: string | null;
				};
				Relationships: [];
			};
			compendium_conditions: {
				Row: {
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					effects: string[] | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
				};
				Insert: {
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					effects?: string[] | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Update: {
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					effects?: string[] | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Relationships: [];
			};
			compendium_equipment: {
				Row: {
					aliases: string[] | null;
					armor_class: number | null;
					cost_credits: number | null;
					created_at: string;
					damage: string | null;
					damage_type: string | null;
					description: string | null;
					display_name: string | null;
					equipment_type: string;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					properties: string[] | null;
					rarity: Database["public"]["Enums"]["rarity"] | null;
					requires_attunement: boolean | null;
					sigil_slots_base: number | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					updated_at: string | null;
					value_credits: number | null;
					weight: number | null;
				};
				Insert: {
					aliases?: string[] | null;
					armor_class?: number | null;
					cost_credits?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description?: string | null;
					display_name?: string | null;
					equipment_type: string;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					properties?: string[] | null;
					rarity?: Database["public"]["Enums"]["rarity"] | null;
					requires_attunement?: boolean | null;
					sigil_slots_base?: number | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string | null;
					value_credits?: number | null;
					weight?: number | null;
				};
				Update: {
					aliases?: string[] | null;
					armor_class?: number | null;
					cost_credits?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description?: string | null;
					display_name?: string | null;
					equipment_type?: string;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					properties?: string[] | null;
					rarity?: Database["public"]["Enums"]["rarity"] | null;
					requires_attunement?: boolean | null;
					sigil_slots_base?: number | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string | null;
					value_credits?: number | null;
					weight?: number | null;
				};
				Relationships: [];
			};
			compendium_feats: {
				Row: {
					aliases: string[] | null;
					benefits: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					effects: Json | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					license_note: string | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					prerequisites: string | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
				};
				Insert: {
					aliases?: string[] | null;
					benefits?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					prerequisites?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Update: {
					aliases?: string[] | null;
					benefits?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					prerequisites?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Relationships: [];
			};
			compendium_feature_choice_groups: {
				Row: {
					choice_count: number;
					choice_key: string;
					created_at: string;
					display_name: string | null;
					feature_id: string;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					prompt: string | null;
					tags: string[] | null;
				};
				Insert: {
					choice_count?: number;
					choice_key: string;
					created_at?: string;
					display_name?: string | null;
					feature_id: string;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					prompt?: string | null;
					tags?: string[] | null;
				};
				Update: {
					choice_count?: number;
					choice_key?: string;
					created_at?: string;
					display_name?: string | null;
					feature_id?: string;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					prompt?: string | null;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_feature_choice_groups_feature_id_fkey";
						columns: ["feature_id"];
						isOneToOne: false;
						referencedRelation: "compendium_job_features";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_feature_choice_options: {
				Row: {
					created_at: string;
					description: string | null;
					display_name: string | null;
					flavor: string | null;
					grants: Json;
					group_id: string;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					option_key: string;
					tags: string[] | null;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					flavor?: string | null;
					grants?: Json;
					group_id: string;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					option_key: string;
					tags?: string[] | null;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					flavor?: string | null;
					grants?: Json;
					group_id?: string;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					option_key?: string;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_feature_choice_options_group_id_fkey";
						columns: ["group_id"];
						isOneToOne: false;
						referencedRelation: "compendium_feature_choice_groups";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_items: {
				Row: {
					attunement: boolean | null;
					created_at: string;
					description: string | null;
					display_name: string | null;
					effects: Json | null;
					flavor: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					item_type: string;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					properties: Json | null;
					rarity: string;
					source_book: string | null;
					stats: Json | null;
					tags: string[] | null;
					updated_at: string;
					value: number | null;
					weight: number | null;
				};
				Insert: {
					attunement?: boolean | null;
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					item_type: string;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					properties?: Json | null;
					rarity?: string;
					source_book?: string | null;
					stats?: Json | null;
					tags?: string[] | null;
					updated_at?: string;
					value?: number | null;
					weight?: number | null;
				};
				Update: {
					attunement?: boolean | null;
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					item_type?: string;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					properties?: Json | null;
					rarity?: string;
					source_book?: string | null;
					stats?: Json | null;
					tags?: string[] | null;
					updated_at?: string;
					value?: number | null;
					weight?: number | null;
				};
				Relationships: [];
			};
			compendium_job_features: {
				Row: {
					action_type: string | null;
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					is_path_feature: boolean;
					job_id: string;
					level: number;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					path_id: string | null;
					prerequisites: string | null;
					recharge: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					uses_formula: string | null;
				};
				Insert: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_path_feature?: boolean;
					job_id: string;
					level: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					path_id?: string | null;
					prerequisites?: string | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Update: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_path_feature?: boolean;
					job_id?: string;
					level?: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					path_id?: string | null;
					prerequisites?: string | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_job_features_job_id_fkey";
						columns: ["job_id"];
						isOneToOne: false;
						referencedRelation: "compendium_jobs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_job_features_path_id_fkey";
						columns: ["path_id"];
						isOneToOne: false;
						referencedRelation: "compendium_job_paths";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_job_paths: {
				Row: {
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					flavor_text: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					job_id: string;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					path_level: number;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
				};
				Insert: {
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					job_id: string;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					path_level?: number;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Update: {
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					job_id?: string;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					path_level?: number;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_job_paths_job_id_fkey";
						columns: ["job_id"];
						isOneToOne: false;
						referencedRelation: "compendium_jobs";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_jobs: {
				Row: {
					abilities: string[] | null;
					ability_score_improvements: Json | null;
					aliases: string[] | null;
					armor_proficiencies: string[] | null;
					awakening_features: Json | null;
					class_features: Json | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					flavor_text: string | null;
					generated_reason: string | null;
					hit_die: number;
					hit_points_first_level: string | null;
					hit_points_higher_levels: string | null;
					id: string;
					image_url: string | null;
					job_traits: Json | null;
					languages: string[] | null;
					license_note: string | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					primary_abilities: Database["public"]["Enums"]["ability_score"][];
					racial_traits: Json;
					rank: string | null;
					saving_throw_proficiencies: Database["public"]["Enums"]["ability_score"][];
					secondary_abilities:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					size: string | null;
					skill_choice_count: number;
					skill_choices: string[] | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					speed: string | null;
					spellcasting: Json | null;
					stats: Json | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					tool_proficiencies: string[] | null;
					type: string | null;
					updated_at: string;
					weapon_proficiencies: string[] | null;
				};
				Insert: {
					abilities?: string[] | null;
					ability_score_improvements?: Json | null;
					aliases?: string[] | null;
					armor_proficiencies?: string[] | null;
					awakening_features?: Json | null;
					class_features?: Json | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					hit_die?: number;
					hit_points_first_level?: string | null;
					hit_points_higher_levels?: string | null;
					id?: string;
					image_url?: string | null;
					job_traits?: Json | null;
					languages?: string[] | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					primary_abilities?: Database["public"]["Enums"]["ability_score"][];
					racial_traits?: Json;
					rank?: string | null;
					saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][];
					secondary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					size?: string | null;
					skill_choice_count?: number;
					skill_choices?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					speed?: string | null;
					spellcasting?: Json | null;
					stats?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					tool_proficiencies?: string[] | null;
					type?: string | null;
					updated_at?: string;
					weapon_proficiencies?: string[] | null;
				};
				Update: {
					abilities?: string[] | null;
					ability_score_improvements?: Json | null;
					aliases?: string[] | null;
					armor_proficiencies?: string[] | null;
					awakening_features?: Json | null;
					class_features?: Json | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					hit_die?: number;
					hit_points_first_level?: string | null;
					hit_points_higher_levels?: string | null;
					id?: string;
					image_url?: string | null;
					job_traits?: Json | null;
					languages?: string[] | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					primary_abilities?: Database["public"]["Enums"]["ability_score"][];
					racial_traits?: Json;
					rank?: string | null;
					saving_throw_proficiencies?: Database["public"]["Enums"]["ability_score"][];
					secondary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					size?: string | null;
					skill_choice_count?: number;
					skill_choices?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					speed?: string | null;
					spellcasting?: Json | null;
					stats?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					tool_proficiencies?: string[] | null;
					type?: string | null;
					updated_at?: string;
					weapon_proficiencies?: string[] | null;
				};
				Relationships: [];
			};
			compendium_locations: {
				Row: {
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					source_book: string | null;
					tags: string[] | null;
					type: string | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					source_book?: string | null;
					tags?: string[] | null;
					type?: string | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					source_book?: string | null;
					tags?: string[] | null;
					type?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_monarch_features: {
				Row: {
					action_type: string | null;
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					is_signature: boolean;
					level: number;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					monarch_id: string;
					name: string;
					prerequisites: string | null;
					recharge: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					uses_formula: string | null;
				};
				Insert: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_signature?: boolean;
					level: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monarch_id: string;
					name: string;
					prerequisites?: string | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Update: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_signature?: boolean;
					level?: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monarch_id?: string;
					name?: string;
					prerequisites?: string | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_monarch_features_monarch_id_fkey";
						columns: ["monarch_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_monarchs: {
				Row: {
					aliases: string[] | null;
					corruption_risk: string | null;
					created_at: string;
					damage_type: string | null;
					description: string;
					display_name: string | null;
					flavor: string | null;
					flavor_text: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: string | null;
					manifestation_description: string | null;
					mechanics: Json | null;
					name: string;
					prerequisites: string | null;
					primary_abilities:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme: string;
					theme_tags: string[] | null;
					title: string;
					unlock_level: number;
					updated_at: string;
				};
				Insert: {
					aliases?: string[] | null;
					corruption_risk?: string | null;
					created_at?: string;
					damage_type?: string | null;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					manifestation_description?: string | null;
					mechanics?: Json | null;
					name: string;
					prerequisites?: string | null;
					primary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme: string;
					theme_tags?: string[] | null;
					title: string;
					unlock_level?: number;
					updated_at?: string;
				};
				Update: {
					aliases?: string[] | null;
					corruption_risk?: string | null;
					created_at?: string;
					damage_type?: string | null;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					manifestation_description?: string | null;
					mechanics?: Json | null;
					name?: string;
					prerequisites?: string | null;
					primary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme?: string;
					theme_tags?: string[] | null;
					title?: string;
					unlock_level?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_monster_actions: {
				Row: {
					action_type: string;
					aliases: string[] | null;
					attack_bonus: number | null;
					created_at: string;
					damage: string | null;
					damage_type: string | null;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					legendary_cost: number | null;
					lore: Json | null;
					mechanics: Json | null;
					monster_id: string;
					name: string;
					recharge: string | null;
					tags: string[] | null;
				};
				Insert: {
					action_type?: string;
					aliases?: string[] | null;
					attack_bonus?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					legendary_cost?: number | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monster_id: string;
					name: string;
					recharge?: string | null;
					tags?: string[] | null;
				};
				Update: {
					action_type?: string;
					aliases?: string[] | null;
					attack_bonus?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					legendary_cost?: number | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monster_id?: string;
					name?: string;
					recharge?: string | null;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_monster_actions_monster_id_fkey";
						columns: ["monster_id"];
						isOneToOne: false;
						referencedRelation: "compendium_Anomalies";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_monster_traits: {
				Row: {
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					monster_id: string;
					name: string;
					tags: string[] | null;
				};
				Insert: {
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monster_id: string;
					name: string;
					tags?: string[] | null;
				};
				Update: {
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monster_id?: string;
					name?: string;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_monster_traits_monster_id_fkey";
						columns: ["monster_id"];
						isOneToOne: false;
						referencedRelation: "compendium_Anomalies";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_notes: {
				Row: {
					content: string;
					created_at: string;
					display_name: string | null;
					entry_id: string;
					entry_type: string;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					tags: string[];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					display_name?: string | null;
					entry_id: string;
					entry_type: string;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					tags?: string[];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					display_name?: string | null;
					entry_id?: string;
					entry_type?: string;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					tags?: string[];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			compendium_pantheon: {
				Row: {
					created_at: string | null;
					description: string | null;
					directive: string | null;
					display_name: string | null;
					dogma: string[] | null;
					home_realm: string | null;
					id: string;
					lore: string | null;
					manifestation: string | null;
					name: string;
					portfolio: string[] | null;
					rank: string | null;
					relationships: Json | null;
					sigil: string | null;
					specializations: string[] | null;
					temples: string | null;
					updated_at: string | null;
					worshippers: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					directive?: string | null;
					display_name?: string | null;
					dogma?: string[] | null;
					home_realm?: string | null;
					id: string;
					lore?: string | null;
					manifestation?: string | null;
					name: string;
					portfolio?: string[] | null;
					rank?: string | null;
					relationships?: Json | null;
					sigil?: string | null;
					specializations?: string[] | null;
					temples?: string | null;
					updated_at?: string | null;
					worshippers?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					directive?: string | null;
					display_name?: string | null;
					dogma?: string[] | null;
					home_realm?: string | null;
					id?: string;
					lore?: string | null;
					manifestation?: string | null;
					name?: string;
					portfolio?: string[] | null;
					rank?: string | null;
					relationships?: Json | null;
					sigil?: string | null;
					specializations?: string[] | null;
					temples?: string | null;
					updated_at?: string | null;
					worshippers?: string | null;
				};
				Relationships: [];
			};
			compendium_paths: {
				Row: {
					created_at: string | null;
					created_by: string | null;
					description: string;
					display_name: string | null;
					features: Json | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					is_homebrew: boolean | null;
					job_id: string | null;
					levels: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					prerequisites: Json | null;
					tags: string[] | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					created_by?: string | null;
					description: string;
					display_name?: string | null;
					features?: Json | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					is_homebrew?: boolean | null;
					job_id?: string | null;
					levels?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					prerequisites?: Json | null;
					tags?: string[] | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					created_by?: string | null;
					description?: string;
					display_name?: string | null;
					features?: Json | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					is_homebrew?: boolean | null;
					job_id?: string | null;
					levels?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					prerequisites?: Json | null;
					tags?: string[] | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_paths_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_powers: {
				Row: {
					activation_time: string | null;
					aliases: string[] | null;
					casting_time: string;
					components: string | null;
					concentration: boolean;
					created_at: string;
					damage_roll: string | null;
					damage_type: string | null;
					description: string;
					display_name: string | null;
					duration: string;
					effects: Json | null;
					flavor: string | null;
					generated_reason: string | null;
					has_attack_roll: boolean | null;
					has_save: boolean | null;
					higher_levels: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					job_names: string[] | null;
					license_note: string | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					path_names: string[] | null;
					power_level: number;
					power_type: string | null;
					range: string;
					regent_names: string[] | null;
					ritual: boolean;
					save_ability: string | null;
					school: string | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					target: string | null;
					theme_tags: string[] | null;
				};
				Insert: {
					activation_time?: string | null;
					aliases?: string[] | null;
					casting_time: string;
					components?: string | null;
					concentration?: boolean;
					created_at?: string;
					damage_roll?: string | null;
					damage_type?: string | null;
					description: string;
					display_name?: string | null;
					duration: string;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					has_attack_roll?: boolean | null;
					has_save?: boolean | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					job_names?: string[] | null;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					path_names?: string[] | null;
					power_level?: number;
					power_type?: string | null;
					range: string;
					regent_names?: string[] | null;
					ritual?: boolean;
					save_ability?: string | null;
					school?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					target?: string | null;
					theme_tags?: string[] | null;
				};
				Update: {
					activation_time?: string | null;
					aliases?: string[] | null;
					casting_time?: string;
					components?: string | null;
					concentration?: boolean;
					created_at?: string;
					damage_roll?: string | null;
					damage_type?: string | null;
					description?: string;
					display_name?: string | null;
					duration?: string;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					has_attack_roll?: boolean | null;
					has_save?: boolean | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					job_names?: string[] | null;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					path_names?: string[] | null;
					power_level?: number;
					power_type?: string | null;
					range?: string;
					regent_names?: string[] | null;
					ritual?: boolean;
					save_ability?: string | null;
					school?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					target?: string | null;
					theme_tags?: string[] | null;
				};
				Relationships: [];
			};
			compendium_regent_features: {
				Row: {
					action_type: string | null;
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					is_signature: boolean;
					level: number;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					prerequisites: string | null;
					recharge: string | null;
					regent_id: string;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					uses_formula: string | null;
				};
				Insert: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_signature?: boolean;
					level: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					prerequisites?: string | null;
					recharge?: string | null;
					regent_id: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Update: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_signature?: boolean;
					level?: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					prerequisites?: string | null;
					recharge?: string | null;
					regent_id?: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Relationships: [];
			};
			compendium_regents: {
				Row: {
					aliases: string[] | null;
					armor_proficiencies: string[] | null;
					class_features: Json | null;
					corruption_risk: string | null;
					created_at: string;
					damage_type: string | null;
					description: string;
					display_name: string | null;
					effects: Json | null;
					flavor: string | null;
					flavor_text: string | null;
					generated_reason: string | null;
					hit_dice: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: string | null;
					manifestation_description: string | null;
					mechanics: Json | null;
					name: string;
					prerequisites: string | null;
					primary_abilities:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					progression_table: Json | null;
					rank: string | null;
					regent_requirements: Json | null;
					saving_throws: string[] | null;
					skill_proficiencies: string[] | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					spellcasting: Json | null;
					tags: string[] | null;
					theme: string;
					theme_tags: string[] | null;
					title: string;
					tool_proficiencies: string[] | null;
					unlock_level: number;
					updated_at: string;
					weapon_proficiencies: string[] | null;
				};
				Insert: {
					aliases?: string[] | null;
					armor_proficiencies?: string[] | null;
					class_features?: Json | null;
					corruption_risk?: string | null;
					created_at?: string;
					damage_type?: string | null;
					description: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					hit_dice?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					manifestation_description?: string | null;
					mechanics?: Json | null;
					name: string;
					prerequisites?: string | null;
					primary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					progression_table?: Json | null;
					rank?: string | null;
					regent_requirements?: Json | null;
					saving_throws?: string[] | null;
					skill_proficiencies?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					spellcasting?: Json | null;
					tags?: string[] | null;
					theme: string;
					theme_tags?: string[] | null;
					title: string;
					tool_proficiencies?: string[] | null;
					unlock_level?: number;
					updated_at?: string;
					weapon_proficiencies?: string[] | null;
				};
				Update: {
					aliases?: string[] | null;
					armor_proficiencies?: string[] | null;
					class_features?: Json | null;
					corruption_risk?: string | null;
					created_at?: string;
					damage_type?: string | null;
					description?: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					flavor_text?: string | null;
					generated_reason?: string | null;
					hit_dice?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					manifestation_description?: string | null;
					mechanics?: Json | null;
					name?: string;
					prerequisites?: string | null;
					primary_abilities?:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					progression_table?: Json | null;
					rank?: string | null;
					regent_requirements?: Json | null;
					saving_throws?: string[] | null;
					skill_proficiencies?: string[] | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					spellcasting?: Json | null;
					tags?: string[] | null;
					theme?: string;
					theme_tags?: string[] | null;
					title?: string;
					tool_proficiencies?: string[] | null;
					unlock_level?: number;
					updated_at?: string;
					weapon_proficiencies?: string[] | null;
				};
				Relationships: [];
			};
			compendium_relics: {
				Row: {
					aliases: string[] | null;
					attunement_requirements: string | null;
					corruption_risk: string | null;
					created_at: string;
					description: string;
					display_name: string | null;
					effects: Json | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					item_type: string;
					license_note: string | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					properties: string[] | null;
					quirks: string[] | null;
					rarity: Database["public"]["Enums"]["rarity"];
					relic_tier: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement: boolean;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					stats: Json | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					value_credits: number | null;
					weight: number | null;
				};
				Insert: {
					aliases?: string[] | null;
					attunement_requirements?: string | null;
					corruption_risk?: string | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					item_type: string;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					properties?: string[] | null;
					quirks?: string[] | null;
					rarity?: Database["public"]["Enums"]["rarity"];
					relic_tier?: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement?: boolean;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					stats?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					value_credits?: number | null;
					weight?: number | null;
				};
				Update: {
					aliases?: string[] | null;
					attunement_requirements?: string | null;
					corruption_risk?: string | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					item_type?: string;
					license_note?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					properties?: string[] | null;
					quirks?: string[] | null;
					rarity?: Database["public"]["Enums"]["rarity"];
					relic_tier?: Database["public"]["Enums"]["relic_tier"] | null;
					requires_attunement?: boolean;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					stats?: Json | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					value_credits?: number | null;
					weight?: number | null;
				};
				Relationships: [];
			};
			compendium_rules: {
				Row: {
					category: string;
					created_at: string;
					description: string;
					display_name: string | null;
					examples: string[] | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
				};
				Insert: {
					category: string;
					created_at?: string;
					description: string;
					display_name?: string | null;
					examples?: string[] | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
				};
				Update: {
					category?: string;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					examples?: string[] | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
				};
				Relationships: [];
			};
			compendium_runes: {
				Row: {
					activation_action: string | null;
					activation_cost: string | null;
					activation_cost_amount: number | null;
					aliases: string[] | null;
					concentration: boolean | null;
					created_at: string;
					description: string;
					discovery_lore: string | null;
					display_name: string | null;
					duration: string | null;
					effect_description: string | null;
					effect_type: string;
					effects: Json | null;
					flavor: string | null;
					higher_levels: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					is_attunement: boolean | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					range: string | null;
					rarity: Database["public"]["Enums"]["rarity"];
					recharge: string | null;
					requires_level: number | null;
					rune_category: string;
					rune_level: number;
					rune_type: string;
					source_book: string | null;
					tags: string[] | null;
					updated_at: string;
					uses_per_rest: string | null;
				};
				Insert: {
					activation_action?: string | null;
					activation_cost?: string | null;
					activation_cost_amount?: number | null;
					aliases?: string[] | null;
					concentration?: boolean | null;
					created_at?: string;
					description: string;
					discovery_lore?: string | null;
					display_name?: string | null;
					duration?: string | null;
					effect_description?: string | null;
					effect_type: string;
					effects?: Json | null;
					flavor?: string | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					is_attunement?: boolean | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					range?: string | null;
					rarity?: Database["public"]["Enums"]["rarity"];
					recharge?: string | null;
					requires_level?: number | null;
					rune_category: string;
					rune_level?: number;
					rune_type: string;
					source_book?: string | null;
					tags?: string[] | null;
					updated_at?: string;
					uses_per_rest?: string | null;
				};
				Update: {
					activation_action?: string | null;
					activation_cost?: string | null;
					activation_cost_amount?: number | null;
					aliases?: string[] | null;
					concentration?: boolean | null;
					created_at?: string;
					description?: string;
					discovery_lore?: string | null;
					display_name?: string | null;
					duration?: string | null;
					effect_description?: string | null;
					effect_type?: string;
					effects?: Json | null;
					flavor?: string | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					is_attunement?: boolean | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					range?: string | null;
					rarity?: Database["public"]["Enums"]["rarity"];
					recharge?: string | null;
					requires_level?: number | null;
					rune_category?: string;
					rune_level?: number;
					rune_type?: string;
					source_book?: string | null;
					tags?: string[] | null;
					updated_at?: string;
					uses_per_rest?: string | null;
				};
				Relationships: [];
			};
			compendium_shadow_soldier_abilities: {
				Row: {
					ability_type: string;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					recharge: string | null;
					shadow_soldier_id: string;
					tags: string[] | null;
					uses_per_day: number | null;
				};
				Insert: {
					ability_type?: string;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					recharge?: string | null;
					shadow_soldier_id: string;
					tags?: string[] | null;
					uses_per_day?: number | null;
				};
				Update: {
					ability_type?: string;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					recharge?: string | null;
					shadow_soldier_id?: string;
					tags?: string[] | null;
					uses_per_day?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_shadow_soldier_abilities_shadow_soldier_id_fkey";
						columns: ["shadow_soldier_id"];
						isOneToOne: false;
						referencedRelation: "compendium_shadow_soldiers";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_shadow_soldier_actions: {
				Row: {
					action_type: string;
					attack_bonus: number | null;
					created_at: string;
					damage: string | null;
					damage_type: string | null;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					legendary_cost: number | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					recharge: string | null;
					shadow_soldier_id: string;
					tags: string[] | null;
				};
				Insert: {
					action_type?: string;
					attack_bonus?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					legendary_cost?: number | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					recharge?: string | null;
					shadow_soldier_id: string;
					tags?: string[] | null;
				};
				Update: {
					action_type?: string;
					attack_bonus?: number | null;
					created_at?: string;
					damage?: string | null;
					damage_type?: string | null;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					legendary_cost?: number | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					recharge?: string | null;
					shadow_soldier_id?: string;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_shadow_soldier_actions_shadow_soldier_id_fkey";
						columns: ["shadow_soldier_id"];
						isOneToOne: false;
						referencedRelation: "compendium_shadow_soldiers";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_shadow_soldier_traits: {
				Row: {
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					id: string;
					image_url: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					shadow_soldier_id: string;
					tags: string[] | null;
				};
				Insert: {
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					shadow_soldier_id: string;
					tags?: string[] | null;
				};
				Update: {
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					id?: string;
					image_url?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					shadow_soldier_id?: string;
					tags?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_shadow_soldier_traits_shadow_soldier_id_fkey";
						columns: ["shadow_soldier_id"];
						isOneToOne: false;
						referencedRelation: "compendium_shadow_soldiers";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_shadow_soldiers: {
				Row: {
					abilities: Json;
					agi: number;
					aliases: string[] | null;
					armor_class: number;
					condition_immunities: string[] | null;
					created_at: string;
					damage_immunities: string[] | null;
					description: string;
					display_name: string | null;
					flavor: string | null;
					hit_points: number;
					id: string;
					image_url: string | null;
					int: number;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					pre: number;
					rank: string;
					sense: number;
					shadow_type: string;
					speed: number;
					str: number;
					summon_requirements: string | null;
					tags: string[] | null;
					title: string;
					vit: number;
				};
				Insert: {
					abilities?: Json;
					agi?: number;
					aliases?: string[] | null;
					armor_class?: number;
					condition_immunities?: string[] | null;
					created_at?: string;
					damage_immunities?: string[] | null;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					hit_points?: number;
					id?: string;
					image_url?: string | null;
					int?: number;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					pre?: number;
					rank: string;
					sense?: number;
					shadow_type?: string;
					speed?: number;
					str?: number;
					summon_requirements?: string | null;
					tags?: string[] | null;
					title: string;
					vit?: number;
				};
				Update: {
					abilities?: Json;
					agi?: number;
					aliases?: string[] | null;
					armor_class?: number;
					condition_immunities?: string[] | null;
					created_at?: string;
					damage_immunities?: string[] | null;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					hit_points?: number;
					id?: string;
					image_url?: string | null;
					int?: number;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					pre?: number;
					rank?: string;
					sense?: number;
					shadow_type?: string;
					speed?: number;
					str?: number;
					summon_requirements?: string | null;
					tags?: string[] | null;
					title?: string;
					vit?: number;
				};
				Relationships: [];
			};
			compendium_sigils: {
				Row: {
					active_feature: Json | null;
					can_inscribe_on: string[] | null;
					created_at: string;
					description: string | null;
					display_name: string | null;
					effect_description: string;
					effect_type: string | null;
					effects: Json | null;
					flavor: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					inscription_difficulty: number | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					passive_bonuses: Json | null;
					rarity: string;
					requires_level: number | null;
					rune_category: string;
					rune_level: number;
					rune_type: string;
					source_book: string | null;
					tags: string[] | null;
					updated_at: string;
				};
				Insert: {
					active_feature?: Json | null;
					can_inscribe_on?: string[] | null;
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					effect_description: string;
					effect_type?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					inscription_difficulty?: number | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					passive_bonuses?: Json | null;
					rarity?: string;
					requires_level?: number | null;
					rune_category: string;
					rune_level?: number;
					rune_type: string;
					source_book?: string | null;
					tags?: string[] | null;
					updated_at?: string;
				};
				Update: {
					active_feature?: Json | null;
					can_inscribe_on?: string[] | null;
					created_at?: string;
					description?: string | null;
					display_name?: string | null;
					effect_description?: string;
					effect_type?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					inscription_difficulty?: number | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					passive_bonuses?: Json | null;
					rarity?: string;
					requires_level?: number | null;
					rune_category?: string;
					rune_level?: number;
					rune_type?: string;
					source_book?: string | null;
					tags?: string[] | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_skills: {
				Row: {
					ability: string;
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					examples: string[] | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					license_note: string | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
				};
				Insert: {
					ability: string;
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					examples?: string[] | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Update: {
					ability?: string;
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					examples?: string[] | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					license_note?: string | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
				};
				Relationships: [];
			};
			compendium_sovereign_features: {
				Row: {
					action_type: string | null;
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					is_capstone: boolean;
					level: number;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					name: string;
					origin_sources: string[] | null;
					recharge: string | null;
					source_kind: string | null;
					source_name: string | null;
					sovereign_id: string;
					tags: string[] | null;
					theme_tags: string[] | null;
					uses_formula: string | null;
				};
				Insert: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_capstone?: boolean;
					level: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name: string;
					origin_sources?: string[] | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					sovereign_id: string;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Update: {
					action_type?: string | null;
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_capstone?: boolean;
					level?: number;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					name?: string;
					origin_sources?: string[] | null;
					recharge?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					sovereign_id?: string;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					uses_formula?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_sovereign_features_sovereign_id_fkey";
						columns: ["sovereign_id"];
						isOneToOne: false;
						referencedRelation: "compendium_sovereigns";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_sovereigns: {
				Row: {
					aliases: string[] | null;
					created_at: string;
					description: string;
					display_name: string | null;
					flavor: string | null;
					fusion_description: string | null;
					fusion_theme: string | null;
					generated_reason: string | null;
					id: string;
					image_url: string | null;
					is_ai_generated: boolean;
					is_template: boolean;
					job_id: string | null;
					license_note: string | null;
					lore: Json | null;
					mechanics: Json | null;
					monarch_a_id: string | null;
					monarch_b_id: string | null;
					name: string;
					path_id: string | null;
					prerequisites: string | null;
					regent_a_id: string | null;
					regent_b_id: string | null;
					source_book: string | null;
					source_kind: string | null;
					source_name: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					unlock_level: number;
					updated_at: string;
				};
				Insert: {
					aliases?: string[] | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					flavor?: string | null;
					fusion_description?: string | null;
					fusion_theme?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_ai_generated?: boolean;
					is_template?: boolean;
					job_id?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monarch_a_id?: string | null;
					monarch_b_id?: string | null;
					name: string;
					path_id?: string | null;
					prerequisites?: string | null;
					regent_a_id?: string | null;
					regent_b_id?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					unlock_level?: number;
					updated_at?: string;
				};
				Update: {
					aliases?: string[] | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					flavor?: string | null;
					fusion_description?: string | null;
					fusion_theme?: string | null;
					generated_reason?: string | null;
					id?: string;
					image_url?: string | null;
					is_ai_generated?: boolean;
					is_template?: boolean;
					job_id?: string | null;
					license_note?: string | null;
					lore?: Json | null;
					mechanics?: Json | null;
					monarch_a_id?: string | null;
					monarch_b_id?: string | null;
					name?: string;
					path_id?: string | null;
					prerequisites?: string | null;
					regent_a_id?: string | null;
					regent_b_id?: string | null;
					source_book?: string | null;
					source_kind?: string | null;
					source_name?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					unlock_level?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "compendium_sovereigns_job_id_fkey";
						columns: ["job_id"];
						isOneToOne: false;
						referencedRelation: "compendium_jobs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_sovereigns_monarch_a_id_fkey";
						columns: ["monarch_a_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_sovereigns_monarch_b_id_fkey";
						columns: ["monarch_b_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_sovereigns_path_id_fkey";
						columns: ["path_id"];
						isOneToOne: false;
						referencedRelation: "compendium_job_paths";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_sovereigns_regent_a_id_fkey";
						columns: ["regent_a_id"];
						isOneToOne: false;
						referencedRelation: "compendium_regents";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compendium_sovereigns_regent_b_id_fkey";
						columns: ["regent_b_id"];
						isOneToOne: false;
						referencedRelation: "compendium_regents";
						referencedColumns: ["id"];
					},
				];
			};
			compendium_spells: {
				Row: {
					activation: Json | null;
					area: Json | null;
					area_of_effect: Json | null;
					at_higher_levels: string | null;
					casting_time: string | null;
					classes: string[] | null;
					components: Json | null;
					concentration: boolean | null;
					created_at: string;
					description: string;
					display_name: string | null;
					duration: Json | null;
					effect: string | null;
					effects: Json | null;
					flavor: string | null;
					has_attack_roll: boolean | null;
					higher_levels: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					range: Json | null;
					rank: string | null;
					ritual: boolean | null;
					saving_throw: Json | null;
					saving_throw_ability: string | null;
					school: string | null;
					source_book: string | null;
					spell_attack: Json | null;
					spell_level: number | null;
					spell_type: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					updated_at: string;
				};
				Insert: {
					activation?: Json | null;
					area?: Json | null;
					area_of_effect?: Json | null;
					at_higher_levels?: string | null;
					casting_time?: string | null;
					classes?: string[] | null;
					components?: Json | null;
					concentration?: boolean | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					duration?: Json | null;
					effect?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					has_attack_roll?: boolean | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					range?: Json | null;
					rank?: string | null;
					ritual?: boolean | null;
					saving_throw?: Json | null;
					saving_throw_ability?: string | null;
					school?: string | null;
					source_book?: string | null;
					spell_attack?: Json | null;
					spell_level?: number | null;
					spell_type?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string;
				};
				Update: {
					activation?: Json | null;
					area?: Json | null;
					area_of_effect?: Json | null;
					at_higher_levels?: string | null;
					casting_time?: string | null;
					classes?: string[] | null;
					components?: Json | null;
					concentration?: boolean | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					duration?: Json | null;
					effect?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					has_attack_roll?: boolean | null;
					higher_levels?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					range?: Json | null;
					rank?: string | null;
					ritual?: boolean | null;
					saving_throw?: Json | null;
					saving_throw_ability?: string | null;
					school?: string | null;
					source_book?: string | null;
					spell_attack?: Json | null;
					spell_level?: number | null;
					spell_type?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_tattoos: {
				Row: {
					attunement: boolean | null;
					body_part: string | null;
					created_at: string;
					description: string;
					display_name: string | null;
					effects: Json | null;
					flavor: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					rarity: string | null;
					source: string | null;
					source_book: string | null;
					system_interaction: string | null;
					tags: string[] | null;
					theme_tags: string[] | null;
					updated_at: string;
				};
				Insert: {
					attunement?: boolean | null;
					body_part?: string | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					rarity?: string | null;
					source?: string | null;
					source_book?: string | null;
					system_interaction?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string;
				};
				Update: {
					attunement?: boolean | null;
					body_part?: string | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					rarity?: string | null;
					source?: string | null;
					source_book?: string | null;
					system_interaction?: string | null;
					tags?: string[] | null;
					theme_tags?: string[] | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			compendium_techniques: {
				Row: {
					activation_cost: string | null;
					activation_type: string;
					class_requirement: string | null;
					created_at: string;
					description: string;
					display_name: string | null;
					duration: string | null;
					effects: Json | null;
					flavor: string | null;
					id: string;
					image: string | null;
					image_url: string | null;
					level_requirement: number | null;
					limitations: Json | null;
					lore: string | null;
					mechanics: Json | null;
					name: string;
					primary_effect: string;
					range_desc: string | null;
					secondary_effect: string | null;
					source: string | null;
					style: string;
					tags: string[] | null;
					technique_type: string;
				};
				Insert: {
					activation_cost?: string | null;
					activation_type: string;
					class_requirement?: string | null;
					created_at?: string;
					description: string;
					display_name?: string | null;
					duration?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					level_requirement?: number | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name: string;
					primary_effect: string;
					range_desc?: string | null;
					secondary_effect?: string | null;
					source?: string | null;
					style: string;
					tags?: string[] | null;
					technique_type: string;
				};
				Update: {
					activation_cost?: string | null;
					activation_type?: string;
					class_requirement?: string | null;
					created_at?: string;
					description?: string;
					display_name?: string | null;
					duration?: string | null;
					effects?: Json | null;
					flavor?: string | null;
					id?: string;
					image?: string | null;
					image_url?: string | null;
					level_requirement?: number | null;
					limitations?: Json | null;
					lore?: string | null;
					mechanics?: Json | null;
					name?: string;
					primary_effect?: string;
					range_desc?: string | null;
					secondary_effect?: string | null;
					source?: string | null;
					style?: string;
					tags?: string[] | null;
					technique_type?: string;
				};
				Relationships: [];
			};
			daily_quest_configs: {
				Row: {
					campaign_id: string | null;
					character_id: string | null;
					created_at: string | null;
					custom_scaling: Json | null;
					difficulty_mode: string | null;
					enabled: boolean | null;
					id: string;
					max_active_quests: number | null;
					penalty_mode: string | null;
					reroll_allowance: number | null;
					reward_mode: string | null;
					updated_at: string | null;
				};
				Insert: {
					campaign_id?: string | null;
					character_id?: string | null;
					created_at?: string | null;
					custom_scaling?: Json | null;
					difficulty_mode?: string | null;
					enabled?: boolean | null;
					id: string;
					max_active_quests?: number | null;
					penalty_mode?: string | null;
					reroll_allowance?: number | null;
					reward_mode?: string | null;
					updated_at?: string | null;
				};
				Update: {
					campaign_id?: string | null;
					character_id?: string | null;
					created_at?: string | null;
					custom_scaling?: Json | null;
					difficulty_mode?: string | null;
					enabled?: boolean | null;
					id?: string;
					max_active_quests?: number | null;
					penalty_mode?: string | null;
					reroll_allowance?: number | null;
					reward_mode?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "daily_quest_configs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_quest_configs_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_quest_configs_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_quest_configs_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			daily_quest_instances: {
				Row: {
					assigned_at: string | null;
					character_id: string;
					completed_at: string | null;
					created_at: string | null;
					date_key: string;
					expires_at: string;
					id: string;
					progress: Json;
					rewards_granted: Json | null;
					scaling_applied: Json;
					seed: number;
					status: string;
					template_id: string;
					updated_at: string | null;
				};
				Insert: {
					assigned_at?: string | null;
					character_id: string;
					completed_at?: string | null;
					created_at?: string | null;
					date_key: string;
					expires_at: string;
					id: string;
					progress?: Json;
					rewards_granted?: Json | null;
					scaling_applied?: Json;
					seed: number;
					status?: string;
					template_id: string;
					updated_at?: string | null;
				};
				Update: {
					assigned_at?: string | null;
					character_id?: string;
					completed_at?: string | null;
					created_at?: string | null;
					date_key?: string;
					expires_at?: string;
					id?: string;
					progress?: Json;
					rewards_granted?: Json | null;
					scaling_applied?: Json;
					seed?: number;
					status?: string;
					template_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "daily_quest_instances_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_quest_instances_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_quest_instances_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "daily_quest_templates";
						referencedColumns: ["id"];
					},
				];
			};
			daily_quest_templates: {
				Row: {
					base_rewards: Json;
					category: string;
					created_at: string | null;
					default_scaling: Json;
					description: string;
					id: string;
					is_active: boolean | null;
					name: string;
					requirements: Json;
					tags: string[] | null;
					tier: string;
					updated_at: string | null;
				};
				Insert: {
					base_rewards: Json;
					category: string;
					created_at?: string | null;
					default_scaling: Json;
					description: string;
					id: string;
					is_active?: boolean | null;
					name: string;
					requirements: Json;
					tags?: string[] | null;
					tier: string;
					updated_at?: string | null;
				};
				Update: {
					base_rewards?: Json;
					category?: string;
					created_at?: string | null;
					default_scaling?: Json;
					description?: string;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					requirements?: Json;
					tags?: string[] | null;
					tier?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			entity_assets: {
				Row: {
					asset_id: string;
					created_at: string;
					entity_id: string;
					entity_type: string;
					id: string;
				};
				Insert: {
					asset_id: string;
					created_at?: string;
					entity_id: string;
					entity_type: string;
					id?: string;
				};
				Update: {
					asset_id?: string;
					created_at?: string;
					entity_id?: string;
					entity_type?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "entity_assets_asset_id_fkey";
						columns: ["asset_id"];
						isOneToOne: false;
						referencedRelation: "assets";
						referencedColumns: ["id"];
					},
				];
			};
			guild_members: {
				Row: {
					character_id: string | null;
					guild_id: string;
					id: string;
					joined_at: string | null;
					npc_data: Json | null;
					npc_id: string | null;
					npc_level: number | null;
					npc_leveling_mode: string | null;
					npc_name: string | null;
					npc_xp: number | null;
					role: string;
					user_id: string | null;
				};
				Insert: {
					character_id?: string | null;
					guild_id: string;
					id?: string;
					joined_at?: string | null;
					npc_data?: Json | null;
					npc_id?: string | null;
					npc_level?: number | null;
					npc_leveling_mode?: string | null;
					npc_name?: string | null;
					npc_xp?: number | null;
					role: string;
					user_id?: string | null;
				};
				Update: {
					character_id?: string | null;
					guild_id?: string;
					id?: string;
					joined_at?: string | null;
					npc_data?: Json | null;
					npc_id?: string | null;
					npc_level?: number | null;
					npc_leveling_mode?: string | null;
					npc_name?: string | null;
					npc_xp?: number | null;
					role?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "guild_members_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "guild_members_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "guild_members_guild_id_fkey";
						columns: ["guild_id"];
						isOneToOne: false;
						referencedRelation: "guilds";
						referencedColumns: ["id"];
					},
				];
			};
			guilds: {
				Row: {
					campaign_id: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					is_active: boolean | null;
					leader_user_id: string;
					motto: string | null;
					name: string;
					settings: Json | null;
					share_code: string;
					updated_at: string | null;
				};
				Insert: {
					campaign_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					leader_user_id: string;
					motto?: string | null;
					name: string;
					settings?: Json | null;
					share_code: string;
					updated_at?: string | null;
				};
				Update: {
					campaign_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					leader_user_id?: string;
					motto?: string | null;
					name?: string;
					settings?: Json | null;
					share_code?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "guilds_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "guilds_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			homebrew_content: {
				Row: {
					campaign_id: string | null;
					content_type: string;
					created_at: string | null;
					data: Json;
					description: string;
					id: string;
					is_public: boolean | null;
					name: string;
					published_at: string | null;
					source_book: string | null;
					status: string;
					tags: string[];
					updated_at: string | null;
					updated_by: string | null;
					user_id: string | null;
					version: number;
					visibility_scope: string;
				};
				Insert: {
					campaign_id?: string | null;
					content_type: string;
					created_at?: string | null;
					data: Json;
					description: string;
					id?: string;
					is_public?: boolean | null;
					name: string;
					published_at?: string | null;
					source_book?: string | null;
					status?: string;
					tags?: string[];
					updated_at?: string | null;
					updated_by?: string | null;
					user_id?: string | null;
					version?: number;
					visibility_scope?: string;
				};
				Update: {
					campaign_id?: string | null;
					content_type?: string;
					created_at?: string | null;
					data?: Json;
					description?: string;
					id?: string;
					is_public?: boolean | null;
					name?: string;
					published_at?: string | null;
					source_book?: string | null;
					status?: string;
					tags?: string[];
					updated_at?: string | null;
					updated_by?: string | null;
					user_id?: string | null;
					version?: number;
					visibility_scope?: string;
				};
				Relationships: [
					{
						foreignKeyName: "homebrew_content_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "homebrew_content_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "homebrew_content_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["id"];
					},
				];
			};
			homebrew_content_versions: {
				Row: {
					change_note: string | null;
					created_at: string;
					created_by: string | null;
					homebrew_id: string;
					id: string;
					snapshot: Json;
					version_number: number;
				};
				Insert: {
					change_note?: string | null;
					created_at?: string;
					created_by?: string | null;
					homebrew_id: string;
					id?: string;
					snapshot: Json;
					version_number: number;
				};
				Update: {
					change_note?: string | null;
					created_at?: string;
					created_by?: string | null;
					homebrew_id?: string;
					id?: string;
					snapshot?: Json;
					version_number?: number;
				};
				Relationships: [
					{
						foreignKeyName: "homebrew_content_versions_homebrew_id_fkey";
						columns: ["homebrew_id"];
						isOneToOne: false;
						referencedRelation: "homebrew_content";
						referencedColumns: ["id"];
					},
				];
			};
			marketplace_downloads: {
				Row: {
					created_at: string;
					id: string;
					item_id: string;
					source: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					item_id: string;
					source?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					item_id?: string;
					source?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "marketplace_downloads_item_id_fkey";
						columns: ["item_id"];
						isOneToOne: false;
						referencedRelation: "marketplace_items";
						referencedColumns: ["id"];
					},
				];
			};
			marketplace_items: {
				Row: {
					author_id: string;
					category: string;
					compatibility: Json;
					content: Json;
					created_at: string;
					description: string;
					downloads_count: number;
					file_url: string | null;
					id: string;
					is_featured: boolean;
					is_listed: boolean;
					is_verified: boolean;
					item_type: string;
					license: string;
					price_amount: number | null;
					price_currency: string | null;
					price_type: string;
					rating_avg: number;
					rating_count: number;
					requirements: Json;
					tags: string[];
					title: string;
					updated_at: string;
					version: string;
					views_count: number;
				};
				Insert: {
					author_id: string;
					category?: string;
					compatibility?: Json;
					content?: Json;
					created_at?: string;
					description: string;
					downloads_count?: number;
					file_url?: string | null;
					id?: string;
					is_featured?: boolean;
					is_listed?: boolean;
					is_verified?: boolean;
					item_type: string;
					license?: string;
					price_amount?: number | null;
					price_currency?: string | null;
					price_type?: string;
					rating_avg?: number;
					rating_count?: number;
					requirements?: Json;
					tags?: string[];
					title: string;
					updated_at?: string;
					version?: string;
					views_count?: number;
				};
				Update: {
					author_id?: string;
					category?: string;
					compatibility?: Json;
					content?: Json;
					created_at?: string;
					description?: string;
					downloads_count?: number;
					file_url?: string | null;
					id?: string;
					is_featured?: boolean;
					is_listed?: boolean;
					is_verified?: boolean;
					item_type?: string;
					license?: string;
					price_amount?: number | null;
					price_currency?: string | null;
					price_type?: string;
					rating_avg?: number;
					rating_count?: number;
					requirements?: Json;
					tags?: string[];
					title?: string;
					updated_at?: string;
					version?: string;
					views_count?: number;
				};
				Relationships: [];
			};
			marketplace_reviews: {
				Row: {
					comment: string | null;
					created_at: string;
					helpful_count: number;
					id: string;
					item_id: string;
					rating: number;
					updated_at: string;
					user_id: string;
					verified_purchase: boolean;
				};
				Insert: {
					comment?: string | null;
					created_at?: string;
					helpful_count?: number;
					id?: string;
					item_id: string;
					rating: number;
					updated_at?: string;
					user_id: string;
					verified_purchase?: boolean;
				};
				Update: {
					comment?: string | null;
					created_at?: string;
					helpful_count?: number;
					id?: string;
					item_id?: string;
					rating?: number;
					updated_at?: string;
					user_id?: string;
					verified_purchase?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "marketplace_reviews_item_id_fkey";
						columns: ["item_id"];
						isOneToOne: false;
						referencedRelation: "marketplace_items";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					created_at: string;
					display_name: string | null;
					email: string;
					id: string;
					role: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					display_name?: string | null;
					email: string;
					id: string;
					role?: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					display_name?: string | null;
					email?: string;
					id?: string;
					role?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			quest_completions: {
				Row: {
					character_id: string | null;
					completed_at: string | null;
					id: string;
					quest_id: string;
					rewards_claimed: boolean;
					user_id: string;
				};
				Insert: {
					character_id?: string | null;
					completed_at?: string | null;
					id?: string;
					quest_id: string;
					rewards_claimed?: boolean;
					user_id: string;
				};
				Update: {
					character_id?: string | null;
					completed_at?: string | null;
					id?: string;
					quest_id?: string;
					rewards_claimed?: boolean;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "quest_completions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quest_completions_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quest_completions_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "session_quests";
						referencedColumns: ["id"];
					},
				];
			};
			quest_rewards_log: {
				Row: {
					character_id: string | null;
					created_at: string | null;
					gold_awarded: number | null;
					id: string;
					items_awarded: string[] | null;
					quest_id: string;
					user_id: string;
				};
				Insert: {
					character_id?: string | null;
					created_at?: string | null;
					gold_awarded?: number | null;
					id?: string;
					items_awarded?: string[] | null;
					quest_id: string;
					user_id: string;
				};
				Update: {
					character_id?: string | null;
					created_at?: string | null;
					gold_awarded?: number | null;
					id?: string;
					items_awarded?: string[] | null;
					quest_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "quest_rewards_log_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quest_rewards_log_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quest_rewards_log_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "session_quests";
						referencedColumns: ["id"];
					},
				];
			};
			roll_history: {
				Row: {
					campaign_id: string | null;
					character_id: string | null;
					context: string | null;
					created_at: string;
					dice_formula: string;
					id: string;
					modifiers: Json | null;
					result: number;
					roll_type: string;
					rolls: number[];
					user_id: string;
				};
				Insert: {
					campaign_id?: string | null;
					character_id?: string | null;
					context?: string | null;
					created_at?: string;
					dice_formula: string;
					id?: string;
					modifiers?: Json | null;
					result: number;
					roll_type: string;
					rolls: number[];
					user_id: string;
				};
				Update: {
					campaign_id?: string | null;
					character_id?: string | null;
					context?: string | null;
					created_at?: string;
					dice_formula?: string;
					id?: string;
					modifiers?: Json | null;
					result?: number;
					roll_type?: string;
					rolls?: number[];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "roll_history_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "roll_history_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "roll_history_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "roll_history_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
				];
			};
			saved_searches: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					search_params: Json;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					search_params?: Json;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					search_params?: Json;
					user_id?: string;
				};
				Relationships: [];
			};
			saved_sovereigns: {
				Row: {
					abilities: Json;
					created_at: string;
					created_by: string;
					description: string;
					fusion_description: string;
					fusion_method: string;
					fusion_stability: string;
					fusion_theme: string;
					id: string;
					is_public: boolean;
					job_id: string;
					likes_count: number;
					monarch_a_id: string;
					monarch_b_id: string;
					name: string;
					path_id: string;
					power_multiplier: string;
					title: string;
				};
				Insert: {
					abilities?: Json;
					created_at?: string;
					created_by: string;
					description: string;
					fusion_description: string;
					fusion_method: string;
					fusion_stability: string;
					fusion_theme: string;
					id?: string;
					is_public?: boolean;
					job_id: string;
					likes_count?: number;
					monarch_a_id: string;
					monarch_b_id: string;
					name: string;
					path_id: string;
					power_multiplier: string;
					title: string;
				};
				Update: {
					abilities?: Json;
					created_at?: string;
					created_by?: string;
					description?: string;
					fusion_description?: string;
					fusion_method?: string;
					fusion_stability?: string;
					fusion_theme?: string;
					id?: string;
					is_public?: boolean;
					job_id?: string;
					likes_count?: number;
					monarch_a_id?: string;
					monarch_b_id?: string;
					name?: string;
					path_id?: string;
					power_multiplier?: string;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: "saved_sovereigns_job_id_fkey";
						columns: ["job_id"];
						isOneToOne: false;
						referencedRelation: "compendium_jobs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "saved_sovereigns_monarch_a_id_fkey";
						columns: ["monarch_a_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "saved_sovereigns_monarch_b_id_fkey";
						columns: ["monarch_b_id"];
						isOneToOne: false;
						referencedRelation: "compendium_monarchs";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "saved_sovereigns_path_id_fkey";
						columns: ["path_id"];
						isOneToOne: false;
						referencedRelation: "compendium_job_paths";
						referencedColumns: ["id"];
					},
				];
			};
			session_participants: {
				Row: {
					character_id: string | null;
					id: string;
					is_warden: boolean;
					joined_at: string | null;
					session_id: string;
					user_id: string;
				};
				Insert: {
					character_id?: string | null;
					id?: string;
					is_warden?: boolean;
					joined_at?: string | null;
					session_id: string;
					user_id: string;
				};
				Update: {
					character_id?: string | null;
					id?: string;
					is_warden?: boolean;
					joined_at?: string | null;
					session_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "session_participants_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "session_participants_character_id_fkey";
						columns: ["character_id"];
						isOneToOne: false;
						referencedRelation: "user_characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "session_participants_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			session_quests: {
				Row: {
					completion_notes: string | null;
					created_at: string | null;
					created_by: string;
					description: string;
					id: string;
					objectives: string[];
					rewards: Json;
					session_id: string;
					status: string;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					completion_notes?: string | null;
					created_at?: string | null;
					created_by: string;
					description: string;
					id?: string;
					objectives?: string[];
					rewards?: Json;
					session_id: string;
					status?: string;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					completion_notes?: string | null;
					created_at?: string | null;
					created_by?: string;
					description?: string;
					id?: string;
					objectives?: string[];
					rewards?: Json;
					session_id?: string;
					status?: string;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "session_quests_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			sourcebook_catalog: {
				Row: {
					created_at: string;
					id: string;
					is_free: boolean;
					metadata: Json;
					name: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id: string;
					is_free?: boolean;
					metadata?: Json;
					name: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					is_free?: boolean;
					metadata?: Json;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_favorites: {
				Row: {
					created_at: string;
					entry_id: string;
					entry_type: string;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					entry_id: string;
					entry_type: string;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					entry_id?: string;
					entry_type?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_marketplace_entitlements: {
				Row: {
					created_at: string;
					entitlement_type: string;
					expires_at: string | null;
					granted_by: string | null;
					id: string;
					item_id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					entitlement_type?: string;
					expires_at?: string | null;
					granted_by?: string | null;
					id?: string;
					item_id: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					entitlement_type?: string;
					expires_at?: string | null;
					granted_by?: string | null;
					id?: string;
					item_id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_marketplace_entitlements_item_id_fkey";
						columns: ["item_id"];
						isOneToOne: false;
						referencedRelation: "marketplace_items";
						referencedColumns: ["id"];
					},
				];
			};
			user_profiles: {
				Row: {
					avatar_url: string | null;
					created_at: string | null;
					display_name: string | null;
					email: string;
					id: string;
					role: string;
					updated_at: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string | null;
					display_name?: string | null;
					email: string;
					id: string;
					role?: string;
					updated_at?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string | null;
					display_name?: string | null;
					email?: string;
					id?: string;
					role?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			user_sourcebook_entitlements: {
				Row: {
					created_at: string;
					entitlement_type: string;
					expires_at: string | null;
					granted_by: string | null;
					id: string;
					sourcebook_id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					entitlement_type?: string;
					expires_at?: string | null;
					granted_by?: string | null;
					id?: string;
					sourcebook_id: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					entitlement_type?: string;
					expires_at?: string | null;
					granted_by?: string | null;
					id?: string;
					sourcebook_id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_sourcebook_entitlements_sourcebook_id_fkey";
						columns: ["sourcebook_id"];
						isOneToOne: false;
						referencedRelation: "sourcebook_catalog";
						referencedColumns: ["id"];
					},
				];
			};
			user_tool_states: {
				Row: {
					created_at: string;
					id: string;
					state: Json;
					tool_key: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					state?: Json;
					tool_key: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					state?: Json;
					tool_key?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			vtt_audio_settings: {
				Row: {
					ambient_volume: number;
					created_at: string | null;
					created_by: string;
					id: string;
					master_volume: number;
					music_volume: number;
					session_id: string;
					sfx_volume: number;
					updated_at: string | null;
					voice_chat_enabled: boolean;
					voice_chat_volume: number;
				};
				Insert: {
					ambient_volume?: number;
					created_at?: string | null;
					created_by: string;
					id?: string;
					master_volume?: number;
					music_volume?: number;
					session_id: string;
					sfx_volume?: number;
					updated_at?: string | null;
					voice_chat_enabled?: boolean;
					voice_chat_volume?: number;
				};
				Update: {
					ambient_volume?: number;
					created_at?: string | null;
					created_by?: string;
					id?: string;
					master_volume?: number;
					music_volume?: number;
					session_id?: string;
					sfx_volume?: number;
					updated_at?: string | null;
					voice_chat_enabled?: boolean;
					voice_chat_volume?: number;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_audio_settings_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: true;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_audio_tracks: {
				Row: {
					created_at: string | null;
					created_by: string;
					id: string;
					is_playing: boolean;
					loop: boolean;
					name: string;
					session_id: string;
					type: string;
					updated_at: string | null;
					url: string;
					volume: number;
				};
				Insert: {
					created_at?: string | null;
					created_by: string;
					id?: string;
					is_playing?: boolean;
					loop?: boolean;
					name: string;
					session_id: string;
					type: string;
					updated_at?: string | null;
					url: string;
					volume?: number;
				};
				Update: {
					created_at?: string | null;
					created_by?: string;
					id?: string;
					is_playing?: boolean;
					loop?: boolean;
					name?: string;
					session_id?: string;
					type?: string;
					updated_at?: string | null;
					url?: string;
					volume?: number;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_audio_tracks_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_chat_messages: {
				Row: {
					campaign_id: string;
					created_at: string | null;
					dice_formula: string | null;
					dice_result: number | null;
					id: string;
					message: string;
					message_type: string;
					session_id: string | null;
					user_id: string | null;
					user_name: string;
					whisper_to: string | null;
				};
				Insert: {
					campaign_id: string;
					created_at?: string | null;
					dice_formula?: string | null;
					dice_result?: number | null;
					id?: string;
					message: string;
					message_type?: string;
					session_id?: string | null;
					user_id?: string | null;
					user_name?: string;
					whisper_to?: string | null;
				};
				Update: {
					campaign_id?: string;
					created_at?: string | null;
					dice_formula?: string | null;
					dice_result?: number | null;
					id?: string;
					message?: string;
					message_type?: string;
					session_id?: string | null;
					user_id?: string | null;
					user_name?: string;
					whisper_to?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_chat_messages_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "vtt_chat_messages_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_fog_state: {
				Row: {
					campaign_id: string | null;
					created_at: string | null;
					fog_data: Json | null;
					id: string;
					scene_id: string;
					session_id: string | null;
					token_data: Json | null;
					updated_at: string | null;
				};
				Insert: {
					campaign_id?: string | null;
					created_at?: string | null;
					fog_data?: Json | null;
					id?: string;
					scene_id: string;
					session_id?: string | null;
					token_data?: Json | null;
					updated_at?: string | null;
				};
				Update: {
					campaign_id?: string | null;
					created_at?: string | null;
					fog_data?: Json | null;
					id?: string;
					scene_id?: string;
					session_id?: string | null;
					token_data?: Json | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_fog_state_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "vtt_fog_state_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_journal_entries: {
				Row: {
					campaign_id: string;
					category: string;
					content: string | null;
					created_at: string;
					id: string;
					tags: string[];
					title: string;
					updated_at: string;
					user_id: string;
					visible_to_players: boolean;
				};
				Insert: {
					campaign_id: string;
					category?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					tags?: string[];
					title: string;
					updated_at?: string;
					user_id: string;
					visible_to_players?: boolean;
				};
				Update: {
					campaign_id?: string;
					category?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					tags?: string[];
					title?: string;
					updated_at?: string;
					user_id?: string;
					visible_to_players?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_journal_entries_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaign_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "vtt_journal_entries_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_map_elements: {
				Row: {
					color: string;
					created_at: string | null;
					created_by: string;
					data: Json;
					element_type: string;
					height: number | null;
					id: string;
					opacity: number | null;
					session_id: string;
					stroke_width: number | null;
					updated_at: string | null;
					visible_to_players: boolean;
					width: number | null;
					x: number;
					y: number;
				};
				Insert: {
					color: string;
					created_at?: string | null;
					created_by: string;
					data?: Json;
					element_type: string;
					height?: number | null;
					id?: string;
					opacity?: number | null;
					session_id: string;
					stroke_width?: number | null;
					updated_at?: string | null;
					visible_to_players?: boolean;
					width?: number | null;
					x: number;
					y: number;
				};
				Update: {
					color?: string;
					created_at?: string | null;
					created_by?: string;
					data?: Json;
					element_type?: string;
					height?: number | null;
					id?: string;
					opacity?: number | null;
					session_id?: string;
					stroke_width?: number | null;
					updated_at?: string | null;
					visible_to_players?: boolean;
					width?: number | null;
					x?: number;
					y?: number;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_map_elements_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_settings: {
				Row: {
					background_color: string;
					background_image_url: string | null;
					created_at: string | null;
					created_by: string;
					dynamic_lighting_enabled: boolean;
					fog_of_war_enabled: boolean;
					grid_size: number;
					grid_visible: boolean;
					id: string;
					pan_x: number;
					pan_y: number;
					session_id: string;
					snap_to_grid: boolean;
					updated_at: string | null;
					zoom_level: number;
				};
				Insert: {
					background_color?: string;
					background_image_url?: string | null;
					created_at?: string | null;
					created_by: string;
					dynamic_lighting_enabled?: boolean;
					fog_of_war_enabled?: boolean;
					grid_size?: number;
					grid_visible?: boolean;
					id?: string;
					pan_x?: number;
					pan_y?: number;
					session_id: string;
					snap_to_grid?: boolean;
					updated_at?: string | null;
					zoom_level?: number;
				};
				Update: {
					background_color?: string;
					background_image_url?: string | null;
					created_at?: string | null;
					created_by?: string;
					dynamic_lighting_enabled?: boolean;
					fog_of_war_enabled?: boolean;
					grid_size?: number;
					grid_visible?: boolean;
					id?: string;
					pan_x?: number;
					pan_y?: number;
					session_id?: string;
					snap_to_grid?: boolean;
					updated_at?: string | null;
					zoom_level?: number;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_settings_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: true;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
			vtt_tokens: {
				Row: {
					color: string | null;
					created_at: string | null;
					created_by: string;
					id: string;
					image_url: string | null;
					is_warden_token: boolean;
					layer: number;
					locked: boolean;
					name: string;
					owned_by_user_id: string | null;
					rotation: number;
					session_id: string;
					size: number;
					stats: Json | null;
					token_type: string;
					updated_at: string | null;
					visible_to_players: boolean;
					x: number;
					y: number;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					created_by: string;
					id?: string;
					image_url?: string | null;
					is_warden_token?: boolean;
					layer?: number;
					locked?: boolean;
					name: string;
					owned_by_user_id?: string | null;
					rotation?: number;
					session_id: string;
					size?: number;
					stats?: Json | null;
					token_type: string;
					updated_at?: string | null;
					visible_to_players?: boolean;
					x?: number;
					y?: number;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					created_by?: string;
					id?: string;
					image_url?: string | null;
					is_warden_token?: boolean;
					layer?: number;
					locked?: boolean;
					name?: string;
					owned_by_user_id?: string | null;
					rotation?: number;
					session_id?: string;
					size?: number;
					stats?: Json | null;
					token_type?: string;
					updated_at?: string | null;
					visible_to_players?: boolean;
					x?: number;
					y?: number;
				};
				Relationships: [
					{
						foreignKeyName: "vtt_tokens_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "active_sessions";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			campaign_details: {
				Row: {
					created_at: string | null;
					description: string | null;
					dm_email: string | null;
					dm_id: string | null;
					dm_name: string | null;
					id: string | null;
					is_active: boolean | null;
					name: string | null;
					settings: Json | null;
					share_code: string | null;
					updated_at: string | null;
					warden_email: string | null;
					warden_id: string | null;
					warden_name: string | null;
				};
				Relationships: [];
			};
			user_characters: {
				Row: {
					active_sovereign_id: string | null;
					agi: number | null;
					appearance: string | null;
					armor_class: number | null;
					armor_proficiencies: string[] | null;
					background: string | null;
					backstory: string | null;
					base_class: string | null;
					condition_immunities: string[] | null;
					conditions: string[] | null;
					created_at: string | null;
					death_save_failures: number | null;
					death_save_successes: number | null;
					exhaustion_level: number | null;
					experience: number | null;
					gemini_state: Json | null;
					hit_dice_current: number | null;
					hit_dice_max: number | null;
					hit_dice_size: number | null;
					hp_current: number | null;
					hp_max: number | null;
					hp_temp: number | null;
					id: string | null;
					immunities: string[] | null;
					initiative: number | null;
					int: number | null;
					job: string | null;
					languages: string[] | null;
					level: number | null;
					monarch_overlays: string[] | null;
					name: string | null;
					notes: string | null;
					path: string | null;
					portrait_url: string | null;
					pre: number | null;
					proficiency_bonus: number | null;
					regent_overlays: string[] | null;
					resistances: string[] | null;
					rift_favor_current: number | null;
					rift_favor_die: number | null;
					rift_favor_max: number | null;
					saving_throw_proficiencies:
						| Database["public"]["Enums"]["ability_score"][]
						| null;
					sense: number | null;
					senses: string[] | null;
					shadow_energy_current: number | null;
					shadow_energy_max: number | null;
					share_token: string | null;
					skill_expertise: string[] | null;
					skill_proficiencies: string[] | null;
					sovereign_id: string | null;
					speed: number | null;
					stable: boolean | null;
					str: number | null;
					tool_proficiencies: string[] | null;
					updated_at: string | null;
					user_email: string | null;
					user_id: string | null;
					user_name: string | null;
					user_role: string | null;
					vit: number | null;
					vulnerabilities: string[] | null;
					weapon_proficiencies: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: "characters_active_sovereign_id_fkey";
						columns: ["active_sovereign_id"];
						isOneToOne: false;
						referencedRelation: "saved_sovereigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "characters_sovereign_id_fkey";
						columns: ["sovereign_id"];
						isOneToOne: false;
						referencedRelation: "compendium_sovereigns";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Functions: {
			add_campaign_session_log: {
				Args: {
					p_campaign_id: string;
					p_content?: string;
					p_is_player_visible?: boolean;
					p_log_type?: string;
					p_metadata?: Json;
					p_session_id?: string;
					p_title?: string;
				};
				Returns: string;
			};
			add_ascendant_character_to_campaign: {
				Args: {
					p_campaign_id: string;
					p_character_id: string;
					p_invite_token?: string;
				};
				Returns: string;
			};
			add_player_character_to_campaign: {
				Args: {
					p_campaign_id: string;
					p_character_id: string;
					p_invite_token?: string;
				};
				Returns: string;
			};
			advance_combat_turn: {
				Args: { p_session_id: string };
				Returns: undefined;
			};
			asset_exists: { Args: { p_path: string }; Returns: boolean };
			assign_campaign_loot: {
				Args: {
					p_assigned_to_member_id?: string;
					p_campaign_id: string;
					p_encounter_id?: string;
					p_items: Json;
					p_session_id?: string;
				};
				Returns: string;
			};
			assign_campaign_relic: {
				Args: {
					p_bound_to_member_id?: string;
					p_campaign_id: string;
					p_name?: string;
					p_properties?: Json;
					p_rarity?: string;
					p_relic_id?: string;
					p_tradeable?: boolean;
					p_value_credits?: number;
				};
				Returns: string;
			};
			assign_daily_quests: {
				Args: { p_character_id: string };
				Returns: undefined;
			};
			calculate_character_hp: {
				Args: { constitution_score: number; hit_dice?: string; level: number };
				Returns: number;
			};
			calculate_proficiency_bonus: { Args: { level: number }; Returns: number };
			calculate_shadow_energy_max:
				| { Args: { character_level: number }; Returns: number }
				| { Args: { p_character_id: string }; Returns: number };
			can_manage_homebrew_content: {
				Args: { p_homebrew_id: string; p_user_id?: string };
				Returns: boolean;
			};
			can_view_homebrew_content: {
				Args: { p_homebrew_id: string; p_user_id?: string };
				Returns: boolean;
			};
			claim_quest_rewards: {
				Args: { p_character_id: string; p_quest_id: string };
				Returns: undefined;
			};
			complete_session_quest: {
				Args: { p_completion_notes?: string; p_quest_id: string };
				Returns: undefined;
			};
			create_campaign_invite: {
				Args: {
					p_campaign_id: string;
					p_expires_at?: string;
					p_invite_email?: string;
					p_max_uses?: number;
					p_role?: string;
				};
				Returns: {
					expires_at: string;
					id: string;
					invite_email: string;
					invite_url: string;
					join_code: string;
					max_uses: number;
					revoked_at: string;
					role: string;
					token: string;
					used_count: number;
				}[];
			};
			create_campaign_with_code: {
				Args: { p_description: string; p_name: string; p_warden_id: string };
				Returns: string;
			};
			create_guild_with_code: {
				Args: {
					p_campaign_id?: string;
					p_description: string;
					p_leader_user_id: string;
					p_motto: string;
					p_name: string;
				};
				Returns: string;
			};
			create_session_quest: {
				Args: {
					p_description: string;
					p_objectives?: string[];
					p_rewards: Json;
					p_session_id: string;
					p_title: string;
				};
				Returns: string;
			};
			create_vtt_audio_track: {
				Args: {
					p_loop?: boolean;
					p_name: string;
					p_session_id: string;
					p_type?: string;
					p_url: string;
					p_volume?: number;
				};
				Returns: string;
			};
			create_vtt_map_element: {
				Args: {
					p_color: string;
					p_data?: Json;
					p_element_type: string;
					p_height?: number;
					p_opacity?: number;
					p_session_id: string;
					p_stroke_width?: number;
					p_visible_to_players?: boolean;
					p_width?: number;
					p_x: number;
					p_y: number;
				};
				Returns: string;
			};
			create_vtt_token: {
				Args: {
					p_color?: string;
					p_image_url?: string;
					p_is_warden_token?: boolean;
					p_name: string;
					p_owned_by_user_id?: string;
					p_session_id: string;
					p_size?: number;
					p_stats?: Json;
					p_token_type: string;
					p_visible_to_players?: boolean;
					p_x?: number;
					p_y?: number;
				};
				Returns: string;
			};
			delete_vtt_audio_track: {
				Args: { p_session_id: string; p_track_id: string };
				Returns: undefined;
			};
			delete_vtt_map_element: {
				Args: { p_element_id: string; p_session_id: string };
				Returns: undefined;
			};
			delete_vtt_token: {
				Args: { p_session_id: string; p_token_id: string };
				Returns: undefined;
			};
			deploy_campaign_encounter: {
				Args: { p_encounter_id: string };
				Returns: string;
			};
			end_active_session: {
				Args: { p_session_id: string };
				Returns: undefined;
			};
			end_session_combat: {
				Args: { p_session_id: string };
				Returns: undefined;
			};
			enhance_art_prompt: {
				Args: {
					p_base_prompt: string;
					p_entity_type: string;
					p_style_preferences?: Json;
				};
				Returns: {
					enhanced_prompt: string;
					suggestions: string[];
					technical_params: Json;
				}[];
			};
			exec_sql: { Args: { sql_string: string }; Returns: undefined };
			export_campaign_bundle: {
				Args: { p_campaign_id: string };
				Returns: Json;
			};
			generate_campaign_join_code: {
				Args: { p_length?: number };
				Returns: string;
			};
			generate_character_share_token: {
				Args: { p_length?: number };
				Returns: string;
			};
			generate_character_share_token_for_character: {
				Args: { p_character_id: string };
				Returns: string;
			};
			generate_share_code: { Args: never; Returns: string };
			get_accessible_sourcebooks: {
				Args: { p_campaign_id?: string; p_user_id?: string };
				Returns: {
					access_type: string;
					expires_at: string;
					shared_by: string;
					sourcebook_id: string;
				}[];
			};
			get_ai_generated_content: {
				Args: {
					p_content_type?: string;
					p_entity_id: string;
					p_entity_type: string;
				};
				Returns: {
					content: Json;
					content_type: string;
					created_at: string;
					id: string;
					metadata: Json;
				}[];
			};
			get_ai_usage_stats: {
				Args: { p_date_from: string; p_date_to: string; p_user_id?: string };
				Returns: {
					avg_tokens_per_request: number;
					request_type: string;
					service_id: string;
					total_cost: number;
					total_requests: number;
					total_tokens: number;
				}[];
			};
			get_asset_paths: {
				Args: { p_entity_id: string; p_entity_type: string };
				Returns: {
					path: string;
				}[];
			};
			get_campaign_by_share_code: {
				Args: { p_share_code: string };
				Returns: {
					created_at: string;
					description: string;
					dm_id: string;
					id: string;
					is_active: boolean;
					name: string;
					settings: Json;
					share_code: string;
					updated_at: string;
				}[];
			};
			get_campaign_invite_by_token: {
				Args: { p_token: string };
				Returns: {
					campaign_description: string;
					campaign_id: string;
					campaign_name: string;
					expires_at: string;
					invite_email: string;
					join_code: string;
					max_uses: number;
					role: string;
					status: string;
					used_count: number;
				}[];
			};
			get_campaign_member_count: {
				Args: { p_campaign_id: string };
				Returns: number;
			};
			get_entity_assets: {
				Args: { p_entity_id: string; p_entity_type: string };
				Returns: {
					path: string;
					type: string;
				}[];
			};
			hash_campaign_invite_token: {
				Args: { p_token: string };
				Returns: string;
			};
			hypopg_reset: { Args: never; Returns: undefined };
			is_campaign_active: { Args: { p_campaign_id: string }; Returns: boolean };
			is_campaign_dm: {
				Args: { p_campaign_id: string; p_user_id?: string };
				Returns: boolean;
			};
			is_campaign_member: {
				Args: { p_campaign_id: string; p_user_id?: string };
				Returns: boolean;
			};
			is_campaign_system: {
				Args: { p_campaign_id: string; p_user_id?: string };
				Returns: boolean;
			};
			is_campaign_warden: {
				Args: { p_campaign_id: string; p_user_id?: string };
				Returns: boolean;
			};
			is_dm_or_admin: { Args: { p_user_id?: string }; Returns: boolean };
			is_warden_or_admin: { Args: { p_user_id?: string }; Returns: boolean };
			join_campaign_by_code: {
				Args: { p_character_id?: string; p_code: string };
				Returns: string;
			};
			join_campaign_by_id: {
				Args: { p_campaign_id: string; p_character_id?: string };
				Returns: undefined;
			};
			log_ai_usage: {
				Args: {
					p_cost?: number;
					p_metadata?: Json;
					p_request_type: string;
					p_service_id: string;
					p_tokens_used?: number;
					p_user_id?: string;
				};
				Returns: string;
			};
			log_campaign_invite_event: {
				Args: {
					p_action: string;
					p_actor_id?: string;
					p_campaign_id: string;
					p_details?: Json;
					p_invite_id: string;
				};
				Returns: undefined;
			};
			on_long_rest_assign_quests: {
				Args: { p_character_id: string };
				Returns: undefined;
			};
			prepare_search_text: { Args: { p_text: string }; Returns: string };
			record_marketplace_download: {
				Args: { p_item_id: string; p_user_id?: string };
				Returns: undefined;
			};
			redeem_campaign_invite: {
				Args: { p_character_id?: string; p_token: string };
				Returns: string;
			};
			resolve_campaign_invite: {
				Args: { p_access_key: string };
				Returns: {
					campaign_description: string;
					campaign_id: string;
					campaign_name: string;
					expires_at: string;
					invite_email: string;
					invite_id: string;
					is_exhausted: boolean;
					is_expired: boolean;
					is_revoked: boolean;
					join_code: string;
					max_uses: number;
					revoked_at: string;
					role: string;
					status: string;
					used_count: number;
				}[];
			};
			revoke_campaign_invite: {
				Args: { p_invite_id: string; p_reason?: string };
				Returns: boolean;
			};
			save_campaign_encounter: {
				Args: {
					p_campaign_id: string;
					p_description?: string;
					p_difficulty?: Json;
					p_encounter_id?: string;
					p_entries?: Json;
					p_loot?: Json;
					p_name?: string;
				};
				Returns: string;
			};
			search_compendium_jobs: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					created_at: string;
					description: string;
					id: string;
					name: string;
					rank: number;
					source_book: string;
					tags: string[];
				}[];
			};
			search_compendium_monarchs: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					created_at: string;
					description: string;
					id: string;
					name: string;
					rank: number;
					source_book: string;
					tags: string[];
					theme: string;
					title: string;
				}[];
			};
			search_compendium_monsters: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					cr: string;
					created_at: string;
					creature_type: string;
					description: string;
					id: string;
					name: string;
					rank: number;
					source_book: string;
					tags: string[];
				}[];
			};
			search_compendium_paths: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					created_at: string;
					description: string;
					id: string;
					name: string;
					rank: number;
					source_book: string;
					tags: string[];
				}[];
			};
			search_compendium_powers: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					created_at: string;
					description: string;
					id: string;
					level: string;
					name: string;
					rank: number;
					source_book: string;
					tags: string[];
				}[];
			};
			search_compendium_relics: {
				Args: { p_limit?: number; p_offset?: number; p_query: string };
				Returns: {
					created_at: string;
					description: string;
					id: string;
					name: string;
					rank: number;
					rarity: string;
					source_book: string;
					tags: string[];
				}[];
			};
			set_homebrew_content_status: {
				Args: {
					p_campaign_id?: string;
					p_homebrew_id: string;
					p_status: string;
					p_visibility_scope?: string;
				};
				Returns: string;
			};
			share_campaign_sourcebook: {
				Args: { p_campaign_id: string; p_sourcebook_id: string };
				Returns: string;
			};
			start_active_session: {
				Args: {
					p_campaign_id: string;
					p_description?: string;
					p_title: string;
				};
				Returns: string;
			};
			start_session_combat: {
				Args: { p_participants: Json; p_session_id: string };
				Returns: undefined;
			};
			store_ai_generated_content: {
				Args: {
					p_content: Json;
					p_content_type: string;
					p_entity_id: string;
					p_entity_type: string;
					p_metadata?: Json;
				};
				Returns: string;
			};
			sync_compendium_data: { Args: never; Returns: undefined };
			update_character_xp: {
				Args: {
					campaign_id?: string;
					character_id: string;
					reason?: string;
					xp_amount: number;
				};
				Returns: {
					message: string;
					new_xp_total: number;
					success: boolean;
				}[];
			};
			update_vtt_audio_settings: {
				Args: {
					p_ambient_volume?: number;
					p_master_volume?: number;
					p_music_volume?: number;
					p_session_id: string;
					p_sfx_volume?: number;
					p_voice_chat_enabled?: boolean;
					p_voice_chat_volume?: number;
				};
				Returns: undefined;
			};
			update_vtt_settings: {
				Args: {
					p_background_color?: string;
					p_background_image_url?: string;
					p_dynamic_lighting_enabled?: boolean;
					p_fog_of_war_enabled?: boolean;
					p_grid_size?: number;
					p_grid_visible?: boolean;
					p_pan_x?: number;
					p_pan_y?: number;
					p_session_id: string;
					p_snap_to_grid?: boolean;
					p_zoom_level?: number;
				};
				Returns: undefined;
			};
			update_vtt_token: {
				Args: {
					p_color?: string;
					p_image_url?: string;
					p_session_id: string;
					p_size?: number;
					p_stats?: Json;
					p_token_id: string;
					p_visible_to_players?: boolean;
					p_x?: number;
					p_y?: number;
				};
				Returns: undefined;
			};
			upsert_campaign_session: {
				Args: {
					p_campaign_id: string;
					p_description?: string;
					p_location?: string;
					p_scheduled_for?: string;
					p_session_id?: string;
					p_status?: string;
					p_title?: string;
				};
				Returns: string;
			};
			upsert_marketplace_review: {
				Args: {
					p_comment?: string;
					p_item_id: string;
					p_rating: number;
					p_user_id?: string;
				};
				Returns: string;
			};
			upsert_user_sourcebook_entitlement: {
				Args: {
					p_entitlement_type?: string;
					p_expires_at?: string;
					p_sourcebook_id: string;
					p_user_id: string;
				};
				Returns: string;
			};
			user_has_marketplace_access: {
				Args: { p_item_id: string; p_user_id?: string };
				Returns: boolean;
			};
			user_has_sourcebook_access: {
				Args: {
					p_campaign_id?: string;
					p_sourcebook_id: string;
					p_user_id?: string;
				};
				Returns: boolean;
			};
			validate_level_gate: {
				Args: {
					p_character_id: string;
					p_power_level?: number;
					p_selection_id?: string;
					p_selection_type: string;
				};
				Returns: {
					allowed: boolean;
					reason: string;
				}[];
			};
		};
		Enums: {
			ability_score: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
			rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";
			relic_tier: "dormant" | "awakened" | "resonant";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			ability_score: ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"],
			rarity: ["common", "uncommon", "rare", "very_rare", "legendary"],
			relic_tier: ["dormant", "awakened", "resonant"],
		},
	},
} as const;
