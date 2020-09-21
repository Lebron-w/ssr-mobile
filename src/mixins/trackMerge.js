import { getLocalStore, getSessionStorage } from '@/utils/storage'
import { getCookie, delRootDomainCookie } from '@/utils/cookie'
import * as trackApi from '@/api/track-api'
import device from '@/utils/device'
import { mapGetters, mapState } from 'vuex'

const appTrackData = function () {
  let data = {}
  if (window.PatPat) {
    let platform = 'wap'
    if (window.PatPat.PLATFORM) {
      if (typeof (window.PatPat.PLATFORM) === 'string') {
        platform = window.PatPat.PLATFORM
        data = {
          user_id: window.PatPat.USER_ID || '0',
          country: window.PatPat.COUNTRY || 'United States',
          home_position: window.PatPat.HOME_POSITION || '',
          unique_session_id: window.PatPat.DEVICE_ID || '',
          patpat_platform: platform,
          last_url: window.PatPat.LAST_URL || '',
          position: window.PatPat.PAGE_POSITION || '',
          patpat_experiments: window.PatPat.PATPAT_EXPERIMENTS || '',
          experiments: '',
          adlk_id: window.PatPat.ADLINK_ID || ''
        }
      } else {
        platform = window.PatPat.PLATFORM()
        data = {
          user_id: window.PatPat.USER_ID ? window.PatPat.USER_ID() : '0',
          country: window.PatPat.COUNTRY ? window.PatPat.COUNTRY() : 'United States',
          home_position: window.PatPat.HOME_POSITION ? window.PatPat.HOME_POSITION() : '',
          unique_session_id: window.PatPat.DEVICE_ID ? window.PatPat.DEVICE_ID() : '',
          patpat_platform: platform,
          last_url: window.PatPat.LAST_URL ? window.PatPat.LAST_URL() : '',
          position: window.PatPat.PAGE_POSITION ? window.PatPat.PAGE_POSITION() : '',
          patpat_experiments: window.PatPat.PATPAT_EXPERIMENTS ? window.PatPat.PATPAT_EXPERIMENTS() : '',
          experiments: '',
          adlk_id: window.PatPat.ADLINK_ID ? window.PatPat.ADLINK_ID() : ''
        }
      }
    }
  }
  return data
}

const getPeriodTime = () => {
  const now = Date.now()
  const periodTime = {}
  const timing = performance.timing
  periodTime.redirect = timing.redirectEnd - timing.redirectStart // url重定向消耗时间
  periodTime.cache = timing.domainLookupStart - timing.fetchStart // 读取缓存消耗时间
  periodTime.dns = timing.domainLookupEnd - timing.domainLookupStart // dns解析消耗时间
  periodTime.tcp = timing.connectEnd - timing.connectStart // 建立TCP链接消耗时间
  periodTime.request = timing.responseStart - timing.requestStart // 发起请求消耗时间
  periodTime.response = timing.responseEnd - timing.responseStart // 响应请求消耗时间
  periodTime.processing = timing.loadEventStart - timing.domLoading // js逻辑处理消耗时间
  periodTime.onload = now - timing.loadEventStart // 页面加载结束总消耗时间（ms毫秒）
  return periodTime
}

/**
 * Page Component 页面组件混入数据跟踪属性方法
 */
