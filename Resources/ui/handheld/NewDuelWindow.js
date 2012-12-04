//
// Janela de novo duelo
//
function NewDuelWindow(title) {
	var newWin = Ti.UI.createWindow({
		title : title,
		backButtonTitle : L('back'),
		backgroundColor : 'white',
		barColor : '#101010'
	});

	var label = Ti.UI.createLabel({
		text : L('choose_theme'),
		font : {
			fontSize : 18
		},
		height : 'auto',
		top : 10,
		left : 5
	});
	newWin.add(label);

	var theme = null;

	var butT1 = Titanium.UI.createButton({
		title : 'Lugares',
		color : '#888',
		height : 40,
		width : 125,
		top : 40,
		left : 30,
		id : 't1'
	});
	newWin.add(butT1);

	var butT2 = Titanium.UI.createButton({
		title : 'Pessoas',
		color : '#888',
		height : 40,
		width : 125,
		top : 40,
		right : 30,
		id : 't2'
	});
	newWin.add(butT2);

	var butT3 = Titanium.UI.createButton({
		title : 'Animais',
		color : '#888',
		height : 40,
		width : 125,
		top : 90,
		left : 30,
		id : 't3'
	});
	newWin.add(butT3);

	var butT4 = Titanium.UI.createButton({
		title : 'Flores',
		color : '#888',
		height : 40,
		width : 125,
		top : 90,
		right : 30,
		id : 't4'
	});
	newWin.add(butT4);

	butT1.addEventListener('click', chooseTheme);
	butT2.addEventListener('click', chooseTheme);
	butT3.addEventListener('click', chooseTheme);
	butT4.addEventListener('click', chooseTheme);

	function chooseTheme(e) {
		var button = e.source;
		butT1.color = '#888';
		butT2.color = '#888';
		butT3.color = '#888';
		butT4.color = '#888';
		button.color = '#FFA03C';
		theme = button.title;
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
		top : 160,
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
		top : 230,
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
			Cloud.Photos.create({
				photo : duelPhoto,
				'photo_sizes[duel]': '150x150#',
				'photo_sync_sizes[]': 'duel'
			}, function(e) {
				if (e.success) {
					var p_id = e.photos[0].id;
					saveDuel(theme, p_id, duelPhoto, newWin);
					newWin.close();					
				} else {
					alert("Erro ao gravar foto: " + e.error);
				}
			});

		}
	});

	return newWin;
}

//
// Grava um novo duelo ou coloca esse como desafiante em duelo já existente
//
function saveDuel(theme, p_id, newWin) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;

	var currentUserId = Ti.App.Properties.getString('currentUserId');

	// TODO: tenta encontrar duelo em aberto com o mesmo tema
	Ti.API.log("Aqui");

	// TODO: Verifica se, realmente, ele ficou gravado como o duelista (problema de operação não atomica)

	//
	// Grava um novo duelo
	//
	// TODO: Precisa mesmo essa estrutura ACL ou pode ter uma ACL única (ou única por usuário)?
	Cloud.ACLs.create({
		name : 'd_'+p_id,
		public_read : true,
		public_write : true,
		writer_ids: currentUserId
	}, function(e) {
		if (e.success) {
			var a_id = e.acls[0].id;
			Ti.API.log("acl_id: " + a_id);
			Cloud.Objects.create({
				classname: 'duels',
				acl_id: a_id, 
				fields: {
					theme: theme,
					"[ACS_Photo]photo1_id" : p_id,
					"[ACS_Photo]photos_ids" : [p_id]
				}
			}, function (e) {
				//Ti.API.log(e);
				Ti.App.fireEvent("app:newduel",{})
				alert("Novo duelo criado! Agora é só esperar um desafiante...");
			});
		} else {
			alert("Erro ao gravar duelo: " + e.error);
		}
	});
	Ti.API.log("??");
}

module.exports = NewDuelWindow;