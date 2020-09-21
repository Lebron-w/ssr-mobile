<template>
  <div class="category-wrap" v-if="!pageLoading">
    <filter-tool ref="filterTool" :filters="filters" :selectCategory="userSelectCategory" :selectFilters="userSelectFilter"
      :selectSort="userSelectSort" :priceRange="userPriceRange" :categoryTree="categoryTree"
      @chooseFilter="chooseFilter" @setCategoryTree="setCategoryTree" @setPriceRange="setPriceRange" @clearFilter="clearFilter" @apply="apply"/>

    <section v-if="showSearchDefault" class="category-name">
      <h2 class="oneLine">No results for {{keyword}}</h2>
      <span>Try checking your spelling or use more general terms </span>
    </section>
    <section v-else class="category-name">
      <h1 class="oneLine">{{keyword}}</h1>
      <span>{{total}} {{$t('product.category.results')}}</span>
    </section>

    <div class="tags-info" v-show="selectedFilters.length > 0 || (defaultPriceRange[0] || defaultPriceRange[1])">
      <ul>
        <li v-for="(filterTag, index) in selectedFilters" :key="index">
          {{filterTag.value}}
          <span @click="removeFilterTag(filterTag)"></span>
        </li>
        <li v-if="defaultPriceRange[0] || defaultPriceRange[1]">
          {{ $uts(defaultPriceRange[0]) }} - {{ $uts($stu(defaultPriceRange[1])) }}
          <span @click="removePriceTag"></span>
        </li>
      </ul>
    </div>

    <section class="product-list-wrap">
      <product-list v-if="products.length > 0" ref="productList" :productList="products" :isLoading="isLoading"
        :positionName="`category-${defaultCategory.categoryId}`" :loadFinished="!hasMore" @loadMore="loadMore"/>
      <div class="no-data" v-else>
        <img src="~@/assets/images/product/empty_search.png" alt="empty search">
        <span class="no-match-result">{{$t('product.category.no_results')}}</span>
      </div>
    </section>
  </div>
  <div class="loading-wrap" v-else>
    <loading type="chase" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import searchStoreModule from '@/store/modules/search'
import productList from '@/components/product/productList.vue'
import filterTool from '@/components/filter/index.vue'
import trackMerge from '@/mixins/trackMerge'
import adTrackSearchPage from '@/assets/js/gtmEvent/viewSearch'
import { seoPatPatTdk } from '@/assets/js/common'

