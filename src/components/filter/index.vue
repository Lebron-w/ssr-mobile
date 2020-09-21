<!--
 * @Description: 筛选组件主入口
 * @Author: zhengyun.chen
 * @Date: 2020-07-30 10:45:15
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-15 11:02:32
 * @FilePath: /website-ssr-mobile/src/components/filter/index.vue
-->

<template>
  <div class="filter-tool-wrap" :class="{'header-animate': headerAnimate}">
    <!-- 筛选按钮组 -->
    <div class="filter-group">
      <!-- 分类筛选按钮 -->
      <button class="sort-tool-item" :class="{'disabled': !hasCategoryFilter, 'selected': currentKey === 'Category'}"
        :aria-selected="currentKey === 'Category'" @click="toolClick('Category')">
        <span class="tool-name">{{$t('product.category.category')}}</span>
        <svg width="8" height="4" xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow-down">
          <polyline points="0,0 4,4 8,0"/>
        </svg>
      </button>
      <!-- 尺寸筛选按钮 -->
      <button class="sort-tool-item" :class="{'disabled': !hasSizeFilter, 'selected': currentKey === 'Size', 'active': selectSize.length}"
        :aria-selected="currentKey === 'Size'" @click="toolClick('Size')">
        <span class="tool-name">{{$t('product.category.size')}}</span>
        <svg width="8" height="4" xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow-down">
          <polyline points="0,0 4,4 8,0"/>
        </svg>
      </button>
      <!-- 排序筛选按钮 -->
      <button class="sort-tool-item active" :class="{'selected': currentKey === 'Sort'}"
        :aria-selected="currentKey === 'Sort'" @click="toolClick('Sort')">
        <span class="tool-name">{{$t('product.category.sort')}}</span>
        <svg width="8" height="4" xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow-down">
          <polyline points="0,0 4,4 8,0"/>
        </svg>
      </button>
      <!-- 属性筛选按钮 -->
      <button class="sort-tool-item filter" :class="{'selected': currentKey === 'Side', 'active': filterActive}"
        :aria-selected="currentKey === 'Filter'" @click="toolClick('Side')">
        <span class="tool-name">{{$t('product.category.filter')}}</span>
        <pui-icon class="filter-icon" name="filter" />
      </button>
    </div>
    <!-- 动态组件，点击相关筛选项，展示相关筛选组件 -->
    <keep-alive>
      <component class="filter-content" :is="currentKey" v-if="currentKey"
        :filters="currentFilter" :selectFilter="userSelectFilter" :categoryTree="categoryTree"
        @chooseFilter="chooseFilter" @setCategoryTree="setCategoryTree" @setPriceRange="setPriceRange"
        @reset="reset" @apply="apply" @close="closeTool"/>
    </keep-alive>
    <div class="overlay" v-if="currentKey && currentKey !== 'Side'" @touchmove="layerTouceMove" @click="closeTool"></div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import sideFilter from './sideFilter'
import sizeFilter from './sizeFilter'
import categoryFilter from './categoryFilter'
import sortFilter from './sortFilter'
import { ModalHelper } from '@/utils/dom.js'
import trackChildren from '@/mixins/trackChildren.js'

