
let gulp = require("gulp");
let uglify = require("gulp-uglify");
let concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let browserSync = require("browser-sync");
let copy = require("gulp-copy");
let del = require("del");
let runSequence = require("run-sequence");
let removeCode = require("gulp-remove-code");
let htmlmin = require("gulp-htmlmin");


gulp.task("uglify", () => {
    return gulp.src([
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/tether/dist/js/tether.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        "node_modules/owl.carousel/dist/owl.carousel.min.js",
        "node_modules/wowjs/dist/wow.min.js",
        "node_modules/smooth-scroll/dist/js/smooth-scroll.min.js",
        "app/js/**/*.js"
    ])
        .pipe(concat("main.min.js"))
        .pipe(uglify({
            //Learn more options: https://github.com/mishoo/UglifyJS2#minify-options
            mangle: false
        }))
        .pipe(gulp.dest("www/js"));
});

gulp.task("cssmin", ["compass"], () => {
    return gulp.src([
        "node_modules/font-awesome/css/font-awesome.min.css",
        "node_modules/owl.carousel/dist/assets/owl.carousel.min.css",
        "node_modules/owl.carousel/dist/assets/owl.theme.default.min.css",
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/animate.css/animate.min.css",
        "app/css/*.css"
    ])
        .pipe(concat("styles.min.css"))
        .pipe(cleanCSS({
            //Learn more options: https://github.com/jakubpawlowicz/clean-css#constructor-options
            compatibility: "ie9"
        }))
        .pipe(gulp.dest("www/css"));
});

gulp.task("compass", () => {
    return gulp.src("app/scss/styles.scss")
        .pipe(sass({
            //Learn more options: https://github.com/sass/node-sass#options
            outputStyle: "nested",
            sourceComments: true
        }).on("error", sass.logError))
        .pipe(autoprefixer({
            //Learn more options: https://github.com/postcss/autoprefixer#options
            browsers: [
                "last 2 versions",
                "not ie <= 8",
                "Firefox <= 54",
                "Opera <= 46"
            ],
            cascade: true
        }))
        .pipe(gulp.dest("app/css"));
});

gulp.task("server", ["compass"], () => {
    browserSync.init({
        //Learn more options: https://browsersync.io/docs/options
        server: {
            baseDir: "./"
        },
        port: 9000,
        startPath: "/app"
    });

    gulp.watch("app/js/**/*.js").on("change", browserSync.reload);
    gulp.watch("app/scss/*.scss", ["compass"]).on("change", browserSync.reload);
    gulp.watch("app/**/*.html").on("change", browserSync.reload);
});

gulp.task("copy", () => {
    return gulp.src([
        "app/index.html",
        "app/favicon.ico",
        "app/templates/**",
        "app/images/**"
    ])
        .pipe(copy("www", {
            prefix: 1
        }));
});

gulp.task("copy:fonts", () => {
    return gulp.src([
        "node_modules/font-awesome/fonts/**"
    ])
        .pipe(copy("www", {
            prefix: 2
        }));
});

gulp.task("clean", () => {
    return del([
        "www"
    ]);
});

gulp.task("removeDevCode", () => {
    return gulp.src("www/**/*.html")
        .pipe(removeCode({
            //Learn more options: https://github.com/crissdev/gulp-remove-code#options
            production: true
        }))
        .pipe(gulp.dest("www"));
});

gulp.task("htmlmin", () => {
    return gulp.src("www/**/*.html")
        .pipe(htmlmin({
            //Learn more options: https://github.com/kangax/html-minifier#options
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("www"));
});


gulp.task("default", ["clean"], cb => {
    runSequence("cssmin", "uglify", "copy", "removeDevCode", "htmlmin", "copy:fonts", cb);
});
