<!--
 * @Description: 商品列表 - 单个商品组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-23 11:16:37
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-18 17:46:51
 * @FilePath: /website-ssr-mobile/src/components/product/productItem.vue
-->

<template>
  <li class="product-item" :index="productIdx">
    <pat-router-link :to="productUrl" :data-href="dataHref" :position-id="positionId" @mousedown.native="productClick($event)">
      <div class="product-img">
        <!-- 左上角 角标 -->
        <product-tag :tagInfo="tagInfo" />
        <!-- 列表主图 -->
        <pat-img :style="{minHeight: imgHeight + 'px'}" :src="product.icon" thumbnailSize="350x350" lazyLoad data-type="product" type="product"
        :data-id="product.product_id" :position-id="positionId" :position-content="positionContent" :alt="product.product_name"
        v-patpat-exposure="appendExposureData" track="unTrack" lazymode='bg' />
        <!-- 添加收藏按钮 -->
        <button class="collect-box" :class="{'active': isFavorite}"
          :aria-haspopup="!loginStatus" :aria-controls="product.product_id"
          :aria-label="isFavorite ? 'delete to favourites' : 'add to favourites'"
          :aria-expanded="loginStatus ? false : showLoginPopup"
          @click.stop.prevent="collectFav(product, productIdx)"
          v-if="!isFromApp">
          <pui-icon class="collect" :name="isFavorite ? 'collect-fill' : 'collect'" />
        </button>
        <!-- sold out 标识 -->
        <div class="sold-out-tip" v-if="Number(product.stock)==0">{{$t('product.category.sold_out')}}</div>
      </div>
      <!-- 商品信息 -->
      <div class="product-info">
        <!-- 商品价格 -->
        <div class="product-price">
          <template v-if="product.price">
            <span class="font-medium new-price">{{ $uts(product.price) }}</span>
          </template>
          <del class="older-price2" v-if="isShowOlderPrice">
            {{ $uts(product.is_member_day ? product.store_price : product.msrp) }} soon
          </del>
          <del class="older-price" v-else>
            {{ $uts(product.is_member_day ? product.store_price : product.msrp) }}
          </del>
        </div>
        <div class="acting">
          <span class="sale" v-if="isShowActingSale"></span>
          <span class="color" v-if="product.is_multiple"></span>
        </div>
      </div>
    </pat-router-link>
  </li>
</template>

<script>
import ProductTag from './productTag'
import { getPlatformInfo } from '@/utils/base'
import { mapState } from 'vuex'
import trackChildren from '@/mixins/trackChildren.js'
import adTrackProductClick from '@/assets/js/gtmEvent/productClick.js'

