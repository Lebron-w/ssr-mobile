<!--
 * @Description: 商品列表 - 单个商品角标组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-23 11:28:30
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-19 15:48:02
 * @FilePath: /website-ssr-mobile/src/components/product/productTag.vue
-->

<template>
  <div class="product-item-tag">
    <template v-if="tagInfo.badge">
      <div class="badge-logo">
        <pat-img :src="tagInfo.badge" alt="product icon" />
      </div>
    </template>
    <template v-else-if="tagInfo.isMemberDay">
      <div class="tag-com" :style="'top:' + top + 'px; left: ' + left + 'px'">
        <p v-if="tagInfo.discount * 100 === 0">VIP</p>
        <p v-else>Lv{{loginStatus ? tagInfo.level : '?'}}</p>
        <p v-if="tagInfo.discount * 100 === 0">7.25</p>
        <p v-else>-{{loginStatus ? tagInfo.discount * 100 : '?'}}%</p>
      </div>
    </template>
    <template v-else>
      <div class="iconBox" v-if="tagInfo.productIcon">
        <img :src="productIcon" alt="product icon" />
      </div>
      <div class="sale-logo" v-if="tagInfo.isShowSaleOff && tagInfo.saleRouteType">
        <pat-img class="sale-logo-img" :src="onSaleLogo" alt="on sale" />
      </div>
      <div class="sale" v-if="tagInfo.isShowSaleOff && !tagInfo.saleRouteType">
        <p class="salep1">{{tagInfo.salePerson}}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProductItemTag',
  props: {
    tagInfo: {
      type: Object,
      default: () => {}
    },
    top: {
      type: [Number, String],
      default: 0
    },
    left: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    ...mapState([
      'loginStatus'
    ]),
    onSaleLogo () {
      return require('@/assets/images/product/onsale_' + (this.$store.state.langCode === 'it' ? 'en' : this.$store.state.langCode) + '.png')
    }
  }
}
</script>

<style lang="less" scoped>
.product-item-tag {
  position: absolute;
  top: 5px;
  left: 5px;
  .tag-com {
    width: 40px;
    height: 40px;
    background-image: url('~@/assets/images/activities/vip-discount.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding-top: 13px;
    p {
      color: #fff;
      height: 12px;
      font-size: 10px;
      text-align: center;
      font-weight: 600;
    }
  }
  .iconBox {
    width: 70px;
    img{
      width: 70px;
    }
  }
  .sale-logo{
    .sale-logo-img{
      width: 30px;
      height: 30px;
      display: block;
    }
  }
  .sale{
    width: 30px;
    height: 40px;
    background: url("~@/assets/images/product/product-sale.png") no-repeat;
    background-size:100% auto;
    padding-left: 3px;
    .salep1{
      margin-top: 9px;
      text-align: center;
      color: #fff;
      font-size: 9px;
      line-height: 9px;
      font-family: patpat-Bold;
    }
  }
  .badge-logo {
    width: 40px;
    top: -5px;
    position: absolute;
    left: -4px;

    img {
      width: 100%;
    }
  }
}

// 用于版位的样式
.layout {
  .tag-com {
    padding-top: 16px;
    top: -17px;
    left: -7px;
    width: 50px;
    height: 50px;

    p {
      height: 15px;
    }
  }
}

#country-ar {
  .product-item-tag {
    right: 5px;
    left: auto;
  }
  // 版位样式
  .layout {
    .tag-com {
      left: auto;
      right: 0px;
    }
  }
  .badge-logo {
    right: -4px;
    left: auto;
  }
}
</style>
