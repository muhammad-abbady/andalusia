/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import { distanceBetweenTwoPoints, intersectionBetweenTwoCircles, rotatePoint } from "../utils";

// Source: https://www.youtube.com/watch?v=Vm487exe_Pc
export class ThirtyTwoFoldFlowerDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();

    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      16,
      90 / 8,
      [new Two.Vector(center.x, 0), new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const squares = await this.drawWithRotatingPoint(
      center,
      16,
      90 / 4,
      [diagonals[0].vertices[0], diagonals[8].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const curve1Center = new Two.Vector(radius * 2, radius);
    const curve1From = new Two.Vector(radius, radius * 2);
    const curve1To = new Two.Vector(radius, 0);
    const curve1Radius = distanceBetweenTwoPoints(curve1Center, curve1From);

    const curves = await this.drawWithRotatingPoint(
      center,
      32,
      90 / 8,
      [curve1Center, curve1From, curve1To],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, pencilBrush),
    );

    const innerCircleRadius = distanceBetweenTwoPoints(
      intersectionBetweenTwoCircles(
        rotatePoint(curve1Center, center, (3 * 90) / 8),
        curve1Radius,
        rotatePoint(curve1Center, center, (13 * 90) / 8),
        curve1Radius,
      )[0],
      center,
    );

    const innerCircle = await this.drawCircle(center, innerCircleRadius, pencilBrush);

    const intersectionWithInnerCircle = intersectionBetweenTwoCircles(
      curve1Center,
      curve1Radius,
      center,
      innerCircleRadius,
    )[0];

    await this.drawWithRotatingPoint(
      center,
      32,
      90 / 8,
      [curve1Center, intersectionWithInnerCircle, curve1To],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      32,
      90 / 8,
      [
        curve1Center,
        curve1From,
        new Two.Vector(intersectionWithInnerCircle.x, 2 * radius - intersectionWithInnerCircle.y),
      ],
      ([rCenter, rFrom, rTo]) => this.drawCurve(rCenter, rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, ...squares, ...curves, innerCircle);
  }
}
