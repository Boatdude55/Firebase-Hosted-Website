'use strict';
/**
 * Asset Manager
 * @constructor
 * @description Asset Manager for uploading and storing assets
 * */
function AssetManager ( controller ) {

    this.controller = controller;
    /**
     * @member {Object} uploadQueue - 'Array' of Objects defining assets
     * */
    this.uploadQueue = [];

    /**
     * @member {Object} cache - Storage for uploaded assets
     * */
    this.cache = {};

    this.successes = 0;
    this.failures = 0;

    /**
     * @member {Object} successfulUploads - Object describing the assets that succesfully loaded for logging
     * */
    this.succesfulUploads = {};

    /**
     * @member {Object} failedUploads - Object describing the assets that failed loading for logging
     * */
    this.failedUploads = {};

    this.finished = false;

}

/**
 * @memberof AssetManager
 * @function queueUpload
 * @param {Object} asset - Key value pairs of Image urls for game assets
 * @example - asset = {maps: [...urls], screens: [...urls]};
 * */
AssetManager.prototype.queueUpload = function ( asset ) {

    this.uploadQueue.push(asset);
    // console.log(this.uploadQueue);

};

/**
 * @memberof AssetManager
 * @function uploadAll
 * @param {Function} cb - Function to call when downloading is finished
 * */
AssetManager.prototype.uploadAll = function ( ) {

    var that = this;
    var controller = that.controller;
    
    for ( var j = 0; j < that.uploadQueue.length; j++ ) {
        
        var img = new Image();
        var asset = that.uploadQueue[j];
        var name = Object.keys(asset);
        var path = asset[name];
        that.cache[name] = img;

        img.addEventListener("load", function() {
            
            that.successes += 1;
            that.succesfulUploads[name] = img.src;
            
            if (that.isDone()) {
                
                console.info("loaded all assets sussecfully");
                //controller.game_state = "READY";
                //controller.MODEL.init();
                //controller.resize();
                controller.init();

            }

        }, false);

        img.addEventListener("error", function( err ) {

            that.failures += 1;
            that.failedUploads[err] = img.src;

            if (that.isDone()) {
                
                console.error( that.failedUploads );
                
            }

        }, false);

        img.src = path;

    }

};

/**
 * @memberof AssetManager
 * @function isDone
 * @returns {Boolean}
 * */
AssetManager.prototype.isDone = function () {

    return ( this.uploadQueue.length == ( this.successes + this.failures ) );

};
/**
 * Creates CanvasMap
 * @constructor
 * @description Object for canvas data
 * @param {Number} width
 * @param {Number} height
 * */
function CanvasMap ( width, height ) {
    /**
     * @member {Number} tileSize
     * */
    this.tileSize = 20;
    
    /**
     * @member {Number} cols
     * */
    this.cols = width/this.tileSize;
    
    /**
     * @member {Number} rows
     * */
    this.rows = height/this.tileSize;
    
    /**
     * @namespace layers
     * @member {Object} layers
     * */
    this.layers = {
        'base':new Array( (this.cols*this.rows) ),
        'flag': new Array( (this.cols*this.rows) ),
        'heap': new Array( (this.cols*this.rows) ),
        'stack': new Array( (this.cols*this.rows) )
    };
    
}

/**
* @memberof CanvasMap
* @function getLayer
* @param {String} layer
* */
CanvasMap.prototype.getLayer = function ( layer ) {
        
        return this.layers[layer];
        
    };

/**
* @memberof CanvasMap
* @function getValueAt
* @param {Number} x
* @param {Number} y
* @param {String} layer
* @returns {Object} array from layers
* */    
CanvasMap.prototype.getValueAt = function ( x, y, layer = 'base' ) {
        
        if ( x >= this.cols || x < 0 || y >= this.cols || y < 0 ) {
            
            return undefined;
            
        }else {
            
            return this.layers[layer][x + (this.cols*y)];
            
        }
        
    };
    
