/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two, { Vector } from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush, highlightCenterBrush } from "../brushes";
import { intersectionBetweenTwoLines, intersectionBetweenLineAndCircle, rotatePoint } from "../utils";

class FigLeafTile extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const radius = Math.min(center.x, center.y);
    const outerCircle = await this.drawCircle(center, radius, pencilBrush);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      4,
      45,
      [new Two.Vector(0, 0), new Two.Vector(this.scene.width, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const middleSquareStart = intersectionBetweenLineAndCircle(
      diagonals[0].vertices[0],
      diagonals[0].vertices[1],
      center,
      radius,
    )[0];

    const middleSquares = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [new Two.Vector(0, middleSquareStart.y), new Two.Vector(this.scene.width, middleSquareStart.y)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const innerSquares = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      intersectionBetweenLineAndCircle(
        new Two.Vector(center.x, middleSquareStart.y),
        rotatePoint(new Two.Vector(center.x, middleSquareStart.y), center, 90),
        center,
        radius,
      ),
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const outerSquareStart = intersectionBetweenTwoLines(middleSquares[7], innerSquares[0]);
    const outerSquares = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [new Two.Vector(0, outerSquareStart.y), new Two.Vector(this.scene.width, outerSquareStart.y)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const corners = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenLineAndCircle(innerSquares[3].vertices[0], innerSquares[3].vertices[1], center, radius)[1],
        intersectionBetweenLineAndCircle(innerSquares[1].vertices[0], innerSquares[1].vertices[1], center, radius)[0],
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const parallelLines1 = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(outerSquares[0], middleSquares[1]),
        intersectionBetweenTwoLines(outerSquares[2], middleSquares[3]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const parallelLines2 = await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [new Two.Vector(middleSquares[2].vertices[0].x, 0), new Two.Vector(0, middleSquares[4].vertices[1].y)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [new Two.Vector(0, 0), intersectionBetweenTwoLines(outerSquares[0], outerSquares[3])],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(corners[3], diagonals[0]),
        intersectionBetweenTwoLines(innerSquares[3], diagonals[0]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    const cornerXTopLeft = intersectionBetweenTwoLines(parallelLines2[2], diagonals[0]);
    await this.drawLine(cornerXTopLeft, rotatePoint(cornerXTopLeft, center, 180), mainBorderBrush);
    await this.drawLine(
      rotatePoint(cornerXTopLeft, center, 90),
      rotatePoint(cornerXTopLeft, center, 270),
      mainBorderBrush,
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(innerSquares[3], parallelLines1[3]),
      intersectionBetweenTwoLines(diagonals[0], parallelLines1[3]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      new Two.Vector(center.x, 0),
      intersectionBetweenTwoLines(outerSquares[0], parallelLines1[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 4, 90, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(middleSquares[1], parallelLines2[0]),
        intersectionBetweenTwoLines(middleSquares[1], parallelLines2[2]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(outerSquares[1], parallelLines2[2]),
      intersectionBetweenTwoLines(outerSquares[1], parallelLines1[3]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(outerSquares[0], parallelLines1[0]),
      intersectionBetweenTwoLines(parallelLines2[0], parallelLines1[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(outerSquares[0], outerSquares[1]),
      intersectionBetweenTwoLines(outerSquares[0], corners[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(outerSquares[0], corners[0]),
      intersectionBetweenTwoLines(diagonals[2], corners[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(parallelLines2[0], middleSquares[1]),
      intersectionBetweenTwoLines(parallelLines2[0], parallelLines1[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(diagonals[2], innerSquares[0]),
      intersectionBetweenTwoLines(parallelLines1[3], innerSquares[0]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    await this.repeatAcrossHalves(
      center,
      intersectionBetweenTwoLines(outerSquares[1], parallelLines2[2]),
      intersectionBetweenTwoLines(middleSquares[1], parallelLines2[2]),
      (from, to) =>
        this.drawWithRotatingPoint(center, 2, 180, [from, to], ([rFrom, rTo]) =>
          this.drawLine(rFrom, rTo, mainBorderBrush),
        ),
    );

    this.removeAndUpdate(
      outerCircle,
      ...diagonals,
      ...middleSquares,
      ...innerSquares,
      ...outerSquares,
      ...corners,
      ...parallelLines1,
      ...parallelLines2,
    );
  }

  private async repeatAcrossHalves(
    center: Two.Vector,
    from: Two.Vector,
    to: Two.Vector,
    callback: (from: Two.Vector, to: Two.Vector) => Promise<unknown>,
  ): Promise<void> {
    await callback(from, to);
    await callback(new Two.Vector(2 * center.x - from.x, from.y), new Two.Vector(2 * center.x - to.x, to.y));
  }
}

export class FigLeafMotifDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const tiles = 3;
    const tileSize = this.scene.width / tiles;

    if (this.shouldAnimate) {
      await new FigLeafTile(this.scene, this.speed, this.token, this.shouldAnimate).render();
      await this.sleep(25);
      this.scene.clear();
    }

    const center = this.calculateCenterPoint();
    highlightCenterBrush.applyTo(this.scene.makeRectangle(center.x, center.y, tileSize, tileSize));

    const tileScene = new Two({
      width: tileSize,
      height: tileSize,
      type: Two.Types.svg,
    });

    await new FigLeafTile(tileScene, this.speed, this.token, false).render();

    for (let i = 0; i < tiles; i++) {
      for (let j = 0; j < tiles; j++) {
        const clone = tileScene.scene.clone();
        clone.translation = new Two.Vector(j * tileSize, i * tileSize);

        this.scene.add(clone);
      }
    }

    this.scene.update();
  }
}
