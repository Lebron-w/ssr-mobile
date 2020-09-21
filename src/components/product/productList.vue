<!--
 * @Description: 商品列表 - 列表组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-20 16:44:37
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-29 16:13:14
 * @FilePath: /website-ssr-mobile/src/components/product/productList.vue
-->

<template>
  <div class="product-list-content">
    <pui-list class="product-list" :loading="isLoading" :offset="50" :loadingText="loadingText"
      :error.sync="loadError" :errorText="errorText"
      :finished="loadFinished" :finishedText="finishedText" @load="loadMore()">
      <template v-for="(product, idx) in productList">
        <product-item :key="product.id" :isNewCategory="isNewCategory" :productIdx="idx"
          :product="product" :positionName="positionName" :listType="listType" @collectFav="collectFavProduct"/>
      </template>
    </pui-list>
  </div>
</template>

<script>
import ProductItem from './productItem'
import { mapState, mapGetters, mapMutations } from 'vuex'
import trackChildren from '@/mixins/trackChildren'
import adTrackAddToFavorites from '@/assets/js/gtmEvent/addToFavorites.js'
import adTrackViewProductList from '@/assets/js/gtmEvent/viewProductList.js'
import criteoAdTrackViewProductList from '@/assets/js/gtmEvent/criteoViewProductList.js'

export default {
  name: 'ProductList',
  mixins: [trackChildren],
  components: {
    ProductItem
  },
  props: {
    productList: {
      type: Array,
      default: () => []
    },
    productIcon: {
      type: String,
      default: ''
    },
    positionName: {
      type: String,
      default: ''
    },
    isNewCategory: {
      type: Number,
      default: 0
    },
    // 展示loading
    isLoading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    // 加载完成 考虑到版位，推荐等要共用，默认设为以全部加载，如果需要上拉加载更多，自己根据接口请求返回的数量来设置
    loadFinished: {
      type: Boolean,
      default: true
    },
    finishedText: {
      type: String,
      default: ''
    },
    // 加载更多出错，是否展示文案
    loadError: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState([
      'loginStatus',
      'userFavorites'
    ]),
    ...mapGetters({
      patpatAPI: 'patpatAPI'
    }),
    listType () {
      const routePath = this.$route.path
      const type = {
        '/category/': 'Category Results',
        '/new-arrivals': 'New Arrivals Results',
        '/Sale': 'Sale Results',
        '/Daily-Special/': 'Daily Special Results',
        '/flash-sale': 'Flash Sale Results',
        '/product/': 'You May Also Like Results',
        '/search': 'Search Results'
      }
      let event = 'YOU MAY LIKE Results'
      for (const t in type) {
        if (routePath.indexOf(t) >= 0) {
          event = type[t]
          break
        }
      }
      return event
    }
  },
  data () {
    return {
      observer: null
    }
  },
  methods: {
    ...mapMutations({
      setFavProduct: 'SET_FAV_PRODUCT',
      setUserFavorites: 'SET_USER_FAVORITES'
    }),
    collectFavProduct (item) {
      if (this.loginStatus) {
        const param = {
          event_id: item.event_id,
          product_id: item.product_id
        }

        if (!item.is_favorite) {
          const trackData = {
            product_id: item.product_id,
            sku_id: item.sku_id || 0,
            product_price: item.price,
            product_name: item.product_name,
            product_category: item.crumb ? item.crumb.replace(/[>]/g, '/') : ''
          }
          if (item.sku_id && item.sku_id > 0) {
            adTrackAddToFavorites(trackData)
          } else {
            this.patpatAPI.detailProduct({ product_name: item.product_url }).then(res => {
              const firstColor = res.images.map(sItem => sItem.color)[0].toLowerCase()
              const product = res.products
              for (let i = 0; i < product.length; i++) {
                for (let j = 0; j < product[i].option.length; j++) {
                  if (product[i].option[j].color && product[i].option[j].color.toLowerCase() === firstColor) {
                    trackData.sku_id = product[i].sku_id
                    adTrackAddToFavorites(trackData)
                    return
                  }
                }
              }
            })
          }
        }

        this.patpatAPI.favoritesAdd(param).then(() => {
          this.setFavProduct(null)
          const favoriteIds = [...this.userFavorites]
          const isFavoriteIdx = favoriteIds.indexOf(item.product_id)
          if (isFavoriteIdx > -1) {
            favoriteIds.splice(isFavoriteIdx, 1)
          } else {
            favoriteIds.push(item.product_id)
          }
          this.setUserFavorites(favoriteIds)
        })
        this.appendClickTrackData('click_favorite')
      } else {
        this.setFavProduct(item)
        const lang = this.$store.state.langCode === 'en' ? '' : `/${this.$store.state.langCode}`
        this.$router.push({
          path: `${lang}/account/register`
        })
      }
    },
    loadMore () {
      this.$emit('loadMore')
    }
  },
  mounted () {
    const arrId = []
    this.productList.map((item, index) => {
      if (index < 3) {
        arrId.push(item.product_id)
      }
    })
    criteoAdTrackViewProductList(arrId)

    const elements = document.querySelectorAll('.product-item')
    this.observer = new IntersectionObserver(entries => {
      const impressions = []
      entries.forEach(item => {
        if (item.intersectionRatio === 1) {
          const index = item.target.getAttribute('index')
          const pro = this.productList[index]
          impressions.push({
            brand: 'PatPat',
            category: pro.crumb,
            id: pro.product_id,
            list: 'Category Results',
            name: pro.product_name,
            position: index + 1,
            price: pro.price
          })
          this.observer.unobserve(item.target)
        }
      })
      const arr = []
      if (impressions.length > 4) {
        for (let i = 0; i < impressions.length; i += 4) {
          arr.push(impressions.slice(i, i + 4))
        }
      }
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          adTrackViewProductList(arr[i])
        }
      } else if (impressions.length > 0) {
        adTrackViewProductList(impressions)
      }
    }, { threshold: [1.0] })
    for (const i of elements) {
      this.observer.observe(i)
    }
  }
}
</script>

<style lang="less" scoped>
.product-list-content {
  min-height: 372px;
  background: linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(240,243,242,1) 100%);
  /deep/ *{
    .pui-list-error, .pui-list-finished, .pui-list-loading {
      width: 100%;
      text-align: center;
    }
  }
  .product-list {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    padding: 0 9px;
    .list-loading {
      margin: 20px 0 20px;
      width: 100%;
      height: 20px;
      position: relative;
    }
  }
}
</style>
