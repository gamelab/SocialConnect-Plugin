
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
Kiwi.Plugins.SocialConnect.Twitter = function() {

  Kiwi.Plugins.SocialConnect.Base.call(this, 'Twitter', {
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


 

 