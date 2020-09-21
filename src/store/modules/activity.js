import * as types from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    activityData: [],
    activityName: ''
  }),
  getters: {
    activityData: (state) => state.activityData
  },
  mutations: {
    [types.ACTIVITY_INFO] (state, data) {
      state.activityData = data
      state.activityName = data[0].title
    }
  },
  actions: {
    async getPageData ({ commit, rootState, rootGetters }, params) {
      try {
        if (!params) {
          const aid = rootState.route.query.id
          const faceToken = rootState.route.query.face_token
          const nameTmp = rootState.route.params.name
          params = {
            activity_id: aid,
            name: nameTmp,
            face_token: faceToken
          }
        }
        const faceData = await rootGetters.patpatAPI.layoutActivity(params)
        commit(types.ACTIVITY_INFO, faceData)
      } catch (e) {
        console.log('getFaceData error:', e)
      }
    }
  }
}
