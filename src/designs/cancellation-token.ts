/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

export const RENDER_CANCELLATION_MESSAGE = "Rendering has been cancelled.";

export class CancellationToken {
  private isCancelled = false;

  public checkForCancellation(): void {
    if (this.isCancelled) {
      throw new Error(RENDER_CANCELLATION_MESSAGE);
    }
  }

  public cancel(): void {
    this.isCancelled = true;
  }
}
