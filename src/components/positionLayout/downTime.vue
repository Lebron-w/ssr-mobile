<template>
  <!-- flash sale自定义活动页 -->
  <div
    v-if="flashSaleDataItem && flashSaleDataItem.products.length > 0"
    :class="{ activity_time: flashSale }"
    class="downtime-box"
  >
    <div v-if="endActivity" :class="{ flash_time : bdColor != '#fff' }" id="flash_option">
      <span class="fontColor">{{$t('product.detail.flash_sale')}}</span>
      <div class="time-boxshad">
        <span class="flash-down flash-margin style-border" id="flashSale-time">
          <span class="time style-col" v-if="intervalTime > DATE_TIME">
            {{ day }}
            <template v-if="day > 1">{{ $t('common.time.days') }}</template>
            <template v-else>{{ $t('common.time.day') }}</template>
          </span>
          <span class="time flash-down style-color" v-if="intervalTime > HOUR_TIME">{{ hour }}h</span>
          <span class="dian-fontColor time-symbol" v-if="intervalTime > HOUR_TIME">:</span>
          <span class="time flash-down style-color" v-if="intervalTime > MINUTE_TIME">{{ minute }}m</span>
          <span class="dian-fontColor time-symbol" v-if="intervalTime > MINUTE_TIME">:</span>
          <span class="time flash-down style-color">{{ second }}s</span>
        </span>
      </div>
    </div>
    <div v-else>{{$t('product.detail.end_activity')}}</div>
  </div>

  <div v-else :class="{activity_time:flashSale,time_show:day == ''}">
    <div v-if="endActivity" :class="{flash_time:bdColor != '#fff'}">
      <span v-if="endIn=='on going'" class="fontColor">{{$t('product.category.end_in')}}</span>
      <span v-else-if="endIn=='coming soon'">{{$t('product.category.starts_in')}}</span>
      <span v-else-if="daily=='isDaily'" class="fontColor">{{$t('common.activity.ends_in')}}</span>
      <span v-else></span>

      <span class="flash-down flash-margin style-border" v-if="day > 0">
        <span class="time style-col">{{day}}</span>
        <span class="time-padding" v-if="day<2">{{$t('common.time.day')}}</span>
        <span class="time-padding" v-else>{{$t('common.time.days')}}</span>
      </span>
      <span class="time flash-down style-color">{{hour}}</span>
      <span class="fontColor time-symbol">:</span>
      <span class="time flash-down style-color">{{minute}}</span>
      <span class="fontColor time-symbol">:</span>
      <span class="time flash-down style-color">{{second}}</span>
    </div>
    <div v-else>{{$t('product.detail.end_activity')}}</div>
  </div>
</template>

