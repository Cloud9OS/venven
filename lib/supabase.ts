import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone_number: string;
          name: string;
          password: string;
          user_type: 'customer' | 'vendor' | 'admin';
          avatar_url: string | null;
          service_type: string | null;
          service_details: string | null;
          location_url: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          name: string;
          password: string;
          user_type: 'customer' | 'vendor' | 'admin';
          avatar_url?: string | null;
          service_type?: string | null;
          service_details?: string | null;
          location_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          name?: string;
          password?: string;
          user_type?: 'customer' | 'vendor' | 'admin';
          avatar_url?: string | null;
          service_type?: string | null;
          service_details?: string | null;
          location_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}