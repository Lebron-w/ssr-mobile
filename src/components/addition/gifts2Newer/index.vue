<template>
  <div class="gifts-newer-style">
    <!-- 浮标入口 -->
    <div class="gift-tool" :class="[showTip ? 'outRight' : 'inRight']" @click="getGifts(true)" v-if="displayDom">
      <div class="tool-img">
        <img src="@/assets/images/activities/gift-tools.png" alt />
      </div>
      <div class="tool-tips">10% OFF</div>
    </div>
    <!-- 购物车处填写 -->
    <!-- 弹窗填写 -->
    <PuiPopup :model.sync="dialogCtxShow" width="100%" class="popup-style">
      <div :class="{'content-div': !userGiftStatus}">
        <div v-if="userGiftStatus">
          <transition name="zoomIn" mode="out-in">
            <div v-if="showGift2Newer" key="default">
              <div class="gifts-content-dialog">
                <div class="new-content">
                  <button class="close" @click="closeContent" aria-label="close the overlay">x</button>
                  <h3>{{$t('common.header.gifts_modal_new_title')}}</h3>
                  <input
                    :disabled="isSign"
                    :placeholder="$t('common.header.gifts_regist_place_holder')"
                    aria-label="email"
                    v-model="email"
                    type="text"
                  />
                  <p class="tip">{{emailError}}</p>
                  <div class="login-box">
                    <button
                      class="btn reg"
                      @click="getRewardsValidate()"
                    >{{$t('common.header.gifts_modal_get_voucher_btn_txt')}}</button>
                    <div class="or">{{$t('common.header.or_sign_up')}}</div>
                    <div class="other-login">
                      <button class="btn fb-login" @click="fbLoginState" aria-label="facebook login"></button>
                      <button class="btn google-login" @click="googleLogin" aria-label="google login"></button>
                    </div>
                    <div class="regist-tips">
                      <!-- todo href 需要langUrl -->
                      <i18n path="common.header.gifts_regist_tips" tag="p">
                        <template v-slot:TermsOfService>
                          <a tabindex="0" :href="'/terms'" >{{$t('common.service')}}</a>
                        </template>
                        <template v-slot:PrivacyPolicy>
                          <a tabindex="0" :href="'/privacy'">{{$t('common.privacy')}}</a>
                        </template>
                      </i18n>
                    </div>
                    <p class="login-tips">
                      {{$t('common.header.have_account')}}
                      <patRouterLink
                        class="go-login"
                        to="/account/login"
                        @click.native="loginTrack()"
                      >{{$t('common.header.login_here')}}</patRouterLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else key="success" class="success-gifts">
              <button class="close-patPopup" @click="closePopup" aria-label="close the overlay">
                <PuiIcon name="close-circle"></PuiIcon>
              </button>
              <div>
                <template>
                  <div class="success-smile">
                    <PuiIcon name="child-smile"></PuiIcon>
                  </div>
                  <p class="new first">{{$t('common.header.get_gifts_successMsg')}}</p>
                  <p class="new">{{$t('common.header.find_coupon')}}</p>
                  <p class="new" v-show="showSendPwd">{{$t('common.header.pwd_to_email')}}</p>
                </template>
              </div>
            </div>
          </transition>
        </div>
        <!-- <div v-if="!userGiftStatus" class="none-gifts">{{$t('common.header.get_gifts_error_msg')}}</div> -->
      </div>
    </PuiPopup>
  </div>
</template>