export default {
  name: 'FilterTool',
  mixins: [trackChildren],
  components: {
    Category: categoryFilter,
    Size: sizeFilter,
    Sort: sortFilter,
    Side: sideFilter
  },
  data () {
    return {
      currentKey: ''
    }
  },
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    selectCategory: {
      type: Object,
      default: () => {}
    },
    selectFilters: {
      type: Array,
      default: () => []
    },
    selectSort: {
      type: [Number, String],
      default: ''
    },
    categoryTree: {
      type: Object,
      default: () => {}
    },
    priceRange: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      headerAnimate: 'headerAnimate'
    }),
    currentFilter () {
      let currentFilter = this[this.currentKey + 'Filters']
      if (this.currentKey === 'Side') {
        currentFilter = this.filters
      }
      return currentFilter
    },
    selectSide () {
      const userSelectFilter = {
        Gender: [],
        Color: [],
        Size: [],
        Style: [],
        Season: [],
        Occasion: [],
        GenderArr: [],
        ColorArr: [],
        SizeArr: [],
        StyleArr: [],
        SeasonArr: [],
        OccasionArr: [],
        GenderString: '',
        ColorString: '',
        SizeString: '',
        StyleString: '',
        SeasonString: '',
        OccasionString: '',
        Pricetring: ''
      }
      this.filters.forEach(condition => {
        if (condition.key !== 'Category' && condition.key !== 'Price' && condition.key !== 'Sort') {
          condition.values.forEach(item => {
            const _filterSelecet = this.selectFilters.includes(item.id)
            if (_filterSelecet) {
              userSelectFilter[condition.key].push(item.id)
              userSelectFilter[`${condition.key}Arr`].push(item.value)
            }
          })
          userSelectFilter[`${condition.key}String`] = userSelectFilter[`${condition.key}Arr`].length > 0 ? userSelectFilter[`${condition.key}Arr`].join(',') : ''
        }
        if (condition.key === 'Price') {
          const _symbolDisplay = this.$l10nCurrency.currency.symbolDisplay
          const priceRange = condition.priceRange
          const _minPrice = _symbolDisplay + Math.ceil(this.$l10nCurrency.currency.utsExchangeRate * priceRange[0])
          const _maxPrice = _symbolDisplay + Math.ceil(this.$l10nCurrency.currency.utsExchangeRate * priceRange[1])
          let _priceString = ''
          if ((priceRange[1] && priceRange[1] < 100) || (priceRange[0] && priceRange[0] > 0)) {
            _priceString = _minPrice + '-' + _maxPrice
          }
          userSelectFilter[`${condition.key}String`] = _priceString
        }
      })
      return userSelectFilter
    },
    userSelectFilter () {
      const userSelectFilter = this['select' + this.currentKey]
      return userSelectFilter
    },
    selectSize () {
      const selectSizeId = []
      if (this.SizeFilters && this.SizeFilters.values) {
        const selectSize = this.SizeFilters.values.filter(value => {
          return this.selectFilters.indexOf(value.id) !== -1
        })
        selectSize.forEach(size => {
          selectSizeId.push(size.id)
        })
      }
      return selectSizeId
    },
    CategoryFilters () {
      const categoryFilters = this.filters.filter(filter => {
        return filter.key === 'Category'
      })
      const { categorySonId, children } = { ...categoryFilters[0] }
      let allCategory = children
      if (categorySonId) {
        allCategory = this.getCategorys([{ children: allCategory }], categorySonId)
      }
      return {
        categorySonId,
        children: allCategory
      }
    },
    SizeFilters () {
      const sizeFilters = this.filters.filter(filter => {
        return filter.key === 'Size'
      })
      return sizeFilters[0]
    },
    SortFilters () {
      const sortFilters = this.filters.filter(filter => {
        return filter.key === 'Sort'
      })
      return sortFilters[0]
    },
    hasCategoryFilter () {
      return this.CategoryFilters && this.CategoryFilters.children && this.CategoryFilters.children.length > 0
    },
    hasSizeFilter () {
      return this.SizeFilters && this.SizeFilters.values && this.SizeFilters.values.length > 0
    },
    filterActive () {
      return ((Object.keys(this.categoryTree).length > 0) || (this.selectFilters.length > 0)) || this.selectSide.PriceString
    }
  },
  methods: {
    ...mapMutations({
      changeHeaderAnimate: 'CHANGE_HEADER_ANIMATE'
    }),
    addScrollEventListener () {
      window.addEventListener('scroll', this.handleScroll, true)
    },
    removeScrollEventListener () {
      this.changeHeaderAnimate(false)
      window.removeEventListener('scroll', this.handleScroll, true)
    },
    handleScroll () {
      // 页面滚动距顶部距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var scroll = scrollTop - this.scrollTop
      this.scrollTop = scrollTop
      if (scroll < 0) {
        if (this.headerAnimate) this.changeHeaderAnimate(false)
      } else {
        if (scrollTop > 90) {
          if (!this.headerAnimate) this.changeHeaderAnimate(true)
        }
      }
    },
    toolClick (type) {
      if (this.currentKey === type) {
        ModalHelper.beforeClose()
        this.currentKey = ''
      } else {
        this.currentKey = type
        ModalHelper.afterOpen()
        window.removeEventListener('scroll', this.handleScroll, true)
        if (type === 'Category') {
          this.appendClickTrackData(`Click_list_${type}`)
        } else {
          this.appendClickTrackData('category_' + type)
        }
      }
    },
    closeTool () {
      this.currentKey = ''
      ModalHelper.beforeClose()
      const scrollTime = setTimeout(() => {
        clearTimeout(scrollTime)
        window.addEventListener('scroll', this.handleScroll, true)
      }, 50)
    },
    // 获取当前类目下的 category， 没有则返回同级
    getCategorys (categorys, id, count = 1) {
      count++
      let resCategory = []
      const _allCategory = []
      categorys.forEach(category => {
        _allCategory.push(...category.children)
      })
      const _sonIdx = _allCategory.findIndex(sonCategory => {
        return sonCategory.id === id
      })
      if (_sonIdx > -1) {
        const _children = _allCategory[_sonIdx].children
        if (_children.length > 0) {
          resCategory = _children
        } else {
          resCategory = _allCategory.filter(category => {
            return category.pid === _allCategory[_sonIdx].pid
          })
        }
        return resCategory
      } else {
        if (count > 4) return []
        return this.getCategorys(_allCategory, id, count)
      }
    },
    chooseFilter (type, filter) {
      this.$emit('chooseFilter', type, filter)
    },
    // 设置当前选中 category 树
    setCategoryTree (categoryTree) {
      this.$emit('setCategoryTree', categoryTree)
    },
    setPriceRange (priceRange) {
      this.$emit('setPriceRange', priceRange)
    },
    reset (type) {
      if (type && type === 'Size') {
        this.$emit('clearFilter', this.selectSize)
      } else {
        this.$emit('clearFilter')
      }
    },
    apply (category) {
      this.closeTool()
      this.$emit('apply', category)
    },
    layerTouceMove (e) {
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.header-animate {
  transform: translate3d(0, -200%, 91px);
}
.filter-tool-wrap {
  position: sticky;
  top: 45px;
  z-index: 99;
  transition: transform .4s ease-out,-webkit-transform .4s ease-out;
  .filter-group {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: space-between;
    z-index: 79;
    background: #fff;
    padding: 0 0 0 5px;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, .02);
    .sort-tool-item {
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      text-align: center;
      &.selected {
        .tool-name {
          color: #F2425B;
        }
        .arrow-down {
          stroke: #F2425B;
          transform: rotate(180deg);
        }
      }
      &.filter {
        padding: 0 15px;
        .filter-icon {
          font-size: 12px;
          margin-left: 5px;
        }
      }
      .tool-name {
        font-size: 14px;
        color: #454545;
        font-family: 'patpat-Medium';
      }
      .arrow-down {
        fill: #fff;
        stroke: #454545;
        margin-left: 6px;
        transition: all .2s;
        position: relative;
        top: -2px;
      }
      &.active {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #F0435B;
          border-radius: 50%;
          top: 12px;
          left: 1px;
        }
        &.filter {
          &::before {
            left: 6px;
          }
        }
      }
      &.disabled {
        .tool-name {
          color: #D8D9D8;
        }
        .arrow-down {
          stroke: #D8D9D8;
        }
      }
    }
  }
  .filter-content {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    z-index: 78;
  }
  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    height: 10000px;
    background: rgba(0,0,0,.6);
    z-index: 77;
  }
}
#country-ar {
  .filter-tool-wrap {
    .filter-group {
      .sort-tool-item {
        &.filter {
          .filter-icon {
            margin-left: 0;
            margin-right: 5px;
          }
          &::before {
            right: 5px;
            left: auto;
          }
        }
        &::before {
          right: 1px;
          left: auto;
        }
        .arrow-down {
          margin-right: 6px;
          margin-left: 0;
          float: none;
          margin-top: 0;
        }
        &.selected {
          .arrow-down {
            stroke: #F2425B;
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
