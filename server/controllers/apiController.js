/*
 * @Author: 尹锋
 * @Date: 2020-08-07 17:16:44
 * ----------
 * 文件功能描述
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-19 16:14:14
 */

module.exports.clearCache = (req, res) => {
  if (req.headers.sign === process.env.REDIS_SIGN) {
    const redisCache = require('../tools/cache/redisCache')
    redisCache.delRedisCacheData(req.params.cacheKey).then(delCount => {
      res.json({ status: 200, msg: `success deleted ${delCount} redis key` })
    }).catch(error => {
      res.json({ status: 401, msg: error.stack })
    })
  } else {
    res.json({ status: 201, msg: 'failure' })
  }
}

module.exports.testDelay = (req, res) => {
  console.log('testDelay API')
  setTimeout(() => {
    res.json({ delay: '15秒' })
  }, 5000)
}
