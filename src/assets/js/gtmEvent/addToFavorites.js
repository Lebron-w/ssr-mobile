export default function adTrackAddToFavorites (obj) {
  // GTM数据层变量通用参数
  // eslint-disable-next-line
  dataLayer.push({
    add_to_favorites_data: obj
  })

  // eslint-disable-next-line
  dataLayer.push({ 'event': 'add_to_favorites' })
}
