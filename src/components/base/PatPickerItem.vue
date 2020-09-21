<template>
  <li class="pat-picker-item" @click="clickPickerItem">
    <a tabindex="0">
      <PatImg v-if="icon" class="country-icon left" :src="icon" :alt="title"/>
      <span v-text="title"></span>
    </a>
  </li>
</template>

<script>
import PatImg from './PatImg'

export default {
  props: {
    icon: String,
    title: String
  },
  components: { PatImg },
  methods: {
    clickPickerItem (event) {
      this.$parent.showSeletct = false
      this.$emit('clickPickerItem', event)
    }
  }
}
</script>

<style lang="less" scoped>
.pat-picker-item {
  line-height: 32px;
  padding: 0 10px;
  .country-icon {
    display: block;
    width: 16px;
    height: 12px;
    margin-top: 8px;
    ~ span {
      padding: 0 10px;
    }
  }
}
</style>