export default {
  name: 'ProductItem',
  mixins: [trackChildren],
  components: {
    ProductTag
  },
  props: {
    // 商品数据
    product: {
      type: Object,
      default: () => {}
    },
    productIcon: {
      type: String,
      default: ''
    },
    isNewCategory: {
      type: Number,
      default: 0
    },
    eventId: {
      type: String,
      default: ''
    },
    // 商品列表下表，用于坑位ID
    productIdx: {
      type: Number,
      default: null
    },
    positionName: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: ''
    },
    showLoginPopup: Boolean
  },
  data () {
    return {
      clientWidth: 375
    }
  },
  computed: {
    ...mapState([
      'loginStatus',
      'userFavorites'
    ]),
    isFromApp () {
      const platform = this.$route.query.platform ? this.$route.query.platform : ''
      return platform === 'app'
    },
    hostEnv () {
      const hostEnv = getPlatformInfo()
      return hostEnv
    },
    categoryName () {
      let categoryName = ''
      if (this.$route.params.u1) {
        categoryName = this.$route.params.u1.replace(/.html/, '')
      }
      return categoryName
    },
    isFavorite () {
      const userFavorites = this.userFavorites
      const isFavorite = userFavorites.indexOf(this.product.product_id)
      return isFavorite > -1
    },
    isShowActingSale () {
      let isShowActingSale = false
      if (this.categoryName.toLowerCase() === 'sale' && this.product.event_type === 1 && this.product.event_id > 0) {
        isShowActingSale = true
      }
      return isShowActingSale
    },
    isShowOlderPrice () {
      return this.product.tags && this.product.tags.length > 0
    },
    // 商品链接 或者 跳转APP交互
    productUrl () {
      let productUrl = `/product/${this.product.product_url}.html`
      if (this.product.sku_id) {
        productUrl = `${productUrl}?sku_id=${this.product.sku_id}`
      }
      // TODO: 跳转APP处理（统一在 pat-router-link 中处理，还未完善）
      if (this.isFromApp) {
        // let nativeUrl = `patpat://?action=product_detail&event_id=${this.product.event_id}&product_id=${this.product.product_id}&position=${this.position}`
        // productUrl = nativeFilter(productUrl, nativeUrl, this.hostEnv)
      }
      return productUrl
    },
    imgHeight () {
      const imgHeight = (this.clientWidth - 18) * 0.49
      return imgHeight
    },
    // data-href 不能删除，A标签必须绑定这个参数，埋点坑位 ID 需要用到
    dataHref () {
      const dataHref = '/product/' + this.product.product_url + '.html?is_new_category=' + (this.isNewCategory || 0) + '&sku_id=' + (this.product.sku_id || 0)
      return dataHref
    },
    // 角标信息
    tagInfo () {
      let info = {}
      const saleRouteType = this.categoryName.toLowerCase() !== 'sale' && this.categoryName.toLowerCase() !== 'new-arrivals' && this.$route.name === 'category'
      let isShowSaleOff = false
      const salePerson = -Math.round((this.product.msrp - this.product.price) / this.product.msrp * 100) + '%'
      // sale类别商品显示折扣图标
      if (this.categoryName.toLowerCase() === 'sale' && this.product.price * 1 < this.product.msrp * 1) {
        isShowSaleOff = true
      }
      // new-arrivals插入flash-sale商品显示折扣图标
      if (this.product.tags && this.product.tags.length > 0) {
        isShowSaleOff = true
      }
      // 仅针对网站端的类目页(除Sale和New Arrivals页面)和营销落地页进行修改
      if (saleRouteType && this.product.price * 1 < this.product.store_price * 1) {
        isShowSaleOff = true
      }

      info = {
        saleRouteType,
        isShowSaleOff,
        salePerson,
        productIcon: this.productIcon,
        isMemberDay: this.product.is_member_day,
        level: this.product.member_day_level,
        discount: this.product.member_day_discount,
        badge: this.product.product_badge
      }
      return info
    },
    positionId () {
      const num = (Array(3).join('0') + (this.productIdx + 1)).slice(-3)
      const positionId = `${this.positionName}-${num}`
      return positionId
    },
    positionContent () {
      const pc = {}
      pc.product_image_group_id = this.product.product_image_group_id || 0
      pc.product_image_id = this.product.product_image_id || 0
      return JSON.stringify(pc)
    }
  },
  mounted () {
    this.clientWidth = document.body.clientWidth
  },
  methods: {
    collectFav (item, index) {
      this.$emit('collectFav', item, index)
    },
    productClick (event) {
      const crumb = this.product.crumb || ''
      const data = {
        listType: this.listType,
        product: {
          name: this.product.product_name,
          id: this.product.product_id,
          price: this.product.price,
          brand: 'PatPat',
          category: crumb,
          position: this.productIdx + 1
        }
      }
      adTrackProductClick(data)
      const targetPosition = event.currentTarget.getAttribute('position-id')
      const positionClickTime = Date.now()
      window.sessionStorage.setItem('last_click_position', targetPosition)
      sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
    }
  }
}
</script>

<style lang="less" scoped>
.product-item {
  width: 49%;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #fff;
  a {
    display: block;
    .product-img {
      position: relative;
      img {
        display: block;
        width: 100%;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      // img[lazy="loading"] {
      //   width: 100%;
      //   height: 100%;
      //   background: #f9f9f9 url("~@/assets/images/base/bg-logo.png") no-repeat center center;
      //   background-size: 45px;
      // }
      // img[lazy="error"] {
      //   width: 100%;
      //   height: 100%;
      //   background: #f9f9f9 url("~@/assets/images/base/bg-logo.png") no-repeat center center;
      //   background-size: 45px;
      // }
      .collect-box{
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 5px;
        width: 26px;
        height: 26px;
        line-height: 18px;
        text-align: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, .9);
        &.active {
          background: none;
          .collect {
            color: #fb445d;
          }
        }
        .collect {
          display: inline-block;
          font-size: 14px;
          color: #4e4e4e;
        }
      }
      .sold-out-tip {
        position: absolute;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
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
    .product-info {
      margin-top: 10px;
      display: flex;
      padding: 0 5px 10px;
      .product-price {
        flex: 1;
        .new-price{
          color: #ff2556;
          margin-right: 4px;
          font-size: 14px;
        }
        .older-price{
          color: #9ba5a7;
          text-decoration: line-through;
          margin-right: 3px;
        }
        .older-price2{
          margin-right:3px;
          background: url('~@/assets/images/product/price.png') no-repeat;
          background-size: 100% 100%;
          color: #fff;
          text-decoration: initial;
          padding: 0 8px 0 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
        }
      }
      .acting {
        .sale {
          display: inline-block;
          width: 15px;
          height: 15px;
          background: url("~@/assets/images/product/icons.png") no-repeat -25px -1px;
          background-size: 75px;
          margin-right: 10px;
        }
        .color {
          display: inline-block;
          width: 16px;
          height: 15px;
          background: url("~@/assets/images/product/icons.png") no-repeat -26px -26px;
          background-size: 75px;
        }
      }
    }
  }
}
#country-ar {
  .product-img {
    .collect-box {
      right: auto;
      left: 5px;
    }
  }
}
</style>
