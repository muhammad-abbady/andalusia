/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";

export function angleToRadians(angle: number): number {
  return (angle * Math.PI) / 180;
}

export function radiansToAngle(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function areFloatsClose(a: number, b: number): boolean {
  return a.toFixed(5) === b.toFixed(5);
}

export function sleep(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 / duration);
  });
}

export function distanceBetweenTwoPoints(p1: Two.Vector, p2: Two.Vector): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function rotatePoint(point: Two.Vector, origin: Two.Vector, angle: number): Two.Vector {
  const radians = angleToRadians(angle);
  return new Two.Vector(
    Math.cos(radians) * (point.x - origin.x) - Math.sin(radians) * (point.y - origin.y) + origin.x,
    Math.sin(radians) * (point.x - origin.x) + Math.cos(radians) * (point.y - origin.y) + origin.y,
  );
}

export function intersectionBetweenLines(line1: Two.Line, line2: Two.Line): Two.Vector {
  const p1 = line1.vertices[0];
  const p2 = line1.vertices[1];
  const p3 = line2.vertices[0];
  const p4 = line2.vertices[1];

  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) {
    throw new Error("No intersection between lines.");
  }

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  return new Two.Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
}

export function intersectionWithCircle(
  p1: Two.Vector,
  p2: Two.Vector,
  center: Two.Vector,
  radius: number,
): Two.Vector[] {
  // compute the euclidean distance between A and B
  const LAB = p1.distanceTo(p2);

  // compute the direction vector D from A to B
  const d = p2
    .clone()
    .subSelf(p1)
    .divideScalar(LAB);

  // the equation of the line AB is x = Dx*t + Ax, y = Dy*t + Ay with 0 <= t <= LAB.

  // compute the distance between the points A and E, where
  // E is the point of AB closest the circle center (Cx, Cy)
  const t = d.x * (center.x - p1.x) + d.y * (center.y - p1.y);
  const e = new Two.Vector(t * d.x + p1.x, t * d.y + p1.y);

  // compute the euclidean distance between E and C
  const LEC = e.distanceTo(center);

  // test if the line intersects the circle
  if (LEC < radius) {
    // compute distance from t to circle intersection point
    const dt = Math.sqrt(radius * radius - LEC * LEC);

    // compute first intersection point
    const F = new Two.Vector((t - dt) * d.x + p1.x, (t - dt) * d.y + p1.y);

    // compute second intersection point
    const G = new Two.Vector((t + dt) * d.x + p1.x, (t + dt) * d.y + p1.y);

    return [F, G];
  }

  // else test if the line is tangent to circle
  else if (LEC === radius) {
    // tangent point to circle is E
    return [e];
  } else {
    // line doesn't touch circle
    return [];
  }
}

export function intersectionBetweenCircles(
  center1: Two.Vector,
  radius1: number,
  center2: Two.Vector,
  radius2: number,
): Two.Vector[] {
  // dx and dy are the vertical and horizontal distances between the circle centers.
  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;

  // Determine the straight-line distance between the centers.
  const d = Math.sqrt(dy * dy + dx * dx);

  // Check for solvability.
  if (d > radius1 + radius2) {
    // no solution. circles do not intersect.
    return [];
  }
  if (d < Math.abs(radius1 - radius2)) {
    // no solution. one circle is contained in the other.
    return [];
  }

  // point2 is the point where the line through the circle intersection
  // points crosses the line between the circle centers.

  // Determine the distance from point 0 to point 2.
  const a = (radius1 * radius1 - radius2 * radius2 + d * d) / (2.0 * d);

  // Determine the coordinates of point2.
  const x2 = center1.x + (dx * a) / d;
  const y2 = center1.y + (dy * a) / d;

  // Determine the distance from point 2 to either of the intersection points.
  const h = Math.sqrt(radius1 * radius1 - a * a);

  // Now determine the offsets of the intersection points from point 2.
  const rx = -dy * (h / d);
  const ry = dx * (h / d);

  // Determine the absolute intersection points.
  const xi = x2 + rx;
  const xiPrime = x2 - rx;
  const yi = y2 + ry;
  const yiPrime = y2 - ry;

  return [new Two.Vector(xi, yi), new Two.Vector(xiPrime, yiPrime)];
}
