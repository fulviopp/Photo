var navActInd = Titanium.UI.createActivityIndicator();
var duelList = null;
var Cloud = require('ti.cloud');
var pd_srv = require('pd_srv');

function DuelWindow(title, showMine) {
	var self = Ti.UI.createWindow({
		backgroundColor : '#DDD',
		barColor : '#101010',
		title : '',
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
	self.add(linearGradient);

	Cloud.debug = true;

	self.setLeftNavButton(navActInd);

	var newDuelButton = Titanium.UI.createButtonBar({
		labels : [L('new_duel')],
		backgroundColor : '#FFA03C'
	});
	self.setRightNavButton(newDuelButton);

	newDuelButton.addEventListener('click', function() {
		var NewDuelWindow = require('ui/handheld/NewDuelWindow')
		newDuelWindow = new NewDuelWindow(L('new_duel'));
		self.containingTab.open(newDuelWindow);
	});

	//
	// Exibe duelos
	//
	var data = [];
	var tableView = Titanium.UI.createTableView({
		data : data,
		style : Titanium.UI.iPhone.TableViewStyle.PLAIN,
		backgroundColor : 'transparent',
		maxRowHeight : 210,
		minRowHeight : 210,
		separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE
	});

	self.add(tableView);

	// Obtém dados
	getDuelList(showMine, 1, tableView, data);

	// Atualiza tabela quando um novo evento é criado
	Ti.App.addEventListener("app:newduel", function(e) {
		if (showMine) {
			//			showNewDuel(tableView, e.theme, e.duelURL);
			if (duelList.length > 0) {
				duelList += ',';
			}
			duelList += e.newDuelId;
			lastPage = 1;
			getData(showMine, 1, tableView, data);
			Ti.API.info("ATUALIZANDO TABELA COM NOVO DUELO");
		}
	});

	var lastPage = 1;
	tableView.addEventListener('scrollEnd', function(e) {
		//		if ((e.contentOffset.y + e.size.height) > (e.contentSize.height - 10)) {
		var tmpPage = Math.round(e.contentSize.height / (e.contentOffset.y + e.size.height + 50)) + 1;
		if (tmpPage > lastPage) {
			lastPage = tmpPage;
			Ti.API.log('Precisa ler mais página... ' + lastPage);
			getData(showMine, lastPage, tableView, tableView.data);
		}
	});

	return self;
};

//
// Obtém a lista de duelos do usuário
//
function getDuelList(showMine, page, tableView, data) {
	Ti.API.log('getDuelList - entrando');
	var currentUserId = Ti.App.Properties.getString('currentUserId');
	var key = 'myduels_' + currentUserId;
	Cloud.KeyValues.get({
		name : key
	}, function(e) {
		if (e.success) {
			var list = e.keyvalues[0].value;
			duelList = list.substring(0, list.length - 1);
			getData(showMine, page, tableView, data)
		} else {
			Ti.API.log('getDuelList - error');
		}
	});
}

//
// Obtem dados dos duelos
//
function getData(showMine, page, tableView, data) {

	if (page == 1) {
		data = [];
	}

	navActInd.show();
	var currentUserId = Ti.App.Properties.getString('currentUserId');
	var dL = duelList.replace(/,/g, "\",\"");

	var where_cl;
	if (showMine) {
		where_cl = '{"_id":{"$in":["' + dL + '"]}}';
	} else {
		where_cl = '{"_id":{"$nin":["' + dL + '"]}}';
	}

	Ti.API.log("where clause: " + where_cl);

	Cloud.Objects.query({
		classname : 'duels',
		page : page,
		per_page : 2,
		//where : '{"$or":[{"user_id":"' + currentUserId + '"}]}'
		where : where_cl,
		order : '-created_at'
	}, function(e) {
		//Ti.API.log(e);
		for (var c = 0; c < e.duels.length; c++) {
			duel = e.duels[c];

			var row = Ti.UI.createTableViewRow({
				selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
			});

			var label = Ti.UI.createLabel({
				text : duel.theme,
				textAlign : 'left',
				top : 5,
				left : 5,
				width : 'auto',
				height : 'auto',
				color : '#333',
				font : {
					fontSize : 17,
					fontFamily : "STHeitiTC-Light"
				}
			});
			// if (Titanium.Platform.name == 'android') {
			// label.top = 10;
			// }
			row.add(label);

			var finished = duel.hasOwnProperty('winner');
			var voted = false;

			if (duel.hasOwnProperty('vote_user_id')) {
				voted = ( duel.vote_user_id.indexOf(currentUserId) > -1 );
			}

			putImage(1, row, duel["[ACS_Photo]photo1_id"][0].urls.duel);
			var photoVotes = 0;
			if (duel.hasOwnProperty('ratings_summary')) {
				if (duel.ratings_summary.hasOwnProperty('1'))
					photoVotes = duel.ratings_summary["1"];
			}
			putInfo(1, row, photoVotes, duel.id, finished, voted);

			if (duel.hasOwnProperty('[ACS_Photo]photo2_id')) {
				putImage(2, row, duel["[ACS_Photo]photo2_id"][0].urls.duel);
				photoVotes = 0;
				if (duel.hasOwnProperty('ratings_summary')) {
					if (duel.ratings_summary.hasOwnProperty('2'))
						photoVotes = duel.ratings_summary["2"];
				}
				putInfo(2, row, photoVotes, duel.id, finished, voted);
			}

			var imgOrn = Ti.UI.createImageView({
				top : 200,
				height : 20,
				width : 78,
				image : '/images/bk_orn.png',
				opacity : 0.8
			});
			row.add(imgOrn);

			data.push(row);
		}
		tableView.data = data;
		if (page > 1) {
			tableView.scrollToIndex((page * 2) - 2, {
				animated : true,
				position : Ti.UI.iPhone.TableViewScrollPosition.BOTTOM
			});
		}
		navActInd.hide();
	});

	function putImage(position, row, imgURL) {

		var lefPos = (position - 1) * 155 + 10;

		var imgBorder = Ti.UI.createImageView({
			top : 27,
			left : lefPos,
			width : 146,
			height : 162,
			backgroundColor : 'white',
			borderWidth : 1,
			borderColor : '#BBB',
			borderRadius : 4
		});
		row.add(imgBorder);

		Ti.API.log(imgURL);
		var img = Ti.UI.createImageView({
			top : 36,
			left : lefPos + 9,
			width : 128,
			height : 128,
			image : imgURL,
			borderWidth : 1,
			borderColor : '#DDD',
			borderRadius : 4
		});
		// if (Titanium.Platform.name == 'android') {
		// label.top = 10;
		// }
		row.add(img);
	}

	function putInfo(position, row, votes, d_id, finished, voted) {

		var lefPos = (position - 1) * 155 + 21;

		var label = Ti.UI.createLabel({
			text : votes + ' ' + L('votes'),
			textAlign : 'left',
			top : 170,
			left : lefPos,
			color : '#666',
			width: 55,
			font : {
				fontSize : 11,
				fontFamily : "STHeitiTC-Medium"
			}
		});

		if (votes == 1)
			label.text = L('one_vote');

		// if (Titanium.Platform.name == 'android') {
		// label.top = 10;
		// }
		row.add(label);

		if (showMine && !finished && !voted) {
			var butVote = Titanium.UI.createButton({
				_label : label,
				_row : row,
				_type : 'voteButton',
				title : '+1',
				textAlign : 'center',
				height : 16,
				width : 24,
				top : 168,
				left : lefPos + 55,
				d_id : d_id,
				backgroundColor : '#007236',
				color : '#ffffff',
				backgroundImage : 'none',
				borderRadius : 4,
				font : {
					fontSize : 12,
					fontFamily : "ArialRoundedMTBold"
				}
			});
			row.add(butVote);

			butVote.addEventListener('click', function(e) {

				var label_ref = e.source._label;
				var curRow = e.source._row;

				var alert = Titanium.UI.createAlertDialog({
					title : 'Voto',
					message : 'Confirmar voto?',
					buttonNames : ['Sim', 'Não'],
					d_id : e.source.d_id,
					photo_no : position
				});
				alert.show();

				alert.addEventListener('click', function(e_al) {
					alert = e_al.source;
					//Clicked cancel, first check is for iphone, second for android
					// if (e.cancel === e.index || e.cancel === true) {
					// return;
					// }

					switch (e_al.index) {
						case 0:
							Ti.API.log('Confirmar voto na foto: ' + alert.photo_no + ' do duelo: ' + alert.d_id);

							for (var i in row.children) {
								if (row.children[i]._type === 'voteButton') {
									row.children[i].hide();
								}
							}

							pd_srv.vote({
								duel_id : alert.d_id,
								option : alert.photo_no,
								user_id : Ti.App.Properties.getString('currentUserId')
							}, function(v) {
								if (v.status == 'ok') {
									var spl = label_ref.text.split(" ");
									var votes = parseInt(spl[0]) + 1;
									if (votes == 1) {
										label_ref.text = L('one_vote');
									} else {
										label_ref.text = votes + ' ' + L('votes');
									}

									// Ti.API.log(JSON.stringify(curRow));
									// curRow._button1.hide();
									// if (curRow.hasOwnProperty('_button2')) {
									// curRow._button2.hide();
									// }
								}
							});

							break;

						default:
							break;
					}
				});
			});
		}
	}

}

module.exports = DuelWindow;

