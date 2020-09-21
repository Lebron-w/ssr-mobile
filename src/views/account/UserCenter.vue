<template>
  <div class="user-center">
    <div class="user-head">
      <div class="avatar">
        <a tabindex="0"><img v-if="avatar" :src="avatar"></a>
        <p v-if="userName">{{userName}}</p>
      </div>

      <div class="order">
        <div class="title">
          <span>{{$t('account.userCenter.my_orders')}}</span>
          <a tabindex="0" class="right" @click="ordersLink('viewall')">{{$t('account.userCenter.view_all')}}</a>
        </div>
        <div class="order-type">
          <a tabindex="0" @click="ordersLink('myprocessing')">
            <pui-icon name='bale'></pui-icon>
            <span>{{$t('account.userCenter.in_process')}}</span>
          </a>
          <a tabindex="0" @click="ordersLink('mydelivered')">
            <pui-icon name='transport'></pui-icon>
            <span>{{$t('account.userCenter.delivered')}}</span>
          </a>
          <a tabindex="0" @click="ordersLink('to_reviews')">
            <pui-icon name='chat'></pui-icon>
            <span>{{$t('account.userCenter.add_reviews')}}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="menu">
      <PatRouterLink tabindex="0" to="/account/notification">
        <pui-icon name='bell'></pui-icon>
        <span>{{$t('account.userCenter.notifications')}}</span>
      </PatRouterLink>
      <PatRouterLink tabindex="0"  to="/account/faves">
        <pui-icon name='collect'></pui-icon>
        <span>{{$t('account.userCenter.favorites')}}</span>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/account/voucher">
        <pui-icon name='coupon'></pui-icon>
        <span>{{$t('account.userCenter.rewards')}}</span>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/account/patpoints">
        <pui-icon name='bell'></pui-icon>
        <span>{{$t('account.userCenter.Pat_points')}}</span>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/account/wallet">
        <pui-icon name='wallet'></pui-icon>
        <span>{{$t('account.userCenter.wallet')}} <i>({{$uts(walletsNum)}})</i></span>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/account/address">
        <pui-icon name='location'></pui-icon>
        <span>{{$t('account.userCenter.address_book')}}</span>
      </PatRouterLink>
      <PatRouterLink tabindex="0" to="/account/profile">
        <pui-icon name='login'></pui-icon>
        <span>{{$t('account.userCenter.profile')}}</span>
      </PatRouterLink>
    </div>

    <div class="sing-out-btn">
      <button @click="signOut">{{$t('account.login.sign_out')}}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import trackMerge from '@/mixins/trackMerge'

export default {
  name: 'user-center',
  mixins: [trackMerge],
  data () {
    return {
      walletsNum: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'langCode'
    ]),
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    }),
    avatar () {
      return this.userInfo.avatar || require('../../assets/images/avatar.png')
    },
    userName () {
      const name = this.userInfo.first_name + ' ' + this.userInfo.last_name
      return name.replace(/[' ']/g, '').length > 0 ? name : this.userInfo.email
    }
  },
  methods: {
    ...mapMutations({
      changeTopFree: 'CHANGE_TOP_FREE',
      changeTopIcon: 'CHANGE_TOP_ICON'
    }),
    signOut () {
      this.$store.dispatch('signOut')
      this.$router.push(this.langCode !== 'en' ? `/${this.langCode}/account/login` : '/account/login')
    },
    ordersLink (type) {
      const link = this.langCode ? `/${this.langCode}/account/orders` : '/account/orders'
      const trackClick = {
        myprocessing: 'click_account_in_progress',
        mydelivered: 'click_account_delivered',
        viewall: 'click_account_view_all'
      }
      if (trackClick.state) {
        this.appendClickTrackData(trackClick.state)
      }
      window.sessionStorage.setItem('orderState', type)
      window.location.href = link
    }
  },
  mounted () {
    this.changeTopIcon('lg')
    this.changeTopFree(false)
    this.patpatAPI.walletsNum().then(data => {
      this.walletsNum = data.credits
    })
  },
  destroyed () {
    this.changeTopIcon('')
    this.changeTopFree(true)
  }

}
</script>
<style scoped lang="less">
.user-center {
  background: #f1f3f2;
  padding-bottom: 10px;
}
.user-head {
  position: relative;
  width: 100%;
  height: 203px;
  background: url('../../assets/images/icon-user-bg.png') no-repeat;
  background-size: 100%;
  .avatar {
    a {
      display: inline-block;
      width: 48px;
      height: 48px;
      margin: 40px 15px 0 30px;
      img {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 100%;
      }
    }
    p {
      display: inline-block;
      font-size: 18px;
      color: #fff;
    }
  }
  .order {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 0;
    background: #fff;
    font-size: 12px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.18);
    border-radius: 8px;
    .title {
      margin: 0 15px;
      line-height: 30px;
      border-bottom: 1px solid rgba(151, 151, 151, 0.1);
      a {
        position: relative;
        color: #afb3b7;
        transform: scale(0.9);
        padding: 0 15px;
        &:after {
          content: '';
          position: absolute;
          right: 0;
          top: 11px;
          width: 6px;
          height: 6px;
          transform: rotate(45deg);
          border-top: 1px solid #c5c7ca;
          border-right: 1px solid #c5c7ca;
        }
      }
    }
    .order-type {
      display:flex;
      justify-content: space-around;
      padding: 10px 0;
      .iconfont {
        font-size: 20px;
      }
      a {
        display: block;
        text-align: center;
      }
      span {
        display: block;
        padding-top: 8px;
      }
    }
  }
}
.menu {
  margin: 10px 12px;
  background: #fff;
  padding: 10px 20px 20px;
  font-size: 12px;
  a {
    position: relative;
    display: block;
    line-height: 45px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.08);
    .iconfont {
      position: relative;
      top: 2px;
    }
    span {
      display: inline-block;
      padding: 0 20px;
      i {
        display: inline-block;
        padding: 0 5px;
        color: #9ba5a7;
        font-size: 14px;
      }
    }
    &:after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      width: 6px;
      height: 6px;
      transform: rotate(45deg);
      border-top: 1px solid #c5c7ca;
      border-right: 1px solid #c5c7ca;
    }
  }
}
.sing-out-btn {
  margin: 0 12px;
  button {
    display: block;
    width: 100%;
    line-height: 44px;
    background: #fff;
    border-radius: 5px;
  }
}
#country-ar {
  .menu a:after {
    right: auto;
    left: 0;
    transform: rotate(-135deg);
  }
  .user-head .order .title a {
    &:after {
      right: auto;
      left: 0;
      transform: rotate(-135deg);
    }
  }
}

</style>
