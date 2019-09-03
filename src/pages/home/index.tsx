/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Container, Button } from "reactstrap";
import { Link } from "react-router-dom";

export class HomePageComponent extends React.Component {
  public render(): React.ReactElement {
    return (
      <div className="index-page">
        <div className="wrapper">
          <div className="page-header">
            <div className="page-header-image home-background-image"></div>
            <Container fluid>
              <div className="content-center brand">
                <h1 className="h1-seo">Andalusia</h1>
                <h3>Beautiful works of art based on ancient geometry.</h3>
                <span className="home-page-buttons">
                  <Link to="/browse/">
                    <Button color="primary" size="md">
                      <i className="fas fa-drafting-compass fa-2x" />
                      <span>Browse</span>
                    </Button>
                  </Link>
                  <a href="https://github.com/omartawfik/andalusia" target="_blank" rel="noreferrer noopener">
                    <Button color="primary" size="md">
                      <i className="fab fa-github fa-2x" />
                      <span>GitHub</span>
                    </Button>
                  </a>
                </span>
              </div>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
