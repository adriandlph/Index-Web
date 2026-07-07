import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import it from './locales/it.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ca from './locales/ca.json'
import gl from './locales/gl.json'
import sv from './locales/sv.json'
import eu from './locales/eu.json'
import pt from './locales/pt.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ru from './locales/ru.json'
import hi from './locales/hi.json'

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    it: { translation: it },
    de: { translation: de },
    fr: { translation: fr },
    ca: { translation: ca },
    gl: { translation: gl },
    sv: { translation: sv },
    eu: { translation: eu },
    pt: { translation: pt },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
    ru: { translation: ru },
    hi: { translation: hi },
  },
  lng: localStorage.getItem('index-web-lang') ?? 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
