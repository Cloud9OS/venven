import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Image, I18nManager, Linking } from 'react-native';
import { fetchVendors } from '@/lib/fetchVendors';
import { colors } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Vendor {
  id: string;
  name: string;
  phone_number: string;
  service_type: string;
  service_details: string;
  location_url?: string;
  image_url?: string;
  experience_years?: number;
}

const categories = ['all', 'plumbing', 'electrical', 'construction', 'maintenance'];

export default function ServicesScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useTranslation();

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchVendors();
      console.log('Vendors result:', result); // Debug log
      if (result.success && result.data?.approvedVendors) {
        setVendors(result.data.approvedVendors);
      } else {
        setError(result.error || 'Failed to load vendors');
      }
    } catch (err: any) {
      console.error('Error loading vendors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.service_type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.service_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={loadVendors}>
          <Text style={styles.buttonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('services.title')}</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder={t('services.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.secondary}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}>
              {t(`services.categories.${category}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredVendors.length === 0 ? (
        <Text style={styles.noServices}>{t('services.noServices')}</Text>
      ) : (
        filteredVendors.map((vendor) => (
          <View key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
              {vendor.image_url ? (
                <Image
                  source={{ uri: vendor.image_url }}
                  style={styles.vendorImage}
                />
              ) : (
                <View style={[styles.vendorImage, styles.defaultAvatar]}>
                  <Ionicons name="person" size={30} color={colors.secondary} />
                </View>
              )}
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.serviceType}>{vendor.service_type}</Text>
              </View>
            </View>

            <Text style={styles.serviceDetails}>
              {vendor.service_details}
            </Text>

            <View style={styles.actionButtons}>
              <Link 
                href={{ 
                  pathname: "/(chat)/[id]", 
                  params: { 
                    id: vendor.id,
                    name: vendor.name,
                    image: vendor.image_url || '',
                    service: vendor.service_type
                  }
                }} 
                asChild
              >
                <TouchableOpacity style={styles.chatButton}>
                  <Ionicons name="chatbubble-outline" size={20} color={colors.white} />
                  <Text style={styles.actionButtonText}>{t('common.chat')}</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => {
                  if (vendor.location_url) {
                    Linking.openURL(vendor.location_url);
                  }
                }}
              >
                <Ionicons name="location-outline" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>{t('services.viewLocation')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  searchInput: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
    fontFamily: 'Cairo-Medium',
  },
  selectedCategoryText: {
    color: colors.white,
  },
  vendorCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  serviceType: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  serviceDetails: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chatButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Cairo-Medium',
  },
  error: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  noServices: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
  },
  defaultAvatar: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});