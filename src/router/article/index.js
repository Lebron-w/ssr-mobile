const About = () => import(/* webpackChunkName: "about" */ '../../views/article/About.vue')

export default [
  {
    path: '/about',
    name: 'about',
    component: About
  }
]
