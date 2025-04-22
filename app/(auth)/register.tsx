import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';

export default function RegisterScreen() {
  const { translate } = useI18n();
  const { register, error, isLoading, clearError } = useAuth();
  
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = () => {
    if (!name) {
      setValidationError(translate('register.name') + ' مطلوب');
      return false;
    }
    
    if (!phoneNumber) {
      setValidationError(translate('register.phoneNumber') + ' مطلوب');
      return false;
    }
    
    if (!password) {
      setValidationError(translate('register.password') + ' مطلوب');
      return false;
    }
    
    if (password !== confirmPassword) {
      setValidationError('كلمات المرور غير متطابقة');
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    await register({ 
      name, 
      phoneNumber, 
      password,
      locationUrl: locationUrl || undefined
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{translate('register.title')}</Text>
        </View>
        
        <View style={styles.formContainer}>
          {(error || validationError) && (
            <ErrorMessage 
              message={validationError || error} 
              onDismiss={() => {
                clearError();
                setValidationError(null);
              }} 
            />
          )}
          
          <Input
            label={translate('register.name')}
            value={name}
            onChangeText={setName}
            placeholder="الاسم الكامل"
          />
          
          <Input
            label={translate('register.phoneNumber')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="05xxxxxxxx"
            keyboardType="phone-pad"
          />
          
          <Input
            label={translate('register.password')}
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
          />
          
          <Input
            label={translate('register.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry
          />
          
          <Input
            label={translate('register.location')}
            value={locationUrl}
            onChangeText={setLocationUrl}
            placeholder="رابط الموقع على خرائط جوجل (اختياري)"
          />
          
          <Button 
            title={translate('register.button')} 
            onPress={handleRegister} 
            isLoading={isLoading}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{translate('register.hasAccount')}</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>{translate('register.login')}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    padding: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.white,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: colors.textLight,
    fontFamily: 'Cairo-Regular',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Cairo-Bold',
  },
});