/**
* @memberof CanvasMap
* @function putValueAt
* @param {Number} x
* @param {Number} y
* @param {Number} value
* @param {String} layer
* */     
CanvasMap.prototype.putValueAt = function ( x, y, value , layer = 'base' ) {
        
        try {
            
            if ( x >= this.cols || x < 0 || y >= this.cols || y < 0 ) {
                
                throw new RangeError("Index is out of range: Equation = x + (this.cols*y)");
                
            }else {
                
                this.layers[layer][x + (this.cols*y)] = value;
                
            }
        }catch (err) {
            
            console.error(err);
            
        }

    };
    
/**
* @memberof CanvasMap
* @function clear
* @param {String} layer
* */      
CanvasMap.prototype.clear = function ( layer ) {
        
        this.layers[layer].fill(undefined);
        
        return;
        
    };

/**
* @constructor
* @description Object incharge of handling/processing canvas event data
* */
function CanvasEventGrid () {
    
    /**
     * @member {Boolean} leftClick
     * */
    this.leftClick = false;
    
    /**
     * @member {Boolean} shift
     * */
    this.shift = false;
    
    /**
     * @member {Object} coords
     * */
    this.coords = null;
    
}

/**
* @memberof CanvasEventGrid
* @function mapWindowToCanvas
* @param {Object} bbox
* @param {Number} y
* @param {Number} x
* @param {Number} width
* @param {Number} height
* @param {Number} offsetX
* @param {Number} offsetY
* @returns {Object} x,y coords mapped to map area
* */ 
CanvasEventGrid.prototype.mapWindowToCanvas = function ( bbox, x, y, width, height, offsetX, offsetY ) {
    
       return { x: Math.floor((x - bbox.left) * (width  / bbox.width)),
                y: Math.floor((y - bbox.top)  * (height / bbox.height))
              };
              
    };

/**
* @memberof CanvasEventGrid
* @function eventHandler
* @param {Object} event
* @param {Number} cols
* @param {Number} rows
* @param {Number} offsetX
* @param {Number} offsetY
* @returns undefined
* */    
CanvasEventGrid.prototype.eventHandler = function ( event, cols, rows, offsetX, offsetY ) {
        
        this.coords = [];
        
        var coords = this.mapWindowToCanvas( event.target.getBoundingClientRect() ,event.clientX, event.clientY, cols, rows, offsetX, offsetY );

        if ( event.shiftKey ) {
            
            this.shift = true;
            
        }else{
            
            this.shift = false;
            
        }

        this.leftClick = true;
        
        this.coords.push( coords );
        
        return;
};

/**
* @constructor
* @description Object Implements Mine sweeper game
* */
function MineSweeper ( canvas ) {
    
    this.assetManager = new AssetManager(this);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d",{
        alpha: false
    });
    /**
     * @member {Boolean} on
     * @description Keeps track of whether the game is running or not
     * */
    this.on = true;
    
    /**
     * @member {Object} tiles
     * @description reference to the images used to render the game
     * */
    this.tiles = null;
    this.powerups = null;
    /**
     * @member {Object} ctx
     * @description An instance of a canvas context used to render the game
     * */
    this.ctx = null;
    
    /**
     * @member {Object} map
     * @constructs CanvasMap
     * @description An instance of CanvasMap
     * */
    this.map = null;
    
    /**
     * @member {Object} eventLayer
     * @constructs CanvasEventGrid
     * @description An instance of CanvasEventGrid
     * */
    this.eventLayer = null;
    
    /**
     * @member {Number} difficulty
     * @description The current difficulty of the game
     * */
    this.difficulty = 4;
    
    /**
     * @member {String} styleBlock
     * @description The image used to render the game tile
     * */
    this.styleBlock = 'blue';
    
    /**
     * @member {String} styleMine
     * @description The image used to render the game mine
     * */
    this.styleMine = 'mine';
    
    /**
     * @member {Number} blockKeys
     * @enum {Number}
     * @readonly
     * @description Namespace for all tile types for rendering
     * */
    this.blockKeys = {
                    'blue': 0,
                    'black': 1,
                    'grey': 2,
                    'green': 3,
                    'light-blue': 4,
                    'orange': 5,
                    'red': 6,
                    'purple': 7
                };
                
    /**
     * @member {Object} actionKeys
     * @enum {Number}
     * @readonly
     * @description Namespace for all special tiles for rendering
     * */
    this.actionKeys = {
        'mine': 17,
        'flag': 18,
        'end': 19
    };
    
    /**
     * @member {Object} neighnorHoodKeys
     * @description Map indexes of tiles to value of neighbors
     * @example Example: (neighbors = 0) => tile[8]
     * OR (neighbors = 8) => tile[16]
     * */
    this.neighnorHoodKeys = [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
    ];
    
    /**
     * @member {Object} difficultyDict
     * @enum {String}
     * @description Namespace for difficulty levels
     * */
    this.difficultyDict = {
            '7': "easy",
            '4': "medium",
            '2': "hard"
    };

}

