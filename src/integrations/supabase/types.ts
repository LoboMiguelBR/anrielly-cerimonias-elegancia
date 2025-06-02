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
          css_content: string | null
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
          preview_signature_url: string | null
          proposal_id: string | null
          public_slug: string | null
          public_token: string
          quote_request_id: string | null
          remaining_amount: number | null
          remaining_payment_date: string | null
          signature_data: Json | null
          signature_drawn_at: string | null
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
          css_content?: string | null
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
          preview_signature_url?: string | null
          proposal_id?: string | null
          public_slug?: string | null
          public_token?: string
          quote_request_id?: string | null
          remaining_amount?: number | null
          remaining_payment_date?: string | null
          signature_data?: Json | null
          signature_drawn_at?: string | null
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
          css_content?: string | null
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
          preview_signature_url?: string | null
          proposal_id?: string | null
          public_slug?: string | null
          public_token?: string
          quote_request_id?: string | null
          remaining_amount?: number | null
          remaining_payment_date?: string | null
          signature_data?: Json | null
          signature_drawn_at?: string | null
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
      event_participants: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          event_id: string
          id: string
          invited: boolean | null
          magic_link_token: string | null
          name: string | null
          role: Database["public"]["Enums"]["participant_role"]
          updated_at: string | null
          user_email: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          event_id: string
          id?: string
          invited?: boolean | null
          magic_link_token?: string | null
          name?: string | null
          role: Database["public"]["Enums"]["participant_role"]
          updated_at?: string | null
          user_email: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          event_id?: string
          id?: string
          invited?: boolean | null
          magic_link_token?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["participant_role"]
          updated_at?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          contract_id: string | null
          created_at: string | null
          date: string | null
          id: string
          location: string | null
          notes: string | null
          proposal_id: string | null
          quote_id: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tenant_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          proposal_id?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          proposal_id?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
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
      landing_page_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          sections: Json
          slug: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sections?: Json
          slug: string
          tenant_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sections?: Json
          slug?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      personalizacoes_ia: {
        Row: {
          atualizado_em: string | null
          contexto_cultural: string | null
          criado_em: string | null
          id: string
          incluir_aliancas: boolean | null
          incluir_votos: boolean | null
          linguagem_celebrante: string | null
          link_publico: string
          momento_especial: string | null
          observacoes_adicionais: string | null
          tags_emocao: string[] | null
          tipo_cerimonia: string | null
          tom_conversa: string | null
        }
        Insert: {
          atualizado_em?: string | null
          contexto_cultural?: string | null
          criado_em?: string | null
          id?: string
          incluir_aliancas?: boolean | null
          incluir_votos?: boolean | null
          linguagem_celebrante?: string | null
          link_publico: string
          momento_especial?: string | null
          observacoes_adicionais?: string | null
          tags_emocao?: string[] | null
          tipo_cerimonia?: string | null
          tom_conversa?: string | null
        }
        Update: {
          atualizado_em?: string | null
          contexto_cultural?: string | null
          criado_em?: string | null
          id?: string
          incluir_aliancas?: boolean | null
          incluir_votos?: boolean | null
          linguagem_celebrante?: string | null
          link_publico?: string
          momento_especial?: string | null
          observacoes_adicionais?: string | null
          tags_emocao?: string[] | null
          tipo_cerimonia?: string | null
          tom_conversa?: string | null
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
          css_content: string | null
          event_date: string | null
          event_location: string
          event_type: string
          html_content: string | null
          id: string
          notes: string | null
          payment_terms: string
          pdf_url: string | null
          public_slug: string | null
          public_token: string | null
          quote_request_id: string | null
          services: Json
          status: string | null
          template_id: string | null
          total_price: number
          updated_at: string
          validity_date: string
          version: number | null
          version_timestamp: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          css_content?: string | null
          event_date?: string | null
          event_location: string
          event_type: string
          html_content?: string | null
          id?: string
          notes?: string | null
          payment_terms: string
          pdf_url?: string | null
          public_slug?: string | null
          public_token?: string | null
          quote_request_id?: string | null
          services?: Json
          status?: string | null
          template_id?: string | null
          total_price: number
          updated_at?: string
          validity_date: string
          version?: number | null
          version_timestamp?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          css_content?: string | null
          event_date?: string | null
          event_location?: string
          event_type?: string
          html_content?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string
          pdf_url?: string | null
          public_slug?: string | null
          public_token?: string | null
          quote_request_id?: string | null
          services?: Json
          status?: string | null
          template_id?: string | null
          total_price?: number
          updated_at?: string
          validity_date?: string
          version?: number | null
          version_timestamp?: string | null
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
            referencedRelation: "proposal_template_html"
            referencedColumns: ["id"]
          },
        ]
      }
      questionarios_noivos: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          historia_gerada: string | null
          historia_processada: boolean | null
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
          historia_gerada?: string | null
          historia_processada?: boolean | null
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
          historia_gerada?: string | null
          historia_processada?: boolean | null
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
      event_status: "em_planejamento" | "contratado" | "concluido" | "cancelado"
      participant_role:
        | "noivo"
        | "noiva"
        | "cerimonialista"
        | "cliente"
        | "admin"
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
    Enums: {
      event_status: ["em_planejamento", "contratado", "concluido", "cancelado"],
      participant_role: [
        "noivo",
        "noiva",
        "cerimonialista",
        "cliente",
        "admin",
      ],
    },
  },
} as const
