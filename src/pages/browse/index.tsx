/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Container, Row, Col, Nav, NavLink, NavItem, Navbar, NavbarBrand, Collapse, Card, CardBody } from "reactstrap";

export class Browse extends React.Component {
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
                <Col className="ml-auto mr-auto" sm="6" md="4" lg="3">
                  <Card>
                    <CardBody>test</CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
