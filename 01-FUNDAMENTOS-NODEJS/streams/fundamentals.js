// process.stdin
//     .pipe(process.stdout);

import { Readable, Writable, Transform } from 'node:stream';

class MultyplyByTenStream extends Writable {
    _write(chunk, encoding, callback) {
        console.log(Number(chunk.toString()) * 10);
        callback();
    }
}

new OneToHundredStream().pipe(new InverseNumberStream()).pipe(new MultyplyByTenStream());