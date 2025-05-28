export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contract_email_templates: {
        Row: {
          created_at: string
          description: string | null
          html_content: string
          id: string
          is_default: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          is_default?: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          created_at: string
          css_content: string | null
          description: string | null
          html_content: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          civil_status: string | null
          client_address: string | null
          client_email: string
          client_name: string
          client_phone: string
          client_profession: string | null
          created_at: string
          down_payment: number | null
          down_payment_date: string | null
          event_date: string | null
          event_location: string | null
          event_time: string | null
          event_type: string
          html_content: string | null
          id: string
          ip_address: string | null
          notes: string | null
          pdf_url: string | null
          proposal_id: string | null
          public_token: string
          quote_request_id: string | null
          remaining_amount: number | null
          remaining_payment_date: string | null
          signature_data: Json | null
          signed_at: string | null
          signer_ip: string | null
          status: string
          template_id: string | null
          token: string
          total_price: number
          updated_at: string
          user_agent: string | null
          version: number
          version_timestamp: string | null
        }
        Insert: {
          civil_status?: string | null
          client_address?: string | null
          client_email: string
          client_name: string
          client_phone: string
          client_profession?: string | null
          created_at?: string
          down_payment?: number | null
          down_payment_date?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time?: string | null
          event_type: string
          html_content?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          pdf_url?: string | null
          proposal_id?: string | null
          public_token?: string
          quote_request_id?: string | null
          remaining_amount?: number | null
          remaining_payment_date?: string | null
          signature_data?: Json | null
          signed_at?: string | null
          signer_ip?: string | null
          status?: string
          template_id?: string | null
          token?: string
          total_price: number
          updated_at?: string
          user_agent?: string | null
          version?: number
          version_timestamp?: string | null
        }
        Update: {
          civil_status?: string | null
          client_address?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string
          client_profession?: string | null
          created_at?: string
          down_payment?: number | null
          down_payment_date?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time?: string | null
          event_type?: string
          html_content?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          pdf_url?: string | null
          proposal_id?: string | null
          public_token?: string
          quote_request_id?: string | null
          remaining_amount?: number | null
          remaining_payment_date?: string | null
          signature_data?: Json | null
          signed_at?: string | null
          signer_ip?: string | null
          status?: string
          template_id?: string | null
          token?: string
          total_price?: number
          updated_at?: string
          user_agent?: string | null
          version?: number
          version_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          category: string
          city: string
          created_at: string
          document: string | null
          email: string
          id: string
          instagram: string | null
          name: string
          notes: string | null
          phone: string
          tags: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          category: string
          city: string
          created_at?: string
          document?: string | null
          email: string
          id?: string
          instagram?: string | null
          name: string
          notes?: string | null
          phone: string
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          document?: string | null
          email?: string
          id?: string
          instagram?: string | null
          name?: string
          notes?: string | null
          phone?: string
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      proposal_assets: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposal_template_html: {
        Row: {
          created_at: string
          css_content: string | null
          description: string | null
          html_content: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      proposal_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          event_date: string | null
          event_location: string
          event_type: string
          id: string
          notes: string | null
          payment_terms: string
          pdf_url: string | null
          quote_request_id: string | null
          services: Json
          status: string | null
          template_id: string | null
          total_price: number
          updated_at: string
          validity_date: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          event_date?: string | null
          event_location: string
          event_type: string
          id?: string
          notes?: string | null
          payment_terms: string
          pdf_url?: string | null
          quote_request_id?: string | null
          services?: Json
          status?: string | null
          template_id?: string | null
          total_price: number
          updated_at?: string
          validity_date: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          notes?: string | null
          payment_terms?: string
          pdf_url?: string | null
          quote_request_id?: string | null
          services?: Json
          status?: string | null
          template_id?: string | null
          total_price?: number
          updated_at?: string
          validity_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      questionarios_noivos: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          id: string
          link_publico: string
          nome_responsavel: string
          respostas_json: Json | null
          senha_hash: string
          status: string | null
          total_perguntas_resp: number | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          id?: string
          link_publico: string
          nome_responsavel: string
          respostas_json?: Json | null
          senha_hash: string
          status?: string | null
          total_perguntas_resp?: number | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          id?: string
          link_publico?: string
          nome_responsavel?: string
          respostas_json?: Json | null
          senha_hash?: string
          status?: string | null
          total_perguntas_resp?: number | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          created_at: string
          email: string
          event_date: string | null
          event_location: string
          event_type: string
          id: string
          message: string | null
          name: string
          phone: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_date?: string | null
          event_location: string
          event_type: string
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      template_sections: {
        Row: {
          created_at: string
          description: string | null
          html_content: string
          id: string
          name: string
          section_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          name: string
          section_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          name?: string
          section_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          email: string
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          quote: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          quote: string
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          quote?: string
          role?: string
          status?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
