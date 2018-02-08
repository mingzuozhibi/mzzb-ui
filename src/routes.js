import React from 'react'
import {Redirect, Route, Switch} from 'react-router'
import menu from './common/menu'

export default (
  <Switch>
    <Redirect exact path='/' to='/home'/>
    {menu.map(item => (
      item.hasSub ? item.subItems.map(renderRoute) : renderRoute(item)
    ))}
    <Redirect exact path='*' to='/404'/>
  </Switch>
)

function renderRoute(item) {
  return (
    <Route key={item.path} path={item.path} component={item.component}/>
  )
}
