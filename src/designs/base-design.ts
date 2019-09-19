/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";
import { CancellationToken } from "./cancellation-token";
import { Brush, markerBrush } from "./brushes";
import { rotatePoint, distanceBetweenTwoPoints, radiansToAngle, areFloatsClose } from "./utils";

const SHORT_ANIMATION_PAUSE = 20;
const LONG_ANIMATION_PAUSE = 2000;

export abstract class BaseDesign {
  public abstract render(): Promise<void>;

  protected constructor(
    protected readonly scene: Two,
    protected readonly speed: number,
    protected readonly token: CancellationToken,
    protected readonly shouldAnimate: boolean,
  ) {}

  protected calculateCenterPoint(): Two.Vector {
    return new Two.Vector(this.scene.width / 2, this.scene.height / 2);
  }

  protected async drawCircle(center: Two.Vector, radius: number, brush: Brush): Promise<Two.Circle> {
    if (this.shouldFakeShape(brush)) {
      return new Two.Circle(center.x, center.y, radius);
    }

    const circleTop = new Two.Vector(center.x, center.y - radius);
    const circleBottom = new Two.Vector(center.x, center.y + radius);
    const topMarker = this.drawMarker(circleTop);

    const animation1 = await this.drawCurve(center, circleTop, circleBottom, brush, false);
    const animation2 = await this.drawCurve(center, circleBottom, circleTop, brush, false);

    const circle = this.scene.makeCircle(center.x, center.y, radius);
    brush.applyTo(circle);

    this.removeAndUpdate(animation1, animation2, topMarker);
    return circle;
  }

  protected async drawCurve(
    center: Two.Vector,
    from: Two.Vector,
    to: Two.Vector,
    brush: Brush,
    drawStartMarker = true,
  ): Promise<Two.Path> {
    const radius = distanceBetweenTwoPoints(center, from);
    if (!areFloatsClose(radius, distanceBetweenTwoPoints(center, to))) {
      throw new Error("from and to are not equidistant from center.");
    }

    const calculateAngle = (end: Two.Vector): number =>
      radiansToAngle(2 * Math.asin(distanceBetweenTwoPoints(from, end) / (radius * 2))) || 360;

    const calculatePoints = (end: Two.Vector): Two.Vector[] => {
      const points = Array<Two.Vector>();
      const angleIncrement = calculateAngle(end) / Two.Resolution;

      for (let i = 0; i <= Two.Resolution; i++) {
        points.push(rotatePoint(from, center, angleIncrement * i));
      }

      return points;
    };

    if (this.shouldFakeShape(brush)) {
      return new Two.Path(calculatePoints(to), false, true);
    }

    const centerHighlight = this.drawMarker(center);

    const steps = this.calculateSteps();
    const angleIncrement = calculateAngle(to) / steps;

    for (let i = 1; i < steps; i++) {
      const end = rotatePoint(from, center, angleIncrement * i);
      const markers = [this.drawMarker(end)];

      if (drawStartMarker) {
        markers.push(this.drawMarker(from));
      }

      const partialCurve = this.scene.makeCurve(calculatePoints(end), true);
      brush.applyTo(partialCurve);

      await this.sleep();

      this.removeAndUpdate(partialCurve, ...markers);
    }

    const fullCurve = this.scene.makeCurve(calculatePoints(to), true);
    brush.applyTo(fullCurve);

    this.removeAndUpdate(centerHighlight);

    return fullCurve;
  }

  protected async drawLine(from: Two.Vector, to: Two.Vector, brush: Brush): Promise<Two.Line> {
    if (this.shouldFakeShape(brush)) {
      return new Two.Line(from.x, from.y, to.x, to.y);
    }

    const fromHighlight = this.drawMarker(from);
    const toHighlight = this.drawMarker(to);

    const line = this.scene.makeLine(from.x, from.y, from.x, from.y);
    brush.applyTo(line);

    const steps = this.calculateSteps();
    const change = new Two.Vector((to.x - from.x) / steps, (to.y - from.y) / steps);

    for (let i = 0; i < steps; i++) {
      line.vertices[1].addSelf(change);
      await this.sleep();
    }

    line.vertices[1].set(to.x, to.y);
    this.removeAndUpdate(fromHighlight, toHighlight);

    return line;
  }

  protected drawMarker(center: Two.Vector): Two.Circle {
    const marker = this.scene.makeCircle(center.x, center.y, 3);
    markerBrush.applyTo(marker);

    this.scene.update();
    return marker;
  }

  protected async drawWithRotatingPoint<T>(
    center: Two.Vector,
    repetition: number,
    angleDelta: number,
    points: Two.Vector[],
    apply: (points: Two.Vector[]) => Promise<T>,
  ): Promise<T[]> {
    const shapes = Array<T>();

    for (let i = 0; i < repetition; i++) {
      shapes.push(await apply(points.map(p => rotatePoint(p, center, i * angleDelta))));
    }

    return shapes;
  }

  protected removeAndUpdate(...shapes: Two.Object[]): void {
    this.scene.remove(...shapes);
    this.scene.update();
  }

  protected sleep(longPause = false): Promise<void> {
    this.token.checkForCancellation();
    this.scene.update();

    if (this.shouldAnimate) {
      return new Promise(resolve => {
        setTimeout(
          () => {
            this.scene.update();
            resolve();
          },
          longPause ? LONG_ANIMATION_PAUSE : SHORT_ANIMATION_PAUSE,
        );
      });
    }

    return Promise.resolve();
  }

  private shouldFakeShape(brush: Brush): boolean {
    return !this.shouldAnimate && brush.isPencil;
  }

  private calculateSteps(): number {
    return 100 - this.speed;
  }
}
