function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var DuelWindow = require('ui/handheld/DuelWindow'),
		win2 = new Window(L('ot_duel')),
		win3 = new Window(L('account')),
		win4 = new Window(L('ranking'));
	
	var duelWindow = new DuelWindow(L('DUELO'));
	
	var tab1 = Ti.UI.createTab({
		title: L('my_duel'),
		icon: '/images/KS_nav_ui.png',
		window: duelWindow
	});
	duelWindow.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('ot_duel'),
		icon: '/images/KS_nav_ui.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: L('account'),
		icon: '/images/KS_nav_ui.png',
		window: win3
	});
	win3.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: L('ranking'),
		icon: '/images/KS_nav_views.png',
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
