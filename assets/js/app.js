var OBIQApp=null;//global variable
var OBFabricPolygon =null; //stand as global variable
$(document).ready(function(){
    OBIQApp = new BIQApp;
    OBIQApp.init();
//    OBFabricPolygon = new BFabricPolygon({ canvas_drawing : 'bcanvas', canvas_target: OBIQApp.canvas, osd_viewer: OBIQApp.viewer });
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
    
    var overlay = self.viewer.fabricjsOverlay();
    self.canvas = self.viewer.fabricjsOverlay().fabricCanvas();
    self.viewer.addHandler('canvas-click', function(event){
        console.log(event);
    });
    $(window).resize(function() {
        overlay.resize();
        overlay.resizecanvas();
    });
};