MineSweeper.prototype.preLoader = function () {

    this.assetManager.queueUpload( { "tilemap": "assets/showcase/minesweeper.tileset.png"} );
    this.assetManager.uploadAll(); 

};

/**
* @memberof MineSweeper
* @function init
* @param {Object} imgs
* @param {Object} canvas
* @description Initializes variables for gameplay
* */ 
MineSweeper.prototype.init = function ( ) {

        this.tiles = this.assetManager.cache['tilemap'];

        this.eventLayer = new CanvasEventGrid();
        this.map = new CanvasMap( this.canvas.width, this.canvas.height );
        this.fillMap();
        this.drawMap();
        
    };

/**
* @memberof MineSweeper
* @function clear
* @param {Object} event
* @param {Number} cols
* @param {Number} rows
* @param {Number} offsetX
* @param {Number} offsetY
* @returns undefined
* */ 
MineSweeper.prototype.clear = function () {
        
        this.map.clear("base");
        this.map.clear("stack");
        this.map.clear("heap");
        this.map.clear("flag");
        this.ctx.clearRect(0,0,(this.map.cols*this.map.tileSize),(this.map.rows*this.map.tileSize));

    };
    
/**
* @memberof MineSweeper
* @function end
* @param {Object} event
* @param {Number} cols
* @param {Number} rows
* @param {Number} offsetX
* @param {Number} offsetY
* @returns undefined
* */ 
MineSweeper.prototype.end = function () {
        
        this.drawMap(false,"base",true,true);
        
        return true;
        
    };
    
/**
* @memberof MineSweeper
* @function fillMap
* @description Fills the base layer with pseudo random values
* */ 
MineSweeper.prototype.fillMap = function () {
        
        var numOfMines = (this.map.layers['base'].length / this.difficulty);

        for ( var i = 0 ;  i < this.map.layers['base'].length ; i++ ) {
        
            var chance = (numOfMines / this.map.layers['base'].length);
            
            if ( chance  > Math.random() ) {

                    this.map.layers['base'][i] = this.actionKeys[this.styleMine];
            
                numOfMines--;
                
            }else {
                
                this.map.layers['base'][i] = 0;
                
            }
        }
        
    };
    
