import React from "react";
import {render} from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Master from "./Master";
import Home from "./pages/Home";

injectTapEventPlugin();

render((
  <Router history={hashHistory}>
    <Route path="/" component={Master}>
      <IndexRoute component={Home}/>
      <Route path="home" component={Home}/>
    </Route>
  </Router>
), document.getElementById('app'));
