<!--
  登录注册
-->
<template>
  <div class="login-inregister" :class="{'bg-whihte': collectFavProduct}" id="login">
    <button v-if="collectFavProduct" class="back-btn" aria-label="back" @click="backRouter">
      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" class="back-icon">
        <line x1="0" y1="0" x2="16" y2="16"></line>
        <line x1="16" y1="0" x2="0" y2="16"></line>
      </svg>
    </button>
    <div class="content">
      <!-- 切换 -->
      <div class="switch-tab clearfix">
        <PatRouterLink class="left" tabindex="0" to="/account/register" replace @click.native="switchTab('register-form')">{{$t('account.login.new_to_patpat')}}</PatRouterLink>
        <PatRouterLink class="right" tabindex="0" to="/account/login" replace @click.native="switchTab('login-form')">{{$t('account.login.sign_in')}}</PatRouterLink>
      </div>

      <!-- 登录注册模块 -->
      <keep-alive>
        <component :recaptchaKey="recaptchaKey" :is="componentName" @opeSuccess="loginRegisterSuccess"></component>
      </keep-alive>

      <!-- OR -->
      <div class="or">
        <i>{{$t('account.login.or')}}</i>
      </div>

      <!-- FB && Google 登录 -->
      <FacebookLogin @opeSuccess="loginRegisterSuccess"></FacebookLogin>
      <GoogleLogin @opeSuccess="loginRegisterSuccess"></GoogleLogin>

      <!-- Agree Service -->
      <div class="agree-service">
        <p>{{$t('account.login.privacy_protected')}}</p>
        <PatRouterLink tabindex="0" to="/privacy">{{$t('account.login.privacy_policy')}}</PatRouterLink>
      </div>
    </div>
  </div>
</template>
<script>
import LoginForm from '../../components/login/LoginForm.vue'
import RegisterForm from '../../components/login/RegisterForm.vue'
import FacebookLogin from '../../components/login/FacebookLogin.vue'
import GoogleLogin from '../../components/login/GoogleLogin.vue'
import { setLocalStore } from '../../utils/storage'
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { seoPatPatTdk } from '@/assets/js/common.js'
import trackMerge from '@/mixins/trackMerge'
import adTrackAddToFavorites from '@/assets/js/gtmEvent/addToFavorites.js'

