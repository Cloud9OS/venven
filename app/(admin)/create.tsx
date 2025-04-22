import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { styles as globalStyles } from '@/styles/global';
import { colors } from '@/styles/colors';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function CreateUserScreen() {
  const { translate } = useI18n();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const [serviceType, setServiceType] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  
  const userTypeOptions = [
    { label: translate('admin.create.customer'), value: 'customer' },
    { label: translate('admin.create.vendor'), value: 'vendor' },
  ];
  
  const serviceTypeOptions = [
    { label: translate('services.category.plumber'), value: 'plumber' },
    { label: translate('services.category.electrician'), value: 'electrician' },
    { label: translate('services.category.gas'), value: 'gas' },
    { label: translate('services.category.repair'), value: 'repair' },
    { label: translate('services.category.gardening'), value: 'gardening' },
    { label: translate('services.category.other'), value: 'other' },
  ];
  
  const handleCreateUser = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!name || !phoneNumber || !password) {
        Alert.alert(
          translate('common.error'),
          translate('admin.create.missingFields')
        );
        return;
      }

      // Validate phone number format
      if (!/^05\d{8}$/.test(phoneNumber)) {
        Alert.alert(
          translate('common.error'),
          translate('admin.create.invalidPhone')
        );
        return;
      }

      // Validate service type for vendors
      if (userType === 'vendor' && !serviceType) {
        Alert.alert(
          translate('common.error'),
          translate('admin.create.missingServiceType')
        );
        return;
      }

      // Call the admin-create Edge Function
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/admin-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name,
          phone_number: phoneNumber,
          password,
          user_type: userType,
          service_type: serviceType,
          service_details: serviceDetails,
          location_url: locationUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || translate('admin.create.error'));
      }

      if (data.success) {
        // Reset form
        setName('');
        setPhoneNumber('');
        setPassword('');
        setUserType('customer');
        setServiceType('');
        setServiceDetails('');
        setLocationUrl('');

        // Show success message
        Alert.alert(
          translate('common.success'),
          translate('admin.create.success'),
          [
            {
              text: translate('common.ok'),
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      Alert.alert(
        translate('common.error'),
        error.message || translate('admin.create.error')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[globalStyles.flex, styles.container]}>
      <Header title={translate('admin.create.title')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Dropdown
            label={translate('admin.create.userType')}
            options={userTypeOptions}
            value={userType}
            onSelect={(value) => setUserType(value as 'customer' | 'vendor')}
          />
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translate('register.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="الاسم الكامل"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translate('register.phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="05xxxxxxxx"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translate('register.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor={colors.textLight}
              secureTextEntry
            />
          </View>
          
          {userType === 'customer' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{translate('register.location')}</Text>
              <TextInput
                style={styles.input}
                value={locationUrl}
                onChangeText={setLocationUrl}
                placeholder="رابط الموقع (اختياري)"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
          
          {userType === 'vendor' && (
            <>
              <Dropdown
                label={translate('admin.create.serviceType')}
                options={serviceTypeOptions}
                value={serviceType}
                onSelect={setServiceType}
              />
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{translate('admin.create.serviceDetails')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={serviceDetails}
                  onChangeText={setServiceDetails}
                  placeholder="تفاصيل الخدمة المقدمة"
                  placeholderTextColor={colors.textLight}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </>
          )}
          
          <Button
            title={translate('admin.create.button')}
            onPress={handleCreateUser}
            isLoading={isLoading}
            style={styles.createButton}
          />
        </View>
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
    paddingBottom: 32,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    marginTop: 8,
  },
});