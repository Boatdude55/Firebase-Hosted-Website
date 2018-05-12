import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
    /**
     * @member {Number} tileSize
     * */
    public tileSize;
    
    /**
     * @member {Number} cols
     * */
    public cols;//width/this.tileSize;
    
    /**
     * @member {Number} rows
     * */
    public rows;//height/this.tileSize;
    
    /**
     * @namespace layers
     * @member {Object} layers
     * */
    public layers;/*{
        'base':new Array( (this.cols*this.rows) ),
        'flag': new Array( (this.cols*this.rows) ),
        'heap': new Array( (this.cols*this.rows) ),
        'stack': new Array( (this.cols*this.rows) )
    };*/
  constructor() {
    /**
     * @member {Number} tileSize
     * */
    this.tileSize = 20;
    
    /**
     * @member {Number} cols
     * */
    this.cols = undefined;//width/this.tileSize;
    
    /**
     * @member {Number} rows
     * */
    this.rows = undefined;//height/this.tileSize;
    
    /**
     * @namespace layers
     * @member {Object} layers
     * */
    this.layers = null;/*{
        'base':new Array( (this.cols*this.rows) ),
        'flag': new Array( (this.cols*this.rows) ),
        'heap': new Array( (this.cols*this.rows) ),
        'stack': new Array( (this.cols*this.rows) )
    };*/
    
  }
  
  init ( width, height ) {

    //console.log("mapservice init: ", width, height);
    this.cols = width/this.tileSize;
    
    this.rows = height/this.tileSize;
    
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
  getLayer ( layer ) {
          
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
  getValueAt ( x, y, layer = 'base' ) {
          
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
  putValueAt ( x, y, value , layer = 'base' ) {
          
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
  clear ( layer ) {
          
          this.layers[layer].fill(undefined);
          
          return;
          
      };

}
