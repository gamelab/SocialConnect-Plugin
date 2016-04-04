SocialConnect Plugin (0.9.0)
=======================================

The SocialConnect plugin makes integrating and using social media in [KiwiJS](http://www.kiwijs.org/) a breeze. Functionality commonly wanted in games, such as sharing and login, is easily accessible and configurable. SDKs are loaded upon initialisation and only if they are not already there. SocialConnect even works in [CocoonJS](https://www.ludei.com/cocoonjs/).

**Currently Supported**

- Facebook
- Twitter Coming Soon.

If a platform you want to use is not supported then please get in contact with us. 

If you have any problems then feel free to contact us via [our website](http://www.kiwijs.org/help) OR [leave an issue!](https://github.com/gamelab/SocialConnect-Plugin/issues/new)


Versions
---------

0.9.0
* Facebook support for CocoonJS updated

0.8.0
* Facebook support added
	* Works in both browsers and CocoonJS
	* Login and logout functions added
	* Nice methods which handle loading a user's facebook profile into Kiwi
	* Sharing functionality
* Classes documented
* Examples added


How to Include: 
---------

###First Step:
- Copy either the `socialconnect-x.x.x.js` or the `socialconnect-x.x.x.min.js` files into your project directory. They can be located in the `build` folder. We recommend that you save the files under a `plugins` directory that lives inside of your project directory so that you can easily manage all of the plugins, but this is not required.

###Second Step:
- Link in the JavaScript file `socialconnect-x.x.x.js` (or the min version) into your HTML file. Make sure you link it in underneath the main Kiwi.js library AND underneath the Cocoon files if you are using Cocoon.


How to use
---------

##Starting Off
Below is an outline of the steps to follow when using the plugin and adding social media to your game. Note that not all the steps may be necessary for each social media service.

###Choose Service then Configure
To use this plugin you must first choose which social media services you would like to use and then perform any configurations needed for them.

For example, if you want to use the "facebook" plugin you will need to create an App for your game on [developers.facebook.com](http://developers.facebook.com) first.

###Initialise 
Next you will need to initialise the social media you have chosen to use. It may require information from the configuration step above.

```javascript
this.game.social.init( {
		"facebook": {
			"appId": "XXXXXXXXXXXXXXXXXXXXX"
		}
	} );
```

The `init` method above allows you initialise multiple SDKs with a single call. Alternatively you can initialise them individually.

```javascript
this.game.social.facebook.init( {
		"appId": "XXXXXXXXXXXXXXXXXXXXX"
	} );
```


##Facebook

###Sharing
To pop-up a basic share dialog you can use the `share` method. 

```javascript
this.game.social.facebook.share();
```

By default (in browsers) this will use the current window's location but can be changed.

```javascript
this.game.social.facebook.share( { 
		link: "http://www.kiwijs.org" 
	} );
```

###Login

```javascript
this.game.social.facebook.login( {
		"callback": this.toBeExecutedWhenComplete,
		"context": this,
		"options": {
			"scope": "public_profile,publish_actions,user_friends"
		}
	} );
```

See the [facebook documentation](https://developers.facebook.com/docs/facebook-login/permissions/v2.1) for a list of valid permissions.

###Logout

```javascript
this.game.social.facebook.logout();
```

Just be careful as this will log the user out of Facebook entirely.

###User Information

```javascript
this.game.social.facebook.me( {
		"callback": this.toBeExecutedWhenInformationGathered,
		"context": this,

		//List of valid fields to be retrieved off Facebook.
		"fields": "picture, id, first_name"
	} );
```

See the [facebook documentation](https://developers.facebook.com/docs/graph-api/reference/v2.2/user) for a full list of valid fields.

###The Facebook SDK

If there is a piece of functionality not listed above that you specifically need or want, then you can always access the Facebook SDK at any time.

```javascript
var fbSdk = this.game.social.facebook.fb;
```


More Info
---------

For more information and tutorials visit the [kiwijs website.](http://www.kiwijs.org/documentation/social-connect-plugin/) 

Check out a few of the examples found in the `examples` folder of this repository. **Warning**: These examples will only work if you insert a valid app id. Visit the tutorial above for more information.

Read the API docs found in the `docs` folder of this repository.
