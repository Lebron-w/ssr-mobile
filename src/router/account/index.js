const UserCenter = () => import(/* webpackChunkName: "login" */ '../../views/account/UserCenter.vue')
const LogInRegister = () => import(/* webpackChunkName: "login" */ '../../views/account/LogInRegister.vue')

export default [
  {
    path: '/user-center',
    name: 'user-center',
    component: UserCenter,
    meta: {
      hideBack: true
    }
  },
  {
    path: '/account/:login([register]{8,8}|[login]{5,5})',
    name: 'login-register',
    component: LogInRegister,
    meta: {
      hideBack: true
    }
  }
]
