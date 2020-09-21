export default function adTrackProductClick (obj) {
  console.log(obj, 'ssr product click')
  window.dataLayer.push({
    event: 'product_clicks',
    ecommerce: {
      click: {
        actionField: { list: obj.listType }, // Optional list property.
        products: [obj.product]
      }
    }
  })
}
