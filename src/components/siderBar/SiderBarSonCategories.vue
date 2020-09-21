<template>
  <div class="son-category-list">
    <ul>
      <li @click="clickSonCategory">
        <pat-router-link :to="interimUrl">
          <span v-text="$t('common.all')"></span>
        </pat-router-link>
      </li>
      <SonCategory v-for="sonCategory in sonCategories" :key="`sbsc-${sonCategory.id}`"
        v-bind="{name: sonCategory.name,categories: sonCategory, categoryUrlName, urlName: sonCategory[categoryUrlKey], sort: sonCategory.sort, isNew: isNew }" />
    </ul>
  </div>
</template>

<script>
import { HIDE_SIDER_BAR } from '@/store/mutation-types'
import SonCategory from '@/components/siderBar/SiderBarSonCategory.vue'

export default {
  name: 'sider_bar_son_categories',
  props: {
    categoryUrlName: {
      type: String,
      required: true
    },
    sonCategories: {
      type: Array,
      default: () => {
        return []
      }
    },
    isNew: {
      type: [Number, Boolean],
      default: false
    }
  },
  computed: {
    categoryUrlKey () {
      const key = this.isNew ? 'category_path' : 'url_name'
      return key
    },
    // TODO: 临时url, 如换成ssr项目目录改回原来逻辑
    interimUrl () {
      const url = `/category/${this.categoryUrlName}.html`
      return url
    }
  },
  components: { SonCategory },
  methods: {
    clickSonCategory () {
      this.$store.commit(HIDE_SIDER_BAR)
    }
  }
}
</script>

<style lang="less" scoped>
.son-category-list {
  height: 100%;
  overflow-y: auto;
  padding: 10px 0 0 10px;
  li {
    background-color: #fff;
    align-items: center;
    position: relative;
    a {
      display: block;
      height: 100%;
      width: 100%;
      text-align: left;
      line-height: 42px;
      border-bottom: 1px solid rgba(241,243,242,.5);
      padding-left: 2px;
      span {
        font-size: 12px;
      }
    }
  }
}
#country-ar {
  .son-category-list {
    padding: 10px 10px 0 0;
    li {
      a {
        padding-left: 0;
        padding-right: 2px;
      }
    }
  }
}
</style>
