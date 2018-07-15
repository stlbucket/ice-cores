// vue.config.js
module.exports = {
  lintOnSave: true,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: 'http://localhost:3000',
    before: app => {
      // app is an express instance
    }
  }
}
