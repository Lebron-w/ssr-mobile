/*
 * @Description:
 * @Author: zhengyun.chen
 * @Date: 2020-07-20 17:23:46
 * @Last Modified time: 2020-08-21 15:33:02
 * @Last Modified by: zhengyun.chen
 * @FilePath: /website-ssr-mobile/src/router/product/index.js
 */
const Category = () => import(/* webpackChunkName: "product" */ '../../views/product/Category.vue')
const Search = () => import(/* webpackChunkName: "product" */ '../../views/product/Search.vue')
// const ProductDetails =  () => import(/* webpackChunkName: "product" */ '../../views/product/ProductDetails.vue')
export default [
  {
    path: '/category/:c1/:c2?/:c3?/:c4?',
    name: 'category',
    component: Category,
    meta: {
      storeModule: 'category',
      showGift2Newer: true
    }
  }, {
    path: '/search',
    name: 'search',
    component: Search,
    meta: {
      storeModule: 'search'
    }
  }
  // {
  //   path: '/product/:name.html',
  //   name: 'product_details',
  //   component: ProductDetails,
  //   meta: {
  //     storeModule: 'product'
  //     showGift2Newer: true
  //   }
  // },
]
