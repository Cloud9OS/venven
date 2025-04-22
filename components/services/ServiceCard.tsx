import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/context/I18nContext';
import { colors } from '@/styles/colors';
import { MessageCircle, Share2 } from 'lucide-react-native';

interface ServiceProvider {
  id: string;
  name: string;
  serviceType: string;
  serviceDetails: string;
  avatarUrl: string;
  phoneNumber: string;
  isApproved: boolean;
}

interface ServiceCardProps {
  provider: ServiceProvider;
}

export function ServiceCard({ provider }: ServiceCardProps) {
  const { translate } = useI18n();
  
  // Map service type to translated category name
  const getServiceTypeName = (type: string) => {
    const types: Record<string, string> = {
      plumber: translate('services.category.plumber'),
      electrician: translate('services.category.electrician'),
      gas: translate('services.category.gas'),
      repair: translate('services.category.repair'),
      gardening: translate('services.category.gardening'),
      other: translate('services.category.other'),
    };
    
    return types[type] || type;
  };
  
  const navigateToChat = () => {
    router.push({
      pathname: '/(chat)/room',
      params: { id: provider.id, name: provider.name }
    });
  };
  
  const shareLocation = () => {
    // Share location logic would be implemented here
    console.log('Share location with provider:', provider.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: provider.avatarUrl }} style={styles.avatar} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.serviceType}>{getServiceTypeName(provider.serviceType)}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>{provider.serviceDetails}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={navigateToChat}>
          <MessageCircle size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>{translate('services.contact')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={shareLocation}>
          <Share2 size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>{translate('services.share')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Cairo-Medium',
  },
  detailsContainer: {
    padding: 16,
  },
  detailsText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontFamily: 'Cairo-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  messageButton: {
    backgroundColor: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginRight: 8,
  },
});