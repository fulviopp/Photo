function Login(Window) {

	var win = Ti.UI.createWindow({
		title : L('login_title'),
		backgroundColor : '#fff'
	});

	//
	// Login Status
	//
	var label = Ti.UI.createLabel({
		font : {
			fontSize : 14
		},
		height : 'auto',
		top : 10,
		textAlign : 'center'
	});
	win.add(label);

	function updateLoginStatus() {
		if (Titanium.Facebook.loggedIn) {
			label.text = L('register');
			var Cloud = require('ti.cloud');
			Cloud.debug = true;
			Cloud.SocialIntegrations.externalAccountLogin({
				type : 'facebook',
				token : Titanium.Facebook.accessToken
			}, function(e) {
				if (e.success) {

					// Obtem informação no facebook e grava no ACS
					Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
						if (e.success) {
							var response = JSON.parse(e.result);

							var userPhoto = Titanium.UI.createImageView({
								image : "https://graph.facebook.com/" + Ti.Facebook.uid + "/picture?type=large",
								width : 200,
								height : 200,
								top : 40
							});							
							var imgUserPhoto = userPhoto.toImage();
										
							Cloud.Users.update({
								username : response.username,
								email : response.email,
								first_name : response.first_name,
								last_name : response.last_name,
							}, function(e2) {
								if (e2.success) {
									if (!e2.users[0].hasOwnProperty('photo')) {
																					
											Cloud.Photos.create({
												photo : imgUserPhoto
											}, function(e3) {
												if (e3.success) {
													var p_id = e3.photos[0].id;
													Ti.API.log('p_id: ' + p_id);
													Cloud.Users.update({
														photo_id : p_id,
														'photo_sync_sizes[]': 'original'
													}, function(e4) {});
												} else {
													alert("Erro ao gravar foto: " + e3.error);
												}
											});										
									}

								} else {
									alert("Erro ao registrar usuário: " + e2.error);
								}
							});

						} else {
							alert("Erro ao consultar facebook: " + e.error);
						}
					});

					win.close();
					var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
					new ApplicationTabGroup(Window).open();
				} else {
					error(e);
				}
			});
		}
	}

	// capture
	Titanium.Facebook.addEventListener('login', updateLoginStatus);
	Titanium.Facebook.addEventListener('logout', updateLoginStatus);

	//
	// Login Button
	//
	if (Titanium.Platform.name == 'iPhone OS') {
		win.add(Titanium.Facebook.createLoginButton({
			style : Ti.Facebook.BUTTON_STYLE_WIDE,
			bottom : 30
		}));
	} else {
		win.add(Titanium.Facebook.createLoginButton({
			style : 'wide',
			bottom : 30
		}));
	}

	return win;
};

module.exports = Login;
