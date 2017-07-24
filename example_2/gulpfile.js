
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
let ngTemplate = require("gulp-ng-template");


gulp.task("uglify", () => {
    return gulp.src([
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/tether/dist/js/tether.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        "node_modules/owl.carousel/dist/owl.carousel.min.js",
        "node_modules/wowjs/dist/wow.min.js",
        "app/lib/angularjs/js/*.min.js",
        "node_modules/angular-scroll/angular-scroll.min.js",
        "app/js/app.module.js",
        "temp/templates/templates.js",
        "app/js/directives/**/*.directive.js",
        "app/js/app.controller.js",
        "app/js/components/**/*.component.js"
    ])
        .pipe(concat("main.min.js"))
        .pipe(uglify({
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
            compatibility: "ie9"
        }))
        .pipe(gulp.dest("www/css"));
});

gulp.task("compass", () => {
    return gulp.src("app/scss/styles.scss")
        .pipe(sass({
            outputStyle: "nested",
            sourceComments: true
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
        .pipe(gulp.dest("app/css"));
});

gulp.task("server", ["compass"], () => {
    browserSync.init({
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

gulp.task("clean:general", () => {
    return del([
        "temp"
    ]);
});

gulp.task("removeDevCode", () => {
    return gulp.src("www/**/*.html")
        .pipe(removeCode({
            production: true
        }))
        .pipe(gulp.dest("www"));
});

gulp.task("htmlmin", () => {
    return gulp.src("www/**/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("www"));
});

gulp.task("ngtemplates", () => {
	return gulp.src("app/js/components/**/*.html")
		.pipe(ngTemplate({
            //Learn more options: https://github.com/teambition/gulp-ng-template#options
            moduleName: "mobileSolutions",
            filePath: "templates.js",
            prefix: "js/components/"
        }))
		.pipe(gulp.dest("temp/templates"));
});


gulp.task("default", ["clean"], cb => {
    runSequence("cssmin",
        "ngtemplates",
        "uglify",
        "copy",
        "removeDevCode",
        "htmlmin",
        "copy:fonts",
        "clean:general",
        cb);
});
