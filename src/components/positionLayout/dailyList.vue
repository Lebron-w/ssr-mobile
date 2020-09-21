<template>
  <div class="daily-list" :class="{'daily-page':dailySpecial}">
    <ul v-if="curDailyList">
      <li v-for="(item,index) in curDailyList" :key="item.id +'-'+ index">
        <div>
          <pat-router-link tabindex="0" :position-id="item.posID" :to="item.linkToUrl">
            <div class="daily-li-img">
              <img
                class="pic"
                v-if="item.banner"
                v-lazy="item.banner+'/750x400'"
                :alt="item.name"
                :position-id="item.posID"
                :position-content="positionContent"
                :data-id="item.id"
                data-type="daily_special"
                track="unTrack"
                v-patpat-exposure="appendExposureData"
                src="@/assets/images/base/bg-logo.png"
              />
              <div class="start-time" v-if="upComing ==='Upcoming'">
                <span class="stime-format">{{item.start_at_timestamp}}</span>
                <i class="up-icon" @click="popBox(item,$event)"></i>
              </div>
              <div class="iconBox" v-if="item.banner_icon">
                <pat-img :src="item.banner_icon" :alt="item.url_name"></pat-img>
              </div>
            </div>
            <p class="daily-name font-medium marginTop">{{item.name}}</p>
            <div class="redFont" v-if="item.promotionTextArr.length">
              <p v-for="(curPro,idx) in item.promotionTextArr" :key="idx">{{curPro}}</p>
            </div>
            <p class="start-from" v-else-if="isZHTip">
              <span
                class="start-form-price normal-style"
              >{{$t('common.activity.start', { price:$uts(item.price) })}}</span>
            </p>
            <!-- 下面会动态加上的class不知道有啥作用 :class="{'3': fromApp, '4': upComing=='Upcoming'}" -->
            <p class="start-from" v-else>
              {{item.discount_info}}
              <span class="start-form-price normal-style">{{ $uts(item.price) }}</span>
            </p>
          </pat-router-link>
        </div>
        <div class="end-time" v-if="upComing!='Upcoming'">
          <p class="timeBox">
            <PuiIcon name='timing'></PuiIcon>
            {{$t('common.activity.ends_in')}} {{item.end_at_timestamp}}
          </p>
        </div>
      </li>
    </ul>
    <!-- <page-loader v-else></page-loader> -->
  </div>
</template>

<script>
// import pageLoader from '../common/pageLoader'
import { nativeFilter } from '@/utils/native'
import { getQueryString, cdnUrl } from '@/utils/base'
import trackChildren from '@/mixins/trackChildren.js'
import { mapState, mapGetters } from 'vuex'

