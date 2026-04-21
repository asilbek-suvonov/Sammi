import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import uz from './locales/uz/translation.json'
import en from './locales/en/translation.json'
import ru from './locales/ru/translation.json'

const LANGUAGE_STORAGE_KEY = 'sammi_language'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? 'uz',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n