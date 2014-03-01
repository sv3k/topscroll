function injectDiv() 
{ 
	var body = document.getElementsByTagName('body')[0];
	var div = document.createElement('div');

	var barId = document.createAttribute("id");
	barId.value="topscroll-chrome-extension-bar";
	div.setAttributeNode(barId);
	div.onclick = topScroll; 
	
	body.appendChild(div);
}
	
function topScroll()
{
	if (window.pageYOffset === 0) {
		window.scrollTo(window.pageXOffset, window.lastScrollPosition);
		window.lastScrollPosition = 0;
	} else {
		window.lastScrollPosition = window.pageYOffset;
		window.scrollTo(window.pageXOffset, 0);
	}
}
 	
injectDiv();