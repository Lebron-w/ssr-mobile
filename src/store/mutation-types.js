/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:14:42
 * ----------
 * Vuex mutation types
 * ----------
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-24 21:07:14
 */

export const INIT_COUNTRIES_MAP = 'INIT_COUNTRIES_MAP' // 国家默认信息

// 初始化ABTest流量分配
export const INIT_ABTEST_STR = 'INIT_ABTEST_STR'

export const INIT_USER_INFO = 'INIT_USER_INFO' // 用户信息

export const INIT_NAV_CATEGORIES = 'INIT_NAV_CATEGORIES' // 侧导航

export const SHOW_SIDER_BAR = 'SHOW_SIDER_BAR' // 显示侧边导航面板

export const HIDE_SIDER_BAR = 'HIDE_SIDER_BAR' // 显示侧边导航面板

export const INIT_PRODUCT_DETAILS = 'INIT_PRODUCT_DETAILS' // 初始化产品详情页面数据

export const INIT_HOME = 'INIT_HOME' // 初始首页数据

export const CATEGORY_LIST = 'CATEGORY_LIST' // 分类列表

export const PRODUCTS_LIST = 'PRODUCTS_LIST' // 商品列表

export const SEARCH_CATEGORY_LIST = 'CATEGORY_LIST' // 搜索分类列表

export const SEARCH_PRODUCTS_LIST = 'PRODUCTS_LIST' // 搜索商品列表

export const CHANGE_COUNTRY_CODE = 'CHANGE_COUNTRY_CODE' // 修改当前国家码

export const CHANGE_CURRENCY_CODE = 'CHANGE_CURRENCY_CODE' // 修改当前货币码

export const CHANGE_LANG_CODE = 'CHANGE_LANG_CODE' // 修改当前语言

export const CHANGE_SITE_ABB = 'CHANGE_SITE_ABB' // 修改当前站点

export const CHANGE_USER_IP = 'CHANGE_USER_IP' // 修改当前用户 ip

export const INIT_TOP_ACTIVITY = 'INIT_TOP_ACTIVITY' // 头部活动信息

export const CHANGE_TOP_ICON = 'CHANGE_TOP_ICON' // // 头部 ICON 切换

export const CHANGE_TOP_FREE = 'CHANGE_TOP_FREE' // 设置头部免邮提示是否显示

// export const USER_LOGIN_INFO = 'USER_LOGIN_INFO' //用户登录信息

export const FACE_INFO = 'FACE_INFO' // 版位信息

export const RECOMMEND_PRODUCT = 'RECOMMEND_PRODUCT' // 推荐商品

export const NAVIGATION_INFO = 'NAVIGATION_INFO' // 顶部导航相关信息

export const CHANGE_HEADER_ANIMATE = 'CHANGE_HEADER_ANIMATE' // 头部滚动是否隐藏

// header 状态（展示 or 隐藏， 默认展示）
export const CHANGE_HEADER_STATE = 'CHANGE_HEADER_STATE'
// footer 状态（展示 or 隐藏， 默认展示）
export const CHANGE_FOOTER_STATE = 'CHANGE_FOOTER_STATE'
// 顶部 activity banner 状态（展示 or 隐藏， 默认展示）
export const CHANGE_ACTIVITY_STATE = 'CHANGE_ACTIVITY_STATE'
// 分类页点击的收藏的商品信息
export const SET_FAV_PRODUCT = 'SET_FAV_PRODUCT'

export const SET_USER_FAVORITES = 'SET_USER_FAVORITES'

export const ACTIVITY_INFO = 'ACTIVITY_INFO' // 活动信息

export const CHANGE_TOP_USER_COUNT = 'CHANGE_TOP_USER_COUNT' // 改变头部右上角计数通知

export const SET_PCK = 'SET_PCK'
export const SET_CATE_GUIDE = 'SET_CATE_GUIDE' // 侧边导航红点引导
