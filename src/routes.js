import React from 'react'
import {Redirect, Route, Switch} from 'react-router'
import menu from './common/menu'

export default (
  <Switch>
    <Redirect exact path='/' to='/home'/>
    {menu.map(m => (
      <Route key={m.path} path={m.path} component={m.component}/>
    ))}
  </Switch>
)
