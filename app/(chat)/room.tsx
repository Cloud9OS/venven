import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';
import { Send, MapPin } from 'lucide-react-native';

// Mock messages data
const mockMessages = [
  {
    id: '1',
    senderId: 'client1',
    content: 'مرحبا، هل يمكنك إصلاح تسريب المياه لدي؟',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    hasLocation: false,
  },
  {
    id: '2',
    senderId: 'vendor1',
    content: 'نعم بالتأكيد. متى تريد أن آتي؟',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    hasLocation: false,
  },
  {
    id: '3',
    senderId: 'client1',
    content: 'هل يمكنك القدوم غدا في الصباح؟',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    hasLocation: false,
  },
  {
    id: '4',
    senderId: 'client1',
    content: 'هذا هو موقعي',
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
    hasLocation: true,
    locationUrl: 'https://www.google.com/maps?q=24.7136,46.6753',
  },
  {
    id: '5',
    senderId: 'vendor1',
    content: 'حسنًا، سأكون هناك غدًا في الساعة 10 صباحًا.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    hasLocation: false,
  },
];

export default function ChatRoomScreen() {
  const { translate } = useI18n();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id: string; name: string }>();
  
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  
  const flatListRef = useRef<FlatList>(null);
  
  // Scroll to bottom on initial render and when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };
  
  const isMyMessage = (senderId: string) => {
    return senderId === (user?.userType === 'customer' ? 'client1' : 'vendor1');
  };
  
  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now().toString(),
      senderId: user?.userType === 'customer' ? 'client1' : 'vendor1',
      content: newMessage,
      timestamp: new Date(),
      hasLocation: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  const sendLocation = () => {
    const locationMessage = {
      id: Date.now().toString(),
      senderId: user?.userType === 'customer' ? 'client1' : 'vendor1',
      content: 'هذا هو موقعي',
      timestamp: new Date(),
      hasLocation: true,
      locationUrl: 'https://www.google.com/maps?q=24.7136,46.6753',
    };
    
    setMessages([...messages, locationMessage]);
  };
  
  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
    const isMe = isMyMessage(item.senderId);
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessageBubble : styles.otherMessageBubble,
          item.hasLocation && styles.locationBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          
          {item.hasLocation && (
            <TouchableOpacity style={styles.locationButton}>
              <MapPin size={20} color={isMe ? colors.white : colors.primary} />
              <Text style={[
                styles.locationText,
                isMe ? styles.myLocationText : styles.otherLocationText
              ]}>
                عرض الموقع
              </Text>
            </TouchableOpacity>
          )}
          
          <Text style={[
            styles.timestamp,
            isMe ? styles.myTimestamp : styles.otherTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.flex}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[globalStyles.flex, styles.container]}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/8961146/pexels-photo-8961146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerName}>{params.name}</Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.locationShareButton} onPress={sendLocation}>
            <MapPin size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={translate('chat.typeMessage')}
            placeholderTextColor={colors.textLight}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.disabledSendButton
            ]} 
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? colors.white : colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-start',
  },
  otherMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationBubble: {
    paddingBottom: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-start',
    marginTop: 2,
    fontFamily: 'Cairo-Regular',
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: colors.textLight,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    marginRight: 6,
    fontFamily: 'Cairo-Medium',
  },
  myLocationText: {
    color: colors.white,
  },
  otherLocationText: {
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationShareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  disabledSendButton: {
    backgroundColor: colors.disabledBackground,
  },
});