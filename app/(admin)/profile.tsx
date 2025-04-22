import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';

export default function AdminProfileScreen() {
  const { translate } = useI18n();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <Header title={translate('profile.title')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ 
                uri: user?.avatarUrl || 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }} 
              style={styles.avatar} 
            />
          </View>
          
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userType}>{translate('admin.profile.adminTitle')}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.title')}</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{translate('profile.name')}</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{translate('profile.phone')}</Text>
            <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{translate('profile.role')}</Text>
            <Text style={styles.infoValue}>{translate('admin.profile.adminRole')}</Text>
          </View>
        </View>
        
        <Button
          title={translate('profile.logout')}
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  userType: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'Cairo-Medium',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo-Medium',
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});