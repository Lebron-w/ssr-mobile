export default function adTrackCategoryShow (obj) {
  /* GTM通用数据层变量 */
  window.dataLayer.push({
    category_page_name: obj.category_name,
    category_tree_name: obj.category_tree,
    category_page_before5_skuid: obj.before5_skuid,
    category_page_id: obj.category_page_id,
    category_seo_application: obj.category_seo_cation
  })
  /* Sizmek Pixels 广告跟踪 数据层变量 */
  window.dataLayer.push({
    sizmek_pixels_t: 'cat',
    sizmek_pixels_cat: obj.category_name,
    sizmek_pixels_pid: obj.before5_skuid
  })

  /* Google Ads Remarketing */
  // 旧版
  window.dataLayer.push({
    ads_remarketing_params: JSON.stringify({
      ecomm_pagetype: 'category',
      ecomm_category: obj.category_name
    })
  })
  // 新版
  window.dataLayer.push({
    ads_remarketing_params_new: JSON.stringify({
      ads_remarketing_event_name: 'view_item_list',
      ads_remarketing_event_items: [{
        id: obj.category_page_id,
        google_business_vertical: 'retail'
      }]
    })
  })
  window.dataLayer.push({ event: 'category_page_view' })
}
