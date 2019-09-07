/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush, highlightCircleBrush } from "../brushes";
import {
  intersectionBetweenLines,
  intersectionWithCircle,
  distanceBetweenTwoPoints,
  intersectionBetweenCircles,
  rotatePoint,
} from "../utils";

// Source: https://www.youtube.com/watch?v=mCCWntbIHf0
// TODO: remove margin
// TODO: refactor utils and base class
// TODO: checking pencil should be moved to a util, and sleeping should be 0 when in outer page
// TODO: maybe animate circles and curves on path instead with scale
// TODO: maybe instead of removing shapes at the end, base design can remove them automatically based on a tag?
export class TwelveFoldFlowerDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, drawPencil: boolean) {
    super(scene, speed, token, drawPencil);
  }

  public async render(): Promise<void> {
    const margin = 10;
    const center = this.calculateCenterPoint();

    const radius = Math.min(center.x, center.y) - margin;
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const diagonals = await this.drawLinesAround(
      center,
      6,
      90 / 3,
      pencilBrush,
      new Two.Vector(center.x, margin),
      new Two.Vector(center.x, this.scene.height - margin),
    );

    const innerCircleDiagonal = await this.drawLine(diagonals[0].vertices[0], diagonals[3].vertices[0], pencilBrush);
    const innerCircleMarkerPosition = intersectionBetweenLines(diagonals[1], innerCircleDiagonal);
    const innerCircleMarker = await this.drawCircle(innerCircleMarkerPosition, 5, highlightCircleBrush);
    const innerCircleRadius = distanceBetweenTwoPoints(center, innerCircleMarkerPosition);
    const innerCircle = await this.drawCircle(center, innerCircleRadius, pencilBrush);

    this.scene.remove(innerCircleDiagonal, innerCircleMarker);
    this.scene.update();

    const intersectionWithInnerCircle = intersectionWithCircle(
      diagonals[3].vertices[0],
      diagonals[3].vertices[1],
      center,
      innerCircleRadius,
    )[0];

    const innerCurves = await this.drawCurvesAround(
      center,
      12,
      90 / 3,
      pencilBrush,
      intersectionWithInnerCircle,
      diagonals[5].vertices[0],
      diagonals[1].vertices[0],
    );

    const blueCurve1Start = intersectionBetweenCircles(
      intersectionWithInnerCircle,
      distanceBetweenTwoPoints(intersectionWithInnerCircle, diagonals[5].vertices[0]),
      rotatePoint(intersectionWithInnerCircle, center, (4 * 90) / 3),
      distanceBetweenTwoPoints(intersectionWithInnerCircle, diagonals[5].vertices[0]),
    )[0];

    await this.drawCurvesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      intersectionWithInnerCircle,
      blueCurve1Start,
      diagonals[1].vertices[0],
    );

    const blueCurve2Start = new Two.Vector(blueCurve1Start.x, 2 * radius - blueCurve1Start.y + margin * 2);

    await this.drawCurvesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      intersectionWithInnerCircle,
      diagonals[5].vertices[0],
      blueCurve2Start,
    );

    this.scene.remove(outerCircle, ...diagonals, innerCircle, ...innerCurves);
    this.scene.update();
  }
}
