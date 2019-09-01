/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

declare module "gulp-run-command" {
  import * as gulp from "gulp";

  export default function(command: string): gulp.TaskFunction;
}
