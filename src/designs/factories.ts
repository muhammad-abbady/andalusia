/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "./base-design";
import { TwentyFoldStarDesign } from "./implementations/twenty-fold-star";
import { CancellationToken } from "./cancellation-token";
import Two from "two.js";
import { TwelveFoldStarDesign } from "./implementations/twelve-fold-star";
import { TwelveFoldFlowerDesign } from "./implementations/twelve-fold-flower";

export interface DesignFactory {
  readonly url: string;
  readonly title: string;
  readonly create: (scene: Two, speed: number, token: CancellationToken, drawPencil: boolean) => BaseDesign;
}

export const factories: ReadonlyArray<DesignFactory> = [
  {
    url: "/designs/twelve-fold-star",
    title: "Twelve-fold Star",
    create: (scene, speed, token, drawPencil) => new TwelveFoldStarDesign(scene, speed, token, drawPencil),
  },
  {
    url: "/designs/twenty-fold-star",
    title: "Twenty-fold Star",
    create: (scene, speed, token, drawPencil) => new TwentyFoldStarDesign(scene, speed, token, drawPencil),
  },
  {
    url: "/designs/twelve-fold-flower",
    title: "Twelve-fold Flower",
    create: (scene, speed, token, drawPencil) => new TwelveFoldFlowerDesign(scene, speed, token, drawPencil),
  },
];
