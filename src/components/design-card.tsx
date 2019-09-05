/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { CancellationToken, RENDER_CANCELLATION_MESSAGE } from "../designs/cancellation-token";
import { DesignFactory } from "../designs/factories";
import Two from "two.js";

interface DesignCardProps {
  readonly factory: DesignFactory;
  readonly speed: number;
  readonly drawPencil: boolean;
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
            {this.props.factory.title}
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

    // Create scene
    const bounds = this.sceneRef.current.getBoundingClientRect();
    const params: Two.ConstructorParams = {
      width: bounds.width,
      height: bounds.height,
      type: Two.Types.svg,
    };

    this.token = new CancellationToken();
    const scene = new Two(params).appendTo(this.sceneRef.current).bind("update", () => {
      if (this.token) {
        // In case it was cancelled after animation stopped
        this.token.checkForCancellation();
      }
    });

    // Start rendering
    this.props.factory
      .create(scene, this.props.speed, this.token, this.props.drawPencil)
      .render()
      .catch((error: Error) => {
        if (error.message === RENDER_CANCELLATION_MESSAGE) {
          scene.clear();
        } else {
          throw error;
        }
      });
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
