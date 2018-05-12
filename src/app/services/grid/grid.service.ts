import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {

   /**
     * @member {Boolean} leftClick
     * */
    public leftClick;

    /**
     * @member {Boolean} shift
     * */
    public shift;
    
    /**
     * @member {Object} coords
     * */
    public coords;
    
  constructor() {
        
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
  mapWindowToCanvas ( bbox, x, y, width, height, offsetX, offsetY ) {
      
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
  eventHandler ( event, cols, rows, offsetX, offsetY ) {
          
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

}
