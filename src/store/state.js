/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:16:51
 * ----------
 * Vuex根级别全局状态
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-11 11:29:13
 */
import langs from '../configs/langs'

export default () => ({
  langs,
  topIconType: '',
  countriesMap: [],
  ipMapCountry: 'US', // 用户ip映射国家码
  abTestStr: '', // ABTest浏览分配实验格式化字符串 eg: ab_test_id1.A,ab_test_id2.X
  userInfo: {},
  navCategories: [],
  navCartNumber: 0,
  showSiderBar: false,
  showHeader: true, // header 展示隐藏
  showFooter: true, // footer 展示隐藏
  showActivity: true, // 顶部活动banner 展示隐藏
  countryCode: 'US', // 当前国家码, p0 url 参数country_code, p1 用户设置国家参数, p2 站点映射国家参数
  currencyCode: 'USD', // 当前货币码, p0 url 参数currency, p1 用户设置国家参数, p2 站点映射国家参数
  langCode: 'en', // 当前货币码, p0 url 参数currency, p1 用户设置国家参数, p2 站点映射国家参数
  siteAbb: 'us', // 当前站点标识符
  userIp: '', // 当前用户 IP
  loginStatus: false, // 登录状态，默认 false
  topActivity: '',
  showFreeTips: true, // 顶部邮费 展示隐藏
  headerAnimate: false, // 分类 搜索页 头部滚动隐藏状态
  collectFavProduct: null, // 点击收藏的商品信息
  userFavorites: [], // 用户收藏商品列表
  topCartProNum: '', // 头部购物车计数
  navInfo: null, // 顶部栏相关信息
  cateGuide: (Date.now() + '_1'), // 用户首次打开网站分类按钮引导
  pck: '' // page cache key
})
