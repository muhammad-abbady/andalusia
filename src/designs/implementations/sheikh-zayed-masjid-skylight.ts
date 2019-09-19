/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import {
  rotatePoint,
  intersectionBetweenTwoLines,
  distanceBetweenTwoPoints,
  intersectionBetweenTwoCircles,
} from "../utils";

export class SheikhZayedMasjidSkylightDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const radius = Math.min(center.x, center.y);
    const topCenterPoint = new Two.Vector(center.x, 0);
    const circle = await this.drawCircle(center, radius, pencilBrush);
    const diagonals = await this.drawWithRotatingPoint(
      center,
      6,
      30,
      [topCenterPoint, rotatePoint(topCenterPoint, center, 180)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const star = await this.drawWithRotatingPoint(
      center,
      6,
      60,
      [diagonals[2].vertices[0], diagonals[4].vertices[1]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const intersectionBetweenStarAndDiagonal = intersectionBetweenTwoLines(diagonals[0], star[0]);
    const someLine = await this.drawLine(
      intersectionBetweenStarAndDiagonal,
      rotatePoint(intersectionBetweenStarAndDiagonal, center, 60),
      pencilBrush,
    );

    const innerCircleReferenceLine = intersectionBetweenTwoLines(someLine, diagonals[1]);
    const innerCircleReferenceMarker = await this.drawMarker(innerCircleReferenceLine);
    const innerCircleRadius = distanceBetweenTwoPoints(center, innerCircleReferenceLine);
    const innerCircle = await this.drawCircle(center, innerCircleRadius, pencilBrush);

    this.removeAndUpdate(innerCircleReferenceMarker);

    const innerCircles = await this.drawWithRotatingPoint(center, 12, 30, [innerCircleReferenceLine], ([centerPoint]) =>
      this.drawCircle(centerPoint, radius - innerCircleRadius, pencilBrush),
    );

    const dodecagon = intersectionBetweenTwoCircles(
      innerCircleReferenceLine,
      radius - innerCircleRadius,
      rotatePoint(innerCircleReferenceLine, center, 30),
      radius - innerCircleRadius,
    );

    await this.drawWithRotatingPoint(
      center,
      12,
      30,
      [dodecagon[1], rotatePoint(dodecagon[1], center, 30)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    const intersectionsBetweenInnerCircles = [];
    for (let i = 1; i <= 12; i++) {
      intersectionsBetweenInnerCircles.push(
        intersectionBetweenTwoCircles(
          innerCircleReferenceLine,
          radius - innerCircleRadius,
          rotatePoint(innerCircleReferenceLine, center, 30 * i),
          radius - innerCircleRadius,
        ),
      );
    }

    await this.drawWithRotatingPoint(center, 12, 30, intersectionsBetweenInnerCircles.map(v => v[1]), async points => {
      const lines = [];
      for (let i = 0; i < 8; i++) {
        lines.push(await this.drawLine(points[i], points[i + 1], mainBorderBrush));
      }

      return lines;
    });

    await this.drawWithRotatingPoint(center, 12, 30, intersectionsBetweenInnerCircles.map(v => v[0]), async points => {
      const lines = [];
      for (let i = 9; i >= 2; i--) {
        lines.push(await this.drawLine(points[i + 1], points[i], mainBorderBrush));
      }

      return lines;
    });

    this.removeAndUpdate(circle, ...diagonals, ...innerCircles, someLine, innerCircle, ...star);
  }
}
