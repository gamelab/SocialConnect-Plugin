
/**
* Created for each game that this plugin is attached to, 
* This object manages the variety of different Social Media sites/SDKs that can be used.
* 
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Manager
* @constructor
* @param game {Kiwi.Game} The game this object is attached to.
*
*/
Kiwi.Plugins.SocialConnect.Manager = function( game ) {


  /**
  * The game that this plugin is attached to.
  * @property game
  * @type Kiwi.Game
  * @public
  */
  this.game = game;

  
  /**
  * The Facebook social plugin.   
  * @property facebook
  * @type Kiwi.Plugins.SocialConnect.Facebook
  * @public
  */
  this.facebook = new Kiwi.Plugins.SocialConnect.Facebook( this.game );



};


/**
* A useful method that allows you to initialise multiple social media SDKS at the same time. 
* 
* To use this method you must pass it an Object,
* which contains the configuration settings for each SDK you want to use.
*
* E.g. To initialise Facebook you would pass { facebook: { appId: '1726287530930783' } } 
* Note: appId used for example purposes only. 
*
* @method init
* @param config {Object}
* @param [config.facebook] {Object} Params to init the Facebook SDK. See the 'init' method Facebook for more details. 
* @public 
*
*/
Kiwi.Plugins.SocialConnect.Manager.prototype.init = function( config ) {

  config = config || {};

  if( config.facebook ) {
    this.facebook.init( socialConfigs.facebook );
  }

  if( config.twitter ) {
    console.error('SocialConnect: Twitter has not been implemented just yet.');
  }

  if( config.google ) {
    console.error('SocialConnect: Google Plus has not been implemented just yet.');
  }

};




 

 