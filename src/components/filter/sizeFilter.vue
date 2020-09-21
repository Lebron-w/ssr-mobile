<!--
 * @Description: 筛选尺码子组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-30 15:21:23
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-04 20:04:18
 * @FilePath: /website-ssr-mobile/src/components/filter/sizeFilter.vue
-->

<template>
  <div class="size-filter-content">
    <ul class="size-list">
      <li v-for="size in filters.values" :key="size.id" :class="[selectFilter.includes(size.id) ? 'selected' : '']" @click="chooseFilter(size)">
        {{size.value}}
      </li>
    </ul>
    <div class="sort-button-group">
      <!-- 重置按钮 -->
      <button class="reset-sort" @click.stop="resetFilter" tabindex="0" role="button">{{$t('product.category.reset')}}</button>
      <!-- 确定按钮 -->
      <button class="apply-sort" @click.stop="apply" tabindex="0" role="button">{{$t('product.category.apply')}}</button>
    </div>
  </div>
</template>

<script>
import trackChildren from '@/mixins/trackChildren.js'

export default {
  name: 'SizeFilter',
  mixins: [trackChildren],
  props: {
    filters: {
      type: Object,
      default: () => {}
    },
    selectFilter: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    chooseFilter (filter) {
      this.$emit('chooseFilter', 'Size', filter)
    },
    resetFilter () {
      this.appendClickTrackData('Size_filter_reset')
      this.$emit('reset', 'Size')
    },
    apply () {
      this.appendClickTrackData('Size_filter_apply')
      this.$emit('apply')
    }
  }
}
</script>

<style lang="less" scoped>
.size-filter-content {
  background: #fff;
  .size-list {
    max-height: 194px;
    padding: 15px 25px 5px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 30%;
      height: 40px;
      margin-right: 5%;
      line-height: 40px;
      border-radius: 4px;
      background: #FAFBFA;
      margin-bottom: 12px;
      text-align: center;
      color: #444;
      font-size: 12px;
      font-family: 'patpat-Medium';
      &:nth-child(3n + 3) {
        margin-right: 0;
      }
      &.selected {
        color: #F2435B;
        background: #FFF0F2;
      }
    }
  }
  .sort-button-group {
    height: 60px;
    display: flex;
    padding: 10px 20px;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, .1);
    .reset-sort {
      flex: 1;
      align-items: center;
      line-height: 40px;
      height: 40px;
      background: #f1f3f2;
      color: #444;
      margin-right: 15px;
      border-radius: 5px;
      font-size: 16px;
    }
    .apply-sort {
      flex: 2;
      line-height: 40px;
      height: 40px;
      background: #ff2556;
      color: #fff;
      border-radius: 5px;
      font-size: 16px;
    }
  }
}
#country-ar {
  .size-filter-content {
    .size-list {
      li {
        margin-left: 5%;
        margin-right: 0;
        &:nth-child(3n + 3) {
          margin-left: 0;
        }
      }
    }
    .sort-button-group {
      .reset-sort {
        margin-right: 0;
        margin-left: 15px;
      }
    }
  }
}
</style>
