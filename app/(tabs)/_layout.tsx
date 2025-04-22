import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { TabBar } from '@/components/navigation/TabBar';
import { Chrome as Home, MessageCircle, User } from 'lucide-react-native';

export default function TabsLayout() {
  const { translate } = useI18n();
  const { user } = useAuth();
  
  // If no user, redirect to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If admin, redirect to admin layout
  if (user.userType === 'admin') {
    return <Redirect href="/(admin)" />;
  }

  const isVendor = user.userType === 'vendor';
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}
    >
      {/* Show services tab only for customers */}
      {!isVendor && (
        <Tabs.Screen
          name="index"
          options={{
            title: translate('tabs.services'),
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            href: isVendor ? null : undefined,
          }}
        />
      )}
      
      <Tabs.Screen
        name="chat"
        options={{
          title: translate('tabs.chat'),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: translate('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}