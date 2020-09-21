import { cdnUrl } from '@/utils/base'
import patpatLogo2 from '@/assets/images/base/bg-logo.png'

import { getScroller, getOffsetHeight, getClientHeight, getElementTop } from '@/utils/dom'

// 注册一个全局自定义指令
export const BgLazy = {
  bind: function (el, binding) {
    const data = binding.value
    el.style.background += `,url(${patpatLogo2}) no-repeat center center / ${data.height >= 45 ? '45px' : 'contain'} #F9F9F9`
    const src = cdnUrl(data.src)
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          let img = document.createElement('img')
          img.src = src
          img.onload = () => {
            el.style.background = binding.value.style.replace('0PX', data.size || '100%')
            // 不对lazymode 为bg 的进行处理
            if (el.getAttribute('lazymode') !== 'bg') {
              el.style.opacity = 0.1
              const timeTmp = setTimeout(() => {
                el.style.transition = 'opacity 1s cubic-bezier(0,0,0,1)'
                el.style.opacity = 1
                timeTmp && clearTimeout(timeTmp)
              })
            }
            img = null
          }
          // 一次性操作
          observer.unobserve(el)
          el.patpatBgLazy = null
        }
      })
    }, { threshold: [0.6, 1.0] })
    observer.observe(el)
    el.patpatBgLazy = {
      observer: observer
    }
  },
  unbind (el) {
    const target = el.patpatBgLazy
    if (!target) {
      return
    }
    const { observer } = target
    if (observer) {
      observer.unobserve(el)
    }
  }
}

// 无限滚动
export const patpatInfiniteScroll = {
  inserted: function (el, binding) {
    const scrollDom = getScroller(el)
    function scrollHandle () {
      let triggerScroll = false
      if (el === scrollDom) {
        const scrollBottom = scrollDom.scrollTop + getClientHeight(scrollDom)
        triggerScroll = scrollDom.scrollHeight - scrollBottom <= 0
      } else {
        const scrollDomTop = scrollDom === window ? 0 : getElementTop(scrollDom)
        const heightBelowTop = getOffsetHeight(el) + getElementTop(el) - scrollDomTop
        const offsetHeight = getClientHeight(scrollDom)
        triggerScroll = heightBelowTop - offsetHeight <= 0
      }
      if (triggerScroll) {
        binding.value()
      }
    }
    el['pat-part-infinite-scroll'] = {
      container: scrollDom,
      onScroll: scrollHandle
    }
    scrollDom.addEventListener('scroll', scrollHandle)
  },
  unbind (el) {
    const { container, onScroll } = el['pat-part-infinite-scroll']
    if (container) {
      container.removeEventListener('scroll', onScroll)
    }
  }
}

// 曝光监听
export const patpatExposure = {
  inserted: function (el, binding) {
    // check the element is tracked or not
    const isTracked = el.getAttribute('track')
    if (isTracked !== 'unTrack') {
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          if (typeof binding.value === 'function') {
            binding.value(el)
            // 一次性操作
            observer.unobserve(el)
            el.patpatExposure = null
          }
        }
      })
    }, { threshold: [0.6, 1.0] })
    observer.observe(el)
    el.patpatExposure = {
      observer: observer
    }
  },
  unbind (el) {
    const target = el.patpatExposure
    if (!target) {
      return
    }
    const { observer } = target
    if (observer) {
      observer.unobserve(el)
    }
  }
}

// 登录注册 input 获取失去焦点指令
export const focus = {
  inserted: function (el) {
    el.onfocus = () => {
      event.target.parentNode.classList.add('to')
    }
    el.onblur = () => {
      if (!el.value) {
        event.target.parentNode.classList.remove('to')
      }
    }
  }
}
