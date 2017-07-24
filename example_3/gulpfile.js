
let gulp = require("gulp");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let browserSync = require("browser-sync");


gulp.task("compass", () => {
    return gulp.src("app/scss/styles.scss")
        .pipe(sass({
            outputStyle: "expanded",
            sourceComments: true,
            includePaths: ["app/scss"]
        }).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "last 2 versions",
                "not ie <= 8",
                "Firefox <= 54",
                "Opera <= 46"
            ],
            cascade: true
        }))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task("server", ["compass"], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 9000,
        startPath: "/app"
    });

    gulp.watch("app/scss/*.scss", ["compass"]);
    //gulp.watch("app/scss/*.scss", ["compass"]).on("change", browserSync.reload);
    gulp.watch("app/**/*.html").on("change", browserSync.reload);
});
