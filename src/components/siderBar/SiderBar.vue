<template>
  <pui-popup :model.sync="showSiderBar" :position="langCode === 'ar' ? 'right' : 'left'" width='85%'>
    <div class="sidebar">
      <div class="sidebar-head">
        <router-link to='/' @mousedown.native='hideSiderBar()'>
          <pui-icon name='shops'></pui-icon>
          <span v-text="$t('common.home.title')"></span>
        </router-link>
      </div>

      <div class="sidebar-body">
        <div class="sidebar-body-menu">
          <ul class="sidebar-category-list">
            <li v-for="(category, index) in navCategories" :key="`sidebar-category-${category.id}`" @click="clickCategory(category, index)"
            :class="{active: index === currentTabIndex}">
              <PatImg :src="category[imgKey]" :alt="category.name" />
              <span :class="{'red': (category[displayKeyName] + '').indexOf('1') != -1}" :displayType="category[displayKeyName]" v-text="category.name"></span>
            </li>
          </ul>
          <ul class="sidebar-common-list">
            <li @click="clickSetting" :class="{active: settingActive}">
              <span v-text="$t('common.settings')"></span>
            </li>
            <li>
              <pat-router-link :to="orderStatusUrl">
                <span v-text="$t('common.order_status')"></span>
              </pat-router-link>
            </li>
            <li>
              <pat-router-link to="/article/help">
                <span v-text="$t('common.faq')"></span>
              </pat-router-link>
            </li>
            <li>
              <pat-router-link to="/article/help/contact">
                <span v-text="$t('common.contact')"></span>
              </pat-router-link>
            </li>
          </ul>
        </div>
        <div class="sidebar-body-content">
          <keep-alive>
            <component :is="currentTabComponent" v-bind="sonCategoriesProp" :key="bodyContentKey" v-if="bodyContentKey"></component>
          </keep-alive>
        </div>
      </div>
    </div>
  </pui-popup>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { HIDE_SIDER_BAR } from '@/store/mutation-types.js'
import PatImg from '@/components/base/PatImg.vue'
import SiderBarSonCategories from './SiderBarSonCategories.vue'
import SiderBarSetting from './SiderBarSetting.vue'

const CURRENT_TAB_SON_CATEGORIES = 'SiderBarSonCategories'
const CURRENT_TAB_SETTING = 'SiderBarSetting'
const SETTING_INDEX = 99

