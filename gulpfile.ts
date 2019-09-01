/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as gulp from "gulp";
import * as del from "del";

// TODO: add types for these packages:
// eslint-disable-next-line
const eslint = require("gulp-eslint");
// eslint-disable-next-line
const run = require("gulp-run-command").default;
// eslint-disable-next-line
const prettier = require("gulp-prettier");

gulp.task("clean", () => {
  return del(["build"]);
});

gulp.task("eslint", () => {
  return gulp
    .src(["**/*.{js,jsx,ts,tsx}"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("prettier", () => {
  return gulp
    .src(["**/*.*", "!node_modules/**", "!build/**", "!assets/images/**", "!assets/fonts/**", "!yarn.lock"])
    .pipe(prettier.check());
});

gulp.task("lint", gulp.parallel("eslint", "prettier"));

gulp.task(
  "deploy",
  gulp.series(["clean", "lint", run("yarn webpack --release"), run("yarn surge ./build --domain andalusia.surge.sh")]),
);
