
//Create the Kiwi Game, and use the Social Connect plugin.
var gameoptions = { 
	plugins: [ "SocialConnect" ],
	width: 400,
	height: 400,
	renderer: Kiwi.RENDERER_CANVAS
};

var game = new Kiwi.Game( "game-container", "SocialConnect", LoginState, gameoptions );