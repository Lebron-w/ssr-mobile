<template>
  <div class="sider-bar-setting">
    <!-- 国家设置 -->
    <PatPicker :title="$t('common.siderbar.shipping')" :open="openKey === 'country'" :defaultItem="{title: tempCurrentCountry.country_name, icon: tempCurrentCountry.national_flag}" @clickPicker="clickPicker('country')">
      <PatPickerItem v-for="country in countries" :title="country.country_name" :icon="country.national_flag"
      :key="`country-${country.country_abbreviation}`" @clickPickerItem="selectedCountry(country.country_abbreviation)"></PatPickerItem>
    </PatPicker>

    <!-- 语言设置 -->
    <PatPicker :title="$t('common.siderbar.lang')" :open="openKey === 'lang'" :defaultItem="{title: tempCurrentLang.name}" @clickPicker="clickPicker('lang')">
      <PatPickerItem v-for="lang in langs" :title="lang.name" :key="`lang-${lang.abbreviation}`"
      @clickPickerItem="selectedLang(lang.abbreviation)"></PatPickerItem>
    </PatPicker>

    <!-- 货币设置 -->
    <PatPicker :title="$t('common.siderbar.currencies')" :open="openKey === 'isoCode'" :defaultItem="{title: tempCurrentCurrency.isoCode}" @clickPicker="clickPicker('isoCode')">
      <PatPickerItem v-for="currency in currencies" :title="currency.isoCode" :key="`currency-${currency.isoCode}`"
      @clickPickerItem="selectedCurrency(currency.isoCode)"></PatPickerItem>
    </PatPicker>

    <button class="save" @click="clickSave"> {{$t('common.siderbar.save')}} </button>
  </div>
</template>

<script>

import PatPicker from '@/components/base/PatPicker.vue'
import PatPickerItem from '@/components/base/PatPickerItem.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { HIDE_SIDER_BAR } from '@/store/mutation-types.js'
import { delLocalStore, setLocalStore } from '@/utils/storage'

export default {
  name: 'sider_bar_setting',
  components: { PatPicker, PatPickerItem },
  data () {
    return {
      tempCountryCode: null,
      tempCurrencyCode: null,
      tempLangCode: null,
      openKey: null
    }
  },
  computed: {
    ...mapGetters([
      'countries',
      'currencies',
      'langs',
      'currentCountry',
      'currentCurrency',
      'currentLang',
      'currentSite'
    ]),
    /**
     * 临时当前选中国家，没保存情况下
     */
    tempCurrentCountry () {
      if (this.tempCountryCode) {
        return this.countries.find(item => item.country_abbreviation === this.tempCountryCode)
      } else {
        return this.currentCountry
      }
    },
    /**
     * 临时当前选中货币，没保存情况下
     */
    tempCurrentCurrency () {
      if (this.tempCurrencyCode) {
        return this.currencies.find(item => item.isoCode === this.tempCurrencyCode)
      } else {
        return this.currentCurrency
      }
    },
    /**
     * 临时当前选中语言，没保存情况下
     */
    tempCurrentLang () {
      if (this.tempLangCode) {
        return this.langs.find(item => item.abbreviation === this.tempLangCode)
      } else {
        return this.currentLang
      }
    }
  },
  methods: {
    ...mapActions([
      'changeCountry',
      'changeCurrency',
      'changeLang'
    ]),
    ...mapMutations({
      hideSiderBar: HIDE_SIDER_BAR
    }),
    selectedCountry (countryCode) {
      this.openKey = null
      this.tempCountryCode = countryCode
    },
    selectedCurrency (currencyCode) {
      this.openKey = null
      this.tempCurrencyCode = currencyCode
    },
    selectedLang (langCode) {
      this.openKey = null
      this.tempLangCode = langCode
    },
    clickPicker (key) {
      if (this.openKey === key) {
        this.openKey = null
      } else {
        this.openKey = key
      }
    },
    clickSave () {
      this.openKey = null
      if (this.tempCountryCode && this.tempCountryCode !== this.currentCountry.country_abbreviation) {
        this.changeCountry(this.tempCountryCode)
      }
      if (this.tempCurrencyCode && this.tempCurrencyCode !== this.currentCurrency.isoCode) {
        this.changeCurrency(this.tempCurrencyCode)
      }
      if (this.tempLangCode && this.tempLangCode !== this.currentLang.abbreviation) {
        this.changeLang(this.tempLangCode)
        // 处理语言切换后逻辑，如果切换语言后卸载对应页面Store模块并router.replace()好让API数据更新
        if (this.$route.meta.storeModule) {
          this.$store.unregisterModule(this.$route.meta.storeModule)
        }
        document.querySelector('html').setAttribute('id', `country-${this.tempLangCode}`)
        this.$router.replace({
          name: this.$route.name,
          params: Object.assign(this.$route.params, { lang: this.$store.state.langCode === 'en' ? null : this.$store.state.langCode }),
          query: this.$route.query
        })
      }

      // 处理切换站点逻辑，如切换国家映射的站点（siteAbb）跟当前站点不一致就需要强制刷新到国家对应站点域名
      if (this.$store.state.siteAbb !== this.currentSite) {
        delLocalStore('currentInfo')
        this.changeCurrency(this.tempCurrentCountry.iso_code)
        this.changeLang(this.tempCurrentCountry.site_language === 'zh-tw' ? 'zh' : this.tempCurrentCountry.site_language)
        const host = location.host.replace(/^[a-z]{2,4}-m/, `${this.currentSite}-m`)
        const urlLang = this.$route.params.lang
        let uri = this.$route.fullPath.replace(/country_code=[A-Z]{2,2}/, '')
        if (urlLang) {
          uri = uri.replace(`/${urlLang}`, '')
        }
        location.replace(`//${host}${uri}`)
      } else {
        // 切换货币和国家不切换站点,只更新当前数据不刷新页面
        const oldNeedData = {}
        oldNeedData.country_abbreviation = this.tempCurrentCountry.country_abbreviation
        oldNeedData.country_name = this.tempCurrentCountry.country_name
        oldNeedData.free_shipping_tips = this.tempCurrentCountry.free_shipping_tips
        oldNeedData.national_flag = this.tempCurrentCountry.national_flag
        oldNeedData.phone_area_code = this.tempCurrentCountry.phone_area_code
        oldNeedData.site_abb = this.tempCurrentCountry.site_abb
        oldNeedData.iso_code = this.tempCurrentCurrency.isoCode
        oldNeedData.symbol_display = this.tempCurrentCurrency.symbolDisplay
        oldNeedData.self_to_usd_exchange_rate = this.tempCurrentCurrency.stuExchangeRate
        oldNeedData.usd_to_self_exchange_rate = this.tempCurrentCurrency.utsExchangeRate
        oldNeedData.site_language = this.tempCurrentLang.abbreviation === 'zh-tw' ? 'zh' : this.tempCurrentLang.abbreviation
        setLocalStore('currentInfo', oldNeedData)
      }
      this.hideSiderBar()
    }
  }
}
</script>

<style lang="less" scoped>
.sider-bar-setting {
  // background-color: bisque;
  .save {
    line-height: 40px;
    border-radius: 5px;
    background: #444;
    color: #fff;
    text-align: center;
    margin: 20px 10px;
    width: calc(100% - 20px);
  }
}

</style>
