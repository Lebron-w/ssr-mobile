import { createTrackAPI } from './create-client'

let trackApi = null

// 获取请求实例
function getReq () {
  if (!trackApi) {
    trackApi = createTrackAPI()
  }
  return trackApi
}

/**
 * 页面内容所有click事件show事件批量合并上报
 * @param params
 */
export const tracksRecord = (params) => {
  return getReq()({
    url: '/v1/tracks/merge_track',
    method: 'post',
    data: params
  })
}

/**
 * 页面内容所有click事件show事件批量合并上报
 * @param params
 */
export const tracksExposureTrack = (params) => {
  return getReq()({
    url: '/v1/tracks/merge_exposure_track',
    method: 'post',
    data: params
  })
}

/**
 * 坑位曝光Track
 * @param data
 */
export const trackAddToCart = (data) => {
  return getReq()({
    url: '/v1/tracks/add_to_cart',
    method: 'post',
    data: data
  })
}
