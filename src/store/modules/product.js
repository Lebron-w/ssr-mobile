/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:15:33
 * ----------
 * 产品详情Vuex模块
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-07-30 16:06:37
 */
import * as types from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    productInfo: {},
    skuList: [],
    reviewInfo: {},
    urlName: '',
    seoInfo: {}
  }),
  mutations: {
    [types.INIT_PRODUCT_DETAILS] (state, data) {
      state.reviewInfo = data.review_info
      const productsFirst = data.products[0]
      state.productInfo = {
        product_id: productsFirst.product_id,
        product_code: productsFirst.product_code,
        product_name: productsFirst.product_name,
        like_number: productsFirst.like_number,
        description: productsFirst.description,
        is_customized: productsFirst.is_customized,
        product_status: productsFirst.product_status,
        tags: productsFirst.tags
      }

      const skuList = []
      data.products.forEach(sku => {
        skuList.push({
          sku_id: sku.sku_id,
          icon: sku.icon,
          msrp: sku.msrp,
          price: sku.price,
          store_price: sku.store_price,
          stock: sku.stock,
          option: sku.option,
          size_chart: sku.size_chart
        })
      })
      state.skuList = skuList
      state.urlName = data.url_name
      state.seoInfo = {
        name: productsFirst.product_name,
        price: productsFirst.price
      }
    }
  },
  actions: {
    async getPageData ({ commit, rootState, rootGetters }) {
      try {
        const params = {}
        if (rootState.route) {
          const urlName = rootState.route.params.name
          params.product_name = urlName
        }
        const data = await rootGetters.patpatAPI.getProductDetails(params)
        console.log('请求到产品详情数据', rootState.langCode)
        data.url_name = params.product_name
        commit(types.INIT_PRODUCT_DETAILS, data)
      } catch (error) {
        console.error('ERROR: store.product.getProductDetails', error)
        throw error
      }
    }
  }
}
