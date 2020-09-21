const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
// const webpackNodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  entry: './src/entry-server.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: [/\.css$/]
  }),
  optimization: {
    splitChunks: false
  },
  // This is the plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [
    new webpack.DefinePlugin({
      'process.env.TARGET_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ],
  resolve: {
    alias: {
      $api: path.resolve(__dirname, './src/api/create-server.js')
    }
  }
}
