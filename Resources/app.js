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
	Cloud.debug = true; // optional; if you add this line, set it to false for production
	
	// config
	Titanium.Facebook.appid = '226354784164084';

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

	Titanium.Facebook.appid = Titanium.App.Properties.getString('facebook_appid');
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
			var user = e.users[0];
			Ti.App.Properties.setString('currentUserId',user.id);
			Ti.App.Properties.setString('currentUserLogin',user.username);
			Ti.App.Properties.setString('currentUserFirstName',user.first_name);
			Ti.App.Properties.setString('currentUserEMail',user.email);
		});
		
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		new ApplicationTabGroup(Window).open();
	} else {
		var Login = require('ui/common/Login');
		new Login(Window).open();	
	}
	
})();
