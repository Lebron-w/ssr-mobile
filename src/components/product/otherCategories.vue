<!--
 * @Description: 列表页顶部其他分类组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-29 15:10:31
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-03 17:56:29
 * @FilePath: /website-ssr-mobile/src/components/product/otherCategories.vue
-->

<template>
  <div>
    <ul class="other_category_ul" :class="[(adverts && adverts.length <= 4) ? 'other_category_ul_align_center':'']" >
      <template v-for="item in adverts">
        <router-link :to="{path: item.link, params:{lang: $store.state.langCode}}" @click="jumpCategoryPage(item)" :key="item.id">
          <img tabindex="0" :aria-label="item.title" :alt="item.title" />
          <p class="other_category_title">{{item.title}}</p>
        </router-link>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'OtherCategories',
  props: {
    adverts: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>

</style>
