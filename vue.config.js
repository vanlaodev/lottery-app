module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "郵電局晚宴抽獎程式";
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
    },
  },
};
