
//Create the state that we are going to use for this game.
var LoggedInState = new Kiwi.State("LoggedInState");
	


//Once asset loading has completed
LoggedInState.create = function() {	

	//Display the users profile picture
	this.userImage = new Kiwi.GameObjects.StaticImage( this, this.textures['currentUsersProfileImage'] );
	this.userImage.x = (this.game.stage.width - this.userImage.width) * 0.5;
	this.userImage.y = (this.game.stage.height - this.userImage.height) * 0.5;
	this.addChild( this.userImage );

	//The 'userInfo' property saves the information returned by facebook 
	// from the last request made when the 'me' method was used.
	var userInformation = this.game.social.facebook.userInfo;

	//Nice Text to display at the top.
	this.statusText = new Kiwi.GameObjects.Textfield(this, '');
	this.statusText.x = this.game.stage.width * 0.5;
	this.statusText.y = this.userImage.y - 16;
	this.statusText.textAlign = 'center';
	this.statusText.fontSize = 16;
	this.statusText.text = 'Welcome ' + userInformation['first_name'] + ' ' + userInformation['last_name'];
	this.addChild( this.statusText );


	//Create the facebook logout button. 
	this.facebookLogoutButton = new Kiwi.GameObjects.StaticImage( this, this.textures.login );
	this.facebookLogoutButton.x = ( this.game.stage.width - this.facebookLogoutButton.width ) * 0.5;
	this.facebookLogoutButton.y = this.game.stage.height - this.facebookLogoutButton.height - 10;
	this.facebookLogoutButton.cellIndex = 1;
	this.addChild( this.facebookLogoutButton );


	//Add the click event to log the user out.
	this.game.input.onUp.add( this.processInput, this );
	
};


//When the user clicks on screen,
LoggedInState.processInput = function( x, y ) {

	//Don't continue of the login button is not visible.
	if( !this.facebookLogoutButton.visible ) {
		return;
	}

	//And the users mouse was within the facebook login button bounding box.
	if( this.facebookLogoutButton.box.bounds.contains(x, y) ) {

		//Delete the profile picture so that a new one can be loaded in.
		this.game.fileStore.removeFile( 'currentUsersProfileImage' );

		//If the user has a profile picture, then kill it
		//If the user was logged in, then the button must have been telling the user to logout.
		this.game.social.facebook.logout( {
			context: this,
			callback: function() {
				this.game.states.switchState('LoginState');
			}
		} );

	}

};