export default {
  name: 'sider_bar',
  data () {
    return {
      currentTabComponent: CURRENT_TAB_SON_CATEGORIES,
      currentTabIndex: 0
    }
  },
  components: { PatImg, SiderBarSonCategories, SiderBarSetting },
  computed: {
    ...mapState({
      langCode: 'langCode'
    }),
    showSiderBar: {
      get () {
        return this.$store.state.showSiderBar
      },
      set (value) {
        if (!value) {
          this.hideSiderBar()
        }
      }
    },
    isNew () {
      return this.$store.state.navCategories.is_v1
    },
    navCategories () {
      const navCategories = this.isNew ? this.$store.state.navCategories.nodes : this.$store.state.navCategories.content.categories
      return navCategories
    },
    imgKey () {
      const key = this.isNew ? 'icon' : 'category_image'
      return key
    },
    displayKeyName () {
      let key = 'display_type'
      if (this.isNew) key = 'display'
      return key
    },
    selectedCategory () {
      if (this.currentTabComponent === CURRENT_TAB_SON_CATEGORIES && this.navCategories.length > 0) {
        return this.navCategories[this.currentTabIndex]
      } else {
        return null
      }
    },
    sonCategoryKey () {
      const key = this.isNew ? 'son_nodes' : 'son_categories'
      return key
    },
    categoryUrlKey () {
      const key = this.isNew ? 'category_path' : 'url_name'
      return key
    },
    /**
     * 当前选中分类的子分类
     */
    sonCategories () {
      let sonCategories = []
      if (this.selectedCategory) {
        sonCategories = this.selectedCategory[this.sonCategoryKey]
      } else {
        if (this.currentTabIndex < this.navCategories.length) {
          const category = this.navCategories[this.currentTabIndex]
          if (category[this.sonCategoryKey]) {
            sonCategories = category[this.sonCategoryKey]
          }
        }
      }
      return sonCategories
    },
    /**
     * sidebar-body-content class标签里面组件key值
     */
    bodyContentKey () {
      let key = this.currentTabComponent
      if (this.currentTabComponent === CURRENT_TAB_SON_CATEGORIES) {
        if (this.selectedCategory) {
          key = `${this.currentTabComponent}-${this.selectedCategory.id}`
        } else {
          key = false
        }
      }
      return key
    },
    settingActive () {
      return this.currentTabIndex === SETTING_INDEX
    },
    /**
     * 子分类列表组件 Prop 数据
     */
    sonCategoriesProp () {
      if (this.currentTabComponent === CURRENT_TAB_SON_CATEGORIES) {
        return {
          sonCategories: this.sonCategories,
          categoryUrlName: this.selectedCategory[this.categoryUrlKey],
          isNew: this.isNew
        }
      } else {
        return null
      }
    },
    orderStatusUrl () {
      const isLogin = this.$store.state.loginStatus
      return isLogin ? '/account/orders' : '/guest/orderquery'
    }
  },
  methods: {
    ...mapMutations({
      hideSiderBar: HIDE_SIDER_BAR
    }),
    clickCategory (category, index) {
      this.currentTabComponent = CURRENT_TAB_SON_CATEGORIES
      this.currentTabIndex = index
    },
    clickSetting () {
      this.currentTabComponent = CURRENT_TAB_SETTING
      this.currentTabIndex = SETTING_INDEX
    }
  }
}
</script>

<style lang="less" scoped>
@sidebar-head-height: 50px;
@sidebar-menu-width: 116px;
.sidebar {
  .sidebar-head {
    background-color: #f8ebec;
    height: @sidebar-head-height;
    a {
      display: flex;
      align-items: center;
      height: 100%;
      i {
        text-align: center;
        color: @pp-font-select-color;
        font-size: 25px;
        width: @sidebar-menu-width;
      }
      span {
        color: @pp-font-select-color;
        margin-left: -30px;
      }
    }
  }
  .sidebar-body {
    height: calc(100vh - @sidebar-head-height);
    display: flex;
    .sidebar-body-menu {
      background-color: #fff;
      width: @sidebar-menu-width;
      overflow-y: auto;
      ul li {
        margin-top: 1px;
        background-color: rgba(241,243,242,.5);
        display: flex;
        align-items: center;
        position: relative;
        &:before {
          content: ' ';
          position: absolute;
          right: 0;
          top: 0;
          background-color: #fff;
          -webkit-transform-origin: top right;
          transform-origin: top;
          bottom: 0;
          width: 0;
          transition: .4s;
          z-index: 0;
        }
        &.active{
          &:before {
            width: 100%;
          }
        }
      }
    }
    .sidebar-body-content {
      background-color: #fff;
      flex: 1;
    }
  }
}

.sidebar-category-list li {
  min-height: 70px;
  flex-direction: column;
  img {
    margin-top: 5px;
    width: 38px;
    height: 38px;
    z-index: 1;
  }
  span {
    margin-top: 3px;
    font-size: 12px;
    z-index: 1;
    text-align: center;
    &.red {
      color: #ff2556;
    }
  }
}
.sidebar-common-list {
  margin-top: 6px;
  margin-bottom: 1px;
  li {
    height: 40px;
    text-align: center;
    a {
      width: 100%;
    }
    span {
      width: 100%;
      font-size: 12px;
      z-index: 1;
      &.red {
        color: #ff2556;
      }
    }
  }
}
</style>
