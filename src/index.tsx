/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import * as ReactDOM from "react-dom";
import { HomePageComponent } from "./pages/home";
import { BrowsePageComponent } from "./pages/browse";
import { Route, Switch, HashRouter } from "react-router-dom";
import { ViewPageComponent } from "./pages/view";
import { factories } from "./designs/factories";

// Import assets
import "../assets/scss/styles.scss";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/browse/" component={BrowsePageComponent} />
      {factories.map((factory, i) => (
        <Route key={i} path={factory.url} component={() => <ViewPageComponent factory={factory} />} />
      ))}
      <Route component={HomePageComponent} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
