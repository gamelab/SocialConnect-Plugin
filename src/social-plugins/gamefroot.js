
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
Object.defineProperty( Kiwi.Plugins.SocialConnect.Facebook.prototype, "ready", {
    
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
Object.defineProperty( Kiwi.Plugins.SocialConnect.Facebook.prototype, "loggedIn", {
    
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
