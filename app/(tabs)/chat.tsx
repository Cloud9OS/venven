import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/Header';
import { EmptyState } from '@/components/ui/EmptyState';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';
import { MessageCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Chat {
  id: string;
  customer_id: string;
  vendor_id: string;
  customer: {
    name: string;
    avatar_url: string | null;
  };
  vendor: {
    name: string;
    avatar_url: string | null;
  };
  messages: {
    content: string;
    created_at: string;
    read: boolean;
  }[];
}

export default function ChatScreen() {
  const { translate } = useI18n();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const { data: chatsData, error } = await supabase
        .from('chats')
        .select(`
          id,
          customer_id,
          vendor_id,
          customer:users!chats_customer_id_fkey(name, avatar_url),
          vendor:users!chats_vendor_id_fkey(name, avatar_url),
          messages:messages(content, created_at, read)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setChats(chatsData || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToChatRoom = (chatId: string, participantName: string) => {
    router.push({
      pathname: '/(chat)/room',
      params: { id: chatId, name: participantName }
    });
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isCustomer = user?.userType === 'customer';
    const participant = isCustomer ? item.vendor : item.customer;
    const lastMessage = item.messages[0];
    
    // Format timestamp
    const messageDate = lastMessage ? new Date(lastMessage.created_at) : new Date();
    const now = new Date();
    
    let timeString;
    if (messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear()) {
      // Today, show time
      timeString = messageDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.getDate() === now.getDate() - 1) {
      // Yesterday
      timeString = 'الأمس';
    } else {
      // Other days, show date
      timeString = messageDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'numeric' });
    }

    const unreadCount = item.messages.filter(msg => !msg.read).length;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigateToChatRoom(item.id, participant.name)}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: participant.avatar_url || 
                'https://images.pexels.com/photos/8961146/pexels-photo-8961146.jpeg'
            }} 
            style={styles.avatar} 
          />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.participantName}>{participant.name}</Text>
            <Text style={styles.timestamp}>{timeString}</Text>
          </View>
          <Text 
            style={[styles.lastMessage, unreadCount > 0 && styles.unreadMessage]}
            numberOfLines={1}
          >
            {lastMessage?.content || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.flex, styles.container]}>
        <Header title={translate('chat.title')} />
        <View style={[globalStyles.flex, globalStyles.center]}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <Header title={translate('chat.title')} />
      
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
        />
      ) : (
        <EmptyState
          icon={<MessageCircle size={60} color={colors.primary} />}
          title={translate('chat.title')}
          message={translate('chat.noMessages')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  chatInfo: {
    flex: 1,
    marginRight: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: 'Cairo-Regular',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: 'Cairo-Regular',
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
});