<script>
export default {
  props: {
    flashSaleDataItem: Object,
    dateTime: {
      default: new Date()
    },
    bgColor: {
      default: '#f1f3f2'
    },
    color: {
      default: '#ff2556'
    },
    bdColor: {
      default: '#fff'
    },
    endIn: {
      default: ''
    },
    flashSale: {
      default: false
    },
    fontSize: {
      default: ''
    },
    daily: {
      default: 'isDaily'
    }
  },
  data () {
    return {
      day: '',
      hour: '',
      minute: '',
      second: '',
      count: this.dateTime - new Date().getTime(),
      interval: null,
      endActivity: true,
      isRefresh: true, // 默认值
      END_TIMESTAMP: this.dateTime,
      DATE_TIME: 86400000,
      HOUR_TIME: 3600000,
      MINUTE_TIME: 60000,
      SECOND_TIME: 1000,
      intervalTime: 0
    }
  },
  beforeMount () {
    if (this.flashSaleDataItem) {
      if (this.flashSaleDataItem.products.length > 0) {
        this.flashSaleStare()
      } else {
        this.start()
      }
    }
  },
  methods: {
    start () {
      this.interval = setInterval(() => {
        this.count = this.count - 1000
        if (this.count <= 0) {
          if (this.isRefresh) {
            // 只触发一次接口
            this.second = '00'
            clearInterval(this.interval)
            this.timeDown()
            this.endActivity = false
            this.isRefresh = false
            return
          }
        }
        this.day = parseInt(this.count / (24 * 60 * 60 * 1000)) + ''
        const n = this.count % (24 * 60 * 60 * 1000)
        this.hour = parseInt(n / (60 * 60 * 1000)) + ''
        if (this.hour < 10) {
          this.hour = '0' + this.hour
        }
        const n2 = this.count % (60 * 60 * 1000)
        this.minute = parseInt(n2 / (60 * 1000)) + ''
        if (this.minute < 10) {
          this.minute = '0' + this.minute
        }
        const n3 = n % (60 * 1000)
        this.second = parseInt(n3 / 1000) + ''
        if (this.second < 10) {
          this.second = '0' + this.second
        }
      }, 1000)
    },
    timeDown () {
      this.$emit('timeDown')
    },
    flashSaleStare () {
      if (this.END_TIMESTAMP - Date.now() < 0) {
        this.$emit('done')
        return
      }
      const interval = setInterval(() => {
        const nowTime = Date.now()
        this.intervalTime = this.END_TIMESTAMP - nowTime
        let temp1 = 0
        let temp2 = 0
        temp1 = this.intervalTime % this.DATE_TIME
        const dateTime = this.intervalTime - temp1
        temp2 = temp1 % this.HOUR_TIME
        const hourTime = temp1 - temp2
        temp1 = temp2 % this.MINUTE_TIME
        const minuteTime = temp2 - temp1
        temp2 = temp1 & this.SECOND_TIME
        const secondTime = temp1 - temp2
        const date = Math.floor(dateTime / this.DATE_TIME)
        const hour = Math.floor(hourTime / this.HOUR_TIME)
        const minute = Math.floor(minuteTime / this.MINUTE_TIME)
        const second = Math.ceil(secondTime / this.SECOND_TIME)
        this.day = date
        this.hour = hour > 9 ? hour : `0${hour}`
        this.minute = minute > 9 ? minute : `0${minute}`
        this.second = second > 9 ? second : `0${second}`
        if (date === 0 && hour === 0 && minute === 0 && second < 1) {
          clearInterval(interval)
          this.$emit('done')
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.time {
  font-family: patpat-Medium, sans-serif;
  border-radius: 5px;
}
.downtime-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.flash_time {
  margin-right: 10px;
  .flash-down {
    background: #ffffff;
    border-radius: 5px;
    padding: 1px 5px;
    border: 1px solid #f9f9f9;
    box-shadow: 0 2px 2px 0 #e8e8e8;
  }
  .time-padding {
    color: #ff2556;
  }
  .flash-margin {
    margin-right: 7px;
  }
}
.down-time {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  #flash_option {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: auto;
  }
}
.activity_time {
  .time {
    font-family: patpat-medium, sans-serif;
    border-radius: 5px;
  }
  span {
    color: #ff2556;
  }
}
.time_show {
  display: none !important;
}
.time-symbol {
  color: #ff2556;
}
.style-border {
  border-color: #fff;
}
.style-col {
  background-color: #f1f3f2;
  color: #ff2556;
}
.style-color {
  background-color: #f1f3f2;
  color: #ff2556;
}
#flash_option {
  margin: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  .fontColor {
    font-family: "avenir-light", sans-serif;
    font-size: 17px;
    font-weight: 600;
    display: inline-block;
    margin: 13px 6px 0 0;
    padding-top: 0px;
    text-align: right;
  }
  .time-boxshad {
    overflow: hidden;
    display: inline-block;
  }
}
#flashSale-time {
  border: 0;
  box-shadow: none;
  padding: 5px 5px 4px;
  display: inline-block;
  border-radius: 6px;
  -webkit-border-radius: 6px;
  font-size: 12px;
  margin: 13px 0px 0 0;
  .style-col {
    color: #6a269f;
    background: none;
  }
  .flash-down {
    box-shadow: none;
    border: 0;
    padding: 1px 0px;
    color: #6a269f;
    background: none;
    font-size: 12px;
  }
  .dian-fontColor {
    color: #6a269f;
  }
  .time-padding {
    color: #6a269f;
  }
  .time-symbol {
    color: #6a269f;
  }
}
#country-zh {
  #flashSale-time {
    padding: 4px 5px 4px;
  }
}
</style>
