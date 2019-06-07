topScroll = {

	smoothDuration: 150, // Milliseconds
	injectedId: 'topscroll-browser-extension-bar', // Id value for the injected div

	inject: () => {
		topScroll.remove(); // Cleanup
		chrome.storage.sync.get({ panelType: 1 }, options => {
			const body = document.getElementsByTagName('body')[0];
			if (!body) return;

			const div = document.createElement('div');
			div.id = topScroll.injectedId;
			div.className = topScroll.injectedId + '-' + options.panelType;
			div.onclick = topScroll.scrollUp;
			div.oncontextmenu = topScroll.scrollDown;
			body.appendChild(div);

			chrome.storage.onChanged.addListener(({ panelType }) =>
				div.className = topScroll.injectedId + '-' + panelType.newValue
			);
		});
	},

	remove: () => {
		const div = document.getElementById(topScroll.injectedId);
		if (div) {
			div.remove();
		}
	},

	scrollUp: () => {
		const currentPosition = topScroll.target.getPosition();
		if (currentPosition === 0) {
			topScroll.scrollTo(topScroll.lastPosition);
		} else {
			topScroll.lastPosition = currentPosition;
			topScroll.scrollTo(0);
		}
	},

	scrollDown: () => {
		const currentPosition = topScroll.target.getPosition();
		const bottomPosition = topScroll.target.getBottomPosition();
		if (currentPosition === bottomPosition) {
			topScroll.scrollTo(topScroll.lastPosition);
		} else {
			topScroll.lastPosition = currentPosition;
			topScroll.scrollTo(bottomPosition);
		}
		return false; // Prevent context menu appearing
	},

	scrollTo: endY => {
		const startY = topScroll.target.getPosition();
		const distance = endY - startY;
		const startTime = Date.now();
		(function smoothScroll() {
			setTimeout(() => {
				const progress = (Date.now() - startTime) / topScroll.smoothDuration; // Progress 0→1
				if (progress <= 1) {
					topScroll.target.setPosition(startY + distance * progress);
					smoothScroll();
				} else {
					topScroll.target.setPosition(startY + distance);
				}
			}, 1)
		})();
	},

	target: {
		// Undefined target node until first click to allow some time for page loading
		getPosition: () => topScroll.target.findTarget().getPosition(),
		getBottomPosition: () => topScroll.target.findTarget().getBottomPosition(),
		setPosition: y => topScroll.target.findTarget().setPosition(y),

		findTarget: () => {
			let newTarget; // Let's define target DOM element for scrolling
			if (window.innerHeight === document.documentElement.scrollHeight) {
				// Workaround for unscrollable root element, see #2
				topScroll.targetNode = topScroll.target.findTallestNode();
				newTarget = {
					getPosition: () => topScroll.targetNode.scrollTop,
					getBottomPosition: () => topScroll.targetNode.scrollHeight - topScroll.targetNode.clientHeight,
					setPosition: y => topScroll.targetNode.scrollTop = y
				};
			} else {
				newTarget = {
					getPosition: () => window.pageYOffset,
					getBottomPosition: () => document.documentElement.scrollHeight - window.innerHeight,
					setPosition: y => window.scrollTo(window.pageXOffset, y)
				};
			}
			return topScroll.target = newTarget;
		},

		findTallestNode: () => {
			const items = document.querySelectorAll('main,div');
			let tallest = { scrollHeight: 0 };
			for (let i = 0; i < items.length; i++) {
			    if (items[i].scrollHeight > tallest.scrollHeight) {
			    	tallest = items[i];
			    }
			}
			return tallest;
		}
	}
};

topScroll.inject();
