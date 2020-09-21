export const lazyImgFilter = {
  preLoad: 1.7,
  filter: {
    // patpatCdn (listener) {
    //   let tracked = listener.el.getAttribute('track')// 这个元素是否被标记曝光
    //   if (tracked !== 'tracked') {
    //     listener.el.setAttribute('track', 'unTrack')// 用于数据上报，两种状态，tracked和unTrack。
    //   }
    //   // const isCDN = /img.ppwebstatic.com/
    //   // if (!isCDN.test(listener.src)) {
    //   listener.src = cdnUrl(listener.src)
    //   // }
    // }
  },
  adapter: {
    loaded ({ el }) { // rgba(229, 227, 210, 0.1)
      // el.style.cssText = el.style.cssText.replace(/background:\s?(#[a-zA-Z0-9]{6}|rgba?\(\d{1,3},\s?\d{1,3},\s?\d{1,3}(,\s?[0-9.]+)?\));?/g, '')
      el.style.backgroundColor = ''
      if (el.__patpatBgLoading__) {
        el.style.opacity = 0.4
        poll(el, 0.4)
      }
    },
    loading (listender) {
      if (!listender.el.__patpatBgLoading__ && listender.el.getAttribute('lazymode') === 'bg' && !listender.el.complete) {
        listender.el.__patpatBgLoading__ = true
        listender.el.style.background = getColor()
      }
    }
  }
}

const poll = function (el, opacity) {
  if (window.requestAnimationFrame) {
    requestAnimationFrame(() => {
      let nextOpacity = opacity + 0.03
      nextOpacity = nextOpacity >= 1 ? 1 : nextOpacity
      el.style.opacity = nextOpacity
      if (nextOpacity < 1) {
        poll(el, nextOpacity)
      }
    })
  } else {
    el.style.opacity = 1
  }
}

const bgColorList = ['#CFF9EC', '#C7F7F3', '#D1ECFC', '#FFEDB9', '#FFE3E8', '#FFD9B6']
let pointer = 0

export const getColor = () => {
  if (pointer >= bgColorList.length) {
    pointer = 0
  }
  return bgColorList[pointer++]
}
