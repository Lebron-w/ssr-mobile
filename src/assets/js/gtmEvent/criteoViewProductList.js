import { getUserMd5Email, getCriteoTagsAccountId } from '../common'
export default function criteoAdTrackViewProductList (productItem) {
  window.dataLayer.push({
    event: 'criteo_view_product_list',
    criteo_product_id: productItem.arrId,
    md5_email: getUserMd5Email(),
    criteo_account_id: getCriteoTagsAccountId()
  })
}
