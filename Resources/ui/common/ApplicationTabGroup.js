function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var DuelWindow = require('ui/handheld/DuelWindow'),
		win3 = new Window(L('account')),
		win4 = new Window(L('ranking'));
	
	var myDuelWindow = new DuelWindow(L('DUELO'),true);	
	var tab1 = Ti.UI.createTab({
		title: L('my_duel'),
		icon: '/images/nav_duel.png',
		window: myDuelWindow
	});
	myDuelWindow.containingTab = tab1;
	
	var otDuelWindow = new DuelWindow(L('DUELO'),false);	
	var tab2 = Ti.UI.createTab({
		title: L('ot_duel'),
		icon: '/images/nav_ot_duel.png',
		window: otDuelWindow
	});
	otDuelWindow.containingTab = tab2;	
		
	var tab3 = Ti.UI.createTab({
		title: L('account'),
		icon: '/images/nav_user.png',
		window: win3
	});
	win3.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: L('ranking'),
		icon: '/images/nav_rank.png',
		window: win4
	});
	win4.containingTab = tab4;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	
	return self;
};

module.exports = ApplicationTabGroup;
