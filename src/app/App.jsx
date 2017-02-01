import React from "react";
import {render} from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Master from "./Master.jsx";
import Home from "./pages/Home.jsx";
import Sakura from "./pages/Sakura.jsx";
import DiscList from "./pages/DiscList.jsx";
import MyStared from "./pages/MyStared.jsx";
import Setting from "./pages/Setting.jsx";
import About from "./pages/About.jsx";

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