/**
* @memberof MineSweeper
* @function drawMap
* @param {Boolean} start
* @param {String} layer
* @param {Boolean} flags
* @param {Boolean} end
* @returns {Number} count
* */ 
MineSweeper.prototype.drawMap = function ( start = true, layer = 'base', flags = true, end = false ) {
        
        var count = 0;
        
        for ( var i = 0 ;  i < this.map.cols ; i++ ) {
            
            for ( var j = 0 ;  j < this.map.rows ; j++ ) {
                
                var curr = this.map.getValueAt( i, j, layer );
                curr = start === true ? this.blockKeys[this.styleBlock] : curr;
                
                if ( curr == undefined ) {
                    continue;
                }
                
                if ( curr < 0 ) {
                    continue;
                }
                
                if ( end == false && curr == 17 ) {
                    continue;
                } else if ( end == true && curr < 17 ) {
                    continue;
                }
                
                if ( flags == false && this.map.getValueAt(i,j,"flag") == 18 ) {
                    continue;
                }
                
                this.ctx.drawImage(
                    this.tiles, // image
                    curr * this.map.tileSize, // source x
                    0, // source y
                    this.map.tileSize, // source width
                    this.map.tileSize, // source height
                    i * this.map.tileSize,  // target x
                    j * this.map.tileSize, // target y
                    this.map.tileSize, // target width
                    this.map.tileSize // target height
                );
                
                count++;
                
            }
        }
        
        return count;
        
    };
    
/**
* @memberof MineSweeper
* @function getNeighbors
* @param {Number} x
* @param {Number} y
* @returns undefined
* */ 
MineSweeper.prototype.getNeighbors = function ( x, y ) {

        var mines = 0;

        mines += this.map.getValueAt((x - 1),(y - 1)) | 0;
        //console.log("mines rnd 1? ", mines);
        mines += this.map.getValueAt(x,(y - 1)) | 0;
        //console.log("mines rnd 2? ", mines);
        mines += this.map.getValueAt((x + 1),(y - 1)) | 0;
        //console.log("mines rnd 3? ", mines);
        mines += this.map.getValueAt((x - 1),y) | 0;
        //console.log("mines rnd 4? ", mines);
        mines += this.map.getValueAt((x + 1),y) | 0;
        //console.log("mines rnd 5? ", mines);
        mines += this.map.getValueAt((x - 1),(y + 1)) | 0;
        //console.log("mines rnd 6? ", mines);
        mines += this.map.getValueAt(x,(y + 1)) | 0;
        //console.log("mines rnd 7? ", mines);
        mines += this.map.getValueAt((x + 1),(y + 1)) | 0;
        //console.log("mines rnd 8? ", mines);
        return Math.round(( mines / this.actionKeys[this.styleMine]) + this.neighnorHoodKeys[0]);

    };
    
/**
* @memberof MineSweeper
* @function reveal
* @param {Number} x
* @param {Number} y
* */ 
MineSweeper.prototype.reveal = function ( x, y ) {

            this.recursiveReveal(x - 1,y - 1);
            this.recursiveReveal(x,y - 1);
            this.recursiveReveal(x + 1,y - 1);
            this.recursiveReveal(x - 1,y);
            this.recursiveReveal(x + 1,y);
            this.recursiveReveal(x - 1,y + 1);
            this.recursiveReveal(x,y + 1);
            this.recursiveReveal(x + 1,y + 1);

    };
    
/**
* @memberof MineSweeper
* @function recursiveReveal
* @param {Number} x
* @param {Number} y
* @returns undefined
* */ 
MineSweeper.prototype.recursiveReveal = function ( x, y ) {
        
        var mines = 0;

        if ( this.map.getValueAt(x,y) == undefined || isNaN(this.map.getValueAt(x,y)) ) {

            //console.info("undefined: ",this.map.getValueAt(x,y), x,y);
            return;

        }
        
        if ( this.map.getValueAt(x,y,"stack") ) {

            //console.info("already processed: ", x,y,);
            return;

        }

        mines = this.getNeighbors(x,y);

        if ( isNaN(mines) ) {
            
            return;
            
        }else if ( mines > 8 ) {

            this.map.putValueAt(x,y,true,"stack");
            this.map.putValueAt(x,y,mines,"heap");
            //console.info("mines near: ", x,y,mines);
            return;
            
        }else{
            
            this.map.putValueAt(x,y,true,"stack");
            this.map.putValueAt(x,y,mines,"heap");
            //console.info("is blank at: ", x,y,mines);
            this.reveal(x,y);

        }

    };
