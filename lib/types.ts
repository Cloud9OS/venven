export interface Message {
  id?: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at?: string;
  read?: boolean;
  sender_name?: string;
  sender_avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone?: string;
  service_type?: string;
  service_details?: string;
  approved?: boolean;
} 