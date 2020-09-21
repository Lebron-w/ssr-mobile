// 延迟加载第三方JS
window.onload = () => {
  const timerAfter1s = setTimeout(() => {
    window.dataLayer.push({ event: 'after_page_loaded_1s' })
    clearTimeout(timerAfter1s)
  }, 1000)
  const timerAfter2s = setTimeout(() => {
    window.dataLayer.push({ event: 'after_page_loaded_2s' })
    clearTimeout(timerAfter2s)
  }, 2000)
  const timerAfter3s = setTimeout(() => {
    window.dataLayer.push({ event: 'after_page_loaded_3s' })
    clearTimeout(timerAfter3s)
  }, 3000)

  const timerAfter5s = setTimeout(() => {
    window.dataLayer.push({ event: 'm_after_page_loaded_5s_e_cc' })
    clearTimeout(timerAfter5s)
  }, 5000)
}
