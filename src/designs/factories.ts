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
import { EightFoldStarTessellationDesign } from "./implementations/eight-fold-star-tessellation";
import { EightFoldStarDesign } from "./implementations/eight-fold-star";
import { IntermingledSixteenFoldFlowerDesign } from "./implementations/intermingled-sixteen-fold-flower";
import { ExtendedTwelveFoldStarDesign } from "./implementations/extended-twelve-fold-star";

export interface DesignFactory {
  readonly url: string;
  readonly title: string;
  readonly attribution?: {
    readonly author: string;
    readonly link: string;
  };
  readonly create: (scene: Two, speed: number, token: CancellationToken, shouldAnimate: boolean) => BaseDesign;
}

export const factories: ReadonlyArray<DesignFactory> = [
  {
    url: "/designs/eight-fold-star",
    title: "Eight-fold Star",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=fXM8jSGFz0g",
    },
    create: (scene, speed, token, shouldAnimate) => new EightFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/eight-fold-star-tessellation",
    title: "Eight-fold Star Tessellation",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=fXM8jSGFz0g",
    },
    create: (scene, speed, token, shouldAnimate) =>
      new EightFoldStarTessellationDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/twelve-fold-star",
    title: "Twelve-fold Star",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=dXiYP-Ps8CQ",
    },
    create: (scene, speed, token, shouldAnimate) => new TwelveFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/extended-twelve-fold-star",
    title: "Extended Twelve-fold Star",
    attribution: {
      author: "Lex Wilson",
      link: "https://www.youtube.com/watch?v=b0gdqkTYDCY",
    },
    create: (scene, speed, token, shouldAnimate) =>
      new ExtendedTwelveFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/twenty-fold-star",
    title: "Twenty-fold Star",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=Pl07JqrTL-c",
    },
    create: (scene, speed, token, shouldAnimate) => new TwentyFoldStarDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/twelve-fold-flower",
    title: "Twelve-fold Flower",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=mCCWntbIHf0",
    },
    create: (scene, speed, token, shouldAnimate) => new TwelveFoldFlowerDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/intermingled-sixteen-fold-flower",
    title: "Intermingled Sixteen-Fold Flower",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=KnBX5E7gRIY",
    },
    create: (scene, speed, token, shouldAnimate) =>
      new IntermingledSixteenFoldFlowerDesign(scene, speed, token, shouldAnimate),
  },
  {
    url: "/designs/thirty-two-fold-flower",
    title: "Thirty-two-fold Flower",
    attribution: {
      author: "Nora Youssef",
      link: "https://www.youtube.com/watch?v=Vm487exe_Pc",
    },
    create: (scene, speed, token, shouldAnimate) => new ThirtyTwoFoldFlowerDesign(scene, speed, token, shouldAnimate),
  },
];
