/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import { intersectionBetweenTwoLines, intersectionBetweenLineAndCircle } from "../utils";

export class TwelveFoldStarDesign extends BaseDesign {
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

    const squares = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], diagonals[3].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const hexagons = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], diagonals[2].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const translatedLineP1 = intersectionBetweenTwoLines(squares[0], squares[10]);
    const translatedLineP2 = intersectionBetweenTwoLines(squares[3], squares[5]);
    const translatedLineIntersectionWithCircle = intersectionBetweenLineAndCircle(
      translatedLineP1,
      translatedLineP2,
      center,
      radius,
    );

    const translatedLines = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [translatedLineIntersectionWithCircle[0], translatedLineIntersectionWithCircle[1]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], intersectionBetweenTwoLines(translatedLines[0], hexagons[0])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], intersectionBetweenTwoLines(translatedLines[6], hexagons[10])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [
        intersectionBetweenTwoLines(translatedLines[0], hexagons[0]),
        intersectionBetweenTwoLines(translatedLines[0], translatedLines[10]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [
        intersectionBetweenTwoLines(translatedLines[6], hexagons[10]),
        intersectionBetweenTwoLines(diagonals[4], translatedLines[6]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, ...squares, ...hexagons, ...translatedLines);
  }
}
