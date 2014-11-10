
/**
* The description of SocialConnect goes here
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class SocialConnect
* @main
*/
Kiwi.Plugins.SocialConnect = {
  
  /**
  * The name of this plugin.
  * @property name
  * @type String
  * @public
  */
  name:'SocialConnect',

  /**
  * The version of this plugin.
  * @property version
  * @type String
  * @public
  */
  version:'0.8.0',

  /**
  * The minimum version of Kiwi that the plugin requires.
  * @property minimumKiwiVersion
  * @type String
  * @public
  */
  minimumKiwiVersion:'1.0.0'

};


// Registers this plugin with the Global Kiwi Plugins Manager.
Kiwi.PluginManager.register(Kiwi.Plugins.SocialConnect);



/**
* Executed when the plugin has been told it is to be used with a particular game.
* @method create
* @param game {Kiwi.Game} 
* @public
*/
Kiwi.Plugins.SocialConnect.create = function( game ) {

  game.social = new Kiwi.Plugins.SocialConnect.Manager( game );

};



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
  * The Gamefroot account creation plugin.
  * @property gamefroot
  * @type Kiwi.Plugins.SocialConnect.Gamefroot
  * @public
  */
  this.gamefroot = new Kiwi.Plugins.SocialConnect.Gamefroot( this.game );

  
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

  if( config.gamefroot ) {
    console.warn('SocialConnect: Gamefroot does not need initialising.');
  }

  if( config.facebook ) {
    this.facebook.init( config.facebook );
  }

  if( config.twitter ) {
    console.error('SocialConnect: Twitter has not been implemented just yet.');
  }

  if( config.google ) {
    console.error('SocialConnect: Google Plus has not been implemented just yet.');
  }

};




 

 

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




/**
* Contains the functionality for handling/communicating with the Facebook SDK.
*
* This Plugin will check to see the Facebook SDK already exists when it is created,
* and a second time when the init method is called. 
* If the SDK is not found, one is loaded for you when the 'init' method is called. 
*  
*
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Facebook
* @extends Kiwi.Plugins.SocialConnect.Base
* @constructor
* @params game {Kiwi.Game} The Kiwi game, that this plugin is attached to.
* 
*/
Kiwi.Plugins.SocialConnect.Facebook = function( game ) {


  Kiwi.Plugins.SocialConnect.Base.call( this, game, 'Facebook', {
    'login': true,
    'share': true
  } );


  /**
  * Contains the facebook 'userID' of a user currently logged into facebook. 
  * This is set when you use the 'login/loginApproved' methods and is used in the 'loggedIn'
  * getter.
  * @property userID
  * @type any
  * @default null
  * @public
  */
  this.userID = null;


  /**
  * The same as the raw information returned from the 'me' method.
  * @property userInfo
  * @type Object
  * @public
  */
  this.userInfo = {};


  /**
  * Indicates if the Facebook SDK is ready to used or not. 
  * This will be 'false' if the SDK did not exist before hand and we are loading it in.
  * @property _ready
  * @type boolean
  * @public
  */
  this._ready = false;



  /**
  * The URL of the Facebook SDK that should be loaded in if needed.
  * In the case of CocoonJS, this is the channelUrl.
  * @property sdkUrl
  * @type String
  * @default http://connect.facebook.net/en_US/sdk.js
  * @public
  */
  //Note: CocoonJS doesn't like it when you miss out the protocol at the start.
  this.sdkUrl = 'http://connect.facebook.net/en_US/sdk.js';


  /**
  * Indicates if the Plugin is configured to be used with cocoon or not.
  * @property _cocoon
  * @type boolean
  * @private
  */
  this._cocoon = false;


  //Detect if we are targetting CocoonJS or not.
  if( this.game.deviceTargetOption == Kiwi.TARGET_COCOON ) {

    this._cocoon = true;

    //Has the CocoonJS Plugin been added or not.
    if( !Cocoon || !Cocoon.Social.Facebook ) {

      this.log( 'CocoonJS intergration requires you to include the Cocoon JavaScript library.', 3 );
      this._ready = false;
      return;

    }


    /**
    * The Facebook SDK Object we are using to query facebook.
    * Accessing this property will allow you to do advanced queries.
    * 
    * @property fb
    * @type Object
    * @public
    */
    this.fb = Cocoon.Social.Facebook;

    this._ready = true;

  } else {


    //Detect if Facebook Connect JavaScript file has been included.
    this._SDKLoaded();


  }

};

