export default () => {
  const deviceInfo = navigator.userAgent
  const deviceW = window.screen.width
  const deviceH = window.screen.height
  const devicePixelRatio = window.devicePixelRatio
  const iphones = {
    1136: 'iPhone5/S/SE',
    1334: 'iPhone 6/6S/7/8',
    2208: 'iPhone 6s/7/8 Plus',
    2436: 'iPhone X/XS',
    2688: 'iPhone XS MAX',
    1792: 'iphone XR',
    2048: 'iPad Air/Mini 2/ Mini 3/Air 2/Mini 4',
    2732: 'iPad Pro'
  }
  let phoneType = 'unknown'
  if (deviceInfo.indexOf('iPhone') >= 0 || deviceInfo.indexOf('iPad') >= 0) {
    const key = Math.max(deviceW, deviceH) * devicePixelRatio
    phoneType = iphones[key]
  } else if (deviceInfo.indexOf('Android') >= 0 && deviceInfo.indexOf('Linux') >= 0) {
    const uaArr = deviceInfo.split(';')
    phoneType = uaArr[uaArr.length - 1].split('Build')[0]
  } else if (deviceInfo.indexOf('BB10') >= 0) {
    phoneType = 'BlackBerry'
  } else if (deviceInfo.indexOf('PlayBook') >= 0) {
    phoneType = 'PlayBook'
  } else if (deviceInfo.indexOf('NOKIA') >= 0 || deviceInfo.indexOf('Nokia') >= 0) {
    phoneType = 'Nokia'
  }
  return phoneType
}
