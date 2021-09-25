// Start of Image
const START_BYTES = Buffer.from([0xff, 0xd8]);

// End of Image
const END_BYTES = Buffer.from([0xff, 0xd9]);

let buffer = Buffer.from([0xff, 0xd8, 0x10, 0x11, 0xff, 0xd9, 0xff, 0xd8, 0x12, 0x13]);

const indexOfStart = buffer.indexOf(START_BYTES);
const indexOfEnd = buffer.indexOf(END_BYTES);

const sliceStart = indexOfStart;
const sliceEnd = indexOfEnd + END_BYTES.length;
const frameBuffer = buffer.slice(sliceStart, sliceEnd);

console.log(frameBuffer);

buffer = buffer.slice(sliceEnd);

console.log(buffer);


