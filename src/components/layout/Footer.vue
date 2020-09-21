<template>
  <div class="footer">
    <!-- 页面链接和APP下载链接 -->
    <div class="jump-link clearfix">
      <div class="list left">
        <PatRouterLink tabindex="0" to="/article/footer-concat?address=COMPANYINFO">{{$t('common.footer.company_info')}}</PatRouterLink>
      </div>
      <div class="list left">
        <PatRouterLink tabindex="0" to="/article/footer-concat?address=CUSTOMERSUPPORT">{{$t('common.footer.customer_support')}}</PatRouterLink>
      </div>
      <div class="list left">
        <PatRouterLink tabindex="0" to="/article/celebrity_application">{{$t('common.footer.influencer_program')}}</PatRouterLink>
      </div>
      <div class="list left">
        <PatRouterLink tabindex="0" to="/article/affiliate-pro">{{$t('common.footer.affiliates_program')}}</PatRouterLink>
      </div>
      <div class="list left app">
        <a tabindex="0" href="https://itunes.apple.com/us/app/patpat-daily-deals-for-moms/id966740633?mt=8" target="_blank" rel="noreferrer">
          <img src="../../assets/images/footer/appStore-icon.png" />
          <span>{{$t('common.footer.dowload_the')}}<br />{{$t('common.footer.app_store')}}</span>
        </a>
      </div>
      <div class="list left app">
        <a tabindex="0" href="https://play.google.com/store/apps/details?id=com.interfocusllc.patpat" target="_blank" rel="noreferrer">
          <img src="../../assets/images/footer/googlePlay-icon.png" />
          <span>{{$t('common.footer.get_it')}}<br /> {{$t('common.footer.google_play')}}</span>
        </a>
      </div>
    </div>

    <!-- 银行卡 logo -->
    <div class="payment-logo">
      <div class="norton-icon">
        <a tabindex="0" @click="openNorthFn">
          <img src="../../assets/images/footer/footer_img9.png">
        </a>
        <a tabindex="0" @click="openResellerFn">
          <img src="../../assets/images/footer/footer_img10.png">
        </a>
      </div>
      <div class="pay-icon">
        <!-- 中东 -->
        <span v-if="arCODLogo.indexOf(curCountry) >= 0" class="arCOD_logo" aria-label="COD"></span>

        <!-- 沙特阿拉伯 -->
        <span v-if="curCountry === 'SA'" class="mada_logo" aria-label="mada"></span>

        <!-- 法国 -->
        <span v-if="curCountry === 'FR'" class="carte_bancaire_logo" aria-label="Carte Bancaire"></span>

        <!-- 通用 -->
        <span class="visa_logo" aria-label="Visa"></span>
        <span class="mastercard_logo" aria-label="mastercard"></span>
        <span class="american_express_logo" aria-label="american express"></span>
        <span class="diners_club_logo" aria-label="Diners Club"></span>
        <span class="discover_logo" aria-label="Discover"></span>
        <span class="jcb_logo" aria-label="JCB"></span>
        <span class="unionpay_logo" aria-label="unionpay"></span>
        <span class="paypal_logo" aria-label="paypal"></span>
        <span v-if="sofortLogo.indexOf(curCountry) >= 0" class="sofort_logo" aria-label="Sofort"></span>

        <!-- 巴西 -->
        <template v-if="curCountry === 'BR'">
          <span class="hipercard_logo" aria-label="Hipercard"></span>
          <span class="elo_logo" aria-label="ELO"></span>
          <span class="boleto_logo" aria-label="Boleto"></span>
        </template>

        <!-- 墨西哥 -->
        <template v-if="curCountry === 'MX'">
          <span class="carnet_logo" aria-label="carnet"></span>
          <span class="OXXO_logo" aria-label="OXXO"></span>
        </template>

        <!-- 荷兰 -->
        <span v-if="curCountry === 'NL'" class="ideal_logo" aria-label="ideal"></span>

        <!-- 波兰 -->
        <span v-if="curCountry === 'PL'" class="dotpay_logo" aria-label="dotpay"></span>

        <!-- 德国 -->
        <span v-if="curCountry === 'DE'" class="giropay_logo" aria-label="Giropay"></span>

        <!-- 中国 -->
        <template v-if="curCountry === 'CN'">
          <span class="wechatpay_logo" aria-label="Wechatpay"></span>
          <span class="alipay_logo" aria-label="Alipay"></span>
        </template>

        <!-- 中国COD -->
        <span v-if="CODLogo.indexOf(curCountry) >= 0" class="COD_logo" aria-label="COD"></span>

        <!-- uk de 站点 -->
        <span v-if="kiarnaLogo.indexOf(siteAbb) !== -1" class="kiarna_logo" aria-label="kiarna"></span>
      </div>
    </div>

    <!-- 返回顶部 -->
    <ReturnTop></ReturnTop>
  </div>
