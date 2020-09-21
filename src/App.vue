<template>
  <div id="app">
    <Layout>
      <keep-alive exclude="login,user-center,pop-search,checkout,checkout-address,userCenter,cart,searchPop,NewCheckoutAddress,siteError" max="11">
        <router-view :key="curRouterLink" ref="pageComponent"></router-view>
      </keep-alive>
    </Layout>
    <ArLess v-if="currentLang.abbreviation === 'ar'"/>
  </div>
</template>

<script>
import Layout from './components/layout/Layout'
import ArLess from './components/ArLess'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { INIT_COUNTRIES_MAP, CHANGE_SITE_ABB, INIT_ABTEST_STR } from '@/store/mutation-types.js'
import { getLocalStore, setLocalStore } from '@/utils/storage'

export default {
  serverPrefetch () {
    // 默认SEO信息
    let seoUrl = this.$ssrContext.url.split('?')[0]
    const lang = this.$ssrContext.siteInfo.langCode
    seoUrl = seoUrl.indexOf('.html') >= 0 ? `${seoUrl.split('.html')[0]}.html` : seoUrl
    seoUrl = seoUrl.replace(`/${lang}`, '')
    if (seoUrl.indexOf('/layout/activities/') >= 0 || seoUrl.indexOf('/search') >= 0) {
      seoUrl = this.$ssrContext.url // 自定义活动页和搜索需要后面的参数
    }
    setTimeout(() => {
      this.$ssrContext.title = this.$t('common.mate_title')
      this.$ssrContext.keywords = this.$t('common.mate_keywords')
      this.$ssrContext.description = this.$t('common.mate_description')
      this.$ssrContext.seoUrl = seoUrl
    }, 5)

    if (this.$ssrContext.pck) this.setPCK(this.$ssrContext.pck)
    // 初始化网站默认全局信息
    const siteInfo = this.$ssrContext.siteInfo
    this.setUserIp(this.$ssrContext.ip)

    this.initCountriesMap(siteInfo.countriesMap)
    this.initABTestStr(this.$ssrContext.abTestStr)
    this.changeCountry(siteInfo.countryCode)
    this.changeCurrency(siteInfo.currencyCode)
    this.changeLang(siteInfo.langCode)
    this.changeSiteAbb(siteInfo.siteAbb)
    return this.getRenderingAllData(this)
  },
  components: { Layout, ArLess },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI',
      currency: 'currentCurrency',
      currentCountry: 'currentCountry',
      currentLang: 'currentLang'
    }),
    curRouterLink () {
      return this.$route.fullPath
    }
  },
  methods: {
    ...mapMutations({
      initCountriesMap: INIT_COUNTRIES_MAP,
      changeSiteAbb: CHANGE_SITE_ABB,
      initABTestStr: INIT_ABTEST_STR,
      setUserFavorites: 'SET_USER_FAVORITES',
      setPCK: 'SET_PCK',
      setUserIp: 'CHANGE_USER_IP'
    }),
    ...mapActions([
      'getRenderingAllData',
      'changeCountry',
      'changeCurrency',
      'changeLang',
      'setUserInfo',
      'setCateGuide'
    ]),
    getUserFavorite () {
      this.patpatAPI.usersFavorites().then(res => {
        const favoriteIds = res.map(product => product.product_id)
        this.setUserFavorites(favoriteIds)
      })
    }
  },
  created () {
    if (!this.$isServer) {
      // 进入页面存储当前国家货币信息，兼容老项目
      setLocalStore('isSsr', true)
      if (!getLocalStore('currentInfo')) {
        const currentInfo = this.currentCountry
        setLocalStore('currentInfo', currentInfo)
      }
      // 获取旧项目货币
      const oldCurrencyCode = getLocalStore('curCountry') ? getLocalStore('curCountry').iso_code : ''
      this.changeCountry(this.$store.state.countryCode)
      this.changeCurrency(oldCurrencyCode || this.$store.state.currencyCode)
      this.changeLang(this.$store.state.langCode)
      const userInfo = window.localStorage.getItem('userInfo')
      this.setCateGuide(localStorage.getItem('cateGuide') || (Date.now() + '_1'))
      if (userInfo) {
        this.setUserInfo(JSON.parse(userInfo))
        this.getUserFavorite()
      }
    }
  },
  mounted () {
    // 使用浏览器特性，返回之前浏览的位置
    window.history.scrollRestoration && (history.scrollRestoration = 'auto')
  }
}
</script>

<style lang="less">
@import './styles/app.less';
@import '~patpat-ui/lib/patpat-ui.css';
</style>
