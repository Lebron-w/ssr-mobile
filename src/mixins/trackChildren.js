/**
 * 子组件需要track上报数据混入用到的相关属性方法
 */
export default {
  methods: {
    pageComponent () {
      let pageComponent = {}
      if (this.$root.$children[0].$refs.pageComponent) {
        pageComponent = this.$root.$children[0].$refs.pageComponent
      }
      if (pageComponent.$refs && pageComponent.$refs.pageComponent) {
        pageComponent = pageComponent.$refs.pageComponent
      }
      return pageComponent
    },
    appendClickTrackData (clickName, otherObj = null) {
      const pageComponent = this.pageComponent()
      if (pageComponent.appendClickTrackData) {
        pageComponent.appendClickTrackData(clickName, otherObj)
      }
    },
    appendShowTrackData (clickName, otherObj = null) {
      const pageComponent = this.pageComponent()
      if (pageComponent.appendShowTrackData) {
        pageComponent.appendShowTrackData(clickName, otherObj)
      }
    },
    appendPageTrackData (clickName, otherObj = null) {
      const pageComponent = this.pageComponent()
      if (pageComponent.appendPageTrackData) {
        pageComponent.appendPageTrackData(clickName, otherObj)
      }
    },
    postAddToCartTrack (attachParams = {}) {
      const pageComponent = this.pageComponent()
      if (pageComponent.appendPageTrackData) {
        pageComponent.postAddToCartTrack(attachParams)
      }
    },
    appendExposureData (el) {
      const pageComponent = this.pageComponent()
      if (pageComponent.appendExposureData) {
        pageComponent.appendExposureData(el)
      }
    }
  }
}
