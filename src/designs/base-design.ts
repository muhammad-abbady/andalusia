/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";
import { CancellationToken, RENDER_CANCELLATION_MESSAGE } from "./cancellation-token";

export abstract class BaseDesign {
  public abstract readonly url: string;
  public abstract readonly title: string;

  protected abstract render(scene: Two, speed: number, token: CancellationToken): Promise<void>;

  public start(element: HTMLElement, speed: number, token: CancellationToken): void {
    const bounds = element.getBoundingClientRect();
    const params: Two.ConstructorParams = {
      width: bounds.width,
      height: bounds.height,
      type: Two.Types.svg,
    };

    const scene = new Two(params).appendTo(element).bind("update", () => {
      // In case it was cancelled after animation stopped
      token.checkForCancellation();
    });

    this.render(scene, speed, token).catch((error: Error) => {
      if (error.message === RENDER_CANCELLATION_MESSAGE) {
        scene.clear();
      } else {
        throw error;
      }
    });
  }
}
