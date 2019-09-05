/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import { intersectionBetweenLines, intersectionWithCircle } from "../utils";

// Source: https://www.youtube.com/watch?v=dXiYP-Ps8CQ
export class TwelveFoldStarDesign extends BaseDesign {
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

    const squares = await this.drawLinesAround(
      center,
      12,
      90 / 3,
      pencilBrush,
      diagonals[0].vertices[0],
      diagonals[3].vertices[0],
    );

    const hexagons = await this.drawLinesAround(
      center,
      12,
      90 / 3,
      pencilBrush,
      diagonals[0].vertices[0],
      diagonals[2].vertices[0],
    );

    const translatedLineP1 = intersectionBetweenLines(squares[0], squares[10]);
    const translatedLineP2 = intersectionBetweenLines(squares[3], squares[5]);
    const translatedLineIntersectionWithCircle = intersectionWithCircle(
      translatedLineP1,
      translatedLineP2,
      center,
      radius,
    );

    const translatedLines = await this.drawLinesAround(
      center,
      12,
      90 / 3,
      pencilBrush,
      translatedLineIntersectionWithCircle[0],
      translatedLineIntersectionWithCircle[1],
    );

    await this.drawLinesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      diagonals[0].vertices[0],
      intersectionBetweenLines(translatedLines[0], hexagons[0]),
    );

    await this.drawLinesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      diagonals[0].vertices[0],
      intersectionBetweenLines(translatedLines[6], hexagons[10]),
    );

    await this.drawLinesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      intersectionBetweenLines(translatedLines[0], hexagons[0]),
      intersectionBetweenLines(translatedLines[0], translatedLines[10]),
    );

    await this.drawLinesAround(
      center,
      12,
      90 / 3,
      mainBorderBrush,
      intersectionBetweenLines(translatedLines[6], hexagons[10]),
      intersectionBetweenLines(diagonals[4], translatedLines[6]),
    );

    this.scene.remove(outerCircle, ...diagonals, ...squares, ...hexagons, ...translatedLines);
    this.scene.update();
  }
}
