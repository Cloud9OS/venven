import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';
import { Clock } from 'lucide-react-native';

export default function PendingApprovalScreen() {
  const { translate } = useI18n();
  const { logout } = useAuth();

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        <View style={styles.infoContainer}>
          <Clock size={60} color={colors.primary} />
          <Text style={styles.title}>{translate('register.success')}</Text>
          <Text style={styles.message}>
            تم إنشاء حسابك بنجاح، ولكن يتطلب موافقة المشرف قبل أن تتمكن من استخدام التطبيق.
            سيتم إشعارك عندما تتم الموافقة على حسابك.
          </Text>
          
          <Button 
            title={translate('profile.logout')} 
            onPress={logout} 
            variant="secondary"
            style={styles.logoutButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 32,
  },
  infoContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginVertical: 16,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Cairo-Regular',
  },
  logoutButton: {
    marginTop: 16,
  },
});