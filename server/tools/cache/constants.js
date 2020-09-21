module.exports = Object.freeze({
  // Redis 缓存7天过期
  EXPIRE_SEVEN_DAYS: 60 * 60 * 24 * 7,
  // Redis 缓存1天过期
  EXPIRE_ONE_DAY: 60 * 60 * 24,
  // Redis 缓存6小时过期
  EXPIRE_SIX_HOUR: 6 * 60 * 60,
  // Redis 缓存1小时过期
  EXPIRE_ONE_HOUR: 60 * 60,
  // Redis 缓存5分钟过期
  EXPIRE_FIVE_MINUTES: 60 * 5,
  // Redis 缓存1分钟过期
  EXPIRE_ONE_MINUTES: 60,

  // adLink 数据缓存
  AD_LINK_ID: 'adlink-',

  // API（/v2/common/get_country_base_info）数据缓存
  API_DATA_COUNTRIES_MAP: 'ad:countries',
  // API（/v2/common/get_ip_user_country）数据缓存
  API_DATA_IP_USER_COUNTRY: 'ad:uc:ip:',

  // 首页渲染结果缓存
  RENDER_PAGE_HOME: 'rp:home',
  // 自定义活动页面 customize layout activity (cla)
  RENDER_PAGE_CUSTOMIZE_ACTIVITY: 'rp:cla',
  // 分类页面渲染结果缓存
  RENDER_PAGE_CATEGORY: 'rp:category',
  // 产品详情渲染结果缓存
  RENDER_PAGE_PRODUCT: 'rp:product'
})
