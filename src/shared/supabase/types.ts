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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          ai_service_mode: string | null
          context_data: Json | null
          conversation_title: string | null
          conversation_type: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_activity_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_service_mode?: string | null
          context_data?: Json | null
          conversation_title?: string | null
          conversation_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_service_mode?: string | null
          context_data?: Json | null
          conversation_title?: string | null
          conversation_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_events: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          cost_usd: number | null
          created_at: string
          data: Json | null
          error_message: string | null
          event_type: string
          id: string
          processing_time_ms: number | null
          session_id: string | null
          token_count: number | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          cost_usd?: number | null
          created_at?: string
          data?: Json | null
          error_message?: string | null
          event_type: string
          id?: string
          processing_time_ms?: number | null
          session_id?: string | null
          token_count?: number | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          cost_usd?: number | null
          created_at?: string
          data?: Json | null
          error_message?: string | null
          event_type?: string
          id?: string
          processing_time_ms?: number | null
          session_id?: string | null
          token_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          content_type: string | null
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean | null
          message_type: string
          metadata: Json | null
          parent_message_id: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          message_type: string
          metadata?: Json | null
          parent_message_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          message_type?: string
          metadata?: Json | null
          parent_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          budget_range: string | null
          client_type: string | null
          company_id: string | null
          created_at: string
          id: string
          preferred_payment_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          client_type?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          preferred_payment_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          client_type?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          preferred_payment_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      companies: {
        Row: {
          cr_number: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          email: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          location_city: string | null
          location_region: string | null
          logo_url: string | null
          name_ar: string | null
          name_en: string
          phone: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          cr_number?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          location_city?: string | null
          location_region?: string | null
          logo_url?: string | null
          name_ar?: string | null
          name_en: string
          phone?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          cr_number?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          location_city?: string | null
          location_region?: string | null
          logo_url?: string | null
          name_ar?: string | null
          name_en?: string
          phone?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          engineer_id: string
          id: string
          job_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          engineer_id: string
          id?: string
          job_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          engineer_id?: string
          id?: string
          job_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      engineer_profiles: {
        Row: {
          availability_status: string | null
          certifications: Json | null
          created_at: string
          daily_rate: number | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          portfolio_summary: string | null
          sce_license_number: string | null
          service_radius: number | null
          specializations: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          certifications?: Json | null
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          portfolio_summary?: string | null
          sce_license_number?: string | null
          service_radius?: number | null
          specializations?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          certifications?: Json | null
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          portfolio_summary?: string | null
          sce_license_number?: string | null
          service_radius?: number | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engineer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gantt_change_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          change_number: string
          cost_impact: number | null
          created_at: string
          description: string | null
          id: string
          project_id: string
          requested_at: string
          requested_by: string | null
          schedule_impact_days: number | null
          scope_changes: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          change_number: string
          cost_impact?: number | null
          created_at?: string
          description?: string | null
          id?: string
          project_id: string
          requested_at?: string
          requested_by?: string | null
          schedule_impact_days?: number | null
          scope_changes?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          change_number?: string
          cost_impact?: number | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string
          requested_at?: string
          requested_by?: string | null
          schedule_impact_days?: number | null
          scope_changes?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "gantt_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_change_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gantt_change_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gantt_dependencies: {
        Row: {
          created_at: string
          dependency_type: string | null
          from_task_id: string
          id: string
          lag_days: number | null
          to_task_id: string
        }
        Insert: {
          created_at?: string
          dependency_type?: string | null
          from_task_id: string
          id?: string
          lag_days?: number | null
          to_task_id: string
        }
        Update: {
          created_at?: string
          dependency_type?: string | null
          from_task_id?: string
          id?: string
          lag_days?: number | null
          to_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_dependencies_from_task_id_fkey"
            columns: ["from_task_id"]
            isOneToOne: false
            referencedRelation: "gantt_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_dependencies_to_task_id_fkey"
            columns: ["to_task_id"]
            isOneToOne: false
            referencedRelation: "gantt_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_projects: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string
          currency: string | null
          description: string | null
          end_date: string | null
          id: string
          is_template: boolean | null
          location: string | null
          name: string
          project_type: string | null
          start_date: string | null
          status: string | null
          template_name: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_template?: boolean | null
          location?: string | null
          name: string
          project_type?: string | null
          start_date?: string | null
          status?: string | null
          template_name?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_template?: boolean | null
          location?: string | null
          name?: string
          project_type?: string | null
          start_date?: string | null
          status?: string | null
          template_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gantt_punch_list: {
        Row: {
          completed_date: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          item_description: string
          location: string | null
          notes: string | null
          photos: Json | null
          priority: string | null
          project_id: string
          status: string | null
          task_id: string | null
          updated_at: string
          assigned_to: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          item_description: string
          location?: string | null
          notes?: string | null
          photos?: Json | null
          priority?: string | null
          project_id: string
          status?: string | null
          task_id?: string | null
          updated_at?: string
          assigned_to?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          item_description?: string
          location?: string | null
          notes?: string | null
          photos?: Json | null
          priority?: string | null
          project_id?: string
          status?: string | null
          task_id?: string | null
          updated_at?: string
          assigned_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gantt_punch_list_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "gantt_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_punch_list_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "gantt_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_punch_list_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "gantt_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_punch_list_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gantt_resources: {
        Row: {
          availability_schedule: Json | null
          contact_info: Json | null
          created_at: string
          hourly_rate: number | null
          id: string
          name: string
          project_id: string
          role: string
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          availability_schedule?: Json | null
          contact_info?: Json | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          name: string
          project_id: string
          role: string
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_schedule?: Json | null
          contact_info?: Json | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          name?: string
          project_id?: string
          role?: string
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "gantt_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_task_assignments: {
        Row: {
          assigned_hours: number | null
          created_at: string
          end_date: string | null
          id: string
          resource_id: string
          start_date: string | null
          status: string | null
          task_id: string
        }
        Insert: {
          assigned_hours?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          resource_id: string
          start_date?: string | null
          status?: string | null
          task_id: string
        }
        Update: {
          assigned_hours?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          resource_id?: string
          start_date?: string | null
          status?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "gantt_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_task_assignments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "gantt_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_tasks: {
        Row: {
          actual_cost: number | null
          actual_hours: number | null
          cost_estimate: number | null
          created_at: string
          crew_size: number | null
          description: string | null
          duration: number | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          is_critical_path: boolean | null
          is_milestone: boolean | null
          parent_id: string | null
          priority: string | null
          progress: number | null
          project_id: string
          sort_order: number | null
          start_date: string | null
          task_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          actual_hours?: number | null
          cost_estimate?: number | null
          created_at?: string
          crew_size?: number | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          parent_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id: string
          sort_order?: number | null
          start_date?: string | null
          task_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          actual_hours?: number | null
          cost_estimate?: number | null
          created_at?: string
          crew_size?: number | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          parent_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string
          sort_order?: number | null
          start_date?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "gantt_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "gantt_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_engineer_id: string | null
          budget_max: number | null
          budget_min: number | null
          category: string
          client_id: string
          created_at: string
          currency: string | null
          description: string
          documents: Json | null
          end_date: string | null
          estimated_duration: number | null
          id: string
          job_type: string | null
          location_address: string | null
          location_city: string | null
          location_coordinates: unknown | null
          location_region: string | null
          metadata: Json | null
          priority: Database["public"]["Enums"]["job_priority"] | null
          skills_required: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_engineer_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category: string
          client_id: string
          created_at?: string
          currency?: string | null
          description: string
          documents?: Json | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          job_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_coordinates?: unknown | null
          location_region?: string | null
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_engineer_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          client_id?: string
          created_at?: string
          currency?: string | null
          description?: string
          documents?: Json | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          job_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_coordinates?: unknown | null
          location_region?: string | null
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_engineer_id_fkey"
            columns: ["assigned_engineer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          file_url: string | null
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          last_seen_at: string | null
          location_city: string | null
          location_region: string | null
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          rtl_enabled: boolean | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_region?: string | null
          phone?: string | null
          preferred_language?: string | null
          role: Database["public"]["Enums"]["user_role"]
          rtl_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_region?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          rtl_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          document_url: string | null
          expires_at: string | null
          id: string
          status: Database["public"]["Enums"]["verification_status"] | null
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_url?: string | null
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      job_priority: "low" | "normal" | "high" | "emergency"
      job_status:
        | "draft"
        | "open"
        | "quoted"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      user_role: "engineer" | "client" | "enterprise" | "admin"
      verification_status: "pending" | "verified" | "rejected" | "expired"
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
      job_priority: ["low", "normal", "high", "emergency"],
      job_status: [
        "draft",
        "open",
        "quoted",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      user_role: ["engineer", "client", "enterprise", "admin"],
      verification_status: ["pending", "verified", "rejected", "expired"],
    },
  },
} as const

