<template>
  <div class="top-header">
    <!-- 活动 Banner -->
    <div class="container-top-banner" v-if="isShowActivity && showActivity">
      <PatRouterLink tabindex="0" :to="topActivity[0].content.items[0].location_url">
        <PatImg :src="topActivity[0].content.items[0].img" />
      </PatRouterLink>
    </div>

    <!-- 免邮 、COD 和分期支付提示 -->
    <div class="container-ship-info" v-if="showFreeTips">
      <div class="content free-ship" v-if="switchCodAndStaging">
        <p>
          <span>{{$t('common.header.free_ship', {price: $uts(freeShippingPrice)})}}</span>
          <button v-if="showCod >= 0" @click="codCountry('cod')" :aria-expanded="codCountryStatus + ''" aria-haspopup="dialog">;{{$t('common.header.cash_delivery')}}</button>
        </p>
      </div>
      <div class="content staging-tips" v-else>
        <p>
          <u @click="codCountry()">{{$t('common.header.Instalments_for_up_to_12_months')}}</u>
        </p>
      </div>
    </div>

    <!-- 弹窗提示 -->
    <pui-popup :model.sync="codCountryStatus">
      <div class="popup-tips">
        <PuiIcon name='close' class="close-btn" @click.native="closeCodTip()"></PuiIcon>
        <p>{{popupTipsText}}</p>
      </div>
    </pui-popup>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PatImg from '@/components/base/PatImg'
import { uctTime } from '@/assets/js/common'
export default {
  components: {
    PatImg
  },
  serverPrefetch () {},
  data () {
    return {
      codCountryStatus: false,
      switchCodAndStaging: true,
      popupTipsText: '',
      activityUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'freeShippingPrice'
    ]),
    ...mapState([
      'topActivity',
      'countryCode',
      'showFreeTips',
      'showActivity'
    ]),
    showCod () {
      return ['HK', 'TW', 'TH', 'AE', 'SG', 'MY', 'BH', 'QA', 'SA', 'OM', 'KW'].indexOf(this.countryCode)
    },
    isShowActivity () {
      if (this.topActivity.length > 0) {
        const curTiem = Date.now()
        const startTime = uctTime(this.topActivity[0].content.items[0].start_time)
        const endTime = uctTime(this.topActivity[0].content.items[0].end_time)
        if (curTiem >= startTime && curTiem < endTime) {
          return true
        }
        return false
      } else {
        return false
      }
    }
  },
  methods: {
    codCountry (type) {
      this.codCountryStatus = true
      if (type === 'cod') {
        this.popupTipsText = this.$t('common.header.cod_is_available')
      } else {
        this.popupTipsText = 'The minimum installment amount is 5 BRL. The total order amount for choosing 12 installments must be greater than 60 BRL.'
      }
    },
    closeCodTip () {
      this.codCountryStatus = false
    }
  },
  mounted () {
    if (this.countryCode === 'MX' || this.countryCode === 'BR') {
      setInterval(() => {
        this.switchCodAndStaging = !this.switchCodAndStaging
      }, 2000)
    }
  }
}
</script>
<style lang="less" scoped>
.container-ship-info {
  height: 40px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid #f1f3f2;
  .content {
    position: relative;
    display: inline-block;
    &:after {
      content: "";
      position: absolute;
      left: -1%;
      top: 18px;
      width: 102%;
      height: 7px;
      background: #fff2a9;
    }
    p {
      position: relative;
      z-index: 9;
      height: 100%;
      top: 6px;
    }
    button {
      font-size: 14px;
      text-decoration: underline;
    }
  }
}

.container-top-banner {
  display: block;
  img {
    display: block;
    width: 100%;
  }
}

// 弹窗
.popup-tips {
  margin: 0 20px;
  padding: 20px 30px;
  text-align: left;
  border-radius: 5px;
  background: #fff;
  line-height: 20px;
  position: relative;
  min-height: 140px;
  display: flex;
  align-items: center;

  .close-btn {
    position: absolute;
    top: 8px;
    right: 20px;
    font-size: 12px;
    font-weight: bold;
  }
}

#country-ar {
  .popup-tips {
    text-align: right;
  }
  .close-btn {
    right: atuo;
    left: 20px;
  }
}
</style>
