/*
 * @Author: 尹锋
 * @Date: 2020-08-19 15:29:10
 * ----------
 * 创建货币转换器
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-08-19 15:29:34
 */
import Vue from 'vue'
import VueL10nCurrency from 'vue-l10n'

Vue.use(VueL10nCurrency)

let l10nCurrency

export const createL10n = () => {
  l10nCurrency = new VueL10nCurrency({})
  return l10nCurrency
}

export const setL10nCurrency = (currency) => {
  l10nCurrency.currency = currency
}
