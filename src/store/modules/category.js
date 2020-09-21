/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:15:33
 * ----------
 * 分类Vuex模块
 * ----------
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-19 17:40:38
 */
import * as types from '../mutation-types'

const getReqParams = (rootState) => {
  const params = rootState.route.params
  const query = rootState.route.query
  const firstName = params.c1
  const { c2, c3, c4 } = { ...params }
  const sonName = [c2, c3, c4].filter((s) => {
    return s && s.trim()
  }).join(',')
  const param = {
    category_id: query.category_id ? query.category_id : '',
    category_name: firstName.replace('.html', '') || '',
    category_son_id: query.category_son_id ? query.category_son_id : '',
    category_son_name: sonName.replace('.html', '') || '',
    is_sale: 0,
    sort: query.sort ? query.sort : '',
    filter: query.filter ? JSON.parse(query.filter).join(',') : '',
    start_price: query.start_price ? query.start_price : '0.00',
    end_price: query.end_price ? query.end_price : '100.00',
    page: 1,
    page_size: 20
  }
  if (query.v) {
    param.v = query.v
  }
  if (query.product_id) {
    param.product_id = query.product_id
  }
  if (query.sku_ids) {
    param.sku_ids = query.sku_ids
  }

  return param
}

export default {
  namespaced: true,
  state: () => ({
    categoryList: [],
    sortFilter: {},
    priceRange: [],
    filters: [],
    productList: [],
    pathCategories: [],
    total: 0,
    categoryId: '',
    categorySonId: '',
    top5SkuIds: [],
    adverts: [],
    hasMore: false
  }),
  mutations: {
    [types.CATEGORY_LIST] (state, data) {
      state.categoryList = data.category_tree
      state.filters = data.filters
      state.priceRange = data.priceRange
      state.sortFilter = {
        key: 'Sort',
        name: 'Sort',
        default: data.selectSort || data.default_sort_type,
        values: data.sort_types
      }
    },
    [types.PRODUCTS_LIST] (state, data) {
      state.productList = data.items
      state.pathCategories = data.path_categories
      state.total = data.total
      state.top5SkuIds = data.top5SkuIds
      state.categoryId = data.category_id
      state.categorySonId = data.category_son_id
      state.adverts = data.adverts
      state.defaultFilter = data.defaultFilter ? data.defaultFilter.split(',') : []
      state.hasMore = data.hasMore
    }
  },
  actions: {
    async getCategoryList ({ commit, rootState, rootGetters }) {
      try {
        const firstName = rootState.route.params.c1
        const query = rootState.route.query
        const param = {
          category_name: firstName.replace('.html', '') || ''
        }
        const data = await rootGetters.patpatAPI.categoriesList(param)
        data.priceRange = [query.start_price || '', query.end_price || '']
        data.selectSort = query.sort || ''
        commit(types.CATEGORY_LIST, data)
      } catch (error) {
        console.log('getCategoryList error:', error)
      }
    },
    async getProductList ({ commit, rootState, rootGetters }) {
      try {
        const param = getReqParams(rootState)
        const data = await rootGetters.patpatAPI.productList(param)
        data.hasMore = data.items.length < data.total
        data.defaultFilter = param.filter || ''
        commit(types.PRODUCTS_LIST, data)
      } catch (error) {
        console.log('getProductList error:', error)
      }
    },
    async getPageData ({ dispatch }) {
      try {
        const categoryList = dispatch('getCategoryList')
        const productList = dispatch('getProductList')
        const allPromise = [productList, categoryList]
        await Promise.all(allPromise)
      } catch (error) {
        console.log('getCategoryPageData error:', error)
      }
    },
    async getMoreCategory ({ commit, rootState, rootGetters }, params = {}) {
      try {
        const param = getReqParams(rootState)
        param.page = params.page || 1
        const data = await rootGetters.patpatAPI.productList(param)
        commit(types.PRODUCTS_LIST, data)
      } catch (error) {
        console.log('getProductList error:', error)
      }
    }
  }
}
