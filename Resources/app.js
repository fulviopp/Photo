/*
* A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
* A starting point for tab-based application with multiple top-level windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {

	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	// optional; if you add this line, set it to false for production

	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		Window = require('ui/handheld/ApplicationWindow');
	}

	// config
	Titanium.Facebook.appid = '226354784164084';
	Titanium.Facebook.permissions = ['publish_stream', 'read_friendlists', 'email'];
	Titanium.Facebook.forceDialogAuth = false;

	if (Titanium.Facebook.loggedIn) {
		//
		// Login ACS
		//
		Cloud.SocialIntegrations.externalAccountLogin({
			type : 'facebook',
			token : Titanium.Facebook.accessToken
		}, function(e) {
			getUserData(e);
			var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
			new ApplicationTabGroup(Window).open();
		});
		// var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		// new ApplicationTabGroup(Window).open();

	} else {
		var Login = require('ui/common/Login');
		new Login(Window).open();
	}
	
	
	function getUserData(e) {
		// Ti.API.log('****************');
		// Ti.API.log(e);
		// Ti.API.log('****************');
		var user = e.users[0];
		Ti.App.Properties.setString('currentUserId', user.id);
		Ti.App.Properties.setString('currentUserLogin', user.username);
		Ti.App.Properties.setString('currentUserFirstName', user.first_name);
		Ti.App.Properties.setString('currentUserEMail', user.email);

		// get and saves a new extended access token
		var callFB = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				
				var res = this.responseText;
				var acc_tk = res.substring(res.indexOf("=")+1, res.indexOf("&"));
				Ti.API.info("Token:" + acc_tk);
				
				var pd_srv = require('pd_srv');
				pd_srv.updUser({
					user_id: Ti.App.Properties.getString('currentUserId'),
					name: user.first_name,
					email: user.email,
					access_token: acc_tk
				}, function(v) {
						Ti.API.log(v);					
				});
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
			},
			timeout : 10000 // in milliseconds
		});
		Ti.API.info("Access Token " + Titanium.Facebook.getAccessToken());
		var urlFB = "https://graph.facebook.com/oauth/access_token?client_id=226354784164084&client_secret=255fa5ba549c2bba5fead17ca6944111&grant_type=fb_exchange_token&fb_exchange_token=" + Titanium.Facebook.getAccessToken();
		callFB.open('GET', urlFB);
		callFB.send();
	}

})();
