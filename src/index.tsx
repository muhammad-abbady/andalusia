/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Home } from "./pages/home";
import { Route, Switch, Redirect, HashRouter } from "react-router-dom";

// Import assets
import "../assets/scss/styles.scss";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Switch>
        <Route path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
