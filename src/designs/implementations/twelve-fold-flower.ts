/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush, highlightCircleBrush } from "../brushes";
import {
  intersectionBetweenTwoLines,
  intersectionBetweenLineAndCircle,
  distanceBetweenTwoPoints,
  intersectionBetweenTwoCircles,
  rotatePoint,
} from "../utils";

// Source: https://www.youtube.com/watch?v=mCCWntbIHf0
export class TwelveFoldFlowerDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();

    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      6,
      90 / 3,
      [new Two.Vector(center.x, 0), new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const innerCircleDiagonal = await this.drawLine(diagonals[0].vertices[0], diagonals[3].vertices[0], pencilBrush);
    const innerCircleMarkerPosition = intersectionBetweenTwoLines(diagonals[1], innerCircleDiagonal);
    const innerCircleMarker = await this.drawCircle(innerCircleMarkerPosition, 5, highlightCircleBrush);
    const innerCircleRadius = distanceBetweenTwoPoints(center, innerCircleMarkerPosition);
    const innerCircle = await this.drawCircle(center, innerCircleRadius, pencilBrush);

    this.removeAndUpdate(innerCircleDiagonal, innerCircleMarker);

    const intersectionWithInnerCircle = intersectionBetweenLineAndCircle(
      diagonals[3].vertices[0],
      diagonals[3].vertices[1],
      center,
      innerCircleRadius,
    )[0];

    const innerCurves = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [intersectionWithInnerCircle, diagonals[5].vertices[0], diagonals[1].vertices[0]],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, pencilBrush),
    );

    const blueCurve1Start = intersectionBetweenTwoCircles(
      intersectionWithInnerCircle,
      distanceBetweenTwoPoints(intersectionWithInnerCircle, diagonals[5].vertices[0]),
      rotatePoint(intersectionWithInnerCircle, center, (4 * 90) / 3),
      distanceBetweenTwoPoints(intersectionWithInnerCircle, diagonals[5].vertices[0]),
    )[0];

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [intersectionWithInnerCircle, blueCurve1Start, diagonals[1].vertices[0]],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, mainBorderBrush),
    );

    const blueCurve2Start = new Two.Vector(blueCurve1Start.x, 2 * radius - blueCurve1Start.y);

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [intersectionWithInnerCircle, diagonals[5].vertices[0], blueCurve2Start],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, innerCircle, ...innerCurves);
  }
}
