/*
 * @Author: 尹锋
 * @Date: 2020-08-12 11:10:30
 * ----------
 * AB测试 实验对象配置
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-18 17:10:50
 */

/**
 * 用户行为计数，aws推荐算法
 */
module.exports.interaction = {
  id: 'interaction',
  time: {
    start: '2020-7-28 00:00:00',
    end: '2020-8-28 23:59:59'
  },
  groups: ['A', 'B']
}

/**
 * 多套图实验
 */
module.exports.productImage = {
  id: 'product_image',
  time: {
    start: '2019-12-6 00:00:00',
    end: '2020-12-28 23:59:59'
  },
  groups: ['A', 'B', 'C']
}

/**
 * 产品详情页面加购交互动画
 */
module.exports.detailBrand = {
  id: 'detail_brand',
  time: {
    start: '2018-12-6 00:00:00',
    end: '2020-12-28 23:59:59'
  },
  groups: ['A', 'B']
}
