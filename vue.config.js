const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["quasar"],
  publicPath: "/",

  // publicPath: process.env.NODE_ENV === "production" ? "/crud/" : "/",

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  // devServer: {
  //   compress: true,
  //   disableHostCheck: true,
  // },
});
