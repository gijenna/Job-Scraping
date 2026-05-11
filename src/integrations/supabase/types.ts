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
      admin_action_log: {
        Row: {
          action: string
          actor_email: string
          created_at: string
          id: string
          payload: Json | null
        }
        Insert: {
          action: string
          actor_email: string
          created_at?: string
          id?: string
          payload?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string
          created_at?: string
          id?: string
          payload?: Json | null
        }
        Relationships: []
      }
      afterparty_attendees: {
        Row: {
          attendee_number: number
          audience_size: string | null
          auth_user_id: string | null
          brand_fit_notes: string | null
          brand_seeking: string[] | null
          brands_wishlist: string | null
          budget_range: string | null
          cartoon_url: string | null
          company: string | null
          company_role: string | null
          company_url: string | null
          created_at: string
          creator_types: string[] | null
          email: string | null
          email_verified: boolean
          full_name: string
          id: string
          invited_by: string | null
          looking_for: string[] | null
          mind_blowing_fact: string | null
          niches: string[] | null
          phone: string | null
          photo_url: string | null
          pin_attempts: number
          pin_expires_at: string | null
          pin_hash: string | null
          pin_locked_until: string | null
          platforms: string[] | null
          public_listing: boolean
          role: string
          show_instagram: boolean
          show_linkedin: boolean
          slug: string
          slug_opened_at: string | null
          social_links: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          attendee_number?: number
          audience_size?: string | null
          auth_user_id?: string | null
          brand_fit_notes?: string | null
          brand_seeking?: string[] | null
          brands_wishlist?: string | null
          budget_range?: string | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string
          creator_types?: string[] | null
          email?: string | null
          email_verified?: boolean
          full_name: string
          id?: string
          invited_by?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          phone?: string | null
          photo_url?: string | null
          pin_attempts?: number
          pin_expires_at?: string | null
          pin_hash?: string | null
          pin_locked_until?: string | null
          platforms?: string[] | null
          public_listing?: boolean
          role: string
          show_instagram?: boolean
          show_linkedin?: boolean
          slug: string
          slug_opened_at?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          attendee_number?: number
          audience_size?: string | null
          auth_user_id?: string | null
          brand_fit_notes?: string | null
          brand_seeking?: string[] | null
          brands_wishlist?: string | null
          budget_range?: string | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string
          creator_types?: string[] | null
          email?: string | null
          email_verified?: boolean
          full_name?: string
          id?: string
          invited_by?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          phone?: string | null
          photo_url?: string | null
          pin_attempts?: number
          pin_expires_at?: string | null
          pin_hash?: string | null
          pin_locked_until?: string | null
          platforms?: string[] | null
          public_listing?: boolean
          role?: string
          show_instagram?: boolean
          show_linkedin?: boolean
          slug?: string
          slug_opened_at?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      afterparty_interest: {
        Row: {
          attendee_type: string
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          reason: string
          reviewed_at: string | null
          role_title: string
          status: string
        }
        Insert: {
          attendee_type: string
          company: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          reason: string
          reviewed_at?: string | null
          role_title: string
          status?: string
        }
        Update: {
          attendee_type?: string
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          reason?: string
          reviewed_at?: string | null
          role_title?: string
          status?: string
        }
        Relationships: []
      }
      afterparty_matches: {
        Row: {
          attendee_id: string
          generated_at: string
          id: string
          is_mutual_boost: boolean
          locked: boolean
          match_attendee_id: string
          rank: number | null
          reasons: string[] | null
          score: number
        }
        Insert: {
          attendee_id: string
          generated_at?: string
          id?: string
          is_mutual_boost?: boolean
          locked?: boolean
          match_attendee_id: string
          rank?: number | null
          reasons?: string[] | null
          score?: number
        }
        Update: {
          attendee_id?: string
          generated_at?: string
          id?: string
          is_mutual_boost?: boolean
          locked?: boolean
          match_attendee_id?: string
          rank?: number | null
          reasons?: string[] | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "afterparty_matches_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_matches_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_matches_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_guest_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_matches_match_attendee_id_fkey"
            columns: ["match_attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_matches_match_attendee_id_fkey"
            columns: ["match_attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_matches_match_attendee_id_fkey"
            columns: ["match_attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_guest_list"
            referencedColumns: ["id"]
          },
        ]
      }
      afterparty_partners: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      afterparty_spotlights: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      afterparty_suggestions: {
        Row: {
          attendee_id: string | null
          attendee_name: string | null
          created_at: string
          id: string
          kind: string
          reviewed_at: string | null
          status: string
          value: string
        }
        Insert: {
          attendee_id?: string | null
          attendee_name?: string | null
          created_at?: string
          id?: string
          kind: string
          reviewed_at?: string | null
          status?: string
          value: string
        }
        Update: {
          attendee_id?: string | null
          attendee_name?: string | null
          created_at?: string
          id?: string
          kind?: string
          reviewed_at?: string | null
          status?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "afterparty_suggestions_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_suggestions_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afterparty_suggestions_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_guest_list"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_activation_requests: {
        Row: {
          attendee_id: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          message: string | null
          reviewed_at: string | null
          status: string
        }
        Insert: {
          attendee_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          attendee_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_activation_requests_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_activation_requests_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_attendees_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_activation_requests_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "afterparty_guest_list"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_lead_responses: {
        Row: {
          brand_id: string
          candidate_id: string
          created_at: string
          id: string
          question_text: string
          response_label: string | null
          response_value: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          candidate_id: string
          created_at?: string
          id?: string
          question_text: string
          response_label?: string | null
          response_value: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          candidate_id?: string
          created_at?: string
          id?: string
          question_text?: string
          response_label?: string | null
          response_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      brand_starred_attendee: {
        Row: {
          brand_id: string
          candidate_id: string
          created_at: string
          id: string
        }
        Insert: {
          brand_id: string
          candidate_id: string
          created_at?: string
          id?: string
        }
        Update: {
          brand_id?: string
          candidate_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_starred_attendee_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "event_map_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_starred_attendee_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_starred_brands: {
        Row: {
          brand_id: string
          candidate_id: string
          created_at: string
          id: string
        }
        Insert: {
          brand_id: string
          candidate_id: string
          created_at?: string
          id?: string
        }
        Update: {
          brand_id?: string
          candidate_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_starred_brands_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "event_map_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_starred_brands_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          areas_of_expertise: string[] | null
          career_stage: string | null
          created_at: string
          current_company: string | null
          current_location: string | null
          current_title: string | null
          data_portability_consent: boolean
          dei_disability: string | null
          dei_gender: string | null
          dei_lgbtq: string | null
          dei_race_ethnicity: string[] | null
          dei_veteran: string | null
          dream_companies: Json | null
          dream_role_title: string | null
          email: string
          field: string | null
          field_other: string | null
          first_name: string
          focus: string | null
          has_seen_map_intro: boolean
          id: string
          job_types_seeking: string[] | null
          last_name: string
          linkedin_url: string | null
          management_experience: boolean | null
          management_years: number | null
          min_pay_rate: string | null
          niche_experience: Json | null
          open_to_relocation: boolean | null
          open_to_retail: boolean | null
          outdoor_industry_experience: boolean | null
          outdoor_industry_years: number | null
          phone: string
          phone_last_four: string | null
          photo_url: string | null
          poachable_status: string | null
          portfolio_url: string | null
          prior_careers: Json | null
          profile_completeness_score: number | null
          relocation_locations: string | null
          remote_preference: string | null
          resume_url: string | null
          signup_mode: string | null
          the_hook: string | null
          the_pitch: string | null
          total_years_professional: number | null
          updated_at: string
          workplace_type_preference: string[] | null
          years_in_current_field: number | null
        }
        Insert: {
          areas_of_expertise?: string[] | null
          career_stage?: string | null
          created_at?: string
          current_company?: string | null
          current_location?: string | null
          current_title?: string | null
          data_portability_consent?: boolean
          dei_disability?: string | null
          dei_gender?: string | null
          dei_lgbtq?: string | null
          dei_race_ethnicity?: string[] | null
          dei_veteran?: string | null
          dream_companies?: Json | null
          dream_role_title?: string | null
          email: string
          field?: string | null
          field_other?: string | null
          first_name: string
          focus?: string | null
          has_seen_map_intro?: boolean
          id?: string
          job_types_seeking?: string[] | null
          last_name: string
          linkedin_url?: string | null
          management_experience?: boolean | null
          management_years?: number | null
          min_pay_rate?: string | null
          niche_experience?: Json | null
          open_to_relocation?: boolean | null
          open_to_retail?: boolean | null
          outdoor_industry_experience?: boolean | null
          outdoor_industry_years?: number | null
          phone: string
          phone_last_four?: string | null
          photo_url?: string | null
          poachable_status?: string | null
          portfolio_url?: string | null
          prior_careers?: Json | null
          profile_completeness_score?: number | null
          relocation_locations?: string | null
          remote_preference?: string | null
          resume_url?: string | null
          signup_mode?: string | null
          the_hook?: string | null
          the_pitch?: string | null
          total_years_professional?: number | null
          updated_at?: string
          workplace_type_preference?: string[] | null
          years_in_current_field?: number | null
        }
        Update: {
          areas_of_expertise?: string[] | null
          career_stage?: string | null
          created_at?: string
          current_company?: string | null
          current_location?: string | null
          current_title?: string | null
          data_portability_consent?: boolean
          dei_disability?: string | null
          dei_gender?: string | null
          dei_lgbtq?: string | null
          dei_race_ethnicity?: string[] | null
          dei_veteran?: string | null
          dream_companies?: Json | null
          dream_role_title?: string | null
          email?: string
          field?: string | null
          field_other?: string | null
          first_name?: string
          focus?: string | null
          has_seen_map_intro?: boolean
          id?: string
          job_types_seeking?: string[] | null
          last_name?: string
          linkedin_url?: string | null
          management_experience?: boolean | null
          management_years?: number | null
          min_pay_rate?: string | null
          niche_experience?: Json | null
          open_to_relocation?: boolean | null
          open_to_retail?: boolean | null
          outdoor_industry_experience?: boolean | null
          outdoor_industry_years?: number | null
          phone?: string
          phone_last_four?: string | null
          photo_url?: string | null
          poachable_status?: string | null
          portfolio_url?: string | null
          prior_careers?: Json | null
          profile_completeness_score?: number | null
          relocation_locations?: string | null
          remote_preference?: string | null
          resume_url?: string | null
          signup_mode?: string | null
          the_hook?: string | null
          the_pitch?: string | null
          total_years_professional?: number | null
          updated_at?: string
          workplace_type_preference?: string[] | null
          years_in_current_field?: number | null
        }
        Relationships: []
      }
      connect_notes: {
        Row: {
          brand_id: string | null
          candidate_id: string
          created_at: string
          id: string
          is_active: boolean
          message: string
          note_cta: string | null
          note_timing: string
          recipient_id: string
          recipient_type: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          candidate_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          message: string
          note_cta?: string | null
          note_timing: string
          recipient_id: string
          recipient_type: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          candidate_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          note_cta?: string | null
          note_timing?: string
          recipient_id?: string
          recipient_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          brand_id: string | null
          brand_rep_id: string | null
          candidate_id: string
          contact_info_received: string | null
          created_at: string
          expert_id: string | null
          follow_up_direction: string | null
          id: string
          mentor_topics: string | null
          message_sent_at: string | null
          message_to_brand: string | null
          private_notes: string | null
          role_flagged: string | null
          updated_at: string
          would_want_as_mentor: boolean | null
        }
        Insert: {
          brand_id?: string | null
          brand_rep_id?: string | null
          candidate_id: string
          contact_info_received?: string | null
          created_at?: string
          expert_id?: string | null
          follow_up_direction?: string | null
          id?: string
          mentor_topics?: string | null
          message_sent_at?: string | null
          message_to_brand?: string | null
          private_notes?: string | null
          role_flagged?: string | null
          updated_at?: string
          would_want_as_mentor?: boolean | null
        }
        Update: {
          brand_id?: string | null
          brand_rep_id?: string | null
          candidate_id?: string
          contact_info_received?: string | null
          created_at?: string
          expert_id?: string | null
          follow_up_direction?: string | null
          id?: string
          mentor_topics?: string | null
          message_sent_at?: string | null
          message_to_brand?: string | null
          private_notes?: string | null
          role_flagged?: string | null
          updated_at?: string
          would_want_as_mentor?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "event_map_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_brand_rep_id_fkey"
            columns: ["brand_rep_id"]
            isOneToOne: false
            referencedRelation: "industry_experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "industry_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_template_versions: {
        Row: {
          body: string | null
          created_at: string
          id: string
          subject: string | null
          template_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          subject?: string | null
          template_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          subject?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string | null
          id: string
          preview_text: string | null
          subject: string | null
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string | null
          id?: string
          preview_text?: string | null
          subject?: string | null
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string | null
          id?: string
          preview_text?: string | null
          subject?: string | null
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      event_logos: {
        Row: {
          created_at: string
          display_order: number
          domain: string | null
          event_slug: string
          id: string
          logo_url: string | null
          name: string
          url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          domain?: string | null
          event_slug: string
          id?: string
          logo_url?: string | null
          name: string
          url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          domain?: string | null
          event_slug?: string
          id?: string
          logo_url?: string | null
          name?: string
          url?: string | null
        }
        Relationships: []
      }
      event_map_brands: {
        Row: {
          aliases: string[]
          created_at: string
          culture_blurb: string | null
          currently_hiring: string | null
          description: string | null
          event_slug: string
          id: string
          is_activation: boolean
          is_featured: boolean
          lead_capture_visible_to_brand: boolean
          lead_question_active: boolean
          lead_question_intro: string | null
          lead_question_option_1: string | null
          lead_question_option_2: string | null
          lead_question_option_3: string | null
          lead_question_text: string | null
          logo_url: string | null
          name: string
          offers_remote: string | null
          sponsor_brand_id: string | null
          sponsor_callout_text: string | null
          table_count: number
          website_url: string | null
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          culture_blurb?: string | null
          currently_hiring?: string | null
          description?: string | null
          event_slug?: string
          id?: string
          is_activation?: boolean
          is_featured?: boolean
          lead_capture_visible_to_brand?: boolean
          lead_question_active?: boolean
          lead_question_intro?: string | null
          lead_question_option_1?: string | null
          lead_question_option_2?: string | null
          lead_question_option_3?: string | null
          lead_question_text?: string | null
          logo_url?: string | null
          name: string
          offers_remote?: string | null
          sponsor_brand_id?: string | null
          sponsor_callout_text?: string | null
          table_count?: number
          website_url?: string | null
        }
        Update: {
          aliases?: string[]
          created_at?: string
          culture_blurb?: string | null
          currently_hiring?: string | null
          description?: string | null
          event_slug?: string
          id?: string
          is_activation?: boolean
          is_featured?: boolean
          lead_capture_visible_to_brand?: boolean
          lead_question_active?: boolean
          lead_question_intro?: string | null
          lead_question_option_1?: string | null
          lead_question_option_2?: string | null
          lead_question_option_3?: string | null
          lead_question_text?: string | null
          logo_url?: string | null
          name?: string
          offers_remote?: string | null
          sponsor_brand_id?: string | null
          sponsor_callout_text?: string | null
          table_count?: number
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_map_brands_sponsor_brand_id_fkey"
            columns: ["sponsor_brand_id"]
            isOneToOne: false
            referencedRelation: "event_map_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      event_map_layouts: {
        Row: {
          brand_id: string
          event_slug: string
          id: string
          layout_type: string
          rotation: number
          shape: string
          updated_at: string
          x: number
          y: number
        }
        Insert: {
          brand_id: string
          event_slug?: string
          id?: string
          layout_type?: string
          rotation?: number
          shape?: string
          updated_at?: string
          x?: number
          y?: number
        }
        Update: {
          brand_id?: string
          event_slug?: string
          id?: string
          layout_type?: string
          rotation?: number
          shape?: string
          updated_at?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_map_layouts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "event_map_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          created_at: string
          event_slug: string
          id: string
          setting_key: string
          setting_value: string
        }
        Insert: {
          created_at?: string
          event_slug: string
          id?: string
          setting_key: string
          setting_value: string
        }
        Update: {
          created_at?: string
          event_slug?: string
          id?: string
          setting_key?: string
          setting_value?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cost: number | null
          created_at: string | null
          created_by: string | null
          date: string
          end_date: string | null
          id: string
          location: string | null
          photo_url: string | null
          registration_link: string
          title: string
          type: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          date: string
          end_date?: string | null
          id?: string
          location?: string | null
          photo_url?: string | null
          registration_link: string
          title: string
          type: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          end_date?: string | null
          id?: string
          location?: string | null
          photo_url?: string | null
          registration_link?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      expert_cities: {
        Row: {
          active: boolean | null
          arrival_time: string | null
          branding_color: string | null
          created_at: string | null
          event_date: string | null
          event_location: string | null
          event_time_details: string | null
          event_title: string
          hero_image_url: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean | null
          arrival_time?: string | null
          branding_color?: string | null
          created_at?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time_details?: string | null
          event_title: string
          hero_image_url?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          active?: boolean | null
          arrival_time?: string | null
          branding_color?: string | null
          created_at?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time_details?: string | null
          event_title?: string
          hero_image_url?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      expert_city_assignments: {
        Row: {
          card_version: Json | null
          city_slug: string
          created_at: string | null
          display_order: number | null
          expert_id: string
          expert_type: string
          id: string
          published: boolean | null
          share_reminder_sent: boolean | null
        }
        Insert: {
          card_version?: Json | null
          city_slug: string
          created_at?: string | null
          display_order?: number | null
          expert_id: string
          expert_type?: string
          id?: string
          published?: boolean | null
          share_reminder_sent?: boolean | null
        }
        Update: {
          card_version?: Json | null
          city_slug?: string
          created_at?: string | null
          display_order?: number | null
          expert_id?: string
          expert_type?: string
          id?: string
          published?: boolean | null
          share_reminder_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_city_assignments_city_slug_fkey"
            columns: ["city_slug"]
            isOneToOne: false
            referencedRelation: "expert_cities"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "expert_city_assignments_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "industry_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_questions: {
        Row: {
          admin_answer: string | null
          city_slug: string | null
          created_at: string | null
          expert_id: string | null
          expert_name: string | null
          id: string
          question_text: string
          show_in_faq: boolean | null
        }
        Insert: {
          admin_answer?: string | null
          city_slug?: string | null
          created_at?: string | null
          expert_id?: string | null
          expert_name?: string | null
          id?: string
          question_text: string
          show_in_faq?: boolean | null
        }
        Update: {
          admin_answer?: string | null
          city_slug?: string | null
          created_at?: string | null
          expert_id?: string | null
          expert_name?: string | null
          id?: string
          question_text?: string
          show_in_faq?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_questions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "industry_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_logs: {
        Row: {
          brand_rep_id: string | null
          created_at: string
          filters_applied: Json | null
          id: string
          keyword_search: string | null
          results_count: number | null
          wishlist_query: string | null
        }
        Insert: {
          brand_rep_id?: string | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          keyword_search?: string | null
          results_count?: number | null
          wishlist_query?: string | null
        }
        Update: {
          brand_rep_id?: string | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          keyword_search?: string | null
          results_count?: number | null
          wishlist_query?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filter_logs_brand_rep_id_fkey"
            columns: ["brand_rep_id"]
            isOneToOne: false
            referencedRelation: "industry_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_experts: {
        Row: {
          ask_me_about: string | null
          company_domains: Json | null
          created_at: string | null
          created_by: string | null
          current_company: string | null
          email: string | null
          favorite_media: string | null
          field_of_work: string | null
          full_name: string
          id: string
          job_title: string | null
          linkedin_url: string | null
          niche_interests: string[] | null
          phone: string | null
          phone_last_four: string | null
          photo_url: string | null
          previous_companies: string | null
          saved_for_later: boolean | null
          slug: string
          status: Database["public"]["Enums"]["expert_status"] | null
          updated_at: string | null
          welcome_email_sent_at: string | null
          years_in_city: number | null
          years_in_industry: number | null
        }
        Insert: {
          ask_me_about?: string | null
          company_domains?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_company?: string | null
          email?: string | null
          favorite_media?: string | null
          field_of_work?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          niche_interests?: string[] | null
          phone?: string | null
          phone_last_four?: string | null
          photo_url?: string | null
          previous_companies?: string | null
          saved_for_later?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["expert_status"] | null
          updated_at?: string | null
          welcome_email_sent_at?: string | null
          years_in_city?: number | null
          years_in_industry?: number | null
        }
        Update: {
          ask_me_about?: string | null
          company_domains?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_company?: string | null
          email?: string | null
          favorite_media?: string | null
          field_of_work?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          niche_interests?: string[] | null
          phone?: string | null
          phone_last_four?: string | null
          photo_url?: string | null
          previous_companies?: string | null
          saved_for_later?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["expert_status"] | null
          updated_at?: string | null
          welcome_email_sent_at?: string | null
          years_in_city?: number | null
          years_in_industry?: number | null
        }
        Relationships: []
      }
      link_clicks: {
        Row: {
          created_at: string
          id: string
          link_text: string | null
          link_url: string
          page_path: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          link_text?: string | null
          link_url: string
          page_path: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          link_text?: string | null
          link_url?: string
          page_path?: string
          session_id?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          last_seen_at: string
          subject_id: string
          subject_type: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          last_seen_at?: string
          subject_id: string
          subject_type: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          last_seen_at?: string
          subject_id?: string
          subject_type?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      afterparty_attendees_public: {
        Row: {
          attendee_number: number | null
          audience_size: string | null
          brand_fit_notes: string | null
          brand_seeking: string[] | null
          brands_wishlist: string | null
          budget_range: string | null
          cartoon_url: string | null
          company: string | null
          company_role: string | null
          company_url: string | null
          created_at: string | null
          creator_types: string[] | null
          full_name: string | null
          id: string | null
          invited_by: string | null
          looking_for: string[] | null
          mind_blowing_fact: string | null
          niches: string[] | null
          photo_url: string | null
          platforms: string[] | null
          role: string | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          slug: string | null
          social_links: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attendee_number?: number | null
          audience_size?: string | null
          brand_fit_notes?: string | null
          brand_seeking?: string[] | null
          brands_wishlist?: string | null
          budget_range?: string | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string | null
          creator_types?: string[] | null
          full_name?: string | null
          id?: string | null
          invited_by?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          photo_url?: string | null
          platforms?: string[] | null
          role?: string | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          slug?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attendee_number?: number | null
          audience_size?: string | null
          brand_fit_notes?: string | null
          brand_seeking?: string[] | null
          brands_wishlist?: string | null
          budget_range?: string | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string | null
          creator_types?: string[] | null
          full_name?: string | null
          id?: string | null
          invited_by?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          photo_url?: string | null
          platforms?: string[] | null
          role?: string | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          slug?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      afterparty_guest_list: {
        Row: {
          attendee_number: number | null
          cartoon_url: string | null
          company: string | null
          company_role: string | null
          company_url: string | null
          created_at: string | null
          creator_types: string[] | null
          display_name: string | null
          id: string | null
          looking_for: string[] | null
          mind_blowing_fact: string | null
          niches: string[] | null
          role: string | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          social_links: Json | null
        }
        Insert: {
          attendee_number?: number | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string | null
          creator_types?: string[] | null
          display_name?: never
          id?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          role?: string | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          social_links?: Json | null
        }
        Update: {
          attendee_number?: number | null
          cartoon_url?: string | null
          company?: string | null
          company_role?: string | null
          company_url?: string | null
          created_at?: string | null
          creator_types?: string[] | null
          display_name?: never
          id?: string | null
          looking_for?: string[] | null
          mind_blowing_fact?: string | null
          niches?: string[] | null
          role?: string | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          social_links?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      expert_status: "invited" | "viewed" | "started" | "confirmed"
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
      expert_status: ["invited", "viewed", "started", "confirmed"],
    },
  },
} as const
