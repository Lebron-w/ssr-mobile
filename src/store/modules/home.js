import * as types from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    test: '',
    faceData: [],
    recommendProduct: []
  }),
  getters: {
    faceData: (state) => state.faceData,
    recommendProduct: (state) => state.recommendProduct
  },
  mutations: {
    [types.INIT_HOME] (state, data) {
      state.test = data.ip
    },
    [types.FACE_INFO] (state, data) {
      state.faceData = data
    },
    [types.RECOMMEND_PRODUCT] (state, data) {
      state.recommendProduct = data
    }
  },
  actions: {
    async getPageData ({ dispatch }) {
      try {
        const faceData = dispatch('getFaceData')
        const testData = dispatch('getHomeTestData')
        const rpData = dispatch('getRecommentProduct')
        const allPromise = [faceData, testData, rpData]
        await Promise.all(allPromise)
      } catch (error) {
        console.log('home getPageData error:', error)
      }
    },
    async getFaceData ({ commit, rootState, rootGetters }, params) {
      try {
        if (!params) {
          const pid = rootState.route.query.pid || 4
          const fid = rootState.route.query.face_schedule_id
          const faceToken = rootState.route.query.face_token
          params = {
            id: pid,
            face_schedule_id: fid,
            face_token: faceToken
          }
        }
        const faceData = await rootGetters.patpatAPI.getFaceData(params)
        commit(types.FACE_INFO, faceData)
      } catch (e) {
        console.log('getFaceData error:', e)
      }
    },
    async getHomeTestData ({ commit, rootGetters }) {
      const data = await rootGetters.patpatAPI.getHomeData()
      commit(types.INIT_HOME, data)
    },
    async getRecommentProduct ({ commit, rootGetters }, params) {
      try {
        if (!params) {
          params = {
            page: 1,
            page_size: 20
          }
        }
        const rpArr = await rootGetters.patpatAPI.getHomeRecommendProduct(params)
        commit(types.RECOMMEND_PRODUCT, rpArr)
      } catch (e) {
        console.log('getRecommentProduct error:', e)
      }
    }
  }
}
