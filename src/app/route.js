import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Home from './page/Home'
import Sakura from './page/Sakura'

const route = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="home" component={Home}/>
    <Route path="sakura" component={Sakura}/>
  </Route>
)

export default route
