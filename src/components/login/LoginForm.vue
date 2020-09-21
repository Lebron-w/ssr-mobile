<template>
  <div class="form">
    <form>
      <!-- 邮箱 -->
      <label class="input-box" :class="{to:validatorData.email.text.length > 0}">
        <span>{{$t('common.email')}}</span>
        <input type="email" v-model="validatorData.email.text" v-focus />
      </label>
      <p class="error" v-if="validatorData.email.error">{{validatorData.email.error}}</p>

      <!-- 密码 -->
      <label class="input-box" :class="{to:validatorData.password.text.length > 0}">
        <span>{{$t('account.login.min_6_characters')}}</span>
        <input :type="viewPassword ? 'text' : 'password'" v-model="validatorData.password.text" autocomplete v-focus />
        <PuiIcon @click.native="viewPassword = !viewPassword" :name='viewPassword ? "check" : "eyes-closed"'></PuiIcon>
      </label>
      <p class="error" v-if="validatorData.password.error">{{validatorData.password.error}}</p>
    </form>
    <!-- 忘记密码 -->
    <div class="forgot-password"><PatRouterLink to="/account/forget/password" tabindex="0">{{$t('account.login.forgot_your_password')}}</PatRouterLink></div>

    <!-- 登录按钮 -->
    <button tabindex="0" class="submit-btn login-btn" @click="submitLogin">{{$t('account.login.sign_in')}}</button>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { load } from 'recaptcha-v3'
export default {
  data () {
    return {
      validatorData: {
        email: {
          text: this.$route.query.email || '',
          errorText: this.$t('account.login.email_address_format')
        },
        password: {
          text: '',
          length: 6,
          errorText: this.$t('account.login.password_length_characters')
        }
      },
      viewPassword: false
    }
  },
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    })
  },
  methods: {
    ...mapMutations({
      setUserFavorites: 'SET_USER_FAVORITES'
    }),
    submitLogin () {
      this.$verify(this.validatorData).then(async (success) => {
        var recaptcha = await load('6Lfkjd4UAAAAAD7bZF_ypN7P1wVoYHd7TYoqbmJt')
        var recaptchaKey = await recaptcha.execute('login')
        if (success) {
          this.Indicator.open()
          const param = {
            email: this.validatorData.email.text,
            password: this.validatorData.password.text,
            order_token: '',
            captcha: recaptchaKey
          }
          this.patpatAPI.userLogin(param).then(data => {
            this.Indicator.close()
            // 登录成功回调
            this.$emit('opeSuccess', data)
          }).catch(err => {
            this.$patDialogs({
              type: 'warning',
              title: 'Oops...',
              message: err.message || err.msg,
              confirmButtonText: 'OK'
            })
            this.Indicator.close()
          })
        }
      })
    }
  },
  mounted () {

  }
}
</script>
