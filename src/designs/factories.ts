/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import { BaseDesign } from "./base-design";
import { DiagonalDesign } from "./samples/diagnoal";
import { CancellationToken } from "./cancellation-token";
import Two from "two.js";

export interface DesignFactory {
  readonly url: string;
  readonly title: string;
  readonly create: (scene: Two, speed: number, token: CancellationToken) => BaseDesign;
}

export const factories: ReadonlyArray<DesignFactory> = [
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
  {
    url: "/samples/diagonal",
    title: "Diagonal Design",
    create: (scene, speed, token) => new DiagonalDesign(scene, speed, token),
  },
];
