import React from "react";
import {render} from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Master from "./Master";
import Home from "./pages/Home";
import Sakura from "./pages/Sakura";
import DiscList from "./pages/DiscList";
import Favourite from "./pages/Favourite";
import Configuration from "./pages/Configuration";

injectTapEventPlugin();

render((
  <Router history={hashHistory}>
    <Route path="/" component={Master}>
      <IndexRoute component={Home}/>
      <Route path="home" component={Home}/>
      <Route path="sakura" component={Sakura}/>
      <Route path="disclist" component={DiscList}/>
      <Route path="favourite" component={Favourite}/>
      <Route path="configuration" component={Configuration}/>
    </Route>
  </Router>
), document.getElementById('app'));
