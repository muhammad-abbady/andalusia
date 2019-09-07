/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";

export class Brush {
  public constructor(
    public readonly opacity: number,
    public readonly foreground: Two.Color,
    public readonly lineWidth: number,
    public readonly background: Two.Color,
    public readonly isPencil: boolean,
  ) {}

  public applyTo(shape: Two.Object): void {
    shape.opacity = this.opacity;
    shape.stroke = this.foreground;
    shape.linewidth = this.lineWidth;
    shape.fill = this.background;
  }
}

export const highlightCircleBrush = new Brush(0.8, "red", 3, "pink", true);
export const pencilBrush = new Brush(0.3, "black", 1, "transparent", true);

export const mainBorderBrush = new Brush(1, "#2ca8ff", 2, "transparent", false);
export const blankBrush = new Brush(1, "white", 0, "white", false);
