import { checkIsJSON } from '../base'

/**
 * 添加 SessionStorage
 * @param {String} name
 * @param {String | Object} content
 */
export const setSessionStorage = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  sessionStorage.setItem(name, content)
}

/**
 * 获取 SessionStorage
 * @param {String} name
 */
export const getSessionStorage = name => {
  if (!name) return
  let ss = sessionStorage.getItem(name)
  if (checkIsJSON(ss)) {
    ss = JSON.parse(ss)
  }
  return ss
}

/**
 * 添加 LocalStorage
 * @param {String} name
 * @param {String | Object} content
 */
export const setLocalStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  localStorage.setItem(name, content)
}

/**
 * 获取 LocalStorage
 * @param {*} name
 */
export const getLocalStore = name => {
  if (!name) return
  let ls = localStorage.getItem(name)
  if (checkIsJSON(ls)) {
    ls = JSON.parse(ls)
  }
  return ls
}

export const delSessionStorage = name => {
  sessionStorage.removeItem(name)
}

export const delLocalStore = name => {
  localStorage.removeItem(name)
}
