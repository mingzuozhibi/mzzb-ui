const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    ['##']: path.resolve(__dirname, 'src'),
    ['#A']: path.resolve(__dirname, 'src/app'),
    ['#C']: path.resolve(__dirname, 'src/comps'),
    ['#H']: path.resolve(__dirname, 'src/hooks'),
    ['#P']: path.resolve(__dirname, 'src/pages'),
    ['#R']: path.resolve(__dirname, 'src/reducers'),
    ['#U']: path.resolve(__dirname, 'src/utils'),
  })
)
