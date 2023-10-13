function memcpy(src: Uint8Array, size_n: number): Uint8Array {
  return new Uint8Array(src.buffer.slice(src.byteOffset,size_n));
}

function seek(input: Uint8Array, byteLength: number): Uint8Array {
  return new Uint8Array(input.buffer,input.byteOffset + byteLength,input.byteLength - byteLength);
}

//the max "amount" here is 0xffff which is only 2^16 - 1 so it won't over flow (0xff < 8) | 0xff
export function hasOverFlow(bytesRead: number, size: number, amount: number): number {
    if (bytesRead + amount > size) {
        console.log("Tried to read past buffer when decompressing buffer with xmem\n");
        return 1;
    }
    return 0;
}
export function XDecompress(input: Uint8Array, output: Uint8Array, sizeIn: bigint, sizeOut: bigint): number {
    const dst = new Uint8Array(0x8000);
    let src = new Uint8Array(0x8000);
    // if (src === null || dst === null) {
    //     console.log("Out of memory, could not allocate 2 * 32768 bytes for buffer, exiting\n");
    //     if (src != null)
    //     {
    //         free(src);
    //     }
    //     if (dst != null) {
    //         free(dst);
    //     }
    //     return 0;
    // }
    let outputPointer: Uint8Array = output;
    const strm: lzx_state = lzx_init(17);
    // if (!strm) {
    //     console.log("Failed to initialize lzx decompressor, exiting\n");
    //     if (src != null)
    //     {
    //         free(src);
    //     }
    //     if (dst != null) {
    //         free(dst);
    //     }
    //     return 0;
    // }
    let wasLargerThan0x8000 = 0;
    let bytes = 0;
    let bytesRead = 0;
    while (bytes < sizeOut) {
        if (hasOverFlow(bytesRead, Number(sizeIn), 1)) { throw "goto ERROR"; }
        let src_size: number, dst_size: number, hi: number, lo: number;
        hi = input[0]!;
        input = seek(input,1);
        if (hi === 0xFF) {
            if (hasOverFlow(bytesRead, Number(sizeIn), 4)) { throw "goto ERROR"; }
            hi = input[0]!;
            input = seek(input,1);
            lo = input[0]!;
            input = seek(input,1);
            dst_size = (hi << 8) | lo;
            if (dst_size > 0x8000)
            {
                console.log("Invalid data, exiting\n");
                bytes = 0;
                break;
            }
            hi = input[0]!;
            input = seek(input,1);
            lo = input[0]!;
            input = seek(input,1);
            src_size = (hi << 8) | lo;
        }
        else {
            if (hasOverFlow(bytesRead, Number(sizeIn), 1)) { throw "goto ERROR"; }
            dst_size = 0x8000;

            lo = input[0]!;
            input = seek(input,1);
            src_size = (hi << 8) | lo;
        }

        if (src_size === 0 || dst_size === 0) {
            //no need to output this
            //console.log("EOF\n");
            break;
        }
        if (wasLargerThan0x8000 && src_size <= 0x8000)
        {
            wasLargerThan0x8000 = 0;
            // free(src);
            src = new Uint8Array(0x8000);
            // if (src === null) {
            //     console.log("Out of memory, could not allocate 32768 bytes for buffer, exiting\n");
            //     bytes = 0;
            //     throw "goto ERROR";
            // }
        }
        if (src_size > 0x8000)//the compressed size if rarely larger than the decompressed size
        {
            wasLargerThan0x8000 = 1;
            // free(src);
            src = new Uint8Array(src_size);
            // if (src === null) {
            //     console.log("Out of memory, could not allocate %d bytes for buffer, exiting\n", src_size);
            //     bytes = 0;
            //     throw "goto ERROR";
            // }
        }
        if (hasOverFlow(bytesRead, Number(sizeIn), src_size)) { throw "goto ERROR"; }
        src = memcpy(input, src_size);
        input = seek(input,src_size);
        const error = lzx_decompress(strm, src, dst, src_size, dst_size);
        if (error === 0) {
            outputPointer = memcpy(dst, dst_size);
            outputPointer = seek(outputPointer,dst_size);
            bytes += dst_size;
        }
        else {
            console.log("Error decompressing, exiting\n");
            bytes = 0;
            break;
        }
    }
// ERROR:
//     if (src != null)
//     {
//         free(src);
//     }
//     if (dst != null) {
//         free(dst);
//     }
    lzx_teardown(strm);
    return bytes;
}