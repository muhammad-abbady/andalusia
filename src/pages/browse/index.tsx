/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Container, Row, Nav, NavLink, NavItem, Navbar, NavbarBrand, Collapse, Col } from "reactstrap";
import { DesignsCollection } from "../../designs/collection";
import { DesignCardComponent } from "../../components/design-card";
import { Link } from "react-router-dom";

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
                  <Col key={i} className="pull-left" xs="12" sm="6" md="6" lg="3">
                    <Link to={design.url}>
                      <DesignCardComponent design={design} speed={100} />
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
