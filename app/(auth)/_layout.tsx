import { Stack } from 'expo-router';
import { useI18n } from '@/context/I18nContext';

export default function AuthLayout() {
  const { translate } = useI18n();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: translate('login.title') }} />
      <Stack.Screen name="register" options={{ title: translate('register.title') }} />
      <Stack.Screen name="pending" options={{ title: translate('register.success'), gestureEnabled: false }} />
    </Stack>
  );
}