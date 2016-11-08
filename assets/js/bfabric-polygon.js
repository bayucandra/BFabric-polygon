var BFabricPolygon = (function(){
    "use strict";
    /**
     * 
     * @param {String} options { canvas_id: canvas id attribute }
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

        self.canvas = new fabric.Canvas(options.canvas_drawing);
        
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            self.canvas.setHeight(window.innerHeight);
            self.canvas.setWidth(window.innerWidth);
            self.canvas.renderAll();
        }
        // resize on init
        resizeCanvas();
        
        self.canvas_target = options.canvas_target;
        self.osd_viewer = options.osd_viewer;

        self.BLineInit(self);
        
        self.strokeWidthLine = 10;
        self.strokeWidthCircle = 1;
        self.circlePointRadius = 30;

        if($.notify){
            var notify_defaults = { autoHideDelay: 2000, globalPosition: 'bottom left' };
            $.notify.defaults(notify_defaults);
        }

        self.lastMouseDownPos = {x:0, y:0};
        self.cursor = {
            lastState : '',//down, up, move
            lastDownPos : {x:0, y:0}
        };
        $('.canvas-container').click(function(e){
//            console.log(e);
//            $('#osd1').click(e);
self.osd_viewer.raiseEvent('canvas-click', e);
            
            $('#osd1').trigger('click', e);
        });
        self.canvas.on('mouse:down', function ( event ) {
            self.cursor.lastState = 'down';
            
//            self.osd_viewer.raiseEvent('canvas-click', event);
            
            var pointer = self.canvas.getPointer( event.e );
            console.log(event);
            self.cursor.lastDownPos.x = pointer.x;
            self.cursor.lastDownPos.y = pointer.y;
        });
        
        self.canvas.on('mouse:up', function ( event ) {
            self.cursor.lastState = 'up';
            var pointer = self.canvas.getPointer( event.e );
            var deltaX = Math.abs( self.cursor.lastDownPos.x - pointer.x );
            var deltaY = Math.abs( self.cursor.lastDownPos.y - pointer.y );
            var deltaMax = 5;
            
            if( ( deltaY > deltaMax ) || ( deltaX > deltaMax ) ){//No drawing if cursor/pointer to far from the 'mouse:down' point coordinate
                return;
            }
            
            if( event.target && event.target.id === self.pointArray[0].id ){// if back to starting point=========
                self.generatePolygon( self.pointArray );
            }else if(self.polygonMode){
                self.addPoint( event );
            }
        });
        
        self.canvas.on('mouse:move', function (options) {
            self.cursor.lastState = 'move';
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
            type:'BLine',
            initialize:function(options, properties){
		options || (options={ });
                var self2 = this;
                self2.callSuper('initialize', options);
                self2.set(properties);
            },
            _render: function(ctx){
                var self2 = this;
                self2.callSuper('_render', ctx);
            }
        });
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
            evented: false,
            strokeWidth: self.strokeWidthLine
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
                strokeWidth: self.strokeWidthLine,
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
            strokeWidth: self.strokeWidthLine,
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
