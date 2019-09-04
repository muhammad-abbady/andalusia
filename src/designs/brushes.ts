/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";

export class Brush {
  public constructor(
    private readonly opacity: number,
    private readonly foreground: Two.Color,
    private readonly lineWidth: number,
    private readonly background: Two.Color,
  ) {}

  public applyTo(shape: Two.Path): void {
    shape.opacity = this.opacity;
    shape.stroke = this.foreground;
    shape.linewidth = this.lineWidth;
    shape.fill = this.background;
  }
}

export const highlightCircleBrush = new Brush(0.8, "red", 3, "pink");
export const pencilBrush = new Brush(0.3, "black", 1, "transparent");
export const mainBorderBrush = new Brush(1, "#2ca8ff", 2, "transparent");
