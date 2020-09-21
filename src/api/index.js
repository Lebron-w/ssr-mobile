/*
 * @Author: 尹锋
 * @Date: 2020-07-20 10:16:56
 * ----------
 * 接口
 * ----------
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-19 15:47:26
 */

import { createPatPatAPI } from '$api'

/**
 * 获取国家基础映射数据列表
 */
export const getCountriesMap = (ppAPI) => {
  return () => {
    return ppAPI({
      url: '/v2/common/get_country_base_info'
    })
  }
}

/**
 * 获取用户IP国家
 */
export const getIpUserCountry = (ppAPI) => {
  return () => {
    return ppAPI({
      url: '/v2/common/get_ip_user_country'
    })
  }
}

/**
  * 获取首页数据
  */
export const getHomeData = (ppAPI) => {
  return () => {
    return ppAPI({
      url: '/v2/common/get_ip_user_country' // TODO: 非首页api 临时测试。
    })
  }
}

/**
 * 获取导航数据
 */
export const getNavigation = (ppAPI) => {
  return () => {
    return ppAPI({
      url: '/v2/home/navigation/h5'
    })
  }
}

/**
 * 获取商品详情数据
 * @param {*} params
 */
export const getProductDetails = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/product',
      params
    })
  }
}

/**
 * 登录
 * @param {*} param
 */
export const userLogin = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      method: 'post',
      url: '/v2/users/login',
      data: params
    })
  }
}

/**
 * Facebook登录
 * @param {*} param
 */
export const facebookLoginUrl = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      method: 'post',
      url: '/v2/users/signin_facebook',
      data: params
    })
  }
}

/**
  * Google登陆
  * @param {*} param
  */
export const webGoogleLogin = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      method: 'post',
      url: '/v2/users/google/sign',
      data: params
    })
  }
}

/**
 * 注册
 * @param {*} param
 */
export const userRegister = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      method: 'post',
      url: '/v2/users/register',
      data: params
    })
  }
}

/**
 * categories筛选
 * @param param
 */
export const categoriesList = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/categories/filters',
      method: 'get'
    })
  }
}

/**
 * 商品列表
 * @param params
 */
export const productList = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/categories/products',
      method: 'get'
    })
  }
}

// 版位信息
export const getFaceData = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/face/index',
      method: 'get',
      params: params
    })
  }
}

/**
 * @des 自定义活动
 */
export const layoutActivity = (ppAPI) => {
  // params.stock = localStorage.getItem('stock') ? localStorage.getItem('stock') : ''// 获取本地存储网红链接参数，仅供网红使用
  return (params = {}) => {
    return ppAPI({
      url: '/v2/face/activity',
      method: 'get',
      params: params
    })
  }
}

// daily upcoming通知
export const upcomingSave = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/users/attention/save',
      method: 'get',
      params: params
    })
  }
}

// 取消upcoming关注
export const upcomingCancel = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/users/attention/cancel',
      method: 'get',
      params: params
    })
  }
}

// 首页推荐商品
export const getHomeRecommendProduct = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/home/recommend_products',
      method: 'get',
      params: params
    })
  }
}

/**
 * 收藏接口
 * @param param
 */
export const favoritesAdd = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/users/favorites/add',
      method: 'post',
      data: params
    })
  }
}

/**
 * 商详数据
 * @param param
 */
export const detailProduct = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v2/product',
      method: 'get',
      params: params
    })
  }
}

/**
 * 收藏商品列表
 */
export const usersFavorites = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      url: '/v1/users/favorites',
      method: 'get',
      params: params
    })
  }
}

/**
 * 搜索热词
 * @param param
 */
export const searchKeyword = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/searches/hot_words',
      method: 'get'
    })
  }
}

/**
 * 搜索商品接口
 * @param param
 */
export const searchProducts = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/searches/products',
      method: 'get'
    })
  }
}

/**
 * 搜索商品筛选条件
 * @param param
 */
export const searchProductsFilter = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/searches/filters',
      method: 'get'
    })
  }
}

/**
 * 网站头部活动
 * @param param
 */
export const faceIndexTop = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/face/index?id=13',
      method: 'get'
    })
  }
}

/**
 * 钱包
 * @param param
 */
export const walletsNum = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v1/wallets',
      method: 'get'
    })
  }
}

/**
 * 用户默认信息，（右上角小购物车数量...）
 * @param param
 */
export const userNavigation = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/common/navigation_info',
      method: 'get'
    })
  }
}

/**
 * @des 用邮箱注册账号
 * @param param
 */
export const emailRegister = (ppAPI) => {
  return (params = {}) => {
    return ppAPI({
      params: params,
      url: '/v2/users/reg_quick',
      method: 'get'
    })
  }
}

/**
 * 导出全部接口
 */
export default (store) => {
  const ppAPI = createPatPatAPI(store)
  return {
    getCountriesMap: getCountriesMap(ppAPI),
    getIpUserCountry: getIpUserCountry(ppAPI),
    getNavigation: getNavigation(ppAPI),
    getProductDetails: getProductDetails(ppAPI),
    getHomeData: getHomeData(ppAPI),
    userLogin: userLogin(ppAPI),
    facebookLoginUrl: facebookLoginUrl(ppAPI),
    webGoogleLogin: webGoogleLogin(ppAPI),
    userRegister: userRegister(ppAPI),
    categoriesList: categoriesList(ppAPI),
    productList: productList(ppAPI),
    faceIndexTop: faceIndexTop(ppAPI),
    walletsNum: walletsNum(ppAPI),
    searchKeyword: searchKeyword(ppAPI),
    searchProducts: searchProducts(ppAPI),
    searchProductsFilter: searchProductsFilter(ppAPI),
    getFaceData: getFaceData(ppAPI),
    getHomeRecommendProduct: getHomeRecommendProduct(ppAPI),
    userNavigation: userNavigation(ppAPI),
    favoritesAdd: favoritesAdd(ppAPI),
    detailProduct: detailProduct(ppAPI),
    usersFavorites: usersFavorites(ppAPI),
    emailRegister: emailRegister(ppAPI),
    upcomingSave: upcomingSave(ppAPI),
    upcomingCancel: upcomingCancel(ppAPI),
    layoutActivity: layoutActivity(ppAPI)
  }
}
