<template>
  <div class="product-list" v-if="curProductArr.length>0">
    <ul :class="contentCls">
      <!-- productImg 模式额外显示一张图片 -->
      <li class="module_img" v-if="moduleType==='productImg'">
        <!-- productListData.link | langUrl -->
        <patRouterLink
          tabindex="0"
          :position-id="positionId(prefixInteger(0,3))"
          :data-href="content.link"
          :to="curContentLink"
        >
          <div class="picBox">
            <img
              class="picBox_img"
              :src="curBGImg"
              lazy="loaded"
              track="unTrack"
              :position-id="positionId(prefixInteger(0,3))"
              alt=""
              v-patpat-exposure="appendExposureData"
            />
          </div>
        </patRouterLink>
      </li>

      <li v-for="(item,index) in curProductArr" :key="item.product_id +'-'+ index">
        <patRouterLink
          tabindex="0"
          class="product-img"
          :position-id="positionId(prefixInteger(index+1,3))"
          :to="item.targetUrl"
        >
          <product-tag
            v-if="item.product_tag&&item.product_tag.type && !item.is_member_day"
            :moduleType="moduleType"
            :item="item"
          ></product-tag>
          <div class="picBox">
            <img
              v-lazy="item.icon+'/350x350'"
              lazymode="bg"
              alt=""
              :position-id="positionId(prefixInteger(index+1,3))"
              :position-content="item | positionContent"
              :data-id="item.product_id"
              data-type="product"
              :event-id="eventId"
              track="unTrack"
              v-patpat-exposure="appendExposureData"
              src="@/assets/images/base/bg-logo.png"
            />
            <div class="sold" v-if="Number(item.store_stock)==0">Sold Out</div>
          </div>
        </patRouterLink>
        <div class="product-price">
          <span class="font-medium new-price" v-if="item.show_price">
            {{$uts(item.is_member_day ? item.price : item.show_price) }}
          </span>
          <span
            v-if="shoppingCrossedPrice !== 'A'"
            class="older-price"
          >{{$uts(item.is_member_day ? item.store_price : item.msrp) }}</span>
        </div>
        <template v-if="item.is_member_day">
          <vip-tag class="layout" top="0" left="2" :tagInfo="{isMemberDay: true, level: item.member_day_level, discount: item.member_day_discount}" />
        </template>
        <template v-else>
          <div class="acting">
            <span class="sale" v-if="item.event_type=='FlashSale'&&item.event_id>0"></span>
            <span class="color" v-if="item.is_multiple"></span>
          </div>
          <div class="iconBox" v-if="productIcon">
            <pat-img :src="productIcon" alt="product icon"></pat-img>
          </div>
        </template>
        <button v-if="!fromApp"
          :aria-haspopup="!loginStatus"
          :aria-expanded="loginStatus ? false : showLoginPopup"
          :aria-controls="item.product_id"
          aria-label="add to favourites"
          class="collect"
          v-bind:collect="item.isCollected"
          @click="collectFav(item)">
          <pui-icon :name="(item.isCollected) ? 'collect-fill': 'collect'" class="collect-icon"></pui-icon>
        </button>
      </li>
    </ul>

    <!-- 登录弹窗 -->
    <!-- <pui-overlay v-show="showLoginPopup">
      <login-popup
        :loginState="true"
        :registerState="false"
        @closeLoginPopup="closeLoginPopup"
        @collectSuccess="collectSuccess"
      ></login-popup>
    </pui-overlay> -->
  </div>
</template>
<script>
// import loginPopup from '../account/auth/loginPopup'

