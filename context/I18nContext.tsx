import React, { createContext, useContext, ReactNode } from 'react';
import { I18nManager } from 'react-native';

// Force RTL layout for Arabic language
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

type I18nContextType = {
  isRTL: boolean;
  translate: (key: string) => string;
};

// Arabic language translations
const translations = {
  // Auth
  'login.title': 'تسجيل الدخول',
  'login.phoneNumber': 'رقم الهاتف',
  'login.password': 'كلمة المرور',
  'login.button': 'تسجيل الدخول',
  'login.noAccount': 'ليس لديك حساب؟',
  'login.register': 'تسجيل حساب جديد',
  
  // Registration
  'register.title': 'تسجيل حساب جديد',
  'register.name': 'الاسم الكامل',
  'register.phoneNumber': 'رقم الهاتف',
  'register.password': 'كلمة المرور',
  'register.confirmPassword': 'تأكيد كلمة المرور',
  'register.location': 'الموقع (اختياري)',
  'register.button': 'تسجيل',
  'register.hasAccount': 'لديك حساب بالفعل؟',
  'register.login': 'تسجيل الدخول',
  'register.success': 'تم التسجيل بنجاح. بانتظار موافقة المشرف.',
  
  // Navigation
  'tabs.services': 'الخدمات',
  'tabs.chat': 'المحادثات',
  'tabs.profile': 'الملف الشخصي',
  'tabs.users': 'المستخدمين',
  'tabs.createUser': 'إنشاء مستخدم',
  
  // Services
  'services.title': 'الخدمات',
  'services.search': 'البحث عن خدمات...',
  'services.category.all': 'الكل',
  'services.category.plumber': 'سباكة',
  'services.category.electrician': 'كهرباء',
  'services.category.gas': 'توصيل غاز',
  'services.category.repair': 'إصلاح منزلي',
  'services.category.gardening': 'بستنة',
  'services.category.other': 'أخرى',
  'services.contact': 'تواصل الآن',
  'services.share': 'مشاركة الموقع',
  
  // Chat
  'chat.title': 'المحادثات',
  'chat.noMessages': 'لا توجد رسائل',
  'chat.typeMessage': 'اكتب رسالة...',
  'chat.send': 'إرسال',
  'chat.shareLocation': 'مشاركة الموقع',
  
  // Profile
  'profile.title': 'الملف الشخصي',
  'profile.editPhoto': 'تعديل الصورة',
  'profile.name': 'الاسم',
  'profile.phone': 'رقم الهاتف',
  'profile.changePassword': 'تغيير كلمة المرور',
  'profile.logout': 'تسجيل الخروج',
  'profile.serviceDetails': 'تفاصيل الخدمة',
  'profile.serviceType': 'نوع الخدمة',
  
  // Admin
  'admin.users.title': 'قائمة المستخدمين',
  'admin.users.customers': 'العملاء',
  'admin.users.vendors': 'مقدمي الخدمات',
  'admin.users.approve': 'موافقة',
  'admin.users.disapprove': 'رفض',
  'admin.users.delete': 'حذف',
  'admin.users.edit': 'تعديل',
  'admin.users.approved': 'تمت الموافقة',
  'admin.users.notApproved': 'لم تتم الموافقة',
  'admin.create.title': 'إنشاء مستخدم جديد',
  'admin.create.userType': 'نوع المستخدم',
  'admin.create.customer': 'عميل',
  'admin.create.vendor': 'مقدم خدمة',
  'admin.create.serviceType': 'نوع الخدمة',
  'admin.create.serviceDetails': 'تفاصيل الخدمة',
  'admin.create.button': 'إنشاء المستخدم',
  
  // Common
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.loading': 'جاري التحميل...',
  'common.error': 'حدث خطأ',
  'common.success': 'تم بنجاح',
};

const I18nContext = createContext<I18nContextType>({
  isRTL: true,
  translate: (key) => key,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const translate = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <I18nContext.Provider value={{ isRTL: true, translate }}>
      {children}
    </I18nContext.Provider>
  );
};