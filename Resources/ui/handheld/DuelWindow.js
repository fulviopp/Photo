function DuelWindow(title,showMine) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		barColor : '#101010',
		title : ''
	});

	//
	// NAVBAR
	//
	// var bb1 = Titanium.UI.createButtonBar({
	// labels:[' Finalizados '],
	// backgroundColor:'#000'
	// });
	// self.setLeftNavButton(bb1);

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

	//scrollView.add(view);
	//self.add(scrollView);

	//
	// Exibe duelos
	//
	var data = [];
	var tableview = Titanium.UI.createTableView({
		data : data,
		style : Titanium.UI.iPhone.TableViewStyle.PLAIN,
		backgroundColor : 'transparent',
		maxRowHeight : 200,
		minRowHeight : 200,
		separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE
	});

	tableview.addEventListener('click', function(e) {
		Ti.API.info("clicked on table view = " + e.source);
	});

	self.add(tableview);
	
	getData(showMine,1,tableview, data); // Obtém dados
	
	// Atualiza tabela quando um novo evento é criado
	Ti.App.addEventListener("app:newduel",function(e) {
		getData(showMine,1,tableview,data);
		Ti.API.info("ATUALIZANDO TABELA COM NOVO DUELO");
	});
	
	// tableview.addEventListener('scroll', function(e) {
		// Ti.API.log('tab scroll');
		// Ti.API.log(e);
	// });

	var lastPage = 1;
	tableview.addEventListener('scrollEnd', function(e) {
		Ti.API.log('tab scrollEnd');
		Ti.API.log(e);
//		if ((e.contentOffset.y + e.size.height) > (e.contentSize.height - 10)) {
		var tmpPage = Math.round( e.contentSize.height  / (e.contentOffset.y + e.size.height + 50) ) + 1;
		if ( tmpPage > lastPage) { 
			lastPage = tmpPage;
			Ti.API.log('Precisa ler mais página... ' + lastPage);			
			getData(showMine,lastPage,tableview,tableview.data);
		}		
	});
		
	return self;
};

//
// Obtem dados dos duelos
//
function getData(showMine,page,tableview, data) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	
	if (page==1) {
		data = [];
	}
	
	var currentUserId = Ti.App.Properties.getString('currentUserId');

	var where_cl;
	if (showMine) {
		where_cl = '{"user_id":{"$in":["'+currentUserId+'"]}}';
	} else {
		where_cl = '{"user_id":{"$nin":["'+currentUserId+'"]}}';
	}

	Cloud.Objects.query({
		classname : 'duels',
		page : page,
		per_page : 2,
		where : where_cl
	}, function(e) {
		//Ti.API.log(e);
		Ti.API.log('Iniciando');
		for (var c = 0; c < e.duels.length; c++) {
			duel = e.duels[c];
						
			var row = Ti.UI.createTableViewRow();

			var label = Ti.UI.createLabel({
				text : 'Tema: ' + duel.theme,
				textAlign : 'left',
				top : 12,
				left : 5,
				width : 'auto',
				height : 'auto',
				font : {
					fontWeight : 'bold',
					fontSize : 18
				}
			});
			// if (Titanium.Platform.name == 'android') {
				// label.top = 10;
			// }
			row.add(label);
			
			var imgURL = duel["[ACS_Photo]photo1_id"][0].urls.duel;
			
			Ti.API.log(imgURL);
			var img = Ti.UI.createImageView({
				top : 35,
				left : 10,
				image: imgURL,
			});
			// if (Titanium.Platform.name == 'android') {
				// label.top = 10;
			// }
			row.add(img);
			
			label.addEventListener('click', function(e) {
				Ti.API.info("clicked on label " + e.source);
			});

			data.push(row);
			Ti.API.log("linha: " + c);
		}
		tableview.data = data;
		Ti.API.log("atualizando tabela com:");
		Ti.API.log(JSON.stringify(tableview.data));
		tableview.scrollToIndex(tableview.data[0].rows.length);
	});	
}



module.exports = DuelWindow;

