<!--
 * @Description: 筛选排序子组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-30 15:21:02
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-04 20:04:34
 * @FilePath: /website-ssr-mobile/src/components/filter/sortFilter.vue
-->

<template>
  <div class="sort-filter-content">
    <ul>
      <li v-for="sort in filters.values" :key="sort.key" :class="{'selected': selectFilter == sort.key}" @click="applySort(sort)">{{sort.value}}</li>
    </ul>
  </div>
</template>

<script>
import trackChildren from '@/mixins/trackChildren.js'

export default {
  name: 'SortFilter',
  mixins: [trackChildren],
  props: {
    filters: {
      type: Object,
      default: () => {}
    },
    selectFilter: {
      type: [Number, String],
      default: ''
    }
  },
  methods: {
    applySort (sort) {
      sort.type = 'Sort'
      this.appendClickTrackData('sort_filter_apply_' + sort.key)
      this.$emit('apply', sort)
    }
  }
}
</script>

<style lang="less" scoped>
.sort-filter-content {
  background: #fff;
  padding: 10px 26px 0;
  li {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 12px;
    border-bottom: 1px solid #EFF3F1;
    &.selected {
      color: #f0435b;
    }
  }
}
</style>
