import Vue from 'vue'
import VueI18n from 'vue-i18n'
import dateTimeFormats from '@/assets/lang/date-format'
import enLang from '@/assets/lang/en.json'

Vue.use(VueI18n)

let i18n

export const createI18n = () => {
  const lang = process.env.VUE_APP_I18N_LOCALE || 'en'
  i18n = new VueI18n({
    locale: lang,
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    dateTimeFormats,
    messages: { [lang]: enLang }
  })
  return i18n
}

function setI18nLanguage (lang) {
  i18n.locale = lang
  return lang
}

export const loadLanguageAsync = (lang) => {
  const loadedLanguages = Object.keys(i18n.messages)
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      // eslint-disable-next-line
      import(/* webpackChunkName: "lang-[request]" */ `@/assets/lang/${lang}.json`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
