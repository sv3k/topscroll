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

		findTarget: () => {
			// Let's define target DOM element for scrolling
			if (window.innerHeight === document.documentElement.scrollHeight) {
				// Workaround for unscrollable root element, see #2
				topScroll.target = {
					div: topScroll.target.findBiggestDiv(),
					getPosition: () => {
						return this.div.scrollTop;
					},
					getBottomPosition: () => {
						return this.div.scrollHeight - this.div.clientHeight;
					},
					setPosition: y => {
						this.div.scrollTop = y;
					}
				};
			} else {
				topScroll.target = {
					getPosition: () => {
						return window.pageYOffset;
					},
					getBottomPosition: () => {
						return document.documentElement.scrollHeight - window.innerHeight;
					},
					setPosition: y => {
						window.scrollTo(window.pageXOffset, y);
					}
				};
			}
		},

		findBiggestDiv: () => {
			var items = document.getElementsByTagName('div');
			var biggest = { scrollHeight: 0 };
			for (var i = 0; i < items.length; i++) {
			    if (items[i].scrollHeight > biggest.scrollHeight) {
			    	biggest = items[i];
			    }
			}
			return biggest;
		},

		getPosition: () => {
			topScroll.target.findTarget();
			return topScroll.target.getPosition();
		},

		getBottomPosition: () => {
			topScroll.target.findTarget();
			return topScroll.target.getBottomPosition();
		},

		setPosition: y => {
			topScroll.target.findTarget();
			topScroll.target.setPosition(y);
		}
	}
};

topScroll.inject();
