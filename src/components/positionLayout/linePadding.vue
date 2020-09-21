<template>
    <div :style="curStyle"></div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object
    }
  },
  computed: {
    curStyle () {
      const ctxTmp = (this.content.items || [])[0] || {}
      return {
        backgroundColor: ctxTmp.bgColor || 'white',
        height: `${ctxTmp.height}px`,
        opacity: ctxTmp.bgColor === 'white' ? 0 : ''
      }
    }
  }
}
</script>
