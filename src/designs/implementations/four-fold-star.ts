/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import { rotatePoint, intersectionBetweenTwoLines, intersectionBetweenLineAndCircle } from "../utils";

export class FourFoldStarDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const radius = Math.min(center.x, center.y);
    const circle = await this.drawCircle(center, radius, pencilBrush);
    const topCenterPoint = new Two.Vector(center.x, 0);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      4,
      90 / 2,
      [topCenterPoint, rotatePoint(topCenterPoint, center, 180)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const diagonalsIntersectionsWithCircle = [
      intersectionBetweenLineAndCircle(diagonals[3].vertices[1], diagonals[3].vertices[0], center, radius),
      intersectionBetweenLineAndCircle(diagonals[1].vertices[0], diagonals[1].vertices[1], center, radius),
    ];

    const starGroup = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [topCenterPoint, diagonalsIntersectionsWithCircle[0][1], diagonalsIntersectionsWithCircle[1][1]],
      async ([rFrom, rTo1, rTo2]) => [
        await this.drawLine(rFrom, rTo1, pencilBrush),
        await this.drawLine(rFrom, rTo2, pencilBrush),
      ],
    );

    const diagonalsIntersectionsWithStar = [
      intersectionBetweenTwoLines(diagonals[1], starGroup[0][0]),
      intersectionBetweenTwoLines(starGroup[0][0], diagonals[2]),
      intersectionBetweenTwoLines(diagonals[3], starGroup[0][1]),
      intersectionBetweenTwoLines(starGroup[0][1], diagonals[2]),
    ];

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        topCenterPoint,
        diagonalsIntersectionsWithStar[0],
        diagonalsIntersectionsWithStar[1],
        diagonalsIntersectionsWithCircle[0][1],
        diagonalsIntersectionsWithStar[2],
        diagonalsIntersectionsWithStar[3],
        diagonalsIntersectionsWithCircle[1][1],
      ],
      async ([rFrom1, rTo1, rFrom2, rTo2, rTo3, rFrom4, rTo4]) => [
        await this.drawLine(rFrom1, rTo1, mainBorderBrush),
        await this.drawLine(rFrom2, rTo2, mainBorderBrush),
        await this.drawLine(rFrom1, rTo3, mainBorderBrush),
        await this.drawLine(rFrom4, rTo4, mainBorderBrush),
      ],
    );

    this.removeAndUpdate(circle, ...diagonals);

    for (const group of starGroup) {
      this.removeAndUpdate(...group);
    }
  }
}
