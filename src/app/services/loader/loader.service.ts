import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
    public controller;
    /**
     * @member {Object} uploadQueue - 'Array' of Objects defining assets
     * */
    public uploadQueue;

    /**
     * @member {Object} cache - Storage for uploaded assets
     * */
    public cache;

    /**
     * @member {Number} successes
     * */
    public successes;
    
    /**
     * @member {Number} failures
     * */    
    public failures;

    /**
     * @member {Object} successfulUploads - Object describing the assets that succesfully loaded for logging
     * */
    public succesfulUploads;

    /**
     * @member {Object} failedUploads - Object describing the assets that failed loading for logging
     * */
    public failedUploads;

    /**
     * @member {Boolean} finished
     * */
    public finished;

  constructor() {
    
    this.controller = null;
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
  
  init ( controller ) {
    this.controller = controller;
  }
  
  /**
   * @memberof AssetManager
   * @function queueUpload
   * @param {Object} asset - Key value pairs of Image urls for game assets
   * @example - asset = {maps: [...urls], screens: [...urls]};
   * */
  queueUpload = function ( asset ) {
  
      var key = Object.keys(asset)[0];
      
      if ( key in this.cache ) {
        console.log("Already exitst: ", key, this.cache);
        return false;
      }else {
        this.uploadQueue.push(asset);
        return true;
      }
      // console.log(this.uploadQueue);
  
  };
  
  /**
   * @memberof AssetManager
   * @function uploadAll
   * @param {Function} cb - Function to call when downloading is finished
   * */
  uploadAll = function ( ) {
  
      var that = this;
      var controller = that.controller;
      
      for ( var j = 0; j < that.uploadQueue.length; j++ ) {
          
          var img = new Image();
          var asset = that.uploadQueue[j];
          var name = Object.keys(asset);
          /**
           * TODO: Fix index search to avoid error TS2538
           * lines: 118, 119, 124, and 142
           * */
          var path = asset.tilemap;
          that.cache.tilemap = img;
  
          img.addEventListener("load", function() {
              
              that.successes += 1;
              that.succesfulUploads.tilemap = img.src;
              
              if (that.isDone()) {
                  
                  //console.info("loaded all assets sussecfully");
                  //controller.game_state = "READY";
                  //controller.MODEL.init();
                  //controller.resize();
                  controller.init();
                  //console.log(that, controller);
  
              }
  
          }, false);
  
          img.addEventListener("error", function( err ) {
  
              that.failures += 1;
              that.failedUploads.tilemap = err;
  
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
  isDone = function () {
  
      return ( this.uploadQueue.length == ( this.successes + this.failures ) );
  
  };
}