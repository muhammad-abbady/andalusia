/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Home } from "./pages/home";
import { Browse } from "./pages/browse";
import { Route, Switch, HashRouter } from "react-router-dom";

// Import assets
import "../assets/scss/styles.scss";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/browse/" component={Browse} />
      <Route component={Home} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
