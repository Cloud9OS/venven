import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useI18n } from '@/context/I18nContext';
import { colors } from '@/styles/colors';
import { Check, X, CreditCard as Edit, Trash2 } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  userType: 'customer' | 'vendor' | 'admin';
  isApproved: boolean;
  avatarUrl: string;
  serviceType?: string;
}

interface UserCardProps {
  user: User;
  onApprove: () => void;
  onDisapprove: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export function UserCard({ user, onApprove, onDisapprove, onDelete, onEdit }: UserCardProps) {
  const { translate } = useI18n();
  
  // Map service type to translated category name
  const getServiceTypeName = (type?: string) => {
    if (!type) return '';
    
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phoneNumber}</Text>
          
          {user.userType === 'vendor' && user.serviceType && (
            <Text style={styles.serviceType}>{getServiceTypeName(user.serviceType)}</Text>
          )}
          
          <View style={[
            styles.statusBadge,
            user.isApproved ? styles.approvedBadge : styles.notApprovedBadge
          ]}>
            <Text style={styles.statusText}>
              {user.isApproved ? 
                translate('admin.users.approved') : 
                translate('admin.users.notApproved')
              }
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, user.isApproved ? styles.disapproveButton : styles.approveButton]}
          onPress={user.isApproved ? onDisapprove : onApprove}
        >
          {user.isApproved ? (
            <X size={18} color={colors.white} />
          ) : (
            <Check size={18} color={colors.white} />
          )}
          <Text style={styles.actionButtonText}>
            {user.isApproved ? 
              translate('admin.users.disapprove') : 
              translate('admin.users.approve')
            }
          </Text>
        </TouchableOpacity>
        
        {onEdit && (
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <Edit size={18} color={colors.white} />
            <Text style={styles.actionButtonText}>{translate('admin.users.edit')}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
          <Trash2 size={18} color={colors.white} />
          <Text style={styles.actionButtonText}>{translate('admin.users.delete')}</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    color: colors.text,
  },
  phone: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  serviceType: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Cairo-Medium',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  approvedBadge: {
    backgroundColor: colors.success,
  },
  notApprovedBadge: {
    backgroundColor: colors.warning,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
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
    paddingVertical: 10,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  disapproveButton: {
    backgroundColor: colors.warning,
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginRight: 4,
  },
});