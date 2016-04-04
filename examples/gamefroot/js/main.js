
var Gamefroot = new Kiwi.State('Gamefroot');

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
				console.log( resp, resp2 );
			},
			context: this
		});

	}.bind(this) );

};


//Create the Kiwi Game, and use the Social Connect plugin.
var gameoptions = { 
	plugins: [ "SocialConnect" ],
	width: 400,
	height: 400,
	renderer: Kiwi.RENDERER_CANVAS
};

var game = new Kiwi.Game( "game-container", "SocialConnect", Gamefroot, gameoptions );

