function topScroll(event)
{
	if (event.clientX != 0) {
		return;
	}

	if (window.pageYOffset === 0) {
		window.scrollTo(window.pageXOffset, window.lastScrollPosition);
		window.lastScrollPosition = 0;
	} else {
		window.lastScrollPosition = window.pageYOffset;
		window.scrollTo(window.pageXOffset, 0);
	}
}

document.onclick = topScroll;