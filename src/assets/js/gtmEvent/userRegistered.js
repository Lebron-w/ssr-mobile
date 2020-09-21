export default function adTrackUserRegistered (obj) {
  window.dataLayer.push({
    registere_status: obj.success === 1 ? 'success' : 'failed'
  })

  /* Snap Pixel 广告跟踪 */
  window.dataLayer.push({ snap_sign_up: obj })

  window.dataLayer.push({ event: 'user_registered' })
}
