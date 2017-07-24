
"use strict";

app.directive("ngStart", ["$window", "$document",
    function($window, $document) {
        return {
            restrict: "E",
            link: function($scope, $element, $attrs) {
                $document.scrollTo(0, 0);
                new WOW().init();
            }
        };
    }]);
