<template>
  <div class="flash-sale-box" v-if="curProductArr.length>0">
    <div class="font-medium false-bg" v-if="downTimeIsVisibility">
      <div v-if="nextStartTime">
        <down-time
          :flash-sale-data-item="content"
          :date-time="nextStartTime"
          bgcolor="#fff"
          bdColor="#f9f9f9"
          :endIn="false"
          :daily="false"
          lass="down-time"
          @done="countDownHadDone"
        ></down-time>
      </div>
    </div>

    <div class="flash-sale-list">
      <ul :class="{'list-scroll': content.display.type == 'scroll', 'list-tile': content.display.type == 'list'}">
        <li v-for="(item,index) in curProductArr" :key="index">
          <pat-router-link tabindex="0" :position-id="item.curPID" :to="item.urlLink">
            <div class="flash-img">
              <product-tag v-if="item.product_tag&&item.product_tag.type" :item="item"></product-tag>
              <img
                v-if="item.icon"
                v-lazy="item.icon +'/350x350'"
                :alt="item.product_name"
                :position-id="item.curPID"
                :position-content="positionContent"
                :data-id="item.id"
                data-type="product"
                track="unTrack"
                v-patpat-exposure="appendExposureData"
                src="@/assets/images/base/bg-logo.png"
              />
              </div>
              <div class="product-price">
                <span
                  :style="{color:item.price_color}"
                  class="font-medium new-price"
                >{{ $uts(item.event_price) }}</span>
                <span class="older-price" v-if="shoppingCrossedPrice !== 'A'">{{ $uts(item.msrp) }}</span>
              </div>
              <div class="cla-box" v-if="item.process && item.process.is_show==='1'">
                <div class="claimed-i">{{ 100 - item.progress }}%</div>
                <div class="claimed" data-number>
                  <span :style="{width: 100 - item.progress +'%',background:item.process.color}"></span>
                </div>
              </div>
          </pat-router-link>
        </li>
      </ul>
      <!-- <loader v-else></loader> -->
    </div>
  </div>
</template>

<script>
import downTime from './downTime.vue'
// import loader from '../common/loader'
import productTag from './labelTag/productTag.vue'

import { getQueryString, cdnUrl } from '@/utils/base.js'
import { nativeFilter } from '@/utils/native'
import trackChildren from '@/mixins/trackChildren.js'

export default {
  mixins: [trackChildren],
  props: {
    content: {
      type: Object,
      default () {
        return {
          display: {},
          products: [],
          show_more: '',
          next_on_going_start_at: 0,
          page_position_id: '',
          floor: ''
        }
      }
    },
    positionName: String,
    hostEnv: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    downTime,
    // loader,
    productTag
  },
  computed: {
    nextStartTime () {
      return this.content.next_on_going_start_at * 1000
    },
    curProductArr () {
      const productsTmp = this.content.products
      return (productsTmp).map((oItem, index) => {
        const item = Object.assign({}, oItem)
        const idxTarget = this.prefixInteger(index + 1, 3)
        item.curPID = this.positionFlashName + idxTarget
        item.icon = cdnUrl(item.icon)
        let urlTmp = item.href
        if (this.fromApp) {
          const posTmp = 'home-flashsale-' + idxTarget
          urlTmp = this.toNativeProductDetail(urlTmp, item.event_id, item.product_id, this.hostEnv, posTmp)
        }
        item.urlLink = urlTmp
        return item
      })
    }
  },
  data () {
    return {
      position_name: this.$props.positionName ? this.$props.positionName + '-' : 'home-flashsale-',
      downTimeIsVisibility: true,
      fromApp: false,
      positionContent: '{}',
      positionFlashName: '',
      shoppingCrossedPrice: 'X'// getABTestExperiment(abShoppingCrossedPrice.A.id)
    }
  },
  created () {

  },
  beforeMount () {
    this.fromApp = getQueryString('platform') === 'app'
    const dataTmp = this.content.page_position_id.split('-')
    const layoutId = dataTmp[0] // 版位id
    const scheduleId = dataTmp[1] // 排期id
    const moduleNumber = dataTmp[2] // 模块编号
    const floor = this.content.floor
    this.positionFlashName = this.positionName + layoutId + '_' + scheduleId + '_flashsale_' + floor + '-' + moduleNumber + '_'
  },
  mounted () {

  },
  methods: {
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    savePosition (event) {
      const targetPosition = event.currentTarget.getAttribute('position-id')
      window.sessionStorage.setItem('last_click_position', targetPosition)
      const positionClickTime = Date.now()
      sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
    },
    countDownHadDone () {
      this.downTimeIsVisibility = false
    },
    toNativeProductDetail (value, eventId, productId, hostEnv, position) {
      var webUrl = `"patpat://?action=product_detail&event_id=${eventId}&product_id=${productId}&position=${position}"`
      const nativeUrl = nativeFilter(value, webUrl, hostEnv)
      return nativeUrl
    }
  }
}
</script>

<style lang="less" scoped>
#country-ar .new-price {
  display: inherit;
  text-align: right;
  margin-right: 4px;
  border-bottom: 0;
}
.font-medium {
  text-align: center;
  border-bottom: 1px solid #f2f2f2;
  font-family: "patpat-medium", sans-serif;
  font-weight: 400;
  a {
    padding-right: 23px;
    line-height: 0.6rem;
    font-size: 18px;
    font-family: patpat-Medium, sans-serif;
  }
  .index-title-icon {
    position: relative;
    &:after {
      content: "";
      width: 15px;
      height: 15px;
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -9px;
      background: url(/static/img/index.1a5eed4.png) no-repeat -1px -26px;
      background-size: 75px;
    }
  }
  .daily-title {
    color: #9ba5a7;
    margin-top: -5px;
  }
}
.false-bg {
  // background: url('../../assets/img/flashsale_bg.jpg');
  background-size: 100% 100%;
  height: 50px;
}

