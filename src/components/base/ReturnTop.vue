<template>
  <aside tabindex="0" class="return_top" @click="backTop" v-if="showBackStatus">
    <svg width="100%" height="100%">
      <line xmlns="http://www.w3.org/2000/svg" x1="8" y1="10" x2="27" y2="10" class="style-xm" style="stroke:rgb(255,255,255);stroke-width:2"/>
      <polyline xmlns="http://www.w3.org/2000/svg" points="8,20 17,11 17,28 17,11 26,20" class="style-xm" style="fill: rgb(255, 37, 86); stroke: rgb(255, 255, 255); stroke-width: 2;"></polyline>
    </svg>
  </aside>
</template>

<script>
export default {
  data () {
    return {
      showBackStatus: false
    }
  },
  mounted () {
    const _this = this
    window.addEventListener('scroll', function () {
      const scrTop = document.body.scrollTop || document.documentElement.scrollTop
      if (scrTop > 500) {
        _this.showBackStatus = true
      } else {
        _this.showBackStatus = false
      }
    })
  },
  methods: {
    backTop () {
      let scrTop = 0
      let iSpeed = 0
      let backTopTimer = null
      backTopTimer = setInterval(function () {
        scrTop = document.body.scrollTop || document.documentElement.scrollTop
        iSpeed = scrTop / 6
        if (scrTop === 0) {
          clearInterval(backTopTimer)
        }
        document.body.scrollTop = scrTop - iSpeed
        document.documentElement.scrollTop = scrTop - iSpeed
      }, 8)
    }
  }
}
</script>

<style lang="less" scoped>
.return_top{
  position: fixed;
  bottom: 100px;
  right: 10px;
  background:#ff2556;
  width:35px;
  height:35px;
  border-radius:50%;
  opacity:0.6;
  z-index:11;
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
  .return_top {
    bottom: 85px;
  }
}
</style>
