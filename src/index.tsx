import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Switch, Redirect, HashRouter } from "react-router-dom";

// Import assets
import "../assets/scss/now-ui-kit.scss";

import Home from "./home";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Switch>
        <Route path="/index" render={() => <Home />} />
        <Redirect to="/index" />
        <Redirect from="/" to="/index" />
      </Switch>
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
