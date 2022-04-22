const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    ['##']: path.resolve(__dirname, 'src'),
    ['#C']: path.resolve(__dirname, 'src/comps'),
    ['#H']: path.resolve(__dirname, 'src/hooks'),
    ['#F']: path.resolve(__dirname, 'src/funcs'),
    ['#L']: path.resolve(__dirname, 'src/layout'),
    ['#P']: path.resolve(__dirname, 'src/pages'),
    ['#R']: path.resolve(__dirname, 'src/reducers'),
  })
)
