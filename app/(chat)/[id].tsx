import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  I18nManager,
  Image,
  ScrollView,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/lib/i18n';
import { chatService, Message, generateChatId } from '@/lib/chatService';
import { useAuth } from '@/context/AuthContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ChatScreen() {
  const { id: vendorId, name: vendorName, image: vendorImage, service: vendorService } = useLocalSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !vendorId) {
      console.log('No user or vendor ID, redirecting...');
      router.back();
      return;
    }

    console.log('Initializing chat with vendor:', vendorId);
    const chatId = generateChatId(user.id, vendorId as string);
    setChatId(chatId);

    // Load initial messages
    console.log('Loading initial messages...');
    chatService.getMessages(chatId)
      .then((messages) => {
        console.log('Initial messages loaded:', messages.length);
        setMessages(messages);
      })
      .catch((error) => {
        console.error('Error loading messages:', error);
        setError('Failed to load messages');
      })
      .finally(() => setLoading(false));

    // Subscribe to new messages
    console.log('Setting up message subscription...');
    const subscription = chatService.subscribeToMessages(chatId, (updatedMessages) => {
      console.log('Received message update:', updatedMessages.length);
      setMessages(updatedMessages);
      // Mark messages as read
      chatService.markAsRead(chatId, user.id).catch((error) => {
        console.error('Error marking messages as read:', error);
      });
    });

    return () => {
      console.log('Cleaning up chat subscription...');
      subscription.unsubscribe();
    };
  }, [user, vendorId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !vendorId) return;

    setSending(true);
    setError(null);

    const chatId = generateChatId(user.id, vendorId as string);
    
    try {
      console.log('Attempting to send message...');
      await chatService.sendMessage({
        chat_id: chatId,
        sender_id: user.id,
        content: newMessage.trim(),
        sender_name: (user as any).user_metadata?.full_name || 'User',
        sender_avatar: (user as any).user_metadata?.avatar_url,
      });
      console.log('Message sent successfully');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (!user) return null;
    const isMyMessage = item.sender_id === user.id;

    return (
      <View
        key={item.id}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
          {item.content}
        </Text>
        {item.location && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              // Handle location URL
            }}
          >
            <Ionicons name="location" size={20} color={isMyMessage ? colors.white : colors.primary} />
            <Text style={[styles.locationText, isMyMessage && styles.myLocationText]}>
              {t('chat.viewLocation')}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.timeText, isMyMessage && styles.myTimeText]}>
          {new Date(item.created_at!).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('chat.pleaseSignIn')}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen 
        options={{
          headerTitle: vendorName as string,
          headerRight: () => (
            <View style={styles.headerRight}>
              {vendorImage ? (
                <Image 
                  source={{ uri: vendorImage as string }} 
                  style={styles.vendorImage} 
                />
              ) : (
                <Ionicons name="person-circle" size={32} color={colors.primary} />
              )}
              <Text style={styles.serviceText}>{vendorService}</Text>
            </View>
          ),
        }} 
      />

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender_id === user.id ? styles.sentMessage : styles.receivedMessage
              ]}
            >
              <Text style={styles.messageSender}>{message.sender_name}</Text>
              <Text style={styles.messageContent}>{message.content}</Text>
              <Text style={styles.messageTime}>
                {new Date(message.created_at).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={t('Type a message...')}
          placeholderTextColor={colors.text}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={24} color={newMessage.trim() ? colors.primary : colors.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  vendorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  serviceText: {
    color: colors.text,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: 8,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 4,
    color: colors.text,
  },
  messageContent: {
    fontSize: 16,
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    color: colors.text,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 20,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: colors.white,
  },
  theirMessageText: {
    color: colors.text,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  myTimeText: {
    color: colors.white,
    opacity: 0.7,
  },
  theirTimeText: {
    color: colors.text,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: colors.primary,
    marginLeft: 4,
  },
  myLocationText: {
    color: colors.white,
  },
}); 