function enableEdit()
{
	richTextField.document.designMode = 'on';
	load(getParameterByName('id'));
}

function changeStyle(sty)
{
	richTextField.document.execCommand(sty, false, null);
}

function changeStyle2(sty, some)
{
	richTextField.document.execCommand(sty, false, some);
}

function save(namex)
{
	var chart = new XMLHttpRequest();
	chart.open("POST", "php/saveHtml.php", true);
	chart.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	var htmltxt = richTextField.document.body.innerHTML;
	htmltxtEsc = escape(htmltxt);

	chart.send('i=' + htmltxtEsc + '&n=' + namex);
	console.log(htmltxtEsc);
}

function load(namey)
{
	if(namey == 'new')
	{
		createDocument();
	}
	else
	{
		var chart = new XMLHttpRequest();
		chart.open("POST", "php/loadHtml.php", true);
		chart.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		namez = namey + '.txt'
		chart.send('i=' + namez);

		console.log(namey + '.txt');

		chart.onreadystatechange = function()
	  	{
	  		if (chart.readyState == 4 && chart.status == 200)
	    	{
	    		//check = JSON.parse(chart.responseText);
	    		var xhttp = new XMLHttpRequest();
			    xhttp.open('GET', "http://localhost:3000/documents/" + namey, true);
			    xhttp.setRequestHeader("Content-type", "application/json");
			    xhttp.send();
			    xhttp.onreadystatechange = function() {
			    	if (this.readyState == 4 && this.status == 200) {
			    		var response = JSON.parse(xhttp.responseText);
			    		document.getElementById('docName').value = response.name;
			    		richTextField.document.body.innerHTML = chart.responseText;
			    	}
				}
	    	}
	  	}
  	}
}

function petition(method, id, body) {
    var xhttp = new XMLHttpRequest();
    xhttp.open(method, "http://localhost:3000/documents/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(xhttp.responseText);
    		console.log(response);
    		console.log(response._id);
    	}
	}
}

function createDocument(){
	var docName = document.getElementById('docName').value;
	if(docName == "")
	{
		docName = "untitled";
	}

	var data = { "name":docName, "author":"Anon"};
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/documents/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 201) {
    		var response = JSON.parse(xhttp.responseText);
    		idX = String(response._id)
    		document.getElementById('idDoc').value = idX;
    		save(idX);
    	}
	}
}

function saveDocument()
{
	var docName = document.getElementById('docName').value;
	if(docName == "")
	{
		docName = "untitled";
	}
	//console.log(docName);
	var xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", "http://localhost:3000/documents/" + getParameterByName('id'), true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send('[{"propName": "name", "value": "' + docName + '"}]');
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		console.log('done');
    		save(getParameterByName('id'));
    	}
	}
}

function openDocument(nameh)
{
	location.assign('editor.html?id=' + nameh);
	//console.log(nameh)
}

function returnMenu()
{
	location.assign('main.html');	
}

function cargarDocumentos()
{
	var xhttp = new XMLHttpRequest();
    xhttp.open('GET', "http://localhost:3000/documents");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(xhttp.responseText);
    		//console.log(response);
    		//console.log(response[0]._id);
    		//console.log(Object.keys(response).length);
    		
    		var listDocs = document.getElementById('documentsList');
    		for (var i = 0; i < Object.keys(response).length; i++) {
    			listDocs.innerHTML += "<div class='elem' id='" + response[i]._id + "' onclick='openDocument(this.id)'><h1>" + response[i].name + "</h1><h2>" + response[i].author + "</h2></div>";	
    		}
    		
    	}
	}
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}