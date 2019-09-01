/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

declare module "gulp-eslint" {
  const eslint: {
    (): NodeJS.ReadWriteStream;
    format(): NodeJS.ReadWriteStream;
    failAfterError(): NodeJS.ReadWriteStream;
  };

  export = eslint;
}
