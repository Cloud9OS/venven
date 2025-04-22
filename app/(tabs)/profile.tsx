import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';
import { Camera, Lock } from 'lucide-react-native';

export default function ProfileScreen() {
  const { translate } = useI18n();
  const { user, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [serviceDetails, setServiceDetails] = useState('');
  const [serviceType, setServiceType] = useState('');
  
  const isVendor = user?.userType === 'vendor';
  
  const handleSave = () => {
    // Save profile changes logic would go here
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <Header 
        title={translate('profile.title')}
        rightContent={
          isEditing ? (
            <Button
              title={translate('common.save')}
              onPress={handleSave}
              size="small"
            />
          ) : (
            <Button
              title={translate('common.cancel')}
              onPress={() => setIsEditing(false)}
              variant="text"
              size="small"
              style={{ display: isEditing ? 'flex' : 'none' }}
            />
          )
        }
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ 
                uri: user?.avatarUrl || 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userType}>
            {user?.userType === 'customer' ? 'عميل' : user?.userType === 'vendor' ? 'مقدم خدمة' : 'مشرف'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.title')}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translate('profile.name')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.inputValue}>{user?.name}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translate('profile.phone')}</Text>
            <Text style={styles.inputValue}>{user?.phoneNumber}</Text>
          </View>
          
          {isVendor && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{translate('profile.serviceType')}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={serviceType}
                    onChangeText={setServiceType}
                  />
                ) : (
                  <Text style={styles.inputValue}>سباكة</Text>
                )}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{translate('profile.serviceDetails')}</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={serviceDetails}
                    onChangeText={setServiceDetails}
                    multiline
                    numberOfLines={4}
                  />
                ) : (
                  <Text style={styles.inputValue}>
                    سباك محترف مع خبرة 10 سنوات في إصلاح تسريبات المياه وتركيب الأدوات الصحية
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translate('profile.changePassword')}</Text>
          <TouchableOpacity style={styles.changePasswordButton}>
            <Lock size={20} color={colors.primary} />
            <Text style={styles.changePasswordText}>{translate('profile.changePassword')}</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title={isEditing ? translate('common.cancel') : translate('common.save')}
          onPress={isEditing ? () => setIsEditing(false) : handleSave}
          variant={isEditing ? 'secondary' : 'primary'}
          style={styles.editButton}
        />
        
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
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  userType: {
    fontSize: 16,
    color: colors.textLight,
    fontFamily: 'Cairo-Regular',
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    fontFamily: 'Cairo-Regular',
  },
  inputValue: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePasswordText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Cairo-Bold',
  },
  editButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginBottom: 32,
  },
});