<template>
  <a tabindex="0" class="submit-btn fb-login" @click="facebookLogin">{{$t('account.login.sign_facebook')}}</a>
</template>
<script>
import { mapGetters } from 'vuex'
import adTrackUserRegistered from '@/assets/js/gtmEvent/userRegistered.js'
export default {
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    })
  },
  methods: {
    facebookLogin () {
      const _this = this
      window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          const userId = response.authResponse.userID
          _this.getFaceBookUserInfo(userId)
        } else {
          window.FB.login(_this.checkLogin, { scope: 'email,public_profile', return_scopes: true })
        }
      })
    },
    checkLogin (response) {
      if (response.status === 'connected') {
        const userId = response.authResponse.userID
        this.getFaceBookUserInfo(userId)
      }
    },
    getFaceBookUserInfo (userId) {
      const _this = this
      window.FB.api('/' + userId + '/?fields=id,first_name,last_name,email', 'GET', {}, function (response) {
        _this.facebookSuccessLogin(response)
      })
    },
    facebookSuccessLogin (response) {
      const param = {
        user_id: response.id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        avatar: '',
        gender: '',
        old_user_id: ''
      }
      this.patpatAPI.facebookLoginUrl(param).then(data => {
        if (!data.is_exist) {
          adTrackUserRegistered({ success: 1 })
        }
        // 登录成功回调
        this.$emit('opeSuccess', data)
      }).catch(err => {
        this.$patDialogs({
          type: 'warning',
          title: 'Oops...',
          message: err.message || err.msg,
          confirmButtonText: 'OK'
        })
      })
    }
  },
  mounted () {
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
      var js; var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  }
}
</script>
<style scoped lang="less">
.fb-login {
  background: #3b5998 url('../../assets/images/facebook-register.png') no-repeat;
  background-position: 22%;
}
</style>
<style lang="less">
#country-fr,#country-es,#country-pt,#country-ar {
  .fb-login {
    background-position: 13%;
  }
}
</style>