import vipTag from '@/components/product/productTag.vue'
import productTag from '@/components/positionLayout/labelTag/productTag.vue'
import { getQueryString, cdnUrl } from '@/utils/base.js'
import { nativeFilter } from '@/utils/native'
import trackChildren from '@/mixins/trackChildren.js'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  mixins: [trackChildren],
  props: {
    moduleType: String,
    productIcon: String,
    eventId: String,
    content: {
      type: Object,
      default () {
        return {
          products: [],
          page_position_id: '',
          floor: '',
          display: {},
          img: '',
          img_desc: '',
          img_title: '',
          link: ''
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
    // loginPopup,
    productTag,
    vipTag
  },
  data () {
    return {
      showLoginPopup: false,
      // favArray: [],
      currentProduct: {}, // 当前点击收藏的对象
      fromApp: getQueryString('platform', this.$route.fullPath) === 'app',
      layoutId: '',
      scheduleId: '',
      moduleNumber: '',
      productImgIndex: 1,
      shoppingCrossedPrice: 'X' // getABTestExperiment(abShoppingCrossedPrice.A.id)
    }
  },
  computed: {
    ...mapState([
      'userFavorites'
    ]),
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    }),
    loginStatus () {
      return this.$store.state.userInfo.status
    },
    curProductArr () {
      return (this.content.products || []).map((oItem) => {
        const item = Object.assign({}, oItem)
        item.isCollected = (this.userFavorites || []).indexOf(item.product_id) > -1
        const targetUrl = '/product/' + item.product_url + '.html'
        if (this.fromApp) {
          // let posTmp = this.positionName +'-'+this.prefixInteger(index+1, 3)
          // window.location.href = this.toNativeFilter(targetUrl, item.event_id,item.product_id, posTmp)
        }
        item.targetUrl = targetUrl
        return item
      })
    },
    contentCls () {
      const typeTmp = this.$ppUtils.safe(this.content, 'display.type', '')
      return typeTmp === 'scroll' ? 'scroll' : 'list'
    },
    curBGImg () {
      return this.content && cdnUrl(this.content.img)
    },
    curContentLink () {
      const url = this.content.link
      if (this.fromApp) {
        const webUrl = `"patpat://?action=webpage&mode=push&url=${url}"`
        return nativeFilter(url, webUrl, this.hostEnv)
      }
      return url
    }
  },
  filters: {
    positionContent (product) {
      const pc = {}
      pc.product_image_group_id = product.product_image_group_id || 0
      pc.product_image_id = product.product_image_id || 0
      return JSON.stringify(pc)
    }
  },
  beforeMount () {
    this.fromApp = getQueryString('platform') === 'app'
    // todo
    // let productItem = []
    // let index = 0
    // let productArr = this.$props.productListData.products
    // for (let proItem in productArr) {
    //   if (index >= 3) break
    //   productItem.push(productArr[proItem].product_id)
    //   index++
    // }
    // criteoAdTrackViewProductList(productItem)
  },
  mounted () {
    const posArrTmp = (this.content.page_position_id || '').split('-')
    this.layoutId = posArrTmp[0] // 版位id
    this.scheduleId = posArrTmp[1] // 排期id
    this.moduleNumber = posArrTmp[2] // 模块编号
  },
  methods: {
    ...mapMutations({
      setFavProduct: 'SET_FAV_PRODUCT',
      setUserFavorites: 'SET_USER_FAVORITES'
    }),
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    positionId (id) {
      let eventName
      let num = ''
      if (this.moduleType === 'productImg') {
        eventName = '_imgproductlist_'
        num = this.prefixInteger(Number(id) + 1, 3)
      } else {
        eventName = '_productlist_'
        num = id
      }
      const floor = this.content.floor
      return `${this.positionName}${this.layoutId}_${this.scheduleId}${eventName}${floor}-${this.moduleNumber}_${num}`
    },
    collectFav (item) {
      if (this.loginStatus) {
        const param = {
          event_id: item.event_id,
          product_id: item.product_id
        }
        this.patpatAPI.favoritesAdd(param).then(res => {
          this.setFavProduct(null)
          // todo 去重应该放到setUserFavorites 里去
          const favoriteIds = [...this.userFavorites]
          const isFavoriteIdx = favoriteIds.indexOf(item.product_id)
          if (isFavoriteIdx > -1) {
            favoriteIds.splice(isFavoriteIdx, 1)
          } else {
            favoriteIds.push(item.product_id)
          }
          this.setUserFavorites(favoriteIds)
        })
      } else {
        this.setFavProduct(item)
        const lang = this.$store.state.langCode
        this.$router.push({
          path: `/${lang}/account/register`
        })
      }
    },
    savePosition (event) {
      if (event.currentTarget.tagName === 'A' || this.moduleNumber) {
        const targetPosition = event.currentTarget.getAttribute('position-id')
        window.sessionStorage.setItem('last_click_position', targetPosition)
        const positionClickTime = Date.now()
        sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
      }
    },
    toNativeFilter (value, eventId, productId, hostEnv, position) {
      const webUrl = `"patpat://?action=product_detail&event_id=${eventId}&product_id=${productId}&position=${position}"`
      return nativeFilter(value, webUrl, hostEnv)
    }
  }
}
</script>
<style lang="less" scoped>

