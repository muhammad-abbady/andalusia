/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush, tessellationCenterBrush } from "../brushes";
import { intersectionBetweenLineAndCircle, intersectionBetweenTwoLines } from "../utils";

const INNER_RADIUS_RATIO = 0.86;

export class IntermingledSquaresTile extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const outerRadius = Math.min(center.x, center.y);
    const innerRadius = outerRadius * INNER_RADIUS_RATIO;

    const outerCircle = await this.drawCircle(center, outerRadius, pencilBrush);

    const diagonals = await this.drawWithRotatingPoint(
      center,
      4,
      45,
      [new Two.Vector(center.x, 0), new Two.Vector(center.x, this.scene.height)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const outerSquares = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [new Two.Vector(center.x, 0), new Two.Vector(this.scene.width, center.y)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    const innerCircle = await this.drawCircle(center, innerRadius, pencilBrush);

    const innerquares = await this.drawWithRotatingPoint(
      center,
      8,
      45,
      intersectionBetweenLineAndCircle(
        new Two.Vector(center.x, center.y - innerRadius),
        new Two.Vector(center.x + innerRadius, center.y),
        center,
        outerRadius,
      ),
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, pencilBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(outerSquares[0], innerquares[6]),
        intersectionBetweenTwoLines(outerSquares[0], outerSquares[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(outerSquares[1], outerSquares[7]),
        intersectionBetweenTwoLines(outerSquares[1], outerSquares[0]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      8,
      45,
      [
        intersectionBetweenTwoLines(innerquares[0], diagonals[0]),
        intersectionBetweenTwoLines(innerquares[0], outerSquares[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(innerquares[0], outerSquares[6]),
        intersectionBetweenTwoLines(innerquares[5], outerSquares[6]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(outerSquares[1], outerSquares[7]),
        intersectionBetweenTwoLines(innerquares[6], outerSquares[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(diagonals[1], innerquares[7]),
        intersectionBetweenTwoLines(innerquares[6], innerquares[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [
        intersectionBetweenTwoLines(outerSquares[2], innerquares[0]),
        intersectionBetweenTwoLines(innerquares[0], innerquares[7]),
      ],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(outerCircle, ...diagonals, ...outerSquares, innerCircle, ...innerquares);
  }
}

export class IntermingledSquaresDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const tilesCount = 3;
    const tileSize = this.scene.width / tilesCount;

    if (this.shouldAnimate) {
      await new IntermingledSquaresTile(this.scene, this.speed, this.token, this.shouldAnimate).render();
      await this.sleep(true);
      this.scene.clear();
    }

    const center = this.calculateCenterPoint();
    tessellationCenterBrush.applyTo(this.scene.makeRectangle(center.x, center.y, tileSize, tileSize));

    const tileScene = new Two({
      width: tileSize,
      height: tileSize,
      type: Two.Types.svg,
    });

    const tile = new IntermingledSquaresTile(tileScene, this.speed, this.token, false);
    await tile.render();

    const outerRadius = tileSize / 2;
    const innerRadius = outerRadius * INNER_RADIUS_RATIO;
    const shift = (outerRadius - innerRadius) / 2;

    for (let i = 0; i < tilesCount; i++) {
      for (let j = 0; j < tilesCount; j++) {
        const clone = tileScene.scene.clone();
        clone.translation = new Two.Vector(j * tileSize - shift, i * tileSize - shift);
        clone.scale = 1 / (1 - (1 - INNER_RADIUS_RATIO) / 2);

        this.scene.add(clone);
      }
    }

    this.scene.update();
  }
}
