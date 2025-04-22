import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation as useI18nTranslation } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        retry: 'Retry',
        chat: 'Chat Now',
        share: 'Share Location',
      },
      services: {
        title: 'Services',
        search: 'Search for services',
        noServices: 'No services available',
        serviceType: 'Service Type',
        details: 'Details',
        viewLocation: 'View Location',
        categories: {
          all: 'All',
          plumbing: 'Plumbing',
          electrical: 'Electrical',
          construction: 'Construction',
          maintenance: 'Maintenance',
        },
        experience: 'Experience',
        years: 'years',
      },
      chat: {
        title: 'Chat',
        typemessage: 'Type a message...',
        send: 'Send',
        noMessages: 'No messages yet',
        errorSending: 'Error sending message',
        errorLoading: 'Error loading messages',
      },
    },
  },
  ar: {
    translation: {
      common: {
        retry: 'إعادة المحاولة',
        chat: 'تواصل الآن',
        share: 'مشاركة الموقع',
      },
      services: {
        title: 'الخدمات',
        search: 'البحث عن خدمات',
        noServices: 'لا توجد خدمات متاحة',
        serviceType: 'نوع الخدمة',
        details: 'التفاصيل',
        viewLocation: 'عرض الموقع',
        categories: {
          all: 'الكل',
          plumbing: 'سباكة',
          electrical: 'كهرباء',
          construction: 'بناء',
          maintenance: 'صيانة عامة',
        },
        experience: 'خبرة',
        years: 'سنوات',
      },
      chat: {
        title: 'المحادثة',
        typemessage: 'اكتب رسالة...',
        send: 'إرسال',
        noMessages: 'لا توجد رسائل بعد',
        errorSending: 'خطأ في إرسال الرسالة',
        errorLoading: 'خطأ في تحميل الرسائل',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export const useTranslation = useI18nTranslation;

export default i18n; 