import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '.';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // language to use
    compatibilityJSON: 'v4', //To make it work for Android devices, add this line.
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