</template>

<script>
import ReturnTop from '../../components/base/ReturnTop.vue'

export default {
  components: {
    ReturnTop
  },
  data () {
    return {
      curCountry: this.$store.state.countryCode,
      siteAbb: this.$store.state.siteAbb,
      arCODLogo: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      sofortLogo: ['AT', 'BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'PL'],
      CODLogo: ['SG', 'MY', 'TH', 'HK', 'TW'],
      kiarnaLogo: ['uk', 'de']
    }
  },
  methods: {
    openNorthFn () {
      window.open('https://trustsealinfo.websecurity.norton.com/splash?form_file=fdf%2Fsplash.fdf&sap=&dn=www.patpat.com&zoneoff=&lang=en', 'newwindow', 'width=542px,height=547px')
    },
    openResellerFn () {
      window.open('https://seals.resellerratings.com/landing.php?seller=780777', 'name', 'height=760,width=780,scrollbars=1')
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.jump-link {
  display: block;
  background: url('../../assets/images/footer/footer_img5.png') no-repeat top center;
  background-size: cover;
  .list {
    width: 50%;
    height: 49px;
    font-size: 12px;
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid #f1f3f2;
    &:nth-child(odd) {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 15px;
        height: 20px;
        width: 1px;
        background: #fde0dd;
      }
    }
    &.app {
      line-height: normal;
      img {
        display: inline-block;
        width: 16px;
      }
      span {
        display: inline-block;
        position: relative;
        top: 10px;
        margin-left: 10px;
        line-height: 15px;
        text-align: left;
      }
    }
  }
}

.payment-logo {
  background: url('../../assets/images/footer/footer_img8.png') no-repeat;
  background-size: cover;
  padding: 25px 0 5px;
  .norton-icon {
    text-align: center;
    a {
      display: inline-block;
      margin: 0 25px;
      width: 80px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .pay-icon {
    text-align: center;
    padding-top: 25px;
    span {
      display: inline-block;
      width: 52px;
      height: 30px;
      margin-bottom: 10px;
      background: url('../../assets/images/footer/payment-logo.png') no-repeat;
      background-size: 312px;
      &.arCOD_logo {
        background-position: -196px 1px;
      }
      &.kiarna_logo {
        background-position: -62.4px -182px;
      }
      &.mada_logo {
        background-position: -129.6px -109px;
      }
      &.carte_bancaire_logo {
        background-position: -64px -36px;
      }
      &.visa_logo {
        background-position: -195px -145.6px;
      }
      &.mastercard_logo {
        background-position: -195px -107.2px;
      }
      &.american_express_logo {
        background-position: 2px 1px;
      }
      &.diners_club_logo {
        background-position: -195px -36px;
      }
      &.discover_logo {
        background-position: -262px -36px;
      }
      &.jcb_logo {
        background-position: -64px -108px;
      }
      &.unionpay_logo {
        background-position: -130px -145px;
      }
      &.paypal_logo {
        background-position: 3px -145px;
      }
      &.sofort_logo {
        background-position: -64px -146px;
      }
      &.hipercard_logo {
        background-position: -262px -72px;
      }
      &.elo_logo {
        background-position: -64px -72px;
      }
      &.carnet_logo {
        background-position: 2px -36px;
      }
      &.OXXO_logo {
        background-position: -262px -108px;
      }
      &.boleto_logo {
        background-position: -263px 2px;
      }
      &.ideal_logo {
        background-position: 3px -109px;
      }
      &.dotpay_logo {
        background-position: 3px -72px;
      }
      &.giropay_logo {
        background-position: -130px -72px;
      }
      &.wechatpay_logo {
        background-position: -263.2px -145.6px;
      }
      &.alipay_logo {
        background-position: -64px 1px;
      }
      &.COD_logo {
        background-position: -130px -35.2px;
      }
    }
  }
}
</style>
