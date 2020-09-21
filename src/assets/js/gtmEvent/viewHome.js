import { getUserMd5Email, getCriteoTagsAccountId } from '../common'
export default function adTrackHomeShow (obj) {
  /* Sizmek Pixels 广告跟踪 */
  window.dataLayer.push({
    sizmek_pixels_t: 'home',
    md5_email: getUserMd5Email(),
    criteo_account_id: getCriteoTagsAccountId(),
    current_country_info: obj
  })

  window.dataLayer.push({
    ads_remarketing_params: JSON.stringify({
      ecomm_pagetype: 'home'
    })
  })
  window.dataLayer.push({ event: 'view_home' })
}
