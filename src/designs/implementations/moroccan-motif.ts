/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { mainBorderBrush } from "../brushes";
import { intersectionBetweenLineAndCircle, rotatePoint, angleBetween } from "../utils";

export class MoroccanMotifDesign extends BaseDesign {
  private readonly horizontalTiles = 5;
  private readonly verticalTiles = 4;

  private readonly horizontalSquaresPerTile = 8;
  private readonly verticalSquaresPerTile = 10;

  private readonly tilesCount = this.horizontalTiles * this.horizontalSquaresPerTile;
  private readonly tileSize = this.scene.width / this.tilesCount;

  private readonly verticalLineHeight: number;
  private readonly curveAngle: number;

  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);

    if (this.tilesCount !== this.verticalTiles * this.verticalSquaresPerTile) {
      throw new Error("Horizontal and vertical tiles count does not match.");
    }

    const center = this.getVector(4, 4);
    const intersection = intersectionBetweenLineAndCircle(
      this.getVector(3, 0),
      this.getVector(3, 4),
      center,
      this.tileSize * 4,
    )[0];

    this.verticalLineHeight = this.tileSize + intersection.y;
    this.curveAngle = angleBetween(center, this.getVector(0, 4), intersection);
  }

  public async render(): Promise<void> {
    const grid = this.drawGrid(this.tilesCount, this.tileSize);

    await this.repeatCurve(7, 4, 3, 4, true);
    await this.repeatCurve(6, 3, 2, 3, true);
    await this.repeatCurve(1, 4, 5, 4, false);
    await this.repeatCurve(2, 3, 6, 3, false);

    await this.repeatCorner(2, 4, true);
    await this.repeatCorner(1, 3, true);
    await this.repeatCorner(6, 4, false);
    await this.repeatCorner(7, 3, false);

    this.removeAndUpdate(...grid);
  }

  private async repeatCorner(topX: number, topY: number, lhs: boolean): Promise<void> {
    const top = this.getVector(topX, topY);
    const bottom = new Two.Vector(top.x, top.y + this.verticalLineHeight);
    await this.repeatWithPoints([top, bottom], ([tFrom, tTo]) => this.drawLine(tFrom, tTo, mainBorderBrush));

    const side = new Two.Vector(top.x + (lhs ? this.tileSize : -this.tileSize), top.y);
    await this.repeatWithPoints([top, side], ([tFrom, tTo]) => this.drawLine(tFrom, tTo, mainBorderBrush));
  }

  private async repeatCurve(
    centerX: number,
    centerY: number,
    fromX: number,
    fromY: number,
    clockwise: boolean,
  ): Promise<void> {
    const center = this.getVector(centerX, centerY);

    let from: Two.Vector, to: Two.Vector;
    if (clockwise) {
      from = this.getVector(fromX, fromY);
      to = rotatePoint(from, center, this.curveAngle);
    } else {
      to = this.getVector(fromX, fromY);
      from = rotatePoint(to, center, -this.curveAngle);
    }

    await this.repeatWithPoints([center, from, to], ([tCenter, tFrom, tTo]) =>
      this.drawCurve(tCenter, tFrom, tTo, mainBorderBrush),
    );
  }

  private async repeatWithPoints(
    points: Two.Vector[],
    callback: (points: Two.Vector[]) => Promise<Two.Object>,
  ): Promise<void> {
    for (let i = 0; i < this.verticalTiles; i++) {
      for (let j = 0; j < this.horizontalTiles; j++) {
        const translation = new Two.Vector(
          j * this.tileSize * this.horizontalSquaresPerTile,
          i * this.tileSize * this.verticalSquaresPerTile,
        );
        await callback(points.map(point => point.clone().addSelf(translation)));
      }

      for (let j = 0; j <= this.horizontalTiles; j++) {
        const translation = new Two.Vector(
          (j - 0.5) * this.tileSize * this.horizontalSquaresPerTile,
          (i + 0.5) * this.tileSize * this.verticalSquaresPerTile,
        );
        await callback(points.map(point => point.clone().addSelf(translation)));
      }
    }
  }

  private getVector(x: number, y: number): Two.Vector {
    return new Two.Vector(x * this.tileSize, y * this.tileSize);
  }
}
