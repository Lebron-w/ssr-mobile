/*
 * @Author: 尹锋
 * @Date: 2020-07-20 15:42:37
 * ----------
 * 初始化req & res的基础参数
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-19 14:55:51
 */
const MobileDetect = require('mobile-detect')
const { v4: uuidV4 } = require('uuid')
const { experimentAllot } = require('../tools/abTest/index')

module.exports = (req, res, next) => {
  // ip
  let customersIp = req.headers['x-forwarded-for'] || ''
  customersIp = customersIp.split(',')[0]
  req.customersIp = customersIp
  // host
  const host = req.headers.host || req.host
  req.originHost = req.headers.host
  // 域名
  const hostSplitArray = host.split(':')
  req.websiteDomain = hostSplitArray[0]
  // 端口
  req.urlPort = hostSplitArray.length > 1 ? hostSplitArray[1] : ''
  // 完整url
  req.fullUrl = `${req.protocol}://${req.headers.host}${req.url}`
  const md = new MobileDetect(req.headers['user-agent'])
  const equipment = md.mobile()
  req.isMobile = !!equipment

  // 初始化uuid
  const rootDomain = '.' + req.websiteDomain.split('.').slice(-2).join('.')
  let uuid = req.cookies.unique_session_id
  if (!uuid) {
    uuid = uuidV4()
    const expires = new Date()
    expires.setDate(expires.getDate() + 3650)
    res.cookie('unique_session_id', uuid, { expires, httpOnly: false, domain: rootDomain })
    console.log(uuid)
  }

  // 初始化AB流量分配
  const experimentStr = experimentAllot(uuid, req.query)
  req.abTestStr = experimentStr

  next()
}
