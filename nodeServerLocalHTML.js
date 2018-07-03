
var FILE_HTML;
var arg = process.argv[2];
if(!arg){
	FILE_HTML = './spaceShipZZ.htm';
}else{
	FILE_HTML = arg;
}
const PORT = 8000;

/** Node.js const **/
const http = 	require('http');
const fs = 	require('fs');
//const PNG = 	require('pngjs').PNG;



/** inner functions **/
function getExtension(url){
	var parts = url.split('.');
	var extension = parts[parts.length-1];
	return extension;
};
//https://github.com/broofa/node-mime/blob/master/src/test.js
http.createServer(function(req,res){
	var url = req.url.replace(/^\/$/,'\/index.html');// '/'->'/index.html'
	var extension = getExtension(url);
	console.log("extension=",extension,"url=",url);
	var content;
	switch(extension){
		case 'html':
		case 'htm':
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
			content = fs.readFileSync(FILE_HTML,'UTF-8');
			res.write(content);
			res.end();
			break;
		case 'ico':
			res.writeHead(200);
			res.end();
			break;
		case 'js':
			res.writeHead(200,{'Content-Type':'text/javascritpt'});
			content = fs.readFileSync('.'+url,'UTF-8');
			res.write(content);
			res.end();
			break;
		case 'png':
			content = fs.readFileSync('.'+url);
			//content = PNG.sync.read(content);//https://www.npmjs.com/package/pngjs#sync-api
			//content = JSON.stringify(content);
			res.writeHead(200,{'Content-Type':'image/png'});
			res.write(content);
			res.end();
			break;
		case 'css':
			res.writeHead(200,{'Content-Type':'text/css'});
			content = fs.readFileSync('.'+url,'UTF-8');
			res.write(content);
			res.end();
			break;
		default:
			console.log("Can't treat "+extension+" extension.");
	}
}).listen(PORT,'127.0.0.1');



