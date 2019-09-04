/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import Two from "two.js";
import { CancellationToken } from "./cancellation-token";

export abstract class BaseDesign {
  public abstract render(): Promise<void>;

  protected constructor(
    protected readonly scene: Two,
    protected readonly speed: number,
    protected readonly token: CancellationToken,
  ) {}
}
