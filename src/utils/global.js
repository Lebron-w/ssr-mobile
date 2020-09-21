/**
 * 用安全的读取数据 e.g. argData = {a:{b:2}} argPath = 'a.b' 则可读取出来为2
 * @param {object} argData 被读取的数据
 * @param {string} argPath 读取路径.隔开 如： a.b
 * @param {string} defaultValue 默认值
 */
export const safe = (argData, argPath, defaultValue) => {
  if (!argData) {
    return defaultValue
  }
  const temKey = argPath.toString().split('.')
  const temLen = temKey.length
  if (temLen > 1) {
    for (let i = 0; i < temLen - 1; i++) {
      if (typeof argData[temKey[i]] !== 'object') {
        return defaultValue
      }
      argData = argData[temKey[i]] || {}
    }
  }
  const lastItem = argData[temKey[temLen - 1]]
  return typeof defaultValue === 'undefined' ? lastItem : (lastItem || defaultValue)
}
