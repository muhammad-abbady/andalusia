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

const ANIMATION_SPEED_DEFAULT_VALUE = 50;
const ANIMATION_SPEED_STORAGE_KEY = "andalusia/viewPage/animationSpeed";

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
      speed: this.loadSpeed(),
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
                <UncontrolledPopover trigger="legacy" placement="bottom" target="animation-speed-button">
                  <PopoverHeader>Animation Speed</PopoverHeader>
                  <PopoverBody>
                    <AnimationSpeedPopoverComponent
                      value={this.state.speed}
                      min={1}
                      max={100}
                      step={1}
                      onChange={speed => this.saveSpeed(speed)}
                    />
                  </PopoverBody>
                </UncontrolledPopover>
              </Collapse>
            </Container>
          </Navbar>
          <Container className="view-page-container">
            <Row>
              <Col className="ml-auto mr-auto" xs="12" sm="12" md="12" lg="12">
                <DesignCardComponent factory={this.props.factory} speed={this.state.speed} shouldAnimate={true} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  private loadSpeed(): number {
    const value = window.localStorage.getItem(ANIMATION_SPEED_STORAGE_KEY);
    if (value) {
      return parseInt(value);
    }

    this.saveSpeed(ANIMATION_SPEED_DEFAULT_VALUE);
    return ANIMATION_SPEED_DEFAULT_VALUE;
  }

  private saveSpeed(value: number): void {
    window.localStorage.setItem(ANIMATION_SPEED_STORAGE_KEY, value.toString());
    this.setState({ speed: value });
  }
}
