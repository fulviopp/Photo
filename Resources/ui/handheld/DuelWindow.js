function DuelWindow(title) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		barColor : '#101010',
		title: ''
	});

	var scrollView = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true,
		height : '100%',
		width : '100%'
	});

	var view = Ti.UI.createView({
		top : 0,
		backgroundColor : 'white',
		height : 1000,
		width : '100%'
	});
	
	var buttonMore = Ti.UI.createButton({
		height : 34,
		width : 200,
		title : L('more'),
		top : 950
	});
	view.add(buttonMore);
	
	buttonMore.addEventListener('click', function() {
		view.height = view.height + 1000;
		buttonMore.top = buttonMore.top + 1000; 		
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
		labels:[L('newDuel')],
		backgroundColor:'#FFA03C'
	});	
	self.setRightNavButton(newDuelButton);	
		
	
	newDuelButton.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title : L('newDuel'),
			backButtonTitle: L('back'),
			backgroundColor : 'white',
			barColor : '#101010'
		}));
	});

	scrollView.add(view);
	self.add(scrollView);
	return self;
};

module.exports = DuelWindow;

