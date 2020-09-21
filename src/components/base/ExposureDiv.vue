<template>
  <div ref="CUREXPOSURE">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    once: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.initFn()
  },
  methods: {
    initFn () {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            this.once && observer.unobserve(entry.target)
            this.$emit('exposured')
          }
        })
      })
      observer.observe(this.$refs.CUREXPOSURE)
    }
  }
}
</script>
