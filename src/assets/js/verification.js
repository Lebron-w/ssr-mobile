/*
 * 字段说明
 * clostTips____类型:number，字段关闭提示，毫秒。
 * error________类型:string，返回错误提示，读取传过来的中 errorText；没有传使用默认。
 * length_______类型:number，输入字符串的长度。
 * required_____类型:boolean，是否必填，默认为 true。
 * email________类型:string，邮箱，默认会校验邮箱规则。
 * number_______类型:number，纯数字校验，默认false。
 * regex________类型:string，自定义校验规则。
 */

import Vue from 'vue'

// 特点的验证规格
const regex = {
  email: /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
  number: /^[0-9]+.?[0-9]*/
}

// 验证方法
function verification (val) {
  for (const v in val) {
    val[v].required = val[v].required || true

    // 关闭提示
    if (val.clostTips > 0) {
      setTimeout(() => {
        if (v !== 'clostTips') {
          Vue.set(val[v], 'error', false)
        }
      }, val.clostTips)
    }

    // 必填
    if (val[v].required && val[v].text === '') {
      Vue.set(val[v], 'error', 'This item is required')
      return false
    }

    // 限制长度
    if (val[v].length && val[v].text.length < val[v].length) {
      Vue.set(val[v], 'error', val[v].errorText || 'Please output length greater than' + val[v].length)
      return false
    }

    // 邮箱
    if (v === 'email' && !regex.email.test(val[v].text)) {
      Vue.set(val[v], 'error', val[v].errorText || 'Please input the correct email address')
      return false
    }

    // 纯数字
    if (val[v].number && !regex.number.test(val[v].text)) {
      Vue.set(val[v], 'error', val[v].errorText || 'Please output pure numbers')
      return false
    }

    // 自定义 根据传过来的正则
    if (val[v].regex && !val[v].regex.test(val[v].text)) {
      Vue.set(val[v], 'error', val[v].errorText || 'Please output the correct')
      return false
    }

    // 再次点击关闭上次的验证提示
    if (v !== 'clostTips') {
      Vue.set(val[v], 'error', false)
    }
  }

  return true
}

export default (val) => {
  return new Promise((resolve) => {
    resolve(verification(val))
  })
}
