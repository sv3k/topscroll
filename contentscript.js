topScroll = {

	injectDiv: function() {
		var body = document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		var barId = document.createAttribute('id');
		barId.value = "topscroll-chrome-extension-bar";
		div.setAttributeNode(barId);
		div.onclick = topScroll.scrollUp;
		div.oncontextmenu = topScroll.scrollDown;
		body.appendChild(div);
	},

	scrollUp: function() {
		if (topScroll.target.getPosition() === 0) {
			topScroll.scrollTo(topScroll.lastPosition);
			topScroll.lastPosition = 0;
		} else {
			topScroll.lastPosition = topScroll.target.getPosition();
			topScroll.scrollTo(0);
		}
	},

	scrollDown: function() {
		var bottomPosition = topScroll.target.getBottomPosition();
		if (topScroll.target.getPosition() === bottomPosition) {
			topScroll.scrollTo(topScroll.lastPosition);
			topScroll.lastPosition = bottomPosition;
		} else {
			topScroll.lastPosition = topScroll.target.getPosition();
			topScroll.scrollTo(bottomPosition);
		}
		return false; // Prevent context menu appearing
	},

	scrollTo: function(endY) {
		var duration = 150;
		var startY = topScroll.target.getPosition();
		var distance = Math.max(endY,0) - startY;
		var startTime = new Date().getTime();
		(function smoothScroll() {
			setTimeout(function () {
				var p = Math.min((new Date().getTime() - startTime) / duration, 1); // Progress 0→1
				var y = Math.max(Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)), 0);
				topScroll.target.setPosition(y);
				if (p < 1) {
					smoothScroll();
				}
			}, 1)
		})();
	},

	target: { // Undefined target state by default

		findTarget: function() {
			// Let's define target DOM element for scrolling
			if (window.innerHeight === document.documentElement.scrollHeight) {
				// Workaround for unscrollable root element, see #2
				topScroll.target = {
					div: topScroll.target.findBiggestDiv(),
					getPosition: function() {
						return this.div.scrollTop;
					},
					getBottomPosition: function() {
						return this.div.scrollHeight - this.div.clientHeight;
					},
					setPosition: function(y) {
						this.div.scrollTop = y;
					}
				};
			} else {
				topScroll.target = {
					getPosition: function() {
						return window.pageYOffset;
					},
					getBottomPosition: function() {
						return document.documentElement.scrollHeight - window.innerHeight;
					},
					setPosition: function(y) {
						window.scrollTo(window.pageXOffset, y);
					}
				};
			}
		},

		findBiggestDiv: function() {
			var items = document.getElementsByTagName('div');
			var biggest = { scrollHeight: 0 };
			for (var i = 0; i < items.length; i++) {
			    if (items[i].scrollHeight > biggest.scrollHeight) {
			    	biggest = items[i];
			    }
			}
			return biggest;
		},

		getPosition: function() {
			topScroll.target.findTarget();
			return topScroll.target.getPosition();
		},

		getBottomPosition: function() {
			topScroll.target.findTarget();
			return topScroll.target.getBottomPosition();
		},

		setPosition: function(y) {
			topScroll.target.findTarget();
			topScroll.target.setPosition(y);
		}
	}
};

topScroll.injectDiv();
