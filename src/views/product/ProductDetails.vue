<template>
  <div>
    <h1>Product Details </h1>
    <div v-if="Object.keys(productInfo).length > 0">
      <ul>
        <li>
          产品名称：
          <span v-text="productInfo.product_name"></span>
        </li>
        <li>
          产品描述：
          <span v-text="productInfo.description"></span>
        </li>
        <li>
          收藏数：
          <span v-text="productInfo.like_number"></span>
        </li>
        <li>
          时间
          <span v-text="$d(new Date(1596708630088), 'ymd_hms')"></span>
        </li>
      </ul>
    </div>
    <div v-else>
      <span>API 加载中</span>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import productStoreModule from '@/store/modules/product'
import trackMerge from '@/mixins/trackMerge'

const { mapActions, mapState } = createNamespacedHelpers('product')

export default {
  name: 'product_details',
  mixins: [trackMerge],
  serverPrefetch () {
    // SEO
    const name = this.seoInfo.name
    const price = this.seoInfo.price
    this.$ssrContext.title = this.$t('product.detail.product_details_mate_title', { name: name, price: this.$uts(price), tdk: this.seoPatPatTdk })
    this.$ssrContext.description = this.$t('product.detail.product_details_mate_Description', { name: name, tdk: this.seoPatPatTdk })
  },
  computed: {
    ...mapState({
      productInfo: state => state.productInfo,
      seoInfo: state => state.seoInfo
    })
  },
  created () {
    if (!this.$isServer) {
      const alreadyIncremented = !!this.$store.state.product
      this.$store.registerModule('product', productStoreModule, { preserveState: alreadyIncremented })
      if (!alreadyIncremented) {
        console.log('客户端请求API')
        this.getData()
      }
    }

    console.log('产品详情AB测试', this.$store.getters.getABTestExperiment('product_image'), this.$store.getters.getABTestExperiments(), this.$store.getters.getABTestExperiments(false))
  },
  methods: {
    ...mapActions({
      getData: 'getPageData'
    })
  },
  mounted () {
  },
  destroyed () {
    this.$store.unregisterModule('product')
  }
}
</script>
