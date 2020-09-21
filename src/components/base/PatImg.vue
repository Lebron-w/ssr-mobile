<script>
import { cdnUrl } from '@/utils/base.js'

export default {
  name: 'PatImg',
  props: {
    src: {
      type: String,
      default: require('../../assets/images/base/bg-logo.png')
    },
    alt: {
      type: String,
      default: 'PatPat Image'
    },
    // 缩略图尺寸 指定尺寸 eg: ’64x64’ | '120x120' | '220x220' | '350x350' | '600x600' | '950x950' | '1024x1024'
    // 百分比缩放 eg: '20' | '40' | '60' | '80' | '100'
    thumbnailSize: {
      type: String,
      default: ''
    },
    lazyLoad: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    lazyLoad: {
    // 指令的定义
      inserted: function (el) {
        el.lazy()
      }
    }
  },
  computed: {
    cdnSrc () {
      const cdnSrc = cdnUrl(this.src, this.thumbnailSize)
      return cdnSrc
    },
    processAlt () {
      return `${this.alt}`
    },
    lazyLoadSrc () {
      return this.lazyLoad ? this.cdnSrc : false
    }
  },
  data () {
    return {
    }
  },
  methods: {

  },
  render () {
    const attrs = {
      src: this.cdnSrc,
      alt: this.processAlt
    }

    const directives = []
    if (this.lazyLoad) {
      directives.push({
        name: 'lazy',
        value: this.cdnSrc
      })
    }

    const css = {}
    if (this.lazyLoad) {
      css['lazy-load-bg'] = this.lazyLoad
    }
    return (
      <img {...{ attrs, directives, class: css } }/>
    )
  }
}
</script>

<style lang="less" scoped>
.lazy-load-bg {
  background: @pp-bg-img;
}
.lazy-load-bg[lazy="loaded"] {
  background: #fff;
}
</style>
