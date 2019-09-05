/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, highlightCircleBrush, mainBorderBrush } from "../brushes";
import { rotatePoint, intersectionBetweenLines, intersectionWithCircle, distanceBetweenTwoPoints } from "../utils";

export class TwentyFoldStarDesign extends BaseDesign {
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
      10,
      90 / 5,
      pencilBrush,
      new Two.Vector(center.x, margin),
      new Two.Vector(center.x, this.scene.height - margin),
    );

    const outerPentagonEdges = await this.drawLinesAround(
      center,
      20,
      90 / 5,
      pencilBrush,
      new Two.Vector(center.x, margin),
      rotatePoint(new Two.Vector(center.x, margin), center, 4 * (90 / 5)),
    );

    const pentagonIntersection = intersectionBetweenLines(outerPentagonEdges[0], outerPentagonEdges[17]);
    const pentagonIntersectionWithCircle = intersectionWithCircle(
      pentagonIntersection,
      rotatePoint(pentagonIntersection, center, 180),
      center,
      radius,
    );

    const midDiagonals = await this.drawLinesAround(
      center,
      10,
      90 / 5,
      pencilBrush,
      pentagonIntersectionWithCircle[0],
      pentagonIntersectionWithCircle[1],
    );

    const markerLine = await this.drawLine(
      pentagonIntersectionWithCircle[0],
      rotatePoint(pentagonIntersectionWithCircle[0], center, 270 - 90 / 5),
      pencilBrush,
    );

    const markerPosition = intersectionBetweenLines(markerLine, midDiagonals[9]);
    const marker = await this.drawCircle(markerPosition, 5, highlightCircleBrush);

    this.scene.remove(markerLine);
    this.scene.update();

    const innerCircle = await this.drawCircle(center, distanceBetweenTwoPoints(center, markerPosition), pencilBrush);

    this.scene.remove(marker);
    this.scene.update();

    const firstTranslatedLine = intersectionWithCircle(
      rotatePoint(markerPosition, center, -(90 / 10)),
      rotatePoint(markerPosition, center, 180 + 90 / 10),
      center,
      radius,
    );

    const allTranslatedLines = await this.drawLinesAround(
      center,
      20,
      90 / 5,
      pencilBrush,
      firstTranslatedLine[0],
      firstTranslatedLine[1],
    );

    // Outer blue edges
    await this.drawLinesAround(
      center,
      20,
      90 / 5,
      mainBorderBrush,
      diagonals[0].vertices[0],
      intersectionBetweenLines(allTranslatedLines[12], outerPentagonEdges[0]),
    );

    await this.drawLinesAround(
      center,
      20,
      90 / 5,
      mainBorderBrush,
      intersectionBetweenLines(allTranslatedLines[3], outerPentagonEdges[0]),
      outerPentagonEdges[0].vertices[1],
    );

    // Inner blue edges
    await this.drawLinesAround(
      center,
      20,
      90 / 5,
      mainBorderBrush,
      intersectionBetweenLines(allTranslatedLines[6], allTranslatedLines[12]),
      intersectionBetweenLines(allTranslatedLines[12], outerPentagonEdges[0]),
    );

    await this.drawLinesAround(
      center,
      20,
      90 / 5,
      mainBorderBrush,
      rotatePoint(intersectionBetweenLines(allTranslatedLines[6], allTranslatedLines[12]), center, 17 * (90 / 5)),
      intersectionBetweenLines(allTranslatedLines[3], outerPentagonEdges[0]),
    );

    this.scene.remove(
      outerCircle,
      ...diagonals,
      ...outerPentagonEdges,
      ...midDiagonals,
      innerCircle,
      ...allTranslatedLines,
    );
    this.scene.update();
  }
}
