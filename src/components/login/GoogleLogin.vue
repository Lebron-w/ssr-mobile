<template>
  <a tabindex="0" class="submit-btn google-login" @click="googleLogin">{{$t('account.login.google_login')}}</a>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  mounted () {
    (function (d, s, id) {
      var js; var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://apis.google.com/js/client:platform.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'google-jssdk'))
  },
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    })
  },
  methods: {
    googleLogin () {
      const _this = this
      const openAuth = setInterval(() => {
        if (window.gapi) {
          window.gapi.load('auth2', function () {
            window.auth2 = window.gapi.auth2.init({
              client_id: '1082033751824-dvrdt28b0u1e5k24sbb7r54cic279r7v.apps.googleusercontent.com'
            })
          })
          window.auth2.grantOfflineAccess().then((code) => {
            _this.patpatAPI.webGoogleLogin({ code: code.code }).then(data => {
              // 登录成功回调
              _this.$emit('opeSuccess', data)
            }).catch(err => {
              this.$patDialogs({
                type: 'warning',
                title: 'Oops...',
                message: err.message || err.msg,
                confirmButtonText: 'OK'
              })
            })
          })
          clearInterval(openAuth)
        }
      }, 500)
    }
  }
}
</script>
<style scoped lang="less">
.google-login {
  display: block;
  margin-top: 15px;
  background: #6085e5 url('../../assets/images/google-icon.png') no-repeat;
  background-size: 20px;
  background-position: 22%;
}
</style>
<style lang="less">
#country-fr, #country-es, #country-pt, #country-ar {
  .google-login {
    background-position: 13%;
  }
}
</style>
