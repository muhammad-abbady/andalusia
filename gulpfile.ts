import * as gulp from "gulp";
import * as del from "del";

// TODO: add types for these packages:
const run = require("gulp-run-command").default;

gulp.task("clean", function() {
  return del(["build"]);
});

gulp.task(
  "serve",
  gulp.parallel(run("yarn webpack --watch"), run("live-server ./build"))
);

gulp.task(
  "deploy",
  gulp.series([
    "clean",
    run("yarn webpack --release"),
    run("yarn surge ./build --domain andalusia.surge.sh")
  ])
);
