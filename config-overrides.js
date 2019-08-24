const {override, fixBabelImports} = require('customize-cra')

module.exports = override(
  (config) => {
    config.module.rules.push({
      loader: 'webpack-ant-icon-loader',
      enforce: 'pre',
      include: [
        require.resolve('@ant-design/icons/lib/dist')
      ]
    });
    return config;
  },
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
)
