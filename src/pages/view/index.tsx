/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import {
  Container,
  Row,
  Nav,
  NavLink,
  NavItem,
  Navbar,
  NavbarBrand,
  Collapse,
  Col,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import { DesignCardComponent } from "../../components/design-card";
import { AnimationSpeedPopoverComponent } from "../../components/animation-speed-popover";
import { DesignFactory } from "../../designs/factories";

interface ViewPageComponentProps {
  readonly factory: DesignFactory;
}

interface ViewPageComponentState {
  readonly speed: number;
}

export class ViewPageComponent extends React.Component<ViewPageComponentProps, ViewPageComponentState> {
  public constructor(props: ViewPageComponentProps) {
    super(props);

    this.state = {
      speed: 50,
    };
  }

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
                    <NavLink href="#/browse/">
                      <i className="fas fa-chevron-left fa-2x" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={() => this.forceUpdate()}>
                      <i className="fas fa-redo fa-2x" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink id="animation-speed-button">
                      <i className="fas fa-tachometer-alt fa-2x" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="https://github.com/omartawfik/andalusia" target="_blank" rel="noreferrer noopener">
                      <i className="fab fa-github fa-2x" />
                    </NavLink>
                  </NavItem>
                </Nav>
                <UncontrolledPopover placement="bottom" target="animation-speed-button">
                  <PopoverHeader>Animation Speed</PopoverHeader>
                  <PopoverBody>
                    <AnimationSpeedPopoverComponent
                      value={50}
                      min={1}
                      max={100}
                      step={1}
                      onChange={speed => this.setState({ speed })}
                    />
                  </PopoverBody>
                </UncontrolledPopover>
              </Collapse>
            </Container>
          </Navbar>
          <div className="section">
            <Container className="view-page-container">
              <Row>
                <Col className="ml-auto mr-auto" xs="12" sm="12" md="12" lg="12">
                  <DesignCardComponent factory={this.props.factory} speed={this.state.speed} />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
