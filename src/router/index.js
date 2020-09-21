/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:17:24
 * ----------
 * Vue 路由入口文件
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-07-18 16:23:44
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import activity from './activity'
// import product from './product'
import checkout from './checkout'
import account from './account'
import helpCenter from './helpCenter'
import article from './article'

Vue.use(VueRouter)

export default () => {
  const routes = [...activity, ...checkout, ...account, ...helpCenter, ...article]
  const langPath = '/:lang([a-z]{2,2})?'
  const langRoutes = routes.map(router => {
    if (router.path.indexOf(langPath) < 0) {
      router.path = langPath + router.path
    }
    return router
  })
  const router = new VueRouter({
    mode: 'history',
    routes: langRoutes,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })

  return router
}
