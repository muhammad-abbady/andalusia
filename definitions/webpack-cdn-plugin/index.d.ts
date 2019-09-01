/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

declare module "webpack-cdn-plugin" {
  import * as webpack from "webpack";

  class WebpackCdnPlugin extends webpack.Plugin {
    public constructor(opts: {
      readonly publicPath: string;
      readonly prod: boolean;
      readonly modules: {
        readonly name: string;
        readonly var?: string;
        readonly cssOnly?: boolean;
        readonly path?: string;
        readonly style?: string;
      }[];
    });
  }

  export = WebpackCdnPlugin;
}
