/*
 * @Author: 尹锋
 * @Date: 2020-08-12 11:05:49
 * ----------
 * AB测试配置
 * traffic 参数不经常改动，基本固定每个t 10% 流量
 * experiment 参数值为 /server/tools/abTest/experiments.js 里面的 module name(对象属性名并非eid) 点符号（.）拼接实验组 eg: interaction.A
 * 时间排期时可重用traffic 但需要注意 experiment 开始时间 结束时间不能重。eg:
 * { traffic: abTraffics.t0, experiment: 'interaction.A' }, interaction的开始结束时间和productImage的开始结束时间不能重
 * { traffic: abTraffics.t0, experiment: 'productImage.A' },
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-19 10:23:36
 */
const abTraffics = require('../configs/abTraffics')

module.exports = [
  { traffic: abTraffics.t0, experiment: 'detailBrand.A' },
  { traffic: abTraffics.t1, experiment: 'detailBrand.A' },
  { traffic: abTraffics.t2, experiment: 'detailBrand.B' },
  { traffic: abTraffics.t3, experiment: 'detailBrand.B' },
  { traffic: abTraffics.t4, experiment: 'productImage.A' },
  { traffic: abTraffics.t5, experiment: 'productImage.A' },
  { traffic: abTraffics.t6, experiment: 'productImage.B' },
  { traffic: abTraffics.t7, experiment: 'productImage.B' },
  { traffic: abTraffics.t8, experiment: 'productImage.C' },
  { traffic: abTraffics.t9, experiment: 'productImage.C' }
]
