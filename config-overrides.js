const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    ['#CA']: path.resolve(__dirname, 'src/commons/app'),
    ['#CC']: path.resolve(__dirname, 'src/commons/comps'),
    ['#CH']: path.resolve(__dirname, 'src/commons/hooks'),
    ['#CU']: path.resolve(__dirname, 'src/commons/utils'),

    ['#DF']: path.resolve(__dirname, 'src/domains/feats'),
    ['#DT']: path.resolve(__dirname, 'src/domains/types'),
    ['#DU']: path.resolve(__dirname, 'src/domains/utils'),

    ['#RC']: path.resolve(__dirname, 'src/routers/comps'),
    ['#RP']: path.resolve(__dirname, 'src/routers/pages'),
    ['#RU']: path.resolve(__dirname, 'src/routers/utils'),
  })
)
