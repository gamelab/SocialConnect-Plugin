
var Gamefroot = new Kiwi.State('Gamefroot');

Gamefroot.init = function() {

	this.game.social.facebook.init({
		'appId': '299344696856469'
	});

};

Gamefroot.create = function() {

	var regSubmit = document.querySelector('#reg-register');
	regSubmit.addEventListener('click', function() {

		var user = document.querySelector('#reg-username'),
			pass = document.querySelector('#reg-password'),
			email = document.querySelector('#reg-email'); 

		this.game.social.gamefroot.register({
			username: user.value,
			password: pass.value,
			email: email.value,
			callback: function(resp, resp2) {
				console.log( 'REGISTER:', resp, resp2 );
			},
			context: this
		});

	}.bind(this) );


	var loginSubmit = document.querySelector('#log-login');
	loginSubmit.addEventListener('click', function() {

		var user = document.querySelector('#log-username'),
			pass = document.querySelector('#log-password');

		this.game.social.gamefroot.login({
			username: user.value,
			password: pass.value,
			callback: function(resp, resp2) {
				console.log( 'LOGIN:', resp, resp2 );
			},
			context: this
		});

	}.bind(this) );

	var loggedInSubmit = document.querySelector('#isloggedin');
	loggedInSubmit.addEventListener('click', function() {

		this.game.social.gamefroot.isLoggedIn({
			callback: function(resp, resp2) {
				console.log( 'IS LOGGED IN:', resp, resp2 );
			}, 
			context: this
		});

	}.bind(this) );

	var facebookLogin = document.querySelector('#loginWithFacebook');
	facebookLogin.addEventListener('click', function() {

		this.game.social.gamefroot.loginWithFB({
			callback: function(resp, resp2) {
				console.log( 'FB:', resp, resp2 );
			},
			context: this
		})

	}.bind(this) );

};


//Create the Kiwi Game, and use the Social Connect plugin.
var gameoptions = { 
	plugins: [ "SocialConnect" ],
	width: 0,
	height: 0,
	renderer: Kiwi.RENDERER_CANVAS
};

var game = new Kiwi.Game( "game-container", "SocialConnect", Gamefroot, gameoptions );

