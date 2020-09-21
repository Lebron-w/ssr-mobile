export default function adTrackSearchPage (obj) {
  /* GTM通用数据层变量 */
  window.dataLayer.push({
    search_before5_skuId: obj.before5SkuId,
    search_keyword: obj.keyword
  })
  /* Sizmek Pixels 广告跟踪 数据层变量 */
  window.dataLayer.push({
    sizmek_pixels_t: 'srp',
    sizmek_pixels_q: obj.keyword,
    sizmek_pixels_pid: obj.before5SkuId
  })
  /* Pinterest 广告跟踪 */
  window.dataLayer.push({
    pinterest_search_query: obj.keyword
  })
  /* Snap Pixel 广告跟踪 */
  // eslint-disable-next-line
  window.dataLayer.push({
    snap_search: {
      search_string: obj.keyword
    }
  })
  /* Yeah Targeter 广告跟踪 */
  window.dataLayer.push({
    yt_search: {
      content_ids: obj.before5SkuId.split(','),
      search_string: obj.keyword
    }
  })
  /* Google Ads Remarketing */
  // eslint-disable-next-line
  //旧版
  window.dataLayer.push({
    ads_remarketing_params: JSON.stringify({
      ecomm_pagetype: 'searchresults'
    })
  })
  // 新版
  const before5SkuIdArr = obj.before5SkuId.split(',')
  const adsRemarketingEventItems = before5SkuIdArr.map((item) => {
    return {
      id: item,
      google_business_vertical: 'retail'
    }
  })
  window.dataLayer.push({
    ads_remarketing_params_new: JSON.stringify({
      ads_remarketing_event_name: 'view_search_results',
      ads_remarketing_event_value: '',
      ads_remarketing_event_items: adsRemarketingEventItems
    })
  })
  window.dataLayer.push({ event: 'search_result_page_view' })
}
