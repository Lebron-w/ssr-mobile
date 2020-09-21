<template>
  <li @click="clickSonCategory">
    <PatRouterLink :to="interimUrl">
      <span :class="{'red': (categories[displayKeyName] + '').indexOf('1') != -1}" :displayType="categories[displayKeyName]" v-text="name"></span>
      <svg class="arrow-down" v-if="sonCategories.length > 0" width="8" height="4" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="0,0 4,4 8,0"/>
      </svg>
    </PatRouterLink>
    <ul class="son-categorie" v-if="sonCategories.length > 0">
      <template v-for="category in sonCategories">
        <li :key="category.id">
          <pat-router-link :to="`/category/${category.category_path}.html` + (category.sort > 0 ? `?sort=${category.sort}` : '')">
            <pat-img :src="category.icon" :alt="category.name" lazyLoad lazymode="bg"/>
            <span :class="{'red': (category[displayKeyName] + '').indexOf('1') != -1}" :displayType="category[displayKeyName]">{{category.name}}</span>
          </pat-router-link>
        </li>
      </template>
    </ul>
  </li>
</template>

<script>
import { HIDE_SIDER_BAR } from '@/store/mutation-types.js'

export default {
  name: 'sider_bar_son_category',
  props: {
    name: {
      type: String,
      required: true
    },
    categoryUrlName: String,
    urlName: String,
    sort: Number,
    isNew: {
      type: [Number, Boolean],
      default: false
    },
    categories: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 临时url
    interimUrl () {
      const url = `/category/${this.categoryUrlName}/${this.urlName}.html?sort=${this.sort}&v=${this.isNew}`
      return url
    },
    routerTo () {
      const query = {}
      if (this.sort && this.isNew) query.sort = this.sort
      if (this.isNew) query.v = this.isNew
      let routerObj = {}
      if (this.isNew) {
        const langCode = this.$store.state.langCode
        const path = langCode ? `/${langCode}/category/${this.urlName}.html` : `/category/${this.urlName}.html`
        routerObj = {
          path,
          params: {
            lang: langCode
          },
          query
        }
      } else {
        routerObj = {
          name: 'category',
          params: {
            lang: this.$store.state.langCode,
            c1: this.categoryUrlName,
            c2: `${this.urlName}.html`
          },
          query
        }
      }
      return routerObj
    },
    displayKeyName () {
      let key = 'display_type'
      if (this.isNew) key = 'display'
      return key
    },
    sonCategories () {
      let sonCategories = []
      if (this.isNew && this.categories.son_nodes && this.categories.son_nodes.length > 0) {
        sonCategories = this.categories.son_nodes
      }
      return sonCategories
    }
  },
  methods: {
    clickSonCategory () {
      this.$store.commit(HIDE_SIDER_BAR)
    }
  }
}
</script>

<style lang="less" scoped>
li {
  background-color: #fff;
  align-items: center;
  position: relative;
  a {
    display: block;
    height: 100%;
    width: 100%;
    line-height: 42px;
    text-align: left;
    border-bottom: 1px solid rgba(241,243,242,.5);
    padding-left: 2px;
    span {
      font-size: 12px;
      &.red {
        color: #ff2556;
      }
    }
    .arrow-down {
      fill: #fff;
      stroke: #454545;
      margin-left: 6px;
      transition: all .2s;
      position: absolute;
      top: 20px;
      right: 15px;
      transform: rotate(-90deg);
    }
    .arrow-down {
      fill: #fff;
      stroke: #454545;
      margin-left: 6px;
      transition: all .2s;
      position: absolute;
      top: 20px;
      right: 15px;
      &.right {
        transform: rotate(-90deg);
      }
    }
  }
  .son-categorie {
    li {
      background-color: #fff;
      align-items: center;
      position: relative;
      height: 42px;
      a {
        img {
          display: inline-block;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
        span {
          &.red {
            color: #ff2556;
          }
        }
      }
    }
  }
}
#country-ar {
  li {
    a {
      padding-left: 0;
      padding-right: 2px;
      img {
        margin-right: 0;
        margin-left: 10px;
      }
      .arrow-down {
        right: auto;
        left: 15px;
        margin: 0;
        transform: rotate(90deg);
      }
    }
  }
}
</style>
