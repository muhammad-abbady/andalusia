/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";

export class Brush {
  public constructor(
    public readonly foreground: string,
    public readonly lineWidth: number,
    public readonly background: string,
    public readonly isPencil: boolean,
  ) {
    this.verifyColorValue(foreground);
    this.verifyColorValue(background);
  }

  public applyTo(shape: Two.Object): void {
    shape.stroke = this.foreground;
    shape.linewidth = this.lineWidth;
    shape.fill = this.background;
  }

  private verifyColorValue(value: string): void {
    if (!/(#[0-9A-F]{6})([0-9A-F]{2})?/.test(value)) {
      throw new Error(`The color value ${value} is not formatted correctly.`);
    }
  }
}

export const highlightBrush = new Brush("#FF0000", 3, "#FFC0CB", true);
export const pencilBrush = new Brush("#CCCCCC", 1, "#00000000", true);

export const blankBrush = new Brush("#FFFFFF", 0, "#FFFFFF", false);
export const borderBrush = new Brush("#2CA8FF", 2, "#00000000", false);

export const primaryColor = new Brush("#00000000", 0, "#111111", false);
export const secondaryColor = new Brush("#00000000", 0, "#777777", false);
export const shadeColor = new Brush("#00000000", 0, "#C8C8C8", false);
