
/**
* The Manager is a wrapper which contains useful methods for accessing common facebook functionality,
* whilst also providing lower level access if needed. 
* A single Manager is always created, and used regardless of the number of games used.
*
* @module Plugins
* @submodule SocialConnect
* @namespace Kiwi.Plugins.SocialConnect
* @class Manager
* 
*/
Kiwi.Plugins.SocialConnect.Twitter = function() {

  Kiwi.Plugins.SocialConnect.Base.call(this, 'Twitter', {
    'login': true,
    'share': true
  });

  this._ready = false;

  //Detect if Twitter Connect JavaScript file has been included.


};

Kiwi.extend( Kiwi.Plugins.SocialConnect.Twitter, Kiwi.Plugins.SocialConnect.Base );


Kiwi.Plugins.SocialConnect.Twitter.prototype.loadSDK = function() {


};


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


//Avaiable params are the same as the ones on the 'https://developers.facebook.com/docs/javascript/reference/FB.init/v2.1' website 
Kiwi.Plugins.SocialConnect.Twitter.prototype._init = function( params ) {

  //Check to see if the SDK has been loaded 

  //If not, load the SDK in.

};




/**
* --------------
* Login Section
* --------------
*/

//Login 
Kiwi.Plugins.SocialConnect.Twitter.prototype._login = function( params ) {

  //Attempt to login.

};


//Logged In

//Quick Check. Used to quickly check to see if the last time we asked facebook that someone was logged in.
Object.defineProperty( Kiwi.Plugins.SocialConnect.Twitter.prototype, "loggedIn", {
    
    get: function () {
      return false;
    },
    
    enumerable: true,
    
    configurable: true

});


//Logout
Kiwi.Plugins.SocialConnect.Twitter.prototype.logout = function( callback, context ) {

  //Attempt to logout

};


//Default URL is the current location of this document
Kiwi.Plugins.SocialConnect.Twitter.prototype._share = function( params ) {

  //Attempt to share

};


 

 