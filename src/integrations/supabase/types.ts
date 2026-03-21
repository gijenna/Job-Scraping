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
          photo_url: string | null
          previous_companies: string | null
          saved_for_later: boolean | null
          slug: string
          status: Database["public"]["Enums"]["expert_status"] | null
          updated_at: string | null
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
          photo_url?: string | null
          previous_companies?: string | null
          saved_for_later?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["expert_status"] | null
          updated_at?: string | null
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
          photo_url?: string | null
          previous_companies?: string | null
          saved_for_later?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["expert_status"] | null
          updated_at?: string | null
          years_in_city?: number | null
          years_in_industry?: number | null
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
