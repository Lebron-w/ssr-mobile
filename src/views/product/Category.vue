<template>
  <div class="category-wrap" v-if="!pageLoading">
    <filter-tool ref="filterTool" :filters="filters" :selectCategory="userSelectCategory" :selectFilters="userSelectFilter"
      :selectSort="userSelectSort" :priceRange="userPriceRange" :categoryTree="categoryTree"
      @chooseFilter="chooseFilter" @setCategoryTree="setCategoryTree" @setPriceRange="setPriceRange" @clearFilter="clearFilter" @apply="apply"/>
    <!-- 其它分类组件 -->
    <other-categories v-if="adverts && adverts.length > 0" :adverts="adverts" />
    <div class="category-info" v-else>
      <h2 class="category-name">{{filterTitle}}</h2>
      <span>{{total}}  {{$t('product.category.results')}}</span>
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
import { mapActions, mapState } from 'vuex'
import categoryStoreModule from '@/store/modules/category'
import productList from '@/components/product/productList.vue'
import otherCategories from '@/components/product/otherCategories.vue'
import filterTool from '@/components/filter/index.vue'
import { seoPatPatTdk } from '@/assets/js/common'
import adTrackCategoryShow from '@/assets/js/gtmEvent/viewCategory'
import trackMerge from '@/mixins/trackMerge'

export default {
  name: 'category',
  mixins: [trackMerge],
  serverPrefetch () {
    /**
     * SEO { rootName __跟分类; childName __子分类 }
     * api 返回的分类必须长度大于 1 才做seo
     * */
    const pathCategories = this.pathCategories
    if (pathCategories.length > 0) {
      const siteAbb = this.$ssrContext.siteInfo.siteAbb
      const rootName = pathCategories.length >= 2 ? `${pathCategories[pathCategories.length - 2].name} ` : ''
      const childName = pathCategories.length >= 1 ? `${pathCategories[pathCategories.length - 1].name} ` : ''
      this.$ssrContext.title = this.$t('product.category.category_mate_title', { rootName: rootName, childName: childName, tdk: seoPatPatTdk(siteAbb) })
      this.$ssrContext.keywords = this.$t('product.category.category_mate_keywords', { childName: childName })
      this.$ssrContext.description = this.$t('product.category.category_mate_description', { rootName: rootName, childName: childName, tdk: seoPatPatTdk(siteAbb) })
    }
  },
  components: {
    productList, otherCategories, filterTool
  },
  data () {
    return {
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
    filterTitle () {
      let _name = ''
      _name = this.pathCategories.length > 0 ? this.pathCategories[this.pathCategories.length - 1].name : _name
      _name = _name || this.categoryName
      return _name
    }
  },
  methods: {
    ...mapActions('category', {
      getData: 'getPageData',
      getMoreCategory: 'getMoreCategory'
    }),
    setClientData () {
      const categoryStore = this.$store.state.category
      this.products = JSON.parse(JSON.stringify(categoryStore.productList))
      this.adverts = categoryStore.adverts
      this.total = categoryStore.total
      this.pathCategories = categoryStore.pathCategories
      this.defaultFilter = (categoryStore.defaultFilter && categoryStore.defaultFilter.length) > 0 ? categoryStore.defaultFilter.map(id => id - 0) : []
      this.defaultPriceRange = categoryStore.priceRange
      this.defaultSort = categoryStore.sortFilter.default
      this.defaultCategory = {
        categoryId: categoryStore.categoryId,
        categorySonId: categoryStore.categorySonId
      }
      this.hasMore = categoryStore.hasMore
      this.setUserSeletFilter()
      const categoryFilter = {
        type: 'Category',
        key: 'Category',
        name: 'Category',
        categorySonId: categoryStore.categorySonId,
        children: []
      }
      this.defaultCategoryFilter = categoryFilter
      const priceFilter = {
        type: 'Price',
        key: 'Price',
        name: 'Price',
        priceRange: categoryStore.priceRange
      }
      if (categoryStore.categoryList[0] && categoryStore.categoryList[0].children) {
        categoryFilter.children = Object.assign(categoryStore.categoryList[0].children)
      }
      this.filters = [...categoryStore.filters, categoryStore.sortFilter, priceFilter, categoryFilter]
      this.getPathCategory(categoryFilter)

      if (!this.$isServer) {
        // GTM Data start
        const currentCategoryId = categoryStore.categorySonId || categoryStore.categoryId
        const serverPathCategories = categoryStore.pathCategories
        const top5SkuIds = categoryStore.top5SkuIds
        const categoriesEn = this.pathCategories.map(function (item) { return item.name_en })
        adTrackCategoryShow({
          before5_skuid: top5SkuIds.join(','),
          category_name: serverPathCategories.length > 0 ? serverPathCategories[0].name : '',
          category_tree: categoriesEn.join(' > '),
          category_page_id: currentCategoryId,
          category_seo_cation: serverPathCategories
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
        this.products = this.products.concat(this.$store.state.category.productList)
        if (this.products.length >= this.total) this.hasMore = false
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
      const routerParams = this.$route.params
      const firstName = routerParams.c1.replace('.html', '')
      const query = {}

      if (routeQuery.platform) {
        query.platform = routeQuery.platform
      }

      if (this.version) {
        query.v = this.version
      }

      if (routeQuery.isReview) {
        query.is_review = routeQuery.isReview
      }

      if (routeQuery.categoryType) {
        query.category_type = routeQuery.categoryType
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

      let _keyArr = []
      _keys.forEach(key => {
        _keyArr.push(this.categoryTree[key].url_name)
      })

      _keyArr = Array.from(new Set(_keyArr))

      const _pathString = _keyArr.join('/').length > 0 ? `/${_keyArr.join('/')}` : ''
      const langStr = this.$store.state.langCode === 'en' ? '' : `/${this.$store.state.langCode}`
      const _CategoryTree = `${langStr}/category/${firstName}${_pathString}.html`
      this.$router.push({
        path: _CategoryTree,
        query
      })
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
        if (this.$refs.filterTool.filterActive && Object.keys(query).length < 1) {
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
      const alreadyIncremented = !!this.$store.state.category
      if (!this.$store.hasModule('category')) {
        this.$store.registerModule('category', categoryStoreModule, { preserveState: alreadyIncremented })
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
  activated () {
    if (this.leavePage) {
      this.setUserSeletFilter()
      const idx = this.filters.findIndex(filter => {
        return filter.name === 'Price'
      })
      this.filters[idx].priceRange = JSON.parse(JSON.stringify(this.defaultPriceRange))
      this.getPathCategory(this.defaultCategoryFilter)
      this.$refs.filterTool.addScrollEventListener()
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
    this.$store.unregisterModule('category')
  }
}
</script>
<style scoped lang="less">
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
