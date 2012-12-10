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
    document.getElementsByTagName("body")[0].scrollTop = 0;
}

injectDiv();