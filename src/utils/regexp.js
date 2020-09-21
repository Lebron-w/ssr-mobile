// 邮箱验证
export const isEmail = function (email) {
  const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return regex.test(email)
}

// 纯数字验证
export const isNumber = function (number) {
  const regex = /^[\d|.]*$/
  return regex.test(number)
}

// 纯数字9位验证
export const isNumberNine = function (numberNine) {
  const regex = /^\d{9}$/
  return regex.test(numberNine)
}
