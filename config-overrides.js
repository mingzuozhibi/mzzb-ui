// noinspection JSUnresolvedFunction
const {injectBabelPlugin} = require('react-app-rewired')

// noinspection JSUnresolvedVariable
module.exports = function override(config, env) {
  const pluginName = ['import', {
    libraryName: 'antd', libraryDirectory: 'es', style: 'css'
  }]
  return injectBabelPlugin(pluginName, config)
}
