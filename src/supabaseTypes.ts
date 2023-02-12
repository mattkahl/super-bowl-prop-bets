export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cache: {
        Row: {
          answers: Json
          id: number
          submissions: Json
        }
        Insert: {
          answers: Json
          id?: number
          submissions: Json
        }
        Update: {
          answers?: Json
          id?: number
          submissions?: Json
        }
      }
      magic_links: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
      }
      question_pool_submissions: {
        Row: {
          answers: Json
          created_at: string
          id: number
          question_pool_id: string
          submitted_at: string
          tiebreaker_answer: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: number
          question_pool_id: string
          submitted_at: string
          tiebreaker_answer: number
          updated_at: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: number
          question_pool_id?: string
          submitted_at?: string
          tiebreaker_answer?: number
          updated_at?: string
          user_id?: string
        }
      }
      question_pools: {
        Row: {
          created_at: string
          id: string
          is_open_for_submissions: boolean
          tiebreaker_answer: number
          tiebreaker_content: string | null
          tiebreaker_is_finalized: boolean
          tiebreaker_status: string
          tiebreaker_title: string
        }
        Insert: {
          created_at?: string
          id: string
          is_open_for_submissions?: boolean
          tiebreaker_answer: number
          tiebreaker_content?: string | null
          tiebreaker_is_finalized?: boolean
          tiebreaker_status: string
          tiebreaker_title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_open_for_submissions?: boolean
          tiebreaker_answer?: number
          tiebreaker_content?: string | null
          tiebreaker_is_finalized?: boolean
          tiebreaker_status?: string
          tiebreaker_title?: string
        }
      }
      questions: {
        Row: {
          answer: string | null
          choices: Json
          content: string | null
          created_at: string
          id: string
          is_finalized: boolean
          order: number
          question_pool_id: string
          status: string
          title: string
        }
        Insert: {
          answer?: string | null
          choices?: Json
          content?: string | null
          created_at?: string
          id: string
          is_finalized?: boolean
          order: number
          question_pool_id: string
          status?: string
          title: string
        }
        Update: {
          answer?: string | null
          choices?: Json
          content?: string | null
          created_at?: string
          id?: string
          is_finalized?: boolean
          order?: number
          question_pool_id?: string
          status?: string
          title?: string
        }
      }
      sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          email: string
          id: string
          is_admin: boolean
          name: string
          signed_up_at: string
        }
        Insert: {
          email: string
          id: string
          is_admin?: boolean
          name: string
          signed_up_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_admin?: boolean
          name?: string
          signed_up_at?: string
        }
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
