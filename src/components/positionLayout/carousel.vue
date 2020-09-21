<script>
import { getQueryString } from '@/utils/base.js'
import { nativeFilter } from '@/utils/native'

import trackChildren from '@/mixins/trackChildren.js'

export default {
  mixins: [trackChildren],
  props: {
    content: {
      type: Object,
      default () {
        return {
          items: [],
          page_position_id: '',
          floor: ''
        }
      }
    },
    positionName: String,
    hostEnv: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      minH: 0,
      viewPortWidth: 375
    }
  },
  computed: {
    listArr () {
      const ppidArr = (this.content.page_position_id || '').split('-')
      const layoutId = ppidArr[0]
      const scheduleId = ppidArr[1]
      const moduleNumber = ppidArr[2]
      const floor = this.content.floor
      const pc = {
        layoutId: layoutId,
        scheduleId: scheduleId,
        moduleNumber: moduleNumber
      }
      const positionContent = JSON.stringify(pc)
      const arrTmp = (this.content.items || []).map((item, idx) => {
        const idxMode = this.prefixInteger(idx + 1, 3)
        item.curPositionId = `${this.positionName}${layoutId}_${scheduleId}_slide_${floor}-${moduleNumber}_${idxMode}`
        item.positionContent = positionContent
        item.moduleNumber = moduleNumber
        return item
      })
      return arrTmp
    }
  },
  filters: {

  },
  beforeMount () {
    this.calcMinHeight()
  },
  mounted () {

  },
  methods: {
    toNativeFilter4WebPage (value, hostEnv) {
      const webUrl = `"patpat://?action=webpage&mode=push&url=${value}"`
      return nativeFilter(value, webUrl, hostEnv)
    },
    calcMinHeight () {
      const targetImg = this.$ppUtils.safe(this.content, 'items.0', {})
      const viewPortWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth) - 20
      this.minH = targetImg.img_height / targetImg.img_width * viewPortWidth + 'px'
      this.viewPortWidth = viewPortWidth
    },
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    carouselPpTrack (event, url) {
      if (!url) return false
      const targetPosition = event.currentTarget.getAttribute('position-id')
      window.sessionStorage.setItem('last_click_position', targetPosition)
      const positionClickTime = Date.now()
      sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
    }
  },
  render () {
    const swiperLen = this.listArr.length
    const fromApp = getQueryString('platform', this.$route.fullPath) === 'app'
    const swiperItems = (this.listArr || []).map((item, index) => {
      let curUrlLink = item.location_url
      if (fromApp) {
        const webUrl = `"patpat://?action=webpage&mode=push&url=${curUrlLink}"`
        curUrlLink = nativeFilter(curUrlLink, webUrl, this.hostEnv)
      }
      const aItem = <patRouterLink tabindex="0"
        position-id={item.curPositionId}
        // onClick = { ($event) => this.carouselPpTrack($event, item.location_url) }
        to = {curUrlLink}
        data-href={item.location_url}
        class="banner-link"
        imgbgtrack
        track="unTrack"
        data-type="slide"
        data-id={item.moduleNumber}
        position-content={item.positionContent}
        v-patpat-exposure={this.appendExposureData}
      >
        <PatImg src={item.img} thumbnailSize="80" lazyLoad class="banner-link-img" />
      </patRouterLink>
      return swiperLen > 1 ? <pui-swiper-item key={index}> {aItem} </pui-swiper-item> : aItem
    })

    return (
      <div class="module-carousel" style={{ minHeight: this.minH }}>
        {
          swiperLen > 1
            ? <pui-swiper loop={true} autoplay={3000}>
            {...swiperItems}
            <div class="swiper-pagination" slot="pagination"></div>
            </pui-swiper>
            : <div>{...swiperItems}</div>
        }
      </div>
    )
  }
}
</script>

<style scoped lang="less">
  .module-carousel{
    font-size: 0;
    direction: ltr;
    min-height: 100px;
    .banner-link{
      img{
        width: 100%;
        border-radius: 8px;
        // background-color: @pp-background-color;
        // background: @pp-bg-img;
      }
    }
    .carousel-img{
      width: 100%;
      border-radius: 8px;
    }
  }
  .module-carousel a.banner-link {
    display: block;
  }
</style>
<style>
/* .pui-swipe__indicators .pui-swipe__indicator {
  background: #000;
} */
</style>
