/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:14:10
 * ----------
 * Vuex 创建入口
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-07-16 11:00:18
 */
import Vue from 'vue'
import Vuex from 'vuex'
import rootState from './state' // 根级别 State
import getters from './getters' // 根级别 getters
import mutations from './mutations' // 根级别 mutations
import actions from './actions' // 根级别 actions
// import product from './modules/product'

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: rootState,
    getters,
    mutations,
    actions
    // modules: {
    //   product
    // },
  })
  return store
}
