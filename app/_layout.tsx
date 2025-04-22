import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { I18nProvider } from '@/context/I18nContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from '@/styles/global';
import '@/lib/i18n';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // Load Arabic fonts
  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': 'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSscQyyS4J0.ttf',
    'Cairo-Bold': 'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs6QyyS4J0.ttf',
    'Cairo-Medium': 'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs0QyyS4J0.ttf',
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View style={styles.container} />;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <AuthProvider>
        <I18nProvider>
          <UserProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(admin)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(chat)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" options={{ title: 'غير موجود' }} />
            </Stack>
            <StatusBar style="auto" />
          </UserProvider>
        </I18nProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}