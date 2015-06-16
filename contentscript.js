function injectDiv() 
{ 
	var body = document.getElementsByTagName('body')[0];
	var div = document.createElement('div');

	var barId = document.createAttribute("id");
	barId.value="topscroll-chrome-extension-bar";
	div.setAttributeNode(barId);
	div.onclick = topScroll;
	div.oncontextmenu = bottomScroll;
	
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

function bottomScroll()
{
	var height = document.body.clientHeight - window.innerHeight;
	if (window.pageYOffset === height) {
		window.scrollTo(window.pageXOffset, window.lastScrollPosition);
		window.lastScrollPosition = height;
	} else {
		window.lastScrollPosition = window.pageYOffset;
		window.scrollTo(window.pageXOffset, height);
	}
	return false; // Prevent context menu appearing
}
 	
injectDiv();