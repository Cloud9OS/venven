import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { Header } from '@/components/ui/Header';
import { UserCard } from '@/components/admin/UserCard';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';

// Mock data for users
const mockCustomers = [
  {
    id: '1',
    name: 'محمد علي',
    phoneNumber: '0512345678',
    userType: 'customer',
    isApproved: true,
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'فاطمة أحمد',
    phoneNumber: '0523456789',
    userType: 'customer',
    isApproved: false,
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const mockVendors = [
  {
    id: '3',
    name: 'أحمد محمد',
    phoneNumber: '0534567890',
    userType: 'vendor',
    serviceType: 'plumber',
    isApproved: true,
    avatarUrl: 'https://images.pexels.com/photos/8961146/pexels-photo-8961146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    name: 'خالد العبدالله',
    phoneNumber: '0545678901',
    userType: 'vendor',
    serviceType: 'electrician',
    isApproved: false,
    avatarUrl: 'https://images.pexels.com/photos/8438951/pexels-photo-8438951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

type UserType = 'customer' | 'vendor';

export default function AdminUsersScreen() {
  const { translate } = useI18n();
  const [selectedTab, setSelectedTab] = useState<UserType>('customer');
  const [users, setUsers] = useState({
    customer: [...mockCustomers],
    vendor: [...mockVendors],
  });

  const handleApprove = (userId: string) => {
    setUsers(prev => ({
      ...prev,
      [selectedTab]: prev[selectedTab].map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ),
    }));
  };

  const handleDisapprove = (userId: string) => {
    setUsers(prev => ({
      ...prev,
      [selectedTab]: prev[selectedTab].map(user => 
        user.id === userId ? { ...user, isApproved: false } : user
      ),
    }));
  };

  const handleDelete = (userId: string) => {
    setUsers(prev => ({
      ...prev,
      [selectedTab]: prev[selectedTab].filter(user => user.id !== userId),
    }));
  };

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <Header title={translate('admin.users.title')} />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'customer' && styles.activeTab]}
          onPress={() => setSelectedTab('customer')}
        >
          <Text style={[styles.tabText, selectedTab === 'customer' && styles.activeTabText]}>
            {translate('admin.users.customers')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'vendor' && styles.activeTab]}
          onPress={() => setSelectedTab('vendor')}
        >
          <Text style={[styles.tabText, selectedTab === 'vendor' && styles.activeTabText]}>
            {translate('admin.users.vendors')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={users[selectedTab]}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onApprove={() => handleApprove(item.id)}
            onDisapprove={() => handleDisapprove(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  activeTabText: {
    color: colors.white,
  },
  userList: {
    padding: 16,
    paddingBottom: 32,
  },
});