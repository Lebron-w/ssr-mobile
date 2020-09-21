<template>
  <div
    class="module-map-img"
    :style="{height: hStyle}"
  >
    <pat-img @load="getWrapHeight" lazyLoad :src="curBgImg" :usemap="'#map-img-'+idx"></pat-img>
    <map :name="'map-img-'+idx" :id="'map-img-'+idx">
      <patRouterLink
        v-for="(item,indexBox) in areaArr"
        :key="indexBox"
        :data-href="item.location_url"
        :position-id="positionId + prefixInteger(indexBox+1,3)"
        position-content="{}"
        :data-id="moduleNumber"
        data-type="picturehotspot"
        shape="rect"
        :coords="item.area"
        :alt="item.location_url"
        :to="item.location_url"
        tag="area"
      />
      <img
        v-for="(item,index) in content.items"
        v-show="imgState"
        lazy="loaded + '/80'"
        track="unTrack"
        :position-id="positionId + prefixInteger(index+1,3)"
        position-content="{}"
        :data-id="moduleNumber"
        data-type="picturehotspot"
        :key="item.mid + index"
        v-patpat-exposure="appendExposureData"
      />
    </map>
  </div>
</template>

<script>
// import { getStrId, langUrl, isOutLink } from '../../config/toolFilter'

import { cdnUrl } from '@/utils/base.js'
// import { nativeFilter } from '@/utils/native'

import trackChildren from '@/mixins/trackChildren.js'

export default {
  name: 'mapImg',
  mixins: [trackChildren],
  data () {
    return {
      imgLoad: false,
      moduleNumber: '',
      imgState: false,
      hStyle: '',
      screenW: 0,
      positionId: ''
    }
  },
  props: {
    idx: String,
    content: {
      type: Object,
      default () {
        return {
          items: [],
          page_position_id: '',
          floor: '',
          img: '',
          img_width: 0,
          img_height: 0
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
  computed: {
    areaArr () {
      return this.content.items.map(item => {
        const tmp = Object.assign({}, item)
        tmp.area = this.getCoords(item.area)
        return tmp
      })
    },
    curBgImg () {
      return cdnUrl(this.content.img)
    }
  },
  // filters: {
  //   toNativeFilter(value, hostEnv) {
  //     let webUrl = `"patpat://?action=webpage&mode=push&url=${value}"`
  //     return nativeFilter(value, webUrl, hostEnv)
  //   }
  // },
  methods: {
    getPositionId () {
      const ppidArr = (this.content.page_position_id || '').split('-')
      const layoutId = ppidArr[0]
      const scheduleId = ppidArr[1]
      const moduleNumber = ppidArr[2]
      const floor = this.content.floor
      this.positionId = `${this.positionName}${layoutId}_${scheduleId}_picturehotspot_${floor}-${moduleNumber}_`
      this.moduleNumber = moduleNumber
    },
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    // mapImgPpTrack(event, url, hostEnv) {
    //   if (!url) return false
    //   let targetPosition = event.currentTarget.getAttribute('position-id')
    //   window.sessionStorage.setItem('last_click_position', targetPosition)
    //   let positionClickTime = Date.now()
    //   sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
    //   if (this.isOutLinklist(url)) {
    //     window.open(url, name)
    //   } else {
    //     let fromApp = getQueryString('platform') === 'app'
    //     if (fromApp) {
    //       let webUrl = `"patpat://?action=webpage&mode=push&url=${url}"`
    //       window.location.href = nativeFilter(url, webUrl, hostEnv)
    //     } else {
    //       // this.$router.push(langUrl(url))
    //       this.$router.push(url)
    //     }
    //   }
    // },
    getWrapHeight () {
      this.imgLoad = true
    },
    isOutLinklist (url) {
      return url.match(/http|https/ig)
      // return isOutLink(url)
    },
    getCoords (area) {
      if (!area.length) {
        return []
      }
      const ratio = this.screenW / 414
      const x1 = area[0] * ratio
      const y1 = area[1] * ratio
      const x2 = area[2] * ratio + x1
      const y2 = area[3] * ratio + y1
      return [x1, y1, x2, y2].join()
    }
  },
  beforeMount () {
    this.getPositionId()
  },
  mounted () {
    const clientWidthTmp = Math.min(document.documentElement.clientWidth, document.body.clientWidth) - 20
    this.hStyle = (this.content.img_height / this.content.img_width) * clientWidthTmp + 'px'
    this.screenW = window.screen.width
  }
}
</script>

<style scoped lang="less">
.module-map-img {
  // padding: 0 10px;
  area {
    outline: none;
  }
  img {
    width: 100%;
    vertical-align: bottom;
  }
}
img[lazy="loading"] {
  width: 100%;
  height: 100%;
  background: @pp-bg-img;
  background-size: 45px;
}
</style>
