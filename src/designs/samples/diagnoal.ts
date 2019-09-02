/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "../base-design";
import Two from "two.js";
import { CancellationToken } from "../cancellation-token";
import { sleep } from "../utils";

export class DiagonalDesign extends BaseDesign {
  public readonly url = "samples/diagonal";
  public readonly title = "Diagonal Design";

  protected async render(scene: Two, token: CancellationToken): Promise<void> {
    token.checkForCancellation();

    const from = new Two.Vector(10, 10);
    const to = new Two.Vector(scene.width - 10, scene.height - 10);
    const change = new Two.Vector((to.x - from.x) / 100, (to.y - from.y) / 100);
    const line = scene.makeLine(from.x, from.y, from.x, from.y);

    for (let i = 0; i < 100; i++) {
      token.checkForCancellation();
      await sleep(20);
      line.vertices[1].addSelf(change);
      scene.update();
    }
  }
}
