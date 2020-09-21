<!--
 * @Description: 筛选分类子组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-30 15:21:53
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-19 19:19:33
 * @FilePath: /website-ssr-mobile/src/components/filter/categoryFilter.vue
-->

<template>
  <div class="category-filter-content">
    <ul>
      <template v-for="category in filters.children">
        <li :class="{'selected': category.id === filters.categorySonId}" :key="category.id" @click="apply(category)">
          <img v-lazy="category.icon" :alt="category.name" />
          <p>{{category.name}}</p>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    filters: {
      type: Object,
      default: () => {}
    },
    selectfilter: Object,
    categoryTree: Object
  },
  methods: {
    apply (category) {
      category.type = 'Category'
      this.$emit('apply', category)
    }
  }
}
</script>

<style lang="less" scoped>
.category-filter-content {
  max-height: 254px;
  overflow-y: scroll;
  background: #fff;
  ul {
    padding: 18px 15px 8px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 33.33%;
      margin-bottom: 15px;
      img {
        display: block;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin: 0 auto;
      }
      // 正在加载时显示的图片
      img[lazy=loading] {
        margin: auto;
        background: url('~@/assets/images/base/bg-logo.png') no-repeat center center;
        background-size: 100%;
      }
      // 错误时显示的图片
      img[lazy=error] {
        margin: auto;
        background: url('~@/assets/images/base/bg-logo.png') no-repeat center center;
        background-size: 100%;
      }
      p {
        text-align: center;
        font-size: 12px;
        color: #454545;
        margin-top: 5px;
      }
      &.selected {
        p {
          color: #F2425B;
        }
        img {
          border: 2px solid #F2425B;
          padding: 1px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
