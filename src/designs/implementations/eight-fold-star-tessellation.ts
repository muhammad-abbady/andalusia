/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two, { Vector } from "two.js";
import { CancellationToken } from "../cancellation-token";
import { pencilBrush, mainBorderBrush, Brush, blankBrush } from "../brushes";
import { intersectionBetweenTwoLines, rotatePoint, angleToRadians } from "../utils";
import { EightFoldStarDesign } from "./eight-fold-star";

// Source: https://www.youtube.com/watch?v=fXM8jSGFz0g
export class EightFoldStarTessellationDesign extends BaseDesign {
  public constructor(scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) {
    super(scene, speed, token, shouldAnimate);
  }

  public async render(): Promise<void> {
    const center = this.calculateCenterPoint();
    const cellSize = this.scene.width / 3;

    const grid = await this.drawGrid(center, cellSize);

    const starGroup = await this.cloneStar(cellSize);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const star = starGroup.clone();
        star.translation = new Two.Vector(j * cellSize, i * cellSize);
        this.scene.add(star);
      }
    }

    this.scene.update();
    await this.sleep(25);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        await this.drawRhombus(cellSize, j * cellSize, i * cellSize);
      }
    }

    blankBrush.applyTo(this.scene.makeRectangle(center.x, cellSize / 4, this.scene.width, cellSize / 2));
    blankBrush.applyTo(this.scene.makeRectangle((cellSize * 11) / 4, center.y, cellSize / 2, this.scene.height));
    blankBrush.applyTo(this.scene.makeRectangle(center.x, (cellSize * 11) / 4, this.scene.width, cellSize / 2));
    blankBrush.applyTo(this.scene.makeRectangle(cellSize / 4, center.y, cellSize / 2, this.scene.height));

    this.scene.update();
    await this.sleep(25);

    await this.drawWithRotatingPoint(
      center,
      4,
      90,
      [new Two.Vector(cellSize / 2, cellSize / 2), new Two.Vector(2.5 * cellSize, cellSize / 2)],
      ([rFrom, rTo]) => this.drawLine(rFrom, rTo, mainBorderBrush),
    );

    this.removeAndUpdate(...grid);

    const newCenter = rotatePoint(center, new Two.Vector(0, 0), 45);
    this.scene.scene.rotation = angleToRadians(45);
    this.scene.scene.translation = new Two.Vector(center.x - newCenter.x, center.y - newCenter.y);
    this.scene.update();
  }

  private async drawGrid(center: Two.Vector, cellSize: number): Promise<Two.Line[]> {
    const grid = Array<Two.Line>();

    for (let i = 0; i < 6; i++) {
      grid.push(
        await this.drawLine(
          new Two.Vector(0, (i * center.y) / 3),
          new Two.Vector(this.scene.width, (i * center.y) / 3),
          pencilBrush,
        ),
      );
    }

    for (let i = 0; i < 6; i++) {
      grid.push(
        await this.drawLine(
          new Two.Vector((i * center.x) / 3, 0),
          new Two.Vector((i * center.x) / 3, this.scene.height),
          pencilBrush,
        ),
      );
    }

    for (let i = 0; i < 5; i++) {
      grid.push(
        await this.drawLine(new Two.Vector((i + 1) * cellSize, 0), new Two.Vector(0, (i + 1) * cellSize), pencilBrush),
      );
    }

    for (let i = 0; i < 5; i++) {
      grid.push(
        await this.drawLine(
          new Two.Vector(0, (2 - i) * cellSize),
          new Two.Vector((i + 1) * cellSize, 3 * cellSize),
          pencilBrush,
        ),
      );
    }

    return grid;
  }

  private async cloneStar(cellSize: number): Promise<Two.Group> {
    const scene = new Two({
      width: cellSize,
      height: cellSize,
      type: Two.Types.svg,
    });

    await new EightFoldStarDesign(scene, this.speed, this.token, false).render();
    return scene.scene.clone();
  }

  private async drawRhombus(cellSize: number, addX: number, addY: number): Promise<void> {
    const center = new Two.Vector(cellSize, cellSize);

    const from = new Two.Vector(cellSize / 2, cellSize);
    const fromRotated = rotatePoint(from, new Two.Vector(cellSize / 2, cellSize / 2), 315);

    const to = intersectionBetweenTwoLines(
      new Two.Line(cellSize, 0, cellSize, cellSize),
      new Two.Line(from.x, from.y, fromRotated.x, fromRotated.y),
    );

    const drawLinesTranslated = (start: Two.Vector, end: Two.Vector, brush: Brush): Promise<Two.Line[]> =>
      this.drawWithRotatingPoint(center, 4, 90, [start, end], ([rFrom, rTo]) =>
        this.drawLine(
          new Two.Vector(rFrom.x + addX, rFrom.y + addY),
          new Two.Vector(rTo.x + addX, rTo.y + addY),
          brush,
        ),
      );

    const measurementLines = [
      ...(await drawLinesTranslated(from, to, pencilBrush)),
      ...(await drawLinesTranslated(to, new Two.Vector(from.x + cellSize, from.y), pencilBrush)),
    ];

    await drawLinesTranslated(to, fromRotated, mainBorderBrush);
    await drawLinesTranslated(to, rotatePoint(fromRotated, center, 90), mainBorderBrush);

    this.removeAndUpdate(...measurementLines);
  }
}