.flash-sale-list::-webkit-scrollbar {
  width: 0 !important;
}
.flash-sale-list {
  width: 100%;
  position: relative;
  background: #fff;
  overflow-x: auto;
  p {
    color: #444;
  }
}
ul {
  font-size: 0;
  white-space: nowrap;
  padding: 20px 10px 15px;
}
li {
  font-size: 14px;
  width: 140px;
  display: inline-block;
  vertical-align: top;
  padding: 0 10px;
  a {
    display: block;
    width: 100%;
  }
}
.flash-more {
  padding: 0;
  margin-left: 10px;
  border: 1px solid #fde1e4;
  margin-right: 20px;
  background: #fff6f6;
  width: 120px;
  height: 120px;
  text-align: center;
  a {
    height: 100%;
    color: #ff2556;
    padding-top: 70px;
    position: relative;
    font-size: 16px;
    &:before {
      content: "";
      position: absolute;
      left: 44px;
      top: 36px;
      width: 26px;
      height: 26px;
      border: 1px solid #e54056;
      border-radius: 50%;
    }
    &:after {
      content: "";
      position: absolute;
      left: 51px;
      top: 46px;
      width: 8px;
      height: 8px;
      border-top: 2px solid #e54056;
      border-right: 2px solid #e54056;
      transform: rotate(45deg);
    }
  }
}
.flash-img {
  width: 120px;
  height: 120px;
  overflow: hidden;
  background: #f9f9f9;
  img {
    width: 100%;
  }
  img[lazy="loading"] {
    //正在加载时显示的图片
    width: 100%;
    height: 100%;
    margin: auto;
    background: @pp-bg-img
      center;
    background-size: 45px;
  }
  img[lazy="error"] {
    //加载出错时显示的图片
    width: 100%;
    height: 100%;
    margin: auto;
    background: @pp-bg-img;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-size: 60px 60px;
  }
}
h3,
p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  color: #ff2556;
}
h3 {
  margin: 10px 0 3px;
}
p {
  text-decoration: line-through;
  color: #9ba5a7;
}
.list-tile {
  white-space: normal;
  li {
    padding: 0 3px;
    width: 33.33%;
    .flash-img {
      width: 100%;
      height: auto;
      position: relative;
      p {
        width: 32px;
        height: 32px;
        // background: #f1435a;
        border-radius: 50px;
        position: absolute;
        text-align: center;
        text-decoration: none;
        line-height: 32px;
        color: #fff;
        font-size: 11px;
        top: 5px;
        left: 5px;
      }
    }
    .product-name {
      text-align: left;
      font-size: 14px;
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      white-space: normal;
      /*! autoprefixer: ignore next */
      -webkit-box-orient: vertical;
    }
    .product-price {
      padding: 10px 0 5px;
      .new-price {
        display: inherit;
        text-align: left;
        color: #ff2556;
        margin-right: 4px;
        border-bottom: 0;
      }
      .older-price {
        color: #9ba5a7;
        text-decoration: line-through;
        margin-right: 3px;
      }
    }
    .claimed-i {
      float: left;
      color: #b1b3b7;
    }
    .claimed {
      float: right;
      position: relative;
      margin: 6px 0 15px;
      width: 65%;
      overflow: hidden;
      border-radius: 10px;
      height: 5px;
      text-align: center;
      background: #f1f2f3;
      span {
        position: absolute;
        height: 18px;
        width: auto;
        background: #f1435a;
        left: 0;
        top: 0;
      }
      i {
        width: 100%;
        font-size: 12px;
        font-style: normal;
        color: #f1435a;
        display: block;
        line-height: 16px;
        position: absolute;
        z-index: 9;
        top: 0;
        left: 0;
      }
    }
  }
}

.list-scroll {
  .flash-img {
    width: 100%;
    height: auto;
    position: relative;
    p {
      width: 32px;
      height: 32px;
      // background: #f1435a;
      border-radius: 50px;
      position: absolute;
      text-align: center;
      text-decoration: none;
      line-height: 32px;
      color: #fff;
      font-size: 11px;
      top: 5px;
      left: 5px;
    }
  }
  .product-name {
    text-align: left;
    font-size: 14px;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    white-space: normal;
    /*! autoprefixer: ignore next */
    -webkit-box-orient: vertical;
  }
  .product-price {
    padding: 10px 0 5px;
    .new-price {
      display: inherit;
      text-align: left;
      color: #ff2556;
      margin-right: 4px;
      border-bottom: 0;
    }
    .older-price {
      color: #9ba5a7;
      text-decoration: line-through;
      margin-right: 3px;
    }
  }
  .claimed-i {
    float: left;
    color: #b1b3b7;
  }
  .claimed {
    float: right;
    position: relative;
    margin: 6px 0 15px;
    width: 65%;
    overflow: hidden;
    border-radius: 10px;
    height: 5px;
    text-align: center;
    background: #f1f2f3;
    span {
      position: absolute;
      height: 18px;
      width: auto;
      background: #f1435a;
      left: 0;
      top: 0;
    }
    i {
      width: 100%;
      font-size: 12px;
      font-style: normal;
      color: #f1435a;
      display: block;
      line-height: 16px;
      position: absolute;
      z-index: 9;
      top: 0;
      left: 0;
    }
  }
}
#country-ar {
  .claimed-i {
    float: right;
  }
  .claimed {
    float: left;
  }
  .flash-img {
    p {
      right: 5px;
    }
  }
  .claimed {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* Internet Explorer */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */
  }
  .product-name {
    text-align: right;
  }
}
</style>
