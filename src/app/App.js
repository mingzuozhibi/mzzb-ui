import React from "react";
import {render} from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Master from "./Master";
import Home from "./pages/Home";
import Sakura from "./pages/Sakura";
import DiscList from "./pages/DiscList";
import MyStared from "./pages/MyStared";
import Setting from "./pages/Setting";
import About from "./pages/About";

injectTapEventPlugin();

render((
  <Router history={hashHistory}>
    <Route path="/" component={Master}>
      <IndexRoute component={Home}/>
      <Route path="home" component={Home}/>
      <Route path="sakura" component={Sakura}/>
      <Route path="disclist" component={DiscList}/>
      <Route path="mystared" component={MyStared}/>
      <Route path="setting" component={Setting}/>
      <Route path="about" component={About}/>
    </Route>
  </Router>
), document.getElementById('app'));
