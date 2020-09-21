<template>
  <div v-show="displayDom">
    <div class="mask-bg" v-show="vipVisibility"></div>
    <PuiPopup class="vip-popup" :model.sync="vipVisibility" width="100%" :overlay="false">
      <div class="popup-content">
        <div class="popup-bg">
          <div class="body">
            <h3><span>{{$t('common.vip_day')}}</span></h3>
            <p>{{$t('common.vip_day_discount')}}</p>
          </div>
          <div class="bottom">
            <patRouterLink to="/vipday" @click.native="goVipRouter">GO &gt;</patRouterLink>
          </div>
        </div>
      </div>
      <button class="close-patPopup" tabindex="0" @click="closeVipPopup">
        <PuiIcon name="close-circle"></PuiIcon>
      </button>
    </PuiPopup>
  </div>
</template>

<script>
import trackChildren from '@/mixins/trackChildren.js'
export default {
  mixins: [trackChildren],
  data () {
    return {
      vipVisibility: false
    }
  },
  computed: {
    displayDom () {
      // 客户端在处理
      if (this.$isServer) {
        return false
      }
      if (!this.$store.state.navInfo) {
        return false
      }
      const existMemberDay = this.$ppUtils.safe(this.$store.state.navInfo, 'is_exist_member_day', false)
      const vipFirstOPen = window.localStorage.getItem('vipFirstOPen')
      const isShow = existMemberDay && !vipFirstOPen
      if (isShow) {
        this.appendClickTrackData('show_vip_dialog')
        window.localStorage.setItem('vipFirstOPen', 'true')
      }
      if (!existMemberDay) {
        window.localStorage.removeItem('vipFirstOPen')
      }
      return isShow
    }
  },
  watch: {
    displayDom (value) {
      this.vipVisibility = value
    }
  },
  methods: {
    goVipRouter () {
      this.vipVisibility = false
      this.appendClickTrackData('click_vip_dialog_go')
    },
    closeVipPopup () {
      this.vipVisibility = false
      this.appendClickTrackData('click_vip_dialog_close')
    }
  }
}
</script>

<style lang="less" scoped>
.vip-popup {
  /deep/.popop-bg {
    display: none;
  }
  .popup-content {
    position: relative;
    top: 0.32rem;
    .popup-bg {
      width: 77%;
      margin: 0 auto;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      .body {
        height: 160px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url("~@/assets/images/activities/vip-day-popup-bg.png");
        padding-top: 25px;
        h3 {
          text-align: center;
          width: 80px;
          height: 20px;
          line-height: 20px;
          background: #facd6c;
          border-radius: 5px;
          margin: 0 auto;
          transform: skewX(-10deg);
          span {
            color: #fff;
            font-size: 12px;
            font-weight: bold;
          }
        }
        p {
          font-size: 12px;
          color: #fff;
          text-align: center;
          font-weight: bold;
          margin-top: 12px;
        }
      }
      .bottom {
        a {
          display: block;
          background: #fff;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #f1435a;
        }
      }
    }
  }
  .close-patPopup{
    width: 20px;
    height: 20px;
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: -45px;
    margin: auto;
    color: white;

    >i {
      font-size: 20px;
    }
  }
}
.mask-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(128, 128, 128, 0.6);
}
</style>
