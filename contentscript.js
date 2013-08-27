function topScroll(event)
{
	if (event.clientX != 0) {
		return;
	}

	if (window.pageYOffset === 0) {
		window.scrollTo(window.pageXOffset, window.last_scroll_position);
		window.last_scroll_position = 0;
	} else {
		window.last_scroll_position = window.pageYOffset;
		window.scrollTo(window.pageXOffset, 0);
	}
}

document.onclick = topScroll;