export default {
  computed: {
    ...mapState({
      userId: (state) => state.userInfo.user_id || 0
    }),
    ...mapGetters({
      getABTestExperiments: 'getABTestExperiments',
      getABTestParamsUrl: 'getABTestParamsUrl',
      lastUrl: 'lastUrl'
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.postTackData()
    this.postExposureTrack()
    next(true)
  },
  beforeRouteLeave (to, from, next) {
    this.postTackData()
    this.postExposureTrack()
    next(true)
  },
  beforeMount () {
    // p.s 不要对以下变量进行computed， watch等需要被VUE劫持的处理
    this.trackBaseData = {}
    this.trackMergeData = []
    this.trackMergeExposureData = []
    this.beforeActivated = true
  },
  mounted () {
    window.dataLayer && window.dataLayer.push({ event: 'page_view' })
    window.addEventListener('beforeunload', this.beforeunloadFn)
    this.initBaseData()
    if (this.$options.name) {
      this.appendPageTrackData(this.$options.name)
    }
  },
  activated () {
    if (!this.beforeActivated) {
      window.addEventListener('beforeunload', this.beforeunloadFn)
      this.trackBaseData.last_url = this.lastUrl
      if (this.$options.name) {
        this.appendPageTrackData(this.$options.name)
      }
    }
    this.beforeRouteLeave = true
  },
  methods: {
    beforeunloadFn () {
      this.appendClickTrackData('close_single_page', { period_time: JSON.stringify(getPeriodTime()) })
      this.postTackData(true)
      this.postExposureTrack(true)
    },
    /**
     * 添加当前页面点击事件数据
     * @param {*} clickName 点击事件名称, 注意命名全小写加下划线 aa_bb_cc
     * @param {*} otherObj 点击事件其他额外附加参数
     */
    appendClickTrackData (clickName, otherObj = null) {
      let obj = { type_id: 2, event_id: clickName, timestamp: Date.now() }
      if (otherObj) obj = { ...obj, ...otherObj }
      this.trackMergeData.push(obj)
    },
    /**
     * 添加当前页面显示区域跟踪数据
     * @param {*} showName 显示区域名称, 注意命名全小写加下划线 aa_bb_cc
     * @param {*} otherObj 其他额外附加参数
     */
    appendShowTrackData (showName, otherObj = null) {
      let obj = { type_id: 3, event_id: showName, timestamp: Date.now() }
      if (otherObj) obj = { ...obj, ...otherObj }
      this.trackMergeData.push(obj)
    },
    /**
     * 添加当前页面浏览跟踪数据
     * @param {*} pageId 页面ID
     * @param {*} otherObj 其他额外附加参数
     */
    appendPageTrackData (pageId, otherObj = {}) {
      const now = Date.now()
      otherObj.page_load_time = now - window.perfStart
      let obj = { type_id: 1, event_id: pageId, timestamp: now }
      if (otherObj) obj = { ...obj, ...otherObj }
      this.trackMergeData.push(obj)
    },
    /**
     * 初始化基础参数
     */
    initBaseData () {
      this.trackBaseData.url = this.getABTestParamsUrl
      this.trackBaseData.last_url = this.lastUrl
      this.trackBaseData.session_id = getSessionStorage('track_session_id')
      this.trackBaseData.user_id = this.userId
      this.trackBaseData.landing_page = getLocalStore('landing_page') || getCookie('landing_page')
      this.trackBaseData.adlk_id = getCookie('adlk_id') || ''
      this.trackBaseData.new_adlink_id = getCookie('new_adlk_id') || ''
      delRootDomainCookie('new_adlk_id')
      this.trackBaseData.position = getSessionStorage('last_click_position') || ''
      this.trackBaseData.home_position = getSessionStorage('home_position') || ''
      this.trackBaseData.source = getCookie('g_SOURCE') || ''
      this.trackBaseData.patpat_experiments = this.getABTestExperiments(false)
      this.trackBaseData.experiments = this.getABTestExperiments()
      this.trackBaseData.abb = this.$i18n.locale || 'en'
      this.trackBaseData.device = device()
      const deviceLanguage = navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : ''
      this.trackBaseData.device_language = deviceLanguage || navigator.language || navigator.browserLanguage || navigator.userLanguage || ''
      this.trackBaseData.unique_session_id = getCookie('unique_session_id')
      this.trackBaseData.patpat_platform = 'wap'
      if (this.$route.query.platform && this.$route.query.platform === 'app') {
        this.trackBaseData = Object.assign(this.trackBaseData, appTrackData())
      }
    },
    /**
     * 上报合并过的流量点击显示数据
     * @param {Boolean} sendBeacon 是否使用sendBeacon方式上报
     */
    postTackData (sendBeacon = false) {
      if (this.trackMergeData.length === 0) return
      const mergeData = { mergeData: JSON.stringify(this.trackMergeData) }
      const params = { ...this.trackBaseData, ...mergeData }
      if (navigator.sendBeacon && sendBeacon) {
        const fromData = new FormData()
        for (const [key, value] of Object.entries(params)) {
          fromData.append(key, value)
        }
        navigator.sendBeacon('/trackApi/v1/tracks/merge_track', fromData)
      } else {
        trackApi.tracksRecord(params)
      }
      this.trackMergeData = []
    },
    /**
     * 上报合并过的坑位曝光数据
     * @param {Boolean} sendBeacon 是否使用sendBeacon方式上报
     */
    postExposureTrack (sendBeacon = false) {
      if (this.trackMergeExposureData.length === 0) return
      const mergeData = { mergeData: JSON.stringify(this.trackMergeExposureData) }
      const params = { ...this.trackBaseData, ...mergeData }
      if (navigator.sendBeacon && sendBeacon) {
        const fromData = new FormData()
        for (const [key, value] of Object.entries(params)) {
          fromData.append(key, value)
        }
        navigator.sendBeacon('/trackApi/v1/tracks/merge_exposure_track', fromData)
      } else {
        trackApi.tracksExposureTrack(params)
      }
      this.trackMergeExposureData = []
    },
    /**
     * 上报加购数据
     * @param {*} attachParams
     */
    postAddToCartTrack (attachParams = {}) {
      attachParams.position_click_time = getSessionStorage('pct:' + this.trackBaseData.position) || 0
      attachParams.entry_page = this.trackBaseData.last_url
      const params = { ...this.trackBaseData, ...attachParams }
      trackApi.trackAddToCart(params)
    },
    /**
     * 处理曝光数据
     * @param {*} el
     */
    appendExposureData (el) {
      const positionID = el.getAttribute('position-id')
      const ed = {
        position_id: positionID,
        id: el.dataset.id,
        type: el.dataset.type || 'product',
        timestamp: Date.now()
      }
      const positionContent = el.getAttribute('position-content')
      if (positionContent && positionContent.length > 2) {
        ed.position_content = positionContent
      }
      this.trackMergeExposureData.push(ed)
      el.setAttribute('track', 'tracked')
    }
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    this.beforeActivated = false
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  }
}
