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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body_lv: string | null
          cover_url: string | null
          excerpt_lv: string | null
          id: string
          published_at: string
          slug: string
          status: string
          tag_lv: string | null
          title_lv: string
        }
        Insert: {
          body_lv?: string | null
          cover_url?: string | null
          excerpt_lv?: string | null
          id?: string
          published_at?: string
          slug: string
          status?: string
          tag_lv?: string | null
          title_lv: string
        }
        Update: {
          body_lv?: string | null
          cover_url?: string | null
          excerpt_lv?: string | null
          id?: string
          published_at?: string
          slug?: string
          status?: string
          tag_lv?: string | null
          title_lv?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          blurb_lv: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          blurb_lv?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          blurb_lv?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description_lv: string | null
          icon: string | null
          id: string
          name_lv: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description_lv?: string | null
          icon?: string | null
          id?: string
          name_lv: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description_lv?: string | null
          icon?: string | null
          id?: string
          name_lv?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          author_id: string | null
          author_name: string | null
          created_at: string
          id: string
          lead_id: string
          note: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          lead_id: string
          note: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          gdpr_consent: boolean
          id: string
          message: string | null
          phone: string
          product_id: string | null
          product_name: string | null
          source_page: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          gdpr_consent?: boolean
          id?: string
          message?: string | null
          phone: string
          product_id?: string | null
          product_name?: string | null
          source_page?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          gdpr_consent?: boolean
          id?: string
          message?: string | null
          phone?: string
          product_id?: string | null
          product_name?: string | null
          source_page?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specs: {
        Row: {
          id: string
          label_lv: string
          product_id: string
          sort_order: number
          value: string
        }
        Insert: {
          id?: string
          label_lv: string
          product_id: string
          sort_order?: number
          value: string
        }
        Update: {
          id?: string
          label_lv?: string
          product_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accuracy: string | null
          battery_h: string | null
          brand_id: string | null
          category_id: string | null
          created_at: string
          full_desc_lv: string | null
          id: string
          industries: string[]
          ip_class: string | null
          is_active: boolean
          is_available_rent: boolean
          is_available_sale: boolean
          is_popular: boolean
          name: string
          short_desc_lv: string | null
          slug: string
          sort_order: number
          weight_kg: string | null
        }
        Insert: {
          accuracy?: string | null
          battery_h?: string | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          full_desc_lv?: string | null
          id?: string
          industries?: string[]
          ip_class?: string | null
          is_active?: boolean
          is_available_rent?: boolean
          is_available_sale?: boolean
          is_popular?: boolean
          name: string
          short_desc_lv?: string | null
          slug: string
          sort_order?: number
          weight_kg?: string | null
        }
        Update: {
          accuracy?: string | null
          battery_h?: string | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          full_desc_lv?: string | null
          id?: string
          industries?: string[]
          ip_class?: string | null
          is_active?: boolean
          is_available_rent?: boolean
          is_available_sale?: boolean
          is_popular?: boolean
          name?: string
          short_desc_lv?: string | null
          slug?: string
          sort_order?: number
          weight_kg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          author_role_lv: string | null
          company: string | null
          id: string
          industry: string | null
          is_active: boolean
          quote_lv: string
          sort_order: number
        }
        Insert: {
          author_name: string
          author_role_lv?: string | null
          company?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          quote_lv: string
          sort_order?: number
        }
        Update: {
          author_name?: string
          author_role_lv?: string | null
          company?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          quote_lv?: string
          sort_order?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          contact_address_lv: string | null
          contact_email: string | null
          contact_phone: string | null
          id: number
          notification_emails: string[]
          promo_cta_url: string | null
          promo_enabled: boolean
          promo_image_url: string | null
          promo_text_lv: string | null
          promo_title_lv: string | null
          send_lead_autoreply: boolean
          show_blog: boolean
          show_rent: boolean
          show_reviews: boolean
          updated_at: string
          working_hours_lv: string | null
        }
        Insert: {
          contact_address_lv?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          id?: number
          notification_emails?: string[]
          promo_cta_url?: string | null
          promo_enabled?: boolean
          promo_image_url?: string | null
          promo_text_lv?: string | null
          promo_title_lv?: string | null
          send_lead_autoreply?: boolean
          show_blog?: boolean
          show_rent?: boolean
          show_reviews?: boolean
          updated_at?: string
          working_hours_lv?: string | null
        }
        Update: {
          contact_address_lv?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          id?: number
          notification_emails?: string[]
          promo_cta_url?: string | null
          promo_enabled?: boolean
          promo_image_url?: string | null
          promo_text_lv?: string | null
          promo_title_lv?: string | null
          send_lead_autoreply?: boolean
          show_blog?: boolean
          show_rent?: boolean
          show_reviews?: boolean
          updated_at?: string
          working_hours_lv?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
