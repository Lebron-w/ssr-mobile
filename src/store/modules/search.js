/*
 * @Author: zhengyun.chen
 * @Date: 2020-07-15 20:15:33
 * ----------
 * 搜索Vuex模块
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-18 20:25:14
 */

import * as types from '../mutation-types'

const getReqParams = (rootState) => {
  const query = rootState.route.query
  const param = {
    keyword: query.keyword,
    category_id: query.category_id ? query.category_id : '',
    category_son_id: query.category_son_id ? query.category_son_id : '',
    is_sale: 0,
    sort: query.sort ? query.sort : '',
    filter: query.filter ? JSON.parse(query.filter).join(',') : '',
    start_price: query.start_price ? query.start_price : '',
    end_price: query.end_price ? query.end_price : '',
    page: 1,
    page_size: 40
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
    total: 0,
    categoryId: '',
    categorySonId: '',
    top5SkuIds: [],
    adverts: [],
    hasMore: false
  }),
  mutations: {
    [types.SEARCH_CATEGORY_LIST] (state, data) {
      state.categoryList = data.category_tree
      state.filters = data.filters
      state.priceRange = data.priceRange
      state.sortFilter = {
        key: 'Sort',
        name: 'Sort',
        default: data.selectSort || data.default_sort_type,
        values: data.sort_types
      }
      state.categorySonName = data.category_son_name
    },
    [types.SEARCH_PRODUCTS_LIST] (state, data) {
      state.productList = data.items
      state.total = data.total
      state.top5SkuIds = data.top5_sku_ids
      state.defaultFilter = data.defaultFilter ? data.defaultFilter.split(',') : []
      state.hasMore = data.hasMore
      state.categoryId = data.category_id
      state.categorySonId = data.category_son_id
    }
  },
  actions: {
    async getCategoryList ({ commit, rootState, rootGetters }) {
      try {
        const query = rootState.route.query
        const param = {
          keyword: query.keyword
        }
        const data = await rootGetters.patpatAPI.searchProductsFilter(param)
        data.priceRange = [query.start_price || '', query.end_price || '']
        data.selectSort = query.sort || ''
        commit(types.SEARCH_CATEGORY_LIST, data)
      } catch (error) {
        console.log('getCategoryList error:', error)
      }
    },
    async getProductList ({ commit, rootState, rootGetters }) {
      try {
        const param = getReqParams(rootState)
        const data = await rootGetters.patpatAPI.searchProducts(param)
        data.hasMore = data.items.length < data.total
        data.defaultFilter = param.filter || ''
        data.category_id = param.category_id
        data.category_son_id = param.category_son_id
        commit(types.PRODUCTS_LIST, data)
      } catch (error) {
        console.log('getSearchProductList error:', error)
      }
    },
    async getPageData ({ dispatch }) {
      try {
        const categoryList = dispatch('getCategoryList')
        const productList = dispatch('getProductList')
        const allPromise = [productList, categoryList]
        await Promise.all(allPromise)
      } catch (error) {
        console.log('getSearchCategoryPageData error:', error)
      }
    },
    async getMoreCategory ({ commit, rootState, rootGetters }, params = {}) {
      try {
        let param = getReqParams(rootState)
        param = Object.assign(param, params)
        const data = await rootGetters.patpatAPI.searchProducts(param)
        commit(types.SEARCH_PRODUCTS_LIST, data)
      } catch (error) {
        console.log('getSearchProductList error:', error)
      }
    }
  }
}
