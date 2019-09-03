/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";
import Slider from "nouislider";

interface AnimationSpeedPopoverComponentProps {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly onChange: (value: number) => void;
}

export class AnimationSpeedPopoverComponent extends React.Component<AnimationSpeedPopoverComponentProps> {
  private speedDivRef = React.createRef<HTMLDivElement>();

  public componentDidMount(): void {
    if (!this.speedDivRef.current) {
      throw new Error("Cannot get reference to speed slider div.");
    }

    const slider = Slider.create(this.speedDivRef.current, {
      start: [this.props.value],
      connect: [true, false],
      step: this.props.step,
      range: { min: this.props.min, max: this.props.max },
      behaviour: "tap-drag",
    });

    slider.on("change", () => {
      let value = slider.get();
      if (Array.isArray(value)) {
        value = value[0];
      }

      this.props.onChange(parseInt(value));
    });
  }

  public render(): React.ReactElement {
    return <div className="slider" id="sliderRegular" ref={this.speedDivRef}></div>;
  }
}
