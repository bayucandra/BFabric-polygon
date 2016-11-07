var OBIQApp=null;//global variable
var OBFabricPolygon =null; //stand as global variable
$(document).ready(function(){
    OBIQApp = new BIQApp;
    OBIQApp.init();
    OBFabricPolygon = new BFabricPolygon({ canvas : OBIQApp.canvas });
});
function BIQApp(){
}
BIQApp.prototype.init = function(){
    var self = this;
    self.viewer = OpenSeadragon({
        id: "osd1",
        prefixUrl: "assets/js/osd/images/",
        debugMode:false,
        tileSources:'assets/dzi/magickslicer/home-schema2.dzi',
        visibilityRatio:1.0,
        constrainDuringPan: true,
        animationTime: self.animationTime,
        gestureSettingsMouse:{clickToZoom:false},
        maxImageCacheCount: 2000,
        preserveViewport:true
    });
    self.isMaintainFabricSizes = true;
    var overlay = self.viewer.fabricjsOverlay();
    self.canvas = self.viewer.fabricjsOverlay().fabricCanvas();
    $(window).resize(function() {
        overlay.resize();
        overlay.resizecanvas();
    });
};