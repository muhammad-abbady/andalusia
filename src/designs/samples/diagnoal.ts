/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { sleep } from "../utils";

export class DiagonalDesign extends BaseDesign {
  public readonly url = "/samples/diagonal/";
  public readonly title = "Diagonal Design";

  protected async render(scene: Two, speed: number, token: CancellationToken): Promise<void> {
    token.checkForCancellation();

    const from = new Two.Vector(10, 10);
    const to = new Two.Vector(scene.width - 10, scene.height - 10);
    const distanceX = to.x - from.x;
    const distanceY = to.y - from.y;

    const steps = 100;
    const change = new Two.Vector(distanceX / steps, distanceY / steps);

    const line = scene.makeLine(from.x, from.y, from.x, from.y);
    for (let i = 0; i < steps; i++) {
      token.checkForCancellation();
      await sleep(500 / speed);
      line.vertices[1].addSelf(change);
      scene.update();
    }
  }
}
