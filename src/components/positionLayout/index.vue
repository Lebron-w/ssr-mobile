<template>
    <div>
        <div v-for="(ctx,index) in faceData" :key="ctx.floor" :id="ctx.floor">
            <line-padding v-if="ctx.module_name === 'spacing'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></line-padding>
            <carousel v-if="ctx.module_name === 'carousel'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></carousel>
            <map-area v-if="ctx.module_name === 'picture_hot_spot'" :idx="0+''+index" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></map-area>
            <daily-special v-if="ctx.module_name === 'dailySpecial'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></daily-special>
            <picture-box v-if="ctx.module_name === 'img'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></picture-box>
            <background-color v-if="ctx.module_name === 'bgColor'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></background-color>
            <flash-sale v-if="ctx.module_name === 'flashSale'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></flash-sale>
            <product-list v-if="ctx.module_name === 'productList' || ctx.module_name === 'productImg'" :module-type="ctx.module_name" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></product-list>
            <nav-list v-if="ctx.module_name === 'nav'" :content="ctx.content" :positionName="positionPrefix" :hostEnv="curHostEnv"></nav-list>
        </div>
    </div>
</template>

<script>
// 'picture_hot_spot'; 热区
// 'carousel'; 轮播
// 'spacing'; 行间距
// 'bgImg'; 背景
// 'nav'; 导航
// 'dailySpecial'
// 'flashSale'
// 'productImg'; 商品图片模块
// 'productList'; 商品列表模块
import linePadding from './linePadding'
import carousel from './carousel'
import mapArea from './mapArea'
import dailySpecial from './dailySpecial'
import pictureBox from './pictureBox'
import backgroundColor from './backgroundColor'
import flashSale from './flashSale'
import productList from './productList'
import navList from './navList'

import { getPlatformInfo } from '@/utils/base'

// import { createNamespacedHelpers } from 'vuex'
// import homeStoreModule from '@/store/modules/home'

// const { mapGetters, mapActions } = createNamespacedHelpers('home')

export default {
  serverPrefetch () {
  },
  components: {
    linePadding,
    carousel,
    mapArea,
    dailySpecial,
    pictureBox,
    backgroundColor,
    flashSale,
    productList,
    navList
  },
  props: {
    pid: {
      type: Number,
      default: 4
    },
    positionPrefix: {
      type: String,
      default () {
        return 'home-'
      }
    },
    faceContent: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    // ...mapGetters({
    //   faceData: 'faceData'
    // }),
    faceData () {
      // 处理数据格式，将floor放进content
      const arrTmp = (this.faceContent || []).map(oItem => {
        const item = Object.assign({}, oItem)
        if (item.content) {
          item.content.floor = item.floor
        }
        return item
      })
      return arrTmp
    }
  },
  data () {
    return {
      curHostEnv: {}
    }
  },
  created () {
    // if (!this.$isServer) {
    //   const alreadyIncremented = !!this.$store.state.faceData
    //   this.$store.registerModule('home', homeStoreModule, { preserveState: alreadyIncremented })
    //   if (!alreadyIncremented) {
    //     this.getData()
    //   }
    // }
  },
  beforeMount () {
    this.curHostEnv = getPlatformInfo()
  },
  methods: {
    // ...mapActions(['getFaceData']),
    // getData() {
    //   let faceScheduleId = getQueryString('face_schedule_id', this.$route.fullPath)
    //   let faceToken = getQueryString('face_token', this.$route.fullPath)
    //   return this.getFaceData({
    //     id: this.pid,
    //     face_schedule_id: faceScheduleId,
    //     face_token: faceToken
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
