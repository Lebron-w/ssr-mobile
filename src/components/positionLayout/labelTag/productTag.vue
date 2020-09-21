<template>
  <!-- 版位:图片+商品左上角tag -->
  <div class="product_tag">
    <template v-if="item.product_badge">
      <div class="badge-logo">
        <pat-img :src="item.product_badge" alt="product icon" />
      </div>
    </template>
    <div
      v-else-if="item.product_tag.type==='discount'"
      class="product_tag_icon product_tag_icon_null"
      :style="{backgroundColor:moduleType==='productImg'? item.product_tag.color: '#f1435a'}"
    >{{discountValue}}</div>
    <div
      v-else
      :class="'product_tag_icon_' + item.product_tag.icon"
      :style="{backgroundColor:item.product_tag.type?'#f1435a': ''}"
      class="product_tag_icon"
    ></div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    item: Object,
    moduleType: String
  },
  computed: {
    discountValue () {
      return this.item.discount ? this.item.discount : Math.round((((this.item.event_price) - (this.item.msrp)) / (this.item.msrp)) * 100) + '%'
    }
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
.product_tag {
  width: 100%;
  height: auto;
  position: relative;
  .product_tag_icon {
    z-index: 1;
    width: 28px;
    height: 28px;
    border-radius: 50px;
    position: absolute;
    text-decoration: none;
    top: 5px;
    left: 5px;
  }
  .product_tag_icon_null {
    z-index: 1;
    text-align: center;
    text-decoration: none;
    line-height: 28px;
    color: #fff;
    font-size: 11px;
    top: 5px;
    left: 5px;
  }
  .product_tag_icon_New {
    background: url("~@/assets/images/product/cornerMark.png") no-repeat 0 -28px;
    background-size: 28px;
  }
  .product_tag_icon_Hot {
    background: url("~@/assets/images/product/cornerMark.png") no-repeat 0 0;
    background-size: 28px;
  }
  .product_tag_icon_on_sale {
    background: url("~@/assets/images/product/cornerMark.png") no-repeat 0 -56px;
    background-size: 28px;
  }
  .badge-logo {
    width: 40px;
    top: -5px;
    position: absolute;
    left: -4px;
    z-index: 1;

    img {
      width: 100%;
    }
  }
}

#country-ar {
  .product_tag .badge-logo {
    right: -4px;
    left: auto;
  }
}
</style>