export default {
  mixins: [trackChildren],
  props: {
    dailySpecial: Boolean,
    // 自定义活动，对于upComing有特别的显示内容，样式
    upComing: String,
    dailyListArr: {
      type: Array,
      default () {
        return []
      }
    },
    positionName: String,
    page_position_id: String,
    floor: {
      type: [String, Number]
    },
    hostEnv: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      fromApp: false,
      langType: '',
      layoutId: '',
      scheduleId: '',
      moduleNumber: '',
      positionContent: {}
    }
  },
  computed: {
    ...mapState({
      loginStatus: 'loginStatus'
    }),
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    }),
    positionId () {
      return this.positionName + this.layoutId + '_' + this.scheduleId
    },
    curDailyList () {
      return this.dailyListArr.filter(item => {
        return (
          parseInt((Number(item.end_at_timestamp) * 1000 - new Date().getTime()) / 1000 / 60) > 0
        )
      }).map((oItem, index) => {
        const item = Object.assign({}, oItem)
        const urlTmp = '/Daily-Special/' + item.url_name + '.html'
        const indexTmp = this.prefixInteger(index + 1, 3)
        item.posID = `${this.positionId}${indexTmp}`
        item.linkToUrl = this.fromApp ? this.toNativeFilter(urlTmp, item.id, `${this.positionName}-${indexTmp}`) : urlTmp
        item.promotionTextArr = (item.promotion_text || '').split(',')
        item.start_at_timestamp = this.formatTime(item.start_at_timestamp)
        item.end_at_timestamp = this.formatEndTime(item.end_at_timestamp)
        item.banner = cdnUrl(item.banner)
        return item
      })
    },
    isZHTip () {
      const fromApp = getQueryString('platform', this.$route.fullPath) === 'app'
      const langType = this.$route.params.lang
      return fromApp && langType
    }
  },
  beforeMount () {
    if (this.page_position_id) {
      const dataTmp = this.page_position_id.split('-')
      this.layoutId = dataTmp[0] // 版位id
      this.scheduleId = dataTmp[1] // 排期id
      this.moduleNumber = dataTmp[2] // 模块编号
    }
    this.fromApp = getQueryString('platform') === 'app'
    this.langType = this.$route.params.lang
  },
  mounted () {

  },
  methods: {
    toNativeFilter (value, eventId, position) {
      var webUrl = `"patpat://?action=event_detail&event_id=${eventId}&position=${position}"`
      return nativeFilter(value, webUrl, this.hostEnv)
    },
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    // 关注upcoming活动
    attention (id, event) {
      const that = event.currentTarget
      const params = {
        type: 'event', // 类型
        save_id: id // 活动id
      }
      this.patpatAPI.upcomingSave(params)
        .then(res => {
          if (res.status === 'success' && res.code === 200) {
            this.$patDialogs({
              type: 'success',
              title: this.$t('common.activity.upcoming'),
              message: this.$t('common.activity.save_success'),
              confirmButtonText: 'OK'
            })
            that.classList.add('smallIcon')
          } else {
            this.$patDialogs({
              type: 'error',
              message: res.message,
              confirmButtonText: 'OK'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 取消upcoming关注
    cacleAttention (id, event) {
      const that = event.currentTarget
      const params = {
        type: 'event', // 类型  Y
        save_id: id // 活动id
      }
      this.patpatAPI.upcomingCancel(params)
        .then(res => {
          if (res.code === 200) {
            this.$patDialogs({
              type: 'success',
              title: this.$t('common.activity.upcoming'),
              message: this.$t('common.activity.cancel_success'),
              confirmButtonText: 'OK'
            })
            that.classList.remove('smallIcon')
          } else {
            console.log(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 弹窗提示
    popBox (item, event) {
      // loginStatus状态的值为null时表示未登陆否则为登陆状态
      const id = item.id
      if (!this.loginStatus) {
        this.$patDialogs({
          type: 'error',
          title: this.$t('common.activity.oops'),
          message: this.$t('common.activity.need_login'),
          confirmButtonText: 'OK'
        })
      } else {
        // console.log(event.currentTarget.classList.contains("smallIcon"))
        if (event.currentTarget.classList.contains('smallIcon')) {
          // 判断当前点击元素是否含有此class
          this.cacleAttention(id, event)
        } else {
          this.attention(id, event)
        }
      }
    },
    formatTime (value) {
      if (value) {
        const date = new Date(Number(value) * 1000)
        const year = date.getFullYear()
        const day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
        const hour =
          date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
        const minute =
          date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
        const second =
          date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()
        const englisthMonth = [
          this.$t('common.time.jan'),
          this.$t('common.time.feb'),
          this.$t('common.time.mar'),
          this.$t('common.time.apr'),
          this.$t('common.time.may'),
          this.$t('common.time.jun'),
          this.$t('common.time.jul'),
          this.$t('common.time.aug'),
          this.$t('common.time.sep'),
          this.$t('common.time.oct'),
          this.$t('common.time.nov'),
          this.$t('common.time.dec')
        ]
        const enMonth = englisthMonth[date.getMonth()]
        const weekDays = [
          this.$t('common.time.sun'),
          this.$t('common.time.mon'),
          this.$t('common.time.tue'),
          this.$t('common.time.wed'),
          this.$t('common.time.thu'),
          this.$t('common.time.fri'),
          this.$t('common.time.sat')
        ]
        const weekday = weekDays[date.getDay()]
        return (
          weekday +
          ',' +
          enMonth +
          ' ' +
          day +
          ',' +
          year +
          ' ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        )
      }
    },
    formatEndTime (value) {
      if (value) {
        const newDate = new Date().getTime()
        const endTime = Number(value) * 1000 - newDate
        const days = Math.round(endTime / (1000 * 24 * 60 * 60))
        const hour = Math.round(endTime / (1000 * 60 * 60))
        const minute = parseInt(endTime / 1000 / 60)
        if (minute < 60) {
          if (minute === 1) {
            return minute + ' ' + this.$t('common.time.min')
          } else {
            return minute + ' ' + this.$t('common.time.mins')
          }
        } else {
          if (hour === 1) {
            return hour + ' ' + this.$t('common.time.hr')
          } else if (hour < 24) {
            return hour + ' ' + this.$t('common.time.hrs')
          } else {
            if (days === 1) {
              return days + ' ' + this.$t('common.time.day')
            } else {
              return days + ' ' + this.$t('common.time.days')
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.daily-list {
  position: relative;
  width: 100%;
  min-height: 50px;
  background: #fff;
  img[lazy="loading"] {
    height: 190px;
  }
}

.daily-list ul {
  background: #fff;
  font-size: 0;
}

.daily-list ul li {
  font-size: 14px;
  width: 100%;
  padding: 10px 10px 20px;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
  overflow: hidden;
  a {
    display: block;
    width: 100%;
    height: 100%;
  }
  p {
    text-align: center;
  }
  .daily-name {
    padding: 0 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media (max-width: 340px) {
      margin-top: 4px;
    }
  }
  .marginTop {
    margin-top: 10px;
    margin-bottom: 4px;
  }
  .start-from {
    color: #9ba5a7;
    span {
      color: #ff2556;
    }
  }
}

.daily-list ul li .daily-li-img img {
  width: 100%;
  height: 190px;
}

.end-time {
  position: absolute;
  left: 15px;
  top: 20px;
  padding: 5px 10px;
  background: hsla(0, 0%, 100%, 0.5);
  border-radius: 20px;
}

.end-time .timeBox {
  display: flex;
  align-items: center;
  justify-items: center;
}

.end-time >p >i {
  font-size: 14px;
  margin-right: 5px;
  color: black;
}

.daily-page {
  ul {
    padding: 0 10px;
  }
  li {
    border: none;
    padding: 0;
    height: 190px;
    margin-bottom: 10px;
    background: #f9fbfc;
  }
}

.daily-li-img {
  position: relative;
  font-size: 0;
  height: 190px;
  background: #f9f9f9;
  .start-time {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: hsla(0, 0%, 78%, 0.8);
    font-size: 14px;
    line-height: 30px;
    padding-left: 10px;
    span {
      color: #fff;
    }
  }
}

img[lazy="loading"] {
  //正在加载时显示的图片
  width: 100%;
  height: 100%;
  margin: auto;
  background: @pp-bg-img;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-size: 60px 60px;
}
img[lazy="error"] {
  //正在加载时显示的图片
  width: 100%;
  height: 100%;
  margin: auto;
  background: @pp-bg-img;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-size: 60px 60px;
}

.daily-list ul li .daily-li-img .iconBox {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 45px;
  overflow: hidden;
}

.daily-list ul li .daily-li-img .iconBox img {
  width: 45px;
  height: auto;
}

.up-icon {
  position: absolute;
  right: 20px;
  bottom: 10px;
  border-radius: 50%;
  padding: 10px;
  height: 40px;
  width: 40px;
  background: #ffffff
    url("https://p-m.ppwebstatic.com/assets/img/calendar_add@3x.png") center
    center no-repeat;
  background-size: 50% 50%;
}

.start-form-price {
  font-size: 16px;
}

.smallIcon {
  background: #ffffff
    url("https://p-m.ppwebstatic.com/assets/img/upcoming_red@3x.png") center
    center no-repeat !important;
  background-size: 50% 50% !important;
}
#country-ar {
  .up-icon {
    left: 20px;
    right: auto;
  }
  .stime-format {
    padding-right: 10px;
  }
}
</style>
<style>
.mint-msgbox-btns .mint-msgbox-confirm {
  display: inline-block !important;
  flex: none !important;
  width: 110px;
  margin: 0 auto;
  color: #ffffff !important;
}
.redFont {
  color: #ff2556;
}
.pat-box-content h2 {
  line-height: 22px;
  font-weight: normal;
  margin: 15px 0 10px 0;
  font-size: 18px;
  font-family: "patpat-Regular", sans-serif;
}

.pat-box-header .sa-icon {
  margin: 0 auto;
}
</style>
