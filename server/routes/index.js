const express = require('express')
const initMiddleware = require('../middlewares/initMiddleware')
const webMiddleware = require('../middlewares/webMiddleware')
const appController = require('../controllers/appController')
const apiController = require('../controllers/apiController')

const router = express.Router()

// API路由
router.post('/clear-cache/:cacheKey', apiController.clearCache)
router.get('/test/delay', apiController.testDelay)

// 使用中间件
router.use(initMiddleware)
router.use(webMiddleware)

// 网站渲染路由
router.get('/:lang([a-z]{2,2})?', appController.vueRender)
router.get('/:lang([a-z]{2,2})?/*', appController.vueRender)

module.exports = router
