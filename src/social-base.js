
/**
* The Base class used to outline the core functionality that most SocialMedia sites have.
* 
* This class shouldn't be directly created, 
* but instead extended from by other classes implement social media SDKs.
* 
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Base
* @constructor
* @param game {Kiwi.Game} The game that this is being attached to.
* @param name {String} The name of the social media.
* @param [configParams] {Object} Configuration settings outlining which parts the plugins can/cannot do.
* @param [configParams.init=true] {Boolean} If the SDK requires initialisation or not.
* @param [configParams.login=false] {Boolean} If the SDK can log people in, or not.
* @param [configParams.share=false] {Boolean} If the SDK has sharing functionality or not. 
* 
*/ 
Kiwi.Plugins.SocialConnect.Base = function( game, name, configParams ) {


  /**
  * The game that this is a part of.
  * @property game
  * @type Kiwi.Game
  * @public
  */
  this.game = game;


  /**
  * The name of the Social Media which this class contains the functionality for. 
  * @property name
  * @type String
  * @public
  */
  this.name = name;


  /**
  * If the SDK has been initialised yet.
  * @property _initialized
  * @type Boolean
  * @default false
  * @public
  */
  this._initialized = false;

  configParams = configParams || {};


  /**
  * Contains the settings regarding the functionality this plugin contains. 
  * @property settings
  * @type Object
  * @attribute init {Boolean} If it requires initailisation or not. 
  * @attribute login {Boolean} If it supports login or not.
  * @attribute share {Boolean} If it supports sharing or not. 
  * @public
  */
  this.settings = {
    'init': true,   
    'login': false,
    'share': false
  };

  this._readConfig( configParams );

};


/**
* Used to configure the settings property based on an object literal passed.
* Currently used in the constructor.
*
* @method _readConfig
* @param config {Object}
* @private
*/
Kiwi.Plugins.SocialConnect.Base.prototype._readConfig = function( config ) {

  if( typeof config.init !== "undefined" ) { 
    this.settings.init = config.init;
  }

  if( typeof config.login !== "undefined" ) { 
    this.settings.login = config.login;
  }

  if( typeof config.share !== "undefined" ) { 
    this.settings.share = config.share;
  }

};


/**
* If this has been initialised or not.
* @property initialized
* @type Boolean
* @readOnly
* @public
*/
Object.defineProperty( Kiwi.Plugins.SocialConnect.Base.prototype, "initialized", {
    
    get: function () {
        return this._initialized;
    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Handles the initialsation of the Social Media SDK (if necessary).
* 
* Extended classes should create a '_init' method instead of overriding this one
* when creating their own.
*   
* 
* @method init
* @param params {Object} Any parameters required by the SDK. This will be passed to the '_init' method. 
* @return {Boolean} If the init method was called or not.
* @public
*/
Kiwi.Plugins.SocialConnect.Base.prototype.init = function( params ) {

  if( !this.settings.init ) {
    this.log( 'doesn\'t require initialization' );
    return false;
  }

  params = params || {};

  if( this._initialized ) {
    this.log( 'has already been initialized. Skipping re-initalization.', 2 );
    return false;
  }


  //Call the init method if it exists. 
  if( typeof this._init !== "undefined" ) {
    
    var success = this._init.call( this, params );

    if( success ) {
      this._initialized = true;
    } 

    return success;
  }

};


/**
* Handles the login functionality for this Social Media SDK (if necessary).
* 
* Extended classes should create a '_login' method instead of overriding this one
* when creating their own.
*   
* 
* @method login
* @param params {Object} Any parameters required by the SDK. This will be passed to the '_login' method.
* @return {Boolean} If the init method was called or not.
* @public
*/
Kiwi.Plugins.SocialConnect.Base.prototype.login = function( params ) {

  params = params || {};

  if( !this.settings.login ) {
    this.log( 'doesn\'t has login functionality.' );
    return false;
  }

  if( this.settings.init && !this._initialized ) {
    this.log( 'has not been initialized.', 2 );
    return false;
  }

  //Call the init method if it exists. 
  if( typeof this._login !== "undefined" ) {
    
    return this._login.call( this, params );
  }

};


/**
* Handles the share/post functionality for this Social Media SDK (if necessary).
* 
* Extended classes should create a '_share' method instead of overriding this one
* when creating their own.
*   
* 
* @method share
* @param params {Object} Any parameters required by the SDK. This will be passed to the '_share' method.
* @return {Boolean} If the init method was called or not.
* @public
*/
Kiwi.Plugins.SocialConnect.Base.prototype.share = function( params ) {

  params = params || {};

  if( !this.settings.share ) {
    this.log( 'doesn\'t has sharing functionality.' );
    return false;
  }

  if( this.settings.init && !this._initialized ) {
    this.log( 'has not been initialized.', 2 );
    return false;
  }

  //Call the init method if it exists. 
  if( typeof this._share !== "undefined" ) {
    
    return this._share.call( this, params );
  }

};


/**
* A method which handles logging out a message to the console. 
* Used internally only.
* 
* There are three different types of methods which can be used.
* 1 - Uses the 'console.log' method.
* 2 - Uses the 'console.warn' method.
* 3 - Uses the 'console.error' method.
* 
* @method log
* @param string {String} The string that is to be logged out.
* @param [type=1] {Number} The type of method to use when logging out.
* @private
*/
Kiwi.Plugins.SocialConnect.Base.prototype.log = function( string, type ) {

  if( this.game.debug ) {

    string = 'SocialConnect:' + this.name + ' ' + string;

    switch( type ) {

      default:
      case 1:
        console.log( string );
        break;

      case 2:
        console.warn( string );
        break;

      case 3:
        console.error( string );
        break;

    }

  }

};

