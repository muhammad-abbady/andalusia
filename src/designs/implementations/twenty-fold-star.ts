/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, highlightCircleBrush, mainBorderBrush } from "../brushes";
import {
  rotatePoint,
  intersectionBetweenTwoLines,
  intersectionBetweenLineAndCircle,
  distanceBetweenTwoPoints,
} from "../utils";

// Source: https://www.youtube.com/watch?v=Pl07JqrTL-c
export class TwentyFoldStarDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();

    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const topCenterPoint = new Two.Vector(center.x, 0);
    const diagonals = await this.drawWithRotatingPoint(
      center,
      10,
      90 / 5,
      [topCenterPoint, new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const outerPentagonEdges = await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [topCenterPoint, rotatePoint(topCenterPoint, center, 4 * (90 / 5))],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const pentagonIntersection = intersectionBetweenTwoLines(outerPentagonEdges[0], outerPentagonEdges[17]);
    const pentagonIntersectionWithCircle = intersectionBetweenLineAndCircle(
      pentagonIntersection,
      rotatePoint(pentagonIntersection, center, 180),
      center,
      radius,
    );

    const midDiagonals = await this.drawWithRotatingPoint(
      center,
      10,
      90 / 5,
      [pentagonIntersectionWithCircle[0], pentagonIntersectionWithCircle[1]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const markerLine = await this.drawLine(
      pentagonIntersectionWithCircle[0],
      rotatePoint(pentagonIntersectionWithCircle[0], center, 270 - 90 / 5),
      pencilBrush,
    );

    const markerPosition = intersectionBetweenTwoLines(markerLine, midDiagonals[9]);
    const marker = await this.drawCircle(markerPosition, 5, highlightCircleBrush);

    this.removeAndUpdate(markerLine);

    const innerCircle = await this.drawCircle(center, distanceBetweenTwoPoints(center, markerPosition), pencilBrush);

    this.removeAndUpdate(marker);

    const firstTranslatedLine = intersectionBetweenLineAndCircle(
      rotatePoint(markerPosition, center, -(90 / 10)),
      rotatePoint(markerPosition, center, 180 + 90 / 10),
      center,
      radius,
    );

    const allTranslatedLines = await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [firstTranslatedLine[0], firstTranslatedLine[1]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [diagonals[0].vertices[0], intersectionBetweenTwoLines(allTranslatedLines[12], outerPentagonEdges[0])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [intersectionBetweenTwoLines(allTranslatedLines[3], outerPentagonEdges[0]), outerPentagonEdges[0].vertices[1]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [
        intersectionBetweenTwoLines(allTranslatedLines[6], allTranslatedLines[12]),
        intersectionBetweenTwoLines(allTranslatedLines[12], outerPentagonEdges[0]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      20,
      90 / 5,
      [
        rotatePoint(intersectionBetweenTwoLines(allTranslatedLines[6], allTranslatedLines[12]), center, 17 * (90 / 5)),
        intersectionBetweenTwoLines(allTranslatedLines[3], outerPentagonEdges[0]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(
      outerCircle,
      ...diagonals,
      ...outerPentagonEdges,
      ...midDiagonals,
      innerCircle,
      ...allTranslatedLines,
    );
  }
}
