const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/entry-client.js',
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.TARGET_ENV': '"client"'
    }),
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin()
    // isProd ? new ExtractTextPlugin({ filename: 'common.[chunkhash].css' }) : null
  ],
  resolve: {
    alias: {
      $api: path.resolve(__dirname, './src/api/create-client.js')
    }
  }
}
