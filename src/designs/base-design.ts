/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";
import { CancellationToken } from "./cancellation-token";
import { Brush, highlightCircleBrush } from "./brushes";
import { sleep, rotatePoint } from "./utils";

export abstract class BaseDesign {
  public abstract render(): Promise<void>;

  protected constructor(
    protected readonly scene: Two,
    protected readonly speed: number,
    protected readonly token: CancellationToken,
    protected readonly drawPencil: boolean,
  ) {}

  protected calculateCenterPoint(): Two.Vector {
    return new Two.Vector(this.scene.width / 2, this.scene.height / 2);
  }

  protected async drawCircle(center: Two.Vector, radius: number, brush: Brush): Promise<Two.Circle> {
    if (!this.drawPencil && brush.isPencil) {
      return this.scene.makeCircle(center.x, center.y, radius);
    }

    const centerHighlight = this.scene.makeCircle(center.x, center.y, 3);
    highlightCircleBrush.applyTo(centerHighlight);
    this.scene.update();

    const circle = this.scene.makeCircle(center.x, center.y, radius);
    circle.scale = 0;
    brush.applyTo(circle);

    const steps = 100 - this.speed;
    const increment = 1 / steps;

    for (let scale = 0; scale < 1; scale += increment) {
      circle.scale = scale;
      this.scene.update();
      await sleep(50);
    }

    circle.scale = 1;
    this.scene.remove(centerHighlight);
    this.scene.update();

    return circle;
  }

  protected async drawLine(from: Two.Vector, to: Two.Vector, brush: Brush): Promise<Two.Line> {
    if (!this.drawPencil && brush.isPencil) {
      return this.scene.makeLine(from.x, from.y, to.x, to.y);
    }

    const fromHighlight = this.scene.makeCircle(from.x, from.y, 3);
    highlightCircleBrush.applyTo(fromHighlight);

    const toHighlight = this.scene.makeCircle(to.x, to.y, 3);
    highlightCircleBrush.applyTo(toHighlight);

    const line = this.scene.makeLine(from.x, from.y, from.x, from.y);
    brush.applyTo(line);

    const steps = 100 - this.speed;
    const change = new Two.Vector((to.x - from.x) / steps, (to.y - from.y) / steps);

    for (let i = 0; i < steps; i++) {
      line.vertices[1].addSelf(change);
      this.scene.update();
      await sleep(50);
    }

    line.vertices[1].set(to.x, to.y);
    this.scene.remove(fromHighlight, toHighlight);
    this.scene.update();

    return line;
  }

  protected async drawLinesAround(
    center: Two.Vector,
    repetition: number,
    angleDelta: number,
    brush: Brush,
    from: Two.Vector,
    to: Two.Vector,
  ): Promise<Two.Line[]> {
    const lines = Array<Two.Line>();

    for (let i = 0; i < repetition; i++) {
      lines.push(await this.drawLine(from, to, brush));

      from = rotatePoint(from, center, angleDelta);
      to = rotatePoint(to, center, angleDelta);
    }

    return lines;
  }
}
