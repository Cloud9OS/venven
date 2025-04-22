import { Stack } from 'expo-router';
import { useI18n } from '@/context/I18nContext';

export default function ChatLayout() {
  const { translate } = useI18n();
  
  return (
    <Stack>
      <Stack.Screen name="room" options={{ 
        headerShown: true,
        title: translate('chat.title'),
        headerBackTitle: translate('tabs.chat'),
      }} />
    </Stack>
  );
}