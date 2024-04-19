const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // assetsDir: "./static",
  transpileDependencies: [
    'quasar'
  ],

  publicPath: process.env.NODE_ENV === 'production'
  ? '/crud/'
  : '/',

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
})
