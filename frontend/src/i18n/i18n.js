import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

const LANGUAGE_STORAGE_KEY = 'joyful-dilnoma-language'
const supportedLanguages = ['uz', 'ru', 'en']
const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
const initialLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'uz'

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

document.documentElement.lang = initialLanguage

i18n.on('languageChanged', (language) => {
  if (supportedLanguages.includes(language)) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }
})

export default i18n
