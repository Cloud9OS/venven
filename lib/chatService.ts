import { createClient } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';

const CHAT_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_name: string;
  sender_avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const generateChatId = (userId: string, vendorId: string): string => {
  const sortedIds = [userId, vendorId].sort();
  return uuidv5(sortedIds.join('-'), CHAT_NAMESPACE);
};

class ChatService {
  private supabase;

  constructor() {
    if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }

  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'read'>): Promise<Message> {
    console.log('Sending message:', message);
    try {
      const { data, error } = await this.supabase.functions.invoke('chat', {
        body: {
          action: 'send_message',
          chat_id: message.chat_id,
          content: message.content,
          location: message.location,
        },
      });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Exception while sending message:', error);
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<Message[]> {
    console.log('Fetching messages for chat:', chatId);
    try {
      const { data, error } = await this.supabase.functions.invoke('chat', {
        body: {
          action: 'get_messages',
          chat_id: chatId,
        },
      });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Messages fetched successfully:', data?.length);
      return data || [];
    } catch (error) {
      console.error('Exception while fetching messages:', error);
      throw error;
    }
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    console.log('Marking messages as read for chat:', chatId);
    try {
      const { error } = await this.supabase.functions.invoke('chat', {
        body: {
          action: 'mark_as_read',
          chat_id: chatId,
        },
      });

      if (error) {
        console.error('Error marking messages as read:', error);
        throw error;
      }
    } catch (error) {
      console.error('Exception while marking messages as read:', error);
      throw error;
    }
  }

  subscribeToMessages(chatId: string, onMessages: (messages: Message[]) => void) {
    console.log('Subscribing to messages for chat:', chatId);
    const subscription = this.supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        console.log('Received message update:', payload);
        this.getMessages(chatId).then(onMessages).catch(console.error);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return {
      unsubscribe: () => {
        console.log('Unsubscribing from messages for chat:', chatId);
        subscription.unsubscribe();
      }
    };
  }
}

export const chatService = new ChatService(); 