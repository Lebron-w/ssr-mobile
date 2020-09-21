
const cacheConstants = require('../tools/cache/constants')

module.exports = [
  {
    path: '/category/',
    cacheKey: cacheConstants.RENDER_PAGE_CATEGORY,
    expire: cacheConstants.EXPIRE_SIX_HOUR
  },
  {
    path: '/product/',
    cacheKey: cacheConstants.RENDER_PAGE_PRODUCT,
    expire: cacheConstants.EXPIRE_SIX_HOUR
  },
  {
    path: '/',
    cacheKey: cacheConstants.RENDER_PAGE_HOME,
    expire: cacheConstants.EXPIRE_SIX_HOUR
  },
  {
    path: '/layout/activities/',
    cacheKey: cacheConstants.RENDER_PAGE_CUSTOMIZE_ACTIVITY,
    expire: cacheConstants.EXPIRE_SIX_HOUR
  }

]
