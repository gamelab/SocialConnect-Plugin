
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
			callback: function(success, data) {
				if( success ) {
					alert("Account Created");
					//Clear the values
					user.value = '';
					pass.value = '';
					email.value = '';
				} else {
					alert("Registration Failed. " + data);
				}
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
			callback: function(success, data) {
				if( success ) {
					alert("Logged In");
					//Clear the values
					user.value = '';
					email.value = '';

				} else {
					alert("Login Failed. " + data);
				}
			},
			context: this
		});

	}.bind(this) );

	var loggedInSubmit = document.querySelector('#isloggedin');
	loggedInSubmit.addEventListener('click', function() {

		this.game.social.gamefroot.isLoggedIn({
			callback: function(success, data) {
				var message = ( success ) ? "Are logged in as " + data.username : "Not logged in.";
				alert( message );
			}, 
			context: this
		});

	}.bind(this) );

	var facebookLogin = document.querySelector('#loginWithFacebook');
	facebookLogin.addEventListener('click', function() {

		this.game.social.gamefroot.loginWithFB({
			callback: function(success, data) {
				if( success ) {
					alert("Logged in with Facebook.");
				} else {
					alert("Facebook login unsuccessful. " + data);
				}
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

