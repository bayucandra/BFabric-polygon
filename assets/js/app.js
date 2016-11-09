//var OBIQApp=null;//global variable
//var OBFabricPolygon =null; //stand as global variable
//$(document).ready(function(){
//    OBIQApp = new BIQApp;
//    OBIQApp.init();
//    OBFabricPolygon = new BFabricPolygon({ canvas_drawing : 'bcanvas', canvas_target: OBIQApp.canvas, osd_viewer: OBIQApp.viewer });
//});
(function(angular){
    "use strict";
    var BNgApp = angular.module('BNgApp', ['bsLoadingOverlay', 'ui-notification', 'ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages']);
    BNgApp.controller('BCtrlMain', function( $scope, serviceOSD, SPolygon, SDialog ){
        angular.element(document).ready(function(){
            serviceOSD.init();
        });
        $scope.drawPolygon = function(){
            SPolygon.drawPolygon();
        };
        $scope.dialogForCreate = function(ev){
            SDialog.show(ev, {input_mode : 'create'});
        };
        $scope.dialogForUpdate = function(ev){
            SDialog.show(ev, {input_mode : 'update'});
        };
    });
})(angular);