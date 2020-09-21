<template>
  <div class="custom-nav" v-if="navData.length>0" ref="CURDOM">
    <div class="js_nav_inner" :class="navStyle?'nav_inner_v2':'nav_inner'" ref="NAVDIVDOM">
      <ul ref="NAVUL">
        <li
          class="nav_item"
          :key="index"
          :class="index===currentActiveId?'nav_active':''"
          v-for="(item,index) in navData"
        >
          <!-- 跳楼层 -->
          <a
            tabindex="0"
            class="nav_link"
            :position-id="item.positionId"
            :nav-style="navStyle"
            @click.stop="ActiveLink(item.location_to,index,item.title,item.type)"
            :class="index==0?'active':''"
            :data-id="item.location_to"
            href="javascript:void(0)"
            :style="{color:index===currentActiveId?content.font_color:''}"
          >
            <i :style="{borderColor:content.font_color}" v-patpat-exposure="appendExposureData" track="unTrack" data-type="navigation" :position-id="item.positionId" :position-content="positionContent" :data-id="moduleNumber">{{item.title}}</i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

// 功能： 自动定位到当前位置对应的tab， 点击tab能跳到对应的楼层或者外部链接

import { getQueryString } from '@/utils/base.js'
import { getScroller } from '@/utils/dom.js'

import trackChildren from '@/mixins/trackChildren.js'

export default {
  mixins: [trackChildren],
  props: {
    content: {
      type: Object,
      default () {
        return {
          location: [],
          page_position_id: '',
          floor: '',
          mid: 0,
          bg_color: '',
          hover_bg_color: '',
          font_color: ''
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
      // 当前选中的tab
      currentActiveId: -1,
      navStyle: this.content.wap_nav_style ? this.content.wap_nav_style : 0,
      heightArr: [],
      // diff: this.$props.fromApp ? 50 : 90,
      hasClick: false,
      hasLoad: false,
      currentNavInfo: [],
      moduleNumber: '',
      positionContent: {},
      positionId: ''
    }
  },
  computed: {
    navData () {
      return (this.content.location || []).map((oItem, index) => {
        const item = Object.assign({}, oItem)
        item.positionId = this.positionId + this.prefixInteger(index + 1, 3)
        return item
      })
    }
  },
  beforeMount () {
    const posArr = (this.content.page_position_id || '').split('-')
    const layoutId = posArr[0] // 版位id
    const scheduleId = posArr[1] // 排期id
    this.moduleNumber = posArr[2] // 模块编号
    const floor = this.content.floor
    this.positionId = `${this.positionName}${layoutId}_${scheduleId}_navigation_${floor}-${this.moduleNumber}_`
  },
  mounted () {
    if (!this.navData.length) {
      return
    }
    this.curScrollDOM = getScroller(this.$refs.CURDOM)
    this.listenScroll()
  },
  methods: {
    prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    },
    changeActivePosition () {
      const activeDom = document.getElementsByClassName('nav_item')[this.currentActiveId]
      const pLeft = activeDom.offsetLeft
      this.$refs.NAVUL.scrollLeft = pLeft
    },
    // todo 没有做滚动动画， 所以也就没有处理高度在滚动过程中变化的问题 如： img带来的高度变化
    listenScroll () {
      const allFloor = this.navData.reduce((arr, item) => {
        if (!item.location_to) {
          return arr
        }
        const matchTmp = item.location_to.match(/#(\d*)/)
        if (matchTmp[1]) {
          arr.push(matchTmp[1])
        }
        return arr
      }, [])
      // 不存在需要跳楼层
      if (!allFloor.length) {
        return
      }
      const topDiffTmp = getQueryString('platform') !== 'app' ? '40px' : 0
      const startTime = new Date().getTime()
      const scrollDom = (this.curScrollDOM === window ? document.documentElement : this.curScrollDOM)
      this.curScrollDOM.addEventListener('scroll', () => {
        const curTime = new Date().getTime()
        if (curTime - startTime < 20) {
          return
        }
        // 实现吸顶
        const originTop = this.$refs.CURDOM.offsetTop
        const scrollTop = scrollDom.scrollTop
        if (scrollTop > originTop) {
          document.querySelector('.js_nav_inner').style.cssText = `position: fixed; top: ${topDiffTmp}; left: 0; z-index: 999`
        } else {
          document.querySelector('.js_nav_inner').style.cssText = ''
        }
        // 处理非点击带来的滚动效果,判断滚动到的位置
        if (!this.hasClick) {
          for (let i = 0; i < allFloor.length; i++) {
            const curId = allFloor[i]
            const elem = document.getElementById(curId)
            if (elem) {
              const _offsetHeight = elem.offsetHeight ? elem.offsetHeight : 0
              if (_offsetHeight + elem.offsetTop < scrollTop) {
                this.currentActiveId = i
              }
            }
          }
        }
      })
    },
    ActiveLink (dataId, index, navTitle, type) {
      // 对于链接的模式
      if (type !== 'floor') {
        window.location.href = dataId
        return
      }
      this.appendClickTrackData(
        this.positionId + navTitle + '_' + this.prefixInteger(index + 1, 3)
      )
      const id = dataId.replace(/[^\d]/g, '')
      const anchorElement = document.getElementById(id)
      this.currentActiveId = index
      this.hasClick = true
      const topDiffTmp = getQueryString('platform') !== 'app' ? 90 : 40
      if (anchorElement) {
        const totalHeight = anchorElement.offsetTop - topDiffTmp // 定位锚点
        const scrollDom = (this.curScrollDOM === window ? document.documentElement : this.curScrollDOM)
        scrollDom.scrollTop = totalHeight
        this.changeActivePosition()
        setTimeout(() => {
          // 关闭hasClick
          this.hasClick = false
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.custom-nav {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(242, 242, 242);
  .nav_inner {
    width: 100%;
    height: 50px;
    overflow: hidden;
    background-color: #fff;
    ul {
      position: relative;
      overflow-x: auto;
      padding-bottom: 10px;
      -webkit-overflow-scrolling: touch;
      display: flex;
    }
    .nav_item {
      /*width: 82px;*/
      display: inline-block;
      text-align: center;
      position: relative;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      flex: 1;
    }
    .nav_link {
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 100%;
      display: flex;
      vertical-align: center;
      align-items: center;
      justify-content: center;
      span {
        display: block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .nav_active {
    i {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      border-bottom: 3px solid #f1435a;
    }
  }
  .nav_inner_v2 {
    //后台配置nav的时候展示
    width: 100%;
    height: 50px;
    background-color: #fff;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 5px;
    .nav_item {
      display: inline-block;
      text-align: center;
      position: relative;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      padding: 0 5px;
    }
    .nav_link {
      span {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 5px 30px;
        border-radius: 15px;
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
</style>
