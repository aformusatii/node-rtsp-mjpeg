const child_process = require('child_process');
const EventEmitter = require('events');

// Start of Image
const START_BYTES = Buffer.from([0xff, 0xd8]);

// End of Image
const END_BYTES = Buffer.from([0xff, 0xd9]);

class StreamHandler extends EventEmitter {

    constructor() {
        super();
        this._initOptions();
        this.buffer = Buffer.alloc(0);
    }

    _initOptions() {
        this.ffmpegPath = 'ffmpeg';
        const url = '...';
        this.spawnOptions = [
            //"-rtsp_transport", "tcp",
            '-i', url,
            '-q', '1',
            '-f', 'mjpeg',
            '-an',
            '-'
        ];
    }

    start() {
        this._startFFmpeg();
    }

    onData(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
        this._processBufferRecursively();
    }

    _processBufferRecursively() {
        const indexOfStart = this.buffer.indexOf(START_BYTES);
        const indexOfEnd = this.buffer.indexOf(END_BYTES);

        if (indexOfStart > -1 && indexOfEnd > -1) {
            const sliceStart = indexOfStart;
            const sliceEnd = indexOfEnd + END_BYTES.length;

            const frameBuffer = this.buffer.slice(sliceStart, sliceEnd);
            this._processFrame(frameBuffer);

            this.buffer = this.buffer.slice(sliceEnd);

            // recursively process all frames from the buffer
            this._processBufferRecursively();
        }
    }

    _processFrame(frameBuffer) {
        this.emit('frame', frameBuffer);
    }

    _startFFmpeg() {
        this.stream = child_process.spawn(
            this.ffmpegPath,
            this.spawnOptions,
            {detached: false});

        this.stream.stdout.on('data', (data) => {
            this.onData(data);
        });

        this.stream.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        this.stream.on('exit', (code, signal) => {
            if (code === 1) {
                console.error('RTSP stream exited with error');
            } else {
                console.error('RTSP stream exited');
            }
        });
    }

    stop() {
        this.stream.stdout.removeAllListeners();
        this.stream.stderr.removeAllListeners();
        this.stream.kill();
        this.stream = undefined;
    }

}

/*

const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const test = async function() {
    const stream = new StreamHandler();
    console.log('START')
    stream.start();

    await sleep(3000);

    console.log('STOP')
    stream.stop();
}

test(); */

module.exports = StreamHandler
