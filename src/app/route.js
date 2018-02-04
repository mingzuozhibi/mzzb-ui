import React, {Component} from 'react'
import {IndexRoute, Route} from 'react-router'
import App from './App'
import Home from './page/Home'

const route = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="home" component={Home}/>
    <Route path="sakura" component={asyncComponent(() => import('./page/Sakura'))}/>
  </Route>
)

export default route

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)

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
