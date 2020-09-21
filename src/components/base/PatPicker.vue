<template>
  <div class="pat-picker">
    <label v-text="title">title</label>
    <div class="set-select">
      <div class="default" :class="{ 'select-show': open }" @click="clickPicker">
        <span v-text="defaultItem.title"></span>
        <svg width="12" height="6" class="arrow-down right">
          <polyline points="0,0 6,6 12,0" />
        </svg>
      </div>
      <div class="set-ul-box" v-show="open">
        <ul class="set-ul">
          <slot></slot>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    defaultItem: Object,
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // showSeletct: false
    }
  },
  computed: {
    // showSeletct () {
    //   return false
    // }
  },
  methods: {
    clickPicker () {
      // this.showSeletct = !this.showSeletct
      this.$emit('clickPicker')
    }
  }
}
</script>

<style lang="less" scoped>
.pat-picker {
  position: inherit;
  // background-color: #fff;
  font-size: 12px;
  padding: 0 10px;
  label {
    display: block;
    margin-bottom: 5px;
    margin-top: 15px;
  }
  .set-select {
    border: 1px solid #cdd2d3;
    .default {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background: #fff;
      .arrow-down {
        fill: #fff;
        stroke: #444;
        margin-top: 17px;
        transition: all .2s;
      }
    }
    .set-ul-box {
      border-top: 1px solid #f1f3f2;
      max-height: 180px;
      overflow-y: auto;
      background-color:#fff;
    }
    .select-show {
      .arrow-down {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
