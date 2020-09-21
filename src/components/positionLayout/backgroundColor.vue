<script>
export default {
  props: {
    content: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  render (h) {
    // eslint-disable-next-line camelcase
    const { content, bg_color, font_color } = this.content
    return (
      <div class="module-bgcolor" style={{ backgroundColor: bg_color, color: font_color }}>
        {content}
      </div>
    )
  }
}
</script>

<style lang="less" scoped>
.module-bgcolor{
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  font-family: HKGrotesk-Bold;
}
</style>
