topScroll = {

	smoothDuration: 150, // Milliseconds
	injectedName: "topscroll-chrome-extension-bar", // Id value for the injected div

	inject: () => {
		topScroll.remove(); // Cleanup
		chrome.storage.sync.get({ panelType: 1 }, options => {
			var body = document.getElementsByTagName('body')[0];
			var div = document.createElement('div');
			div.id = topScroll.injectedName;
			div.className = topScroll.injectedName + '-' + options.panelType;
			div.onclick = topScroll.scrollUp;
			div.oncontextmenu = topScroll.scrollDown;
			body.appendChild(div);

			chrome.storage.onChanged.addListener(changes => {
				var change = changes['panelType'];
				if (change.oldValue != change.newValue) {
					div.className = topScroll.injectedName + '-' + change.newValue;
				}
			});
		});
	},

	remove: () => {
		var div = document.getElementById(topScroll.injectedName);
		if (div) {
			div.remove();
		}
	},

	scrollUp: () => {
		if (topScroll.target.getPosition() === 0) {
			topScroll.scrollTo(topScroll.lastPosition);
		} else {
			topScroll.lastPosition = topScroll.target.getPosition();
			topScroll.scrollTo(0);
		}
	},

	scrollDown: () => {
		var bottomPosition = topScroll.target.getBottomPosition();
		if (topScroll.target.getPosition() === bottomPosition) {
			topScroll.scrollTo(topScroll.lastPosition);
		} else {
			topScroll.lastPosition = topScroll.target.getPosition();
			topScroll.scrollTo(bottomPosition);
		}
		return false; // Prevent context menu appearing
	},

	scrollTo: endY => {
		var startY = topScroll.target.getPosition();
		var distance = endY - startY;
		var startTime = new Date().getTime();
		(function smoothScroll() {
			setTimeout(function () {
				var progress = (new Date().getTime() - startTime) / topScroll.smoothDuration; // Progress 0→1
				if (progress <= 1) {
					topScroll.target.setPosition(startY + distance * progress);
					smoothScroll();
				} else {
					topScroll.target.setPosition(startY + distance);
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
			var items = document.querySelectorAll('main,div');
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

topScroll.inject();
