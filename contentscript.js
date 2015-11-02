topScroll = {

	injectDiv: function() {
		var body = document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		var barId = document.createAttribute("id");
		barId.value = "topscroll-chrome-extension-bar";
		div.setAttributeNode(barId);
		div.onclick = topScroll.scrollUp;
		div.oncontextmenu = topScroll.scrollDown;
		body.appendChild(div);
	},

	scrollUp: function() {
		if (window.pageYOffset === 0) {
			window.scrollTo(window.pageXOffset, topScroll.lastScrollPosition);
			topScroll.lastScrollPosition = 0;
		} else {
			topScroll.lastScrollPosition = window.pageYOffset;
			window.scrollTo(window.pageXOffset, 0);
		}
	},

	scrollDown: function() {
		var height = document.body.clientHeight - window.innerHeight;
		if (window.pageYOffset === height) {
			window.scrollTo(window.pageXOffset, topScroll.lastScrollPosition);
			topScroll.lastScrollPosition = height;
		} else {
			topScroll.lastScrollPosition = window.pageYOffset;
			window.scrollTo(window.pageXOffset, height);
		}
		return false; // Prevent context menu appearing
	}
};
 	
topScroll.injectDiv();