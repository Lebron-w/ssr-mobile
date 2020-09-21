/* eslint-disable no-extend-native */
/**
 * Date对象扩张时间天数加法
 * @param {*} days
 */
Date.prototype.addDays = function (days = 1) {
  this.setDate(this.getDate() + days)
  return this
}

/**
 * Date对象扩张时间天数减法
 * @param {*} days
 */
Date.prototype.subDays = function (days = 1) {
  this.setDate(this.getDate() - days)
  return this
}