<script>
import { isEmail } from '@/utils/regexp.js'
import trackChildren from '@/mixins/trackChildren.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [trackChildren],
  data () {
    return {
      showTip: false,
      showGift2Newer: true,
      userGiftStatus: true,
      email: '', // 输入的邮件，或者登录用户的邮箱信息
      emailError: '',
      showSendPwd: false,
      dialogCtxShow: false,
      isMounted: false
    }
  },
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    }),
    // 标记是否登录
    isSign () {
      return this.$store.state.userInfo.status
    },
    // 顶部未登录或者新用户未产生消费情况下展示的优惠劵广告
    displayDom () {
      if (this.$isServer) {
        return false
      }
      // 等待接口
      if (!this.$store.state.navInfo) {
        return false
      }
      const isLogin = this.$store.state.loginStatus
      const norecord = this.$ppUtils.safe(this.$store.state.navInfo, 'user_gift_package.status', false)
      const showCur = this.$route.meta && this.$route.meta.showGift2Newer
      let isShow = (!isLogin || (isLogin && norecord)) && showCur && this.isMounted
      const existMemberDay = this.$ppUtils.safe(this.$store.state.navInfo, 'is_exist_member_day', false)
      const vipFirstOPen = window.localStorage.getItem('vipFirstOPen')
      // 如果有vipDay并且还没显示，则不显示当前弹窗
      if (existMemberDay && !vipFirstOPen) {
        isShow = false
      }
      if (isShow) {
        this.appendShowTrackData('show_gifts_for_newer')
      }
      if (this.isMounted && isShow) {
        this.firstOpenHandle()
      }
      return isShow
    }
  },
  mounted () {
    this.isMounted = true
    if (this.isSign) {
      this.email = this.$ppUtils.safe(this.$store.state, 'userInfo.email', '')
    }
    this.sdkInit()
    this.initAnimation()
  },
  methods: {
    ...mapActions({
      setUserInfo: 'setUserInfo',
      registerByEmail: 'registerByEmail'
    }),
    initAnimation () {
      const openTimeout = setTimeout(() => {
        this.showTip = true
        clearTimeout(openTimeout)
      }, 5000)

      const closeTimeout = setTimeout(() => {
        this.showTip = false
        clearTimeout(closeTimeout)
      }, 10000)
    },
    sdkInit () {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: 270202583150184,
          cookie: true, // enable cookies to allow the server to access
          xfbml: true, // parse social plugins on this page
          version: 'v2.8' // use graph api version 2.8,
        })
        //        FB.AppEvents.logPageView();
      };

      (function (d, s, id) {
        var js
        var fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk');

      (function (d, s, id) {
        var js
        var fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://apis.google.com/js/client:platform.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'google-jssdk')
    },
    getGifts () {
      this.dialogCtxShow = true
      console.log('dialogCtxShow getGifts', this.dialogCtxShow)
      this.appendClickTrackData('click_gifts_for_newer')
    },
    closeContent () {
      this.dialogCtxShow = false
      console.log('dialogCtxShow closeContent', this.dialogCtxShow)
      this.appendClickTrackData('click_close_gifts')
      this.$emit('updateVisible', true)
    },
    closePopup () {
      this.dialogCtxShow = false
      console.log('dialogCtxShow closePopup', this.dialogCtxShow)
      // 以前有点击背景关闭则为 ShodowClose（没发现有用）
      this.appendClickTrackData('click_close_gifts')
    },
    getRewardsValidate () {
      this.appendClickTrackData('get_gifts_for_newer')
      if (this.isSign) {
        this.emailError = ''
        this.showGift2Newer = false
        this.showSendPwd = true

        setTimeout(() => {
          this.closePopup()
        }, 4300)
        return false
      }
      if (!isEmail(this.email)) {
        this.emailError = this.$t('common.header.gifts_regist_email_erro')
        return false
      }
      this.getRewards()
    },
    getRewards () {
      const param = {
        email: this.email
      }
      this.registerByEmail(param)
        .then((res) => {
          // 成功
          this.appendClickTrackData('gifts_banner_register')
          this.loginSuccessHandle(res)

          // if (this.pageName === "confirm") {
          //   this.visibility = false;
          //   this.$emit("refreshCartInfo");
          // }
        })
        .catch((err) => {
          if (err.code === 1000) {
            // let name = showBanner === true ? "cartNoLogin" : "noLogin";
            // sessionStorage.setItem("click_get_login_status", name);
            // sessionStorage.setItem("user_get_gift", false);
            const options = {
              from: 'NewUser5Vouchers',
              email: this.email
            }
            this.appendClickTrackData('gifts_redirect_login')
            this.$emit('toLogin', options)
          } else {
            // 邮箱已被注册,格式不正确
            this.emailError = err.message
              ? err.message
              : 'Register fail, please try again later'
          }
        })
    },
    fbLoginState () {
      this.appendClickTrackData('newuser_fb_register')
      this.checkLoginState()
    },
    checkLoginState () {
      const _this = this
      window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          console.dir(response)
          const userId = response.authResponse.userID
          _this.getFaceBookUserInfo(userId)
        } else {
          window.FB.login(_this.checkLogin, {
            scope: 'email,public_profile',
            return_scopes: true
          })
        }
      })
    },

    checkLogin: function (response) {
      if (response.status === 'connected') {
        console.dir(response)
        const userId = response.authResponse.userID
        this.getFaceBookUserInfo(userId)
      }
    },

    // 通过userId获取用户信息
    getFaceBookUserInfo (userId) {
      const _this = this
      window.FB.api(
        '/' + userId + '/?fields=id,first_name,last_name,email',
        'GET',
        {},
        function (response) {
          // Insert your code here
          console.log(response)
          _this.facebookLogin(response)
        }
      )
    },
    // 提交facebookId到后台
    facebookLogin (data) {
      const param = {
        user_id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar: '',
        gender: '',
        old_user_id: this.userId ? this.userId : 0
      }

      this.patpatAPI.facebookLoginUrl(param).then((res) => {
        res.status = true
        this.setUserInfo(res)
        this.loginSuccessHandle(res)
      }).catch(() => {
        console.dir('facebook  login failed')
      })
    },
    googleLogin () {
      if (this.inCart) {
        this.appendClickTrackData('New_user_voucher_Cart_Google')
      } else {
        this.appendClickTrackData('New_user_voucher_Google')
      }
      // 定时等待gapi加载完成
      const openAuth = setInterval(() => {
        if (window.gapi) {
          window.gapi.load('auth2', function () {
            window.auth2 = window.gapi.auth2.init({
              client_id:
                '1082033751824-dvrdt28b0u1e5k24sbb7r54cic279r7v.apps.googleusercontent.com'
            })
          })
          window.auth2.grantOfflineAccess().then((code) => {
            this.patpatApi.webGoogleLogin({ code: code.code }).then((res) => {
              res.status = true
              this.setUserInfo(res)
              this.loginSuccessHandle(res)
            })
          })
          clearInterval(openAuth)
        }
      }, 500)
    },
    loginSuccessHandle (res) {
      // this.$parent.userGiftStatus = res.data.user_gift_package.status;
      this.showNoneGifts = res.user_gift_package.status
      this.showGift2Newer = false
      this.showSendPwd = true
      this.cartBanner = false

      setTimeout(() => {
        this.closePopup()
      }, 4000)
      if (this.$route.name === 'cart') {
        this.$emit('refreshCartInfo')
      }
    },
    loginTrack (isShow) {
      this.dialogCtxShow = isShow
      console.log('dialogCtxShow loginTrack', this.dialogCtxShow)
      this.appendClickTrackData('auto_click_gifts_for_newer')
    },
    firstOpenHandle () {
      // 没有登录的情况，第一次直接弹出窗口
      const firstOpen = localStorage.getItem('first_open_gift') !== 'false'
      localStorage.setItem('first_open_gift', false)
      if (firstOpen) {
        console.log('firstOpenHandle', firstOpen)
        this.loginTrack(firstOpen)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gifts-newer-style {
  .gift-tool {
    position: fixed;
    z-index: 29;
    right: 0;
    bottom: 260px;
    height: 40px;
    transition: ease-in 500ms;
    .tool-img {
      float: left;
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 50%;
      margin-right: -5px;
      box-shadow: 0px 0px 10px #b3b3b3;
      img {
        margin-top: 7px;
        margin-left: 5px;
        width: 30px;
        height: 26px;
      }
    }
    .tool-tips {
      float: left;
      width: 70px;
      margin-top: 7px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      background: #fff;
      color: #f1435a;
      font-size: 16px;
      font-family: "patpat-Bold";
      box-shadow: 7px 0px 10px #b3b3b3;
    }
  }

  .outRight {
    right: 0;
  }

  .inRight {
    right: -68px;
  }
}

.popup-style {
  .content-div {
    min-height: 140px;
    background: white;
    position: relative;
    z-index: 2;
    overflow: hidden;
    padding: 12px 0;
    width: 85%;
    margin: 0 auto;
    border-radius: 10px;
  }

  .gifts-content-dialog {
    position: relative;
    .new-content {
      position: relative;
      border-radius: 5px;
      margin: auto 30px;
      background: url("~@/assets/images/activities/gift-bg.png") no-repeat;
      background-size: 100% 100%;
      border-radius: 24px;
      .close {
        position: absolute;
        top: -20px;
        right: -16px;
        width: 24px;
        height: 24px;
        border: 1px solid #b0b4b6;
        border-radius: 100%;
        color: #b0b4b6;
        text-align: center;
        line-height: 22px;
        font-size: 16px;
        box-sizing: border-box;
      }
      h3 {
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        padding: 25px 10px 15px;
        color: #fff;
      }
      input {
        display: block;
        width: 278px;
        height: 40px;
        padding: 10px;
        margin: 0 auto;
        border-radius: 5px;
        background: white;
        border: none;
      }
      .tip {
        width: 278px;
        margin: 5px auto 0;
        font-weight: bold;
        height: 22px;
        font-size: 12px;
        font-family: "patpat-Medium";
        color: #fff;
      }
      .login-box {
        background: #fff;
        padding-top: 15px;
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        .reg {
          display: block;
          width: 278px;
          color: #fff;
          font-size: 16px;
          margin: 0 auto;
          height: 40px;
          background: #f1435a;
          border-radius: 5px;
          font-family: "patpat-Medium";
        }
        .or {
          color: #b1b3b7;
          text-align: center;
          font-size: 12px;
          margin: 12px 0;
        }
        .other-login {
          width: 138px;
          margin: 0 auto 14px;
          .btn {
            width: 44px;
            height: 44px;
            &.fb-login {
              margin-right: 50px;
              background-image: url("~@/assets/images/icon-fb.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
            }
            &.google-login {
              background-image: url("~@/assets/images/google-icon.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
              border-radius: 100%;
              border: 1px solid #a2a2f3;
            }
          }
        }
        .regist-tips {
          padding: 0 26px;
          font-size: 12px;
          text-align: center;
          margin-bottom: 10px;
          p {
            color: #b1b3b7;
            a {
              color: #b1b3b7;
            }
          }
        }
        .login-tips {
          font-size: 12px;
          color: #444;
          text-align: center;
          padding-bottom: 10px;
          a {
            font-family: "patpat-Medium";
          }
        }
      }
    }
  }
  .success-gifts {
    position: relative;
    z-index: 2;
    overflow: hidden;
    padding: 12px 0;
    background: #fff;
    width: 85%;
    margin: 0 auto;
    border-radius: 10px;

    .new {
      width: 100%;
      text-align: center;
      margin: 0 auto;
      font-size: 14px;
      color: #444444;
      line-height: 25px;
      margin-top: 0;
      text-align: center;
    }
    .new.first {
      color: #000;
      font-weight: bold;
    }

    .close-patPopup {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;

      > i {
        font-size: 20px;
        color: #b8bfc0;
      }
    }

    .success-smile {
      display: block;
      width: 60px;
      height: 60px;
      margin: 15px auto 15px;
      background-size: 60px;

      > i {
        font-size: 60px;
        color: #5bde6a;
      }
    }
  }

  // 领取失败提示
  .none-gifts {
    width: 280px;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
    color: #444444;
    line-height: 25px;
    margin-top: 30px;
  }
}

#country-ar {
  .gifts-newer-style .gift-tool .tool-img img {
    margin-left: 0;
    margin-right: 5px;
  }
}
</style>
