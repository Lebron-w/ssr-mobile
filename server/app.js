const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const appRouter = require('./routes/index')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const fs = require('fs')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { createBundleRenderer } = require('./renderer')
const cookieParser = require('cookie-parser')
const protocol = process.env.PROTOCOL || 'http'
const port = process.env.PORT || 8680

Sentry.init({
  dsn: 'https://498bced137af40b7a141d0de1f800d5f@o446145.ingest.sentry.io/5424082',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use('/api', createProxyMiddleware({
  target: process.env.VUE_APP_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}))

app.use('/trackApi', createProxyMiddleware({
  target: process.env.VUE_APP_TRACK_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/trackApi': ''
  }
}))

app.use(cookieParser())

app.use(express.static('server/public'))

createBundleRenderer(app)

app.use(appRouter)

app.use(Sentry.Handlers.errorHandler())
// 监听服务异常
app.use(function onError (err, req, res, next) {
  console.error(err.stack)
  res.status(500).sendFile(resolve('./renderer/error.html'))
})

if (protocol === 'https') {
  const privateKey = fs.readFileSync('./server/cert/patpat.site+6-key.pem', 'utf8')
  const certificate = fs.readFileSync('./server/cert/patpat.site+6.pem', 'utf8')
  const credentials = { key: privateKey, cert: certificate }
  require(protocol).createServer(credentials, app).listen(port, () => console.log(`\n\n\x1b[42;30m服务启动成功:\x1b[0;32m \x1b[4m${protocol}://localhost:${port}\x1b[0m`))
} else {
  app.listen(port, () => console.log(`\n\n\x1b[42;30m 服务启动成功:\x1b[0;32m \x1b[4m${protocol}://localhost:${port}\x1b[0m`))
}