/**
* @memberof MineSweeper
* @function onClick
* @param {Object} event
* @returns {Number|Boolean}
* */ 
MineSweeper.prototype.onClick = function ( event ) {

        this.eventLayer.eventHandler(event, this.map.cols, this.map.rows, event.target.offsetLeft, event.target.offsetTop);
        this.map.clear("heap");

        var x, y;

        x = (Math.floor(this.eventLayer.coords[0].x));
        y = (Math.floor(this.eventLayer.coords[0].y));
        //console.info(this.eventLayer.coords,x,y);

        if ( this.eventLayer.shift ) {

            var isFlagged = this.map.getValueAt(x,y,"flag") == 18 ? true : false;

            if ( isFlagged ) {

                this.map.layers["flag"][(y * this.map.cols + x)] = this.blockKeys[this.styleBlock];

            }else {

                this.map.layers["flag"][(y * this.map.cols + x)] = 18;
            }

            this.drawMap(false,'flag');
            return false; 
            
        }else{

            var subject = this.map.getValueAt(x,y);
            
            if ( subject == this.actionKeys[this.styleMine] ) {

                return this.end();
                
            }else if ( subject > this.actionKeys['end'] ) {
                
                this.map.putValueAt(x,y,subject,"heap");
                
                return this.drawMap(false, 'heap', false);
                
            }else {

                var hasMines = this.getNeighbors(x,y);

                if (  hasMines > 8 ) {

                    //console.info("has mines", x,y, hasMines);
                    this.map.putValueAt(x,y,true,"stack");
                    this.map.putValueAt(x,y,hasMines,"heap");
                    
                }else {

                    this.map.putValueAt(x,y,true,"stack");
                    this.map.putValueAt(x,y,hasMines,"heap");
                    //console.info("begining recursion",x,y);
                    this.reveal( x, y );

                }

                return this.drawMap(false, 'heap', false);

            }

        }

    };
    
/**
* @memberof MineSweeper
* @function setStyle
* @param {String} block
* */ 
MineSweeper.prototype.setStyle = function ( block ) {
            
            this.styleBlock = block;
            
    };
    
/**
* @memberof MineSweeper
* @function setDifficulty
* @param {Number} difficulty
* */ 
MineSweeper.prototype.setDifficulty = function ( difficulty ) {
        
        this.difficulty = parseInt(difficulty,10);
        
    };
    
/**
* @memberof MineSweeper
* @function getScore
* @param {Number} score
* @param {Number} time
* @returns {Object} Score
* */ 
MineSweeper.prototype.getScore = function ( score, time ) {
        
        return [
            "score="+score,
            "time="+time,
            "rank="+ this.difficultyDict[this.difficulty]
        ];
    };
    
/**
* @memberof MineSweeper
* @function getDifficulty
* @returns {Number} difficulty
* */ 
MineSweeper.prototype.getDifficulty = function () {
        return this.difficulty;

};

/**
 * Creates A Stop watch
 * @constructor
 * @description Object that implements a stop watch
 * @param {Object} viewElem
 * */
function timeController ( viewElem ) {
    
    /**
     * @member {Object}
     * @private
     * */
    var view = viewElem;
    
    /**
     * @member {String}
     * @public
     * */
    this.id = undefined;
    
    /**
     * @member {Boolean}
     * @public
     * */
    this.isOn = false;
    
    /**
     * @member {Function} start
     * @function start
     * */
    this.start = function () {
        
        this.id = setInterval(onChange, 1000);
        this.isOn = true;
    }
    
    /**
     * @member {Function} stop
     * @function stop
     * */
    this.stop = function ( ) {
        
        if ( this.id ) {
            
            clearInterval(this.id);
            this.isOn = false;
            
        }
    }
    
    /**
     * @member {Function} onChange
     * @function onChange
     * */
    function onChange ( ) {
        
        view.value++;
        
    }
    
}