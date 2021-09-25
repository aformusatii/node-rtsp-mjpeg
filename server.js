const http = require('http');
const StreamHandler = require('./StreamHandler');

const stream = new StreamHandler();

stream.start();

const requestListener = function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=--jpgboundary'
    });

    stream.on('frame', (frameBuffer) => {
        res.write('--jpgboundary', 'utf-8');
        res.write('\r\n', 'utf-8');
        res.write('Content-type: image/jpeg', 'utf-8');
        res.write('\r\n', 'utf-8');
        res.write(`Content-length: ${frameBuffer.length}`, 'utf-8');
        res.write('\r\n', 'utf-8');
        res.write('\r\n', 'utf-8');
        res.write(frameBuffer);
    });

}

const server = http.createServer(requestListener);
server.listen(8440);