export default {
  name: 'search',
  mixins: [trackMerge],
  serverPrefetch () {
    /**
     * SEO { rootName __跟分类; childName __子分类 }
     * */
    const name = this.keyword
    const siteAbb = this.$ssrContext.siteInfo.siteAbb
    this.$ssrContext.title = this.$t('product.search.search_category_mate_title', { name: name, tdk: seoPatPatTdk(siteAbb) })
    this.$ssrContext.keywords = this.$t('product.search.search_category_mate_keywords', { name: name })
    this.$ssrContext.description = this.$t('product.search.search_category_mate_description', { name: name, tdk: seoPatPatTdk(siteAbb) })
  },
  components: {
    productList, filterTool
  },
  data () {
    return {
      keyword: '',
      products: [],
      adverts: [],
      total: 0,
      filters: [],
      pathCategories: [],
      categoryTree: {},
      defaultPriceRange: [],
      userPriceRange: [],
      defaultFilter: [],
      userSelectFilter: [],
      defaultCategory: {
        categoryId: '',
        categorySonId: ''
      },
      defaultCategoryFilter: {},
      userSelectCategory: {
        categoryId: '',
        categorySonId: ''
      },
      defaultSort: '',
      userSelectSort: '',
      hasMore: false,
      isLoading: false,
      page: 1,
      leavePage: false,
      clientUpdate: false,
      pageLoading: false
    }
  },
  computed: {
    ...mapState([
      'loginStatus',
      'collectFavProduct'
    ]),
    showSearchDefault () {
      return false
    },
    allFilters () {
      const allFilters = []
      this.filters.map(filter => {
        if (filter.key !== 'Category' && filter.key !== 'Sort' && filter.key !== 'Price') allFilters.push(...filter.values)
      })
      return allFilters
    },
    selectedFilters () {
      let selectedFilters = []
      selectedFilters = this.allFilters.filter(filter => {
        return this.defaultFilter.includes(filter.id)
      })
      return selectedFilters
    }
  },
  methods: {
    ...mapActions('search', {
      getData: 'getPageData',
      getMoreCategory: 'getMoreCategory'
    }),
    ...mapMutations({
      setFavProduct: 'SET_FAV_PRODUCT'
    }),
    setClientData () {
      const searchStore = this.$store.state.search
      this.keyword = this.$store.state.route.query.keyword
      this.products = JSON.parse(JSON.stringify(searchStore.productList))
      this.adverts = searchStore.adverts
      this.total = searchStore.total
      this.pathCategories = searchStore.pathCategories
      this.defaultFilter = searchStore.defaultFilter.length > 0 ? searchStore.defaultFilter.map(id => id - 0) : []
      this.defaultPriceRange = searchStore.priceRange
      this.defaultSort = searchStore.sortFilter.default
      this.defaultCategory = {
        categoryId: searchStore.categoryId,
        categorySonId: searchStore.categorySonId
      }
      this.hasMore = searchStore.hasMore
      this.setUserSeletFilter()
      const categoryFilter = {
        type: 'Category',
        key: 'Category',
        name: 'Category',
        categorySonId: searchStore.categorySonId,
        children: []
      }
      this.defaultCategoryFilter = categoryFilter
      const priceFilter = {
        type: 'Price',
        key: 'Price',
        name: 'Price',
        priceRange: searchStore.priceRange
      }
      if (searchStore.categoryList) {
        categoryFilter.children = Object.assign(searchStore.categoryList)
      }
      this.filters = [...searchStore.filters, searchStore.sortFilter, priceFilter, categoryFilter]
      this.getPathCategory(categoryFilter)

      if (!this.$isServer) {
        // GTM Data start
        const before5SkuId = searchStore.top5SkuIds
        adTrackSearchPage({
          keyword: this.keyword,
          before5SkuId: before5SkuId.join(',')
        })
        // GTM Data end
        this.$nextTick(() => {
          this.$refs.filterTool.addScrollEventListener()
        })
      }
    },
    setUserSeletFilter () {
      this.userSelectFilter = JSON.parse(JSON.stringify(this.defaultFilter))
      this.userSelectSort = this.defaultSort - 0
      this.userPriceRange = JSON.parse(JSON.stringify(this.defaultPriceRange))
      this.userSelectCategory = JSON.parse(JSON.stringify(this.defaultCategory))
    },
    loadMore () {
      if (!this.hasMore) return
      this.isLoading = true
      this.page += 1
      const params = {
        page: this.page
      }
      this.getMoreCategory(params).then(() => {
        this.products = this.products.concat(this.$store.state.search.productList)
        this.isLoading = false
      })
    },
    chooseFilter (type, filter) {
      const _idx = this.userSelectFilter.findIndex(item => {
        return item === filter.id
      })
      // 有则删除，无则添加到已经选择属性数组中
      const _selectedFilters = [...this.userSelectFilter]
      if (_idx > -1) {
        _selectedFilters.splice(_idx, 1)
      } else {
        _selectedFilters.push(filter.id)
      }
      this.userSelectFilter = [..._selectedFilters]
    },
    setCategoryTree (categoryTree) {
      this.categoryTree = categoryTree
    },
    setPriceRange (priceRange) {
      const priceIdx = this.filters.findIndex(filter => {
        return filter.key === 'Price'
      })
      this.filters[priceIdx].priceRange = priceRange
    },
    apply (filter) {
      if (filter && filter.type === 'Category') {
        const _allCategoryCoditions = this.defaultCategoryFilter.children
        let _categoryTreeArr = this.getResult(_allCategoryCoditions, filter.id).reverse()
        const _categoryTree = {}
        const _categoryChildren = _allCategoryCoditions
        let _haveChildren = []
        _categoryTreeArr.forEach((category, index) => {
          _categoryTree[category.level] = category
          if (index === (_categoryTreeArr.length - 2) || _categoryTreeArr.length < 2) {
            _categoryTreeArr = _categoryTreeArr.length < 2 ? _categoryTreeArr : category.children
            _haveChildren = _categoryChildren.filter(sonCategory => {
              return sonCategory.children.length > 0
            })
          }
          if (index === (_categoryTreeArr.length - 1)) {
            if (_categoryTreeArr[index].children.length > 0 || _haveChildren.length > 0) {
              _categoryTree[(category.level - 0) + 1] = category
            }
          }
        })
        this.categoryTree = _categoryTree
      }

      const routeQuery = this.$route.query
      const query = {}

      let _keys = Object.keys(this.categoryTree)
      _keys = _keys.sort((x, y) => {
        if (x < y) {
          return -1
        } else if (x > y) {
          return 1
        } else {
          return 0
        }
      })

      if (this.categoryTree && _keys.length > 0) {
        query.category_son_id = this.categoryTree[_keys[_keys.length - 1]].id
      }

      query.keyword = this.keyword

      if (routeQuery.platform) {
        query.platform = routeQuery.platform
      }

      if (this.version) {
        query.v = this.version
      }

      if (routeQuery.isReview) {
        query.is_review = routeQuery.isReview
      }

      if (this.userSelectSort) {
        query.sort = this.userSelectSort
      }

      if ((filter && filter.type === 'Sort')) {
        query.sort = filter.key || this.userSelectSort
      }

      if (this.userSelectFilter.length > 0) {
        query.filter = JSON.stringify(this.userSelectFilter)
      }
      const priceIdx = this.filters.findIndex(item => {
        return item.key === 'Price'
      })
      const priceRange = this.filters[priceIdx].priceRange

      if (priceRange[1] > 0 && priceRange[1] < 100) {
        query.end_price = priceRange[1]
      }

      if (priceRange[0] > 0) {
        query.start_price = priceRange[0]
      }
      const langStr = this.$store.state.langCode === 'en' ? '' : `/${this.$store.state.langCode}`
      const _CategoryTree = `${langStr}/search`
      this.$router.push({
        path: _CategoryTree,
        query
      })
    },
    // 删除Filter的tag
    removeFilterTag (filter) {
      const _currentFilters = this.userSelectFilter
      const _filters = _currentFilters.filter(_filter => {
        return _filter !== filter.id
      })
      this.userSelectFilter = _filters
      this.apply()
    },
    // 删除价格的tag
    removePriceTag () {
      const priceIdx = this.filters.findIndex(filter => {
        return filter.key === 'Price'
      })
      this.filters[priceIdx].priceRange = ['', '']
      this.apply()
    },
    clearFilter (filters) {
      if (filters) {
        const _filters = new Set(this.userSelectFilter)
        filters = new Set(filters)
        const _newFilters = Array.from(new Set([..._filters].filter(x => !filters.has(x))))
        this.userSelectFilter = _newFilters
      } else {
        const query = this.$route.query
        this.$refs.filterTool.closeTool()
        if (this.$refs.filterTool.filterActive && Object.keys(query).length < 2) {
          const idx = this.filters.findIndex(filter => {
            return filter.name === 'Price'
          })
          this.filters[idx].priceRange = ['', '']
          this.setUserSeletFilter()
        } else {
          const path = this.$route.path
          this.$router.push({
            path: path,
            params: {
              lang: this.$store.state.langCode
            },
            query: {
              keyword: this.keyword
            }
          })
        }
      }
    },
    getPathCategory (categoryFilter) {
      const _sonCategoryId = this.userSelectCategory.categorySonId
      const _allCategoryCoditions = categoryFilter.children
      let _categoryTreeArr = this.getResult(_allCategoryCoditions, _sonCategoryId).reverse()
      const _categoryTree = {}
      const _categoryChildren = _allCategoryCoditions
      let _haveChildren = []
      _categoryTreeArr.forEach((category, index) => {
        _categoryTree[category.level] = category
        if (index === (_categoryTreeArr.length - 2) || _categoryTreeArr.length < 2) {
          _categoryTreeArr = _categoryTreeArr.length < 2 ? _categoryTreeArr : category.children
          _haveChildren = _categoryChildren.filter(sonCategory => {
            return sonCategory.children.length > 0
          })
        }
        if (index === (_categoryTreeArr.length - 1)) {
          if (_categoryTreeArr[index].children.length > 0 || _haveChildren.length > 0) {
            _categoryTree[(category.level - 0) + 1] = category
          }
        }
      })
      this.categoryTree = _categoryTree
    },
    getResult (arr1, id) {
      var temp = []
      var forFn = function (arr, sId) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (item.id === sId) {
            temp.push(item)
            forFn(arr1, item.pid)
            break
          } else {
            if (item.children) {
              forFn(item.children, sId)
            }
          }
        }
      }
      forFn(arr1, id)
      return temp
    }
  },
  created () {
    if (!this.$isServer) {
      const alreadyIncremented = !!this.$store.state.search
      if (!this.$store.hasModule('search')) {
        this.$store.registerModule('search', searchStoreModule, { preserveState: alreadyIncremented })
      }
      if (!alreadyIncremented || (this.$route.fullPath !== this.$store.state.route.from.fullPath && this.$store.state.route.from.fullPath !== '/')) {
        this.pageLoading = true
        this.getData().then(() => {
          this.pageLoading = false
          this.setClientData()
        })
        this.clientUpdate = false
      } else {
        this.setClientData()
        this.clientUpdate = true
      }
    } else {
      this.setClientData()
    }
  },
  mounted () {
    // 登录情况下，重新在请求接口更新 收藏 状态
    if (this.loginStatus && this.clientUpdate) {
      this.getData().then(() => {
        this.setClientData()
      })
    }
  },
  activated () {
    if (this.leavePage) {
      this.setUserSeletFilter()
      this.getPathCategory(this.defaultCategoryFilter)
      this.$refs.filterTool.addScrollEventListener()
      if (this.loginStatus && this.$store.state.route.from.name === 'login-register' && this.collectFavProduct) {
        this.$refs.productList.collectFavProduct(this.collectFavProduct, this.collectFavProduct.idx)
      } else {
        this.setFavProduct(null)
      }
    }
  },
  deactivated () {
    this.leavePage = true
    if (this.$refs.filterTool) {
      this.$refs.filterTool.closeTool()
      setTimeout(() => {
        this.$refs.filterTool.removeScrollEventListener()
      }, 100)
    }
  },
  destroyed () {
    this.$store.unregisterModule('search')
  }
}
</script>
<style scoped lang="less">
.category-name {
  padding: 5px 0;
  background: #f9fbfc;
  text-align: center;
  span {
    font-size: 12px;
    color: #9ba5a7;
    padding-top: 5px;
  }
  .oneLine{
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 10px;
    font-size: 18px;
  }
}
.tags-info {
  width: 100%;
  padding: 0 5px;
  margin-bottom: 10px;
  // 自定义滚动条样式
  // 这是针对缺省样式 (必须的)
  ::-webkit-scrollbar {
    width: 0px;
    height: 2px;
  }

  // 滚动条的滑轨背景颜色
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }

  // 滑块颜色
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  // 滑轨两头的监听按钮颜色
  ::-webkit-scrollbar-button {
    background-color: #7c2929;
    height: 0;
    width: 0px;
  }

  // 横向滚动条和纵向滚动条相交处尖角的颜色
  ::-webkit-scrollbar-corner {
    background-color: #F9FBFC;
  }
  ul {
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
    li {
      position: relative;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0 20px 0 10px;
      background: #f1f3f2;
      margin: 10px 5px;
      border-radius: 5px;
      span{
        position: absolute;
        right: 0;
        top: 7px;
        display: block;
        width: 15px;
        height: 15px;
        &::before {
          content: "";
          position: absolute;
          top: 7px;
          left: 0;
          width: 12px;
          height: 1px;
          background: #444;
          transform: rotate(45deg);
        }
        &::after {
          content: "";
          position: absolute;
          top: 7px;
          left: 0;
          width: 12px;
          height: 1px;
          background: #444;
          transform: rotate(-45deg);
        }
      }
    }
  }
}
.loading-wrap {
  height: calc(100vh - 90px);
  box-sizing: border-box;
  padding-top: 190px;
}
.category-wrap {
  .category-info {
    padding: 10px 0 5px;
    background: #fff;
    text-align: center;
    .category-name {
      font-size: 16px;
      text-align: center;
    }
    span {
      font-size: 12px;
      color: #9ba5a7;
      padding-top: 5px;
    }
  }
  .no-data{
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-match-result{
      font-size: 18px;
      color: #b1b1b1;
      font-weight: 500;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
