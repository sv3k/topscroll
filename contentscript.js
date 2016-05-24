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
			topScroll.scrollTo(topScroll.lastScrollPosition);
			topScroll.lastScrollPosition = 0;
		} else {
			topScroll.lastScrollPosition = window.pageYOffset;
			topScroll.scrollTo(0);
		}
	},

	scrollDown: function() {
		var bottomOffset = document.documentElement.scrollHeight - window.innerHeight;
		if (window.pageYOffset === bottomOffset) {
			topScroll.scrollTo(topScroll.lastScrollPosition);
			topScroll.lastScrollPosition = bottomOffset;
		} else {
			topScroll.lastScrollPosition = window.pageYOffset;
			topScroll.scrollTo(bottomOffset);
		}
		return false; // Prevent context menu appearing
	},

	scrollTo: function(endY) {
		var duration = 150;
		var startY = window.scrollY;
		var distance = Math.max(endY,0) - startY;
		var startTime = new Date().getTime();
		(function loopScroll() {
			setTimeout(function () {
				var p = Math.min((new Date().getTime() - startTime) / duration, 1); // Progress 0→1
				var y = Math.max(Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)), 0);
				window.scrollTo(window.pageXOffset, y);
				if (p < 1) {
					loopScroll();
				}
			}, 1)
		})();
	}
};

topScroll.injectDiv();
