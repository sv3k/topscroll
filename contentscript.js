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
	if (document.getElementsByTagName("body")[0].scrollTop === 0) {
		document.getElementsByTagName("body")[0].scrollTop = window.last_scroll_position;
		window.last_scroll_position = 0;
	} else {
		window.last_scroll_position = window.pageYOffset;
        document.getElementsByTagName("body")[0].scrollTop = 0;
	}
}

injectDiv();