.product-list {
  width: 100%;
  position: relative;
  background: #fff;
}

.product-list ul {
  list-style: none;
  /*font-size: 0;*/
}

// .module_img {
//   float: left;
// }

.product-list ul li {
  position: relative;
  list-style: none;
  width: 50%;
  display: inline-block;
  vertical-align: top;
  padding: 9px 9px 9px 4px;
  background: #fff;
  &:nth-child(odd) {
    border-right-color: #f9fbfc;
    padding: 9px 4px 9px 9px;
  }
  img {
    width: 100%;
    height: auto;
  }
  a {
    display: block;
    width: 100%;
    background: #f9f9f9;
    text-align: center;
    font-size: 0;
  }
  .iconBox {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 70px;
    img {
      width: 70px;
      height: auto;
    }
  }
}

// img[lazy=loading] {
//   width: 100%;
//   .px2rem(height, 187);
//   margin: auto;
//   background: url('../../assets/img/patpatLogo.jpg') no-repeat center center;
//   background-size: 180px;
// }

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

.product-name {
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /*! autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  background: #fff;
  text-align: left;
  font-size: 14px;
  padding-top: 10px;
}

.product-price {
  padding: 10px 0 5px;
}

.img-product-btn {
  // background: rgb(77, 25, 31);
  color: rgb(255, 255, 255);
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 90px;
  float: right;

  /* margin-bottom: 20px; */
  position: relative;
  top: -9px;
}

.older-price {
  color: #9ba5a7;
  text-decoration: line-through;
  margin-right: 3px;
}

.new-price {
  color: #ff2556;
  margin-right: 4px;
}

.acting {
  height: 15px;
}

.sale {
  display: inline-block;
  width: 15px;
  height: 15px;
  // background: url("../../assets/img/index.png") no-repeat -25px -1px;
  background-size: 75px;
  margin-right: 10px;
}

.color {
  display: inline-block;
  width: 16px;
  height: 15px;
  // background: url("../../assets/img/index.png") no-repeat -26px -26px;
  background-size: 75px;
}

.list-loading-box {
  position: relative;
  &.box-show {
    height: 200px;
  }
}

.product-list-loading {
  min-height: 200px;
}

.no-data {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data .no-match-result {
  font-size: 18px;
  color: #b1b1b1;
  font-weight: 500;
  height: 50px;
  line-height: 50px;
}

.picBox {
  position: relative;
  min-height: 160px;

  .picBox_img {
    width: 100%;
  }
  .sold {
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 3;
    color: #fff;
    font-size: 18px;
  }
}

.collect {
  position: absolute;
  right: 15px;
  top: 143px;
  width: 27.5px;
  height: 27.5px;
  z-index: 3;
  border-radius: 50%;
  // border: 1px solid #f1f3f2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.8);

  .collect-icon {
    margin-top: 3px;
    font-size: 12px;
    color: gray;
  }
}

.collect[collect="true"] {
  background-size: 13px 11px;
  background: none;
  border: none;
  .collect-icon {
    margin-top: 3px;
    font-size: 12px;
    color: red;
  }
}

ul.scroll::-webkit-scrollbar {
  width: 0 !important;
}
ul.scroll {
  overflow-x: auto;
  display: flex;
  li {
    width: 40%;
  }
  .new-price {
    display: block;
  }
  .older-price {
    display: block;
  }
  .collect {
    top: 110px;
  }
}
</style>
