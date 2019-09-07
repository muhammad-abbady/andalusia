/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";
import { CancellationToken } from "./cancellation-token";
import { Brush, highlightCircleBrush } from "./brushes";
import { rotatePoint, distanceBetweenTwoPoints, radiansToAngle, areFloatsClose } from "./utils";

const ANIMATION_SLEEP = 20;

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
      await this.sleep();
    }

    circle.scale = 1;
    this.removeAndUpdate(centerHighlight);

    return circle;
  }

  protected async drawCurve(center: Two.Vector, from: Two.Vector, to: Two.Vector, brush: Brush): Promise<Two.Path> {
    const radius = distanceBetweenTwoPoints(center, from);
    if (!areFloatsClose(radius, distanceBetweenTwoPoints(center, to))) {
      throw new Error("from and to are not equidistant from center.");
    }

    const angleIncrement = radiansToAngle(
      (2 * Math.asin(distanceBetweenTwoPoints(from, to) / (radius * 2))) / Two.Resolution,
    );

    const points = Array<number>();

    let point = from;
    for (let i = 0; i < Two.Resolution; i++) {
      points.push(point.x, point.y);
      point = rotatePoint(point, center, angleIncrement);
    }

    points.push(point.x, point.y);
    if (!areFloatsClose(point.x, to.x) || !areFloatsClose(point.y, to.y)) {
      throw new Error("Curve calculation should have ended at to point.");
    }

    if (this.shouldFakeShape(brush)) {
      const vectors = Array<Two.Vector>();
      for (let i = 0; i < points.length; i += 2) {
        vectors.push(new Two.Vector(points[i], points[i + 1]));
      }
      return new Two.Path(vectors, false, true);
    }

    const centerHighlight = this.scene.makeCircle(center.x, center.y, 3);
    highlightCircleBrush.applyTo(centerHighlight);
    this.scene.update();

    const curve = this.scene.makeCurve(...points, true);
    curve.scale = 0;
    brush.applyTo(curve);

    const steps = 100 - this.speed;
    const increment = 1 / steps;

    for (let scale = 0; scale < 1; scale += increment) {
      curve.scale = scale;
      this.scene.update();
      await this.sleep();
    }

    curve.scale = 1;
    this.removeAndUpdate(centerHighlight);

    return curve;
  }

  protected async drawLine(from: Two.Vector, to: Two.Vector, brush: Brush): Promise<Two.Line> {
    if (this.shouldFakeShape(brush)) {
      return new Two.Line(from.x, from.y, to.x, to.y);
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
      await this.sleep();
    }

    line.vertices[1].set(to.x, to.y);
    this.removeAndUpdate(fromHighlight, toHighlight);

    return line;
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
      shapes.push(await apply(points));

      if (i + 1 < repetition) {
        for (let j = 0; j < points.length; j++) {
          points[j] = rotatePoint(points[j], center, angleDelta);
        }
      }
    }

    return shapes;
  }

  protected removeAndUpdate(...shapes: Two.Object[]): void {
    this.scene.remove(...shapes);
    this.scene.update();
  }

  protected sleep(multipiler = 1): Promise<void> {
    if (this.shouldAnimate) {
      return new Promise(resolve => {
        setTimeout(resolve, ANIMATION_SLEEP * multipiler);
      });
    }

    return Promise.resolve();
  }

  private shouldFakeShape(brush: Brush): boolean {
    return !this.shouldAnimate && brush.isPencil;
  }
}
