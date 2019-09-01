/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

declare module "@beyonk/google-fonts-webpack-plugin" {
  import * as webpack from "webpack";

  class GoogleFontsPlugin extends webpack.Plugin {
    public constructor(opts: {
      readonly path: string;
      readonly local: boolean;
      readonly fonts: {
        readonly family: string;
        readonly variants: string[];
      }[];
    });
  }

  export = GoogleFontsPlugin;
}
