import { Injectable } from '@angular/core';
import { MapService } from '../map/map.service';
import { GridService } from '../grid/grid.service';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperService {

      public canvas = null;
      /**
       * @member {Object} ctx
       * @description An instance of a canvas context used to render the game
       * */
      public ctx = null;
      /**
       * @member {Boolean} on
       * @description Keeps track of whether the game is running or not
       * */
      public on = true;
      
      /**
       * @member {Object} tiles
       * @description reference to the images used to render the game
       * */
      public tiles = null;
       
      /**
       * @member {Object} map
       * @constructs CanvasMap
       * @description An instance of CanvasMap
       * */
      public map = null;
      
      /**
       * @member {Object} eventLayer
       * @constructs CanvasEventGrid
       * @description An instance of CanvasEventGrid
       * */
      public eventLayer = null;
      
      /**
       * @member {Number} difficulty
       * @description The current difficulty of the game
       * */
      public difficulty = 4;
      
      /**
       * @member {String} styleBlock
       * @description The image used to render the game tile
       * */
      public styleBlock = 'blue';
      
      /**
       * @member {String} styleMine
       * @description The image used to render the game mine
       * */
      public styleMine = 'mine';
      
      /**
       * @member {Number} blockKeys
       * @enum {Number}
       * @readonly
       * @description Namespace for all tile types for rendering
       * */
      public blockKeys = {
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
      public actionKeys = {
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
      public neighnorHoodKeys = [
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
      public difficultyDict = {
              '7': "easy",
              '4': "medium",
              '2': "hard"
      };
      
  constructor( private mapService: MapService, private gridService: GridService, private loaderService: LoaderService ) {
      //console.log("Constructing");
      
      this.loaderService.init(this);

  }
  
  setup ( canvas ) {

    //console.log("setting up");
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d',{
      alpha: false
    });
    this.mapService.init( canvas.width, canvas.height );
    //console.log("finished mapservice")
    var check = this.loaderService.queueUpload({ "tilemap": "assets/showcase/minesweeper.tileset.png"});
    //console.log(this.loaderService.uploadQueue);
    
    if ( check ) {
      this.loaderService.uploadAll();
    }else {
      this.init();
    }
    return;
  }
  
  init () {

    this.tiles = this.loaderService.cache['tilemap'];
    //console.log("initing: ", this.tiles);
    this.fillMap();
    this.drawMap();

  }
  
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
  clear () {
          
          this.mapService.clear("base");
          this.mapService.clear("stack");
          this.mapService.clear("heap");
          this.mapService.clear("flag");
          this.ctx.clearRect(0,0,(this.mapService.cols*this.mapService.tileSize),(this.mapService.rows*this.mapService.tileSize));
  
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
  end () {
          
          this.drawMap(false,"base",true,true);
          
          return true;
          
      };
      
  /**
  * @memberof MineSweeper
  * @function fillMap
  * @description Fills the base layer with pseudo random values
  * */ 
  fillMap () {
          
          var numOfMines = (this.mapService.layers['base'].length / this.difficulty);
  
          for ( var i = 0 ;  i < this.mapService.layers['base'].length ; i++ ) {
          
              var chance = (numOfMines / this.mapService.layers['base'].length);
              
              if ( chance  > Math.random() ) {
  
                      this.mapService.layers['base'][i] = this.actionKeys[this.styleMine];
              
                  numOfMines--;
                  
              }else {
                  
                  this.mapService.layers['base'][i] = 0;
                  
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
  drawMap ( start = true, layer = 'base', flags = true, end = false ) {
          
          var count = 0;
          var cols = this.mapService.cols;
          var rows = this.mapService.rows;
          //console.log("drawing: ", this.tiles);
          for ( var i = 0 ;  i < cols ; i++ ) {
              
              for ( var j = 0 ;  j < rows ; j++ ) {
                  
                  var curr = this.mapService.getValueAt( i, j, layer );
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
                  
                  if ( flags == false && this.mapService.getValueAt(i,j,"flag") == 18 ) {
                      continue;
                  }
                  
                  this.ctx.drawImage(
                      this.tiles, // image
                      curr * this.mapService.tileSize, // source x
                      0, // source y
                      this.mapService.tileSize, // source width
                      this.mapService.tileSize, // source height
                      i * this.mapService.tileSize,  // target x
                      j * this.mapService.tileSize, // target y
                      this.mapService.tileSize, // target width
                      this.mapService.tileSize // target height
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
  getNeighbors ( x, y ) {
  
          var mines = 0;
  
          mines += this.mapService.getValueAt((x - 1),(y - 1)) | 0;
          //console.log("mines rnd 1? ", mines);
          mines += this.mapService.getValueAt(x,(y - 1)) | 0;
          //console.log("mines rnd 2? ", mines);
          mines += this.mapService.getValueAt((x + 1),(y - 1)) | 0;
          //console.log("mines rnd 3? ", mines);
          mines += this.mapService.getValueAt((x - 1),y) | 0;
          //console.log("mines rnd 4? ", mines);
          mines += this.mapService.getValueAt((x + 1),y) | 0;
          //console.log("mines rnd 5? ", mines);
          mines += this.mapService.getValueAt((x - 1),(y + 1)) | 0;
          //console.log("mines rnd 6? ", mines);
          mines += this.mapService.getValueAt(x,(y + 1)) | 0;
          //console.log("mines rnd 7? ", mines);
          mines += this.mapService.getValueAt((x + 1),(y + 1)) | 0;
          //console.log("mines rnd 8? ", mines);
          return Math.round(( mines / this.actionKeys[this.styleMine]) + this.neighnorHoodKeys[0]);
  
      };
      
  /**
  * @memberof MineSweeper
  * @function reveal
  * @param {Number} x
  * @param {Number} y
  * */ 
  reveal ( x, y ) {
  
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
  recursiveReveal ( x, y ) {
          
          var mines = 0;
  
          if ( this.mapService.getValueAt(x,y) == undefined || isNaN(this.mapService.getValueAt(x,y)) ) {
  
              //console.info("undefined: ",this.map.getValueAt(x,y), x,y);
              return;
  
          }
          
          if ( this.mapService.getValueAt(x,y,"stack") ) {
  
              //console.info("already processed: ", x,y,);
              return;
  
          }
  
          mines = this.getNeighbors(x,y);
  
          if ( isNaN(mines) ) {
              
              return;
              
          }else if ( mines > 8 ) {
  
              this.mapService.putValueAt(x,y,true,"stack");
              this.mapService.putValueAt(x,y,mines,"heap");
              //console.info("mines near: ", x,y,mines);
              return;
              
          }else{
              
              this.mapService.putValueAt(x,y,true,"stack");
              this.mapService.putValueAt(x,y,mines,"heap");
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
  onClick ( event ) {
  
          this.gridService.eventHandler(event, this.mapService.cols, this.mapService.rows, event.target.offsetLeft, event.target.offsetTop);
          this.mapService.clear("heap");
  
          var x, y;
  
          x = (Math.floor(this.gridService.coords[0].x));
          y = (Math.floor(this.gridService.coords[0].y));
          //console.info(this.eventLayer.coords,x,y);
  
          if ( this.gridService.shift ) {
  
              var isFlagged = this.mapService.getValueAt(x,y,"flag") == 18 ? true : false;
  
              if ( isFlagged ) {
  
                  this.mapService.layers["flag"][(y * this.mapService.cols + x)] = this.blockKeys[this.styleBlock];
  
              }else {
  
                  this.mapService.layers["flag"][(y * this.mapService.cols + x)] = 18;
              }
  
              this.drawMap(false,'flag');
              return false; 
              
          }else{
  
              var subject = this.mapService.getValueAt(x,y);
              
              if ( subject == this.actionKeys[this.styleMine] ) {
  
                  return this.end();
                  
              }else if ( subject > this.actionKeys['end'] ) {
                  
                  this.mapService.putValueAt(x,y,subject,"heap");
                  
                  return this.drawMap(false, 'heap', false);
                  
              }else {
  
                  var hasMines = this.getNeighbors(x,y);
  
                  if (  hasMines > 8 ) {
  
                      //console.info("has mines", x,y, hasMines);
                      this.mapService.putValueAt(x,y,true,"stack");
                      this.mapService.putValueAt(x,y,hasMines,"heap");
                      
                  }else {
  
                      this.mapService.putValueAt(x,y,true,"stack");
                      this.mapService.putValueAt(x,y,hasMines,"heap");
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
  setStyle ( block ) {
              
              this.styleBlock = block;
              
      };
      
  /**
  * @memberof MineSweeper
  * @function setDifficulty
  * @param {Number} difficulty
  * */ 
  setDifficulty ( difficulty ) {
          
          this.difficulty = parseInt(difficulty,10);
          
      };
      
  /**
  * @memberof MineSweeper
  * @function getScore
  * @param {Number} score
  * @param {Number} time
  * @returns {Object} Score
  * */ 
  getScore ( score, time ) {
          
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
  getDifficulty () {
          return this.difficulty;
  
  };
}
