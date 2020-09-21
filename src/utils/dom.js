// 获取最近的滚动node
export function getScroller (node, root = window) {
  const overflowScrollReg = /scroll|auto/i
  while (
    node &&
    node.tagName !== 'HTML' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    // 处理为window的情况
    if ([window, document, document.documentElement].includes(node)) {
      return window
    }
    const { overflowY } = window.getComputedStyle(node)

    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node
      }
      // body有滚动属性，html必须也要有滚动属性，body的滚动属性才会生效
      const { overflowY: htmlOverflowY } = window.getComputedStyle(
        node.parentNode
      )

      if (overflowScrollReg.test(htmlOverflowY)) {
        return node
      }
    }
    node = node.parentNode
  }

  return root
}

export const getElementTop = el => {
  return el === window ? 0 : el.getBoundingClientRect().top
}

export const getPositionSize = (el, prop) => {
  return el === window || el === document
    ? document.documentElement[prop]
    : el[prop]
}

export const getOffsetHeight = el => {
  return getPositionSize(el, 'offsetHeight')
}

export const getClientHeight = el => {
  return getPositionSize(el, 'clientHeight')
}

// 解决遮罩层滚动穿透问题，分别在遮罩层弹出后和关闭前调用
export const ModalHelper = ((bodyCls) => {
  let scrollTop
  let isOpen = false
  return {
    afterOpen: function () {
      if (!isOpen) { // 防止多次连续调用出现错乱
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.classList.add(bodyCls)
        document.body.style.top = -scrollTop + 'px'
        isOpen = true
      }
    },
    beforeClose: function () {
      isOpen = false
      document.body.classList.remove(bodyCls)
      document.body.style.top = null
      if (document.documentElement) {
        document.documentElement.scrollTop = scrollTop
      }
      if (document.body) {
        document.body.scrollTop = scrollTop
      }
    }
  }
})('no-scroll')
