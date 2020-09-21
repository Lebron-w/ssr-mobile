<template>
  <div class="home">
    <position-layout :faceContent="pageFaceData" class="layout-div"></position-layout>
    <div class="loading-div" v-if="pageLoading">
      <loading type="chase" />
    </div>
    <div class="may-like-box" v-if="recommendProduct.length != 0">
      <h1 class="font-medium">
        <a tabindex="0">{{$t('common.may_like')}}</a>
      </h1>
      <product-list :productList="displayRecommend" :isLoading="isLoading" :loadFinished="!hasMore" @loadMore="loadMoreRecommend"></product-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import homeStoreModule from '@/store/modules/home'

import positionLayout from '@/components/positionLayout'
import adTrackHomeShow from '@/assets/js/gtmEvent/viewHome'
import { seoPatPatTdk } from '@/assets/js/common.js'
import productList from '@/components/product/productList'
import trackMerge from '@/mixins/trackMerge'

// const { mapState, mapGetters, mapActions } = createNamespacedHelpers('home')

export default {
  serverPrefetch () {
    const siteAbb = this.$ssrContext.siteInfo.siteAbb
    this.$ssrContext.title = this.$t('common.home.home_mate_title', { tdk: seoPatPatTdk(siteAbb) })
    this.$ssrContext.description = this.$t('common.home.home_mate_description', { tdk: seoPatPatTdk(siteAbb) })
  },
  name: 'Home',
  mixins: [trackMerge],
  components: { positionLayout, productList },
  computed: {
    ...mapState({
      pageFaceData: state => {
        state = state.home
        if (!state) {
          return []
        }
        return state.faceData[0] ? state.faceData[0].floor : []
      },
      pageContentEndAt: state => {
        state = state.home
        if (!state) {
          return ''
        }
        return state.faceData[0] ? state.faceData[0].end_at : ''
      },
      recommendProduct: state => {
        state = state.home
        if (!state) {
          return ''
        }
        return state.recommendProduct
      }
    }),
    displayRecommend () {
      return this.recommendProduct.concat(this.otherRecommendArr)
    }
  },
  data () {
    return {
      recommendPn: 2,
      isLoading: false,
      hasMore: true,
      otherRecommendArr: [],
      pageLoading: false
    }
  },
  created () {
    if (!this.$isServer) {
      // this.initFn()
      adTrackHomeShow(this.$store.getters.currentCountry)
    } else {
      this.$ssrContext.pageContentEndAt = this.pageContentEndAt
    }
  },
  methods: {
    ...mapActions({
      getData: 'home/getPageData'
    }),
    async loadMoreRecommend () {
      const args = {
        page: this.recommendPn,
        page_size: 20
      }
      this.isLoading = true
      const data = await this.$store.getters.patpatAPI.getHomeRecommendProduct(args)
      if (data.length) {
        this.otherRecommendArr = this.otherRecommendArr.concat(data)
        this.recommendPn += 1
      } else {
        this.hasMore = false
      }
      this.isLoading = false
    },
    initFn () {
      const alreadyIncremented = !!this.$ppUtils.safe(this.$store.state, 'home.faceData.0.floor.length', false)
      if (!this.$store.hasModule('home')) {
        this.$store.registerModule('home', homeStoreModule, { preserveState: alreadyIncremented })
      }
      if (!alreadyIncremented) {
        this.pageLoading = true
        this.getData().then(() => {
          this.pageLoading = false
        }).catch(() => {
          this.pageLoading = false
        })
      }
    }
  },
  activated () {
    this.initFn()
  },
  destroyed () {
    this.$store.unregisterModule('home')
  }
}
</script>

<style lang="less" scoped>
.home {
  h1 {
    color: aquamarine;
  }

  .layout-div {
    margin: 0 10px;
  }

  .may-like-box {
    background: #fff;
    padding-top: 50px;
    .font-medium {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      text-align: center;
      background: #fff;
      position: relative;
      font-weight: normal;
    }
  }
}
.loading-div {
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
</style>
