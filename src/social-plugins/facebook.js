
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
* Loads the Facebook SDK into the DOM. 
* Doesn't check to see if the SDK is already there!
* Should not be used with CocoonJS.
* 
* @method loadSDK
* @public
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.loadSDK = function( ) {

  var that = this;

  //Include the script.
  that._include( function() { 
    
    //Finished loading, check FB 
    if( typeof window.FB !== "undefined" ) {
      that.fb = window.FB;
      that._ready = true;
    }

  } );

};


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
  js.onload = onloadCallback;
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
    window.fbAsyncInit = function() {
      FB.init( params );
    };

    this.loadSDK( );
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
* Note: Does NOT work with CocoonJS. Use the 'loggedIn' and 'login' methods for CocoonJS.
* 
* @method loginApproved
* @param params {Object}
*   @param params.callback {Function} Callback method which is called when information is recieved.
*   @param [params.context] {Any} The context the callback should be executed with. 
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.loginApproved = function( params ) {

  if( !params || !params.callback ) {
    this.log( ' a callback needs to be passed in-order to function correctly.', 2 );
    return;
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

    if( typeof params.callback !== "undefined" ) {
      params.callback.call( params.context, accessable, loggedIn, resp );
    }

  } );

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

  this.fb.logout( function() {

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

      if( typeof callback !== "undefined" ) {
        params.callback.call( params.context, resp );
      }

    }

  });

  return true;
};


/**
* Uses the Kiwi.JS core file loader to load a URL into the fileStore. 
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

  //Load complete methods
  this.game.loader.init( null, function() {

    if( typeof callback !== "undefined" ) {
      callback.call( context, callbackParams );
    }

  });

  //Adds the image to the file loading queue.
  this.game.loader.addImage( key, url );
  this.game.loader.startLoad();

};


/**
* Loads in the current users facebook picture. 
* See the @me method for more information as that is used for this functionality. 
* 
* @method myImage
* @param [params] {Object}
* @param [params.fields] {String}
* @param [params.saveData] {Boolean}
* @public
* 
*/
Kiwi.Plugins.SocialConnect.Facebook.prototype.myImage = function( params ) {

  params = params || {};
  params.fields = 'picture';
  params.saveData = false;
  params.autoLoadPicture = true;

  this.me( params );

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

 