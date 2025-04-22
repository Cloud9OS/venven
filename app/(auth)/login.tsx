import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';

export default function LoginScreen() {
  const { translate } = useI18n();
  const { login, error, isLoading, clearError } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      return;
    }
    await login(phoneNumber, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.logo} 
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <Text style={styles.appName}>خدماتي</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>{translate('login.title')}</Text>
          
          {error && <ErrorMessage message={error} onDismiss={clearError} />}
          
          <Input
            label={translate('login.phoneNumber')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="05xxxxxxxx"
            keyboardType="phone-pad"
          />
          
          <Input
            label={translate('login.password')}
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
          />
          
          <Button 
            title={translate('login.button')} 
            onPress={handleLogin} 
            isLoading={isLoading}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{translate('login.noAccount')}</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>{translate('login.register')}</Text>
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
  logoContainer: {
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  appName: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginBottom: 24,
    color: colors.text,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: colors.textLight,
    fontFamily: 'Cairo-Regular',
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Cairo-Bold',
  },
});