const isDev = process.env.NODE_ENV === 'development'
const renderer = require('../renderer/index')

module.exports.vueRender = (req, res) => {
  if (isDev) {
    renderer.getDevReadyPromise().then(() => {
      renderer.render(req, res)
    })
  } else {
    renderer.render(req, res)
  }
}
