/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { BaseDesign } from "../designs/base-design";
import { CancellationToken } from "../designs/cancellation-token";

interface DesignCardProps {
  readonly design: BaseDesign;
  readonly speed: number;
}

export class DesignCardComponent extends React.Component<DesignCardProps> {
  private token: CancellationToken | undefined;
  private sceneRef = React.createRef<HTMLDivElement>();

  public constructor(props: DesignCardProps) {
    super(props);
    this.refreshScene = this.refreshScene.bind(this);
  }

  public componentDidUpdate(): void {
    this.refreshScene();
  }

  public componentDidMount(): void {
    this.refreshScene();
    window.addEventListener("resize", this.refreshScene);
  }

  public componentWillUnmount(): void {
    this.clearScene();
    window.removeEventListener("resize", this.refreshScene);
  }

  public render(): React.ReactElement {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="title-up" tag="h6">
            {this.props.design.title}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div ref={this.sceneRef} />
        </CardBody>
      </Card>
    );
  }

  private refreshScene(): void {
    if (!this.sceneRef.current) {
      throw new Error("Cannot get a reference to the scene div");
    }

    // Cancel earlier rendering
    this.clearScene();

    // Update height
    const rect = this.sceneRef.current.getBoundingClientRect();
    this.sceneRef.current.style.height = `${rect.width}px`;

    // Start rendering
    this.token = new CancellationToken();
    this.props.design.start(this.sceneRef.current, this.props.speed, this.token);
  }

  private clearScene(): void {
    if (!this.sceneRef.current) {
      throw new Error("Cannot get a reference to the scene div");
    }

    if (this.token) {
      this.token.cancel();
    }

    // Remove existing SVG elements
    this.sceneRef.current.childNodes.forEach(child => {
      child.remove();
    });
  }
}
