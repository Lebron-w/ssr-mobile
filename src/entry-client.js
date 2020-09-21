import './registerServiceWorker'
import './utils/expend'
import './utils/import3rdJs'
import createApp from './main'
import { getSessionStorage, setSessionStorage, getLocalStore, setLocalStore } from './utils/storage'
import { getCookie, setCookie } from './utils/cookie'
import { getQueryString } from './utils/base'

const { app, router, store } = createApp()

const initData = () => {
  // 从amp商详页加购跳到主站设置token,userId,unique_session_id
  if (getCookie(store.state.siteAbb + '-ampToken') && getCookie(store.state.siteAbb + '-ampToken') !== 'guest') {
    window.localStorage.setItem('token', getCookie(store.state.siteAbb + '-ampToken'))
    window.localStorage.setItem('userId', getCookie(store.state.siteAbb + '-ampUserId'))
    window.sessionStorage.setItem('track_session_id', getCookie(store.state.siteAbb + '-ampTracksSessionId'))
  }

  // 初始化session_id
  if (!getSessionStorage('track_session_id')) {
    setSessionStorage('track_session_id', Math.uuid())
  }

  // 初始化落地页
  const landingPage = getLocalStore('landing_page') || getCookie('landing_page')
  const newAdlinkId = getCookie('new_adlk_id') || ''
  if (!landingPage || newAdlinkId) {
    const url = window.location.href
    setLocalStore('landing_page', url)
    setCookie('landing_page', url)
  }

  // 初始化链接来源
  const source = getQueryString('csource') || getQueryString('utm_source') || getQueryString('source') || getQueryString('cmedium') || ''
  if (source) {
    setCookie('g_SOURCE', source)
  }
}

if (window.__INITIAL_STATE__) {
  // We initialize the store state with the data injected from the server
  store.replaceState(window.__INITIAL_STATE__)
}

initData()

router.onReady(() => {
  app.$mount('#app')
})
