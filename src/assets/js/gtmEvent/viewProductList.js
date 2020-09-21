export default function adTrackViewProductList (impressions) {
  window.dataLayer.push({
    ecommerce: {
      impressions: impressions
    }
  })

  window.dataLayer.push({ event: 'view_product_list' })
}
