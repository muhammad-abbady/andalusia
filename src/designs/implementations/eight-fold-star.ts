/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import {
  intersectionBetweenTwoLines,
  intersectionBetweenLineAndCircle,
  distanceBetweenTwoPoints,
  rotatePoint,
} from "../utils";

// Source: https://www.youtube.com/watch?v=fXM8jSGFz0g
export class EightFoldStarDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      4,
      45,
      [new Two.Vector(center.x, 0), new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const octagon = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [diagonals[0].vertices[0], diagonals[1].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const squares = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [diagonals[0].vertices[0], new Two.Vector(this.scene.width, center.y)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const measurementLine = await this.drawLine(
      intersectionBetweenTwoLines(squares[0], diagonals[1]),
      new Two.Vector(0, center.y),
      pencilBrush,
    );

    const innerCircleTopPoint = intersectionBetweenTwoLines(diagonals[0], measurementLine);
    const innerCircleMarker = this.drawMarker(innerCircleTopPoint);

    const innerCircleRadius = distanceBetweenTwoPoints(center, innerCircleTopPoint);
    const innerCircle = await this.drawCircle(center, innerCircleRadius, pencilBrush);

    this.removeAndUpdate(measurementLine, innerCircleMarker);

    const translatedLines = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      intersectionBetweenLineAndCircle(
        rotatePoint(innerCircleTopPoint, center, 45),
        rotatePoint(innerCircleTopPoint, center, 135),
        center,
        radius,
      ),
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [diagonals[0].vertices[0], intersectionBetweenTwoLines(translatedLines[0], octagon[0])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [diagonals[0].vertices[0], intersectionBetweenTwoLines(translatedLines[4], octagon[7])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [
        intersectionBetweenTwoLines(translatedLines[0], octagon[0]),
        intersectionBetweenTwoLines(translatedLines[0], translatedLines[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [
        intersectionBetweenTwoLines(translatedLines[0], octagon[3]),
        intersectionBetweenTwoLines(translatedLines[0], translatedLines[1]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, ...octagon, ...squares, innerCircle, ...translatedLines);
  }
}
