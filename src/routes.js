import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router'
import Home from './components/Home'

export default (
  <Switch>
    <Redirect exact path='/' to='/home'/>
    <Route path='/home' component={Home}/>
    <Route path='/sakura' component={asyncComponent(() => import('./components/Sakura'))}/>
  </Switch>
)

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor() {
      super()

      this.state = {
        component: null
      }
    }

    async componentDidMount() {
      const {default: component} = await importComponent()

      this.setState({
        component: component
      })
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : <h3>Loading...</h3>
    }
  }

  return AsyncComponent
}
