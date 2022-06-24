const CracoLessPlugin = require("craco-less");
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  webpack: {
    alias: {
      "@": resolve("src"),
      components: resolve("src/components"),
    },
    configure(webpackConfig,{env,paths}){
      // 修改build的生成文件名称
      // paths.appBuild = 'dist';
      webpackConfig.output ={
        ...webpackConfig.output,
        // path:path.resolve(__dirname,'dist'),
        publicPath:'/pdf-preview/build'
      }
      return webpackConfig;
    }
  },
  plugins: [{ plugin: CracoLessPlugin }]
};
