const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg'
};

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((request, response) => {
    // getting file name from url
    let myUri = url.parse(request.url).pathname

    // getting absolute path
    let filename = path.join(process.cwd() + '/public/', unescape(myUri))
    console.log(`File looking for is ${filename}`);

    let loadFile;

    try{
        loadFile = fs.lstatSync(filename)
    } catch (error){
        response.statusCode = 404;
        response.setHeader = {'Content-Type': 'text/plain'};
        response.write('404 page not found');
        response.end();
        return
    }

    if (loadFile.isFile()) {
        let mimeType = mimeTypes[path.extname(filename).split('.').reverse()[0]]
        response.statusCode = 200;
        response.setHeader = {'Content-Type': mimeType};

        let filestream = fs.createReadStream(filename)
        filestream.pipe(response)
    } else if (loadFile.isDirectory()){
        response.statusCode = 302;
        response.setHeader = {'Location': 'index.html'};
        response.end();
    } else {
        response.statusCode = 500;
        response.setHeader = {'Content-Type': 'text/plain'};
        response.write('500 Internal Error');
        response.end();
    }
}).listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
})
