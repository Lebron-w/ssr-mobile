<template>
  <div class="module-picturebox-column">
    <patRouterLink
      tabindex="0"
      :aria-label="item.title || 'PatPat Daily Deal'"
      class="img-wrap"
      imgbgtrack
      track="unTrack"
      v-bgLazy="{src: item.img, style: 'url(' + cdnUrl(item.img) + ') no-repeat center center / 0PX', height:imgHeight}"
      :style="{height:imgHeight + 'px', background: 'url(' + cdnUrl(item.img) + ') no-repeat center center / 0PX'}"
      v-for="(item,index) in curItemArr"
      :key="index"
      :to="item.urlLink"
      :data-href="item.location_url"
      :position-id="positionId + prefixInteger(index+1,3)"
      position-content="{}"
      :data-id="moduleNumber"
      data-type="pictureblock"
      v-patpat-exposure="appendExposureData"
    ></patRouterLink>
  </div>
</template>

<script>
// import { getStrId, langUrl, isOutLink, cdnUrl } from "../../config/toolFilter"

import { cdnUrl, getQueryString } from '@/utils/base.js'
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
      clientWidth: 375,
      positionId: '',
      moduleNumber: ''
    }
  },
  computed: {
    imgHeight () {
      const itemsTmp = this.content.items || []
      const equipmentWidth = (this.clientWidth - 12 - itemsTmp.length * 8) / itemsTmp.length / itemsTmp[0].img_width
      return equipmentWidth * itemsTmp[0].img_height
    },
    curItemArr () {
      const fromApp = getQueryString('platform', this.$route.fullPath) === 'app'
      return (this.content.items || []).map(oItem => {
        const item = Object.assign({}, oItem)
        let urlLink = item.location_url
        if (fromApp) {
          const webUrl = `"patpat://?action=webpage&mode=push&url=${urlLink}"`
          urlLink = nativeFilter(urlLink, webUrl, this.hostEnv)
        }
        item.urlLink = urlLink
        return item
      })
    }
  },
  methods: {
    cdnUrl (url) {
      return cdnUrl(url, '80')
    },
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    getPositionId () {
      const ppidArr = (this.content.page_position_id || '').split('-')
      const layoutId = ppidArr[0]
      const scheduleId = ppidArr[1]
      const moduleNumber = ppidArr[2]
      const floor = this.content.floor
      this.positionId = `${this.positionName}${layoutId}_${scheduleId}_pictureblock_${floor}-${moduleNumber}_`
      this.moduleNumber = moduleNumber
    },
    twoColumnPpTrackData (event, url) {
      if (!url) return false
      const targetPosition = event.currentTarget.getAttribute('position-id')
      window.sessionStorage.setItem('last_click_position', targetPosition)
      const positionClickTime = Date.now()
      sessionStorage.setItem('pct:' + targetPosition, positionClickTime)
    }
  },
  beforeMount () {
    this.clientWidth = document.body.clientWidth
    this.getPositionId()
  },
  mounted () {

  }
}
</script>

<style scoped lang="less">
.module-picturebox-column {
  display: flex;
  .img-wrap {
    flex: 1;
    margin: 0 4px;
    background: @pp-light-bg-color;
    height: 100%;
    border-radius: 8px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-wrap:last-of-type {
    margin-right: 0;
  }
  .img-wrap:first-of-type {
    margin-left: 0;
  }
  img[lazy="loading"] {
    //正在加载时显示的图片
    width: 100%;
    height: 100%;
    margin: auto;
    background: @pp-bg-img;
    // background-repeat: no-repeat;
    // background-size: contain;
    // background-position: center;
  }
}
</style>
