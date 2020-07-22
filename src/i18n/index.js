import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enUS from './en-US'
import frFR from './fr-FR'

Vue.use(VueI18n)

const messages = {
    'en-US': enUS,
    'fr-FR': frFR,
}

const i18n = new VueI18n({
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages,
})

export default i18n
