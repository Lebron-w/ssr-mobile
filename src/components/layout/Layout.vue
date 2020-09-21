<template>
  <div class="container">
    <TopActivity></TopActivity>
    <header v-show="showHeader" class="container-header" :class="{'header-animate': headerAnimate}">
      <Header></Header>
    </header>
    <main class="container-main">
      <slot></slot>
    </main>
    <footer v-show="showFooter" class="container-footer">
      <Footer></Footer>
    </footer>
    <SiderBar></SiderBar>
    <gifts2Newer></gifts2Newer>
    <vipDayPopup></vipDayPopup>
  </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'
import SiderBar from '../siderBar/SiderBar'
import TopActivity from './TopActivity'
import { mapState, mapActions } from 'vuex'

// vipday > 新人0元购 > gifts2Newer(vipday 未领取)
import gifts2Newer from '@/components/addition/gifts2Newer/index'
import vipDayPopup from '@/components/addition/vipDialog/index'

export default {
  name: 'Layout',
  components: {
    Footer,
    Header,
    SiderBar,
    TopActivity,
    gifts2Newer,
    vipDayPopup
  },
  computed: {
    ...mapState({
      headerAnimate: 'headerAnimate',
      showHeader: 'showHeader',
      showFooter: 'showFooter'
    })
  },
  methods: {
    ...mapActions(['getUserNavigation'])
  },
  mounted () {
    // 获取活动信息
    this.getUserNavigation()
  }
}
</script>

<style lang="less" scoped>
.container {
  .header-animate {
    transform: translate3d(0, -200%, 91px);
  }
  .container-header {
    position: sticky;
    top: 0px;
    background-color: #fff;
    height: @pp-nav-height;
    z-index: 99;
    transition: transform .4s ease-out,-webkit-transform .4s ease-out;
  }
  // .container-main {
  //   min-height: 1640px;
  // }
}
</style>
