var prototypefabric ={
    min:99, max:999999, 
    polygonMode : true,
    pointArray: new Array(),
    lineArray: new Array(),
    activeLine: null,
    activeShape : false,
    canvas: null
};

prototypefabric.polygon = {
    drawPolygon : function() {
        prototypefabric.polygonMode = true;
        prototypefabric.pointArray = new Array();
        prototypefabric.lineArray = new Array();
        prototypefabric.activeLine;
    },
    addPoint : function(options) {
        var min = prototypefabric.min;
        var max = prototypefabric.max;
        var polygonMode = prototypefabric.polygonMode;
        var pointArray = prototypefabric.pointArray;
        var lineArray = prototypefabric.lineArray;
        var activeLine = prototypefabric.activeLine;
        var activeShape = prototypefabric.activeShape;
        var canvas = prototypefabric.canvas;
        
        var random = Math.floor(Math.random() * ( max - min + 1)) + min;
        var id = new Date().getTime() + random;
        
        var pointer = canvas.getPointer(options.e);
        var circle = new fabric.Circle({
            radius: 50, 
            fill: '#ffffff', 
            stroke: '#333333',
            strokeWidth: 10,
            left: pointer.x, 
            top: pointer.y,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id
        });
        if(pointArray.length == 0){
            circle.set({
                fill:'red'
            });
        }
        var points = [options.e.layerX,options.e.layerY,options.e.layerX,options.e.layerY];
        var line = new fabric.Line(points, {
            strokeWidth: 10,
            fill: '#999999',
            stroke: '#999999',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        if(activeShape){
            var points = activeShape.get("points");
            points.push({
                x: pointer.x,
                y: pointer.y
            });
            var polygon = new fabric.Polygon(points,{ 
                stroke:'#333333',
                strokeWidth:10,
                fill: '#cccccc', 
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        }
        else{
            var polyPoint = [{x:pointer.x,y:pointer.y}];
            var polygon = new fabric.Polygon(polyPoint,{ 
                left: 0, top: 0,
                stroke:'#333333',
                strokeWidth:50,
                fill: '#cccccc', 
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            prototypefabric.activeShape = polygon;
            canvas.add(polygon);
        }
        prototypefabric.activeLine = line;
        console.log(line);
        console.log(prototypefabric.activeLine);

        pointArray.push(circle);
        lineArray.push(line);

        canvas.add(circle);
        canvas.add(line);
        canvas.selection = false;
    },
    generatePolygon : function(pointArray){
        var min = prototypefabric.min;
        var max = prototypefabric.max;
        var polygonMode = prototypefabric.polygonMode;
        var pointArray = prototypefabric.pointArray;
        var lineArray = prototypefabric.lineArray;
        var activeLine = prototypefabric.activeLine;
        var activeShape = prototypefabric.activeShape;
        var canvas = prototypefabric.canvas;
        
        var points = new Array();
        $.each(pointArray,function(index,point){
            points.push({
                x:point.left,
                y:point.top
            });
            canvas.remove(point);
        });
        $.each(lineArray,function(index,line){
            canvas.remove(line);
        });
        canvas.remove(activeShape).remove(activeLine);
        var polygon = new fabric.Polygon(points,{ 
            stroke:'#333333',
            strokeWidth:0.5,
            fill: 'red', 
            opacity: 1,
            hasBorders: false,
            hasControls: false
        });
        canvas.add(polygon);
        
        activeLine = null;
        activeShape = null;
        polygonMode = false;
        canvas.selection = true;
    }
};