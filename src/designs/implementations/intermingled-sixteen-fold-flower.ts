/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, borderBrush } from "../brushes";
import {
  intersectionBetweenLineAndCircle,
  rotatePoint,
  intersectionBetweenTwoCircles,
  distanceBetweenTwoPoints,
} from "../utils";

// Source: https://www.youtube.com/watch?v=KnBX5E7gRIY
export class IntermingledSixteenFoldFlowerDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();

    // Margin for the stem ends
    const radius = Math.min(center.x, center.y) * 0.9;
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const topPoint = new Two.Vector(center.x, center.y - radius);
    const bottomPoint = new Two.Vector(center.x, center.y + radius);
    const rightPoint = new Two.Vector(center.x + radius, center.y);

    const diagonals = await this.drawWithRotatingPoint(center, 8, 90 / 4, [topPoint, bottomPoint], ([rFrom, rTo]) =>
      this.drawLine(rFrom, rTo, pencilBrush),
    );

    const stemAngles = 4;
    const innerCurveRadius = distanceBetweenTwoPoints(rightPoint, bottomPoint);
    const outerCurveRadius = distanceBetweenTwoPoints(rightPoint, rotatePoint(bottomPoint, center, stemAngles));

    const [outerCurveTo, outerCurveFrom] = intersectionBetweenLineAndCircle(
      topPoint,
      bottomPoint,
      rightPoint,
      outerCurveRadius,
    );

    const innerCurves = await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [rightPoint, bottomPoint, topPoint],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, pencilBrush),
    );

    const outerCurves = await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [rightPoint, outerCurveFrom, outerCurveTo],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (2 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          innerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (8 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          innerCurveRadius,
        )[1],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (7 * 90) / 4),
        intersectionBetweenTwoCircles(
          rightPoint,
          innerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          innerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          innerCurveRadius,
        )[0],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (2 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          outerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          outerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (8 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          outerCurveRadius,
        )[1],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (7 * 90) / 4),
        intersectionBetweenTwoCircles(
          rightPoint,
          innerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          outerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          outerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          outerCurveRadius,
        )[0],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (2 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (8 * 90) / 4),
          outerCurveRadius,
        )[0],
        rotatePoint(topPoint, center, (2 * 90) / 4),
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (2 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          outerCurveRadius,
          rotatePoint(rightPoint, center, (8 * 90) / 4),
          outerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (2 * 90) / 4),
          outerCurveRadius,
          rotatePoint(rightPoint, center, (10 * 90) / 4),
          outerCurveRadius,
        )[0],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (7 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (15 * 90) / 4),
          innerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          innerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rightPoint,
          outerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          innerCurveRadius,
        )[0],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [
        rotatePoint(rightPoint, center, (7 * 90) / 4),
        intersectionBetweenTwoCircles(
          rotatePoint(rightPoint, center, (15 * 90) / 4),
          outerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          outerCurveRadius,
        )[0],
        intersectionBetweenTwoCircles(
          rightPoint,
          outerCurveRadius,
          rotatePoint(rightPoint, center, (7 * 90) / 4),
          outerCurveRadius,
        )[0],
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, borderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, ...innerCurves, ...outerCurves);
  }
}
