function ApplicationWindow(title) {
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
	var button = Ti.UI.createButton({
		height : 34,
		width : 200,
		title : L('more'),
		top : 950
	});
	view.add(button);
	scrollView.add(view);
	self.add(scrollView);

	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title : L('newWindow'),
			backgroundColor : 'white',
			barColor : '#101010'
		}));
	});

	return self;
};

module.exports = ApplicationWindow;