Kiwi.extend( Kiwi.Plugins.SocialConnect.Facebook, Kiwi.Plugins.SocialConnect.Base );


/**
* Returns a flag indicating whether or not the SDK has already been loaded or not.
* Not applicable if targetting CocoonJS.
* 
* @method _SDKLoaded
* @return boolean
* @private
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._SDKLoaded = function() {

  var loaded = ( typeof window.FB !== "undefined" );

  if( loaded ) {
      this.fb = window.FB;
      this._ready = true;
  }

  return;
};


/**
* Loads in the Facebook SDK. Doesn't check to see if it already exists or not.
* 
* @method _include
* @param onLoadCallback {Function} A method to be executed when the script has been successfully included.
* @private
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._include = function( onloadCallback ) {

  if( typeof region == "undefined" ) {
    region = 'en_US';
  } 

  var js, fjs = document.getElementsByTagName("script")[0];
  
  js = document.createElement("script"); 

  if( typeof onloadCallback !== "undefined" ) {
    js.onload = onloadCallback;
  }

  js.id = 'facebook-jssdk';
  js.src = this.sdkUrl;
  
  fjs.parentNode.insertBefore(js, fjs);

};


/**
* Indicates if the Facebook SDK is ready to used or not. 
* This will be 'false' if the SDK did not exist before hand and we are loading it in.
* This is READ ONLY.
* 
* @property ready
* @type boolean
* @readOnly
* @public
*/
Object.defineProperty( Kiwi.Plugins.SocialConnect.Facebook.prototype, "ready", {
    
    get: function () {
        return this._ready;
    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Initialises the Facebook SDK with the details you pass. 
*
* You pass parameters through a 'parameters' object.
* The only required parameter is the 'appId', which you will find on the Facebook Developers Dashboard.
* 
* More paramters can be found at 'https://developers.facebook.com/docs/javascript/reference/FB.init/v2.1'. 
* 
* @method init
* @param params {Object} 
* @param params.appId {String} The id of the App this is for. 
* @param [params.version='v2.2'] {String} The version of the SDK to use.
* @param [params.status=true] {Boolean} https://developers.facebook.com/docs/javascript/quickstart/v2.2#status
* @return {Boolean} Indicates if enough information was passed to attempt to call the 'init' method or not.
* @public
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._init = function( params ) {

  //Preform init..
  if( !params.appId ) {
    this.log( 'AppId is undefined.', 3 );
    return false;
  }

  //Preset optional params
  params.version = params.version || 'v2.2';
  
  if( typeof params.status == "undefined" ) {
    params.status = true;
  } 


  if(this.game.deviceTargetOption == Kiwi.TARGET_COCOON && !params.channelUrl) {
    params.channelUrl = this.sdkUrl;
  }


  if( this.game.deviceTargetOption !== Kiwi.TARGET_COCOON && !this._SDKLoaded() ) { //Check again for support

    this.log( 'SDK not detected. Loading one in, and initializing after.', 2 );

    var that = this;

    window.fbAsyncInit = function() {
      FB.init( params );
      that._SDKLoaded();
    };

    this._include( );
    return true;

  } else {

    this.fb.init( params );
    return true;

  }

};


/**
* Login the user with Facebook. 
* The permissions dialog will appear if the user has not accepted it before 
* OR the information being requested has changed.
* 
* See the Facebook Docs for more information. 
* 'https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.2'
*
* If the user is successfully logged in, then the property 'userID' will be set.
* Note: For CocoonJS this will just be -1 as we will not have the userID.
*
* The Callback attached will have three properties:
* 1 - Accessable:Boolean - If the user is logged in and accepted the terms of use.
* 2 - Response: Object - The response returned by Facebook (or cocoon)
* 3 - LoggedIn: Boolean - (Not visible in Cocoon) If the user is logged in or not, regardless of accepting the conditions.
* 
* @method login 
* @param [params={}] {Object}
*   @param [params.callback] {Function}
*   @param [params.context] {Any}
*   @param [params.options.scope] {String} CSV set of information that you app requests.
*   See https://developers.facebook.com/docs/facebook-login/permissions/v2.1
* @public
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._login = function( params ) {

  var that = this;

  //If we are wanting to login with gamefroot, then call the 'loginWithFB' method on the GF class.
  if( params.loginWithGF ) {
    this.game.social.gamefroot.loginWithFB( params );
    return true;
  }

  //Attempt to login
  this.fb.login( function( resp ) {

    var accessable = false;
    var loggedIn = false;

    //If we have the 'connected' status, then we have logged in
    if( resp.status == "connected" ) {
      loggedIn = true;
      accessable = true;
      that.userID = resp.authResponse.userID;

    } else if( resp.status == 'not_authorized' ) {
      loggedIn = true;
      accessable = false;

    }

    //Execute the login callback, if it exists.
    if( typeof params.callback !== "undefined" ) {
      params.callback.call( params.context, accessable, resp, loggedIn );
    }

  }, params.options );

  return true;
};


/**
* Used to quickly see if a user was logged in or not last time the 'login' or 'loginApproved' methods were called.
* This is READ ONLY.
*
* @property loggedIn
* @type boolean
* @default false
* @readOnly
* @public
*/
Object.defineProperty( Kiwi.Plugins.SocialConnect.Facebook.prototype, "loggedIn", {
    
    get: function () {

      return (this.userID !== null);

    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Returns a boolean to a callback which is passed, which is used to see if the user is logged in or not.
* The callback will be passed THREE parameters.
* One: Boolean - If the user is logged in, and has accepted the terms of use. 'Accessable'
* Two: Boolean - If the user is logged in or not.
* Three: Object - Raw information passed by the Facebook 'loginApproved' call.
*
* Note: Does NOT work with CocoonJS. Use the 'loggedIn' and 'login' methods instead.
* 
* @method loginApproved
* @param params {Object}
*   @param params.callback {Function} Callback method which is called when information is recieved.
*   @param [params.context] {Any} The context the callback should be executed with. 
* @public
* @return {Boolean} If the api call was made or not.
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.loginApproved = function( params ) {

  if( !params || !params.callback ) {
    this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
    return false;
  }

  var that = this;

  this.fb.getLoginStatus( function( resp ) {

    var loggedIn = false;
    var accessable = false;

    switch( resp.status ) {
      
      case 'connected':
        loggedIn = true;
        accessable = true;
        that.userID = resp.authResponse.userID;
        break;

      case 'not_authorized':
        loggedIn = true;

      default:
        accessable = false;
        break;
    }

    params.callback.call( params.context, accessable, loggedIn, resp );

  } );

  return true;

};


/**
* Checks to see if the user has accepted the permissions that you pass to this method.
*
* Callbacks fired from this method have the following parameters in this order.
* - PermissionsGranted:Boolean - All user has accepted all the permissions you passed.
* - PermissionsAccepted: Array - An array of strings, each one being a permission the user has accepted.
* - Response: Any - The raw response recieved from Facebook.
*
* To Do: params.attemptToResolve - If when detected that the user doesn't have the persmissions required,
*         a login dialog with the permissions should automatically be called.
* 
* @method hasPermissions
* @param params {Object} Parameters object which should hold the information you need to pass.
*   @param param.permissions {Array} An array of strings, each one being a permission you currently need. No duplicates.
*   @param params.callback {Function} Function to be executed after we get the result.
*   @param [params.context] {Any} The context that the callback should run in. 
* @return {Boolean} If the request to the Graph API was made or not.
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.hasPermissions = function( params ) {
  
  if( !params || !params.permissions ) {
    this.log( 'you need to pass an array of permissions.', 2 );
    return false;
  }

  if( !params.callback ) {
    this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
    return false;
  }

  if( !this.loggedIn ) {
    this.log( 'we could not detected if the user is currently logged in.', 2 );
    params.callback.call( params.context, false, [] );
    return false;
  }

  //Make the request
  this.fb.api( this.userID + '/permissions', function( resp ) { 
    
    var i, cRespPerm, cPassPerm, permLength, 
      numPermsMatch = 0,
      acceptedPerms = [];

    //Loop through the permissions recieved by facebook.
    for (var i = 0, len = resp.data.length; i < len; i++) {

      cRespPerm = resp.data[i];

      //If the permission was granted
      if( cRespPerm.status == 'granted') {

        acceptedPerms.push( cPassPerm );
        permLength = params.permissions.length;


        //Loop through the permissions the dev passed.
        while(permLength--){
          cPassPerm = params.permissions[permLength];

          //If it matches one that 
          if( cRespPerm.permission == cPassPerm ) {
            numPermsMatch++;
          }
        }

      }
    }

    //If the number of permissions that matched is greater than the number passed, then success.
    if( numPermsMatch >= params.permissions.length ) {
      params.callback.call( params.context, true, acceptedPerms, resp );

    } else {
      params.callback.call( params.context, false, acceptedPerms, resp );

    }


  } );

  return true;
};



/**
* Logs the user out of Facebook. 
* 
* @method logout
* @param [params] {Object} 
* @param [params.callback] {Function}
* @param [params.context] {Any}
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.logout = function( params ) {

  params = params || {};

  var that = this;

  this.fb.logout( function( resp ) {

    that.userID = null;
    that.userInfo = null;

    if( typeof params.callback !== "undefined" ) {
      params.callback.call( params.context, resp );
    }

  }.bind(this) );

};


/**
* Will attempt to get the currently logged in users information. 
*
* You can get the information recieved either by attaching a callback, whos first parameter will be facebooks response.
* OR you can get the infomation via the 'userInfo' property (if the 'saveData' parameter is set to true).
*
* Advanced Functionality: If you enable 'autoLoadPicture' if the plugin detects a picture URL has been passed,
* then it will be loaded into Kiwi.
* The picture will use the 'pictureKey's param value as the key.
* You may need to rebuild the texture library to use it. 
* This can be turned off by setting 'autoLoadPicture' to false.
* 
* Watch Out! Be careful not to use this functionality during the preload phase of the State! Otherwise it will break the loop functionality.
*  
*
* @method me
* @param [params] {Object}
*   @param [params.callback] {Function} Method to be executed when the information is recieved. 
                                        Will have the Facebook resp data passed as the first parameter.
*   @param [params.context] {Any} The context the callback should be executed in.
*   @param [params.fields] {String} The fields that should be returned/received by Facebook. This is passed as a CSV.
                                    See 'https://developers.facebook.com/docs/graph-api/reference/v2.2/user' for a full list of values.
*   @param [params.autoLoadPicture=false] {Boolean} If any picture URL when detected should be loaded into Kiwi.
*   @param [params.pictureKey='fb-current-user'] {String} The key for the picture URL should use, if detected.
*   @param [params.saveData=true] {Boolean} If the information recieved should be saved in the 'userInfo' property or not.
* @return {Boolean} If the request was made.
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.me = function( params ) {

  if( !this._init || !this._ready ) {
    this.log( 'has not been initialized, or isn\'t ready.', 2 );
    return false;
  }

  if( !this.loginApproved ) {
    this.log( 'user is not logged in', 3 );
    return false;
  }

  params = params || {};
  if( !params.pictureKey ) {
    params.pictureKey = 'fb-current-user';
  }

  if( !params.fields ) {
    params.fields = '';
  }  else {
    params.fields = '?fields=' + params.fields;
  }


  var that = this;

  this.fb.api( '/me' + params.fields , function( resp ) {

    if( params.saveData || typeof params.saveData == "undefined" ) {
      that.userInfo = resp;
    }

    //Detect if a picture is there. If there is then load it, if 'autoLoadPicture' is set to true.
    if( params.autoLoadPicture && resp.picture && resp.picture.data && resp.picture.data.url ) {
      
      that._loadImage( params.pictureKey, resp.picture.data.url, params.callback, params.context, resp );

    } else {

      if( typeof params.callback !== "undefined" ) {
        params.callback.call( params.context, resp );
      }

    }

  });

  return true;
};


/**
* Uses the Kiwi.JS core file loader to load a Image URL into the fileStore. 
* Executes the callback/context passed with the callbackParams as the first parameter of the callback 
*
* @method _loadImage
* @param key {String} Key that the image will have in Kiwi.
* @param url {String} URL of the image to load in.
* @param [callback] {Function} Callback to fire when the file has been loaded in.
* @param [context] {Any} Context the callback should be executed in.
* @param [callbackParams] {Any} 
* @public
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._loadImage = function( key, url, callback, context, callbackParams ) {

  callbackParams = callbackParams || null;

  var that = this;

  //Load complete methods
  this.game.loader.init( null, function() {


    //Get the new file from the file store
    var file = that.game.fileStore.getFile( key );

    //Check to see if the file is a texture
    if( file.isTexture ) {

      //Add the new image to the texture library
      that.game.states.current.textureLibrary.addFromFile( file );

    }


    if( typeof callback !== "undefined" ) {
      callback.call( context, callbackParams );
    }

  });

  //Adds the image to the file loading queue.
  this.game.loader.addImage( key, url );
  this.game.loader.startLoad();

};


/**
* Loads in the current logged-in users facebook picture. 
*
* Note: This may not always work in WebGL due to CORS and tainted images allowed to be used. 
* 
* @method myImage
* @param [params] {Object}
*   @param [params.width] {Number} The width of the image to be used.
*   @param [params.height] {Number} The height of the image to be used.
*   @param [params.pictureKey='fb-current-user'] {String} Key that the picture should have in the kiwi library. 
*   @param [params.callback] {Function} Method to be executed when the information is recieved. 
                                        Will have the Facebook resp data passed as the first parameter.
*   @param [params.context] {Any} The context the callback should be executed in.
* @return {Boolean} If the api call was made.
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.myImage = function( params ) {

  if( !this._init || !this._ready ) {
    this.log( 'has not been initialized, or isn\'t ready.', 2 );
    return false;
  }

  if( !this.loginApproved ) {
    this.log( 'user is not logged in', 3 );
    return false;
  }

  params = params || {};
  if( !params.pictureKey ) {
    params.pictureKey = 'fb-current-user';
  }

  if( !this.loggedIn ) {
    this.log( 'we could not detected if the user is currently logged in.', 2 );
    params.callback.call( params.context, false, [], resp );
    return false;
  }

  var that = this;
  var url = this.userID + '/picture?';

  if( params.width ) url += 'width=' + params.width + '&';
  if( params.height ) url += 'height=' + params.height + '&'; 


  this.fb.api( url, function( resp ) {

    if( resp.data && resp.data.url ) {
      that._loadImage( params.pictureKey, resp.data.url, params.callback, params.context, resp );

    } else {
      params.callback.call( params.context, resp );

    }

  });

};


/**
* Opens up the facebook share popup window.
* Default link is the current location of the browser (Not for CocoonJS).
* This link can be changed via setting the 'link' property on the param object. 
*
* Note: Since this opens a 'pop-up' window, you should make sure to call this method
* inside callbacks attached to the 'input' manager on core Kiwi game objects. 
* 
* @method share
* @param [params] {Object}
* @param [params.link] {String} The URL that the user is to share.
* @param [params.callback] {Function} A method to be executed when the share window closes.
* @param [params.context] {Any} The context that callback should be executed with.
* @public
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype._share = function( params ) {

  params = params || {};

  params.method = 'share';

  if( typeof params.link == "undefined" && !this._cocoon ) {
    params.link = window.location.href;
  }

  if( this._cocoon ) {
    
    this.fb.showShareDialog( params, function( resp ) {

      //Execute the login callback, if it exists.
      if( typeof params.callback !== "undefined" && typeof params.context !== "undefined" ) {
        params.callback.call( params.context, resp );
      }

    } );

  } else {

    if( typeof params.link !== "undefined" ) {
      params.href = params.link;
      delete params.link;
    }

    this.fb.ui( params, function( resp ) {

      //Execute the login callback, if it exists.
      if( typeof params.callback !== "undefined" && typeof params.context !== "undefined" ) {
        params.callback.call( params.context, resp );
      }

    });

   }

};

 

/**
* Contains the functionality for creating/logging into gamefroot accounts.  
*
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Gamefroot
* @extends Kiwi.Plugins.SocialConnect.Base
* 
*/
Kiwi.Plugins.SocialConnect.Gamefroot = function( game ) {

  Kiwi.Plugins.SocialConnect.Base.call(this, game, 'Gamefroot', {
    'login': true,
    'share': false,
    'init': false
  });


  /**
  * Indicates if the api is ready to make a request to the gamefroot servers or not.
  * @property _ready
  * @type Boolean
  * @default true
  * @private
  */
  this._ready = true;


  /**
  * Stores the users information from the last time he logged in. 
  * @property userInfo
  * @type Object
  * @default null
  * @public
  */
  this.userInfo = null; 


  /**
  * The amount of time (in milliseconds) to wait for a response before timing out.
  * @property timeout
  * @type number
  * @default 30000
  * @public
  */
  this.timeout = 30000;


  /**
  * The url of the gamefroot server to use. 
  * See 'Kiwi.Plugins.SocialConnect.Gamefroot.ServerURL' for options. 
  * @property serverURL
  * @type string
  * @default ServerURL.LIVE
  * @public
  */
  this.serverURL = Kiwi.Plugins.SocialConnect.Gamefroot.ServerURL.LIVE;

};

Kiwi.extend( Kiwi.Plugins.SocialConnect.Gamefroot, Kiwi.Plugins.SocialConnect.Base );


/**
* Namespace which holds the URLs of gamefroot api servers.
* @property ServerURL
* @type Object
* @public
* @static
* @readOnly
*/
Kiwi.Plugins.SocialConnect.Gamefroot.ServerURL = {

  /**
  * Contains the url for the live version of gamefroot.
  * @property ServerURL.LIVE
  * @type string
  * @public
  * @readOnly
  * @static
  */
  LIVE: 'http://198.206.133.200:8081/api/',

  /**
  * Contains the url for the debug (also known as staging) version of gamefroot.
  * @property ServerURL.DEBUG
  * @type string
  * @public
  * @readOnly
  * @static
  */
  DEBUG: 'http://staging.gamefroot.com:8081/api/'

};


/**
* Indicates if the API is ready to make a request or not. 
* This would only ever be 'false' if we are midway through another API call.
* This is READ ONLY.
* 
* @property ready
* @type boolean
* @readOnly
* @public
*/
Object.defineProperty( Kiwi.Plugins.SocialConnect.Gamefroot.prototype, "ready", {
    
    get: function () {
        return this._ready;
    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Indicates if the user is logged in or not.
* Maintains its values from the login and logout methods on this class, 
* so it is not an accurate representation. 
* READ ONLY.
*  
* @property loggedIn
* @type boolean
* @readOnly
* @public
*/
Object.defineProperty( Kiwi.Plugins.SocialConnect.Gamefroot.prototype, "loggedIn", {
    
    get: function () {
        return ( this.userInfo !== null );
    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Registers a new gamefroot account. 
* A callback is required to be passed and the first parameter will indicate success.
* 
* @method register
* @param params {Object} The parameters required
*   @param params.username {String} The username that the user would like to use.
*   @param params.password {String} The password the user wants.
*   @param params.email {String} The email of the user.
*   @param params.passwordrepeat {String} Confirmation password. 
*   @param params.callback {Function} Function to be executed when complete.
*   @param [params.context] {Any} Context the callback should be executed in.
* @public
* @return {Boolean} If the API call was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype.register = function( params ) {

  params = params || {};

  if( !params.callback ) {
    this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
    return false;
  }

  if( !params.username || !params.password || !params.email || !params.passwordrepeat ) {
    this.log( 'not all of the needed parameters have been passed.', 2 );
    return false;
  };

  var data = {
    'usrn': params.username,
    'psw': params.password,
    'email': params.email,
    'repsw': params.passwordrepeat
  };

  return this._apiRequest( 'account/register', data, function( type, data ) {

    //If there was an error.
    if( type == 2 ) {
      params.callback.call( params.context, false, data );

    } else if( data.result == "success" ) {
      params.callback.call( params.context, true, data );
    
    } else {
      params.callback.call( params.context, false, data );
    
    }

  }, true);
;
};


/**
* Login using a gamefroot account. Does not include facebook login functionality. 
* A callback is required to be passed and the first parameter will indicate success.
* 
* @method login
* @param params {Object} The parameters required
*   @param params.username {String} The username that the user would like to use.
*   @param params.password {String} The password the user wants.
*   @param params.callback {Function} Function to be executed when complete.
*   @param [params.context] {Any} Context the callback should be executed in.
* @public
* @return {Boolean} If the API call was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._login = function( params ) {

  if( !params.callback ) {
    this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
    return false;
  }

  if( !params.username || !params.password ) {
    this.log( 'not all of the needed parameters have been passed.', 2 );
    return false;
  };

  var data = {
      'usrn': params.username,
      'psw': params.password,
      'ref': this.game.stage.name
  };
  var that = this;

  return this._apiRequest( 'account/login', data, function( type, data ) {

    //If there was an error.
    if( type == 2 ) {
      params.callback.call( params.context, false, data );

    } else if( data.result) {
      if( data.result == 'fail' ) {
        params.callback.call( params.context, false, data );

      } else {
        that.userInfo = data;
        params.callback.call( params.context, true, data);
      }
   

    } else {
      params.callback.call( params.context, false, data );
    
    }

  }, true);

};


/**
* Login to gamefroot using facebook. 
* A callback is required to be passed and the first parameter will indicate success.
* 
* @method loginWithFB
* @param params {Object} The parameters required
*   @param params.callback {Function} Function to be executed when complete.
*   @param [params.context] {Any} Context the callback should be executed in.
*   @param [params.options.scope] {String} CSV set of information that you app requests from facebook.
* @public
* @return {Boolean} If the API call was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype.loginWithFB = function( params ) {

  params = params || {};

  if( !params.callback ) {
    this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
    return false;
  }

  return this.game.social.facebook.loginApproved( { 

    context: this,

    callback: function( approved ) {

      if( approved ) {
        this._fbRetrieveUserData( params );

      } else {

        this.game.social.facebook.login( { 
          context: this, 
          options: params.options,
          
          callback: function( success ) {

            if( !success ) {
              params.callback.call( params.context, false, 'not logged into facebook.' );
              return;
            }

            //Get the users information
            this._fbRetrieveUserData( params );

          } 

        } ); //login end.

      } //endif.

    } //loginApproved callback.

  } ); // loginApproved end.

};


/**
* Contains the second steps code in logging into gamefroot using facebook. 
* Handles getting the users information.
* 
* @method _fbRetrieveUserData
* @param params {Object} Parameters from the first step.
* @private
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._fbRetrieveUserData = function( params ) {

  //Get the users information off facebook, and send that to gf
  var success = this.game.social.facebook.me( { 
    context: this,
    callback: function( resp ) {

      //Login to GF using that information..
      this._fbLoginToGF( resp, params );

    }
  } );

  if( !success ) {
    params.callback.call( params.context, false, 'error with getting information from facebook.');
  }

};


/**
* Final step in logging into gamefroot using facebook.
* Contains the code communicating to gamefroot, which then creates its account.
* 
* @method _fbLoginToGF
* @param resp {Object} The users information as retrieved by facebook.
* @param params {Object} Parameters from the first step.
* @private
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._fbLoginToGF = function( resp, params ) {

  var data = {
      "type": 'fb',
      "id": resp.id,
      "fullRes": JSON.stringify( resp ),
      'ref': this.game.stage.name
  };
  var that = this;

  return this._apiRequest( 'account/login', data, function( type, data ) {

    //If there was an error.
    if( type == 2 ) {
      params.callback.call( params.context, false, data );

    } else if( data.result) {
      if( data.result == 'fail' ) {
        params.callback.call( params.context, false, data );

      } else {
        that.userInfo = data;
        params.callback.call( params.context, true, data);

      }
   

    } else {
      params.callback.call( params.context, false, data );
    
    }

  }, true);

};


/**
* Logs a user out of gamefroot. 
* 
* @method logout
* @param params {Object}
*   @param params.callback {Function} Function to be executed when complete.
*   @param [params.context] {Any} Context the callback should be executed in.
* @public
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype.logout = function( params ) {

  params = params || {};

  //Attempt to logout
  return this._apiRequest( 'account/logout', {}, function( type, data ) {

    that.userInfo = null;

    //If there was an error.
    if( type == 2 ) {
      if( params.callback ) {
        params.callback.call( params.context, false, data );
      }

    } 

    if( params.callback ) { 
      params.callback.call( params.context, true, data );
    }

  }, true);

};


/**
* Makes a request to the gamefroot servers. 
* Because it is done using XHR requests, it is recommended that do not make multiple requests at once.
* 
* @method _apiRequest
* @param url {String} The URL of the request that is being made.
* @param rawdata {Object} The data to be sent to gf.
* @param callback {Function} The callback to run when complete.
* @param post {Boolean} If information sent should use POST. Majority of methods do anyway.
* @public
* @return {Boolean} If the request was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._apiRequest = function( url, rawdata, callback, post ) {

  if( !this._ready ) {
    this.log( 'not ready to make another request yet.', 2  );
    return false;
  }

  var method, data, xhr,
    that = this;

  if( post ) {
    method = 'POST';
  } else {
    method = 'GET'; 
  }

  //Stringify the data
  data = null;
  for( var index in rawdata ) {
      if( data === null ) {
          data  = index + '=' + encodeURIComponent( rawdata[index] );
      } else {
          data += '&' + index + '=' + encodeURIComponent( rawdata[index] );
      }
  }

  //Create the XHR request
  xhr = new XMLHttpRequest();
  xhr.open( method, this.serverURL + url, true );
  
  //Create request
  if( post ) {
      xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
  } 

  xhr.timeout = this.timeout;

  //Events.
  xhr.ontimeout = function() {
    that._error( 'request has timed out.', callback );
  };

  xhr.onabort = function() {
    that._error( 'request was aborted.', callback );
  };
  
  xhr.onerror = function() {
    that._error( 'request encountered an error.', callback );
  };

  xhr.onreadystatechange =  function( event ) {

    if( event.target.readyState !== 4 ) return;
   
    if( xhr.response ) {
      var data = JSON.parse( xhr.response );
    } else {
      var data = {};
    }

    that._ready = true;
    callback.call( this, 1, data );

  };

  //Start.
  xhr.send( data );
  this._ready = false;
  return true;
};


/**
* Executed when a API call has failed. 
* @method _error
* @param errorMsg {String} The error message to show. 
* @param callback {Function} The callback to execute.
* @private
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._error = function( errorMsg, callback ) {

  this._ready = true;
  this.log( errorMsg, 2 );
  callback.call( this, 2, errorMsg );

};


/**
* Class that will soon contain the functionality for Twitter. 
* This has not been implemented just yet, but is instead a placeholder for where it will be in the future.
*
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Twitter
* @extends Kiwi.Plugins.SocialConnect.Base
* 
*/
Kiwi.Plugins.SocialConnect.Twitter = function( game ) {

  Kiwi.Plugins.SocialConnect.Base.call(this, game, 'Twitter', {
    'login': false,
    'share': false,
    'init': false
  });

  this._ready = false;

  //Detect if Twitter Connect JavaScript file has been included.


};

Kiwi.extend( Kiwi.Plugins.SocialConnect.Twitter, Kiwi.Plugins.SocialConnect.Base );


Kiwi.Plugins.SocialConnect.Twitter.prototype._include = function( onloadCallback ) {
  //Include the SDK if it is not visible
};



Object.defineProperty( Kiwi.Plugins.SocialConnect.Twitter.prototype, "ready", {
    
    get: function () {
        return this._ready;
    },
    
    enumerable: true,
    
    configurable: true

});


/**
* Will contain any functionality for initialising.
* 
* @method init
* @param params {Object}
* @public
*/
Kiwi.Plugins.SocialConnect.Twitter.prototype._init = function( params ) {

  //Check to see if the SDK has been loaded 

  //If not, load the SDK in.

};


/**
* Will contain any functionality to login a user.
* 
* @method login
* @param params {Object}
* @public
*/ 
Kiwi.Plugins.SocialConnect.Twitter.prototype._login = function( params ) {

  //Attempt to login.

};


/**
* Functionality to logout a user from twitter
* 
* @method logout
* @param params {Object}
* @public
*/
Kiwi.Plugins.SocialConnect.Twitter.prototype.logout = function( params ) {

  //Attempt to logout

};


/**
* Functionality to share a piece of information on twitter.
* 
* @method share
* @param params {Object}
* @public
*/
Kiwi.Plugins.SocialConnect.Twitter.prototype._share = function( params ) {

  //Attempt to share

};


 

 