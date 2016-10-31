
$(document).ready(function(){
    var OBIQApp = new BIQApp;
    OBIQApp.init();
    var OBFabricPolygon = new BFabricPolygon({ canvas : OBIQApp.canvas });
});
function BIQApp(){
}
BIQApp.prototype.init = function(){
    var self = this;
    self.viewer = OpenSeadragon({
        id: "osd1",
        prefixUrl: "assets/js/osd/images/",
        debugMode:false,
        tileSources:'assets/dzi/magickslicer/A1.0.dzi',
        visibilityRatio:1.0,
        constrainDuringPan: true,
        animationTime: self.animationTime,
        gestureSettingsMouse:{clickToZoom:false},
        maxImageCacheCount: 2000,
        preserveViewport:true
    });
    var overlay = self.viewer.fabricjsOverlay();
    self.canvas= self.viewer.fabricjsOverlay().fabricCanvas();
    $(window).resize(function() {
        overlay.resize();
        overlay.resizecanvas();
    });
};

//var prototypefabric = new function () {
//    
//};