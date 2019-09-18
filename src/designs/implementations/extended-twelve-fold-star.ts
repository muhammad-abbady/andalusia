/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush } from "../brushes";
import { intersectionBetweenTwoLines, intersectionBetweenLineAndCircle, rotatePoint } from "../utils";

export class ExtendedTwelveFoldStarDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();

    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const top = new Two.Vector(center.x, 0);
    const diagonals = await this.drawWithRotatingPoint(
      center,
      6,
      90 / 3,
      [top, new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const outerHexagons = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], diagonals[2].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const squares = await this.drawWithRotatingPoint(
      center,
      12,
      90 / 3,
      [diagonals[0].vertices[0], diagonals[3].vertices[0]],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const outerExtendedLines = await this.drawExtendedLines(
      intersectionBetweenTwoLines(squares[10], squares[11]),
      center,
      radius,
    );

    const innerExtendedLines = await this.drawExtendedLines(
      intersectionBetweenTwoLines(outerExtendedLines[10], outerExtendedLines[11]),
      center,
      radius,
    );

    const parallelLines = await this.drawParallelLines(
      intersectionBetweenTwoLines(outerExtendedLines[9], innerExtendedLines[0]),
      center,
      radius,
    );

    const smallCircleRadius = (parallelLines[6].vertices[1].x - parallelLines[0].vertices[0].x) / 2;
    const smallCircles = await this.drawWithRotatingPoint(center, 6, 60, [top], ([rCenter]) =>
      this.drawCircle(rCenter, smallCircleRadius, pencilBrush),
    );

    const innerHexagon = await this.drawInnerHexagon(new Two.Vector(center.x, smallCircleRadius), center);

    await this.drawMainLineWithTranspose(
      6,
      innerHexagon[0].vertices[0],
      intersectionBetweenTwoLines(innerHexagon[0], outerExtendedLines[1]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(parallelLines[6], squares[10]),
      intersectionBetweenTwoLines(squares[10], outerHexagons[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(parallelLines[6], squares[10]),
      intersectionBetweenTwoLines(parallelLines[6], outerExtendedLines[10]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(squares[10], outerHexagons[0]),
      intersectionBetweenTwoLines(parallelLines[1], outerHexagons[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(parallelLines[1], outerHexagons[0]),
      intersectionBetweenTwoLines(parallelLines[1], outerExtendedLines[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(diagonals[0], outerExtendedLines[0]),
      intersectionBetweenTwoLines(outerExtendedLines[10], outerExtendedLines[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      6,
      intersectionBetweenTwoLines(outerExtendedLines[10], outerExtendedLines[0]),
      intersectionBetweenTwoLines(outerExtendedLines[10], innerHexagon[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      12,
      intersectionBetweenTwoLines(parallelLines[1], outerExtendedLines[0]),
      intersectionBetweenTwoLines(parallelLines[7], outerExtendedLines[0]),
      center,
    );

    await this.drawMainLineWithTranspose(
      12,
      intersectionBetweenTwoLines(outerExtendedLines[11], parallelLines[6]),
      intersectionBetweenTwoLines(parallelLines[6], parallelLines[3]),
      center,
    );

    this.removeAndUpdate(
      outerCircle,
      ...diagonals,
      ...outerHexagons,
      ...squares,
      ...outerExtendedLines,
      ...innerExtendedLines,
      ...parallelLines,
      ...smallCircles,
      ...innerHexagon,
    );
  }

  private async drawExtendedLines(top: Two.Vector, center: Two.Vector, radius: number): Promise<Two.Line[]> {
    const right = rotatePoint(top, center, 90);
    const markers = await this.drawWithRotatingPoint(center, 12, 90 / 3, [top], async ([rPoint]) =>
      this.drawMarker(rPoint),
    );

    const firstLine = intersectionBetweenLineAndCircle(top, right, center, radius);
    const lines = await this.drawWithRotatingPoint(center, 12, 90 / 3, firstLine, ([rFrom, rTo]) =>
      this.drawLine(rFrom, rTo, pencilBrush),
    );

    this.removeAndUpdate(...markers);
    return lines;
  }

  private async drawParallelLines(top: Two.Vector, center: Two.Vector, radius: number): Promise<Two.Line[]> {
    const bottom = new Two.Vector(top.x, this.scene.height - top.y);

    const markers = [
      ...(await this.drawWithRotatingPoint(center, 12, 90 / 3, [top], async ([rPoint]) => this.drawMarker(rPoint))),
      ...(await this.drawWithRotatingPoint(center, 12, 90 / 3, [bottom], async ([rPoint]) => this.drawMarker(rPoint))),
    ];

    const firstLine = intersectionBetweenLineAndCircle(top, bottom, center, radius);
    const lines = await this.drawWithRotatingPoint(center, 12, 90 / 3, firstLine, ([rFrom, rTo]) =>
      this.drawLine(rFrom, rTo, pencilBrush),
    );

    this.removeAndUpdate(...markers);
    return lines;
  }

  private async drawInnerHexagon(top: Two.Vector, center: Two.Vector): Promise<Two.Line[]> {
    const markers = await this.drawWithRotatingPoint(center, 6, 60, [top], async ([rPoint]) => this.drawMarker(rPoint));

    const lines = await this.drawWithRotatingPoint(center, 6, 60, [top, rotatePoint(top, center, 60)], ([rFrom, rTo]) =>
      this.drawLine(rFrom, rTo, pencilBrush),
    );

    this.removeAndUpdate(...markers);
    return lines;
  }

  private async drawMainLineWithTranspose(
    repitition: number,
    from: Two.Vector,
    to: Two.Vector,
    center: Two.Vector,
  ): Promise<Two.Line[]> {
    return [
      ...(await this.drawWithRotatingPoint(center, repitition, 360 / repitition, [from, to], ([rFrom, rTo]) =>
        this.drawLine(rFrom, rTo, mainBorderBrush),
      )),
      ...(await this.drawWithRotatingPoint(
        center,
        repitition,
        360 / repitition,
        [new Two.Vector(2 * center.x - from.x, from.y), new Two.Vector(2 * center.x - to.x, to.y)],
        ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
      )),
    ];
  }
}
