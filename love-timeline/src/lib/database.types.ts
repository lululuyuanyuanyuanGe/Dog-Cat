export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          contributions: number
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          contributions?: number
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          contributions?: number
        }
        Relationships: []
      }
      memories: {
        Row: {
          id: string
          user_id: string
          date: string
          created_at: string
          type: "photo" | "video" | "note" | "audio" | "pdf"
          media_url: string | null
          content: string | null
          likes: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          created_at?: string
          type: "photo" | "video" | "note" | "audio" | "pdf"
          media_url?: string | null
          content?: string | null
          likes?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          created_at?: string
          type?: "photo" | "video" | "note" | "audio" | "pdf"
          media_url?: string | null
          content?: string | null
          likes?: number
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          memory_date: string
          author_name: string
          avatar_seed: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          memory_date: string
          author_name: string
          avatar_seed: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          memory_date?: string
          author_name?: string
          avatar_seed?: string
          content?: string
          created_at?: string
        }
        Relationships: []
      }
    }
  }
}
