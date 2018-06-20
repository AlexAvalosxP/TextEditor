user = localStorage.getItem('user');

function checkCredentials()
{
	if(user == null)
	{
		location.assign('index.php');
	}
	else
	{
		return true;
	}
}

function checkMain()
{
	if(checkCredentials()){
		cargarDocumentos();
	}
}

function checkEditor()
{
	if(checkCredentials())
	{
		enableEdit();
	}
}

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

	chart.send('i=' + htmltxtEsc + '&n=' + namex + '&r=' + convertHtmlToRtf(htmltxt));
	console.log(htmltxtEsc);
}

function load(namey)
{
	//if(namey == 'new')
	//{
	//	createDocument();
	//}
	//else
	//{
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
  	//}
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
	//var docName = document.getElementById('docName').value;
	//if(docName == "")
	//{
	//	docName = "untitled";
	//}

	var data = { "name":'untitled', "author": user};
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/documents/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 201) {
    		var response = JSON.parse(xhttp.responseText);
    		idX = String(response._id)
    		//document.getElementById('idDoc').value = idX;
    		//save(idX);
    		var chart = new XMLHttpRequest();
			chart.open("POST", "php/saveHtml.php", true);
			chart.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			var htmltxtEsc = "%3Cbr%3E%0A";
			//htmltxtEsc = escape(htmltxt);

			chart.send('i=' + htmltxtEsc + '&n=' + idX);
    		location.assign('editor.html?id=' + idX);
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
    		saveAnimation();
    		save(getParameterByName('id'));
    	}
	}
}

function openDocument(nameh)
{
	if (nameh == "new")
	{
		createDocument();
	}
	else
	{
		location.assign('editor.html?id=' + nameh);
		//console.log(nameh)
	}
}

function deleteDocument(namew)
{
	document.getElementById('comprb').innerHTML = "<div class='comprb'><h3>¿Eliminar este documento?</h3><button id='" + namew + "' onclick='realDelete(this.id)'>Si</button><button onclick='closeComprb()'>No</button></div>";
}

function realDelete(namev)
{
	var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/documents/" + namev, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		location.assign('main.html');	
    	}
	}
}

function closeComprb()
{
	document.getElementById('comprb').innerHTML = "";
}

function returnMenu()
{
	location.assign('main.html');	
}

function cargarDocumentos()
{
	document.getElementById('user').innerHTML = user;

	var xhttp = new XMLHttpRequest();
    xhttp.open('GET', "http://localhost:3000/documents/author/" + user);
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
    			listDocs.innerHTML += "<div class='elem' id='" + response[i]._id + "' onclick='openDocument(this.id)'><h1>" + response[i].name + "</h1><h2>" + response[i].author + "</h2></div><div class='btnElim' id='" + response[i]._id + "' onclick='deleteDocument(this.id)'><i class='fa fa-trash'></i></div>";	
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

function cerrarSes()
{
	localStorage.clear();
	location.assign('index.php');
}

function convertHtmlToRtf(html) {
  if (!(typeof html === "string" && html)) {
      return null;
  }

  var tmpRichText, hasHyperlinks;
  var richText = html;

  // Singleton tags
  richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");
  richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

  // Empty tags
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
  richText = richText.replace(/<(?:[^>]+)\/>/g, "");

  // Hyperlinks
  richText = richText.replace(
      /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
      "{{{\n");
  tmpRichText = richText;
  richText = richText.replace(
      /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
      "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
  hasHyperlinks = richText !== tmpRichText;
  richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
  richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

  // Start tags
  richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
  richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
  richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
  richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
  richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
  richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\n");

  // End tags
  richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
  richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

  // Strip any other remaining HTML tags [but leave their contents]
  richText = richText.replace(/<(?:[^>]+)>/g, "");

  // Prefix and suffix the rich text with the necessary syntax
  richText =
      "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +  "\n}";

  return richText;
}

function downloadFile()
{
	saveDocument();
	var docName2 = document.getElementById('docName').value;
	if(docName2 == "")
	{
		docName2 = "untitled";
	}
	location.assign('htmltodocx/sourceCode/htmltodocx/example.php?i=' + getParameterByName('id') + '&n=' + docName2);
}

function saveAnimation()
{
	document.getElementById("saveFeedB").innerHTML = "<div class='feedbackSave'>Guardado</div>";
	setTimeout(doHide, 1000);
}

function doHide(){
    document.getElementById("saveFeedB").innerHTML = "";
}
