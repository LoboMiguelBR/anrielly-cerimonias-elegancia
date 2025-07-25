export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advanced_automations: {
        Row: {
          actions: Json
          created_at: string
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean
          last_executed: string | null
          name: string
          trigger_conditions: Json
          updated_at: string
        }
        Insert: {
          actions: Json
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean
          last_executed?: string | null
          name: string
          trigger_conditions: Json
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean
          last_executed?: string | null
          name?: string
          trigger_conditions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      analytics_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name: string
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      automation_flows: {
        Row: {
          actions: Json
          conditions: Json | null
          created_at: string | null
          flow_name: string
          id: string
          is_active: boolean | null
          trigger_event: string
          trigger_table: string
          updated_at: string | null
        }
        Insert: {
          actions: Json
          conditions?: Json | null
          created_at?: string | null
          flow_name: string
          id?: string
          is_active?: boolean | null
          trigger_event: string
          trigger_table: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          flow_name?: string
          id?: string
          is_active?: boolean | null
          trigger_event?: string
          trigger_table?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          actions_executed: Json | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          flow_id: string | null
          id: string
          notification_sent: boolean | null
          status: string | null
          trigger_record_id: string
          trigger_table: string
        }
        Insert: {
          actions_executed?: Json | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id?: string | null
          id?: string
          notification_sent?: boolean | null
          status?: string | null
          trigger_record_id: string
          trigger_table: string
        }
        Update: {
          actions_executed?: Json | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id?: string | null
          id?: string
          notification_sent?: boolean | null
          status?: string | null
          trigger_record_id?: string
          trigger_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "automation_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_configs: {
        Row: {
          backup_status: string | null
          backup_type: string
          created_at: string
          id: string
          is_active: boolean
          last_backup: string | null
          name: string
          retention_days: number | null
          schedule_cron: string
          storage_location: string
          updated_at: string
        }
        Insert: {
          backup_status?: string | null
          backup_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_backup?: string | null
          name: string
          retention_days?: number | null
          schedule_cron: string
          storage_location: string
          updated_at?: string
        }
        Update: {
          backup_status?: string | null
          backup_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_backup?: string | null
          name?: string
          retention_days?: number | null
          schedule_cron?: string
          storage_location?: string
          updated_at?: string
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_config_id: string
          backup_size: number | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_path: string | null
          id: string
          started_at: string
          status: string
        }
        Insert: {
          backup_config_id: string
          backup_size?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          started_at?: string
          status: string
        }
        Update: {
          backup_config_id?: string
          backup_size?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_logs_backup_config_id_fkey"
            columns: ["backup_config_id"]
            isOneToOne: false
            referencedRelation: "backup_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      cache_entries: {
        Row: {
          cache_key: string
          cache_value: Json
          created_at: string | null
          expires_at: string | null
          id: string
        }
        Insert: {
          cache_key: string
          cache_value: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
        }
        Update: {
          cache_key?: string
          cache_value?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
      client_interactions: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          interaction_type: string
          scheduled_date: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_type: string
          scheduled_date?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_type?: string
          scheduled_date?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tag_relations: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_tag_relations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "client_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          address: Json | null
          anniversary_date: string | null
          birth_date: string | null
          budget_range: string | null
          client_type: string | null
          created_at: string | null
          document_number: string | null
          document_type: string | null
          email: string
          event_date: string | null
          event_location: string | null
          event_type: string
          historical_interactions: Json | null
          id: string
          message: string | null
          name: string
          origin: string | null
          partner_name: string | null
          phone: string
          preferences: Json | null
          quote_id: string | null
          referral_source: string | null
          social_media: Json | null
          status: string | null
          tags: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          anniversary_date?: string | null
          birth_date?: string | null
          budget_range?: string | null
          client_type?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email: string
          event_date?: string | null
          event_location?: string | null
          event_type: string
          historical_interactions?: Json | null
          id?: string
          message?: string | null
          name: string
          origin?: string | null
          partner_name?: string | null
          phone: string
          preferences?: Json | null
          quote_id?: string | null
          referral_source?: string | null
          social_media?: Json | null
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          anniversary_date?: string | null
          birth_date?: string | null
          budget_range?: string | null
          client_type?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string
          event_date?: string | null
          event_location?: string | null
          event_type?: string
          historical_interactions?: Json | null
          id?: string
          message?: string | null
          name?: string
          origin?: string | null
          partner_name?: string | null
          phone?: string
          preferences?: Json | null
          quote_id?: string | null
          referral_source?: string | null
          social_media?: Json | null
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
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
      custom_reports: {
        Row: {
          chart_config: Json
          created_at: string
          created_by: string | null
          description: string | null
          filters: Json
          id: string
          is_public: boolean
          name: string
          report_type: string
          updated_at: string
        }
        Insert: {
          chart_config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          name: string
          report_type: string
          updated_at?: string
        }
        Update: {
          chart_config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          name?: string
          report_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_cache: {
        Row: {
          cache_data: Json
          cache_key: string
          created_at: string
          expires_at: string
          id: string
        }
        Insert: {
          cache_data: Json
          cache_key: string
          created_at?: string
          expires_at: string
          id?: string
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          created_at?: string
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          accepted: boolean | null
          client_id: string | null
          created_at: string | null
          event_id: string
          id: string
          invited: boolean | null
          magic_link_token: string | null
          name: string | null
          participant_type: string | null
          professional_id: string | null
          role: Database["public"]["Enums"]["participant_role"]
          updated_at: string | null
          user_email: string
        }
        Insert: {
          accepted?: boolean | null
          client_id?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          invited?: boolean | null
          magic_link_token?: string | null
          name?: string | null
          participant_type?: string | null
          professional_id?: string | null
          role: Database["public"]["Enums"]["participant_role"]
          updated_at?: string | null
          user_email: string
        }
        Update: {
          accepted?: boolean | null
          client_id?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          invited?: boolean | null
          magic_link_token?: string | null
          name?: string | null
          participant_type?: string | null
          professional_id?: string | null
          role?: Database["public"]["Enums"]["participant_role"]
          updated_at?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          event_id: string
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          event_id: string
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cerimonialista_id: string | null
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
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
          cerimonialista_id?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
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
          cerimonialista_id?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
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
            foreignKeyName: "events_cerimonialista_id_fkey"
            columns: ["cerimonialista_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
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
      external_integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_active: boolean
          last_sync: string | null
          name: string
          sync_error: string | null
          sync_status: string | null
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync?: string | null
          name: string
          sync_error?: string | null
          sync_status?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync?: string | null
          name?: string
          sync_error?: string | null
          sync_status?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          type: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id?: string
          type: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          type?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          id: string
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          tenant_id: string
          transaction_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string
          transaction_date?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string
          transaction_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      integrations: {
        Row: {
          category: string
          config: Json | null
          created_at: string | null
          description: string | null
          documentation_url: string | null
          enabled: boolean | null
          features: string[] | null
          id: string
          logo_url: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          enabled?: boolean | null
          features?: string[] | null
          id?: string
          logo_url?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          enabled?: boolean | null
          features?: string[] | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      internal_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
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
          delivery_time: number | null
          document: string | null
          email: string
          id: string
          instagram: string | null
          minimum_order: number | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string
          portfolio_images: string[] | null
          price_range: string | null
          rating: number | null
          supplier_type: string | null
          tags: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          category: string
          city: string
          created_at?: string
          delivery_time?: number | null
          document?: string | null
          email: string
          id?: string
          instagram?: string | null
          minimum_order?: number | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone: string
          portfolio_images?: string[] | null
          price_range?: string | null
          rating?: number | null
          supplier_type?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          delivery_time?: number | null
          document?: string | null
          email?: string
          id?: string
          instagram?: string | null
          minimum_order?: number | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string
          portfolio_images?: string[] | null
          price_range?: string | null
          rating?: number | null
          supplier_type?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
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
          category: string | null
          created_at: string
          css_content: string | null
          description: string | null
          html_content: string
          id: string
          is_default: boolean | null
          last_used_at: string | null
          name: string
          preview_image_url: string | null
          tags: string[] | null
          updated_at: string
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          last_used_at?: string | null
          name: string
          preview_image_url?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_default?: boolean | null
          last_used_at?: string | null
          name?: string
          preview_image_url?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
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
      questionario_perguntas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          obrigatoria: boolean | null
          opcoes_resposta: Json | null
          ordem: number
          placeholder: string | null
          questionario_id: string
          secao_id: string | null
          template_pergunta_id: string | null
          texto: string
          tipo_resposta: string | null
          updated_at: string | null
          validacoes: Json | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes_resposta?: Json | null
          ordem: number
          placeholder?: string | null
          questionario_id: string
          secao_id?: string | null
          template_pergunta_id?: string | null
          texto: string
          tipo_resposta?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes_resposta?: Json | null
          ordem?: number
          placeholder?: string | null
          questionario_id?: string
          secao_id?: string | null
          template_pergunta_id?: string | null
          texto?: string
          tipo_resposta?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questionario_perguntas_questionario_id_fkey"
            columns: ["questionario_id"]
            isOneToOne: false
            referencedRelation: "questionarios_noivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionario_perguntas_secao_id_fkey"
            columns: ["secao_id"]
            isOneToOne: false
            referencedRelation: "questionario_secoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionario_perguntas_template_pergunta_id_fkey"
            columns: ["template_pergunta_id"]
            isOneToOne: false
            referencedRelation: "questionario_template_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      questionario_secoes: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          ordem: number
          questionario_id: string
          template_secao_id: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem: number
          questionario_id: string
          template_secao_id?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          questionario_id?: string
          template_secao_id?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionario_secoes_questionario_id_fkey"
            columns: ["questionario_id"]
            isOneToOne: false
            referencedRelation: "questionarios_noivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionario_secoes_template_secao_id_fkey"
            columns: ["template_secao_id"]
            isOneToOne: false
            referencedRelation: "questionario_template_secoes"
            referencedColumns: ["id"]
          },
        ]
      }
      questionario_template_perguntas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          obrigatoria: boolean | null
          opcoes_resposta: Json | null
          ordem: number
          placeholder: string | null
          secao_id: string
          template_id: string
          texto: string
          tipo_resposta: string | null
          updated_at: string | null
          validacoes: Json | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes_resposta?: Json | null
          ordem: number
          placeholder?: string | null
          secao_id: string
          template_id: string
          texto: string
          tipo_resposta?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes_resposta?: Json | null
          ordem?: number
          placeholder?: string | null
          secao_id?: string
          template_id?: string
          texto?: string
          tipo_resposta?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questionario_template_perguntas_secao_id_fkey"
            columns: ["secao_id"]
            isOneToOne: false
            referencedRelation: "questionario_template_secoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionario_template_perguntas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "questionario_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      questionario_template_secoes: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          ordem: number
          template_id: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem: number
          template_id: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          template_id?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionario_template_secoes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "questionario_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      questionario_templates: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          id: string
          is_default: boolean | null
          nome: string
          ordem: number | null
          tipo_evento: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          is_default?: boolean | null
          nome: string
          ordem?: number | null
          tipo_evento: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          is_default?: boolean | null
          nome?: string
          ordem?: number | null
          tipo_evento?: string
          updated_at?: string | null
        }
        Relationships: []
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
          nome_evento: string | null
          nome_responsavel: string
          respostas_json: Json | null
          senha_hash: string
          status: string | null
          template_id: string | null
          tipo_evento: string | null
          total_perguntas_resp: number | null
          user_id: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          historia_gerada?: string | null
          historia_processada?: boolean | null
          id?: string
          link_publico: string
          nome_evento?: string | null
          nome_responsavel: string
          respostas_json?: Json | null
          senha_hash: string
          status?: string | null
          template_id?: string | null
          tipo_evento?: string | null
          total_perguntas_resp?: number | null
          user_id?: string | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          historia_gerada?: string | null
          historia_processada?: boolean | null
          id?: string
          link_publico?: string
          nome_evento?: string | null
          nome_responsavel?: string
          respostas_json?: Json | null
          senha_hash?: string
          status?: string | null
          template_id?: string | null
          tipo_evento?: string | null
          total_perguntas_resp?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionarios_noivos_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "questionario_templates"
            referencedColumns: ["id"]
          },
        ]
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
          origin: string | null
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
          origin?: string | null
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
          origin?: string | null
          phone?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_followups: {
        Row: {
          created_at: string | null
          error_message: string | null
          followup_type: string
          id: string
          max_retries: number | null
          record_id: string
          record_table: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
          template_data: Json | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          followup_type: string
          id?: string
          max_retries?: number | null
          record_id: string
          record_table: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          template_data?: Json | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          followup_type?: string
          id?: string
          max_retries?: number | null
          record_id?: string
          record_table?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          template_data?: Json | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_reviews: {
        Row: {
          client_id: string | null
          comment: string | null
          created_at: string | null
          event_id: string | null
          id: string
          punctuality: number | null
          rating: number | null
          service_quality: number | null
          supplier_id: string | null
          updated_at: string | null
          value_for_money: number | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          punctuality?: number | null
          rating?: number | null
          service_quality?: number | null
          supplier_id?: string | null
          updated_at?: string | null
          value_for_money?: number | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          punctuality?: number | null
          rating?: number | null
          service_quality?: number | null
          supplier_id?: string | null
          updated_at?: string | null
          value_for_money?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: Json | null
          category: string
          contracts: Json | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          instagram: string | null
          name: string
          phone: string
          portfolio_images: string[] | null
          preferred: boolean | null
          price_range: string | null
          rating: number | null
          tags: string[] | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          category: string
          contracts?: Json | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          instagram?: string | null
          name: string
          phone: string
          portfolio_images?: string[] | null
          preferred?: boolean | null
          price_range?: string | null
          rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          category?: string
          contracts?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          instagram?: string | null
          name?: string
          phone?: string
          portfolio_images?: string[] | null
          preferred?: boolean | null
          price_range?: string | null
          rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      template_approvals: {
        Row: {
          approval_notes: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          template_id: string
          version_id: string | null
        }
        Insert: {
          approval_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          template_id: string
          version_id?: string | null
        }
        Update: {
          approval_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          template_id?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_approvals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_template_html"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_approvals_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "template_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      template_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          rating: number | null
          template_id: string
          usage_context: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          template_id: string
          usage_context?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          template_id?: string
          usage_context?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_feedback_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_template_html"
            referencedColumns: ["id"]
          },
        ]
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
      template_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          css_content: string | null
          html_content: string
          id: string
          template_id: string
          variables: Json | null
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          css_content?: string | null
          html_content: string
          id?: string
          template_id: string
          variables?: Json | null
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          css_content?: string | null
          html_content?: string
          id?: string
          template_id?: string
          variables?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_template_html"
            referencedColumns: ["id"]
          },
        ]
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
      webhook_configs: {
        Row: {
          created_at: string
          events: string[]
          headers: Json | null
          id: string
          is_active: boolean
          name: string
          retry_attempts: number | null
          secret_key: string | null
          timeout_seconds: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          events: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name: string
          retry_attempts?: number | null
          secret_key?: string | null
          timeout_seconds?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          retry_attempts?: number | null
          secret_key?: string | null
          timeout_seconds?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempt_number: number | null
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          sent_at: string | null
          success: boolean | null
          webhook_config_id: string
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          sent_at?: string | null
          success?: boolean | null
          webhook_config_id: string
        }
        Update: {
          attempt_number?: number | null
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          sent_at?: string | null
          success?: boolean | null
          webhook_config_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_integration_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_automation_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_automation_flow: {
        Args: {
          p_trigger_table: string
          p_trigger_event: string
          p_record_id: string
          p_old_record?: Json
          p_new_record?: Json
        }
        Returns: undefined
      }
      generate_custom_report: {
        Args: {
          p_report_type: string
          p_filters?: Json
          p_date_from?: string
          p_date_to?: string
        }
        Returns: Json
      }
      get_section_template: {
        Args: { section_type_param: string }
        Returns: {
          html_template: string
          default_variables: Json
        }[]
      }
      get_sections_with_html: {
        Args: { page_id_param: string }
        Returns: {
          id: string
          section_type: string
          title: string
          content: Json
          html_template: string
          variables: Json
          is_active: boolean
          order_index: number
        }[]
      }
      link_questionnaire_to_flow: {
        Args: {
          p_client_email: string
          p_client_name: string
          p_event_type: string
          p_template_id?: string
        }
        Returns: string
      }
      trigger_webhooks: {
        Args: { p_event_type: string; p_payload: Json }
        Returns: undefined
      }
      update_section_html: {
        Args: {
          section_id_param: string
          html_template_param: string
          variables_param: Json
        }
        Returns: undefined
      }
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
