var navActInd = Titanium.UI.createActivityIndicator();

//
// Janela de novo duelo
//
function NewDuelWindow(title) {
	var newWin = Ti.UI.createWindow({
		title : title,
		backButtonTitle : L('back'),
		barColor : '#101010',
		backgroundImage : '/images/bk_texture.png',
		backgroundRepeat : true
	});

	var linearGradient = Ti.UI.createView({
		backgroundGradient : {
			type : 'linear',
			startPoint : {
				x : '50%',
				y : '0%'
			},
			endPoint : {
				x : '50%',
				y : '100%'
			},
			colors : [{
				color : '#DDD',
				offset : 0.5
			}, {
				color : '#AAA',
				offset : 0.9
			}],
		},
		opacity : 0.97
	});
	newWin.add(linearGradient);

	var label = Ti.UI.createLabel({
		text : L('choose_theme'),
		font : {
			fontSize : 17,
			fontFamily : "STHeitiTC-Light"
		},
		height : 'auto',
		top : 10,
		left : 5
	});
	newWin.add(label);

	newWin.setRightNavButton(navActInd);

	var theme = null;

	var butT1 = Titanium.UI.createButton({
		theme : 'Lugares',
		height : 62,
		width : 55,
		top : 40,
		left : 30,
		id : 't1',
		backgroundImage : '/images/but_th_lugares.png',
	});
	newWin.add(butT1);

	var butT2 = Titanium.UI.createButton({
		theme : 'Pessoas',
		height : 62,
		width : 55,
		top : 40,
		left : 105,
		id : 't2',
		backgroundImage : '/images/but_th_pessoas.png',
	});
	newWin.add(butT2);

	var butT3 = Titanium.UI.createButton({
		theme : 'Animais',
		color : '#888',
		height : 62,
		width : 55,
		top : 40,
		right : 90,
		id : 't3',
		backgroundImage : '/images/but_th_animais.png',
	});
	newWin.add(butT3);

	var butT4 = Titanium.UI.createButton({
		theme : 'Flores',
		height : 62,
		width : 55,
		top : 40,
		right : 30,
		id : 't4',
		backgroundImage : '/images/but_th_flores.png',
	});
	newWin.add(butT4);

	butT1.addEventListener('click', chooseTheme);
	butT2.addEventListener('click', chooseTheme);
	butT3.addEventListener('click', chooseTheme);
	butT4.addEventListener('click', chooseTheme);

	function chooseTheme(e) {
		var button = e.source;
		butT1.backgroundImage = butT1.backgroundImage.replace('_clkd.png', '.png');
		butT2.backgroundImage = butT2.backgroundImage.replace('_clkd.png', '.png');
		butT3.backgroundImage = butT3.backgroundImage.replace('_clkd.png', '.png');
		butT4.backgroundImage = butT4.backgroundImage.replace('_clkd.png', '.png');
		button.backgroundImage = button.backgroundImage.replace('.png', '_clkd.png');
		theme = button.theme;
	}

	//
	// Escolha da foto
	//
	var popoverView, arrowDirection, imageView;

	imageView = Titanium.UI.createImageView({
		height : 200,
		width : 200,
		top : 20,
		left : 10,
		backgroundColor : '#999'
	});

	if (Titanium.Platform.osname == 'ipad') {
		// photogallery displays in a popover on the ipad and we
		// want to make it relative to our image with a left arrow
		arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
		popoverView = imageView;
	}

	var butGallery = Titanium.UI.createButton({
		title : L('get_photo'),
		height : 40,
		width : 260,
		top : 140,
		font : {
			fontSize : 16,
			fontFamily : "STHeitiTC-Medium"
		},
	});
	newWin.add(butGallery);

	butGallery.addEventListener('click', function() {
		if (Ti.Platform.osname === 'android') {
			win.addEventListener('open', function(e) {
				openGallery();
			});
		} else {
			openGallery();
		}
	});

	var duelPhoto = null;
	function openGallery() {
		Titanium.Media.openPhotoGallery({

			success : function(event) {
				var cropRect = event.cropRect;
				var image = event.media;

				// set image view
				Ti.API.debug('Our type was: ' + event.mediaType);
				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					imageView.image = image;
					duelPhoto = image;
				} else {
					// is this necessary?
				}

				Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

				// var ratio = event.media.width / event.media.height;
				// if (ratio < 0.8 || ratio > 1.2) {
				// var dialog = Ti.UI.createAlertDialog({
				// message : L('MAYBEZOOM'),
				// ok : 'OK',
				// title : 'Wrong Format'
				// }).show();
				// Ti.Media.hideCamera();
				// } else {
				// setImage(event.media);
				// Ti.Media.hideCamera();
				// }
				// VER: http://developer.appcelerator.com/question/144808/square-cropping-of-camera-photos

			},
			cancel : function() {

			},
			error : function(error) {
			},
			allowEditing : true,
			popoverView : popoverView,
			arrowDirection : arrowDirection,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	}

	//
	// Confirma novo duelo
	//
	var butStartDuel = Titanium.UI.createButton({
		title : L('start_duel'),
		height : 40,
		width : 260,
		top : 220,
		font : {
			fontSize : 16,
			fontFamily : "STHeitiTC-Medium"
		},
	});
	newWin.add(butStartDuel);

	var Cloud = require('ti.cloud');
	Cloud.debug = true;

	butStartDuel.addEventListener('click', function() {
		if (!theme) {
			alert(L('warning_choose_theme'));
		} else if (!duelPhoto) {
			alert(L('warning_choose_photo'));
		} else {
			navActInd.show();
			butGallery.setEnabled(false);
			butStartDuel.setEnabled(false);

			Cloud.Photos.create({
				photo : duelPhoto,
				'photo_sizes[duel]' : '150x150#',
				'photo_sync_sizes[]' : 'duel'
			}, function(e) {
				if (e.success) {
					var p_id = e.photos[0].id;
					var duelURL = e.photos[0].urls.duel;
					saveDuel(theme, p_id, duelURL);
					navActInd.hide();
					newWin.close();
				} else {
					alert("Erro ao gravar foto: " + e.error);
				}
			});

		}
	});

	newWin.addEventListener('focus', function() {
		navActInd.hide();
		butGallery.setEnabled(true);
		butStartDuel.setEnabled(true);
	});

	return newWin;
}

//
// Grava um novo duelo ou coloca esse como desafiante em duelo já existente
//
function saveDuel(theme, p_id, duelURL) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;

	var currentUserId = Ti.App.Properties.getString('currentUserId');

	Cloud.Objects.query({
		classname : 'duels',
		page : 1,
		per_page : 10,
		where : {
			"user_id" : {
				"$ne" : currentUserId
			},
			"theme" : theme,
			"[ACS_Photo]photo2_id" : {
				"$exists" : false
			}
		}
	}, function(e) {
		Ti.API.log('testando...');
		Ti.API.log(e);
		if (e.duels.length > 0) {
			var d_id = e.duels[0].id;
			Ti.API.log('d_id: ' + d_id);
			Cloud.KeyValues.increment({
				name : 'd_' + d_id,
				value : 1
			}, function(e) {
				Ti.API.log('criou?');
				Ti.API.log(e);
				var my_stamp = e.keyvalues[0].value;
				if (e.keyvalues[0].value > 1) {
					Ti.API.log('problema de concorrencia. criar novo duelo.');
					createDuel();
				} else {
					// posso pegar aquele duelo
					Cloud.Objects.update({
						classname : 'duels',
						id : d_id,
						fields : {
							"[ACS_Photo]photo2_id" : p_id
						}
					}, function(e) {
						//Ti.API.log(e);
						registerDueler(d_id);
						Ti.App.fireEvent("app:newduel", {
							theme : theme,
							duelURL : duelURL,
							newDuelId : d_id
						})
						alert("Novo duelo começando. Boa sorte !!");
					});
				}
			});
		} else {
			createDuel();
		}
	});

	//
	// Grava um novo duelo
	//
	function createDuel() {
		Cloud.Objects.create({
			classname : 'duels',
			acl_name : 'duel',
			fields : {
				theme : theme,
				"[ACS_Photo]photo1_id" : p_id,
				points : 100,
				votes_to_win : 3
			}
		}, function(e) {
			//Ti.API.log(e);
			d_id = e.duels[0].id;
			registerDueler(d_id);
			Ti.App.fireEvent("app:newduel", {
				theme : theme,
				duelURL : duelURL,
				newDuelId : d_id
			})
			alert("Novo duelo criado! Agora é só esperar um desafiante...");
		});
		Ti.API.log("??");
	}

	// Associa usuário a um duelo
	function registerDueler(d_id) {
		key = 'myduels_' + currentUserId;
		value = d_id + ',';
		Ti.API.log('key: ' + key);
		Cloud.KeyValues.append({
			name : key,
			value : value
		}, function(e) {
			if (e.error && e.code == 400) {
				Cloud.KeyValues.set({
					name : key,
					value : value
				}, function(e) {
				});
			}
		});
	}

}

module.exports = NewDuelWindow; 