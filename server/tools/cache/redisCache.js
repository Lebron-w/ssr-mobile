const cache = require('express-redis-cache')

const redisCache = cache({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: process.env.REDIS_PREFIX
})

const redisCacheNotPrefix = cache({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: ''
})

/**
 * 获取Redis缓存
 * @param {*} redisCacheKey
 * @param {*} notPrefix
 */
exports.getRedisCacheData = function (redisCacheKey, notPrefix = false) {
  return new Promise(function (resolve, reject) {
    const redis = notPrefix ? redisCacheNotPrefix : redisCache
    redis.get(redisCacheKey, function (error, entries) {
      if (error) {
        reject(error)
      } else {
        if (entries.length > 0) {
          const entry = entries[0]
          let data = entry.body
          if (entry.type === 'json') {
            data = JSON.parse(data)
          } else {
            data = {
              body: data,
              updateTime: entry.touched
            }
          }
          resolve(data)
        } else {
          resolve(null)
        }
      }
    })
  })
}

/**
 * 添加或更新 Redis缓存
 * @param {*} redisCacheKey
 * @param {*} cacheData
 * @param {*} expire
 * @param {*} type
 * @param {*} notPrefix
 */
exports.addRedisCacheData = function (redisCacheKey, cacheData, expire = 60 * 60 * 24 * 30, type = 'json', notPrefix = false) {
  return new Promise(function (resolve, reject) {
    if (typeof cacheData === 'object') {
      cacheData = JSON.stringify(cacheData)
    }
    const redis = notPrefix ? redisCacheNotPrefix : redisCache
    redis.add(redisCacheKey, cacheData, { expire: expire, type: type }, function (error, added) {
      if (error) {
        reject(error)
      } else {
        resolve(added)
      }
    })
  })
}

/**
 * 删除Redis缓存
 * @param {*} redisCacheKey
 * @param {*} notPrefix
 */
exports.delRedisCacheData = function (redisCacheKey, notPrefix = false) {
  return new Promise(function (resolve, reject) {
    const redis = notPrefix ? redisCacheNotPrefix : redisCache
    redis.del(redisCacheKey, function (error, delCount) {
      if (error) {
        reject(error)
      } else {
        resolve(delCount)
      }
    })
  })
}
