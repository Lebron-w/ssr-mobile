<!--
 * @Description: Router Link 二次封装，外链支持。
 * 使用时和roouter link一致使用即可，to可以为对象或字符串，字符串时会判断是否外链，外链会使用新窗口打开，app时会转跳APP链接。
 * @Author: zhengyun.chen
 * @Date: 2020-07-27 17:17:27
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-03 11:27:17
 * @FilePath: /website-ssr-mobile/src/components/base/PatRouterLink.vue
-->

<script>
import { setSessionStorage } from '@/utils/storage'

export default {
  name: 'PatRouterLink',
  props: {
    to: {
      type: [Object, String],
      default () {
        return this.$route.fullPath
      }
    },
    tag: {
      type: String,
      default: 'a'
    }
  },
  computed: {
    vProps () {
      // https://cn.vuejs.org/v2/api/#vm-attrs
      // 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。
      // 当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。
      const props = { ...this.$props }
      if (typeof this.$props.to === 'string' && !this.isExternalLink) {
        if (this.$store.state.langCode !== 'en') {
          const lang = this.$store.state.langCode
          props.to = `/${lang}${props.to}`
        }
      } else if (typeof this.$props.to === 'object') {
        if (!props.to.params.lang) {
          props.to.params.lang = this.$store.state.langCode === 'en' ? null : this.$store.state.langCode
        } else if (props.to.params.lang === 'en') {
          props.to.params.lang = null
        }
      }
      return { ...props, ...this.$attrs }
    },
    isExternalLink () {
      let isBlank = false
      if (typeof this.to === 'string') {
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/
        isBlank = reg.test(this.to)
      }
      return isBlank
    },
    isLocal () {
      let isLocal = true
      if (this.isExternalLink) {
        isLocal = false
      }
      if (isLocal && this.$router.getMatchedComponents(this.to).length <= 0) {
        isLocal = false
      }
      return isLocal
    },
    target () {
      return this.isExternalLink ? '_blank' : ''
    }
  },
  methods: {
    savePosition (e) {
      const positionId = e.currentTarget.getAttribute('position-id')
      if (positionId) {
        const targetPosition = event.currentTarget.getAttribute('position-id')
        setSessionStorage('last_click_position', targetPosition)
        const positionClickTime = Date.now()
        setSessionStorage('pct:' + targetPosition, positionClickTime)
      }
    }
  },
  render (h) {
    if (this.isLocal) {
      const data = {
        props: {
          ...this.vProps
        }
      }
      return (
        <router-link {...data} nativeOnMousedown={(e) => { this.savePosition(e) }}>
          {this.$slots.default}
        </router-link>
      )
    } else {
      const onEvent = {
        on: {
          mousedown: (e) => {
            this.savePosition(e)
          }
        }
      }
      // todo 后面有不需要的标签，在根据传入来控制
      const attrs = {
        attrs: {
          href: this.vProps.to,
          target: this.target
        }
      }
      // 处理子组件访问上级的，详见上面vProps的说明
      const props = {
        props: {
          ...this.vProps
        }
      }
      const propsTmp = { ...onEvent, ...attrs, ...props }
      return h(this.tag, propsTmp, this.$slots.default)
    }
  }
}
</script>
