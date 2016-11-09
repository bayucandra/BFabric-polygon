(function(angular){
    "use strict";
    angular.module('BNgApp')
        .factory('SPolygon', function(serviceOSD, Notification){
            var ref = new BFabricPolygon({ canvas_drawing : 'bcanvas', canvas_target: serviceOSD.canvas, osd_viewer: serviceOSD.viewer }, Notification);
            return ref;
        });
})(angular);