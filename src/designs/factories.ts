/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "./base-design";
import { TwentyFoldStarDesign } from "./implementations/twenty-fold-star";
import { CancellationToken } from "./cancellation-token";
import Two from "two.js";
import { TwelveFoldStarDesign } from "./implementations/twelve-fold-star";
import { TwelveFoldFlowerDesign } from "./implementations/twelve-fold-flower";
import { ThirtyTwoFoldFlowerDesign } from "./implementations/thirty-two-fold-flower";

export interface DesignFactory {
  readonly url: string;
  readonly title: string;
  readonly create: (scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) => BaseDesign;
}

export const factories: ReadonlyArray<DesignFactory> = [
  {
    url: "/designs/twelve-fold-star",
    title: "Twelve-fold Star",
    create: (scene, speed, token, shouldAnimate) => new TwelveFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/twenty-fold-star",
    title: "Twenty-fold Star",
    create: (scene, speed, token, shouldAnimate) => new TwentyFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/twelve-fold-flower",
    title: "Twelve-fold Flower",
    create: (scene, speed, token, shouldAnimate) => new TwelveFoldFlowerDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/thirty-two-fold-flower",
    title: "Thirty-two-fold Flower",
    create: (scene, speed, token, shouldAnimate) => new ThirtyTwoFoldFlowerDesign(scene, speed, token, shouldAnimate),
  },
];
