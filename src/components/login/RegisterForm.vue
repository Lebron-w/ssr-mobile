<template>
  <div class="form">
    <!-- 首单优惠提示 -->
    <div class="order-dis">
      <i18n path="account.login.gift_regist_tips" tag="p">
        <a>{{$t('account.login.gift_discount')}}</a>
      </i18n>
    </div>
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
        <input type="password" v-model="validatorData.password.text" v-focus />
      </label>
      <p class="error" v-if="validatorData.password.error">{{validatorData.password.error}}</p>
    </form>
    <!-- 注册按钮 -->
    <button tabindex="0" class="submit-btn login-btn" @click="submitRegister">{{$t('account.login.join_now')}}</button>
  </div>
</template>
<script>
import { load } from 'recaptcha-v3'
import { mapActions, mapGetters } from 'vuex'
import adTrackUserRegistered from '@/assets/js/gtmEvent/userRegistered.js'
export default {
  data () {
    return {
      validatorData: {
        email: {
          text: '',
          errorText: 'Email Address should be in format you@yourdomain.com.'
        },
        password: {
          text: '',
          length: 6,
          errorText: this.$t('account.login.password_length_characters')
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    })
  },
  methods: {
    ...mapActions({
      setUserInfo: 'setUserInfo'
    }),
    submitRegister () {
      this.$verify(this.validatorData).then(async (success) => {
        var recaptcha = await load('6Lfkjd4UAAAAAD7bZF_ypN7P1wVoYHd7TYoqbmJt')
        var recaptchaKey = await recaptcha.execute('register')
        if (success) {
          this.Indicator.open()
          const param = {
            first_name: '',
            last_name: '',
            email: this.validatorData.email.text,
            password: this.validatorData.password.text,
            order_token: sessionStorage.getItem('orderToken') || '',
            captcha: recaptchaKey,
            unique_session_id: 'b0d930b530e249b39d67cda0810e7a1d'
          }
          this.patpatAPI.userRegister(param).then(data => {
            this.Indicator.close()
            adTrackUserRegistered({ success: 1 })
            // 注册成功回调
            this.$emit('opeSuccess', data)
          }).catch(err => {
            this.$patDialogs({
              type: 'warning',
              title: 'Oops...',
              message: err.message || err.msg,
              confirmButtonText: 'OK'
            })
            adTrackUserRegistered({ success: 0 })
            this.Indicator.close()
          })
        }
      })
    }
  },
  mounted () {}
}
</script>
<style scoped lang="less">
.order-dis {
  position: relative;
  display: inline-block;
  margin-bottom: 5px;
  &:after {
    content: "";
    position: absolute;
    left: -10%;
    top: 9px;
    width: 120%;
    height: 7px;
    z-index: 2;
    background: #ffe3e7;
  }
  p {
    position: relative;
    z-index: 9;
    a {
      font-weight: bold;
      color: #f1435a;
    }
  }
}
</style>
