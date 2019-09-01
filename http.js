const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
	let f = path.join('./', req.url == "/" ? "index.html" : req.url);
	res.writeHead(200);

	console.log(f);
	try {
		if ( fs.existsSync(f) ) {
			res.write(fs.readFileSync(f));
		}
	} catch {
	}
	res.end();
}).listen(10000);
console.log('listen 10000');
