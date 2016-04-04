
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
	LIVE: 'http://api.gamefroot.com/v1/',

	/**
	* Contains the url for the debug (also known as staging) version of gamefroot.
	* @property ServerURL.DEBUG
	* @type string
	* @public
	* @readOnly
	* @static
	* @deprecated
	*/
	DEBUG: 'http://api.gamefroot.com/v1/'

};


/**
* Indicates if the API is ready to make a request or not. 
* This would only ever be "false" if we are midway through another API call.
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

	if( !params.username || !params.password || !params.email) {
		this.log( 'not all of the needed parameters have been passed.', 2 );
		params.callback.call( params.context, false, 'Missing required parameters');
		return false;
	};

	var data = {
		'username': params.username || '',
		'password': params.password || '',
		'email': params.email || ''
	};

	return this._apiRequest( 'auth/register', data, function( type, data ) {

		//If there was an error.
		if( type == 2 ) {
			params.callback.call( params.context, false, data );
		} else {
			params.callback.call( params.context, true, data );
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
		params.callback.call( params.context, false, 'Missing required parameters');
		return false;
	};

	var data = {
			'username': params.username,
			'password': params.password,
			'ref': this.game.stage.name
		},
		that = this;

	return this._apiRequest( 'auth/login', data, function( type, data ) {

		//If there was an error.
		if( type == 2 ) {
			params.callback.call( params.context, false, data );
		} else {
			that.userInfo = data;		
			params.callback.call( params.context, true, data );
		} 

	}, true);

};


/**
* Makes a request to the API asking if the user is currently logged in or not. 
* The callback passed will contain two arguments. 
* 1 - Boolean whether the user is logged in or not
* 2 - Response information passed from the request 
* 
* @method isLoggedIn
* @param params {Object} The parameters required
*   @param params.callback {Function} Function to be executed when complete.
*   @param [params.context] {Any} Context the callback should be executed in.
* @public
* @return {Boolean} If the API call was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype.isLoggedIn = function( params ) {

	if( !params.callback ) {
		this.log( 'a callback needs to be passed in-order to function correctly.', 2 );
		return false;
	}

	var that = this;

	return this._apiRequest( 'users/me', {}, function( type, data ) {

		//If there was an error.
		if( type == 2 ) {
			params.callback.call( params.context, false, data );
		} else {
			that.userInfo = data;
			params.callback.call( params.context, true, data);

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

	return this._apiRequest( 'auth/facebook/connect', data, function( type, data ) {

		//If there was an error.
		if( type == 2 ) {
			params.callback.call( params.context, false, data );
		} else {
			that.userInfo = data;
			params.callback.call( params.context, true, data);
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
	return this._apiRequest( 'auth/logout', {}, function( type, data ) {

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
* @param rawData {Object} The data to be sent to gf.
* @param callback {Function} The callback to run when complete.
* @param post {Boolean} If information sent should use POST. Majority of methods do anyway.
* @private
* @return {Boolean} If the request was made or not.
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._apiRequest = function( url, rawData, callback, post ) {

	rawData = rawData || {};
	rawData.game = this.game.stage.name;

	var file =  new Kiwi.Files.DataFile( this.game, {
		key: 'gf-login-' + Date.now(), 
		url: this.serverURL + url,
		type: Kiwi.Files.File.JSON
	} );
	file.parse = true;
	file.maxLoadAttempts = 1;

	var callbackExecuted = false;

	var that = this;
	file.xhrLoader = function(method, requestType, timeout) {
		if( typeof requestType == 'undefined' ) {
			requestType = 'text';
		}

		that._postXhrLoader.call(file, requestType, rawData);
	};

	file.onComplete.add(function() {

		if( callbackExecuted ) {
			return;
		}

		var error = false,
			msg = 'Could not communicate with the server',
			json;

		if( file._xhr.response ) {
			try {
				json = JSON.parse( file._xhr.response );
				
				if( json.data && json.data.message ) {
					msg = json.data.message;
				}
			} catch(e) {
				//Response JSON malformed, or not passed
			}
		}

		callbackExecuted = true;

		if( file.success ) {
			callback.call( this, 1, (file.data && file.data.data) ? file.data.data : file.data );
		} else {
			callback.call( this, 2, msg );
		}

	}, this);

	this.game.loader.loadFile( file );

	return true;
};


/**
* Function which is apart of the overriding the default XHR loader of Kiwi.Files.File 
* and instead replaces it with one which supports POST requests
* 
* @method _postXhrLoader
* @param [responseType='text'] {String}
* @param [data] {Number}
* @private
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._postXhrLoader = function(responseType, rawData) {

	//Stringify the data
		var data = '';
		for(var index in rawData) {
			if( data.length > 0 ) {
					data += '&';
			}
			data += index + '=' + rawData[index];
		}

		//XHR Request
	this._xhr = new XMLHttpRequest();
		this._xhr.open('POST', this.URL);
	this._xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	this._xhr.responseType = responseType;

		var _that = this;

	this._xhr.onload = function(event) { 
		_that.xhrOnLoad(event);
	};
	this._xhr.onerror = function(event) {
		_that.loadError(event);
	};
		this._xhr.onprogress = function(event) {
			_that.xhrOnProgress(event);
		};
	this._xhr.onreadystatechange = function () {
				_that.readyState = _that._xhr.readyState;
	};
	this._xhr.onloadstart = function (event) {
				_that.timeStarted = event.timeStamp;
				_that.lastProgress = event.timeStamp;
	};
	this._xhr.ontimeout = function(event) {
				_that.hasTimedOut = true;
	};
		this._xhr.onloadend = function (event) {
				_that.xhrOnLoad(event);
		};

	this._xhr.send( data );
}



/**
* Executed when a API call has failed. 
* @method _error
* @param errorMsg {String} The error message to show. 
* @param callback {Function} The callback to execute.
* @private
*/
Kiwi.Plugins.SocialConnect.Gamefroot.prototype._error = function( errorMsg, callback ) {

	this.log( errorMsg, 2 );
	callback.call( this, 2, errorMsg );

};
