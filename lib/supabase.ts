import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string
          tags: string[]
          entry_date: string
          is_favorite: boolean
          word_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood: string
          tags?: string[]
          entry_date?: string
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          mood?: string
          tags?: string[]
          entry_date?: string
          is_favorite?: boolean
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: "diary" | "problem" | "fear" | "courage" | "trauma"
          status: "active" | "solved" | "progress" | "archived"
          priority: "low" | "medium" | "high"
          tags: string[]
          solved_at?: string
          reminder_date?: string
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type: "diary" | "problem" | "fear" | "courage" | "trauma"
          status?: "active" | "solved" | "progress" | "archived"
          priority?: "low" | "medium" | "high"
          tags?: string[]
          solved_at?: string
          reminder_date?: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: "diary" | "problem" | "fear" | "courage" | "trauma"
          status?: "active" | "solved" | "progress" | "archived"
          priority?: "low" | "medium" | "high"
          tags?: string[]
          solved_at?: string
          reminder_date?: string
          is_private?: boolean
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          author_name: string
          title: string
          content: string
          category: string
          tags: string[]
          likes: number
          views: number
          is_anonymous: boolean
          is_featured: boolean
          is_resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          author_name: string
          title: string
          content: string
          category: string
          tags?: string[]
          likes?: number
          views?: number
          is_anonymous?: boolean
          is_featured?: boolean
          is_resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          likes?: number
          views?: number
          is_featured?: boolean
          is_resolved?: boolean
          updated_at?: string
        }
      }
      community_replies: {
        Row: {
          id: string
          post_id: string
          user_id: string
          author_name: string
          content: string
          likes: number
          is_anonymous: boolean
          is_helpful: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          author_name: string
          content: string
          likes?: number
          is_anonymous?: boolean
          is_helpful?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          likes?: number
          is_helpful?: boolean
          updated_at?: string
        }
      }
      mood_tracking: {
        Row: {
          id: string
          user_id: string
          mood: string
          intensity: number
          notes?: string
          tracked_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: string
          intensity: number
          notes?: string
          tracked_date?: string
          created_at?: string
        }
        Update: {
          mood?: string
          intensity?: number
          notes?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          notifications_enabled: boolean
          email_notifications: boolean
          daily_reminder_time: string
          timezone: string
          privacy_level: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          daily_reminder_time?: string
          timezone?: string
          privacy_level?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          theme?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          daily_reminder_time?: string
          timezone?: string
          privacy_level?: string
          language?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_stats: {
        Args: { user_uuid: string }
        Returns: any
      }
      increment_post_likes: {
        Args: { post_uuid: string }
        Returns: void
      }
      decrement_post_likes: {
        Args: { post_uuid: string }
        Returns: void
      }
      increment_post_views: {
        Args: { post_uuid: string }
        Returns: void
      }
    }
  }
}
