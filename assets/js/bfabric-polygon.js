var BFabricPolygon = (function(){
    "use strict";
    /**
     * 
     * @param {Object} options { canvas: reference_fabric_canvas }
     * @returns {BFabricPolygon}
     */
    var BFabricPolygon = function( options ){
        var self = this;

        self.min = 99;
        self.max = 999999;
        self.polygonMode = false;
        self.pointArray = new Array();
        self.lineArray = new Array();
        self.activeLine = null;
        self.activeShape = false;
        self.canvas = options.canvas;
        
        self.viewerRatio = 1;//This ratio will be multiplied by some number to get forexample strokeWidth or circle radius etc.

        self.BLineInit(self);
        self.BRectInit(self);
        
        self.strokeWidthLine = 50;
        self.strokeWidthCircle = 10;
        self.circlePointRadius = 50;

        if(jQuery && jQuery().notify){
            var notify_defaults = { autoHideDelay: 2000, globalPosition: 'bottom left' };
            jQuery.notify.defaults(notify_defaults);
        }

        self.canvas.on('mouse:down', function ( event ) {
            if( event.target && event.target.id === self.pointArray[0].id ){// if back to starting point=========
                self.generatePolygon( self.pointArray );
            }else if(self.polygonMode){
                self.addPoint( event );
            }
        });
        
        self.canvas.on('mouse:up', function (options) {

        });
        
        self.canvas.on('mouse:move', function (options) {
            if(self.activeLine === null){return;}
    //            console.log(prototypefabric.activeLine);
    //            console.log(prototypefabric.activeLine.class);
            if(self.activeLine && self.activeLine.get('type') === "BLine"){
                var pointer = self.canvas.getPointer(options.e);
                self.activeLine.set({ x2: pointer.x, y2: pointer.y });//move the 2 point of active line based on cursor position

                var points = self.activeShape.get("points");
                points[ self.pointArray.length ] = {//coordinate to set the last point of activeShape
                    x: pointer.x,
                    y: pointer.y
                };
                self.activeShape.set({
                    points: points
                });
                self.canvas.renderAll();
            }
            self.canvas.renderAll();
        });
    };
    BFabricPolygon.prototype.BLineInit = function(self){
        self.BLine = fabric.util.createClass(fabric.Line, {
            type:'BLine', strokeWidthBase : 10,
            setStroke: function(){
                var self2 = this;
                var strokeWidth = self2.strokeWidthBase / self.viewerRatio;
//                console.log(self2.strokeWidthBase.toString()+' '+self.viewerRatio.toString()+' '+strokeWidth.toString());
                self2.set( { strokeWidth: strokeWidth } );
            },
            initialize:function(options, properties){
		options || (options={ });
                var self2 = this;
                self2.callSuper('initialize', options);
                self2.setStroke();
                self2.set(properties);
            },
            _render: function(ctx){
                var self2 = this;
                self2.callSuper('_render', ctx);
                self2.setStroke();
            }
        });
    };
    BFabricPolygon.prototype.BRectInit = function(self){
        self.BRect = fabric.util.createClass(fabric.Rect, {
            type:'BRect', widthBase : 500, heightBase: 100, leftBase: 300, topBase:200,
            bSetSizes: function(){
                var self2 = this;
                var top = self2.topBase / self.viewerRatio;
                var left = self2.leftBase / self.viewerRatio;
                var width = self2.widthBase / self.viewerRatio;
                var height = self2.heightBase / self.viewerRatio;
                var prop = { top:top, left:left, width:width, height:height };
                self2.set(prop);
            },
            initialize:function(options){
		options || (options={ });
                var self2 = this;
                self2.callSuper('initialize', options);
                self2.bSetSizes();
            },
            _render: function(ctx){
                var self2 = this;
                self2.callSuper('_render', ctx);
                self2.bSetSizes();
            }
        });
    };
    BFabricPolygon.prototype.createBRect = function(){
        var self = this;
        var brect = new self.BRect({
            fill:'#ff0000',
            originX:'left',
            originY:'top'
        });
        self.canvas.add(brect);
        self.canvas.renderAll();
    };
    BFabricPolygon.prototype.drawPolygon = function(){
        var self = this;
        self.polygonMode = true;
        self.pointArray = new Array();
        self.lineArray = new Array();
        self.activeLine = null;
        self.notify("Start drawing polygon","success");
    };
    BFabricPolygon.prototype.addPoint = function(event){
        var self = this;
        var random = Math.floor(Math.random() * ( self.max - self.min + 1)) + self.min;
        var id = new Date().getTime() + random;
        //Start creating the point in circle fabric object==============
        var pointer = self.canvas.getPointer( event.e );
//        console.log(pointer.x.toString()+' '+pointer.y.toString());
        var circle = new fabric.Circle({
            radius: self.circlePointRadius, 
            fill: '#ffffff', 
            stroke: '#333333',
            strokeWidth: self.strokeWidthCircle,
            left: pointer.x, 
            top: pointer.y,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id
        });
        if(self.pointArray.length === 0){
            circle.set({
                fill:'red'
            });
        }
        //Begin creating the line start at current point==============
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y];
        var line = new self.BLine(points, {
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
        self.activeLine = line;
        //BEGIN DRAWING POLIGON BASED ON THE POINTS DEFINED=====================
        if(!self.activeShape){
            var polyPoint = [{x:pointer.x,y:pointer.y}];
            var polygon = new fabric.Polygon(polyPoint,{ 
                left: 0, top: 0,
                stroke:'#333333',
                strokeWidth: self.strokeWidthLine,
                fill: '#cccccc', 
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            self.activeShape = polygon;
            self.canvas.add(polygon);
        }else{//BEGIN REPLACE POLIGON IF EXIST WITH NEW ONE========
            var points = self.activeShape.get("points");
            points.push({
                x: pointer.x,
                y: pointer.y
            });//Add new point based on the click coordinate
            var polygon = new fabric.Polygon(points,{ 
                stroke:'#333333',
                strokeWidth:50,
                fill: '#cccccc', 
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            self.canvas.remove(self.activeShape);
            self.canvas.add(polygon);
            self.activeShape = polygon;
            self.canvas.renderAll();
        }

        self.pointArray.push( circle );
        self.lineArray.push( line );

        self.canvas.add( circle );
        self.canvas.add( line );
        self.canvas.selection = false;
    };
    
    BFabricPolygon.prototype.notify = function( str, msg_type, selector ){
        if(!jQuery){
            return;
        }
        if( jQuery().notify ){
            var is_msg_type = typeof msg_type !== 'undefined' ? true : false;
            var is_selector = typeof selector !== 'undefined' ? true : false;
            
            if( is_msg_type && is_selector){
                jQuery(selector).notify(str, msg_type);
            }else if(is_msg_type){
                jQuery.notify(str, msg_type);
            }else if(is_selector){
                jQuery(selector).notify(str);
            }
        }
    };
    
    BFabricPolygon.prototype.generatePolygon = function( p_pointArray ){
        var self = this;

        var points = new Array();//Store the points before deleting, for latter creation

        $.each( p_pointArray, function( index,point ){
            points.push({
                x:point.left,
                y:point.top
            });
            self.canvas.remove(point);//remove point ( circle point ) after store to points
        });
        $.each( self.lineArray,function(index,line){
            self.canvas.remove(line);//remove lines, now they become not necessary
        });

        self.canvas.remove( self.activeShape ).remove( self.activeLine );//remove the active shape and line

        var polygon = new fabric.Polygon(points,{//Redraw polygon based on helper points coordinate ( the one previously deleted )
            stroke:'#333333',
            strokeWidth:0.5,
            fill: 'red', 
            opacity: 1,
            hasBorders: false,
            hasControls: false
        });
        self.canvas.add(polygon);       

        self.activeLine = null;
        self.activeShape = null;
        self.polygonMode = false;
//        self.drawPolygon();
        self.canvas.selection = true;
    };
    return BFabricPolygon;
})();
