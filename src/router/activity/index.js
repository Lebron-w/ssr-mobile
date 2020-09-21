const Home = () => import(/* webpackChunkName: "activity" */ '../../views/activity/Home.vue')
// const SubActivity = () => import(/* webpackChunkName: "activity" */ '../../views/activity/SubActivity.vue')
const PopSearch = () => import(/* webpackChunkName: "product" */ '../../views/activity/PopSearch.vue')

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      storeModule: 'home',
      showGift2Newer: true,
      hideBack: true
    }
  },
  {
    path: '/home-test',
    name: 'home-test',
    component: Home,
    meta: {
      storeModule: 'home',
      showGift2Newer: true,
      hideBack: true
    }
  },
  // {
  //   path: '/layout/activities/:url_name',
  //   component: SubActivity,
  //   name: 'subActivity',
  //   meta: {
  //     storeModule: 'activity',
  //     hideGift2Newer: true
  //   }
  // },
  {
    path: '/pop-search',
    name: 'pop-search',
    component: PopSearch,
    meta: {
      hideBack: true
    }
  }
]
