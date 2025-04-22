import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { TabBar } from '@/components/navigation/TabBar';
import { Users, UserPlus, User } from 'lucide-react-native';

export default function AdminLayout() {
  const { translate } = useI18n();
  const { user } = useAuth();

  // If no user, redirect to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If not admin, redirect to appropriate layout
  if (user.userType !== 'admin') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translate('tabs.users'),
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="create"
        options={{
          title: translate('tabs.createUser'),
          tabBarIcon: ({ color, size }) => <UserPlus color={color} size={size} />,
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