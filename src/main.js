import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store'
import patpatUI from 'patpat-ui'
import { createL10n } from './l10n'
import { createI18n } from './i18n'
import verification from './assets/js/verification'
import { lazyImgFilter } from './vlazy'
import VueLazyload from 'vue-lazyload'
import { getSessionStorage, setSessionStorage, delSessionStorage } from './utils/storage'
import PatRouterLink from './components/base/PatRouterLink.vue'
import PatImg from './components/base/PatImg.vue'
import * as gUtils from './utils/global'
import * as directives from './directives'

Vue.config.productionTip = false

Vue.prototype.$verify = verification
Vue.prototype.$ppUtils = gUtils

Vue.use(patpatUI)

Vue.use(VueLazyload, lazyImgFilter)

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.component(PatRouterLink.name, PatRouterLink)
Vue.component(PatImg.name, PatImg)

export default () => {
  const router = createRouter()
  const store = createStore()
  // sync so that route state is available as part of the store
  sync(store, router)
  router.beforeEach(function (to, from, next) {
    if (!Vue.prototype.$isServer) {
      if (window.perfStart) {
        window.perfStart = Date.now()
      } else {
        window.perfStart = performance.timing.navigationStart
      }
      const lastClickPosition = getSessionStorage('last_click_position')
      if (lastClickPosition) {
        const positionClickTime = getSessionStorage('pct:' + lastClickPosition)
        if ((Date.now() - positionClickTime) > 100) {
          delSessionStorage('last_click_position')
          delSessionStorage('pct:' + lastClickPosition)
          delSessionStorage('home_position')
        } else if (lastClickPosition.indexOf('home-') >= 0) {
          setSessionStorage('home_position', lastClickPosition)
        }
      }
    }
    next()
  })

  const l10nCurrency = createL10n()
  const i18n = createI18n()
  const app = new Vue({
    router,
    store,
    i18n,
    l10nCurrency,
    render: (h) => h(App)
  })

  Vue.config.devtools = true

  return { app, router, store }
}
