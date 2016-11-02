var OBIQApp=null;//global variable
var OBFabricPolygon =null; //stand as global variable
$(document).ready(function(){
    OBIQApp = new BIQApp;
    OBIQApp.init();
    OBFabricPolygon = new BFabricPolygon({ canvas : OBIQApp.canvas });
    
    OBFabricPolygon.createBRect();
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
    $('.maintain_line_check').bootstrapToggle('on');
    var overlay = self.viewer.fabricjsOverlay();
    self.canvas = self.viewer.fabricjsOverlay().fabricCanvas();
    $(window).resize(function() {
        overlay.resize();
        overlay.resizecanvas();
    });
    
    self.zoomRatio = self.viewer.viewport.getZoom() / self.viewer.viewport.imageToViewportZoom(1);
    
    self.viewer.addHandler('zoom', function(event){//update self.zoomRatio and OBFabOBFabricPolygon.viewerRatio on zoom
        self.zoomRatio = event.eventSource.viewport.getZoom() / self.viewer.viewport.imageToViewportZoom(1);
//        console.log(event.eventSource.viewport.getZoom());
        
        if(self.isMaintainFabricSizes){
            OBFabricPolygon.viewerRatio = self.zoomRatio;
        }
    });
};
BIQApp.prototype.zoomActual = function(){
    var self = this;
    self.viewer.viewport.zoomTo(self.viewer.viewport.imageToViewportZoom(1));
};
BIQApp.prototype.maintainFabricSizes = function( event ){
    if( OBFabricPolygon===null ){
        return;
    }
    var self = this;
    self.isMaintainFabricSizes = $(event).prop('checked');
    if(self.isMaintainFabricSizes){
        OBFabricPolygon.viewerRatio = self.zoomRatio;
    }else{
        self.zoomRatio = 1;
        if(OBFabricPolygon!==null)OBFabricPolygon.viewerRatio = 1;
    }
    
};

//var prototypefabric = new function () {
//    
//};