export default {
  name: 'login',
  mixins: [trackMerge],
  components: {
    LoginForm,
    RegisterForm,
    FacebookLogin,
    GoogleLogin
  },
  data () {
    return {
      componentName: this.$route.path.indexOf('register') >= 0 ? 'register-form' : 'login-form',
      recaptchaKey: ''
    }
  },
  computed: {
    ...mapState([
      'collectFavProduct'
    ]),
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    })
  },
  serverPrefetch () {
    const siteAbb = this.$ssrContext.siteInfo.siteAbb
    this.$ssrContext.title = this.$t('account.login.login_mate_title', { tdk: seoPatPatTdk(siteAbb) })
  },
  methods: {
    ...mapMutations({
      changeHeaderState: 'CHANGE_HEADER_STATE',
      changeFooterState: 'CHANGE_FOOTER_STATE',
      changeActivityState: 'CHANGE_ACTIVITY_STATE',
      changeTopFree: 'CHANGE_TOP_FREE',
      changeTopIcon: 'CHANGE_TOP_ICON',
      setFavProduct: 'SET_FAV_PRODUCT',
      setUserFavorites: 'SET_USER_FAVORITES'
    }),
    ...mapActions({
      setUserInfo: 'setUserInfo'
    }),
    switchTab (component) {
      this.componentName = component
    },
    loginRegisterSuccess (data) {
      // 登录(google,fb,email)\注册完成后统一传参到 vuex
      data.status = true
      this.setUserInfo(data)
      if (this.collectFavProduct) {
        this.favProduct(this.collectFavProduct, this.collectFavProduct.idx)
      }
      // 检查上一个页面路由
      // this.$router.push(getLocalStore('prev-link') || '/')
      this.$router.go(-1)
    },
    backRouter () {
      this.setFavProduct(null)
      // this.$router.push(getLocalStore('prev-link') || '/')
      this.$router.go(-1)
    },
    getUserFavorite () {
      this.patpatAPI.usersFavorites().then(res => {
        const favoriteIds = res.map(product => product.product_id)
        this.setUserFavorites(favoriteIds)
      })
    },
    favProduct (item) {
      const param = {
        event_id: item.event_id,
        product_id: item.product_id
      }

      if (!item.is_favorite) {
        const trackData = {
          product_id: item.product_id,
          sku_id: item.sku_id || 0,
          product_price: item.price,
          product_name: item.product_name,
          product_category: item.crumb ? item.crumb.replace(/[>]/g, '/') : ''
        }
        if (item.sku_id && item.sku_id > 0) {
          adTrackAddToFavorites(trackData)
        } else {
          this.patpatAPI.detailProduct({ product_name: item.product_url }).then(res => {
            const firstColor = res.images.map(sItem => sItem.color)[0].toLowerCase()
            const product = res.products
            for (let i = 0; i < product.length; i++) {
              for (let j = 0; j < product[i].option.length; j++) {
                if (product[i].option[j].color && product[i].option[j].color.toLowerCase() === firstColor) {
                  trackData.sku_id = product[i].sku_id
                  adTrackAddToFavorites(trackData)
                  return
                }
              }
            }
          })
        }
      }

      this.patpatAPI.favoritesAdd(param).then(() => {
        this.setFavProduct(null)
        this.getUserFavorite()
      })
      this.appendClickTrackData('click_favorite')
    }
  },
  mounted () {
    this.changeTopIcon('lg')
    this.changeTopFree(false)
    // 存储上一个路由，登录注册完成跳回上一个路由
    const state = this.$store.state.route.from
    if (state.name !== 'login-register') {
      setLocalStore('prev-link', state.fullPath)
    }
    if (this.collectFavProduct) {
      this.changeHeaderState(false)
      this.changeFooterState(false)
      this.changeActivityState(false)
    }
  },
  destroyed () {
    this.changeTopIcon('')
    this.changeTopFree(true)
    this.changeHeaderState(true)
    this.changeFooterState(true)
    this.changeActivityState(true)
  }
}
</script>
<style scoped lang="less">
.login-inregister {
  padding: 10px;
  text-align: center;
  background-color: #f1f3f2;
  .back-btn {
    position: relative;
    &:before { content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; }
    position: absolute;
    right: 24px;
    top: 12px;
    .back-icon {
      stroke: #000;
      stroke-width: 1px;
    }
  }
  &.bg-whihte {
    background-color: #fff;
  }
  .content {
    background: #fff;
    border-radius: 5px;
    padding: 15px 15px 30px;
  }
}
.switch-tab {
  padding: 20px 30px;
  a {
    font-size: 16px;
    color: #9ba5a7;
    padding-bottom: 7px;
    &.router-link-active {
      color: #f1435a;
      border-bottom: 2px solid #f1435a;
    }
  }
}
.or {
  position: relative;
  margin: 10px 0;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    top: 50%;
    background: #cdd2d3;
  }
  i {
    position: relative;
    z-index: 2;
    padding: 0 20px;
    font-size: 16px;
    color: #9ba5a7;
    background: #fff;
  }
}
.agree-service {
  margin-top: 30px;
  font-size: 12px;
  color: #9ba5a7;
  a {
    color: #6c7eb1;
    text-decoration: underline;
  }
}
</style>
<style lang="less">
#login {
  .input-box {
    position: relative;
    display: block;
    margin-bottom: 10px;
    .iconfont {
      position: absolute;
      right: 12px;
      top: 20px;
      color: #666;
    }
    &.to {
      span{
        font-size: 12px;
        top: 30%;
        color: #86878a;
      }
    }
    span {
      position: absolute;
      left: 15px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      -webkit-transition: .2s;
      transition: .2s;
      color: #86878a;
      z-index: 9;
    }
    input {
      display: block;
      width: 100%;
      height: 50px;
      padding: 25px 15px 10px 15px;
      margin-top: 5px;
      border: 1px solid #cdd2d3;
      font-size: 16px;
      border-radius: 5px;
    }
  }
  .error {
    padding-bottom: 5px;
    word-break: break-all;
    text-align: left;
    color: #ff2556;
    font-size: 14px;
  }
  .login-btn {
    margin-top: 20px;
  }
  .forgot-password {
    display: block;
    text-align: right;
    a {
      display: inline-block;
      color: #9ba5a7;
    }
  }
}
#country-ar #login {
  .input-box {
    span {
      left: auto;
      right: 15px;
    }
    .iconfont {
      right: auto;
      left: 12px;
    }
  }
  .forgot-password {
    text-align: left;
  }
}
</style>
<style>
  .grecaptcha-badge{
    display: none !important;
  }
</style>
