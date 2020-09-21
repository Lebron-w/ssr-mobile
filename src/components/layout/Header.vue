<template>
  <div class="header">
    <!-- 导航左侧功能区 -->
    <div class="left-features" >
      <button aria-label="nav back" class="nav-back-btn" v-if="showBackBtn" @click="pageBack">
        <pui-icon name='arrow-left'></pui-icon>
      </button>
      <!-- 左侧菜单栏 -->
      <button class="side-spread-btn" :class="{'new': cateGuide }" @click="clickSideSpread">
        <pui-icon name='side-spread'></pui-icon>
      </button>

      <!-- 网站图标 -->
      <div class="logo">
        <PatRouterLink to='/'>
          <img src="../../assets/images/base/logo.png" alt="patpat logo" v-if="langCode !== 'ar'"/>
          <img src="../../assets/images/base/ar_logo.png" alt="patpat logo" v-if="langCode === 'ar'"/>
        </PatRouterLink>
      </div>
    </div>

    <!-- 导航右侧功能区 -->
    <div class="right-features">
      <PatRouterLink tabindex="0" :to="loginStatus ? '/user-center' : '/account/register'" class="right-features-btn" :class="'login-' + topIconType">
        <pui-icon :name='loginIcon ? "logged-in" : "login"'></pui-icon>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/pop-search" class="right-features-btn" :class="'search-' + topIconType">
        <pui-icon name='search' class="sch-icon"></pui-icon>
      </PatRouterLink>
      <PatRouterLink tabindex="0" class="right-features-btn" to="/order/cart">
        <span v-if="topCartProNum > 0">{{topCartProNum}}</span>
        <pui-icon name='shopping-bag'></pui-icon>
      </PatRouterLink>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { SHOW_SIDER_BAR, HIDE_SIDER_BAR, NAVIGATION_INFO } from '../../store/mutation-types.js'
import { setSessionStorage, getSessionStorage } from '../../utils/storage'
import trackChildren from '@/mixins/trackChildren'

export default {
  mixins: [trackChildren],
  data () {
    return {
      loginIcon: '',
      opeanPolicy: true
    }
  },
  computed: {
    ...mapState({
      topIconType: 'topIconType',
      loginStatus: 'loginStatus',
      topCartProNum: 'topCartProNum',
      countryCode: 'countryCode',
      langCode: 'langCode'
    }),
    ...mapGetters({
      cateGuide: 'cateGuide'
    }),
    showBackBtn () {
      const categoryHide = this.$route.name === 'category' && !(this.$route.params && this.$route.params.c2)
      return !this.$route.meta.hideBack && !categoryHide
    }
  },
  watch: {
    'loginStatus' () {
      this.loginIcon = this.loginStatus
    }
  },
  methods: {
    ...mapMutations({
      shwoSiderBar: SHOW_SIDER_BAR,
      hideSiderBar: HIDE_SIDER_BAR,
      storeNavInfo: NAVIGATION_INFO
    }),
    ...mapActions({
      setCateGuide: 'setCateGuide'
    }),
    clickSideSpread () {
      this.shwoSiderBar()
      if (this.cateGuide) {
        this.appendClickTrackData('category_newfish_button')
        this.setCateGuide(Date.now() + '_0')
      }
    },
    clickCart () {

    },
    pageBack () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.loginIcon = this.loginStatus

    // 欧洲国家显示隐私协议
    const EuropeCountry = ['GB', 'DE', 'FR', 'BE', 'NL', 'ES', 'PT', 'NO', 'SE', 'PL', 'IT', 'IE', 'UA', 'RU', 'IL', 'GR', 'FI', 'DK', 'CZ', 'RO', 'AT', 'LU', 'BY', 'BR', 'BG', 'HR', 'EE', 'HU', 'LV', 'LT',
      'MT', 'SE', 'SI', 'CH', 'TR', 'CY', 'SK', 'AN', 'AM', 'AZ', 'GE', 'KS', 'LE', 'MA', 'MC', 'MN', 'SM', 'AL', 'MD', 'IC']
    if (EuropeCountry.indexOf(this.countryCode) >= 0 && !getSessionStorage('policy')) {
      this.$patDialogs({
        title: 'Welcome!',
        message: 'We use cookies to give you the best shopping experience. If you continue to use our services or create a new account, we will assume that you agree to our <a href="/privacy">Privacy Policy.</a>',
        close: true,
        cancelButtonText: 'I Accept',
        cancelButtonTextStyle: {
          borderRadius: '0',
          color: '#fff',
          background: '#444444',
          borderColor: '#444444'
        }
      }).catch(() => {
        setSessionStorage('policy', true)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  .left-features {
    height: 100%;
    display: flex;
    align-items: center;
    .side-spread-btn {
      float: left;
      height: 45px;
      width: 40px;
      position: relative;
      i {
        font-size: 20px;
      }
      &.new {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f1435a;
          right: 0;
          top: 10px;
        }
      }
    }
    .logo {
      width: 90px;
      float: left;
      margin-left: 5px;
      a {
        display: block;
        img {
          width: 90%;
        }
      }
    }
    .side-guide {
      &::after{
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f1435a;
        right: 0;
        top: 6px;
      }
    }
  }
  .right-features {
    height: 100%;
    display: flex;
    align-items: center;
    .right-features-btn {
      position: relative;
      width: 45px;
      height: 45px;
      height: 100%;
      line-height: 45px;
      text-align: center;
      font-weight: bold;
      span {
        position: absolute;
        right: 2px;
        top: 8px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #fff;
        background: #ff2556;
        border-radius: 100%;
      }
      i {
        position: relative;
        z-index: 1;
        font-size: 18px;
      }
      .sch-icon {
        display: inline-block;
        transform: rotate(90deg);
      }
    }
    .search-se, .login-lg {
      background-color: @pp-gray-bg-color;
      color: @pp-font-select-color;
    }
  }
}

.policy {
  position: absolute;
  background: 50% no-repeat #fff;
  top: 50%;
  left: 20px;
  right: 20px;
  width: auto;
  height: auto;
  margin: auto;
  padding: 20px 25px 30px;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
}

.nav-back-btn {
  height: 20px;
  width: 12px;
  margin: 0 7px 0 10px;
  position: relative;
  display: inline-block;
}

#country-ar {
  .nav-back-btn {
    transform: rotate(180deg);
  }
  .left-features {
    .side-spread-btn {
      &.new {
        &::before {
          left: 0;
          right: auto;
        }
      }
    }
    .logo {
      margin-left: 0;
      margin-right: 5px;
    }
  }
}
</style>
