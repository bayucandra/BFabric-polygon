(function(angular){
    "use strict";
    angular.module('BNgApp')
        .factory('serviceOSD', function(){
            var ref = {};
            ref.init = function(){
                ref.viewer = OpenSeadragon({
                    id: "osd1",
                    showNavigator: false,
                    showNavigationControl:false,
                    prefixUrl: "assets/js/osd/images/",
                    debugMode:false,
                    tileSources:'assets/dzi/magickslicer/home-schema2.dzi',
                    visibilityRatio:1.0,
                    constrainDuringPan: true,
                    gestureSettingsMouse:{clickToZoom:false},
                    maxImageCacheCount: 2000,
                    preserveViewport:true
                });

                var overlay = ref.viewer.fabricjsOverlay();
                ref.canvas = ref.viewer.fabricjsOverlay().fabricCanvas();
                ref.viewer.addHandler('canvas-click', function(event){
                    console.log(event);
                });
                $(window).resize(function() {
                    overlay.resize();
                    overlay.resizecanvas();
                });
            };
            return ref;
        });
})(angular);