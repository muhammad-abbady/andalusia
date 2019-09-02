/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Container, Row, Nav, NavLink, NavItem, Navbar, NavbarBrand, Collapse } from "reactstrap";
import { DesignsCollection } from "../../designs/collection";
import { DesignCardComponent } from "./design-card";

export class BrowsePageComponent extends React.Component {
  public render(): React.ReactElement {
    return (
      <div className="inner-page">
        <div className="wrapper">
          <Navbar className="bg-info" expand={true}>
            <Container>
              <NavbarBrand href="/">Andalusia</NavbarBrand>
              <Collapse isOpen={false} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink href="https://github.com/omartawfik/andalusia" target="_blank" rel="noreferrer noopener">
                      <i className="fab fa-github fa-2x" />
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
          <div className="section">
            <Container>
              <Row>
                {DesignsCollection.map((design, i) => (
                  <DesignCardComponent key={i} design={design} />
                ))}
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
